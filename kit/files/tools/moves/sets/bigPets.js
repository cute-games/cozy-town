/* big pets (bear, seal) + Sir Barkley's license: waitOutside, vetBig, sealNew, license */
(()=>{const H=window.MVH;const {cell,cl,ease,seg,bell,S2,C2,P_,TAU,floorShadow,grassTex,mk,dbg,lieP}=H;
/* ---- scene + camera ---- */
function world(o){o=o||{};const S=H.scene(o.bg);const tex=grassTex(o.g1||'#8fbf6a',o.g2||'#7aad57');const sz=80,tile=o.tile||1.3;tex.repeat.set(sz/tile,sz/tile);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(sz,sz),new THREE.MeshLambertMaterial({map:tex}));g.rotation.x=-P_/2;S.add(g);return S;}
function camAt(tx,ty,tz,r,yaw,pitch){const C=H.cam(r,0,yaw,pitch);C.position.x+=tx;C.position.y+=ty;C.position.z+=tz;C.lookAt(tx,ty,tz);return C;}
/* ---- a PU model kept as its own groups (rigid pieces turning at joints); cap = builder whose returned groups we keep ---- */
function J(id,opt,cap){let got=null,orig=null;if(cap){orig=window[cap];window[cap]=function(...a){const r=orig.apply(this,a);if(!got)got=r;return r;};}
  const g=new THREE.Group();try{PU[id].build(g,Object.assign({},PU[id].dflt,opt||{}));}finally{if(cap)window[cap]=orig;}
  const root2=new THREE.Group(),turn=new THREE.Group();turn.rotation.y=P_/2;turn.add(g);root2.add(turn);root2.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(root2);const all=[];g.traverse(q=>all.push([q,q.position.clone(),q.rotation.clone(),q.scale.clone()]));
  const R={m:got,g,root2,turn,L:bb.max.x-bb.min.x,H:bb.max.y-bb.min.y,W:bb.max.z-bb.min.z,min0:bb.min.y,all,id};return R;}
function JR(R){R.all.forEach(([q,p,r,s])=>{q.position.copy(p);q.rotation.copy(r);q.scale.copy(s);});R.turn.position.y=0;}
/* keep the lowest point where it was at rest (outline under the ground like in the game), on a floor at height fy */
function JG(R,fy){R.turn.position.y=0;R.root2.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(R.turn);R.turn.position.y=(R.root2.position.y+(fy||0)+R.min0)-bb.min.y;R.root2.updateMatrixWorld(true);}
function fade(R,a){if(!R._fm){R._fm=[];R.root2.traverse(q=>{if(q.isMesh){q.material=q.material.clone();q.material.transparent=true;R._fm.push([q.material,q.material.opacity]);}});}R._fm.forEach(([m,o])=>{m.opacity=o*a;m.depthWrite=a>.98;});R.root2.visible=a>.02;}
/* ---- a path in time: keys [[t,x,z]], eased between keys; walking phase comes from the distance walked (no sliding feet) ---- */
function track(keys){const pos=t=>{if(t<=keys[0][0])return [keys[0][1],keys[0][2]];for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(t<=b[0]){const u=ease((t-a[0])/((b[0]-a[0])||1));return [a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u];}}const l=keys[keys.length-1];return [l[1],l[2]];};
  const N=800,cum=[0];for(let k=1;k<=N;k++){const p=pos((k-1)/N),q=pos(k/N);cum[k]=cum[k-1]+Math.hypot(q[0]-p[0],q[1]-p[1]);}
  const dist=t=>{const f=cl(t)*N,i=Math.min(N-1,Math.floor(f));return cum[i]+(cum[i+1]-cum[i])*(f-i);};
  const spd=t=>(dist(Math.min(1,t+.01))-dist(Math.max(0,t-.01)))/.02;return {pos,dist,spd};}
function lerpK(keys,t){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(t<=b[0]){const u=ease((t-a[0])/((b[0]-a[0])||1));return a[1]+(b[1]-a[1])*u;}}return keys[keys.length-1][1];}
/* heading th: model faces (cos th, 0, -sin th); th=0 → +x, -P_/2 → +z (towards the camera) */
/* ---- people (makePerson groups): walk with legs from the hips, arms from the shoulders ---- */
function personWalk(p,ph,amp){const a=.42*amp*S2(ph);p.legs[0].rotation.x=-a;p.legs[1].rotation.x=a;p.arms[0].rotation.x=a*.8;p.arms[1].rotation.x=-a*.8;}
function person(id,opt){const R=J(id,opt,'makePerson');R.p=R.m;return R;}
/* ---- clinic door scene ---- */
function clinicScene(){const S=world();const cl_=H.propB?null:null;const g=new THREE.Group();PU['vet:clinic'].build(g,PU['vet:clinic'].dflt||{});g.position.z=-4.5;S.add(g);return S;}
const PATH_Y=.08;const onPath=(x,z)=>Math.abs(x)<1.7&&z>.1&&z<1.7;
function pathY(x,z){const r=(w,d)=>cl(1-Math.max(Math.max(0,Math.abs(x)-w+.12)/.12,Math.max(0,z-d+.12)/.12));return Math.max(PATH_Y*r(1.7,1.7),.15*r(.95,.92));}

