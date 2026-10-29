
'use strict';
/* ================= core ================= */
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const rand=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[(Math.random()*a.length)|0];
const TAU=Math.PI*2;
const FONT='"Baloo 2","Trebuchet MS","Arial Rounded MT Bold",sans-serif';
const INK='#2e2347';
function angLerp(a,b,t){const d=((b-a+Math.PI)%TAU+TAU)%TAU-Math.PI;return a+d*t;}
function seeded(seed){let s=(Math.imul((seed|0)+7,2654435761)>>>0)||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function shade(c,k){const o=new THREE.Color(c);o.offsetHSL(0,0,k);return '#'+o.getHexString();}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}

let renderer,scene,camera,hemi,sun,lamp,skyMesh,skyU,stars,sunSprite,moonSprite,FOG,outside,clouds=[];
const TREES=[];   /* 🌳 every round tree in town (x, z, size, its group): the autumn leaves fall from the crowns near you (run 4, item 18) */
let GRAD=null,OL=null,OLP=null,WIN,LAMP,WATER,PANE,GLOW,CLOUD,OLC,SWIN,WINM;
const MATS=new Map();
/* 🧱 a wall almost edge-on to the sun (run 4, item 17): the shadow map cannot tell lit from shadowed there and drew pale diagonal streaks on it (the "white smear"), while the toon shade
   would light it at the middle tone; so within 7° of edge-on the side facing the sun counts as lit and the side facing away as shadowed, blending into the real shadow test beyond that */
const SHLIFT={value:1};   /* 1 outdoors: a face turned away from the sun takes no cast shadow (run 4 finish) */
const SHADE_FIX=sh=>{sh.uniforms.shLift=SHLIFT;sh.fragmentShader='uniform float shLift;\n'+sh.fragmentShader.replace('#include <lights_fragment_begin>',THREE.ShaderChunk.lights_fragment_begin.replace('? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;',
  '? ( shLift > 0.5 && dot( geometry.normal, directLight.direction ) < 0.0 ) ? 1.0 : mix( dot( geometry.normal, directLight.direction ) > 0.0 ? 1.0 : 0.0, getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ), smoothstep( 0.0, 0.12, abs( dot( geometry.normal, directLight.direction ) ) ) ) : 1.0;'));};   /* (the include is still unresolved when onBeforeCompile runs, so the chunk is pasted in patched) */
function mat(c){c=String(c).toLowerCase();let m=MATS.get(c);if(!m){m=new THREE.MeshToonMaterial({color:c,gradientMap:GRAD});m.userData.plain=1;m.onBeforeCompile=SHADE_FIX;MATS.set(c,m);}return m;}
let TOONVC=null;
function toon(o){const m=new THREE.MeshToonMaterial(Object.assign({gradientMap:GRAD},o));m.onBeforeCompile=SHADE_FIX;return m;}
function initMaterials(gl2){
  const tones=[120,200,255],data=new Uint8Array(tones.length*4);tones.forEach((v,i)=>data.set([v,v,v,255],i*4));
  GRAD=new THREE.DataTexture(data,tones.length,1,THREE.RGBAFormat);
  GRAD.minFilter=THREE.NearestFilter;GRAD.magFilter=THREE.NearestFilter;GRAD.generateMipmaps=false;GRAD.needsUpdate=true;
  OL=new THREE.MeshBasicMaterial({color:INK,side:THREE.BackSide});
  /* people's ink shells sit a hair behind the surfaces, so thin slivers can't poke through hair and faces (no shimmer) */
  OLP=new THREE.MeshBasicMaterial({color:INK,side:THREE.BackSide,polygonOffset:true,polygonOffsetFactor:2,polygonOffsetUnits:2});TOONVC=new THREE.MeshToonMaterial({color:'#ffffff',vertexColors:true,gradientMap:GRAD});TOONVC.onBeforeCompile=SHADE_FIX;   /* (run 4 finish: the baked pieces, most walls, too: without it their shadow test still drew the noon streaks) */
  OLC=new THREE.MeshBasicMaterial({color:'#6d5fa0',side:THREE.BackSide,fog:false});
  WIN=toon({color:'#9fd4f2',emissive:new THREE.Color('#ffc66b'),emissiveIntensity:0});SWIN=toon({color:'#9fd4f2',emissive:new THREE.Color('#ffc66b'),emissiveIntensity:0});WINM=WIN;   /* SWIN: shop glass, dim at night while closed */
  LAMP=toon({color:'#fff6d6',emissive:new THREE.Color('#ffd27a'),emissiveIntensity:0});
  WATER=toon({color:'#7fd8ff',emissive:new THREE.Color('#3aa6e0'),emissiveIntensity:.3,transparent:true,opacity:.9});
  PANE=new THREE.MeshBasicMaterial({color:'#bfe6ff'});
  GLOW=new THREE.MeshBasicMaterial({color:'#fff3c4'});
  CLOUD=new THREE.ShaderMaterial({uniforms:{top:{value:new THREE.Color('#ffffff')},bot:{value:new THREE.Color('#dde4f0')}},   /* ☁️ soft puffs (run 4, item 18): a gentle top-to-bottom shade set by updSky, no outline, no hard dark faces */
    vertexShader:'varying float vy;void main(){vy=normalize(mat3(modelMatrix)*normal).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'uniform vec3 top,bot;varying float vy;void main(){gl_FragColor=vec4(mix(bot,top,smoothstep(-.55,.75,vy)),1.0);}',fog:false});
}

/* ---- primitive builders: y is the bottom unless o.center; every solid gets an ink outline hull ---- */
const OT=.03;
function place(g,m,o,x,y,z){m.position.set(x,y,z);if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);g.add(m);return m;}
function hull(g,geo,m,o){const h=new THREE.Mesh(geo,o.olMat||OL);h.position.copy(m.position);h.rotation.copy(m.rotation);h.scale.copy(m.scale);g.add(h);return h;}
function box(g,w,h,d,c,x=0,y=0,z=0,o={}){const m=place(g,new THREE.Mesh(new THREE.BoxGeometry(w,h,d),o.mat||mat(c)),o,x,o.center?y:y+h/2,z);if(o.ol!==false){const t=o.ol||OT;hull(g,new THREE.BoxGeometry(w+2*t,h+2*t,d+2*t),m,o);}return m;}
function cyl(g,rt,rb,h,c,x=0,y=0,z=0,o={}){const n=o.seg||14;const m=place(g,new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),o.mat||mat(c)),o,x,o.center?y:y+h/2,z);if(o.ol!==false){const t=o.ol||OT;hull(g,new THREE.CylinderGeometry(rt+t,rb+t,h+2*t,n),m,o);}return m;}
function sph(g,r,c,x=0,y=0,z=0,o={}){const a=o.ws||14,b=o.hs||10;const m=place(g,new THREE.Mesh(new THREE.SphereGeometry(r,a,b),o.mat||mat(c)),o,x,y,z);if(o.ol!==false){const t=o.ol||OT;hull(g,new THREE.SphereGeometry(r+t,a,b),m,o);}return m;}
function cone(g,r,h,c,x=0,y=0,z=0,o={}){const n=o.seg||12;const m=place(g,new THREE.Mesh(new THREE.ConeGeometry(r,h,n),o.mat||mat(c)),o,x,o.center?y:y+h/2,z);if(o.ol!==false){const t=o.ol||OT;hull(g,new THREE.ConeGeometry(r+t*1.6,h+t*3,n),m,o);}return m;}
function flat(g,w,d,c,x,y,z,o={}){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),o.mat||mat(c));m.rotation.x=-Math.PI/2;if(o.ry)m.rotation.z=o.ry;m.position.set(x,y,z);g.add(m);return m;}
function disc(g,r,c,x,y,z,o={}){const m=new THREE.Mesh(new THREE.CircleGeometry(r,o.seg||28),o.mat||mat(c));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);g.add(m);return m;}
function prismGeo(len,base,height,t=0){const s=new THREE.Shape(),b=base/2+t*1.8;s.moveTo(-b,-t);s.lineTo(b,-t);s.lineTo(0,height+t*1.8);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:len+2*t,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(-(len/2+t),0,0);return g;}
function starGeo(r,t,d){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,q=(i%2?r*.45:r)+t,x=Math.cos(a)*q,y=Math.sin(a)*q;if(i)s.lineTo(x,y);else s.moveTo(x,y);}s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:d+2*t,bevelEnabled:false});g.translate(0,0,-(d/2+t));return g;}
/* the holiday tree's outline: its three cones' radius at a height (the furniture's own size; the town's big tree is it scaled up) */
function xmasProf(y){let r=0;for(const [cy,cr,ch] of [[.25,.5,.7],[.65,.4,.6],[1.0,.28,.5]])if(y>=cy&&y<=cy+ch)r=Math.max(r,cr*(1-(y-cy)/ch));return r;}
const STARM=new THREE.MeshBasicMaterial({color:'#ffd45c',fog:false});   /* ⭐ a star shines by itself (run 4, stage 3: the tree's star was dark at night) */
function starOn(g,x,y,z,r,c){for(const ry of[0,Math.PI/2]){const m=new THREE.Mesh(starGeo(r,0,r*.22),c?mat(c):STARM);m.position.set(x,y,z);m.rotation.y=ry;g.add(m);hull(g,starGeo(r,r*.1,r*.22),m,{});}}   /* ⭐ two crossed flat stars: a star from every side (run 4, stage 3) */
function prism(g,len,base,height,c,x,y,z,o={}){const m=place(g,new THREE.Mesh(prismGeo(len,base,height),o.mat||mat(c)),o,x,y,z);if(o.ol!==false)hull(g,prismGeo(len,base,height,o.ol||OT),m,o);return m;}

