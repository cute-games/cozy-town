/* farmFeed (31 Oct): anyone can feed and pet the farm animals; the feed bucket at the farm is free.
   Rules kept: only the models' own groups turn/slide (jointed cow, sheep, pig, chicken), horse and player = baked rig with {rigid:true};
   contact heights are measured (raycasts / lowest vertices), never guessed. */
(()=>{const H=window.MVH;const {cell,stage,mk,cl,ease,seg,bell,S2,C2,P_,TAU,cumOf,crouchP,armLen,dbg,jointed,jReset,jGround,jWalk,jWalk3,legAng,sheepIdle,cowGrazeK}=H;
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const PH=1.45;/* the player's height, as in the approved farm sets */
function player(S){const Q=mk('farm:farmer',{who:'a'},'human',undefined,{rigid:true});const sc=PH/Q.H;Q.root2.scale.setScalar(sc);Q.sc=sc;if(S){S.add(Q.root2);RIG.addShadow(Q,S);}return Q;}
/* hand point in the person's own (root) space for arm angle a and side swing w (same maths as MVH.handW / farmChores) */
function hl(R,i,a,w){const A=R.arms[i],l=armLen(A);let x=A.x+Math.sin(a)*l*.97,y=A.top-Math.cos(a)*l*.97,z=A.z;
  if(w){const s=Math.sign(A.z)||1,c=Math.cos(w*s),sn=Math.sin(w*s),pz=A.wz!=null?A.wz:A.z*.4,dy=y-A.top,dz=z-pz;y=A.top+dy*c-dz*sn;z=pz+dy*sn+dz*c;}return V(x,y,z);}
function solveL(R,i,Tw,wMax){R.root2.updateMatrixWorld(true);const T=R.root.worldToLocal(Tw.clone());let best=1e9,ba=0,bw=0;wMax=wMax??.7;
  for(let a=-.6;a<=3.0;a+=.04)for(let w=-wMax;w<=wMax+1e-6;w+=.05){const d=hl(R,i,a,w).distanceTo(T);if(d<best){best=d;ba=a;bw=w;}}
  for(let a=ba-.04;a<=ba+.04;a+=.01)for(let w=bw-.05;w<=bw+.05;w+=.0125){const d=hl(R,i,a,w).distanceTo(T);if(d<best){best=d;ba=a;bw=w;}}
  return [ba,bw,best*R.root2.scale.x];}
function handWorld(R,i,a,w){R.root2.updateMatrixWorld(true);return R.root.localToWorld(hl(R,i,a,w));}
const armWorldLen=Q=>armLen(Q.arms[0])*.97*Q.sc;
/* walking person: planted-ish feet (distance follows the leg cycles) */
const WALK={g:'biped',A:.45,B:.85};
function walkPose(Q,ph,w){const P=H.walkP(Q,WALK,ph,{},w);P.floor=true;return P;}
const cycLen=Q=>RIG.stride(Q,WALK.A,1)*Q.sc;
function aim(C,tx,ty,tz,d,yaw,pitch){C.position.set(tx+Math.sin(yaw)*Math.cos(pitch)*d,ty+Math.sin(pitch)*d,tz+Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(tx,ty,tz);C.near=d/50;C.far=d*40;C.updateProjectionMatrix();}
/* exact lowest points of groups (vertices with current world matrices) */
function pts(g,step){const out=[];g.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.attributes.position){const p=o.geometry.attributes.position;const v=[];for(let i=0;i<p.count;i+=step||1)v.push(V(p.getX(i),p.getY(i),p.getZ(i)));out.push({o,v});}});return out;}
const _v=V(0,0,0);
function lowY(L){let m=1e9;for(const {o,v} of L){if(!o.visible)continue;const M=o.matrixWorld;for(const q of v){_v.copy(q).applyMatrix4(M);if(_v.y<m)m=_v.y;}}return m;}
function lowPt(L){let m=1e9,best=V(0,0,0);for(const {o,v} of L){const M=o.matrixWorld;for(const q of v){_v.copy(q).applyMatrix4(M);if(_v.y<m){m=_v.y;best.copy(_v);}}}return best;}
function bbOf(L){const bb=new THREE.Box3();for(const {o,v} of L){const M=o.matrixWorld;for(const q of v)bb.expandByPoint(_v.copy(q).applyMatrix4(M));}return bb;}
/* how deep any vertex of L sits inside any of the boxes (0 = clean) */
function pen(L,boxes){let d=0;for(const {o,v} of L){if(!o.visible)continue;const M=o.matrixWorld;for(const q of v){_v.copy(q).applyMatrix4(M);for(const b of boxes){if(_v.x>b.min.x&&_v.x<b.max.x&&_v.y>b.min.y&&_v.y<b.max.y&&_v.z>b.min.z&&_v.z<b.max.z){const e=Math.min(_v.x-b.min.x,b.max.x-_v.x,_v.y-b.min.y,b.max.y-_v.y,_v.z-b.min.z,b.max.z-_v.z);if(e>d)d=e;}}}}return d;}
const rc=new THREE.Raycaster();
function topAt(obj,x,z){obj.updateWorldMatrix(true,true);rc.set(V(x,9,z),V(0,-1,0));const h=rc.intersectObject(obj,true).filter(i=>i.object.visible&&i.object.material&&i.object.material.side!==THREE.BackSide);return h.length?h[0].point.y:null;}
const MAT={};const mat=c=>MAT[c]||(MAT[c]=new THREE.MeshLambertMaterial({color:c}));
const FEED=['#e8b04a','#c98a3a','#f2d27a','#a8714a'];
function bit(S,r,c){const m=new THREE.Mesh(new THREE.SphereGeometry(r,6,4),mat(c));m.scale.y=.75;S.add(m);return m;}
/* the feed bucket = the model's own pieces: the handle (torus) hangs on its hinge; the pail turns about the hinge (it is a hinged handle) */
function bucket(S){const g=new THREE.Group();PU['farm:bucket'].build(g,PU['farm:bucket'].dflt||{});const hinge=V(0,.3,0);
  const G=new THREE.Group(),body=new THREE.Group(),handle=new THREE.Group();G.add(body);G.add(handle);S.add(G);
  const kids=g.children.slice();kids.forEach(o=>{o.position.sub(hinge);if(o.isMesh&&o.geometry&&o.geometry.type==='TorusGeometry')handle.add(o);else body.add(o);});
  let hTop=.16;handle.updateMatrixWorld(true);const hb=new THREE.Box3().setFromObject(handle);hTop=hb.max.y-G.position.y;
  return {G,body,handle,hTop,mouthY:-.03,bottomY:-.3,
    /* hang from a hand point p (world), yaw = which way the pail tips (its local +z), tip = turn about the hinge */
    hang(p,yaw,tip){G.position.set(p.x,p.y-this.hTop,p.z);G.rotation.set(0,yaw||0,0);body.rotation.set(tip||0,0,0);G.updateMatrixWorld(true);},
    mouthW(){return body.localToWorld(V(0,this.mouthY,0));},lipW(){return body.localToWorld(V(0,this.mouthY,.15));},bottomW(){return body.localToWorld(V(0,this.bottomY,0));},
    setDown(x,z){G.position.set(x,.3,z);G.rotation.set(0,0,0);body.rotation.set(0,0,0);}};}

