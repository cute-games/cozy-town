/* grazeNecks (31 Oct): sheep and cow grazing with the new necks (Living round 42). Only the model's own groups turn/slide. */
(()=>{const H=window.MVH;const {cell,stage,jointed,jReset,jGround,jWalk3,sheepIdle,cumOf,dbg,seg,bell,ease,cl,S2,C2,P_,TAU}=H;
function aim(C,tx,ty,tz,d,yaw,pitch){C.position.set(tx+Math.sin(yaw)*Math.cos(pitch)*d,ty+Math.sin(pitch)*d,tz+Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(tx,ty,tz);C.near=d/50;C.far=d*40;C.updateProjectionMatrix();}
/* exact lowest points: sample each mesh's vertices once, transform with current world matrices */
function pts(g,step){const out=[];g.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.attributes.position){const p=o.geometry.attributes.position;const v=[];for(let i=0;i<p.count;i+=step)v.push(new THREE.Vector3(p.getX(i),p.getY(i),p.getZ(i)));out.push({o,v});}});return out;}
const _v=new THREE.Vector3();
function lowY(L){let m=1e9;for(const {o,v} of L){const M=o.matrixWorld;for(const q of v){_v.copy(q).applyMatrix4(M);if(_v.y<m)m=_v.y;}}return m;}
function prep(R){R.pHead=pts(R.m.head,1);R.pLegs=R.m.legs.map(l=>pts(l,1));return R;}
function feet(R){R.root2.updateMatrixWorld(true);return R.pLegs.map(lowY);}
/* level the body so front and back feet are on the same ground (body tilt only) */
function level(R,base){const m=R.m;let lo=base-.25,hi=base+.35;for(let i=0;i<14;i++){const mid=(lo+hi)/2;m.b.rotation.x=mid;const f=feet(R);const d=Math.min(f[0],f[1])-Math.min(f[2],f[3]);if(d>0)lo=mid;else hi=mid;}m.b.rotation.x=(lo+hi)/2;}
/* solve one setter value in [lo,hi] so the muzzle's lowest point sits h above the lowest foot (bisection, direction found from the ends) */
function gap(R){R.root2.updateMatrixWorld(true);return lowY(R.pHead)-Math.min(...R.pLegs.map(lowY));}
function reach(R,h,set,lo,hi){set(lo);const dl=gap(R)-h;set(hi);const dh=gap(R)-h;if(dl*dh>0){set(Math.abs(dl)<Math.abs(dh)?lo:hi);R.miss=Math.min(Math.abs(dl),Math.abs(dh));return;}R.miss=0;
  let a=lo,b=hi,sa=dl;for(let i=0;i<16;i++){const mid=(a+b)/2;set(mid);const d=gap(R)-h;if((d>0)===(sa>0)){a=mid;sa=d;}else b=mid;}set((a+b)/2);}
/* world scale of the body group (neck slides are in body units) */
function bScale(R){R.root2.updateMatrixWorld(true);return new THREE.Vector3().setFromMatrixScale(R.m.b.matrixWorld).y;}
/* safety: if the muzzle would go under the grass, slide the neck up just enough */
function floorClamp(R,hMin){for(let i=0;i<3;i++){const g=gap(R);if(g>=hMin-1e-4)return;R.m.neck.position.y+=(hMin-g)/R.sc+.0005;}}
/* SHEEP graze, k 0..1: Living's recipe (neck slide z +.3, y -.12, neck turn +1.6, head +.4) without the body tilt (it lifted the back hooves 9 cm),
   neck turn a little less (nr) so the muzzle lands in front of the hooves, and the neck slid down by dy (solved once) so the muzzle just touches */
function sPose(R,k){const m=R.m;m.neck.position.z+=.3*k;m.neck.position.y+=(-.12+R.dy)*k;m.neck.rotation.x+=(1.6+R.nr)*k;m.head.rotation.x+=.4*k;}
function sheepR(o,lamb){const R=prep(jointed('farm:sheep',o));R.lamb=!!lamb;R.nr=lamb?-.4:-.3;R.dy=0;jReset(R);R.sc=bScale(R);sPose(R,1);const y0=R.m.neck.position.y;
  reach(R,.006,v=>R.m.neck.position.y=v,y0-.4,y0+.3);R.dy=R.m.neck.position.y-y0;R.root2.updateMatrixWorld(true);
  jReset(R);R.root2.updateMatrixWorld(true);R.leg=R.m.legs[0].getWorldPosition(new THREE.Vector3()).y-lowY(R.pLegs[0]);dbg('sheep',lamb?'lamb':'adult','dy',R.dy,'miss',R.miss,'leg',R.leg);return R;}
