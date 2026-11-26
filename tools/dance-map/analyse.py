import sys, json, numpy as np, librosa
src, out, bpm, first, sid = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
y, sr = librosa.load(src, sr=22050, mono=True)
dur = len(y)/sr; hop = 220  # ~100 fps
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=hop))
f = librosa.fft_frequencies(sr=sr, n_fft=2048)
bands = {'low': (20,150), 'mid': (150,2000), 'high': (2000,11000)}
env, ons = {}, []
for i,(k,(a,b)) in enumerate(bands.items()):
    m = (f>=a)&(f<b); e = librosa.amplitude_to_db(S[m].mean(0)+1e-9, ref=np.max)
    e = np.clip((e+60)/60,0,1); env[k] = (e*99).round().astype(int).tolist()
    oe = librosa.onset.onset_strength(S=librosa.amplitude_to_db(S[m],ref=np.max), sr=sr, hop_length=hop)
    oe = oe/ (oe.max()+1e-9)
    fr = librosa.onset.onset_detect(onset_envelope=oe, sr=sr, hop_length=hop, units='frames', delta=.08, wait=8)
    for x in fr: ons.append([round(float(x*hop/sr),3), i, round(float(oe[x]),2)])
ons.sort()
# melody on the harmonic part
yh = librosa.effects.harmonic(y)
f0, vf, vp = librosa.pyin(yh, fmin=librosa.note_to_hz('C3'), fmax=librosa.note_to_hz('C6'), sr=sr, hop_length=441, frame_length=2048)
mel = [None if (not v or np.isnan(x)) else round(float(librosa.hz_to_midi(x)),1) for x,v in zip(f0,vf)]  # 50 fps
# rough first map: strongest hit near each half-beat, lane from melody movement
half = 60/bpm/2; notes=[]; last_p=None; alt=0
def pitch_at(t):
    i=int(t*50); w=[mel[j] for j in range(max(0,i-3),min(len(mel),i+4)) if mel[j] is not None]
    return float(np.median(w)) if w else None
start = min(o[0] for o in ons if o[2] > .5) - .05
k = 0
while first + k*half < dur - .2:
    t = first + k*half; k += 1
    if t < start: continue
    near = [o for o in ons if abs(o[0]-t) < half*.4]
    if not near: continue
    s = sum(o[2] for o in near); onbeat = (k-1)%2==0
    if s < (.55 if onbeat else .9): continue
    p = pitch_at(t)
    if p is not None and last_p is not None and p-last_p >= 1: lane=2
    elif p is not None and last_p is not None and last_p-p >= 1: lane=1
    else: lane = 0 if alt%2==0 else 3; alt+=1
    if p is not None: last_p = p
    notes.append([round(t,3), lane])
# keep it playable: no two notes closer than a half beat in a row more than 3 times
json.dump({'song':sid,'duration':round(dur,3),'fps':sr/hop,'env':env,'onsets':ons,'melodyFps':50,'melody':mel,'draft':notes}, open(out,'w'), separators=(',',':'))
print(sid, 'dur',round(dur,1),'onsets',len(ons),'draft',len(notes),'voiced',sum(m is not None for m in mel))
