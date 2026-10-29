'use strict';
/* ================= models ================= */
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
/* 🎃 Halloween costumes (run 4, job 3): a hooded onesie over the clothes (the face stays open), with ears, a tail, spikes or a ghostly hem. Cheap boxes, baked with the body */
const COSTUMES={cat:{c:'#8e8e9e',n:'Cat'},dog:{c:'#b07a52',n:'Dog'},ghost:{c:'#f4f2ff',n:'Ghost'},dino:{c:'#5fbf74',n:'Dinosaur'},bunny:{c:'#ffffff',n:'Bunny'}};   /* 🐰 bunny: the Easter egg hunt's prize (run 4, job 11) */
function costumeFor(b,head,legs,arms,k){const C=COSTUMES[k].c,D=shade(C,-.14),o={ol:.012};
  box(b,.5,.54,.32,C,0,.59,0,o);for(const hip of legs)box(hip,.21,.5,.23,C,0,-.5,0,o);for(const sh of arms)box(sh,.17,.4,.19,C,0,-.4,0,o);   /* the onesie */
  box(head,.56,.5,.5,C,0,.03,-.08,o);   /* the hood: open at the face */
  if(k==='cat'){for(const s of[-1,1]){cone(head,.09,.17,C,s*.17,.5,-.06,{seg:4,...o});cone(head,.05,.1,'#ffb3c7',s*.17,.52,-.03,{seg:4,ol:false});for(const [y,r] of[[.125,.12],[.095,-.1]])box(head,.15,.012,.008,'#3d2c5e',s*.2,y,.231,{rz:s*r,center:true,ol:false});}sph(head,.028,'#ff9ec4',0,.16,.232,{s:[1.2,.8,.6],ws:8,hs:6,ol:false});   /* 🐱 painted whiskers and a pink nose (run 4, stage 3) */cyl(b,.035,.05,.55,C,0,.42,-.26,{rx:-1.1,center:true,seg:6,...o});sph(b,.055,D,0,.69,-.47,{ws:6,hs:5,ol:false});box(b,.26,.32,.02,'#f6f0ff',0,.6,.165,{ol:false});}
  else if(k==='bunny'){for(const s of[-1,1]){sph(head,.075,C,s*.15,.62,-.04,{s:[1,2.8,.75],ws:8,hs:6,...o});sph(head,.04,'#ffb3c7',s*.15,.64,0,{s:[1,2.4,.5],ws:6,hs:5,ol:false});}sph(b,.085,C,0,.4,-.2,{ws:8,hs:6,ol:false});box(b,.26,.32,.02,'#ffe4ee',0,.6,.165,{ol:false});}   /* 🐰 long ears with pink insides, a fluffy tail, a soft tummy */
  else if(k==='dog'){for(const s of[-1,1])box(head,.11,.28,.06,D,s*.31,.06,-.06,{rz:s*.22,...o});cyl(b,.04,.06,.36,C,0,.5,-.2,{rx:-.7,center:true,seg:6,...o});box(b,.26,.34,.02,'#f6e6c8',0,.58,.165,{ol:false});sph(head,.05,'#2e2347',0,-.07,.245,{ws:6,hs:5,ol:false});}
  else if(k==='ghost'){for(const [x,z] of[[-.17,.12],[.17,.12],[-.17,-.12],[.17,-.12],[0,.17],[0,-.17]])sph(b,.1,C,x,.34,z,{ws:7,hs:5,ol:false});box(head,.6,.1,.54,C,0,.27,-.08,{ol:false});}
  else if(k==='dino'){for(let i=0;i<3;i++)cone(head,.06,.14,D,0,.31,-.22+i*.12,{seg:4,...o});for(let i=0;i<4;i++)cone(b,.05,.12,D,0,.98-i*.16,-.17,{rx:-.5,seg:4,...o});cone(b,.11,.62,C,0,.4,-.44,{rx:-1.35,center:true,seg:7,...o});for(let i=0;i<3;i++)cone(b,.04,.1,D,0,.5-i*.07,-.36-i*.14,{rx:-.4,seg:4,ol:false});box(b,.3,.4,.02,'#ffe08a',0,.6,.165,{ol:false});}}
/* 🥳 run 4, job 11: on 31 Dec and 1 Jan everyone wears a party hat. Every person gets one at birth (hidden), in its own little baked group, and an own hat sits in a group too, so the two can swap at midnight without rebuilding anyone */
function realDate(){return new Date();}
function nyeParty(d){const m=d.getMonth(),day=d.getDate();return(m===11&&day===31)||(m===0&&day===1);}
const PARTY={on:false,hats:[],own:[],cols:['#ff6b6b','#ffd45c','#7cc8ff','#5fd4b0','#b79cff','#ff9ec4']};try{PARTY.on=nyeParty(realDate());}catch(e){}
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
/* 🎀 a proper bow: two ribbon loops pinched at a knot, with two little tails (s = size) */
function bowShape(g,s,c,o){o=o||{};const ol=o.ol===undefined?.01:o.ol,d=shade(c,-.18),lt=shade(c,.1);
  for(const sd of[-1,1]){const L=new THREE.Group();L.rotation.z=sd*.22;g.add(L);
    cone(L,.068*s,.12*s,c,sd*.062*s,0,0,{rz:sd*Math.PI/2,center:true,seg:10,s:[1,1,.55],ol});
    sph(L,.07*s,c,sd*.125*s,0,0,{s:[.72,1,.55],ws:12,hs:8,ol});
    sph(L,.034*s,d,sd*.112*s,0,.03*s,{s:[1.25,.85,.35],ws:8,hs:6,ol:false});
    box(g,.046*s,.13*s,.016*s,lt,sd*.035*s,-.15*s,-.005*s,{rz:sd*.32,ol});}
  sph(g,.04*s,d,0,0,.012*s,{s:[1,1.2,.8],ws:10,hs:8,ol});return g;}