/* ===== 1. wait outside ===== */
function waitCell(kind){const bear=kind==='bear';
 return cell(bear?'Bear waits by the door':'Seal waits by the door',bear?'sits, looks around, sighs; follows you out':'lies down, looks around, sighs; follows you out',()=>{
  const S=clinicScene();const F=person('farm:farmer',{who:'a'});S.add(F.root2);const fSh=floorShadow(S,0,0,.32,.26);
  /* the person: in from the right on the step, into the door, back out, off to the right */
  const fT=track([[0,6.6,1.0],[.2,.15,1.0],[.25,0,.32],[.64,0,.32],[.69,0,.95],[.71,0.05,1.0],[.97,6.6,1.0],[1,6.6,1.0]]);
  const fH=[[0,P_],[.19,P_],[.23,P_/2],[.64,P_/2],[.65,-P_/2],[.69,-P_/2],[.72,0],[1,0]];
  const fA=[[0,1],[.255,1],[.3,0],[.62,0],[.66,1],[1,1]];
  let A,aT,aH,sh;
  if(bear){A=mk('pet:bear',{v:'teddy',age:'adult'},null,null,{rigid:true});S.add(A.root2);RIG.addShadow(A,S);
    aT=track([[0,8.2,2.25],[.26,1.6,2.25],[.74,1.6,2.25],[.99,8.2,2.25],[1,8.2,2.25]]);aH=[[0,P_],[.26,P_],[.33,1.5*P_],[.68,1.5*P_],[.76,2*P_],[1,2*P_]];}
  else{A=J('pet:seal',{},'makePUPet');S.add(A.root2);sh=floorShadow(S,0,0,.9,.5);
    aT=track([[0,8.6,2.7],[.27,2.2,2.7],[.74,2.2,2.7],[.99,8.6,2.7],[1,8.6,2.7]]);aH=[[0,P_],[.27,P_],[.33,2*P_-1.4],[.68,2*P_-1.4],[.76,2*P_],[1,2*P_]];}
  const C=camAt(1.5,1.12,1.3,2.6,.42,.2);
  const hl=bear?A.legs.filter(l=>!l.front)[0]:null;
  return {S,C,tick:t=>{
   /* person */
   JR(F);const fp=fT.pos(t);F.root2.position.set(fp[0],0,fp[1]);F.root2.rotation.y=lerpK(fH,t);const fsp=fT.spd(t);const famp=cl(fsp/2.5);
   personWalk(F.p,fT.dist(t)/1.15,famp);const fy=pathY(fp[0],fp[1]);JG(F,fy);fade(F,lerpK(fA,t));fSh.position.set(fp[0],fy+.004,fp[1]);fSh.visible=F.root2.visible;fSh.material.opacity=.22*lerpK(fA,t);
   const ap=aT.pos(t),th=lerpK(aH,t);
   if(bear){A.root2.position.set(ap[0],0,ap[1]);A.root2.rotation.y=th;
     const sp=aT.spd(t),turnS=Math.abs(lerpK(aH,Math.min(1,t+.01))-lerpK(aH,Math.max(0,t-.01)))/.02;const amp=cl(sp/2.6+turnS/6);
     const stride=RIG.stride(A,.36,1);const P=RIG.gait(A,{},'walk',aT.dist(t)/stride+.6*seg(t,.26,.33)+.6*seg(t,.68,.76),.36*amp,.9*amp);
     P.root={y:A.H*.012*Math.abs(S2(2*aT.dist(t)/stride))*amp};
     const k=seg(t,.34,.42)*(1-seg(t,.66,.71));
     if(k>0){const top=hl.top,len=hl.len,th2=1.2*k;A.legs.forEach((l,i)=>{if(l.front){P.hip[i]=(P.hip[i]||0)*(1-k)+(.5-th2)*k;P.knee[i]=-.8*k;}else{P.hip[i]=(P.hip[i]||0)*(1-k)+(1.4-th2)*k;P.knee[i]=-.2*k;}});
       P.root={rz:th2,piv:[hl.x,top,0],y:-(top-.25*len)*k};P.hp=-th2*.85;}
     /* waiting: looks around, sighs twice */
     const look=seg(t,.42,.46)*(1-seg(t,.6,.64));P.hy=(P.hy||0)+look*(.55*Math.sin(TAU*(t-.42)/.18*1));
     const sg=bell(t,.47,.55)+bell(t,.56,.63)*.8;P.br=.06*sg;P.hp=(P.hp||0)+.12*sg*k-.18*bell(t,.5,.56)*k;
     /* person back: happy look up */
     const glad=seg(t,.64,.68)*(1-seg(t,.74,.8));P.hp=(P.hp||0)-.15*glad;
     RIG.pose(A,P);if(k>0){const rp=A.root2.localToWorld(new THREE.Vector3(hl.x+.15*A.L,0,0));const s0=A.shadow.position.clone();A.shadow.position.set(s0.x+(rp.x-s0.x)*k,s0.y,s0.z+(rp.z-s0.z)*k);A.shadow.scale.set(A.L*.4,A.W*.6,1);A.shadow.material.opacity=.3;}}
   else{const m=A.m;JR(A);A.root2.position.set(ap[0],0,ap[1]);A.root2.rotation.y=th;
     const sp=aT.spd(t),turnS=Math.abs(lerpK(aH,Math.min(1,t+.01))-lerpK(aH,Math.max(0,t-.01)))/.02;const amp=cl(sp/2.2+turnS/5);const tph=.8*seg(t,.27,.33)+.8*seg(t,.68,.76);const u=(aT.dist(t)/0.55+tph)%1;/* galumph: front flippers push, body rocks */
     const bunch=Math.sin(P_*cl(u/.5))*amp,push=Math.sin(P_*cl((u-.5)/.5))*amp;m.b.rotation.x=-.12*bunch+.1*push;
     m.legs.forEach(l=>l.rotation.x=-.6*push+.4*bunch);m.tail.rotation.x=.25*bunch;
     const lie=seg(t,.31,.37)*(1-seg(t,.67,.71));/* lies down: belly flat, front flippers spread flat, chin down, head turned to the door */
     m.b.position.y-=.025*lie;m.legs.forEach(l=>{l.rotation.z+=Math.sign(l.position.x)*.35*lie;});
     const look=seg(t,.4,.44)*(1-seg(t,.6,.64));const rest=lie*(1-look);
     m.head.rotation.y=-.6*lie+look*.7*Math.sin(TAU*(t-.4)/.2);m.head.rotation.x=.3*rest-.15*look;
     const sg=bell(t,.45,.53)+bell(t,.54,.61)*.8;m.b.scale.set(1+.04*sg,1+.07*sg,1+.02*sg);m.head.rotation.x+=-.12*sg+.2*bell(t,.5,.56)*lie;
     const glad=seg(t,.64,.68)*(1-seg(t,.74,.8));m.head.rotation.x-=.35*glad;m.rear.forEach((r,i)=>r.rotation.y=(i?1:-1)*.4*glad*S2(t*12));
     JG(A,0);sh.position.set(ap[0],.004,ap[1]);sh.rotation.z=th;}
  }};});}

