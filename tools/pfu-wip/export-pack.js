/* Pets and Farm Update, stage 4b: turn the book's picked pack models into data the game draws with its own shapes (run doc guard 3: only the models
   the update uses, never a second copy of a game builder). Usage (repo root):
     node tools/pfu-wip/export-pack.js <three-r128.min.js> > /tmp/packm.js
   Loads kit/files/tools/living-pack/model-pack.js and kit/files/tools/model-pack/model-pack.js (each in its own sandbox), builds each kept version
   (KEEP below), and writes the scene graph: groups, meshes (geometry kind + its numbers, colour or a named material), signs, and for pets the moving
   parts (b, legs, head, tail, segs, wings, tongue, rear ...). The game rebuilds them with packBuild() (js/01-models.js). */
const fs=require('fs'),vm=require('vm'),path=require('path');
const THREE_SRC=fs.readFileSync(process.argv[2],'utf8');
function sandbox(pack){
  const ctx={console,Math,Date,JSON,Object,Array,Map,Set,WeakMap,Float32Array,Uint8Array,Uint16Array,Uint32Array,Int32Array,Int8Array,Int16Array,Uint8ClampedArray,Float64Array,ArrayBuffer,DataView,Promise,setTimeout,clearTimeout,parseInt,parseFloat,isNaN,isFinite,Number,String,Boolean,Symbol,Error,TypeError,RangeError,Proxy,Reflect,RegExp,Infinity,NaN,undefined};
  const cv=()=>({width:1,height:1,getContext:()=>new Proxy({},{get:(t,k)=>k==='measureText'?()=>({width:10}):k==='getImageData'?()=>({data:new Uint8ClampedArray(4)}):(k==='createLinearGradient'||k==='createRadialGradient'||k==='createPattern')?()=>({addColorStop(){}}):()=>{},set:()=>true}),toDataURL:()=>''});
  ctx.document={createElement:()=>cv(),fonts:null,getElementById:()=>null,querySelector:()=>null,body:{}};
  ctx.window=ctx;ctx.globalThis=ctx;ctx.self=ctx;ctx.navigator={userAgent:'node'};ctx.performance={now:()=>0};ctx.requestAnimationFrame=()=>0;ctx.addEventListener=()=>{};ctx.location={search:'',hash:''};
  vm.createContext(ctx);vm.runInContext(THREE_SRC,ctx);vm.runInContext(fs.readFileSync(pack,'utf8'),ctx,{filename:path.basename(pack)});
  vm.runInContext(`initMaterials(true);Math.random=seeded(77);
    {const f=tubeGeo;tubeGeo=function(pts,r0,r1,seg,rad,grow){const o=f(pts,r0,r1,seg,rad,grow);const R=[];for(let i=0;i<=seg;i++){const t=i/seg;R.push(typeof r0==='function'?r0(t):r0+(r1-r0)*t);}o.g.userData.X=['U',pts,R,seg,rad,grow];return o;};}
    {const f=rboxGeo;rboxGeo=function(w,h,d,r,grow){const g=f(w,h,d,r,grow);g.userData.X=['X',w,h,d,r,grow];return g;};}
    {const f=prismGeo;prismGeo=function(...a){const g=f(...a);g.userData.X=['Q',...a];return g;};}
    {const f=starGeo;starGeo=function(...a){const g=f(...a);g.userData.X=['Z',...a];return g;};}
    {const f=signPlane;signPlane=function(...a){const m=f(...a);m.userData.SIGN=a;return m;};}
    globalThis.__NM={OL,OLP,WATER,WIN,LAMP,GLOW,PANE,CLOUD,OLC,SWIN,TOONVC};globalThis.__CAP=[];if(typeof puAge==='function'){const f=puAge;puAge=function(m,a){__CAP.push(m);return f(m,a);};}`,ctx);
  return ctx;}