/* 🌸 a flower that looks like a real flower: round petals around a yellow middle (faces o.nrm) */
function flowerShape(g,r,c,x,y,z,o){o=o||{};const ol=o.ol===undefined?.008:o.ol,f=new THREE.Group();f.position.set(x,y,z);g.add(f);
  if(o.nrm){const n=new THREE.Vector3(o.nrm[0],o.nrm[1],o.nrm[2]).normalize();f.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n);}
  const n=o.n||5,c2=shade(c,.16),sp=o.spin||0;
  for(let i=0;i<n;i++){const a=i/n*TAU+sp;sph(f,r*.5,i%2?c:c2,Math.cos(a)*r*.58,0,Math.sin(a)*r*.58,{s:[1.2,.42,.9],ry:-a,ws:10,hs:6,ol});}
  sph(f,r*.3,o.mid||'#ffd45c',0,r*.12,0,{s:[1,.65,1],ws:10,hs:6,ol});
  if(o.leaves)for(const s of[-1,1]){const a=sp+Math.PI*.5+s*.55;sph(f,r*.42,'#5fbf74',Math.cos(a)*r*1.02,-r*.1,Math.sin(a)*r*1.02,{s:[1.45,.22,.6],ry:-a,ws:8,hs:5,ol:false});}
  return f;}
/* a crown of little flowers on a green vine */
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
function bakePerson(p){for(const g of [...p.legs,...p.arms,p.head])g.userData.keep=1;bake(p.b,true);for(const g of [...p.legs,...p.arms,p.head])bake(g,true);return p;}
function sitPose(p){for(const l of p.legs)l.rotation.x=-1.45;for(const a of p.arms)a.rotation.x=-.55;}
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
function animPerson(p,dt,moving,spd=1){
  if(moving){p.phase+=dt*8.5*spd;const a=Math.sin(p.phase)*.55;p.legs[0].rotation.x=a;p.legs[1].rotation.x=-a;p.arms[0].rotation.x=-a*.8;p.arms[1].rotation.x=a*.8;p.b.position.y=Math.abs(Math.cos(p.phase))*.035;}
  else{p.phase+=dt*2;for(const l of p.legs)l.rotation.x*=.8;for(const a of p.arms)a.rotation.x*=.8;p.b.position.y*=.8;p.head.rotation.z=Math.sin(p.phase*.7)*.04;}
  if(p.wave>0){p.wave-=dt;p.arms[1].rotation.z=2.5+Math.sin(p.wave*14)*.35;}else p.arms[1].rotation.z*=.8;
}

/* ---- pets ---- */
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
const petKind=d=>d&&d.kind&&PET_TYPES[d.kind]&&PET_TYPES[d.kind].base===d.type?d.kind:(d?d.type:'dog');   /* the kind a saved pet really is (breed or new animal), else its type */
const petTagY=k=>(PET_TYPES[k]&&PET_TYPES[k].tagY)||{bunny:1.0,hamster:.55}[k]||.82;
const PET_FIT={pug:'dog',sausage:'dog',capybara:'dog',pomchi:'cat',owl:'cat',duck:'bunny'};   /* whose head the outfits fit */
const ACCS={bow:{n:'Pink bow',i:'🎀',s:'head'},hat:{n:'Party hat',i:'🥳',s:'head'},pcrown:{n:'Pet crown',i:'👑',s:'head'},tophat:{n:'Tiny top hat',i:'🎩',s:'head'},flowerc:{n:'Flower crown',i:'🌸',s:'head'},pflower:{n:'Big flower',i:'🌺',s:'head'},
  collar:{n:'Bell collar',i:'🔔',s:'neck'},scarf:{n:'Cozy scarf',i:'🧣',s:'neck'},bowtie:{n:'Fancy bow tie',i:'🤵',s:'neck'},
  shades:{n:'Pet sunglasses',i:'🕶️',s:'face'},hglasses:{n:'Heart glasses',i:'💖',s:'face'},monocle:{n:'Fancy monocle',i:'🧐',s:'face'},
  cape:{n:'Super cape',i:'🦸',s:'back'},wings:{n:'Fairy wings',i:'🧚',s:'back'},bpack:{n:'Tiny backpack',i:'🎒',s:'back'}};
