# Run 4, job 3: Halloween, all of October (items 1, 4 October part, 13, 31). Exact-match edits for edit.py.
import json
E = []

# --- the window: 1 to 31 October ---
E.append(["/* 'halloween' 17 Oct to 1 Nov · 'xmas' 1 Dec to 6 Jan · 'easter' Palm Sunday to Easter Monday · null on other days */",
          "/* 'halloween' 1 to 31 Oct (run 4: all of October, the owner's decision 17 Oct) · 'xmas' 1 Dec to 6 Jan · 'easter' Palm Sunday to Easter Monday · null on other days */"])
E.append(["  if(md>=1017&&md<=1101)return'halloween';if(md>=1201||md<=106)return'xmas';",
          "  if(m===10)return'halloween';if(md>=1201||md<=106)return'xmas';"])

# --- costumes: for sale in October, worn over the clothes, saved, seen by others ---
E.append(["  glasses:{n:'Glasses',i:'👓',p:60,gl:1,cols:['#3d2c5e','#ff7aa8','#7cc8ff','#ffd45c']},sunglasses:{n:'Sunglasses',i:'🕶️',p:80,gl:1,cols:['#2e2347','#ff7aa8','#5fa8ff','#ffd45c']},hearts:{n:'Heart glasses',i:'💖',p:70,gl:1,cols:['#ff4d8d','#ff7aa8','#b79cff']}};",
          "  glasses:{n:'Glasses',i:'👓',p:60,gl:1,cols:['#3d2c5e','#ff7aa8','#7cc8ff','#ffd45c']},sunglasses:{n:'Sunglasses',i:'🕶️',p:80,gl:1,cols:['#2e2347','#ff7aa8','#5fa8ff','#ffd45c']},hearts:{n:'Heart glasses',i:'💖',p:70,gl:1,cols:['#ff4d8d','#ff7aa8','#b79cff']},\n  /* 🎃 Halloween costumes (run 4, job 3): in the Clothes Shop in October only; worn over your clothes (one tap on, one tap off at the mirror); kept after October */\n  co_cat:{n:'Cat costume',i:'🐈',p:160,co:'cat',oct:1},co_dog:{n:'Dog costume',i:'🐕',p:160,co:'dog',oct:1},co_ghost:{n:'Ghost costume',i:'👻',p:160,co:'ghost',oct:1},co_dino:{n:'Dinosaur costume',i:'🦖',p:180,co:'dino',oct:1}};"])
E.append(["""    <div class="grid" style="margin-top:10px">${Object.entries(CLOTHES).map(([k,c])=>{const n=(c.hat||c.gl)?variants(k).length:0,mine=!(c.hat||c.gl)&&owns(k);""",
          """    ${HOL.cur==='halloween'?'<p class="note">🎃 Costumes are here for October! Wear one over your clothes at the 🪞 mirror.</p>':''}<div class="grid" style="margin-top:10px">${Object.entries(CLOTHES).filter(([k,c])=>!c.oct||HOL.cur==='halloween'||owns(k)).map(([k,c])=>{const n=(c.hat||c.gl)?variants(k).length:0,mine=!(c.hat||c.gl)&&owns(k);"""])
E.append(["  if(owns(k)){toast(c.i+' You have these already! Try them on at the 🪞 mirror.',3);return;}if(shutBuy('clothes'))return;",
          "  if(owns(k)){toast(c.i+' You have these already! Try them on at the 🪞 mirror.',3);return;}if(c.oct&&HOL.cur!=='halloween'){toast('🎃 Costumes come back in October!',3);return;}if(shutBuy('clothes'))return;"])
E.append(["""${own('gl').length>1?row('Glasses',pl2('glasses',own('gl')),'glasses'):''}${row('Sweater color',sw('top'),'top')}""",
          """${own('gl').length>1?row('Glasses',pl2('glasses',own('gl')),'glasses'):''}${Object.keys(CLOTHES).some(k=>CLOTHES[k].co&&owns(k))?row('Costume',pl2('co',[['none','None']].concat(Object.keys(CLOTHES).filter(k=>CLOTHES[k].co&&owns(k)).map(k=>[CLOTHES[k].co,CLOTHES[k].i+' '+CLOTHES[k].n]))),'co'):''}${row('Sweater color',sw('top'),'top')}"""])
E.append(["  const cur=k=>k==='hat'?(L.hat&&L.hat!=='none'?L.hat+'|'+(L.hatc||HAT_DEF[L.hat]):'none'):k==='glasses'?(L.glasses&&L.glasses!=='none'?L.glasses+'|'+(L.glc||HAT_DEF[L.glasses]):'none'):L[k];",
          "  const cur=k=>k==='hat'?(L.hat&&L.hat!=='none'?L.hat+'|'+(L.hatc||HAT_DEF[L.hat]):'none'):k==='glasses'?(L.glasses&&L.glasses!=='none'?L.glasses+'|'+(L.glc||HAT_DEF[L.glasses]):'none'):k==='co'?(L.co||'none'):L[k];"])