/* COW graze, k 0..1: approved cowGrazeK + neck z +.10 (= +.45, Living), body kept level so all four hooves stay on the grass,
   neck turned .4 less so the muzzle is well in front of the hooves, neck slid down by dy (solved once) so the muzzle just touches */
function cPose(R,k){const m=R.m;H.cowGrazeK(R,k);m.neck.position.z+=.10*k;m.b.rotation.x=R.rest.b.r.x+R.tilt*k;m.neck.rotation.x+=R.nr*k;m.neck.position.y+=R.dy*k;}
function cowR(){const R=prep(jointed('farm:cow'));R.nr=-.4;R.dy=0;R.tilt=.1;jReset(R);R.sc=bScale(R);cPose(R,1);level(R,R.m.b.rotation.x);R.tilt=R.m.b.rotation.x-R.rest.b.r.x;
  jReset(R);cPose(R,1);const y0=R.m.neck.position.y;reach(R,.006,v=>R.m.neck.position.y=v,y0-.4,y0+.3);R.dy=R.m.neck.position.y-y0;jReset(R);dbg('cow tilt',R.tilt,'dy',R.dy,'miss',R.miss);return R;}
/* one bite: u 0..1 → muzzle on the grass (0–.3), tear up and to the side (.3–.5), chew while the head sinks back (.5–1) */
function bite(u){const lift=u<.3?0:u<.45?.7*seg(u,.3,.45):.7*(1-seg(u,.7,.98));return {lift,tear:bell(u,.3,.52),chew:u>.45&&u<.95?Math.sin(TAU*3*(u-.45)/.5):0,nib:u<.3?bell(u,0,.3):0};}
/* sheep timeline (one loop): graze with bites, lift, look round, down again */
function sProf(t){const k=1-seg(t,.5,.6)+seg(t,.82,.94);const up=1-k;const look=bell(t,.6,.82);return {k,look,lr:Math.sin(TAU*cl((t-.6)/.22)),up};}
function sheepAct(R,t,pr,nb,side){const m=R.m;sPose(R,pr.k);const b=bite((nb*t)%1),a=pr.k*pr.k,sd=Math.floor(nb*t)%2?1:-1;
  m.head.rotation.x+=-.32*b.lift*a+.05*b.nib*a-.12*pr.look;m.neck.rotation.x+=-.1*b.lift*a;m.head.rotation.z+=(.16*b.tear*sd+.035*b.chew)*a+.03*Math.sin(TAU*12*t)*pr.up;
  m.head.rotation.y+=.75*pr.lr*pr.look*(side||1);}
function camAim(C,tx,ty,tz,d,yaw,pitch){aim(C,tx,ty,tz,d,yaw,pitch);}
function tufts(S,n,x0,x1,z0,z1,h0,h1,seed){return H.grassPatch(S,n,x0,x1,z0,z1,h0,h1,seed);}

const cellSheep=()=>cell('Sheep grazes','muzzle on the grass, bites, chews, looks round',()=>{const R=sheepR({});const st=stage(R,{});
  tufts(st.S,60,.35,1.05,-.35,.35,.03,.08,5);camAim(st.C,.25,.4,0,3.2,.8,.14);
  return {S:st.S,C:st.C,tick:t=>{jReset(R);const pr=sProf(t);sheepAct(R,t,pr,6);sheepIdle(R,t,0,1);floorClamp(R,.004);jGround(R);}};});