const PSLOTS=[['head','🎩','Head'],['neck','🧣','Neck'],['face','👓','Face'],['back','🦸','Back']];
function petOutfit(d){if(!d)return{};if(!d.outfit||typeof d.outfit!=='object'){d.outfit={};if(d.acc&&ACCS[d.acc])d.outfit[ACCS[d.acc].s]=d.acc;}d.acc=null;for(const k in d.outfit)if(!ACCS[d.outfit[k]])delete d.outfit[k];return d.outfit;}
function addOutfit(m,d){const o=petOutfit(d);for(const [sl] of PSLOTS)if(o[sl])addAcc(m,o[sl]);}
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
function animPet(p,dt,moving,spd=1){
  p.phase+=dt*(moving?11*spd:2.2);
  const a=moving?Math.sin(p.phase)*.6:0;
  p.legs.forEach((l,i)=>{l.rotation.x=lerp(l.rotation.x,(i%2?a:-a)*(i<2?1:-1),.35);});
  p.b.position.y=moving?(p.type==='bunny'?Math.abs(Math.sin(p.phase*.5))*.14:Math.abs(Math.sin(p.phase))*.02):lerp(p.b.position.y,0,.3);
  if(p.tail)p.tail.rotation.z=Math.sin(p.phase*(p.type==='dog'?2.2:.6))*(p.type==='dog'?.6:.25);
  if(p.head&&!moving)p.head.rotation.y=Math.sin(p.phase*.37)*.3;
  if(p.type==='duck')p.b.rotation.z=moving?Math.sin(p.phase)*.15:lerp(p.b.rotation.z,0,.3);   /* 🦆 a waddle */
}

/* ---- furniture (front faces +z, origin at floor centre) ---- */
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
/* the shell shelf's 12 spots (middle board first, then the upper and the lowest) and how many shells you need for each */
const SHELF_AT=[.55,.97,.13].flatMap(y=>[-.42,-.14,.14,.42].map(x=>[x,y])),SHELF_T=[1,2,3,4,5,6,8,10,13,16,20,25];
function shelfShow(g,n){g.traverse(o=>{if(o.userData.shl!==undefined)o.visible=n>=SHELF_T[o.userData.shl];});}
/* what to build for a thing in your house: the Shell shelf is saved as {t:'shelf',c:'#ffffff',sh:1} (a white Bookshelf to older versions) */
const furnOf=it=>it.sh&&it.t==='shelf'?'shellshelf':it.t;
const shopItem=(k,c)=>k==='shellshelf'?{u:uid(),t:'shelf',c:'#ffffff',sh:1,x:0,z:0,r:0,on:1}:{u:uid(),t:k,c,x:0,z:0,r:0,on:1};
/* ✨ golden treasures: you can only get these from a gold capsule in the claw machine */
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
  'canopybed','daybed','crib','carbed','cornersofa','loveseat','stool','barstool','rocking','eggchair','woodbench','pouf','coffeetable','sidetable','diningtable','roundtable','nightstand','vanity','floorlamp','tablelamp','starlamp','neon','lantern','rughearts','rugstripe','rugstar','doormat','palm','monstera','orchid','herbs','bamboo','hangplant','cubeshelf','cornershelf','chest','coatrack','shoerack','laddershelf','island','oven','dishwasher','coffeecorner','trolley','spicerack','shower','toilet','towelrack','bathmat','laundry','slide','playtent','blocks','toytrain','drumkit','chalkboard','bigvase','candles','photoframe','wallclock','bunting','snowglobe','cuckoo','poster','sunlounger','parasol','birdbath','bbq','flamingo','picnictable','discofloor','discoball'];   /* 🛋️ run 4, job 13: 72 new pieces */
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

