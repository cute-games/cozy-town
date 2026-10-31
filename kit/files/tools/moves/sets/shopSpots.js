/* Pet Shop cozy spots: each shop pet's idle move at its own spot (31 Oct, approved by Karolis) */
(()=>{const H=window.MVH;const {cell,mk,walkP,lieP,sitP,wag,spec,zzz,dbg,birdLie,cl,ease,seg,bell,S2,C2,P_,TAU}=H;
const RO={rigid:true};const V3=THREE.Vector3;
function RP(id){if(id==='pet:bear')return mk(id,{v:'teddy',age:'adult'},undefined,undefined,RO);return mk(id,{age:'adult'},undefined,undefined,RO);}
/* indoor stage: shop floor, optional back wall (room colours) */
function room(o){o=o||{};const S=H.scene(o.bg||'#d8ece4');const f=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshLambertMaterial({color:'#f6ecd8'}));f.rotation.x=-P_/2;S.add(f);
  if(o.wz!=null){const wh=o.wh||3.2,ww=o.ww||14;const w=new THREE.Mesh(new THREE.BoxGeometry(ww,wh,.2),new THREE.MeshLambertMaterial({color:'#e6f8f0'}));w.position.set(o.wx||0,wh/2+(o.wy||0),o.wz-.1);S.add(w);
    const b=new THREE.Mesh(new THREE.BoxGeometry(ww,.14,.05),new THREE.MeshLambertMaterial({color:'#5fd4b0'}));b.position.set(o.wx||0,.07+(o.wy||0),o.wz+.02);S.add(b);}
  return S;}
function camAt(tx,ty,tz,r,yaw,pitch){const d=r/Math.sin(16*P_/180)*1.05;const C=new THREE.PerspectiveCamera(32,1,.01,500);
  C.set=(x,y,z)=>{C.position.set(x+Math.sin(yaw)*Math.cos(pitch)*d,y+Math.sin(pitch)*d,z+Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(x,y,z);};C.set(tx,ty,tz);C.near=d/100;C.far=d*30;C.updateProjectionMatrix();return C;}
function gear(S,id,o,s,ry,x,y,z){const W=new THREE.Group(),g=new THREE.Group();const M=PU[id];M.build(g,Object.assign({},M.dflt||{},o||{}));W.add(g);W.scale.setScalar(s||1);W.rotation.y=ry||0;W.position.set(x||0,y||0,z||0);S.add(W);return {W,g};}
function addPet(S,R){S.add(R.root2);RIG.addShadow(R,S);return R;}
function boxW(R,f){R.root2.updateMatrixWorld(true);const bb=new THREE.Box3(),v=new V3();R.parts.forEach(q=>{if(f&&!f(q))return;const a=q.geo.attributes.position.array,M=q.mesh.matrixWorld;for(let k=0;k<a.length;k+=3)bb.expandByPoint(v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M));});return bb;}
function tipW(R,i){const l=R.legs[i];R.root2.updateMatrixWorld(true);const v=new V3(),s=new V3();let n=0;
  l.parts.forEach(q=>{if(q.outline)return;const r=q.rest,a=q.geo.attributes.position.array,M=q.mesh.matrixWorld;for(let k=0;k<r.length;k+=3)if(r[k+1]<l.bot+.06*l.len){s.add(v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M));n++;}});return n?s.multiplyScalar(1/n):s;}
/* a foot's contact point: centre of the lowest bit of the leg (outline included), lowest y */
function footW(R,i){const l=R.legs[i];R.root2.updateMatrixWorld(true);let lb=1e9;l.parts.forEach(q=>{const r=q.rest;for(let k=1;k<r.length;k+=3)lb=Math.min(lb,r[k]);});
  const v=new V3();let sx=0,sz=0,n=0,my=1e9;l.parts.forEach(q=>{const r=q.rest,a=q.geo.attributes.position.array,M=q.mesh.matrixWorld;for(let k=0;k<r.length;k+=3)if(r[k+1]<lb+.15*l.len){v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M);sx+=v.x;sz+=v.z;n++;my=Math.min(my,v.y);}});
  return n?new V3(sx/n,my,sz/n):new V3();}
/* top of a piece at (x,z): ray from above (only meshes passing flt) */
function surfY(G,x,z,flt){G.updateMatrixWorld(true);const ms=[];G.traverse(q=>{if(q.isMesh&&q.material.side!==THREE.BackSide&&(!flt||flt(q)))ms.push(q);});
  const h=new THREE.Raycaster(new V3(x,40,z),new V3(0,-1,0)).intersectObjects(ms,false)[0];return h?h.point.y:0;}