/* ===== helpers: reach with a person's arm (rigid arm turning at the shoulder: forward/up + out to the side) ===== */
const V3=THREE.Vector3;
function reach(R,i,T,hp){const a=R.p.arms[i];R.root2.updateMatrixWorld(true);const Mp=a.parent.matrixWorld.clone();const h=new V3(0,-.5,0).add(new V3(...(hp||[0,0,0])));const M=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),w=new V3();
  let best=[0,0,1e9];for(let x=-3.1;x<=.6;x+=.03)for(let z=-1.1;z<=1.1;z+=.03){e.set(x,0,z);q.setFromEuler(e);M.compose(a.position,q,a.scale);w.copy(h).applyMatrix4(M).applyMatrix4(Mp);const d=w.distanceTo(T);if(d<best[2])best=[x,z,d];}return best;}
function handPt(R,i){const a=R.p.arms[i];R.root2.updateMatrixWorld(true);return a.localToWorld(new V3(0,-.5,0));}
function surfY(obj,x,z){const rc=new THREE.Raycaster(new V3(x,6,z),new V3(0,-1,0));obj.updateMatrixWorld(true);const hit=rc.intersectObject(obj,true).filter(h=>h.object.material&&h.object.material.side!==THREE.BackSide)[0];return hit?hit.point.y:null;}
function surfZ(obj,x,y){const rc=new THREE.Raycaster(new V3(x,y,-4),new V3(0,0,1));obj.updateMatrixWorld(true);const hit=rc.intersectObject(obj,true).filter(h=>h.object.material&&h.object.material.side!==THREE.BackSide)[0];return hit?hit.point.z:-.4;}
function surfX(obj,y,z){const rc=new THREE.Raycaster(new V3(-4,y,z),new V3(1,0,0));obj.updateMatrixWorld(true);const hit=rc.intersectObject(obj,true).filter(h=>h.object.material&&h.object.material.side!==THREE.BackSide)[0];return hit?hit.point.x:-1.2;}
function faceTo(R,x,z){const d=new V3(x-R.root2.position.x,0,z-R.root2.position.z);R.root2.rotation.y=Math.atan2(-d.z,d.x);}
function treatProp(sc){const g=new THREE.Group();PU['vet:treat'].build(g,{});const o=new THREE.Group();o.add(g);g.scale.setScalar(sc);return o;}
function sealMouth(A){return A.m.head.localToWorld(new V3(0,-.07,.19));}