/* ---- food ---- */
const FOODS={
  apple:{n:'Apple',i:'🍎',p:5,f:10},banana:{n:'Banana',i:'🍌',p:5,f:10},bread:{n:'Bread',i:'🍞',p:8,f:20},
  milk:{n:'Milk',i:'🥛',p:6,f:12},cheese:{n:'Cheese',i:'🧀',p:9,f:16},pizza:{n:'Pizza',i:'🍕',p:18,f:40},slice:{n:'Pizza slice',i:'🍕',p:8,f:16},garlic:{n:'Garlic bread',i:'🥖',p:6,f:14},
  cake:{n:'Cake',i:'🍰',p:15,f:30},icecream:{n:'Ice cream',i:'🍦',p:12,f:20},
  cocoa:{n:'Hot cocoa',i:'☕',p:6,f:12},cookie:{n:'Cookie',i:'🍪',p:3,f:8},muffin:{n:'Muffin',i:'🧁',p:8,f:15},donut:{n:'Donut',i:'🍩',p:8,f:15},
  carrot:{n:'Carrot',i:'🥕',p:0,f:12},tomato:{n:'Tomato',i:'🍅',p:0,f:12},strawberry:{n:'Strawberry',i:'🍓',p:0,f:10},pumpkin:{n:'Pumpkin',i:'🎃',p:0,f:30},
  grapes:{n:'Grapes',i:'🍇',p:5,f:6},watermelon:{n:'Watermelon',i:'🍉',p:9,f:18},cherries:{n:'Cherries',i:'🍒',p:6,f:8},orange:{n:'Orange',i:'🍊',p:5,f:6},corn:{n:'Corn',i:'🌽',p:5,f:10},
  honey:{n:'Honey',i:'🍯',p:8,f:8},popcorn:{n:'Popcorn',i:'🍿',p:6,f:10},candy:{n:'Candy',i:'🍬',p:3,f:5},tea:{n:'Tea',i:'🍵',p:5,f:8},waffle:{n:'Waffle',i:'🧇',p:9,f:20},
  bagel:{n:'Bagel',i:'🥯',p:6,f:14},pretzel:{n:'Pretzel',i:'🥨',p:6,f:14},icecake:{n:'Ice cream cake',i:'🍰',p:18,f:35},
  flour:{n:'Flour',i:'🌾',p:5,f:2},eggs:{n:'Eggs',i:'🥚',p:6,f:8},chocolate:{n:'Chocolate',i:'🍫',p:6,f:10},lemon:{n:'Lemon',i:'🍋',p:5,f:4},
  croissant:{n:'Croissant',i:'🥐',p:6,f:15},pie:{n:'Apple pie',i:'🥧',p:14,f:30},sundae:{n:'Sundae',i:'🍨',p:14,f:25},popsicle:{n:'Ice pop',i:'🍧',p:6,f:12},
  sandwich:{n:'Cheese sandwich',i:'🥪',p:0,f:45},salad:{n:'Garden salad',i:'🥗',p:0,f:35},fruitsalad:{n:'Fruit salad',i:'🥣',p:0,f:40},soup:{n:'Pumpkin soup',i:'🍲',p:0,f:60},
  pancakes:{n:'Pancakes',i:'🥞',p:0,f:50},carrotcake:{n:'Carrot cake',i:'🎂',p:0,f:45},milkshake:{n:'Strawberry milkshake',i:'🥤',p:11,f:35},lemonade:{n:'Lemonade',i:'🧃',p:0,f:20},friedegg:{n:'Fried egg',i:'🍳',p:0,f:25},
  coconut:{n:'Coconut drink',i:'🥥',p:8,f:14},
  /* 🍔 night 3, job 10: from the food truck in the park (burger, fries, hot dog, taco) and the Market (the rest) */
  sushi:{n:'Sushi',i:'🍣',p:14,f:30},riceball:{n:'Rice ball',i:'🍙',p:6,f:14},burger:{n:'Burger',i:'🍔',p:15,f:38},fries:{n:'Fries',i:'🍟',p:7,f:16},hotdog:{n:'Hot dog',i:'🌭',p:9,f:22},
  taco:{n:'Taco',i:'🌮',p:9,f:20},noodles:{n:'Noodles',i:'🍜',p:12,f:32},dumplings:{n:'Dumplings',i:'🥟',p:10,f:24},lollipop:{n:'Lollipop',i:'🍭',p:3,f:5},pudding:{n:'Pudding',i:'🍮',p:8,f:15},
};
const RECIPES=[
  {id:'sandwich',need:{bread:1,cheese:1}},{id:'friedegg',need:{eggs:1}},{id:'salad',need:{tomato:1,carrot:1}},{id:'fruitsalad',need:{apple:1,banana:1,strawberry:1}},
  {id:'pancakes',need:{flour:1,eggs:1,milk:1}},{id:'cookies',n:'Chocolate cookies',i:'🍪',need:{flour:1,eggs:1,chocolate:1},makes:['cookie',3]},
  {id:'pizza',n:'Homemade pizza',i:'🍕',need:{bread:1,cheese:1,tomato:1},makes:['pizza',1]},{id:'soup',need:{pumpkin:1,milk:1}},
  {id:'carrotcake',need:{flour:1,eggs:1,carrot:1}},{id:'milkshake',need:{strawberry:1,milk:1,icecream:1}},{id:'lemonade',need:{lemon:2}},
  {id:'hotchoc',n:'Hot chocolate',i:'☕',need:{chocolate:1,milk:1},makes:['cocoa',2]}];
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
const PET_ITEMS={petfood:{n:'Pet food',i:'🦴',p:6},catfood:{n:'Cat food',i:'🐟',p:6},bunnyfood:{n:'Bunny & hamster food',i:'🥕',p:6},ball:{n:'Ball',i:'🎾',p:10},yarn:{n:'Yarn ball',i:'🧶',p:8},squeaky:{n:'Squeaky toy',i:'🐤',p:8},
  bow:{n:'Pink bow',i:'🎀',p:30},hat:{n:'Party hat',i:'🥳',p:35},collar:{n:'Bell collar',i:'🔔',p:25},scarf:{n:'Cozy scarf',i:'🧣',p:30},
  treat:{n:'Pet treats',i:'🍖',p:5},frisbee:{n:'Frisbee',i:'🥏',p:10},mouse:{n:'Toy mouse',i:'🐭',p:8},pcrown:{n:'Pet crown',i:'👑',p:50},shades:{n:'Pet sunglasses',i:'🕶️',p:35},
  tophat:{n:'Tiny top hat',i:'🎩',p:55},flowerc:{n:'Flower crown',i:'🌸',p:45},pflower:{n:'Big flower',i:'🌺',p:35},bowtie:{n:'Fancy bow tie',i:'🤵',p:40},hglasses:{n:'Heart glasses',i:'💖',p:40},monocle:{n:'Fancy monocle',i:'🧐',p:50},cape:{n:'Super cape',i:'🦸',p:60},wings:{n:'Fairy wings',i:'🧚',p:70},bpack:{n:'Tiny backpack',i:'🎒',p:45}};
const PET_FOOD={dog:['petfood','treat'],cat:['catfood','petfood','treat'],bunny:['bunnyfood','petfood','treat'],hamster:['bunnyfood','petfood','treat'],
  pomchi:['petfood','treat'],pug:['petfood','treat'],sausage:['petfood','treat'],capybara:['bunnyfood','petfood','treat'],duck:['bunnyfood','petfood','treat'],owl:['petfood','catfood','treat']};
