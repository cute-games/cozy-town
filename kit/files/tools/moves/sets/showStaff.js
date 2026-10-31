/* showStaff (31 Oct): Pet Show license hand-over with the REAL podium, stage, card and area layout; riding instructors Ieva (stable) and Stan (jump field) */
(()=>{const H=window.MVH;const {cell,cl,ease,seg,bell,S2,C2,P_,TAU,floorShadow,grassTex,dbg}=H;const V3=THREE.Vector3;
/* ---- scene + camera ---- */
function world(cx,cz,o){o=o||{};const S=H.scene(o.bg);const tex=grassTex(o.g1||'#8fbf6a',o.g2||'#7aad57');const sz=160,tile=o.tile||1.3;tex.repeat.set(sz/tile,sz/tile);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(sz,sz),new THREE.MeshLambertMaterial({map:tex}));g.rotation.x=-P_/2;g.position.set(cx,-.012,cz);S.add(g);return S;}
function camLook(p,t,fov){const C=new THREE.PerspectiveCamera(fov||32,1,.25,400);C.position.set(...p);C.lookAt(...t);C.updateProjectionMatrix();return C;}
/* ---- a PU model kept as its own groups (rigid pieces turning at joints) ---- */
function J(id,opt,cap){let got=null,orig=null;if(cap){orig=window[cap];window[cap]=function(...a){const r=orig.apply(this,a);if(!got)got=r;return r;};}
  const g=new THREE.Group();try{PU[id].build(g,Object.assign({},PU[id].dflt,opt||{}));}finally{if(cap)window[cap]=orig;}
  return wrapG(g,got);}
function wrapG(g,m){const root2=new THREE.Group(),turn=new THREE.Group();turn.rotation.y=P_/2;turn.add(g);root2.add(turn);root2.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(root2);const all=[];g.traverse(q=>all.push([q,q.position.clone(),q.rotation.clone(),q.scale.clone()]));
  return {m,p:m,g,root2,turn,L:bb.max.x-bb.min.x,H:bb.max.y-bb.min.y,W:bb.max.z-bb.min.z,min0:bb.min.y,all};}
function wrapPerson(p){const g=new THREE.Group();g.add(p.root);return wrapG(g,p);}
function JR(R){R.all.forEach(([q,p,r,s])=>{q.position.copy(p);q.rotation.copy(r);q.scale.copy(s);});R.turn.position.y=0;}
function JG(R,fy){R.turn.position.y=0;R.root2.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(R.turn);R.turn.position.y=(R.root2.position.y+(fy||0)+R.min0)-bb.min.y;R.root2.updateMatrixWorld(true);}
function fade(R,a){if(!R._fm){R._fm=[];R.root2.traverse(q=>{if(q.isMesh){q.material=q.material.clone();q.material.transparent=true;R._fm.push([q.material,q.material.opacity]);}});}R._fm.forEach(([m,o])=>{m.opacity=o*a;m.depthWrite=a>.98;});R.root2.visible=a>.02;}
function lerpK(keys,t){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(t<=b[0]){const u=ease((t-a[0])/((b[0]-a[0])||1));return a[1]+(b[1]-a[1])*u;}}return keys[keys.length-1][1];}
/* heading th: model faces (cos th, 0, -sin th) */
const headTo=(dx,dz)=>Math.atan2(-dz,dx);
/* a path of segments: walk (feet on a floor y), hopUp / hopDown (vertical first or last so feet clear the step edge). Walking phase from distance walked. */
function path(segs){const pos=t=>{let s=segs[0];if(t<=s.t0)return [...s.a];for(const q of segs){if(t<=q.t1){s=q;break;}s=q;}
    if(t>=s.t1)return [...s.b];if(t<s.t0)return [...s.a];const u=(t-s.t0)/(s.t1-s.t0);const A=s.a,B=s.b;
    if(s.k==='walk'){const e=ease(u);return [A[0]+(B[0]-A[0])*e,A[1]+(B[1]-A[1])*e,A[2]+(B[2]-A[2])*e];}
    if(s.k==='up'){const h=seg(u,.38,1),v=seg(u,0,.55);return [A[0]+(B[0]-A[0])*h,A[1]+(B[1]-A[1])*h,A[2]+(B[2]-A[2])*v+(s.bump||.12)*Math.sin(P_*u)];}
    const h=seg(u,0,.6),v=seg(u,.45,1);return [A[0]+(B[0]-A[0])*h,A[1]+(B[1]-A[1])*h,A[2]+(B[2]-A[2])*v+(s.bump||.1)*Math.sin(P_*u)];};
  const N=1440,cum=[0];for(let k=1;k<=N;k++){const t=k/N,p=pos((k-1)/N),q=pos(t);const s=segs.find(z=>t>z.t0&&t<=z.t1);cum[k]=cum[k-1]+(s&&s.k==='walk'?Math.hypot(q[0]-p[0],q[1]-p[1]):0);}
  const dist=t=>{const f=cl(t)*N,i=Math.min(N-1,Math.floor(f));return cum[i]+(cum[i+1]-cum[i])*(f-i);};
  const spd=t=>(dist(Math.min(1,t+.01))-dist(Math.max(0,t-.01)))/.02;const hopU=t=>{const s=segs.find(z=>t>z.t0&&t<z.t1&&z.k!=='walk');return s?Math.sin(P_*(t-s.t0)/(s.t1-s.t0)):0;};
  return {pos,dist,spd,hopU};}