/* ===== 2. vet: big pets on the big exam platform ===== */
function vetBigCell(kind){const bear=kind==='bear';
 return cell(bear?'Bear at the vet':'Seal at the vet',bear?'Dr. Mila listens; Leo gives a treat':'Dr. Mila listens; Leo gives a treat',()=>{
  const S=world({g1:'#e9e4f2',g2:'#ddd6ea',tile:2});const tb=new THREE.Group();PU['vet:bigtable'].build(tb,{});S.add(tb);floorShadow(S,0,0,1.45,.85);
  const TY=.51;let A;if(bear){A=mk('pet:bear',{v:'teddy',age:'adult'},null,null,{rigid:true});A.root2.position.set(-.2,TY,.05);S.add(A.root2);RIG.pose(A,lieP(A,1,{}));}
  else{A=J('pet:seal',{},'makePUPet');A.root2.position.set(.15,0,.02);S.add(A.root2);JR(A);JG(A,TY);}
  const Mi=person('vet:vet',{v:'mila'}),Le=person('vet:vet',{v:'leo'});S.add(Mi.root2);S.add(Le.root2);const mSh=floorShadow(S,0,0,.3,.25),lSh=floorShadow(S,0,0,.3,.25);
  Mi.root2.position.set(bear?-1.64:-.45,0,bear?-.12:-1.02);Le.root2.position.set(1.2,0,-.98);
  /* targets on the pet */
  A.root2.updateMatrixWorld(true);const backX=bear?-.7:-.3,backY=bear?1.25:.95,backZ=surfZ(A.root2,backX,backY);let steth=new V3(backX,backY,backZ-.03);if(bear)steth=new V3(surfX(A.root2,1.2,.2)-.03,1.2,.2);
  const head0=bear?H.headTopW(A):A.m.head.localToWorld(new V3(0,.12,0));const earT=bear?new V3(surfX(A.root2,1.38,.05)-.03,1.38,.05):new V3(backX+.3,backY+.08,surfZ(A.root2,backX+.3,backY+.08)-.03);
  if(bear){faceTo(Mi,0,-.12);Mi.root2.rotation.y-=.6;}else faceTo(Mi,steth.x+.15,0);Mi.root2.rotation.y-=.0;const lean=.12;Mi.p.b.rotation.x=lean;JG(Mi,0);const sSol=reach(Mi,0,steth),eSol=reach(Mi,0,earT);JR(Mi);
  const mouth0=bear?H.mouthW(A,.3):sealMouth(A);faceTo(Le,mouth0.x,mouth0.z);JG(Le,0);const tgt=new V3().lerpVectors(Le.root2.position.clone().setY(1.25),mouth0,.6);const tSol=reach(Le,0,tgt);JR(Le);
  dbg(kind,'steth',sSol[2],'ear',eSol[2],'treat',tSol[2],'backZ',backZ);
  const tr=treatProp(2.2);S.add(tr);
  const C=bear?camAt(-.1,.95,-.2,1.95,.05,.42):camAt(.15,.9,-.25,1.85,.28,.55);
  return {S,C,tick:t=>{
   /* Mila: lean in, stethoscope on the back, then checks the ear, a pat at the end */
   JR(Mi);const ml=seg(t,.04,.12)*(1-seg(t,.46,.54));const ear=seg(t,.3,.36)*(1-seg(t,.44,.5));const pat=seg(t,.74,.8)*(1-seg(t,.9,.97));
   Mi.p.b.rotation.x=lean*Math.max(ml,pat);const circ=ml*(1-ear)*.04*S2(t*6);
   const ax=sSol[0]*(1-ear)+eSol[0]*ear,az=sSol[1]*(1-ear)+eSol[1]*ear;const k=Math.max(ml,pat);Mi.p.arms[0].rotation.x=ax*k+circ+(pat?.06*S2(t*10)*pat:0);Mi.p.arms[0].rotation.z=az*k;
   Mi.p.head.rotation.z=.18*ml*(1-ear);Mi.p.head.rotation.x=(bear?-.05:.15)*k;JG(Mi,0);mSh.position.set(Mi.root2.position.x,.004,Mi.root2.position.z);
   /* Leo: takes a treat out, holds it out, the pet takes it */
   JR(Le);const lr=seg(t,.44,.52)*(1-seg(t,.64,.72));Le.p.arms[0].rotation.x=tSol[0]*lr;Le.p.arms[0].rotation.z=tSol[1]*lr;Le.p.head.rotation.x=.12*lr;Le.p.head.rotation.z=-.1*seg(t,.66,.72)*(1-seg(t,.92,.98));JG(Le,0);lSh.position.set(Le.root2.position.x,.004,Le.root2.position.z);
   /* the pet: a bit nervous (trembles, head low, looks at the vet), then takes the treat and is happy */
   const nerv=seg(t,0,.1)*(1-seg(t,.5,.6));const happy=seg(t,.64,.7)*(1-seg(t,.93,.99));const take=seg(t,.5,.58)*(1-seg(t,.64,.7));const chew=t>.57&&t<.66?Math.max(0,S2((t-.57)*30)):0;
   if(bear){const P=lieP(A,1,{});Object.assign(P.root,{x:.012*S2(t*22)*nerv*(1-take),z:.006*S2(t*17)*nerv});P.hp=-.22*nerv*(1-take)+.1*take-.08*chew-.15*happy*(.5+.5*S2(t*4));P.hy=-(.55+.2*S2(t*3))*nerv*(1-take)-.1*take-.6*happy;
     P.br=.03*S2(t*14)*nerv;if(happy){P.root.ry=.1*S2(t*3)*happy;P.root.rx=.05*S2(t*6)*happy;P.hy+=.35*S2(t*2)*happy;}RIG.pose(A,P);}
   else{const m=A.m;JR(A);A.root2.position.x=.15+.008*S2(t*22)*nerv*(1-take);m.head.rotation.x=.25*nerv*(1-take)-.1*take+.1*chew-.25*happy;m.head.rotation.y=.3*S2(t*3)*nerv*(1-take)*(1-ear)-.6*take;
     m.b.scale.y=1+.03*S2(t*14)*nerv;m.legs.forEach(l=>{l.rotation.z=Math.sign(l.position.x)*(.2*nerv+.0);l.rotation.x=happy?(-.5*Math.max(0,S2(t*8))*happy):0;l.rotation.y=happy?-Math.sign(l.position.x)*.9*Math.max(0,S2(t*8))*happy:0;});
     m.tail.rotation.x=-.25*happy*Math.max(0,S2(t*4));m.rear.forEach((r,i)=>r.rotation.y=(i?1:-1)*.35*happy*S2(t*8));JG(A,TY);}
   /* the treat: appears in Leo's hand, goes to the mouth, eaten */
   const hp=handPt(Le,0);const mo=bear?H.mouthW(A,.3):sealMouth(A);const mv=seg(t,.53,.58);tr.position.set(hp.x+(mo.x-hp.x)*mv,hp.y-.04+(mo.y-hp.y)*mv,hp.z+(mo.z-hp.z)*mv);
   const sc=seg(t,.42,.47)*(1-seg(t,.6,.62));tr.scale.setScalar(Math.max(.001,sc));tr.visible=sc>.01;
  }};});}
