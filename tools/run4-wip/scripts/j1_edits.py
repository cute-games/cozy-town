# Run 4, job 1: the one clock for everyone. Builds the exact-match edit list for edit.py.
import json
E = []

# --- the clock itself, next to hourLen ---
E.append(["const hourLen=h=>h>=7&&h<21?600/14:300/10;let HOUR=hourLen(12);",
r"""const hourLen=h=>h>=7&&h<21?600/14:300/10;let HOUR=hourLen(12);
/* 🕰️ one clock for everyone (run 4, job 1; the owner's decision 17 Oct): game time is ONE formula of the real time, the same on every device: the
   device clock, corrected by the web server's Date header when the update check fetches index.html (clockServer; nothing in the Claude version).
   A game day is 15 real minutes at the old speed: 7:00-21:00 take 600 s (hourLen), 21:00-7:00 take 300 s. Days count from 1 Jan 2026 (UTC); the
   day number is only used for the weekday, the weather blocks, the bus week and the quest draw: it is never shown anywhere (only "9:40 Wed").
   The clock never pauses. An old save jumps once to the shared day when it loads (clockLoad). The tests replace realMs() in a test copy, like realDate() */
const CLK={off:0,EP:Date.UTC(2026,0,1),DAY:900000};
function realMs(){return Date.now()+CLK.off;}
function clockAt(ms){const k=Math.floor((ms-CLK.EP)/CLK.DAY),r=(ms-CLK.EP-k*CLK.DAY)/1000;return{day:k+1,time:r<210?r/30:r<810?7+(r-210)*14/600:21+(r-810)/30};}
function msAt(day,time){const r=time<7?time*30:time<21?210+(time-7)*600/14:810+(time-21)*30;return CLK.EP+(day-1)*CLK.DAY+r*1000;}
const clockNow=()=>clockAt(realMs());
function clockSync(){if(!S)return false;const c=clockNow();HOUR=hourLen(c.time);if(c.day===S.day){S.time=c.time;return false;}const d0=S.day;S.day=c.day;S.time=c.time;dayJump(d0);return true;}   /* true = a new day began */
function dayJump(d0){if(!S.garden)return;for(const st of S.garden)if(st&&st.seed&&st.g<1&&st.w>0&&st.w<S.day)st.g=1;}   /* 🌱 a plant watered on a day that has passed finished growing */
function clockLoad(){for(const k in BUS_DAY)delete BUS_DAY[k];if(!S.intro){const c=clockNow();S.day=c.day;S.time=c.time;busWelcome();}else clockSync();}   /* a new player starts at the real time; an old save jumps once to the shared day */
function clockServer(h){try{const d=Date.parse(h.get('date')||''),age=+h.get('age')||0;if(!isFinite(d)||age>10)return;const o=d+500-Date.now();if(Math.abs(o)<400*864e5&&Math.abs(o-CLK.off)>1500)CLK.off=o;}catch(e){}}   /* the server's clock: the Date header of a fresh response (1 s steps, so +500 ms) */"""])

# --- the frame loop: time from the clock, no integration ---
E.append(["    if(!UI.open||true){HOUR=hourLen(S.time);S.time+=dt/HOUR;if(S.time>=24){S.time-=24;S.day++;newDay();change();}\n      S.hunger=",
          "    {if(clockSync()){newDay();change();}   /* 🕰️ the one clock (run 4, job 1): the time and the day come from the real time, the same for everyone */\n      S.hunger="])

# --- load: the one jump ---
E.append(["  S.look=Object.assign({},DEFAULT_LOOK,S.look||{});buildPlayerBody();\n  applyHouse();",
          "  S.look=Object.assign({},DEFAULT_LOOK,S.look||{});buildPlayerBody();\n  clockLoad();   /* 🕰️ the one clock: an old save jumps once to the shared day; a new player starts at the real time (run 4, job 1) */\n  applyHouse();"])

# --- nobody takes a friend's clock any more ---
E.append(["@between", "/* 🕰️ one clock for everyone: my clock rides along in presence as ck:[day,hour], refreshed only after 5 game minutes",
          "busClock(d0,t0,ahead>=1);});}   /* (🚌 the bus and the beach follow the new time: busClock) */",
          "/* 🕰️ run 4, job 1: there is one clock for everyone (clockNow), so nobody takes a friend's clock any more and presence carries no ck */"])