const LIV=sandbox('kit/files/tools/living-pack/model-pack.js'),NON=sandbox('kit/files/tools/model-pack/model-pack.js');
const r4=x=>Math.round(x*1e4)/1e4;
const GEO=[],GK=new Map(),MAT=[],MK=new Map(),UNK=[];
function gid(a){const k=JSON.stringify(a);if(!GK.has(k)){GK.set(k,GEO.length);GEO.push(a);}return GK.get(k);}
function mid(a){const k=JSON.stringify(a);if(!MK.has(k)){MK.set(k,MAT.length);MAT.push(a);}return MK.get(k);}
const U_=undefined,trim=(a,d)=>{a=a.slice();while(a.length>1&&a[a.length-1]===d[a.length-1])a.pop();return a;};   /* d: the defaults, lined up with a */
function geo(g){const p=g.parameters||{},X=g.userData.X;
  if(X){const a=X.slice();if(a[0]==='U')return gid(['U',a[1].map(q=>q.map(r4)),a[2].map(r4),a[3],a[4],r4(a[5])]);return gid(a.map(v=>typeof v==='number'?r4(v):v));}
  const n=v=>typeof v==='number'?r4(v):v;
  switch(g.type){
    case 'BoxGeometry':return gid(trim(['B',p.width,p.height,p.depth,p.widthSegments,p.heightSegments,p.depthSegments].map(n),[U_,U_,U_,U_,1,1,1]));
    case 'SphereGeometry':return gid(trim(['S',p.radius,p.widthSegments,p.heightSegments,p.phiStart,p.phiLength,p.thetaStart,p.thetaLength].map(n),[U_,U_,32,16,0,r4(Math.PI*2),0,r4(Math.PI)]));
    case 'CylinderGeometry':return gid(trim(['C',p.radiusTop,p.radiusBottom,p.height,p.radialSegments,p.heightSegments,p.openEnded?1:0,p.thetaStart,p.thetaLength].map(n),[U_,U_,U_,U_,8,1,0,0,r4(Math.PI*2)]));
    case 'ConeGeometry':return gid(trim(['K',p.radius,p.height,p.radialSegments,p.heightSegments,p.openEnded?1:0,p.thetaStart,p.thetaLength].map(n),[U_,U_,U_,8,1,0,0,r4(Math.PI*2)]));
    case 'TorusGeometry':return gid(trim(['T',p.radius,p.tube,p.radialSegments,p.tubularSegments,p.arc].map(n),[U_,U_,U_,8,6,r4(Math.PI*2)]));
    case 'CircleGeometry':return gid(trim(['O',p.radius,p.segments,p.thetaStart,p.thetaLength].map(n),[U_,U_,8,0,r4(Math.PI*2)]));
    case 'PlaneGeometry':return gid(trim(['P',p.width,p.height,p.widthSegments,p.heightSegments].map(n),[U_,U_,U_,1,1]));
    case 'RingGeometry':return gid(trim(['R',p.innerRadius,p.outerRadius,p.thetaSegments,p.phiSegments,p.thetaStart,p.thetaLength].map(n),[U_,U_,U_,8,1,0,r4(Math.PI*2)]));
    case 'BufferGeometry':
    case 'ShapeGeometry':{const q=g.index?g.toNonIndexed():g;return gid(['V',Array.from(q.attributes.position.array).map(r4)]);}   /* (stage 6: the lesson flags' pennant: its triangles as they are) */
    case 'LatheGeometry':return gid(['L',p.points.map(v=>[r4(v.x),r4(v.y)]),p.segments,r4(p.phiStart),r4(p.phiLength)]);
  }
  UNK.push(g.type);return gid(['?',g.type]);}
function mat(C,m){if(Array.isArray(m)){UNK.push('array material');return mid(0);}
  for(const [k,v] of Object.entries(C.__NM))if(v&&m===v)return mid('@'+k);
  const hex=m.color?'#'+m.color.getHexString():null;
  if(m.userData.plain)return mid(hex);
  const o={t:m.type==='MeshToonMaterial'?'t':m.type==='MeshBasicMaterial'?'b':m.type==='MeshLambertMaterial'?'l':m.type==='MeshStandardMaterial'?'s':m.type};
  if(hex&&hex!=='ffffff')o.c=hex;if(m.emissive&&m.emissiveIntensity&&m.emissive.getHex())o.e='#'+m.emissive.getHexString(),o.ei=r4(m.emissiveIntensity);
  if(m.transparent)o.tr=1;if(m.opacity!==1)o.op=r4(m.opacity);if(m.side)o.sd=m.side;if(m.depthWrite===false)o.dw=0;if(m.vertexColors)o.vc=1;if(m.polygonOffset)o.po=[m.polygonOffsetFactor,m.polygonOffsetUnits];
  if(m.fog===false)o.fg=0;if(m.map)o.map=1,UNK.push('map material '+JSON.stringify(o));if(o.t==='t'&&!m.gradientMap)o.ng=1;
  return mid(o);}
function T(o){const p=o.position,r=o.rotation,s=o.scale;const t=[r4(p.x),r4(p.y),r4(p.z)];const rot=[r4(r.x),r4(r.y),r4(r.z)],sc=[r4(s.x),r4(s.y),r4(s.z)];
  if(r.order!=='XYZ')UNK.push('rotation order '+r.order);
  if(sc.some(v=>v!==1))return t.concat(rot,sc);if(rot.some(v=>v!==0))return t.concat(rot);if(t.some(v=>v!==0))return t;return 0;}
