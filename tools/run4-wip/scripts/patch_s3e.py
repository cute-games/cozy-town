p='/home/user/cozy-town/index.html'; s=open(p,encoding='utf-8').read(); orig=s; R=[]
def rep(name,old,new,n=1): R.append((name,old,new,n))
# ---------- photographer
rep('bg toast off',"ptPlace(Sp.bgs[(i+1)%Sp.bgs.length].id);SFX.tap();toast('🏞️ '+Sp.bgs.find(b=>b.id===PHO.bg).n,1.6);}",
 "ptPlace(Sp.bgs[(i+1)%Sp.bgs.length].id);SFX.tap();}   /* (the bar shows the background's name; run 4, stage 3: a toast with it sat on the family's legs) */")
rep('friend targets',"  for(const f of FRIEND_ACTORS)if(f.mode!=='away'&&f.loc===CUR.id)out.push(f.target);",
 "  for(const f of FRIEND_ACTORS)if(f.mode!=='away'&&f.loc===CUR.id&&f.g.visible)out.push(f.target);   /* (a friend waiting out of a photo or a dance offers no button: run 4, stage 3) */")
rep('pet targets',"  for(const p of PET_ACTORS)if(p.loc===CUR.id)out.push(p.target);",
 "  for(const p of PET_ACTORS)if(p.loc===CUR.id&&p.g.visible)out.push(p.target);")
rep('shoot hint',"toast('📸 Pick the background, tap each person for a pose, then frame them and Snap!',4.2);","toast('📸 Pose everyone, frame them, then Snap!',3.6);")
rep('shoot tag ref',"p.root.add(tg);   /* (run 4, stage 3: a name tag is drawn over anyone nearer the camera, so it is always readable) */\n    const m={p,root:p.root,nm,pose:null,t:Math.random()*6,kind:'person'};",
 "p.root.add(tg);   /* (run 4, stage 3: a name tag is drawn over anyone nearer the camera, so it is always readable) */\n    const m={p,root:p.root,nm,pose:null,t:Math.random()*6,kind:'person',lab:tg};")
rep('snap clears',"$('ptvf').hidden=true;$('ptbar').hidden=true;$('toast').classList.remove('show');","$('ptvf').hidden=true;$('ptbar').hidden=true;toastOff();for(const q of PHO.group)if(q.lab)q.lab.visible=false;")
rep('shoot tags apart',"  if(PHO.on){if(CUR.id!=='city'){ptClear();if(d.o)d.o.st='go';}else ptAnim(dt);}",
 "  if(PHO.on){if(CUR.id!=='city'){ptClear();if(d.o)d.o.st='go';}else{ptAnim(dt);tagsApart(PHO.group.filter(m=>m.lab&&m.lab.visible).map(m=>({tag:m.lab})));}}   /* (the family's name tags step apart on screen) */")
rep('pose card side',"openPanel(`<div class=\"hd\"><h2>🧍 ${esc(m.nm)}</h2>","const _v=m.root.position.clone();_v.y+=1;_v.project(camera);const right=_v.x<0&&innerWidth>innerHeight;   /* (on a wide screen the card opens on the side away from the person: run 4, stage 3) */\n  openPanel(`<div class=\"hd\"><h2>🧍 ${esc(m.nm)}</h2>")
rep('pose card cls',"`).join('')}</div>`,{bottom:true,cls:'ptpose'});}","`).join('')}</div>`,{bottom:true,cls:'ptpose'+(right?' pright':'')});}")
rep('ptres two columns',"#panel.bottom .card.ptres{width:min(520px,78vw);margin-left:auto;margin-right:auto}#panel.bottom .card.ptres .ptpic{max-height:24vh;margin:4px auto}#panel.bottom .card.ptres .line{margin:4px 0 0}}",
 "#panel.bottom .card.ptres{width:min(660px,88vw);margin-left:auto;margin-right:auto;display:grid;grid-template-columns:auto 1fr;column-gap:14px;align-items:center;max-height:calc(100vh - 78px)}#panel.bottom .card.ptres>.who{grid-column:1/-1;justify-self:start}#panel.bottom .card.ptres .ptpic{grid-column:1;grid-row:2/span 3;max-height:56vh;max-width:46vw;margin:0}#panel.bottom .card.ptres .line,#panel.bottom .card.ptres .earn,#panel.bottom .card.ptres .row{grid-column:2;margin:2px 0}}\n@media (orientation:landscape){#panel.bottom .card.ptpose.pright{margin-left:auto;margin-right:0}}body:has(#card.ptpose) #ptbar{visibility:hidden}@media (orientation:landscape) and (pointer:coarse){#ptvf{left:calc(env(safe-area-inset-left,0px) + 186px)}}   /* 📸 the photo beside its words on a short sideways phone; the pose card away from the person, the bar hidden under it; on a touch screen held sideways the frame starts right of the joystick (run 4, stage 3) */")