E.append(["ACT.lk=arg=>{const i=arg.indexOf(':'),k=arg.slice(0,i),v=arg.slice(i+1);\n  if(k==='hat'||k==='glasses'){const [a,c]=v.split('|');CR.look[k]=a;if(k==='hat')CR.look.hatc=c||null;else CR.look.glc=c||null;}else CR.look[k]=v;crAvatar();CR.av.wave=.7;SFX.pop();",
          "ACT.lk=arg=>{const i=arg.indexOf(':'),k=arg.slice(0,i);let v=arg.slice(i+1);\n  if(k==='hat'||k==='glasses'){const [a,c]=v.split('|');CR.look[k]=a;if(k==='hat')CR.look.hatc=c||null;else CR.look.glc=c||null;}else if(k==='co'){if(v===(CR.look.co||'none'))v='none';CR.look.co=v==='none'?null:v;}else CR.look[k]=v;crAvatar();CR.av.wave=.7;SFX.pop();   /* 🎃 a costume: one tap on, the same tap off */"])
E.append(["function lookToPerson(l){l=Object.assign({},DEFAULT_LOOK,l||{});return{hatc:l.hatc,glc:l.glc,",
          "function lookToPerson(l){l=Object.assign({},DEFAULT_LOOK,l||{});return{co:COSTUMES[l.co]?l.co:null,hatc:l.hatc,glc:l.glc,"])
E.append(["function packLook(){const l=Object.assign({},DEFAULT_LOOK,S.look||{});const o={};for(const k of['skin','hair','style','eyes','mouth','top','bottom','shoes','outfit','hat','hatc','glasses','glc'])if(typeof l[k]==='string')o[k]=l[k];return o;}",
          "function packLook(){const l=Object.assign({},DEFAULT_LOOK,S.look||{});const o={};for(const k of['skin','hair','style','eyes','mouth','top','bottom','shoes','outfit','hat','hatc','glasses','glc','co'])if(typeof l[k]==='string')o[k]=l[k];return o;}   /* co: a costume (run 4; old versions ignore it and show the clothes) */"])
E.append(["o.hat=CLOTHES[l.hat]&&CLOTHES[l.hat].hat?l.hat:'none';o.hatc=HEX.test(l.hatc)?l.hatc:null;o.glasses=CLOTHES[l.glasses]&&CLOTHES[l.glasses].gl?l.glasses:'none';o.glc=HEX.test(l.glc)?l.glc:null;return o;}",
          "o.hat=CLOTHES[l.hat]&&CLOTHES[l.hat].hat?l.hat:'none';o.hatc=HEX.test(l.hatc)?l.hatc:null;o.glasses=CLOTHES[l.glasses]&&CLOTHES[l.glasses].gl?l.glasses:'none';o.glc=HEX.test(l.glc)?l.glc:null;o.co=COSTUMES[l.co]?l.co:null;return o;}"])
E.append(["  hairFor(head,L);\n  if(L.hat&&L.hat!=='none')hatFor(head,L.hat,L.hatc);if(L.glasses&&L.glasses!=='none')glassesFor(head,L.glasses,L.glc);\n  root.traverse(o=>{if(o.isMesh&&o.material===OL)o.material=OLP;});",
          "  hairFor(head,L);\n  if(L.hat&&L.hat!=='none')hatFor(head,L.hat,L.hatc);if(L.glasses&&L.glasses!=='none')glassesFor(head,L.glasses,L.glc);\n  if(L.co&&COSTUMES[L.co])costumeFor(b,head,legs,arms,L.co);   /* 🎃 a costume over the clothes (run 4, job 3) */\n  root.traverse(o=>{if(o.isMesh&&o.material===OL)o.material=OLP;});"])
