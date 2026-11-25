#!/usr/bin/env python3
"""Decode the previews with ffmpeg and measure a beat grid from multiband onsets."""
import array
import bisect
import json
import math
from pathlib import Path
from statistics import median
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
RATE = 8000
HOP = 40
STEP = HOP / RATE
SONGS = [
    ('alley-cat', 'Alley Cat', 'Tallbeard', [
        ('alley-cat-dumpster-divin', 'Dumpster Divin’'), ('alley-cat-dumpster-party', 'Dumpster Party')]),
    ('heart-shaped', 'Heart-Shaped', 'Tallbeard', [('heart-shaped', 'Original'), ('heart-shaped-2', 'Version 2')]),
    ('crushing-it', 'Crushing It', 'Tallbeard', [('crushing-it', 'Original'), ('crushing-it-2', 'Version 2')]),
    ('piecemeal', 'Piecemeal', 'Tallbeard', [('piecemeal', 'Original'), ('piecemeal-2', 'Version 2')]),
    ('never-miss', 'Never Miss', 'Tallbeard', [(f'never-miss{s}', v) for s, v in
                                             [('', 'Original'), ('-2', 'Version 2'), ('-3', 'Version 3')]]),
    ('cloak-of-darkness', 'Cloak of Darkness', 'Tallbeard', [(f'cloak-of-darkness{s}', v) for s, v in
                                                           [('', 'Original'), ('-2', 'Version 2'), ('-3', 'Version 3')]]),
    ('penguin-town', 'Penguin Town', 'Tallbeard · Three Red Hearts', [('penguin-town', 'Original')]),
    ('ludum-dare-30-04', 'Ludum Dare 30 04', 'Tallbeard', [('ludum-dare-30-04', 'Original')]),
    ('talking-cute', 'Talking Cute', 'Pro Sensory', [('talking-cute', 'Original')]),
    ('dance-field', 'Dance Field', 'Centurion_of_war', [('dance-field', 'Original')]),
    ('hella-bumps', 'Hella Bumps', 'cynicmusic', [('hella-bumps', 'Original')]),
]


def read_audio(path):
    pcm = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le',
                                   '-ac', '1', '-ar', str(RATE), 'pipe:1'])
    samples = array.array('h')
    samples.frombytes(pcm)
    if sys.byteorder != 'little':
        samples.byteswap()
    return samples


