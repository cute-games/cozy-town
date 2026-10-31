/* packTest — built file: movespack/moves-pack.js (copied in unchanged) + movespack/zpackTest.body.js. Rebuild: movespack/build.sh */
/* Cozy Town moves pack (31 Oct 2026, round 3: every approved preview, Pet Show tricks, toy play, farm feeding) — window.COZY_MOVES
   Every approved movement, written for the game's own models (three.js r128, no imports).
   Rules it keeps (Karolis): parts move only as rigid pieces at their joints (group rotations and positions, never a bent mesh);
   feet stay on the ground (ground fix by bounding box after every pose); knees bend only on models that have lower[] groups.

   Use:   COZY_MOVES.play(model, 'pet.walk', tSeconds, {dist, kind, mood})  ->  {lift, done, name}
          model = what the builders return: {root, b, legs[], lower[]?, neck?, head, tail, ears[]?, rear[]?, segs[]?, arms[]?}
          t     = seconds since this move started (send name + start time online: friends get the same pose)
   Every move: resets the model to its rest pose, sets its groups, puts the lowest point on the ground (root y = floor),
   then lifts the body for jumps. A missing group is skipped, never an error.                                              */
(function(){
'use strict';
const PI=Math.PI,TAU=2*PI;
/* ---------- core: time helpers ---------- */
const cl=(x,a=0,b=1)=>x<a?a:x>b?b:x;
const ease=x=>{x=cl(x);return x*x*(3-2*x);};
const seg=(t,a,b)=>ease((t-a)/(b-a));                                   /* 0 → 1 between a and b, eased */
const bell=(t,a,b)=>{const u=(t-a)/(b-a);return u<=0||u>=1?0:Math.sin(PI*u);};   /* 0 → 1 → 0 between a and b */
const S1=x=>Math.sin(TAU*x);
const frac=x=>x-Math.floor(x);
const arc=(t,a,b,h)=>{const u=(t-a)/(b-a);return u>0&&u<1?4*h*u*(1-u):0;};       /* jump height: a parabola from a to b */
/* phase clock: one loop of length dur seconds → 0..1 */
const clock=(t,dur)=>frac(t/dur);
/* planted-foot leg angle (rotation.x, + = foot back): the foot sweeps back at an even speed while on the ground (62% of the step), then swings forward */
const STANCE=.62;
function legAng(ph,A){ph=frac(ph);if(ph<STANCE)return -A+2*A*(ph/STANCE);const u=(ph-STANCE)/(1-STANCE);return A-2*A*ease(u);}
/* how much a knee bends in the step: 0 on the ground, 1 at mid-swing */
function swingK(ph){ph=frac(ph);return ph<STANCE?0:Math.sin(PI*(ph-STANCE)/(1-STANCE));}

/* ---------- per-type settings (the "settings per type" of the shared set) ---------- */
/* A: leg swing (rad); f: steps per second when no distance is given; gait: walk|trot|bound|waddle|hop|bob|galumph|slither;
   wag: tail wag size, wagF: wags per second; knee: knee bend in a step (only models with lower[]); sway: body roll in a step */
const KIND={
  dog:{A:.5,f:2.2,gait:'walk',wag:.6,wagF:2.2,knee:.9,sway:.04},
  pug:{A:.5,f:2.4,gait:'walk',wag:.5,wagF:2.6,sway:.05},
  pomchi:{A:.55,f:2.6,gait:'walk',wag:.6,wagF:2.4,sway:.04},
  sausage:{A:.6,f:2.8,gait:'walk',wag:.6,wagF:2.2,sway:.03},
  cat:{A:.45,f:1.8,gait:'walk',wag:.25,wagF:.6,sway:.03},
  bunny:{A:.6,f:1.8,gait:'bound',wag:.15,wagF:1,hop:.18},
  hamster:{A:.7,f:3.4,gait:'walk',wag:.1,wagF:1,sway:.05},
  capybara:{A:.4,f:1.5,gait:'walk',wag:0,wagF:0,sway:.04},
  duck:{A:.45,f:2.4,gait:'waddle',wag:.2,wagF:2,sway:.15},
  owl:{A:.3,f:1.6,gait:'hop',wag:.1,wagF:1,hop:.12},
  bear:{A:.38,f:1.3,gait:'walk',wag:.1,wagF:1,sway:.07,headSwing:.12},
  monkey:{A:.5,f:2,gait:'walk',wag:.3,wagF:.8,sway:.05},
  seal:{A:0,f:1.4,gait:'galumph',wag:.2,wagF:1},
  snake:{A:0,f:.8,gait:'slither',wag:0,wagF:0},
  cow:{A:.24,f:1.0,gait:'walk',wag:.3,wagF:.5,knee:.85,sway:.03},
  sheep:{A:.36,f:1.4,gait:'walk',wag:.4,wagF:3,sway:.05},
  chicken:{A:.5,f:2.6,gait:'bob',wag:.15,wagF:2,knee:.9},
  pig:{A:.45,f:2.4,gait:'trot',wag:.5,wagF:3,sway:.07},
  horse:{A:.3,f:1.2,gait:'walk',wag:.2,wagF:.4,sway:.03},
  farmdog:{A:.4,f:1.4,gait:'walk',wag:.3,wagF:1,knee:.8,sway:.04},
  person:{A:.55,f:1.35,gait:'biped'}
};
const kindOf=R=>KIND[R.kind]||KIND.dog;

/* ---------- core: bounding box in the model's own (root) space ---------- */
const _inv=new THREE.Matrix4(),_m=new THREE.Matrix4(),_v=new THREE.Vector3(),_bx=new THREE.Box3(),_q=new THREE.Quaternion(),_q2=new THREE.Quaternion();
/* lowest/highest points of obj, measured in root's frame. precise: real vertices (rotated spheres would float on a loose box) */
function boxIn(root,obj,out,skip,precise){root.updateMatrixWorld(true);_inv.copy(root.matrixWorld).invert();out.makeEmpty();
  const walk=o=>{if(!o.visible||(skip&&skip.has(o)))return;
    if(o.isMesh&&!o.userData.noGround&&o.geometry){const g=o.geometry;_m.multiplyMatrices(_inv,o.matrixWorld);const pa=g.attributes&&g.attributes.position;
      if(precise!==false&&pa&&pa.count<=1200){const st=pa.count>400?2:1;for(let i=0;i<pa.count;i+=st)out.expandByPoint(_v.fromBufferAttribute(pa,i).applyMatrix4(_m));}
      else{if(!g.boundingBox)g.computeBoundingBox();_bx.copy(g.boundingBox).applyMatrix4(_m);out.union(_bx);}}
    for(const c of o.children)walk(c);};
  walk(obj);return out;}

/* ---------- core: rig (rest pose snapshot) ---------- */
const GROUP_LISTS=['legs','lower','arms','ears','rear','segs','hips','wings'];   /* wings: c14 duck/owl   /* hips: added by c13 petPose (posed models) */
function headCore(m){const h=m.head;if(!h)return null;const c=h.children&&h.children[0];return c&&c.isGroup&&!c.isMesh?c:null;}
function rig(m,o){o=o||{};if(m.__mv&&!o.force){if(o.kind)m.__mv.kind=o.kind;return m.__mv;}
  const root=m.root||m,b=m.b||(m.isObject3D&&m.children&&m.children[0])||m;
  const R={m,root,b,kind:o.kind||m.kind||m.type||'dog',rest:new Map(),legs:[],cache:{},last:null};
  const snap=g=>{if(g&&g.isObject3D&&!R.rest.has(g))R.rest.set(g,{p:g.position.clone(),q:g.quaternion.clone(),s:g.scale.clone()});};
  /* legs that pivot at the foot (the c14 bear): the pack hangs each on a hip joint at the top of the leg (like c14 petPose), so legs swing from the hip. A posed model's own m.hips are used */
  R.legG=(m.legs||[]).map((l,i)=>{if(m.hips&&m.hips[i])return m.hips[i];if(!l||!l.isObject3D||!l.parent)return l;l.updateWorldMatrix(true,true);const inv=new THREE.Matrix4().copy(l.matrixWorld).invert();const lb=new THREE.Box3(),vv=new THREE.Vector3();
    l.traverse(q=>{if(q.isMesh&&q.geometry&&q.geometry.attributes.position){const pa=q.geometry.attributes.position;for(let k=0;k<pa.count;k++)lb.expandByPoint(vv.fromBufferAttribute(pa,k).applyMatrix4(q.matrixWorld).applyMatrix4(inv));}});
    if(lb.isEmpty()||lb.min.y<-.25*(lb.max.y-lb.min.y))return l;const top=lb.max.y-.04*(lb.max.y-lb.min.y);
    const Hj=new THREE.Group();Hj.position.copy(l.position).add(new THREE.Vector3(0,top,0).multiply(l.scale).applyQuaternion(l.quaternion));l.parent.add(Hj);Hj.updateWorldMatrix(true,false);Hj.attach(l);Hj.userData.packHip=1;return Hj;});
  R.legG.forEach(snap);
  snap(b);snap(m.neck);snap(m.head);snap(m.tail);snap(headCore(m));snap(m.sitPivot);snap(m.tongue);for(const k of GROUP_LISTS)(m[k]||[]).forEach(snap);
  R.top=m.sitPivot&&m.sitPivot.parent===root?m.sitPivot:b;   /* the piece the ground fix moves (petPose 'sit' hangs b under sitPivot) */
  R.posed=m.sitPivot?'sit':m.hips?'lie':null;R.hide=[];R.show=[];
  if(m.arms&&m.arms.length&&!o.kind)R.kind='person';
  m.__mv=R;
  /* sizes at rest (root frame) */
  const bb=boxIn(root,b,new THREE.Box3());R.H=bb.max.y-bb.min.y;R.Lz=bb.max.z-bb.min.z;R.base=bb.min.y;R.center=bb.getCenter(new THREE.Vector3());
  R.bCenter=b.worldToLocal(root.localToWorld(R.center.clone()));
  /* legs: which are front/back and left/right, and how long (hip to the floor) */
  const L=R.legG;const mz=L.reduce((s,g)=>s+g.position.z,0)/(L.length||1);
  const seal=R.kind==='seal';R.biped=L.length===2&&!seal;
  L.forEach((g,i)=>{const lb=boxIn(root,g,new THREE.Box3());const hip=root.worldToLocal(g.getWorldPosition(new THREE.Vector3()));
    R.legs.push({g,lower:(m.lower||[])[i]||null,front:seal||(!R.biped&&g.position.z>mz+1e-6),left:g.position.x<0,len:Math.max(.02,hip.y-lb.min.y),hip});});
  R.legLen=R.legs.length?R.legs.reduce((s,l)=>s+l.len,0)/R.legs.length:R.H*.3;
  R.front=R.legs.filter(l=>l.front);R.hind=R.legs.filter(l=>!l.front);
  /* tail direction: a tail that points up or hangs down wags on z; one that points back wags on y */
  if(m.tail){const tb=boxIn(m.tail,m.tail,new THREE.Box3()),c=tb.getCenter(new THREE.Vector3());R.tailAxis=Math.abs(c.y)>=Math.abs(c.z)?'z':'y';R.tailHang=c.y<-Math.abs(c.z);}
  return R;}
/* back to the rest pose (call once per frame before a move; play() does it) */
function reset(m){const R=rig(m);R.rest.forEach((s,g)=>{g.position.copy(s.p);g.quaternion.copy(s.q);g.scale.copy(s.s);});R.hide.forEach(o=>{o.visible=false;});R.show.forEach(o=>{o.visible=true;});return R;}
/* ground fix: puts the lowest point of the body on the floor (root y = 0). Returns how far it moved. */
function ground(m,o){const R=rig(m);if(R.b===R.root)return 0;const T=R.top||R.b;const bb=boxIn(R.root,T,_gb,null,o&&o.fast?false:undefined);if(bb.isEmpty())return 0;T.position.y-=bb.min.y;return bb.min.y;}
const _gb=new THREE.Box3();
/* the lowest point of a set of groups (root frame) */
function lowY(R,objs,skip){let y=Infinity;for(const o of objs){if(!o)continue;const bb=boxIn(R.root,o,_gb,skip);if(!bb.isEmpty())y=Math.min(y,bb.min.y);}return y;}
/* turn the body group about a point given in body space (so a pitch pivots at the hips or the rump, not at the floor centre) */
function rotAbout(R,axis,ang,px,py,pz){const b=R.b;const p=new THREE.Vector3(px,py,pz).multiply(b.scale);   /* composes with what is already set this frame */
  const piv=p.clone().applyQuaternion(b.quaternion).add(b.position);
  _q.setFromAxisAngle(axis==='x'?X:axis==='y'?Y:Z,ang);b.quaternion.multiply(_q);
  b.position.copy(piv).sub(p.applyQuaternion(b.quaternion));}
const X=new THREE.Vector3(1,0,0),Y=new THREE.Vector3(0,1,0),Z=new THREE.Vector3(0,0,1),DOWN=new THREE.Vector3(0,-1,0);
/* solve a body tilt so two groups touch the floor together (e.g. sitting: front feet and rump). Cached per model and pose. */
function solveTilt(R,key,apply,A,B,lo,hi){if(R.cache[key]!=null)return R.cache[key];let a=lo,b=hi;const skipA=new Set(A);
  const f=th=>{reset(R.m);apply(th);return lowY(R,A)-lowY(R,[R.b],skipA);};
  const fa=f(a);for(let i=0;i<16;i++){const m=(a+b)/2,fm=f(m);if((fm>0)===(fa>0))a=m;else b=m;}reset(R.m);return R.cache[key]=(a+b)/2;}

/* ---------- core: legs ---------- */
const OFF={walk:{FL:.25,FR:.75,BL:0,BR:.5},trot:{FL:0,BR:0,FR:.5,BL:.5},gallop:{BL:0,BR:.1,FL:.45,FR:.55},bound:{FL:0,FR:.06,BL:.5,BR:.56},together:{FL:0,FR:0,BL:0,BR:0}};
const legId=l=>(l.front?'F':'B')+(l.left?'L':'R');
/* knee sign: front knees (carpus) fold the foot back, hind hocks fold it forward (the hock points back, real life) */
const kneeSign=l=>l.front?1:-1;
function gaitLegs(R,ph,A,amp,gait,knee){const off=OFF[gait]||OFF.walk;
  R.legs.forEach((l,i)=>{const o=R.biped?(i?.5:0):off[legId(l)];l.g.rotation.x+=legAng(ph+o,A)*amp;
    if(l.lower&&knee)l.lower.rotation.x+=kneeSign(l)*knee*swingK(ph+o)*amp;});}
/* distance of one full step cycle in world units (so feet do not slide: phase = distance / stride) */
function stride(m,A){const R=rig(m);A=A==null?kindOf(R).A:A;const s=(R.root.scale&&R.root.scale.y)||1;return Math.max(.05,2*R.legLen*s*Math.sin(Math.max(.05,A))/STANCE);}
function phaseOf(R,t,o,A){const K=kindOf(R);if(o&&o.dist!=null)return o.dist/stride(R.m,A);return t*(o&&o.f||K.f)*(o&&o.speed||1);}
/* tail */
function wag(R,amt,freq,t){const tl=R.m.tail;if(!tl||!amt)return;tl.rotation[R.tailAxis||'z']+=amt*Math.sin(TAU*freq*t);}
function tailUp(R,k){const tl=R.m.tail;if(!tl)return;tl.rotation.x+=R.tailHang?Math.max(k,-.35):k;}   /* + up, - down (a hanging tail only tucks a little) */
/* head: pitch (+ = nose down), with the neck when the model has one */
function headDown(R,k,neckShare){const m=R.m;if(m.neck&&neckShare!==0){const s=neckShare==null?.6:neckShare;m.neck.rotation.x+=k*s;if(m.head)m.head.rotation.x+=k*(1-s);}else if(m.head)m.head.rotation.x+=k;}
function ears(R,k){(R.m.ears||[]).forEach(e=>{e.rotation.x+=k;});}
/* breathing: a tiny rise of the chest (scale of the whole body piece, no bending) */
function breathe(R,t,per,amt){const b=R.b;const s=Math.sin(TAU*t/per);b.scale.y*=1+amt*s;b.scale.x*=1+amt*.6*s;}

/* ---------- shared poses (pets) ---------- */
function legsAll(R,fn){R.legs.forEach(fn);}
/* sit: rump down, front legs straight, chest up. Solved per model so front feet and rump both touch the floor */
function sitPose(R,k){const m=R.m;if(!R.front.length||!R.hind.length){lieDown(R,k*.6);return;}
  const hz=R.hind[0].g.position.z,hy=R.hind[0].g.position.y;
  const apply=th=>{rotAbout(R,'x',-th,0,hy,hz);R.front.forEach(l=>{l.g.rotation.x+=th;});
    R.hind.forEach(l=>{if(l.lower){l.g.rotation.x+=th+.95;l.lower.rotation.x-=2.1;}else{l.g.rotation.x+=th-1.35;}});};
  const th=solveTilt(R,'sit',apply,R.front.map(l=>l.g),null,0,1.25);
  reset(m);apply(th*k);if(m.head)m.head.rotation.x+=th*.75*k;if(m.neck)m.neck.rotation.x+=th*.15*k;tailUp(R,-.5*k);}
/* lie: legs fold under, body down (sphinx), head low */
function lieDown(R,k){const m=R.m;
  if(R.biped){R.legs.forEach(l=>{l.g.rotation.x+=-1.4*k;});return;}
  R.front.forEach(l=>{l.g.rotation.x+=-1.45*k;if(l.lower)l.lower.rotation.x+=.1*k;});
  R.hind.forEach(l=>{if(l.lower){l.g.rotation.x+=-1.15*k;l.lower.rotation.x+=2.3*k;l.g.rotation.z+=(l.left?-1:1)*.25*k;}else{l.g.rotation.x+=-1.3*k;l.g.rotation.z+=(l.left?-1:1)*.45*k;}});
  headDown(R,.15*k);}
/* play bow: chest down on the front legs, rump up */
function bowPose(R,k){const m=R.m;if(!R.front.length||!R.hind.length){headDown(R,.3*k);return;}
  const fz=R.front[0].g.position.z,fy=R.front[0].g.position.y;
  const apply=th=>{rotAbout(R,'x',th,0,fy,fz);R.front.forEach(l=>{l.g.rotation.x+=-th-1.25;if(l.lower)l.lower.rotation.x+=.4;});R.hind.forEach(l=>{l.g.rotation.x+=-th;});};
  const th=solveTilt(R,'bow',apply,R.front.map(l=>l.g),null,0,.9);
  reset(m);apply(th*k);if(m.head)m.head.rotation.x+=-th*.9*k;if(m.neck)m.neck.rotation.x+=-.1*k;tailUp(R,.5*k);}
/* in the air: front legs reach forward, hind legs back, knees tucked */
function airLegs(R,u){const s=Math.sin(PI*cl(u));R.legs.forEach(l=>{if(R.biped){l.g.rotation.x+=.5*s;return;}l.g.rotation.x+=(l.front?-.7:.6)*s;if(l.lower)l.lower.rotation.x+=kneeSign(l)*.9*s;});}
/* a crouch before a jump and a squash on landing (whole-body scale only) */
function squash(R,k){R.b.scale.y*=1-.12*k;R.b.scale.x*=1+.06*k;R.b.scale.z*=1+.06*k;}

/* ---------- pet moves ---------- */
/* walk (per type: walk, trot, bunny bound, duck waddle, owl hop, chicken head-bob, seal galumph, snake slither). o.dist = metres walked (feet planted); o.mood: 'sad'|'sick'|'happy' */
function petWalk(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const mood=o.mood;
  if(K.gait==='slither')return snakeSlither(m,t,o);
  if(K.gait==='galumph')return sealGalumph(m,t,o);
  const amp=(mood==='sad'?.6:mood==='sick'?.5:1)*(o.amp==null?1:o.amp);const A=K.A*(o.big||1);const ph=phaseOf(R,t,o,A*(mood==='sad'?.6:mood==='sick'?.5:1));let lift=0;   /* o.amp only fades the legs in/out; the stride follows the mood */
  if(K.gait==='bob')return chickenWalk(m,t,o);
  if(K.gait==='hop'){const u=frac(ph);lift=arc(u,0,.7,R.H*K.hop*amp);R.legs.forEach(l=>{l.g.rotation.x+=.35*Math.sin(PI*cl(u/.7))*amp;});}
  else if(K.gait==='bound'){gaitLegs(R,ph,A,amp,'bound',K.knee);const u=frac(ph+.75);lift=arc(u,0,.62,R.H*K.hop*amp);rotAbout(R,'x',.18*Math.sin(TAU*ph)*amp,0,R.bCenter.y,R.bCenter.z);}
  else if(K.gait==='waddle'){gaitLegs(R,ph,A,amp,'walk');rotAbout(R,'z',K.sway*Math.sin(TAU*ph)*amp,0,0,0);}
  else{gaitLegs(R,ph,A,amp,K.gait==='trot'?'trot':'walk',K.knee);rotAbout(R,'z',(K.sway||.03)*Math.sin(TAU*ph)*amp,0,R.bCenter.y,R.bCenter.z);
    if(m.head){m.head.rotation.x+=.08*Math.sin(TAU*2*ph+.4)*amp;if(K.headSwing)m.head.rotation.y+=K.headSwing*Math.sin(TAU*ph);}}
  moodOverlay(R,t,mood);if(!mood)wag(R,K.wag,K.wagF,t);
  return {lift};}
/* moods on top of any pose: sad = head and tail low; sick = lower still; happy = tail high, fast wag */
function moodOverlay(R,t,mood){const K=kindOf(R);if(!mood)return;
  if(mood==='sad'){headDown(R,.45);tailUp(R,-1.0);ears(R,.35);wag(R,.08,.4,t);}
  else if(mood==='sick'){headDown(R,.6);tailUp(R,-1.2);ears(R,.45);}
  else if(mood==='happy'){if(R.m.head)R.m.head.rotation.x-=.15;tailUp(R,.4);wag(R,K.wag*1.4+.2,K.wagF*1.8+2,t);ears(R,-.2);}}
/* idle: breathes, looks around slowly, small tail wag */
function petIdle(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};if(R.kind==='snake')return snakeIdle(m,t,o);
  breathe(R,t,2.6,.012);if(m.head)m.head.rotation.y+=.3*Math.sin(t*.37*TAU/2.2);wag(R,K.wag*.5,K.wagF*.5,t);moodOverlay(R,t,o.mood);return {};}
/* UNHAPPY 1 — at the bowl: sniffs (head down, little sniffs), then sits by it, head low. 4 s, then holds the sit (walking to the bowl is the game's) */
function unhappyBowl(m,t,o){const R=rig(m),K=kindOf(R);if(R.kind==='snake')return snakeLook(m,t,o);
  const sn=seg(t,.1,.6)*(1-seg(t,1.7,2.1));const sit=seg(t,2.0,2.7);
  if(sit>0)sitPose(R,sit);if(R.kind==='seal')R.b.rotation.x-=.25*sit;
  headDown(R,.65*sn+(sn>.9?.06*Math.sin(TAU*7*t):0)+.25*sit);tailUp(R,-.5*sit);ears(R,.3*sit);wag(R,K.wag*.3,K.wagF*.5,t);if(sit>.95)breathe(R,t,3,.012);
  return {done:t>=4,hold:true};}
/* UNHAPPY 2 — play: play bow, then two hops. 3 s loop */
function unhappyPlay(m,t,o){const R=rig(m),K=kindOf(R);const u=clock(t,3)*3;let lift=0;
  if(R.kind==='snake'){const r=snakeLook(m,t,o);return r;}
  const bow=bell(u,0,1.05);if(bow>0)bowPose(R,bow);
  for(const [a,b] of[[1.1,1.75],[1.95,2.6]]){const v=(u-a)/(b-a);if(v>0&&v<1){lift=arc(u,a,b,R.H*.35);airLegs(R,v);rotAbout(R,'x',-.25*Math.cos(PI*v),0,R.bCenter.y,R.bCenter.z);}
    const c=bell(u,a-.12,a)+bell(u,b,b+.12);if(c>0){squash(R,c);}}
  wag(R,K.wag+.3,K.wagF+2,t);if(R.kind==='seal')sealClapPose(R,bell(u,1.1,2.6));
  return {lift};}
/* UNHAPPY 3 — tired: a big yawn (head up, front stretch), then lies down and breathes slowly. 4 s, then holds lying */
function unhappyNap(m,t,o){const R=rig(m),K=kindOf(R);if(R.kind==='snake')return snakeCoil(m,t,o);
  const yawn=bell(t,0,1.0);const lie=seg(t,1.0,1.9);
  if(lie>0)lieDown(R,lie);if(m.head)m.head.rotation.x+=-.55*yawn;R.front.forEach(l=>{l.g.rotation.x+=-.35*yawn;});
  headDown(R,.25*lie);tailUp(R,-.4*lie);if(lie>.95)breathe(R,t,3,.018);
  return {done:t>=4,hold:true};}
/* UNHAPPY 4 — wants attention: looks up at you, nudges your leg twice. 3 s loop (following you is the game's walk) */
function unhappyNudge(m,t,o){const R=rig(m),K=kindOf(R);const u=clock(t,3)*3;if(R.kind==='snake')return snakeLook(m,t,o);
  const up=seg(u,0,.4)*(1-seg(u,2.6,3));if(m.head)m.head.rotation.x+=-.5*up;if(m.neck)m.neck.rotation.x+=-.2*up;
  const nud=Math.max(0,Math.sin(TAU*(u-.8)/1.0))*(u>.8&&u<2.6?1:0);
  R.b.position.z+=R.Lz*.09*nud;if(m.head)m.head.rotation.x+=.35*nud;R.hind.forEach(l=>{l.g.rotation.x+=.18*nud;});R.front.forEach(l=>{l.g.rotation.x+=-.12*nud;});
  wag(R,(K.wag+.2)*up,K.wagF+1,t);ears(R,-.2*up);return {};}
/* VERY HAPPY — two big jumps, the second with a spin. 2.4 s loop. Favourite food plays this as the happy dance */
function veryHappy(m,t,o){const R=rig(m),K=kindOf(R);const u=clock(t,2.4)*2.4;let lift=0;
  if(R.kind==='snake')return snakeLook(m,t,Object.assign({},o,{happy:1}));
  for(const [a,b,spin] of[[.15,.95,0],[1.25,2.15,1]]){const v=(u-a)/(b-a);if(v>0&&v<1){lift=arc(u,a,b,R.H*.42);airLegs(R,v);if(spin)rotAbout(R,'y',TAU*ease(v),0,0,R.bCenter.z);}
    const c=bell(u,a-.15,a)+bell(u,b,b+.15);if(c>0){squash(R,c);R.legs.forEach(l=>{l.g.rotation.x+=(l.front?.15:-.15)*c;});}}
  moodOverlay(R,t,'happy');if(R.kind==='seal')sealClapPose(R,bell(u,0,2.4));return {lift};}
/* favourite food: the very-happy move as a short dance (wiggle, two little hops). 2 s */
function happyDance(m,t,o){const R=rig(m),K=kindOf(R);const u=clock(t,2)*2;let lift=0;
  rotAbout(R,'y',.45*Math.sin(TAU*u),0,0,R.bCenter.z);rotAbout(R,'z',.08*Math.sin(TAU*2*u),0,R.bCenter.y,R.bCenter.z);
  for(const [a,b] of[[.3,.75],[1.25,1.7]]){const v=(u-a)/(b-a);if(v>0&&v<1){lift=arc(u,a,b,R.H*.22);airLegs(R,v*.7);}}
  if(R.kind==='seal')sealClapPose(R,bell(u,0,2));moodOverlay(R,t,'happy');return {lift,done:t>=2};}
/* SAD (standing): head and tail low, ears down, a slow sigh. Walking sad: pet.walk with mood:'sad' (half-speed legs) */
function petSad(m,t,o){const R=rig(m);if(R.kind==='snake'){snakeIdle(m,t,o);headDown(R,.2);return {};}
  const sigh=bell(clock(t,4),.3,.7);breathe(R,t,4,.02*sigh+.006);moodOverlay(R,t,'sad');headDown(R,.1*sigh);return {};}
/* SICK: droops lower, slow walk (pet.walk mood:'sick'), lies down a lot, sneezes */
function sickLie(m,t,o){const R=rig(m);if(R.kind==='snake'){const r=snakeCoil(m,99,o);headDown(R,.25);return r;}
  const k=seg(t,0,.8);lieDown(R,k);headDown(R,.35+.25*k);tailUp(R,-.5-.3*k);ears(R,.45);breathe(R,t,3.4,.02*k);
  const sn=clock(t,6)*6;if(sn>4.6&&sn<5.8)sneezeHead(R,(sn-4.6)/1.2,.7);return {};}
/* sneeze: head pulls back and up, snaps down, a little shake. 1.2 s. o.sick: drooped between sneezes */
function sneezeHead(R,u,amt){const m=R.m;const up=bell(u,0,.42),snap=bell(u,.4,.62),shake=bell(u,.62,1);
  if(m.head){m.head.rotation.x+=(-.4*up+.55*snap)*amt;m.head.rotation.y+=.3*shake*Math.sin(TAU*4*u)*amt;}
  if(m.neck)m.neck.rotation.x+=(-.15*up+.2*snap)*amt;R.b.position.z+=-R.Lz*.04*snap*amt;ears(R,.3*snap*amt);}
function sneeze(m,t,o){const R=rig(m);o=o||{};const u=cl(t/1.2);if(o.sick)moodOverlay(R,t,'sick');sneezeHead(R,u,1);if(R.front.length)R.front.forEach(l=>{l.g.rotation.x+=-.1*bell(u,.4,.62);});return {done:t>=1.2};}
/* warning sneeze: a healthy pet sneezes now and then before it gets sick (healthy look, a head shake after) */
function warnSneeze(m,t,o){const R=rig(m),K=kindOf(R);sneezeHead(R,cl(t/1.2),1.2);wag(R,K.wag*.5,K.wagF,t);return {done:t>=1.4};}
/* NAP / SLEEP: turns once in its spot, lies down, curls (head round to the side, tail wrapped), slow breathing. 2.4 s, then sleeps (loops breathing) */
function petNap(m,t,o){const R=rig(m),K=kindOf(R);if(R.kind==='snake')return snakeCoil(m,t,o);
  const turn=seg(t,0,1.2),lie=seg(t,1.2,2.2);
  if(turn<1){rotAbout(R,'y',TAU*turn,0,0,R.bCenter.z);gaitLegs(R,t*K.f*.8,K.A*.5,1-lie,'walk');}
  if(lie>0){lieDown(R,lie);headDown(R,.2*lie);if(m.head)m.head.rotation.y+=.65*lie;const tl=m.tail;if(tl){tl.rotation.y+=.9*lie;tailUp(R,-.6*lie);}ears(R,.3*lie);}
  if(t>2.2)breathe(R,t,3,.02);return {hold:true,sleeping:t>2.2};}
/* EAT: head down to the bowl, chews, tail wags. 1.6 s loop */
/* (petEat preview) o.h = the bowl's rim height (metres): the body tips forward over the front legs and the head goes down until the muzzle is at the rim (solved once per height) */
function eatPose(R,k,h){const m=R.m;if(R.hind.length){const hz=R.hind[0].g.position.z;rotAbout(R,'x',.14*k,0,0,hz);R.front.forEach(l=>{l.g.rotation.x+=-.14*k-.1*k;});R.hind.forEach(l=>{l.g.rotation.x+=-.14*k;});}headDown(R,h*k,.7);}
function petEat(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const u=clock(t,1.6);
  if(o.h==null){headDown(R,.6+.08*Math.sin(TAU*3*u),.7);if(m.head)m.head.rotation.x+=.05*Math.sin(TAU*6*u);wag(R,K.wag,K.wagF,t);return {};}
  const key='eat'+o.h.toFixed(3);if(R.cache[key]==null){const s=(R.root.scale&&R.root.scale.y)||1,feet=R.legs.map(l=>l.g);let a=.1,b=1.6;
    const g=v=>{reset(m);eatPose(R,1,v);return lowY(R,[m.head])-lowY(R,feet)-o.h/s;};for(let i=0;i<16;i++){const mid=(a+b)/2;if(g(mid)>0)a=mid;else b=mid;}reset(m);R.cache[key]=(a+b)/2;}
  const k=seg(t,0,.5);eatPose(R,k,R.cache[key]);const chew=t>.6?.09*Math.abs(Math.sin(TAU*2.5*t)):0;headDown(R,-chew,.3);wag(R,K.wag,K.wagF,t);return {};}

/* ---------- big pets ---------- */
/* bear: walk is pet.walk (heavy roll set in KIND). Sit up on its bottom, paws dangle (holds) */
function bearSitUp(m,t,o){const R=rig(m);const k=seg(t,0,.9);if(!R.hind.length)return {};const hz=R.hind[0].g.position.z,hy=R.hind[0].g.position.y;
  rotAbout(R,'x',-1.1*k,0,hy*.6,hz);R.hind.forEach(l=>{l.g.rotation.x+=(1.1-1.55)*k;l.g.rotation.z+=(l.left?-1:1)*.25*k;});
  R.front.forEach(l=>{l.g.rotation.x+=(1.1-.45+.12*Math.sin(TAU*t*.8+(l.left?0:1)))*k;});if(m.head)m.head.rotation.x+=.95*k;breathe(R,t,2.8,.012*k);return {hold:true};}
/* bear: very happy roll on its back, paws paddle, head up. 2.4 s loop */
function bearRoll(m,t,o){const R=rig(m);const u=clock(t,2.4);const on=seg(t,0,.5);
  rotAbout(R,'z',(PI+.3*Math.sin(TAU*u))*on,0,R.bCenter.y,R.bCenter.z);
  R.legs.forEach((l,i)=>{l.g.rotation.x+=.55*Math.sin(TAU*2*u+i*1.6)*on;});if(m.head)m.head.rotation.x+=1.0*on;wag(R,.3,2,t);return {};}
/* seal (sealNew preview, the new flippers: m.legs = front flippers turning at the shoulder, m.rear = back flippers on the tail).
   galumph on land: bunches up, the front flippers push, the back flippers lift; the body surges forward on the push. o.dist like a walk */
function sealGalumph(m,t,o){const R=rig(m);o=o||{};const s=(R.root.scale&&R.root.scale.y)||1;const len=R.Lz*s*.27;const c=o.dist!=null?o.dist/len:t*.5;const u=frac(c);
  const bunch=Math.sin(PI*cl(u/.45)),push=Math.sin(PI*cl((u-.45)/.55));
  R.b.rotation.x+=.13*bunch-.1*push;if(m.head)m.head.rotation.x+=-.12*bunch+.12*push;
  (m.legs||[]).forEach(l=>{l.rotation.x+=u<.45?-.55*ease(u/.45)+.7*(1-ease(u/.45)):-.55+1.25*ease(cl((u-.45)/.5));l.rotation.z+=Math.sign(l.position.x)*.1*push;});
  if(m.tail)m.tail.rotation.x+=.38*bunch-.08*push;(m.rear||[]).forEach((r,i)=>{r.rotation.y+=(i?1:-1)*(.15+.25*bunch);r.rotation.x+=-.2*bunch;});
  if(o.dist!=null){const de=len*(Math.floor(c)+ease(cl((u-.4)/.55)));R.b.position.z+=(de-o.dist)/s;}   /* surge: ahead or behind the game's even motion by under one push */
  return {};}
/* seal: swims in its pond — back flippers and tail scull, front flippers out to steer, body rolls a little. No ground fix: root y = water - .32 (adult seal) */
function sealSwim(m,t,o){const R=rig(m);const sc=Math.sin(TAU*t);if(m.tail)m.tail.rotation.y+=.35*sc;(m.rear||[]).forEach((r,i)=>{r.rotation.y+=.45*sc+(i?1:-1)*.15;r.rotation.z+=.4*sc;});
  R.b.rotation.y+=-.08*sc;R.b.rotation.z+=-.12;if(m.head){m.head.rotation.y+=.12*sc+.15;m.head.rotation.x+=-.25;}
  (m.legs||[]).forEach(l=>{const sd=Math.sign(l.position.x);l.rotation.x+=.95;l.rotation.z+=sd*(.35+.12*Math.max(0,sd*Math.sin(TAU*(t+.25))));});return {noGround:true,lift:.03*Math.sin(TAU*t/2),sink:.32};}
/* front flipper turns solved once: 'open' (out to the side, raised) and 'clapped' (the paddles meet in front of the chest) */
function sealFits(R){if(R.cache.sealFit)return R.cache.sealFit;const m=R.m,e=new THREE.Euler(),v=new THREE.Vector3();
  const fit=(l,T)=>{const sd=Math.sign(l.position.x),tip=new THREE.Vector3(sd*.2,-.1,.03);let best=[0,0,0,1e9];
    for(let x=-2.4;x<=.4;x+=.08)for(let y=-1.2;y<=1.2;y+=.08)for(let z=-1.6;z<=1.6;z+=.08){e.set(x,y,z);v.copy(tip).applyEuler(e).add(l.position);const d=v.distanceTo(T);if(d<best[3])best=[x,y,z,d];}return best;};
  const L=m.legs||[];return R.cache.sealFit={clap:L.map(l=>fit(l,new THREE.Vector3(Math.sign(l.position.x)*.035,.24,.36))),open:L.map(l=>fit(l,new THREE.Vector3(Math.sign(l.position.x)*.36,.22,.2)))};}
/* clap: k = how far into the clap pose (0 rest .. 1), c = 0 open .. 1 paddles together */
function sealClapPose(R,k,c){const F=sealFits(R);(R.m.legs||[]).forEach((l,i)=>{const o=F.clap[i],w=F.open[i];const q=c==null?Math.abs(Math.sin(TAU*3*k)):c;
  l.rotation.x+=(w[0]+(o[0]-w[0])*q)*k;l.rotation.y+=(w[1]+(o[1]-w[1])*q)*k;l.rotation.z+=(w[2]+(o[2]-w[2])*q)*k;});}
/* seal: ball on its nose — sits up (body turned up .5 at the tail end), balances, claps once a second. r.ball = where the ball's centre goes (root frame, metres): the game's prop */
function sealBall(m,t,o){const R=rig(m);o=o||{};const s=(R.root.scale&&R.root.scale.y)||1;const into=seg(t,0,.6);rotAbout(R,'x',-.5*into,0,.02,-.3);
  if(m.head){m.head.rotation.x+=(-.08+.05*Math.sin(TAU*t/2))*into;m.head.rotation.z+=.08*Math.sin(TAU*t/2+.4)*into;}
  const clap=Math.max(0,Math.sin(TAU*(t+.25)));sealClapPose(R,into,clap);if(m.tail)m.tail.rotation.x+=.5*into;(m.rear||[]).forEach((r,i)=>{r.rotation.y+=(i?1:-1)*(.3+.1*clap)*into;r.rotation.x+=.05*into;});
  const br=o.ballR||.15,hop=Math.pow(Math.max(0,Math.sin(TAU*t/2)),2)*.22;let ball=null;if(m.head){ground(m);const hb=boxIn(R.root,m.head,new THREE.Box3());ball=[(hb.min.x+hb.max.x)/2*s,hb.max.y*s+br*.92+hop*into,(hb.min.z+hb.max.z)/2*s];}
  return {ball};}
function sealClap(m,t,o){const R=rig(m);const k=bell(cl(t/1.2),0,1);rotAbout(R,'x',-.3*k,0,.02,-.3);sealClapPose(R,k,Math.max(0,Math.sin(TAU*(t*2.5+.25))));if(m.head)m.head.rotation.x+=-.3*k;return {done:t>=1.2};}
/* monkey: walk is pet.walk. Climb (body upright against the trunk, arms reach and pull, legs push). No ground fix: the game moves it up the trunk; climbRate = metres per second */
function monkeyClimb(m,t,o){const R=rig(m);const u=t*1.1;if(!R.hind.length)return {noGround:true};const hz=R.hind[0].g.position.z,hy=R.hind[0].g.position.y;
  rotAbout(R,'x',-1.35,0,hy,hz);R.front.forEach((l,i)=>{const s=Math.sin(TAU*u+(i?PI:0));l.g.rotation.x+=1.35-2.3-.6*s;});R.hind.forEach((l,i)=>{const s=Math.sin(TAU*u+(i?0:PI));l.g.rotation.x+=1.35-.9-.35*s;});
  if(m.head)m.head.rotation.x+=1.1;wag(R,.25,.8,t);return {noGround:true,climbRate:.35};}
/* monkey: very happy — bouncy hops with the tail up (pet.veryHappy works too) */
function monkeyHappy(m,t,o){const R=rig(m);const u=clock(t,1.2)*1.2;let lift=0;const v=u/.8;if(v<1){lift=arc(u,0,.8,R.H*.4);airLegs(R,v);}else squash(R,bell(u,.8,1.2));tailUp(R,.6);wag(R,.4,3,t);if(m.head)m.head.rotation.x-=.2;return {lift};}
/* snake (segs[] are separate pieces along the body: positions only) — slither: an S-wave runs down the body. o.dist like a walk */
function snakeWave(R,ph,A,env0){const m=R.m,S=m.segs||[];const k=.42;const xs=[];
  S.forEach((g,i)=>{const r=R.rest.get(g);const e=env0+(1-env0)*cl(i/6);const x=A*e*Math.sin(i*k-TAU*ph);g.position.x=x;xs.push(x);});
  S.forEach((g,i)=>{const a=xs[Math.max(0,i-1)],b=xs[Math.min(S.length-1,i+1)];g.rotation.y=Math.atan2(a-b,.11);});
  if(m.head&&S.length){m.head.position.x=xs[0]*1.1;m.head.rotation.y=Math.atan2(xs[0]-xs[1],.055)*.7;}}
function snakeSlither(m,t,o){const R=rig(m);o=o||{};const lam=(TAU/.42)*.055*((R.root.scale&&R.root.scale.y)||1);const ph=o.dist!=null?o.dist/lam:t*kindOf(R).f;snakeWave(R,ph,.1,.35);return {};}
function snakeIdle(m,t,o){const R=rig(m);snakeWave(R,t*.15,.08,.4);if(m.head)m.head.rotation.y+=.25*Math.sin(TAU*t*.2);return {};}
/* snake: coils up (under the tank light) — the body winds into a spiral, head rests on top. 1.5 s in, then holds */
function snakeCoil(m,t,o){const R=rig(m),S=m.segs||[];const k=seg(t,0,1.5);if(!S.length)return {};
  let r=.035,a=0;const pos=[];for(let i=0;i<S.length;i++){pos.push([Math.cos(a)*r,Math.sin(a)*r,i]);const dr=.055;a+=dr/Math.max(r,.04);r=Math.min(.2,r+.055*dr/(TAU*Math.max(r,.04))*1.6);}
  const n=S.length;S.forEach((g,i)=>{const rs=R.rest.get(g);const q=pos[i];   /* seg 0 (head end) in the middle, the tail outside */
    const tx=q[0],tz=q[1],ty=rs.p.y+Math.max(0,.05*(1-Math.hypot(tx,tz)/.2))*1.4;g.position.set(rs.p.x+(tx-rs.p.x)*k,rs.p.y+(ty-rs.p.y)*k,rs.p.z+(tz-rs.p.z)*k);
    const nx=pos[Math.min(n-1,i+1)];g.rotation.y=k*Math.atan2(q[0]-nx[0],q[1]-nx[1]);});
  if(m.head){const rs=R.rest.get(m.head);m.head.position.set(rs.p.x+(-.0-rs.p.x)*k,rs.p.y+(.12-rs.p.y)*k,rs.p.z+(.0-rs.p.z)*k);m.head.rotation.x+=.15*k;}
  breathe(R,t,3.2,.01*k);return {hold:true};}
/* snake: lifts its head to look at you (attention, curious). o.happy: a little bounce */
function snakeLook(m,t,o){const R=rig(m),S=m.segs||[];const k=seg(clock(t,3)*3,0,.5);snakeWave(R,t*.1,.05,.4);
  for(let i=0;i<Math.min(8,S.length);i++){S[i].position.y+=(.2*(1-i/8))*k;}if(m.head){m.head.position.y+=.24*k+(o&&o.happy?.03*Math.abs(Math.sin(TAU*2*t)):0);m.head.rotation.x+=-.25*k;m.head.rotation.y+=.3*Math.sin(TAU*t*.4)*k;}return {};}

/* ---------- farm animals ---------- */
/* cow: calm 4-beat walk, knees and hocks bend, head nods, tail sways. Use pet.walk with the cow model (kind 'cow') */
/* cow graze: the hidden neck slides out of the chest and down (the approved recipe), muzzle in the grass, bites and tears, chews, one slow step. 6 s loop */
/* (31 Oct, grazeNecks preview) the approved recipe + neck slid out .10 more (.45 in all), the body tilt solved so all four hooves stay on the grass,
   the neck turned .4 less (muzzle in front of the hooves) and slid down by dy (solved once) so the muzzle just touches the grass */
function cowGrazeK(R,k){const m=R.m,rn=R.rest.get(m.neck);if(!m.neck||!rn)return false;const c=cowSolve(R);m.neck.position.z=rn.p.z+.45*k;m.neck.position.y=rn.p.y+(-.14+c.dy)*k;m.neck.rotation.x+=(1.3-.4)*k;if(m.head)m.head.rotation.x+=.35*k;R.b.rotation.x+=c.tilt*k;
  R.front.forEach(l=>{l.g.rotation.x+=.15*k;if(l.lower)l.lower.rotation.x+=-.3*k;});return true;}
function cowSolve(R){const c=R.cache;if(c.cow)return c.cow;const m=R.m;c.cow={tilt:.1,dy:0};if(!m.neck)return c.cow;
  const fr=R.front.map(l=>l.g),hi=R.hind.map(l=>l.g);
  let lo=-.15,hi2=.45;for(let i=0;i<16;i++){const mid=(lo+hi2)/2;c.cow.tilt=mid;reset(m);cowGrazeK(R,1);const d=lowY(R,fr)-lowY(R,hi);if(d>0)lo=mid;else hi2=mid;}c.cow.tilt=(lo+hi2)/2;
  c.cow.dy=muzzleSolve(R,v=>{c.cow.dy=v;reset(m);cowGrazeK(R,1);},.006);reset(m);return c.cow;}
/* bisection: the setter value v (neck slide, body units) that puts the head's lowest point h metres above the lowest hoof */
function muzzleSolve(R,set,h){const m=R.m,feet=R.legs.map(l=>l.g),s=(R.root.scale&&R.root.scale.y)||1;const gap=v=>{set(v);return lowY(R,[m.head])-lowY(R,feet)-h/s;};
  let a=-.4,b=.3;const ga=gap(a),gb=gap(b);if(ga*gb>0)return Math.abs(ga)<Math.abs(gb)?a:b;for(let i=0;i<18;i++){const mid=(a+b)/2,g=gap(mid);if((g>0)===(ga>0))a=mid;else b=mid;}return (a+b)/2;}
/* safety: if a bite would put the muzzle under the grass, slide the neck up just enough */
function muzzleClamp(R,h){const m=R.m;if(!m.neck)return;const s=(R.root.scale&&R.root.scale.y)||1,sb=R.b.scale.y||1,feet=R.legs.map(l=>l.g);
  for(let i=0;i<3;i++){const g=lowY(R,[m.head])-lowY(R,feet);if(g>=h/s-1e-4)return;m.neck.position.y+=(h/s-g)/sb+.0005;}}
/* one bite (u 0..1): muzzle on the grass, tear up and to the side, chew while the head sinks back */
function bite(u){const lift=u<.3?0:u<.45?.7*seg(u,.3,.45):.7*(1-seg(u,.7,.98));return {lift,tear:bell(u,.3,.52),chew:u>.45&&u<.95?Math.sin(TAU*3*(u-.45)/.5):0,nib:u<.3?bell(u,0,.3):0};}
function cowGraze(m,t,o){const R=rig(m);const u=clock(t,6);const into=seg(t,0,1);const k=(1-seg(u,.66,.74)+seg(u,.88,.98))*into;if(!cowGrazeK(R,k)){if(m.head)m.head.rotation.x+=.3*into;return {gap:'no neck'};}
  const sb=bell(u,.42,.6);if(sb>0){const ph=(u-.42)/.18;R.legs.forEach(l=>{const off=OFF.walk[legId(l)];l.g.rotation.x+=-.2*Math.sin(TAU*(ph+off))*sb;if(l.lower)l.lower.rotation.x+=kneeSign(l)*.6*Math.max(0,Math.cos(TAU*(ph+off)))*sb;});}
  const a=k*k*(1-sb);const b=bite(frac(7*u));const side=Math.floor(7*u)%2?1:-1;
  m.neck.rotation.x+=(-.12*b.lift+.04*b.nib)*a;if(m.head){m.head.rotation.y+=.3*b.tear*side*a;m.head.rotation.x+=-.22*b.lift*a;}const hc=headCore(m);if(hc)hc.rotation.y+=.09*(b.chew*a+Math.sin(TAU*8*u)*(1-k));
  const look=bell(u,.74,.88);if(m.head){m.head.rotation.y+=-.6*Math.sin(TAU*cl((u-.74)/.14))*look;m.head.rotation.x+=-.1*look;}
  if(m.tail){m.tail.rotation.z+=.2*S1(u*2)+.8*bell(u,.8,.9);m.tail.rotation.x+=.25*bell(u,.8,.9);}muzzleClamp(R,.004);
  const D=R.Lz*.16*((R.root.scale&&R.root.scale.y)||1);const v=(u-.42)/.18;return {step:v>0&&v<1?D*6*v*(1-v)/(.18*6)*1:0};}   /* step: metres per second the game moves it forward during the step (D in all per loop) */
/* SHEEP graze (grazeNecks preview, Living's neck recipe as tuned): neck slides out (z +.3) and down, turns down (1.6 less .3, lamb .4), head +.4, no body tilt; dy solved once so the muzzle touches.
   6 s loop: grazes with bites, lifts its head, looks round, down again. o.lamb (or a scaled-down sheep), o.side: which way it looks */
function sheepPose(R,k){const m=R.m,c=R.cache.sheep;m.neck.position.z+=.3*k;m.neck.position.y+=(-.12+c.dy)*k;m.neck.rotation.x+=(1.6+c.nr)*k;if(m.head)m.head.rotation.x+=.4*k;}
function sheepGraze(m,t,o){const R=rig(m);o=o||{};if(!m.neck)return sheepLook(m,t,o);const lamb=o.lamb!=null?!!o.lamb:((R.root.scale&&R.root.scale.y)||1)<.8;
  if(!R.cache.sheep){R.cache.sheep={dy:0,nr:lamb?-.4:-.3};R.cache.sheep.dy=muzzleSolve(R,v=>{R.cache.sheep.dy=v;reset(m);sheepPose(R,1);},.006);reset(m);}
  const u=clock(t,6),into=seg(t,0,1);const k=(1-seg(u,.5,.6)+seg(u,.82,.94))*into,up=1-k,look=bell(u,.6,.82),lr=Math.sin(TAU*cl((u-.6)/.22));sheepPose(R,k);
  const nb=lamb?4:6;const b=bite(frac(nb*u)),a=k*k,sd=Math.floor(nb*u)%2?1:-1;
  if(m.head){m.head.rotation.x+=-.32*b.lift*a+.05*b.nib*a-.12*look;m.head.rotation.z+=(.16*b.tear*sd+.035*b.chew)*a+.03*Math.sin(TAU*12*u)*up;m.head.rotation.y+=.75*lr*look*(o.side||1);}
  m.neck.rotation.x+=-.1*b.lift*a;R.b.scale.x*=1+.012*Math.sin(TAU*2*u);if(m.tail)m.tail.rotation.z+=.4*Math.sin(TAU*3*u)*(Math.sin(TAU*u)>.3?1:.25);muzzleClamp(R,.004);return {};}
/* cow stand: chews cud, looks around, tail swats. 6 s loop */
function cowStand(m,t,o){const R=rig(m);const u=clock(t,6);const A=seg(u,.06,.24)*(1-seg(u,.4,.56)),Bk=seg(u,.46,.6)*(1-seg(u,.76,.92));
  if(m.head){m.head.rotation.y+=-.65*A-.3*Bk;m.head.rotation.x+=-.08*A-.12*Bk+.03*S1(6*u);}const hc=headCore(m);if(hc){hc.rotation.y+=.07*S1(6*u);hc.rotation.z+=.03*S1(6*u+.25);}
  if(m.tail){m.tail.rotation.z+=.15*S1(2*u)+.9*bell(u,.64,.74);m.tail.rotation.x+=.3*bell(u,.64,.74);}rotAbout(R,'z',.012*S1(u),0,R.bCenter.y,R.bCenter.z);return {};}
/* cow / any farm animal: lifts its head and looks at you (o.look: angle to you, rad, + = its left) */
function lookAtYou(m,t,o){const R=rig(m);const k=seg(t,0,.6);const a=(o&&o.look)||.7;if(m.head){m.head.rotation.y+=a*k;m.head.rotation.x+=-.15*k;}if(m.neck)m.neck.rotation.x+=-.1*k;wag(R,kindOf(R).wag*.5,kindOf(R).wagF,t);return {hold:true};}
/* sheep: walk = pet.walk (kind 'sheep'); after stopping: looks around, breathes, wiggles its tail. 4 s loop */
function sheepLook(m,t,o){const R=rig(m);const u=clock(t,4);const look=bell(u,.1,.55),back=bell(u,.55,.95);if(m.head){m.head.rotation.y+=-.85*look+.6*back;m.head.rotation.x+=-.1*(look+back);}
  breathe(R,t,2,.012);if(m.tail)m.tail.rotation.z+=.4*Math.sin(TAU*3*t)*(Math.sin(TAU*u)>.3?1:.25);return {};}
/* lamb: pronks — bounces on four stiff legs beside its mum. 0.5 s per bounce */
function lambHop(m,t,o){const R=rig(m);const u=frac(t*2);const hop=Math.sin(PI*u);const hh=R.H*[.3,.22,.34][Math.floor(t*2)%3];
  R.legs.forEach(l=>{l.g.rotation.x+=(l.front?-.5:.45)*hop;});if(m.head)m.head.rotation.x+=-.15*hop;if(m.tail)m.tail.rotation.z+=.7*Math.sin(TAU*4.5*t);
  const c=bell(u,.9,1)+bell(u,0,.08);if(c>0)squash(R,c*.6);return {lift:hh*hop};}
/* chicken walk: the head holds still in the air, then jerks forward; legs step and bend at the hock */
function chickenWalk(m,t,o){const R=rig(m),K=KIND.chicken;o=o||{};const A=K.A*(o.amp||1);const ph=phaseOf(R,t,o,A);gaitLegs(R,ph,A,1,'walk',K.knee);
  const half=frac(ph*2);const sc=(R.root.scale&&R.root.scale.y)||1;const step=stride(m,A)/2/sc;const hold=.7;const bob=Math.min(.06,step*hold*.9);
  const off=half<hold?bob*(.5-half/hold):bob*(-.5+(half-hold)/(1-hold));
  if(m.neck)m.neck.position.z+=off;else if(m.head)m.head.position.z+=off;rotAbout(R,'z',.06*Math.sin(TAU*ph),0,R.bCenter.y,0);if(m.tail)m.tail.rotation.x+=.1*Math.sin(TAU*2*ph);return {};}
/* chicken: scratch and peck — rakes the dirt (one foot then the other), steps back, pecks the seeds three times. 3 s loop */
function chickenPeck(m,t,o){const R=rig(m);const u=clock(t,3)*3;const lean=seg(u,0,.25)*(1-seg(u,2.75,3));
  rotAbout(R,'x',.25*lean,0,(R.legs[0]?R.legs[0].g.position.y:R.bCenter.y),0);R.legs.forEach(l=>{l.g.rotation.x+=-.25*lean;});
  if(u<1.3){const i=Math.floor(u/.32)%2,v=frac(u/.32);const l=R.legs[i];if(l){const r=Math.sin(PI*v);l.g.rotation.x+=(v<.5?-.5*r:.9*r);if(l.lower)l.lower.rotation.x+=-.7*r;}}
  else if(u<1.6){const v=(u-1.3)/.3;gaitLegs(R,-v,.35,1,'walk',.8);R.b.position.z+=-.04*seg(u,1.3,1.6);}
  else{R.b.position.z+=-.04;const v=u-1.6;const p=v<1.2?Math.max(0,Math.sin(TAU*v/.4)):0;const dip=seg(v,0,.15)*(1-seg(v,1.1,1.35));
    rotAbout(R,'x',.3*dip+.2*p,0,(R.legs[0]?R.legs[0].g.position.y:R.bCenter.y),0);R.legs.forEach(l=>{l.g.rotation.x+=-.3*dip-.2*p;});headDown(R,.5*dip+1.1*p,.75);}
  if(u<1.6)headDown(R,.3*lean,.8);if(m.tail)m.tail.rotation.x+=.2*lean;return {};}
/* chicken: run and flap — scatters when you run past: fast steps, body low and forward, tail up. (wings need their own groups: see README) */
function chickenRun(m,t,o){const R=rig(m);o=Object.assign({amp:1.3,f:6},o);const ph=phaseOf(R,t,o,KIND.chicken.A*1.3);gaitLegs(R,ph,KIND.chicken.A*1.3,1,'walk',1.1);
  rotAbout(R,'x',.3,0,R.legs[0]?R.legs[0].g.position.y:R.bCenter.y,0);R.legs.forEach(l=>{l.g.rotation.x+=-.3;});headDown(R,-.3,.6);if(m.tail)m.tail.rotation.x+=.35;
  return {lift:R.H*.05*Math.abs(Math.sin(TAU*ph))};}
/* pig: trot = pet.walk (kind 'pig': diagonal trot, body wiggle). Nose in the ground: */
function pigRoot(m,t,o){const R=rig(m);headDown(R,.45+.12*Math.sin(TAU*2.5*t));if(m.head)m.head.rotation.y+=.2*Math.sin(TAU*.9*t);wag(R,.5,3,t);return {};}
/* pig: rolls full circles in the mud (over its back, twice, legs kicking), then gets up. 3.2 s loop */
function pigRoll(m,t,o){const R=rig(m);const u=clock(t,3.2);const down=seg(u,0,.15)*(1-seg(u,.86,1));const roll=seg(u,.18,.82);
  lieDown(R,down);rotAbout(R,'z',TAU*2*roll,0,R.bCenter.y,R.bCenter.z);
  const kick=bell(u,.18,.82);R.legs.forEach((l,i)=>{l.g.rotation.x+=.6*Math.sin(TAU*6*u+i*1.7)*kick;});wag(R,.6,4,t);return {};}
/* horse: walk / trot / gallop (o.gait). Hooves planted with o.dist. The game horse has one-piece legs (no knees) */
function horseGait(m,t,o){const R=rig(m);o=o||{};const g=o.gait||'walk';const A=g==='gallop'?.55:g==='trot'?.42:.3;const ph=phaseOf(R,t,o,A);
  gaitLegs(R,ph,A,1,g==='gallop'?'gallop':g==='trot'?'trot':'walk',.9);
  const rock=g==='gallop'?.09*Math.sin(TAU*ph):g==='trot'?.02*Math.sin(TAU*2*ph):.015*Math.sin(TAU*2*ph);
  rotAbout(R,'x',rock,0,R.bCenter.y,R.bCenter.z);if(m.head)m.head.rotation.x+=(g==='gallop'?-.1:.06)*Math.sin(TAU*(g==='walk'?2:1)*ph+.5)-rock;
  if(m.tail){m.tail.rotation.x+=g==='gallop'?.5:g==='trot'?.2:0;m.tail.rotation.z+=.12*Math.sin(TAU*ph);}
  const lift=g==='trot'?R.H*.025*Math.abs(Math.sin(TAU*ph)):g==='gallop'?R.H*.05*Math.max(0,Math.sin(TAU*ph-1)):0;
  R.last={gait:g,ph,lift};return {lift};}
/* horse jump (1.6 s): gathers, lifts its front, then back legs, tucks over the fence, lands front first */
function horseJump(m,t,o){const R=rig(m);const u=cl(t/1.6);let lift=0;
  const crouch=bell(u,0,.24),up=bell(u,.16,.42),air=bell(u,.25,.78),down=bell(u,.62,.86),land=bell(u,.8,1);
  rotAbout(R,'x',-.32*up+.22*down,0,R.bCenter.y,R.bCenter.z);
  R.front.forEach(l=>{l.g.rotation.x+=1.0*air+(-.35)*down-.15*crouch;});R.hind.forEach(l=>{l.g.rotation.x+=-.35*crouch+(-.75)*air*seg(u,.36,.5)+.35*up;});
  lift=arc(u,.25,.8,(o&&o.height||.9)/((R.root.scale&&R.root.scale.y)||1));squash(R,.6*land+.4*crouch);if(m.head)m.head.rotation.x+=.25*up-.2*down;if(m.tail)m.tail.rotation.x+=.6*air;
  R.last={gait:'jump',ph:u,lift};return {lift,done:t>=1.6};}
/* horse idle: tail swish, weight shift, head nods (grazing head-down needs a neck group: README) */
function horseIdle(m,t,o){const R=rig(m);const u=clock(t,5);if(m.tail)m.tail.rotation.z+=.25*S1(u*2)+.6*bell(u,.6,.72);if(m.head)m.head.rotation.x+=.08*S1(u*3);
  R.hind.forEach((l,i)=>{if(i===0)l.g.rotation.x+=-.12*bell(u,.2,.45);});R.last={gait:'idle',ph:u,lift:0};return {};}
/* horse stops at the town edge: refuses, tosses its head, shakes (2 s) */
function horseRefuse(m,t,o){const R=rig(m);const u=cl(t/2);rotAbout(R,'x',-.12*bell(u,0,.4),0,R.bCenter.y,-R.Lz*.3);if(m.head){m.head.rotation.x+=-.35*bell(u,.1,.5);m.head.rotation.z+=.3*Math.sin(TAU*4*u)*bell(u,.45,1);}
  R.front.forEach(l=>{l.g.rotation.x+=-.3*bell(u,0,.4);});if(m.tail)m.tail.rotation.z+=.5*Math.sin(TAU*3*u);R.last={gait:'idle',ph:u,lift:0};return {done:t>=2};}
/* farm dog (St. Bernard): asleep, slow calm breathing (one breath per 3 s, about 20 a minute). Works on the sleep models (no part groups): the whole body piece breathes */
function farmdogSleep(m,t,o){const R=rig(m,{kind:'farmdog'});const s=Math.sin(TAU*t/3);R.b.scale.y*=1+.025*s;R.b.scale.z*=1+.012*s;if(m.tail)m.tail.rotation.z+=.0;return {noGround:!m.b};}
/* farm dog standing model (stBernardStand): walk is pet.walk (kind 'farmdog', knees bend); lies down to sleep: */
function farmdogLie(m,t,o){const R=rig(m,{kind:'farmdog'});const k=seg(t,0,1.2);lieDown(R,k);headDown(R,.35*k,.6);tailUp(R,-.3*k);if(t>1.2)breathe(R,t,3,.02);return {hold:true};}

/* ---------- people (makePerson: legs[] at the hip, arms[] at the shoulder, head; no knees or elbows) ---------- */
/* point an arm along a direction given in the person's root frame (+z forward, +y up). k = how far (0 rest .. 1) */
function aimArm(R,i,dir,k){const a=R.m.arms&&R.m.arms[i];if(!a||!k)return;const d=dir.clone().normalize();_q2.copy(R.b.quaternion).invert();d.applyQuaternion(_q2);
  _q.setFromUnitVectors(DOWN,d);a.quaternion.slerp(_q,cl(k));}
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
/* lean the upper body forward by phi (about the hips) with a lunge stance (feet stay on the floor) — the people model has no waist or knees */
/* (sweep fix) the lean is 60 % of what is asked, the stance 25 % wider (lowers the hips a little: there are no knees), and the head turns back up so it looks ahead instead of sinking into the chest */
function lunge(R,phi,legA){phi*=.6;legA*=1.25;const hip=R.legs.length?R.m.legs[0].position.y:.62;rotAbout(R,'x',phi,0,hip,0);R.legs.forEach((l,i)=>{l.g.rotation.x+=(i?legA:-legA)-phi;});if(R.m.head)R.m.head.rotation.x-=phi*.85;}
function personWalk(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const A=KIND.person.A*(o.amp||1);const ph=phaseOf(R,t,o,A);const a=legAng(ph,A),b2=legAng(ph+.5,A);
  if(R.legs[0])R.legs[0].g.rotation.x+=a;if(R.legs[1])R.legs[1].g.rotation.x+=b2;(m.arms||[]).forEach((ar,i)=>{ar.rotation.x+=-.8*(i?b2:a);});if(m.head)m.head.rotation.z+=.03*Math.sin(TAU*ph);return {};}
function personIdle(m,t,o){const R=rig(m,{kind:'person'});breathe(R,t,3,.008);if(m.head){m.head.rotation.z+=.04*Math.sin(TAU*t/4.5);m.head.rotation.y+=.15*Math.sin(TAU*t/7);}return {};}
/* rider seated on the horse (riderOn): follows the saddle as the horse moves, bobs with the gait, rises with the trot (posting), leans forward in the gallop and the jump.
   o.horse = the horse model (play the horse first in the same frame). The rider is NOT grounded. */
function riderSeat(m,t,o){const R=rig(m,{kind:'rider'});o=o||{};const h=o.horse;if(!R.seat)R.seat={p:m.root.position.clone(),q:m.root.quaternion.clone()};
  m.root.position.copy(R.seat.p);m.root.quaternion.copy(R.seat.q);let g='idle',ph=0;
  if(h&&h.__mv){const HR=h.__mv,hb=HR.b,rs=HR.rest.get(hb);hb.updateMatrix();const M0=new THREE.Matrix4().compose(rs.p,rs.q,rs.s).invert();const M=new THREE.Matrix4().multiplyMatrices(hb.matrix,M0);
    m.root.position.applyMatrix4(M);_q.setFromRotationMatrix(M);m.root.quaternion.premultiply(_q);if(HR.last){g=HR.last.gait;ph=HR.last.ph;}}
  const hip=m.legs&&m.legs[0]?m.legs[0].position.y:.62;
  const post=g==='trot'?.06*Math.max(0,Math.sin(TAU*2*ph)):g==='walk'?.012*Math.abs(Math.sin(TAU*2*ph)):g==='gallop'?.02*Math.abs(Math.sin(TAU*ph)):0;m.root.position.y+=post;
  const lean=g==='gallop'?.22:g==='jump'?.3*Math.sin(PI*ph):g==='trot'?.08:0;rotAbout(R,'x',lean,0,hip,0);
  (m.arms||[]).forEach((a,i)=>{a.rotation.x+=-.1*Math.sin(TAU*2*ph+i);});if(m.head)m.head.rotation.x+=-lean*.8+.03*Math.sin(TAU*2*ph);return {noGround:true};}
/* coach at the jump field: points at the jump (2.5 s loop) */
function coachPoint(m,t,o){const R=rig(m,{kind:'person'});const u=clock(t,2.5);const k=seg(u,.05,.25)*(1-seg(u,.8,.98));aimArm(R,1,v3(.15,.35,1),k);if(m.head)m.head.rotation.y+=.25*k;if(m.arms&&m.arms[1])m.arms[1].rotation.x+=-.08*Math.sin(TAU*3*u)*k;personIdle(m,t);return {};}
/* coach: blows the whistle (hand to the mouth, head up a little, a short bounce). 2 s loop */
function coachWhistle(m,t,o){const R=rig(m,{kind:'person'});const u=clock(t,2);const k=seg(u,0,.2)*(1-seg(u,.8,1));aimArm(R,0,v3(.5,.55,.95),k);if(m.head)m.head.rotation.x+=-.12*k;
  const blow=bell(u,.3,.45)+bell(u,.5,.65);R.b.scale.y*=1+.02*blow;return {lift:.015*blow};}
/* coach: cheers — both arms up, little hops. 1.6 s loop */
function coachCheer(m,t,o){const R=rig(m,{kind:'person'});const u=clock(t,1.6);const k=seg(t,0,.3);const pump=.85+.15*Math.sin(TAU*2*u);
  aimArm(R,0,v3(-.45,1,.15),k*pump);aimArm(R,1,v3(.45,1,.15),k*pump);if(m.head)m.head.rotation.x+=-.15*k;const hop=arc(frac(u*2),0,.6,.08)*k;squash(R,bell(frac(u*2),.6,1)*.4*k);return {lift:hop};}
/* vet listens with the stethoscope: leans over the table, one hand to the pet's chest, head tilts to listen. 3 s loop. o.reach: how low (0..1) */
function vetListen(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const u=clock(t,3);const k=seg(u,0,.3)*(1-seg(u,.85,1));const low=o.reach==null?.6:o.reach;
  lunge(R,.35*k,.22*k);aimArm(R,1,v3(-.15,-low,1),k);aimArm(R,0,v3(.1,-.4,.8),k*.8);if(m.head){m.head.rotation.x+=.25*k;m.head.rotation.z+=.18*k*bell(u,.3,.85);}return {};}
/* vet checks ears and teeth: both hands forward at the pet's head, small careful moves. 3 s loop */
function vetCheck(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const u=clock(t,3);const k=seg(u,0,.25)*(1-seg(u,.85,1));const low=o.reach==null?.45:o.reach;
  lunge(R,.3*k,.2*k);const w=.06*Math.sin(TAU*4*u);aimArm(R,0,v3(.28+w,-low,1),k);aimArm(R,1,v3(-.28+w,-low,1),k);if(m.head)m.head.rotation.x+=.3*k;return {};}
/* vet nurse gives a treat: lunges down, holds the treat out low, waits, stands up. 3 s, then holds (the treat is the game's prop at the hand) */
function nurseTreat(m,t,o){const R=rig(m,{kind:'person'});const k=seg(t,0,.8)*(1-seg(t,2.3,3));lunge(R,.4*k,.3*k);aimArm(R,1,v3(0,-.75,1),seg(t,.4,1)*(1-seg(t,2.2,2.8)));if(m.head)m.head.rotation.x+=.3*k;
  return {done:t>=3};}
/* crouch (lunge, lean forward) — held; o.k sets how deep (0..1) */
function personCrouch(m,t,o){const R=rig(m,{kind:'person'});const k=(o&&o.k!=null?o.k:1)*seg(t,0,.5);lunge(R,.45*k,.32*k);aimArm(R,0,v3(.1,-1,.6),k*.6);aimArm(R,1,v3(-.1,-1,.6),k*.6);if(m.head)m.head.rotation.x+=.2*k;return {hold:true};}

/* ======================= round 2 (31 Oct): the moves of every approved preview (grazeNecks, snakeTank, shopStairs, shopSpots, petsHome, bigPets, farmChores) ======================= */
const scOf=R=>(R.root.scale&&R.root.scale.y)||1;
const hexOf=q=>q&&q.material&&q.material.color?q.material.color.getHexString():'';
const isOL=q=>!!(q.material&&q.material.side===THREE.BackSide);
/* rest snapshot for a mesh a move turns rigidly (tongue, eyes, wing pieces) */
function snapObj(R,o){if(o&&!R.rest.has(o))R.rest.set(o,{p:o.position.clone(),q:o.quaternion.clone(),s:o.scale.clone()});}
/* a mesh and its ink outline hull (same parent, same place) */
function withHulls(list){const out=new Set();list.forEach(q=>{out.add(q);const p=q.parent;if(p)p.children.forEach(c=>{if(c!==q&&c.isMesh&&isOL(c)&&c.position.distanceTo(q.position)<1e-4)out.add(c);});});return [...out];}
/* turn a rigid piece about a pivot (in its parent's frame), from its rest pose */
function turnAbout(R,o,axis,ang,piv){const r=R.rest.get(o);if(!r)return;_q.setFromAxisAngle(axis,ang);o.position.copy(r.p).sub(piv).applyQuaternion(_q).add(piv);o.quaternion.copy(_q).multiply(r.q);}
/* bird wings (duck, owl): the flat boxes at the body's sides; they turn at the shoulder (.13 above their centre) */
function wingsOf(R){if(R.wings)return R.wings;R.wings=[];if(R.kind!=='duck'&&R.kind!=='owl')return R.wings;
  for(const sd of[-1,1]){const pr=R.b.children.filter(q=>q.isMesh&&q.geometry&&q.geometry.type==='BoxGeometry'&&Math.sign(q.position.x)===sd&&Math.abs(q.position.x)>.08);
    if(!pr.length)continue;pr.forEach(q=>snapObj(R,q));R.wings.push({sd,pr,piv:new THREE.Vector3(pr[0].position.x,pr[0].position.y+.13,pr[0].position.z)});}return R.wings;}
function wingTurn(R,a){if(!a)return;const W=R.m.wings;if(W&&W.length){W.forEach(w=>{w.rotation.z+=Math.sign(w.position.x)*a;});return;}wingsOf(R).forEach(w=>w.pr.forEach(q=>turnAbout(R,q,Z,w.sd*a,w.piv)));}
/* owl eyes (blink = the eye balls squash shut) */
function eyeBalls(R){if(R.eyeB)return R.eyeB;const h=R.m.head;R.eyeB=h?withHulls(h.children.filter(q=>q.isMesh&&!isOL(q)&&q.geometry.type==='SphereGeometry'&&q.position.z>.1&&Math.abs(q.position.x)>.02)):[];R.eyeB.forEach(q=>snapObj(R,q));return R.eyeB;}
function blink(R,k){if(k>0)eyeBalls(R).forEach(q=>{q.scale.y*=1-.88*k;});}
/* eyelids the pack adds once (hidden, never grounded): capybara = a head-coloured cap over the top of the eye (half shut, blinks);
   snake = a head-coloured cover with a dark closed-eye line (asleep). lids(R,k): 0 open, .5 half shut, 1 shut */
function lidsOf(R){if(R.lids)return R.lids;R.lids=[];const h=R.m.head;if(!h)return R.lids;
  const skinM=h.children.find(q=>q.isMesh&&!isOL(q)&&q.geometry.type==='SphereGeometry'&&!(Math.abs(q.position.x)>.02));const col=skinM?skinM.material.color:new THREE.Color('#b8784a');
  const mk=(par,pos,r,full,sx)=>{const g=new THREE.Group();g.position.copy(pos);par.add(g);const geo=full?new THREE.SphereGeometry(r*1.15,14,10):new THREE.SphereGeometry(r*1.14,18,8,0,TAU,0,PI/2);
    const lid=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:col}));lid.userData.noGround=true;if(!full){lid.scale.set(1,1.05,.66);}g.add(lid);
    if(full){const ln=new THREE.Mesh(new THREE.BoxGeometry(.006,.006,r*1.9),new THREE.MeshBasicMaterial({color:'#1d1622'}));ln.userData.noGround=true;ln.position.set(sx*r*.75,r*.75,0);ln.rotation.z=-sx*.75;g.add(ln);}
    g.visible=false;R.hide.push(g);snapObj(R,g);return g;};
  if(R.kind==='snake'){h.children.forEach(q=>{if(q.isMesh&&!isOL(q)&&q.geometry.type==='SphereGeometry'&&Math.abs(q.position.x)>.02&&q.geometry.parameters.radius<.04&&hexOf(q)!=='2e2347')R.lids.push({g:mk(h,q.position,q.geometry.parameters.radius*Math.max(q.scale.x,q.scale.y,q.scale.z),true,Math.sign(q.position.x)),full:true,hl:[]});});}
  else h.children.forEach(e=>{if(!e.isGroup)return;const eye=e.children.find(q=>q.isMesh&&q.geometry.type==='SphereGeometry'&&hexOf(q)==='141018');if(!eye)return;
    const hl=e.children.filter(q=>q!==eye&&q.position.y>0);hl.forEach(q=>R.show.push(q));R.lids.push({g:mk(e,new THREE.Vector3(),eye.geometry.parameters.radius,false,0),full:false,hl});});
  return R.lids;}
