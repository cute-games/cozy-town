"""Stage 3, round-4 critic notes and pass-3/4 glitches (patch g)."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))

# 1 garland: each string piece from point to point (no staircase)
ed("if(i<n)box(g,.03,.03,len/n,'#f4ecff',x+(x2-x1)/n/2,y-.02+(Math.sin((t+.5/n)*Math.PI)-Math.sin(t*Math.PI))*-.17,z+(z2-z1)/n/2,{ry:a,ol:false,center:true});",
   "if(i<n){const t2=(i+1)/n,X=x1+(x2-x1)*t2,Z=z1+(z2-z1)*t2,Y=y1-Math.sin(t2*Math.PI)*.35,hl=Math.hypot(X-x,Z-z),sg=box(g,.03,.03,Math.hypot(hl,Y-y)+.02,'#f4ecff',(x+X)/2,(y+Y)/2,(z+Z)/2,{ol:false,center:true});sg.rotation.order='YXZ';sg.rotation.set(Math.atan2(y-Y,hl),a,0);}   /* (run 4, stage 3: every piece of string runs from point to point, one sagging line, and the flags hang right from it) */")
# 2 bulbs: an 'off' bulb goes pale, never dark
ed("const HOL_BULB_COLS=['#ff4d6d','#ffd45c','#7cc8ff','#5fd4b0'];",
   "const HOL_BULB_COLS=['#ff4d6d','#ffd45c','#7cc8ff','#5fd4b0'],BULB_PALE=new THREE.Color('#fff8e8');   /* (a bulb that is off goes pale, never dark: dark ones read as holes; run 4, stage 3) */")
ed("if((i+k)%4===0)m.color.multiplyScalar(.3);","if((i+k)%4===0)m.color.lerp(BULB_PALE,.62);")
# 3 a real star on top of the holiday tree (and helpers)
ed("function prism(g,len,base,height,c,x,y,z,o={}){",
   "function starGeo(r,t,d){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,q=(i%2?r*.45:r)+t,x=Math.cos(a)*q,y=Math.sin(a)*q;if(i)s.lineTo(x,y);else s.moveTo(x,y);}s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:d+2*t,bevelEnabled:false});g.translate(0,0,-(d/2+t));return g;}\n"
   "function starOn(g,x,y,z,r,c){for(const ry of[0,Math.PI/2]){const m=new THREE.Mesh(starGeo(r,0,r*.22),mat(c||'#ffd45c'));m.position.set(x,y,z);m.rotation.y=ry;g.add(m);hull(g,starGeo(r,r*.1,r*.22),m,{});}}   /* ⭐ two crossed flat stars: a star from every side (run 4, stage 3) */\n"
   "function prism(g,len,base,height,c,x,y,z,o={}){")
ed("cone(g,.07,.14,'#ffd45c',0,1.5,0,{seg:5});","starOn(g,0,1.6,0,.12);")
# 4 Santa holds a big gold coin in his waving hand
ed("if(p.arms&&p.arms[1]){p.arms[1].rotation.z=-2.3;}",
   "if(p.arms&&p.arms[1]){p.arms[1].rotation.z=-2.3;const a=p.arms[1];cyl(a,.13,.13,.035,'#ffd45c',0,-.64,.09,{rx:Math.PI/2,center:true,seg:18,ol:.012});cyl(a,.085,.085,.045,'#f2b632',0,-.64,.09,{rx:Math.PI/2,center:true,seg:18,ol:false});}   /* 🪙 a big gold coin in his waving hand: he gives coins (run 4, stage 3) */")
# 5 the Easter Bunny a step aside from the blossom tree
ed("const bx=-18.3,bz=-12.9;","const bx=-16.6,bz=-12.7;   /* (a step aside from the blossom tree: its crown sat on the bunny's head like a hat; run 4, stage 3) */")
ed("[-22,-15.5],[-17.4,-13]])egg(x,z,i++);","[-22,-15.5],[-18.3,-13.3]])egg(x,z,i++);")
# 6 the cat costume: painted whiskers and a pink nose
ed("if(k==='cat'){for(const s of[-1,1]){cone(head,.09,.17,C,s*.17,.5,-.06,{seg:4,...o});cone(head,.05,.1,'#ffb3c7',s*.17,.52,-.03,{seg:4,ol:false});}",
   "if(k==='cat'){for(const s of[-1,1]){cone(head,.09,.17,C,s*.17,.5,-.06,{seg:4,...o});cone(head,.05,.1,'#ffb3c7',s*.17,.52,-.03,{seg:4,ol:false});for(const [y,r] of[[.125,.12],[.095,-.1]])box(head,.15,.012,.008,'#3d2c5e',s*.2,y,.231,{rz:s*r,center:true,ol:false});}sph(head,.028,'#ff9ec4',0,.16,.232,{s:[1.2,.8,.6],ws:8,hs:6,ol:false});   /* 🐱 painted whiskers and a pink nose (run 4, stage 3) */")
# 7 ghosts and bats glide round the camera, never through it
ed("const m=new THREE.ShaderMaterial({uniforms:{tm:{value:0},op:{value:1}},transparent:!!o.fade,depthWrite:!o.fade,",
   "const m=new THREE.ShaderMaterial({uniforms:{tm:{value:0},op:{value:1},cp:{value:new THREE.Vector3(0,-999,0)}},transparent:!!o.fade,depthWrite:!o.fade,")
ed("'attribute vec3 ctr;attribute vec4 fly;attribute float wing;attribute float flp;uniform float tm;varying vec3 vC;varying float vY;void main(){float th=tm*fly.y+fly.x;vec3 c=ctr+vec3(sin(th)*fly.z,sin(th*1.7+fly.x*2.0)*fly.w,cos(th)*fly.z);'+",
   "'attribute vec3 ctr;attribute vec4 fly;attribute float wing;attribute float flp;uniform float tm;uniform vec3 cp;varying vec3 vC;varying float vY;void main(){float th=tm*fly.y+fly.x;vec3 c=ctr+vec3(sin(th)*fly.z,sin(th*1.7+fly.x*2.0)*fly.w,cos(th)*fly.z);vec2 dv=c.xz-cp.xz;float dl=length(dv);if(dl<3.2&&dl>0.001)c.xz+=dv/dl*(3.2-dl);'+")
ed("m.userData.hol=1;const mesh=new THREE.Mesh(geo,m);mesh.userData.keep=1;mesh.frustumCulled=false;return mesh;}",
   "m.userData.hol=1;const mesh=new THREE.Mesh(geo,m);mesh.userData.keep=1;mesh.frustumCulled=false;const cv=new THREE.Vector3();mesh.onBeforeRender=(r,sc,cam)=>{cv.copy(cam.position);mesh.worldToLocal(cv);m.uniforms.cp.value.copy(cv);};   /* 👻 ghosts and bats glide round you 3 m away, never through the camera (run 4, stage 3) */return mesh;}")
# 8 a tall house turns its pointed roof end to the street
ed("  if(o.gable){const a=d/2+.5,H=o.rh||2.2,th=Math.atan2(H,a),Ls=Math.hypot(a,H)+.12;",
   "  if(o.gable&&o.fgable){const a=w/2+.5,H=o.rh||2.2,th=Math.atan2(H,a),Ls=Math.hypot(a,H)+.12;   /* 🏡 a tall house turns its roof's pointed end to the street: from the pavement below, a side roof looked flat (run 4, stage 3) */\n"
   "    for(const s of[1,-1])box(g,Ls,.2,d+.8,o.roof,x+s*a/2,h+H/2-.06,z,{rz:-s*th,center:true,ol:.04});\n"
   "    prism(g,d-.04,w-.04,H*.96,o.wall,x,h,z,{ol:false,ry:Math.PI/2});\n"
   "    if(o.chimney!==false){box(g,.7,1.8,.7,trim,x+w*.27,h+.5,z-d*.18);box(g,.9,.18,.9,shade(trim,-.1),x+w*.27,h+2.3,z-d*.18,{ol:.02});}\n"
   "    box(g,.32,.16,d+.9,shade(o.roof,-.1),x,h+H-.1,z,{ol:.03});box(g,w+.1,.22,d+.1,trim,x,h-.22,z,{ol:.015});\n"
   "    windowAt(g,x,h+.35,fz+f*.02,ry,'#ffffff',.7,.7);}\n"
   "  else if(o.gable){const a=d/2+.5,H=o.rh||2.2,th=Math.atan2(H,a),Ls=Math.hypot(a,H)+.12;")
ed("face:lp.s<0?1:-1,gable:true,rh:big?2.8:2.6,","face:lp.s<0?1:-1,gable:true,fgable:big,rh:big?2.8:2.6,")
# 9 the locked pots show a plate in the middle of each row of them
ed("for(const [i,x,z] of YARD_POTS){cyl(st,.26,.2,.3,'#c9805a',x,0,z,{seg:10,ol:.015});cyl(st,.29,.29,.05,'#b8704c',x,.28,z,{seg:10,ol:.012});colC(FL,x,z,.32);L.plots.push({i,x,z,pot:1});}   /* 🪴 the pots */",
   "for(const [i,x,z] of YARD_POTS){cyl(st,.26,.2,.3,'#c9805a',x,0,z,{seg:10,ol:.015});cyl(st,.29,.29,.05,'#b8704c',x,.28,z,{seg:10,ol:.012});colC(FL,x,z,.32);L.plots.push({i,x,z,pot:1});}   /* 🪴 the pots */\n"
   "  {const pots=L.plots.filter(p=>p.pot);let run=[];const end=()=>{if(run.length)run[Math.floor((run.length-1)/2)].lock=1;run=[];};pots.forEach((p,k)=>{const q=pots[k-1];if(q&&(plotGate(p.i)!==plotGate(q.i)||Math.hypot(p.x-q.x,p.z-q.z)>1.2))end();run.push(p);});end();}   /* 🔒 one lock plate in the middle of each row of pots of one level (run 4, stage 3) */")
ed("  const need=!st.seed?'':st.g>=1?'✨':st.w!==S.day?'💧':'';\n  if(need!==rec.iconK){rec.iconK=need;if(rec.icon){YARD.gin.remove(rec.icon);rec.icon=null;}if(need){const s=label(need,.42,{bg:null,bw:0,pad:4});s.position.set(rec.pl.x,rec.pl.pot?1.0:1.25,rec.pl.z);YARD.gin.add(s);rec.icon=s;}}",
   "  const lk=!plotOpen(rec.pl.i),need=lk?(rec.pl.lock?'🔒 Level '+plotGate(rec.pl.i):''):!st.seed?'':st.g>=1?'✨':st.w!==S.day?'💧':'';   /* 🔒 a row of locked pots says its level on a little plate (run 4, stage 3) */\n  if(need!==rec.iconK){rec.iconK=need;if(rec.icon){YARD.gin.remove(rec.icon);rec.icon=null;}if(need){const s=lk?label(need,.3):label(need,.42,{bg:null,bw:0,pad:4});s.position.set(rec.pl.x,lk?.8:rec.pl.pot?1.0:1.25,rec.pl.z);YARD.gin.add(s);rec.icon=s;}}")
# 10 the stair door plates say Upstairs / Downstairs
ed("plate(pg,up?'⬆️ Up':'⬇️ Down','#ffffff','#3d2c5e',.92,.3,x0-4.2+.1,y+.72,0,Math.PI/2);",
   "plate(pg,up?'⬆️ Upstairs':'⬇️ Downstairs','#ffffff','#3d2c5e',1.22,.3,x0-4.2+.1,y+.72,0,Math.PI/2);")
# 11 the house colour card: the slider and the lane button show the house's colour now
ed('<input type="range" id="hcHue" min="0" max="360" value="${cur?Math.round(hexHue(cur)):270}"',
   '<input type="range" id="hcHue" min="0" max="360" value="${Math.round(hexHue(houseColNow()))}"')
ed("<button class=\"btn ${cur?'white':'mint'}\" data-a=\"hcol:\">${cur?'':'✅ '}↩️ The lane's own colour</button>",
   "<button class=\"btn ${cur?'white':'mint'}\" id=\"hcLane\" data-a=\"hcol:\">${cur?'↩️':'✅'} The lane's own colour</button>")
ed("const b=c&&document.querySelector(`#card [data-a=\"hcol:${c}\"]`);if(b)b.classList.add('on');}",
   "const b=c&&document.querySelector(`#card [data-a=\"hcol:${c}\"]`);if(b)b.classList.add('on');const lb=$('hcLane');if(lb){lb.className='btn '+(c?'white':'mint');lb.textContent=(c?'↩️':'✅')+\" The lane's own colour\";}const sl=$('hcHue');if(sl&&document.activeElement!==sl)sl.value=Math.round(hexHue(houseColNow()));}")
ed("#card.hpaint>.opt,#card.hpaint>.row{grid-column:2}",
   "#card.hpaint>.opt,#card.hpaint>.row{grid-column:2}#card.hpaint .dotb{min-height:44px;font-size:13px;padding:5px 6px}#card.hpaint .dotb i{flex-basis:24px;height:24px}")
# 12 a message never sits on the photo bar; it moves back when a card goes
ed("for(const id of['knockCard','tutCard','dtCard','tchBar'])add($(id),8);","for(const id of['knockCard','tutCard','dtCard','tchBar','ptbar'])add($(id),8);")
ed("function closePanel(){const p=$('panel');if(p.hidden)return;p.hidden=true;UI.open=false;UI.lock=false;const f=UI.onClose;UI.onClose=null;if(f)f();}",
   "function closePanel(){const p=$('panel');if(p.hidden)return;p.hidden=true;UI.open=false;UI.lock=false;const f=UI.onClose;UI.onClose=null;if(f)f();try{toastPlace();}catch(e){}}   /* (a message placed round the card moves to its own spot when the card goes: run 4, stage 3) */")
# 13 the joystick on a short sideways screen goes to the left edge during a shoot (the corner map hides then)
ed("@media (max-height:500px) and (orientation:landscape){#joy{left:calc(env(safe-area-inset-left,0px) + 300px);bottom:calc(env(safe-area-inset-bottom,0px) + 16px)}}",
   "@media (max-height:500px) and (orientation:landscape){#joy{left:calc(env(safe-area-inset-left,0px) + 300px);bottom:calc(env(safe-area-inset-bottom,0px) + 16px)}body.shoot #joy{left:calc(env(safe-area-inset-left,0px) + 26px)}}")
# 14 the coin pop flies where no chip, button or card is
ed("document.body.appendChild(e);POPQ.el=e;popClear();","document.body.appendChild(e);POPQ.el=e;if(cls==='coin')popFit(e);popClear();")
ed("function popClear(){",
   "function popFit(e){const W=innerWidth,w=e.offsetWidth,h=e.offsetHeight,K=[],add=(el,k)=>{const r=boxOf(el);if(r)K.push([r,k]);};   /* 🪙 the coin pop flies where no chip, button or card is (run 4, stage 3: it sat on the clock chip) */\n"
   "  for(const id of['stats','topbtns','left','bChat','tasks','job'])add($(id),4);if(!$('panel').hidden){const r=cardBox();if(r)K.push([r,1]);}\n"
   "  const st=boxOf($('stats')),tb=boxOf($('topbtns')),sx=st?st.right:0,ty=(tb?tb.bottom:hudLow())+6,s=spotFor(w,h,[[W/2,visH()*.2-h/2],[W/2,hudLow()+6],[(sx+W)/2,ty]],K);\n"
   "  if(s){e.style.left=Math.round(s[0])+'px';e.style.top=Math.round(s[1]+h/2)+'px';}}\n"
   "function popClear(){")
# 15 an upright phone: the pose card at the bottom, three poses a row, the people stay in view
ed("#panel.bottom:has(.card.ptpose){align-items:flex-start;padding-top:calc(env(safe-area-inset-top,0px) + 150px)}",
   "#panel.bottom .card.ptpose .grid{grid-template-columns:repeat(3,1fr);gap:8px}#panel.bottom .card.ptpose .it{padding:6px 4px 5px;border-radius:16px}#panel.bottom .card.ptpose .it .em{font-size:30px}#panel.bottom .card.ptpose .note{margin:0 0 6px}")
ed("body:has(#panel:not([hidden]) #card.ptpose) #ptbar{visibility:hidden}","body:has(#panel:not([hidden]) #card.ptpose) :is(#ptbar,#joy){visibility:hidden}")
# 16 the shoot hints keep "Snap!" with its word
ed("toast('📸 Pose everyone, frame them, then Snap!',3.6)","toast('📸 Pose everyone, then\\u00a0Snap!',3.6)")
ed("'📸 Everyone is posed! Frame them and Snap!'","'📸 Everyone is posed! Frame them and\\u00a0Snap!'",2)
# 17 bigger words under the photo bar's signs
ed("#ptbar .btn.sq small{font-size:11px;font-weight:800;line-height:1.1}","#ptbar .btn.sq small{font-size:14px;font-weight:900;line-height:1.1}")
# 18 the dance view stays until the result card has been up
ed("if(D.res&&((performance.now()-D.ended>1500&&!UI.open)||(CUR.id!=='home'&&CUR.id!=='visit')))dnLeave();",
   "if(D.res&&((D.shown&&performance.now()-D.ended>1500&&!UI.open)||(performance.now()-D.ended>9000&&!UI.open)||(CUR.id!=='home'&&CUR.id!=='visit')))dnLeave();   /* (run 4, stage 3: only once the result card has been up; on a slow device the card came after the 1.5 s and the view went back first) */")
ed("D.on=false;D.res=true;D.ended=performance.now();","D.on=false;D.res=true;D.shown=false;D.ended=performance.now();")
ed("👋 Done</button></div>`,{bottom:true,lock:true});","👋 Done</button></div>`,{bottom:true,lock:true});D.shown=true;")
# 19 big titles on the party and dance cards; "You" on the score bar
ed("#hpCard .kc-b,#dnCard .kc-b{display:flex;gap:10px;justify-content:center}","#hpCard .kc-b,#dnCard .kc-b{display:flex;gap:10px;justify-content:center}#hpCard .kc-t,#dnCard .kc-t{font-size:28px;line-height:1.15}")
ed('<div id="dnTop"><div class="dnFace"><span class="em">🙂</span><b id="dnMeN">Me</b>','<div id="dnTop"><div class="dnFace me"><span class="em">😄</span><b id="dnMeN">You</b>')
ed("$('dnMeN').textContent=dnNm(S.name||'Me');","$('dnMeN').textContent='You';")
ed(".dnFace{display:flex;flex-direction:column;align-items:center;min-width:64px;font-size:13px;font-weight:800;line-height:1.1}",
   ".dnFace{display:flex;flex-direction:column;align-items:center;min-width:64px;font-size:15px;font-weight:900;line-height:1.1}.dnFace.me b{background:#5fd4b0;color:#fff;border-radius:999px;padding:1px 9px}")
# 20 a bigger mirror ball, higher up, with coloured light spots sweeping the floor during a dance
ed("cyl(g,.025,.025,2.3,'#c8c8d8',0,.05,0,{seg:8,ol:.01});box(g,.5,.03,.03,'#c8c8d8',.24,2.33,0,{ol:false});cyl(g,.01,.01,.25,'#c8c8d8',.48,2.08,0,{seg:4,ol:false});",
   "cyl(g,.025,.025,2.65,'#c8c8d8',0,.05,0,{seg:8,ol:.01});box(g,.56,.03,.03,'#c8c8d8',.27,2.68,0,{ol:false});cyl(g,.01,.01,.17,'#c8c8d8',.54,2.51,0,{seg:4,ol:false});")
ed("const b=sph(g,.26,null,.48,1.85,0,{mat:M,ws:16,hs:12,ol:.012});b.userData.shade=1;b.userData.ball=1;for(let i=0;i<10;i++){const a=i*2.4,y=1.85+Math.sin(i*1.7)*.16,r=Math.sqrt(Math.max(0,.0576-(y-1.85)*(y-1.85)));sph(g,.03,['#ff4d8d','#7cc8ff','#ffd45c','#5fd4b0'][i%4],.48+Math.cos(a)*r,y,Math.sin(a)*r,{ws:5,hs:4,ol:false});}",
   "const b=sph(g,.36,null,.54,2.15,0,{mat:M,ws:18,hs:14,ol:.014});b.userData.shade=1;b.userData.ball=1;for(let i=0;i<14;i++){const a=i*2.4,y=2.15+Math.sin(i*1.7)*.22,r=Math.sqrt(Math.max(0,.1225-(y-2.15)*(y-2.15)));sph(g,.04,['#ff4d8d','#7cc8ff','#ffd45c','#5fd4b0'][i%4],.54+Math.cos(a)*r,y,Math.sin(a)*r,{ws:5,hs:4,ol:false});}   /* (run 4, stage 3: bigger and higher, above the dancers' heads) */")
ed("const me=makePerson(lookToPerson(packLook()));bakePerson(me);scene.add(me.root);DANCE.me=me;dnHud(true);SFX.ding();}",
   "const me=makePerson(lookToPerson(packLook()));bakePerson(me);scene.add(me.root);DANCE.me=me;dnSpots(f);dnHud(true);SFX.ding();}\n"
   "/* 🪩 coloured light spots from the mirror ball sweep round the floor during a dance-off and its result (run 4, stage 3) */\n"
   "function dnSpots(f){dnSpotsOff();const g=new THREE.Group(),C=['#ff4d8d','#7cc8ff','#ffd45c','#5fd4b0','#b79cff'];for(let i=0;i<22;i++){const a=i*2.39996,r=1.4+(i*.37)%2.4,m=new THREE.Mesh(new THREE.CircleGeometry(.13+(i%3)*.04,14),new THREE.MeshBasicMaterial({color:C[i%5],transparent:true,opacity:.55,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(Math.cos(a)*r,.012+i*.0004,Math.sin(a)*r);g.add(m);}g.position.set(f.x,0,f.z);scene.add(g);DANCE.spots=g;}\n"
   "function dnSpotsOff(){const g=DANCE.spots;if(!g)return;scene.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});DANCE.spots=null;}")
ed("function dnTick(dt){const D=DANCE;if(!S)return;","function dnTick(dt){const D=DANCE;if(!S)return;if(D.spots)D.spots.rotation.y+=dt*.5;")
ed("function dnLeave(){const D=DANCE;D.res=false;","function dnLeave(){const D=DANCE;D.res=false;dnSpotsOff();")
# 21 friends in the fan never stand straight behind each other as you look
ed("for(const g of got)if(Math.hypot(g[0]-x,g[1]-z)<1.5)return false;return fLine(P.x,P.z,x,z);};",
   "const bx=Math.atan2(x-P.x,z-P.z);for(const g of got){if(Math.hypot(g[0]-x,g[1]-z)<1.5)return false;const da=Math.atan2(g[0]-P.x,g[1]-P.z)-bx;if(Math.abs(Math.atan2(Math.sin(da),Math.cos(da)))<.24)return false;}return fLine(P.x,P.z,x,z);};   /* (and never straight behind another friend as you look: run 4, stage 3) */")
# 22 the Pet Shop's pen signs above the windows; the hamster tank's glass fainter
ed("s.position.set((x0+x1)/2,2.3,z1<0?-D/2+.06:D/2-.06);","s.position.set((x0+x1)/2,2.95,z1<0?-D/2+.06:D/2-.06);   /* (run 4, stage 3: above the windows, which hid them) */")
ed("const cg=toon({color:'#cfeeff',transparent:true,opacity:.3});","const cg=toon({color:'#cfeeff',transparent:true,opacity:.16});")
# 23 the Tree Park: the Finish banner behind the bell, the medium sign as big as the others, a star over the next deck
ed("const fs=signPlane('🏁 Finish',1.7,.5,PA.c,'#3d2c5e');fs.position.set(d.x,d.h+2.3,d.z-(d.s||2.4)/2+.18);fs.rotation.y=0;L.g.add(fs);TP.signs.push(fs);for(const s of[-.8,.8])cyl(st,.05,.05,2.3,'#8f6244',d.x+s,d.h,d.z-(d.s||2.4)/2+.1,{seg:5,ol:false});",
   "const fx=d.x-.5,fs=signPlane('🏁 Finish',1.4,.46,PA.c,'#3d2c5e');fs.position.set(fx,d.h+2.3,d.z-(d.s||2.4)/2+.18);fs.rotation.y=0;L.g.add(fs);TP.signs.push(fs);for(const s of[-.65,.65])cyl(st,.05,.05,2.3,'#8f6244',fx+s,d.h,d.z-(d.s||2.4)/2+.1,{seg:5,ol:false});   /* (run 4, stage 3: the banner hangs behind the bell, so it shows while you ring it) */")
ed("const sg=signPlane(PA.e+' '+PA.n,2.3,.56,PA.c,'#3d2c5e');","const sg=signPlane(PA.e+' '+PA.n,k==='medium'?2.75:2.3,.56,PA.c,'#3d2c5e');   /* (the longer name gets a longer sign: the same letters as the others) */")
ed("const mk=new THREE.Group();cone(mk,.34,.5,'#ffd45c',0,0,0,{rx:Math.PI,center:true,seg:8,ol:.02});cyl(mk,.11,.11,.5,'#ffd45c',0,.5,0,{seg:8,ol:.02});",
   "const mk=new THREE.Group();starOn(mk,0,0,0,.42);   /* (run 4, stage 3: a turning star; the arrow looked like a floating pencil in two pieces) */")
ed("if(nx)mk.position.set(nx.x-L.ox,nx.h+2.3+Math.sin(performance.now()/260)*.14,nx.z-L.oz);}",
   "if(nx){mk.position.set(nx.x-L.ox,nx.h+2.3+Math.sin(performance.now()/260)*.14,nx.z-L.oz);mk.rotation.y=performance.now()/700;}}")
# 24 the photo chat's header says Photos
ed("pc:{n:'Photo bookings',av:'📸',c:'#ffd45c'}","pc:{n:'Photo bookings',h:'Photos',av:'📸',c:'#ffd45c'}")
ed("${C.av}</span>${C.n.split(' · ')[0]}</h3>","${C.av}</span>${C.h||C.n.split(' · ')[0]}</h3>")
# 25 the school sign background: in front of the facade, the sign above the group, no tree in the way
ed("{id:'flag',n:'the school sign',g:[-31,-56.4],face:.4}","{id:'flag',n:'the school sign',g:[-23.0,-55.2],face:-.25}")
# 26 two ducks never swim into each other
ed("  d.g.position.set(d.x,.02+Math.sin(tt*3+d.x)*.02,d.z);d.g.rotation.y=angLerp(d.g.rotation.y,d.face,Math.min(1,dt*5));}}",
   "  for(const e of LOC.city.ducks)if(e!==d&&e.pond===d.pond&&e.x!==undefined){const sx=d.x-e.x,sz=d.z-e.z,sd=Math.hypot(sx,sz);if(sd<.62&&sd>1e-4){const k=(.62-sd)/2,nx=d.x+sx/sd*k,nz=d.z+sz/sd*k;if(duckOk(d.pond,nx,nz)){d.x=nx;d.z=nz;}}}   /* 🦆 two ducks never swim into each other (run 4, stage 3) */\n"
   "  d.g.position.set(d.x,.02+Math.sin(tt*3+d.x)*.02,d.z);d.g.rotation.y=angLerp(d.g.rotation.y,d.face,Math.min(1,dt*5));}}")
# 27 indoors: a bigger normal bias (no shadow stripes on the counters' sides)
ed("sun.color.set('#fff3e0');sun.intensity=.4;SUND.set(.25,1,.35).normalize();",
   "sun.color.set('#fff3e0');sun.intensity=.4;SUND.set(.25,1,.35).normalize();sun.shadow.normalBias=.2;   /* (indoors the light comes from above: a bigger normal bias keeps the counters' sides free of shadow stripes; run 4, stage 3) */")

bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:100]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