/* ---- people (makePerson groups): legs from the hips, arms from the shoulders; no elbows ---- */
function personWalk(p,ph,amp){const a=.42*amp*S2(ph);p.legs[0].rotation.x=-a;p.legs[1].rotation.x=a;p.arms[0].rotation.x=a*.8;p.arms[1].rotation.x=-a*.8;}
function person(id,opt){return J(id,opt,'makePerson');}
const HP=new V3(0,-.5,0);
function handPt(R,i){const a=R.p.arms[i];R.root2.updateMatrixWorld(true);return a.localToWorld(HP.clone());}
function shoulderPt(R,i){const a=R.p.arms[i];R.root2.updateMatrixWorld(true);return a.localToWorld(new V3());}
/* arm angles (rotation x, z) that bring the hand to T (body pose must be set first) */
function reach(R,i,T,wide){const a=R.p.arms[i];const rx=a.rotation.x,rz=a.rotation.z;R.root2.updateMatrixWorld(true);const Mp=a.parent.matrixWorld.clone();const M=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),w=new V3();
  const X0=wide?-3.3:-3.1,X1=wide?1.6:.6,Z=wide?2.6:1.2;let best=[0,0,1e9];const f=(x,z)=>{e.set(x,0,z);q.setFromEuler(e);M.compose(a.position,q,a.scale);w.copy(HP).applyMatrix4(M).applyMatrix4(Mp);return w.distanceTo(T);};
  for(let x=X0;x<=X1;x+=.04)for(let z=-Z;z<=Z;z+=.04){const d=f(x,z);if(d<best[2])best=[x,z,d];}
  const [bx,bz]=best;for(let x=bx-.04;x<=bx+.04;x+=.008)for(let z=bz-.04;z<=bz+.04;z+=.008){const d=f(x,z);if(d<best[2])best=[x,z,d];}
  a.rotation.x=rx;a.rotation.z=rz;return best;}
function setArm(R,i,s,k,base){const a=R.p.arms[i];const b=base||[a.rotation.x,a.rotation.z];a.rotation.x=b[0]+(s[0]-b[0])*k;a.rotation.z=b[1]+(s[1]-b[1])*k;}
function rayZ(obj,x,y,fromZ,dir){const rc=new THREE.Raycaster(new V3(x,y,fromZ),new V3(0,0,dir));obj.updateMatrixWorld(true);const h=rc.intersectObject(obj,true).filter(h=>h.object.material&&h.object.material.side!==THREE.BackSide)[0];return h?h.point.z:null;}
/* ---- the license card (real model show:license): the hand grips its lower edge; it is placed AT the holder's hand every frame ---- */
const holdT=(R,i,C)=>{const s=shoulderPt(R,i),o=shoulderPt(R,i).sub(shoulderPt(R,1-i));o.y=0;o.setLength(.14);const f=new V3(C.position.x-s.x,0,C.position.z-s.z).setLength(.34);return s.clone().add(f.add(o).add(new V3(0,-.2,0)).setLength(handPt(R,i).distanceTo(s)*.99));};
function mkCard(S){const g=new THREE.Group();const inner=new THREE.Group();PU['show:license'].build(inner,{lv:'1'});inner.position.y=-.035;g.add(inner);S.add(g);return g;}
function cardAt(card,R,i,C,s){const p=handPt(R,i);card.position.copy(p);card.rotation.set(-.12,Math.atan2(C.position.x-p.x,C.position.z-p.z),0);/* held by its corner: the hand sits on the lower corner, in front of the card */const sh=shoulderPt(R,i),sd=Math.sign(new V3().subVectors(p,sh).applyQuaternion(card.quaternion.clone().invert()).x)||1;card.translateX(sd*.14);card.translateY(-.03);card.translateZ(-.035);card.scale.setScalar(Math.max(.001,s));card.visible=s>.01;}
/* ---- the dog (jointed, as in the approved license cell): sit / stand / hop ---- */
function dogPose(D,t,sit,hop,lookY){const dm=D.m;
  if(sit>0){dm.b.rotation.x=-.36*sit;dm.legs[0].rotation.x=dm.legs[1].rotation.x=.36*sit;dm.legs[2].rotation.x=dm.legs[3].rotation.x=1.25*sit;dm.lower[2].rotation.x=dm.lower[3].rotation.x=-2.1*sit;dm.neck.rotation.x=.25*sit;dm.tail.rotation.x=.9*sit;}
  if(hop>0){dm.legs.forEach((l,i)=>{l.rotation.x=(i<2?-.5:.6)*hop;});dm.lower.forEach((l,i)=>{l.rotation.x=(i<2?.4:-.6)*hop;});}
  dm.neck.rotation.y=lookY||0;dm.tail.rotation.z=.6*S2(t*12);if(dm.ears)dm.ears.forEach(e=>e.rotation.x=-.3*hop);}