/* ---------------- 1. Feed the trough ---------------- */
function jR(id,o){const R=jointed(id,o);R.pHead=pts(R.m.head,1);R.pLegs=R.m.legs.map(l=>pts(l,1));R.pAll=pts(R.turn,1);R.root2.updateMatrixWorld(true);
  {const n=R.m.legs.length-1;R.leg=R.m.legs[n].getWorldPosition(V(0,0,0)).y-lowY(R.pLegs[n]);}return R;}
function feet(R){R.root2.updateMatrixWorld(true);return R.pLegs.map(lowY);}
function gap(R){R.root2.updateMatrixWorld(true);return lowY(R.pHead)-Math.min(...R.pLegs.map(lowY));}
function bis(f,lo,hi,target){const fl=f(lo)-target,fh=f(hi)-target;if(fl*fh>0)return Math.abs(fl)<Math.abs(fh)?lo:hi;let a=lo,b=hi,sa=fl;for(let i=0;i<22;i++){const m=(a+b)/2,d=f(m)-target;if((d>0)===(sa>0)){a=m;sa=d;}else b=m;}return (a+b)/2;}
/* cow at the trough: approved graze recipe (cowGrazeK + neck slide to +.45), body kept level, k solved so the muzzle sits on the feed */
function cowPose(R,k){const m=R.m;cowGrazeK(R,k);m.neck.position.z+=.10*k;m.b.rotation.x=R.rest.b.r.x+(R.tilt||0)*k;}
function cowLevel(R){jReset(R);cowPose(R,1);let lo=R.rest.b.r.x-.25,hi=R.rest.b.r.x+.35;for(let i=0;i<14;i++){const mid=(lo+hi)/2;R.m.b.rotation.x=mid;const f=feet(R);const d=Math.min(f[0],f[1])-Math.min(f[2],f[3]);if(d>0)lo=mid;else hi=mid;}R.tilt=(lo+hi)/2-R.rest.b.r.x;}
/* sheep: the approved sheep graze recipe (neck slide z +.3, y -.12, neck turn, head turn), amount k solved */
function sheepPose(R,k){const m=R.m;m.neck.position.z+=.3*k;m.neck.position.y+=-.12*k;m.neck.rotation.x+=1.3*k;m.head.rotation.x+=.4*k;}
/* walk-in weight → distance with planted feet */
/* in and back out: f(t) = 0 → 1 (a..b) and back to 0 (c..d); w = walking weight */
function inOut(a,b,c,d){const A=walkIn(a,b),B=walkIn(c,d);return {f:t=>A.cum(t)-B.cum(t),w:t=>A.wk(t)+B.wk(t)};}
function walkIn(a,b){const wk=t=>seg(t,a,a+.04)*(1-seg(t,b-.05,b));const cum=cumOf(wk,960);let Wi=0;for(let k=0;k<960;k++)Wi+=wk((k+.5)/960)/960;return {wk,cum,Wi};}
function troughCell(){return cell('Feed the trough','player stand-in pours; all come to eat',()=>{
  const Q=player();const st=stage(Q,{zoom:1});const S=st.S;
  const tr=H.propB('farm:trough');tr.root.rotation.y=P_/2;S.add(tr.root);tr.root.updateMatrixWorld(true);H.floorShadow(S,0,0,1.0,.42);
  const boxes=[];tr.root.traverse(o=>{if(o.isMesh)boxes.push(new THREE.Box3().setFromObject(o));});
  const wt=topAt(tr.root,0,0);const TB=new THREE.Box3().setFromObject(tr.root);
  let inner=null;tr.root.traverse(o=>{if(o.isMesh){const b=new THREE.Box3().setFromObject(o);if(b.max.y>wt-.005&&b.max.x-b.min.x>1.4&&b.max.z-b.min.z<.5){if(!inner||b.max.z-b.min.z<inner.max.z-inner.min.z)inner=b;}}});
  /* the feed layer on the trough top (poured at the right end, it spreads left) */
  const IX0=inner.min.x+.02,IX1=inner.max.x-.02,IZ=(inner.max.z-inner.min.z)/2-.02,FT=wt+.03;
  const layer=new THREE.Mesh(new THREE.BoxGeometry(1,.03,IZ*2),mat('#d9a557'));S.add(layer);
  const lbits=[];for(let i=0;i<46;i++){const b=bit(S,.016,FEED[i%4]);b.userData.x=IX0+(IX1-IX0)*((i*37)%46)/46;b.userData.z=(((i*53)%23)/23-.5)*IZ*1.7;b.position.set(b.userData.x,FT,b.userData.z);lbits.push(b);}
  const stream=[];for(let i=0;i<16;i++)stream.push(bit(S,.026,FEED[i%4]));
  /* animals */
  const cow=jR('farm:cow');S.add(cow.root2);RIG.addShadow(cow,S);cow.root2.rotation.y=-P_/2;
  const shp=jR('farm:sheep');S.add(shp.root2);RIG.addShadow(shp,S);shp.root2.rotation.y=-P_/2;
  const pig=jR('farm:pig');S.add(pig.root2);RIG.addShadow(pig,S);pig.root2.rotation.y=P_;
  const bk=bucket(S);
  cowLevel(cow);
  const place=(R,poseFn,mx,label)=>{R.kE=bis(k=>{jReset(R);poseFn(R,k);return gap(R);},0,1,FT+.006);jReset(R);poseFn(R,R.kE);R.root2.position.set(0,0,0);jGround(R);const mp=lowPt(R.pHead);
    R.eat=V(mx-mp.x,0,inner.min.z+.1-mp.z);for(let i=0;i<12;i++){R.root2.position.copy(R.eat);jGround(R);if(pen(R.pAll,boxes)<1e-4)break;R.eat.z-=.01;}
    dbg(label,'kE',R.kE.toFixed(3),'eat',R.eat.x.toFixed(2),R.eat.z.toFixed(2),'muzzle',lowPt(R.pHead).toArray().map(x=>x.toFixed(3)).join(','),'pen',pen(R.pAll,boxes).toFixed(4),'feet',R.pLegs.map(lowY).map(x=>x.toFixed(3)).join(','));};
  place(cow,cowPose,-.5,'cow');place(shp,sheepPose,.42,'sheep');
  /* pig: the model is too short to reach over the trough rim (or into a standing bucket), so the player offers it the tipped bucket at snout height */
  const pigSnout=R=>{R.root2.updateMatrixWorld(true);return bbOf(R.pHead);};
  /* timings */
  const cowW=inOut(.2,.31,.88,.98),shW=inOut(.23,.34,.9,.995),pigW=inOut(.42,.56,.79,.9);const cA=.24,cB=.85,sA=.32,pA=.4;
  const cowD=.4,shD=.38,pigD=.75;const cowCyc=cowD/H.jStride(cow,cA,1),shCyc=shD/(2*shp.leg*Math.sin(sA)),pigCyc=pigD/(2*pig.leg*Math.sin(pA));
  /* player: walks in from the right with the bucket in the near hand, lifts it (arm swings out to the side and up, then forward over the trough end), tips it, then turns and offers the rest to the pig */
  const PX0=1.26,PX1=1.26,PZ=-.02;const pW={wk:()=>0,cum:()=>1};const pCyc=1;const AL=armWorldLen(Q);
  const shW_=i=>{Q.root2.updateMatrixWorld(true);const A=Q.arms[i];return Q.root.localToWorld(V(A.x,A.top,A.z));};
  const TH0=P_,TH1=P_+1.05;/* facing the trough end, then turned toward the front left (the pig) */
  const dirs=[null,V(-.15,-.25,1),V(-.1,.45,1),V(-.9,.45,-.15)];/* carry (filled in), out to the side, side and up, forward-up over the trough */
  const along=(k)=>{/* k 0..3 along the waypoints */const i=Math.min(2,Math.floor(k)),f=ease(k-i);return dirs[i].clone().normalize().lerp(dirs[i+1].clone().normalize(),f).normalize();};
  const KF=[[.3,-.85]];const DIRS=[V(-.1,.5,1),V(-.45,1,.35),V(-.9,.5,-.08)];const NK=DIRS.length;
  /* the lift path: hand directions from the shoulder (side and up, over the top, forward-up), solved once with a continuous arm (no flips) */
  const TAB=[];const buildTab=()=>{poseQ(.14);const sh=shW_(1);const d0=handWorld(Q,1,KF[0][0],KF[0][1]).sub(sh).normalize();const ds=[d0,...DIRS.map(d=>d.clone().normalize())];let pa=KF[0][0],pw=KF[0][1];
    const T0=Q.root.worldToLocal.bind(Q.root);
    for(let j=0;j<=NK*60;j++){const k=j/60,i=Math.min(NK-1,Math.floor(k)),f=ease(k-i);const d=ds[i].clone().lerp(ds[i+1],f).normalize();const T=T0(sh.clone().addScaledVector(d,AL));
      let best=1e9,ba=pa,bw=pw;for(let a=pa-.3;a<=pa+.3;a+=.01)for(let w=pw-.3;w<=pw+.3;w+=.01){const e=hl(Q,1,a,w).distanceTo(T);if(e<best){best=e;ba=a;bw=w;}}pa=ba;pw=bw;TAB.push([ba,bw,best*Q.sc]);}
    dbg('lift path worst miss',Math.max(...TAB.map(x=>x[2])).toFixed(4));};
  const armK=k=>{const x=cl(k/NK)*(TAB.length-1),i=Math.min(TAB.length-2,Math.floor(x)),f=x-i;return [TAB[i][0]+(TAB[i+1][0]-TAB[i][0])*f,TAB[i][1]+(TAB[i+1][1]-TAB[i][1])*f];};
  const crouchK=t=>.35*seg(t,.46,.54)*(1-seg(t,.87,.92));
  const pW2_=inOut(.4,.5,.9,.985),pW2={cum:pW2_.f,wk:pW2_.w},PX2=1.36,PZ2=.48,pCyc2=Math.hypot(PX2-PX1,PZ2-PZ)/cycLen(Q);
  const poseQ=(t)=>{const u2=pW2.cum(t),u=u2*pCyc2,w=pW.wk(t)+pW2.wk(t);Q.root2.position.set(PX0+(PX1-PX0)*pW.cum(t)+(PX2-PX1)*u2,0,PZ+(PZ2-PZ)*u2);Q.root2.rotation.set(0,TH0+(TH1-TH0)*seg(t,.4,.5)*(1-seg(t,.9,.985)),0);
    let P=w>0.001?walkPose(Q,u,w):{floor:true};const ck=crouchK(t);if(ck>0){P=crouchP(Q,ck,P,.5*ck);P.floor=true;}P.arm=[.12*S2(u)*w,KF[0][0]];P.wing=[.05,KF[0][1]];RIG.pose(Q,P);return P;};
  buildTab();
  /* the offer: hand forward and low, the bucket tipped toward the pig */
  const OFFER={a:1.05,w:-.3,tip:1.35};
  /* the pig's snout tip (front-most head points) at rest, pig facing +x */
  jReset(pig);pig.root2.position.set(0,0,0);pig.root2.rotation.y=0;jGround(pig);
  const snout=()=>{pig.root2.updateMatrixWorld(true);const bb=bbOf(pig.pHead);const c=V(0,0,0);let n=0;for(const {o,v} of pig.pHead){const M=o.matrixWorld;for(const q of v){_v.copy(q).applyMatrix4(M);if(_v.x>bb.max.x-.025){c.add(_v);n++;}}}return {tip:bb.max.x,c:c.multiplyScalar(1/n)};};
  const sn0=snout();
  const offerAt=a=>{const P=poseQ(.75);P.arm[1]=a;P.wing[1]=OFFER.w;RIG.pose(Q,P);const h=handWorld(Q,1,a,OFFER.w);bk.hang(h,-P_/2,OFFER.tip);return h;};
  OFFER.a=bis(a=>{offerAt(a);return bk.mouthW().y;},.3,1.6,sn0.c.y);const offerH=offerAt(OFFER.a);const mouth=bk.mouthW();
  pig.eat=V(mouth.x-sn0.tip-.04,0,mouth.z-sn0.c.z);pig.root2.position.copy(pig.eat);jGround(pig);const snY=sn0.c.y;
  /* pail-wall test: pig head points inside the pail (local) but outside the open mouth = touching the wall or bottom */
  const pailHit=()=>{let d=0;bk.body.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(bk.body.matrixWorld).invert();for(const {o,v} of pig.pHead){const M=o.matrixWorld;for(const q of v){_v.copy(q).applyMatrix4(M).applyMatrix4(inv);const r=Math.hypot(_v.x,_v.z);if(_v.y<-.02&&_v.y>-.32&&r<.18){d=Math.max(d,Math.min(-.02-_v.y,.18-r));}}}return d;};
  dbg('offer hand',offerH.toArray().map(x=>x.toFixed(2)).join(','),'mouth',mouth.toArray().map(x=>x.toFixed(2)).join(','),'pig snout height',snY.toFixed(3),'pail hit',pailHit().toFixed(4),'pig eat',pig.eat.x.toFixed(2),pig.eat.z.toFixed(2));
  const MX={pen:{cow:0,sheep:0,pig:0},bucket:0,pail:0,reach:0};
  aim(st.C,.3,.5,-.05,5.4,-.28,.4);
  return {S,C:st.C,tick:t=>{
    /* ---- player ---- */
    const P=poseQ(t);let tip=0,arm1=KF[0].slice();
    if(!dirs[0]){Q.root2.updateMatrixWorld(true);dirs[0]=handWorld(Q,1,.55,-.25).sub(shW_(1));}
    if(t>=.04&&t<.38){const k=t<.22?NK*seg(t,.04,.14):NK*(1-seg(t,.28,.38));arm1=armK(k);
      tip=1.95*seg(t,.14,.18)*(1-seg(t,.24,.28));}
    if(t>=.4){const k=seg(t,.42,.52)*(1-seg(t,.87,.93));arm1=[KF[0][0]+(OFFER.a-KF[0][0])*k,KF[0][1]+(OFFER.w-KF[0][1])*k];tip=OFFER.tip*seg(t,.46,.54)*(1-seg(t,.86,.9));}
    P.arm[1]=arm1[0];P.wing[1]=arm1[1];P.hy=.12*bell(t,.56,.8)*S2(t*4);RIG.pose(Q,P);if(Q.shadow)H.fixShadow(Q);
    const hand=handWorld(Q,1,arm1[0],arm1[1]);bk.hang(hand,-P_/2,tip);
    {const bp=pen(pts(bk.G,1),boxes);if(bp>MX.bucket)MX.bucket=bp;if(t>.12&&t<.45)dbg('t',t.toFixed(3),'arm',arm1.map(x=>x.toFixed(2)).join(','),'hand',hand.toArray().map(x=>x.toFixed(2)).join(','),'bucket pen',bp.toFixed(3),'bucket low',bbOf(pts(bk.G,1)).min.y.toFixed(3),'tip',tip.toFixed(2));}
    /* ---- the pour ---- */
    const fill=seg(t,.15,.32),eat=seg(t,.4,.86);layer.visible=fill>.01&&eat<.98;const xl=IX1-(IX1-IX0)*fill;layer.scale.x=Math.max(.001,IX1-xl);layer.scale.y=Math.max(.02,1-eat);layer.position.set((IX1+xl)/2,FT-.03+.015*layer.scale.y,0);
    lbits.forEach((b,i)=>{b.visible=fill>.01&&b.userData.x>xl&&i/lbits.length>=eat;b.position.y=FT-.03*eat;});
    const lip=bk.lipW();stream.forEach((b,i)=>{const ph=((t-.14)*9+i/stream.length)%1;const on=t>.145&&t<.27&&tip>1.2;b.visible=on;if(on){const fall=ph*.36;b.position.set(lip.x-.08*ph-.02*(i%3),lip.y-4.9*fall*fall,lip.z+.03*((i%5)-2)/2);if(b.position.y<FT){b.visible=false;}}});
    /* ---- cow and sheep: walk up, eat with chewing nods ---- */
    const eatAnim=(R,W,cyc,D,poseFn,A,t0,kind)=>{jReset(R);const m=R.m;const uu=W.f(t),ww=W.w(t);
      if(kind==='cow')jWalk(R,cyc*uu,A,cB*ww);else jWalk3(R,cyc*uu,A,ww);
      const up=kind==='cow'?seg(t,.83,.88):seg(t,.85,.9);const k=R.kE*seg(t,t0,t0+.06)*(1-up);if(k>0)poseFn(R,k);const e=seg(t,t0+.05,t0+.08)*(1-up);
      const nod=Math.max(0,Math.sin(TAU*((t-t0)*7)))*e;
      if(kind==='cow'){m.neck.rotation.x+=-.07*nod;m.head.children[0].rotation.y=.09*Math.sin(TAU*14*t)*e;m.tail.rotation.z=.25*S2(2*t)+.7*bell(t,.6,.7);}
      else if(kind==='sheep'){m.head.rotation.x+=-.12*nod;m.head.rotation.z=.04*Math.sin(TAU*14*t)*e;sheepIdle(R,t,1,1-ww);}
      R.root2.position.copy(R.eat);if(kind==='pig')R.root2.position.x+=D*(1-uu);else R.root2.position.z-=D*(1-uu);jGround(R);
      const p=pen(R.pAll,boxes);if(p>MX.pen[kind])MX.pen[kind]=p;};
    eatAnim(cow,cowW,cowCyc,cowD,cowPose,cA,.31,'cow');eatAnim(shp,shW,shCyc,shD,sheepPose,sA,.34,'sheep');
    /* pig: trots up to the offered bucket, snout in, eats with little nods, curly tail wiggles */
    {const R=pig,m=R.m;jReset(R);const uu=pigW.f(t),ww=pigW.w(t);jWalk3(R,pigCyc*uu,pA,ww);const e=seg(t,.56,.6)*(1-seg(t,.76,.8));const nod=(1-Math.cos(TAU*((t-.56)*8)))/2*e;
      m.head.rotation.x=R.rest.head.r.x-.12*nod;m.tail.rotation.z=.6*Math.sin(TAU*10*t);R.root2.position.copy(R.eat);R.root2.position.x-=pigD*(1-uu);jGround(R);
      const ph=pailHit();if(ph>MX.pail)MX.pail=ph;const pp=pen(R.pAll,boxes);if(pp>MX.pen.pig)MX.pen.pig=pp;}
    if(t>.985)dbg('trough cell max pen',JSON.stringify(MX.pen),'bucket in trough',MX.bucket.toFixed(4),'pig in pail',MX.pail.toFixed(4),'hand miss',MX.reach.toFixed(3));
  }};});}

