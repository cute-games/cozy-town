/* ===== packTest2: round-2 moves on the real c13 models, moved ONLY through window.COZY_MOVES ===== */
(()=>{const H=window.MVH,MV2=window.COZY_MOVES;const {cell,stage,dbg,seg,bell,ease,cl}=H;const P_=Math.PI,TAU=2*P_;const V=(x,y,z)=>new THREE.Vector3(x,y,z);
function hold(m){const root2=new THREE.Group(),turn=new THREE.Group();turn.rotation.y=P_/2;turn.add(m.root);root2.add(turn);root2.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(root2);return {m,root2,turn,L:bb.max.x-bb.min.x,H:bb.max.y-bb.min.y,W:bb.max.z-bb.min.z,worst:0};}
const bb=new THREE.Box3(),v=new THREE.Vector3();
function lowOf(obj){obj.updateMatrixWorld(true);bb.makeEmpty();obj.traverseVisible(o=>{if(!o.isMesh||!o.geometry||o.userData.noGround)return;const pa=o.geometry.attributes.position;for(let i=0;i<pa.count;i+=pa.count>400?2:1)bb.expandByPoint(v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld));});return bb;}
/* GROUND check: the lowest point must be on the floor (fy) unless the move lifts or has no ground fix */
function after(R,name,r,lab,fy){const b=lowOf(R.root2);const low=b.min.y-(fy||0);if(!(r&&r.lift)&&!(r&&r.noGround)&&Math.abs(low)>.006&&Math.abs(low)>Math.abs(R.worst)){R.worst=low;dbg('GROUND',lab,name,'low',low.toFixed(3));}
  if(R.shadow){const c=b.getCenter(v);R.shadow.position.set(c.x,(fy||0)+.004,c.z);R.shadow.scale.set((b.max.x-b.min.x)*.55,(b.max.z-b.min.z)*.55,1);R.shadow.material.opacity=.28;}}
function story(label,sub,build,steps,camO,extraF){return cell(label,sub,()=>{const m=build();const R=hold(m);const st=stage(R,Object.assign({zoom:.95,yaw:.5,cy:.5},camO||{}));
  const T=steps.reduce((s,x)=>s+x[1],0);let D=0;const starts=[];for(const s of steps){starts.push(D);D+=(s[2]&&s[2].walk||0)*s[1];}st.fit(D);const extra=extraF?extraF(st,R,m):null;
  return {S:st.S,C:st.C,tick:t=>{const sec=t*T;let a=0,i=0;while(i<steps.length-1&&sec>=a+steps[i][1]){a+=steps[i][1];i++;}const [name,dur,o0]=steps[i];const o=Object.assign({},o0||{});const lt=sec-a+(o.toff||0);
    let dist=starts[i];if(o.walk){dist+=o.walk*lt;o.dist=dist;}const r=MV2.play(m,name,lt,o);if(extra&&extra.tick)extra.tick(sec,dist,r);st.setDist(dist);after(R,name,r,label);}};});}
const col=(k,i)=>FARM_COLS[k][i||0];
function grab(id,opt,fn){let got=null;const og=window[fn];window[fn]=function(...a){const r=og.apply(this,a);if(!got)got=r;return r;};try{PU[id].build(new THREE.Group(),Object.assign({},PU[id].dflt||{},opt||{}));}finally{window[fn]=og;}return got;}
function aim(C,x,y,z,d,yaw,pitch){C.position.set(x+Math.sin(yaw)*Math.cos(pitch)*d,y+Math.sin(pitch)*d,z+Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(x,y,z);C.near=d/60;C.far=d*40;C.updateProjectionMatrix();}
const box=(par,w,h,d,c,x,y,z)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:c}));q.position.set(x,y,z);par.add(q);return q;};
const look=Object.assign({},DEFAULT_LOOK,{top:'#ff7aa8',bottom:'#3d3550',hat:'none'});

