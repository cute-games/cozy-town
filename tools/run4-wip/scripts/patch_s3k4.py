"""Stage 3, patch k part 4: a passer-by stops a step before you (not in your face) and, after a moment, walks back the other way."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))
ed(r"      else if(CUR.id==='city'&&Math.hypot(P.x-this.x,P.z-this.z)<.95)this.moving=false;" "\n"
   r"      else{const s=Math.min(d,(this.state==='going'?1.5:1.25)*(1-.58*e)*(this.slow?.45:1)*dt);this.x+=dx/d*s;this.z+=dz/d*s;this.face=Math.atan2(dx,dz);this.moving=true;}}",
   r"      else if(CUR.id==='city'&&wkBlocked(this,dx/d,dz/d)){this.moving=false;this.blk=(this.blk||0)+dt;if(this.blk>1.6&&this.prev>=0){const n0=this.node;this.node=this.prev;this.prev=n0;this.blk=0;}}   /* you stand on my way: I stop a step before you and, after a moment, walk back the other way (run 4, stage 3: a passer-by waited 0.9 m in front of the camera for as long as you stood still) */" "\n"
   r"      else{const s=Math.min(d,(this.state==='going'?1.5:1.25)*(1-.58*e)*(this.slow?.45:1)*dt);this.x+=dx/d*s;this.z+=dz/d*s;this.face=Math.atan2(dx,dz);this.moving=true;this.blk=0;}}")
ed(r"const WALKERS=[];",
   r"const WALKERS=[];" "\n"
   r"function wkBlocked(w,ux,uz){const px=P.x-w.x,pz=P.z-w.z,pd=Math.hypot(px,pz);return pd<.95||pd<1.7&&(px*ux+pz*uz)/pd>.55;}   /* you are right next to me, or a step ahead on my way */")
bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