const BLOOK={skin:'#d9a06b',hair:'#1f1a2e',style:'short',top:'#3d4a7a',bottom:'#2e2347',shoes:'#2e2347',hat:'tophat',glasses:'glasses'};
function barkley(){return wrapPerson(makePerson(BLOOK));}

/* ===== 1. License on the podium (real show:area layout: stage at -36.5,22, podium beside it at -36.0,16.9, both facing the fountain = +x).
   You hop up onto the 1st step; Sir Barkley comes down from the stage and hops up onto the 2nd step beside you, so the two hands meet over the step edge ===== */
const STEP1=.98,STEP2=.68,BOX=.18;
function podiumCell(){return cell('License on the podium','real podium, stage + card; you = stand-in farmer',()=>{
  const S=world(-30,20);const A=new THREE.Group();PU['show:area'].build(A,{people:'no'});S.add(A);
  const C=camLook([-29.0,3.0,15.4],[-35.4,1.2,17.9],34);
  const card=mkCard(S);
  /* the player */
  const Pl=person('farm:farmer',{who:'a'});S.add(Pl.root2);const pSh=floorShadow(S,0,0,.3,.24);
  const PX=-35.85,PZ=17.12,BXp=-35.13,thP=headTo(.6,.8),thB=headTo(.6,-.8);
  const pP=path([{t0:0,t1:.08,k:'walk',a:[-34.05,16.9,0],b:[-34.74,16.9,0]},{t0:.085,t1:.13,k:'up',a:[-34.74,16.9,0],b:[BXp,16.9,BOX],bump:.08},{t0:.14,t1:.22,k:'up',a:[BXp,16.9,BOX],b:[PX,PZ,STEP1],bump:.14},
    {t0:.82,t1:.86,k:'down',a:[PX,PZ,STEP1],b:[BXp,16.9,BOX],bump:.1},{t0:.865,t1:.89,k:'down',a:[BXp,16.9,BOX],b:[-34.74,16.9,0],bump:.06},{t0:.895,t1:.93,k:'walk',a:[-34.74,16.9,0],b:[-34.05,16.9,0]}]);
  const pH=[[0,P_],[.22,P_],[.29,thP+TAU],[.78,thP+TAU],[.82,TAU],[.93,TAU],[.985,3*P_],[1,3*P_]];
  /* Sir Barkley: from the stage, down its steps, along the front, hops up onto the 2nd step */
  const B=barkley();S.add(B.root2);const bSh=floorShadow(S,0,0,.3,.24);
  const BZ=20.5,stair=x=>.56*cl((-35.08-x)/.66),QX=-35.86,QZ=17.86;
  const bP=path([{t0:0,t1:.08,k:'walk',a:[-35.78,BZ,0],b:[-34.85,BZ,0]},{t0:.085,t1:.27,k:'walk',a:[-34.85,BZ,0],b:[-34.82,18.05,0]},{t0:.285,t1:.36,k:'up',a:[-34.82,18.05,0],b:[QX,QZ,STEP2],bump:.14},
    {t0:.665,t1:.715,k:'down',a:[QX,QZ,STEP2],b:[-34.82,18.05,0],bump:.1},{t0:.72,t1:.85,k:'walk',a:[-34.82,18.05,0],b:[-34.85,BZ,0]},{t0:.855,t1:.92,k:'walk',a:[-34.85,BZ,0],b:[-35.78,BZ,0]}]);
  const bH=[[0,0],[.07,0],[.1,-P_/2+TAU],[.27,-P_/2+TAU],[.285,P_],[.36,P_],[.41,thB],[.62,thB],[.66,0],[.715,0],[.72,-P_/2],[.85,-P_/2],[.86,-P_],[.92,-P_],[.985,-TAU],[1,-TAU]];
  /* the dog: sits by the 3rd step, watches, hops when you cheer */
  const DX=-34.6,DZ=15.45;const D=J('pet:dogjoint',{age:'adult',v:'stand'},'dogJoint');S.add(D.root2);const dSh=floorShadow(S,DX,DZ,.36,.22);D.root2.position.set(DX,0,DZ);D.root2.rotation.y=headTo(.75,.65);
  /* hand-over: both on their steps, solve both arms to one point between their shoulders */
  JR(Pl);Pl.root2.position.set(PX,0,PZ);Pl.root2.rotation.y=thP;JG(Pl,0);Pl.turn.position.y+=STEP1;JR(B);B.root2.position.set(QX,0,QZ);B.root2.rotation.y=thB;JG(B,0);B.turn.position.y+=STEP2;
  const near=(R,O)=>shoulderPt(R,0).distanceTo(shoulderPt(O,0))+shoulderPt(R,0).distanceTo(shoulderPt(O,1))<shoulderPt(R,1).distanceTo(shoulderPt(O,0))+shoulderPt(R,1).distanceTo(shoulderPt(O,1))?0:1;
  const pi=near(Pl,B),bi=near(B,Pl);const sp=shoulderPt(Pl,pi),sb=shoulderPt(B,bi);const T=new V3();{const M=new V3().lerpVectors(sp,sb,.5),lp=handPt(Pl,pi).distanceTo(sp)*.98,lb=handPt(B,bi).distanceTo(sb)*.98,q=new V3();let best=1e9;
    for(let f=0;f<=.6;f+=.01)for(let dy=-.4;dy<=.4;dy+=.01){q.set(M.x+f,M.y+dy,M.z);const sc=Math.abs(q.distanceTo(sp)-lp)+Math.abs(q.distanceTo(sb)-lb)+.05*Math.abs(f-.28);if(sc<best){best=sc;T.copy(q);}}}
  const pSol=reach(Pl,pi,T,true),bSol=reach(B,bi,T,true);
  const upSol=reach(Pl,pi,holdT(Pl,pi,C),true);
  const bHold=(()=>{const s=shoulderPt(B,bi);const f=new V3(Math.cos(thB),0,-Math.sin(thB));return reach(B,bi,s.clone().add(f.multiplyScalar(.32)).add(new V3(0,-.3,0)));})();
  dbg('sp',sp.x,sp.y,sp.z,'sb',sb.x,sb.y,sb.z,'handB',handPt(B,bi).distanceTo(sb),'handP',handPt(Pl,pi).distanceTo(sp));dbg('Tdist',T.distanceTo(sp),T.distanceTo(sb),'bRest',B.p.arms[bi].rotation.x,B.p.arms[bi].rotation.y,B.p.arms[bi].rotation.z,B.p.arms[bi].rotation.order);dbg('podium: arms',pi,bi,'handover err',pSol[2],bSol[2],'up err',upSol[2],'hold',bHold[2],'T',T.x,T.y,T.z);
  const po=1-pi;
  return {S,C,tick:t=>{
   /* --- player --- */
   JR(Pl);const pp=pP.pos(t);Pl.root2.position.set(pp[0],0,pp[1]);Pl.root2.rotation.y=lerpK(pH,t);personWalk(Pl.p,pP.dist(t)/1.1,cl(pP.spd(t)/2));
   const hu=pP.hopU(t);if(hu>0){Pl.p.legs[0].rotation.x=-.55*hu;Pl.p.legs[1].rotation.x=.2*hu;Pl.p.arms[0].rotation.x=Pl.p.arms[1].rotation.x=-.5*hu;}
   const take=seg(t,.42,.47),raise=seg(t,.5,.57)*(1-seg(t,.75,.8)),cheer=seg(t,.56,.6)*(1-seg(t,.74,.78));
   const tk=take*(1-seg(t,.5,.55));const rest=[Pl.p.arms[pi].rotation.x,Pl.p.arms[pi].rotation.z];
   {const ws=tk+raise,n=Math.max(1,ws),b=Math.max(0,1-ws);Pl.p.arms[pi].rotation.x=rest[0]*b+(pSol[0]*tk+upSol[0]*raise)/n+.1*S2(t*8)*cheer;Pl.p.arms[pi].rotation.z=rest[1]*b+(pSol[1]*tk+upSol[1]*raise)/n;}
   const sd=po===1?1:-1;Pl.p.arms[po].rotation.x+=-.3*cheer;Pl.p.arms[po].rotation.z+=sd*(2.4+.25*S2(t*8))*cheer;Pl.p.head.rotation.x=-.12*raise;
   const bounce=.07*cheer*Math.abs(S2(t*4));JG(Pl,0);Pl.turn.position.y+=pp[2]+bounce;
   const fl=(pp[0]<-35.4&&pp[0]>-36.6)?STEP1:((pp[0]<-35.04&&pp[0]>-35.4)?BOX:0);pSh.position.set(pp[0],Math.min(pp[2],fl)+.006,pp[1]);
   /* --- Sir Barkley --- */
   JR(B);const bp=bP.pos(t);let by=bp[2];if(Math.abs(bp[1]-BZ)<.3)by=Math.max(by,stair(bp[0]));B.root2.position.set(bp[0],0,bp[1]);B.root2.rotation.y=lerpK(bH,t);personWalk(B.p,bP.dist(t)/1.1,cl(bP.spd(t)/2));
   const bu=bP.hopU(t);if(bu>0){B.p.legs[0].rotation.x=-.5*bu;B.p.legs[1].rotation.x=.2*bu;B.p.arms[0].rotation.x=B.p.arms[1].rotation.x=-.4*bu;}
   const hold=seg(t,.38,.42)*(1-seg(t,.47,.5)),out=seg(t,.41,.46)*(1-seg(t,.48,.53));const clap=seg(t,.53,.56)*(1-seg(t,.61,.64));
   const brest=[B.p.arms[bi].rotation.x,B.p.arms[bi].rotation.z];if(hold>0||out>0){setArm(B,bi,bHold,hold,brest);if(out>0)setArm(B,bi,bSol,out,[B.p.arms[bi].rotation.x,B.p.arms[bi].rotation.z]);}
   if(clap>0){const c=Math.max(0,S2((t-.53)*14));B.p.arms[0].rotation.x=-1.0*clap;B.p.arms[1].rotation.x=-1.0*clap;B.p.arms[0].rotation.z=(.18+.12*c)*clap;B.p.arms[1].rotation.z=-(.18+.12*c)*clap;}
   B.p.head.rotation.x=-.06*out+.06*clap;JG(B,0);B.turn.position.y+=by;
   const bfl=Math.abs(bp[1]-BZ)<.3?stair(bp[0]):((bp[0]<-35.4&&bp[0]>-36.6&&bp[1]>17.57)?STEP2:0);bSh.position.set(bp[0],Math.min(by,bfl)+.006,bp[1]);
   /* --- the card: in Barkley's hand, then in the player's hand (placed at the hand every frame) --- */
   if(t<.47){cardAt(card,B,bi,C,seg(t,.38,.42));}else if(t<.8){cardAt(card,Pl,pi,C,1-seg(t,.76,.8));}else card.visible=false;
   /* --- dog --- */
   JR(D);let hop=0,hu2=0;for(const [a,b] of[[.6,.66],[.67,.73]]){const u=cl((t-a)/(b-a));if(u>0&&u<1){hop=.3*Math.sin(P_*u);hu2=Math.sin(P_*u);}}
   const sit=1-seg(t,.56,.6)*(1-seg(t,.74,.79));dogPose(D,t,sit,hu2,.45*seg(t,.2,.3)*(1-seg(t,.9,.98)));JG(D,0);D.turn.position.y+=hop;dSh.scale.set(.36/(1+hop*2),.22/(1+hop*2),1);
  }};});}

