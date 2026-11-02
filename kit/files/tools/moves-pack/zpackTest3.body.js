/* ===== packTest3: round-3 moves (Pet Show tricks, toy play, farm feeding) on the c14 models, moved ONLY through window.COZY_MOVES ===== */
(()=>{const H=window.MVH,MV2=window.COZY_MOVES;const {cell,dbg,seg,bell,ease,cl}=H;const P_=Math.PI,TAU=2*P_;const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const v=new THREE.Vector3(),bb=new THREE.Box3();
function lowOf(obj){obj.updateMatrixWorld(true);bb.makeEmpty();obj.traverseVisible(o=>{if(!o.isMesh||!o.geometry||o.userData.noGround)return;const pa=o.geometry.attributes.position;for(let i=0;i<pa.count;i+=pa.count>400?2:1)bb.expandByPoint(v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld));});return bb;}
const W={};function chk(lab,root,r,fy){const low=lowOf(root).min.y-(fy||0);if(!(r&&r.lift)&&!(r&&r.noGround)&&Math.abs(low)>.006&&Math.abs(low)>Math.abs(W[lab]||0)){W[lab]=low;dbg('GROUND',lab,'low',low.toFixed(3));}}
function world(g){const S=H.scene();const tex=H.grassTex(g||'#8fbf6a','#7aad57');tex.repeat.set(60,60);const f=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshLambertMaterial({map:tex}));f.rotation.x=-P_/2;S.add(f);return S;}
function camR(x,y,z,d,yaw,pitch){const C=new THREE.PerspectiveCamera(32,1,.05,200);C.position.set(x+Math.sin(yaw)*Math.cos(pitch)*d,y+Math.sin(pitch)*d,z+Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(x,y,z);C.updateProjectionMatrix();return C;}
function grab(id,opt,fn){let got=null;const og=window[fn];window[fn]=function(...a){const r=og.apply(this,a);if(!got)got=r;return r;};try{PU[id].build(new THREE.Group(),Object.assign({},PU[id].dflt||{},opt||{}));}finally{window[fn]=og;}return got;}
function gearOf(S,G){if(!G||!G.id)return null;const W2=new THREE.Group(),g=new THREE.Group();PU[G.id].build(g,Object.assign({},PU[G.id].dflt||{}));W2.add(g);W2.scale.setScalar(G.scale||1);W2.rotation.y=G.rotY||0;W2.position.set(G.x||0,0,G.z||0);S.add(W2);return W2;}
function toy(id,sc){const T=H.propB(id);const g=new THREE.Group();T.root.position.y=-T.H/2;g.add(T.root);g.scale.setScalar(sc);return g;}
const PET={dog:()=>makePet('dog',PET_TYPES.dog.cols[0]),cat:()=>makePet('cat',PET_TYPES.cat.cols[0]),bunny:()=>makePet('bunny',PET_TYPES.bunny.cols[1]),hamster:()=>makePet('hamster',PET_TYPES.hamster.cols[0]),
  capybara:()=>grab('age:capybara',{v:'real',age:'adult'},'capyReal2'),duck:()=>grab('age:duck',{age:'adult'},'makePet'),owl:()=>grab('age:owl',{age:'adult'},'makePet'),
  monkey:()=>puPet('monkey',null,'adult'),seal:()=>puPet('seal',null,'adult'),bear:()=>puPet('bear',null,'adult'),snake:()=>puPet('snake',null,'adult')};
/* a trick cell: the pet at the root (origin), gear from COZY_MOVES.trickGear, the camera aimed in the pet frame */
function trickCell(kind,id,cam,extra){const lab=kind+' · '+((MV2.TRICKS[kind].find(x=>x[0]===id)||[0,id])[1]);return cell(lab,'trick.'+kind+'.'+id,()=>{const S=world();const m=PET[kind]();S.add(m.root);
  const G=MV2.trickGear(kind,id);const gw=G&&!G.ball?gearOf(S,G):null;const ball=G&&G.ball?gearOf(S,Object.assign({},G,{x:0,z:0})):null;const T=MV2.trickLength(kind,id);
  const C=cam?camR(...cam):camR(G.x,.7,G.z,4.8,-.45+G.rotY-P_,.25);const ex=extra?extra(S,m):null;
  return {S,C,tick:t=>{const r=MV2.play(m,'trick',t*T,{kind,trick:id});if(ball&&r.ball){ball.position.set(...r.ball);ball.rotation.set(...r.ballRot);}chk(lab,m.root,r);if(ex)ex(t,r);}};});}
/* toy cells */
function cFrisbee(){return cell('Monkey · frisbee','monkey.frisbee (r.frisbee)',()=>{const S=world();const m=PET.monkey();S.add(m.root);const fr=toy('toy:frisbee',1);S.add(fr);const C=camR(.05,.5,0,3.7,.62,.28);
  return {S,C,tick:t=>{const r=MV2.play(m,'monkey.frisbee',t*5,{});fr.position.set(...r.frisbee.p);fr.quaternion.set(...r.frisbee.q);chk('frisbee',m.root,r);}};});}
function cToyBall(){return cell('Seal · ball','seal.toyBall (r.ball)',()=>{const S=world();const m=PET.seal();S.add(m.root);m.root.rotation.y=.5;const g=new THREE.Group();g.rotation.y=.5;S.add(g);const b=toy('toy:ball',2.2);g.add(b);const C=camR(.05,1.1,.1,3.9,0,.62);
  return {S,C,tick:t=>{const r=MV2.play(m,'seal.toyBall',t*5,{});b.position.set(...r.ball);b.rotation.set(...r.ballRot);chk('toyBall',m.root,r);}};});}
function cSqueaky(){return cell('Bear · squeaky toy','bear.squeaky (r.toy)',()=>{const S=world();const m=PET.bear();S.add(m.root);m.root.rotation.y=.55;const g=new THREE.Group();g.rotation.y=.55;S.add(g);const b=toy('toy:bone',2.1);g.add(b);const C=camR(-.15,.75,-.1,5.4,.05,.3);
  return {S,C,tick:t=>{const r=MV2.play(m,'bear.squeaky',t*5,{});b.position.set(...r.toy.p);b.quaternion.set(...r.toy.q);b.scale.set(2.1*r.toy.scale[0],2.1*r.toy.scale[1],2.1*r.toy.scale[2]);chk('squeaky',m.root,{});}};});}
function cMouse(){return cell('Snake · toy mouse','snake.mouse (tongue flicks)',()=>{const S=world();const m=PET.snake();S.add(m.root);const mz=new THREE.Group();mz.rotation.y=-.5;S.add(mz);const rock=new THREE.Group();rock.position.set(0,0,.068);mz.add(rock);const mo=toy('toy:mouse',1);mo.position.set(0,.0665,-.068);rock.add(mo);
  const C=camR(-.05,.1,-.3,2.9*.7,.2,.55);return {S,C,tick:t=>{const r=MV2.play(m,'snake.mouse',t*5,{});rock.rotation.x=r.mouseRock;}};});}
/* farm cells */
const look=Object.assign({},DEFAULT_LOOK,{top:'#ff7aa8',bottom:'#3d3550',hat:'none'});
function headBox(m){m.root.updateMatrixWorld(true);return new THREE.Box3().setFromObject(m.head);}
function cTrough(){return cell('Trough','person.pourBucket; cow + sheep farm.troughEat',()=>{const S=world();const tr=H.propB('farm:trough');tr.root.rotation.y=P_/2;S.add(tr.root);tr.root.updateMatrixWorld(true);
  const rc=new THREE.Raycaster(V(0,5,0),V(0,-1,0));const hits=rc.intersectObject(tr.root,true).filter(h=>h.object.material&&h.object.material.side!==THREE.BackSide);const top=hits.length?hits[0].point.y:.5;const h=top+.03;dbg('trough feed h',h.toFixed(3));
  const feed=new THREE.Mesh(new THREE.BoxGeometry(1.5,.03,.3),new THREE.MeshLambertMaterial({color:'#d9a557'}));feed.position.set(0,top+.015,0);S.add(feed);
  const cow=farmAnimal('cow',FARM_COLS.cow[0]),shp=farmAnimal('sheep',FARM_COLS.sheep[0]);[cow,shp].forEach(a=>S.add(a.root));
  const put=(a,x,side)=>{a.root.rotation.y=side>0?P_:0;a.root.position.set(x,0,0);MV2.play(a,'farm.troughEat',1.5,{h});const hb=headBox(a);a.root.position.z=-(side>0?hb.min.z:hb.max.z)+side*.0+(side>0?-.1:.1);};
  put(cow,-.45,1);put(shp,.42,-1);
  const P=makePerson(look);S.add(P.root);P.root.position.set(1.3,0,0);P.root.rotation.y=-P_/2;const bk=H.propB('farm:bucket');S.add(bk.root);
  const C=camR(0,.4,0,6.5,.75,.95);
  return {S,C,tick:t=>{const r1=MV2.play(cow,'farm.troughEat',t*6,{h}),r2=MV2.play(shp,'farm.troughEat',t*6,{h});chk('trough cow',cow.root,r1);chk('trough sheep',shp.root,r2);
    const r=MV2.play(P,'person.pourBucket',(t*6)%2.4,{});const hw=P.root.localToWorld(V(...r.hand));bk.root.position.set(hw.x,hw.y-bk.H,hw.z);bk.root.rotation.set(0,P.root.rotation.y,r.tip*-1,'YXZ');bk.root.rotation.x=r.tip;chk('pour person',P.root,r);}};});}
function cGrain(){return cell('Grain','person.scatterGrain; hens chicken.grainPeck',()=>{const S=world();const P=makePerson(look);S.add(P.root);const bk=H.propB('farm:bucket');S.add(bk.root);
  const hens=[0,1,2].map(i=>{const c=farmAnimal('chicken',FARM_COLS.chicken[i]);S.add(c.root);const a=-.6+.6*i;c.root.position.set(Math.sin(a)*1.0,0,Math.cos(a)*1.0+.2);c.root.rotation.y=a+P_;return c;});
  for(let i=0;i<20;i++){const g=new THREE.Mesh(new THREE.SphereGeometry(.018,6,4),new THREE.MeshLambertMaterial({color:['#e8c060','#d9a557','#c8964a','#f0d080'][i%4]}));const c=hens[i%3];const p=c.root.position;const a=c.root.rotation.y;g.position.set(p.x+Math.sin(a)*.32+.05*Math.sin(i*2.3),.012,p.z+Math.cos(a)*.32+.05*Math.cos(i*1.7));S.add(g);}
  const C=camR(.1,.45,.5,4.4,.6,.38);
  return {S,C,tick:t=>{const r=MV2.play(P,'person.scatterGrain',t*6,{});const hw=P.root.localToWorld(V(...r.hand));bk.root.position.set(hw.x,hw.y-bk.H,hw.z);chk('grain person',P.root,r);
    hens.forEach((c,i)=>{const rr=MV2.play(c,'chicken.grainPeck',t*6+i*.11,{});chk('hen'+i,c.root,rr);});}};});}
function cHand(){return cell('Hand feed','person.handFeed; horse.handEat',()=>{const S=world();const P=makePerson(look);S.add(P.root);const hr=farmAnimal('horse',FARM_COLS.horse[0],'adult');S.add(hr.root);hr.root.rotation.y=P_;
  hr.root.position.set(.3,0,2.0);const L=MV2.play(hr,'horse.handEat',3,{});const lips=V(...L.lips).applyQuaternion(hr.root.quaternion).add(hr.root.position);const T=[lips.x,lips.y-.1,lips.z-.04];const hh=1.35;
  const r0=MV2.play(P,'person.handFeed',3,{target:T});const hand=V(...r0.hand);const d=lips.clone().sub(hand);dbg('hand feed hand',hand.toArray().map(x=>x.toFixed(2)).join(','),'lips',lips.toArray().map(x=>x.toFixed(2)).join(','));
  /* move the horse so its lips are just above the hand */hr.root.position.x-=d.x;hr.root.position.z-=d.z-.03;T[0]-=d.x;T[2]-=d.z-.03;
  const C=camR(.1,.95,.8,5.2,2.0,.2);
  return {S,C,tick:t=>{const r=MV2.play(P,'person.handFeed',t*6,{target:T});chk('feed person',P.root,r);const r2=MV2.play(hr,'horse.handEat',t*6,{h:hh});chk('horse',hr.root,r2);}};});}
function cPat(){return cell('Pat','person.pat; cow.patLean',()=>{const S=world();const P=makePerson(look);S.add(P.root);const cow=farmAnimal('cow',FARM_COLS.cow[1]||FARM_COLS.cow[0]);S.add(cow.root);cow.root.rotation.y=P_;
  MV2.play(cow,'cow.patLean',1.5,{});let hb=headBox(cow);cow.root.position.set(-(hb.min.x+hb.max.x)/2+.15,0,.5-hb.min.z);hb=headBox(cow);const T=[(hb.min.x+hb.max.x)/2,hb.max.y,(hb.min.z+hb.max.z)/2];dbg('pat target',T.map(x=>x.toFixed(2)).join(','));
  const C=camR(.1,.8,.4,4.6,1.1,.22);
  return {S,C,tick:t=>{const r2=MV2.play(cow,'cow.patLean',t*4,{});chk('pat cow',cow.root,r2);const r=MV2.play(P,'person.pat',t*4,{target:T});chk('pat person',P.root,r);}};});}

CLIPS2.packTest3={title:'Moves pack round 3: tricks, toys, farm feeding (c14 models, only COZY_MOVES)',cols:4,cw:300,ch:240,frames:60,cells:[
  trickCell('dog','agility',[1.4,.35,0,6.2,1.25,.35]),trickCell('cat','tower',[-.2,1.15,1.4,7.4,1.6,.22]),trickCell('bunny','hurdles',[0,.55,1.9,6.6,1.45,.2]),trickCell('hamster','maze',null),
  trickCell('capybara','bathSpin',[0,.6,0,3.6,.55,.42]),trickCell('duck','bigJump',[0,.6,0,3.0,.45,.12]),trickCell('owl','perchHop',[0,2.8,0,3.0,.4,.12]),trickCell('monkey','flip',[0,.75,0,4.2,.7,.15]),
  trickCell('seal','ballNose',[.05,.95,.2,5.6,.6,.13]),trickCell('bear','logWalk',[0,1.1,0,5.0,1.45,.2]),trickCell('snake','basket',[.05,.72,.1,3.4,.45,.18]),trickCell('dog','highFive',[0,.35,0,2.3,1.1,.05]),
  cFrisbee(),cToyBall(),cSqueaky(),cMouse(),cTrough(),cGrain(),cHand(),cPat()]};
})();