/* ---------------- 2. Chickens and grain ---------------- */
function footGround(R){R.turn.position.y=0;R.root2.updateMatrixWorld(true);const f=Math.min(...R.pLegs.map(lowY));R.turn.position.y=-f+R.root2.position.y*0;R.root2.updateMatrixWorld(true);
  if(R.shadow){const bb=bbOf(R.pLegs.flat());const c=bb.getCenter(V(0,0,0));R.shadow.position.set(c.x,.004,c.z);R.shadow.scale.set(R.L*.5,R.W*.6,1);R.shadow.material.opacity=.3;}}
function chickR(c){const R=jR('farm:chicken',c?{c}:{});return R;}
function chickPeck(R,sv){const m=R.m;m.neck.rotation.x+=1.1*sv;m.neck.position.y-=.08*sv;m.neck.position.z+=.04*sv;m.b.rotation.x+=.45*sv;m.legs.forEach(u=>u.rotation.x-=.45*sv);}
function chickRun(R,ph,A,w){const m=R.m;m.legs.forEach((u,i)=>{const p=ph+i*.5;u.rotation.x+=legAng(p,A)*w;const q=((p%1)+1)%1;if(q>.62)m.lower[i].rotation.x+=1.0*Math.sin(P_*(q-.62)/.38)*w;});
  m.b.position.y+=.012*w*Math.abs(Math.sin(TAU*ph));m.b.rotation.x+=.18*w;m.neck.rotation.x+=-.15*w;}