E.append(["a.zz=pr.zz===1?1:0;a.aw=pr.aw===1?1:0;a.st=pr.st===1?1:0;zzRung(a,pr.rg);clockFrom(a,pr.ck);mpExtra(a,pr,fresh);}",
          "a.zz=pr.zz===1?1:0;a.aw=pr.aw===1?1:0;a.st=pr.st===1?1:0;mpExtra(a,pr,fresh);}"])
E.append(["mv:P.moving?1:0,ck:mpClock()};", "mv:P.moving?1:0};"])
E.append(["st.st=P.sit&&!P.sit.bed&&!P.sit.bus?1:null;   /* 🪑 sitting on a bench or a chair */st.rg=ZZ.rg&&Date.now()-ZZ.rgT<12000?ZZ.rg:null;   /* 😴 in bed / 🔔 a ring (optional; null clears them: presence merges) */",
          "st.st=P.sit&&!P.sit.bed&&!P.sit.bus?1:null;   /* 🪑 sitting on a bench or a chair; 😴 zz: in bed (optional; null clears them: presence merges) */"])
E.append(["if(DAYQ&&(fading||MP.ckTo||$('toast').classList.contains('show')))return;const q=DAYQ;DAYQ=null;   /* closing time waits for a fade, a clock jump or a message on screen */",
          "if(DAYQ&&(fading||$('toast').classList.contains('show')))return;const q=DAYQ;DAYQ=null;   /* closing time waits for a fade or a message on screen */"])
E.append(["@between", "/* 🕰️ a friend's clock moved mine ahead (d0,t0 = my clock before; big = a jump of an hour or more).",
          "if(CUR.id!=='beach')return;const n=busNext('beach','town',d0,t0);if(n&&(n.d<S.day||n.d===S.day&&n.s.l<=S.time))busStranded('jump');}",
          "/* (run 4: the clock-jump handler busClock is gone with the friends' clocks: there is one clock) */"])

# --- sleeping: no night skip, a soft sleep screen until 7:00 ---
E.append(["@between", "/* ---- sleeping ---- */", "  toast('Friends want to skip the night, waiting on you!',4);}",
r"""/* ---- sleeping ---- */
/* 😴 beds work from 21:00 to 7:00. You lie down and a soft sleep screen shows 💤 and the time while you wait for 7:00 on the one clock (run 4, job 1:
   no night skip; the clock never pauses, so the morning comes at the same moment for everyone). "Wake up" gets you up earlier. Presence: zz:1 while in bed */
const ZZ={t:0};
const zzIn=()=>!!(P.sit&&P.sit.bed);
function sleep(rec,fx,fz){
  if(S.time>=7&&S.time<21){toast('Not sleepy yet, beds work from 21:00 🌙',3);return;}
  const g=rec.g.position,f=FURN[rec.it.t].d/2+.35;P.sit={x:g.x-fx*.55,z:g.z-fz*.55,yaw:rec.it.r*Math.PI/2+Math.PI,h:.92,bed:1,bk:[P.x,P.z,P.yaw]};   /* head on the pillow */
  P.x=P.sit.x;P.z=P.sit.z;P.yaw=P.sit.yaw;P.pitch=-.12;ZZ.t=0;SFX.pop();floatText('💤',g.x+fx*(f+.6),.72,g.z+fz*(f+.6),{h:.4});toast('💤 Good night!',2);}   /* the 💤 floats up in the middle of the view (not onto the clock) */
function zzTick(dt){const dh=CUR.id!=='home'||zzIn();if($('bDeco').hidden!==dh)$('bDeco').hidden=dh;   /* 🛋️ no decorating from bed */
  if(zzIn()&&S.time>=7&&S.time<21){zzMorning();return;}   /* 7:00 came on the one clock */
  zzScreen(zzIn());}
function zzMorning(){standUp();S.hunger=Math.max(S.hunger,40);toast('Good morning! It\'s '+wdName()+' ☀️',4);doneTask('sleep');change();}
/* the sleep screen: a soft night over the game, 💤 drifting up, the time and the weekday, and a Wake up button (at least 44 px) */
function zzScreen(on){let el=$('zzScr');
  if(!on){if(el&&!el.hidden){el.hidden=true;document.body.classList.remove('zz');}return;}
  if(!el){el=document.createElement('div');el.id='zzScr';el.hidden=true;$('hud').appendChild(el);
    el.innerHTML='<div class="zzc"><div class="zzz" aria-hidden="true"><span>💤</span><span>💤</span><span>💤</span></div><div class="zt"></div><div class="zs">Sleeping until 7:00 🌙</div><div class="zb"><button class="btn butter" id="zzUp">🌅 Wake up</button></div></div>';
    $('zzUp').onclick=()=>{audioInit();SFX.tap();standUp();};}
  const t=clockStr(S.time)+' · '+wdName().slice(0,3),z=el.querySelector('.zt');if(z.textContent!==t)z.textContent=t;
  if(el.hidden){el.hidden=false;document.body.classList.add('zz');}}"""])
