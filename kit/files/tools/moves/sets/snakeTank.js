(()=>{const H=window.MVH;const {cell,seg,bell,cl,ease,TAU,P_}=H;
/* Snake + the real terrarium (c15 PU['home:tank'], built as is, not scaled): W 2.5, D .9, gravel top .18, front glass lip z .42-.45 up to y .29,
   half-log hide axis along z at x -.6 (r .44, z -.25..+.41, rim at z .41, opens front and back), water x .25-.85 z .03-.33,
   rocks at x -.75/-.1/.15 z -.12 (the -.75 one lies inside the hide), branch low end back left, plants at the back.
   Snake = pet:snake (38 segment groups + head). Every piece moves rigidly along ONE path (follow-the-leader), c15 snakeAlong spacing.
   Sleep = the c15 snakeCoil spiral (two rings, r .06 -> .29, inner ring raised .13, head on top) laid inside the hide as the END of the path:
   the head crawls the spiral inwards and the body follows into the coil; to wake it crawls out over its own rings. The outer ring rests over the rock inside the hide. */
const TW=2.5,FZ=.47,GY=.18,LIPT=.29,RS=.056;
function floorTex(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#d4ad80';x.fillRect(0,0,256,256);
  for(let i=0;i<8;i++){x.fillStyle=i%2?'#cfa678':'#d8b386';x.fillRect(0,i*32,256,32);x.fillStyle='#b88f63';x.fillRect(0,i*32,256,2);x.fillRect(((i*97)%200)+20,i*32,2,32);}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(8,8);return t;}
function room(){const S=new THREE.Scene();S.background=new THREE.Color('#2a2638');S.add(new THREE.HemisphereLight('#ffffff','#e6d8f0',.7));const D=new THREE.DirectionalLight('#fff3e0',.5);D.position.set(2.5,5,4);S.add(D);
  const f=new THREE.Mesh(new THREE.PlaneGeometry(16,16),new THREE.MeshLambertMaterial({map:floorTex()}));f.rotation.x=-P_/2;f.position.y=-.001;S.add(f);return S;}
function tank(S){const g=new THREE.Group();PU['home:tank'].build(g,Object.assign({},PU['home:tank'].dflt));S.add(g);return g;}
/* ---------- the one path ---------- */
/* centre height of a body piece of radius RS over z: gravel inside, smooth arch over the lip, floor outside */
function cz(z){const gin=GY+.85*RS,top=LIPT+.85*RS+.05,gout=.85*RS;
  if(z<=.31)return gin;if(z<.40)return gin+(top-gin)*ease((z-.31)/.09);if(z<=.48)return top;if(z<.85)return top+(gout-top)*ease((z-.48)/.37);return gout;}
const IN=[[.95,.10],[.96,-.04],[.93,-.15],[.86,-.18],[.50,-.20],[.34,-.222],[.26,-.255],[.20,-.292],[.10,-.32],[-.10,-.325],[-.24,-.33],[-.305,-.29],[-.31,-.10],[-.309,-.02]];
const OUT=[[-.54,.12],[-.55,.20],[-.58,.32],[-.6,.45],[-.6,.80],[-.5,1.20],[-.233,1.723],[.29,1.94],[.813,1.723],[.95,1.20],[.95,.80],[.95,.45],[.95,.30]];
const CC=[-.6,.06],KC=105;   /* coil centre and steps (as snakeCoil: .12 rad and r +.0022 per step; 105 steps = 2 turns, so it starts and ends heading +z) */
const ROCK=[-.75,.19,-.12,.154,.066,.11];
function rockY(x,z){const q=1-((x-ROCK[0])/(ROCK[3]+RS))**2-((z-ROCK[2])/(ROCK[5]+RS))**2;return q>0?ROCK[1]+(ROCK[4]+.85*RS+.006)*Math.sqrt(q):0;}
function spiral(){const o=[];for(let k=KC;k>=0;k--){const r=.06+.0022*k,f=.12*(KC-k);const x=CC[0]+r*Math.cos(f),z=CC[1]+r*Math.sin(f);o.push([x,GY+.85*RS+.13*Math.max(0,1-(r-.06)/.13),z]);}return o;}
function cr(P,n){const out=[];const pt=i=>P[Math.max(0,Math.min(P.length-1,i))];
  for(let i=0;i<P.length-1;i++){const p0=pt(i-1),p1=pt(i),p2=pt(i+1),p3=pt(i+2);const d=(a,b)=>Math.pow(Math.hypot(b[0]-a[0],b[1]-a[1])||1e-4,.5);
    const t0=0,t1=t0+d(p0,p1),t2=t1+d(p1,p2),t3=t2+d(p2,p3);
    for(let k=0;k<n;k++){const t=t1+(t2-t1)*k/n;const L=(a,b,ta,tb)=>[0,1].map(j=>(tb-t)/(tb-ta)*a[j]+(t-ta)/(tb-ta)*b[j]);
      const A1=L(p0,p1,t0,t1),A2=L(p1,p2,t1,t2),A3=L(p2,p3,t2,t3),B1=L(A1,A2,t0,t2),B2=L(A2,A3,t1,t3);out.push(L(B1,B2,t1,t2));}}
  out.push(P[P.length-1]);return out;}
/* waking: the head climbs out of the coil centre over its own rings (the inner ring is raised .13, so it first rises to .21, then settles to .13 = the lip height) */
const bp=d=>d<.06?.13:d<.11?.13+.08*ease((d-.06)/.05):d<.16?.21:d<.24?.21-.08*ease((d-.16)/.08):.13;
const trav=(W,bridge)=>{let br=bridge;return cr(W,40).map(p=>{if(p[1]>.5)br=false;return [p[0],Math.max(cz(p[1]),br?GY+.85*RS+bp(Math.hypot(p[0]-CC[0],p[1]-CC[1])):0),p[1]];});};
const SP=spiral();
let PTS=[...trav([[.95,.30],...IN,[SP[0][0],SP[0][2]]]),...SP.slice(1)];const JS0=PTS.length-1;
PTS.push(...trav([[SP[SP.length-1][0],SP[SP.length-1][2]],...OUT,...IN,[SP[0][0],SP[0][2]]],true).slice(1),...SP.slice(1));
/* the coil's outer ring rests over the rock: lift onto it, then soften the bump (max filter + average, never lower than needed) */
{const raw=PTS.map(p=>Math.max(p[1],rockY(p[0],p[2])));const w=6;const mx=raw.map((_,i)=>{let m=0;for(let j=-w;j<=w;j++)m=Math.max(m,raw[cl(i+j,0,raw.length-1)]);return m;});
  PTS=PTS.map((p,i)=>{let a=0,n=0;for(let j=-w;j<=w;j++){a+=mx[cl(i+j,0,raw.length-1)];n++;}return [p[0],Math.max(raw[i],a/n),p[2]];});}
const CUM=[0];for(let i=1;i<PTS.length;i++){const a=PTS[i-1],b=PTS[i];CUM.push(CUM[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]));}
const LEN=CUM[CUM.length-1];
function at(s){s=cl(s,0,LEN);let lo=0,hi=CUM.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(CUM[m]<=s)lo=m;else hi=m;}const a=PTS[lo],b=PTS[hi],u=(s-CUM[lo])/((CUM[hi]-CUM[lo])||1);
  return {p:[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u],d:[b[0]-a[0],b[1]-a[1],b[2]-a[2]]};}