/* ---- merge all static meshes of a group into one mesh per material (few draw calls on iPad) ---- */
function bake(root,shadow=true,chunk=0){const _v=new THREE.Vector3();
  root.updateMatrixWorld(true);
  const inv=new THREE.Matrix4().copy(root.matrixWorld).invert();
  const buckets=new Map(),kill=[];
  root.traverse(o=>{
    if(!o.isMesh||o.userData.keep)return;
    for(let p=o.parent;p&&p!==root;p=p.parent)if(p.userData.keep)return;
    const src=o.geometry.index?o.geometry.toNonIndexed():o.geometry;
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',src.attributes.position.clone());
    g.setAttribute('normal',src.attributes.normal.clone());
    g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld));
    const vc=!!o.material.userData.plain;
    if(vc){const n=g.attributes.position.count,C=new Float32Array(n*3),c=o.material.color;for(let i=0;i<n;i++){C[i*3]=c.r;C[i*3+1]=c.g;C[i*3+2]=c.b;}g.setAttribute('color',new THREE.BufferAttribute(C,3));}
    let k=vc?'vc':o.material.uuid;if(chunk){o.getWorldPosition(_v);k+=':'+Math.floor(_v.x/chunk)+','+Math.floor(_v.z/chunk);}
    if(!buckets.has(k))buckets.set(k,{m:vc?TOONVC:o.material,l:[],vc});
    buckets.get(k).l.push(g);kill.push(o);
  });
  for(const o of kill){o.parent.remove(o);o.geometry.dispose();}
  const out=[];
  for(const {m,l,vc} of buckets.values()){
    let n=0;for(const g of l)n+=g.attributes.position.count;
    const P=new Float32Array(n*3),N=new Float32Array(n*3),Cc=vc?new Float32Array(n*3):null;let off=0;
    for(const g of l){P.set(g.attributes.position.array,off*3);N.set(g.attributes.normal.array,off*3);if(Cc)Cc.set(g.attributes.color.array,off*3);off+=g.attributes.position.count;g.dispose();}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('normal',new THREE.BufferAttribute(N,3));if(Cc)geo.setAttribute('color',new THREE.BufferAttribute(Cc,3));geo.computeBoundingSphere();
    const mesh=new THREE.Mesh(geo,m);const isOL=m.side===THREE.BackSide;
    mesh.castShadow=shadow&&!isOL&&!m.transparent;mesh.receiveShadow=!isOL;root.add(mesh);out.push(mesh);
  }
  return out;
}

/* ---- text: name tags, signs, floating numbers ---- */
function rr(x,X,Y,W,H,R){R=Math.min(R,H/2,W/2);x.beginPath();x.moveTo(X+R,Y);x.arcTo(X+W,Y,X+W,Y+H,R);x.arcTo(X+W,Y+H,X,Y+H,R);x.arcTo(X,Y+H,X,Y,R);x.arcTo(X,Y,X+W,Y,R);x.closePath();}
function textCanvas(text,o={}){
  const size=o.size||44,pad=o.pad??20,bw=o.bw??6;
  const c=document.createElement('canvas'),x=c.getContext('2d');
  const f=`800 ${size}px ${FONT}`;x.font=f;
  const ink=inkOf(text,f,'middle'),tw=Math.max(Math.ceil(ink.w),4);   /* the pixels the text really covers (run 4, job 5: an emoji can draw wider than it measures) */
  c.width=tw+pad*2+bw*2;c.height=Math.ceil(size*1.36)+bw*2;
  x.font=f;x.textAlign='left';x.textBaseline='middle';
  if(o.bg!==null){x.fillStyle=o.bg||'#fff7fb';rr(x,bw/2,bw/2,c.width-bw,c.height-bw,999);x.fill();if(bw){x.lineWidth=bw;x.strokeStyle=o.border||'#3d2c5e';x.stroke();}}
  const ty=c.height/2+size*.07;
  const tx=c.width/2-ink.cx;if(o.stroke){x.lineJoin='round';x.lineWidth=o.strokeW||10;x.strokeStyle=o.stroke;x.strokeText(text,tx,ty);}
  x.fillStyle=o.fg||'#3d2c5e';x.fillText(text,tx,ty);
  return c;
}
/* 💬 a two-line bubble: the same pill style, rounder corners; lines centred by their inked pixels like textCanvas (run 4 finish) */
function textCanvas2(lines,o={}){const size=o.size||44,pad=o.pad??20,bw=o.bw??6,lh=size*1.18,c=document.createElement('canvas'),x=c.getContext('2d'),f=`800 ${size}px ${FONT}`;x.font=f;
  const inks=lines.map(t=>inkOf(t,f,'middle')),tw=Math.max(4,...inks.map(k=>Math.ceil(k.w)));c.width=tw+pad*2+bw*2;c.height=Math.ceil(lh*lines.length+size*.36)+bw*2;
  x.font=f;x.textAlign='left';x.textBaseline='middle';x.fillStyle=o.bg||'#fff7fb';rr(x,bw/2,bw/2,c.width-bw,c.height-bw,size*.62);x.fill();if(bw){x.lineWidth=bw;x.strokeStyle=o.border||'#3d2c5e';x.stroke();}
  x.fillStyle=o.fg||'#3d2c5e';lines.forEach((t,i)=>x.fillText(t,c.width/2-inks[i].cx,bw+size*.18+lh*(i+.5)+size*.07));return c;}