E.append(["@between", "/* 😴 sleeping together: the bed card at the bottom, and the phone wiggles when friends ring */",
          "body.zz #joy,body.zz #moveBtns,body.zz #actWrap{visibility:hidden}#bPhone.ring{animation:noteWiggle .4s ease-in-out 6}",
          "/* 😴 the sleep screen (run 4, job 1): in bed you wait for 7:00 on the one clock under a soft night; Wake up gets you up earlier */#zzScr{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;background:radial-gradient(ellipse at 50% 35%,rgba(70,60,140,.55),rgba(16,12,44,.9));pointer-events:auto;animation:zzIn .8s ease-out both}#zzScr[hidden]{display:none}#zzScr .zzc{width:min(380px,calc(100vw - 32px));background:var(--paper);color:var(--ink);border:3px solid var(--line);border-radius:26px;box-shadow:0 6px 0 var(--soft);padding:14px 16px 18px;text-align:center}#zzScr .zzz{height:64px;font-size:40px;line-height:1;position:relative}#zzScr .zzz span{position:absolute;left:50%;bottom:0;transform:translateX(-50%);animation:zzFloat 3.6s ease-in-out infinite;opacity:0}#zzScr .zzz span:nth-child(2){animation-delay:1.2s;font-size:30px;left:60%}#zzScr .zzz span:nth-child(3){animation-delay:2.4s;font-size:22px;left:40%}@keyframes zzFloat{0%{transform:translate(-50%,10px) scale(.7);opacity:0}25%{opacity:1}100%{transform:translate(-50%,-56px) scale(1.15);opacity:0}}@keyframes zzIn{from{opacity:0}to{opacity:1}}#zzScr .zt{font-size:34px;font-weight:900;line-height:1.1}#zzScr .zs{font-size:17px;font-weight:700;line-height:1.25;margin:4px 0 12px;opacity:.85}#zzScr .zb{display:flex;gap:10px;justify-content:center}#zzScr .btn{font-size:19px;min-height:48px;padding:10px 18px}@media (prefers-reduced-motion:reduce){#zzScr,#zzScr .zzz span{animation:none}#zzScr .zzz span{opacity:1}}body.zz #joy,body.zz #moveBtns,body.zz #actWrap,body.zz #left,body.zz #topbtns,body.zz #bChat{visibility:hidden}"])
E.append(["for(const id of['knockCard','zzCard','tutCard','dtCard','tchBar'])", "for(const id of['knockCard','tutCard','dtCard','tchBar'])"])
E.append(["function awTick(dt){if(IN.joy.id!==null||CUT)AW.t=0;AW.t+=dt;   /* holding the joystick is playing too; a scene (the Pet Show, a client's visit) is watching, not being away (night 3) */",
          "function awTick(dt){if(IN.joy.id!==null||CUT||zzIn())AW.t=0;AW.t+=dt;   /* holding the joystick is playing too; a scene (the Pet Show, a client's visit) is watching, not being away (night 3); in bed you are waiting for the morning (run 4) */"])

