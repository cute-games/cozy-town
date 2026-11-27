"""Dance charts with Easy/Hard, hold notes and a different arrow pattern on each loop (27 Nov 2026, owner: 1 a b c).
python3 chart3.py <loop.json> <profile steady|fast> <level easy|hard> <mp3>  -> [[t,lane,double,hold_seconds],...]
Built on chart2.py: every big accent keeps its arrow at its exact time (dance clock = mp3 time - 1.5 s preroll), meow = up.
New: 1. each of the 5 loops shuffles the other three lanes its own way and gets a little busier (the music builds);
2. a long sound (a held melody note or a long meow, steady pitch and still loud) becomes a hold arrow: press on time and keep holding to the end
   of its tail; no other arrow starts while you hold one; 3. Easy = the big accents only, further apart, fewer and longer holds."""
import sys, json, numpy as np, librosa
L, prof, level, mp3 = json.load(open(sys.argv[1])), sys.argv[2], sys.argv[3], sys.argv[4]
P = L['profiles'][prof]; acc = sorted([a for a in P['accents'] if a[0] > .45], key=lambda a: a[0]); segs = P['segments']
bpm = L['bpm']; beat = 60 / bpm; bar = beat * 4; PRE = L['preroll']; hard = level == 'hard'
gap = (.26 if prof == 'steady' else .19) if hard else (.42 if prof == 'steady' else .34)
per_bar = ((1.0, 2.4) if prof == 'steady' else (2.0, 4.0)) if hard else (.6, 1.3)
ramp = [.8, .9, 1.0, 1.1, 1.2]   # each loop a little busier than the last
hold_min, hold_max = (.45, 1.5) if hard else (.55, 1.6)
y, sr = librosa.load(mp3, sr=22050, mono=True); hop = 512; fps = sr / hop
rms = librosa.feature.rms(y=y, hop_length=hop)[0]
yh = librosa.effects.harmonic(y)
f0, vf, _ = librosa.pyin(yh, fmin=librosa.note_to_hz('C3'), fmax=librosa.note_to_hz('C6'), sr=sr, hop_length=hop)
midi = np.where(vf, librosa.hz_to_midi(np.nan_to_num(f0, nan=1)), np.nan)
def fr(t): return int((t + PRE) * fps)
def pitch(t):
    i = fr(t); s = midi[max(0, i - 1):i + 3]; s = s[~np.isnan(s)]
    return float(np.median(s)) if len(s) else None
def sustain(t):   # how long the note that starts at t keeps the same pitch and stays loud
    i = fr(t) + 1; p0 = pitch(t)
    if p0 is None: return 0
    r0 = max(rms[max(0, i - 2):i + 3]); n = 0
    while i + n < len(midi) and not np.isnan(midi[i + n]) and abs(midi[i + n] - p0) <= 1 and rms[i + n] >= .45 * r0: n += 1
    return n / fps
def loop_of(t):
    for k, (a, b, _) in enumerate(segs):
        if a <= t + PRE * 0 < b: return min(k, 4)
    return 4
def energy(t0, t1): return float(np.mean(rms[fr(t0):max(fr(t0) + 1, fr(t1))]))
end = acc[-1][0]; bars = int(end / bar) + 1
E = np.array([energy(b * bar, (b + 1) * bar) for b in range(bars)]); E = (E - E.min()) / (np.ptp(E) + 1e-9)
chosen = []
def ok(t): return all(abs(t - c[0]) >= gap - .005 for c in chosen)
for a in sorted(acc, key=lambda a: -a[1]):
    if a[1] >= 85 and ok(a[0]): chosen.append(a)
for b in range(bars):
    want = int(round((per_bar[0] + (per_bar[1] - per_bar[0]) * E[b]) * ramp[loop_of(b * bar)]))
    inbar = [a for a in acc if b * bar <= a[0] < (b + 1) * bar]
    have = sum(1 for c in chosen if b * bar <= c[0] < (b + 1) * bar)
    for a in sorted([a for a in inbar if a[1] >= (40 if hard else 60)], key=lambda a: -a[1]):
        if have >= want: break
        if ok(a[0]) and a not in chosen: chosen.append(a); have += 1
chosen.sort(key=lambda a: a[0])
# holds: a long sound becomes a hold; the arrows it would cover give way, unless they are big accents (then the hold is cut short)
holds = {}
for a in [a for a in acc if a[2] in ('melody', 'meow') and a[1] >= 45]:
    t, st, kind = a
    if a not in chosen and not all(abs(t - c[0]) >= gap - .005 for c in chosen if c[1] >= 85 or c[0] in holds): continue
    ln = min(sustain(t), hold_max)
    if ln < hold_min: continue
    inside = [c for c in chosen if t < c[0] <= t + ln + gap]
    big = [c for c in inside if c[1] >= 85]
    if big: ln = min(ln, big[0][0] - t - gap)
    if ln < hold_min: continue
    if any(h < t < h + holds[h] + gap for h in holds): continue
    for c in inside:
        if c[0] <= t + ln + gap and c[1] < 85: chosen.remove(c)
    for c in [c for c in chosen if abs(c[0] - t) < gap and c is not a and c[1] < 85]: chosen.remove(c)
    if a not in chosen: chosen.append(a)
    holds[t] = round(ln, 3)
chosen.sort(key=lambda a: a[0])
PERMS = [{0: 0, 1: 1, 3: 3}, {0: 3, 1: 1, 3: 0}, {0: 1, 1: 3, 3: 0}, {0: 0, 1: 3, 3: 1}, {0: 3, 1: 0, 3: 1}]   # up (meow) stays up
out = []; last_p = None
for t, st, kind in chosen:
    bi = int(round((t + PRE) / beat)) % 4; p = pitch(t)
    onb = abs((t + PRE) / beat - round((t + PRE) / beat)) < .12
    if kind == 'meow': lane = 2
    elif onb: lane = [0, 1, 3, 2][bi]
    elif p is not None and last_p is not None and p - last_p >= 1: lane = 2
    elif p is not None and last_p is not None and last_p - p >= 1: lane = 1
    else: lane = 3 if out and out[-1][1] == 0 else 0
    if p is not None: last_p = p
    if kind != 'meow' and lane != 2: lane = PERMS[loop_of(t)][lane]
    if len(out) >= 2 and out[-1][1] == lane and out[-2][1] == lane: lane = {0: 3, 3: 0, 1: 2, 2: 1}[lane]
    hl = holds.get(t, 0)
    dbl = 1 if (hard and not hl and st >= 100 and kind in ('snare', 'kick') and bi == 0 and prof == 'fast') else 0
    out.append([round(t, 3), lane, dbl, hl])
json.dump(out, sys.stdout, separators=(',', ':'))
big = [a for a in acc if a[1] >= 85]; hit = sum(1 for a in big if any(abs(a[0] - o[0]) < .01 for o in out))
loops = [[(round(o[0] - segs[loop_of(o[0])][0], 2), o[1]) for o in out if loop_of(o[0]) == k] for k in range(5)]
same = sum(1 for i in range(5) for j in range(i + 1, 5) if loops[i] == loops[j])
print(f"\n{prof}-{level}: {len(out)} arrows, {len(out)/end:.2f}/s, big accents with an arrow {hit}/{len(big)}, holds {len(holds)} ({sum(holds.values()):.1f} s), "
      f"doubles {sum(o[2] for o in out)}, lanes {[sum(1 for o in out if o[1]==l) for l in range(4)]}, per loop {[len(x) for x in loops]}, identical loop pairs {same}", file=sys.stderr)
