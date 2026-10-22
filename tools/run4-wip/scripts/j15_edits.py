# Run 4, job 15 (item 9): the Photographer job. Exact-match edits for edit.py; the job's own code is j15_block.js.
import json
E = []
BLOCK = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j15_block.js', encoding='utf-8').read().rstrip('\n')
# the job itself: in Rosie's list, her hello, the chat, the messages
E.append(["hair:{i:'✂️',n:'Hairstylist',d:'Give people the hairstyle they want!'}};",
          "hair:{i:'✂️',n:'Hairstylist',d:'Give people the hairstyle they want!'},photo:{i:'📸',n:'Photographer',d:'Take happy pictures for people!'}};   /* 📸 the 5th job (run 4, job 15) */"])
E.append([":k==='hair'?\"Hairstylist! ✂️ Yay! Go to the Hair Salon on the west road, by the Apartments. Customers sit in your chair and show you the hair they want. Cut, comb and dye it, and get stars! ⭐\"+later:'Great choice!';}",
          ":k==='hair'?\"Hairstylist! ✂️ Yay! Go to the Hair Salon on the west road, by the Apartments. Customers sit in your chair and show you the hair they want. Cut, comb and dye it, and get stars! ⭐\"+later\n    :k==='photo'?\"Photographer! 📸 Yay! People will message you when they want a photo: a family, a wedding, a birthday, their pets… Go to the place on your map, pick the background, give everyone a pose, frame them and snap! Lovely photos get stars! ⭐\"+later:'Great choice!';}"])
E.append(["dr:{n:'School · Mrs. Maple',av:'👩‍🏫',c:'#7fdcb5'}};", "dr:{n:'School · Mrs. Maple',av:'👩‍🏫',c:'#7fdcb5'},pc:{n:'Photo bookings',av:'📸',c:'#ffd45c'}};"])
E.append(["if(!m.cl)m.cl=[];if(!m.dr)m.dr=[];", "if(!m.cl)m.cl=[];if(!m.dr)m.dr=[];if(!m.pc)m.pc=[];"])
E.append(["${b.t2?`<b>${esc(b.t2)}</b><br>`:''}${esc(b.x)}<span class=\"tm\">", "${b.t2?`<b>${esc(b.t2)}</b><br>`:''}${b.img?ptImg(b.img):''}${esc(b.x)}<span class=\"tm\">"])
# the HUD box, the map's dot, the tick, the job change
E.append(["jobHud(force){const el=$('job'),job=!!(PLAYING&&S&&(S.job==='delivery'||S.job==='designer'||S.job==='teacher'||S.job==='hair')),",
          "jobHud(force){const el=$('job'),job=!!(PLAYING&&S&&(S.job==='delivery'||S.job==='designer'||S.job==='teacher'||S.job==='hair'||S.job==='photo')),"])
E.append(["  if(S.job==='hair'){const d=hs(),c=HS.cust;let h;   /* ✂️ the hairstylist (job 15) */",
          """  if(S.job==='photo'){const d=pt(),o=d.o;let h;   /* 📸 the photographer (run 4, job 15) */
    if(!o)h=d.done>=PT_MAX?`🌟 All ${PT_MAX} photos done today!`:!isDaytime()?workAt():`📸 Waiting for a booking… <small>(${d.done}/${PT_MAX})</small>`;
    else if(PHO.on)h=PHO.group.every(m=>m.pose)?`📸 Frame everyone and <b>Snap</b>!`:`📸 Tap each person for a pose <small>(${PHO.group.filter(m=>m.pose).length}/${PHO.group.length})</small>`;
    else{const Sp=ptSpotOf(o),tg=jobTarget(),m=CUR.id==='city'&&tg?' <span class="nw">· '+Math.round(Math.hypot(tg.x-P.x,tg.z-P.z))+' m</span>':'';h=`📸 → <b>${esc(Sp.n)}</b>${m} <small>${PT_KINDS[o.kind].i} ${esc(PT_KINDS[o.kind].n)} · ${d.done}/${PT_MAX}</small>`;}
    if(force||h!==jobHud.last){$('jobTxt').innerHTML=h;jobHud.last=h;}
    $('jobTxt').classList.remove('late','rare');const mh=CUR.id!=='city';if($('mmBtn').hidden!==mh)$('mmBtn').hidden=mh;return;}
  if(S.job==='hair'){const d=hs(),c=HS.cust;let h;   /* ✂️ the hairstylist (job 15) */"""])
