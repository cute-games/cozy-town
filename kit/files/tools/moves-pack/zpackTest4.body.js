/* ===== packTest4: the round-3 tricks and farm moves not in packTest3 (closing NOT VERIFIED), c14 models, only COZY_MOVES ===== */
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
function trickCell(kind,id,cam,extra){const lab=kind+' · '+((MV2.TRICKS[kind].find(x=>x[0]===id)||[0,id])[1])+(extra&&extra.gr===0?' (oopsie, gr 0)':'');return cell(lab,'trick.'+kind+'.'+id,()=>{const S=world();const m=PET[kind]();S.add(m.root);
  const G=MV2.trickGear(kind,id);const gw=G&&!G.ball?gearOf(S,G):null;const ball=G&&G.ball?gearOf(S,Object.assign({},G,{x:0,z:0})):null;const T=MV2.trickLength(kind,id);
  const C=cam?camR(...cam):G?camR(G.x,.7,G.z,4.8,-.45+G.rotY-P_,.25):autoCam(m);const ex=typeof extra==='function'?extra(S,m):null;
  const gr=extra&&extra.gr!=null?extra.gr:1;return {S,C,tick:t=>{const r=MV2.play(m,'trick',t*T,{kind,trick:id,gr});if(ball&&r.ball){ball.position.set(...r.ball);ball.rotation.set(...r.ballRot);}chk(lab,m.root,r);if(ex)ex(t,r);}};});}
function autoCam(m){m.root.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(m.root);const sz=b.getSize(V(0,0,0));const r=Math.max(sz.x,sz.y,sz.z);return camR(-r*.4,sz.y*.55,0,r*4.2+.6,.75,.2);}
function cBars(){return cell('monkey · Monkey bars','trick.monkey.bars (swings back)',()=>{const S=world();const m=PET.monkey();S.add(m.root);m.root.position.set(0,1.6,-.9);
  const g=new THREE.Group();PU['train:monkey'].build(g,PU['train:monkey'].dflt||{});g.rotation.y=P_/2;S.add(g);const T=MV2.trickLength('monkey','bars');const C=camR(0,1.15,-.15,3.6,-1.1,.05);
  return {S,C,tick:t=>{MV2.play(m,'trick',t*T,{kind:'monkey',trick:'bars'});}};});}
function farmCell(lab,make,name,T,cam){return cell(lab,name,()=>{const S=world();const m=make();S.add(m.root);const C=camR(...cam);return {S,C,tick:t=>{const r=MV2.play(m,name,t*T,{});chk(lab,m.root,r);}};});}
const pugM=()=>makePet('pug',PET_TYPES.pug.cols[0]);
CLIPS2.packTest4={title:'Moves pack round 3b: every remaining trick + farm moves (c14, only COZY_MOVES)',cols:6,cw:260,ch:220,frames:60,cells:[
  trickCell('dog','rollOver',[-.45,.3,0,3.2,.15,.3]),trickCell('cat','spin'),trickCell('cat','highFive',[0,.35,0,2.2,1.0,.05]),trickCell('bunny','bigJump',[0,.7,0,3.6,.62,.12]),trickCell('bunny','spin',[0,.55,0,3.2,.62,.12]),trickCell('hamster','spin',[-.1,.12,.15,1.5,.62,.4]),
  trickCell('hamster','rollOver',[0,.12,.45,1.8,1.4,.25]),trickCell('capybara','dance',[0,.45,0,3.4,.75,.16]),trickCell('capybara','rollOver',[-.6,.4,0,4.0,.2,.25]),trickCell('duck','dance',[0,.35,0,2.4,.5,.14]),trickCell('duck','spin',[0,.35,0,2.4,.5,.14]),trickCell('owl','headTurn',[0,.45,0,2.0,.4,.15]),
  trickCell('owl','spin',[0,.6,0,2.6,.4,.15]),trickCell('monkey','clap',[0,.42,.05,2.4,.45,.16]),cBars(),trickCell('seal','clap',[0,.7,0,4.0,.55,.15]),trickCell('seal','rollOver',[-.4,.45,0,4.6,.25,.22]),trickCell('bear','wave',[0,.95,0,4.6,.45,.12]),
  trickCell('bear','rollOver',[1.0,.6,0,6.4,.3,.25]),trickCell('snake','sway',[0,.25,.05,1.9,.4,.32]),trickCell('snake','coilSpin',[0,.25,.05,1.9,.4,.32]),
  cell('pug · High five','trick.pug.highFive',()=>{const S=world();const m=pugM();S.add(m.root);const C=camR(0,.32,0,2.0,1.0,.05);return {S,C,tick:t=>{const r=MV2.play(m,'trick',t*5,{kind:'pug',trick:'High five'});chk('pug',m.root,r);}};}),
  trickCell('dog','highFive',[0,.35,0,2.4,.6,.15],{gr:0}),
  cell('Pig eats from the pail','pig.bucketEat',()=>{const S=world();const m=farmAnimal('pig',FARM_COLS.pig[0]);S.add(m.root);MV2.play(m,'pig.bucketEat',1,{});m.root.updateMatrixWorld(true);const hb=new THREE.Box3().setFromObject(m.head);const pl=H.propB('farm:bucket');pl.root.position.set((hb.min.x+hb.max.x)/2,Math.max(0,hb.min.y-.2),hb.max.z+.05);pl.root.rotation.x=-1.1;S.add(pl.root);const C=camR(0,.35,.3,2.4,1.1,.2);return {S,C,tick:t=>{const r=MV2.play(m,'pig.bucketEat',t*3,{});chk('pig',m.root,r);}};}),
  farmCell('Sheep leans in',()=>farmAnimal('sheep',FARM_COLS.sheep[0]),'sheep.patLean',4,[0,.6,0,4.2,.9,.15]),
  farmCell('Hen puffs up',()=>farmAnimal('chicken',FARM_COLS.chicken[0]),'chicken.puff',1.5,[0,.35,0,2.2,.9,.15])
]};
})();