function spriteOf(c,h){const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,fog:false}));s.scale.set(h*c.width/c.height,h,1);s.userData.keep=1;return s;}
function label(text,h=.3,o){const s=spriteOf(textCanvas(text,o),h);if(h<=.45&&!(o&&o.fit===false)){s.userData.w0=s.scale.x;s.userData.h0=h;s.onBeforeRender=tagFit;}return s;}
/* 🏷️ name tags and bubbles: never taller on screen than a HUD button (close up they grew huge and covered the buttons),
   and they fade away when you stand right next to someone, and when they are too far away to read (a line under 15 px tall; gone under 11 px: run 4 finish,
   far tags piled into unreadable stacks, and a far grandma's bubble, drawn over everything, sat on a near face). Worked out just before drawing: no extra drawing work */
function tagFit(r,sc,cam){const u=this.userData,e=this.matrixWorld.elements,c=cam.matrixWorld.elements,d=Math.max(.05,Math.hypot(e[12]-c[12],e[13]-c[13],e[14]-c[14]));
  const nat=u.h0*innerHeight/(2*d*Math.tan((cam.fov||70)*Math.PI/360)),mx=clamp(Math.min(innerWidth,innerHeight)*.065,26,48)*(u.lines||1),k=nat>mx?mx/nat:1;
  if(k!==u.k){u.k=k;this.scale.set(u.w0*k,u.h0*k,1);this.updateMatrix();if(this.parent)this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);}
  const ln=nat/(u.lines||1);this.material.opacity=Math.min(d<1.4?clamp((d-.95)/.45,0,1):1,clamp((ln-11)/4,0,1));
  if(u.top===undefined)u.top=!this.material.depthTest;if(u.top)this.material.depthTest=d>10||ln<15;if(u.bub)bubDodge(this,cam);}   /* (run 4 finish: one drawn over everything, a grandma's bubble or a photo family's tag, is so only within 10 m and while it can be read: further, a wall in front hides it; a far grandma's bubble floated over the bus shelter, she stood behind it) */
/* 🏠 a house's name label on Friends Lane: it fades out far away (with many friends online the far labels piled up)
   and slides down from under the HUD (the clock, the buttons, the map column) onto its house */
function laneTagR(r,sc,cam){const e=this.matrixWorld.elements,c=cam.matrixWorld.elements,d=Math.hypot(e[12]-c[12],e[14]-c[14]);   /* (along the ground: a six-floor house's tag hangs 24 m up and faded out from anywhere the whole house shows; run 4, stage 3) */
  this.material.opacity=clamp((34-d)/8,0,1);hudDodge(this,cam);}
const HUDK={f:-1,r:[]},_hv=new THREE.Vector3(),_hw=new THREE.Vector3();
function hudRects(){const f=renderer.info.render.frame;if(HUDK.f===f)return HUDK.r;HUDK.f=f;const R=HUDK.r;R.length=0;   /* (looked up once per drawn frame) */
  if(!$('hud').hidden){for(const el of $('left').children){const b=boxOf(el);if(b)R.push(b);}for(const id of['topbtns','updBtn']){const b=boxOf($(id));if(b)R.push(b);}
    const t=hudLow();if(t)R.push({left:-1e4,right:1e4,top:-1e4,bottom:t});}   /* (the whole top row band, and above the screen's top) */
  return R;}
function hudDodge(s,cam){s.center.y=.5;s.material.depthTest=true;if(s.material.opacity<=0)return;const R=hudRects();if(!R.length)return;
  _hv.setFromMatrixPosition(s.matrixWorld);const z=-_hw.copy(_hv).applyMatrix4(cam.matrixWorldInverse).z;if(z<.2)return;_hv.project(cam);
  const W=innerWidth,H=innerHeight,f=H/(2*Math.tan(cam.fov*Math.PI/360)),h=s.scale.y*f/z,w=s.scale.x*f/z,x=(_hv.x+1)/2*W,y=(1-_hv.y)/2*H;let dn=0;
  if(x+w/2<0||x-w/2>W||y+h/2<0||y-h/2>H)return;   /* (off the screen anyway) */
  for(let n=0;n<4;n++){let more=0;for(const b of R)if(x+w/2>b.left&&x-w/2<b.right&&y-h/2+dn<b.bottom+4&&y+h/2+dn>b.top){dn=b.bottom+4-(y-h/2);more=1;}if(!more)break;}
  if(dn>Math.max(h*2.5,H*.22))s.material.opacity=0;else if(dn>0){s.center.y=.5+dn/h;s.material.depthTest=false;}}   /* (moved down onto its house: drawn on top of it; too far under the HUD: not shown) */
/* 💬 a speech bubble slides sideways, still over its speaker (who stays inside it, at worst near its end), to stay clear of the map and notepad
   column, the buttons and the screen's edges (run 4 finish: a grandma's bubble ran under the corner map: "eding the ducks is the best part of my day.") */
function bubDodge(s,cam){const u=s.userData;if(u.cy0===undefined)u.cy0=s.center.y;s.center.x=.5;s.center.y=u.cy0;if(s.material.opacity<=0)return;const R=hudRects();
  _hv.setFromMatrixPosition(s.matrixWorld);const z=-_hw.copy(_hv).applyMatrix4(cam.matrixWorldInverse).z;if(z<.2)return;_hv.project(cam);
  const W=innerWidth,H=innerHeight,f=H/(2*Math.tan(cam.fov*Math.PI/360)),h=s.scale.y*f/z,w=s.scale.x*f/z,x=(_hv.x+1)/2*W,y=(1-_hv.y)/2*H;let t=y-h*(1-s.center.y),bt=y+h*s.center.y;
  for(const b of R)if(b.left<-1e3&&t<b.bottom+4){const dn=Math.min(h,b.bottom+4-t);s.center.y=u.cy0+dn/h;t+=dn;bt+=dn;}   /* (run 4 finish: below the top row too: on a sideways phone a bubble ran under the clock chip and the buttons) */
  let lo=6,hi=W-6;for(const b of R)if(b.left>-1e3&&t<b.bottom&&bt>b.top){if(b.left+b.right<W)lo=Math.max(lo,b.right+6);else hi=Math.min(hi,b.left-6);}   /* (the top row's band is not a side: it stays as it is) */
  let cx=.5;if(x-w/2<lo)cx=(x-lo)/w;else if(x+w/2>hi)cx=1-(hi-x)/w;const fr=x<lo||x>hi;
  if(fr&&w>hi-lo&&hi-lo>40){const k=(hi-lo)/w;s.scale.x*=k;s.scale.y*=k;u.k=-1;s.updateMatrix();if(s.parent)s.matrixWorld.multiplyMatrices(s.parent.matrixWorld,s.matrix);cx=x<lo?(x-lo)/(hi-lo):1-(hi-x)/(hi-lo);}   /* (run 4 finish: wider than the space beside the column: drawn smaller to fit; a bubble ran past the screen's edge) */
  s.center.x=fr?cx:clamp(cx,.05,.95);}   /* (run 4 finish: a speaker under the HUD column or off the edge: the bubble clears it all, readable) */