E.append(["function makePerson(L){\n  const root=new THREE.Group(),b=new THREE.Group();root.add(b);b.scale.setScalar(L.scale||1);",
r"""/* 🎃 Halloween costumes (run 4, job 3): a hooded onesie over the clothes (the face stays open), with ears, a tail, spikes or a ghostly hem. Cheap boxes, baked with the body */
const COSTUMES={cat:{c:'#8e8e9e',n:'Cat'},dog:{c:'#b07a52',n:'Dog'},ghost:{c:'#f4f2ff',n:'Ghost'},dino:{c:'#5fbf74',n:'Dinosaur'}};
function costumeFor(b,head,legs,arms,k){const C=COSTUMES[k].c,D=shade(C,-.14),o={ol:.012};
  box(b,.5,.54,.32,C,0,.59,0,o);for(const hip of legs)box(hip,.21,.5,.23,C,0,-.5,0,o);for(const sh of arms)box(sh,.17,.4,.19,C,0,-.4,0,o);   /* the onesie */
  box(head,.56,.5,.5,C,0,.03,-.08,o);   /* the hood: open at the face */
  if(k==='cat'){for(const s of[-1,1]){cone(head,.09,.17,C,s*.17,.5,-.06,{seg:4,...o});cone(head,.05,.1,'#ffb3c7',s*.17,.52,-.03,{seg:4,ol:false});}cyl(b,.035,.05,.55,C,0,.42,-.26,{rx:-1.1,center:true,seg:6,...o});sph(b,.055,D,0,.69,-.47,{ws:6,hs:5,ol:false});box(b,.26,.32,.02,'#f6f0ff',0,.6,.165,{ol:false});}
  else if(k==='dog'){for(const s of[-1,1])box(head,.11,.28,.06,D,s*.31,.06,-.06,{rz:s*.22,...o});cyl(b,.04,.06,.36,C,0,.5,-.2,{rx:-.7,center:true,seg:6,...o});box(b,.26,.34,.02,'#f6e6c8',0,.58,.165,{ol:false});sph(head,.05,'#2e2347',0,-.07,.245,{ws:6,hs:5,ol:false});}
  else if(k==='ghost'){for(const [x,z] of[[-.17,.12],[.17,.12],[-.17,-.12],[.17,-.12],[0,.17],[0,-.17]])sph(b,.1,C,x,.34,z,{ws:7,hs:5,ol:false});box(head,.6,.1,.54,C,0,.27,-.08,{ol:false});}
  else if(k==='dino'){for(let i=0;i<3;i++)cone(head,.06,.14,D,0,.31,-.22+i*.12,{seg:4,...o});for(let i=0;i<4;i++)cone(b,.05,.12,D,0,.98-i*.16,-.17,{rx:-.5,seg:4,...o});cone(b,.11,.62,C,0,.4,-.44,{rx:-1.35,center:true,seg:7,...o});for(let i=0;i<3;i++)cone(b,.04,.1,D,0,.5-i*.07,-.36-i*.14,{rx:-.4,seg:4,ol:false});box(b,.3,.4,.02,'#ffe08a',0,.6,.165,{ol:false});}}
function makePerson(L){
  const root=new THREE.Group(),b=new THREE.Group();root.add(b);b.scale.setScalar(L.scale||1);"""])

