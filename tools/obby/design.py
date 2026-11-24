"""Tree Park obby layout (24 Nov 2026): builds the three paths, checks every gap against the measured jump (easy <= 60 %, medium <= 80 %, hard <= 92 % of the run-speed jump at that height step), tree clearance, path spacing and zip-line clearance. Writes course.json; js/09-mainloop.js TP_COURSE holds the result."""
import math, json
TREES=[[104.5,-21.2,3.5],[109.8,-61.9,3.7],[96.9,-30,2.2],[105.6,-70.5,3],[94.3,-71.5,3.2],[113.5,-34.4,2.3],[113.2,-61.9,3.8],[104.1,-73.2,3.2],[114.2,-41.3,4.1],[116,-58.7,3.9],[94.9,-65,3.3],[103.2,-31.8,3.2],[114.1,-63.4,2.7],[112.6,-27.2,2.3],[99.9,-23.5,2.8],[117.4,-29.6,2.7],[111.9,-32.3,3.5],[93.9,-66.3,4],[103.8,-25.7,3.3],[119.7,-40.1,1.8],[89.1,-47.6,1.9],[85.5,-18.5,2.1],[89.9,-63.2,1.7],[87.9,-37.5,1.8],[87.1,-52.8,2.2],[90.2,-58.9,2.1],[88.7,-41.1,2.6],[87.3,-67.1,1.8],[90.2,-50.4,2.5],[88.4,-17,2.3],[90.4,-27.6,1.9],[88.1,-31.7,1.9],[85.9,-47.4,2.7],[88.5,-22.5,2.2],[90.1,-14.8,2.3],
 [99.9,-28.9,2.6],[105.3,-67.4,2.6],[87.2,-41.9,2.6],[128.6,-47.7,2.6]]
# M(dh): max centre travel in the air at run speed (sport level 1, not hungry), conservative over dt 1/60..1/20
def air(dh,dt):
  vy=5.4;jy=1e-4;t=0;up=False
  while t<3:
    vy-=18*dt;jy+=vy*dt;t+=dt
    if jy>dh: up=True
    if up and vy<=0 and jy<=dh: return t
    if not up and vy<0: return 0
  return 0
def M(dh,sp=7.095): return min(sp*air(dh,dt) for dt in (1/60,1/30,1/20))
def rd(a,b):
  dx=max(0,abs(a['x']-b['x'])-(a['w']+b['w'])/2); dz=max(0,abs(a['z']-b['z'])-(a['d']+b['d'])/2); return math.hypot(dx,dz)
# path builder: steps (dx_gap along +x or given dir, lateral, kind, w, d, dh, flags)
def build(start, steps):
  P=[dict(start,i=0)]
  for s in steps:
    a=P[-1]; ax=s.get('ax','x'); sg=s.get('sg',1); w,d=s['w'],s['d']
    if ax=='x': x=a['x']+sg*(a['w']/2+s['gap']+w/2); z=a['z']+s.get('lat',0)
    else: z=a['z']+sg*(a['d']/2+s['gap']+d/2); x=a['x']+s.get('lat',0)
    p=dict(t=s['t'],x=round(x,2),z=round(z,2),w=w,d=d,h=round(a['h']+s['dh'],2),i=len(P))
    for k in ('cp','fin','b','mv'):
      if k in s: p[k]=s[k]
    P.append(p)
  return P
LIM={'easy':.6,'medium':.8,'hard':.92}
def st(t,gap,w,d=None,dh=0,**k): return dict(t=t,gap=gap,w=w,d=d if d else w,dh=dh,**k)
E=build(dict(t='pad',x=94,z=-38.2,w=2.4,d=2.4,h=.35),[
 st('stump',1.2,1.4,dh=.3,lat=.6), st('stump',1.3,1.4,dh=.25,lat=-.9), st('deck',1.4,2.2,dh=.2,lat=.3,cp=1),
 st('deck',2.2,2.2,dh=0,b=1), st('log',1.3,2.8,.9,dh=.25,lat=-.5), st('stump',1.3,1.4,dh=.25,lat=.6),
 st('deck',1.4,2.2,dh=.25,lat=1.0,cp=1), st('stump',1.4,1.4,dh=.25,lat=.4), st('deck',1.5,2.4,dh=.3,lat=-.2,fin=1)])
Mm=build(dict(t='pad',x=94,z=-45.4,w=2.4,d=2.4,h=.35),[
 st('stump',2.0,1.3,dh=.35,lat=.8), st('stump',2.2,1.3,dh=.35,lat=-1.5), st('deck',2.3,2.0,dh=.35,lat=.7,cp=1),
 st('log',2.2,3.0,.7,dh=.3), st('stump',2.4,1.2,dh=.3,lat=.9), st('mv',1.8,1.8,dh=0,lat=-.6,mv=['x',1.2,6]),
 st('deck',1.8,2.0,dh=.3,lat=.1,cp=1), st('stump',2.5,1.2,dh=.35,lat=-.3), st('deck',2.4,2.4,dh=.35,lat=1.4,fin=1)])
H=build(dict(t='pad',x=94,z=-53.6,w=2.4,d=2.4,h=.35),[
 st('stump',2.8,1.0,dh=.4,lat=.9), st('stump',3.0,1.0,dh=.35,lat=-1.4), st('deck',2.9,1.6,dh=.45,lat=.6,cp=1),
 st('log',3.2,2.6,.5,dh=.3), st('stump',3.3,.9,dh=.2,lat=.9), st('mv',3.0,1.4,dh=.3,lat=-.9,mv=['z',1.4,5]),
 st('deck',2.6,1.6,dh=.3,lat=.2,cp=1)])