/* 🔤 run 4, job 5 (item 7), the root cause of off-centre and cut-off signs: the text was placed by measureText, but a colour emoji (iPad) can draw wider than it
   measures, so "🏖 To the beach" or "🏰 Knights & castles" slid off centre or past the edge (the test machine had no colour emoji, so the checks never saw it).
   Now every sign, plate and label draws the text once on a scratch canvas, finds the pixels it REALLY covers (inkOf) and scales and centres by those */
let INKC=null;const INKM=new Map();   /* ⏱️ stage-1 check (N15): measuring took 0.4 s a sign on a tablet-like browser (the pixels came back from the graphics chip); now the scratch canvas lives in main memory, the text is measured at 48 px and scaled, and a text is measured once */
function inkBox(x,W,H,bgc){const d=x.getImageData(0,0,W,H).data;let x1=W,y1=H,x2=-1,y2=-1;for(let j=0;j<H;j++){const row=j*W*4;for(let i=0;i<W;i++){const k=row+i*4;if(bgc?Math.abs(d[k]-bgc[0])+Math.abs(d[k+1]-bgc[1])+Math.abs(d[k+2]-bgc[2])>90:d[k+3]>40){if(i<x1)x1=i;if(i>x2)x2=i;if(j<y1)y1=j;if(j>y2)y2=j;}}}return x2<0?null:{x1,y1,x2:x2+1,y2:y2+1};}
/* the ink of a text drawn with this font: its size and its middle, relative to the text's origin (textAlign left, the given baseline) */
function inkOf(text,font,baseline){const key=text+'|'+font+'|'+(baseline||'');const hit=INKM.get(key);if(hit)return hit;
  const S0=parseInt(font.match(/(\d+)px/)[1],10)||40,q=S0>48?S0/48:1,s=Math.round(S0/q),f=q>1?font.replace(/(\d+)px/,s+'px'):font;   /* big text is measured at 48 px and scaled back up */
  const c=INKC||(INKC=document.createElement('canvas')),x=c.getContext('2d',{willReadFrequently:true});x.font=f;const tw=Math.ceil(x.measureText(text).width);
  const W=Math.min(2048,Math.ceil(tw*1.3+s*1.4+24)),H=Math.min(256,Math.ceil(s*2.2));if(c.width!==W||c.height!==H){c.width=W;c.height=H;}
  x.clearRect(0,0,W,H);x.font=f;x.textAlign='left';x.textBaseline=baseline||'alphabetic';x.fillStyle='#000';const ox=Math.floor(s*.6),oy=Math.floor(H*(baseline==='middle'?.5:.66));x.fillText(text,ox,oy);
  const b=inkBox(x,W,H),r=!b?{w:tw*q,h:S0,cx:tw*q/2,cy:baseline==='middle'?0:-S0*.35,x1:0}:{w:(b.x2-b.x1)*q,h:(b.y2-b.y1)*q,cx:((b.x1+b.x2)/2-ox)*q,cy:((b.y1+b.y2)/2-oy)*q,x1:(b.x1-ox)*q};
  if(INKM.size>400)INKM.clear();INKM.set(key,r);return r;}
function signPlane(text,w,h,bg,fg,pad){text=String(text).replace(/️/g,'');   /* 🧹 no hidden character after an emoji: some tablets drew it as a little box (night 3, job 18) */
  const H=160,W=Math.round(H*w/h),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});
  const draw=()=>{x.fillStyle=bg;x.fillRect(0,0,W,H);let s=104,f=()=>`800 ${s}px ${FONT}`,b=inkOf(text,f(),'alphabetic');
    const mx=Math.max(12,W*(pad||.06)),my=Math.max(8,H*.1),k=Math.min((W-2*mx)/(b.w||1),(H-2*my)/(b.h||1),1);if(k<1){s=Math.max(12,Math.floor(s*k));b=inkOf(text,f(),'alphabetic');}   /* a wide margin: inside the sign with room to spare */
    x.font=f();x.textAlign='left';x.textBaseline='alphabetic';x.fillStyle=fg;const tx=W/2-b.cx,ty=H/2-b.cy;x.fillText(text,tx,ty);   /* the ink's middle lands in the sign's middle */
    const bgc=/^#[0-9a-f]{6}$/i.test(bg)?[1,3,5].map(i=>parseInt(bg.slice(i,i+2),16)):null,v=bgc&&inkBox(x,W,H,bgc);   /* second look: only the pixels that really show against the sign's colour (the steam of ☕ is nearly white) decide the middle */
    if(v){const dx=W/2-(v.x1+v.x2)/2,dy=H/2-(v.y1+v.y2)/2;if(Math.abs(dx)>1||Math.abs(dy)>1){x.fillStyle=bg;x.fillRect(0,0,W,H);x.fillStyle=fg;x.fillText(text,tx+dx,ty+dy);}}};
  draw();const t=new THREE.CanvasTexture(c);t.anisotropy=4;fontLate(()=>{draw();t.needsUpdate=true;});
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));m.userData.keep=1;m.userData.sign={text,w,h,bg,fg,c};return m;
}
/* 🔤 signs drawn before the round game font arrived are drawn again once it is there (slow internet: the font may come after the town is built) */
let FONTQ=null;
function fontLate(fn){try{if(!document.fonts||document.fonts.check(`800 40px ${FONT}`))return;if(!FONTQ){FONTQ=[];document.fonts.load('800 40px "Baloo 2"').then(()=>{const q=FONTQ;FONTQ=null;INKM.clear();for(const f of q)try{f();}catch(e){}}).catch(()=>{FONTQ=null;});}FONTQ.push(fn);}catch(e){}}
const FLOATS=[];
function floatText(text,x,y,z,o={}){const s=label(text,o.h||.4,{bg:null,bw:0,pad:14,fg:o.fg||'#3d2c5e',stroke:'#ffffff',strokeW:12,size:50,fit:false});s.position.set(x,y,z);if(o.top){s.material.depthTest=false;s.renderOrder=9;}scene.add(s);FLOATS.push({s,t:0,life:o.life||1.4});}
function updFloats(dt){for(let i=FLOATS.length-1;i>=0;i--){const f=FLOATS[i];f.t+=dt;f.s.position.y+=dt*.55;f.s.material.opacity=1-Math.max(0,(f.t/f.life-.55)*2.2);if(f.t>=f.life){scene.remove(f.s);f.s.material.map.dispose();f.s.material.dispose();FLOATS.splice(i,1);}}}