const PET_TOY={dog:'ball',cat:'yarn',bunny:'squeaky',hamster:'squeaky',pomchi:'squeaky',pug:'ball',sausage:'frisbee',capybara:'ball',duck:'squeaky',owl:'mouse'};
function itemInfo(id){if(id&&id.startsWith('seed_')){const K=SEEDS[id.slice(5)];return K&&{n:K.n+' seeds',i:K.i,p:K.p};}return FOODS[id]||PET_ITEMS[id];}
function foodModel(g,k,x,y,z){
  const o={ol:.012};
  switch(k){
    case 'apple':for(const [dx,dz] of [[-.06,0],[.06,0],[0,.08]]){sph(g,.065,'#ff5d6c',x+dx,y+.065,z+dz,{...o,ws:10,hs:8});}break;
    case 'banana':box(g,.24,.05,.07,'#ffd84a',x,y,z,{...o,rz:.25});box(g,.24,.05,.07,'#ffe27a',x,y+.05,z+.03,{...o,rz:-.2});break;
    case 'bread':box(g,.26,.12,.14,'#e3a85b',x,y,z,o);box(g,.22,.03,.1,'#f2c27f',x,y+.12,z,{ol:false});break;
    case 'milk':box(g,.1,.22,.1,'#ffffff',x,y,z,o);box(g,.1,.06,.102,'#7cc8ff',x,y+.12,z,{ol:false});box(g,.04,.03,.04,'#ff7aa8',x,y+.22,z,o);break;
    case 'cheese':box(g,.2,.1,.14,'#ffd45c',x,y,z,o);sph(g,.02,'#e8b830',x+.05,y+.1,z+.03,{ol:false});break;
    case 'pizza':box(g,.28,.05,.28,'#ff8a6b',x,y,z,o);box(g,.28,.05,.28,'#fff1b8',x,y+.05,z,o);break;
    case 'cake':cyl(g,.1,.1,.1,'#ffb3c9',x,y,z,{...o,seg:12});cyl(g,.1,.1,.03,'#ffffff',x,y+.1,z,{...o,seg:12});sph(g,.025,'#ff4d6d',x,y+.15,z,{ol:false});break;
    case 'icecream':cone(g,.05,.14,'#e8b77f',x,y,z,{...o,rx:Math.PI,seg:8});sph(g,.06,'#ffc9dc',x,y+.17,z,{...o,ws:10,hs:8});break;
    case 'cereal':box(g,.16,.26,.06,pick(['#ff7aa8','#7cc8ff','#ffd45c','#5fd4b0']),x,y,z,o);break;
    case 'jar':cyl(g,.05,.05,.12,pick(['#ff8a6b','#b79cff','#ffd45c']),x,y,z,{...o,seg:10});cyl(g,.052,.052,.03,'#ffffff',x,y+.12,z,{ol:false,seg:10});break;
    case 'petfood':box(g,.2,.28,.1,pick(['#ff8a6b','#7cc8ff','#5fd4b0']),x,y,z,o);box(g,.12,.08,.012,'#ffffff',x,y+.12,z+.05,{ol:false});break;
    case 'catfood':cyl(g,.07,.07,.1,'#7cc8ff',x,y,z,{...o,seg:12});cyl(g,.071,.071,.012,'#d8dcea',x,y+.1,z,{ol:false,seg:12});box(g,.07,.035,.012,'#ff8a6b',x,y+.035,z+.07,{ol:false});break;
    case 'ball':sph(g,.08,pick(['#ff7aa8','#ffd45c','#7cc8ff']),x,y+.08,z,{...o,ws:10,hs:8});break;
  }
}

/* ---- street props ---- */
function tree(g,x,z,s=1){TREES.push([x,z,s,g]);const c=pick(TREE_COLS);   /* 🍂 the season's colours (job 11) */
  cyl(g,.15*s,.2*s,2.3*s,'#9b6b4a',x,0,z,{seg:8});sph(g,1.15*s,c,x,3.05*s,z,{ws:12,hs:9});sph(g,.75*s,c,x+.7*s,2.75*s,z+.15*s,{ws:10,hs:8});sph(g,.72*s,c,x-.62*s,2.8*s,z-.3*s,{ws:10,hs:8});sph(g,.62*s,c,x+.1*s,3.6*s,z+.4*s,{ws:10,hs:8});}
