import sys
p='/home/user/cozy-town/index.html'; s=open(p,encoding='utf-8').read(); orig=s
R=[]
def rep(name,old,new,n=1): R.append((name,old,new,n))
# ---- A. dance and parties
rep('pets hide in dance',"this.g.visible=this.loc===CUR.id&&!(PHO.on&&this.loc==='city');   /* 🐾 your pets wait out of a photo shoot (run 4, stage 3) */",
 "this.g.visible=this.loc===CUR.id&&!(PHO.on&&this.loc==='city')&&!(DANCE.on||DANCE.res);   /* 🐾 your pets wait out of a photo shoot, a dance-off and its result card (run 4, stage 3) */")
rep('friends hide in dance',"&&!(PHO.on&&this.mode==='follow');   /* (a following friend waits out of a photo shoot, run 4 stage 3) */",
 "&&!((PHO.on||DANCE.on||DANCE.res)&&this.mode==='follow');   /* (a following friend waits out of a photo shoot and a dance-off, run 4 stage 3) */")
rep('dnEnd res',"function dnEnd(why){const D=DANCE;if(!D.on)return;D.on=false;D.ended=performance.now();",
 "function dnEnd(why){const D=DANCE;if(!D.on)return;D.on=false;D.res=true;D.ended=performance.now();")
rep('dnEnd keep view',"  document.body.classList.remove('dancing');dnHud(false);P.ride=null;if(D.me){scene.remove(D.me.root);D.me=null;}",
 "  document.body.classList.remove('dancing');dnHud(false);   /* (the view stays on the two dancers until Done: dnLeave; run 4, stage 3) */")
rep('dnbye',"ACT.dnbye=()=>{closePanel();toast('🪩 Another round? Tap Dance! on the floor.',2.6);};",
 "ACT.dnbye=()=>{closePanel();dnLeave();toast('🪩 Another round? Tap Dance! on the floor.',2.6);};\nfunction dnLeave(){const D=DANCE;D.res=false;if(P.ride&&P.ride.kind==='dance')P.ride=null;if(D.me){scene.remove(D.me.root);D.me=null;}}   /* back from the dance view */\nfunction dnNm(n){n=String(n||'');return n.length>11?n.slice(0,10)+'…':n;}   /* a long name ends in … in the score bar */")
rep('dnTick leave',"  if(!D.on)return;\n  D.t+=dt;D.dt=dt;const a=MP.peers.get(D.partner);",
 "  if(D.res&&((performance.now()-D.ended>1500&&!UI.open)||(CUR.id!=='home'&&CUR.id!=='visit')))dnLeave();   /* the result card went some other way: back to the normal view */\n  if(!D.on)return;\n  D.t+=dt;D.dt=dt;const a=MP.peers.get(D.partner);")
rep('dnCam res',"function dnCam(dt){const D=DANCE;if(!D.on||!D.cam){updateCamera(dt);return;}","function dnCam(dt){const D=DANCE;if(!(D.on||D.res)||!D.cam){updateCamera(dt);return;}")
rep('dnBegin leave',"function dnBegin(s,a,left){const f=dnFloor();if(!f){dnCancel();return;}","function dnBegin(s,a,left){if(DANCE.res)dnLeave();const f=dnFloor();if(!f){dnCancel();return;}")
rep('dn names',"$('dnMeN').textContent=(S.name||'Me').slice(0,12);$('dnYouN').textContent=DANCE.partnerNm.slice(0,12);","$('dnMeN').textContent=dnNm(S.name||'Me');$('dnYouN').textContent=dnNm(DANCE.partnerNm);")
rep('dn done btn','<div class="row"><button class="btn mint" data-a="dnbye">👋 Done</button></div>','<div class="row" style="justify-content:center"><button class="btn mint" data-a="dnbye" style="min-height:58px;font-size:21px;padding:0 34px">👋 Done</button></div>')
rep('dnMsg css',"#dnMsg{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);font-size:46px;font-weight:900;color:#fff;text-shadow:0 3px 0 #3d2c5e,0 0 12px rgba(61,44,94,.5);pointer-events:none}",
 "#dnMsg{position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 128px);transform:translateX(-50%);font-size:44px;font-weight:900;color:#ffd45c;white-space:nowrap;text-shadow:-2px -2px 0 #3d2c5e,2px -2px 0 #3d2c5e,-2px 2px 0 #3d2c5e,2px 2px 0 #3d2c5e,0 5px 0 #3d2c5e;pointer-events:none}")
