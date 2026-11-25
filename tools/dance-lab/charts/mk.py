import librosa,numpy as np,json,sys
f,out,pre=sys.argv[1],sys.argv[2],float(sys.argv[3])
y,sr=librosa.load(f,sr=22050,mono=True)
yh,yp=librosa.effects.hpss(y)
oe=librosa.onset.onset_strength(y=y,sr=sr)
fr=librosa.onset.onset_detect(onset_envelope=oe,sr=sr,units='frames')
t=librosa.frames_to_time(fr,sr=sr);s=oe[fr]
f0,vf,vp=librosa.pyin(yh,fmin=150,fmax=1500,sr=sr,frame_length=2048)
ft=librosa.times_like(f0,sr=sr)
def pitch(x):
    i=np.searchsorted(ft,x);seg=f0[i:i+6];seg=seg[~np.isnan(seg)];return float(np.median(seg)) if len(seg) else None
# loudness per 2 s window decides density
rms=librosa.feature.rms(y=y)[0];rt=librosa.times_like(rms,sr=sr)
thr=np.percentile(s,55)
notes=[];prev=None;last=-1;lane=0
for x,v in zip(t,s):
    if v<thr or x-last<.2:continue
    p=pitch(x)
    if p and prev:
        st=12*np.log2(p/prev)
        if st>4:lane=2
        elif st>.5:lane=3
        elif st<-4:lane=1
        elif st<-.5:lane=0
        else:lane=lane
    elif notes:lane=(lane+1)%4
    if p:prev=p
    notes.append([round(float(x)-pre,3),lane,1 if v>np.percentile(s,94) else 0]);last=x
json.dump(notes,open(out,'w'))
lanes=[n[1] for n in notes];same=sum(1 for a,b in zip(lanes,lanes[1:]) if a==b)
print(len(notes),'notes',round(len(notes)/(len(y)/sr-pre),2),'/s  lanes',[lanes.count(i) for i in range(4)],'repeats',same,'doubles',sum(n[2] for n in notes))