function lids(R,k){if(k<=.01)return;lidsOf(R).forEach(L=>{if(L.full){L.g.visible=k>.5;return;}L.g.visible=true;L.hl.forEach(q=>{q.visible=false;});L.g.rotation.x=-.25+1.15*cl((k-.5)*2,0,1)-.4*cl((.5-k)*2,0,1);});}
/* tilt the body to a slope and put it on the sloped floor (o.slope = {pitch, roll}: + pitch = the ground rises ahead, + roll = it rises to the model's left (+x)) */
function slopeGround(R,sl){const T=R.top||R.b;const p=sl.pitch||0,r=sl.roll||0;const c=R.center;
  _q.setFromEuler(new THREE.Euler(-p,0,r,'XYZ'));T.position.sub(c).applyQuaternion(_q).add(c);T.quaternion.premultiply(_q);
  R.root.updateMatrixWorld(true);_inv.copy(R.root.matrixWorld).invert();const tp=Math.tan(p),tr=Math.tan(r);let mn=Infinity;
  T.traverse(o=>{if(!o.visible||!o.isMesh||o.userData.noGround||!o.geometry)return;const pa=o.geometry.attributes.position;if(!pa)return;_m.multiplyMatrices(_inv,o.matrixWorld);const st=pa.count>400?2:1;
    for(let i=0;i<pa.count;i+=st){_v.fromBufferAttribute(pa,i).applyMatrix4(_m);const d=_v.y-_v.z*tp-_v.x*tr;if(d<mn)mn=d;}});if(isFinite(mn))T.position.y-=mn;}