/* ===== 2. Pet Show area, wide, from the audience side ===== */
function areaCell(){return cell('Pet Show area','stage, podium, judges; winner + 2nd, 3rd pets',()=>{
  const S=world(-30,21);const A=new THREE.Group();PU['show:area'].build(A,{people:'no'});S.add(A);
  const C=camLook([-23.0,8.4,19.9],[-34.6,.4,20.7],42);
  const card=mkCard(S);
  const Pl=person('farm:farmer',{who:'a'});S.add(Pl.root2);floorShadow(S,-35.95,16.9,.3,.24).position.y=STEP1+.006;
  const B=barkley();S.add(B.root2);floorShadow(S,-35.9,22,.3,.24).position.y=.566;
  const D=J('pet:dogjoint',{age:'adult',v:'stand'},'dogJoint');S.add(D.root2);D.root2.position.set(-35.0,0,14.35);D.root2.rotation.y=.25;const dSh=floorShadow(S,-35.0,14.35,.36,.22);
  const pets=[['age:cat',-36.0,18.2,.68],['age:bunny',-36.0,15.6,.46]].map(([id,x,z,y])=>{const R=J(id,{age:'adult'});R.root2.position.set(x,y,z);S.add(R.root2);floorShadow(S,x,z,.24,.16).position.y=y+.006;return [R,y];});
  /* judges at the table (same spots as the area model), audience round the lawn (their backs to us) */
  const JX=-33.8,JZ=27.3,JA=Math.atan2(-36.0-JX,22-JZ);const crowd=[];
  for(const k of[-1,0,1]){const x=JX+k*Math.cos(JA)-.85*Math.sin(JA),z=JZ-k*Math.sin(JA)-.85*Math.cos(JA);const R=wrapPerson(makePerson(Object.assign({},DEFAULT_LOOK,{top:'#ffd45c'})));R.root2.position.set(x,0,z);R.root2.rotation.y=JA-P_/2;S.add(R.root2);crowd.push([R,'clap',k]);}
  [['#7cc8ff','#e0b060'],['#ff7aa8','#3d2c2a'],['#5fd4b0','#8d6238'],['#c9373f','#1f1a26']].forEach(([top,hair],i)=>{const [x,z]=[[-29.6,18.6],[-29.2,21.0],[-29.4,23.6],[-30.2,26.0]][i];const R=wrapPerson(makePerson(Object.assign({},DEFAULT_LOOK,{top,hair})));R.root2.position.set(x,0,z);R.root2.rotation.y=P_;S.add(R.root2);floorShadow(S,x,z,.3,.24);crowd.push([R,'cheer',i]);});
  JR(Pl);Pl.root2.position.set(-35.95,0,16.9);Pl.root2.rotation.y=0;JG(Pl,0);Pl.turn.position.y+=STEP1;const upSol=reach(Pl,0,holdT(Pl,0,C),true);dbg('area up err',upSol[2]);
  return {S,C,tick:t=>{
   JR(Pl);Pl.root2.position.set(-35.95,0,16.9);Pl.root2.rotation.y=0;Pl.p.arms[0].rotation.x=upSol[0]+.1*S2(t*4);Pl.p.arms[0].rotation.z=upSol[1];
   const ch=Math.max(0,S2(t*2));Pl.p.arms[1].rotation.x=-.3*ch;Pl.p.arms[1].rotation.z=(2.4+.25*S2(t*8))*ch;Pl.p.head.rotation.x=-.12;
   JG(Pl,0);Pl.turn.position.y+=STEP1+.08*Math.abs(S2(t*4))*ch;cardAt(card,Pl,0,C,1);
   JR(B);B.root2.position.set(-35.9,0,22);B.root2.rotation.y=-.12;const c=Math.max(0,S2(t*10));B.p.arms[0].rotation.x=B.p.arms[1].rotation.x=-1.0;B.p.arms[0].rotation.z=.18+.12*c;B.p.arms[1].rotation.z=-(.18+.12*c);B.p.head.rotation.y=-.35;JG(B,0);B.turn.position.y+=.56;
   JR(D);let hop=0,hu=0;for(const [a,b] of[[.1,.18],[.6,.68]]){const u=cl((t-a)/(b-a));if(u>0&&u<1){hop=.3*Math.sin(P_*u);hu=Math.sin(P_*u);}}dogPose(D,t,0,hu,0);JG(D,0);D.turn.position.y+=hop;dSh.scale.set(.36/(1+hop*2),.22/(1+hop*2),1);
   pets.forEach(([R,y],i)=>{const u=cl(((t+(i?.5:0))%1-.3)/.12);const h=u>0&&u<1?.14*Math.sin(P_*u):0;R.root2.position.y=y+h;});
   crowd.forEach(([R,kind,k])=>{JR(R);if(kind==='clap'){const c2=Math.max(0,S2(t*10+k*.3));R.p.arms[0].rotation.x=R.p.arms[1].rotation.x=-1.0;R.p.arms[0].rotation.z=.18+.12*c2;R.p.arms[1].rotation.z=-(.18+.12*c2);}
     else{const w=Math.max(0,S2(t*2+k*.25));R.p.arms[0].rotation.z=-(2.3+.25*S2(t*8+k))*w;R.p.arms[1].rotation.z=(2.3+.25*S2(t*8+k+1))*w;}JG(R,0);});
  }};});}

