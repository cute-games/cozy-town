#!/usr/bin/env python3
"""Build continuous 85 s Alley Cat masters and measure their accent timings."""
import array
import bisect
import json
import math
from pathlib import Path
from statistics import median
import subprocess
import sys

import analyze

REPO = Path(__file__).resolve().parents[3]
LAB = REPO / 'tools/dance-lab'
SOURCE = REPO / 'music-src/alley-cat-dumpster-divin.ogg'
RATE = 44100
SECONDS = 85
PREROLL = 1.5
HOP = .0025
# Short windows around the bent vocal-sample attacks in the original loop.
MEOWS = (1.29, 3.416, 10.83, 11.35, 13.54)
SPEEDS = {'steady': (1, 1, 1, 1, 1, 1), 'fast': (1, 1, 1.06, 1.12, 1.12, 1.12)}


def ffmpeg(*args, data=None):
    return subprocess.run(['ffmpeg', '-v', 'error', '-y', *args], input=data, check=True,
                          stdout=subprocess.PIPE).stdout


def floats(data):
    samples = array.array('f')
    samples.frombytes(data)
    if sys.byteorder != 'little':
        samples.byteswap()
    return samples


def stereo_bytes(samples):
    if sys.byteorder != 'little':
        samples = array.array('f', samples)
        samples.byteswap()
    return samples.tobytes()


def master(pcm, rates, out):
    loop_frames = len(pcm) // 2
    source = stereo_bytes(pcm)
    versions = {1: pcm}
    for speed in set(rates) - {1}:
        # Give the pitch-preserving stretch a full loop of context on either side.
        # Cutting out the middle cycle avoids the filter's start and drain ramps.
        count = round(loop_frames / speed)
        data = ffmpeg('-f', 'f32le', '-ac', '2', '-ar', str(RATE), '-i', 'pipe:0',
                      '-af', f'atempo={speed},atrim=start_sample={count}:end_sample={2 * count}',
                      '-f', 'f32le', 'pipe:1', data=source * 3)
        versions[speed] = floats(data)
        assert len(versions[speed]) == count * 2
    joined = array.array('f')
    cuts = []
    for speed in rates:
        part = versions[speed]
        start = len(joined) // 2
        left = SECONDS * RATE - start
        if left <= 0:
            break
        joined.extend(part[:left * 2])
        cuts.append([round(start / RATE, 6), round(len(joined) / 2 / RATE, 6), speed])
    # Smooth only a discontinuity in the decoded waveform at a join. The ramp
    # offsets the first few samples of the next loop without moving its attacks.
    seam = round(RATE * .004)
    for start, _, _ in cuts[1:]:
        edge = round(start * RATE) * 2
        for channel in (0, 1):
            jump = joined[edge + channel - 2] - joined[edge + channel]
            for i in range(min(seam, (len(joined) - edge) // 2)):
                joined[edge + i * 2 + channel] += jump * (1 - i / seam) ** 2
    fade = int(.035 * RATE) * 2
    for i in range(fade):
        joined[len(joined) - fade + i] *= (fade - i - 1) / fade
    peak = max(abs(x) for x in joined)
    if peak > .97:
        for i in range(len(joined)):
            joined[i] *= .97 / peak
    ffmpeg('-f', 'f32le', '-ac', '2', '-ar', str(RATE), '-i', 'pipe:0', '-codec:a', 'libmp3lame',
           '-b:a', '128k', '-write_xing', '1', '-map_metadata', '-1', str(out),
           data=bytes(round(RATE * PREROLL) * 8) + stereo_bytes(joined))
    return cuts


def attacks(path, verify=False):
    # Multiband rise, resolving attacks to 2.5 ms. A separate set of weights
    # and history is used for the alignment check.
    analyze.HOP = 20
    levels, _ = analyze.envelopes(analyze.read_audio(path))
    n = 4 if verify else 6
    weights = (.47, .72, .94, .78, .48) if verify else (.85, .84, .92, .96, .52)
    flux = [0.0] * len(levels)
    for i in range(n, len(levels)):
        flux[i] = sum(w * max(0, r - prev) for w, r, prev in zip(weights, levels[i], levels[i - n]))
    result = []
    for i in range(n, len(flux) - 12):
        value = flux[i]
        if value < (1.20 if verify else 1.73) or value < max(flux[max(n, i - 12):i + 13]):
            continue
        rise = i
        while rise > max(n, i - 11) and flux[rise - 1] >= value * (.22 if verify else .24):
            rise -= 1
        low = sum(max(0, levels[i][k] - levels[i - n][k]) for k in (0, 1))
        high = sum(max(0, levels[i][k] - levels[i - n][k]) for k in (2, 3, 4))
        kind = 'kick' if low > high * 1.3 else 'snare' if high > low * 1.3 and high > 2.0 else 'melody'
        result.append((round(rise * HOP, 4), value, kind))
    return result


def original_grid(path, length, found):
    analyze.HOP = 40
    levels, _ = analyze.envelopes(analyze.read_audio(path))
    lag = analyze.tempo_candidates(analyze.onset_curve(levels))[0]
    beats = round(length / (lag * analyze.STEP))
    period = length / beats
    # Zero is the phase of the prominent broadband downbeats. The other strong
    # peak near half a beat is the syncopated low-end hit, not the count-in.
    residuals = [(at + period / 2) % period - period / 2 for at, weight, kind in found
                 if weight >= 4.0 and kind != 'kick' and abs((at + period / 2) % period - period / 2) < .032]
    return beats, period, max(0, median(residuals))


def gapless_report(path):
    info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_packets', '-select_streams',
                                               'a:0', '-of', 'json', str(path)]))
    first, last = info['packets'][0], info['packets'][-1]
    delay = first['side_data_list'][0]['skip_samples']
    pad = last['side_data_list'][0]['discard_padding']
    decoded = ffmpeg('-i', str(path), '-ac', '2', '-ar', str(RATE), '-f', 's16le', 'pipe:1')
    seconds = len(decoded) / (4 * RATE)
    assert abs(seconds - SECONDS - PREROLL) < 1e-5
    print(f'{path.name}: stereo 128 kb/s, encoder delay {delay} samples, end padding {pad} samples, decoded {seconds:.3f} s')
    return [delay, pad]