/* ---- sound ---- */
const SET=Object.assign({look:1,sound:true,gfx:'nice',pad:true},(()=>{try{return JSON.parse(localStorage.getItem('cozytown-settings'))||{};}catch(e){return{};}})());
function saveSet(){try{localStorage.setItem('cozytown-settings',JSON.stringify(SET));}catch(e){}}
let AC=null;
function audioInit(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();}catch(e){AC=null;}}if(AC&&AC.state==='suspended')AC.resume().catch(()=>{});}
function tone(f,d=.12,type='sine',v=.15,delay=0,f2){if(!AC||!SET.sound)return;try{const t=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.03);}catch(e){}}
const SFX={
  coin(){tone(988,.09,'square',.05);tone(1319,.16,'square',.05,.08);},
  pop(){tone(420,.12,'triangle',.18,0,780);},
  tap(){tone(660,.05,'triangle',.08);},
  talk(){tone(520+Math.random()*140,.07,'sine',.12);tone(700+Math.random()*140,.08,'sine',.1,.07);},
  door(){tone(220,.16,'triangle',.18,0,120);},
  eat(){for(let i=0;i<3;i++)tone(300+Math.random()*90,.05,'square',.05,i*.09);},
  no(){tone(230,.2,'sawtooth',.05,0,160);},
  yay(){[523,659,784,1047].forEach((f,i)=>tone(f,.15,'triangle',.11,i*.08));},
  pet(){tone(880,.1,'sine',.12,0,1250);tone(1175,.12,'sine',.1,.1,1450);},
  woof(){tone(380,.09,'square',.07,0,240);tone(380,.09,'square',.06,.15,220);},
  meow(){tone(700,.32,'sine',.1,0,520);},
  squeak(){tone(1400,.08,'sine',.08,0,1800);tone(1500,.08,'sine',.07,.1,1900);},
  quack(){tone(520,.12,'square',.07,0,380);tone(480,.1,'square',.06,.14,340);},yip(){tone(900,.07,'square',.06,0,1200);tone(950,.07,'square',.05,.11,1250);},
  jump(){tone(330,.16,'triangle',.14,0,660);},
  land(){tone(160,.08,'triangle',.12,0,110);},
  honk(){tone(420,.14,'square',.06);tone(420,.16,'square',.06,.2);},
  kick(){tone(160,.1,'triangle',.2,0,90);},
  shot(){tone(120,.16,'triangle',.28,0,60);tone(520,.22,'sine',.05,.03,1300);},
  whistle(){tone(2300,.12,'sine',.05,0,2500);tone(2300,.32,'sine',.05,.16,2600);},sip(){tone(760,.06,'sine',.04,0,520);tone(700,.07,'sine',.04,.08,480);},
  quack(){tone(520,.08,'square',.05,0,380);tone(500,.09,'square',.05,.13,360);},
  whee(){tone(500,.6,'sine',.1,0,1100);},
  splash(){for(let i=0;i<5;i++)tone(900+Math.random()*900,.06,'sine',.05,i*.04);},
  knock(){for(let i=0;i<3;i++){tone(170,.08,'triangle',.32,i*.19,95);tone(90,.06,'sine',.3,i*.19+.005);}},
  rare(){[1047,1319,1568,2093].forEach((f,i)=>tone(f,.2,'triangle',.14,i*.09));tone(2637,.45,'sine',.11,.4);tone(3136,.6,'sine',.09,.55);},
  ding(){tone(1175,.16,'sine',.17);tone(1568,.26,'sine',.16,.14);tone(1175,.16,'sine',.14,.55);tone(1568,.3,'sine',.14,.69);},
  slam(){tone(120,.35,'square',.13,0,40);tone(70,.45,'sine',.38,0,30);for(let i=0;i<4;i++)tone(380+Math.random()*260,.05,'square',.035,.06+i*.05);},
  step(){tone(150+Math.random()*40,.06,'triangle',.13,0,95);},
  creak(){tone(300,.5,'sawtooth',.022,0,170);},
  late(){tone(660,.12,'square',.05);tone(520,.2,'square',.05,.14);},
  bounce(){tone(240,.06,'triangle',.12,0,150);},
  hit(){tone(620,.06,'square',.06,0,360);tone(1300,.05,'triangle',.07);},
  swish(){tone(1200,.13,'sine',.03,0,420);},
  aww(){tone(587,.16,'sine',.08,0,466);tone(466,.24,'sine',.07,.15,392);},
  ring(){for(let k=0;k<2;k++)for(let i=0;i<8;i++)tone(i%2?1047:1319,.06,'triangle',.11,k*.75+i*.07);},
  boo(){tone(190,.34,'sine',.11,0,95);tone(760,.14,'triangle',.035,.04,260);},   /* 👻 a soft, friendly BOO */
  spook(k){if(k==='skel'){for(let i=0;i<4;i++)tone(1400+i*120,.03,'triangle',.05,i*.07);}else if(k==='zombie')tone(120,.5,'sine',.1,0,88);else if(k==='bats'){for(let i=0;i<6;i++)tone(900+(i%2)*200,.025,'square',.018,i*.06);}else if(k==='pumpkin'){tone(240,.4,'sine',.09,0,180);tone(480,.12,'triangle',.03,.1,360);}else this.boo();},   /* 👻💀🧟🦇🎃 soft scare sounds (run 4): quiet and short */
};
function playTune(){const s=[0,4,7,12,7,4,5,9,12,9,7,4,0];s.forEach((n,i)=>tone(523.25*Math.pow(2,n/12),.3,'triangle',.13,i*.2));}

/* ---- toast & fade ---- */
let toastT=0;
/* 🍞 a message (toast) never sits on an open card, the top HUD buttons or the use button: it takes the first free spot from a wish list
   (its usual spot first). While the "Still there?" or "Reconnecting…" card is up, messages wait in a little line and come one by one after it.
   One message at a time, each one readable: a new message waits until the one on screen had time to be read (1.6 s, longer for long words; it
   used to push it away at once, so "Welcome back" was gone after 5 ms). The answer to a new tap or key still shows at once, and the same words
   again just stay longer. News (not the answer to a tap: a friend came, you are online…, or a message from before the card you opened) waits
   while an open card leaves it no free spot, and comes when the card closes; news that waited 30 s is old and is skipped */
const TQ={hold:false,line:false,q:[],cur:null,at:0,tm:0,card:-1e9,cev:null},T_OLD=30000,toastRead=m=>Math.min(m.s,Math.max(1.6,m.m.length*.05))*1000;
function toastEv(){const e=window.event;return e&&/^(click|dblclick|pointer|mouse|touch|key|input|change|submit)/.test(e.type)?e:null;}   /* the tap or key this happens in */
const toastWith=m=>m.ev?m.ev===TQ.cev:Math.abs(TQ.card-m.at)<100;   /* made together with the card that is open now */
/* 📍 "here" news belongs to the place where it was said (the bus is here, Driver Dot's hello at the beach): here = 1 drops it when you go
   somewhere else (a door, a bus ride), so it never pops up at the other end of a bus ride; here = 2 ("📍 You found …") also when it could not be
   shown within 12 s (by then you walked on) */
