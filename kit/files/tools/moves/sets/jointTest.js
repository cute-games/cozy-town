(()=>{const H=window.MVH;const {cell,stage,jGround,legAng,seg,bell,cl,ease,S2,P_,TAU,dbg}=H;
/* Knees or not? Left = the game puppy today (one-piece legs: hips, body, head, tail only). Right = jointed puppy (pet:dogjoint): knees/hocks too. Rigid pieces only. */
const COL=PET_TYPES.dog.cols[0];
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
/* push a group's own (non-uniform) scale into its direct meshes and child groups' own scale, so child rotations stay rigid (no shear) */
function pushScale(g){const s=g.scale.clone();if(s.x===1&&s.y===1&&s.z===1)return;g.scale.set(1,1,1);
  g.children.forEach(c=>{c.position.multiply(s);c.scale.multiply(s);});}
function build(kind){const m=kind==='joint'?dogJoint(COL):makePet('dog',COL);puAge(m,'baby');
  pushScale(m.b);                       // body widening goes onto the body box and each part's own scale
  if(kind==='joint'){m.legs.forEach(pushScale);if(m.neck)pushScale(m.neck);}   // so knees and head turn rigidly
  const root2=new THREE.Group(),turn=new THREE.Group();turn.rotation.y=P_/2;turn.add(m.root);root2.add(turn);root2.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(root2);const snap=g=>g?{p:g.position.clone(),r:g.rotation.clone()}:null;
  const R={m,root2,turn,kind,L:bb.max.x-bb.min.x,H:bb.max.y-bb.min.y,W:bb.max.z-bb.min.z};
  R.rest={b:snap(m.b),neck:snap(m.neck),head:snap(m.head),tail:snap(m.tail),legs:m.legs.map(snap),lower:(m.lower||[]).map(snap),ears:(m.ears||[]).map(snap)};
  R.front=m.legs.map(l=>l.position.z>0);R.bodyM=m.b.children.filter(c=>c.isMesh);
  R.legW=.2*PU_AGES.baby.leg*m.root.scale.y; // leg length in world units (both dogs: .2 model units)
  return R;}
function reset(R){const m=R.m,rs=R.rest,put=(g,s)=>{if(g&&s){g.position.copy(s.p);g.rotation.copy(s.r);}};put(m.b,rs.b);put(m.neck,rs.neck);put(m.head,rs.head);put(m.tail,rs.tail);
  m.legs.forEach((g,i)=>put(g,rs.legs[i]));(m.lower||[]).forEach((g,i)=>put(g,rs.lower[i]));(m.ears||[]).forEach((g,i)=>put(g,rs.ears[i]));R.turn.position.y=0;}
function minY(R,objs){R.root2.updateMatrixWorld(true);let y=1e9;const bx=new THREE.Box3();objs.forEach(o=>{bx.setFromObject(o);if(bx.min.y<y)y=bx.min.y;});return y;}
const FL=R=>R.m.legs.filter((l,i)=>R.front[i]),HL=R=>R.m.legs.filter((l,i)=>!R.front[i]);
/* increasing f: root of f between lo and hi (clamped) */
function solve(f,lo,hi){let a=lo,b=hi;if(f(a)>=0)return a;if(f(b)<=0)return b;for(let k=0;k<18;k++){const c=(a+b)/2;if(f(c)<0)a=c;else b=c;}return (a+b)/2;}
/* set leg i by world angles (+ = foot back); one-piece legs use only the upper angle */
function legW(R,i,aU,aL){const p=R.m.b.rotation.x;R.m.legs[i].rotation.x=aU-p;if(R.m.lower&&aL!==undefined)R.m.lower[i].rotation.x=aL-aU;}
const J=R=>R.kind==='joint';
function lay(R,y){jGround(R);R.turn.position.y+=y||0;}

/* ---------- moves ---------- */
const OFF=[.25,.75,0,.5];
function walkLegs(R,ph,A,fold,flexF,flexH){R.m.legs.forEach((l,i)=>{const p=((ph+OFF[i])%1+1)%1,a=legAng(p,A);const sw=p>=.62?Math.sin(P_*(p-.62)/.38):0;
  if(J(R)){const fr=R.front[i];const up=a+fold,lo=a+fold-2*fold;   // a slight crouch (fold) keeps the paw under the hip
    legW(R,i,up+(fr?-.15:.25)*sw,lo+(fr?flexF:-flexH)*sw);}else legW(R,i,a);});}
function walkCell(R,f,A,t,sad){const m=R.m,ph=f*t;
  if(sad){m.b.position.y+=-.0*1;}
  walkLegs(R,ph,A,sad&&J(R)?.28:0,sad?.9:1.25,sad?.8:1.05);
  m.b.position.y+=(sad?.006:.012)*Math.cos(TAU*2*ph);m.b.rotation.z=(sad?.03:.05)*Math.sin(TAU*ph);
  if(sad){if(J(R)){m.neck.rotation.x=.42;m.head.rotation.x=.0+.05*Math.sin(TAU*2*ph+.6);m.ears.forEach(e=>e.rotation.x=-.3);}else m.head.rotation.x=.38+.05*Math.sin(TAU*2*ph+.6);
    m.tail.rotation.x=-1.55;m.tail.rotation.z=.08*Math.sin(TAU*ph);}
  else{m.head.rotation.x+=.08*Math.sin(TAU*2*ph+.5);m.tail.rotation.z=.45*Math.sin(TAU*2*ph*1.5);if(J(R))m.ears.forEach((e,k)=>e.rotation.x=-.12+.18*Math.sin(TAU*2*ph+.9));}
  legsPass(R);lay(R);}
function legsPass(R){} // (hook)
/* play bow: front end down, rump up, tail wagging */
function bowPose(R,k,wig){const m=R.m;if(k<=0)return;const th=(J(R)?.4:.26)*k;m.b.rotation.x=th;
  m.legs.forEach((l,i)=>{if(!R.front[i])legW(R,i,0,0);});
  if(J(R)){const g=-1.35*k;const f=x=>{FL(R).forEach(l=>{const i=m.legs.indexOf(l);legW(R,i,x,g);});return minY(R,FL(R))-minY(R,HL(R));};solve(f,0,1.5);}
  else{const f=x=>{FL(R).forEach(l=>{const i=m.legs.indexOf(l);legW(R,i,-x);});return minY(R,FL(R))-minY(R,HL(R));};solve(f,0,1.5);}
  if(J(R)){m.neck.rotation.x=-.45*k;m.head.rotation.x=-.05*k;m.ears.forEach(e=>e.rotation.x=-.3*k);}else m.head.rotation.x=-.4*k;
  m.tail.rotation.x=-.3*k;m.tail.rotation.z=.6*wig;m.b.rotation.z=.04*wig*k;}
/* crouch: knees fold, paws stay under the hips (jointed only) */
function crouch(R,k){if(!J(R)||k<=0)return;const p=.75*k;R.m.legs.forEach((l,i)=>legW(R,i,p,-p));}
function airPose(R,u){const m=R.m;const s=Math.sin(P_*u);m.b.rotation.x=-.22*Math.cos(P_*u);
  m.legs.forEach((l,i)=>{const fr=R.front[i];if(J(R))legW(R,i,(fr?-.7:.75)*s,(fr?.6:-.35)*s);else legW(R,i,(fr?-.7:.75)*s);});
  if(J(R))m.ears.forEach(e=>e.rotation.x=-.6*s);m.tail.rotation.x=-.4*s;}
function playCell(R,t,st){const m=R.m;const bk=seg(t,.04,.18)*(1-seg(t,.34,.44));const wig=Math.sin(TAU*8*t)*bell(t,.16,.38);bowPose(R,bk,wig);let y=0;
  for(const [a,b] of [[.5,.66],[.74,.9]]){const c=bell(t,a-.06,a),u=cl((t-a)/(b-a)),ld=bell(t,b,b+.06);
    if(u>0&&u<1){airPose(R,u);y=4*R.H*.32*u*(1-u);}else if(c>0||ld>0){crouch(R,c+ld);m.b.rotation.x=.08*(c+ld)*(J(R)?1:0);}}
  if(bk<=0)m.tail.rotation.z+=.5*Math.sin(TAU*10*t);
  lay(R,y);}
/* sit down, wag, stand up */
function sitPose(R,k){const m=R.m;if(k<=0)return;
  // body tilt: rump to the ground with front legs straight and vertical
  const fv=()=>FL(R).forEach(l=>legW(R,m.legs.indexOf(l),0,0));
  const hindFold=x=>HL(R).forEach(l=>{const i=m.legs.indexOf(l);if(J(R))legW(R,i,.95*x,-1.3*x);else legW(R,i,-x);});
  if(R.thS===undefined){m.b.rotation.x=0;R.thS=solve(x=>{m.b.rotation.x=-x;fv();hindFold(1.5);return minY(R,FL(R))-minY(R,R.bodyM);},0,1);dbg('thS',R.kind,R.thS,'legW',R.legW,'H',R.H);}
  m.b.rotation.x=-R.thS*k;fv();
  solve(x=>{hindFold(x);return minY(R,HL(R))-minY(R,FL(R));},0,J(R)?1.25:1.5);
  if(J(R))m.neck.rotation.x=R.thS*k*.85;else m.head.rotation.x=R.thS*k*.85;
  m.tail.rotation.x=.5*k;}
function sitCell(R,t){const m=R.m;const k=ease(seg(t,.1,.3))*(1-ease(seg(t,.72,.9)));sitPose(R,k);const on=bell(t,.32,.7);
  m.head.rotation.z=.22*on*Math.sin(P_*cl((t-.38)/.24));m.tail.rotation.z=.55*on*Math.sin(TAU*7*t);if(J(R))m.ears.forEach((e,i)=>e.rotation.x=-.25*on*(i?1:.3));
  lay(R);}

const ROWS=[
 ['Walk','',{zoom:.7,cy:.4,yaw:.32,pitch:.06},(R,t)=>walkCell(R,4,.42,t,false),R=>4*2*R.legW*Math.sin(.42)*.95],
 ['Play','bow + 2 hops',{zoom:.85,cy:.7,yaw:.32,pitch:.06},(R,t)=>playCell(R,t),null],
 ['Sit','down, wag, up',{zoom:.7,cy:.4,yaw:.08,pitch:.08},(R,t)=>sitCell(R,t),null],
 ['Sad walk','slow, head + tail low',{zoom:.7,cy:.4,yaw:.32,pitch:.06},(R,t)=>walkCell(R,2,.28,t,true),R=>2*2*R.legW*Math.sin(.28)*.95]];
const cells=[];
ROWS.forEach(([name,sub,so,tickF,distF])=>{for(const kind of ['today','joint'])cells.push(cell((kind==='today'?'Today: ':'Knees: ')+name,kind==='today'?(sub||'one-piece legs'):(sub||'knees + hocks bend'),()=>{
  const R=build(kind);const ref=build('today');R.L=ref.L;R.H=ref.H;R.W=ref.W; // same camera for both
  const st=stage(R,so);const D=distF?distF(R):0;if(D)st.fit(D);
  return {S:st.S,C:st.C,tick:t=>{reset(R);tickF(R,t);if(D)st.setDist(D*t);}};}));});
CLIPS2.jointTest={title:'Knees or not: today puppy vs jointed puppy',cols:2,cw:340,ch:270,frames:48,cells};
})();