# ---------- the phone
rep('phone header flush',".ph-hd{display:flex;align-items:center;gap:8px;margin:0 -14px 4px;position:sticky;top:0;z-index:2;background:#fff;border-radius:0 0 16px 16px;padding:6px 18px;box-shadow:0 2px 0 rgba(61,44,94,.1)}",
 ".ph-hd{display:flex;align-items:center;gap:8px;margin:0 -14px 4px;position:sticky;top:0;z-index:2;background:#fff;border-radius:0 0 16px 16px;padding:10px 18px 6px;box-shadow:0 2px 0 rgba(61,44,94,.1)}.ph-screen:has(>.ph-hd){padding-top:0}   /* (the screen's top padding sat above the sticky header and the scrolled chat showed through it: run 4, stage 3) */")
rep('phone header narrow',".ph-screen{padding:8px 12px 30px}.ph-hd{margin:0 -12px 4px;padding:5px 16px}",".ph-screen{padding:8px 12px 30px}.ph-hd{margin:0 -12px 4px;padding:8px 16px 5px}")
rep('phone hides controls',".card.phonecard{background:transparent;border:0;box-shadow:none;padding:0;width:auto;overflow:visible}",
 ".card.phonecard{background:transparent;border:0;box-shadow:none;padding:0;width:auto;overflow:visible}body:has(#card.phonecard) #joy,body:has(#card.phonecard) #moveBtns{visibility:hidden}")
# ---------- cards and the HUD
rep('panel under hud',"#panel.bottom{align-items:flex-end;background:transparent}",
 "#panel.bottom{align-items:flex-end;background:transparent}@media (min-height:600px){#panel:not(.bottom):not(.side):not(:has(#card.phonecard)){padding-top:calc(env(safe-area-inset-top,0px) + 72px)}}   /* (a tall card starts under the HUD's top row: run 4, stage 3) */")
rep('hint avoids buttons',"else if(right){a.style.left=Math.round(r.right+4-p.left)+'px';a.style.top=Math.round(r.bottom-54-p.top)+'px';}",
 "else if(right){const mb=boxOf($('moveBtns')),hx=r.right+4,top=mb&&hx+46>mb.left&&hx<mb.right?Math.min(r.bottom-54,mb.top-54):r.bottom-54;a.style.left=Math.round(hx-p.left)+'px';a.style.top=Math.round(top-p.top)+'px';}   /* (never on the run or jump button) */")
rep('newin dot line',".dot{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid #3d2c5e;vertical-align:-2px;margin-left:2px}",
 ".dot{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid #3d2c5e;vertical-align:-2px;margin-left:2px}.ni .dot{display:block;margin:3px auto 0}   /* (a New-in tile's colour dot always sits under its name: run 4, stage 3) */")