rep('dn landscape',"#dnTop{top:calc(env(safe-area-inset-top,0px) + 64px);left:33%}}   /* wide screens:",
 "#dnTop{top:calc(env(safe-area-inset-top,0px) + 64px);left:33%}#dnMsg{left:20%;top:38%;transform:translate(-50%,-50%);font-size:40px}}@media (orientation:landscape) and (max-height:500px){#dnLane{top:calc(env(safe-area-inset-top,0px) + 6px);height:auto}}   /* wide screens:")
rep('dn lane height',"bottom:calc(env(safe-area-inset-bottom,0px) + 96px);height:min(50vh,340px)}","bottom:calc(env(safe-area-inset-bottom,0px) + 96px);height:min(62vh,420px)}")
rep('disco ball',"const M=toon({color:'#e8f0ff',emissive:new THREE.Color('#9fd8ff'),emissiveIntensity:.35});const b=sph(g,.24,null,.48,1.85,0,{mat:M,ws:10,hs:8,ol:.012});",
 "const M=toon({color:'#dfe8f4',emissive:new THREE.Color('#9fd8ff'),emissiveIntensity:.3,flatShading:true});const b=sph(g,.25,null,.48,1.85,0,{mat:M,ws:12,hs:9,ol:.012});")
rep('mail blurb',"${hpDisco()?'🪩 You have a disco floor and a ball: it is a dance party!':'Tip: a 🪩 disco floor and a disco ball from the furniture shop make it a dance party.'}",
 "${hpDisco()?'🪩 You have a disco floor and ball: a dance party!':'Tip: a 🪩 disco floor and ball make it a dance party!'}")
rep('host blurb',"Pick a time. Everyone playing hears about it, and friends who say yes get the way to your house when it starts!","Pick a time. Your friends get an invitation, and when it starts they can come over!")
# ---- B. holiday spot
rep('bulbs',"{const LM=['#ff4d6d','#ffd45c','#7cc8ff','#5fd4b0'].map(c=>new THREE.MeshBasicMaterial({color:c}));for(let i=0;i<40;i++){const u=i/40,a=u*TAU*3.4,r=2.05*(1-u)+.3,y=1.1+u*5.2;const m=new THREE.Mesh(new THREE.SphereGeometry(.1,6,5),LM[i%4]);",
 "{const LM=HOL_BULB_COLS.map(c=>new THREE.MeshBasicMaterial({color:c}));HOL.bulbs=LM;for(let i=0;i<40;i++){const u=i/40,a=u*TAU*3.4,r=2.05*(1-u)+.3,y=1.1+u*5.2;const m=new THREE.Mesh(new THREE.SphereGeometry(.13,7,6),LM[i%4]);")
rep('holAnim bulbs',"function holAnim(now){if(!HOL.g)return;const t=(now/1000)%1e4;",
 "const HOL_BULB_COLS=['#ff4d6d','#ffd45c','#7cc8ff','#5fd4b0'];\nfunction holAnim(now){if(!HOL.g)return;const t=(now/1000)%1e4;\n  if(HOL.bulbs){const k=Math.floor(t*2.5)%4;HOL.bulbs.forEach((m,i)=>{m.color.set(HOL_BULB_COLS[i]);if((i+k)%4===0)m.color.multiplyScalar(.3);});}   /* 💡 the tree's bulbs blink in turn, by day too (run 4, stage 3) */")