/* how much the floor rule would lift pose P: lets moving parts (tail, head) move without the whole body bobbing */
function floorOff(R,P){const Q=Object.assign({},P,{root:Object.assign({},P.root||{})});Q.floor=true;RIG.pose(R,Q);const a=R.root.position.y;Q.floor=false;RIG.pose(R,Q);return a-R.root.position.y;}
/* a PU model kept as its own groups (rigid pieces turning at joints); cap = builder whose returned groups we keep (same as bigPets) */
function J(id,opt,cap){let got=null,orig=null;if(cap){orig=window[cap];window[cap]=function(...a){const r=orig.apply(this,a);if(!got)got=r;return r;};}
  const g=new THREE.Group();try{PU[id].build(g,Object.assign({},PU[id].dflt,opt||{}));}finally{if(cap)window[cap]=orig;}
  const root2=new THREE.Group(),turn=new THREE.Group();turn.rotation.y=P_/2;turn.add(g);root2.add(turn);root2.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(root2);const all=[];g.traverse(q=>all.push([q,q.position.clone(),q.rotation.clone(),q.scale.clone()]));
  return {m:got,g,root2,turn,L:bb.max.x-bb.min.x,H:bb.max.y-bb.min.y,W:bb.max.z-bb.min.z,min0:bb.min.y,bb,all,id};}
function JR(R){R.all.forEach(([q,p,r,s])=>{q.position.copy(p);q.rotation.copy(r);q.scale.copy(s);});}
function lerpK(keys,t){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(t<=b[0]){const u=ease((t-a[0])/((b[0]-a[0])||1));return a[1]+(b[1]-a[1])*u;}}return keys[keys.length-1][1];}
function blobShadow(S,rx,rz,op){const m=new THREE.Mesh(new THREE.CircleGeometry(1,28),new THREE.MeshBasicMaterial({color:'#000',transparent:true,opacity:op||.25,depthWrite:false}));m.rotation.x=-P_/2;m.scale.set(rx,rz,1);S.add(m);return m;}
/* a "model missing" stand-in (kept for any piece that could not be found) */
function missing(S,x,y,z,s){const m=new THREE.Mesh(new THREE.BoxGeometry(s,s,s),new THREE.MeshLambertMaterial({color:'#ff4fa0'}));m.position.set(x,y+s/2,z);S.add(m);return m;}

/* Living's posed models (c13 petPose): the game's own pet, posed with hip joints; kept as rigid groups */
function PP(kind,pose){const m=petPose(puPet(kind,null,'adult'),pose);const root2=new THREE.Group(),turn=new THREE.Group();turn.rotation.y=P_/2;turn.add(m.root);root2.add(turn);
  const all=[];m.root.traverse(q=>all.push([q,q.position.clone(),q.rotation.clone(),q.scale.clone()]));root2.updateMatrixWorld(true);return {m,root2,turn,all};}
const wbox=o=>{o.updateMatrixWorld(true);return new THREE.Box3().setFromObject(o);};
/* ===== 1. dog naps on the sofa ===== */
function cDog(){return cell('Dog naps on the sofa','lies on the cushions, slow breaths, tail thumps',()=>{
  const S=room({wz:-1.4});const G=gear(S,'shop:dogsofa',{},1,0,0,0,0);const seat=surfY(G.W,-.48,-.5);
  const R=PP('dog','lie');S.add(R.root2);const m=R.m;const th=-.32;R.root2.rotation.y=th;
  const nap=()=>{if(m.head)m.head.rotation.x+=.5;};R.root2.position.set(-.05,0,-.5);nap();const lo=wbox(R.root2).min.y;JR(R);const y0=seat-Math.min(0,lo);
  const z1=zzz(S,.4,seat+.42,-.3,.2);const C=camAt(.05,.6,-.45,.95,.45,.22);
  return {S,C,tick:t=>{JR(R);nap();R.root2.position.set(-.05,y0,-.5);const br=S2(t*2);m.b.scale.set(1+.012*br,1+.03*br,1+.012*br);if(m.head)m.head.rotation.x+=.03*S2(t*2-.15);
    const th1=bell(t,.28,.36)+bell(t,.38,.46),th2=bell(t,.7,.78)+bell(t,.8,.88);if(m.tail){m.tail.rotation.x-=.7*(th1+th2);m.tail.rotation.y+=.2*(th1-th2);}z1(t);}};});}

/* ===== 2. cat on the window seat ===== */
function cCatLie(){return cell('Cat on the window seat','lies, looks out the window, tail swishes',()=>{
  const S=room({wz:-.36});const G=gear(S,'shop:catseat',{},1,0,0,0,0);const seat=surfY(G.W,-.3,0);
  {const w=new THREE.Mesh(new THREE.BoxGeometry(1.6,1.3,.06),new THREE.MeshLambertMaterial({color:'#cfeeff'}));w.position.set(.3,1.1+.65,-.35);S.add(w);
   const s=new THREE.Mesh(new THREE.BoxGeometry(1.7,.08,.1),new THREE.MeshLambertMaterial({color:'#ffd45c'}));s.position.set(.3,1.1,-.33);S.add(s);
   const mm=new THREE.Mesh(new THREE.BoxGeometry(.05,1.3,.07),new THREE.MeshLambertMaterial({color:'#ffffff'}));mm.position.set(.3,1.75,-.33);S.add(mm);}
  const R=PP('cat','lie');S.add(R.root2);const m=R.m;R.root2.rotation.y=.12;R.root2.position.set(-.45,seat,.02);
  const look=[[0,-.5],[.1,1.0],[.4,1.0],[.5,-.5],[.62,-.5],[.72,1.0],[.9,1.0],[1,-.5]];const C=camAt(-.15,.85,0,.85,.62,.16);
  return {S,C,tick:t=>{JR(R);if(m.head){const hy=lerpK(look,t);m.head.rotation.y+=hy;m.head.rotation.x-=.12*cl((hy+.5)/1.5);}const br=S2(t*2);m.b.scale.set(1,1+.02*br,1);
    if(m.tail){m.tail.rotation.y+=.9*S2(t*3);m.tail.rotation.x-=.35;}}};});}