rep('map controls in title',"function mapCtlPlace(){const c=document.querySelector('.mp-ctl'),h=document.querySelector('.mp-hd');if(!c||!h)return;if(innerWidth>innerHeight&&innerHeight<520){",
 "function mapCtlPlace(){const c=document.querySelector('.mp-ctl'),h=document.querySelector('.mp-hd');if(!c||!h)return;if(innerWidth>innerHeight&&innerHeight<520||innerWidth>=900){")
# ---------- the dance
rep('dance short landscape hud',"@media (orientation:landscape) and (max-height:500px){#dnLane{top:calc(env(safe-area-inset-top,0px) + 6px);height:auto}}",
 "@media (orientation:landscape) and (max-height:500px){#dnLane{top:calc(env(safe-area-inset-top,0px) + 6px);height:auto}body.dancing #topbtns,body.dancing #stats{visibility:hidden}}")
rep('dance names',"function dnNm(n){n=String(n||'');return n.length>11?n.slice(0,10)+'…':n;}","function dnNm(n){n=String(n||'');return n.length>13?n.slice(0,12)+'…':n;}")
rep('dnMsg landscape',"#dnMsg{left:20%;top:38%;transform:translate(-50%,-50%);font-size:40px}}","#dnMsg{left:auto;right:calc(3% + min(300px,30vw) + 14px);top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 140px);transform:none;font-size:40px}}")
rep('dance arrows big',"d.style.top='-60px';d.innerHTML=dnArrow(q.d,40);","d.style.top='-60px';d.innerHTML=dnArrow(q.d,52);")
rep('dance hit big',"<div class=\"dnHit\" style=\"left:${i*25}%\">${dnArrow(i,34)}</div>","<div class=\"dnHit\" style=\"left:${i*25}%\">${dnArrow(i,48)}</div>")
rep('dnArr css',".dnArr{position:absolute;width:25%;height:40px;display:flex;justify-content:center;margin-top:-20px;transition:none}",".dnArr{position:absolute;width:25%;height:52px;display:flex;justify-content:center;margin-top:-26px;transition:none}")
rep('party cards wider',"text-align:center;width:min(360px,90vw);color:#3d2c5e;animation:kcPop .35s ease-out}","text-align:center;width:min(410px,92vw);color:#3d2c5e;animation:kcPop .2s ease-out}")
rep('disco ball tiles',"const M=toon({color:'#dfe8f4',emissive:new THREE.Color('#9fd8ff'),emissiveIntensity:.3,flatShading:true});const b=sph(g,.25,null,.48,1.85,0,{mat:M,ws:12,hs:9,ol:.012});",
 "const M=toon({map:discoTex(),emissive:new THREE.Color('#b9c6ff'),emissiveIntensity:.25});const b=sph(g,.26,null,.48,1.85,0,{mat:M,ws:16,hs:12,ol:.012});")
rep('disco tex fn',"/* 🖼️ little pictures of furniture, made with the game's own 3D models */",
 "let DISCOTEX=null;function discoTex(){if(DISCOTEX)return DISCOTEX;const c=document.createElement('canvas');c.width=128;c.height=64;const x=c.getContext('2d'),r=seeded(31),G=['#f4f7ff','#c9d2e6','#9aa6c2','#ffffff','#e3e8f5'],K=['#ff9ec4','#7cc8ff','#ffd45c','#b79cff'];   /* 🪩 a mirror ball: little silver tiles with a few coloured glints (run 4, stage 3: it read as a white balloon) */\n  x.fillStyle='#6d7894';x.fillRect(0,0,128,64);for(let j=0;j<8;j++)for(let i=0;i<16;i++){x.fillStyle=r()<.1?K[(r()*K.length)|0]:G[(r()*G.length)|0];x.fillRect(i*8+1,j*8+1,6,6);}DISCOTEX=new THREE.CanvasTexture(c);return DISCOTEX;}\n/* 🖼️ little pictures of furniture, made with the game's own 3D models */")