# --- no day numbers anywhere: only the weekday and the time ---
E.append(["function dayLabel(){return(psLeft()?'🏆 ':'')+wdName().slice(0,3)+' · Day '+S.day;}",
          "function dayLabel(){return(psLeft()?'🏆 ':'')+wdName().slice(0,3);}   /* 🕰️ only the weekday: the day number is never shown (run 4) */"])
E.append(["const phDate=()=>`${wdName()} · Day ${S.day}${psLeft()?' · 🏆 Pet Show today!':''}`;",
          "const phDate=()=>`${wdName()}${psLeft()?' · 🏆 Pet Show today!':''}`;"])
E.append(["/* 🕐 an open phone keeps its clock right (after a clock jump to a friend's time, too): refreshed with the HUD clock */",
          "/* 🕐 an open phone keeps its clock right: refreshed with the HUD clock */"])
E.append(["set(ph.querySelector('.ph-status span'),c);set(ph.querySelector('.ph-clock'),c);set(ph.querySelector('.ph-date'),phDate());}",
          "set(ph.querySelector('.ph-status span'),c);set(ph.querySelector('.ph-clock'),c);set(ph.querySelector('.calic i'),c);set(ph.querySelector('.ph-date'),phDate());}"])
E.append(["""<i${S.day>999?' style="font-size:22px"':''}>${S.day}</i>""", """<i class="tm">${clockStr(S.time)}</i>"""])
E.append([".calic i{display:block;font-style:normal;font-size:34px;line-height:46px;font-weight:800;color:#3d2c5e}",
          ".calic i{display:block;font-style:normal;font-size:34px;line-height:46px;font-weight:800;color:#3d2c5e}.calic i.tm{font-size:19px;letter-spacing:0}"])
E.append([".calic i{font-size:24px;line-height:33px}", ".calic i{font-size:24px;line-height:33px}.calic i.tm{font-size:15px}"])
E.append(["""function calBody(){const i0=wdIdx(),start=S.day-i0;let h='<div class="cal">';
  for(let i=0;i<7;i++){h+=`<div class="cd${i===i0?' today':''}${i===5?' show':''}"><b>${WDAYS[i].slice(0,3)}</b><span>${start+i}</span><i>${i===5?'🏆':i===i0?'⭐':''}</i></div>`;}""",
          """function calBody(){const i0=wdIdx();let h='<div class="cal">';   /* 🕰️ the week: weekday names only, no day numbers (run 4) */
  for(let i=0;i<7;i++){h+=`<div class="cd${i===i0?' today':''}${i===5?' show':''}"><b>${WDAYS[i].slice(0,3)}</b><span>${i===i0?(nightF(S.time)>.5?'🌙':'☀️'):i<i0?'✔':'·'}</span><i>${i===5?'🏆':i===i0?'⭐':''}</i></div>`;}"""])
E.append(["""<span class="tm">Day ${b.d} · ${clockStr(b.h)}</span>""", """<span class="tm">${wdName(b.d).slice(0,3)} · ${clockStr(b.h)}</span>"""])
E.append([" · 📅 Day ${Math.max(1,h.day|0)}", ""])
E.append([" · 📅 Day ${Math.max(1,o.day|0)}", ""])
E.append(['<span class="day" id="dayN">Day 1</span>', '<span class="day" id="dayN">Mon</span>'])
E.append(["Day 1 (a brand-new player's first day) has a free", "A brand-new player's first day has a free"])