function cCat(){return cell('Cat on the window seat','sits, looks out the window, tail swishes',()=>{
  const S=room({wz:-.36});const G=gear(S,'shop:catseat',{},1,0,0,0,0);const seat=surfY(G.W,-.3,0);
  /* the shop's own back-wall window right behind the seat (same size and colours as the room's windows) */
  {const w=new THREE.Mesh(new THREE.BoxGeometry(1.6,1.3,.06),new THREE.MeshLambertMaterial({color:'#cfeeff'}));w.position.set(.3,1.1+.65,-.35);S.add(w);
   const s=new THREE.Mesh(new THREE.BoxGeometry(1.7,.08,.1),new THREE.MeshLambertMaterial({color:'#ffd45c'}));s.position.set(.3,1.1,-.33);S.add(s);
   const m=new THREE.Mesh(new THREE.BoxGeometry(.05,1.3,.07),new THREE.MeshLambertMaterial({color:'#ffffff'}));m.position.set(.3,1.75,-.33);S.add(m);}
  const R=addPet(S,RP('age:cat'));R.shadow.visible=false;R.root2.position.set(-.45,seat,.02);R.root2.rotation.y=.12;
  const base=()=>{const P={hip:[],knee:[]};sitP(R,1,P);return P;};const off=floorOff(R,base());
  const look=[[0,-.45],[.1,1.05],[.4,1.05],[.5,-.45],[.62,-.45],[.72,1.05],[.9,1.05],[1,-.45]];
  const C=camAt(-.15,.95,0,.85,.62,.16);
  return {S,C,tick:t=>{const P=base();P.floor=false;P.root.y=(P.root.y||0)+off;const hy=lerpK(look,t);const out=cl((hy+.45)/1.5);
    P.hy=hy;P.hp=(P.hp||0)+.18*out;P.ty=(P.ty||0)+.55*S2(t*3);P.tp=(P.tp||0)+.1*S2(t*6);P.br=.025*S2(t*2);RIG.pose(R,P);}};});}

/* ===== 3. bunny + hamster on the play hill ===== */
function onHill(R,P,x,z,th,lift){R.root2.position.set(x,0,z);R.root2.rotation.y=th;const fx=Math.cos(th),fz=-Math.sin(th),d=R.L*.3,w=R.W*.3;
  const pitch=Math.atan2(psHillY(x+fx*d,z+fz*d)-psHillY(x-fx*d,z-fz*d),2*d);const sx=Math.sin(th),sz=Math.cos(th);const roll=Math.atan2(psHillY(x+sx*w,z+sz*w)-psHillY(x-sx*w,z-sz*w),2*w);
  P.root=P.root||{};const hop=P.root.y||0;P.root.y=0;P.root.rz=(P.root.rz||0)+pitch;P.root.rx=(P.root.rx||0)-roll;P.floor=false;RIG.pose(R,P);
  let need=-1e9;R.legs.forEach((l,i)=>{const p=footW(R,i);need=Math.max(need,psHillY(p.x,p.z)-p.y);});R.root2.position.y=need+hop;}