const sNear=(x,z,from)=>{let best=1e9,bs=0;for(let i=0;i<PTS.length;i++){if(from!=null&&CUM[i]<from)continue;const d=Math.hypot(PTS[i][0]-x,PTS[i][2]-z);if(d<best-1e-9){best=d;bs=CUM[i];}}return bs;};
const S0=CUM[JS0],SA=sNear(.95,1.25,S0+1),SB=LEN-1e-4;
/* ---------- the snake ---------- */
function snake(S){const m=puPet('snake',null,'adult');S.add(m.root);const rad=m.segs.map(g=>g.position.y);const off=[];{let s=.09;rad.forEach((r,i)=>{if(i)s+=Math.min(.055,1.55*r);off.push(s);});}
  const tongue=[];m.head.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHexString()==='ff4d6d')tongue.push([o,o.position.z]);});
  /* sleeping eyes: a head-coloured lid over each eye with a dark closed-eye line (the capy lid recipe in shopSpots), shown only when asleep */
  const lids=[];{const hm=m.head.children.find(q=>q.isMesh&&q.geometry.type==='SphereGeometry'&&q.material.side!==THREE.BackSide);const col=hm?hm.material.color:new THREE.Color('#7a5ac8');
    m.head.children.forEach(q=>{if(!(q.isMesh&&q.material.color&&q.material.color.getHexString()==='ffe680'&&q.material.side!==THREE.BackSide))return;const r=q.geometry.parameters.radius*Math.max(q.scale.x,q.scale.y,q.scale.z);const sx=Math.sign(q.position.x);
      const L=new THREE.Group();L.position.copy(q.position);m.head.add(L);const lid=new THREE.Mesh(new THREE.SphereGeometry(r*1.15,14,10),new THREE.MeshLambertMaterial({color:col}));L.add(lid);
      const ln=new THREE.Mesh(new THREE.BoxGeometry(.006,.006,r*1.9),new THREE.MeshBasicMaterial({color:'#1d1622'}));ln.position.set(sx*r*.75,r*.75,0);ln.rotation.z=-sx*.75;L.add(ln);L.visible=false;lids.push(L);});}
  const sh=new THREE.Mesh(new THREE.CircleGeometry(.075,18),new THREE.MeshBasicMaterial({color:'#000',transparent:true,opacity:.2,depthWrite:false}));sh.rotation.x=-P_/2;sh.scale.set(1,1.3,1);S.add(sh);
  m.segs.forEach(g=>g.rotation.order='YXZ');m.head.rotation.order='YXZ';
  /* place: head at arclength sH; lift = head/neck raise; look = head yaw offset; tg = tongue out 0..1; br = breathing */
  function place(sH,o){o=o||{};const lift=o.lift||0;
    const put=(g,s,hh,ex,rz)=>{const a=at(s);const [dx,dy,dz]=a.d;const hz=Math.hypot(dx,dz)||1e-6;const th=Math.atan2(dy,hz);const lo=Math.hypot(hh*Math.cos(th),rz*Math.sin(th));g.position.set(a.p[0],a.p[1]-.85*RS+lo+(ex||0),a.p[2]);g.rotation.set(-th,Math.atan2(dx,dz),0);};
    m.segs.forEach((g,i)=>{const k=cl(1-i/6);put(g,sH-off[i],.85*rad[i],lift*k*k+(o.br?o.br(i):0),1.45*rad[i]);if(lift>0&&i<6){g.rotation.x+=-Math.atan(lift*2/(.055*6))*(i<5?.5:.2)*k;}});
    put(m.head,sH,.047,lift*1.05,.109);m.head.rotation.x=cl(m.head.rotation.x,-.45,.45);{const a=at(sH);sh.position.set(a.p[0],a.p[1]-.85*RS+.004,a.p[2]);sh.rotation.z=m.head.rotation.y;sh.material.opacity=a.p[1]>GY+.85*RS+.01?0:.12+.6*Math.min(lift*1.05,.1);}m.head.rotation.x+=-(o.pitch||0);m.head.rotation.y+=o.look||0;
    tongue.forEach(([q,z0])=>q.position.z=z0-.1*(1-(o.tg||0)));lids.forEach(L=>L.visible=!!o.shut);if(o.hb)m.head.position.y+=o.hb;}
  return {m,place,rad,off,lids};}