function ser(C,root){const idx=new Map();let n=0;
  const walk=o=>{idx.set(o,n++);let ex=null;const X=()=>ex||(ex={});if(!o.visible)X().v=0;if(o.renderOrder)X().ro=o.renderOrder;if(o.frustumCulled===false)X().nf=1;
    for(const k of['keep','noGround','screen'])if(o.userData[k])X()[k]=o.userData[k];
    if(o.isMesh&&o.userData.SIGN){const a=o.userData.SIGN.map(v=>typeof v==='number'?r4(v):v);return ex?[2,T(o),a,ex]:[2,T(o),a];}
    if(o.isMesh){const nd=[0,geo(o.geometry),mat(C,o.material),T(o)];if(o.children.length)nd.push(o.children.map(walk));else if(ex)nd.push(0);if(ex)nd.push(ex);return nd;}
    if(o.type!=='Group'&&o.type!=='Object3D')UNK.push('node '+o.type);
    const nd=[1,T(o),o.children.map(walk)];if(ex)nd.push(ex);return nd;};
  const tree=walk(root);return {tree,idx};}
function refs(m,idx){const r={},d={};for(const [k,v] of Object.entries(m)){if(k==='root')continue;
    if(v&&v.isObject3D){if(idx.has(v))r[k]=idx.get(v);}
    else if(Array.isArray(v)&&v.length&&v.every(q=>q&&q.isObject3D)){const a=v.map(q=>idx.has(q)?idx.get(q):-1);if(a.every(q=>q>=0))r[k]=a;}
    else if(k==='type'||k==='top'||(typeof v==='number'&&k!=='phase')||(v&&typeof v==='object'&&!v.isObject3D&&!Array.isArray(v)&&JSON.stringify(v).length<200))d[k]=v;}
  return {r,d};}
function pet(id,opts){const C=LIV;C.__CAP.length=0;const item={id,opts};const g=C.buildPackItem(item,Object.assign({age:'adult'},opts));
  const m=C.__CAP.find(q=>{for(let p=q.root;p;p=p.parent)if(p===g)return true;return false;});if(!m)throw new Error('no model for '+id+JSON.stringify(opts));
  m.root.parent.remove(m.root);m.root.position.set(0,0,0);const s=ser(C,m.root),q=refs(m,s.idx);return {n:s.tree,r:q.r,d:q.d};}
function thing(id,opts,src){const C=NON;const u0=UNK.length;try{return thing0(id,opts,src);}finally{if(UNK.length>u0)console.error("UNK in",id,JSON.stringify(opts),UNK.slice(u0));}}
function thing0(id,opts,src){const C=NON;const L=JSON.parse(fs.readFileSync('kit/files/tools/model-pack/pack-list.json')).items;
  const it=L.find(i=>i.id===id&&(!src||i.source===src))||{id,opts};const g=C.buildPackItem(Object.assign({},it,{opts:opts||it.opts}));return {n:ser(C,g).tree};}
const LP=JSON.parse(fs.readFileSync('kit/files/tools/living-pack/pack-list.json')).items;
const OUT={};
/* the kept versions (KIT.md "Kept versions"; living pack v7 picks) */
for(const it of LP.filter(i=>i.id==='pet:monkey'))OUT['monkey.'+it.opts.v]=pet('pet:monkey',it.opts);
for(const it of LP.filter(i=>i.id==='pet:bear'))OUT['bear.'+it.opts.v]=pet('pet:bear',it.opts);
for(const [k,id,o] of [['seal','pet:seal',{look:'spotted'}],['snake','pet:snake',{}],['pug','age:pug',{v:'new'}],['capybara','age:capybara',{v:'real'}]]){
  const it=LP.find(i=>i.id===id&&JSON.stringify(i.opts)===JSON.stringify(o));it.colours.forEach((c,i)=>{OUT[k+'.'+i]=pet(id,Object.assign({},o,{c}));});}
for(const [k,id,o,src] of [['home.tree','home:tree',{look:'jungle'}],['home.pond','home:pond'],['home.den','home:den'],['gear.monkey','train:monkey',null,'claude'],['gear.monkey2','monkeybars',null,'chatgpt'],
  ['gear.seal','train:seal'],['gear.bear','train:bear'],['gear.snake','train:snake'],['shop.room','shop:room',{floor:'3',pets:'no'}],
  ['show.stage','show:stage',{with:'stage'}],['show.podium','show:podium'],['show.judges','show:judges'],['show.license','show:license',{lv:'1'}]])OUT[k]=thing(id,o,src);   /* (stage 5: the Pet Show area's stage, podium, judges' table and the hand-held license card) */
/* stage 6: the farm (kit/kits/pfu-placements.json): buildings, machines, props, the jump field's jumps and flags, nature, and the farm's living things
   (farm animals baby/adult only; coaches Ieva/Stan; riders Cody/Hank/Rose without their horse: the game puts them on one of its own horses) */