function cHill(){return cell('Bunny + hamster play hill','bunny hops up and down, hamster runs round',()=>{
  const S=room();gear(S,'shop:playhill',{},1,0,0,0,0);
  const B=addPet(S,RP('age:bunny'));B.shadow.visible=false;const sp=spec(B,'age:bunny');
  const Hm=addPet(S,RP('age:hamster'));Hm.shadow.visible=false;
  const ex=-.65,ez=.3,rx=.6,rz=.32;const bp=u=>[ex+rx*Math.cos(TAU*u),ez-rz*Math.sin(TAU*u)];   /* the bunny's loop (counter-clockwise seen from above) */
  const hx=.85,hz=.5,hr=.62;const hp=u=>[hx+hr*Math.cos(TAU*u+2.2),hz-hr*Math.sin(TAU*u+2.2)];
  const NB=8,NH=Math.max(4,Math.round(TAU*hr/RIG.stride(Hm,.5,1)));dbg('hamster steps',NH);
  const head=(f,u)=>{const a=f(u-.002),b=f(u+.002);return Math.atan2(-(b[1]-a[1]),b[0]-a[0]);};
  const sb=blobShadow(S,.22,.16,.22),sh=blobShadow(S,.15,.12,.22);const flat=(m,x,z)=>{const e=.02,n=new V3(-(psHillY(x+e,z)-psHillY(x-e,z))/(2*e),1,-(psHillY(x,z+e)-psHillY(x,z-e))/(2*e)).normalize();m.quaternion.setFromUnitVectors(new V3(0,0,1),n);m.position.set(x,psHillY(x,z)+.012,z);};
  const C=camAt(-.2,.55,.2,1.6,.12,.5);
  return {S,C,tick:t=>{const [x,z]=bp(t);const P={};walkP(B,{g:"hop",A:.6,B:1.15},NB*t,P,1.0);onHill(B,P,x,z,head(bp,t));
    const [x2,z2]=hp(-t);const Q={};RIG.gait(Hm,Q,'trot',NH*t,.5,1.0);Q.root={y:.01*Math.abs(S2(2*NH*t))};Q.hp=.05*S2(2*NH*t);onHill(Hm,Q,x2,z2,head(hp,-t)+P_);flat(sb,x,z);flat(sh,x2,z2);}};});}

/* ===== 4. capybara in the warm tub ===== */
function cCapy(){return cell('Capybara in the warm tub','soaks up to its chin, eyes half shut, bobs',()=>{
  const S=room({wz:-1.3});const G=gear(S,'shop:capytub',{},1,0,0,0,0);const wy=surfY(G.W,.2,.2);
  const steam=[];G.g.traverse(q=>{if(q.isMesh&&q.material.transparent&&q.material.opacity<.6){q.material=q.material.clone();steam.push([q,q.position.y]);}});
  const R=J('age:capybara',{v:'real',age:'adult'},'capyReal2');S.add(R.root2);
  /* half-shut eyes: a lid (head colour) over the top half of each eye, turning at the eye like a joint; slow blinks close it */
  const lids=[];if(R.m&&R.m.head){const hc=(R.m.head.children.find(q=>q.isMesh&&q.material.color)||{}).material;const col=hc?hc.color:new THREE.Color('#b8784a');
    R.m.head.children.forEach(e=>{if(!e.isGroup)return;const eye=e.children.find(q=>q.isMesh&&q.material.color&&q.material.color.getHexString()==='141018'&&q.geometry.type==='SphereGeometry');if(!eye)return;
      const r=eye.geometry.parameters.radius;e.children.forEach(q=>{if(q!==eye&&q.position.y>0)q.visible=false;});
      const lid=new THREE.Mesh(new THREE.SphereGeometry(r*1.14,18,8,0,TAU,0,P_/2),new THREE.MeshLambertMaterial({color:col}));lid.scale.set(1,1.05,.66);lid.rotation.x=-.25;e.add(lid);lids.push(lid);});}
  dbg('capy lids',lids.length);const th=-1.45;R.root2.rotation.y=th;
  const sink=.36*R.H;R.turn.position.set(-((R.bb.min.x+R.bb.max.x)/2)*0,-R.min0,0);dbg('capy H',R.H,'L',R.L,'water',wy);
  const C=camAt(-.05,.66,.1,.8,.25,.3);
  return {S,C,tick:t=>{JR(R);const m=R.m;R.root2.position.set(-.1,wy-sink+.012*S2(t*2),-.06);R.root2.rotation.set(0,th,.04*S2(t*2-.2),'YXZ');
    const bk=Math.max(bell(t,.3,.38),bell(t,.8,.88));lids.forEach(l=>l.rotation.x=-.25+1.15*bk);if(m.head){m.head.rotation.x+=.04*S2(t)-.22;m.head.rotation.z+=.06*S2(t+.25);}
    steam.forEach(([q,y0],i)=>{const u=(t+i*.5)%1;q.position.y=y0-.1+.4*u;q.material.opacity=.5*Math.sin(P_*u);q.scale.setScalar(.8+.5*u);});}};});}

