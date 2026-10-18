# Run 4, job 14 (item 30): picture tutorials for the pizza delivery and hairstylist jobs: 5 and 4 picture steps with arrows and a pointing hand, almost no reading;
# shown the first time (as before) and from a "?" on the job card and in Rosie's job list. Exact-match edits for edit.py.
import json
E = []
PIC_JS = r"""/* 🖼️ run 4, job 14 (item 30): the job tutorials are pictures. tutPic(id) draws one step on a small canvas: big emoji, fat arrows and a pointing hand, a few words at most */
const TUTPICS=new Map();
function tutPic(id){if(TUTPICS.has(id))return TUTPICS.get(id);const W=420,H=210,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const INKC='#3d2c5e',em=(t,px,py,s)=>{x.font=`${s}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=INKC;x.fillText(t,px,py);};
  const txt=(t,px,py,s,col)=>{x.font=`800 ${s}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=col||INKC;x.fillText(t,px,py);};
  const rr=(px,py,w,h,r,fill,line)=>{x.beginPath();x.moveTo(px+r,py);x.arcTo(px+w,py,px+w,py+h,r);x.arcTo(px+w,py+h,px,py+h,r);x.arcTo(px,py+h,px,py,r);x.arcTo(px,py,px+w,py,r);x.closePath();if(fill){x.fillStyle=fill;x.fill();}if(line){x.lineWidth=4;x.strokeStyle=line;x.stroke();}};
  const arrow=(x1,y1,x2,y2,col)=>{const a=Math.atan2(y2-y1,x2-x1);x.lineCap='round';x.lineWidth=7;x.strokeStyle=col||'#ff4d8d';x.beginPath();x.moveTo(x1,y1);x.lineTo(x2-Math.cos(a)*14,y2-Math.sin(a)*14);x.stroke();
    x.fillStyle=col||'#ff4d8d';x.beginPath();x.moveTo(x2,y2);x.lineTo(x2-Math.cos(a-.5)*26,y2-Math.sin(a-.5)*26);x.lineTo(x2-Math.cos(a+.5)*26,y2-Math.sin(a+.5)*26);x.closePath();x.fill();};
  const hand=(px,py,s)=>em('👉',px,py,s||44);const up=(px,py,s)=>em('👆',px,py,s||44);
  rr(0,0,W,H,22,'#fff7fb');
  if(id==='p1'){rr(30,28,250,80,20,'#ffffff',INKC);em('📩',62,68,38);txt('Mia · Pink house',172,55,20);txt('🍕 cheese · ⏱️ 2 min',172,86,18);em('🔔',320,44,40);txt('ding!',320,84,16,'#ff4d8d');arrow(330,110,300,140);up(260,160,46);txt('Read it!',355,165,22);}
  else if(id==='p2'){rr(40,25,150,150,16,'#dff3d0',INKC);x.fillStyle='#c9bfe8';for(const k of[60,105,150])x.fillRect(40,k,150,12);for(const k of[80,130])x.fillRect(k,25,12,150);x.fillStyle='#ff3b3b';x.beginPath();x.arc(165,60,11,0,6.3);x.fill();
    x.fillStyle='#ff4fd8';x.beginPath();x.moveTo(70,150);x.lineTo(90,120);x.lineTo(110,150);x.closePath();x.fill();arrow(100,122,152,70,'#ff4fd8');hand(215,60,48);txt('The dot = the house',300,120,20);txt('The arrow = you',300,150,20);em('🗺️',330,60,40);}
  else if(id==='p3'){em('🏠',120,105,120);rr(100,120,42,62,8,'#5fd4b0',INKC);x.fillStyle='#ffd45c';x.beginPath();x.arc(132,152,4,0,6.3);x.fill();em('🍕',280,70,54);arrow(255,95,160,140);up(150,185,44);txt('Find the door, tap it',300,160,20);}
  else if(id==='p4'){em('⏱️',80,80,70);em('⚡',150,70,46);arrow(185,85,250,85);em('🪙',280,80,48);em('🪙',320,70,48);em('🪙',360,82,48);em('⭐',330,150,46);txt('Fast = more coins',150,160,22);}
  else if(id==='p5'){em('🍕',70,60,46);em('👨‍🍳',130,110,90);rr(200,40,110,60,18,'#ffffff',INKC);txt('Hi! 🍕',255,70,24);em('🛵',340,150,70);arrow(205,125,290,150);txt('Talk to Chef Blaze',120,185,20);}
  else if(id==='h1'){em('💺',130,120,100);em('🧑',130,78,60);em('🚪',300,80,70);arrow(265,110,190,118);hand(330,150,46);txt('A customer sits down',250,185,20);}
  else if(id==='h2'){rr(40,40,120,120,14,'#ffffff',INKC);em('💇',100,100,70);txt('=',200,100,46);em('🧑',300,100,80);arrow(170,60,250,60);txt('Make the hair like the picture',230,185,19);}
  else if(id==='h3'){for(const [i,e] of[[0,'✂️'],[1,'🪮'],[2,'🎨']]){x.fillStyle='#ffffff';x.beginPath();x.arc(90+i*120,80,42,0,6.3);x.fill();x.lineWidth=4;x.strokeStyle=INKC;x.stroke();em(e,90+i*120,80,46);}txt('shorter',90,138,16);txt('style',210,138,16);txt('colour',330,138,16);up(210,180,44);arrow(60,180,90,130);arrow(360,180,330,130);}
  else if(id==='h4'){em('✅',90,90,86);em('⭐',210,70,44);em('⭐',260,60,44);em('⭐',310,70,44);em('🪙',260,130,46);arrow(145,100,195,100);txt('Tap ✅ when it matches',210,185,20);}
  const url=c.toDataURL('image/png');TUTPICS.set(id,url);return url;}"""