/* ---------- poses of c13 petPose (works on a posed model, or turns the legs the same way on an unposed one) ---------- */
function poseLie(R,k){if(R.posed||!k)return;const m=R.m;R.legs.forEach(l=>{l.g.rotation.x+=(l.front?-PI/2+.12:-PI/2+.35)*k;if(!l.front)l.g.rotation.z+=(l.g.position.x<0?1:-1)*.75*k;});if(m.tail)m.tail.rotation.x+=1.1*k;}
function sitPivot(R){const zs=R.legs.map(l=>l.g.position.z);const hind=R.hind[0]||R.legs[0];return {y:hind?hind.g.position.y:R.bCenter.y,z:zs.length?Math.min(...zs):0};}
function poseSit(R,k){if(R.posed||!k)return;const m=R.m,a=.95,P=sitPivot(R);rotAbout(R,'x',-a*k,0,P.y,P.z);
  R.legs.forEach(l=>{if(l.front)l.g.rotation.x+=(a-.25)*k;else{l.g.rotation.x+=(a-PI/2-.05)*k;l.g.rotation.z+=(l.g.position.x<0?1:-1)*.6*k;}});if(m.head)m.head.rotation.x+=a*1.05*k;}
/* lean back while sitting (rotates the sit pivot of a posed model, or the body about the same point) */
function sitLean(R,a){const m=R.m;if(m.sitPivot&&R.posed==='sit'){m.sitPivot.rotation.x+=a;return;}const P=sitPivot(R);rotAbout(R,'x',a,0,P.y,P.z);}

/* ---------- SNAKE on a path (snakeTank preview): every piece moves rigidly along one path, follow-the-leader, with the c13 snakeAlong spacing ---------- */
function snakeOf(R){if(R.sn)return R.sn;const m=R.m,S=m.segs||[];const rad=S.map(g=>R.rest.get(g).p.y);const off=[];let s=.09;rad.forEach((r,i)=>{if(i)s+=Math.min(.055,1.55*r);off.push(s);});
  const tongue=m.head?m.head.children.filter(q=>q.isMesh&&hexOf(q)==='ff4d6d'):[];tongue.forEach(q=>snapObj(R,q));return R.sn={rad,off,tongue,len:off.length?off[off.length-1]:0};}
/* a path given as points [x,y,z] in the root's frame (metres): the floor line the snake lies on. Cached per array */
const _paths=new WeakMap();
function pathOf(pts,s){let P=_paths.get(pts);if(!P||P.s!==s){const Q=pts.map(p=>new THREE.Vector3(p[0]/s,p[1]/s,p[2]/s));const C=[0];for(let i=1;i<Q.length;i++)C.push(C[i-1]+Q[i].distanceTo(Q[i-1]));P={Q,C,len:C[C.length-1],s};_paths.set(pts,P);}return P;}
function pathAt(P,s){const Q=P.Q,C=P.C,n=Q.length;if(n<2)return {p:Q[0]||new THREE.Vector3(),d:new THREE.Vector3(0,0,1)};
  if(s<=0){const d=Q[1].clone().sub(Q[0]).normalize();return {p:Q[0].clone().addScaledVector(d,s),d};}
  if(s>=P.len){const d=Q[n-1].clone().sub(Q[n-2]).normalize();return {p:Q[n-1].clone().addScaledVector(d,s-P.len),d};}
  let lo=0,hi=n-1;while(hi-lo>1){const mm=(lo+hi)>>1;if(C[mm]<=s)lo=mm;else hi=mm;}const u=(s-C[lo])/((C[hi]-C[lo])||1);return {p:Q[lo].clone().lerp(Q[hi],u),d:Q[hi].clone().sub(Q[lo])};}
const _e=new THREE.Euler(0,0,0,'YXZ');
/* lay the snake: head at arclength sH; o.lift head/neck raise (m), o.look head yaw, o.pitch head up (+), o.tg tongue out 0..1, o.br(i) breathing lift, o.shut eyes, o.hb head bob */
function snakePlace(R,at,sH,o){const m=R.m,S=m.segs||[],sn=snakeOf(R);o=o||{};const lift=o.lift||0;
  const put=(g,s,hh,ex,rz,extraPitch)=>{const a=at(s);const dx=a.d.x,dy=a.d.y,dz=a.d.z;const hz=Math.hypot(dx,dz)||1e-6;const th=Math.atan2(dy,hz);const lo=Math.hypot(hh*Math.cos(th),rz*Math.sin(th));
    g.position.set(a.p.x,a.p.y+lo+(ex||0),a.p.z);_e.set(-th+(extraPitch||0),Math.atan2(dx,dz),0);g.quaternion.setFromEuler(_e);return th;};
  S.forEach((g,i)=>{const k=cl(1-i/6);const ex=lift*k*k+(o.br?o.br(i):0);const pit=lift>0&&i<6?-Math.atan(lift*2/(.055*6))*(i<5?.5:.2)*k:0;put(g,sH-sn.off[i],.85*sn.rad[i],ex,1.45*sn.rad[i],pit);});
  if(m.head){const a=at(sH);const hz=Math.hypot(a.d.x,a.d.z)||1e-6;let th=Math.atan2(a.d.y,hz);th=cl(th,-.45,.45);const lo=Math.hypot(.047*Math.cos(th),.109*Math.sin(th));
    m.head.position.set(a.p.x,a.p.y+lo+lift*1.05+(o.hb||0),a.p.z);_e.set(-th-(o.pitch||0),Math.atan2(a.d.x,a.d.z)+(o.look||0),0);m.head.quaternion.setFromEuler(_e);}
  tongueK(R,o.tg==null?0:o.tg);if(o.shut)lids(R,1);}
const flick=u=>{const f=frac(u*3);return f<.35?Math.sin(PI*f/.35):0;};
/* snake.path: o.pts = path points (root frame, metres, the floor under the body, head end last); o.s = how far along the path the head is,
   or o.s0 + o.speed (m/s) × t. Ends with done when the head reaches the end. The game supplies the path (example: COZY_MOVES.examples.tankPath) */
function snakePath(m,t,o){const R=rig(m);o=o||{};if(!o.pts||!(m.segs||[]).length)return snakeSlither(m,t,o);const s=scOf(R),P=pathOf(o.pts,s);
  const sH=o.s!=null?o.s/s:((o.s0||0)+(o.speed==null?.3:o.speed)*t)/s;const at=x=>pathAt(P,x);
  const tg=frac(t/2.2)<.3?flick(frac(t/2.2)/.3):0;snakePlace(R,at,Math.min(sH,P.len),{lift:o.lift==null?.03/s:o.lift/s,tg,pitch:o.pitch||0});
  return {noGround:true,s:Math.min(sH,P.len)*s,len:P.len*s,done:sH>=P.len};}
/* snake.sleepHide: asleep at the path's end: with the c15 tank path that is the coil in the widened hide (the head on top of the rings); eyes shut, slow breathing wave, head bob. Zzz is the game's */
function snakeSleep(m,t,o){const R=rig(m);o=o||{};if(!o.pts){const r=snakeCoil(m,99,o);lids(R,1);return r;}const s=scOf(R),P=pathOf(o.pts,s);const sH=o.s!=null?o.s/s:P.len;const ph=t/4.5;
  const br=i=>(i>=0&&i<32)?.012*(.5+.5*Math.sin(TAU*ph-i*.15))*(.4+.6*Math.sin(PI*Math.min(1,(i+2)/30))):0;   /* lifts only: never into the ring under it */
  snakePlace(R,x=>pathAt(P,x),sH,{pitch:-.12,br,shut:true,hb:.006*Math.sin(TAU*ph)});return {noGround:true,hold:true,sleeping:true};}
/* snake.look: lifts its head, looks left and right, flicks its tongue. 4 s loop. On a path (o.pts + o.s) or in place */
function snakeLookRound(m,t,o){const R=rig(m);o=o||{};const u=clock(t,4);const up=seg(t,0,.5);
  const look=(-1.2*seg(u,.05,.2)*(1-seg(u,.4,.55))+1.2*seg(u,.4,.55)*(1-seg(u,.8,.95)))*up;const tg=(u>.25&&u<.37?flick((u-.25)/.12):0)+(u>.65&&u<.77?flick((u-.65)/.12):0);
  if(!o.pts){const r=snakeLook(m,t,o);if(m.head)m.head.rotation.y+=look;tongueK(R,tg);return r;}
  const s=scOf(R),P=pathOf(o.pts,s);const sH=o.s!=null?o.s/s:P.len;snakePlace(R,x=>pathAt(P,x),sH,{lift:.22*up/s,look,tg,pitch:.3*up});return {noGround:true};}
/* snake.basket: rises out of its basket and sways to the flute (root = the basket's rim centre; the body below the rim is hidden in the basket). 4 s loop */
function snakeBasket(m,t,o){const R=rig(m);const sn=snakeOf(R);const s=scOf(R);const u=clock(t,4);const up=seg(u,.04,.3)*(1-seg(u,.82,.97));const H=sn.len*.55*up+.02;
  const at=x=>{const y=x;const sw=.06*Math.sin(TAU*3*u-x*3)*cl(x/.3+.3,0,1)*up;const d=new THREE.Vector3(.18*Math.cos(TAU*3*u-x*3)*up*cl(x/.3+.3,0,1),1,0);return {p:new THREE.Vector3(sw,y-.04,0),d};};
  snakePlace(R,at,H,{tg:flick(frac(u*2))*up});if(m.head){m.head.quaternion.setFromEuler(_e.set(.15-.25*up,0,.1*Math.sin(TAU*3*u)*up));}return {noGround:true};}

/* ---------- STAIRS (shopStairs preview). The game moves the root along the flight (+z of the model), keeps root.y at the floor where the flight starts,
   and passes o.dist = metres walked from the first riser; o.rise, o.run, o.n (steps), o.down; or o.h(d) = floor height at d. r.floor = height under the walker.
   Feet land on the tread tops. People have no knees: they hop each step with both feet (the preview's knee walk needs knee groups). Pets: front paws hop up together, then the back paws. ---------- */
function stairH(o,d){if(o.h)return o.h(d);const rise=o.rise||.2386,run=o.run||.2929,n=o.n||14;   /* c15 Pet Shop: 14 even steps, 3.34 up over 4.1 */if(d<0)return 0;return (o.down?-1:1)*Math.min(n,Math.floor(d/run)+1)*rise;}
/* foot extents behind / ahead of the hip (root frame, model units) and the body's chest bottom and front (for the rear-up on the first step) */
function stairGeo(R){if(R.cache.stair)return R.cache.stair;const m=R.m;const hz=R.legs.length?R.legs.reduce((a,l)=>a+l.hip.z,0)/R.legs.length:0;let bk=0,fr=0;
  R.root.updateMatrixWorld(true);_inv.copy(R.root.matrixWorld).invert();   /* solid pieces only: the ink outline may overhang a tread edge */
  R.legs.forEach(l=>l.g.traverse(q=>{if(!q.isMesh||isOL(q)||!q.geometry)return;const pa=q.geometry.attributes.position;_m.multiplyMatrices(_inv,q.matrixWorld);
    for(let i=0;i<pa.count;i++){_v.fromBufferAttribute(pa,i).applyMatrix4(_m);bk=Math.max(bk,l.hip.z-_v.z);fr=Math.max(fr,_v.z-l.hip.z);}}));
  const skip=new Set([...R.legs.map(l=>l.g),m.head,m.tail].filter(Boolean));const body=boxIn(R.root,R.b,new THREE.Box3(),skip);
  return R.cache.stair={back:bk,front:fr,chestY:body.isEmpty()?R.base:body.min.y,frontZ:body.isEmpty()?0:body.max.z,backZ:body.isEmpty()?0:body.min.z};}
