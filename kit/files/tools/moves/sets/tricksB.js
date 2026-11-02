/* Pet Show tricks B (31 Oct): owl, monkey, seal, bear, snake. 3 tricks each: starter, gear trick, third.
   Every pet is the c14 model (puPet ... 'adult') kept as its own groups: parts only TURN at their joints (never bent).
   Each pet sits in G (world place + yaw) > Pv (turns about a pivot: flips, rolls, hanging) > Of > model root.
   settle() puts the lowest point on the floor (ground or gear top) every frame, so nothing sinks into it. */
(()=>{const H=window.MVH;const {cell,cl,ease,seg,bell,S2,C2,P_,TAU,floorShadow,grassTex,dbg}=H;const V3=THREE.Vector3;
function world(o){o=o||{};const S=H.scene(o.bg);const tex=grassTex(o.g1||'#8fbf6a',o.g2||'#7aad57');const sz=80,tile=o.tile||1.1;tex.repeat.set(sz/tile,sz/tile);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(sz,sz),new THREE.MeshLambertMaterial({map:tex}));g.rotation.x=-P_/2;S.add(g);return S;}
function camAt(tx,ty,tz,r,yaw,pitch){const C=H.cam(r,0,yaw,pitch);C.position.x+=tx;C.position.y+=ty;C.position.z+=tz;C.lookAt(tx,ty,tz);return C;}
function gear(S,id,s,ry,x,y,z){const W=new THREE.Group(),g=new THREE.Group();const M=PU[id];M.build(g,Object.assign({},M.dflt||{}));W.add(g);W.scale.setScalar(s||1);W.rotation.y=ry||0;W.position.set(x||0,y||0,z||0);S.add(W);return {W,g};}
/* the pet */
function pet(S,kind,prep,piv){const m=puPet(kind,null,'adult');if(prep)prep(m);const G=new THREE.Group(),Pv=new THREE.Group(),Of=new THREE.Group();G.add(Pv);Pv.add(Of);Of.add(m.root);S.add(G);
  const pv=new V3(...(piv||[0,0,0]));Pv.position.copy(pv);Of.position.copy(pv).negate();
  const all=[];m.root.traverse(q=>all.push([q,q.position.clone(),q.rotation.clone(),q.scale.clone()]));G.updateMatrixWorld(true);const min0=new THREE.Box3().setFromObject(m.root).min.y;
  const A={m,G,Pv,Of,all,min0,pv,reset(){all.forEach(([q,p,r,s])=>{q.position.copy(p);q.rotation.copy(r);q.scale.copy(s);});G.rotation.set(0,0,0);Pv.rotation.set(0,0,0);}};return A;}
/* update from the top of the tree: updateMatrixWorld on the model alone kept the PARENT's matrix from the frame before (the odd-frame bug) */
function box(o){o.updateWorldMatrix(true,true);return new THREE.Box3().setFromObject(o);}
/* lowest point onto height fy (+ lift) */
function settle(A,fy,lift){A.G.position.y=0;const b=box(A.m.root);A.G.position.y=(fy||0)+A.min0-b.min.y+(lift||0);A.G.updateMatrixWorld(true);}
function shadowFor(S,rx,rz){return floorShadow(S,0,0,rx,rz);}
/* shadow centred under the lowest points (where the pet touches), smaller and lighter when it is up in the air */
function contactXZ(o){o.updateWorldMatrix(true,true);let mn=1e9;const v=new V3(),pts=[];o.traverse(q=>{if(!q.isMesh||!q.visible)return;const a=q.geometry.attributes.position;for(let i=0;i<a.count;i+=3){v.fromBufferAttribute(a,i).applyMatrix4(q.matrixWorld);pts.push(v.x,v.y,v.z);if(v.y<mn)mn=v.y;}});
  let sx=0,sz=0,n=0;for(let i=0;i<pts.length;i+=3)if(pts[i+1]<mn+.08){sx+=pts[i];sz+=pts[i+2];n++;}return [sx/n,sz/n];}
function putShadow(sh,A,fy,rx,rz){const b=box(A.m.root);const c=contactXZ(A.m.root);b.min.x=b.max.x=c[0];b.min.z=b.max.z=c[1];const h=Math.max(0,b.min.y-(fy||0)-A.min0);const f=1/(1+2.2*h);sh.position.set((b.min.x+b.max.x)/2,(fy||0)+.004,(b.min.z+b.max.z)/2);sh.scale.set(rx*f,rz*f,1);sh.material.opacity=.24*f;}
/* turn joint g (rotation x,z; y fixed) so its local point tip lands as close as possible on the world point T */
function solve(g,tip,T,ry){g.parent.updateMatrixWorld(true);const Mp=g.parent.matrixWorld;const e=new THREE.Euler(),v=new V3();const y=ry||0;
  const f=(x,z)=>{e.set(x,y,z,g.rotation.order);v.copy(tip).multiply(g.scale).applyEuler(e).add(g.position).applyMatrix4(Mp);return v.distanceTo(T);};
  let b=[0,0,1e9];for(let x=-3.2;x<=3.2;x+=.1)for(let z=-1.6;z<=1.6;z+=.1){const d=f(x,z);if(d<b[2])b=[x,z,d];}
  let st=.05;for(let i=0;i<8;i++){let imp=true;while(imp){imp=false;for(const [dx,dz] of[[st,0],[-st,0],[0,st],[0,-st],[st,st],[-st,-st],[st,-st],[-st,st]]){const d=f(b[0]+dx,b[1]+dz);if(d<b[2]-1e-7){b=[b[0]+dx,b[1]+dz,d];imp=true;}}}st/=2;}
  return b;}
const mixR=(g,a,b,k)=>{g.rotation.set(a[0]+(b[0]-a[0])*k,(a[2]||0)+((b[2]||0)-(a[2]||0))*k,a[1]+(b[1]-a[1])*k);};
const hop=(t,a,b,h)=>{const u=cl((t-a)/(b-a));return u>0&&u<1?4*h*u*(1-u):0;};
/* wings: open = lower edge out, away from the body */
function wings(m,a){m.wings.forEach(w=>{w.rotation.z=Math.sign(w.position.x)*a;});}

/* ================= OWL ================= */
function owlHead(){return cell('Owl · Head turn','starter',()=>{const S=world();const A=pet(S,'owl');const m=A.m;const sh=shadowFor(S,.24,.22);const C=camAt(0,.4,0,.5,.4,.18);
  return {S,C,tick:t=>{A.reset();
    const L=seg(t,.08,.2)*(1-seg(t,.3,.4)),R=seg(t,.46,.58)*(1-seg(t,.68,.78));
    m.head.rotation.y=1.75*L-1.75*R;m.head.rotation.z=.3*bell(t,.19,.31)-.3*bell(t,.57,.69)+.28*Math.sin(TAU*2*cl((t-.82)/.12))*bell(t,.82,.94);
    wings(m,.35*bell(t,.84,.98));m.b.rotation.y=-.12*L+.12*R;m.head.rotation.y-=m.b.rotation.y;
    settle(A,0);putShadow(sh,A,0,.24,.22);}};});}
function owlPerch(){return cell('Owl · Perch hop','on its perch, wings open',()=>{const S=world();const s=1.7;gear(S,'train:owl',s,0,0,0,0);const top=1.5*s;
  const A=pet(S,'owl');const m=A.m;const C=camAt(0,top+.35,0,.62,.4,.16);const X=.38;
  return {S,C,tick:t=>{A.reset();const u1=cl((t-.12)/.2),u2=cl((t-.6)/.2);const air=(u1>0&&u1<1)||(u2>0&&u2<1);
    const x=-X+2*X*ease(u1)-2*X*ease(u2);const y=hop(t,.12,.32,.4)+hop(t,.6,.8,.4);
    const open=Math.max(seg(t,.06,.12)*(1-seg(t,.46,.52)),seg(t,.54,.6)*(1-seg(t,.94,.99)));const flap=air?.3*Math.sin(TAU*3*(t<.5?u1:u2)):0;wings(m,(.95+flap)*open);
    if(air)m.legs.forEach(l=>l.rotation.x=.5*Math.sin(P_*(t<.5?u1:u2)));
    m.head.rotation.x=-.15*bell(t,.34,.46)-.15*bell(t,.82,.94);m.head.rotation.z=.2*bell(t,.34,.46)-.2*bell(t,.82,.94);
    A.G.position.x=x;settle(A,top-.008,y);}};});}
function owlSpin(){return cell('Owl · Spin','hops up, spins round',()=>{const S=world();const A=pet(S,'owl',null,[0,.35,0]);const m=A.m;const sh=shadowFor(S,.24,.22);const C=camAt(0,.55,0,.62,.4,.18);
  return {S,C,tick:t=>{A.reset();const u=cl((t-.16)/.42);const air=u>0&&u<1;const y=hop(t,.16,.58,.6);
    A.G.rotation.y=TAU*ease(u);const open=seg(t,.08,.16)*(1-seg(t,.62,.7));wings(m,(.95+(air?.25*Math.sin(TAU*4*u):0))*open);
    if(air)m.legs.forEach(l=>l.rotation.x=.45*Math.sin(P_*u));
    m.head.rotation.x=.25*bell(t,.72,.84);m.b.rotation.x=.12*bell(t,.72,.84);
    settle(A,0,y);putShadow(sh,A,0,.24,.22);}};});}

/* ================= MONKEY ================= */
const MTIP=new V3(0,-.33,.04);
function monkeyClap(){return cell('Monkey · Clap','starter',()=>{const S=world();const A=pet(S,'monkey');const m=A.m;const sh=shadowFor(S,.25,.42);
  const Q=new V3(0,.33,-.2),sitA=-1.05;
  const setSit=k=>{const a=sitA*k;m.b.rotation.x=a;const q=Q.clone().applyEuler(new THREE.Euler(a,0,0));m.b.position.copy(Q).sub(q);};
  /* solve the arms once in the sitting pose: open (out to the sides) and clapped (paws meet in front of the chest) */
  setSit(1);m.root.updateMatrixWorld(true);const fr=[0,1];
  const tg=(x,y,z)=>m.b.localToWorld(new V3(x,y,z));const open=fr.map(i=>{const sd=Math.sign(m.legs[i].position.x);return solve(m.legs[i],MTIP,tg(sd*.3,.3,.36));}),shut=fr.map(i=>{const sd=Math.sign(m.legs[i].position.x);return solve(m.legs[i],MTIP,tg(sd*.028,.12,.42));});
  dbg('monkey clap fit',open[0][2],shut[0][2]);A.reset();
  const C=camAt(0,.42,.05,.62,.45,.16);
  return {S,C,tick:t=>{A.reset();const k=seg(t,.06,.2)*(1-seg(t,.82,.95));setSit(k);
    const clap=Math.max(0,Math.sin(TAU*4*cl((t-.26)/.5)))*(t>.26&&t<.76?1:0);
    fr.forEach((i,j)=>{const o=open[j],c=shut[j];const r=[o[0]+(c[0]-o[0])*clap,o[1]+(c[1]-o[1])*clap];m.legs[i].rotation.set(r[0]*k,0,r[1]*k);});
    [2,3].forEach(i=>{m.legs[i].rotation.x=.25*k;m.legs[i].rotation.z=Math.sign(m.legs[i].position.x)*.3*k;});
    m.tail.rotation.x=.9*k;m.tail.rotation.y=.25*Math.sin(TAU*3*t)*k;
    m.head.rotation.x=.75*k-.12*clap*k;m.head.rotation.z=.15*Math.sin(TAU*2*t)*k;
    settle(A,0,.03*clap*k);putShadow(sh,A,0,.25,.4);}};});}
function monkeyBars(){return cell('Monkey · Monkey bars','swings hand over hand',()=>{const S=world();gear(S,'train:monkey',1,P_/2,0,0,0);/* bars now run along z, towards the camera */
  const RY=1.6;const rz=i=>-.9+.3*i;/* rung z (gear turned: rungs at z -.9 .. .9); the monkey goes towards the camera (+z) */
  const A=pet(S,'monkey',null,[0,.35,.19]);const m=A.m;const Lr=MTIP.length();
  const sh=shadowFor(S,.22,.22);const C=camAt(0,1.15,-.15,.85,-.7,.0);const N=4,YAW=-.55;
  return {S,C,tick:t=>{A.reset();let p;/* p = position in rungs, 0..N and back */
    if(t<.04)p=0;else if(t<.44)p=N*cl((t-.04)/.4);else if(t<.56)p=N;else if(t<.96)p=N-N*cl((t-.56)/.4);else p=0;
    const j=Math.min(N-1,Math.floor(p)),h=p-j;const e=ease(h);
    /* step j: holds rung j+1; the other hand goes rung j <-> j+2 (dips under rung j+1); left hand (legs[0]) on even rungs */
    const zHold=rz(j+1),mid=rz(j)+(rz(j+1)-rz(j))*(.5+e);const hi=((j+1)%2===0)?0:1,fi=1-hi;
    /* body turned a bit towards the camera; the holding shoulder hangs exactly one arm length under its rung */
    const swing=.4*Math.sin(P_*e)*(t<.5?1:-1);A.Pv.rotation.set(-P_/2+.3+swing,0,0);A.G.rotation.y=YAW;const pw=A.pv.clone().applyAxisAngle(new V3(0,1,0),YAW);A.G.position.set(-pw.x,0,mid-pw.z);A.G.updateMatrixWorld(true);
    const shz=m.legs[hi].getWorldPosition(new V3()).z,dz=shz-zHold;const sy=RY-Math.sqrt(Math.max(.0001,Lr*Lr-dz*dz));A.G.position.y=sy-A.pv.y;A.G.updateMatrixWorld(true);
    const tH=new V3(m.legs[hi].getWorldPosition(new V3()).x,RY,zHold);
    const fz=rz(j)+(rz(j+2)-rz(j))*e,fy=RY-.26*Math.sin(P_*e);const tF=new V3(m.legs[fi].getWorldPosition(new V3()).x,fy,fz);
    const a=solve(m.legs[hi],MTIP,tH),b=solve(m.legs[fi],MTIP,tF);m.legs[hi].rotation.set(a[0],0,a[1]);m.legs[fi].rotation.set(b[0],0,b[1]);
    if(Math.abs(h-.5)<.04)dbg('bars t',t.toFixed(2),'hold err',a[2].toFixed(3),'free err',b[2].toFixed(3));
    m.head.rotation.x=1.15;m.head.rotation.y=.2*Math.sin(TAU*2*t);
    [2,3].forEach((i,k)=>{m.legs[i].rotation.x=P_/2-.3+.3*Math.sin(P_*p+k*P_);});m.tail.rotation.x=-.4+.2*Math.sin(P_*p);
    putShadow(sh,A,0,.22,.22);}};});}
function monkeyFlip(){return cell('Monkey · Flip','jumps, back flip, lands',()=>{const S=world();const A=pet(S,'monkey',null,[0,.36,0]);const m=A.m;const sh=shadowFor(S,.25,.42);const C=camAt(0,.6,0,.75,.7,.15);
  return {S,C,tick:t=>{A.reset();const u=cl((t-.2)/.36);const air=u>0&&u<1;const cr=bell(t,.1,.22)+bell(t,.54,.66);
    m.legs.forEach((l,i)=>{const f=i<2;l.rotation.x=(f?-.45:.45)*cr;});
    if(air){A.Pv.rotation.x=-TAU*ease(u);const k=Math.sin(P_*u);m.legs.forEach((l,i)=>{l.rotation.x=(i<2?.9:-.9)*k;});m.tail.rotation.x=.6*k;}
    const happy=bell(t,.7,.9);m.head.rotation.x=-.3*happy;m.tail.rotation.y=.4*Math.sin(TAU*4*t)*happy;
    const y=hop(t,.2,.56,.75)+hop(t,.72,.8,.12)+hop(t,.8,.88,.12);
    /* never below the ground while turning */
    A.G.position.y=0;const b=box(A.m.root);const need=A.min0-b.min.y;A.G.position.y=Math.max(need+y,need);A.G.updateMatrixWorld(true);
    putShadow(sh,A,0,.25,.4);}};});}

/* ================= SEAL ================= */
function sealRear(m,k){const ba=-.5*k;m.b.rotation.x=ba;m.b.position.set(0,-(.02*Math.cos(ba)-(-.3)*Math.sin(ba))+.02,-.3-(.02*Math.sin(ba)+(-.3)*Math.cos(ba)));}
function sealFits(m){/* the approved clap: front flippers open (out, raised) and clapped (paddles meet in front of the chest) */
  const fit=(l,T)=>{const sd=Math.sign(l.position.x),tip=new V3(sd*.2,-.1,.03),e=new THREE.Euler(),v=new V3();let best=[0,0,0,1e9];
    for(let x=-2.4;x<=.4;x+=.08)for(let y=-1.2;y<=1.2;y+=.08)for(let z=-1.6;z<=1.6;z+=.08){e.set(x,y,z);v.copy(tip).applyEuler(e).add(l.position);const d=v.distanceTo(T);if(d<best[3])best=[x,y,z,d];}return best;};
  return {shut:m.legs.map(l=>fit(l,new V3(Math.sign(l.position.x)*.035,.24,.36))),open:m.legs.map(l=>fit(l,new V3(Math.sign(l.position.x)*.36,.22,.2)))};}
function sealFlip(m,F,k,clap){m.legs.forEach((l,i)=>{const o=F.shut[i],w=F.open[i];l.rotation.set((w[0]+(o[0]-w[0])*clap)*k,(w[1]+(o[1]-w[1])*clap)*k,(w[2]+(o[2]-w[2])*clap)*k);});}
function sealClap(){return cell('Seal · Flipper clap','starter',()=>{const S=world();const A=pet(S,'seal');const m=A.m;const F=sealFits(m);const sh=shadowFor(S,.55,.95);const C=camAt(0,.7,0,1.05,.55,.15);A.G.rotation.y=-.15;
  return {S,C,tick:t=>{A.reset();A.G.rotation.y=-.15;const k=seg(t,.06,.2)*(1-seg(t,.82,.95));sealRear(m,k);
    const clap=t>.24&&t<.78?Math.max(0,Math.sin(TAU*4*cl((t-.24)/.54))):0;sealFlip(m,F,k,clap);
    m.head.rotation.x=(-.08-.18*clap)*k;m.head.rotation.z=.08*Math.sin(TAU*2*t)*k;m.tail.rotation.x=.5*k;m.rear.forEach((r,i)=>{r.rotation.y=(i?1:-1)*(.3+.1*clap)*k;});
    settle(A,0);putShadow(sh,A,0,.55,.95);}};});}
function sealBall(){return cell('Seal · Ball on the nose','with its beach ball',()=>{const S=world();const G=gear(S,'train:seal',1,0,0,0,0);const br=.28;
  const A=pet(S,'seal');const m=A.m;const F=sealFits(m);const sh=shadowFor(S,.55,.95);const bsh=shadowFor(S,.26,.26);
  const B0=new V3(-.4,0,1.0);const C=camAt(.05,.95,.2,1.45,.6,.13);
  let tipL;{A.reset();const hb=box(m.head);tipL=m.head.worldToLocal(new V3((hb.min.x+hb.max.x)/2,hb.min.y+.45*(hb.max.y-hb.min.y),hb.max.z-.03));}
  const nose=()=>{m.head.updateWorldMatrix(true,false);return m.head.localToWorld(tipL.clone());};
  return {S,C,tick:t=>{A.reset();
    const k=seg(t,.08,.18)*(1-seg(t,.84,.96));sealRear(m,k);
    const clap=t>.72&&t<.88?Math.max(0,Math.sin(TAU*2*cl((t-.72)/.16))):0;sealFlip(m,F,k,clap);
    const bump=bell(t,.14,.22);m.head.rotation.x=(.45*bump-.75*seg(t,.22,.3)*(1-seg(t,.62,.7)))*1;/* nose up while balancing */m.head.rotation.y=-.6*bump*(1-seg(t,.2,.22));
    const bal=t>.3&&t<.62?1:0;m.head.rotation.z=.07*Math.sin(TAU*3*t)*bal;m.head.rotation.x+=.04*Math.sin(TAU*3*t+.4)*bal;
    m.tail.rotation.x=.5*k;m.rear.forEach((r,i)=>{r.rotation.y=(i?1:-1)*(.3+.15*clap)*k;});
    settle(A,0);putShadow(sh,A,0,.55,.95);
    /* the ball: lies there, bumped up onto the nose, balanced, tossed back to its spot, one bounce */
    const N=nose();const g0=B0.clone().setY(0);let p,spin=0;
    if(t<.2)p=g0;else if(t<.32){const u=ease((t-.2)/.12);p=g0.clone().lerp(N,u);p.y+=.55*4*u*(1-u);spin=TAU*u;}
    else if(t<.62)p=N;else if(t<.78){const u=(t-.62)/.16;p=N.clone().lerp(g0,ease(cl((u-.15)/.85)));p.y+=1.1*4*u*(1-u);p.y=Math.max(p.y,0);spin=-TAU*u;}
    else{p=g0.clone();p.y=hop(t,.78,.88,.18);}
    G.W.position.copy(p);G.W.rotation.set(0,TAU*2*cl((t-.3)/.32),.0+.1*Math.sin(TAU*3*t)*bal);G.W.rotation.x=spin;
    bsh.position.set(p.x,.004,p.z);const f=1/(1+2*p.y);bsh.scale.set(.26*f,.26*f,1);bsh.material.opacity=.24*f;}};});}
function sealRoll(){return cell('Seal · Roll over','rolls right round, and back',()=>{const S=world();const A=pet(S,'seal',null,[0,.18,-.05]);const m=A.m;const sh=shadowFor(S,.55,.95);const C=camAt(0,.45,0,1.2,.45,.22);
  return {S,C,tick:t=>{A.reset();const tuck=seg(t,.06,.14)*(1-seg(t,.86,.94));
    m.legs.forEach(l=>{const sd=Math.sign(l.position.x);l.rotation.set(-.35*tuck,0,-sd*.55*tuck);});
    const r1=ease(cl((t-.14)/.3)),r2=ease(cl((t-.56)/.3));const th=-TAU*r1+TAU*r2;A.Pv.rotation.z=th;A.G.position.x=-th*.13;
    const onBack=Math.max(bell(t,.22,.36),bell(t,.64,.78));m.rear.forEach((r,i)=>{r.rotation.y=(i?1:-1)*(.2+.4*onBack*Math.max(0,Math.sin(TAU*8*t)));});
    const wig=bell(t,.45,.56);m.head.rotation.x=-.3*wig;m.head.rotation.y=.35*Math.sin(TAU*6*t)*wig;m.tail.rotation.x=.3*wig;
    settle(A,0);putShadow(sh,A,0,.55,.95);}};});}

/* ================= BEAR ================= */
function bearPrep(m){petPose(m,'sit');const sp=m.sitPivot;m.sitV={py:sp.position.y,rx:sp.rotation.x,hips:m.hips.map(h=>[h.rotation.x,h.rotation.z]),hx:m.head.rotation.x};
  sp.rotation.x=0;sp.position.y=m.hips[0].position.y;m.hips.forEach(h=>h.rotation.set(0,0,0));m.head.rotation.x-=.95*1.05;m.front=m.hips.map(h=>h.position.z>0);}
/* sit like c14 petPose 'sit', but a little more upright (.7, not .95): at .95 the round tail is the lowest point and the bottom floats */
const BA=.7;function bearSit(m,k){m.sitPivot.rotation.x=-BA*k;m.hips.forEach((h,i)=>{h.rotation.x=(m.front[i]?BA-.25:-.08)*k;h.rotation.z=(m.front[i]?0:(h.position.x<0?1:-1)*.45)*k;});m.head.rotation.x+=BA*1.05*k;}
function bearWave(){return cell('Bear · Sit up and wave','starter',()=>{const S=world();const A=pet(S,'bear',bearPrep);const m=A.m;const sh=shadowFor(S,.6,.95);const C=camAt(0,.95,0,1.2,.45,.12);
  const wi=m.hips.findIndex((h,i)=>m.front[i]&&h.position.x<0);/* the far paw, so it does not cover the face */
  return {S,C,tick:t=>{A.reset();const k=seg(t,.06,.22)*(1-seg(t,.8,.95));bearSit(m,k);
    const up=seg(t,.26,.34)*(1-seg(t,.66,.74));const w=m.hips[wi];w.rotation.x=w.rotation.x*(1-up)+(-1.75)*up;w.rotation.z+=(-.45+.38*Math.sin(TAU*4*cl((t-.32)/.36)))*up;
    m.head.rotation.z=-.15*up;m.head.rotation.y=.12*up;m.tail.rotation.y=.3*Math.sin(TAU*3*t)*k;
    settle(A,0);putShadow(sh,A,0,.6,.95);}};});}
function bearLog(){return cell('Bear · Walk the log','balances, hop-turns at the end',()=>{const S=world();const s=1.6;gear(S,'train:bear',s,P_/2,0,0,-1.0*s);const LR=.25*s,LY=.25*s,TOP=LY+LR;
  const A=pet(S,'bear',bearPrep);const m=A.m;const C=camAt(0,1.0,0,1.4,1.45,.2);
  const Z=.42,sc=m.root.scale.x,len=.95*sc,Ah=.2,stride=2*len*Math.sin(Ah)*1.0;const legPh=[.25,.75,0,.5];/* walk: FL FR HL HR order by hip index below */
  const ord=m.hips.map((h,i)=>(m.front[i]?(h.position.x<0?0:1):(h.position.x<0?2:3)));
  const ang=ph=>{ph=((ph%1)+1)%1;if(ph<.7)return -Ah+2*Ah*(ph/.7);const u=(ph-.7)/.3;return Ah-2*Ah*ease(u);};
  return {S,C,tick:t=>{A.reset();let z,yaw,hp=0,air=0,dist;
    if(t<.04){z=-Z;yaw=0;dist=0;}else if(t<.4){const u=ease((t-.04)/.36);z=-Z+2*Z*u;yaw=0;dist=2*Z*u;}else if(t<.52){z=Z;const u=cl((t-.42)/.08);yaw=P_*ease(u);air=hop(t,.42,.5,.14);dist=2*Z;}
    else if(t<.88){const u=ease((t-.52)/.36);z=Z-2*Z*u;yaw=P_;dist=2*Z+2*Z*u;}else{z=-Z;const u=cl((t-.9)/.08);yaw=P_+P_*ease(u);air=hop(t,.9,.98,.14);dist=4*Z;}
    const walking=(t>.04&&t<.4)||(t>.52&&t<.88);const ph=dist/stride;
    m.hips.forEach((h,i)=>{const sd=Math.sign(h.position.x);h.rotation.z=-sd*.235;h.rotation.x=walking?-ang(ph+legPh[ord[i]]):0;if(air)h.rotation.x=(m.front[i]?-.3:.3)*Math.sin(P_*air/.14);});
    A.G.position.set(0,0,z);A.G.rotation.y=yaw;A.G.rotation.z=.04*Math.sin(TAU*2*t);m.head.rotation.y=.12*Math.sin(TAU*1.5*t);m.head.rotation.x+=-.1*bell(t,.4,.5)-.1*bell(t,.88,.98);
    A.G.rotation.order='YXZ';settle(A,TOP-.01,air);
    if(Math.abs(t-.2)<.011||Math.abs(t-.7)<.011){/* feet on the log: lowest leg points vs log top */const lo=m.hips.map(h=>box(h).min.y.toFixed(3)).join(' ');dbg('bear log feet y',lo,'top',TOP.toFixed(3));}}};});}
function bearRoll(){return cell('Bear · Roll over','lies down, rolls round, and back',()=>{const S=world();const A=pet(S,'bear',bearPrep,[0,.62,0]);const m=A.m;const sh=shadowFor(S,.6,.95);const C=camAt(0,.6,0,1.45,.45,.25);
  return {S,C,tick:t=>{A.reset();const lie=seg(t,.04,.14)*(1-seg(t,.86,.96));
    m.hips.forEach((h,i)=>{const sd=Math.sign(h.position.x);h.rotation.x=(m.front[i]?1.25:-1.25)*lie;h.rotation.z=-sd*.1*lie;/* paws folded under the belly, away from the face */});
    const r1=ease(cl((t-.16)/.3)),r2=ease(cl((t-.56)/.3));const th=-TAU*r1+TAU*r2;A.Pv.rotation.z=th;A.G.position.x=-th*.16;
    const paddle=Math.max(bell(t,.24,.38),bell(t,.64,.78));if(paddle)m.hips.forEach((h,i)=>{h.rotation.x+=.35*paddle*Math.sin(TAU*8*t+i*1.6);});
    const happy=bell(t,.46,.56);m.head.rotation.y=.3*Math.sin(TAU*5*t)*happy;m.head.rotation.x+=-.2*happy-.15*lie;
    settle(A,0);putShadow(sh,A,0,.6,.95);}};});}

/* ================= SNAKE ================= */
/* lay the snake along a path (head first), like c14 snakeAlong: each piece rigid, placed at its distance along the path */
function snakeLay(m,P,o){o=o||{};const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+P[i].distanceTo(P[i-1]));
  const at=s=>{s=Math.max(0,Math.min(L[L.length-1]-1e-4,s));let i=1;while(L[i]<s)i++;const k=(s-L[i-1])/((L[i]-L[i-1])||1);return {p:P[i-1].clone().lerp(P[i],k),d:P[i].clone().sub(P[i-1]).normalize()};};
  const yaw=(d,fb)=>{const h=Math.hypot(d.x,d.z);const a=Math.atan2(-d.x,-d.z);return h>.5?a:h<.15?fb:fb+(a-fb)*(h-.15)/.35;};
  {const q=at(0);m.head.position.set(q.p.x,q.p.y+.06,q.p.z);m.head.rotation.set(o.hp||0,o.hy!=null?o.hy:yaw(q.d,0),0,'YXZ');}
  let s=.09;m.segs.forEach((g,i)=>{const r0=g.userData.r0??(g.userData.r0=g.position.y);if(i)s+=Math.min(.055,1.55*r0);const q=at(s);g.position.set(q.p.x,q.p.y+r0,q.p.z);g.rotation.set(0,yaw(q.d,o.hy||0),0);});
  if(m.tongue)m.tongue.scale.z=Math.max(.001,o.tg||0);}
