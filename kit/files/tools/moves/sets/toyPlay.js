/* toyPlay: the new pets play with their favourite toy when you press Play (one shared idea, settings per pet).
   monkey = toy:frisbee, seal = toy:ball, bear = toy:bone (Squeaky bone), snake = toy:mouse. Models: c14 puPet (newest), toys baked with H.propB.
   Every part moves as a rigid piece at its joint; toys only move (the squeaky bone also squashes a little when squeezed). */
(()=>{const H=window.MVH;const {cell,cl,ease,seg,bell,S2,C2,P_,TAU,floorShadow,grassTex,dbg}=H;const V3=THREE.Vector3,Q=THREE.Quaternion;
/* ---------- shared helpers ---------- */
function world(){const S=H.scene();const tex=grassTex('#8fbf6a','#7aad57');tex.repeat.set(80/1.3,80/1.3);const g=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshLambertMaterial({map:tex}));g.rotation.x=-P_/2;S.add(g);return S;}
function camAt(tx,ty,tz,d,yaw,pitch){const C=new THREE.PerspectiveCamera(32,1.4,.05,80);C.position.set(tx+Math.sin(yaw)*Math.cos(pitch)*d,ty+Math.sin(pitch)*d,tz+Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(tx,ty,tz);C.updateProjectionMatrix();return C;}
function snap(root){const a=[];root.traverse(q=>a.push([q,q.position.clone(),q.rotation.clone(),q.scale.clone()]));return ()=>a.forEach(([q,p,r,s])=>{q.position.copy(p);q.rotation.copy(r);q.scale.copy(s);});}
/* lowest point, from the real vertices (Box3.setFromObject in r128 uses rotated boxes and reads too low) */
const _v=new V3();function lowY(o){o.updateMatrixWorld(true);let y=1e9;o.traverse(q=>{if(!q.isMesh||!q.visible)return;const pa=q.geometry.attributes.position,M=q.matrixWorld;for(let i=0;i<pa.count;i++){_v.fromBufferAttribute(pa,i).applyMatrix4(M);if(_v.y<y)y=_v.y;}});return y;}
/* where it touches the ground: middle of the lowest points (for the shadow) */
function foot(o,band){o.updateMatrixWorld(true);let y=1e9;const pts=[];o.traverse(q=>{if(!q.isMesh||!q.visible)return;const pa=q.geometry.attributes.position,M=q.matrixWorld;for(let i=0;i<pa.count;i+=2){_v.fromBufferAttribute(pa,i).applyMatrix4(M);pts.push(_v.x,_v.y,_v.z);if(_v.y<y)y=_v.y;}});
  let x=0,z=0,n=0,x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(let i=0;i<pts.length;i+=3)if(pts[i+1]<y+(band||.06)){x+=pts[i];z+=pts[i+2];n++;x0=Math.min(x0,pts[i]);x1=Math.max(x1,pts[i]);z0=Math.min(z0,pts[i+2]);z1=Math.max(z1,pts[i+2]);}return {x:x/n,z:z/n,w:x1-x0,d:z1-z0};}
/* a toy, baked, centred on its own middle (group origin = centre of its box) */
function toy(id,sc){const T=H.propB(id);const g=new THREE.Group();T.root.position.y=-T.H/2;g.add(T.root);g.scale.setScalar(sc);g.userData={toy:1,L:T.L*sc,H:T.H*sc,W:T.W*sc,sc};return g;}
/* the toy's shadow: smaller and lighter the higher it is */
function toyShadow(S,r){const s=floorShadow(S,0,0,r,r);return (x,y,z)=>{const k=1/(1+y*1.2);s.position.set(x,.004,z);s.scale.set(r*k,r*k,1);s.material.opacity=.22*k;};}
/* a path through points (centripetal Catmull-Rom), arc-length parameter */
function spline(P,n){const out=[];const pt=i=>P[Math.max(0,Math.min(P.length-1,i))];
  for(let i=0;i<P.length-1;i++){const p0=pt(i-1),p1=pt(i),p2=pt(i+1),p3=pt(i+2);const d=(a,b)=>Math.pow(a.distanceTo(b)||1e-4,.5);const t0=0,t1=t0+d(p0,p1),t2=t1+d(p1,p2),t3=t2+d(p2,p3);
    for(let k=0;k<n;k++){const t=t1+(t2-t1)*k/n;const L=(a,b,ta,tb)=>a.clone().multiplyScalar((tb-t)/(tb-ta)).add(b.clone().multiplyScalar((t-ta)/(tb-ta)));
      const A1=L(p0,p1,t0,t1),A2=L(p1,p2,t1,t2),A3=L(p2,p3,t2,t3),B1=L(A1,A2,t0,t2),B2=L(A2,A3,t1,t3);out.push(L(B1,B2,t1,t2));}}
  out.push(P[P.length-1].clone());const cum=[0];for(let i=1;i<out.length;i++)cum.push(cum[i-1]+out[i].distanceTo(out[i-1]));const len=cum[cum.length-1];
  const at=s=>{s=cl(s,0,len);let lo=0,hi=cum.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(cum[m]<=s)lo=m;else hi=m;}const u=(s-cum[lo])/((cum[hi]-cum[lo])||1);return {p:out[lo].clone().lerp(out[hi],u),d:out[hi].clone().sub(out[lo]).normalize()};};
  return {at,len,pts:out};}

/* ===================== 1. Monkey · frisbee =====================
   one story loop that ends where it began: sits up with the frisbee, throws it, the frisbee flies a big curving arc round the yard;
   the monkey gallops after it round a circle, sits up, catches it, claps (the frisbee held by its rim in one hand, the disc outward). */
function monkeyCell(){return cell('Monkey · frisbee','throws it, runs after it, catches it, claps',()=>{
  const S=world();const m=puPet('monkey',null,'adult');S.add(m.root);m.root.updateMatrixWorld(true);
  /* the body tips up on a pivot at the hind hips (sits up on its hind legs) */
  const P=new THREE.Group();P.position.set(0,m.legs[2].position.y,m.legs[2].position.z);m.root.add(P);P.updateMatrixWorld(true);P.attach(m.b);
  const reset=snap(m.root);const U=1.2;
  const TI=0,FI=1,sd=Math.sign(m.legs[TI].position.x),sf=Math.sign(m.legs[FI].position.x);   /* throwing hand = the one nearer the camera */
  const HAND=new V3(0,-.328,.04);
  const R=.55,shM=floorShadow(S,0,0,.3,.22);const fr=toy('toy:frisbee',1);S.add(fr);const shF=toyShadow(S,.15);
  const pr=t=>seg(t,.14,.6);
  const up=t=>1-seg(t,.1,.16)+seg(t,.57,.63);
  /* throwing arm angle against straight down (negative = forward/up) */
  const armT=t=>{if(t<.1){const w=seg(t,.02,.07),th=seg(t,.07,.1);return -.55+(.55+.15)*w*(1-th)+(-1.7+.55)*th;}
    if(t<.57)return -1.7;if(t<.64)return -1.7+(-2.75+1.7)*seg(t,.57,.63);return -2.75+(2.75-1.05)*seg(t,.64,.7)-(-1.05+.55)*seg(t,.9,.98);};
  const clapK=t=>t>.7&&t<.9?Math.max(0,Math.sin(TAU*3*(t-.7)/.2-P_/2)*.5+.5):0;
  function pose(t){reset();const a=P_/2-TAU*pr(t);m.root.position.set(R*Math.cos(a),0,R*Math.sin(a));m.root.rotation.y=Math.atan2(Math.sin(a),-Math.cos(a));
    const u=up(t),dist=R*TAU*pr(t),sp=(pr(Math.min(1,t+.005))-pr(Math.max(0,t-.005)))/.01*R*TAU,amp=cl(sp/4)*(1-u);const ph=TAU*dist/.62;
    /* gallop (front pair, then hind pair) */
    const gF=[.55*amp*Math.sin(ph),.55*amp*Math.sin(ph+.35)],gH=[.5*amp*Math.sin(ph+P_),.5*amp*Math.sin(ph+P_+.35)];
    P.rotation.x=-U*u+.09*amp*Math.sin(ph+P_/2);
    m.legs[2].rotation.x=U*u+gH[0];m.legs[3].rotation.x=U*u+gH[1];
    /* arms: upright = angle against straight down; on all fours = gallop */
    const clap=clapK(t),cw=seg(t,.66,.7)*(1-seg(t,.9,.96));
    const phT=armT(t),phF=-.35+(-1.05+.35)*cw;
    m.legs[TI].rotation.x=u*(U+phT)+(1-u)*gF[0];m.legs[FI].rotation.x=u*(U+phF)+(1-u)*gF[1];
    m.legs[TI].rotation.z=-sd*(.13*cw-.06*cw*(1-clap))+sd*.8*seg(t,.55,.62)*(1-seg(t,.66,.72));m.legs[FI].rotation.z=-sf*cw*(-.55+(.55+.15)*clap);
    m.head.rotation.x=U*u*.85-.1*u*seg(t,.55,.62)*(1-seg(t,.64,.7))+.08*bell(t,.7,.9);m.head.rotation.y=-.25*bell(t,.66,.95)*u;m.head.rotation.z=.12*S2(3*(t-.7)/.2*.5)*cw;
    if(m.tail)m.tail.rotation.x=.55*u+.12*amp*Math.sin(ph);
    m.root.updateMatrixWorld(true);m.root.position.y-=lowY(m.root);m.root.updateMatrixWorld(true);}
  function held(){const l=m.legs[TI];l.updateMatrixWorld(true);const c=l.localToWorld(HAND.clone().add(new V3(0,-.03,.235)));const q=l.getWorldQuaternion(new Q()).multiply(new Q().setFromEuler(new THREE.Euler(0,0,P_/2)));return {c,q};}
  const tr=.1,tc=.64;pose(tr);const H0=held();pose(tc);const H1=held();
  const path=spline([H0.c,new V3(.8,1.0,.6),new V3(1.1,1.15,-.3),new V3(.25,1.2,-1.0),new V3(-.85,1.15,-.55),new V3(-1.0,1.25,.45),new V3(.45,1.2,1.0),H1.c],24);
  const qFly=(s,k)=>new Q().setFromEuler(new THREE.Euler(.18*Math.sin(k),s,.12,'YXZ'));
  const C=camAt(.05,.5,0,3.7,.62,.28);
  return {S,C,tick:t=>{pose(t);shM.position.set(m.root.position.x,.004,m.root.position.z);shM.rotation.z=m.root.rotation.y;
    let c,q;if(t<tr||t>=tc){const h=held();c=h.c;q=h.q;}
    else{const u=(t-tr)/(tc-tr),f=1-Math.pow(1-u,1.6);const a=path.at(f*path.len);c=a.p;const spin=TAU*5*u;q=qFly(spin,u*6);
      const k0=1-seg(u,0,.12),k1=seg(u,.86,1);if(k0>0)q=q.clone().slerp(H0.q,k0);if(k1>0)q=q.clone().slerp(H1.q,k1);}
    fr.position.copy(c);fr.quaternion.copy(q);shF(c.x,c.y,c.z);
  }};});}

/* ===================== 2. Seal · ball =====================
   sits up (the approved ball pose), the ball bounces on its nose tip three times (touching the tip at every bounce), then rests on the nose while it claps */
function sealCell(){return cell('Seal · ball','bounces the ball on its nose, then claps',()=>{
  const S=world();const m=puPet('seal',null,'adult');S.add(m.root);m.root.updateMatrixWorld(true);const min0=lowY(m.root);const reset=snap(m.root);
  const ball=toy('toy:ball',2.2);S.add(ball);const br=ball.userData.H/2;const shB=toyShadow(S,.13);const shS=floorShadow(S,0,0,1,1);
  /* head points (head space): all of them for the clearance check; the nose box (the dark box at the front of the muzzle) for the tip */
  const hv=[],nv=[];{m.head.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(m.head.matrixWorld).invert();m.head.traverse(q=>{if(!q.isMesh)return;const nose=q.geometry.type==='BoxGeometry'&&q.parent===m.head&&q.position.z>.17&&Math.abs(q.position.x)<.01;
    const M=new THREE.Matrix4().multiplyMatrices(inv,q.matrixWorld);const pa=q.geometry.attributes.position;for(let i=0;i<pa.count;i++){const v=new V3().fromBufferAttribute(pa,i).applyMatrix4(M);hv.push(v);if(nose)nv.push(v);}});dbg('seal nose pts',nv.length);}
  /* front flippers: open (out to the side) and clapped (paddles meet in front of the chest) - the approved fit */
  const fit=(l,T)=>{const sg=Math.sign(l.position.x),tip=new V3(sg*.2,-.1,.03),e=new THREE.Euler(),v=new V3();let best=[0,0,0,1e9];
    for(let x=-2.4;x<=.4;x+=.08)for(let y=-1.2;y<=1.2;y+=.08)for(let z=-1.6;z<=1.6;z+=.08){e.set(x,y,z);v.copy(tip).applyEuler(e).add(l.position);const d=v.distanceTo(T);if(d<best[3])best=[x,y,z,d];}return best;};
  const shut=m.legs.map(l=>fit(l,new V3(Math.sign(l.position.x)*.035,.24,.36))),open=m.legs.map(l=>fit(l,new V3(Math.sign(l.position.x)*.36,.22,.2)));
  const HD=.5,NB=3,BT=.18,hop=.34;
  const W=new V3();
  function tip(){m.head.updateMatrixWorld(true);const fw=new V3(0,0,1).applyQuaternion(m.head.getWorldQuaternion(new Q()));fw.y=0;fw.normalize();const d=new V3(0,Math.cos(.5),0).addScaledVector(fw,Math.sin(.5));let best=null,bs=-1e9;for(const v of nv){W.copy(v).applyMatrix4(m.head.matrixWorld);const k=W.dot(d);if(k>bs){bs=k;best=W.clone();}}return best;}
  const C=camAt(.05,1.1,.1,3.9,.0,.62);let dmin=9;
  return {S,C,tick:t=>{reset();m.root.rotation.y=HD;const ba=-.5;m.b.rotation.x=ba;m.b.position.set(0,-(.02*Math.cos(ba)-(-.3)*Math.sin(ba)),-.3-(.02*Math.sin(ba)+(-.3)*Math.cos(ba)));
    const bouncing=t<NB*BT;const u=bouncing?(t/BT)%1:0;const nudge=bouncing?(u<.12?1-u/.12:u>.88?(u-.88)/.12:0):0;
    const clap=t>.58&&t<.92?Math.max(0,Math.sin(TAU*3*(t-.58)/.34-P_/2)*.5+.5):0;const cw=seg(t,.55,.6)*(1-seg(t,.9,.96));
    m.head.rotation.x=-.4-.08*ease(nudge)+.04*S2(t);m.head.rotation.z=.05*S2(2*t)*(1-cw);
    m.legs.forEach((l,i)=>{const o=open[i],s=shut[i];const k=clap*cw,wv=bouncing?.08*Math.sin(TAU*u):0;l.rotation.set(o[0]+(s[0]-o[0])*k+wv,o[1]+(s[1]-o[1])*k,o[2]+(s[2]-o[2])*k);});
    m.tail.rotation.x=.5;m.rear.forEach((r,i)=>{r.rotation.y=(i?1:-1)*(.3+.12*clap*cw);r.rotation.x=.05;});
    m.root.position.y=0;m.root.updateMatrixWorld(true);m.root.position.y+=min0-lowY(m.root);m.root.updateMatrixWorld(true);
    const p=tip();const h=bouncing?hop*4*u*(1-u):0;const w=bouncing?0:.1*Math.sin(TAU*2*(t-NB*BT)/(1-NB*BT))*seg(t,.54,.6)*(1-seg(t,.94,1));
    /* resting: the ball rolls a hair side to side on the tip, still touching it (centre one radius from the tip) */
    const fw=new V3(0,0,1).applyQuaternion(m.head.getWorldQuaternion(new Q()));fw.y=0;fw.normalize();const GM=.5;const dir=new V3(Math.sin(w),Math.cos(w),0).applyAxisAngle(new V3(0,1,0),HD).multiplyScalar(Math.cos(GM)).addScaledVector(fw,Math.sin(GM)).normalize();ball.position.copy(p).addScaledVector(dir,br);ball.position.y+=h;
    ball.rotation.set(0,HD,0);ball.rotateX(bouncing?-TAU*(t/BT)*.5:0);ball.rotateZ(-w*1.2);
    shB(ball.position.x,ball.position.y,ball.position.z);{const f=foot(m.root,.12);shS.position.set(f.x,.004,f.z);shS.scale.set(Math.max(.3,f.w*.6),Math.max(.25,f.d*.6),1);shS.rotation.z=0;}
    {let d=9;for(const v of hv){W.copy(v).applyMatrix4(m.head.matrixWorld);d=Math.min(d,W.distanceTo(ball.position));}if(d<dmin){dmin=d;}if(Math.abs(t-.99)<.01)dbg('seal ball: min head-ball centre gap',dmin,'radius',br);}
  }};});}

/* ===================== 3. Bear · squeaky toy =====================
   sits (petPose sit), holds the squeaky bone between its front paws, squeezes it twice (only the toy squashes), rolls back happily, sits up again */
function bearCell(){return cell('Bear · squeaky toy','squeezes it, rolls back happily, sits up',()=>{
  const S=world();const m0=puPet('bear',null,'adult');m0.root.updateMatrixWorld(true);
  /* paw centre of each front leg (leg space): the round paw at the bottom of the leg */
  const paw=[0,1].map(i=>{const l=m0.legs[i];const bb=new THREE.Box3().setFromObject(l);const pr=(bb.max.x-bb.min.x)/2*.8;return {p:l.worldToLocal(new V3((bb.min.x+bb.max.x)/2,bb.min.y+pr,(bb.min.z+bb.max.z)/2)),r:pr};});
  const m=petPose(m0,'sit');S.add(m.root);const Pv=m.sitPivot,a=-Pv.rotation.x;const reset=snap(m.root);const HD=.55;
  const bone=toy('toy:bone',2.1);S.add(bone);const L0=bone.userData.W,sc=bone.userData.sc;const shT=floorShadow(S,0,0,1,1);
  const front=[0,1],sdx=front.map(i=>Math.sign(m.legs[i].getWorldPosition(new V3()).x||m.hips[i].position.x));
  const phi=-1.15;
  function pawW(i){const l=m.legs[i];l.updateMatrixWorld(true);return l.localToWorld(paw[i].p.clone());}
  function setArms(th,lo){front.forEach((i,k)=>{m.hips[i].rotation.x=a+phi+(lo||0);m.hips[i].rotation.z=sdx[k]*th;});}
  /* how far out the paws go so the bone fits exactly between them */
  let thH=0;{let best=1e9;for(let th=-.3;th<=.6;th+=.005){reset();setArms(th);m.root.updateMatrixWorld(true);const g=pawW(0).distanceTo(pawW(1))-paw[0].r-paw[1].r;if(Math.abs(g-L0)<best){best=Math.abs(g-L0);thH=th;}}dbg('bear paw spread',thH,best);}
  const roll=t=>.45*seg(t,.4,.56)*(1-seg(t,.72,.86))+.12*Math.sin(TAU*(t-.56)/.16)*bell(t,.56,.72)-.06*bell(t,.84,.94);
  const sq=t=>bell(t,.08,.17)+bell(t,.22,.31);   /* squeezes */
  const pop=t=>Math.max(0,Math.sin(P_*cl((t-.15)/.06)))+Math.max(0,Math.sin(P_*cl((t-.29)/.06)));
  const C=camAt(-.15,.85,-.1,5.8,.05,.45);
  return {S,C,tick:t=>{reset();m.root.rotation.y=HD;const r=roll(t),s=sq(t),pp=pop(t);
    Pv.rotation.x=-(a+r);Pv.position.z-=.45*Math.max(0,r);
    setArms(thH-.28*s+.05*pp,.25*cl(r/.45));
    /* hind legs kick a little while rolled back */
    const rk=seg(t,.44,.56)*(1-seg(t,.7,.8));[2,3].forEach((i,k)=>{m.hips[i].rotation.x+=.25*rk*Math.sin(TAU*(t-.44)/.08+k*P_);});
    m.head.rotation.x+=-.5*Math.max(0,r)-.12*s;m.head.rotation.z=.18*Math.sin(TAU*(t-.04)/.3)*bell(t,.04,.36);m.head.rotation.y=-.12*bell(t,.04,.36);
    m.root.position.set(0,0,0);m.root.updateMatrixWorld(true);m.root.position.y=-lowY(m.root);m.root.updateMatrixWorld(true);
    const p0=pawW(0),p1=pawW(1);const ax=p1.clone().sub(p0);const gap=ax.length()-paw[0].r-paw[1].r;ax.normalize();
    const len=Math.min(gap,L0*(1+.1*pp));const kz=len/L0;
    const upv=new V3(0,1,0).applyQuaternion(m.b.getWorldQuaternion(new Q()));const yv=upv.clone().addScaledVector(ax,-upv.dot(ax)).normalize();const xv=new V3().crossVectors(yv,ax);
    bone.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xv,yv,ax));const ex=1/Math.sqrt(kz);bone.scale.set(sc*ex,sc*ex,sc*kz);
    bone.position.copy(p0).addScaledVector(ax,paw[0].r+len/2);
    {const f=foot(m.root,.15);shT.position.set(f.x,.004,f.z);shT.scale.set(Math.max(.5,f.w*.7),Math.max(.4,f.d*.7),1);}
  }};});}