/* 3 snake: the c13 terrarium; asleep in the hide → out over the lip → looks round → back in → asleep (path = COZY_MOVES.examples.tankPath) */
function cSnake(){return cell('Snake + terrarium','path out, looks, back in, sleeps',()=>{const S=H.scene('#d8ece4');const f=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshLambertMaterial({color:'#e8d2b0'}));f.rotation.x=-P_/2;S.add(f);
  const tk=new THREE.Group();PU['home:tank'].build(tk,Object.assign({},PU['home:tank'].dflt));S.add(tk);const m=puPet('snake',null,'adult');S.add(m.root);const TP=MV2.examples.tankPath();dbg('tank path len',TP.len.toFixed(2),'out',TP.out.map(x=>x.toFixed(2)),'in',TP.in.map(x=>x.toFixed(2)));
  const C=new THREE.PerspectiveCamera(32,1,.05,80);aim(C,.25,.25,.7,4.9,.38,.42);const T=12;
  return {S,C,tick:t=>{const sec=t*T;let r;
    if(sec<1)r=MV2.play(m,'snake.sleepHide',sec,{pts:TP.pts,s:TP.out[0]});
    else if(sec<5.5)r=MV2.play(m,'snake.path',sec-1,{pts:TP.pts,s:TP.out[0]+(TP.out[1]-TP.out[0])*ease((sec-1)/4.5)});
    else if(sec<7.5)r=MV2.play(m,'snake.look',sec-5.5,{pts:TP.pts,s:TP.out[1]});
    else if(sec<11)r=MV2.play(m,'snake.path',sec-7.5,{pts:TP.pts,s:TP.in[0]+(TP.in[1]-TP.in[0])*ease((sec-7.5)/3.5)});
    else r=MV2.play(m,'snake.sleepHide',sec-11,{pts:TP.pts,s:TP.in[1]});}};});}

/* 4/5 stairs: the shop's steps (rise .23, run .29), 6 steps; the stand-in player and the dog side by side; the game moves the root, the pack does the rest */
function cStairs(down){return cell(down?'Stairs down':'Stairs up',down?'person hops down, dog follows':'person hops up, dog front then back paws',()=>{const S=H.scene('#d8ece4');const f=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshLambertMaterial({color:'#f6ecd8'}));f.rotation.x=-P_/2;S.add(f);
  const rise=.23,run=.29,n=6,o={rise,run,n,down};const W=new THREE.Group();S.add(W);W.rotation.y=P_/2;   /* stairs along +z of the walkers = +x on screen */
  const top=n*rise;const y0=down?top:0;   /* root y = the floor where the flight starts */
  for(let k=0;k<n;k++){const z0=down?k*run:k*run,h=down?top-(k+1)*rise:(k+1)*rise;box(W,1.6,h,run,k%2?'#e0c49a':'#d4b48a',0,h/2,z0+run/2);}
  if(down)box(W,1.6,top,1.2,'#d4b48a',0,top/2,-.6);else box(W,1.6,top,1.2,'#d4b48a',0,top/2,n*run+.6);
  const P=makePerson(look);const D=makePet('dog',PET_TYPES.dog.cols[0]);W.add(P.root);W.add(D.root);P.root.position.x=.35;D.root.position.x=-.35;
  const T=5,d0=-.35,d1=n*run+.25;const C=new THREE.PerspectiveCamera(32,1,.05,80);aim(C,.8,1.25,0,6.6,.1,.12);
  const st={pen:0,penAt:'',fl:0};const chk=(m,who,r,sec)=>{m.root.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(W.matrixWorld).invert();let lo=9;
    m.root.traverseVisible(q=>{if(!q.isMesh||!q.geometry||q.userData.noGround||(q.material&&q.material.side===THREE.BackSide))return;const pa=q.geometry.attributes.position;const M=new THREE.Matrix4().multiplyMatrices(inv,q.matrixWorld);
      for(let i=0;i<pa.count;i+=2){v.fromBufferAttribute(pa,i).applyMatrix4(M);const hh=y0+MV2.stairH(o,v.z+.0001);const g=v.y-hh;if(g<-st.pen){st.pen=-g;st.penAt=who+' t'+sec.toFixed(2)+' z'+v.z.toFixed(2);}lo=Math.min(lo,g);}});return lo;};
  let maxGap={P:0,D:0};
  return {S,C,tick:t=>{const sec=t*T;const dist=d0+(d1-d0)*ease(cl(sec/4.6));[[P,'person.stairs','P'],[D,'pet.stairs','D']].forEach(([m,nm,w])=>{m.root.position.set(m.root.position.x,y0,dist);const r=MV2.play(m,nm,sec,Object.assign({dist},o));
      const lo=chk(m,w,r,sec);if(lo>maxGap[w]&&w==='D'){maxGap[w]=lo;}});
    if(t>=59/60-1e-6)dbg('STAIRS',down?'down':'up','sink',st.pen.toFixed(3),st.penAt,'| dog max lowest-point gap',maxGap.D.toFixed(3));}};});}