# ---------- holiday spot
rep('school banner',"{const b=signPlane('🎈 School party today! 🎈',6.4,.7,'#ff6b6b','#ffffff');b.position.set(-25,2.55,-58.0);","{const b=signPlane('🎈 School party today! 🎈',6.4,.7,'#ff6b6b','#ffffff');b.position.set(-25,2.98,-57.72);")
rep('santa xz',"p.root.position.set(x,0,z);p.root.rotation.y=.06;G.add(p.root);HOL.santa=p;","p.root.position.set(x,0,z);p.root.rotation.y=.06;G.add(p.root);HOL.santa=p;HOL.santaXZ=[L.ox+x,L.oz+z];")
rep('bunny ref',"b.position.set(bx,supportAt(bx,bz),bz);b.rotation.y=.3;G.add(b);","b.position.set(bx,supportAt(bx,bz),bz);b.rotation.y=.3;G.add(b);HOL.bunny=b;HOL.bunnyXZ=[L.ox+bx,L.oz+bz];")
rep('face the player',"  if(HOL.santa&&HOL.santa.arms&&HOL.santa.arms[1]){","  for(const [o,xz,r0] of [[HOL.santa&&HOL.santa.root,HOL.santaXZ,.06],[HOL.bunny,HOL.bunnyXZ,.3]]){if(!o||!xz||CUR!==LOC.city)continue;const d=Math.hypot(P.x-xz[0],P.z-xz[1]),want=d<7?Math.atan2(P.x-xz[0],P.z-xz[1]):r0;o.rotation.y=angLerp(o.rotation.y,want,.08);}   /* 🎅🐰 they turn to you when you come close (run 4, stage 3) */\n  if(HOL.santa&&HOL.santa.arms&&HOL.santa.arms[1]){")
rep('hol clear refs',"HOL.petals=null;HOL.santa=null;spookClear();}","HOL.petals=null;HOL.santa=null;HOL.santaXZ=null;HOL.bunny=null;HOL.bunnyXZ=null;spookClear();}")
rep('confetti more',"function confBuild(){if(CONF.m)return;const n=260,H=14,W=24,","function confBuild(){if(CONF.m)return;const n=560,H=14,W=24,")
rep('confetti bigger',"gl_PointSize=clamp(90.0/max(1.0,-mv.z),2.0,8.0)*pr;","gl_PointSize=clamp(150.0/max(1.0,-mv.z),3.0,13.0)*pr;")
rep('presents ribbons',"box(st,s,s,s,c,x,0,z,{ry:a,ol:.012});holPiece('present',x,z,0);box(st,s*1.04,s*.18,s*.18,'#ffffff',x,s*.42,z,{ry:a,ol:false});box(st,s*.18,s*.18,s*1.04,'#ffffff',x,s*.42,z,{ry:a,ol:false});",
 "box(st,s,s,s,c,x,0,z,{ry:a,ol:.012});holPiece('present',x,z,0);box(st,s*1.04,s*1.04,s*.18,'#ffffff',x,-s*.02,z,{ry:a,ol:false});box(st,s*.18,s*1.04,s*1.04,'#ffffff',x,-s*.02,z,{ry:a,ol:false});for(const k of[-1,1])sph(st,s*.13,'#ffffff',x+Math.cos(a)*k*s*.12,s*1.08,z-Math.sin(a)*k*s*.12,{ws:6,hs:5,ol:false});   /* (ribbons over the top and a bow: run 4, stage 3) */")