window.CLIPS2.vetBig={title:'Vet: bear and seal on the big-pet exam platform',cols:2,cw:340,ch:270,frames:60,cells:[vetBigCell('bear'),vetBigCell('seal')]};

/* ===== 3. the seal's moves on its new flippers (front flippers turn at the shoulder, back flippers on the tail) ===== */
function sealJ(){const A=J('pet:seal',{},'makePUPet');return A;}
function sealGalumph(){return cell('Galumph on land','bunches up, front flippers push, back flippers lift',()=>{const A=sealJ();const st=H.stage(A,{zoom:.75,yaw:.6,cy:.45});const m=A.m;const N=2,D=.62*N;st.fit(D);
  return {S:st.S,C:st.C,tick:t=>{JR(A);const u=(N*t)%1;const bunch=Math.sin(P_*cl(u/.45)),push=Math.sin(P_*cl((u-.45)/.55));
    m.b.rotation.x=.13*bunch-.1*push;m.head.rotation.x=-.12*bunch+.12*push;
    const fl=-.55+1.25*ease(cl((u-.45)/.5))-1.25*ease(cl(u/.45))*0;m.legs.forEach(l=>{l.rotation.x=u<.45?-.55+1.25*(1-ease(u/.45))*0+(-.0):fl;l.rotation.x=u<.45?-.55*ease(u/.45)+.7*(1-ease(u/.45)):-.55+1.25*ease(cl((u-.45)/.5));l.rotation.z=Math.sign(l.position.x)*.1*push;});
    m.tail.rotation.x=.38*bunch-.08*push;m.rear.forEach((r,i)=>{r.rotation.y=(i?1:-1)*(.15+.25*bunch);r.rotation.x=-.2*bunch;});
    const d=.62*(Math.floor(N*t)+ease(cl((u-.4)/.55)));st.setDist(d);JG(A,0);A.shadow.position.set(0,.004,0);A.shadow.scale.set(A.L*.5,A.W*.45,1);A.shadow.material.opacity=.3;}};});}
