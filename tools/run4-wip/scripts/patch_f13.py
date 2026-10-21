"""Run 4 finish, f13: pass 16's kept marks. Each edit must match exactly once.
usage: python3 patch_f13.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. the ducks keep off the lily flowers of the little pond (one sat on a flower: its pink bud stuck out of the duck's chest)
 (r"""const PONDS=[{x:36.2,z:-36.2,r:1.45},{x:69,z:69,r:6.4,dock:LAKEW}];""",
  r"""const PONDS=[{x:36.2,z:-36.2,r:1.45,pads:[[-.75,.3],[.45,.9],[.75,-.6]]},{x:69,z:69,r:6.4,dock:LAKEW}];   /* (run 4 finish: pads: the little pond's lily flowers, a duck keeps 34 cm from each: one sat on a flower, the bud through its chest) */"""),
 (r"""function duckOk(i,x,z){const p=PONDS[i];if(Math.hypot(x-p.x,z-p.z)>p.r)return false;""",
  r"""function duckOk(i,x,z){const p=PONDS[i];if(Math.hypot(x-p.x,z-p.z)>p.r)return false;if(p.pads)for(const [fx,fz] of p.pads)if(Math.hypot(x-p.x-fx,z-p.z-fz)<.34)return false;"""),
 # (and a duck pushed aside by the other one swam on straight at its old goal, across a flower: a step into water it may not use ends that swim)
 (r"""else{const sp=Math.min(dist,(d.fed>0?1.0:.35)*dt);d.x+=dx/dist*sp;d.z+=dz/dist*sp;d.face=Math.atan2(dx,dz);}}""",
  r"""else{const sp=Math.min(dist,(d.fed>0?1.0:.35)*dt),nx=d.x+dx/dist*sp,nz=d.z+dz/dist*sp;if(duckOk(d.pond,nx,nz)||!duckOk(d.pond,d.x,d.z)){d.x=nx;d.z=nz;d.face=Math.atan2(dx,dz);}else{d.tx=d.x;d.tz=d.z;d.via=null;}}}   /* (run 4 finish: a duck pushed aside by the other swam on straight at its old goal, across a lily flower: a step into water it may not use ends the swim there) */"""),
 # 2. a duck's eyes sit a little deeper in its head and their shine on their top, both inside the head's outline: from behind and from the side
 #    a shine stuck out past the outline, a floating ring like a googly eye (`eyegeo2.py`: seen past the outline from 1148 of 1440 directions, now 0)
 (r"""for(const s of[-1,1]){sph(d,.034,INK,s*.06,.36,.248,{ws:8,hs:6,ol:false});sph(d,.012,'#ffffff',s*.066,.374,.274,{ws:6,hs:4,ol:false});""",
  r"""for(const s of[-1,1]){sph(d,.034,INK,s*.05,.355,.235,{ws:8,hs:6,ol:false});sph(d,.012,'#ffffff',s*.058,.379,.245,{ws:6,hs:4,ol:false});   /* (run 4 finish: the eyes sit a little deeper and the shine on their top, both inside the head's outline: from behind and from the side a shine stuck out past the outline like a googly eye) */"""),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