/* 7 seal on the pool chute: slides down, swims, galumphs back up the chute (the slope through o.slope) */
function cSeal(){return cell('Seal: chute','slides down, swims, galumphs up',()=>{const S=H.scene('#d8ece4');const f=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshLambertMaterial({color:'#f6ecd8'}));f.rotation.x=-P_/2;S.add(f);
  const ang=.42,len=2.6,top=len*Math.sin(ang),run=len*Math.cos(ang);const ramp=box(S,1.0,.04,len,'#7fd8ff',0,0,0);ramp.rotation.x=ang;ramp.position.set(0,top/2-.02,-run/2);   /* chute from z=-run (top) down to z=0 */
  const leg=box(S,1.0,top,.1,'#c9c2d6',0,top/2,-run-.05);const water=new THREE.Mesh(new THREE.PlaneGeometry(4,3),new THREE.MeshLambertMaterial({color:'#5fb8ef',transparent:true,opacity:.75}));water.rotation.x=-P_/2;water.position.set(0,.35,1.6);S.add(water);
  const pool=box(S,4,.35,3,'#2f6aa8',0,.17,1.6);pool.material.transparent=true;pool.material.opacity=.35;pool.material.depthWrite=false;pool.renderOrder=2;water.renderOrder=3;water.material.depthWrite=false;const m=puPet('seal',null,'adult');S.add(m.root);const C=new THREE.PerspectiveCamera(32,1,.05,80);aim(C,0,.7,.3,7.5,1.25,.3);const T=9;
  const onR=z=>z<0?Math.max(0,-z*Math.tan(ang)):0;
  return {S,C,tick:t=>{const sec=t*T;let r;
    if(sec<2.2){const u=ease(cl(sec/2.2));const z=-run*.85+run*.85*u+.0;m.root.position.set(0,onR(z),z);m.root.rotation.y=0;r=MV2.play(m,'seal.slide',sec,{slope:{pitch:-ang}});}
    else if(sec<4.6){const u=(sec-2.2)/2.4;const a=TAU*u;m.root.position.set(.9*Math.sin(a),.35-.32,1.6-.9*Math.cos(a)+.0);m.root.rotation.y=a+P_/2;r=MV2.play(m,'seal.swim',sec-2.2,{});if(u<.1||u>.9)m.root.position.set(0,.03,.7+(1-Math.min(u/.1,(1-u)/.1))*-.0);}
    else if(sec<5.2){const u=ease((sec-4.6)/.6);m.root.position.set(0,0,.5-u*.5);m.root.rotation.y=P_;r=MV2.play(m,'seal.galumph',sec,{dist:u*.5});}
    else{const d=(sec-5.2)/3.8*run*.85;const z=-d;m.root.position.set(0,onR(z),z);m.root.rotation.y=P_;r=MV2.play(m,'seal.galumph',sec,{dist:.5+d/Math.cos(ang),slope:{pitch:ang}});}}};});}

/* 8 monkey: hand over hand along the bars, turns, back (root = bar 0 grip point) */
function cMonkey(){return cell('Monkey: bars','hand over hand, turns, swings back',()=>{const S=H.scene('#d8ece4');const f=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshLambertMaterial({color:'#8fbf6a'}));f.rotation.x=-P_/2;S.add(f);
  const gap=.34,n=3,BY=1.7;const m=puPet('monkey',null,'adult');for(let k=0;k<=n;k++){const b=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,.7,10),new THREE.MeshLambertMaterial({color:'#ffd45c'}));b.rotation.z=P_/2;b.position.set(0,BY,k*gap);S.add(b);}
  for(const x of[-.35,.35])box(S,.04,.04,n*gap+.3,'#5fd4b0',x,BY,n*gap/2);S.add(m.root);m.root.position.set(0,BY,0);const C=new THREE.PerspectiveCamera(32,1,.05,80);aim(C,0,1.25,.5,4.2,.9,.18);const T=2*(n*.58+.78);
  return {S,C,tick:t=>{MV2.play(m,'monkey.bars',t*T,{gap,n});}};});}