/* one hop from support a to support b (u 0..1): going up it rises first, then moves over; going down it moves over first, then drops */
function stepHop(u,up){return up?{h:ease(cl((u-.45)/.55)),v:ease(cl(u/.48))}:{h:ease(cl(u/.5)),v:ease(cl((u-.47)/.53))};}
function personStairs(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const s=scOf(R);const run=o.run||.2929;const d=o.dist!=null?o.dist:t*(o.speed||.5);
  const G=stairGeo(R);const L=R.legLen*s,hip0=R.legs.length?R.legs[0].hip:new THREE.Vector3(0,.62,0);const bk=G.back*s,fr=G.front*s;
  const m0=Math.max(0,(run-bk-fr)/2);const a=Math.max(0,m0-.006);const X=j=>j*run+bk+m0,Y=j=>stairH(o,j*run+run/2);   /* hip x when standing on tread j: the whole foot on the tread */
  const w=.55,q=(d-(bk+m0))/run+(1-w)/2,k=Math.floor(q),f=q-k;let hx,hy,th=[0,0],air=0;
  if(f<1-w){const v=f/(1-w);hx=X(k)-a+2*a*v;hy=Y(k)+L*Math.cos(Math.asin(cl((hx-X(k))/L,-.9,.9)));const t0=Math.asin(cl((X(k)-hx)/L,-.9,.9));th=[t0,t0];}
  else{const v=(f-(1-w))/w;air=Math.sin(PI*v);const y0=Y(k),y1=Y(k+1),up=y1>=y0;const e=stepHop(v,up);const x0=X(k)+a,x1=X(k+1)-a;hx=x0+(x1-x0)*e.h;
    hy=y0+(y1-y0)*e.v+L*Math.cos(Math.asin(cl(a/L,0,.9)))+.04*air;const sc2=.12*Math.sin(PI*e.h);th=[sc2,-sc2];}
  R.legs.forEach((l,i)=>{l.g.rotation.x+=-th[i];});(m.arms||[]).forEach((ar,i)=>{ar.rotation.x+=1.2*(th[i]||0)-.45*air;});if(m.head)m.head.rotation.x+=(o.down?.15:-.05);
  R.b.position.y+=hy/s-hip0.y;R.b.position.z+=(hx-d)/s-hip0.z;return {noGround:true,floor:stairH(o,d)};}
function petStairs(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const s=scOf(R);const run=o.run||.2929;const d=o.dist!=null?o.dist:t*(o.speed||.5);
  if(R.biped||!R.front.length||!R.hind.length)return personStairsBiped(m,t,o,d);const G=stairGeo(R);
  const w=.4;const pairs=[R.front,R.hind].map(L=>{const z=L.reduce((a,l)=>a+l.g.position.z,0)/L.length,y=L.reduce((a,l)=>a+l.hip.y,0)/L.length,len=L.reduce((a,l)=>a+l.len,0)/L.length;return {L,z,y,zr:L.reduce((a,l)=>a+l.hip.z,0)/L.length,len:len*s};});
  /* where on the tread each pair's paws go: near the back of the tread going up, near the front going down (so the hips stay over the paws), the two pairs out of step where they can */
  const dzr=(pairs[0].zr-pairs[1].zr)*s/run;const dn=stairH(o,run*1.5)<0;const key='pf'+run.toFixed(3)+dn;if(!R.cache[key]){let best=null;   
    for(let a=.28;a<=.721;a+=.02)for(let b=.28;b<=.721;b+=.02){const sep=Math.abs(frac(dzr-(a-b))-.5);const pr=dn?.72:.28;const sc=.3*sep+Math.abs(a-pr)+Math.abs(b-pr);if(!best||sc<best[0])best=[sc,a,b];}R.cache[key]=[best[1],best[2]];}const pf=R.cache[key];
  const zmr=(pairs[0].zr+pairs[1].zr)/2;let phi=0;
  pairs.forEach((P,pi)=>{const hx=d+P.zr*s;const q=hx/run-(pf[pi]-(1-w)/2),k=Math.floor(q),f=q-k;const Pk=j=>(j+pf[pi])*run,Yk=j=>stairH(o,(j+.5)*run);
    if(f<1-w){P.px=Pk(k);P.py=Yk(k);}else{const v=(f-(1-w))/w;const y0=Yk(k),y1=Yk(k+1);const e=stepHop(v,y1>=y0);P.px=Pk(k)+run*e.h;P.py=y0+(y1-y0)*e.v+.05*Math.sin(PI*v);}});
  const [F,B]=pairs;const dz=(F.zr-B.zr)*s;
  for(let it=0;it<3;it++){pairs.forEach((P,pi)=>{const hx=d+(zmr+(P.zr-zmr)*Math.cos(phi))*s;   /* the hips move in a little when the body tips */
      P.th=Math.asin(cl((P.px-hx)/P.len,-.85,.85));P.H=P.py+P.len*Math.cos(P.th);
      /* rear up / lift the rump: the body round each pair's hips (and the chest ahead of the front legs) must clear the step under it; the paws then come off the tread */
      /* the body's underside runs at the body's tilt: u metres ahead of these hips it is u*tan(phi) higher */
      const u0=pi?-Math.max(.07,(P.zr-G.backZ)*s):-.07,u1=pi?.07:Math.max(.07,(G.frontZ-P.zr)*s+.03),tp=Math.tan(phi);let req=-1e9;
      for(let u=u0;u<=u1+1e-6;u+=.01)req=Math.max(req,stairH(o,hx+u)-u*tp);req+=(P.y-G.chestY)*s+.015;if(req>P.H)P.H=req;});
    phi=Math.asin(cl((F.H-B.H)/dz,-.85,.85));}
  const ym=(F.y+B.y)/2,zm=(F.z+B.z)/2;
  rotAbout(R,'x',-phi,0,(R.front[0].g.position.y+R.hind[0].g.position.y)/2,zm);
  pairs.forEach(P=>P.L.forEach(l=>{l.g.rotation.x+=-P.th+phi;}));if(m.head)m.head.rotation.x+=phi*(phi<0?.9:.4);wag(R,K.wag*.6,K.wagF,t);
  R.b.position.y+=(F.H+B.H)/2/s-ym;return {noGround:true,floor:stairH(o,d),pitch:phi};}
/* two-legged pets (duck, owl): hop each step like people */
function personStairsBiped(m,t,o,d){const R=rig(m);const s=scOf(R);const run=o.run||.2929;const L=R.legLen*s,hip0=R.legs.length?R.legs[0].hip:R.center;
  const C=j=>(j+.5)*run,Y=j=>stairH(o,C(j));const q=d/run-.5,k=Math.floor(q),f=q-k;let hx=C(k),hy=Y(k)+L;
  if(f>=.5){const v=(f-.5)/.5;const y0=Y(k)+L,y1=Y(k+1)+L,up=y1>=y0;const eh=up?ease(cl((v-.3)/.7)):ease(cl(v/.7)),ev=up?ease(cl(v/.6)):ease(cl((v-.35)/.65));hx=C(k)+run*eh;hy=y0+(y1-y0)*ev+.04*Math.sin(PI*v);R.legs.forEach(l=>{l.g.rotation.x+=.35*Math.sin(PI*v);});}
  R.b.position.y+=hy/s-hip0.y;R.b.position.z+=(hx-d)/s-hip0.z;return {noGround:true,floor:stairH(o,d)};}

/* ---------- PET SHOP SPOTS (shopSpots preview) ---------- */
/* pet.lie: lies (petPose 'lie'), slow breaths, tail thumps twice; o.nap (default true): chin down on the paws. 5 s loop. Sofa/bed height = root y */
function petLie(m,t,o){const R=rig(m);o=o||{};const u=clock(t,5);poseLie(R,seg(t,0,.6));if(m.head)m.head.rotation.x+=(o.nap===false?-.1:.22)*seg(t,0,.8);
  const br=Math.sin(TAU*2*u);R.b.scale.x*=1+.012*br;R.b.scale.y*=1+.03*br;R.b.scale.z*=1+.012*br;if(m.head)m.head.rotation.x+=.03*Math.sin(TAU*(2*u-.15));
  const t1=bell(u,.28,.36)+bell(u,.38,.46),t2=bell(u,.7,.78)+bell(u,.8,.88);if(m.tail){m.tail.rotation.x-=.7*(t1+t2);m.tail.rotation.y+=.2*(t1-t2);}return {hold:true};}
/* cat.window: lies on the window seat, looks out of the window and back (o.side: -1 if the window is on its right), tail swishes. 5 s loop */
const CAT_LOOK=[[0,-.5],[.1,1.0],[.4,1.0],[.5,-.5],[.62,-.5],[.72,1.0],[.9,1.0],[1,-.5]];
function lerpK(keys,t){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(t<=b[0]){const u=ease((t-a[0])/((b[0]-a[0])||1));return a[1]+(b[1]-a[1])*u;}}return keys[keys.length-1][1];}
function catWindow(m,t,o){const R=rig(m);o=o||{};const u=clock(t,5);poseLie(R,seg(t,0,.6));const hy=lerpK(CAT_LOOK,u)*seg(t,0,.6);
  if(m.head){m.head.rotation.y+=hy*(o.side||1);m.head.rotation.x-=.12*cl((hy+.5)/1.5);}R.b.scale.y*=1+.02*Math.sin(TAU*2*u);if(m.tail)m.tail.rotation.y+=.5*Math.sin(TAU*3*u);return {hold:true};}
/* bunny.hillHop / hamster.run: pet.walk on the play hill; pass o.slope {pitch, roll} from the hill under the pet (the route is the game's) */
function bunnyHill(m,t,o){return petWalk(m,t,o);}
function hamsterRun(m,t,o){const R=rig(m);o=Object.assign({f:3.4},o);const r=petWalk(m,t,o);const ph=phaseOf(R,t,o,KIND.hamster.A);rotAbout(R,'x',.05*Math.sin(TAU*2*ph),0,R.bCenter.y,R.bCenter.z);return {lift:.01*Math.abs(Math.sin(TAU*2*ph))};}
/* capy.tub: soaks up to its chin in the warm tub: bobs, rolls a little, eyes half shut with slow blinks, chin up. 5 s loop. Grounded: put the root at water - r.sink */
function capyTub(m,t,o){const R=rig(m);o=o||{};const s=scOf(R);const u=clock(t,5);lieDown(R,1);   /* legs tucked under */
  if(m.head){m.head.rotation.x+=-.28+.06*Math.sin(TAU*u);m.head.rotation.z+=.12*Math.sin(TAU*(u+.25));m.head.rotation.y+=.15*Math.sin(TAU*u);}
  const bk=Math.max(bell(u,.28,.4),bell(u,.78,.9));lids(R,.5+.5*bk);rotAbout(R,'z',.05*Math.sin(TAU*(u-.05)),0,R.bCenter.y,R.bCenter.z);
  /* soak: the root is the water surface; the body goes down until the water line is at the chin (o.chin: m below the chin, default .02) */
  if(!R.cache.chin&&m.head){const T=R.top||R.b;const y0=T.position.y;R.root.updateMatrixWorld(true);R.cache.chin=boxIn(R.root,m.head,new THREE.Box3()).min.y-y0;}
  (R.top||R.b).position.y+=-(R.cache.chin||R.H*.6)+((o.chin==null?.02:o.chin)+.025*Math.sin(TAU*2*u))/s;return {noGround:true};}
/* duck.paddle: sits on the water (legs tucked), glides, dips its head under twice, tail wags. 5 s loop. Grounded: root at water - r.sink */
function duckPaddle(m,t,o){const R=rig(m);const u=clock(t,5);lieDown(R,1);rotAbout(R,'z',.05*Math.sin(TAU*4*u),0,R.bCenter.y,R.bCenter.z);
  const dip=Math.min(1,1.6*(bell(u,.26,.46)+bell(u,.72,.92)));rotAbout(R,'x',.12*dip,0,R.bCenter.y,R.bCenter.z);headDown(R,-.1*Math.sin(TAU*2*u)+1.7*dip);
  if(m.tail){m.tail.rotation.y+=.4*Math.sin(TAU*8*u);tailUp(R,.5*dip);}wingTurn(R,.2*dip);return {lift:.008*Math.sin(TAU*4*u),sink:.15*scOf(R)};}
/* owl.perch: on its branch — blinks, turns its head right round, wing shuffle. 5 s loop. Root = the branch top */
const OWL_LOOK=[[0,0],[.1,0],[.2,1.0],[.36,1.0],[.46,0],[.56,0],[.66,-1.0],[.8,-1.0],[.9,0],[1,0]];
function owlPerch(m,t,o){const R=rig(m);const u=clock(t,5);if(m.head){m.head.rotation.y+=lerpK(OWL_LOOK,u);m.head.rotation.z+=.12*bell(u,.46,.56);}
  blink(R,Math.max(bell(u,.12,.17),bell(u,.5,.55),bell(u,.92,.97)));const sh=bell(u,.58,.64)+bell(u,.66,.72);wingTurn(R,.35*sh);R.b.rotation.z+=.04*sh*Math.sin(TAU*12*u);breathe(R,t,2.5,.01);return {};}
/* bear.tv: sits back on the sofa (petPose 'sit'), eyes on the TV, laughs twice (bounces, leans back, slaps its paws). 5 s loop */
function bearTV(m,t,o){const R=rig(m);const u=clock(t,5);poseSit(R,seg(t,0,.8));const lg=bell(u,.15,.45)+bell(u,.58,.88),hh=Math.abs(Math.sin(TAU*7*u)),sl=Math.max(0,Math.sin(TAU*7*u));
  sitLean(R,-.2*lg-.05*lg*hh);if(m.head){m.head.rotation.x-=.45*lg+.03*Math.sin(TAU*2*u);m.head.rotation.z+=.15*lg*Math.sin(TAU*3.5*u);}R.b.scale.y*=1+.015*Math.sin(TAU*2*u)+.05*lg*hh;
  R.front.forEach((l,i)=>{l.g.rotation.x-=(.9*sl+.3)*lg;l.g.rotation.z+=(l.g.position.x<0?1:-1)*.35*lg*sl;});if(m.tail)m.tail.rotation.y+=.3*lg*Math.sin(TAU*7*u);return {lift:.07*lg*hh/scOf(R)};}
/* seal.slide: lies flat on its belly to slide down the chute: front flippers back, head up, back flippers spread. Use o.slope {pitch:-angle} on the chute */
function sealSlide(m,t,o){const R=rig(m);const k=seg(t,0,.4);(m.legs||[]).forEach(l=>{l.rotation.x+=.9*k;});if(m.head)m.head.rotation.x+=-.45*k;(m.rear||[]).forEach((r,i)=>{r.rotation.y+=(i?1:-1)*.3*k;});return {hold:true};}
/* monkey.bars: hangs and swings hand over hand along the bars, turns on the last bar, swings back (shop climbing frame and yard bars).
   Root = the first bar's grip point, facing along the bars. o.gap bar spacing (.34 m), o.n swings each way (3), o.swing s per swing (.58), o.turn s (.78). r.bar = the bar it holds */
function monkeyBars(m,t,o){const R=rig(m);o=o||{};const s=scOf(R);if(R.front.length<2)return {noGround:true};
  const gap=(o.gap||.34)/s,n=o.n||3,TS=o.swing||.58,TT=o.turn||.78,half=n*TS+TT,T=2*half;const uu=frac(t/T)*T,back=uu>=half,v=back?uu-half:uu;
  const A=R.front[0],B=R.front[1],oth=x=>x===A?B:A;const len=(A.len+B.len)/2;const sb=!!o.swingBack;const dl=Math.asin(Math.min(.95,gap/2/len))*(sb&&back?-1:1);   /* swingBack: no turn, swings back facing the same way (tricksB) */
  const h0=n%2?B:A;let hold,h,tilt=0,yaw,pos,turnK=0,swing=false;
  if(v<n*TS){const j=Math.floor(v/TS);h=(v-j*TS)/TS;swing=true;if(!back){hold=j%2?B:A;pos=j;yaw=0;}else{hold=j%2?oth(h0):h0;pos=n-j;yaw=PI;}tilt=.5*Math.sin(PI*h);}
  else{h=(v-n*TS)/TT;turnK=ease(h);if(!back){hold=h0;pos=n;yaw=PI*turnK;}else{hold=A;pos=0;yaw=PI+PI*turnK;}}
  if(sb){yaw=0;if(back)tilt=-tilt;}
  const free=oth(hold);const bodyX=-(PI/2+tilt);rotAbout(R,'x',bodyX,0,R.bCenter.y,R.bCenter.z);
  const wHold=swing?-PI+dl-2*dl*ease(h):-PI,wFree=swing?-PI-dl+2*dl*ease(h)-.35*bell(h,.1,.9):-PI+.6*bell(h,0,1);
  hold.g.rotation.x+=wHold-bodyX;free.g.rotation.x+=wFree-bodyX;
  R.hind.forEach((l,i)=>{l.g.rotation.x+=-.3-.3*tilt+.1*Math.sin(TAU*t*1.7+i)-bodyX;});if(m.head)m.head.rotation.x+=1.5+.8*tilt;if(m.tail)m.tail.rotation.y+=.3*Math.sin(TAU*t/2);
  /* the holding paw on the bar: shift the body so its tip is at the grip point, turn about it, move along to bar pos */
  if(!R.tip)R.tip=new Map();if(!R.tip.has(hold.g)){const bb=boxIn(hold.g,hold.g,new THREE.Box3());R.tip.set(hold.g,new THREE.Vector3((bb.min.x+bb.max.x)/2,bb.min.y+.02,(bb.min.z+bb.max.z)/2));}
  R.root.updateMatrixWorld(true);const tip=hold.g.localToWorld(R.tip.get(hold.g).clone());R.root.worldToLocal(tip);R.b.position.sub(tip);
  _q.setFromAxisAngle(Y,yaw);R.b.position.applyQuaternion(_q);R.b.quaternion.premultiply(_q);R.b.position.z+=pos*gap;return {noGround:true,bar:pos,hand:hold===A?0:1};}

/* ---------- PETS AT HOME (petsHome preview) ---------- */
/* bear.denNap: lies down in its den, head low and to the side, slow breathing (walking in and turning is the game's route). Holds */
function bearDenNap(m,t,o){const R=rig(m);const k=seg(t,0,1.1);lieDown(R,k);headDown(R,.3*k);if(m.head)m.head.rotation.y+=-.45*k;tailUp(R,-.3*k);if(t>1.1)breathe(R,t,3,.02);return {hold:true,sleeping:t>1.1};}
/* seal.nap: lies flat by its pond: chin down, head to the side, front flippers out flat, tail down, slow breathing. Holds */
function sealNap(m,t,o){const R=rig(m);const k=seg(t,0,1);if(m.head){m.head.rotation.x+=.32*k;m.head.rotation.y+=-.35*k;}(m.legs||[]).forEach(l=>{l.rotation.z+=Math.sign(l.position.x)*.35*k;l.rotation.x+=-.2*k;});
  if(m.tail)m.tail.rotation.x+=.25*k;if(t>1)breathe(R,t,3,.025);return {hold:true,sleeping:t>1};}
/* pet.takeFood: food from your hand — leans up to the hand, takes it, chews, steps back. 2 s, then the game plays pet.happyDance (favourite) */
function takeFood(m,t,o){const R=rig(m),K=kindOf(R);const ln=bell(t,0,1.3);if(m.head)m.head.rotation.x+=-.18*ln;R.b.position.z+=R.Lz*.06*ln;
  const chew=t>.6&&t<1.6?.08*Math.abs(Math.sin(TAU*3*t)):0;headDown(R,chew,.3);wag(R,K.wag*1.3+.2,K.wagF+2,t);return {done:t>=2};}
/* person.offerFood: crouches and holds the food out low; o.target = where the hand goes (root frame, metres; default in front, low) */
function shoulderOf(R,i){const a=R.m.arms[i];R.root.updateMatrixWorld(true);return R.root.worldToLocal(a.getWorldPosition(new THREE.Vector3()));}
function aimAt(R,i,T,k){const a=R.m.arms&&R.m.arms[i];if(!a||!k)return;const s=scOf(R);const sh=shoulderOf(R,i);aimArm(R,i,new THREE.Vector3(T[0]/s-sh.x,T[1]/s-sh.y,T[2]/s-sh.z),k);}
function offerFood(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const k=seg(t,0,.6);lunge(R,.4*k,.3*k);if(m.head)m.head.rotation.x+=.3*k;aimAt(R,1,o.target||[-.1,.3,.55],seg(t,.2,.8));return {hold:true};}

/* ---------- YARD TRAINING GEAR (yardGear preview) ---------- */
/* jump run: the pet's run plus a jump over each bar or hurdle. o.dist = metres along the course; o.jumps = [[at, height], ...] (metres); o.jw = take-off distance before/after */
function jumpRun(m,t,o,gait,jw0){const R=rig(m),K=kindOf(R);o=o||{};const s=scOf(R);const d=o.dist!=null?o.dist:t*1.5;const jw=o.jw||jw0;let air=null;
  for(const [at,hh] of (o.jumps||[]))if(d>at-jw&&d<at+jw*.9){const v=(d-(at-jw))/(jw*1.9);air={v,hh};}
  if(!air){if(gait==='gallop'){const A=.5,ph=phaseOf(R,t,o,A);gaitLegs(R,ph,A,1,'gallop',K.knee);rotAbout(R,'x',.06*Math.sin(TAU*ph),0,R.bCenter.y,R.bCenter.z);wag(R,.4,8,t);return {};}
    return petWalk(m,t,o);}
  airLegs(R,air.v);R.legs.forEach(l=>{l.g.rotation.x+=(l.front?-.25:.25)*Math.sin(PI*air.v);});rotAbout(R,'x',-.25*Math.cos(PI*air.v),0,R.bCenter.y,R.bCenter.z);wag(R,.4,8,t);
  return {lift:arc(air.v,0,1,air.hh/s)};}
/* cat.wand: crouches (tail twitching), sits up and swats the feather with one paw, then the other. 4 s loop. r.hit = how hard the feather was just hit (the wand is the game's) */
function catWand(m,t,o){const R=rig(m);const u=clock(t,4);const cr=bell(u,.02,.24);if(cr){lieDown(R,.35*cr);if(m.tail)m.tail.rotation.y+=.5*Math.sin(TAU*8*u)*cr;if(m.head)m.head.rotation.x-=.15*cr;}
  const up=seg(u,.22,.28)*(1-seg(u,.78,.88));const hits=[.3,.42,.6,.66];
  if(up){sitPose(R,up);rotAbout(R,'x',-.2*up,0,R.hind[0]?R.hind[0].g.position.y:0,R.hind[0]?R.hind[0].g.position.z:0);if(m.head)m.head.rotation.x-=.15*up;
    R.front.forEach((l,i)=>{let a=0;hits.forEach((h,k)=>{if(((k<2||k===3)===(i===0))||k===2)a=Math.max(a,bell(u,h-.06,h+.05));});l.g.rotation.x+=-(.9+1.0*a)*up+.2*up;});tailUp(R,.3*up);}
  let hit=0;hits.forEach(h=>{const dd=u*4-h*4;if(dd>0)hit+=Math.exp(-dd*3.5)*Math.sin(dd*10);});wag(R,.3,1,t);return {hit};}
/* hamster.wheel: runs in place on its wheel. r.speed = running speed (m/s): the game turns the wheel by speed / radius */
function hamsterWheel(m,t,o){const R=rig(m);const f=6,A=.5;gaitLegs(R,t*f,A,1,'trot');rotAbout(R,'x',.03*Math.sin(TAU*f*t),0,R.bCenter.y,R.bCenter.z);if(m.head)m.head.rotation.x+=.05*Math.sin(TAU*2*f*t);
  return {lift:.012*Math.abs(Math.sin(TAU*2*f*t))/scOf(R),speed:stride(m,A)*f};}
/* bear.logPush: walks on its hind legs pushing its log (front paws up on the log, body tipped up), rests, pushes it back. o.dist = metres walked (back = smaller), o.reach front paw lift (1.1) */
function bearLogPush(m,t,o){const R=rig(m);o=o||{};const A=.3,ph=phaseOf(R,t,o,A);gaitLegs(R,ph,A,1,'walk',.8);const hz=R.hind.length?R.hind[0].g.position.z:0;
  rotAbout(R,'x',-.18,0,0,hz);R.front.forEach(l=>{l.g.quaternion.copy(R.rest.get(l.g).q);l.g.rotation.x+=-(o.reach||1.1)+.06*Math.sin(TAU*ph);});if(m.head)m.head.rotation.x+=.2;return {};}
/* capy.hopIn: crouches, hops up over the rim into the warm bath (o.height = rim height, m), lands (then capy.tub). 1.2 s */
function capyHopIn(m,t,o){const R=rig(m);o=o||{};const s=scOf(R);const c=bell(t,0,.35);if(c)lieDown(R,.3*c);const u=cl((t-.3)/.8);let lift=0;if(u>0&&u<1){lift=arc(u,0,1,((o.height||.55)+.15)/s);airLegs(R,u);rotAbout(R,'x',-.3*Math.cos(PI*u),0,R.bCenter.y,R.bCenter.z);}
  return {lift,done:t>=1.2};}
/* duck.splash: hops off the ramp into the tub, wings flapping, legs tucked (then duck.paddle). 1 s; o.height = jump height (.35) */
function duckSplash(m,t,o){const R=rig(m);o=o||{};const u=cl(t);const a=Math.sin(PI*u);wingTurn(R,.9*a);lieDown(R,.6*a+(u>.5?.4*(u-.5)*2:0));return {lift:arc(u,0,1,(o.height||.35)/scOf(R)),done:t>=1};}
/* owl.fly: flying pose — body nearly level, legs tucked back, both wings flap (3 a second), a small bob (o.glide: wings out, still). The game moves it along its flight path. No ground fix */
function owlFly(m,t,o){const R=rig(m);o=o||{};rotAbout(R,'x',.18,0,R.bCenter.y,R.bCenter.z);R.legs.forEach(l=>{l.g.rotation.x+=1.1;});headDown(R,-.12);
  const fl=Math.sin(TAU*3*t);wingTurn(R,o.glide?.9:.35+1.1*(.5+.5*fl));if(m.tail)m.tail.rotation.x+=-.3;return {noGround:true,lift:.04*Math.sin(TAU*3*t-1)/scOf(R)};}

/* ---------- BIG PETS, VET, LICENSE (bigPets preview) ---------- */
/* pet.wait: waits by a door — sits (the seal lies flat, chin down, flippers out), looks around, sighs twice, looks at the door (o.look angle). 6 s loop */
function petWait(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const u=clock(t,6);const into=seg(t,0,.8);const door=(o.look==null?-.6:o.look)*into;
  const look=seg(u,.1,.14)*(1-seg(u,.38,.42)),sg=bell(u,.5,.6)+.8*bell(u,.64,.72);
  if(R.kind==='seal'){(m.legs||[]).forEach(l=>{l.rotation.z+=Math.sign(l.position.x)*.35*into;});if(m.head){m.head.rotation.y+=door*(1-look)+look*.7*Math.sin(TAU*(u-.1)/.28);m.head.rotation.x+=.3*into*(1-look)-.15*look-.12*sg;}
    R.b.scale.x*=1+.04*sg;R.b.scale.y*=1+.07*sg;R.b.scale.z*=1+.02*sg;return {};}
  sitPose(R,into);if(m.head){m.head.rotation.y+=door*(1-look)+look*.55*Math.sin(TAU*(u-.1)/.28);}headDown(R,.12*sg-.05*look);breathe(R,t,3,.012+.05*sg);wag(R,K.wag*.2,K.wagF*.5,t);return {};}
/* pet.waitLie: lies down with a sigh while waiting, ears perk up at the end (o.perk 0..1 from the game when you come back) */
function petWaitLie(m,t,o){const R=rig(m);o=o||{};const k=seg(t,0,1);lieDown(R,k);const sg=bell(clock(t,6),.1,.3);breathe(R,t,3,.015+.06*sg);headDown(R,.2*k+.1*sg);
  const pk=o.perk||0;if(m.head){m.head.rotation.x-=.35*pk;m.head.rotation.y+=-.35*pk;}ears(R,-.3*pk);return {hold:true};}
/* pet.greet: jumps up and says hello — two hops, happy wag (the seal: head up, back flippers wave). 1.6 s */
function petGreet(m,t,o){const R=rig(m),K=kindOf(R);const u=cl(t/1.6)*1.6;let lift=0;
  if(R.kind==='seal'){if(m.head)m.head.rotation.x-=.35*bell(u,0,1.6);(m.rear||[]).forEach((r,i)=>{r.rotation.y+=(i?1:-1)*.4*Math.sin(TAU*u*3);});sealClapPose(R,bell(u,.2,1.4)*.7,Math.max(0,Math.sin(TAU*u*2.5)));return {done:t>=1.6};}
  for(const [a,b] of [[.1,.55],[.75,1.2]]){const v=(u-a)/(b-a);if(v>0&&v<1){lift=arc(u,a,b,R.H*.32);airLegs(R,v);}}moodOverlay(R,t,'happy');return {lift,done:t>=1.6};}