function sealSwim(){return cell('Swims in its pond','back flippers scull side to side, front flippers steer',()=>{const A=sealJ();const m=A.m;const S=H.scene();
  /* grass with a hole for the pond, a deep blue basin under it, the pond model (its water made see-through so the flippers show) */
  const tex=grassTex('#8fbf6a','#7aad57');tex.repeat.set(30,30);const gr=new THREE.Mesh(new THREE.RingGeometry(2.42,40,48,1),new THREE.MeshLambertMaterial({map:tex}));gr.rotation.x=-P_/2;S.add(gr);
  const bs=new THREE.Mesh(new THREE.SphereGeometry(2.45,32,16,0,TAU,P_/2,P_/2),new THREE.MeshLambertMaterial({color:'#2f6aa8',side:THREE.BackSide}));bs.scale.y=.45;S.add(bs);
  const pd=new THREE.Group();PU['home:pond'].build(pd,PU['home:pond'].dflt||{});S.add(pd);pd.updateMatrixWorld(true);
  pd.traverse(q=>{if(q.isMesh&&q.material.color){const b=new THREE.Box3().setFromObject(q);const w=b.max.x-b.min.x;const hex=q.material.color.getHexString();if(hex==='86d36a'&&w>5)q.visible=false;if(hex==='7fd8ff'&&w>4){q.material=q.material.clone();q.material.opacity=.5;q.material.transparent=true;q.material.depthWrite=false;q.renderOrder=2;}}});
  S.add(A.root2);const R0=.9,cx=.55;const C=camAt(.55,0,0,2.3,.15,.62);
  return {S,C,tick:t=>{JR(A);const a=TAU*t;A.root2.position.set(cx+R0*Math.cos(a),0,R0*Math.sin(a));A.root2.rotation.y=-a-P_/2;/* swims round, counter-clockwise seen from above */
    const sc=S2(4*t);m.tail.rotation.y=.35*sc;m.rear.forEach((r,i)=>{r.rotation.y=.45*sc+(i?1:-1)*.15;r.rotation.z=.4*sc;});
    m.b.rotation.y=-.08*sc;m.b.rotation.z=-.12;m.head.rotation.y=.12*sc+.15;m.head.rotation.x=-.25;
    m.legs.forEach(l=>{const sd=Math.sign(l.position.x);l.rotation.x=.95;l.rotation.z=sd*(.35+.12*Math.max(0,sd*S2(4*t+.25)));});
    A.root2.position.y=-.32+.03*S2(2*t);A.turn.position.y=0;}};});}
function sealBall(){return cell('Ball on its nose, claps','balances the ball, claps its front flippers',()=>{const A=sealJ();const st=H.stage(A,{zoom:.6,yaw:.55,cy:.85,pitch:.12});const m=A.m;const br=.15;const ball=H.prop(st.S,new THREE.SphereGeometry(br,18,12),'#e8483f',0,0,0);
  const st2=H.prop(st.S,new THREE.TorusGeometry(br*1.001,.02,6,24),'#ffffff',0,0,0);
  A.root2.rotation.y=-.15;
  /* solve the front-flipper turns once: open (out to the side, raised) and clapped (paddles meet in front of the chest) */
  const fit=(l,T)=>{const sd=Math.sign(l.position.x),tip=new V3(sd*.2,-.1,.03),e=new THREE.Euler(),v=new V3();let best=[0,0,0,1e9];
    for(let x=-2.4;x<=.4;x+=.08)for(let y=-1.2;y<=1.2;y+=.08)for(let z=-1.6;z<=1.6;z+=.08){e.set(x,y,z);v.copy(tip).applyEuler(e).add(l.position);const d=v.distanceTo(T);if(d<best[3])best=[x,y,z,d];}return best;};
  const sol=m.legs.map(l=>fit(l,new V3(Math.sign(l.position.x)*.035,.24,.36))),sol2=m.legs.map(l=>fit(l,new V3(Math.sign(l.position.x)*.36,.22,.2)));dbg('clap fit',sol[0][3],sol[1][3],sol2[0][3]);
  return {S:st.S,C:st.C,tick:t=>{JR(A);const up=1;const ba=-.5;m.b.rotation.x=ba;m.b.position.set(0,0-(.02*Math.cos(ba)-(-.3)*Math.sin(ba)),-.3-(.02*Math.sin(ba)+(-.3)*Math.cos(ba)));m.b.position.y+=.0;m.head.rotation.x=-.08+.05*S2(2*t);m.head.rotation.z=.08*S2(2*t+.2);
    const clap=Math.max(0,S2(4*t+.25));m.legs.forEach((l,i)=>{const sd=Math.sign(l.position.x),o=sol[i],w=sol2[i];l.rotation.set(w[0]+(o[0]-w[0])*clap,w[1]+(o[1]-w[1])*clap,w[2]+(o[2]-w[2])*clap);});
    m.tail.rotation.x=.5;m.rear.forEach((r,i)=>{r.rotation.y=(i?1:-1)*(.3+.1*clap);r.rotation.x=.05;});
    JG(A,0);A.root2.updateMatrixWorld(true);const hb=new THREE.Box3().setFromObject(m.head);const cxh=(hb.min.x+hb.max.x)/2,czh=(hb.min.z+hb.max.z)/2;
    const hop=Math.pow(Math.max(0,S2(2*t)),2)*.22;ball.position.set(cxh+.03*S2(2*t+.2),hb.max.y+br*.92+hop,czh);ball.rotation.z=TAU*2*t;st2.position.copy(ball.position);st2.rotation.set(P_/2,0,TAU*t);
    {const bb=new THREE.Box3().setFromObject(A.root2);A.shadow.position.set((bb.min.x+bb.max.x)/2,.004,(bb.min.z+bb.max.z)/2);}A.shadow.scale.set(A.L*.38,A.W*.4,1);A.shadow.material.opacity=.3;}};});}
window.CLIPS2.sealNew={title:'Seal on its new flippers: galumph, swim, ball and clap',cols:3,cw:300,ch:250,frames:48,cells:[sealGalumph(),sealSwim(),sealBall()]};