/* 10 milking: the cow stands and chews (cow.stand), the player crouches by her side and milks (hands at the udder) */
function cMilk(){return cell('Milking','person crouches, hands take turns',()=>{const cow=farmAnimal('cow',col('cow'));const R=hold(cow);const st=stage(R,{zoom:.85,yaw:.95,pitch:.25,cy:.45});
  const P=makePerson(look);const pg=new THREE.Group();pg.add(P.root);st.S.add(pg);
  /* the person stands beside the cow's flank facing it; target = the udder in the person's root frame */
  pg.position.set(-.3,0,1.3);pg.rotation.y=P_;cow.root.updateMatrixWorld(true);
  const ud=cow.milk?cow.b.localToWorld(cow.milk.clone()):V(-.2,.45,0);const T=6;const Rp={root2:pg,worst:0};
  return {S:st.S,C:st.C,tick:t=>{const sec=t*T;const r=MV2.play(cow,'cow.stand',sec,{});after(R,'cow.stand',r,'Milking cow');
    pg.updateMatrixWorld(true);const u=ud.clone();cow.root.updateMatrixWorld(true);const U=cow.b.localToWorld(cow.milk?cow.milk.clone():V(0,.4,-.2));P.root.worldToLocal(U);
    const r2=MV2.play(P,'person.milk',sec,{target:[U.x,U.y,U.z]});after(Rp,'person.milk',r2,'Milking person');}};});}

/* 11 license: Sir Barkley hands the card over, the player takes it and cheers, the dog hops */
function cLicense(){return cell('License hand-over','Barkley gives, you take it, cheer; dog hops',()=>{const S=H.scene('#d8ece4');const f=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshLambertMaterial({map:H.grassTex('#8fbf6a','#7aad57')}));f.material.map.repeat.set(15,15);f.material.map.wrapS=f.material.map.wrapT=THREE.RepeatWrapping;f.rotation.x=-P_/2;S.add(f);
  const B=makePerson({skin:'#d9a06b',hair:'#1f1a2e',style:'short',top:'#3d4a7a',bottom:'#2e2347',shoes:'#2e2347',hat:'tophat',glasses:'glasses'});const Pl=makePerson(look);const D=makePet('dog',PET_TYPES.dog.cols[1]);
  S.add(B.root);S.add(Pl.root);S.add(D.root);B.root.position.set(.55,0,0);B.root.rotation.y=-P_/2;Pl.root.position.set(-.55,0,0);Pl.root.rotation.y=P_/2;D.root.position.set(-.8,0,.7);D.root.rotation.y=P_/2;
  const card=box(S,.3,.2,.012,'#e8c84a',0,0,0);const C=new THREE.PerspectiveCamera(32,1,.05,80);aim(C,0,.85,0,4.4,0,.12);const T=6;const mid=V(0,.95,0);
  const tgt=(m)=>{m.root.updateMatrixWorld(true);const p=m.root.worldToLocal(mid.clone());return [p.x,p.y,p.z];};
  return {S,C,tick:t=>{const sec=t*T;const rb=MV2.play(B,'person.giveCard',sec,{target:tgt(B)});const rp=sec<1.4?MV2.play(Pl,'person.idle',sec,{}):MV2.play(Pl,'person.takeCard',sec-1.4,{target:tgt(Pl)});
    const rd=sec<3.2?MV2.play(D,'pet.sit',sec,{}):MV2.play(D,'pet.veryHappy',sec-3.2,{});
    /* the card: in Barkley's hand, then the player's (the game's prop; hand point = arm end) */
    const hand=(m,i)=>{m.root.updateMatrixWorld(true);return m.arms[i].localToWorld(V(0,-.52,0));};const inB=rb.card==='hand'&&sec<1.84;card.visible=sec>.5;card.position.copy(inB?hand(B,1):hand(Pl,0));card.rotation.y=P_/2;}};});}