/* pet.climbOn: climbs onto a platform (the vet's big table), front paws first, then the back (o.h = platform height, m). 1.4 s; afterwards the game puts the root on the platform */
function petClimbOn(m,t,o){const R=rig(m);o=o||{};const s=scOf(R);const u=cl(t/1.4);const fr=bell(u,0,.55),hd=bell(u,.35,.9);
  rotAbout(R,'x',-.45*fr+.3*hd,0,R.bCenter.y,R.bCenter.z);R.front.forEach(l=>{l.g.rotation.x+=-.9*fr;});R.hind.forEach(l=>{l.g.rotation.x+=.6*hd;});
  if(R.kind==='seal')sealGalumph(m,t,{});return {lift:(o.h||.5)/s*ease(cl((u-.1)/.75)),done:t>=1.4};}
/* pet.vetNervous: lies on the exam table, trembles, head low, keeps an eye on the vet (o.look angle). Loop */
function vetNervous(m,t,o){const R=rig(m);o=o||{};const k=seg(t,0,.6);if(R.kind!=='seal')lieDown(R,k);R.b.position.x+=.006*Math.sin(TAU*4.4*t)*k;R.b.position.z+=.004*Math.sin(TAU*3.4*t)*k;
  headDown(R,.22*k);if(m.head)m.head.rotation.y+=((o.look==null?-.55:o.look)+.2*Math.sin(TAU*.6*t))*k;breathe(R,t,.7,.03*k);return {};}
/* pet.takeTreat: takes the nurse's treat (head forward to it, chews), then happy (head up, wag; the seal waves its flippers). 2.4 s */
function takeTreat(m,t,o){const R=rig(m),K=kindOf(R);const take=seg(t,0,.4)*(1-seg(t,1.0,1.3)),chew=t>.4&&t<1.1?Math.max(0,Math.sin(TAU*3*t)):0,happy=seg(t,1.0,1.4);
  if(R.kind!=='seal')lieDown(R,1);headDown(R,-.1*take+.1*chew-.25*happy);if(m.head)m.head.rotation.y+=-.4*take;
  if(R.kind==='seal'){(m.legs||[]).forEach(l=>{l.rotation.x+=-.5*Math.max(0,Math.sin(TAU*2*t))*happy;l.rotation.y+=-Math.sign(l.position.x)*.9*Math.max(0,Math.sin(TAU*2*t))*happy;});if(m.tail)m.tail.rotation.x+=-.25*happy*Math.max(0,Math.sin(TAU*t));}
  else wag(R,(K.wag+.3)*happy,K.wagF+2,t);return {done:t>=2.4};}
/* the license card in a hand (show:license; the game draws it): held by its lower corner, the hand in front of it. Root frame, metres */
function cardPose(R,i,to){const a=R.m.arms[i];if(!a)return null;const h=new THREE.Vector3(...handAt(R,i));const sd=Math.sign(a.position.x)||1;
  const q=new THREE.Quaternion().setFromEuler(new THREE.Euler(-.12,to?Math.atan2(to[0]-h.x,to[2]-h.z):0,0,'YXZ'));const off=new THREE.Vector3(-sd*.1,-.03,.03).applyQuaternion(q);return {p:h.add(off).toArray(),q:q.toArray()};}
/* a point in front of the chest for arm i: forward .4, in .12, down .12 from the shoulder, at arm's length */
function chestHold(R,i,fw,dn,to){const s=scOf(R),sh=shoulderOf(R,i).multiplyScalar(s);const sd=Math.sign(R.m.arms[i].position.x)||1;let f=new THREE.Vector3(0,0,1);if(to){f.set(to[0]-sh.x,0,to[2]-sh.z);if(f.z<.2)f.z=.2;f.normalize();}
  const d=f.clone().multiplyScalar(fw==null?.4:fw).add(new THREE.Vector3(-sd*.12,-(dn==null?.12:dn),0)).setLength(armLenOf(R,i)*s*.99);return sh.add(d).toArray();}   /* the hand comes in toward the middle: the card is held in front of the chest (toward o.showTo) */
/* person.giveCard (Sir Barkley, a person in a top hat, on podium step 2): takes the card out, holds it at his chest, holds it out to o.target (root frame m: the meeting point
   over the step edge), lets go, claps. 4 s. r.card 'hand' | 'given'; r.cardPose {p, q} while in his hand. o.hand: which arm (1) */
function giveCard(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const i=o.hand==null?1:o.hand;const hold=seg(t,.1,.5)*(1-seg(t,1.0,1.3)),out=seg(t,.6,1.0)*(1-seg(t,1.25,1.6));const clap=seg(t,1.7,1.9)*(1-seg(t,2.9,3.2));
  if(hold>0)aimAt(R,i,chestHold(R,i,.32,.3),hold);if(out>0)aimAt(R,i,o.target||[-.1,1.15,.45],out);
  if(clap>0){const c=Math.max(0,Math.sin(TAU*2.2*(t-1.7)));(m.arms||[]).forEach((a,k)=>{a.rotation.x+=-1.0*clap;a.rotation.z+=(Math.sign(a.position.x)||1)*-(.18+.12*c)*clap;});}
  if(m.head)m.head.rotation.x+=-.06*out+.06*clap;const inH=t<1.25;return {done:t>=4,card:inH?'hand':'given',cardPose:inH&&t>.1?cardPose(R,i):null};}
/* person.takeCard (player, on podium step 1): reaches to o.target, takes the card, holds it at chest height (the hand on its lower corner, the face of the card to the front),
   cheers with the other arm, two small bounces. 3.6 s. r.cardPose {p, q}. o.hand (0); o.showTo = where the audience is (root frame m): the card is held toward it */
function takeCard(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const i=o.hand==null?0:o.hand,j=1-i;const take=seg(t,0,.4)*(1-seg(t,.6,.8)),raise=seg(t,.6,1.0)*(1-seg(t,3.2,3.5)),cheer=seg(t,1.0,1.3)*(1-seg(t,3.0,3.3));
  if(take>0)aimAt(R,i,o.target||[.1,1.15,.45],take);if(raise>0)aimAt(R,i,chestHold(R,i,null,null,o.showTo),raise);if(m.arms&&m.arms[i])m.arms[i].rotation.x+=.1*Math.sin(TAU*1.3*t)*cheer;
  const a=m.arms&&m.arms[j];if(a){a.rotation.x+=-.3*cheer;a.rotation.z+=(Math.sign(a.position.x)||1)*(2.4+.25*Math.sin(TAU*1.3*t))*cheer;}if(m.head)m.head.rotation.x+=-.12*raise;
  return {lift:.07*cheer*Math.abs(Math.sin(TAU*.65*t))/scOf(R),done:t>=3.6,card:'hand',cardPose:t>.35?cardPose(R,i,raise>.5?o.showTo:null):null};}
/* ---------- round 4 (31 Oct): show staff (showStaff) ---------- */
/* person.groom: brushes a horse's side in long strokes along the hair (3 per 6 s), the brush lifted off on the way back. The person faces the horse (+z), its side o.dist (.3) in front of
   the brushing shoulder. o.hand (0), o.dir (1 = the strokes run out on the brushing arm's side, -1 the other way). The arm is rigid (no elbow), so the brush runs on the circle the hand can reach.
   r.brush = {p, q} the hand (root frame m): the game draws the brush there (brush model missing); r.on = on the coat */
function personGroom(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const i=o.hand==null?0:o.hand;const s=scOf(R);const L=armLenOf(R,i)*s;
  const u=frac(t/2);let a,lift=0,on;if(u<.62){a=.1+1.2*ease(u/.62);on=1;}else{const v=(u-.62)/.38;a=1.3-1.2*ease(v);lift=.12*Math.sin(PI*v);on=0;}
  rotAbout(R,'y',-.12*Math.cos(a),0,0,0);lunge(R,.17,0);const d=Math.min(L*.97,(o.dist==null?.3:o.dist)+lift),r=Math.sqrt(Math.max(.0004,L*L-d*d));const sx=(o.dir||1)*(Math.sign(m.arms[i].position.x)||1);   /* strokes on the brushing arm's own side */
  aimArm(R,i,new THREE.Vector3(sx*r*Math.cos(a),r*Math.sin(a),d),1);const j=1-i;if(m.arms&&m.arms[j]){m.arms[j].rotation.x+=-.2;m.arms[j].rotation.z+=(Math.sign(m.arms[j].position.x)||1)*.12;}
  if(m.head){m.head.rotation.y+=.25*Math.cos(a)*sx;m.head.rotation.x+=.1;}return {brush:{p:handAt(R,i),q:rootQ(R,m.arms[i]).toArray()},on};}
/* horse.groomed: stands calm while groomed: tail swishes, weight shifts, turns its head toward the groomer (o.look, rad, + = its left) and back. 6 s loop */
function horseGroomed(m,t,o){const R=rig(m);o=o||{};const u=clock(t,6);if(m.tail){m.tail.rotation.z+=.32*Math.sin(TAU*2*u)+.08*Math.sin(TAU*6*u);m.tail.rotation.x+=.05*Math.sin(TAU*2*u);}
  if(m.head){m.head.rotation.y+=-(o.look==null?.32:o.look)*bell(u,.25,.75);m.head.rotation.x+=.05*Math.sin(TAU*2*u);}(m.ears||[]).forEach(e=>{e.rotation.x+=-.2*bell(u,.3,.7);});
  R.hind.forEach((l,k)=>{if(k===0)l.g.rotation.x+=-.1*bell(u,.1,.35);});R.last={gait:'idle',ph:u,lift:0};return {};}
/* person.talk: talks to someone in front (the game turns the root to the listener): small nods, one hand gestures. Loop */
function personTalk(m,t,o){const R=rig(m,{kind:'person'});o=o||{};if(m.head){m.head.rotation.x+=.1*Math.max(0,Math.sin(TAU*1.5*t));m.head.rotation.z+=.04*Math.sin(TAU*.4*t);}
  const a=m.arms&&m.arms[o.hand==null?1:o.hand];if(a)a.rotation.x+=-.35*Math.max(0,Math.sin(TAU*.75*t));breathe(R,t,3,.008);return {};}
/* coach.directTo: turns toward o.target (root frame m: where to go, e.g. Stan at the jump field), talks, points at it with the arm on that side, turns back. 4 s */
function coachDirectTo(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const T=new THREE.Vector3(...(o.target||[3,0,3]));const yaw=Math.atan2(T.x,T.z);const turn=seg(t,0,.4)*(1-seg(t,3.4,4));
  const s=scOf(R);const i=o.hand!=null?o.hand:(m.arms&&m.arms[1]&&Math.sign(m.arms[1].position.x)===Math.sign(T.x||1)?1:0);
  const pt=seg(t,.5,.8)*(1-seg(t,3.0,3.3));if(m.head){m.head.rotation.x+=.1*Math.max(0,Math.sin(TAU*1.5*t))*(1-pt);m.head.rotation.y+=.25*pt*Math.sign(T.x||1)*0;}
  placeB(R,0,0,.6*yaw*turn);if(pt>0){const sh=shoulderOf(R,i).multiplyScalar(s);const d=T.clone().sub(sh);d.y=0;d.normalize().add(new THREE.Vector3(0,.25,0));aimArm(R,i,d,pt);}
  return {done:t>=4};}

/* ---------- FARM CHORES (farmChores preview) ---------- */
/* person.reach: bends down (deeper for a lower target) and reaches one hand to o.target (root frame, m): the egg in the nest box, the basket. o.hand 0 | 1. Holds */
function personReach(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const T=o.target||[-.1,.8,.45];const s=scOf(R);const low=cl((.9-T[1]/s)/.7,0,1);const k=seg(t,0,.5);
  lunge(R,(.12+.55*low)*k,(.08+.25*low)*k);if(m.head)m.head.rotation.x+=.2*k;aimAt(R,o.hand||0,T,seg(t,.15,.6));return {hold:true};}
/* person.milk: crouches deep by the cow's side, both hands at the udder (o.target, root frame, m), squeezing in turn. Loop */
function personMilk(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const T=o.target||[-.15,.5,.45];const k=seg(t,0,.8);lunge(R,.42*k,.36*k);if(m.head)m.head.rotation.x+=.25*k;
  for(const i of[0,1]){const ph=(i?1:-1)*Math.sin(TAU*1.5*t);aimAt(R,i,[T[0]+(i?-.05:.05),T[1]-.035*ph,T[2]],k);}return {hold:true};}
/* horse.overGate: stands in its stall with its head over the gate, looks round, tail swish. Loop */
function horseOverGate(m,t,o){const R=rig(m);const u=clock(t,5);const k=seg(t,0,.6);headDown(R,.32*k-.05*Math.sin(TAU*u));if(m.head)m.head.rotation.y+=.25*bell(u,.3,.6)-.2*bell(u,.7,.95);
  if(m.tail)m.tail.rotation.z+=.15*Math.sin(TAU*2*u)+.5*bell(u,.1,.2);R.last={gait:'idle',ph:u,lift:0};return {};}

/* ---------- example path: the c15 terrarium (PU['home:tank'], open front, built as is), the snake's root at the tank's origin, unturned.
   Out over the lip clear of the corner posts and rails, a round in front, back in, and into the half-log hide, where the path ENDS in the c15 snakeCoil spiral
   (two rings round (-.6, .06), inner ring raised .13, outer ring over the rock): sleeping = the head at the path end ---------- */
function tankPath(){const RS=.056,GY=.18,LIPT=.29;
  const cz=z=>{const gin=GY+.85*RS,top=LIPT+.85*RS+.07,gout=.85*RS;if(z<=.30)return gin;if(z<.40)return gin+(top-gin)*ease((z-.30)/.10);if(z<=.49)return top;if(z<.88)return top+(gout-top)*ease((z-.49)/.39);return gout;};   /* a clear arch over the .29 lip */
  const IN=[[.95,.10],[.96,-.04],[.93,-.15],[.86,-.18],[.50,-.20],[.34,-.222],[.26,-.255],[.20,-.292],[.10,-.32],[-.10,-.325],[-.24,-.33],[-.305,-.29],[-.31,-.10],[-.309,-.02]];
  const OUT=[[-.54,.12],[-.55,.20],[-.58,.32],[-.6,.45],[-.6,.80],[-.5,1.20],[-.233,1.723],[.29,1.94],[.813,1.723],[.95,1.20],[.95,.80],[.95,.45],[.95,.30]];
  const CC=[-.6,.06],KC=105,ROCK=[-.75,.19,-.12,.154,.066,.11];
  const rockY=(x,z)=>{const q=1-((x-ROCK[0])/(ROCK[3]+RS))**2-((z-ROCK[2])/(ROCK[5]+RS))**2;return q>0?ROCK[1]+(ROCK[4]+.85*RS+.006)*Math.sqrt(q):0;};
  const spiral=()=>{const o=[];for(let k=KC;k>=0;k--){const r=.06+.0022*k,f=.12*(KC-k);o.push([CC[0]+r*Math.cos(f),GY+.85*RS+.13*Math.max(0,1-(r-.06)/.13),CC[1]+r*Math.sin(f)]);}return o;};
  const cr=(P,n)=>{const out=[];const pt=i=>P[Math.max(0,Math.min(P.length-1,i))];
    for(let i=0;i<P.length-1;i++){const p0=pt(i-1),p1=pt(i),p2=pt(i+1),p3=pt(i+2);const dd=(a,b)=>Math.pow(Math.hypot(b[0]-a[0],b[1]-a[1])||1e-4,.5);const t0=0,t1=t0+dd(p0,p1),t2=t1+dd(p1,p2),t3=t2+dd(p2,p3);
      for(let k=0;k<n;k++){const tt=t1+(t2-t1)*k/n;const L=(a,b,ta,tb)=>[0,1].map(j=>(tb-tt)/(tb-ta)*a[j]+(tt-ta)/(tb-ta)*b[j]);const A1=L(p0,p1,t0,t1),A2=L(p1,p2,t1,t2),A3=L(p2,p3,t2,t3),B1=L(A1,A2,t0,t2),B2=L(A2,A3,t1,t3);out.push(L(B1,B2,t1,t2));}}
    out.push(P[P.length-1]);return out;};
  const bp=d=>d<.06?.13:d<.11?.13+.08*ease((d-.06)/.05):d<.16?.21:d<.24?.21-.08*ease((d-.16)/.08):.13;
  const trav=(W,bridge)=>{let br=bridge;return cr(W,40).map(p=>{if(p[1]>.5)br=false;return [p[0],Math.max(cz(p[1]),br?GY+.85*RS+bp(Math.hypot(p[0]-CC[0],p[1]-CC[1])):0),p[1]];});};
  const SP=spiral();let PTS=[...trav([[.95,.30],...IN,[SP[0][0],SP[0][2]]]),...SP.slice(1)];const JS0=PTS.length-1;
  PTS.push(...trav([[SP[SP.length-1][0],SP[SP.length-1][2]],...OUT,...IN,[SP[0][0],SP[0][2]]],true).slice(1),...SP.slice(1));
  {const raw=PTS.map(p=>Math.max(p[1],rockY(p[0],p[2])));const w=6,n=raw.length;const mx=raw.map((_,i)=>{let m=0;for(let j=-w;j<=w;j++)m=Math.max(m,raw[cl(i+j,0,n-1)]);return m;});
    PTS=PTS.map((p,i)=>{let a=0,c=0;for(let j=-w;j<=w;j++){a+=mx[cl(i+j,0,n-1)];c++;}return [p[0],Math.max(raw[i],a/c),p[2]];});}
  const pts=PTS.map(p=>[p[0],p[1]-.85*RS,p[2]]);const C=[0];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];C.push(C[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]));}
  const near=(x,z,from)=>{let best=1e9,bs=0;for(let i=0;i<pts.length;i++){if(from!=null&&C[i]<from)continue;const d=Math.hypot(pts[i][0]-x,pts[i][2]-z);if(d<best-1e-9){best=d;bs=C[i];}}return bs;};
  const LEN=C[C.length-1],S0=C[JS0],SA=near(.95,1.25,S0+1),SB=LEN-1e-4;
  return {pts,len:LEN,asleep:S0,out:[S0,SA],in:[SA,SB],sleep:SB};}

/* ======================= round 3 (31 Oct): Pet Show tricks (tricksA, tricksB), toy play (toyPlay), farm feeding and petting (farmFeed) ======================= */
/* the trick frame: the pet starts at the root, facing +z (its own forward). Gear tricks travel: the body moves away from the root and comes back.
   The game puts the gear where COZY_MOVES.trickGear(kind, trick) says (pet frame, metres). A trick lasts TT seconds (done), unless the table says otherwise. */
const TT=5;
const uT=(t,T)=>cl(t/(T||TT));
/* move + turn the whole model inside its root (metres, pet frame); call it last in a move (later rotAbout calls would turn about the new place) */
function placeB(R,x,z,yaw){const T=R.top||R.b,s=scOf(R);if(yaw){_q.setFromAxisAngle(Y,yaw);T.position.applyQuaternion(_q);T.quaternion.premultiply(_q);}T.position.x+=x/s;T.position.z+=z/s;}
/* preview world → pet frame. A = tricksA (baked rig: the model faces +x at heading h); B = tricksB / toyPlay (the model's own +z at yaw) */
function frameA(Ax,Az,h0){const p=-(h0+PI/2),c=Math.cos(p),s=Math.sin(p);return {pos:(x,z)=>{x-=Ax;z-=Az;return [x*c+z*s,-x*s+z*c];},yaw:h=>h-h0,rot:r=>r+p};}
/* path of lines and arcs: ['L',x0,z0,x1,z1] | ['A',cx,cz,r,a0,a1]; at(d) → {x,z,yaw} (yaw for a model facing +z) */
function segPath(segs){const L=segs.map(s=>s[0]==='L'?Math.hypot(s[3]-s[1],s[4]-s[2]):Math.abs(s[5]-s[4])*s[3]);const tot=L.reduce((a,b)=>a+b,0);
  return {tot,at(d){d=((d%tot)+tot)%tot;let i=0;while(i<segs.length-1&&d>L[i]){d-=L[i];i++;}const s=segs[i],u=L[i]?d/L[i]:0;
    if(s[0]==='L'){const dx=s[3]-s[1],dz=s[4]-s[2];return {x:s[1]+dx*u,z:s[2]+dz*u,yaw:Math.atan2(dx,dz)};}
    const a=s[4]+(s[5]-s[4])*u,sg=Math.sign(s[5]-s[4]);return {x:s[1]+s[3]*Math.cos(a),z:s[2]+s[3]*Math.sin(a),yaw:Math.atan2(-Math.sin(a)*sg,Math.cos(a)*sg)};}};}
/* tuck (front feet back, hind feet forward) and stretch (front reach, hind back) for jumps */
function tuckL(R,k){R.legs.forEach(l=>{l.g.rotation.x+=(l.front?.75:-.75)*k;});}
function stretchL(R,k){R.legs.forEach(l=>{l.g.rotation.x+=(l.front?-.6:.75)*k;});}
/* bird wings (c14 m.wings): open = lower edge out, away from the body (wings[0] at -x turns by -a) */
function wingOpen(R,a){if(!a)return;const W=R.m.wings;if(W&&W.length){W.forEach(w=>{w.rotation.z+=Math.sign(w.position.x)*a;});return;}wingTurn(R,a);}
/* best joint turn (rotation x and z, y fixed) so a point tip (joint space) lands on T (parent space); grid then refine */
function solveJ(g,tip,T,ry){const e=new THREE.Euler(),v=new THREE.Vector3();const y=ry||0;const f=(x,z)=>{e.set(x,y,z);v.copy(tip).multiply(g.scale).applyEuler(e).add(g.position);return v.distanceTo(T);};
  let b=[0,0,1e9];for(let x=-3.2;x<=3.2;x+=.1)for(let z=-1.6;z<=1.6;z+=.1){const d=f(x,z);if(d<b[2])b=[x,z,d];}
  let st=.05;for(let i=0;i<8;i++){let imp=true;while(imp){imp=false;for(const [dx,dz] of[[st,0],[-st,0],[0,st],[0,-st],[st,st],[-st,-st],[st,-st],[-st,st]]){const d=f(b[0]+dx,b[1]+dz);if(d<b[2]-1e-7){b=[b[0]+dx,b[1]+dz,d];imp=true;}}}st/=2;}return b;}
/* a point of obj, in the root frame, metres */
function rootPt(R,obj,p){R.root.updateMatrixWorld(true);const w=obj.localToWorld(p.clone());R.root.worldToLocal(w);return w.multiplyScalar(scOf(R));}
function rootQ(R,obj){R.root.updateMatrixWorld(true);return R.root.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(obj.getWorldQuaternion(new THREE.Quaternion()));}
/* oopsie (result 0): a wobble and two little bounces, then a sheepish look down */
function trOops(m,t,o){const R=rig(m);const k=cl(t/1.1);R.b.rotation.z+=Math.sin(t*18)*.25*(1-k);headDown(R,.3*seg(t,.8,1.4));tailUp(R,-.4*seg(t,.8,1.4));return {lift:Math.abs(Math.sin(t*6))*.1*(1-k)/scOf(R),done:t>=2};}

/* ---------------- DOGS (dog, pug, pomchi, sausage) ---------------- */
/* High five: sits, raises a front paw, two taps (o.wave: waves instead), paw down, stands */
function trHighFive(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const u=uT(t);const k=seg(u,.05,.18)*(1-seg(u,.82,.95));if(k)sitPose(R,k);
  const l=R.front.find(q=>!q.left)||R.front[0];const a=seg(u,.2,.32)*(1-seg(u,.68,.8));const wave=o.wave||0;
  const tap=wave?0:bell(u,.38,.47)+bell(u,.5,.59);const wv=wave?Math.sin(TAU*(u-.32)/.36*wave)*bell(u,.32,.68):0;
  if(l&&a){l.g.rotation.x+=-(2.3*a+.35*tap);l.g.rotation.z+=(l.left?-1:1)*((o.wave?1.15:.85)+.4*wv)*a;}if(m.head){m.head.rotation.x-=.6*a;m.head.rotation.z+=.12*wv;}
  wag(R,(o.wa==null?.25+.5*k:o.wa),(o.wf||10)/2,t);return {};}
/* Agility jump (train:dog): gallops round its two bars, jumping each. o.zl (.9), o.r (.625), o.bars [h1, h2] jump heights (.62, .8) */
function agilityPath(o){o=o||{};const zl=o.zl||.9,r=o.r||.625;const P=segPath([['L',0,-zl,0,zl],['A',r,zl,r,PI,0],['L',2*r,zl,2*r,-zl],['A',r,-zl,r,0,-PI]]);const L1=2*zl,LA=PI*r;
  const s0=L1+LA/2,p0=P.at(s0);const F=v=>{const x=v.x-p0.x,z=v.z-p0.z,c=Math.cos(-p0.yaw),s=Math.sin(-p0.yaw);return {x:x*c+z*s,z:-x*s+z*c,yaw:v.yaw-p0.yaw};};
  return {P,s0,F,bars:[zl,L1+LA+zl],gear:F({x:2.0,z:0,yaw:0})};}   /* train:dog (scale 1.25) origin, design frame: bars at x 0 and 1.25 */
function trAgility(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const u=uT(t);const G=agilityPath(o);const pr=seg(u,.08,.92),d=G.s0+G.P.tot*pr;const q=G.F(G.P.at(d));const run=Math.min(1,bell(u,.08,.92)*1.6);
  const J=o.big?1.3:1,hs=o.bars||[.62,.8];let lift=0,air=null;
  G.bars.forEach((jb,j)=>{const dd=((d-jb)%G.P.tot+G.P.tot)%G.P.tot,e=dd>G.P.tot/2?dd-G.P.tot:dd;if(Math.abs(e)<.58){const v=(e+.58)/1.16;air=v;lift=arc(v,0,1,hs[j]*J);}});
  if(air!=null){tuckL(R,1.05*Math.sin(PI*air));rotAbout(R,'x',-.28*Math.cos(PI*air),0,R.bCenter.y,R.bCenter.z);}
  else{const A=.5;gaitLegs(R,(d-G.s0)/stride(m,A)*1.25,A,run,'gallop',K.knee);rotAbout(R,'x',.06*Math.sin(TAU*(d-G.s0)/stride(m,A)*1.25)*run,0,R.bCenter.y,R.bCenter.z);}
  if(run<1&&m.head)m.head.rotation.y+=-.35*(1-run)*(u<.5?bell(u,0,.16):bell(u,.84,1))*2;wag(R,run<1?.6:.4,run<1?5:4,t);
  placeB(R,q.x,q.z,q.yaw);return {lift:lift/scOf(R)};}
/* Roll over: lies down, rolls right over its back (belly up), back again, stands, a little shake. Rolls sideways about D = 2.2 × width */
function trRoll(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const u=uT(t);const s=scOf(R);const k=seg(u,.04,.15)*(1-seg(u,.83,.93));lieDown(R,k);
  const r1=seg(u,.17,.47),r2=seg(u,.52,.82);const rot=-TAU*r1+TAU*r2;const W=(R.Wx||(R.Wx=boxIn(R.root,R.b,new THREE.Box3()).getSize(new THREE.Vector3()).x));const D=(o.D||2.2*W*s);
  if(rot){const up=Math.abs(Math.sin(rot/2));R.legs.forEach((l,i)=>{l.g.rotation.x+=(l.front?-.45:.35)*up+.25*up*Math.sin(TAU*(u*8+i*.25));});headDown(R,-.2*up);
    rotAbout(R,'z',rot,0,R.bCenter.y*.8,R.bCenter.z);}
  const sh=bell(u,.93,1);if(sh)rotAbout(R,'z',.12*sh*Math.sin(TAU*u*25),0,R.bCenter.y,R.bCenter.z);if(m.head)m.head.rotation.y-=.3*bell(u,.47,.52);
  if(o.wa!==0)wag(R,.5,5,t);placeB(R,-D*(r1-r2),0,0);return {};}

/* ---------------- CAT ---------------- */
/* Spin (pirouette): rears up on its hind feet, turns right round (big: twice), comes down */
function trPirouette(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const k=seg(u,.08,.22)*(1-seg(u,.74,.88));const ang=(o.rear||.95)*k;const hz=R.hind.length?R.hind[0].g.position.z:0;
  rotAbout(R,'y',TAU*(o.big?2:1)*seg(u,.24,.72),0,0,hz);rotAbout(R,'x',-ang,0,R.base,hz);R.front.forEach(l=>{l.g.rotation.x+=1.0*k;});R.hind.forEach(l=>{l.g.rotation.x+=ang;});
  if(m.head){m.head.rotation.x+=.65*ang;m.head.rotation.y+=-.25*bell(u,.74,.95);}tailUp(R,-.4*k);wag(R,.3,3,t);return {};}