# --- the Spooky path moves to the Flower Corner, 5 kinds of soft scares, ghosts all over town ---
E.append(["@between", "/* 👻 the Spooky path: a marked path in the quiet south-west corner of the park. Open after 18:00.",
          "    floatText('BOO! '+(i%2?'💀':'👻'),q.px,2.1,q.z,{h:.55,life:1.4});SFX.boo();P.pitch=clamp(P.pitch+.06,-1.2,1.2);});}",
r"""/* 👻 the Spooky path (run 4, job 3): a winding purple-lit trail through the Flower Corner (the holiday spot, job 4), 21 m long (the park's old path was 13.6 m),
   open after 18:00 in October. 6 scare spots with 5 kinds of soft scares: a ghost, a skeleton, a zombie, a bat swarm and a pumpkin head. When one pops up you stop
   and turn smoothly to face it, the view shakes a little and a soft spooky sound plays (only with sound on). Each spot once per night per player; never in jobs,
   class, scenes, sleep, the bus or the Pet Show (SPOOK.ok) */
const SPOOK_WAY=[[-17,-8.3],[-15.5,-11.2],[-18.8,-13.2],[-19.3,-16.3],[-16.5,-18.2],[-18.3,-21.0],[-15.2,-23.3]];
const SPOOK={spots:[{x:-15.5,z:-11.2,px:-14.2,pz:-11.6,k:'ghost'},{x:-18.8,z:-13.2,px:-20.1,pz:-13.0,k:'skel'},{x:-19.3,z:-16.3,px:-20.6,pz:-16.6,k:'zombie'},{x:-16.5,z:-18.2,px:-15.4,pz:-17.5,k:'bats'},{x:-18.3,z:-21.0,px:-19.6,pz:-21.4,k:'pumpkin'},{x:-15.2,z:-23.3,px:-13.9,pz:-22.9,k:'ghost'}],
  kinds:['ghost','skel','zombie','bats','pumpkin'],m:{},cur:null,t:0,len:0,
  open(){return HOL.cur==='halloween'&&!!S&&(S.time>=18||S.time<6);},
  ok(){return!CUT&&!P.sit&&!P.ride&&!UI.open&&!DECO.on&&!fading&&!CLIMB&&!TUT&&!DTUT&&!CR&&!!CUR&&CUR.id==='city'&&!(typeof dlCarrying==='function'&&dlCarrying())&&!(typeof PSX!=='undefined'&&PSX.on&&Math.hypot(P.x+34,P.z-22)<9);},
  near(){return!!S&&!!CUR&&CUR.id==='city'&&P.x>-23.4&&P.x<-10.6&&P.z>-24.5&&P.z<-7;}};
function spookBuild(L,G,st){const r=seeded(41),W=SPOOK_WAY;let len=0;
  for(let i=1;i<W.length;i++){const [ax,az]=W[i-1],[bx,bz]=W[i],d=Math.hypot(bx-ax,bz-az),n=Math.max(2,Math.round(d/.9));len+=d;for(let k=0;k<n;k++){const t=k/n,x=ax+(bx-ax)*t+(r()-.5)*.16,z=az+(bz-az)*t+(r()-.5)*.16;disc(st,.36,k%2?'#5a3e8a':'#4a2f74',x,.028,z,{seg:12});}}
  SPOOK.len=len;
  for(const [x,z] of [[-14.2,-9.6],[-20.3,-14.6],[-15.0,-15.6],[-19.8,-19.6],[-16.9,-23.6]]){cyl(st,.03,.035,.9,'#3d2c5e',x,0,z,{seg:6,ol:.01});box(st,.2,.26,.2,'#2e2347',x,.9,z,{ol:.012});box(st,.14,.18,.14,'#ffd36b',x,.94,z,{ol:false});holPiece('path lamp',x,z,0);}
  /* the signs by the gate: two posts, a board for each sign, the text in front of the board (no post can cross the words) */
  const sp=new THREE.Group();sp.position.set(-13.2,0,-7.32);st.add(sp);for(const s of[-1,1])box(sp,.1,1.9,.1,'#3d2c5e',s*1.02,0,0,{ol:.015});
  box(sp,2.1,.56,.08,'#2e2347',0,1.36,0,{ol:.02});box(sp,1.7,.32,.08,'#d9c4ff',0,.94,0,{ol:.015});
  const sg=signPlane('👻 Spooky path',1.95,.5,'#2e2347','#d9c4ff');sg.position.set(-13.2,1.64,-7.26);G.add(sg);
  const sg2=signPlane('Open after 18:00 🌙',1.58,.28,'#d9c4ff','#2e2347');sg2.position.set(-13.2,1.1,-7.27);G.add(sg2);holPiece('spooky sign',-13.2,-7.32,0);
  /* the five kinds (each one group, hidden until it pops up): built in the holiday group so they go away with October */
  const M={};
  {const gh=new THREE.Group();G.add(gh);sph(gh,.42,'#f4f2ff',0,1.1,0,{ws:12,hs:9});cyl(gh,.42,.55,.7,'#f4f2ff',0,.4,0,{seg:12});for(let i=0;i<6;i++){const a=i/6*TAU;sph(gh,.14,'#f4f2ff',Math.cos(a)*.44,.38,Math.sin(a)*.44,{ws:7,hs:5,ol:.012});}
    for(const s of[-1,1])sph(gh,.08,'#2e2347',s*.15,1.18,.38,{ws:7,hs:5,ol:false});sph(gh,.1,'#2e2347',0,.95,.4,{s:[1.3,1,.5],ws:7,hs:5,ol:false});for(const s of[-1,1])sph(gh,.065,'#ffb3c7',s*.27,1.0,.33,{ws:6,hs:5,ol:false});bake(gh,false);M.ghost=gh;}
  {const sk=new THREE.Group();G.add(sk);sph(sk,.3,'#fbf7ff',0,1.55,0,{ws:12,hs:9});box(sk,.34,.26,.3,'#fbf7ff',0,1.1,0,{ol:.015});for(let i=0;i<3;i++)box(sk,.42,.05,.3,'#fbf7ff',0,.78+i*.14,0,{ol:.01});box(sk,.1,.6,.1,'#fbf7ff',0,.5,0,{ol:.01});
    for(const s of[-1,1]){box(sk,.08,.7,.08,'#fbf7ff',s*.14,0,0,{ol:.01});box(sk,.08,.62,.08,'#fbf7ff',s*.36,.86,0,{rz:s*.7,ol:.01});sph(sk,.07,'#2e2347',s*.11,1.6,.26,{ws:7,hs:5,ol:false});}box(sk,.22,.05,.05,'#2e2347',0,1.4,.29,{ol:false});bake(sk,false);M.skel=sk;}
  {const z=makePerson({skin:'#9fd49a',hair:'#3d2c5e',style:'short',top:'#6b4fa3',sleeve:'#4e3a7a',bottom:'#4a5a6a',shoes:'#2e2347',eyes:'sleepy',mouth:'small',round:true});for(const a of z.arms)a.rotation.x=-1.35;z.head.rotation.z=.18;bakePerson(z);z.root.userData.keep=1;G.add(z.root);M.zombie=z.root;}
  {const bat=()=>flockGeo(g=>{sph(g,.08,'#2e2347',0,0,0,{s:[1,.8,1.3],ws:7,hs:5,ol:false});for(const s of[-1,1]){box(g,.3,.02,.14,'#3d2c5e',s*.22,0,0,{ol:false});}for(const s of[-1,1])cone(g,.03,.05,'#2e2347',s*.05,.08,.02,{seg:3,ol:false});});
    const bats=[];for(let i=0;i<7;i++)bats.push({geo:bat(),x:0,y:1.2+i*.12,z:0,ra:.6+(i%3)*.25,sp:2.2+(i%2)*.6,ph:i*.9,ya:.3,wing:1,fl:16+i});const bm=flockMesh(bats);G.add(bm);M.bats=bm;}
  {const pk=new THREE.Group();G.add(pk);cone(pk,.46,1.35,'#2e2347',0,0,0,{seg:10,ol:.015});for(const s of[-1,1])box(pk,.1,.1,.4,'#2e2347',s*.3,1.05,.2,{ol:.01});pumpkin(pk,0,0,0,1.25);pk.children[pk.children.length-1].position.y=1.3;HOL.n--;bake(pk,false);M.pumpkin=pk;}
  for(const k in M){M[k].visible=false;M[k].userData.keep=1;}SPOOK.m=M;}
function spookClear(){if(SPOOK.cur){SPOOK.cur.g.visible=false;SPOOK.cur=null;}SPOOK.m={};}
function spookNight(){return S.time>=18?S.day:S.day-1;}   /* a night runs from 18:00 over midnight to the morning */
const SPOOK_SAY={ghost:'BOO! 👻',skel:'Rattle rattle! 💀',zombie:'Braaains… 🧟',bats:'Flap flap! 🦇',pumpkin:'Hee hee! 🎃'};
function spookTick(dt){const c=SPOOK.cur;if(c){c.t+=dt;const g=c.g,k=c.t<.3?c.t/.3:c.t>2.0?Math.max(0,1-(c.t-2.0)/.35):1;g.scale.set(k,k*(1+Math.sin(c.t*22)*.08*(c.t<.9?1:0)),k);if(c.k!=='bats')g.rotation.z=Math.sin(c.t*18)*.14*Math.max(0,1-c.t);g.rotation.y=c.yaw;g.position.y=c.k==='bats'?0:.1+Math.sin(c.t*6)*.06;
    if(c.t<.7)P.yaw=angLerp(P.yaw,c.face,Math.min(1,dt*7));   /* you turn smoothly to face it */
    if(c.t>2.35){g.visible=false;SPOOK.cur=null;}return;}
  if(!SPOOK.m.ghost||!SPOOK.open()||!SPOOK.ok())return;const n=spookNight();if(!S.spook||S.spook.d!==n||!Array.isArray(S.spook.s)||S.spook.s.length<SPOOK.spots.length)S.spook={d:n,s:SPOOK.spots.map(()=>0)};
  SPOOK.spots.forEach((q,i)=>{if(SPOOK.cur||S.spook.s[i])return;if(Math.hypot(P.x-q.x,P.z-q.z)>1.4)return;S.spook.s[i]=1;change();
    const g=SPOOK.m[q.k];if(!g)return;g.position.set(q.px,.1,q.pz);g.visible=true;g.scale.setScalar(.01);const yaw=Math.atan2(P.x-q.px,P.z-q.pz);SPOOK.cur={g,t:0,yaw,k:q.k,face:Math.atan2(-(q.px-P.x),-(q.pz-P.z))};
    P.freeze=1.0;SHAKE.t=.4;floatText(SPOOK_SAY[q.k],q.px,2.1,q.pz,{h:.55,life:1.4});SFX.spook(q.k);P.pitch=clamp(P.pitch*.5,-1.2,1.2);});}"""])