/* ===================== 4. Snake · toy mouse =====================
   follow-the-leader along one path (snakeTank recipe): noses the mouse (tongue flicks), coils round it, holds, uncoils back the way it came */
function snakeCell(){return cell('Snake · toy mouse','noses it, flicks its tongue, coils round it, uncoils',()=>{
  const S=world();const m=puPet('snake',null,'adult');S.add(m.root);const RS=.056;
  const rad=m.segs.map(g=>g.position.y);const off=[];{let s=.09;rad.forEach((r,i)=>{if(i)s+=Math.min(.055,1.55*r);off.push(s);});}
  m.segs.forEach(g=>g.rotation.order='YXZ');m.head.rotation.order='YXZ';
  /* the mouse: lies still; rocks a little when nosed (on its far bottom edge, never into the ground) */
  const MY=-.5;const mz=new THREE.Group();mz.rotation.y=MY;S.add(mz);const rock=new THREE.Group();rock.position.set(0,0,.068);mz.add(rock);const mo=toy('toy:mouse',1);mo.position.set(0,mo.userData.H/2,-.068);rock.add(mo);floorShadow(S,0,0,.22,.1).rotation.z=MY;
  /* path in mouse space (x along the mouse, nose +x), turned into world */
  const toW=(x,z)=>new V3(x,0,z).applyAxisAngle(new V3(0,1,0),MY);
  const A0=.3,B0=.185,G=.16;const P=[[-.6,-2.5],[-.2,-1.95],[.25,-1.45],[.15,-.95],[0,-.6],[0,-.4]].map(([x,z])=>toW(x,z));
  for(let d=-90+38;d<=-90+38+400;d+=20){const th=d*P_/180,g=G*(d+52)/360;P.push(toW((A0+g)*Math.cos(th),(B0+g)*Math.sin(th)));}
  const path=spline(P,16);const sNear=(x,z)=>{let best=1e9,bs=0;for(let s=0;s<path.len;s+=.002){const p=path.at(s).p;const d=Math.hypot(p.x-x,p.z-z);if(d<best){best=d;bs=s;}}return bs;};
  const nz=toW(0,-.4),sN=sNear(nz.x,nz.z),sStart=sN-.16,sPoke=sN+.09,sCoil=sPoke+1.95;
  const sh=new THREE.Mesh(new THREE.CircleGeometry(.075,18),new THREE.MeshBasicMaterial({color:'#000',transparent:true,opacity:.2,depthWrite:false}));sh.rotation.x=-P_/2;sh.scale.set(1,1.3,1);S.add(sh);
  function put(g,s,hh,ex){const a=path.at(s);g.position.set(a.p.x,hh+(ex||0),a.p.z);g.rotation.set(0,Math.atan2(a.d.x,a.d.z),0);}
  function place(sH,o){const lift=o.lift||0;
    m.segs.forEach((g,i)=>{const k=cl(1-i/6);put(g,sH-off[i],.85*rad[i],lift*k*k);if(lift>0&&i<6)g.rotation.x+=-Math.atan(lift*2/(.055*6))*(i<5?.5:.2)*k;});
    put(m.head,sH,.047,lift*1.05);m.head.rotation.x=-(o.pitch||0);m.head.rotation.y+=o.look||0;
    m.tongue.scale.z=Math.max(.001,o.tg||0);const a=path.at(sH);sh.position.set(a.p.x,.004,a.p.z);sh.rotation.z=m.head.rotation.y;}
  const flick=(t,a,b)=>{const u=cl((t-a)/(b-a));if(u<=0||u>=1)return 0;const f=(u*2)%1;return Math.sin(P_*f);};
  const C=camAt(-.05,.1,-.3,2.9,.2,.55);
  return {S,C,tick:t=>{
    /* .00-.08 slides up; .08-.2 tongue flicks; .2-.27 nose poke; .27-.55 coils; .55-.7 holds, head up, flicks, looks at you; .7-.94 uncoils back; .94-1 rests */
    const sH=sStart+(sN-sStart)*seg(t,0,.08)+(sPoke-sN)*seg(t,.2,.25)+(sCoil-sPoke)*seg(t,.29,.55)-(sCoil-sStart)*seg(t,.7,.95);
    const lift=.06*seg(t,.02,.08)*(1-seg(t,.19,.22))+.09*seg(t,.56,.6)*(1-seg(t,.66,.7));
    const tg=flick(t,.09,.19)+flick(t,.6,.66);const look=-.55*seg(t,.58,.61)*(1-seg(t,.66,.69));const pitch=.18*seg(t,.02,.08)*(1-seg(t,.19,.22))-.08*bell(t,.21,.27)+.2*seg(t,.56,.6)*(1-seg(t,.66,.7));
    place(sH,{lift,tg,look,pitch});
    rock.rotation.x=.12*bell(t,.23,.31);
  }};});}

CLIPS2.toyPlay={title:'Play: the new pets play with their favourite toy',cols:2,cw:340,ch:270,frames:60,cells:[monkeyCell(),sealCell(),bearCell(),snakeCell()]};
})();