/* Tower climb and leap (train:cat): jumps onto platform 1, round the pole onto platform 2, looks round, leaps down in front, walks back round to its spot */
const CAT_TW={s:1.6,A:[1.45,0],h0:PI};
function trCatTower(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const u=uT(t);const s=CAT_TW.s;const y1=(o.h1||(.6+.11)*s),y2=(o.h2||(1.05+.11)*s);
  const A=CAT_TW.A,P1=[.56,0],P2=[-.55,.15],LD=[-.9,1.2];const F=frameA(A[0],A[1],CAT_TW.h0);
  const cv=new THREE.QuadraticBezierCurve(new THREE.Vector2(P1[0],0),new THREE.Vector2(.05,1.0),new THREE.Vector2(P2[0],P2[1]));
  if(!R.cache.catBack)R.cache.catBack=new THREE.CatmullRomCurve3([[LD[0],LD[1]],[.3,1.4],[1.45,1.1],[2.05,.45],[A[0],A[1]]].map(p=>new THREE.Vector3(p[0],0,p[1])));const back=R.cache.catBack;
  let x,z=0,y=0,h=PI,air=null,hh=0;
  const cr=bell(u,.02,.08)+bell(u,.23,.28)+bell(u,.48,.52),ld=bell(u,.19,.24)+bell(u,.39,.44)+bell(u,.6,.65);
  if(u<.07)x=A[0];
  else if(u<.2){const v=cl((u-.07)/.13);x=A[0]+(P1[0]-A[0])*v;y=y1*ease(v);air=v;hh=.55;}
  else if(u<.27)x=P1[0],y=y1;
  else if(u<.4){const v=cl((u-.27)/.13);const p=cv.getPoint(ease(v)),tg=cv.getTangent(ease(v));x=p.x;z=p.y;y=y1+(y2-y1)*ease(v);air=v;hh=.45;h=Math.atan2(-tg.y,tg.x);if(h<0)h+=TAU;}
  else if(u<.51){x=P2[0];z=P2[1];y=y2;h=PI+PI/2*seg(u,.43,.49);if(m.tail)m.tail.rotation.x+=-.6*bell(u,.43,.51);}
  else if(u<.61){const v=cl((u-.51)/.1);const g=1-(1-v)*(1-v);h=1.5*PI;x=P2[0]+(LD[0]-P2[0])*g;z=P2[1]+(LD[1]-P2[1])*g;y=y2*(1-v*v);air=v;hh=.35;}
  else if(u<.66){x=LD[0];z=LD[1];h=1.5*PI;}
  else{const v=seg(u,.66,.97);const p=back.getPointAt(v),tg=back.getTangentAt(v);x=p.x;z=p.z;h=Math.atan2(-tg.z,tg.x);if(h<0)h+=TAU;h=h+(PI-h)*seg(u,.93,.99);
    gaitLegs(R,v*back.getLength()/stride(m),K.A,Math.min(1,bell(u,.66,.99)*2.5),'walk');}
  if(air!=null){tuckL(R,1.1*Math.sin(PI*air));rotAbout(R,'x',-.3*Math.cos(PI*air),0,R.bCenter.y,R.bCenter.z);y+=arc(air,0,1,hh);}
  if(cr)lieDown(R,.3*cr);if(ld)squash(R,ld);if(m.head)m.head.rotation.y-=.45*bell(u,.6,.7);
  const q=F.pos(x,z);placeB(R,q[0],q[1],F.yaw(h));return {lift:y/scOf(R)};}

/* ---------------- BUNNY ---------------- */
/* Big jump: crouches, a big hop with a twist in the air, lands, a little hop */
function trBigJump(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const J=o.big?1.3:1;const c=bell(u,.08,.22),l=bell(u,.52,.6),c2=bell(u,.6,.66),l2=bell(u,.78,.84);
  if(c+c2)lieDown(R,.35*(c+.5*c2));if(l+l2)squash(R,l+.6*l2);let lift=0;const v=cl((u-.2)/.33);
  if(v>0&&v<1){lift=arc(v,0,1,(o.h||.75)*J);stretchL(R,Math.sin(PI*v));rotAbout(R,'y',.55*Math.sin(TAU*v),0,R.bCenter.y,R.bCenter.z);rotAbout(R,'z',.3*Math.sin(PI*v)*Math.sin(TAU*v),0,R.bCenter.y,R.bCenter.z);rotAbout(R,'x',-.25*Math.cos(PI*v),0,R.bCenter.y,R.bCenter.z);}
  const v2=cl((u-.65)/.14);if(v2>0&&v2<1){lift=arc(v2,0,1,.2);tuckL(R,.7*Math.sin(PI*v2));}
  if(o.wings)wingOpen(R,o.wings(u));return {lift:lift/scOf(R)};}
/* Hurdle hops (train:bunny): bounds forward over three hurdles, turns round, back over them, turns round */
function trHurdles(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const u=uT(t);const X=o.X||1.9,J=o.big?1.3:1;const hs=o.hurdles||[[.6,.62],[1.9,.7],[3.2,.78]];let z,yaw,lift=0;
  const leg=(v,dir)=>{const zz=dir>0?2*X*v:2*X-2*X*v;let air=false;for(const [zb,hh] of hs){const e=(zz-zb)*dir;if(Math.abs(e)<.5){air=true;const w=(e+.5);lift=arc(w,0,1,hh*J);stretchL(R,Math.sin(PI*w));rotAbout(R,'x',-.3*Math.cos(PI*w),0,R.bCenter.y,R.bCenter.z);}}
    if(!air)gaitLegs(R,v*2*X/stride(m)*1.4,K.A,.75*Math.min(1,bell(v,0,1)*4),'bound');return zz;};
  if(u<.04){z=0;yaw=0;}else if(u<.44){z=leg(seg(u,.04,.44),1);yaw=0;}else if(u<.54){z=2*X;yaw=PI*seg(u,.45,.53);gaitLegs(R,u*14,K.A,.45*bell(u,.44,.54),'walk');}
  else if(u<.94){z=leg(seg(u,.54,.94),-1);yaw=PI;}else{z=0;yaw=PI+PI*seg(u,.94,1);gaitLegs(R,u*14,K.A,.45*bell(u,.94,1),'walk');}
  placeB(R,0,z,yaw);return {lift:lift/scOf(R)};}
/* Spin: crouches, hops and turns right round in the air (big: twice), lands */
function trHopSpin(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const c=bell(u,.08,.2),l=bell(u,.56,.64);if(c)lieDown(R,.35*c);if(l)squash(R,l);let lift=0;const v=cl((u-.18)/.4);
  if(v>0&&v<1){lift=arc(v,0,1,(o.h||.55)*(o.big?1.3:1));rotAbout(R,'y',TAU*(o.big?2:1)*ease(v),0,0,R.bCenter.z);tuckL(R,.8*Math.sin(PI*v));}if(m.head)m.head.rotation.y-=.3*bell(u,.66,.95);return {lift:lift/scOf(R)};}

/* ---------------- HAMSTER ---------------- */
/* Spin: chases its tail, two quick small circles (radius .13 m) */
function trTailChase(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const u=uT(t);const rr=o.r||.13;const th=2*TAU*(o.big?1.5:1)*seg(u,.1,.9);const run=Math.min(1,bell(u,.1,.9)*2);
  gaitLegs(R,th*rr/stride(m,.5)*1.6,.5,run,'trot');rotAbout(R,'z',.18*run,0,R.bCenter.y,R.bCenter.z);if(m.head){m.head.rotation.y+=.25*run;m.head.rotation.x+=.1*run;}
  placeB(R,-rr*(1-Math.cos(th)),rr*Math.sin(th),-th);return {lift:.01*Math.abs(Math.sin(TAU*th*rr/stride(m,.5)*3.2))*run/scOf(R)};}
/* Maze run (train:hamster at scale 4.4): into the low tube, up the riser, peeks out of the top, back down and out the way it came */
const HAM_MZ={s:4.4};
function trMaze(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const s=scOf(R);const S=HAM_MZ.s;const bcY=R.bCenter.y*s;const by=.04*S,ty1=.09*S,xv=-.32*S,ty2=.34*S,yT=ty1-.03,yTop=ty2-.03;
  if(!R.cache.maze){const c=new THREE.CatmullRomCurve3([[1.0,by+bcY,.85],[.62,by+bcY,.66],[.32,by+bcY+.01,.15],[.05,yT,0],[-.4,yT,0]].map(p=>new THREE.Vector3(...p)));const g=c.getTangentAt(0);R.cache.maze={c,h0:Math.atan2(-g.z,g.x)};}
  const {c:cIn,h0}=R.cache.maze;const F=frameA(1.0,.85,h0);const V=(x,y,z)=>new THREE.Vector3(x,y,z);let p,yaw=PI,pit=0,mv=1;
  if(u<.03){p=cIn.getPointAt(0);yaw=h0;mv=0;}
  else if(u<.17){const v=seg(u,.03,.17);p=cIn.getPointAt(v);const g=cIn.getTangentAt(v);yaw=Math.atan2(-g.z,g.x);}
  else if(u<.25){const v=cl((u-.17)/.08);p=V(-.4+(xv+.4)*v,yT,0);}
  else if(u<.28){p=V(xv,yT,0);pit=PI/2*seg(u,.25,.28);}
  else if(u<.38){p=V(xv,yT+(yTop-yT)*seg(u,.28,.38),0);pit=PI/2;}
  else if(u<.41){p=V(xv,yTop,0);pit=PI/2;yaw=PI+PI/2*seg(u,.38,.41);mv=.4;}
  else if(u<.44){p=V(xv,yTop,0);pit=PI/2*(1-seg(u,.41,.44));yaw=1.5*PI;}
  else if(u<.5){p=V(xv,yTop,.62*bell(u,.44,.5));yaw=1.5*PI;mv=.6;if(m.head)m.head.rotation.y+=.4*Math.sin(TAU*(u-.44)/.06);}
  else if(u<.53){p=V(xv,yTop,0);pit=-PI/2*seg(u,.5,.53);yaw=1.5*PI;}
  else if(u<.63){p=V(xv,yTop+(yT-yTop)*seg(u,.53,.63),0);pit=-PI/2;yaw=1.5*PI;}
  else if(u<.66){p=V(xv,yT,0);pit=-PI/2;yaw=1.5*PI+PI/2*seg(u,.63,.66);mv=.4;}
  else if(u<.69){p=V(xv,yT,0);pit=-PI/2*(1-seg(u,.66,.69));yaw=TAU;}
  else if(u<.77){const v=cl((u-.69)/.08);p=V(xv+(-.4-xv)*v,yT,0);yaw=TAU;}
  else if(u<.92){const v=1-seg(u,.77,.92);p=cIn.getPointAt(v);const g=cIn.getTangentAt(v);yaw=Math.atan2(g.z,-g.x);}
  else{p=cIn.getPointAt(0);const g=cIn.getTangentAt(0),hb=Math.atan2(g.z,-g.x);let d=h0-hb;while(d<0)d+=TAU;yaw=hb+d*seg(u,.92,.99);mv=.5*bell(u,.92,1);}
  gaitLegs(R,7*u,.5,mv,'trot');rotAbout(R,'x',-pit,0,R.bCenter.y,R.bCenter.z);
  const q=F.pos(p.x,p.z);const yw=F.yaw(yaw);   /* body centre to p: turn about the centre, then move it */
  const T=R.top||R.b;const c=R.bCenter.clone();_q.setFromAxisAngle(Y,yw);T.position.sub(c).applyQuaternion(_q).add(c);T.quaternion.premultiply(_q);
  T.position.x+=q[0]/s-c.x;T.position.z+=q[1]/s-c.z;T.position.y+=p.y/s-c.y;return {noGround:true,inside:u>.16&&u<.78};}
/* Roll over: curls into a ball, rolls forward one turn and back (D = 2π × .15 m) */
function trBallRoll(m,t,o){const R=rig(m);const u=uT(t);const k=seg(u,.05,.16)*(1-seg(u,.84,.95));lieDown(R,.6*k);tuckL(R,.8*k);headDown(R,.5*k);tailUp(R,.6*k);
  const f=seg(u,.18,.48),b=seg(u,.52,.82);rotAbout(R,'x',TAU*(f-b),0,R.bCenter.y*.75,R.bCenter.z);if(m.head)m.head.rotation.y-=.3*bell(u,.86,1);placeB(R,0,TAU*.15*(f-b),0);return {};}

/* ---------------- CAPYBARA ---------------- */
/* Dance: slow sway, lifts its feet in turn, rocks side to side */
function trCapyDance(m,t,o){const R=rig(m);const u=uT(t);const e=seg(u,.04,.14)*(1-seg(u,.88,.97));const w=Math.sin(TAU*2*u),st=Math.cos(TAU*2*u);
  R.legs.forEach(l=>{const up=Math.max(0,(l.front?1:-1)*(l.left?1:-1)*st);l.g.rotation.x+=(l.front?-.7:.5)*up*e;});
  rotAbout(R,'y',.45*Math.sin(TAU*u)*e,0,0,R.bCenter.z);rotAbout(R,'z',.28*w*e,0,0,R.bCenter.z);headDown(R,(.35*Math.abs(w)-.1)*e);if(m.head)m.head.rotation.y+=-.5*w*e;
  placeB(R,-.22*w*e,0,0);return {lift:.08*Math.abs(st)*e/scOf(R)};}
/* Spin in its warm bath (train:capybara at 1.35, root = the bath centre on the floor): lies in the water, paddles round once. o.water = water height (.574) */
function trBathSpin(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const s=scOf(R);lieDown(R,.8);R.legs.forEach(l=>{l.g.rotation.x+=.25*Math.sin(TAU*(u*6+(l.front?0:.5)+(l.left?.25:0)));});
  headDown(R,-.05+.1*Math.sin(TAU*2*u));if(m.head)m.head.rotation.y+=.15*Math.sin(TAU*3*u);breathe(R,u,1/3,.03);lids(R,.5);
  rotAbout(R,'y',-TAU*seg(u,.06,.94)+.5,0,0,R.bCenter.z);const T=R.top||R.b;T.position.x-=R.bCenter.x;T.position.z-=R.bCenter.z;
  const bb=boxIn(R.root,R.b,new THREE.Box3());T.position.y+=((o.water||.574)+.42*R.H*s)/s-bb.max.y;return {noGround:true};}

/* ---------------- DUCK ---------------- */
/* Dance: waddle dance, feet in turn, body rocks, wings out and flapping, tail wiggles */
function trDuckDance(m,t,o){const R=rig(m);const u=uT(t);const e=seg(u,.04,.14)*(1-seg(u,.86,.96));const w=Math.sin(TAU*3*u);
  R.legs.forEach(l=>{const up=Math.max(0,(l.left?1:-1)*w);l.g.rotation.x+=-.5*up*e;});rotAbout(R,'y',.3*Math.sin(TAU*u)*e,0,0,R.bCenter.z);rotAbout(R,'z',-.2*w*e,0,0,R.bCenter.z);
  wingOpen(R,(.35+.35*Math.abs(Math.sin(TAU*6*u)))*e);if(m.head){m.head.rotation.x+=.15*Math.sin(TAU*6*u)*e;m.head.rotation.y+=-.2*e;}if(m.tail)m.tail.rotation.y+=.4*Math.sin(TAU*6*u)*e;
  return {lift:.02*Math.abs(w)*e/scOf(R)};}
/* Big jump with wing flaps */
function trDuckJump(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const c=bell(u,.1,.24),l=bell(u,.62,.7);if(c)lieDown(R,.35*c);if(l){lieDown(R,.25*l);squash(R,l);}
  const fl=bell(u,.18,.74);if(fl)wingOpen(R,(.2+1.0*(.5+.5*Math.sin(TAU*5*u)))*fl);let lift=0;const v=cl((u-.22)/.42);
  if(v>0&&v<1){lift=arc(v,0,1,(o.h||.75)*(o.big?1.3:1));R.legs.forEach(q=>{q.g.rotation.x+=.6*Math.sin(PI*v);});if(m.head)m.head.rotation.x-=.2*Math.sin(PI*v);}
  if(m.head)m.head.rotation.y-=.25*bell(u,.74,1);return {lift:lift/scOf(R)};}
/* Spin: waddles round on the spot, wings out */
function trDuckSpin(m,t,o){const R=rig(m),K=kindOf(R);o=o||{};const u=uT(t);const e=seg(u,.08,.2)*(1-seg(u,.8,.92));gaitLegs(R,seg(u,.12,.88)*4,K.A,.7*e,'walk');
  rotAbout(R,'y',TAU*(o.big?2:1)*seg(u,.12,.88),0,0,R.bCenter.z);rotAbout(R,'z',.12*Math.sin(TAU*4*u)*e,0,0,R.bCenter.z);wingOpen(R,.55*e);if(m.head)m.head.rotation.x+=.1*e;return {};}

/* ---------------- OWL (tricksB, the model's own groups) ---------------- */
function trOwlHead(m,t,o){const R=rig(m);const u=uT(t);const L=seg(u,.08,.2)*(1-seg(u,.3,.4)),Rr=seg(u,.46,.58)*(1-seg(u,.68,.78));
  const by=-.12*L+.12*Rr;rotAbout(R,'y',by,0,0,0);if(m.head){m.head.rotation.y+=1.75*L-1.75*Rr-by;m.head.rotation.z+=.3*bell(u,.19,.31)-.3*bell(u,.57,.69)+.28*Math.sin(TAU*2*cl((u-.82)/.12))*bell(u,.82,.94);}
  wingOpen(R,.35*bell(u,.84,.98));blink(R,Math.max(bell(u,.42,.46),bell(u,.9,.94)));return {};}
/* Perch hop (train:owl at 1.7, root under the perch's middle): hops along the perch and back, wings open. o.h = perch top (2.55), o.X = hop (.38) */
function trPerchHop(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const X=o.X||.38;const u1=cl((u-.12)/.2),u2=cl((u-.6)/.2);const a1=u1>0&&u1<1,a2=u2>0&&u2<1;
  const x=-X+2*X*ease(u1)-2*X*ease(u2);const y=arc(u,.12,.32,.4)+arc(u,.6,.8,.4);const open=Math.max(seg(u,.06,.12)*(1-seg(u,.46,.52)),seg(u,.54,.6)*(1-seg(u,.94,.99)));
  const flap=a1||a2?.3*Math.sin(TAU*3*(a1?u1:u2)):0;wingOpen(R,(.95+flap)*open);if(a1||a2)R.legs.forEach(l=>{l.g.rotation.x+=.5*Math.sin(PI*(a1?u1:u2));});
  if(m.head){m.head.rotation.x+=-.15*bell(u,.34,.46)-.15*bell(u,.82,.94);m.head.rotation.z+=.2*bell(u,.34,.46)-.2*bell(u,.82,.94);}
  placeB(R,x,0,0);return {lift:((o.h==null?2.55:o.h)-.008+y)/scOf(R)};}
function trOwlSpin(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const v=cl((u-.16)/.42);const air=v>0&&v<1;rotAbout(R,'y',TAU*(o.big?2:1)*ease(v),0,0,0);
  const open=seg(u,.08,.16)*(1-seg(u,.62,.7));wingOpen(R,(.95+(air?.25*Math.sin(TAU*4*v):0))*open);if(air)R.legs.forEach(l=>{l.g.rotation.x+=.45*Math.sin(PI*v);});
  if(m.head)m.head.rotation.x+=.25*bell(u,.72,.84);rotAbout(R,'x',.12*bell(u,.72,.84),0,0,0);return {lift:arc(u,.16,.58,.6*(o.big?1.3:1))/scOf(R)};}

/* ---------------- MONKEY ---------------- */
const MTIP=new THREE.Vector3(0,-.33,.04);
function trMonkeyClap(m,t,o){const R=rig(m);const u=uT(t);const Q=[0,.33,-.2],sitA=-1.05;
  if(!R.cache.mclap){reset(m);const L=m.legs||[];R.cache.mclap={open:[0,1].map(i=>solveJ(L[i],MTIP,new THREE.Vector3(Math.sign(L[i].position.x)*.3,.3,.36))),shut:[0,1].map(i=>solveJ(L[i],MTIP,new THREE.Vector3(Math.sign(L[i].position.x)*.028,.12,.42)))};}
  const F=R.cache.mclap;const k=seg(u,.06,.2)*(1-seg(u,.82,.95));rotAbout(R,'x',sitA*k,...Q);
  const clap=u>.26&&u<.76?Math.max(0,Math.sin(TAU*4*cl((u-.26)/.5))):0;
  [0,1].forEach(j=>{const l=m.legs[j],a=F.open[j],c=F.shut[j];l.rotation.x+=(a[0]+(c[0]-a[0])*clap)*k;l.rotation.z+=(a[1]+(c[1]-a[1])*clap)*k;});
  [2,3].forEach(i=>{const l=m.legs[i];if(!l)return;l.rotation.x+=.25*k;l.rotation.z+=Math.sign(l.position.x)*.3*k;});
  if(m.tail){m.tail.rotation.x+=.9*k;m.tail.rotation.y+=.25*Math.sin(TAU*3*u)*k;}if(m.head){m.head.rotation.x+=.75*k-.12*clap*k;m.head.rotation.z+=.15*Math.sin(TAU*2*u)*k;}
  return {lift:.03*clap*k/scOf(R)};}
/* Monkey bars (train:monkey): the round-2 bar swing, 4 rungs .3 apart (root = rung 0 grip point) */
function trMonkeyBars(m,t,o){return monkeyBars(m,t,Object.assign({gap:.3,n:4,swingBack:true,turn:.4},o));}
function trMonkeyFlip(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const v=cl((u-.2)/.36);const air=v>0&&v<1;const cr=bell(u,.1,.22)+bell(u,.54,.66);const s=scOf(R);
  R.legs.forEach((l,i)=>{l.g.rotation.x+=(i<2?-.45:.45)*cr;});
  if(air){rotAbout(R,'x',-TAU*(o.big?2:1)*ease(v),0,.36/s,0);const k=Math.sin(PI*v);R.legs.forEach((l,i)=>{l.g.rotation.x+=(i<2?.9:-.9)*k;});if(m.tail)m.tail.rotation.x+=.6*k;}
  const happy=bell(u,.7,.9);if(m.head)m.head.rotation.x-=.3*happy;if(m.tail)m.tail.rotation.y+=.4*Math.sin(TAU*4*u)*happy;
  return {lift:(arc(u,.2,.56,.75*(o.big?1.3:1))+arc(u,.72,.8,.12)+arc(u,.8,.88,.12))/s};}

/* ---------------- SEAL ---------------- */
function sealRear(R,k){rotAbout(R,'x',-.5*k,0,.02,-.3);R.b.position.y+=.02*k;}
function trSealClap(m,t,o){const R=rig(m);const u=uT(t);const k=seg(u,.06,.2)*(1-seg(u,.82,.95));sealRear(R,k);
  const clap=u>.24&&u<.78?Math.max(0,Math.sin(TAU*4*cl((u-.24)/.54))):0;sealClapPose(R,k,clap);
  if(m.head){m.head.rotation.x+=(-.08-.18*clap)*k;m.head.rotation.z+=.08*Math.sin(TAU*2*u)*k;}if(m.tail)m.tail.rotation.x+=.5*k;(m.rear||[]).forEach((r,i)=>{r.rotation.y+=(i?1:-1)*(.3+.1*clap)*k;});return {};}
/* Ball on the nose (train:seal: the ball is the gear). r.ball = where the gear's origin (the ball's bottom) goes, root frame m; r.ballRot = [x,y,z] turn. o.ballAt = its resting spot ([-.4,0,1.0]) */
function sealNose(R){const m=R.m;if(!R.cache.nose){const hb=boxIn(m.head,m.head,new THREE.Box3());R.cache.nose=new THREE.Vector3((hb.min.x+hb.max.x)/2,hb.min.y+.45*(hb.max.y-hb.min.y),hb.max.z-.03);}return rootPt(R,m.head,R.cache.nose);}
function trSealBall(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const k=seg(u,.08,.18)*(1-seg(u,.84,.96));sealRear(R,k);
  const clap=u>.72&&u<.88?Math.max(0,Math.sin(TAU*2*cl((u-.72)/.16))):0;sealClapPose(R,k,clap);const bump=bell(u,.14,.22);const bal=u>.3&&u<.62?1:0;
  if(m.head){m.head.rotation.x+=.45*bump-.75*seg(u,.22,.3)*(1-seg(u,.62,.7))+.04*Math.sin(TAU*3*u+.4)*bal;m.head.rotation.y+=-.6*bump*(1-seg(u,.2,.22));m.head.rotation.z+=.07*Math.sin(TAU*3*u)*bal;}
  if(m.tail)m.tail.rotation.x+=.5*k;(m.rear||[]).forEach((r,i)=>{r.rotation.y+=(i?1:-1)*(.3+.15*clap)*k;});
  ground(m);const N=sealNose(R);const g0=new THREE.Vector3(...(o.ballAt||[-.4,0,1.0]));let p,spin=0;
  if(u<.2)p=g0;else if(u<.32){const v=ease((u-.2)/.12);p=g0.clone().lerp(N,v);p.y+=.55*4*v*(1-v);spin=TAU*v;}
  else if(u<.62)p=N;else if(u<.78){const v=(u-.62)/.16;p=N.clone().lerp(g0,ease(cl((v-.15)/.85)));p.y+=1.1*4*v*(1-v);p.y=Math.max(p.y,0);spin=-TAU*v;}
  else{p=g0.clone();p.y=arc(u,.78,.88,.18);}
  return {ball:p.toArray(),ballRot:[spin,TAU*2*cl((u-.3)/.32),.1*Math.sin(TAU*3*u)*bal]};}
function trSealRoll(m,t,o){const R=rig(m);const u=uT(t);const s=scOf(R);const tk=seg(u,.06,.14)*(1-seg(u,.86,.94));(m.legs||[]).forEach(l=>{l.rotation.x+=-.35*tk;l.rotation.z+=-Math.sign(l.position.x)*.55*tk;});
  const th=-TAU*ease(cl((u-.14)/.3))+TAU*ease(cl((u-.56)/.3));rotAbout(R,'z',th,0,.18/s,-.05/s);const ob=Math.max(bell(u,.22,.36),bell(u,.64,.78));
  (m.rear||[]).forEach((r,i)=>{r.rotation.y+=(i?1:-1)*(.2+.4*ob*Math.max(0,Math.sin(TAU*8*u)));});const wig=bell(u,.45,.56);if(m.head){m.head.rotation.x+=-.3*wig;m.head.rotation.y+=.35*Math.sin(TAU*6*u)*wig;}if(m.tail)m.tail.rotation.x+=.3*wig;
  placeB(R,-th*.13,0,0);return {};}

/* ---------------- BEAR (an unposed bear: the pack sits it the c14 petPose way, a little more upright: .7) ---------------- */
const BA=.7;
function bearSitK(R,k){const P=sitPivot(R),m=R.m;rotAbout(R,'x',-BA*k,0,P.y,P.z);R.front.forEach(l=>{l.g.rotation.x+=(BA-.25)*k;});R.hind.forEach(l=>{l.g.rotation.x+=-.08*k;l.g.rotation.z+=(l.g.position.x<0?1:-1)*.45*k;});if(m.head)m.head.rotation.x+=BA*1.05*k;}
function trBearWave(m,t,o){const R=rig(m);const u=uT(t);const k=seg(u,.06,.22)*(1-seg(u,.8,.95));bearSitK(R,k);const up=seg(u,.26,.34)*(1-seg(u,.66,.74));
  const w=R.front.find(l=>l.g.position.x<0)||R.front[0];if(w){const cur=(BA-.25)*k;w.g.rotation.x+=-cur*up-.3*up;w.g.rotation.z+=Math.sign(w.g.position.x)*(2.3+.35*Math.sin(TAU*4*cl((u-.32)/.36)))*up;   /* (sweep fix) the paw goes up sideways, beside the head, and waves: reads from the front */}
  if(m.head){m.head.rotation.z-=.15*up;m.head.rotation.y+=.12*up;}if(m.tail)m.tail.rotation.y+=.3*Math.sin(TAU*3*u)*k;return {};}
/* Walk the log (train:bear at 1.6, the log along z, root under its middle): balances along, hop-turns at each end. o.h = log top (.8), o.Z = half walk (.42) */
function trBearLog(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const s=scOf(R);const Z=o.Z||.42;let z,yaw,air=0,dist;
  if(u<.04){z=-Z;yaw=0;dist=0;}else if(u<.4){const v=ease((u-.04)/.36);z=-Z+2*Z*v;yaw=0;dist=2*Z*v;}else if(u<.52){z=Z;yaw=PI*ease(cl((u-.42)/.08));air=arc(u,.42,.5,.14);dist=2*Z;}
  else if(u<.88){const v=ease((u-.52)/.36);z=Z-2*Z*v;yaw=PI;dist=2*Z+2*Z*v;}else{z=-Z;yaw=PI+PI*ease(cl((u-.9)/.08));air=arc(u,.9,.98,.14);dist=4*Z;}
  const walking=(u>.04&&u<.4)||(u>.52&&u<.88);R.legs.forEach(l=>{l.g.rotation.z+=-Math.sign(l.g.position.x)*.235;});
  if(walking)gaitLegs(R,dist/stride(m,.2),.2,1,'walk');if(air)R.legs.forEach(l=>{l.g.rotation.x+=(l.front?-.3:.3)*Math.sin(PI*air/.14);});
  rotAbout(R,'z',.04*Math.sin(TAU*2*u),0,R.bCenter.y,R.bCenter.z);if(m.head){m.head.rotation.y+=.12*Math.sin(TAU*1.5*u);m.head.rotation.x+=-.1*bell(u,.4,.5)-.1*bell(u,.88,.98);}
  placeB(R,0,z,yaw);return {lift:((o.h==null?.8:o.h)-.01+air)/s};}