/* ===== stable yard: Ieva grooms a horse in front of the stable ===== */
const HZ=4.55;
function brushMk(S){const g=new THREE.Group();const m=c=>new THREE.MeshLambertMaterial({color:c});
  const b=new THREE.Mesh(new THREE.BoxGeometry(.26,.12,.05),m('#c98f5e'));b.position.z=-.01;g.add(b);const br=new THREE.Mesh(new THREE.BoxGeometry(.24,.1,.05),m('#3a2a22'));br.position.z=-.055;g.add(br);S.add(g);return g;}
function yard(){const S=world(0,4);const st=new THREE.Group();PU['farm:stable'].build(st,PU['farm:stable'].dflt||{});S.add(st);
  const Hr=J('farm:horse',{},'farmAnimal');Hr.root2.position.set(0,0,HZ);S.add(Hr.root2);floorShadow(S,.25,HZ,1.35,.42);solveGroom(Hr);return {S,Hr};}
/* the brushing: Ieva's arm is rigid (no elbow), so the brush runs along the circle her hand can reach on the horse's side:
   3 long curved strokes a loop over the barrel, front to back along the hair, brush lifted off on the way back */
const BR=.085;/* hand to bristle tips */
function horseIdle(Hr,t,look){JR(Hr);const m=Hr.m;m.tail.rotation.z=.32*S2(t*2)+.08*S2(t*6);m.tail.rotation.x=.05*S2(t*2);m.head.rotation.y=-(look||0);m.head.rotation.x=.05*S2(t*2);}
let IX=.3,IZ=HZ+.8,BI=1,GS=false,LEAN=.1;const ITH=.35;
function phase(t){const u=(t*3)%1;if(u<.62){const v=u/.62;return {a:.1+1.2*ease(v),lift:0,on:1};}const v=(u-.62)/.38;return {a:1.3-1.2*ease(v),lift:.12*Math.sin(P_*v),on:0};}
function iev(){return person('farm:coach',{v:'ieva'});}
function minZ(I){const b=new THREE.Box3();[I.p.b,I.p.head,...I.p.legs].forEach(q=>b.expandByObject(q));return b.min.z;}
/* pose Ieva's body for time t (heading th, grooming weight g) and return the brush hand target */
function groomBody(I,th,g,a){I.root2.position.set(IX,0,IZ);I.root2.rotation.y=th-g*.12*Math.cos(a);I.g.rotation.x=LEAN*g;JG(I,0);}
function groomTarget(I,Hr,a,lift){const S=shoulderPt(I,BI);let zp=HZ+.27+BR,P=new V3();
  for(let k=0;k<3;k++){const d=S.z-zp,r=Math.sqrt(Math.max(.0004,.25-d*d));P.set(S.x+r*Math.cos(a),S.y+r*Math.sin(a),zp);const z2=rayZ(Hr.root2,P.x,P.y,9,-1);if(z2!=null)zp=z2+BR;}
  P.z+=lift;return P;}
