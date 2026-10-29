'use strict';
/* ================= world ================= */
const LOC={};let GRASS_M=null;let CUR=null;
function makeLoc(id,type,ox,oz,b){const g=new THREE.Group();g.position.set(ox,0,oz);scene.add(g);
  const L={id,type,g,ox,oz,cols:[],dcols:[],inter:[],bounds:{x1:ox+b[0],z1:oz+b[1],x2:ox+b[2],z2:oz+b[3]}};LOC[id]=L;return L;}
function col(L,x1,z1,x2,z2){L.cols.push({x1:L.ox+Math.min(x1,x2),z1:L.oz+Math.min(z1,z2),x2:L.ox+Math.max(x1,x2),z2:L.oz+Math.max(z1,z2)});}
function colC(L,x,z,r){L.cols.push({cx:L.ox+x,cz:L.oz+z,cr:r});}
function inter(L,o){o.x+=L.ox;o.z+=L.oz;L.inter.push(o);return o;}
/* the big lake: solid water, except the wooden pier (a list of walkable strips) */
const LAKEW=[];
/* 🦆 a duck's face and feathers: a wide flat orange bill, round dark eyes with a shine, wings a shade darker and a little upturned tail; one piece per duck (run 4, stage 3: from the path the ducks read as faceless blobs and the white one as a snowman) */
function duckDress(d,c){const w=c==='#f7f2ec'?'#e3d9cb':'#f2c94c';sph(d,.055,'#ff9a3c',0,.315,.275,{s:[1.25,.42,1.55],ws:10,hs:6,ol:.012});
  for(const s of[-1,1]){sph(d,.034,INK,s*.05,.355,.235,{ws:8,hs:6,ol:false});sph(d,.012,'#ffffff',s*.058,.379,.245,{ws:6,hs:4,ol:false});   /* (run 4 finish: the eyes sit a little deeper and the shine on their top, both inside the head's outline: from behind and from the side a shine stuck out past the outline like a googly eye) */sph(d,.12,w,s*.135,.17,-.03,{s:[.42,.62,1.15],ws:10,hs:6,ol:.012});}
  cone(d,.07,.13,c,0,.2,-.25,{rx:-Math.PI/2+.65,center:true,seg:6,ol:.012});bake(d,false);}
function duckEyes(d){for(const s of[-1,1]){box(d,.03,.04,.012,INK,s*.062,.35,.255,{ry:s*.35,ol:false});box(d,.012,.014,.006,'#ffffff',s*.062+.006,.362,.262,{ry:s*.35,ol:false});}}
function lakeOut(x,z,r,c){const dx=x-c.cx,dz=z-c.cz,m=r+c.cr;if(Math.abs(dx)>m||Math.abs(dz)>m)return null;const d=Math.hypot(dx,dz);if(d>=m)return null;
  let best=null,bc=1e9;
  for(const w of c.walk){const qx=x-w.ax,qz=z-w.az,t=qx*w.ux+qz*w.uz,s=-qx*w.uz+qz*w.ux,h=Math.max(.05,w.hw-r);
    if(t>=0&&t<=w.len&&Math.abs(s)<=h)return null;
    const tc=clamp(t,0,w.len),sc=clamp(s,-h,h),px=w.ax+w.ux*tc-w.uz*sc,pz=w.az+w.uz*tc+w.ux*sc,k=Math.hypot(px-x,pz-z);if(k<bc){bc=k;best=[px,pz];}}
  if(m-d<bc){if(d<1e-6)return[x+m,z];const k=(m-d)/d;return[x+dx*k,z+dz*k];}
  return best;}
function pushOut(x,z,r,c){
  if(c.lk)return lakeOut(x,z,r,c);
  if(c.ob){const dx=x-c.cx,dz=z-c.cz,t=dx*c.ux+dz*c.uz,s=dz*c.ux-dx*c.uz;if(Math.abs(t)>c.hl+r||Math.abs(s)>c.hw+r)return null;   /* a turned box (the bus): pushed out in its own frame */
    const p=pushOut(t,s,r,{x1:-c.hl,z1:-c.hw,x2:c.hl,z2:c.hw});return p&&[c.cx+p[0]*c.ux-p[1]*c.uz,c.cz+p[0]*c.uz+p[1]*c.ux];}
  if(c.cr!==undefined){const dx=x-c.cx,dz=z-c.cz,m=r+c.cr;if(Math.abs(dx)>m||Math.abs(dz)>m)return null;const d=Math.hypot(dx,dz);if(d>=m)return null;if(d<1e-6)return[x+m,z];const k=(m-d)/d;return[x+dx*k,z+dz*k];}
  if(x<c.x1-r||x>c.x2+r||z<c.z1-r||z>c.z2+r)return null;
  const px=clamp(x,c.x1,c.x2),pz=clamp(z,c.z1,c.z2),dx=x-px,dz=z-pz,d2=dx*dx+dz*dz;
  if(d2>=r*r)return null;
  if(d2>1e-9){const d=Math.sqrt(d2),k=(r-d)/d;return[x+dx*k,z+dz*k];}
  const l=x-c.x1,rr2=c.x2-x,t=z-c.z1,b=c.z2-z,m=Math.min(l,rr2,t,b);
  if(m===l)return[c.x1-r,z];if(m===rr2)return[c.x2+r,z];if(m===t)return[x,c.z1-r];return[x,c.z2+r];
}
function collideXZ(x,z,r,L,extra){
  for(let it=0;it<3;it++){let hit=false;
    for(const list of [L.cols,L.dcols,extra||[]])for(const c of list){const p=pushOut(x,z,r,c);if(p){x=p[0];z=p[1];hit=true;}}
    if(!hit)break;}
  const b=L.bounds;return[clamp(x,b.x1+r,b.x2-r),clamp(z,b.z1+r,b.z2-r)];
}

/* ---- sky ---- */
function buildSky(){
  skyU={top:{value:new THREE.Color('#4fb4ff')},bot:{value:new THREE.Color('#c4ecff')}};
  skyMesh=new THREE.Mesh(new THREE.SphereGeometry(470,24,14),new THREE.ShaderMaterial({uniforms:skyU,side:THREE.BackSide,depthWrite:false,fog:false,
    vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'uniform vec3 top;uniform vec3 bot;varying vec3 vP;void main(){float h=normalize(vP).y;gl_FragColor=vec4(mix(bot,top,smoothstep(-0.02,0.5,h)),1.0);}'}));
  skyMesh.frustumCulled=false;skyMesh.renderOrder=-10;scene.add(skyMesh);
  const discTex=(c1,c2)=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');const g=x.createRadialGradient(64,64,8,64,64,64);g.addColorStop(0,c1);g.addColorStop(.42,c1);g.addColorStop(.5,c2);g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);};
  sunSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:discTex('#fff6c8','rgba(255,226,140,.55)'),fog:false,depthWrite:false,transparent:true}));sunSprite.scale.set(70,70,1);scene.add(sunSprite);
  moonSprite=new THREE.Sprite(new THREE.SpriteMaterial({map:discTex('#f4f2ff','rgba(200,200,255,.4)'),fog:false,depthWrite:false,transparent:true}));moonSprite.scale.set(46,46,1);scene.add(moonSprite);
  const N=450,pos=new Float32Array(N*3);for(let i=0;i<N;i++){const u=Math.random()*TAU,v=Math.acos(.08+Math.random()*.9),r=440;pos[i*3]=Math.sin(v)*Math.cos(u)*r;pos[i*3+1]=Math.cos(v)*r;pos[i*3+2]=Math.sin(v)*Math.sin(u)*r;}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  stars=new THREE.Points(sg,new THREE.PointsMaterial({color:'#ffffff',size:2.4,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));stars.frustumCulled=false;scene.add(stars);
  outside=new THREE.Group();scene.add(outside);
  const mr=Math.random;Math.random=seeded(13);try{   /* 🌳 the same clouds, hills and far trees on every load (same drawing work every time) */
  for(let i=0;i<16;i++){const c=new THREE.Group();const n=3+(Math.random()*3|0);for(let k=0;k<n;k++)sph(c,rand(5,9),null,k*6.5-n*3.2+rand(-2,2),rand(-1.5,1.5),rand(-3,3),{mat:CLOUD,ol:false,ws:12,hs:8,s:[1,.68,1]});
    const a=rand(0,TAU),r=rand(80,220);c.position.set(Math.cos(a)*r,rand(48,80),Math.sin(a)*r);c.userData.sp=rand(.6,1.5);bake(c,false);outside.add(c);clouds.push(c);}
  const hills=new THREE.Group();outside.add(hills);
  for(let i=0;i<28;i++){const a=i/28*TAU+rand(-.08,.08),r=rand(205,250),R=rand(40,62),c=pick(['#86d37c','#79c973','#93dc85']),y=-rand(8,18),x=Math.cos(a)*r;let z=Math.sin(a)*r;
    const foot=R*Math.sqrt(Math.max(0,1-(2*y/R)**2));if(x<-60&&Math.abs(z)<44+foot)z=(z<0?-1:1)*(44+foot);   /* 🏡 Friends Lane runs west through a valley: hills step aside */
    sph(hills,R,c,x,y,z,{ol:.9,ws:18,hs:10,s:[1,.5,1]});HILLS.push({x,y,z,R});}
  for(let i=0;i<110;i++){const a=rand(0,TAU),r=rand(94,160);const x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<7||Math.abs(z)<7||(x<-78&&Math.abs(z)<38)||(Math.abs(Math.abs(x)-50)<7&&Math.abs(z)<95)||(Math.abs(Math.abs(z)-50)<7&&Math.abs(x)<95))continue;(Math.random()<.5?pine:tree)(hills,x,z,rand(1.3,2.2));}
  bake(hills,false);}finally{Math.random=mr;}
}

/* 🌲 the forest belt and tree groups (night 3, job 12). Past the town barriers (and north and south of Friends Lane) a belt of round trees and
   pines several rows deep, at the same spots the map already draws (mapTrees), plus a close row just outside the barriers, and small tree
   groups in empty corners inside the town. Never on roads, paths, doors, the bus route, the football field, the pond and lake, the park or the
   lane (the lane valley x < -78, |z| < 31.5 stays free for new plots). Built light: low-poly trees, no outlines, no shadows, merged by 64 m
   chunks into one vertex-colour piece each. Season colours from job 11. The near row and the groups go on the map too */
const HILLS=[];
function groundY(x,z){let y=0;for(const h of HILLS){const d=((x-h.x)**2+(z-h.z)**2)/(h.R*h.R);if(d<1)y=Math.max(y,h.y+h.R*.5*Math.sqrt(1-d));}return y;}
function treeLo(g,x,y,z,s,c){cyl(g,.15*s,.2*s,2.3*s,'#9b6b4a',x,y,z,{seg:5,ol:false});sph(g,1.15*s,c,x,y+3.05*s,z,{ws:7,hs:5,ol:false});sph(g,.75*s,c,x+.7*s,y+2.75*s,z+.15*s,{ws:6,hs:4,ol:false});sph(g,.72*s,c,x-.62*s,y+2.8*s,z-.3*s,{ws:6,hs:4,ol:false});}
function pineLo(g,x,y,z,s,c){cyl(g,.14*s,.18*s,.8*s,'#9b6b4a',x,y,z,{seg:5,ol:false});cone(g,1.2*s,1.6*s,c,x,y+.7*s,z,{seg:6,ol:false});cone(g,.92*s,1.4*s,c,x,y+1.55*s,z,{seg:6,ol:false});cone(g,.62*s,1.2*s,c,x,y+2.35*s,z,{seg:6,ol:false});}
const laneFree=(x,z)=>x<-78&&Math.abs(z)<31.5,beachFree=(x,z)=>x>78&&Math.abs(z)<11;
function freeSpot(L,x,z,r){for(const c of L.cols){if(c.cr!==undefined){if(Math.hypot(x-c.cx,z-c.cz)<c.cr+r)return false;}else if(x>c.x1-r&&x<c.x2+r&&z>c.z1-r&&z<c.z2+r)return false;}
  for(const t of L.inter)if(Math.hypot(x-t.x,z-t.z)<7)return false;return true;}
function buildForest(L,st){const F=new THREE.Group();L.g.add(F);const r=seeded(68),TC=()=>TREE_COLS[(r()*TREE_COLS.length)|0],PC=()=>PINE_COLS[(r()*PINE_COLS.length)|0];
  const plant=(x,z,s)=>{const y=groundY(x,z);if(r()<.45)pineLo(F,x,y,z,s*1.15,PC());else treeLo(F,x,y,z,s,TC());};
  for(const [x,z,R] of mapTrees())plant(x,z,clamp(R/1.9,.9,2.4));   /* the belt, where the map draws it */
  const near=[];for(let i=0;i<900&&near.length<150;i++){const side=(r()*4)|0,u=(r()-.5)*2*91,v=85.5+r()*5.5,x=side<2?u:(side===2?v:-v),z=side<2?(side===0?v:-v):u;   /* a close row just past the barriers */
    if(laneFree(x,z)||beachFree(x,z)||near.some(([a,b])=>Math.hypot(a-x,b-z)<2.6))continue;near.push([x,z]);}
  for(const [x,z] of near){const R=1.6+r()*1.4;plant(x,z,R/1.5);mapTrees().push([x,z,R]);}
  bake(F,false,96);   /* (96 m chunks: fewer pieces) */
  /* tree groups in empty corners inside the town */
  const G=[],roadNear=(x,z)=>[-50,0,50].some(c=>Math.abs(x-c)<9||Math.abs(z-c)<9),bad=(x,z)=>Math.abs(x)>80||Math.abs(z)>80||roadNear(x,z)||(x>-42&&x<-6&&z>6&&z<43)||(x>-44&&x<-10&&z>53)||Math.hypot(x-69,z-69)<14||Math.hypot(x-36.2,z+36.2)<8||x<-76;
  for(let i=0;i<700&&G.length<9;i++){const x=(r()-.5)*160,z=(r()-.5)*160;if(Math.abs(x)<54&&Math.abs(z)<54)continue;if(bad(x,z)||!freeSpot(L,x,z,4.5)||G.some(g=>Math.hypot(g[0]-x,g[1]-z)<16))continue;
    const T=[];for(let k=0;k<14&&T.length<3+((r()*3)|0);k++){const a=r()*TAU,d=.8+r()*3.0,tx=x+Math.cos(a)*d,tz=z+Math.sin(a)*d;if(bad(tx,tz)||!freeSpot(L,tx,tz,1.4)||T.some(([a2,b2])=>Math.hypot(a2-tx,b2-tz)<2.3))continue;T.push([tx,tz]);}
    if(T.length<2)continue;G.push([x,z]);let first=true;for(const [tx,tz] of T){const s=.9+r()*.5;if(r()<.3&&!first)pine(st,tx,tz,s*1.1);else{tree(st,tx,tz,s);if(first)(L.owlTrees||(L.owlTrees=[])).push([tx,tz]);}first=false;colC(L,tx,tz,.3);mapTrees().push([tx,tz,1.1*s]);}}
  L.treeGroups=G;}

/* 🦋 wild animals (night 3, job 13): one batch per kind, moved on the graphics chip, no shadows, only in town. Butterflies flutter round the
   flower beds and the park fountain in the daytime (spring, summer and autumn until 31 October; not in rain or snow). Birds (BIRDS, not "owls":
   the night-walking townspeople already have that name) flap in loose flocks high over the town in the daytime, fewer in winter. Real owls
   (WILD.hoots) sit in some trees at night (the park, the tree groups, the forest edge, your yard) with big blinking eyes and a soft hoo-hoo
   now and then when you are near (only with sound on). WILD.force(true) shows the butterflies and birds whatever the time (for the tests) */
const WILD={bf:null,birds:null,hoots:null,forced:false,hoot:0,spots:[],force(on){WILD.forced=!!on;}};
const BF_COLS=['#ff9ec4','#ffd45c','#7cc8ff','#b79cff','#ff8a6b','#7fdcb5','#ffffff','#ff6b6b'];
function bfGeo(c){return flockGeo(g=>{sph(g,.028,'#3d2c5e',0,0,0,{s:[1,1,2.4],ws:6,hs:4,ol:false});for(const s of[-1,1]){box(g,.13,.006,.1,c,s*.08,0,.01,{ol:false,center:true});box(g,.08,.006,.06,shade(c,-.18),s*.1,.004,-.055,{ol:false,center:true});}});}   /* (run 4, stage 3: a little smaller; big flat wings low over the grass read as dropped props) */
function birdGeo(c){return flockGeo(g=>{sph(g,.09,c,0,0,0,{s:[1,.8,1.4],ws:7,hs:5,ol:false});sph(g,.06,c,0,.05,.12,{ws:6,hs:4,ol:false});cone(g,.025,.06,'#ffb347',0,.04,.2,{rx:Math.PI/2,center:true,seg:4,ol:false});
  for(const s of[-1,1])box(g,.3,.012,.12,shade(c,-.12),s*.17,.03,0,{ol:false,center:true});box(g,.07,.01,.12,shade(c,-.12),0,.02,-.15,{ol:false,center:true});});}
function owlGeos(){const body=flockGeo(g=>{sph(g,.17,'#8a5a36',0,0,0,{s:[1,1.15,1],ws:9,hs:7,ol:false});sph(g,.12,'#d9a06b',0,-.04,.09,{s:[1,1.1,.6],ws:8,hs:6,ol:false});
    for(const s of[-1,1])cone(g,.05,.12,'#8a5a36',s*.1,.17,0,{center:true,seg:4,ol:false});cone(g,.03,.07,'#ffb347',0,.02,.19,{rx:Math.PI/2,center:true,seg:4,ol:false});});
  const eyes=flockGeo(g=>{for(const s of[-1,1]){sph(g,.058,'#fff6d6',s*.066,.07,.135,{ws:8,hs:6,ol:false});sph(g,.03,'#1a1330',s*.066,.07,.185,{ws:6,hs:4,ol:false});}});return{body,eyes};}
/* many copies of the same geometry at given spots: ctr + ph per copy (eyes get eye=1 and the eye line ey so they can blink) */
function wildMerge(list){let n=0;for(const it of list)n+=it.geo.attributes.position.count;const P=new Float32Array(n*3),C=new Float32Array(n*3),K=new Float32Array(n*3),PH=new Float32Array(n),E=new Float32Array(n),EY=new Float32Array(n);let off=0;const m4=new THREE.Matrix4();
  for(const it of list){const g=it.geo,m=g.attributes.position.count,src=g.clone();m4.makeRotationY(it.yaw||0);if(it.sc)m4.scale(new THREE.Vector3(it.sc,it.sc,it.sc));src.applyMatrix4(m4);P.set(src.attributes.position.array,off*3);C.set(g.attributes.color.array,off*3);
    for(let i=0;i<m;i++){const j=off+i;K[j*3]=it.x;K[j*3+1]=it.y;K[j*3+2]=it.z;PH[j]=it.ph;E[j]=it.eye?1:0;EY[j]=it.ey||0;}off+=m;src.dispose();}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('color',new THREE.BufferAttribute(C,3));geo.setAttribute('ctr',new THREE.BufferAttribute(K,3));geo.setAttribute('ph',new THREE.BufferAttribute(PH,1));geo.setAttribute('eye',new THREE.BufferAttribute(E,1));geo.setAttribute('ey',new THREE.BufferAttribute(EY,1));
  geo.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,0,0),400);return geo;}
function owlMesh(spots){const G=owlGeos(),list=[];for(const [x,y,z,yaw,ph] of spots){list.push({geo:G.body,x,y,z,yaw,ph,sc:1.6},{geo:G.eyes,x,y,z,yaw,ph,sc:1.6,eye:1,ey:.07*1.6});}   /* a bit bigger than life, so you can see it in the leaves */
  const m=new THREE.ShaderMaterial({uniforms:{tm:{value:0}},vertexColors:true,
    vertexShader:'attribute vec3 ctr;attribute float ph,eye,ey;uniform float tm;varying vec3 vC;varying float vY;void main(){float f=fract(tm*0.21+ph);float b=smoothstep(0.0,0.05,f)*(1.0-smoothstep(0.09,0.14,f));vec3 p=position;p.y=mix(p.y,ey,b*eye);vC=color;vY=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(ctr+p,1.0);}',
    fragmentShader:'varying vec3 vC;varying float vY;void main(){gl_FragColor=vec4(vC*(0.8+0.6*clamp(vY,-0.15,0.15)),1.0);}'});
  const mesh=new THREE.Mesh(wildMerge(list),m);mesh.userData.keep=1;mesh.frustumCulled=false;G.body.dispose();G.eyes.dispose();return mesh;}
function buildWild(L){const r=seeded(69);
  /* butterflies round the flower beds and the fountain */
  const spots=(L.beds||[]).map(b=>[b.x,b.z,2.2]).concat([[-22,22,6.5],[-14,30,3],[-30,14,3]]),bf=[];
  for(const [cx,cz,ra] of spots){const n=3+((r()*3)|0);for(let i=0;i<n;i++)bf.push({geo:bfGeo(BF_COLS[(r()*BF_COLS.length)|0]),x:cx,y:1.15+r()*1.0,z:cz,ph:r()*TAU,sp:(.5+r()*.6)*(r()<.5?1:-1),ra:.6+r()*ra,ya:.25,wing:.7,fl:15+r()*4});}
  WILD.bf=flockMesh(bf,{cr:2.2});   /* (run 4 finish: 2.2 m from the camera, not 1.3: that near, its two flat wings read as a big gold block in the air) */WILD.bf.visible=false;L.g.add(WILD.bf);
  /* birds high over the town */
  const nb=SEASON==='winter'?12:30,BC=['#ffffff','#c8cde0','#7cc8ff','#8a5a36','#ffd45c'],birds=[];
  for(let i=0;i<nb;i++){const c=[[-20,-20],[25,15],[0,-55],[-60,40],[50,-50]][i%5];birds.push({geo:birdGeo(BC[(r()*BC.length)|0]),x:c[0]+(r()-.5)*10,y:15+r()*12,z:c[1]+(r()-.5)*10,ph:r()*TAU,sp:(.1+r()*.12)*(i%2?1:-1),ra:9+r()*14,ya:1.2,wing:1.0,fl:5+r()*3});}
  WILD.birds=flockMesh(birds);WILD.birds.visible=false;L.g.add(WILD.birds);
  /* owls in some trees: the park, the tree groups, the forest edge, your yard tree */
  const owls=[];const perch=(x,z,s)=>{const yaw=Math.atan2(-x,-z);owls.push([x+Math.sin(yaw)*1.22*s,2.62*s,z+Math.cos(yaw)*1.22*s,yaw,r()]);};
  for(const [x,z] of [[-37.6,9.2],[-11.5,28],[-26,37.5],[-37.6,27.7]])perch(x,z,1);
  for(const [x,z] of (L.owlTrees||[]))perch(x,z,1.1);perch(-20.2,-18.6,1.1);
  WILD.spots=owls;WILD.hoots=owlMesh(owls);WILD.hoots.visible=false;L.g.add(WILD.hoots);}
SFX.hoot=()=>{tone(392,.2,'sine',.05,0,370);tone(330,.26,'sine',.05,.26,300);};
function wildTick(dt,now){if(!WILD.bf||!S)return;const t=(now/1000)%1e4,out=!!CUR&&CUR.id==='city',h=S.time,day=h>=7&&h<19,nf=nightF(h),mo=realDate().getMonth()+1;
  const wet=WX.rain>.3||WX.snow>.3,bfSeason=SEASON!=='winter'&&!(SEASON==='autumn'&&mo===11);
  WILD.bf.visible=out&&(WILD.forced||(day&&bfSeason&&!wet));WILD.birds.visible=out&&(WILD.forced||(day&&!wet));WILD.hoots.visible=out&&nf>.3;
  for(const m of[WILD.bf,WILD.birds,WILD.hoots])if(m.visible)m.material.uniforms.tm.value=t;
  if(WILD.hoots.visible&&PLAYING){WILD.hoot-=dt;if(WILD.hoot<=0){WILD.hoot=6+Math.random()*8;if(WILD.spots.some(o=>Math.hypot(o[0]-P.x,o[2]-P.z)<9))SFX.hoot();}}}

/* ✂️ the hairstylist job and the Hair Salon (night 3, job 15). The salon stands on the west road by the Apartments, open 8:00 to 20:00 like the shops.
   Rosie offers the job like the others (JOBS.hair). In the salon a customer comes in, sits in your chair and shows a picture of the hair they want
   (their own face with that hair): a length (long, shoulder, short), a style (straight, bob, ponytail, bun, pigtails, curly) and one of 8 colours.
   ✂️ cuts shorter (never back), 🪮 picks the style, 🎨 the colour; the hair changes as you work. ✅ Done gives 1 to 5 stars by how close it is
   (length, style, colour, and not cutting too much) and coins by stars. The customer is always kind. Works by touch and on PC. HS_MAX a day */
const SALON={x:-63.5,z:40.5,door:[-59.2,40.5]},HS_MAX=4,HS_PAY=[0,15,35,60,90,120];
const HS_COLS=[['#2e2347','black'],['#5a3a24','dark brown'],['#8d6238','brown'],['#e8734a','ginger'],['#f2d16b','blonde'],['#d8d8e4','silver'],['#ff7aa8','pink'],['#7cc8ff','blue']];
const HS_STYLES=[['straight','Straight','💇'],['bob','Bob','🔔'],['ponytail','Ponytail','🎀'],['bun','Bun','🍩'],['pigtails','Pigtails','🎎'],['curly','Curly','🌀']],HS_LENS=['long','shoulder','short'];
const HS_NAMES=['Mia','Leo','Zoe','Max','Ava','Tom','Ruby','Ivy','Jack','Nora','Finn','Lily','Ben','Ella','Sam','Mo'];
const HS={cust:null,wait:2,last:null,tt:0};
function hs(){const d=S.hs||(S.hs={});if(d.day!==S.day){d.day=S.day;d.done=0;}return d;}
const hsColN=c=>(HS_COLS.find(x=>x[0]===c)||['','a new'])[1],hsStyleN=k=>(HS_STYLES.find(x=>x[0]===k)||[k,k])[1].toLowerCase(),hsLenN=l=>l==='shoulder'?'shoulder-length':l;
/* the look of a customer with a given hair (the model's style comes from the style and the length) */
function hsLookOf(c,h){const s=h.style==='straight'?(h.len==='long'?'long':h.len==='short'?'short':'mid'):h.style;return Object.assign({},c.look,{hair:h.col,hair2:null,style:s,len:h.len,swoop:false,hat:null,glasses:c.look.glasses});}
function hsNewCust(){const look=Object.assign({},pick(TOWNFOLK),{scale:1});delete look.hat;delete look.hatc;
  const want={len:pick(HS_LENS),style:pick(HS_STYLES)[0],col:pick(HS_COLS)[0]},li=HS_LENS.indexOf(want.len);
  const hair={len:HS_LENS[Math.floor(Math.random()*(li+1))],style:pick(HS_STYLES.filter(s=>s[0]!==want.style))[0],col:pick(HS_COLS.filter(k=>k[0]!==want.col))[0]};   /* never shorter than wanted: hair can't grow back */
  const c={name:pick(HS_NAMES),look,want,hair,p:null,x:0,z:3.4,sat:false,leaving:false,pic:'',t:0};c.p=makePerson(hsLookOf(c,c.hair));scene.add(c.p.root);return c;}
function hsRebuild(c,standing){const r=c.p.root,ry=r.rotation.y;scene.remove(r);c.p=makePerson(hsLookOf(c,c.hair));c.p.root.rotation.y=ry;if(!standing&&c.sat)sitPose(c.p);scene.add(c.p.root);hsPlace(c);}
function hsPlace(c){const L=LOC.salon;if(!L)return;c.p.root.position.set(L.ox+c.x,c.sat?.6-.62:0,L.oz+c.z);c.p.root.visible=!!CUR&&CUR.id==='salon';}
function hsClear(){if(HS.cust){scene.remove(HS.cust.p.root);HS.cust=null;}HS.wait=2;if(UI.open&&document.querySelector('#card [data-a="hsdone"],#card [data-a="hsbye"]'))closePanel();}
const hsAsk=c=>{const s=c.want.style,how=s==='straight'||s==='curly'?' and '+s:s==='pigtails'?', in pigtails':', in a '+s;return`Hi! I'd like ${hsColN(c.want.col)} hair, ${hsLenN(c.want.len)}${how}, please! ${pick(['💇','✨','😊','💕'])}`;};   /* (run 4 finish: "long and straight", "short, in pigtails", "shoulder-length, in a bun"; it said "shoulder-length and bun") */
/* the wish picture: the customer's own face with the hair they want */
function hsPic(c){if(c.pic)return c.pic;let url='';try{const sc=shotScene(),p=makePerson(hsLookOf(c,c.want));sc.add(p.root);p.root.updateMatrixWorld(true);const v=new THREE.Vector3();p.head.getWorldPosition(v);
    const cam=new THREE.PerspectiveCamera(30,1,.05,20);cam.position.set(v.x+.05,v.y+.42,v.z+1.95);cam.lookAt(v.x,v.y+.3,v.z);url=offShot(sc,cam,220,220,0xfff0f6);}catch(e){console.warn(e);}c.pic=url;return url;}
function hsCard(){const c=HS.cust;if(!c||!c.sat||c.leaving)return;const h=c.hair;if(!(UI.open&&document.querySelector('#card [data-a="hsdone"]'))){HS.look=1.2;popDrop();}   /* 👀 a fresh card: the view turns to the customer (run 4 finish) */
  openPanel(`<div class="who" style="--c:#ff9ec4">✂️ ${esc(c.name)}</div><div class="hsrow"><img class="hspic" alt="The hair ${esc(c.name)} wants" src="${hsPic(c)}"><p class="line">“${esc(hsAsk(c)).replace(/ (\S+)$/,'\u00a0$1')}”<br><small>Now: <b>${hsLenN(h.len)}</b>, <b>${hsStyleN(h.style)}</b>, <b>${hsColN(h.col)}</b></small></p></div>
    <div class="hsgrid">${HS_STYLES.map(([k,n,i])=>`<button class="btn ${h.style===k?'mint':'white'}" data-a="hscomb:${k}">${i} ${n}</button>`).join('')}</div>
    <div class="swrow hsw">${HS_COLS.map(([k,n])=>`<button class="sw ${h.col===k?'on':''}" style="background:${k}" data-a="hsdye:${k}" aria-label="${n}"></button>`).join('')}</div>
    <div class="row hsdo"><button class="btn butter" data-a="hscut" ${h.len==='short'?'disabled':''}>✂️ Cut shorter</button><button class="btn mint" data-a="hsdone">✅ Done!</button><button class="btn white" data-a="close" aria-label="Later">✕</button></div>`,{bottom:true});}
const starsHalf5=n=>`<span class="stars">${'★'.repeat(n)}<i>${'★'.repeat(5-n)}</i></span>`;
function hsTick(dt){const c=HS.cust;if(!S||!PLAYING)return;
  if(S.job!=='hair'){if(c)hsClear();return;}
  if(c&&c.p)c.p.root.visible=!!CUR&&CUR.id==='salon';
  if(!c){if(!CUR||CUR.id!=='salon'||hs().done>=HS_MAX||!isDaytime())return;HS.wait-=dt;if(HS.wait<=0){HS.cust=hsNewCust();hsPlace(HS.cust);SFX.door();popText('🚪 '+HS.cust.name+' comes in!');}return;}
  c.t+=dt;const p=c.p;if(!CUR||CUR.id!=='salon')return;
  if(HS.look>0){HS.look-=dt;if(c.sat&&UI.open&&!P.sit&&p.head){const v=HS.v||(HS.v=new THREE.Vector3());p.head.getWorldPosition(v);const dx=v.x-P.x,dz=v.z-P.z,dh=Math.hypot(dx,dz);   /* (run 4 finish: the card covered the customer in the chair: the view turns so they show above it, head a bit above the middle of the space left) */
    if(dh>.4){const H=innerHeight,top=hudLow(),cr=$('card').getBoundingClientRect(),yT=top+(Math.max(cr.top,top+80)-top)*.42,ny=1-2*yT/H,a=Math.atan2(v.y-camera.position.y,dh),k=Math.min(1,dt*5);
      P.yaw=angLerp(P.yaw,Math.atan2(-dx,-dz),k);P.pitch=lerp(P.pitch,clamp(a-Math.atan(ny*Math.tan(camera.fov*Math.PI/360)),-1.2,.6),k);}}}   /* the customer waits in the chair while you are out */
  if(!c.sat&&!c.leaving){const tx=-2.4,tz=-1.9,dx=tx-c.x,dz=tz-c.z,dd=Math.hypot(dx,dz);
    if(dd>.05){const s=Math.min(dd,1.5*dt);c.x+=dx/dd*s;c.z+=dz/dd*s;p.root.rotation.y=Math.atan2(dx,dz);animPerson(p,dt,true);}
    else{c.sat=true;c.x=tx;c.z=tz;p.root.rotation.y=0;sitPose(p);SFX.pop();if(!UI.open&&!CUT&&!TUT)hsCard();else popText('✂️ '+c.name+' sits down!');}}   /* (run 4 finish: the card's tab names who sat down; the big words lay across their face as the view turned to them) */
  else if(c.leaving){const tx=0,tz=3.6,dx=tx-c.x,dz=tz-c.z,dd=Math.hypot(dx,dz);
    if(dd>.08){const s=Math.min(dd,1.5*dt);c.x+=dx/dd*s;c.z+=dz/dd*s;p.root.rotation.y=Math.atan2(dx,dz);animPerson(p,dt,true);}
    else{scene.remove(p.root);HS.cust=null;HS.wait=rand(5,9);SFX.door();jobHud(true);return;}}
  else{animPerson(p,dt,false,.6);sitPose(p);const h=p.head;h.rotation.y=lerp(h.rotation.y,clamp(angLerp(p.root.rotation.y,Math.atan2(P.x-p.root.position.x,P.z-p.root.position.z),1)-p.root.rotation.y,-.9,.9),Math.min(1,dt*5));}   /* in the chair: looks at you */
  hsPlace(c);}
/* the first-time tips (the same little card as the pizza tips) */
const HS_TUT=[   /* 🖼️ run 4, job 14: 4 picture steps */
  {t:'Hairstylist ✂️',x:'A customer sits in your chair.',pic:'h1'},
  {t:'The wish picture 🖼️',x:'Make the hair like the picture.',pic:'h2'},
  {t:'Cut, comb, dye',x:'Tap the tools.',pic:'h3'},
  {t:'Done! ⭐',x:'Tap ✅ when it matches.',pic:'h4'}];
function hsTutStart(){if(TUT||!PLAYING)return;if(UI.open)closePanel();TUT={i:0,hs:1,steps:HS_TUT};$('tut').hidden=false;tutShow();}
function hsTutTick(dt){if(S&&S.job==='hair'&&!S.hsTut&&S.intro&&!TUT&&!DTUT&&!UI.open&&!CUT&&!fading&&PLAYING){HS.tt+=dt;if(HS.tt>.6)hsTutStart();}else HS.tt=0;}
/* the salon inside: two chairs facing the room, mirrors on the back wall, a sink, the dye shelf, posters */
function buildSalon(){const L=makeLoc('salon','in',4100,0,[-6,-4.5,6,4.5]);const sh=new THREE.Group(),pr=new THREE.Group();L.g.add(sh,pr);
  shell(L,sh,12,9,3.3,mat('#ffe6f5'),toon({map:floorTex('check')}),'#fff3fa');
  doorAt(sh,0,4.5-.02,Math.PI,null,true,true);windowIn(sh,6-.02,1.0,-.5,-Math.PI/2,'#ff9ec4');windowIn(sh,-6+.02,1.0,2.4,Math.PI/2,'#ff9ec4');
  for(const x of[-2.4,2.4]){cyl(pr,.34,.4,.1,'#c8cde0',x,0,-1.9,{seg:16,ol:.012});cyl(pr,.06,.06,.4,'#c8cde0',x,.1,-1.9,{seg:8,ol:false});box(pr,.62,.12,.6,'#ff9ec4',x,.5,-1.9,{ol:.015});box(pr,.62,.5,.1,'#ff9ec4',x,.6,-2.2,{ol:.015});
    for(const s of[-1,1])box(pr,.08,.22,.5,'#ff7aa8',x+s*.31,.62,-1.95,{ol:.012});colC(L,x,-1.9,.5);
    box(pr,1.0,1.2,.06,'#dff2ff',x,.9,-4.42,{ol:.02});box(pr,1.14,.08,.08,'#ffd45c',x,2.1,-4.42,{ol:.012});box(pr,1.14,.08,.08,'#ffd45c',x,.82,-4.42,{ol:.012});
    for(let k=0;k<4;k++)sph(pr,.045,null,x-.45+k*.3,2.22,-4.4,{mat:LAMP,ol:.01,ws:8,hs:6});}   /* 💡 lights over the mirrors */
  box(pr,1.6,.9,.7,'#ffffff',-4.6,0,-3.9,{ol:.015});box(pr,1.7,.08,.8,'#c8cde0',-4.6,.9,-3.9,{ol:.012});sph(pr,.42,'#dff2ff',-4.6,.98,-3.95,{s:[1,.25,.8],ws:12,hs:8,ol:.012});cyl(pr,.03,.03,.3,'#c8cde0',-4.6,1.0,-4.2,{seg:6,ol:false});col(L,-5.5,-4.4,-3.7,-3.4);   /* the sink */
  for(let r=0;r<2;r++){box(pr,.14,.05,3.0,'#ffffff',-5.9,1.2+r*.5,-.3,{ol:.012});for(let i=0;i<8;i++){const c=HS_COLS[(i+r*3)%8][0];cyl(pr,.06,.07,.26,c,-5.85,1.25+r*.5,-1.55+i*.37,{seg:8,ol:.01});sph(pr,.045,'#ffffff',-5.85,1.53+r*.5,-1.55+i*.37,{ws:6,hs:5,ol:false});}}   /* 🎨 the dye bottles (run 4, stage 3: 55 cm along the wall, clear of the window's curtain) */
  col(L,-6,-1.95,-5.6,1.45);
  box(pr,2.6,.1,.6,'#b79cff',3.6,.45,3.3,{ol:.015});box(pr,2.6,.5,.08,'#b79cff',3.6,.55,3.56,{ol:.015});for(const s of[-1.1,1.1])box(pr,.1,.45,.5,'#5a5f8c',3.6+s,0,3.3,{ol:.012});col(L,2.2,2.9,5.0,3.7);   /* a waiting bench */
  const s1=signPlane('✂ Hair Salon',3.4,.7,'#ff9ec4','#ffffff');s1.position.set(0,2.75,-4.44);L.g.add(s1);
  const s2=signPlane('💇 Long · Bob · Ponytail',2.8,.5,'#ffffff','#3d2c5e');s2.position.set(5.94,2.2,2.25);s2.rotation.y=-Math.PI/2;L.g.add(s2);   /* past the window's curtain (run 4, job 5: the curtain's top crossed the posters' end) */
  const s3=signPlane('🌀 Bun · Pigtails · Curly',2.8,.5,'#ffffff','#3d2c5e');s3.position.set(5.94,1.55,2.25);s3.rotation.y=-Math.PI/2;L.g.add(s3);
  bake(sh,false);bake(pr,true);
  inter(L,{x:0,z:3.8,r:1.9,icon:'🚪',label:'Go outside',act:()=>exitTo('salon')});
  inter(L,{x:-2.4,z:-.6,r:2.4,icon:'✂️',hs:1,label:()=>HS.cust&&HS.cust.sat?'Do '+HS.cust.name+"'s hair":'Your salon chair',act:()=>{if(HS.cust&&HS.cust.sat)hsCard();else{SFX.tap();toast(S.job==='hair'?(hs().done>=HS_MAX?`🌟 All ${HS_MAX} customers done today!`:!isDaytime()?`Customers come from ${DAY_ON}:00 ☀️`:'A customer will come in soon! ✂️'):'Want to work here? Ask Rosie for the ✂️ Hairstylist job!',3.2);}}});
  return L;}

/* ---- the town ---- */
const WP=[[-34,-5.6],[-20,-5.6],[-5.6,-5.6],[5.6,-5.6],[20,-5.6],[34,-5.6],[-34,5.6],[-20,5.6],[-5.6,5.6],[5.6,5.6],[20,5.6],[34,5.6],
  [-5.6,-20],[-5.6,-34],[5.6,-20],[5.6,-34],[-5.6,20],[-5.6,34],[5.6,20],[5.6,34],
  [-22,9.6],[-22,13.8],[-30.2,22],[-22,30.2],[-13.8,22],[-33,28.5],[-11,33.5],
  [-22,-25.8],[-5.6,-25.8],[23,-25.8],[5.6,-25.8],[24,25.8],[5.6,25.8],[-31,-9.8],[-31,-5.6],
  [18,-8.6],[32,-8.6],[18,8.6],[31.5,8.6],
  [-39.2,-39.2],[-20,-39.2],[-5.6,-39.2],[5.6,-39.2],[20,-39.2],[39.2,-39.2],[39.2,-20],[39.2,-5.6],[39.2,5.6],[39.2,20],[39.2,39.2],
  [20,39.2],[5.6,39.2],[-5.6,39.2],[-20,39.2],[-39.2,39.2],[-39.2,20],[-39.2,5.6],[-39.2,-5.6],[-39.2,-20],[36.2,-39.2]];
const WE=[[0,34],[34,1],[1,2],[2,3],[3,4],[4,5],[6,7],[7,8],[8,9],[9,10],[10,11],[2,8],[3,9],[2,12],[12,28],[28,13],[3,14],[14,30],[30,15],[8,16],[16,17],[9,18],[18,32],[32,19],
  [7,20],[20,21],[21,22],[22,23],[23,24],[24,21],[22,25],[23,26],[24,26],[16,24],
  [27,28],[29,30],[31,32],[33,34],[4,35],[5,36],[10,37],[11,38],
  [39,40],[40,41],[41,42],[42,43],[43,59],[59,44],[44,45],[45,46],[46,47],[47,48],[48,49],[49,50],[50,51],[51,52],[52,53],[53,54],[54,55],[55,56],[56,57],[57,58],[58,39],
  [13,41],[15,42],[17,52],[19,51],[5,46],[11,47],[0,57],[6,56]];
const WPN={};function addN(n,x,z){WPN[n]=WP.length;WP.push([x,z]);return WPN[n];}
function addE(a,b){WE.push([typeof a==='string'?WPN[a]:a,typeof b==='string'?WPN[b]:b]);}
{ // inner ring sidewalk (just outside the old town) and outer ring sidewalk, plus the new districts
  const I=[['I1',-44.5,-44.5],['I2',-5.6,-44.5],['I3',5.6,-44.5],['I4',44.5,-44.5],['I5',44.5,-5.6],['I6',44.5,5.6],['I7',44.5,44.5],['I8',5.6,44.5],['I9',-5.6,44.5],['I10',-44.5,44.5],['I11',-44.5,5.6],['I12',-44.5,-5.6]];
  for(const [n,x,z] of I)addN(n,x,z);for(let i=0;i<I.length;i++)addE(I[i][0],I[(i+1)%I.length][0]);
  for(const [a,b] of [['I2',41],['I3',42],['I5',46],['I6',47],['I8',51],['I9',52],['I11',56],['I12',57],['I1',39],['I4',44],['I7',49],['I10',54]])addE(a,b);
  const O=[[-55.5,-55.5],[-36,-55.5],[-20,-55.5],[-5.6,-55.5],[5.6,-55.5],[20,-55.5],[36,-55.5],[55.5,-55.5],[55.5,-36],[55.5,-20],[55.5,-5.6],[55.5,5.6],[55.5,20],[55.5,36],
    [55.5,55.5],[36,55.5],[20,55.5],[5.6,55.5],[-5.6,55.5],[-20,55.5],[-36,55.5],[-55.5,55.5],[-55.5,36],[-55.5,20],[-55.5,5.6],[-55.5,-5.6],[-55.5,-20],[-55.5,-36]];
  O.forEach(([x,z],i)=>addN('O'+(i+1),x,z));for(let i=0;i<O.length;i++)addE('O'+(i+1),'O'+((i+1)%O.length+1));
  for(const [a,b] of [['I2','O4'],['I3','O5'],['I5','O11'],['I6','O12'],['I8','O18'],['I9','O19'],['I11','O25'],['I12','O26']])addE(a,b);
  for(const [n,x,z,o] of [['E1',-5.6,-75,'O4'],['E2',5.6,-75,'O5'],['E3',75,-5.6,'O11'],['E4',75,5.6,'O12'],['E5',5.6,75,'O18'],['E6',-5.6,75,'O19'],['E7',-75,5.6,'O25'],['E8',-75,-5.6,'O26']]){addN(n,x,z);addE(n,o);}
  addE('E1','E2');addE('E3','E4');addE('E5','E6');addE('E7','E8');
  for(const [n,x,z,a,b] of [['school',-25,-57.3,'O2','O3'],['hN1',13,-56.9,'O5','O6'],['hN2',25,-56.9,'O6','O7'],['hN3',37,-56.9,'O7','O8'],
    ['hS1',13,56.9,'O18','O17'],['hS2',25,56.9,'O17','O16'],['hS3',37,56.9,'O16','O15'],['toys',57.2,-31,'O9','O10'],['bakery',57.2,-14,'O10','O11'],
    ['library',57.6,20,'O12','O13'],['icecream',57.2,36,'O13','O14'],['fire',-57.6,-25,'O27','O28'],['clothes',-57.6,-12.5,'O26','O27'],['aptW',-58,25,'O24','O23'],['field',-25,59.4,'O20','O21'],['lake',60.6,60.6,'O15','O15']]){addN(n,x,z);addE(n,a);if(b!==a)addE(n,b);}
}
{const at=(x,z)=>WP.findIndex(p=>p[0]===x&&p[1]===z);   /* 🚸 these paths crossed the road away from a zebra crossing (the zebra one is just next to them) */
  for(const [ax,az,bx,bz] of [[-39.2,5.6,-39.2,-5.6],[39.2,-5.6,39.2,5.6],[-5.6,-39.2,5.6,-39.2],[5.6,39.2,-5.6,39.2]]){const a=at(ax,az),b=at(bx,bz),i=WE.findIndex(w=>w[0]===a&&w[1]===b||w[0]===b&&w[1]===a);if(a>=0&&b>=0&&i>=0)WE.splice(i,1);}}
const NEIGH=WP.map(()=>[]);for(const [a,b] of WE){NEIGH[a].push(b);NEIGH[b].push(a);}
const PARKN=new Set([20,21,22,23,24,25,26]);
const PAUSE=new Set([20,21,22,23,24,25,26,35,36,37,38,59,40,43,45,48,50,53,55,58,...['school','toys','bakery','library','icecream','fire','field','lake','clothes'].map(n=>WPN[n])]);
const TRAIL=[[39,40],[40,41],[42,43],[43,59],[59,44],[44,45],[45,46],[47,48],[48,49],[49,50],[50,51],[52,53],[53,54],[54,55],[55,56],[57,58],[58,39]];
const NEXT=WP.map((_,a)=>{const prev=new Array(WP.length).fill(-1);prev[a]=a;const q=[a];while(q.length){const u=q.shift();for(const v of NEIGH[u])if(prev[v]<0){prev[v]=u;q.push(v);}}
  return WP.map((_,b)=>{if(b===a||prev[b]<0)return a;let v=b;while(prev[v]!==a)v=prev[v];return v;});});
function nearestNode(x,z){let best=0,bd=1e9;WP.forEach((p,i)=>{const d=Math.hypot(p[0]-x,p[1]-z);if(d<bd){bd=d;best=i;}});return best;}
function segDist(px,pz,A,B){const dx=B[0]-A[0],dz=B[1]-A[1],l2=dx*dx+dz*dz;let t=l2?((px-A[0])*dx+(pz-A[1])*dz)/l2:0;t=clamp(t,0,1);return Math.hypot(px-(A[0]+dx*t),pz-(A[1]+dz*t));}
const LITTER_SPOTS=[[-30,-6.4],[-24,-6.2],[-10,-6.5],[10,-6.3],[14,-6.5],[26,-6.2],[31,-6.6],[-31,6.3],[-14,6.5],[12,6.2],[25,6.6],[33,6.3],
  [-6.3,-14],[-6.5,-28],[6.4,-26],[6.2,-12],[-6.4,14],[-6.2,30],[6.4,16],[6.3,28],[-26,13],[-17,13.5],[-30,26.5],[-14,27.5],[-25,33],[-36,18],[-11,17],[-19,35]];
/* houses with a door you can knock on: door position, which way it faces, door colour, wall colour */
const HOUSES=[
  {id:'n1',x:13,z:-57.98,ry:0,dc:'#5fd4b0',wc:'#ffd6e0',n:'Pink house'},{id:'n2',x:25,z:-57.98,ry:0,dc:'#ffd45c',wc:'#c9f2e3',n:'Green house'},
  {id:'n3',x:37,z:-57.98,ry:0,dc:'#7cc8ff',wc:'#fff1b8',n:'Yellow house'},{id:'s1',x:13,z:57.98,ry:Math.PI,dc:'#ff7aa8',wc:'#e6dbff',n:'Purple house'},
  {id:'s2',x:25,z:57.98,ry:Math.PI,dc:'#5fd4b0',wc:'#d9e8ff',n:'Blue house'},{id:'s3',x:37,z:57.98,ry:Math.PI,dc:'#ffd45c',wc:'#ffe0c4',n:'Peach house'},
  {id:'nb',x:-31,z:-11.48,ry:0,dc:'#ffd45c',wc:'#bff0dc',n:'House by the flowers'},{id:'ap1',x:-22,z:-26.98,ry:0,dc:'#7cc8ff',wc:'#ffd0b5',n:'Big apartments by the flowers'},
  {id:'of',x:23,z:-26.98,ry:0,dc:'#b79cff',wc:'#c7e6ff',n:'Tall building behind the Market'},{id:'ap2',x:24,z:26.98,ry:Math.PI,dc:'#ff8a6b',wc:'#ffe0c4',n:'Apartments behind the Pet Shop'},
  {id:'ap3',x:-60.98,z:25,ry:Math.PI/2,dc:'#7cc8ff',wc:'#ffd0b5',n:'Apartments by the park'}];
const HOUSE=id=>HOUSES.find(h=>h.id===id);
/* 🏢 big apartment buildings: you go inside, up the stairs, and find the flat. They all share these 3 floors. */
const APTB=['ap1','ap2','ap3','of'],isApt=id=>APTB.includes(id),FLAT_SPOT={};
const DOORS={pizza:{city:[58.9,8.6,Math.PI/2],inside:[0,3.2,0]},toys:{city:[58.4,-31,Math.PI/2],inside:[0,3.2,0]},bakery:{city:[58.4,-14,Math.PI/2],inside:[0,3.2,0]},icecream:{city:[57.9,36,Math.PI/2],inside:[0,3.2,0]},
  library:{city:[58.9,20,Math.PI/2],inside:[0,3.2,0]},school:{city:[-25,-57.5,Math.PI],inside:[0,3.2,0]},fire:{city:[-58.6,-29.6,-Math.PI/2],inside:[0,3.2,0]},clothes:{city:[-58.4,-12.5,-Math.PI/2],inside:[0,3.2,0]},homeback:{city:[-14,-19.7,0],inside:[4.4,-3.6,Math.PI]},cafe:{city:[32,-9.6,Math.PI],inside:[0,3.2,0]},flowers:{city:[31.5,9.6,0],inside:[0,3.2,0]},home:{city:[-17,-9.6,Math.PI],inside:[0,3.7,0]},market:{city:[18,-9.6,Math.PI],inside:[0,3.7,0]},pets:{city:[18,9.6,0],inside:[0,3.7,0]}};

for(const id of APTB){const h=HOUSE(id);DOORS['apt1'+id]={city:[h.x+Math.sin(h.ry)*1.3,h.z+Math.cos(h.ry)*1.3,h.ry+Math.PI],inside:[-8.2,0,-Math.PI/2]};}
DOORS.beach={city:[77.2,0,Math.PI/2],inside:[-25.5,0,-Math.PI/2]};
DOORS.treepark={city:[71.6,-38,Math.PI/2],inside:[0,23.5,0]};   /* 🌲 the Tree Park's gate (run 4, job 16): in the woods behind the Toy Store; inside you start by the signs */
DOORS.salon={city:[-58.4,40.5,-Math.PI/2],inside:[0,3.2,0]};
DOORS.apt1={inside:[-8.2,0,-Math.PI/2]};DOORS.apt2={inside:[5,1.4,Math.PI/2]};DOORS.apt3={inside:[5,1.4,Math.PI/2]};

function buildCity(){
  const L=makeLoc('city','out',0,0,[-139,-80,80,80]);BENCH_L=L;
  const st=new THREE.Group();L.g.add(st);L.dyn=new THREE.Group();L.g.add(L.dyn);L.ducks=[];
  GRASS_M=toon({color:'#86d36a',polygonOffset:true,polygonOffsetFactor:4,polygonOffsetUnits:8});const gr=new THREE.Mesh(new THREE.PlaneGeometry(800,800),GRASS_M);gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;gr.userData.keep=1;L.g.add(gr);   /* ❄️ GRASS_M turns white in snow (job 11) */
  const ROAD='#8c90b4',SIDE='#f3e7df',CURB='#ddcdd0',E=84,RX=[-50,0,50],RZ=[-50,0,50];
  const segs=(lo,hi,cuts,h)=>{let out=[[lo,hi]];for(const c of cuts){const nx=[];for(const [p,q] of out){if(c+h<=p||c-h>=q){nx.push([p,q]);continue;}if(c-h>p)nx.push([p,c-h]);if(c+h<q)nx.push([c+h,q]);}out=nx;}return out;};
  for(const z of RZ)flat(st,2*E,8,ROAD,0,.02,z);
  for(const x of RX)for(const [p,q] of segs(-E,E,RZ,4))flat(st,8,q-p,ROAD,x,.02,(p+q)/2);
  for(const z of RZ)for(const s of[-1,1])for(const [p,q] of segs(-E,E,RX,4)){flat(st,q-p,3,SIDE,(p+q)/2,.03,z+s*5.5);box(st,q-p,.16,.14,CURB,(p+q)/2,-.08,z+s*4,{ol:.015});}   /* kerbs reach into the ground: their outline's bottom showed through the pavement (a flickering line) */
  for(const x of RX)for(const s of[-1,1]){for(const [p,q] of segs(-E,E,RZ,7))flat(st,3,q-p,SIDE,x+s*5.5,.031,(p+q)/2);for(const [p,q] of segs(-E,E,RZ,4))box(st,.14,.16,q-p,CURB,x+s*4,-.08,(p+q)/2,{ol:.015});}
  for(let t=-E+1;t<=E-1;t+=3.2){for(const z of RZ)if(RX.every(x=>Math.abs(t-x)>8))box(st,1.4,.012,.16,'#ffffff',t,.03,z,{ol:false});for(const x of RX)if(RZ.every(z=>Math.abs(t-z)>8))box(st,.16,.012,1.4,'#ffffff',x,.03,t,{ol:false});}
  for(const xc of RX)for(const zc of RZ){for(let i=-3;i<=3;i++){const t=i*1.05;for(const s of[-1,1]){box(st,3,.012,.5,'#ffffff',xc+s*5.5,.033,zc+t,{ol:false});box(st,.5,.012,3,'#ffffff',xc+t,.035,zc+s*5.5,{ol:false});}}
    trafficLight(st,xc-4.6,zc-4.6,Math.PI/4);trafficLight(st,xc+4.6,zc+4.6,-Math.PI*3/4);colC(L,xc-4.6,zc-4.6,.12);colC(L,xc+4.6,zc+4.6,.12);}
  for(const s of[-1,1]){for(const z of RZ){if(z===0)continue;box(st,.4,.9,8.4,'#ffffff',s*(E-.2),0,z,{ol:.03});for(let k=-3;k<=3;k+=2)box(st,.42,.3,.9,'#ff6b6b',s*(E-.2),.45,z+k,{ol:false});}
    for(const x of RX){box(st,8.4,.9,.4,'#ffffff',x,0,s*(E-.2),{ol:.03});for(let k=-3;k<=3;k+=2)box(st,.9,.3,.42,'#ff6b6b',x+k,.45,s*(E-.2),{ol:false});}}
  const nearX=(t,arr)=>arr.some(c=>Math.abs(t-c)<8);
  /* 🌳 a few street trees and lamps stood right in front of a sign: moved a little (null = that tree is left out) */
  const NUDGE={'-1800,-475':[-21,-4.75],   /* (run 4, stage 3: the pavement tree that stood right in front of the Flower Corner's gate steps 3 m west) */
  '5475,1800':null,'-2400,-5455':[-20.5,-54.55],'-5455,-2400':[-54.55,-27],'-4545,-2400':[-45.45,-27]};
  for(let t=-78;t<=78;t+=6){if(nearX(t,[-50,0,50])||Math.abs(t)>79)continue;const lampHere=Math.abs(t%12)===0;
    for(const c of[-50,0,50])for(const s of[-1,1]){const pts=[[t,c+s*(lampHere?4.55:4.75)],[c+s*(lampHere?4.55:4.75),t]];
      for(let [px,pz] of pts){if(!lampHere&&px>63&&px<69&&pz>3.5&&pz<6)continue;const nu=NUDGE[Math.round(px*100)+','+Math.round(pz*100)];if(nu===null)continue;if(nu)[px,pz]=nu;if(lampHere){lampPost(st,px,pz);colC(L,px,pz,.16);}else{tree(st,px,pz,1);colC(L,px,pz,.26);}}}}
  // NW block: the Flower Corner (your house is on Friends Lane now), the neighbour, apartments
  flowerCorner(L,st);
  building(st,{x:-31,z:-15,w:7,d:7,h:3.6,wall:'#bff0dc',roof:'#6aa9ff',face:1,gable:true,door:{x:-31,c:'#ffd45c'}});col(L,-34.6,-18.6,-27.4,-11.4);
  building(st,{x:-22,z:-31,w:18,d:8,h:9.6,wall:'#ffd0b5',face:1,boxes:true,door:{x:-22,c:'#7cc8ff'}});col(L,-31.1,-35.1,-12.9,-26.9);
  // NE block: market, café, offices
  building(st,{x:18,z:-15,w:12,d:8,h:4.6,wall:'#fff1b8',face:1,shop:true,awning:'#ff7aa8',sign:'🍎 Market',door:{x:18,glass:true},win:SWIN});col(L,11.9,-19.1,24.1,-10.6);
  building(st,{x:32,z:-14,w:7,d:6,h:4.2,wall:'#ffd6e0',face:1,shop:true,awning:'#5fd4b0',sign:'☕ Café',door:{x:32,glass:true},win:SWIN});col(L,28.4,-17.1,35.6,-10.6);
  building(st,{x:23,z:-31,w:20,d:8,h:12.6,wall:'#c7e6ff',face:1,door:{x:23,c:'#b79cff'}});col(L,12.9,-35.1,33.1,-26.9);
  bench(st,27,-6.6,0);col(L,26.1,-6.95,27.9,-6.25);bin(st,25.5,-6.7);colC(L,25.5,-6.7,.3);
  // SE block: pet shop, flower shop, apartments
  building(st,{x:18,z:15,w:11,d:8,h:4.6,wall:'#c9f2e3',face:-1,shop:true,awning:'#ffd45c',sign:'🐾 Pet Shop',door:{x:18,glass:true},win:SWIN});col(L,12.4,10.6,23.6,19.1);
  building(st,{x:31.5,z:14,w:7,d:6,h:4.2,wall:'#e6dbff',face:-1,shop:true,awning:'#b79cff',sign:'🌷 Flower Shop',door:{x:31.5,glass:true},win:SWIN});col(L,27.9,10.6,35.1,17.1);
  building(st,{x:24,z:31,w:18,d:8,h:9.6,wall:'#ffe0c4',face:-1,boxes:true,door:{x:24,c:'#ff8a6b'}});col(L,14.9,26.9,33.1,35.1);
  hydrant(st,10.5,6.6);colC(L,10.5,6.6,.2);bench(st,-27,-7.4,0);col(L,-27.9,-7.75,-26.1,-7.05);
  // SW block: the park
  ironFence(st,-38.0,8.4,-24.2,8.4,L);ironFence(st,-19.8,8.4,-8.3,8.4,L);ironFence(st,-8.3,8.4,-8.3,19.4,L);ironFence(st,-8.3,24.6,-8.3,37.8,L);
  ironFence(st,-40.4,10.0,-40.4,38.6,L);ironFence(st,-38.6,40.6,-9.4,40.6,L);
  for(const [x,z] of [[-24.2,8.4],[-19.8,8.4],[-8.3,19.4],[-8.3,24.6]]){box(st,.5,1.6,.5,'#e9e0f7',x,0,z,{ol:.03});sph(st,.22,'#ff9ec4',x,1.8,z,{ws:10,hs:8});colC(L,x,z,.35);}
  disc(st,10,'#f6e2b8',-22,.024,22,{seg:56});flat(st,3,6,'#f6e2b8',-22,.023,11.2);flat(st,6,3,'#f6e2b8',-10.8,.023,22);
  for(const [a,b] of [[22,25],[23,26],[24,26]]){const A=WP[a],B=WP[b],len=Math.hypot(B[0]-A[0],B[1]-A[1]);flat(st,1.8,len,'#f6e2b8',(A[0]+B[0])/2,.022,(A[1]+B[1])/2,{ry:Math.atan2(B[0]-A[0],B[1]-A[1])});}
  const fx=-22,fz=22;buildFountain(st,L,fx,fz);
  L.benches=[];for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2,bx=fx+Math.cos(a)*9.6,bz=fz+Math.sin(a)*9.6,ry=Math.atan2(fx-bx,fz-bz);bench(st,bx,bz,ry);colC(L,bx,bz,.75);L.benches.push({x:bx,z:bz,ry,b:BENCHES[BENCHES.length-1]});}
  for(const [x,z] of [[-37.6,9.2],[-11.5,16],[-37.4,16.2],[-37.6,27.7],[-11.5,28],[-16,37.5],[-26,37.5],[-20,35.5],[-36,37.5],[-12.5,37.5]]){tree(st,x,z,1);colC(L,x,z,.28);}   /* (run 4, stage 3: the corner tree a metre further from the food truck: from the stage its crown sat right on the truck's cab) */
  foodTruck(st,L,TRUCK.x,TRUCK.z);   /* 🍔 the food truck, by the fountain benches */
  L.beds=[{id:'h1',x:-19.8,z:-10.6,ix:-19.8,iz:-9.9,yard:1},{id:'h2',x:-14.2,z:-10.6,ix:-14.2,iz:-9.9,yard:1}];   /* h1, h2: the flower beds in front of your house (on Friends Lane) */
  for(const [i,sx,sz] of [[1,1,-1],[2,-1,-1],[3,-1,1],[4,1,1]]){const x=fx+sx*8.84,z=fz+sz*8.84;flowerBed(st,x,z,1.8,1.0);col(L,x-.95,z-.55,x+.95,z+.55);RAISED.push({x,z,w:1.8,d:1.0,h:.22});L.beds.push({id:'p'+i,x,z,ix:x,iz:z+(sz>0?-.9:.9)});}
  bench(st,-13,34.6,Math.PI);bench(st,-10,34.6,Math.PI);col(L,-14,34.2,-9,35.1);
  // playground
  const sl=new THREE.Group();sl.position.set(-37.2,0,31.5);st.add(sl);
  box(sl,1.2,1.8,1.2,'#ffd45c',0,0,-1.6);for(let i=0;i<5;i++)box(sl,1,.06,.12,'#ffffff',0,.3+i*.32,-2.25,{ol:.015});
  const sp=new THREE.Group();sp.position.set(0,1.8,-1);sp.rotation.x=.58;sl.add(sp);box(sp,.9,.08,3.2,'#ff7aa8',0,0,1.6,{center:true});box(sp,.08,.25,3.2,'#ff7aa8',-.45,0,1.6,{center:true});box(sp,.08,.25,3.2,'#ff7aa8',.45,0,1.6,{center:true});
  col(L,-37.9,28.4,-36.5,33.8);
  const sw=new THREE.Group();sw.position.set(-29,0,37.4);st.add(sw);
  for(const s of[-1,1]){box(sw,.12,2.6,.12,'#7cc8ff',s*1.8,0,-.6,{rx:s*0+.22});box(sw,.12,2.6,.12,'#7cc8ff',s*1.8,0,.6,{rx:-.22});}
  cyl(sw,.07,.07,3.8,'#7cc8ff',0,2.5,0,{rz:Math.PI/2,center:true,seg:8});col(L,-31,36.6,-27,38.2);
  L.swings=[];for(const s of[-.8,.8]){const p=new THREE.Group();p.position.set(-29+s,2.45,37.4);L.dyn.add(p);box(p,.03,1.8,.03,'#3d2c5e',-.25,-1.85,0,{ol:false});box(p,.03,1.8,.03,'#3d2c5e',.25,-1.85,0,{ol:false});box(p,.6,.06,.3,'#ff8a6b',0,-1.95,0,{ol:.015});L.swings.push(p);}
  // 🏆 the Pet Show stage: west side of the park, facing the fountain
  {const SX=-36.5,SZ=22,TOP=.55;
    box(st,3.0,TOP,4.4,'#c98f5e',SX,0,SZ);box(st,2.92,.03,4.32,'#ff9ec4',SX,TOP,SZ,{ol:false});box(st,.45,.26,1.4,'#b97f4e',-34.77,0,SZ);
    cyl(st,.58,.58,.012,'#ffd45c',-36.15,TOP+.03,SZ,{seg:28,ol:false});
    for(const [x,z,c] of [[-37.3,20.3,'#7cc8ff'],[-37.45,21.45,'#ffd45c'],[-37.45,22.55,'#b79cff'],[-37.3,23.7,'#7fdcb5']])cyl(st,.3,.32,.07,c,x,TOP,z,{seg:16,ol:.015});
    box(st,.16,2.8,4.5,'#b79cff',-37.92,TOP,SZ);
    for(const s of[-1,1]){box(st,.14,2.65,.75,'#ff4d6d',-37.78,TOP+.02,SZ+s*1.82,{ol:.02});box(st,.16,.22,.8,'#ffd45c',-37.76,TOP+2.6,SZ+s*1.82,{ol:.015});}
    for(const z of[19.85,24.15]){cyl(st,.11,.13,3.75,'#ffd45c',-37.8,0,z,{seg:10});sph(st,.2,'#ffd45c',-37.8,3.85,z,{ws:10,hs:8});}
    for(let i=0;i<10;i++){const z=20.1+i*.44;cone(st,.13,.26,['#ff4d6d','#ffd45c','#7cc8ff','#7fdcb5','#b79cff'][i%5],-37.74,3.42,z,{rz:Math.PI,center:true,seg:3,ol:false,s:[.6,1,1]});}
    box(st,.03,.03,4.3,'#3d2c5e',-37.74,3.55,SZ,{ol:false});
    for(const [bx,z] of[[-34.6,19.95],[-34.6,24.05]]){box(st,.015,1.5,.015,'#ffffff',bx,TOP,z,{ol:false});   /* (run 4, stage 3: the balloons at the stage's front corners, never in front of the sign) */for(const [dx,dy,dz,c] of [[0,2.15,0,'#ff7aa8'],[.12,1.95,.14,'#ffd45c'],[-.1,1.98,-.12,'#7cc8ff']])sph(st,.17,c,bx+dx,dy,z+dz,{s:[1,1.18,1],ws:10,hs:8,ol:.015});}
    const sg=signPlane('🏆 Pet Show',2.8,.8,'#ffd45c','#3d2c5e',.13);   /* (2.8 m: clear of the pillars, which stand 1.45 m from the middle) */sg.position.set(-37.82,2.62,SZ);sg.rotation.y=Math.PI/2;L.g.add(sg);   /* 2 cm in front of the stage's back wall (run 4, job 5: it was flush with it) */
    const sg2=signPlane('Every Saturday!',1.9,.38,'#ffffff','#ff4d8d',.12);sg2.position.set(-37.82,1.98,SZ);sg2.rotation.y=Math.PI/2;L.g.add(sg2);
    box(st,.7,.74,3.3,'#ffffff',-32.75,0,SZ);box(st,.05,.62,3.34,'#ff4d6d',-33.12,.1,SZ,{ol:.015});box(st,.06,.06,3.36,'#ffd45c',-33.12,.7,SZ,{ol:false});
    for(const z of[21.05,22,22.95]){box(st,.44,.44,.44,'#9a6a43',-32.02,0,z);box(st,.48,.07,.48,'#ff9ec4',-32.02,.44,z,{ol:.012});box(st,.07,.62,.48,'#9a6a43',-31.76,.5,z);}
    col(L,-38.05,19.7,-34.5,24.3);col(L,-33.15,20.3,-31.7,23.7);
    inter(L,{x:-34.25,z:SZ,r:2.7,icon:'🏆',label:()=>psTargetLabel(),act:()=>openShow(),pri:()=>psOpen()&&!showDone()});}
  buildBoard(L,st);   /* 📌 the ideas board and a big old oak, just inside the park's north gate */
  busStopCity(L,st);   /* 🚌 the Beach Bus stop, just east of the park's north gate */
  /* ===== paved paths to every shop and front door ===== */
  {const PAV='#f6e9df',EDGE='#e2cfc4',pave=(x1,z1,x2,z2)=>{const w=Math.abs(x2-x1),d=Math.abs(z2-z1),cx=(x1+x2)/2,cz=(z1+z2)/2;flat(st,w,d,PAV,cx,.026,cz);
      for(let i=1;i<Math.floor(w/1.5);i++)box(st,.04,.004,d,EDGE,Math.min(x1,x2)+i*1.5,.026,cz,{ol:false});for(let i=1;i<Math.floor(d/1.5);i++)box(st,w,.004,.04,EDGE,cx,.026,Math.min(z1,z2)+i*1.5,{ol:false});};
    pave(11.5,-11,36,-7);pave(12,7,35.5,11);
    pave(-35.5,-11.4,-26.5,-7);
    pave(-22.8,-26.7,-7,-25);pave(7,-26.7,23.8,-25);pave(7,25,24.8,26.7);
    pave(-39,-59,-11,-57);
    for(const x of[13,25,37]){pave(x-1.1,-58,x+1.1,-57);pave(x-1.1,57,x+1.1,58);}
    pave(57,-37.5,59.6,-24.5);pave(57,-18.5,59.6,-9.5);pave(57,12.5,60,27.5);pave(57,32,59.1,40);pave(57,5.4,59.9,11.8);
    pave(-60,-33,-57,-17);pave(-61,22,-57,28);pave(-60,-16.5,-57,-8.5);
  }
  /* ===== new districts around the ring road ===== */
  // north: school and houses
  building(st,{x:-25,z:-64.5,w:28,d:11,h:7.2,wall:'#ffe7a3',trim:'#f2c66b',face:1,door:{x:-25,glass:true},skip:(lx,fl)=>fl>0&&Math.abs(lx)<4.4});col(L,-39.1,-70.1,-10.9,-58.9);
  {const s1=signPlane('🏫 Cozy Town School',7,1.0,'#ff7aa8','#ffffff');s1.position.set(-25,5.6,-58.84);L.g.add(s1);box(st,7.3,1.3,.1,'#ffffff',-25,5.0,-58.97);
   {const bd=new THREE.Group();bd.position.set(-22.4,0,-57.5);bd.rotation.y=-.25;L.g.add(bd);for(const sx of[-1.63,1.63])cyl(bd,.07,.08,3.78,'#8a5a3c',sx,0,0,{seg:8,ol:.012});box(bd,3.1,.84,.12,'#ffffff',0,2.88,0,{ol:.012});bake(bd,true);
    const s2=signPlane('🏫 Cozy Town School',2.9,.64,'#ff7aa8','#ffffff');s2.position.set(0,3.3,.1);bd.add(s2);colC(L,-22.4-1.58,-57.5-.40,.16);colC(L,-22.4+1.58,-57.5+.40,.16);}   /* 🏫 the school's name board on two tall posts, right of the door: the photographer's \"school sign\" (run 4, stage 3: the name over the door is too high for a photo from the pavement) */
   cyl(st,.06,.06,7,'#c8c8d8',-38,0,-57.6,{seg:6,ol:.012});box(st,1.4,.85,.04,'#ff7aa8',-37.28,6.0,-57.6,{ol:.012});colC(L,-38,-57.6,.15);}
  const HC=[['#ffd6e0','#ff7aa8'],['#c9f2e3','#5fa8ff'],['#fff1b8','#ff8a6b'],['#e6dbff','#9b7cf0'],['#d9e8ff','#ff9ec4'],['#ffe0c4','#5fd4b0']];
  [13,25,37].forEach((x,i)=>{const [w,r]=HC[i];building(st,{x,z:-61.5,w:8,d:7,h:3.6,wall:w,roof:r,face:1,gable:true,rh:2.4,door:{x,c:HOUSES[i].dc}});col(L,x-4.1,-65.1,x+4.1,-57.9);});
  // south: sports field and houses
  flat(st,30,19,'#79cf68',-25,.012,68.5);
  {const LN='#ffffff',ln=(w,d,x,z)=>box(st,w,.012,d,LN,x,.02,z,{ol:false});ln(28,.14,-25,59.6);ln(28,.14,-25,77.4);ln(.14,17.8,-39,68.5);ln(.14,17.8,-11,68.5);ln(.14,17.8,-25,68.5);
   const ring=new THREE.Mesh(new THREE.RingGeometry(2.6,2.75,40),mat(LN));ring.rotation.x=-Math.PI/2;ring.position.set(-25,.022,68.5);st.add(ring);
   ln(4,.14,-37,63.5);ln(4,.14,-37,73.5);ln(.14,10,-35,68.5);ln(4,.14,-13,63.5);ln(4,.14,-13,73.5);ln(.14,10,-15,68.5);
   for(const gx of[-39,-11]){const s=gx<-20?-1:1;for(const gz of[66.1,70.9]){box(st,.14,2.1,.14,LN,gx,0,gz,{ol:.02});colC(L,gx,gz,.2);box(st,.1,2.1,.1,'#e9e0f7',gx+s*1.2,0,gz,{ol:.015});colC(L,gx+s*1.2,gz,.15);}
     box(st,.14,.14,4.94,LN,gx,2.0,68.5,{ol:.02});box(st,1.2,.08,.08,'#e9e0f7',gx+s*.6,2.0,66.1,{ol:false});box(st,1.2,.08,.08,'#e9e0f7',gx+s*.6,2.0,70.9,{ol:false});
     const netM=(rx,ry)=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');x.fillStyle='rgba(255,255,255,.18)';x.fillRect(0,0,32,32);x.fillStyle='#ffffff';x.fillRect(0,0,32,3);x.fillRect(0,0,3,32);
       const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);return new THREE.MeshBasicMaterial({map:t,transparent:true,side:THREE.DoubleSide,depthWrite:false});};
     const net=new THREE.Mesh(new THREE.PlaneGeometry(4.8,2.0),netM(16,7));net.rotation.y=Math.PI/2;net.position.set(gx+s*1.2,1.0,68.5);net.userData.keep=1;L.g.add(net);
     // two side nets so the ball can't roll out the sides of the goal
     const sm=netM(4,7);for(const nz of[66.1,70.9]){const sn=new THREE.Mesh(new THREE.PlaneGeometry(1.2,2.0),sm);sn.position.set(gx+s*.6,1.0,nz);sn.userData.keep=1;L.g.add(sn);}
     col(L,Math.min(gx,gx+s*1.2)-.05,66.0,Math.max(gx,gx+s*1.2)+.05,66.2);col(L,Math.min(gx,gx+s*1.2)-.05,70.8,Math.max(gx,gx+s*1.2)+.05,71.0);col(L,gx+s*1.15,66,gx+s*1.25,71);}
   // scoreboard: left number = left team (Blue), right number = right team (Pink)
   for(const px of[-27.1,-22.9]){box(st,.22,3.9,.22,'#3d2c5e',px,0,57.7,{ol:.02});colC(L,px,57.7,.2);}
   box(st,4.6,2.1,.3,'#3d2c5e',-25,2.05,57.7,{ol:.03});box(st,4.8,.18,.42,'#ffd45c',-25,4.1,57.7,{ol:.02});
   {const c=document.createElement('canvas');c.width=512;c.height=224;const t=new THREE.CanvasTexture(c);t.anisotropy=4;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(4.3,1.88),new THREE.MeshBasicMaterial({map:t}));m.position.set(-25,3.1,57.87);m.userData.keep=1;L.g.add(m);
    L.score={c,t};drawScore();}
   inter(L,{x:-25,z:58.7,r:2.0,icon:'🔄',label:'Start a new match',act:newMatch,when:()=>!fbBoard()});
   for(const bx of[-35,-15]){bench(st,bx,58.6,Math.PI);col(L,bx-.9,58.3,bx+.9,58.95);}}
  BENCH_SKIP=1;for(const bx of FBB)bench(st,bx,FBZ,Math.PI);BENCH_SKIP=0;   /* 🧃 the football friends' team bench, across from the scoreboard (colliders: fbBuild) */
  L.ball={x:-25,z:68.5,vx:0,vz:0,g:null,cool:0};
  [13,25,37].forEach((x,i)=>{const [w,r]=HC[i+3];building(st,{x,z:61.5,w:8,d:7,h:3.6,wall:w,roof:r,face:-1,gable:true,rh:2.4,door:{x,c:HOUSES[i+3].dc}});col(L,x-4.1,57.9,x+4.1,65.1);});
  // east: toy store, bakery, library, ice cream (they face the ring road)
  bldAt(st,64,-31,-Math.PI/2,{w:12,d:9,h:4.6,wall:'#ffd6e0',shop:true,awning:'#7cc8ff',sign:'🧸 Toy Store',door:{x:0,glass:true},win:SWIN});col(L,59.1,-37.1,68.6,-24.9);
  bldAt(st,63,-14,-Math.PI/2,{w:8,d:7,h:4.4,wall:'#fff1b8',shop:true,awning:'#ffd45c',sign:'🥐 Bakery',door:{x:0,glass:true},win:SWIN});col(L,59.1,-18.1,66.6,-9.9);
  bldAt(st,65,20,-Math.PI/2,{w:14,d:10,h:6.6,wall:'#c7e6ff',door:{x:0,glass:true},win:SWIN});col(L,59.6,12.9,70.1,27.1);
  {const s1=signPlane('📚 Library',4,.8,'#5fa8ff','#ffffff');s1.position.set(59.9,3.4,20);s1.rotation.y=-Math.PI/2;L.g.add(s1);}
  bldAt(st,62,36,-Math.PI/2,{w:7,d:6,h:4.2,wall:'#e6dbff',shop:true,awning:'#ff9ec4',sign:'🍦 Ice Cream Shop',door:{x:0,glass:true},win:SWIN});col(L,58.6,32.4,65.1,39.6);
  {const p=bldAt(st,63,8.6,-Math.PI/2,{w:7,d:6,h:4.4,wall:'#ffe3cc',trim:'#f2b98f',shop:true,awning:'#ff6b6b',sign:'🍕 Pizzeria',door:{x:0,glass:true}});col(L,59.9,5.0,66.1,12.2);
   for(const sx of[-.55,.55])box(p,.12,1.1,.12,'#9a6a43',sx,4.85,1.3,{ol:.015});
   const pz=new THREE.Group();pz.position.set(0,6.55,1.36);pz.rotation.x=Math.PI/2;p.add(pz);
   cyl(pz,1.05,1.05,.14,'#e8a85c',0,0,0,{seg:28,center:true});cyl(pz,.88,.88,.04,'#ffd45c',0,.08,0,{seg:28,ol:false,center:true});
   for(let i=0;i<7;i++){const a=i/7*TAU+.4,r=i%2?.55:.32;cyl(pz,.13,.13,.03,'#d9483b',Math.cos(a)*r,.11,Math.sin(a)*r,{seg:12,ol:false,center:true});}
   cyl(pz,.13,.13,.03,'#d9483b',0,.11,0,{seg:12,ol:false,center:true});
   for(let i=0;i<5;i++){const a=i/5*TAU+1.1;box(pz,.09,.03,.09,'#5fbf74',Math.cos(a)*.7,.1,Math.sin(a)*.7,{ol:false,center:true});}}
  // west: fire station and apartments (they face the ring road)
  bldAt(st,-65,-25,Math.PI/2,{w:14,d:10,h:5.2,wall:'#ff6b6b',trim:'#d94b4b',door:{x:4.6,c:'#ffffff'},skip:(lx,fl)=>fl===0?(lx>-5.4&&lx<2.4):Math.abs(lx)<3.1});col(L,-70.1,-32.1,-59.6,-17.9);
  {const p=new THREE.Group();p.position.set(-59.9,0,-25);p.rotation.y=Math.PI/2;st.add(p);for(const gx of[-3.2,.2])box(p,2.8,3.1,.12,'#ffffff',gx,0,0,{ol:.02});for(const gx of[-3.2,.2])for(let k=1;k<5;k++)box(p,2.8,.05,.14,'#d8dcea',gx,k*.62,0,{ol:false});
   const s1=signPlane('🚒 Fire Station',4.6,.8,'#ffffff','#d94b4b');s1.position.set(0,4.2,.09);p.add(s1);}
  fireTruck(st,-58.4,-34,0);col(L,-59.5,-36.7,-57.3,-31.3);
  bldAt(st,-66,25,Math.PI/2,{w:20,d:10,h:9.6,wall:'#ffd0b5',boxes:true,door:{x:0,c:'#7cc8ff'}});col(L,-71.1,14.9,-60.6,35.1);
  bldAt(st,-63.5,-12.5,Math.PI/2,{w:8,d:7,h:4.4,wall:'#ffe3ef',shop:true,awning:'#b79cff',sign:'👗 Clothes Shop',door:{x:0,glass:true},win:SWIN});col(L,-67.1,-16.6,-59.6,-8.4);
  inter(L,{x:-59.2,z:-12.5,r:2.3,icon:'👗',label:'Go into the Clothes Shop',act:()=>enter('clothes')});
  bldAt(st,SALON.x,SALON.z,Math.PI/2,{w:8,d:7,h:4.4,wall:'#ffe6f5',shop:true,awning:'#ff9ec4',sign:'✂ Hair Salon',door:{x:0,glass:true},win:SWIN});col(L,-67.1,36.4,-59.6,44.6);   /* ✂️ the Hair Salon (job 15) */
  inter(L,{x:SALON.door[0],z:SALON.door[1],r:2.3,icon:'✂️',label:'Go into the Hair Salon',act:()=>enter('salon')});
  // south-east corner: a lake with a wooden pier you can walk out on (it points from the south-west shore to the middle)
  {const lx=69,lz=69,ux=Math.SQRT1_2,uz=Math.SQRT1_2,R0=8.1,S0=[lx-ux*R0,lz-uz*R0],at=(t,s)=>[S0[0]+ux*t+uz*s,S0[1]+uz*t-ux*s],RY=Math.PI/4,WD='#c98f5e',WD2='#9a6a43';
   disc(st,8.0,'#b9a98f',lx,.013,lz,{seg:48});disc(st,7.5,null,lx,.035,lz,{mat:WATER,seg:48});
   const r=seeded(8);for(let k=0;k<30;k++){const a=k/30*TAU+r()*.1,sz=r(),da=Math.abs(((a-Math.PI*1.25)%TAU+TAU*1.5)%TAU-Math.PI);if(da<.22)continue;sph(st,.25+sz*.15,pick(['#b8b4c4','#a7a3b5','#c8c4d6']),lx+Math.cos(a)*7.7,.05,lz+Math.sin(a)*7.7,{s:[1.2,.6,1],ws:8,hs:6,ol:.015});}
   {let [x,z]=at(2.25,0);box(st,1.5,.08,4.5,WD,x,.05,z,{ry:RY,ol:.015});[x,z]=at(5.8,0);box(st,2.6,.08,2.6,WD,x,.05,z,{ry:RY,ol:.015});
    for(let t=.3;t<7.05;t+=.3){const w=t<4.5?1.5:2.6;[x,z]=at(t,0);box(st,w,.012,.03,WD2,x,.13,z,{ry:RY,ol:false});}
    const post=(t,s,h)=>{const [x,z]=at(t,s);cyl(st,.07,.08,h||1.0,WD2,x,-.25,z,{seg:8,ol:.012});};
    for(const t of[.25,1.6,3.0,4.45])for(const s of[-.8,.8])post(t,s);for(const [t,s] of [[4.5,-1.35],[4.5,1.35],[5.8,-1.35],[5.8,1.35],[7.1,-1.35],[7.1,1.35],[7.1,0]])post(t,s);
    const rail=(t,s,len,cross)=>{const [x,z]=at(t,s);for(const y of[.4,.68])box(st,cross?len:.06,.06,cross?.06:len,WD,x,y,z,{ry:RY,ol:.01});};
    for(const s of[-.8,.8])rail(2.35,s,4.2);for(const s of[-1.35,1.35])rail(5.8,s,2.6);rail(7.1,0,2.76,true);for(const s of[-1.075,1.075])rail(4.5,s,.55,true);
    [x,z]=at(7.0,1.2);cyl(st,.045,.05,1.55,'#3d2c5e',x,.1,z,{seg:8,ol:.01});box(st,.24,.06,.24,'#3d2c5e',x,1.62,z,{ol:.01});sph(st,.11,null,x,1.55,z,{mat:GLOW,ol:false,ws:10,hs:8});
    [x,z]=at(7.19,0);const lr=new THREE.Mesh(new THREE.TorusGeometry(.22,.06,8,20),mat('#ff4d4d'));lr.position.set(x,.52,z);lr.rotation.y=RY;st.add(lr);for(let i=0;i<4;i++){const a=i/4*TAU+.4,[x2,z2]=at(7.2,Math.cos(a)*.22);box(st,.07,.07,.13,'#ffffff',x2,.49+Math.sin(a)*.22,z2,{ry:RY,ol:false});}
    [x,z]=at(-.5,1.15);cyl(st,.05,.05,1.3,WD2,x,0,z,{seg:8,ol:.01});const sg=signPlane('🦆 Duck Dock',1.25,.38,'#ffffff','#3d2c5e');sg.position.set(x-.0566,1.25,z-.0566);sg.rotation.y=Math.PI*1.25;L.g.add(sg);}   /* 8 cm in front of the post */
   for(const [dx,dz] of [[-1.5,2],[2,-1],[1,3],[3,1.5]]){disc(st,.4,'#5fbf74',lx+dx,.045,lz+dz,{seg:12});sph(st,.08,'#ff9ec4',lx+dx+.1,.1,lz+dz,{ws:8,hs:6,ol:.01});}
   LAKEW.length=0;for(const [t0,t1,hw] of [[-1.2,4.5,.76],[4.5,7.1,1.3]]){const a=at(t0,0);LAKEW.push({ax:L.ox+a[0],az:L.oz+a[1],ux,uz,len:t1-t0,hw});}
   L.cols.push({lk:1,cx:L.ox+lx,cz:L.oz+lz,cr:7.9,walk:LAKEW});
   bench(st,59.8,64.6,Math.atan2(9.2,4.4));colC(L,59.8,64.6,.7);   /* (run 4 finish: the bench faces the water; it faced along the shore) */inter(L,{x:61.4,z:61.4,r:2.4,icon:'🦆',label:'Feed the ducks',act:()=>feedDucks(1)});
   {const [x,z]=at(6.1,0);inter(L,{x,z,r:1.7,icon:'🦆',label:'Feed the ducks',act:()=>feedDucks(1)});}
   for(let k=0;k<3;k++){const d=new THREE.Group();L.dyn.add(d);const c=k===1?'#f7f2ec':'#ffe27a';sph(d,.17,c,0,.15,0,{s:[1,.75,1.35],ws:12,hs:8,ol:.02});sph(d,.1,c,0,.33,.17,{ws:10,hs:8,ol:.02});
     duckDress(d,c);L.ducks.push({g:d,a:k*2.1,r:2.5+k*1.6,sp:.18+k*.05,cx:lx,cz:lz});}}
  // things to do in the new districts
  inter(L,{x:-25,z:-58.2,r:2.2,icon:'🏫',label:'Go into Cozy Town School',act:()=>{qEvent('school');enter('school');}});
  for(const h of HOUSES){const a=h.ry;
    if(isApt(h.id))inter(L,{x:h.x+Math.sin(a)*.8,z:h.z+Math.cos(a)*.8,r:2,icon:'🏢',label:()=>dlCarrying()?'Go inside to deliver 🍕':dsGoing(h.id)?'Go inside to decorate 🎨':'Go inside',pri:()=>dlCarrying()||dsGoing(h.id),act:()=>enterApt(h.id)});
    else inter(L,{x:h.x+Math.sin(a)*.8,z:h.z+Math.cos(a)*.8,r:2,icon:()=>dsGoing(h.id)&&!dlCarrying()?'🎨':'🚪',label:()=>dlCarrying()?'Knock and deliver 🍕':dsGoing(h.id)?'Go in and decorate 🎨':'Knock on the door',pri:()=>dlCarrying()||dsGoing(h.id),act:()=>knock(h.id)});}
  inter(L,{x:58.7,z:-31,r:2.4,icon:'🧸',label:'Go into the Toy Store',act:()=>enter('toys')});
  inter(L,{x:58.7,z:-14,r:2.3,icon:'🥐',label:'Go into the Bakery',act:()=>enter('bakery')});
  inter(L,{x:59.2,z:20,r:2.3,icon:'📚',label:'Go into the Library',act:()=>enter('library')});
  inter(L,{x:58.4,z:36,r:2.3,icon:'🍦',label:'Go into the Ice Cream Shop',act:()=>enter('icecream')});
  inter(L,{x:59.2,z:8.6,r:2.3,icon:'🍕',label:'Go into the Pizzeria',act:()=>enter('pizza')});
  inter(L,{x:-59.2,z:-29.6,r:2.1,icon:'🚒',label:'Go into the Fire Station',act:()=>enter('fire')});
  inter(L,{x:-59.2,z:-23.5,r:2.2,icon:'🚒',label:'Say hi to the firefighters',act:()=>{SFX.talk();qEvent('fire');toast(pick(['The firefighters wave at you! 👋','“Remember, never play with matches!” 🔥','They let you ring the big shiny bell! 🔔 Finn would love this!']),3.2);}});
  for(const [a,b] of TRAIL){const A=WP[a],B=WP[b],len=Math.hypot(B[0]-A[0],B[1]-A[1]);flat(st,1.5,len+1.5,'#e6d2a8',(A[0]+B[0])/2,.012,(A[1]+B[1])/2,{ry:Math.atan2(B[0]-A[0],B[1]-A[1])});}
  const px=36.2,pz=-36.2;disc(st,2.25,'#b9a98f',px,.013,pz,{seg:32});disc(st,1.95,null,px,.035,pz,{mat:WATER,seg:32});
  {const r=seeded(4);for(let k=0;k<14;k++){const a=k/14*TAU+r()*.2,sr=.16+r()*.1,sx=px+Math.cos(a)*2.05,sz=pz+Math.sin(a)*2.05;
      sph(st,sr,pick(['#b8b4c4','#a7a3b5','#c8c4d6']),sx,sr*.5,sz,{s:[1.2,.6,1],ws:8,hs:6,ol:.015});   /* (resting on the ground, not half buried: a buried stone's outline showed loose slivers; run 4, stage 3) */}
    {const rd=new THREE.Group();st.add(rd);for(let k=0;k<9;k++){const a=1.9+k*.12+r()*.05,d=1.55+r()*.3;const h=.7+r()*.4;r();cyl(rd,.018,.018,h,'#5fae64',px+Math.cos(a)*d,0,pz+Math.sin(a)*d,{seg:5,ol:false});sph(rd,.04,'#9b6b4a',px+Math.cos(a)*d,h+.05,pz+Math.sin(a)*d,{s:[1,2.2,1],ws:6,hs:5,ol:false});}bake(rd,false);rd.userData.keep=1;}   /* (run 4 finish: the thin reeds cast no shadow: on the water theirs broke into blotches) */
    for(const [dx,dz] of [[-.8,.3],[.4,.9],[.7,-.6]]){disc(st,.26,'#5fbf74',px+dx,.045,pz+dz,{seg:12});sph(st,.06,'#ff9ec4',px+dx+.05,.08,pz+dz,{ws:8,hs:6,ol:.01});}}
  colC(L,px,pz,2.2);L.pondC=L.cols[L.cols.length-1];inter(L,{x:33.9,z:-38.3,r:2.3,icon:'🦆',label:'Feed the ducks',act:()=>feedDucks(0)});bench(st,32.6,-36.4,Math.PI/2+.4);colC(L,32.6,-36.4,.7);
  for(let k=0;k<2;k++){const d=new THREE.Group();L.dyn.add(d);sph(d,.17,k?'#f7f2ec':'#ffe27a',0,.15,0,{s:[1,.75,1.35],ws:12,hs:8,ol:.02});sph(d,.1,k?'#f7f2ec':'#ffe27a',0,.33,.17,{ws:10,hs:8,ol:.02});
    duckDress(d,k?'#f7f2ec':'#ffe27a');L.ducks.push({g:d,a:k*Math.PI,r:.9+k*.35,sp:.32+k*.1});}
  /* 🏖️ the gate to the beach, at the east end of the big road (just to look at now: the 🚌 Beach Bus takes you there) */
  {const GX=79.4;for(const s of[-1,1]){box(st,.3,3.9,.3,'#ffffff',GX,0,s*3.3,{ol:.03});sph(st,.28,'#ffd45c',GX,4.15,s*3.3,{ws:10,hs:8});colC(L,GX,s*3.3,.25);}
   box(st,.24,.95,7.0,'#2b8fc4',GX,3.0,0,{ol:.03});flat(st,4,7.2,'#f6dfa9',81.6,.045,0);flat(st,14,4.6,'#f6dfa9',90.6,.045,0);
   for(const [x,z,ry] of [[77.6,-8.6,-.4],[77.4,8.8,2.8]]){palm(st,x,z,1.05,.3,ry);colC(L,x,z,.3);}
   const sg=signPlane('🏖 To the beach',6.4,.8,'#2b8fc4','#ffffff');sg.position.set(GX-.14,3.475,0);sg.rotation.y=-Math.PI/2;L.g.add(sg);
   inter(L,{x:GX-1.5,z:0,r:1.6,rect:{x1:GX-3.4,z1:-2.6,x2:GX-.2,z2:2.6},icon:'🚌',label:'Find the beach bus',act:busGate});}
  /* 🌲 the gate to the Tree Park, in the woods behind the Toy Store (run 4, job 16): a wooden gate with a sign and a few trees; the park itself is its own place */
  {const GX=74,GZ=-38;for(const s of[-1,1]){box(st,.3,3.6,.3,'#8f6244',GX,0,GZ+s*1.9,{ol:.03});sph(st,.27,'#5fd4b0',GX,3.85,GZ+s*1.9,{ws:10,hs:8});colC(L,GX,GZ+s*1.9,.25);}
   box(st,.24,.7,4.3,'#8f6244',GX,3.0,GZ,{ol:.03});flat(st,4.4,3.2,'#d9b98a',GX-2.2,.045,GZ);flat(st,6,2.4,'#d9b98a',GX+3,.044,GZ);disc(st,1.2,'#d9b98a',GX+6,.043,GZ);   /* (the path goes on through the gate: run 4, stage 3; its far end is round: run 4 finish, it stopped in a straight edge) */
   const sg=signPlane('🌲 Tree Park',3.8,.56,'#8f6244','#ffffff');sg.position.set(GX-.14,3.35,GZ);sg.rotation.y=-Math.PI/2;L.g.add(sg);
   for(const [x,z,s] of [[76.6,-41.2,1.2],[77.0,-34.6,1.15],[70.6,-33.4,1.0],[80.6,-42.4,1.3]]){tree(st,x,z,s);colC(L,x,z,.3);}   /* (the big tree behind the gate stepped aside: it stood dead centre in the gateway) */
   inter(L,{x:GX-1.6,z:GZ,r:1.8,rect:{x1:GX-3.6,z1:GZ-2.3,x2:GX-.2,z2:GZ+2.3},icon:'🌲',label:'Climb into the Tree Park',act:()=>enter('treepark')});}
  // scatter nature along the edges of town, away from paths and buildings
  {const r=seeded(77);let placed=0;
    const free=(x,z,rad)=>{if(x>63&&x<82&&z>-41&&z<-35)return false;   /* (run 4, stage 3: the Tree Park's gate path stays clear) */if(Math.abs(x)<8.5||Math.abs(z)<8.5||Math.abs(x)>79.3||Math.abs(z)>79.3)return false;if(Math.abs(Math.abs(x)-50)<8.5||Math.abs(Math.abs(z)-50)<8.5)return false;if(x>-41&&x<-9&&z>58&&z<79)return false;if(x>-23.5&&x<-10&&z>-25&&z<-8)return false;for(const c of L.cols)if(pushOut(x,z,rad+.4,c))return false;for(const [a,b] of WE)if(segDist(x,z,WP[a],WP[b])<rad+1.1)return false;return true;};
    for(let tries=0;tries<2600&&placed<190;tries++){const edge=r();let x,z,forest=false;if(edge<.15){x=-40+r()*80;z=33+r()*7;}else if(edge<.3){x=-40+r()*80;z=-40+r()*7;}else if(edge<.38){x=33+r()*7;z=-40+r()*80;}else if(edge<.46){x=-40+r()*7;z=-40+r()*80;}
        else{x=(r()<.5?-1:1)*(57+r()*23);z=-80+r()*160;if(r()<.5){const t=x;x=z;z=t;}forest=Math.abs(x)>57&&Math.abs(z)>57;}
      let kind=r();if(forest&&kind<.75)kind=.9;
      if(kind<.3){if(!free(x,z,.6))continue;const c=pick(['#5fbf74','#6cc97c','#4fae64']);sph(st,.5,c,x,.35,z,{ws:10,hs:8});sph(st,.38,c,x+.4,.28,z+.15,{ws:10,hs:8});sph(st,.34,c,x-.3,.25,z-.2,{ws:10,hs:8});if(r()<.5)for(let k=0;k<4;k++)sph(st,.05,pick(['#ff7aa8','#ffffff','#ffd45c']),x+r()*.6-.3,.72,z+r()*.5-.25,{ws:6,hs:5,ol:.01});colC(L,x,z,.6);}
      else if(kind<.45){if(!free(x,z,.4))continue;sph(st,.35+r()*.2,pick(['#b8b4c4','#a7a3b5','#c8c4d6']),x,.1,z,{s:[1.3,.7,1],ws:9,hs:7});colC(L,x,z,.45);}
      else if(kind<.65){if(!free(x,z,.3))continue;const n=3+(r()*4|0);for(let k=0;k<n;k++){const fx=x+r()*1.2-.6,fz=z+r()*1.2-.6;cyl(st,.014,.014,.26,'#4fae5c',fx,0,fz,{seg:4,ol:false});sph(st,.07,pick(['#ff7aa8','#ffd45c','#ffffff','#b79cff','#ff8a6b']),fx,.3,fz,{ws:7,hs:5,ol:.01});}}
      else if(kind<.78){if(!free(x,z,.3))continue;for(let k=0;k<3;k++){const mx=x+r()*.6-.3,mz=z+r()*.6-.3,h=.12+r()*.12;cyl(st,.035,.045,h,'#fff4e0',mx,0,mz,{seg:6,ol:.01});sph(st,.1,'#ff5d6c',mx,h,mz,{s:[1,.6,1],ws:8,hs:6,ol:.012});}}
      else{if(!free(x,z,1.3))continue;tree(st,x,z,1+r()*.3);colC(L,x,z,.3);}
      placed++;}}
  /* (the little bridge over the duck pond went in run 4, item 3: the pond is solid water all round again) */
  buildLane(L,st);buildClosedSigns(L);buildGrandmas(L,st);   /* 👵 grandmas on benches by the town houses */
  buildForest(L,st);buildWild(L);   /* 🌲 the forest belt and the tree groups; 🦋 butterflies, birds and owls */
  bake(st,true,32);
  L.g.add(glowMesh(glowGeo(LAMPXZ.flatMap(([x,z])=>[[x,3.21,z,.8,[.5,.38,.18]],[x,.1,z,4.4,4.4,[.3,.23,.11]]]))));
  buildFlies(L);   /* ✨ fireflies in the park at night */
  // doors and things to use
  inter(L,{x:18,z:-10.1,r:2.4,icon:'🛒',label:'Go into the Market',act:()=>enter('market')});
  inter(L,{x:18,z:10.1,r:2.4,icon:'🐾',label:'Go into the Pet Shop',act:()=>enter('pets')});
  inter(L,{x:32,z:-10.1,r:2.3,icon:'☕',label:'Go into the Café',act:()=>enter('cafe')});
  inter(L,{x:31.5,z:10.1,r:2.3,icon:'🌷',label:'Go into the Flower Shop',act:()=>enter('flowers')});
  for(const [dx,dz] of [[0,5.3],[0,-5.3],[5.3,0],[-5.3,0]])inter(L,{x:fx+dx,z:fz+dz,r:2.2,icon:'✨',label:'Make a wish (1 🪙)',act:wish});
  L.swings.forEach((s,i)=>inter(L,{x:s.position.x,z:36.1,r:1.5,icon:'🎠',label:'Go on the swing',act:()=>startSwing(i)}));
  inter(L,{x:-37.2,z:28.1,r:1.8,icon:'🛝',label:'Go down the slide',act:startSlide});
  for(const b of L.beds){const t=inter(L,{x:b.ix,z:b.iz,r:1.9,icon:'💧',label:()=>S&&S.water&&S.water[b.id]===S.day?'These flowers are happy today':'Water the flowers',act:()=>waterBed(b)});if(b.yard)yardInt(t,b);}
  return L;
}

/* ===== 🏖️ the beach: a new place behind the gate at the east end of the big road. The 🚌 Beach Bus takes you there ===== */
/* it sits far east of town: an old version shows a friend who is at the beach "in town" out here, too far away to see */
const BEACH_X=1000,BEACH={u:{value:0},foam:null,gulls:[],crabs:[],clouds:[],castle:null,stage:0,shells:[],day:-1};
const SHELL_SPOTS=[[-10,-17],[-1,-16.5],[6.5,-9],[9.5,-2],[7.5,4.5],[10,11],[1.5,14.5],[-6,18],[-19,4.5],[-15.5,-4],[-4,-4],[9,16.5],[-21,-19],[3.5,-20],[-9,9]];
function bch(){return S.beach||(S.beach={});}
/* a palm tree: a bendy trunk and a crown of leaves (lean = how much it bends) */
function palm(g,x,z,s=1,lean=.25,ry=0){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);let px=0,py=0;
  for(let i=0;i<5;i++){const h=.95*s,a=lean*(i+1)*.18;cyl(p,(.15-i*.016)*s,(.18-i*.016)*s,h,'#b98a5e',px+Math.sin(a)*h/2,py+Math.cos(a)*h/2,0,{rz:-a,center:true,seg:7,ol:.02});px+=Math.sin(a)*h;py+=Math.cos(a)*h;}
  for(let i=0;i<7;i++){const a=i/7*TAU;sph(p,.95*s,i%2?'#4fb86a':'#62c878',px+Math.cos(a)*.78*s,py-.12*s,Math.sin(a)*.78*s,{s:[1,.16,.36],ry:-a,rz:-.35,ws:8,hs:5,ol:.03});}
  for(let i=0;i<3;i++){const a=i/3*TAU+.5;sph(p,.13*s,'#8a5a36',px+Math.cos(a)*.2*s,py-.25*s,Math.sin(a)*.2*s,{ws:7,hs:5,ol:.012});}}
function parasol(g,x,z,c){cyl(g,.04,.04,2.3,'#ffffff',x,0,z,{seg:6,ol:.01});cone(g,1.35,.55,c,x,1.95,z,{seg:10,ol:.03});cone(g,.5,.24,'#ffffff',x,2.4,z,{seg:10,ol:.015});}
function towel(g,x,z,c){flat(g,1.0,1.9,c,x,.02,z);for(const s of[-1,1])flat(g,1.0,.2,'#ffffff',x,.024,z+s*.6);}
function buildBeach(){
  const L=makeLoc('beach','out',BEACH_X,0,[-34.3,-22,25,44]);const st=new THREE.Group();L.g.add(st);BENCH_L=L;
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(1400,1400),toon({color:'#f6dfa9',polygonOffset:true,polygonOffsetFactor:4,polygonOffsetUnits:8}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;gr.userData.keep=1;L.g.add(gr);
  /* the sea: one big flat mesh; a tiny shader adds slow ripples and sparkles */
  const seaM=toon({color:'#46c0ea',emissive:new THREE.Color('#1f86c9'),emissiveIntensity:.28});BEACH.seaM=seaM;
  seaM.onBeforeCompile=sh=>{sh.uniforms.uT=BEACH.u;
    sh.vertexShader='varying vec3 vW;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvW=(modelMatrix*vec4(transformed,1.0)).xyz;');
    sh.fragmentShader='uniform float uT;varying vec3 vW;\n'+sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat bw=sin(vW.x*.5+uT*1.1+sin(vW.z*.21+uT*.35)*2.2)*.5+.5;float sp=smoothstep(.9,1.,sin(vW.x*1.9-uT*1.7+vW.z*.7)*sin(vW.z*1.4+uT*1.2+vW.x*.3));diffuseColor.rgb=diffuseColor.rgb*(.94+bw*.12)+sp*.3;');};
  const sea=new THREE.Mesh(new THREE.PlaneGeometry(1400,1400),seaM);sea.rotation.x=-Math.PI/2;sea.position.set(711.6,.07,0);sea.userData.keep=1;L.g.add(sea);
  const foam=new THREE.Mesh(new THREE.PlaneGeometry(1.1,400),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.5,depthWrite:false}));foam.rotation.x=-Math.PI/2;foam.position.set(11.4,.1,0);foam.userData.keep=1;L.g.add(foam);BEACH.foam=foam;
  flat(st,2.4,400,'#e9c88f',10.6,.006,0);
  /* land behind the dunes, far hills, clouds */
  flat(st,163.6,1400,'#8fd47a',-119.2,.008,0);for(const s of[-1,1])flat(st,2.6,697.7,'#8fd47a',-32.3,.008,s*351.15);flat(st,3.2,90,'#efd6a0',-46,.012,0);   /* (never under the bus road or the sandy step: they lie right on the sand, so they can't swap places) */
  for(const s of[-1,1])box(st,.9,1.0,19.4,'#5fbf74',-31.1,0,s*12.3,{ol:.03});
  const hl=new THREE.Group();L.g.add(hl);for(let i=0;i<9;i++)sph(hl,rand(30,46),pick(['#86d37c','#79c973','#93dc85']),-130-rand(0,40),-rand(6,12),-200+i*50,{ol:.9,ws:16,hs:9,s:[1,.5,1]});
  for(const [x,z,s] of [[-40,-14,1.3],[-44,9,1.4],[-52,-30,1.5],[-49,26,1.3],[-60,-2,1.6]])palm(hl,x,z,s,.2,rand(0,TAU));bake(hl,false);
  for(let i=0;i<6;i++){const c=new THREE.Group();const n=3+(i%3);for(let k=0;k<n;k++)sph(c,rand(5,8),null,k*6.5-n*3.2,rand(-1.5,1.5),rand(-3,3),{mat:CLOUD,ol:false,ws:12,hs:8,s:[1,.68,1]});
    c.position.set(rand(50,300),rand(52,76),rand(-200,200));c.userData.sp=rand(.6,1.4);bake(c,false);L.g.add(c);BEACH.clouds.push(c);}
  /* the boardwalk from the gate, and the gate back to town */
  for(let i=0;i<5;i++)box(st,2.2,.06,2,'#e2bd8f',-28.9+i*2.2,.015,0,{ol:.012});for(let x=-29.6;x<-19;x+=.55)box(st,.03,.01,2,'#b98a5e',x,.075,0,{ol:false});   /* (in 5 short pieces, lifted off the sand: no flicker at night) */
  for(const s of[-1,1]){box(st,.3,3.4,.3,'#ffffff',-29.2,0,s*2.2,{ol:.03});sph(st,.26,'#ff7aa8',-29.2,3.62,s*2.2,{ws:10,hs:8});colC(L,-29.2,s*2.2,.25);}
  box(st,.22,.8,4.9,'#ff7aa8',-29.2,2.75,0,{ol:.03});
  {const sg=signPlane('🏘 To town',4.4,.66,'#ff7aa8','#ffffff');sg.position.set(-29.07,3.15,0);sg.rotation.y=Math.PI/2;L.g.add(sg);}
  for(const s of[-1,1]){cyl(st,.05,.06,2.05,'#5a5f8c',-20.6,0,s*1.5,{seg:6,ol:.012});sph(st,.15,null,-20.6,2.16,s*1.5,{mat:LAMP,ol:.015,ws:10,hs:8});colC(L,-20.6,s*1.5,.12);}   /* (globes above your eyes: never a big white blob right in your face) */
  inter(L,{x:-27.8,z:0,r:2.4,icon:'🚌',label:()=>busReady('beach')?'The bus is here!':'When does the bus come?',act:()=>busInfo('beach')});
  /* palm trees, umbrellas and towels */
  for(const [x,z,s,ry] of [[-26,-8,1.1,.4],[-24.5,9,1.2,2.6],[-27,17,1,1.5],[-25.5,-18,1.15,-.6],[-12,-20.5,1.05,1.2],[1,20.5,1.1,-1.9],[-17,20,.95,2],[-19,-13,1,3]]){palm(st,x,z,s,.28,ry);colC(L,x,z,.3);}
  for(const [x,z,c,tc] of [[-7,-11,'#ff7aa8','#7cc8ff'],[5.5,9,'#7cc8ff','#ffd45c'],[-17.5,-6,'#ffd45c','#ff7aa8']]){parasol(st,x,z,c);colC(L,x,z,.15);towel(st,x+1.3,z+.4,tc);}
  /* the kiosk: cold treats for coins */
  {const KX=-13,KZ=14;box(st,3.6,2.3,2.4,'#fff1b8',KX,0,KZ+.3);box(st,3.9,.18,2.9,'#ffffff',KX,2.3,KZ+.3,{ol:.02});
   for(let i=0;i<6;i++)box(st,.65,.08,1.0,i%2?'#ffffff':'#ff7aa8',KX-1.625+i*.65,2.0,KZ-1.25,{rx:-.35,ol:.012});
   box(st,3.7,1.05,.5,'#7cc8ff',KX,0,KZ-1.05);box(st,3.8,.08,.62,'#ffffff',KX,1.05,KZ-1.05,{ol:.015});
   sph(st,.17,'#8a5a36',KX-1.2,1.3,KZ-1.05,{ws:10,hs:8,ol:.015});cyl(st,.015,.015,.3,'#ff7aa8',KX-1.1,1.42,KZ-1.05,{rz:-.3,seg:5,ol:false});
   for(const [dx,c] of [[-.4,'#ff9ec4'],[-.15,'#ffd45c'],[.1,'#7fdcb5']]){box(st,.12,.26,.05,c,KX+dx,1.22,KZ-1.05,{ol:.01});box(st,.025,.12,.025,'#e6d2a8',KX+dx,1.1,KZ-1.05,{ol:false});}
   sph(st,.2,'#ff6b6b',KX+1.05,1.3,KZ-1.05,{s:[1,.82,1],ws:10,hs:8,ol:.015});
   box(st,2.75,.78,.08,'#ffffff',KX,2.46,KZ-1.12,{ol:.02});{const sg=signPlane('🍧 Kiosk',2.6,.66,'#ff7aa8','#ffffff');sg.position.set(KX,2.85,KZ-1.17);sg.rotation.y=Math.PI;L.g.add(sg);}
   cyl(st,.05,.06,2.4,'#5a5f8c',KX+2.15,0,KZ-1.2,{seg:6,ol:.012});sph(st,.16,null,KX+2.15,2.5,KZ-1.2,{mat:LAMP,ol:.015,ws:10,hs:8});
   col(L,KX-1.95,KZ-1.35,KX+1.95,KZ+1.6);colC(L,KX+2.15,KZ-1.2,.12);
   inter(L,{x:KX,z:KZ-2.4,r:2.4,icon:'🍧',label:'Buy a cold treat',act:()=>openShop('beach')});}
  /* the wooden pier out into the sea */
  {const PZ=-14,WD='#c98f5e',WD2='#9a6a43';box(st,16.6,.1,2.4,WD,16.7,.04,PZ,{ol:.015});for(let x=9;x<25;x+=.42)box(st,.03,.012,2.4,WD2,x,.14,PZ,{ol:false});
   for(let x=11.8;x<=24.6;x+=3.2)for(const s of[-1,1])cyl(st,.09,.1,1.2,WD2,x,-.5,PZ+s*1.1,{seg:8,ol:.012});
   for(const s of[-1,1]){for(const y of[.45,.78])box(st,13.3,.06,.06,WD,18.25,y,PZ+s*1.15,{ol:.01});for(let x=11.6;x<25;x+=1.65)box(st,.07,.85,.07,WD,x,0,PZ+s*1.15,{ol:.01});}
   for(const y of[.45,.78])box(st,.06,.06,2.36,WD,24.9,y,PZ,{ol:.01});
   const lr=new THREE.Mesh(new THREE.TorusGeometry(.24,.065,8,20),mat('#ff4d4d'));lr.position.set(24.98,.6,PZ+.6);lr.rotation.y=Math.PI/2;st.add(lr);
   cyl(st,.05,.06,1.5,'#5a5f8c',24.6,0,PZ-.9,{seg:6,ol:.012});sph(st,.15,null,24.6,1.6,PZ-.9,{mat:LAMP,ol:.015,ws:10,hs:8});
   col(L,11.6,-22,25,PZ-1.25);col(L,11.6,PZ+1.25,25,22);
   inter(L,{x:24.2,z:PZ,r:2.2,icon:'🐬',label:'Look out to sea',act:()=>{SFX.pop();toast(pick(['🐬 A dolphin jumps far away! Splash!','⛵ A little sailboat glides by. Wave hello! 👋','🐟 Tiny silver fish swim under the pier.','🌊 Swish… swoosh… the waves are so calm.','🦀 A crab waves its claw at you from the rocks!']),3.2);}});}
  /* rocks at both ends */
  for(const [x,z,s] of [[7.5,-19.5,1],[9.5,-20.6,.8],[10.8,-18.4,.6],[8.6,18.6,.9],[10.4,19.8,.7],[6.4,20.4,.5]]){sph(st,.7*s,pick(['#b8b4c4','#a7a3b5','#c8c4d6']),x,.15*s,z,{s:[1.3,.75,1.1],ws:10,hs:7,ol:.03});colC(L,x,z,.85*s);}
  /* a bench facing the sea */
  bench(st,3,-7,Math.PI/2);colC(L,3,-7,.75);   /* (2 seats, like every bench) */
  busStopBeach(L,st);   /* 🚌 the bus stop by the gate and a ⛺ camp spot */
  buildCourt(L,st);
  bake(st,true,32);
  /* the sand castle: every tap adds a part */
  {const C=new THREE.Group();C.position.set(-2,0,3);L.g.add(C);const SD='#e9c88f',SD2='#dcb878',parts=[];for(let i=0;i<6;i++){const p=new THREE.Group();C.add(p);parts.push(p);}
   disc(parts[0],1.7,'#efd29c',0,.01,0,{seg:24});cyl(parts[0],.2,.15,.3,'#ff6b6b',1.75,0,.9,{seg:10,ol:.015});box(parts[0],.06,.36,.04,'#7cc8ff',1.95,0,.45,{rz:.4,ol:.01});box(parts[0],.16,.16,.03,'#7cc8ff',2.03,0,.45,{ol:.01});
   cyl(parts[1],1.1,1.3,.35,SD,0,0,0,{seg:20,ol:.025});
   for(const [x,z] of [[-.72,-.72],[.72,-.72],[-.72,.72],[.72,.72]]){cyl(parts[2],.26,.3,.6,SD2,x,.35,z,{seg:10,ol:.02});for(let k=0;k<4;k++){const a=k/4*TAU;box(parts[2],.1,.1,.1,SD2,x+Math.cos(a)*.18,.95,z+Math.sin(a)*.18,{ol:.01});}}
   cyl(parts[3],.42,.48,.95,SD,0,.35,0,{seg:14,ol:.02});cone(parts[3],.5,.45,SD2,0,1.3,0,{seg:14,ol:.02});
   for(const [x,z,w,d] of [[0,-.72,1.1,.14],[0,.72,1.1,.14],[-.72,0,.14,1.1],[.72,0,.14,1.1]])box(parts[4],w,.32,d,SD2,x,.35,z,{ol:.015});
   {const m=new THREE.Mesh(new THREE.RingGeometry(1.32,1.55,28),WATER);m.rotation.x=-Math.PI/2;m.position.y=.03;parts[4].add(m);m.userData.keep=1;}
   cyl(parts[5],.02,.02,.7,'#9a6a43',0,1.7,0,{seg:5,ol:false});box(parts[5],.36,.22,.02,'#ff4d6d',.19,2.15,0,{ol:.01});
   for(const [x,z,c] of [[0,-.8,'#ffc2d6'],[-.8,0,'#fff4ea'],[.8,0,'#e6dbff']])sph(parts[5],.07,c,x,.7,z,{s:[1,.5,1],ws:8,hs:5,ol:.01});
   for(const p of parts)bake(p,true);colC(L,-2,3,1.15);BEACH.castle={C,parts,x:L.ox-2,z:L.oz+3};castleShow();
   inter(L,{x:-2,z:3,r:2.7,icon:()=>BEACH.stage>=5?'🌊':'🏰',label:()=>BEACH.stage>=5?'Start a new sand castle':BEACH.stage?'Build the sand castle':'Build a sand castle',act:castleTap});}
  /* shells: a few new ones every day */
  for(let i=0;i<5;i++){const g=new THREE.Group();L.g.add(g);const c=['#ffc2d6','#fff4ea','#ffd9b8','#e6dbff','#ffe27a'][i];
    sph(g,.2,c,0,.04,0,{s:[1,.38,.85],ws:10,hs:6,ol:.014});for(let k=-1;k<=1;k++)box(g,.02,.03,.3,shade(c,-.12),k*.09,.08,.02,{ry:k*.3,ol:false});cone(g,.07,.1,shade(c,-.08),0,0,-.17,{rx:-Math.PI/2,center:true,seg:6,ol:.01});
    bake(g,true);const t=inter(L,{x:0,z:0,r:1.4,icon:'🐚',label:'Pick up the shell',act:()=>pickShell(i),when:()=>g.visible});BEACH.shells.push({g,t});}
  /* little friends: crabs on the wet sand, seagulls over the sea */
  for(let i=0;i<2;i++){const c=new THREE.Group();L.g.add(c);sph(c,.17,'#ff7a5c',0,.12,0,{s:[1.35,.6,1],ws:10,hs:6,ol:.014});
    for(const s of[-1,1]){sph(c,.07,'#ff7a5c',s*.27,.14,.12,{ws:8,hs:5,ol:.01});cyl(c,.012,.012,.12,'#ff7a5c',s*.06,.14,.1,{seg:4,ol:false});sph(c,.03,'#ffffff',s*.06,.27,.1,{ws:6,hs:4,ol:.008});}
    bake(c,true);BEACH.crabs.push({c,ph:i*2.4,z0:i?10:-1,x0:i?9.2:9.8});}
  for(let i=0;i<3;i++){const g=new THREE.Group();L.g.add(g);const w=[];for(const s of[-1,1]){const p=new THREE.Group();g.add(p);box(p,.55,.03,.18,'#ffffff',s*.28,0,0,{ol:.01,center:true});box(p,.12,.035,.19,'#3d2c5e',s*.5,0,0,{ol:false,center:true});w.push(p);}
    sph(g,.09,'#ffffff',0,0,0,{s:[1,1,2.2],ws:8,hs:6,ol:.01});BEACH.gulls.push({g,w,a:i*2.1,r:9+i*4,cx:30+i*6,cz:-4+i*5,y:7+i*1.4,sp:.22+i*.05});}
  buildBus();
  return L;}
function castleShow(){const C=BEACH.castle;if(C)C.parts.forEach((p,i)=>p.visible=i<=BEACH.stage);}
function castleTap(){const C=BEACH.castle;if(!C)return;if(!cool('castle',.3)){SFX.tap();return;}
  if(BEACH.stage>=5){BEACH.stage=0;castleShow();SFX.pop();toast('🌊 Swoosh! A little wave made the sand smooth again. Build a new sand castle!',3);return;}
  BEACH.stage++;castleShow();SFX.pop();addXP('sport',2);floatText(BEACH.stage>=5?'🏰':'+⭐',C.x,1.9,C.z,{h:.5});
  if(BEACH.stage>=5){SFX.yay();toast('🏰 Your sand castle is finished! It looks amazing! 🚩',3.4);}
  else toast(['','🏖️ Pat pat! A big pile of sand.','🏖️ Four little towers!','🏖️ A tall tower in the middle!','🏖️ Walls and a tiny moat!'][BEACH.stage]+' Tap again!',2.4);}
function shellsRefresh(){const b=bch(),L=LOC.beach;if(b.d!==S.day){b.d=S.day;b.got=[];}if(!Array.isArray(b.got))b.got=[];BEACH.day=S.day;
  const r=seeded(S.day*13+5),idx=SHELL_SPOTS.map((_,i)=>i);for(let i=idx.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
  BEACH.shells.forEach((s,i)=>{const [x,z]=SHELL_SPOTS[idx[i]];s.g.position.set(x,0,z);s.g.rotation.y=r()*TAU;s.t.x=L.ox+x;s.t.z=L.oz+z;s.g.visible=!b.got.includes(i);});}
function pickShell(i){const b=bch(),s=BEACH.shells[i];if(!s||!s.g.visible)return;b.got.push(i);b.n=(b.n||0)+1;s.g.visible=false;S.coins+=1;SFX.coin();
  for(const r of HOME_ITEMS.values())if(r.it.sh)shelfShow(r.g,b.n);   /* 🐚 your shell shelf at home shows it */
  if(b.n===3&&![...S.home.items,...S.home.store].some(it=>it.sh))setTimeout(()=>{if(CUR&&CUR.id==='beach')toast('🐚 Tip: a Shell shelf from the 🛍️ Home shop shows your shells at home!',4,1);},3900);
  floatText('🐚',s.t.x,1.1,s.t.z,{h:.5});const left=BEACH.shells.length-b.got.length;
  toast(left?'🐚 A pretty shell! You have '+b.n+' in your collection. +1 🪙':'🐚 You found all of today\'s shells! You have '+b.n+'. More come tomorrow! +1 🪙',3.6);change();}
function beachIn(){bch().seen=1;toast('🏖️ Welcome to the beach! 🌊 Tennis 🎾 is past the kiosk!',3,1);}
function updBeach(dt){updBus(dt);if(!S||!PLAYING||!LOC.beach)return;
  if(CUR.id!=='beach'){if(TN.on)tnStop('gone');return;}const b=bch();if(BEACH.day!==S.day||b.d!==S.day)shellsRefresh();if(!b.seen)b.seen=1;
  const t=BEACH.u.value+=dt;BEACH.seaM.emissiveIntensity=.28*(1-.8*nightF(S.time));BEACH.foam.position.x=11.2+Math.sin(t*.7)*.45;BEACH.foam.material.opacity=.38+Math.sin(t*.7+1)*.14;
  for(let i=0;i<BEACH.shells.length;i++){const k=1+Math.sin(t*3+i*1.3)*.07;BEACH.shells[i].g.scale.set(k,k,k);}
  for(const c of BEACH.crabs){c.ph+=dt;const z=c.z0+Math.sin(c.ph*.35)*6;c.c.position.set(c.x0+Math.sin(c.ph*.9)*.3,Math.abs(Math.sin(c.ph*9))*.03,z);c.c.rotation.y=-Math.PI/2;}
  for(const g of BEACH.gulls){g.a+=g.sp*dt;g.g.position.set(g.cx+Math.cos(g.a)*g.r,g.y+Math.sin(t*.8+g.r)*.4,g.cz+Math.sin(g.a)*g.r);g.g.rotation.y=-g.a;const f=Math.sin(t*5+g.r)*.35;g.w[0].rotation.z=-f;g.w[1].rotation.z=f;}
  for(const c of BEACH.clouds){c.position.x+=c.userData.sp*dt;if(c.position.x>320)c.position.x=40;c.scale.setScalar(clamp(Math.min(320-c.position.x,c.position.x-40)/40,.01,1));}   /* ☁️ like the town's clouds: shrink away before the wrap */
  updTennis(dt);}

/* ===================== 🚌 the Beach Bus: the way to the beach and back (there is no level lock any more) ===================== */
/* The timetable comes from the week number, so it is the same for everyone on the shared clock: 3 bus days a week (one of Mon–Tue,
   one of Wed–Fri, one of Sat–Sun, so never more than 4 days without a bus), coming to the park between 8:00 and 11:50. The bus waits
   1.5 game hours (about 1 real minute) at each stop: park -> beach -> back to the park (the morning trip home, for campers too).
   On bus days the bus home waits at the beach from 19:30 and leaves at 21:00. A brand-new player's first day has a free
   Welcome Bus at both stops from 8:00 to 12:00 that goes as soon as you hop on. You sit inside the waiting bus (Driver Dot says
   hello); when it leaves, a little ride picture plays and you get off at the other stop. Missed it? Camp at the beach. */
const BUS_FARE=20,BUS_W=1.5,BUS_D=.25,BUS_EV=19.5,BV=8,BA=2.5,BB=2,BUS_WK={},BUS_DAY={};
const BUSP={park:{loc:'city',x:-16.5,z:2.1,ry:0,get pre(){return Math.max(110,-28-laneEnd());},post:225},   /* in town it comes from the far end of 🏡 Friends Lane */
  beach:{loc:'beach',x:BEACH_X-35.5,z:2.25,ry:Math.PI/2,pre:110,post:95}};
const BSEAT=[[.95,.68],[-.15,.68],[-1.25,.68],[.95,-.68],[-.15,-.68],[-1.25,-.68]],CAMP={x:-25.4,z:6,fx:-21.6,fz:5.4};
const BUS={g:null,door:null,dot:null,tag:null,tagT:'',sign:[],ins:null,boards:[],tk:[],loc:null,s:null,pos:null,ui:0,v:0,dk:0,hk:0,bt:0,stop:false,
  ride:null,hold:0,arr:null,told:{},nt:0,tipT:0,tip:'',tent:0,ck:0,camp:null,fl:null,sf:null,sk:-1,sfP:null,orm:null},BUSX={yaw:Math.PI/2};
const BUS_OFF={icon:'🚪',label:'Get off the bus',act:()=>standUp()};
{const st=document.createElement('style');st.textContent='#busTip{display:inline-flex;align-items:center;min-height:36px;padding:3px 13px 3px 10px;background:var(--paper);color:var(--ink);border:3px solid var(--line);border-radius:999px;box-shadow:0 4px 0 var(--soft);font-weight:800;font-size:17px;line-height:1.15;pointer-events:none;max-width:100%}'
  +'#busTip.hot{background:#ffe08a;color:#3d2c5e;border-color:#3d2c5e;animation:btPulse 1s ease-in-out infinite}@keyframes btPulse{50%{transform:scale(1.05)}}'
  +'body.bus #joy,body.bus #moveBtns{visibility:hidden}@media (max-width:600px){#busTip{font-size:15px}}'
  +'#busRide{position:fixed;inset:0;z-index:41;pointer-events:none;opacity:0;transition:opacity .28s;overflow:hidden;background:linear-gradient(#7cc8ff,#c4ecff 58%,#9fe486 58%,#9fe486 66%,#b9bcd6 66%,#b9bcd6 82%,#9fe486 82%)}'
  +'#busRide.night{background:linear-gradient(#1d2356,#463c7d 58%,#4f8a5a 58%,#4f8a5a 66%,#6d6f8f 66%,#6d6f8f 82%,#4f8a5a 82%)}#busRide.on{opacity:1}'
  +'#busRide .brr{position:absolute;left:0;right:0;top:73.6%;border-top:4px dashed rgba(255,255,255,.85)}'
  +'#busRide .brb{position:absolute;top:calc(74% - .92em);left:0;font-size:clamp(64px,15vmin,140px);line-height:1;white-space:nowrap;animation:brGo 1.75s cubic-bezier(.35,.1,.4,1) both}#busRide .brb span{font-size:.5em}'
  +'@keyframes brGo{from{transform:translateX(100vw)}to{transform:translateX(-35vw)}}'
  +'#busRide .brs{position:absolute;right:9%;top:7%;font-size:clamp(46px,11vmin,100px)}#busRide .brc{position:absolute;left:10%;top:9%;font-size:clamp(46px,11vmin,100px);opacity:.9;animation:brCl 1.75s linear both}@keyframes brCl{to{transform:translateX(12vw)}}'
  +'#busRide .brd{position:absolute;left:3%;top:calc(58% - .95em);font-size:clamp(40px,9vmin,84px);line-height:1;white-space:nowrap}'
  +'#busRide .brt{position:absolute;left:50%;top:22%;transform:translateX(-50%);background:var(--paper);color:var(--ink);border:3px solid var(--line);border-radius:22px;box-shadow:0 5px 0 var(--soft);padding:10px 20px;font-weight:800;font-size:clamp(20px,4.4vmin,30px);white-space:nowrap}';
 document.head.appendChild(st);}
/* ---- the timetable (the same for everyone: worked out from the day number) ---- */
function busWeek(w){let o=BUS_WK[w];if(o)return o;const r=seeded(w*7919+211);o={};
  for(const g of[[0,1],[2,3,4],[5,6]]){const i=g[Math.floor(r()*g.length)];o[i]=8+Math.floor(r()*24)/6;}
  return BUS_WK[w]=o;}
function busArr(d){return busWeek(Math.floor((d-1)/7))[wdIdx(d)];}   /* when the bus comes to the park that day (undefined = no bus) */
/* the stops of one day: p = park or beach, a = arrives, l = leaves, go = where it takes you (null: it drops people off and goes to sleep) */
/* 🎉 the Welcome Bus (free, both ways) comes on a new player's first day on the one clock: from the next 10 minutes after Rosie's welcome, for 4 game hours
   (from 8:00 if it is early; the next morning 8:00-12:00 if it is 17:00 or later). Saved as wb:[day, comes, leaves] (run 4, job 1) */
const busWB=d=>!!(S&&S.wb&&S.wb[0]===d);
function busWelcome(){const h=S.time,a=h<8?8:Math.ceil(h*6)/6;S.wb=h>=17?[S.day+1,8,12]:[S.day,a,Math.min(20.5,a+4)];for(const k in BUS_DAY)delete BUS_DAY[k];}
function busSess(d){let o=BUS_DAY[d];if(o)return o;o=[];const a=busArr(d),W=BUS_W,wb=busWB(d);
  if(wb)o.push({p:'park',a:S.wb[1],l:S.wb[2],go:'beach',wb:1},{p:'beach',a:S.wb[1],l:S.wb[2],go:'town',wb:1});
  else if(a!==undefined)o.push({p:'park',a,l:a+W,go:'beach'},{p:'beach',a:a+W,l:a+2*W,go:'town'},{p:'park',a:a+2*W,l:a+2*W+BUS_D,go:null});
  if(wb||a!==undefined)o.push({p:'beach',a:BUS_EV,l:21,go:'town'},{p:'park',a:21,l:21+BUS_D,go:null});
  return BUS_DAY[d]=o;}
const busHM=h=>{const m=Math.round(h*60),H=Math.floor(m/60)%24,M=m%60;return H+':'+(M<10?'0':'')+M;};
function busNext(p,go,D,T){const d0=D||S.day,t0=D?T:S.time;for(let d=d0;d<d0+15;d++)for(const s of busSess(d))if(s.p===p&&s.go===go&&(d>d0||s.l>t0))return{d,s};return null;}   /* the next trip from stop p (from now, or from day D at hour T) */
function busWhen(n,leave){if(!n)return'soon';const dd=n.d-S.day;return(dd===0?'today':dd===1?'tomorrow':'on '+wdName(n.d))+' at '+busHM(leave?n.s.l:n.s.a);}
const busSecs=s=>Math.max(0,(s.l-S.time)*hourLen(S.time)),busMMSS=s=>{const v=Math.ceil(busSecs(s));return Math.floor(v/60)+':'+String(v%60).padStart(2,'0');};
/* ---- where the bus is: one road per stop, u = metres past the stop (it slows down to stop, waits, then speeds off) ---- */
function busU(s,t){const T=BUSP[s.p];
  if(t<s.a){const k=(s.a-t)*hourLen(t),Ta=BV/BA,u=k<=Ta?BA*k*k/2:BA*Ta*Ta/2+BV*(k-Ta);return u>T.pre?null:-u;}
  if(t<s.l)return 0;const k=(t-s.l)*hourLen(t),Tb=BV/BB,u=k<=Tb?BB*k*k/2:BB*Tb*Tb/2+BV*(k-Tb);return u>T.post?null:u;}
function busCur(p){if(!S)return null;for(const s of busSess(S.day))if(s.p===p){const u=busU(s,S.time);if(u!==null)return{s,u};}return null;}
/* in town it drives east along the big road (it moves to the middle of the road to fit through the beach gate); at the beach along the road behind the dunes */
function busXZ(p,u){const T=BUSP[p];if(p==='beach')return[T.x,T.z-u,T.ry];
  const x=T.x+u,zf=q=>{const k=clamp((q-58)/14,0,1);return T.z*(1-k*k*(3-2*k));};return[x,zf(x),Math.atan2(zf(x-.5)-zf(x+.5),1)];}
function busW(lx,lz,b){const c=Math.cos(b[2]),s=Math.sin(b[2]);return[b[0]+lx*c+lz*s,b[1]-lx*s+lz*c];}   /* a spot on the bus (front = +x, door side = +z) in the world */
const busThere=p=>!!BUS.g&&BUS.g.visible&&BUS.loc===BUSP[p].loc;
function busReady(p){const c=busCur(p);return!!c&&c.u===0&&!!c.s.go&&busThere(p)&&Math.abs(BUS.ui)<.05&&!BUS.ride;}   /* standing at this stop, doors open */
function busLabel(p){const c=busCur(p),s=c&&c.s;if(!s)return'Get on the bus';if(s.wb)return'Free Welcome Bus: hop on!';if(s.dd)return'Free bus home: hop on! 💛';
  const fr=busR1()?'':' (free 🎟️)';   /* 🎟️ your very first ride is free */
  return s.go==='town'?(fr||S.coins<BUS_FARE?'Get on the bus home'+(fr||' (free)'):`Get on the bus home (${BUS_FARE} 🪙)`):fr?'Get on the bus'+fr:`Get on the bus (${BUS_FARE} 🪙)`;}
/* ---- the bus: a retro surf minibus (the owner's picture) in the game's cartoon style: a short, chunky "loaf" van with a round nose and a
   windscreen that leans back, cream-white on top, warm orange below, big windows you can look out of when you sit inside, round headlights,
   white wheels, flowers on the nose and two surfboards on a roof rack, tipped out to the sides so you see them from the street. One baked
   body; the yellow-green surfboard is its own little piece: at the beach it hops over the roof and leans on the bus ---- */
function holePanel(g,w,h,d,c,holes,x,y,z,ry,sl=0,nt){   /* a flat panel with holes; its ink hull has smaller holes, so every window gets an ink ring
   (sl: its +x end leans back by sl at the top; nt: [x1,x2,top] a doorway cut up from its bottom edge) */
  const geo=e=>{const s=new THREE.Shape();s.moveTo(-w/2-e,-e);if(nt){s.lineTo(nt[0]+e,-e);s.lineTo(nt[0]+e,nt[2]-e);s.lineTo(nt[1]-e,nt[2]-e);s.lineTo(nt[1]-e,-e);}s.lineTo(w/2+e,-e);s.lineTo(w/2-sl+e,h+e);s.lineTo(-w/2-e,h+e);s.closePath();
    for(const q of holes){const p=new THREE.Path();if(q.r)p.absarc(q.x,q.y,q.r-e,0,TAU,false);
      else{const x1=q.x1+e,y1=q.y1+e,x2=q.x2-e,y2=q.y2-e,k=q.k-e,kb=q.kb?q.kb-e:0;p.moveTo(x1+kb,y1);p.lineTo(x2-kb,y1);if(kb)p.absarc(x2-kb,y1+kb,kb,-Math.PI/2,0,false);
        p.lineTo(x2,y2-k);p.absarc(x2-k,y2-k,k,0,Math.PI/2,false);p.lineTo(x1+k,y2);p.absarc(x1+k,y2-k,k,Math.PI/2,Math.PI,false);p.lineTo(x1,y1+kb);if(kb)p.absarc(x1+kb,y1+kb,kb,Math.PI,Math.PI*1.5,false);}
      s.holes.push(p);}
    const G=new THREE.ExtrudeGeometry(s,{depth:d+2*e,bevelEnabled:false,curveSegments:2});G.translate(0,0,-(d+2*e)/2);return G;};
  const m=new THREE.Mesh(geo(0),c.isMaterial?c:mat(c));m.position.set(x,y,z);m.rotation.y=ry||0;g.add(m);const o=new THREE.Mesh(geo(OT),OL);o.position.copy(m.position);o.rotation.copy(m.rotation);g.add(o);return m;}
function archPanel(g,x1,x2,h,d,c,arch,y,z){   /* a side wall from x1 to x2 with round wheel arches cut out of its bottom edge ([x, radius, wheel height above the bottom] each; the last one may run past x2) */
  const geo=e=>{const s=new THREE.Shape();s.moveTo(x1-e,-e);let cut=false;
    for(const [ax,ar,ay] of arch){const r=ar-e,a=Math.asin(Math.min(1,(ay+e)/r));s.lineTo(ax-r*Math.cos(a),-e);
      if(ax+r*Math.cos(a)<x2+e)s.absarc(ax,ay,r,Math.PI+a,-a,true);else{s.absarc(ax,ay,r,Math.PI+a,Math.acos(Math.min(1,(x2+e-ax)/r)),true);cut=true;}}
    if(!cut)s.lineTo(x2+e,-e);s.lineTo(x2+e,h+e);s.lineTo(x1-e,h+e);s.closePath();
    const G=new THREE.ExtrudeGeometry(s,{depth:d+2*e,bevelEnabled:false,curveSegments:4});G.translate(0,0,-(d+2*e)/2);return G;};
  const m=new THREE.Mesh(geo(0),c.isMaterial?c:mat(c));m.position.set(0,y,z);g.add(m);const o=new THREE.Mesh(geo(OT),OL);o.position.copy(m.position);g.add(o);return m;}
function rboxGeo(w,h,d,r,b,e=0,q=3){   /* a soft box: its corners rounded by r (seen from above), its top and bottom edges rounded by b; the bottom at y=0 */
  const X=w/2-b+e,Z=d/2-b+e,R=Math.max(.01,Math.min(r-b+e,X,Z)),s=new THREE.Shape();
  s.moveTo(-X+R,-Z);s.lineTo(X-R,-Z);s.absarc(X-R,-Z+R,R,-Math.PI/2,0,false);s.lineTo(X,Z-R);s.absarc(X-R,Z-R,R,0,Math.PI/2,false);
  s.lineTo(-X+R,Z);s.absarc(-X+R,Z-R,R,Math.PI/2,Math.PI,false);s.lineTo(-X,-Z+R);s.absarc(-X+R,-Z+R,R,Math.PI,Math.PI*1.5,false);
  const G=new THREE.ExtrudeGeometry(s,{depth:Math.max(.005,h-2*b),bevelEnabled:true,bevelThickness:b+e,bevelSize:b,bevelSegments:q,curveSegments:q});G.rotateX(-Math.PI/2);G.translate(0,b,0);return G;}
function rbox(g,w,h,d,c,x,y,z,o={}){const r=o.r??Math.min(w,d)/2,b=o.b??Math.min(h/2,r,.12),q=o.q||3,m=place(g,new THREE.Mesh(rboxGeo(w,h,d,r,b,0,q),o.mat||mat(c)),o,x,y,z);
  if(o.ol!==false)hull(g,rboxGeo(w,h,d,r,b,o.ol||OT,q),m,o);return m;}
function rrPath(p,x1,y1,x2,y2,r){p.moveTo(x1+r,y1);p.lineTo(x2-r,y1);p.absarc(x2-r,y1+r,r,-Math.PI/2,0,false);p.lineTo(x2,y2-r);p.absarc(x2-r,y2-r,r,0,Math.PI/2,false);   /* a rounded rectangle */
  p.lineTo(x1+r,y2);p.absarc(x1+r,y2-r,r,Math.PI/2,Math.PI,false);p.lineTo(x1,y1+r);p.absarc(x1+r,y1+r,r,Math.PI,Math.PI*1.5,false);return p;}
function ringGeo(o,i,h,e=0){const s=rrPath(new THREE.Shape(),o[0]-e,o[1]-e,o[2]+e,o[3]+e,o[4]+e);s.holes.push(rrPath(new THREE.Path(),i[0]+e,i[1]+e,i[2]-e,i[3]-e,Math.max(.01,i[4]-e)));   /* a flat ring lying down: [x1,z1,x2,z2,round] outside and inside */
  const G=new THREE.ExtrudeGeometry(s,{depth:h+2*e,bevelEnabled:false,curveSegments:3});G.rotateX(-Math.PI/2);G.translate(0,-e,0);return G;}
/* 🏄 a surfboard seen from above (tail at -y, nose at +y; n = how round the nose is); lying flat it points its nose to +x, bottom at y=0.
   Its top and bottom are mapped for a painted picture (u across the board, v from the tail to the nose) */
function surfShape(w,l,n,e=0){const a=w/2+e,h=l/2+e,s=new THREE.Shape();s.moveTo(0,-h);s.bezierCurveTo(a*.8,-h,a,-h*.72,a,-h*.12);s.bezierCurveTo(a,h*.45,a*n,h*.97,0,h);
  s.bezierCurveTo(-a*n,h*.97,-a,h*.45,-a,-h*.12);s.bezierCurveTo(-a,-h*.72,-a*.8,-h,0,-h);return s;}
function surfGeo(w,l,th,n,e=0){const b=Math.min(.02,th/3),G=new THREE.ExtrudeGeometry(surfShape(w-2*b,l-2*b,n,e),{depth:th-2*b,bevelEnabled:true,bevelThickness:b+e,bevelSize:b,bevelSegments:1,curveSegments:5});
  const P=G.attributes.position,U=G.attributes.uv;for(let i=0;i<P.count;i++)U.setXY(i,P.getX(i)/w+.5,P.getY(i)/l+.5);
  G.rotateX(-Math.PI/2);G.rotateY(-Math.PI/2);G.translate(0,b,0);return G;}
function surfboard(g,w,l,th,n,c,x,y,z){const m=new THREE.Mesh(surfGeo(w,l,th,n),c.isMaterial?c:mat(c));m.position.set(x,y,z);g.add(m);const o=new THREE.Mesh(surfGeo(w,l,th,n,.015),OL);o.position.copy(m.position);g.add(o);return m;}
function surfTex(){const c=document.createElement('canvas');c.width=128;c.height=512;const x=c.getContext('2d'),r=seeded(57),K='#2f2b3d';   /* yellow-green with black squiggles and a black tail */
  x.fillStyle='#cfe85a';x.fillRect(0,0,128,512);x.fillStyle=K;x.beginPath();x.moveTo(0,512);for(let i=0;i<=16;i++)x.lineTo(i*8,352+Math.sin(i*.9)*12);x.lineTo(128,512);x.fill();
  x.strokeStyle=K;x.lineCap=x.lineJoin='round';
  for(let k=0;k<9;k++){const a=r()*TAU,n=46+r()*44,ox=18+r()*92,oy=40+r()*270,w=5+r()*4,f=(1.5+r())*TAU/n;x.lineWidth=5+r()*2;x.beginPath();
    for(let j=0;j<=30;j++){const t=j/30*n-n/2,o=Math.sin(t*f)*w;x.lineTo(ox+Math.cos(a)*t-Math.sin(a)*o,oy+Math.sin(a)*t+Math.cos(a)*o);}x.stroke();}
  for(let k=0;k<12;k++){x.beginPath();x.arc(8+r()*112,24+r()*300,2+r()*3,0,TAU);x.fill();}
  const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t;}
function buildBus(){const g=new THREE.Group(),b=new THREE.Group();g.add(b);scene.add(g);g.visible=false;BUS.g=g;
  /* xB back, xN nose (the orange front), xF windscreen foot; the cream top and windscreen lean back by dR; front wheels just in front of the door */
  const xB=-1.72,xN=3.85,xF=3.7,W=2.5,R=.42,hz=W/2-R,t=.1,yB=.34,yBl=1.2,yT=2.25,hU=yT-yBl,dR=.2,aR=Math.atan2(dR,hU),hS=Math.hypot(hU,dR),
    OR=BUS.orm=toon({color:'#ff8a3d',emissive:new THREE.Color('#ff5a00'),emissiveIntensity:.25}),CR='#fff6e8',WH='#ffffff',RK='#d8d2e4',
    GL=toon({color:'#d4efff',transparent:true,opacity:.3,depthWrite:false}),WX=[[-1.18,-.33],[-.2,.65],[.78,1.63]],wy1=.12,wy2=.84,AR=[[-.8,.48,.07],[3.15,.48,.07]],
    hole=(x1,x2,c)=>({x1:x1-c,y1:wy1,x2:x2-c,y2:wy2,k:.12,kb:.12}),pane=(p,w,h,x,y,z,ry)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),GL);m.position.set(x,y,z);m.rotation.y=ry;p.add(m);},
    fg=new THREE.Group(),   /* (the leaning windscreen and its sign) */
    post=(x,y,sx,sz,h,c,rz=0)=>{const p=new THREE.Group(),m=c.isMaterial?c:mat(c),t0=sx>0?(sz>0?0:Math.PI/2):(sz<0?Math.PI:Math.PI*1.5);p.position.set(x,y,sz*hz);p.rotation.z=rz;b.add(p);   /* a round corner: a quarter of a post */
      const q=(r,e,M)=>{const k=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h+2*e,4,1,!!e,t0,Math.PI/2),M);k.position.y=h/2;p.add(k);};q(R,0,m);q(R+OT,OT,OL);   /* (round outside, with its ink) */
      for(const [px,pz,ry] of[[0,sz*R/2,-sx*Math.PI/2],[sx*R/2,0,sz>0?Math.PI:0]]){const w=new THREE.Mesh(new THREE.PlaneGeometry(R,h),m);w.position.set(px,h/2,pz);w.rotation.y=ry;p.add(w);}};   /* (square inside) */
  fg.position.set(xF,yBl,0);fg.rotation.z=aR;b.add(fg);
  /* the body: orange below, cream on top, a white belt line between (a little shelf on the nose), rounded corners and a soft rounded roof */
  for(const sz of[-1,1]){post(xB+R,yB,-1,sz,yBl-yB,OR);post(xB+R,yBl,-1,sz,hU,CR);post(xN-R,.8,1,sz,yBl-.8,OR);   /* (the nose's corners stop above the front wheels) */
    post(xF-R-dR/2+Math.sin(aR)*(hS+.05)/2,yBl+hU/2-Math.cos(aR)*(hS+.05)/2,1,sz,hS+.05,CR,aR);}
  archPanel(b,xB+R+.02,xN-R-.02,yBl-yB,t,OR,AR,yB,-W/2+t/2);archPanel(b,xB+R+.02,1.75,yBl-yB,t,OR,AR.slice(0,1),yB,W/2-t/2);archPanel(b,2.65,xN-R-.02,yBl-yB,t,OR,AR.slice(1),yB,W/2-t/2);   /* (the door side stops at the door) */
  box(b,.9,.16,t,null,2.2,yB,W/2-t/2,{mat:OR});for(const [x,s] of[[xN,-1],[xB,1]])box(b,t,yBl-yB,2*hz-.04,null,x+s*t/2,yB,0,{mat:OR});   /* the step under the door; the nose and the back */
  holePanel(b,xF-xB-2*R-.04,hU,t,CR,[...WX,[1.8,2.95]].map(([a,d])=>hole(a,d,(xF+xB)/2)),(xF+xB)/2,yBl,-W/2+t/2,0,dR);   /* the road side, with the driver's window */
  {const c=(xF+xB)/2;holePanel(b,xF-xB-2*R-.04,hU,t,CR,WX.map(([a,d])=>hole(a,d,c)),c,yBl,W/2-t/2,0,dR,[1.75-c,2.65-c,2.15-yBl]);}   /* the door side, with the doorway */
  holePanel(fg,2*hz-.04,hS,t,CR,[{x1:-.74,y1:wy1,x2:-.05,y2:.72,k:.12,kb:.08},{x1:.05,y1:wy1,x2:.74,y2:.72,k:.12,kb:.08}],-t/2,0,0,Math.PI/2);   /* the big windscreen */
  holePanel(b,2*hz-.04,hU,t,CR,[{x1:-.72,y1:.2,x2:-.08,y2:.78,k:.1,kb:.1},{x1:.08,y1:.2,x2:.72,y2:.78,k:.1,kb:.1}],xB+t/2,yBl,0,Math.PI/2);
  {const O=[xB-.02,-W/2-.02,xN+.02,W/2+.02,R+.02],I=[xB+.06,-W/2+.06,xF-t-.01,W/2-.06,.3];for(const e of[0,.015]){const m=new THREE.Mesh(ringGeo(O,I,.08,e),e?OL:mat(WH));m.position.y=yBl-.04;b.add(m);}}
  rbox(b,xF-dR-xB+.08,.24,W+.08,CR,(xF-dR+xB)/2,yT-.08,0,{r:R+.04,b:.1,q:2});   /* the soft white roof */
  /* glass: a light see-through tint (from inside you look out through clear windows) */
  for(const [x1,x2] of WX)for(const s of[-1,1])pane(b,x2-x1-.02,wy2-wy1-.02,(x1+x2)/2,yBl+(wy1+wy2)/2,s*(W/2-.03),s<0?Math.PI:0);
  pane(b,1.13,wy2-wy1-.02,2.375,yBl+(wy1+wy2)/2,-W/2+.03,Math.PI);
  for(const s of[-1,1]){pane(fg,.67,.58,-.03,.42,s*.395,Math.PI/2);pane(b,.62,.56,xB+.03,yBl+.49,s*.4,-Math.PI/2);}
  /* underneath: the floor, the dark underside, the wheel wells; white wheels on dark tyres */
  box(b,xF-xB-.2,.12,1.88,'#efe6fb',(xF+xB)/2,.38,0,{ol:false});for(const s of[-1,1])for(const [x1,x2] of[[xB+.1,-1.32],[-.28,2.63]])box(b,x2-x1,.12,.21,'#efe6fb',(x1+x2)/2,.38,s*1.045,{ol:false});box(b,xN-xB-.5,.22,W-.4,'#5a5f8c',(xN+xB)/2,.14,0,{ol:.02});
  for(const [ax] of AR)for(const sz of[-1,1]){const z=sz*(W/2-.17);box(b,1,.42,.32,'#5a5f8c',ax,.48,sz*(W/2-.26),{ol:false});
    cyl(b,.4,.4,.26,'#3d3550',ax,.41,z,{rx:Math.PI/2,center:true,seg:12});cyl(b,.24,.24,.28,WH,ax,.41,z,{rx:Math.PI/2,center:true,seg:12,ol:.015});cyl(b,.09,.09,.3,RK,ax,.41,z,{rx:Math.PI/2,center:true,seg:8,ol:.012});}
  /* the face: big round headlights, amber blinkers on the corners, a little smile, soft bumpers, side mirrors, wipers; red tail lights at the back */
  for(const s of[-1,1]){const z=s*.6;cyl(b,.2,.2,.06,'#f4f0fa',xN+.02,.82,z,{rz:Math.PI/2,center:true,seg:12,ol:.015});sph(b,.155,null,xN+.05,.82,z,{mat:LAMP,s:[.4,1,1],ol:false,ws:10,hs:6});
    sph(b,.06,'#ffb347',xN-R+R*Math.cos(.6),.98,s*(hz+R*Math.sin(.6)),{ws:6,hs:4,ol:.01});sph(b,.1,'#ff6b6b',xB-.03,.86,z,{s:[.45,1,1],ol:.015,ws:8,hs:5});
    cyl(b,.018,.018,.16,'#5a5f8c',3,1.74,s*(W/2+.02),{rx:Math.PI/2,center:true,seg:6,ol:.01});box(b,.05,.17,.11,'#cfe9ff',3,1.66,s*(W/2+.1),{ol:.012});
    box(fg,.012,.022,.34,'#5a5f8c',.012,.15,s*.38-.03,{rx:s*.26,ol:false});}
  rbox(b,.18,.2,W-.26,RK,xN+.05,.24,0,{r:.09,b:.06,ol:.015,q:1});rbox(b,.16,.2,W-.26,RK,xB-.04,.24,0,{r:.08,b:.06,ol:.015,q:1});
  {const sm=new THREE.Mesh(new THREE.TorusGeometry(.12,.026,4,10,Math.PI),mat(INK));sm.position.set(xN+.02,.64,0);sm.rotation.set(0,Math.PI/2,Math.PI);b.add(sm);}
  box(fg,.02,.28,1.36,'#fff7ea',.01,.76,0,{ol:.012});box(b,.02,.25,.92,'#fff7ea',xB-.002,.695,0,{ol:.012});   /* frames for the signs */
  /* 🌸 a little garland of leaves and flowers on the nose, hanging down a bit in the middle */
  {const gx=z=>Math.abs(z)<=hz?xN-.06:xN-R+Math.sqrt(Math.max(0,(R-.06)**2-(Math.abs(z)-hz)**2)),d=z=>1-(z/1.02)**2,fx=z=>gx(z)+.1*d(z),gy=z=>1.3-.11*d(z);
   for(let k=0;k<=8;k++){const z=-1+k*.25;sph(b,.075,k%2?'#5fbf74':'#4fb86a',fx(z),gy(z),z,{s:[.55,.75,1.35],rx:k%2?.5:-.5,ws:6,hs:4,ol:false});}
   for(const [z,c,r] of[[-.86,'#ff9ec4',.1],[-.43,'#ffd45c',.085],[0,WH,.09],[.43,'#ff7a59',.085],[.86,'#b79cff',.09]]){const x=fx(z)+.05,y=gy(z)+.02;
     sph(b,r,c,x,y,z,{s:[.45,1,1],ws:7,hs:4,ol:.012});sph(b,r*.4,c==='#ffd45c'?'#ff9a3c':'#ffd45c',x+.045,y,z,{ws:5,hs:3,ol:false});}}
  /* 🏄 the roof rack: rails along the roof edges and two crossbars that lift the middle, so each board lies tipped out to its side.
     The wooden surfboard with a red edge rides on the door side (the red board in the middle of its rail makes the red edge) */
  const aB=.59,cB=Math.cos(aB),sB=Math.sin(aB),yR=yT+.16;   /* (yR: the top of the roof) */
  for(const s of[-1,1]){box(b,3.1,.04,.04,RK,1.45,yR+.01,s*1.17,{ol:.01});
    for(const x of[.55,2.35])box(b,.05,.04,.7,RK,x,yR+.06+.33*sB-.03*cB,s*(1.15-.33*cB-.03*sB),{center:true,rx:s*aB,ol:.01});}
  for(const x of[.55,2.35])box(b,.05,.04,1.24,RK,x,yR+.02+.66*sB,0,{ol:.01});
  {const w=new THREE.Group();w.position.set(1.5,yR+.06+.164,1.15-.288);w.rotation.x=aB;b.add(w);
   surfboard(w,.66,2.9,.05,.85,'#e8434a',0,.025,0);surfboard(w,.6,2.84,.1,.85,'#e9bd84',0,0,0);box(w,2.5,.006,.025,'#b07a48',-.05,.1,0,{ol:false});
   for(const z of[-.15,.15])box(w,2,.004,.012,'#d9a46c',-.15,.1,z,{ol:false});}   /* (a stringer and a little wood grain) */
  /* inside: seats by the windows, the driver's seat, wheel and dashboard, a yellow pole by the door, a ceiling light */
  for(const x of[.95,-.15,-1.25])for(const sz of[-1,1]){const z=sz*.68;box(b,.46,.3,.56,'#f0a77f',x,.5,z,{ol:.015});box(b,.52,.12,.62,'#ffb3a0',x,.8,z,{ol:.015});box(b,.1,.44,.62,'#ffd2bd',x-.27,.92,z,{ol:.015});}
  box(b,.52,.42,.6,'#5a5f8c',2.45,.5,-.62,{ol:.015});box(b,.1,.7,.6,'#5a5f8c',2.16,.92,-.62,{ol:.015});box(b,.34,.74,2*hz+.34,'#ffd9c2',xF-.3,.5,0,{ol:.015});
  {const w=new THREE.Mesh(new THREE.TorusGeometry(.19,.035,5,12),mat('#3d2c5e'));w.position.set(2.92,1.33,-.62);w.rotation.order='ZYX';w.rotation.set(0,Math.PI/2,.45);b.add(w);}
  cyl(b,.035,.035,1.7,'#ffd45c',1.62,.5,.98,{seg:8,ol:.012});sph(b,.16,null,.2,yT-.08,0,{mat:LAMP,s:[2.4,.3,1.2],ol:false,ws:8,hs:5});
  for(const txt of['🏖️ Beach','🏘️ Town']){const sg=signPlane(txt,1.3,.24,'#fff7ea','#ff7a59');sg.position.set(.022,.9,0);sg.rotation.y=Math.PI/2;fg.add(sg);BUS.sign.push(sg);}
  for(const m of bake(b,true))if(m.material===LAMP)m.castShadow=false;   /* (the lamps need no shadow) */
  /* the sliding door: orange below, cream on top with a window, like the bus */
  {const d=new THREE.Group();d.position.set(2.2,.5,W/2+.06);g.add(d);box(d,.94,.7,.05,null,0,0,0,{ol:.02,mat:OR});box(d,.94,.08,.07,WH,0,.66,0,{ol:.012});
   holePanel(d,.94,.95,.05,CR,[{x1:-.35,y1:.14,x2:.35,y2:.8,k:.1,kb:.1}],0,.7,0);box(d,.05,.3,.06,RK,-.36,.45,.04,{ol:.01});bake(d,false);BUS.door=d;}   /* (thin: the body's shadow covers it) */
  {const sg=signPlane('🌴 Beach Bus',.86,.21,'#fff7ea','#2b8fc4');sg.position.set(xB-.02,.82,0);sg.rotation.y=-Math.PI/2;g.add(sg);}
  /* Driver Dot: a mint cap and a sky-blue shirt; she sits at the wheel and waves (only her waving arm moves) */
  {const p=makePerson({skin:'#c98d63',hair:'#3d2c5e',style:'bun',eyes:'happy',mouth:'smile',top:'#7cc8ff',sleeve:'#5fa8e0',bottom:'#4a4f7a',shoes:'#2e2347',hat:'cap',hatc:'#5fd4b0',round:true});
   sitPose(p);p.arms[1].userData.keep=1;bake(p.root,true);bake(p.arms[1],true);p.root.position.set(2.42,.3,-.62);p.root.rotation.y=Math.PI/2;g.add(p.root);BUS.dot=p;}
  /* the yellow-green surfboard (one painted piece): on the rack's road side while the bus drives; parked at the beach it hops over the roof and
     leans on the bus by the back wheel, where nobody walks (busSurf) */
  {const s=new THREE.Group();g.add(s);const m=new THREE.Mesh(surfGeo(.58,2.4,.12,.55),toon({map:surfTex()}));m.castShadow=m.receiveShadow=true;s.add(m);s.add(new THREE.Mesh(surfGeo(.58,2.4,.12,.55,.015),OL));
   const a=.12,c=Math.cos(a),sn=Math.sin(a),q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,c,-sn),new THREE.Vector3(0,sn,c),new THREE.Vector3(1,0,0)));
   BUS.sf=s;BUS.sfP=[{x:1.35,y:yR+.06+.161,z:-1.15+.241,q:new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-aB)},{x:-.45,y:1.2*c+.012,z:W/2+.04+1.2*sn,q}];busSurf(0,false,true);}
  {const Wt=[1,.86,.58],Rd=[1,.16,.1];g.add(glowMesh(glowGeo([[xN+.09,.82,.6,.45,Wt],[xN+.09,.82,-.6,.45,Wt],[xN+3.6,.07,0,6,3.2,[.6,.49,.3]],[xB-.07,.86,.6,.3,Rd],[xB-.07,.86,-.6,.3,Rd],[xB-1.3,.07,0,1.8,2,[.28,.04,.03]]])));
   BUS.ins=glowMesh(glowGeo([[.3,1.75,0,1.5,[.5,.38,.18]]]));g.add(BUS.ins);}   /* warm lit windows at night */
  for(const t of BUS.tk)t.obj=g;for(const B of BUS.boards)busBoardDraw(B);}   /* tap the bus itself to get on; the stops' signs are painted now (for the title screen too) */
/* 🏄 the yellow-green surfboard hops off the rack, over the roof, and leans on the bus while it waits at the beach (k: 0 on the rack, 1 leaning),
   and hops back when it leaves */
function busSurf(dt,on,snap){const s=BUS.sf,k0=BUS.sk;if(!s)return;const k=BUS.sk=snap||!(k0>=0)?(on?1:0):clamp(k0+(on?dt:-dt)*1.1,0,1);if(k===k0)return;
  const [A,B]=BUS.sfP,e=k*k*(3-2*k);s.position.set(A.x+(B.x-A.x)*e,A.y+(B.y-A.y)*k*k+1.3*Math.sin(Math.PI*k),A.z+(B.z-A.z)*(1-(1-k)**3));s.quaternion.copy(A.q).slerp(B.q,e);
  if(k===1&&!snap&&k0>=0&&BUS.pos&&Math.hypot(P.x-BUS.pos[0],P.z-BUS.pos[1])<25)SFX.bounce();}   /* (a soft clonk when it lands) */
function busLamp(){if(P.sit&&P.sit.bus&&BUS.pos){const [x,z]=busW(-.5,0,BUS.pos);lamp.intensity=.6;lamp.position.set(x,2.1,z);}}   /* a warm light inside the bus while you ride */
function busTag(txt){if(txt===BUS.tagT)return;BUS.tagT=txt;if(BUS.tag){BUS.g.remove(BUS.tag);BUS.tag.material.map.dispose();BUS.tag.material.dispose();BUS.tag=null;}
  if(txt){const s=label(txt,.5);s.position.set(1.6,3.45,.4);BUS.g.add(s);BUS.tag=s;}}
/* ---- the bus stops: a little round shelter with a bench, the timetable board and a 🚌 sign (baked into the place) ---- */
function busShelter(L,st,x,z,ry){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;st.add(g);const M='#8fe3c4',c=Math.cos(ry),s=Math.sin(ry),W=(lx,lz)=>[x+lx*c+lz*s,z-lx*s+lz*c];
  box(g,3.7,2.2,.14,'#fff6e8',0,0,.55);box(g,3.72,.16,.16,M,0,0,.55,{ol:.015});box(g,3.72,.28,.16,'#ffc4a3',0,1.9,.55,{ol:.015});
  for(const sd of[-1,1]){box(g,.1,1.5,1.2,'#cfe9ff',sd*1.8,.45,-.02,{ol:.02});box(g,.12,.45,1.24,M,sd*1.8,0,-.02,{ol:.015});cyl(g,.07,.07,2.25,M,sd*1.8,0,-.62,{seg:8,ol:.015});}
  cyl(g,.85,.85,4.1,'#ffc4a3',0,2.3,-.02,{rz:Math.PI/2,center:true,s:[.34,1,1],seg:18});bench(g,0,.24,Math.PI);
  box(g,2.5,.5,.06,'#ffffff',0,2.57,0,{ol:.02});cyl(g,.05,.06,2.86,'#5a5f8c',2.2,0,-.6,{seg:8,ol:.012});   /* (the pole behind the round sign and ending in it: it ran across the sign's picture; run 4, stage 3) */cyl(g,.3,.3,.07,M,2.2,2.86,-.66,{rx:Math.PI/2,center:true,seg:20,ol:.02});
  box(g,1.7,1.06,.04,'#ff8a6b',0,.97,.49,{ol:.015});
  {const cv=document.createElement('canvas');cv.width=512;cv.height=512;const tx=new THREE.CanvasTexture(cv);tx.anisotropy=4;   /* one picture for the 3 signs: the timetable, the roof sign, the round stop sign */
   const P2=[],U=[],I=[],quad=(x,y,z,w,h,v0,v1,u1)=>{const n=P2.length/3;P2.push(x+w/2,y-h/2,z,x-w/2,y-h/2,z,x-w/2,y+h/2,z,x+w/2,y+h/2,z);U.push(0,v0,u1,v0,u1,v1,0,v1);I.push(n,n+1,n+2,n,n+2,n+3);};   /* (they face the front) */
   quad(0,1.5,.465,1.56,.92,1-300/512,1,1);quad(0,2.82,-.035,2.4,.42,1-400/512,1-310/512,1);quad(2.2,2.86,-.705,.4,.4,0,100/512,100/512);
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(P2,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));geo.setIndex(I);geo.computeBoundingSphere();
   const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:tx}));m.userData.keep=1;g.add(m);BUS.boards.push({c:cv,t:tx,k:'',bch:L.id==='beach'});
   const [tx2,tz2]=W(0,-1.05);inter(L,{x:tx2,z:tz2,r:2.1,icon:'📋',label:'Read the bus timetable',act:openBusTable,obj:m});}
  {const a=W(-1.9,.48),b=W(1.9,.62);col(L,a[0],a[1],b[0],b[1]);for(const sd of[-1,1]){const p=W(sd*1.8-.06,-.62),q=W(sd*1.8+.06,.62);col(L,p[0],p[1],q[0],q[1]);}const pl=W(2.2,-.66);colC(L,pl[0],pl[1],.1);}}
function busDoorT(L,p){const [x,z]=busW(2.2,1.9,busXZ(p,0));BUS.tk.push(inter(L,{x:x-L.ox,z:z-L.oz,r:2.4,icon:'🚌',label:()=>busLabel(p),act:()=>busBoard(p),when:()=>busReady(p)}));}
function busStopCity(L,st){busShelter(L,st,-16.2,7.6,0);busDoorT(L,'park');}   /* by the park, east of its north gate */
function busStopBeach(L,st){const bg=new THREE.Group();L.g.add(bg);
  for(let z=-110;z<=110;z+=20)flat(bg,3.8,20,'#d9d2e6',-35.5,.016,z);for(let z=-118;z<=118;z+=4)box(bg,.14,.012,1.7,'#ffffff',-35.5,.03,z,{ol:false});   /* a little road behind the dunes (in short pieces: no flicker) */
  flat(bg,3.5,4.6,'#f6dfa9',-31.85,.02,0);col(L,-34.6,-23,-30.5,-1.95);col(L,-34.6,1.95,-30.5,47);   /* a sandy step out through the gate to the bus (up to the road's edge, not on it) */
  busShelter(L,bg,-26.2,-4.25,Math.PI);bake(bg,true);busDoorT(L,'beach');
  /* ⛺ the camp spot next to the bus stop: a ring of stones; a tent and a campfire appear when you camp */
  for(let k=0;k<9;k++){const a=k/9*TAU;sph(st,.16,['#b8b4c4','#a7a3b5','#c8c4d6'][k%3],CAMP.fx+Math.cos(a)*.62,.06,CAMP.fz+Math.sin(a)*.62,{s:[1.2,.7,1],ws:8,hs:6,ol:.015});}colC(L,CAMP.fx,CAMP.fz,.75);
  {const g=new THREE.Group();g.position.set(CAMP.x,0,CAMP.z);L.g.add(g);g.visible=false;BUS.camp=g;const hw=1.1,h=1.45,ln=2.4,a=Math.atan2(hw,h),sl=Math.hypot(hw,h),fx=CAMP.fx-CAMP.x,fz=CAMP.fz-CAMP.z;
   for(const s of[-1,1])box(g,ln,sl,.06,s<0?'#ffb38a':'#ff9e7a',0,h/2,s*hw/2,{rx:-s*a,center:true,ol:.025});prism(g,.06,2*hw,h,'#ffb38a',-ln/2+.03,0,0);
   cyl(g,.045,.045,ln+.24,'#ffffff',0,h,0,{rz:Math.PI/2,center:true,seg:8,ol:.012});flat(g,ln,2*hw-.12,'#7cc8ff',0,.02,0);
   for(const s of[-1,1]){box(g,1.7,.16,.6,s<0?'#b79cff':'#5fd4b0',-.12,0,s*.47,{ol:.015});box(g,.34,.12,.48,'#ffffff',-.86,.16,s*.47,{ol:.012});}
   cyl(g,.022,.022,.55,'#9a6a43',ln/2-.06,h-.05,0,{seg:6,ol:.01});box(g,.34,.2,.02,'#ffd45c',ln/2+.11,h+.3,0,{ol:.01});
   for(let k=0;k<3;k++)cyl(g,.07,.08,.84,'#9a6a43',fx,.12,fz,{rz:Math.PI/2,ry:k*Math.PI/3,center:true,seg:8,ol:.015});
   bake(g,true);
   const f=new THREE.Group();f.position.set(fx,.1,fz);for(const [x,z,r,hh,c] of [[0,0,.16,.66,'#ff7a2e'],[.14,.05,.11,.46,'#ff9d3c'],[-.13,.07,.11,.42,'#ff8a3c'],[.03,-.13,.1,.4,'#ffb347'],[0,.02,.085,.36,'#ffe27a']])cone(f,r,hh,c,x,0,z,{seg:7,ol:false});
   bake(f,false);for(const m of f.children)m.material=new THREE.MeshBasicMaterial({vertexColors:true});g.add(f);BUS.fl=f;
   g.add(glowMesh(glowGeo([[fx,.64,fz,.62,[.95,.6,.25]],[fx,.05,fz,7,7,[.6,.36,.15]]])));}   /* a soft round glow: the halo stays above the sand (a bigger one was cut by the ground into a hard-edged box) */
  inter(L,{x:CAMP.x+1.9,z:CAMP.z,r:2.0,icon:()=>campOn()?'😴':'⛺',label:()=>campOn()?'Sleep in the tent':'Build a campsite',act:campTap});
  inter(L,{x:CAMP.fx+.2,z:CAMP.fz-1.3,r:1.7,icon:'🍡',label:'Toast a marshmallow',act:campFire,when:()=>campOn()});}
function busBoardDraw(B){const day=S?S.day:1,x=B.c.getContext('2d'),Wd=512,Ht=300;B.k=S?day+'':'';
  x.fillStyle='#ffffff';x.fillRect(0,310,Wd,90);x.fillStyle='#5fd4b0';x.fillRect(0,412,100,100);x.textAlign='center';x.textBaseline='middle';x.font=`800 64px ${FONT}`;x.fillStyle='#ff7a59';x.fillText('🚌 Beach Bus',Wd/2,358);x.font=`64px ${FONT}`;x.fillText('🚌',50,466);
  x.fillStyle='#fffaf0';x.fillRect(0,0,Wd,Ht);x.fillStyle='#5fd4b0';x.fillRect(0,0,Wd,64);x.textBaseline='middle';x.textAlign='center';x.font=`800 40px ${FONT}`;x.fillStyle='#ffffff';x.fillText('🚌 Beach Bus',Wd/2,34);
  busDays(day,3).forEach((d,k)=>{const y=96+k*56,today=!!S&&d===day;if(today){x.fillStyle='#ffe08a';x.fillRect(14,y-25,Wd-28,50);}   /* the next 3 bus days */
    const L=(today?'⭐ ':'')+wdName(d),R=B.bch?(busWB(d)?'🎉 until '+busHM(S.wb[2]):busHM(busArr(d)+2*BUS_W))+' · 21:00':busWB(d)?'🎉 '+busHM(S.wb[1])+'–'+busHM(S.wb[2]):busHM(busArr(d));   /* 🏖️ the board at the beach: when the buses home leave (the same times as its card and the pill) */
    x.fillStyle='#3d2c5e';x.font=`800 32px ${FONT}`;const lw=x.measureText(L).width;x.textAlign='left';x.fillText(L,28,y);x.textAlign='right';
    x.font=`800 ${Math.max(20,Math.min(32,Math.floor(32*(Wd-80-lw)/x.measureText(R).width)))}px ${FONT}`;x.fillText(R,Wd-28,y);});
  x.fillStyle='#3d2c5e';x.font=`700 25px ${FONT}`;x.textAlign='center';x.fillText(B.bch?`🏘️ Bus to town · a ride is ${BUS_FARE} 🪙`:`🏖️ Bus home 21:00 · a ride is ${BUS_FARE} 🪙`,Wd/2,Ht-26);B.t.needsUpdate=true;}
/* ---- the timetable card ---- */
function busDays(from,n){const out=[];for(let d=from;out.length<n&&d<from+15;d++)if(busArr(d)!==undefined||busWB(d))out.push(d);return out;}
function openBusTable(){const beach=CUR.id==='beach',w=Math.floor((S.day-1)/7);SFX.tap();
  const row=d=>{const a=busArr(d),today=d===S.day,wb=busWB(d);let gone=d<S.day||(today&&S.time>=(wb?S.wb[2]:a+BUS_W)),tm=wb?'🎉 '+busHM(S.wb[1])+'–'+busHM(S.wb[2])+' (free!)':'🚌 '+busHM(a);
    if(beach){let L=busSess(d).filter(s=>s.p==='beach'&&s.go==='town').sort((x,y)=>x.l-y.l);const left=today?L.filter(s=>s.l>S.time):L;gone=d<S.day||!left.length;if(left.length)L=left;   /* at the beach: when the buses home leave (today only the ones still to come; 💛 Driver Dot's free bus too) */
      tm=(L.some(s=>s.dd)?'':'🏘️ ')+L.map(s=>s.dd?'💛 '+busHM(s.l)+' (free!)':s.wb?'until '+busHM(s.l):busHM(s.l)).join(' and ');}
    return`<div class="ph-row"${today?' style="background:#fff1b8"':''}><span>${today?'⭐ Today':wdName(d)}${gone?' ✔':''}</span><span>${tm}</span></div>`;};
  const wk=k=>busDays(k*7+1,3).filter(d=>d<=k*7+7),left=wk(w).filter(d=>d>S.day||(d===S.day&&S.time<21)).length;
  const c=busCur(beach?'beach':'park'),here=c&&c.u===0&&c.s.go?`🚌 The bus is here! It leaves at ${busHM(c.s.l)}.`:beach?'🏘️ Next bus home: '+busWhen(busNext('beach','town'),1)+'.':'🏖️ Next bus to the beach: '+busWhen(busNext('park','beach'))+'.';
  openPanel(`<div class="hd"><h2>🚌 Beach Bus</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><p class="line" style="margin-top:2px">${here}</p>
    <div class="sec">This week</div>${wk(w).map(row).join('')}${left<2?`<div class="sec">Next week</div>${wk(w+1).map(row).join('')}`:''}
    <p class="note" style="margin-top:12px">🚏 The bus waits about a minute at each stop, so be on time!<br>${busR1()?`🪙 A ride is ${BUS_FARE} coins.`:`🎟️ Your first ride is free! After that, a ride is ${BUS_FARE} coins.`}<br>🏖️ On bus days the bus home leaves the beach at 21:00.<br>⛺ Missed it? Camp at the beach. The next bus takes you home!</p>`,{cls:'bustab'});}   /* (bustab: its ⬇️ "more below" sits in the middle, between the days and the times) */
/* ---- riding ---- */
function busInfo(p){const c=busCur(p);SFX.pop();
  if(c&&c.u===0&&c.s.go&&busThere(p)&&!BUS.ride){toast('🚌 The bus is here! Walk to its door to get on 🚪 It leaves at '+busHM(c.s.l)+'.',4);return;}
  if(c&&c.u<0){toast('🚌 The bus is coming! Wait at the bus stop 🚏',3);return;}
  if(c&&c.u===0&&!c.s.go){toast('🚌 Driver Dot: “All done for now! 😴 The bus is off to the bus garage.”',3.6);return;}
  if(p==='park')toast('🚌 The beach bus comes '+busWhen(busNext('park','beach'))+'. A ride is '+BUS_FARE+' 🪙',4);
  else toast('🚌 The bus stops right outside this gate! The bus home leaves '+busWhen(busNext('beach','town'),1)+'.',4.2);}
function busSeat(){let h=0;const s=String(S.pid||S.name||''),n=BSEAT.length;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;h=Math.abs(h)%n;   /* your own seat, or the next free one */
  const busy=BSEAT.map(([lx,lz])=>{const [x,z]=busW(lx,lz,BUS.pos);for(const a of MP.peers.values())if(a.loc===CUR.id&&Math.hypot(a.x-x,a.z-z)<.4)return true;return false;}),
    nose=k=>BSEAT.some((q,o)=>busy[o]&&q[1]===BSEAT[k][1]&&Math.abs(q[0]-BSEAT[k][0])<1.2);   /* 💺 not right behind (or in front of) a friend: their head would fill the view. Beside them is nicer */
  for(const ok of[k=>!busy[k]&&!nose(k),k=>!busy[k]])for(let i=0;i<n;i++){const k=(h+i)%n;if(ok(k))return k;}return h;}
function busBoard(p){if(BUS.ride||fading||!PLAYING)return;if(!busReady(p)){busInfo(p);return;}
  const s=busCur(p).s,home=s.go==='town',first=!busR1()&&!s.wb&&!s.dd,free=!!s.wb||!!s.dd||first||(home&&S.coins<BUS_FARE);   /* 🎟️ the first ride ever, the Welcome Bus and Driver Dot's extra bus home are free */
  if(!free&&S.coins<BUS_FARE){SFX.no();BUS.dot.wave=1.2;toast(`🚌 Driver Dot: “A ride is ${BUS_FARE} 🪙. Save up a little more and hop on next time! 💛”`,4.4);return;}
  if(DECO.on)decoEnd();if(P.ride)stopRide();if(P.sit)standUp();
  const fare=free?0:BUS_FARE,b=BUS.pos,k=busSeat(),[sx,sz]=busW(BSEAT[k][0],BSEAT[k][1],b),nm=S.name||'friend';
  if(fare){S.coins-=fare;SFX.coin();const [fx,fz]=busW(BSEAT[k][0]+1.9,BSEAT[k][1],b);floatText('-'+fare+' 🪙',fx,1.75,fz,{h:.3,top:1});BUS.ff=FLOATS[FLOATS.length-1];}else SFX.pop();   /* (in front of your seat, inside the bus) */
  P.sit={x:sx,z:sz,yaw:Math.atan2(-Math.cos(b[2]),Math.sin(b[2])),h:1.6,bus:1,bk:[P.x,P.z,P.yaw]};P.x=sx;P.z=sz;P.yaw=P.sit.yaw;P.pitch=-.04;
  if(Math.min(innerWidth,innerHeight)<500){P.yaw-=(BSEAT[k][1]>0?1:-1)*1.18;P.pitch=innerWidth<innerHeight?-.08:-.04;}   /* 📱 a phone's narrow view: you look out of your window (the bus stop, the park, the street), not at the ceiling or the door pole */
  BUS.ride={p,s,to:s.go,fare,d:S.day,t0:performance.now()};document.body.classList.add('bus');BUS.dot.wave=1.4;
  toast(s.wb?`🚌 Driver Dot: “Welcome to Cozy Town, ${nm}! 🎉 Your first ride is free. Off we go!”`:s.dd?`🚌 Driver Dot: “There you are, ${nm}! 💛 Hop in, I'll take you home!”`:first?`🚌 Driver Dot: “Hello, ${nm}! 🎟️ Your first ride is free! Find a seat 😊 We leave at ${busHM(s.l)}!”`:home&&!fare?'🚌 Driver Dot: “No coins? This one\'s on me! 💛 Find a seat!”':`🚌 Driver Dot: “Hello, ${nm}! Find a seat 😊 We leave at ${busHM(s.l)}!”`,s.wb||s.dd?2.6:4,1);
  change();}
function busOff(why){const R=BUS.ride;if(!R||R.go)return;const b=P.sit&&P.sit.bk;P.sit=null;BUS.ride=null;document.body.classList.remove('bus');   /* off again before it leaves: your coins back */
  if(b){[P.x,P.z]=collideXZ(b[0],b[1],.3,CUR);P.yaw=b[2];}P.pitch=0;bringFollowers(true);
  {const f=BUS.ff;BUS.ff=null;if(f&&FLOATS.includes(f))f.t=f.life;if(R.fare)floatText('+'+R.fare+' 🪙',P.x-Math.sin(P.yaw)*2.4,1.9,P.z-Math.cos(P.yaw)*2.4,{h:.3});}   /* the fare goes away, your coins come back: +20 */
  if(R.fare){S.coins+=R.fare;SFX.coin();}else SFX.pop();
  if(why==='jump')toast(`🚌 Driver Dot: “Oh! The clock jumped to your friends' time, so this bus can't go now.${R.fare?` Here are your ${R.fare} 🪙 back! 💛`:''} The next bus comes ${busWhen(busNext('park','beach'))}.”`,5.5,1);   /* (it would have taken you to the beach on another day, with no bus home) */
  else toast(R.fare?`🚌 Driver Dot: “Bye for now! Here are your ${R.fare} 🪙 back 💛”`:'🚌 Driver Dot: “Bye for now! 👋”',R.fare?3.2:2.6);change();}
function busGo(){const R=BUS.ride;if(!R||R.go)return;R.go=1;BUS.hold=1;const b=bch();if(!R.s.dd)b.r1=1;b.bus=1;tone(1319,.12,'triangle',.12);tone(1319,.14,'triangle',.12,.2);tone(98,.6,'sawtooth',.03,.2,150);   /* ding ding, off we go */
  busRideFx(R.to,()=>busArrive(R));}
function busRideFx(to,fn){fading=true;let el=$('busRide');
  if(!el){el=document.createElement('div');el.id='busRide';el.setAttribute('aria-hidden','true');el.innerHTML='<div class="brs">☀️</div><div class="brc">☁️</div><div class="brt"></div><div class="brr"></div><div class="brd"></div><div class="brb">🚌<span>💨</span></div>';document.body.appendChild(el);}
  const nt=nightF(S.time)>.5;el.querySelector('.brt').textContent=to==='beach'?'🏖️ Next stop: the beach!':'🏘️ Next stop: Cozy Town!';el.querySelector('.brd').textContent=to==='beach'?'🌴🏖️🌴':'🏡🌳🏡';el.querySelector('.brs').textContent=nt?'🌙':'☀️';el.classList.toggle('night',nt);
  const b=el.querySelector('.brb');b.style.animation='none';void b.offsetWidth;b.style.animation='';el.classList.add('on');
  setTimeout(()=>{try{fn();}catch(e){console.error(e);}setTimeout(()=>{el.classList.remove('on');setTimeout(()=>{fading=false;},300);},300);},1450);}
function busArrive(R){BUS.ride=null;BUS.hold=0;document.body.classList.remove('bus');P.sit=null;P.ride=null;closePanel();if(DECO.on)decoEnd();
  if(R.to==='beach'){setLoc('beach');const L=LOC.beach,d=DOORS.beach.inside;P.x=L.ox+d[0];P.z=L.oz+d[1];P.yaw=d[2];}
  else{if(S.beach){delete S.beach.camp;delete S.beach.dd;}setLoc('city');const b=busXZ('park',0),[x,z]=busW(3.2,3.6,b),[fx,fz]=busW(1.2,0,b);P.x=x;P.z=z;P.yaw=Math.atan2(-(fx-x),-(fz-z));   /* on the pavement, waving the bus goodbye */
    if(!busCur('park'))busSess(S.day).push({p:'park',a:S.time,l:S.time+BUS_D,go:null});}   /* (Driver Dot's extra bus: it drops you at the park, then drives off) */
  P.pitch=0;BUS.loc=null;BUS.arr={d:S.day,t:S.time};bringFollowers();saveLocal();
  if(R.to==='beach'){beachIn();setTimeout(()=>{if(CUR.id!=='beach'||BUS.ride)return;   /* (not if you already hopped on again: the Welcome Bus goes at once) */
    toast(R.s.wb?'🚌 Driver Dot: “You can ride back to town until 12:00, and the bus home leaves at 21:00. Have fun! 👋”':busHomeSay(),4.4,1);},3400);}
  else{SFX.yay();const nh=R.s.l>=21&&(!NAV||NAV.id==='home');if(nh&&!NAV)setNav('home',true);   /* the evening bus: bedtime, the pink arrow shows the way to your house on 🏡 Friends Lane */
    toast(nh?'🏘️ Home again! 🚌 Driver Dot: “Bye bye! Sleep tight!” 🏡 Follow the pink arrow home.':'🏘️ Home again! 🚌 Driver Dot: “Bye bye! See you soon!” 👋',nh?4.4:3.4,1);}}
/* a friend's 🚀 Go (or any jump) can't skip the bus: a kind message instead */
function busWarp(to,nm){const here=!!CUR&&CUR.id==='beach';if(here===(to==='beach'))return false;SFX.pop();
  if(here)toast('🚌 You are at the beach! Take the bus home first. It leaves '+busWhen(busNext('beach','town'),1)+'.',4.4);
  else toast('🏖️ '+(nm?nm+' is at the beach! ':'')+'Take the 🚌 bus from the park to get there. It comes '+busWhen(busNext('park','beach'))+'.',4.6);
  return true;}
function busGate(){setNav('bus');toast('🚌 The beach bus leaves from the park! It comes '+busWhen(busNext('park','beach'))+'. Follow the arrow 📍',4.4);}   /* the old town gate is just for looking now */
/* ---- 💛 nobody stays stuck at the beach (the words always say what really happens) ---- */
const busR1=()=>!!(S&&S.beach&&S.beach.r1);   /* 🎟️ your first ride (free) is done */
function busHomeLeft(){const n=busNext('beach','town');return!!n&&n.d===S.day;}   /* a bus home still comes today */
function busHomeSay(){const n=busNext('beach','town');if(!n)return'🚌 Driver Dot: “Have fun at the beach! 👋”';   /* Driver Dot's hello at the beach: when the next bus home really goes */
  if(n.d!==S.day)return`🚌 Driver Dot: “The next bus home leaves ${busWhen(n,1)}. Have fun! 👋”`;if(n.s.l>=21)return'🚌 Driver Dot: “The bus home leaves at 21:00. See you then! 👋”';
  const ev=busSess(S.day).some(s=>s.p==='beach'&&s.go==='town'&&s.l>=21);return`🚌 Driver Dot: “I go back to town at ${busHM(n.s.l)}.${ev?' The last bus home leaves at 21:00.':''} Have fun! 👋”`;}
/* a friend's clock jumped past the bus home, or a game from before the bus loads at the beach with no bus home today: Driver Dot comes back for
   you. Her free bus home comes now, waits 2 game hours and goes as soon as you hop on (like the Welcome Bus). Late at night you camp: the bus comes in the morning */
function busDD(d,a){const s={p:'beach',a,l:Math.min(23.95,a+2),go:'town',dd:1};busSess(d).unshift(s);BUS.told[d+':a'+s.p+s.a]=1;BUS.told[d+':miss']=1;return s;}
function busStranded(why){if(!S||!CUR||CUR.id!=='beach')return;if(busHomeLeft()){if(why==='jump')toast('🚌 The bus home leaves '+busWhen(busNext('beach','town'),1)+' from the “To town” gate 🏘️',4.6,1);return;}   /* (a bus home still comes today: just say when) */
  const d=S.day,t=S.time,nw=why==='old'?'🚌 New: the Beach Bus! ':'';BUS.told[d+':miss']=1;
  if(t>=22.5){toast(nw+'🌙 It\'s late! ⛺ Build a campsite and sleep at the beach. The bus home comes '+busWhen(busNext('beach','town'),1)+' 💛',5.5,1);return;}
  const s=busDD(d,Math.ceil((t+.12)*6)/6);bch().dd=[d,s.a];if(!NAV)setNav('home',true);   /* (saved: it still comes after a reload) */
  toast(why==='old'?nw+'💛 Driver Dot came to take you home for free! Her bus waits at the “To town” gate until '+busHM(s.l)+'. Hop on!':'🚌 Driver Dot came back for you! 💛 A free bus home waits at the “To town” gate until '+busHM(s.l)+'. Hop on!',5.5,1);change();}
/* (run 4: the clock-jump handler busClock is gone with the friends' clocks: there is one clock) */
/* a game loads: a promised free bus home comes back; at the beach Driver Dot says when the bus home goes (a game from before the bus:
   what the bus is, and with no bus home today any more she comes to take you home) */
function busLoad(){const b=S.beach;if(b&&Array.isArray(b.dd)){const [d,a]=b.dd;if(d===S.day&&S.time<Math.min(23.95,a+2))busDD(d,a);else delete b.dd;}
  if(CUR.id!=='beach')return;const first=!(b&&b.bus);bch().bus=1;
  setTimeout(()=>{if(!PLAYING||CUR.id!=='beach'||BUS.ride)return;if(first&&!busHomeLeft()){busStranded('old');return;}const n=busNext('beach','town');
    toast(n&&n.s.dd?'🚌 Driver Dot is waiting for you! 💛 Her free bus home leaves the “To town” gate at '+busHM(n.s.l)+'.':(first?'🚌 New: a Beach Bus takes you home! It leaves ':'🚌 The bus home leaves ')+busWhen(n,1)+' from the “To town” gate 🏘️',5,1);},3800);}
/* ---- ⛺ the campsite ---- */
function campOn(){if(!S||!CUR||CUR.id!=='beach')return false;if(S.beach&&S.beach.camp)return true;const L=LOC.beach;   /* yours, or a friend's who is asleep in it */
  for(const a of MP.peers.values())if(a.loc==='beach'&&a.zz&&Math.hypot(a.rx-L.ox-CAMP.x,a.rz-L.oz-CAMP.z)<2.6)return true;return false;}
function campOK(){const t=S.time;if(t>=21||t<7)return true;for(const s of busSess(S.day))if(s.p==='beach'&&s.go==='town'&&s.l>t)return false;return true;}   /* only when no bus home comes today */
function campTap(){if(campOn()){tentSleep();return;}
  if(!campOK()){SFX.pop();toast('⛺ A cozy camping spot! 🚌 The bus home leaves '+busWhen(busNext('beach','town'),1)+'. If you miss it, you can camp here.',4.4);return;}
  bch().camp=1;BUS.camp.scale.setScalar(.05);SFX.yay();toast('⛺ You built a cozy campsite! 🔥 Sleep in the tent when it gets dark 🌙',4);change();}
function tentSleep(){if(S.time>=7&&S.time<21){toast('Not sleepy yet, beds work from 21:00 🌙',3);return;}   /* the same rule as every bed */
  const L=LOC.beach,sx=L.ox+CAMP.x-.35;let side=1;for(const a of MP.peers.values())if(a.loc==='beach'&&a.zz&&Math.hypot(a.rx-sx,a.rz-L.oz-CAMP.z-.47)<.5)side=-1;   /* a friend has that side: take the other */
  P.sit={x:sx,z:L.oz+CAMP.z+side*.47,yaw:-Math.PI/2,h:.48,bed:1,tent:1,bk:[P.x,P.z,P.yaw]};P.x=P.sit.x;P.z=P.sit.z;P.yaw=P.sit.yaw;P.pitch=.03;ZZ.t=0;BUS.tent=1;
  SFX.pop();floatText('💤',L.ox+CAMP.x,1.7,L.oz+CAMP.z,{h:.4});toast('💤 Good night! ⛺',2);}
function campFire(){if(!cool('mallow',1)){SFX.tap();return;}SFX.pop();S.hunger=Math.min(100,S.hunger+4);const L=LOC.beach;floatText('🍡',L.ox+CAMP.fx,1.2,L.oz+CAMP.fz,{h:.5});
  toast(pick(['🍡 Mmm, a golden toasty marshmallow!','🔥 Crackle crackle… so warm and cozy!','🍡 A gooey marshmallow! Yum!','✨ Little sparks dance up to the stars!']),2.8);}
/* ---- every frame ---- */
function busBlocked(p){const b=BUS.pos;if(!b)return null;const fx=Math.cos(b[2]),fz=-Math.sin(b[2]),hx=b[0]+fx*3.9,hz=b[1]+fz*3.9;   /* someone or a car right in front of it */
  const near=(x,z,w)=>{const dx=x-hx,dz=z-hz,f=dx*fx+dz*fz;return f>-.3&&f<2.6&&Math.abs(dx*fz-dz*fx)<w;};
  if(CUR.id===BUSP[p].loc&&!(P.sit&&P.sit.bus)&&near(P.x,P.z,1.45))return'player';if(p!=='park')return null;
  for(const w of WALKERS)if(w.state!=='home'&&near(w.x,w.z,1.5))return'ped';for(const q of GRAN.g)if(q.on&&near(q.x,q.z,1.5))return'ped';for(const f of FRIEND_ACTORS)if(f.loc==='city'&&f.mode!=='away'&&near(f.x,f.z,1.5))return'ped';
  for(const q of PET_ACTORS)if(q.loc==='city'&&near(q.x,q.z,1.3))return'ped';for(const a of MP.peers.values())if(a.loc==='city'&&near(a.x,a.z,1.5))return'ped';
  for(const c of CARS){if(c.away)continue;const dx=c.x-hx,dz=c.z-hz,f=dx*fx+dz*fz;if(f>0&&f<4.2&&Math.abs(dx*fz-dz*fx)<1.9)return'car';}return null;}
function busBlock(x,z,fx,fz){const b=BUS.pos;if(!b||BUS.loc!=='city'||!BUS.g.visible)return false;const bx=Math.cos(b[2]),bz=-Math.sin(b[2]);   /* cars wait for the bus (but a car already in a crossing drives on; the bus waits for it) */
  for(const X of XS)if(Math.abs(x-X.x)<6.3&&Math.abs(z-X.z)<6.3)return false;
  for(const k of[-1.7,1.1,3.9]){const dx=b[0]+bx*k-x,dz=b[1]+bz*k-z,f=dx*fx+dz*fz;if(f>0&&f<4.6&&Math.abs(dx*fz-dz*fx)<2.1)return true;}return false;}
function busSolids(s){const b=BUS.pos;if(!b||!BUS.g||!BUS.g.visible||BUS.loc!==CUR.id)return;const ux=Math.cos(b[2]),uz=-Math.sin(b[2]);   /* one box round the whole bus (bumpers, mirrors, the open door):
  your eyes stay at least 30 cm from it, even at the round corners, so the camera never sees inside through a wall */
  s.push({ob:1,cx:b[0]+ux*1.08,cz:b[1]+uz*1.08,ux,uz,hl:2.97,hw:1.33});}
function campPeers(){const L=LOC.beach;if(CUR.id!=='beach')return;   /* a friend asleep in the tent lies down like in a bed: on the sleeping bag, along the tent, head at the back (blanket narrower, inside the tent) */
  for(const a of MP.peers.values())if(a.av&&a.lie&&a.loc==='beach'&&Math.hypot(a.rx-L.ox-CAMP.x,a.rz-L.oz-CAMP.z)<2.6){const p=a.av,r=p.root;r.position.y=.26;r.position.z=L.oz+CAMP.z+(a.rz<L.oz+CAMP.z?-.35:.35);r.rotation.y=Math.PI/2;if(p.duv)p.duv.scale.set(.58,1,.92);
    if(p.tag)p.tag.position.y=1.62;if(a.zzs)a.zzs.position.y=2.15+Math.sin((a.zzT||0)*2.4)*.07;}}   /* their name and 💤 float above the tent roof, not cut by its cloth */
const busPill=()=>{const e=$('busTip');return!!e&&!e.hidden&&/\d:\d\d|Free bus/.test(e.textContent);};   /* the HUD pill counts down to the bus right now (or says the bus is free: the big "Free ride!" label over the bus covered the clock) */
/* 🚗 the bus pops up at its stop (you just came out, or loaded the game): a car standing where the bus is, or right behind it, rolls back
   to wait with a gap (or, past the bus's middle, rolls ahead of it) */
function busCarGap(b){const ux=Math.cos(b[2]),uz=-Math.sin(b[2]),L=[];let lim=-1.72-4.3;
  for(const c of CARS){if(c.away)continue;const dx=c.x-b[0],dz=c.z-b[1],t=dx*ux+dz*uz,s=dz*ux-dx*uz;
    if(Math.abs(s)<2.2&&Math.sin(c.yaw)*ux+Math.cos(c.yaw)*uz>.5&&t>-9.5&&t<5.7)L.push({c,t});}
  L.sort((a,b)=>b.t-a.t);
  for(const o of L){const c=o.c;if(o.t>1){c.d+=6.2-o.t;}else if(o.t>lim){c.d-=o.t-lim;o.t=lim;}else{lim=o.t-5.2;continue;}carPlace(c);c.yaw=c.ty;c.v=0;if(o.t<=lim)lim=o.t-5.2;}}
function busHide(){if(BUS.g.visible){BUS.g.visible=false;busTag('');}BUS.loc=null;BUS.s=null;BUS.pos=null;BUS.stop=false;for(const X of XS){const i=X.occ.indexOf(BUSX);if(i>=0)X.occ.splice(i,1);}}
function updBus(dt){if(!BUS.g)return;const p=S&&CUR?(CUR.id==='city'?'park':CUR.id==='beach'?'beach':null):null;
  if(S&&PLAYING){busTick(dt,p);campPeers();}
  let c=p&&busCur(p);if(!c&&p&&BUS.s&&BUS.loc===BUSP[p].loc&&BUS.ui>0&&BUS.ui<BUSP[p].post)c={s:BUS.s,u:BUSP[p].post};   /* held up on its way out: it still drives off */
  if(!c){busHide();return;}
  const T=BUSP[p],u=c.u,fresh=BUS.loc!==T.loc||BUS.s!==c.s;
  if(fresh)BUS.ui=u;   /* you just came here, or a new trip: it is where the timetable says */
  else if(BUS.hold)BUS.ui=0;   /* you are riding: it waits for the ride picture */
  else if(u>BUS.ui){let bk=busBlocked(p);
    if(bk!=='car')BUS.bt=0;else if((BUS.bt+=dt)>6)bk=null;   /* (stuck behind a car for a long time: drive on) */
    if(bk){BUS.v=0;if(bk==='player'&&(BUS.hk-=dt)<=0){BUS.hk=3.5;SFX.honk();}}
    else if(u-BUS.ui>30&&!inView(BUS.pos[0],BUS.pos[1],5))BUS.ui=u;else{BUS.v=Math.min(12,BUS.v+6*dt);BUS.ui=Math.min(u,BUS.ui+BUS.v*dt);}}
  else BUS.ui=u;
  const b=busXZ(p,BUS.ui);BUS.pos=b;BUS.g.position.set(b[0],0,b[1]);BUS.g.rotation.y=b[2];BUS.g.visible=true;BUS.loc=T.loc;BUS.s=c.s;BUS.orm.emissiveIntensity=.25*(1-nightF(S.time));
  if(T.loc===CUR.id&&!(P.sit&&P.sit.bus)&&!CLIMB){const bs=[],c=(busSolids(bs),bs[0]);if(c&&pushOut(P.x,P.z,.3,c)){const t=(P.x-c.cx)*c.ux+(P.z-c.cz)*c.uz,w=c.hw+.32;[P.x,P.z]=collideXZ(c.cx+t*c.ux-w*c.uz,c.cz+t*c.uz+w*c.ux,.3,CUR);}}   /* the bus came to stand where you stand (it was already at the stop when you came, or it jumped ahead out of view): you step out on its door side, the pavement (run 4, stage 3: the view was inside the bus) */
  if(fresh&&p==='park'&&Math.abs(BUS.ui)<.5)busCarGap(b);
  const stop=u===0&&Math.abs(BUS.ui)<.05;if(stop&&!BUS.stop){BUS.dot.wave=1.6;if(Math.hypot(P.x-b[0],P.z-b[1])<30&&!BUS.ride)SFX.honk();}BUS.stop=stop;
  BUS.dk=clamp(BUS.dk+(stop&&!BUS.hold?dt:-dt)*1.7,0,1);BUS.door.position.x=2.2-1.02*BUS.dk*BUS.dk*(3-2*BUS.dk);busSurf(dt,p==='beach'&&stop,fresh);
  const d=BUS.dot;if(d.wave>0){d.wave-=dt;d.arms[1].rotation.z=2.5+Math.sin(d.wave*14)*.35;}else d.arms[1].rotation.z*=.85;
  BUS.sign[0].visible=c.s.go==='beach';BUS.sign[1].visible=c.s.go!=='beach';BUS.ins.visible=!(P.sit&&P.sit.bus);
  busTag(stop&&c.s.go&&!BUS.hold&&!busPill()?(c.s.wb?'🎉 Free ride!':c.s.dd?'💛 Free ride!':(c.s.go==='beach'?'🏖️ ':'🏘️ ')+busMMSS(c.s)):'');   /* (near the stop the pill shows the same countdown, easier to read than a label under the buttons) */
  if(p==='park')for(const X of XS){const near=Math.abs(b[1]-X.z)<6.3&&b[0]+3.9>X.x-18&&b[0]-1.7<X.x+6.3,i=X.occ.indexOf(BUSX);if(near&&i<0)X.occ.push(BUSX);else if(!near&&i>=0)X.occ.splice(i,1);}   /* cars let the bus cross first */
  if(stop){const cs=Math.cos(b[2]),sn=Math.sin(b[2]);for(const a of MP.peers.values())if(a.av&&a.loc===CUR.id){const dx=a.x-b[0],dz=a.z-b[1],lx=dx*cs-dz*sn,lz=dx*sn+dz*cs;if(lx>-1.7&&lx<3.2&&Math.abs(lz)<1.05){a.av.root.position.y=.3;sitPose(a.av);if(a.pets)for(const q of a.pets)q.g.visible=false;}}}}   /* friends riding with you sit down (their pets ride along unseen, like yours) */
function busTick(dt,p){const R=BUS.ride,t=S.time;
  if(R&&!R.go){if(!(P.sit&&P.sit.bus)){BUS.ride=null;document.body.classList.remove('bus');if(R.fare)S.coins+=R.fare;bringFollowers(true);change();}   /* stood up some other way: off the bus (coins back) */
    else if(S.day!==R.d||t>=R.s.l||((R.s.wb||R.s.dd)&&performance.now()-R.t0>650))busGo();}
  if(BUS.ride){for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.g.visible=false;for(const q of PET_ACTORS)if(!q.d.stay)q.g.visible=false;}   /* they ride with you */
  for(const B of BUS.boards)if(B.k!==S.day+'')busBoardDraw(B);
  if(BUS.camp){const on=campOn(),L=LOC.beach,tc=BUS.tc||(BUS.tc={x1:L.ox+CAMP.x-1.25,z1:L.oz+CAMP.z-1.15,x2:L.ox+CAMP.x+1.2,z2:L.oz+CAMP.z+1.15}),i=L.dcols.indexOf(tc);   /* the tent is solid while it is there */
    if(on&&i<0)L.dcols.push(tc);else if(!on&&i>=0)L.dcols.splice(i,1);BUS.camp.visible=on;if(on){const g=BUS.camp,k=Math.min(1,g.scale.x+dt*2.5);g.scale.setScalar(k);const tt=performance.now()/1000,f=BUS.fl;
    f.scale.set(1+Math.sin(tt*9)*.08,1+Math.sin(tt*13+1)*.16,1+Math.cos(tt*11)*.08);f.rotation.y=Math.sin(tt*2)*.4;
    if(SET.sound&&AC&&Math.hypot(P.x-LOC.beach.ox-CAMP.fx,P.z-LOC.beach.oz-CAMP.fz)<7&&(BUS.ck-=dt)<=0){BUS.ck=rand(.12,.7);tone(rand(1400,3200),.022,'square',.012);}}}   /* crackle */
  if(BUS.tent&&!zzIn()){BUS.tent=0;if(CUR.id==='beach'&&t>=7&&t<7.5)setTimeout(()=>{if(!PLAYING||CUR.id!=='beach')return;const n=busNext('beach','town');
    toast(n&&n.d===S.day?'🚌 The bus to town comes today! It leaves at '+busHM(n.s.l)+' 🏘️':'🚌 No bus today. The bus home leaves '+busWhen(n,1)+'. Enjoy the beach! 🏖️',4.6,1);},4300);}
  if(p==='beach'&&HOST.cur){const q=HOST.cur;hostAnswer(false,true);toast('🔔 '+q.nm+' knocked at your door, but you are at the beach! 🏖️',3.6);}
  const calm=S.intro&&!UI.open&&!fading&&!CUT&&!TUT&&!DTUT,busy=$('toast').classList.contains('show');
  if(!(S.beach&&S.beach.bus)&&p==='park'&&calm&&!busy&&!(NAV&&NAV.id==='home')){BUS.nt+=dt;if(BUS.nt>5){bch().bus=1;change();SFX.pop();   /* (your house first: while the pink arrow shows the way home, the bus waits) */
    toast(busWB(S.day)&&t<S.wb[2]-.5?'🎉 Good news! A free Welcome Bus waits at the park until '+busHM(S.wb[2])+'. Hop on and visit the beach! 🏖️':'🚌 New! A cozy Beach Bus stops at the park 3 days a week.'+(busR1()?'':' Your first ride is free! 🎟️')+' Find the 🚌 bus stop on your 🗺️ map!',5.5,1);}}else BUS.nt=0;
  if(p==='park'&&!busR1()&&S.beach&&S.beach.bus&&calm&&!busy&&!BUS.ride&&!BUS.told[S.day+':r1']&&busNearStop('park')){const c=busCur('park');   /* 🎟️ at the bus stop: your first ride is free (the Welcome Bus has its own words) */
    if(!(c&&c.s.wb)){BUS.told[S.day+':r1']=1;toast('🎟️ Your first ride to the beach is free! '+(busReady('park')?'Hop on! 🚌':'The bus comes '+busWhen(busNext('park','beach'))+' 🚌'),4.6,1);}}
  if(p&&!BUS.ride&&calm)busNews(p,t,busy);
  BUS.tipT-=dt;if(BUS.tipT<=0){BUS.tipT=.25;busTipUpd(p);}}
function busNews(p,t,busy){const d=S.day,say=(k,txt,w,snd)=>{const key=d+':'+k;if(BUS.told[key]||(busy&&t<w))return;BUS.told[key]=1;if(snd)snd();toast(txt,4.6,1);};
  for(const s of busSess(d))if(s.go&&t>=s.a&&t<s.a+.2&&BUSP[s.p].loc===CUR.id&&!(BUS.arr&&BUS.arr.d===d&&Math.abs(BUS.arr.t-t)<.3)&&!(s.wb&&NAV&&NAV.id==='home'))   /* the bus is here (not the one you just came on; a new player finds the house first) */
    say('a'+s.p+s.a,s.p==='park'?(s.wb?'🎉 The Welcome Bus is at the park! Hop on for a free ride to the beach 🏖️':'🚌 Beep beep! The Beach Bus is at the park! It leaves at '+busHM(s.l)+' 🏖️'):'🚌 Beep beep! The bus to town is here! It leaves at '+busHM(s.l)+' 🏘️',s.wb?s.l:s.a+.1,()=>{SFX.honk();if(s.wb)bch().bus=1;});   /* (the Welcome Bus message is the news too) */
  if(p!=='beach'||busArr(d)===undefined)return;
  if(t>=20.5&&t<20.6)say('ev1','🚌 The bus home leaves at 21:00!',20.55);
  if(t>=20+50/60&&t<20.95)say('ev2','🚌 Last call! The bus leaves in 10 minutes!',20.9,()=>SFX.ding());
  if(t>=21&&t<22&&!(S.beach&&S.beach.camp)&&!zzIn()&&!(busThere('beach')&&BUS.ui<8))   /* only once the bus really drove off (8 m away, or gone), not while it still stands at the stop */
    say('miss','🚌 Oh no, the bus left! ⛺ Build a campsite and sleep at the beach. The next bus takes you home!',21.4,()=>SFX.aww());}
function busNearStop(p){if(p==='park')return Math.hypot(P.x+14.3,P.z-4.5)<16;const L=LOC.beach;return P.x-L.ox<-21&&Math.abs(P.z-L.oz)<9;}
function busTipUpd(p){let el=$('busTip'),t='',hot=false;const R=BUS.ride;
  if(R&&!R.go){t=R.s.wb?'🚌 Off we go!':(R.to==='beach'?'🚌 Off to the beach in ':'🚌 Off home in ')+busMMSS(R.s);hot=!R.s.wb&&busSecs(R.s)<12;}
  else if(p&&!R&&!zzIn()&&S.intro){const c=busCur(p),near=busNearStop(p);
    if(c&&c.s.go&&c.u===0&&(near||p==='beach')){t=c.s.wb?(p==='park'?'🎉 Free bus! Hop on!':'🚌 Free bus to town until '+busHM(c.s.l)):c.s.dd?'💛 Free bus home: '+busMMSS(c.s):(p==='park'?'🚌 Bus to the beach: ':'🚌 Bus to town: ')+busMMSS(c.s);hot=!c.s.wb&&busSecs(c.s)<15;}   /* (at the beach you just came on the Welcome Bus: not "hop on!" but until when it goes back, like Driver Dot says) */
    else if(near){if(c&&c.u<0&&c.s.go)t='🚌 The bus is coming!';else{const n=p==='park'?busNext('park','beach'):busNext('beach','town');t=(p==='park'?'🚌 Next bus: ':'🚌 Bus home: ')+(n?(n.d===S.day?'':WDAYS[wdIdx(n.d)].slice(0,3)+' ')+busHM(p==='park'?n.s.a:n.s.l):'soon');}}}
  if(!el){if(!t)return;el=document.createElement('div');el.id='busTip';el.setAttribute('role','status');el.hidden=true;$('stats').after(el);}
  if(el.textContent!==t)el.textContent=t;el.classList.toggle('hot',hot);if(el.hidden!==!t)el.hidden=!t;}

/* ===== 🎾 the tennis court at the north end of the beach, with Coach Sunny ===== */
/* the court runs along x (beach-local centre TCX,TCZ): you play from the west half, the coach from the east half with the sea behind her */
const TCX=-9.5,TCZ=34,THL=9,THW=4.1,TBR=.1,TGV=6,TN_XP=40,TN_IDLE=[-5.2,-5.3];
const TN={on:false,st:'',t:0,n:0,best0:0,newB:false,sw:0,fs:0,s:0,hot:false,b:null,ball:null,sh:null,sq:0,fb:0,C:null,cc:null,tk:null,tg:null,rk:null,cx:0,cz:0};
let TSTR=null;
function tnS(){return S.tennis||(S.tennis={best:0});}
function tnW(u,v){const L=LOC.beach;return[L.ox+TCX+u,L.oz+TCZ+v];}
function tnU(x){return x-LOC.beach.ox-TCX;}
function tnV(z){return z-LOC.beach.oz-TCZ;}
/* a little pattern for the net and the fence: white lines on clear, tinted by the material colour */
function tnTex(n,draw){const c=document.createElement('canvas');c.width=c.height=n;const x=c.getContext('2d');x.strokeStyle='#ffffff';draw(x);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
/* a racket standing up (handle at y=0, the round head on top, its strings face +z) */
function racket(g,c){cyl(g,.022,.026,.28,'#3d2c5e',0,0,0,{seg:6,ol:.008});cyl(g,.014,.014,.16,c,0,.28,0,{seg:5,ol:false});
  const f=new THREE.Mesh(new THREE.TorusGeometry(.15,.018,6,20),mat(c));f.position.y=.6;f.scale.set(1,1.25,1);g.add(f);
  const s=new THREE.Mesh(new THREE.CircleGeometry(.15,18),TSTR||(TSTR=new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false})));s.position.y=.6;s.scale.set(1,1.25,1);g.add(s);return g;}
function buildCourt(L,st){const X=TCX,Z=TCZ,FX=12.5,FZ=6.5,GX1=X-11.3,GX2=X-8.7;
  /* green surround, blue court, white lines */
  flat(st,FX*2,FZ*2,'#8fd6a2',X,.02,Z);flat(st,THL*2,THW*2,'#5ab0e8',X,.03,Z);
  const ln=(w,d,x,z)=>flat(st,w,d,'#ffffff',x,.04,z);
  for(const s of[-1,1]){ln(.1,THW*2+.1,X+s*THL,Z);ln(THL*2+.1,.1,X,Z+s*THW);ln(THL*2,.08,X,Z+s*3.1);ln(.08,6.2,X+s*5,Z);ln(.3,.08,X+s*(THL-.15),Z);}
  ln(10,.08,X,Z);
  /* the net between two posts */
  for(const s of[-1,1]){cyl(st,.06,.06,1.02,'#3d4a7a',X,0,Z+s*4.65,{seg:8,ol:.015});sph(st,.075,'#3d4a7a',X,1.04,Z+s*4.65,{ws:8,hs:6,ol:.012});colC(L,X,Z+s*4.65,.14);}
  box(st,.05,.07,9.3,'#ffffff',X,.85,Z,{ol:.01});box(st,.05,.85,.07,'#ffffff',X,0,Z,{ol:false});
  {const t=tnTex(32,x=>{x.lineWidth=3;x.strokeRect(0,0,32,32);});t.repeat.set(78,7);
   const n=new THREE.Mesh(new THREE.PlaneGeometry(9.3,.82),new THREE.MeshBasicMaterial({color:'#2e2347',map:t,transparent:true,side:THREE.DoubleSide,depthWrite:false}));n.rotation.y=Math.PI/2;n.position.set(X,.46,Z);n.userData.keep=1;L.g.add(n);}
  col(L,X-.07,Z-4.7,X+.07,Z+4.7);
  /* a wire fence all around (open at the gate), with posts and a top rail */
  {const t=tnTex(64,x=>{x.lineWidth=5;x.beginPath();x.moveTo(0,0);x.lineTo(64,64);x.moveTo(64,0);x.lineTo(0,64);x.stroke();}),H=2.2,P=[],U=[];
   for(const [x1,z1,x2,z2] of [[X-FX,Z-FZ,GX1,Z-FZ],[GX2,Z-FZ,X+FX,Z-FZ],[X+FX,Z-FZ,X+FX,Z+FZ],[X+FX,Z+FZ,X-FX,Z+FZ],[X-FX,Z+FZ,X-FX,Z-FZ]]){
     const l=Math.hypot(x2-x1,z2-z1),r=l*2.2,q=H*2.2,n=Math.max(1,Math.round(l/3.2));P.push(x1,0,z1,x2,0,z2,x2,H,z2,x1,0,z1,x2,H,z2,x1,H,z1);U.push(0,0,r,0,r,q,0,0,r,q,0,q);
     for(let i=0;i<=n;i++)cyl(st,.05,.05,H+.1,'#4f6b8a',x1+(x2-x1)*i/n,0,z1+(z2-z1)*i/n,{seg:6,ol:.012});
     box(st,Math.abs(x2-x1)+.06,.06,Math.abs(z2-z1)+.06,'#4f6b8a',(x1+x2)/2,H,(z1+z2)/2,{ol:.01});col(L,Math.min(x1,x2)-.5,Math.min(z1,z2)-.5,Math.max(x1,x2)+.5,Math.max(z1,z2)+.5);}   /* 🎾 some room in front of the wire (the camera pressed into it) */
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));
   const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:'#5f7f92',map:t,transparent:true,side:THREE.DoubleSide,depthWrite:false}));m.userData.keep=1;L.g.add(m);}
  for(const gx of[GX1,GX2]){cyl(st,.08,.08,2.75,'#ffd45c',gx,0,Z-FZ,{seg:8,ol:.015});colC(L,gx,Z-FZ,.12);}
  box(st,GX2-GX1+.2,.14,.14,'#ffd45c',(GX1+GX2)/2,2.62,Z-FZ,{ol:.015});
  {const sg=signPlane('🎾 Tennis',2.3,.6,'#5ab0e8','#ffffff');sg.position.set((GX1+GX2)/2,3.0,Z-FZ-.06);sg.rotation.y=Math.PI;L.g.add(sg);}
  /* a signpost at the end of the boardwalk, so you find the court */
  {cyl(st,.07,.08,2.3,'#4f6b8a',-18.5,0,1.7,{seg:6,ol:.012});box(st,.06,.58,2.08,'#ffffff',-18.6,1.71,1.7,{ol:.015});colC(L,-18.53,1.7,.16);const sg=signPlane('🎾 Tennis ➡',2,.5,'#5ab0e8','#ffffff');sg.position.set(-18.66,2,1.7);sg.rotation.y=-Math.PI/2;L.g.add(sg);}
  /* benches, a basket full of balls and two lamps for the evening */
  for(const s of[-1,1]){bench(st,X+s*3.2,Z-FZ+.55,0);col(L,X+s*3.2-.85,Z-FZ+.2,X+s*3.2+.85,Z-FZ+.85);}
  {const bx=X+10.7,bz=Z-5.3;for(const [dx,dz] of [[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]])cyl(st,.018,.018,.5,'#3d4a7a',bx+dx,0,bz+dz,{seg:5,ol:false});
   cyl(st,.3,.26,.45,'#7cc8ff',bx,.45,bz,{seg:12,ol:.015});for(let i=0;i<7;i++){const a=i/7*TAU,k=i%2?.17:.07;sph(st,.075,'#d8f03c',bx+Math.cos(a)*k,.93,bz+Math.sin(a)*k,{ws:8,hs:6,ol:.008});}colC(L,bx,bz,.38);}
  for(const s of[-1,1]){const lx=X+s*(FX+.6),lz=Z+FZ+.6;cyl(st,.06,.07,3.2,'#5a5f8c',lx,0,lz,{seg:6,ol:.012});sph(st,.2,null,lx,3.3,lz,{mat:LAMP,ol:.015,ws:10,hs:8});colC(L,lx,lz,.14);}
  /* the end of the sand up here: dunes and a few palms; the sea is still too deep to walk in */
  box(st,.9,1.0,22.6,'#5fbf74',-31.1,0,33.3,{ol:.03});box(st,42.6,.9,.9,'#5fbf74',-9.8,0,44.95,{ol:.03});col(L,11.6,22,25,46);
  for(const [x,z,s,ry] of [[-27,27.5,1.1,.8],[6.5,29,1.2,2.2],[-26,41.5,1,1.4],[6,41,1.05,-1]]){palm(st,x,z,s,.28,ry);colC(L,x,z,.3);}
  /* Coach Sunny: a cap, tennis whites, a pink racket and a name tag */
  {const p=makePerson({skin:'#f1c9a5',hair:'#8a5a36',style:'ponytail',top:'#ffffff',sleeve:'#ffd45c',bottom:'#5ab0e8',shoes:'#ffffff',hat:'cap',hatc:'#ffd45c',eyes:'happy',mouth:'grin'});
   const rg=new THREE.Group();racket(rg,'#ff7aa8');rg.position.set(0,-.56,.03);rg.rotation.x=Math.PI-.7;p.arms[0].add(rg);bakePerson(p);
   const tg=label('Coach Sunny',.3);tg.position.y=2.02;p.root.add(tg);L.g.add(p.root);
   const [ix,iz]=tnW(TN_IDLE[0],TN_IDLE[1]);TN.C={p,x:ix,z:iz,path:[],face:0,sw:0};TN.cc={cx:ix,cz:iz,cr:.34};L.dcols.push(TN.cc);
   TN.tk=inter(L,{x:TCX+TN_IDLE[0],z:TCZ+TN_IDLE[1],r:2.6,icon:'🎾',label:'Talk to Coach Sunny',act:coachTalk,obj:p.root,when:()=>!TN.on});}
  /* the ball (with a white seam) and its soft shadow */
  {const g=new THREE.Group();sph(g,TBR,'#d8f03c',0,0,0,{ws:12,hs:8,ol:.012});const s=new THREE.Mesh(new THREE.TorusGeometry(TBR+.003,.009,4,18),mat('#ffffff'));s.rotation.x=.6;g.add(s);bake(g,false);g.visible=false;L.g.add(g);TN.ball=g;
   const sh=new THREE.Mesh(new THREE.CircleGeometry(.13,14),new THREE.MeshBasicMaterial({color:'#2e2347',transparent:true,opacity:.28,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.visible=false;sh.userData.keep=1;L.g.add(sh);TN.sh=sh;}
  TN.tg={icon:'🎾',label:()=>tnReach()?'Hit it now!':'Swing the racket',act:tnSwing};}
function coachTalk(){if(TN.on)return;const C=TN.C;C.p.wave=1.2;SFX.talk();const b=(S.tennis&&S.tennis.best)||0;
  openPanel(`<div class="who" style="--c:#ffd45c">🎾 Coach Sunny</div><p class="line">${b?(nightF(S.time)>.5?pick(['A night match under the lamps? 🌙 Let\'s rally!','The stars are out! ✨ One more rally before bed?']):pick(['Hello again, champ! ☀️ Ready for another rally?','What a sunny day for tennis! Shall we play? 🎾','Yay, you\'re back! Let\'s hit some balls! 🎾'])):'Hi! I\'m Coach Sunny! ☀️ Do you want to play tennis with me? I hit the ball to you, and you hit it back!'}</p>
    <p class="note" style="text-align:center">${b?'🏆 Your best rally: <b>'+b+'</b>':TOUCHY?'When the ball comes close, tap 🎾!':'When the ball comes close, press E or click!'}</p>
    <div class="row"><button class="btn mint" data-a="tnGo">🎾 Let's rally!</button><button class="btn white" data-a="close">Maybe later</button></div>`,{bottom:true});}
function tnHud(){let h=$('tnHud');if(h)return h;
  const st=document.createElement('style');st.textContent='#tnHud{pointer-events:auto;display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;background:var(--paper);color:var(--ink);border:3px solid var(--line);border-radius:24px;box-shadow:0 4px 0 var(--soft);padding:4px 5px 4px 12px;font-weight:800;font-size:19px;max-width:100%}#tnHud[hidden]{display:none}#tnTxt{white-space:nowrap}#tnStop{min-height:44px;padding:4px 14px;font-size:17px}#act.hot{background:#e9fa7a;box-shadow:0 5px 0 #3d2c5e,0 0 0 7px rgba(216,240,60,.75)}';document.head.appendChild(st);
  h=document.createElement('div');h.id='tnHud';h.hidden=true;h.innerHTML='<b id="tnTxt"></b><button class="btn white" id="tnStop" aria-label="Stop playing tennis">✋ Stop</button>';$('left').insertBefore(h,$('tasks'));
  $('tnStop').addEventListener('click',()=>{audioInit();SFX.tap();tnStop('stop');});return h;}
function tnHudUpd(){const t=$('tnTxt');if(t)t.textContent='🎾 '+TN.n+' · 🏆 '+Math.max(tnS().best||0,TN.n);}
/* your racket and arm in front of you (first person), only while you play */
function tnRacket(){if(TN.rk){camera.remove(TN.rk);TN.rk.traverse(o=>{if(o.geometry)o.geometry.dispose();});}
  const g=new THREE.Group(),r=new THREE.Group(),lk=lookToPerson(S.look);g.add(r);racket(r,'#ff7aa8');r.rotation.set(-.35,0,.35);
  box(g,.11,.56,.11,lk.sleeve,.15,-.3,.075,{rz:.59,center:true,ol:.008});box(g,.1,.11,.1,lk.skin,0,-.03,0,{center:true,ol:.008});
  g.traverse(o=>{o.castShadow=false;o.receiveShadow=false;});if(camera.parent!==scene)scene.add(camera);camera.add(g);g.visible=false;TN.rk=g;return g;}
function tnShow(on){tnHud().hidden=!on;if(TN.rk)TN.rk.visible=on;TN.hot=false;if(!on){$('act').classList.remove('hot');TN.ball.visible=TN.sh.visible=false;}tnHudUpd();}
function tnStart(){if(TN.on||CUR.id!=='beach'||!TN.C)return;
  fade(()=>{if(CUR.id!=='beach')return;const [x,z]=tnW(-THL-.9,0);P.x=x;P.z=z;P.yaw=-Math.PI/2;P.pitch=-.06;P.sit=null;
    const C=TN.C;[C.x,C.z]=tnW(THL+.7,0);C.path=[];C.sw=0;TN.cx=C.x;TN.cz=C.z;
    TN.on=true;TN.st='wait';TN.t=2.2;TN.n=0;TN.b=null;TN.sw=TN.fs=TN.s=0;TN.fb=0;TN.best0=tnS().best||0;TN.newB=false;tnRacket();tnShow(true);
    toast(TOUCHY?'🎾 Here comes the ball! Tap 🎾 when it is close to you.':'🎾 Here comes the ball! Press E (or click) when it is close to you.',2.2);});}
function tnStop(why){if(!TN.on)return;TN.on=false;TN.st='';TN.b=null;tnShow(false);const C=TN.C,[ix,iz]=tnW(TN_IDLE[0],TN_IDLE[1]);
  if(why==='gone'){C.x=ix;C.z=iz;C.path=[];}else C.path=[tnW(1.4,-5.7),tnW(-1.4,-5.7),[ix,iz]];
  const b=tnS().best||0;change();
  if(why==='stop')toast('🎾 Thanks for playing! '+(b?'Your best rally: '+b+' 🏆':'Come back soon! 👋'),3.4);
  else if(why==='off')toast('🎾 You walked off the court. Come back and play again soon! 👋',3.4);}
function tnSwing(){if(!TN.on||TN.sw>0)return;TN.sw=.42;TN.fs=0;SFX.swish();}
/* a ball flight from (x0,y0,z0) that lands at (x1,z1) after flying up to height H */
function tnLaunch(x0,y0,z0,x1,z1,H){H=Math.max(H,y0+.3);const vy=Math.sqrt(2*TGV*(H-y0)),T=vy/TGV+Math.sqrt(2*(H-TBR)/TGV);
  TN.b={x0,y0,z0,x:x0,y:y0,z:z0,vx:(x1-x0)/T,vy,vz:(z1-z0)/T,t:0,tl:T,bn:0};}
function tnBall(dt){const b=TN.b;if(!b)return;b.t+=dt;
  while(b.t>=b.tl){const t=b.tl,vy=(TGV*t-b.vy)*.62;b.x0+=b.vx*t;b.z0+=b.vz*t;b.y0=TBR;b.vx*=.8;b.vz*=.8;b.t-=t;b.bn++;
    if(vy<.4){b.vy=0;b.tl=1e9;}else{b.vy=vy;b.tl=2*vy/TGV;TN.sq=.12;if(CUR.id==='beach')SFX.bounce();}}
  const t=b.t;b.x=b.x0+b.vx*t;b.y=Math.max(TBR,b.y0+b.vy*t-.5*TGV*t*t);b.z=b.z0+b.vz*t;}
/* the coach hits the ball to you: it bounces a few steps in front of you (gentle, a bit wider and faster as the rally grows) */
function tnToYou(x0,y0,z0){const r=TN.n,spr=Math.min(.35+r*.07,1.3),lu=clamp(tnU(P.x)+3,-THL+1,-1.3),lv=clamp(tnV(P.z)+rand(-spr,spr),-THW+.5,THW-.5),[x1,z1]=tnW(lu,lv);
  tnLaunch(x0,y0,z0,x1,z1,Math.max(2.3,3.1-r*.05));TN.st='toP';TN.C.sw=.4;SFX.hit();}
function tnReach(){const b=TN.b;if(!TN.on||!b||TN.st!=='toP')return false;const du=b.x-P.x;return tnU(b.x)<0&&du>-.9&&du<2.3&&Math.abs(b.z-P.z)<1.9&&b.y<2.6;}
function tnHit(){const b=TN.b,du=b.x-P.x,q=clamp(1-Math.abs(du-.8)/1.6-Math.abs(b.z-P.z)/2.4,0,1),great=q>.5,x=b.x,y=b.y,z=b.z;
  TN.n++;TN.sw=0;TN.fs=.36;SFX.hit();const [x1,z1]=tnW(rand(4.2,7.2),rand(-2.7,2.7));tnLaunch(x,Math.max(y,.8),z,x1,z1,great?2.5:3);TN.st='toC';
  /* the coach runs to where the ball will be just after its bounce */
  const B=TN.b;TN.cx=x1+B.vx*.8*.42+.35;TN.cz=z1+B.vz*.8*.42-.45;
  floatText(String(TN.n),x,y+.55,z,{h:great?.62:.5});if(great||TN.n%3===0)setTimeout(()=>{if(TN.on&&TN.C)floatText(pick(['👏 Nice!','⭐ Great shot!','🌟 Super!','💪 Yes!']),TN.C.x,2.45,TN.C.z,{h:.42});},250);
  tnReward();tnHudUpd();}
/* Sports XP for every return (up to TN_XP a day), a bonus every 5, and coins for a new best rally (once a day) */
function tnReward(){const t=tnS(),n=TN.n;if(t.d!==S.day){t.d=S.day;t.xp=0;}
  const xp=k=>{k=Math.min(k,TN_XP-(t.xp||0));if(k>0){t.xp=(t.xp||0)+k;addXP('sport',k);}};
  xp(1);if(n%5===0){xp(3);SFX.yay();floatText('🎉 '+n+'!',P.x-Math.sin(P.yaw)*2,2,P.z-Math.cos(P.yaw)*2,{h:.6});}
  if(n>(t.best||0))t.best=n;
  if(n>TN.best0&&n>=3&&!TN.newB){TN.newB=true;const c=t.c!==S.day;if(c){t.c=S.day;S.coins+=5;SFX.coin();}toast('🏆 New best rally: '+n+'!'+(c?' +5 🪙':'')+' Keep going!',2.2);change();}}
function tnMiss(){const n=TN.n;TN.st='miss';TN.t=1.7;TN.n=0;tnHudUpd();SFX.aww();
  toast(n>=3?'🎾 A rally of '+n+'! Great job! Let\'s go again! 💪':pick(['Ooh, so close! 🎾','Almost! You can do it! 💪','Oopsie! The next one is yours! 🎾']),2.2);
  if(TN.C)floatText(pick(['💪','😊','👍']),TN.C.x,2.45,TN.C.z,{h:.45});}
function updTennis(dt){const C=TN.C;if(!C)return;const L=LOC.beach;
  /* Coach Sunny walks about; while you play she runs to the ball */
  let tx=C.x,tz=C.z;if(C.path.length)[tx,tz]=C.path[0];else if(TN.on){tx=TN.cx;tz=TN.cz;}
  const dx=tx-C.x,dz=tz-C.z,d=Math.hypot(dx,dz),mv=d>.05;
  if(mv){const k=Math.min(d,(TN.on?4.6:2.2)*dt);C.x+=dx/d*k;C.z+=dz/d*k;}else if(C.path.length)C.path.shift();
  C.face=(mv&&!TN.on)?Math.atan2(dx,dz):Math.atan2(P.x-C.x,P.z-C.z);
  C.p.root.position.set(C.x-L.ox,0,C.z-L.oz);C.p.root.rotation.y=angLerp(C.p.root.rotation.y,C.face,Math.min(1,dt*8));animPerson(C.p,dt,mv,TN.on?1.4:1);
  const arm=C.p.arms[0];if(C.sw>0){C.sw-=dt;const s=1-Math.max(0,C.sw)/.4;arm.rotation.x=-.4-Math.sin(s*Math.PI)*1.3;arm.rotation.z=.9-s*1.8;}else{arm.rotation.x=TN.on?-.55:-.25;arm.rotation.z*=.8;}
  TN.cc.cx=C.x;TN.cc.cz=C.z;TN.tk.x=C.x;TN.tk.z=C.z;
  if(!TN.on)return;
  /* your racket: get ready while the swing is on, then follow through */
  if(TN.sw>0){TN.sw-=dt;if(TN.sw<=0)TN.fs=.36;TN.s+=(.45-TN.s)*Math.min(1,dt*25);}
  else if(TN.fs>0){TN.fs-=dt;TN.s+=((TN.fs>.22?1:0)-TN.s)*Math.min(1,dt*(TN.fs>.22?30:9));}else TN.s+=(0-TN.s)*Math.min(1,dt*9);
  if(TN.rk){const g=TN.rk,s=TN.s,k=clamp(camera.aspect/1.25,.5,1);g.scale.setScalar(.7+.2*k);g.position.set((.6-.7*s)*k+(1-k)*.3*(1-s),-.66+.12*Math.sin(s*Math.PI)-(1-k)*.24*(1-s),-.9-.1*s);g.rotation.set(-.45*s,.5*s,.1+s);}
  const b=TN.b,hot=tnReach();if(hot!==TN.hot){TN.hot=hot;$('act').classList.toggle('hot',hot);}
  /* the ball (also while the coach bounces it before she hits) */
  let bx=0,by=0,bz=0,show=!!b;if(b){bx=b.x;by=b.y;bz=b.z;}
  else if(TN.st==='wait'&&TN.t<.55){show=true;bx=C.x-.3;bz=C.z+.35;const u=TN.t/.55;by=TBR+.9*Math.abs(Math.cos(u*Math.PI));if(u<.5&&!TN.fb){TN.fb=1;SFX.bounce();}}
  TN.ball.visible=TN.sh.visible=show;if(show){TN.ball.position.set(bx-L.ox,by,bz-L.oz);for(const m of TN.ball.children)m.rotation.x+=dt*9;if(TN.sq>0)TN.sq-=dt;const q=Math.max(0,TN.sq)/.12;TN.ball.scale.set(1+.3*q,1-.35*q,1+.3*q);
    TN.sh.position.set(bx-L.ox,.05,bz-L.oz);const hs=1+by*.18;TN.sh.scale.set(hs,hs,hs);TN.sh.material.opacity=Math.max(.1,.3-by*.06);}
  if(UI.open||fading||CUT||TUT||DTUT||AW.on||NET.lost)return;
  const pu=tnU(P.x),pv=tnV(P.z);if(pu<-12.5||pu>.3||Math.abs(pv)>THW+1.3){tnStop('off');return;}
  /* a gentle helper: if you stand still, you slide over to the ball and look at it */
  const K=IN.keys,inp=(IN.joy.id!==null&&Math.hypot(IN.joy.x,IN.joy.y)>.15)||K.KeyW||K.KeyA||K.KeyS||K.KeyD||K.ArrowUp||K.ArrowDown;
  if(TN.st==='toP'&&b&&b.vx<-.5&&!inp){const zp=b.z+b.vz*(P.x-b.x)/b.vx,e=zp-P.z;if(Math.abs(e)>.15)[P.x,P.z]=collideXZ(P.x,P.z+Math.sign(e)*Math.min(Math.abs(e),1.9*dt),.3,CUR,solids());}
  if((TN.st==='toP'||TN.st==='wait')&&IN.look.id===null&&!K.ArrowLeft&&!K.ArrowRight){const fx=b?b.x:C.x,fz=b?b.z:C.z;if(fx-P.x>3)P.yaw=angLerp(P.yaw,Math.atan2(-(fx-P.x),-(fz-P.z)),Math.min(1,dt*1.6));if(Math.abs(P.pitch+.06)>.35)P.pitch=lerp(P.pitch,-.06,Math.min(1,dt*2));}
  tnBall(dt);
  if(TN.st==='wait'){TN.cx=L.ox+TCX+THL+.7;TN.cz=L.oz+TCZ+clamp(pv*.4,-2,2);TN.t-=dt;if(TN.t<=0){TN.fb=0;tnToYou(C.x-.3,1.0,C.z+.35);}}
  else if(TN.st==='toP'){TN.cx=L.ox+TCX+THL+.7;if(TN.sw>0&&tnReach())tnHit();else if(b.bn>=2||b.x<P.x-1.1||tnU(b.x)<-THL-3.5)tnMiss();}
  else if(TN.st==='toC'){if(b.bn>=2||(b.bn>=1&&b.t>=.42))tnToYou(b.x,Math.max(b.y,.9),b.z);}
  else if(TN.st==='miss'){if(b&&(tnU(b.x)<-12.2||Math.abs(tnV(b.z))>6.2||b.vy===0))TN.b=null;TN.t-=dt;if(TN.t<=0){TN.st='wait';TN.t=.9;TN.b=null;}}}

/* ---- the park fountain ---- */
let CURTAIN=null,JET=null,FTN=null;
function streakTex(up){const c=document.createElement('canvas');c.width=64;c.height=256;const x=c.getContext('2d');x.fillStyle='rgba(255,255,255,.28)';x.fillRect(0,0,64,256);
  for(let i=0;i<30;i++){const px=Math.random()*64,w=2+Math.random()*5,len=40+Math.random()*110,py=Math.random()*256;
    for(const off of[0,-256,256]){const g=x.createLinearGradient(0,py+off,0,py+off+len);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(px,py+off,w,len);}}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(up?1:6,1);return t;}
function buildFountain(st,L,fx,fz){
  const stone='#ece4f6',stone2='#d6c9ea';
  cyl(st,4.6,4.85,.55,stone,fx,0,fz,{seg:44,ol:.04});
  const rim=new THREE.Mesh(new THREE.TorusGeometry(4.58,.22,10,56),mat(stone));rim.rotation.x=Math.PI/2;rim.position.set(fx,.66,fz);st.add(rim);
  const rimO=new THREE.Mesh(new THREE.TorusGeometry(4.58,.26,10,56),OL);rimO.rotation.x=Math.PI/2;rimO.position.copy(rim.position);st.add(rimO);
  disc(st,4.42,null,fx,.6,fz,{mat:WATER,seg:56});
  const r=seeded(21);for(let i=0;i<16;i++){const a=r()*TAU,d=2.5+r()*1.7;cyl(st,.075,.075,.015,'#ffd45c',fx+Math.cos(a)*d,.565,fz+Math.sin(a)*d,{seg:10,ol:false});}
  cyl(st,.75,.95,1.25,stone,fx,.55,fz,{seg:22});
  for(let i=0;i<8;i++){const a=i/8*TAU;box(st,.18,1.1,.18,stone2,fx+Math.cos(a)*.86,.6,fz+Math.sin(a)*.86,{ry:-a,ol:.02});}
  cyl(st,2.1,1.25,.45,stone,fx,1.3,fz,{seg:36,ol:.035});disc(st,1.96,null,fx,1.72,fz,{mat:WATER,seg:36});
  cyl(st,.32,.42,1.15,stone,fx,1.75,fz,{seg:16});
  cyl(st,1.05,.6,.3,stone,fx,2.9,fz,{seg:28,ol:.03});disc(st,.95,null,fx,3.17,fz,{mat:WATER,seg:28});
  cyl(st,.12,.18,.32,stone2,fx,3.2,fz,{seg:12});sph(st,.24,'#ff9ec4',fx,3.7,fz,{ws:14,hs:10});
  colC(L,fx,fz,4.9);
  CURTAIN=new THREE.MeshBasicMaterial({color:'#d6f2ff',map:streakTex(false),transparent:true,opacity:.8,depthWrite:false,side:THREE.DoubleSide});
  JET=new THREE.MeshBasicMaterial({color:'#e8f8ff',map:streakTex(true),transparent:true,opacity:.85,depthWrite:false,side:THREE.DoubleSide});
  const c1=new THREE.Mesh(new THREE.CylinderGeometry(1.07,1.1,1.45,36,1,true),CURTAIN);c1.position.set(fx,3.17-.725,fz);L.dyn.add(c1);
  const c2=new THREE.Mesh(new THREE.CylinderGeometry(2.13,2.18,1.15,56,1,true),CURTAIN);c2.position.set(fx,1.72-.575,fz);L.dyn.add(c2);
  const jet=new THREE.Mesh(new THREE.CylinderGeometry(.05,.1,1.1,10,1,true),JET);jet.position.set(fx,3.9+.55,fz);L.dyn.add(jet);
  const dropM=new THREE.MeshBasicMaterial({color:'#e9f9ff'});
  const dropI=new THREE.InstancedMesh(new THREE.SphereGeometry(.05,6,5),dropM,34);dropI.frustumCulled=false;L.dyn.add(dropI);const drops=[];for(let i=0;i<34;i++){dropI.setMatrixAt(i,_dm.makeTranslation(0,-9,0));drops.push({i,x:0,y:-9,z:0,vx:0,vy:0,vz:0});}   /* 💧 the 34 drops are one instanced mesh: one draw instead of 34 (run 4, stage 3: the town's drawing work stays inside the agreed limit) */
  const rings=[];for(let i=0;i<12;i++){const m=new THREE.Mesh(new THREE.RingGeometry(.16,.24,28),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0,depthWrite:false}));m.rotation.x=-Math.PI/2;L.dyn.add(m);rings.push({m,t:9,y:.61});}
  FTN={fx,fz,drops,rings,rt:0,dropI};
}
const _dm=new THREE.Matrix4();
function ftnRing(x,y,z){const r=FTN.rings.find(q=>q.t>=1);if(!r)return;r.t=0;r.y=y;r.m.position.set(x,y,z);}
function updFountain(dt){if(!FTN)return;const {fx,fz}=FTN;
  CURTAIN.map.offset.y+=dt*1.7;JET.map.offset.y-=dt*2.6;
  for(const d of FTN.drops){
    if(d.y<-5){const a=Math.random()*TAU,sp=.5+Math.random()*1.1;d.x=fx;d.y=4.9+Math.random()*.2;d.z=fz;d.vx=Math.cos(a)*sp;d.vz=Math.sin(a)*sp;d.vy=.6+Math.random()*1.4;}
    d.vy-=7*dt;d.x+=d.vx*dt;d.y+=d.vy*dt;d.z+=d.vz*dt;
    const rr=Math.hypot(d.x-fx,d.z-fz),floor=rr<1?3.17:rr<2.05?1.72:.6;
    if(d.vy<0&&d.y<=floor){if(Math.random()<.35)ftnRing(d.x,floor+.01,d.z);d.y=-9;}
    FTN.dropI.setMatrixAt(d.i,_dm.makeTranslation(d.x,d.y,d.z));}
  FTN.dropI.instanceMatrix.needsUpdate=true;
  FTN.rt-=dt;if(FTN.rt<=0){FTN.rt=.12;const a=Math.random()*TAU;ftnRing(fx+Math.cos(a)*2.2,.61,fz+Math.sin(a)*2.2);if(Math.random()<.5){const b=Math.random()*TAU;ftnRing(fx+Math.cos(b)*1.12,1.73,fz+Math.sin(b)*1.12);}}
  for(const r of FTN.rings){if(r.t>=1){r.m.visible=false;continue;}r.t+=dt*.9;r.m.visible=true;const s=1+r.t*4;r.m.scale.set(s,s,s);r.m.material.opacity=.7*(1-r.t);}
}

/* ---- interiors ---- */
let WALL_M,FLOOR_M;
const FLOORS={wood:'Light wood',dark:'Dark wood',pink:'Pink tiles',mint:'Mint tiles',check:'Lilac check',carpet:'Blue carpet'};
const WALLS=['#ffd6e0','#fff1b8','#c9f2e3','#d9e8ff','#e6dbff','#ffe0c4','#ffffff','#b8e3c8'];
function floorTex(kind){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
  if(kind==='wood'||kind==='dark'){const base=kind==='wood'?['#e6c49c','#dcb88d','#eccfab']:['#a8714a','#9a663f','#b57c52'];for(let i=0;i<8;i++){x.fillStyle=base[i%3];x.fillRect(0,i*32,256,32);x.fillStyle='rgba(61,44,94,.35)';x.fillRect(0,i*32,256,3);const off=(i*97)%256;x.fillRect(off,i*32,3,32);x.fillRect((off+128)%256,i*32,3,32);}}
  else if(kind==='carpet'){x.fillStyle='#a9c8ff';x.fillRect(0,0,256,256);x.fillStyle='rgba(255,255,255,.4)';const r=seeded(5);for(let i=0;i<140;i++){x.beginPath();x.arc(r()*256,r()*256,2.2,0,TAU);x.fill();}}
  else{const [a,b]=kind==='pink'?['#ffd1e0','#ffeaf2']:kind==='mint'?['#c4f0df','#e8fbf3']:kind==='pizza'?['#fff7ee','#ffcdbf']:['#ffffff','#d9cbff'];for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.fillStyle=(i+j)%2?a:b;x.fillRect(i*64,j*64,64,64);}x.strokeStyle='rgba(61,44,94,.22)';x.lineWidth=3;for(let i=0;i<=4;i++){x.beginPath();x.moveTo(i*64,0);x.lineTo(i*64,256);x.stroke();x.beginPath();x.moveTo(0,i*64);x.lineTo(256,i*64);x.stroke();}}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,2.5);t.anisotropy=4;return t;}
/* 🪜 an open stairwell: 4 walls seen from inside (sharing the colour of the room's wall paint) and a ceiling on top (top=1) or a floor at the bottom */
function shaftAt(g,w,h,d,x,y,z,wallM,capC,top){const b=new THREE.BoxGeometry(w,h,d),ix=b.index.array,keep=[];
  for(const gr of b.groups)if(gr.materialIndex!==2&&gr.materialIndex!==3)for(let i=gr.start;i<gr.start+gr.count;i++)keep.push(ix[i]);
  b.setIndex(keep);b.clearGroups();const ps=b.attributes.position,C=new Float32Array(ps.count*3);   /* a soft shade: a pit gets darker going down, a shaft a little darker going up */
  for(let i=0;i<ps.count;i++){const t=ps.getY(i)/h+.5,k=top?1-.2*t:.55+.45*t;C[i*3]=C[i*3+1]=C[i*3+2]=k;}b.setAttribute('color',new THREE.BufferAttribute(C,3));
  const sm=toon({side:THREE.BackSide,vertexColors:true});sm.color=wallM.color;const m=new THREE.Mesh(b,sm);m.position.set(x,y,z);m.userData.keep=1;g.add(m);
  const c=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({color:capC}));c.rotation.x=top?Math.PI/2:-Math.PI/2;c.position.set(x,y+(top?h/2:-h/2),z);c.userData.keep=1;g.add(c);return m;}
function shell(L,g,W,D,H,wallMat,floorMat,ceil,into,gap){const T=into||L.g;
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(W,D),floorMat);fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;fl.userData.keep=1;T.add(fl);
  const ce=new THREE.Mesh(new THREE.PlaneGeometry(W+.4,D+.4),new THREE.MeshBasicMaterial({color:ceil}));ce.rotation.x=Math.PI/2;ce.position.y=H;ce.userData.keep=1;T.add(ce);   /* (20 cm into the walls all round: edge to edge with the walls' faces, the seam showed a dotted line of gaps; run 4, stage 3) */
  /* gap: a doorway (half its width) in the middle of the west wall, to the big house's stairs */
  const t=.3,ws=gap?D/2-gap:D,wz=gap?[-(gap+ws/2),gap+ws/2]:[0];box(g,W+2*t,H,t,null,0,0,-D/2-t/2,{mat:wallMat,ol:false});box(g,W+2*t,H,t,null,0,0,D/2+t/2,{mat:wallMat,ol:false});
  for(const z of wz)box(g,t,H,ws,null,-W/2-t/2,0,z,{mat:wallMat,ol:false});if(gap)box(g,t,H-2.6,2*gap,null,-W/2-t/2,2.6,0,{mat:wallMat,ol:false});box(g,t,H,D,null,W/2+t/2,0,0,{mat:wallMat,ol:false});
  const bb='#ffffff';box(g,W,.14,.06,bb,0,0,-D/2+.03,{ol:.02});box(g,W,.14,.06,bb,0,0,D/2-.03,{ol:.02});for(const z of wz)box(g,.06,.14,ws,bb,-W/2+.03,0,z,{ol:.02});box(g,.06,.14,D,bb,W/2-.03,0,0,{ol:.02});
  cyl(g,.035,.035,.2,'#b9a6cf',0,H-.2,0,{seg:6,ol:false});cyl(g,.2,.42,.2,'#ffc6d9',0,H-.4,0,{seg:16,ol:false});cyl(g,.44,.44,.04,'#e48aab',0,H-.42,0,{seg:16,ol:false});sph(g,.16,null,0,H-.42,0,{mat:GLOW,ol:false,ws:12,hs:8});   /* a pink lamp shade with a darker rim on a short stem (no dark outline: from below, near the door, it showed as black wedges; run 4, stage 3: white on the cream ceiling it read as a faint smudge) */
  col(L,-W/2-1,-D/2-1,W/2+1,-D/2);col(L,-W/2-1,D/2,W/2+1,D/2+1);col(L,-W/2-1,-D/2,-W/2,D/2);col(L,W/2,-D/2,W/2+1,D/2);
}
function drawScore(){const L=LOC.city;if(!L||!L.score)return;const m=fbBoard()?{l:FB.sc[0],r:FB.sc[1]}:(typeof S!=='undefined'&&S&&S.match)||{l:0,r:0},{c,t}=L.score,x=c.getContext('2d'),W=c.width,H=c.height;
  x.fillStyle='#1f1638';x.fillRect(0,0,W,H);x.textAlign='center';x.textBaseline='middle';
  for(const [cx,col,name,n] of[[W*.25,'#5cc8ff','BLUE',m.l],[W*.75,'#ff7aa8','PINK',m.r]]){x.fillStyle=col;x.fillRect(cx-104,14,208,46);
    x.fillStyle='#ffffff';x.font=`800 34px ${FONT}`;x.fillText(name,cx,39);x.font=`800 130px ${FONT}`;x.fillStyle=col;x.fillText(String(Math.min(n,99)),cx,140);}
  x.fillStyle='#ffd45c';x.font=`800 90px ${FONT}`;x.fillText(':',W/2,132);t.needsUpdate=true;}
function newMatch(){S.match={l:0,r:0,v:((S.match&&S.match.v)||0)+1};drawScore();SFX.pop();toast('🏆 New match! Blue 0 – 0 Pink',2.6);}
let HOMEW=6,HOMED=5,HOMEGX=4.4;
/* 🪜 the big house's upstairs room sits UPX m east of the ground floor room; UPG = half the width of the stair doorway */
const UPX=40,UPG=.85;
function buildHome(){
  const L=makeLoc('home','in',300,0,[-6,-5,6,5]);
  WALL_M=toon({color:'#ffd6e0'});FLOOR_M=toon({map:floorTex('wood')});
  L.items=new THREE.Group();scene.add(L.items);
  homeShell(L,false);
  return L;
}
/* the rooms inside your house: 12x10 each. Floor 0 is the room everyone starts with; the big house adds floor 1 with the stairs in the west wall (night 3), and
   run 4 (item 22) adds one more floor every 10 decorating levels, up to 6. Floor k lives 40 m further along z (UPZ), so every floor has the same local layout and the
   stairs continue up in the same design. Only the floor you stand on is attached to the scene (its own shell and stairs), so a six-floor house draws like a one-floor one */
const UPZ=40;
function homeFloors(){return S&&S.bighouse?clamp(2+(S.home.xf|0),2,6):1;}   /* floors you own: 1, or 2 + the extra floors bought (S.home.xf) */
const flOf=(L,z)=>L&&L.fls&&L.fls.length>1?clamp(Math.round((z-L.oz)/UPZ),0,L.fls.length-1):0;   /* which floor a z is on */
/* the stairs between two floors, in one floor's group: up=1 the flight going up from this floor, up=0 the flight arriving from below (local coordinates, both at the west doorway) */
function stairsIn(g,up,W,H,wm,both){const n=12,sd=4.2/n,sr=H/n,x0=-W/2,t=.3,a=Math.atan2(H,4.2),zc=both?(up?-UPG/2:UPG/2):0,zd=both?UPG:2*UPG,zr=both&&!up?UPG-.07:-UPG+.07;   /* a floor with stairs both ways: the way up on the left half of the doorway, the way down on the right, each under its own plate (run 4, stage 3: the flight up hid the flight down) */
  for(const k of[-1,1])box(g,4.2,H,t,null,x0-2.1,0,k*(UPG+t/2),{mat:wm,ol:false});box(g,t,H,2*UPG+2*t,null,x0-4.2-t/2,0,0,{mat:wm,ol:false});
  for(let i=0;i<n-1+up;i++)box(g,sd,up?(i+1)*sr:H-(i+1)*sr,zd,'#d9a46c',x0-(i+.5)*sd,up?0:-H,zc,{ol:.012});
  shaftAt(g,4.2,up?3.2:H,zd,x0-2.1,up?H+1.6:-H/2,zc,wm,up?'#f7eef2':'#8f6b4c',up);   /* 🪜 walls in the room's paint (repainting changes them too) */
  if(!up)box(g,4.2,.1,zd,'#f7eef2',x0-2.1,H,zc,{ol:false});
  if(both&&!up){box(g,4.2,H+.95,.1,null,x0-2.1,-H,0,{mat:wm,ol:false});box(g,4.2,.08,.16,'#ffffff',x0-2.1,.95,0,{ol:.01});}   /* the low wall between the two ways, a white rail on top */
  for(const k of[-1,1])box(g,.1,2.7,.1,'#ffffff',x0+.04,0,k*(UPG+.05),{ol:.015});box(g,.1,.1,2*UPG+.2,'#ffffff',x0+.04,2.6,0,{ol:.015});
  box(g,Math.hypot(4.2,H),.07,.08,'#ffffff',x0-2.1,(up?H:-H)/2+.95,zr,{rz:up?-a:a,center:true,ol:.01});for(const u of[.12,.5,.88])box(g,.07,.92,.07,'#ffffff',x0-u*4.2,up?u*H:-u*H,zr,{ol:.01});   /* the rail's three posts (run 4, stage 3: it floated) */
  const pg=new THREE.Group();pg.userData.keep=1;g.add(pg);plate(pg,up?'⬆️ Upstairs':'⬇️ Downstairs','#ffffff','#3d2c5e',both?.84:1.0,.26,x0+.03,(2.6+H)/2,both?(up?-.44:.44):0,Math.PI/2,false,'⬇️ Downstairs');   /* (both plates in one letter size: run 4, stage 3) */
  {const y=up?H:-H,dw=both?.74:1.3;box(g,.07,2.1,dw,'#5fd4b0',x0-4.2+.04,y,zc,{ol:.015});box(g,.09,.5,both?.36:.5,'#bde9ff',x0-4.2+.05,y+1.35,zc,{ol:.012});sph(g,.045,'#ffd45c',x0-4.2+.1,y+1.0,zc+(both?.25:.42),{ws:6,hs:5,ol:false});plate(pg,up?'⬆️ Upstairs':'⬇️ Downstairs','#ffffff','#3d2c5e',both?.7:1.22,both?.24:.3,x0-4.2+.1,y+.72,zc,Math.PI/2,false,'⬇️ Downstairs');}}   /* 🚪 the stairs end at a door with a window and a knob (run 4, stage 3: they ran into a flat wall) */
/* every floor of a house (yours or a friend's): its own group, baked on its own, with its doors (floor 0), windows and stairs; flag = the inter tag ('hdoor' / 'vdoor') */
function houseFloors(L,n,W,D,H,wm,fm,wide,flag){const hw=W/2,hd=D/2,gx=wide?6.6:4.4,fls=[];
  for(let k=0;k<n;k++){const g=new THREE.Group(),sh=new THREE.Group();g.add(sh);g.position.set(0,0,UPZ*k);const F={k,g,sh,grid:null};fls.push(F);
    shell({ox:L.ox,oz:L.oz+UPZ*k,cols:L.cols},sh,W,D,H,wm,fm,'#f7eef2',g,n>1?UPG:0);
    if(k===0){doorAt(sh,0,hd-.02,Math.PI,'#5fd4b0',false,true);doorAt(sh,gx,-hd+.02,0,'#5fd4b0',false,true);
      for(const x of wide?[-6.5,-3,1.5]:[-3,1.5])windowIn(sh,x,1.0,-hd+.02,0);
      for(const z of wide?[-3.2,2.6]:[0])windowIn(sh,hw-.02,1.0,z,-Math.PI/2,'#7fdcb5');for(const z of wide?[-3.2,2.6]:(n>1?[-3,3]:[0]))windowIn(sh,-hw+.02,1.0,z,Math.PI/2,'#7fdcb5');   /* 🪟 with stairs no west window at z 0 (run 4, item 25) */
      if(n>1)for(const x of(wide?[-5,5]:[-2.7,2.7]))windowIn(sh,x,1.0,hd-.02,Math.PI);}
    else{{const RC=[['#ff9ec4','#ffd6e0'],['#7cc8ff','#dff3ff'],['#ffc95c','#fff2c4'],['#7fdcb5','#e2f7e6'],['#b79cff','#ead9ff']][k%5];box(sh,3.6,.008,2.5,RC[0],0,.002,0,{ol:.012});box(sh,3.0,.01,1.9,RC[1],0,.003,0,{ol:false});for(const zz of[-.55,0,.55])box(sh,2.4,.012,.12,RC[0],0,.004,zz,{ol:false});}   /* a striped rug with a border (it read as a big plate); flat under any rug you place (run 4 finish: a placed rug lay half under it) */for(const [bx,bz,bw,bd] of[[0,-hd+.04,W-.1,.07],[0,hd-.04,W-.1,.07],[hw-.04,0,.07,D-.1],[-hw+.04,-(hd+UPG)/2-.05,.07,hd-UPG-.1],[-hw+.04,(hd+UPG)/2+.05,.07,hd-UPG-.1]])box(sh,bw,.14,bd,'#ffffff',bx,0,bz,{ol:false});   /* a starter rug and white skirting on a new floor (run 4, stage 3: it looked bare) */
      for(const x of(W>13?[-6,-2,2,6]:[-4.5,-1.5,1.5,4.5]))windowIn(sh,x,1.0,-hd+.02,0);   /* (run 4, stage 3: evenly spaced) */for(const x of(W>13?[-5,0,5]:[-2.7,0,2.7]))windowIn(sh,x,1.0,hd-.02,Math.PI);
      for(const z of(D>11?[-3.2,2.6]:[0]))windowIn(sh,hw-.02,1.0,z,-Math.PI/2,'#7fdcb5');for(const z of(D>11?[-3.2,2.6]:[-3,3]))windowIn(sh,-hw+.02,1.0,z,Math.PI/2,'#7fdcb5');}
    const both=k<n-1&&k>0;if(k<n-1)stairsIn(sh,1,W,H,wm,both);if(k>0)stairsIn(sh,0,W,H,wm,both);
    bake(sh,false);
    const gh=new THREE.GridHelper(W,W*2,0xb79cff,0xd9c8ff);gh.scale.z=D/W;gh.position.set(0,.012,UPZ*k);gh.visible=false;L.g.add(gh);F.grid=gh;
    if(k<n-1)inter(L,{x:-hw+.9,z:UPZ*k-.6,r:1.6,icon:'⬆️',label:'Go upstairs',act:()=>hclimb(1),[flag]:1});
    if(k>0)inter(L,{x:-hw+.9,z:UPZ*k+.6,r:1.6,icon:'⬇️',label:'Go downstairs',act:()=>hclimb(-1),[flag]:1});}
  L.fls=fls;L.g.add(fls[0].g);L.vf=-1;L.grid=fls[0].grid;
  L.bounds={x1:L.ox-hw,z1:L.oz-hd,x2:L.ox+hw,z2:L.oz+UPZ*(n-1)+hd};return fls;}
function homeShell(L,n){n=clamp(n|0,1,6);if(L.nfl===n&&L.fls)return;L.nfl=n;L.big=n>1;
  if(L.fls)for(const F of L.fls){if(F.g.parent)F.g.parent.remove(F.g);F.g.traverse(o=>{if(o.geometry&&!o.userData.keep)o.geometry.dispose();});if(F.grid.parent)F.grid.parent.remove(F.grid);}
  const W=12,D=10,H=3.2;HOMEW=W/2;HOMED=D/2;HOMEGX=4.4;L.cols.length=0;L.inter=L.inter.filter(i=>!i.hdoor);
  houseFloors(L,n,W,D,H,WALL_M,FLOOR_M,false,'hdoor');
  inter(L,{x:0,z:HOMED-.7,r:1.9,icon:'🚪',label:'Go outside',act:()=>exitTo('home'),hdoor:1});
  inter(L,{x:HOMEGX,z:-HOMED+.7,r:1.8,icon:'🌱',label:'Go to your garden',act:()=>exitTo('home','back'),hdoor:1});
  DOORS.home.inside=[0,HOMED-1.3,0];DOORS.homeback.inside=[HOMEGX,-HOMED+1.4,Math.PI];
  if(FLOOR_M.map)FLOOR_M.map.repeat.set(HOMEW/2,HOMED/2);}
/* the floor you stand on in your house: 0 = ground floor */
const homeFl=()=>CUR===LOC.home?flOf(LOC.home,P.z):0;
/* a floor as a place to decorate: the home with that floor's z and grid */
function homeFloorL(k){const L=LOC.home;if(!k||!L.fls||!L.fls[k])return L;const o=Object.create(L);o.oz=L.oz+UPZ*k;o.grid=L.fls[k].grid;return o;}
/* only the floor you stand on is attached and draws its furniture (fewer draw calls on iPads) */
function floorVis(){const L=CUR;if(!L||!L.fls||L.fls.length<2||!L.items)return;const f=flOf(L,P.z);if(f===L.vf)return;L.vf=f;
  L.fls.forEach((F,k)=>{if(k===f){if(!F.g.parent)L.g.add(F.g);}else if(F.g.parent)L.g.remove(F.g);});
  for(const g of L.items.children)g.visible=(g.userData.fl|0)===f;}
/* up or down the stairs: the same step-by-step climb as in the flats, from this floor to the next */
function hclimb(dir){const L=CUR;if(CLIMB||CUT||fading||!L.fls||L.fls.length<2)return;const f=flOf(L,P.z),to=f+dir;if(to<0||to>=L.fls.length)return;if(DECO.on)decoEnd();P.sit=null;SFX.tap();
  const w=L===LOC.home?HOMEW:L.W,x0=L.ox-w,z0=L.oz+UPZ*f;
  CLIMB={t:0,L,dir,x0:P.x,z0:P.z,y0:P.yaw,p0:P.pitch,x1:x0-3.3,z1:z0,ya:Math.PI/2,h:3,st:0,fd:false,end:()=>{
    [P.x,P.z]=collideXZ(L.ox-w+2.6,L.oz+UPZ*to,.3,L);P.yaw=-Math.PI/2;P.pitch=0;P.cy=0;floorVis();bringFollowers(true);saveLocal();
    toast(dir<0?(to?'🏡 Down to floor '+(to+1):'🏡 Back downstairs'):L===LOC.home?(to===1?'🏡 Upstairs! Tap 🛋️ to decorate up here too.':'🏡 Floor '+(to+1)+'! Tap 🛋️ to decorate here too.'):L===LOC.pets?(dir>0?'🐾 Upstairs! Here are the animals 💗':'🛒 Downstairs: snacks, toys and pet clothes'):'🏡 Upstairs!',2.6);}};}

/* ===== 🏡 Friends Lane: the west road goes on past the edge of town, with a house lot for every player. Your house is here too ===== */
/* lots 0-5 are where old versions have them; 6-11 are further down the lane; when even more friends play, more lots appear */
const LANE_PLOTS=[[-97,-1],[-111,-1],[-125,-1],[-97,1],[-111,1],[-125,1],[-139,-1],[-153,-1],[-167,-1],[-139,1],[-153,1],[-167,1]].map(([X,s],j)=>({j,X,s}));
const LANE_MAX=30;   /* the lane stops growing at 30 lots */
/* your old house's yard in town (old versions still have it there); a friend standing there is shown at their house on Friends Lane */
const HOMELOT={x1:-23.6,x2:-10.4,z1:-27,z2:-6.8};
/* the part of that old yard where you could stand (front yard, house, garden). In town it is the Flower Corner now and nobody
   can stand in it, so a spot in here (in a save, or from an old version) always means "in your own yard" */
const YARDR={x1:-23.6,x2:-10.4,z1:-24.6,z2:-6.8},inYardR=(x,z)=>x>YARDR.x1&&x<YARDR.x2&&z>YARDR.z1&&z<YARDR.z2;
/* turn a spot in your yard into the same spot on lane lot j (south lots are turned around), and back */
function lotPt(j,x,z){const p=LANE_PLOTS[j];return p.s<0?[x+p.X+17,z]:[p.X-(x+17),-z];}
function lotBack(j,x,z){const p=LANE_PLOTS[j];return p.s<0?[x-p.X-17,z]:[p.X-x-17,-z];}
function lotRect(j,c){const a=lotPt(j,c.x1,c.z1),b=lotPt(j,c.x2,c.z2);return{x1:Math.min(a[0],b[0]),z1:Math.min(a[1],b[1]),x2:Math.max(a[0],b[0]),z2:Math.max(a[1],b[1])};}
const laneEnd=()=>LANE_PLOTS[LANE_PLOTS.length-1].X-13;   /* where the road ends (the newest lots are the furthest west) */
function buildLane(L,st){
  laneRoad(L,st,-84,laneEnd(),[-91,-104,-118,-132,-146,-160,-174]);
  for(const s of[-1,1]){box(st,.32,4.6,.32,'#ffffff',-84.6,0,s*4.45,{ol:.03});sph(st,.3,'#ffd45c',-84.6,4.85,s*4.45,{ws:10,hs:8});colC(L,-84.6,s*4.45,.25);}
  box(st,.26,1.05,9.5,'#ff7aa8',-84.6,4.0,0,{ol:.03});
  const sg=signPlane('🏡 Friends Lane',6.8,.82,'#ff7aa8','#ffffff');sg.position.set(-84.45,4.52,0);sg.rotation.y=Math.PI/2;L.g.add(sg);
  /* the end of the lane (a barrier and a hedge) moves along when the lane grows */
  const e=new THREE.Group();L.g.add(e);box(e,.4,.9,8.4,'#ffffff',.2,0,0,{ol:.03});for(let k=-3;k<=3;k+=2)box(e,.42,.3,.9,'#ff6b6b',.2,.45,k,{ol:false});box(e,.9,1.1,54.1,'#5fbf74',-1.35,0,0,{ol:.03});bake(e,true);
  L.laneE=e;L.laneC=[{z1:-82,x2:-80.4,z2:-26.15},{z1:26.15,x2:-80.4,z2:82},{z1:-26.15,z2:26.15},{z1:-4.2,z2:4.2}];L.cols.push(...L.laneC);laneEndSet(L);
  L.lane=[];for(const p of LANE_PLOTS)laneLot(L,st,p);
  buildYard(L);}
function laneEndSet(L){const x=laneEnd(),[a,b,c,d]=L.laneC;L.laneE.position.x=x;a.x1=b.x1=c.x1=x-3;c.x2=x-.9;d.x1=x;d.x2=x+.4;L.bounds.x1=x-1;}
/* a piece of the lane from xa to xb (xb is further west): road, pavements, hedges and street lamps */
function laneRoad(L,g,xa,xb,lamps){const ROAD='#8c90b4',SIDE='#f3e7df',CURB='#ddcdd0',cx=(xa+xb)/2,len=xa-xb,hx=xa>-85?-80.3:xa-.9;
  flat(g,len,8,ROAD,cx,.02,0);
  for(const s of[-1,1]){flat(g,len,3,SIDE,cx,.03,s*5.5);box(g,len,.16,.14,CURB,cx,-.08,s*4,{ol:.015});box(g,hx-xb+.9,1.1,.9,'#5fbf74',(hx+xb-.9)/2,0,s*26.6,{ol:.03});}
  for(let t=xb+2;t<=xa-1;t+=3.2)box(g,1.4,.012,.16,'#ffffff',t,.03,0,{ol:false});
  for(const x of lamps)for(const s of[-1,1]){lampPost(g,x,s*4.55);colC(L,x,s*4.55,.16);}}
/* what every lot has: a front fence, a little path, a mailbox and a sign. A house, flower beds and a name come with an owner */
function laneLot(L,g,p){const j=p.j,P2=(x,z)=>lotPt(j,x,z),ry=p.s<0?0:Math.PI;
  const F=(a,b,c,d)=>{const A=P2(a,b),B=P2(c,d);fence(g,A[0],A[1],B[0],B[1],L);};
  F(-21.6,-8.2,-17.9,-8.2);F(-16.1,-8.2,-12.4,-8.2);F(-21.6,-8.2,-21.6,-11.3);F(-12.4,-8.2,-12.4,-11.3);
  for(let i=0;i<4;i++){const [x,z]=P2(-17,-8.8-i*.72);disc(g,.42,'#e9e0f7',x,.03,z,{seg:16});}
  {const [x,z]=P2(-15.4,-7.6);mailbox(g,x,z,ry);colC(L,x,z,.25);}
  const [sx,sz]=P2(-20.4,-7.6);box(g,.14,1.06,.14,'#9a6a43',sx,0,sz,{ol:.02});box(g,2.35,.95,.12,'#ffffff',sx,1.1,sz,{ol:.03});colC(L,sx,sz,.15);   /* (the post stops under the board: it can't poke through the name) */
  const lg=new THREE.Group();L.g.add(lg);const [hx,hz]=P2(-17,-15),A=P2(-21.6,-18.6),B=P2(-12.4,-11.4),[ix,iz]=P2(-17,-10.5),[ox,oz]=P2(-17,-9.4);
  L.lane.push({j,X:p.X,s:p.s,g:lg,hx,hz,ry,sx,sz:sz+(p.s<0?.085:-.085),col:{x1:Math.min(A[0],B[0]),z1:Math.min(A[1],B[1]),x2:Math.max(A[0],B[0]),z2:Math.max(A[1],B[1])},
    door:[ox,oz,p.s<0?Math.PI:0],sign:null,key:null});
  inter(L,{x:ix,z:iz,r:3.0,icon:()=>laneIcon(j),label:()=>laneLabel(j),act:()=>laneDoor(j),when:()=>!!LANE.own[j]});}
/* more friends than lots: two more lots appear at the end of the lane (with road, hedges and a street lamp). You always get one */
function laneGrow(mine){const L=LOC.city;if(LANE_PLOTS.length>=LANE_MAX+(mine?2:0))return false;
  const xa=laneEnd(),X=LANE_PLOTS[LANE_PLOTS.length-1].X-14,g=new THREE.Group();L.g.add(g);
  for(const s of[-1,1]){const p={j:LANE_PLOTS.length,X,s};LANE_PLOTS.push(p);laneLot(L,g,p);}
  const xb=laneEnd();laneRoad(L,g,xa,xb,[xb+6]);bake(g,true);
  g.add(glowMesh(glowGeo([-1,1].flatMap(s=>[[xb+6,3.21,s*4.55,.8,[.5,.38,.18]],[xb+6,.1,s*4.55,4.4,4.4,[.3,.23,.11]]]))));
  laneEndSet(L);return true;}
/* 🌸 the Flower Corner: where your house stood in town before it moved to Friends Lane. A garden to look at over a low fence */
function flowerCorner(L,st){const x1=-23.4,x2=-10.6,z1=-24.5,z2=-7.0,HG='#5fbf74',r=seeded(31);
  flat(st,x2-x1,z2-z1,'#a2e48a',(x1+x2)/2,.012,(z1+z2)/2);
  /* the hedges: the back one runs the whole width and is a little taller, so the side hedges' ink can't cross on its top; their ink shells
     start just above the grass, so no dark line flickers along their feet */
  /* 🚪 run 4, job 4 (the holiday spot): the fence has a gate at x -17 (where the stepping stones start). In a holiday month the gate stands open and you can walk in;
     in other months it is closed and the corner is the flower garden to look at. Every hedge, the tree, the bench, the fountain, the mounds and the bushes are solid on their own */
  fence(st,x1,z2,FC.gx-FC.gw,z2,L);fence(st,FC.gx+FC.gw,z2,x2,z2,L);fcGateBuild(L,st);
  for(const x of[x1,x2]){hbox(st,.7,.8,z2-z1-.35,HG,x,(z1+.35+z2)/2,.03);col(L,x-.4,z1-.4,x+.4,z2+.1);}hbox(st,x2-x1+.7,.86,.7,HG,(x1+x2)/2,z1,.03);col(L,x1-.4,z1-.4,x2+.4,z1+.4);
  tree(st,-20.2,-18.6,1.1);colC(L,-20.2,-18.6,.36);bench(st,-17.4,-15.6,0);col(L,-18.3,-15.95,-16.5,-15.3);   /* (the bench has two seats now that you can reach it) */
  for(const [x,z] of [[-17,-7.9],[-17.35,-9.25],[-16.95,-10.6],[-17.3,-11.95],[-17.05,-13.3],[-17.35,-14.6]])disc(st,.36,'#e9e0f7',x,.03,z,{seg:14});
  {const x=-13.4,z=-16.4;cyl(st,.1,.14,.75,'#e9e0f7',x,0,z,{seg:10,ol:.015});cyl(st,.46,.3,.15,'#e9e0f7',x,.75,z,{seg:16,ol:.015});disc(st,.38,'#9fd8f2',x,.905,z,{seg:16});colC(L,x,z,.55);}
  for(const [x,z,R] of [[-21.2,-9.7,1.1],[-12.8,-9.7,1.1],[-12.9,-21.6,1.2],[-21.3,-22.3,1.0],[-15.5,-20.2,.9]]){sph(st,R,'#6cc97c',x,0,z,{s:[1,.32,1],ws:12,hs:6});RAISED.push({x,z,R,h:R*.32});colC(L,x,z,R*.9);
    for(let k=0;k<Math.round(R*13);k++){const a=r()*TAU,d=Math.sqrt(r())*R*.8;sph(st,.09,FLOWER_COLS[k%5],x+Math.cos(a)*d,.2+(1-d/R)*.12+R*.06,z+Math.sin(a)*d,{ws:6,hs:4,ol:false});}}
  for(const [x,z] of [[-22.2,-13.8],[-11.8,-13.4]]){const c='#5fbf74';sph(st,.6,c,x,.4,z,{ws:10,hs:8});sph(st,.45,c,x+.45,.32,z+.2,{ws:10,hs:8});sph(st,.42,c,x-.35,.3,z-.25,{ws:10,hs:8});colC(L,x,z,.8);}
  for(const x of[-22.05,-19.95]){box(st,.1,1.55,.1,'#ffffff',x,0,-7.42,{ol:.015});colC(L,x,-7.42,.1);}box(st,2.3,.62,.08,'#ffffff',-21,1.05,-7.3,{ol:.02});   /* (the posts stand just behind the board: their faces ran through it and through the sign, and flickered at its ends; run 4, stage 3) */
  const sg=signPlane('🌸 Flower Corner',2.15,.5,'#ff9ec4','#ffffff');sg.position.set(-21,1.36,-7.25);L.g.add(sg);
  for(const [x,z] of [[-14.2,-9.6],[-20.3,-14.6],[-15.0,-15.6],[-19.8,-19.6],[-16.9,-23.6]])colC(L,x,z,.12);}   /* the spooky path's lamps (October) stand at these spots */
/* 🚪 the Flower Corner gate: a little picket gate in the fence gap; open (folded back inside, flat along the fence) in a holiday month, closed (and solid) otherwise. holCheck calls fcGate (run 4, stage 3: it swung out over the pavement) */
const FC={gx:-17,gw:.9,z:-7,g:null,open:null,col:null,L:null,lamps:[]};
function fcGateBuild(L,st){const g=new THREE.Group();g.position.set(FC.gx-FC.gw,0,FC.z);L.g.add(g);FC.g=g;FC.L=L;const w=2*FC.gw-.1;
  for(let i=0;i<=4;i++)box(g,.07,.78,.07,'#ffffff',.08+i*(w-.16)/4,0,0,{ol:.015});for(const y of[.28,.58])box(g,w,.07,.05,'#ffffff',w/2,y,0,{ol:.015});bake(g,true);
  FC.col={x1:L.ox+FC.gx-FC.gw-.05,z1:L.oz+FC.z-.1,x2:L.ox+FC.gx+FC.gw+.05,z2:L.oz+FC.z+.1};fcGate(false);}
function fcGate(open){open=!!open;if(FC.open===open||!FC.g)return;FC.open=open;FC.g.rotation.y=open?Math.PI-.05:0;FC.g.position.z=FC.z-(open?.14:0);const i=FC.L.cols.indexOf(FC.col);if(open){if(i>=0)FC.L.cols.splice(i,1);}else if(i<0)FC.L.cols.push(FC.col);}
const fcOpen=()=>!!FC.open;
/* 🌱 your yard on Friends Lane: the garden behind your house, its gate, the back door, the mailbox and the "Bigger house!" sign.
   It is built once at the old town-yard spots (the same numbers old saves use) and put on your lot; it moves along if your lot changes */
const YARD={g:null,gin:null,cols:[],wc:[],ints:[],on:false,j:null,plaque:null};
/* 🌱 the seed spots in the yard (the old town-yard frame; lotPt moves them to your lot). Friends' lots draw the same spots from their presence (gd) */
const YARD_PLOTS=[[0,-21,-20.9],[1,-18.3,-20.9],[2,-15.6,-20.9],[3,-21,-23.0],[4,-18.3,-23.0],[5,-15.6,-23.0]];
/* 🪴 run 4, item 22: 30 more seed spots: pots along the inside of the fence (never on the way from the gate or the back door, never by the shed), six more at gardening level 10, 20, 30, 40 and 50 */
const YARD_POTS=[[-21.3,-18.95],[-20.6,-18.95],[-19.9,-18.95],[-19.2,-18.95],[-18.5,-18.95],[-17.8,-18.95],
  [-17.1,-18.95],[-16.4,-18.95],[-15.7,-18.95],[-22.55,-20.0],[-22.55,-20.7],[-22.55,-21.4],
  [-22.55,-22.1],[-22.55,-22.8],[-22.55,-23.5],[-22.55,-24.1],[-21.9,-24.15],[-21.2,-24.15],
  [-20.5,-24.15],[-19.8,-24.15],[-19.1,-24.15],[-18.4,-24.15],[-17.7,-24.15],[-17.0,-24.15],
  [-16.3,-24.15],[-15.6,-24.15],[-14.9,-24.15],[-10.95,-20.4],[-10.95,-21.1],[-10.95,-21.8]].map(([x,z],k)=>[6+k,x,z]);
const YARD_ALL=YARD_PLOTS.concat(YARD_POTS);
const plotGate=i=>i<6?1:10*(1+Math.floor((i-6)/6));   /* the gardening level a spot needs: beds 1, pots 10, 20, 30, 40, 50 */
const plotOpen=i=>!!S&&sk('garden').lv>=plotGate(i);
function gardenSnap(){if(!S||!Array.isArray(S.garden))return null;const out=[];S.garden.forEach((st,i)=>{if(st&&st.seed&&SEEDS[st.seed])out.push(i+','+st.seed+','+plotStage(st));});return out.length?out.join(';'):null;}   /* "spot,seed,stage;…" (run 4, job 2) */
function buildYard(L){const g=new THREE.Group(),gin=new THREE.Group(),st=new THREE.Group(),FL={cols:YARD.cols,ox:0,oz:0};
  gin.position.set(17,0,15);g.add(gin);gin.add(st);L.g.add(g);g.visible=false;YARD.g=g;YARD.gin=gin;
  flat(st,12.3,6.0,'#a2e48a',-16.75,.012,-21.55);
  fence(st,-23,-18.5,-23,-24.6,FL);fence(st,-23,-24.6,-10.5,-24.6,FL);fence(st,-10.5,-24.6,-10.5,-18.5,FL);fence(st,-23,-18.5,-21.6,-18.5,FL);
  /* the garden gate is beside the house, under a little arch; stepping stones lead there from the street */
  for(const x of[-12.32,-10.58]){box(st,.12,2.05,.12,'#ffffff',x,0,-18.5,{ol:.02});colC(FL,x,-18.5,.1);}box(st,1.9,.12,.16,'#ffffff',-11.45,1.98,-18.5,{ol:.02});box(st,1.62,.5,.06,'#ffffff',-11.45,2.05,-18.5,{ol:.02});
  const gs=signPlane('🌱 My Garden',1.5,.42,'#5fd4b0','#ffffff'),gb=new THREE.Mesh(gs.geometry,gs.material);gs.position.set(-11.45,2.3,-18.455);gb.position.set(-11.45,2.3,-18.545);gb.rotation.y=Math.PI;gin.add(gs,gb);   /* readable from both sides */
  for(let k=0;k<8;k++)disc(st,.36,'#e9e0f7',-11.45,.03,-7.6-k*1.4,{seg:14});
  doorAt(st,-14,-18.52,Math.PI,'#5fd4b0');
  {BENCH_SKIP=-1;const yb=bench(st,-20.0,-9.1,Math.PI);BENCH_SKIP=0;const B=BENCHES[BENCHES.length-1];B.x0=-20.0;B.z0=-9.1;B.ry0=Math.PI;for(const q of B.seats){q.lx=q.x;q.lz=q.z;}colC(FL,-20.0,-9.1,.8);}   /* 🪑 a bench in your front yard */
  L.plots=[];for(const [i,x,z] of YARD_PLOTS){box(st,1.8,.16,1.2,'#b07a52',x,0,z,{ol:.02});col(FL,x-.92,z-.62,x+.92,z+.62);L.plots.push({i,x,z});}
  for(const [i,x,z] of YARD_POTS){cyl(st,.26,.2,.3,'#c9805a',x,0,z,{seg:10,ol:.015});cyl(st,.29,.29,.05,'#b8704c',x,.28,z,{seg:10,ol:.012});colC(FL,x,z,.32);L.plots.push({i,x,z,pot:1});}   /* 🪴 the pots */
  {const pots=L.plots.filter(p=>p.pot);let run=[];const end=()=>{if(run.length)run[Math.floor((run.length-1)/2)].lock=1;run=[];};pots.forEach((p,k)=>{const q=pots[k-1];if(q&&(plotGate(p.i)!==plotGate(q.i)||Math.hypot(p.x-q.x,p.z-q.z)>1.2))end();run.push(p);});end();}   /* 🔒 one lock plate in the middle of each row of pots of one level (run 4, stage 3) */
  /* the shed stands beside the arch's way (not right behind it): its door, the seed box and the 🌱 Seeds sign face the arch */
  box(st,1.6,2.0,1.4,'#ffd6e0',-13.4,0,-23.3);prism(st,1.9,1.8,.75,'#ff7aa8',-13.4,2.0,-23.3,{ry:Math.PI/2});box(st,.7,1.6,.06,'#5fd4b0',-13.75,0,-22.58,{ol:.015});col(FL,-14.3,-24.05,-12.5,-22.55);
  box(st,.8,.45,.5,'#c98f5e',-12.95,0,-22.35);for(let k=0;k<4;k++)box(st,.14,.2,.04,['#ff7aa8','#ffd45c','#5fd4b0','#ff8a6b'][k],-13.25+k*.2,.45,-22.35,{rx:-.2,ol:.01});col(FL,-13.4,-22.65,-12.5,-22.05);
  const ss=signPlane('🌱 Seeds',.8,.3,'#ffffff','#3d2c5e');ss.position.set(-13,1.75,-22.57);gin.add(ss);
  cyl(st,.14,.16,.28,'#7cc8ff',-22.4,0,-19.3,{seg:12,ol:.015});cone(st,.04,.3,'#7cc8ff',-22.25,.25,-19.3,{rz:-1.0,seg:6,ol:.012});
  const pq=signPlane('Bigger house!',1.4,.36,'#ff7aa8','#ffffff');pq.position.set(-20.4,.8,-7.44);gin.add(pq);YARD.plaque=pq;   /* under your name sign, until you buy the big house */
  bake(st,true);
  const yi=(x,z,o)=>yardInt(inter(L,Object.assign({x,z},o)));
  yi(-14,-19.3,{r:1.9,icon:'🏠',label:'Go inside your house',act:()=>enter('home','back')});
  yi(-12.95,-21.4,{r:1.8,icon:'🌱',label:'Buy seeds',act:()=>openShop('seeds')});
  yi(-15.4,-7.1,{r:1.8,icon:'📬',label:()=>S.hp&&hpOn()?'🎉 Mailbox (your party is on!)':'Mailbox: mail or a party',act:hpMailMenu})   /* 🎉 run 4, job 17: 📬 Check mail or 🎉 Host a party */;
  yi(-20.4,-6.8,{r:1.7,icon:'🏡',label:()=>homeFloors()>=6?'Your big house!':homeFloors()>1?'One more floor?':'Bigger house',act:()=>openBigHouse()});}
/* a spot to use in your yard (given at the old town-yard spot): it moves with the yard. b = a flower bed that moves along */
function yardInt(t,b){t.tx=t.x;t.tz=t.z;if(t.rect)t.trect=t.rect;if(b){b.tx=b.x;b.tz=b.z;t.bed=b;}t.when=()=>YARD.on;YARD.ints.push(t);if(YARD.j!=null)yardT(t,YARD.j);return t;}
function yardT(t,j){[t.x,t.z]=lotPt(j,t.tx,t.tz);if(t.trect)t.rect=lotRect(j,t.trect);if(t.bed)[t.bed.x,t.bed.z]=lotPt(j,t.bed.tx,t.bed.tz);}
const yardPt=(x,z)=>YARD.j==null?[x,z]:lotPt(YARD.j,x,z);
/* put your yard on your lot: at the start, and when your lot changes (a friend who has lived on Friends Lane longer came online) */
function yardPlace(){const j=LANE.mine,C=LOC.city;if(j==null||!YARD.g||j===YARD.j)return;const p=LANE_PLOTS[j],a=YARD.j,[cx,cz]=lotPt(j,-17,-15);
  YARD.g.position.set(cx,0,cz);YARD.g.rotation.y=p.s<0?0:Math.PI;YARD.g.visible=true;
  for(const c of YARD.wc){const i=C.cols.indexOf(c);if(i>=0)C.cols.splice(i,1);}
  YARD.wc=YARD.cols.map(c=>{if(c.cr===undefined)return lotRect(j,c);const q=lotPt(j,c.cx,c.cz);return{cx:q[0],cz:q[1],cr:c.cr};});C.cols.push(...YARD.wc);
  YARD.j=j;YARD.on=true;for(const t of YARD.ints)yardT(t,j);benchYard(j);
  const yw=v=>p.s<0?v:v+Math.PI,d=lotPt(j,-17,-9.6),bk=lotPt(j,-14,-19.7);DOORS.home.city=[d[0],d[1],yw(Math.PI)];DOORS.homeback.city=[bk[0],bk[1],yw(0)];
  for(const [id,x,z,dx,dz] of[['home',-17,-15,-17,-6.9],['garden',-16.75,-21.5,-11.45,-6.9]]){const pl=PLACES.find(q=>q.id===id);[pl.x,pl.z]=lotPt(j,x,z);pl.door=lotPt(j,dx,dz);   /* the arrow aims at the pavement in front of your gate / garden path */
    if(NAV&&NAV.id===id&&!NAV.actor)setNavTo(pl,true);}
  if(a!=null)yardHop(a,j);}
/* your lot changed while playing: pets waiting in your yard (and you, if you stand in it) move along to the same spot */
function yardHop(a,b){const mv=(x,z)=>{const q=lotBack(a,x,z);return inYardR(q[0],q[1])?lotPt(b,q[0],q[1]):null;},o=LANE_PLOTS[a];
  for(const p of PET_ACTORS)if(p.loc==='city'){const q=mv(p.x,p.z),t=mv(p.tx,p.tz);if(q)[p.x,p.z]=q;if(t)[p.tx,p.tz]=t;}
  if(!CUR||CUR.id!=='city')return;const q=mv(P.x,P.z),near=Math.hypot(P.x-o.X,P.z-o.s*15)<30;
  if(q){[P.x,P.z]=q;if(o.s!==LANE_PLOTS[b].s)P.yaw+=Math.PI;bringFollowers(true);}
  if(q||near)toast('🏡 Your house moved to a new spot on Friends Lane!',3.4);}
/* a friend walking away from Friends Lane (going home, or no longer following you): out of the lot by a gate or a side path,
   then along the pavement into town, never through fences or houses (spots are your-yard numbers, turned onto the lot) */
function laneOut(x,z){const s=z<0?-1:1,out=[];let ex=x;
  for(const p of LANE_PLOTS){const [tx,tz]=lotBack(p.j,x,z);if(tx<-23.6||tx>-10.4||tz<-27||tz>-6.8)continue;
    const W=(a,b)=>{const q=lotPt(p.j,a,b);out.push(q);ex=q[0];};
    if(tz>-8.2)W(tx,-6.4);   /* in front of the fence: onto the pavement (not along the mailboxes) */
    else if(tx>-21.6&&tx<-12.4&&tz>-11.4){W(-17,-9.2);W(-17,-7.3);}   /* the front yard: out by its gate */
    else if(tx>-23&&tx<-10.5&&tz<-18.5&&tz>-24.6){if(tx<-14.6){const a=tz>-20.28?-19.45:tz>-22.38?-21.95:-24.1;W(tx,a);W(-14.3,a);W(-14.3,-19.45);}W(-11.45,-19.45);W(-11.45,-7.3);}
      /* the garden: between the flower beds, to its gate, and out on the stepping stones */
    else if(tz<-24.6||tx<-23||(tx<-21.6&&tz>-18.6)){const a=tx<-17?-23.3:-10.1;if(tz<-24.6)W(a,tz);W(a,-7.3);}   /* behind the garden, or beside it: along the side */
    else W(-11.45,-7.3);   /* beside the house: on the stepping stones */
    break;}
  out.push([ex,s*5.5],[-83.5,s*5.5]);return out;}
/* a spot in your own yard is saved as the old town-yard spot (like old saves), so it stays in YOUR yard whichever lot is yours */
function toSave(loc,x,z){if(loc==='city'&&LANE.mine!=null){const q=lotBack(LANE.mine,x,z);if(inYardR(q[0],q[1]))return q;}return[x,z];}
function fromSave(loc,x,z){return loc==='city'&&LANE.mine!=null&&inYardR(x,z)&&(!S||S.yq!==0)?lotPt(LANE.mine,x,z):[x,z];}   /* (a save made in the Flower Corner says yq 0: it stays there) */
/* 🏠 a friend's house, inside: rebuilt from what their furniture looks like right now */
const VOX=2700;
function buildVisit(){const L=makeLoc('visit','in',VOX,0,[-6,-5,6,5]);L.wallM=toon({color:'#ffd6e0'});L.floorM=toon({map:floorTex('wood')});L.fk='wood';
  L.items=new THREE.Group();L.items.visible=false;scene.add(L.items);visitShell(L,false);return L;}
function visitShell(L,n,wide){n=clamp(n|0,1,6);wide=!!(n>1&&wide);if(L.nfl===n&&L.wide===wide&&L.fls)return;L.nfl=n;L.big=n>1;L.wide=wide;
  if(L.fls)for(const F of L.fls){if(F.g.parent)F.g.parent.remove(F.g);F.g.traverse(o=>{if(o.geometry&&!o.userData.keep)o.geometry.dispose();});if(F.grid.parent)F.grid.parent.remove(F.grid);}
  const W=wide?18:12,D=wide?14:10,H=wide?3.6:3.2,hw=W/2,hd=D/2;L.W=hw;L.D=hd;L.cols.length=0;L.inter=L.inter.filter(i=>!i.vdoor);
  houseFloors(L,n,W,D,H,L.wallM,L.floorM,wide,'vdoor');
  inter(L,{x:0,z:hd-.7,r:1.9,icon:'🚪',label:'Go outside',act:()=>visLeave('👋 Bye, '+VIS.nm+'! Thanks for having me!'),vdoor:1});}
const visFloors=hm=>clamp(+hm.n||(hm.b&&typeof hm.u==='string'?2:1),1,6);   /* how many floors a host's presence describes (old versions: b and u) */
/* 🎨 the client's room for the Interior designer job. There is just one, re-painted for every client. */
const CLW=3.6,CLD=3.0;let CL_WALL=null,CL_FLOOR=null;
function buildClientRoom(){const L=makeLoc('client','in',2100,0,[-CLW,-CLD,CLW,CLD]);
  CL_WALL=toon({color:'#fff3ea'});CL_FLOOR=toon({map:floorTex('wood')});CL_FLOOR.map.repeat.set(CLW/2,CLD/2);
  const sh=new THREE.Group();L.g.add(sh);shell(L,sh,CLW*2,CLD*2,2.9,CL_WALL,CL_FLOOR,'#fffaf3');
  windowIn(sh,-1.75,1.0,-CLD+.02,0,'#ffc9dc');windowIn(sh,1.75,1.0,-CLD+.02,0,'#ffc9dc');windowIn(sh,CLW-.02,1.0,0,-Math.PI/2,'#ffc9dc');windowIn(sh,-CLW+.02,1.0,0,Math.PI/2,'#ffc9dc');
  box(sh,1.5,2.5,.12,'#ffffff',0,0,CLD-.02);bake(sh,false);
  /* the doorway is bright (the hall outside), and the door swings open when the client comes in */
  const way=new THREE.Mesh(new THREE.PlaneGeometry(1.2,2.24),new THREE.MeshBasicMaterial({color:'#fff3cf'}));way.position.set(0,1.14,CLD-.09);way.rotation.y=Math.PI;L.g.add(way);
  const hinge=new THREE.Group();hinge.position.set(-.61,0,CLD-.1);L.g.add(hinge);L.hinge=hinge;L.leafM=toon({color:'#5fd4b0'});L.panM=toon({color:'#7fe2c2'});
  box(hinge,1.22,2.12,.08,null,.61,.15,0,{mat:L.leafM,ol:.015});box(hinge,.8,.55,.02,null,.61,1.45,-.05,{mat:L.panM,ol:false});box(hinge,.8,.55,.02,null,.61,.5,-.05,{mat:L.panM,ol:false});
  sph(hinge,.07,'#ffd45c',1.05,1.1,-.07,{ol:.012});
  L.items=new THREE.Group();L.items.visible=false;scene.add(L.items);
  const gh=new THREE.GridHelper(CLW*2,CLW*4,0xb79cff,0xd9c8ff);gh.scale.z=CLD/CLW;gh.position.y=.012;gh.visible=false;L.g.add(gh);L.grid=gh;
  inter(L,{x:0,z:CLD-.7,r:1.6,icon:'🚪',label:'Go outside',act:()=>exitClient()});
  /* 🚪 the door to the other room (night 3, job 9): one picture on the wall (one piece, so the room stays as light as before), on the west wall in
     room 1 and on the east wall in room 2; shown for two-room orders only */
  const dp=t=>{const c=document.createElement('canvas');c.width=256;c.height=512;const x=c.getContext('2d');x.fillStyle='#b79cff';x.fillRect(6,6,244,92);x.fillStyle='#ffffff';x.font=`800 46px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(t,128,54);
    x.fillStyle='#3d2c5e';x.fillRect(22,118,212,394);x.fillStyle='#5fd4b0';x.fillRect(32,128,192,384);x.fillStyle='#7fe2c2';x.fillRect(58,160,140,110);x.fillRect(58,320,140,110);x.fillStyle='#ffd45c';x.beginPath();x.arc(200,330,13,0,Math.PI*2);x.fill();
    const tx=new THREE.CanvasTexture(c);tx.minFilter=THREE.LinearFilter;return tx;};
  L.rdoorTex=[dp('Room 2 →'),dp('← Room 1')];
  const rd=new THREE.Mesh(new THREE.PlaneGeometry(1.3,2.6),new THREE.MeshBasicMaterial({map:L.rdoorTex[0],transparent:true}));rd.position.set(-CLW+.03,1.3,1.6);rd.rotation.y=Math.PI/2;rd.visible=false;rd.userData.keep=1;L.g.add(rd);L.rdoor=rd;
  inter(L,{x:-CLW+.9,z:1.6,r:1.5,icon:'🚪',label:'Room 2 ➡️',when:()=>dsTwo()&&!(S.ds.o.ri|0)&&!CUT,act:()=>dsGoRoom(1)});
  inter(L,{x:CLW-.9,z:1.6,r:1.5,icon:'🚪',label:'⬅️ Room 1',when:()=>dsTwo()&&!!(S.ds.o.ri|0)&&!CUT,act:()=>dsGoRoom(0)});
  return L;}
function buildMarket(){
  const L=makeLoc('market','in',400,0,[-7,-5,7,5]);const sh=new THREE.Group(),pr=new THREE.Group();L.g.add(sh,pr);
  shell(L,sh,14,10,3.4,mat('#fff1b8'),toon({map:floorTex('check')}),'#f6f1e6');
  doorAt(sh,0,5-.02,Math.PI,null,true,true);
  windowIn(sh,-7+.02,1.0,2.5,Math.PI/2,'#ff9ec4');
  shelfUnit(pr,-4.4,-4.5,0,4,['apple','bread','cereal']);shelfUnit(pr,0,-4.5,0,4,['milk','cheese','jar']);shelfUnit(pr,4.4,-4.5,0,4,['pizza','cake','icecream']);col(L,-6.6,-5,6.6,-4.05);
  shelfUnit(pr,-6.5,-.6,Math.PI/2,3.4,['banana','jar','bread']);col(L,-7,-2.4,-6.05,1.2);
  box(pr,4.2,.7,1.4,'#c98f5e',-.6,0,0);for(let i=0;i<3;i++){box(pr,1.2,.25,1.1,'#e0a874',-1.95+i*1.35,.7,0,{ol:.02});for(let k=0;k<5;k++)sph(pr,.13,['#ff5d6c','#ffb547','#9bdc5a'][i],-2.25+i*1.35+(k%3)*.28,1.07,-.2+(k>2?.35:0),{ws:10,hs:8,ol:.015});}col(L,-2.8,-.8,1.6,.8);
  box(pr,3,1.0,.8,'#ff9ec4',4.9,0,2.0);box(pr,3.1,.08,.9,'#ffffff',4.9,1.0,2.0);box(pr,.6,.35,.45,'#7cc8ff',5.6,1.08,1.9,{rx:-.2});col(L,3.35,1.55,6.45,2.45);
  box(pr,1.6,.9,.9,'#ffffff',6.1,0,-1.6);box(pr,1.5,.1,.8,'#bfe6ff',6.1,.9,-1.6,{ol:false});for(let k=0;k<6;k++)sph(pr,.08,['#ffc9dc','#fff1b8','#c9f2e3'][k%3],5.6+(k%3)*.3,.95,-1.8+(k>2?.3:0),{ws:8,hs:6,ol:.012});col(L,5.25,-2.1,7,-1.1);
  const s1=signPlane('Fresh & yummy!',3,.6,'#ff7aa8','#ffffff');s1.position.set(0,2.85,-4.94);L.g.add(s1);
  bake(sh,false);bake(pr,true);
  inter(L,{x:0,z:4.3,r:1.9,icon:'🚪',label:'Go outside',act:()=>exitTo('market')});
  for(const [x,z] of [[-4.4,-3.6],[0,-3.6],[4.4,-3.6],[-5.6,-.6],[-.6,1.3],[6.1,-.6]])inter(L,{x,z,r:1.9,icon:'🛒',label:'Shop for food',act:()=>openShop('market')});
  return L;
}
function flowerStand(g,x,z,cols){
  for(let t=0;t<3;t++){const zz=z-t*.36,top=(t+1)*.34;box(g,2.7,top,.38,'#c98f5e',x,0,zz,{ol:.02});
    for(let k=0;k<5;k++){const bx=x-1.04+k*.52;cyl(g,.15,.12,.28,'#c8cde0',bx,top,zz,{seg:10,ol:.015});sph(g,.14,'#5fbf74',bx,top+.33,zz,{ws:10,hs:8,ol:.012});
      const c=cols[(t*5+k)%cols.length];for(let f=0;f<5;f++)sph(g,.075,c,bx+(f%3-1)*.09,top+.42+(f>2?.07:0),zz+(f>2?-.05:.05),{ws:8,hs:6,ol:.012});}}}
function buildFlowerShop(){
  const L=makeLoc('flowers','in',600,0,[-6,-4.5,6,4.5]);const sh=new THREE.Group(),pr=new THREE.Group();L.g.add(sh,pr);
  shell(L,sh,12,9,3.3,mat('#efe6ff'),toon({map:floorTex('pink')}),'#f6f0ff');
  doorAt(sh,0,4.5-.02,Math.PI,null,true,true);
  windowIn(sh,-6+.02,1.0,.5,Math.PI/2,'#b79cff');windowIn(sh,6-.02,1.0,-1.6,-Math.PI/2,'#b79cff');
  const C=['#ff7aa8','#ffd45c','#ffffff','#b79cff','#ff8a6b','#ff4d6d'];
  flowerStand(pr,-3.6,-3.6,C);flowerStand(pr,0,-3.6,C.slice(2).concat(C.slice(0,2)));flowerStand(pr,3.6,-3.6,C.slice(4).concat(C.slice(0,4)));col(L,-5.05,-4.5,5.05,-3.38);
  for(const [x,z] of [[-5.25,-1.6],[-5.25,2.6]]){const p=new THREE.Group();p.position.set(x,0,z);p.scale.setScalar(1.7);pr.add(p);FURN.plant.b(p);colC(L,x,z,.42);}
  for(const [x,z,t,c] of [[-5.3,.5,'sunflower'],[-4.5,3.6,'rosebush','#ff4d6d'],[-3.7,3.6,'rosebush','#ffffff'],[5.3,.6,'sunflower']]){const p=buildFurn(t,c);p.position.set(x,0,z);pr.add(p);colC(L,x,z,.36);}
  box(pr,2.6,1.0,.8,'#b79cff',4.1,0,2.0);box(pr,2.7,.08,.9,'#ffffff',4.1,1.0,2.0);const v=buildFurn('flowers','#ff7aa8');v.position.set(3.4,1.08,2.0);pr.add(v);
  box(pr,.5,.32,.4,'#7fdcb5',4.8,1.08,1.95,{rx:-.2});col(L,2.75,1.55,5.45,2.45);
  for(const [x,z,c] of [[-2,0,'#ff9ec4'],[2,.4,'#ffd45c'],[1.55,-1.3,'#b79cff']]){cyl(pr,.02,.02,.55,'#8c6137',x,2.75,z,{seg:5,ol:false});const b=new THREE.Group();b.position.set(x,2.55,z);pr.add(b);
    sph(b,.26,'#c98f5e',0,0,0,{s:[1,.6,1],ws:12,hs:8,ol:.02});sph(b,.24,'#5fbf74',0,.09,0,{s:[1,.45,1],ws:12,hs:8,ol:.015});for(let i=0;i<6;i++){const a=i/6*TAU;sph(b,.07,c,Math.cos(a)*.17,.16,Math.sin(a)*.17,{ws:8,hs:6,ol:.012});}}
  const s1=signPlane('🌸 Fresh flowers 🌸',3.4,.62,'#ff9ec4','#ffffff');s1.position.set(0,2.55,-4.44);L.g.add(s1);
  bake(sh,false);bake(pr,true);
  inter(L,{x:0,z:3.8,r:1.9,icon:'🚪',label:'Go outside',act:()=>exitTo('flowers')});
  for(const [x,z] of [[-3.6,-2.9],[0,-2.9],[3.6,-2.9]])inter(L,{x,z,r:2,icon:'🌷',label:'Buy flowers',act:()=>openShop('flowers')});
  return L;
}
function menuBoard(w,h,title,rows){const H=512,W=Math.round(H*w/h),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  x.fillStyle='#3e5a4a';x.fillRect(0,0,W,H);x.strokeStyle='#c98f5e';x.lineWidth=28;x.strokeRect(14,14,W-28,H-28);
  x.fillStyle='#ffffff';x.textAlign='center';x.font=`800 84px ${FONT}`;x.fillText(title,W/2,118);
  const st=rows.length>1?Math.min(66,(440-196)/(rows.length-1)):0;x.font=`700 ${rows.length>4?48:52}px ${FONT}`;rows.forEach(([a,b],i)=>{const y=196+i*st;x.textAlign='left';x.fillText(a,70,y);x.textAlign='right';x.fillText(b,W-70,y);});   /* (run 4 finish: rows spaced to the board; a fifth row sat on the frame) */
  const t=new THREE.CanvasTexture(c);t.anisotropy=4;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));m.userData.keep=1;return m;}
function buildCafe(){
  const L=makeLoc('cafe','in',800,0,[-6,-4.5,6,4.5]);const sh=new THREE.Group(),pr=new THREE.Group();L.g.add(sh,pr);
  shell(L,sh,12,9,3.3,mat('#ffe6d2'),toon({map:floorTex('dark')}),'#fff3ea');
  doorAt(sh,0,4.5-.02,Math.PI,null,true,true);
  windowIn(sh,6-.02,1.0,-.2,-Math.PI/2,'#7fdcb5');windowIn(sh,-6+.02,1.0,1.4,Math.PI/2,'#7fdcb5');
  // counter, cake case, coffee machine
  box(pr,6,1.0,.8,'#ff9ec4',-2,0,-3.2);box(pr,6.1,.08,.9,'#ffffff',-2,1.0,-3.2);
  const glass=toon({color:'#cfeeff',transparent:true,opacity:.35});box(pr,2,.5,.6,null,-3.3,1.08,-3.2,{mat:glass,ol:.015});
  for(const [k,x] of [['cake',-4],['icecream',-3.6],['cake',-3.2],['jar',-2.8]])foodModel(pr,k,x,1.1,-3.2);
  for(let i=0;i<4;i++){cyl(pr,.07,.06,.05,'#c98f5e',-1.6+i*.22,1.08,-3.1,{seg:10,ol:.01});}
  box(pr,3,.9,.6,'#c98f5e',-2.4,0,-4.15);box(pr,.6,.62,.45,'#c8cde0',-1.6,.9,-4.15);box(pr,.2,.1,.2,'#3d2c5e',-1.6,1.05,-3.95,{ol:.01});
  for(let i=0;i<3;i++)cyl(pr,.05,.045,.1,'#ffffff',-3.2+i*.25,.9,-4.1,{seg:10,ol:.01});
  col(L,-6,-4.5,1.05,-2.75);
  const mb=menuBoard(2.6,1.6,'Café menu',[['☕ Hot cocoa','4'],['🍪 Cookie','2'],['🧁 Muffin','5'],['🍩 Donut','5'],['🍰 Cake','10']]);mb.position.set(-2,2.3,-4.44);L.g.add(mb);
  // tables and chairs you can sit on
  const seat=(x,z,rot,c)=>{const ch=buildFurn('chair',c);ch.position.set(x,0,z);ch.rotation.y=rot;pr.add(ch);colC(L,x,z,.3);
    inter(L,{x,z,r:1.4,icon:'🪑',label:'Sit down',act:()=>{P.sit={x:L.ox+x,z:L.oz+z,yaw:rot+Math.PI};P.x=P.sit.x;P.z=P.sit.z;P.yaw=P.sit.yaw;P.pitch=-.12;SFX.pop();toast('Comfy! Move to stand up.');qEvent('cafesit');}});};
  for(const [tx,tz,c] of [[2.6,-2.2,'#ffffff'],[2.6,1.4,'#ff9ec4'],[-2.6,1.2,'#7fdcb5']]){const t=buildFurn('table',c);t.position.set(tx,0,tz);pr.add(t);colC(L,tx,tz,.62);
    seat(tx-1.05,tz,Math.PI/2,WOOD);seat(tx+1.05,tz,-Math.PI/2,WOOD);
    const v=buildFurn('flowers',pick(['#ff7aa8','#ffd45c','#b79cff']));v.position.set(tx,.77,tz);v.scale.setScalar(.6);pr.add(v);
    cyl(pr,.015,.015,.6,'#3d2c5e',tx,2.7,tz,{seg:5,ol:false});cone(pr,.3,.28,'#ff8a6b',tx,2.45,tz,{seg:14,ol:.015});sph(pr,.1,null,tx,2.45,tz,{mat:GLOW,ol:false,ws:10,hs:8});}
  for(const [x,z] of [[5.3,3.7],[-5.3,3.7],[5.3,-3.9]]){const p=new THREE.Group();p.position.set(x,0,z);p.scale.setScalar(1.6);pr.add(p);FURN.plant.b(p);colC(L,x,z,.4);}
  bake(sh,false);bake(pr,true);
  inter(L,{x:0,z:3.8,r:1.9,icon:'🚪',label:'Go outside',act:()=>exitTo('cafe')});
  for(const [x,z] of [[-3.3,-2.3],[-.6,-2.3]])inter(L,{x,z,r:1.8,icon:'☕',label:'Order food',act:()=>openShop('cafe')});
  return L;
}
function clothesRack(g,x,z,cols){box(g,.08,1.6,.08,'#c8cde0',x-1.3,0,z,{ol:.012});box(g,.08,1.6,.08,'#c8cde0',x+1.3,0,z,{ol:.012});cyl(g,.03,.03,2.7,'#c8cde0',x,1.55,z,{rz:Math.PI/2,center:true,seg:6,ol:.01});
  cols.forEach((c,i)=>{const sx=x-1.05+i*.35,sz=z+(i%2?.04:-.04);box(g,.28,.44,.05,c,sx,1.02,sz,{ol:.012});box(g,.4,.12,.05,c,sx,1.34,sz,{ol:.012});cyl(g,.006,.006,.1,'#c8cde0',sx,1.45,sz,{seg:4,ol:false});});}
function buildClothesShop(){
  const L=makeLoc('clothes','in',900,0,[-6,-4.5,6,4.5]);const sh=new THREE.Group(),pr=new THREE.Group();L.g.add(sh,pr);const rk=sh;   /* the racks by the back wall are baked with the walls, without shadows (run 4, stage 3: the shirts' soft shadows smeared the wall like dirt; same number of pieces) */
  shell(L,sh,12,9,3.3,mat('#ffe3ef'),toon({map:floorTex('dark')}),'#fff4f8');
  doorAt(sh,0,4.5-.02,Math.PI,null,true,true);windowIn(sh,-6+.02,1.0,0,Math.PI/2,'#b79cff');
  clothesRack(rk,-3.6,-3.9,['#ff9ec4','#ffd45c','#7cc8ff','#5fd4b0','#b79cff','#ff6b6b','#ffffff']);clothesRack(rk,0,-3.9,['#2e2347','#7cc8ff','#ffffff','#ff9ec4','#ffd45c','#5fd4b0','#b79cff']);clothesRack(rk,3.6,-3.9,['#ff6b6b','#b79cff','#ffd45c','#ffffff','#5fd4b0','#ff9ec4','#7cc8ff']);
  col(L,-5.1,-4.5,5.1,-3.5);
  box(pr,.12,2.2,1.4,'#ffd45c',5.93,0,.5);const mr=new THREE.Mesh(new THREE.PlaneGeometry(1.15,1.95),new THREE.MeshBasicMaterial({color:'#d8f0ff'}));mr.rotation.y=-Math.PI/2;mr.position.set(5.86,1.1,.5);mr.userData.keep=1;L.g.add(mr);
  for(let i=0;i<3;i++)box(pr,.02,.9,.08,'#ffffff',5.85,.5+i*.3,.1+i*.25,{ol:false,rz:.6});col(L,5.8,-.3,6,1.3);
  const sg=signPlane('🪞 Try on clothes',1.8,.4,'#ff7aa8','#ffffff');sg.position.set(5.8,2.45,.5);sg.rotation.y=-Math.PI/2;L.g.add(sg);
  for(const [x,z,lk] of [[-4.6,.6,{skin:'#f3e6f0',hair:'#f3e6f0',style:'short',top:'#ff7aa8',bottom:'#7cc8ff',shoes:'#ffffff',dress:true,hat:'flowers'}],[3.2,.9,{skin:'#f3e6f0',hair:'#f3e6f0',style:'short',top:'#5fd4b0',bottom:'#2e2347',shoes:'#ff6b6b',hat:'cap',glasses:'sunglasses'}]]){
    const p=makePerson(lk);p.root.position.set(L.ox+x,0,L.oz+z);p.root.rotation.y=Math.PI*.15*(x<0?1:-1);bakePerson(p);L.g.parent.add(p.root);p.root.userData.loc='clothes';L.manq=(L.manq||[]).concat(p.root);colC(L,x,z,.4);}
  cyl(pr,.04,.05,1.7,'#c98f5e',-5.3,0,3.3,{seg:6});for(const [y,c] of [[1.75,'#ff6b6b'],[1.45,'#7cc8ff'],[1.15,'#ffd45c']])sph(pr,.14,c,-5.3+.12,y,3.3,{s:[1,.6,1],ws:10,hs:6,ol:.012});colC(L,-5.3,3.3,.35);
  box(pr,1.6,.5,.45,'#ffffff',-5.6,0,-1.6);for(let i=0;i<4;i++)box(pr,.16,.1,.28,['#ff7aa8','#ffffff','#ffd45c','#7cc8ff'][i],-6.1+i*.33,.5,-1.6,{ol:.01});col(L,-6,-1.85,-4.8,-1.35);
  box(pr,2.6,1.0,.8,'#b79cff',3.6,0,3.0-.9);box(pr,2.7,.08,.9,'#ffffff',3.6,1.0,2.1);col(L,2.25,1.65,4.95,2.55);
  bake(sh,false);bake(pr,true);
  inter(L,{x:0,z:3.8,r:1.9,icon:'🚪',label:'Go outside',act:()=>exitTo('clothes')});
  for(const [x,z] of [[-3.6,-3.0],[0,-3.0],[3.6,-3.0],[-5.4,-1.0]])inter(L,{x,z,r:1.9,icon:'👗',label:'Shop for clothes',act:openClothes});
  inter(L,{x:5.0,z:.5,r:1.8,icon:'🪞',label:'Try on clothes',act:()=>openCreator('edit')});
  return L;
}
function room(id,ox,wallC,floorKind,ceil){const L=makeLoc(id,'in',ox,0,[-6,-4.5,6,4.5]);const sh=new THREE.Group(),pr=new THREE.Group();L.g.add(sh,pr);
  shell(L,sh,12,9,3.3,mat(wallC),floorKind==='concrete'?mat('#cfccdb'):toon({map:floorTex(floorKind)}),ceil||'#fffaf2');
  doorAt(sh,0,4.5-.02,Math.PI,null,true,true);inter(L,{x:0,z:3.8,r:1.9,icon:'🚪',label:'Go outside',act:()=>exitTo(id)});return{L,sh,pr};}
function seatAt(L,pr,x,z,rot,c,kind){const ch=buildFurn(kind||'chair',c);ch.position.set(x,0,z);ch.rotation.y=rot;pr.add(ch);colC(L,x,z,.3);
  inter(L,{x,z,r:1.4,icon:'🪑',label:'Sit down',act:()=>{P.sit={x:L.ox+x,z:L.oz+z,yaw:rot+Math.PI};P.x=P.sit.x;P.z=P.sit.z;P.yaw=P.sit.yaw;P.pitch=-.12;SFX.pop();toast('Comfy! Move to stand up.');}});}
function bookcase(g,x,z,ry,w){w=w||2.4;const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);const W='#a8714a';
  box(p,w,2.2,.05,W,0,0,-.2);box(p,.06,2.2,.45,W,-w/2+.03,0,0);box(p,.06,2.2,.45,W,w/2-.03,0,0);box(p,w,.06,.45,W,0,2.14,0);const cols=['#ff7aa8','#7cc8ff','#ffd45c','#5fd4b0','#b79cff','#ff8a6b','#ffffff','#3d2c5e'],r=seeded(Math.round(x*7+z*13));
  for(let row=0;row<4;row++){const y=.12+row*.52;box(p,w-.1,.04,.4,'#c98f5e',0,y,0,{ol:false});let bx=-w/2+.12;while(bx<w/2-.18){const bw=.06+r()*.05,bh=.28+r()*.15;box(p,bw,bh,.3,cols[Math.floor(r()*cols.length)],bx+bw/2,y+.04,-.02,{ol:.006});bx+=bw+.012;}}}
function toyShelf(g,x,z){const p=new THREE.Group();p.position.set(x,0,z);g.add(p);box(p,2.6,1.8,.05,'#ffffff',0,0,-.22);box(p,.06,1.8,.5,'#ffffff',-1.27,0,0);box(p,.06,1.8,.5,'#ffffff',1.27,0,0);box(p,2.6,.06,.5,'#ffffff',0,1.76,0);const r=seeded(Math.round(x*5+3)),C=['#ff7aa8','#ffd45c','#5fd4b0','#b79cff','#ff8a6b','#7cc8ff'],c=()=>C[Math.floor(r()*C.length)];
  for(let row=0;row<3;row++){const y=.1+row*.58;box(p,2.5,.04,.45,'#7cc8ff',0,y,0,{ol:false});
    for(let i=0;i<6;i++){const tx=-1.05+i*.42,kind=(i+row)%4;
      if(kind===0)sph(p,.12,c(),tx,y+.16,0,{ws:10,hs:8,ol:.01});
      else if(kind===1){box(p,.16,.16,.16,c(),tx,y+.04,0,{ol:.01});box(p,.12,.12,.12,c(),tx+.02,y+.2,0,{ol:.01});}
      else if(kind===2){sph(p,.1,'#c98f5e',tx,y+.13,0,{ws:8,hs:6,ol:.01});sph(p,.07,'#c98f5e',tx,y+.29,0,{ws:8,hs:6,ol:.01});sph(p,.03,'#c98f5e',tx-.05,y+.35,0,{ws:6,hs:5,ol:false});sph(p,.03,'#c98f5e',tx+.05,y+.35,0,{ws:6,hs:5,ol:false});}
      else{box(p,.14,.2,.1,'#c8cde0',tx,y+.04,0,{ol:.01});box(p,.1,.08,.08,'#c8cde0',tx,y+.26,0,{ol:.01});sph(p,.02,'#ff4d6d',tx,y+.36,0,{ws:6,hs:5,ol:false});}}}}
function glassCase(g,x,z,w,base){box(g,w,.85,.8,base||'#ffffff',x,0,z);box(g,w-.1,.5,.7,null,x,.85,z,{mat:toon({color:'#dff4ff',transparent:true,opacity:.3}),ol:.012});}
/* 🕹️ the claw machine (its front faces +x). The cabinet is baked; the claw and the capsules move. */
function clawAdd(K,x,z,gold){const c=gold?'#ffcf3f':pick(['#ff7aa8','#7cc8ff','#b79cff','#7fdcb5','#ffb36b']),g=new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(.085,12,6,0,TAU,0,Math.PI/2),mat(c)));
  g.add(new THREE.Mesh(new THREE.SphereGeometry(.085,12,6,0,TAU,Math.PI/2,Math.PI/2),mat(gold?'#fff1b8':'#ffffff')));
  const b=new THREE.Mesh(new THREE.TorusGeometry(.085,.009,4,16),mat(gold?'#e0a92a':'#e8e3f2'));b.rotation.x=Math.PI/2;g.add(b);
  if(gold){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.032,0),mat('#ffffff'));s.scale.set(.6,1.5,.6);s.position.set(0,.13,0);g.add(s);}
  bake(g,false);   /* one piece per capsule (run 4, stage 3: three or four each; their number is random, so the Toy Store's count swung by up to 9 pieces between two loads) */
  g.rotation.set(rand(-.5,.5),rand(0,TAU),rand(-.5,.5));g.position.set(x,K.fy,z);K.g.add(g);const cap={g,x,z,y:K.fy,gold:!!gold,col:c};K.caps.push(cap);return cap;}
function clawSpot(K){for(let k=0;k<300;k++){const x=K.mx+rand(-.37,.37),z=K.mz+rand(-.43,.43);if(x>K.mx+.12&&z>K.mz+.15)continue;if(K.caps.every(c=>Math.hypot(c.x-x,c.z-z)>.175))return[x,z];}return null;}
function clawFill(K){for(let i=0;K.caps.length<14&&i<20;i++){const s=clawSpot(K);if(!s)break;clawAdd(K,s[0],s[1],i<2);}}
function clawPose(K){K.gan.position.set(K.mx,1.97,K.z);K.car.position.set(K.x,1.97,K.z);const top=1.94,bot=K.y+.06,len=Math.max(.01,top-bot);K.cable.scale.y=len;K.cable.position.set(K.x,bot+len/2,K.z);K.head.position.set(K.x,K.y,K.z);for(const p of K.prongs)p.rotation.z=K.open;}
function buildClaw(L,sh,pr,mx,mz){
  box(pr,1.0,.95,1.1,'#ff7aa8',mx,0,mz,{ol:.015});box(pr,1.03,.06,1.13,'#ffd45c',mx,.95,mz,{ol:.012});
  box(pr,.32,.86,.92,'#ff9ec4',mx+.63,0,mz,{ol:.012});box(pr,.36,.05,.96,'#ffffff',mx+.63,.86,mz,{ol:.01});
  cyl(pr,.02,.02,.16,'#3d2c5e',mx+.63,.91,mz-.2,{seg:6,ol:.008});sph(pr,.055,'#ff4d6d',mx+.63,1.09,mz-.2,{ws:10,hs:8,ol:.01});
  cyl(pr,.075,.075,.045,'#ffd45c',mx+.63,.91,mz+.18,{seg:14,ol:.01});cyl(pr,.055,.055,.03,'#ff4d6d',mx+.63,.95,mz+.18,{seg:14,ol:false});
  box(pr,.03,.3,.34,'#3d2c5e',mx+.79,.12,mz+.3,{ol:.01});box(pr,.035,.04,.36,'#ffd45c',mx+.79,.42,mz+.3,{ol:false});
  for(const [dx,dz] of [[-.47,-.52],[-.47,.52],[.47,-.52],[.47,.52]])box(pr,.06,1.12,.06,'#ffd45c',mx+dx,1.0,mz+dz,{ol:.01});
  box(pr,.03,1.1,1.02,'#b79cff',mx-.48,1.0,mz,{ol:false});
  for(const [y,z,c] of [[1.62,-.28,'#ffd45c'],[1.32,.05,'#ffffff'],[1.8,.3,'#ff9ec4'],[1.45,.38,'#7cc8ff'],[1.85,-.05,'#ffffff']])sph(pr,.035,c,mx-.462,y,mz+z,{s:[.3,1,1],ws:6,hs:5,ol:false});
  box(pr,.98,.02,1.04,'#fff3c4',mx,1.0,mz,{ol:false});box(pr,.26,.024,.3,'#3d2c5e',mx+.31,1.0,mz+.36,{ol:false});
  const gl=toon({color:'#dff4ff',transparent:true,opacity:.2});
  box(sh,.02,1.08,1.0,null,mx+.48,1.01,mz,{mat:gl,ol:false});for(const s of[-1,1])box(sh,.94,1.08,.02,null,mx,1.01,mz+s*.51,{mat:gl,ol:false});
  box(sh,.02,.16,.3,null,mx+.17,1.02,mz+.36,{mat:gl,ol:false});box(sh,.28,.16,.02,null,mx+.31,1.02,mz+.2,{mat:gl,ol:false});
  box(pr,1.08,.36,1.18,'#ff7aa8',mx,2.1,mz,{ol:.015});box(pr,1.1,.05,1.2,'#ffd45c',mx,2.46,mz,{ol:.01});
  for(let i=0;i<7;i++)sph(pr,.032,null,mx+.55,2.13,mz-.5+i*.1667,{mat:GLOW,ws:6,hs:5,ol:false});
  for(const s of[-1,1])box(pr,.03,.03,1.0,'#c8cde0',mx+s*.45,1.98,mz,{ol:false});
  const sg=signPlane('🕹 CLAW',.95,.24,'#ffd45c','#ff4d8d');sg.position.set(mx+.553,2.3,mz);sg.rotation.y=Math.PI/2;L.g.add(sg);
  const ps=signPlane('10 🪙 a go!',.5,.13,'#ffffff','#3d2c5e');ps.position.set(mx+.815,.66,mz-.2);   /* 2 cm in front of the machine's side (run 4, job 5) */ps.rotation.y=Math.PI/2;L.g.add(ps);
  col(L,mx-.55,mz-.62,mx+.82,mz+.62);
  inter(L,{x:mx+1.35,z:mz,r:1.6,icon:'🕹️',label:'Play the claw machine · 10 🪙',act:()=>clawOpen()});
  const g=new THREE.Group();L.dyn.add(g);
  const gan=new THREE.Group();g.add(gan);box(gan,.92,.04,.05,'#c8cde0',0,-.02,0,{ol:.008});
  const car=new THREE.Group();g.add(car);box(car,.1,.06,.1,'#ffd45c',0,-.05,0,{ol:.008});
  const cable=new THREE.Mesh(new THREE.CylinderGeometry(.007,.007,1,5),mat('#3d2c5e'));g.add(cable);
  const head=new THREE.Group();g.add(head);cyl(head,.05,.055,.07,'#ffd45c',0,-.03,0,{seg:12,ol:.01});sph(head,.03,'#ff7aa8',0,.055,0,{ws:8,hs:6,ol:.006});
  const prongs=[];for(let i=0;i<3;i++){const a=i/3*TAU,pv=new THREE.Group();pv.position.set(Math.cos(a)*.04,-.03,Math.sin(a)*.04);pv.rotation.y=-a;head.add(pv);const pp=new THREE.Group();pv.add(pp);
    box(pp,.016,.13,.022,'#d8dcea',0,-.13,0,{ol:.006});box(pp,.045,.018,.022,'#d8dcea',-.016,-.142,0,{ol:.006});prongs.push(pp);}
  const K={mx,mz,rx:mx+.31,rz:mz+.36,ry:1.72,lo:1.27,fy:1.105,x:mx+.31,z:mz+.36,y:1.72,open:.1,g,gan,car,cable,head,prongs,caps:[]};L.cl=K;clawFill(K);clawPose(K);}
function buildToyStore(){const {L,sh,pr}=room('toys',1000,'#dff1ff','mint');
  for(const x of[-3.6,0,3.6])toyShelf(pr,x,-4.2);col(L,-5,-4.5,5,-3.9);
  const b1=signPlane('🧸 Toy Store',3.2,.6,'#ff7aa8','#ffffff');b1.position.set(0,2.55,-4.42);L.g.add(b1);
  box(pr,2.2,1.0,.8,'#ffd45c',-4.6,0,1.0);box(pr,2.3,.08,.9,'#ffffff',-4.6,1.0,1.0);col(L,-5.75,.55,-3.45,1.45);
  for(const [x,t,c] of [[-1.4,'unicorn','#ffc9dc'],[1.0,'castle','#e6dbff'],[3.6,'rockinghorse','#ffffff']]){cyl(pr,.55,.6,.3,'#ffffff',x,0,-1.4,{seg:20});const f=buildFurn(t,c);f.position.set(x,.3,-1.4);pr.add(f);colC(L,x,-1.4,.65);}
  box(pr,2.4,.55,1.5,'#7cc8ff',3.6,0,2.2);const tr=new THREE.Mesh(new THREE.TorusGeometry(.55,.03,6,32),mat('#3d2c5e'));tr.rotation.x=Math.PI/2;tr.scale.set(1.6,1,1);tr.position.set(3.6,.57,2.2);pr.add(tr);col(L,2.35,1.4,4.85,3.0);
  const train=new THREE.Group();L.dyn=new THREE.Group();L.g.add(L.dyn);L.dyn.add(train);train.position.set(3.6,.58,2.2);
  for(let i=0;i<3;i++){const car=new THREE.Group();train.add(car);box(car,.16,.12,.24,i?['#ffd45c','#5fd4b0'][i-1]:'#ff4d4d',0,.03,0,{ol:.01});if(!i){cyl(car,.03,.03,.1,'#3d2c5e',0,.15,.07,{seg:6,ol:false});box(car,.14,.1,.08,'#ff4d4d',0,.15,-.06,{ol:.01});}car.userData.i=i;}
  L.train=train;buildClaw(L,sh,pr,-5.2,-1.75);bake(sh,false);bake(pr,true);return L;}
function buildBakery(){const {L,sh,pr}=room('bakery',1100,'#fff1d6','wood');
  glassCase(pr,0,-3.4,5,'#fff1d6');box(pr,1.1,.2,.6,'#c98f5e',2.0,0,-4.2);col(L,-2.6,-4.5,2.6,-2.95);   /* the case reaches the wall: no walking round behind it */
  for(let i=0;i<13;i++){const bx=-2.25+i*.375,k=i%4;
    if(k===0){const t=new THREE.Mesh(new THREE.TorusGeometry(.07,.035,6,12),mat(['#ff9ec4','#c98f5e','#ffffff'][i%3]));t.rotation.x=Math.PI/2;t.position.set(bx,.92,-3.4);pr.add(t);}
    else if(k===1){cyl(pr,.11,.11,.12,'#ffe7a3',bx,.86,-3.4,{seg:12,ol:.01});cyl(pr,.112,.112,.03,'#ff9ec4',bx,.98,-3.4,{seg:12,ol:false});sph(pr,.025,'#ff4d6d',bx,1.03,-3.4,{ws:6,hs:5,ol:false});}
    else if(k===2)sph(pr,.09,'#d99a52',bx,.93,-3.4,{s:[1.6,.7,.8],ws:10,hs:6,ol:.01});
    else{sph(pr,.07,'#ffd6a8',bx,.92,-3.4,{ws:8,hs:6,ol:.01});sph(pr,.05,'#ffffff',bx,.98,-3.4,{s:[1,.5,1],ws:8,hs:6,ol:false});}}
  box(pr,1.6,1.8,1.0,'#c96b4f',4.6,0,-3.9);box(pr,.9,.6,.02,'#2e2347',4.6,.4,-3.39,{ol:false});box(pr,.7,.15,.02,'#ff8a2b',4.6,.45,-3.38,{ol:false});col(L,3.75,-4.5,5.45,-3.35);
  box(pr,.5,1.6,2.4,'#c98f5e',-5.7,0,-1.0);for(let i=0;i<3;i++)for(let j=0;j<4;j++)sph(pr,.09,'#d99a52',-5.6,.3+i*.5,-1.9+j*.6,{s:[.8,.7,1.6],ws:8,hs:6,ol:.01});col(L,-6,-2.25,-5.4,.25);
  const mb=menuBoard(2.6,1.4,'Fresh today',[['🥐 Croissant','4'],['🥯 Bagel','4'],['🥨 Pretzel','4'],['🥧 Apple pie','9'],['🍰 Cake','10']]);mb.position.set(0,2.3,-4.44);L.g.add(mb);
  for(const [tx,tz,c] of [[3.4,1.3,'#ffffff'],[-3.2,1.6,'#ff9ec4']]){const t=buildFurn('table',c);t.position.set(tx,0,tz);pr.add(t);colC(L,tx,tz,.62);seatAt(L,pr,tx-1.05,tz,Math.PI/2,WOOD);seatAt(L,pr,tx+1.05,tz,-Math.PI/2,WOOD);}
  bake(sh,false);bake(pr,true);return L;}
function buildIceCream(){const {L,sh,pr}=room('icecream',1200,'#ffe8f6','pink');
  glassCase(pr,0,-3.4,5,'#ffffff');box(pr,1.1,.2,.6,'#e6e6ef',2.1,0,-4.2);col(L,-2.6,-4.5,2.6,-2.95);
  ['#ff9ec4','#8c5a3c','#ffe27a','#9fe8c8','#c7a6ff','#ffffff','#ffb36b','#a9dcff'].forEach((c,i)=>{const bx=-2.1+i*.6;cyl(pr,.14,.14,.12,'#e6e6ef',bx,.8,-3.4,{seg:12,ol:false});sph(pr,.13,c,bx,.92,-3.4,{s:[1,.5,1],ws:10,hs:6,ol:false});});
  cyl(pr,.3,.36,.12,'#ffffff',-5.0,0,-3.6,{seg:16});cone(pr,.42,1.3,'#d99a52',-5.0,.1,-3.6,{rx:Math.PI,seg:14});sph(pr,.42,'#ff9ec4',-5.0,1.72,-3.6,{ws:14,hs:10});sph(pr,.36,'#9fe8c8',-5.0,2.2,-3.6,{ws:14,hs:10});sph(pr,.3,'#ffe27a',-5.0,2.6,-3.6,{ws:14,hs:10});sph(pr,.08,'#ff4d4d',-5.0,2.94,-3.6,{ws:8,hs:6});   /* 🍦 the big cone stands on its tip in a little stand (it used to float upside down) */colC(L,-5.0,-3.6,.55);
  const mb=menuBoard(2.6,1.4,'Scoops!',[['🍦 Ice cream','8'],['🍨 Sundae','9'],['🍧 Ice pop','4'],['🥤 Milkshake','7'],['🍰 Ice cream cake','12']]);mb.position.set(0,2.3,-4.44);L.g.add(mb);
  for(const [tx,tz,c] of [[3.4,1.2,'#ffffff'],[-3.2,1.5,'#9fe8c8']]){const t=buildFurn('table',c);t.position.set(tx,0,tz);pr.add(t);colC(L,tx,tz,.62);seatAt(L,pr,tx-1.05,tz,Math.PI/2,'#ff9ec4');seatAt(L,pr,tx+1.05,tz,-Math.PI/2,'#ff9ec4');}
  bake(sh,false);bake(pr,true);return L;}
function buildLibrary(){const {L,sh,pr}=room('library',1300,'#e8f0ff','dark');
  for(const x of[-3.6,-1.2,1.2,3.6])bookcase(pr,x,-4.22,0);col(L,-5,-4.5,5.1,-3.95);   /* (run 4, stage 3: the four bookcases touch, no slit of wall between the middle two) */
  for(const z of[-1.5,1.2]){bookcase(pr,-5.75,z,Math.PI/2);bookcase(pr,5.75,z,-Math.PI/2);}col(L,-6,-2.75,-5.5,2.45);col(L,5.5,-2.75,6,2.45);
  for(const tx of[-1.8,1.8]){const t=buildFurn('table','#c98f5e');t.position.set(tx,0,.2);pr.add(t);colC(L,tx,.2,.62);seatAt(L,pr,tx-1.05,.2,Math.PI/2,WOOD);seatAt(L,pr,tx+1.05,.2,-Math.PI/2,WOOD);
    cyl(pr,.03,.04,.35,'#3d6b4f',tx+.25,.77,.0,{seg:6,ol:.01});cone(pr,.13,.12,'#3d8a5f',tx+.25,1.08,.0,{rx:Math.PI,seg:10,ol:.01});box(pr,.36,.03,.26,'#ffffff',tx-.15,.78,.25,{ol:.008});}
  {const rg=buildFurn('rug','#c7a6ff');rg.position.set(-3.6,0,2.7);pr.add(rg);seatAt(L,pr,-4.3,2.5,.4,'#ffd45c','beanbag');seatAt(L,pr,-2.9,3.1,-.3,'#7cc8ff','beanbag');}
  box(pr,2.0,.9,.7,'#a8714a',4.4,0,2.0);box(pr,2.1,.06,.8,'#c98f5e',4.4,.9,2.0);col(L,3.35,1.6,5.45,2.4);
  const b1=signPlane('📚 Library: shh, we are reading!',4.6,.5,'#5fa8ff','#ffffff');b1.position.set(0,2.75,-4.42);L.g.add(b1);
  for(const [x,z] of [[-3.7,-3.4],[-1.2,-3.4],[1.3,-3.4],[3.8,-3.4],[-4.9,-1.5],[4.9,-1.5]])inter(L,{x,z,r:1.6,icon:'📖',label:'Read a book',act:readBook});
  bake(sh,false);bake(pr,true);return L;}
/* 🏫 the school: you walk into a hallway with three classrooms (📐 Math, 📖 English, 🏛️ History) */
const SUBJ={math:{n:'Math',i:'📐',ox:2200,wall:'#e6f3ff',c:'#5fa8ff',x:-3.8,pos:'left',board:'2 + 3 = 5      7 − 4 = 3      3 × 2 = 6'},
  english:{n:'English',i:'📖',ox:2300,wall:'#ffeaf3',c:'#ff7aa8',x:0,pos:'middle',board:'Aa  Bb  Cc      cat · dog · sun'},
  history:{n:'History',i:'🏛️',ox:2400,wall:'#fff1d6',c:'#f2a93b',x:3.8,pos:'right',board:'🏰 Castles      🔺 Pyramids      ⛵ Vikings'}};
const SEATS=[[-1.3,-.55],[0,-.55],[1.3,-.55],[-1.3,1.0],[0,1.0],[1.3,1.0]];
function buildSchool(){const {L,sh,pr}=room('school',1400,'#fff6dc','wood');
  for(const id in SUBJ){const S0=SUBJ[id],x=S0.x;doorAt(sh,x,-4.5+.02,0,S0.c,false,true);
    const sg=signPlane(S0.i+' '+S0.n,1.5,.4,S0.c,'#ffffff');sg.position.set(x,2.78,-4.42);L.g.add(sg);   /* clear above the door frame and its outline (no stripes, no cut letters) */
    inter(L,{x,z:-3.7,r:1.7,icon:()=>tcGoing(id)?'📚':'🚪',label:()=>tcGoing(id)?'Teach the '+S0.n+' class! 📚':'Go into the '+S0.n+' room',pri:()=>tcGoing(id),act:()=>enterClass(id)});}
  for(const [x,em,c] of [[-1.25,'🌈','#ffffff'],[1.25,'🚀','#fff6c8']]){const d=signPlane(em,.6,.6,c,'#3d2c5e');d.position.set(x,1.7,-4.43);L.g.add(d);}
  for(const s of[-1,1])for(let i=0;i<7;i++){const z=-1.9+i*.62,c=['#7cc8ff','#ff9ec4','#ffd45c','#7fdcb5'][(i+(s>0?2:0))%4];
    box(pr,.45,1.9,.58,c,s*5.75,0,z,{ol:.012});for(let k=0;k<3;k++)box(pr,.02,.02,.3,'#3d2c5e',s*5.52,1.62+k*.07,z,{ol:false});sph(pr,.03,'#ffffff',s*5.52,1.05,z-s*.18,{ws:6,hs:5,ol:false});}
  for(const s of[-1,1])col(L,s*5.5,-2.25,s*6,2.3);
  box(pr,1.9,1.2,.06,'#a8714a',3.4,.8,4.44);const nb=signPlane('📌 Fun facts!',1.7,1.0,'#fff6c8','#3d2c5e');nb.position.set(3.4,1.4,4.39);   /* 2 cm in front of its board (run 4, job 5) */nb.rotation.y=Math.PI;L.g.add(nb);
  inter(L,{x:3.4,z:3.5,r:1.7,icon:'✏️',label:'Learn something new',act:()=>{SFX.pop();toast('✏️ '+pick(BOOK_FACTS),4.6);if(cool('learn',3))addXP('read',4);qEvent('read');}});
  box(pr,2.0,.95,.5,'#a8714a',-3.4,0,4.15);box(pr,2.06,.05,.56,'#ffffff',-3.4,.95,4.15,{ol:.01});col(L,-4.45,3.85,-2.35,4.5);
  for(const [x,h] of [[-4.0,.34],[-3.4,.46],[-2.8,.3]]){cyl(pr,.07,.09,.06,'#ffc93c',x,1.0,4.15,{seg:10,ol:.008});cyl(pr,.025,.025,h*.4,'#ffc93c',x,1.06,4.15,{seg:6,ol:false});cyl(pr,.13,.07,h*.5,'#ffc93c',x,1.06+h*.4,4.15,{seg:12,ol:.01});}
  const tb=signPlane('🏆 Our trophies',1.4,.3,'#ffffff','#3d2c5e');tb.position.set(-3.4,1.95,4.42);tb.rotation.y=Math.PI;L.g.add(tb);
  bake(sh,false);bake(pr,true);return L;}
/* the three classrooms: a blackboard, the teacher's desk, and six desks for six kids */
function buildClassrooms(){const glass=toon({color:'#9fd4f2',emissive:new THREE.Color('#5ab4e8'),emissiveIntensity:.22});   /* 🚪 the door to the hallway: its own glass, so it never turns white-orange in the evening (the shared window glass glows at night) */
  for(const id in SUBJ){const S0=SUBJ[id],{L,sh,pr}=room('cl_'+id,S0.ox,S0.wall,'wood');L.inter.pop();sh.traverse(o=>{if(o.isMesh&&o.material===WIN)o.material=glass;});
  windowIn(sh,6-.02,1.0,-1.6,-Math.PI/2,S0.c);windowIn(sh,6-.02,1.0,1.8,-Math.PI/2,S0.c);
  box(pr,5.2,1.8,.08,'#a8714a',0,.9,-4.44);const bd=signPlane(S0.board,4.8,1.45,'#2f6b4f','#ffffff');bd.position.set(0,1.82,-4.39);L.g.add(bd);
  box(pr,1.2,.04,.12,'#a8714a',1.4,.88,-4.36,{ol:false});box(pr,.12,.04,.04,'#ffffff',1.1,.92,-4.36,{ol:false});box(pr,.18,.06,.08,'#ff9ec4',1.5,.92,-4.36,{ol:false});
  const sg=signPlane(S0.i+' '+S0.n+' class',2.4,.42,S0.c,'#ffffff');sg.position.set(0,2.97,-4.42);L.g.add(sg);
  box(pr,1.7,.76,.8,'#c98f5e',0,0,-2.85);box(pr,1.78,.05,.88,'#ffffff',0,.76,-2.85,{ol:.01});sph(pr,.07,'#ff4d4d',.6,.88,-2.75,{ws:10,hs:8,ol:.01});cyl(pr,.008,.008,.06,'#5a3a24',.6,.94,-2.75,{seg:4,ol:false});
  for(let i=0;i<3;i++)box(pr,.32,.05,.24,['#ff7aa8','#7cc8ff','#ffd45c'][i],-.55,.81+i*.05,-2.95,{ry:i*.15,ol:.006});
  {const ch=buildFurn('chair','#7cc8ff');ch.position.set(0,0,-3.65);pr.add(ch);}
  col(L,-.9,-3.3,.9,-2.4);col(L,-.35,-4.05,.35,-3.35);
  SEATS.forEach(([x,z],i)=>{const c=['#ffd45c','#7fdcb5','#ff9ec4','#b79cff','#7cc8ff','#ffb36b'][i];box(pr,.84,.66,.52,c,x,0,z);box(pr,.9,.04,.58,'#ffffff',x,.66,z,{ol:.01});
    const ch=buildFurn('chair',c);ch.position.set(x,0,z+.55);ch.rotation.y=Math.PI;pr.add(ch);col(L,x-.46,z-.3,x+.46,z+.82);box(pr,.22,.012,.3,'#ffffff',x+.14,.68,z,{ry:.2,ol:false});});
  if(id==='math'){const a=signPlane('1  2  3  4  5  6  7  8  9  10',3.6,.5,'#ffffff','#5fa8ff');a.position.set(-5.95,2.2,0);a.rotation.y=Math.PI/2;L.g.add(a);
    const b=signPlane('△  □  ○  ☆',1.9,.55,'#fff6c8','#ff4d8d');b.position.set(-5.95,1.4,-2.4);b.rotation.y=Math.PI/2;L.g.add(b);
    box(pr,.05,.08,3.2,'#ffd45c',-5.95,1.0,1.4,{ol:.01});for(let k=0;k<17;k++)box(pr,.06,.04,.012,'#3d2c5e',-5.93,1.04,-.2+k*.2,{ol:false});
    box(pr,.7,.6,.12,'#c98f5e',-5.2,0,3.5);for(let r=0;r<4;r++){cyl(pr,.008,.008,.6,'#3d2c5e',-5.2,.12+r*.12,3.5,{rz:Math.PI/2,center:true,seg:4,ol:false});for(let k=0;k<5;k++)sph(pr,.03,['#ff4d6d','#ffd45c','#5fa8ff','#7fdcb5'][r],-5.45+k*.1+(r%2)*.08,.12+r*.12,3.5,{ws:6,hs:5,ol:false});}}
  else if(id==='english'){const a=signPlane('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',7.4,.4,'#ffffff','#ff4d8d');a.position.set(-5.95,2.66,0);a.rotation.y=Math.PI/2;L.g.add(a);   /* 🔤 all 26 letters, up above the bookcase */
    bookcase(pr,-5.75,1.4,Math.PI/2);col(L,-6,.1,-5.45,2.7);const b=signPlane('📚 Read every day!',1.9,.5,'#fff6c8','#3d2c5e');b.position.set(-5.95,1.5,-2.5);b.rotation.y=Math.PI/2;L.g.add(b);}
  else{box(pr,.04,1.4,2.4,'#5fa8ff',-5.96,1.0,0,{ol:.012});for(const [y,z,s] of [[1.85,-.6,1],[1.45,.5,1.3],[1.25,-.3,.7],[1.75,.8,.6]])sph(pr,.2*s,'#7fdcb5',-5.93,y,z,{s:[.2,.8,1.4],ws:8,hs:6,ol:false});
    const m=signPlane('🗺 The world',1.9,.34,'#ffffff','#3d2c5e');m.position.set(-5.93,2.64,0);m.rotation.y=Math.PI/2;L.g.add(m);
    box(pr,.6,.7,.6,'#c98f5e',-5.2,0,-3.5);cone(pr,.42,.5,'#e8c98f',-5.2,.7,-3.5,{seg:4,ry:Math.PI/4,ol:.012});colC(L,-5.2,-3.5,.45);
    cyl(pr,.12,.14,.8,'#c8cde0',-5.2,0,3.6,{seg:10,ol:.012});cyl(pr,.22,.18,.55,'#d8dcea',-5.2,.8,3.6,{seg:10,ol:.012});sph(pr,.16,'#c8cde0',-5.2,1.55,3.6,{ws:10,hs:8,ol:.012});box(pr,.04,.04,.2,'#3d2c5e',-5.05,1.56,3.6,{ol:false});
    cone(pr,.05,.25,'#ff4d6d',-5.2,1.7,3.6,{seg:6,ol:.008});colC(L,-5.2,3.6,.35);
    const b=signPlane('🏰 Knights & castles',2.0,.5,'#fff6c8','#3d2c5e');b.position.set(-5.95,1.5,-2.5);b.rotation.y=Math.PI/2;L.g.add(b);}
  inter(L,{x:0,z:3.8,r:1.9,icon:'🚪',label:'Back to the hallway',act:()=>leaveClass(id)});
  inter(L,{x:0,z:-1.85,r:1.7,icon:()=>tcHere(id)?'📚':'🪑',label:()=>tcHere(id)?'Sit down and start the lesson!':"The teacher's desk",pri:()=>tcHere(id),act:()=>tcDesk(id)});
  L.kids=null;bake(sh,false);bake(pr,true);}}
function buildFireStation(){const {L,sh,pr}=room('fire',1500,'#f6dcd6','concrete');
  fireTruck(pr,-2.6,-.9,0);col(L,-3.7,-3.6,-1.5,1.85);
  cyl(pr,.07,.07,3.3,'#e6e6ef',3.8,0,-2.6,{seg:10,ol:.012});const ring=new THREE.Mesh(new THREE.TorusGeometry(.4,.06,6,20),mat('#2e2347'));ring.rotation.x=Math.PI/2;ring.position.set(3.8,3.28,-2.6);pr.add(ring);colC(L,3.8,-2.6,.2);
  inter(L,{x:3.8,z:-1.8,r:1.6,icon:'🚒',label:'Slide down the fire pole',act:()=>{SFX.whee();floatText('Wheee! 🚒',L.ox+3.8,1.8,L.oz-2.6,{h:.7});toast('Zoooom! You slid down the fire pole! 🚒',2.8);qEvent('fire');}});
  for(let i=0;i<4;i++){const z=-1+i*.75;box(pr,.55,1.9,.6,'#ff6b6b',5.65,0,z);box(pr,.02,.5,.04,'#ffffff',5.36,1.1,z+.12,{ol:false});sph(pr,.2,'#ffd45c',5.65,2.05,z,{s:[1,.6,1.1],ws:10,hs:6,ol:.012});}col(L,5.3,-1.35,6,2.0);
  cyl(pr,.32,.32,.7,'#ff4d4d',5.6,1.2,-3.6,{rz:Math.PI/2,center:true,seg:16});col(L,5.2,-4.0,6,-3.2);
  box(pr,.62,.62,.05,'#d3262f',1.7,2.3,-4.45,{ol:.012});cyl(pr,.07,.07,.2,'#8f6244',1.7,2.3,-4.38,{rx:Math.PI/2,center:true,seg:6,ol:false});sph(pr,.28,'#ffd45c',1.7,2.3,-4.28,{s:[1,1,.6],ws:12,hs:8});inter(L,{x:1.7,z:-3.5,r:1.7,icon:'🔔',label:'Ring the bell',act:()=>{SFX.honk();floatText('🔔',L.ox+1.7,2.6,L.oz-4.1,{h:.6});toast('DING DING DING! 🔔',2.4);}});
  const b1=signPlane('🚒 Fire Station',4.8,.55,'#ffffff','#d94b4b');b1.position.set(-1.5,2.8,-4.42);L.g.add(b1);
  bake(sh,false);bake(pr,true);return L;}
function pizzaModel(g,x,y,z,k){cyl(g,.3,.3,.05,'#e8a85c',x,y,z,{seg:18,ol:.012});cyl(g,.25,.25,.02,k===2?'#ffe9a8':'#ffd45c',x,y+.05,z,{seg:18,ol:false});
  for(let i=0;i<6;i++){const a=i/6*TAU+.3,r=i%2?.15:.09;cyl(g,.042,.042,.015,k===1?'#5fbf74':'#d9483b',x+Math.cos(a)*r,y+.07,z+Math.sin(a)*r,{seg:8,ol:false});}}
function pizzaBox(g,x,y,z){box(g,.62,.09,.62,'#ffffff',x,y,z,{ol:.012});box(g,.3,.004,.3,'#ff6b6b',x,y+.09,z,{ol:false});}
/* 🏢 one floor of the apartment hallway: numbered doors, stairs up and down */
const FLAT_POS=[[-6.5,-1],[-4.25,1],[-2,-1],[.25,1],[2.5,-1]],FLAT_DC=['#ff7aa8','#7cc8ff','#ffd45c','#5fd4b0','#b79cff'];
const FLOOR_C=[null,{w:'#fff0e2',s:'#ffc2b8',r:'#ff8a8a',n:'#e0605a'},{w:'#eaf3ff',s:'#b7d8fb',r:'#7cc8ff',n:'#3f8fd6'},{w:'#ecfbf2',s:'#b3ebd0',r:'#7fdcb5',n:'#2f9e6e'}];
function plateTex(t,bg,fg,w,h,fit){w=w||256;h=h||150;fit=fit||t;   /* fit: the text whose size it takes (two plates side by side keep one letter size) */const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  x.fillStyle='#3d2c5e';rr(x,0,0,w,h,28);x.fill();x.fillStyle=bg;rr(x,9,9,w-18,h-18,21);x.fill();
  x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';let fs=Math.round(h*.62);x.font=`900 ${fs}px ${FONT}`;
  while(x.measureText(fit).width>w*.84&&fs>12){fs-=3;x.font=`900 ${fs}px ${FONT}`;}let b=inkOf(fit,x.font,'middle');while(b.w>w*.84&&fs>12){fs-=3;x.font=`900 ${fs}px ${FONT}`;b=inkOf(fit,x.font,'middle');}if(fit!==t)b=inkOf(t,x.font,'middle');x.textAlign='left';x.fillText(t,w/2-b.cx,h/2-b.cy);   /* centred by the ink (run 4, job 5) */
  const T=new THREE.CanvasTexture(c);T.anisotropy=4;return T;}
function plate(g,t,bg,fg,w,h,x,y,z,ry,two,fit){const M=new THREE.MeshBasicMaterial({map:plateTex(t,bg,fg,512,Math.round(512*h/w),fit)});
  for(const k of two?[0,1]:[0]){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),M);m.position.set(x,y,z);m.rotation.y=(ry||0)+k*Math.PI;g.add(m);}}
function buildAptFloor(f){const W=19,D=4.4,H=3,hx=W/2,hz=D/2,C=FLOOR_C[f],L=makeLoc('apt'+f,'in',1600+f*100,0,[-hx,-hz,hx,hz]),sh=new THREE.Group();L.g.add(sh);
  const wm=mat(C.w),fm=toon({map:floorTex('wood')});fm.map.repeat.set(5,1.2);const cm=new THREE.MeshBasicMaterial({color:'#fffaf2'});
  const flat=(w,d,x,z,m,y,down)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m);p.rotation.x=down?Math.PI/2:-Math.PI/2;p.position.set(x,y||0,z);p.userData.keep=1;if(!down)p.receiveShadow=true;sh.add(p);};
  flat(15.1,D,-1.95,0,fm);flat(3.9,f>1?2.95:D,7.55,f>1?-.725:0,fm);
  flat(15.1,D,-1.95,0,cm,H,true);flat(3.9,f<3?2.95:D,7.55,f<3?.725:0,cm,H,true);
  for(const [w,d,x,z] of[[W+.6,.3,0,-hz-.15],[W+.6,.3,0,hz+.15],[.3,D,-hx-.15,0],[.3,D,hx+.15,0]])box(sh,w,H,d,null,x,0,z,{mat:wm,ol:false});
  for(const [w,d,x,z] of[[W,.04,0,-hz+.02],[W,.04,0,hz-.02],[.04,D,-hx+.02,0],[.04,D,hx-.02,0]]){box(sh,w,.95,d,C.s,x,0,z,{ol:false});box(sh,w+.02,.08,d+.04,'#ffffff',x,.92,z,{ol:.012});}
  col(L,-hx-1,-hz-1,hx+1,-hz);col(L,-hx-1,hz,hx+1,hz+1);col(L,-hx-1,-hz,-hx,hz);col(L,hx,-hz,hx+1,hz);
  box(sh,14.6,.02,1.3,C.r,-2.2,0,0,{ol:false});
  for(const x of[-6.5,-2,2.5]){cyl(sh,.42,.3,.16,'#ffffff',x,H-.16,0,{seg:16});sph(sh,.22,null,x,H-.2,0,{mat:GLOW,ol:false,ws:12,hs:8});}
  /* the 5 flats on this floor */
  for(let d=1;d<=5;d++){const [dx,side]=FLAT_POS[d-1],wz=side*hz,ry=side<0?0:Math.PI,num=f*10+d,dc=FLAT_DC[d-1];
    doorAt(sh,dx,wz,ry,dc,false,true);plate(sh,String(num),'#ffffff','#3d2c5e',.5,.3,dx,1.98,wz-side*.1,ry);
    box(sh,1.0,.03,.6,'#c98f5e',dx,0,wz-side*.45,{ol:false});
    FLAT_SPOT[num]={x:L.ox+dx,z:L.oz+wz-side*.02,ry,dc,wc:C.w,sd:2.65,flat:num,wallT:.32,n:'flat '+num};
    inter(L,{x:dx,z:wz-side*1.1,r:1.5,icon:()=>dsFlat(num)&&!dlCarrying()?'🎨':'🚪',label:()=>dlCarrying()?`Knock and deliver 🍕`:dsFlat(num)?'Go in and decorate 🎨':`Knock on door ${num}`,pri:()=>dlCarrying()||dsFlat(num),act:()=>knockFlat(f,d)});}
  plate(sh,`Floor ${f} · flats ${f}1–${f}5`,C.r,'#ffffff',2.4,.42,1.4,2.45,0,Math.PI/2,true);
  box(sh,.04,.5,.04,'#ffffff',1.4,2.66,-1.0,{ol:false});box(sh,.04,.5,.04,'#ffffff',1.4,2.66,1.0,{ol:false});
  /* stairs going up (north side) */
  const wood='#d9a46c',swm={color:new THREE.Color(C.w)};   /* 🪜 the stairwells: hallway walls and a ceiling (they were a dark void with a floating lamp) */
  if(f<3){for(let i=0;i<12;i++)box(sh,.325,(i+1)*.25,1.45,wood,5.6+i*.325+.1625,0,-1.475,{ol:.012});
    shaftAt(sh,3.9,3.2,1.45,7.55,H+1.6,-1.475,swm,'#fffaf2',1);cyl(sh,.3,.22,.12,'#ffffff',9.1,H+3.08,-1.475,{seg:14});sph(sh,.16,null,9.1,H+3.04,-1.475,{mat:GLOW,ol:false,ws:12,hs:8});
    for(let i=0;i<12;i+=2)box(sh,.05,.9,.05,'#ffffff',5.6+i*.325+.16,(i+1)*.25,-.78,{ol:false});
    box(sh,4.92,.07,.08,'#ffffff',7.55,.95+1.5,-.78,{rz:Math.atan2(3,3.9),center:true,ol:.01});
    plate(sh,`⬆️ Floor ${f+1}`,'#ffffff','#3d2c5e',1.0,.38,5.25,2.25,-1.475,-Math.PI/2,true);   /* low enough to show under the ceiling sign from the door */
    inter(L,{x:5.0,z:-1.4,r:1.5,icon:'⬆️',label:'Go up to floor '+(f+1),act:()=>climb(f,1)});}
  else{windowAt(sh,hx-.02,1.0,-1.475,-Math.PI/2);const pl=buildFurn('plant');pl.position.set(8.8,0,-1.6);sh.add(pl);const bn=buildFurn('sofa','#b79cff');bn.position.set(7.2,0,-1.75);bn.scale.setScalar(.8);sh.add(bn);}
  /* stairs going down (south side) */
  if(f>1){shaftAt(sh,3.9,3.2,1.45,7.55,-1.6,1.475,swm,'#8f6b4c',0);
    for(let i=0;i<12;i++)box(sh,.325,3-(i+1)*.25,1.45,wood,5.6+i*.325+.1625,-3,1.475,{ol:.012});
    for(let i=0;i<5;i++)box(sh,.06,1.0,.06,'#ffffff',5.65+i*.95,0,.78,{ol:false});box(sh,3.9,.08,.1,'#ffffff',7.55,1.0,.78,{ol:.01});
    plate(sh,`⬇️ Floor ${f-1}`,'#ffffff','#3d2c5e',1.0,.38,5.25,2.25,1.475,-Math.PI/2,true);
    inter(L,{x:5.0,z:1.4,r:1.5,icon:'⬇️',label:'Go down to floor '+(f-1),act:()=>climb(f,-1)});}
  else{for(let r=0;r<2;r++)for(let c=0;c<5;c++)box(sh,.42,.34,.3,'#c9ced8',6.6+c*.46,1.0+r*.4,2.02,{ol:.01});
    const pl=buildFurn('plant');pl.position.set(9,0,1.7);sh.add(pl);}
  col(L,5.6,-hz,hx,-.75);col(L,5.6,.75,hx,hz);
  /* way out (ground floor) or a window (upper floors) */
  if(f===1){doorAt(sh,-hx,0,Math.PI/2,null,true,true);inter(L,{x:-8.6,z:0,r:1.7,icon:'🚪',label:'Go outside',act:()=>exitApt()});}
  else{windowAt(sh,-hx+.02,1.0,0,Math.PI/2);const pl=buildFurn('plant');pl.position.set(-8.9,0,1.6);sh.add(pl);}
}
function buildApts(){for(let f=1;f<=3;f++)buildAptFloor(f);}
function buildPizzeria(){const {L,sh,pr}=room('pizza',1600,'#fff0e0','pizza');
  // the counter where you pick up pizzas
  box(pr,5.2,1.0,.9,'#ff6b6b',0,0,-3.0);box(pr,5.4,.1,1.04,'#ffffff',0,1.0,-3.0,{ol:.02});for(let i=0;i<5;i++)box(pr,.5,.6,.02,'#ffffff',-2+i,.2,-2.54,{ol:false});col(L,-2.75,-3.55,2.75,-2.45);
  pizzaModel(pr,-1.6,1.1,-3.0,0);pizzaModel(pr,-.55,1.1,-3.0,1);pizzaBox(pr,.6,1.1,-3.0);pizzaBox(pr,.6,1.19,-3.0);pizzaBox(pr,1.7,1.1,-3.0);
  // the pizza oven
  box(pr,2.0,.9,1.6,'#c96b4f',4.6,0,-3.6);sph(pr,.95,'#d9805f',4.6,.9,-3.6,{s:[1,.8,1],ws:16,hs:10});cyl(pr,.16,.16,1.6,'#a8714a',4.6,1.5,-4.0,{seg:10});
  {const ov=new THREE.Group();ov.position.set(4.6,1.17,-2.7);ov.rotation.x=-.45;pr.add(ov);   /* 🔥 the oven mouth sits on the dome's front, tilted like it */
    box(ov,.8,.5,.06,'#2e2347',0,0,0,{center:true,ol:false});box(ov,.62,.22,.04,'#ff8a2b',0,-.06,.045,{center:true,ol:false});box(ov,.4,.1,.03,'#ffd45c',0,-.05,.075,{center:true,ol:false});}col(L,3.55,-4.5,5.65,-2.75);
  // pizza boxes waiting to be delivered
  box(pr,1.4,.8,1.0,'#c98f5e',-4.8,0,-3.6);for(let i=0;i<7;i++)pizzaBox(pr,-4.8+(i%2?.04:-.03),.8+i*.095,-3.6);col(L,-5.55,-4.15,-4.05,-3.05);
  const ds=signPlane('🛵 Delivery',1.6,.42,'#ff6b6b','#ffffff');ds.position.set(-4.8,2.2,-4.44);L.g.add(ds);
  const mb=menuBoard(2.6,1.4,'Pizza!',[['🍕 Pizza','12'],['🍕 Pizza slice','5'],['🥖 Garlic bread','4']]);mb.position.set(0,2.3,-4.44);L.g.add(mb);
  for(const [tx,tz,c] of [[3.4,1.3,'#ffffff'],[-3.2,1.6,'#ff6b6b']]){const t=buildFurn('table',c);t.position.set(tx,0,tz);pr.add(t);colC(L,tx,tz,.62);pizzaModel(pr,tx,.78,tz,tx>0?2:0);
    seatAt(L,pr,tx-1.05,tz,Math.PI/2,WOOD);seatAt(L,pr,tx+1.05,tz,-Math.PI/2,WOOD);}
  bake(sh,false);bake(pr,true);return L;}
function buildStudio(){BENCH_L=null;const L=makeLoc('studio','in',700,0,[-4,-4,4,4]);const g=new THREE.Group();L.g.add(g);
  cyl(g,1.25,1.25,.08,'#ffd6ec',0,0,0,{seg:40,ol:.03});cyl(g,.9,.9,.09,'#ffe9f4',0,0,0,{seg:40,ol:false});
  const r=seeded(11),C=['#ff7aa8','#ffd45c','#5fd4b0','#7cc8ff','#b79cff'];
  for(let i=0;i<18;i++){const a=r()*TAU,d=2.2+r()*2.6;sph(g,.06+r()*.07,C[i%5],Math.cos(a)*d,.5+r()*2.6,-1.4-r()*2.6,{ws:8,hs:6,ol:.012});}
  bake(g,true);return L;}
/* 🐾 run 4, job 12 (item 12): the Pet Shop has two floors. Downstairs: the counter, shelves of snacks and toys, a rack of pet clothes, the pet furniture for sale, the birdcage and the stairs
   in the west wall. Upstairs (40 m further along z, like the floors of your house): every kind of animal in its own fenced area, so they never mix: puppies with their breeds, kittens, bunnies,
   hamsters on their table, a capybara, ducks at a little pond, an owl on a perch. Adopting (💗 at every animal) and buying (🛒 downstairs) work as before */
function buildPetShop(){
  const L=makeLoc('pets','in',500,0,[-7,-5,7,5]);const W=14,D=10,H=3.4,wm=mat('#b0e6d2'),fm=toon({map:floorTex('mint')});L.W=W/2;L.D=D/2;L.items=new THREE.Group();scene.add(L.items);
  const fls=[];for(let k=0;k<2;k++){const g=new THREE.Group(),sh=new THREE.Group(),pr=new THREE.Group();g.add(sh,pr);g.position.set(0,0,UPZ*k);const F={k,g,sh,pr,grid:null};fls.push(F);
    shell({ox:L.ox,oz:L.oz+UPZ*k,cols:L.cols},sh,W,D,H,wm,fm,'#e2f1eb',g,UPG);   /* (run 4, stage 3: the walls and ceiling a little deeper: the shop looked washed out) */
    if(k===0){doorAt(sh,0,D/2-.02,Math.PI,null,true,true);windowIn(sh,W/2-.02,1.0,2.6,-Math.PI/2,'#ffd45c');stairsIn(sh,1,W,H,wm);}
    else{for(const z of[2.6,-2.6])windowIn(sh,W/2-.02,1.0,z,-Math.PI/2,'#ffd45c');for(const x of[-2.5,2.5])windowIn(sh,x,1.0,-D/2+.02,0,'#ffd45c');for(const x of[-2.5,2.5])windowIn(sh,x,1.0,D/2-.02,Math.PI,'#ffd45c');stairsIn(sh,0,W,H,wm);}
    const gh=new THREE.GridHelper(W,W*2,0xb79cff,0xd9c8ff);gh.scale.z=D/W;gh.position.set(0,.012,UPZ*k);gh.visible=false;L.g.add(gh);F.grid=gh;}
  L.fls=fls;L.g.add(fls[0].g);L.vf=-1;L.grid=fls[0].grid;L.bounds={x1:L.ox-W/2,z1:L.oz-D/2,x2:L.ox+W/2,z2:L.oz+UPZ+D/2};
  inter(L,{x:-W/2+.9,z:-.6,r:1.6,icon:'⬆️',label:'Upstairs to the animals',act:()=>hclimb(1)});inter(L,{x:-W/2+.9,z:UPZ+.6,r:1.6,icon:'⬇️',label:'Downstairs to the shop',act:()=>hclimb(-1)});
  /* ---- downstairs: the shop ---- */
  const pr=fls[0].pr;
  box(pr,3,1.0,.8,'#ffd45c',-4.9,0,2.0);box(pr,3.1,.08,.9,'#ffffff',-4.9,1.0,2.0);col(L,-6.45,1.55,-3.35,2.45);   /* the counter */
  shelfUnit(pr,-4.1,-4.55,0,4.6,['petfood','catfood','bunnyfood'],'#ffffff',.5);shelfUnit(pr,.9,-4.55,0,4.6,['treat','ball','squeaky'],'#ffffff',.5);col(L,-6.4,-5,3.2,-4.1);   /* 🦴 snacks and toys along the back wall */
  petClothesRack(pr,5.1,-4.55,0,3.2,['bow','hat','collar','scarf','pcrown','bowtie','cape','wings']);col(L,3.5,-5,6.7,-4.1);   /* 👒 pet clothes */
  shelfUnit(pr,6.5,.6,-Math.PI/2,3.6,['petfood','catfood','ball'],'#ffffff',.5);col(L,6.05,-1.3,7,2.5);
  {const t=buildFurn('cattree','#b79cff');t.position.set(-2.5,0,-1.3);pr.add(t);colC(L,-2.5,-1.3,.55);const d=buildFurn('doghouse','#7cc8ff');d.position.set(-6.1,0,-1.4);d.rotation.y=Math.PI/2;pr.add(d);col(L,-6.7,-2.0,-5.5,-.8);const pb=buildFurn('petbed','#ff9ec4');pb.position.set(2.3,0,-1.5);pr.add(pb);colC(L,2.3,-1.5,.5);}   /* pet furniture for sale, on show */
  {cyl(pr,.04,.04,1.3,'#c8c8d8',5.8,0,3.9,{seg:6});const cage=new THREE.Group();cage.position.set(5.8,1.3,3.9);pr.add(cage);for(let k=0;k<10;k++){const a=k/10*TAU;cyl(cage,.012,.012,.8,'#c8c8d8',Math.cos(a)*.35,0,Math.sin(a)*.35,{seg:4,ol:false});}
   cyl(cage,.36,.36,.05,'#ffd45c',0,0,0,{seg:16,ol:.01});cone(cage,.38,.3,'#ffd45c',0,.8,0,{seg:16,ol:.01});sph(cage,.1,'#5fd4b0',0,.35,0,{ws:10,hs:8,ol:.012});sph(cage,.06,'#5fd4b0',0,.49,.06,{ws:8,hs:6,ol:.01});cone(cage,.03,.06,'#ffd45c',0,.47,.14,{rx:Math.PI/2,center:true,seg:5,ol:false});colC(L,5.8,3.9,.45);}
  {const up=signPlane('🐾 Animals upstairs ⬆️',2.4,.5,'#ffd45c','#3d2c5e');up.position.set(-W/2+.06,2.55,-2.4);up.rotation.y=Math.PI/2;fls[0].g.add(up);}
  /* ---- upstairs: every kind in its own area (local z, 40 m along) ---- */
  const pu=fls[1].pr,Z=UPZ;L.pens=[];
  const pen=(type,kinds,x0,x1,z0,z1,c,o)=>{o=o||{};box(pu,x1-x0,.04,z1-z0,o.floor||'#ffe9a8',(x0+x1)/2,0,(z0+z1)/2,{ol:false});
    for(const z of[z0,z1])box(pu,x1-x0,.3,.1,c,(x0+x1)/2,0,z,{ol:.02});for(const x of[x0,x1])box(pu,.1,.3,z1-z0,c,x,0,(z0+z1)/2,{ol:.02});
    for(const x of[x0,x1])for(const z of[z0,z1])box(pu,.14,.5,.14,'#ffffff',x,0,z,{ol:.02});
    col(L,x0-.08,Z+z0-.08,x1+.08,Z+z1+.08);
    const s=signPlane(PET_TYPES[type].icon+' '+PET_TYPES[type].many,Math.min(2.6,x1-x0-.3),.5,c,'#3d2c5e');s.position.set((x0+x1)/2,2.95,z1<0?-D/2+.06:D/2-.06);   /* (run 4, stage 3: above the windows, which hid them) */if(z1>0)s.rotation.y=Math.PI;fls[1].g.add(s);   /* (run 4, stage 3: the upstairs group is already 40 m along; the signs added 40 m again and hung outside the room) */
    L.pens.push(Object.assign({type,kinds,x0:x0+.4,x1:x1-.4,z0:Z+z0+.4,z1:Z+z1-.4},o.y?{y:o.y}:{},o.pz!==undefined?{pz:Z+o.pz}:{},o.swim?{swim:1}:{}));};   /* (run 4 finish: pz: the line of the perch a bird keeps to) */
  pen('dog',['dog','pug','pomchi','sausage'],-6.7,-2.1,-4.9,-1.9,'#ffd45c');pen('cat',['cat','cat'],-1.7,1.1,-4.9,-1.9,'#ff9ec4');pen('bunny',['bunny','bunny'],1.5,4.1,-4.9,-1.9,'#b79cff');pen('capybara',['capybara'],4.5,6.7,-4.9,-1.9,'#c9a24a');
  pen('duck',['duck','duck'],-6.7,-3.5,1.9,4.9,'#7cc8ff',{floor:'#9fd8f2',swim:1});disc(pu,1.1,'#7cc8ff',-5.1,.05,3.4,{seg:20});   /* 🦆 a little pond */
  pen('owl',['owl'],-3.1,-.5,1.9,4.9,'#9a6a43',{y:.95,pz:3.4});{box(pu,.12,.95,.12,'#9a6a43',-2.9,0,3.4,{ol:.015});box(pu,.12,.95,.12,'#9a6a43',-.7,0,3.4,{ol:.015});box(pu,2.3,.08,.1,'#b07a52',-1.8,.9,3.4,{ol:.012});}   /* 🦉 a perch */
  {box(pu,2.6,.8,2.0,'#c98f5e',1.3,0,3.4);box(pu,2.4,.04,1.8,'#ffe7a3',1.3,.8,3.4,{ol:false});const cg=toon({color:'#cfeeff',transparent:true,opacity:.16});box(pu,2.45,.55,1.85,null,1.3,.8,3.4,{mat:cg,ol:false});   /* no dark outline hull round the glass */
   const wh=new THREE.Mesh(new THREE.TorusGeometry(.18,.03,6,16),mat('#ff7aa8'));wh.position.set(2.1,1.02,3.0);pu.add(wh);col(L,-.1,Z+2.3,2.7,Z+4.5);
   const s2=signPlane('🐹 Hamsters',1.6,.4,'#ffd45c','#3d2c5e');s2.position.set(1.3,1.72,2.4);fls[1].g.add(s2);L.pens.push({type:'hamster',x0:.3,x1:2.3,z0:Z+2.7,z1:Z+4.1,y:.82});}   /* 🐹 the hamsters' table */
  {box(pu,1.8,.08,.5,'#c98f5e',4.9,.45,3.9,{ol:.012});for(const x of[4.1,5.7])box(pu,.1,.45,.5,'#c98f5e',x,0,3.9,{ol:.012});box(pu,1.8,.5,.08,'#c98f5e',4.9,.5,4.12,{ol:.012});col(L,4.0,Z+3.6,5.8,Z+4.2);}   /* a little bench to watch the animals from */
  for(const F of fls){bake(F.sh,false);bake(F.pr,true);}
  inter(L,{x:0,z:4.3,r:1.9,icon:'🚪',label:'Go outside',act:()=>exitTo('pets')});
  inter(L,{x:5.6,z:.6,r:2,icon:'🛒',label:'Buy pet food, toys & clothes',act:()=>openShop('pets')});
  inter(L,{x:5.1,z:-3.6,r:1.8,icon:'👒',label:'Pet clothes',act:()=>openShop('pets')});
  return L;
}
/* 👒 a rack of little pet clothes: bows, hats, collars, scarves, crowns, bow ties, capes and wings in bright colours */
function petClothesRack(g,x,z,ry,w,items,c='#ffffff'){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);
  box(p,w,2.0,.1,c,0,0,-.35);box(p,.1,2.0,.8,c,-w/2+.05,0,0);box(p,.1,2.0,.8,c,w/2-.05,0,0);for(const y of[.1,.75,1.4])box(p,w,.06,.8,c,0,y,0,{ol:.015});box(p,w,.1,.8,c,0,1.95,0);
  const cols=['#ff4d8d','#7cc8ff','#ffd45c','#5fd4b0','#b79cff','#ff8a6b'];let k=0;for(const y of[.16,.81,1.46]){const n=Math.floor((w-.3)/.5);for(let i=0;i<n;i++){const it=items[k%items.length],cc=cols[k%6],xx=-w/2+.4+i*.5;k++;
    if(it==='bow'){const b=new THREE.Group();b.position.set(xx,y+.12,.05);p.add(b);bowShape(b,.5,cc,{ol:.008});}
    else if(it==='hat'){cone(p,.13,.26,cc,xx,y,.05,{seg:10,ol:.01});sph(p,.035,'#ffffff',xx,y+.28,.05,{ws:6,hs:5,ol:false});}
    else if(it==='pcrown'){cyl(p,.12,.13,.1,'#ffd45c',xx,y,.05,{seg:10,ol:.01});for(let q=0;q<4;q++){const a=q/4*TAU;cone(p,.03,.08,'#ffd45c',xx+Math.cos(a)*.1,y+.1,.05+Math.sin(a)*.1,{seg:4,ol:false});}}
    else if(it==='collar'){const t=new THREE.Mesh(new THREE.TorusGeometry(.11,.025,6,16),mat(cc));t.position.set(xx,y+.03,.05);t.rotation.x=Math.PI/2;p.add(t);sph(p,.03,'#ffd45c',xx,y+.03,.16,{ws:6,hs:5,ol:false});}
    else if(it==='scarf'){box(p,.28,.06,.2,cc,xx,y,.05,{ol:.01});box(p,.08,.2,.06,cc,xx+.1,y,.14,{ol:.01});}
    else if(it==='bowtie'){for(const s of[-1,1])cone(p,.06,.12,cc,xx+s*.07,y+.06,.05,{rz:s*Math.PI/2,center:true,seg:5,ol:.008});sph(p,.03,shade(cc,-.2),xx,y+.06,.05,{ws:6,hs:5,ol:false});}
    else if(it==='cape'){box(p,.26,.22,.03,cc,xx,y,0,{ol:.01});box(p,.3,.04,.05,'#ffd45c',xx,y+.22,0,{ol:false});}
    else{for(const s of[-1,1])sph(p,.12,cc,xx+s*.1,y+.1,.04,{s:[1,.7,.25],ws:8,hs:6,ol:.01});}}}}   /* 🧚 wings */