# --- the Welcome Bus on a new player's first day on the one clock ---
E.append(["  if(w===0){delete o[1];o[0]=8;}   /* the very first week starts with the Welcome Bus on day 1 */\n  return BUS_WK[w]=o;}", "  return BUS_WK[w]=o;}"])
E.append(["""function busSess(d){let o=BUS_DAY[d];if(o)return o;o=[];const a=busArr(d),W=BUS_W;
  if(a!==undefined){if(d===1)o.push({p:'park',a:8,l:12,go:'beach',wb:1},{p:'beach',a:8,l:12,go:'town',wb:1});
    else o.push({p:'park',a,l:a+W,go:'beach'},{p:'beach',a:a+W,l:a+2*W,go:'town'},{p:'park',a:a+2*W,l:a+2*W+BUS_D,go:null});
    o.push({p:'beach',a:BUS_EV,l:21,go:'town'},{p:'park',a:21,l:21+BUS_D,go:null});}
  return BUS_DAY[d]=o;}""",
"""/* 🎉 the Welcome Bus (free, both ways) comes on a new player's first day on the one clock: from the next 10 minutes after Rosie's welcome, for 4 game hours
   (from 8:00 if it is early; the next morning 8:00-12:00 if it is 17:00 or later). Saved as wb:[day, comes, leaves] (run 4, job 1) */
const busWB=d=>!!(S&&S.wb&&S.wb[0]===d);
function busWelcome(){const h=S.time,a=h<8?8:Math.ceil(h*6)/6;S.wb=h>=17?[S.day+1,8,12]:[S.day,a,Math.min(20.5,a+4)];for(const k in BUS_DAY)delete BUS_DAY[k];}
function busSess(d){let o=BUS_DAY[d];if(o)return o;o=[];const a=busArr(d),W=BUS_W,wb=busWB(d);
  if(wb)o.push({p:'park',a:S.wb[1],l:S.wb[2],go:'beach',wb:1},{p:'beach',a:S.wb[1],l:S.wb[2],go:'town',wb:1});
  else if(a!==undefined)o.push({p:'park',a,l:a+W,go:'beach'},{p:'beach',a:a+W,l:a+2*W,go:'town'},{p:'park',a:a+2*W,l:a+2*W+BUS_D,go:null});
  if(wb||a!==undefined)o.push({p:'beach',a:BUS_EV,l:21,go:'town'},{p:'park',a:21,l:21+BUS_D,go:null});
  return BUS_DAY[d]=o;}"""])
E.append(["if(busArr(d)!==undefined)out.push(d);", "if(busArr(d)!==undefined||busWB(d))out.push(d);"])
E.append(["const L=(today?'⭐ ':'')+wdName(d),R=B.bch?(d===1?'🎉 until 12:00':busHM(busArr(d)+2*BUS_W))+' · 21:00':d===1?'🎉 8:00–12:00':busHM(busArr(d));",
          "const L=(today?'⭐ ':'')+wdName(d),R=B.bch?(busWB(d)?'🎉 until '+busHM(S.wb[2]):busHM(busArr(d)+2*BUS_W))+' · 21:00':busWB(d)?'🎉 '+busHM(S.wb[1])+'–'+busHM(S.wb[2]):busHM(busArr(d));"])
E.append(["const row=d=>{const a=busArr(d),today=d===S.day,wb=d===1;let gone=d<S.day||(today&&S.time>=(wb?12:a+BUS_W)),tm=wb?'🎉 8:00–12:00 (free!)':'🚌 '+busHM(a);",
          "const row=d=>{const a=busArr(d),today=d===S.day,wb=busWB(d);let gone=d<S.day||(today&&S.time>=(wb?S.wb[2]:a+BUS_W)),tm=wb?'🎉 '+busHM(S.wb[1])+'–'+busHM(S.wb[2])+' (free!)':'🚌 '+busHM(a);"])
E.append(["toast(S.day===1&&t<11.5?'🎉 Good news! A free Welcome Bus waits at the park until 12:00. Hop on and visit the beach! 🏖️':",
          "toast(busWB(S.day)&&t<S.wb[2]-.5?'🎉 Good news! A free Welcome Bus waits at the park until '+busHM(S.wb[2])+'. Hop on and visit the beach! 🏖️':"])

# --- the sky: grey in rain, snow and clouds; the title shows the real time of day ---
E.append(["  const h=S?S.time:10;let i=0;while(i<KF.length-2&&KF[i+1][0]<=h)i++;",
          "  const h=S?S.time:clockNow().time;let i=0;while(i<KF.length-2&&KF[i+1][0]<=h)i++;   /* 🕰️ the title shows the real time of day too (run 4) */"])