/* ===== 4. Sir Barkley hands over the animal license on the Pet Show podium (podium + card: models missing, plain stand-ins) ===== */
function wrapPerson(p){const g=new THREE.Group();g.add(p.root);const root2=new THREE.Group(),turn=new THREE.Group();turn.rotation.y=P_/2;turn.add(g);root2.add(turn);root2.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(root2);const all=[];g.traverse(q=>all.push([q,q.position.clone(),q.rotation.clone(),q.scale.clone()]));return {m:p,p,g,root2,turn,L:bb.max.x-bb.min.x,H:bb.max.y-bb.min.y,W:bb.max.z-bb.min.z,min0:bb.min.y,all};}
function labelTex(lines,w,h,bg,fg){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,w,h);x.strokeStyle=fg;x.lineWidth=6;x.strokeRect(4,4,w-8,h-8);x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';
  lines.forEach((l,i)=>{x.font=(i?'bold 30px':'bold 40px')+' sans-serif';x.fillText(l,w/2,h*(i+1)/(lines.length+1));});return new THREE.CanvasTexture(c);}
function licenseCell(){return cell('Sir Barkley gives the license','you step up, take the card, hold it up, cheer',()=>{
  const S=world({tile:1.3});
  /* stand-in podium: a plain box with a sign "model missing" */
  const PH=.45;const pod=H.prop(S,new THREE.BoxGeometry(1.7,PH,1.0),'#c9c2d6',0,PH/2,0);const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.36),new THREE.MeshBasicMaterial({map:labelTex(['PET SHOW PODIUM','model missing (stand-in)'],600,144,'#fff6d6','#c0392b')}));sg.position.set(0,PH/2,.502);S.add(sg);
  floorShadow(S,0,0,1.0,.62);
  /* stand-in license card: a flat card, marked */
  const card=new THREE.Mesh(new THREE.BoxGeometry(.3,.2,.012),[0,0,0,0,0,0].map((_,i)=>new THREE.MeshLambertMaterial(i===4?{map:labelTex(['LICENSE','model missing'],300,200,'#fff3b0','#c0392b')}:{color:'#e8c84a'})));S.add(card);
  const B=wrapPerson(makePerson({skin:'#d9a06b',hair:'#1f1a2e',style:'short',top:'#3d4a7a',bottom:'#2e2347',shoes:'#2e2347',hat:'tophat',glasses:'glasses'}));S.add(B.root2);const bSh=floorShadow(S,0,0,.3,.24);
  const Pl=person('farm:farmer',{who:'a'});S.add(Pl.root2);const pSh=floorShadow(S,0,0,.3,.24);
  const D=J('pet:dogjoint',{age:'adult',v:'stand'},'dogJoint');S.add(D.root2);const dSh=floorShadow(S,0,0,.38,.22);const dm=D.m;
  B.root2.position.set(1.03,0,.2);B.root2.rotation.y=P_+.4;
  const pT=track([[0,-5.6,.15],[.18,-1.3,.15],[.2,-1.3,.15],[.27,-.05,.15],[.84,-.05,.15],[.9,-1.35,.15],[.995,-5.6,.15],[1,-5.6,.15]]);
  const pH=[[0,0],[.27,0],[.32,-.35],[.82,-.35],[.86,P_],[1,P_]];
  const pY=t=>PH*seg(t,.2,.27)*(1-seg(t,.84,.9))+jumpA(t,.2,.27,.18)+jumpA(t,.84,.9,.14)+jumpA(t,.66,.73,.22)+jumpA(t,.74,.81,.22);
  function jumpA(t,a,b,h){const u=cl((t-a)/(b-a));return u>0&&u<1?4*h*u*(1-u):0;}
  const dT=track([[0,-6.4,.75],[.24,-1.35,.75],[.86,-1.35,.75],[.995,-6.4,.75],[1,-6.4,.75]]);const dHk=[[0,0],[.24,0],[.3,-.6],[.86,-.6],[.9,P_],[1,P_]];
  /* reach targets: Barkley holds the card out over the podium edge; the player takes it */
  const give=new V3(.48,1.32,.22);JR(B);const bSol=reach(B,1,give);
  Pl.root2.position.set(-.05,0,.15);Pl.root2.rotation.y=-.35;JR(Pl);JG(Pl,PH);const pSol=reach(Pl,0,new V3(.46,1.32,.22));const upSol=[-.35,-2.35];JR(Pl);
  dbg('license reach',bSol[2],pSol[2]);
  const C=camAt(-.2,1.0,0,1.85,.15,.24);
  return {S,C,tick:t=>{
   /* Barkley: takes the card out, holds it out, lets go, claps */
   JR(B);const hold=seg(t,.12,.2);const out=seg(t,.3,.4)*(1-seg(t,.5,.58));const clap=t>.62&&t<.84?Math.max(0,S2((t-.62)*14)):0;
   B.p.arms[1].rotation.x=bSol[0]*out-.5*hold*(1-out)*(1-seg(t,.48,.52))-.9*seg(t,.6,.64)*(1-seg(t,.84,.9))+.15*clap;B.p.arms[1].rotation.z=bSol[1]*out;
   B.p.arms[0].rotation.x=-.9*seg(t,.6,.64)*(1-seg(t,.84,.9))+.15*clap;B.p.arms[0].rotation.z=.25*seg(t,.6,.64)*(1-seg(t,.84,.9));B.p.arms[1].rotation.z+=-.25*seg(t,.6,.64)*(1-seg(t,.84,.9));
   B.p.head.rotation.x=.08*S2(t*2);B.p.head.rotation.y=-.15*seg(t,.3,.4);B.p.b.rotation.x=.06*out;JG(B,0);bSh.position.set(B.root2.position.x,.004,B.root2.position.z);
   /* player */
   JR(Pl);const pp=pT.pos(t);Pl.root2.position.set(pp[0],0,pp[1]);Pl.root2.rotation.y=lerpK(pH,t);const amp=cl(pT.spd(t)/2.5);personWalk(Pl.p,pT.dist(t)/1.15,amp);
   const take=seg(t,.38,.46)*(1-seg(t,.5,.56)),raise=seg(t,.52,.6)*(1-seg(t,.84,.9)),cheer=seg(t,.62,.66)*(1-seg(t,.82,.86));
   Pl.p.arms[0].rotation.x=pSol[0]*take+upSol[0]*raise+(raise?.12*S2(t*10)*raise:0);Pl.p.arms[0].rotation.z=pSol[1]*take+upSol[1]*raise;
   Pl.p.arms[1].rotation.x=-.35*cheer;Pl.p.arms[1].rotation.z=2.35*cheer+.2*S2(t*10)*cheer;Pl.p.head.rotation.x=-.15*raise;
   const yy=pY(t);JG(Pl,0);Pl.turn.position.y+=yy;pSh.position.set(pp[0],(Math.abs(pp[0])<.85?PH:0)+.004,pp[1]);pSh.scale.set(.3/(1+yy*1.5),.24/(1+yy*1.5),1);
   /* the card: appears in Barkley's hand, goes to the player's hand, held up high, leaves with the player */
   const hb=handPt(B,1),hp=handPt(Pl,0);const toP=seg(t,.46,.5);const c=new V3().lerpVectors(hb,hp,toP);card.position.set(c.x,c.y-.08+.12*raise*(1-seg(t,.84,.9)),c.z+.04);card.rotation.set(0,-.2,0);
   card.scale.setScalar(Math.max(.001,hold));card.visible=hold>.01;
   /* the dog: trots behind, sits by the podium, hops for joy, trots after the player */
   JR(D);const dp=dT.pos(t);D.root2.position.set(dp[0],0,dp[1]);D.root2.rotation.y=lerpK(dHk,t);const da=cl(dT.spd(t)/2.2);const ph=TAU*dT.dist(t)/.5;
   [0,3].forEach(i=>{dm.legs[i].rotation.x=.5*da*Math.sin(ph);dm.lower[i].rotation.x=(i<2?-.5:.6)*da*Math.max(0,Math.sin(ph));});[1,2].forEach(i=>{dm.legs[i].rotation.x=-.5*da*Math.sin(ph);dm.lower[i].rotation.x=(i<2?-.5:.6)*da*Math.max(0,-Math.sin(ph));});
   const sit=seg(t,.32,.38)*(1-seg(t,.62,.66))+seg(t,.8,.83)*(1-seg(t,.86,.9));
   if(sit>0){dm.b.rotation.x=-.36*sit;dm.legs[0].rotation.x=dm.legs[1].rotation.x=.36*sit;dm.legs[2].rotation.x=dm.legs[3].rotation.x=1.25*sit;dm.lower[2].rotation.x=dm.lower[3].rotation.x=-2.1*sit;dm.neck.rotation.x=.25*sit-.2*sit*bell(t,.4,.5);dm.tail.rotation.x=.9*sit;}
   let hop=0;for(const [a,b] of [[.66,.72],[.73,.79]]){const u=cl((t-a)/(b-a));if(u>0&&u<1){hop=jumpA(t,a,b,.35);dm.legs.forEach((l,i)=>{l.rotation.x=(i<2?-.5:.6)*Math.sin(P_*u);});dm.lower.forEach((l,i)=>{l.rotation.x=(i<2?.4:-.6)*Math.sin(P_*u);});}}
   dm.tail.rotation.z=.6*S2(t*12);if(dm.ears)dm.ears.forEach(e=>e.rotation.x=-.3*bell(t,.66,.79));
   JG(D,0);D.turn.position.y+=hop;dSh.position.set(dp[0],.004,dp[1]);dSh.scale.set(.38/(1+hop*2),.22/(1+hop*2),1);
  }};});}
window.CLIPS2.license={title:'Pet Show: Sir Barkley gives you the animal license',cols:1,cw:520,ch:340,frames:48,cells:[licenseCell()]};

window.CLIPS2.waitOutside={title:'Wait outside: big pets wait by the door and join you again',cols:2,cw:340,ch:270,frames:72,cells:[waitCell('bear'),waitCell('seal')]};
})();