for(const [k,c] of [['x',0],['v',1],['o',2],['s',3],['x',2],['o',3],['s',0]]){const C=['#5f7fd8','#ff6b6b','#ffd45c','#5fd4b0'][c];OUT['course.'+k+'.'+c]=thing('course:'+k,{c:C},'claude');}   /* (the jump field's 12 jumps: kind x colour as placed, o111-o122) */
function liv(js){const u0=UNK.length;try{return liv0(js);}finally{if(UNK.length>u0)console.error("UNK in",js.slice(0,80),UNK.slice(u0));}}
function liv0(js){const C=LIV;const m=vm.runInContext(js,C);if(m.root.parent)m.root.parent.remove(m.root);m.root.position.set(0,0,0);if(/riderOn/.test(js)){m.root.rotation.set(0,0,0);m.root.scale.set(1,1,1);}   /* (the farm animals keep their own size: adult horse 1.18, cow 1.25) */
  const s=ser(C,m.root),q=refs(m,s.idx);return {n:s.tree,r:q.r,d:q.d};}
for(const [k,id,o] of [['farm.barn','farm:barn'],['farm.stable','farm:stable'],['farm.windmill','farm:windmill'],['farm.tractor','farm:tractor'],['farm.combine','farm:combine'],['farm.coop','farm:coop'],
  ['farm.fence','farm:fence'],['farm.trough','farm:trough'],['farm.hay','farm:hay'],['farm.milk','farm:milk'],['farm.eggs','farm:eggs'],['farm.bucket','farm:bucket'],['farm.brush','farm:brush'],['farm.arch','farm:arch'],
  ['flag.blue','course:flag',{c:'blue'}],['flag.red','course:flag',{c:'red'}],
  ['nat.oak','nature:oak'],['nat.fir','nature:fir',{snow:'0'}],['nat.firs','nature:fir',{snow:'1'}],['nat.birch','nature:birch']])OUT[k]=thing(id,o,'claude');
for(const [t,ages] of [['horse',['adult','baby']],['cow',['adult','baby']],['sheep',['adult','baby']],['pig',['adult']],['chicken',['adult']]]){const L=vm.runInContext('FARM_COLS',LIV)[t];
  for(const a of ages)L.forEach((c,i)=>{if(a==='baby'&&i)return;OUT['fa.'+t+'.'+a+'.'+i]=liv(`farmAnimal(${JSON.stringify(t)},${JSON.stringify(c)},${JSON.stringify(a)})`);});}
OUT['fa.lab']=liv(`(()=>{const g=new THREE.Group();PU['farm:lab'].build(g,{v:'curl'});const r=g.children[0];return {root:r};})()`);
for(const v of['ieva','stan'])OUT['coach.'+v]=liv(`(()=>{const C=COACHES.find(x=>x[0]==='${v}');return dressRider(makePerson(Object.assign({nohat:true},C[2].look)),C[2]);})()`);
for(const [L,v] of [['COWBOYS','cody'],['COWBOYS','hank'],['COWGIRLS','rose']])OUT['rider.'+v]=liv(`(()=>{const D=${L}.find(x=>x[0]==='${v}')[2];const m=farmAnimal('horse',D.horse,'adult');const p=riderOn(m,Object.assign({eyes:null},D.look));dressRider(p,Object.assign({},D,{boots:null}));p.horseCol=D.horse;return p;})()`);
const cols={};const FUR={monkey:vm.runInContext('MONKEYS.map(m=>[m[0],m[2].fur])',LIV),bear:vm.runInContext('BEARS.map(m=>[m[0],m[2].c])',LIV)};
for(const k of['monkey','bear'])cols[k]=LP.filter(i=>i.id==='pet:'+k).map(i=>[i.opts.v,i.name.split(' · ')[1],FUR[k].find(f=>f[0]===i.opts.v)[1]]);
for(const [k,id] of [['seal','pet:seal'],['snake','pet:snake'],['pug','age:pug'],['capybara','age:capybara']])cols[k]=LP.find(i=>i.id===id&&i.status==='picked').colours;
process.stdout.write('/* 🐾 the book\'s picked pack models as data (pets and farm update, stage 4b; made by tools/pfu-wip/export-pack.js from kit/files/tools: living pack v7, model pack v164).\n   PACKM.g = shapes, PACKM.m = materials, PACKM.o = models; packBuild(key) draws one with the game\'s own shapes */\n');
process.stdout.write('const PACKM={cols:'+JSON.stringify(cols)+',g:'+JSON.stringify(GEO)+',\nm:'+JSON.stringify(MAT)+',\no:{\n'+Object.entries(OUT).map(([k,v])=>JSON.stringify(k)+':'+JSON.stringify(v)).join(',\n')+'}};\n');
if(UNK.length)console.error('UNKNOWN',[...new Set(UNK)].slice(0,40));
console.error(Object.entries(OUT).map(([k,v])=>k+' '+JSON.stringify(v).length).join(', '));