/* ===== 5. duck paddles on the pond ===== */
function cDuck(){return cell('Duck paddles on the pond','glides a loop, dips its head',()=>{
  const S=room({wz:-1.3});const G=gear(S,'shop:duckpond',{},1,0,0,0,0);const wy=surfY(G.W,0,.7);
  const R=addPet(S,RP('age:duck'));R.shadow.visible=false;const base=()=>{const P={hip:[],knee:[]};birdLie(R,1,P);return P;};const off=floorOff(R,base());const y0=wy-.15;
  /* the duck's footprint (points at the water line, and everything for the bridge check) in its own frame */
  R.root2.position.set(0,y0,0);R.root2.rotation.y=0;{const P=base();P.floor=false;P.root.y=(P.root.y||0)+off;RIG.pose(R,P);}R.root2.updateMatrixWorld(true);
  const wl=[],all=[];const v=new V3();R.parts.forEach(q=>{const a=q.geo.attributes.position.array,M=q.mesh.matrixWorld;for(let k=0;k<a.length;k+=9){v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M);all.push([v.x,v.z]);if(v.y<wy+.02)wl.push([v.x,v.z]);}});
  const fit=(cx,cz,ax,az)=>{let r=0,zm=9,lp=9;for(let i=0;i<48;i++){const u=i/48,x=cx+ax*Math.cos(TAU*u),z=cz-az*Math.sin(TAU*u);const dx=-ax*Math.sin(TAU*u),dz=-az*Math.cos(TAU*u);const h=Math.atan2(-dz,dx),c=Math.cos(h),s=Math.sin(h);
      for(const [px,pz] of wl){const X=x+px*c+pz*s,Z=z-px*s+pz*c;r=Math.max(r,Math.hypot(X,Z));lp=Math.min(lp,Math.hypot(X+.55,Z-.45));}for(const [px,pz] of all){const Z=z-px*s+pz*c;zm=Math.min(zm,Z);}}return {r,zm,lp};};
  let best=null;for(let cx=-.2;cx<=.21;cx+=.05)for(let cz=.55;cz<=.76;cz+=.03)for(let ax=.15;ax<=.6;ax+=.03)for(let az=.06;az<=.3;az+=.03){const f=fit(cx,cz,ax,az);if(f.r<1.03&&f.zm>.335&&f.lp>.19){const sc=ax+az;if(!best||sc>best.sc)best={sc,cx,cz,ax,az,f};}}
  if(!best)best={cx:.1,cz:.66,ax:.3,az:.1,f:{}};dbg('duck loop',JSON.stringify(best));const {cx,cz,ax,az}=best;
  const pos=u=>[cx+ax*Math.cos(TAU*u),cz-az*Math.sin(TAU*u)];const C=camAt(0,.42,.35,.95,.3,.38);
  /* glides side to side across the front of the pond; at each end it turns through facing the camera, so its face shows */
  const gx=t=>.3*Math.sin(TAU*t),gz=t=>.62+.04*Math.cos(TAU*2*t);
  return {S,C,tick:t=>{const x=gx(t),z=gz(t);const h=-P_/2+P_/2*Math.max(-1,Math.min(1,2.2*Math.cos(TAU*t)))*.72;
    const P=base();P.floor=false;P.root.y=(P.root.y||0)+off+.008*S2(t*4);P.root.rx=.05*S2(t*4);
    const dip=Math.min(1,1.6*(bell(t,.15,.35)+bell(t,.65,.85)));P.hp=.1*S2(t*2)-.7*dip;P.root.rz=(P.root.rz||0)-.2*dip;P.ty=.4*S2(t*8)+.5*dip;P.wing=[0,0];
    R.root2.position.set(x,y0,z);R.root2.rotation.y=h;RIG.pose(R,P);}};});}

/* ===== 6. owl on the tree branch ===== */
function cOwl(){return cell('Owl on its perch','blinks, turns its head, shuffles its wings',()=>{
  const S=room({wz:-5.1,wh:6,ww:16,wy:2.2});gear(S,'shop:playhill',{},1,0,0,0,0);const T=gear(S,'shop:tree',{},1,0,0,0,0);
  const a=.3,bx=Math.cos(a)*.83,bz=Math.sin(a)*.83;const by=surfY(T.W,bx,bz,q=>q.material.color&&q.material.color.getHexString()==='c98f5e');dbg('owl perch y',by);   /* the shop's perch plank on the branch */
  const R=J('age:owl',{age:'adult'},'makePet');S.add(R.root2);const m=R.m;const th=Math.atan2(-Math.cos(a),-Math.sin(a));
  /* wings turn at the shoulder: put each wing (and its outline) in a pivot group */
  const wings=[];if(m&&m.b){const ws=m.b.children.filter(q=>q.isMesh&&q.geometry.type==='BoxGeometry');for(const sd of[-1,1]){const pr=ws.filter(q=>Math.sign(q.position.x)===sd);if(!pr.length)continue;
    const pv=new THREE.Group();pv.position.set(pr[0].position.x,pr[0].position.y+.13,pr[0].position.z);m.b.add(pv);pr.forEach(q=>pv.attach(q));wings.push([pv,sd]);}}
  R.all=[];R.g.traverse(q=>R.all.push([q,q.position.clone(),q.rotation.clone(),q.scale.clone()]));
  const eyes=[];if(m&&m.head)m.head.children.forEach(q=>{if(q.isMesh&&q.geometry.type==='SphereGeometry'&&q.position.z>.1)eyes.push(q);});
  const look=[[0,0],[.1,0],[.2,1.0],[.36,1.0],[.46,0],[.56,0],[.66,-1.0],[.8,-1.0],[.9,0],[1,0]];
  const C=camAt(bx,by+.42,bz,.62,Math.atan2(-Math.sin(a),Math.cos(a)),.08);
  return {S,C,tick:t=>{JR(R);R.root2.position.set(bx,by-R.min0,bz);R.root2.rotation.y=th;
    if(m.head){m.head.rotation.y=lerpK(look,t);m.head.rotation.z=.12*bell(t,.46,.56);}
    const bl=Math.max(bell(t,.12,.17),bell(t,.5,.55),bell(t,.92,.97));eyes.forEach(q=>q.scale.y*=1-.88*bl);
    const sh=bell(t,.58,.64)+bell(t,.66,.72);wings.forEach(([pv,sd])=>pv.rotation.z=sd*.35*sh);if(m.b){m.b.rotation.z=.04*sh*S2(t*12);}}};});}