# the pizza steps: 5 pictures
E.append(["@between", "const TUT_STEPS=[\n  {t:'Pizza job tips! 🍕',", "You can see these tips again in ⚙️ Settings. Good luck!'}];",
          "const TUT_STEPS=[   /* 🖼️ run 4, job 14: 5 picture steps, almost no reading (the old long tips live on in the pictures) */\n  {t:'Pizza delivery 🍕',x:'A message dings. Read it!',pic:'p1'},\n  {t:'Follow the dot 🗺️',el:'mmBtn',x:'The dot is the house. The arrow is you.',pic:'p2'},\n  {t:'Ring the bell 🚪',x:'Find the door and tap it.',pic:'p3'},\n  {t:'Be quick! ⚡',x:'Fast pizza = more coins.',pic:'p4'},\n  {t:\"Let's go! 🛵\",x:'Talk to Chef Blaze at the Pizzeria.',pic:'p5'}];\n" + PIC_JS])
# the hair steps: 4 pictures
E.append(["@between", "const HS_TUT=[{t:'Hairstylist tips! ✂️',", "Customers are always kind. You can see these tips again in ⚙️ Settings.'}];",
          "const HS_TUT=[   /* 🖼️ run 4, job 14: 4 picture steps */\n  {t:'Hairstylist ✂️',x:'A customer sits in your chair.',pic:'h1'},\n  {t:'The wish picture 🖼️',x:'Make the hair like the picture.',pic:'h2'},\n  {t:'Cut, comb, dye',x:'Tap the tools.',pic:'h3'},\n  {t:'Done! ⭐',x:'Tap ✅ when it matches.',pic:'h4'}];"])
# the card: a picture above the words
E.append(['<div id="tutCard" role="dialog" aria-label="Pizza job tips"><div class="tutHd"><span class="tutAv">👨‍🍳</span><b id="tutT"></b></div><p id="tutX"></p>',
          '<div id="tutCard" role="dialog" aria-label="Job tips"><div class="tutHd"><span class="tutAv">👨‍🍳</span><b id="tutT"></b></div><img id="tutPic" alt="" hidden><p id="tutX"></p>'])
E.append(["#tutX{font-size:17px;font-weight:700;line-height:1.35;margin:8px 0 6px}",
          "#tutX{font-size:17px;font-weight:700;line-height:1.35;margin:8px 0 6px}\n#tutPic{display:block;width:100%;aspect-ratio:2/1;border-radius:14px;border:3px solid #3d2c5e;margin:8px 0 2px;background:#fff7fb}#tutPic[hidden]{display:none}"])
E.append(["  $('tutT').textContent=st.t;$('tutX').innerHTML=esc(st.x)+(st.demo?",
          "  $('tutT').textContent=st.t;{const pic=$('tutPic');if(st.pic){pic.src=tutPic(st.pic);pic.hidden=false;}else pic.hidden=true;}   /* 🖼️ the step's picture (run 4, job 14) */\n  $('tutX').innerHTML=esc(st.x)+(st.demo?"])
# the "?" on the job card (Rosie's list) and on the job's hello card
E.append(["  return`<button class=\"jobc${on?' on':''}\" data-a=\"job:${k}\" ${J.soon?'disabled':''}><span class=\"ji\">${J.i}</span><b>${J.n}</b><small>${J.soon?'🔨 Coming soon!':on?'✅ Your job now':J.d}</small></button>`;}).join('')}</div>`;}",
          "  return`<button class=\"jobc${on?' on':''}\" data-a=\"job:${k}\" ${J.soon?'disabled':''}><span class=\"ji\">${J.i}</span><b>${J.n}</b><small>${J.soon?'🔨 Coming soon!':on?'✅ Your job now':J.d}</small></button>${on&&(k==='delivery'||k==='hair')?`<button class=\"btn white jobq\" data-a=\"jobtut:${k}\" aria-label=\"How does this job work?\">❓ How does it work?</button>`:''}`;}).join('')}</div>`;}\nACT.jobtut=k=>{closePanel();PH.jobs=false;setTimeout(()=>{if(k==='hair')hsTutStart();else tutStart();},60);};   /* ❓ the picture tutorial again, any time (run 4, job 14) */"])
E.append([".jobc small{font-size:13px;font-weight:600;opacity:.85;line-height:1.2}", ".jobc small{font-size:13px;font-weight:600;opacity:.85;line-height:1.2}\n.jobq{grid-column:1/-1;justify-self:center;min-height:44px;font-size:17px}"])
json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j14.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
