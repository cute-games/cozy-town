"""Accent-led dance charts (27 Nov 2026). python3 chart.py <mp3> <bpm> <firstBeat> <preroll> <level steady|fast> -> JSON [[t,lane,double],...] (t after the preroll)
Arrows land on the music's accents: kick, snare and the melody's note starts, snapped to an 8th grid (steady) or 16th grid (fast);
more arrows in loud parts, fewer in quiet ones; the lane follows the melody (up = up arrow, down = down arrow, the same note = the same side);
doubles only on the biggest hits at bar starts."""
import sys, json, numpy as np, librosa
src, bpm, first, pre, level = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
y, sr = librosa.load(src, sr=22050, mono=True); hop = 256
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=hop)); f = librosa.fft_frequencies(sr=sr, n_fft=2048)
def band(a, b):
    m = (f >= a) & (f < b); e = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[m], ref=np.max), sr=sr, hop_length=hop)
    return e / (np.percentile(e, 99) + 1e-9)
kick, snare, high = band(30, 150), band(150, 2500), band(2500, 10000)
fps = sr / hop
rms = librosa.feature.rms(S=S)[0]; rms = rms / (rms.max() + 1e-9)
yh = librosa.effects.harmonic(y)
f0, vf, _ = librosa.pyin(yh, fmin=librosa.note_to_hz('C3'), fmax=librosa.note_to_hz('C6'), sr=sr, hop_length=hop, frame_length=2048)
midi = np.where(vf, librosa.hz_to_midi(np.nan_to_num(f0, nan=1)), np.nan)
def at(arr, t, w=.035):
    i0, i1 = max(0, int((t - w) * fps)), min(len(arr), int((t + w) * fps) + 1)
    return float(arr[i0:i1].max()) if i1 > i0 else 0.
def pitch(t):
    i = int(t * fps); seg = midi[max(0, i - 2):i + 4]; seg = seg[~np.isnan(seg)]
    return float(np.median(seg)) if len(seg) else None
def note_start(t):   # the melody starts a new note here
    a, b = pitch(t - .06), pitch(t + .03)
    return b is not None and (a is None or abs(b - a) >= .8)
dur = len(y) / sr; beat = 60 / bpm; sub = 2 if level == 'steady' else 4; step = beat / sub
slots = []; k = 0
while first + k * step < dur - .3:
    t = first + k * step; pos = k % (sub * 4)   # position inside the bar
    sc = 1.0 * at(kick, t) + 1.1 * at(snare, t) + .5 * at(high, t) + (.8 if note_start(t) else 0)
    sc *= 1.25 if pos == 0 else 1.12 if pos % sub == 0 else 1.0   # on-beat accents count more
    slots.append([t, sc, pos, at(rms, t, .1)]); k += 1
if len(sys.argv) > 6:   # the game's own accent list (time, strength 0-100, kind): use its exact times, grid-snapped when close
    acc = json.load(open(sys.argv[6])); slots = []
    for t, st, kind in acc:
        g = first + round((t - first) / step) * step
        t2 = g if abs(g - t) < .03 else t; pos = int(round((t2 - first) / step)) % (sub * 4)
        w = {'kick': 1.0, 'snare': 1.1, 'melody': .95, 'meow': 1.2}.get(kind, .8)
        sc = st / 100 * w * (1.25 if pos == 0 else 1.12 if pos % sub == 0 else 1.0)
        slots.append([t2, sc * 1.6, pos, at(rms, t2, .1)])
    slots.sort()
slots = [s for s in slots if s[0] - pre > .45]   # nothing in the first moment after the count-in
base = .4 if level == 'steady' else 1.2   # arrows a second at average loudness
mean_e = np.mean([s[3] for s in slots]) + 1e-9
chosen = []; bar = sub * 4
for b0 in range(0, len(slots), bar):
    B = slots[b0:b0 + bar]
    if not B: continue
    e = np.mean([s[3] for s in B]) / mean_e
    want = int(round(base * beat * 4 * min(1.7, max(.45, e))))
    good = sorted([s for s in B if s[1] > .45], key=lambda s: -s[1])[:want]
    chosen += sorted(good, key=lambda s: s[0])
# lanes from the melody; no lane twice in a row closer than a beat unless the note repeats
out = []; last_p = None; last_lane = 3; side = 0; mingap = .26 if level == 'steady' else .13
top = np.percentile([s[1] for s in chosen], 95) if chosen else 9
for t, sc, pos, e in chosen:
    if out and t - pre - out[-1][0] < mingap - .01: continue
    p = pitch(t)
    if p is not None and last_p is not None and p - last_p >= 1.5: lane = 2
    elif p is not None and last_p is not None and last_p - p >= 1.5: lane = 1
    elif p is not None and last_p is not None and abs(p - last_p) < .8 and out: lane = out[-1][1]
    else: side ^= 1; lane = 0 if side else 3
    if out and lane == out[-1][1] and t - pre - out[-1][0] < beat * .9 and not (p is not None and last_p is not None and abs(p - last_p) < .8):
        lane = {0: 3, 3: 0, 1: 2, 2: 1}[lane]
    if len(out) >= 2 and out[-1][1] == lane and out[-2][1] == lane: lane = {0: 3, 3: 0, 1: 2, 2: 1}[lane]   # no three of the same in a row
    if p is not None: last_p = p
    dbl = 1 if (pos == 0 and sc >= top and lane in (0, 3, 1, 2)) else 0
    out.append([round(t - pre, 3), lane, dbl])
json.dump(out, sys.stdout, separators=(',', ':'))
print(file=sys.stderr); print(level, 'arrows', len(out), 'per sec', round(len(out) / (dur - pre), 2), 'doubles', sum(o[2] for o in out), file=sys.stderr)