/* ===== 7. bear on the sofa watching TV ===== */
function cBear(){return cell('Bear watches TV on the sofa','sits back, eyes on the TV, laughs',()=>{
  const S=room();const G=gear(S,'shop:bearlounge',{},1,0,0,0,0);const seat=Math.max(surfY(G.W,.45,.8),surfY(G.W,-.45,.8));const backZ=1.34;
  const R=PP('bear','sit');S.add(R.root2);const m=R.m;R.root2.rotation.y=P_/2;const bb=wbox(R.root2);const dy=seat-bb.min.y,dz=backZ-bb.max.z;dbg('bear2 dy dz',dy,dz,'H',bb.max.y-bb.min.y);
  const fr=(m.hips||[]).filter(h=>h.position.z>0);const C=camAt(0,1.1,.2,1.7,2.15,.3);
  return {S,C,tick:t=>{JR(R);const lg=bell(t,.2,.42)+bell(t,.62,.84);const hh=Math.abs(S2(t*9));R.root2.position.set(0,dy+.03*lg*hh,dz);
    if(m.sitPivot)m.sitPivot.rotation.x-=.06*lg;if(m.head)m.head.rotation.x-=.25*lg+.03*S2(t*2);m.b.scale.set(1,1+.015*S2(t*2)+.03*lg*hh,1);
    fr.forEach(h=>h.rotation.x-=.45*lg*Math.max(0,S2(t*9)));if(m.tail)m.tail.rotation.y+=.3*lg*S2(t*9);}};});}

