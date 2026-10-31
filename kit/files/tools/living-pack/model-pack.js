/* model code copied unchanged from the book's tools/compare.html (scripts 3-5: game model code, rounds 2-44, COZY_PET_OBJECTS) */


const pick=a=>a[(Math.random()*a.length)|0];
const TAU=Math.PI*2;
const FONT='"Baloo 2","Trebuchet MS","Arial Rounded MT Bold",sans-serif';
const INK='#2e2347';
function seeded(seed){let s=(Math.imul((seed|0)+7,2654435761)>>>0)||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
function shade(c,k){const o=new THREE.Color(c);o.offsetHSL(0,0,k);return '#'+o.getHexString();}
const TREES=[];
let GRAD=null,OL=null,OLP=null,WIN,LAMP,WATER,PANE,GLOW,CLOUD,OLC,SWIN,WINM;
const MATS=new Map();
const SHLIFT={value:1};
const SHADE_FIX=sh=>{sh.uniforms.shLift=SHLIFT;sh.fragmentShader='uniform float shLift;\n'+sh.fragmentShader.replace('#include <lights_fragment_begin>',THREE.ShaderChunk.lights_fragment_begin.replace('? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;',
  '? ( shLift > 0.5 && dot( geometry.normal, directLight.direction ) < 0.0 ) ? 1.0 : mix( dot( geometry.normal, directLight.direction ) > 0.0 ? 1.0 : 0.0, getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ), smoothstep( 0.0, 0.12, abs( dot( geometry.normal, directLight.direction ) ) ) ) : 1.0;'));};
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
const OT=.03;
function place(g,m,o,x,y,z){m.position.set(x,y,z);if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);g.add(m);return m;}
function hull(g,geo,m,o){const h=new THREE.Mesh(geo,o.olMat||OL);h.position.copy(m.position);h.rotation.copy(m.rotation);h.scale.copy(m.scale);g.add(h);return h;}
function box(g,w,h,d,c,x=0,y=0,z=0,o={}){const m=place(g,new THREE.Mesh(new THREE.BoxGeometry(w,h,d),o.mat||mat(c)),o,x,o.center?y:y+h/2,z);if(o.ol!==false){const t=o.ol||OT;hull(g,new THREE.BoxGeometry(w+2*t,h+2*t,d+2*t),m,o);}return m;}
function cyl(g,rt,rb,h,c,x=0,y=0,z=0,o={}){const n=o.seg||14;const m=place(g,new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),o.mat||mat(c)),o,x,o.center?y:y+h/2,z);if(o.ol!==false){const t=o.ol||OT;hull(g,new THREE.CylinderGeometry(rt+t,rb+t,h+2*t,n),m,o);}return m;}
function sph(g,r,c,x=0,y=0,z=0,o={}){const a=o.ws||14,b=o.hs||10;const m=place(g,new THREE.Mesh(new THREE.SphereGeometry(r,a,b),o.mat||mat(c)),o,x,y,z);if(o.ol!==false){const t=o.ol||OT;hull(g,new THREE.SphereGeometry(r+t,a,b),m,o);}return m;}
function cone(g,r,h,c,x=0,y=0,z=0,o={}){const n=o.seg||12;const m=place(g,new THREE.Mesh(new THREE.ConeGeometry(r,h,n),o.mat||mat(c)),o,x,o.center?y:y+h/2,z);if(o.ol!==false){const t=o.ol||OT;hull(g,new THREE.ConeGeometry(r+t*1.6,h+t*3,n),m,o);}return m;}
function flat(g,w,d,c,x,y,z,o={}){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),o.mat||mat(c));m.rotation.x=-Math.PI/2;if(o.ry)m.rotation.z=o.ry;m.position.set(x,y,z);g.add(m);return m;}
function prismGeo(len,base,height,t=0){const s=new THREE.Shape(),b=base/2+t*1.8;s.moveTo(-b,-t);s.lineTo(b,-t);s.lineTo(0,height+t*1.8);s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:len+2*t,bevelEnabled:false});g.rotateY(Math.PI/2);g.translate(-(len/2+t),0,0);return g;}
function starGeo(r,t,d){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,q=(i%2?r*.45:r)+t,x=Math.cos(a)*q,y=Math.sin(a)*q;if(i)s.lineTo(x,y);else s.moveTo(x,y);}s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:d+2*t,bevelEnabled:false});g.translate(0,0,-(d/2+t));return g;}
function xmasProf(y){let r=0;for(const [cy,cr,ch] of [[.25,.5,.7],[.65,.4,.6],[1.0,.28,.5]])if(y>=cy&&y<=cy+ch)r=Math.max(r,cr*(1-(y-cy)/ch));return r;}
const STARM=new THREE.MeshBasicMaterial({color:'#ffd45c',fog:false});
function starOn(g,x,y,z,r,c){for(const ry of[0,Math.PI/2]){const m=new THREE.Mesh(starGeo(r,0,r*.22),c?mat(c):STARM);m.position.set(x,y,z);m.rotation.y=ry;g.add(m);hull(g,starGeo(r,r*.1,r*.22),m,{});}}
function prism(g,len,base,height,c,x,y,z,o={}){const m=place(g,new THREE.Mesh(prismGeo(len,base,height),o.mat||mat(c)),o,x,y,z);if(o.ol!==false)hull(g,prismGeo(len,base,height,o.ol||OT),m,o);return m;}
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
function rr(x,X,Y,W,H,R){R=Math.min(R,H/2,W/2);x.beginPath();x.moveTo(X+R,Y);x.arcTo(X+W,Y,X+W,Y+H,R);x.arcTo(X+W,Y+H,X,Y+H,R);x.arcTo(X,Y+H,X,Y,R);x.arcTo(X,Y,X+W,Y,R);x.closePath();}
let INKC=null;
const INKM=new Map();
function inkBox(x,W,H,bgc){const d=x.getImageData(0,0,W,H).data;let x1=W,y1=H,x2=-1,y2=-1;for(let j=0;j<H;j++){const row=j*W*4;for(let i=0;i<W;i++){const k=row+i*4;if(bgc?Math.abs(d[k]-bgc[0])+Math.abs(d[k+1]-bgc[1])+Math.abs(d[k+2]-bgc[2])>90:d[k+3]>40){if(i<x1)x1=i;if(i>x2)x2=i;if(j<y1)y1=j;if(j>y2)y2=j;}}}return x2<0?null:{x1,y1,x2:x2+1,y2:y2+1};}
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
let FONTQ=null;
function fontLate(fn){try{if(!document.fonts||document.fonts.check(`800 40px ${FONT}`))return;if(!FONTQ){FONTQ=[];document.fonts.load('800 40px "Baloo 2"').then(()=>{const q=FONTQ;FONTQ=null;INKM.clear();for(const f of q)try{f();}catch(e){}}).catch(()=>{FONTQ=null;});}FONTQ.push(fn);}catch(e){}}
function hairFor(h,L){
  const c=L.hair,c2=L.hair2||c,s=L.style,len=L.len||(s==='long'?'long':(s==='short'||s==='curly')?'short':'shoulder');   /* ✂️ len: long, shoulder, short (job 15) */
  box(h,.54,.14,.48,c,0,.37,0);
  if(L.swoop){box(h,.34,.1,.07,c,-.09,.3,.215,{rz:-.2,ol:false});box(h,.24,.08,.07,c,.14,.34,.215,{rz:.12,ol:false});}
  else box(h,.52,.08,.07,c,0,.32,.215,{ol:false});
  if(s==='bob'){box(h,.08,.28,.46,c2,-.27,.12,-.02);box(h,.08,.28,.46,c2,.27,.12,-.02);box(h,.56,.1,.29,c2,0,.1,-.125,{ol:false});}   /* the bob's hem wraps round the back only, never over the face; the side panels sit a hair behind the face so they don't flicker on it */
  else if(s==='short'||s==='curly'||len==='short'){box(h,.06,.2,.42,c2,-.27,.22,-.02);box(h,.06,.2,.42,c2,.27,.22,-.02);}
  else{box(h,.08,.34,.46,c2,-.27,.06,-.02);box(h,.08,.34,.46,c2,.27,.06,-.02);}
  box(h,.54,.4,.08,c2,0,.08,-.25);
  if(s==='long'||(len==='long'&&s!=='bun'&&s!=='short'&&s!=='bob'&&s!=='long')){box(h,.56,.42,.1,c2,0,-.3,-.25);box(h,.1,.36,.26,c2,-.27,-.28,-.08);box(h,.1,.36,.26,c2,.27,-.28,-.08);}
  if(s==='ponytail'){sph(h,.07,'#ff7aa8',0,.36,-.31,{ol:.015});box(h,.15,.38,.13,c,0,-.04,-.36,{rx:.22});}
  if(s==='bun')sph(h,.15,c,0,.58,-.05);
  if(s==='pigtails'){sph(h,.13,c,-.35,.2,-.05);sph(h,.13,c,.35,.2,-.05);sph(h,.05,'#ffd45c',-.29,.29,.02,{ol:.012});sph(h,.05,'#ffd45c',.29,.29,.02,{ol:.012});}
  if(s==='curly')for(const [x,z] of [[-.17,.12],[0,.15],[.17,.12],[-.2,-.08],[0,-.05],[.2,-.08],[-.1,-.2],[.1,-.2]])sph(h,.13,c,x,.5,z,{ws:10,hs:8});
}
const COSTUMES={cat:{c:'#8e8e9e',n:'Cat'},dog:{c:'#b07a52',n:'Dog'},ghost:{c:'#f4f2ff',n:'Ghost'},dino:{c:'#5fbf74',n:'Dinosaur'},bunny:{c:'#ffffff',n:'Bunny'}};
function costumeFor(b,head,legs,arms,k){const C=COSTUMES[k].c,D=shade(C,-.14),o={ol:.012};
  box(b,.5,.54,.32,C,0,.59,0,o);for(const hip of legs)box(hip,.21,.5,.23,C,0,-.5,0,o);for(const sh of arms)box(sh,.17,.4,.19,C,0,-.4,0,o);   /* the onesie */
  box(head,.56,.5,.5,C,0,.03,-.08,o);   /* the hood: open at the face */
  if(k==='cat'){for(const s of[-1,1]){cone(head,.09,.17,C,s*.17,.5,-.06,{seg:4,...o});cone(head,.05,.1,'#ffb3c7',s*.17,.52,-.03,{seg:4,ol:false});for(const [y,r] of[[.125,.12],[.095,-.1]])box(head,.15,.012,.008,'#3d2c5e',s*.2,y,.231,{rz:s*r,center:true,ol:false});}sph(head,.028,'#ff9ec4',0,.16,.232,{s:[1.2,.8,.6],ws:8,hs:6,ol:false});   /* 🐱 painted whiskers and a pink nose (run 4, stage 3) */cyl(b,.035,.05,.55,C,0,.42,-.26,{rx:-1.1,center:true,seg:6,...o});sph(b,.055,D,0,.69,-.47,{ws:6,hs:5,ol:false});box(b,.26,.32,.02,'#f6f0ff',0,.6,.165,{ol:false});}
  else if(k==='bunny'){for(const s of[-1,1]){sph(head,.075,C,s*.15,.62,-.04,{s:[1,2.8,.75],ws:8,hs:6,...o});sph(head,.04,'#ffb3c7',s*.15,.64,0,{s:[1,2.4,.5],ws:6,hs:5,ol:false});}sph(b,.085,C,0,.4,-.2,{ws:8,hs:6,ol:false});box(b,.26,.32,.02,'#ffe4ee',0,.6,.165,{ol:false});}   /* 🐰 long ears with pink insides, a fluffy tail, a soft tummy */
  else if(k==='dog'){for(const s of[-1,1])box(head,.11,.28,.06,D,s*.31,.06,-.06,{rz:s*.22,...o});cyl(b,.04,.06,.36,C,0,.5,-.2,{rx:-.7,center:true,seg:6,...o});box(b,.26,.34,.02,'#f6e6c8',0,.58,.165,{ol:false});sph(head,.05,'#2e2347',0,-.07,.245,{ws:6,hs:5,ol:false});}
  else if(k==='ghost'){for(const [x,z] of[[-.17,.12],[.17,.12],[-.17,-.12],[.17,-.12],[0,.17],[0,-.17]])sph(b,.1,C,x,.34,z,{ws:7,hs:5,ol:false});box(head,.6,.1,.54,C,0,.27,-.08,{ol:false});}
  else if(k==='dino'){for(let i=0;i<3;i++)cone(head,.06,.14,D,0,.31,-.22+i*.12,{seg:4,...o});for(let i=0;i<4;i++)cone(b,.05,.12,D,0,.98-i*.16,-.17,{rx:-.5,seg:4,...o});cone(b,.11,.62,C,0,.4,-.44,{rx:-1.35,center:true,seg:7,...o});for(let i=0;i<3;i++)cone(b,.04,.1,D,0,.5-i*.07,-.36-i*.14,{rx:-.4,seg:4,ol:false});box(b,.3,.4,.02,'#ffe08a',0,.6,.165,{ol:false});}}
const PARTY={on:false,hats:[],own:[],cols:['#ff6b6b','#ffd45c','#7cc8ff','#5fd4b0','#b79cff','#ff9ec4']};
function makePerson(L){
  const root=new THREE.Group(),b=new THREE.Group();root.add(b);b.scale.setScalar(L.scale||1);
  const legs=[],arms=[];
  for(const sx of[-.105,.105]){const hip=new THREE.Group();hip.position.set(sx,.62,0);b.add(hip);box(hip,L.round?.19:.17,.5,L.round?.2:.19,L.bottom,0,-.5,0);
    if(L.round)sph(hip,.14,L.shoes,0,-.56,.06,{s:[1.05,.6,1.4],ws:12,hs:8});else box(hip,.19,.12,.27,L.shoes,0,-.62,.03);legs.push(hip);}
  box(b,.44,.5,.26,L.top,0,.6,0);
  if(L.dress)cyl(b,.24,.36,.42,L.top,0,.38,0,{seg:12});
  if(L.apron)box(b,.36,.6,.03,L.apron,0,.44,.145,{ol:.015});
  for(const sx of[-.29,.29]){const sh=new THREE.Group();sh.position.set(sx,1.05,0);b.add(sh);box(sh,.13,.4,.15,L.sleeve||L.top,0,-.4,0);box(sh,.12,.11,.13,L.skin,0,-.51,0);arms.push(sh);}
  const head=new THREE.Group();head.position.set(0,1.1,0);b.add(head);
  box(head,.5,.46,.44,L.skin);
  const fz=.222;
  if(L.eyes)faceFor(head,L);
  else{for(const sx of[-1,1]){box(head,.075,.11,.02,INK,sx*.11,.17,fz,{ol:false});box(head,.03,.035,.01,'#ffffff',sx*.11+.015,.24,fz+.012,{ol:false});box(head,.09,.045,.01,'#ff9ab8',sx*.18,.1,fz,{ol:false});}
  box(head,.1,.028,.01,INK,0,.085,fz,{ol:false});}
  hairFor(head,L);
  if(L.hat&&L.hat!=='none'){const hg=new THREE.Group();hg.userData.keep=1;head.add(hg);hatFor(hg,L.hat,L.hatc);bake(hg,false);if(!L.nohat){hg.visible=!PARTY.on;PARTY.own.push(hg);}}
  if(!L.nohat){const ph=new THREE.Group();ph.userData.keep=1;ph.visible=PARTY.on;head.add(ph);hatFor(ph,'party',PARTY.cols[PARTY.hats.length%PARTY.cols.length]);bake(ph,false);PARTY.hats.push(ph);}   /* 🥳 the New Year party hat (run 4, job 11) */
  if(L.glasses&&L.glasses!=='none')glassesFor(head,L.glasses,L.glc);
  if(L.co&&COSTUMES[L.co])costumeFor(b,head,legs,arms,L.co);   /* 🎃 a costume over the clothes (run 4, job 3) */
  root.traverse(o=>{if(o.isMesh&&o.material===OL)o.material=OLP;});
  return {root,b,legs,arms,head,phase:Math.random()*6,wave:0};
}
const HAT_DEF={party:'#ff6b6b',cap:'#ff6b6b',beanie:'#7cc8ff',bow:'#ff4d8d',flowers:'#ff7aa8',crown:'#ffd45c',headphones:'#ff7aa8',bunny:'#ffffff',cat:'#2e2347',cowboy:'#9a6a43',witch:'#2e2347',tiara:'#ff7aa8',glasses:'#3d2c5e',sunglasses:'#2e2347',hearts:'#ff4d8d',tophat:'#2e2347',flower:'#ff7aa8',halo:'#ffd45c',unicorn:'#ffffff',beret:'#ff6b6b'};
function bowShape(g,s,c,o){o=o||{};const ol=o.ol===undefined?.01:o.ol,d=shade(c,-.18),lt=shade(c,.1);
  for(const sd of[-1,1]){const L=new THREE.Group();L.rotation.z=sd*.22;g.add(L);
    cone(L,.068*s,.12*s,c,sd*.062*s,0,0,{rz:sd*Math.PI/2,center:true,seg:10,s:[1,1,.55],ol});
    sph(L,.07*s,c,sd*.125*s,0,0,{s:[.72,1,.55],ws:12,hs:8,ol});
    sph(L,.034*s,d,sd*.112*s,0,.03*s,{s:[1.25,.85,.35],ws:8,hs:6,ol:false});
    box(g,.046*s,.13*s,.016*s,lt,sd*.035*s,-.15*s,-.005*s,{rz:sd*.32,ol});}
  sph(g,.04*s,d,0,0,.012*s,{s:[1,1.2,.8],ws:10,hs:8,ol});return g;}
function flowerShape(g,r,c,x,y,z,o){o=o||{};const ol=o.ol===undefined?.008:o.ol,f=new THREE.Group();f.position.set(x,y,z);g.add(f);
  if(o.nrm){const n=new THREE.Vector3(o.nrm[0],o.nrm[1],o.nrm[2]).normalize();f.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n);}
  const n=o.n||5,c2=shade(c,.16),sp=o.spin||0;
  for(let i=0;i<n;i++){const a=i/n*TAU+sp;sph(f,r*.5,i%2?c:c2,Math.cos(a)*r*.58,0,Math.sin(a)*r*.58,{s:[1.2,.42,.9],ry:-a,ws:10,hs:6,ol});}
  sph(f,r*.3,o.mid||'#ffd45c',0,r*.12,0,{s:[1,.65,1],ws:10,hs:6,ol});
  if(o.leaves)for(const s of[-1,1]){const a=sp+Math.PI*.5+s*.55;sph(f,r*.42,'#5fbf74',Math.cos(a)*r*1.02,-r*.1,Math.sin(a)*r*1.02,{s:[1.45,.22,.6],ry:-a,ws:8,hs:5,ol:false});}
  return f;}
function flowerRing(g,c,rx,rz,y,n,fr,o){o=o||{};const v=new THREE.Mesh(new THREE.TorusGeometry(1,.085,6,28),mat('#5fbf74'));v.rotation.x=Math.PI/2;v.scale.set(rx,rz,rx);v.position.y=y;g.add(v);
  const cols=o.cols||[c,'#ffffff',c,shade(c,.3)];
  for(let i=0;i<n;i++){const a=i/n*TAU+Math.PI/2-.4,x=Math.cos(a)*rx,z=Math.sin(a)*rz;
    flowerShape(g,fr*(i?1:1.3),cols[i%cols.length],x,y+fr*.12,z,{nrm:[Math.cos(a)*.75,.9,Math.sin(a)*.75],spin:i*.7,mid:i%2?'#ffd45c':'#ffb84d',ol:o.ol});
    const b=a+Math.PI/n;sph(g,fr*.45,'#5fbf74',Math.cos(b)*rx*1.04,y,Math.sin(b)*rz*1.04,{s:[1.5,.3,.7],ry:-b-Math.PI/2,ws:8,hs:5,ol:false});}
  return g;}
function hatFor(h,k,c){const o={ol:.015};c=c||HAT_DEF[k]||'#ff7aa8';const d=shade(c,-.12);
  if(k==='cap'){sph(h,.29,c,0,.45,0,{s:[1,.55,1],ws:14,hs:8,...o});box(h,.36,.04,.26,c,0,.45,.31,o);sph(h,.03,'#ffffff',0,.61,0,{ws:6,hs:5,ol:false});}
  else if(k==='party'){cone(h,.19,.46,c,0,.4,0,{seg:14,...o});cone(h,.19*.67+.004,.46*.67,'#ffffff',0,.4+.46*.33-.002,0,{seg:14,ol:false});cone(h,.19*.34+.004,.46*.34,c,0,.4+.46*.66-.002,0,{seg:14,ol:false});sph(h,.06,'#ffd45c',0,.9,0,{ws:8,hs:6,ol:false});}   /* 🥳 three stripes: the colour, white, the colour (run 4, stage 3) */   /* 🥳 the New Year party hat (run 4, job 11) */
  else if(k==='beanie'){sph(h,.3,c,0,.45,0,{s:[1,.75,1],ws:14,hs:8,...o});box(h,.6,.09,.52,d,0,.4,0,o);sph(h,.08,'#ffffff',0,.7,0,{ws:8,hs:6,...o});}
  else if(k==='bow'){const g=new THREE.Group();g.position.set(.19,.54,.03);g.rotation.set(0,.3,-.38);h.add(g);bowShape(g,1.3,c,{ol:.012});}
  else if(k==='flowers')flowerRing(h,c,.275,.255,.5,7,.07,{ol:.008});
  else if(k==='flower'){const g=new THREE.Group();g.position.set(.2,.44,.13);h.add(g);flowerShape(g,.13,c,0,0,0,{nrm:[.55,.3,.78],leaves:1,ol:.01});flowerShape(g,.065,shade(c,.3),.05,-.12,.03,{nrm:[.6,.1,.8],spin:.6,ol:.008});}
  else if(k==='halo'){const a=new THREE.Mesh(new THREE.TorusGeometry(.2,.035,8,26),mat(c));a.rotation.x=Math.PI/2-.12;a.position.set(0,.78,-.02);h.add(a);for(let i=0;i<4;i++){const b=i/4*TAU+.4;sph(h,.025,'#ffffff',Math.cos(b)*.2,.8+Math.sin(b)*.024,Math.sin(b)*.2-.02,{ws:6,hs:5,ol:false});}}
  else if(k==='unicorn'){const a=new THREE.Mesh(new THREE.TorusGeometry(.27,.025,6,20,Math.PI),mat('#ff9ec4'));a.position.set(0,.26,0);h.add(a);cone(h,.06,.3,c==='#ffffff'?'#ffd45c':c,0,.5,.14,{rx:.35,seg:10,ol:.012});
    for(let i=0;i<3;i++)cyl(h,.062-i*.016,.062-i*.016,.016,'#ff9ec4',0,.54+i*.075,.155+i*.026,{rx:.35,seg:10,ol:false});for(const s of[-1,1]){cone(h,.06,.12,'#ffffff',s*.17,.48,0,{seg:4,ol:.01});cone(h,.03,.07,'#ff9ec4',s*.17,.49,.03,{seg:4,ol:false});}
    for(const [x,cc] of [[-.09,'#b79cff'],[.09,'#7cc8ff']])flowerShape(h,.06,cc,x,.48,.16,{nrm:[x*2,.6,1],ol:.006});}
  else if(k==='beret'){sph(h,.3,c,-.04,.5,0,{s:[1,.32,1],rz:.12,ws:16,hs:8,...o});cyl(h,.018,.022,.07,shade(c,-.15),-.06,.6,0,{seg:6,ol:.008});}
  else if(k==='crown'){cyl(h,.2,.21,.12,c,0,.48,0,{seg:14,...o});for(let i=0;i<6;i++){const a=i/6*TAU;cone(h,.045,.12,c,Math.cos(a)*.18,.6,Math.sin(a)*.18,{seg:5,ol:.01});sph(h,.022,'#ffffff',Math.cos(a)*.18,.735,Math.sin(a)*.18,{ws:6,hs:5,ol:false});sph(h,.03,['#ff4d6d','#5fa8ff','#5fd4b0'][i%3],Math.cos(a+.52)*.207,.54,Math.sin(a+.52)*.207,{s:[1,1,.55],ws:8,hs:6,ol:false});}}
  else if(k==='headphones'){const a=new THREE.Mesh(new THREE.TorusGeometry(.31,.03,6,18,Math.PI),mat('#3d2c5e'));a.position.set(0,.24,0);h.add(a);for(const s of[-1,1])cyl(h,.1,.1,.08,c,s*.3,.2,0,{rz:Math.PI/2,center:true,seg:12,...o});}
  else if(k==='bunny'){for(const s of[-1,1]){sph(h,.07,c,s*.11,.68,0,{s:[1,3,.6],ws:10,hs:8,...o});sph(h,.035,'#ff9ec4',s*.11,.68,.035,{s:[1,3.2,.4],ws:8,hs:6,ol:false});}}
  else if(k==='cat'){for(const s of[-1,1]){cone(h,.1,.18,c,s*.17,.5,0,{seg:4,...o});cone(h,.05,.1,'#ff9ec4',s*.17,.52,.04,{seg:4,ol:false});}}
  else if(k==='cowboy'){cyl(h,.44,.44,.04,c,0,.45,0,{seg:20,...o});cyl(h,.22,.25,.22,c,0,.48,0,{seg:14,...o});cyl(h,.255,.255,.05,d,0,.5,0,{seg:14,ol:false});}
  else if(k==='witch'){cyl(h,.42,.42,.03,c,0,.46,0,{seg:20,...o});cone(h,.24,.55,c,0,.48,0,{seg:12,...o});cyl(h,.245,.245,.06,'#b79cff',0,.5,0,{seg:12,ol:false});sph(h,.035,'#ffd45c',.18,.53,.15,{ws:6,hs:5,ol:false});}
  else if(k==='chef'){cyl(h,.25,.24,.3,'#ffffff',0,.44,0,{seg:14,...o});sph(h,.3,'#ffffff',0,.8,0,{s:[1,.6,1],ws:14,hs:8,...o});}
  else if(k==='helmet'){sph(h,.3,'#ff4d4d',0,.42,0,{s:[1.05,.75,1.1],ws:14,hs:8,...o});box(h,.5,.05,.3,'#ff4d4d',0,.42,-.25,o);box(h,.14,.16,.03,'#ffd45c',0,.55,.3,{ol:.01});}
  else if(k==='tophat'){cyl(h,.38,.38,.035,c,0,.45,0,{seg:20,...o});cyl(h,.21,.23,.44,c,0,.47,0,{seg:16,...o});cyl(h,.235,.235,.08,'#ff4d6d',0,.5,0,{seg:16,ol:false});}
  else if(k==='tiara'){const a=new THREE.Mesh(new THREE.TorusGeometry(.24,.018,6,18,Math.PI),mat('#ffd45c'));a.rotation.x=-Math.PI/2;a.position.set(0,.5,0);h.add(a);for(const x of[-.12,0,.12])cone(h,.03,x?.08:.13,'#ffd45c',x,.5,.21,{seg:5,ol:.008});sph(h,.04,c,0,.6,.21,{ws:8,hs:6,ol:.008});}}
function glassesFor(h,k,c){const fz=.245;c=c||HAT_DEF[k]||'#3d2c5e';
  if(k==='sunglasses'){for(const s of[-1,1])box(h,.15,.1,.02,c,s*.11,.18,fz,{ol:false});box(h,.08,.02,.02,'#2e2347',0,.25,fz,{ol:false});}
  else if(k==='hearts'){for(const s of[-1,1]){sph(h,.04,c,s*.11-.025,.24,fz,{s:[1,1,.3],ws:8,hs:6,ol:false});sph(h,.04,c,s*.11+.025,.24,fz,{s:[1,1,.3],ws:8,hs:6,ol:false});cone(h,.06,.07,c,s*.11,.2,fz,{rx:Math.PI,center:true,seg:4,ol:false});}box(h,.06,.015,.015,c,0,.24,fz,{ol:false});}
  else{for(const s of[-1,1]){const r=new THREE.Mesh(new THREE.TorusGeometry(.065,.012,6,16),mat(c));r.position.set(s*.11,.23,fz);h.add(r);}box(h,.07,.015,.015,c,0,.24,fz,{ol:false});}}
function faceFor(h,L){const fz=.224,K='#1d1622',add=(m,x,y,z)=>{m.position.set(x,y,z);h.add(m);return m;};
  const oval=x=>{const e=add(new THREE.Mesh(new THREE.CylinderGeometry(.042,.042,.02,16),mat(K)),x,.23,fz);e.rotation.x=Math.PI/2;e.scale.set(1,1,1.45);};
  const arc=(x,y,r,t,up)=>{const a=add(new THREE.Mesh(new THREE.TorusGeometry(r,t,6,14,Math.PI),mat(K)),x,y,fz);if(up)a.rotation.z=Math.PI;};
  for(const s of[-1,1]){const x=s*.11;
    if(L.eyes==='happy')arc(x,.2,.045,.013,false);
    else if(L.eyes==='sleepy')arc(x,.25,.042,.012,true);
    else{oval(x);if(L.eyes==='sparkle'){add(new THREE.Mesh(new THREE.CircleGeometry(.017,10),mat('#ffffff')),x+.013,.252,fz+.012);add(new THREE.Mesh(new THREE.CircleGeometry(.008,8),mat('#ffffff')),x-.012,.208,fz+.012);}}}
  if(L.mouth==='grin'){add(new THREE.Mesh(new THREE.CircleGeometry(.068,18,Math.PI,Math.PI),mat(K)),0,.135,fz);add(new THREE.Mesh(new THREE.CircleGeometry(.032,12,Math.PI,Math.PI),mat('#ff7a9a')),0,.088,fz+.004);}
  else if(L.mouth==='small')add(new THREE.Mesh(new THREE.TorusGeometry(.024,.011,6,14),mat(K)),0,.105,fz);
  else if(L.mouth==='cat'){arc(-.026,.115,.026,.01,true);arc(.026,.115,.026,.01,true);}
  else arc(0,.125,.062,.013,true);
}
const PET_TYPES={
  dog:{name:'puppy',many:'Puppies',icon:'🐶',cols:['#e8b765','#9a6a43','#f5efe6','#4a4058'],snd:'woof',names:['Biscuit','Waffles','Peanut','Coco','Buddy','Muffin']},
  cat:{name:'kitten',many:'Kittens',icon:'🐱',cols:['#f3a25b','#a7a3b5','#3f3a4f','#f7f2ec'],snd:'meow',names:['Mochi','Whiskers','Tiger','Snowy','Pumpkin','Pepper']},
  bunny:{name:'bunny',many:'Bunnies',icon:'🐰',cols:['#f8f5f0','#c49a74','#b9b4c8','#ffc9dc'],snd:'squeak',names:['Clover','Cotton','Daisy','Hopper','Bun-bun','Marshmallow']},
  hamster:{name:'hamster',many:'Hamsters',icon:'🐹',cols:['#f2c38b','#ffffff','#c49a74','#9a8f86'],snd:'squeak',names:['Nibbles','Gizmo','Honey','Pip','Toffee','Biscuit']},
  /* 🐾 night 3, job 14: breeds of the puppy (saved as type 'dog' + kind) and three new animals (saved as the old kind they are closest to + kind), so an old
     version shows the plain animal and never crashes. tagY: the name tag's height */
  pomchi:{name:'pomchi',many:'Pomchis',icon:'🦊',cols:['#f2c38b','#e8b765','#f8f5f0','#9a6a43'],snd:'yip',names:['Fluffy','Pom','Teddy','Sunny','Peaches','Foxy'],base:'dog',tagY:.8},
  pug:{name:'pug',many:'Pugs',icon:'🐶',cols:['#e8c9a0','#4a4058','#c49a74','#f8f5f0'],snd:'woof',names:['Pugsy','Doug','Bean','Olive','Momo','Wrinkles'],base:'dog',tagY:.78},
  sausage:{name:'sausage dog',many:'Sausage dogs',icon:'🐕',cols:['#9a6a43','#4a4058','#e8b765','#c47a4a'],snd:'woof',names:['Frankie','Noodle','Slinky','Cocoa','Pretzel','Dash'],base:'dog',tagY:.72},
  capybara:{name:'capybara',many:'Capybaras',icon:'🦫',cols:['#c49a74','#a8714a','#8a5a36','#d9b28c'],snd:'squeak',names:['Capy','Pebble','Mango','Splash','Barry','Bubbles'],base:'hamster',tagY:1.0},
  duck:{name:'duck',many:'Ducks',icon:'🦆',cols:['#f8f5f0','#ffe08a','#c49a74','#8fd3ff'],snd:'quack',names:['Puddles','Quackers','Daisy','Waddles','Sunny','Dot'],base:'bunny',tagY:.9},
  owl:{name:'owl',many:'Owls',icon:'🦉',cols:['#8a5a36','#c49a74','#a7a3b5','#f8f5f0'],snd:'hoot',names:['Hooty','Luna','Olive','Pip','Sage','Twig'],base:'cat',tagY:.92},
};
const PET_FIT={pug:'dog',sausage:'dog',capybara:'dog',pomchi:'cat',owl:'cat',duck:'bunny'};
const ACCS={bow:{n:'Pink bow',i:'🎀',s:'head'},hat:{n:'Party hat',i:'🥳',s:'head'},pcrown:{n:'Pet crown',i:'👑',s:'head'},tophat:{n:'Tiny top hat',i:'🎩',s:'head'},flowerc:{n:'Flower crown',i:'🌸',s:'head'},pflower:{n:'Big flower',i:'🌺',s:'head'},
  collar:{n:'Bell collar',i:'🔔',s:'neck'},scarf:{n:'Cozy scarf',i:'🧣',s:'neck'},bowtie:{n:'Fancy bow tie',i:'🤵',s:'neck'},
  shades:{n:'Pet sunglasses',i:'🕶️',s:'face'},hglasses:{n:'Heart glasses',i:'💖',s:'face'},monocle:{n:'Fancy monocle',i:'🧐',s:'face'},
  cape:{n:'Super cape',i:'🦸',s:'back'},wings:{n:'Fairy wings',i:'🧚',s:'back'},bpack:{n:'Tiny backpack',i:'🎒',s:'back'}};
function addAcc(p,acc){if(!acc||!p.head)return;const h=p.head,t=PET_FIT[p.type]||p.type,top={dog:.25,cat:.22,bunny:.15,hamster:.1}[t]||.2;
  if(acc==='bow'){const g=new THREE.Group();g.position.set(.075,top+.02,.02);g.rotation.set(0,.25,-.3);h.add(g);bowShape(g,.6,'#ff7aa8',{ol:.008});bake(g,false);}
  else if(acc==='hat'){const g=new THREE.Group();g.position.set(0,top,0);g.rotation.z=.15;h.add(g);cone(g,.09,.22,'#b79cff',0,0,0,{seg:14,ol:.012});
    for(const [y,rr,c] of [[.05,.071,'#ffd45c'],[.12,.043,'#ff7aa8']]){const t2=new THREE.Mesh(new THREE.TorusGeometry(rr,.012,5,16),mat(c));t2.rotation.x=Math.PI/2;t2.position.y=y;g.add(t2);}
    for(let i=0;i<5;i++){const a=i/5*TAU;sph(g,.013,'#ffffff',Math.cos(a)*.057,.085,Math.sin(a)*.057,{ws:5,hs:4,ol:false});}sph(g,.042,'#ff7aa8',0,.235,0,{ws:10,hs:8,ol:.01});bake(g,false);}
  else if(acc==='pcrown'){const g=new THREE.Group();g.position.set(0,top,0);h.add(g);cyl(g,.09,.1,.07,'#ffd45c',0,0,0,{seg:14,ol:.01});
    for(let i=0;i<5;i++){const a=i/5*TAU+Math.PI/2;cone(g,.026,.08,'#ffd45c',Math.cos(a)*.08,.07,Math.sin(a)*.08,{seg:5,ol:.008});sph(g,.014,'#ffffff',Math.cos(a)*.08,.155,Math.sin(a)*.08,{ws:6,hs:5,ol:false});
      sph(g,.017,['#ff4d6d','#5fa8ff','#5fd4b0'][i%3],Math.cos(a+Math.PI/5)*.099,.035,Math.sin(a+Math.PI/5)*.099,{s:[1,1,.6],ws:6,hs:5,ol:false});}bake(g,false);}
  else if(acc==='shades'){const [y,z]={dog:[.1,.19],cat:[.1,.16],bunny:[.03,.14],hamster:[.015,.098]}[t]||[.08,.15];for(const s of[-1,1])box(h,.08,.05,.02,'#2e2347',s*.055,y,z,{ol:false});box(h,.04,.012,.02,'#2e2347',0,y+.015,z,{ol:false});}
  else if(acc==='tophat'){cyl(h,.11,.11,.015,'#2e2347',0,top,0,{seg:14,ol:.01});cyl(h,.062,.068,.15,'#2e2347',0,top+.01,0,{seg:12,ol:.012});cyl(h,.07,.07,.03,'#ff4d6d',0,top+.03,0,{seg:12,ol:false});}
  else if(acc==='flowerc'){const r={dog:.135,cat:.12,bunny:.1,hamster:.075}[t]||.12,g=new THREE.Group();h.add(g);flowerRing(g,'#ff7aa8',r,r*.9,top,5,r*.36,{cols:['#ff7aa8','#ffffff','#b79cff','#ffd45c','#ff9ec4'],ol:.006});bake(g,false);}
  else if(acc==='pflower'){const z={dog:.06,cat:.05,bunny:.04,hamster:.03}[t]||.05,g=new THREE.Group();g.position.set(.09,top-.03,z);h.add(g);flowerShape(g,.075,'#ff6b9d',0,0,0,{nrm:[.6,.55,.6],leaves:1,ol:.007});bake(g,false);}
  else if(acc==='hglasses'||acc==='monocle'){const [y,z]={dog:[.1,.19],cat:[.1,.16],bunny:[.03,.14],hamster:[.015,.098]}[t]||[.08,.15];
    if(acc==='hglasses'){for(const s of[-1,1]){sph(h,.022,'#ff4d8d',s*.055-.014,y+.012,z,{s:[1,1,.5],ws:8,hs:6,ol:false});sph(h,.022,'#ff4d8d',s*.055+.014,y+.012,z,{s:[1,1,.5],ws:8,hs:6,ol:false});cone(h,.034,.04,'#ff4d8d',s*.055,y-.002,z,{rz:Math.PI,center:true,seg:8,s:[1,1,.45],ol:false});}box(h,.03,.01,.01,'#ff4d8d',0,y+.012,z,{ol:false});}
    else{const r=new THREE.Mesh(new THREE.TorusGeometry(.036,.008,6,16),mat('#ffd45c'));r.position.set(.055,y+.01,z+.004);h.add(r);box(h,.006,.09,.006,'#ffd45c',.09,y-.06,z-.01,{rz:.35,ol:false});}}
  else if(acc==='cape'||acc==='wings'||acc==='bpack'){const up=p.type==='owl'&&acc!=='wings',B=up?[.31,-.2,.22,.38]:p.type==='duck'?[.41,-.06,.24,.3]:{dog:[.44,.02,.36,.46],cat:[.39,.02,.3,.4],bunny:[.4,-.02,.3,.32],hamster:[.26,0,.22,.24]}[t]||[.4,0,.3,.4],[y,z,w,l]=B,g=new THREE.Group();g.position.set(0,y,z);if(up)g.rotation.x=-Math.PI/2;p.b.add(g);   /* (run 4 finish: the owl stands upright, so its cape and backpack lie on its back standing up; the duck's are sized to its back) */
    if(acc==='cape'){box(g,w+.06,.025,l,'#ff4d4d',0,0,-.02,{rx:-.1,ol:.012});if(!up)box(g,w+.06,.12,.025,'#ff4d4d',0,-.11,-l/2-.01,{ol:.012});sph(g,.035,'#ffd45c',0,.01,l/2-.02,{ws:8,hs:6,ol:.008});}
    else if(acc==='wings'){for(const s of[-1,1]){sph(g,.15,'#d9f2ff',s*(w/2+.02),.1,0,{s:[.22,1,.62],rz:s*-.75,ws:10,hs:8,ol:.012});sph(g,.09,'#ffd0ec',s*(w/2+.05),.02,-.1,{s:[.22,1,.62],rz:s*-1.1,ws:8,hs:6,ol:.01});}}
    else{box(g,w*.62,.13,l*.42,'#ffb36b',0,-.02,-.02,{ol:.012});box(g,w*.66,.045,l*.3,'#ff8a6b',0,.1,.02,{ol:.01});sph(g,.02,'#ffd45c',0,.07,.02+l*.16,{ws:6,hs:5,ol:false});}}
  else if(acc==='bowtie'){const z={dog:.2,cat:.18,bunny:.12,hamster:.08}[t]||.15,y={dog:.38,cat:.33,bunny:.33,hamster:.17}[t]||.3,g=new THREE.Group();g.position.set(0,y-.03,z+.06);if(p.type==='owl')g.position.set(0,.4,.185);else if(p.type==='duck')g.position.set(0,.375,.2);p.b.add(g);
    for(const sd of[-1,1])cone(g,.046,.085,'#2e2347',sd*.044,0,0,{rz:sd*Math.PI/2,center:true,seg:4,s:[1,1,.55],ol:.008});sph(g,.024,'#ff4d6d',0,0,.008,{ws:8,hs:6,ol:.006});}
  else{const nk=new THREE.Group();const z={dog:.2,cat:.18,bunny:.12,hamster:.08}[t]||.15,y={dog:.38,cat:.33,bunny:.33,hamster:.17}[t]||.3;nk.position.set(0,y,z);{const NB={owl:[.43,.03,1.42],duck:[.405,.14,.83]}[p.type];if(NB){nk.position.set(0,NB[0],NB[1]);nk.scale.set(NB[2],1,NB[2]);}}p.b.add(nk);   /* (run 4 finish: round the owl's and the duck's own necks) */
    const tor=new THREE.Mesh(new THREE.TorusGeometry(t==='hamster'?.09:.12,.025,6,16),mat(acc==='collar'?'#ff4d4d':'#5fa8ff'));tor.rotation.x=Math.PI/2;nk.add(tor);
    if(acc==='collar'){sph(nk,.035,'#ffd45c',0,-.03,.12,{ws:8,hs:6,ol:.01});box(nk,.016,.012,.01,'#3d2c5e',0,-.045,.152,{ol:false});}
    else{for(const [x,rz,l] of [[.045,.15,.15],[.085,.35,.11]]){box(nk,.065,l,.028,'#5fa8ff',x,-.06-l,.105,{rz,ol:.01});box(nk,.067,.022,.03,'#ffffff',x,-.03-l*.55,.105,{rz,ol:false});for(const f of[-.02,0,.02])box(nk,.01,.025,.02,'#ffffff',x+f,-.085-l,.105,{rz,ol:false});}
      for(let i=0;i<8;i++){const a=i/8*TAU;box(nk,.012,.05,.012,'#ffffff',Math.cos(a)*(t==='hamster'?.09:.12),-.025,Math.sin(a)*(t==='hamster'?.09:.12),{ry:-a,ol:false});}}}}
function makePet(type,col){
  const root=new THREE.Group(),b=new THREE.Group();root.add(b);
  const C=col,D=shade(col,-.14),Lt=shade(col,.1),legs=[];let tail,head;
  const eye=(g,x,y,z)=>{box(g,.05,.07,.02,INK,x,y,z,{ol:false});box(g,.018,.022,.01,'#fff',x+.01,y+.04,z+.012,{ol:false});};
  const leg=(x,z,h,w)=>{const p=new THREE.Group();p.position.set(x,h,z);b.add(p);box(p,w,h,w,C,0,-h,0,{ol:.02});legs.push(p);};
  if(type==='dog'){
    box(b,.32,.26,.5,C,0,.18,0);
    leg(-.1,.16,.2,.09);leg(.1,.16,.2,.09);leg(-.1,-.16,.2,.09);leg(.1,-.16,.2,.09);
    head=new THREE.Group();head.position.set(0,.36,.27);b.add(head);
    box(head,.32,.28,.28,C,0,-.04,0);box(head,.17,.12,.13,Lt,0,-.04,.18);
    box(head,.07,.05,.03,INK,0,.05,.255,{ol:false});
    eye(head,-.085,.08,.142);eye(head,.085,.08,.142);
    box(head,.08,.2,.07,D,-.19,-.07,-.02,{rz:.25});box(head,.08,.2,.07,D,.19,-.07,-.02,{rz:-.25});
    tail=new THREE.Group();tail.position.set(0,.4,-.25);b.add(tail);box(tail,.06,.2,.06,C,0,0,0,{rx:-.6,ol:.02});
  }else if(type==='cat'){
    box(b,.26,.22,.44,C,0,.17,0);
    leg(-.08,.14,.18,.08);leg(.08,.14,.18,.08);leg(-.08,-.14,.18,.08);leg(.08,-.14,.18,.08);
    head=new THREE.Group();head.position.set(0,.34,.24);b.add(head);
    box(head,.28,.24,.24,C,0,-.03,0);
    box(head,.05,.035,.02,'#ff8fb1',0,.03,.125,{ol:false});
    eye(head,-.07,.06,.122);eye(head,.07,.06,.122);
    cone(head,.065,.12,D,-.09,.2,-.01,{seg:4,ol:.02});cone(head,.065,.12,D,.09,.2,-.01,{seg:4,ol:.02});
    tail=new THREE.Group();tail.position.set(0,.34,-.22);b.add(tail);box(tail,.05,.34,.05,C,0,0,0,{rx:-.35,ol:.02});
  }else if(type==='hamster'){
    sph(b,.15,C,0,.15,0,{s:[1,.85,1.2]});sph(b,.1,Lt,0,.1,.08,{s:[1,.7,1],ol:false});
    leg(-.07,.08,.06,.05);leg(.07,.08,.06,.05);leg(-.07,-.08,.06,.05);leg(.07,-.08,.06,.05);
    head=new THREE.Group();head.position.set(0,.2,.12);b.add(head);
    sph(head,.1,C,0,0,0);sph(head,.045,Lt,-.06,-.03,.06,{ol:false});sph(head,.045,Lt,.06,-.03,.06,{ol:false});
    box(head,.03,.02,.02,'#ff8fb1',0,-.005,.098,{ol:false});eye(head,-.04,.01,.085);eye(head,.04,.01,.085);
    sph(head,.035,D,-.065,.08,-.01,{ol:.012});sph(head,.035,D,.065,.08,-.01,{ol:.012});
  }else if(type==='pug'){   /* 🐶 a round face, a dark flat muzzle, folded ears, a curly tail */
    box(b,.3,.24,.42,C,0,.16,0);
    leg(-.1,.13,.17,.08);leg(.1,.13,.17,.08);leg(-.1,-.13,.17,.08);leg(.1,-.13,.17,.08);
    head=new THREE.Group();head.position.set(0,.34,.22);b.add(head);
    sph(head,.17,C,0,0,0,{s:[1,.92,.95]});box(head,.17,.11,.07,D,0,-.04,.14,{ol:.012});box(head,.06,.04,.03,INK,0,-.005,.175,{ol:false});
    eye(head,-.075,.04,.135);eye(head,.075,.04,.135);
    box(head,.07,.09,.05,D,-.14,.09,-.02,{rz:.5,ol:.015});box(head,.07,.09,.05,D,.14,.09,-.02,{rz:-.5,ol:.015});
    tail=new THREE.Group();tail.position.set(0,.3,-.2);b.add(tail);sph(tail,.05,C,0,.02,0,{ol:.015});sph(tail,.04,C,.04,.06,-.02,{ol:.012});
  }else if(type==='pomchi'){   /* 🦊 fluffy and foxy: a round head, pointy ears, a big fluffy tail */
    sph(b,.16,C,0,.2,0,{s:[1,.9,1.3]});
    leg(-.07,.1,.13,.06);leg(.07,.1,.13,.06);leg(-.07,-.1,.13,.06);leg(.07,-.1,.13,.06);
    head=new THREE.Group();head.position.set(0,.4,.17);b.add(head);
    sph(head,.16,C,0,0,0);sph(head,.06,Lt,0,-.04,.14,{ol:false});box(head,.04,.03,.02,INK,0,-.02,.195,{ol:false});
    eye(head,-.06,.03,.14);eye(head,.06,.03,.14);
    cone(head,.05,.12,D,-.09,.15,-.01,{seg:4,ol:.015});cone(head,.05,.12,D,.09,.15,-.01,{seg:4,ol:.015});
    tail=new THREE.Group();tail.position.set(0,.36,-.2);b.add(tail);sph(tail,.09,Lt,0,.06,-.02,{s:[.8,1,1.2],ol:.015});
  }else if(type==='sausage'){   /* 🐕 a long body on short legs, long droopy ears */
    box(b,.26,.22,.7,C,0,.13,0);
    leg(-.09,.24,.11,.07);leg(.09,.24,.11,.07);leg(-.09,-.24,.11,.07);leg(.09,-.24,.11,.07);
    head=new THREE.Group();head.position.set(0,.3,.38);b.add(head);
    box(head,.26,.24,.28,C,0,-.03,0);box(head,.15,.12,.18,Lt,0,-.07,.2);box(head,.06,.045,.03,INK,0,-.03,.29,{ol:false});
    eye(head,-.075,.06,.142);eye(head,.075,.06,.142);
    box(head,.08,.26,.06,D,-.16,-.1,-.03,{rz:.12,ol:.015});box(head,.08,.26,.06,D,.16,-.1,-.03,{rz:-.12,ol:.015});
    tail=new THREE.Group();tail.position.set(0,.26,-.36);b.add(tail);box(tail,.05,.22,.05,C,0,0,0,{rx:-.9,ol:.015});
  }else if(type==='capybara'){   /* 🦫 big and calm: a long round body, a blunt head, little round ears, no tail */
    sph(b,.24,C,0,.38,0,{s:[1,.8,1.45]});
    leg(-.12,.2,.22,.1);leg(.12,.2,.22,.1);leg(-.12,-.2,.22,.1);leg(.12,-.2,.22,.1);
    head=new THREE.Group();head.position.set(0,.5,.4);b.add(head);
    box(head,.3,.28,.32,C,0,-.02,0);box(head,.24,.17,.14,Lt,0,-.07,.2);box(head,.1,.05,.03,D,0,0,.275,{ol:false});
    eye(head,-.1,.07,.165);eye(head,.1,.07,.165);
    sph(head,.05,D,-.12,.14,-.08,{ol:.012});sph(head,.05,D,.12,.14,-.08,{ol:.012});
  }else if(type==='duck'){   /* 🦆 a round body, little wings, an orange bill and orange feet */
    sph(b,.17,C,0,.28,0,{s:[1,.9,1.4]});
    for(const s of[-1,1])box(b,.06,.12,.26,D,s*.16,.24,-.02,{rz:s*-.2,ol:.015});
    {const lg=x=>{const p=new THREE.Group();p.position.set(x,.14,0);b.add(p);box(p,.04,.14,.04,'#ffb347',0,-.14,0,{ol:.012});box(p,.1,.02,.14,'#ffb347',0,-.15,.04,{ol:.01});legs.push(p);};lg(-.06);lg(.06);}
    head=new THREE.Group();head.position.set(0,.53,.14);b.add(head);
    sph(head,.12,C,0,0,0);box(head,.17,.05,.14,'#ffb347',0,-.035,.15,{ol:.012});
    eye(head,-.065,.03,.095);eye(head,.065,.03,.095);
    tail=new THREE.Group();tail.position.set(0,.34,-.24);b.add(tail);box(tail,.1,.05,.12,C,0,0,0,{rx:.6,ol:.015});
  }else if(type==='owl'){   /* 🦉 round, with big eyes, ear tufts and little wings */
    sph(b,.2,C,0,.26,0,{s:[1,1.2,1]});sph(b,.13,Lt,0,.2,.11,{s:[1,1.1,.6],ol:false});
    for(const s of[-1,1])box(b,.06,.28,.18,D,s*.19,.14,-.01,{rz:s*-.12,ol:.015});
    {const lg=x=>{const p=new THREE.Group();p.position.set(x,.08,.03);b.add(p);box(p,.05,.08,.05,'#ffb347',0,-.08,0,{ol:.012});legs.push(p);};lg(-.07);lg(.07);}
    head=new THREE.Group();head.position.set(0,.5,.03);b.add(head);
    sph(head,.17,C,0,0,0);cone(head,.05,.12,D,-.1,.15,0,{seg:4,ol:.015});cone(head,.05,.12,D,.1,.15,0,{seg:4,ol:.015});
    for(const s of[-1,1]){sph(head,.062,'#fff6d6',s*.07,.03,.13,{ws:10,hs:8,ol:.01});sph(head,.03,INK,s*.07,.03,.185,{ws:8,hs:6,ol:false});}
    cone(head,.03,.07,'#ffb347',0,-.04,.17,{rx:Math.PI/2,center:true,seg:4,ol:false});
  }else{
    sph(b,.2,C,0,.24,0,{s:[1,.9,1.25]});
    leg(-.09,.13,.1,.08);leg(.09,.13,.1,.08);leg(-.1,-.12,.12,.1);leg(.1,-.12,.12,.1);
    head=new THREE.Group();head.position.set(0,.42,.2);b.add(head);
    sph(head,.15,C,0,0,0);
    box(head,.04,.03,.02,'#ff8fb1',0,-.01,.147,{ol:false});
    eye(head,-.06,.02,.133);eye(head,.06,.02,.133);
    box(head,.065,.3,.035,C,-.06,.1,-.02,{rz:.12,ol:.02});box(head,.065,.3,.035,C,.06,.1,-.02,{rz:-.12,ol:.02});
    tail=new THREE.Group();tail.position.set(0,.27,-.25);b.add(tail);sph(tail,.07,'#ffffff',0,0,0,{ol:.02});
  }
  return {root,b,legs,tail,head,type,phase:Math.random()*6};
}
const WOOD='#c98f5e',WOOD2='#a8714a',WHITE='#fbf7ff';
const SOFT=['#ff9ec4','#7fdcb5','#8fb7ff','#ffd45c','#b79cff','#ff8a6b'];
const FURN={
  bed:{n:'Bed',i:'🛏️',p:200,w:1.4,d:2.1,cols:['#ff9ec4','#8fd3ff','#b79cff','#7fdcb5','#ffd45c'],use:'sleep',b(g,c){
    box(g,1.4,.32,2.1,WOOD,0,0,0);box(g,1.3,.2,1.95,WHITE,0,.32,.04);box(g,1.34,.14,1.25,c,0,.46,.42);
    box(g,.85,.14,.42,'#ffffff',0,.52,-.66);box(g,1.44,.95,.14,c,0,0,-1.0);box(g,1.44,.5,.12,c,0,0,1.0);}},
  sofa:{n:'Sofa',i:'🛋️',p:250,w:2,d:.9,cols:SOFT,use:'sit',b(g,c){const L=shade(c,.08);
    box(g,2,.4,.9,c,0,.06,0);box(g,.9,.14,.6,L,-.46,.46,.1);box(g,.9,.14,.6,L,.46,.46,.1);
    box(g,2,.55,.24,c,0,.46,-.33);box(g,.22,.34,.9,c,-.89,.46,0);box(g,.22,.34,.9,c,.89,.46,0);
    for(const x of[-.85,.85])for(const z of[-.35,.35])box(g,.08,.06,.08,WOOD2,x,0,z,{ol:false});}},
  armchair:{n:'Armchair',i:'💺',p:150,w:1,d:.9,cols:SOFT,use:'sit',b(g,c){const L=shade(c,.08);
    box(g,1,.4,.9,c,0,.06,0);box(g,.62,.14,.6,L,0,.46,.1);box(g,1,.55,.24,c,0,.46,-.33);box(g,.2,.34,.9,c,-.4,.46,0);box(g,.2,.34,.9,c,.4,.46,0);}},
  chair:{n:'Chair',i:'🪑',p:60,w:.6,d:.6,cols:[WOOD,'#ffffff','#ff9ec4','#7fdcb5'],use:'sit',b(g,c){
    box(g,.52,.07,.52,c,0,.42,0);for(const x of[-.21,.21])for(const z of[-.21,.21])box(g,.06,.42,.06,c,x,0,z,{ol:.02});box(g,.52,.5,.07,c,0,.49,-.225);}},
  table:{n:'Table',i:'🍽️',p:120,w:1.2,d:1.2,cols:[WOOD,'#ffffff','#ff9ec4','#8fd3ff'],b(g,c){
    cyl(g,.6,.6,.07,c,0,.7,0,{seg:22});cyl(g,.07,.09,.7,shade(c,-.1),0,0,0,{seg:10});cyl(g,.32,.36,.05,shade(c,-.1),0,0,0,{seg:16});}},
  desk:{n:'Desk',i:'✏️',p:150,w:1.4,d:.7,cols:[WOOD,'#ffffff','#b79cff'],b(g,c){
    box(g,1.4,.07,.7,c,0,.72,0);box(g,.07,.72,.66,c,-.66,0,0);box(g,.45,.6,.66,c,.45,.12,0);
    box(g,.35,.05,.02,INK,.45,.5,.335,{ol:false});box(g,.35,.05,.02,INK,.45,.3,.335,{ol:false});
    box(g,.32,.03,.24,'#ffffff',-.3,.79,.05,{ol:.015});cyl(g,.045,.045,.16,'#ff7aa8',-.05,.79,-.16,{seg:8,ol:.015});}},
  shelf:{n:'Bookshelf',i:'📚',p:150,w:1.2,d:.45,cols:[WOOD,'#ffffff','#8fd3ff'],b(g,c){
    box(g,1.2,1.8,.08,c,0,0,-.185);box(g,.08,1.8,.45,c,-.56,0,0);box(g,.08,1.8,.45,c,.56,0,0);
    for(const y of[0,.6,1.2,1.74])box(g,1.2,.06,.45,c,0,y,0);
    const BK=['#ff7aa8','#5fd4b0','#ffd45c','#7cc8ff','#b79cff','#ff8a6b'],r=seeded(7);
    for(const y of[.06,.66,1.26]){let x=-.48;while(x<.4){const w=.07+r()*.06,h=.3+r()*.18;box(g,w,h,.3,BK[(r()*6)|0],x+w/2,y,0,{ol:.012});x+=w+.015;}}}},
  wardrobe:{n:'Wardrobe',i:'👗',p:200,w:1.2,d:.6,cols:['#ffffff',WOOD,'#ffc9dc','#bfe6ff'],use:'dress',b(g,c){
    box(g,1.2,2,.6,c,0,0,0);box(g,.025,1.8,.02,INK,0,.1,.305,{ol:false});
    sph(g,.035,'#ffd45c',-.08,1.05,.31,{ol:.012});sph(g,.035,'#ffd45c',.08,1.05,.31,{ol:.012});box(g,1.26,.08,.66,shade(c,-.08),0,2,0);}},
  tv:{n:'TV',i:'📺',p:350,w:1.4,d:.5,use:'tv',b(g){
    box(g,1.4,.5,.5,WOOD,0,0,0);box(g,1.2,.72,.08,'#3d2c5e',0,.55,-.05);
    const cnv=document.createElement('canvas');cnv.width=432;cnv.height=240;const ctx=cnv.getContext('2d');const tex=new THREE.CanvasTexture(cnv);tex.minFilter=THREE.LinearFilter;tex.generateMipmaps=false;
    const scr=box(g,1.08,.6,.02,null,0,.61,0,{mat:new THREE.MeshBasicMaterial({map:tex,color:'#ffffff'}),ol:false});scr.userData.screen=1;scr.userData.cnv=cnv;scr.userData.ctx=ctx;scr.userData.tex=tex;drawCatTV(ctx,0,false);tex.needsUpdate=true;}},
  lamp:{n:'Lamp',i:'💡',p:70,w:.5,d:.5,cols:['#ffd45c','#ff9ec4','#7fdcb5','#8fd3ff'],use:'lamp',b(g,c){
    cyl(g,.2,.22,.05,'#3d2c5e',0,0,0);cyl(g,.025,.025,1.35,'#3d2c5e',0,.05,0,{seg:6,ol:.015});
    const sm=cyl(g,.16,.27,.32,null,0,1.28,0,{mat:toon({color:c,emissive:new THREE.Color('#ffcf73'),emissiveIntensity:.55})});sm.userData.shade=1;}},
  plant:{n:'Plant',i:'🪴',p:40,w:.6,d:.6,b(g){
    cyl(g,.2,.15,.36,'#e88f6a',0,0,0,{seg:12});cyl(g,.21,.21,.05,'#c96f4f',0,.34,0,{seg:12});
    for(const [x,y,z,r] of [[0,.62,0,.24],[.14,.5,.06,.16],[-.13,.52,-.05,.17],[.02,.84,.03,.14]])sph(g,r,'#6fcf7a',x,y,z,{ws:10,hs:8});}},
  flowers:{n:'Flowers',i:'💐',p:30,w:.5,d:.5,cols:['#ff7aa8','#ffd45c','#b79cff','#ff8a6b'],b(g,c){
    cyl(g,.12,.09,.3,'#bfe6ff',0,0,0,{seg:10});
    for(let i=0;i<5;i++){const a=i/5*TAU,x=Math.cos(a)*.09,z=Math.sin(a)*.09;cyl(g,.012,.012,.3,'#4fae5c',x*.6,.28,z*.6,{seg:5,ol:false});sph(g,.07,c,x,.6,z,{ws:8,hs:6,ol:.015});}
    sph(g,.06,'#ffffff',0,.64,0,{ws:8,hs:6,ol:.015});}},
  cactus:{n:'Cactus',i:'🌵',p:35,w:.5,d:.5,b(g){cyl(g,.18,.14,.3,'#ff9ec4',0,0,0,{seg:12});cyl(g,.1,.1,.5,'#5fbf74',0,.3,0,{seg:10});sph(g,.1,'#5fbf74',0,.8,0,{ws:10,hs:8});cyl(g,.05,.05,.2,'#5fbf74',.14,.5,0,{seg:8});sph(g,.06,'#ff7aa8',0,.92,0,{ol:.012,ws:8,hs:6});}},
  tulips:{n:'Tulip pot',i:'🌷',p:45,w:.7,d:.5,cols:['#ff7aa8','#ffd45c','#ff8a6b','#b79cff'],b(g,c){box(g,.6,.26,.32,'#fbf7ff',0,0,0);for(let i=0;i<4;i++){const x=-.21+i*.14;cyl(g,.012,.012,.32,'#4fae5c',x,.26,0,{seg:5,ol:false});cone(g,.06,.12,c,x,.56,0,{seg:6,rx:Math.PI,ol:.012});}}},
  sunflower:{n:'Sunflower',i:'🌻',p:50,w:.6,d:.6,b(g){cyl(g,.2,.15,.36,'#e88f6a',0,0,0,{seg:12});cyl(g,.025,.025,1.1,'#4fae5c',0,.36,0,{seg:6,ol:.012});sph(g,.12,'#5fbf74',.1,.75,0,{s:[1,.4,.6],ol:.012});
    const hd=new THREE.Group();hd.position.set(0,1.46,.04);hd.rotation.x=-.3;g.add(hd);
    for(let i=0;i<10;i++){const a=i/10*TAU;box(hd,.09,.2,.03,'#ffd45c',Math.cos(a)*.17,Math.sin(a)*.17,0,{rz:a-Math.PI/2,center:true,ol:.012});}
    cyl(hd,.12,.12,.05,'#8c6137',0,0,.02,{rx:Math.PI/2,center:true,seg:16,ol:.012});}},
  rosebush:{n:'Rose bush',i:'🌹',p:60,w:.7,d:.7,cols:['#ff4d6d','#ff9ec4','#ffffff','#ffd45c'],b(g,c){cyl(g,.24,.18,.34,'#ffffff',0,0,0,{seg:12});sph(g,.32,'#4fae5c',0,.62,0,{ws:12,hs:9});
    const r=seeded(9);for(let i=0;i<9;i++){const a=r()*TAU,e=r()*1.2;sph(g,.07,c,Math.cos(a)*Math.cos(e)*.31,.62+Math.sin(e)*.31,Math.sin(a)*Math.cos(e)*.31,{ws:8,hs:6,ol:.012});}}},
  cattree:{n:'Cat tree',i:'🐈',p:150,w:.9,d:.9,cols:['#c98f5e','#b79cff','#7cc8ff'],b(g,c){box(g,.9,.12,.9,c,0,0,0);cyl(g,.09,.09,1.5,'#e8d6b0',-.2,.12,-.2,{seg:10});cyl(g,.09,.09,1.0,'#e8d6b0',.25,.12,.2,{seg:10});
    box(g,.6,.08,.5,c,-.1,1.62,-.15);box(g,.55,.08,.45,c,.2,1.12,.2);cyl(g,.25,.25,.22,shade(c,.1),-.1,1.7,-.15,{seg:16});sph(g,.06,'#ff7aa8',.38,.9,.35,{ws:8,hs:6,ol:.012});cyl(g,.006,.006,.2,'#3d2c5e',.38,.96,.35,{seg:4,ol:false});}},
  doghouse:{n:'Dog house',i:'🏠',p:180,w:1.1,d:1.1,cols:['#ff8a6b','#7cc8ff','#5fd4b0','#ffd45c'],b(g,c){box(g,1.0,.85,1.0,c,0,0,0);prism(g,1.1,1.25,.5,'#ffffff',0,.85,0,{ry:Math.PI/2});box(g,.42,.55,.02,'#2e2347',0,.05,.505,{ol:false});box(g,.4,.12,.02,'#ffffff',0,.68,.51,{ol:.01});}},
  petbowl:{n:'Food bowl',i:'🥣',p:30,w:.5,d:.5,cols:['#ff7aa8','#7cc8ff','#ffd45c'],b(g,c){cyl(g,.18,.14,.1,c,0,0,0,{seg:14});for(let k=0;k<5;k++)sph(g,.04,'#9b6b4a',(k%3-1)*.06,.1,(k>2?.05:-.03),{ws:6,hs:5,ol:false});}},
  rockinghorse:{n:'Rocking horse',i:'🐴',p:150,w:1.2,d:.5,cols:['#ffffff','#ffd45c','#ff9ec4'],b(g,c){for(const s of[-.15,.15]){const r=new THREE.Mesh(new THREE.TorusGeometry(.8,.03,6,20,Math.PI*.5),mat('#c98f5e'));r.rotation.z=Math.PI*1.25;r.position.set(0,.82,s);g.add(r);}
    for(const x of[-.3,.3])for(const s of[-.13,.13])box(g,.06,.35,.06,c,x,.08,s,{ol:.012});box(g,.75,.28,.3,c,0,.42,0);box(g,.18,.38,.18,c,.38,.6,0,{rz:-.3});box(g,.3,.18,.2,c,.5,.85,0);box(g,.08,.3,.05,'#ff7aa8',.32,.75,0,{rz:-.3,ol:.01});box(g,.12,.12,.05,'#ff7aa8',-.42,.5,0,{rz:.6,ol:.01});}},
  dollhouse:{n:'Dollhouse',i:'🏡',p:200,w:1.0,d:.5,cols:['#ffd6e0','#c9f2e3','#fff1b8'],b(g,c){box(g,1.0,.9,.5,c,0,0,0);prism(g,1.08,.6,.4,'#ff7aa8',0,.9,0);for(const [x,y] of [[-.25,.2],[.25,.2],[-.25,.6],[.25,.6]])box(g,.22,.18,.02,'#9fd4f2',x,y,.255,{ol:.01});box(g,.16,.26,.02,'#5fd4b0',0,0,.255,{ol:.01});}},
  robot:{n:'Toy robot',i:'🤖',p:110,w:.5,d:.5,cols:['#c8cde0','#7cc8ff','#ff8a6b'],b(g,c){box(g,.32,.36,.22,c,0,.2,0);box(g,.26,.22,.2,c,0,.58,0);box(g,.06,.06,.02,'#ffd45c',-.06,.66,.105,{ol:false});box(g,.06,.06,.02,'#ffd45c',.06,.66,.105,{ol:false});
    cyl(g,.012,.012,.12,'#3d2c5e',0,.8,0,{seg:4,ol:false});sph(g,.03,'#ff4d6d',0,.94,0,{ws:6,hs:5,ol:.008});for(const x of[-.09,.09])box(g,.09,.2,.1,'#3d2c5e',x,0,0,{ol:.01});for(const x of[-.21,.21])box(g,.08,.26,.08,c,x,.25,0,{ol:.01});}},
  dresser:{n:'Dresser',i:'🗄️',p:150,w:1.1,d:.5,cols:[WOOD,'#ffffff','#ffc9dc','#bfe6ff'],b(g,c){box(g,1.1,.9,.5,c,0,0,0);for(let i=0;i<3;i++){box(g,1.0,.24,.02,shade(c,.06),0,.08+i*.28,.255,{ol:.01});sph(g,.03,'#ffd45c',0,.2+i*.28,.27,{ws:6,hs:5,ol:false});}sph(g,.1,'#ff9ec4',.35,1.02,0,{ws:8,hs:6,ol:.012});cyl(g,.05,.05,.12,'#ffffff',.35,.9,0,{seg:8,ol:.01});}},
  mirror:{n:'Mirror',i:'🪞',p:120,w:.8,d:.4,cols:['#ffd45c','#ffffff','#ff9ec4','#b79cff'],use:'dress',b(g,c){box(g,.7,1.7,.08,c,0,.1,0);box(g,.56,1.5,.02,'#d8f0ff',0,.2,.045,{ol:false});box(g,.5,.06,.36,c,0,0,0);}},
  clock:{n:'Big clock',i:'🕰️',p:200,w:.6,d:.45,use:'clock',b(g){box(g,.55,1.9,.4,'#9b6b4a',0,0,0);cyl(g,.2,.2,.03,'#ffffff',0,1.55,.21,{rx:Math.PI/2,center:true,seg:16,ol:.01});box(g,.02,.13,.01,'#3d2c5e',0,1.6,.23,{ol:false});box(g,.1,.02,.01,'#3d2c5e',.04,1.55,.23,{ol:false});box(g,.3,.7,.02,'#ffe7a3',0,.5,.205,{ol:false});cyl(g,.01,.01,.45,'#ffd45c',0,.55,.215,{seg:4,ol:false});sph(g,.06,'#ffd45c',0,.55,.22,{ws:8,hs:6,ol:false});}},
  easel:{n:'Painting',i:'🖼️',p:100,w:.8,d:.6,b(g){box(g,.05,1.4,.05,'#c98f5e',-.3,0,.1,{rz:.12});box(g,.05,1.4,.05,'#c98f5e',.3,0,.1,{rz:-.12});box(g,.05,1.3,.05,'#c98f5e',0,0,-.2,{rx:-.25});box(g,.8,.6,.04,'#ffffff',0,.75,.14,{rx:-.1});for(const [x,y,col] of [[-.2,.95,'#7cc8ff'],[.12,1.05,'#ffd45c'],[0,.85,'#5fd4b0'],[.2,.9,'#ff7aa8']])sph(g,.08,col,x,y,.17,{s:[1,1,.2],ws:8,hs:6,ol:false});}},
  fireplace:{n:'Fireplace',i:'🔥',p:500,w:1.5,d:.6,use:'fire',b(g){box(g,1.5,1.1,.55,'#e8d6d0',0,0,0);box(g,.8,.6,.02,'#2e2347',0,.05,.28,{ol:false});box(g,1.7,.1,.65,'#c98f5e',0,1.1,0);for(const [x,h] of [[-.15,.35],[0,.45],[.15,.3]]){cone(g,.09,h,'#ff8a2b',x,.06,.22,{seg:6,ol:false});cone(g,.05,h*.6,'#ffd45c',x,.06,.25,{seg:6,ol:false});}box(g,.5,.06,.08,'#9b6b4a',0,.06,.2,{ol:false});}},
  sink:{n:'Sink',i:'🚰',p:150,w:.8,d:.55,kit:1,cols:['#ffffff','#bfe6ff','#ffc9dc'],use:'wash',b(g,c){box(g,.8,.85,.55,c,0,0,0);box(g,.6,.06,.4,'#d8dcea',0,.85,0,{ol:.01});cyl(g,.03,.03,.3,'#c8cde0',0,.85,-.18,{seg:6,ol:.01});box(g,.04,.04,.18,'#c8cde0',0,1.12,-.1,{ol:.01});}},
  washer:{n:'Washing machine',i:'🧺',p:250,w:.75,d:.7,use:'wash',b(g){box(g,.75,.9,.7,'#f4f6fb',0,0,0);cyl(g,.24,.24,.04,'#c8cde0',0,.42,.35,{rx:Math.PI/2,center:true,seg:18,ol:.012});cyl(g,.18,.18,.05,'#9fd4f2',0,.42,.36,{rx:Math.PI/2,center:true,seg:18,ol:false});box(g,.6,.08,.02,'#d8dcea',0,.78,.355,{ol:false});sph(g,.03,'#ff7aa8',.25,.8,.36,{ws:6,hs:5,ol:false});}},
  computer:{n:'Computer desk',i:'💻',p:450,w:1.3,d:.7,cols:['#ffffff',WOOD,'#ffc9dc'],use:'game',b(g,c){box(g,1.3,.06,.7,c,0,.72,0);for(const [x,z] of [[-.6,-.3],[.6,-.3],[-.6,.3],[.6,.3]])box(g,.06,.72,.06,c,x,0,z,{ol:.01});box(g,.7,.45,.04,'#3d2c5e',0,.98,-.15);box(g,.62,.37,.02,'#7cc8ff',0,1.02,-.125,{ol:false});box(g,.12,.2,.08,'#3d2c5e',0,.78,-.15,{ol:.01});box(g,.5,.03,.18,'#ffffff',0,.78,.12,{ol:.01});}},
  gaming:{n:'Game console',i:'🎮',p:600,w:1.4,d:.55,use:'game',b(g){box(g,1.4,.45,.5,'#ffffff',0,0,0);box(g,1.3,.8,.06,'#2e2347',0,.45,-.1);box(g,1.2,.7,.02,'#b79cff',0,.5,-.065,{ol:false});box(g,.3,.06,.2,'#3d2c5e',-.3,.45,.12,{ol:.01});for(const [x,col] of [[.2,'#ff6b6b'],[.45,'#5fa8ff']])box(g,.16,.04,.1,col,x,.45,.15,{ol:.01});}},
  globe:{n:'Little globe',i:'🌍',p:0,w:.4,d:.4,b(g){cyl(g,.14,.17,.05,'#3d2c5e',0,0,0,{seg:12});cyl(g,.03,.03,.22,'#c9a24a',0,.05,0,{seg:6,ol:.01});
    const a=new THREE.Mesh(new THREE.TorusGeometry(.2,.018,6,20,Math.PI*1.2),mat('#c9a24a'));a.rotation.z=Math.PI*.4;a.position.set(0,.42,0);g.add(a);
    sph(g,.17,'#6fb7ff',0,.42,0,{ws:14,hs:10,ol:.012});for(const [x,y,z,s] of [[.09,.5,.12,.07],[-.1,.44,.11,.06],[.04,.33,.15,.05],[-.07,.52,-.1,.05],[.12,.38,-.1,.06],[-.12,.3,-.08,.05]])sph(g,s,'#6fcf7a',x,y,z,{s:[1.3,.8,1],ws:7,hs:5,ol:false});}},   /* 🌍 the school party's gift (run 4, job 11): not for sale */
  /* ===== 🛋️ run 4, job 13 (item 28): 70 new pieces across every kind (r4:1 marks them), several colours each, low-poly in the game's style, priced like their neighbours ===== */
  /* beds */
  canopybed:{n:'Canopy bed',i:'🛏️',p:420,w:1.5,d:2.2,r4:1,cols:SOFT,use:'sleep',b(g,c){box(g,1.5,.34,2.2,WOOD,0,0,0);box(g,1.4,.2,2.05,WHITE,0,.34,.04);box(g,1.44,.14,1.3,c,0,.46,.4);box(g,.9,.14,.42,'#ffffff',0,.52,-.7);
    for(const x of[-.7,.7])for(const z of[-1.05,1.05])box(g,.08,2.1,.08,WOOD,x,0,z,{ol:.012});box(g,1.56,.08,2.26,c,0,2.1,0,{ol:.012});for(const x of[-.7,.7])box(g,.06,1.1,.5,shade(c,.12),x,1.0,-.8,{ol:false});}},
  daybed:{n:'Daybed',i:'🛋️',p:260,w:2.0,d:1.0,r4:1,cols:SOFT,use:'sit',b(g,c){box(g,2,.36,1,WOOD,0,0,0);box(g,1.9,.18,.9,c,0,.36,0);box(g,.3,.5,1,WOOD,-.85,.36,0);box(g,.3,.5,1,WOOD,.85,.36,0);
    for(const z of[-.3,.3])box(g,.5,.18,.5,shade(c,.1),-.55,.54,z,{ol:.012});box(g,.5,.18,.5,'#ffffff',.6,.54,0,{ol:.012});}},
  crib:{n:'Baby crib',i:'🍼',p:180,w:1.2,d:.7,r4:1,cols:['#ffffff','#ffd6e0','#bfe6ff','#c9f2e3'],b(g,c){box(g,1.2,.3,.7,c,0,.3,0);for(const x of[-.58,.58])for(const z of[-.33,.33])box(g,.06,.95,.06,c,x,0,z,{ol:.012});
    for(let i=0;i<8;i++)for(const z of[-.33,.33])box(g,.03,.5,.03,c,-.5+i*.143,.6,z,{ol:false});box(g,1.1,.1,.6,'#ffffff',0,.6,0,{ol:false});sph(g,.1,'#ffd45c',-.3,.78,.1,{ws:8,hs:6,ol:.01});}},
  carbed:{n:'Race car bed',i:'🏎️',p:380,w:1.4,d:2.2,r4:1,cols:['#ff6b6b','#7cc8ff','#ffd45c','#5fd4b0'],use:'sleep',b(g,c){box(g,1.4,.4,2.2,c,0,0,0);box(g,1.2,.16,1.9,'#ffffff',0,.4,0,{ol:false});box(g,1.1,.12,1.2,shade(c,.3),0,.5,.35,{ol:false});
    box(g,1.4,.3,.3,c,0,.4,-1.0,{ol:.012});box(g,1.44,.1,.3,shade(c,-.3),0,.7,-1.0,{ol:false});for(const x of[-.72,.72])for(const z of[-.7,.7])cyl(g,.22,.22,.1,'#2e2347',x,.24,z,{rz:Math.PI/2,center:true,seg:12,ol:.01});for(const x of[-.4,.4])sph(g,.08,'#fff1b8',x,.3,1.1,{ws:8,hs:6,ol:false});}},
  /* sofas and seats */
  cornersofa:{n:'Corner sofa',i:'🛋️',p:420,w:2.4,d:1.6,r4:1,cols:SOFT,use:'sit',b(g,c){const L=shade(c,.08);box(g,2.4,.4,.9,c,0,.06,-.35);box(g,.9,.4,1.6,c,-.75,.06,0);box(g,2.4,.55,.24,c,0,.46,-.68);box(g,.24,.55,1.6,c,-1.08,.46,0);
    for(const x of[-.3,.5])box(g,.75,.14,.6,L,x,.46,-.3);box(g,.6,.14,.7,L,-.7,.46,.4);box(g,.22,.34,.9,c,1.09,.46,-.35);for(const x of[-2.3,2.3])box(g,.08,.06,.08,WOOD2,x/2,0,-.35,{ol:false});}},
  loveseat:{n:'Loveseat',i:'💕',p:190,w:1.4,d:.9,r4:1,cols:SOFT,use:'sit',b(g,c){const L=shade(c,.08);box(g,1.4,.4,.9,c,0,.06,0);for(const x of[-.33,.33])box(g,.6,.14,.6,L,x,.46,.1);box(g,1.4,.55,.24,c,0,.46,-.33);for(const x of[-.6,.6])box(g,.2,.34,.9,c,x,.46,0);
    for(const x of[-.5,.5])sph(g,.1,'#ff4d8d',x*.4,.78,-.3,{s:[1,.9,.5],ws:8,hs:6,ol:.01});}},
  stool:{n:'Stool',i:'🪑',p:35,w:.45,d:.45,r4:1,cols:[WOOD,'#ffffff','#ff9ec4','#7fdcb5','#ffd45c'],use:'sit',b(g,c){cyl(g,.22,.22,.06,c,0,.42,0,{seg:16});for(let i=0;i<3;i++){const a=i/3*TAU;cyl(g,.025,.03,.42,c,Math.cos(a)*.15,0,Math.sin(a)*.15,{seg:6,ol:.01});}}},
  barstool:{n:'Bar stool',i:'🪑',p:55,w:.45,d:.45,r4:1,cols:['#2e2347','#ff6b6b','#ffffff','#7cc8ff'],use:'sit',b(g,c){cyl(g,.2,.2,.08,c,0,.68,0,{seg:16});cyl(g,.03,.03,.68,'#c8c8d8',0,0,0,{seg:8,ol:.01});cyl(g,.2,.22,.04,'#c8c8d8',0,0,0,{seg:16});const r=new THREE.Mesh(new THREE.TorusGeometry(.16,.015,6,18),mat('#c8c8d8'));r.rotation.x=Math.PI/2;r.position.y=.3;g.add(r);}},
  rocking:{n:'Rocking chair',i:'🪑',p:140,w:.7,d:.9,r4:1,cols:[WOOD,'#ffffff','#9a6a43'],use:'sit',b(g,c){box(g,.6,.07,.55,c,0,.42,0);box(g,.6,.6,.07,c,0,.49,-.26,{rx:-.12});for(const x of[-.26,.26]){box(g,.06,.42,.06,c,x,.06,.2,{ol:.012});box(g,.06,.42,.06,c,x,.06,-.2,{ol:.012});box(g,.06,.1,.9,c,x,0,0,{ol:.012});box(g,.06,.06,.5,c,x,.7,0,{ol:false});}}},
  eggchair:{n:'Hanging egg chair',i:'🥚',p:300,w:1.0,d:1.0,r4:1,cols:['#f6e2c8','#ffffff','#c9f2e3'],use:'sit',b(g,c){cyl(g,.45,.5,.06,'#2e2347',0,0,0,{seg:18});cyl(g,.03,.03,2.2,'#2e2347',0,.06,-.4,{seg:8,ol:.01});box(g,.5,.05,.45,'#2e2347',0,2.2,-.2,{ol:false});
    sph(g,.48,c,0,1.0,0,{ws:16,hs:12,ol:.015});box(g,.6,.7,.5,'#ffd6e0',0,.65,.2,{ol:false});sph(g,.3,'#ff9ec4',0,.75,.12,{s:[1.3,.5,1],ws:10,hs:8,ol:.01});}},
  woodbench:{n:'Wooden bench',i:'🪑',p:90,w:1.6,d:.5,r4:1,cols:[WOOD,'#ffffff','#9a6a43','#5fd4b0'],use:'sit',b(g,c){box(g,1.6,.08,.5,c,0,.42,0);box(g,1.6,.5,.07,c,0,.5,-.22);for(const x of[-.7,.7]){box(g,.08,.42,.08,c,x,0,.18,{ol:.012});box(g,.08,.42,.08,c,x,0,-.18,{ol:.012});}}},
  pouf:{n:'Pouf',i:'🟣',p:60,w:.6,d:.6,r4:1,cols:SOFT,use:'sit',b(g,c){cyl(g,.3,.32,.36,c,0,0,0,{seg:18});sph(g,.3,shade(c,.1),0,.36,0,{s:[1,.3,1],ws:16,hs:8,ol:false});for(let i=0;i<4;i++){const a=i/4*TAU;box(g,.03,.36,.02,shade(c,-.2),Math.cos(a)*.3,0,Math.sin(a)*.3,{ry:-a,ol:false});}}},
  /* tables */
  coffeetable:{n:'Coffee table',i:'☕',p:90,w:1.1,d:.6,r4:1,cols:[WOOD,'#ffffff','#2e2347'],b(g,c){box(g,1.1,.06,.6,c,0,.4,0);box(g,1.0,.04,.5,shade(c,-.1),0,.15,0,{ol:false});for(const x of[-.48,.48])for(const z of[-.23,.23])box(g,.06,.4,.06,c,x,0,z,{ol:.012});
    cyl(g,.06,.05,.1,'#ffffff',-.25,.46,0,{seg:10,ol:.01});cyl(g,.04,.04,.06,'#9a6a43',-.25,.5,0,{seg:8,ol:false});box(g,.3,.03,.22,'#7cc8ff',.25,.46,0,{ol:.01});}},
  sidetable:{n:'Side table',i:'🪵',p:50,w:.5,d:.5,r4:1,cols:[WOOD,'#ffffff','#ff9ec4','#b79cff'],b(g,c){cyl(g,.25,.25,.05,c,0,.5,0,{seg:16});cyl(g,.03,.04,.5,c,0,0,0,{seg:8,ol:.01});cyl(g,.18,.2,.04,c,0,0,0,{seg:16});}},
  diningtable:{n:'Big dining table',i:'🍽️',p:260,w:2.0,d:1.0,r4:1,cols:[WOOD,'#ffffff','#2e2347'],b(g,c){box(g,2,.08,1,c,0,.72,0);for(const x of[-.9,.9])for(const z of[-.4,.4])box(g,.08,.72,.08,c,x,0,z,{ol:.012});box(g,1.6,.02,.3,'#ff9ec4',0,.8,0,{ol:false});
    for(const x of[-.6,0,.6])for(const z of[-.3,.3]){cyl(g,.11,.11,.02,'#ffffff',x,.8,z,{seg:14,ol:.008});}}},
  roundtable:{n:'Round table',i:'⚪',p:140,w:1.1,d:1.1,r4:1,cols:[WOOD,'#ffffff','#c9f2e3'],b(g,c){cyl(g,.55,.55,.06,c,0,.72,0,{seg:24});cyl(g,.06,.08,.72,c,0,0,0,{seg:10,ol:.01});cyl(g,.3,.32,.05,c,0,0,0,{seg:20});cyl(g,.08,.07,.22,'#7cc8ff',0,.78,0,{seg:12,ol:.01});for(let i=0;i<3;i++){const a=i/3*TAU;sph(g,.05,['#ff7aa8','#ffd45c','#b79cff'][i],Math.cos(a)*.06,1.04,Math.sin(a)*.06,{ws:8,hs:6,ol:.008});}}},
  nightstand:{n:'Nightstand',i:'🕯️',p:70,w:.5,d:.45,r4:1,cols:[WOOD,'#ffffff','#ffd6e0','#bfe6ff'],b(g,c){box(g,.5,.55,.45,c,0,0,0);box(g,.4,.18,.02,shade(c,.08),0,.3,.23,{ol:.01});sph(g,.025,'#ffd45c',0,.39,.245,{ws:6,hs:5,ol:false});cyl(g,.05,.06,.14,'#ffffff',-.1,.55,0,{seg:10,ol:.008});cyl(g,.012,.012,.1,'#ffffff',-.1,.69,0,{seg:6,ol:false});sph(g,.025,'#ffd45c',-.1,.81,0,{ws:6,hs:5,ol:false});}},
  vanity:{n:'Vanity table',i:'💄',p:220,w:1.1,d:.5,r4:1,cols:['#ffffff','#ffd6e0','#e6dbff'],use:'dress',b(g,c){box(g,1.1,.72,.5,c,0,0,0);box(g,.8,1.0,.06,c,0,.72,-.2,{ol:.012});box(g,.64,.84,.02,'#bfe6ff',0,.8,-.165,{ol:false});for(const x of[-.3,.3])box(g,.2,.1,.02,shade(c,.08),x,.3,.25,{ol:false});
    cyl(g,.03,.03,.1,'#ff4d8d',.3,.72,.1,{seg:8,ol:.008});cyl(g,.05,.05,.06,'#b79cff',-.3,.72,.1,{seg:10,ol:.008});for(const x of[-.28,.28])for(const y of[.9,1.3])sph(g,.02,'#fff1b8',x,y,-.15,{ws:6,hs:5,ol:false});}},
  /* lamps */
  floorlamp:{n:'Floor lamp',i:'💡',p:110,w:.5,d:.5,r4:1,cols:['#ffd45c','#ff9ec4','#7fdcb5','#8fd3ff'],use:'lamp',b(g,c){cyl(g,.2,.22,.04,'#3d2c5e',0,0,0);cyl(g,.02,.02,1.5,'#3d2c5e',0,.04,0,{seg:6,ol:.012});const sm=cyl(g,.18,.26,.34,null,0,1.5,0,{mat:toon({color:c,emissive:new THREE.Color('#ffcf73'),emissiveIntensity:.55})});sm.userData.shade=1;}},
  tablelamp:{n:'Table lamp',i:'🛋️',p:60,w:.4,d:.4,r4:1,cols:['#ffd45c','#ff9ec4','#7fdcb5','#8fd3ff'],use:'lamp',b(g,c){box(g,.4,.5,.4,WOOD,0,0,0);cyl(g,.08,.1,.04,'#3d2c5e',0,.5,0);cyl(g,.015,.015,.22,'#3d2c5e',0,.54,0,{seg:6,ol:false});const sm=cyl(g,.1,.15,.16,null,0,.76,0,{mat:toon({color:c,emissive:new THREE.Color('#ffcf73'),emissiveIntensity:.55})});sm.userData.shade=1;}},
  starlamp:{n:'Star lamp',i:'🌟',p:90,w:.5,d:.5,r4:1,cols:['#ffd45c','#ffffff','#ff9ec4'],use:'lamp',b(g,c){cyl(g,.16,.18,.04,'#3d2c5e',0,0,0);cyl(g,.02,.02,1.1,'#3d2c5e',0,.04,0,{seg:6,ol:.012});const M=toon({color:c,emissive:new THREE.Color('#ffe08a'),emissiveIntensity:.6});
    for(let i=0;i<5;i++){const a=i/5*TAU;const s=cone(g,.07,.26,null,Math.cos(a)*.12,1.2,Math.sin(a)*.12,{mat:M,seg:4,rz:Math.cos(a)*1.2,rx:-Math.sin(a)*1.2,center:true});s.userData.shade=1;}const sm=sph(g,.1,null,0,1.2,0,{mat:M,ws:8,hs:6});sm.userData.shade=1;}},
  neon:{n:'Neon sign',i:'🌈',p:150,w:1.0,d:.1,r4:1,hang:1,cols:['#ff4d8d','#7cc8ff','#5fd4b0','#ffd45c'],use:'lamp',b(g,c){box(g,1.0,.5,.06,'#2e2347',0,1.4,0);const M=toon({color:c,emissive:new THREE.Color(c),emissiveIntensity:.8});
    for(const [x,y,w,h] of [[-.3,1.52,.08,.3],[-.1,1.52,.08,.3],[-.2,1.52,.26,.08],[.15,1.64,.08,.18],[.3,1.5,.26,.08],[.3,1.66,.26,.08]]){const b=box(g,w,h,.04,null,x,y,.05,{mat:M,ol:false});b.userData.shade=1;}}},
  lantern:{n:'Paper lantern',i:'🏮',p:70,w:.5,d:.5,r4:1,cols:['#ff6b6b','#ffd45c','#ffffff','#ff9ec4'],use:'lamp',b(g,c){cyl(g,.14,.16,.04,'#3d2c5e',0,0,0);cyl(g,.02,.02,1.3,'#3d2c5e',0,.04,0,{seg:6,ol:.012});box(g,.3,.02,.02,'#3d2c5e',.14,1.34,0,{ol:false});const M=toon({color:c,emissive:new THREE.Color('#ffcf73'),emissiveIntensity:.5});
    const sm=sph(g,.2,null,.28,1.1,0,{mat:M,s:[1,1.25,1],ws:12,hs:10});sm.userData.shade=1;for(const y of[.88,1.32])cyl(g,.06,.06,.03,'#ffd45c',.28,y,0,{seg:10,ol:false});}},
  /* rugs */
  rughearts:{n:'Heart rug',i:'💗',p:90,w:1.8,d:1.6,r4:1,flat:1,cols:['#ff9ec4','#ffd6e0','#ffffff','#b79cff'],b(g,c){cyl(g,.9,.9,.025,c,0,0,0,{seg:32,ol:.02});for(const [x,z,s] of [[-.35,-.2,.22],[.35,-.2,.22],[0,.25,.16]]){cyl(g,s,s,.03,'#ff4d8d',x-s*.45,0,z,{seg:16,ol:false});cyl(g,s,s,.03,'#ff4d8d',x+s*.45,0,z,{seg:16,ol:false});box(g,s*1.4,.03,s*1.4,'#ff4d8d',x,0,z+s*.5,{ry:Math.PI/4,ol:false});}}},
  rugstripe:{n:'Striped rug',i:'🟦',p:85,w:2.2,d:1.4,r4:1,flat:1,cols:['#7cc8ff','#ffd45c','#5fd4b0','#ff9ec4'],b(g,c){box(g,2.2,.025,1.4,'#ffffff',0,0,0,{ol:.02});for(let i=0;i<6;i++)box(g,2.0,.03,.11,i%2?c:shade(c,.3),0,0,-.55+i*.22,{ol:false});}},
  rugstar:{n:'Star rug',i:'⭐',p:95,w:2.0,d:2.0,r4:1,flat:1,cols:['#b79cff','#2e2347','#7cc8ff'],b(g,c){cyl(g,1.0,1.0,.025,c,0,0,0,{seg:32,ol:.02});for(let i=0;i<5;i++){const a=i/5*TAU;box(g,.5,.03,.16,'#ffd45c',Math.cos(a)*.3,0,Math.sin(a)*.3,{ry:-a,ol:false});}cyl(g,.2,.2,.03,'#ffd45c',0,0,0,{seg:16,ol:false});for(let i=0;i<8;i++){const a=i/8*TAU+.3;cyl(g,.05,.05,.03,'#ffffff',Math.cos(a)*.75,0,Math.sin(a)*.75,{seg:8,ol:false});}}},
  doormat:{n:'Doormat',i:'🚪',p:25,w:.8,d:.5,r4:1,flat:1,cols:['#c98f5e','#5fd4b0','#ff9ec4'],b(g,c){box(g,.8,.03,.5,c,0,0,0,{ol:.015});box(g,.6,.032,.08,shade(c,-.3),0,0,-.1,{ol:false});box(g,.4,.032,.08,shade(c,-.3),0,0,.08,{ol:false});}},
  /* plants */
  palm:{n:'Palm',i:'🌴',p:110,w:1.0,d:1.0,r4:1,b(g){cyl(g,.26,.2,.4,'#e88f6a',0,0,0,{seg:12});cyl(g,.06,.08,1.2,'#9a6a43',0,.4,0,{seg:8,ol:.012});for(let i=0;i<6;i++){const a=i/6*TAU;sph(g,.1,'#5fbf74',Math.cos(a)*.3,1.62-Math.abs(Math.sin(a))*.05,Math.sin(a)*.3,{s:[3.2,.5,1.2],ry:-a,ws:8,hs:6,ol:.012});}}},
  monstera:{n:'Monstera',i:'🌿',p:80,w:.8,d:.8,r4:1,b(g){cyl(g,.2,.16,.36,'#ffffff',0,0,0,{seg:12});for(let i=0;i<5;i++){const a=i/5*TAU+.4,r=.2+i*.03;cyl(g,.012,.012,.6+i*.08,'#4fae5c',Math.cos(a)*r*.5,.36,Math.sin(a)*r*.5,{seg:5,ol:false});sph(g,.2,'#5fbf74',Math.cos(a)*r,.9+i*.08,Math.sin(a)*r,{s:[1.4,.25,1.1],ry:-a,ws:10,hs:6,ol:.012});}}},
  orchid:{n:'Orchid',i:'🌸',p:55,w:.4,d:.4,r4:1,cols:['#ff9ec4','#ffffff','#b79cff','#ffd45c'],b(g,c){cyl(g,.1,.08,.22,'#bfe6ff',0,0,0,{seg:10});cyl(g,.01,.01,.6,'#4fae5c',.02,.22,0,{seg:5,rz:-.15,ol:false});for(let i=0;i<4;i++){const y=.5+i*.1,x=.07+i*.02;for(let k=0;k<5;k++){const a=k/5*TAU;sph(g,.03,c,x+Math.cos(a)*.04,y+Math.sin(a)*.04,.03*k%2,{s:[1,1,.3],ws:6,hs:5,ol:false});}sph(g,.015,'#ffd45c',x,y,.03,{ws:5,hs:4,ol:false});}sph(g,.12,'#5fbf74',-.05,.26,.02,{s:[1.4,.25,.8],ws:8,hs:5,ol:false});}},
  herbs:{n:'Herb pots',i:'🌱',p:40,w:.6,d:.3,r4:1,b(g){box(g,.6,.06,.3,WOOD,0,0,0);for(let i=0;i<3;i++){const x=-.2+i*.2;cyl(g,.07,.06,.12,'#e88f6a',x,.06,0,{seg:10,ol:.01});for(let k=0;k<4;k++)sph(g,.035,['#5fbf74','#4fae5c','#7ad48a'][i],x+(k%2?.03:-.03),.22+k*.02,(k<2?.03:-.03),{ws:6,hs:5,ol:false});}}},
  bamboo:{n:'Lucky bamboo',i:'🎋',p:45,w:.4,d:.4,r4:1,b(g){cyl(g,.1,.1,.2,'#7cc8ff',0,0,0,{seg:12,ol:.01});for(const [x,z,h] of [[-.04,0,.7],[.04,.03,.55],[0,-.05,.85]]){cyl(g,.015,.018,h,'#5fbf74',x,.2,z,{seg:6,ol:.008});for(let k=0;k<3;k++)cyl(g,.019,.019,.01,'#4fae5c',x,.2+h*(k+1)/4,z,{seg:6,ol:false});sph(g,.06,'#5fbf74',x+.05,.2+h,z,{s:[1.6,.3,.7],ws:6,hs:5,ol:false});}}},
  hangplant:{n:'Hanging plant',i:'🪴',p:60,w:.5,d:.5,r4:1,hang:1,b(g){box(g,.06,.06,.3,WOOD,0,1.9,.1,{ol:.01});cyl(g,.01,.01,.5,'#9a6a43',0,1.4,.2,{seg:5,ol:false});cyl(g,.14,.1,.2,'#e88f6a',0,1.2,.2,{seg:12,ol:.01});
    for(let i=0;i<6;i++){const a=i/6*TAU;sph(g,.09,'#5fbf74',Math.cos(a)*.13,1.38,.2+Math.sin(a)*.13,{ws:7,hs:5,ol:false});sph(g,.05,'#4fae5c',Math.cos(a)*.16,1.1-i*.03,.2+Math.sin(a)*.16,{ws:6,hs:5,ol:false});}}},
  /* shelves and storage */
  cubeshelf:{n:'Cube shelf',i:'🔲',p:170,w:1.2,d:.4,r4:1,cols:['#ffffff',WOOD,'#ffd6e0','#bfe6ff'],b(g,c){box(g,1.2,1.2,.4,c,0,0,0);for(const x of[-.3,.3])for(const y of[.1,.7])box(g,.5,.5,.36,shade(c,.1),x,y,.03,{ol:false});box(g,.2,.3,.2,'#ff6b6b',-.3,.1,.05,{ol:.01});sph(g,.12,'#5fd4b0',.3,.82,.05,{ws:8,hs:6,ol:.01});box(g,.3,.2,.1,'#7cc8ff',-.3,.7,.05,{ol:.01});}},
  cornershelf:{n:'Corner shelf',i:'📐',p:90,w:.6,d:.6,r4:1,cols:['#ffffff',WOOD,'#c9f2e3'],b(g,c){for(const y of[.3,.8,1.3]){const s=box(g,.6,.05,.6,c,0,y,0,{ol:.012});}box(g,.06,1.4,.06,c,-.27,0,-.27,{ol:.012});box(g,.06,1.4,.06,c,.27,0,.27,{ol:.012});sph(g,.1,'#ff9ec4',0,.45,0,{ws:8,hs:6,ol:.01});box(g,.2,.25,.15,'#7cc8ff',0,.85,0,{ol:.01});cyl(g,.06,.05,.2,'#b79cff',0,1.35,0,{seg:10,ol:.01});}},
  chest:{n:'Treasure chest',i:'🧰',p:120,w:.9,d:.6,r4:1,cols:['#9a6a43','#5fd4b0','#ff6b6b'],b(g,c){box(g,.9,.5,.6,c,0,0,0);cyl(g,.3,.3,.9,shade(c,.1),0,.5,0,{rz:Math.PI/2,center:true,seg:14,ol:.012});for(const x of[-.3,.3])box(g,.06,.52,.62,'#ffd45c',x,0,0,{ol:false});box(g,.12,.14,.04,'#ffd45c',0,.4,.31,{ol:.01});}},
  coatrack:{n:'Coat rack',i:'🧥',p:60,w:.4,d:.4,r4:1,cols:[WOOD,'#2e2347','#ffffff'],b(g,c){cyl(g,.2,.22,.04,c,0,0,0,{seg:14});cyl(g,.025,.025,1.8,c,0,.04,0,{seg:8,ol:.012});for(let i=0;i<4;i++){const a=i/4*TAU;box(g,.02,.02,.22,c,Math.cos(a)*.11,1.72,Math.sin(a)*.11,{ry:-a,ol:false});}box(g,.3,.5,.1,'#ff6b6b',.12,1.2,.12,{ol:.012});cyl(g,.1,.12,.08,'#ffd45c',-.12,1.76,-.12,{seg:12,ol:.01});}},
  shoerack:{n:'Shoe rack',i:'👟',p:50,w:.9,d:.35,r4:1,cols:[WOOD,'#ffffff'],b(g,c){for(const y of[.08,.4])box(g,.9,.04,.35,c,0,y,0,{ol:.012});for(const x of[-.42,.42])box(g,.04,.5,.35,c,x,0,0,{ol:.012});for(let i=0;i<3;i++)for(const y of[.12,.44]){const cc=['#ff6b6b','#7cc8ff','#ffd45c'][(i+(y>.2?1:0))%3];box(g,.1,.08,.22,cc,-.28+i*.22,y,0,{ol:.008});box(g,.1,.08,.22,cc,-.17+i*.22,y,0,{ol:.008});}}},
  laddershelf:{n:'Ladder shelf',i:'🪜',p:130,w:.8,d:.45,r4:1,cols:[WOOD,'#ffffff','#2e2347'],b(g,c){for(const x of[-.37,.37])box(g,.06,1.8,.06,c,x,0,-.18,{rx:-.2,ol:.012});for(let i=0;i<4;i++){const y=.3+i*.42,d=.45-i*.09;box(g,.8,.04,d,c,0,y,-.2+d/2,{ol:.012});}box(g,.2,.25,.15,'#b79cff',-.2,.34,.0,{ol:.01});sph(g,.08,'#ff9ec4',.2,.84,-.02,{ws:8,hs:6,ol:.01});box(g,.3,.12,.12,'#7cc8ff',0,1.18,-.06,{ol:.01});}},
  /* kitchen */
  island:{n:'Kitchen island',i:'🍳',p:280,w:1.6,d:.8,r4:1,cols:['#ffffff','#c9f2e3','#ffd6e0','#2e2347'],b(g,c){box(g,1.6,.86,.8,c,0,0,0);box(g,1.66,.06,.86,'#e8e2f0',0,.86,0,{ol:.012});for(const x of[-.5,.5])box(g,.5,.5,.02,shade(c,.08),x,.2,.41,{ol:false});box(g,.4,.04,.3,WOOD,-.4,.92,0,{ol:.01});sph(g,.06,'#ff5d6c',.3,.98,-.1,{ws:8,hs:6,ol:false});sph(g,.06,'#ffd45c',.45,.98,.08,{ws:8,hs:6,ol:false});}},
  oven:{n:'Oven',i:'🥧',p:220,w:.8,d:.7,r4:1,cols:['#ffffff','#2e2347','#ff6b6b'],use:'cook',b(g,c){box(g,.8,.86,.7,c,0,0,0);box(g,.6,.4,.02,'#3d2c5e',0,.22,.36,{ol:false});box(g,.5,.28,.01,'#ffb36b',0,.28,.37,{ol:false});box(g,.64,.03,.03,'#c8c8d8',0,.7,.36,{ol:false});for(let i=0;i<3;i++)cyl(g,.03,.03,.02,'#c8c8d8',-.2+i*.2,.78,.3,{seg:8,ol:false});}},
  dishwasher:{n:'Dishwasher',i:'🍽️',p:200,w:.8,d:.7,r4:1,cols:['#ffffff','#c8c8d8','#c9f2e3'],b(g,c){box(g,.8,.86,.7,c,0,0,0);box(g,.72,.6,.02,shade(c,-.08),0,.1,.36,{ol:false});box(g,.6,.04,.03,'#3d2c5e',0,.76,.36,{ol:false});sph(g,.02,'#5fd4b0',-.3,.8,.37,{ws:6,hs:5,ol:false});}},
  coffeecorner:{n:'Coffee corner',i:'☕',p:90,w:.7,d:.5,r4:1,cols:[WOOD,'#ffffff'],b(g,c){box(g,.7,.5,.5,c,0,0,0);box(g,.3,.32,.24,'#2e2347',-.15,.5,0,{ol:.012});box(g,.28,.1,.2,'#c8c8d8',-.15,.82,0,{ol:false});cyl(g,.05,.04,.08,'#ffffff',-.15,.52,.1,{seg:10,ol:.008});for(let i=0;i<2;i++)cyl(g,.05,.04,.08,['#ff9ec4','#7cc8ff'][i],.18,.5+i*.1,.1-i*.08,{seg:10,ol:.008});}},
  trolley:{n:'Kitchen trolley',i:'🛒',p:110,w:.8,d:.5,r4:1,cols:['#ffffff','#ff6b6b','#ffd45c',WOOD],b(g,c){for(const y of[.1,.45,.8])box(g,.8,.04,.5,c,0,y,0,{ol:.012});for(const x of[-.37,.37])for(const z of[-.22,.22])box(g,.04,.84,.04,c,x,0,z,{ol:.01});for(const x of[-.3,.3])for(const z of[-.18,.18])cyl(g,.05,.05,.03,'#2e2347',x,.03,z,{rx:Math.PI/2,center:true,seg:10,ol:false});
    box(g,.2,.2,.2,'#ffffff',-.2,.84,0,{ol:.01});sph(g,.08,'#ff5d6c',.2,.92,0,{ws:8,hs:6,ol:false});box(g,.3,.15,.2,'#7cc8ff',0,.49,0,{ol:.01});}},
  spicerack:{n:'Spice shelf',i:'🧂',p:45,w:.6,d:.2,r4:1,hang:1,cols:[WOOD,'#ffffff'],b(g,c){box(g,.6,.04,.2,c,0,1.3,0,{ol:.012});box(g,.6,.03,.03,c,0,1.34,.085,{ol:false});for(let i=0;i<5;i++){const cc=['#ff6b6b','#ffd45c','#5fd4b0','#e88f6a','#b79cff'][i];cyl(g,.035,.035,.12,'#ffffff',-.24+i*.12,1.34,0,{seg:8,ol:.008});cyl(g,.03,.03,.03,cc,-.24+i*.12,1.46,0,{seg:8,ol:false});}}},
  /* bathroom */
  shower:{n:'Shower',i:'🚿',p:300,w:.9,d:.9,r4:1,use:'bath',b(g){box(g,.9,.06,.9,'#ffffff',0,0,0);for(const [x,z,w,d] of [[0,-.43,.9,.04],[-.43,0,.04,.9]])box(g,w,2.1,d,'#ffffff',x,.06,z,{ol:.012});const gl=toon({color:'#cfeeff',transparent:true,opacity:.3});box(g,.04,2.0,.86,null,.43,.06,0,{mat:gl,ol:false});
    cyl(g,.015,.015,1.6,'#c8c8d8',-.3,.3,-.3,{seg:6,ol:false});cyl(g,.1,.1,.03,'#c8c8d8',-.2,1.9,-.2,{seg:12,ol:.008});for(let i=0;i<4;i++)sph(g,.02,'#7cc8ff',-.2+(i%2)*.06,1.5-i*.2,-.2+(i>1?.06:0),{ws:5,hs:4,ol:false});}},
  toilet:{n:'Toilet',i:'🚽',p:150,w:.5,d:.7,r4:1,b(g){box(g,.4,.7,.2,'#ffffff',0,0,-.25,{ol:.012});cyl(g,.2,.16,.38,'#ffffff',0,0,.1,{seg:14,ol:.012});cyl(g,.22,.22,.05,'#ffffff',0,.38,.1,{seg:14,ol:.01});cyl(g,.16,.16,.02,'#7cc8ff',0,.43,.1,{seg:14,ol:false});box(g,.2,.08,.04,'#ff9ec4',0,.6,-.14,{ol:false});}},
  towelrack:{n:'Towel rack',i:'🧻',p:40,w:.6,d:.2,r4:1,hang:1,cols:['#ff9ec4','#7cc8ff','#ffd45c','#5fd4b0'],b(g,c){box(g,.6,.03,.03,'#c8c8d8',0,1.3,.08,{ol:.008});for(const x of[-.27,.27])box(g,.03,.03,.1,'#c8c8d8',x,1.3,.03,{ol:false});box(g,.22,.5,.03,c,-.14,.8,.1,{ol:.01});box(g,.22,.5,.03,shade(c,.2),.14,.8,.1,{ol:.01});}},
  bathmat:{n:'Bath mat',i:'🛁',p:30,w:.8,d:.5,r4:1,flat:1,cols:['#7cc8ff','#ff9ec4','#ffffff','#5fd4b0'],b(g,c){box(g,.8,.03,.5,c,0,0,0,{ol:.015});for(let i=0;i<3;i++)box(g,.6,.032,.03,shade(c,.3),0,0,-.12+i*.12,{ol:false});}},
  laundry:{n:'Laundry basket',i:'🧺',p:35,w:.5,d:.5,r4:1,cols:['#e8c48a','#ffffff','#b79cff'],b(g,c){cyl(g,.22,.19,.5,c,0,0,0,{seg:14,ol:.012});cyl(g,.24,.24,.04,shade(c,-.1),0,.5,0,{seg:14,ol:false});sph(g,.12,'#7cc8ff',-.05,.52,.02,{s:[1,.5,1],ws:8,hs:6,ol:false});sph(g,.1,'#ff9ec4',.08,.54,-.04,{s:[1,.5,1],ws:8,hs:6,ol:false});}},
  /* kids' room */
  slide:{n:'Indoor slide',i:'🛝',p:220,w:1.6,d:.7,r4:1,cols:['#ff6b6b','#7cc8ff','#5fd4b0','#ffd45c'],b(g,c){box(g,.5,.9,.6,shade(c,.2),-.5,0,0);for(let i=0;i<4;i++)box(g,.4,.04,.1,'#ffffff',-.5,.1+i*.22,.25-i*.12,{ol:false});box(g,1.2,.06,.5,c,.3,.45,0,{rz:.62,center:true,ol:.012});for(const z of[-.23,.23])box(g,1.2,.1,.04,shade(c,-.15),.3,.5,z,{rz:.62,center:true,ol:false});}},
  playtent:{n:'Play tent',i:'⛺',p:150,w:1.2,d:1.2,r4:1,cols:['#ff9ec4','#7cc8ff','#ffd45c','#c9f2e3'],b(g,c){cone(g,.7,1.3,c,0,0,0,{seg:6,ol:.015});cone(g,.72,.45,shade(c,-.2),0,.9,0,{seg:6,ol:false});box(g,.3,.6,.1,'#2e2347',0,0,.57,{ol:false});for(const [x,y] of [[-.35,.4],[.35,.4],[0,.9]])sph(g,.06,'#ffd45c',x*.9,y,.6-y*.3,{ws:6,hs:5,ol:false});}},
  blocks:{n:'Building blocks',i:'🧱',p:40,w:.6,d:.6,r4:1,b(g){const C=['#ff6b6b','#ffd45c','#7cc8ff','#5fd4b0','#b79cff'];const B=[[0,0,0,.2],[.22,0,.05,.16],[-.2,0,-.12,.18],[0,.2,0,.16],[.1,.36,.02,.12],[-.22,.18,-.12,.1]];B.forEach(([x,y,z,s],i)=>box(g,s,s,s,C[i%5],x,y,z,{ol:.01}));}},
  toytrain:{n:'Toy train',i:'🚂',p:90,w:1.2,d:.8,r4:1,cols:['#ff6b6b','#7cc8ff','#5fd4b0'],b(g,c){const t=new THREE.Mesh(new THREE.TorusGeometry(.45,.03,6,24),mat('#9a6a43'));t.rotation.x=Math.PI/2;t.position.y=.02;g.add(t);for(let i=0;i<8;i++){const a=i/8*TAU;box(g,.12,.02,.04,'#c98f5e',Math.cos(a)*.45,.01,Math.sin(a)*.45,{ry:-a+Math.PI/2,ol:false});}
    box(g,.3,.2,.16,c,.45,.05,0,{ol:.01});box(g,.14,.14,.14,shade(c,-.2),.52,.25,0,{ol:.01});cyl(g,.03,.03,.1,'#2e2347',.36,.25,0,{seg:6,ol:false});box(g,.22,.14,.16,'#ffd45c',.12,.05,.44,{ry:-.4,ol:.01});box(g,.22,.14,.16,'#5fd4b0',-.3,.05,.34,{ry:-1.0,ol:.01});}},
  drumkit:{n:'Drum kit',i:'🥁',p:240,w:1.1,d:.9,r4:1,cols:['#ff6b6b','#7cc8ff','#ffd45c','#2e2347'],use:'piano',b(g,c){cyl(g,.26,.26,.4,c,0,.27,.0,{rx:Math.PI/2,center:true,seg:16,ol:.012});for(const [x,z,r,y] of [[-.4,-.1,.18,.45],[.4,-.1,.18,.45],[0,-.35,.14,.6]]){cyl(g,r,r,.16,c,x,y,z,{seg:14,ol:.01});cyl(g,r*1.02,r*1.02,.02,'#ffffff',x,y+.16,z,{seg:14,ol:false});cyl(g,.015,.015,y,'#c8c8d8',x,0,z,{seg:6,ol:false});}
    cyl(g,.22,.22,.02,'#ffd45c',-.5,.95,-.4,{seg:16,ol:.01});cyl(g,.012,.012,.95,'#c8c8d8',-.5,0,-.4,{seg:6,ol:false});cyl(g,.015,.015,.4,'#f6e2c8',.1,.62,.1,{rx:-1.2,center:true,seg:5,ol:false});}},
  chalkboard:{n:'Chalkboard',i:'🖍️',p:80,w:1.0,d:.4,r4:1,b(g){for(const x of[-.4,.4])box(g,.06,1.5,.06,WOOD,x,0,0,{rx:.12,ol:.012});box(g,1.0,.7,.04,'#2f5d4a',0,.6,0,{rx:.12,ol:.012});box(g,1.04,.04,.1,WOOD,0,.52,.06,{rx:.12,ol:false});for(const [x,y,w] of [[-.2,1.0,.3],[.1,.9,.2],[-.1,.75,.5]])box(g,w,.03,.01,'#ffffff',x,y,.03,{rx:.12,ol:false});sph(g,.04,'#ff9ec4',.3,1.05,.03,{ws:6,hs:5,ol:false});}},
  /* decorations */
  bigvase:{n:'Big vase',i:'🏺',p:60,w:.4,d:.4,r4:1,cols:['#7cc8ff','#ff9ec4','#ffffff','#2e2347'],b(g,c){cyl(g,.14,.1,.5,c,0,0,0,{seg:14,ol:.012});cyl(g,.09,.14,.2,c,0,.5,0,{seg:14,ol:.012});for(let i=0;i<3;i++){const a=i/3*TAU;cyl(g,.008,.008,.5,'#4fae5c',Math.cos(a)*.03,.6,Math.sin(a)*.03,{seg:4,ol:false});sph(g,.06,['#ff7aa8','#ffd45c','#b79cff'][i],Math.cos(a)*.06,1.12,Math.sin(a)*.06,{ws:8,hs:6,ol:.008});}}},
  candles:{n:'Candles',i:'🕯️',p:35,w:.4,d:.3,r4:1,b(g){box(g,.4,.04,.3,'#2e2347',0,0,0,{ol:.01});for(let i=0;i<3;i++){const x=-.12+i*.12,h=.18+(i%2)*.1;cyl(g,.03,.03,h,'#fff1b8',x,.04,0,{seg:8,ol:.008});cyl(g,.006,.006,.03,'#2e2347',x,.04+h,0,{seg:4,ol:false});const f=sph(g,.02,null,x,.08+h,0,{mat:toon({color:'#ffd45c',emissive:new THREE.Color('#ffb84d'),emissiveIntensity:.8}),ws:6,hs:5,ol:false});}}},
  photoframe:{n:'Photo frame',i:'🖼️',p:45,w:.5,d:.1,r4:1,hang:1,cols:[WOOD,'#ffffff','#ffd45c'],b(g,c){box(g,.5,.4,.04,c,0,1.3,0,{ol:.012});box(g,.42,.32,.01,'#bfe6ff',0,1.34,.025,{ol:false});sph(g,.06,'#ffd45c',-.1,1.55,.03,{ws:8,hs:6,ol:false});box(g,.3,.1,.01,'#5fbf74',0,1.36,.03,{ol:false});}},
  wallclock:{n:'Wall clock',i:'🕐',p:70,w:.5,d:.1,r4:1,hang:1,cols:['#ffffff','#ffd45c','#2e2347'],b(g,c){cyl(g,.22,.22,.05,c,0,1.6,0,{rx:Math.PI/2,center:true,seg:20,ol:.012});cyl(g,.19,.19,.01,'#ffffff',0,1.6,.03,{rx:Math.PI/2,center:true,seg:20,ol:false});box(g,.02,.13,.01,'#2e2347',0,1.66,.04,{ol:false});box(g,.1,.02,.01,'#2e2347',.05,1.6,.04,{ol:false});for(let i=0;i<12;i++){const a=i/12*TAU;box(g,.015,.03,.01,'#2e2347',Math.sin(a)*.16,1.6+Math.cos(a)*.16,.04,{ol:false});}}},
  bunting:{n:'Bunting',i:'🎉',p:50,w:2.0,d:.1,r4:1,hang:1,cols:['#ff6b6b','#7cc8ff','#ffd45c'],b(g,c){box(g,2.0,.012,.012,'#ffffff',0,2.2,.03,{ol:false});for(let i=0;i<8;i++){const x=-.88+i*.25,y=2.2-Math.sin(i/7*Math.PI)*.1;cone(g,.1,.22,i%2?c:shade(c,.4),x,y-.22,.03,{seg:3,rz:0,ol:.008});}}},
  snowglobe:{n:'Snow globe',i:'🔮',p:60,w:.3,d:.3,r4:1,b(g){cyl(g,.12,.13,.08,'#9a6a43',0,0,0,{seg:14,ol:.01});const gl=toon({color:'#dff4ff',transparent:true,opacity:.35});sph(g,.13,null,0,.21,0,{mat:gl,ws:14,hs:10,ol:false});cone(g,.06,.14,'#4fae64',0,.1,0,{seg:7,ol:false});box(g,.06,.05,.06,'#ff6b6b',.06,.08,.03,{ol:false});for(let i=0;i<6;i++)sph(g,.008,'#ffffff',Math.cos(i*1.1)*.08,.15+i*.02,Math.sin(i*1.1)*.08,{ws:4,hs:3,ol:false});}},
  cuckoo:{n:'Cuckoo clock',i:'🐦',p:160,w:.4,d:.3,r4:1,hang:1,b(g){box(g,.36,.5,.22,'#9a6a43',0,1.4,0,{ol:.012});prism(g,.5,.4,.3,'#6b4a2e',0,1.9,0,{ol:.012});cyl(g,.1,.1,.02,'#fff1b8',0,1.55,.12,{rx:Math.PI/2,center:true,seg:16,ol:false});box(g,.1,.1,.06,'#2e2347',0,1.75,.1,{ol:false});sph(g,.04,'#ffd45c',0,1.8,.14,{ws:6,hs:5,ol:false});for(const x of[-.08,.08]){cyl(g,.008,.008,.3,'#c8c8d8',x,1.1,.05,{seg:4,ol:false});cone(g,.03,.08,'#9a6a43',x,1.02,.05,{seg:6,ol:false});}}},
  poster:{n:'Poster',i:'🎨',p:40,w:.8,d:.1,r4:1,hang:1,cols:['#ffd45c','#7cc8ff','#ff9ec4','#5fd4b0'],b(g,c){box(g,.7,.9,.02,c,0,1.0,0,{ol:.012});sph(g,.14,'#ffffff',0,1.5,.015,{s:[1,1,.1],ws:12,hs:8,ol:false});box(g,.4,.08,.01,'#ffffff',0,1.2,.02,{ol:false});box(g,.3,.08,.01,'#ffffff',0,1.05,.02,{ol:false});}},
  /* outdoor */
  sunlounger:{n:'Sun lounger',i:'🏖️',p:120,w:.7,d:1.8,r4:1,cols:['#ffd45c','#7cc8ff','#ff9ec4','#5fd4b0'],use:'sit',b(g,c){box(g,.7,.1,1.2,c,0,.3,.3);box(g,.7,.7,.1,c,0,.3,-.4,{rx:-.6});for(const x of[-.3,.3])for(const z of[-.3,.7])box(g,.05,.3,.05,'#ffffff',x,0,z,{ol:.01});for(let i=0;i<4;i++)box(g,.7,.102,.1,'#ffffff',0,.3,-.2+i*.32,{ol:false});}},
  parasol:{n:'Parasol',i:'⛱️',p:110,w:1.6,d:1.6,r4:1,cols:['#ff6b6b','#7cc8ff','#ffd45c','#5fd4b0'],b(g,c){cyl(g,.25,.3,.1,'#c8c8d8',0,0,0,{seg:14});cyl(g,.025,.025,2.2,'#ffffff',0,.1,0,{seg:8,ol:.01});cone(g,.8,.4,c,0,1.9,0,{seg:8,ol:.015});for(let i=0;i<8;i+=2){const a=(i+.5)/8*TAU;box(g,.3,.02,.26,'#ffffff',Math.cos(a)*.42,1.98,Math.sin(a)*.42,{ry:-a,rz:.0,ol:false});}sph(g,.04,'#ffd45c',0,2.32,0,{ws:6,hs:5,ol:false});}},
  birdbath:{n:'Birdbath',i:'🐦',p:90,w:.7,d:.7,r4:1,b(g){cyl(g,.2,.25,.06,'#e8e2f0',0,0,0,{seg:14});cyl(g,.07,.1,.6,'#e8e2f0',0,.06,0,{seg:10,ol:.01});cyl(g,.35,.2,.14,'#e8e2f0',0,.66,0,{seg:16,ol:.012});cyl(g,.3,.3,.02,'#7cc8ff',0,.8,0,{seg:16,ol:false});sph(g,.06,'#ff9ec4',.18,.86,0,{ws:8,hs:6,ol:.01});cone(g,.02,.05,'#ffd45c',.24,.86,0,{rz:-Math.PI/2,center:true,seg:5,ol:false});}},
  bbq:{n:'Barbecue',i:'🍖',p:200,w:.9,d:.6,r4:1,use:'cook',b(g){box(g,.9,.3,.6,'#2e2347',0,.6,0,{ol:.012});box(g,.9,.04,.6,'#3d2c5e',0,.9,0,{ol:false});for(let i=0;i<6;i++)box(g,.8,.02,.02,'#c8c8d8',0,.92,-.25+i*.1,{ol:false});for(const x of[-.35,.35])for(const z of[-.2,.2])cyl(g,.02,.02,.6,'#c8c8d8',x,0,z,{seg:6,ol:false});box(g,.3,.06,.1,'#ff6b6b',-.2,.94,0,{ol:.01});box(g,.3,.06,.1,'#e88f6a',.2,.94,.1,{ol:.01});cyl(g,.03,.03,.3,WOOD,.55,.75,0,{rz:Math.PI/2,center:true,seg:6,ol:.008});}},
  flamingo:{n:'Garden flamingo',i:'🦩',p:45,w:.4,d:.4,r4:1,b(g){for(const z of[-.06,.06])cyl(g,.012,.012,.7,'#2e2347',0,0,z,{seg:5,ol:false});sph(g,.14,'#ff7aa8',0,.8,0,{s:[1.2,.8,1],ws:10,hs:8,ol:.01});cyl(g,.03,.035,.4,'#ff7aa8',.1,.88,0,{rz:-.3,seg:6,ol:.008});sph(g,.07,'#ff7aa8',.22,1.3,0,{ws:8,hs:6,ol:.01});cone(g,.025,.12,'#2e2347',.3,1.28,0,{rz:-1.4,center:true,seg:5,ol:false});sph(g,.015,'#ffffff',.25,1.33,.05,{ws:5,hs:4,ol:false});}},
  picnictable:{n:'Picnic table',i:'🧺',p:180,w:1.6,d:1.4,r4:1,use:'sit',b(g){box(g,1.6,.06,.7,WOOD,0,.72,0);for(const z of[-.6,.6])box(g,1.6,.05,.3,WOOD,0,.44,z);for(const x of[-.6,.6]){box(g,.06,.72,.06,WOOD2,x,0,.3,{rz:0,ol:.01});box(g,.06,.72,.06,WOOD2,x,0,-.3,{ol:.01});box(g,.06,.44,.06,WOOD2,x,0,.65,{ol:.01});box(g,.06,.44,.06,WOOD2,x,0,-.65,{ol:.01});}box(g,1.2,.02,.5,'#ff6b6b',0,.78,0,{ol:false});for(let i=0;i<3;i++)box(g,.2,.02,.2,'#ffffff',-.4+i*.4,.8,.0,{ol:false});}},
  /* 🪩 the disco pieces (job 17's dance game uses them) */
  discofloor:{n:'Disco floor',i:'🪩',p:350,w:2.4,d:2.4,r4:1,flat:1,b(g){const C=['#ff4d8d','#7cc8ff','#ffd45c','#5fd4b0','#b79cff','#ff8a6b'],M=C.map(c=>toon({color:c,emissive:new THREE.Color(c),emissiveIntensity:.3}));for(let i=0;i<6;i++)for(let j=0;j<6;j++){const m=box(g,.38,.03,.38,null,-1.0+i*.4,0,-1.0+j*.4,{mat:M[(i+j)%6],ol:false});m.userData.tile=(i+j)%6;}box(g,2.4,.02,2.4,'#2e2347',0,0,0,{ol:.015});}},
  discoball:{n:'Disco ball',i:'🪩',p:300,w:.9,d:.5,r4:1,use:'lamp',b(g){cyl(g,.2,.24,.05,'#2e2347',0,0,0,{seg:14});cyl(g,.025,.025,2.65,'#c8c8d8',0,.05,0,{seg:8,ol:.01});box(g,.6,.05,.05,'#c8c8d8',.28,2.65,0,{ol:.012});cyl(g,.016,.016,.18,'#6f6a88',.54,2.48,0,{seg:6,ol:.008});   /* (run 4 finish: a thicker arm with an outline and a dark string: the ball seemed to float) */
    const M=toon({map:discoTex(),emissive:new THREE.Color('#b9c6ff'),emissiveIntensity:.25});const b=sph(g,.36,null,.54,2.15,0,{mat:M,ws:18,hs:14,ol:.014});b.userData.shade=1;b.userData.ball=1;for(let i=0;i<14;i++){const a=i*2.4,y=2.15+Math.sin(i*1.7)*.22,r=Math.sqrt(Math.max(0,.1225-(y-2.15)*(y-2.15)));sph(g,.04,['#ff4d8d','#7cc8ff','#ffd45c','#5fd4b0'][i%4],.54+Math.cos(a)*r,y,Math.sin(a)*r,{ws:5,hs:4,ol:false});}   /* (run 4, stage 3: bigger and higher, above the dancers' heads) */}},
  xmastree:{n:'Holiday tree',i:'🎄',p:300,w:1.0,d:1.0,b(g){cyl(g,.06,.06,.3,'#8c6137',0,0,0,{seg:6});for(const [y,r,h] of [[.25,.5,.7],[.65,.4,.6],[1.0,.28,.5]])cone(g,r,h,'#4fae64',0,y,0,{seg:10});starOn(g,0,1.6,0,.12);for(let i=0;i<10;i++){const a=i*2.4,y=.35+i*.1,r=xmasProf(y)+.035;sph(g,.045,['#ff6b6b','#ffd45c','#7cc8ff','#ff9ec4'][i%4],Math.cos(a)*r,y,Math.sin(a)*r,{ws:6,hs:5,ol:false});}}},
  beanbag:{n:'Beanbag',i:'💺',p:100,w:.9,d:.9,cols:['#ff9ec4','#b79cff','#7cc8ff','#ffd45c','#5fd4b0'],use:'sit',b(g,c){sph(g,.45,c,0,.25,0,{s:[1,.6,1],ws:14,hs:10});sph(g,.3,c,0,.42,-.18,{s:[1.2,.8,.7],ws:12,hs:8});}},
  bunkbed:{n:'Bunk bed',i:'🛏️',p:450,w:1.2,d:2.1,cols:['#ff9ec4','#8fd3ff','#b79cff','#7fdcb5'],use:'sleep',b(g,c){for(const [x,z] of [[-.55,-1],[.55,-1],[-.55,1],[.55,1]])box(g,.08,1.8,.08,'#c98f5e',x,0,z,{ol:.012});for(const y of[.25,1.15]){box(g,1.1,.12,2.0,'#c98f5e',0,y,0);box(g,1.0,.15,1.9,'#ffffff',0,y+.12,0,{ol:.01});box(g,1.02,.08,1.3,c,0,y+.27,.3,{ol:.01});box(g,.5,.1,.3,'#ffffff',0,y+.27,-.75,{ol:.01});}for(let i=0;i<4;i++)box(g,.3,.04,.04,'#c98f5e',.42,.45+i*.25,1.05,{ol:false});}},
  bonsai:{n:'Bonsai tree',i:'🌳',p:90,w:.6,d:.6,b(g){box(g,.45,.15,.35,'#7cc8ff',0,0,0);cyl(g,.04,.06,.35,'#8c6137',0,.15,0,{rz:.3,seg:6});sph(g,.18,'#4fae64',.1,.5,0,{s:[1.3,.6,1],ws:10,hs:6});sph(g,.12,'#5fbf74',-.1,.42,.05,{s:[1.2,.6,1],ws:8,hs:6});}},
  fern:{n:'Fern',i:'🌿',p:45,w:.6,d:.6,b(g){cyl(g,.2,.16,.32,'#ff9ec4',0,0,0,{seg:12});for(let i=0;i<8;i++){const a=i/8*TAU;box(g,.06,.02,.42,'#4fae64',Math.cos(a)*.15,.4,Math.sin(a)*.15,{ry:-a+Math.PI/2,rx:.5,ol:.008});}}},
  lavender:{n:'Lavender',i:'💜',p:60,w:.6,d:.5,b(g){box(g,.5,.2,.3,'#ffffff',0,0,0);for(let i=0;i<7;i++){const x=-.18+i*.06;cyl(g,.01,.01,.3,'#5fae64',x,.2,0,{seg:4,ol:false});sph(g,.035,'#b79cff',x,.52,0,{s:[1,2,1],ws:6,hs:5,ol:.008});}}},
  unicorn:{n:'Unicorn plush',i:'🦄',p:90,w:.6,d:.5,cols:['#ffffff','#ffc9dc','#e6dbff'],b(g,c){sph(g,.22,c,0,.25,0,{s:[1.3,1,1],ws:12,hs:8});for(const [x,z] of [[-.15,-.1],[.15,-.1],[-.15,.1],[.15,.1]])box(g,.07,.15,.07,c,x,0,z,{ol:.01});sph(g,.14,c,.28,.45,0,{ws:10,hs:8});cone(g,.03,.16,'#ffd45c',.33,.58,0,{rz:-.4,seg:6,ol:.008});for(let i=0;i<4;i++)sph(g,.05,['#ff7aa8','#b79cff','#7cc8ff','#ffd45c'][i],.18-i*.08,.5-i*.02,0,{ws:6,hs:5,ol:false});}},
  castle:{n:'Toy castle',i:'🏰',p:160,w:.9,d:.7,cols:['#ffd6e0','#e6dbff','#c9f2e3'],b(g,c){box(g,.7,.5,.5,c,0,0,0);for(const [x,z] of [[-.38,-.28],[.38,-.28],[-.38,.28],[.38,.28]]){cyl(g,.1,.1,.7,c,x,0,z,{seg:10});cone(g,.13,.2,'#ff7aa8',x,.7,z,{seg:10,ol:.01});}box(g,.16,.24,.02,'#9b6b4a',0,0,.255,{ol:false});}},
  racecar:{n:'Race car toy',i:'🏎️',p:100,w:.7,d:.4,cols:['#ff6b6b','#5fa8ff','#ffd45c','#5fd4b0'],b(g,c){box(g,.6,.12,.3,c,0,.06,0);box(g,.25,.1,.22,c,-.02,.18,0);box(g,.12,.03,.32,'#2e2347',-.3,.2,0,{ol:false});for(const [x,z] of [[-.2,-.17],[.2,-.17],[-.2,.17],[.2,.17]])cyl(g,.06,.06,.05,'#2e2347',x,.06,z,{rx:Math.PI/2,center:true,seg:10,ol:false});}},
  rug:{n:'Round rug',i:'⭕',p:80,w:2.2,d:2.2,flat:1,cols:['#b79cff','#ff9ec4','#7fdcb5','#8fd3ff','#ffd45c'],b(g,c){cyl(g,1.1,1.1,.025,c,0,0,0,{seg:32,ol:.02});cyl(g,.72,.72,.03,shade(c,.1),0,0,0,{seg:32,ol:false});}},
  rugsq:{n:'Big rug',i:'🟪',p:100,w:2.4,d:1.6,flat:1,cols:['#b79cff','#ff9ec4','#7fdcb5','#8fd3ff','#ffd45c'],b(g,c){box(g,2.4,.025,1.6,c,0,0,0,{ol:.02});box(g,2,.03,1.2,shade(c,.1),0,0,0,{ol:false});}},
  fridge:{n:'Fridge',i:'🧊',p:250,w:.8,d:.7,kit:1,cols:['#f4f6fb','#ffc9dc','#bfe6ff','#c9f2e3'],use:'fridge',b(g,c){
    box(g,.8,1.8,.7,c,0,0,0);box(g,.76,.02,.02,INK,0,1.15,.355,{ol:false});box(g,.04,.3,.05,'#c8c8d8',.3,1.3,.37,{ol:.012});box(g,.04,.3,.05,'#c8c8d8',.3,.75,.37,{ol:.012});}},
  stove:{n:'Stove',i:'🍳',p:100,w:.8,d:.7,kit:1,use:'cook',b(g){
    box(g,.8,.9,.7,'#ffffff',0,0,0);box(g,.8,.04,.7,'#3d2c5e',0,.9,0,{ol:false});
    for(const x of[-.18,.18])for(const z of[-.15,.15])cyl(g,.11,.11,.02,'#6b6f8e',x,.94,z,{seg:12,ol:false});
    box(g,.6,.4,.02,'#3d2c5e',0,.25,.355,{ol:false});box(g,.5,.04,.05,'#c8c8d8',0,.72,.37,{ol:.012});}},
  bath:{n:'Bathtub',i:'🛁',p:300,w:1.8,d:.9,use:'bath',b(g){
    box(g,1.8,.55,.9,'#ffffff',0,.08,0);box(g,1.6,.04,.7,'#8fe0ff',0,.6,0,{ol:false});
    for(const x of[-.75,.75])for(const z of[-.32,.32])sph(g,.07,'#ffd45c',x,.07,z,{ol:.015});
    const r=seeded(3);for(let i=0;i<7;i++)sph(g,.08+r()*.06,'#ffffff',-.6+r()*1.2,.66,-.25+r()*.5,{ol:.012,ws:8,hs:6});
    cyl(g,.03,.03,.3,'#c8c8d8',-.82,.55,0,{seg:8,ol:.012});}},
  piano:{n:'Piano',i:'🎹',p:500,w:1.5,d:.6,cols:['#3d2c5e','#ffffff','#ff9ec4'],use:'piano',b(g,c){
    box(g,1.5,1.25,.45,c,0,0,-.075);box(g,1.5,.08,.3,c,0,.72,.18);box(g,1.36,.04,.18,'#ffffff',0,.8,.2,{ol:.012});
    for(let i=0;i<9;i++){if(i===2||i===6)continue;box(g,.05,.03,.1,INK,-.6+i*.15+.075,.84,.16,{ol:false});}
    box(g,.08,.72,.08,c,-.68,0,.25);box(g,.08,.72,.08,c,.68,0,.25);}},
  teddy:{n:'Teddy bear',i:'🧸',p:50,w:1.0,d:1.05,b(g){const C='#c98f5e',L='#f1d2a8';const t=new THREE.Group();t.scale.setScalar(1.7);g.add(t);
    // body (sitting, leaning back a touch)
    sph(t,.24,C,0,.3,0,{s:[1,1.05,1]});sph(t,.12,L,0,.26,.2,{ol:false});
    // head
    sph(t,.19,C,0,.62,.02);sph(t,.09,L,0,.58,.17,{ol:.012});
    sph(t,.08,C,-.15,.76,0);sph(t,.08,C,.15,.76,0);
    // eyes, nose
    box(t,.035,.05,.02,INK,-.07,.65,.205,{ol:false});box(t,.035,.05,.02,INK,.07,.65,.205,{ol:false});box(t,.06,.035,.025,INK,0,.6,.262,{ol:false});
    // legs stretched forward along +z, slightly apart
    for(const sx of[-.13,.13]){sph(t,.1,C,sx,.1,.24,{s:[1,.9,1.6]});sph(t,.08,L,sx,.1,.42,{ol:false});}
    // arms resting forward/down
    for(const sx of[-.26,.26]){sph(t,.085,C,sx,.3,.1,{s:[1,1.5,1]});}}},
  toybox:{n:'Toy box',i:'🎁',p:80,w:.9,d:.6,cols:['#ff7aa8','#7cc8ff','#ffd45c','#5fd4b0'],b(g,c){
    box(g,.9,.5,.6,c,0,0,0);box(g,.94,.08,.64,shade(c,-.08),0,.5,0);box(g,.1,.5,.62,'#ffffff',0,0,0,{ol:false});
    sph(g,.13,'#5fd4b0',.2,.71,0);box(g,.16,.16,.16,'#ffd45c',-.22,.58,.05,{ry:.4});}},
  petbed:{n:'Pet bed',i:'🐾',p:80,w:.9,d:.9,cols:['#ff9ec4','#8fd3ff','#ffd45c','#b79cff'],b(g,c){cyl(g,.45,.45,.2,c,0,0,0,{seg:20});cyl(g,.36,.36,.06,'#ffffff',0,.18,0,{seg:20,ol:false});}},
  tank:{n:'Fish tank',i:'🐠',p:1000,w:1.2,d:.5,b(g){
    box(g,1.2,.75,.5,WOOD,0,0,0);box(g,1.1,.6,.4,null,0,.75,0,{mat:WATER});box(g,1.14,.05,.44,'#3d2c5e',0,1.35,0,{ol:false});
    for(const [x,y,c] of [[-.25,.98,'#ff8a6b'],[.2,1.12,'#ffd45c'],[.05,.88,'#7cc8ff']])box(g,.14,.08,.05,c,x,y,0,{ol:.012});
    for(const x of[-.4,.35])cyl(g,.03,.03,.3,'#4fae5c',x,.78,0,{seg:5,ol:false});}},
  /* 🐚 shows your shell collection (the shells you pick up at the beach): one more shell on its boards as your collection grows, full at 25.
     Saved as a white Bookshelf with sh:1 (same size and price), so older versions simply show a bookshelf (see furnOf) */
  shellshelf:{n:'Shell shelf',i:'🐚',p:150,w:1.2,d:.45,use:'shells',b(g){const WH='#fbf3e6',SEA='#9fdcef';
    for(const x of[-.54,.54])for(const z of[-.17,.17])box(g,.06,.08,.06,WH,x,0,z,{ol:.012});
    box(g,1.16,1.27,.04,SEA,0,.08,-.205);for(const x of[-.575,.575])box(g,.05,1.27,.45,WH,x,.08,0);for(const y of[.08,.5,.92,1.3])box(g,1.2,.05,.45,WH,0,y,0);
    sph(g,.17,'#ffb3c7',0,1.49,-.02,{s:[1,.82,.36],ws:14,hs:10,ol:.014});for(const a of[-.5,-.25,0,.25,.5])box(g,.012,.17,.012,'#e88aa6',Math.sin(a)*.08,1.465,.045,{rz:-a,center:true,ol:false});box(g,.09,.05,.06,'#e88aa6',0,1.35,-.02,{ol:.01});   /* a big pink shell on top */
    const C=['#ffc2d6','#fff4ea','#ffd9b8','#e6dbff','#ffe27a','#bfe9ff'];
    SHELF_AT.forEach(([x,y],i)=>{const s=new THREE.Group(),c=C[(i*5+1)%6];s.position.set(x,y,.03);s.rotation.y=(i%3-1)*.25;s.userData.shl=i;g.add(s);
      if(i%3===0){sph(s,.075,c,0,.07,0,{s:[1,.85,.4],ws:10,hs:8,ol:.01});for(const a of[-.45,0,.45])box(s,.01,.1,.01,shade(c,-.14),Math.sin(a)*.03,.06,.03,{rz:-a,center:true,ol:false});box(s,.045,.025,.03,shade(c,-.1),0,0,0,{ol:.008});}
      else if(i%3===1){sph(s,.058,c,-.012,.058,0,{s:[1.1,1,1],ws:10,hs:8,ol:.01});cone(s,.046,.08,shade(c,-.08),.05,.085,0,{rz:-1.05,center:true,seg:8,ol:.01});sph(s,.03,'#ff9ec4',-.03,.045,.04,{s:[1,1.3,.6],ws:8,hs:6,ol:false});}   /* a conch */
      else{cone(s,.055,.13,c,0,.035,0,{seg:9,ol:.01});sph(s,.056,shade(c,-.06),0,.04,0,{s:[1,.62,1],ws:10,hs:6,ol:.01});for(const h of[.075,.11]){const rr=.055*(1-(h-.035)/.13);box(s,rr*1.6,.008,.012,shade(c,-.2),0,h,rr-.002,{ol:false});}}   /* a turban shell */
      bake(s,true);});
    shelfShow(g,S&&S.beach?S.beach.n|0:0);}},
  /* 🍳 kitchen cupboards (night 3, job 8): all 0.7 m deep like the stove and the fridge, in white, wood, pink, mint and sky */
  cupboard:{n:'Cupboard',i:'🗄️',p:90,w:.8,d:.7,kit:1,cols:['#fbf7ff','#c98f5e','#ffc9dc','#c9f2e3','#bfe6ff'],b(g,c){box(g,.8,.86,.7,c,0,0,0);box(g,.84,.05,.74,shade(c,-.08),0,.86,0,{ol:.012});for(const s of[-1,1]){box(g,.34,.7,.02,shade(c,.05),s*.19,.08,.355,{ol:.01});sph(g,.028,'#ffd45c',s*.06,.45,.37,{ws:6,hs:5,ol:false});}}},
  cupboardn:{n:'Narrow cupboard',i:'🗄️',p:60,w:.4,d:.7,kit:1,cols:['#fbf7ff','#c98f5e','#ffc9dc','#c9f2e3','#bfe6ff'],b(g,c){box(g,.4,.86,.7,c,0,0,0);box(g,.44,.05,.74,shade(c,-.08),0,.86,0,{ol:.012});box(g,.32,.7,.02,shade(c,.05),0,.08,.355,{ol:.01});sph(g,.028,'#ffd45c',.1,.45,.37,{ws:6,hs:5,ol:false});}},
  drawers:{n:'Drawers',i:'🗃️',p:100,w:.8,d:.7,kit:1,cols:['#fbf7ff','#c98f5e','#ffc9dc','#c9f2e3','#bfe6ff'],b(g,c){box(g,.8,.86,.7,c,0,0,0);box(g,.84,.05,.74,shade(c,-.08),0,.86,0,{ol:.012});for(let i=0;i<3;i++){box(g,.7,.22,.02,shade(c,.05),0,.06+i*.27,.355,{ol:.01});box(g,.2,.03,.03,'#c8c8d8',0,.16+i*.27,.37,{ol:false});}}},
  cornercup:{n:'Corner cupboard',i:'🗄️',p:110,w:.7,d:.7,kit:1,cols:['#fbf7ff','#c98f5e','#ffc9dc','#c9f2e3','#bfe6ff'],b(g,c){box(g,.7,.86,.7,c,0,0,0);box(g,.74,.05,.74,shade(c,-.08),0,.86,0,{ol:.012});box(g,.5,.7,.02,shade(c,.05),.08,.08,.355,{ol:.01});box(g,.02,.7,.5,shade(c,.05),.355,.08,-.08,{ol:.01});sph(g,.028,'#ffd45c',-.1,.45,.37,{ws:6,hs:5,ol:false});sph(g,.028,'#ffd45c',.37,.45,.1,{ws:6,hs:5,ol:false});}},
  tallcup:{n:'Tall cupboard',i:'🚪',p:150,w:.8,d:.7,kit:1,cols:['#fbf7ff','#c98f5e','#ffc9dc','#c9f2e3','#bfe6ff'],b(g,c){box(g,.8,2.0,.7,c,0,0,0);box(g,.84,.06,.74,shade(c,-.08),0,2.0,0,{ol:.012});for(const s of[-1,1]){box(g,.34,1.0,.02,shade(c,.05),s*.19,.95,.355,{ol:.01});box(g,.34,.78,.02,shade(c,.05),s*.19,.1,.355,{ol:.01});sph(g,.028,'#ffd45c',s*.06,1.4,.37,{ws:6,hs:5,ol:false});sph(g,.028,'#ffd45c',s*.06,.5,.37,{ws:6,hs:5,ol:false});}}},
  wallcup:{n:'Wall cupboard',i:'🗄️',p:80,w:.8,d:.35,kit:1,hang:1,cols:['#fbf7ff','#c98f5e','#ffc9dc','#c9f2e3','#bfe6ff'],b(g,c){box(g,.8,.6,.35,c,0,1.45,0);box(g,.84,.04,.37,shade(c,-.08),0,2.05,0,{ol:.01});for(const s of[-1,1]){box(g,.34,.48,.02,shade(c,.05),s*.19,1.51,.18,{ol:.01});sph(g,.025,'#ffd45c',s*.06,1.6,.19,{ws:6,hs:5,ol:false});}}},
};
const SHELF_AT=[.55,.97,.13].flatMap(y=>[-.42,-.14,.14,.42].map(x=>[x,y])),SHELF_T=[1,2,3,4,5,6,8,10,13,16,20,25];
function shelfShow(g,n){g.traverse(o=>{if(o.userData.shl!==undefined)o.visible=n>=SHELF_T[o.userData.shl];});}
function goldify(g){g.traverse(o=>{if(!o.isMesh||!o.material||o.material===OL||o.material===OLP||!o.material.color)return;const h={};o.material.color.getHSL(h);if(h.l<.18)return;o.material=mat(shade('#ffc93c',(h.l-.55)*.7));});}
function sparkles(g,h){for(const [x,y,z,s] of [[.28,h*.9,.18,1],[-.3,h*.6,.1,.8],[.1,h*1.1,-.2,.7],[-.15,h*.3,.3,.6]]){const m=new THREE.Mesh(new THREE.OctahedronGeometry(.045*s,0),mat('#fffbe6'));m.scale.set(.55,1.5,.55);m.position.set(x,y,z);g.add(m);}}
Object.assign(FURN,{
  gteddy:{n:'Golden teddy',i:'🧸',p:200,w:1.0,d:1.05,gold:1,b(g){FURN.teddy.b(g);goldify(g);sparkles(g,1.2);}},
  gunicorn:{n:'Golden unicorn',i:'🦄',p:200,w:.6,d:.5,gold:1,b(g){FURN.unicorn.b(g,'#ffcf40');sparkles(g,.75);}},
  gtrophy:{n:'Golden trophy',i:'🏆',p:250,w:.6,d:.6,gold:1,b(g){const G='#ffc93c',D='#e0a92a';box(g,.44,.12,.44,'#3d2c5e',0,0,0);box(g,.36,.08,.36,'#ffffff',0,.12,0,{ol:.01});cyl(g,.05,.075,.22,G,0,.2,0,{seg:10});
    cyl(g,.25,.13,.34,G,0,.42,0,{seg:18});cyl(g,.255,.255,.035,D,0,.74,0,{seg:18,ol:false});
    for(const s of[-1,1]){const t=new THREE.Mesh(new THREE.TorusGeometry(.1,.026,6,14,Math.PI),mat(G));t.position.set(s*.25,.6,0);t.rotation.z=s*-Math.PI/2;g.add(t);}
    sph(g,.055,'#ffffff',0,.56,.205,{s:[1,1,.35],ws:8,hs:6,ol:false});sparkles(g,.8);}},
  gstar:{n:'Golden star lamp',i:'🌟',p:220,w:.5,d:.5,gold:1,b(g){cyl(g,.18,.22,.06,'#ffc93c',0,0,0,{seg:14});cyl(g,.025,.025,1.3,'#e0a92a',0,.06,0,{seg:8});
    const sh=new THREE.Shape();for(let i=0;i<10;i++){const a=i/10*TAU+Math.PI/2,r=i%2?.11:.26;if(i)sh.lineTo(Math.cos(a)*r,Math.sin(a)*r);else sh.moveTo(Math.cos(a)*r,Math.sin(a)*r);}
    const geo=new THREE.ExtrudeGeometry(sh,{depth:.07,bevelEnabled:true,bevelSize:.015,bevelThickness:.015,bevelSegments:1});geo.translate(0,0,-.035);
    const st=new THREE.Mesh(geo,toon({color:'#ffd45c',emissive:new THREE.Color('#ffb800'),emissiveIntensity:.55}));st.position.y=1.55;g.add(st);sparkles(g,1.3);}}});
const BUY_FURN=['bed','bunkbed','sofa','armchair','beanbag','chair','table','desk','computer','shelf','shellshelf','dresser','wardrobe','mirror','tv','gaming','lamp','clock','easel','fireplace','rug','rugsq','fridge','stove','sink','cupboard','cupboardn','drawers','cornercup','tallcup','wallcup','washer','bath','piano','xmastree','teddy','toybox','petbed','tank',
  'canopybed','daybed','crib','carbed','cornersofa','loveseat','stool','barstool','rocking','eggchair','woodbench','pouf','coffeetable','sidetable','diningtable','roundtable','nightstand','vanity','floorlamp','tablelamp','starlamp','neon','lantern','rughearts','rugstripe','rugstar','doormat','palm','monstera','orchid','herbs','bamboo','hangplant','cubeshelf','cornershelf','chest','coatrack','shoerack','laddershelf','island','oven','dishwasher','coffeecorner','trolley','spicerack','shower','toilet','towelrack','bathmat','laundry','slide','playtent','blocks','toytrain','drumkit','chalkboard','bigvase','candles','photoframe','wallclock','bunting','snowglobe','cuckoo','poster','sunlounger','parasol','birdbath','bbq','flamingo','picnictable','discofloor','discoball'];
const FLOWER_SHOP=['flowers','tulips','rosebush','sunflower','lavender','fern','bonsai','plant','cactus'];
function drawCatTV(x,t,on){const W=216,H=120,k=x.canvas.width/W;x.setTransform(k,0,0,k,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';
  if(!on){x.fillStyle='#20263d';x.fillRect(0,0,W,H);x.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<H;i+=4)x.fillRect(0,i,W,2);
    x.fillStyle='rgba(255,255,255,.07)';x.beginPath();x.ellipse(64,30,58,20,-.3,0,7);x.fill();return;}
  const PI=Math.PI,B=t*2.2,bi=Math.floor(B),ph=B-bi,mv=Math.floor(B/8)%5,mp=(B%8)/8,dn=Math.pow(1-ph,3);
  const O='#2b2233',OR='#f6a94b',ST='#d9822b',CR='#ffe3b8',PK='#ff7aa2';
  // pose
  const q={ox:0,jy:0,sx:1,sq:1-.07*dn,hip:0,hx:0,hy:0,ht:0,lh:[-26,-62],rh:[26,-62],eyes:'open',mouth:'w',lf:0,rf:0,back:false,tuck:0};
  if(mv===0){const s=Math.sin(B*PI);q.ox=Math.sin(B*PI/2)*14;q.ht=Math.sin(B*PI/2)*.15;q.lh=[-27,-64-9*s];q.rh=[27,-64+9*s];q.lf=Math.max(0,s)*4;q.rf=Math.max(0,-s)*4;}
  else if(mv===1){q.eyes='happy';q.hy=6*dn;q.ht=(bi%2?1:-1)*.2*dn;q.hip=Math.sin(B*PI)*3;q.lh=[-21,-28];q.rh=[21,-28];q.el=1;}
  else if(mv===2){const s=Math.sin(B*PI);q.lh=[s*25,-21];q.rh=[s*25+4,-23];q.hip=-s*5;q.hx=-q.hip*.4;q.mouth='o';}
  else if(mv===3){const a=mp*PI*4;q.sx=Math.cos(a);if(Math.abs(q.sx)<.08)q.sx=q.sx<0?-.08:.08;q.back=Math.cos(a)<0;q.lh=[-31,-47];q.rh=[31,-47];const s=Math.sin(B*PI);q.lf=Math.max(0,s)*3;q.rf=Math.max(0,-s)*3;}
  else{const j=Math.sin(ph*PI);q.jy=j*10;q.sq=1-.13*Math.max(0,1-ph*6);q.lh=[-22,-58-14*j];q.rh=[22,-58-14*j];q.tuck=j*5;q.mouth='o';}
  if(q.eyes==='open'&&(t%3.1)<.13)q.eyes='blink';
  const cx=108+q.ox,fy=96;
  // background
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#24124f');g.addColorStop(.68,'#6c2a96');g.addColorStop(1,'#2a1347');x.fillStyle=g;x.fillRect(0,0,W,H);
  // dance floor (perspective tiles that flash to the beat)
  const VX=108,VY=36,rows=[83,90,100,120];
  for(let r=0;r<3;r++)for(let i=-6;i<6;i++){const y0=rows[r],y1=rows[r+1],f0=(y0-VY)/(120-VY),f1=(y1-VY)/(120-VY),X0=i*24,X1=(i+1)*24;
    const hh=((i+r+bi)%6+6)%6*60,lit=((i+r+bi)%2+2)%2;x.fillStyle='hsl('+hh+',85%,'+(lit?60:38)+'%)';
    x.beginPath();x.moveTo(VX+X0*f0,y0);x.lineTo(VX+X1*f0,y0);x.lineTo(VX+X1*f1,y1);x.lineTo(VX+X0*f1,y1);x.closePath();x.fill();
    x.strokeStyle='rgba(20,8,40,.45)';x.lineWidth=.8;x.stroke();}
  // light beams from the disco ball
  x.globalCompositeOperation='lighter';
  for(let i=0;i<3;i++){const a=.75+Math.sin(t*.9+i*2.1)*.55;x.fillStyle=['rgba(255,90,170,.16)','rgba(90,220,255,.16)','rgba(255,230,90,.16)'][i];
    x.beginPath();x.moveTo(30,13);x.lineTo(30+Math.cos(a-.1)*260,13+Math.sin(a-.1)*260);x.lineTo(30+Math.cos(a+.1)*260,13+Math.sin(a+.1)*260);x.closePath();x.fill();}
  // spotlight on the cat
  x.fillStyle='rgba(255,250,220,.10)';x.beginPath();x.moveTo(cx-9,0);x.lineTo(cx+9,0);x.lineTo(cx+36,fy+2);x.lineTo(cx-36,fy+2);x.closePath();x.fill();
  x.fillStyle='rgba(255,250,220,.22)';x.beginPath();x.ellipse(cx,fy+1,36,6,0,0,7);x.fill();
  x.globalCompositeOperation='source-over';
  // disco ball
  x.strokeStyle='#c9c3dc';x.lineWidth=1;x.beginPath();x.moveTo(30,0);x.lineTo(30,5);x.stroke();
  const bg=x.createRadialGradient(27,10,1,30,13,9);bg.addColorStop(0,'#ffffff');bg.addColorStop(1,'#8f88aa');x.fillStyle=bg;x.beginPath();x.arc(30,13,8,0,7);x.fill();
  x.strokeStyle='rgba(60,50,90,.5)';x.lineWidth=.6;x.beginPath();for(let i=-2;i<=2;i++){x.moveTo(22,13+i*3);x.lineTo(38,13+i*3);x.moveTo(30+i*3,5);x.lineTo(30+i*3,21);}x.stroke();
  if(ph<.5){x.fillStyle='#fff';const sx=[25,34,28,33][bi%4],sy=[10,9,16,15][bi%4];x.fillRect(sx-.5,sy-2.5,1,5);x.fillRect(sx-2.5,sy-.5,5,1);}
  // shadow
  x.fillStyle='rgba(20,5,40,.35)';x.beginPath();x.ellipse(cx,fy+.5,17*(1-q.jy/40),3.2,0,0,7);x.fill();
  // ---- the cat ----
  const limb=(pts,w)=>{x.lineCap='round';x.lineJoin='round';for(const [c,lw] of [[O,w+3],[OR,w]]){x.strokeStyle=c;x.lineWidth=lw;x.beginPath();x.moveTo(pts[0][0],pts[0][1]);if(pts.length===3)x.quadraticCurveTo(pts[1][0],pts[1][1],pts[2][0],pts[2][1]);else x.lineTo(pts[1][0],pts[1][1]);x.stroke();}};
  const blob=(ex,ey,rx,ry,c)=>{x.fillStyle=c;x.strokeStyle=O;x.lineWidth=2.2;x.beginPath();x.ellipse(ex,ey,rx,ry,0,0,7);x.fill();x.stroke();};
  x.save();x.translate(cx,fy-q.jy);x.scale(q.sx*(1+(1-q.sq)*.7)*.92,q.sq*.92);
  const w=Math.sin(t*7);
  const tail=()=>q.back?limb([[0,-24],[w*14,-34],[w*9,-52]],5):limb([[11,-22],[31,-25+w*5],[28+w*5,-47]],5);
  if(!q.back)tail();
  // legs + feet
  for(const sd of[-1,1]){const lift=(sd<0?q.lf:q.rf)+q.tuck;limb([[sd*7+q.hip*.5,-14],[sd*9,-3-lift]],7);blob(sd*10.5,-2.5-lift,5.5,3.2,OR);}
  // body
  x.save();x.translate(q.hip,0);
  blob(0,-30,16,18,OR);
  if(!q.back){x.fillStyle=CR;x.beginPath();x.ellipse(0,-27,9.5,11,0,0,7);x.fill();}
  else{x.strokeStyle=ST;x.lineWidth=2;x.beginPath();for(const yy of[-40,-33,-26]){x.moveTo(-8,yy);x.quadraticCurveTo(0,yy+3,8,yy);}x.stroke();}
  if(q.back)tail();
  // arms
  for(const sd of[-1,1]){const h=sd<0?q.lh:q.rh,sh=[sd*12,-42];
    if(q.el)limb([sh,[sd*29,-38],[h[0]-q.hip,h[1]]],6);else limb([sh,[h[0]-q.hip,h[1]]],6);
    blob(h[0]-q.hip,h[1],3.8,3.8,OR);}
  // head
  x.save();x.translate(q.hx,-56+q.hy);x.rotate(q.ht);
  for(const sd of[-1,1]){const P=[[sd*18,-4],[sd*15,-26],[sd*3,-14]];x.fillStyle=OR;x.strokeStyle=O;x.lineWidth=2.2;x.lineJoin='round';
    x.beginPath();x.moveTo(P[0][0],P[0][1]);x.lineTo(P[1][0],P[1][1]);x.lineTo(P[2][0],P[2][1]);x.closePath();x.fill();x.stroke();
    if(!q.back){const C=[(P[0][0]+P[1][0]+P[2][0])/3,(P[0][1]+P[1][1]+P[2][1])/3+1.5];x.fillStyle=PK;x.beginPath();for(let i=0;i<3;i++){const px=C[0]+(P[i][0]-C[0])*.5,py=C[1]+(P[i][1]-C[1])*.5;i?x.lineTo(px,py):x.moveTo(px,py);}x.closePath();x.fill();}}
  blob(0,0,19,16,OR);
  x.strokeStyle=ST;x.lineWidth=1.8;x.lineCap='round';x.beginPath();x.moveTo(-5,-15);x.lineTo(-4,-10);x.moveTo(0,-16);x.lineTo(0,-11);x.moveTo(5,-15);x.lineTo(4,-10);x.stroke();
  if(!q.back){
    x.fillStyle='rgba(255,122,162,.45)';x.beginPath();x.arc(-12.5,5,3.2,0,7);x.arc(12.5,5,3.2,0,7);x.fill();
    x.strokeStyle=O;x.fillStyle=O;x.lineWidth=1.8;
    for(const sd of[-1,1]){const ex=sd*7;
      if(q.eyes==='open'){x.fillStyle=O;x.beginPath();x.ellipse(ex,-1,2.8,3.6,0,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(ex+1,-2.3,1.05,0,7);x.fill();}
      else if(q.eyes==='happy'){x.beginPath();x.moveTo(ex-3.5,.5);x.lineTo(ex,-3);x.lineTo(ex+3.5,.5);x.stroke();}
      else{x.beginPath();x.moveTo(ex-3.2,-1);x.lineTo(ex+3.2,-1);x.stroke();}}
    x.fillStyle=PK;x.beginPath();x.moveTo(-2.2,3.6);x.lineTo(2.2,3.6);x.lineTo(0,5.8);x.closePath();x.fill();
    x.strokeStyle=O;x.lineWidth=1.3;
    if(q.mouth==='o'){x.fillStyle='#5a1f3a';x.beginPath();x.ellipse(0,8.6,3.4,3,0,0,7);x.fill();x.fillStyle=PK;x.beginPath();x.ellipse(0,10,2.1,1.3,0,0,7);x.fill();}
    else{x.beginPath();x.arc(-2.1,6,2.1,0,PI);x.moveTo(4.2,6);x.arc(2.1,6,2.1,0,PI);x.stroke();}
    x.lineWidth=.9;x.beginPath();for(const sd of[-1,1]){x.moveTo(sd*12,3.5);x.lineTo(sd*24,1.5);x.moveTo(sd*12,5.8);x.lineTo(sd*24,7.5);}x.stroke();}
  x.restore();x.restore();x.restore();
  // floating music notes
  x.font='700 12px "Baloo 2","Trebuchet MS",sans-serif';x.textAlign='center';
  for(let i=0;i<4;i++){const p=(t*.45+i*.25)%1,nx=cx+(i%2?40:-40)+Math.sin(p*6+i)*5,ny=82-p*62;x.fillStyle='rgba(255,255,255,'+(1-p).toFixed(2)+')';x.fillText(i%2?'\u266b':'\u266a',nx,ny);}
  // LIVE badge
  x.fillStyle='rgba(0,0,0,.45)';x.beginPath();if(x.roundRect)x.roundRect(176,4,34,12,3);else x.rect(176,4,34,12);x.fill();
  if(ph<.6){x.fillStyle='#ff3b5c';x.beginPath();x.arc(183,10,2.8,0,7);x.fill();}
  x.fillStyle='#fff';x.font='800 8px "Baloo 2","Trebuchet MS",sans-serif';x.textAlign='left';x.fillText('LIVE',188,13.2);
  // meme caption
  const cap=['HANDS UP!','VIBE CHECK','THE FLOSS!','SPIN!','JUMP JUMP!'][mv],pop=1+.35*Math.max(0,1-mp*8);
  x.save();x.translate(108,113);x.scale(pop,pop);x.font='800 14px "Baloo 2","Trebuchet MS",sans-serif';x.textAlign='center';x.lineJoin='round';
  x.lineWidth=3.2;x.strokeStyle='#1d1430';x.strokeText(cap,0,0);x.fillStyle='#fff';x.fillText(cap,0,0);x.restore();
}
function buildFurn(t,c){const g=new THREE.Group();const F=FURN[t];F.b(g,c||(F.cols?F.cols[0]:null));return g;}
const SEEDS={carrot:{n:'Carrot',i:'🥕',p:5,h:3,yield:['carrot',2],pl:'carrots',rd:'carrots are'},tomato:{n:'Tomato',i:'🍅',p:6,h:4,yield:['tomato',3],pl:'tomatoes',rd:'tomatoes are'},
  strawberry:{n:'Strawberry',i:'🍓',p:8,h:4,yield:['strawberry',3],pl:'strawberries',rd:'strawberries are'},pumpkin:{n:'Pumpkin',i:'🎃',p:12,h:6,yield:['pumpkin',1],pl:'pumpkin',rd:'pumpkin is'},
  sunflower:{n:'Sunflower',i:'🌻',p:8,h:5,furn:'sunflower',pl:'sunflowers',rd:'sunflowers are'},tulip:{n:'Tulip',i:'🌷',p:6,h:3,furn:'tulips',pl:'tulips',rd:'tulips are'}};
const SHOPS={
  market:{title:'Market',items:['apple','banana','orange','grapes','cherries','watermelon','corn','bread','milk','cheese','eggs','flour','chocolate','lemon','honey','popcorn','candy','pizza','cake','icecream','sushi','riceball','noodles','dumplings','lollipop','pudding']},
  pizza:{title:'Pizzeria',items:['pizza','slice','garlic']},
  bakery:{title:'Bakery',items:['croissant','bread','bagel','pretzel','pie','cake','cookie','donut','muffin']},
  icecream:{title:'Ice Cream Shop',items:['icecream','sundae','popsicle','milkshake','icecake']},
  toys:{title:'Toy Store',furn:['teddy','unicorn','toybox','rockinghorse','dollhouse','castle','racecar','robot']},
  cafe:{title:'Café',items:['cocoa','cookie','muffin','donut','cake']},
  pets:{title:'Pet Shop',items:['petfood','catfood','bunnyfood','treat','ball','frisbee','yarn','mouse','squeaky','bow','hat','collar','scarf','pcrown','shades','tophat','flowerc','pflower','bowtie','hglasses','monocle','cape','wings','bpack'],furn:['petbed','petbowl','cattree','doghouse']},
  flowers:{title:'Flower Shop',furn:FLOWER_SHOP},
  seeds:{title:'Seed box',items:Object.keys(SEEDS).map(k=>'seed_'+k)},
  beach:{title:'Beach kiosk',items:['popsicle','icecream','coconut','watermelon']},
  truck:{title:'Food truck',items:['burger','fries','hotdog','taco']},
};
function tree(g,x,z,s=1){TREES.push([x,z,s,g]);const c=pick(TREE_COLS);   /* 🍂 the season's colours (job 11) */
  cyl(g,.15*s,.2*s,2.3*s,'#9b6b4a',x,0,z,{seg:8});sph(g,1.15*s,c,x,3.05*s,z,{ws:12,hs:9});sph(g,.75*s,c,x+.7*s,2.75*s,z+.15*s,{ws:10,hs:8});sph(g,.72*s,c,x-.62*s,2.8*s,z-.3*s,{ws:10,hs:8});sph(g,.62*s,c,x+.1*s,3.6*s,z+.4*s,{ws:10,hs:8});}
function pine(g,x,z,s=1){cyl(g,.14*s,.18*s,.8*s,'#9b6b4a',x,0,z,{seg:8});const c=pick(PINE_COLS);cone(g,1.2*s,1.6*s,c,x,.7*s,z,{seg:9});cone(g,.92*s,1.4*s,c,x,1.55*s,z,{seg:9});cone(g,.62*s,1.2*s,c,x,2.35*s,z,{seg:9});}
function lampPost(g,x,z){LAMPXZ.push([x,z]);cyl(g,.07,.1,3,'#5a5f8c',x,0,z,{seg:8});cyl(g,.16,.16,.08,'#5a5f8c',x,2.95,z,{seg:10});sph(g,.19,null,x,3.21,z,{mat:LAMP,ol:.02,ws:12,hs:8});cone(g,.27,.24,'#5a5f8c',x,3.33,z,{seg:10});}
function bench(g,x,z,ry=0){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);box(p,1.6,.08,.5,'#e0905e',0,.42,0);box(p,1.6,.36,.07,'#e0905e',0,.58,-.22);for(const sx of[-.7,.7]){box(p,.08,.42,.08,'#5a5f8c',sx,0,.15);box(p,.08,.95,.08,'#5a5f8c',sx,0,-.2);}
  if(BENCH_L&&!BENCH_SKIP)benchReg(BENCH_L,p,BENCH_SKIP<0);return p;}
function bin(g,x,z){cyl(g,.25,.22,.75,'#5fd4b0',x,0,z,{seg:12});cyl(g,.28,.28,.07,'#3fb08f',x,.75,z,{seg:12});}
function hydrant(g,x,z){cyl(g,.13,.15,.5,'#ff6b6b',x,0,z,{seg:10});sph(g,.13,'#ff6b6b',x,.52,z,{ws:10,hs:6});box(g,.36,.08,.08,'#ff6b6b',x,.3,z);}
function car(g,x,z,ry,c){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);
  box(p,1.7,.62,3.4,c,0,.3,0);box(p,1.5,.6,1.9,shade(c,.08),0,.92,-.15);box(p,1.53,.4,1.6,'#a9dcff',0,1.0,-.15,{ol:false});
  for(const sx of[-.78,.78])for(const sz of[-1.1,1.1])cyl(p,.32,.32,.24,'#3d3550',sx,.32,sz,{rz:Math.PI/2,center:true,seg:14});
  for(const sx of[-.55,.55]){box(p,.3,.14,.04,'#fff6d6',sx,.62,1.7,{ol:.012});box(p,.3,.12,.04,'#ff6b6b',sx,.64,-1.7,{ol:.012});}}
function ironFence(g,x1,z1,x2,z2,L){const len=Math.hypot(x2-x1,z2-z1),ang=Math.atan2(x2-x1,z2-z1),C='#3c6b58';
  const np=Math.max(1,Math.round(len/2.4));for(let i=0;i<=np;i++){const t=i/np,x=x1+(x2-x1)*t,z=z1+(z2-z1)*t;box(g,.14,1.25,.14,C,x,0,z,{ol:.02});sph(g,.09,'#ffd45c',x,1.33,z,{ws:8,hs:6,ol:.012});}
  const p=new THREE.Group();p.position.set((x1+x2)/2,0,(z1+z2)/2);p.rotation.y=ang;g.add(p);
  for(const y of[.18,1.0])box(p,.06,.07,len,C,0,y,0,{ol:.012});
  const nb=Math.round(len/.32);for(let i=1;i<nb;i++)box(p,.04,.9,.04,C,0,.15,-len/2+i*len/nb,{ol:.008});
  if(L)col(L,Math.min(x1,x2)-.1,Math.min(z1,z2)-.1,Math.max(x1,x2)+.1,Math.max(z1,z2)+.1);}
function bldAt(g,x,z,rot,o){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=rot;g.add(p);building(p,Object.assign({},o,{x:0,z:0,face:1}));return p;}
function hedge(g,x1,z1,x2,z2,L){box(g,Math.abs(x2-x1),1.05,Math.abs(z2-z1),'#5fbf74',(x1+x2)/2,0,(z1+z2)/2,{ol:.04});if(L)col(L,x1,z1,x2,z2);}
function fence(g,x1,z1,x2,z2,L,c='#ffffff'){const len=Math.hypot(x2-x1,z2-z1),n=Math.max(1,Math.round(len/.9)),ang=Math.atan2(x2-x1,z2-z1);
  for(let i=0;i<=n;i++){const t=i/n;box(g,.1,.85,.1,c,x1+(x2-x1)*t,0,z1+(z2-z1)*t,{ol:.02});}
  for(const y of[.32,.62]){const p=new THREE.Group();p.position.set((x1+x2)/2,y,(z1+z2)/2);p.rotation.y=ang;g.add(p);box(p,.05,.1,len,c,0,0,0,{ol:.02});}
  if(L)col(L,Math.min(x1,x2)-.08,Math.min(z1,z2)-.08,Math.max(x1,x2)+.08,Math.max(z1,z2)+.08);}
function flowerBed(g,x,z,w,d){box(g,w,.22,d,'#9b6b4a',x,0,z,{ol:.02});const r=seeded(Math.round(x*7+z*13));const n=Math.round(w*d*5),Q=[];for(let i=0;i<n;i++){const fx=x-w/2+.15+r()*(w-.3),fz=z-d/2+.15+r()*(d-.3);if(Q.some(q=>Math.hypot(q[0]-fx,q[1]-fz)<.2))continue;Q.push([fx,fz]);   /* no two flowers inside each other (run 4, job 6) */cyl(g,.015,.015,.2,'#4fae5c',fx,.22,fz,{seg:4,ol:false});sph(g,.08,['#ff7aa8','#ffd45c','#ffffff','#b79cff','#ff8a6b'][(r()*5)|0],fx,.46,fz,{ws:8,hs:6,ol:.015});}}
function trafficLight(g,x,z,ry){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);cyl(p,.07,.08,3,'#5a5f8c',0,0,0,{seg:8});box(p,.36,.95,.3,'#3d3550',0,2.55,0);
  sph(p,.11,null,0,3.28,.14,{mat:new THREE.MeshBasicMaterial({color:'#7a3b48'}),ol:false});sph(p,.11,null,0,2.98,.14,{mat:new THREE.MeshBasicMaterial({color:'#7a6a3b'}),ol:false});sph(p,.11,null,0,2.68,.14,{mat:new THREE.MeshBasicMaterial({color:'#5dff9c'}),ol:false});}
function mailbox(g,x,z,ry){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);box(p,.1,1,.1,'#9b6b4a',0,0,0);box(p,.34,.3,.5,'#7cc8ff',0,1,0);cyl(p,.17,.17,.5,'#7cc8ff',0,1.3,0,{rx:Math.PI/2,center:true,seg:14});box(p,.04,.3,.1,'#ff6b6b',.2,1.15,.1,{ol:.015});}
function windowAt(g,x,y,z,ry,fc='#ffffff',w=1,h=1.25,dc){const p=new THREE.Group();p.position.set(x,y,z);p.rotation.y=ry;g.add(p);
  box(p,w+.18,h+.18,.14,fc,0,-.09,0);box(p,w,h,.04,null,0,0,.085,{mat:WINM,ol:false});
  box(p,.06,h,.03,fc,0,0,.11,{ol:false});box(p,w,.06,.03,fc,0,h/2-.03,.11,{ol:false});box(p,w+.34,.09,.22,fc,0,-.18,.09,{ol:.02});
  /* 🏡 cozy extras (town buildings): shutters, a little lintel on top, a flower box under the sill */
  if(dc){if(dc.sh)for(const s of[-1,1])if(s!==dc.ns)box(p,.32,h+.12,.06,dc.sh,s*(w/2+.27),-.06,.04,{ol:.015});
    if(dc.top)box(p,w+.4,.15,.2,dc.top,0,h+.09,.05,{ol:false});
    if(dc.fb!=null){box(p,w+.2,.24,.14,'#c98f5e',0,-.44,.08,{ol:.015});box(p,w+.08,.08,.1,'#5fbf74',0,-.2,.08,{ol:false});
      const n=Math.max(2,Math.round(w/.4));for(let i=0;i<n;i++)sph(p,.09,FLOWER_COLS[(dc.fb+i)%5],-w/2+(i+.5)*w/n,-.1,.1,{ws:6,hs:4,ol:.012});}}}
const FLOWER_COLS=['#ff7aa8','#ffd45c','#ffffff','#b79cff','#ff8a6b'],SHOP_FLOWERS=['#ff9cc4','#ffe680','#ffffff','#d2c0ff','#ffb092'];
function doorAt(g,x,z,ry,c,glass,noStep){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);
  box(p,1.5,2.5,.12,'#ffffff',0,0,0);
  if(glass){box(p,1.24,2.26,.16,null,0,.02,0,{mat:WINM,ol:false});box(p,.06,2.26,.18,'#ffffff',0,.02,0,{ol:false});box(p,.05,.4,.05,'#c8c8d8',-.15,1.0,.12,{ol:.012});box(p,.05,.4,.05,'#c8c8d8',.15,1.0,.12,{ol:.012});}
  else{box(p,1.2,2.24,.16,c,0,.02,0);sph(p,.07,'#ffd45c',.42,1.1,.1,{ol:.015});box(p,.8,.55,.02,shade(c,.12),0,1.45,.085,{ol:false});box(p,.8,.55,.02,shade(c,.12),0,.45,.085,{ol:false});}
  if(!noStep)box(p,1.9,.15,.9,'#e9e0f7',0,0,.45,{ol:.02});}
function building(g,o){WINM=o.win||WIN;try{buildingIn(g,o);}finally{WINM=WIN;}}
function buildingIn(g,o){
  const {x,z,w,d,h}=o,f=o.face||1,fz=z+f*d/2,ry=f>0?0:Math.PI,trim=o.trim||shade(o.wall,-.12);
  box(g,w,h,d,o.wall,x,0,z);box(g,w+.14,.4,d+.14,trim,x,0,z,{ol:.02});
  if(o.gable&&o.fgable){const a=w/2+.5,H=o.rh||2.2,th=Math.atan2(H,a),Ls=Math.hypot(a,H)+.12;   /* 🏡 a tall house turns its roof's pointed end to the street: from the pavement below, a side roof looked flat (run 4, stage 3) */
    for(const s of[1,-1])box(g,Ls,.2,d+.8,o.roof,x+s*a/2,h+H/2-.06,z,{rz:-s*th,center:true,ol:.04});
    prism(g,d-.04,w-.04,H*.96,o.wall,x,h,z,{ol:false,ry:Math.PI/2});
    if(o.chimney!==false){box(g,.7,1.8,.7,trim,x+w*.27,h+.5,z-d*.18);box(g,.9,.18,.9,shade(trim,-.1),x+w*.27,h+2.3,z-d*.18,{ol:.02});}
    box(g,.32,.16,d+.9,shade(o.roof,-.1),x,h+H-.1,z,{ol:.03});box(g,w+.1,.22,d+.1,trim,x,h-.22,z,{ol:.015});
    windowAt(g,x,h+.35,fz+f*.02,ry,'#ffffff',.7,.7);}
  else if(o.gable){const a=d/2+.5,H=o.rh||2.2,th=Math.atan2(H,a),Ls=Math.hypot(a,H)+.12;
    for(const s of[1,-1])box(g,w+.8,.2,Ls,o.roof,x,h+H/2-.06,z+s*a/2,{rx:s*th,center:true,ol:.04});
    prism(g,w-.04,d-.04,H*.96,o.wall,x,h,z,{ol:false});
    if(o.chimney!==false){box(g,.7,1.8,.7,trim,x+w*.27,h+.5,z-d*.18);box(g,.9,.18,.9,shade(trim,-.1),x+w*.27,h+2.3,z-d*.18,{ol:.02});}
    /* 🏡 roof ridge, a trim band under the eaves, a little round-top attic window in each side gable */
    box(g,w+.9,.16,.32,shade(o.roof,-.1),x,h+H-.1,z,{ol:.03});box(g,w+.1,.22,d+.1,trim,x,h-.22,z,{ol:.015});
    for(const s of[-1,1])windowAt(g,x+s*(w/2+.02),h+.3,z,s*Math.PI/2,'#ffffff',.62,.62);}
  else{box(g,w+.3,.5,d+.3,trim,x,h,z,{ol:.04});box(g,w-.2,.06,d-.2,o.roof||'#a7a9cf',x,h+.3,z,{ol:false});
    /* 🏢 a white line under the roof edge and corner posts at the front */
    box(g,w+.18,.14,d+.18,'#ffffff',x,h-.14,z,{ol:.015});for(const s of[-1,1])box(g,.34,h-.14,.34,trim,x+s*(w/2-.06),0,fz-f*.06,{ol:.02});}   /* (run 4 finish: 11 cm out from the wall, not 7: the wall's ink shell, 4 cm behind the post's face, showed through it as a dashed line from across the street) */
  const fl=o.floors||Math.max(1,Math.round((h-.4)/3.1)),nW=Math.max(1,Math.floor((w-.8)/2.3));
  /* window extras: houses get shutters (roof colour) and flower boxes downstairs; the others a lintel, flats flower boxes upstairs */
  const dec=(i,k,fr,wx)=>o.gable?{sh:o.bare&&fr&&o.bare(wx-x,i)?null:o.roof,ns:fr&&i===0&&o.door&&Math.abs(wx-o.door.x)<2.6?f*Math.sign(o.door.x-wx):0,fb:fr&&i===0?k:null}:{top:trim,fb:fr&&o.boxes&&i>0&&(k+i)%2===0?k+i:null};
  for(let i=1;i<fl;i++)box(g,w+.1,.16,d+.1,trim,x,i*3.1-.12,z,{ol:.015});
  for(let i=0;i<fl;i++){const wy=1.0+i*3.1;for(let k=0;k<nW;k++){const wx=x-w/2+(k+.5)*(w/nW);if(i===0&&o.door&&Math.abs(wx-o.door.x)<1.6)continue;if(i===0&&o.shop)continue;if(o.skip&&o.skip(wx-x,i))continue;windowAt(g,wx,wy,fz+f*.02,ry,o.wf||'#ffffff',1,1.25,dec(i,k,true,wx));}
    const nS=Math.max(1,Math.floor((d-1)/2.6));for(let k=0;k<nS;k++){const wz=z-d/2+(k+.5)*(d/nS);windowAt(g,x-w/2-.02,wy,wz,-Math.PI/2,o.wf,1,1.25,dec(i,k));windowAt(g,x+w/2+.02,wy,wz,Math.PI/2,o.wf,1,1.25,dec(i,k));}}
  if(o.door)doorAt(g,o.door.x,fz+f*.02,ry,o.door.c||'#ff7aa8',o.door.glass);
  /* 🚪 a little roof over the front door (shops have their awning) */
  if(o.door&&!o.shop){const p=new THREE.Group();p.position.set(o.door.x,0,fz+f*.02);p.rotation.y=ry;g.add(p);
    if(o.gable)prism(p,.95,2.1,.5,o.roof,0,2.62,.47,{ry:Math.PI/2,ol:.03});else box(p,2.3,.16,1.0,o.door.glass?trim:o.door.c,0,2.62,.5,{ol:.03});
    for(const s of[-1,1])box(p,.1,.36,.42,'#ffffff',s*.9,2.26,.21,{ol:.012});if(o.gable){bake(p,false);p.userData.keep=1;}}   /* (run 4, stage 3: a house's little door roof and its brackets cast no shadow: on the wall they were dark smudges round the door) */
  if(o.shop){const p=new THREE.Group();p.position.set(x,0,fz);p.rotation.y=ry;g.add(p);
    const ww=Math.min((w-2.2)/2-.45,w/2-1.8);   /* the frame and sill end 3 cm short of the corner post (run 4, stage 3: they ran 7 to 22 cm into it, and its side, seen almost edge-on, flickered through the glass as a dashed line) */
    for(const s of[-1,1]){const cx=s*(1.1+.25+ww/2);box(p,ww+.2,2.0,.14,'#ffffff',cx,.55,.02);box(p,ww,1.8,.08,null,cx,.65,.09,{mat:WINM,ol:false});box(p,ww+.3,.12,.35,'#ffffff',cx,.45,.12,{ol:.02});
      /* 🌼 a flower box on each shop window sill */
      box(p,ww-.1,.2,.22,'#e3a96f',cx,.57,.2,{ol:.015});box(p,ww-.2,.07,.16,'#6fd884',cx,.77,.2,{ol:false});const n=Math.max(3,Math.round(ww/.5));for(let i=0;i<n;i++)sph(p,.14,SHOP_FLOWERS[(i+(s>0?2:0))%5],cx-ww/2+(i+.5)*ww/n,.95,.22,{ws:6,hs:4,ol:.012});}
    const n=Math.round((w+.4)/.6),sw=(w+.4)/n;
    for(let i=0;i<n;i++)box(p,sw,.08,1.5,i%2?'#ffffff':o.awning,-(w+.4)/2+sw*(i+.5),2.86,.7,{rx:.32,ol:.012,center:true});
    for(let i=0;i<n;i++)box(p,sw,.26,.04,i%2?'#ffffff':o.awning,-(w+.4)/2+sw*(i+.5),2.36,1.42,{ol:.012});
    for(const s of[-1,1])box(p,.04,.26,1.5,o.awning,s*((w+.4)/2-.02),2.699,.646,{rx:.32,ol:.012,center:true});   /* its two ends closed by a side valance (run 4 finish: seen from one end, the open far end looked like a strip hanging in the air past the shop's corner) */
    const bw=Math.min(w-1,7);box(p,bw,1.0,.16,o.signBg||'#ffffff',0,3.25,.1);
    const sm=signPlane(o.sign,bw-.3,.8,o.signBg||'#ffffff',o.signFg||'#3d2c5e');sm.position.set(0,3.75,.2);p.add(sm);}   /* 2 cm in front of its board (run 4, job 5) */
}
let BENCH_L=null,BENCH_SKIP=0;
function treeLo(g,x,y,z,s,c){cyl(g,.15*s,.2*s,2.3*s,'#9b6b4a',x,y,z,{seg:5,ol:false});sph(g,1.15*s,c,x,y+3.05*s,z,{ws:7,hs:5,ol:false});sph(g,.75*s,c,x+.7*s,y+2.75*s,z+.15*s,{ws:6,hs:4,ol:false});sph(g,.72*s,c,x-.62*s,y+2.8*s,z-.3*s,{ws:6,hs:4,ol:false});}
function pineLo(g,x,y,z,s,c){cyl(g,.14*s,.18*s,.8*s,'#9b6b4a',x,y,z,{seg:5,ol:false});cone(g,1.2*s,1.6*s,c,x,y+.7*s,z,{seg:6,ol:false});cone(g,.92*s,1.4*s,c,x,y+1.55*s,z,{seg:6,ol:false});cone(g,.62*s,1.2*s,c,x,y+2.35*s,z,{seg:6,ol:false});}
const P={x:-17,z:-4.8,yaw:0,pitch:0,bobT:0,bobA:0,moving:false,sit:null,jy:0,vy:0,dip:0,run:false,hd:Math.PI};
let S=null,PLAYING=false,PET_ACTORS=[],FRIEND_ACTORS=[],PEN=[],KEEPERS=[],LITTER=[],HOME_ITEMS=new Map(),TARGET=null;
const DEFAULT_LOOK={skin:'#fdc991',hair:'#8d6238',style:'long',eyes:'round',mouth:'smile',top:'#fdc1fa',bottom:'#37a4fc',shoes:'#8c6137',outfit:'sweater',hat:'none',glasses:'none'};
const CLOTHES={dress:{n:'Dresses',i:'👗',p:120},sweaters:{n:'6 new sweater colors',i:'👚',p:100,slot:'top',cols:['#ffd45c','#5fd4b0','#b79cff','#ff6b6b','#ffffff','#2e2347']},
  pants:{n:'6 new pants colors',i:'👖',p:80,slot:'bottom',cols:['#ff9ec4','#b79cff','#ffffff','#2e2347','#ffd45c','#5fd4b0']},shoes:{n:'5 new shoe colors',i:'👟',p:60,slot:'shoes',cols:['#ffffff','#ff7aa8','#ff4d4d','#ffd45c','#7cc8ff']},
  cap:{n:'Cap',i:'🧢',p:60,hat:1,cols:['#ff6b6b','#5fa8ff','#ffd45c','#5fd4b0','#ff9ec4','#2e2347']},beanie:{n:'Beanie',i:'⛄',p:60,hat:1,cols:['#7cc8ff','#ff9ec4','#ffd45c','#b79cff','#ff8a6b']},
  bow:{n:'Big bow',i:'🎀',p:50,hat:1,cols:['#ff4d8d','#ff6b6b','#7cc8ff','#ffd45c','#b79cff','#ffffff']},flowers:{n:'Flower crown',i:'🌸',p:80,hat:1,cols:['#ff7aa8','#b79cff','#ff8a6b','#7cc8ff']},
  bunny:{n:'Bunny ears',i:'🐰',p:70,hat:1,cols:['#ffffff','#ff9ec4','#b79cff','#c49a74']},cat:{n:'Cat ears',i:'🐱',p:70,hat:1,cols:['#2e2347','#ffffff','#ff9ec4','#ff8a6b']},
  cowboy:{n:'Cowboy hat',i:'🤠',p:90,hat:1,cols:['#9a6a43','#ff7aa8','#ffffff','#2e2347']},witch:{n:'Witch hat',i:'🧙',p:90,hat:1,cols:['#2e2347','#b79cff','#5fd4b0']},
  headphones:{n:'Headphones',i:'🎧',p:120,hat:1,cols:['#ff7aa8','#7cc8ff','#5fd4b0','#ffd45c','#2e2347']},tiara:{n:'Tiara',i:'💎',p:180,hat:1,cols:['#ff7aa8','#7cc8ff','#b79cff']},
  flower:{n:'Hair flower',i:'🌺',p:60,hat:1,cols:['#ff7aa8','#ff6b6b','#ffffff','#ffd45c','#b79cff']},halo:{n:'Angel halo',i:'😇',p:100,hat:1,cols:['#ffd45c','#ffffff','#ff9ec4']},
  unicorn:{n:'Unicorn headband',i:'🦄',p:110,hat:1,cols:['#ffffff','#ff9ec4','#b79cff','#7cc8ff']},beret:{n:'Beret',i:'🎨',p:70,hat:1,cols:['#ff6b6b','#2e2347','#ff9ec4','#5fd4b0']},crown:{n:'Crown',i:'👑',p:400,hat:1,cols:['#ffd45c','#d8dcea','#ff9ec4']},
  glasses:{n:'Glasses',i:'👓',p:60,gl:1,cols:['#3d2c5e','#ff7aa8','#7cc8ff','#ffd45c']},sunglasses:{n:'Sunglasses',i:'🕶️',p:80,gl:1,cols:['#2e2347','#ff7aa8','#5fa8ff','#ffd45c']},hearts:{n:'Heart glasses',i:'💖',p:70,gl:1,cols:['#ff4d8d','#ff7aa8','#b79cff']},
  /* 🎃 Halloween costumes (run 4, job 3): in the Clothes Shop in October only; worn over your clothes (one tap on, one tap off at the mirror); kept after October */
  co_cat:{n:'Cat costume',i:'🐈',p:160,co:'cat',oct:1},co_dog:{n:'Dog costume',i:'🐕',p:160,co:'dog',oct:1},co_ghost:{n:'Ghost costume',i:'👻',p:160,co:'ghost',oct:1},co_dino:{n:'Dinosaur costume',i:'🦖',p:180,co:'dino',oct:1},co_bunny:{n:'Bunny costume',i:'🐰',p:0,co:'bunny',gift:1}};
const LOOK_OPTS={eyes:[['round','Round'],['happy','Happy'],['sleepy','Sleepy'],['sparkle','Sparkly']],skin:['#fdc991','#d5914c'],
  mouth:[['smile','Smile'],['grin','Big grin'],['small','Small'],['cat','Kitty']],
  style:[['long','Long'],['bob','Bob'],['short','Short'],['ponytail','Ponytail'],['bun','Bun'],['pigtails','Pigtails'],['curly','Curly']],
  hair:['#704d2d','#8d6238','#c5874a','#ffa760'],top:['#fdc1fa','#fe8cf8','#34bffc','#36a4fe'],bottom:['#37a4fc','#35bffb'],shoes:['#8c6137','#232028']};
const FRIENDS=[
  {id:'rosie',name:'Rosie',look:{skin:'#ffd9bd',hair:'#e8734a',style:'pigtails',top:'#ff9ec4',bottom:'#6f7dff',shoes:'#ffffff',dress:true,scale:.95},fav:'cake',home:33,
    hello:"Hi! You must be new here! I'm Rosie.",
    lines:["Do you like cake? I LOVE cake. Strawberry is the best!","The fountain in the park sparkles at night. So pretty!","I'm learning to ride my bike. I only fell twice today!","Your house on Friends Lane is so cute! I love it.","Have you met Theo? He knows everything about dinosaurs."]},
  {id:'theo',name:'Theo',look:{skin:'#c98d63',hair:'#2e2347',style:'short',top:'#5fd4b0',bottom:'#3f4c86',shoes:'#ff7aa8',scale:.97},fav:'pizza',home:31,
    hello:"Oh, hey! I'm Theo. Did you know some dinosaurs had feathers?",
    lines:["Pizza is the best food. Extra cheese!","I'm building a robot at home. It can almost wave!","A T. rex had teeth as big as bananas!","The pet shop has a puppy that does a little spin!","Let's race to the fountain sometime!"]},
  {id:'luna',name:'Luna',look:{skin:'#f6d3bb',hair:'#f2d16b',style:'long',top:'#b79cff',bottom:'#ffffff',shoes:'#b79cff',dress:true,scale:.95},fav:'icecream',home:27,
    hello:"Hi! My name's Luna!",greet:"Hi! My name's Luna!",only:true,giftAsk:"A present for me?!",
    lines:["I LOVE ICE CREAM AND DRAWING! Hmm, I wonder which is better...","I drew a cat eating ice cream. Best. Drawing. EVER!","Strawberry or chocolate? I pick BOTH!","I want to draw every house in town. Yours is next!"]},
  {id:'finn',name:'Finn',look:{skin:'#8a5a3c',hair:'#1f1a2e',style:'curly',top:'#ffd45c',bottom:'#5b8cff',shoes:'#2e2347',scale:.98},fav:'apple',home:29,
    hello:"Hi!",greet:"Hi!",only:true,giftAsk:"A present for me?!",
    lines:["I'm gonna be a firefighter when I grow up!","Firefighters need energy. That's why I eat apples!","When I'm a firefighter, I'll rescue cats from trees!","I run every day. Firefighters have to be fast!"]},
];
const TOWNFOLK=[{skin:'#f5cfb0',hair:'#3d2c5e',style:'short',top:'#7cc8ff',bottom:'#4a4f7a',shoes:'#2e2347',scale:1.15},
  {skin:'#c98d63',hair:'#1f1a2e',style:'bun',top:'#ff8a6b',bottom:'#3f4c86',shoes:'#ffffff',scale:1.12,dress:true},
  {skin:'#8a5a3c',hair:'#2e2347',style:'short',top:'#ffd45c',bottom:'#5b5f8c',shoes:'#3d2c5e',scale:1.16},
  {skin:'#ffe0c2',hair:'#d8d8e4',style:'bun',top:'#b79cff',bottom:'#6b6f8e',shoes:'#3d2c5e',scale:1.08},
  {skin:'#f6d3bb',hair:'#9a6a43',style:'ponytail',top:'#5fd4b0',bottom:'#ffffff',shoes:'#ff7aa8',scale:.9},
  {skin:'#d9a06b',hair:'#e8734a',style:'curly',top:'#ff9ec4',bottom:'#3d4a7a',shoes:'#ffffff',scale:.92},
  {skin:'#f5cfb0',hair:'#f2d16b',style:'long',top:'#ffffff',bottom:'#7cc8ff',shoes:'#b79cff',scale:1.1,dress:true},
  {skin:'#c98d63',hair:'#3d2c5e',style:'short',top:'#c9f2e3',bottom:'#9a6a43',shoes:'#2e2347',scale:1.14},
  {skin:'#f6d3bb',hair:'#5a3a24',style:'pigtails',top:'#ffd45c',bottom:'#7cc8ff',shoes:'#ffffff',scale:.9},
  {skin:'#8a5a3c',hair:'#1f1a2e',style:'bob',top:'#ff7aa8',bottom:'#3f4c86',shoes:'#3d2c5e',scale:1.1},
  {skin:'#f5cfb0',hair:'#9a6a43',style:'short',top:'#ff8a6b',bottom:'#5b5f8c',shoes:'#ffffff',scale:1.17},
  {skin:'#c98d63',hair:'#f2d16b',style:'ponytail',top:'#7cc8ff',bottom:'#ffffff',shoes:'#ff7aa8',scale:1.08},
  {skin:'#ffe0c2',hair:'#1f1a2e',style:'curly',top:'#5fd4b0',bottom:'#3d4a7a',shoes:'#3d2c5e',scale:.93},
  {skin:'#d9a06b',hair:'#d8d8e4',style:'short',top:'#e6dbff',bottom:'#6b6f8e',shoes:'#9a6a43',scale:1.12}];
const SEASON_COLS={spring:{tree:['#9fe08a','#b4ea8e','#8fd97e','#a6e68c','#ffc9dc'],pine:['#5fc484','#6bcf8c']},summer:{tree:['#7ed37a','#6cc97c','#93dc76'],pine:['#4fb37a','#5bbf7e']},
  autumn:{tree:['#ff9f43','#ff6b4a','#ffd45c','#e8734a','#ffb347'],pine:['#4fa36f','#56ad76']},winter:{tree:['#cfe8dc','#dff2ea','#b8dcc8','#e8f4ee'],pine:['#9ccfb6','#b7dfcc']}};
let SEASON='summer',TREE_COLS=SEASON_COLS.summer.tree,PINE_COLS=SEASON_COLS.summer.pine;
const LAMPXZ=[];
let CR=null;
const CLAW_COST=10,CLAW_FURN=['teddy','unicorn','toybox','robot','racecar','rockinghorse','dollhouse','castle','tulips','sunflower','bonsai','cactus'],GOLD_FURN=['gteddy','gunicorn','gtrophy','gstar'];
let DISCOTEX=null;
function discoTex(){if(DISCOTEX)return DISCOTEX;const c=document.createElement('canvas');c.width=128;c.height=64;const x=c.getContext('2d'),r=seeded(31),G=['#f4f7ff','#c9d2e6','#9aa6c2','#ffffff','#e3e8f5'],K=['#ff9ec4','#7cc8ff','#ffd45c','#b79cff'];   /* 🪩 a mirror ball: little silver tiles with a few coloured glints (run 4, stage 3: it read as a white balloon) */
  x.fillStyle='#6d7894';x.fillRect(0,0,128,64);for(let j=0;j<8;j++)for(let i=0;i<16;i++){x.fillStyle=r()<.1?K[(r()*K.length)|0]:G[(r()*G.length)|0];x.fillRect(i*8+1,j*8+1,6,6);}DISCOTEX=new THREE.CanvasTexture(c);return DISCOTEX;}
/* ===================== Cozy Town · Pet update 1 · new models =====================
   Written in the game's own way: primitives (box, sph, cyl, cone, prism) from js/00-core.js, ink outline hulls, toon colours, real game size (1 unit = 1 m).
   Nothing here changes a game model: today's pets come from the game's makePet(); ages are one scale setting on top.
   Pets keep their parts separate (root > b > legs[], tail, head) so the game can walk, sit, sleep and do tricks with them,
   and their 4 outfit spots stay free (addAcc from js/01-models.js, never baked in).                                   */

/* ---------- ages: one setting (decision 10: only looks and size change) ---------- */
const PU_AGES={baby:{s:.55,head:1.5,leg:.7,round:1.18,eye:1.35,name:'Baby'},teen:{s:.78,head:1.18,leg:.88,round:1.06,eye:1.12,name:'Teen'},adult:{s:1,head:1,leg:1,round:1,eye:1,name:'Adult'}};
function puAge(m,age){const A=PU_AGES[age]||PU_AGES.adult;if(A===PU_AGES.adult)return m;
  m.root.scale.multiplyScalar(A.s);if(m.head){m.head.scale.multiplyScalar(A.head);
    /* bigger eyes: the little ink boxes (and their white shine) on the face grow a bit more */
    const ink=new THREE.Color(INK);m.head.traverse(o=>{if(!o.isMesh||!o.material||!o.material.color||o.parent!==m.head)return;const p=o.geometry.parameters||{};if(o.geometry.type==='BoxGeometry'&&p.width<=.06&&p.height<=.08&&(o.material.color.equals(ink)||o.material.color.getHex()===0xffffff))o.scale.multiplyScalar(A.eye);});}for(const l of m.legs||[])l.scale.y*=A.leg;
  m.b.scale.x*=A.round;m.b.scale.z*=1/Math.sqrt(A.round);
  /* shorter legs: lower the body so the feet stand on the ground again */
  m.root.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m.root);if(isFinite(bb.min.y))m.b.position.y-=bb.min.y/m.root.scale.y;
  m.age=age;return m;}

/* ---------- the four new pets (stage 4) ---------- */
/* fit: whose outfit spots they share (addAcc's tables); base: the size class; scale: real size against that class */
const PU_PET_TYPES={
  monkey:{name:'monkey',many:'Monkeys',icon:'🐒',cols:['#9a6a43','#c49a74','#7a5236','#a7a3b5'],snd:'ooh',names:['Coco','Bongo','Kiki','Banana','Momo','Pip'],fit:'cat',scale:1.15,stage:4,home:'Climbing tree'},
  seal:{name:'seal',many:'Seals',icon:'🦭',cols:['#a7b4c9','#8c96b0','#d9dde8','#6f7891'],snd:'arf',names:['Splash','Bubbles','Misty','Pebble','Sunny','Wave'],fit:'dog',scale:1.25,stage:4,home:'Pond'},
  bear:{name:'bear',many:'Bears',icon:'🐻',cols:['#9a6a43','#5c4033','#e8d8c0','#c98f5e'],snd:'grr',names:['Honey','Bruno','Teddy','Maple','Biscuit','Bo'],fit:'dog',scale:1.6,stage:4,home:'Cave den'},
  snake:{name:'snake',many:'Snakes',icon:'🐍',cols:['#5fbf74','#7cc8ff','#ffd45c','#ff8a6b'],snd:'hiss',names:['Noodle','Slinky','Ziggy','Sunny','Lime','Wiggles'],fit:'hamster',scale:1.4,stage:4,home:'Warm glass tank'},
};
for(const k in PU_PET_TYPES)PET_FIT[k]=PU_PET_TYPES[k].fit;   // addAcc reads PET_FIT: new pets wear the same outfits
function puEye(g,x,y,z,big){const s=big||1;box(g,.05*s,.07*s,.02,INK,x,y,z,{ol:false});box(g,.018*s,.022*s,.01,'#fff',x+.01*s,y+.04*s,z+.012,{ol:false});}
function makePUPet(type,col){const T=PU_PET_TYPES[type];const root=new THREE.Group(),b=new THREE.Group();root.add(b);
  const C=col||T.cols[0],D=shade(C,-.14),Lt=shade(C,.16),legs=[];let tail=null,head=null;const extra={};
  const leg=(x,z,h,w,c)=>{const p=new THREE.Group();p.position.set(x,h,z);b.add(p);box(p,w,h,w,c||C,0,-h,0,{ol:.02});legs.push(p);return p;};
  if(type==='monkey'){   /* 🐒 long arms (front legs), a light face and belly, round ears, a long curly tail */
    sph(b,.15,C,0,.27,0,{s:[1,1.05,1.35]});sph(b,.1,Lt,0,.23,.09,{s:[1,1.1,.7],ol:false});
    leg(-.09,.13,.24,.07);leg(.09,.13,.24,.07);leg(-.08,-.13,.18,.075);leg(.08,-.13,.18,.075);
    for(const l of legs.slice(0,2))box(l,.085,.04,.1,Lt,0,-.24,.015,{ol:.012});   // little hands
    head=new THREE.Group();head.position.set(0,.43,.2);b.add(head);
    sph(head,.14,C,0,0,0,{s:[1,.95,.95]});sph(head,.1,Lt,0,-.02,.07,{s:[1.15,.95,.7],ol:.012});
    box(head,.05,.02,.02,D,0,-.05,.142,{ol:false});puEye(head,-.045,.03,.135);puEye(head,.045,.03,.135);
    for(const s of[-1,1]){sph(head,.055,C,s*.15,.02,-.01,{s:[.5,1,1],ws:10,hs:8,ol:.012});sph(head,.034,Lt,s*.16,.02,.01,{s:[.4,1,1],ws:8,hs:6,ol:false});}
    tail=new THREE.Group();tail.position.set(0,.3,-.2);b.add(tail);
    cyl(tail,.024,.024,.26,C,0,.11,-.05,{rx:-.4,center:true,seg:8,ol:.012});{const t=new THREE.Mesh(new THREE.TorusGeometry(.07,.024,8,16,Math.PI*1.5),mat(C));t.position.set(0,.29,-.09);t.rotation.y=Math.PI/2;t.rotation.z=-.4;tail.add(t);const to=new THREE.Mesh(new THREE.TorusGeometry(.07,.036,8,16,Math.PI*1.5),OL);to.position.copy(t.position);to.rotation.copy(t.rotation);tail.add(to);}
  }else if(type==='seal'){   /* 🦭 a smooth body that tapers to tail flippers, a round head with whiskers, two front flippers (its "legs") */
    sph(b,.17,C,0,.17,.02,{s:[1,.92,1.6]});sph(b,.11,Lt,0,.12,.12,{s:[1,.7,1.2],ol:false});
    for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.13,.13,.15);b.add(p);sph(p,.09,D,s*.06,-.09,.04,{s:[1.1,.28,.75],ry:s*.5,ws:10,hs:6,ol:.012});legs.push(p);}
    head=new THREE.Group();head.position.set(0,.36,.27);b.add(head);
    sph(head,.15,C,0,-.03,0,{s:[1,.92,1.02]});sph(head,.07,Lt,0,-.07,.11,{s:[1.3,.8,.9],ol:.01});box(head,.06,.04,.03,INK,0,-.02,.18,{ol:false});
    puEye(head,-.06,.04,.135,1.15);puEye(head,.06,.04,.135,1.15);
    for(const s of[-1,1])for(const dy of[-.01,-.04])box(head,.12,.006,.006,'#ffffff',s*.11,-.07+dy,.15,{rz:s*(dy<-.02?.18:-.05),ol:false});
    tail=new THREE.Group();tail.position.set(0,.1,-.26);b.add(tail);sph(tail,.08,C,0,0,0,{s:[1,.6,1.2],ol:.015});
    for(const s of[-1,1])sph(tail,.08,D,s*.06,-.04,-.1,{s:[.9,.25,1.2],ry:s*.6,ws:10,hs:6,ol:.012});
  }else if(type==='bear'){   /* 🐻 a big round dog-sized build, thick legs, round ears, a light muzzle, a stubby tail */
    sph(b,.22,C,0,.3,0,{s:[1,.82,1.3]});sph(b,.13,Lt,0,.25,.16,{s:[1,.9,.6],ol:false});
    leg(-.11,.16,.2,.11);leg(.11,.16,.2,.11);leg(-.11,-.16,.2,.11);leg(.11,-.16,.2,.11);
    for(const l of legs)box(l,.12,.04,.13,D,0,-.2,.01,{ol:.012});
    head=new THREE.Group();head.position.set(0,.36,.28);b.add(head);
    sph(head,.17,C,0,-.02,0,{s:[1,.92,.95]});box(head,.15,.11,.12,Lt,0,-.06,.15,{ol:.015});box(head,.07,.05,.03,INK,0,-.02,.215,{ol:false});
    puEye(head,-.075,.05,.152);puEye(head,.075,.05,.152);
    for(const s of[-1,1]){sph(head,.055,C,s*.12,.14,-.02,{s:[1,1,.6],ws:10,hs:8,ol:.012});sph(head,.03,Lt,s*.12,.14,.01,{s:[1,1,.4],ws:8,hs:6,ol:false});}
    tail=new THREE.Group();tail.position.set(0,.34,-.27);b.add(tail);sph(tail,.05,C,0,0,0,{ws:8,hs:6,ol:.012});
  }else if(type==='snake'){   /* 🐍 one smooth body of overlapping round segments (each its own group, so it can slither, coil and sway), a lighter belly, a forked tongue */
    const segs=[];const N=14;
    for(let i=0;i<N;i++){const g=new THREE.Group();const r=.07-(i>8?(i-8)*.009:0);g.position.set(Math.sin(i*.55)*.1,r*.9,.1-i*.07);b.add(g);sph(g,r,C,0,0,0,{s:[1,.8,1.3],ws:12,hs:8,ol:.014});if(i%3===1)sph(g,r*.55,D,0,r*.55,0,{s:[1,.35,1],ws:8,hs:5,ol:false});segs.push(g);}
    extra.segs=segs;
    head=new THREE.Group();head.position.set(0,.07,.2);b.add(head);
    sph(head,.085,C,0,0,0,{s:[1.15,.75,1.35],ws:12,hs:9});for(const sd of[-1,1]){sph(head,.03,'#ffffff',sd*.045,.05,.05,{ws:8,hs:6,ol:.008});sph(head,.016,INK,sd*.047,.06,.07,{ws:6,hs:5,ol:false});}
    box(head,.012,.006,.08,'#ff4d6d',0,-.02,.15,{ol:false});for(const sd of[-1,1])box(head,.008,.006,.035,'#ff4d6d',sd*.01,-.02,.2,{ry:sd*.4,ol:false});
    tail=segs[N-1];
  }
  root.scale.setScalar(T.scale);
  return Object.assign({root,b,legs,tail,head,type,phase:Math.random()*6},extra);}
/* any pet at any age: today's pets come from the game's makePet, new ones from makePUPet */
/* the new pets borrow a known pet's outfit spots (PET_FIT): two anchors map that pet's head and body onto the new pet's own, measured from both models, so every outfit sits where it should */
function localBox(o){const p=o.parent,pos=o.position.clone(),rot=o.rotation.clone(),sc=o.scale.clone();if(p)p.remove(o);o.position.set(0,0,0);o.rotation.set(0,0,0);o.scale.set(1,1,1);o.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(o);if(p)p.add(o);o.position.copy(pos);o.rotation.copy(rot);o.scale.copy(sc);return bb;}
const FIT_CACHE={};
function fitInfo(t){if(FIT_CACHE[t])return FIT_CACHE[t];const f=makePet(t,'#ffffff');const hb=localBox(f.head);const r={hb,hp:f.head.position.clone()};f.root.traverse(o=>{if(o.geometry)o.geometry.dispose();});return FIT_CACHE[t]=r;}
function puAnchors(m){const fit=PET_FIT[m.type];if(!fit)return null;const F=fitInfo(fit);const hb=localBox(m.head);
  const s=(hb.max.x-hb.min.x)/(F.hb.max.x-F.hb.min.x);
  const ah=new THREE.Group();ah.scale.setScalar(s);ah.position.set(0,hb.max.y-F.hb.max.y*s,hb.max.z-F.hb.max.z*s);m.head.add(ah);
  const ab=new THREE.Group();ab.scale.setScalar(s);ab.position.copy(m.head.position).sub(F.hp.clone().multiplyScalar(s));m.b.add(ab);
  return{type:fit,head:ah,b:ab,root:m.root,legs:[],tail:null};}
function puPet(kind,col,age,outfit){const nw=!!PU_PET_TYPES[kind];const m=nw?makePUPet(kind,col):makePet(kind,col||PET_TYPES[kind].cols[0]);
  if(outfit){const tgt=nw?puAnchors(m):m;for(const s of['head','neck','face','back'])if(outfit[s]&&ACCS[outfit[s]])addAcc(tgt,outfit[s]);}   // outfits go on before the age scale: they grow with the pet
  return puAge(m,age||'adult');}
/* a pet carries a toy in its mouth to ask to play */
const PU_MOUTH={dog:[0,-.1,.2],cat:[0,-.09,.15],bunny:[0,-.08,.12],hamster:[0,-.06,.1]};
function puCarry(m,toy){const t=PET_FIT[m.type]||m.type,p=PU_MOUTH[t]||[0,-.08,.15];const g=new THREE.Group();g.position.set(...p);g.scale.setScalar(.7);g.add(toy);m.head.add(g);return g;}

/* ---------- the catalogue of new models ---------- */
const PU={};   // id -> {name, stage, group, icon, opts, dflt, build(g,o)}
function pu(id,o){PU[id]=Object.assign({id,opts:[],dflt:{}},o);}
const PU_OPT={pick:(k,label,vals)=>({k,label,type:'pick',vals}),col:(cols,label)=>({k:'c',label:label||'Colour',type:'col',vals:cols})};
const AGE_OPT=PU_OPT.pick('age','Age',[['baby','Baby'],['teen','Teen'],['adult','Adult']]);
const W1='#c98f5e',W2='#a8714a',W3='#e0905e';

/* stage 4: new pets */
for(const k in PU_PET_TYPES){const T=PU_PET_TYPES[k];pu('pet:'+k,{name:T.many.replace(/s$/,''),stage:4,group:'New pets',icon:T.icon,pet:k,opts:[AGE_OPT,PU_OPT.col(T.cols)],dflt:{age:'baby',c:T.cols[0]},build(g,o){g.add(puPet(k,o.c,o.age,o.outfit).root);}});}
/* stage 2: baby and teen of today's pets (the adults are the game's own) */
for(const k of['dog','pomchi','pug','sausage','cat','bunny','hamster','capybara','duck','owl']){const T=PET_TYPES[k];pu('age:'+k,{name:{dog:'Puppy',cat:'Kitten',bunny:'Bunny',hamster:'Hamster',pomchi:'Pomchi',pug:'Pug',sausage:'Sausage dog',capybara:'Capybara',duck:'Duck',owl:'Owl'}[k],stage:2,group:'Baby & teen pets',icon:T.icon,pet:k,opts:[AGE_OPT,PU_OPT.col(T.cols)],dflt:{age:'baby',c:T.cols[0]},build(g,o){g.add(puPet(k,o.c,o.age,o.outfit).root);}});}

/* stage 2: mood effects (no text bubbles) */
function puHeart(g,c,x,y,z,s){s=s||1;const h=new THREE.Group();h.position.set(x,y,z);h.scale.setScalar(s);g.add(h);sph(h,.05,c,-.035,.02,0,{s:[1,1,.6],ws:10,hs:8,ol:.008});sph(h,.05,c,.035,.02,0,{s:[1,1,.6],ws:10,hs:8,ol:.008});cone(h,.083,.11,c,0,-.045,0,{rz:Math.PI,center:true,seg:14,s:[1,1,.6],ol:.008});return h;}
pu('fx:hearts',{name:'Little hearts',stage:2,group:'Mood effects',icon:'💕',note:'very very happy',build(g){puHeart(g,'#ff4d8d',0,.25,0,1.1);puHeart(g,'#ff7aa8',-.14,.12,0,.75);puHeart(g,'#ff9ec4',.15,.05,0,.6);}});
pu('fx:sparkle',{name:'Sparkle',stage:2,group:'Mood effects',icon:'✨',note:'growing up',build(g){const M=toon({color:'#ffe680',emissive:new THREE.Color('#ffd45c'),emissiveIntensity:.5});for(const [x,y,z,s] of[[0,.2,0,1],[-.16,.08,.05,.6],[.15,.32,-.03,.5],[.12,.04,.08,.4]]){const m=new THREE.Mesh(starGeo(.09*s,0,.03*s),M);m.position.set(x,y,z);g.add(m);const o=new THREE.Mesh(starGeo(.09*s,.012,.03*s),OL);o.position.copy(m.position);g.add(o);}}});
pu('fx:zzz',{name:'Zzz',stage:2,group:'Mood effects',icon:'💤',note:'sleeping',build(g){const Z=(x,y,s)=>{const p=new THREE.Group();p.position.set(x,y,0);p.scale.setScalar(s);g.add(p);const c='#b79cff';box(p,.14,.035,.03,c,0,.12,0,{center:true,ol:.008});box(p,.14,.035,.03,c,0,0,0,{center:true,ol:.008});box(p,.035,.17,.03,c,0,.06,0,{rz:-.95,center:true,ol:.008});};Z(0,.05,1);Z(.13,.22,.75);Z(.24,.36,.55);}});

/* stage 3: pet needs items */
function bedRing(g,r,c){const C2=shade(c,.12);cyl(g,r,r*1.05,.12,c,0,0,0,{seg:20,ol:.02});const t=new THREE.Mesh(new THREE.TorusGeometry(r*.82,r*.2,8,24),mat(c));t.rotation.x=Math.PI/2;t.position.y=.16;g.add(t);const to=new THREE.Mesh(new THREE.TorusGeometry(r*.82,r*.2+.02,8,24),OL);to.rotation.x=Math.PI/2;to.position.y=.16;g.add(to);cyl(g,r*.68,r*.68,.06,C2,0,.1,0,{seg:20,ol:false});}
pu('bed',{name:'Pet bed',stage:3,group:'Pet needs items',icon:'🛏️',need:'rest',opts:[PU_OPT.pick('size','Size',[['s','Small'],['m','Medium'],['l','Large']]),PU_OPT.col(['#ff9ec4','#7cc8ff','#b79cff','#5fd4b0','#ffd45c'])],dflt:{size:'m',c:'#ff9ec4'},build(g,o){bedRing(g,{s:.3,m:.42,l:.6}[o.size]||.42,o.c);}});
pu('doghouse',{name:'Dog house (game furniture)',stage:3,group:'Pet needs items',icon:'🏠',need:'rest',game:true,build(g){g.add(buildFurn('doghouse'));}});
pu('foodbowl',{name:'Food bowl',stage:3,group:'Pet needs items',icon:'🥣',need:'food',opts:[PU_OPT.pick('full','Look',[['1','Full'],['0','Empty']]),PU_OPT.col(['#ff7aa8','#7cc8ff','#5fd4b0','#ffd45c'])],dflt:{full:'1',c:'#ff7aa8'},
  build(g,o){cyl(g,.15,.11,.08,o.c,0,0,0,{seg:16,ol:.015});cyl(g,.12,.12,.012,shade(o.c,-.2),0,.075,0,{seg:16,ol:false});if(o.full==='1'){for(let i=0;i<14;i++){const a=i*2.4,r=.03+((i*37)%7)/7*.07;sph(g,.025,i%3?'#c98f5e':'#a8714a',Math.cos(a)*r,.085,Math.sin(a)*r,{ws:6,hs:4,ol:false});}}}});
pu('waterbowl',{name:'Water bowl',stage:3,group:'Pet needs items',icon:'💧',need:'food',opts:[PU_OPT.col(['#7cc8ff','#ff7aa8','#5fd4b0','#ffd45c'])],dflt:{c:'#7cc8ff'},build(g,o){cyl(g,.15,.11,.08,o.c,0,0,0,{seg:16,ol:.015});const w=new THREE.Mesh(new THREE.CircleGeometry(.125,16),WATER);w.rotation.x=-Math.PI/2;w.position.y=.072;g.add(w);}});
const PU_TOYS={
  ball:{n:'Ball',b(g){sph(g,.06,'#ff6b6b',0,.06,0,{ws:12,hs:9,ol:.01});box(g,.125,.012,.012,'#ffffff',0,.06,0,{ol:false});}},
  rope:{n:'Rope toy',b(g){cyl(g,.022,.022,.24,'#ffd45c',0,.03,0,{rz:Math.PI/2,center:true,seg:8,ol:.01});for(let i=0;i<5;i++)box(g,.012,.048,.048,i%2?'#ff7aa8':'#7cc8ff',-.1+i*.05,.03,0,{center:true,ol:false});for(const s of[-1,1])sph(g,.04,'#ff7aa8',s*.13,.035,0,{ws:8,hs:6,ol:.01});}},
  bone:{n:'Squeaky bone',b(g){box(g,.18,.04,.045,'#ffffff',0,.025,0,{ol:.01});for(const s of[-1,1])for(const t of[-1,1])sph(g,.032,'#ffffff',s*.09,.025,t*.025,{ws:8,hs:6,ol:.01});}},
  yarn:{n:'Yarn ball',b(g){sph(g,.065,'#b79cff',0,.065,0,{ws:12,hs:9,ol:.01});for(const r of[.3,1.1,1.9])box(g,.135,.01,.01,shade('#b79cff',-.15),0,.065,0,{ry:r,rz:.6,center:true,ol:false});}},
  stick:{n:'Chew stick',b(g){cyl(g,.024,.024,.22,'#f2dcb0',0,.026,0,{rz:Math.PI/2,center:true,seg:8,ol:.01});for(const s of[-1,1])sph(g,.034,'#f2dcb0',s*.11,.026,0,{ws:8,hs:6,ol:.01});for(let i=0;i<4;i++)cyl(g,.0255,.0255,.01,'#e0a96f',-.075+i*.05,.026,0,{rz:Math.PI/2,center:true,seg:8,ol:false});}},
  feather:{n:'Feather toy',b(g){cyl(g,.014,.014,.3,'#ff7aa8',-.04,.016,0,{rz:Math.PI/2,center:true,seg:6,ol:.01});for(const [c,dz,ry] of[['#ff7aa8',0,0],['#7cc8ff',.05,.5],['#ffd45c',-.05,-.5]])sph(g,.075,c,.17,.03,dz,{s:[1.7,.3,.6],ry,ws:10,hs:6,ol:.01});sph(g,.03,'#ffffff',.11,.03,0,{ws:6,hs:5,ol:.008});}},
};
for(const k in PU_TOYS)pu('toy:'+k,{name:PU_TOYS[k].n,stage:3,group:'Toys',icon:'🎾',need:'play',carry:true,build(g){PU_TOYS[k].b(g);}});
pu('toybox',{name:'Pet toy box',stage:3,group:'Pet needs items',icon:'🧺',need:'play',opts:[PU_OPT.col(['#ffd6e0','#cfe8ff','#dff2ea','#fff1b8'])],dflt:{c:'#ffd6e0'},
  build(g,o){box(g,.7,.36,.45,o.c,0,0,0,{ol:.02});box(g,.74,.06,.49,shade(o.c,-.12),0,.34,0,{ol:.015});for(const s of[-1,1])box(g,.02,.08,.18,shade(o.c,-.2),s*.36,.2,0,{ol:false});
    const t=(k,x,z,r)=>{const p=new THREE.Group();p.position.set(x,.33,z);p.rotation.y=r;g.add(p);PU_TOYS[k].b(p);};t('ball',-.18,.05,0);t('bone',.12,-.05,.4);t('yarn',.05,.1,0);cyl(g,.012,.012,.28,'#ffffff',.22,.42,-.1,{rz:-.6,center:true,seg:5,ol:.008});}});

/* stage 3: big-needs homes */
pu('home:tree',{name:'Climbing tree (monkey home)',stage:3,group:'Big-needs homes',icon:'🌳',pet:'monkey',
  build(g){const B='#9b6b4a',L=['#9fe08a','#8fd97e','#b4ea8e'];cyl(g,.38,.55,3.5,B,0,0,0,{seg:12});for(const [x,y,z,r,i] of[[0,4.3,0,1.5,0],[1.15,3.85,.35,1.05,1],[-1.1,3.95,-.3,1.0,2],[.2,3.9,-1.0,1.0,1],[-.3,3.8,1.0,.95,2],[.4,5.1,.2,.9,0]])sph(g,r,L[i],x,y,z,{ws:12,hs:9});
    /* branches to sit and hang on */
    for(const [y,ry,len] of[[1.4,0,1.5],[2.2,2.1,1.3],[2.9,4.0,1.2]]){const p=new THREE.Group();p.position.set(0,y,0);p.rotation.y=ry;g.add(p);cyl(p,.07,.1,len,B,len/2,0,0,{rz:Math.PI/2-.12,center:true,seg:8});box(p,.36,.06,.3,W1,len-.15,.12,0,{ol:.015});}
    {const p=new THREE.Group();p.position.set(0,2.55,0);p.rotation.y=1;g.add(p);cyl(p,.06,.08,1.2,B,.55,0,0,{rz:Math.PI/2,center:true,seg:8});for(const s of[-1,1])cyl(p,.012,.012,.8,'#e0c9a0',.95,-.4,s*.08,{seg:5,ol:.008});box(p,.3,.05,.2,'#e0905e',.95,-.82,0,{ol:.012});}   // a swing to hang on
    for(let i=0;i<5;i++)box(g,.4,.05,.07,W3,0,.3+i*.26,.32,{ol:.01});}});
pu('home:pond',{name:'Pond (seal home)',stage:3,group:'Big-needs homes',icon:'🌊',pet:'seal',level:2,
  build(g){const r=2.4;box(g,r*2+.8,.04,r*2+.8,'#86d36a',0,-.03,0,{ol:false});const w=new THREE.Mesh(new THREE.CircleGeometry(r,40),WATER);w.rotation.x=-Math.PI/2;w.position.y=.05;g.add(w);
    const n=26;for(let i=0;i<n;i++){const a=i/n*Math.PI*2;if(a>1.2&&a<1.95)continue;const rr=r+.12+((i*13)%5)*.03;sph(g,.24+((i*7)%4)*.04,i%3?'#8a85a3':'#7a7592',Math.cos(a)*rr,.14,Math.sin(a)*rr,{s:[1.2,.6,1],ws:8,hs:6,ol:.014});}
    /* a smooth slope to slide in: a sandy ramp running down into the water */
    {const p=new THREE.Group();p.rotation.y=-1.57;g.add(p);box(p,1.5,.1,2.2,'#f2d38a',0,.1,r-.2,{rx:.14,center:true,ol:.02});for(const sd of[-1,1])box(p,.12,.18,2.2,'#e0b56f',sd*.8,.12,r-.2,{rx:.14,center:true,ol:.015});}
    for(let i=0;i<4;i++){const a=2.6+i*.9,rr=r*.55;cyl(g,.24,.24,.02,'#5fbf74',Math.cos(a)*rr,.06,Math.sin(a)*rr,{seg:10,ol:false});}
    for(const [x,z] of[[-2.6,1.6],[2.5,-1.8]]){cyl(g,.03,.03,.7,'#6aa84f',x,0,z,{seg:5,ol:.008});cyl(g,.05,.05,.18,'#8a5a36',x,.65,z,{seg:6,ol:.008});}}});
pu('home:den',{name:'Cave den (bear home)',stage:3,group:'Big-needs homes',icon:'🪨',pet:'bear',level:2,
  build(g){const R=['#8a85a3','#7a7592','#6e6a86'];sph(g,1.55,R[0],0,.2,-.3,{s:[1.25,.95,1],ws:12,hs:9,ol:.03});sph(g,.9,R[1],1.35,.1,.2,{s:[1,.85,1],ws:10,hs:8,ol:.025});sph(g,.85,R[2],-1.4,.05,.25,{s:[1,.8,1],ws:10,hs:8,ol:.025});
    /* the opening: a dark arch in the front, big enough for an adult bear to sleep inside */
    sph(g,.95,'#2e2347',0,0,.92,{s:[1,1.05,.55],ws:16,hs:10,ol:false});box(g,1.9,.02,1.0,'#3d2c5e',0,0,.85,{ol:false});
    for(const [x,s] of[[-.95,.35],[.95,.32],[-.55,.2],[.6,.22]])sph(g,s,R[(x>0)+1],x,s*.5,1.25,{s:[1.1,.8,1],ws:8,hs:6,ol:.015});
    for(let i=0;i<6;i++)box(g,.5,.05,.12,'#f2d16b',-.4+i*.15,.03,1.25-i*.06,{ry:i*.5,ol:false});   // straw inside the door
    sph(g,.3,'#5fbf74',.9,1.3,-.2,{s:[1.4,.5,1],ws:8,hs:6,ol:.015});sph(g,.25,'#6fc25a',-.6,1.6,-.6,{s:[1.4,.5,1],ws:8,hs:6,ol:.015});}});
pu('home:tank',{name:'Warm glass tank (snake home)',stage:3,group:'Big-needs homes',icon:'🔆',pet:'snake',
  build(g){const W=1.4,D=.8,H=.8;box(g,W+.12,.55,D+.12,W2,0,0,0,{ol:.02});box(g,W+.16,.08,D+.16,W1,0,.55,0,{ol:.015});
    const G=new THREE.MeshToonMaterial({color:'#cfefff',gradientMap:GRAD,transparent:true,opacity:.28,depthWrite:false});const glass=new THREE.Mesh(new THREE.BoxGeometry(W,H,D),G);glass.position.set(0,.63+H/2,0);g.add(glass);
    for(const [x,z] of[[-1,-1],[1,-1],[-1,1],[1,1]])box(g,.04,H,.04,'#5a5f8c',x*W/2,.63,z*D/2,{ol:.01});box(g,W+.06,.04,D+.06,'#5a5f8c',0,.63+H,0,{ol:.01});
    box(g,W-.04,.06,D-.04,'#e8c98f',0,.63,0,{ol:false});sph(g,.18,'#b3afc6',-.4,.65,.1,{s:[1.4,.6,1],ws:8,hs:6,ol:.012});
    cyl(g,.04,.05,1.0,'#9b6b4a',.15,.85,-.1,{rz:1.2,ry:.3,center:true,seg:6,ol:.012});box(g,.18,.03,.2,'#5fbf74',.5,.66,.2,{ol:.01});
    /* the warm lamp on top */
    cyl(g,.03,.03,.25,'#5a5f8c',.4,.63+H,0,{seg:6,ol:.01});const lm=new THREE.Mesh(new THREE.ConeGeometry(.16,.18,12,1,true),mat('#ff8a6b'));lm.position.set(.4,.63+H+.32,0);lm.rotation.x=Math.PI;g.add(lm);sph(g,.07,null,.4,.63+H+.25,0,{mat:toon({color:'#ffb36b',emissive:new THREE.Color('#ff8a3b'),emissiveIntensity:.8}),ol:false});}});

/* stage 3: training gear */
const TG='Training gear';
pu('train:dog',{name:'Dog agility course',stage:3,group:TG,icon:'🐕',pet:'dog',build(g){const bar=(x,h)=>{for(const s of[-1,1])box(g,.06,.6,.06,'#ffffff',x+s*.45,0,0,{ol:.01});cyl(g,.025,.025,.9,'#ff6b6b',x,h,0,{rz:Math.PI/2,center:true,seg:8,ol:.01});};bar(-1.6,.25);bar(-.6,.4);
  const t=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,1.4,16,1,true),mat('#7cc8ff'));t.material.side=THREE.DoubleSide;t.rotation.z=Math.PI/2;t.position.set(.7,.32,0);g.add(t);const to=new THREE.Mesh(new THREE.CylinderGeometry(.345,.345,1.42,16,1,true),OL);to.rotation.z=Math.PI/2;to.position.copy(t.position);g.add(to);for(const s of[-1,1]){const r=new THREE.Mesh(new THREE.TorusGeometry(.33,.03,6,18),mat('#5fa8ff'));r.rotation.y=Math.PI/2;r.position.set(.7+s*.7,.32,0);g.add(r);}
  for(let i=0;i<5;i++)cyl(g,.035,.035,1.0,i%2?'#ffd45c':'#ff7aa8',1.9,.04,-.8+i*.4,{seg:8,ol:.012});box(g,.16,.04,1.9,'#ffffff',1.9,0,0,{ol:.012});}});
pu('train:cat',{name:'Cat tower with feather wand',stage:3,group:TG,icon:'🐈',pet:'cat',build(g){const P='#ffd6e0';box(g,.8,.1,.8,P,0,0,0,{ol:.015});cyl(g,.07,.07,1.5,'#e8c98f',0,.1,0,{seg:10,ol:.012});for(let i=0;i<10;i++)cyl(g,.075,.075,.012,'#c9a46a',0,.2+i*.13,0,{seg:10,ol:false});
  for(const [y,x,s] of[[.6,.25,.55],[1.05,-.25,.5],[1.55,.1,.6]]){cyl(g,s/2,s/2,.08,P,x,y,0,{seg:16,ol:.015});cyl(g,s/2-.04,s/2-.04,.03,'#ff9ec4',x,y+.08,0,{seg:16,ol:false});}box(g,.4,.3,.4,P,.2,.1,.2,{ol:.015});const h=new THREE.Mesh(new THREE.CircleGeometry(.11,14),mat('#3d2c5e'));h.position.set(.2,.27,.405);g.add(h);
  const w=new THREE.Group();w.position.set(-.42,.1,.3);g.add(w);sph(g,.06,'#ff7aa8',-.62,.06,.3,{ws:8,hs:6,ol:.01});cyl(w,.012,.012,.9,'#ff7aa8',0,.45,0,{rz:-.5,center:true,seg:5,ol:.008});cyl(w,.004,.004,.3,'#ffffff',.24,.72,0,{seg:4,ol:false});for(const [c,dz] of[['#7cc8ff',0],['#ffd45c',.03]])sph(w,.05,c,.25,.55,dz,{s:[.4,1.5,.4],ws:8,hs:5,ol:.008});}});
pu('train:bunny',{name:'Bunny hop hurdles',stage:3,group:TG,icon:'🐇',pet:'bunny',build(g){for(let i=0;i<3;i++){const z=-1+i,h=.18+i*.06,c=['#ff9ec4','#ffd45c','#7cc8ff'][i];for(const s of[-1,1])box(g,.05,h+.08,.05,'#ffffff',s*.35,0,z,{ol:.01});box(g,.7,.04,.04,c,0,h,z,{ol:.01});for(const s of[-1,1])box(g,.16,.03,.16,'#ffffff',s*.35,0,z,{ol:.008});}}});
pu('train:hamster',{name:'Hamster wheel and tube maze',stage:3,group:TG,icon:'🐹',pet:'hamster',build(g){box(g,.9,.04,.5,'#e6dbff',0,0,0,{ol:.012});const wh=new THREE.Group();wh.position.set(-.2,.26,0);g.add(wh);
  const r=new THREE.Mesh(new THREE.TorusGeometry(.18,.018,6,22),mat('#ff7aa8'));wh.add(r);const ro=new THREE.Mesh(new THREE.TorusGeometry(.18,.03,6,22),OL);wh.add(ro);for(let i=0;i<10;i++){const a=i/10*Math.PI*2;cyl(wh,.006,.006,.12,'#ffffff',Math.cos(a)*.175,Math.sin(a)*.175,0,{rx:Math.PI/2,center:true,seg:4,ol:false});}box(g,.04,.22,.04,'#5a5f8c',-.2,.02,-.08,{ol:.008});
  const T=new THREE.MeshToonMaterial({color:'#bfe6ff',gradientMap:GRAD,transparent:true,opacity:.55});const tube=(x,y,z,l,rz,ry)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,l,10,1,true),T);m.material.side=THREE.DoubleSide;m.position.set(x,y,z);m.rotation.set(0,ry||0,rz||0);g.add(m);};
  tube(.15,.09,0,.35,Math.PI/2);tube(.32,.2,0,.28,0);tube(.32,.34,-.1,.25,Math.PI/2,Math.PI/2);}});
pu('train:capybara',{name:'Capybara warm bath',stage:3,group:TG,icon:'♨️',pet:'capybara',build(g){cyl(g,.7,.65,.32,'#c98f5e',0,0,0,{seg:20,ol:.02});cyl(g,.72,.72,.05,'#a8714a',0,.3,0,{seg:20,ol:.012});const w=new THREE.Mesh(new THREE.CircleGeometry(.66,24),WATER);w.rotation.x=-Math.PI/2;w.position.y=.36;g.add(w);for(const [x,z] of[[.2,.1],[-.25,-.2],[0,.35]])sph(g,.08,'#ffd45c',x,.36,z,{s:[1,.6,1],ws:8,hs:6,ol:.01});box(g,.36,.24,.2,'#a8714a',.85,0,0,{ol:.015});}});
pu('train:duck',{name:'Duck ramp and splash tub',stage:3,group:TG,icon:'🦆',pet:'duck',build(g){cyl(g,.45,.42,.3,'#7cc8ff',.5,0,0,{seg:18,ol:.02});const w=new THREE.Mesh(new THREE.CircleGeometry(.4,20),WATER);w.rotation.x=-Math.PI/2;w.position.set(.5,.27,0);g.add(w);
  {const L=Math.hypot(1.0,.32),a=Math.atan2(.32,1.0);const p=new THREE.Group();p.position.set(-.45,.16,0);p.rotation.z=a;g.add(p);box(p,L,.05,.4,'#ffd45c',0,0,0,{center:true,ol:.015});for(let i=0;i<5;i++)box(p,.03,.02,.38,'#ff8a6b',-L/2+.1+i*.2,.03,0,{ol:false});for(const s of[-1,1])box(p,L,.08,.03,'#ffb347',0,.05,s*.2,{center:true,ol:.01});}}});
pu('train:owl',{name:'Owl perch with flight hoops',stage:3,group:TG,icon:'🦉',pet:'owl',build(g){box(g,.7,.08,.7,W2,0,0,0,{ol:.015});cyl(g,.06,.08,1.4,W1,0,.08,0,{seg:8,ol:.012});cyl(g,.05,.05,.9,W1,0,1.45,0,{rz:Math.PI/2,center:true,seg:8,ol:.012});for(const s of[-1,1])sph(g,.07,W2,s*.45,1.45,0,{ws:8,hs:6,ol:.01});
  for(const [x,c] of[[.85,'#ff7aa8'],[1.55,'#ffd45c']]){cyl(g,.025,.03,1.1,'#ffffff',x,0,0,{seg:6,ol:.01});const r=new THREE.Mesh(new THREE.TorusGeometry(.3,.035,8,22),mat(c));r.rotation.y=Math.PI/2;r.position.set(x,1.42,0);g.add(r);const o=new THREE.Mesh(new THREE.TorusGeometry(.3,.05,8,22),OL);o.rotation.y=Math.PI/2;o.position.copy(r.position);g.add(o);}}});
pu('train:monkey',{name:'Monkey climbing bars and rings',stage:3,group:TG,icon:'🐒',pet:'monkey',build(g){for(const x of[-1,1])for(const z of[-.35,.35])cyl(g,.04,.04,1.6,'#5fd4b0',x,0,z,{seg:8,ol:.012});for(let i=0;i<7;i++)cyl(g,.025,.025,.7,'#ffd45c',-.9+i*.3,1.6,0,{rx:Math.PI/2,center:true,seg:6,ol:.01});
  for(const s of[-1,1])cyl(g,.04,.04,2.0,'#5fd4b0',0,1.6,s*.35,{rz:Math.PI/2,center:true,seg:8,ol:.012});for(const x of[-.5,.5]){cyl(g,.008,.008,.5,'#e0c9a0',x,1.1,.7,{seg:4,ol:false});const r=new THREE.Mesh(new THREE.TorusGeometry(.1,.02,6,16),mat('#ff7aa8'));r.position.set(x,1.0,.7);g.add(r);}cyl(g,.04,.04,1.6,'#5fd4b0',0,0,.7,{seg:8,ol:.012});box(g,1.2,.04,.04,'#5fd4b0',0,1.6,.7,{ol:.01});}});
pu('train:seal',{name:'Seal ball on a stand',stage:3,group:TG,icon:'🦭',pet:'seal',build(g){cyl(g,.35,.4,.35,'#7cc8ff',0,0,0,{seg:18,ol:.02});for(let i=0;i<6;i++){const a=i/6*Math.PI*2;box(g,.04,.36,.05,'#ffffff',Math.cos(a)*.38,0,Math.sin(a)*.38,{ry:-a,ol:false});}cyl(g,.02,.02,.35,'#ffd45c',0,.35,0,{seg:6,ol:.008});
  const b=new THREE.Group();b.position.set(0,.85,0);g.add(b);sph(b,.16,'#ff6b6b',0,0,0,{ws:14,hs:10,ol:.012});for(const [r,c] of[[0,'#ffffff'],[1.05,'#ffd45c'],[2.1,'#7cc8ff']])box(b,.025,.33,.33,c,0,0,0,{ry:r,center:true,ol:false});}});
pu('train:bear',{name:'Bear log and tyre swing',stage:3,group:TG,icon:'🐻',pet:'bear',build(g){cyl(g,.25,.25,1.5,'#9b6b4a',-1,.25,0,{rz:Math.PI/2,center:true,seg:12});for(const s of[-1,1])cyl(g,.21,.21,.02,'#e8c98f',-1+s*.755,.25,0,{rz:Math.PI/2,center:true,seg:12,ol:false});
  for(const s of[-1,1])cyl(g,.06,.07,2.2,W2,.9+s*.7,0,0,{rz:s*-.1,seg:8,ol:.012});cyl(g,.06,.06,1.6,W2,.9,2.15,0,{rz:Math.PI/2,center:true,seg:8,ol:.012});for(const s of[-1,1])cyl(g,.01,.01,1.4,'#5a5f8c',.9+s*.1,.75,0,{seg:4,ol:false});
  const t=new THREE.Mesh(new THREE.TorusGeometry(.38,.13,8,18),mat('#3d3550'));t.position.set(.9,.6,0);t.rotation.x=Math.PI/2;g.add(t);const to=new THREE.Mesh(new THREE.TorusGeometry(.38,.15,8,18),OL);to.position.copy(t.position);to.rotation.x=Math.PI/2;g.add(to);}});
pu('train:snake',{name:'Snake flute and woven basket',stage:3,group:TG,icon:'🎶',pet:'snake',build(g){cyl(g,.32,.26,.42,'#e0b56f',0,0,0,{seg:16,ol:.02});for(let i=0;i<4;i++)cyl(g,.325-i*.012,.325-i*.012,.035,'#c4914a',0,.06+i*.1,0,{seg:16,ol:false});cyl(g,.34,.34,.06,'#c4914a',0,.42,0,{seg:16,ol:.012});
  const lid=new THREE.Group();lid.position.set(.62,0,.15);g.add(lid);cyl(lid,.33,.33,.05,'#e0b56f',0,0,0,{seg:16,ol:.012});cone(lid,.08,.1,'#c4914a',0,.05,0,{seg:10,ol:.01});
  const f=new THREE.Group();f.position.set(-.5,.03,.25);f.rotation.y=.6;g.add(f);cyl(f,.025,.035,.45,'#c98f5e',0,.03,0,{rz:Math.PI/2,center:true,seg:8,ol:.008});sph(f,.06,'#c98f5e',-.24,.03,0,{s:[1,1,1],ws:8,hs:6,ol:.008});for(let i=0;i<3;i++)cyl(f,.008,.008,.01,'#3d2c5e',.04+i*.07,.065,0,{seg:5,ol:false});}});

/* stage 3: backyard pieces, levels 1 to 3. Built from the design brief (the approved pictures from the design chat were not available here). Garden beds keep today's plot size (1.8 x 1.2 m) and pot size, so today's seed spots still fit */
const LV=PU_OPT.pick('lv','Level',[['1','Level 1'],['2','Level 2'],['3','Level 3']]);
function lvFence(g,len,lv){if(lv==='1'){const n=Math.max(1,Math.round(len/1.5));for(let i=0;i<=n;i++)box(g,.12,.8,.12,W1,0,0,-len/2+len*i/n,{ol:.02});for(const y of[.3,.62])box(g,.06,.1,len,W1,0,y,0,{ol:.015});}
  else if(lv==='2')fence(g,0,-len/2,0,len/2,null,'#ffffff');
  else{const n=Math.max(1,Math.round(len/2));for(let i=0;i<=n;i++){const z=-len/2+len*i/n;box(g,.26,.9,.26,'#f3e7df',0,0,z,{ol:.02});box(g,.32,.1,.32,'#ddcdd0',0,.9,z,{ol:.015});sph(g,.09,'#ffd45c',0,1.04,z,{ws:8,hs:6,ol:.01});}box(g,.16,.42,len,'#f3e7df',0,0,0,{ol:.015});ironFence(g,0,-len/2,0,len/2,null);}}
pu('yard:fence',{name:'Pet yard fence',stage:3,group:'Backyard · pet yard',icon:'🪵',kind:'line',opts:[LV,PU_OPT.pick('len','Length',[[2,'2 m'],[4,'4 m'],[6,'6 m']])],dflt:{lv:'1',len:4},build(g,o){lvFence(g,+o.len||4,o.lv);}});
pu('yard:gate',{name:'Pet yard gate',stage:3,group:'Backyard · pet yard',icon:'🚪',opts:[LV],dflt:{lv:'1'},build(g,o){const lv=o.lv;const c=lv==='1'?W1:lv==='2'?'#ffffff':'#f3e7df';
  for(const s of[-1,1])box(g,lv==='3'?.3:.16,lv==='3'?1.6:1.2,lv==='3'?.3:.16,c,s*.85,0,0,{ol:.02});
  for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.75,0,0);g.add(p);for(let i=0;i<4;i++)box(p,.08,.75,.05,lv==='3'?'#3c6b58':c,-s*(.1+i*.19),.1,0,{ol:.012});box(p,.72,.07,.06,lv==='3'?'#3c6b58':c,-s*.36,.55,0,{ol:.012});}
  if(lv!=='1'){box(g,1.95,.12,.18,c,0,lv==='3'?1.6:1.2,0,{ol:.015});const sp=signPlane('🐾 Pet Yard',1.4,.36,lv==='3'?'#ff7aa8':'#5fd4b0','#ffffff');sp.position.set(0,(lv==='3'?1.6:1.2)+.32,.1);g.add(sp);}
  if(lv==='3')for(const s of[-1,1])sph(g,.14,'#ffd45c',s*.85,1.72,0,{ws:8,hs:6,ol:.01});}});
pu('yard:ground',{name:'Pet yard ground tile',stage:3,group:'Backyard · pet yard',icon:'🟩',flat:true,opts:[LV],dflt:{lv:'1'},build(g,o){const c={1:'#9ad97a',2:'#a2e48a',3:'#b4ea8e'}[o.lv];flat(g,2,2,c,0,.012,0);if(o.lv!=='1'){for(const [x,z] of[[-.6,-.5],[.5,.4],[-.2,.7],[.7,-.6]])sph(g,.05,'#ffffff',x,.02,z,{s:[1,.3,1],ws:6,hs:4,ol:false});}if(o.lv==='3'){for(const s of[-1,1]){box(g,2,.08,.12,'#f3e7df',0,0,s*.94,{ol:.01});box(g,.12,.08,2,'#f3e7df',s*.94,0,0,{ol:.01});}}if(o.lv==='3')for(const [x,z,c2] of[[-.7,.2,'#ff9ec4'],[.3,-.3,'#ffd45c'],[.6,.7,'#b79cff']]){cyl(g,.01,.01,.12,'#4fae5c',x,0,z,{seg:4,ol:false});sph(g,.04,c2,x,.13,z,{ws:6,hs:4,ol:false});}}});
pu('yard:path',{name:'Pet yard path',stage:3,group:'Backyard · pet yard',icon:'🐾',flat:true,opts:[LV],dflt:{lv:'1'},build(g,o){if(o.lv==='1'){flat(g,1,2,'#d9b382',0,.014,0);}else if(o.lv==='2'){for(let i=0;i<3;i++)cyl(g,.3,.3,.04,'#e9e0f7',0,0,-.66+i*.66,{seg:14,ol:.01});}else{flat(g,1.2,2,'#f3e7df',0,.014,0);for(let i=0;i<4;i++)box(g,1.1,.04,.45,i%2?'#c9a3d6':'#ff9ec4',0,0,-.75+i*.5,{ol:.01});for(const s of[-1,1])box(g,.08,.06,2,'#ffffff',s*.6,0,0,{ol:.008});for(const [x,z] of[[-.25,-.5],[.25,.3]])for(const d of[[-.06,0],[.06,0],[0,.08]])sph(g,.04,'#c9a3d6',x+d[0],.04,z+d[1],{s:[1,.3,1],ws:6,hs:4,ol:false});}}});
pu('yard:deco',{name:'Pet yard decoration',stage:3,group:'Backyard · pet yard',icon:'🌼',opts:[LV],dflt:{lv:'1'},build(g,o){if(o.lv==='1'){cyl(g,.18,.15,.3,'#7cc8ff',0,0,0,{seg:12,ol:.015});cyl(g,.15,.15,.02,'#5fbf74',0,.28,0,{seg:12,ol:false});}
  else if(o.lv==='2'){for(const [x,c] of[[-.25,'#ff9ec4'],[.25,'#ffd45c']]){cyl(g,.16,.12,.28,'#c9805a',x,0,0,{seg:10,ol:.015});for(let i=0;i<5;i++)sph(g,.06,c,x+Math.cos(i*1.3)*.07,.34,Math.sin(i*1.3)*.07,{ws:6,hs:5,ol:.008});}}
  else{cyl(g,.06,.08,1.5,'#5a5f8c',0,0,0,{seg:8,ol:.012});box(g,.26,.3,.26,'#ffffff',0,1.5,0,{ol:.012});sph(g,.11,null,0,1.65,0,{mat:LAMP,ol:false});cone(g,.22,.18,'#ff7aa8',0,1.8,0,{seg:4,ol:.012});sph(g,.2,'#ff9ec4',.35,.15,0,{s:[1,.7,1],ws:8,hs:6,ol:.012});sph(g,.18,'#b79cff',-.35,.12,.1,{s:[1,.7,1],ws:8,hs:6,ol:.012});}}});
pu('garden:bed',{name:'Garden raised bed (plot 1.8 × 1.2 m)',stage:3,group:'Backyard · garden',icon:'🥕',opts:[LV],dflt:{lv:'1'},build(g,o){const lv=o.lv;
  if(lv==='1'){box(g,1.8,.16,1.2,'#b07a52',0,0,0,{ol:.02});box(g,1.66,.02,1.06,'#8a5a3c',0,.15,0,{ol:false});}
  else{const hh=lv==='2'?.32:.42,c=lv==='2'?'#e0905e':'#d9645a',rim=lv==='2'?'#ffffff':'#f3e7df';box(g,1.8,hh,1.2,c,0,0,0,{ol:.02});box(g,1.66,.02,1.06,'#8a5a3c',0,hh+.002,0,{ol:false});
    for(const s of[-1,1]){box(g,1.86,.06,.08,rim,0,hh,s*.6,{ol:.012});box(g,.08,.06,1.26,rim,s*.9,hh,0,{ol:.012});}
    if(lv==='3'){for(let r=0;r<3;r++)for(let k=0;k<6;k++)box(g,.29,.012,.012,'#f3e7df',-.75+k*.3+(r%2)*.15,.12+r*.12,.605,{ol:false});for(const sx of[-1,1])for(const sz of[-1,1])sph(g,.06,'#ffd45c',sx*.9,hh+.08,sz*.6,{ws:6,hs:5,ol:.008});}}
  {const hh={1:.16,2:.32,3:.42}[lv];for(let i=0;i<3;i++)for(let k=0;k<2;k++){const x=-.5+i*.5,z=-.25+k*.5;cyl(g,.008,.008,.08,'#4fae5c',x,hh,z,{seg:4,ol:false});sph(g,.035,'#6fd884',x-.02,hh+.08,z,{s:[1.2,.4,.7],ws:6,hs:4,ol:false});sph(g,.035,'#6fd884',x+.02,hh+.08,z,{s:[1.2,.4,.7],ws:6,hs:4,ol:false});}}}});
pu('garden:pot',{name:'Garden pot (today\'s pot spot)',stage:3,group:'Backyard · garden',icon:'🪴',opts:[LV],dflt:{lv:'1'},build(g,o){if(o.lv==='1'){cyl(g,.26,.2,.3,'#c9805a',0,0,0,{seg:10,ol:.015});cyl(g,.29,.29,.05,'#b8704c',0,.28,0,{seg:10,ol:.012});}
  else if(o.lv==='2'){box(g,.46,.32,.46,'#7cc8ff',0,0,0,{ol:.015});box(g,.52,.06,.52,'#ffffff',0,.3,0,{ol:.012});}
  else{for(const [x,z] of[[-1,-1],[1,-1],[-1,1],[1,1]])sph(g,.05,'#ffd45c',x*.17,.04,z*.17,{ws:6,hs:5,ol:.008});cyl(g,.27,.18,.34,'#ff9ec4',0,.06,0,{seg:14,ol:.015});cyl(g,.31,.31,.06,'#ffffff',0,.38,0,{seg:14,ol:.012});for(let i=0;i<8;i++){const a=i/8*Math.PI*2;sph(g,.03,'#ffffff',Math.cos(a)*.24,.24,Math.sin(a)*.24,{ws:5,hs:4,ol:false});}}
  const top={1:.335,2:.365,3:.445}[o.lv];cyl(g,.22,.22,.02,'#8a5a3c',0,top,0,{seg:12,ol:false});cyl(g,.01,.01,.1,'#4fae5c',0,top,0,{seg:4,ol:false});for(const s of[-1,1])sph(g,.04,'#6fd884',s*.03,top+.1,0,{s:[1.3,.4,.7],ws:6,hs:4,ol:false});}});
pu('garden:fence',{name:'Garden fence',stage:3,group:'Backyard · garden',icon:'🌿',kind:'line',opts:[LV,PU_OPT.pick('len','Length',[[2,'2 m'],[4,'4 m'],[6,'6 m']])],dflt:{lv:'1',len:4},build(g,o){const len=+o.len||4;if(o.lv==='1')fence(g,0,-len/2,0,len/2,null,'#ffffff');else if(o.lv==='2')fence(g,0,-len/2,0,len/2,null,'#ffd6e0');else{const n=Math.max(1,Math.round(len/2));for(let i=0;i<=n;i++){const z=-len/2+len*i/n;box(g,.16,1.0,.16,'#ffffff',0,0,z,{ol:.02});sph(g,.09,'#ffd45c',0,1.06,z,{ws:8,hs:6,ol:.01});}fence(g,0,-len/2,0,len/2,null,'#ffffff');box(g,.3,.2,len-.3,'#e0905e',.25,0,0,{ol:.012});for(let i=0;i<Math.round(len*3);i++)sph(g,.06,['#ff9ec4','#ffffff','#ffd45c','#b79cff'][i%4],.2+((i%2)-.5)*.12,.24,-len/2+.25+i*len/(len*3),{ws:6,hs:5,ol:.008});}}});
pu('garden:path',{name:'Garden path',stage:3,group:'Backyard · garden',icon:'🪨',flat:true,opts:[LV],dflt:{lv:'1'},build(g,o){if(o.lv==='1')for(let i=0;i<3;i++)cyl(g,.3,.3,.03,'#e9e0f7',0,0,-.66+i*.66,{seg:14,ol:.01});else if(o.lv==='2'){flat(g,1,2,'#f6e2b8',0,.014,0);for(let i=0;i<8;i++)sph(g,.05,'#d9c39a',((i*37)%9)/9-.45,.016,-.9+i*.25,{s:[1,.3,1],ws:6,hs:4,ol:false});}else{for(let i=0;i<4;i++)for(let k=0;k<2;k++)box(g,.48,.05,.48,(i+k)%2?'#ffffff':'#c9a3d6',-.25+k*.5,0,-.75+i*.5,{ol:.01});for(const s of[-1,1])box(g,.07,.08,2,'#e0905e',s*.53,0,0,{ol:.01});}}});
pu('garden:edge',{name:'Edge flowers',stage:3,group:'Backyard · garden',icon:'🌸',opts:[LV],dflt:{lv:'1'},build(g,o){const n={1:4,2:7,3:10}[o.lv];const cols=['#ff9ec4','#ffd45c','#ffffff','#b79cff','#ff8a6b'];if(o.lv==='1')box(g,2,.03,.25,'#8a5a3c',0,0,0,{ol:false});if(o.lv!=='1')box(g,2,.12,.3,o.lv==='3'?'#f3e7df':'#b07a52',0,0,0,{ol:.012});
  for(let i=0;i<n;i++){const x=-.9+i*1.8/(n-1||1),h=.18+(i%3)*.06;cyl(g,.012,.012,h,'#4fae5c',x,o.lv==='1'?0:.12,((i%2)-.5)*.1,{seg:4,ol:false});sph(g,o.lv==='3'?.07:.055,cols[i%5],x,(o.lv==='1'?0:.12)+h,((i%2)-.5)*.1,{ws:6,hs:5,ol:.008});}}});

/* stage 6: Farm Lane (one shared farm; nobody owns the animals) */
const FA='Farm Lane';
function farmAnimal(type,col){const root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];let head,tail;const C=col,D=shade(C,-.16),Lt=shade(C,.14);
  const leg=(x,z,h,w,c)=>{const p=new THREE.Group();p.position.set(x,h,z);b.add(p);box(p,w,h,w,c||C,0,-h,0,{ol:.02});legs.push(p);return p;};
  const extra={};
  if(type==='horse'){box(b,.5,.55,1.3,C,0,.75,0);for(const [x,z] of[[-.16,.48],[.16,.48],[-.16,-.48],[.16,-.48]]){const l=leg(x,z,.78,.14);box(l,.16,.12,.16,'#3d3550',0,-.78,0,{ol:.015});}
    const nk=new THREE.Group();nk.position.set(0,1.15,.55);nk.rotation.x=-.55;b.add(nk);box(nk,.3,.7,.34,C,0,0,0,{ol:.02});for(let i=0;i<6;i++)box(nk,.08,.14,.12,D,0,.02+i*.11,-.2,{ol:.012});
    head=new THREE.Group();head.position.set(0,1.62,.82);b.add(head);box(head,.3,.32,.6,C,0,-.1,.1);box(head,.26,.18,.2,Lt,0,-.16,.38,{ol:.015});for(const s of[-1,1]){puEye(head,s*.152,.06,.06);cone(head,.06,.16,C,s*.09,.22,-.08,{seg:4,ol:.015});box(head,.03,.03,.02,INK,s*.06,-.14,.485,{ol:false});}
    tail=new THREE.Group();tail.position.set(0,1.0,-.65);b.add(tail);box(tail,.1,.6,.1,D,0,-.3,-.08,{rx:.35,ol:.015});
    /* the saddle: where a rider sits (rideable, decision 13) */
    box(b,.54,.08,.5,'#ff7aa8',0,1.3,.02,{ol:.015});box(b,.4,.08,.36,'#c94f7c',0,1.38,0,{ol:.012});for(const s of[-1,1])box(b,.03,.3,.05,'#5a5f8c',s*.28,1.0,.05,{ol:false});
    extra.seat=new THREE.Vector3(0,1.42,0);}
  else if(type==='cow'){box(b,.6,.55,1.15,C,0,.6,0);for(const [x,z,w,d] of[[-.31,.1,.02,.4],[.31,-.2,.02,.35],[.15,.58,.25,.02]])box(b,w||.2,.25,d||.3,'#3d3550',x,.8,z,{ol:false});
    for(const [x,z] of[[-.2,.42],[.2,.42],[-.2,-.42],[.2,-.42]]){const l=leg(x,z,.62,.15);box(l,.17,.1,.17,'#3d3550',0,-.62,0,{ol:.015});}
    sph(b,.13,'#ffb3c7',0,.55,-.2,{s:[1.2,.8,1],ws:10,hs:8,ol:.012});for(const [x,z] of[[-.05,-.15],[.05,-.15],[-.05,-.25],[.05,-.25]])cyl(b,.02,.015,.07,'#ff8fb1',x,.42,z,{seg:5,ol:false});   // the udder: milkable
    head=new THREE.Group();head.position.set(0,1.0,.68);b.add(head);box(head,.4,.38,.36,C,0,-.05,0);box(head,.36,.18,.12,'#ffc9d6',0,-.14,.22,{ol:.015});for(const s of[-1,1]){puEye(head,s*.1,.06,.182);box(head,.16,.06,.06,C,s*.27,.08,-.05,{ol:.012});cone(head,.035,.12,'#f6efe0',s*.14,.18,-.05,{rz:s*-.4,seg:6,ol:.012});box(head,.03,.04,.02,INK,s*.07,-.13,.285,{ol:false});}
    tail=new THREE.Group();tail.position.set(0,1.0,-.58);b.add(tail);box(tail,.05,.55,.05,C,0,-.28,-.05,{rx:.15,ol:.012});sph(tail,.06,'#3d3550',0,-.58,-.08,{ws:8,hs:6,ol:.01});
    extra.milk=new THREE.Vector3(0,.4,-.2);}
  else if(type==='sheep'){for(const [x,y,z,r] of[[0,.5,0,.3],[-.14,.56,.2,.22],[.14,.56,.2,.22],[-.14,.56,-.2,.22],[.14,.56,-.2,.22],[0,.7,0,.22],[0,.6,-.28,.2],[0,.6,.26,.2]])sph(b,r,C,x,y,z,{ws:10,hs:8,ol:.018});
    for(const [x,z] of[[-.13,.2],[.13,.2],[-.13,-.2],[.13,-.2]])leg(x,z,.3,.08,'#3d3550');
    head=new THREE.Group();head.position.set(0,.66,.42);b.add(head);box(head,.2,.24,.24,'#3d3550',0,-.05,.04);sph(head,.12,C,0,.1,-.02,{ws:8,hs:6,ol:.012});for(const s of[-1,1]){box(head,.12,.05,.06,'#3d3550',s*.14,.02,-.02,{rz:s*.3,ol:.01});box(head,.04,.05,.02,'#ffffff',s*.055,.02,.161,{ol:false});box(head,.02,.03,.01,INK,s*.055,.02,.172,{ol:false});}
    tail=new THREE.Group();tail.position.set(0,.6,-.45);b.add(tail);sph(tail,.08,C,0,0,0,{ws:8,hs:6,ol:.012});}
  else if(type==='pig'){sph(b,.3,C,0,.38,0,{s:[1,.9,1.4]});for(const [x,z] of[[-.14,.22],[.14,.22],[-.14,-.22],[.14,-.22]])leg(x,z,.18,.1);
    head=new THREE.Group();head.position.set(0,.45,.42);b.add(head);sph(head,.2,C,0,0,0,{s:[1,.92,.9]});cyl(head,.08,.09,.08,shade(C,-.08),0,-.03,.18,{rx:Math.PI/2,center:true,seg:12,ol:.012});for(const s of[-1,1]){box(head,.02,.035,.01,'#c94f7c',s*.03,-.03,.225,{ol:false});puEye(head,s*.08,.06,.16);cone(head,.06,.1,D,s*.12,.17,-.02,{rz:s*-.3,seg:4,ol:.012});}
    tail=new THREE.Group();tail.position.set(0,.45,-.42);b.add(tail);const t=new THREE.Mesh(new THREE.TorusGeometry(.04,.012,6,12,Math.PI*1.6),mat(C));t.rotation.y=Math.PI/2;tail.add(t);}
  else if(type==='chicken'){sph(b,.15,C,0,.24,0,{s:[1,.95,1.25]});for(const s of[-1,1])sph(b,.08,D,s*.13,.25,-.02,{s:[.35,.8,1.2],ws:8,hs:6,ol:.012});
    {const lg=x=>{const p=new THREE.Group();p.position.set(x,.12,0);b.add(p);box(p,.025,.12,.025,'#ffb347',0,-.12,0,{ol:.01});box(p,.07,.015,.08,'#ffb347',0,-.125,.02,{ol:.008});legs.push(p);};lg(-.05);lg(.05);}
    head=new THREE.Group();head.position.set(0,.42,.12);b.add(head);sph(head,.085,C,0,0,0);cone(head,.03,.07,'#ffb347',0,-.01,.1,{rx:Math.PI/2,center:true,seg:6,ol:.008});for(let i=0;i<3;i++)sph(head,.025,'#ff4d4d',0,.085,-.03+i*.03,{ws:6,hs:5,ol:.008});sph(head,.025,'#ff4d4d',0,-.06,.07,{s:[.6,1,.6],ws:6,hs:5,ol:false});puEye(head,-.045,.02,.07,.75);puEye(head,.045,.02,.07,.75);
    tail=new THREE.Group();tail.position.set(0,.32,-.17);b.add(tail);for(const r of[-.35,0,.35])sph(tail,.05,D,r*.12,.07,0,{s:[.4,1.4,.8],rz:r,rx:-.4,ws:8,hs:6,ol:.01});}
  return Object.assign({root,b,legs,head,tail,type,phase:Math.random()*6},extra);}
const FARM_COLS={horse:['#c98f5e','#f6efe0','#5c4033','#3d3550'],cow:['#f6efe0','#c98f5e'],sheep:['#f6f2ec','#3d3550'],pig:['#ffb3c7','#e8b0a0'],chicken:['#ffffff','#e8b765','#a8714a']};
for(const [k,n,ic,note] of[['horse','Horse','🐴','rideable: saddle seat'],['cow','Cow','🐄','milkable'],['sheep','Sheep','🐑','feed and pet'],['pig','Pig','🐖','feed and pet'],['chicken','Chicken','🐔','feed and pet; lays eggs']])
  pu('farm:'+k,{name:n,stage:6,group:FA+' · animals',icon:ic,note,opts:[PU_OPT.col(FARM_COLS[k])],dflt:{c:FARM_COLS[k][0]},build(g,o){g.add(farmAnimal(k,o.c).root);}});
pu('farm:stable',{name:'Stable with stalls',stage:6,group:FA+' · buildings',icon:'🐎',build(g){const W=9,D=4.4,H=3,C='#d9645a';box(g,W,H,.25,C,0,0,-D/2);for(const s of[-1,1])box(g,.25,H,D,C,s*W/2,0,0);box(g,W+.2,.3,D+.2,shade(C,-.15),0,0,0,{ol:.02});
  const rh=1.6,a=D/2+.5,th=Math.atan2(rh,a),Ls=Math.hypot(a,rh)+.1;for(const s of[1,-1])box(g,W+.6,.18,Ls,'#7a5a8c',0,H+rh/2-.05,s*a/2,{rx:s*th,center:true,ol:.04});prism(g,W-.04,D-.04,rh*.96,C,0,H,0,{ol:false});
  for(let i=0;i<4;i++){const x=-W/2+W/4*(i+.5);if(i>0)box(g,.12,1.4,D-.3,'#a8714a',-W/2+W/4*i,0,.1,{ol:.015});box(g,W/4-.2,1.0,.1,'#a8714a',x,0,D/2-.05,{ol:.015});for(const y of[.35,.7])box(g,W/4-.2,.04,.12,'#ffffff',x,y,D/2-.02,{ol:false});box(g,W/4-.3,1.0,.06,'#3d2c5e',x,1.05,D/2+.0,{ol:false});box(g,W/4-.1,.1,.12,'#ffffff',x,2.1,D/2,{ol:.01});cyl(g,.35,.35,.6,'#f2d16b',x+.4,.35,-D/2+.6,{rz:Math.PI/2,center:true,seg:10,ol:.012});}
  for(let i=0;i<4;i++)box(g,.28,.3,.4,'#a8714a',-W/2+W/4*(i+.5)-.5,1.0,-D/2+.35,{ol:.012});}});
pu('farm:barn',{name:'Barn',stage:6,group:FA+' · buildings',icon:'🛖',build(g){const W=8,D=7,H=3.6,C='#d9645a';box(g,W,H,D,C,0,0,0);box(g,W+.16,.3,D+.16,shade(C,-.15),0,0,0,{ol:.02});
  const rh=2.6,a=W/2+.4;for(const s of[1,-1]){box(g,Math.hypot(a*.55,rh*.65)+.1,.2,D+.6,'#7a5a8c',s*a*.73,H+rh*.32,0,{rz:-s*Math.atan2(rh*.65,a*.55),center:true,ol:.04});box(g,Math.hypot(a*.45,rh*.35)+.1,.2,D+.6,'#7a5a8c',s*a*.23,H+rh*.82,0,{rz:-s*Math.atan2(rh*.35,a*.45),center:true,ol:.04});}
  prism(g,D-.04,W-.04,rh*.96,C,0,H,0,{ol:false,ry:Math.PI/2});
  const fz=D/2+.03;box(g,3.2,3.1,.1,'#ffffff',0,0,fz);box(g,3.0,2.9,.1,'#a8414a',0,0,fz+.03,{ol:false});for(const s of[-1,1]){const xg=new THREE.Group();xg.position.set(s*.75,1.45,fz+.1);g.add(xg);for(const r of[.86,-.86])box(xg,.12,2.6,.05,'#ffffff',0,0,0,{rz:r,center:true,ol:false});box(xg,1.4,.12,.05,'#ffffff',0,1.38,0,{center:true,ol:false});box(xg,1.4,.12,.05,'#ffffff',0,-1.38,0,{center:true,ol:false});}box(g,.1,2.9,.06,'#ffffff',0,0,fz+.1,{ol:false});
  box(g,1.4,1.2,.1,'#ffffff',0,H+.5,fz-.02);box(g,1.2,1.0,.1,'#3d2c5e',0,H+.6,fz,{ol:false});for(let i=0;i<4;i++)cyl(g,.3,.3,.4,'#f2d16b',-.4+i*.27,H+.6,fz-.15,{rz:Math.PI/2,center:true,seg:10,ol:.01});
  for(const [x,z] of[[W/2+.6,2],[W/2+.7,1.1],[W/2+.65,1.55]])cyl(g,.42,.42,.85,'#f2d16b',x,.42,z,{rz:Math.PI/2,center:true,seg:12});}});
pu('farm:coop',{name:'Chicken coop with nesting boxes',stage:6,group:FA+' · buildings',icon:'🐣',build(g){const C='#ffd6a0';for(const [x,z] of[[-.8,-.6],[.8,-.6],[-.8,.6],[.8,.6]])box(g,.12,.6,.12,W2,x,0,z,{ol:.015});box(g,1.8,1.1,1.4,C,0,.6,0);box(g,1.85,.08,1.45,W1,0,.6,0,{ol:.015});
  for(const s of[1,-1])box(g,2.2,.12,1.1,'#ff8a8a',0,2.0,s*.42,{rx:s*.55,center:true,ol:.03});prism(g,1.76,1.36,.7,C,0,1.7,0,{ol:false});box(g,.4,.5,.06,'#a8714a',-.4,.7,.71,{ol:.012});const h=new THREE.Mesh(new THREE.CircleGeometry(.12,14),mat('#3d2c5e'));h.position.set(.35,1.3,.71);g.add(h);
  box(g,.5,.05,1.0,W1,-.5,.3,1.1,{rx:-.45,center:true,ol:.012});for(let i=0;i<4;i++)box(g,.5,.03,.04,W2,-.5,.12+i*.13,.8+i*.19,{ol:false});
  /* nesting boxes on the side: eggs to collect */
  for(let i=0;i<3;i++){const z=-.45+i*.45;box(g,.42,.36,.4,W1,1.12,.75,z,{ol:.015});box(g,.36,.06,.34,'#f2d16b',1.15,.95,z,{ol:false});sph(g,.06,'#fff6e6',1.16,1.03,z,{s:[.8,1,.8],ws:8,hs:6,ol:.008});}}});
pu('farm:fence',{name:'Paddock fence',stage:6,group:FA+' · paddock',icon:'🪵',kind:'line',opts:[PU_OPT.pick('len','Length',[[2,'2 m'],[4,'4 m'],[8,'8 m']])],dflt:{len:4},build(g,o){const len=+o.len||4,n=Math.max(1,Math.round(len/2));for(let i=0;i<=n;i++)box(g,.16,1.2,.16,'#ffffff',0,0,-len/2+len*i/n,{ol:.02});for(const y of[.45,.95])box(g,.07,.14,len,'#ffffff',0,y,0,{ol:.015});}});
pu('farm:gate',{name:'Paddock gate',stage:6,group:FA+' · paddock',icon:'🚧',build(g){for(const s of[-1,1])box(g,.2,1.35,.2,'#ffffff',s*1.6,0,0,{ol:.02});for(const y of[.25,.55,.85,1.1])box(g,3,.1,.08,'#ffffff',0,y,0,{ol:.012});const L=Math.hypot(3,.85);box(g,L,.1,.06,'#ffffff',0,.68,.02,{rz:Math.atan2(.85,3),center:true,ol:.012});}});
pu('farm:trough',{name:'Water trough',stage:6,group:FA+' · paddock',icon:'💧',build(g){box(g,1.8,.5,.6,W2,0,0,0,{ol:.02});box(g,1.65,.06,.46,'#7fd8ff',0,.46,0,{ol:false});for(const s of[-1,1])box(g,.12,.12,.7,W1,s*.8,0,0,{ol:.012});}});
pu('farm:hay',{name:'Hay bale',stage:6,group:FA+' · paddock',icon:'🌾',opts:[PU_OPT.pick('shape','Shape',[['round','Round'],['block','Block']])],dflt:{shape:'round'},build(g,o){if(o.shape==='block'){box(g,1,.5,.6,'#f2d16b',0,0,0,{ol:.02});for(const s of[-1,1])box(g,1.02,.04,.04,'#c49a4a',0,.25,s*.18,{ol:false});}else{cyl(g,.5,.5,1,'#f2d16b',0,.5,0,{rz:Math.PI/2,center:true,seg:16});for(const s of[-.25,.25])cyl(g,.505,.505,.05,'#d9a94a',s,.5,0,{rz:Math.PI/2,center:true,seg:16,ol:false});}}});
pu('farm:bucket',{name:'Feed bucket',stage:6,group:FA+' · paddock',icon:'🪣',build(g){cyl(g,.17,.13,.3,'#7cc8ff',0,0,0,{seg:14,ol:.015});cyl(g,.155,.155,.02,'#e8c98f',0,.27,0,{seg:14,ol:false});const h=new THREE.Mesh(new THREE.TorusGeometry(.16,.01,5,16,Math.PI),mat('#5a5f8c'));h.position.y=.3;g.add(h);}});
pu('farm:eggs',{name:'Egg basket',stage:6,group:FA+' · goods',icon:'🥚',carry:true,build(g){cyl(g,.18,.14,.16,'#e0b56f',0,0,0,{seg:14,ol:.015});for(let i=0;i<3;i++)cyl(g,.182-i*.01,.182-i*.01,.02,'#c4914a',0,.03+i*.05,0,{seg:14,ol:false});for(const [x,z] of[[-.06,0],[.06,.03],[0,-.07],[.02,.08]])sph(g,.055,'#fff6e6',x,.18,z,{s:[.8,1,.8],ws:8,hs:6,ol:.008});const h=new THREE.Mesh(new THREE.TorusGeometry(.17,.015,5,16,Math.PI),mat('#c4914a'));h.position.y=.16;g.add(h);}});
pu('farm:milk',{name:'Milk can',stage:6,group:FA+' · goods',icon:'🥛',carry:true,build(g){cyl(g,.15,.16,.38,'#d8dcea',0,0,0,{seg:14,ol:.015});cyl(g,.08,.15,.12,'#d8dcea',0,.38,0,{seg:14,ol:.012});cyl(g,.085,.085,.07,'#7cc8ff',0,.5,0,{seg:14,ol:.012});box(g,.18,.05,.04,'#5a5f8c',0,.36,.15,{ol:false});}});
pu('farm:farmer',{name:'Farmer',stage:6,group:FA+' · people',icon:'🧑‍🌾',opts:[PU_OPT.pick('who','Who',[['a','Farmer Fern'],['b','Farmer Hugo']])],dflt:{who:'a'},
  build(g,o){const L=o.who==='b'?{skin:'#c98d63',hair:'#3d2c5e',style:'short',top:'#c9f2e3',sleeve:'#c9f2e3',bottom:'#5b7fbf',shoes:'#9a6a43',hat:'cowboy',hatc:'#c98f5e',scale:1.15,apron:'#5b7fbf'}:{skin:'#f5cfb0',hair:'#c5874a',style:'ponytail',top:'#ff8a8a',sleeve:'#ff8a8a',bottom:'#5b7fbf',shoes:'#9a6a43',hat:'cap',hatc:'#5fd4b0',scale:1.08,apron:'#5b7fbf'};g.add(makePerson(Object.assign({nohat:true},L)).root);}});
pu('farm:road',{name:'Farm Lane road',stage:6,group:FA+' · road',icon:'🛣️',flat:true,opts:[PU_OPT.pick('len','Length',[[8,'8 m'],[16,'16 m'],[24,'24 m']])],dflt:{len:16},
  build(g,o){const len=+o.len||16,ROAD='#8c90b4',SIDE='#f3e7df',CURB='#ddcdd0';flat(g,8,len,ROAD,0,.02,0);for(const s of[-1,1]){flat(g,3,len,SIDE,s*5.5,.03,0);box(g,.14,.16,len,CURB,s*4,-.08,0,{ol:.015});}for(let t=-len/2+1;t<len/2-.5;t+=3.2)box(g,.16,.012,1.4,'#ffffff',0,.03,t,{ol:false});}});
pu('farm:sign',{name:'Farm sign',stage:6,group:FA+' · road',icon:'🪧',build(g){for(const s of[-1,1])box(g,.16,2.2,.16,W2,s*1.82,0,0,{ol:.02});box(g,3.4,.9,.12,'#ffffff',0,1.3,0,{ol:.02});const sp=signPlane('🌾 Farm Lane',3.2,.7,'#5fd4b0','#ffffff');sp.position.set(0,1.75,.1);g.add(sp);const sb=sp.clone();sb.rotation.y=Math.PI;sb.position.z=-.1;g.add(sb);cone(g,.15,.25,'#ff8a8a',2.1,1.65,0,{rz:-Math.PI/2,center:true,seg:3,ol:.012});}});



;

/* ---------- round 2 (29 Oct, after the picks in Model Compare): later pu() calls replace the first versions ---------- */
/* food bowl: kibble that reads as food (little round discs in warm colours), not brown blobs */
pu('foodbowl',{name:'Food bowl',stage:3,group:'Pet needs items',icon:'🥣',need:'food',v:2,opts:[PU_OPT.pick('full','Look',[['1','Full'],['0','Empty']]),PU_OPT.col(['#ff7aa8','#7cc8ff','#5fd4b0','#ffd45c'])],dflt:{full:'1',c:'#ff7aa8'},
  build(g,o){cyl(g,.15,.11,.08,o.c,0,0,0,{seg:16,ol:.015});cyl(g,.12,.12,.012,shade(o.c,-.2),0,.075,0,{seg:16,ol:false});
    if(o.full==='1'){const K=['#f4b860','#e8935a','#ffd27a','#f0a868'];
      for(let i=0;i<44;i++){const a=i*2.4,r=Math.sqrt(((i*37)%23)/23)*.105,hy=.08+(1-r/.105)*.025+(i%2)*.012;sph(g,.021,K[i%4],Math.cos(a)*r,hy,Math.sin(a)*r,{s:[1,.65,1],ws:8,hs:6,ol:.004});}}}});
/* toy box: open top (no lid), toys peek over the rim */
pu('toybox',{name:'Pet toy box',stage:3,group:'Pet needs items',icon:'🧺',need:'play',v:2,opts:[PU_OPT.col(['#ffd6e0','#cfe8ff','#dff2ea','#fff1b8'])],dflt:{c:'#ffd6e0'},
  build(g,o){const W=.7,D=.45,H=.36,t=.05,c=o.c,d=shade(o.c,-.12);box(g,W,.05,D,c,0,0,0,{ol:.02});
    for(const s of[-1,1]){box(g,W,H,t,c,0,0,s*(D-t)/2,{ol:.02});box(g,t,H,D,c,s*(W-t)/2,0,0,{ol:.02});}
    for(const s of[-1,1]){box(g,W+.04,.04,t+.04,d,0,H,s*(D-t)/2,{ol:.012});box(g,t+.04,.04,D+.04,d,s*(W-t)/2,H,0,{ol:.012});box(g,.02,.08,.18,shade(c,-.2),s*(W/2+.005),.2,0,{ol:false});}
    const tz=(k,x,y,z,r,rz)=>{const p=new THREE.Group();p.position.set(x,y,z);p.rotation.set(0,r,rz||0);g.add(p);PU_TOYS[k].b(p);};
    tz('ball',-.18,.28,.05,0);tz('bone',.1,.3,-.06,.4,.35);tz('yarn',.06,.27,.09,0);tz('rope',-.05,.3,-.1,1.2,-.3);
    cyl(g,.012,.012,.32,'#ffffff',.22,.32,-.08,{rz:-.5,center:true,seg:5,ol:.008});for(const [cc,dz] of[['#7cc8ff',0],['#ffd45c',.03]])sph(g,.045,cc,.3,.46,-.08+dz,{s:[.4,1.5,.4],ws:8,hs:5,ol:.008});}});
/* squeaky bone: a round middle instead of a brick */
PU_TOYS.bone={n:'Squeaky bone',b(g){cyl(g,.026,.026,.17,'#ffffff',0,.032,0,{rz:Math.PI/2,center:true,seg:10,ol:.01});for(const s of[-1,1])for(const t of[-1,1])sph(g,.032,'#ffffff',s*.09,.032,t*.024,{ws:10,hs:8,ol:.01});}};
pu('toy:bone',{name:'Squeaky bone',stage:3,group:'Toys',icon:'🎾',need:'play',carry:true,v:2,build(g){PU_TOYS.bone.b(g);}});
/* snake home: an open woven charmer's basket (no cage), warm stone and sand inside, a little sun lamp leaning over it */
pu('home:tank',{name:'Warm basket (snake home)',stage:3,group:'Big-needs homes',icon:'🧺',pet:'snake',v:2,
  build(g){const B='#e0b56f',D2='#c4914a',R=.55,H=.42;
    cyl(g,R,R*.86,H,B,0,0,0,{seg:20,ol:.02});for(let i=0;i<4;i++)cyl(g,R*.88+i*.035+.005,R*.88+i*.035+.005,.04,D2,0,.06+i*.1,0,{seg:20,ol:false});
    {const t=new THREE.Mesh(new THREE.TorusGeometry(R,.05,8,26),mat(D2));t.rotation.x=Math.PI/2;t.position.y=H;g.add(t);const to=new THREE.Mesh(new THREE.TorusGeometry(R,.07,8,26),OL);to.rotation.x=Math.PI/2;to.position.y=H;g.add(to);}
    cyl(g,R-.05,R-.05,.02,'#f2d38a',0,H-.08,0,{seg:20,ol:false});sph(g,.16,'#b3afc6',-.15,H-.08,.08,{s:[1.4,.5,1],ws:10,hs:6,ol:.012});sph(g,.12,'#ffb36b',.18,H-.07,-.1,{s:[1.3,.4,1],ws:10,hs:6,ol:.01});
    const lid=new THREE.Group();lid.position.set(R+.42,.07,.25);lid.rotation.z=.12;g.add(lid);cyl(lid,R*.9,R*.9,.06,B,0,0,0,{seg:20,ol:.015});cone(lid,.1,.12,D2,0,.06,0,{seg:10,ol:.01});
    /* the sun lamp: a curved post with a warm glowing shade */
    cyl(g,.03,.035,1.15,'#5a5f8c',-R-.15,0,-.15,{seg:8,ol:.01});cyl(g,.025,.025,.5,'#5a5f8c',-R+.06,1.15,-.15,{rz:-1.1,center:true,seg:8,ol:.01});box(g,.24,.04,.24,'#5a5f8c',-R-.15,0,-.15,{ol:.012});
    const sh=new THREE.Mesh(new THREE.ConeGeometry(.15,.16,12,1,true),mat('#ff8a6b'));sh.material=sh.material.clone();sh.material.side=THREE.DoubleSide;sh.position.set(-R+.27,1.0,-.15);sh.rotation.x=Math.PI;g.add(sh);
    sph(g,.06,null,-R+.27,.95,-.15,{mat:toon({color:'#ffb36b',emissive:new THREE.Color('#ff8a3b'),emissiveIntensity:.8}),ol:false});}});
/* stable: Claude's size (9 m, four stalls), ChatGPT's openness: an open front on posts, low stall gates, short partitions, you see inside */
pu('farm:stable',{name:'Stable with stalls',stage:6,group:'Farm Lane · buildings',icon:'🐎',v:2,build(g){const W=9,D=4.4,H=3,C='#d9645a',P='#fff6e4',Wd='#c98f5e';
  box(g,W+.2,.08,D+.2,'#d7c7a5',0,0,0,{ol:.025});box(g,W,H,.2,C,0,.08,-D/2+.1);for(const s of[-1,1])box(g,.2,H,D,C,s*(W/2-.1),.08,0);
  for(let i=0;i<=4;i++)box(g,.2,H,.2,P,-W/2+.1+i*(W-.2)/4,.08,D/2-.1);box(g,W+.2,.22,.24,P,0,H+.08-.22,D/2-.1);
  const rh=1.6,a=D/2+.5,th=Math.atan2(rh,a),Ls=Math.hypot(a,rh)+.1;for(const s of[1,-1])box(g,W+.6,.18,Ls,'#7a5a8c',0,H+rh/2-.05,s*a/2,{rx:s*th,center:true,ol:.04});prism(g,W-.04,D-.04,rh*.96,C,0,H,0,{ol:false});
  for(let i=0;i<4;i++){const x=-W/2+W/4*(i+.5);if(i>0)box(g,.12,1.4,D-.6,Wd,-W/2+W/4*i,.08,-.2,{ol:.015});
    for(const y of[.35,.8])box(g,W/4-.5,.1,.08,Wd,x,y,D/2-.1,{ol:.012});for(const dx of[-.6,0,.6])box(g,.06,.62,.07,Wd,x+dx,.3,D/2-.1,{ol:.01});box(g,W/4-.4,.08,.1,P,x,.95,D/2-.1,{ol:.01});
    cyl(g,.35,.35,.6,'#f2d16b',x+.4,.43,-D/2+.6,{rz:Math.PI/2,center:true,seg:10,ol:.012});box(g,.5,.3,.36,Wd,x-.6,1.0,-D/2+.38,{ol:.012});cyl(g,.4,.4,.06,'#ffd982',x,.08,-.4,{s:[1.2,1,1],seg:12,ol:false});}}});
/* chicken coop: the ramp now runs down from the door to the ground (it pointed up before) */
pu('farm:coop',{name:'Chicken coop with nesting boxes',stage:6,group:'Farm Lane · buildings',icon:'🐣',v:2,build(g){const C='#ffd6a0';for(const [x,z] of[[-.8,-.6],[.8,-.6],[-.8,.6],[.8,.6]])box(g,.12,.6,.12,W2,x,0,z,{ol:.015});box(g,1.8,1.1,1.4,C,0,.6,0);box(g,1.85,.08,1.45,W1,0,.6,0,{ol:.015});
  for(const s of[1,-1])box(g,2.2,.12,1.1,'#ff8a8a',0,2.0,s*.42,{rx:s*.55,center:true,ol:.03});prism(g,1.76,1.36,.7,C,0,1.7,0,{ol:false});box(g,.4,.5,.06,'#a8714a',-.4,.7,.71,{ol:.012});const h=new THREE.Mesh(new THREE.CircleGeometry(.12,14),mat('#3d2c5e'));h.position.set(.35,1.3,.71);g.add(h);
  {const dy=.64,dz=.95,L=Math.hypot(dy,dz),a=Math.atan2(dy,dz),cz=.72+dz/2,cy=dy/2+.025;const r=new THREE.Group();r.position.set(-.4,cy,cz);r.rotation.x=a;g.add(r);box(r,.46,.05,L,W1,0,0,0,{center:true,ol:.012});for(let i=0;i<5;i++)box(r,.46,.03,.04,W2,0,.04,-L/2+.12+i*(L-.24)/4,{center:true,ol:false});}
  for(let i=0;i<3;i++){const z=-.45+i*.45;box(g,.42,.36,.4,W1,1.12,.75,z,{ol:.015});box(g,.36,.06,.34,'#f2d16b',1.15,.95,z,{ol:false});sph(g,.06,'#fff6e6',1.16,1.03,z,{s:[.8,1,.8],ws:8,hs:6,ol:.008});}}});
/* seal: no stand. A big striped beach ball he plays with in his pond (the pond is his home: home:pond) */
pu('train:seal',{name:'Seal beach ball (for the pond)',stage:3,group:'Training gear',icon:'🦭',pet:'seal',v:2,build(g){const r=.28,b=new THREE.Group();b.position.y=r;g.add(b);
  {const C=['#ff4d4d','#ffffff','#ffd45c','#ffffff','#3f9be8','#ffffff'];for(let i=0;i<6;i++)b.add(new THREE.Mesh(new THREE.SphereGeometry(r,8,14,i*Math.PI/3,Math.PI/3),mat(C[i])));hull(b,new THREE.SphereGeometry(r+.014,24,14),b.children[0],{});}
  for(const y of[-1,1])cyl(b,.05,.05,.02,'#ffffff',0,y*(r-.005),0,{center:true,seg:12,ol:.006});}});
/* round 3 (his photo): food bowl = a blue steel bowl with a dark rubber foot, heaped high with chunky kibble */
pu('foodbowl',{name:'Food bowl',stage:3,group:'Pet needs items',icon:'🥣',need:'food',v:2,opts:[PU_OPT.pick('full','Look',[['1','Full'],['0','Empty']]),PU_OPT.col(['#3fb6e8','#ff7aa8','#5fd4b0','#ffd45c'])],dflt:{full:'1',c:'#3fb6e8'},
  build(g,o){cyl(g,.205,.205,.018,'#3d3550',0,0,0,{seg:24,ol:.008});cyl(g,.2,.15,.11,o.c,0,.02,0,{seg:24,ol:.014});
    {const t=new THREE.Mesh(new THREE.TorusGeometry(.2,.012,6,28),mat(shade(o.c,.12)));t.rotation.x=Math.PI/2;t.position.y=.13;g.add(t);}
    cyl(g,.185,.185,.01,shade(o.c,-.25),0,.12,0,{seg:24,ol:false});
    if(o.full==='1'){/* only kibble: close-packed layers of smooth bits heap up into a dome (no filler mound) */
      cyl(g,.185,.185,.012,'#5e3a22',0,.122,0,{seg:24,ol:false});const K=['#c48a5a','#a8714a','#d39a68','#b47a4c'];
      for(const [n,rr,y,off] of[[14,.165,.145,0],[11,.125,.15,.3],[8,.085,.152,.1],[4,.042,.155,.5],[12,.148,.18,.26],[9,.105,.188,.05],[6,.062,.196,.4],[2,.022,.2,0],[8,.1,.222,.2],[5,.055,.232,.6],[1,0,.25,0]])for(let k=0;k<n;k++){const a=k/n*Math.PI*2+off,x=Math.cos(a)*rr,z=Math.sin(a)*rr;
        sph(g,.033,K[(k+n)%4],x,y,z,{s:[1.15,.75,1],ry:a,ws:12,hs:8,ol:.004});}}}});
/* round 3 (his photo): snake home = an indoor glass terrarium (it stands in the house). Black frame, glass doors, plants, a branch, a water strip at the bottom. The light has a switch in the game: off, or one of these colours (ultraviolet, cyberpunk and the cozy palette). It glows in the bar and tints the back glass */
const TER_LIGHT={day:['#fff6d6','#ffe9a8'],warm:['#ffc27a','#ff9a3b'],uv:['#b98cff','#7a2bff'],cyber:['#ff4fd8','#ff2bd6','#2be8ff'],pink:['#ffb3cf','#ff7aa8'],sun:['#ffe38a','#ffd45c'],sky:['#bfe3ff','#7cc8ff'],mint:['#a8ecd8','#5fd4b0'],lilac:['#d9c8ff','#b79cff'],coral:['#ffc0ae','#ff8a6b'],off:['#5a5f72',null]};
pu('home:tank',{name:'Snake terrarium (indoor)',stage:3,group:'Big-needs homes',icon:'🐍',pet:'snake',v:2,opts:[PU_OPT.pick('light','Light switch',[['day','Daylight'],['warm','Warm'],['uv','Ultraviolet'],['cyber','Cyberpunk'],['pink','Pink'],['sun','Sunny yellow'],['sky','Sky blue'],['mint','Mint'],['lilac','Lilac'],['coral','Coral'],['off','Off']])],dflt:{light:'day'},
  build(g,o){const W=.9,D=.5,H=1.0,F='#2b2838',f=.03;
    box(g,W+.04,.06,D+.04,F,0,0,0,{ol:.012});for(const x of[-1,1])for(const z of[-1,1])box(g,.04,.06,.04,F,x*(W/2-.02),-.0,z*(D/2-.02),{ol:false});
    /* gravel and a water strip behind the low front glass */
    box(g,W-.04,.12,D-.04,'#c9b48a',0,.06,0,{ol:false});box(g,W-.06,.05,.17,null,0,.17,.14,{mat:WATER,ol:false});
    for(const [x,c] of[[-.3,'#8a85a3'],[.05,'#b3afc6'],[.32,'#7a7592']])sph(g,.06,c,x,.19,-.05,{s:[1.4,.6,1],ws:8,hs:6,ol:.008});
    /* the frame */
    for(const x of[-1,1])for(const z of[-1,1])box(g,f,H,f,F,x*(W/2-f/2),.06,z*(D/2-f/2),{ol:.008});
    for(const y of[.06,.26,.06+H-f])for(const z of[-1,1])box(g,W,f,f,F,0,y,z*(D/2-f/2),{ol:.008});for(const y of[.06,.06+H-f])for(const x of[-1,1])box(g,f,f,D,F,x*(W/2-f/2),y,0,{ol:.008});
    box(g,.015,H-.24,.02,F,0,.27,D/2-f/2,{ol:false});for(const s of[-1,1])box(g,.02,.08,.02,F,s*.035,.6,D/2,{ol:false});
    /* the mesh top and the lamp bar under it */
    box(g,W-.02,.01,D-.02,'#4a4658',0,.06+H-.005,0,{ol:false});const L=TER_LIGHT[o.light]||TER_LIGHT.day;
    box(g,W*.7,.04,.08,'#3d3550',0,.06+H+.005,-.05,{ol:.01});const glow=(c,e)=>toon({color:e,emissive:new THREE.Color(e),emissiveIntensity:.55});
    /* the glowing strip runs along the front of the lamp housing (seen from any side), and a soft beam falls from it */
    const strip=(c,e,x,w)=>{box(g,w,.02,.06,null,x,.06+H-.02,-.05,{mat:e?glow(c,e):mat(c),ol:false});box(g,w,.025,.012,null,x,.06+H+.012,-.01,{mat:e?glow(c,e):mat(c),ol:false});
      if(e){const m=new THREE.MeshBasicMaterial({color:e,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide});const bm=new THREE.Mesh(new THREE.CylinderGeometry(w*.5,w*.62,H-.32,4,1,true),m);bm.rotation.y=Math.PI/4;bm.scale.z=.45;bm.position.set(x,.06+H/2+.15,-.05);g.add(bm);}};
    if(L[2]){strip(L[0],L[1],-W*.165,W*.33);strip('#9ff6ff',L[2],W*.165,W*.33);}else strip(L[0],L[1],0,W*.66);
    /* the light's colour washes the back of the tank (a soft glowing panel just inside the back glass) */
    if(L[1]){const bk=(c,x,w)=>{const m=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.5,depthWrite:false});const p=new THREE.Mesh(new THREE.PlaneGeometry(w,H-.3),m);p.position.set(x,.06+(H+.3)/2,-(D/2-f-.01));g.add(p);};
      if(L[2]){bk(L[1],-W/4+.01,W/2-.06);bk(L[2],W/4-.01,W/2-.06);}else bk(L[1],0,W-.08);}
    /* inside: one climbing branch from corner to corner, and three potted-in-gravel plants (stems with leaves on them) */
    const B='#8a5a36';{const L=.82,a=.72;cyl(g,.028,.036,L,B,-.02,.2+Math.cos(a)*L/2,-.1,{rz:-a,center:true,seg:7,ol:.01});cyl(g,.022,.026,.3,B,.1,.55,-.1,{rz:.9,center:true,seg:7,ol:.01});}
    const Lf=['#5fbf74','#4fae5c','#8fd97e','#6fc25a'];
    for(const [x,z,h,n,i] of[[-.3,-.12,.55,5,0],[.28,-.13,.45,4,1],[.02,-.15,.35,4,2]]){cyl(g,.012,.016,h,'#4f8f4a',x,.18,z,{seg:5,ol:.006});
      for(let k=0;k<n;k++){const a=k/n*Math.PI*2+i,hy=.18+h*(.45+.55*k/n),r=.07;sph(g,.075,Lf[(k+i)%4],x+Math.cos(a)*r,hy,z+Math.sin(a)*r*.7,{s:[1,.2,.55],ry:-a,rz:Math.cos(a)*.4,rx:Math.sin(a)*.4,ws:10,hs:6,ol:.007});}}
    /* glass on all four sides (front split in two doors), clear and see-through */
    const G=new THREE.MeshToonMaterial({color:'#d6f2ff',gradientMap:GRAD,transparent:true,opacity:.18,depthWrite:false});
    for(const [w,h,x,y,z,ry] of[[W-.04,H-.04,0,.06+H/2,-(D/2-f/2),0],[W-.04,H-.04,0,.06+H/2,D/2-f/2,0],[D-.04,H-.04,-(W/2-f/2),.06+H/2,0,Math.PI/2],[D-.04,H-.04,W/2-f/2,.06+H/2,0,Math.PI/2]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),G);p.material.side=THREE.DoubleSide;p.position.set(x,y,z);p.rotation.y=ry;g.add(p);}}});

/* ---------- round 4 (29 Oct evening, his comments on the Claude-only models) ---------- */
/* new pets: more like the real animal, still cartoon. makePUPet is wrapped: these four types use the new makers */
const PU_NEW={};
PU_NEW.monkey=col=>{const T=PU_PET_TYPES.monkey,C=col||T.cols[0],D=shade(C,-.14),Lt='#f2d2b0',root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const leg=(x,z,h,w,c)=>{const p=new THREE.Group();p.position.set(x,h,z);b.add(p);box(p,w,h,w,c||C,0,-h,0,{ol:.015});legs.push(p);return p;};
  /* an upright, leaning body on long arms and short legs */
  sph(b,.14,C,0,.3,-.02,{s:[1,1.25,1],rx:-.45});sph(b,.09,Lt,0,.28,.07,{s:[1,1.25,.6],rx:-.45,ol:false});
  for(const s of[-1,1]){const a=leg(s*.11,.12,.34,.055);sph(a,.04,Lt,0,-.35,.02,{s:[1,.6,1.2],ws:8,hs:6,ol:.01});}
  for(const s of[-1,1]){const l=leg(s*.08,-.1,.16,.07);box(l,.08,.035,.12,Lt,0,-.16,.02,{ol:.01});}
  const head=new THREE.Group();head.position.set(0,.52,.12);b.add(head);
  sph(head,.13,C,0,0,0,{s:[1,.95,.95]});
  /* the heart-shaped light face and a round muzzle */
  for(const s of[-1,1])sph(head,.06,Lt,s*.042,.025,.085,{s:[1,1.05,.55],ws:12,hs:9,ol:false});sph(head,.07,Lt,0,-.04,.095,{s:[1.15,.85,.8],ws:12,hs:9,ol:.008});
  for(const s of[-1,1])box(head,.012,.008,.006,INK,s*.016,-.02,.15,{ol:false});box(head,.05,.008,.006,INK,0,-.065,.148,{ol:false});
  puEye(head,-.042,.035,.118,.9);puEye(head,.042,.035,.118,.9);box(head,.16,.02,.03,D,0,.075,.1,{ol:false});
  /* big round ears out to the sides */
  for(const s of[-1,1]){sph(head,.055,C,s*.14,.01,-.01,{s:[.4,1,1],ws:12,hs:8,ol:.01});sph(head,.036,Lt,s*.152,.01,.0,{s:[.3,1,1],ws:10,hs:6,ol:false});}
  /* a long tail that curls at the end */
  const tail=new THREE.Group();tail.position.set(0,.2,-.15);b.add(tail);
  /* the tail sweeps back and down, then rises and curls into a spiral at the tip */
  {const P=[];for(let i=0;i<=14;i++){const t=i/14;P.push([0,.02-Math.sin(t*Math.PI)*.12+t*.3,-.04-t*.3]);}for(let i=0;i<=12;i++){const a=i/12*Math.PI*1.7,r=.08*(1-i/18);P.push([0,.32+Math.sin(a)*r,-.42+r-Math.cos(a)*r]);}
   P.forEach(([x,y,z],i)=>sph(tail,.022-(i>20?(i-20)*.0012:0),C,x,y,z,{ws:8,hs:6,ol:.007}));}
  root.scale.setScalar(T.scale);return{root,b,legs,tail,head,type:'monkey',phase:Math.random()*6};};
PU_NEW.bear=col=>{const T=PU_PET_TYPES.bear,C=col||T.cols[0],D=shade(C,-.16),Lt=shade(C,.18),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const leg=(x,z,h,w)=>{const p=new THREE.Group();p.position.set(x,h,z);b.add(p);box(p,w,h,w,C,0,-h,0,{ol:.018});box(p,w+.02,.05,w+.05,D,0,-h,.015,{ol:.012});legs.push(p);return p;};
  /* a long heavy body, a shoulder hump, the head carried low in front */
  sph(b,.2,C,0,.33,-.02,{s:[1,.85,1.6]});sph(b,.15,C,0,.44,.14,{s:[1,.8,1.1]});sph(b,.16,C,0,.36,-.22,{s:[1,.9,1]});
  leg(-.1,.2,.24,.1);leg(.1,.2,.24,.1);leg(-.1,-.22,.22,.11);leg(.1,-.22,.22,.11);
  const head=new THREE.Group();head.position.set(0,.4,.38);b.add(head);
  sph(head,.13,C,0,0,0,{s:[1,.9,1]});cyl(head,.05,.075,.13,Lt,0,-.03,.11,{rx:Math.PI/2,center:true,seg:14,ol:.012});
  sph(head,.028,INK,0,-.012,.18,{s:[1.3,.9,1],ws:8,hs:6,ol:false});box(head,.02,.03,.005,INK,0,-.045,.172,{ol:false});
  puEye(head,-.06,.045,.105,.8);puEye(head,.06,.045,.105,.8);
  for(const s of[-1,1]){sph(head,.042,C,s*.09,.1,-.03,{s:[1,1,.55],ws:10,hs:8,ol:.01});sph(head,.024,Lt,s*.09,.1,-.01,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  const tail=new THREE.Group();tail.position.set(0,.38,-.36);b.add(tail);sph(tail,.035,C,0,0,0,{ws:8,hs:6,ol:.01});
  root.scale.setScalar(T.scale);return{root,b,legs,tail,head,type:'bear',phase:Math.random()*6};};
/* snake: a long thin body (so it can slither behind you), a flat head a little wider than the neck, a tapered tail; darker purple by default */
PU_PET_TYPES.snake.cols=['#6b4a9a','#4a3a6e','#3f7a5a','#8a5a36'];PU_PET_TYPES.snake.scale=1;
PU_NEW.snake=col=>{const T=PU_PET_TYPES.snake,C=col||T.cols[0],D=shade(C,-.16),Lt=shade(C,.25),root=new THREE.Group(),b=new THREE.Group();root.add(b);const segs=[];const N=28;
  for(let i=0;i<N;i++){const g=new THREE.Group();const r=i<2?.05:i>N-12?.056*(1-(i-(N-12))/13):.056;g.position.set(Math.sin(i*.42)*.11,r,.12-i*.055);b.add(g);
    sph(g,r,C,0,0,0,{s:[1,.85,1.45],ws:12,hs:8,ol:.01});sph(g,r*.8,Lt,0,-r*.35,0,{s:[1,.5,1.3],ws:8,hs:5,ol:false});if(i%2===0&&i>1&&i<N-4)sph(g,r*.5,D,0,r*.7,0,{s:[1.2,.35,1],ws:8,hs:5,ol:false});segs.push(g);}
  const head=new THREE.Group();head.position.set(0,.06,.21);b.add(head);
  sph(head,.075,C,0,0,0,{s:[1.15,.62,1.45],ws:14,hs:9});sph(head,.04,D,0,.028,-.01,{s:[1.1,.3,1.2],ws:8,hs:5,ol:false});
  for(const s of[-1,1]){sph(head,.02,'#ffe680',s*.047,.022,.03,{ws:8,hs:6,ol:.006});box(head,.006,.022,.008,INK,s*.055,.022,.04,{ol:false});}
  box(head,.01,.005,.07,'#ff4d6d',0,-.012,.11,{ol:false});for(const s of[-1,1])box(head,.006,.005,.03,'#ff4d6d',s*.008,-.012,.155,{ry:s*.4,ol:false});
  root.scale.setScalar(T.scale);return{root,b,legs:[],tail:segs[N-1],head,type:'snake',segs,phase:Math.random()*6};};
/* seal, the second look: a smooth torpedo body lying on its belly, the chest and head held up, big dark eyes, whiskers, flippers */
const makeSeal2=col=>{const C=col||PU_PET_TYPES.seal.cols[0],D=shade(C,-.18),Lt=shade(C,.2),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.16,C,0,.14,0,{s:[1,.8,2.3]});sph(b,.1,C,0,.1,-.36,{s:[1,.72,1.5]});sph(b,.12,Lt,0,.09,.08,{s:[1,.5,1.8],ol:false});
  for(const [x,z] of[[.06,.1],[-.08,-.05],[.05,-.2],[-.04,.2],[.09,-.1]])sph(b,.018,D,x,.25,z,{s:[1,.4,1],ws:6,hs:4,ol:false});
  for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.13,.1,.17);b.add(p);sph(p,.08,D,s*.03,-.04,.02,{s:[.35,.14,1],rz:s*.5,ry:s*.3,ws:10,hs:6,ol:.01});legs.push(p);}
  const tail=new THREE.Group();tail.position.set(0,.07,-.5);b.add(tail);for(const s of[-1,1])sph(tail,.08,D,s*.045,0,-.04,{s:[.5,.14,1],ry:s*.35,ws:10,hs:6,ol:.01});
  sph(b,.11,C,0,.25,.24,{s:[1,1.1,1]});
  const head=new THREE.Group();head.position.set(0,.37,.3);b.add(head);
  sph(head,.1,C,0,0,0,{s:[1,.95,1.08]});sph(head,.055,Lt,0,-.035,.085,{s:[1.35,.8,1],ol:.008});sph(head,.016,INK,0,-.012,.14,{s:[1.4,.8,.8],ws:8,hs:6,ol:false});
  for(const s of[-1,1]){sph(head,.026,INK,s*.045,.025,.075,{ws:10,hs:8,ol:false});sph(head,.009,'#ffffff',s*.045+.008,.035,.098,{ws:6,hs:4,ol:false});
    for(const dy of[0,-.015])box(head,.09,.004,.004,'#ffffff',s*.07,-.04+dy,.11,{rz:s*(dy?-.15:.1),ol:false});}
  root.scale.setScalar(PU_PET_TYPES.seal.scale);return{root,b,legs,tail,head,type:'seal',phase:Math.random()*6};};
{const _mk=makePUPet;makePUPet=function(type,col){return PU_NEW[type]?PU_NEW[type](col):_mk(type,col);};}
for(const k of['monkey','bear','snake']){const T=PU_PET_TYPES[k];pu('pet:'+k,{name:T.many.replace(/s$/,''),stage:4,group:'New pets',icon:T.icon,pet:k,v:2,opts:[AGE_OPT,PU_OPT.col(T.cols)],dflt:{age:'baby',c:T.cols[0]},build(g,o){g.add(puPet(k,o.c,o.age,o.outfit).root);}});}
{const T=PU_PET_TYPES.seal;pu('pet:seal',{name:'Seal',stage:4,group:'New pets',icon:T.icon,pet:'seal',v:2,opts:[PU_OPT.pick('look','Look',[['round','First (round)'],['real','Seal-like (new)']]),AGE_OPT,PU_OPT.col(T.cols)],dflt:{look:'real',age:'baby',c:T.cols[0]},
  build(g,o){if(o.look==='round'){g.add(puPet('seal',o.c,o.age,o.outfit).root);return;}g.add(puAge(makeSeal2(o.c),o.age||'adult').root);}});}

/* farm: the horse (its neck leaned back like a camel: now it reaches forward, a long head angled down, a flat saddle) and a fluffier sheep */
{const _fa=farmAnimal;farmAnimal=function(type,col){if(type==='horse')return horse2(col);if(type==='sheep')return sheep2(col);return _fa(type,col);};}
function horse2(col){const C=col,D=shade(C,-.18),Lt=shade(C,.14),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];let head,tail;
  box(b,.44,.46,1.2,C,0,.8,0);sph(b,.27,C,0,1.03,.5,{s:[.85,.9,.8]});sph(b,.27,C,0,1.04,-.5,{s:[.88,.9,.85]});
  for(const [x,z] of[[-.14,.48],[.14,.48],[-.14,-.5],[.14,-.5]]){const p=new THREE.Group();p.position.set(x,.82,z);b.add(p);box(p,.11,.82,.12,C,0,-.82,0,{ol:.018});box(p,.14,.1,.15,'#3d3550',0,-.82,0,{ol:.012});legs.push(p);}
  const nk=new THREE.Group();nk.position.set(0,1.12,.6);nk.rotation.x=.55;b.add(nk);box(nk,.24,.72,.3,C,0,0,0,{ol:.02});
  for(let i=0;i<7;i++)box(nk,.1,.12,.1,D,0,.06+i*.1,-.17,{ol:.012});
  head=new THREE.Group();head.position.set(0,1.74,.98);b.add(head);
  {const h=new THREE.Group();h.rotation.x=.75;head.add(h);box(h,.24,.26,.56,C,0,-.13,.12,{ol:.02});box(h,.22,.22,.18,Lt,0,-.12,.36,{ol:.015});for(const s of[-1,1])box(h,.03,.04,.02,INK,s*.06,-.04,.455,{ol:false});
    for(const s of[-1,1]){puEye(h,s*.123,.03,.02,.8);cone(h,.05,.14,C,s*.08,.12,-.12,{seg:4,ol:.012});}box(h,.08,.06,.14,D,0,.12,-.02,{ol:.01});}
  tail=new THREE.Group();tail.position.set(0,1.16,-.66);b.add(tail);sph(tail,.07,D,0,0,0,{ws:8,hs:6,ol:.012});box(tail,.12,.72,.1,D,0,-.72,-.06,{rx:.28,ol:.015});
  /* a flat saddle on the back (rideable) */
  box(b,.5,.03,.6,'#ffd6e0',0,1.26,.02,{ol:.012});box(b,.4,.07,.42,'#c94f7c',0,1.28,.0,{ol:.012});box(b,.12,.06,.06,'#c94f7c',0,1.33,.18,{ol:.01});for(const s of[-1,1])box(b,.03,.32,.05,'#5a5f8c',s*.23,.96,.05,{ol:false});
  return{root,b,legs,head,tail,type:'horse',phase:Math.random()*6,seat:new THREE.Vector3(0,1.36,0)};}
function sheep2(col){const C=col,root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];let head,tail;
  sph(b,.28,C,0,.52,0,{s:[1,.85,1.25],ws:16,hs:12});
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2,y=.52+((i%3)-1)*.12;sph(b,.12,C,Math.cos(a)*.24,y+.04,Math.sin(a)*.3,{ws:10,hs:8,ol:.014});}
  for(const [x,z] of[[0,0],[.1,.12],[-.1,-.1],[0,-.2],[0,.18]])sph(b,.12,C,x,.74,z,{ws:10,hs:8,ol:.014});
  for(const [x,z] of[[-.12,.17],[.12,.17],[-.12,-.17],[.12,-.17]]){const p=new THREE.Group();p.position.set(x,.3,z);b.add(p);box(p,.07,.3,.07,'#3d3550',0,-.3,0,{ol:.012});legs.push(p);}
  head=new THREE.Group();head.position.set(0,.58,.4);b.add(head);sph(head,.12,'#3d3550',0,0,.02,{s:[.85,1,1.2]});sph(head,.085,C,0,.1,-.02,{ws:10,hs:8,ol:.012});
  for(const s of[-1,1]){sph(head,.05,'#3d3550',s*.13,.03,-.02,{s:[1.3,.45,.7],rz:s*-.4,ws:8,hs:6,ol:.01});sph(head,.022,'#ffffff',s*.05,.04,.11,{ws:8,hs:6,ol:false});sph(head,.012,INK,s*.05,.04,.128,{ws:6,hs:4,ol:false});}
  sph(head,.012,'#ff9ec4',0,-.04,.15,{s:[1.5,1,1],ws:6,hs:4,ol:false});
  tail=new THREE.Group();tail.position.set(0,.6,-.38);b.add(tail);sph(tail,.07,C,0,0,0,{ws:8,hs:6,ol:.012});
  return{root,b,legs,head,tail,type:'sheep',phase:Math.random()*6};}
for(const k of['horse','sheep'])pu('farm:'+k,Object.assign({},PU['farm:'+k],{v:2}));

/* garden edge flowers: real, majestic flowers (tulips, roses, tall spires), more and taller with each level */
function gTulip(g,x,z,h,c){cyl(g,.008,.008,h,'#4f9a52',x,0,z,{seg:5,ol:false});sph(g,.035,c,x,h+.03,z,{s:[1,1.35,1],ws:10,hs:8,ol:.006});for(let k=0;k<3;k++){const a=k*2.1;sph(g,.026,shade(c,.08),x+Math.cos(a)*.022,h+.04,z+Math.sin(a)*.022,{s:[.6,1.5,.4],ry:-a,ws:8,hs:6,ol:false});}
  for(const s of[-1,1])sph(g,.04,'#5fae5c',x+s*.02,h*.3,z,{s:[.3,1.8,.12],rz:s*.35,ws:8,hs:6,ol:.005});}
function gRose(g,x,z,h,c){cyl(g,.009,.009,h,'#3f7a45',x,0,z,{seg:5,ol:false});for(let k=0;k<6;k++){const a=k*1.05;sph(g,.03,c,x+Math.cos(a)*.03,h+.01,z+Math.sin(a)*.03,{s:[1,.55,1],rx:Math.sin(a)*.6,rz:-Math.cos(a)*.6,ws:8,hs:6,ol:.005});}
  sph(g,.028,shade(c,-.12),x,h+.03,z,{ws:8,hs:6,ol:.005});for(const s of[-1,1])sph(g,.03,'#4f9a52',x+s*.04,h*.6,z,{s:[1.2,.2,.6],rz:s*.3,ws:8,hs:5,ol:false});}
function gSpire(g,x,z,h,c){cyl(g,.01,.012,h,'#4f9a52',x,0,z,{seg:5,ol:false});for(let k=0;k<9;k++){const t=k/8,r=.032*(1-t*.6),y=h*.45+t*h*.55;for(let j=0;j<3;j++){const a=j*2.1+k*.8;sph(g,r,k%2?c:shade(c,.12),x+Math.cos(a)*r*.9,y,z+Math.sin(a)*r*.9,{ws:7,hs:5,ol:.004});}}
  for(const s of[-1,1])sph(g,.06,'#5fae5c',x+s*.05,.06,z,{s:[1.2,.2,.5],rz:s*.25,ws:8,hs:5,ol:.005});}
pu('garden:edge',{name:'Edge flowers',stage:3,group:'Backyard · garden',icon:'🌸',v:2,opts:[LV],dflt:{lv:'1'},build(g,o){const lv=o.lv;
  if(lv==='1')box(g,2,.04,.3,'#8a5a3c',0,0,0,{ol:false});else box(g,2.04,.1,.36,lv==='3'?'#e8e2d6':'#b07a52',0,0,0,{ol:.012});
  if(lv==='3')for(let i=0;i<7;i++)box(g,.27,.05,.36,i%2?'#d9d2c4':'#e8e2d6',-.85+i*.285,.1,0,{ol:.008});
  const top=lv==='1'?.04:lv==='2'?.1:.15,P=new THREE.Group();P.position.y=top;g.add(P);
  const TC=['#ff4d6d','#ffd45c','#ff9ec4','#b79cff','#ffffff'],RC=['#ff6b8a','#ffb3c7','#ffffff','#ff8a6b'],SC=['#9b7cf0','#5f8cff','#ff7aa8','#ffffff'];
  if(lv==='1')for(let i=0;i<6;i++)gTulip(P,-.8+i*.32,(i%2-.5)*.08,.22+(i%3)*.04,TC[i%5]);
  else if(lv==='2'){for(let i=0;i<5;i++)gTulip(P,-.85+i*.42,.07,.24+(i%2)*.04,TC[i%5]);for(let i=0;i<3;i++)gRose(P,-.62+i*.62,-.03,.32,RC[i]);for(const x of[-.92,.92])gSpire(P,x,-.08,.5,SC[0]);}
  else{for(let i=0;i<5;i++)gSpire(P,-.8+i*.4,-.09,.62+(i%2)*.12,SC[i%4]);for(let i=0;i<4;i++)gRose(P,-.6+i*.4,0,.4,RC[i%4]);for(let i=0;i<6;i++)gTulip(P,-.85+i*.34,.1,.24+(i%2)*.04,TC[i%5]);}}});

/* garden pot: a real-life step up per level: plain terracotta with a saucer, a glazed ceramic pot, a stone urn on a pedestal */
pu('garden:pot',{name:'Garden pot (today\'s pot spot)',stage:3,group:'Backyard · garden',icon:'🪴',v:2,opts:[LV],dflt:{lv:'1'},build(g,o){let top;
  if(o.lv==='1'){cyl(g,.28,.28,.03,'#b8704c',0,0,0,{seg:16,ol:.012});cyl(g,.25,.19,.3,'#c9805a',0,.03,0,{seg:16,ol:.015});cyl(g,.27,.27,.06,'#b8704c',0,.3,0,{seg:16,ol:.012});top=.355;}
  else if(o.lv==='2'){const G='#3f6fd8';sph(g,.26,G,0,.24,0,{s:[1,.9,1],ws:20,hs:12});cyl(g,.16,.18,.05,shade(G,-.15),0,0,0,{seg:16,ol:.01});cyl(g,.21,.21,.06,G,0,.42,0,{seg:20,ol:.012});
    const t=new THREE.Mesh(new THREE.TorusGeometry(.262,.012,6,32),mat('#ffffff'));t.rotation.x=Math.PI/2;t.position.y=.27;g.add(t);for(let i=0;i<10;i++){const a=i/10*Math.PI*2;sph(g,.014,'#ffffff',Math.cos(a)*.25,.33,Math.sin(a)*.25,{ws:6,hs:4,ol:false});}top=.47;}
  else{const S='#e8e2d6',S2='#d4cdbf';box(g,.42,.08,.42,S2,0,0,0,{ol:.012});box(g,.34,.18,.34,S,0,.08,0,{ol:.012});cyl(g,.08,.12,.16,S,0,.26,0,{seg:14,ol:.012});
    cyl(g,.34,.16,.3,S,0,.42,0,{seg:20,ol:.015});const t=new THREE.Mesh(new THREE.TorusGeometry(.34,.035,8,32),mat(S2));t.rotation.x=Math.PI/2;t.position.y=.72;g.add(t);
    top=.74;}
  const r=o.lv==='3'?.31:o.lv==='2'?.19:.24;cyl(g,r,r,.02,'#6e4a32',0,top-.035,0,{seg:16,ol:false});
  /* the plant grows with the pot: a sprout, a leafy plant, a full flowering bush */
  if(o.lv==='1'){cyl(g,.01,.01,.12,'#4fae5c',0,top-.02,0,{seg:4,ol:false});for(const s of[-1,1])sph(g,.045,'#6fd884',s*.035,top+.1,0,{s:[1.3,.4,.7],ws:8,hs:5,ol:false});}
  else{const n=o.lv==='2'?6:10,R=o.lv==='2'?.13:.24;for(let i=0;i<n;i++){const a=i/n*Math.PI*2;sph(g,R*.55,i%2?'#5fae5c':'#6fc25a',Math.cos(a)*R*.55,top+R*.45+(i%3)*.03,Math.sin(a)*R*.55,{ws:10,hs:8,ol:.008});}sph(g,R*.6,'#4f9a52',0,top+R*.8,0,{ws:10,hs:8,ol:.008});
    if(o.lv==='3')for(let i=0;i<9;i++){const a=i*2.1,rr=.12+(i%3)*.05;sph(g,.04,['#ff9ec4','#ffffff','#ffd45c'][i%3],Math.cos(a)*rr*.9,top+.16+(i%4)*.05,Math.sin(a)*rr*.9,{ws:8,hs:6,ol:.006});}}}});

/* pet yard gate: an English garden gate (pickets rising to an arch, a latch), in the same wood, paint and colours as that level's fence; level 3 adds a rose arbour */
pu('yard:gate',{name:'Pet yard gate',stage:3,group:'Backyard · pet yard',icon:'🚪',v:2,opts:[LV],dflt:{lv:'1'},build(g,o){const lv=o.lv,c=lv==='1'?W1:lv==='2'?'#ffffff':'#f3e7df',pc=lv==='3'?'#3c6b58':c,PH=lv==='3'?1.25:1.1;
  for(const s of[-1,1]){box(g,lv==='3'?.24:.14,PH,lv==='3'?.24:.14,c,s*.78,0,0,{ol:.02});if(lv!=='1')sph(g,lv==='3'?.1:.07,lv==='3'?'#ffd45c':c,s*.78,PH+.06,0,{ws:10,hs:8,ol:.01});else box(g,.18,.05,.18,W2,s*.78,PH,0,{ol:.012});}
  const n=9,Wg=1.3;for(let i=0;i<n;i++){const x=-Wg/2+.07+i*(Wg-.14)/(n-1),u=x/(Wg/2),h=.72+.22*(1-u*u);box(g,.07,h,.04,pc,x,.08,0,{ol:.01});
    if(lv==='2')cone(g,.05,.07,pc,x,.08+h,0,{seg:4,ry:Math.PI/4,ol:.008});else if(lv==='3')sph(g,.03,pc,x,.08+h+.02,0,{ws:8,hs:6,ol:.008});}
  for(const y of[.22,.62])box(g,Wg-.04,.07,.05,pc,0,y,-.03,{ol:.01});
  if(lv==='1'){const L=Math.hypot(Wg-.2,.38);box(g,L,.06,.04,W2,0,.42,-.045,{rz:Math.atan2(.38,Wg-.2),center:true,ol:.008});}
  {const r=new THREE.Mesh(new THREE.TorusGeometry(.035,.008,6,12),mat('#3d3550'));r.position.set(.55,.55,.04);g.add(r);}
  if(lv==='3'){const a=new THREE.Mesh(new THREE.TorusGeometry(.78,.05,8,28,Math.PI),mat('#3c6b58'));a.position.y=PH+.12;g.add(a);const ao=new THREE.Mesh(new THREE.TorusGeometry(.78,.07,8,28,Math.PI),OL);ao.position.copy(a.position);g.add(ao);
    for(let i=0;i<13;i++){const t=i/12*Math.PI,x=Math.cos(t)*.78,y=PH+.12+Math.sin(t)*.78;sph(g,.07,'#5fae5c',x,y,.04,{s:[1.2,.8,.6],ws:8,hs:6,ol:.006});if(i%2===0)sph(g,.05,i%4?'#ff9ec4':'#ffffff',x,y+.03,.08,{ws:8,hs:6,ol:.006});}}}});

/* capybara bath: a calm, zen hot tub: a cedar tub, yuzu floating, a bamboo spout, steam, stones and big green leaves */
pu('train:capybara',{name:'Capybara zen bath',stage:3,group:'Training gear',icon:'♨️',pet:'capybara',v:2,build(g){const Wd='#c98f5e';
  cyl(g,.72,.7,.42,Wd,0,0,0,{seg:24,ol:.02});for(const y of[.08,.3])cyl(g,.73,.73,.04,'#5a5f8c',0,y,0,{seg:24,ol:false});{const t=new THREE.Mesh(new THREE.TorusGeometry(.72,.035,8,32),mat(shade(Wd,-.1)));t.rotation.x=Math.PI/2;t.position.y=.445;g.add(t);}
  const w=new THREE.Mesh(new THREE.CircleGeometry(.68,28),WATER);w.rotation.x=-Math.PI/2;w.position.y=.425;g.add(w);
  for(const [x,z] of[[.25,.1],[-.3,-.2],[.05,.38],[-.1,.05],[.35,-.3]])sph(g,.085,'#ffd45c',x,.43,z,{s:[1,.85,1],ws:10,hs:8,ol:.008});
  /* the bamboo spout on a post, pouring in */
  box(g,.1,.9,.1,'#a8714a',.95,0,0,{ol:.012});cyl(g,.04,.04,.6,'#8fc96a',.68,.88,0,{rz:Math.PI/2-.2,center:true,seg:10,ol:.01});for(const x of[.55,.75])cyl(g,.042,.042,.02,'#6fae4f',x,.86+(x-.68)*.2,0,{rz:Math.PI/2-.2,center:true,seg:10,ol:false});
  cyl(g,.012,.012,.42,'#bfe6ff',.39,.42,0,{seg:6,ol:false});
  /* soft steam */
  const St=new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.45,depthWrite:false});for(const [x,y,z,r] of[[-.1,.6,0,.14],[.15,.75,-.1,.11],[-.05,.92,.1,.09]]){const m=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),St);m.position.set(x,y,z);g.add(m);}
  /* stones, big leaves and bamboo stalks round the back */
  for(let i=0;i<9;i++){const a=Math.PI*.15+i*Math.PI*.95/8,r=.92;sph(g,.13+(i%3)*.03,i%2?'#8a85a3':'#a7a3b5',Math.cos(a)*r,.06,-Math.sin(a)*r,{s:[1.3,.55,1],ws:10,hs:6,ol:.012});}
  /* leafy plants growing from the ground: a short stem per leaf, each leaf fanning out */
  for(const [x,z] of[[-.95,-.5],[-.62,-.92],[.62,-.88]]){sph(g,.12,'#4f9a52',x,.06,z,{s:[1.4,.5,1.4],ws:10,hs:6,ol:.008});for(let k=0;k<6;k++){const a=k*1.05,lx=x+Math.cos(a)*.18,lz=z+Math.sin(a)*.18;cyl(g,.012,.012,.3,'#3f7a45',x+Math.cos(a)*.08,.05,z+Math.sin(a)*.08,{rz:-Math.cos(a)*.5,rx:Math.sin(a)*.5,seg:4,ol:false});sph(g,.17,k%2?'#5fae5c':'#6fc25a',lx,.32,lz,{s:[1,.1,.55],ry:-a,rz:-Math.cos(a)*.35,rx:Math.sin(a)*.35,ws:12,hs:6,ol:.008});}}
  for(const [x,z] of[[.15,-1.0],[.3,-.98],[.45,-.92]]){cyl(g,.025,.025,1.3,'#8fc96a',x,0,z,{seg:8,ol:.01});for(let k=1;k<4;k++)cyl(g,.027,.027,.02,'#6fae4f',x,k*.32,z,{seg:8,ol:false});sph(g,.09,'#6fc25a',x+.05,1.3,z,{s:[1.4,.25,.5],rz:-.4,ws:8,hs:5,ol:.006});}
  /* a little wooden bucket */
  cyl(g,.1,.09,.14,Wd,-.85,0,.45,{seg:12,ol:.01});cyl(g,.101,.101,.02,'#5a5f8c',-.85,.08,.45,{seg:12,ol:false});}});

/* dog house: a proper little house: plank walls, white trim, an arched door, a red roof with eaves, a bone sign and a cushion inside */
pu('doghouse',{name:'Dog house',stage:3,group:'Pet needs items',icon:'🏠',need:'rest',v:2,opts:[PU_OPT.col(['#e0905e','#7cc8ff','#ff9ec4','#5fd4b0','#ffd45c'])],dflt:{c:'#e0905e'},build(g,o){const C=o.c,D=shade(C,-.12),T='#ffffff',R='#d9645a',W=.9,Dp=1.0,H=.72,rh=.42;
  box(g,W+.12,.06,Dp+.12,'#a8714a',0,0,0,{ol:.015});box(g,W,H,Dp,C,0,.06,0);
  for(let i=1;i<6;i++){const y=.06+i*H/6;for(const s of[-1,1])box(g,.006,.012,Dp-.02,D,s*(W/2+.002),y,0,{ol:false});box(g,W-.02,.012,.006,D,0,y,-Dp/2-.002,{ol:false});}
  for(const x of[-1,1])for(const z of[-1,1])box(g,.06,H,.06,T,x*(W/2-.01),.06,z*(Dp/2-.01),{ol:.01});
  prism(g,Dp-.02,W-.02,rh,C,0,.06+H,0,{ry:Math.PI/2,ol:false});
  {const a=W/2+.12,th=Math.atan2(rh,W/2),L=Math.hypot(a,rh*(a/(W/2)))+.02;for(const s of[-1,1])box(g,L,.05,Dp+.24,R,s*a/2*.98,.06+H+rh/2+.02,0,{rz:-s*th,center:true,ol:.02});box(g,.08,.06,Dp+.26,shade(R,-.15),0,.06+H+rh+.01,0,{center:true,ol:.012});}
  box(g,.38,.36,.02,'#2e2347',0,.06,Dp/2+.002,{ol:false});{const d=new THREE.Mesh(new THREE.CircleGeometry(.19,20,0,Math.PI),mat('#2e2347'));d.position.set(0,.42,Dp/2+.003);g.add(d);
    const t=new THREE.Mesh(new THREE.TorusGeometry(.2,.022,6,20,Math.PI),mat(T));t.position.set(0,.42,Dp/2+.01);g.add(t);for(const s of[-1,1])box(g,.044,.36,.03,T,s*.2,.06,Dp/2+.01,{ol:false});}
  cyl(g,.16,.16,.06,'#ff9ec4',0,.06,Dp/2-.25,{seg:16,ol:.008});
  {const b=new THREE.Group();b.position.set(0,.06+H+.14,Dp/2+.03);g.add(b);cyl(b,.018,.018,.16,T,0,0,0,{rz:Math.PI/2,center:true,seg:8,ol:.008});for(const s of[-1,1])for(const t of[-1,1])sph(b,.022,T,s*.08,t*.016,0,{ws:8,hs:6,ol:.008});}}});

/* ---------- round 5 (30 Oct, his second comments) ---------- */
/* food bowl: less food: a low, even layer just over the rim with a small heap in the middle */
{const F=PU.foodbowl,ob=F.build;F.build=function(g,o){if(o.full!=='1')return ob.call(this,g,o);ob.call(this,g,Object.assign({},o,{full:'0'}));
  cyl(g,.185,.185,.012,'#5e3a22',0,.122,0,{seg:24,ol:false});const K=['#c48a5a','#a8714a','#d39a68','#b47a4c'];
  for(const [n,rr,y,off] of[[14,.165,.128,0],[11,.125,.132,.3],[8,.085,.135,.1],[4,.042,.138,.5],[1,0,.14,0],[5,.07,.158,.2],[1,0,.163,0]])for(let k=0;k<n;k++){const a=k/n*Math.PI*2+off;
    sph(g,.033,K[(k+n)%4],Math.cos(a)*rr,y,Math.sin(a)*rr,{s:[1.15,.75,1],ry:a,ws:12,hs:8,ol:.004});}};F.v=2;}
/* monkey: a bigger head, a jutting muzzle, a brow, bigger ears, slim rounded arms and hands, a tuft on top */
PU_NEW.monkey=col=>{const T=PU_PET_TYPES.monkey,C=col||T.cols[0],D=shade(C,-.16),Lt='#f2d2b0',root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.12,C,0,.3,-.02,{s:[.9,1.3,.95],rx:-.45});sph(b,.075,Lt,0,.28,.06,{s:[.9,1.25,.55],rx:-.45,ol:false});
  for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.1,.4,.1);b.add(p);cyl(p,.05,.042,.4,C,0,-.4,0,{seg:10,ol:.012});sph(p,.048,Lt,0,-.4,.02,{s:[1,.6,1.3],ws:10,hs:6,ol:.01});legs.push(p);}
  for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.075,.2,-.1);b.add(p);cyl(p,.055,.045,.2,C,0,-.2,0,{seg:10,ol:.012});sph(p,.04,Lt,0,-.2,.03,{s:[1,.5,1.5],ws:10,hs:6,ol:.01});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,.54,.13);b.add(head);
  sph(head,.15,C,0,0,0,{s:[1,.95,.95],ws:16,hs:12});
  for(const s of[-1,1])sph(head,.065,Lt,s*.045,.03,.095,{s:[1,1.05,.55],ws:12,hs:9,ol:false});
  sph(head,.08,Lt,0,-.05,.11,{s:[1.2,.85,1],ws:14,hs:10,ol:.008});box(head,.17,.028,.05,D,0,.075,.115,{ol:.006});
  for(const s of[-1,1]){box(head,.014,.01,.006,INK,s*.018,-.02,.19,{ol:false});sph(head,.022,'#ffb3a0',s*.07,-.04,.12,{s:[1,.7,.4],ws:8,hs:5,ol:false});}box(head,.06,.01,.006,INK,0,-.085,.183,{ol:false});
  puEye(head,-.045,.035,.135,1);puEye(head,.045,.035,.135,1);
  for(const s of[-1,1]){sph(head,.068,C,s*.16,-.005,-.01,{s:[.4,1,1],ws:12,hs:8,ol:.01});sph(head,.045,Lt,s*.172,-.005,.005,{s:[.3,1,1],ws:10,hs:6,ol:false});}
  for(const [x,z] of[[0,0],[-.03,-.03],[.03,-.02]])sph(head,.03,D,x,.14,z,{s:[.8,1.2,.8],ws:8,hs:6,ol:.006});
  const tail=new THREE.Group();tail.position.set(0,.2,-.14);b.add(tail);
  {const P=[];for(let i=0;i<=14;i++){const t=i/14;P.push([0,.02-Math.sin(t*Math.PI)*.12+t*.3,-.04-t*.3]);}for(let i=0;i<=12;i++){const a=i/12*Math.PI*1.7,r=.08*(1-i/18);P.push([0,.32+Math.sin(a)*r,-.42+r-Math.cos(a)*r]);}
   P.forEach(([x,y,z],i)=>sph(tail,.02-(i>20?(i-20)*.001:0),C,x,y,z,{ws:8,hs:6,ol:.007}));}
  root.scale.setScalar(T.scale);return{root,b,legs,tail,head,type:'monkey',phase:Math.random()*6};};
/* bear: standing taller on longer, rounded legs, a deep body with a strong hump, a longer muzzle, ears on top */
PU_NEW.bear=col=>{const T=PU_PET_TYPES.bear,C=col||T.cols[0],D=shade(C,-.16),Lt=shade(C,.2),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const leg=(x,z,h,r)=>{const p=new THREE.Group();p.position.set(x,h,z);b.add(p);cyl(p,r,r*.9,h,C,0,-h,0,{seg:12,ol:.016});sph(p,r*1.15,D,0,-h+.025,.03,{s:[1,.5,1.3],ws:10,hs:6,ol:.01});legs.push(p);return p;};
  sph(b,.2,C,0,.44,-.04,{s:[1,.95,1.6],ws:16,hs:12});sph(b,.16,C,0,.58,.12,{s:[1,.75,1.05]});sph(b,.17,C,0,.46,-.24,{s:[1.02,.95,1]});sph(b,.13,Lt,0,.36,.08,{s:[.9,.5,1.4],ol:false});
  leg(-.1,.2,.32,.065);leg(.1,.2,.32,.065);leg(-.1,-.26,.3,.07);leg(.1,-.26,.3,.07);
  const head=new THREE.Group();head.position.set(0,.5,.4);b.add(head);
  sph(head,.13,C,0,0,0,{s:[1,.9,1],ws:16,hs:12});cyl(head,.05,.07,.17,Lt,0,-.035,.13,{rx:Math.PI/2,center:true,seg:14,ol:.012});
  sph(head,.03,INK,0,-.02,.22,{s:[1.3,.9,1],ws:8,hs:6,ol:false});box(head,.02,.03,.005,INK,0,-.055,.205,{ol:false});
  for(const s of[-1,1])sph(head,.018,INK,s*.06,.04,.105,{ws:8,hs:6,ol:false});for(const s of[-1,1])sph(head,.006,'#ffffff',s*.06+.006,.048,.12,{ws:5,hs:4,ol:false});
  for(const s of[-1,1]){sph(head,.05,C,s*.085,.12,-.03,{s:[1,1,.55],ws:10,hs:8,ol:.01});sph(head,.028,Lt,s*.085,.12,-.005,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  const tail=new THREE.Group();tail.position.set(0,.5,-.4);b.add(tail);sph(tail,.035,C,0,0,0,{ws:8,hs:6,ol:.01});
  root.scale.setScalar(T.scale);return{root,b,legs,tail,head,type:'bear',phase:Math.random()*6};};
/* snake: a bit longer */
{const mk=PU_NEW.snake;PU_NEW.snake=col=>{const T=PU_PET_TYPES.snake,C=col||T.cols[0],D=shade(C,-.16),Lt=shade(C,.25),root=new THREE.Group(),b=new THREE.Group();root.add(b);const segs=[];const N=38;
  for(let i=0;i<N;i++){const g=new THREE.Group();const r=i<2?.05:i>N-14?.056*(1-(i-(N-14))/15):.056;g.position.set(Math.sin(i*.36)*.12,r,.12-i*.055);b.add(g);
    sph(g,r,C,0,0,0,{s:[1,.85,1.45],ws:12,hs:8,ol:.01});sph(g,r*.8,Lt,0,-r*.35,0,{s:[1,.5,1.3],ws:8,hs:5,ol:false});if(i%2===0&&i>1&&i<N-4)sph(g,r*.5,D,0,r*.7,0,{s:[1.2,.35,1],ws:8,hs:5,ol:false});segs.push(g);}
  const head=new THREE.Group();head.position.set(0,.06,.21);b.add(head);
  sph(head,.075,C,0,0,0,{s:[1.15,.62,1.45],ws:14,hs:9});sph(head,.05,D,0,.034,-.01,{s:[1.1,.3,1.2],ws:8,hs:5,ol:false});
  for(const s of[-1,1]){sph(head,.024,'#ffe680',s*.058,.026,.035,{ws:8,hs:6,ol:.006});box(head,.007,.026,.009,INK,s*.067,.026,.046,{ol:false});}
  box(head,.012,.006,.08,'#ff4d6d',0,-.014,.13,{ol:false});for(const s of[-1,1])box(head,.007,.006,.034,'#ff4d6d',s*.009,-.014,.18,{ry:s*.4,ol:false});
  root.scale.setScalar(T.scale);return{root,b,legs:[],tail:segs[N-1],head,type:'snake',segs,phase:Math.random()*6};};}
for(const k of['monkey','bear','snake'])PU['pet:'+k].v=2;
/* horse: graceful: a smooth body, long slender legs with knees, an arched neck, a fine head, a flowing mane and tail */
function horse3(col){const C=col,D=shade(C,-.2),Lt=shade(C,.14),M=C==='#3d3550'?'#2a2338':D,root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.32,C,0,1.06,0,{s:[.7,.75,1.8],ws:18,hs:12});sph(b,.25,C,0,1.03,.42,{s:[.82,.95,.9],ws:14,hs:10});sph(b,.26,C,0,1.1,-.42,{s:[.86,.88,.9],ws:14,hs:10});
  for(const [x,z] of[[-.12,.42],[.12,.42],[-.12,-.44],[.12,-.44]]){const p=new THREE.Group();p.position.set(x,.92,z);b.add(p);cyl(p,.062,.045,.46,C,0,-.46,0,{seg:10,ol:.014});sph(p,.05,C,0,-.46,0,{ws:8,hs:6,ol:.01});cyl(p,.04,.036,.4,C,0,-.86,0,{seg:10,ol:.012});cyl(p,.055,.06,.07,'#3d3550',0,-.92,0,{seg:10,ol:.01});legs.push(p);}
  /* the arched neck: a smooth chain from the chest up and forward */
  const q=(t,a,b2,c)=>a*(1-t)*(1-t)+2*b2*t*(1-t)+c*t*t;
  for(let i=0;i<=10;i++){const t=i/10,y=q(t,1.14,1.62,1.76),z=q(t,.48,.6,.84),r=.15-t*.065;sph(b,r,C,0,y,z,{ws:12,hs:9,ol:.014});sph(b,.055-t*.012,M,0,y+r*.6,z-r*.75,{s:[.6,1.1,1],ws:8,hs:6,ol:.008});}
  const head=new THREE.Group();head.position.set(0,1.76,.9);b.add(head);
  {const h=new THREE.Group();h.rotation.x=.95;head.add(h);sph(h,.1,C,0,0,.12,{s:[.78,.82,1.7],ws:14,hs:10});sph(h,.08,Lt,0,0,.3,{s:[.85,.8,1],ws:12,hs:8,ol:.01});
    for(const s of[-1,1]){sph(h,.012,INK,s*.04,.04,.36,{ws:6,hs:4,ol:false});sph(h,.022,INK,s*.072,.04,.07,{ws:8,hs:6,ol:false});sph(h,.007,'#ffffff',s*.078,.05,.085,{ws:5,hs:4,ol:false});cone(h,.032,.11,C,s*.045,-.01,-.06,{rx:-1.3,seg:6,ol:.01});}
    sph(h,.05,M,0,.06,0,{s:[.8,.5,1.2],ws:8,hs:6,ol:.008});}
  /* a long tail that flows down and back */
  const tail=new THREE.Group();tail.position.set(0,1.18,-.64);b.add(tail);for(let i=0;i<9;i++){const t=i/8;sph(tail,.06-t*.015,M,0,-t*.62,-.06-Math.sin(t*1.4)*.2,{s:[.7,1.2,1],ws:8,hs:6,ol:.008});}
  /* a flat saddle on the back (rideable) */
  sph(b,.21,'#ffd6e0',0,1.255,.02,{s:[1.15,.08,1.3],ws:14,hs:6,ol:.01});box(b,.34,.05,.36,'#c94f7c',0,1.27,0,{ol:.012});box(b,.1,.05,.06,'#c94f7c',0,1.31,.16,{ol:.01});for(const s of[-1,1])box(b,.025,.3,.04,'#5a5f8c',s*.24,.98,.04,{ol:false});
  return{root,b,legs,head,tail,type:'horse',phase:Math.random()*6,seat:new THREE.Vector3(0,1.34,0)};}
/* sheep: chibi-cute: a round wool body of even puffs, a big soft face with rosy cheeks, big shiny eyes, a smile, a curly topknot, pink inner ears */
function sheep3(col){const C=col,F=col==='#3d3550'?'#2e2638':'#f2d6c9',root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.25,C,0,.45,0,{s:[1,.9,1.15],ws:18,hs:12});
  for(let r=0;r<3;r++){const n=[10,9,6][r],y=[.36,.5,.64][r],R=[.24,.25,.16][r];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+r*.3;sph(b,.1,C,Math.cos(a)*R,y,Math.sin(a)*R*1.15,{ws:12,hs:8,ol:.012});}}
  sph(b,.1,C,0,.7,0,{ws:12,hs:8,ol:.012});
  for(const [x,z] of[[-.11,.14],[.11,.14],[-.11,-.14],[.11,-.14]]){const p=new THREE.Group();p.position.set(x,.24,z);b.add(p);cyl(p,.035,.032,.24,'#3d3550',0,-.24,0,{seg:8,ol:.01});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,.6,.32);b.add(head);
  sph(head,.13,F,0,0,0,{s:[1,.95,.9],ws:16,hs:12});
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;sph(head,.045,C,Math.cos(a)*.06,.12+Math.sin(a)*.015,Math.sin(a)*.05-.02,{ws:8,hs:6,ol:.008});}sph(head,.05,C,0,.15,0,{ws:8,hs:6,ol:.008});
  for(const s of[-1,1]){sph(head,.03,'#ffffff',s*.052,.02,.1,{ws:10,hs:8,ol:false});sph(head,.019,INK,s*.052,.015,.122,{ws:8,hs:6,ol:false});sph(head,.007,'#ffffff',s*.052+.007,.025,.137,{ws:5,hs:4,ol:false});
    sph(head,.022,'#ffb3c7',s*.085,-.04,.08,{s:[1,.6,.4],ws:8,hs:5,ol:false});
    const e=new THREE.Group();e.position.set(s*.13,.03,-.01);e.rotation.z=s*-.5;head.add(e);sph(e,.055,F,s*.03,0,0,{s:[1.3,.42,.7],ws:10,hs:6,ol:.008});sph(e,.035,'#ffb3c7',s*.035,.012,.008,{s:[1.2,.25,.55],ws:8,hs:5,ol:false});}
  {const m=new THREE.Mesh(new THREE.TorusGeometry(.02,.005,6,12,Math.PI),mat(INK));m.position.set(0,-.06,.115);m.rotation.z=Math.PI;head.add(m);}sph(head,.012,'#e89aa8',0,-.035,.12,{s:[1.4,.8,.6],ws:6,hs:4,ol:false});
  const tail=new THREE.Group();tail.position.set(0,.5,-.3);b.add(tail);sph(tail,.07,C,0,0,0,{ws:10,hs:8,ol:.01});
  return{root,b,legs,head,tail,type:'sheep',phase:Math.random()*6};}
{const _fa=farmAnimal;farmAnimal=function(type,col){if(type==='horse')return horse3(col);if(type==='sheep')return sheep3(col);return _fa(type,col);};}

/* ---------- round 6 (30 Oct): smooth tails and necks (one bent tube, not a chain of balls), real-world proportions ---------- */
/* tube: a smooth tapered tube along a curve through the points, with the same ink outline as the game's shapes */
function tubeGeo(pts,r0,r1,seg,rad,grow){const cv=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));const fr=cv.computeFrenetFrames(seg,false);const P=[],I=[];
  for(let i=0;i<=seg;i++){const t=i/seg,c=cv.getPointAt(t),r=(typeof r0==='function'?r0(t):r0+(r1-r0)*t)+grow;for(let j=0;j<=rad;j++){const a=j/rad*Math.PI*2,n=fr.normals[i].clone().multiplyScalar(Math.cos(a)).add(fr.binormals[i].clone().multiplyScalar(Math.sin(a)));P.push(c.x+n.x*r,c.y+n.y*r,c.z+n.z*r);}}
  for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const a=i*(rad+1)+j,b=a+rad+1;I.push(a,a+1,b,b,a+1,b+1);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();return{g,cv};}
function tube(g,pts,r0,r1,c,o={}){const seg=o.seg||24,rad=o.rad||12,{g:geo,cv}=tubeGeo(pts,r0,r1,seg,rad,0);const m=new THREE.Mesh(geo,mat(c));g.add(m);
  const ol=o.ol===false?0:(o.ol||.012);if(ol){const h=new THREE.Mesh(tubeGeo(pts,r0,r1,seg,rad,ol).g,OL);g.add(h);}
  const rr=t=>typeof r0==='function'?r0(t):r0+(r1-r0)*t;if(o.caps!==false)for(const t of[0,1]){const p=cv.getPointAt(t);sph(g,rr(t),c,p.x,p.y,p.z,{ws:12,hs:8,ol:ol||false});}return m;}

/* monkey: the tail is one smooth tube that sweeps back and curls at the tip */
{const mk=PU_NEW.monkey;PU_NEW.monkey=col=>{const m=mk(col),C=col||PU_PET_TYPES.monkey.cols[0];for(const o of [...m.tail.children])m.tail.remove(o);
  const P=[[0,.02,-.02],[0,-.06,-.14],[0,.02,-.28],[0,.18,-.38],[0,.32,-.4],[0,.4,-.34],[0,.38,-.27],[0,.32,-.27],[0,.31,-.32]];tube(m.tail,P,t=>.026-t*.01,0,C,{seg:40,rad:10,ol:.008});return m;};}

/* capybara (today's game pet, redrawn after the notebook's capybara): a low bean body on tiny legs, a huge blunt barrel head with a flat front, a wide dark nose on top, small bead eyes set high and wide, tiny ears on the top corners, no tail */
const CAPY_COLS=['#b8793f','#a8714a','#8a5a36','#d9a468'];
function capy2(col){const C=col||CAPY_COLS[0],Lt=shade(C,.12),Dk=shade(C,-.1),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.3,C,0,.3,-.06,{s:[1,.8,1.58],ws:20,hs:14});sph(b,.24,Lt,0,.24,.04,{s:[.9,.5,1.3],ol:false});sph(b,.22,Dk,0,.47,-.08,{s:[.9,.18,1.25],ws:14,hs:6,ol:false});
  for(const [x,z] of[[-.14,.2],[.14,.2],[-.14,-.26],[.14,-.26]]){const p=new THREE.Group();p.position.set(x,.2,z);b.add(p);tube(p,[[0,.04,0],[0,-.08,.01],[0,-.17,.02]],.065,.055,C,{seg:8,rad:12,ol:.012,caps:false});sph(p,.06,Dk,0,-.175,.035,{s:[1,.45,1.3],ws:10,hs:6,ol:.01});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,.5,.42);head.scale.setScalar(1.15);b.add(head);
  sph(head,.19,C,0,0,-.02,{s:[1,.88,1.05],ws:18,hs:12});
  /* the blunt, flat-fronted barrel snout */
  cyl(head,.155,.165,.2,C,0,-.025,.11,{rx:Math.PI/2,center:true,seg:20,s:[1,1,.8],ol:.014});  sph(head,.05,'#4a2e22',0,.065,.2,{s:[1.6,.55,.45],ws:12,hs:8,ol:false});for(const s of[-1,1])sph(head,.009,'#2a1a14',s*.035,.065,.218,{ws:6,hs:4,ol:false});
  box(head,.07,.008,.006,'#4a2e22',0,-.085,.214,{ol:false});
  for(const s of[-1,1]){sph(head,.022,INK,s*.115,.11,.1,{ws:10,hs:8,ol:false});sph(head,.007,'#ffffff',s*.115+.007,.119,.118,{ws:6,hs:4,ol:false});sph(head,.03,'#d98a6a',s*.12,-.02,.12,{s:[1,.6,.35],ws:8,hs:5,ol:false});}
  for(const s of[-1,1]){sph(head,.035,C,s*.12,.13,-.08,{s:[1,1,.55],ws:10,hs:8,ol:.008});sph(head,.02,Dk,s*.12,.13,-.065,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6};}
{const _mp=makePet;makePet=function(type,col){return type==='capybara'?capy2(col&&col!==PET_TYPES.capybara.cols[0]?col:CAPY_COLS[0]):_mp(type,col);};}
PU['age:capybara'].v=2;

/* bear: real bear build: a cub is round and big-headed (cute), the adult is massive: big shoulders and hump, thick column legs, a longer muzzle, a smaller head for its body */
PU_NEW.bear=col=>{const T=PU_PET_TYPES.bear,C=col||T.cols[0],D=shade(C,-.16),Lt=shade(C,.2),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const leg=(x,z,h,r0,r1)=>{const p=new THREE.Group();p.position.set(x,h,z);b.add(p);tube(p,[[0,0,0],[0,-h*.5,.01],[0,-h+.03,0]],r0,r1,C,{seg:8,rad:12,ol:.014});sph(p,r1*1.25,D,0,-h+.03,.035,{s:[1,.45,1.35],ws:12,hs:6,ol:.01});legs.push(p);return p;};
  /* body: a long barrel, massive shoulders with a hump, a lower rump */
  sph(b,.22,C,0,.46,-.06,{s:[1,.92,1.75],ws:18,hs:12});sph(b,.2,C,0,.52,.16,{s:[1.05,1.02,1],ws:16,hs:12});sph(b,.12,C,0,.68,.12,{s:[1,.6,1.3],ws:12,hs:8});sph(b,.18,C,0,.46,-.3,{s:[1,.92,1],ws:16,hs:10});
  sph(b,.15,Lt,0,.34,.06,{s:[.9,.45,1.6],ol:false});
  leg(-.12,.2,.38,.085,.07);leg(.12,.2,.38,.085,.07);leg(-.12,-.32,.36,.08,.07);leg(.12,-.32,.36,.08,.07);
  /* the head: a bit low and forward, a long tapering muzzle, small round ears up top */
  const head=new THREE.Group();head.position.set(0,.56,.42);b.add(head);
  sph(head,.13,C,0,0,-.01,{s:[1,.92,1.05],ws:16,hs:12});tube(head,[[0,-.01,.04],[0,-.03,.12],[0,-.045,.2]],.085,.055,Lt,{seg:8,rad:14,ol:.012});
  sph(head,.032,INK,0,-.03,.255,{s:[1.35,.9,1],ws:8,hs:6,ol:false});box(head,.02,.03,.005,INK,0,-.07,.245,{ol:false});
  for(const s of[-1,1]){sph(head,.017,INK,s*.062,.045,.1,{ws:8,hs:6,ol:false});sph(head,.006,'#ffffff',s*.062+.006,.052,.114,{ws:5,hs:4,ol:false});}
  for(const s of[-1,1]){sph(head,.045,C,s*.085,.115,-.04,{s:[1,1,.55],ws:10,hs:8,ol:.01});sph(head,.025,Lt,s*.085,.115,-.018,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  const tail=new THREE.Group();tail.position.set(0,.5,-.47);b.add(tail);sph(tail,.035,C,0,0,0,{ws:8,hs:6,ol:.01});
  root.scale.setScalar(T.scale);return{root,b,legs,tail,head,type:'bear',phase:Math.random()*6};};
/* a cub's head and paws are bigger and its legs shorter (puAge does this): make the baby rounder still */
{const pa=puAge;puAge=function(m,age){if(m.type==='bear'&&age==='baby'){m.b.scale.y*=1.06;}return pa(m,age);};}

/* horse with real proportions, one smooth neck and tail, legs with knees and fetlocks; baby (a foal: long legs, short body, big head) and teen */
const HORSE_AGE={adult:{s:1,leg:1,body:1,head:1,neck:1},teen:{s:.82,leg:1.04,body:.9,head:1.06,neck:.95},baby:{s:.6,leg:1.12,body:.78,head:1.2,neck:.85}};
function horse4(col,age){const A=HORSE_AGE[age]||HORSE_AGE.adult,C=col,D=shade(C,-.22),Lt=shade(C,.14),M=C==='#3d3550'?'#2a2338':C==='#f6efe0'?'#d9cbb0':D,root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const L=.86*A.leg,BL=A.body,top=L+.42;
  /* the barrel body: deep chest, rounded rump */
  sph(b,.3,C,0,L+.2,0,{s:[.72,.82,1.65*BL],ws:20,hs:14});sph(b,.24,C,0,L+.2,.4*BL,{s:[.85,1,.95],ws:16,hs:12});sph(b,.25,C,0,L+.24,-.42*BL,{s:[.9,.95,.95],ws:16,hs:12});
  /* legs: shoulder, knee, fetlock, hoof: one smooth tube each */
  for(const [x,z,f] of[[-.12,.42*BL,1],[.12,.42*BL,1],[-.12,-.44*BL,0],[.12,-.44*BL,0]]){const p=new THREE.Group();p.position.set(x,L+.06,z);b.add(p);
    const P=f?[[0,0,0],[0,-L*.48,.02],[0,-L*.86,0],[0,-L+.05,.03]]:[[0,0,0],[0,-L*.35,-.07],[0,-L*.62,-.03],[0,-L*.88,0],[0,-L+.05,.03]];
    tube(p,P,t=>.075-t*.04,0,C,{seg:20,rad:10,ol:.012,caps:false});cyl(p,.045,.055,.07,'#3d3550',0,-L-.06,.03,{seg:12,ol:.01});legs.push(p);}
  /* the neck: one thick smooth tube rising forward from the chest; the mane runs along its top */
  const NK=[[0,top-.12,.42*BL],[0,top+.12,.58*BL],[0,top+.36*A.neck,.7*BL+.05],[0,top+.5*A.neck,.8*BL+.08]];
  tube(b,NK,t=>.19-t*.09,0,C,{seg:20,rad:14,ol:.014});
  tube(b,NK.map(([x,y,z],i)=>[x,y+.08+i*.005,z-.12+i*.01]),t=>.05-t*.015,0,M,{seg:20,rad:8,ol:.008});
  /* the head: a long tapered head angled down, a soft muzzle, eyes on the sides, pointed ears, a forelock */
  const hp=NK[3],head=new THREE.Group();head.position.set(0,hp[1],hp[2]);head.scale.setScalar(A.head);b.add(head);
  tube(head,[[0,.02,-.02],[0,-.08,.12],[0,-.2,.26]],.105,.075,C,{seg:10,rad:14,ol:.014});sph(head,.085,Lt,0,-.21,.28,{s:[.92,.85,1],ws:12,hs:8,ol:.01});
  for(const s of[-1,1]){sph(head,.012,INK,s*.04,-.2,.36,{ws:6,hs:4,ol:false});sph(head,.024,INK,s*.085,-.01,.07,{ws:8,hs:6,ol:false});sph(head,.008,'#ffffff',s*.09,-.0,.088,{ws:5,hs:4,ol:false});cone(head,.032,.12,C,s*.05,.07,-.06,{rx:-.35,seg:6,ol:.01});}
  sph(head,.05,M,0,.07,.03,{s:[.8,.5,1.3],ws:8,hs:6,ol:.008});
  /* the tail: one tube from the top of the rump flowing down and back, with a fuller end */
  const tail=new THREE.Group();tail.position.set(0,L+.36,-.62*BL);b.add(tail);
  tube(tail,[[0,0,0],[0,-.05,-.1],[0,-.3,-.16],[0,-.6,-.14]].map(([x,y,z])=>[x,y*(age==='baby'?.6:1),z]),t=>.05+t*.03,0,M,{seg:16,rad:10,ol:.008});
  /* a flat saddle on the adult only (rideable) */
  if(age!=='baby'&&age!=='teen'){sph(b,.21,'#ffd6e0',0,L+.44,.02,{s:[1.15,.08,1.3],ws:14,hs:6,ol:.01});box(b,.34,.05,.36,'#c94f7c',0,L+.45,0,{ol:.012});box(b,.1,.05,.06,'#c94f7c',0,L+.49,.16,{ol:.01});}
  root.scale.setScalar(A.s);return{root,b,legs,head,tail,type:'horse',phase:Math.random()*6,seat:new THREE.Vector3(0,(L+.52)*A.s,0)};}
/* sheep: a real sheep's face, still cute: a long soft muzzle, eyes on the sides, ears straight out sideways, nostrils at the tip, no human smile */
function sheep4(col){const m=sheep3(col),C=col,F=col==='#3d3550'?'#2e2638':'#f2d6c9',h=m.head;for(const o of [...h.children])h.remove(o);
  sph(h,.1,F,0,.02,-.02,{s:[.9,.95,1],ws:14,hs:10});tube(h,[[0,.01,0],[0,-.03,.09],[0,-.06,.16]],.085,.06,F,{seg:8,rad:14,ol:.01});
  for(const s of[-1,1]){box(h,.012,.008,.008,'#8a6a6a',s*.018,-.055,.215,{ry:s*.5,ol:false});}box(h,.03,.006,.006,'#8a6a6a',0,-.09,.205,{ol:false});
  for(const s of[-1,1]){sph(h,.03,'#ffffff',s*.075,.04,.04,{ws:10,hs:8,ol:false});sph(h,.019,INK,s*.086,.04,.052,{ws:8,hs:6,ol:false});sph(h,.006,'#ffffff',s*.09,.049,.064,{ws:5,hs:4,ol:false});
    const e=new THREE.Group();e.position.set(s*.1,.06,-.04);e.rotation.z=s*-.15;h.add(e);sph(e,.055,F,s*.04,0,0,{s:[1.4,.4,.65],ws:10,hs:6,ol:.008});sph(e,.035,'#ffb3c7',s*.045,.01,.01,{s:[1.3,.25,.5],ws:8,hs:5,ol:false});}
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;sph(h,.042,C,Math.cos(a)*.055,.1+Math.sin(a)*.012,Math.sin(a)*.045-.04,{ws:8,hs:6,ol:.008});}sph(h,.048,C,0,.12,-.03,{ws:8,hs:6,ol:.008});
  h.position.z+=.03;return m;}
{const _fa=farmAnimal;farmAnimal=function(type,col,age){if(type==='horse')return horse4(col,age);if(type==='sheep')return sheep4(col);return _fa(type,col,age);};}
pu('farm:horse',{name:'Horse',stage:6,group:'Farm Lane · animals',icon:'🐴',note:'rideable (adult): saddle seat',v:2,opts:[AGE_OPT,PU_OPT.col(FARM_COLS.horse)],dflt:{age:'adult',c:FARM_COLS.horse[0]},build(g,o){g.add(farmAnimal('horse',o.c,o.age).root);}});
PU['farm:sheep'].v=2;

/* ---------- round 7 (30 Oct): softer, cozier, no sharp cuts ---------- */
/* bear: legs end inside round paws (nothing sticks out under the feet); a rounder, softer, cozier face with a light muzzle and cheek fluff */
PU_NEW.bear=col=>{const T=PU_PET_TYPES.bear,C=col||T.cols[0],D=shade(C,-.14),Lt=shade(C,.22),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const leg=(x,z,h,r0,r1)=>{const p=new THREE.Group();p.position.set(x,h,z);b.add(p);tube(p,[[0,.04,0],[0,-h*.45,.01],[0,-h+.09,.01]],r0,r1,C,{seg:10,rad:14,ol:.014});sph(p,r1*1.3,C,0,-h+.075,.03,{s:[1,.75,1.25],ws:14,hs:10,ol:.012});sph(p,r1*.7,Lt,0,-h+.05,.1,{s:[1,.5,.4],ws:8,hs:6,ol:false});legs.push(p);return p;};
  sph(b,.22,C,0,.46,-.06,{s:[1,.92,1.7],ws:20,hs:14});sph(b,.2,C,0,.52,.15,{s:[1.05,1.02,1],ws:18,hs:12});sph(b,.12,C,0,.66,.12,{s:[1,.6,1.3],ws:12,hs:8});sph(b,.18,C,0,.46,-.3,{s:[1,.92,1],ws:16,hs:12});
  sph(b,.15,Lt,0,.36,.06,{s:[.9,.45,1.6],ol:false});
  leg(-.12,.2,.38,.085,.075);leg(.12,.2,.38,.085,.075);leg(-.12,-.32,.36,.08,.075);leg(.12,-.32,.36,.08,.075);
  const head=new THREE.Group();head.position.set(0,.57,.42);b.add(head);
  sph(head,.14,C,0,0,-.01,{s:[1.05,.95,1],ws:18,hs:14});for(const s of[-1,1])sph(head,.06,C,s*.1,-.05,.02,{s:[.8,.9,.9],ws:10,hs:8,ol:false});
  sph(head,.08,Lt,0,-.04,.12,{s:[1,.75,1.05],ws:16,hs:12,ol:.012});
  sph(head,.028,INK,0,-.01,.2,{s:[1.4,.9,1],ws:10,hs:8,ol:false});sph(head,.008,'#ffffff',.012,-.002,.215,{ws:5,hs:4,ol:false});
  {const m=new THREE.Mesh(new THREE.TorusGeometry(.022,.006,6,12,Math.PI),mat(INK));m.position.set(0,-.06,.2);m.rotation.z=Math.PI;head.add(m);}
  for(const s of[-1,1]){sph(head,.02,INK,s*.062,.045,.11,{ws:8,hs:6,ol:false});sph(head,.007,'#ffffff',s*.062+.007,.053,.126,{ws:5,hs:4,ol:false});sph(head,.024,'#ffb3a0',s*.095,-.035,.1,{s:[1,.6,.35],ws:8,hs:5,ol:false});}
  for(const s of[-1,1]){sph(head,.05,C,s*.09,.115,-.035,{s:[1,1,.6],ws:12,hs:10,ol:.01});sph(head,.03,Lt,s*.09,.115,-.012,{s:[1,1,.4],ws:10,hs:8,ol:false});}
  const tail=new THREE.Group();tail.position.set(0,.5,-.47);b.add(tail);sph(tail,.04,C,0,0,0,{ws:10,hs:8,ol:.01});
  root.scale.setScalar(T.scale);return{root,b,legs,tail,head,type:'bear',phase:Math.random()*6};};
/* monkey: one soft body: arms and legs are smooth tubes that start inside the body and end in round hands and feet (no flat cuts) */
PU_NEW.monkey=col=>{const T=PU_PET_TYPES.monkey,C=col||T.cols[0],D=shade(C,-.16),Lt='#f2d2b0',root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.125,C,0,.31,-.02,{s:[.95,1.3,1],rx:-.45,ws:18,hs:14});sph(b,.08,Lt,0,.29,.065,{s:[.9,1.25,.55],rx:-.45,ws:14,hs:10,ol:false});
  for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.085,.4,.06);b.add(p);tube(p,[[0,0,0],[s*.03,-.15,.05],[s*.025,-.3,.06],[s*.02,-.37,.06]],.045,.034,C,{seg:14,rad:12,ol:.011,caps:false});sph(p,.045,Lt,s*.02,-.375,.07,{s:[1,.65,1.25],ws:12,hs:8,ol:.01});legs.push(p);}
  for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.07,.22,-.08);b.add(p);tube(p,[[0,0,0],[s*.02,-.08,.04],[s*.015,-.17,.02]],.05,.04,C,{seg:10,rad:12,ol:.011,caps:false});sph(p,.045,Lt,s*.015,-.18,.05,{s:[1,.55,1.5],ws:12,hs:8,ol:.01});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,.55,.13);b.add(head);
  sph(head,.15,C,0,0,0,{s:[1,.95,.95],ws:18,hs:14});
  for(const s of[-1,1])sph(head,.065,Lt,s*.045,.03,.095,{s:[1,1.05,.55],ws:12,hs:9,ol:false});
  sph(head,.08,Lt,0,-.05,.11,{s:[1.2,.85,1],ws:16,hs:12,ol:.008});for(const s of[-1,1])sph(head,.028,D,s*.05,.078,.118,{s:[1.2,.3,.4],rz:s*-.25,ws:10,hs:6,ol:false});
  for(const s of[-1,1]){sph(head,.009,INK,s*.018,-.025,.188,{ws:6,hs:4,ol:false});sph(head,.022,'#ffb3a0',s*.07,-.045,.12,{s:[1,.7,.4],ws:8,hs:5,ol:false});}
  {const m=new THREE.Mesh(new THREE.TorusGeometry(.03,.007,6,12,Math.PI),mat(INK));m.position.set(0,-.07,.18);m.rotation.z=Math.PI;head.add(m);}
  for(const s of[-1,1]){sph(head,.024,INK,s*.045,.035,.14,{ws:10,hs:8,ol:false});sph(head,.008,'#ffffff',s*.045+.008,.045,.158,{ws:5,hs:4,ol:false});}
  for(const s of[-1,1]){sph(head,.068,C,s*.16,-.005,-.01,{s:[.4,1,1],ws:14,hs:10,ol:.01});sph(head,.045,Lt,s*.172,-.005,.005,{s:[.3,1,1],ws:12,hs:8,ol:false});}
  sph(head,.04,D,0,.14,-.01,{s:[1,.8,1],ws:10,hs:8,ol:.006});
  const tail=new THREE.Group();tail.position.set(0,.2,-.14);b.add(tail);
  tube(tail,[[0,.02,-.02],[0,-.06,-.14],[0,.02,-.28],[0,.18,-.38],[0,.32,-.4],[0,.4,-.34],[0,.38,-.27],[0,.32,-.27],[0,.31,-.32]],t=>.026-t*.01,0,C,{seg:40,rad:10,ol:.008});
  root.scale.setScalar(T.scale);return{root,b,legs,tail,head,type:'monkey',phase:Math.random()*6};};
/* capybara: cuter and cozier: a softer rounded snout (no hard barrel), a small round nose, sleepy smiling eyes, rosy cheeks, a little orange (yuzu) resting on its head like in the hot springs */
function capy3(col){const m=capy2(col),C=col||CAPY_COLS[0],Lt=shade(C,.12),h=m.head;for(const o of [...h.children])h.remove(o);
  sph(h,.19,C,0,0,-.02,{s:[1,.9,1.05],ws:20,hs:14});sph(h,.15,C,0,-.03,.1,{s:[1,.85,.95],ws:18,hs:12,ol:.012});sph(h,.1,Lt,0,-.06,.17,{s:[1.15,.7,.6],ws:14,hs:10,ol:false});
  sph(h,.032,'#4a2e22',0,.02,.235,{s:[1.6,.75,.6],ws:12,hs:8,ol:false});sph(h,.008,'#ffffff',.015,.03,.25,{ws:5,hs:4,ol:false});
  {const mo=new THREE.Mesh(new THREE.TorusGeometry(.022,.006,6,12,Math.PI),mat('#4a2e22'));mo.position.set(0,-.05,.235);mo.rotation.z=Math.PI;h.add(mo);}
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.TorusGeometry(.018,.006,6,12,Math.PI),mat(INK));e.position.set(s*.1,.075,.14);h.add(e);
    sph(h,.034,'#ffb3a0',s*.125,-.03,.13,{s:[1,.6,.35],ws:10,hs:6,ol:false});}
  for(const s of[-1,1]){sph(h,.038,C,s*.125,.14,-.08,{s:[1,1,.6],ws:12,hs:8,ol:.008});sph(h,.022,shade(C,-.1),s*.125,.14,-.065,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  sph(h,.05,'#ffb347',0,.19,-.02,{ws:12,hs:10,ol:.008});sph(h,.012,'#5fae5c',0,.24,-.02,{s:[1.6,.5,1],ws:6,hs:4,ol:false});
  return m;}
{const _mp=makePet;makePet=function(type,col){return type==='capybara'?capy3(col&&col!==PET_TYPES.capybara.cols[0]?col:CAPY_COLS[0]):_mp(type,col);};}
for(const k of['bear','monkey'])PU['pet:'+k].v=2;

/* ---------- round 8 (30 Oct) ---------- */
/* a rider sits on the horse: legs astride, hands on the reins */
function riderOn(horse,look){const p=makePerson(Object.assign({},DEFAULT_LOOK,{nohat:true},look||{}));
  /* astride: the hips spread to the horse's sides, legs hang down along its flanks, knees a little forward; hands forward on the reins */
  p.legs.forEach((h,i)=>{const s=i?1:-1;h.position.x=s*.27;h.rotation.x=-.45;h.rotation.z=s*.12;});p.arms.forEach(a=>{a.rotation.x=-.75;});
  const k=1/(horse.root.scale.x||1);p.root.scale.setScalar(k);const s=horse.seat||new THREE.Vector3(0,1.4,0);p.root.position.set(s.x,s.y-.62*k,s.z-.02);horse.root.add(p.root);return p;}
/* horse: the adult is bigger; it can be shown with a rider (mounted look) */
{const h4=horse4;horse4=function(col,age){const m=h4(col,age);if(!age||age==='adult'){m.root.scale.setScalar(1.18);}return m;};}
pu('farm:horse',{name:'Horse',stage:6,group:'Farm Lane · animals',icon:'🐴',note:'rideable (adult)',v:2,opts:[AGE_OPT,PU_OPT.pick('rider','Rider',[['no','Empty'],['yes','Mounted']]),PU_OPT.col(FARM_COLS.horse)],dflt:{age:'adult',rider:'no',c:FARM_COLS.horse[0]},
  build(g,o){const m=farmAnimal('horse',o.c,o.age);if(o.rider==='yes'&&(o.age||'adult')==='adult')riderOn(m,{top:'#ff7aa8'});g.add(m.root);}});
/* sheep: lamb and teen too (a lamb: small, a bigger head, shorter legs) */
const SHEEP_AGE={adult:{s:1,head:1,leg:1},teen:{s:.78,head:1.12,leg:.9},baby:{s:.55,head:1.35,leg:.8}};
{const _fa=farmAnimal;farmAnimal=function(type,col,age){if(type!=='sheep')return _fa(type,col,age);const A=SHEEP_AGE[age]||SHEEP_AGE.adult,m=sheep4(col);if(A!==SHEEP_AGE.adult){m.head.scale.multiplyScalar(A.head);for(const l of m.legs)l.scale.y*=A.leg;m.b.position.y-=.24*(1-A.leg);m.root.scale.setScalar(A.s);}return m;};}
pu('farm:sheep',{name:'Sheep',stage:6,group:'Farm Lane · animals',icon:'🐑',note:'feed and pet',v:2,opts:[AGE_OPT,PU_OPT.col(FARM_COLS.sheep)],dflt:{age:'adult',c:FARM_COLS.sheep[0]},build(g,o){g.add(farmAnimal('sheep',o.c,o.age).root);}});
/* bear: real bear colours (brown, black, polar white, panda), a longer muzzle and small claws; still round and cute */
const PANDA='linear-gradient(90deg,#2e2a33 50%,#fbfbf8 50%)';PU_PET_TYPES.bear.cols=['#7a4e2d','#2e2a33','#f2efe6',PANDA];
{const mk=PU_NEW.bear;PU_NEW.bear=col=>{const c=col||PU_PET_TYPES.bear.cols[0],pd=c===PANDA;const m=mk(pd?'#fbfbf8':c);
  const K=pd?'#2e2a33':shade(c,-.3);
  /* claws on every paw */
  for(const l of m.legs){for(const dx of[-.035,0,.035])box(l,.012,.012,.03,'#f6efe0',dx,-l.position.y+.05,.115,{ol:false});}
  if(pd){const B='#2e2a33';
    /* panda: black legs, ears, eye patches and a shoulder band */
    for(const l of m.legs)l.traverse(o=>{if(o.isMesh&&o.material&&o.material.userData&&o.material.userData.plain&&o.material.color.getHexString()==='fbfbf8')o.material=mat(B);});
    m.head.traverse(o=>{if(o.isMesh&&o.parent===m.head&&o.material&&o.material.userData&&o.material.userData.plain&&o.material.color.getHexString()==='fbfbf8'&&Math.abs(o.position.x)>.06&&o.position.y>.1)o.material=mat(B);});
    for(const s of[-1,1])sph(m.head,.038,B,s*.062,.04,.095,{s:[1,1.3,.45],rz:s*.5,ws:10,hs:8,ol:false});
    sph(m.b,.205,B,0,.5,.12,{s:[1.08,.55,.42],ws:16,hs:8,ol:false});}
  return m;};}
PU['pet:bear']=Object.assign({},PU['pet:bear'],{opts:[AGE_OPT,PU_OPT.col(PU_PET_TYPES.bear.cols,'Colour')],dflt:{age:'baby',c:PU_PET_TYPES.bear.cols[0]},v:2});
/* capybara, critic round 1 fixes: a long low bean body on tiny stout legs, a big boxy barrel head with a flat front, a wide dark nose on top, open bead eyes set high and wide, tiny round ears on the top corners */
function capy4(col){const C=col||CAPY_COLS[0],Lt=shade(C,.12),Dk=shade(C,-.12),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.3,C,0,.27,-.08,{s:[1,.72,1.75],ws:22,hs:14});sph(b,.24,Lt,0,.2,-.02,{s:[.9,.45,1.6],ol:false});sph(b,.22,Dk,0,.43,-.12,{s:[.88,.16,1.5],ws:14,hs:6,ol:false});
  for(const [x,z] of[[-.15,.22],[.15,.22],[-.15,-.36],[.15,-.36]]){const p=new THREE.Group();p.position.set(x,.13,z);b.add(p);cyl(p,.07,.065,.13,C,0,-.13,0,{seg:12,ol:.012});sph(p,.07,Dk,0,-.12,.03,{s:[1,.4,1.25],ws:10,hs:6,ol:.01});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,.4,.5);b.add(head);
  /* the head: a rounded back and a long barrel snout ending in a flat front */
  sph(head,.2,C,0,.02,-.05,{s:[1,.9,1],ws:20,hs:14});
  cyl(head,.165,.17,.3,C,0,-.01,.12,{rx:Math.PI/2,center:true,seg:24,s:[1.05,1,.86],ol:.014});
  sph(head,.12,Lt,0,-.07,.24,{s:[1.2,.55,.5],ws:14,hs:8,ol:false});
  box(head,.2,.045,.06,'#4a2e22',0,.075,.255,{center:true,ol:false});for(const s of[-1,1])sph(head,.012,'#2a1a14',s*.05,.085,.29,{ws:6,hs:4,ol:false});
  box(head,.08,.008,.006,'#4a2e22',0,-.075,.272,{center:true,ol:false});
  for(const s of[-1,1]){sph(head,.024,INK,s*.12,.12,.06,{ws:10,hs:8,ol:false});sph(head,.008,'#ffffff',s*.12+.008,.13,.08,{ws:6,hs:4,ol:false});sph(head,.03,'#d98a6a',s*.13,.0,.13,{s:[1,.6,.35],ws:8,hs:5,ol:false});}
  for(const s of[-1,1]){sph(head,.036,C,s*.14,.18,-.1,{s:[1,1,.6],ws:12,hs:8,ol:.008});sph(head,.02,Dk,s*.14,.18,-.085,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6};}
{const _mp=makePet;makePet=function(type,col){return type==='capybara'?capy4(col&&col!==PET_TYPES.capybara.cols[0]?col:CAPY_COLS[0]):_mp(type,col);};}
/* rbox: a soft rounded box (bevelled), with the same ink outline as the game's shapes */
function rboxGeo(w,h,d,r,grow){r=Math.min(r,w/2-.001,h/2-.001,d/2-.001);const s=new THREE.Shape(),x=w/2-r,y=h/2-r;s.moveTo(-x,-y);s.lineTo(x,-y);s.lineTo(x,y);s.lineTo(-x,y);s.closePath();
  const g=new THREE.ExtrudeGeometry(s,{depth:d-2*r,bevelEnabled:true,bevelThickness:r+grow,bevelSize:r+grow,bevelSegments:5,curveSegments:4});g.translate(0,0,-(d-2*r)/2);g.computeVertexNormals();return g;}
function rbox(g,w,h,d,r,c,x,y,z,o={}){const m=new THREE.Mesh(rboxGeo(w,h,d,r,0),o.mat||mat(c));m.position.set(x,y,z);if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;g.add(m);
  if(o.ol!==false){const h2=new THREE.Mesh(rboxGeo(w,h,d,r,o.ol||.014),OL);h2.position.copy(m.position);h2.rotation.copy(m.rotation);g.add(h2);}return m;}
/* capybara, critic round 2: built from soft rounded boxes like a plush: a round-cornered bean body, a big boxy head level with the back and a tall flat front, a wide dark nose band near the top of the front, bead eyes high on the sides, tiny ears, stub legs; soft tan */
const CAPY_TAN=['#c49a6c','#b08560','#9a7352','#d6b08a'];
function capy5(col){const C=col||CAPY_TAN[0],Lt=shade(C,.14),Dk=shade(C,-.12),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  rbox(b,.48,.38,.76,.19,C,0,.3,-.04);sph(b,.2,Lt,0,.17,-.02,{s:[1,.35,1.5],ws:14,hs:8,ol:false});
  for(const [x,z] of[[-.15,.2],[.15,.2],[-.15,-.27],[.15,-.27]]){const p=new THREE.Group();p.position.set(x,.14,z);b.add(p);cyl(p,.065,.062,.14,C,0,-.14,0,{seg:12,ol:.012});rbox(p,.13,.04,.15,.018,Dk,0,-.12,.025,{ol:.01});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,.47,.38);b.add(head);
  rbox(head,.34,.32,.42,.13,C,0,0,.08);
  sph(head,.06,'#4a2e22',0,.06,.29,{s:[1.5,.6,.35],ws:12,hs:8,ol:false});for(const s of[-1,1])sph(head,.011,'#2a1a14',s*.04,.065,.305,{ws:6,hs:4,ol:false});
  box(head,.07,.008,.006,'#4a2e22',0,-.055,.305,{center:true,ol:false});
  for(const s of[-1,1]){sph(head,.032,INK,s*.165,.09,.16,{ws:10,hs:8,ol:false});sph(head,.011,'#ffffff',s*.172,.1,.18,{ws:6,hs:4,ol:false});sph(head,.032,'#d98a6a',s*.17,-.03,.2,{s:[.4,.6,1],ws:8,hs:5,ol:false});}
  for(const s of[-1,1]){sph(head,.045,C,s*.13,.17,-.08,{s:[1,.9,.7],ws:14,hs:10,ol:.008});sph(head,.026,Dk,s*.13,.17,-.062,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6};}
{const _mp=makePet;makePet=function(type,col){return type==='capybara'?capy5(col&&col!==PET_TYPES.capybara.cols[0]?col:CAPY_TAN[0]):_mp(type,col);};}
/* capybara, critic round 4: a round low bean body, a BIG blunt barrel head (taller and wider than the body's front), a wide dark nose pad lying on top of the snout, small dark eyes high and wide, tiny round ears, short stub legs, no blush */
function capy6(col){const C=col||CAPY_TAN[0],Lt=shade(C,.12),Dk=shade(C,-.12),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.33,C,0,.3,-.06,{s:[.82,.74,1.3],ws:24,hs:16});sph(b,.24,Lt,0,.17,0,{s:[.85,.35,1.3],ws:14,hs:8,ol:false});
  for(const [x,z] of[[-.14,.2],[.14,.2],[-.14,-.32],[.14,-.32]]){const p=new THREE.Group();p.position.set(x,.1,z);b.add(p);cyl(p,.072,.07,.1,C,0,-.1,0,{seg:14,ol:.012});sph(p,.075,C,0,-.085,.02,{s:[1,.45,1.2],ws:12,hs:8,ol:.01});legs.push(p);}
  sph(b,.22,C,0,.42,.26,{s:[1,.95,1],ws:18,hs:12,ol:.012});const head=new THREE.Group();head.position.set(0,.46,.36);b.add(head);
  rbox(head,.44,.4,.5,.15,C,0,0,.1);
  rbox(head,.32,.07,.16,.03,'#4a2e22',0,.2,.27,{ol:.01});for(const s of[-1,1])sph(head,.014,'#2a1a14',s*.06,.225,.31,{s:[1.4,.6,1],ws:6,hs:4,ol:false});
  box(head,.1,.01,.006,'#4a2e22',0,-.06,.352,{center:true,ol:false});
  for(const s of[-1,1]){sph(head,.034,'#1d1622',s*.19,.12,.17,{ws:12,hs:10,ol:false});sph(head,.011,'#ffffff',s*.198,.132,.192,{ws:6,hs:4,ol:false});}
  for(const s of[-1,1]){sph(head,.045,C,s*.16,.19,-.1,{s:[1,.9,.7],ws:14,hs:10,ol:.008});sph(head,.024,Dk,s*.15,.21,-.083,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6};}
{const _mp=makePet;makePet=function(type,col){return type==='capybara'?capy6(col&&col!==PET_TYPES.capybara.cols[0]?col:CAPY_TAN[0]):_mp(type,col);};}
/* the critic loop (6 rounds) did not reach 8: keep the look you called "very good" (soft, with the little orange; legs now joined, longer body) as the main one, and show the boxy plush try as a second look */
let CAPY_LOOK='soft';
{const _mp=makePet;makePet=function(type,col){if(type!=='capybara')return _mp(type,col);const c=col&&col!==PET_TYPES.capybara.cols[0]?col:null;return CAPY_LOOK==='box'?capy6(c||CAPY_TAN[0]):capy3(c||CAPY_COLS[0]);};}
{const P=PU['age:capybara'];PU['age:capybara']=Object.assign({},P,{v:2,opts:[PU_OPT.pick('look','Look',[['soft','Soft (your pick)'],['box','Boxy plush (critic try)']])].concat(P.opts),dflt:Object.assign({look:'soft'},P.dflt),
  build(g,o){CAPY_LOOK=o.look||'soft';try{P.build(g,o);}finally{CAPY_LOOK='soft';}}});}

/* ---------- round 9 (30 Oct) ---------- */
/* real sizes against the player (his rule for all animals): adult bear about 1 m at the shoulder and 2 m long, seal 1.6 m long, capybara 1.2 m long, cow 1.4 m at the shoulder */
PU_PET_TYPES.bear.scale=1.45;PU_PET_TYPES.seal.scale=2.1;
{const _fa=farmAnimal;farmAnimal=function(type,col,age){const m=_fa(type,col,age);if(type==='cow')m.root.scale.multiplyScalar(1.25);return m;};}
/* monkey: happy: a big open smile, brows lifted, round shiny eyes, rosy cheeks */
{const mk=PU_NEW.monkey;PU_NEW.monkey=col=>{const m=mk(col),h=m.head;
  for(const o of [...h.children]){if(o.geometry&&o.geometry.type==='TorusGeometry')h.remove(o);if(o.geometry&&o.geometry.type==='SphereGeometry'&&o.position.y>.07&&o.position.y<.09&&Math.abs(o.position.x)>.03&&Math.abs(o.position.x)<.07)h.remove(o);}
  for(const s of[-1,1])sph(h,.026,shade(col||PU_PET_TYPES.monkey.cols[0],-.16),s*.052,.095,.118,{s:[1.2,.3,.4],rz:s*-.08,ws:10,hs:6,ol:false});
  {const g=new THREE.Mesh(new THREE.CircleGeometry(.06,18,Math.PI,Math.PI),mat('#5a2e3a'));g.position.set(0,-.055,.192);h.add(g);const t=new THREE.Mesh(new THREE.CircleGeometry(.032,14,Math.PI,Math.PI),mat('#ff7a9a'));t.position.set(0,-.09,.194);h.add(t);}
  return m;};}
/* horse in the game's own style (boxes and soft blocks with ink outlines, like the cow), keeping the real proportions, ages and the rider */
function horse5(col,age){const A=HORSE_AGE[age]||HORSE_AGE.adult,C=col,D=shade(C,-.22),Lt=shade(C,.14),M=C==='#3d3550'?'#2a2338':C==='#f6efe0'?'#d9cbb0':D,root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const L=.86*A.leg,BL=A.body;
  rbox(b,.46,.5,1.25*BL,.16,C,0,L+.2,0);
  for(const [x,z,f] of[[-.13,.46*BL,1],[.13,.46*BL,1],[-.13,-.47*BL,0],[.13,-.47*BL,0]]){const p=new THREE.Group();p.position.set(x,L+.05,z);b.add(p);
    box(p,.13,L*.5,.15,C,0,-L*.5,f?0:-.02,{ol:.018});box(p,.1,L*.42,.11,C,0,-L*.92,0,{ol:.016});box(p,.14,.09,.15,'#3d3550',0,-L-.04,.01,{ol:.012});legs.push(p);}
  /* the neck: one block leaning forward from the chest; the mane in little blocks along its top */
  const nk=new THREE.Group();nk.position.set(0,L+.28,.5*BL);nk.rotation.x=.62;b.add(nk);rbox(nk,.26,.72*A.neck,.32,.1,C,0,.36*A.neck,0);
  for(let i=0;i<7;i++)box(nk,.09,.12,.11,M,0,.04+i*.1*A.neck,-.17,{ol:.012});
  const head=new THREE.Group();head.position.set(0,L+.28+.62*A.neck,.5*BL+.44*A.neck);head.scale.setScalar(A.head);b.add(head);
  {const h=new THREE.Group();h.rotation.x=1.0;head.add(h);rbox(h,.24,.26,.56,.09,C,0,-.04,.14);rbox(h,.22,.2,.17,.07,Lt,0,-.06,.36,{ol:.012});
    for(const s of[-1,1]){box(h,.03,.04,.02,INK,s*.055,.0,.445,{ol:false});puEye(h,s*.123,.04,.04,.8);cone(h,.045,.13,C,s*.075,.13,-.08,{seg:4,ol:.012});}box(h,.08,.06,.15,M,0,.13,.02,{ol:.01});}
  const tail=new THREE.Group();tail.position.set(0,L+.36,-.64*BL);b.add(tail);box(tail,.12,.62*(age==='baby'?.6:1),.1,M,0,-.62*(age==='baby'?.6:1),-.06,{rx:.28,ol:.015});
  if(age!=='baby'&&age!=='teen'){box(b,.5,.04,.56,'#ffd6e0',0,L+.44,.02,{ol:.012});box(b,.38,.07,.38,'#c94f7c',0,L+.46,0,{ol:.012});box(b,.1,.06,.06,'#c94f7c',0,L+.52,.17,{ol:.01});}
  const sc=A.s*(!age||age==='adult'?1.18:1);root.scale.setScalar(sc);return{root,b,legs,head,tail,type:'horse',phase:Math.random()*6,seat:new THREE.Vector3(0,L+.52,0)};}
let HORSE_LOOK='game';
{const _fa=farmAnimal;farmAnimal=function(type,col,age){return type==='horse'&&HORSE_LOOK==='game'?horse5(col,age):_fa(type,col,age);};}
{const P=PU['farm:horse'];PU['farm:horse']=Object.assign({},P,{opts:[PU_OPT.pick('look','Look',[['game','Game style (new)'],['smooth','Smooth (last)']])].concat(P.opts),dflt:Object.assign({look:'game'},P.dflt),build(g,o){HORSE_LOOK=o.look||'game';try{P.build(g,o);}finally{HORSE_LOOK='game';}}});}
/* capybara: 5 variants of the boxy plush try, with the nose fixed (a soft round dark pad on the top front, not a lid) */
function capyV(col,v){const C=col||CAPY_TAN[0],Lt=shade(C,.12),Dk=shade(C,-.12),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const P={1:{hw:.42,hh:.38,hd:.48,hr:.15,bl:1.3,eye:'bead',ear:.04,body:.33},2:{hw:.42,hh:.36,hd:.46,hr:.18,bl:1.25,eye:'sleepy',ear:.04,body:.34,blush:1},3:{hw:.4,hh:.44,hd:.52,hr:.14,bl:1.45,eye:'bead',ear:.032,body:.32},4:{hw:.48,hh:.44,hd:.46,hr:.17,bl:1.05,eye:'big',ear:.045,body:.34,blush:1},5:{hw:.42,hh:.38,hd:.48,hr:.15,bl:1.3,eye:'sleepy',ear:.04,body:.33,hat:1}}[v]||{};
  sph(b,P.body,C,0,.3,-.06,{s:[.82,.74,P.bl],ws:24,hs:16});sph(b,P.body*.72,Lt,0,.17,0,{s:[.85,.35,P.bl],ws:14,hs:8,ol:false});
  for(const [x,z] of[[-.14,.2],[.14,.2],[-.14,-.12-.2*P.bl],[.14,-.12-.2*P.bl]]){const p=new THREE.Group();p.position.set(x,.11,z);b.add(p);cyl(p,.072,.07,.11,C,0,-.11,0,{seg:14,ol:.012});sph(p,.075,Dk,0,-.095,.02,{s:[1,.42,1.2],ws:12,hs:8,ol:.01});legs.push(p);}
  sph(b,.22,C,0,.42,.26,{s:[1,.95,1],ws:18,hs:12,ol:.012});
  const head=new THREE.Group();head.position.set(0,.46,.34);b.add(head);
  rbox(head,P.hw,P.hh,P.hd,P.hr,C,0,0,.1);
  /* the nose: a soft round dark pad sitting on the top front edge, with two nostrils */
  const nz=.1+P.hd/2-.03;sph(head,P.hw*.22,Lt,0,P.hh/2-.1,nz+.01,{s:[1.5,.8,.6],ws:16,hs:10,ol:false});sph(head,.058,'#6b4430',0,P.hh/2-.03,nz+.005,{s:[1.5,.55,.7],ws:16,hs:10,ol:.006});for(const s of[-1,1])sph(head,.014,'#2a1a14',s*.045,P.hh/2-.03,nz+.05,{s:[1.3,.7,.7],ws:6,hs:4,ol:false});
  {const mo=new THREE.Mesh(new THREE.TorusGeometry(.03,.007,6,12,Math.PI),mat('#4a2e22'));mo.position.set(0,-P.hh/2+.09,nz+.025);mo.rotation.z=Math.PI;head.add(mo);}
  const ex=P.hw/2-.01,ey=P.hh/2-.08,ez=.1+P.hd*.18;
  for(const s of[-1,1]){if(P.eye==='sleepy'){const e=new THREE.Mesh(new THREE.TorusGeometry(.022,.007,6,12,Math.PI),mat(INK));e.position.set(s*ex,ey,ez);e.rotation.y=s*Math.PI/2;head.add(e);}
    else{const r=P.eye==='big'?.034:.024;sph(head,r,'#1d1622',s*ex,ey,ez,{ws:12,hs:10,ol:false});sph(head,r*.33,'#ffffff',s*(ex+.004),ey+r*.4,ez+r*.5,{ws:6,hs:4,ol:false});}
    if(P.blush)sph(head,.035,'#e8a08a',s*(ex-.01),ey-.09,ez+.06,{s:[.35,.6,1],ws:8,hs:5,ol:false});
    sph(head,P.ear,C,s*(P.hw/2-.05),P.hh/2+.005,-.06,{s:[1,.9,.7],ws:14,hs:10,ol:.008});sph(head,P.ear*.6,Dk,s*(P.hw/2-.05),P.hh/2+.005,-.045,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  if(P.hat){const hg=new THREE.Group();hg.position.set(0,P.hh/2+.03,-.0);hg.rotation.z=-.12;head.add(hg);cyl(hg,.15,.15,.03,'#f2ede0',0,0,0,{seg:20,ol:.008});cyl(hg,.1,.11,.11,'#f2ede0',0,.02,0,{seg:20,ol:.008});cyl(hg,.112,.112,.025,'#7cc8ff',0,.04,0,{seg:20,ol:false});}
  root.scale.setScalar(1.25);return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6};}
{const P=PU['age:capybara'];const B=P.build;PU['age:capybara']=Object.assign({},P,{opts:[PU_OPT.pick('look','Look',[['soft','Soft'],['v1','Boxy 1: bead eyes'],['v2','Boxy 2: sleepy, rounder'],['v3','Boxy 3: tall barrel, long body'],['v4','Boxy 4: chibi, big eyes'],['v5','Boxy 5: sleepy + cap']])].concat(P.opts.filter(o=>o.k!=='look')),dflt:Object.assign({},P.dflt,{look:'v1'}),
  build(g,o){const lk=o.look||'v1';if(lk==='soft'){B(g,Object.assign({},o,{look:'soft'}));const k=g.children[g.children.length-1];if(k)k.scale.multiplyScalar(1.25);return;}const v=+lk.slice(1);const m=puAge(capyV(o.c&&o.c!==PET_TYPES.capybara.cols[0]?o.c:null,v),o.age||'adult');g.add(m.root);}});}

/* ---------- round 10 (30 Oct): his pictures ---------- */
/* capybara after his sticker picture: a round pear body sitting up, the head part of the body, a darker oval muzzle with a small nose and a tiny smile, bead eyes, rosy cheeks, small round ears, little paws and feet, a sprout on top */
function capySticker(col){const C=col||'#d9955a',M=shade(C,-.14),P=shade(C,-.22),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.3,C,0,.3,0,{s:[1,1.02,.92],ws:24,hs:18});sph(b,.25,C,0,.55,.01,{s:[1,.9,.9],ws:22,hs:16});
  const head=new THREE.Group();head.position.set(0,.58,.04);b.add(head);
  sph(head,.1,M,0,-.035,.17,{s:[1.15,.9,.45],ws:18,hs:12,ol:false});sph(head,.03,'#5a3624',0,.0,.21,{s:[1.4,.8,.6],ws:12,hs:8,ol:false});
  {const w=new THREE.Group();w.position.set(0,-.06,.215);head.add(w);for(const s of[-1,1]){const a=new THREE.Mesh(new THREE.TorusGeometry(.012,.004,6,10,Math.PI),mat('#5a3624'));a.position.x=s*.012;a.rotation.z=Math.PI;w.add(a);}}
  for(const s of[-1,1]){sph(head,.026,'#1d1622',s*.115,.04,.17,{ws:12,hs:10,ol:false});sph(head,.009,'#ffffff',s*.115+.008,.052,.192,{ws:6,hs:4,ol:false});sph(head,.036,'#ff9e9e',s*.16,-.04,.15,{s:[1,.55,.3],ws:10,hs:6,ol:false});
    sph(head,.05,C,s*.17,.17,-.02,{s:[1,.95,.6],ws:14,hs:10,ol:.008});sph(head,.03,P,s*.17,.17,.0,{s:[1,1,.4],ws:10,hs:8,ol:false});}
  /* the sprout */
  cyl(head,.006,.006,.08,'#5fae5c',0,.19,0,{seg:6,ol:false});for(const s of[-1,1])sph(head,.035,'#7ccf5a',s*.035,.27,0,{s:[1.4,.35,.8],rz:s*.4,ws:10,hs:6,ol:.006});
  /* arms resting on the tummy, feet in front */
  for(const s of[-1,1]){const a=new THREE.Group();a.position.set(s*.13,.4,.2);b.add(a);sph(a,.05,M,0,0,0,{s:[.8,1.3,.7],rz:s*.3,ws:12,hs:8,ol:.008});legs.push(a);
    const f=new THREE.Group();f.position.set(s*.14,.05,.18);b.add(f);sph(f,.07,P,0,0,0,{s:[1,.6,1.3],ws:14,hs:8,ol:.008});legs.push(f);}
  return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6};}
{const P=PU['age:capybara'];const B=P.build;PU['age:capybara']=Object.assign({},P,{opts:[PU_OPT.pick('look','Look',[['sticker','Your sticker picture (new)']].concat(P.opts.find(o=>o.k==='look').vals))].concat(P.opts.filter(o=>o.k!=='look')),dflt:Object.assign({},P.dflt,{look:'sticker'}),
  build(g,o){if((o.look||'sticker')!=='sticker'){B(g,o);return;}const m=puAge(capySticker(o.c&&o.c!==PET_TYPES.capybara.cols[0]?o.c:null),o.age||'adult');m.root.scale.multiplyScalar(1.25);g.add(m.root);}});}
/* an old labrador asleep by the farm buildings: lying flat, head on its paws, eyes shut, a grey muzzle, Zzz */
function sleepyLab(){const C='#e8c98f',D=shade(C,-.12),G='#d8d2c4',g=new THREE.Group();
  rbox(g,.42,.3,.78,.14,C,0,.16,0);rbox(g,.36,.22,.3,.1,C,0,.12,-.32);
  for(const s of[-1,1]){rbox(g,.1,.08,.36,.04,C,s*.13,.04,.42);sph(g,.055,C,s*.13,.05,.6,{s:[1,.7,1.2],ws:10,hs:8,ol:.01});rbox(g,.16,.08,.26,.04,C,s*.2,.04,-.38,{ry:s*.5});}
  const h=new THREE.Group();h.position.set(0,.15,.5);g.add(h);rbox(h,.26,.22,.26,.09,C,0,0,0);rbox(h,.18,.13,.16,.05,G,0,-.04,.17,{ol:.012});sph(h,.03,'#2e2347',0,.0,.255,{s:[1.3,.8,.8],ws:10,hs:8,ol:false});
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.TorusGeometry(.022,.006,6,12,Math.PI),mat(INK));e.position.set(s*.065,.04,.132);e.rotation.z=Math.PI;h.add(e);rbox(h,.07,.2,.14,.03,D,s*.15,-.04,-.02,{rz:s*.15,ol:.01});}
  {const t=new THREE.Group();t.position.set(0,.12,-.48);g.add(t);rbox(t,.08,.07,.34,.035,C,.08,-.06,-.15,{ry:.5});}
  const Zg=new THREE.Group();Zg.position.set(.15,.45,.55);g.add(Zg);const z=(x,y,s)=>{const p=new THREE.Group();p.position.set(x,y,0);p.scale.setScalar(s);Zg.add(p);const c='#b79cff';box(p,.14,.035,.03,c,0,.12,0,{center:true,ol:.008});box(p,.14,.035,.03,c,0,0,0,{center:true,ol:.008});box(p,.035,.17,.03,c,0,.06,0,{rz:-.95,center:true,ol:.008});};z(0,0,.8);z(.12,.17,.6);z(.22,.3,.45);
  g.scale.setScalar(1.15);return g;}
pu('farm:lab',{name:'Old sleeping labrador',stage:6,group:'Farm Lane · animals',icon:'🐕',note:'sleeps by the farm buildings',v:2,build(g){g.add(sleepyLab());}});
/* a farm windmill (water pump), like his picture: a lattice steel tower, a round fan of blades, a tail vane, a little wooden water tank */
function windmill(g){const T='#7a7592',W=.08;const H=7.2,b=1.1,t=.25;
  for(const [sx,sz] of[[-1,-1],[1,-1],[-1,1],[1,1]]){const x0=sx*b,z0=sz*b,x1=sx*t,z1=sz*t,L=Math.hypot(x1-x0,H,z1-z0);const p=new THREE.Group();p.position.set((x0+x1)/2,H/2,(z0+z1)/2);p.lookAt(x1,H,z1);p.rotateX(Math.PI/2);g.add(p);box(p,W,L,W,T,0,0,0,{center:true,ol:.012});}
  for(let i=1;i<6;i++){const y=i*H/6,w=b+(t-b)*(y/H);for(const s of[-1,1]){box(g,w*2,.05,.05,T,0,y,s*w,{center:true,ol:.008});box(g,.05,.05,w*2,T,s*w,y,0,{center:true,ol:.008});}}
  box(g,.4,.1,.4,'#5a5f8c',0,H,0,{ol:.01});
  const hub=new THREE.Group();hub.position.set(0,H+.35,.35);g.add(hub);sph(hub,.12,'#5a5f8c',0,0,0,{ws:10,hs:8,ol:.01});
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2,bl=new THREE.Group();bl.rotation.z=a;hub.add(bl);box(bl,.2,.85,.02,'#d8dcea',.0,.65,0,{rz:.0,center:true,ol:.008});}
  {const r=new THREE.Mesh(new THREE.TorusGeometry(1.05,.025,6,40),mat('#5a5f8c'));hub.add(r);}
  box(g,.06,.06,1.6,'#5a5f8c',0,H+.35,-.8,{center:true,ol:.008});box(g,.04,.9,1.1,'#d8dcea',0,H+.35,-1.6,{center:true,ol:.01});
  cyl(g,.04,.04,H,'#5a5f8c',0,0,0,{seg:6,ol:false});
  box(g,1.6,.7,1.1,'#a8714a',1.9,0,.2,{ol:.015});for(let i=1;i<4;i++)box(g,1.62,.03,1.12,'#8a5a36',1.9,i*.18,.2,{ol:false});const w=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1),WATER);w.rotation.x=-Math.PI/2;w.position.set(1.9,.66,.2);g.add(w);}
pu('farm:windmill',{name:'Farm windmill',stage:6,group:'Farm Lane · buildings',icon:'🌬️',v:2,build(g){windmill(g);}});
/* the farm entrance: a big wooden arch over the road with a hanging FARM sign (his drawing) */
function farmArch(g,span=7){const Wd='#8a5a36',D2='#6e4527',H=4.6;for(const s of[-1,1]){cyl(g,.18,.22,H,Wd,s*span/2,0,0,{seg:10,ol:.02});cyl(g,.24,.24,.12,D2,s*span/2,H,0,{seg:10,ol:.012});}
  cyl(g,.16,.16,span+.9,Wd,0,H-.25,0,{rz:Math.PI/2,center:true,seg:10,ol:.02});for(const s of[-1,1])box(g,.12,.12,1.1,D2,s*(span/2-.55),H-.75,0,{rz:s*.75,center:true,ol:.012});
  for(const s of[-1,1])cyl(g,.012,.012,.55,'#5a5f8c',s*.9,H-.75,0,{seg:4,ol:false});box(g,2.3,.62,.1,'#ffd45c',0,H-1.35,0,{ol:.015});const sp=signPlane('FARM',2.1,.5,'#ffd45c','#3d2c5e');sp.position.set(0,H-1.04,.06);g.add(sp);const sb=sp.clone();sb.rotation.y=Math.PI;sb.position.z=-.06;g.add(sb);}
pu('farm:arch',{name:'Farm entrance arch',stage:6,group:'Farm Lane · buildings',icon:'🪵',v:2,build(g){farmArch(g);}});
/* jumps for the training field, like his picture: crossed poles, a straight bar, a wide oxer, a small cross for little ponies */
function jump(g,kind,c){c=c||'#5f7fd8';const W='#ffffff',BL='#3d3550';const stand=(x)=>{rbox(g,.5,.9,.5,.08,BL,x,.45,0,{ol:.015});box(g,.16,1.4,.16,BL,x,0,0,{ol:.012});};
  const pole=(x1,y1,x2,y2,z=0)=>{const L=Math.hypot(x2-x1,y2-y1),p=new THREE.Group();p.position.set((x1+x2)/2,(y1+y2)/2,z);p.rotation.z=Math.atan2(y2-y1,x2-x1);g.add(p);for(let i=0;i<6;i++)cyl(p,.05,.05,L/6,i%2?W:c,-L/2+L/12+i*L/6,0,0,{rz:Math.PI/2,center:true,seg:8,ol:i===0?.01:false});};
  if(kind==='x'){stand(-1.7);stand(1.7);pole(-1.6,.15,1.6,.85,.05);pole(-1.6,.85,1.6,.15,-.05);}
  else if(kind==='v'){stand(-1.7);stand(1.7);pole(-1.6,1.0,1.6,1.0);pole(-1.6,.55,1.6,.55);}
  else if(kind==='o'){for(const z of[-.6,.6]){const gg=new THREE.Group();gg.position.z=z;g.add(gg);}stand(-1.7);stand(1.7);pole(-1.6,.9,1.6,.9,-.6);pole(-1.6,1.0,1.6,1.0,.6);pole(-1.6,.5,1.6,.5,.6);for(const s of[-1,1])box(g,.16,1.2,.16,BL,s*1.7,0,-.6,{ol:.012});}
  else{for(const s of[-1,1])box(g,.12,.5,.12,BL,s*1.1,0,0,{ol:.01});pole(-1,.08,1,.42,.04);pole(-1,.42,1,.08,-.04);}}
for(const [k,n] of[['x','Crossed poles'],['v','Straight bar'],['o','Wide oxer'],['s','Little cross (ponies)']])pu('course:'+k,{name:'Jump: '+n,stage:6,group:'Farm Lane · training field',icon:'🚧',v:2,opts:[PU_OPT.col(['#5f7fd8','#ff6b6b','#ffd45c','#5fd4b0'])],dflt:{c:'#5f7fd8'},build(g,o){jump(g,k,o.c);}});

/* ---------- round 11 (30 Oct): farm machines, water tower, wilder trees ---------- */
/* an old tractor: a rounded red body, big rear wheels, small front wheels, a little cab frame and a chimney */
function tractor(g,c){c=c||'#d9483b';const D=shade(c,-.18),T='#3d3550',H='#c9c3b6';
  rbox(g,.9,.7,1.6,.18,c,0,.75,.35);rbox(g,.7,.5,.5,.12,D,0,1.05,-.45);box(g,.86,.08,.9,D,0,.36,.0,{ol:.01});
  for(const s of[-1,1]){const w=new THREE.Group();w.position.set(s*.62,.62,-.55);g.add(w);cyl(w,.62,.62,.32,T,0,0,0,{rz:Math.PI/2,center:true,seg:18,ol:.02});cyl(w,.34,.34,.34,'#ffd45c',0,0,0,{rz:Math.PI/2,center:true,seg:14,ol:false});
    const f=new THREE.Group();f.position.set(s*.52,.34,.95);g.add(f);cyl(f,.34,.34,.22,T,0,0,0,{rz:Math.PI/2,center:true,seg:14,ol:.016});cyl(f,.18,.18,.24,'#ffd45c',0,0,0,{rz:Math.PI/2,center:true,seg:10,ol:false});}
  for(const [x,z] of[[-.4,-.25],[.4,-.25],[-.4,-.75],[.4,-.75]])box(g,.06,1.1,.06,H,x,1.3,z,{ol:.008});box(g,.95,.06,.65,H,0,2.4,-.5,{ol:.01});
  cyl(g,.05,.06,.6,'#5a5f8c',.25,1.45,.75,{seg:8,ol:.008});rbox(g,.5,.12,.4,.04,'#5a5f8c',0,1.45,-.45,{ol:.008});for(const s of[-1,1])sph(g,.08,'#fff6d6',s*.3,.9,1.16,{s:[1,1,.5],ws:10,hs:8,ol:.008});}
pu('farm:tractor',{name:'Old tractor',stage:6,group:'Farm Lane · machines',icon:'🚜',v:2,opts:[PU_OPT.col(['#d9483b','#5fae5c','#5f8cd8','#e8b765'])],dflt:{c:'#d9483b'},build(g,o){tractor(g,o.c);}});
/* an old combine harvester: a tall green body, a glass cab on top, a wide header with a reel in front, an unloading pipe */
function combine(g,c){c=c||'#4f9a52';const D=shade(c,-.18),T='#3d3550',Y='#ffd45c';
  rbox(g,2.2,2.2,4,.3,c,0,1.8,-.3);rbox(g,1.4,1.1,1.2,.2,D,0,3.2,.9);const gl=new THREE.MeshToonMaterial({color:'#bfe6ff',gradientMap:GRAD,transparent:true,opacity:.5});box(g,1.3,.8,.04,null,0,3.45,1.52,{mat:gl,ol:false});
  for(const s of[-1,1]){cyl(g,.85,.85,.5,T,s*1.15,.85,.8,{rz:Math.PI/2,center:true,seg:18,ol:.02});cyl(g,.45,.45,.52,Y,s*1.15,.85,.8,{rz:Math.PI/2,center:true,seg:14,ol:false});cyl(g,.5,.5,.35,T,s*1,.5,-1.8,{rz:Math.PI/2,center:true,seg:14,ol:.016});}
  box(g,4.2,.5,1.1,Y,0,.35,2.2,{ol:.02});box(g,4.3,.08,1.2,D,0,.85,2.2,{ol:.01});const r=new THREE.Group();r.position.set(0,1.05,2.4);g.add(r);cyl(r,.06,.06,4,T,0,0,0,{rz:Math.PI/2,center:true,seg:8,ol:.008});
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2;box(r,4,.05,.05,'#ff6b6b',0,Math.sin(a)*.45,Math.cos(a)*.45,{center:true,ol:.006});}
  cyl(g,.15,.15,2.6,D,1.3,3.2,-.4,{rz:-1.1,ry:.3,center:true,seg:10,ol:.012});}
pu('farm:combine',{name:'Old combine harvester',stage:6,group:'Farm Lane · machines',icon:'🌾',v:2,opts:[PU_OPT.col(['#4f9a52','#d9483b','#e8b765'])],dflt:{c:'#4f9a52'},build(g,o){combine(g,o.c);}});
/* a wooden water tower: a round tank with bands and a cone roof on four legs, a ladder */
function waterTower(g){const Wd='#a8714a',D='#8a5a36',H=5;
  for(const [x,z] of[[-1.1,-1.1],[1.1,-1.1],[-1.1,1.1],[1.1,1.1]])box(g,.22,H,.22,D,x,0,z,{ol:.015});for(const y of[1.6,3.3])for(const s of[-1,1]){box(g,2.4,.12,.12,D,0,y,s*1.1,{ol:.01});box(g,.12,.12,2.4,D,s*1.1,y,0,{ol:.01});}
  cyl(g,1.6,1.6,2.4,Wd,0,H,0,{seg:20,ol:.025});for(const y of[.3,1.1,1.9])cyl(g,1.62,1.62,.1,'#5a5f8c',0,H+y,0,{seg:20,ol:false});cone(g,1.8,1.1,'#7a5a8c',0,H+2.4,0,{seg:20,ol:.025});
  for(let i=0;i<10;i++)box(g,.5,.05,.05,'#5a5f8c',1.25,.4+i*.48,1.25,{ry:Math.PI/4,center:true,ol:false});for(const s of[-1,1])box(g,.05,H,.05,'#5a5f8c',1.25+s*.18,0,1.25-s*.18,{ol:false});}
pu('farm:watertower',{name:'Water tower',stage:6,group:'Farm Lane · buildings',icon:'🛢️',v:2,build(g){waterTower(g);}});
/* trees for a wilder, older look: a big deep-green oak, a tall fir, a birch, a pine with snow on top, a low shrub */
function oak(g,x,z,s=1){const B='#5e3e2a',C=['#2f6a3a','#3a7a42','#2a5e33'];cyl(g,.35*s,.55*s,2.6*s,B,x,0,z,{seg:10,ol:.03});for(const [dx,dz,a] of[[.9,.2,-.6],[-.8,-.3,.7]])cyl(g,.15*s,.22*s,1.6*s,B,x+dx*s*.6,2.2*s,z+dz*s,{rz:a,center:true,seg:8,ol:.02});
  for(const [dx,dy,dz,r] of[[0,4.2,0,2.1],[1.6,3.6,.5,1.5],[-1.6,3.7,-.4,1.6],[.4,3.5,-1.5,1.4],[-.5,3.4,1.5,1.4],[.2,5.3,.2,1.4]])sph(g,r*s,C[Math.abs(Math.round(dx*3))%3],x+dx*s,dy*s,z+dz*s,{ws:12,hs:9,ol:.035});}
function fir(g,x,z,s=1,snow){const C='#2f6a48';cyl(g,.16*s,.22*s,1*s,'#7a5236',x,0,z,{seg:8,ol:.015});for(let i=0;i<5;i++){const r=(1.5-i*.26)*s,h=(1.5-i*.12)*s,y=(.8+i*1.05)*s;cone(g,r,h,C,x,y,z,{seg:10,ol:.025});if(snow&&i>=3)cone(g,r*.62,h*.5,'#ffffff',x,y+h*.52,z,{seg:10,ol:.015});}}
function birch(g,x,z,s=1){cyl(g,.12*s,.16*s,3.4*s,'#f2efe6',x,0,z,{seg:8,ol:.015});for(let i=0;i<6;i++)box(g,.2*s,.05*s,.05*s,'#3d3550',x,.5*s+i*.5*s,z+.12*s,{ry:i,ol:false});for(const [dx,dy,dz,r] of[[0,3.6,0,1],[.6,3.1,.2,.7],[-.5,3.2,-.2,.75]])sph(g,r*s,'#8fd06a',x+dx*s,dy*s,z+dz*s,{ws:10,hs:8,ol:.02});}
function snowPine(g,x,z,s=1){pine(g,x,z,s);cone(g,.42*s,.8*s,'#ffffff',x,2.82*s,z,{seg:9,ol:.012});cone(g,.62*s,.5*s,'#ffffff',x,1.95*s,z,{seg:9,ol:false});}
function shrub(g,x,z,s=1){const C=['#4f9a52','#5fae5c','#3f7a45'];for(let i=0;i<6;i++){const a=i/6*Math.PI*2;sph(g,(.45+((i*7)%3)*.1)*s,C[i%3],x+Math.cos(a)*.6*s,.32*s,z+Math.sin(a)*.4*s,{s:[1.2,.75,1],ws:9,hs:7,ol:.02});}sph(g,.55*s,C[0],x,.55*s,z,{ws:10,hs:8,ol:.02});}
pu('nature:oak',{name:'Big old oak',stage:6,group:'Nature',icon:'🌳',v:2,build(g){oak(g,0,0,1);}});
pu('nature:fir',{name:'Tall fir (snow option)',stage:6,group:'Nature',icon:'🌲',v:2,opts:[PU_OPT.pick('snow','Snow',[['0','No snow'],['1','Snowy top']])],dflt:{snow:'0'},build(g,o){fir(g,0,0,1,o.snow==='1');}});
pu('nature:birch',{name:'Birch',stage:6,group:'Nature',icon:'🌳',v:2,build(g){birch(g,0,0,1);}});
pu('nature:shrub',{name:'Wild shrub',stage:6,group:'Nature',icon:'🌿',v:2,build(g){shrub(g,0,0,1);}});
/* capybara: 5 DIFFERENT versions from the soft one, boxier, with the sticker's drawn face: a muzzle patch where the nose and the little mouth are joined by one line */
function capyFace(h,z,y,s,C){const M=shade(C,-.14),L='#5a3624';sph(h,.1*s,M,0,y,z,{s:[1.2,.85,.45],ws:16,hs:12,ol:false});sph(h,.028*s,L,0,y+.03*s,z+.035*s,{s:[1.5,.8,.6],ws:10,hs:8,ol:false});
  box(h,.008,.04*s,.008,L,0,y-.015*s,z+.046*s,{center:true,ol:false});const w=new THREE.Group();w.position.set(0,y-.038*s,z+.046*s);h.add(w);for(const sd of[-1,1]){const a=new THREE.Mesh(new THREE.TorusGeometry(.022*s,.0065,6,12,Math.PI),mat(L));a.position.x=sd*.022*s;a.rotation.z=Math.PI;w.add(a);}}
function capyBoxy(col,v){const C=col||'#c98f5e',Lt=shade(C,.12),P=shade(C,-.2),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const V={1:{bw:.5,bh:.42,bd:.78,br:.18,hw:.36,hh:.34,hd:.34,hr:.13,hy:.5,hz:.4,leg:.12,eye:.026,sprout:0},
           2:{bw:.56,bh:.5,bd:.62,br:.22,hw:.42,hh:.38,hd:.36,hr:.16,hy:.6,hz:.32,leg:.08,eye:.03,sprout:1},
           3:{bw:.46,bh:.36,bd:.92,br:.12,hw:.34,hh:.3,hd:.4,hr:.08,hy:.44,hz:.5,leg:.14,eye:.022,sprout:0},
           4:{bw:.5,bh:.44,bd:.7,br:.2,hw:.46,hh:.42,hd:.38,hr:.18,hy:.62,hz:.36,leg:.1,eye:.034,sprout:0,blushBig:1},
           5:{bw:.48,bh:.4,bd:.8,br:.16,hw:.36,hh:.32,hd:.36,hr:.12,hy:.48,hz:.44,leg:.12,eye:.024,sprout:0,yuzu:1}}[v];
  rbox(b,V.bw,V.bh,V.bd,V.br,C,0,V.leg+V.bh/2,0);sph(b,V.bw*.42,Lt,0,V.leg+.06,.02,{s:[1,.3,V.bd/V.bw*1.1],ws:14,hs:8,ol:false});
  for(const [x,z] of[[-1,1],[1,1],[-1,-1],[1,-1]]){const p=new THREE.Group();p.position.set(x*(V.bw/2-.09),V.leg+.02,z*(V.bd/2-.1));b.add(p);cyl(p,.06,.058,V.leg+.02,C,0,-V.leg-.02,0,{seg:12,ol:.012});sph(p,.062,P,0,-V.leg+.005,.02,{s:[1,.42,1.25],ws:10,hs:8,ol:.01});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,V.hy,V.hz);b.add(head);rbox(head,V.hw,V.hh,V.hd,V.hr,C,0,0,0);
  capyFace(head,V.hd/2-.005,-.03,V.hw/.36,C);
  for(const s of[-1,1]){sph(head,V.eye,'#1d1622',s*V.hw*.32,V.hh*.18,V.hd/2-.015,{ws:12,hs:10,ol:false});sph(head,V.eye*.36,'#ffffff',s*V.hw*.32+.007,V.hh*.18+V.eye*.4,V.hd/2+V.eye*.3,{ws:6,hs:4,ol:false});
    sph(head,V.blushBig?.045:.032,'#ff9e9e',s*V.hw*.4,-.05,V.hd/2-.02,{s:[1,.55,.3],ws:10,hs:6,ol:false});
    sph(head,.045,C,s*(V.hw/2-.04),V.hh/2,-.05,{s:[1,.9,.6],ws:12,hs:8,ol:.008});sph(head,.026,P,s*(V.hw/2-.04),V.hh/2,-.035,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  if(V.sprout){cyl(head,.006,.006,.07,'#5fae5c',0,V.hh/2,0,{seg:6,ol:false});for(const s of[-1,1])sph(head,.032,'#7ccf5a',s*.032,V.hh/2+.075,0,{s:[1.4,.35,.8],rz:s*.4,ws:10,hs:6,ol:.006});}
  if(V.yuzu){sph(head,.05,'#ffb347',0,V.hh/2+.04,-.02,{ws:12,hs:10,ol:.008});sph(head,.012,'#5fae5c',0,V.hh/2+.095,-.02,{s:[1.6,.5,1],ws:6,hs:4,ol:false});}
  if(v===2){b.rotation.x=-.55;b.position.set(0,.12,-.1);head.rotation.x=.5;legs.slice(0,2).forEach(l=>l.rotation.x=.4);}
  if(v===5){legs.forEach(l=>{l.scale.y=.25;});b.position.y=-V.leg+.03;for(const o of [...head.children])if(o.geometry&&o.geometry.type==='SphereGeometry'&&o.material&&o.material.color&&o.material.color.getHexString()==='1d1622'){const e=new THREE.Mesh(new THREE.TorusGeometry(.02,.006,6,12,Math.PI),mat(INK));e.position.copy(o.position);e.rotation.z=Math.PI;head.add(e);o.visible=false;}}
  root.scale.setScalar(1.25);return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6};}
{const P=PU['age:capybara'];const B=P.build;const lk=P.opts.find(o=>o.k==='look');PU['age:capybara']=Object.assign({},P,{opts:[PU_OPT.pick('look','Look',[['b1','New 1: boxy, standing'],['b2','New 2: sitting up + sprout'],['b3','New 3: long and low'],['b4','New 4: big head, big blush'],['b5','New 5: lying loaf, sleepy, yuzu']].concat(lk.vals))].concat(P.opts.filter(o=>o.k!=='look')),dflt:Object.assign({},P.dflt,{look:'b1'}),
  build(g,o){const l=o.look||'b1';if(l[0]!=='b'){B(g,o);return;}const m=puAge(capyBoxy(o.c&&o.c!==PET_TYPES.capybara.cols[0]?o.c:null,+l[1]),o.age||'adult');g.add(m.root);}});}

/* ---------- round 12 (30 Oct): his notes on the new models ---------- */
/* capybara: the sticker, standing on four legs, in 11 versions (the sticker sitting is kept as it was) */
function capyStand(col,P){const C=col||P.c||'#d9955a',M=shade(C,-.14),D=shade(C,-.22),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const L=P.len||1,Hh=P.head||1;
  sph(b,.28,C,0,.4,-.06,{s:[1,.85,1.25*L],ws:24,hs:18});sph(b,.2,shade(C,.1),0,.3,-.04,{s:[1,.5,1.2*L],ws:14,hs:8,ol:false});
  for(const [x,z] of[[-.14,.17],[.14,.17],[-.14,-.25*L-.04],[.14,-.25*L-.04]]){const p=new THREE.Group();p.position.set(x,.22,z);b.add(p);cyl(p,.072,.066,.22,C,0,-.22,0,{seg:14,ol:.012});sph(p,.07,D,0,-.21,.025,{s:[1,.45,1.3],ws:12,hs:8,ol:.01});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,.58,.28);head.scale.setScalar(Hh);b.add(head);
  sph(head,.23,C,0,0,0,{s:[1,.92,P.snout||.95],ws:22,hs:16});
  const mz=.2*(P.snout||.95);sph(head,.11*(P.muzzle||1),M,0,-.045,mz,{s:[1.2,.9,.45],ws:18,hs:12,ol:false});
  sph(head,.032,'#5a3624',0,-.005,mz+.04,{s:[1.4,.8,.6],ws:12,hs:8,ol:false});box(head,.008,.035,.008,'#5a3624',0,-.03,mz+.048,{center:true,ol:false});
  {const w=new THREE.Group();w.position.set(0,-.055,mz+.048);head.add(w);for(const s of[-1,1]){const a=new THREE.Mesh(new THREE.TorusGeometry(.02,.006,6,12,Math.PI),mat('#5a3624'));a.position.x=s*.02;a.rotation.z=Math.PI;w.add(a);}}
  for(const s of[-1,1]){const ex=.11*(P.eyeW||1),ey=.05,ez=mz-.02;
    if(P.eye==='sleepy'){const e=new THREE.Mesh(new THREE.TorusGeometry(.022,.007,6,12,Math.PI),mat(INK));e.position.set(s*ex,ey,ez);head.add(e);}
    else if(P.eye==='sparkle'){sph(head,.032,'#1d1622',s*ex,ey,ez,{ws:12,hs:10,ol:false});sph(head,.012,'#ffffff',s*ex+.01,ey+.012,ez+.025,{ws:6,hs:4,ol:false});sph(head,.006,'#ffffff',s*ex-.008,ey-.01,ez+.027,{ws:5,hs:4,ol:false});}
    else{sph(head,.026,'#1d1622',s*ex,ey,ez,{ws:12,hs:10,ol:false});sph(head,.009,'#ffffff',s*ex+.008,ey+.012,ez+.02,{ws:6,hs:4,ol:false});}
    sph(head,.038*(P.blush||1),'#ff9e9e',s*.16,-.045,mz-.04,{s:[1,.55,.3],ws:10,hs:6,ol:false});
    const er=P.ear||.05;sph(head,er,C,s*.17,.16,-.03,{s:[1,.95,.6],ws:14,hs:10,ol:.008});sph(head,er*.6,D,s*.17,.16,-.012,{s:[1,1,.4],ws:10,hs:8,ol:false});}
  if(P.sprout){cyl(head,.006,.006,.08,'#5fae5c',0,.2,0,{seg:6,ol:false});for(const s of[-1,1])sph(head,.035,'#7ccf5a',s*.035,.28,0,{s:[1.4,.35,.8],rz:s*.4,ws:10,hs:6,ol:.006});}
  if(P.tuft)for(const [x,z] of[[0,0],[-.03,-.03],[.03,-.02]])sph(head,.035,D,x,.2,z,{s:[.8,1.2,.8],ws:8,hs:6,ol:.006});
  if(P.yuzu){sph(head,.055,'#ffb347',0,.23,-.02,{ws:12,hs:10,ol:.008});sph(head,.013,'#5fae5c',0,.29,-.02,{s:[1.6,.5,1],ws:6,hs:4,ol:false});}
  if(P.bow){const g=new THREE.Group();g.position.set(.12,.17,0);g.rotation.z=-.3;head.add(g);bowShape(g,.55,'#ff7aa8',{ol:.008});}
  if(P.scarf){/* a red bandana with white dots, tied under the chin and hanging on the chest (a scarf round the neck hid between head and body) */const bd=new THREE.Group();bd.position.set(0,.47,.42);bd.rotation.x=.25;b.add(bd);cone(bd,.16,.22,'#ff6b6b',0,0,0,{rx:Math.PI,center:true,seg:3,s:[1,1,.25],ol:.012});for(const [x,y] of[[-.06,.03],[.05,.04],[0,-.04],[.08,-.02],[-.03,-.08]])sph(bd,.014,'#ffffff',x,y,.03,{s:[1,1,.4],ws:6,hs:4,ol:false});sph(bd,.03,'#e05555',0,.1,0,{ws:8,hs:6,ol:.006});}
  root.scale.setScalar(1.25);return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6};}
const CAPY_STAND=[
 ['s1','Standing sticker',{}],['s2','+ sprout',{sprout:1}],['s3','Sleepy',{eye:'sleepy'}],['s4','Sparkle eyes, big head',{eye:'sparkle',head:1.15}],['s5','Long body',{len:1.25}],
 ['s6','Darker brown, small ears',{c:'#b07848',ear:.04}],['s7','Pale tan, big blush',{c:'#e0b080',blush:1.4}],['s8','Hair tuft',{tuft:1}],['s9','Yuzu on head',{yuzu:1}],['s10','Pink bow',{bow:1}],['s11','Red bandana, longer face',{scarf:1,snout:1.15,muzzle:1.1}]];
/* number 1 (the boxy standing one): the face a bit longer */
{const cb=capyBoxy;capyBoxy=function(col,v){const m=cb(col,v);if(v===1){m.head.scale.z*=1.22;m.head.position.z+=.03;}return m;};}
{const P=PU['age:capybara'];const B=P.build;const lk=P.opts.find(o=>o.k==='look');PU['age:capybara']=Object.assign({},P,{opts:[PU_OPT.pick('look','Look',CAPY_STAND.map(([k,n])=>[k,n]).concat(lk.vals.map(([k,n])=>[k,k==='b1'?'New 1: boxy (longer face)':n])))].concat(P.opts.filter(o=>o.k!=='look')),dflt:Object.assign({},P.dflt,{look:'s1'}),
  build(g,o){const l=o.look||'s1';const S=CAPY_STAND.find(x=>x[0]===l);if(!S){B(g,o);return;}const m=puAge(capyStand(o.c&&o.c!==PET_TYPES.capybara.cols[0]?o.c:null,S[2]),o.age||'adult');g.add(m.root);}});}
/* jumps: country style: natural wooden posts and slim poles (no dark blocks) */
function jump(g,kind,c){c=c||'#5f7fd8';const Wd='#b8804f',W='#ffffff';const post=(x,z=0,h=1.35)=>{cyl(g,.06,.07,h,Wd,x,0,z,{seg:8,ol:.012});cyl(g,.075,.075,.04,shade(Wd,-.15),x,h,z,{seg:8,ol:false});for(const sx of[-1,1])box(g,.05,.05,.35,Wd,x,.04,z+sx*.0,{ry:sx*.0,rz:0,ol:false});box(g,.4,.05,.05,Wd,x,.03,z,{ol:.008});};
  const pole=(x1,y1,x2,y2,z=0)=>{const L=Math.hypot(x2-x1,y2-y1),p=new THREE.Group();p.position.set((x1+x2)/2,(y1+y2)/2,z);p.rotation.z=Math.atan2(y2-y1,x2-x1);g.add(p);for(let i=0;i<6;i++)cyl(p,.032,.032,L/6,i%2?W:c,-L/2+L/12+i*L/6,0,0,{rz:Math.PI/2,center:true,seg:8,ol:i===0?.008:false});};
  if(kind==='x'){post(-1.6);post(1.6);pole(-1.55,.15,1.55,.8,.05);pole(-1.55,.8,1.55,.15,-.05);}
  else if(kind==='v'){post(-1.6);post(1.6);pole(-1.55,.95,1.55,.95);pole(-1.55,.5,1.55,.5);}
  else if(kind==='o'){for(const z of[-.55,.55]){post(-1.6,z);post(1.6,z);}pole(-1.55,.85,1.55,.85,-.55);pole(-1.55,.95,1.55,.95,.55);pole(-1.55,.5,1.55,.5,.55);}
  else{post(-1.05,0,.6);post(1.05,0,.6);pole(-1,.08,1,.42,.03);pole(-1,.42,1,.08,-.03);}}
/* arch: the beam and the two posts as clean round logs; the corner braces sit flush on both */
function farmArch(g,span=7){const Wd='#8a5a36',D2='#6e4527',H=4.6;for(const s of[-1,1]){cyl(g,.2,.24,H+.2,Wd,s*span/2,0,0,{seg:12,ol:.02});sph(g,.22,D2,s*span/2,H+.2,0,{s:[1,.5,1],ws:10,hs:6,ol:.012});}
  cyl(g,.17,.17,span+.7,Wd,0,H-.1,0,{rz:Math.PI/2,center:true,seg:12,ol:.02});
  for(const s of[-1,1]){const L=1.2,p=new THREE.Group();p.position.set(s*(span/2-.42),H-.52,0);p.rotation.z=s*-.785;g.add(p);cyl(p,.08,.08,L,Wd,0,0,0,{center:true,seg:10,ol:.012});}
  for(const s of[-1,1])cyl(g,.012,.012,.55,'#5a5f8c',s*.9,H-.65,0,{seg:4,ol:false});box(g,2.3,.62,.1,'#ffd45c',0,H-1.25,0,{ol:.015});const sp=signPlane('FARM',2.1,.5,'#ffd45c','#3d2c5e');sp.position.set(0,H-.94,.06);g.add(sp);const sb=sp.clone();sb.rotation.y=Math.PI;sb.position.z=-.06;g.add(sb);}
/* the old labrador: a real dog's sleep: curled on its side, back rounded, tail wrapped round, chin on its paws, eyes shut */
function sleepyLab(){const C='#e8c98f',D=shade(C,-.12),G='#d8d2c4',g=new THREE.Group();
  sph(g,.36,C,0,.22,0,{s:[1.05,.62,1.25],ws:22,hs:14});sph(g,.22,C,.18,.18,-.3,{s:[1,.75,1],ws:16,hs:12});
  {const t=new THREE.Group();g.add(t);tube(t,[[.3,.1,-.42],[.15,.06,-.55],[-.15,.06,-.5],[-.32,.06,-.3],[-.38,.06,-.05]],t2=>.06-t2*.025,0,C,{seg:20,rad:10,ol:.01});}
  for(const z of[.36,.44]){rbox(g,.09,.07,.3,.035,C,-.18+z*.2,.05,z,{ry:-.5});sph(g,.05,C,-.08+z*.2,.05,z+.13,{s:[1,.7,1.2],ws:10,hs:8,ol:.01});}
  const h=new THREE.Group();h.position.set(-.24,.19,.38);h.rotation.y=-.7;h.rotation.z=.25;h.scale.setScalar(1.45);g.add(h);
  rbox(h,.24,.2,.26,.09,C,0,0,0);rbox(h,.16,.12,.15,.05,G,0,-.04,.17,{ol:.012});sph(h,.028,'#2e2347',0,.0,.25,{s:[1.3,.8,.8],ws:10,hs:8,ol:false});
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.TorusGeometry(.02,.006,6,12,Math.PI),mat(INK));e.position.set(s*.06,.04,.13);e.rotation.z=Math.PI;h.add(e);rbox(h,.07,.19,.13,.03,D,s*.14,-.04,-.02,{rz:s*.2,ol:.01});}
  const Zg=new THREE.Group();Zg.position.set(-.05,.6,.4);g.add(Zg);const z=(x,y,s)=>{const p=new THREE.Group();p.position.set(x,y,0);p.scale.setScalar(s);Zg.add(p);const c='#b79cff';box(p,.14,.035,.03,c,0,.12,0,{center:true,ol:.008});box(p,.14,.035,.03,c,0,0,0,{center:true,ol:.008});box(p,.035,.17,.03,c,0,.06,0,{rz:-.95,center:true,ol:.008});};z(0,0,.8);z(.12,.17,.6);z(.22,.3,.45);
  g.scale.setScalar(1.15);return g;}
/* five different wild shrubs: a round bush, a wide low spread, a tall leafy one, a berry bush, a flowering one */
function shrubV(g,x,z,s,v){const C=['#4f9a52','#5fae5c','#3f7a45','#6fbf5e'];
  if(v===1){shrub(g,x,z,s);}
  else if(v===2){for(let i=0;i<8;i++){const a=i/8*Math.PI*2;sph(g,.45*s,C[i%3],x+Math.cos(a)*.9*s,.22*s,z+Math.sin(a)*.6*s,{s:[1.4,.55,1],ws:9,hs:6,ol:.02});}}
  else if(v===3){for(let i=0;i<5;i++)sph(g,(.42-i*.05)*s,C[(i+1)%4],x+((i*13)%5-2)*.08*s,(.4+i*.32)*s,z+((i*7)%5-2)*.08*s,{s:[1,1.2,1],ws:10,hs:8,ol:.02});}
  else if(v===4){shrub(g,x,z,s*.9);for(let i=0;i<34;i++){const a=i*2.4,r=(.45+((i*3)%4)*.06)*s;sph(g,.085*s,i%3?'#d9483b':'#8a3cff',x+Math.cos(a)*r,(.3+((i*5)%7)*.07)*s,z+Math.sin(a)*r*.75,{ws:6,hs:5,ol:.006});}}
  else{shrub(g,x,z,s*.9);for(let i=0;i<12;i++){const a=i*2.4,r=.5*s;sph(g,.09*s,['#ffffff','#ff9ec4','#ffd45c'][i%3],x+Math.cos(a)*r,(.55+((i*5)%5)*.06)*s,z+Math.sin(a)*r*.75,{s:[1,.5,1],ws:8,hs:5,ol:.006});}}}
pu('nature:shrub',{name:'Wild shrub (5 kinds)',stage:6,group:'Nature',icon:'🌿',v:2,opts:[PU_OPT.pick('k','Kind',[['1','Round'],['2','Wide, low'],['3','Tall, leafy'],['4','Berries'],['5','Flowering']])],dflt:{k:'1'},build(g,o){shrubV(g,0,0,1,+o.k);}});
/* tractor, made better: an old round-nosed tractor with a grille, a seat and steering wheel, mudguards over the big wheels, a muffler */
function tractor(g,c){c=c||'#d9483b';const D=shade(c,-.2),T='#3d3550',Y='#ffd45c',S='#5a5f8c';
  rbox(g,.62,.58,1.3,.24,c,0,.82,.45);rbox(g,.56,.5,.08,.06,'#c9c3b6',0,.8,1.1,{ol:.01});for(let i=0;i<5;i++)box(g,.48,.03,.02,S,0,.62+i*.08,1.15,{center:true,ol:false});
  for(const s of[-1,1])sph(g,.08,'#fff6d6',s*.22,1.05,1.08,{s:[1,1,.5],ws:10,hs:8,ol:.008});
  rbox(g,.7,.4,.6,.1,D,0,.75,-.35);
  for(const s of[-1,1]){const w=new THREE.Group();w.position.set(s*.58,.66,-.5);g.add(w);cyl(w,.66,.66,.34,T,0,0,0,{rz:Math.PI/2,center:true,seg:20,ol:.02});cyl(w,.36,.36,.36,Y,0,0,0,{rz:Math.PI/2,center:true,seg:16,ol:false});for(let k=0;k<10;k++){const a=k/10*Math.PI*2;box(w,.36,.1,.12,T,0,Math.cos(a)*.66,Math.sin(a)*.66,{rx:a,center:true,ol:false});}
    rbox(g,.42,.08,1.15,.035,c,s*.58,1.34,-.5,{ol:.012});rbox(g,.42,.5,.08,.035,c,s*.58,1.12,-1.08,{ol:.012});
    const f=new THREE.Group();f.position.set(s*.44,.34,.95);g.add(f);cyl(f,.34,.34,.2,T,0,0,0,{rz:Math.PI/2,center:true,seg:16,ol:.016});cyl(f,.18,.18,.22,Y,0,0,0,{rz:Math.PI/2,center:true,seg:12,ol:false});}
  rbox(g,.4,.1,.36,.04,'#3d3550',0,1.2,-.45,{ol:.01});rbox(g,.4,.4,.08,.04,'#3d3550',0,1.25,-.66,{ol:.01});
  cyl(g,.03,.03,.5,S,0,1.2,-.05,{rx:-.6,seg:6,ol:false});{const t=new THREE.Mesh(new THREE.TorusGeometry(.16,.025,6,18),mat(T));t.position.set(0,1.55,.12);t.rotation.x=-.9;g.add(t);}
  cyl(g,.05,.06,.75,S,.22,1.35,.75,{seg:8,ol:.008});cyl(g,.07,.07,.08,S,.22,2.1,.75,{seg:8,ol:false});}

/* ---------- round 13 (30 Oct): one capybara only, like his photo ---------- */
/* a real capybara, in the game's toon style: a big barrel body, short sturdy legs, a long blocky head with a blunt square snout,
   a broad dark nose at the top of the snout, small eyes set high, small round ears on top, coarse warm-brown fur, darker on the back and the face top */
function capyReal(col){const C=col||'#a8774a',D=shade(C,-.12),Dk=shade(C,-.22),Lt=shade(C,.1),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.3,C,0,.4,-.04,{s:[.92,.95,1.6],ws:24,hs:18});sph(b,.22,Lt,0,.3,0,{s:[.8,.4,1.4],ws:14,hs:8,ol:false});
  sph(b,.26,C,0,.47,-.36,{s:[.95,.95,.8],ws:18,hs:14});   /* the round rump, no tail */
  for(const [x,z,f] of[[-.15,.26,1],[.15,.26,1],[-.16,-.36,0],[.16,-.36,0]]){const p=new THREE.Group();p.position.set(x,.2,z);b.add(p);
    tube(p,[[0,.08,0],[0,-.06,f?.02:-.02],[0,-.17,.01]],.09,.075,C,{seg:8,rad:12,ol:.012,caps:false});sph(p,.075,Dk,0,-.175,.035,{s:[1,.45,1.35],ws:12,hs:8,ol:.01});legs.push(p);}
  sph(b,.2,C,0,.56,.25,{s:[.95,1,1],ws:18,hs:12});   /* the neck blends the head into the body */
  const head=new THREE.Group();head.position.set(0,.66,.4);head.rotation.x=.15;head.scale.setScalar(1.3);b.add(head);
  rbox(head,.36,.34,.52,.13,C,0,0,.1);rbox(head,.32,.24,.2,.1,D,0,.07,-.06,{ol:false});
  rbox(head,.34,.3,.17,.06,shade(C,.04),0,-.02,.33,{ol:.012});   /* the blunt square snout */
  sph(head,.06,'#3d2a20',0,.09,.41,{s:[1.8,.55,.45],ws:14,hs:8,ol:false});for(const s of[-1,1])sph(head,.018,'#1d1410',s*.05,.07,.43,{s:[1.2,.8,.6],ws:6,hs:4,ol:false});
  box(head,.14,.012,.008,'#3d2a20',0,-.09,.413,{center:true,ol:false});
  for(const s of[-1,1]){sph(head,.034,'#1d1622',s*.172,.14,.17,{ws:12,hs:10,ol:false});sph(head,.012,'#ffffff',s*.178,.153,.195,{ws:6,hs:4,ol:false});
    sph(head,.07,D,s*.15,.2,-.08,{s:[1,.9,.6],ws:14,hs:10,ol:.01});sph(head,.042,Dk,s*.15,.2,-.06,{s:[1,1,.4],ws:10,hs:8,ol:false});}
  root.scale.setScalar(1.15);return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6};}
/* every capybara is now this one (the game pet, the baby and teen card, the backyard) */
{const _mp=makePet;makePet=function(type,col){return type==='capybara'?capyReal(col&&col!==PET_TYPES.capybara.cols[0]?col:null):_mp(type,col);};}
{const P=PU['age:capybara'];PU['age:capybara']=Object.assign({},P,{name:'Capybara',v:2,opts:[AGE_OPT,PU_OPT.col(['#a8774a','#9a6a43','#b8875a','#8a5f3c'])],dflt:{age:'adult',c:'#a8774a'},
  build(g,o){g.add(puAge(capyReal(o.c),o.age||'adult').root);}});}

/* ---------- round 14 (30 Oct): his notes on the farm models + a size lineup ---------- */
/* real size: the player is 1.67 m tall, so 1 m is about 1.23 game units */
const KM=1.23;
/* a tyre on an axle along x: rubber, tread lugs, a painted rim and hub */
function tyre(g,x,y,z,r,w,rim,o={}){const T='#2f2b38',n=o.lugs||Math.round(r*22);
  cyl(g,r,r,w,T,x,y,z,{rz:Math.PI/2,center:true,seg:28,ol:.02});
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2;for(const s of[-1,1])box(g,w*.46,.06*r+.02,.16*r+.03,T,x+s*w*.24,y+Math.cos(a)*r,z+Math.sin(a)*r,{rx:-a+s*.35,center:true,ol:false});}
  for(const s of[-1,1]){cyl(g,r*.62,r*.62,.02,rim,x+s*(w/2+.005),y,z,{rz:Math.PI/2,center:true,seg:24,ol:.01});cyl(g,r*.22,r*.22,.06,shade(rim,-.25),x+s*(w/2+.03),y,z,{rz:Math.PI/2,center:true,seg:14,ol:.008});
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;sph(g,.025,'#8a8698',x+s*(w/2+.05),y+Math.cos(a)*r*.15,z+Math.sin(a)*r*.15,{ws:6,hs:4,ol:false});}}}
const GLASS=()=>{const m=new THREE.MeshLambertMaterial({color:'#bfe3f2',transparent:true,opacity:.45});return m;};
const rust=(g,pts)=>{for(const [x,y,z,r,ax] of pts)sph(g,r,'#a0603a',x,y,z,{s:ax==='x'?[.15,1,1.3]:ax==='z'?[1.3,1,.15]:[1.3,.15,1],ws:8,hs:6,ol:false});};

/* the old tractor: a red Soviet-era village tractor (the kind every Lithuanian village had), big rear wheels, long hood, white cab */
function tractor(g,c){c=c||'#c9302c';const D=shade(c,-.2),W='#ece8de',GR='#4a4658',K=KM;
  const RW=.75*K,FW=.47*K,ra=-1.0,fa=1.85;   /* wheel radii, rear and front axle z */
  for(const s of[-1,1]){tyre(g,s*.82,RW,ra,RW,.5,c);tyre(g,s*.62,FW,fa,FW,.3,c,{lugs:14});}
  box(g,1.0,.12,.12,GR,0,FW,fa,{center:true,ol:.01});box(g,1.5,.14,.14,GR,0,RW,ra,{center:true,ol:.01});
  /* frame and engine block under the hood */
  box(g,.56,.5,3.0,GR,0,.62,.5,{ol:.012});
  /* the hood: long, a little rounded on top, louvres on the sides */
  rbox(g,.82,.6,2.3,.12,c,0,1.42,.95);box(g,.84,.08,2.32,D,0,1.08,.95,{center:true,ol:false});
  for(const s of[-1,1])for(let i=0;i<5;i++)box(g,.02,.06,.3,D,s*.415,1.45-.0,.3+i*.32,{center:true,ol:false});
  /* the grille at the front: a dark grid in a red frame, round headlights in the corners */
  rbox(g,.86,.72,.16,.06,c,0,1.35,2.12);box(g,.62,.5,.04,'#2e2a38',0,1.34,2.2,{center:true,ol:false});for(let i=0;i<6;i++)box(g,.6,.025,.05,'#6a6578',0,1.13+i*.085,2.21,{center:true,ol:false});
  for(const s of[-1,1]){cyl(g,.1,.1,.08,'#d9d4c6',s*.36,1.58,2.18,{rx:Math.PI/2,center:true,seg:14,ol:.01});sph(g,.075,'#fff6c8',s*.36,1.58,2.23,{s:[1,1,.35],ws:12,hs:8,ol:false});}
  /* a front weight and the tow hook */
  box(g,.9,.22,.18,GR,0,.62,2.12,{center:true,ol:.012});
  /* the exhaust pipe with its little flap, the air filter cup */
  cyl(g,.075,.075,1.5,'#3d3a46',.28,1.7,1.5,{seg:10,ol:.012});cyl(g,.065,.065,.05,'#3d3a46',.28,3.2,1.5,{seg:10,ol:.008});box(g,.12,.01,.12,'#3d3a46',.28,3.26,1.5,{rx:.4,center:true,ol:false});
  cyl(g,.07,.07,.25,'#3d3a46',-.26,1.7,1.75,{seg:10,ol:.01});cyl(g,.12,.1,.16,GR,-.26,1.93,1.75,{seg:12,ol:.01});
  /* rear fenders: curved red covers over the big wheels */
  for(const s of[-1,1]){box(g,.6,.05,.9,c,s*.82,RW*2+.1,ra,{center:true,ol:.01});for(const e of[-1,1])box(g,.6,.05,.75,c,s*.82,RW*2-.12,ra+e*.68,{rx:e*.75,center:true,ol:.01});}
  /* the cab: a white roof, thin posts, big glass, a door handle, seat and steering wheel inside */
  const cy=1.45,ch=1.5,cw=1.18,cd=1.25,cz=ra+.05;box(g,cw,.12,cd,D,0,cy,cz,{ol:.012});
  for(const [x,z] of[[-1,-1],[1,-1],[-1,1],[1,1]])box(g,.07,ch,.07,W,x*(cw/2-.035),cy+.12,cz+z*(cd/2-.035),{ol:.01});
  rbox(g,cw+.16,.14,cd+.2,.05,W,0,cy+ch+.15,cz);box(g,cw+.1,.08,cd+.14,shade(W,-.1),0,cy+ch+.04,cz,{ol:false});
  const gl=GLASS();for(const s of[-1,1]){box(g,.01,ch-.1,cd-.1,'#fff',s*(cw/2-.02),cy+.17,cz,{mat:gl,ol:false});box(g,cw-.1,ch-.1,.01,'#fff',0,cy+.17,cz+s*(cd/2-.02),{mat:gl,ol:false});}
  box(g,.12,.03,.03,'#3d3a46',cw/2,cy+.75,cz+.2,{ol:false});
  rbox(g,.42,.1,.4,.04,'#3d3550',0,cy+.45,cz-.2);rbox(g,.42,.45,.1,.04,'#3d3550',0,cy+.75,cz-.42);
  {const sw=new THREE.Mesh(new THREE.TorusGeometry(.15,.02,6,18),mat('#2e2a38'));sw.position.set(0,cy+.95,cz+.3);sw.rotation.x=-1.0;g.add(sw);cyl(g,.02,.02,.5,'#2e2a38',0,cy+.55,cz+.42,{rx:.5,seg:6,ol:false});}
  /* the step, the rear hitch and arms, a little rust */
  box(g,.3,.04,.22,GR,cw/2+.14,.85,cz+.4,{ol:.008});box(g,.3,.04,.22,GR,cw/2+.14,1.15,cz+.4,{ol:.008});
  box(g,.9,.1,.1,GR,0,.55,ra-.75,{center:true,ol:.01});for(const s of[-1,1])box(g,.06,.06,.6,GR,s*.32,.62,ra-.55,{rx:.3,center:true,ol:.008});
  rust(g,[[.42,1.25,1.7,.07,'x'],[-.42,1.3,.6,.06,'x'],[0,1.73,2.0,.05,'y'],[.6,RW*2+.11,ra+.15,.06,'y']]);}
pu('farm:tractor',{name:'Old tractor',stage:6,group:'Farm Lane · machines',icon:'🚜',v:3,note:'real size: about 3.9 m long, 2.8 m to the cab roof',opts:[PU_OPT.col(['#c9302c','#3f7fc9','#4f9a52','#e8a33c'])],dflt:{c:'#c9302c'},build(g,o){tractor(g,o.c);}});

/* the old combine harvester: a big red village combine with a wide header and reel, a high glass cab, the grain tank, the folded unloading pipe */
function combine(g,c){c=c||'#c4302b';const D=shade(c,-.2),W='#ece8de',GR='#4a4658',Y='#ffd45c',K=KM;
  const FR=.68*K,RR=.42*K,fa=1.2,ra=-2.6;
  for(const s of[-1,1]){tyre(g,s*1.3,FR,fa,FR,.6,Y,{lugs:20});tyre(g,s*1.05,RR,ra,RR,.36,Y,{lugs:14});}
  /* the main body: a tall box with rounded edges, side panels and doors */
  rbox(g,2.3,2.5,4.9,.18,c,0,2.25,-.85);box(g,2.34,.1,4.94,D,0,1.0,-.85,{center:true,ol:false});
  for(const s of[-1,1]){for(let i=0;i<3;i++)rbox(g,.04,1.2,1.2,.03,D,s*1.16,2.3,-2.4+i*1.4,{ol:.008});box(g,.03,.1,.6,'#3d3a46',s*1.18,2.2,-2.0,{center:true,ol:false});}
  box(g,1.4,.5,.4,GR,0,.8,-.6,{center:true,ol:.012});
  /* the grain tank on top, the straw hood at the back */
  rbox(g,2.1,.8,2.4,.12,c,0,3.85,-1.0);box(g,2.0,.05,2.3,D,0,4.26,-1.0,{center:true,ol:false});
  {const h=new THREE.Group();h.position.set(0,1.8,-3.3);h.rotation.x=.35;g.add(h);rbox(h,2.1,1.2,.9,.1,c,0,0,0);}
  /* the cab at the front top: glass on three sides, a white roof, a ladder up the left side */
  const cy=3.5,cz=1.05;box(g,1.6,.1,1.3,D,0,3.42,cz,{center:true,ol:.01});
  for(const [x,z] of[[-1,-1],[1,-1],[-1,1],[1,1]])box(g,.07,1.2,.07,W,x*.77,cy,cz+z*.62,{ol:.01});
  rbox(g,1.8,.14,1.5,.05,W,0,cy+1.27,cz);const gl=GLASS();box(g,1.5,1.1,.01,'#fff',0,cy+.6,cz+.62,{mat:gl,center:true,ol:false});for(const s of[-1,1])box(g,.01,1.1,1.2,'#fff',s*.76,cy+.6,cz,{mat:gl,center:true,ol:false});
  rbox(g,.4,.4,.1,.04,'#3d3550',0,cy+.4,cz-.35);{const sw=new THREE.Mesh(new THREE.TorusGeometry(.15,.02,6,18),mat('#2e2a38'));sw.position.set(0,cy+.55,cz+.3);sw.rotation.x=-1.1;g.add(sw);}
  for(const s of[-1,1])sph(g,.08,'#fff6c8',s*.6,cy+1.22,cz+.75,{s:[1,1,.5],ws:10,hs:8,ol:.008});
  for(let i=0;i<9;i++)box(g,.3,.03,.03,GR,-1.3,.6+i*.33,cz-.1,{center:true,ol:false});for(const z of[-.25,.05])box(g,.03,3.0,.03,GR,-1.3-.0,.55,cz+z,{ol:false});
  /* the feeder: a sloped channel from the header up into the body */
  {const f=new THREE.Group();f.position.set(0,1.05,2.35);f.rotation.x=.57;g.add(f);rbox(f,1.2,.55,1.75,.08,D,0,0,0);}
  /* the header: a wide low trough with a cutter bar and pointed fingers, side shields, and the reel turning above it */
  const hz=3.45,HW=4.1*K;box(g,HW,.45,.9,c,0,.25,hz,{ol:.015});box(g,HW,.75,.12,c,0,.25,hz-.45,{ol:.012});cyl(g,.16,.16,HW-.3,'#c8c4b8',0,.55,hz-.1,{rz:Math.PI/2,center:true,seg:12,ol:.01});box(g,HW,.06,.4,GR,0,.2,hz+.6,{ol:.01});
  for(let i=0;i<34;i++)cone(g,.035,.22,'#c8c4b8',-HW/2+.1+i*(HW-.2)/33,.22,hz+.85,{rx:Math.PI/2,center:true,seg:4,ol:false});
  for(const s of[-1,1]){const sh=new THREE.Group();sh.position.set(s*HW/2,.25,hz+.1);g.add(sh);box(sh,.08,.9,1.3,c,0,0,0,{ol:.012});cone(sh,.1,.6,c,0,.15,.85,{rx:Math.PI/2,center:true,seg:4,ol:.01});}
  {const reel=new THREE.Group();reel.position.set(0,1.45,hz+.45);g.add(reel);cyl(reel,.06,.06,HW-.2,'#8a8698',0,0,0,{rz:Math.PI/2,center:true,seg:8,ol:.008});
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2,y=Math.cos(a)*.6,z=Math.sin(a)*.6;cyl(reel,.035,.035,HW-.25,W,0,y,z,{rz:Math.PI/2,center:true,seg:6,ol:.008});
}
    for(const x of[-HW/2+.3,0,HW/2-.3]){const d=new THREE.Mesh(new THREE.TorusGeometry(.6,.03,6,24),mat('#8a8698'));d.rotation.y=Math.PI/2;d.position.x=x;reel.add(d);}
    for(const s of[-1,1])box(g,.08,1.4,.08,'#8a8698',s*(HW/2-.15),.5,hz+.2,{rx:-.3,ol:.008});reel.userData.spin=1;}
  /* the unloading pipe, folded back along the left side */
  {const p=new THREE.Group();p.position.set(-1.0,4.1,-2.1);g.add(p);cyl(p,.15,.15,.5,c,0,0,0,{seg:12,ol:.01});
    tube(g,[[-1.0,4.5,-2.1],[-1.3,4.55,-1.6],[-1.35,4.5,0],[-1.35,4.45,1.5]],.13,.13,c,{seg:16,rad:12,ol:.012});cyl(g,.15,.12,.3,D,-1.35,4.3,1.6,{seg:12,ol:.01});
    box(g,.06,.6,.06,GR,-1.3,3.9,.2,{ol:false});}
  /* the exhaust and the radiator screen, a bit of rust and dust */
  cyl(g,.07,.07,1.0,'#3d3a46',.85,4.2,-2.6,{seg:10,ol:.01});
  for(let i=0;i<5;i++)box(g,.02,.9,.03,'#6a6578',1.165,2.8,-3.0+i*.12,{ol:false});
  rust(g,[[1.17,1.5,-.2,.09,'x'],[-1.17,1.7,-2.6,.08,'x'],[.9,.5,hz+.46,.07,'z'],[0,4.27,-1.4,.08,'y']]);}
pu('farm:combine',{name:'Old combine harvester',stage:6,group:'Farm Lane · machines',icon:'🌾',v:3,note:'real size: about 8 m long with the header, 4 m wide, 3.9 m tall',opts:[PU_OPT.col(['#c4302b','#4f9a52','#e8b23c','#3f7fc9'])],dflt:{c:'#c4302b'},build(g,o){combine(g,o.c);}});

/* the farm windmill: a tall steel lattice tower with cross bracing, a ladder and a top platform, the round wheel of curved blades, the tail vane, a wooden water tank */
function windmill(g,v){v=v||'steel';const old=v==='old',K=KM,H=(old?8.5:9)*K,b=1.3,t=.32;
  const T=old?'#8a6a4a':'#7a7592',TD=old?'#6e5238':'#5a5f8c',BL=old?'#c9b89a':'#e2e4ee',W=old?.17:.12;
  const tw=new THREE.Group();g.add(tw);if(old){tw.rotation.z=.07;tw.rotation.x=-.03;}
  const leg=(sx,sz,y)=>{const f=y/H;return[sx*(b+(t-b)*f),y,sz*(b+(t-b)*f)];};
  const bar=(a,c2,w,col)=>{const L=Math.hypot(c2[0]-a[0],c2[1]-a[1],c2[2]-a[2]),p=new THREE.Group();p.position.set((a[0]+c2[0])/2,(a[1]+c2[1])/2,(a[2]+c2[2])/2);p.lookAt(c2[0],c2[1],c2[2]);p.rotateX(Math.PI/2);tw.add(p);box(p,w,L,w,col,0,0,0,{center:true,ol:w>.06?.012:false});return p;};
  const C4=[[-1,-1],[1,-1],[1,1],[-1,1]];
  for(const [sx,sz] of C4)bar(leg(sx,sz,0),leg(sx,sz,H),W,T);
  const N=6;for(let i=0;i<N;i++){const y0=i*H/N,y1=(i+1)*H/N;for(let k=0;k<4;k++){const [ax,az]=C4[k],[bx,bz]=C4[(k+1)%4];
    if(old&&i===2&&k===1)continue;   /* a missing board on the old one */
    bar(leg(ax,az,y1),leg(bx,bz,y1),W*.7,T);bar(leg(ax,az,y0),leg(bx,bz,y1),W*.45,TD);bar(leg(bx,bz,y0),leg(ax,az,y1),W*.45,TD);}}
  /* the ladder up the front-right leg */
  for(let i=0;i<Math.floor(H/.4);i++){if(old&&(i===7||i===12))continue;const y=.3+i*.4,[x,,z]=leg(1,1,y);box(tw,.4,.065,.065,TD,x-.14,y,z+.1,{center:true,ol:.006});}
  for(const dx of[0,-.32]){const a=leg(1,1,.1),c2=leg(1,1,H);bar([a[0]+dx+.04,0,a[2]+.1],[c2[0]+dx+.04,H,c2[2]+.1],.05,TD);}
  /* the platform and its rail at the top */
  box(tw,1.2,.06,1.2,old?'#6e5238':'#5a5f8c',0,H,0,{center:true,ol:.01});for(const [sx,sz] of C4)box(tw,.03,.45,.03,TD,sx*.58,H,sz*.58,{ol:false});
  for(let k=0;k<4;k++){const [ax,az]=C4[k],[bx,bz]=C4[(k+1)%4];bar([ax*.58,H+.45,az*.58],[bx*.58,H+.45,bz*.58],.03,TD);}
  /* the head: gearbox, the wheel of curved blades in two rings, the tail vane */
  const hd=new THREE.Group();hd.position.set(0,H+.25,0);tw.add(hd);if(old)hd.rotation.y=.35;
  rbox(hd,.42,.36,.6,.08,TD,0,.18,.05);cyl(hd,.05,.05,.7,'#3d3a46',0,.18,.55,{rx:Math.PI/2,center:true,seg:8,ol:false});
  const hub=new THREE.Group();hub.position.set(0,.22,.9);hd.add(hub);if(old)hub.rotation.z=.4;sph(hub,.13,TD,0,0,0,{ws:12,hs:8,ol:.01});
  const R=1.25*K*(old?.9:1),NB=18;for(let i=0;i<NB;i++){if(old&&(i===3||i===4||i===11))continue;const a=i/NB*Math.PI*2,bl=new THREE.Group();bl.rotation.z=a;hub.add(bl);
    const p=new THREE.Group();p.position.set(0,R*.62,0);p.rotation.y=.45;if(old&&i===8)p.rotation.x=.35;bl.add(p);box(p,R*.27,R*.68,.035,BL,0,0,0,{center:true,ol:.012});
    box(bl,.03,R*.85,.03,'#5a5f8c',0,R*.5,0,{center:true,ol:false});}
  for(const rr of[R*.32,R*.94]){const r=new THREE.Mesh(new THREE.TorusGeometry(rr,.05,6,48,old&&rr>1?Math.PI*1.7:Math.PI*2),mat(TD));hub.add(r);}
  hub.userData.spin=old?.3:1;
  box(hd,.05,.05,1.9,TD,0,.22,-.9,{center:true,ol:.008});
  {const vn=new THREE.Group();vn.position.set(0,.22,-1.85);hd.add(vn);if(old)vn.rotation.z=.5;box(vn,.03,1.0,1.4,BL,0,0,0,{center:true,ol:.01});if(!old)for(let i=0;i<3;i++)box(vn,.035,.06,1.3,shade(BL,-.15),0,-.3+i*.3,0,{center:true,ol:false});}
  /* the pump rod down the middle, the wooden water tank on its stand */
  cyl(tw,.035,.035,H,'#5a5f8c',0,0,0,{seg:6,ol:false});box(tw,.5,.4,.5,TD,0,0,0,{ol:.01});
  const tx=2.6;for(const [sx,sz] of C4)box(g,.12,.9,.12,old?'#6e5238':'#8a5a36',tx+sx*.7,0,sz*.7,{ol:.01});box(g,1.7,.1,1.7,'#8a5a36',tx,.9,0,{ol:.01});
  cyl(g,.82,.86,1.2,'#a8714a',tx,1.0,0,{seg:24,ol:.015});for(const y of[1.2,1.7,2.1])cyl(g,.87,.87,.06,'#4a4658',tx,y,0,{seg:24,ol:false});
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2;box(g,.01,1.18,.02,'#8a5a36',tx+Math.cos(a)*.86,1.01,Math.sin(a)*.86,{ry:-a,ol:false});}
  const wt=new THREE.Mesh(new THREE.CircleGeometry(.78,24),WATER);wt.rotation.x=-Math.PI/2;wt.position.set(tx,2.12,0);g.add(wt);
  tube(g,[[.1,.3,.05],[1.0,.25,.05],[1.9,.6,0],[2.0,2.3,0],[2.2,2.35,0]],.04,.04,'#5a5f8c',{seg:16,rad:8,ol:false});
  if(old)rust(g,[[tx+.86,1.5,0,.08,'x']]);}
pu('farm:windmill',{name:'Farm windmill',stage:6,group:'Farm Lane · buildings',icon:'🌬️',v:3,note:'real size: tower about 9 m, wheel about 2.5 m across',opts:[PU_OPT.pick('v','Version',[['steel','Steel, kept up'],['old','Old and creaky, alone on the field']])],dflt:{v:'steel'},build(g,o){windmill(g,o.v);}});

/* the FARM arch: the corner braces now run from the posts up to the beam (they were turned the wrong way) */
function farmArch(g,span=7){const Wd='#8a5a36',D2='#6e4527',H=4.6;for(const s of[-1,1]){cyl(g,.2,.24,H+.2,Wd,s*span/2,0,0,{seg:12,ol:.02});sph(g,.22,D2,s*span/2,H+.2,0,{s:[1,.5,1],ws:10,hs:6,ol:.012});}
  cyl(g,.17,.17,span+.7,Wd,0,H-.1,0,{rz:Math.PI/2,center:true,seg:12,ol:.02});
  for(const s of[-1,1]){const L=1.75,p=new THREE.Group();p.position.set(s*(span/2-.62),H-.72,0);p.rotation.z=s*.785;g.add(p);cyl(p,.11,.11,L,Wd,0,0,0,{center:true,seg:10,ol:.014});}
  for(const s of[-1,1])cyl(g,.012,.012,.55,'#5a5f8c',s*.9,H-.65,0,{seg:4,ol:false});box(g,2.3,.62,.1,'#ffd45c',0,H-1.25,0,{ol:.015});const sp=signPlane('FARM',2.1,.5,'#ffd45c','#3d2c5e');sp.position.set(0,H-.94,.06);g.add(sp);const sb=sp.clone();sb.rotation.y=Math.PI;sb.position.z=-.06;g.add(sb);}
pu('farm:arch',{name:'Farm entrance arch',stage:6,group:'Farm Lane · buildings',icon:'🪵',v:3,build(g){farmArch(g);}});

/* the old labrador asleep the way real dogs sleep: flat on its side, legs stretched out, head down on the ground, eyes shut, grey muzzle */
function sleepyLab(){const C='#e8c98f',D=shade(C,-.12),G='#b9b3a8',g=new THREE.Group(),K=KM;const s0=new THREE.Group();g.add(s0);s0.scale.setScalar(1);
  /* body along x, lying on its left side: the back faces away (-z), the belly and legs toward us (+z) */
  sph(s0,.3,C,0,.2,0,{s:[1.6,.72,.95],ws:24,hs:16});sph(s0,.25,C,-.36,.19,-.02,{s:[1.1,.75,1],ws:18,hs:12});sph(s0,.2,shade(C,.07),.05,.13,.15,{s:[1.5,.6,.6],ws:14,hs:8,ol:false});
  sph(s0,.22,C,.36,.2,.0,{s:[1.0,.8,.95],ws:16,hs:12});   /* the chest */
  /* legs: stretched out on the ground toward us, a little bent, round paws */
  const leg=(x0,x1,z1,b)=>{tube(s0,[[x0,.16,.12],[x0+(x1-x0)*.5,.09,z1*.55],[x1,.07,z1]],.075,.055,C,{seg:12,rad:10,ol:.01});sph(s0,.062,C,x1+b*.03,.065,z1+.03,{s:[1.2,.75,1.1],ws:10,hs:8,ol:.008});};
  leg(.42,.6,.5,1);leg(.32,.42,.56,1);leg(-.42,-.52,.52,-1);leg(-.32,-.36,.58,-1);
  /* the tail lying flat on the ground */
  tube(s0,[[-.62,.18,-.02],[-.85,.1,.08],[-1.0,.06,.24],[-1.05,.05,.38]],.06,.03,C,{seg:16,rad:8,ol:.01});
  /* the head resting on its cheek, nose forward, the floppy ear on top, eyes shut, a grey old muzzle */
  const h=new THREE.Group();h.position.set(.72,.15,.02);h.rotation.x=-Math.PI/2*.92;h.rotation.y=.12;h.scale.setScalar(1.15);s0.add(h);
  rbox(h,.32,.25,.26,.1,C,0,0,0);rbox(h,.22,.15,.16,.06,G,.22,-.03,0,{ol:.012});sph(h,.035,'#2e2347',.33,.0,0,{s:[.7,.9,1.3],ws:10,hs:8,ol:false});
  box(h,.006,.04,.07,'#2e2347',.335,-.06,0,{center:true,ol:false});
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.TorusGeometry(.045,.013,6,12,Math.PI),mat(INK));e.position.set(.08,.06,s*.11);e.rotation.set(0,s>0?0:Math.PI,Math.PI);h.add(e);
    rbox(h,.16,.06,.2,.03,D,-.06,.1,s*.1,{rz:-.5,rx:s*.2,ol:.01});}
  sph(h,.07,G,.12,.0,0,{s:[1,.9,1.25],ws:12,hs:8,ol:false});
  /* real size: an adult labrador is about a metre from nose to rump */
  s0.scale.setScalar(KM*1.0/1.78);
  {const z=signPlane('z z Z',.5,.2,'#eef0ff','#5a5f8c');z.position.set(.95,.85,.0);g.add(z);}
  return g;}
pu('farm:lab',{name:'Old sleeping labrador',stage:6,group:'Farm Lane · animals',icon:'🐕',note:'sleeps flat on its side by the farm buildings',v:3,build(g){g.add(sleepyLab());}});

/* the capybara: the same model he liked, now at real size (about 1.2 m long, 0.6 m tall), and the boxy no.1 back as a second look with its longer face */
{const _cr=capyReal;capyReal=function(col){const m=_cr(col);m.head.scale.setScalar(1.12);m.head.position.y=.62;m.root.scale.setScalar(.93);return m;};}
{const P=PU['age:capybara'];PU['age:capybara']=Object.assign({},P,{v:3,note:'real size: about 1.2 m long, 0.6 m tall',opts:[PU_OPT.pick('look','Look',[['real','Real capybara (your photo)'],['b1','Boxy no.1, longer face']]),AGE_OPT,PU_OPT.col(['#a8774a','#9a6a43','#b8875a','#8a5f3c'])],dflt:{look:'real',age:'adult',c:'#a8774a'},
  build(g,o){let m;if(o.look==='b1'){m=capyBoxy(o.c,1);const bb=new THREE.Box3().setFromObject(m.root),s=new THREE.Vector3();bb.getSize(s);m.root.scale.multiplyScalar(1.2*KM/Math.max(s.x,s.z));}else m=capyReal(o.c);g.add(puAge(m,o.age||'adult').root);}});}

/* the size lineup: the player next to every game pet, three ways: as in the game today, at real size, and the suggestion (real size, but no pet under 30 cm) */
const PET_REAL={dog:.35,cat:.28,bunny:.35,hamster:.07,pomchi:.25,pug:.32,sausage:.25,capybara:.6,duck:.5,owl:.35};
pu('size:lineup',{name:'Size lineup: player and all pets',stage:6,group:'Pets · sizes',icon:'📏',v:1,note:'today = as in the game now · real = real animal height · suggested = real, but nothing under 30 cm (the hamster stays cartoon-sized)',
  opts:[PU_OPT.pick('sz','Size',[['sugg','Suggested (real, min 30 cm)'],['real','Real size'],['today','Today in the game']])],dflt:{sz:'sugg'},
  build(g,o){const p=makePerson(DEFAULT_LOOK);const pr=p.root||p;pr.position.set(-1.4,0,0);g.add(pr);
    {const sg=signPlane('You 1.67 m',.9,.24,'#ffffff','#3d2c5e');sg.position.set(-1.4,2.25,0);g.add(sg);}
    let x=-.2,ix=0;for(const k of Object.keys(PET_TYPES)){ix++;const m=makePet(k);const r=m.root;const bb=new THREE.Box3().setFromObject(r),s=new THREE.Vector3();bb.getSize(s);
      const real=(PET_REAL[k]||.3)*KM/s.y;const f=o.sz==='today'?1:o.sz==='real'?real:Math.max(real,.3*KM/s.y);r.scale.multiplyScalar(f);
      const w=Math.max(.5,s.x*f);x+=w/2;r.position.x=x;r.rotation.y=.5;g.add(r);
      const cm=Math.round(s.y*f/KM*100);const sg=signPlane((PET_TYPES[k].name||k)+' '+cm+' cm',.95,.26,'#ffffff','#3d2c5e');sg.position.set(x,s.y*f+.2+(ix%3)*.32,0);g.add(sg);x+=w/2+.08;}}});
/* when each model last changed: a pick made before this shows as "new, to decide" (his old note stays) */
for(const id of['farm:tractor','farm:combine','farm:windmill','farm:arch','farm:lab','age:capybara'])PU[id].at=1793328394000;
/* what changed, shown on the card while it waits for his pick (same words as the book entry) */
Object.assign(PU['farm:tractor'],{chg:'a red Soviet-era village tractor at real size (about 3.9 m long, 2.8 m to the cab roof).'});
Object.assign(PU['farm:combine'],{chg:'a big red village combine at real size (about 8 m long, 4 m wide), wide header with a reel, folded unloading pipe.'});
Object.assign(PU['farm:windmill'],{chg:'a better steel windmill, plus a second version "Old and creaky, alone on the field" (switch under Version).'});
Object.assign(PU['farm:arch'],{chg:'the corner braces leaned outward; now they run from the posts up to the beam, longer and thicker.'});
Object.assign(PU['farm:lab'],{chg:'real sleep pose: flat on its side, legs out, head on the ground, eyes shut, grey muzzle. Real size, about 1 m.'});
Object.assign(PU['age:capybara'],{chg:'real size (about 1.1 m long, 0.6 m tall); Boxy no.1 with the longer face is back as a second look (switch under Look).'});

/* ---------- round 15 (30 Oct): bear for real, capybara smooth, farmers' hats, more farmers ---------- */
/* a smooth body: one tube along the spine, its thickness following a profile (no lumps of balls) */
const prof=(...k)=>t=>{for(let i=0;i<k.length-1;i++){const [t0,r0]=k[i],[t1,r1]=k[i+1];if(t<=t1){const u=(t-t0)/(t1-t0),s=u*u*(3-2*u);return r0+(r1-r0)*s;}}return k[k.length-1][1];};

/* the bear: a real brown bear at real size (about 1.2 m at the shoulder hump, 2.2 m long), heavy and smooth: big shoulder hump, long snout, small round ears, thick legs */
function bearReal(col){const PANDA_ON=col===PANDA,C=PANDA_ON?'#fbfbf8':(col||'#7a4e2d'),D=PANDA_ON?'#2e2a33':shade(C,-.16),Lt=PANDA_ON?'#fbfbf8':shade(C,.14),Lg=PANDA_ON?'#2e2a33':C;
  const root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  /* the body: rump low and round, the belly deep, the hump high over the shoulders, then the neck */
  const body=new THREE.Group();body.scale.set(.86,1,1);b.add(body);
  tube(body,[[0,.98,-1.08],[0,1.02,-.7],[0,1.08,-.2],[0,1.2,.25],[0,1.18,.62],[0,1.08,.95]],prof([0,.18],[.08,.42],[.3,.5],[.55,.54],[.72,.52],[.9,.4],[1,.34]),0,C,{seg:40,rad:22,ol:.016});
  tube(body,[[0,1.2,-.7],[0,1.4,-.1],[0,1.58,.3],[0,1.48,.62]],prof([0,.04],[.6,.3],[1,.06]),0,C,{seg:24,rad:18,ol:.014});   /* the shoulder hump */
  if(PANDA_ON)tube(body,[[0,1.1,.12],[0,1.15,.45]],prof([0,.4],[.5,.56],[1,.45]),0,D,{seg:12,rad:18,ol:false,caps:false});   /* the panda's black shoulder band */
  /* legs: thick columns that reach the ground in broad paws, rear legs with a big thigh */
  for(const [x,z,f] of[[-.3,.55,1],[.3,.55,1],[-.32,-.78,0],[.32,-.78,0]]){const p=new THREE.Group();p.position.set(x,0,z);b.add(p);
    tube(p,f?[[0,1.0,0],[0,.6,.03],[0,.16,.05]]:[[0,1.02,-.05],[0,.62,-.12],[0,.36,-.02],[0,.16,.02]],f?prof([0,.21],[.5,.19],[1,.16]):prof([0,.28],[.35,.24],[.7,.17],[1,.16]),0,Lg,{seg:16,rad:16,ol:.014});
    sph(p,.21,shade(C,-.08),0,.1,.08,{s:[1,.55,1.25],ws:18,hs:12,ol:.012});for(let i=-1;i<=1;i++)cone(p,.022,.07,'#f2efe6',i*.08,.05,.33,{rx:Math.PI/2,center:true,seg:5,ol:false});legs.push(p);}
  /* the head: one smooth piece from the skull to the long snout, small round ears, small dark eyes, a big nose */
  const head=new THREE.Group();head.position.set(0,1.16,1.14);head.rotation.x=.18;head.scale.setScalar(1.12);b.add(head);
  tube(head,[[0,.04,-.25],[0,.04,0],[0,-.02,.28],[0,-.05,.48]],prof([0,.08],[.15,.3],[.45,.27],[.75,.17],[1,.14]),0,C,{seg:24,rad:18,ol:.014});
  tube(head,[[0,-.06,.2],[0,-.08,.42]],prof([0,.12],[1,.12]),0,Lt,{seg:8,rad:12,ol:false});   /* the lighter muzzle */
  sph(head,.085,'#1d1622',0,-.04,.6,{s:[1.25,.85,.8],ws:14,hs:10,ol:.01});
  for(const s of[-1,1]){sph(head,.032,'#1d1622',s*.15,.12,.2,{ws:10,hs:8,ol:false});sph(head,.01,'#ffffff',s*.155,.135,.225,{ws:5,hs:4,ol:false});
    if(PANDA_ON)sph(head,.07,D,s*.15,.11,.18,{s:[1,1.3,.5],rz:s*.5,ws:10,hs:8,ol:false});
    sph(head,.085,PANDA_ON?D:C,s*.2,.28,-.08,{s:[1,1,.5],ws:12,hs:10,ol:.012});sph(head,.045,PANDA_ON?D:shade(C,-.25),s*.2,.28,-.05,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  const tail=new THREE.Group();tail.position.set(0,1.1,-1.18);b.add(tail);sph(tail,.07,C,0,0,0,{ws:8,hs:6,ol:.01});
  /* real size: hump about 1.2 m, about 2.2 m long */
  root.scale.setScalar(1.2*KM/1.8);return{root,b,legs,tail,head,type:'bear',phase:Math.random()*6};}
PU_NEW.bear=bearReal;
PU['pet:bear']=Object.assign({},PU['pet:bear'],{v:3,at:1793360000000,dflt:{age:'adult',c:PU_PET_TYPES.bear.cols[0]},note:'real size: about 1.2 m at the hump, 2.2 m long (baby and teen under Age)',
  chg:'a real brown bear at real size (about 1.2 m at the hump, 2.2 m long): smooth heavy body, big hump, long snout, thick legs. The card now opens on the adult (it opened on the baby before).',
  build(g,o){g.add(puAge(bearReal(o.c),o.age||'adult').root);}});

/* the capybara (your photo): the same look, the body now one smooth piece instead of balls */
capyReal=function(col){const C=col||'#a8774a',D=shade(C,-.12),Dk=shade(C,-.22),Lt=shade(C,.08),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const body=new THREE.Group();body.scale.set(.88,1,1);b.add(body);
  tube(body,[[0,.38,-.5],[0,.42,-.25],[0,.43,.05],[0,.45,.3],[0,.52,.42]],prof([0,.12],[.12,.27],[.45,.31],[.8,.27],[1,.2]),0,C,{seg:32,rad:20,ol:.012});
  tube(body,[[0,.28,-.3],[0,.27,.25]],prof([0,.06],[.5,.16],[1,.06]),0,Lt,{seg:12,rad:12,ol:false});
  for(const [x,z,f] of[[-.15,.24,1],[.15,.24,1],[-.16,-.32,0],[.16,-.32,0]]){const p=new THREE.Group();p.position.set(x,0,z);b.add(p);
    tube(p,[[0,.36,0],[0,.18,f?.02:-.02],[0,.05,.01]],prof([0,.1],[.6,.085],[1,.075]),0,C,{seg:10,rad:12,ol:.012,caps:false});sph(p,.08,Dk,0,.04,.035,{s:[1,.5,1.35],ws:12,hs:8,ol:.01});legs.push(p);}
  tube(body,[[0,.46,.33],[0,.56,.5],[0,.6,.6]],prof([0,.22],[.6,.2],[1,.17]),0,C,{seg:10,rad:16,ol:.012});
  const head=new THREE.Group();head.position.set(0,.6,.5);head.rotation.x=.15;head.scale.setScalar(1.08);b.add(head);
  rbox(head,.36,.34,.52,.13,C,0,0,.1);rbox(head,.32,.24,.2,.1,D,0,.07,-.06,{ol:false});
  rbox(head,.34,.3,.17,.06,shade(C,.04),0,-.02,.33,{ol:.012});
  sph(head,.06,'#3d2a20',0,.09,.41,{s:[1.8,.55,.45],ws:14,hs:8,ol:false});for(const s of[-1,1])sph(head,.018,'#1d1410',s*.05,.07,.43,{s:[1.2,.8,.6],ws:6,hs:4,ol:false});
  box(head,.14,.012,.008,'#3d2a20',0,-.09,.413,{center:true,ol:false});
  for(const s of[-1,1]){sph(head,.034,'#1d1622',s*.172,.14,.17,{ws:12,hs:10,ol:false});sph(head,.012,'#ffffff',s*.178,.153,.195,{ws:6,hs:4,ol:false});
    sph(head,.07,D,s*.15,.2,-.08,{s:[1,.9,.6],ws:14,hs:10,ol:.01});sph(head,.042,Dk,s*.15,.2,-.06,{s:[1,1,.4],ws:10,hs:8,ol:false});}
  root.scale.setScalar(.93);return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6};};   /* assigned, not declared: it must replace the earlier wrappers */
Object.assign(PU['age:capybara'],{at:1793360000000,chg:'the real capybara (your photo) now has one smooth body instead of balls; real size kept.'});

/* hats that cover the head: the hair under them is pressed flat, and the cap is sized to the head, so no hair pokes through */
const HAT_COVER={cap:1,beanie:1,cowboy:1,straw:1,scarf:1};
{const PRESS={cap:1,beanie:1,scarf:1};   /* hats that sit on the hair press it flat; wide-brim hats sit on top of the full hair instead */
 hairFor=(hf=>function(h,L){const n0=h.children.length;hf(h,L);if(!(L.hat&&PRESS[L.hat]))return;
  for(const m of h.children.slice(n0)){const p=m.geometry&&m.geometry.parameters;if(!p||!m.geometry.type.startsWith('Box'))continue;
    /* the top block of hair (0.54 wide, 0.14 high, from 0.37) becomes a thin pressed layer under the hat */
    if(Math.abs(p.width-.54)<.04&&Math.abs(p.height-.14)<.04&&Math.abs(m.position.y-.44)<.02){m.scale.y=.35;m.position.y=.37+p.height*.35/2;}
    if(Math.abs(p.width-.54)<.04&&Math.abs(p.height-.4)<.04&&m.position.z<-.2&&Math.abs(m.position.y-.28)<.03){m.scale.y=.82;m.position.y=.08+p.height*.82/2;}}
  if(L.hat==='scarf')for(const m of h.children.slice(n0))m.visible=false;
  if(L.style==='bun')for(const m of h.children.slice(n0))if(m.geometry&&m.geometry.type.startsWith('Sphere')&&m.position.y>.5)m.visible=false;})(hairFor);}
{const hh=hatFor;hatFor=function(h,k,c){
  if(k==='straw'){const S=c||'#e8c86a',D=shade(S,-.15);cyl(h,.46,.46,.035,S,0,.47,0,{seg:24,ol:.015});cyl(h,.25,.27,.17,S,0,.49,0,{seg:16,ol:.015});cyl(h,.272,.272,.05,'#d9483b',0,.5,0,{seg:16,ol:false});for(let i=0;i<10;i++){const a=i/10*Math.PI*2;box(h,.01,.008,.16,shade(S,-.07),Math.cos(a)*.36,.506,Math.sin(a)*.36,{ry:-a,ol:false});}h.position.y+=.05;return;}
  if(k==='scarf'){const S=c||'#d94a4a';sph(h,.38,S,0,.33,-.03,{s:[1,.86,1.02],ws:20,hs:14,ol:.015});box(h,.62,.06,.06,shade(S,-.12),0,.06,.17,{ol:.01});
    cone(h,.17,.3,S,0,.12,-.3,{rx:-.5,seg:3,center:true,ol:.012});sph(h,.05,shade(S,-.15),0,-.2,.12,{ws:8,hs:6,ol:.01});return;}
  hh(h,k,c);if(k==='cap'||k==='beanie')h.scale.set(1.42,1.08,1.38);   /* wide enough to cover the hair's corners */
  if(k==='cowboy')h.position.y+=.075;};}

/* the farmers: Hugo kept, Fern redone, and two more for the village farm */
pu('farm:farmer',{name:'Farmers',stage:6,group:PU['farm:farmer'].group,icon:'🧑‍🌾',v:3,at:1793360000000,
  chg:'Hugo kept; his hat now sits on top of his hair. Fern redone (straw hat, overalls, braid). Two more farmers: Grandma Ona (headscarf, apron) and Jonas (cap, rubber boots).',
  opts:[PU_OPT.pick('who','Who',[['b','Farmer Hugo'],['a','Farmer Fern'],['ona','Grandma Ona'],['jonas','Jonas the farmhand']])],dflt:{who:'b'},
  build(g,o){const W={
    b:{skin:'#c98d63',hair:'#3d2c5e',style:'short',top:'#c9f2e3',sleeve:'#c9f2e3',bottom:'#5b7fbf',shoes:'#9a6a43',hat:'cowboy',hatc:'#c98f5e',scale:1.15,apron:'#5b7fbf'},
    a:{skin:'#f5cfb0',hair:'#c5874a',style:'ponytail',top:'#ffe3a8',sleeve:'#ffe3a8',bottom:'#4f6fa8',shoes:'#5a4a3f',hat:'straw',hatc:'#e8c86a',scale:1.08,apron:'#4f6fa8'},
    ona:{skin:'#f2c9a8',hair:'#d9d4cc',style:'bun',top:'#8fb87a',sleeve:'#8fb87a',bottom:'#5a4a6a',shoes:'#3d3550',hat:'scarf',hatc:'#d94a4a',scale:1.0,apron:'#f3ead8',dress:true},
    jonas:{skin:'#e8b48a',hair:'#8a5a36',style:'short',top:'#5f8fc9',sleeve:'#5f8fc9',bottom:'#4a4658',shoes:'#2f6b3a',hat:'cap',hatc:'#c9302c',scale:1.12}}[o.who||'b'];
    g.add(makePerson(Object.assign({nohat:true},W)).root);}});

/* ---------- round 16 (30 Oct): his notes from the book: capybara face + green and orange versions, grandma's head, 6 cute bears ---------- */
const AT16=1793372000000;

/* capybara: the body stays (he likes it); a real capybara face: a long deep head, a very blunt tall muzzle, a big flat nose on top, eyes high and far back, small round ears at the back */
{const _body=capyReal;capyReal=function(col,extra){const m=_body(col);const C=col||'#a8774a',D=shade(C,-.12),Dk=shade(C,-.24),h=m.head;
  for(const o of [...h.children])h.remove(o);
  rbox(h,.34,.34,.46,.12,C,0,.02,.02);                       /* the skull */
  rbox(h,.32,.36,.3,.1,C,0,-.02,.3);                         /* the long, deep muzzle */
  rbox(h,.3,.28,.08,.06,shade(C,.05),0,-.03,.45,{ol:.012});   /* the blunt square front */
  rbox(h,.24,.06,.1,.03,'#6a4a36',0,.1,.47,{ol:false});       /* the big flat dark nose on top */
  for(const s of[-1,1])box(h,.04,.025,.03,'#1d1410',s*.055,.12,.505,{rz:s*.35,center:true,ol:false});   /* nostril slits */
  box(h,.02,.07,.01,'#3d2a20',0,.03,.492,{center:true,ol:false});box(h,.16,.012,.01,'#3d2a20',0,-.03,.492,{center:true,ol:false});   /* split lip and mouth */
  for(const s of[-1,1]){rbox(h,.05,.16,.22,.03,D,s*.17,-.06,.3,{ol:false});   /* cheeks */
    sph(h,.045,'#1d1622',s*.172,.14,.1,{ws:12,hs:10,ol:false});sph(h,.016,'#ffffff',s*.18,.16,.135,{ws:6,hs:4,ol:false});   /* small eyes, high and back */
    sph(h,.06,D,s*.14,.2,-.15,{s:[1,.95,.6],ws:14,hs:10,ol:.01});sph(h,.035,Dk,s*.14,.2,-.13,{s:[1,1,.4],ws:10,hs:8,ol:false});}   /* small round ears */
  if(extra==='sprout'){cyl(h,.012,.012,.12,'#4f9a52',0,.19,-.02,{seg:6,ol:.006});for(const s of[-1,1])sph(h,.06,'#7ccf5a',s*.05,.31,-.02,{s:[1.5,.35,.85],rz:s*.45,ws:12,hs:8,ol:.008});}
  if(extra==='orange'){sph(h,.09,'#ff9a2e',0,.27,-.02,{ws:16,hs:12,ol:.01});cyl(h,.008,.008,.04,'#5a4a2a',0,.35,-.02,{seg:5,ol:false});sph(h,.03,'#5fae5c',.03,.37,-.02,{s:[1.6,.4,1],rz:-.4,ws:8,hs:6,ol:false});}
  return m;};}
{const P=PU['age:capybara'];PU['age:capybara']=Object.assign({},P,{v:4,at:AT16,
  chg:'a real capybara face (long deep head, blunt tall muzzle, big flat nose on top, eyes high and back); the body is kept. New versions: with a green sprout, with an orange.',
  opts:[PU_OPT.pick('look','Look',[['real','Real capybara (your photo)'],['sprout','With a green sprout'],['orange','With an orange'],['b1','Boxy no.1, longer face']]),AGE_OPT,PU_OPT.col(['#a8774a','#9a6a43','#b8875a','#8a5f3c'])],
  build(g,o){if(o.look==='b1')return P.build(g,o);g.add(puAge(capyReal(o.c,o.look==='real'?null:o.look),o.age||'adult').root);}});}

/* Grandma Ona: a real headscarf that follows her head: snug over the top, back and sides, a darker band over the forehead, tied under the chin, the corner hanging at the back; no hair under it */
{const hh=hatFor;hatFor=function(h,k,c){if(k!=='scarf')return hh(h,k,c);const S=c||'#d94a4a',D=shade(S,-.14);
  rbox(h,.55,.18,.5,.09,S,0,.39,-.02);                                  /* snug over the top of the head */
  rbox(h,.58,.44,.1,.05,S,0,.2,-.25);                                 /* down the back */
  for(const s of[-1,1])rbox(h,.06,.42,.4,.03,S,s*.28,.19,-.03);         /* the sides, framing the face */
  for(const s of[-1,1])rbox(h,.07,.16,.07,.03,S,s*.17,-.06,.16,{rz:s*.6});sph(h,.075,D,0,-.12,.19,{s:[1.2,.9,.9],ws:12,hs:10,ol:.01});   /* tied under the chin: a big knot */
  for(const s of[-1,1])rbox(h,.06,.18,.04,.02,D,s*.05,-.25,.19,{rz:s*.35});   /* the two ends of the knot */
  {const t=new THREE.Group();t.position.set(0,-.12,-.335);t.rotation.x=.12;h.add(t);cone(t,.2,.34,D,0,0,0,{rx:Math.PI,seg:3,center:true,s:[1,1,.18],ol:.014});}   /* the corner hanging down the back */
  for(const [x,y,z] of[[-.17,.44,.23],[.08,.45,.23],[.2,.42,.23],[-.06,.41,.23],[0,.478,-.1],[-.18,.478,0],[.17,.478,.05]])sph(h,.024,'#ffffff',x,y,z,{s:[1,z>.2?1:.3,z>.2?.3:1],ws:6,hs:4,ol:false});
  for(const s of[-1,1])for(const [y,z] of[[.3,0],[.12,-.12],[.25,.12]])sph(h,.022,'#ffffff',s*.315,y,z,{s:[.3,1,1],ws:6,hs:4,ol:false});
  for(const [x,y] of[[-.15,.3],[.12,.18],[0,.36],[.18,.34]])sph(h,.022,'#ffffff',x,y,-.305,{s:[1,1,.3],ws:6,hs:4,ol:false});};}
Object.assign(PU['farm:farmer'],{at:AT16,chg:'Grandma Ona has a real headscarf now: snug round her head, tied under the chin, the corner hanging at the back. Hugo, Fern and Jonas unchanged.'});

/* the bear: six cute bears, each clearly different; real size kept (about 1.2 m at the shoulder) */
function cuteBear(P){const C=P.c,Lt=P.lt||shade(C,.25),D=P.d||shade(C,-.18),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const body=new THREE.Group();body.scale.set(P.wide||.95,1,1);b.add(body);
  tube(body,[[0,.8,-.5],[0,.84,-.25],[0,.9,.15],[0,.92,.45]],prof([0,.5],[.1,.52],[.5,.56],[.88,.46],[1,.38]),0,C,{seg:30,rad:22,ol:.016,caps:false});sph(body,.5,C,0,.8,-.5,{s:[1,1,.78],ws:26,hs:18,ol:.016});sph(body,.38,C,0,.92,.45,{ws:22,hs:16,ol:.016});   /* a round rump (the back end was cut flat before) */
  if(P.belly)sph(b,.3,P.belly,0,.74,.74,{s:[1,1.05,.45],ws:18,hs:12,ol:false});   /* a light tummy patch in front */
  if(P.hump){const hb=new THREE.Group();hb.scale.set(1.15,1,1);body.add(hb);tube(hb,[[0,.95,-.5],[0,1.12,-.05],[0,1.12,.3]],prof([0,.1],[.55,.42],[1,.22]),0,C,{seg:18,rad:18,ol:.014});}
  if(P.crescent){const g=new THREE.Group();g.position.set(0,.88,.82);g.rotation.x=.25;g.scale.set(1,1,.35);b.add(g);const t=new THREE.Mesh(new THREE.TorusGeometry(.2,.06,8,24,Math.PI),mat(P.crescent));t.rotation.z=Math.PI;g.add(t);}
  for(const [x,z] of[[-.28,.38],[.28,.38],[-.3,-.42],[.3,-.42]]){const p=new THREE.Group();p.position.set(x,0,z);b.add(p);
    tube(p,[[0,.78,0],[0,.4,.02],[0,.14,.04]],prof([0,.2],[1,.17]),0,P.legs||C,{seg:12,rad:16,ol:.014});
    sph(p,.19,P.legs?shade(P.legs,-.08):D,0,.09,.07,{s:[1,.55,1.25],ws:16,hs:10,ol:.012});sph(p,.07,P.pad||Lt,0,.06,.27,{s:[1.4,.8,.3],ws:10,hs:8,ol:false});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,1.18,.72);b.add(head);const HS=P.head||1;head.scale.setScalar(HS);
  sph(head,.4,C,0,0,0,{s:[1.05,.95,.95],ws:28,hs:20,ol:.016});
  if(P.fluff){for(const s of[-1,1])for(const [y,z,r] of[[-.04,.04,.15],[-.18,.0,.13],[.1,-.04,.11]])sph(head,r,P.fl||C,s*(.36+r*.4),y,z,{s:[.8,1,1],ws:14,hs:10,ol:.012});}
  const mz=P.snout||1;sph(head,.17,P.muzzle||Lt,0,-.1,.32*mz,{s:[1.15,.85,mz],ws:18,hs:12,ol:.012});
  sph(head,.07,'#2a1f2e',0,-.03,.32*mz+.15,{s:[1.4,1,.8],ws:12,hs:8,ol:false});box(head,.012,.06,.01,'#2a1f2e',0,-.12,.32*mz+.155,{center:true,ol:false});
  for(const s of[-1,1]){
    if(P.patch)sph(head,.11,P.patch,s*.16,.06,.3,{s:[.9,1.25,.4],rz:s*.5,ws:12,hs:10,ol:false});
    if(P.eye==='sleepy'){const e=new THREE.Mesh(new THREE.TorusGeometry(.045,.013,6,12,Math.PI),mat('#2a1f2e'));e.position.set(s*.15,.07,.36);e.rotation.z=Math.PI;head.add(e);}
    else{const er=P.eye==='big'?.075:.055;sph(head,er,'#1d1622',s*.15,.07,.34,{s:[1,1.1,.6],ws:14,hs:10,ol:false});sph(head,er*.38,'#ffffff',s*.15+.02,.1,.37,{ws:8,hs:6,ol:false});}
    sph(head,.06,'#ff9eb5',s*.25,-.08,.3,{s:[1,.6,.4],ws:10,hs:6,ol:false});
    const ea=P.ear||.12;sph(head,ea,P.earc||C,s*.28,.3,-.02,{s:[1,1,.55],ws:14,hs:10,ol:.012});sph(head,ea*.55,P.earin||Lt,s*.28,.3,.03,{s:[1,1,.3],ws:10,hs:8,ol:false});}
  if(P.extra==='honey'){cyl(b,.13,.15,.24,'#e8a33c',.45,0,.75,{seg:16,ol:.012});cyl(b,.15,.15,.04,'#fff3cf',.45,.24,.75,{seg:16,ol:.01});sph(b,.08,'#ffc94a',.45,.29,.75,{s:[1.2,.5,1.2],ws:10,hs:6,ol:false});}
  if(P.extra==='scarf'){const g=new THREE.Group();g.position.set(0,1.0,.6);b.add(g);tube(g,[[-.36,0,-.1],[0,.02,.18],[.36,0,-.1]],.08,.08,'#ff6b6b',{seg:12,rad:10,ol:.01});rbox(g,.14,.3,.06,.03,'#ff6b6b',.2,-.18,.12,{rz:.2});}
  if(P.extra==='flower'){const g=new THREE.Group();g.position.set(.12,1.55,.72);g.rotation.x=-1.2;b.add(g);for(let i=0;i<5;i++){const a=i/5*Math.PI*2;sph(g,.075,'#ff9ec4',Math.cos(a)*.09,Math.sin(a)*.09,0,{s:[1,1,.4],ws:10,hs:6,ol:.008});}sph(g,.05,'#ffd45c',0,0,.03,{ws:10,hs:6,ol:.006});}
  const tail=new THREE.Group();tail.position.set(0,.9,-.88);b.add(tail);sph(tail,.1,C,0,0,0,{ws:10,hs:8,ol:.01});
  root.scale.setScalar(1.25*KM/1.62);return{root,b,legs,tail,head,type:'bear',phase:Math.random()*6};}
const BEARS=[
 ['teddy','Teddy brown bear',{c:'#a8693a',muzzle:'#f0d6b0',belly:'#f0d6b0',eye:'big',ear:.14}],
 ['honey','Sleepy honey bear',{c:'#c98a3e',muzzle:'#f3dcb0',eye:'sleepy',extra:'honey'}],
 ['grizzly','Fluffy grizzly',{c:'#6e4a2e',lt:'#b08458',fl:'#8a6240',muzzle:'#b08458',fluff:1,hump:1,snout:1.35,ear:.1,wide:1.1}],
 ['panda','Panda',{c:'#f6f4ee',legs:'#2e2a33',earc:'#2e2a33',earin:'#2e2a33',patch:'#2e2a33',muzzle:'#ffffff',pad:'#6a6370',eye:'big'}],
 ['polar','Polar bear with a scarf',{c:'#f2efe6',d:'#d8d2c4',muzzle:'#fbfaf6',snout:1.3,ear:.09,head:.92,extra:'scarf'}],
 ['moon','Moon bear with a flower',{c:'#2e2a33',lt:'#55505e',muzzle:'#c9b49a',crescent:'#f3ead8',eye:'big',extra:'flower'}]];
PU['pet:bear']=Object.assign({},PU['pet:bear'],{v:4,at:AT16,note:'six cute bears; real size about 1.25 m at the shoulder (baby and teen under Age)',
  chg:'six cute bears, each different: teddy brown, sleepy honey bear, fluffy grizzly, panda, polar bear with a scarf, moon bear with a flower. Real size kept.',
  opts:[PU_OPT.pick('v','Version',BEARS.map(([k,n])=>[k,n])),AGE_OPT],dflt:{v:'teddy',age:'adult'},
  build(g,o){const B=BEARS.find(x=>x[0]===o.v)||BEARS[0];g.add(puAge(cuteBear(B[2]),o.age||'adult').root);}});
PU_NEW.bear=col=>cuteBear(BEARS[0][2]);

/* ---------- round 17 (30 Oct): the capybara from his sheet (front, back, side) is the only one; head accessories you can buy ---------- */
const AT17=1793374000000;
/* the capybara exactly like his picture: a low loaf body, a big blocky head with a dark rounded muzzle patch, a "人" mouth, two nostril dashes,
   round black eyes on the sides, small round ears, short thick legs with dark feet, a round rump */
function capyRef(col){const C=col||'#c98a52',D=shade(C,-.24),M=shade(C,-.12),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  /* the body: one chunky rounded barrel, wide and low, a little higher at the rear */
  const body=new THREE.Group();body.scale.set(1.45,1,1);b.add(body);body.position.y=-.11;
  tube(body,[[0,.5,-.46],[0,.54,-.2],[0,.52,.05],[0,.5,.22]],prof([0,.1],[.12,.25],[.5,.28],[.85,.26],[1,.2]),0,C,{seg:28,rad:22,ol:.009});
  sph(b,.055,C,0,.36,-.53,{s:[1.1,1,.6],ws:14,hs:10,ol:false});   /* the small round rump */
  /* legs: short and thick, flat dark feet */
  for(const [x,z] of[[-.18,.12],[.18,.12],[-.19,-.3],[.19,-.3]]){const p=new THREE.Group();p.position.set(x,0,z);b.add(p);
    tube(p,[[0,.27,0],[0,.14,.01],[0,.07,.02]],prof([0,.11],[1,.1]),0,C,{seg:8,rad:14,ol:.008,caps:false});sph(p,.1,D,0,.04,.03,{s:[1,.42,1.3],ws:14,hs:8,ol:.008});legs.push(p);}
  /* the head: big, wide and soft, a wedge from the ears down to the blunt nose; it melts into the body */
  const head=new THREE.Group();head.position.set(0,-.07,0);b.add(head);
  const hg=new THREE.Group();hg.scale.set(1.28,.9,1);hg.position.y=.07;head.add(hg);
  tube(hg,[[0,.68,.12],[0,.66,.34],[0,.6,.54]],prof([0,.22],[.4,.22],[1,.17]),0,C,{seg:20,rad:20,ol:.009});
  sph(head,.13,M,0,.56,.68,{s:[1.25,1,.32],ws:18,hs:12,ol:false});   /* the darker rounded muzzle patch on the front */
  for(const s of[-1,1])sph(head,.018,'#2a1f2e',s*.045,.62,.715,{s:[1.6,.8,.5],ws:6,hs:4,ol:false});   /* two nostrils */
  box(head,.009,.035,.01,'#2a1f2e',0,.575,.72,{center:true,ol:false});for(const s of[-1,1])box(head,.045,.009,.01,'#2a1f2e',s*.02,.553,.716,{rz:-s*.35,center:true,ol:false});   /* the 人 mouth */
  for(const s of[-1,1]){sph(head,.048,'#1d1622',s*.17,.72,.5,{s:[.8,1.2,.6],ws:14,hs:10,ol:false});sph(head,.015,'#ffffff',s*.18,.745,.525,{ws:6,hs:4,ol:false});   /* big round eyes */
    sph(head,.075,C,s*.19,.86,.24,{s:[1,1,.6],ws:12,hs:10,ol:.008});sph(head,.046,D,s*.19,.86,.27,{s:[1,1,.4],ws:10,hs:8,ol:false});}   /* small round ears */
  root.scale.setScalar(1.2*KM/1.27);return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6,top:{x:0,y:.84,z:.34,w:.42}};}
capyReal=function(col){return capyRef(col);};   /* every capybara (game pet, ages, backyard) is this one now */
PU['age:capybara']=Object.assign({},PU['age:capybara'],{name:'Capybara',v:5,at:AT17,note:'real size about 1.2 m long',
  chg:'built from your picture (front, back, side): loaf body, big blocky head, dark muzzle patch, 人 mouth, round ears, dark feet. All other capybara versions removed; the orange, sprout and bubble tea are now accessories you buy.',
  opts:[AGE_OPT,PU_OPT.col(['#c98a52','#b07848','#d9a06a','#9a6a43'])],dflt:{age:'adult',c:'#c98a52'},
  build(g,o){g.add(puAge(capyRef(o.c),o.age||'adult').root);}});

/* head accessories: built once, placed on top of any pet's head (measured, so they fit every animal) */
const HEAD_ACC={
  orange:{n:'Orange',i:'🍊',b(g){sph(g,.09,'#ff9a2e',0,.085,0,{ws:16,hs:12,ol:.01});cyl(g,.008,.008,.04,'#5a4a2a',0,.17,0,{seg:5,ol:false});sph(g,.03,'#5fae5c',.03,.19,0,{s:[1.6,.4,1],rz:-.4,ws:8,hs:6,ol:.006});}},
  sprout:{n:'Green sprout',i:'🌱',b(g){cyl(g,.012,.012,.12,'#4f9a52',0,-.02,0,{seg:6,ol:.006});for(const s of[-1,1])sph(g,.065,'#7ccf5a',s*.055,.13,0,{s:[1.5,.35,.85],rz:s*.45,ws:12,hs:8,ol:.008});}},
  boba:{n:'Bubble tea',i:'🧋',b(g){g=(p=>{const q=new THREE.Group();q.scale.setScalar(.78);p.add(q);return q;})(g);cyl(g,.07,.06,.2,'#e8c9a0',0,0,0,{seg:16,ol:.01});for(let i=0;i<9;i++){const a=i/9*Math.PI*2;sph(g,.016,'#3d2c3a',Math.cos(a)*.062,.03+(i%3)*.012,Math.sin(a)*.062,{ws:6,hs:4,ol:false});}
    sph(g,.072,'#ffffff',0,.2,0,{s:[1,.45,1],ws:14,hs:8,ol:.008});cyl(g,.01,.01,.2,'#ff7aa8',.02,.22,0,{rz:-.25,seg:6,ol:.006});}},
  honey:{n:'Honey pot',i:'🍯',b(g){cyl(g,.08,.07,.13,'#e8a33c',0,0,0,{seg:14,ol:.01});cyl(g,.06,.08,.03,'#e8a33c',0,.13,0,{seg:14,ol:.008});cyl(g,.085,.085,.02,'#fff3cf',0,.15,0,{seg:14,ol:.008});
    sph(g,.06,'#ffc94a',0,.17,0,{s:[1.2,.45,1.2],ws:10,hs:6,ol:false});sph(g,.02,'#ffc94a',.075,.09,.02,{s:[.6,1.6,.6],ws:6,hs:6,ol:false});cyl(g,.01,.01,.22,'#c98a52',.03,.12,0,{rz:-.35,seg:6,ol:.006});for(let i=0;i<3;i++)cyl(g,.022,.022,.012,'#c98a52',.075,.27+i*.02,0,{rz:-.35,seg:8,ol:false});}}};
function headTop(m){const h=m.head;m.root.updateMatrixWorld(true);const inv=h.matrixWorld.clone().invert(),bb=new THREE.Box3().setFromObject(h),lb=new THREE.Box3();
  for(const x of[bb.min.x,bb.max.x])for(const y of[bb.min.y,bb.max.y])for(const z of[bb.min.z,bb.max.z])lb.expandByPoint(new THREE.Vector3(x,y,z).applyMatrix4(inv));
  const c=lb.getCenter(new THREE.Vector3());return{x:c.x,y:lb.max.y,z:c.z-(lb.max.z-lb.min.z)*.12,w:Math.min(lb.max.x-lb.min.x,lb.max.z-lb.min.z)};}
const GAME_TOP={dog:.25,cat:.22,bunny:.15,hamster:.1};   /* the game's own head-top heights (where its hats sit) */
function wearHead(m,k){const ft=PET_FIT[m.type]||m.type,t=m.top||(GAME_TOP[ft]!=null?Object.assign(headTop(m),{y:GAME_TOP[ft],x:0,z:0}):headTop(m)),g=new THREE.Group();g.position.set(t.x,t.y-.02*t.w,t.z);g.scale.setScalar(t.w/.36);m.head.add(g);HEAD_ACC[k].b(g);return m;}
const ACC_PETS=[['capybara','Capybara'],['bear','Bear'],['dog','Puppy'],['cat','Kitten'],['bunny','Bunny'],['hamster','Hamster']];
const accPet=k=>k==='bear'?cuteBear(BEARS[0][2]):k==='capybara'?capyRef():makePet(k);
for(const k in HEAD_ACC)pu('acc:'+k,{name:HEAD_ACC[k].n,stage:4,group:'Pet accessories',icon:HEAD_ACC[k].i,v:1,at:AT17,note:'head accessory, sold in the Pet Shop; fits every pet',
  chg:'new head accessory you can buy (Pet Shop, Head slot); try it on each pet under "On".',
  opts:[PU_OPT.pick('pet','On',ACC_PETS)],dflt:{pet:'capybara'},
  build(g,o){const m=wearHead(accPet(o.pet||'capybara'),k);g.add(m.root);}});
/* stand on the ground: the tyre treads and the sleeping dog's paws went a little below the floor */
for(const [id,dy] of[['farm:tractor',.07],['farm:combine',.06],['farm:lab',.05]]){const P=PU[id],B=P.build;P.build=function(g,o){const q=new THREE.Group();q.position.y=dy;g.add(q);B.call(this,q,o);};}

/* ---------- round 18 (30 Oct): his notes on each bear version ---------- */
const AT18=1793376000000;
/* things the bears held are separate items now (honey pot = head accessory; scarf and flower are in the Pet Shop already) */
for(const B of BEARS){delete B[2].extra;}
BEARS.find(b=>b[0]==='honey')[1]='Sleepy honey bear';
BEARS.find(b=>b[0]==='polar')[1]='Polar bear';
BEARS.find(b=>b[0]==='moon')[1]='Moon bear';
/* grizzly: realistic, no fuzz balls: bigger, a real shoulder hump, a long straight snout, small ears, a lighter grizzled band over the hump */
Object.assign(BEARS.find(b=>b[0]==='grizzly')[2],{fluff:0,hump:1,snout:1.45,ear:.095,head:.95,wide:1.12,lt:'#a07850',muzzle:'#a07850'});
/* panda: a happy face: eye patches tilted up (not drooping), bigger shiny eyes, a smile */
Object.assign(BEARS.find(b=>b[0]==='panda')[2],{happy:1});
{const cb=cuteBear;cuteBear=function(P){const m=cb(P),h=m.head;
  if(P.happy){/* replace the drooping patches: remove the old ones (dark spheres beside the eyes) and add upturned ones */
    for(const o of [...h.children])if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHexString()==='2e2a33'&&Math.abs(o.position.y-.06)<.01)h.remove(o);
    for(const s of[-1,1])sph(h,.1,'#2e2a33',s*.15,.08,.3,{s:[1,1.05,.4],rz:-s*.35,ws:12,hs:10,ol:false});
    for(const s of[-1,1]){sph(h,.07,'#1d1622',s*.15,.08,.345,{s:[1,1.1,.6],ws:14,hs:10,ol:false});sph(h,.028,'#ffffff',s*.15+.025,.11,.37,{ws:8,hs:6,ol:false});}
    for(const sd of[-1,1])box(h,.11,.03,.03,'#2a1f2e',sd*.048,-.165,.48,{rz:sd*.4,center:true,ol:false});}   /* a clear smile, both ends up */
  return m;};}
Object.assign(PU['pet:bear'],{vbase:PU['pet:bear'].at,at:AT18,vat:{grizzly:AT18,panda:AT18,moon:AT18,honey:AT18,polar:AT18},
  chg:'your notes per bear: honey bear, polar bear and moon bear without items (the honey pot, scarf and flower are buyable); grizzly realistic without the fuzz (big hump, long snout, grizzled band); panda happier (eye patches up, shiny eyes, a smile). Teddy unchanged.',
  opts:[PU_OPT.pick('v','Version',BEARS.map(([k,n])=>[k,n])),AGE_OPT]});

/* ---------- round 19 (30 Oct): capybara like his ChatGPT sheet, a real grizzly, panda patches ---------- */
const AT19=1793377000000;
/* low-poly pieces: a rounded box (superellipsoid) with few facets, flat-shaded, with a thin ink shell */
const LPM=new Map();function lpMat(c){c=String(c).toLowerCase();let m=LPM.get(c);if(!m){m=toon({color:c});m.userData.plain=1;LPM.set(c,m);}return m;}
function seGeo(ws,hs,p,taper){const g=new THREE.SphereGeometry(1,ws,hs),a=g.attributes.position;
  for(let i=0;i<a.count;i++){let x=a.getX(i),y=a.getY(i),z=a.getZ(i);const f=v=>Math.sign(v)*Math.pow(Math.abs(v),p);x=f(x);y=f(y);z=f(z);if(taper){const k=1-taper*(y+1)/2;x*=k;}a.setXYZ(i,x,y,z);}
  g.computeVertexNormals();return g;}
function lp(g,c,x,y,z,sx,sy,sz,o={}){let geo=seGeo(o.ws||8,o.hs||6,o.p??.6,o.taper||0);if(!o.mat){geo=geo.toNonIndexed();geo.computeVertexNormals();}   /* faceted: each face its own normal (the toon material has no flatShading in r128) */const m=new THREE.Mesh(geo,o.mat||lpMat(c));m.position.set(x,y,z);m.scale.set(sx,sy,sz);if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;g.add(m);
  if(o.ol!==false){const t=o.ol||.01,h=new THREE.Mesh(geo,OL);h.position.copy(m.position);h.rotation.copy(m.rotation);h.scale.set(sx+t,sy+t,sz+t);g.add(h);}return m;}
/* the capybara like his ChatGPT model sheet: a chunky loaf body, a big flat-topped trapezoid head as long as a brick, a darker rounded-rectangle muzzle
   on the blunt front, 人 mouth, big round eyes, small round ears, short thick legs on dark flat feet, a faceted low-poly look and a thin outline */
function capySheet(col){const C=col||'#c98a52',D=shade(C,-.42),M=shade(C,-.2),Lt=shade(C,.1),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  /* body: one chunky loaf, flat-ish back, a round rump, a lighter belly */
  lp(b,C,0,.4,-.04,.27,.22,.45,{ws:10,hs:7,p:.55});lp(b,Lt,0,.28,0,.2,.08,.34,{ws:8,hs:5,p:.6,ol:false});
  /* legs: short thick columns; the dark flat feet are part of the leg */
  for(const [x,z] of[[-.15,.26],[.15,.26],[-.16,-.3],[.16,-.3]]){const p=new THREE.Group();p.position.set(x,0,z);b.add(p);
    lp(p,C,0,.15,0,.115,.125,.115,{ws:7,hs:4,p:.65});lp(p,D,0,.035,.015,.105,.04,.12,{ws:7,hs:3,p:.5});legs.push(p);}
  /* head: big, flat on top, clearly wider at the cheeks than on top (trapezoid from the front), long and blunt; its top runs level with the back */
  const head=new THREE.Group();head.position.set(0,.54,.5);b.add(head);
  lp(head,C,0,0,0,.26,.19,.3,{ws:10,hs:7,p:.4,taper:.44});
  /* the muzzle: a big darker rounded rectangle on the blunt front, two soft nostrils on top of it, the 人 mouth below */
  lp(head,M,0,-.04,.28,.17,.11,.05,{ws:12,hs:8,p:.62,ol:.006});
  for(const s of[-1,1])sph(head,.022,'#2a1f2e',s*.05,.02,.328,{s:[1.5,.7,.5],ws:8,hs:6,ol:false});
  box(head,.014,.05,.012,'#2a1f2e',0,-.05,.33,{center:true,ol:false});for(const s of[-1,1])box(head,.045,.014,.012,'#2a1f2e',s*.02,-.078,.33,{rz:-s*.25,center:true,ol:false});
  /* big round eyes high on the front corners (seen from the front and the side), a white shine */
  for(const s of[-1,1]){sph(head,.052,'#1d1622',s*.15,.08,.2,{ws:14,hs:10,ol:false});sph(head,.017,'#ffffff',s*.138,.097,.247,{ws:6,hs:4,ol:false});
  /* small round ears low on the sides of the flat top, a little forward */
    lp(head,C,s*.165,.16,-.11,.055,.05,.03,{ws:7,hs:5,p:.8,ol:.008,ry:s*.5});lp(head,D,s*.17,.16,-.09,.032,.03,.012,{ws:6,hs:4,p:.8,ol:false,ry:s*.5});}
  root.scale.setScalar(1.15);return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6,top:{x:0,y:.19,z:-.02,w:.32}};}
capyRef=capySheet;capyReal=function(col){return capySheet(col);};
PU['age:capybara']=Object.assign({},PU['age:capybara'],{v:6,at:AT19,
  chg:'redone like your ChatGPT sheet: low-poly faceted look, chunky loaf body, big flat-topped head (wider at the cheeks), dark rounded-rectangle muzzle with the 人 mouth, big round eyes, small round ears, short thick legs on dark flat feet.',
  build(g,o){g.add(puAge(capySheet(o.c),o.age||'adult').root);}});
/* the grizzly: a real grizzly, not a teddy: long and heavy, a big shoulder hump, the head carried low, a dished face (brow bump, long straight snout),
   small round ears set wide, grizzled light tips over the hump and back, dark legs, long pale claws */
function grizzly(){const C='#6b4529',T='#b08a5c',Lg='#4a2f1e',Mz='#9a7550',root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const body=new THREE.Group();body.scale.set(.9,1,1);b.add(body);
  tube(body,[[0,.95,-1.05],[0,1.0,-.7],[0,1.04,-.2],[0,1.14,.25],[0,1.08,.62],[0,.98,.92]],prof([0,.2],[.08,.44],[.3,.52],[.55,.55],[.72,.5],[.9,.38],[1,.3]),0,C,{seg:40,rad:22,ol:.016});
  tube(body,[[0,1.12,-.7],[0,1.34,-.15],[0,1.48,.28],[0,1.3,.7]],prof([0,.08],[.55,.38],[1,.1]),0,'#93704a',{seg:24,rad:18,ol:.014});   /* the shoulder hump, sloping into the back */
  tube(body,[[0,1.34,-.95],[0,1.5,-.15],[0,1.66,.28],[0,1.5,.6]],prof([0,.06],[.6,.22],[1,.06]),0,T,{seg:20,rad:14,ol:false});   /* grizzled light tips over the hump and back */
  for(const s of[-1,1])sph(b,.32,C,s*.17,.88,-.78,{s:[.8,1,1.1],ws:16,hs:12,ol:false});   /* heavy haunches */
  for(const [x,z,f] of[[-.3,.58,1],[.3,.58,1],[-.32,-.82,0],[.32,-.82,0]]){const p=new THREE.Group();p.position.set(x,0,z);b.add(p);
    tube(p,f?[[0,1.0,0],[0,.6,.03],[0,.16,.05]]:[[0,1.0,-.05],[0,.62,-.12],[0,.36,-.02],[0,.16,.02]],f?prof([0,.24],[.5,.21],[1,.19]):prof([0,.32],[.35,.26],[.7,.19],[1,.19]),0,Lg,{seg:16,rad:16,ol:.014});
    sph(p,.26,Lg,0,.1,.1,{s:[1,.48,1.25],ws:18,hs:12,ol:.012});if(f){sph(p,.27,C,0,.86,0,{s:[1,1.2,1.1],ws:16,hs:12,ol:.012});sph(p,.21,Lg,0,.5,.03,{ws:14,hs:10,ol:false});}
    for(let i=-1;i<=1;i++)cone(p,.036,f?.2:.13,'#ece4d2',i*.1,.07,f?.44:.38,{rx:Math.PI/2+.35,center:true,seg:6,ol:.006});legs.push(p);}
  /* the head, carried low and forward: a broad skull, a clear brow over the eyes, a dip (the stop), then a wide deep snout */
  const head=new THREE.Group();head.position.set(0,1.02,1.12);head.rotation.x=.25;head.scale.setScalar(1.2);b.add(head);
  sph(head,.3,C,0,.04,-.04,{s:[1.15,.92,1],ws:20,hs:14,ol:.014});
  for(const s of[-1,1])sph(head,.17,C,s*.24,-.06,-.02,{s:[.8,1,1],ws:14,hs:10,ol:false});   /* broad cheeks */
  sph(head,.13,C,0,.16,.16,{s:[1.7,.55,.8],ws:14,hs:8,ol:false});   /* the brow */
  tube(head,[[0,-.04,.14],[0,-.06,.32],[0,-.08,.44]],prof([0,.2],[.5,.18],[1,.16]),0,Mz,{seg:14,rad:16,ol:.012});   /* the snout: wide and deep, not too long */
  sph(head,.09,'#1d1622',0,-.04,.58,{s:[1.3,.85,.7],ws:14,hs:10,ol:.01});box(head,.015,.07,.01,'#1d1622',0,-.15,.59,{center:true,ol:false});
  for(const s of[-1,1]){sph(head,.04,'#1d1622',s*.15,.1,.23,{ws:10,hs:8,ol:false});sph(head,.013,'#ffffff',s*.158,.117,.262,{ws:5,hs:4,ol:false});
    sph(head,.095,C,s*.27,.28,-.1,{s:[1,1,.5],ws:12,hs:10,ol:.012});sph(head,.042,'#3d2818',s*.27,.27,-.07,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  const tail=new THREE.Group();tail.position.set(0,1.08,-1.2);b.add(tail);sph(tail,.07,C,0,0,0,{ws:8,hs:6,ol:.01});
  root.scale.setScalar(1.25*KM/1.75);return{root,b,legs,tail,head,type:'bear',phase:Math.random()*6};}
/* panda: patches much bigger than the eyes; each eye sits fully inside its patch, with a clear shine */
Object.assign(BEARS.find(b=>b[0]==='panda')[2],{happy:0,patch2:1});
{const cb=cuteBear;cuteBear=function(P){const m=cb(P),h=m.head;
  if(P.patch2){for(const o of [...h.children])if(o.isMesh&&o.material&&o.material.color){const hx=o.material.color.getHexString(),p=o.position;if((hx==='2e2a33'||hx==='1d1622'||hx==='ffffff')&&Math.abs(p.x)>.1&&Math.abs(p.x)<.22&&p.y>.02&&p.y<.14&&p.z>.25&&p.z<.42)h.remove(o);}
    for(const s of[-1,1]){sph(h,.15,'#2e2a33',s*.16,.07,.335,{s:[.85,1.15,.32],rz:-s*.35,ws:16,hs:12,ol:false});
      sph(h,.055,'#0d0a10',s*.155,.085,.385,{s:[1,1.1,.55],ws:14,hs:10,ol:false});sph(h,.022,'#ffffff',s*.155+.02,.11,.41,{ws:8,hs:6,ol:false});sph(h,.01,'#ffffff',s*.155-.018,.066,.412,{ws:6,hs:4,ol:false});}}
  return m;};}
BEARS.find(b=>b[0]==='grizzly')[1]='Grizzly';
{const P=PU['pet:bear'],B=P.build;Object.assign(P,{at:AT19,vat:Object.assign({},P.vat,{grizzly:AT19,panda:AT19}),
  chg:'grizzly: a real grizzly now (head low, dished face, long snout, grizzled hump, long claws), not a darker teddy. Panda: eye patches much bigger, each eye fully inside its patch.',
  build(g,o){if(o.v==='grizzly'){g.add(puAge(grizzly(),o.age||'adult').root);return;}B.call(this,g,o);}});}

/* ---------- round 20 (30 Oct): every bear on the same body (round rump); the grizzly too, with a smaller hump ---------- */
const AT20=1793378000000;
function grizzly2(){const C='#6b4529',T='#a8835a',Lg='#4a2f1e',Mz='#9a7550';
  const m=cuteBear({c:C,legs:Lg,muzzle:Mz,pad:'#3d2818',ear:.1}),b=m.b;
  /* the same body as the other bears; on top, a smaller grizzled hump over the shoulders */
  const hb=new THREE.Group();hb.scale.set(.9,1,1);b.add(hb);
  tube(hb,[[0,1.12,-.2],[0,1.3,.12],[0,1.26,.42]],prof([0,.06],[.55,.24],[1,.06]),0,'#8a6440',{seg:18,rad:16,ol:.012});
  tube(hb,[[0,1.3,-.1],[0,1.46,.14],[0,1.42,.36]],prof([0,.03],[.55,.1],[1,.03]),0,T,{seg:14,rad:12,ol:false});
  /* long pale claws */
  for(const l of m.legs)for(let i=-1;i<=1;i++)cone(l,.03,.14,'#ece4d2',i*.08,.05,.36,{rx:Math.PI/2+.35,center:true,seg:6,ol:.006});
  /* the grizzly head: broad skull, a brow, a wide snout, small round ears (replaces the round teddy head) */
  const old=m.head,head=new THREE.Group();head.position.copy(old.position);head.position.y-=.08;head.position.z+=.04;head.rotation.x=.2;b.remove(old);b.add(head);m.head=head;
  sph(head,.34,C,0,.02,-.04,{s:[1.12,.92,1],ws:22,hs:16,ol:.016});for(const s of[-1,1])sph(head,.18,C,s*.27,-.07,-.02,{s:[.8,1,1],ws:14,hs:10,ol:false});
  sph(head,.14,C,0,.17,.2,{s:[1.7,.55,.8],ws:14,hs:8,ol:false});
  tube(head,[[0,-.05,.18],[0,-.07,.38],[0,-.09,.5]],prof([0,.22],[.5,.2],[1,.17]),0,Mz,{seg:14,rad:16,ol:.012});
  sph(head,.1,'#1d1622',0,-.05,.66,{s:[1.3,.85,.7],ws:14,hs:10,ol:.01});box(head,.016,.08,.01,'#1d1622',0,-.17,.665,{center:true,ol:false});
  for(const s of[-1,1]){sph(head,.045,'#1d1622',s*.17,.1,.27,{ws:10,hs:8,ol:false});sph(head,.015,'#ffffff',s*.178,.12,.305,{ws:5,hs:4,ol:false});
    sph(head,.1,C,s*.3,.3,-.1,{s:[1,1,.5],ws:12,hs:10,ol:.012});sph(head,.052,'#3d2818',s*.3,.3,-.07,{s:[1,1,.4],ws:8,hs:6,ol:false});}
  return m;}
{const P=PU['pet:bear'],B=P.build;Object.assign(P,{at:AT20,vat:Object.assign({},P.vat,{teddy:AT20,honey:AT20,grizzly:AT20,panda:AT20,polar:AT20,moon:AT20}),
  chg:'all six bears: the back end is round now (it was cut flat). Grizzly: the same body as the other bears, with a smaller grizzled hump; its own head (brow, wide snout, small ears) and long claws kept.',
  build(g,o){if(o.v==='grizzly'){g.add(puAge(grizzly2(),o.age||'adult').root);return;}B.call(this,g,o);}});}

/* ---------- round 21 (30 Oct): ten capybaras to choose from; grizzly on the polar bear's cute body ---------- */
const AT21L=1793381000000;
/* one capybara maker, ten looks: pose, body, head, face and finish (faceted or smooth) change per look */
function capyMake(P,col){const C=col||P.c||'#c98a52',D=shade(C,-.42),M=shade(C,-.2),Lt=shade(C,.1),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const sm=!!P.smooth,fw=P.facet?6:0,o=(x)=>Object.assign(sm?{ws:22,hs:16,mat:mat(x.c)}:{},x),L=(g,c,x,y,z,sx,sy,sz,q={})=>lp(g,c,x,y,z,sx,sy,sz,Object.assign({},q,sm?{ws:22,hs:16,mat:mat(c)}:fw?{ws:Math.min(q.ws||8,fw),hs:Math.min(q.hs||6,4)}:{}));
  const BL=P.len||1,LH=P.leg||1,HS=P.head||1,pose=P.pose||'stand';
  const by=pose==='lie'?.22:.4*Math.min(1.1,.85+.15*LH);
  const body=new THREE.Group();b.add(body);if(pose==='sit'){body.rotation.x=-.65;body.position.set(0,.02,-.1);}
  L(body,C,0,by,-.04,.27*(P.wide||1),.22*(P.tall||1),.45*BL,{p:P.bp??.55,ws:10,hs:7});L(body,Lt,0,by-.12,0,.2,.08,.34*BL,{p:.6,ol:false,ws:8,hs:5});
  const lz=[[-.15,.26*BL],[.15,.26*BL],[-.16,-.3*BL],[.16,-.3*BL]];
  for(const [x,z] of lz){const p=new THREE.Group();p.position.set(x,0,z);b.add(p);
    if(pose==='lie'){if(z>0)L(p,C,0,.06,.16,.09,.055,.13,{p:.6,ws:7,hs:4});}
    else if(pose==='sit'&&z<0){L(p,C,0,.1,.06,.12,.1,.14,{p:.6,ws:7,hs:4});L(p,D,0,.035,.16,.1,.04,.12,{p:.5,ws:7,hs:3});}
    else{const h=(pose==='sit'?.22:.15)*LH;L(p,C,0,h,0,.11,h,.11,{p:.65,ws:7,hs:4});L(p,D,0,.03,.015,.09,.035,.1,{p:.5,ws:7,hs:3});}legs.push(p);}
  /* head */
  const hy=pose==='lie'?.3:pose==='sit'?.74:by+.14+(P.hy||0),hz=pose==='sit'?.36:.5*BL+(P.hz||0);
  const head=new THREE.Group();head.position.set(0,hy,hz);head.scale.setScalar(HS);if(P.tilt)head.rotation.x=P.tilt;b.add(head);
  const hw=.26*(P.hw||1),hh=.19*(P.hh||1),hd=.3*(P.hd||1);
  L(head,C,0,0,0,hw,hh,hd,{p:P.hp??.4,taper:P.taper??.44,ws:10,hs:7});
  /* muzzle: a dark rounded patch on the blunt front (or a plain nose) */
  if(P.mz!=='nose')L(head,M,0,-.04*(P.hh||1),hd-.02,.17*(P.hw||1),.11*(P.hh||1),.05,{p:.62,ol:.006,ws:12,hs:8});
  const fz=hd+(P.mz!=='nose'?.028:.0);
  for(const s of[-1,1])sph(head,P.mz==='nose'?.03:.022,'#2a1f2e',s*.05,.02,fz,{s:[1.5,.7,.5],ws:8,hs:6,ol:false});
  if(P.mouth!=='smile'){box(head,.014,.05,.012,'#2a1f2e',0,-.05,fz+.002,{center:true,ol:false});for(const s of[-1,1])box(head,.045,.014,.012,'#2a1f2e',s*.02,-.078,fz+.002,{rz:-s*.25,center:true,ol:false});}
  else{const t=new THREE.Mesh(new THREE.TorusGeometry(.03,.008,6,12,Math.PI),mat('#2a1f2e'));t.position.set(0,-.05,fz+.004);t.rotation.z=Math.PI;head.add(t);}
  /* eyes */
  const er=.05*(P.eye||1),ex=hw*(P.ex||.5),ey=.08*(P.hh||1),ez=hd*(P.ef||.8);
  for(const s of[-1,1]){if(P.sleepy){const e=new THREE.Mesh(new THREE.TorusGeometry(er*.6,.009,6,12,Math.PI),mat('#1d1622'));e.position.set(s*ex,ey,ez+er*.3);e.rotation.y=s*.4;head.add(e);}
    else{sph(head,er,'#1d1622',s*ex,ey,ez,{ws:14,hs:10,ol:false});sph(head,er*.34,'#ffffff',s*(ex-er*.25),ey+er*.35,ez+er*.85,{ws:6,hs:4,ol:false});}
    if(P.blush)sph(head,.045,'#ff9e9e',s*hw*.7,-.05,hd*.75,{s:[1,.55,.35],ws:10,hs:6,ol:false});
    const ea=.05*(P.ear||1);L(head,C,s*hw*.66,hh*.85,-hd*.4,ea*1.1,ea,ea*.6,{p:.8,ol:.008,ws:7,hs:5,ry:s*.5});L(head,D,s*hw*.68,hh*.85,-hd*.33,ea*.62,ea*.6,ea*.25,{p:.8,ol:false,ws:6,hs:4,ry:s*.5});}
  root.scale.setScalar(1.15*(P.size||1));return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6,top:{x:0,y:hh,z:-.02,w:hw*1.25}};}
const CAPY10=[
 ['c1','1 · Sheet style (faceted)',{facet:1}],
 ['c2','2 · Smooth and soft',{smooth:1,hp:.7,taper:.2,eye:1.15,len:.9,tall:1.12,hy:.04}],
 ['c3','3 · Chibi: big head, big eyes',{smooth:1,head:1.35,eye:1.15,ex:.42,ef:.86,blush:1,len:.85,leg:.8}],
 ['c4','4 · Real: long tall head, small eyes',{smooth:1,hd:1.3,hh:1.15,taper:.3,eye:1,ex:.45,ef:.88,ear:1.1,len:1.1,tilt:.15}],
 ['c5','5 · Lying loaf, sleepy',{smooth:1,pose:'lie',sleepy:1,blush:1,wide:1.15,tall:.8}],
 ['c6','6 · Sitting up',{smooth:1,pose:'sit'}],
 ['c7','7 · Boxy block',{bp:.35,hp:.3,taper:.2,smooth:1,wide:1.1,ef:.96,ex:.55,ear:1.3}],
 ['c8','8 · Long and low',{smooth:1,len:1.35,leg:.7,tall:.85}],
 ['c9','9 · Round baby face',{smooth:1,hw:1.1,hd:.8,hp:.8,taper:.1,eye:1.25,blush:1,mouth:'smile'}],
 ['c10','10 · Calm smile, plain nose',{smooth:1,mz:'nose',mouth:'smile',sleepy:1,hd:1.1,ear:1.25,ef:.88}]];
capyReal=function(col){return capyMake(CAPY10[0][2],col);};capyRef=capyReal;
PU['age:capybara']=Object.assign({},PU['age:capybara'],{v:7,at:AT21L,vbase:AT21L,vat:{},
  chg:'ten capybaras to choose from (Version): sheet style, smooth, chibi, real long head, lying loaf, sitting, boxy, long and low, round baby face, calm smile. Keep the ones you like; several can go into the game.',
  opts:[PU_OPT.pick('v','Version',CAPY10.map(([k,n])=>[k,n])),AGE_OPT,PU_OPT.col(['#c98a52','#b07848','#d9a06a','#9a6a43'])],dflt:{v:'c1',age:'adult',c:'#c98a52'},
  build(g,o){const V=CAPY10.find(x=>x[0]===o.v)||CAPY10[0];g.add(puAge(capyMake(V[2],o.c),o.age||'adult').root);}});
/* grizzly: the same cute body and face as the polar bear, in grizzly browns, with the small grizzled mane over the shoulders */
function grizzly3(){const m=cuteBear({c:'#6b4529',lt:'#a8835a',muzzle:'#b08a62',legs:'#4a2f1e',pad:'#3d2818',snout:1.3,ear:.09,head:.92}),hb=new THREE.Group();hb.scale.set(.9,1,1);m.b.add(hb);
  tube(hb,[[0,1.12,-.2],[0,1.28,.12],[0,1.24,.4]],prof([0,.06],[.55,.27],[1,.06]),0,'#8a6440',{seg:18,rad:16,ol:.012});
  tube(hb,[[0,1.28,-.1],[0,1.42,.14],[0,1.38,.34]],prof([0,.03],[.55,.12],[1,.03]),0,'#a8835a',{seg:14,rad:12,ol:false});return m;}
{const P=PU['pet:bear'],B=P.build;Object.assign(P,{at:AT21L,vat:Object.assign({},P.vat,{grizzly:AT21L}),
  chg:'grizzly: now the same cute body and face as the polar bear, in grizzly browns, with the small grizzled mane. The other five unchanged (you kept them).',
  build(g,o){if(o.v==='grizzly'){g.add(puAge(grizzly3(),o.age||'adult').root);return;}B.call(this,g,o);}});}

/* ---------- round 22 (30 Oct): the capybara exactly like his picture (front, back, side) ---------- */
const AT22L=1793382000000;
/* where a superellipsoid's front surface is at (x,y): used to seat eyes, blush and nose on the head */
const seZ=(a,b,c,p,x,y)=>{const k=1-Math.pow(Math.abs(x/a),2/p)-Math.pow(Math.abs(y/b),2/p);return k>0?c*Math.pow(k,p/2):0;};
const CAPY_INK=new THREE.MeshBasicMaterial({color:'#3a2418',side:THREE.BackSide});
function capyPic(col){const C=col||'#df9656',F='#6e3f22',M=shade(C,-.22),E='#8a5432',root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const L=(g,c,x,y,z,sx,sy,sz,p,ol)=>{const m=lp(g,c,x,y,z,sx,sy,sz,{p,ws:30,hs:22,mat:mat(c),ol:ol===false?false:(ol||.013)});if(ol!==false){const h=g.children[g.children.length-1];h.material=CAPY_INK;}return m;};
  /* body: deep and chunky, shorter, a round rump, a soft rise behind the head */
  L(b,C,0,.47,-.06,.26,.27,.33,.62);L(b,C,0,.62,.12,.22,.16,.2,.8,false);
  /* legs: short and thick, set close, the bottom third dark brown */
  for(const [x,z] of[[-.17,.16],[.17,.16],[-.14,-.27],[.14,-.27]]){const p=new THREE.Group();p.position.set(x,0,z);b.add(p);
    L(p,C,0,.16,0,.115,.13,.115,.75);L(p,F,0,.05,0,.118,.05,.118,.7);legs.push(p);}
  /* head: big and round, wider than the body, widest at the cheeks, sitting low and forward */
  const HW=.38,HH=.31,HD=.32,HP=.9,head=new THREE.Group();head.position.set(0,.5,.36);b.add(head);
  L(head,C,0,0,0,HW,HH,HD,HP);for(const s of[-1,1])L(head,C,s*.12,-.09,.02,.28,.2,.27,.9,false);
  const at=(x,y,d)=>seZ(HW,HH,HD,HP,x,y)+(d||0);
  /* the big darker muzzle patch: a wide rounded square low on the face */
  L(head,M,0,-.1,at(0,-.1)-.075,.22,.125,.1,.62,false);
  /* nose: a small dark rounded oval; the thick ω mouth under it */
  const nz=at(0,-.04)+.02;sph(head,.03,'#4a2a1a',0,-.04,nz,{s:[1.35,.85,.5],ws:16,hs:12,ol:false});
  box(head,.012,.03,.012,'#3a2014',0,-.07,nz+.004,{center:true,ol:false});
  for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.TorusGeometry(.032,.012,8,16,Math.PI),mat('#3a2014'));m.position.set(s*.032,-.086,nz-.006);m.rotation.z=Math.PI;head.add(m);}
  /* big round black eyes, wide apart, two white shines; round pink blush just outside the muzzle */
  for(const s of[-1,1]){const ex=s*.25,ey=.03,ez=at(.25,.03)-.012;const e=new THREE.Group();e.position.set(ex,ey,ez);e.rotation.y=s*.5;head.add(e);
    sph(e,.06,'#000000',0,0,0,{s:[1,1.06,.45],ws:18,hs:14,ol:false});sph(e,.02,'#ffffff',-s*.0+(-.018),.022,.028,{ws:8,hs:6,ol:false});sph(e,.009,'#ffffff',.02,-.018,.029,{ws:6,hs:4,ol:false});
    const bx=s*.27,by=-.05,bz=Math.max(at(.27,-.05),.02+seZ(.28,.2,.27,.9,.15,.04))-.004;const bl=new THREE.Group();bl.position.set(bx,by,bz);bl.rotation.y=s*.75;head.add(bl);sph(bl,.04,'#f2909a',0,0,0,{s:[1,1,.3],ws:12,hs:10,ol:false});
  /* ears: small and round on the top corners, brown inside */
    const ea=new THREE.Group();ea.position.set(s*.24,.25,-.08);ea.rotation.z=s*-.3;head.add(ea);L(ea,C,0,0,0,.078,.068,.045,.8);L(ea,E,0,-.006,.028,.05,.05,.016,.8,false);}
  root.scale.setScalar(1.12);return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6,top:{x:0,y:HH,z:-.04,w:.42}};}
CAPY10.unshift(['pic','Your picture (exactly like it)',{pic:1}]);
capyReal=function(col){return capyPic(col);};capyRef=capyReal;
{const P=PU['age:capybara'];Object.assign(P,{at:AT22L,vbase:P.at,vat:{pic:AT22L},
  chg:'new first version "Your picture": built exactly from your front / back / side picture: big round head, wide dark rounded muzzle with the ω mouth, big round eyes, pink blush, small round ears with dark insides, chunky body, short thick legs with dark bottoms.',
  opts:[PU_OPT.pick('v','Version',CAPY10.map(([k,n])=>[k,n])),AGE_OPT,PU_OPT.col(['#df9656','#c98a52','#b07848','#d9a06a'])],dflt:{v:'pic',age:'adult',c:'#df9656'},
  build(g,o){const V=CAPY10.find(x=>x[0]===o.v)||CAPY10[0];g.add(puAge(V[2].pic?capyPic(o.c):capyMake(V[2],o.c),o.age||'adult').root);}});}

/* ---------- round 23 (30 Oct): capybara: only "Your picture" plus a few versions made from it (same tone) ---------- */
const AT23L=1793384000000;
function capyPic2(col,P){P=P||{};const C=col||'#df9656',F='#6e3f22',M=shade(C,-.22),E='#8a5432',root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const L=(g,c,x,y,z,sx,sy,sz,p,ol)=>{const m=lp(g,c,x,y,z,sx,sy,sz,{p,ws:30,hs:22,mat:mat(c),ol:ol===false?false:(ol||.013)});if(ol!==false){const h=g.children[g.children.length-1];h.material=CAPY_INK;}return m;};
  /* body: deep and chunky, shorter, a round rump, a soft rise behind the head */
  L(b,C,0,.47,-.06-(P.len?(.33*(P.len-1)):0),.26*(P.wide||1),.27*(P.tall||1),.33*(P.len||1),.62);L(b,C,0,.62,.12,.22,.16,.2,.8,false);
  /* legs: short and thick, set close, the bottom third dark brown */
  for(const [x,z] of[[-.17,.16],[.17,.16],[-.14,-.27],[.14,-.27]]){const p=new THREE.Group();p.position.set(x,0,z);b.add(p);
    if(P.lie){if(z>0){p.position.x*=.75;L(p,F,0,.28,.13,.075,.045,.1,.7);}legs.push(p);continue;}
    L(p,C,0,.16,0,.115,.13,.115,.75);L(p,F,0,.05,0,.118,.05,.118,.7);if(P.leg){p.scale.y=P.leg;p.scale.x=p.scale.z=1.3;}legs.push(p);}
  /* head: big and round, wider than the body, widest at the cheeks, sitting low and forward */
  const HW=.38,HH=.31,HD=.32,HP=.9,head=new THREE.Group();head.position.set(0,.5,.36);if(P.head){head.scale.setScalar(P.head);head.position.y+=.06*(1-P.head);head.position.z-=.25*(1-P.head);}b.add(head);
  L(head,C,0,0,0,HW,HH,HD,HP);for(const s of[-1,1])L(head,C,s*.12,-.09,.02,.28,.2,.27,.9,false);
  const at=(x,y,d)=>seZ(HW,HH,HD,HP,x,y)+(d||0);
  /* the big darker muzzle patch: a wide rounded square low on the face */
  L(head,M,0,-.1,at(0,-.1)-.075,.22,.125,.1,.62,false);
  /* nose: a small dark rounded oval; the thick ω mouth under it */
  const nz=at(0,-.04)+.02;sph(head,.03,'#4a2a1a',0,-.04,nz,{s:[1.35,.85,.5],ws:16,hs:12,ol:false});
  if(P.happy){const mo=new THREE.Mesh(new THREE.CircleGeometry(.062,20,Math.PI,Math.PI),mat('#5a2a24'));mo.position.set(0,-.065,nz-.004);mo.scale.y=1.3;head.add(mo);const tg=new THREE.Mesh(new THREE.CircleGeometry(.046,16,Math.PI,Math.PI),mat('#ff8f9e'));tg.position.set(0,-.115,nz-.002);tg.scale.y=.7;head.add(tg);}
  else{box(head,.012,.03,.012,'#3a2014',0,-.07,nz+.004,{center:true,ol:false});
  for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.TorusGeometry(.032,.012,8,16,Math.PI),mat('#3a2014'));m.position.set(s*.032,-.086,nz-.006);m.rotation.z=Math.PI;head.add(m);}}
  /* big round black eyes, wide apart, two white shines; round pink blush just outside the muzzle */
  for(const s of[-1,1]){const ex=s*.25,ey=.03,ez=at(.25,.03)-.012;const e=new THREE.Group();e.position.set(ex,ey,ez);e.rotation.y=s*.5;head.add(e);
    if(P.eyes){e.position.x*=.9;e.position.z=at(Math.abs(e.position.x),.03)-.01;const sl=P.eyes==='sleepy',t=new THREE.Mesh(new THREE.TorusGeometry(sl?.04:.045,sl?.011:.012,8,18,Math.PI),mat('#000000'));t.position.z=.006;if(sl){t.rotation.z=Math.PI+s*.15;t.position.y=.012;}else t.position.y=-.015;e.add(t);}else{sph(e,.06,'#000000',0,0,0,{s:[1,1.06,.45],ws:18,hs:14,ol:false});sph(e,.02,'#ffffff',-s*.0+(-.018),.022,.028,{ws:8,hs:6,ol:false});sph(e,.009,'#ffffff',.02,-.018,.029,{ws:6,hs:4,ol:false});}
    const bx=s*.27,by=-.05,bz=Math.max(at(.27,-.05),.02+seZ(.28,.2,.27,.9,.15,.04))-.004;const bl=new THREE.Group();bl.position.set(bx,by,bz);bl.rotation.y=s*.75;head.add(bl);sph(bl,.04,'#f2909a',0,0,0,{s:[1,1,.3],ws:12,hs:10,ol:false});
  /* ears: small and round on the top corners, brown inside */
    const ea=new THREE.Group();ea.position.set(s*.24,.25,-.08);ea.rotation.z=s*-.3;head.add(ea);L(ea,C,0,0,0,.078,.068,.045,.8);L(ea,E,0,-.006,.028,.05,.05,.016,.8,false);}
  if(P.lie){b.position.y-=.245;head.rotation.x=.05;head.position.y+=.075;head.position.z+=.04;}
  root.scale.setScalar(1.12);return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6,top:{x:0,y:HH,z:-.04,w:.42}};}
const CAPY_PIC=[['pic','Your picture',{}],['sleepy','Sleepy',{eyes:'sleepy',head:.72}],['happy','Happy',{eyes:'happy',happy:1,head:.72}],['loaf','Lying loaf',{lie:1,eyes:'sleepy',wide:1.25,tall:.82,len:1.2,head:.75}],['chubby','Chubby baby face',{head:.8,wide:1.18,tall:1.08,leg:.95}]];
{const P=PU['age:capybara'];Object.assign(P,{at:AT23L,vbase:1793383000000,vat:{sleepy:AT23L,happy:AT23L,loaf:AT23L,chubby:AT23L},
  chg:'the four versions (sleepy, happy, lying loaf, chubby) now have smaller heads; Your picture is unchanged (the reference).',
  opts:[PU_OPT.pick('v','Version',CAPY_PIC.map(([k,n])=>[k,n])),AGE_OPT,PU_OPT.col(['#df9656','#c98a52','#b07848','#d9a06a'])],dflt:{v:'pic',age:'adult',c:'#df9656'},
  build(g,o){const V=CAPY_PIC.find(x=>x[0]===o.v)||CAPY_PIC[0];g.add(puAge(V[0]==='pic'?capyPic(o.c):capyPic2(o.c,V[2]),o.age||'adult').root);}});}

/* ---------- round 24 (30 Oct): a real-world capybara in the game's style (measured proportions) ---------- */
const AT24L=1793386000000,AT26L=1793388000000;
/* real proportions (metres, then scaled to game units by KM): head-to-rump 1.2 m, shoulder 0.55 m, rump a little higher,
   head ~28% of body length, long and boxy, flat top, deep blunt muzzle, nose on top at the front, small eyes high and set back,
   tiny round ears at the back of the head, short neck, short thick legs, dark feet, no tail */
function capyReal2(col,P){P=P||{};const C=col||'#b8784a',D=shade(C,-.3),Lt=shade(C,.4),INKB='#3a2418',root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const L=(g,c,x,y,z,sx,sy,sz,p,ol)=>lp(g,c,x,y,z,sx,sy,sz,{p,ws:30,hs:22,mat:mat(c),ol:ol===false?false:(ol||.012)});
  /* body: a long barrel, the back level (rump no higher than the shoulders), round at the back, a lighter belly */
  L(b,C,0,.39,-.04,.21,.2,.43*(P.lie?.9:1),.6);L(b,C,0,.4,-.27,.205,.195,.24,.7,false);L(b,C,0,.4,.2,.19,.185,.2,.75,false);L(b,Lt,0,.255,0,.15,.055,.3,.7,false);
  /* legs: short and thick, the hind legs heavier; small round dark feet (lying: tucked away, front paws forward) */
  for(const [x,z,h,w] of[[-.12,.24,.25,.095],[.12,.24,.25,.095],[-.13,-.32,.27,.11],[.13,-.32,.27,.11]]){const p=new THREE.Group();p.position.set(x,0,z);b.add(p);
    if(P.lie){if(z>0){p.position.x*=P.chin?1.05:.85;L(p,C,0,.22,.14,w*.9,.06,.15,.8);L(p,D,0,.205,.27,w*.6,.035,.045,.8);}else{}legs.push(p);continue;}
    L(p,C,0,h*.62,0,w,h*.5,w*1.05,.8);L(p,D,0,.03,.008,w*.92,.03,w*.98,.8);legs.push(p);}
  /* neck: thick, blending the head into the shoulders */
  L(b,C,0,.45,.34,.18,.18,.19,.85,false);
  /* head: big, long and boxy, the flat top level with the back */
  const head=new THREE.Group();head.position.set(0,.48,.47);head.rotation.x=.06+(P.tilt||0);if(P.roll){head.rotation.z=P.roll;head.position.y+=.03;}if(P.drop){head.position.y-=P.drop;head.position.z+=.02;}head.scale.set(.9,1,.92);b.add(head);
  L(head,C,0,.02,0,.13,.13,.19,.45);for(const s of[-1,1])L(head,C,s*.055,-.04,.02,.09,.11,.15,.7,false);
  /* muzzle: deep and boxy, a flat upright front */
  L(head,C,0,-.005,.165,.13,.125,.1,.38,false);
  /* the nose: a dark pad on top of the front edge, two round nostrils */
  L(head,'#4a2e22',0,.105,.235,.045,.015,.028,.6,false);for(const s of[-1,1])sph(head,.0135,'#120c10',s*.03,.123,.246,{s:[1.3,.6,1],ws:8,hs:6,ol:false});
  /* cartoon face line: from the nose straight down the muzzle into the mouth */
  const fz=.267;if(P.mouth==='yawn')box(head,.007,.06,.006,INKB,0,.068,fz,{center:true,ol:false});else box(head,.007,.1,.006,INKB,0,.045,fz,{center:true,ol:false});
  if(P.mouth==='yawn'){sph(head,.03,'#4a2420',0,-.045,fz-.004,{s:[1.9,1.2,.35],ws:16,hs:12,ol:false});sph(head,.016,'#ff8f9e',0,-.07,fz+.001,{s:[1.2,.7,.3],ws:10,hs:8,ol:false});}
  else if(P.mouth==='open'){const mo=new THREE.Mesh(new THREE.CircleGeometry(.055,18,Math.PI,Math.PI),mat('#5a2a24'));mo.position.set(0,-.025,fz+.001);mo.scale.y=1.2;head.add(mo);const tg=new THREE.Mesh(new THREE.CircleGeometry(.025,14,Math.PI,Math.PI),mat('#ff8f9e'));tg.position.set(0,-.058,fz+.002);head.add(tg);}
  else if(P.mouth==='o'||P.mouth==='small'){sph(head,.02,'#4a2420',0,-.04,fz-.004,{s:[1,1.2,.35],ws:14,hs:10,ol:false});sph(head,.01,'#ff8f9e',0,-.048,fz+.001,{s:[1,.8,.3],ws:10,hs:8,ol:false});}
  else for(const s of[-1,1]){const sm=P.mouth==='smile',m=new THREE.Mesh(new THREE.TorusGeometry(sm?.036:.022,sm?.006:.0045,8,16,Math.PI),mat(INKB));m.position.set(s*(P.mouth==='smile'?.036:.022),-.025,fz+.001);m.rotation.z=Math.PI;head.add(m);}
  /* eyes: round and shiny (cuter), high on the sides, turned a little forward; or closed arcs */
  const ER=.05*(P.eye||1);
  for(const s of[-1,1]){const e=new THREE.Group();if(P.eyes){e.position.set(s*.126,.09,.085);e.rotation.y=s*.4;}else{e.position.set(s*.114,.088,.09);e.rotation.y=s*.45;}head.add(e);
    if(P.eyes==='sleepy'){/* a closed eye: a thin dark lid line lying ON the head surface, the outer end drooping */const lid=new THREE.Group();lid.position.set(s*.128,.09,.035);lid.rotation.y=s*1.2;head.add(lid);sph(lid,.042,'#141018',0,0,0,{s:[1,.16,.25],rz:s*-.18,ws:16,hs:8,ol:false});sph(lid,.012,'#141018',s*-.036,-.012,0,{s:[1,.5,.4],rz:s*.6,ws:8,hs:6,ol:false});}
    else if(P.eyes){const t=new THREE.Mesh(new THREE.TorusGeometry(ER*.9,.017,8,20,Math.PI),mat('#141018'));t.position.y=-.01;t.position.z=.004;e.add(t);}
    else{sph(e,ER,'#141018',0,0,0,{s:[1,1.05,.6],ws:16,hs:12,ol:false});sph(e,ER*.36,'#ffffff',-s*.006+.008,ER*.38,ER*.42,{ws:8,hs:6,ol:false});sph(e,ER*.16,'#ffffff',-.008,-ER*.35,ER*.5,{ws:6,hs:4,ol:false});}
    if(P.blush){const bl=new THREE.Group();bl.position.set(s*.122,.0,.06);bl.rotation.y=s*1.1;head.add(bl);sph(bl,.042,'#ff8a96',0,0,0,{s:[1,.7,.15],ws:12,hs:8,ol:false});}
  /* ears: small and round, high at the back of the head, darker inside */
    const EA=1.2*(P.ear||1),ea=new THREE.Group();ea.position.set(s*.085,.13,-.15);ea.rotation.z=s*(P.ear?-.1:-.4);ea.scale.setScalar(EA);head.add(ea);L(ea,C,0,0,0,.04,.037,.02,.8,.008);L(ea,D,0,-.004,.012,.025,.022,.008,.8,false);}
  if(P.lie){b.position.y-=.17;head.rotation.x=P.chin?.3:.12;head.position.y-=P.chin?.07:.02;if(P.chin)head.position.z+=.03;}
  root.scale.setScalar(KM*.98);return{root,b,legs,tail:null,head,type:'capybara',phase:Math.random()*6,top:{x:0,y:.16,z:-.04,w:.24}};}
const CAPY_REAL=[['real','Real, game style',{}],['s_smile','Sleepy: smile and blush',{eyes:'sleepy',tilt:.15,drop:.04,blush:1,mouth:'smile'}],['s_yawn','Sleepy: yawning',{eyes:'sleepy',tilt:-.05,mouth:'yawn'}],['s_tilt','Sleepy: head tilted',{eyes:'sleepy',tilt:.12,drop:.03,roll:.3}],['s_chin','Sleepy: lying, chin down',{lie:1,eyes:'sleepy',chin:1}],['r_happy','Real: happy',{eyes:'happy',mouth:'open',blush:1}],['r_sleepy','Real: sleepy',{eyes:'sleepy',tilt:.2,drop:.06}],['r_lie','Real: lying down',{lie:1,eyes:'sleepy'}],['r_curious','Real: curious',{tilt:-.25,eye:1.1,ear:1.6,mouth:'o'}]];
CAPY_PIC.splice(1,0,...CAPY_REAL);
{const P=PU['age:capybara'],B=P.build;Object.assign(P,{at:AT26L,vat:Object.assign({},P.vat,{real:AT24L,r_happy:AT24L,r_sleepy:AT26L,r_lie:AT24L,r_curious:AT24L,s_smile:AT26L,s_yawn:AT26L,s_tilt:AT26L,s_chin:AT26L}),
  chg:'From your note "Sleepy is best, more variations like this": four new sleepy versions (smile and blush, yawning, head tilted, lying with chin down); sleepy itself has new closed-eye lids. Also on all real versions: longer muzzle, bigger ears.',
  opts:[PU_OPT.pick('v','Version',CAPY_PIC.map(([k,n])=>[k,n])),AGE_OPT,PU_OPT.col(['#df9656','#c98a52','#b07848','#d9a06a'])],
  build(g,o){const RV=CAPY_REAL.find(x=>x[0]===o.v);if(RV){g.add(puAge(capyReal2(o.c&&o.c!=='#df9656'?o.c:'#b8784a',RV[2]),o.age||'adult').root);return;}B.call(this,g,o);}});}
/* ---------- round 28 (30 Oct): one real-proportion monkey; the kinds (monkeys and lemurs) are colour types on the same model ---------- */
const AT28L=1793390000000;
/* real proportions (small monkey / lemur, scaled up to pet size like the other pets): head-body about 0.42 m, tail about 1.1x head-body,
   stands on all fours: shoulder about 0.55 of head-body, hips a little higher, arms and legs about the same length,
   round head about a quarter of head-body, flat face, short muzzle, eyes forward, round ears on the sides.
   Game style on top: head 1.5x real, big shiny eyes, soft round parts with ink outlines.
   Movement: each leg is one group pivoting at the shoulder or hip, straight down to the ground (the game swings them);
   the tail is one group at the rump; the head is one group on the neck. Only colours change between kinds. */
const MONKEYS=[
 ['capuchin','Brown capuchin',{fur:'#6b4a33',chest:'#caa47c',limb:'#4e3627',hand:'#3a2a22',face:'#f0c9a5',muzzle:'#f6dcc0',nose:'#5a3a2e',cap:'#3a2a22',ear:'#e0b48e',tail:'#4e3627'}],
 ['whiteface','White-faced capuchin',{fur:'#2e2a30',chest:'#f3ead8',limb:'#2e2a30',hand:'#2e2a30',face:'#f2b8a6',ruff:'#f3ead8',muzzle:'#f6cbbb',nose:'#7a4a44',cap:'#2e2a30',ear:'#f3ead8',tail:'#2e2a30'}],
 ['squirrel','Squirrel monkey',{fur:'#8f8d63',chest:'#f2dcae',limb:'#e8a43c',hand:'#e8a43c',face:'#f8f2e8',muzzle:'#2e2a33',nose:'#141018',cap:'#5d5a4a',ear:'#f8f2e8',tail:'#8f8d63',tip:'#2e2a33'}],
 ['vervet','Vervet monkey',{fur:'#9c9a78',chest:'#f1ece0',limb:'#8a886c',hand:'#2e2a33',face:'#2e2a33',ruff:'#f1ece0',muzzle:'#3a3540',nose:'#141018',ear:'#2e2a33',tail:'#8a886c',tip:'#2e2a33',iris:'#c8862e'}],
 ['spider','Golden spider monkey',{fur:'#c98a4a',chest:'#ecc590',limb:'#b07440',hand:'#3a2a2a',face:'#3a2a2a',patch:'#f2d5bb',muzzle:'#f2d5bb',nose:'#3a2a2a',cap:'#8a5a32',ear:'#3a2a2a',tail:'#b07440'}],
 ['ringtail','Ring-tailed lemur',{fur:'#a39c9c',chest:'#f4f1ec',limb:'#b4b0b8',hand:'#4a4550',face:'#f4f1ec',patch:'#2b2730',muzzle:'#2b2730',nose:'#141018',cap:'#6e6a74',ear:'#f4f1ec',tail:'#f4f1ec',ring:'#2b2730',tip:'#2b2730',iris:'#f0a030'}],
 ['redruffed','Red ruffed lemur',{fur:'#a8321f',chest:'#2b2730',limb:'#2b2730',hand:'#2b2730',face:'#2b2730',ruff:'#f4f1ec',muzzle:'#2b2730',nose:'#141018',cap:'#2b2730',ear:'#a8321f',tail:'#2b2730',iris:'#e6b830'}],
 ['bwruffed','Black-and-white ruffed lemur',{fur:'#f4f1ec',chest:'#2b2730',limb:'#2b2730',hand:'#2b2730',face:'#2b2730',ruff:'#f4f1ec',muzzle:'#2b2730',nose:'#141018',cap:'#2b2730',ear:'#f4f1ec',tail:'#2b2730',iris:'#e6b830'}],
 ['classic','Classic brown (the old colour)',{fur:'#9a6a43',chest:'#f2d2b0',limb:'#9a6a43',hand:'#f2d2b0',face:'#f2d2b0',muzzle:'#f6dcc0',nose:'#5a3a2e',ear:'#9a6a43',tail:'#9a6a43'}]];
function monkeyReal(K){K=K||MONKEYS[0][2];const F=K.fur,root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const S=(g,r,c,x,y,z,s,o)=>sph(g,r,c,x,y,z,Object.assign({s,ws:20,hs:14},o||{}));
  /* body: a long soft barrel, level back, the rump a touch higher; a lighter belly and chest */
  S(b,1,F,0,.37,-.01,[.135,.13,.3],{rx:.05,ol:.012});
  S(b,1,K.chest,0,.29,0,[.1,.075,.24],{ol:false});S(b,1,K.chest,0,.37,.21,[.095,.1,.075],{rx:-.3,ol:false});
  /* legs: front (arms) then hind; one pivot group each, straight down; hands and feet are soft pads that point forward */
  const LEG=[[-.085,.35,.19,0],[.085,.35,.19,0],[-.078,.375,-.2,1],[.078,.375,-.2,1]];
  for(const[x,y,z,h]of LEG){const p=new THREE.Group();p.position.set(x,y,z);b.add(p);const s=Math.sign(x);
    const pts=h?[[0,.02,0],[0,-.1,.055],[0,-.22,.02],[0,-.335,0]]:[[0,.02,0],[0,-.15,-.012],[0,-.31,.02]];
    const r0=h?.064:.056,r1=h?.042:.041;
    tube(p,pts,r0,r1,F,{seg:14,rad:12,ol:.011,caps:false});
    if(K.limb!==F)tube(p,pts.slice(h?1:1),t=>(h?.062:.052)*(1-t)+.044*t,0,K.limb,{seg:12,rad:12,ol:.011,caps:false});
    S(p,h?.05:.045,K.hand,s*.004,h?-.353:-.328,h?.035:.04,[1,.45,h?1.6:1.35],{ol:.01});legs.push(p);}
  /* neck and head (head 1.5x real size) */
  S(b,.095,F,0,.45,.24,[1,1,1],{ol:false});
  const head=new THREE.Group();head.position.set(0,.55,.33);head.scale.setScalar(1.15);b.add(head);
  S(head,.135,F,0,0,0,[1,.95,.95],{ol:.012});
  if(K.ruff)S(head,.13,K.ruff,0,-.005,.04,[1.05,1.05,.62],{ol:false});
  if(K.cap&&K.cap!==F)S(head,.135,K.cap,0,.06,-.03,[1.03,.72,1],{ol:.01});
  /* face: a flat mask in front, eyes forward on it, a short muzzle below */
  S(head,.1,K.face,0,-.01,.085,[1,1,.5],{ol:false});
  if(K.patch)for(const s of[-1,1])S(head,.045,K.patch,s*.047,.008,.128,[1,1.18,.25],{rz:s*.35,ol:false});
  for(const s of[-1,1]){const ex=s*.05,ey=.012,ez=.124;
    if(K.iris){S(head,.026,K.iris,ex,ey,ez-.003,[1,1,.36],{ol:false});S(head,.016,'#141018',ex,ey,ez+.0005,[1,1.05,.4],{ol:false});}
    else S(head,.03,'#141018',ex,ey,ez,[1,1.05,.5],{ol:false});
    S(head,.0105,'#ffffff',ex-s*.004+.008,ey+.011,ez+.013,[1,1,.5],{ws:8,hs:6,ol:false});S(head,.005,'#ffffff',ex-.009,ey-.01,ez+.014,[1,1,.5],{ws:6,hs:4,ol:false});}
  S(head,.062,K.muzzle,0,-.052,.14,[1.05,.8,1.05],{ol:.009});
  S(head,.017,K.nose||'#141018',0,-.03,.2,[1.5,.8,.6],{ws:10,hs:8,ol:false});
  {const m=new THREE.Mesh(new THREE.TorusGeometry(.02,.0058,6,14,Math.PI),mat(INK));m.position.set(0,-.07,.201);m.rotation.z=Math.PI;head.add(m);}
  /* ears: round, on the sides */
  {const c=new THREE.Color(K.ear),dk=c.r*.3+c.g*.59+c.b*.11<.3,ein=dk?shade(K.ear,.3):shade(K.ear,-.22);for(const s of[-1,1]){S(head,.045,K.ear,s*.132,.025,-.01,[.38,1,1],{ol:.009});S(head,.028,ein,s*.141,.025,-.004,[.3,1,1],{ol:false});}}
  /* tail: one smooth tube from the rump, back and up, curling at the tip; rings and a tip are colour bands on top of it */
  const tail=new THREE.Group();tail.position.set(0,.42,-.29);b.add(tail);
  const TP=[[0,0,0],[0,-.02,-.11],[0,.03,-.22],[0,.15,-.3],[0,.3,-.32],[0,.42,-.27],[0,.47,-.19],[0,.44,-.13],[0,.39,-.15]],TR=t=>.044-.022*t;
  const tm=tube(tail,TP,TR,0,K.tail,{seg:48,rad:12,ol:.01,caps:false});S(tail,TR(0),K.tail,0,0,0,[1,1,1],{ol:false});
  {const cv=new THREE.CatmullRomCurve3(TP.map(p=>new THREE.Vector3(...p))),band=(a,c2)=>{const q=[];for(let i=0;i<=6;i++){const p=cv.getPointAt(a[0]+(a[1]-a[0])*i/6);q.push([p.x,p.y,p.z]);}tube(tail,q,t=>TR(a[0]+(a[1]-a[0])*t)*1.08,0,c2,{seg:10,rad:12,ol:false,caps:false});};
    const tipC=K.tip||K.ring||K.tail;
    if(K.ring){const N=13,a0=.12;for(let i=0;i<N;i++)if(i%2===1)band([a0+(1-a0)*i/N,a0+(1-a0)*(i+1)/N],K.ring);}
    if(tipC!==K.tail)band([.86,1],tipC);
    const e=cv.getPointAt(1);S(tail,TR(1)*1.08,tipC,e.x,e.y,e.z,[1,1,1],{ws:12,hs:8,ol:.01});}
  root.scale.setScalar(1);return{root,b,legs,tail,head,type:'monkey',phase:Math.random()*6,top:{x:0,y:.13,z:-.01,w:.31}};}
PU_PET_TYPES.monkey.cols=MONKEYS.map(m=>m[2].fur);
PU_NEW.monkey=col=>{const M=MONKEYS.find(m=>m[2].fur===col)||MONKEYS[0];return monkeyReal(M[2]);};
{const P=PU['pet:monkey'];Object.assign(P,{v:3,at:AT28L,vbase:AT28L,vat:Object.fromEntries(MONKEYS.map(m=>[m[0],AT28L])),
  note:'one model, real proportions (small monkey or lemur, scaled up to pet size); the kinds are colours only',
  chg:'new monkey from real proportions: stands on all fours, arms and legs about the same length, a round head with a flat face and a short muzzle, round side ears, a long tail that curls at the tip. Each leg swings from the shoulder or hip, so walking looks right. Kinds (only colours change): brown capuchin, white-faced capuchin, squirrel monkey, vervet, golden spider monkey, ring-tailed lemur (ringed tail), red ruffed lemur, black-and-white ruffed lemur, classic brown.',
  opts:[PU_OPT.pick('v','Version',MONKEYS.map(([k,n])=>[k,n])),AGE_OPT],dflt:{v:'capuchin',age:'adult'},
  build(g,o){const M=MONKEYS.find(x=>x[0]===o.v)||MONKEYS[0];g.add(puAge(monkeyReal(M[2]),o.age||'adult').root);}});}
/* ---------- round 29 (30 Oct): sheep cozier and cuter, on real sheep proportions; spider monkey colours closer to the real one ---------- */
const AT29L=1793392000000;
/* real sheep (metres): body 1.1 long, back 0.75 high, legs thin and short under the wool (about 0.42 showing), head about 0.28 long on a short neck,
   ears straight out to the sides, a short tail. Game style on top: a round cloud of wool puffs, head 1.3x real, big shiny eyes,
   a wool fringe on the forehead, rosy cheeks, the nose joined to a little mouth by one line (like the capybara he liked).
   Movement: 4 leg groups pivot at the top (front left, front right, hind left, hind right), head and tail groups. */
function sheep5(col,age){const dark=col==='#3d3550',W=dark?'#4a4658':(col||'#f6f2ec'),F=dark?'#7a6670':'#f3dccf',FD=dark?'#4a3a44':'#e8c6b6',HO=dark?'#1f1a26':'#6a5560',PK='#ffb3c7',
  root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  const A={adult:{s:1,head:1,leg:1},teen:{s:.78,head:1.12,leg:.9},baby:{s:.55,head:1.45,leg:.7,round:1}}[age]||{s:1,head:1,leg:1};
  const LH=.38;
  /* wool: one soft core plus an even cloud of puffs over the top and sides (none underneath) */
  const CX=.29,CY=.27,CZ=.47,CYc=.64;sph(b,1,W,0,CYc,0,{s:[CX,CY,CZ],ws:22,hs:16,ol:.014});
  {const N=64;for(let i=0;i<N;i++){const y=1-2*(i+.5)/N;if(y<-.42)continue;const r=Math.sqrt(1-y*y),a=i*2.399963;const d=[Math.cos(a)*r,y,Math.sin(a)*r];
    sph(b,.13+.025*((i*7)%3)/2,W,d[0]*CX*1.02,CYc+d[1]*CY*1.02,d[2]*CZ*1.02,{ws:12,hs:9,ol:.012});}}   /* round 41: more wool (his note "more wool"): more and bigger puffs, a little further out */
  /* legs: thin, straight, a wool "trouser" puff at the top, dark hooves */
  for(const[x,z]of[[-.15,.3],[.15,.3],[-.15,-.3],[.15,-.3]]){const p=new THREE.Group();p.position.set(x,LH,z);b.add(p);
    tube(p,[[0,.04,0],[0,-.17,0],[0,-LH+.05,.005]],.064,.056,F,{seg:8,rad:12,ol:.011,caps:false});
    sph(p,.064,HO,0,-LH+.042,.012,{s:[1,.68,1.12],ws:12,hs:8,ol:.01});
    sph(p,.15,W,0,.0,0,{s:[1,1.1,1],ws:12,hs:9,ol:.011});legs.push(p);}
  /* neck: a wool collar */
  for(const[x,y,z,r]of[[0,.76,.42,.16],[-.1,.7,.44,.12],[.1,.7,.44,.12],[0,.86,.45,.12]])sph(b,r,W,x,y,z,{ws:14,hs:10,ol:.012});
  /* head: a soft long face, tilted a little down, eyes big on the front-sides */
  const head=new THREE.Group();head.position.set(0,.86,.58);head.rotation.x=.14;head.scale.setScalar(1.28);b.add(head);
  sph(head,.12,F,0,0,0,{s:[1,1,1.05],ws:18,hs:14,ol:.012});
  tube(head,[[0,-.01,.02],[0,-.04,.1],[0,-.065,.155]],.1,.08,F,{seg:10,rad:16,ol:.012,caps:false});sph(head,.08,F,0,-.065,.155,{s:[1,.92,.9],ws:16,hs:12,ol:.012});
  /* nose and mouth: a soft nose pad, one line down, a small "w" mouth */
  const nz=.23;sph(head,.022,FD,0,-.045,nz,{s:[1.5,.8,.5],ws:12,hs:8,ol:false});
  box(head,.006,.03,.006,INK,0,-.072,nz-.003,{center:true,ol:false});
  for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.TorusGeometry(.013,.004,6,12,Math.PI),mat(INK));m.position.set(s*.013,-.087,nz-.006);m.rotation.z=Math.PI;head.add(m);}
  for(const s of[-1,1]){const e=new THREE.Group();e.position.set(s*.072,.03,.092);e.rotation.y=s*.38;head.add(e);
    sph(e,.046,'#141018',0,0,0,{s:[1,1.08,.55],ws:16,hs:12,ol:false});sph(e,.017,'#ffffff',s*.012,.018,.02,{ws:8,hs:6,ol:false});sph(e,.008,'#ffffff',-.01,-.015,.023,{ws:6,hs:4,ol:false});
    const bl=new THREE.Group();bl.position.set(s*.088,-.04,.11);bl.rotation.y=s*.75;head.add(bl);sph(bl,.036,dark?'#e07a96':'#ff9fb2',0,0,0,{s:[1,.65,.25],ws:10,hs:6,ol:false});
  /* ears: out to the sides, drooping a little, pink inside */
    const ea=new THREE.Group();ea.position.set(s*.105,.075,-.055);ea.rotation.z=s*-.35;ea.rotation.y=s*-.25;head.add(ea);
    sph(ea,.06,F,s*.05,0,0,{s:[1.35,.42,.75],ws:12,hs:8,ol:.009});sph(ea,.042,PK,s*.058,.016,.012,{s:[1.3,.28,.6],ws:10,hs:6,ol:false});}
  /* wool fringe on top of the head */
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;sph(head,.05,W,Math.cos(a)*.06,.11+Math.sin(a)*.012,Math.sin(a)*.05-.03,{ws:10,hs:8,ol:.009});}
  sph(head,.06,W,0,.13,-.02,{ws:10,hs:8,ol:.009});sph(head,.042,W,0,.1,.07,{ws:10,hs:8,ol:.009});
  /* tail: a short wool puff hanging at the back */
  const tail=new THREE.Group();tail.position.set(0,.66,-.56);b.add(tail);sph(tail,.075,W,0,-.05,-.03,{s:[1,1.25,1],ws:12,hs:9,ol:.011});
  if(A.s!==1){if(A.round){b.scale.z=.88;b.scale.x=1.06;}head.scale.multiplyScalar(A.head);for(const l of legs)l.scale.y*=A.leg;b.position.y-=LH*(1-A.leg);root.scale.setScalar(A.s);}
  return{root,b,legs,head,tail,type:'sheep',phase:Math.random()*6,top:{x:0,y:.16,z:-.01,w:.26}};}
{const _fa=farmAnimal;farmAnimal=function(type,col,age){if(type==='sheep')return sheep5(col,age);return _fa(type,col,age);};}
{const P=PU['farm:sheep'];Object.assign(P,{v:3,at:AT29L,
  note:'real size: body about 1.1 m, back about 0.75 m high; lamb and teen under Age',
  chg:'from your note "make it cozier, cuter": real sheep size and shape (it was too small), a round cloud of wool, a soft long face with big shiny eyes, rosy cheeks, a wool fringe, ears out to the sides with pink insides, the nose joined to a little mouth by one line, thin legs with wool trousers and dark hooves. Lamb and teen kept.'});}
/* spider monkey: real Geoffroy's colours: golden body, black hands, feet and lower legs, a dark face with pale eye rings and muzzle */
{const M=MONKEYS.find(m=>m[0]==='spider');Object.assign(M[2],{fur:'#d29a52',chest:'#f0d29e',limb:'#2e2626',hand:'#2e2626',face:'#3a2a2a',patch:'#f2d5bb',muzzle:'#f2d5bb',nose:'#3a2a2a',cap:undefined,ear:'#3a2a2a',tail:'#d29a52',tip:'#2e2626'});
  PU_PET_TYPES.monkey.cols=MONKEYS.map(m=>m[2].fur);
  const P=PU['pet:monkey'];P.at=AT29L;P.chg='Golden spider monkey (your redo): real Geoffroy\'s spider monkey colours: golden body and tail, black hands, feet, lower legs and tail tip, a dark face with pale eye rings and muzzle, dark cap. Other kinds unchanged.';P.vat=Object.assign({},P.vat,{spider:AT29L});}
/* ---------- round 30 (30 Oct): the farm dog is a St. Bernard, asleep curled up like his photo ---------- */
const AT30L=1793393000000;
/* real St. Bernard (metres): about 0.75 m at the shoulder, about 1.3 m nose to rump, very heavy and broad, big head with a short deep muzzle,
   droopy jowls and big hanging ears. Coat: white with red-brown patches (back, rump, sides of the head), a dark mask round the eyes and ears,
   a white blaze up the face, white muzzle, collar, chest, legs, paws and tail tip.
   Pose from his photo: lying curled in a C, back rounded away, hind legs tucked along the side, one front leg stretched forward,
   chin resting low on the ground by that paw, eyes shut, the tail curled round the front. Game style: soft round parts, ink outlines. */
function stBernardSleep(){const W='#f6f1e8',R='#8f4a24',RD='#a65c2e',M='#33190f',g=new THREE.Group(),s0=new THREE.Group();g.add(s0);
  const S=(p,r,c,x,y,z,s,o)=>sph(p,r,c,x,y,z,Object.assign({s:s||[1,1,1],ws:20,hs:14},o||{}));
  /* body: one curled tube (chest at the front, rump curling toward us), red-brown on top, white underneath */
  tube(s0,[[.26,.25,.0],[.02,.27,-.12],[-.2,.25,-.05],[-.28,.23,.14]],t=>.25-.02*Math.sin(t*Math.PI),0,R,{seg:20,rad:18,ol:.014,caps:false});
  S(s0,.25,R,.26,.25,.0);S(s0,.24,R,-.28,.23,.14,[1,.98,1]);S(s0,.21,R,-.3,.3,.04,[1.05,.9,1],{ol:.012});S(s0,.13,W,.16,.44,-.06,[1.3,.45,1.1],{rz:-.2,ol:false});
  S(s0,.2,W,.34,.19,.1,[1,1.05,.95],{ol:.012});S(s0,.15,W,.06,.13,.12,[1.4,.6,.8],{ol:false});
  /* white collar round the neck */
  S(s0,.17,W,.43,.21,.1,[.7,1,.9],{ol:.012});
  /* hind legs: a big thigh lying on the ground on our side, the lower leg folded forward, white paw */
  S(s0,.19,R,-.16,.18,.3,[1.2,.85,.9],{ol:.012});
  tube(s0,[[-.12,.1,.38],[.04,.07,.43],[.16,.06,.42]],.085,.07,W,{seg:10,rad:12,ol:.011,caps:false});S(s0,.078,W,.2,.055,.42,[1.25,.7,1],{ol:.01});
  for(const k of[0,1,2])S(s0,.012,'#cdbfae',.255,.055,.4+k*.02,[1,1,1],{ws:6,hs:4,ol:false});
  /* front legs: one stretched forward under the chin, one folded under the chest */
  tube(s0,[[.38,.12,.16],[.58,.07,.2],[.76,.06,.22]],.075,.065,W,{seg:10,rad:12,ol:.011,caps:false});S(s0,.075,W,.79,.055,.22,[1.25,.7,1],{ol:.01});
  S(s0,.07,W,.6,.06,-.06,[1.3,.7,1],{ol:.01});
  /* tail: thick and red-brown, curled round the front along the ground, a white tip */
  tube(s0,[[-.46,.2,.18],[-.44,.1,.4],[-.25,.07,.56],[.05,.06,.6],[.3,.06,.55]],t=>.075-.025*t,0,R,{seg:24,rad:12,ol:.011,caps:false});
  S(s0,.055,W,.32,.06,.545,[1.4,1,1],{ol:.01});
  /* head: big and broad, resting low on the ground by the stretched paw, turned a little toward us, eyes shut */
  const h=new THREE.Group();h.position.set(.6,.27,.08);h.rotation.set(.12,-.4,-.15);h.scale.setScalar(1.55);s0.add(h);
  S(h,.16,R,0,.02,0,[1.1,.95,1.08],{ol:.013});
  /* white blaze up the middle of the face, onto the forehead */
  S(h,.07,W,.1,.09,0,[1.2,.8,.7],{ol:false});
  /* dark mask round the eyes */
  for(const s of[-1,1])S(h,.066,M,.105,.05,s*.08,[.85,.8,1],{ol:false});
  /* muzzle: short, deep and square, white, with heavy jowls hanging down the sides */
  S(h,.11,W,.15,-.045,0,[.9,.95,1.12],{ol:.012});for(const s of[-1,1]){S(h,.08,W,.17,-.11,s*.07,[.95,1.1,.85],{ol:.01});S(h,.04,W,.2,-.17,s*.05,[1,.8,1],{ol:false});}
  S(h,.05,'#2a1c22',.25,.0,0,[.7,.75,1.4],{ws:12,hs:10,ol:false});S(h,.012,'#ffffff',.27,.025,-.025,[1,1,1],{ws:6,hs:4,ol:false});
  box(h,.006,.07,.006,INK,.252,-.055,0,{center:true,ol:false});
  /* eyes shut: two soft arcs on the dark mask */
  for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.TorusGeometry(.032,.01,6,12,Math.PI),mat('#f6f1e8'));e.position.set(.165,.06,s*.085);e.rotation.set(0,Math.PI/2+s*.35,Math.PI);h.add(e);}
  /* ears: big, soft, hanging down the sides, dark */
  for(const s of[-1,1]){const ea=new THREE.Group();ea.position.set(-.06,.04,s*.155);ea.rotation.x=s*.2;h.add(ea);S(ea,.115,RD,0,-.11,0,[.85,1.45,.35],{ol:.012});}
  s0.scale.setScalar(KM);
  {const z=signPlane('z z Z',.5,.2,'#eef0ff','#5a5f8c');z.position.set(.9*KM,.9*KM,.1);g.add(z);}
  return g;}
sleepyLab=stBernardSleep;
{const P=PU['farm:lab'];Object.assign(P,{name:'Farm dog: sleeping St. Bernard',v:4,at:AT30L,note:'real size: about 1.3 m nose to rump; sleeps curled up by the farm buildings',
  chg:'from your note and photo: now a St. Bernard (white with red-brown patches, a dark mask, a white blaze and muzzle, big hanging ears, heavy jowls), asleep curled up like your photo: back rounded, hind legs tucked along the side, one front leg stretched forward, chin down by that paw, eyes shut, the tail curled round the front. Real size.',
  build(g){g.add(stBernardSleep());}});}
/* ---------- round 31 (30 Oct): golden spider monkey dropped (his decision: "drop it"); 8 monkey kinds stay ---------- */
{const i=MONKEYS.findIndex(m=>m[0]==='spider');if(i>=0)MONKEYS.splice(i,1);PU_PET_TYPES.monkey.cols=MONKEYS.map(m=>m[2].fur);
  const P=PU['pet:monkey'];const vat=Object.assign({},P.vat);delete vat.spider;
  Object.assign(P,{vat,opts:[PU_OPT.pick('v','Version',MONKEYS.map(([k,n])=>[k,n])),AGE_OPT],
    chg:'golden spider monkey dropped (your decision). 8 kinds stay: brown capuchin, white-faced capuchin, squirrel monkey, vervet, ring-tailed lemur, red ruffed lemur, black-and-white ruffed lemur, classic brown.'});}
/* ---------- round 32 (30 Oct): farm animals have only babies and adults; babies stay babies (his decision) ---------- */
/* his rule: farm animals come as a baby or an adult, no teen, and a baby never grows up (it is its own animal).
   New babies: calf, piglet, chick. Horse and sheep keep their foal and lamb; their Teen button goes (the teen code stays, unused). */
const AT32L=1793395000000;
const FARM_AGE_OPT=PU_OPT.pick('age','Age',[['baby','Baby'],['adult','Adult']]);
/* a farm baby made from the adult: smaller, a bigger head, shorter legs, a rounder body, then put back on the ground */
function farmBaby(m,A){if(m.head)m.head.scale.multiplyScalar(A.head);for(const l of m.legs||[])l.scale.y*=A.leg;m.b.scale.x*=A.round;m.b.scale.z/=Math.sqrt(A.round);
  m.root.scale.multiplyScalar(A.s);m.root.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m.root);m.b.position.y-=bb.min.y/m.root.scale.y;return m;}
const FARM_BABY={cow:{s:.5,head:1.4,leg:.75,round:1.08},pig:{s:.5,head:1.35,leg:.8,round:1.12}};
/* the chick: not a small hen; a round fluffy ball with a tiny beak and stubby legs, no comb (real chicks: about 8 cm, game size bigger) */
function chick(col){const C=col==='#a8714a'?'#d9a868':col==='#e8b765'?'#ffd36b':'#ffe27a',D=shade(C,-.12),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.11,C,0,.15,0,{s:[1,.95,1.08],ws:18,hs:14,ol:.01});for(const s of[-1,1])sph(b,.045,D,s*.1,.15,-.01,{s:[.35,.75,1.1],ws:10,hs:8,ol:.008});
  for(const x of[-.035,.035]){const p=new THREE.Group();p.position.set(x,.06,0);b.add(p);box(p,.014,.05,.014,'#ffa53a',0,-.05,0,{ol:.006});box(p,.04,.01,.045,'#ffa53a',0,-.058,.012,{ol:.006});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,.27,.04);b.add(head);sph(head,.075,C,0,0,0,{ws:16,hs:12,ol:.009});
  cone(head,.018,.04,'#ffa53a',0,-.01,.08,{rx:Math.PI/2,center:true,seg:6,ol:.006});
  for(const s of[-1,1]){sph(head,.016,'#141018',s*.034,.015,.06,{s:[1,1.1,.6],ws:10,hs:8,ol:false});sph(head,.006,'#ffffff',s*.034+.004,.022,.068,{ws:6,hs:4,ol:false});}
  for(const r of[-.3,0,.3])sph(head,.018,C,r*.06,.075,-.01,{s:[.5,1.4,.5],rz:r*1.5,ws:8,hs:6,ol:.005});
  const tail=new THREE.Group();tail.position.set(0,.17,-.11);b.add(tail);sph(tail,.03,D,0,0,0,{ws:8,hs:6,ol:.006});
  root.scale.setScalar(.8);return{root,b,legs,head,tail,type:'chicken',phase:Math.random()*6};}
{const _fa=farmAnimal;farmAnimal=function(type,col,age){if(age!=='baby'||!['cow','pig','chicken'].includes(type))return _fa(type,col,age);
  if(type==='chicken')return chick(col);return farmBaby(_fa(type,col,'adult'),FARM_BABY[type]);};}
for(const k of['cow','pig','chicken']){const P=PU['farm:'+k];Object.assign(P,{opts:[FARM_AGE_OPT,...(P.opts||[]).filter(o=>o.k!=='age')],dflt:Object.assign({},P.dflt,{age:'adult'}),
  at:AT32L,chg:{cow:'new: a baby calf (Age: Baby): small, a bigger head, shorter legs, rounder. It stays a baby. The adult cow is unchanged.',pig:'new: a baby piglet (Age: Baby): small, a bigger head, shorter legs, rounder. It stays a baby. The adult pig is unchanged.',chicken:'new: a baby chick (Age: Baby): a round fluffy yellow ball (light brown for the brown hen) with a tiny beak, no comb. It stays a baby. The adult hen is unchanged.'}[k],
  build(g,o){g.add(farmAnimal(k,o.c,o.age||'adult').root);}});}
for(const k of['horse','sheep']){const P=PU['farm:'+k];P.opts=(P.opts||[]).map(o=>o.k==='age'?FARM_AGE_OPT:o);}
/* ---------- round 33 (30 Oct): the veterinarian: 4 vets to choose from (Pet update 2: the vet examines sick pets) ---------- */
const AT33L=1793397000000;
/* the game's own people (makePerson) dressed as vets: scrubs or a white coat, a stethoscope round the neck, a name badge, something in the hand */
function makeVet(V){const p=makePerson(Object.assign({nohat:true},V.look)),b=p.b,W='#f7f6f1';
  if(V.coat){   /* white coat: white top and sleeves come from the look; the coat hangs below the waist, open at the front over the scrubs */
    box(b,.47,.34,.03,'#ffffff',0,.27,-.135,{ol:.012});for(const s of[-1,1])box(b,.18,.34,.03,W,s*.145,.27,.135,{ol:.012});
    box(b,.12,.5,.012,V.look.bottom,0,.6,.133,{ol:false});   /* the scrubs showing in the open front */
    for(const s of[-1,1])box(b,.07,.28,.012,shade(W,-.06),s*.085,.8,.136,{rz:s*-.25,ol:false});   /* lapels */
    for(const s of[-1,1])box(b,.11,.08,.012,shade(W,-.08),s*.14,.42,.15,{ol:false});}   /* pockets */
  if(V.paws)for(const [x,y] of[[-.13,.75],[.12,.92],[.14,.68],[-.1,.98]]){sph(b,.022,V.paws,x,y,.135,{s:[1,1,.3],ws:8,hs:6,ol:false});for(const [dx,dy] of[[-.022,.025],[0,.034],[.022,.025]])sph(b,.009,V.paws,x+dx,y+dy,.135,{s:[1,1,.3],ws:6,hs:4,ol:false});}
  /* stethoscope: round the neck, both ends down the chest, a silver bell */
  tube(b,[[-.13,1.12,.02],[-.15,1.0,.14],[-.07,.86,.15],[0,.82,.15]],.02,.02,'#4a5470',{seg:16,rad:8,ol:.006,caps:false});
  tube(b,[[.13,1.12,.02],[.15,1.0,.14],[.1,.9,.15]],.02,.02,'#4a5470',{seg:12,rad:8,ol:.006,caps:false});
  sph(b,.055,'#c9cdd6',0,.8,.16,{s:[1,1,.45],ws:14,hs:10,ol:.01});sph(b,.032,'#eef0f4',0,.8,.182,{s:[1,1,.3],ws:8,hs:6,ol:false});
  /* name badge with a little red cross */
  {const by=V.coat?.66:.9,bx=V.coat?-.15:-.12;box(b,.14,.09,.014,'#ffffff',bx,by,.14,{ol:.008});box(b,.075,.024,.006,'#e03a3a',bx,by+.033,.149,{ol:false});box(b,.024,.075,.006,'#e03a3a',bx,by+.008,.149,{ol:false});}
  /* in the hand */
  const hand=p.arms[1];if(V.hold)hand.rotation.x=V.hold==='kitten'?-1.05:-.55;
  if(V.hold==='clipboard'){const c=new THREE.Group();c.position.set(-.03,-.5,.05);c.rotation.set(.55,0,.08);c.scale.setScalar(1.7);hand.add(c);box(c,.16,.22,.02,'#a8743f',0,-.11,0,{ol:.008});box(c,.13,.17,.006,'#ffffff',0,-.12,.012,{ol:false});box(c,.06,.025,.03,'#c9cdd6',0,0,0,{ol:.005});for(let i=0;i<3;i++)box(c,.09,.008,.004,'#9aa3b5',0,-.07-i*.035,.016,{ol:false});}
  if(V.hold==='treat'){const c=new THREE.Group();c.position.set(0,-.56,.1);c.rotation.z=.3;c.scale.setScalar(2);hand.add(c);box(c,.11,.03,.03,'#e8c08a',0,0,0,{center:true,ol:.006});for(const s of[-1,1])for(const t of[-1,1])sph(c,.022,'#e8c08a',s*.058,t*.017,0,{ws:8,hs:6,ol:.005});}
  if(V.hold==='bandage'){const c=new THREE.Group();c.position.set(0,-.58,.09);c.rotation.x=Math.PI/2;c.scale.setScalar(1.9);hand.add(c);cyl(c,.045,.045,.06,'#ffffff',0,0,0,{center:true,seg:14,ol:.006});cyl(c,.016,.016,.062,'#e8e2d8',0,0,0,{center:true,seg:8,ol:false});}
  if(V.hold==='kitten'){const c=new THREE.Group();c.position.set(-.06,-.4,.16);c.rotation.x=1.05;c.scale.setScalar(1.7);hand.add(c);sph(c,.07,'#f2b26b',0,0,0,{s:[1,.85,1.1],ws:12,hs:9,ol:.008});const hd=new THREE.Group();hd.position.set(0,.07,.05);c.add(hd);sph(hd,.055,'#f2b26b',0,0,0,{ws:12,hs:9,ol:.008});for(const s of[-1,1]){cone(hd,.022,.04,'#f2b26b',s*.033,.05,0,{seg:4,ol:.005});sph(hd,.008,'#141018',s*.02,.01,.048,{ws:6,hs:4,ol:false});}}
  if(V.pocketPaw){box(b,.15,.07,.012,'#ffffff',0,1.04,.133,{ol:false});box(b,.13,.12,.012,shade(V.look.top,-.12),.12,.86,.135,{ol:.006});sph(b,.032,'#ffffff',.12,.85,.143,{s:[1,1,.3],ws:8,hs:6,ol:false});for(const [dx,dy] of[[-.026,.03],[0,.04],[.026,.03]])sph(b,.013,'#ffffff',.12+dx,.85+dy,.143,{s:[1,1,.3],ws:6,hs:4,ol:false});}
  return p;}
const VETS=[
 ['mila','Dr. Mila (white coat)',{look:{skin:'#f5cfb0',hair:'#7a4a2a',style:'ponytail',top:'#f7f6f1',sleeve:'#f7f6f1',bottom:'#4fb3a6',shoes:'#ffffff',scale:1.06},coat:1,hold:'clipboard'}],
 ['tomas','Dr. Tomas (teal scrubs)',{look:{skin:'#a8724e',hair:'#1f1a26',style:'short',top:'#4fb3a6',sleeve:'#4fb3a6',bottom:'#4fb3a6',shoes:'#3d3550',scale:1.12},hold:'treat',pocketPaw:1}],
 ['ruta','Dr. Rūta (older, round glasses)',{look:{skin:'#f2c9a8',hair:'#d9d4cc',style:'bun',top:'#f7f6f1',sleeve:'#f7f6f1',bottom:'#e88aa8',shoes:'#5a4a6a',glasses:'glasses',glc:'#7a4a6a',scale:1.0},coat:1,hold:'kitten'}],
 ['leo','Vet nurse Leo (paw-print scrubs)',{look:{skin:'#e8b48a',hair:'#c5874a',style:'curly',top:'#a99be0',sleeve:'#a99be0',bottom:'#8a7cc9',shoes:'#ffffff',scale:1.1},paws:'#ffffff',hold:'bandage'}]];
pu('vet:vet',{name:'Veterinarian',stage:7,group:'Pet clinic · people',icon:'🩺',v:1,at:AT33L,vat:Object.fromEntries(VETS.map(v=>[v[0],AT33L])),
  note:'the vet who examines sick pets (Pet update 2). Real person size, the same people style as the townsfolk and farmers.',
  chg:'new: 4 vets to choose from: Dr. Mila (white coat over teal scrubs, clipboard), Dr. Tomas (teal scrubs, a dog treat), Dr. Rūta (older, white coat, round glasses, holding a kitten), vet nurse Leo (lilac scrubs with white paw prints, a bandage roll). All wear a stethoscope and a name badge with a red cross.',
  opts:[PU_OPT.pick('v','Version',VETS.map(([k,n])=>[k,n]))],dflt:{v:'mila'},
  build(g,o){const V=VETS.find(x=>x[0]===o.v)||VETS[0];g.add(makeVet(V[2]).root);}});
/* ---------- round 34 (30 Oct): farm riding people: a riding instructor at the horse jump field (4 to choose from); a cowboy and a cowgirl who ride the horse trail (2 looks each) ---------- */
const AT34L=1793399000000;
/* small dressing helpers on top of the game's own people (makePerson): helmet, tall boots, checked shirt, neck scarf, vest, whistle */
const RIDE={
  helmet(h,c,hair){for(const m of h.children)if(m.isMesh&&m.material&&m.material.color&&hair&&m.material.color.getHexString()===hair.slice(1).toLowerCase()&&m.position.y>=.36)m.visible=false;   /* the hair on top goes under the helmet */
    box(h,.58,.17,.52,c,0,.36,-.01,{ol:.014});sph(h,.27,c,0,.52,-.01,{s:[1.05,.42,.93],ws:20,hs:10,ol:.014});box(h,.4,.025,.1,shade(c,-.18),0,.36,.27,{ol:.008});sph(h,.035,shade(c,.3),0,.64,-.01,{ws:8,hs:6,ol:.008});},
  boots(p,c){for(const hip of p.legs)box(hip,.19,.3,.21,c,0,-.5,0,{ol:.012});},
  checks(b,arms,c){const o={ol:false};for(let i=0;i<4;i++)box(b,.44,.018,.005,c,0,.66+i*.12,.131,o);for(const x of[-.15,-.05,.05,.15])box(b,.018,.5,.005,c,x,.6,.131,o);
    for(const a of arms){for(let i=0;i<3;i++)box(a,.135,.016,.155,c,0,-.36+i*.12,0,{center:true,ol:false});}},
  scarf(b,c){box(b,.3,.07,.28,c,0,1.06,0,{ol:.01});cone(b,.09,.16,c,.06,.98,.14,{rx:Math.PI,seg:3,center:true,ol:.01});},
  vest(b,c,fringe){for(const s of[-1,1])box(b,.15,.46,.27,c,s*.15,.62,0,{ol:.01});box(b,.46,.46,.03,c,0,.62,-.13,{ol:false});
    if(fringe)for(let i=0;i<7;i++)for(const s of[-1,1])box(b,.012,.07,.01,shade(c,-.12),s*(.09+i*.016),.57,.142,{ol:false});},
  whistle(b){tube(b,[[-.13,1.1,.06],[-.05,.9,.14],[0,.82,.145]],.007,.007,'#e04848',{seg:8,rad:5,ol:false,caps:false});tube(b,[[.13,1.1,.06],[.05,.9,.14],[0,.82,.145]],.007,.007,'#e04848',{seg:8,rad:5,ol:false,caps:false});
    box(b,.09,.05,.05,'#c9cdd6',0,.79,.155,{center:true,ol:.008});},
  crop(hand){const c=new THREE.Group();c.position.set(0,-.56,.05);c.rotation.x=1.0;hand.add(c);cyl(c,.03,.02,.6,'#8a5a36',0,0,0,{seg:8,ol:.008});box(c,.06,.08,.014,'#3a2a22',0,.55,0,{center:true,ol:false});},
  clipboard(hand){const c=new THREE.Group();c.position.set(-.03,-.5,.05);c.rotation.set(.55,0,.08);c.scale.setScalar(1.7);hand.add(c);box(c,.16,.22,.02,'#a8743f',0,-.11,0,{ol:.008});box(c,.13,.17,.006,'#ffffff',0,-.12,.012,{ol:false});box(c,.06,.025,.03,'#c9cdd6',0,0,0,{ol:.005});}};
function dressRider(p,D){const b=p.b;if(D.boots)RIDE.boots(p,D.boots);if(D.checks)RIDE.checks(b,p.arms,D.checks);if(D.vest)RIDE.vest(b,D.vest,D.fringe);if(D.scarf)RIDE.scarf(b,D.scarf);if(D.whistle)RIDE.whistle(b);if(D.helmet)RIDE.helmet(p.head,D.helmet,D.look.hair);
  if(D.hold){const hand=p.arms[1];hand.rotation.x=-.55;RIDE[D.hold](hand);}return p;}
const COACHES=[
 ['greta','Coach Greta (red riding jacket)',{look:{skin:'#f5cfb0',hair:'#3d2c2a',style:'ponytail',top:'#c9373f',sleeve:'#c9373f',bottom:'#f3ead8',shoes:'#1f1a26',scale:1.07},helmet:'#1f1a26',boots:'#1f1a26',whistle:1,hold:'crop'}],
 ['marius','Coach Marius (navy polo, clipboard)',{look:{skin:'#d9a07a',hair:'#2a2230',style:'short',top:'#2f4a7a',sleeve:'#2f4a7a',bottom:'#d9c8a0',shoes:'#6a4630',scale:1.13},helmet:'#2f4a7a',boots:'#6a4630',whistle:1,hold:'clipboard'}],
 ['ieva','Coach Ieva (green vest)',{look:{skin:'#f2c9a8',hair:'#c5874a',style:'ponytail',top:'#ffffff',sleeve:'#ffffff',bottom:'#e8dcc4',shoes:'#3a2a22',scale:1.05},helmet:'#7a5ab0',boots:'#3a2a22',vest:'#4f8a5a',whistle:1,hold:'crop'}],
 ['stan','Old coach Stan (tweed vest, flat cap)',{look:{skin:'#e8b48a',hair:'#d9d4cc',style:'short',top:'#f3ead8',sleeve:'#f3ead8',bottom:'#5a4a3f',shoes:'#3a2a22',hat:'cap',hatc:'#7a6040',scale:1.1},boots:'#3a2a22',vest:'#8a6a48',whistle:1,hold:'clipboard'}]];
const COWBOYS=[
 ['cody','Cowboy Cody (red checked shirt, brown horse)',{look:{skin:'#f0c6a0',hair:'#8a5a36',style:'short',top:'#c9373f',sleeve:'#c9373f',bottom:'#4a6aa8',shoes:'#6a4630',hat:'cowboy',hatc:'#9a6a43'},checks:'#ffd6d6',scarf:'#ffd45c',boots:'#6a4630',horse:'#c98f5e'}],
 ['hank','Cowboy Hank (denim shirt, leather vest, black horse)',{look:{skin:'#a8724e',hair:'#1f1a26',style:'short',top:'#5f8fc9',sleeve:'#5f8fc9',bottom:'#5f7fb8',shoes:'#a8743f',hat:'cowboy',hatc:'#2e2a33'},vest:'#6a4630',scarf:'#d94a4a',boots:'#3a2a22',horse:'#3d3550'}]];
const COWGIRLS=[
 ['daisy','Cowgirl Daisy (pink checked shirt, fringe vest, cream horse)',{look:{skin:'#f5cfb0',hair:'#e0b060',style:'pigtails',top:'#ff8fb8',sleeve:'#ff8fb8',bottom:'#4a6aa8',shoes:'#b07a4a',hat:'cowboy',hatc:'#d9b47a'},checks:'#ffe0ee',vest:'#b07a4a',fringe:1,boots:'#ffffff',horse:'#f6efe0'}],
 ['rose','Cowgirl Rose (turquoise shirt, suede vest, dark horse)',{look:{skin:'#c98d63',hair:'#3d2c2a',style:'long',top:'#3fbfb0',sleeve:'#3fbfb0',bottom:'#d9c8a0',shoes:'#7a3a2a',hat:'cowboy',hatc:'#f3ead8'},vest:'#c9a074',scarf:'#ffffff',boots:'#c9373f',horse:'#5c4033'}]];
function mountedRider(D){const m=farmAnimal('horse',D.horse,'adult');const p=riderOn(m,Object.assign({eyes:null},D.look));p.legs.forEach((h,i)=>{const s=i?1:-1;h.position.x=s*.34;h.rotation.z=s*.28;h.rotation.x=-.3;h.scale.y*=1.15;});dressRider(p,Object.assign({},D,{boots:null}));return m;}
const RG='Farm riding · people';
pu('farm:coach',{name:'Riding instructor (horse jump field)',stage:6,group:RG,icon:'🏇',v:1,at:AT34L,vat:Object.fromEntries(COACHES.map(c=>[c[0],AT34L])),
  note:'stands at the horse jump field and teaches riding. Same people style as the farmers.',
  chg:'new: 4 riding instructors to choose from: Coach Greta (black helmet, red riding jacket, white breeches, tall black boots, riding crop), Coach Marius (navy helmet and polo, clipboard), Coach Ieva (lilac helmet, green vest, riding crop), Old coach Stan (flat cap, tweed vest, clipboard). All wear a whistle and riding boots.',
  opts:[PU_OPT.pick('v','Version',COACHES.map(([k,n])=>[k,n]))],dflt:{v:'greta'},
  build(g,o){const C=COACHES.find(x=>x[0]===o.v)||COACHES[0];g.add(dressRider(makePerson(Object.assign({nohat:true},C[2].look)),C[2]).root);}});
for(const [id,nm,L,ic,txt] of[['farm:cowboy','Cowboy (rides the horse trail)',COWBOYS,'🤠','2 looks: Cody (brown hat, red checked shirt, yellow scarf, brown horse) and Hank (black hat, denim shirt, leather vest, red scarf, black horse)'],
  ['farm:cowgirl','Cowgirl (rides the horse trail)',COWGIRLS,'🤠','2 looks: Daisy (tan hat, pink checked shirt, fringe vest, tan boots, cream horse) and Rose (white hat, turquoise shirt, suede vest, tan trousers, dark brown horse)']])
  pu(id,{name:nm,stage:6,group:RG,icon:ic,v:1,at:AT34L,vat:Object.fromEntries(L.map(c=>[c[0],AT34L])),note:'rides round the horse trail now and then, on the horse you kept',
    chg:'new: '+txt+'. Shown riding.',opts:[PU_OPT.pick('v','Version',L.map(([k,n])=>[k,n]))],dflt:{v:L[0][0]},
    build(g,o){const C=L.find(x=>x[0]===o.v)||L[0];g.add(mountedRider(C[2]).root);}});
/* ---------- round 35 (30 Oct): a calmer riding pose for every rider (his note: "the leg spread now is extreme"); Coach Ieva without the riding crop ---------- */
const AT35L=1793401000000;
/* the riding pose, one rule for every rider (horse card "Mounted", cowboys, cowgirls): hips close together on the saddle,
   legs hang down along the horse's sides at a small angle, knees a little forward; the inner side of the leg tucks against the horse */
const RIDE_POSE={x:.28,rz:.2,rx:-.3};
{const _ro=riderOn;riderOn=function(horse,look){const p=_ro(horse,look);p.legs.forEach((h,i)=>{const s=i?1:-1;h.position.x=s*RIDE_POSE.x;h.rotation.z=s*RIDE_POSE.rz;h.rotation.x=RIDE_POSE.rx;h.scale.x*=1.12;h.scale.z*=1.12;});return p;};}
mountedRider=function(D){const m=farmAnimal('horse',D.horse,'adult');const p=riderOn(m,Object.assign({eyes:null},D.look));dressRider(p,Object.assign({},D,{boots:null}));return m;};
{const I=COACHES.find(c=>c[0]==='ieva');delete I[2].hold;I[1]='Coach Ieva (green vest)';}
{const P=PU['farm:coach'];P.at=AT35L;P.vat=Object.assign({},P.vat,{ieva:AT35L});P.chg='Coach Ieva: the riding crop is gone (your note). Others unchanged.';}
for(const id of['farm:cowboy','farm:cowgirl']){const P=PU[id];P.at=AT35L;P.vat=Object.fromEntries(Object.keys(P.vat||{}).map(k=>[k,AT35L]));P.chg='calmer riding pose (your note "the leg spread is extreme"): hips close together on the saddle, legs hang down along the horse\'s sides at a small angle, knees a little forward. Same pose for every rider.';}
/* ---------- round 36 (31 Oct): joints for real moves (Model movements asked, his wish: no mesh bending): cow and chicken get a neck, a head on the neck, two-part legs, a hanging tail; the farm dog can stand, walk and sleep two ways ---------- */
const AT36L=1793403000000;
/* a two-part leg: the upper group pivots at the shoulder or hip, the lower group at the knee or hock (inside the upper one) */
/* a box whose ink outline has no face on the joint side, so two leg parts meet without a line across the leg */
function jbox(g,w,h,d,c,x,y,z,t,open){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y+h/2,z);g.add(m);
  const hg=new THREE.BoxGeometry(w+2*t,h+2*t,d+2*t),idx=hg.index.array,keep=[];for(const gr of hg.groups){if((open==='top'||open==='both')&&gr.materialIndex===2)continue;if((open==='bottom'||open==='both')&&gr.materialIndex===3)continue;for(let k=gr.start;k<gr.start+gr.count;k++)keep.push(idx[k]);}
  hg.setIndex(keep);hg.clearGroups();const hm=new THREE.Mesh(hg,OL);hm.position.copy(m.position);g.add(hm);return m;}
function leg2(parent,x,y,z,up,lo,w,c,foot){const u=new THREE.Group();u.position.set(x,y,z);parent.add(u);jbox(u,w,up,w,c,0,-up,0,.02,'bottom');
  const l=new THREE.Group();l.position.set(0,-up,0);u.add(l);jbox(l,w,lo,w,c,0,-lo,0,.02,'top');sph(l,w*.5,c,0,0,0,{ws:10,hs:8,ol:false});   /* round knee, as wide as the leg: invisible standing, no gap when it bends */if(foot)foot(l,-lo);return {u,l};}
/* COW: the same look as the cow he kept; now the neck pivots at the withers (head down to the grass: neck about 60 degrees down puts the muzzle on the grass
   about one head-length in front of the front hooves), the head pivots at the poll, each leg bends at the knee/hock, the tail hangs from the tailhead */
function cow2(col){const C=col,root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[],lower=[];
  /* EXACTLY the cow he approved (same body, spots, udder, legs, head in the same place); the joints are hidden inside:
     the neck lives inside the body and the head, so it only shows when the cow lowers its head to graze (his rule, 31 Oct) */
  box(b,.6,.55,1.15,C,0,.6,0);for(const [x,z,w,d] of[[-.31,.1,.02,.4],[.31,-.2,.02,.35],[.15,.58,.25,.02]])box(b,w||.2,.25,d||.3,'#3d3550',x,.8,z,{ol:false});
  for(const [x,z] of[[-.2,.42],[.2,.42],[-.2,-.42],[.2,-.42]]){const L=leg2(b,x,.62,z,.31,.31,.15,C,(l,y)=>box(l,.17,.1,.17,'#3d3550',0,y,0,{ol:.015}));legs.push(L.u);lower.push(L.l);}
  sph(b,.13,'#ffb3c7',0,.55,-.2,{s:[1.2,.8,1],ws:10,hs:8,ol:.012});for(const [x,z] of[[-.05,-.15],[.05,-.15],[-.05,-.25],[.05,-.25]])cyl(b,.02,.015,.07,'#ff8fb1',x,.42,z,{seg:5,ol:false});
  /* neck: pivots deep inside the body (0,1.05,.15); at rest it is completely inside the body and the head.
     To graze: slide the neck forward out of the chest (position z +.35, y -.14), turn it down about +1.4 rad, head +.6, front knees a little, body tipped forward .12 */
  const neck=new THREE.Group();neck.position.set(0,1.05,.15);neck.rotation.x=.095;b.add(neck);cowNeckMesh(neck,C);   /* long, but hidden: at rest it lies inside the body and the head; to graze it slides forward out of the chest, then bends */
  /* head: at the end of the neck, exactly where the approved cow's head is */
  const head=new THREE.Group();head.position.set(0,0,.53);head.rotation.x=-.095;neck.add(head);const hc=new THREE.Group();head.add(hc);
  box(hc,.4,.38,.36,C,0,-.05,0);box(hc,.36,.18,.12,'#ffc9d6',0,-.14,.22,{ol:.015});for(const s of[-1,1]){puEye(hc,s*.1,.06,.182);box(hc,.16,.06,.06,C,s*.27,.08,-.05,{ol:.012});cone(hc,.035,.12,'#f6efe0',s*.14,.18,-.05,{rz:s*-.4,seg:6,ol:.012});box(hc,.03,.04,.02,INK,s*.07,-.13,.285,{ol:false});}
  /* tail: the approved tail and tuft, now hanging down from the top of the rump (Model movements asked) */
  const tail=new THREE.Group();tail.position.set(0,1.05,-.6);b.add(tail);box(tail,.05,.55,.05,C,0,-.55,-.02,{ol:.012});sph(tail,.06,'#3d3550',0,-.58,-.02,{ws:8,hs:6,ol:.01});
  return{root,b,legs,lower,neck,head,tail,type:'cow',phase:Math.random()*6,milk:new THREE.Vector3(0,.4,-.2)};}
/* CHICKEN: same look as the hen he kept; a short neck between body and head, legs that bend at the hock, the tail fan joined to the body */
function chicken2(col){const C=col,D=shade(C,-.16),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[],lower=[];
  sph(b,.15,C,0,.24,0,{s:[1,.95,1.25]});for(const s of[-1,1])sph(b,.08,D,s*.13,.25,-.02,{s:[.35,.8,1.2],ws:8,hs:6,ol:.012});
  for(const x of[-.05,.05]){const u=new THREE.Group();u.position.set(x,.14,.0);b.add(u);sph(u,.04,C,0,-.02,0,{s:[1,1.2,1],ws:8,hs:6,ol:.008});box(u,.022,.05,.022,'#ffb347',0,-.07,0,{ol:.008});
    const l=new THREE.Group();l.position.set(0,-.07,0);u.add(l);box(l,.025,.07,.025,'#ffb347',0,-.07,0,{ol:.008});box(l,.07,.015,.08,'#ffb347',0,-.075,.02,{ol:.008});legs.push(u);lower.push(l);}
  /* neck: pivots at the top front of the body */
  const neck=new THREE.Group();neck.position.set(0,.32,.1);b.add(neck);cyl(neck,.05,.065,.15,C,0,0,0,{seg:10,ol:.01});sph(neck,.065,C,0,0,0,{ws:10,hs:8,ol:false});
  const head=new THREE.Group();head.position.set(0,.16,.02);neck.add(head);const hc=new THREE.Group();hc.position.set(0,.0,0);head.add(hc);
  sph(hc,.085,C,0,0,0);cone(hc,.03,.07,'#ffb347',0,-.01,.1,{rx:Math.PI/2,center:true,seg:6,ol:.008});for(let i=0;i<3;i++)sph(hc,.025,'#ff4d4d',0,.085,-.03+i*.03,{ws:6,hs:5,ol:.008});sph(hc,.025,'#ff4d4d',0,-.06,.07,{s:[.6,1,.6],ws:6,hs:5,ol:false});puEye(hc,-.045,.02,.07,.75);puEye(hc,.045,.02,.07,.75);
  /* tail fan: grows out of the back of the body */
  const tail=new THREE.Group();tail.position.set(0,.29,-.16);b.add(tail);sph(tail,.06,C,0,0,0,{s:[.9,1,1],ws:8,hs:6,ol:false});for(const r of[-.35,0,.35])sph(tail,.05,D,r*.12,.06,-.02,{s:[.4,1.4,.8],rz:r,rx:-.4,ws:8,hs:6,ol:.01});
  return{root,b,legs,lower,neck,head,tail,type:'chicken',phase:Math.random()*6};}
{const _fa=farmAnimal;farmAnimal=function(type,col,age){
  if(type==='cow'){const m=cow2(col);m.root.scale.multiplyScalar(1.25);return age==='baby'?farmBaby(m,FARM_BABY.cow):m;}
  if(type==='chicken'&&age!=='baby')return chicken2(col);
  return _fa(type,col,age);};}
/* FARM DOG (St. Bernard): the same head and coat as the sleeping one he kept.
   stand: on four legs (each leg bends: shoulder/hip + elbow/stifle), neck and head groups, tail group: ready to walk.
   side: asleep flat on its side, legs stretched out (the standing dog laid down, eyes shut). curl: asleep curled up (his photo). */
const STB={W:'#f6f1e8',R:'#8f4a24',RD:'#a65c2e',M:'#33190f'};
function stbHead(h,awake){const {W,R,RD,M}=STB,S=(p,r,c,x,y,z,s,o)=>sph(p,r,c,x,y,z,Object.assign({s:s||[1,1,1],ws:20,hs:14},o||{}));
  S(h,.16,R,0,.02,0,[1.1,.95,1.08],{ol:.013});S(h,.07,W,.1,.09,0,[1.2,.8,.7],{ol:false});for(const s of[-1,1])S(h,.066,M,.105,.05,s*.08,[.85,.8,1],{ol:false});
  S(h,.11,W,.15,-.045,0,[.9,.95,1.12],{ol:.012});for(const s of[-1,1]){S(h,.08,W,.17,-.11,s*.07,[.95,1.1,.85],{ol:.01});S(h,.04,W,.2,-.17,s*.05,[1,.8,1],{ol:false});}
  S(h,.05,'#2a1c22',.25,.0,0,[.7,.75,1.4],{ws:12,hs:10,ol:false});S(h,.012,'#ffffff',.27,.025,-.025,[1,1,1],{ws:6,hs:4,ol:false});box(h,.006,.07,.006,INK,.252,-.055,0,{center:true,ol:false});
  for(const s of[-1,1]){if(awake){const e=new THREE.Group();e.position.set(.16,.06,s*.085);e.rotation.y=Math.PI/2+s*.35;h.add(e);S(e,.03,'#141018',0,0,0,[1,1.05,.55],{ol:false});S(e,.011,'#ffffff',.008,.012,.014,[1,1,.5],{ws:8,hs:6,ol:false});}
    else{const e=new THREE.Mesh(new THREE.TorusGeometry(.036,.014,6,12,Math.PI),mat('#f6f1e8'));e.position.set(.172,.062,s*.085);e.rotation.set(0,Math.PI/2+s*.35,Math.PI);h.add(e);}}
  for(const s of[-1,1]){const ea=new THREE.Group();ea.position.set(-.06,.04,s*.155);ea.rotation.x=s*.2;h.add(ea);S(ea,.115,RD,0,-.11,0,[.85,1.45,.35],{ol:.012});}}
function stBernardStand(awake){const {W,R}=STB,root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[],lower=[];const S=(p,r,c,x,y,z,s,o)=>sph(p,r,c,x,y,z,Object.assign({s:s||[1,1,1],ws:20,hs:14},o||{}));
  /* body: about 0.75 m at the shoulder, heavy and broad; red-brown saddle on top, white chest, belly and legs */
  S(b,1,R,0,.6,0,[.22,.22,.48],{ol:.014});S(b,1,W,0,.5,.02,[.18,.14,.38],{ol:false});S(b,.2,W,0,.58,.36,[1,1.05,.9],{ol:.012});S(b,.15,W,0,.74,.38,[1.15,.9,.9],{ol:.012});
  for(const [x,z,f] of[[-.13,.32,1],[.13,.32,1],[-.13,-.32,0],[.13,-.32,0]]){const u=new THREE.Group();u.position.set(x,.52,z);b.add(u);S(u,.12,f?W:R,0,0,0,[1,1.3,1],{ol:.012});
    tube(u,[[0,0,0],[0,-.14,f?.0:.03],[0,-.26,0]],.075,.065,W,{seg:8,rad:12,ol:.011,caps:false});const l=new THREE.Group();l.position.set(0,-.26,0);u.add(l);
    tube(l,[[0,.02,0],[0,-.12,0],[0,-.22,.01]],.065,.06,W,{seg:8,rad:12,ol:.011,caps:false});S(l,.07,W,0,-.235,.035,[1.1,.55,1.3],{ol:.01});legs.push(u);lower.push(l);}
  const neck=new THREE.Group();neck.position.set(0,.7,.42);b.add(neck);S(neck,.15,R,0,.06,.04,[1,1.1,1],{ol:.012});
  const head=new THREE.Group();head.position.set(0,.16,.12);neck.add(head);const hc=new THREE.Group();hc.rotation.y=-Math.PI/2;hc.scale.setScalar(1.3);head.add(hc);stbHead(hc,awake);
  /* tail (his note: the standing tail looked terrible): a real St. Bernard carries it low: from the centre of the rump just under the back line,
     back and down about 35 degrees, a soft upward curl at the end, ending above the hock; round all the way (a chain of soft balls, no flat sides),
     thick at the root, thinner at the tip, the last part white */
  const tail=new THREE.Group();tail.position.set(0,.66,-.45);b.add(tail);
  {const cv=new THREE.CatmullRomCurve3([[0,.01,.02],[0,-.08,-.1],[0,-.16,-.19],[0,-.2,-.26],[0,-.16,-.32]].map(p=>new THREE.Vector3(...p)));const N=48;
   for(let k=0;k<=N;k++){const t=k/N,p=cv.getPointAt(t),r=.088-.03*t;S(tail,r,t>.7?W:R,p.x,p.y,p.z,[1,1,1],{ws:16,hs:12,ol:.01});}}
  root.scale.setScalar(KM);return{root,b,legs,lower,neck,head,tail,type:'farmdog',phase:Math.random()*6};}
function stBernardSide(){const {W,R,RD}=STB,g=new THREE.Group(),s0=new THREE.Group();g.add(s0);const S=(p,r,c,x,y,z,sc,o)=>sph(p,r,c,x,y,z,Object.assign({s:sc||[1,1,1],ws:20,hs:14},o||{}));
  /* asleep flat on its side, built like the curled-up dog he likes (same parts, same colours): the body lies long along the ground,
     the back away from us, the legs stretched out toward us on the ground, the head resting on its cheek, the tail stretched out behind */
  tube(s0,[[.32,.23,0],[.06,.26,-.08],[-.2,.25,-.06],[-.36,.22,.08]],t=>.24-.02*Math.sin(t*Math.PI),0,R,{seg:20,rad:18,ol:.014,caps:false});
  S(s0,.24,R,.32,.23,0);S(s0,.23,R,-.36,.22,.08,[1,.98,1]);S(s0,.2,R,-.38,.29,-.02,[1.05,.9,1],{ol:.012});S(s0,.15,W,.06,.13,.12,[1.4,.6,.8],{ol:false});S(s0,.17,W,.42,.19,.1,[.7,1,.9],{ol:.012});
  /* legs: chunky and softly bent: the front legs stretched forward under the chin, the hind legs reaching forward from a round haunch */
  const L=(pts,paw)=>{tube(s0,pts,.088,.072,W,{seg:12,rad:12,ol:.011,caps:false});S(s0,.066,W,paw[0],paw[1],paw[2],[1.2,.7,1.05],{ol:.01});};
  L([[.4,.12,.16],[.52,.08,.26],[.7,.07,.28]],[.74,.055,.28]);L([[.36,.18,.2],[.46,.14,.34],[.62,.13,.4]],[.66,.12,.41]);
  S(s0,.2,R,-.2,.18,.28,[1.2,.85,.95],{ol:.012});L([[-.14,.1,.36],[.0,.07,.42],[.13,.06,.42]],[.17,.055,.42]);L([[-.12,.18,.32],[.02,.15,.46],[.14,.14,.5]],[.18,.13,.5]);
  /* head: resting on the front paws, eyes shut (the same head pose as the curled-up dog) */
  const h=new THREE.Group();h.position.set(.62,.27,.12);h.rotation.set(.12,-.45,-.12);h.scale.setScalar(1.55);s0.add(h);stbHead(h,false);
  /* tail: lies behind on the ground in a loose curve, white tip (same as the curled-up dog's tail) */
  tube(s0,[[-.5,.21,.1],[-.66,.1,.2],[-.8,.07,.34],[-.88,.06,.5]],t=>.085-.03*t,0,R,{seg:20,rad:12,ol:.011,caps:false});S(s0,.05,W,-.89,.06,.525,[1.05,1,1.3],{ol:.01});
  s0.scale.setScalar(KM);g.updateMatrixWorld(true);{const hb=new THREE.Box3().setFromObject(h);if(hb.min.y<0)h.position.y+=-hb.min.y/KM;}{const bb=new THREE.Box3().setFromObject(g);if(bb.min.y<0)s0.position.y-=bb.min.y;}   /* the head rests ON the ground, never in it */
  const z=signPlane('z z Z',.5,.2,'#eef0ff','#5a5f8c');z.position.set(.75*KM,.75*KM,0);g.add(z);return g;}
{const P=PU['farm:lab'];Object.assign(P,{v:5,at:AT36L,vbase:AT36L,vat:{curl:1793393000000,side:AT36L,stand:AT36L},opts:[PU_OPT.pick('v','Version',[['curl','Asleep, curled up (your photo)'],['side','Asleep, flat on its side'],['stand','Standing (walks between spots)']])],dflt:{v:'curl'},
  note:'the farm dog walks to a spot and sleeps there, curled up or flat on its side; real size about 1.3 m nose to rump',
  chg:'new (your ask, via Model movements): the St. Bernard can now stand and walk (legs bend at shoulder/hip and elbow/stifle, head and tail move) and sleep a second way, flat on its side with its legs stretched out. The curled-up sleep you kept is unchanged.',
  build(g,o){if(o.v==='side'){g.add(stBernardSide());return;}if(o.v==='stand'){g.add(stBernardStand(true).root);return;}g.add(stBernardSleep());}});}
for(const id of['farm:cow','farm:chicken']){const P=PU[id];P.at=AT36L;P.chg=id==='farm:cow'?'joints for real moves (Model movements asked): the neck bends at the withers (head down to the grass), the head at the poll, each leg at the knee/hock; the tail now hangs down. Same look.':'joints for real moves (Model movements asked): a short neck between body and head, legs bend at the hock, the tail fan grows out of the body. Same look.';}
{const P=PU['farm:lab'];P.at=1793413000000;P.vat=Object.assign({},P.vat,{stand:1793413000000,side:1793407000000});P.chg='standing dog: the tail is now made like the curled-up dog\'s tail you like (smooth, thick, white tip), hanging low. Asleep on its side: rebuilt like the curled-up dog: lying long on the ground, legs stretched out, head resting on its cheek, tail stretched out behind.';}   {const P=PU['farm:cow'];P.at=1793409000000;P.chg='back to the cow you approved (your words: neck hidden inside the body, only showing when grazing): same body, legs, head and size; the joints are hidden inside; the tail now hangs down.';P.at=1793411000000;}   /* 31 Oct: dog tail redo */
/* ---------- round 37 (31 Oct): capybara = ONE body (Real, game style) + faces; colours only (his words: "ONLY EXPRESSIONS ARE GOOD. MODEL SHOULD BE ONLY ONE, except colour differences") ---------- */
const AT37L=1793415000000;
/* faces only: eyes, mouth, cheeks, ears and a small head tilt; no body versions, no lying poses (lying is a move, not a model) */
const CAPY_FACES=[['real','Calm',{}],['r_sleepy','Sleepy',{eyes:'sleepy',tilt:.2,drop:.06}],['s_smile','Sleepy smile and blush',{eyes:'sleepy',tilt:.15,drop:.04,blush:1,mouth:'smile'}],
 ['s_yawn','Yawning',{eyes:'sleepy',tilt:-.05,mouth:'yawn'}],['r_happy','Happy',{eyes:'happy',mouth:'open',blush:1}],['r_curious','Curious',{tilt:-.25,eye:1.1,ear:1.6,mouth:'o'}],
 ['zen','Sauna zen (training)',{eyes:'sleepy',mouth:'smile',blush:1,tilt:-.26,zen:1}]];
{const _c=capyReal2;capyReal2=function(col,P){const m=_c(col,P);if(P&&P.zen){/* blissful: chin up, eyes shut, a soft smile, rosy cheeks, three little steam puffs rising over the head */
  const st=new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.78,depthWrite:false});
  for(const [x,y,r] of[[0,.38,.05],[.025,.46,.045],[-.02,.54,.04],[.015,.615,.032],[-.005,.68,.024]]){const p=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),st);p.position.set(x,y,-.02);p.scale.set(1.25,1,1.25);m.head.add(p);}for(const k of[-1,1]){const bl=new THREE.Group();bl.position.set(k*.125,.0,.075);bl.rotation.y=k*1.0;m.head.add(bl);sph(bl,.05,'#ff8a96',0,0,0,{s:[1,.65,.3],ws:12,hs:8,ol:false});}   /* rosy cheeks, clearly on the surface */}return m;};}   /* soft rising steam, see-through */
{const P=PU['age:capybara'];const keep=Object.assign({},P.vat);const vat={};for(const [k] of CAPY_FACES)vat[k]=keep[k]||AT37L;vat.zen=AT37L;
  Object.assign(P,{name:'Capybara',v:8,at:AT37L,vat,
    note:'one capybara (Real, game style); pick the faces to keep; colours below',
    chg:'one body only (your words): the capybara is now the Real game-style body with a face picker (calm, sleepy, sleepy smile, yawning, happy, curious, and a new sauna zen face for its training) and colours. The other body versions and lying poses are gone from the card (lying is a move).',
    opts:[PU_OPT.pick('v','Face',CAPY_FACES.map(([k,n])=>[k,n])),AGE_OPT,PU_OPT.col(['#df9656','#c98a52','#b07848','#d9a06a'])],dflt:{v:'real',age:'adult',c:'#df9656'},
    build(g,o){const F=CAPY_FACES.find(x=>x[0]===o.v)||CAPY_FACES[0];g.add(puAge(capyReal2(o.c&&o.c!=='#df9656'?o.c:'#b8784a',F[2]),o.age||'adult').root);}});}
/* ---------- round 38 (31 Oct): jointed puppy, a movement test (Model movements: stiff block legs keep the moves at ~6/10) ---------- */
const AT38L=1793417000000;
/* the game's own puppy, exactly the same look standing still; inside it now has joints:
   legs[] turn at the shoulder/hip, lower[] bend at the elbow/hock, neck (hidden in the body) and head, ears[] flop, tail wags */
function dogJoint(col){const C=col,D=shade(col,-.14),Lt=shade(col,.1),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[],lower=[],ears=[];
  const eye=(g,x,y,z)=>{box(g,.05,.07,.02,INK,x,y,z,{ol:false});box(g,.018,.022,.01,'#fff',x+.01,y+.04,z+.012,{ol:false});};
  box(b,.32,.26,.5,C,0,.18,0);
  for(const [x,z] of[[-.1,.16],[.1,.16],[-.1,-.16],[.1,-.16]]){const L=leg2(b,x,.2,z,.1,.1,.09,C,null);legs.push(L.u);lower.push(L.l);}
  /* neck: inside the body, at the top front; the head sits exactly where the game's puppy head is */
  const neck=new THREE.Group();neck.position.set(0,.33,.17);b.add(neck);box(neck,.2,.14,.18,C,0,-.09,.02,{ol:false});
  const head=new THREE.Group();head.position.set(0,.03,.1);neck.add(head);
  box(head,.32,.28,.28,C,0,-.04,0);box(head,.17,.12,.13,Lt,0,-.04,.18);box(head,.07,.05,.03,INK,0,.05,.255,{ol:false});eye(head,-.085,.08,.142);eye(head,.085,.08,.142);
  for(const s of[-1,1]){const e=new THREE.Group();e.position.set(s*.17,.15,-.02);head.add(e);box(e,.08,.2,.07,D,s*.02,-.22,0,{rz:-s*.25});ears.push(e);}
  const tail=new THREE.Group();tail.position.set(0,.4,-.25);b.add(tail);box(tail,.06,.2,.06,C,0,0,0,{rx:-.6,ol:.02});
  return{root,b,legs,lower,neck,head,ears,tail,type:'dog',phase:Math.random()*6};}
function dogPose(m,pose){if(pose==='walk'){m.legs[0].rotation.x=.45;m.lower[0].rotation.x=-.6;m.legs[3].rotation.x=.35;m.legs[1].rotation.x=-.3;m.legs[2].rotation.x=-.4;m.lower[2].rotation.x=.55;m.tail.rotation.z=.35;m.ears.forEach(e=>e.rotation.x=-.25);}
  if(pose==='sit'){m.b.rotation.x=-.36;m.legs[0].rotation.x=m.legs[1].rotation.x=.36;m.legs[2].rotation.x=m.legs[3].rotation.x=1.25;m.lower[2].rotation.x=m.lower[3].rotation.x=-2.1;m.neck.rotation.x=.25;m.tail.rotation.x=.9;}   /* rump down on the ground, hind legs folded forward, front legs straight, chest up, head level */
  if(pose==='sniff'){m.neck.rotation.x=.75;m.head.rotation.x=.35;m.legs[0].rotation.x=m.legs[1].rotation.x=.1;m.lower[0].rotation.x=m.lower[1].rotation.x=-.25;m.tail.rotation.x=-.4;m.ears.forEach(e=>e.rotation.x=.12);}
  return m;}
pu('pet:dogjoint',{name:'Puppy: jointed movement test',stage:2,group:'Baby & teen pets',icon:'🐕',v:1,at:AT38L,vat:{stand:AT38L,walk:AT38L,sit:AT38L,sniff:AT38L},
  note:'the same puppy as in the game, now with joints so moves can bend legs, turn the head, flop the ears and wag the tail',
  chg:'new test (Model movements asked): the game puppy, same look standing still, with joints inside: legs bend at the shoulder/hip and again at the elbow/hock, the head turns on a hidden neck, ears flop, tail wags. The poses only show what the joints can do.',
  opts:[PU_OPT.pick('v','Pose',[['stand','Standing (same as today)'],['walk','Mid-step'],['sit','Sitting'],['sniff','Sniffing the ground']]),AGE_OPT,PU_OPT.col(PET_TYPES.dog.cols)],dflt:{v:'stand',age:'baby',c:PET_TYPES.dog.cols[0]},
  build(g,o){const m=dogPose(dogJoint(o.c||PET_TYPES.dog.cols[0]),o.v);m.root.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m.root);if(bb.min.y<0)m.b.position.y-=bb.min.y;g.add(puAge(m,o.age||'adult').root);}});
/* ---------- round 39 (31 Oct): seal: bigger flippers that move on their own (his note: bigger paddles), on the round seal he kept; + 1 variant (spotted harbour seal) ---------- */
const AT39L=1793419000000;
/* the round seal he kept, same body and face; the flippers are now real paddles:
   front flippers (legs[0..1]) turn where they meet the body; the two back flippers (rear[0..1]) are separate parts on the tail, so it can paddle and steer */
{const _mk=makePUPet;makePUPet=function(type,col){const m=_mk(type,col);if(type!=='seal')return m;const T=PU_PET_TYPES.seal,C=col||T.cols[0],D=shade(C,-.18);
  for(const p of m.legs){const s=Math.sign(p.position.x);for(const o of [...p.children])p.remove(o);p.position.set(s*.15,.14,.13);
    sph(p,.12,D,s*.08,-.08,.03,{s:[1.15,.32,.72],ry:s*.45,rz:s*-.25,ws:14,hs:8,ol:.012});}   /* a wide paddle and a round shoulder */
  const t=m.tail;for(const o of [...t.children])t.remove(o);sph(t,.085,C,0,0,0,{s:[1,.62,1.25],ol:.015});const rear=[];
  for(const s of[-1,1]){const f=new THREE.Group();f.position.set(s*.04,-.03,-.08);t.add(f);sph(f,.12,D,s*.05,-.01,-.09,{s:[.85,.22,1.25],ry:s*.45,ws:14,hs:8,ol:.012});rear.push(f);}
  m.rear=rear;return m;};}
/* a spotted harbour seal: the same round seal with soft dark spots and a lighter belly */
function sealSpotted(col,age){const m=puPet('seal',col,age);const C=col||PU_PET_TYPES.seal.cols[0],S=shade(C,-.2);
  /* soft spots lying ON the body (centres on the body's surface, so none stick out of the outline) over the back and sides */
  const N=26;for(let k=0;k<N;k++){const y=1-2*(k+.5)/N;if(y<-.15)continue;const r=Math.sqrt(1-y*y),a=k*2.399963,d=[Math.cos(a)*r,y,Math.sin(a)*r];
    if(d[2]>.45&&Math.abs(d[0])>.45)continue;   /* keep the flipper shoulders clear */
    const n=new THREE.Vector3(d[0]/.17,d[1]/.156,d[2]/.272).normalize(),sp=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),mat(S));
    sp.position.set(d[0]*.17,.17+d[1]*.156,.02+d[2]*.272);sp.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),n);const rr=.022+.012*((k*7)%4)/3;sp.scale.set(rr*(1+.35*((k*3)%3)/2),rr,.006);m.b.add(sp);}   /* flat soft patches lying on the skin, different sizes */
  for(const [x,y,z] of[[.07,.05,.11],[-.08,.08,.1],[.02,.11,.12]]){const sp=new THREE.Mesh(new THREE.SphereGeometry(1,10,6),mat(S));sp.position.set(x,y,z);sp.lookAt(m.head.localToWorld(new THREE.Vector3(x*3,y*3,z*3)));sp.scale.set(.012,.012,.004);m.head.add(sp);}
  return m;}
{const P=PU['pet:seal'],T=PU_PET_TYPES.seal;Object.assign(P,{v:3,at:AT39L,vbase:P.vbase||AT39L,vat:Object.assign({},P.vat,{round:AT39L,spotted:AT39L}),
  chg:'your note (bigger paddles): the round seal you kept now has big front flippers and two separate back flippers, each turning where it meets the body, so it can paddle and steer. New 1 more variant: a spotted harbour seal on the same round body.',
  opts:[PU_OPT.pick('look','Look',[['round','Round (you kept it)'],['spotted','Spotted harbour seal (new)'],['real','Seal-like']]),AGE_OPT,PU_OPT.col(T.cols)],dflt:{look:'round',age:'adult',c:T.cols[0]},
  build(g,o){if(o.look==='spotted'){g.add(sealSpotted(o.c,o.age).root);return;}if(o.look==='round'){g.add(puPet('seal',o.c,o.age,o.outfit).root);return;}g.add(puAge(makeSeal2(o.c),o.age||'adult').root);}});}
/* ---------- round 40 (31 Oct): pug and pomchi you can recognise at a glance (his notes: "more pug plz, need to recognise all models, but keep it cartoon"; "more pomchi like") ---------- */
const AT40L=1793421000000;
const PUP_EYE=(g,x,y,z,r)=>{sph(g,r,'#1d1622',x,y,z,{s:[1,1,.7],ws:14,hs:10,ol:.008});sph(g,r*.36,'#ffffff',x+r*.3,y+r*.35,z+r*.55,{ws:8,hs:6,ol:false});};
/* PUG: stocky square body, big round head with a flat black face mask, tiny squashed nose, forehead wrinkles, big round shiny eyes set wide,
   a pink tongue tip, small black button ears folded forward, a tight double-curled tail on the back */
function pug2(col){const C=col,dark=C==='#4a4058',M=dark?'#2a2433':'#2e2630',root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  lp(b,C,0,.23,0,.17,.13,.21,{p:.45,ws:18,hs:12,mat:mat(C),ol:.014});
  for(const [x,z] of[[-.1,.12],[.1,.12],[-.1,-.12],[.1,-.12]]){const p=new THREE.Group();p.position.set(x,.12,z);b.add(p);box(p,.105,.12,.105,C,0,-.12,0,{ol:.02});sph(p,.06,C,0,-.1,.015,{s:[1,.55,1.15],ws:10,hs:8,ol:.012});legs.push(p);}
  const head=new THREE.Group();head.position.set(0,.36,.22);head.scale.setScalar(.87);b.add(head);
  sph(head,.19,C,0,0,0,{s:[1.08,.95,.92],ws:20,hs:14,ol:.014});
  sph(head,.14,M,0,-.04,.13,{s:[1.15,.95,.62],ws:18,hs:12,ol:false});   /* the flat black face mask */
  sph(head,.042,'#0d0b12',0,0,.205,{s:[1.35,.85,.75],ws:14,hs:10,ol:.008});sph(head,.011,'#ffffff',-.02,.017,.233,{ws:8,hs:6,ol:false});   /* a big shiny button nose sitting on the mask (round 41: was hidden under the mask) */
  box(head,.011,.032,.006,'#c4a3b4',0,-.064,.218,{ol:false});for(const s of[-1,1]){const a=new THREE.Mesh(new THREE.TorusGeometry(.024,.0068,6,12,Math.PI),mat('#c4a3b4'));a.position.set(s*.024,-.06,.219);a.rotation.z=Math.PI;head.add(a);}   /* mouth: a short line down from the nose and a soft smile on each side, light so it shows on the black mask */
  for(const s of[-1,1])sph(head,.055,M,s*.05,-.07,.16,{s:[1,.75,.6],ws:12,hs:8,ol:false});   /* jowls */
  sph(head,.022,'#ff7a9a',.01,-.098,.21,{s:[1,.6,.6],ws:8,hs:6,ol:false});   /* tongue tip, now in front of the mask */
  for(const s of[-1,1])PUP_EYE(head,s*.085,.06,.15,.042);   /* eyes above the mask edge, so they show from the side */
  for(const s of[-1,1]){const e=new THREE.Group();e.position.set(s*.12,.15,.0);head.add(e);cone(e,.06,.09,M,s*.02,0,.02,{seg:3,rx:1.9,rz:s*.4,center:true,ol:.01});}   /* small folded ears, tips flopping forward */
  const tail=new THREE.Group();tail.position.set(0,.33,-.2);tail.scale.setScalar(1.25);b.add(tail);for(const [r,t] of[[.05,0],[.03,.6]]){const c=new THREE.Mesh(new THREE.TorusGeometry(r,.018,8,16,Math.PI*1.8),mat(C));c.position.set(0,.04+t*.03,0);c.rotation.x=Math.PI/2;c.rotation.z=t*2;tail.add(c);}
  return{root,b,legs,head,tail,type:'pug',phase:Math.random()*6};}
/* POMCHI: a fluffy little ball of fur, a fluffy neck ruff, big upright pointy ears with pink insides (chihuahua), a short fox muzzle,
   big shiny eyes, tiny legs, and a big plume tail curled over the back */
function pomchi2(col){const C=col,Lt=shade(C,.12),D=shade(C,-.15),root=new THREE.Group(),b=new THREE.Group();root.add(b);const legs=[];
  sph(b,.16,C,0,.21,0,{s:[1,.9,1.2],ws:18,hs:12,ol:.014});
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2;sph(b,.06,i%2?C:Lt,Math.cos(a)*.15,.22+Math.sin(i*1.7)*.05,Math.sin(a)*.18,{ws:10,hs:8,ol:.008});}   /* fluffy fur */
  for(const [x,z] of[[-.07,.09],[.07,.09],[-.07,-.09],[.07,-.09]]){const p=new THREE.Group();p.position.set(x,.09,z);b.add(p);box(p,.06,.08,.06,C,0,-.08,0,{ol:.015});sph(p,.042,Lt,0,-.07,.01,{s:[1,.7,1.15],ws:10,hs:8,ol:.008});legs.push(p);}
  for(const s of[-1,1])for(let i=0;i<4;i++)sph(b,.08,Lt,s*.12,.15,-.15+i*.1,{s:[.8,.7,1],ws:12,hs:8,ol:.008});   /* a few soft tufts along the sides */
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2;sph(b,.06,Lt,Math.cos(a)*.11,.29+Math.sin(a)*.045,.11+Math.sin(a)*.02,{ws:10,hs:8,ol:.008});}   /* neck ruff */
  const head=new THREE.Group();head.position.set(0,.44,.17);b.add(head);
  sph(head,.14,C,0,0,0,{ws:18,hs:12,ol:.013});sph(head,.07,Lt,0,-.04,.11,{s:[1,.85,1.15],ws:14,hs:10,ol:.01});sph(head,.02,'#141018',0,-.02,.19,{s:[1.3,1,.8],ws:8,hs:6,ol:false});
  {const m=new THREE.Mesh(new THREE.TorusGeometry(.016,.004,6,12,Math.PI),mat(INK));m.position.set(0,-.07,.175);m.rotation.z=Math.PI;head.add(m);}
  for(const s of[-1,1])PUP_EYE(head,s*.06,.03,.115,.032);
  for(const s of[-1,1]){const e=new THREE.Group();e.position.set(s*.08,.1,-.01);e.rotation.z=s*-.3;head.add(e);cone(e,.065,.17,C,0,0,0,{seg:4,ol:.012});cone(e,.035,.11,'#ffb3c7',0,.01,.025,{seg:4,ol:false});}
  const tail=new THREE.Group();tail.position.set(0,.34,-.17);tail.scale.setScalar(1.15);b.add(tail);
  sph(tail,.1,Lt,0,.08,-.02,{s:[.9,1.2,1.1],rx:.5,ws:16,hs:12,ol:.012});sph(tail,.085,Lt,0,.17,.06,{s:[.9,1,1.2],rx:1.1,ws:16,hs:12,ol:.012});sph(tail,.06,C,0,.18,.15,{s:[.9,.9,1.2],ws:12,hs:8,ol:.01});   /* one fat plume curled over the back */   /* plume curled over the back */
  return{root,b,legs,head,tail,type:'pomchi',phase:Math.random()*6};}
for(const [id,fn,today] of[['age:pug',pug2,'Today (game)'],['age:pomchi',pomchi2,'Today (game)']]){const P=PU[id],B=P.build,k=id.split(':')[1];
  Object.assign(P,{v:(P.v||1)+1,at:AT40L,vat:{game:P.at||AT40L,new:AT40L},
    chg:k==='pug'?'new pug you can recognise (your note "more pug"): flat black face mask, squashed nose, wrinkles, big round eyes, tongue tip, small black folded ears, tight curly tail. Still cartoon.':'new pomchi (your note "more pomchi like"): a fluffy ball of fur with a neck ruff, big upright chihuahua ears with pink insides, a short fox muzzle, big eyes and a plume tail curled over the back.',
    opts:[PU_OPT.pick('v','Version',[['new','New, easy to recognise'],['game',today]]),AGE_OPT,PU_OPT.col(PET_TYPES[k].cols)],dflt:Object.assign({},P.dflt,{v:'new'}),
    build(g,o){if(o.v==='game'){B.call(this,g,o);return;}g.add(puAge(fn(o.c||PET_TYPES[k].cols[0]),o.age||'baby').root);}});}
/* ---------- round 41 (31 Oct): pug face (his note: no rings above the nose, show a nose and a mouth); cow neck rounder (Model movements asked) ---------- */
const AT41L=1793423000000;
/* cow neck: a round, tapered neck (about 0.22 m thick at the body, 0.32 m wide at the head) instead of the flat box.
   At rest it still hides completely inside the body and the head: it bends a little (low inside the body, higher inside the head),
   so the approved cow looks exactly the same. Pivot, slide and graze recipe are unchanged. */
function cowNeckGeo(t){const g=new THREE.CylinderGeometry(1,1,1,24,12,false);g.rotateX(Math.PI/2);const p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);const zz=-.30+(z+.5)*.72,r0=.10+.04*(zz+.3)/.72,h0=.65*r0;
    p.setXYZ(i,x*(r0+t),y*(h0+t)-.086+.32*zz,zz+(z>.499?t:z<-.499?-t:0));}   /* a straight oval tube, tilted up toward the head so it hides in the body at the back and in the head at the front */
  g.computeVertexNormals();return g;}
function cowNeckMesh(neck,C){const m=new THREE.Mesh(cowNeckGeo(0),mat(C));neck.add(m);const h=new THREE.Mesh(cowNeckGeo(.015),OL);neck.add(h);return m;}
{const P=PU['age:pug'];P.at=AT41L;P.vat=Object.assign({},P.vat,{new:AT41L});
 P.chg='pug face fixed (your note): the rings above the nose are gone; a big shiny button nose and a small mouth with the tongue tip now show on the black mask. Everything else is the same.';}
{const P=PU['farm:sheep'];P.at=AT41L;P.chg='more wool (your note): more and bigger wool puffs, a fluffier cloud, fuller wool trousers. Face, legs and size stay.';}
/* 31 Oct: pug face + cow neck */
/* ---------- round 42 (31 Oct): poses other chats asked for: sheep neck hidden in the wool (Model movements), bear sitting and dogs/cats lying (Pet Shop: bear on the sofa watching TV), snake coil and path (open terrarium) ---------- */
const AT42L=1793425000000;
/* SHEEP: like the cow, a neck that lives inside the wool. At rest the sheep looks exactly the same (the head is only re-hung on the neck).
   To graze: slide the neck forward (position z +), turn it down (rotation.x +), tip the head a little (head.rotation.x +). */
{const _s5=sheep5;sheep5=function(col,age){const m=_s5(col,age);const W=col==='#3d3550'?'#4a4658':(col||'#f6f2ec');
  m.root.updateMatrixWorld(true);const neck=new THREE.Group();neck.position.set(0,.8,.3);m.b.add(neck);neck.updateMatrixWorld(true);neck.attach(m.head);
  const hp=m.head.position.clone(),len=hp.length(),t=new THREE.Group();t.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),hp.clone().normalize());neck.add(t);
  const g=new THREE.CylinderGeometry(.045,.055,len*.8+.3,18);g.rotateX(Math.PI/2);g.translate(0,0,len*.4-.15);t.add(new THREE.Mesh(g,mat(W)));
  for(let z=-.28,i=0;z<len*.78;z+=.06,i++)sph(t,(.066+.008*(i%2))*(1-.25*Math.max(0,z)/len),W,(i%3-1)*.01,(i%2)*.008,z,{ws:12,hs:9,ol:.011});   /* a woolly neck: soft puffs along it, like the body */
  m.neck=neck;return m;};}
/* POSES for any four-legged pet {root,b,legs[4],head}: petPose(m,'sit') = sits on its bottom, front paws down (bear on the sofa);
   petPose(m,'lie') = lies on its belly, front paws forward (dogs, cats on beds and sofas). Call once on a fresh model.
   The legs get hip joints (m.hips) at the top of each leg, so Model movements can turn them. The model is moved so its lowest point is on the floor (y 0). */
function petPose(m,pose){m.root.updateMatrixWorld(true);const b=m.b,inv=new THREE.Matrix4().copy(b.matrixWorld).invert();
  const hips=m.legs.map(l=>{const bb=new THREE.Box3().setFromObject(l);const top=new THREE.Vector3((bb.min.x+bb.max.x)/2,bb.max.y-.04*(bb.max.y-bb.min.y),(bb.min.z+bb.max.z)/2).applyMatrix4(inv);
    const hp=new THREE.Group();hp.position.copy(top);b.add(hp);hp.updateMatrixWorld(true);hp.attach(l);return hp;});
  m.hips=hips;const front=hips.map(h=>h.position.z>0);
  if(pose==='sit'){const rearZ=Math.min(...hips.map(h=>h.position.z)),hipY=hips.find((h,i)=>!front[i]).position.y,a=.95;
    const P=new THREE.Group();P.position.set(0,hipY,rearZ);m.root.add(P);P.updateMatrixWorld(true);P.attach(b);P.rotation.x=-a;m.sitPivot=P;
    hips.forEach((h,i)=>{h.rotation.x=front[i]?a-.25:a-Math.PI/2-.05;if(!front[i])h.rotation.z=(h.position.x<0?1:-1)*.6;});   /* hind legs forward and a little apart, like a teddy */
    if(m.head)m.head.rotation.x+=a*1.05;}
  else if(pose==='lie'){hips.forEach((h,i)=>{h.rotation.x=front[i]?-Math.PI/2+.12:-Math.PI/2+.35;if(!front[i])h.rotation.z=(h.position.x<0?1:-1)*.75;});   /* hind paws tucked out to the sides so the haunches show */
    if(m.tail){m.tail.rotation.x+=1.1;}}   /* tail down and resting, not standing up */
  m.root.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m.root);(m.sitPivot||b).position.y-=(bb.min.y-m.root.position.y)/(m.root.scale.y||1);
  return m;}
/* SNAKE: lay the body along any path. pts = points in the snake's own units (x, y, z), head first; start = how far along the path the head is (0 = at pts[0]).
   Model movements slides 'start' to make it slither (in over the terrarium lip, out again). snakeCoil(m) = sleeping coil, head resting on top. */
function snakeAlong(m,pts,start=0){const P=pts.map(p=>new THREE.Vector3(...p));const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+P[i].distanceTo(P[i-1]));
  const at=s=>{s=Math.max(0,Math.min(L[L.length-1]-1e-4,s));let i=1;while(L[i]<s)i++;const k=(s-L[i-1])/(L[i]-L[i-1]);return{p:P[i-1].clone().lerp(P[i],k),d:P[i].clone().sub(P[i-1]).normalize()};};
  const place=(o,s,y0)=>{const q=at(s);o.position.set(q.p.x,q.p.y+y0,q.p.z);o.rotation.set(0,Math.atan2(-q.d.x,-q.d.z),0);};
  if(m.head)place(m.head,start,.06);let s=start+.09;m.segs.forEach((g,i)=>{const r0=g.userData.r0??(g.userData.r0=g.position.y);if(i)s+=Math.min(.055,1.55*r0);place(g,s,r0);});return m;}   /* thin tail beads sit closer, so they touch */
function snakeCoil(m){const pts=[],N=m.segs.length,total=.09+N*.055+.1;let s=0,r=.06,th=0,prev=null;
  while(s<total+.05){const y=.13*Math.max(0,1-(r-.06)/.13);const p=[Math.sin(th)*r,y,Math.cos(th)*r];if(prev)s+=Math.hypot(p[0]-prev[0],p[1]-prev[1],p[2]-prev[2]);pts.push(p);prev=p;th+=.12;r+=.0022;}   /* about two rings, the inner ring and the head lie on top */
  return snakeAlong(m,pts,0);}
/* the card: the poses, for Karolis to see */
pu('pet:poses',{name:'Pet poses: bear sits, dogs and cats lie, snake sleeps',group:'New pets',icon:'🛋️',stage:4,at:AT42L,
  vat:{bear_sit:AT42L,dog_lie:AT42L,cat_lie:AT42L,snake_coil:AT42L},
  chg:'new poses other chats asked for: the bear sits on its bottom (to watch TV on the Pet Shop sofa), dogs and cats lie down on beds and sofas, the snake sleeps coiled up in its terrarium. Same models, only posed.',
  opts:[PU_OPT.pick('v','Pose',[['bear_sit','Bear sitting (sofa, TV)'],['dog_lie','Puppy lying down'],['cat_lie','Kitten lying down'],['snake_coil','Snake asleep, coiled up']])],dflt:{v:'bear_sit'},
  build(g,o){const v=o.v||'bear_sit';
    if(v==='bear_sit'){g.add(petPose(puPet('bear',null,'adult'),'sit').root);return;}
    if(v==='dog_lie'){g.add(petPose(puPet('dog',null,'adult'),'lie').root);return;}
    if(v==='cat_lie'){g.add(petPose(puPet('cat',null,'adult'),'lie').root);return;}
    g.add(snakeCoil(puPet('snake',null,'adult')).root);}});
/* 31 Oct: round 42 poses */
/* ---------- round 43 (31 Oct): joints for tricks (Plan / Model movements): duck and owl wings flap, the snake's tongue flicks. Looks unchanged. ---------- */
/* duck and owl: each wing (and its outline) is hung on a shoulder joint at the top of the wing: m.wings[0] left, [1] right; flap = rotation.z (left +, right -) */
{const _mp=makePet;makePet=function(type,col){const m=_mp(type,col);if(type!=='duck'&&type!=='owl')return m;
  const W=type==='duck'?{x:.16,y:.24,h:.12}:{x:.19,y:.14,h:.28};m.root.updateMatrixWorld(true);m.wings=[];
  for(const s of[-1,1]){const parts=m.b.children.filter(c=>c.isMesh&&Math.abs(c.position.x-s*W.x)<.006&&Math.abs(c.position.y-(W.y+W.h/2))<.006);
    const j=new THREE.Group();j.position.set(s*W.x,W.y+W.h*.92,-.01);m.b.add(j);j.updateMatrixWorld(true);for(const p of parts)j.attach(p);m.wings.push(j);}
  return m;};}
/* snake: the tongue (and its fork) is one group m.tongue, hinged at the back of the mouth; flick = scale.z 0..1 (0 = hidden inside the mouth) */
{const _sn=PU_NEW.snake;PU_NEW.snake=col=>{const m=_sn(col);m.root.updateMatrixWorld(true);
  const parts=m.head.children.filter(c=>c.isMesh&&c.material&&c.material.color&&c.material.color.getHexString()==='ff4d6d');
  const t=new THREE.Group();t.position.set(0,-.014,.09);m.head.add(t);t.updateMatrixWorld(true);for(const p of parts)t.attach(p);m.tongue=t;return m;};}
/* 31 Oct: round 43 joints */
/* ---------- round 44 (31 Oct): pomchi (today's, the one he kept): the puff tail floated about 9 cm above and behind the rump; now it sits on the rump (Model movements found it) ---------- */
{const _mp=makePet;makePet=function(type,col){const m=_mp(type,col);if(type==='pomchi'&&m.tail&&!m.tail.userData.fixed){m.tail.position.set(0,.28,-.17);m.tail.userData.fixed=1;}return m;};}
/* 31 Oct: round 44 pomchi tail */

/* ---------- round 21 (30 Oct, Non-living things models chat): chicken coop and stable ---------- */
const AT21=1793377700000;
/* stable: Claude's size (9 m, four stalls) with ChatGPT's openness: open front, side walls only half high with open air up to the roof, light inside, hay you can see */
pu('farm:stable',{name:'Stable with stalls',stage:6,group:'Farm Lane · buildings',icon:'🐎',v:2,build(g){const W=9,D=4.4,H=3,C='#d9645a',P='#fff6e4',Wd='#c98f5e',HW=1.35;
  box(g,W+.2,.08,D+.2,'#e3d3ad',0,0,0,{ol:.025});box(g,W-.1,.012,D-.1,'#f2d98a',0,.08,0,{ol:false});
  /* back wall: solid; side walls: half high, a cream cap rail on top, open above */
  box(g,W,H,.2,C,0,.08,-D/2+.1);for(const s of[-1,1]){box(g,.2,HW,D-.2,C,s*(W/2-.1),.08,0);box(g,.28,.08,D-.1,P,s*(W/2-.1),.08+HW,0,{ol:.012});}
  /* posts: front row, the side middles and the back corners carry the roof */
  for(let i=0;i<=4;i++)box(g,.2,H,.2,P,-W/2+.1+i*(W-.2)/4,.08,D/2-.1);for(const s of[-1,1]){box(g,.2,H,.2,P,s*(W/2-.1),.08,-D/2+.1);box(g,.18,H-HW,.18,P,s*(W/2-.1),.08+HW,0,{ol:.012});}
  box(g,W+.2,.22,.24,P,0,H+.08-.22,D/2-.1);for(const s of[-1,1])box(g,.24,.22,D,P,s*(W/2-.1),H+.08-.22,0,{ol:.012});box(g,W+.2,.22,.24,P,0,H+.08-.22,-D/2+.1,{ol:.012});
  /* the roof: two warm slabs with a ridge cap; the gables are open timber triangles (you see in from the ends too) */
  const rh=1.6,a=D/2+.5,th=Math.atan2(rh,a),Ls=Math.hypot(a,rh)+.1,R='#9a6a9c';for(const s of[1,-1])box(g,W+.6,.18,Ls,R,0,H+rh/2-.05,s*a/2,{rx:s*th,center:true,ol:.04});
  box(g,W+.7,.16,.3,shade(R,-.15),0,H+rh+.02,0,{center:true,ol:.02});
  {const under=new THREE.MeshToonMaterial({color:'#e8c9a0',gradientMap:GRAD,side:THREE.DoubleSide});for(const s of[1,-1]){const m=new THREE.Mesh(new THREE.PlaneGeometry(W+.5,Ls-.1),under);m.rotation.x=-Math.PI/2+s*th;m.position.set(0,H+rh/2-.16,s*a/2*.98);g.add(m);}}
  for(const s of[-1,1]){const x=s*(W/2-.1);box(g,.14,.14,D,Wd,x,H+.08,0,{ol:.012});box(g,.14,rh-.1,.14,Wd,x,H+.08,0,{ol:.012});}
  /* four stalls: short partitions, low gates in front, hay rolls and racks, a water trough each */
  for(let i=0;i<4;i++){const x=-W/2+W/4*(i+.5);if(i>0)box(g,.12,1.4,D-.6,Wd,-W/2+W/4*i,.08,-.2,{ol:.015});
    for(const y of[.35,.8])box(g,W/4-.5,.1,.08,Wd,x,y,D/2-.1,{ol:.012});for(const dx of[-.6,0,.6])box(g,.06,.62,.07,Wd,x+dx,.3,D/2-.1,{ol:.01});box(g,W/4-.4,.08,.1,P,x,.95,D/2-.1,{ol:.01});
    cyl(g,.35,.35,.6,'#f2d16b',x+.4,.43,-D/2+.6,{rz:Math.PI/2,center:true,seg:10,ol:.012});box(g,.6,.32,.3,Wd,x-.6,1.1,-D/2+.35,{ol:.012});for(let k=0;k<5;k++)box(g,.04,.06,.2,'#f2d16b',x-.84+k*.12,1.42,-D/2+.35,{ol:false});
    box(g,.7,.3,.32,'#8a85a3',x-.55,.08,-D/2+1.0,{ol:.012});box(g,.62,.02,.24,null,x-.55,.36,-D/2+1.0,{mat:WATER,ol:false});cyl(g,.4,.4,.04,'#ffd982',x+.1,.09,.3,{s:[1.2,1,1],seg:12,ol:false});}
  /* a lantern over the middle */
  cyl(g,.01,.01,.4,'#3d3550',0,H-.32,D/2-.4,{seg:4,ol:false});sph(g,.09,null,0,H-.4,D/2-.4,{mat:toon({color:'#ffd982',emissive:new THREE.Color('#ffb347'),emissiveIntensity:.6}),ol:.008});}});
/* chicken coop: the ramp (the "bridge") is longer and gentler, sits on the door sill and lands flat on the ground with a little foot; the door has a frame and a handle; a real ridge cap on the roof */
pu('farm:coop',{name:'Chicken coop with nesting boxes',stage:6,group:'Farm Lane · buildings',icon:'🐣',v:2,build(g){const C='#ffd6a0',T='#fff6e4';for(const [x,z] of[[-.8,-.6],[.8,-.6],[-.8,.6],[.8,.6]])box(g,.12,.6,.12,W2,x,0,z,{ol:.015});box(g,1.8,1.1,1.4,C,0,.6,0);box(g,1.85,.08,1.45,W1,0,.6,0,{ol:.015});
  for(const s of[1,-1])box(g,2.2,.12,1.1,'#ff8a8a',0,2.0,s*.42,{rx:s*.55,center:true,ol:.03});prism(g,1.76,1.36,.7,C,0,1.7,0,{ol:false});
  {const r=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,2.3,10),mat('#e06a6a'));r.rotation.z=Math.PI/2;r.position.set(0,2.33,0);g.add(r);hull(g,new THREE.CylinderGeometry(.095,.095,2.34,10),r,{});}
  /* the door with a frame, a handle and a sill the ramp hooks onto */
  box(g,.5,.6,.05,T,-.4,.66,.705,{ol:.01});box(g,.4,.5,.06,'#a8714a',-.4,.7,.72,{ol:.012});for(const y of[.82,1.0])box(g,.36,.025,.01,'#8a5a36',-.4,y,.752,{ol:false});sph(g,.025,'#3d3550',-.27,.92,.755,{ws:8,hs:6,ol:false});box(g,.52,.05,.12,W2,-.4,.62,.76,{ol:.01});
  {const h=new THREE.Mesh(new THREE.CircleGeometry(.12,14),mat('#3d2c5e'));h.position.set(.35,1.3,.71);g.add(h);const t=new THREE.Mesh(new THREE.TorusGeometry(.13,.025,6,16),mat(T));t.position.set(.35,1.3,.715);g.add(t);}
  /* the ramp: from the sill (y .67) down to the ground, 1.3 m out, cleats for little feet, a flat foot board at the bottom */
  {const dy=.65,dz=1.3,L=Math.hypot(dy,dz),a=Math.atan2(dy,dz),cz=.8+dz/2,cy=dy/2+.025;const r=new THREE.Group();r.position.set(-.4,cy,cz);r.rotation.x=a;g.add(r);box(r,.42,.05,L,W1,0,0,0,{center:true,ol:.012});for(const s of[-1,1])box(r,.03,.06,L,W2,s*.2,.03,0,{center:true,ol:false});for(let i=0;i<6;i++)box(r,.4,.035,.045,W2,0,.042,-L/2+.14+i*(L-.28)/5,{center:true,ol:false});
    }
  /* nesting boxes: a tidy row on the side with a sloped lid, each with straw and an egg */
  box(g,.44,.42,1.36,W1,1.12,.68,0,{ol:.015});{const l=new THREE.Group();l.position.set(1.16,1.14,0);l.rotation.z=-.2;g.add(l);box(l,.5,.06,1.46,'#ff8a8a',0,0,0,{center:true,ol:.012});}
  for(let i=0;i<3;i++){const z=-.45+i*.45;box(g,.02,.3,.36,'#3d2c5e',1.345,.72,z,{ol:false});box(g,.02,.08,.38,T,1.35,.7,z,{ol:false});sph(g,.06,'#f2d16b',1.3,.82,z,{s:[1,.5,1.6],ws:8,hs:6,ol:false});sph(g,.055,'#fff6e6',1.31,.87,z,{s:[.8,1,.8],ws:8,hs:6,ol:.008});}}});
PU['farm:stable'].at=AT21;PU['farm:coop'].at=AT21;
Object.assign(PU['farm:stable'],{chg:'kept your size (9 m, four stalls), now as open as version 2: open front, side walls only half high with open air up to the roof, open gable ends, light inside with hay and water you can see.'});
Object.assign(PU['farm:coop'],{chg:'the bridge (chicken ramp): longer and gentler, hooked on the door sill, lands flat on the ground; door with a frame and handle; a real ridge on the roof; tidier nesting boxes.'});


/* ---------- vet clinic (30 Oct, Non-living things models chat), round 2: one bigger cat-ear clinic, two floors, purple and violet with butter yellow ---------- */
/* a paw print on a flat plate, facing +z */
function pawSign(g,x,y,z,s,c,bg){const p=new THREE.Group();p.position.set(x,y,z);p.scale.setScalar(s);g.add(p);
  if(bg){const d=new THREE.Mesh(new THREE.CircleGeometry(.5,28),mat(bg));p.add(d);const r=new THREE.Mesh(new THREE.TorusGeometry(.5,.04,6,28),OL);p.add(r);}
  const pad=new THREE.Mesh(new THREE.CircleGeometry(.17,20),mat(c));pad.scale.set(1.15,.95,1);pad.position.set(0,-.1,.01);p.add(pad);
  for(const [tx,ty] of[[-.24,.1],[-.09,.24],[.09,.24],[.24,.1]]){const t=new THREE.Mesh(new THREE.CircleGeometry(.075,16),mat(c));t.scale.set(.9,1.15,1);t.position.set(tx,ty,.01);p.add(t);}
  return p;}
/* one colour set for the whole clinic: lavender walls, violet and deep purple, butter yellow as the second colour */
const VT={wall:'#efe6ff',acc:'#8a5fd6',deep:'#5a3d9a',pale:'#d9c8ff',sun:'#ffd86b',floor:'#d8cdea',wood:'#b79cff'};
function vetTable(g,t=VT){const S='#d8d0ea';box(g,1.3,.06,.7,S,0,.86,0,{ol:.012});rbox(g,1.1,.05,.55,.02,t.sun,0,.94,0,{ol:.008});
  for(const x of[-.5,.5])for(const z of[-.25,.25])cyl(g,.035,.035,.86,t.deep,x,0,z,{seg:8,ol:.008});box(g,1.1,.04,.5,t.pale,0,.25,0,{ol:.008});
  box(g,.5,.28,.4,t.acc,.95,0,.1,{ol:.01});box(g,.5,.05,.4,t.sun,.95,.28,.1,{ol:false});
  cyl(g,.025,.025,1.1,t.deep,-.62,.9,-.3,{seg:6,ol:.006});cyl(g,.02,.02,.45,t.deep,-.45,1.98,-.3,{rz:-1.2,center:true,seg:6,ol:.006});
  const sh=new THREE.Mesh(new THREE.ConeGeometry(.14,.14,14,1,true),mat(t.acc));sh.material.side=THREE.DoubleSide;sh.position.set(-.25,1.82,-.3);g.add(sh);sph(g,.06,null,-.25,1.77,-.3,{mat:toon({color:'#fff6d6',emissive:new THREE.Color('#ffe9a8'),emissiveIntensity:.6}),ol:false});}
function vetScale(g,t=VT){box(g,.8,.08,.6,t.pale,0,0,0,{ol:.01});rbox(g,.7,.03,.5,.02,t.acc,0,.095,0,{ol:false});pawSign(g,0,.115,0,.5,t.sun).rotation.x=-Math.PI/2;
  cyl(g,.03,.03,.9,t.deep,0,.08,-.26,{seg:6,ol:.006});box(g,.34,.24,.08,t.deep,0,.95,-.26,{ol:.01});
  const sg=signPlane('2.4 kg',.26,.1,'#fff3c4','#5a3d9a');sg.position.set(0,1.02,-.215);g.add(sg);}
function vetShelf(g,t=VT){const W=1.4,H=1.8,D=.36;box(g,W,H,.04,t.pale,0,0,-D/2+.02);for(const s of[-1,1])box(g,.04,H,D,t.acc,s*(W/2-.02),0,0,{ol:.01});
  const C=['#ff7aa8','#7cc8ff','#5fd4b0',t.sun,t.acc,'#ffffff'];for(let r=0;r<4;r++){const y=.1+r*.43;box(g,W-.04,.03,D-.02,t.acc,0,y,0,{ol:.006});
    for(let k=0;k<6;k++){const x=-W/2+.16+k*.22,c=C[(k+r)%6];if((k+r)%3===0){box(g,.15,.2,.15,c,x,y+.03,0,{ol:.006});box(g,.15,.06,.152,'#ffffff',x,y+.1,0,{ol:false});}
      else{cyl(g,.05,.05,.17,c,x,y+.03,0,{seg:10,ol:.006});cyl(g,.035,.035,.04,'#ffffff',x,y+.2,0,{seg:10,ol:false});}}}
  box(g,W,.06,D+.02,t.deep,0,H,0,{ol:.01});}
function vetCounter(g,t=VT){rbox(g,2.0,1.0,.6,.08,t.acc,0,.5,0);box(g,2.1,.06,.7,t.sun,0,1.0,0,{ol:.012});pawSign(g,0,.55,.305,.55,t.sun);
  box(g,.4,.28,.03,t.deep,-.55,1.06,-.12,{ol:.008});box(g,.36,.24,.01,null,-.55,1.08,-.104,{mat:toon({color:'#e6dcff',emissive:new THREE.Color('#b79cff'),emissiveIntensity:.35}),ol:false});box(g,.06,.06,.04,t.deep,-.55,1.0,-.12,{ol:false});
  cyl(g,.06,.07,.02,t.sun,.5,1.03,.1,{seg:12,ol:.006});sph(g,.055,t.sun,.5,1.06,.1,{s:[1,.8,1],ws:10,hs:6,ol:.006});
  cyl(g,.09,.09,.18,null,.2,1.03,.05,{mat:toon({color:'#efe6ff',transparent:true,opacity:.6}),seg:12,ol:.006});for(let i=0;i<5;i++)sph(g,.03,'#c48a5a',.2+Math.cos(i*1.3)*.04,1.07+(i%2)*.04,.05+Math.sin(i*1.3)*.04,{ws:6,hs:4,ol:false});}
function vetBench(g,t=VT){for(let i=0;i<3;i++){const x=-.6+i*.6;rbox(g,.5,.1,.48,.04,t.acc,x,.48,0,{ol:.01});rbox(g,.5,.5,.08,.04,t.acc,x,.78,-.22,{ol:.01});}
  box(g,1.8,.06,.45,t.deep,0,.38,0,{ol:.008});box(g,1.8,.1,.06,t.deep,0,.65,-.24,{ol:.008});for(const x of[-.8,.8])for(const z of[-.18,.18])cyl(g,.03,.03,.38,t.deep,x,0,z,{seg:6,ol:.006});
  for(const x of[-.6,.6])sph(g,.11,t.sun,x,.62,-.05,{s:[1,.6,1],ws:10,hs:6,ol:.006});}
pu('vet:table',{name:'Exam table',stage:7,group:'Pet clinic · inside',icon:'🩺',v:2,build(g){vetTable(g);}});
pu('vet:scale',{name:'Pet scale',stage:7,group:'Pet clinic · inside',icon:'⚖️',v:2,build(g){vetScale(g);}});
pu('vet:shelf',{name:'Medicine shelf',stage:7,group:'Pet clinic · inside',icon:'💊',v:2,build(g){vetShelf(g);}});
pu('vet:counter',{name:'Front desk',stage:7,group:'Pet clinic · inside',icon:'🛎️',v:2,build(g){vetCounter(g);}});
pu('vet:bench',{name:'Waiting seats',stage:7,group:'Pet clinic · inside',icon:'🪑',v:2,build(g){vetBench(g);}});

/* a big low exam platform for big pets (bear, seal, big dogs): wide, padded, with a ramp */
function vetBigTable(g,t=VT){rbox(g,2.6,.42,1.5,.1,t.acc,0,.21,0);rbox(g,2.4,.08,1.3,.04,t.sun,0,.46,0,{ol:.01});
  {const RL=1.6,L=Math.hypot(RL,.46),a=Math.atan2(.46,RL);const p=new THREE.Group();p.position.set(1.3+RL/2,.25,0);p.rotation.z=-a;g.add(p);box(p,L,.1,1.1,t.acc,0,0,0,{center:true,ol:.012});for(const s of[-1,1])box(p,L,.14,.06,t.deep,0,.06,s*.55,{center:true,ol:.008});for(let i=0;i<5;i++)box(p,.06,.03,1.0,t.sun,-L/2+.25+i*.3,.065,0,{center:true,ol:false});}
  cyl(g,.05,.06,1.9,t.deep,-1.1,.5,-.6,{seg:8,ol:.008});cyl(g,.18,.2,.05,t.deep,-1.1,.46,-.6,{seg:12,ol:.006});cyl(g,.02,.02,.6,t.deep,-.85,2.38,-.6,{rz:-1.2,center:true,seg:6,ol:.006});
  const sh=new THREE.Mesh(new THREE.ConeGeometry(.18,.16,14,1,true),mat(t.acc));sh.material.side=THREE.DoubleSide;sh.position.set(-.55,2.2,-.6);g.add(sh);sph(g,.07,null,-.55,2.14,-.6,{mat:toon({color:'#fff6d6',emissive:new THREE.Color('#ffe9a8'),emissiveIntensity:.6}),ol:false});}
/* the staff corner: a round coffee table, four comfy seats, mugs and a plate of cookies */
function vetCoffee(g,t=VT){cyl(g,.65,.65,.06,t.sun,0,.5,0,{seg:24,ol:.012});cyl(g,.08,.12,.5,t.deep,0,0,0,{seg:10,ol:.008});cyl(g,.3,.3,.04,t.deep,0,0,0,{seg:16,ol:.006});
  for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4,x=Math.cos(a)*1.0,z=Math.sin(a)*1.0,p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=-a-Math.PI/2;p.scale.setScalar(.8);g.add(p);
    rbox(p,.62,.4,.6,.12,t.acc,0,.2,0);rbox(p,.62,.5,.16,.08,t.acc,0,.6,-.26);rbox(p,.5,.08,.46,.04,t.pale,0,.43,.04,{ol:false});
    const m=new THREE.Group();m.position.set(Math.cos(a)*.35,.56,Math.sin(a)*.35);g.add(m);cyl(m,.05,.045,.1,['#ffffff',t.acc,'#ff9ec4','#7cc8ff'][k],0,0,0,{seg:10,ol:.005});cyl(m,.042,.042,.01,'#7a4a2e',0,.09,0,{seg:10,ol:false});}
  cyl(g,.16,.16,.02,'#ffffff',0,.56,0,{seg:14,ol:.005});for(let i=0;i<4;i++)cyl(g,.045,.045,.02,'#d39a68',Math.cos(i*1.6)*.08,.58,Math.sin(i*1.6)*.08,{seg:10,ol:false});}
/* the little treat the nurse gives: a bone-shaped biscuit */
function vetTreat(g,t=VT){const C='#f0c27a';cyl(g,.022,.022,.12,C,0,.03,0,{rz:Math.PI/2,center:true,seg:12,ol:.004});for(const s of[-1,1])for(const u of[-1,1])sph(g,.028,C,s*.06,.03,u*.02,{ws:12,hs:10,ol:.004});}
pu('vet:bigtable',{name:'Big-pet exam platform',stage:7,group:'Pet clinic · inside',icon:'🐻',v:2,build(g){vetBigTable(g);}});
pu('vet:coffee',{name:'Staff coffee table',stage:7,group:'Pet clinic · inside',icon:'☕',v:2,build(g){vetCoffee(g);}});
pu('vet:treat',{name:'Pet treat (from the nurse)',stage:7,group:'Pet clinic · inside',icon:'🦴',v:2,carry:true,build(g){vetTreat(g);}});
/* the inside, two floors, open at the front and right like a dollhouse: floor 1 = lobby, floor 2 = two vet rooms */
pu('vet:room',{name:'Vet clinic inside (2 floors)',stage:7,group:'Pet clinic · inside',icon:'🏥',v:2,build(g){const t=VT,W=11,D=8,FH=3.1,H=2*FH;
  const put=(f,x,y,z,ry)=>{const p=new THREE.Group();p.position.set(x,y,z);p.rotation.y=ry||0;g.add(p);f(p,t);};
  /* floor 1 */box(g,W,.08,D,t.floor,0,0,0,{ol:.015});for(let i=0;i<7;i++)box(g,W-.02,.005,.02,shade(t.floor,-.06),0,.08,-D/2+(i+.5)*D/7,{ol:false});
  box(g,W,H,.18,t.wall,0,.08,-D/2+.09);box(g,.18,H,D,t.wall,-W/2+.09,.08,0);for(const y of[.08,FH+.2])box(g,W,.14,.2,t.acc,0,y,-D/2+.18,{ol:false});
  /* the lobby: front desk, waiting seats, a pet-food shelf, a big paw rug, plants, the paw sign */
  put(vetCounter,2.6,.08,.6,Math.PI);put(vetTreat,2.1,1.16,.5);put(vetBench,-1.6,.08,2.4,Math.PI);put(vetBench,-2.4,.08,-1.2,0);put(vetShelf,2.0,.08,-D/2+.4);
  {const r=new THREE.Mesh(new THREE.CircleGeometry(1.1,30),mat(t.sun));r.rotation.x=-Math.PI/2;r.position.set(.2,.09,1.4);g.add(r);pawSign(g,.2,.1,1.4,1.4,t.acc).rotation.x=-Math.PI/2;}
  for(const [x,z] of[[4.8,3.4]]){cyl(g,.26,.2,.55,t.sun,x,.08,z,{seg:12,ol:.01});for(let k=0;k<6;k++){const a=k*1.05;sph(g,.26,k%2?'#5fae5c':'#6fc25a',x+Math.cos(a)*.22,1.0+(k%3)*.1,z+Math.sin(a)*.22,{ws:10,hs:8,ol:.012});}}
  pawSign(g,2.2,2.2,-D/2+.19,1.0,t.acc,t.sun);for(const [x,c,tx] of[[3.9,'#ffffff','Happy pets'],[-4.9,t.sun,'Wash paws']]){const pz=x<0?0:-D/2+.19;}{const pp=signPlane('Happy pets',1.4,.5,t.sun,t.deep);pp.position.set(4.3,2.2,-D/2+.21);g.add(pp);box(g,1.55,.65,.04,t.deep,4.3,1.875,-D/2+.18,{ol:.008});}{const pp=signPlane('Wash paws',1.4,.5,'#ffffff',t.deep);pp.position.set(-3.2,2.0,-D/2+.2);g.add(pp);}put(vetShelf,-.4,.08,-D/2+.4);cyl(g,.4,.34,.4,t.sun,.9,.08,-.2,{seg:14,ol:.01});for(const [dx,dz,c] of[[0,0,'#ff7aa8'],[.12,.1,'#7cc8ff'],[-.1,.12,'#5fd4b0']])sph(g,.1,c,.9+dx,.5,-.2+dz,{ws:8,hs:6,ol:.006});
  /* the stairs along the left wall, from the front of the lobby up toward the back, into an opening in floor 2 */
  const SN=13,SW=1.3,sl=5.4,zf=D/2-.3,sx0=-W/2+.18;for(let i=0;i<SN;i++){const h=(i+1)*FH/SN,z=zf-(i+.5)*sl/SN;box(g,SW,h-.08,sl/SN+.02,t.pale,sx0+SW/2,.08,z,{ol:.012});box(g,SW+.02,.08,sl/SN+.02,i%2?t.sun:t.acc,sx0+SW/2,h,z,{ol:.01});}
  {const L=Math.hypot(sl,FH),a=Math.atan2(FH,sl);const p=new THREE.Group();p.position.set(sx0+SW+.03,.08+FH/2+.9,zf-sl/2);p.rotation.x=-a;g.add(p);box(p,.07,.07,L,t.deep,0,0,0,{center:true,ol:.006});
   for(let i=1;i<SN;i+=2){const z=zf-(i+.5)*sl/SN,h=(i+1)*FH/SN;cyl(g,.025,.025,.9,t.deep,sx0+SW+.03,h+.08,z,{seg:6,ol:false});}}
  /* floor 2 with the stair opening on the left, railings on the open sides and round the opening */
  const y2=FH+.08,hx=sx0+SW+.15,hz=zf-sl-.05;
  box(g,W/2-hx,.2,D,t.floor,(hx+W/2)/2,y2,0,{ol:.015});box(g,hx+W/2,.2,hz+D/2,t.floor,(-W/2+hx)/2,y2,(-D/2+hz)/2,{ol:.012});
  for(let i=0;i<=18;i++){const x=hx+i*(W/2-.06-hx)/18;cyl(g,.03,.03,.95,t.deep,x,y2+.2,D/2-.06,{seg:6,ol:false});}box(g,W/2-hx,.08,.1,t.acc,(hx+W/2)/2,y2+1.15,D/2-.06,{ol:.008});
  for(let i=0;i<=14;i++){const z=-D/2+.3+i*(D-.4)/14;cyl(g,.03,.03,.95,t.deep,W/2-.06,y2+.2,z,{seg:6,ol:false});}box(g,.1,.08,D,t.acc,W/2-.06,y2+1.15,0,{ol:.008});
  for(let i=0;i<=8;i++){const z=hz+.1+i*(D/2-.1-hz-.1)/8;cyl(g,.03,.03,.95,t.deep,hx+.03,y2+.2,z,{seg:6,ol:false});}box(g,.1,.08,D/2-hz,t.acc,hx+.03,y2+1.15,(hz+D/2)/2,{ol:.008});
  /* two vet rooms upstairs, a wall between them with a doorway, a corridor in front */
  box(g,.14,.9,3.0,t.pale,.9,y2+.2,-D/2+1.5+.2,{ol:.012});box(g,.2,.08,3.0,t.acc,.9,y2+1.1,-D/2+1.5+.2,{ol:.008});
  put(vetTable,-1.6,y2+.2,-1.3);put(vetScale,0,y2+.2,-.6);put(vetBigTable,3.0,y2+.2,-2.5,-Math.PI/2);put(vetScale,4.7,y2+.2,-3.0);put(vetCoffee,3.0,y2+.2,2.0);
  
  for(const [x,n,w] of[[-1.6,'Room 1',1.4],[2.3,'Room 2: big pets',2.2]]){box(g,w+.12,.55,.06,t.deep,x,y2+2.3,-D/2+.2,{ol:.01});const sg=signPlane(n,w,.45,t.sun,t.deep);sg.position.set(x,y2+2.57,-D/2+.24);g.add(sg);}
  {cyl(g,.03,.03,.55,t.deep,3.0,y2+.2,3.45,{seg:6,ol:.006});box(g,.9,.36,.05,t.deep,3.0,y2+.75,3.45,{ol:.008});const sg=signPlane('Staff',.8,.3,t.sun,t.deep);sg.position.set(3.0,y2+.93,3.48);g.add(sg);}
  
  put(vetShelf,-3.4,y2+.2,-D/2+.4);
  for(const [x,z] of[[-.6,3.3],[5.0,3.5]]){cyl(g,.22,.17,.45,t.sun,x,y2+.2,z,{seg:12,ol:.01});sph(g,.32,'#5fae5c',x,y2+.95,z,{ws:10,hs:8,ol:.012});}}});
/* the clinic outside: bigger, two floors, cat ears on the roof */
pu('vet:clinic',{name:'Vet clinic (outside)',stage:7,group:'Pet clinic · building',icon:'🏥',v:2,build(g){const t=VT,W=12,D=9,H=6.6;
  building(g,{x:0,z:0,w:W,d:D,h:H,wall:t.wall,trim:t.acc,roof:t.pale,shop:true,awning:t.acc,sign:'Vet clinic',signBg:t.sun,signFg:t.deep,door:{x:0,c:t.acc,glass:true},wf:'#ffffff',skip:(dx,i)=>i===1&&Math.abs(dx)<3.9});
  /* two big cat ears on the roof, pink-violet inside, and a paw board between them */
  for(const s of[-1,1]){const e=new THREE.Group();e.position.set(s*3.7,H+.45,2.2);e.rotation.z=-s*.12;g.add(e);cone(e,1.6,2.5,t.acc,0,0,0,{seg:4,ry:Math.PI/4,ol:.05});cone(e,.9,1.6,'#f2b8e6',0,.25,.95,{seg:4,ry:Math.PI/4,s:[1,1,.2],ol:false});}
  box(g,2.4,1.5,.3,t.sun,0,H+.4,D/2-.25,{ol:.02});pawSign(g,0,H+1.15,D/2-.08,1.1,t.deep);
  /* a soft round window upstairs in the middle, under the sign */
  {const w=new THREE.Mesh(new THREE.CircleGeometry(.6,28),WIN);w.position.set(0,H-1.45,D/2+.04);g.add(w);const r=new THREE.Mesh(new THREE.TorusGeometry(.6,.08,8,30),mat(t.sun));r.position.copy(w.position);g.add(r);const ro=new THREE.Mesh(new THREE.TorusGeometry(.6,.11,8,30),OL);ro.position.copy(w.position);ro.position.z-=.01;g.add(ro);}
  /* a little front step path and two planters */
  box(g,3.4,.08,1.6,t.pale,0,0,D/2+.9,{ol:.012});for(const s of[-1,1]){box(g,.9,.6,.9,t.deep,s*2.6,0,D/2+.8,{ol:.014});sph(g,.5,'#5fae5c',s*2.6,.95,D/2+.8,{ws:10,hs:8,ol:.014});for(let k=0;k<4;k++)sph(g,.1,t.sun,s*2.6+Math.cos(k*1.6)*.35,1.15,D/2+.8+Math.sin(k*1.6)*.35,{ws:6,hs:4,ol:.006});}}});
delete PU['vet:kennel'];delete PU['vet:xray'];
const ATV=1793395754000;
for(const id of['vet:clinic','vet:room','vet:table','vet:scale','vet:shelf','vet:counter','vet:bench','vet:bigtable','vet:coffee','vet:treat'])PU[id].at=ATV;
Object.assign(PU['vet:clinic'],{chg:'bigger, two floors (lobby downstairs, vet rooms upstairs), only the cat-ear version, purple and violet with butter yellow.'});Object.assign(PU['vet:room'],{chg:'two floors: lobby with the front desk and waiting seats, stairs, two two vet rooms upstairs (one for big pets) and a staff corner; purple and violet; no kennels, no X-ray.'});
for(const id of['vet:table','vet:scale','vet:shelf','vet:counter','vet:bench'])PU[id].chg='new colours: purple and violet with butter yellow.';PU['vet:bigtable'].chg='new: a big low exam platform with a ramp, for big pets.';PU['vet:coffee'].chg='new: the staff coffee table with 4 seats.';PU['vet:treat'].chg='new: the treat the nurse gives.';
/* ---------- backyard as one card (30 Oct, Non-living chat): the whole yard behind a Friends Lane house, levels 1-3 ---------- */
/* backyard design pictures: the lot behind a Friends Lane house; pet yard on the left, garden on the right; level 1-3 each */
function buildBackyard(W,petLv,gardenLv){
  const P=(id,opt,x,z,ry,s)=>{const o=new THREE.Group();const M=PU[id];M.build(o,Object.assign({},M.dflt,opt||{}));o.position.set(x,0,z);o.rotation.y=ry||0;if(s)o.scale.setScalar(s);W.add(o);return o;};
  const pet=(k,c,x,z,ry,age)=>{const m=puPet(k,c,age||'adult');m.root.position.set(x,0,z);m.root.rotation.y=ry||0;W.add(m.root);};
  const flat=(w,d,c,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(c));m.rotation.x=-Math.PI/2;m.position.set(x,y||0,z);W.add(m);};
  flat(28,17,'#a9dc90',0,0.5);
  /* the house back, with a back door and windows (the lot is behind it) */
  building(W,{x:0,z:-11,w:14,d:5,h:3.4,wall:'#ffd6e0',roof:'#ff8a8a',gable:true,face:1,door:{x:0,c:'#a8714a'}});
  box(W,3,.12,1.6,'#e8d6bf',0,0,-7.7,{ol:.012});
  /* lot edge: low hedge at the back of the lot (toward the lane behind) */

  /* ===== pet yard (left) ===== */
  const PX=petLv===3?[-13,-1]:petLv===2?[-12,-2]:[-10,-3],PZ=petLv===3?[-7,8]:petLv===2?[-7,6]:[-7,3];
  const lv=String(petLv);for(let x=PX[0];x<PX[1];x+=2)for(let z=PZ[0];z<PZ[1];z+=2)P('yard:ground',{lv},x+1,z+1);
  const fl=(a,b,c,d,id='yard:fence')=>{const L=Math.hypot(c-a,d-b),n=Math.max(1,Math.round(L/4)),ang=Math.atan2(c-a,d-b);for(let i=0;i<n;i++){const t=(i+.5)/n;P(id,{lv,len:4},a+(c-a)*t,b+(d-b)*t,ang,L/n/4);}};
  const gx=(PX[0]+PX[1])/2;fl(PX[0],PZ[0],PX[0],PZ[1]);fl(PX[0],PZ[1],gx-1,PZ[1]);P('yard:gate',{lv},gx,PZ[1],0);fl(gx+1,PZ[1],PX[1],PZ[1]);fl(PX[1],PZ[0],PX[1],PZ[1]);
  for(let z=PZ[0]+1;z<PZ[1]-1;z+=2)P('yard:path',{lv},gx,z,0);
  if(petLv===1){P('doghouse',{},PX[0]+1.6,PZ[0]+1.4,.3);P('bed',{size:'s'},PX[1]-1.4,PZ[0]+1.2);P('foodbowl',{full:'1'},PX[1]-1.2,PZ[0]+3);P('waterbowl',{},PX[1]-1.8,PZ[0]+3.1);P('toy:ball',{},gx+1.2,PZ[0]+5);P('toy:rope',{},PX[0]+2.2,PZ[0]+4.2,.6);P('yard:deco',{lv},PX[0]+1,PZ[1]-1.2);P('yard:deco',{lv},PX[1]-1,PZ[1]-1.2);
    pet('dog','#e8b765',gx-1.5,PZ[0]+4,.6);pet('cat','#f3a25b',PX[1]-1.4,PZ[0]+1.4,-.4);}
  if(petLv===2){P('doghouse',{},PX[0]+1.6,PZ[0]+1.4,.3);P('bed',{size:'m'},PX[1]-1.5,PZ[0]+1.2);P('bed',{size:'m'},PX[1]-3,PZ[0]+1.2);P('foodbowl',{full:'1'},PX[1]-1.2,PZ[0]+3);P('waterbowl',{},PX[1]-1.8,PZ[0]+3.1);P('toybox',{},PX[0]+1.4,PZ[0]+4,.5);
    P('train:dog',{},gx-2.2,PZ[1]-3,0);P('train:cat',{},PX[1]-1.5,PZ[1]-2,-.4);P('yard:deco',{lv},PX[0]+1,PZ[1]-1.2);P('yard:deco',{lv},PX[1]-1,PZ[0]+5.5);
    pet('dog','#e8b765',gx-1,PZ[0]+5,.6);pet('cat','#f3a25b',PX[1]-1.4,PZ[0]+1.4,-.4);pet('bunny','#ffffff',PX[0]+2.5,PZ[1]-2,.3);}
  if(petLv===3){P('doghouse',{},PX[0]+1.6,PZ[0]+1.4,.3);for(const k of[0,1,2])P('bed',{size:'l'},PX[1]-1.6-k*1.8,PZ[0]+1.3);P('foodbowl',{full:'1'},PX[1]-1.2,PZ[0]+3.2);P('waterbowl',{},PX[1]-1.8,PZ[0]+3.3);P('toybox',{},PX[0]+1.4,PZ[0]+4,.5);
    P('train:dog',{},gx+1.6,PZ[0]+5.2,0);P('train:bunny',{},PX[1]-1.6,PZ[0]+6,0);P('home:tree',{},PX[0]+3.6,PZ[1]-3.4,0,.85);P('home:pond',{},gx+2.2,PZ[1]-3.2,0,.85);
    for(const [x,z] of[[PX[0]+1,PZ[1]-1],[PX[1]-1,PZ[1]-1],[PX[0]+1,PZ[0]+6.5]])P('yard:deco',{lv},x,z);
    pet('dog','#e8b765',gx-1,PZ[0]+4.5,.6);pet('cat','#f3a25b',PX[1]-1.6,PZ[0]+1.4,-.4);pet('bunny','#ffffff',PX[1]-1.5,PZ[0]+7.2,.3);pet('monkey',null,PX[0]+4.8,PZ[1]-2.4,.4);pet('seal',null,gx+2.2,PZ[1]-3.2,1.2);}
  {const sg=(t,x,z,c)=>{cyl(W,.1,.1,2.2,'#8a5a36',x,0,z,{seg:6,ol:.01});box(W,3.6,1.1,.12,'#ffffff',x,1.9,z,{ol:.016});const pl=signPlane(t,3.3,.9,'#ffffff',c);pl.position.set(x,2.45,z+.07);W.add(pl);};sg('Pet yard',gx+2.4,PZ[1]+.9,'#2f7a66');}
  /* ===== garden (right) ===== */
  const GX=gardenLv===3?[1,13]:gardenLv===2?[2,12]:[3,10],GZ=gardenLv===3?[-7,8]:gardenLv===2?[-7,6]:[-7,3],gl=String(gardenLv),cx=(GX[0]+GX[1])/2;
  const gf=(a,b,c,d)=>{const L=Math.hypot(c-a,d-b),n=Math.max(1,Math.round(L/4)),ang=Math.atan2(c-a,d-b);for(let i=0;i<n;i++){const t=(i+.5)/n;P('garden:fence',{lv:gl,len:4},a+(c-a)*t,b+(d-b)*t,ang,L/n/4);}};
  gf(GX[1],GZ[0],GX[1],GZ[1]);gf(GX[0],GZ[1],cx-1,GZ[1]);gf(cx+1,GZ[1],GX[1],GZ[1]);gf(GX[0],GZ[0],GX[0],GZ[1]);
  for(let z=GZ[0]+1;z<GZ[1];z+=2)P('garden:path',{lv:gl},cx,z,0);
  const nb=gardenLv===1?2:gardenLv===2?4:6;for(let i=0;i<nb;i++){const side=i%2?1:-1,row=Math.floor(i/2);P('garden:bed',{lv:gl},cx+side*2.2,GZ[0]+2+row*2.6,Math.PI/2);}
  const np=gardenLv;for(let i=0;i<np;i++)P('garden:pot',{lv:gl},GX[1]-1,GZ[1]-1.2-i*1.4);
  for(let z=GZ[0]+1.2;z<GZ[1]-1;z+=2.2)P('garden:edge',{lv:gl},GX[0]+.6,z,Math.PI/2);
  {cyl(W,.1,.1,2.2,'#8a5a36',cx+2.4,0,GZ[1]+.9,{seg:6,ol:.01});box(W,3.6,1.1,.12,'#ffffff',cx+2.4,1.9,GZ[1]+.9,{ol:.016});const pl=signPlane('Garden',3.3,.9,'#ffffff','#a8571f');pl.position.set(cx+2.4,2.45,GZ[1]+.97);W.add(pl);}
  if(gardenLv===3){bench(W,GX[1]-1.2,GZ[0]+1.6,-Math.PI/2);}
  if(gardenLv===1){P('garden:pot',{lv:gl},GX[0]+1,GZ[1]-1.2);}
  return W;}

/* ---------- the monkey's jungle tree (31 Oct, his ask: 9 m tall, more monkey-like, from the jungle) ----------
   a rainforest giant: big buttress roots, a thick trunk wrapped in vines and moss, thick branches, a wide lumpy crown in layers,
   many hanging lianas, a wooden lookout platform at 3.6 m (under the limbs, so you see it) with a rope ladder, and a rope swing. 9 m tall (1 m = 1.23 game units). */
function jungleTree(g){const B='#7a5236',Bd='#5e3e28',G=['#2f8a4a','#3fa35a','#58b86a','#4a9e3f','#267a3e'],K=1.23,top=6.7*K,r=seeded(19);
  /* buttress roots: big rounded roots that bulge out of the trunk and dive into the ground (round from every side, no flat fins) */
  for(let k=0;k<7;k++){const a=k/7*Math.PI*2+.3,c=Math.cos(a),n=Math.sin(a);tube(g,[[c*.35,2.6,n*.35],[c*1.0,1.3,n*1.0],[c*1.8,.35,n*1.8],[c*2.5,-.05,n*2.5]],t=>.42-t*.34,0,k%2?B:Bd,{seg:16,rad:12,ol:.016,caps:false});}
  /* the trunk: thick, a slight bend, a vine spiralling up it and moss patches */
  tube(g,[[0,0,0],[.12,2.5*K,.05],[-.1,5*K,-.08],[.06,top,.03]],t=>.92-t*.38,0,B,{seg:28,rad:18,ol:.024,caps:false});sph(g,.54,B,.06,top,.03,{ws:14,hs:10,ol:.02});   /* no round cap at the foot: it showed as a dark stub under the trunk */
  {const P=[];for(let i=0;i<=40;i++){const t=i/40,a=t*Math.PI*7,y=.3+t*(top-.6),rr=.95-t*.37;P.push([Math.cos(a)*rr,y,Math.sin(a)*rr]);}tube(g,P,.11,.09,'#5fae5c',{seg:140,rad:8,ol:.01});}
  for(let i=0;i<18;i++){const a=r()*6.28,y=.8+r()*(top-1.8);sph(g,.36,i%2?'#6fbf5e':'#4f9a52',Math.cos(a)*(.88-y/top*.34),y,Math.sin(a)*(.88-y/top*.34),{s:[1,.6,.4],ry:-a,ws:8,hs:6,ol:.006});}
  /* thick branches reaching out to the crown */
  const tips=[];for(const [dx,dz,h] of[[2.6,.4,1.0],[-2.4,1.0,1.2],[.6,-2.6,.9],[-1.0,-2.0,1.4],[1.5,2.3,1.1],[-2.1,-1.0,.8]]){tube(g,[[0,top-2.6,0],[dx*.5,top-1.2,dz*.5],[dx*1.1,top+.2,dz*1.1]],t=>.44-t*.24,0,B,{seg:16,rad:12,ol:.016});tips.push([dx*1.1,top+.2,dz*1.1]);}
  /* the crown: a wide, lumpy rainforest canopy in two layers */
  const blob=(x,y,z,s,c,f)=>sph(g,s,c,x,y,z,{s:[1,f||.55,1],ws:14,hs:9,ol:.026});
  for(let i=0;i<20;i++){const a=i/20*Math.PI*2+r()*.4,d=1.5+r()*2.0;blob(Math.cos(a)*d,top+.6+r()*.9,Math.sin(a)*d,1.0+r()*.9,G[[0,4,3][i%3]],.45+r()*.3);}
  for(let i=0;i<11;i++){const a=i/11*Math.PI*2+.5,d=.5+r()*1.6;blob(Math.cos(a)*d,top+1.5+r()*.7,Math.sin(a)*d,.9+r()*.7,G[1+(i%2)],.5+r()*.3);}
  blob(0,top+2.25,0,1.15,G[2]);
  for(let k=0;k<18;k++){const a=k/18*Math.PI*2,d=3.3+(k%3)*.3;sph(g,.6,G[(k+1)%5],Math.cos(a)*d,top+.7+(k%2)*.4,Math.sin(a)*d,{s:[1,.12,.45],ry:-a,rz:-.4,ws:10,hs:5,ol:.008});}
  /* lianas: many, long, hanging from inside the crown and the branch tips */
  const lianas=[[1.8,.6],[-1.6,1.1],[.4,-1.9],[2.4,-.6],[-2.2,-.4],[-.6,2.0],[1.1,-1.2],[-1.2,-1.6],[2.0,1.6],[-2.6,.2],[.2,2.7],[1.6,-2.4]];
  for(let i=0;i<lianas.length;i++){const [x,z]=lianas[i],y0=top+.8,len=top-1.4-(i%4)*.9;tube(g,[[x,y0,z],[x*.96+.15,y0-len*.4,z*.96],[x*.94-.1,y0-len*.75,z*.94+.1],[x*.92,y0-len,z*.92+.12]],.085,.065,'#4f8a3a',{seg:14,rad:7,ol:.009});
    for(let k=1;k<6;k++)sph(g,.13,G[3],x*(1-.016*k)+.05,y0-len*k/6,z*(1-.016*k)+.08,{s:[1,.3,.6],rz:.5,ws:6,hs:4,ol:false});}
  /* the lookout platform at 3.6 m, braced into the trunk, with a railing; a rope ladder hangs from its rim to the ground */
  const py=3.6*K;{const p=new THREE.Group();p.position.set(0,py,0);g.add(p);cyl(p,1.35,1.35,.16,'#c98f5e',0,0,0,{seg:20,ol:.016});for(let k=0;k<12;k++){const a=k/12*Math.PI*2;cyl(p,.04,.04,.6,'#a8714a',Math.cos(a)*1.25,.16,Math.sin(a)*1.25,{seg:5,ol:false});}
    const rail=new THREE.Mesh(new THREE.TorusGeometry(1.25,.05,6,26),mat('#a8714a'));rail.rotation.x=Math.PI/2;rail.position.y=.76;p.add(rail);const ro=new THREE.Mesh(new THREE.TorusGeometry(1.25,.07,6,26),OL);ro.rotation.x=Math.PI/2;ro.position.y=.76;p.add(ro);}
  for(let k=0;k<5;k++){const a=k/5*Math.PI*2+.4;tube(g,[[Math.cos(a)*1.2,py,Math.sin(a)*1.2],[Math.cos(a)*.9,py-.7,Math.sin(a)*.9],[Math.cos(a)*.65,py-1.5,Math.sin(a)*.65]],.12,.1,'#8a5a36',{seg:8,rad:8,ol:.01});}
  const lx=1.25,lz=-.3;for(const s of[-1,1])cyl(g,.05,.05,py,'#e8c98f',lx,0,lz+s*.28,{seg:6,ol:.006});for(let i=1;i<11;i++)box(g,.12,.08,.64,'#a8714a',lx,i*py/11,lz,{center:true,ol:.006});
  /* a rope swing from a branch */
  const [sx,sy,sz]=tips[1];for(const s of[-1,1])cyl(g,.03,.03,3.0,'#d9b98a',sx*.8,sy-3.0-.4,sz*.8+s*.3,{seg:4,ol:false});box(g,.24,.07,.76,'#a8714a',sx*.8,sy-3.4,sz*.8,{center:true,ol:.006});}
{const T=PU['home:tree'],B=T.build;PU['home:tree']=Object.assign({},T,{opts:[PU_OPT.pick('look','Version',[['jungle','Jungle giant, 9 m (new)'],['classic','First climbing tree']])].concat(T.opts||[]),dflt:Object.assign({},T.dflt,{look:'jungle'}),
  build(g,o){if((o.look||'jungle')==='classic'){B.call(this,g,o);return;}jungleTree(g);}});}

/* ---------- snake terrarium round 5 (31 Oct, Non-living chat, his ask): ADULT snake size (the adult snake is 2.35 units long: the tank is now 2.5 x 0.9 x 1.15 so it lies inside full length), open front (no front glass, a low lip), a half-log hide to sleep in, all light colours kept ---------- */
pu('home:tank',{name:'Snake terrarium (indoor, open front, adult size)',stage:3,group:'Big-needs homes',icon:'🐍',pet:'snake',v:2,opts:[PU_OPT.pick('light','Light switch',[['day','Daylight'],['warm','Warm'],['uv','Ultraviolet'],['cyber','Cyberpunk'],['pink','Pink'],['sun','Sunny yellow'],['sky','Sky blue'],['mint','Mint'],['lilac','Lilac'],['coral','Coral'],['off','Off']])],dflt:{light:'day'},
  build(g,o){const W=2.5,D=.9,H=1.15,F='#2b2838',f=.03;
    box(g,W+.04,.06,D+.04,F,0,0,0,{ol:.012});for(const x of[-1,1])for(const z of[-1,1])box(g,.04,.06,.04,F,x*(W/2-.02),-.0,z*(D/2-.02),{ol:false});
    /* gravel and a water strip behind the low front glass */
    box(g,W-.04,.12,D-.04,'#c9b48a',0,.06,0,{ol:false});box(g,.6,.05,.3,null,.55,.17,.18,{mat:WATER,ol:false});cyl(g,.2,.2,.03,'#7a7592',.55,.15,.18,{seg:14,ol:.006});
    for(const [x,c] of[[-.75,'#8a85a3'],[-.1,'#b3afc6'],[.15,'#7a7592']])sph(g,.11,c,x,.19,-.12,{s:[1.4,.6,1],ws:8,hs:6,ol:.008});
    /* the frame */
    for(const x of[-1,1])for(const z of[-1,1])box(g,f,H,f,F,x*(W/2-f/2),.06,z*(D/2-f/2),{ol:.008});
    for(const y of[.06,.26,.06+H-f])for(const z of[-1,1])box(g,W,f,f,F,0,y,z*(D/2-f/2),{ol:.008});for(const y of[.06,.06+H-f])for(const x of[-1,1])box(g,f,f,D,F,x*(W/2-f/2),y,0,{ol:.008});
    
    /* a half-log hide on the left to sleep in: 0.88 wide inside, the coiled snake (0.71) fits (Moves 31 Oct) */{const hd=new THREE.Mesh(new THREE.CylinderGeometry(.44,.44,.66,18,1,true,-Math.PI/2,Math.PI),mat('#9a6a43'));hd.material.side=THREE.DoubleSide;hd.rotation.x=-Math.PI/2;hd.position.set(-.6,.18,.08);g.add(hd);const rg=new THREE.Mesh(new THREE.TorusGeometry(.44,.035,6,18,Math.PI),mat('#6e4527'));rg.position.set(-.6,.18,.41);g.add(rg);}
    /* the mesh top and the lamp bar under it */
    box(g,W-.02,.01,D-.02,'#4a4658',0,.06+H-.005,0,{ol:false});const L=TER_LIGHT[o.light]||TER_LIGHT.day;
    box(g,W*.7,.04,.08,'#3d3550',0,.06+H+.005,-.05,{ol:.01});const glow=(c,e)=>toon({color:e,emissive:new THREE.Color(e),emissiveIntensity:.55});
    /* the glowing strip runs along the front of the lamp housing (seen from any side), and a soft beam falls from it */
    const strip=(c,e,x,w)=>{box(g,w,.02,.06,null,x,.06+H-.02,-.05,{mat:e?glow(c,e):mat(c),ol:false});box(g,w,.025,.012,null,x,.06+H+.012,-.01,{mat:e?glow(c,e):mat(c),ol:false});
      if(e){const m=new THREE.MeshBasicMaterial({color:e,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide});const bm=new THREE.Mesh(new THREE.CylinderGeometry(w*.5,w*.62,H-.32,4,1,true),m);bm.geometry.rotateY(Math.PI/4);bm.scale.z=Math.min(.45,D*.4/(w*.62*1.42));bm.position.set(x,.06+H/2+.15,-.05);g.add(bm);}};
    if(L[2]){strip(L[0],L[1],-W*.165,W*.33);strip('#9ff6ff',L[2],W*.165,W*.33);}else strip(L[0],L[1],0,W*.66);
    /* the light's colour washes the back of the tank (a soft glowing panel just inside the back glass) */
    if(L[1]){const bk=(c,x,w)=>{const m=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.5,depthWrite:false});const p=new THREE.Mesh(new THREE.PlaneGeometry(w,H-.3),m);p.position.set(x,.06+(H+.3)/2,-(D/2-f-.01));g.add(p);};
      if(L[2]){bk(L[1],-W/4+.01,W/2-.06);bk(L[2],W/4-.01,W/2-.06);}else bk(L[1],0,W-.08);}
    /* inside: one climbing branch from corner to corner, and three potted-in-gravel plants (stems with leaves on them) */
    const B='#8a5a36';{const L=1.7,a=1.05;cyl(g,.05,.065,L,B,-.15,.2+Math.cos(a)*L/2,-.18,{rz:-a,center:true,seg:8,ol:.01});cyl(g,.035,.045,.55,B,.2,.62,-.18,{rz:.9,center:true,seg:7,ol:.01});}
    const Lf=['#5fbf74','#4fae5c','#8fd97e','#6fc25a'];
    for(const [x,z,h,n,i] of[[-.82,-.28,.7,6,0],[.82,-.3,.6,5,1],[.3,-.32,.45,4,2]]){cyl(g,.012,.016,h,'#4f8f4a',x,.18,z,{seg:5,ol:.006});
      for(let k=0;k<n;k++){const a=k/n*Math.PI*2+i,hy=.18+h*(.45+.55*k/n),r=.07;sph(g,.075,Lf[(k+i)%4],x+Math.cos(a)*r,hy,z+Math.sin(a)*r*.7,{s:[1,.2,.55],ry:-a,rz:Math.cos(a)*.4,rx:Math.sin(a)*.4,ws:10,hs:6,ol:.007});}}
    /* glass on the back and both sides; the FRONT IS OPEN (his ask 31 Oct): only a low glass lip keeps the gravel in, so the snake can go in and out */
    const G=new THREE.MeshToonMaterial({color:'#d6f2ff',gradientMap:GRAD,transparent:true,opacity:.18,depthWrite:false});
    for(const [w,h,x,y,z,ry] of[[W-.04,H-.04,0,.06+H/2,-(D/2-f/2),0],[W-.04,.2,0,.06+.1,D/2-f/2,0],[D-.04,H-.04,-(W/2-f/2),.06+H/2,0,Math.PI/2],[D-.04,H-.04,W/2-f/2,.06+H/2,0,Math.PI/2]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),G);p.material.side=THREE.DoubleSide;p.position.set(x,y,z);p.rotation.y=ry;g.add(p);}}});
PU['home:tank'].at=1793459984853;

/* ---------- Pet Show podium + animal license card (31 Oct, Non-living chat; Moves row moves-20261031-podium-card, Karolis OK'd plan A):
   a 3-step winners' podium in the park with a small stage behind for Sir Barkley, and the license card he hands over (Screens' vintage card look) ---------- */
const PDM={blue:'#3d5bd9',deep:'#2a3a8f',gold:'#ffd45c',white:'#ffffff',pink:'#ff7aa8',wood:'#c98f5e',mint:'#5fd4b0'};
/* a ribbon rosette: round pleated disc + two tails */
function rosette(g,x,y,z,s,c){const p=new THREE.Group();p.position.set(x,y,z);p.scale.setScalar(s);g.add(p);
  for(let k=0;k<12;k++){const a=k/12*TAU;const m=new THREE.Mesh(new THREE.CircleGeometry(.09,6),mat(k%2?c:shade(c,.12)));m.position.set(Math.cos(a)*.11,Math.sin(a)*.11,0);p.add(m);}
  const d=new THREE.Mesh(new THREE.CircleGeometry(.11,20),mat(PDM.gold));d.position.z=.005;p.add(d);
  for(const s2 of[-1,1]){const t=new THREE.Mesh(new THREE.PlaneGeometry(.07,.26),mat(c));t.position.set(s2*.05,-.22,-.003);t.rotation.z=s2*.18;p.add(t);}
  return p;}
/* the podium: 1st in the middle (tallest), 2nd left, 3rd right; each step 1.3 wide, 1.2 deep; numbers on the fronts */
function petPodium(g,t=PDM){const W=1.3,D=1.2;
  for(const [x,h,n,c] of[[0,.9,'1',t.gold],[-W,.6,'2','#cfd6e6'],[W,.38,'3','#e3a36b']]){
    rbox(g,W-.04,h,D,.06,t.blue,x,h/2,0);box(g,W,.08,D+.04,t.white,x,h,0,{ol:.01});
    const r=Math.min(.24,h*.46),ring=new THREE.Mesh(new THREE.TorusGeometry(r,.03,8,28),mat(t.deep));ring.position.set(x,h*.5,D/2+.01);g.add(ring);
    const s=signPlane(n,r*1.45,r*1.45,c,t.deep);s.position.set(x,h*.5,D/2+.012);g.add(s);}
  /* paw prints on the top of the 1st step and a small step-up in front */
  pawSign(g,0,.985,0,.5,t.gold).rotation.x=-Math.PI/2;box(g,.8,.18,.35,t.deep,0,0,D/2+.18,{ol:.01});}
/* the stage behind: a low platform, steps up, a back panel with the Pet Show banner, bunting, two rosettes, paw sign; Sir Barkley stands in the middle */
function petStage(g,t=PDM){const W=4.6,D=1.8,H=.5;
  box(g,W,H,D,t.wood,0,0,0,{ol:.014});box(g,W+.06,.06,D+.06,t.white,0,H,0,{ol:.01});for(let i=0;i<9;i++)box(g,W-.02,.005,.02,shade(t.wood,-.1),0,H+.061,-D/2+(i+.5)*D/9,{ol:false});
  for(const s of[-1,1]){box(g,.7,.17,.4,t.wood,s*1.5,0,D/2+.2,{ol:.01});box(g,.7,.34,.2,t.wood,s*1.5,0,D/2+.1,{ol:.01});}
  /* back panel with an arched top and the banner */
  box(g,W,2.3,.12,t.blue,0,H,-D/2+.06,{ol:.014});const arch=new THREE.Mesh(new THREE.CircleGeometry(W/2,32,0,Math.PI),mat(t.blue));arch.scale.y=.28;arch.position.set(0,H+2.3,-D/2+.06);g.add(arch);
  const b=signPlane('Pet Show',2.6,.6,t.gold,t.deep);b.position.set(0,H+1.75,-D/2+.13);g.add(b);
  pawSign(g,-1.0,H+.85,-D/2+.13,.8,t.gold,t.deep);pawSign(g,1.0,H+.85,-D/2+.13,.8,t.gold,t.deep);rosette(g,-1.85,H+1.7,-D/2+.14,1.4,t.pink);rosette(g,1.85,H+1.7,-D/2+.14,1.4,t.mint);
  /* bunting along the top edge */
  const pts=[];for(let i=0;i<=12;i++){const u=i/12,x=-W/2+.3+u*(W-.6),y=H+2.0-Math.sin(u*Math.PI)*.25+Math.sin(u*Math.PI)*0;pts.push([x,y+.3,-D/2+.2]);}
  tube(g,pts,.012,.012,t.white,{seg:24,rad:4,ol:false});
  for(let i=0;i<12;i++){const a=pts[i],c=[t.pink,t.gold,t.mint,'#7cc8ff'][i%4];const f=new THREE.Mesh(new THREE.ConeGeometry(.12,.24,3),mat(c));f.rotation.x=Math.PI;f.position.set((a[0]+pts[i+1][0])/2,(a[1]+pts[i+1][1])/2-.13,a[2]);g.add(f);}
  /* two flower pots on the stage corners */
  for(const s of[-1,1]){cyl(g,.22,.17,.35,t.white,s*(W/2-.35),H,D/2-.35,{seg:12,ol:.01});for(let k=0;k<6;k++){const a=k*1.05;sph(g,.11,k%2?t.pink:t.gold,s*(W/2-.35)+Math.cos(a)*.13,H+.45+(k%3)*.05,D/2-.35+Math.sin(a)*.13,{ws:8,hs:6,ol:.008});}}}
/* the license card: a small paper card (vintage look from the Screens chat): shield with the first pet, title, name, level stars, Certified stamp. Size 0.36 x 0.24 units (about 29 x 20 cm, big enough to read in the game) */
const LIC_FONT='"Roboto Slab","Alfa Slab One",Georgia,serif';
function licenseTexture(lv,name){const c=document.createElement('canvas');c.width=768;c.height=512;const x=c.getContext('2d');
  x.fillStyle='#f3e6c4';x.fillRect(0,0,768,512);x.strokeStyle='#7a5a36';x.lineWidth=10;x.strokeRect(14,14,740,484);x.lineWidth=3;x.strokeRect(30,30,708,452);
  /* shield with a paw (the first pet) */
  x.fillStyle='#3d5bd9';x.beginPath();x.moveTo(80,90);x.lineTo(240,90);x.lineTo(240,210);x.quadraticCurveTo(240,300,160,340);x.quadraticCurveTo(80,300,80,210);x.closePath();x.fill();x.strokeStyle='#ffd45c';x.lineWidth=8;x.stroke();
  x.fillStyle='#ffd45c';x.beginPath();x.ellipse(160,230,34,28,0,0,TAU);x.fill();for(const [dx,dy] of[[-40,-30],[-14,-52],[14,-52],[40,-30]]){x.beginPath();x.ellipse(160+dx,230+dy,13,17,0,0,TAU);x.fill();}
  x.fillStyle='#3a2a1a';x.textAlign='left';x.font='800 44px '+LIC_FONT;x.fillText('ANIMAL LICENSE',280,135);
  x.font='700 30px '+LIC_FONT;x.fillStyle='#5a4630';x.fillText('Cozy Town Pet Office',282,178);
  x.font='800 42px '+LIC_FONT;x.fillStyle='#2a3a8f';x.fillText(name,282,250);
  x.font='700 30px '+LIC_FONT;x.fillStyle='#5a4630';x.fillText('Level '+lv,282,305);
  x.font='48px '+LIC_FONT;x.fillStyle='#d4a017';x.fillText('★'.repeat(lv)+'☆'.repeat(3-lv),420,308);
  /* the Certified stamp (gold Top level stamp at level 3) */
  x.save();x.translate(575,385);x.rotate(-.22);x.strokeStyle=lv===3?'#9a6e08':'#c0392b';x.fillStyle=x.strokeStyle;x.lineWidth=7;x.beginPath();x.arc(0,0,82,0,TAU);x.stroke();x.lineWidth=3;x.beginPath();x.arc(0,0,68,0,TAU);x.stroke();
  x.textAlign='center';x.font='800 '+(lv===3?21:23)+'px '+LIC_FONT;x.fillText(lv===3?'TOP LEVEL':'CERTIFIED',0,8);x.font='700 15px '+LIC_FONT;x.fillText('valid forever',0,36);x.restore();
  x.font='600 22px '+LIC_FONT;x.fillStyle='#7a5a36';x.textAlign='left';x.fillText('Signed: Sir Barkley',80,440);
  const tx=new THREE.CanvasTexture(c);tx.anisotropy=4;return tx;}
function licenseCard(g,lv){const W=.36,H=.24;const card=new THREE.Group();g.add(card);
  box(card,W,H,.008,'#e8d8b0',0,0,0,{center:true,ol:.006});
  const f=new THREE.Mesh(new THREE.PlaneGeometry(W-.006,H-.006),new THREE.MeshBasicMaterial({map:licenseTexture(lv,'Your name')}));f.position.z=.0045;card.add(f);
  const bk=new THREE.Mesh(new THREE.PlaneGeometry(W-.006,H-.006),mat('#e3d2a6'));bk.position.z=-.0045;bk.rotation.y=Math.PI;card.add(bk);return card;}
pu('show:podium',{name:'Pet Show podium (1st, 2nd, 3rd)',stage:7,group:'Pet Show',icon:'🏆',v:1,build(g){petPodium(g);}});
pu('show:stage',{name:'Pet Show stage for Sir Barkley',stage:7,group:'Pet Show',icon:'🎪',v:1,opts:[PU_OPT.pick('with','Show',[['both','Stage + podium'],['stage','Stage only']])],dflt:{with:'both'},
  build(g,o){const s=new THREE.Group();s.position.z=-1.6;g.add(s);petStage(s);if((o.with||'both')==='both'){const p=new THREE.Group();p.position.z=.9;g.add(p);petPodium(p);}}});
pu('show:license',{name:'Animal license card (hand-held)',stage:7,group:'Pet Show',icon:'🪪',v:1,carry:true,opts:[PU_OPT.pick('lv','Level',[['1','Level 1'],['2','Level 2'],['3','Level 3 (top)']])],dflt:{lv:'1'},
  build(g,o){const c=licenseCard(g,+o.lv||1);c.position.y=.14;}});
for(const k of['show:podium','show:stage','show:license'])PU[k].at=1793461957293;
/* ---------- the Pet Show area in Cozy Park (31 Oct, Non-living chat, his ask: "see pet show area with all its elements, stage, podium, judges' table, as a whole, in the park";
   the podium must not stand in front of the stage). Park numbers from js/02-world.js (the park: x -40.4..-8.3, z 8.4..40.6; fountain at -22,22; today's stage at -36.5,22 facing the fountain). ---------- */
/* the judges' table: a long table with a skirt and a gold trim, three chairs behind it, score paddles, name plates, a bell, water */
function judgesTable(g,t=PDM){const L=3.0,D=.75,H=.76;
  box(g,L,.06,D,t.white,0,H-.06,0,{ol:.012});box(g,L-.04,H-.06,.04,t.blue,0,0,D/2-.04,{ol:.01});box(g,L-.02,.06,.05,t.gold,0,H-.12,D/2-.02,{ol:false});
  for(const x of[-L/2+.08,L/2-.08])for(const z of[-D/2+.08,D/2-.08])box(g,.06,H-.06,.06,t.deep,x,0,z,{ol:false});
  pawSign(g,0,H*.45,D/2-.015,.45,t.gold);
  for(const [i,x] of[[0,-1.0],[1,0],[2,1.0]]){
    /* chair behind (judges face +z, toward the stage) */const ch=new THREE.Group();ch.position.set(x,0,-.65);g.add(ch);box(ch,.5,.06,.48,t.wood,0,.46,0,{ol:.01});for(const a of[-.21,.21])for(const b of[-.2,.2])box(ch,.05,.46,.05,t.wood,a,0,b,{ol:false});box(ch,.5,.55,.06,t.wood,0,.52,-.22,{ol:.01});box(ch,.46,.07,.44,t.pink,0,.52,0,{ol:false});
    /* name plate, score paddle, glass */
    prism(g,.36,.1,.1,t.gold,x,H,.15,{ry:0});const np=signPlane(['Judge','Judge','Judge'][i],.32,.08,'#fff6d6',t.deep);np.position.set(x,H+.06,.2);np.rotation.x=-.5;g.add(np);
    const pd=new THREE.Group();pd.position.set(x+.3,H,-.05);pd.rotation.set(-.3,0,.25);g.add(pd);cyl(pd,.012,.012,.18,t.wood,0,0,0,{seg:6,ol:false});cyl(pd,.09,.09,.015,t.white,0,.24,0,{rx:Math.PI/2,center:true,seg:18,ol:.006});
    const sc=signPlane(String([9,10,8][i]),.12,.12,'#ffffff',t.deep);sc.position.set(0,.24,.009);pd.add(sc);
    cyl(g,.035,.03,.1,'#cfeeff',x-.3,H,-.05,{seg:10,ol:.005});}
  cyl(g,.06,.07,.03,t.gold,1.35,H,.12,{seg:12,ol:.006});sph(g,.05,t.gold,1.35,H+.05,.12,{s:[1,.7,1],ws:10,hs:6,ol:.005});}
pu('show:judges',{name:"Judges' table (3 judges)",stage:7,group:'Pet Show',icon:'⚖️',v:1,build(g){judgesTable(g);}});

/* the whole area in the park: the park round it (fence, sand plaza, fountain, benches, flower beds, trees, playground) so you see how it fits */
function buildShowArea(g,o){const t=PDM,people=o.people!=='no';
  const P=(f,x,z,ry,s)=>{const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry||0;if(s)p.scale.setScalar(s);g.add(p);f(p,t);return p;};
  const man=(x,z,ry,y,look)=>{if(!people)return;try{const m=makePerson(Object.assign({},DEFAULT_LOOK,look||{}));m.root.position.set(x,y||0,z);m.root.rotation.y=ry||0;g.add(m.root);}catch(e){}};
  /* park ground, plaza and paths */
  flat(g,32.1,32.2,'#a9dc90',-24.35,.004,24.5);{const d=new THREE.Mesh(new THREE.CircleGeometry(10,56),mat('#f6e2b8'));d.rotation.x=-Math.PI/2;d.position.set(-22,.012,22);g.add(d);}
  flat(g,3,6,'#f6e2b8',-22,.011,11.2);flat(g,6,3,'#f6e2b8',-10.8,.011,22);
  /* the show lawn: a soft sand floor in front of the stage so the audience can stand there */
  {const d=new THREE.Mesh(new THREE.CircleGeometry(7.8,48),mat('#f2dcae'));d.rotation.x=-Math.PI/2;d.scale.set(.7,1,1);d.position.set(-35.0,.014,22);g.add(d);}   /* one sand show ground under stage, podium and judges */
  /* fence */
  for(const [a,b,c,d] of[[-38.0,8.4,-24.2,8.4],[-19.8,8.4,-8.3,8.4],[-8.3,8.4,-8.3,19.4],[-8.3,24.6,-8.3,37.8],[-40.4,10.0,-40.4,38.6],[-38.6,40.6,-9.4,40.6]])ironFence(g,a,b,c,d,null);
  /* the fountain (simple): basin, water, centre */
  cyl(g,4.6,4.85,.55,'#ece4f6',-22,0,22,{seg:44,ol:.03});{const w=new THREE.Mesh(new THREE.CircleGeometry(4.42,48),mat('#8fd3ff'));w.rotation.x=-Math.PI/2;w.position.set(-22,.6,22);g.add(w);}cyl(g,.75,.95,1.25,'#ece4f6',-22,.55,22,{seg:22,ol:.02});cyl(g,1.4,1.5,.2,'#ece4f6',-22,1.8,22,{seg:24,ol:.02});
  for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2,bx=-22+Math.cos(a)*9.6,bz=22+Math.sin(a)*9.6;bench(g,bx,bz,Math.atan2(-22-bx,22-bz));}
  for(const [sx,sz] of[[1,-1],[-1,-1],[-1,1],[1,1]])flowerBed(g,-22+sx*8.84,22+sz*8.84,1.8,1.0);
  /* trees (the one at -37.4,16.2 moves to -39.2,13.4 so the podium has room: Map to confirm) */
  for(const [x,z] of[[-37.6,9.2],[-11.5,16],[-39.2,13.4],[-37.6,27.7],[-11.5,28],[-16,37.5],[-26,37.5],[-20,35.5],[-36,37.5],[-12.5,37.5]])tree(g,x,z,1);
  /* playground slide (stand-in block) and swings, as in the game */
  box(g,1.2,1.8,1.2,'#ffd45c',-37.2,0,29.9,{ol:.02});box(g,.9,.08,3.2,'#ff7aa8',-37.2,.9,32.0,{rx:.5,center:true,ol:.015});
  for(const s of[-1,1])box(g,.12,2.6,.12,'#7cc8ff',-29+s*1.8,0,37.4,{ol:.01});cyl(g,.07,.07,3.8,'#7cc8ff',-29,2.5,37.4,{rz:Math.PI/2,center:true,seg:8,ol:.008});
  /* ===== the Pet Show =====
     stage: where today's stage is, its front toward the fountain (+x). Podium: BESIDE the stage on one side (low z), front also toward the fountain, so it never blocks the view.
     Judges: at the other front corner (high z), turned toward the stage, out of the line between the stage and the fountain. */
  const ST=P(petStage,-36.5,22,Math.PI/2);
  const PO=P(petPodium,-36.0,16.9,Math.PI/2);
  const JX=-33.8,JZ=27.3,JA=Math.atan2(-36.0-JX,22-JZ);const JT=P(judgesTable,JX,JZ,JA);
  /* a low rope line (posts + rope) round the show lawn */
  const rp=[];for(let i=0;i<=8;i++){const a=-Math.PI*.3+i/8*Math.PI*.6,x=-36.2+Math.cos(a)*5.2,z=22+Math.sin(a)*5.2;rp.push([x,z]);}
  for(let i=0;i<rp.length;i++){const [x,z]=rp[i];if(Math.abs(z-22)<1.2)continue;cyl(g,.05,.06,.75,t.gold,x,0,z,{seg:8,ol:.006});sph(g,.07,t.gold,x,.78,z,{ws:8,hs:6,ol:.005});
    if(i<rp.length-1&&Math.abs(rp[i+1][1]-22)>=1.2){const [x2,z2]=rp[i+1];tube(g,[[x,.62,z],[(x+x2)/2,.56,(z+z2)/2],[x2,.62,z2]],.02,.02,t.pink,{seg:8,rad:5,ol:false});}}
  /* people: Sir Barkley on the stage, the three judges, a winner on the podium, audience round the lawn */
  man(-36.4,22,Math.PI/2,.5,{top:'#3d5bd9'});
  for(const k of[-1,0,1]){const x=JX+k*Math.cos(JA)-.85*Math.sin(JA),z=JZ-k*Math.sin(JA)-.85*Math.cos(JA);man(x,z,JA,0,{top:'#ffd45c'});}
  man(-36.0,16.9,Math.PI/2,.98,{top:'#ff7aa8'});
  for(const [x,z] of[[-29.6,18.6],[-29.2,21.0],[-29.4,23.6],[-30.2,26.0]])man(x,z,-Math.PI/2);
  if(people)try{for(const [k,x,z] of[['dog',-35.4,22.3],['cat',-35.6,21.2]]){const m=puPet(k,null,'adult');m.root.position.set(x,.5,z);m.root.rotation.y=Math.PI/2;g.add(m.root);}}catch(e){}
}
pu('show:area',{name:'Pet Show area in Cozy Park (stage, podium, judges)',stage:7,group:'Pet Show',icon:'🏆',v:1,opts:[PU_OPT.pick('people','People',[['yes','With people'],['no','Empty']])],dflt:{people:'yes'},build(g,o){buildShowArea(g,o);}});
for(const k of['show:judges','show:area'])PU[k].at=1793462632870;

/* ---------- two more toys (31 Oct, Non-living chat; Plan row plan-20261031-toys-gear): the monkey's frisbee and the snake's toy mouse (both sold in the game's Pet Shop list) ---------- */
pu('toy:frisbee',{name:'Frisbee (monkey toy)',stage:3,group:'Toys',icon:'🥏',need:'play',carry:true,v:1,opts:[PU_OPT.col(['#ff7aa8','#5fd4b0','#ffd45c','#7cc8ff'])],dflt:{c:'#ff7aa8'},
  build(g,o){const c=o.c||'#ff7aa8';const d=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.025,28),mat(c));d.position.y=.022;g.add(d);
    const r=new THREE.Mesh(new THREE.TorusGeometry(.145,.014,8,30),mat(shade(c,-.12)));r.rotation.x=Math.PI/2;r.position.y=.022;g.add(r);
    for(const rr of[.06,.1]){const q=new THREE.Mesh(new THREE.TorusGeometry(rr,.005,4,24),mat('#ffffff'));q.rotation.x=Math.PI/2;q.position.y=.036;g.add(q);}
    pawSign(g,0,.037,0,.12,'#ffffff').rotation.x=-Math.PI/2;}});
pu('toy:mouse',{name:'Toy mouse (snake toy)',stage:3,group:'Toys',icon:'🐭',need:'play',carry:true,v:1,opts:[PU_OPT.col(['#b3afc6','#ff9ec4','#ffd45c'])],dflt:{c:'#b3afc6'},
  build(g,o){const c=o.c||'#b3afc6';sph(g,.06,c,0,.05,0,{s:[1,.8,1.5],ws:14,hs:10,ol:.008});sph(g,.035,c,0,.06,.085,{s:[1,.9,1.2],ws:10,hs:8,ol:.006});
    for(const s of[-1,1]){sph(g,.024,'#ff9ec4',s*.03,.1,.07,{s:[1,1,.4],ws:8,hs:6,ol:.005});sph(g,.008,'#2e2347',s*.017,.075,.115,{ws:6,hs:5,ol:false});}
    sph(g,.009,'#ff7aa8',0,.06,.122,{ws:6,hs:5,ol:false});
    tube(g,[[0,.04,-.08],[.03,.03,-.14],[-.02,.02,-.2],[.02,.02,-.25]],.008,.005,'#ff9ec4',{seg:12,rad:5,ol:false});
    box(g,.06,.004,.012,'#ffd45c',0,.088,0,{rx:.0,center:true,ol:false});}});
PU['toy:frisbee'].at=1793459984853;PU['toy:mouse'].at=1793459984853;

/* ---------- the new Pet Shop (31 Oct, Non-living things models chat, his ask): three floors as ONE open room round an open middle (no fade between floors),
   a counter, and cozy spots where the animals hang around instead of pens. Same game helpers and units as the vet clinic. Front (door) = +z. ---------- */
const PS={wall:'#e6f8f0',mint:'#5fd4b0',deep:'#2f8f78',pale:'#c9f2e3',sun:'#ffd45c',floor:'#f6ecd8',wood:'#c98f5e',pink:'#ff9ec4',grass:'#9fd98a'};
const PSW=14,PSD=10,PSF=3.2;   /* inside 14 x 10 (as the shop's rooms today), 3 floors of 3.2 */
/* the counter: Ms. Paws's till, a treat jar, a paw sign */
function psCounter(g,t=PS){rbox(g,2.6,1.0,.7,.08,t.mint,0,.5,0);box(g,2.7,.07,.8,t.sun,0,1.0,0,{ol:.012});pawSign(g,0,.55,.355,.55,t.sun);
  box(g,.45,.3,.35,t.deep,-.8,1.07,-.05,{ol:.01});box(g,.4,.04,.3,'#ffffff',-.8,1.37,-.05,{ol:false});
  cyl(g,.13,.13,.26,'#cfeeff',.75,1.07,0,{seg:14,ol:.008});cyl(g,.14,.14,.05,t.pink,.75,1.33,0,{seg:14,ol:.006});for(let k=0;k<4;k++)box(g,.07,.04,.03,['#c98f5e','#ff9ec4','#ffd45c','#ffffff'][k],.7+(k%2)*.1,1.1+(k>>1)*.07,(k%2?.03:-.03),{ol:false});
  const s=signPlane('Pet Shop',1.2,.32,t.sun,t.deep);s.position.set(0,.82,.357);g.add(s);}
/* dog corner: a big round rug, a low dog sofa, a toy basket */
function psDogSofa(g,t=PS){cyl(g,1.35,1.35,.03,'#ffe3a3',0,0,0,{seg:30,ol:.008});
  box(g,2.0,.3,.9,t.mint,0,.03,-.55,{ol:.012});box(g,2.0,.55,.22,t.deep,0,.03,-.95,{ol:.012});for(const s of[-1,1])box(g,.2,.42,.9,t.deep,s*1.1,.03,-.55,{ol:.01});
  for(const x of[-.48,.48])rbox(g,.88,.12,.62,.05,t.pale,x,.39,-.5,{ol:false});
  cyl(g,.3,.25,.3,t.wood,1.0,.03,.6,{seg:12,ol:.01});sph(g,.1,'#ff7aa8',.95,.36,.6,{ws:8,hs:6,ol:.006});box(g,.25,.06,.06,'#ffffff',1.08,.34,.55,{rz:.4,center:true,ol:false});}
/* cat window seat: a cushioned bench under a window, a tall cat tree beside it */
function psCatSeat(g,t=PS){box(g,2.2,.45,.7,t.wood,0,0,0,{ol:.012});rbox(g,2.1,.12,.62,.05,t.pink,0,.5,0,{ol:false});for(const x of[-.65,0,.65])box(g,.5,.25,.04,shade(t.wood,-.08),x,.1,.355,{ol:false});
  const ct=new THREE.Group();ct.position.set(1.75,0,.05);g.add(ct);cyl(ct,.07,.07,1.9,'#e8d3b0',0,0,0,{seg:10,ol:.008});
  for(const [y,r,c] of[[0,.4,t.pale],[.7,.32,t.pink],[1.3,.3,t.sun],[1.9,.36,t.pale]])cyl(ct,r,r,.08,c,0,y,0,{seg:16,ol:.01});rbox(ct,.55,.25,.4,.08,t.pink,0,2.0,0,{ol:.01});
  sph(ct,.06,'#ff7aa8',.3,.55,.2,{ws:8,hs:6,ol:.005});cyl(ct,.005,.005,.15,'#ffffff',.3,.6,.2,{seg:4,ol:false});}
/* bunny + hamster play hill: a low wide grass hill round the tree, two tunnel arches, a carrot row, a hamster wheel house on a low stump */
const PSHR=1.9,PSHH=.95;function psHillY(x,z){const q=1-(x*x+(z/.85)*(z/.85))/(PSHR*PSHR);return q>0?PSHH*Math.sqrt(q):0;}
function psPlayHill(g,t=PS){const h=new THREE.Mesh(new THREE.SphereGeometry(1,28,12,0,TAU,0,Math.PI/2),mat(t.grass));h.scale.set(PSHR,PSHH,PSHR*.85);g.add(h);
  for(const [a,c] of[[2.6,t.pink],[-.5,t.sun]]){const x=Math.cos(a)*1.85,z=Math.sin(a)*1.85*.85;const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=Math.PI/2-a;g.add(p);
    const tn=new THREE.Mesh(new THREE.TorusGeometry(.4,.16,10,18,Math.PI),mat(c));p.add(tn);const d=new THREE.Mesh(new THREE.CircleGeometry(.26,18,0,Math.PI),mat('#4a3426'));d.position.z=.01;p.add(d);}
  for(let k=0;k<5;k++){const x=-.55+k*.27,z=1.15,y=psHillY(x,z);cone(g,.05,.18,'#ff8a3d',x,y-.08,z,{rx:Math.PI,seg:6,ol:false});for(const s of[-1,1])cone(g,.025,.14,'#5fae5c',x+s*.03,y,z,{seg:4,ol:false});}
  const st=new THREE.Group();st.position.set(.85,psHillY(.85,.5)-.08,.5);g.add(st);cyl(st,.32,.36,.25,t.wood,0,0,0,{seg:14,ol:.01});
  box(st,.3,.25,.25,t.pink,-.08,.25,0,{ol:.008});cone(st,.25,.2,t.deep,-.08,.5,0,{seg:4,ry:Math.PI/4,ol:.008});
  const w=new THREE.Mesh(new THREE.TorusGeometry(.14,.025,6,16),mat(t.mint));w.position.set(.2,.42,0);st.add(w);cyl(st,.012,.012,.16,t.deep,.2,.25,0,{seg:4,ol:false});}
/* capybara warm tub: a round wooden tub of warm water with steam and two floating oranges */
function psCapyTub(g,t=PS){{const w=new THREE.Mesh(new THREE.CylinderGeometry(1.0,1.05,.55,24,1,true),mat(t.wood));w.material.side=THREE.DoubleSide;w.position.y=.275;g.add(w);const rim=new THREE.Mesh(new THREE.TorusGeometry(1.0,.05,6,28),mat(shade(t.wood,-.1)));rim.rotation.x=Math.PI/2;rim.position.y=.55;g.add(rim);cyl(g,1.0,1.0,.06,t.wood,0,0,0,{seg:24,ol:.012});}for(let k=0;k<12;k++){const a=k/12*TAU;box(g,.04,.56,.02,shade(t.wood,-.12),Math.cos(a)*1.04,0,Math.sin(a)*1.04,{ry:-a,ol:false});}
  cyl(g,.94,.94,.02,'#62c3e6',0,.46,0,{seg:24,ol:false});for(const [x,z] of[[.55,.45],[-.6,-.35]])sph(g,.11,'#ff9d3b',x,.5,z,{ws:10,hs:8,ol:.008});
  for(const [x,z,y] of[[-.5,.3,.72],[.5,-.3,.8]])sph(g,.14,'#ffffff',x,y,z,{s:[1,.6,1],ws:8,hs:6,mat:toon({color:'#ffffff',transparent:true,opacity:.45}),ol:false});
  box(g,.7,.25,.45,t.pale,1.35,0,.35,{ol:.01});box(g,.66,.04,.42,'#ffffff',1.35,.25,.35,{ol:false});}
/* duck pond: a round raised stone edge, water, lily pads, and a little wooden bridge over it */
function psDuckPond(g,t=PS){cyl(g,1.2,1.25,.28,'#d9d2c4',0,0,0,{seg:28,ol:.012});cyl(g,1.05,1.05,.02,'#6cc4f0',0,.27,0,{seg:28,ol:false});
  for(const [x,z] of[[-.55,.45],[.55,-.5]]){cyl(g,.17,.17,.01,'#5fae5c',x,.29,z,{seg:12,ol:false});sph(g,.06,'#ff9ec4',x+.04,.31,z,{s:[1,.6,1],ws:8,hs:6,ol:false});}
  const N=9,BX=1.12;for(let i=0;i<16;i++){const u=(i+.5)/16,x=-BX+u*2*BX,y=.3+Math.sin(u*Math.PI)*.38,sl=Math.atan(Math.cos(u*Math.PI)*.38*Math.PI/(2*BX));box(g,2*BX/16+.03,.07,.62,i%2?t.wood:shade(t.wood,.05),x,y,0,{rz:sl,center:true,ol:false});}
  for(const s of[-1,1]){for(let i=0;i<N;i+=2){const u=i/(N-1),x=-BX+u*2*BX,y=.3+Math.sin(u*Math.PI)*.38;cyl(g,.03,.03,.35,'#ffffff',x,y,s*.28,{seg:5,ol:false});}
    const pts=[];for(let i=0;i<N;i++){const u=i/(N-1);pts.push([-BX+u*2*BX,.3+Math.sin(u*Math.PI)*.38+.35,s*.28]);}tube(g,pts,.035,.035,'#ffffff',{seg:16,rad:5,ol:false});}}
/* the shop tree: grows from the play hill up through the open middle; an owl branch at floor 2, monkey branches and ropes near floor 3 */
function psTree(g,t=PS,H=PSF*3+.4,cut=H){   /* one tree, always the full 3-floor tree; cut = the cut-away height when fewer floors are shown (31 Oct, Karolis: same tree on every view) */
  {let P=[[0,0,0],[.08,H*.35,.04],[-.04,H*.7,-.04],[0,H,0]];if(cut<H){const Q=[P[0]];for(let i=1;i<P.length;i++){if(P[i][1]<=cut){Q.push(P[i]);continue;}const a=P[i-1],b=P[i],u=(cut-a[1])/(b[1]-a[1]);Q.push([a[0]+(b[0]-a[0])*u,cut,a[2]+(b[2]-a[2])*u]);break;}P=Q;}
   tube(g,P,.26,.26+(.16-.26)*Math.min(1,cut/H),'#9a6a43',{seg:20,rad:12,ol:.012});}
  const tips=[];for(const [y,a,L,r] of[[PSF+.9,.3,1.6,.1],[PSF+1.3,2.7,1.4,.09],[2*PSF+.7,1.5,1.7,.1],[2*PSF+1.1,4.1,1.5,.09]].filter(b=>b[0]<Math.min(H,cut)-.4)){const x=Math.cos(a)*L,z=Math.sin(a)*L;tube(g,[[0,y-.35,0],[x*.5,y,z*.5],[x,y+.2,z]],r,r*.7,'#8a5a36',{seg:10,rad:8,ol:.008});sph(g,.42,'#6fc25a',x,y+.45,z,{s:[1.2,.75,1.1],ws:12,hs:8,ol:.012});tips.push([x,y+.2,z]);}
  if(cut>=H)for(const [x,z,s] of[[0,0,1.15],[.7,.35,.85],[-.6,-.3,.9],[.2,-.7,.8]])sph(g,s,'#5fae5c',x,H+.15,z,{s:[1,.65,1],ws:14,hs:9,ol:.015});
  if(cut>PSF+1.5){const a=.3,L=1.05;box(g,.7,.07,.12,t.wood,Math.cos(a)*L,PSF+1.0,Math.sin(a)*L,{ry:-a,center:true,ol:.008});}   /* the perch on the branch, out of the leaf ball (Moves 31 Oct) */
  if(cut>=H&&H>2*PSF+1)for(const [x,z] of[[.75,.4],[-.65,.35],[.15,-.75]]){cyl(g,.035,.035,2.4,'#e8d3b0',x,H-2.4,z,{seg:6,ol:false});sph(g,.09,'#e8d3b0',x,H-2.42,z,{ws:8,hs:6,ol:false});}}
/* the bear lounge: a big soft sofa facing a TV on a low cabinet (the TV shows the cat show for now; later Izabele's movie) */
function psBearLounge(g,t=PS){cyl(g,1.6,1.6,.03,'#e9d8ff',0,0,.4,{seg:30,ol:.008});
  const so=new THREE.Group();so.position.set(0,0,1.0);so.rotation.y=Math.PI;g.add(so);box(so,2.8,.45,1.2,'#b79cff',0,.05,0,{ol:.014});box(so,2.8,.75,.3,'#8a6fd6',0,.05,-.5,{ol:.014});for(const s of[-1,1])box(so,.3,.6,1.2,'#8a6fd6',s*1.25,.05,0,{ol:.012});
  for(const x of[-.6,.6])rbox(so,1.1,.16,.9,.06,'#d9c8ff',x,.55,.08,{ol:false});rbox(so,.45,.35,.15,.06,t.sun,.85,.75,-.3,{ol:false});
  box(g,2.4,.55,.5,t.wood,0,0,-1.2,{ol:.012});box(g,2.0,1.15,.1,'#2e2347',0,.6,-1.25,{ol:.012});
  const sc=new THREE.Mesh(new THREE.PlaneGeometry(1.86,1.0),toon({color:'#ffd9ec',emissive:new THREE.Color('#ffb3d6'),emissiveIntensity:.35}));sc.position.set(0,1.17,-1.195);g.add(sc);
  const tx=signPlane('Cat show',1.0,.25,'#ff9ec4','#ffffff');tx.position.set(0,1.5,-1.19);g.add(tx);
  /* a cat on the screen, as simple shapes */sph(g,.16,'#f3a25b',0,1.0,-1.19,{s:[1.3,1,.2],ws:10,hs:8,ol:false});sph(g,.11,'#f3a25b',.22,1.17,-1.19,{s:[1,1,.2],ws:10,hs:8,ol:false});for(const s of[-1,1])cone(g,.04,.08,'#f3a25b',.22+s*.06,1.25,-1.19,{seg:4,ol:false});
  box(g,.7,.5,.5,t.wood,1.9,0,.9,{ol:.01});cyl(g,.18,.14,.12,t.sun,1.9,.5,.9,{seg:12,ol:.008});for(let k=0;k<5;k++)sph(g,.05,'#ffffff',1.85+(k%3)*.05,.62,.86+(k>>1)*.04,{ws:6,hs:5,ol:false});}
/* seal pool with a slide (raised tiled edge, a ladder tower, a slide into the water, a beach ball) */
function psSealPool(g,t=PS){rbox(g,3.6,.55,2.6,.15,'#e9f6ff',0,.275,0);box(g,3.3,.02,2.3,'#4fb3f0',0,.54,0,{ol:false});for(let i=1;i<4;i++)box(g,3.32,.005,.02,'#ffffff',0,.555,-1.15+i*.575,{ol:false});   /* bigger for a lap (Moves 31 Oct: the seal is 2.3 long) */
  box(g,1.0,1.6,1.0,t.pale,-2.3,0,-.6,{ol:.012});for(let k=0;k<5;k++)box(g,.6,.05,.08,t.mint,-2.3,.3+k*.3,-.08,{ol:.006});box(g,1.06,.08,1.06,t.mint,-2.3,1.6,-.6,{ol:.008});
  {const x0=-1.8,y0=1.68,x1=-.3,y1=.56,L=Math.hypot(x1-x0,y1-y0),a=Math.atan2(y0-y1,x1-x0);const p=new THREE.Group();p.position.set((x0+x1)/2,(y0+y1)/2,-.6);p.rotation.z=-a;g.add(p);
   box(p,L+.1,.05,.9,t.sun,0,0,0,{center:true,ol:.008});for(const s of[-1,1])box(p,L+.1,.16,.06,shade(t.sun,-.08),0,.08,s*.45,{center:true,ol:.006});}
  sph(g,.26,'#ff7aa8',1.25,.8,.55,{ws:12,hs:9,ol:.01});sph(g,.265,'#ffffff',1.25,.8,.55,{s:[.35,1,1],ws:12,hs:9,ol:false});}
/* monkey climbing frame: posts, monkey bars on top, rungs, a hammock slung between the posts, a rope net on one side */
function psMonkeyFrame(g,t=PS){const H=2.6;for(const x of[-1,1])for(const z of[-.6,.6])cyl(g,.06,.06,H,t.wood,x,0,z,{seg:8,ol:.008});
  for(const y of[1.0,1.8,H])for(const z of[-.6,.6])cyl(g,.04,.04,1.94,t.sun,0,y,z,{rz:Math.PI/2,center:true,seg:8,ol:.006});
  for(let k=0;k<6;k++)cyl(g,.035,.035,1.14,t.sun,-.85+k*.34,H,0,{rx:Math.PI/2,center:true,seg:6,ol:.005});
  {const pts=[];for(let i=0;i<=8;i++){const u=i/8;pts.push([-.94+u*1.88,1.55-Math.sin(u*Math.PI)*.3,0]);}for(const z of[-.16,0,.16]){const q=pts.map(p=>[p[0],p[1],z]);tube(g,q,.09,.09,t.pink,{seg:16,rad:6,ol:false});}
   for(const x of[-.94,.94])cyl(g,.02,.02,.6,'#e8d3b0',x,1.55,0,{rx:Math.PI/2,center:true,seg:4,ol:false});}
  for(let k=0;k<6;k++)cyl(g,.015,.015,1.14,'#e8d3b0',1.0,.3+k*.4,0,{rx:Math.PI/2,center:true,seg:4,ol:false});for(let k=0;k<4;k++)cyl(g,.015,.015,2.1,'#e8d3b0',1.0,.3,-.45+k*.3,{seg:4,ol:false});
  sph(g,.12,'#ffe14d',-.45,1.42,.0,{s:[1.8,.7,.7],ws:8,hs:6,ol:.006});}

/* the whole shop inside: floor = '1'/'2'/'3' (shows the floors up to that one) */
function buildPetShopRoom(g,o){const t=PS,W=PSW,D=PSD,F=PSF,T=.22,top=+o.floor||3,pets=o.pets!=='no';
  const put=(f,x,y,z,ry,s)=>{const p=new THREE.Group();p.position.set(x,y,z);p.rotation.y=ry||0;if(s)p.scale.setScalar(s);g.add(p);f(p,t);return p;};
  const pet=(par,k,x,y,z,ry,age)=>{if(!pets)return;try{const m=puPet(k,null,age||'young');m.root.position.set(x,y,z);m.root.rotation.y=ry||0;par.add(m.root);}catch(e){}};
  /* the open middle (x -3.2..3.2, z -2..2.6) is open from floor 1 to the roof; the stairs: 1 to 2 along the left wall, 2 to 3 along the right wall, both front to back */
  const VX=3.2,VZ0=-2.0,VZ1=2.6,SW=1.6,SZ0=.1,SZ1=4.2;   /* 0.8 free in front of each staircase (Moves 31 Oct: the player is 0.5 wide) */
  box(g,W,F*top+.3,.2,t.wall,0,0,-D/2+.1);box(g,.2,F*top+.3,D,t.wall,-W/2+.1,0,0);
  for(let f=0;f<top;f++){box(g,W,.14,.22,t.mint,0,f*F+.06,-D/2+.21,{ol:false});
    for(const x of[-4.5,0,4.5]){box(g,1.6,1.3,.06,'#cfeeff',x,f*F+1.1,-D/2+.21,{ol:.01});box(g,1.7,.08,.1,t.sun,x,f*F+1.06,-D/2+.24,{ol:false});}}
  box(g,W,.08,D,t.floor,0,0,0,{ol:.015});
  const slab=(y,x0,x1,z0,z1)=>box(g,x1-x0,T,z1-z0,t.floor,(x0+x1)/2,y,(z0+z1)/2,{ol:.012});
  const rail=(y,x0,z0,x1,z1)=>{const L=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.round(L/.32));for(let i=0;i<=n;i++)cyl(g,.03,.03,.95,t.deep,x0+(x1-x0)*i/n,y+T,z0+(z1-z0)*i/n,{seg:6,ol:false});
    box(g,Math.abs(x1-x0)+.08,.08,Math.abs(z1-z0)+.08,t.mint,(x0+x1)/2,y+T+.95,(z0+z1)/2,{ol:.006});};
  /* a floor above floor 1: everything except the open middle and the hole where its stairs come up (side -1 left, +1 right) */
  const upper=(y,side)=>{slab(y,-W/2,W/2,-D/2,VZ0);slab(y,-VX,VX,VZ1,D/2);
    for(const s of[-1,1]){const xo=s*W/2,xi=s*VX,xs=s*(W/2-SW-.2);const lo=Math.min(xo,xi),hi=Math.max(xo,xi);
      if(s===side){const a=Math.min(xs,xi),b=Math.max(xs,xi);slab(y,a,b,VZ0,D/2);slab(y,Math.min(xo,xs),Math.max(xo,xs),VZ0,SZ0);rail(y,xs,SZ0+.05,xs,D/2-.1);}
      else slab(y,lo,hi,VZ0,D/2);}
    rail(y,-VX,VZ0,VX,VZ0);rail(y,-VX,VZ1,VX,VZ1);rail(y,-VX,VZ0,-VX,VZ1);rail(y,VX,VZ0,VX,VZ1);};
  const stairs=(xc,y0,y1)=>{const N=14,len=SZ1-SZ0,R=y1-y0;for(let i=0;i<N;i++){const h=(i+1)*R/N,z=SZ1-(i+.5)*len/N;box(g,SW,h-.02,len/N+.02,t.pale,xc,y0,z,{ol:.01});box(g,SW+.02,.06,len/N+.03,i%2?t.sun:t.mint,xc,y0+h-.06,z,{ol:.008});}   /* the last step top = the floor above (Moves 31 Oct) */
    const xr=xc+(xc<0?SW/2+.04:-SW/2-.04),RL=len-.6,L=Math.hypot(RL,R*RL/len),a=Math.atan2(R,len),cz=SZ0+RL/2,p=new THREE.Group();p.position.set(xr,y0+R*(SZ1-cz)/len+.9,cz);p.rotation.x=a;g.add(p);box(p,.07,.07,L,t.deep,0,0,0,{center:true,ol:.006});   /* the rail starts 0.6 up the stairs: 1.3 free beside the bottom step (walk check 31 Oct) */
    for(let i=4;i<N;i+=3){const z=SZ1-(i+.5)*len/N,h=(i+1)*R/N;cyl(g,.025,.025,.9,t.deep,xr,y0+h,z,{seg:6,ol:false});}};
  stairs(-W/2+.25+SW/2,.08,F+T);if(top>=2)upper(F,-1);if(top>=3){stairs(W/2-.25-SW/2,F+T,2*F+T);upper(2*F,1);}
  /* the cut-away edges (right and front): a low wall at each floor so nothing hangs in the air; the real shop has full walls there */
  for(let f=0;f<top;f++){const yb=f?f*F:0,hole=f===1?-1:f===2?1:0;   /* floor 2 has its stair hole on the left, floor 3 on the right */
    const zr1=hole===1?SZ0:D/2;box(g,.12,.6,zr1+D/2,t.wall,W/2-.06,yb,(zr1-D/2)/2,{ol:.008});box(g,.16,.07,zr1+D/2,t.mint,W/2-.06,yb+.6,(zr1-D/2)/2,{ol:false});
    if(f){const xs=W/2-SW-.2;for(const [x0,x1] of[[hole===-1?-xs:-W/2,VX],[VX,(hole===1||(f===1&&top>=3))?xs:W/2]])box(g,x1-x0,.45,.12,t.wall,(x0+x1)/2,yb+T,D/2-.06,{ol:.008});}}
  /* ---- floor 1: the shop ---- */
  put(psCounter,5.5,.08,2.4,-Math.PI/2);if(pets){try{const m=makePerson(Object.assign({},DEFAULT_LOOK,{hair:'#c98f5e',top:'#5fd4b0'}));m.root.position.set(6.25,.08,2.4);m.root.rotation.y=-Math.PI/2;g.add(m.root);}catch(e){}}
  for(const x of[-1.75,1.75]){const sh=new THREE.Group();sh.position.set(x,.08,-D/2+.45);g.add(sh);vetShelf(sh,{pale:t.pale,acc:t.mint,deep:t.deep,sun:t.sun});}
  const dog=put(psDogSofa,-3.9,.08,-3.4);const cat=put(psCatSeat,4.2,.08,-4.45);const hill=put(psPlayHill,0,.08,.3);
  {const r=new THREE.Mesh(new THREE.CircleGeometry(.9,30),mat(t.sun));r.rotation.x=-Math.PI/2;r.position.set(0,.09,4.1);g.add(r);pawSign(g,0,.1,4.1,1.2,t.mint).rotation.x=-Math.PI/2;}
  pet(dog,'dog',-.45,.45,-.45,0);pet(dog,'pug',.55,.03,.45,.5);pet(cat,'cat',-.3,.56,.05,0);pet(cat,'cat',1.55,2.13,.05,.4);
  pet(hill,'bunny',-.9,psHillY(-.9,.55),.55,.7);pet(hill,'bunny',.1,psHillY(.1,1.0),1.0,-.3);pet(hill,'hamster',.45,psHillY(.45,1.05),1.05,.4,'adult');
  /* ---- floor 2: capybara tub, duck pond, the owl on the tree, a sofa to watch from ---- */
  if(top>=2){const y=F+T;const tub=put(psCapyTub,-4.6,y,-3.5);const pond=put(psDuckPond,4.4,y,-3.5);
    {const b=buildFurn('sofa','#5fd4b0');b.position.set(0,y,4.1);b.rotation.y=Math.PI;g.add(b);}
    pet(tub,'capybara',-.1,.12,.05,.6);pet(pond,'duck',-.6,.27,.45,1,'adult');pet(pond,'duck',.55,.27,-.5,-.6,'adult');pet(g,'owl',Math.cos(.3)*1.05,F+1.04+.08,.3+Math.sin(.3)*1.05,0,'adult');}
  /* ---- floor 3: the big-pets floor: bear lounge (TV on the left wall), seal pool, monkey frame ---- */
  if(top>=3){const y=2*F+T;const lo=put(psBearLounge,-5.35,y,-3.35,0);const pool=put(psSealPool,.5,y,-3.45);const fr=put(psMonkeyFrame,-5.85,y,3.75,Math.PI/2);   /* walk check 31 Oct: every animal reachable, paths at least 1 wide */
    pet(lo,'bear',0,.42,.95,Math.PI);pet(pool,'seal',.45,.3,.25,.8);pet(fr,'monkey',.35,2.62,0,.4);
    {const s=signPlane('Big pets',1.6,.4,t.sun,t.deep);s.position.set(0,y+2.35,-D/2+.22);g.add(s);}}
  {const tg=new THREE.Group();tg.position.set(0,.08,.3);g.add(tg);psTree(tg,t,F*3+.4,top<3?F*top+.4:F*3+.4);if(top>=3)pet(tg,'monkey',.75,F*3+.4-2.45,.4,0);}
}
pu('shop:pc_counter',{name:'Pet Shop counter',stage:7,group:'Pet Shop · inside',icon:'🛎️',v:1,build(g){psCounter(g);}});
pu('shop:dogsofa',{name:'Dog corner: rug + low sofa',stage:7,group:'Pet Shop · inside',icon:'🐶',v:1,build(g){psDogSofa(g);}});
pu('shop:catseat',{name:'Cat window seat + cat tree',stage:7,group:'Pet Shop · inside',icon:'🐱',v:1,build(g){psCatSeat(g);}});
pu('shop:playhill',{name:'Bunny + hamster play hill',stage:7,group:'Pet Shop · inside',icon:'🐰',v:1,build(g){psPlayHill(g);}});
pu('shop:capytub',{name:'Capybara warm tub',stage:7,group:'Pet Shop · inside',icon:'♨️',v:1,build(g){psCapyTub(g);}});
pu('shop:duckpond',{name:'Duck pond with a bridge',stage:7,group:'Pet Shop · inside',icon:'🦆',v:1,build(g){psDuckPond(g);}});
pu('shop:tree',{name:'Shop tree (owl branch, monkey ropes)',stage:7,group:'Pet Shop · inside',icon:'🌳',v:1,build(g){psTree(g);}});
pu('shop:bearlounge',{name:'Bear lounge: sofa + TV',stage:7,group:'Pet Shop · inside',icon:'🐻',v:1,build(g){psBearLounge(g);}});
pu('shop:sealpool',{name:'Seal pool with a slide',stage:7,group:'Pet Shop · inside',icon:'🦭',v:1,build(g){psSealPool(g);}});
pu('shop:monkeyframe',{name:'Monkey climbing frame',stage:7,group:'Pet Shop · inside',icon:'🐒',v:1,build(g){psMonkeyFrame(g);}});
pu('shop:room',{name:'Pet Shop inside (3 floors, one open room)',stage:7,group:'Pet Shop · inside',icon:'🐾',v:1,
  opts:[PU_OPT.pick('floor','Show',[['3','All 3 floors'],['2','Floors 1-2'],['1','Floor 1: the shop']]),PU_OPT.pick('pets','Animals',[['yes','With animals'],['no','Without']])],dflt:{floor:'3',pets:'yes'},
  build(g,o){buildPetShopRoom(g,o);}});
pu('shop:building',{name:'Pet Shop (outside, 3 floors)',stage:7,group:'Pet Shop · building',icon:'🐾',v:1,build(g){const t=PS,W=PSW,D=PSD,H=PSF*3;
  building(g,{x:0,z:0,w:W,d:D,h:H,wall:t.pale,trim:t.mint,roof:t.deep,shop:true,awning:t.sun,sign:'Pet Shop',signBg:t.sun,signFg:t.deep,door:{x:0,c:t.mint,glass:true},wf:'#ffffff'});
  pawSign(g,0,H-1.0,D/2+.06,1.2,t.sun,t.mint);}});
for(const k of Object.keys(PU))if(k.startsWith('shop:'))PU[k].at=1793459984853;
PU['shop:room'].at=1793464876447;   /* walk check 31 Oct + counter turned to face the customers (Karolis) */

/* ---------- backyard, round 2 (30 Oct, Non-living chat): built on the REAL Friends Lane lot (game file 02-world.js: lots 14 m apart, 13.2 m wide,
   house 9 x 7 at the lot middle, back garden fence x -23..-10.5 from z -18.5, the lane hedge at z -26.6; units = game metres in the yard frame).
   Garden on the left half, pet yard on the right half (the back door and the street gate open into it). Each level moves the back fence further back
   into the free lane valley (Map 31 Oct: hedges at z -37.5, level 3 may reach -35): L1 -24.6 (today), L2 -27.6, L3 -35. The 6 beds and the pot spots stay (saves keep working). ---------- */
const YPOTS=[[-21.3,-18.95],[-20.6,-18.95],[-19.9,-18.95],[-19.2,-18.95],[-18.5,-18.95],[-17.8,-18.95],[-17.1,-18.95],[-16.4,-18.95],[-15.7,-18.95],[-22.55,-20.0],[-22.55,-20.7],[-22.55,-21.4],[-22.55,-22.1],[-22.55,-22.8],[-22.55,-23.5],[-22.55,-24.1],[-21.9,-24.15],[-21.2,-24.15],[-20.5,-24.15],[-19.8,-24.15],[-19.1,-24.15],[-18.4,-24.15],[-17.7,-24.15],[-17.0,-24.15],[-16.3,-24.15],[-15.6,-24.15],[-14.9,-24.15],[-10.95,-20.4],[-10.95,-21.1],[-10.95,-21.8]];   /* = YARD_POTS in js/02-world.js */
const YB={L1:-24.6,L2:-27.6,L3:-35.0},YX1=-23,YX2=-10.5,YDIV=-17.2,YFRONT=-18.5;
function yardLot(W,ox,lv,own,pal){const L=String(lv),back=YB['L'+lv],ZM=lv===3?-29.0:back;   /* level 3: the new back part (ZM to back) is the big-needs pet area, the whole lot wide */
  const EMPTY=!!W.userData.empty,ITEM=id=>/^(doghouse|bed|foodbowl|waterbowl|toybox|toy:|train:|home:|pet:|yard:deco)/.test(id);   /* 'only what you own is drawn' (Game rules, 31 Oct): an empty level shows only the space */
  const P=(id,opt,x,z,ry,s)=>{const o=new THREE.Group();if(EMPTY&&ITEM(id))return o;const M=PU[id];M.build(o,Object.assign({},M.dflt,opt||{}));o.position.set(x+ox,0,z);o.rotation.y=ry||0;if(s)o.scale.setScalar(s);W.add(o);return o;};
  const pet=(k,c,x,z,ry)=>{if(EMPTY)return;const m=puPet(k,c,'adult');m.root.position.set(x+ox,0,z);m.root.rotation.y=ry||0;W.add(m.root);};
  const fl=(id,a,b,c,d,step)=>{const Lg=Math.hypot(c-a,d-b),n=Math.max(1,Math.round(Lg/(step||4))),ang=Math.atan2(c-a,d-b);for(let i=0;i<n;i++){const t=(i+.5)/n;P(id,{lv:L,len:4},a+(c-a)*t,b+(d-b)*t,ang,Lg/n/4);}};
  /* lot ground, front lawn, the house (the game's own Friends Lane house: 9 x 7, gable roof, door to the lane) and its back door */
  flat(W,13.2,19,'#a9dc90',-17+ox,.006,-17.3);
  building(W,{x:-17+ox,z:-15,w:9,d:7,h:3.8,wall:pal[0],trim:'#ffffff',roof:pal[1],face:1,gable:true,rh:2.6,chimney:true,door:{x:-17+ox,c:'#5fd4b0'}});
  doorAt(W,-14+ox,-18.52,Math.PI,'#5fd4b0');
  for(const [a,b] of[[-21.6,-17.9],[-16.1,-12.4]])fence(W,a+ox,-8.2,b+ox,-8.2,null);for(const x of[-21.6,-12.4])fence(W,x+ox,-8.2,x+ox,-11.3,null);
  for(let i=0;i<4;i++)cyl(W,.42,.42,.03,'#e9e0f7',-17+ox,0,-8.8-i*.72,{seg:16,ol:false});mailbox(W,-15.4+ox,-7.6,0);
  {box(W,.14,1.06,.14,'#9a6a43',-20.4+ox,0,-7.6,{ol:.02});box(W,2.35,.95,.12,'#ffffff',-20.4+ox,1.1,-7.6,{ol:.03});const sg=signPlane(own,2.1,.7,pal[1],'#ffffff');sg.position.set(-20.4+ox,1.575,-7.52);W.add(sg);}
  /* the backyard ground: one lawn (the game's garden), a softer patch for the pet corner */
  flat(W,YX2-YX1,YFRONT-ZM,{1:'#9ad97a',2:'#a2e48a',3:'#a2e48a'}[lv],(YX1+YX2)/2+ox,.012,(YFRONT+ZM)/2);
  flat(W,3.2,2.4,'#b4ea8e',-12.85+ox,.013,-21.2);
  if(lv===3)flat(W,YX2-YX1,ZM-back,'#9fd98a',(YX1+YX2)/2+ox,.013,(ZM+back)/2);
  if(lv===3){const r=seeded(7);for(let i=0;i<26;i++){const x=YX1+.4+r()*(YX2-YX1-.8),z=back+.5+r()*(ZM-back-1);cyl(W,.01,.01,.12,'#4fae5c',x+ox,0,z,{seg:4,ol:false});sph(W,.05,['#ff9ec4','#ffd45c','#b79cff','#ffffff'][i%4],x+ox,.14,z,{ws:6,hs:4,ol:false});}}
  /* the fence round the backyard as in the game (02-world.js), moved back with each level; no fence across the garden (Game rules 31 Oct: every pot spot stays free) */
  if(lv===3){fl('garden:fence',YX1,YFRONT,YX1,ZM);fl('yard:fence',YX1,ZM,YX1,back);fl('yard:fence',YX1,back,YX2,back);fl('garden:fence',YX1,ZM,-13.4,ZM,2);P('yard:gate',{lv:'3'},-12.4,ZM,0,.9);fl('yard:fence',-11.4,ZM,YX2,ZM,2);}
  else{fl('garden:fence',YX1,YFRONT,YX1,back);fl('garden:fence',YX1,back,YDIV,back);fl('yard:fence',YDIV,back,YX2,back);}
  fl('yard:fence',YX2,back,YX2,YFRONT-1.9);
  fl('garden:fence',YX1,YFRONT,-21.6,YFRONT,2);P('yard:gate',{lv:L},-11.45,YFRONT,0,.9);
  /* the garden EXACTLY as in the game: 6 beds at YARD_PLOTS (save spots 0-5), the 30 pots at YARD_POTS (save spots 6-35, shown only With items: they stay hidden until they open),
     the shed, seed box and watering can at the game's spots */
  for(const [x,z] of[[-21,-20.9],[-18.3,-20.9],[-15.6,-20.9],[-21,-23.0],[-18.3,-23.0],[-15.6,-23.0]])P('garden:bed',{lv:L},x,z,0,1);
  if(!EMPTY)for(const [x,z] of YPOTS){cyl(W,.26,.2,.3,'#c9805a',x+ox,0,z,{seg:10,ol:.015});cyl(W,.29,.29,.05,'#b8704c',x+ox,.28,z,{seg:10,ol:.012});}
  box(W,1.6,2.0,1.4,'#ffd6e0',-13.4+ox,0,-23.3);prism(W,1.9,1.8,.75,'#ff7aa8',-13.4+ox,2.0,-23.3,{ry:Math.PI/2});box(W,.7,1.6,.06,'#5fd4b0',-13.75+ox,0,-22.58,{ol:.015});
  box(W,.8,.45,.5,'#c98f5e',-12.95+ox,0,-22.35);cyl(W,.14,.16,.28,'#7cc8ff',-22.4+ox,0,-19.3,{seg:12,ol:.015});
  /* stepping stones from the back door to the garden gate (the way stays clear) */
  for(let k=0;k<4;k++)cyl(W,.3,.3,.03,'#e9e0f7',-13.7+k*.75+ox,0,-19.3,{seg:14,ol:.008});
  const lamp=(x,z)=>{if(EMPTY)return;cyl(W,.05,.06,1.0,'#3d3550',x+ox,0,z,{seg:8,ol:.008});sph(W,.13,null,x+ox,1.1,z,{mat:toon({color:'#fff3c4',emissive:new THREE.Color('#ffcf6b'),emissiveIntensity:W.userData.night?1:.35}),ol:.01});cone(W,.17,.12,'#3d3550',x+ox,1.2,z,{seg:8,ol:.008});if(W.userData.night){const pl=new THREE.PointLight('#ffd98a',1.0,7,2);pl.position.set(x+ox,1.3,z);W.add(pl);}};
  const seal=(x,z,ry)=>{const o=P('pet:seal',{look:'real',age:'adult'},x,z,ry);o.position.y=.05;};
  /* the pet corner, every level: the free spot right of the beds (between the door path, the shed and the right-hand pots) */
  P('doghouse',{},-13.3,-21.2,.25,.85);P('bed',{size:'s'},-11.85,-21.0,0,.8);P('foodbowl',{full:'1'},-14.2,-21.55);P('waterbowl',{},-14.2,-21.0);P('toy:ball',{},-12.3,-22.1);
  pet('dog','#e8b765',-12.5,-20.4,.6);pet('cat','#f3a25b',-11.85,-21.0,-.4);lamp(-11.7,-22.4);
  /* the extra garden beds (Game rules 31 Oct, rules-garden-levels: 3 at level 2 = save spots 36-38, 3 more at level 3 = 39-41, open when the level is bought):
     rows of 3 behind today's beds, in line with them (x -21, -18.3, -15.6); level 3 goes back to z -35 (Map 31 Oct: hedges at 37.5) */
  if(lv>1)for(const z of lv===3?[-25.6,-27.65]:[-25.6])for(const x of[-21,-18.3,-15.6])P('garden:bed',{lv:L},x,z,0,1);
  if(lv>1){/* behind the shed: a compost bin and a play corner */
    if(!EMPTY){box(W,.9,.8,.8,'#8a5a36',-13.85+ox,0,-26.95,{ol:.014});for(let k=0;k<3;k++)box(W,.92,.05,.82,'#6e4527',-13.85+ox,.2+k*.25,-26.95,{ol:false});box(W,.8,.06,.7,'#5fae5c',-13.85+ox,.8,-26.95,{ol:false});}
    if(!EMPTY)cyl(W,.95,.95,.03,'#ffd6e0',-12.1+ox,0,-26.0,{seg:28,ol:.01});P('toy:rope',{},-11.8,-25.7,.5);P('toy:bone',{},-12.5,-26.4,1);P('toybox',{},-13.8,-25.3,.5,.75);
    P('train:bunny',{},-11.25,-26.6,Math.PI/2,.6);lamp(-16.95,-26.9);lamp(-10.9,-24.9);
    pet('dog','#c98f5e',-12.4,-25.8,.9);pet('bunny','#ffffff',-11.4,-25.4,.3);}
  if(lv===3){/* the big-needs pet area, the whole lot wide (z -29 to -35): seal pond left, the 9 m jungle tree in the middle, the bear cave right */
    P('home:pond',{},-20.8,-32.0,0,.62);P('home:tree',{look:'jungle'},-16.4,-32.4,0);P('home:den',{},-12.15,-32.4,0,.65);   /* measured: tree roots reach 2.5 units out every way, so pond .62 + tree + cave .65 just fill the 12.5 width without touching */
    seal(-20.8,-32.0,1.2);if(!EMPTY){const m=puPet('monkey',null,'adult');m.root.position.set(-16.4+ox,4.6,-31.3);m.root.rotation.y=-.6;m.root.scale.multiplyScalar(1.4);W.add(m.root);}pet('bear',null,-12.2,-30.35,-Math.PI/2);
    lamp(-22.6,-34.5);lamp(-10.9,-29.6);lamp(-18.2,-29.6);
    for(const [x,z] of[[-12.4,-29.6],[-13.1,-30.2]])cyl(W,.4,.4,.03,'#e9e0f7',x+ox,0,z,{seg:16,ol:.008});
    {box(W,1.8,.45,.08,'#ffffff',-12.4+ox,1.75,ZM,{ol:.012});for(const sd of[1,-1]){const sg=signPlane('Big pets',1.7,.4,'#ffffff','#2f7a66');sg.position.set(-12.4+ox,1.97,ZM+sd*.05);if(sd<0)sg.rotation.y=Math.PI;W.add(sg);}}}
  /* the lane hedge behind the lot: it steps back with the yard */
  {const hz=-37.5,hb=(x,z)=>sph(W,.6,'#5fbf74',x+ox,.4,z,{s:[1.15,.72,1],ws:10,hs:7,ol:.018});for(let x=-23.5;x<=-10.4;x+=1.09)hb(x,hz);if(hz<-26.6)for(const x of[-23.95,-9.55])for(let z=-27.7;z>hz+.6;z-=1.1)sph(W,.6,'#5fbf74',x+ox,.4,z,{s:[.9,.72,1],ws:10,hs:7,ol:.018});}
  return back;}
function buildBackyard2(W,lv,view){const PAL=[['#ffd6e0','#ff7aa8'],['#c9f2e3','#5fa8ff'],['#fff1b8','#ff8a6b']];
  /* the lane in front: road, pavements, kerbs */
  const span=view==='lane'?44:16,cx=-17;flat(W,span,8,'#8c90b4',cx,.02,0);for(const s of[-1])flat(W,span,3,'#f3e7df',cx,.03,s*5.5);
  yardLot(W,0,lv,'Your house',PAL[0]);
  if(view==='lane'){yardLot(W,-14,1,"Mia's house",PAL[1]);yardLot(W,14,2,"Leo's house",PAL[2]);}
  else{/* the neighbours' side fences, so you see where your lot ends */fence(W,-9.0,-8.2,-9.0,-24.6,null);fence(W,-25.0,-8.2,-25.0,-24.6,null);
    for(const x of[-8.6,-25.4])box(W,.3,.02,17,'#a9dc90',x,0,-16.4,{ol:false});}
  /* the lane hedge everywhere else, and the free valley behind it */
  flat(W,span,14,'#b9e3a0',cx,.004,-31.5);
  return W;}

pu('yard:design',{name:'Backyard: pet yard + garden (levels 1-3)',stage:3,group:'Backyard · whole yard',icon:'🏡',v:3,opts:[PU_OPT.pick('v','Version',[['1','Level 1: today\'s size'],['2','Level 2: 3 m deeper, play corner'],['3','Level 3: big-needs pet area']]),PU_OPT.pick('items','Items',[['empty','Empty (before you buy)'],['full','With items']]),PU_OPT.pick('view','View',[['yard','Your yard'],['lane','With the neighbours']])],dflt:{v:'1',items:'empty',view:'yard'},
  note:'on the real Friends Lane lot (13.2 m wide, neighbours 0.8 m away); big-needs pets (seal, monkey, bear) only at level 3; only items you own are drawn',build(g,o){g.userData.empty=(o.items||'empty')==='empty';buildBackyard2(g,+o.v,o.view||'yard');}});
PU['yard:design'].at=1793409617175;PU['home:tree'].at=1793400772000;PU['home:tree'].chg='new Version: a 9 m jungle giant with big roots, a vine-wrapped trunk, lianas, a lookout platform with a rope ladder and a swing (the first tree is kept as a second version).';PU['yard:design'].chg='the extra garden beds (Game rules): level 2 adds a row of 3 beds behind today\'s beds, level 3 a second row of 3, in line with them. Level 3 now reaches 4 m further back (Map: hedges moved back), so the big-pet area behind the gate is the full lot width: seal pond left, the 9 m jungle tree in the middle, the bear cave right. The pond (0.62) and the cave (0.65) are a bit smaller so they do not touch the tree roots. Behind the shed: compost bin and play corner (level 2 and 3).';



;

'use strict';
/* Additive furniture catalogue. Front = +z; origin = floor centre; metres.
   Entries use the existing box/cyl/sph/cone/prism helpers without replacements.
   Piece counts exclude the helpers' outline hulls. Farm scenery has p:0.
   Load after the game's core script; no existing catalogue is changed. */
const COZY_PET_OBJECTS = {
  // 1a. Small pet bed. Size: footprint 0.72 x 0.64 m, height 0.225 m; pieces: 3.
  petbed_small:{n:'Small pet bed',i:'🐾',p:40,w:.72,d:.64,cols:['#ff9ec4','#8fd3ff','#ffd45c','#b79cff'],b(g,c){
    cyl(g,.32,.32,.14,c,0,0,0,{s:[1.0625,1,.9375],seg:18,ol:.018});
    cyl(g,.25,.25,.055,'#fff6e4',0,.125,.015,{s:[1.04,1,.88],seg:18,ol:false});
    sph(g,.05,c,0,.2,-.14,{s:[2.8,.5,1.1],ws:12,hs:8,ol:false});
  }},
  // 1b. Medium pet bed. Size: footprint 1.02 x 0.84 m, height 0.305 m; pieces: 3.
  petbed_medium:{n:'Medium pet bed',i:'🐾',p:80,w:1.02,d:.84,cols:['#ff9ec4','#8fd3ff','#ffd45c','#b79cff'],b(g,c){
    cyl(g,.46,.46,.18,c,0,0,0,{s:[1.065,1,.87],seg:18,ol:.02});
    cyl(g,.34,.34,.08,'#fff6e4',0,.16,.02,{s:[1.06,1,.86],seg:18,ol:false});
    sph(g,.07,c,0,.27,-.2,{s:[3,.5,1.1],ws:12,hs:8,ol:false});
  }},
  // 1c. Large pet bed. Size: footprint 1.5 x 1.2 m, height 0.385 m; pieces: 3.
  petbed_large:{n:'Large pet bed',i:'🐾',p:120,w:1.5,d:1.2,cols:['#ff9ec4','#8fd3ff','#ffd45c','#b79cff'],b(g,c){
    cyl(g,.65,.65,.22,c,0,0,0,{s:[1.0923,1,.846],seg:20,ol:.025});
    cyl(g,.5,.5,.1,'#fff6e4',0,.2,.025,{s:[1.1,1,.82],seg:20,ol:false});
    sph(g,.09,c,0,.34,-.28,{s:[3.2,.5,1.1],ws:12,hs:8,ol:false});
  }},
  // 2a. Empty food bowl, with a real recessed interior. Size: footprint 0.5 x 0.5 m, height 0.15 m; pieces: 12.
  foodbowl_empty:{n:'Food bowl (empty)',i:'🥣',p:40,w:.5,d:.5,cols:['#ff7aa8','#7cc8ff','#ffd45c','#5fd4b0'],b(g,c){
    cyl(g,.22,.2,.045,c,0,0,0,{seg:10,ol:.012});
    cyl(g,.18,.18,.012,'#fff6e4',0,.045,0,{seg:10,ol:false});
    for(let k=0;k<10;k++){const a=k*Math.PI/5;box(g,.139,.11,.045,c,Math.sin(a)*.205,.04,Math.cos(a)*.205,{ry:a,ol:.008});}
  }},
  // 2b. The same food bowl filled with kibble. Size: footprint 0.5 x 0.5 m, height 0.15 m; pieces: 19.
  foodbowl_full:{n:'Food bowl (full)',i:'🥣',p:40,w:.5,d:.5,cols:['#ff7aa8','#7cc8ff','#ffd45c','#5fd4b0'],b(g,c){
    cyl(g,.22,.2,.045,c,0,0,0,{seg:10,ol:.012});
    cyl(g,.18,.18,.012,'#fff6e4',0,.045,0,{seg:10,ol:false});
    for(let k=0;k<10;k++){const a=k*Math.PI/5;box(g,.139,.11,.045,c,Math.sin(a)*.205,.04,Math.cos(a)*.205,{ry:a,ol:.008});}
    for(const [x,z] of[[0,0],[-.09,0],[.09,0],[-.045,-.08],[.045,-.08],[-.045,.08],[.045,.08]])sph(g,.038,'#a8714a',x,.094,z,{ws:7,hs:5,ol:.005});
  }},
  // 3. Water bowl with inset water and small shine marks. Size: footprint 0.5 x 0.5 m, height 0.15 m; pieces: 15.
  waterbowl:{n:'Water bowl',i:'💧',p:40,w:.5,d:.5,cols:['#7cc8ff','#b79cff','#5fd4b0','#ff9ec4'],b(g,c){
    cyl(g,.22,.2,.045,c,0,0,0,{seg:10,ol:.012});
    cyl(g,.18,.18,.012,'#fff6e4',0,.045,0,{seg:10,ol:false});
    for(let k=0;k<10;k++){const a=k*Math.PI/5;box(g,.139,.11,.045,c,Math.sin(a)*.205,.04,Math.cos(a)*.205,{ry:a,ol:.008});}
    cyl(g,.177,.177,.029,'#7fd8ff',0,.057,0,{seg:16,ol:false});
    box(g,.08,.004,.014,'#d8f7ff',-.04,.086,-.035,{ol:false});
    box(g,.03,.004,.014,'#d8f7ff',.055,.086,.035,{ol:false});
  }},
  // 4. Open toy box with toys resting on blocks inside. Size: footprint 0.96 x 0.72 m, height 0.58 m; pieces: 12.
  pettoybox:{n:'Pet toy box',i:'🧺',p:60,w:.96,d:.72,cols:['#ff7aa8','#7cc8ff','#ffd45c','#5fd4b0'],b(g,c){
    box(g,.9,.08,.65,c,0,0,0,{ol:.02});
    box(g,.9,.34,.07,c,0,.08,-.29,{ol:.02});
    box(g,.9,.34,.07,c,0,.08,.29,{ol:.02});
    for(const x of[-.415,.415])box(g,.07,.34,.51,c,x,.08,0,{ol:.02});
    box(g,.26,.12,.018,'#fff6e4',0,.2,.335,{ol:.01});
    for(const x of[-.07,.07])box(g,.045,.025,.022,'#c98f5e',x,.255,.35,{ol:false});
    box(g,.25,.28,.25,'#b79cff',-.18,.08,0,{ry:.15,ol:.012});
    box(g,.22,.3,.22,'#ffd45c',.17,.08,-.015,{ry:-.2,ol:.012});
    sph(g,.105,'#5fd4b0',-.18,.465,0,{ws:10,hs:8,ol:.012});
    sph(g,.1,'#ff8a6b',.17,.48,-.015,{ws:10,hs:8,ol:.012});
  }},
  // 5a. Mouth-sized play ball. Size: footprint 0.24 x 0.24 m, height 0.21 m; pieces: 2.
  petball:{n:'Pet ball',i:'⚽',p:20,w:.24,d:.24,cols:['#ff8a6b','#7cc8ff','#ffd45c','#5fd4b0'],b(g,c){
    sph(g,.105,c,0,.105,0,{ws:12,hs:8,ol:.01});
    cyl(g,.107,.107,.018,'#fff6e4',0,.105,0,{center:true,seg:12,ol:false});
  }},
  // 5b. Short knotted rope toy. Size: footprint 0.46 x 0.14 m, height 0.094 m; pieces: 10.
  ropetoy:{n:'Rope toy',i:'🪢',p:40,w:.46,d:.14,cols:['#5fd4b0','#ff9ec4','#7cc8ff','#b79cff'],b(g,c){
    cyl(g,.027,.027,.3,c,0,.05,0,{rz:Math.PI/2,center:true,seg:8,ol:.006});
    for(const x of[-.1,-.05,0,.05,.1])cyl(g,.03,.03,.022,'#fff1b8',x,.05,0,{rz:Math.PI/2,center:true,seg:8,ol:false});
    for(const x of[-.16,.16]){
      sph(g,.047,c,x,.047,0,{ws:8,hs:6,ol:.006});
      cyl(g,.014,.014,.055,'#fff1b8',x*1.23,.028,.018,{rz:Math.PI/2,center:true,seg:6,ol:false});
    }
  }},
  // 5c. Small soft squeaky bone. Size: footprint 0.38 x 0.17 m, height 0.09 m; pieces: 5.
  squeakybone:{n:'Squeaky bone',i:'🦴',p:40,w:.38,d:.17,cols:['#fff1b8','#ff9ec4','#7cc8ff','#b79cff'],b(g,c){
    cyl(g,.032,.032,.24,c,0,.047,0,{rz:Math.PI/2,center:true,seg:10,ol:.008});
    for(const x of[-.13,.13])for(const z of[-.033,.033])sph(g,.045,c,x,.045,z,{ws:10,hs:7,ol:.007});
  }},
  // 5d. Yarn ball with wrap bands and a grounded loose end. Size: footprint 0.3 x 0.21 m, height 0.184 m; pieces: 5.
  yarnball:{n:'Yarn ball',i:'🧶',p:30,w:.3,d:.21,cols:['#ff9ec4','#b79cff','#8fd3ff','#ffd45c'],b(g,c){
    sph(g,.09,c,-.045,.092,0,{ws:12,hs:9,ol:.009});
    for(const o of[{}, {rx:Math.PI/2}, {rz:Math.PI/2}])cyl(g,.092,.092,.012,'#fff1e8',-.045,.092,0,{...o,center:true,seg:14,ol:false});
    cyl(g,.009,.009,.135,c,.0675,.011,0,{rz:Math.PI/2,center:true,seg:6,ol:false});
  }},
  // 5e. Mouth-sized wooden chew stick with blunt ends. Size: footprint 0.36 x 0.1 m, height 0.076 m; pieces: 5.
  chewstick:{n:'Chew stick',i:'🪵',p:20,w:.36,d:.1,cols:['#c98f5e','#a8714a','#e8b783'],b(g,c){
    cyl(g,.035,.035,.26,c,0,.04,0,{rz:Math.PI/2,center:true,seg:9,ol:.007});
    for(const x of[-.13,.13])sph(g,.038,'#e8d6b0',x,.038,0,{ws:8,hs:6,ol:.006});
    for(const x of[-.065,.065])cyl(g,.036,.036,.014,'#a8714a',x,.04,0,{rz:Math.PI/2,center:true,seg:9,ol:false});
  }},
  // 5f. Short feather toy, resting flat for carrying. Size: footprint 0.13 x 0.36 m, height 0.034 m; pieces: 4.
  feathertoy:{n:'Feather toy',i:'🪶',p:60,w:.13,d:.36,cols:['#b79cff','#ff9ec4','#7cc8ff','#5fd4b0'],b(g,c){
    cyl(g,.013,.013,.18,'#c98f5e',0,.018,.07,{rx:Math.PI/2,center:true,seg:7,ol:.004});
    for(const x of[-.018,.018])sph(g,.05,c,x,.015,-.08,{s:[.7,.3,1.7],ws:10,hs:7,ol:.004});
    cyl(g,.004,.004,.145,'#fff6e4',0,.031,-.075,{rx:Math.PI/2,center:true,seg:5,ol:false});
  }},
  // 6. Climbing tree with sitting branches and a hanging rung. Size: footprint 2.3 x 1.8 m, height 2.85 m; pieces: 14.
  climbingtree:{n:'Climbing tree',i:'🌳',p:400,w:2.3,d:1.8,cols:['#c98f5e','#a8714a','#d7a575'],b(g,c){
    cyl(g,.58,.65,.1,'#7fdcb5',0,0,0,{seg:14,ol:.025});
    cyl(g,.13,.2,2.15,c,0,.1,-.12,{seg:10});
    for(const [x,y,z,len,rz] of[[-.43,1.12,-.12,.9,Math.PI/2],[.43,1.7,-.12,.9,Math.PI/2]]){
      cyl(g,.075,.09,len,c,x,y,z,{rz,center:true,seg:9,ol:.02});
      box(g,.5,.09,.48,'#e8d6b0',x<0?-.77:.77,y+.065,z,{ol:.02});
    }
    cyl(g,.075,.08,.85,c,0,1.5,.25,{rx:Math.PI/2,center:true,seg:9,ol:.02});
    box(g,.5,.08,.43,'#e8d6b0',0,1.57,.55,{ol:.02});
    cyl(g,.055,.07,.8,c,.34,2.07,-.12,{rz:Math.PI/2,center:true,seg:9,ol:.018});
    for(const x of[.44,.7])cyl(g,.012,.012,.46,'#e8d6b0',x,1.59,-.12,{seg:6,ol:false});
    cyl(g,.035,.035,.33,c,.57,1.59,-.12,{rz:Math.PI/2,center:true,seg:8,ol:.012});
    sph(g,.48,'#6fcf7a',-.2,2.37,-.25,{s:[1.2,1,.95],ws:12,hs:8});
    sph(g,.36,'#7fdcb5',.35,2.31,-.33,{ws:12,hs:8});
  }},
  // 7. Raised shallow pond, rock edge and two-sided slide-in bank. Size: footprint 3.1 x 3.5 m, height 0.359 m; pieces: 17.
  petpond:{n:'Pet pond',i:'💦',p:700,w:3.1,d:3.5,cols:['#aab8bf','#b6b1ca','#c4b89c'],b(g,c){
    cyl(g,1.35,1.4,.1,'#a7cf9a',0,0,0,{s:[1,1,.91],seg:20,ol:.025});
    cyl(g,1.18,1.23,.065,'#7fd8ff',0,.1,0,{s:[1,1,.88],seg:24,ol:.018});
    for(let k=0;k<14;k++){
      const a=k*Math.PI/7,x=Math.sin(a)*1.28,z=Math.cos(a)*1.15;
      if(z>.7&&Math.abs(x)<.65)continue;
      sph(g,.23,c,x,.18,z,{s:[1.08,.78,1],ws:9,hs:6,ol:.02});
    }
    prism(g,.72,1.45,.32,'#e8d6b0',0,0,1.0,{ol:.018});
    for(const [x,z,w] of[[-.45,-.3,.34],[.4,.05,.26],[-.65,.3,.18]])box(g,w,.004,.025,'#d8f7ff',x,.165,z,{ol:false});
  }},
  // 8. Hollow cave den with a bear-sized entrance. Size: footprint 3.7 x 3.1 m, height 2.394 m; pieces: 17.
  caveden:{n:'Cave den',i:'🪨',p:700,w:3.7,d:3.1,cols:['#aab8bf','#b6b1ca','#b6aa99'],b(g,c){
    cyl(g,1.45,1.45,.055,'#d7c7a5',0,0,-.02,{s:[1,1,.85],seg:16,ol:.02});
    for(const x of[-1.25,1.25])for(const z of[-.65,.65])sph(g,.58,c,x,.64,z,{s:[.9,1.1,1.02],ws:9,hs:7,ol:.025});
    for(const x of[-1.16,1.16])sph(g,.5,c,x,1.37,-.25,{s:[.95,1,1.6],ws:9,hs:7,ol:.025});
    for(const x of[-.65,.65])sph(g,.62,c,x,1.96,-.2,{s:[1.15,.7,1.65],ws:9,hs:7,ol:.025});
    sph(g,.65,c,0,1.94,-.15,{s:[1,.64,1.7],ws:9,hs:7,ol:.025});
    for(const x of[-.58,.58])sph(g,.61,c,x,.68,-1.0,{s:[1.08,1.1,.45],ws:9,hs:7,ol:.025});
    sph(g,.65,c,0,1.25,-.98,{s:[1.65,.8,.48],ws:9,hs:7,ol:.025});
    cyl(g,.74,.74,.055,'#e8d6b0',0,.055,.02,{s:[1,1,.8],seg:16,ol:.012});
    for(const [x,z] of[[-.3,.25],[.15,.4],[.25,-.12]])box(g,.28,.008,.025,'#c98f5e',x,.11,z,{ry:.3,ol:false});
  }},
  // 9. Warm glass tank with branch, basking rock and lamp. Size: footprint 1.3 x 0.76 m, height 0.975 m; pieces: 22.
  warmtank:{n:'Warm glass tank',i:'🦎',p:400,w:1.3,d:.76,cols:['#5fd4b0','#b79cff','#ff8a6b','#7cc8ff'],b(g,c){
    box(g,1.22,.1,.66,c,0,0,0,{ol:.02});
    box(g,1.1,.035,.54,'#e8d6b0',0,.1,0,{ol:false});
    for(const x of[-.58,.58])for(const z of[-.29,.29])box(g,.045,.65,.045,c,x,.1,z,{ol:.012});
    for(const z of[-.29,.29])box(g,1.2,.045,.045,c,0,.75,z,{ol:.012});
    for(const x of[-.58,.58])box(g,.045,.045,.6,c,x,.75,0,{ol:.012});
    for(const [w,d,x,z] of[[1.11,.012,0,-.29],[1.11,.012,0,.29],[.012,.54,-.58,0],[.012,.54,.58,0]]){
      const pane=box(g,w,.6,d,'#bfe6ff',x,.14,z,{ol:false});
      pane.material=pane.material.clone();pane.material.userData.plain=0;pane.material.transparent=true;pane.material.opacity=.16;pane.material.depthWrite=false;
    }
    cyl(g,.04,.055,.62,'#a8714a',-.12,.425,-.03,{rz:-.55,center:true,seg:8,ol:.012});
    cyl(g,.028,.035,.27,'#a8714a',.075,.57,-.03,{rz:.85,center:true,seg:8,ol:.01});
    sph(g,.18,'#aab8bf',.3,.234,.06,{s:[1,.55,.85],ws:9,hs:6,ol:.015});
    cyl(g,.018,.018,.16,'#3d2c5e',.34,.795,-.29,{seg:7,ol:.008});
    box(g,.27,.035,.12,'#3d2c5e',.215,.94,-.255,{ol:.008});
    cyl(g,.065,.13,.11,'#ffd45c',.1,.83,-.22,{seg:12,ol:.014});
    cyl(g,.105,.105,.012,'#fff3c4',.1,.818,-.22,{seg:12,ol:false});
    box(g,.17,.014,.008,'#ffffff',-.35,.58,.301,{ol:false});
  }},
  // 10. Dog agility set: two jump bars, open tunnel and weave poles. Size: footprint 4.2 x 3.2 m, height 0.9 m; pieces: 36.
  dogagility:{n:'Dog agility course',i:'🐕',p:300,w:4.2,d:3.2,cols:['#7cc8ff','#ff8a6b','#5fd4b0','#b79cff'],b(g,c){
    for(const x of[-1.8,-.45]){
      box(g,.3,.07,.4,'#fff6e4',x,0,.8,{ol:.015});
      cyl(g,.035,.045,.83,c,x,.07,.8,{seg:8,ol:.012});
    }
    for(const y of[.38,.68]){
      cyl(g,.035,.035,1.35,c,-1.125,y,.8,{rz:Math.PI/2,center:true,seg:10,ol:.012});
      cyl(g,.037,.037,.35,'#fff6e4',-1.125,y,.8,{rz:Math.PI/2,center:true,seg:10,ol:false});
    }
    for(const x of[.47,1.53])box(g,.16,.08,1.55,c,x,0,.03,{ol:.015});
    for(let k=0;k<8;k++){
      const a=(k+.5)*Math.PI/8;
      box(g,.224,.085,1.5,k%2?c:'#ffd45c',1+Math.cos(a)*.56,.065+Math.sin(a)*.56,.03,{rz:a+Math.PI/2,center:true,ol:.012});
    }
    for(let k=0;k<6;k++){
      const x=-1.65+k*.66;
      cyl(g,.12,.15,.055,'#fff6e4',x,0,-1.15,{seg:10,ol:.012});
      cyl(g,.025,.03,.7,c,x,.055,-1.15,{seg:8,ol:.008});
      cyl(g,.027,.027,.1,'#ffd45c',x,.55,-1.15,{seg:8,ol:false});
    }
  }},
  // 11. Cat tower with scratching posts and a dangling feather wand. Size: footprint 1.3 x 1 m, height 1.82 m; pieces: 13.
  catwandtower:{n:'Cat tower and feather wand',i:'🐈',p:200,w:1.3,d:1,cols:['#b79cff','#7cc8ff','#ff9ec4','#5fd4b0'],b(g,c){
    box(g,1.2,.1,.9,c,0,0,0,{ol:.025});
    cyl(g,.075,.09,1.55,'#e8d6b0',-.22,.1,-.18,{seg:10,ol:.02});
    cyl(g,.075,.09,.8,'#e8d6b0',.25,.1,.2,{seg:10,ol:.02});
    box(g,.65,.08,.55,c,-.22,1.65,-.18,{ol:.025});
    box(g,.55,.08,.5,c,.25,.9,.2,{ol:.025});
    cyl(g,.23,.23,.09,'#fff6e4',-.22,1.73,-.18,{seg:16,ol:.018});
    for(const y of[.25,.45,.65])cyl(g,.078,.078,.035,'#c98f5e',.25,y,.2,{seg:10,ol:false});
    cyl(g,.015,.015,.57,'#a8714a',.42,1.2,.2,{rz:-.55,center:true,seg:7,ol:.005});
    cyl(g,.005,.005,.27,'#fff6e4',.57,1.17,.2,{seg:5,ol:false});
    sph(g,.07,'#ff9ec4',.57,1.1,.2,{s:[.4,1.2,.65],ws:10,hs:7,ol:.006});
    sph(g,.045,'#ffd45c',.57,1.08,.2,{s:[.4,1.1,.65],ws:8,hs:6,ol:.005});
  }},
  // 12. Three low bunny hop hurdles. Size: footprint 1.15 x 1.8 m, height 0.52 m; pieces: 18.
  bunnyhurdles:{n:'Bunny hop hurdles',i:'🐇',p:150,w:1.15,d:1.8,cols:['#ff9ec4','#7cc8ff','#5fd4b0','#b79cff'],b(g,c){
    for(const [z,h] of[[-.65,.44],[0,.32],[.65,.2]]){
      for(const x of[-.42,.42]){
        box(g,.22,.05,.24,'#fff6e4',x,0,z,{ol:.012});
        cyl(g,.022,.03,h+.03,c,x,.05,z,{seg:8,ol:.008});
      }
      cyl(g,.025,.025,.84,c,0,h+.05,z,{rz:Math.PI/2,center:true,seg:8,ol:.008});
      cyl(g,.027,.027,.18,'#ffd45c',0,h+.05,z,{rz:Math.PI/2,center:true,seg:8,ol:false});
    }
  }},
  // 13. Open hamster wheel and hollow U-shaped tube maze. Size: footprint 1.95 x 1.05 m, height 0.868 m; pieces: 49.
  hamsterplay:{n:'Hamster wheel and tube maze',i:'🐹',p:150,w:1.95,d:1.05,cols:['#7cc8ff','#ff9ec4','#b79cff','#5fd4b0'],b(g,c){
    box(g,1.85,.06,.98,'#fff6e4',0,0,0,{ol:.018});
    for(const z of[-.4,.14])box(g,.065,.45,.06,c,-.48,.06,z,{ol:.012});
    cyl(g,.025,.025,.6,'#c98f5e',-.48,.48,-.13,{rx:Math.PI/2,center:true,seg:8,ol:.008});
    for(let k=0;k<8;k++){
      const a=k*Math.PI/4,x=-.48+Math.cos(a)*.36,y=.48+Math.sin(a)*.36;
      for(const z of[-.26,0])cyl(g,.028,.028,.301,c,x,y,z,{rz:a,center:true,seg:8,ol:.008});
      cyl(g,.017,.017,.26,'#e8d6b0',x,y,-.13,{rx:Math.PI/2,center:true,seg:7,ol:.005});
    }
    for(let k=0;k<3;k++){
      const a=k*Math.PI*2/3;
      cyl(g,.012,.012,.36,c,-.48+Math.cos(a)*.18,.48+Math.sin(a)*.18,-.26,{rz:a-Math.PI/2,center:true,seg:6,ol:false});
    }
    for(const x of[.3,.74])for(let k=0;k<6;k++){
      const a=k*Math.PI/3;
      const panel=box(g,.117,.018,.55,c,x+Math.cos(a)*.1,.182+Math.sin(a)*.1,.05,{rz:a+Math.PI/2,center:true,ol:.005});
      panel.material=panel.material.clone();panel.material.userData.plain=0;panel.material.transparent=true;panel.material.opacity=.6;panel.material.depthWrite=false;
    }
    for(let k=0;k<6;k++){
      const a=k*Math.PI/3;
      const panel=box(g,.64,.018,.117,c,.52,.182+Math.sin(a)*.1,-.225+Math.cos(a)*.1,{rx:-a-Math.PI/2,center:true,ol:.005});
      panel.material=panel.material.clone();panel.material.userData.plain=0;panel.material.transparent=true;panel.material.opacity=.6;panel.material.depthWrite=false;
    }
  }},
  // 14. Monkey climbing frame with a side ladder and two open rings. Size: footprint 2.1 x 1.65 m, height 1.852 m; pieces: 40.
  monkeybars:{n:'Monkey bars and rings',i:'🐒',p:250,w:2.1,d:1.65,cols:['#5fd4b0','#7cc8ff','#b79cff','#ff8a6b'],b(g,c){
    for(const x of[-.8,.8])for(const z of[-.6,.6]){
      box(g,.28,.08,.3,'#fff6e4',x,0,z,{ol:.015});
      cyl(g,.05,.065,1.72,c,x,.08,z,{seg:10,ol:.018});
    }
    for(const z of[-.6,.6])cyl(g,.055,.055,1.75,c,0,1.8,z,{rz:Math.PI/2,center:true,seg:10,ol:.018});
    for(const x of[-.8,-.4,0,.4,.8])cyl(g,.03,.03,1.2,'#e8d6b0',x,1.8,0,{rx:Math.PI/2,center:true,seg:8,ol:.01});
    for(const y of[.45,.85,1.25])cyl(g,.03,.03,1.2,'#e8d6b0',-.8,y,0,{rx:Math.PI/2,center:true,seg:8,ol:.01});
    for(const x of[-.32,.32]){
      cyl(g,.01,.01,.67,'#e8d6b0',x,1.13,.6,{seg:6,ol:false});
      for(let k=0;k<10;k++){
        const a=k*Math.PI/5;
        cyl(g,.022,.022,.099,'#ffd45c',x+Math.cos(a)*.15,.98+Math.sin(a)*.15,.6,{rz:a,center:true,seg:8,ol:.006});
      }
    }
  }},
  // 15. Seal's colourful ball, supported by a shallow cup. Size: footprint 1 x 1 m, height 1.25 m; pieces: 5.
  sealballstand:{n:'Seal ball on a stand',i:'🦭',p:200,w:1,d:1,cols:['#ff8a6b','#7cc8ff','#ffd45c','#b79cff'],b(g,c){
    cyl(g,.4,.45,.08,'#5fd4b0',0,0,0,{seg:16,ol:.02});
    cyl(g,.055,.08,.64,'#fff6e4',0,.08,0,{seg:10,ol:.018});
    cyl(g,.19,.06,.09,'#5fd4b0',0,.71,0,{seg:14,ol:.018});
    sph(g,.24,c,0,1.01,0,{ws:14,hs:10,ol:.018});
    cyl(g,.242,.242,.028,'#fff6e4',0,1.01,0,{center:true,seg:16,ol:false});
  }},
  // 16. Bear log and an open tyre hanging from a wooden frame. Size: footprint 2.3 x 1.7 m, height 1.921 m; pieces: 28.
  bearlogtyre:{n:'Bear log and tyre swing',i:'🐻',p:250,w:2.3,d:1.7,cols:['#c98f5e','#a8714a','#d7a575'],b(g,c){
    for(const x of[-.9,.9])for(const s of[-1,1]){
      box(g,.26,.08,.24,'#e8d6b0',x,0,s*.54,{ol:.015});
      cyl(g,.055,.065,1.85,c,x,.94,s*.27,{rx:-s*.3,center:true,seg:9,ol:.018});
    }
    cyl(g,.075,.075,2.1,c,0,1.85,0,{rz:Math.PI/2,center:true,seg:10,ol:.02});
    for(const x of[-.28,.28])cyl(g,.016,.016,.73,'#e8d6b0',x,1.1,0,{seg:7,ol:.006});
    for(let k=0;k<12;k++){
      const a=k*Math.PI/6;
      cyl(g,.075,.075,.226,'#3d2c5e',Math.cos(a)*.42,.8+Math.sin(a)*.42,0,{rz:a,center:true,seg:10,ol:false});
    }
    cyl(g,.23,.23,1.35,c,0,.23,.55,{rz:Math.PI/2,center:true,seg:12,ol:.02});
    for(const x of[-.684,.684]){
      cyl(g,.185,.185,.018,'#e8d6b0',x,.23,.55,{rz:Math.PI/2,center:true,seg:12,ol:false});
      cyl(g,.095,.095,.021,'#c98f5e',x,.23,.55,{rz:Math.PI/2,center:true,seg:10,ol:false});
    }
  }},
  // 17. Woven open snake basket and a small flute on the floor. Size: footprint 0.66 x 0.9 m, height 0.403 m; pieces: 32.
  snakebasket:{n:'Snake flute and basket',i:'🪈',p:150,w:.66,d:.9,cols:['#c98f5e','#d7a575','#b89067'],b(g,c){
    cyl(g,.255,.23,.055,c,0,0,-.12,{seg:8,ol:.012});
    for(let k=0;k<8;k++){
      const a=k*Math.PI/4,x=Math.sin(a)*.235,z=-.12+Math.cos(a)*.235;
      box(g,.2,.32,.032,c,x,.055,z,{ry:a,ol:.006});
      for(const y of[.16,.375])box(g,.211,.028,.041,'#e8d6b0',x,y,z,{ry:a,ol:.006});
    }
    cyl(g,.018,.018,.45,'#ffd45c',0,.025,.38,{rz:Math.PI/2,center:true,seg:10,ol:.005});
    cyl(g,.025,.025,.055,'#c98f5e',.245,.025,.38,{rz:Math.PI/2,center:true,seg:9,ol:.005});
    sph(g,.028,'#c98f5e',-.23,.025,.38,{s:[1,.8,1],ws:8,hs:6,ol:.004});
    for(const x of[-.12,-.06,0,.06])sph(g,.007,'#3d2c5e',x,.042,.38,{s:[1,.25,1],ws:6,hs:4,ol:false});
  }},
  // 18a. Open-front stable with two separated stalls. Size: footprint 4.55 x 3.15 m, height 3.425 m; pieces: 28.
  farmstable:{n:'Stable with stalls',i:'🐴',p:0,w:4.55,d:3.15,cols:['#ff8a6b','#5fd4b0','#7cc8ff','#b79cff'],b(g,c){
    box(g,4.1,.08,2.7,'#d7c7a5',0,0,0,{ol:.025});
    for(const x of[-2,2])for(const z of[-1.25,1.25])box(g,.15,2.4,.15,'#fff6e4',x,.08,z);
    box(g,.15,2.4,.15,'#fff6e4',0,.08,1.25);
    box(g,4,1.6,.1,'#c98f5e',0,.08,-1.25);
    for(const x of[-2,2])box(g,.1,1.6,2.5,'#c98f5e',x,.08,0);
    box(g,.1,1.35,2.4,'#c98f5e',0,.08,0,{ol:.025});
    for(const x of[-1,1]){
      for(const y of[.3,.9])box(g,1.85,.09,.08,'#e8d6b0',x,y,1.25,{ol:.018});
      for(const dx of[-.55,0,.55])box(g,.055,.56,.065,'#e8d6b0',x+dx,.39,1.25,{ol:.012});
      cyl(g,.43,.43,.09,'#ffd982',x,.08,-.5,{s:[1,1,.85],seg:12,ol:.012});
    }
    for(const z of[-1.25,1.25])box(g,4.25,.14,.16,'#fff6e4',0,2.34,z);
    for(const x of[-2,2])box(g,.16,.14,2.5,'#fff6e4',x,2.34,0);
    prism(g,2.95,4.4,.9,c,0,2.48,0,{ry:Math.PI/2});
    cyl(g,.045,.045,3.02,'#fff6e4',0,3.38,0,{rx:Math.PI/2,center:true,seg:8,ol:.015});
  }},
  // 18b. Barn with double braced doors and side windows. Size: footprint 3.95 x 3.1 m, height 3.17 m; pieces: 33.
  farmbarn:{n:'Barn',i:'🏡',p:0,w:3.95,d:3.1,cols:['#ff8a6b','#e88f8f','#5fd4b0','#7cc8ff'],b(g,c){
    box(g,3.6,.08,2.8,'#d7c7a5',0,0,0,{ol:.025});
    box(g,3.4,2.2,.1,c,0,.08,-1.25);
    for(const x of[-1.65,1.65])box(g,.1,2.2,2.6,c,x,.08,0);
    for(const x of[-1.35,1.35])box(g,.7,2.2,.1,c,x,.08,1.25);
    box(g,3.4,.5,.1,c,0,1.78,1.25);
    for(const x of[-1.7,1.7])for(const z of[-1.3,1.3])box(g,.095,2.2,.095,'#fff6e4',x,.08,z,{ol:.018});
    for(const x of[-.5,.5]){
      box(g,.95,1.6,.075,'#c98f5e',x,.08,1.32,{ol:.018});
      for(const rz of[-.5,.5])box(g,.06,1.55,.035,'#fff6e4',x,.89,1.38,{rz,center:true,ol:.01});
    }
    for(const x of[-1.03,1.03])box(g,.085,1.72,.09,'#fff6e4',x,.08,1.34,{ol:.015});
    box(g,2.14,.1,.09,'#fff6e4',0,1.75,1.34,{ol:.015});
    for(const x of[-.12,.12])box(g,.025,.12,.035,'#3d2c5e',x,.82,1.43,{ol:false});
    box(g,.55,.25,.035,'#fff6e4',0,1.93,1.31,{ol:.012});
    box(g,.43,.17,.02,'#a8714a',0,1.97,1.34,{ol:false});
    box(g,.03,.17,.025,'#fff6e4',0,1.97,1.355,{ol:false});
    for(const s of[-1,1]){
      box(g,.025,.55,.7,'#fff6e4',s*1.715,1.1,.15,{ol:.012});
      box(g,.025,.43,.58,'#9fd4f2',s*1.737,1.16,.15,{ol:false});
      box(g,.025,.035,.6,'#fff6e4',s*1.755,1.35,.15,{ol:false});
    }
    prism(g,2.98,3.85,.85,'#675287',0,2.28,0,{ry:Math.PI/2});
    cyl(g,.04,.04,3.02,'#fff6e4',0,3.13,0,{rx:Math.PI/2,center:true,seg:8,ol:.012});
  }},
  // 18c. Raised chicken coop, three open nesting boxes, eggs and ramp. Size: footprint 2.65 x 2.7 m, height 2.12 m; pieces: 29.
  farmcoop:{n:'Chicken coop with nesting boxes',i:'🐔',p:0,w:2.65,d:2.7,cols:['#ffd45c','#ff8a6b','#5fd4b0','#7cc8ff'],b(g,c){
    for(const x of[-1,1])for(const z of[-1.05,.35])box(g,.1,.32,.1,'#a8714a',x,0,z,{ol:.02});
    box(g,2.2,.1,1.6,'#c98f5e',0,.32,-.35,{ol:.025});
    box(g,2.2,1.18,.08,c,0,.42,-1.1,{ol:.025});
    for(const x of[-1.06,1.06])box(g,.08,1.18,1.5,c,x,.42,-.35,{ol:.025});
    for(const x of[-1.03,1.03])box(g,.1,1.18,.1,'#fff6e4',x,.42,.35,{ol:.02});
    box(g,2.12,.08,.1,'#fff6e4',0,1.52,.35,{ol:.018});
    box(g,1.98,.08,.7,'#a8714a',0,.44,.02,{ol:.018});
    for(const x of[-.99,-.33,.33,.99])box(g,.045,.61,.7,'#e8d6b0',x,.52,.02,{ol:.012});
    for(const x of[-.66,0,.66]){
      cyl(g,.23,.23,.035,'#ffd982',x,.52,.05,{s:[1,1,.8],seg:10,ol:false});
      sph(g,.055,'#fff6e4',x,.621,.05,{s:[.8,1.2,.8],ws:10,hs:7,ol:.006});
    }
    cyl(g,.035,.035,2.08,'#a8714a',0,.9,.43,{rz:Math.PI/2,center:true,seg:9,ol:.012});
    box(g,.7,.06,1.1,'#c98f5e',0,.23,.75,{rx:.33,center:true,ol:.015});
    for(const z of[.36,.61,.86,1.11])box(g,.68,.025,.055,'#e8d6b0',0,.23-Math.sin(.33)*(z-.75)+.04,z,{rx:.33,center:true,ol:.007});
    prism(g,1.9,2.5,.52,'#ff8a6b',0,1.6,-.35,{ry:Math.PI/2,ol:.025});
  }},
  // 18d. Paddock enclosure with a distinct braced front gate. Size: footprint 4.8 x 4.8 m, height 1.095 m; pieces: 38.
  farmpaddock:{n:'Paddock fence and gate',i:'🚪',p:0,w:4.8,d:4.8,cols:['#fbf7ff','#c98f5e','#d7a575'],b(g,c){
    for(const [x,z] of[[-2.2,-2.2],[2.2,-2.2],[-2.2,2.2],[2.2,2.2],[-2.2,0],[2.2,0],[0,-2.2],[-.75,2.2],[.75,2.2]]){
      box(g,.13,1.05,.13,c,x,0,z,{ol:.02});
      box(g,.17,.045,.17,'#e8d6b0',x,1.05,z,{ol:.015});
    }
    for(const y of[.3,.75]){
      box(g,4.4,.09,.075,c,0,y,-2.2,{ol:.015});
      for(const x of[-2.2,2.2])box(g,.075,.09,4.4,c,x,y,0,{ol:.015});
      for(const x of[-1.475,1.475])box(g,1.45,.09,.075,c,x,y,2.2,{ol:.015});
    }
    for(const y of[.25,.83])box(g,1.45,.08,.08,'#c98f5e',0,y,2.2,{ol:.015});
    for(const x of[-.6,-.2,.2,.6])box(g,.055,.62,.065,'#c98f5e',x,.25,2.2,{ol:.012});
    box(g,1.36,.055,.055,'#e8d6b0',0,.57,2.25,{rz:.4,center:true,ol:.008});
    for(const y of[.3,.83])box(g,.14,.07,.025,'#675287',-.7,y,2.255,{ol:false});
    box(g,.18,.045,.04,'#675287',.67,.63,2.26,{ol:.008});
  }},
  // 18e. Open water trough with a visible inset water surface. Size: footprint 1.6 x 0.64 m, height 0.43 m; pieces: 9.
  farmtrough:{n:'Water trough',i:'💧',p:0,w:1.6,d:.64,cols:['#aab8bf','#7cc8ff','#5fd4b0','#b79cff'],b(g,c){
    box(g,1.5,.08,.55,c,0,0,0,{ol:.02});
    for(const x of[-.705,.705])box(g,.09,.35,.55,c,x,.08,0,{ol:.018});
    for(const z of[-.235,.235])box(g,1.32,.35,.08,c,0,.08,z,{ol:.018});
    box(g,1.31,.04,.385,'#7fd8ff',0,.21,0,{ol:false});
    for(const [x,z,w] of[[-.35,-.06,.2],[.18,.05,.25],[.43,-.04,.1]])box(g,w,.005,.018,'#d8f7ff',x,.25,z,{ol:false});
  }},
  // 18f. Bound rectangular hay bale. Size: footprint 0.96 x 0.62 m, height 0.52 m; pieces: 9.
  farmhay:{n:'Hay bale',i:'🌾',p:0,w:.96,d:.62,cols:['#ffd982','#e8c56b','#e8d6b0'],b(g,c){
    box(g,.9,.5,.55,c,0,0,0,{ol:.02});
    for(const x of[-.25,.25])box(g,.05,.52,.575,'#a8714a',x,0,0,{ol:false});
    for(const [x,y] of[[-.36,.13],[-.1,.2],[.1,.36],[.35,.3],[-.05,.44],[.05,.1]])box(g,.11,.012,.012,'#c98f5e',x,y,.282,{rz:.12,ol:false});
  }},
  // 18g. Open feed bucket, grain and arched carrying handle. Size: footprint 0.5 x 0.5 m, height 0.538 m; pieces: 23.
  farmfeedbucket:{n:'Feed bucket',i:'🪣',p:0,w:.5,d:.5,cols:['#7cc8ff','#5fd4b0','#b79cff','#aab8bf'],b(g,c){
    cyl(g,.2,.17,.055,c,0,0,0,{seg:8,ol:.012});
    for(let k=0;k<8;k++){
      const a=k*Math.PI/4;
      box(g,.157,.28,.035,c,Math.sin(a)*.18,.055,Math.cos(a)*.18,{ry:a,ol:.007});
    }
    cyl(g,.15,.15,.18,'#d7a575',0,.055,0,{seg:10,ol:false});
    for(const [x,z] of[[0,0],[-.08,0],[.08,0],[-.04,-.07],[.04,-.07],[-.04,.07],[.04,.07]])sph(g,.025,'#ffd982',x,.26,z,{ws:6,hs:5,ol:false});
    for(let k=0;k<6;k++){
      const a=(k+.5)*Math.PI/6;
      cyl(g,.012,.012,.103,'#3d2c5e',Math.cos(a)*.19,.33+Math.sin(a)*.19,0,{rz:a,center:true,seg:7,ol:.004});
    }
  }},
  // 18h. Open egg basket with five eggs and a handle. Size: footprint 0.56 x 0.56 m, height 0.456 m; pieces: 20.
  farmeggbasket:{n:'Egg basket',i:'🥚',p:0,w:.56,d:.56,cols:['#c98f5e','#d7a575','#b89067'],b(g,c){
    cyl(g,.24,.22,.05,c,0,0,0,{seg:8,ol:.01});
    for(let k=0;k<8;k++){
      const a=k*Math.PI/4;
      box(g,.19,.15,.032,c,Math.sin(a)*.22,.05,Math.cos(a)*.22,{ry:a,ol:.007});
    }
    for(const [x,z] of[[0,0],[-.11,0],[.11,0],[-.055,.1],[.055,-.1]])sph(g,.061,'#fff6e4',x,.123,z,{s:[.8,1.2,.8],ws:10,hs:8,ol:.006});
    for(let k=0;k<6;k++){
      const a=(k+.5)*Math.PI/6;
      cyl(g,.018,.018,.126,'#e8d6b0',Math.cos(a)*.23,.2+Math.sin(a)*.23,0,{rz:a,center:true,seg:8,ol:.005});
    }
  }},
  // 18i. Traditional milk can with side handles and a lid. Size: footprint 0.57 x 0.45 m, height 0.905 m; pieces: 16.
  farmmilkcan:{n:'Milk can',i:'🥛',p:0,w:.57,d:.45,cols:['#aab8bf','#bfe6ff','#fbf7ff'],b(g,c){
    cyl(g,.205,.205,.035,'#675287',0,0,0,{seg:14,ol:.012});
    cyl(g,.18,.18,.55,c,0,.035,0,{seg:14,ol:.015});
    cyl(g,.1,.18,.12,c,0,.585,0,{seg:14,ol:.012});
    cyl(g,.1,.1,.1,c,0,.705,0,{seg:12,ol:.012});
    cyl(g,.13,.13,.04,'#675287',0,.805,0,{seg:14,ol:.012});
    for(const x of[-.06,.06])box(g,.02,.04,.03,'#675287',x,.845,0,{ol:.005});
    box(g,.14,.02,.03,'#675287',0,.885,0,{ol:.005});
    for(const s of[-1,1]){
      for(const y of[.39,.54])box(g,.075,.025,.035,'#675287',s*.21,y,0,{ol:.005});
      box(g,.025,.175,.035,'#675287',s*.245,.39,0,{ol:.005});
    }
    for(const y of[.09,.5])cyl(g,.183,.183,.025,'#675287',0,y,0,{seg:14,ol:false});
  }},
  // 18j. Farm sign: the word FARM is made from solid helper-built strokes. Size: footprint 1.12 x 0.4 m, height 1.13 m; pieces: 18.
  farmsign:{n:'Farm sign',i:'🌾',p:0,w:1.12,d:.4,cols:['#ffd45c','#5fd4b0','#7cc8ff','#ff9ec4'],b(g,c){
    box(g,.3,.055,.3,'#a8714a',0,0,0,{ol:.018});
    box(g,.1,.87,.1,'#c98f5e',0,.055,0,{ol:.018});
    box(g,1.02,.43,.1,c,0,.7,.025,{ol:.025});
    // F
    box(g,.025,.2,.016,'#3d2c5e',-.365,.82,.09,{ol:false});
    box(g,.11,.025,.016,'#3d2c5e',-.3225,.995,.09,{ol:false});
    box(g,.09,.025,.016,'#3d2c5e',-.3325,.91,.09,{ol:false});
    // A
    for(const [x,rz] of[[-.134,-.28],[-.076,.28]])box(g,.023,.205,.016,'#3d2c5e',x,.92,.09,{rz,center:true,ol:false});
    box(g,.085,.023,.016,'#3d2c5e',-.105,.895,.09,{ol:false});
    // R
    box(g,.025,.2,.016,'#3d2c5e',.075,.82,.09,{ol:false});
    for(const y of[.995,.91])box(g,.1,.025,.016,'#3d2c5e',.1125,y,.09,{ol:false});
    box(g,.025,.085,.016,'#3d2c5e',.15,.93,.09,{ol:false});
    box(g,.023,.12,.016,'#3d2c5e',.13,.865,.09,{rz:.6,center:true,ol:false});
    // M
    for(const x of[.27,.41])box(g,.025,.2,.016,'#3d2c5e',x,.82,.09,{ol:false});
    for(const [x,rz] of[[.305,.6],[.375,-.6]])box(g,.025,.12,.016,'#3d2c5e',x,.96,.09,{rz,center:true,ol:false});
  }}
};
globalThis.COZY_PET_OBJECTS = COZY_PET_OBJECTS;


;
/* ===== Cozy Town model pack: living things — how to build one item =====
   Needs THREE r128 loaded first. Call initMaterials(true) once before building (the game does this already).
   item = one row of pack-list.json. opts = the kept version; add age / c (colour) from item.ages / item.colours.
   Returns a THREE.Group, origin = floor centre, front = +z, 1 m = 1.23 game units. */
function buildPackItem(item,extra){const g=new THREE.Group();const M=PU[item.id];
  M.build(g,Object.assign({},M.dflt,item.opts||{},extra||{}));return g;}
globalThis.buildPackItem=buildPackItem;