function trBearRoll(m,t,o){const R=rig(m);const u=uT(t);const s=scOf(R);const lie=seg(u,.04,.14)*(1-seg(u,.86,.96));
  R.legs.forEach(l=>{l.g.rotation.x+=(l.front?1.25:-1.25)*lie;l.g.rotation.z+=-Math.sign(l.g.position.x)*.1*lie;});
  const th=-TAU*ease(cl((u-.16)/.3))+TAU*ease(cl((u-.56)/.3));rotAbout(R,'z',th,0,.62/s,0);const pd=Math.max(bell(u,.24,.38),bell(u,.64,.78));
  if(pd)R.legs.forEach((l,i)=>{l.g.rotation.x+=.35*pd*Math.sin(TAU*8*u+i*1.6);});const happy=bell(u,.46,.56);if(m.head){m.head.rotation.y+=.3*Math.sin(TAU*5*u)*happy;m.head.rotation.x+=-.2*happy-.15*lie;}
  placeB(R,-th*.16,0,0);return {};}

/* ---------------- SNAKE (tricksB: the body laid along a path, like c14 snakeAlong; tongue = m.tongue scale.z) ---------------- */
function tongueK(R,k){const tg=R.m.tongue;if(tg)tg.scale.z*=Math.max(.001,k);else snakeOf(R).tongue.forEach(q=>{const r=R.rest.get(q);q.position.z=r.p.z-.1*(1-k);});}
function snakeLay(R,P,o){const m=R.m,s=scOf(R);o=o||{};const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+P[i].distanceTo(P[i-1]));
  const at=x=>{x=Math.max(0,Math.min(L[L.length-1]-1e-4,x));let i=1;while(L[i]<x)i++;const k=(x-L[i-1])/((L[i]-L[i-1])||1);return {p:P[i-1].clone().lerp(P[i],k),d:P[i].clone().sub(P[i-1]).normalize()};};
  const yaw=(d,fb)=>{const h=Math.hypot(d.x,d.z);const a=Math.atan2(-d.x,-d.z);return h>.5?a:h<.15?fb:fb+(a-fb)*(h-.15)/.35;};
  {const q=at(0);m.head.position.set(q.p.x/s,q.p.y/s+.06,q.p.z/s);_e.set(o.hp||0,o.hy!=null?o.hy:yaw(q.d,0),0);m.head.quaternion.setFromEuler(_e);}
  const sn=snakeOf(R);(m.segs||[]).forEach((g,i)=>{const r0=sn.rad[i];const q=at(sn.off[i]*s);g.position.set(q.p.x/s,q.p.y/s+r0,q.p.z/s);g.quaternion.setFromAxisAngle(Y,yaw(q.d,o.hy||0));});
  tongueK(R,o.tg||0);}
const spaced=(pts,n)=>new THREE.CatmullRomCurve3(pts,false,'centripetal').getSpacedPoints(n||500);
function spiralPts(r0,k,th0,turns,cy){const o=[];for(let th=th0;th<th0+turns*TAU;th+=.18){const r=r0+k*(th-th0)/TAU;o.push(new THREE.Vector3(Math.sin(th)*r,cy||0,Math.cos(th)*r));}return o;}
function risePath(Y0,sw){const r0=.17;const V=(x,y,z)=>new THREE.Vector3(x,y,z);return spaced([V(sw,Y0,r0+.06),V(sw*.15-.02,Y0*.62,r0+.01),V(-sw*.35-.05,Y0*.3+.03,r0-.04),V(-.06,.02,r0-.06),...spiralPts(r0,.14,.35,2.2,0)]);}
const flick3=u=>{const f=frac(u);return f<.3?Math.sin(PI*f/.3):0;};
function trSnakeSway(m,t,o){const R=rig(m);const u=uT(t);const up=seg(u,.06,.24)*(1-seg(u,.8,.95));const swk=seg(u,.2,.3)*(1-seg(u,.74,.82));const sw=.13*Math.sin(TAU*3*cl((u-.2)/.62))*swk;
  snakeLay(R,risePath(.09+.46*up,sw),{hy:-sw*1.2,hp:.15*up,tg:u>.3&&u<.75?flick3((u-.3)*7):0});return {noGround:true};}
/* Rise from the basket (train:snake at 1.3, root = the basket's middle on the floor). o.h = basket top (.624). The body under the top is hidden */
function trSnakeBasket(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const TOPY=o.h||.624;const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  if(!R.cache.basket){const ins=[];for(let i=0;i<40;i++){const a=i*.45,r=.16+.06*Math.sin(i*.3);ins.push(V(Math.sin(a)*r,.06+.012*i,Math.cos(a)*r));}R.cache.basket=ins;[...(m.segs||[]),m.head].forEach(g=>{if(g&&!R.show.includes(g))R.show.push(g);});}
  const up=seg(u,.08,.32)*(1-seg(u,.76,.94));const Y0=TOPY-.25+.85*up;const swk=seg(u,.3,.38)*(1-seg(u,.68,.76));const sw=.15*Math.sin(TAU*2.5*cl((u-.3)/.46))*swk;const T2=Math.min(TOPY,Y0-.1);
  const c=[V(sw,Y0,0),V(sw*.3,(Y0+T2)/2,0),V(0,T2,0),V(0,T2-.15,0),V(0,.6*TOPY-.04,0),...R.cache.basket.slice().reverse().filter(p=>p.y<.5*TOPY).reverse()];const look=.6*bell(u,.4,.52)-.6*bell(u,.54,.66);
  snakeLay(R,spaced(c),{hy:-sw*1.2+look,hp:.15,tg:u>.36&&u<.72?flick3((u-.36)*8):0});const s=scOf(R);(m.segs||[]).forEach(g=>{g.visible=g.position.y*s>TOPY-.06;});m.head.visible=m.head.position.y*s>TOPY-.08;
  return {noGround:true};}
function trSnakeCoilSpin(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const up=seg(u,.04,.16)*(1-seg(u,.84,.96));snakeLay(R,risePath(.09+.32*up,0),{hy:0,hp:.15*up,tg:u>.84&&u<.96?flick3((u-.84)*8):0});
  rotAbout(R,'y',2*TAU*(o.big?1.5:1)*ease(cl((u-.18)/.62)),0,0,0);return {noGround:true};}

/* ---------------- the trick table: pet type → [starter, gear trick, third] ([id, the game's label]) ---------------- */
const DOGT=[['highFive','High five'],['agility','Agility jump'],['rollOver','Roll over']];
const TRICKS={dog:DOGT,pug:DOGT,pomchi:DOGT,sausage:DOGT,cat:[['spin','Spin'],['tower','Tower climb and leap'],['highFive','High five']],bunny:[['bigJump','Big jump'],['hurdles','Hurdle hops'],['spin','Spin']],
  hamster:[['spin','Spin'],['maze','Maze run'],['rollOver','Roll over']],capybara:[['dance','Dance'],['bathSpin','Spin (in the bath)'],['rollOver','Roll over']],duck:[['dance','Dance'],['bigJump','Big jump'],['spin','Spin']],
  owl:[['headTurn','Head turn'],['perchHop','Perch hop'],['spin','Spin']],monkey:[['clap','Clap'],['bars','Monkey bars'],['flip','Flip']],seal:[['clap','Flipper clap'],['ballNose','Ball on the nose'],['rollOver','Roll over']],
  bear:[['wave','Sit up and wave'],['logWalk','Walk the log'],['rollOver','Roll over']],snake:[['sway','Sway to the flute'],['basket','Rise from the basket'],['coilSpin','Coil spin']]};
const TRICK_FN={dog:{highFive:trHighFive,agility:trAgility,rollOver:trRoll},cat:{spin:trPirouette,tower:trCatTower,highFive:(m,t,o)=>trHighFive(m,t,Object.assign({wave:3,wf:4,wa:.3},o))},
  bunny:{bigJump:trBigJump,hurdles:trHurdles,spin:trHopSpin},hamster:{spin:trTailChase,maze:trMaze,rollOver:trBallRoll},capybara:{dance:trCapyDance,bathSpin:trBathSpin,rollOver:(m,t,o)=>trRoll(m,t,Object.assign({wa:0},o))},
  duck:{dance:trDuckDance,bigJump:trDuckJump,spin:trDuckSpin},owl:{headTurn:trOwlHead,perchHop:trPerchHop,spin:trOwlSpin},monkey:{clap:trMonkeyClap,bars:trMonkeyBars,flip:trMonkeyFlip},
  seal:{clap:trSealClap,ballNose:trSealBall,rollOver:trSealRoll},bear:{wave:trBearWave,logWalk:trBearLog,rollOver:trBearRoll},snake:{sway:trSnakeSway,basket:trSnakeBasket,coilSpin:trSnakeCoilSpin}};
const TRICK_KIND=k=>({pug:'dog',pomchi:'dog',sausage:'dog'})[k]||k;
const TRICK_LEN={'monkey.bars':2*(4*.58+.4)};
/* where the game puts the gear (pet frame, metres): {id, opts, scale, x, z, rotY}; the pet starts at the root facing +z */
function trickGear(kind,trick){kind=TRICK_KIND(kind);const k=kind+'.'+trick;
  if(k==='dog.agility'){const G=agilityPath();return {id:'train:dog',scale:1.25,x:G.gear.x,z:G.gear.z,rotY:G.gear.yaw};}
  if(k==='cat.tower'){const F=frameA(CAT_TW.A[0],CAT_TW.A[1],CAT_TW.h0);const p=F.pos(0,0);return {id:'train:cat',scale:CAT_TW.s,x:p[0],z:p[1],rotY:F.rot(0)};}
  if(k==='bunny.hurdles')return {id:'train:bunny',scale:1.3,x:0,z:1.9,rotY:0};
  if(k==='hamster.maze'){const c=new THREE.CatmullRomCurve3([[1.0,0,.85],[.62,0,.66],[.32,0,.15],[.05,0,0],[-.4,0,0]].map(p=>new THREE.Vector3(...p)));const g=c.getTangentAt(0);const F=frameA(1.0,.85,Math.atan2(-g.z,g.x));const p=F.pos(0,0);
    return {id:'train:hamster',scale:HAM_MZ.s,x:p[0],z:p[1],rotY:F.rot(PI)};}
  if(k==='capybara.bathSpin')return {id:'train:capybara',scale:1.35,x:0,z:0,rotY:0,water:.574};
  if(k==='owl.perchHop')return {id:'train:owl',scale:1.7,x:0,z:0,rotY:0,h:2.55};
  if(k==='monkey.bars')return {id:'train:monkey',scale:1,x:0,z:.9,y:-1.6,rotY:PI/2,note:'the root is rung 0\'s grip point (1.6 m up); the gear origin is 1.6 m below it, .9 ahead'};
  if(k==='seal.ballNose')return {id:'train:seal',scale:1,ball:true,x:-.4,z:1.0};
  if(k==='bear.logWalk')return {id:'train:bear',scale:1.6,x:0,z:-1.6,rotY:PI/2,h:.8};
  if(k==='snake.basket')return {id:'train:snake',scale:1.3,x:0,z:0,rotY:0,h:.624};
  return null;}
/* play a trick: o.trick = id ('highFive'), index (0..2) or the game's label ('High five'); o.kind = the pet type; o.gr: 0 oopsie, 1 good, 2 perfect (big) */
function trick(m,t,o){const R=rig(m,o&&o.kind?{kind:o.kind}:null);o=Object.assign({},o);const kind=TRICK_KIND(o.kind||R.kind);const list=TRICKS[kind]||TRICKS.dog;let id=o.trick;
  if(typeof id==='number')id=(list[id]||list[0])[0];else{const hit=list.find(x=>x[0]===id||x[1]===id);id=hit?hit[0]:list[0][0];}
  if(o.gr===0)return trOops(m,t,o);if(o.gr===2)o.big=true;const f=(TRICK_FN[kind]||TRICK_FN.dog)[id];const L=TRICK_LEN[kind+'.'+id]||TT;const r=f(m,t,o)||{};r.trick=id;if(t>=L)r.done=true;return r;}

/* ======================= toy play (toyPlay) ======================= */
/* monkey + frisbee (5 s): sits up with it, throws, the frisbee flies a curve round the yard, the monkey gallops round a circle (r .55 about the root) after it, sits up, catches, claps.
   r.frisbee = {p:[x,y,z], q:[x,y,z,w]} root frame (the toy's centre, the disc held by its rim) */
function monkeyFrisbeePose(R,u){const m=R.m,L=m.legs;const U=1.2,Rr=.55,TI=0,FI=1;const sd=Math.sign(L[TI].position.x),sf=Math.sign(L[FI].position.x);
  const pr=seg(u,.14,.6),up=1-seg(u,.1,.16)+seg(u,.57,.63);
  const armT=u<.1?-.55+(.55+.15)*seg(u,.02,.07)*(1-seg(u,.07,.1))+(-1.7+.55)*seg(u,.07,.1):u<.57?-1.7:u<.64?-1.7+(-2.75+1.7)*seg(u,.57,.63):-2.75+(2.75-1.05)*seg(u,.64,.7)-(-1.05+.55)*seg(u,.9,.98);
  const clap=u>.7&&u<.9?Math.max(0,Math.sin(TAU*3*(u-.7)/.2-PI/2)*.5+.5):0;
  const a=PI/2-TAU*pr;const sp=(seg(Math.min(1,u+.005),.14,.6)-seg(Math.max(0,u-.005),.14,.6))/.01*Rr*TAU,amp=cl(sp/4)*(1-up);const ph=TAU*Rr*TAU*pr/.62;
  const gF=[.55*amp*Math.sin(ph),.55*amp*Math.sin(ph+.35)],gH=[.5*amp*Math.sin(ph+PI),.5*amp*Math.sin(ph+PI+.35)];
  const hp=L[2]?L[2].position:new THREE.Vector3(0,.18,-.13);rotAbout(R,'x',-U*up+.09*amp*Math.sin(ph+PI/2),0,hp.y,hp.z);
  if(L[2])L[2].rotation.x+=U*up+gH[0];if(L[3])L[3].rotation.x+=U*up+gH[1];const cw=seg(u,.66,.7)*(1-seg(u,.9,.96));const phF=-.35+(-1.05+.35)*cw;
  L[TI].rotation.x+=up*(U+armT)+(1-up)*gF[0];L[FI].rotation.x+=up*(U+phF)+(1-up)*gF[1];
  L[TI].rotation.z+=-sd*(.13*cw-.06*cw*(1-clap))+sd*.8*seg(u,.55,.62)*(1-seg(u,.66,.72));L[FI].rotation.z+=-sf*cw*(-.55+(.55+.15)*clap);
  if(m.head){m.head.rotation.x+=U*up*.85-.1*up*seg(u,.55,.62)*(1-seg(u,.64,.7))+.08*bell(u,.7,.9);m.head.rotation.y+=-.25*bell(u,.66,.95)*up;m.head.rotation.z+=.12*Math.sin(TAU*1.5*(u-.7)/.2)*cw;}
  if(m.tail)m.tail.rotation.x+=.55*up+.12*amp*Math.sin(ph);placeB(R,Rr*Math.cos(a),Rr*Math.sin(a),Math.atan2(Math.sin(a),-Math.cos(a)));ground(m);}
function monkeyHeld(R){const l=R.m.legs[0];return {c:rootPt(R,l,new THREE.Vector3(0,-.358,.275)),q:rootQ(R,l).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,PI/2)))};}
function monkeyFrisbee(m,t,o){const R=rig(m);const u=uT(t);const tr=.1,tc=.64;
  if(!R.cache.fris){reset(m);monkeyFrisbeePose(R,tr);const H0=monkeyHeld(R);reset(m);monkeyFrisbeePose(R,tc);const H1=monkeyHeld(R);reset(m);const V=(x,y,z)=>new THREE.Vector3(x,y,z);
    R.cache.fris={H0,H1,c:new THREE.CatmullRomCurve3([H0.c,V(.8,1.0,.6),V(1.1,1.15,-.3),V(.25,1.2,-1.0),V(-.85,1.15,-.55),V(-1.0,1.25,.45),V(.45,1.2,1.0),H1.c],false,'centripetal')};}
  monkeyFrisbeePose(R,u);const F=R.cache.fris;let c,q;
  if(u<tr||u>=tc){const h=monkeyHeld(R);c=h.c;q=h.q;}
  else{const v=(u-tr)/(tc-tr),f=1-Math.pow(1-v,1.6);c=F.c.getPointAt(f);q=new THREE.Quaternion().setFromEuler(new THREE.Euler(.18*Math.sin(v*6),TAU*5*v,.12,'YXZ'));
    const k0=1-seg(v,0,.12),k1=seg(v,.86,1);if(k0>0)q.slerp(F.H0.q,k0);if(k1>0)q.slerp(F.H1.q,k1);}
  return {frisbee:{p:c.toArray(),q:q.toArray()},done:t>=TT};}
/* seal + ball (5 s): sits up, the ball bounces on the nose tip three times, then rests there while it claps. r.ball = the ball's centre (root frame, m); o.ballR = its radius (.154, toy:ball at 2.2) */
function sealToyBall(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const br=o.ballR||.154;sealRear(R,1);
  const NB=3,BT=.18;const bouncing=u<NB*BT;const v=bouncing?(u/BT)%1:0;const nudge=bouncing?(v<.12?1-v/.12:v>.88?(v-.88)/.12:0):0;
  const clap=u>.58&&u<.92?Math.max(0,Math.sin(TAU*3*(u-.58)/.34-PI/2)*.5+.5):0;const cw=seg(u,.55,.6)*(1-seg(u,.9,.96));
  if(m.head){m.head.rotation.x+=-.4-.08*ease(nudge)+.04*Math.sin(TAU*u);m.head.rotation.z+=.05*Math.sin(TAU*2*u)*(1-cw);}
  sealClapPose(R,1,clap*cw);(m.legs||[]).forEach(l=>{l.rotation.x+=bouncing?.08*Math.sin(TAU*v):0;});if(m.tail)m.tail.rotation.x+=.5;(m.rear||[]).forEach((r,i)=>{r.rotation.y+=(i?1:-1)*(.3+.12*clap*cw);r.rotation.x+=.05;});
  ground(m);const s=scOf(R);
  if(!R.cache.noseBox){const hv=[];R.m.head.traverse(q=>{if(q.isMesh&&q.geometry.type==='BoxGeometry'&&q.parent===R.m.head&&q.position.z>.17&&Math.abs(q.position.x)<.01){const pa=q.geometry.attributes.position;for(let i=0;i<pa.count;i++)hv.push(new THREE.Vector3().fromBufferAttribute(pa,i).applyMatrix4(q.matrix));}});R.cache.noseBox=hv;}
  const hq=rootQ(R,m.head);const fw=new THREE.Vector3(0,0,1).applyQuaternion(hq);fw.y=0;fw.normalize();const d=new THREE.Vector3(0,Math.cos(.5),0).addScaledVector(fw,Math.sin(.5));
  let best=null,bs=-1e9;for(const p of R.cache.noseBox){const w=rootPt(R,m.head,p);const k=w.dot(d);if(k>bs){bs=k;best=w;}}if(!best)best=sealNose(R);
  const h=bouncing?.34*4*v*(1-v):0;const w=bouncing?0:.1*Math.sin(TAU*2*(u-NB*BT)/(1-NB*BT))*seg(u,.54,.6)*(1-seg(u,.94,1));
  const dir=new THREE.Vector3(Math.sin(w),Math.cos(w),0).multiplyScalar(Math.cos(.5)).addScaledVector(fw,Math.sin(.5)).normalize();const c=best.clone().addScaledVector(dir,br);c.y+=h;
  return {ball:c.toArray(),ballRot:[bouncing?-TAU*(u/BT)*.5:0,0,-w*1.2],done:t>=TT};}
/* bear + squeaky bone (5 s): sits (c14 petPose sit), holds the bone between its front paws, squeezes it twice, rolls back happily, sits up.
   r.toy = {p, q, scale:[x,y,z]} root frame (the bone's centre; scale = squash on top of its normal size). o.toyLen = the bone's length (.554, toy:bone at 2.1) */
function bearSqueaky(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const a=.95,phi=-1.15;const L0=o.toyLen||.554;const m0=R.m;const s=scOf(R);
  const front=R.front.slice(0,2);if(front.length<2)return {};
  if(!R.cache.paw){reset(m);R.cache.paw=front.map(l=>{const bb=boxIn(l.g,l.g,new THREE.Box3());const pr=(bb.max.x-bb.min.x)/2*.8;return {p:new THREE.Vector3((bb.min.x+bb.max.x)/2,bb.min.y+pr,(bb.min.z+bb.max.z)/2),r:pr};});
    let best=1e9,th=0;for(let x=-.3;x<=.6;x+=.005){reset(m);front.forEach(l=>{l.g.rotation.x+=a+phi;l.g.rotation.z+=Math.sign(l.g.position.x)*x;});
      const g=rootPt(R,front[0].g,R.cache.paw[0].p).distanceTo(rootPt(R,front[1].g,R.cache.paw[1].p))-(R.cache.paw[0].r+R.cache.paw[1].r)*s;if(Math.abs(g-L0)<best){best=Math.abs(g-L0);th=x;}}R.cache.pawTh=th;reset(m);}
  const roll=.45*seg(u,.4,.56)*(1-seg(u,.72,.86))+.12*Math.sin(TAU*(u-.56)/.16)*bell(u,.56,.72)-.06*bell(u,.84,.94);const sq=bell(u,.08,.17)+bell(u,.22,.31);const pop=Math.max(0,Math.sin(PI*cl((u-.15)/.06)))+Math.max(0,Math.sin(PI*cl((u-.29)/.06)));
  const P=sitPivot(R);rotAbout(R,'x',-(a+roll),0,P.y,P.z);R.b.position.z-=.45*Math.max(0,roll);
  const lo=.25*cl(roll/.45);front.forEach(l=>{l.g.rotation.x+=a+phi+lo;l.g.rotation.z+=Math.sign(l.g.position.x)*(R.cache.pawTh-.28*sq+.05*pop);});
  const rk=seg(u,.44,.56)*(1-seg(u,.7,.8));R.hind.forEach((l,k)=>{l.g.rotation.x+=a-PI/2-.05+.25*rk*Math.sin(TAU*(u-.44)/.08+k*PI);l.g.rotation.z+=(l.g.position.x<0?1:-1)*.6;});
  if(m.head){m.head.rotation.x+=a*1.05-.5*Math.max(0,roll)-.12*sq;m.head.rotation.z+=.18*Math.sin(TAU*(u-.04)/.3)*bell(u,.04,.36);m.head.rotation.y+=-.12*bell(u,.04,.36);}
  ground(m);const p0=rootPt(R,front[0].g,R.cache.paw[0].p),p1=rootPt(R,front[1].g,R.cache.paw[1].p);const ax=p1.clone().sub(p0);const r0=R.cache.paw[0].r*s,r1=R.cache.paw[1].r*s;const gap=ax.length()-r0-r1;ax.normalize();
  const len=Math.min(gap,L0*(1+.1*pop));const kz=len/L0;const upv=new THREE.Vector3(0,1,0).applyQuaternion(rootQ(R,R.b));const yv=upv.clone().addScaledVector(ax,-upv.dot(ax)).normalize();const xv=new THREE.Vector3().crossVectors(yv,ax);
  const q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xv,yv,ax));const ex=1/Math.sqrt(kz);return {noGround:true,toy:{p:p0.clone().addScaledVector(ax,r0+len/2).toArray(),q:q.toArray(),scale:[ex,ex,kz]},done:t>=TT};}
/* snake + toy mouse (5 s): slides up, flicks its tongue, noses it, coils round it, holds with its head up, uncoils back. The mouse sits at the root, turned o.mouseYaw (-.5).
   r.mouseRock = how far the mouse rocks (rotation.x about its far bottom edge) */
function snakeMouse(m,t,o){const R=rig(m);o=o||{};const u=uT(t);const s=scOf(R);const MY=o.mouseYaw==null?-.5:o.mouseYaw;
  if(!R.cache.mouse||R.cache.mouse.MY!==MY){const toW=(x,z)=>new THREE.Vector3(x,0,z).applyAxisAngle(Y,MY);const A0=.3,B0=.185,G=.16;
    const P=[[-.6,-2.5],[-.2,-1.95],[.25,-1.45],[.15,-.95],[0,-.6],[0,-.4]].map(([x,z])=>toW(x,z));for(let d=-52;d<=348;d+=20){const th=d*PI/180,g=G*(d+52)/360;P.push(toW((A0+g)*Math.cos(th),(B0+g)*Math.sin(th)));}
    const pts=spaced(P,1600).map(p=>[p.x,0,p.z]);const PP=pathOf(pts,s);const nz=toW(0,-.4);let best=1e9,sN=0;for(let i=0;i<pts.length;i++){const d=Math.hypot(pts[i][0]-nz.x,pts[i][2]-nz.z);if(d<best){best=d;sN=PP.C[i]*s;}}
    R.cache.mouse={MY,pts,sN};}
  const C=R.cache.mouse;const PP=pathOf(C.pts,s);const sN=C.sN,sStart=sN-.16,sPoke=sN+.09,sCoil=sPoke+1.95;
  const sH=sStart+(sN-sStart)*seg(u,0,.08)+(sPoke-sN)*seg(u,.2,.25)+(sCoil-sPoke)*seg(u,.29,.55)-(sCoil-sStart)*seg(u,.7,.95);
  const lift=.06*seg(u,.02,.08)*(1-seg(u,.19,.22))+.09*seg(u,.56,.6)*(1-seg(u,.66,.7));const fl=(a,b)=>{const v=cl((u-a)/(b-a));return v<=0||v>=1?0:Math.sin(PI*((v*2)%1));};
  const tg=fl(.09,.19)+fl(.6,.66);const look=-.55*seg(u,.58,.61)*(1-seg(u,.66,.69));const pitch=.18*seg(u,.02,.08)*(1-seg(u,.19,.22))-.08*bell(u,.21,.27)+.2*seg(u,.56,.6)*(1-seg(u,.66,.7));
  snakePlace(R,x=>pathAt(PP,x),sH/s,{lift:lift/s,tg,look,pitch});return {noGround:true,mouseRock:.12*bell(u,.23,.31),done:t>=TT};}

/* ======================= farm feeding and petting (farmFeed) ======================= */
/* person: hand at the end of arm i pointed along dir (root frame); r.hand points */
function armLenOf(R,i){if(!R.cache.al)R.cache.al=[];if(R.cache.al[i]==null){const a=R.m.arms[i];const bb=boxIn(a,a,new THREE.Box3());R.cache.al[i]=-bb.min.y*.97;}return R.cache.al[i];}
function handAt(R,i){const a=R.m.arms&&R.m.arms[i];if(!a)return null;return rootPt(R,a,new THREE.Vector3(0,-armLenOf(R,i),0)).toArray();}
const nrm=(x,y,z)=>new THREE.Vector3(x,y,z).normalize();
function dirMix(keys,k){const i=Math.min(keys.length-2,Math.floor(k)),f=ease(cl(k-i));return keys[i].clone().lerp(keys[i+1],f).normalize();}
/* person.pourBucket (2.4 s): the pail in the left hand (arms[1]): carried, lifted out to the side, over the top, forward-up over the trough, tipped, back down.
   r.hand = the hand (root frame m): the game hangs the pail there; r.tip = how far to tip it (rad, about its hinge, toward +z); r.pour 0..1 = grain flows */
function pourBucket(m,t,o){const R=rig(m,{kind:'person'});const K=[nrm(.25,-1,.1),nrm(1,-.25,.15),nrm(1,.45,.1),nrm(.45,1,.35),nrm(.08,.5,.9)];
  const k=t<1.32?4*seg(t,.24,.84):4*(1-seg(t,1.68,2.28));aimArm(R,1,dirMix(K,k),1);aimArm(R,0,nrm(-.12,-1,.05),1);const tip=1.95*seg(t,.84,1.08)*(1-seg(t,1.44,1.68));if(m.head)m.head.rotation.x+=.15*seg(t,.6,.9)*(1-seg(t,1.6,2));
  return {hand:handAt(R,1),tip,pour:tip>1.2?1:0,done:t>=2.4};}
/* person.scatterGrain (3 s loop): holds the pail in front (arms[1]), dips the other hand in, throws three times, watches.
   r.hand = the pail hand; r.throwHand; r.release = which throw just let go (0..2, else -1): the game flies the grain from r.throwHand */
function scatterGrain(m,t,o){const R=rig(m,{kind:'person'});const u=clock(t,3);const d1=nrm(-.25,-.45,.85);aimArm(R,1,d1,1);
  if(!R.cache.dip){const s=scOf(R);reset(m);aimArm(R,1,d1,1);const h=new THREE.Vector3(...handAt(R,1));const sh=shoulderOf(R,0).multiplyScalar(s);R.cache.dip=h.add(new THREE.Vector3(0,-.18,0)).sub(sh).normalize();reset(m);aimArm(R,1,d1,1);}
  const dip=R.cache.dip,fling=nrm(-.55,.55,.65),rest=nrm(-.08,-1,.05);let rel=-1,dir=rest;
  for(let j=0;j<3;j++){const a=.08+.18*j,b=a+.18,v=(u-a)/(b-a);if(v>0&&v<1){dir=v<.3?rest.clone().lerp(dip,bell(v,0,.6)).normalize():dip.clone().lerp(fling,seg(v,.3,.85)).normalize().lerp(rest,seg(v,.85,1)).normalize();if(v>.62&&v<.7)rel=j;}}
  aimArm(R,0,dir,1);if(m.head){m.head.rotation.y+=-.25*seg(u,.65,.75);m.head.rotation.x+=.15*seg(u,.65,.75)+.05*Math.sin(TAU*2*u)*seg(u,.65,.75);}
  return {hand:handAt(R,1),throwHand:handAt(R,0),release:rel};}