function grainCell(){return cell('Chickens and grain','player stand-in scatters grain; hens run and peck',()=>{
  const Q=player();const st=stage(Q,{zoom:1});const S=st.S;const bk=bucket(S);const AL=armWorldLen(Q);
  Q.root2.position.set(0,0,0);Q.root2.rotation.set(0,0,0);RIG.pose(Q,{floor:true});Q.root2.updateMatrixWorld(true);
  const sh=i=>{const A=Q.arms[i];return Q.root.localToWorld(V(A.x,A.top,A.z));};const s0=sh(0),s1=sh(1);
  /* one point both straight arms reach: bucket mouth for the throwing hand, handle top for the holding hand */
  const yM=(s0.y+s1.y)/2-bk.hTop/2;const xM=Math.sqrt(Math.max(0,AL*AL-(yM-s0.y)**2-s0.z*s0.z));const M=V(xM,yM,0);const Hh=V(xM,yM+bk.hTop,0);
  const holdS=solveL(Q,1,Hh,1.2),dipS=solveL(Q,0,M.clone().add(V(-.01,-.02,0)),1.2);dbg('grain hold miss',holdS[2].toFixed(3),'dip miss',dipS[2].toFixed(3),'mouth',M.toArray().map(x=>x.toFixed(2)).join(','));
  /* three throws, each lands a small patch for one hen */
  const patches=[V(.85,0,.7),V(1.45,0,.02),V(.8,0,-.68)];const TH=[[.04,.13],[.14,.23],[.24,.33]];const REL=.62;/* release, fraction of a throw */
  const grains=[];patches.forEach((c,j)=>{for(let i=0;i<5;i++){const a=i*2.4+j,r=.015+.04*((i*37+j*11)%5)/5;const g=bit(S,.022,FEED[(i+j)%4]);g.userData={j,i,T:V(c.x+Math.cos(a)*r,.013,c.z+Math.sin(a)*r)};grains.push(g);}});
  const throwArm=(t,j)=>{const [a,b]=TH[j];const u=cl((t-a)/(b-a));if(u<=0||u>=1)return null;
    if(u<.3){const k=bell(u,0,.6);return [dipS[0]*k+.1*(1-k),dipS[1]*k];}
    const k=seg(u,.3,.85),back=1-seg(u,.85,1);return [(dipS[0]+(1.75-dipS[0])*k)*back+.1*(1-back),(dipS[1]+(-.75-dipS[1])*k)*back];};
  /* hens */
  const cols=FARM_COLS.chicken;const hens=[0,1,2].map(i=>{const R=chickR(cols[i]);S.add(R.root2);RIG.addShadow(R,S);return R;});
  const ground=.026;/* top of a grain */
  hens.forEach((R,i)=>{R.sv=bis(v=>{jReset(R);chickPeck(R,v);R.root2.position.set(0,0,0);R.root2.rotation.y=0;footGround(R);return lowY(R.pHead);},0,1.5,ground);
    jReset(R);chickPeck(R,R.sv);footGround(R);const bp=lowPt(R.pHead);R.off=V(bp.x,0,bp.z);
    const c=patches[i],from=[V(1.55,0,1.45),V(2.4,0,.05),V(1.45,0,-1.45)][i];const dir=c.clone().sub(from).setY(0).normalize();R.head=Math.atan2(-dir.z,dir.x);
    const ox=R.off.x*Math.cos(R.head)+R.off.z*Math.sin(R.head),oz=-R.off.x*Math.sin(R.head)+R.off.z*Math.cos(R.head);R.end=V(c.x-ox,0,c.z-oz);R.from=from.clone();
    R.D=R.end.distanceTo(R.from);R.A=.6;R.cyc=R.D/(2*R.leg*Math.sin(R.A));const t0=TH[i][0]+(TH[i][1]-TH[i][0])*REL+.04;const WA=walkIn(t0,t0+.12),WB=walkIn(.85,.96);R.W={f:t=>WA.cum(t)-WB.cum(t),ph:t=>WA.cum(t)+WB.cum(t),w:t=>WA.wk(t)+WB.wk(t)};R.t0=t0;R.t1=t0+.12;
        jReset(R);chickPeck(R,R.sv);footGround(R);dbg('beak y',lowY(R.pHead).toFixed(3));dbg('hen',i,'peck',R.sv.toFixed(3),'beak off',R.off.x.toFixed(3),R.off.z.toFixed(3),'cycles',R.cyc.toFixed(2),'leg',R.leg.toFixed(3));});
  const MXg={d:9,q:9};aim(st.C,.85,.4,0,5.0,.22,.45);
  return {S,C:st.C,tick:t=>{
    /* player: holds the bucket up in front, dips and throws three times, then watches */
    const P={floor:true};P.arm=[.1,holdS[0]];P.wing=[0,holdS[1]];let rel=null;
    for(let j=0;j<3;j++){const a=throwArm(t,j);if(a){P.arm[0]=a[0];P.wing[0]=a[1];}}
    P.hy=-.25*seg(t,.5,.6)+.15*S2(t*2)*seg(t,.5,.6);P.hp=-.15*seg(t,.5,.6);RIG.pose(Q,P);if(Q.shadow)H.fixShadow(Q);
    const hand1=handWorld(Q,1,P.arm[1],P.wing[1]);bk.hang(hand1,P_/2,0);
    grains.forEach(g=>{const d=g.userData,[a,b]=TH[d.j];const tr=a+(b-a)*REL,tl=tr+.05+.012*d.i;
      if(t<tr){g.visible=false;return;}g.visible=true;
      if(t<tl){const f=(t-tr)/(tl-tr);const throwP=throwArm(tr+1e-4,d.j);const h0=handWorld(Q,0,throwP[0],throwP[1]);g.position.copy(h0).lerp(d.T,f);g.position.y=h0.y+(d.T.y-h0.y)*f+.25*Math.sin(P_*f);}
      else g.position.copy(d.T);});
    hens.forEach((R,i)=>{jReset(R);const m=R.m;const uu=R.W.f(t),ww=R.W.w(t);chickRun(R,R.cyc*R.W.ph(t),R.A,ww);
      let eaten=0;if(t>R.t1&&t<.83){const x=(t-R.t1)*16;const pk=(x%1)<.45?Math.sin(P_*(x%1)/.45):0;chickPeck(R,R.sv*pk*seg(t,R.t1,R.t1+.02)*(1-seg(t,.8,.83)));eaten=Math.floor(x+.55);m.tail.rotation.x=.15*S2(4*t);}
      else{/* waiting: looks about, a little scratch peck */const lk=Math.sin(TAU*(2*t+i*.3));m.head.rotation.y=.5*lk*(1-ww);const x=(3*t+i*.37)%1;chickPeck(R,.3*(x<.3?Math.sin(P_*x/.3):0)*(1-ww));}
      grains.forEach(g=>{if(g.userData.j===i&&((g.userData.i<eaten&&t>R.t1)||t>=.83))g.visible=false;});
      R.root2.rotation.y=R.head+P_*(1-seg(t,R.t0-.035,R.t0))+P_*seg(t,.82,.85);R.root2.position.copy(R.from).lerp(R.end,uu);footGround(R);});
    {let md=9;for(let a=0;a<3;a++)for(let b=a+1;b<3;b++)md=Math.min(md,hens[a].root2.position.distanceTo(hens[b].root2.position));MXg.d=Math.min(MXg.d,md);let mq=9;hens.forEach(R=>mq=Math.min(mq,Math.hypot(R.root2.position.x,R.root2.position.z)));MXg.q=Math.min(MXg.q,mq);if(t>.985)dbg('hens min pair distance',MXg.d.toFixed(3),'min distance to player',MXg.q.toFixed(3));}
  }};});}