function solveGroom(Hr){if(GS)return;GS=true;const I=iev();
  /* which way is "lean forward", which shoulder is nearer the horse */
  JR(I);I.root2.position.set(IX,0,IZ);I.root2.rotation.y=ITH;JG(I,0);const s0=[0,1].map(i=>shoulderPt(I,i).z);BI=s0[0]<s0[1]?0:1;
  I.g.rotation.x=.1;JG(I,0);const zp=shoulderPt(I,BI).z;I.g.rotation.x=-.1;JG(I,0);LEAN=zp<shoulderPt(I,BI).z?.1:-.1;
  /* stand so the near shoulder is 0.3 from the brushing plane, above the middle of the barrel */
  for(let k=0;k<4;k++){JR(I);groomBody(I,ITH,1,P_/2);const S=shoulderPt(I,BI);IZ+=(HZ+.27+BR+.26)-S.z;IX+=.0-S.x;}
  JR(I);groomBody(I,ITH,1,P_/2);let worst=0,lo=9,hi=0;for(let k=0;k<36;k++){const t=k/36,ph=phase(t);JR(I);groomBody(I,ITH,1,ph.a);const T=groomTarget(I,Hr,ph.a,ph.lift);const r=reach(I,BI,T);if(ph.on){worst=Math.max(worst,r[2]);lo=Math.min(lo,T.x);hi=Math.max(hi,T.x);}}
  JR(I);groomBody(I,ITH,1,P_/2);dbg('groom: arm',BI,'lean',LEAN,'at',IX,IZ,'worst hand err (on the horse)',worst,'stroke x',lo,hi,'ieva minZ',minZ(I),'horse side',HZ+.27);}