def envelopes(samples):
    """Five broad bands with 5 ms RMS frames, plus quarter-second loudness."""
    levels, loud = [], []
    low = mid = upper = air = 0
    squares = 0
    bands = [0.0] * 5
    for i, sample in enumerate(samples, 1):
        low += 0.09 * (sample - low)
        mid += 0.25 * (sample - mid)
        upper += 0.52 * (sample - upper)
        air += 0.82 * (sample - air)
        for j, value in enumerate((low, mid - low, upper - mid, air - upper, sample - air)):
            bands[j] += value * value
        squares += sample * sample
        if i % HOP == 0:
            levels.append([math.log1p(math.sqrt(value / HOP) / 18) for value in bands])
            bands = [0.0] * 5
        if i % (RATE // 4) == 0 or i == len(samples):
            loud.append(math.sqrt(squares / ((i - 1) % (RATE // 4) + 1)))
            squares = 0
    scale = max(1, sorted(loud)[int(0.9 * (len(loud) - 1))])
    return levels, [round(min(1, value / scale), 3) for value in loud]


def onset_curve(levels):
    # Subtract a 20 ms history, leaving attacks rather than sustained notes.
    flux = [0] * len(levels)
    weights = (1.55, 1.15, 0.7, 0.55, 0.5)
    for i in range(4, len(levels)):
        flux[i] = sum(w * max(0, a - b) for a, b, w in zip(levels[i], levels[i - 4], weights))
    return flux


def tempo_candidates(flux):
    mean = sum(flux) / len(flux)
    centered = [max(0, value - mean) for value in flux]
    # Correlate at a beat and its multiples. Checking several beats makes
    # short syncopations less likely to determine the tempo.
    corr = [0.0] * 590
    for lag in range(50, len(corr)):
        corr[lag] = sum(a * b for a, b in zip(centered, centered[lag:])) / (len(centered) - lag)
    ranks = {}
    for lag in range(57, 196):
        bpm = 60 / (lag * STEP)
        prior = math.exp(-0.22 * (math.log2(bpm / 112) ** 2))
        peaks = [max(corr[n * lag - n:n * lag + n + 1]) for n in (1, 2, 3)]
        ranks[lag] = prior * (peaks[0] + 0.46 * peaks[1] + 0.26 * peaks[2])
    peaks = [lag for lag in range(58, 195) if ranks[lag] >= max(ranks[lag - 1], ranks[lag + 1])]
    return sorted(peaks, key=ranks.get, reverse=True)[:8]


def find_grid(flux, lag, start, stop):
    # Weighted energy near each grid line, averaged across the whole clip.
    # Two-peak smoothing tolerates the few milliseconds of spread in MP3 attacks.
    smooth = [0.0] * len(flux)
    for i in range(6, len(flux) - 6):
        smooth[i] = max(flux[i + j] * (1 - abs(j) / 8) for j in range(-6, 7))
    best = (-1, 0, 0)
    for length in range(lag * 10 - 15, lag * 10 + 16):
        period = length / 10
        for phase in range(int(period)):
            first = phase + math.ceil((start - phase) / period) * period
            indexes = [round(first + beat * period) for beat in range(int((stop - first) / period) + 1)]
            if not indexes:
                continue
            score = sum(smooth[i] for i in indexes) / len(indexes)
            if score > best[0]:
                best = (score, period, phase)
    return best


# Some arrangements accent triplets or eighths more strongly than the beat.
# Resolve those aliases with the tempo shared across versions, then fit each file.
SHARED_TEMPO = {'alley-cat': 113, 'heart-shaped': 95, 'piecemeal': 100,
                'never-miss': 140, 'cloak-of-darkness': 93.33}


def analyze(path, reference):
    samples = read_audio(path)
    levels, loud = envelopes(samples)
    flux = onset_curve(levels)
    audible = [i for i, level in enumerate(levels) if level[0] > 1.1 or level[2] > 1.1]
    start, stop = audible[0], min(audible[-1], len(flux) - 7)
    candidates = tempo_candidates(flux)
    lag = round(60 / (reference * STEP)) if reference else candidates[0]
    _, period, phase = find_grid(flux, lag, start, stop)
    # Flux uses a trailing history. Move from its peak to the attack itself.
    attack_shift = 2
    phase = (phase - attack_shift) % period
    first = phase + max(0, math.ceil((start - phase - 6) / period)) * period
    threshold = max(flux) * 0.13
    onsets = [i - attack_shift for i in range(5, stop)
              if flux[i] >= threshold and flux[i] == max(flux[i - 4:i + 5])]
    distances = []
    for beat in range(int((stop - first) / period) + 1):
        at = first + beat * period
        index = bisect.bisect_left(onsets, at)
        neighbors = onsets[max(0, index - 1):index + 1]
        if neighbors:
            distances.append(min(abs(at - point) for point in neighbors) * STEP * 1000)
    error = round(median(distances), 1)
    coverage = round(100 * sum(value <= 45 for value in distances) / len(distances))
    entry = dict(src=f'songs/{path.name}', duration=round(len(samples) / RATE, 3),
                 bpm=round(60 / (period * STEP), 3), firstBeat=round(first * STEP, 4),
                 loudStep=0.25, loudness=loud, medianOnsetErrorMs=error, onBeatPercent=coverage)
    choices = ', '.join(f'{60 / (lag * STEP):.1f}' for lag in candidates[:4])
    print(f'{path.stem:29} {entry["bpm"]:7.2f} BPM  beat {entry["firstBeat"]:6.3f}s  '
          f'error {error:5.1f} ms  ±45 ms {coverage:3}%  {entry["duration"]:6.2f}s  [{choices}]', flush=True)
    return entry


def main():
    data = []
    for theme, title, artist, versions in SONGS:
        data.append(dict(id=theme, title=title, artist=artist, versions=[
            dict(label=label, **analyze(ROOT / 'songs' / f'{file}.mp3', SHARED_TEMPO.get(theme))) for file, label in versions]))
    encoded = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    (ROOT / 'songs.json').write_text(encoded + '\n', encoding='utf-8')
    # A script-form copy keeps the lab usable under file:// and on static hosts.
    (ROOT / 'songs-data.js').write_text('/* Generated by tools/analyze.py. */\n'
                                       'window.DANCE_SONGS = ' + encoded + ';\n', encoding='utf-8')


if __name__ == '__main__':
    main()