rep('holClear bulbs',"HOL.n=0;HOL.anim=[];HOL.pieces=[];HOL.ghosts=[];HOL.eggs=null;","HOL.n=0;HOL.anim=[];HOL.pieces=[];HOL.ghosts=[];HOL.bulbs=null;HOL.eggs=null;")
rep('presents',"const a=i/10*TAU+.3,r=1.6+(i%2)*.3,x=XT[0]+Math.cos(a)*r,z=XT[1]+Math.sin(a)*r,s=.3+(i%3)*.08,","const a=i/10*TAU+.3,r=1.85+(i%2)*.4,x=XT[0]+Math.cos(a)*r,z=XT[1]+Math.sin(a)*r,s=.44+(i%3)*.1,")
rep('school bunches',"[[-28.6,-58.9],[-21.4,-58.9],[-38.6,-58.9],[-11.4,-58.9],[-33.6,-56.0],[-16.4,-56.0]].forEach(([x,z],k)=>{balloonBunch(g,x,z,[0,1,2,3].map(j=>C[(j+k)%6]));",
 "[[-28.6,-58.9],[-21.4,-58.9],[-38.6,-58.9],[-11.4,-58.9],[-33.6,-56.0],[-16.4,-56.0],[-31.6,-57.4],[-18.4,-57.4]].forEach(([x,z],k)=>{balloonBunch(g,x,z,[0,1,2,3,4].map(j=>C[(j+k)%6]));")
rep('school banner',"  bake(g,true);SCH.cols=L.cols.slice(c0);\n  const I=LOC.school;",
 "  bake(g,true);SCH.cols=L.cols.slice(c0);\n  {const b=signPlane('🎈 School party today! 🎈',6.4,.7,'#ff6b6b','#ffffff');b.position.set(-25,2.55,-58.0);g.add(b);SCH.pieces++;}   /* 🎈 a banner between the door's balloons, read from the street (run 4, stage 3) */\n  const I=LOC.school;")
# ---- C. photographer
rep('walkers out of shot',"const far=Math.hypot(this.x-camera.position.x,this.z-camera.position.z)>48;this.g.visible=CUR.id==='city'&&!far;this.g.position.set(this.x,0,this.z);",
 "const far=Math.hypot(this.x-camera.position.x,this.z-camera.position.z)>48;this.g.visible=CUR.id==='city'&&!far&&!ptInShot(this.x,this.z);this.g.position.set(this.x,0,this.z);   /* (a passer-by between the camera and the family steps out of a photo shoot: run 4, stage 3) */")
rep('ptInShot',"function ptAside(on){","function ptInShot(x,z){if(!PHO.on||!PHO.group.length)return false;const m=PHO.group[0],cx=camera.position.x,cz=camera.position.z,dx=m.x-cx,dz=m.z-cz,L2=dx*dx+dz*dz||1;const u=clamp(((x-cx)*dx+(z-cz)*dz)/L2,-.4,1.4);return Math.hypot(x-(cx+dx*u),z-(cz+dz*u))<3;}   /* within 3 m of the line from the camera to the family? */\nfunction ptAside(on){")
rep('bar pose word','<button class="btn white sq" data-a="ptposes" aria-label="Poses">🧍</button>','<button class="btn white sq" data-a="ptposes" aria-label="Poses">🧍<small>Pose</small></button>')
rep('bar zoom words','<button class="btn white sq" data-a="ptzoom:-" aria-label="Zoom out">−</button><button class="btn white sq" data-a="ptzoom:+" aria-label="Zoom in">+</button>','<button class="btn white sq" data-a="ptzoom:-" aria-label="Zoom out">−<small>Zoom</small></button><button class="btn white sq" data-a="ptzoom:+" aria-label="Zoom in">+<small>Zoom</small></button>')
rep('bar sq css',"#ptbar .btn.sq{width:52px;flex:0 0 52px;padding:6px 0;font-size:24px}","#ptbar .btn.sq{width:58px;flex:0 0 58px;padding:3px 0 2px;font-size:22px;flex-direction:column;line-height:1;gap:0}#ptbar .btn.sq small{font-size:11px;font-weight:800;line-height:1.1}")
rep('short landscape cards',".ptpic{max-height:38vh;width:auto;max-width:100%}",
 ".ptpic{max-height:38vh;width:auto;max-width:100%}\n@media (orientation:landscape) and (max-height:500px){#panel.bottom .card.ptpose{max-height:calc(100vh - 84px);overflow:auto}.ptp .btn{min-height:44px;width:44px;font-size:20px}.ptrow{margin:3px 0}#panel.bottom .card.ptres{width:min(520px,78vw);margin-left:auto;margin-right:auto}#panel.bottom .card.ptres .ptpic{max-height:24vh;margin:4px auto}#panel.bottom .card.ptres .line{margin:4px 0 0}}   /* 📸 short sideways phones: the pose card scrolls, the result card keeps its edges (run 4, stage 3) */")