function pine(g,x,z,s=1){cyl(g,.14*s,.18*s,.8*s,'#9b6b4a',x,0,z,{seg:8});const c=pick(PINE_COLS);cone(g,1.2*s,1.6*s,c,x,.7*s,z,{seg:9});cone(g,.92*s,1.4*s,c,x,1.55*s,z,{seg:9});cone(g,.62*s,1.2*s,c,x,2.35*s,z,{seg:9});}
function lampPost(g,x,z){LAMPXZ.push([x,z]);cyl(g,.07,.1,3,'#5a5f8c',x,0,z,{seg:8});cyl(g,.16,.16,.08,'#5a5f8c',x,2.95,z,{seg:10});sph(g,.19,null,x,3.21,z,{mat:LAMP,ol:.02,ws:12,hs:8});cone(g,.27,.24,'#5a5f8c',x,3.33,z,{seg:10});}
function bench(g,x,z,ry=0){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);box(p,1.6,.08,.5,'#e0905e',0,.42,0);box(p,1.6,.36,.07,'#e0905e',0,.58,-.22);for(const sx of[-.7,.7]){box(p,.08,.42,.08,'#5a5f8c',sx,0,.15);box(p,.08,.95,.08,'#5a5f8c',sx,0,-.2);}
  if(BENCH_L&&!BENCH_SKIP)benchReg(BENCH_L,p,BENCH_SKIP<0);return p;}   /* 🪑 2 seats on every bench (night 3, job 5) */
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
function fireTruck(g,x,z,ry){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);
  box(p,2.0,1.1,5.2,'#ff4d4d',0,.45,0);box(p,1.9,1.0,1.6,'#ff4d4d',0,1.4,1.6);box(p,1.92,.5,1.2,'#a9dcff',0,1.75,1.75,{ol:false});
  box(p,1.6,.12,3.2,'#d8dcea',0,1.6,-.9);for(let i=0;i<6;i++)box(p,1.4,.06,.08,'#ffffff',0,1.72,-2.3+i*.5,{ol:false});
  for(const sx of[-.95,.95])for(const sz of[-1.7,1.6])cyl(p,.42,.42,.3,'#3d3550',sx,.42,sz,{rz:Math.PI/2,center:true,seg:14});
  sph(p,.14,'#7cc8ff',-.5,2.45,1.6,{ws:8,hs:6,ol:.012});sph(p,.14,'#ff4d4d',.5,2.45,1.6,{ws:8,hs:6,ol:.012});box(p,1.7,.25,.05,'#ffffff',0,.75,2.62,{ol:false});}
function hedge(g,x1,z1,x2,z2,L){box(g,Math.abs(x2-x1),1.05,Math.abs(z2-z1),'#5fbf74',(x1+x2)/2,0,(z1+z2)/2,{ol:.04});if(L)col(L,x1,z1,x2,z2);}
/* a block standing on the grass whose ink shell (t thick) starts 1.5 cm above the ground: the shell's underside can't flicker through the grass */
function hbox(g,w,h,d,c,x,z,t){const m=box(g,w,h,d,c,x,0,z,{ol:false}),k=h+t-.015,o=new THREE.Mesh(new THREE.BoxGeometry(w+2*t,k,d+2*t),OL);o.position.set(x,.015+k/2,z);g.add(o);return m;}
function fence(g,x1,z1,x2,z2,L,c='#ffffff'){const len=Math.hypot(x2-x1,z2-z1),n=Math.max(1,Math.round(len/.9)),ang=Math.atan2(x2-x1,z2-z1);
  for(let i=0;i<=n;i++){const t=i/n;box(g,.1,.85,.1,c,x1+(x2-x1)*t,0,z1+(z2-z1)*t,{ol:.02});}
  for(const y of[.32,.62]){const p=new THREE.Group();p.position.set((x1+x2)/2,y,(z1+z2)/2);p.rotation.y=ang;g.add(p);box(p,.05,.1,len,c,0,0,0,{ol:.02});}
  if(L)col(L,Math.min(x1,x2)-.08,Math.min(z1,z2)-.08,Math.max(x1,x2)+.08,Math.max(z1,z2)+.08);}
function flowerBed(g,x,z,w,d){box(g,w,.22,d,'#9b6b4a',x,0,z,{ol:.02});const r=seeded(Math.round(x*7+z*13));const n=Math.round(w*d*5),Q=[];for(let i=0;i<n;i++){const fx=x-w/2+.15+r()*(w-.3),fz=z-d/2+.15+r()*(d-.3);if(Q.some(q=>Math.hypot(q[0]-fx,q[1]-fz)<.2))continue;Q.push([fx,fz]);   /* no two flowers inside each other (run 4, job 6) */cyl(g,.015,.015,.2,'#4fae5c',fx,.22,fz,{seg:4,ol:false});sph(g,.08,['#ff7aa8','#ffd45c','#ffffff','#b79cff','#ff8a6b'][(r()*5)|0],fx,.46,fz,{ws:8,hs:6,ol:.015});}}
function trafficLight(g,x,z,ry){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);cyl(p,.07,.08,3,'#5a5f8c',0,0,0,{seg:8});box(p,.36,.95,.3,'#3d3550',0,2.55,0);
  sph(p,.11,null,0,3.28,.14,{mat:new THREE.MeshBasicMaterial({color:'#7a3b48'}),ol:false});sph(p,.11,null,0,2.98,.14,{mat:new THREE.MeshBasicMaterial({color:'#7a6a3b'}),ol:false});sph(p,.11,null,0,2.68,.14,{mat:new THREE.MeshBasicMaterial({color:'#5dff9c'}),ol:false});}
function mailbox(g,x,z,ry){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);box(p,.1,1,.1,'#9b6b4a',0,0,0);box(p,.34,.3,.5,'#7cc8ff',0,1,0);cyl(p,.17,.17,.5,'#7cc8ff',0,1.3,0,{rx:Math.PI/2,center:true,seg:14});box(p,.04,.3,.1,'#ff6b6b',.2,1.15,.1,{ol:.015});}