E.append(["if(S.job==='hair')return{x:SALON.door[0],z:SALON.door[1]};return null;}",
          "if(S.job==='hair')return{x:SALON.door[0],z:SALON.door[1]};if(S.job==='photo')return ptTarget();return null;}"])
E.append(["  if(S.job==='teacher'){tcTick(dt);return;}\n  if(S.job!=='delivery')",
          "  if(S.job==='teacher'){tcTick(dt);return;}\n  if(S.job==='photo'){ptTick(dt);if(HELD&&!CUT)HELD.visible=false;return;}   /* 📸 run 4, job 15 */\n  if(S.job!=='delivery')"])
E.append(["tcClear();hsClear();if(CUR&&CUR.id==='client')exitClient();S.job=k||null;",
          "tcClear();hsClear();if(S.pt)S.pt.o=null;ptClear();if(CUR&&CUR.id==='client')exitClient();S.job=k||null;"])
# the camera's zoom, the keys
E.append(["const tf=BASEFOV+(P.run&&P.moving?7:0);", "const tf=BASEFOV*(PHO.on?PHO.zoom:1)+(P.run&&P.moving?7:0);   /* 📸 the photographer's zoom (run 4, job 15) */"])
E.append(["if(e.code==='Space'){e.preventDefault();jump();}",
          "if(e.code==='Space'){e.preventDefault();if(PHO.on)ACT.ptsnap();else jump();}if(PHO.on&&(e.code==='Equal'||e.code==='NumpadAdd'))ACT.ptzoom('+');if(PHO.on&&(e.code==='Minus'||e.code==='NumpadSubtract'))ACT.ptzoom('-');if(PHO.on&&e.code==='KeyN')ptNextBg();   /* 📸 Space snaps, + and - zoom, N the next background (run 4, job 15) */"])
# the tips card knows the third job
E.append(["card.querySelector('.tutAv').textContent=TUT.hs?'✂️':'👨‍🍳';", "card.querySelector('.tutAv').textContent=TUT.hs?'✂️':TUT.pt?'📸':'👨‍🍳';"])
E.append(["(TUT.hs?\"Let's go! ✂️\":\"Let's go! 🛵\")", "(TUT.hs?\"Let's go! ✂️\":TUT.pt?\"Let's go! 📸\":\"Let's go! 🛵\")"])
E.append(["function tutEnd(){const hsT=!!(TUT&&TUT.hs);TUT=null;$('tut').hidden=true;if(S){if(hsT)S.hsTut=1;else S.tutDone=1;change();}}",
          "function tutEnd(){const hsT=!!(TUT&&TUT.hs),ptT=!!(TUT&&TUT.pt);TUT=null;$('tut').hidden=true;if(S){if(hsT)S.hsTut=1;else if(ptT)S.ptTut=1;else S.tutDone=1;change();}}"])
E.append(["${on&&(k==='delivery'||k==='hair')?`<button class=\"btn white jobq\"", "${on&&(k==='delivery'||k==='hair'||k==='photo')?`<button class=\"btn white jobq\""])
E.append(["ACT.jobtut=k=>{closePanel();PH.jobs=false;setTimeout(()=>{if(k==='hair')hsTutStart();else tutStart();},60);};",
          "ACT.jobtut=k=>{closePanel();PH.jobs=false;setTimeout(()=>{if(k==='hair')hsTutStart();else if(k==='photo')ptTutStart();else tutStart();},60);};"])
E.append(["  else if(id==='h4'){em('✅',90,90,86);em('⭐',210,70,44);em('⭐',260,60,44);em('⭐',310,70,44);em('🪙',260,130,46);arrow(145,100,195,100);txt('Tap ✅ when it matches',210,185,20);}",
          """  else if(id==='h4'){em('✅',90,90,86);em('⭐',210,70,44);em('⭐',260,60,44);em('⭐',310,70,44);em('🪙',260,130,46);arrow(145,100,195,100);txt('Tap ✅ when it matches',210,185,20);}
  else if(id==='f1'){rr(30,28,260,80,20,'#ffffff',INKC);em('📸',62,68,38);txt('Mia · Cozy Park',180,55,20);txt('family photo · the fountain',180,86,16);em('🔔',330,44,40);arrow(330,80,300,135);up(270,165,46);}
  else if(id==='f2'){rr(40,25,150,150,16,'#dff3d0',INKC);x.fillStyle='#c9bfe8';for(const k of[60,105,150])x.fillRect(40,k,150,12);for(const k of[80,130])x.fillRect(k,25,12,150);x.fillStyle='#ff3b3b';x.beginPath();x.arc(165,60,11,0,6.3);x.fill();
    x.fillStyle='#ff4fd8';x.beginPath();x.moveTo(70,150);x.lineTo(90,120);x.lineTo(110,150);x.closePath();x.fill();arrow(100,122,152,70,'#ff4fd8');em('📸',300,70,70);txt('Walk to the dot',300,150,22);}
  else if(id==='f3'){em('🧑',90,90,70);em('🧑',170,90,70);em('🧒',250,98,60);em('👋',60,40,34);em('✌️',200,38,34);em('🦘',280,46,34);up(170,170,44);txt('Tap a person: pick a pose',300,170,18);em('🏞️',360,70,54);}
  else if(id==='f4'){rr(60,30,300,150,16,'#ffffff',INKC);em('🧑',150,110,60);em('🧑',220,110,60);em('🧒',280,118,52);txt('everyone in!',210,55,20,'#ff4d8d');em('📸',395,60,40);arrow(390,95,350,140);txt('Snap!',395,165,20);}"""])