rep('ph-hd opaque',".ph-hd{display:flex;align-items:center;gap:8px;margin-bottom:4px;position:sticky;top:0;z-index:2;background:rgba(255,255,255,.94);border-radius:14px;padding:4px 6px}",
 ".ph-hd{display:flex;align-items:center;gap:8px;margin:0 -14px 4px;position:sticky;top:0;z-index:2;background:#fff;border-radius:0 0 16px 16px;padding:6px 18px;box-shadow:0 2px 0 rgba(61,44,94,.1)}")
rep('ph-screen narrow',".ph-screen{padding:8px 12px 10px}",".ph-screen{padding:8px 12px 30px}.ph-hd{margin:0 -12px 4px;padding:5px 16px}")
rep('ptvf portrait',"#ptvf{bottom:calc(env(safe-area-inset-bottom,0px) + 134px)}body.shoot #toast{top:calc(env(safe-area-inset-top,0px) + 150px)}}",
 "#ptvf{top:calc(env(safe-area-inset-top,0px) + 150px);bottom:calc(env(safe-area-inset-bottom,0px) + 134px)}body.shoot #toast{top:calc(env(safe-area-inset-top,0px) + 196px)}}")
rep('shoot hides bus tip',"body.shoot #moveBtns,body.shoot #tasks,body.shoot #pad,body.shoot #job{visibility:hidden}","body.shoot #moveBtns,body.shoot #tasks,body.shoot #pad,body.shoot #job,body.shoot #busTip{visibility:hidden}")
rep('tut f1 caption',"em('🔔',330,44,40);arrow(330,80,300,135);up(270,165,46);}","em('🔔',330,44,40);arrow(330,80,300,135);up(270,165,46);txt('Ding! A booking: read it!',130,190,19);}")
# ---- D. tree park
rep('tree toast touch',"Jump from deck to deck (⬆️ or Space), cross the bridges","Jump from deck to deck ('+(TOUCHY?'the ⬆️ button':'⬆️ or Space')+'), cross the bridges")
rep('rope posts',"cyl(st,.03,.03,.95,'#8f6244',(ax?x0+Math.sign(dx)*u:mx)+px,h,(ax?mz:z0+Math.sign(dz)*u)+pz,{seg:5,ol:false});}","cyl(st,.05,.05,.95,'#8f6244',(ax?x0+Math.sign(dx)*u:mx)+px,h,(ax?mz:z0+Math.sign(dz)*u)+pz,{seg:6,ol:.01});}")
rep('ropes',"box(st,ax?gap:.04,.04,ax?.04:gap,'#e8d7b0',mx+px,h+.92,mz+pz,{ol:false});}   /* rope rails */","box(st,ax?gap:.07,.07,ax?.07:gap,'#e8d7b0',mx+px,h+.9,mz+pz,{ol:.01});box(st,ax?gap:.05,.05,ax?.05:gap,'#e8d7b0',mx+px,h+.45,mz+pz,{ol:false});}   /* rope rails: a top rope and a middle rope (run 4, stage 3: thicker, seen from a distance) */")
# ---- E. house floors and colour
rep('stairs door',"plate(pg,up?'⬆️ Upstairs':'⬇️ Downstairs','#ffffff','#3d2c5e',both?.84:1.0,.26,x0+.03,(2.6+H)/2,both?(up?-.44:.44):0,Math.PI/2);}",
 "plate(pg,up?'⬆️ Upstairs':'⬇️ Downstairs','#ffffff','#3d2c5e',both?.84:1.0,.26,x0+.03,(2.6+H)/2,both?(up?-.44:.44):0,Math.PI/2);\n  {const y=up?H:-H;box(g,.07,2.1,1.3,'#5fd4b0',x0-4.2+.04,y,0,{ol:.015});box(g,.09,.5,.5,'#bde9ff',x0-4.2+.05,y+1.35,0,{ol:.012});sph(g,.045,'#ffd45c',x0-4.2+.1,y+1.0,.42,{ws:6,hs:5,ol:false});plate(pg,up?'⬆️':'⬇️','#ffffff','#3d2c5e',.4,.4,x0-4.2+.1,y+.6,-.3,Math.PI/2);}}   /* 🚪 the stairs end at a door with a window and a knob (run 4, stage 3: they ran into a flat wall) */")
