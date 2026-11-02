(()=>{const H=window.MVH;const {cell,mk,walkP,lieP,sitP,wag,jumpArc,spec,legAvg,cumOf,propB,handW,solveArm,placeReach,crouchP,mouthW,zzz,fixShadow,birdLie,dbg,cl,ease,seg,bell,S2,C2,P_,TAU,scene,grassTex}=H;
/* ---------- helpers (pets are rigid: parts only turn at joints) ---------- */
const RO={rigid:true};
function RP(id){if(id==='age:capybara')return mk(id,{v:'real',age:'adult'},undefined,undefined,RO);if(id==='pet:bear')return mk(id,{v:'teddy',age:'adult'},undefined,undefined,RO);
  if(id==='pet:seal'||id==='pet:snake')return mk(id,{},'spine',undefined,RO);return mk(id,{age:'adult'},undefined,undefined,RO);}
function world(o){o=o||{};const S=scene();const tex=grassTex(o.g1||'#8fbf6a',o.g2||'#7aad57');const size=80,tl=o.tile||1.1;tex.repeat.set(size/tl,size/tl);
  const g=new THREE.Mesh(new THREE.PlaneGeometry(size,size),new THREE.MeshLambertMaterial({map:tex}));g.rotation.x=-P_/2;S.add(g);return S;}
function camAt(tx,ty,tz,r,yaw,pitch){const d=r/Math.sin(16*P_/180)*1.05;const C=new THREE.PerspectiveCamera(32,1,.01,500);
  C.set=(x,y,z)=>{C.position.set(x+Math.sin(yaw)*Math.cos(pitch)*d,y+Math.sin(pitch)*d,z+Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(x,y,z);};C.set(tx,ty,tz);C.near=d/100;C.far=d*30;C.updateProjectionMatrix();return C;}
/* the gear's own model groups (so moving parts can move); W: scale + turn */
function gear(S,id,o,s,ry,x,y,z){const W=new THREE.Group(),g=new THREE.Group();const M=PU[id];M.build(g,Object.assign({},M.dflt||{},o||{}));W.add(g);W.scale.setScalar(s||1);W.rotation.y=ry||0;W.position.set(x||0,y||0,z||0);S.add(W);return {W,g};}
function addPet(S,R){S.add(R.root2);RIG.addShadow(R,S);return R;}
function boxW(R,f){R.root2.updateMatrixWorld(true);const bb=new THREE.Box3(),v=new THREE.Vector3();R.parts.forEach(q=>{if(f&&!f(q))return;const a=q.geo.attributes.position.array,M=q.mesh.matrixWorld;for(let k=0;k<a.length;k+=3)bb.expandByPoint(v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M));});return bb;}
function tipW(R,i){const l=R.legs[i];R.root2.updateMatrixWorld(true);const v=new THREE.Vector3(),s=new THREE.Vector3();let n=0;
  l.parts.forEach(q=>{if(q.outline)return;const r=q.rest,a=q.geo.attributes.position.array,M=q.mesh.matrixWorld;for(let k=0;k<r.length;k+=3)if(r[k+1]<l.bot+.06*l.len){s.add(v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M));n++;}});return n?s.multiplyScalar(1/n):s;}
const minLegX=R=>Math.min(...R.legs.map(l=>l.x));
function jumpLegs(R,P,u,a){P.hip=P.hip||[];P.knee=P.knee||[];const k=Math.sin(P_*u)*(a||1);R.legs.forEach((l,i)=>{P.hip[i]=(l.front?.7:-.7)*k;P.knee[i]=(l.front?-1.1:1.1)*k;});return P;}
function treat(S){const g=new THREE.Group();const m=new THREE.MeshLambertMaterial({color:'#c8643c'});const b=new THREE.Mesh(new THREE.BoxGeometry(.11,.03,.035),m);g.add(b);
  for(const x of[-.055,.055])for(const z of[-.018,.018]){const s=new THREE.Mesh(new THREE.SphereGeometry(.024,10,8),m);s.position.set(x,0,z);g.add(s);}S.add(g);return g;}

/* ================= 1. napHome ================= */
function bearDen(){return cell('Bear naps in its cave','walks in, turns, backs in, curls up',()=>{const S=world();const s=1.9;gear(S,'home:den',{},s,P_/2,0,0,0);
  const R=addPet(S,RP('pet:bear'));const sp={g:'walk',A:.36,B:.9};const d1=RIG.stride(R,.36,1);const X0=7.2,X1=3.05,X2=2.3;
  const z1=zzz(S,X2+1.5,1.55,.6,.7);const C=camAt(2.6,.8,0,2.6,.95,.3);
  return {S,C,tick:t=>{let x,rot,P={};
    if(t<.3){const u=t/.3;x=X0+(X1-X0)*u;rot=P_;walkP(R,sp,(X0-x)/d1,P,1);P.flex=null;P.hy=.15*S2(t*4);}
    else if(t<.42){const u=seg(t,.3,.42);x=X1;rot=P_+P_*u;walkP(R,sp,(X0-X1)/d1+(t-.3)*9,P,.55);}
    else if(t<.53){const u=seg(t,.42,.53);x=X1+(X2-X1)*u;rot=TAU;walkP(R,sp,(X0-X1)/d1+1.08-(X1-x)/d1,P,.8);}
    else {x=X2;rot=TAU;}
    const lie=seg(t,.53,.64);if(lie){lieP(R,lie,P);P.hp=(P.hp||0)-.3*lie;P.hy=-.45*lie;P.br=lie>.95?.05*S2(t*3):0;}
    R.root2.position.set(x,0,0);R.root2.rotation.y=rot;RIG.pose(R,P);z1(t,t>.68);}};});}
function sealPond(){return cell('Seal naps by its pond','galumphs to the edge, lies flat, Zzz',()=>{const S=world();const s=1.5;gear(S,'home:pond',{},s,0,0,0,0);
  const R=addPet(S,RP('pet:seal'));const A={x:6.4,z:6.6},B={x:.3,z:4.15};const hd=Math.atan2(-(B.z-A.z),B.x-A.x);const N=5;
  const z1=zzz(S,-1.1,1.05,4.4,.6);const C=camAt(.4,.45,3.5,2.5,.32,.38);
  return {S,C,tick:t=>{const P={hip:[],knee:[]};let x,z,rot=hd;
    if(t<.45){const k=t/.45*N,j=Math.floor(k),u=k-j;const bunch=Math.sin(P_*cl(u/.5)),push=Math.sin(P_*cl((u-.5)/.5));const pr=(j+ease(cl((u-.5)/.5)))/N;
      x=A.x+(B.x-A.x)*pr;z=A.z+(B.z-A.z)*pr;P.root={y:R.H*.05*push,rz:.1*push-.04*bunch,sx:1-.07*bunch+.04*push};P.hp=.3*push-.1*bunch;P.wing=[-.5*push+.3*bunch,-.5*push+.3*bunch];P.arm=[.5*push-.3*bunch,.5*push-.3*bunch];P.ty=.15*bunch;}
    else{x=B.x;z=B.z;rot=hd+(P_-hd)*seg(t,.45,.53);const tw=bell(t,.45,.53);P.root={rz:.05*tw};P.arm=[.3*tw,.3*tw];}
    const lie=seg(t,.53,.64);if(lie){P.hp=(P.hp||0)-.32*lie;P.hy=-.35*lie;P.wing=[.25*lie,.25*lie];P.arm=[-.35*lie,-.35*lie];P.ty=.25*lie;P.br=lie>.95?.05*S2(t*3):0;}
    R.root2.position.set(x,0,z);R.root2.rotation.y=rot;RIG.pose(R,P);z1(t,t>.68);}};});}
CLIPS2.napHome={title:'Pets nap at home: the bear in its cave, the seal by its pond',cols:2,cw:420,ch:320,frames:48,cells:[bearDen(),sealPond()]};

/* ================= 2. petEat ================= */
function eatBowl(){return cell('Eats from its bowl','walks up, head down, chews, wags',()=>{const S=world();const R=addPet(S,RP('age:dog'));const sp=spec(R,'age:dog');const d1=RIG.stride(R,sp.A,1);
  const B=propB('foodbowl',{full:'1'});S.add(B.root);const mx=minLegX(R);
  const eatP=(k,h)=>{const P={hip:[],knee:[]};R.legs.forEach((l,i)=>{if(l.front){P.hip[i]=.25*k;P.knee[i]=-.25*k;}});P.root={rz:-.14*k,piv:[mx,0,0]};P.hp=-h*k;return P;};
  let h=.3;const headMin=()=>boxW(R,q=>q.role[0]==='head').min.y;for(;h<1.4;h+=.02){RIG.pose(R,eatP(1,h));if(headMin()<B.H+.005)break;}h-=.02;RIG.pose(R,eatP(1,h));const M=mouthW(R,.15);
  const bx=M.x-.06;B.root.position.set(bx,0,0);dbg('bowl h',h,'mouth',M.x,M.y,'bowlH',B.H);const X0=-1.3;const C=camAt(-.3,.3,0,.8,.62,.3);
  return {S,C,tick:t=>{let P={};const w=1-seg(t,.24,.3);let x=X0*(1-cl(t/.27));if(w>0)P=walkP(R,sp,(x-X0)/d1,P,w);
    const k=seg(t,.27,.36)*(1-seg(t,.86,.95));if(k){const e=eatP(k,h);P.hip=P.hip||[];P.knee=P.knee||[];R.legs.forEach((l,i)=>{if(l.front){P.hip[i]=(P.hip[i]||0)+e.hip[i];P.knee[i]=(P.knee[i]||0)+e.knee[i];}});P.root=Object.assign(P.root||{},e.root);
      const chew=t>.38&&t<.84?.09*Math.abs(Math.sin(TAU*5*t)):0;P.hp=(P.hp||0)+e.hp+chew;}
    const lick=bell(t,.87,.97);if(lick)P.hp=(P.hp||0)+.12*lick;wag(P,t,10,.7);R.root2.position.x=x;RIG.pose(R,P);}};});}
function eatHand(){return cell('Food from your hand','takes it, chews, happy dance',()=>{const S=world();const R=addPet(S,RP('age:dog'));const sp=spec(R,'age:dog');const d1=RIG.stride(R,sp.A,1);const L=R.L,Hh=R.H;
  const F=mk('farm:farmer',{who:'a'},'human',undefined,RO);S.add(F.root2);RIG.addShadow(F,S);F.root2.rotation.y=P_;
  const lean={hp:.18,root:{x:L*.06}};RIG.pose(R,lean);const T=mouthW(R,.35);T.x+=.14;const sol=placeReach(F,1,T,()=>RIG.pose(F,crouchP(F,1,{},.35)),L*.5+.6);dbg('hand solve',sol[2],F.root2.position.x);
  const food=treat(S);const X0=-1.2,XB=-.3;const C=camAt(.1,.65,0,1.35,-.32,.2);food.scale.setScalar(2.2);
  return {S,C,tick:t=>{const ck=seg(t,0,.14)*(1-seg(t,.9,1));const ak=seg(t,.04,.16)*(1-seg(t,.36,.46));const FP=crouchP(F,ck,{},.35);FP.arm=[.1*ck,sol[0]*ak];FP.wing=[0,sol[1]*ak];FP.hp=.15*ck;RIG.pose(F,FP);fixShadow(F);
    let P={};let x=X0*(1-cl(t/.22));const w=1-seg(t,.2,.24);if(w>0&&t<.24)P=walkP(R,sp,(x-X0)/d1,P,w);
    const ln=bell(t,.22,.4);if(ln){P.hp=(P.hp||0)+lean.hp*ln;P.root=Object.assign(P.root||{},{x:lean.root.x*ln});}
    if(t>.44&&t<.54){const u=seg(t,.44,.54);x=XB*u;P=walkP(R,sp,-(u*.35)/d1*3,P,.6*bell(t,.44,.54));}else if(t>=.54)x=XB;
    const chew=t>.4&&t<.56?.08*Math.abs(Math.sin(TAU*6*t)):0;P.hp=(P.hp||0)+chew;
    for(const [a,b,spin] of[[.6,.76,0],[.8,.97,1]]){const u=cl((t-a)/(b-a));if(u>0&&u<1){P.root={y:jumpArc(t,a,b,Hh*.4),ry:spin?TAU*ease(u):0};jumpLegs(R,P,u);}
      const c=bell(t,a-.04,a+.01),ld=bell(t,b-.01,b+.03);if(c||ld){P.root=Object.assign(P.root||{},{sq:1-.15*(c+ld)});lieP(R,.22*(c+ld),P);}}
    wag(P,t,11,t>.3?.85:.5);if(t>.58)P.hp=(P.hp||0)+.2;R.root2.position.x=x;RIG.pose(R,P);
    if(t<.33){food.visible=true;food.scale.setScalar(2.2);food.position.copy(handW(F,1,FP.arm[1],FP.wing[1]));food.rotation.set(0,P_/2,0);}
    else if(t<.56){food.visible=true;const m=mouthW(R,.3);m.x+=.03;food.position.copy(m);food.rotation.set(0,0,0);food.scale.setScalar(2.2*(1-seg(t,.46,.56)));}else food.visible=false;}};});}
CLIPS2.petEat={title:'Pets eat: from the bowl, and favourite food from your hand',cols:2,cw:420,ch:320,frames:48,cells:[eatBowl(),eatHand()]};

/* ================= 3. yardGear ================= */
function gDog(){return cell('Dog: agility course','jumps both bars, runs through the tunnel',()=>{const S=world();const s=1.25;gear(S,'train:dog',{},s,0,0,0,0);
  const R=addPet(S,RP('age:dog'));const A=.5,Bk=.9;const d1=RIG.stride(R,A,1)*.8;const X0=-3.7,X1=1.5;const bars=[[-1.6*s,.42],[-.6*s,.6]];
  const C=camAt(0,.4,0,1.15,.5,.28);
  return {S,C,tick:t=>{const u=cl(t/.82);const x=X0+(X1-X0)*u;const P={};RIG.gait(R,P,'gallop',(x-X0)/d1,A*(1-seg(t,.8,.84)),Bk*(1-seg(t,.8,.84)));P.root={y:0};
    for(const [xb,hh] of bars){const a=xb-.62,b=xb+.62;if(x>a&&x<b){const v=(x-a)/(b-a);P.root.y=jumpArc(v,0,1,hh);jumpLegs(R,P,v,1.1);P.root.rz=.25*Math.cos(P_*v);}}
    const inT=seg(x,-.35,.15);P.root.y+=.06*inT;
    if(t>.84){wag(P,t,12,.8);P.hy=-.4*bell(t,.86,1);}else wag(P,t,8,.4);
    R.root2.position.x=x;RIG.pose(R,P);C.set(cl(x,-2.3,.9),.45,0);}};});}
function gBunny(){return cell('Bunny: hop hurdles','big hops over three hurdles',()=>{const S=world();const s=1.3;gear(S,'train:bunny',{},s,P_/2,0,0,0);
  const R=addPet(S,RP('age:bunny'));const sp=spec(R,'age:bunny');const X0=-2.7,X1=2.6;const hs=[[-1.3,.5],[0,.58],[1.3,.66]];const C=camAt(0,.4,0,1.7,.42,.3);
  return {S,C,tick:t=>{const u=cl(t/.9);const x=X0+(X1-X0)*u;let P={};let air=false;
    for(const [xb,hh] of hs){const a=xb-.5,b=xb+.45;if(x>a&&x<b){air=true;const v=(x-a)/(b-a);P.root={y:jumpArc(v,0,1,hh),rz:.3*Math.cos(P_*v)};jumpLegs(R,P,v,1.2);}}
    if(!air){P=walkP(R,sp,x*2.2,P,.55*(1-seg(t,.9,.95)));}
    R.root2.position.x=x;RIG.pose(R,P);}};});}
function gCat(){return cell('Cat: feather wand tower','crouches, swats the feather',()=>{const S=world();const G=gear(S,'train:cat',{},1,-P_/2,0,0,0);const w=G.g.children.find(c=>c.isGroup&&Math.abs(c.position.x+.42)<.01);
  const R=addPet(S,RP('age:cat'));R.root2.position.set(-.86,0,-.17);const fr=R.legs.map((l,i)=>i).filter(i=>R.legs[i].front);const near=fr.find(i=>R.legs[i].side>0),far=fr.find(i=>R.legs[i].side<0);
  const fth=[];if(w)w.traverse(c=>{if(c.isMesh&&c.geometry.type==='SphereGeometry'&&c.scale.y>1.2)fth.push(c);});const fW=()=>{S.updateMatrixWorld(true);return fth.length?fth[0].getWorldPosition(new THREE.Vector3()):new THREE.Vector3();};
  const Tg=new THREE.Vector3(-.52,.56,-.13);let bx=0,bz=0,bd=9;if(w)for(let rx=-1.2;rx<=1.2;rx+=.04)for(let rz=-1.2;rz<=1.2;rz+=.04){w.rotation.set(rx,0,rz);const d=fW().distanceTo(Tg);if(d<bd){bd=d;bx=rx;bz=rz;}}dbg('cat wand',bx,bz,bd,fth.length);
  const C=camAt(-.5,.45,-.1,.95,.38,.2);const hits=[.3,.42,.6,.66];
  return {S,C,tick:t=>{const P={hip:[],knee:[]};const cr=bell(t,.02,.24);if(cr){lieP(R,.35*cr,P);P.ty=.5*S2(t*8)*cr;P.hp=.15*cr;}
    const up=seg(t,.22,.28)*(1-seg(t,.78,.88));if(up){sitP(R,up,P);P.root.rz=(P.root.rz||0)+.2*up;P.hp=(P.hp||0)+.15*up;
      const sw=i=>{let a=0;hits.forEach((h,k)=>{if((k<2||k==3)===(i===near)||k===2)a=Math.max(a,bell(t,h-.06,h+.05));});return a;};
      for(const i of[near,far]){const a=sw(i);P.hip[i]=(P.hip[i]||0)+(.9+1.0*a)*up;P.knee[i]=(P.knee[i]||0)-(.7-.5*a)*up;}}
    let hit=0;hits.forEach(h=>{const d=t-h;if(d>0)hit+=Math.exp(-d*14)*Math.sin(d*40);});if(w){const dp=seg(t,.08,.2)*(1-seg(t,.8,.92));w.rotation.x=bx*dp+.25*hit+.05*S2(t*3)*dp;w.rotation.z=bz*dp+.08*hit;}
    P.tp=(P.tp||0)-.3*up;wag(P,t,4,.3);RIG.pose(R,P);}};});}
function gHamster(){return cell('Hamster: wheel','runs on its wheel',()=>{const S=world();const s=2.2;const G=gear(S,'train:hamster',{},s,0,0,0,0);const wh=G.g.children.find(c=>c.isGroup);
  const R=addPet(S,RP('age:hamster'));const cx=-.2*s,cy=.26*s,ri=(.175-.006)*s;R.root2.position.set(cx,cy-ri+.012,0);R.shadow.visible=false;
  const f=6,A=.5,dist=RIG.stride(R,A,f);const k=Math.max(1,Math.round(dist/ri/(TAU/10)));const C=camAt(cx+.1,cy-.05,0,.75,.42,.18);
  return {S,C,tick:t=>{const P={};RIG.gait(R,P,'trot',f*t,A,1.0);P.root={y:.012*Math.abs(S2(2*f*t)),rz:.03*S2(f*t)};P.hp=.05*S2(2*f*t);RIG.pose(R,P);if(wh)wh.rotation.z=-k*(TAU/10)*t;}};});}
function gMonkey(){return cell('Monkey: climbing bars','swings hand over hand',()=>{const S=world();gear(S,'train:monkey',{},1,0,0,0,0);
  const R=addPet(S,RP('pet:monkey'));const fr=R.legs.map((l,i)=>i).filter(i=>R.legs[i].front),hd=R.legs.map((l,i)=>i).filter(i=>!R.legs[i].front);const len=R.legs[fr[0]].len;const dl=Math.asin(Math.min(.95,.15/len));
  const C=camAt(0,1.2,0,1.05,P_-.5,.42);const NH=5;dbg('monkey arm len',len,'delta',dl);
  return {S,C,tick:t=>{const tt=cl(t/.88)*NH;let j=Math.min(NH-1,Math.floor(tt)),h=tt-j;if(t>=.88){j=NH-1;h=1;}
    const hold=fr[j%2],free=fr[1-j%2];const P={hip:[],knee:[],floor:false};P.hip[hold]=P_/2-dl+2*dl*ease(h);P.hip[free]=P_/2+dl-2*dl*ease(h);P.knee[free]=-1.0*bell(h,.08,.92);
    const sw=S2(h);P.root={rz:P_/2+.1*sw};hd.forEach((i,k)=>{P.hip[i]=-P_/2+.35*S2(h+k*.5)+(t>.88?.5*S2(t*8+k*.5):0);P.knee[i]=.5;});P.hp=-1.15-.1*sw;P.hy=.45;P.tp=.6+.3*S2(h);P.ty=.3*S2(h+.3);
    R.root2.position.set(0,0,0);RIG.pose(R,P);const p=tipW(R,hold);R.root2.position.set(-.9+.3*(j+1)-p.x,1.6+.025-p.y,0);RIG.pose(R,P);
    C.set(cl(R.root2.position.x,-.5,.5),1.2,0);if(t<.02||Math.abs(h-.5)<.02){const q=tipW(R,free);dbg('monkey free paw',t.toFixed(2),q.x,q.y);}}};});}
function gSeal(){return cell('Seal: beach ball','tosses it, balances it, claps',()=>{const S=world();const G=gear(S,'train:seal',{},1,0,0,0,0);const br=.28;
  const R=addPet(S,RP('pet:seal'));const C=camAt(0,.8,0,1.45,.55,.18);
  return {S,C,tick:t=>{const toss=Math.pow(Math.max(0,S2(2*t)),2);const clap=Math.max(0,S2(4*t+.25));const wob=.06*S2(3*t);
    const P={hp:.55-.1*(1-toss)+wob*.5,root:{rz:.25,piv:[0,0,0],sq:1-.04*(1-toss)},hy:.08*S2(t),wing:[-.9*clap,-.9*clap],arm:[.4*clap,.4*clap],ty:.2*S2(4*t)};RIG.pose(R,P);
    const tp=RIG.headTop(R);G.W.position.set(tp.x-wob*.15,tp.y+R.H*.32*toss,tp.z);G.W.rotation.set(0,TAU*2*t,.15*wob);}};});}
function gBear(){return cell('Bear: log roll','pushes its log, rolls it back',()=>{const S=world();const s=1.3;const G=gear(S,'train:bear',{},s,P_/2,0,0,0);
  const lg=new THREE.Group();lg.position.set(-1,.25,0);G.g.add(lg);G.g.children.filter(c=>c!==lg&&c.position.x<-.1).forEach(c=>lg.attach(c));const LR=.25*s,LZ=1.0*s,LY=.25*s;
  const R=addPet(S,RP('pet:bear'));R.root2.position.z=LZ;const fr=R.legs.map((l,i)=>i).filter(i=>R.legs[i].front);const hx=Math.min(...R.legs.filter(l=>!l.front).map(l=>l.x));
  const push=(P,a)=>{P.root=Object.assign(P.root||{},{rz:.18,piv:[hx,0,0]});fr.forEach(i=>{P.hip[i]=(P.hip[i]||0)*.3+a;P.knee[i]=-.35;});P.hp=-.2;return P;};
  let a=.3,best=9,ba=a,off=0;for(;a<2.2;a+=.03){const P={hip:[],knee:[]};push(P,a);R.root2.position.x=0;RIG.pose(R,P);const p=tipW(R,fr[0]);const dy=p.y-(LY+LR*.72);if(Math.abs(dy)<best){best=Math.abs(dy);ba=a;off=p.x+Math.sqrt(Math.max(0,LR*LR-(p.y-LY)**2));}}
  dbg('bear push hip',ba,'off',off,'err',best);const X0=-1.9,D=1.9;const prog=t=>seg(t,.06,.46)*(1-seg(t,.58,.94));const C=camAt(-.3,.65,.9,1.75,.3,.3);
  return {S,C,tick:t=>{const pr=prog(t);const bx=X0+D*pr;const mv=bell(t,.06,.46)+bell(t,.58,.94);const P={hip:[],knee:[]};RIG.gait(R,P,'walk',(bx-X0)/RIG.stride(R,.3,1),.3*Math.min(1,mv*1.5),.8*Math.min(1,mv*1.5));push(P,ba);
    const rest=bell(t,.47,.57);if(rest){P.hy=-.5*rest;P.hp+=.2*rest;}R.root2.position.x=bx;RIG.pose(R,P);const lx=bx+off;lg.position.z=lx/s;lg.rotation.x=(lx)/LR;}};});}
function gCapy(){return cell('Capybara: warm bath','hops in, soaks, relaxes',()=>{const S=world();const s=1.35;const G=gear(S,'train:capybara',{},s,0,0,0,0);
  const yz=G.g.children.filter(c=>c.isMesh&&Math.abs(c.position.y-.43)<.01);
  const R=addPet(S,RP('age:capybara'));const sp=spec(R,'age:capybara');const d1=RIG.stride(R,sp.A,1);const X0=-3.0,X1=-1.75,XI=-.1,wy=.425*s;const sink=wy-.5*R.H;
  const C=camAt(-.8,.55,0,1.65,.45,.3);
  return {S,C,tick:t=>{let P={},x,y=0;if(t<.24){x=X0+(X1-X0)*(t/.24);P=walkP(R,sp,(x-X0)/d1,P,1);}
    else if(t<.42){x=X1;const c=bell(t,.24,.3);if(c)lieP(R,.3*c,P);const u=cl((t-.29)/.13);if(u>0){x=X1+(XI-X1)*ease(u);y=jumpArc(u,0,1,1.05)+sink*ease(cl((u-.5)/.5));if(u<1)jumpLegs(R,P,u,1);}}
    else{x=XI;y=sink;const st=seg(t,.42,.5);lieP(R,.8*st,P);y=sink;P.hp=(P.hp||0)-.05+.12*st*S2(t*1.5);P.hy=-.3*st*bell(t,.5,1);P.br=.03*S2(t*3);}
    R.root2.position.set(x,y,0);R.shadow.visible=t<.33;Object.assign(P,{floor:t<.3});RIG.pose(R,P);if(t>=.42){const top=boxW(R).max.y;const want=wy+.42*R.H;const dy=want-top;const k=seg(t,.42,.48);R.root2.position.y+=dy*k+(1-k)*0;RIG.pose(R,P);}
    yz.forEach((m,i)=>{m.position.y=.43+.012*S2(t*2+i*.3);});}};});}
function gDuck(){return cell('Duck: ramp and splash tub','waddles up, splashes in, paddles',()=>{const S=world();const s=1.2;gear(S,'train:duck',{},s,0,0,0,0);
  const R=addPet(S,RP('age:duck'));const sp=spec(R,'age:duck');const ta=Math.tan(Math.atan2(.32,1.0));const ry=x=>{const m=x/s;return m<-.95?0:m>.05?(.16+.026+.5*.32)*s:s*(.16+.026+(m+.45)*ta);};
  const X0=-2.1,XT=.0,XW=.6*s;const top=.3*s;const drops=[];for(let i=0;i<8;i++){const d=H.prop(S,new THREE.SphereGeometry(.035,8,6),'#bfe9ff',0,-1,0);drops.push(d);}
  const C=camAt(-.55,.45,0,1.5,.5,.32);const d1=RIG.stride(R,sp.A,1);
  return {S,C,tick:t=>{let P={},x,y;if(t<.5){x=X0+(XT-X0)*(t/.5);y=ry(x);P=walkP(R,sp,(x-X0)/d1*.9,P,1);P.root.rx=(P.root.rx||0)+.08*S2(t*6);}
    else if(t<.64){const u=seg(t,.5,.64);x=XT+(XW-XT)*u;y=ry(XT)*(1-u)+(top-.05)*u+jumpArc(u,0,1,.35);P.wing=[.9*Math.sin(P_*u),.9*Math.sin(P_*u)];birdLie(R,.6*Math.sin(P_*u)+(u>.5?.4*(u-.5)*2:0),P);}
    else{x=XW;const b=seg(t,.64,.7);y=top-.12+.015*S2(t*4);birdLie(R,1,P);P.ty=.5*S2(t*10)*b;P.hp=.15*S2(t*2)-.25*bell(t,.78,.86);P.wing=[.15*bell(t,.64,.72),.15*bell(t,.64,.72)];}
    R.root2.position.set(x,y,0);RIG.pose(R,P);
    const sp2=cl((t-.63)/.16);drops.forEach((d,i)=>{const a=i/8*TAU;if(sp2>0&&sp2<1){d.visible=true;d.position.set(XW+Math.cos(a)*.45*sp2,top+.03+.5*sp2*(1-sp2)*1.6,Math.sin(a)*.45*sp2);}else d.visible=false;});}};});}
function gOwl(){return cell('Owl: perch and flight hoops','flies through both hoops, back to its perch',()=>{const S=world();const s=1.7;gear(S,'train:owl',{},s,0,0,0,0);
  const R=addPet(S,RP('age:owl'));const bc=R.bodyC;const perchY=1.5*s,yh=1.42*s,hx=[.85*s,1.55*s];const P0=new THREE.Vector3(-.35*s,perchY+bc.y,0);
  const curve=new THREE.CatmullRomCurve3([P0,new THREE.Vector3(.35,yh+.08,0),new THREE.Vector3(hx[0],yh,0),new THREE.Vector3(hx[1],yh,0),new THREE.Vector3(3.6,yh+.15,-.5),new THREE.Vector3(3.3,yh+.45,-1.9),new THREE.Vector3(.7,yh+.6,-2.4),new THREE.Vector3(-1.8,yh+.5,-1.7),new THREE.Vector3(-2.3,yh+.45,-.4),new THREE.Vector3(-1.5,perchY+bc.y+.35,0)],true,'centripetal');
  const C=camAt(.6,1.8,-.8,2.3,.95,.2);
  return {S,C,tick:t=>{const fl=seg(t,.1,.17)*(1-seg(t,.86,.93));const u=cl((t-.12)/.78);const p=u>0&&u<1?curve.getPointAt(u):P0.clone();const tg=u>0&&u<1?curve.getTangentAt(u):new THREE.Vector3(1,0,0);
    const inHoop=hx.some(h=>Math.abs(p.x-h)<.55)&&Math.abs(p.z)<.4;const P={hip:[],knee:[]};
    if(fl>0){const fw=inHoop?0:.25+1.0*Math.max(0,S2(t*10));P.wing=[fw*fl,fw*fl];R.legs.forEach((l,i)=>{P.hip[i]=-1.1*fl;P.knee[i]=.6*fl;});P.root={rz:-1.15*fl*(inHoop?1.05:1),piv:[bc.x,bc.y,0]};P.hp=1.0*fl;}
    else{P.hy=.5*bell(t,.0,.09)-.4*bell(t,.93,1);P.br=.03*S2(t*2);}
    const hd=Math.atan2(-tg.z,tg.x)*fl;P.floor=false;R.root2.position.set(p.x-bc.x,p.y-bc.y,p.z);R.root2.rotation.y=hd;RIG.pose(R,P);C.set(.4+.45*(p.x-.4),1.75+.3*(p.y-1.8),-.5+.4*p.z);}};});}
function gSnake(){return cell('Snake: basket and flute','rises from its basket and sways',()=>{const S=world();const s=1.3;gear(S,'train:snake',{},s,0,0,0,0);
  const R=mk('pet:snake',{},'spine');S.add(R.root2);const top=.48*s;const C=camAt(0,.55,0,.95,.35,.2);
  return {S,C,tick:t=>{const up=seg(t,.04,.3)*(1-seg(t,.82,.97));const P={floor:false,spine:{a:.06*up,k:.9,ph:TAU*3*t,ax:'z'},hp:-1.25*up,root:{rz:P_/2,piv:[0,0,0]}};
    R.root2.rotation.y=-P_/2;R.root2.position.set(0,top-R.B.max.x-.04+(R.L*.55)*up,0);RIG.pose(R,P);}};});}
CLIPS2.yardGear={title:'Yard training gear: each pet uses its own',cols:4,cw:330,ch:280,frames:48,cells:[gDog(),gBunny(),gCat(),gHamster(),gMonkey(),gSeal(),gBear(),gCapy(),gDuck(),gOwl(),gSnake()]};
})();