/* ---------------- 3. Horse eats from your hand ---------------- */
function horseCell(){return cell('Horse eats from your hand','flat hand with feed; head down, nibbles, tail swish',()=>{
  const R=mk('farm:horse',{},undefined,undefined,{rigid:true});
  /* saddle pieces the rig counted as head (they sit behind the neck) stay with the body */
  let fixed=0;R.parts.forEach(q=>{if(q.role[0]==='head'&&(q.bb.min.x+q.bb.max.x)/2<R.neck.x-.05){q.role=['body'];fixed++;}});dbg('horse parts moved from head to body',fixed);
  const st=stage(R,{zoom:1});const S=st.S;RIG.pose(R,{});
  const Q=player(S);const bk=bucket(S);
  const ARM=1;/* the arm nearer the camera */
  const OA=1.62,OW=-.35,TH=P_-1.95,DA=.75;/* offering arm: forward, a touch up, hand flat */
  const hpts=()=>{R.root2.updateMatrixWorld(true);return R.head.map(q=>({o:q.mesh,v:(()=>{const a=q.geo.attributes.position.array,v=[];for(let k=0;k<a.length;k+=3)v.push(V(a[k],a[k+1],a[k+2]));return v;})()}));};
  const mouth=()=>lowPt(hpts());
  /* where the hand is when offering, relative to the player's root (player faces -x) */
  Q.root2.position.set(0,0,0);Q.root2.rotation.set(0,TH,0);RIG.pose(Q,{floor:true,arm:[0,OA],wing:[0,OW]});const h0=handWorld(Q,ARM,OA,OW);
  const PALM=.055;/* top of the hand above the arm's end point */
  /* head down so the lips are just above the feed on the palm */
  const HY=0;const hpE=bis(h=>{RIG.pose(R,{hp:h,hy:HY});return mouth().y;},-1.6,0,h0.y+PALM+.045);RIG.pose(R,{hp:hpE,hy:HY});const mE=mouth();
  const QP=V(mE.x-h0.x,0,mE.z-h0.z+.07);
  /* crouch so the hand dips into the bucket (loop start/end) */
  Q.root2.position.copy(QP);Q.root2.rotation.set(0,TH,0);const crouchAt=k=>{const P=crouchP(Q,k,{},.5*k);P.floor=true;P.arm=[0,DA];P.wing=[0,-.1];RIG.pose(Q,P);return handWorld(Q,ARM,DA,-.1);};
  const kB=bis(k=>crouchAt(k).y,0,1,.31);const hb=crouchAt(kB);bk.setDown(hb.x,hb.z);bk.handle.rotation.x=-1.45;
  dbg('horse hpE',hpE.toFixed(3),'mouth',mE.toArray().map(x=>x.toFixed(2)).join(','),'hand',h0.toArray().map(x=>x.toFixed(2)).join(','),'player at',QP.x.toFixed(2),QP.z.toFixed(2),'crouch',kB.toFixed(2));
  const MXh={d:0};const HATY=(()=>{Q.root2.updateMatrixWorld(true);let mx=0;Q.head.forEach(q=>{const A=q.geo.attributes.position.array;for(let k=0;k<A.length;k+=3){_v.set(A[k],A[k+1],A[k+2]).applyMatrix4(q.mesh.matrixWorld);mx=Math.max(mx,_v.y);}});return mx-.12;})();dbg('hat from y',HATY.toFixed(2));const feed=[];for(let i=0;i<6;i++)feed.push(bit(S,.024,FEED[i%4]));
  aim(st.C,.75,.9,.1,5.1,2.2,.2);
  return {S,C:st.C,tick:t=>{
    /* player: hand in the bucket → up, flat, out to the horse → back down into the bucket */
    const up=seg(t,.08,.2)*(1-seg(t,.8,.92));const ck=kB*(1-seg(t,.04,.14))+kB*seg(t,.86,.97);
    Q.root2.position.copy(QP);Q.root2.rotation.set(0,TH,0);const P=crouchP(Q,ck,{},.5*ck);P.floor=true;
    const a=DA+(OA-DA)*up,w=-.1+(OW+.1)*up;P.arm=[.05,a];P.wing=[0,w];P.hy=.1*bell(t,.4,.6);RIG.pose(Q,P);if(Q.shadow)H.fixShadow(Q);
    const hand=handWorld(Q,ARM,a,w);
    /* feed on the palm: picked up in the bucket, eaten one by one while nibbling */
    const nib=t>.38&&t<.66?(1-Math.cos(TAU*(t-.38)*10))/2:0;const eaten=Math.floor(cl((t-.4)/.26)*6.99);
    feed.forEach((f,i)=>{const ang=i*1.05,r=i?.03:0;f.position.set(hand.x+Math.cos(ang)*r,hand.y+PALM+.012,hand.z+Math.sin(ang)*r);f.visible=t>.06&&t<.95&&!(t>.4&&i<eaten);});
    /* horse: head lowers to the hand, nibbles (lips lift off and come back), head up, chews, tail swish */
    const dn=seg(t,.2,.36)*(1-seg(t,.66,.78));const HP={hp:hpE*dn+.06*nib,hy:HY*dn,ty:.15*S2(t)+.7*bell(t,.72,.84)-.5*bell(t,.84,.94),tp:-.25*bell(t,.72,.94)};
    if(t>.66&&t<.95)HP.hp+=.05*Math.max(0,Math.sin(TAU*(t-.66)*9))*(1-dn);RIG.pose(R,HP);
    {Q.root2.updateMatrixWorld(true);const hat=new THREE.Box3(),face=new THREE.Box3();Q.head.forEach(q=>{const A=q.geo.attributes.position.array;for(let k=0;k<A.length;k+=3){_v.set(A[k],A[k+1],A[k+2]).applyMatrix4(q.mesh.matrixWorld);if(_v.y>HATY)hat.expandByPoint(_v);else if(_v.y>1.0)face.expandByPoint(_v);}});const hc=hat.getCenter(V(0,0,0)),hr=Math.min(hat.max.x-hat.min.x,hat.max.z-hat.min.z)/2+.02;let d=0;for(const {o,v} of hpts()){const M=o.matrixWorld;for(const q of v){_v.copy(q).applyMatrix4(M);if(_v.y>hat.min.y-.02&&_v.y<hat.max.y+.02){const e=hr-Math.hypot(_v.x-hc.x,_v.z-hc.z);if(e>d)d=e;}}}face.expandByScalar(.02);d=Math.max(d,pen(hpts(),[face]));if(d>MXh.d){MXh.d=d;MXh.t=t;}if(t>.985)dbg('horse head inside player hat/face boxes (3 cm margin)',MXh.d.toFixed(3),'at',MXh.t);}
  }};});}