E.append(["    const ghost=c=>flockGeo(g=>{sph(g,.26,c,0,.3,0,{ws:10,hs:8,ol:false});cyl(g,.26,.34,.42,c,0,-.12,0,{seg:10,ol:false});for(let i=0;i<5;i++){const a=i/5*TAU;sph(g,.09,c,Math.cos(a)*.27,-.14,Math.sin(a)*.27,{ws:6,hs:5,ol:false});}\n      for(const s of[-1,1])sph(g,.045,'#2e2347',s*.09,.34,.24,{ws:6,hs:5,ol:false});sph(g,.05,'#2e2347',0,.2,.25,{s:[1.2,.6,.5],ws:6,hs:5,ol:false});for(const s of[-1,1])sph(g,.04,'#ffb3c7',s*.17,.25,.22,{ws:6,hs:5,ol:false});});\n    const gh=[[-34,1.4,32],[-14,1.5,20],[-26,1.6,38.5],[-16,1.3,12.5]].map((p,i)=>({geo:ghost(i%2?'#f4f2ff':'#e8f6ff'),x:p[0],y:p[1],z:p[2],ra:1.4+i*.3,sp:.35+i*.06,ph:i*2.1,ya:.25,wing:0,fl:0}));\n    const gm=flockMesh(gh);G.add(gm);HOL.n+=gh.length;",
          "    const ghost=c=>flockGeo(g=>{sph(g,.26,c,0,.3,0,{ws:10,hs:8,ol:false});cyl(g,.26,.34,.42,c,0,-.12,0,{seg:10,ol:false});for(let i=0;i<5;i++){const a=i/5*TAU;sph(g,.09,c,Math.cos(a)*.27,-.14,Math.sin(a)*.27,{ws:6,hs:5,ol:false});}\n      for(const s of[-1,1])sph(g,.045,'#2e2347',s*.09,.34,.24,{ws:6,hs:5,ol:false});sph(g,.05,'#2e2347',0,.2,.25,{s:[1.2,.6,.5],ws:6,hs:5,ol:false});for(const s of[-1,1])sph(g,.04,'#ffb3c7',s*.17,.25,.22,{ws:6,hs:5,ol:false});});\n    /* 👻 little friendly ghosts float all over town (run 4, item 31): over the pavements (the walkers' paths, so never inside a building), the park, Friends Lane and the Flower Corner; one batch */\n    const GP=[];for(let i=0;i<WE.length;i+=4){const [a,b]=WE[i],A=WP[a],B=WP[b];GP.push([(A[0]+B[0])/2,(A[1]+B[1])/2,.9]);}\n    for(const p of [[-30,16,1.6],[-26,30,1.6],[-14,26,1.6],[-34,36,1.4],[-20,20,1.6],[-92,-3,1.4],[-104,3,1.4],[-118,-3,1.4],[-132,3,1.4],[-20,-11,1.2],[-14,-14,1.2],[-19,-20,1.2],[-13,-22,1.2]])GP.push(p);\n    const gh=GP.map((p,i)=>({geo:ghost(i%2?'#f4f2ff':'#e8f6ff'),x:p[0],y:1.4+(i%4)*.22,z:p[1],ra:p[2],sp:.3+(i%5)*.05,ph:i*2.1,ya:.25,wing:0,fl:0}));\n    const gm=flockMesh(gh);G.add(gm);HOL.n+=gh.length;HOL.ghosts=GP.map(p=>[p[0],p[1]]);"])