/* ===== 8. seal: slide, splash, swim, out, round, up the ladder ===== */
function cSeal(){return cell('Seal slides into its pool','slides, splashes, swims a lap, galumphs up the slide',()=>{
  const S=room({wz:-1.25});const G=gear(S,'shop:sealpool',{},1,0,0,0,0);const wy=surfY(G.W,0,0),top=surfY(G.W,-2.5,-.6);dbg('seal water',wy,'deck',top);
  const R=J('pet:seal',{},'makePUPet');S.add(R.root2);const m=R.m;const hl=R.L/2,cx0=(R.bb.min.x+R.bb.max.x)/2;R.turn.position.set(-cx0,-R.min0,0);
  R.all=[];R.g.traverse(q=>R.all.push([q,q.position.clone(),q.rotation.clone(),q.scale.clone()]));
  /* the pool's beach ball floats aside when the seal swims into it, and drifts back */
  const ball=[];G.g.children.forEach(q=>{if(q.isMesh&&q.geometry.type==='SphereGeometry'&&Math.abs(q.position.x-1.25)<.01&&Math.abs(q.position.z-.55)<.01)ball.push(q);});dbg('seal ball parts',ball.length);const B0=new V3(1.25,.8,.55),bp=B0.clone();let lastT=-1;
  const ringM=new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.8,depthWrite:false});const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.06,6,32),ringM);ring.rotation.x=-P_/2;S.add(ring);
  const drops=[];for(let i=0;i<9;i++){const d=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),new THREE.MeshLambertMaterial({color:'#bfe9ff'}));S.add(d);drops.push(d);}
  const sa=Math.atan2(1.68-.56,1.5),ta=Math.tan(sa),su=[Math.cos(sa),-Math.sin(sa)],ST=[-1.8,top+.025],SL=Math.hypot(1.5,1.12);const XD=-2.05,XT=-2.25;
  const line=x=>ST[1]-(x-ST[0])*ta;   /* the chute's top surface (and its line carried on into the water) */
  const FY=wy-.22;   /* floating: belly .3 under the water */
  /* the swim: a lap round the right half of the pool, then along the back to the foot of the chute */
  const sw=new THREE.CatmullRomCurve3([[.2,-.55],[.5,-.45],[.65,-.05],[.5,.27],[0,.35],[-.4,.27],[-.5,.05],[-.25,-.15],[.2,-.2],[.6,-.3],[.68,-.5],[.45,-.6]].map(q=>new V3(q[0],0,q[1])),false,'centripetal');
  const hs=[];{let prev=0;for(let i=0;i<=400;i++){const u=i/400,a=sw.getPointAt(Math.max(0,u-.003)),b=sw.getPointAt(Math.min(1,u+.003));let h=Math.atan2(-(b.z-a.z),b.x-a.x);while(h-prev>P_)h-=TAU;while(h-prev<-P_)h+=TAU;hs.push(h);prev=h;}}
  const swH=u=>hs[Math.round(cl(u)*400)];dbg('seal swim end heading',swH(1));
  const onChute=(x,z)=>{const k=cl((line(x)-FY)/.25)*cl(1-Math.abs(z+.6)/.4);return {y:FY+(Math.max(FY,line(x))-FY)*k,p:sa*k};};
  const C=camAt(-.45,.75,0,2.35,.1,.42);
  const st=t=>{let x,y,z,h,p,mode='lie';
    if(t<.04){const u=ease(t/.04);x=XD+(ST[0]-XD)*u;y=top+(ST[1]-top)*u;z=-.6;h=0;p=-sa*u;}
    else if(t<.11){const u=Math.pow((t-.04)/.07,2),s=SL*u;x=ST[0]+su[0]*s;y=ST[1]+su[1]*s;z=-.6;h=0;p=-sa;mode='slide';}
    else if(t<.17){const u=Math.sin(P_/2*((t-.11)/.06));const x0=ST[0]+su[0]*SL,y0=ST[1]+su[1]*SL;x=x0+(.25-x0)*u;y=y0+(FY-y0)*u;z=-.6+.05*u;h=0;p=-sa*(1-u);mode='swim';}
    else if(t<.62){const u=(t-.17)/.45,q=sw.getPointAt(u);x=q.x;z=q.z;h=swH(u)*cl(u/.08)+(-P_-swH(1))*seg(u,.85,1);const c=onChute(x,z);y=c.y;p=c.p;mode='swim';}
    else if(t<.84){const u=(t-.62)/.22;x=.45+(ST[0]-.45)*u;z=-.6;h=-P_;y=line(x);p=sa;mode='up';}
    else if(t<.87){const u=ease((t-.84)/.03);x=ST[0]+(XT-ST[0])*u;y=ST[1]+(top-ST[1])*u;z=-.6;h=-P_;p=sa*(1-u);}
    else if(t<.96){const u=ease((t-.87)/.09);x=XT;y=top;z=-.6;h=-P_+P_*u;p=0;mode='turn';}
    else{const u=ease((t-.96)/.04);x=XT+(XD-XT)*u;y=top;z=-.6;h=0;p=0;}
    return {x,y,z,h,p,mode};};
  return {S,C,tick:t=>{JR(R);const s=st(t);
    const kS=seg(t,.02,.05)*(1-seg(t,.11,.15)),kW=seg(t,.11,.15)*(1-seg(t,.57,.63)),kG=seg(t,.6,.65)*(1-seg(t,.82,.87)),kT=bell(t,.87,.96);
    const u=(t*24)%1,bunch=Math.sin(P_*cl(u/.5))*kG,push=Math.sin(P_*cl((u-.5)/.5))*kG;
    R.root2.position.set(s.x,s.y+.03*push*Math.cos(s.p),s.z);R.root2.rotation.set(0,s.h,s.p,'YXZ');
    m.b.rotation.x=-.1*bunch+.08*push;if(m.tail)m.tail.rotation.x=.25*bunch;
    const pad=S2(t*12)*kW;
    m.legs.forEach((l,i)=>{l.rotation.x=-.6*push+.4*bunch+.9*kS-.3*pad*(i?-1:1)-.35*kW+.3*kT*S2(t*20);l.rotation.z-=Math.sign(l.position.x)*.3*kW;});
    m.rear.forEach((r,i)=>r.rotation.y=(i?1:-1)*(.3*kS+.45*S2(t*12)*kW+.3*kT));
    m.head.rotation.x=-.1*push-.45*kS-.3*kW-.25*kG-.15*bell(t,.96,1)-.15*bell(t,0,.04);m.head.rotation.y=.3*kT;
    /* the ball: pushed out of the seal's way (a capsule round its body), then drifts back */
    {const hx=Math.cos(s.h),hz=-Math.sin(s.h);const ax=s.x-hx*hl,az=s.z-hz*hl,bx=s.x+hx*hl,bz=s.z+hz*hl;let tgt=B0.clone();
     for(let it=0;it<2;it++){const vx=bx-ax,vz=bz-az,w=cl(((tgt.x-ax)*vx+(tgt.z-az)*vz)/(vx*vx+vz*vz));const px=ax+vx*w,pz=az+vz*w;let dx=tgt.x-px,dz=tgt.z-pz;const d=Math.hypot(dx,dz)||1e-3,Rm=.62;if(d<Rm&&s.y<.6){tgt.x=px+dx/d*Rm;tgt.z=pz+dz/d*Rm;}}
     tgt.x=cl(tgt.x,-1.35,1.38);tgt.z=cl(tgt.z,-.88,.88);if(t<lastT||lastT<0)bp.copy(B0);const k=t>.66?.25:.5;bp.lerp(tgt,k);if(t>.9)bp.copy(B0).lerp(bp,cl((1-t)/.1));lastT=t;
     ball.forEach(q=>{q.position.set(bp.x,.8+.015*S2(t*3),bp.z);q.rotation.y=(bp.x-B0.x)*3;});}
    const sp=cl((t-.11)/.2);ring.visible=sp>0&&sp<1;ring.position.set(-.1,wy+.012,-.6);ring.scale.setScalar(.25+1.0*sp);ringM.opacity=.85*(1-sp);
    const dp=cl((t-.11)/.1);drops.forEach((d,i)=>{const an=i/9*TAU;d.visible=dp>0&&dp<1;d.position.set(-.1+Math.cos(an)*.6*dp,wy+.05+1.6*dp*(1-dp)*(.7+.3*(i%3)),-.6+Math.sin(an)*.45*dp);});}};});}