/* ---- building parts ---- */
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
function building(g,o){WINM=o.win||WIN;try{buildingIn(g,o);}finally{WINM=WIN;}}   /* o.win: the window glass to use (shops: SWIN) */
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
function windowIn(g,x,y,z,ry,cur='#ff9ec4'){const p=new THREE.Group();p.position.set(x,y,z);p.rotation.y=ry;g.add(p);
  box(p,1.6,1.5,.08,'#ffffff',0,-.09,0);box(p,1.4,1.3,.1,null,0,0,0,{mat:PANE,ol:false});
  box(p,.06,1.3,.12,'#ffffff',0,0,0,{ol:false});box(p,1.4,.06,.12,'#ffffff',0,.62,0,{ol:false});
  box(p,1.8,.1,.24,'#ffffff',0,-.16,.1,{ol:.02});
  for(const s of[-1,1])box(p,.34,1.75,.06,cur,s*.98,-.2,.13,{ol:.015});
  cyl(p,.025,.025,2.3,'#c98f5e',0,1.5,.15,{rz:Math.PI/2,center:true,seg:6,ol:.012});}
function shelfUnit(g,x,z,ry,w,items,c='#ffffff',step=.32){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);   /* step: how close the things stand (the Pet Shop uses .5: lighter shelves, run 4 stage 2 end) */
  box(p,w,2.0,.1,c,0,0,-.35);box(p,.1,2.0,.8,c,-w/2+.05,0,0);box(p,.1,2.0,.8,c,w/2-.05,0,0);
  for(const y of[.1,.75,1.4])box(p,w,.06,.8,c,0,y,0,{ol:.015});box(p,w,.1,.8,c,0,1.95,0);
  let k=0;for(const y of[.16,.81,1.46]){const it=items[k++%items.length];const n=Math.floor((w-.3)/step);for(let i=0;i<n;i++){foodModel(p,it,-w/2+step+i*step,y,.05);if(step>=.5&&i<n-1)box(p,.2,.24,.18,['#ffd6e0','#dff2ea','#fff1b8','#e6dbff','#cfe8ff','#ffe3c2'][(i+k)%6],-w/2+step+i*step+step/2,y+.12,.05,{ol:false});}}}   /* 📦 between the things on a light shelf, a little pastel box (12 triangles): full shelves within the Pet Shop's drawing limit (run 4, stage 3) */

/* 🪑 sit on every bench (night 3, job 5): every bench in town, the park, the football field, the lake, the bus stops, the beach and your yard has
   2 seats. Tap a free seat: you sit (like the beach bench); move to stand up. Eating from the bag keeps you seated. Other players see you sitting
   (the sit pose rides along in presence as st:1; old versions just see you standing there). Two players never share a seat: the second one gets
   the other seat, or "This bench is full". The 3 park sitters moved to one seat each, so you can sit beside them */
const BENCHES=[];let BENCH_L=null,BENCH_SKIP=0;
const _bv=new THREE.Vector3(),_bq=new THREE.Quaternion();
function benchReg(L,p,yard){p.updateWorldMatrix(true,false);p.getWorldPosition(_bv);p.getWorldQuaternion(_bq);const yaw=Math.atan2(2*(_bq.w*_bq.y+_bq.x*_bq.z),1-2*(_bq.y*_bq.y+_bq.z*_bq.z));
  const b={id:L.id+':'+BENCHES.length,loc:L.id,x:_bv.x,z:_bv.z,ry:yaw,seats:[],sit:[null,null],yard:!!yard};BENCHES.push(b);
  for(let i=0;i<2;i++){const lx=i?.42:-.42,lz=.06,x=b.x+Math.cos(yaw)*lx+Math.sin(yaw)*lz,z=b.z-Math.sin(yaw)*lx+Math.cos(yaw)*lz,s={x,z,yaw:yaw+Math.PI,i};b.seats.push(s);
    const t={x:x-L.ox,z:z-L.oz,r:1.6,icon:'🪑',label:()=>seatTaken(b,i)?(seatTaken(b,1-i)?'This bench is full':'Sit down'):'Sit down',act:()=>sitAt(b,i),seat:1};
    if(yard){t.lx=x;t.lz=z;s.lx=x;s.lz=z;yardInt(inter(L,t));}else inter(L,t);s.tg=t;}
  return b;}
/* who sits where: a townsperson or grandma (b.sit), or another player who sends the sit pose and stands on that seat */
function seatTaken(b,i){if(b.sit[i]&&(typeof b.sit[i]!=='function'?true:b.sit[i]()))return true;const s=b.seats[i];
  if(typeof MP!=='undefined'&&MP.peers)for(const a of MP.peers.values()){if(!a.st||!a.av||a.loc!==b.loc)continue;if(Math.hypot(a.x-s.x,a.z-s.z)<.45)return true;}return false;}
function sitAt(b,i){if(P.ride)stopRide();if(seatTaken(b,i)){if(seatTaken(b,1-i)){SFX.no();toast('This bench is full 🪑',2.4);return;}i=1-i;}const s=b.seats[i];
  P.sit={x:s.x,z:s.z,yaw:s.yaw,bench:b.id,seat:i};P.x=s.x;P.z=s.z;P.yaw=s.yaw;P.pitch=-.05;SFX.pop();
  toast(b.loc==='beach'?'Ahh… the sea is so calm. 🌊 Move to stand up.':'Comfy! Move to stand up. You can eat from your 🎒 bag here.',3);if(typeof qEvent==='function')qEvent('sit');}