function curve(pts,n){return new THREE.CatmullRomCurve3(pts,false,'centripetal').getSpacedPoints(n||500);}
/* flat spiral on the ground, from the inner end (towards the camera) outward */
function spiral(r0,k,th0,turns,cy){const o=[];for(let th=th0;th<th0+turns*TAU;th+=.18){const r=r0+k*(th-th0)/TAU;o.push(new V3(Math.sin(th)*r,cy||0,Math.cos(th)*r));}return o;}
const flick=u=>{const f=((u%1)+1)%1;return f<.3?Math.sin(P_*f/.3):0;};
function snakePet(S){const A=pet(S,'snake');A.m.root.position.set(0,0,0);return A;}
/* the risen body: head at height Y (sway sw), front body bends down into the coil */
function risePath(Y,sw,lk){const r0=.17;const SP=spiral(r0,.14,.35,2.2,0);
  const c=[new V3(sw,Y,r0+.06),new V3(sw*.15-.02,Y*.62,r0+.01),new V3(-sw*.35-.05,Y*.3+.03,r0-.04),new V3(-.06,.02,r0-.06),...SP];return curve(c);}
function snakeSway(){return cell('Snake · Sway to the flute','starter',()=>{const S=world();const A=snakePet(S);const m=A.m;const sh=shadowFor(S,.48,.48);const C=camAt(0,.25,.05,.48,.4,.32);
  return {S,C,tick:t=>{const up=seg(t,.06,.24)*(1-seg(t,.8,.95));const Y=.09+.46*up;const swk=seg(t,.2,.3)*(1-seg(t,.74,.82));const sw=.13*Math.sin(TAU*3*cl((t-.2)/.62))*swk;
    snakeLay(m,risePath(Y,sw),{hy:-sw*1.2,hp:.15*up,tg:t>.3&&t<.75?flick((t-.3)*7):0});sh.position.set(0,.004,0);}};});}