const T_HERE=12000,toastGone=(m,now)=>m.here!=null&&(m.here!==(CUR&&CUR.id)||m.spot&&now-m.at>T_HERE);
function toast(msg,sec=2.8,here){msg=String(msg);const t=$('toast'),on=t.classList.contains('show'),now=performance.now();
  if(on&&t.textContent===msg){clearTimeout(toastT);toastT=setTimeout(toastEnd,sec*1000);return;}   /* the same words again: they stay longer */
  if(TQ.q.some(m=>m.m===msg))return;const ev=toastEv(),m={m:msg,s:sec,at:now,ev,news:!ev&&now-TQ.card>100,gd:S?S.day:-1,gt:S?S.time:0,here:here?(CUR&&CUR.id)||'':null,spot:here===2,talk:/^\S+\s+“/.test(msg)};   /* talk: someone in front of you says it ("🐰 “Happy Easter!…”") */   /* (right with a card that opens: its answer) */
  if(!m.news&&!TQ.hold&&!TQ.line&&!(on&&ev&&TQ.cur&&TQ.cur.ev===ev)){toastShow(m);return;}   /* the answer to a new tap: at once */
  TQ.q.push(m);if(TQ.q.length>3)TQ.q.shift();toastPump();}
function toastShow(m){const t=$('toast'),st=t.style,was=[t.textContent,t.className,st.left,st.top,st.bottom,st.maxWidth];t.textContent=m.m;t.classList.add('show');let ok=true;try{ok=toastPlace(m);}catch(e){}
  if(!ok&&!m.keep&&(m.news||TQ.card>m.at&&!toastWith(m)||!$('tut').hidden)){[t.textContent,t.className,st.left,st.top,st.bottom,st.maxWidth]=was;return false;}   /* news, and no free spot beside the open card: not yet (all as it was) */
  try{popClear();}catch(e){}TQ.cur=m;TQ.at=performance.now();TQ.line=!!m.keep;clearTimeout(toastT);toastT=setTimeout(toastEnd,m.s*1000);
  TQ.sig=toastSig();if(!TQ.iv)TQ.iv=setInterval(toastWatch,300);setTimeout(toastWatch,0);   /* (a card that closes right after its answer) */
  if(TQ.q.length){clearTimeout(TQ.tm);TQ.tm=setTimeout(toastPump,toastRead(m)+20);}return true;}
/* while a message is up: a card closing, the use button (and its words) or the arrow bar coming or going finds it a new spot if it now sits on them */
function toastSig(){return [UI.open,$('actWrap').hidden,$('actLbl').textContent,$('nav').hidden,$('hud').hidden,$('note').hidden].join('|');}   /* (and the note going: run 4, stage 3: the shoot's hint sat on the photo bar, placed round the booking note, and stayed there) */
function toastWatch(){if(!$('toast').classList.contains('show')){clearInterval(TQ.iv);TQ.iv=0;return;}const g=toastSig();if(g!==TQ.sig){TQ.sig=g;toastFit();}}
function toastEnd(){$('toast').classList.remove('show');TQ.line=false;TQ.cur=null;if(TQ.q.length&&!TQ.hold){clearTimeout(TQ.tm);TQ.tm=setTimeout(toastPump,300);}}
function toastPump(){clearTimeout(TQ.tm);TQ.tm=0;if(TQ.hold||!TQ.q.length)return;const now=performance.now();
  if(TQ.cur&&$('toast').classList.contains('show')){const w=(TQ.line?TQ.cur.s*1000:toastRead(TQ.cur))-(now-TQ.at);if(w>0){TQ.tm=setTimeout(toastPump,w+20);return;}}   /* the one on screen gets its turn first */
  for(let i=0;i<TQ.q.length;i++){const m=TQ.q[i];TQ.q.splice(i,1);if(!m.keep&&now-m.at>T_OLD||toastGone(m,now)||!m.keep&&S&&m.gd>=0&&(S.day!==m.gd||Math.abs(S.time-m.gt)>.5)){i--;continue;}   /* (run 4 finish: or the game clock has jumped since: the football friends' "until 19:00" showed at 22:10) */   /* old news (or news from another place): skipped */
    if(toastShow(m))return;TQ.q.splice(i,0,m);}
  if(TQ.q.length)TQ.tm=setTimeout(toastPump,600);}   /* news waiting for a free spot: look again soon */
/* a card opens (open) or the screen turns: a message from before that now has to sit on the card steps aside and waits until the card closes */
function toastFit(open){const t=$('toast'),m=TQ.cur;if(!t.classList.contains('show'))return;let ok=true;try{ok=toastPlace(m);}catch(e){}
  if(!ok&&m&&!m.keep&&(open?!toastWith(m):m.news)){m.news=true;clearTimeout(toastT);t.classList.remove('show');TQ.cur=null;TQ.q.unshift(m);if(TQ.q.length>3)TQ.q.pop();toastPump();}}
function toastOff(){clearTimeout(toastT);clearTimeout(TQ.tm);$('toast').classList.remove('show');TQ.q.length=0;TQ.line=false;TQ.cur=null;}   /* an old hint that no longer fits (a new class step) */
function toastLeave(id){for(let i=TQ.q.length-1;i>=0;i--){const h=TQ.q[i].here;if(h!=null&&h!==id)TQ.q.splice(i,1);}   /* you went somewhere else: "here" news from the old place goes */
  const c=TQ.cur;if(c&&c.here!=null&&c.here!==id&&$('toast').classList.contains('show')){clearTimeout(toastT);toastEnd();}}
function toastHold(on){if(on===TQ.hold)return;TQ.hold=on;if(on){clearTimeout(toastT);clearTimeout(TQ.tm);$('toast').classList.remove('show');TQ.line=false;TQ.cur=null;}
  else if(!PLAYING)TQ.q.length=0;else{for(const m of TQ.q)m.keep=1;toastPump();}}   /* the ones that waited come one by one, each for its full time */
/* where things on screen are (null = not shown), and what a message must keep clear: weight 10 = a card, 4 = the top HUD row, 3 = the use button and the
   pink arrow bar, 1 = the map/notepad column */
function boxOf(el){if(!el||el.hidden)return null;const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return null;const cs=getComputedStyle(el);return cs.visibility==='hidden'||cs.display==='none'?null:r;}
function cardBox(){const c=$('card');let r=boxOf(c);if(!r||getComputedStyle(c).overflowY!=='visible')return r;let {left,top,right,bottom}=r;   /* a card with a name tag sticking out (Zac, people talking): the tag counts too */
  for(const k of c.children){const q=boxOf(k);if(q){left=Math.min(left,q.left);top=Math.min(top,q.top);right=Math.max(right,q.right);bottom=Math.max(bottom,q.bottom);}}return {left,top,right,bottom,width:right-left,height:bottom-top};}
function keepClear(me){const K=[],add=(el,w)=>{if(el&&el!==me){const r=boxOf(el);if(r)K.push([r,w]);}};
  if(!$('panel').hidden){const r=cardBox();if(r)K.push([r,10]);}add(document.querySelector('#awayBox .awc'),10);for(const id of['knockCard','tutCard','dtCard','tchBar','ptbar'])add($(id),8);add($('note'),6);if($('toast').classList.contains('show'))add($('toast'),2);
  if(!$('hud').hidden){const u=$('panel').hidden?1:.25,tap=me===$('note')?8:1;for(const id of['stats','busTip','tnHud','fbHud','topbtns','updBtn'])add($(id),4);   /* (run 4 finish: the top row counts fully while you can see it: above a big card on a tablet the message lay on the round buttons) */add($('actWrap'),3*u);add($('bar'),3*u);add($('nav'),3*u);for(const id of['tasks','job','pad','dcard'])add($(id),u);add($('moveBtns'),tap*u);add($('joy'),tap*u);}   /* under an open card the HUD matters less; the message card (it takes taps) must not sit on the joystick or jump */
  return K;}
