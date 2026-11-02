/* ===== packTest5: every move left on the NOT VERIFIED list (round 1 never shown + round 2), c14 models, only COZY_MOVES ===== */
(()=>{const H=window.MVH,MV2=window.COZY_MOVES;const {cell,dbg}=H;const P_=Math.PI,TAU=2*P_;const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const v=new THREE.Vector3(),bb=new THREE.Box3();
function lowOf(obj){obj.updateMatrixWorld(true);bb.makeEmpty();obj.traverseVisible(o=>{if(!o.isMesh||!o.geometry||o.userData.noGround)return;const pa=o.geometry.attributes.position;for(let i=0;i<pa.count;i+=pa.count>400?2:1)bb.expandByPoint(v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld));});return bb;}
const W={};function chk(lab,root,r,fy){const low=lowOf(root).min.y-(fy||0);if(!(r&&r.lift)&&!(r&&r.noGround)&&Math.abs(low)>.006&&Math.abs(low)>Math.abs(W[lab]||0)){W[lab]=low;dbg('GROUND',lab,'low',low.toFixed(3));}}
function world(){const S=H.scene();const tex=H.grassTex('#8fbf6a','#7aad57');tex.repeat.set(60,60);const f=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshLambertMaterial({map:tex}));f.rotation.x=-P_/2;S.add(f);return S;}
function camR(x,y,z,d,yaw,pitch){const C=new THREE.PerspectiveCamera(32,1,.05,200);C.position.set(x+Math.sin(yaw)*Math.cos(pitch)*d,y+Math.sin(pitch)*d,z+Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(x,y,z);C.updateProjectionMatrix();return C;}
function grab(id,opt,fn){let got=null;const og=window[fn];window[fn]=function(...a){const r=og.apply(this,a);if(!got)got=r;return r;};try{PU[id].build(new THREE.Group(),Object.assign({},PU[id].dflt||{},opt||{}));}finally{window[fn]=og;}return got;}
const look=Object.assign({},DEFAULT_LOOK,{top:'#ff7aa8',bottom:'#3d3550',hat:'none'});
const M={dog:()=>makePet('dog',PET_TYPES.dog.cols[0]),cat:()=>makePet('cat',PET_TYPES.cat.cols[0]),bunny:()=>makePet('bunny',PET_TYPES.bunny.cols[1]),hamster:()=>makePet('hamster',PET_TYPES.hamster.cols[0]),
  capybara:()=>grab('age:capybara',{v:'real',age:'adult'},'capyReal2'),duck:()=>grab('age:duck',{age:'adult'},'makePet'),owl:()=>grab('age:owl',{age:'adult'},'makePet'),
  monkey:()=>puPet('monkey',null,'adult'),seal:()=>puPet('seal',null,'adult'),bear:()=>puPet('bear',null,'adult'),snake:()=>puPet('snake',null,'adult'),
  horse:()=>farmAnimal('horse',FARM_COLS.horse[0],'adult'),cow:()=>farmAnimal('cow',FARM_COLS.cow[0]),sheep:()=>farmAnimal('sheep',FARM_COLS.sheep[0]),lamb:()=>farmAnimal('sheep',FARM_COLS.sheep[0],'baby'),
  chicken:()=>farmAnimal('chicken',FARM_COLS.chicken[1]),pig:()=>farmAnimal('pig',FARM_COLS.pig[0]),person:()=>makePerson(look),vet:()=>makePerson(Object.assign({},look,{top:'#7cc8ff'})),
  stand:()=>stBernardStand(),sleep:()=>stBernardSleep()};
/* one cell: model, move, loop length T (s), opts; o.rate = metres per second walked (passes dist); o.y = root height (perch, air); o.yaw */
function mc(label,kind,name,T,o,cam){o=o||{};return cell(label,name,()=>{const S=world();const m=M[kind]();const rt=m.root||m;S.add(rt);rt.position.y=o.y||0;rt.rotation.y=o.yaw==null?0:o.yaw;
  rt.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(rt);const sz=b.getSize(V(0,0,0));const r=Math.max(sz.x,sz.y,sz.z);
  const c0=b.getCenter(V(0,0,0));const C=cam?camR(...cam):camR(c0.x,c0.y+(o.up||0),c0.z,r*2.3+.25+(o.far||0),.75,.18);if(o.extra)o.extra(S,m);
  return {S,C,tick:t=>{const sec=t*T;const op=Object.assign({},o.opts||{});if(o.rate)op.dist=o.rate*sec;const res=MV2.play(m,name,sec,op);if(op.slope){/* sloped floor through the root: check the distance to that plane */const tp=Math.tan(op.slope.pitch||0);rt.updateMatrixWorld(true);let mn=1e9;rt.traverseVisible(q=>{if(!q.isMesh||q.userData.noGround)return;const pa=q.geometry.attributes.position;for(let i=0;i<pa.count;i+=2){v.fromBufferAttribute(pa,i).applyMatrix4(q.matrixWorld);mn=Math.min(mn,v.y-v.z*tp);}});
      if(!res.lift&&Math.abs(mn)>.006&&Math.abs(mn)>Math.abs(W[label]||0)){W[label]=mn;dbg('GROUND',label,'slope low',mn.toFixed(3));}if(!S.userData.sl){S.userData.sl=1;const pl=new THREE.Mesh(new THREE.PlaneGeometry(3,3),new THREE.MeshLambertMaterial({color:'#9fd07a'}));pl.rotation.x=-P_/2+(op.slope.pitch||0);pl.position.y=.001;S.add(pl);}}
    else chk(label,rt,res,o.y||0);}};});}
const box=(S,w,h,d,c,x,y,z)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:c}));q.position.set(x,y,z);S.add(q);return q;};
CLIPS2.packTest5={title:'Moves pack: the rest (round 1 never shown + round 2 left), c14, only COZY_MOVES',cols:8,cw:220,ch:190,frames:60,cells:[
 /* round 1, pets */
 mc('Dog idle','dog','pet.idle',5),mc('Dog tired','dog','pet.unhappyNap',4),mc('Dog nudges','dog','pet.unhappyNudge',3),mc('Dog happy dance','dog','pet.happyDance',2),
 mc('Dog sad','dog','pet.sad',4),mc('Dog sneeze','dog','pet.sneeze',1.2),mc('Dog warn sneeze','dog','pet.warnSneeze',1.4),mc('Dog nap','dog','pet.nap',5),
 mc('Bear sits up','bear','bear.sitUp',3),mc('Seal ball stand','seal','seal.ball',4,{opts:{}}),mc('Seal clap','seal','seal.clap',1.2),mc('Monkey climbs','monkey','monkey.climb',3,{y:.3}),
 mc('Monkey happy','monkey','monkey.happy',2.4),mc('Snake slither','snake','snake.slither',3,{rate:.3},[0,.05,.1,1.6,.6,.5]),mc('Snake coil','snake','snake.coil',3,{},[0,.05,0,1.2,.6,.5]),mc('Snake looks up','snake','snake.lookUp',3,{},[0,.1,.1,1.4,.6,.35]),
 /* round 1, farm */
 mc('Cow looks at you','cow','farm.lookAtYou',2),mc('Lamb pronks','lamb','sheep.lambHop',2),mc('Hen runs','chicken','chicken.run',1.5),mc('Pig roots','pig','pig.root',3),
 mc('Horse walk','horse','horse.walk',3),mc('Horse trot','horse','horse.trot',2),mc('Horse jump','horse','horse.jump',1.6,{up:.5,far:2}),mc('Horse idle','horse','horse.idle',5),
 mc('Horse refuses','horse','horse.refuse',2),mc('Farm dog asleep','sleep','farmdog.sleep',3),mc('Farm dog lies','stand','farmdog.lie',3),mc('Person walk','person','person.walk',2,{rate:1}),
 mc('Person idle','person','person.idle',4.5),mc('Person crouch','person','person.crouch',2),mc('Vet listens','vet','vet.listen',3),mc('Vet checks','vet','vet.check',3),
 mc('Nurse treat','vet','nurse.treat',3),
 /* round 2 */
 mc('Cat wand','cat','cat.wand',4),mc('Hamster wheel','hamster','hamster.wheel',1),mc('Bear log push','bear','bear.logPush',3,{rate:.4}),mc('Capy hops in','capybara','capy.hopIn',1.2,{up:.35,far:1}),
 mc('Duck splash','duck','duck.splash',1,{up:.2,far:.8}),mc('Owl flies','owl','owl.fly',2,{y:1}),mc('Dog waits','dog','pet.wait',6),mc('Seal waits','seal','pet.wait',6),mc('Dog waits lying','dog','pet.waitLie',4,{opts:{perk:0}}),
 mc('Dog greets','dog','pet.greet',1.6),mc('Seal greets','seal','pet.greet',1.6),mc('Bear climbs on','bear','pet.climbOn',1.4),mc('Bear nervous','bear','pet.vetNervous',3),
 mc('Dog takes the treat','dog','pet.takeTreat',2.4),mc('Bear naps in its den','bear','bear.denNap',3),mc('Seal naps','seal','seal.nap',3),mc('Dog takes food','dog','pet.takeFood',2),
 mc('Offers food','person','person.offerFood',2),mc('Reaches','person','person.reach',2,{opts:{target:[-.1,.6,.5]}}),mc('Horse over the gate','horse','horse.overGate',5),
 mc('Bunny hill hop','bunny','bunny.hillHop',3,{rate:.6,opts:{slope:{pitch:.25}}}),mc('Hamster runs','hamster','hamster.run',2,{rate:.3}),mc('Bunny hurdles (yard)','bunny','bunny.hurdles',3,{rate:1,opts:{jumps:[[1,.5],[2.2,.55]]}})
]};
})();