/* other cells: capybara tub, duck pond, owl branch (stand-in perch), dog lies + cat window, dog eats from a bowl (o.h), agility jumps, bear TV */
function water(st,y){const w=new THREE.Mesh(new THREE.CylinderGeometry(1.0,1.0,y,32),new THREE.MeshLambertMaterial({color:'#7fd8ff',transparent:true,opacity:.45,depthWrite:false}));w.position.y=y/2;w.renderOrder=3;st.S.add(w);return w;}
function surfY(G,x,z){G.updateMatrixWorld(true);const ms=[];G.traverse(q=>{if(q.isMesh&&q.material.side!==THREE.BackSide)ms.push(q);});const h=new THREE.Raycaster(V(x,40,z),V(0,-1,0)).intersectObjects(ms,false)[0];return h?h.point.y:0;}
function gearP(S,id){const g=new THREE.Group();PU[id].build(g,Object.assign({},PU[id].dflt||{}));S.add(g);return g;}
function shopRoom(wz){const S=H.scene('#d8ece4');const f=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshLambertMaterial({color:'#f6ecd8'}));f.rotation.x=-P_/2;S.add(f);
  if(wz!=null)box(S,14,3.2,.2,'#e6f8f0',0,1.6,wz-.1);return S;}
function camR(tx,ty,tz,r,yaw,pitch){const C=new THREE.PerspectiveCamera(32,1,.01,500);aim(C,tx,ty,tz,r/Math.sin(16*P_/180)*1.05,yaw,pitch);return C;}
function cCapy(){return cell('Capybara tub','soaks to the chin, bobs, sways, blinks',()=>{const S=shopRoom(-1.3);const G=gearP(S,'shop:capytub');const wy=surfY(G,.2,.2);
  const m=grab('age:capybara',{v:'real',age:'adult'},'capyReal2');S.add(m.root);m.root.position.set(-.1,wy,-.06);m.root.rotation.y=-1.45+P_/2;
  const C=camR(-.05,.66,.1,.8,.25,.3);return {S,C,tick:t=>{MV2.play(m,'capy.tub',t*5,{});}};});}
function cDuck(){return cell('Duck paddles','head dips, tail wags (sink .15)',()=>{const m=grab('age:duck',{age:'adult'},'makePet');const R=hold(m);const st=stage(R,{zoom:.9,yaw:.6,pitch:.25,cy:.5});
  const r0=MV2.play(m,'duck.paddle',0,{});const wy=.3;R.root2.position.y=wy-r0.sink;water(st,wy);R.shadow.visible=false;
  return {S:st.S,C:st.C,tick:t=>{MV2.play(m,'duck.paddle',t*5,{});R.root2.rotation.y=.4*Math.sin(TAU*t);}};});}
function cOwl(){return cell('Owl on its perch','blinks, head turns, wing shuffle',()=>{const S=shopRoom(-1.2);const m=grab('age:owl',{age:'adult'},'makePet');
  const py=.9;box(S,.1,py,.1,'#8a5a36',0,py/2,-.05);const br=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.9,10),new THREE.MeshLambertMaterial({color:'#8a5a36'}));br.rotation.z=P_/2;br.position.set(0,py,0);S.add(br);
  S.add(m.root);m.root.position.set(0,py+.04,0);const C=camR(0,py+.42,0,.62,.25,.1);const Rq={root2:m.root,worst:0};
  return {S,C,tick:t=>{const r=MV2.play(m,'owl.perch',t*5,{});after(Rq,'owl.perch',r,'Owl',py+.04);}};});}
function cDogLie(){return cell('Dog lies','chin on its paws, breathes, tail thumps',()=>{const d=makePet('dog',PET_TYPES.dog.cols[0]);const R=hold(d);const st=stage(R,{zoom:.75,yaw:.75,pitch:.25,cy:.3});
  return {S:st.S,C:st.C,tick:t=>{const r=MV2.play(d,'pet.lie',4.99+t*5,{});after(R,'pet.lie',r,'Dog lie');}};});}