function snakeBasket(){return cell('Snake · Rise from the basket','its charmer basket',()=>{const S=world();const s=1.3;gear(S,'train:snake',s,0,0,0,0);const TOPY=.48*s;/* the basket model has a closed top; a dark opening disc (marked: added here, not in the model) so the snake rises out of an open basket */
  {const d=new THREE.Mesh(new THREE.CircleGeometry(.27*s,24),new THREE.MeshLambertMaterial({color:'#3a2a1c'}));d.rotation.x=-P_/2;d.position.y=TOPY+.004;S.add(d);}
  const A=snakePet(S);const m=A.m;const C=camAt(.05,.72,.1,.85,.45,.18);
  const inside=[];for(let i=0;i<40;i++){const a=i*.45,r=.16+.06*Math.sin(i*.3);inside.push(new V3(Math.sin(a)*r,.06+.012*i,Math.cos(a)*r));}
  return {S,C,tick:t=>{const up=seg(t,.08,.32)*(1-seg(t,.76,.94));const Y=TOPY-.25+.85*up;const swk=seg(t,.3,.38)*(1-seg(t,.68,.76));const sw=.15*Math.sin(TAU*2.5*cl((t-.3)/.46))*swk;
    const T2=Math.min(TOPY,Y-.1);const c=[new V3(sw,Y,0),new V3(sw*.3,(Y+T2)/2,0),new V3(0,T2,0),new V3(0,T2-.15,0),new V3(0,.6*TOPY-.04,0),...inside.slice().reverse().map(p=>p.clone()).filter(p=>p.y<.5*TOPY).reverse()];
    const look=.6*bell(t,.4,.52)-.6*bell(t,.54,.66);
    snakeLay(m,curve(c),{hy:-sw*1.2+look,hp:.15,tg:t>.36&&t<.72?flick((t-.36)*8):0});
    m.segs.forEach(g=>g.visible=g.position.y>TOPY-.06);m.head.visible=m.head.position.y>TOPY-.08;}};});}
function snakeCoilSpin(){return cell('Snake · Coil spin','head up, spins round twice',()=>{const S=world();const A=snakePet(S);const m=A.m;const sh=shadowFor(S,.48,.48);const C=camAt(0,.25,.05,.5,.4,.32);
  return {S,C,tick:t=>{const up=seg(t,.04,.16)*(1-seg(t,.84,.96));const Y=.09+.32*up;
    A.G.rotation.y=2*TAU*ease(cl((t-.18)/.62));
    snakeLay(m,risePath(Y,0),{hy:0,hp:.15*up,tg:t>.84&&t<.96?flick((t-.84)*8):0});sh.position.set(0,.004,0);}};});}

window.CLIPS2.tricksB={title:'Pet Show tricks: owl, monkey, seal, bear, snake',cols:3,cw:300,ch:250,frames:60,cells:[
  owlHead(),owlPerch(),owlSpin(),monkeyClap(),monkeyBars(),monkeyFlip(),sealClap(),sealBall(),sealRoll(),bearWave(),bearLog(),bearRoll(),snakeSway(),snakeBasket(),snakeCoilSpin()]};
})();