# the tree tower: a spiral round a big tree at (TX,TZ)
TX,TZ,R=H[-1]['x']+6.4,H[-1]['z']-1.0,3.5
ang=[180,252,324,36,108]   # degrees round the trunk (0 = +x, 90 = +z); then the finish deck on the inside, at 180 degrees
hh=H[-1]['h']
import math as _m
for k,a in enumerate(ang):
  hh+=.4
  p=dict(t='deck' if k in (2,) else 'stump',x=round(TX+R*_m.cos(_m.radians(a)),2),z=round(TZ+R*_m.sin(_m.radians(a)),2),w=1.1,d=1.1,h=round(hh,2),i=len(H),tw=1)
  if k==3: p['cp']=1
  H.append(p)
H.append(dict(t='deck',x=round(TX-1.75,2),z=TZ,w=2.0,d=2.0,h=round(hh+.45,2),i=len(H),tw=1,fin=1))
print('tower at',TX,TZ)
OUT={'easy':E,'medium':Mm,'hard':H}
bad=[]
for k,Pp in OUT.items():
  print(k, 'n',len(Pp),'cps',sum(1 for p in Pp if p.get('cp')),'x',min(p['x']-p['w']/2 for p in Pp),max(p['x']+p['w']/2 for p in Pp),'z',min(p['z']-p['d']/2 for p in Pp),max(p['z']+p['d']/2 for p in Pp),'top',Pp[-1]['h'])
  worst=0
  for a,b in zip(Pp,Pp[1:]):
    g=rd(a,b); dh=b['h']-a['h']
    if a.get('mv') or b.get('mv'): g=g  # gap at middle position; moving amplitude reduces it at closest
    if b.get('b'): continue
    m=M(dh); r=g/m; worst=max(worst,r)
    flag='' if r<=LIM[k] else ' <-- OVER'
    if flag: bad.append((k,b['i']))
    print(f"  {a['i']}->{b['i']} {b['t']:5} gap {g:.2f} dh {dh:+.2f} max {m:.2f} = {r*100:.0f}%{flag}")
  print('  worst',round(worst*100),'%')
  for p in Pp:
    for t in TREES:
      dd=math.hypot(p['x']-t[0],p['z']-t[1])-max(p['w'],p['d'])/2
      need=1.0 if p['h']+1.8<t[2] else 1.1*t[2]+.5
      if dd<need: print('   TREE near',p['i'],p['t'],(p['x'],p['z'],p['h']),t,round(dd,2))
# lane-lane clearance
names=list(OUT)
for i in range(3):
  for j in range(i+1,3):
    for a in OUT[names[i]]:
      for b in OUT[names[j]]:
        if rd(a,b)<1.2: print('CLOSE',names[i],a['i'],names[j],b['i'],round(rd(a,b),2),a['h'],b['h'])
json.dump(OUT,open('course.json','w'))
print('bad',bad)
for k,Pp in OUT.items(): print(k,'fin',Pp[-1]['x'],Pp[-1]['z'],Pp[-1]['h'],'start',Pp[0]['x'],Pp[0]['z'])
ZIPS={'easy':((139.5,-36.6,.6)),'medium':((139.5,-44.6,.6)),'hard':((121.6,-49.3,.6))}
def seg_check(k,a,b):
  # cable from a=(x,z,y) to b; rider feet at cable-2.05, head at cable-.3; sample
  hits=[]
  for i in range(101):
    u=i/100; x=a[0]+(b[0]-a[0])*u; z=a[1]+(b[1]-a[1])*u; y=a[2]+(b[2]-a[2])*u-.35*4*u*(1-u)
    f=y-2.05; hd=y-.2
    for kk,Pp in OUT.items():
      for p in Pp:
        if (kk==k and p is Pp[-1] and u<.25): continue
        if abs(x-p['x'])<p['w']/2+.4 and abs(z-p['z'])<p['d']/2+.4 and f<p['h']+.05 and hd>p['h']-.4: hits.append((kk,p['i'],round(u,2)))
    for t in TREES:
      d=math.hypot(x-t[0],z-t[1])
      if d<.7 or (hd>t[2] and d<1.1*t[2]+.3): hits.append(('tree',t,round(u,2)))
  return sorted(set(map(str,hits)))[:6]
for k,Pp in OUT.items():
  if k not in ZIPS: continue
  f=Pp[-1]; L=ZIPS[k]
  a=(f['x']+f['w']/2-.3,f['z'],f['h']+2.3) if k!='hard' else (f['x']-.45,f['z']+f['d']/2-.35,f['h']+2.3)
  import math as mm; dx,dz=L[0]-a[0],L[1]-a[1]; ll=mm.hypot(dx,dz); b=(L[0]-dx/ll*.9,L[1]-dz/ll*.9,L[2]+2.3)
  T0=(131.7,-54.3); print('  trunk dist',round(abs(dx*(T0[1]-a[1])-dz*(T0[0]-a[0]))/ll,2))
  print('zip',k,'len',round(math.hypot(a[0]-b[0],a[1]-b[1]),1),'drop',round(a[2]-b[2],1),seg_check(k,a,b))