/* person.handFeed (6 s loop): crouched with the hand in the pail at its feet, stands, holds the flat hand out (o.target root frame m, default forward at 1.05 m), back down.
   r.hand; r.offer 0..1 */
function handFeed(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const u=clock(t,6);const up=seg(u,.08,.2)*(1-seg(u,.8,.92));const ck=1-seg(u,.04,.14)+seg(u,.86,.97);lunge(R,.45*cl(ck),.32*cl(ck));
  const down=nrm(.1,-1,.45);let tgt;if(o.target){const s=scOf(R);const sh=shoulderOf(R,1).multiplyScalar(s);tgt=new THREE.Vector3(...o.target).sub(sh).normalize();}else tgt=nrm(0,.08,1);
  aimArm(R,1,down.clone().lerp(tgt,up).normalize(),1);aimArm(R,0,nrm(-.1,-1,.05),1);if(m.head)m.head.rotation.x+=.2*cl(ck)+.1*bell(u,.4,.6);return {hand:handAt(R,1),offer:up};}
/* person.pat (2 s loop): the hand to o.target (root frame m) and three soft pats (o.side: pats against a face, e.g. the cow's forehead; o.hand 0|1; o.crouch 0..1 for low animals) */
function personPat(m,t,o){const R=rig(m,{kind:'person'});o=o||{};const u=clock(t,2);const i=o.hand==null?1:o.hand;const s=scOf(R);if(o.crouch)lunge(R,.6*o.crouch,.4*o.crouch);
  const on=seg(u,0,.12)*(1-seg(u,.88,1));const lift=.045*(1-Math.cos(TAU*3*cl((u-.12)/.76)))/2;const T=new THREE.Vector3(...(o.target||[.15,1.0,.55]));
  if(o.side)T.z-=lift*1.2+.15*(1-on);else T.y+=.012+lift+.15*(1-on);const sh=shoulderOf(R,i).multiplyScalar(s);aimArm(R,i,T.sub(sh).normalize(),on);if(m.head)m.head.rotation.x+=.15*on;return {hand:handAt(R,i)};}
/* farm.troughEat: cow or sheep, head down into the trough (muzzle solved to o.h above its feet: the feed, default .55), chewing nods. 2 s loop */
function troughEat(m,t,o){const R=rig(m);o=o||{};const h=o.h==null?.55:o.h;const cow=!!(m.lower&&m.lower.length)||R.kind==='cow';const u=clock(t,2);
  if(cow){cowSolve(R);}else if(!R.cache.sheep){R.cache.sheep={dy:0,nr:-.3};R.cache.sheep.dy=muzzleSolve(R,v=>{R.cache.sheep.dy=v;reset(m);sheepPose(R,1);},.006);reset(m);}
  const pose=k=>cow?cowGrazeK(R,k):sheepPose(R,k);const key='te'+h.toFixed(3);
  if(R.cache[key]==null){const s=scOf(R),feet=R.legs.map(l=>l.g);let a=0,b=1;for(let i=0;i<16;i++){const mid=(a+b)/2;reset(m);pose(mid);const g=lowY(R,[m.head])-lowY(R,feet)-h/s;if(g>0)a=mid;else b=mid;}reset(m);R.cache[key]=(a+b)/2;}
  const k=R.cache[key]*seg(t,0,.6);pose(k);const nod=Math.max(0,Math.sin(TAU*1.2*u*2))*seg(t,.5,.7);if(m.neck)m.neck.rotation.x+=-.07*nod;if(m.head)m.head.rotation.x+=-.06*nod;
  const hc=headCore(m);if(hc)hc.rotation.y+=.09*Math.sin(TAU*4.7*u);if(m.tail)m.tail.rotation.z+=.25*Math.sin(TAU*u)+.7*bell(u,.6,.7);return {};}
/* pig.bucketEat: snout in the held pail (the player tips it at snout height), eats with little nods, tail wiggles. .75 s loop */
function pigBucketEat(m,t,o){const R=rig(m);const u=clock(t,.75);const into=seg(t,0,.4);const nod=(1-Math.cos(TAU*u))/2*into;if(m.head){m.head.rotation.x+=(.35*into+.25*nod);m.head.rotation.y+=.06*Math.sin(TAU*2*u)*into;}rotAbout(R,'x',.06*into,0,R.bCenter.y,R.bCenter.z);if(m.tail)m.tail.rotation.z+=.6*Math.sin(TAU*10/6*t);return {};}
/* chicken.grainPeck: quick pecks at the grain on the ground (beak solved to o.h, .026), tail flicks. .375 s per peck */
function chickPeckK(R,sv){const m=R.m;if(m.neck){m.neck.rotation.x+=1.1*sv;m.neck.position.y-=.08*sv;m.neck.position.z+=.04*sv;}rotAbout(R,'x',.45*sv,0,R.legs[0]?R.legs[0].g.position.y:R.bCenter.y,0);R.legs.forEach(l=>{l.g.rotation.x-=.45*sv;});}
function grainPeck(m,t,o){const R=rig(m);o=o||{};const h=o.h==null?.026:o.h;const key='gp'+h.toFixed(3);
  if(R.cache[key]==null){const s=scOf(R),feet=R.legs.map(l=>l.g);let a=0,b=1.5;for(let i=0;i<16;i++){const mid=(a+b)/2;reset(m);chickPeckK(R,mid);const g=lowY(R,[m.head])-lowY(R,feet)-h/s;if(g>0)a=mid;else b=mid;}reset(m);R.cache[key]=(a+b)/2;}
  const x=frac(t/.375);const pk=x<.45?Math.sin(PI*x/.45):0;chickPeckK(R,R.cache[key]*pk*seg(t,0,.1));if(m.tail)m.tail.rotation.x+=.15*Math.sin(TAU*t/1.5);return {};}
/* horse.handEat (6 s loop): lowers its head to the flat hand (lips solved to o.h, default 1.35 m: the hand + feed), nibbles, head up, chews, tail swish.
   horse5 has no neck group: the head turns at most 1.1 rad, so the lips reach down to about 1.5 m; hold the hand there (r.lips = where the lips are, root frame m) */
function horseHandEat(m,t,o){const R=rig(m);o=o||{};const h=o.h==null?1.35:o.h;const u=clock(t,6);const key='he'+h.toFixed(3);
  if(!R.cache.muzzle&&m.head){reset(m);const hb=boxIn(m.head,m.head,new THREE.Box3());R.cache.muzzle=new THREE.Vector3((hb.min.x+hb.max.x)/2,hb.min.y+.25*(hb.max.y-hb.min.y),hb.max.z-.04);}   /* the head group holds the neck too: track the lips, not the lowest point */
  if(R.cache[key]==null){const s=scOf(R),feet=R.legs.map(l=>l.g);const my=k=>{reset(m);headDown(R,k);ground(m);return rootPt(R,m.head,R.cache.muzzle).y;};const sg=my(.5)<my(-.5)?1:-1;   /* which way is down for this head group */
    let a=0,b=1.1;for(let i=0;i<16;i++){const mid=(a+b)/2;const g=my(sg*mid)-h-.04;if(g>0)a=mid;else b=mid;}reset(m);R.cache[key]=sg*(a+b)/2;R.cache.hsg=sg;}
  const dn=seg(u,.2,.36)*(1-seg(u,.66,.78));const nib=u>.38&&u<.66?(1-Math.cos(TAU*(u-.38)*10))/2:0;const sg=R.cache.hsg||1;let hp=R.cache[key]*dn-sg*.06*nib;if(u>.66&&u<.95)hp+=sg*.05*Math.max(0,Math.sin(TAU*(u-.66)*9))*(1-dn);headDown(R,hp);
  if(m.tail){m.tail.rotation.z+=.15*Math.sin(TAU*u)+.7*bell(u,.72,.84)-.5*bell(u,.84,.94);m.tail.rotation.x+=-.25*bell(u,.72,.94);}R.last={gait:'idle',ph:u,lift:0};ground(m);return {lips:rootPt(R,m.head,R.cache.muzzle).toArray()};}
/* cow.patLean: leans in, head down and turned up to your hand (o.k, .35), eyes on you, tail swish, little nods into the pats. 2 s loop */
function cowPatLean(m,t,o){const R=rig(m);o=o||{};const u=clock(t,2);const k=(o.k==null?.35:o.k)*seg(t,0,.5);if(!cowGrazeK(R,k))headDown(R,.3*k);if(m.head){m.head.rotation.x-=1.6*k;m.head.rotation.z+=.08*Math.sin(TAU*2*u)*seg(t,.4,.6);}
  if(m.tail){m.tail.rotation.z+=.2*Math.sin(TAU*u)+.8*bell(u,.3,.5);m.tail.rotation.x+=.3*bell(u,.3,.5);}const hc=headCore(m);if(hc)hc.rotation.y+=.06*Math.sin(TAU*3*u);return {};}
/* sheep.patLean: leans in a little, tail wiggles fast while patted. 2 s loop */
function sheepPatLean(m,t,o){const R=rig(m);if(m.neck&&!R.cache.sheep){sheepGraze(m,0,{});reset(m);}const k=.15*seg(t,0,.4);if(m.neck)sheepPose(R,k);R.b.scale.x*=1+.012*Math.sin(TAU*t);if(m.tail)m.tail.rotation.z+=.7*Math.sin(TAU*7*t)*seg(t,.3,.5);return {};}
/* chicken.puff: puffs up its feathers (body pieces swell 20%), shakes, settles. 1.5 s */
function chickenPuff(m,t,o){const R=rig(m);if(!R.puff){R.puff=R.b.children.filter(q=>q.isMesh);R.puff.forEach(q=>snapObj(R,q));}const pf=bell(t,0,1.4);R.puff.forEach(q=>q.scale.multiplyScalar(1+.2*pf));
  R.b.rotation.z+=.12*Math.sin(TAU*12*t)*bell(t,.7,1.1);if(m.tail)m.tail.rotation.x+=-.35*pf;return {done:t>=1.5};}

/* ---------- move table: name → function, length (s; 0 = loops forever), what triggers it in the game ---------- */
const M={
 'pet.idle':[petIdle,0],'pet.walk':[petWalk,0],'pet.sad':[petSad,0],
 'pet.unhappyBowl':[unhappyBowl,4],'pet.unhappyPlay':[unhappyPlay,0],'pet.unhappyNap':[unhappyNap,4],'pet.unhappyNudge':[unhappyNudge,0],
 'pet.veryHappy':[veryHappy,0],'pet.happyDance':[happyDance,2],
 'pet.sickWalk':[(m,t,o)=>petWalk(m,t,Object.assign({},o,{mood:'sick'})),0],'pet.sickLie':[sickLie,0],'pet.sneeze':[sneeze,1.2],'pet.warnSneeze':[warnSneeze,1.4],
 'pet.nap':[petNap,0],'pet.eat':[petEat,0],'pet.sit':[(m,t)=>{const R=rig(m);sitPose(R,seg(t,0,.7));breathe(R,t,3,.01);return {hold:true};},0],
 'bear.sitUp':[bearSitUp,0],'bear.roll':[bearRoll,0],
 'seal.galumph':[sealGalumph,0],'seal.swim':[sealSwim,0],'seal.ball':[sealBall,0],'seal.clap':[sealClap,1.2],
 'monkey.climb':[monkeyClimb,0],'monkey.happy':[monkeyHappy,0],
 'snake.slither':[snakeSlither,0],'snake.coil':[snakeCoil,0],'snake.lookUp':[snakeLook,0],
 'farm.walk':[petWalk,0],'farm.lookAtYou':[lookAtYou,0],
 'cow.graze':[cowGraze,0],'cow.stand':[cowStand,0],
 'sheep.look':[sheepLook,0],'sheep.lambHop':[lambHop,0],
 'chicken.walk':[chickenWalk,0],'chicken.peck':[chickenPeck,0],'chicken.run':[chickenRun,0],
 'pig.root':[pigRoot,0],'pig.roll':[pigRoll,0],
 'horse.walk':[(m,t,o)=>horseGait(m,t,Object.assign({},o,{gait:'walk'})),0],'horse.trot':[(m,t,o)=>horseGait(m,t,Object.assign({},o,{gait:'trot'})),0],
 'horse.gallop':[(m,t,o)=>horseGait(m,t,Object.assign({},o,{gait:'gallop'})),0],'horse.jump':[horseJump,1.6],'horse.idle':[horseIdle,0],'horse.refuse':[horseRefuse,2],
 'farmdog.sleep':[farmdogSleep,0],'farmdog.lie':[farmdogLie,0],
 'person.walk':[personWalk,0],'person.idle':[personIdle,0],'person.ride':[riderSeat,0],'person.crouch':[personCrouch,0],
 'coach.point':[coachPoint,0],'coach.whistle':[coachWhistle,0],'coach.cheer':[coachCheer,0],
 'vet.listen':[vetListen,0],'vet.check':[vetCheck,0],'nurse.treat':[nurseTreat,3],
 /* round 2 (31 Oct): the approved previews */
 'sheep.graze':[sheepGraze,0],
 'snake.path':[snakePath,0],'snake.sleepHide':[snakeSleep,0],'snake.look':[snakeLookRound,0],'snake.basket':[trSnakeBasket,0],
 'person.stairs':[personStairs,0],'pet.stairs':[petStairs,0],
 'pet.lie':[petLie,0],'cat.window':[catWindow,0],'bunny.hillHop':[bunnyHill,0],'hamster.run':[hamsterRun,0],'capy.tub':[capyTub,0],'duck.paddle':[duckPaddle,0],
 'owl.perch':[owlPerch,0],'bear.tv':[bearTV,0],'seal.slide':[sealSlide,0],'monkey.bars':[monkeyBars,0],
 'bear.denNap':[bearDenNap,0],'seal.nap':[sealNap,0],'pet.takeFood':[takeFood,2],'person.offerFood':[offerFood,0],
 'dog.agility':[(m,t,o)=>jumpRun(m,t,o,'gallop',.62),0],'bunny.hurdles':[(m,t,o)=>jumpRun(m,t,o,'walk',.48),0],'cat.wand':[catWand,0],'hamster.wheel':[hamsterWheel,0],
 'bear.logPush':[bearLogPush,0],'capy.hopIn':[capyHopIn,1.2],'duck.splash':[duckSplash,1],'owl.fly':[owlFly,0],
 'pet.wait':[petWait,0],'pet.waitLie':[petWaitLie,0],'pet.greet':[petGreet,1.6],'pet.climbOn':[petClimbOn,1.4],'pet.vetNervous':[vetNervous,0],'pet.takeTreat':[takeTreat,2.4],
 'person.giveCard':[giveCard,4],'person.takeCard':[takeCard,3.6],'person.reach':[personReach,0],'person.milk':[personMilk,0],'horse.overGate':[horseOverGate,0],
 /* round 3 (31 Oct): Pet Show tricks (one API + named moves), toy play, farm feeding and petting */
 'trick':[trick,0],
 'trick.dog.highFive':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'dog',trick:'highFive'})),TRICK_LEN['dog.highFive']||TT],'trick.dog.agility':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'dog',trick:'agility'})),TRICK_LEN['dog.agility']||TT],'trick.dog.rollOver':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'dog',trick:'rollOver'})),TRICK_LEN['dog.rollOver']||TT],
 'trick.cat.spin':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'cat',trick:'spin'})),TRICK_LEN['cat.spin']||TT],'trick.cat.tower':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'cat',trick:'tower'})),TRICK_LEN['cat.tower']||TT],'trick.cat.highFive':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'cat',trick:'highFive'})),TRICK_LEN['cat.highFive']||TT],
 'trick.bunny.bigJump':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'bunny',trick:'bigJump'})),TRICK_LEN['bunny.bigJump']||TT],'trick.bunny.hurdles':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'bunny',trick:'hurdles'})),TRICK_LEN['bunny.hurdles']||TT],'trick.bunny.spin':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'bunny',trick:'spin'})),TRICK_LEN['bunny.spin']||TT],
 'trick.hamster.spin':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'hamster',trick:'spin'})),TRICK_LEN['hamster.spin']||TT],'trick.hamster.maze':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'hamster',trick:'maze'})),TRICK_LEN['hamster.maze']||TT],'trick.hamster.rollOver':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'hamster',trick:'rollOver'})),TRICK_LEN['hamster.rollOver']||TT],
 'trick.capybara.dance':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'capybara',trick:'dance'})),TRICK_LEN['capybara.dance']||TT],'trick.capybara.bathSpin':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'capybara',trick:'bathSpin'})),TRICK_LEN['capybara.bathSpin']||TT],'trick.capybara.rollOver':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'capybara',trick:'rollOver'})),TRICK_LEN['capybara.rollOver']||TT],
 'trick.duck.dance':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'duck',trick:'dance'})),TRICK_LEN['duck.dance']||TT],'trick.duck.bigJump':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'duck',trick:'bigJump'})),TRICK_LEN['duck.bigJump']||TT],'trick.duck.spin':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'duck',trick:'spin'})),TRICK_LEN['duck.spin']||TT],
 'trick.owl.headTurn':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'owl',trick:'headTurn'})),TRICK_LEN['owl.headTurn']||TT],'trick.owl.perchHop':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'owl',trick:'perchHop'})),TRICK_LEN['owl.perchHop']||TT],'trick.owl.spin':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'owl',trick:'spin'})),TRICK_LEN['owl.spin']||TT],
 'trick.monkey.clap':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'monkey',trick:'clap'})),TRICK_LEN['monkey.clap']||TT],'trick.monkey.bars':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'monkey',trick:'bars'})),TRICK_LEN['monkey.bars']||TT],'trick.monkey.flip':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'monkey',trick:'flip'})),TRICK_LEN['monkey.flip']||TT],
 'trick.seal.clap':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'seal',trick:'clap'})),TRICK_LEN['seal.clap']||TT],'trick.seal.ballNose':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'seal',trick:'ballNose'})),TRICK_LEN['seal.ballNose']||TT],'trick.seal.rollOver':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'seal',trick:'rollOver'})),TRICK_LEN['seal.rollOver']||TT],
 'trick.bear.wave':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'bear',trick:'wave'})),TRICK_LEN['bear.wave']||TT],'trick.bear.logWalk':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'bear',trick:'logWalk'})),TRICK_LEN['bear.logWalk']||TT],'trick.bear.rollOver':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'bear',trick:'rollOver'})),TRICK_LEN['bear.rollOver']||TT],
 'trick.snake.sway':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'snake',trick:'sway'})),TRICK_LEN['snake.sway']||TT],'trick.snake.basket':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'snake',trick:'basket'})),TRICK_LEN['snake.basket']||TT],'trick.snake.coilSpin':[(m,t,o)=>trick(m,t,Object.assign({},o,{kind:'snake',trick:'coilSpin'})),TRICK_LEN['snake.coilSpin']||TT],
 'monkey.frisbee':[monkeyFrisbee,TT],'seal.toyBall':[sealToyBall,TT],'bear.squeaky':[bearSqueaky,TT],'snake.mouse':[snakeMouse,TT],
 'person.pourBucket':[pourBucket,2.4],'person.scatterGrain':[scatterGrain,0],'person.handFeed':[handFeed,0],'person.pat':[personPat,0],
 'farm.troughEat':[troughEat,0],'pig.bucketEat':[pigBucketEat,0],'chicken.grainPeck':[grainPeck,0],'horse.handEat':[horseHandEat,0],
 'cow.patLean':[cowPatLean,0],'sheep.patLean':[sheepPatLean,0],'chicken.puff':[chickenPuff,1.5],
 /* round 4 (31 Oct): show staff */
 'person.groom':[personGroom,0],'horse.groomed':[horseGroomed,0],'person.talk':[personTalk,0],'coach.directTo':[coachDirectTo,4]
};
/* play one move for one frame. Never throws for a missing group; an unknown name plays idle. */
function play(m,name,t,o){o=o||{};const R=rig(m,o.kind?{kind:o.kind}:null);reset(m);const e=M[name]||M[R.kind==='person'?'person.idle':'pet.idle'];
  let r;try{r=e[0](m,Math.max(0,t),o)||{};}catch(err){if(!R.warned){R.warned=1;console.warn('COZY_MOVES',name,err);}reset(m);r={};}
  if(!r.noGround&&!o.noGround){if(o.slope)slopeGround(R,o.slope);else ground(m,o);}if(r.lift)(R.top||R.b).position.y+=r.lift;
  r.name=name;if(e[1]&&t>=e[1])r.done=true;return r;}
window.COZY_MOVES={version:'2026-10-31d',stairH,examples:{tankPath},TRICKS,trickGear,trickLength:(kind,id)=>TRICK_LEN[TRICK_KIND(kind)+'.'+id]||TT,play,list:Object.keys(M),lengths:Object.fromEntries(Object.keys(M).map(k=>[k,M[k][1]])),KIND,
  core:{clamp:cl,ease,seg,bell,arc,clock,legAng,swingK,rig,reset,ground,boxIn,stride,rotAbout,solveTilt,aimArm,wag,tailUp,headDown,breathe,slopeGround,lids,blink,wingTurn,poseLie,poseSit,pathAt,pathOf,snakePlace,muzzleSolve},
  moves:{petIdle,petWalk,petSad,unhappyBowl,unhappyPlay,unhappyNap,unhappyNudge,veryHappy,happyDance,sickLie,sneeze,warnSneeze,petNap,petEat,
    bearSitUp,bearRoll,sealGalumph,sealSwim,sealBall,sealClap,monkeyClimb,monkeyHappy,snakeSlither,snakeCoil,snakeLook,
    cowGraze,cowStand,lookAtYou,sheepLook,lambHop,chickenWalk,chickenPeck,chickenRun,pigRoot,pigRoll,horseGait,horseJump,horseIdle,horseRefuse,farmdogSleep,farmdogLie,
    personWalk,personIdle,riderSeat,coachPoint,coachWhistle,coachCheer,vetListen,vetCheck,nurseTreat,personCrouch,
    sheepGraze,snakePath,snakeSleep,snakeLookRound,snakeBasket,personStairs,petStairs,petLie,catWindow,bunnyHill,hamsterRun,capyTub,duckPaddle,owlPerch,bearTV,sealSlide,monkeyBars,
    bearDenNap,sealNap,takeFood,offerFood,jumpRun,catWand,hamsterWheel,bearLogPush,capyHopIn,duckSplash,owlFly,petWait,petWaitLie,petGreet,petClimbOn,vetNervous,takeTreat,
    giveCard,takeCard,personReach,personMilk,horseOverGate,personGroom,horseGroomed,personTalk,coachDirectTo,trick,monkeyFrisbee,sealToyBall,bearSqueaky,snakeMouse,pourBucket,scatterGrain,handFeed,personPat,troughEat,pigBucketEat,grainPeck,horseHandEat,cowPatLean,sheepPatLean,chickenPuff}};
})();
/* ===== packTest: real c12 models driven ONLY through window.COZY_MOVES (the moves pack above) ===== */
(()=>{const H=window.MVH,MV2=window.COZY_MOVES;const {cell,stage,dbg,seg}=H;const P_=Math.PI;
/* hold a builder's model so it faces +x on the stage (like jointed()); the pack does all posing and the ground fix */
function hold(m){const root2=new THREE.Group(),turn=new THREE.Group();turn.rotation.y=P_/2;turn.add(m.root);root2.add(turn);root2.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(root2);return {m,root2,turn,L:bb.max.x-bb.min.x,H:bb.max.y-bb.min.y,W:bb.max.z-bb.min.z,worst:0};}
/* after each frame: shadow under the body, and a check that the lowest point is on the ground (ERR line if not, unless in the air) */
const bb=new THREE.Box3(),v=new THREE.Vector3();
function after(R,name,r,lab){R.root2.updateMatrixWorld(true);bb.makeEmpty();R.root2.traverseVisible(o=>{if(!o.isMesh||!o.geometry)return;const pa=o.geometry.attributes.position;for(let i=0;i<pa.count;i+=pa.count>400?2:1)bb.expandByPoint(v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld));});
  const low=bb.min.y;if(!(r&&r.lift)&&!(r&&r.noGround)&&Math.abs(low)>.006&&Math.abs(low)>Math.abs(R.worst)){R.worst=low;dbg('GROUND',lab,name,'low',low.toFixed(3));}
  if(R.shadow){const c=bb.getCenter(v);R.shadow.position.set(c.x,.004,c.z);R.shadow.scale.set((bb.max.x-bb.min.x)*.55,(bb.max.z-bb.min.z)*.55,1);R.shadow.material.opacity=.28;}}
/* a cell that plays a list of [move, seconds, opts] in order over the loop; walks scroll the ground by o.walk (metres per second) */
function story(label,sub,build,steps,camO){return cell(label,sub,()=>{const m=build();const R=hold(m);const st=stage(R,Object.assign({zoom:.95,yaw:.5,cy:.5},camO||{}));
  const T=steps.reduce((s,x)=>s+x[1],0);let D=0;const starts=[];for(const s of steps){starts.push(D);D+=(s[2]&&s[2].walk||0)*s[1];}st.fit(D);
  const extra=(steps.extra||(()=>null))(st,R);
  return {S:st.S,C:st.C,tick:t=>{const sec=t*T;let a=0,i=0;while(i<steps.length-1&&sec>=a+steps[i][1]){a+=steps[i][1];i++;}const [name,dur,o0]=steps[i];const o=Object.assign({},o0||{});const lt=sec-a;
    let dist=starts[i];if(o.walk){const k=o.stop?1-seg(lt,dur-o.stop,dur):1;dist+=o.walk*lt;o.dist=dist;if(o.stop)o.amp=k;}
    const r=MV2.play(m,name,lt,o);if(extra&&extra.tick)extra.tick(sec,dist,r);st.setDist(dist);after(R,name,r,label);}};});}
const col=(k,i)=>FARM_COLS[k][i||0];
/* 1 jointed puppy: walks to its bowl, sniffs, sits (Unhappy sign 1) */
const s1=[['pet.walk',1.2,{walk:.55,stop:.4}],['pet.unhappyBowl',3.8]];
s1.extra=(st,R)=>{const g=new THREE.Mesh(new THREE.CylinderGeometry(.11,.085,.06,20),new THREE.MeshLambertMaterial({color:'#9aa7c7'}));st.S.add(g);const x0=R.L*.5+.01;
  return {tick:(sec,dist)=>{g.position.set(x0+(.55*1.2-dist),.03,0);}};};
/* 12 coach: points at the jump, blows the whistle, cheers */
const look=Object.assign({},DEFAULT_LOOK,{top:'#5fae6a',bottom:'#3d3550',hat:'none'});
const SETS_PACK={title:'Moves pack test: real models, moved only by COZY_MOVES',cols:4,cw:300,ch:240,frames:60,cells:[
  story('Puppy (jointed)','to the bowl, sniffs, sits',()=>dogJoint(PET_TYPES.dog.cols[0]),s1,{zoom:.7,yaw:.75,cy:.45}),
  story('Cat','play bow, two hops',()=>makePet('cat',PET_TYPES.cat.cols[0]),[['pet.unhappyPlay',3]],{zoom:.8,cy:.7}),
  story('Bunny','hops, then very happy',()=>makePet('bunny',PET_TYPES.bunny.cols[1]),[['pet.walk',2.4,{walk:.5}],['pet.veryHappy',2.4]],{zoom:.85,cy:.8}),
  story('Puppy (game)','sick: slow walk, lies, sneezes',()=>makePet('dog',PET_TYPES.dog.cols[1]),[['pet.sickWalk',2,{walk:.2}],['pet.sickLie',4]],{zoom:.75,yaw:.7}),
  story('Cow','graze: neck out and down, bites',()=>farmAnimal('cow',col('cow')),[['cow.graze',6]],{zoom:.62,yaw:.75,pitch:.3}),
  story('Sheep','walk, stop, look around',()=>farmAnimal('sheep',col('sheep')),[['farm.walk',2.5,{walk:.5,stop:.5}],['sheep.look',3.5]],{zoom:.7}),
  story('Chicken','head-bob walk, scratch, peck',()=>farmAnimal('chicken',col('chicken',1)),[['chicken.walk',2,{walk:.35,stop:.3}],['chicken.peck',3]],{zoom:.8,yaw:.8}),
  story('Pig','rolls full circles in the mud',()=>farmAnimal('pig',col('pig')),[['pig.roll',3.2]],{zoom:.72,yaw:.6,g1:'#a0805a',g2:'#8a6a48'}),
  story('Seal','galumphs on land',()=>makePUPet('seal'),[['seal.galumph',3,{walk:.4}]],{zoom:.8,yaw:.6}),
  cell('Horse + rider','gallop, rider seated',()=>{const h=farmAnimal('horse',col('horse'),'adult');const p=riderOn(h,{top:'#ff7aa8'});const R=hold(h);const st=stage(R,{zoom:.62,yaw:.45,cy:.55});
    const sd=MV2.core.stride(h,.55),T=2,N=Math.max(1,Math.round(T*7/sd)),D=N*sd;st.fit(D);
    return {S:st.S,C:st.C,tick:t=>{const r=MV2.play(h,'horse.gallop',t*T,{dist:D*t});MV2.play(p,'person.ride',t*T,{horse:h});st.setDist(D*t);after(R,'horse.gallop',r,'Horse');}};}),
  story('Bear','very happy: rolls on its back',()=>makePUPet('bear'),[['bear.roll',4.8]],{zoom:.7,yaw:.6}),
  story('Coach','points, whistles, cheers',()=>makePerson(look),[['coach.point',2.5],['coach.whistle',2],['coach.cheer',3.2]],{zoom:.75,yaw:1.05,cy:.55})
]};CLIPS2.packTest=SETS_PACK;
})();