function groomCell(){return cell('Ieva grooms a horse','long strokes; brush: model missing (stand-in)',()=>{
  const {S,Hr}=yard();const C=camLook([5.3,3.0,6.6],[.05,1.25,5.0],31);
  const I=iev();S.add(I.root2);floorShadow(S,IX,IZ,.3,.24);const br=brushMk(S);const bi=BI,oi=1-bi;
  return {S,C,tick:t=>{
   horseIdle(Hr,t,.32*bell(t,.25,.75));Hr.root2.updateMatrixWorld(true);
   const ph=phase(t);JR(I);groomBody(I,ITH,1,ph.a);const T=groomTarget(I,Hr,ph.a,ph.lift);
   const s=reach(I,bi,T);I.p.arms[bi].rotation.x=s[0];I.p.arms[bi].rotation.z=s[1];I.p.head.rotation.y=.25*Math.cos(ph.a);I.p.head.rotation.x=.1;
   I.p.arms[oi].rotation.x=-.2;I.p.arms[oi].rotation.z=(oi?1:-1)*.12;JG(I,0);
   br.position.copy(handPt(I,bi));br.rotation.set(0,0,0);
  }};});}

/* ===== 4. Ieva points you to Stan at the jump field ===== */
const STX=-7.0,STZ=2.2;
function pointCell(){return cell('Ieva points you to Stan','you ask for a horse; first: lesson with Stan',()=>{
  const {S,Hr}=yard();const C=camLook([2.7,2.7,12.6],[-1.2,1.15,4.8],36);
  for(const [x,z,ry] of[[STX-1.6,STZ-1.3,0],[STX+.4,STZ-1.3,0],[STX-2.6,STZ+.4,P_/2]]){const f=new THREE.Group();PU['farm:fence'].build(f,PU['farm:fence'].dflt||{});f.position.set(x,0,z);f.rotation.y=ry;S.add(f);}
  const St=person('farm:coach',{v:'stan'});St.root2.position.set(STX,0,STZ);S.add(St.root2);floorShadow(S,STX,STZ,.3,.24);
  const I=iev();S.add(I.root2);floorShadow(S,IX,IZ,.3,.24);const br=brushMk(S);
  const Pl=person('farm:farmer',{who:'a'});S.add(Pl.root2);const pSh=floorShadow(S,0,0,.3,.24);
  const QX=1.72,QZ=IZ+.32;
  const P0=[5.6,IZ+2.3],P1=[-3.9,IZ+3.4];const pP=path([{t0:-.0001,t1:.17,k:'walk',a:[P0[0],P0[1],0],b:[QX,QZ,0]},{t0:.72,t1:.84,k:'walk',a:[QX,QZ,0],b:[1.3,IZ+2.4,0]},{t0:.84,t1:1,k:'walk',a:[1.3,IZ+2.4,0],b:[P1[0],P1[1],0]}]);
  const toI=headTo(IX-QX,IZ-QZ),toSt=headTo(STX-QX,STZ-QZ);
  const pH=[[0,headTo(QX-P0[0],QZ-P0[1])],[.15,headTo(QX-P0[0],QZ-P0[1])],[.19,toI],[.4,toI],[.45,toI-.5],[.64,toI-.5],[.72,headTo(1.3-QX,IZ+2.4-QZ)],[.82,headTo(1.3-QX,IZ+2.4-QZ)],[.86,headTo(P1[0]-1.3,P1[1]-IZ-1.75)],[1,headTo(P1[0]-QX,P1[1]-QZ)]];
  const thP=headTo(QX-IX,QZ-IZ),thPt=2.95;
  const iH=[[0,ITH],[.13,ITH],[.2,thP],[.36,thP],[.42,thPt-TAU],[.62,thPt-TAU],[.67,thP],[.74,thP],[.84,ITH],[1,ITH]];
  /* Ieva's brush arm (from cell 3) and her pointing arm */
  const bi=BI,oi=1-bi;
  JR(I);I.root2.position.set(IX,0,IZ);I.root2.rotation.y=thPt;JG(I,0);const dir=new V3(STX-IX,0,STZ-IZ).normalize();
  const cand=[0,1].map(i=>{const s=shoulderPt(I,i);return [i,reach(I,i,s.clone().add(dir.clone().multiplyScalar(.5)).add(new V3(0,.12,0)),true)];});const ci=shoulderPt(I,0).z>shoulderPt(I,1).z?0:1;const [pai,pSol]=cand[ci];/* the arm on the camera side points */
  dbg('point arm',pai,'err',pSol[2],'brush arm',bi);
  /* Stan: arm without the clipboard waves */
  const wv=0;/* COACHES: Stan's clipboard is in arms[1] */
  return {S,C,tick:t=>{
   horseIdle(Hr,t,.25*bell(t,.05,.3));Hr.root2.updateMatrixWorld(true);
   /* Ieva */
   JR(I);I.root2.position.set(IX,0,IZ);const th=lerpK(iH,t);I.root2.rotation.y=th;JG(I,0);
   const g=1-seg(t,.12,.18)*(1-seg(t,.84,.9));
   if(g>0){const ph=phase(t);groomBody(I,th,g,ph.a);const T=groomTarget(I,Hr,ph.a,ph.lift+.25*(1-g));const s=reach(I,bi,T);I.p.arms[bi].rotation.x=s[0]*g;I.p.arms[bi].rotation.z=s[1]*g;}
   const talk=seg(t,.2,.23)*(1-seg(t,.34,.37))+seg(t,.67,.69)*(1-seg(t,.73,.75));I.p.head.rotation.x=.1*talk*Math.max(0,S2(t*9))+.08*g;
   I.p.arms[oi].rotation.x+=-.35*talk*Math.max(0,S2(t*4.5));
   const pt=seg(t,.42,.46)*(1-seg(t,.6,.64));if(pt>0){setArm(I,pai,pSol,pt,[I.p.arms[pai].rotation.x,I.p.arms[pai].rotation.z]);}
   I.p.head.rotation.y=.25*pt;JG(I,0);
   const bh=handPt(I,bi);br.position.copy(bh);br.visible=true;
   /* player */
   JR(Pl);const pp=pP.pos(t);Pl.root2.position.set(pp[0],0,pp[1]);Pl.root2.rotation.y=lerpK(pH,t);personWalk(Pl.p,pP.dist(t)/1.1,cl(pP.spd(t)/2));
   Pl.p.head.rotation.x=.08*seg(t,.2,.23)*(1-seg(t,.36,.39))*Math.max(0,S2(t*9+.5));JG(Pl,0);pSh.position.set(pp[0],.006,pp[1]);
   if(t<.01)dbg('c4 player start/end on screen (|x|,|y|>1 = off):',...[P0,P1].map(q=>{const v=new V3(q[0],1,q[1]).project(C);return v.x.toFixed(2)+','+v.y.toFixed(2);}));
   /* Stan: waits with his clipboard, waves back when Ieva points, a small hop */
   JR(St);St.root2.rotation.y=headTo(IX-STX,IZ-STZ)+.2;const w=seg(t,.45,.49)*(1-seg(t,.72,.76));const sd=wv===1?1:-1;
   St.p.arms[wv].rotation.x+=-.2*w;St.p.arms[wv].rotation.z+=sd*(2.5+.35*S2((t-.56)*5))*w;St.p.head.rotation.x=-.1*w;JG(St,0);
  }};});}

CLIPS2.showStaff={title:'Pet Show license (real models) · riding instructors Ieva and Stan',cols:2,cw:340,ch:270,frames:72,cells:[podiumCell(),areaCell(),groomCell(),pointCell()]};
})();
