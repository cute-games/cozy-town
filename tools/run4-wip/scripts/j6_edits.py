# Run 4, job 6 (items 14, 16, 17, 18): the food truck, soft clouds, leaves from the crowns. Exact-match edits for edit.py.
import json
E = []
# ---- clouds: a soft shaded material of their own, no outline hull ----
E.append(["  CLOUD=toon({color:'#ffffff',fog:false});",
          """  CLOUD=new THREE.ShaderMaterial({uniforms:{top:{value:new THREE.Color('#ffffff')},bot:{value:new THREE.Color('#dde4f0')}},   /* ☁️ soft puffs (run 4, item 18): a gentle top-to-bottom shade set by updSky, no outline, no hard dark faces */
    vertexShader:'varying float vy;void main(){vy=normalize(mat3(modelMatrix)*normal).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'uniform vec3 top,bot;varying float vy;void main(){gl_FragColor=vec4(mix(bot,top,smoothstep(-.55,.75,vy)),1.0);}',fog:false});"""])
E.append(["{mat:CLOUD,olMat:OLC,ol:.55,ws:12,hs:8,s:[1,.68,1]}", "{mat:CLOUD,ol:false,ws:12,hs:8,s:[1,.68,1]}", 2])
E.append(["  if(out){\n    hemi.intensity=lerp(a[4],b[4],t)",
          "  {const gk=out?WX.sky:0,U=CLOUD.uniforms;U.top.value.set('#ffffff').lerp(_c2.set('#d3d9e4'),gk).lerp(_c1.set('#9aa1c8'),nf);U.bot.value.set('#dde4f0').lerp(_c2.set('#a9b2c2'),gk).lerp(_c1.set('#5d6489'),nf);}   /* ☁️ clouds: white tops and blue-grey undersides by day, grey in grey weather, gently lit blue-grey at night (run 4, item 18) */\n  if(out){\n    hemi.intensity=lerp(a[4],b[4],t)"])
# ---- every town tree is remembered: the autumn leaves fall from the crowns near you ----
E.append(["let renderer,scene,camera,hemi,sun,lamp,skyMesh,skyU,stars,sunSprite,moonSprite,FOG,outside,clouds=[];",
          "let renderer,scene,camera,hemi,sun,lamp,skyMesh,skyU,stars,sunSprite,moonSprite,FOG,outside,clouds=[];\nconst TREES=[];   /* 🌳 every round tree in town (x, z, size, its group): the autumn leaves fall from the crowns near you (run 4, item 18) */"])