/* ---------- cameras ---------- */
function camAt(tx,ty,tz,d,yaw,pitch,asp){const C=new THREE.PerspectiveCamera(32,asp||1.5,.05,80);C.position.set(tx+Math.sin(yaw)*Math.cos(pitch)*d,ty+Math.sin(pitch)*d,tz+Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(tx,ty,tz);C.updateProjectionMatrix();return C;}
const CW=440,CH=340,ASP=CW/(CH-40);
function base(){const S=room();tank(S);const sn=snake(S);return {S,sn};}
const flick=u=>{const f=(u*3)%1;return f<.35?Math.sin(P_*f/.35):0;};
/* cells 1 and 4: the full round, seamless: asleep -> wakes, head up -> out over the lip -> head up, looks left and right -> back in over the lip -> into the hide -> asleep */
function roundPose(sn,t){const shut=t<.03||t>.965;
  const up=.09*seg(t,.03,.08)*(1-seg(t,.11,.15))+.22*seg(t,.46,.5)*(1-seg(t,.62,.66));const glide=.03*seg(t,.22,.26)*(1-seg(t,.43,.47))+.03*seg(t,.64,.68)*(1-seg(t,.9,.94));
  const s=t<.5?S0+(SA-S0)*seg(t,.15,.46):SA+(SB-SA)*seg(t,.66,.93);
  const look=.9*seg(t,.06,.08)*(1-seg(t,.1,.12))*0+(-1.2*seg(t,.5,.53)*(1-seg(t,.555,.585))+1.2*seg(t,.555,.585)*(1-seg(t,.61,.64)));
  const tg=t>.05&&t<.11?flick((t-.05)/.06):t>.53&&t<.555?flick((t-.53)/.025*.34):t>.585&&t<.61?flick((t-.585)/.025*.34):0;
  const pitch=-.12*(1-seg(t,0,.04))-.12*seg(t,.93,.965)+.3*seg(t,.03,.08)*(1-seg(t,.11,.15))+.3*seg(t,.46,.5)*(1-seg(t,.62,.66));
  sn.place(s,{lift:up+glide,look,tg,pitch,shut});}
function outPose(sn,t){roundPose(sn,t);}
/* cell 2: back in. .0-.06 tongue; .06-.80 slides in (eased); .80-.92 settles (head down); Zzz from .9 */
function inPose(sn,t){const s=SA+(SB-SA)*seg(t,.06,.8);const lift=.03*(1-seg(t,.8,.9))*seg(t,0,.06);sn.place(s,{lift,tg:t<.06?flick(t/.06):0,pitch:-.12*seg(t,.82,.92),shut:t>.93});}
const br=t=>i=>(i>=0&&i<32)?.012*(.5+.5*Math.sin(TAU*2*t-i*.15))*(0.4+0.6*Math.sin(P_*Math.min(1,(i+2)/30))):0;
const set={title:'Snake and its terrarium',cols:2,cw:CW,ch:CH,frames:108,cells:[
 cell('Out of the tank','wakes, out over the lip, looks, back in',()=>{const {S,sn}=base();const C=camAt(.25,.25,.7,4.9,.38,.42,ASP);return {S,C,tick:t=>outPose(sn,t)};}),
 cell('Back in','over the lip, into the hide, sleeps',()=>{const {S,sn}=base();const C=camAt(.15,.25,.6,4.7,.22,.62,ASP);const z=H.zzz(S,-.42,.40,.30,.09);return {S,C,tick:t=>{inPose(sn,t);z(((t-.9)/.1)*.5,t>.9);}};}),
 cell('Sleeping in the hide','coiled up, slow breathing',()=>{const {S,sn}=base();const C=camAt(-.57,.33,.1,1.6,.12,.28,ASP);const z=H.zzz(S,-.42,.38,.30,.1);return {S,C,tick:t=>{sn.place(SB,{pitch:-.12,br:br(t),shut:true,hb:.006*Math.sin(TAU*2*t)});z(t);}};}),
 cell('Free spot','1.5 free in front of the tank',()=>{const {S,sn}=base();
   const r=new THREE.Mesh(new THREE.PlaneGeometry(TW,1.5),new THREE.MeshBasicMaterial({color:'#fff6c9',transparent:true,opacity:.5,depthWrite:false}));r.rotation.x=-P_/2;r.position.set(0,.004,FZ+.75);S.add(r);
   const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(TW,1.5)),new THREE.LineBasicMaterial({color:'#ffd23f'}));e.rotation.x=-P_/2;e.position.set(0,.006,FZ+.75);S.add(e);
   const C=camAt(0,0,.75,6.2,.3,1.1,ASP);return {S,C,tick:t=>outPose(sn,t)};})]};
set._dbg={at,PTS,CUM,LEN,S0,SA,SB,snake,outPose,inPose,br,base};
CLIPS2.snakeTank=set;})();