/* ---------------- 4. Petting ---------------- */
function petCell(){return cell('Petting','pats the cow, then the sheep; the hen fluffs up',()=>{
  const Q=player();const st=stage(Q,{zoom:1});const S=st.S;const AL=armWorldLen(Q);
  const cow=jR('farm:cow');S.add(cow.root2);RIG.addShadow(cow,S);
  const shp=jR('farm:sheep');S.add(shp.root2);RIG.addShadow(shp,S);shp.root2.rotation.y=P_;
  const hen=jR('farm:chicken');S.add(hen.root2);RIG.addShadow(hen,S);hen.root2.rotation.y=P_-.4;
  const puff=[];hen.m.b.children.forEach(o=>{if(o.isMesh)puff.push(o);});
  cowLevel(cow);
  const shoulder=(th,i)=>{Q.root2.position.set(0,0,0);Q.root2.rotation.set(0,th,0);RIG.pose(Q,{floor:true});Q.root2.updateMatrixWorld(true);const A=Q.arms[i];return Q.root.localToWorld(V(A.x,A.top,A.z));};
  /* a pat point on top of a head/back: raycast straight down, fr = how far back from the front (0 = front edge) */
  const patPt=(R,grp,fr,dir)=>{R.root2.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(grp);const c=bb.getCenter(V(0,0,0));const x=dir>0?bb.max.x-fr*(bb.max.x-bb.min.x):bb.min.x+fr*(bb.max.x-bb.min.x);const y=topAt(grp,x,c.z);return V(x,y,c.z);};
  /* cow (faces +x, left of the player): lean-in amount kc, placed so the pat point is one arm away from the shoulder */
  const sC=shoulder(P_,1),sS=shoulder(2*P_,0),sH=shoulder(1.5*P_,0);
  const cowAt=x=>{cow.root2.position.set(x,0,sC.z*.85);jGround(cow);};
  const cowLean=(R,k)=>{cowPose(R,k);R.m.head.rotation.x-=1.6*k;};
  /* forehead point: straight in from the front at a height of 65% of the head box, on the head's middle line */
  const foreh=()=>{cow.root2.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(cow.m.head);const y=bb.min.y+.62*(bb.max.y-bb.min.y),z=(bb.min.z+bb.max.z)/2;cow.m.head.updateWorldMatrix(true,true);rc.set(V(bb.max.x+1,y,z),V(-1,0,0));const h=rc.intersectObject(cow.m.head,true).filter(i=>i.object.material&&i.object.material.side!==THREE.BackSide);return h.length?h[0].point:V(bb.max.x,y,z);};
  const kc=bis(k=>{jReset(cow);cowLean(cow,k);cowAt(-1.5);return foreh().y;},0,1,sC.y+.04);const placeAt=(R,setPose,sh,lo,hi,fr,dir,grp)=>{const f=x=>{setPose(x);return patPt(R,grp,fr,dir).distanceTo(sh);};const x=bis(f,lo,hi,AL*.98);setPose(x);return x;};
  const cX=bis(x=>{jReset(cow);cowLean(cow,kc);cowAt(x);return foreh().distanceTo(sC);},-2.6,-1.0,AL*.97);jReset(cow);cowLean(cow,kc);cowAt(cX);const cT=foreh().add(V(.012,0,0));
  const ks=.15;const sX=placeAt(shp,x=>{jReset(shp);sheepPose(shp,ks);shp.root2.position.set(x,0,sS.z*.85);jGround(shp);},sS,.4,2,.35,-1,shp.m.head);const sT=patPt(shp,shp.m.head,.35,-1);
  /* hen in front: the player crouches to pat its back */
  const CK=.85;const crouched=th=>{Q.root2.position.set(0,0,0);Q.root2.rotation.set(0,th,0);const P=crouchP(Q,CK,{},.6*CK);P.floor=true;RIG.pose(Q,P);Q.root2.updateMatrixWorld(true);const A=Q.arms[0];return Q.root.localToWorld(V(A.x,A.top,A.z));};
  const sH2=crouched(1.5*P_);jReset(hen);footGround(hen);
  const hz=bis(z=>{hen.root2.position.set(sH2.x*.9,0,z);footGround(hen);return patPt(hen,hen.m.b,.5,1).distanceTo(sH2);},.1,1.2,AL*.98);hen.root2.position.set(sH2.x*.9,0,hz);footGround(hen);const hT=patPt(hen,hen.m.b,.5,1);
  dbg('pet cow x',cX.toFixed(2),'kc',kc.toFixed(2),'pat',cT.toArray().map(x=>x.toFixed(2)).join(','),'sheep x',sX.toFixed(2),'pat',sT.toArray().map(x=>x.toFixed(2)).join(','),'hen z',hz.toFixed(2),'pat',hT.toArray().map(x=>x.toFixed(2)).join(','));
  const MX={miss:0,pen:0};const qPts=pts(Q.root,3);
  /* swing the cow and the sheep round the player a little, so the player turns three-quarters toward the camera to pat them */
  const SW=inOut(.3,.41,.71,.82),SD=.4,SCY=SD/(2*shp.leg*Math.sin(.32));
  const BC=.45,BS=-.45;const Gc=new THREE.Group(),Gs=new THREE.Group();S.add(Gc);S.add(Gs);Gc.add(cow.root2);Gs.add(shp.root2);Gc.rotation.y=BC;Gs.rotation.y=BS;
  const ry=(v,b)=>v.clone().applyAxisAngle(V(0,1,0),b);const cTw=ry(cT,BC),sTw=ry(sT,BS);
  const thC=P_+BC,thS=2*P_+BS,thH=1.5*P_;
  aim(st.C,-.25,.6,.15,6.6,.1,.32);
  return {S,C:st.C,tick:t=>{
    /* player turns: cow (facing -x) → sheep (+x) → hen (+z, crouched) → cow */
    const th=thC+(thS-thC)*seg(t,.35,.43)+(thH-thS)*seg(t,.64,.71)+(thC-thH)*seg(t,.92,.995);const ck=CK*seg(t,.68,.74)*(1-seg(t,.9,.96));
    Q.root2.position.set(0,0,0);Q.root2.rotation.set(0,th,0);let P=crouchP(Q,ck,{},.6*ck);P.floor=true;P.arm=[.08,.08];P.wing=[0,0];RIG.pose(Q,P);
    const pat=(i,T,a,b,hor)=>{const on=seg(t,a,a+.03)*(1-seg(t,b-.03,b));if(on<=0)return;const lift=.045*(1-Math.cos(TAU*3*cl((t-a-.03)/(b-a-.06))))/2;const s=solveL(Q,i,T.clone().add(hor?ry(V(lift*1.2+.15*(1-on),0,0),BC):V(0,.012+lift+.15*(1-on),0)),1.0);
      if(on>.99&&lift<.002){if(s[2]>MX.miss){MX.miss=s[2];MX.mt=t;}}P.arm[i]=.08+(s[0]-.08)*on;P.wing[i]=s[1]*on;};
    pat(1,cTw,.08,.34,true);pat(0,sTw,.43,.66);pat(0,hT,.74,.92);P.hy=(t<.35?.1:0);RIG.pose(Q,P);if(Math.abs(t-.847)<.008)dbg('hen pat hand',handWorld(Q,0,P.arm[0],P.wing[0]).toArray().map(x=>x.toFixed(2)).join(','),'arm',P.arm[0].toFixed(2),P.wing[0].toFixed(2),'T',hT.toArray().map(x=>x.toFixed(2)).join(','),'hen',hen.root2.position.toArray().map(x=>x.toFixed(2)).join(','));if(Q.shadow)H.fixShadow(Q);
    /* cow: leans in (head down to the hand), eyes on you, tail swish, little nods into the pats */
    {const R=cow,m=R.m;jReset(R);const k=kc*seg(t,.02,.09)*(1-seg(t,.34,.41));cowLean(R,k);m.head.rotation.z=.08*Math.sin(TAU*2*t)*seg(t,.1,.14)*(1-seg(t,.3,.34));
      m.tail.rotation.z=.2*S2(2*t)+.8*bell(t,.16,.26)+.6*bell(t,.26,.34);m.tail.rotation.x=.3*bell(t,.16,.3);m.head.children[0].rotation.y=.06*S2(6*t);cowAt(cX);}
    /* sheep: leans in, tail wiggles fast while patted */
    {const R=shp,m=R.m;jReset(R);const f=SW.f(t),w=SW.w(t);jWalk3(R,f*SCY,.32,w);const k=ks*seg(t,.4,.45)*(1-seg(t,.66,.71));sheepPose(R,k);const happy=seg(t,.45,.5)*(1-seg(t,.64,.68));sheepIdle(R,t,0,1);m.tail.rotation.z=.4*Math.sin(TAU*3*t)*(1-happy)+.7*Math.sin(TAU*14*t)*happy;R.root2.position.set(sX+SD*(1-f),0,sS.z*.85);jGround(R);}
    /* hen: pecks idly, then puffs up its feathers (body and wing pieces swell), shakes, settles */
    {const R=hen,m=R.m;jReset(R);const pf=bell(t,.79,.91);puff.forEach(o=>o.scale.setScalar(1+.2*pf));m.b.rotation.z=.12*Math.sin(TAU*18*t)*bell(t,.86,.92);m.tail.rotation.x=-.35*pf;
      const idle=1-seg(t,.7,.74)*(1-seg(t,.95,1));const x=(t*5)%1;chickPeck(R,.35*idle*(x<.4?Math.sin(P_*x/.4):0));m.head.rotation.y=.4*Math.sin(TAU*2*t)*(1-idle);R.root2.position.set(sH2.x*.9,0,hz);footGround(R);}
    {const all=[...cow.pAll,...shp.pAll];/* nothing of the player inside the animals' heads */const hb=[cow.m.head,shp.m.head].map(g=>new THREE.Box3().setFromObject(g).expandByScalar(-.03));const p=pen(qPts,hb);if(p>MX.pen)MX.pen=p;}
    if(t>.985)dbg('pet max hand miss at contact',MX.miss.toFixed(3),'at t',MX.mt,'player inside head boxes',MX.pen.toFixed(3));
  }};});}

CLIPS2.farmFeed={title:'Feed and pet farm animals',cols:2,cw:340,ch:270,frames:72,cells:[troughCell(),grainCell(),horseCell(),petCell()]};
})();