/* ===== 9. monkey on the climbing frame ===== */
function cMonkey(){return cell('Monkey on the climbing frame','swings bar to bar, turns, swings back',()=>{
  const S=room({wz:-2.6,wh:5});gear(S,'shop:monkeyframe',{},1,0,0,0,0);
  const R=addPet(S,RP('pet:monkey'));R.shadow.visible=false;const fr=R.legs.map((l,i)=>i).filter(i=>R.legs[i].front),hd=R.legs.map((l,i)=>i).filter(i=>!R.legs[i].front);
  const len=R.legs[fr[0]].len;const BX=k=>-.85+.34*k,BY=2.585;const dl=Math.asin(Math.min(.95,.17/len));dbg('monkey arm',len,'dl',dl);
  const A=fr[0],Bp=fr[1];
  /* timeline: 3 swings forward (bars 0..4), turn on bar 4, 3 swings back, turn on bar 0 */
  const MV=.115,TT=.155;
  const HP=-1.5;const st=t=>{const o={hip:{},knee:{},anchor:A,bar:0,h:0,sw:0,tl:0,turn:0};const up=P_/2;
    const move=(j,h,fwd)=>{const e=ease(h);const hold=fwd?(j%2?Bp:A):(j%2?Bp:A),free=hold===A?Bp:A;o.anchor=hold;o.bar=fwd?j+1:3-j;o.hip[hold]=up-dl+2*dl*e;o.hip[free]=up+dl-2*dl*e;o.knee[free]=-1.0*bell(h,.08,.92);o.knee[hold]=0;o.sw=S2(h);o.tl=Math.sin(P_*h);o.h=h;};
    const turn=(u,anc,bar,other,h0)=>{o.anchor=anc;o.bar=bar;const a=cl(u/.25),c=cl((u-.75)/.25),b=cl((u-.25)/.5);
      o.hip[anc]=up-dl+dl*ease(a)+dl*ease(c);o.hip[other]=up+dl+.5*ease(a)-.5*ease(c)-2*dl*ease(c);o.knee[other]=-1.1*ease(a)*(1-ease(c));o.knee[anc]=0;o.turn=h0+P_*ease(b);o.sw=0;};
    let h0=0;
    if(t<3*MV){const j=Math.floor(t/MV);move(j,(t-j*MV)/MV,true);o.turn=0;}
    else if(t<3*MV+TT){turn((t-3*MV)/TT,Bp,4,A,0);}
    else if(t<6*MV+TT){const q=t-3*MV-TT,j=Math.floor(q/MV);move(j,(q-j*MV)/MV,false);o.turn=P_;}
    else {turn((t-6*MV-TT)/TT,Bp,0,A,P_);}
    return o;};
  const C=camAt(0,1.75,0,1.3,.05,.12);
  let hmax=0;
  return {S,C,tick:t=>{const o=st(t);const tilt=.5*o.tl;const P={hip:[],knee:[],floor:false};fr.forEach(i=>{P.hip[i]=o.hip[i]-tilt;P.knee[i]=o.knee[i]||0;});   /* arms keep their angle in the world: the body swings under the hands */
    P.root={rz:P_/2+tilt};hd.forEach((i,k)=>{P.hip[i]=-.45+.35*tilt+.1*S2(t*4+k*.5);P.knee[i]=.9-.3*tilt;});P.hp=HP-tilt*.8;P.hy=.3;P.tp=-.9+.2*S2(t*3);P.ty=.3*S2(t*2);
    R.root2.position.set(0,0,0);R.root2.rotation.y=o.turn;RIG.pose(R,P);const p=tipW(R,o.anchor);R.root2.position.set(BX(o.bar)-p.x,BY-p.y,-p.z);RIG.pose(R,P);const hm=boxW(R,q=>q.role[0]==='head').max.y;if(hm>hmax){hmax=hm;dbg('monkey head top',t.toFixed(2),hm.toFixed(3));}}};});}

CLIPS2.shopSpots={title:'Pet Shop cozy spots: each pet idles at its own spot',cols:3,cw:320,ch:260,frames:60,cells:[cDog(),cCatLie(),cHill(),cCapy(),cDuck(),cOwl(),cBear(),cSeal(),cMonkey()]};
})();