/* 🏡 your yard moved to another lot: its bench moves along (the seats are kept at the old town-yard spots, like everything in the yard) */
function benchYard(j){for(const b of BENCHES){if(!b.yard)continue;for(const s of b.seats){[s.x,s.z]=lotPt(j,s.lx,s.lz);s.yaw=(LANE_PLOTS[j].s<0?0:Math.PI)+Math.PI+b.ry0;}const c=lotPt(j,b.x0,b.z0);b.x=c[0];b.z=c[1];}}

/* 🍔 the food truck in the park (night 3, job 10): by the fountain benches, off the paths, its window towards the fountain. Burgers, fries, hot dogs
   and tacos from 8:00 to 20:00 like the shops (SHUT.truck). Mr. Patty stands inside (made with the other keepers). Cheap: toon boxes, one sign */
function foodTruck(st,L,x,z){const B='#ff8a6b',W='#ffffff';
  box(st,2.2,1.9,3.7,B,x,.5,z-.35);box(st,2.3,.12,3.8,W,x,2.4,z-.35,{ol:.015});   /* the body and its roof */
  box(st,2.1,1.25,1.1,B,x,.5,z+2.05);box(st,1.9,.6,.08,'#bfe6ff',x,1.1,z+2.58,{ol:.012});box(st,2.2,.35,.25,'#5a5f8c',x,.4,z+2.72);   /* the cab, the windscreen (2 cm proud of the cab's front: it was flush with it and flickered, run 4, job 6), the bumper */
  for(const s of[-1,1])box(st,.28,.28,.28,'#fff1b8',x+s*.76,.76,z+2.5,{ol:.012});   /* headlights over the bumper, inside the cab's width (they used to share the cab's side face and sit in the windscreen) */
  for(const [wx,wz] of [[-1.1,-1.4],[1.1,-1.4],[-1.1,1.8],[1.1,1.8]]){cyl(st,.38,.38,.3,'#3d2c5e',x+wx,.38,z+wz,{rz:Math.PI/2,center:true,seg:12,ol:.015});cyl(st,.16,.16,.34,'#c8cde0',x+wx,.38,z+wz,{rz:Math.PI/2,center:true,seg:8,ol:false});}   /* the hub 2 cm proud of the tyre (it was 1 cm) */
  box(st,.06,.95,2.3,'#7cc8ff',x+1.1,1.15,z-.35,{ol:.012});box(st,.55,.08,2.5,W,x+1.33,1.08,z-.35,{ol:.015});   /* the serving window and the counter */
  for(let i=0;i<6;i++)box(st,1.1,.05,.42,i%2?W:'#ff6b6b',x+1.62,2.22,z-1.4+i*.42,{rz:.32,ol:false});{const ref=new THREE.Object3D();ref.position.set(x+1.62,2.245,z-.35);ref.rotation.z=.32;hull(st,new THREE.BoxGeometry(1.124,.074,2.544),ref,{});}   /* the striped awning: six slats, one outline around the whole (each slat's own outline drew dark seams and specks, run 4, job 6) */
  /* a burger, a box of fries and a hot dog on the counter */
  cyl(st,.13,.13,.05,'#c98f5e',x+1.35,1.16,z+.5,{seg:10,ol:.01});box(st,.26,.03,.26,'#ffd45c',x+1.35,1.21,z+.5,{ol:false});sph(st,.13,'#e0a874',x+1.35,1.26,z+.5,{s:[1,.6,1],ws:10,hs:6,ol:.01});
  box(st,.2,.2,.14,'#ff6b6b',x+1.35,1.16,z-.3,{ol:.01});for(let i=0;i<4;i++)box(st,.03,.3,.03,'#ffd45c',x+1.28+i*.045,1.2,z-.3,{ol:false});
  box(st,.34,.08,.12,'#ffe0c4',x+1.35,1.16,z-1.0,{ol:.01});cyl(st,.04,.04,.3,'#e0745a',x+1.35,1.28,z-1.0,{rz:Math.PI/2,center:true,seg:6,ol:false});
  box(st,.08,.96,2.6,W,x+1.0,2.5,z-.35,{ol:.015});const sg=signPlane('🍔 Food truck',2.4,.6,'#ff6b6b','#ffffff');sg.position.set(x+1.06,3.1,z-.35);sg.rotation.y=Math.PI/2;L.g.add(sg);   /* 🪧 on the roof's edge above the awning (run 4, job 5: the awning's inner edge used to run through the sign's top) */
  sph(st,.11,null,x+1.75,1.95,z+.95,{mat:LAMP,ol:.012,ws:8,hs:6});   /* a little lamp under the awning's end for the evening (no longer in front of the sign) */
  col(L,x-1.25,z-2.3,x+1.95,z+2.85);
  inter(L,{x:x+2.1,z:z-.35,r:2.4,icon:()=>shopOpen('truck')?'🍔':'🌙',label:'Food truck',say:()=>shopOpen('truck')?'':`🌙 Closed · opens at ${DAY_ON}:00`,
    act:()=>{if(shopOpen('truck')){openShop('truck');return;}SFX.no();toast(`🌙 The Food truck is closed now. It opens at ${DAY_ON}:00 ☀️`,3);}});}
const TRUCK={x:-34.2,z:11.8};   /* the park's south-west corner, by the bench, the window towards the fountain (run 4, job 6: 1.7 m further west, so its counter and awning no longer hang over the flower bed; the tree that stood there moved to the fence) */