# --- the scare: you stop, turn (above) and the view shakes a little; the soft sounds ---
E.append(["  if(UI.open||!PLAYING||CUT||CLIMB||TUT||DTUT){P.moving=false;return;}\n  if(P.ride){",
          "  if(UI.open||!PLAYING||CUT||CLIMB||TUT||DTUT){P.moving=false;return;}\n  if(P.freeze>0){P.freeze-=dt;P.moving=false;return;}   /* 👻 a scare: you stop for a moment (run 4, job 3) */\n  if(P.ride){"])
E.append(["  camera.position.set(P.x,(P.sit?P.sit.h||1.05:1.5)+P.bobA+P.jy-P.dip+(P.cy||0),P.z);ballLook(dt);camera.rotation.set(P.pitch+BLK.a,P.yaw,0,'YXZ');}",
          "  camera.position.set(P.x,(P.sit?P.sit.h||1.05:1.5)+P.bobA+P.jy-P.dip+(P.cy||0),P.z);ballLook(dt);camera.rotation.set(P.pitch+BLK.a,P.yaw,0,'YXZ');\n  if(SHAKE.t>0){SHAKE.t-=dt;const a=SHAKE.t*.08;camera.position.x+=rand(-a,a);camera.position.y+=rand(-a,a)*.5;camera.rotation.z+=rand(-a,a)*.3;}}   /* 👻 a little shake at a scare (run 4) */\nconst SHAKE={t:0};"])
E.append(["  boo(){tone(190,.34,'sine',.11,0,95);tone(760,.14,'triangle',.035,.04,260);},   /* 👻 a soft, friendly BOO */",
          "  boo(){tone(190,.34,'sine',.11,0,95);tone(760,.14,'triangle',.035,.04,260);},   /* 👻 a soft, friendly BOO */\n  spook(k){if(k==='skel'){for(let i=0;i<4;i++)tone(1400+i*120,.03,'triangle',.05,i*.07);}else if(k==='zombie')tone(120,.5,'sine',.1,0,88);else if(k==='bats'){for(let i=0;i<6;i++)tone(900+(i%2)*200,.025,'square',.018,i*.06);}else if(k==='pumpkin'){tone(240,.4,'sine',.09,0,180);tone(480,.12,'triangle',.03,.1,360);}else this.boo();},   /* 👻💀🧟🦇🎃 soft scare sounds (run 4): quiet and short */"])