rep('butterfly body',"function bfGeo(c){return flockGeo(g=>{box(g,.025,.025,.11,'#3d2c5e',0,0,0,{ol:false,center:true});","function bfGeo(c){return flockGeo(g=>{sph(g,.028,'#3d2c5e',0,0,0,{s:[1,1,2.4],ws:6,hs:4,ol:false});")
rep('butterfly higher',"bf.push({geo:bfGeo(BF_COLS[(r()*BF_COLS.length)|0]),x:cx,y:.9+r()*1.0,z:cz,","bf.push({geo:bfGeo(BF_COLS[(r()*BF_COLS.length)|0]),x:cx,y:1.15+r()*1.0,z:cz,")
# ---------- tree park
rep('finish bell',"sph(st,.3,'#ffd45c',bx,d.h+1.56,d.z,{s:[1,1.15,1],ws:12,hs:9,ol:.02});cyl(st,.33,.33,.06,'#e0a800',bx,d.h+1.22,d.z,{seg:14,ol:false});sph(st,.08,'#8f6244',bx,d.h+1.18,d.z,{ws:6,hs:5,ol:false});",
 "sph(st,.17,'#ffd45c',bx,d.h+1.8,d.z,{s:[1,.8,1],ws:12,hs:8,ol:.015});cyl(st,.16,.33,.5,'#ffd45c',bx,d.h+1.3,d.z,{seg:16,ol:.02});cyl(st,.37,.37,.07,'#e0a800',bx,d.h+1.25,d.z,{seg:16,ol:.012});sph(st,.08,'#8f6244',bx,d.h+1.16,d.z,{ws:6,hs:5,ol:false});box(st,.025,.42,.025,'#e8d7b0',bx,d.h+.74,d.z,{ol:false});   /* (a real bell: a dome, a flared mouth with a rim, the clapper and a rope; run 4, stage 3) */")
rep('tree toast short',"toast(PA.e+' The '+PA.n.toLowerCase()+'! Jump from deck to deck ('+(TOUCHY?'the ⬆️ button':'⬆️ or Space')+'), cross the bridges, ride the zip line, ring the bell! 🔔',4.5);",
 "toast(PA.e+' Jump from deck to deck ('+(TOUCHY?'⬆️':'⬆️ or Space')+'), then ring the bell! 🔔',4);")
rep('gate path',"box(st,.24,.7,4.3,'#8f6244',GX,3.0,GZ,{ol:.03});flat(st,4.4,3.2,'#d9b98a',GX-2.2,.045,GZ);","box(st,.24,.7,4.3,'#8f6244',GX,3.0,GZ,{ol:.03});flat(st,4.4,3.2,'#d9b98a',GX-2.2,.045,GZ);flat(st,6,2.4,'#d9b98a',GX+3,.044,GZ);   /* (the path goes on through the gate: run 4, stage 3) */")
rep('gate tree aside',"for(const [x,z,s] of [[76.6,-41.2,1.2],[77.0,-34.6,1.15],[70.6,-33.4,1.0],[78.2,-38.2,1.3]]){tree(st,x,z,s);colC(L,x,z,.3);}","for(const [x,z,s] of [[76.6,-41.2,1.2],[77.0,-34.6,1.15],[70.6,-33.4,1.0],[80.6,-42.4,1.3]]){tree(st,x,z,s);colC(L,x,z,.3);}   /* (the big tree behind the gate stepped aside: it stood dead centre in the gateway) */")
# ---------- house
rep('rug rectangle',"else{cyl(sh,1.5,1.5,.03,['#ffd6e0','#dff3ff','#fff2c4','#e2f7e6','#ead9ff'][k%5],0,.005,0,{seg:28,ol:.01});",
 "else{{const RC=[['#ff9ec4','#ffd6e0'],['#7cc8ff','#dff3ff'],['#ffc95c','#fff2c4'],['#7fdcb5','#e2f7e6'],['#b79cff','#ead9ff']][k%5];box(sh,3.6,.025,2.5,RC[0],0,.005,0,{ol:.012});box(sh,3.0,.03,1.9,RC[1],0,.006,0,{ol:false});for(const zz of[-.55,0,.55])box(sh,2.4,.034,.12,RC[0],0,.007,zz,{ol:false});}   /* a striped rug with a border (it read as a big plate) */")