# the HUD: the photo bar and the dashed viewfinder
E.append(['  <div id="bar" hidden></div>\n', '  <div id="bar" hidden></div>\n  <div id="ptbar" hidden></div><div id="ptvf" hidden aria-hidden="true"></div>\n'])
# the look of the bar, the flash, the photo in the card and the chat
E.append(["#tutPic{display:block;width:100%;aspect-ratio:2/1;border-radius:14px;border:3px solid #3d2c5e;margin:8px 0 2px;background:#fff7fb}#tutPic[hidden]{display:none}",
          "#tutPic{display:block;width:100%;aspect-ratio:2/1;border-radius:14px;border:3px solid #3d2c5e;margin:8px 0 2px;background:#fff7fb}#tutPic[hidden]{display:none}\n"
          "/* 📸 the photographer's bar (run 4, job 15): bottom right where the run and jump buttons sit (they hide during a shoot); two rows, every button at least 44 px */\n"
          "#ptbar{position:absolute;right:calc(env(safe-area-inset-right,0px) + 20px);bottom:calc(env(safe-area-inset-bottom,0px) + 24px);display:flex;flex-direction:column;gap:6px;width:min(300px,max(192px,calc(100vw - 450px)));pointer-events:auto;z-index:6}#ptbar[hidden]{display:none}\n"
          "#ptbar .prow{display:flex;gap:6px}#ptbar .btn{min-height:46px;font-size:17px;padding:6px 8px;border-radius:14px;box-shadow:0 4px 0 #3d2c5e}#ptbar .btn.sq{width:46px;flex:0 0 46px;padding:6px 0;font-size:22px}#ptbar .btn.bg{flex:1 1 0;min-width:0;justify-content:flex-start}#ptbar .btn.bg span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}#ptbar .btn.snap{flex:1 1 0;min-width:0}\n"
          "body.shoot #moveBtns{visibility:hidden}#ptvf{position:absolute;left:6%;right:6%;top:8%;bottom:8%;border:3px dashed rgba(255,255,255,.8);border-radius:18px;pointer-events:none;box-shadow:0 0 0 2px rgba(61,44,94,.25)}#ptvf[hidden]{display:none}\n"
          ".ptrow{display:flex;align-items:center;gap:8px;margin:6px 0}.ptrow b{flex:0 0 78px;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ptp{display:flex;flex-wrap:wrap;gap:6px}.ptp .btn{min-height:44px;font-size:22px;padding:4px 0;width:46px}\n"
          ".ptflash{position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:40}.ptflash.on{animation:ptflash .5s ease-out}@keyframes ptflash{0%{opacity:.95}100%{opacity:0}}\n"
          ".ptpic,.mimg{display:block;max-width:min(320px,100%);max-height:40vh;border-radius:14px;border:3px solid #3d2c5e;margin:8px auto;background:#e8e2f0}.mimg{margin:6px 0}.mimg.none{display:flex;align-items:center;justify-content:center;font-size:40px;width:120px;height:80px}"])
# the job's own code, before the holiday block of job 11 (every helper it uses is a function or a const declared before the game starts)
E.append(["/* ===== 🎅💗🐰 run 4, job 11: the other holidays at the Flower Corner", BLOCK + "\nfunction ptImg(id){const p=(S&&S.ptPics||[]).find(q=>q.id===id);return p&&p.u?`<img class=\"mimg\" src=\"${p.u}\" alt=\"The photo\">`:'<span class=\"mimg none\">📷</span>';}\n/* ===== 🎅💗🐰 run 4, job 11: the other holidays at the Flower Corner"])
json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j15.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