# --- item 13: every holiday piece sits on the ground or hangs on something ---
E.append(["const HOL={cur:undefined,g:null,n:0,t:0,anim:[],cols:[]};",
          "const HOL={cur:undefined,g:null,n:0,t:0,anim:[],cols:[],pieces:[],ghosts:[]};\n/* 🧱 run 4 (item 13): every holiday piece sits on the ground (or a flower bed / mound it stands on) or hangs on posts or a wall. RAISED = the raised beds and mounds in town;\n   supportAt(x,z) = the height a piece standing there sits on; holPiece() writes down each piece's bottom and support for the check (gap under 2 cm), hanging pieces their ends */\nconst RAISED=[];\nfunction supportAt(x,z){let h=0;for(const r of RAISED){if(r.R!==undefined){const d=Math.hypot(x-r.x,z-r.z);if(d<r.R)h=Math.max(h,r.h*Math.sqrt(1-(d/r.R)*(d/r.R)));}else if(Math.abs(x-r.x)<=r.w/2&&Math.abs(z-r.z)<=r.d/2)h=Math.max(h,r.h);}return h;}\nfunction holPiece(k,x,z,bottom,hang){HOL.pieces.push(hang?{k,x,z,hang}:{k,x,z,b:bottom,s:supportAt(x,z)});}"])
E.append(["  for(const c of HOL.cols){const i=L.cols.indexOf(c);if(i>=0)L.cols.splice(i,1);}HOL.cols=[];L.inter=L.inter.filter(t=>!t.hol);HOL.n=0;HOL.anim=[];spookClear();}",
          "  for(const c of HOL.cols){const i=L.cols.indexOf(c);if(i>=0)L.cols.splice(i,1);}HOL.cols=[];L.inter=L.inter.filter(t=>!t.hol);HOL.n=0;HOL.anim=[];HOL.pieces=[];HOL.ghosts=[];spookClear();}"])
E.append(["function garland(g,x1,y1,z1,x2,z2,cols){const len=Math.hypot(x2-x1,z2-z1),n=Math.max(3,Math.round(len/.55)),a=Math.atan2(x2-x1,z2-z1);",
          "function garland(g,x1,y1,z1,x2,z2,cols){const len=Math.hypot(x2-x1,z2-z1),n=Math.max(3,Math.round(len/.55)),a=Math.atan2(x2-x1,z2-z1);\n  for(const [x,z] of[[x1,z1],[x2,z2]])cyl(g,.035,.045,y1+.02,'#5a4634',x,0,z,{seg:6,ol:.01});holPiece('garland',(x1+x2)/2,(z1+z2)/2,0,[[x1,y1,z1],[x2,y1,z2]]);   /* 🪵 it hangs between two posts of its own (run 4, item 13: no garland floats in the air) */"])
E.append(["function pumpkin(g,x,z,ry,s){s=s||1;const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);sph(p,.27*s,'#ff8a2b',0,.25*s,0,{s:[1,.84,1],ws:10,hs:7,ol:.02});",
          "function pumpkin(g,x,z,ry,s){s=s||1;const p=new THREE.Group();p.position.set(x,supportAt(x,z),z);p.rotation.y=ry;g.add(p);sph(p,.27*s,'#ff8a2b',0,.226*s,0,{s:[1,.84,1],ws:10,hs:7,ol:.02});holPiece('pumpkin',x,z,p.position.y-.0008*s);   /* (it used to hover 2.3 cm: run 4, item 13) */"])
E.append(["    const egg=(x,z,i)=>{const c=PC[i%6],e=new THREE.Group();e.position.set(x,0,z);e.rotation.y=r()*TAU;st.add(e);",
          "    const egg=(x,z,i)=>{const c=PC[i%6],e=new THREE.Group();e.position.set(x,supportAt(x,z),z);e.rotation.y=r()*TAU;st.add(e);holPiece('egg',x,z,e.position.y-.009);"])
E.append(["    for(const [x,z,ry,c] of [[-26.5,11.8,.6,'#ffffff'],[-17.2,12.2,-.5,'#ffc9dc'],[-33.3,30.8,2.2,'#f8f5f0']]){const m=makePet('bunny',c),b=m.root;b.scale.setScalar(1.7);b.position.set(x,0,z);b.rotation.y=ry;st.add(b);",
          "    for(const [x,z,ry,c] of [[-26.5,11.8,.6,'#ffffff'],[-17.2,12.2,-.5,'#ffc9dc'],[-33.3,30.8,2.2,'#f8f5f0']]){const m=makePet('bunny',c),b=m.root;b.scale.setScalar(1.7);b.position.set(x,supportAt(x,z),z);b.rotation.y=ry;st.add(b);holPiece('bunny',x,z,b.position.y);"])