E.append(["    const gy=WX.grey;if(gy>0){skyU.top.value.lerp(_c2.set('#8a97ad'),gy*.7);skyU.bot.value.lerp(_c2.set('#c5ccd6'),gy*.6);FOG.color.copy(skyU.bot.value);FOG.near*=1-.35*gy;FOG.far*=1-.3*gy;}}   /* 🎃 Halloween nights: a purple sky and closer fog; 🌧️ grey weather (job 11) */",
          "    const gk=WX.sky;if(gk>0){const G=WX_SKY[WX.kind]||WX_SKY.cloudy;skyU.top.value.lerp(_c2.set(G[0]).lerp(_c1.set('#161a2c'),nf),gk);skyU.bot.value.lerp(_c2.set(G[1]).lerp(_c1.set('#2a2f45'),nf),gk);FOG.color.copy(skyU.bot.value);FOG.near*=1-.35*gk;FOG.far*=1-.3*gk;}}   /* 🎃 Halloween nights: a purple sky and closer fog; 🌧️ grey weather: a proper grey sky, never blue under rain (run 4, item 2) */"])
E.append(["sunSprite.visible=day&&h>6.2&&h<18.3;", "sunSprite.visible=day&&h>6.2&&h<18.3&&WX.sky<.5;"])
E.append(["const WX={force:null,cur:'sunny',grey:0,rain:0,snow:0,cover:0,t:0,snd:null,sndG:null};",
          "const WX={force:null,cur:'sunny',grey:0,rain:0,snow:0,cover:0,t:0,snd:null,sndG:null,sky:0,kind:'cloudy'};\n/* 🌫️ the sky in bad weather (top, bottom), by day; at night it goes towards a dark grey. Rain and snow only fall once the sky is grey (item 2: the owner saw rain under a blue sky: the old\n   sky only went 60% grey, and the rain lines started in the first minutes of the change while the sky was still blue) */\nconst WX_SKY={cloudy:['#9ba7b5','#d3dae2'],rain:['#6e7a8b','#a9b2be'],snow:['#aab4c1','#e4e9ef']};"])
E.append(["  WX.cur=w.k<.5?w.a:w.b;WX.rain=rain;WX.snow=snow;WX.grey=Math.max(cloud*.55,rain*.9,snow*.7);WX.t+=dt;",
          "  WX.cur=w.k<.5?w.a:w.b;WX.rain=rain;WX.snow=snow;WX.grey=Math.max(cloud*.55,rain*.9,snow*.7);WX.t+=dt;\n  {const bad=clamp((cloud+rain+snow)/.4,0,1);WX.sky=bad*bad*(3-2*bad);WX.kind=snow>=rain&&snow>=cloud?'snow':rain>=cloud?'rain':'cloudy';}   /* the sky is fully grey in the first part of a change (run 4, item 2) */"])
E.append(["  RAINM.visible=out&&rain>.02;RAINM.material.uniforms.op.value=rain;SNOWM.visible=out&&snow>.02;SNOWM.material.uniforms.op.value=snow;LEAFM.visible=leaf>.02;LEAFM.material.uniforms.op.value=leaf;\n  const sv=out&&rain>.02&&PLAYING?rain:0;",
          "  const rv=clamp((rain-.3)/.7,0,1),snv=clamp((snow-.3)/.7,0,1);   /* rain and snow only once the sky is grey (run 4, item 2) */\n  RAINM.visible=out&&rv>.02;RAINM.material.uniforms.op.value=rv;SNOWM.visible=out&&snv>.02;SNOWM.material.uniforms.op.value=snv;LEAFM.visible=leaf>.02;LEAFM.material.uniforms.op.value=leaf;\n  const sv=out&&rv>.02&&PLAYING?rv:0;"])

# --- the update check's fetch tells the server's time ---
E.append(["  try{const r=await fetch(url,{cache:mode,signal:ac?ac.signal:undefined});return r.ok?await r.text():null;}catch(e){return null;}finally{clearTimeout(tm);}}",
          "  try{const r=await fetch(url,{cache:mode,signal:ac?ac.signal:undefined});if(r.ok)clockServer(r.headers);return r.ok?await r.text():null;}catch(e){return null;}finally{clearTimeout(tm);}}   /* (the response's Date header corrects the one clock: clockServer) */"])

json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j1.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