function hudLow(){let b=0;for(const id of['stats','busTip','tnHud','fbHud','topbtns']){const r=boxOf($(id));if(r)b=Math.max(b,r.bottom);}return b;}   /* the bottom of the top HUD row */
function leftBox(){let r0=null;for(const el of $('left').children){const r=boxOf(el);if(r)r0=r0?{right:Math.max(r0.right,r.right),bottom:Math.max(r0.bottom,r.bottom)}:{right:r.right,bottom:r.bottom};}return r0||{right:0,bottom:0};}
function visH(){const v=window.visualViewport;return v&&v.height>50?Math.min(innerHeight,Math.round(v.offsetTop+v.height)):innerHeight;}   /* the screen height you can see: above the on-screen keyboard while typing */
function spotFor(w,h,wish,K){const W=innerWidth,H=visH();let best=null,bc=Infinity;
  for(const c of wish){if(!c||!isFinite(c[0])||!isFinite(c[1]))continue;const x=clamp(c[0]-w/2,6,Math.max(6,W-w-6)),y=clamp(c[1],6,Math.max(6,H-h-6));let s=0;
    for(const [r,k] of K){const ox=Math.min(x+w,r.right)-Math.max(x,r.left),oy=Math.min(y+h,r.bottom)-Math.max(y,r.top);if(ox>0&&oy>0)s+=ox*oy*k;}
    if(s<bc-.5){bc=s;best=[x+w/2,y];if(s<=0){best.free=1;break;}}}
  return best;}
function toastPlace(m){const t=$('toast');if(!t.classList.contains('show'))return true;m=m||TQ.cur;t.style.maxWidth='';t.classList.remove('side');const W=innerWidth,H=visH(),w=t.offsetWidth,h=t.offsetHeight,cs=getComputedStyle(document.documentElement),sT=parseFloat(cs.paddingTop)||0,sB=parseFloat(cs.paddingBottom)||0;
  const K=keepClear(t),hb=hudLow()+10,lc=leftBox(),mid=(lc.right+W)/2,c=UI.open?cardBox():null,a=boxOf($('actWrap')),usual=H-sB-200-h,tch=document.body.classList.contains('tch');
  const shoot=document.body.classList.contains('shoot'),cre=!!document.querySelector('#panel:not([hidden]) #card .crsave');   /* (in the clothes maker the message sits above your figure, not on it: run 4, stage 3) */   /* 📸 during a photo shoot the message sits up under the chips, never on the joystick or the photo bar (run 4, stage 3) */
  const talk=!!(m&&m.talk);   /* 💬 the words of someone you talk to sit up under the top row, not on their face (run 4, stage 3: the Easter Bunny's box hid its nose and mouth) */
  let s=spotFor(w,h,[cre?[W*.27,sT+8]:null,shoot&&W>innerHeight&&innerHeight<=500?[(parseFloat(cs.paddingLeft)||0)+10+w/2,sT+6]:null,shoot||talk?[W/2,hb]:null,tch||shoot?null:[W/2,usual],a?[W/2,a.top-h-10]:null,[W/2,hb],tch?null:[mid,usual],[mid,hb],c?[W/2,c.top-h-10]:null,c?[W/2,c.bottom+10]:null,[W/2,sT+8],[W/2,H-sB-h-8]],K);
  const narrow=(x0,x1,wish)=>{if(x1-x0<150)return null;t.style.maxWidth=(x1-x0)+'px';t.classList.add('side');const w2=t.offsetWidth,h2=t.offsetHeight,s2=spotFor(w2,h2,wish(h2),K);
    if(s2&&s2.free)return s2;t.style.maxWidth='';t.classList.remove('side');return null;};   /* the same message in a narrower box (2-4 short lines) */
  if(c&&s&&!s.free){for(const [x0,x1] of[[c.right+8,W-8],[8,c.left-8]]){const s2=narrow(x0,x1,h2=>[[(x0+x1)/2,(H-h2)/2],[(x0+x1)/2,hb]]);if(s2){s=s2;break;}}}   /* a big card: beside it */
  else if(s&&!s.free&&!$('hud').hidden){let x0=8;for(const k of $('left').children){const r=boxOf(k);if(r&&r.bottom>hb-8)x0=Math.max(x0,r.right+8);}   /* (the left column under the top row) */
    for(const x1 of[W-8,a?a.left-8:0]){const s2=narrow(x0,x1,()=>[[(x0+x1)/2,hb]]);if(s2){s=s2;break;}}}
  if(c&&s&&!s.free){const tb=boxOf($('topbtns'));if(tb&&tb.left>200){const s2=narrow(8,tb.left-8,()=>[[tb.left/2,sT+8]]);if(s2)s=s2;}}   /* a big card on a tall screen: up in the top row, left of the round buttons (run 4 finish: the "online" message lay on the chat and phone buttons over the map) */   /* a phone: in the free middle under the top row, between the left column (arrow bar, map) and the use button */
  const e=c&&s&&!s.free&&m&&!m.news&&m.ev&&/^(click|dblclick|pointer|mouse)/.test(m.ev.type)?m.ev:null,t0=e&&e.target instanceof Element?e.target.closest('[data-a],button,[role=button]')||e.target:null,el=t0&&$('card').contains(t0)?t0:null,
    fx=e?e.clientX:-1,fy=e?e.clientY:-1,fin=e&&fx>c.left&&fx<c.right&&fy>c.top&&fy<c.bottom;
  if(el||fin){   /* the answer to a tap on a card that fills the screen: right above what you tapped (or under it), not on the card's title, buttons or info line */
    let r=el?el.getBoundingClientRect():null;const B=r&&(r.width>240||r.height>160)?r:c;   /* (a big thing like the map: over it, where the finger was) */
    if(!r||B===r)r={left:fx-24,right:fx+24,top:fy-24,bottom:fy+24};const x0=Math.max(c.left,B.left)+10,x1=Math.min(c.right,B.right)-10;t.style.maxWidth=Math.min(400,x1-x0)+'px';t.classList.add('side');const w2=t.offsetWidth,h2=t.offsetHeight,cx=clamp((r.left+r.right)/2,x0+w2/2,Math.max(x0+w2/2,x1-w2/2));
    const hd=$('card').querySelector('.hd'),ctl=hd?[...hd.children].filter(x=>x.tagName!=='H2').map(x=>x.getBoundingClientRect()):[];
    const bad=(x,y)=>y<Math.max(c.top,0)+4||y+h2>Math.min(c.bottom,H)-4||ctl.some(q=>x-w2/2<q.right&&x+w2/2>q.left&&y<q.bottom&&y+h2>q.top),up=r.top-8-h2,dn=r.bottom+8,
      cx2=Math.max(x0+w2/2,Math.min(cx,Math.min(1e9,...ctl.map(q=>q.left))-6-w2/2));   /* (up there: left of the card's own buttons) */
    if(!bad(cx,up))s=[cx,up];else if(!bad(cx2,up))s=[cx2,up];else if(!bad(cx,dn))s=[cx,dn];else{t.style.maxWidth='';t.classList.remove('side');}}
  if(s){t.style.left=s[0]+'px';t.style.top=s[1]+'px';t.style.bottom='auto';}
  if(!c||!s)return true;const w2=t.offsetWidth,h2=t.offsetHeight,x=s[0]-w2/2;return x+w2<=c.left+2||x>=c.right-2||s[1]+h2<=c.top+2||s[1]>=c.bottom-2;}   /* false = it had to sit on the open card */