const cellFlock=()=>cell('Flock grazes','each on its own time; one by one they step on',()=>{
  const C=FARM_COLS.sheep;const defs=[{c:C[0],x:.95,z:-.55,off:0,s:.2,side:1},{c:C[0],x:-.55,z:.85,off:.3,s:.66,side:-1},{c:C[1],x:-1.0,z:-1.35,off:.62,s:.4,side:1},{c:C[0],x:.62,z:.2,off:.45,s:.225,lamb:true,side:-1}];
  const Rs=defs.map(d=>{const R=sheepR({c:d.c,age:d.lamb?'baby':'adult'},d.lamb);R.d=d;return R;});const R0=Rs[0];
  const st=stage(R0,{zoom:1.7,cy:.4,yaw:.5,pitch:.3});camAim(st.C,.1,.3,-.25,6.0,.55,.3);const S=st.S;Rs.slice(1).forEach(R=>{S.add(R.root2);RIG.addShadow(R,S);});
  const A=.32,WL=.14,WLL=.3;Rs.forEach(R=>{const s=R.d.s,WL=R.lamb?WLL:.14;R.wk=t=>seg(t,s,s+.03)*(1-seg(t,s+WL-.03,s+WL));R.cum=cumOf(R.wk,720);let Wi=0;for(let k=0;k<720;k++)Wi+=R.wk((k+.5)/720)/720;R.Wi=Wi;});
  const fA=1/(WL-.02);const tg=new THREE.Group();S.add(tg);const D=2*R0.leg*Math.sin(A)*fA*R0.Wi;Rs.forEach(R=>{R.f=D/(2*R.leg*Math.sin(A)*R.Wi);});for(let k=-24;k<=24;k++){const gp=H.grassPatch(tg,10,0,D,-2.2,1.6,.03,.07,13);gp.position.x=k*D;}st.fit(D);dbg('flock D',D,'lamb f',Rs[3].f,'adult f',R0.f);
  return {S,C:st.C,tick:t=>{const cm=D*Rs.reduce((s,R)=>s+R.cum(t),0)/Rs.length;st.setDist(cm);tg.position.x=-cm;
    Rs.forEach((R,k)=>{jReset(R);const d=R.d,w=R.wk(t),tau=(t+d.off)%1;jWalk3(R,R.f*t+k*.13,A,w);
      const pr=sProf(tau);const ks=d.lamb?pr.k*(1-bell(t,d.s-.03,d.s+WLL+.03)):Math.min(pr.k,1-.45*bell(t,d.s-.02,d.s+WL+.02));pr.k=ks;pr.up=1-ks;
      sheepAct(R,tau,pr,d.lamb?4:5,d.side);sheepIdle(R,t,k,1-w);floorClamp(R,.004);R.root2.position.set(d.x+D*R.cum(t)-cm,0,d.z);jGround(R);});}};});

const cellCow=()=>cell('Cow grazes','round neck down, tears, chews, steps, looks round',()=>{const R=cowR();const st=stage(R,{zoom:.8,yaw:.75,pitch:.22});camAim(st.C,.45,.8,0,5.6,.85,.18);
  const D=R.L*.16;const g=new THREE.Group();st.S.add(g);for(let k=-8;k<=8;k++){const gp=H.grassPatch(g,26,0,D,-R.W*1.8,R.W*1.8,.06,.16,11);gp.position.x=k*D;}st.fit(D);
  return {S:st.S,C:st.C,tick:t=>{jReset(R);const m=R.m;const k=1-seg(t,.66,.74)+seg(t,.88,.98);cPose(R,k);
    const step=seg(t,.42,.6),sb=bell(t,.42,.6);if(sb>0){const ph=(t-.42)/.18;m.legs.forEach((u,i)=>{const f=TAU*(ph+[.25,.75,0,.5][i]);u.rotation.x+=-.2*Math.sin(f)*sb;m.lower[i].rotation.x+=.6*Math.max(0,Math.cos(f))*sb;});}
    const a=k*k*(1-bell(t,.42,.6));const bt=(7*t)%1;const b=bite(bt);const side=Math.floor(7*t)%2?1:-1;
    m.neck.rotation.x+=(-.12*b.lift+.04*b.nib)*a;m.head.rotation.y+=(.3*b.tear*side)*a;m.head.rotation.x+=(-.22*b.lift)*a;const hc=m.head.children[0];hc.rotation.y=.09*(b.chew*a+Math.sin(TAU*8*t)*(1-k));
    const look=bell(t,.74,.88);m.head.rotation.y+=-.6*Math.sin(TAU*cl((t-.74)/.14))*look;m.head.rotation.x+=-.1*look;
    m.tail.rotation.z=.2*S2(t*2)+.8*bell(t,.8,.9);m.tail.rotation.x=.25*bell(t,.8,.9);
    floorClamp(R,.004);const dist=D*step;g.position.x=-dist;st.setDist(dist);jGround(R);}};});

CLIPS2.grazeNecks={title:'Grazing with the new necks',cols:3,cw:320,ch:260,frames:72,cells:[cellSheep(),cellFlock(),cellCow()]};})();