E.append(["      G.add(quadsMesh([[-37.72,3.3,19.95,.95,.95,Math.PI/2],[-37.72,3.3,24.05,.95,.95,-Math.PI/2],[-84.3,4.3,-4.3,.9,.9,Math.PI/2],[-84.3,4.3,4.3,.9,.9,-Math.PI/2],[-14.5,2.3,7.45,.8,.8,0],[-17.9,2.3,7.45,.8,.8,0]],wm));HOL.n+=6;}",
          "      const webs=[[-37.72,3.3,19.95,.95,.95,Math.PI/2],[-37.72,3.3,24.05,.95,.95,-Math.PI/2],[-84.3,4.3,-4.3,.9,.9,Math.PI/2],[-84.3,4.3,4.3,.9,.9,-Math.PI/2],[-14.5,2.3,7.45,.8,.8,0],[-17.9,2.3,7.45,.8,.8,0]];G.add(quadsMesh(webs,wm));HOL.n+=6;for(const w of webs)holPiece('cobweb',w[0],w[2],0,[[w[0],w[1],w[2]]]);}"])
E.append(["    for(let i=0;i<10;i++){const a=i/10*TAU+.3,r=1.9+(i%2)*.4,x=-27.5+Math.cos(a)*r,z=13.5+Math.sin(a)*r,s=.3+(i%3)*.08,c=['#ff4d6d','#7cc8ff','#ffd45c','#5fd4b0','#b79cff'][i%5];box(st,s,s,s,c,x,0,z,{ry:a,ol:.012});",
          "    for(let i=0;i<10;i++){const a=i/10*TAU+.3,r=1.9+(i%2)*.4,x=-27.5+Math.cos(a)*r,z=13.5+Math.sin(a)*r,s=.3+(i%3)*.08,c=['#ff4d6d','#7cc8ff','#ffd45c','#5fd4b0','#b79cff'][i%5];box(st,s,s,s,c,x,0,z,{ry:a,ol:.012});holPiece('present',x,z,0);"])
E.append(["    for(const H of HOUSES){if(isApt(H.id))continue;const fx=Math.sin(H.ry),fz=Math.cos(H.ry),x=H.x+fx*.14,z=H.z+fz*.14,w=new THREE.Group();w.position.set(x,1.95,z);w.rotation.y=H.ry;st.add(w);",
          "    for(const H of HOUSES){if(isApt(H.id))continue;const fx=Math.sin(H.ry),fz=Math.cos(H.ry),x=H.x+fx*.14,z=H.z+fz*.14,w=new THREE.Group();w.position.set(x,1.95,z);w.rotation.y=H.ry;st.add(w);holPiece('wreath',x,z,0,[[x,1.95,z]]);"])
E.append(["    for(const [x,z,ry] of HOL_DOORS){const fx=Math.sin(ry),fz=Math.cos(ry),w=new THREE.Group();w.position.set(x+fx*.1,2.0,z+fz*.1);w.rotation.y=ry;st.add(w);",
          "    for(const [x,z,ry] of HOL_DOORS){const fx=Math.sin(ry),fz=Math.cos(ry),w=new THREE.Group();w.position.set(x+fx*.1,2.0,z+fz*.1);w.rotation.y=ry;st.add(w);holPiece('wreath',x+fx*.1,z+fz*.1,0,[[x+fx*.1,2.0,z+fz*.1]]);"])
E.append(["    const T=buildFurn('xmastree');T.scale.setScalar(4.2);T.position.set(-27.5,0,13.5);st.add(T);HOL.n++;",
          "    const T=buildFurn('xmastree');T.scale.setScalar(4.2);T.position.set(-27.5,0,13.5);st.add(T);HOL.n++;holPiece('christmas tree',-27.5,13.5,0);"])
# the raised beds and mounds in town, for supportAt
E.append(["  for(const [i,sx,sz] of [[1,1,-1],[2,-1,-1],[3,-1,1],[4,1,1]]){const x=fx+sx*8.84,z=fz+sz*8.84;flowerBed(st,x,z,1.8,1.0);col(L,x-.95,z-.55,x+.95,z+.55);",
          "  for(const [i,sx,sz] of [[1,1,-1],[2,-1,-1],[3,-1,1],[4,1,1]]){const x=fx+sx*8.84,z=fz+sz*8.84;flowerBed(st,x,z,1.8,1.0);col(L,x-.95,z-.55,x+.95,z+.55);RAISED.push({x,z,w:1.8,d:1.0,h:.22});"])
E.append(["  for(const [x,z,R] of [[-21.2,-9.7,1.1],[-12.8,-9.7,1.1],[-12.9,-21.6,1.2],[-21.3,-22.3,1.0],[-15.5,-20.2,.9]]){sph(st,R,'#6cc97c',x,0,z,{s:[1,.32,1],ws:12,hs:6});",
          "  for(const [x,z,R] of [[-21.2,-9.7,1.1],[-12.8,-9.7,1.1],[-12.9,-21.6,1.2],[-21.3,-22.3,1.0],[-15.5,-20.2,.9]]){sph(st,R,'#6cc97c',x,0,z,{s:[1,.32,1],ws:12,hs:6});RAISED.push({x,z,R,h:R*.32});"])

json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j3.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