E.append(["function tree(g,x,z,s=1){const c=pick(TREE_COLS);", "function tree(g,x,z,s=1){TREES.push([x,z,s,g]);const c=pick(TREE_COLS);"])
# ---- the weather clouds: rain and snow only; the leaves get a cloud of their own ----
E.append(["@between", "/* a falling cloud of drops around the camera, moved on the GPU: y wraps every H metres, so it never runs out */", "o.userData.keep=1;o.userData.wx=kind;return o;}",
r"""/* a falling cloud of drops around the camera, moved on the GPU: y wraps every H metres, so it never runs out */
function wxCloud(kind,n){const H=18,W=28,rain=kind==='rain',pos=new Float32Array(n*(rain?6:3)),spd=new Float32Array(n*(rain?2:1)),ph=new Float32Array(n*(rain?2:1)),dy=new Float32Array(n*2);
  const r=seeded(rain?31:32);
  for(let i=0;i<n;i++){const x=(r()-.5)*W,y=r()*H,z=(r()-.5)*W,s=rain?12+r()*5:.9+r()*.7,p=r()*6.28;
    if(rain){pos.set([x,y,z,x,y,z],i*6);spd.set([s,s],i*2);ph.set([p,p],i*2);dy.set([0,.5],i*2);}else{pos.set([x,y,z],i*3);spd[i]=s;ph[i]=p;}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('spd',new THREE.BufferAttribute(spd,1));g.setAttribute('ph',new THREE.BufferAttribute(ph,1));
  if(rain)g.setAttribute('dy',new THREE.BufferAttribute(dy,1));
  const u={t:{value:0},op:{value:0},H:{value:H},pr:{value:Math.min(2,window.devicePixelRatio||1)}};
  const vs=rain?`uniform float t,H;attribute float spd,ph,dy;void main(){vec3 p=position;p.y=mod(p.y-t*spd,H)+dy;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`
    :`uniform float t,H,pr;attribute float spd,ph;void main(){vec3 p=position;p.y=mod(p.y-t*spd,H);p.x+=sin(t*.8+ph)*.5;p.z+=cos(t*.6+ph)*.35;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=clamp(70.0/max(1.0,-mv.z),2.0,9.0)*pr;gl_Position=projectionMatrix*mv;}`;
  const fs=rain?`uniform float op;void main(){gl_FragColor=vec4(.78,.85,.97,op*.5);}`
    :`uniform float op;void main(){vec2 c=gl_PointCoord-.5;if(dot(c,c)>.25)discard;gl_FragColor=vec4(1.0,1.0,1.0,op*.9);}`;
  const m=new THREE.ShaderMaterial({uniforms:u,vertexShader:vs,fragmentShader:fs,transparent:true,depthWrite:false,fog:false});
  const o=rain?new THREE.LineSegments(g,m):new THREE.Points(g,m);o.frustumCulled=false;o.visible=false;o.renderOrder=5;o.userData.keep=1;o.userData.wx=kind;return o;}
/* 🍂 autumn leaves fall from the tree crowns around you (run 4, item 18: they used to be little orange diamonds anywhere in a 28 m box reaching 13 m over your head, so they showed high in the night sky).
   90 leaves on the GPU: each belongs to one of the nearest round trees (dealt again once a second as you walk), starts inside its crown, tumbles down to the ground and starts over; none without a tree nearby */
const LEAF={n:90,t:9,loc:null,trees:null,near:0};
function leafCloud(n){const r=seeded(33),LC=[[1,.55,.2],[.95,.3,.25],[1,.8,.25],[.9,.45,.15]],pos=new Float32Array(n*3),org=new Float32Array(n*4),spd=new Float32Array(n),ph=new Float32Array(n),col=new Float32Array(n*3);
  for(let i=0;i<n;i++){const a=r()*6.28,d=Math.sqrt(r());pos.set([Math.cos(a)*d,r(),Math.sin(a)*d],i*3);spd[i]=.5+r()*.5;ph[i]=r()*6.28;col.set(LC[i%4],i*3);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('org',new THREE.BufferAttribute(org,4));g.setAttribute('spd',new THREE.BufferAttribute(spd,1));g.setAttribute('ph',new THREE.BufferAttribute(ph,1));g.setAttribute('col',new THREE.BufferAttribute(col,3));
  const u={t:{value:0},op:{value:0},pr:{value:Math.min(2,window.devicePixelRatio||1)}};
  const vs=`uniform float t,pr;attribute vec4 org;attribute float spd,ph;attribute vec3 col;varying vec3 vc;varying float va;
    void main(){vc=col;float top=max(org.y,.5),fall=mod(t*spd+ph*1.7,top),k=fall/top;
      vec3 p=vec3(org.x+position.x*org.w+sin(t*.9+ph)*.45+k*sin(ph)*1.2,top-fall,org.z+position.z*org.w+cos(t*.7+ph)*.45+k*cos(ph)*1.2);
      va=ph+t*spd*2.5;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=clamp(120.0/max(1.0,-mv.z),2.0,16.0)*pr;gl_Position=projectionMatrix*mv;}`;
  const fs=`uniform float op;varying vec3 vc;varying float va;void main(){vec2 c=gl_PointCoord-.5;float s=sin(va),co=cos(va);c=vec2(c.x*co-c.y*s,c.x*s+c.y*co);
      float w=.23*(1.0-c.y*c.y/.2116);if(abs(c.y)>.46||abs(c.x)>w)discard;float rib=abs(c.x)<.018?.78:1.0;gl_FragColor=vec4(vc*rib,op*.95);}`;   /* a pointed oval with a midrib: a leaf */
  const m=new THREE.ShaderMaterial({uniforms:u,vertexShader:vs,fragmentShader:fs,transparent:true,depthWrite:false,fog:false});
  const o=new THREE.Points(g,m);o.frustumCulled=false;o.visible=false;o.renderOrder=5;o.userData.keep=1;o.userData.wx='leaf';return o;}
/* the round trees of the place you are in, in world coordinates (found once per place) */
function leafTrees(){const L=CUR;if(!L||!L.g)return[];if(LEAF.loc!==L){LEAF.loc=L;const v=new THREE.Vector3();LEAF.trees=TREES.filter(t=>{for(let p=t[3];p;p=p.parent)if(p===L.g)return true;return false;}).map(t=>{v.set(t[0],0,t[1]);t[3].localToWorld(v);return[v.x,v.z,t[2]];});}return LEAF.trees;}
function leafDeal(){const T=leafTrees(),cx=camera.position.x,cz=camera.position.z,near=[];
  for(const t of T){const d=Math.hypot(t[0]-cx,t[1]-cz);if(d<26)near.push([d,t]);}near.sort((a,b)=>a[0]-b[0]);const N=Math.min(12,near.length);LEAF.near=N;if(!N)return;
  const a=LEAFM.geometry.attributes.org;let k=0;for(let i=0;i<LEAF.n;i++){if(a.getW(i)>0&&Math.hypot(a.getX(i)-cx,a.getZ(i)-cz)<30)continue;const t=near[k++%N][1],s=t[2];a.setXYZW(i,t[0],3.05*s,t[1],1.15*s);}   /* a leaf keeps its tree while the tree is near: no jumping mid-fall */
  a.needsUpdate=true;}
function leafTick(dt,leaf){if(!LEAFM)return;LEAF.t+=dt;if(leaf>.02&&LEAF.t>1){LEAF.t=0;leafDeal();}else if(leaf<=.02)LEAF.t=9;
  LEAFM.visible=leaf>.02&&LEAF.near>0;LEAFM.material.uniforms.op.value=leaf;LEAFM.material.uniforms.t.value=WX.t;}"""])