def profile(out, cuts, base):
    found = attacks(out)
    times = [round(p[0] - PREROLL, 4) for p in found]
    data = []
    for start, end, speed in cuts:
        anchors = [start + p[0] / speed for p in base]
        group = {}
        for (at, power, kind), estimate in zip(base, anchors):
            if estimate < .55 or estimate > end - .04 or estimate > SECONDS - .46:
                continue
            i = bisect.bisect_left(times, estimate)
            at_out = min(times[max(0, i - 1):i + 1], key=lambda t: abs(t - estimate))
            if abs(at_out - estimate) > .057:
                continue
            if at_out not in group or group[at_out][1] < power:
                group[at_out] = [at_out, power, kind]
        data.extend([at, min(100, round(power * 9)), kind] for at, power, kind in sorted(group.values()))
    checked = [round(p[0] - PREROLL, 4) for p in attacks(out, verify=True)]
    errors = [min(abs(onset - at) for onset in checked) for at, _, __ in data]
    print(f'  {len(data)} accent choices, independent onset median {median(errors) * 1000:.1f} ms')
    return {'src': 'music/' + out.name, 'segments': cuts, 'accents': data,
            'verify': checked, 'gapless': gapless_report(out)}


def main():
    pcm = floats(ffmpeg('-i', str(SOURCE), '-ac', '2', '-ar', str(RATE), '-f', 'f32le', 'pipe:1'))
    length = len(pcm) / 2 / RATE
    hits = attacks(SOURCE)
    beats, period, offset = original_grid(SOURCE, length, hits)
    print(f'Original {length:.6f} s, {beats} beats, {60 / period:.5f} BPM, first downbeat {offset * 1000:.1f} ms')
    # Keep real attacks near a musical subdivision, plus the bent vocal attacks.
    base = []
    for at, strength, kind in hits:
        vocal = any(abs(at - window) < .057 for window in MEOWS)
        on_grid = abs((at - offset + period / 8) % (period / 4) - period / 8) < .051
        if on_grid or vocal:
            base.append((at, strength + (2 if vocal else 0), 'meow' if vocal else kind))
    print('Original accent candidates', {k: sum(p[2] == k for p in base) for k in ('kick', 'snare', 'melody', 'meow')})
    result = {'sourceLength': round(length, 6), 'bpm': round(60 / period, 6),
              'firstBeat': round(offset, 6), 'beats': beats, 'duration': SECONDS, 'preroll': PREROLL, 'profiles': {}}
    for label, speeds in SPEEDS.items():
        out = REPO / 'music' / f'alley-cat-round-{label}.mp3'
        result['profiles'][label] = profile(out, master(pcm, speeds, out), base)
    (LAB / 'alley-cat-loop.json').write_text(json.dumps(result, separators=(',', ':')) + '\n', encoding='utf8')


if __name__ == '__main__':
    main()
