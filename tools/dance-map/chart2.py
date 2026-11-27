"""Dance charts from the game's accent list (27 Nov 2026). python3 chart2.py <accents.json> <bpm> <level steady|fast> <mp3> -> [[t,lane,double],...]
Every arrow is a real accent of the song (kick, snare, melody note, meow) at its exact time.
1. every big accent (strength >= 85) gets an arrow; 2. the loud bars get more of the medium ones; 3. each sound has its own arrow,
so the same bit of music always plays the same: meow = up, on the beat the pad goes round (left, down, right, up), between beats the tune's way (up/down)."""
import sys, json, numpy as np, librosa
acc, bpm, level, mp3 = json.load(open(sys.argv[1])), float(sys.argv[2]), sys.argv[3], sys.argv[4]
beat = 60 / bpm; bar = beat * 4
gap = .26 if level == 'steady' else .19
per_bar = (1.0, 2.4) if level == 'steady' else (2.0, 4.0)   # arrows a bar in the quietest and loudest bars
y, sr = librosa.load(mp3, sr=22050, mono=True); hop = 512
rms = librosa.feature.rms(y=y, hop_length=hop)[0]; fps = sr / hop
yh = librosa.effects.harmonic(y)
f0, vf, _ = librosa.pyin(yh, fmin=librosa.note_to_hz('C3'), fmax=librosa.note_to_hz('C6'), sr=sr, hop_length=hop)
midi = np.where(vf, librosa.hz_to_midi(np.nan_to_num(f0, nan=1)), np.nan)
PRE = 1.5   # the accents and the chart run on the dance clock = mp3 time - 1.5 s preroll
def pitch(t):
    i = int((t + PRE) * fps); s = midi[max(0, i - 1):i + 3]; s = s[~np.isnan(s)]
    return float(np.median(s)) if len(s) else None
def energy(t0, t1): return float(np.mean(rms[int((t0 + PRE) * fps):max(int((t0 + PRE) * fps) + 1, int((t1 + PRE) * fps))]))
acc = sorted([a for a in acc if a[0] > .45], key=lambda a: a[0]); end = acc[-1][0]
bars = int(end / bar) + 1; E = np.array([energy(b * bar, (b + 1) * bar) for b in range(bars)]); E = (E - E.min()) / (np.ptp(E) + 1e-9)
chosen = []
def ok(t): return all(abs(t - c[0]) >= gap - .005 for c in chosen)
for a in sorted(acc, key=lambda a: -a[1]):   # big accents first
    if a[1] >= 85 and ok(a[0]): chosen.append(a)
for b in range(bars):
    want = int(round(per_bar[0] + (per_bar[1] - per_bar[0]) * E[b]))
    inbar = [a for a in acc if b * bar <= a[0] < (b + 1) * bar]
    have = sum(1 for c in chosen if b * bar <= c[0] < (b + 1) * bar)
    for a in sorted([a for a in inbar if a[1] >= 40], key=lambda a: -a[1]):
        if have >= want: break
        if ok(a[0]) and a not in chosen: chosen.append(a); have += 1
chosen.sort(key=lambda a: a[0])
out = []; last_p = None
for t, st, kind in chosen:
    bi = int(round((t + PRE) / beat)) % 4; p = pitch(t)
    onb = abs((t + PRE) / beat - round((t + PRE) / beat)) < .12   # on the beat
    if kind == 'meow': lane = 2
    elif onb: lane = [0, 1, 3, 2][bi]   # the beat walks round the pad: left, down, right, up
    elif p is not None and last_p is not None and p - last_p >= 1: lane = 2
    elif p is not None and last_p is not None and last_p - p >= 1: lane = 1
    else: lane = 3 if out and out[-1][1] == 0 else 0
    if p is not None: last_p = p
    if len(out) >= 2 and out[-1][1] == lane and out[-2][1] == lane: lane = {0: 3, 3: 0, 1: 2, 2: 1}[lane]
    dbl = 1 if (st >= 100 and kind in ('snare', 'kick') and bi == 0 and level == 'fast') else 0
    out.append([round(t, 3), lane, dbl])
json.dump(out, sys.stdout, separators=(',', ':'))
big = [a for a in acc if a[1] >= 85]; hit = sum(1 for a in big if any(abs(a[0] - o[0]) < .01 for o in out))
print(f"\n{level}: {len(out)} arrows, {len(out)/end:.2f}/s, big accents with an arrow {hit}/{len(big)}, doubles {sum(o[2] for o in out)}, lanes {[sum(1 for o in out if o[1]==l) for l in range(4)]}", file=sys.stderr)