E.append(["LEAFM=wxCloud('leaf',90);", "LEAFM=leafCloud(90);"])
E.append(["  const cam=camera.position;for(const o of[RAINM,SNOWM,LEAFM]){if(!o)continue;o.position.set(cam.x,cam.y-5,cam.z);o.material.uniforms.t.value=WX.t;}",
          "  const cam=camera.position;for(const o of[RAINM,SNOWM]){if(!o)continue;o.position.set(cam.x,cam.y-5,cam.z);o.material.uniforms.t.value=WX.t;}"])
E.append(["LEAFM.visible=leaf>.02;LEAFM.material.uniforms.op.value=leaf;", "leafTick(dt,leaf);"])
# ---- the food truck: nothing flush with anything, one outline around the awning ----
E.append(["box(st,2.1,1.25,1.1,B,x,.5,z+2.05);box(st,1.9,.7,.08,'#bfe6ff',x,1.0,z+2.56,{ol:.012});box(st,2.2,.35,.25,'#5a5f8c',x,.4,z+2.72);   /* the cab, the windscreen, the bumper */",
          "box(st,2.1,1.25,1.1,B,x,.5,z+2.05);box(st,1.9,.6,.08,'#bfe6ff',x,1.1,z+2.58,{ol:.012});box(st,2.2,.35,.25,'#5a5f8c',x,.4,z+2.72);   /* the cab, the windscreen (2 cm proud of the cab's front: it was flush with it and flickered, run 4, job 6), the bumper */"])
E.append(["  box(st,.3,.3,.3,'#fff1b8',x-.9,1.0,z+2.58,{ol:.012});box(st,.3,.3,.3,'#fff1b8',x+.9,1.0,z+2.58,{ol:.012});   /* headlights */",
          "  for(const s of[-1,1])box(st,.28,.28,.28,'#fff1b8',x+s*.76,.76,z+2.5,{ol:.012});   /* headlights over the bumper, inside the cab's width (they used to share the cab's side face and sit in the windscreen) */"])
E.append(["cyl(st,.16,.16,.32,'#c8cde0',x+wx,.38,z+wz,{rz:Math.PI/2,center:true,seg:8,ol:false});}", "cyl(st,.16,.16,.34,'#c8cde0',x+wx,.38,z+wz,{rz:Math.PI/2,center:true,seg:8,ol:false});}   /* the hub 2 cm proud of the tyre (it was 1 cm) */"])
E.append(["  for(let i=0;i<6;i++)box(st,1.1,.05,.42,i%2?W:'#ff6b6b',x+1.62,2.22,z-1.4+i*.42,{rz:.32,ol:.012});   /* the striped awning */",
          "  for(let i=0;i<6;i++)box(st,1.1,.05,.42,i%2?W:'#ff6b6b',x+1.62,2.22,z-1.4+i*.42,{rz:.32,ol:false});{const ref=new THREE.Object3D();ref.position.set(x+1.62,2.245,z-.35);ref.rotation.z=.32;hull(st,new THREE.BoxGeometry(1.124,.074,2.544),ref,{});}   /* the striped awning: six slats, one outline around the whole (each slat's own outline drew dark seams and specks, run 4, job 6) */"])
json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j6.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