rep('stair door plate',"sph(g,.045,'#ffd45c',x0-4.2+.1,y+1.0,.42,{ws:6,hs:5,ol:false});plate(pg,up?'⬆️':'⬇️','#ffffff','#3d2c5e',.4,.4,x0-4.2+.1,y+.6,-.3,Math.PI/2);}",
 "sph(g,.045,'#ffd45c',x0-4.2+.1,y+1.0,.42,{ws:6,hs:5,ol:false});plate(pg,up?'⬆️ Up':'⬇️ Down','#ffffff','#3d2c5e',.92,.3,x0-4.2+.1,y+.72,0,Math.PI/2);}")
rep('upstairs icon',"icon:'⬆️',label:'Go upstairs'","icon:'🪜',label:'Go upstairs'")
rep('downstairs icon',"icon:'⬇️',label:'Go downstairs'","icon:'🪜',label:'Go downstairs'")
rep('paint card lane own',"<button class=\"btn white\" data-a=\"hcol:\">↩️ The lane's own colour</button></div>`,{cls:'setcard'});",
 "<button class=\"btn ${cur?'white':'mint'}\" data-a=\"hcol:\">${cur?'':'✅ '}↩️ The lane's own colour</button></div>`,{cls:'setcard hpaint'});")
rep('paint card short layout',"@media (orientation:landscape) and (max-height:500px){.setcard .dots{grid-template-columns:repeat(6,1fr);",
 "@media (orientation:landscape) and (max-height:500px){#card.hpaint{display:grid;grid-template-columns:1.15fr 1fr;column-gap:14px;align-items:center;width:min(720px,100%)}#card.hpaint>.hd,#card.hpaint>.note{grid-column:1/-1}#card.hpaint>.dots{grid-column:1;grid-row:3/span 3;grid-template-columns:repeat(3,1fr)!important}#card.hpaint>.opt,#card.hpaint>.row{grid-column:2}}   /* 🎨 the colour card in two columns on a short sideways phone (run 4, stage 3) */\n@media (orientation:landscape) and (max-height:500px){.setcard .dots{grid-template-columns:repeat(6,1fr);")
rep('lane sign bigger',"const tg=label('🏠 '+o.nm,.9);tg.position.set(lp.hx,big?opt.h+3.9:7.9,lp.hz);","const tg=label('🏠 '+o.nm,.9+.16*(fl-1));tg.position.set(lp.hx,big?opt.h+3.9+.1*(fl-1):7.9,lp.hz);   /* (a taller house has a bigger name sign) */")
# ---------- one clock
rep('cal today first',"  h+='</div>'+calHolidayLine();const n=daysToShow();\n  h+=`<p class=\"ph-sub\"><b>Today is ${wdName()}!</b>",
 "  h+='</div>'+calHolidayLine();const n=daysToShow();\n  h=h.replace('<div class=\"cal\">',()=>`<p class=\"ph-sub\"><b>Today is ${wdName()}!</b> ${isShowDay()?(showDone()?'You did the 🏆 Pet Show today. The next one is next Saturday!':S.time>=PS_OFF?'Today\\'s 🏆 Pet Show is over. The next one is next Saturday!':`🏆 It's Pet Show day! Bring your pet to the park from ${PS_ON}:00 to ${PS_OFF}:00!`):`🏆 Pet Show in ${n} day${n>1?'s':''}: on Saturday, ${PS_ON}:00 to ${PS_OFF}:00, in the park.`}</p><div class=\"cal\">`);   /* (\"Today is…\" comes first, above the week: on a short screen it was below the fold; run 4, stage 3) */\n  if(false)h+=`<p class=\"ph-sub\"><b>Today is ${wdName()}!</b>")
rep('zzc clip',".zzc{width:min(380px,calc(100vw - 32px));",".zzc{overflow:hidden;width:min(380px,calc(100vw - 32px));")
bad=[]
for name,old,new,n in R:
    c=s.count(old)
    if c!=n: bad.append((name,c)); continue
    s=s.replace(old,new)
print('applied',len(R)-len(bad),'of',len(R)); print('FAILED:',bad)
if s!=orig: open(p,'w',encoding='utf-8').write(s)