rep('upper floor rug',"    else{for(const x of(W>13?[-6,-2,2,6]:[-4.5,-1.5,1.5,4.5]))windowIn(sh,x,1.0,-hd+.02,0);   /* (run 4, stage 3: evenly spaced) */",
 "    else{cyl(sh,1.5,1.5,.03,['#ffd6e0','#dff3ff','#fff2c4','#e2f7e6','#ead9ff'][k%5],0,.005,0,{seg:28,ol:.01});for(const [bx,bz,bw,bd] of[[0,-hd+.04,W-.1,.07],[0,hd-.04,W-.1,.07],[hw-.04,0,.07,D-.1],[-hw+.04,-(hd+UPG)/2-.05,.07,hd-UPG-.1],[-hw+.04,(hd+UPG)/2+.05,.07,hd-UPG-.1]])box(sh,bw,.14,bd,'#ffffff',bx,0,bz,{ol:false});   /* a starter rug and white skirting on a new floor (run 4, stage 3: it looked bare) */\n      for(const x of(W>13?[-6,-2,2,6]:[-4.5,-1.5,1.5,4.5]))windowIn(sh,x,1.0,-hd+.02,0);   /* (run 4, stage 3: evenly spaced) */")
rep('colour card short',"@media (orientation:landscape) and (max-height:500px){.setcard .dots{grid-template-columns:repeat(4,1fr)}}",
 "@media (orientation:landscape) and (max-height:500px){.setcard .dots{grid-template-columns:repeat(6,1fr);gap:6px;margin:6px 0}.setcard .dotb{font-size:12px;padding:4px;gap:4px;border-radius:12px}.setcard .dotb i{flex-basis:20px;height:20px}.setcard .opt{margin-top:4px}.setcard .note{margin:2px 0 4px}}")
# ---- F. one clock
rep('cal cup b',"<b>${WDAYS[i].slice(0,3)}${i===5?' 🏆':''}</b>","<b>${WDAYS[i].slice(0,3)}</b>")
rep('cal cup i',"<i>${i===i0?'⭐':''}</i></div>`;}","<i>${i===i0?'⭐':''}${i===5?'🏆':''}</i></div>`;}")
rep('clock pad',"function clockStr(h){const H=Math.floor(h),M=Math.floor((h-H)*6)*10;return H+':'+(M<10?'0':'')+M;}","function clockStr(h){const H=Math.floor(h),M=Math.floor((h-H)*6)*10;return (H<10?'0':'')+H+':'+(M<10?'0':'')+M;}   /* 01:30 like 22:00 (run 4, stage 3) */")
bad=[]
for name,old,new,n in R:
    c=s.count(old)
    if c!=n: bad.append((name,c)); continue
    s=s.replace(old,new)
print('applied',len(R)-len(bad),'of',len(R)); print('FAILED:',bad)
if s!=orig: open(p,'w',encoding='utf-8').write(s)