function cCatWin(){return cell('Cat at the window','lies on the seat, looks out, tail swish',()=>{const S=shopRoom(-.36);const seat=.45;box(S,1.2,seat,.5,'#ff9ab8',-.2,seat/2,-.1);
  box(S,1.6,1.3,.06,'#cfeeff',.3,1.75,-.33);box(S,1.7,.08,.1,'#ffd45c',.3,1.1,-.31);
  const c=makePet('cat',PET_TYPES.cat.cols[0]);S.add(c.root);c.root.position.set(-.45,seat,.02);c.root.rotation.y=.12+P_/2;const Rc={root2:c.root,worst:0};
  const C=camR(-.15,.85,0,.85,.62,.16);return {S,C,tick:t=>{const r=MV2.play(c,'cat.window',4.99+t*5,{side:-1});after(Rc,'cat.window',r,'Cat window',seat);}};});}
function cBowl(){return story('Eats from its bowl','o.h = bowl rim .07 m',()=>makePet('dog',PET_TYPES.dog.cols[2]||PET_TYPES.dog.cols[0]),[['pet.eat',4,{h:.07}]],{zoom:.75,yaw:.8,cy:.35},(st,R,m)=>{const g=new THREE.Mesh(new THREE.CylinderGeometry(.11,.085,.07,20),new THREE.MeshLambertMaterial({color:'#9aa7c7'}));st.S.add(g);
  m.root.updateMatrixWorld(true);MV2.play(m,'pet.eat',3,{h:.07});const hb=new THREE.Box3().setFromObject(m.head);g.position.set((hb.min.x+hb.max.x)/2,.035,(hb.min.z+hb.max.z)/2);return null;});}
const JUMPS=[[1.2,.42],[2.6,.55]];
function cAgility(){return story('Dog agility (yard gear)','gallops, jumps two bars',()=>makePet('dog',PET_TYPES.dog.cols[0]),[['dog.agility',3.6,{walk:1.1,jumps:JUMPS}]],{zoom:1.1,yaw:.2,pitch:.15,cy:.6},(st)=>{
  const bars=JUMPS.map(([at,h])=>{const g=new THREE.Group();box(g,.03,.03,.8,'#ff6b6b',0,h,0);box(g,.04,h,.04,'#ffffff',0,h/2,.4);box(g,.04,h,.04,'#ffffff',0,h/2,-.4);st.S.add(g);return {g,at};});
  return {tick:(sec,dist)=>{bars.forEach(b=>{b.g.position.x=b.at-dist;});}};});}
function cBearTV(){return cell('Bear watches TV','sits on the sofa, laughs twice',()=>{const S=shopRoom();const G=gearP(S,'shop:bearlounge');const seat=Math.max(surfY(G,.45,.8),surfY(G,-.45,.8));
  const m=petPose(puPet('bear',null,'adult'),'sit');S.add(m.root);m.root.rotation.y=P_;m.root.position.set(0,seat,0);MV2.play(m,'bear.tv',0,{});m.root.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m.root);m.root.position.z+=1.34-bb.max.z;
  const C=camR(0,1.1,.2,1.7,2.15,.3);return {S,C,tick:t=>{MV2.play(m,'bear.tv',t*5,{});}};});}
CLIPS2.packTest2={title:'Moves pack round 2: real c13 models, moved only by COZY_MOVES',cols:4,cw:300,ch:240,frames:60,cells:[
  story('Sheep grazes','neck out, muzzle on the grass, looks round',()=>farmAnimal('sheep',col('sheep')),[['sheep.graze',6,{toff:6}]],{zoom:.62,yaw:.8,pitch:.2,cy:.4}),
  story('Cow grazes','neck +.45, level body, bites, step',()=>farmAnimal('cow',col('cow')),[['cow.graze',6,{toff:6}]],{zoom:.62,yaw:.8,pitch:.22,cy:.4}),
  cSnake(),cStairs(false),cStairs(true),cBearTV(),cSeal(),cMonkey(),cAgility(),cMilk(),cLicense(),cCapy(),cDuck(),cOwl(),cDogLie(),cCatWin(),cBowl()
]};
})();
