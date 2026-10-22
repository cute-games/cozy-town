"""Stage 3, patch i: the dance-off on phones (seen from two real phones): the partner stays on the floor while the result shows, the two
players' views sit apart, the view frames the dancers above the lane on an upright phone and below the score bar on a short sideways one,
no note or message over the dance."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))
ed("DANCE.cam={x:clamp(f.x+dx*4.4,cx-W+.7,cx+W-.7),z:clamp(f.z+dz*4.4,cz-D+.7,cz+D-.7),dx,dz};",
   "{const cd=innerWidth>innerHeight&&visH()<=500?3.5:4.4,sd=(left?-1:1)*.6;DANCE.cam={x:clamp(f.x+dx*cd+dz*sd,cx-W+.7,cx+W-.7),z:clamp(f.z+dz*cd-dx*sd,cz-D+.7,cz+D-.7),dx,dz};}   /* (run 4, stage 3: nearer on a short sideways screen; the two players' views 1.2 m apart, so after the round they never stand inside each other) */")
ed("function dnCam(dt){const D=DANCE;if(!(D.on||D.res)||!D.cam){updateCamera(dt);return;}const c=D.cam,f=D.floor;psCamTo(c.x,c.z,f.x,1.0,f.z,dt,4);",
   "function dnCam(dt){const D=DANCE;if(!(D.on||D.res)||!D.cam){updateCamera(dt);return;}const c=D.cam,f=D.floor,ty=innerWidth<innerHeight?.15:visH()<=500?1.3:1.0;psCamTo(c.x,c.z,f.x,ty,f.z,dt,4);   /* (the dancers above the lane on an upright phone, under the score bar on a short sideways one: run 4, stage 3) */")
ed("function dnPeer(a,dt){const dn=a.dn;if(!dn||dn.st!=='go'||!a.av||!CUR||(CUR.id!=='home'&&CUR.id!=='visit'))return;   /* (on the floor from the moment they said yes: also through the countdown) */\n  let f=DANCE.on?DANCE.floor:dnFloor();if(!f)return;let c=DANCE.on?DANCE.cam:null;",
   "function dnPeer(a,dt){const dn=a.dn&&a.dn.st==='go'?a.dn:null,res=DANCE.res&&a.peer===DANCE.partner;if(!(dn||res)||!a.av||!CUR||(CUR.id!=='home'&&CUR.id!=='visit'))return;   /* (on the floor from the moment they said yes, through the countdown, and while the result card shows: run 4, stage 3) */\n  let f=DANCE.on||res?DANCE.floor:dnFloor();if(!f)return;let c=DANCE.on||res?DANCE.cam:null;")
ed("const rx=c.dz,rz=-c.dx,s=dn.ld?-1:1,x=f.x+rx*.75*s,z=f.z+rz*.75*s;",
   "if(dn)a.dnLd=dn.ld;const rx=c.dz,rz=-c.dx,s=a.dnLd?-1:1,x=f.x+rx*.75*s,z=f.z+rz*.75*s;")
ed("if(dn.mv!==a.dnMv){a.dnMv=dn.mv;if(dn.mv>=0){a.dnT=.65;a.dnK=dnPattern(dn.r)[dn.mv].d;}}","if(dn&&dn.mv!==a.dnMv){a.dnMv=dn.mv;if(dn.mv>=0){a.dnT=.65;a.dnK=dnPattern(dn.r)[dn.mv].d;}}")
ed("body.dancing #joy,body.dancing #moveBtns,body.dancing #actWrap,body.dancing #pad,body.dancing #job{visibility:hidden}",
   "body.dancing #joy,body.dancing #moveBtns,body.dancing #actWrap,body.dancing #pad,body.dancing #job,body.dancing #note,body.dancing #toast{visibility:hidden}\n@media (orientation:portrait){#dnLane{height:min(36vh,300px)}}")
bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