/* 📩 the message card sits under the top HUD row (on a phone held upright: under the map and notepad), never on the clock or the buttons */
function notePlace(){const n=$('note');if(n.hidden)return;n.style.left='';n.style.top='';const W=innerWidth,H=innerHeight,w=n.offsetWidth,h=n.offsetHeight,t0=n.offsetTop,K=keepClear(n),hb=hudLow()+10,lc=leftBox();
  const s=spotFor(w,h,[[W/2,t0],[W/2,hb],[(lc.right+W)/2,hb],[(lc.right+W)/2,t0],[W/2,lc.bottom+10],[W/2,(H-h)/2]],K);
  if(s&&(Math.abs(s[1]-t0)>1||Math.abs(s[0]-W/2)>1)){n.style.left=s[0]+'px';n.style.top=s[1]+'px';}}
addEventListener('resize',()=>setTimeout(()=>{toastFit();notePlace();try{cardMore();}catch(e){}},80));
/* 🧹 glitch fixes, pass 1 (screens): the styles of the fixes below (the page's first 498 lines stay as they are) */
{const st=document.createElement('style');st.textContent='.pop{white-space:normal;width:max-content;max-width:92vw;text-align:center;line-height:1.1;font-size:clamp(26px,min(10vw,11vh),60px)}.pop.slam{font-size:clamp(34px,min(14vw,15vh),80px)}'
  +'@media (max-height:500px){#moreBand{height:40px!important}}#moreBand{position:absolute;z-index:2;height:58px;background:linear-gradient(to bottom,rgba(255,250,253,0),var(--paper) 70%);pointer-events:none}#moreBand[hidden]{display:none}#moreHint{position:absolute;z-index:3;width:46px;height:46px;border-radius:50%;background:var(--paper);border:3px solid var(--line);box-shadow:0 3px 0 var(--soft);font-size:21px;line-height:40px;text-align:center;pointer-events:none;animation:moreBob .9s ease-in-out infinite alternate}@keyframes moreBob{to{transform:translateY(-6px)}}'
  +'.crsave.more::before{content:"";position:absolute;left:0;right:0;bottom:100%;height:30px;background:linear-gradient(to bottom,transparent,var(--paper));pointer-events:none}.crsave.more::after{content:"⬇️";position:absolute;right:14px;bottom:calc(100% + 4px);width:46px;height:46px;border-radius:50%;background:var(--paper);border:3px solid var(--line);box-shadow:0 3px 0 var(--soft);font-size:21px;line-height:40px;text-align:center;pointer-events:none;animation:moreBob .9s ease-in-out infinite alternate}'
  +'.psj div{color:#3d2c5e;font-size:15px;line-height:1.2}.psrow.me,.psrow.cur{color:#3d2c5e}.ph-row .hearts .off{color:#3d2c5e}'
  +'#knockCard{width:min(400px,92vw)}body:has(#note:not([hidden])) #knockCard{top:calc(env(safe-area-inset-top,0px) + 240px)}body:has(#note:not([hidden])) .pop{top:48%}   /* while a message card is up at the top, the knock card and the coin pop keep under it (run 4, stage 3) */#knockCard .kc-b{flex-wrap:wrap}#knockCard .kc-b .btn{white-space:nowrap}'
  +'.ph-hd h3{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}#toast.side{font-size:16px;padding:6px 10px}'
  +'.app .ic.calic{display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;background:#fff;overflow:hidden;font-size:0}.calic b{display:block;background:#e8454a;color:#fff;font-size:13px;line-height:20px;font-weight:800;letter-spacing:.5px}.calic i{display:block;font-style:normal;font-size:34px;line-height:46px;font-weight:800;color:#3d2c5e}.calic i.tm{font-size:19px;letter-spacing:0}'
  +'body.away .logo span{animation:none}body.talk #cross,body.talk #moveBtns,body.talk #joy,body.talk #actWrap{visibility:hidden}body.kc #tut,body.kc #dtut{visibility:hidden}'
  +'.tpaper .tqq.lp{flex-wrap:wrap}.tpaper .tpic.long{flex:1 0 100%;max-width:none;white-space:nowrap;word-break:normal;font-size:clamp(15px,4.6vw,22px)}'
  +'.crsave{bottom:-22px;margin-bottom:-22px}.crsave .big{padding:10px 16px;white-space:nowrap}.crsave .btn{white-space:nowrap}'
  +'@media (max-width:600px),(max-height:500px){.cr .crname{font-size:20px;padding:6px 12px}.crow{grid-template-columns:84px 1fr;gap:8px;padding:5px 0}.cl{font-size:15px}.crow .pill{font-size:15px;padding:6px 11px}.crsave .big{font-size:24px;min-height:54px}.crsave{padding-top:8px;padding-bottom:calc(10px + env(safe-area-inset-bottom))}}'
  +'@media (max-height:500px){.crow{grid-template-columns:1fr;gap:3px;padding:4px 0}.cl{font-size:14px}.chs{gap:6px}'
  +'#panel.bottom .card{padding:14px 16px 12px}#panel.bottom .card .line{font-size:18px;margin:10px 0 2px}#panel.bottom .card .row{margin-top:8px}'
  +'#panel.bottom #card.psc{overflow-y:auto;padding:10px 14px 12px}.psc .hd{margin-bottom:4px}.psc .hd h2{font-size:22px}.psc .note{font-size:14px;margin:2px 0}.psc .psrow{padding:2px 4px}.psc .pji{font-size:22px;width:30px}.psc .psrow b{font-size:15px}.psc .psrow i{font-size:12px}.psc .earn{font-size:16px;margin:4px 0 0}'
  +'#card.psc.aim{display:grid;grid-template-columns:1fr auto;column-gap:12px;align-items:center}#card.psc.aim>.hd,#card.psc.aim>.note{grid-column:1/-1}.psc .psbar{height:44px;margin:6px 4px}#card.psc.aim .row{margin:0}.psc .psnow{font-size:22px;padding:8px 26px}'
  +'.phone{width:min(600px,72vw);padding:8px 10px 6px;gap:4px}.ph-screen{padding:8px 12px 30px}.ph-hd{margin:0 -12px 4px;padding:8px 16px 5px}.ph-clock{font-size:32px;margin-top:0}.ph-date{font-size:14px;margin-bottom:0}.apps{grid-template-columns:repeat(5,1fr);gap:6px 4px;margin-top:6px}.app{font-size:13px;gap:2px}.app .ic{width:54px;height:54px;font-size:28px;border-radius:17px}.calic b{font-size:10px;line-height:15px}.calic i{font-size:24px;line-height:33px}.calic i.tm{font-size:15px}}';
  document.head.appendChild(st);}
let fading=false,RENDER0=null;
function fade(fn){if(fading){setTimeout(()=>fade(fn),320);return;}fading=true;const f=$('fade');f.classList.add('on');setTimeout(()=>{try{fn();}catch(e){console.error(e);}setTimeout(()=>{f.classList.remove('on');fading=false;},80);},270);}

