'use strict';
/* ================= main loop ================= */
/* ================= 🎃🎄🐣 Holidays from the real calendar (night 3, job 1) =================
   The real date is read in ONE small function (realDate), so a test copy can fake it by replacing that function. There is no date setting
   and no address switch in the game. Decorations come and go when the game loads and when the real date changes while playing. */
/* realDate() and nyeParty() are in models, just above PARTY: the party hats read them while the game loads */
/* Western Easter Sunday of a year (the calendar rule) */
function easterOf(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,da);}
/* 🗓️ run 4, job 11 (the owner's design 17 Oct): every holiday fills its whole month. 'halloween' all of October · 'valentine' all of February · 'easter' the month of Easter Sunday · 'xmas' 1 to 31 December · null in other months.
   New Year and the school party are days, not months: nyeFireworks (the nights of 28 to 31 Dec), nyeParty (31 Dec and 1 Jan: party hats and confetti), schoolParty (1 Sep) */
function holidayOf(d){const y=d.getFullYear(),m=d.getMonth()+1;
  if(m===10)return'halloween';if(m===12)return'xmas';if(m===2)return'valentine';
  if(m===easterOf(y).getMonth()+1)return'easter';return null;}
function nyeFireworks(d){return d.getMonth()===11&&d.getDate()>=28;}
function schoolParty(d){return d.getMonth()===8&&d.getDate()===1;}
/* 🌼 a season of the real calendar (job 11 uses it for the trees and the weather): spring March to May, summer June to August, autumn September to November, winter December to February */
function seasonOf(d){const m=d.getMonth()+1;return m<=2||m===12?'winter':m<=5?'spring':m<=8?'summer':'autumn';}
const HOL={cur:undefined,key:undefined,g:null,n:0,t:0,anim:[],cols:[],pieces:[],ghosts:[],eggs:null,eggG:null,eggN:0,petals:null,santa:null};
/* 🧱 run 4 (item 13): every holiday piece sits on the ground (or a flower bed / mound it stands on) or hangs on posts or a wall. RAISED = the raised beds and mounds in town;
   supportAt(x,z) = the height a piece standing there sits on; holPiece() writes down each piece's bottom and support for the check (gap under 2 cm), hanging pieces their ends */
const RAISED=[];
function supportAt(x,z){let h=0;for(const r of RAISED){if(r.R!==undefined){const d=Math.hypot(x-r.x,z-r.z);if(d<r.R)h=Math.max(h,r.h*Math.sqrt(1-(d/r.R)*(d/r.R)));}else if(Math.abs(x-r.x)<=r.w/2&&Math.abs(z-r.z)<=r.d/2)h=Math.max(h,r.h);}return h;}
function holPiece(k,x,z,bottom,hang){HOL.pieces.push(hang?{k,x,z,hang}:{k,x,z,b:bottom,s:supportAt(x,z)});}
function holCheck(){if(!LOC.city)return;const d=realDate(),h=holidayOf(d),key=h?h+':'+d.getFullYear():null;if(key===HOL.key)return;holClear();HOL.key=key;HOL.cur=h;if(h){try{holBuild(h);}catch(e){console.error(e);}}fcGate(!!h);}   /* the year is part of the key: a new year's Easter deals new egg spots (run 4, job 11) */   /* 🚪 the Flower Corner's gate opens in a holiday month (run 4, job 4) */
function holTick(dt){HOL.t+=dt;if(HOL.t<2)return;HOL.t=0;holCheck();extraCheck();}   /* 🎉 extraCheck: New Year and the school party (run 4, job 11) */
function holClear(){const L=LOC.city;if(HOL.g){L.g.remove(HOL.g);HOL.g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material.userData.hol)o.material.dispose();});HOL.g=null;}
  for(const c of HOL.cols){const i=L.cols.indexOf(c);if(i>=0)L.cols.splice(i,1);}HOL.cols=[];L.inter=L.inter.filter(t=>!t.hol);HOL.n=0;HOL.anim=[];HOL.pieces=[];HOL.ghosts=[];HOL.bulbs=null;HOL.eggs=null;HOL.eggG=null;HOL.eggN=0;HOL.petals=null;HOL.santa=null;HOL.santaXZ=null;HOL.bunny=null;HOL.bunnyXZ=null;spookClear();}
/* ===== 🎉 run 4, job 17 (item 32): house parties and the dance game. At your mailbox: 📬 Check mail or 🎉 Host a party (pick a time on the one clock). Everyone playing hears about
   it (a note and a card with the host's name: ✅ I'll come / 🙅 Not this time); a yes gets the way to the host's house when the party starts. During a party the host's door opens by
   itself for knocks. A 🪩 disco floor and a disco ball in the house make it a dance party: the floor flashes and the ball spins; "Dance!" on the floor asks another player there to a
   dance-off (others watch and can take the next round): arrows fall down the screen, you press the matching arrow at the right moment (arrow keys, or four big buttons), each hit
   makes your dancer do a move, the two dancers dance side by side on the floor, and a score bar with both faces slides smoothly between you. Shared only through optional presence
   fields (py: my party, pa: my answer, dn: my dance round): old versions ignore them. HPT = the parties' state, DANCE = the dance game's (the update guard of job 2 knows DANCE.on) ===== */
const HP_LEN=20*60000;   /* a party lasts 20 real minutes from its start */
{const st=document.createElement('style');st.textContent=`#dnHud{position:fixed;inset:0;z-index:7;pointer-events:none;font-family:var(--font);color:#3d2c5e}#dnHud[hidden]{display:none}
#dnTop{position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 68px);transform:translateX(-50%);width:min(440px,94vw);display:flex;align-items:center;gap:8px;background:#fff;border:3px solid #3d2c5e;border-radius:22px;box-shadow:0 5px 0 #3d2c5e;padding:6px 10px}
.dnFace{display:flex;flex-direction:column;align-items:center;min-width:64px;font-size:15px;font-weight:900;line-height:1.1}.dnFace.me b{background:#5fd4b0;color:#fff;border-radius:999px;padding:1px 9px}.dnFace .em{font-size:28px;line-height:1}.dnFace i{font-style:normal;font-size:17px}
#dnBar{flex:1;height:22px;border:3px solid #3d2c5e;border-radius:999px;background:#ffd6e0;position:relative;overflow:hidden}#dnFill{position:absolute;left:0;top:0;bottom:0;background:#5fd4b0;width:50%}#dnMid{position:absolute;left:50%;top:0;bottom:0;width:3px;background:#3d2c5e;transform:translateX(-50%)}
#dnLane{position:absolute;left:50%;top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 104px);transform:translateX(-50%);width:min(336px,80vw);height:min(44vh,330px);background:rgba(255,250,253,.92);border:3px solid #3d2c5e;border-radius:20px;overflow:hidden}
#card.hpcard .note{font-size:17px}#card.hpcard .hpbtns{justify-content:center;gap:12px}#card.hpcard .hpbtns .btn{min-height:60px;font-size:19px;padding:10px 20px;flex:1 1 200px;max-width:280px}   /* (run 4, stage 3: bigger words and buttons for a child; the buttons in the middle) */
.dnCol{position:absolute;top:0;bottom:0;width:25%;border-right:2px dashed rgba(61,44,94,.18)}.dnCol:last-child{border:0}#dnLine{position:absolute;left:0;right:0;bottom:48px;height:4px;background:#ff4d8d}.dnHit{position:absolute;bottom:28px;width:25%;display:flex;justify-content:center;opacity:.4}.dnHit svg,.dnArr svg{display:block}
.dnArr{position:absolute;width:25%;height:52px;display:flex;justify-content:center;margin-top:-26px;transition:none}.dnArr.hit{opacity:0;transform:scale(1.8);transition:opacity .35s,transform .35s}.dnArr.miss{opacity:.3;filter:grayscale(1)}
#dnMsg{position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 162px);transform:translateX(-50%);font-size:44px;font-weight:900;color:#ffd45c;white-space:nowrap;text-shadow:-2px -2px 0 #3d2c5e,2px -2px 0 #3d2c5e,-2px 2px 0 #3d2c5e,2px 2px 0 #3d2c5e,0 5px 0 #3d2c5e;pointer-events:none}
#dnHud.dnCount #dnMsg[data-cue]{left:34%;right:auto;top:40%;bottom:auto;transform:translate(-50%,-50%);min-width:1.3em;padding:0 .22em;text-align:center;font-size:clamp(38px,7vw,72px);line-height:1.15;color:#ffe192}
#dnHud.dnCount #dnMsg[data-cue="1"],#dnHud.dnCount #dnMsg[data-cue="3"]{animation:dnCue .22s cubic-bezier(.2,.8,.35,1) both}
#dnHud.dnCount #dnMsg[data-cue="2"],#dnHud.dnCount #dnMsg[data-cue="GO!"]{animation:dnCueNext .22s cubic-bezier(.2,.8,.35,1) both}
@keyframes dnCue{from{transform:translate(-50%,-50%) scale(.64);opacity:.57}65%{transform:translate(-50%,-50%) scale(1.13)}to{transform:translate(-50%,-50%) scale(1);opacity:1}}
@keyframes dnCueNext{from{transform:translate(-50%,-50%) scale(.64);opacity:.57}65%{transform:translate(-50%,-50%) scale(1.13)}to{transform:translate(-50%,-50%) scale(1);opacity:1}}
@media (orientation:landscape) and (max-height:500px){#dnHud.dnCount #dnMsg[data-cue]{top:27%;font-size:46px}}
@media (prefers-reduced-motion:reduce){#dnHud.dnCount #dnMsg[data-cue]{animation:none}}

#dnBtns{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);transform:translateX(-50%);display:flex;gap:8px;pointer-events:none}#dnBtns .btn{width:66px;height:66px;min-height:66px;padding:0;display:flex;align-items:center;justify-content:center}#dnBtns .btn[data-a="dnp:0"]{background:#ffe6ef}#dnBtns .btn[data-a="dnp:1"]{background:#e3f3ff}#dnBtns .btn[data-a="dnp:2"]{background:#e4f8f0}#dnBtns .btn[data-a="dnp:3"]{background:#fff5d6}
@media (orientation:portrait){body.dancing #stats{visibility:hidden}}
body.dancing #joy,body.dancing #moveBtns,body.dancing #actWrap,body.dancing #pad,body.dancing #job,body.dancing #note,body.dancing #toast{visibility:hidden}
@media (orientation:portrait){#dnLane{height:min(36vh,300px)}}
@media (orientation:landscape) and (max-height:500px){#dnMsg{right:auto;left:3%;top:calc(env(safe-area-inset-top,0px) + 12px);bottom:auto;transform:none;font-size:34px}}body:has(#panel:not([hidden]) #card.dnres) #joy{visibility:hidden}body:has(#panel:not([hidden]) #card.ptres) :is(#joy,#moveBtns){visibility:hidden}
@media (orientation:landscape){#dnLane{left:auto;right:3%;transform:none;width:min(300px,30vw);top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 96px);height:min(62vh,420px)}#dnBtns{left:auto;right:3%;transform:none;width:min(300px,30vw);justify-content:space-between;gap:0}#dnBtns .btn{width:62px;height:62px;min-height:62px}#dnTop{top:calc(env(safe-area-inset-top,0px) + 64px);left:33%}#dnMsg{left:auto;right:calc(3% + min(300px,30vw) + 14px);top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 140px);transform:none;font-size:40px}}@media (orientation:landscape) and (max-height:500px){#dnLane{top:calc(env(safe-area-inset-top,0px) + 6px);height:auto}body.dancing #topbtns,body.dancing #stats{visibility:hidden}#dnTop{top:calc(env(safe-area-inset-top,0px) + 8px)}#dnMsg{left:3%;right:auto;top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 16px);font-size:34px}}   /* (run 4 finish: the pop-up under the dancers, not on them: its ✨ covered the left dancer's face) */   /* wide screens: the lane on the right with its four buttons right under it, the dancers in view (run 4, stage 3) */
@media (orientation:portrait){body:has(#hpCard:not([hidden])) #mmBtn,body:has(#hpCard:not([hidden])) #pad,body:has(#dnCard:not([hidden])) #mmBtn,body:has(#dnCard:not([hidden])) #pad{visibility:hidden}}   /* (run 4, stage 3: the card sat on the map and the notepad) */
#hpCard,#dnCard{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 74px);transform:translateX(-50%);z-index:9500;background:var(--paper);border:3px solid var(--line);border-radius:22px;padding:14px 16px 16px;box-shadow:0 6px 0 #3d2c5e;text-align:center;width:min(410px,92vw);color:var(--ink);animation:kcPop .2s ease-out}#hpCard .kc-b,#dnCard .kc-b{display:flex;gap:10px;justify-content:center}#hpCard .kc-t,#dnCard .kc-t{font-size:28px;line-height:1.15}#hpCard[hidden],#dnCard[hidden]{display:none}@media (orientation:portrait){#hpCard,#dnCard{top:calc(env(safe-area-inset-top,0px) + 150px)}}#hpCard .kc-b,#dnCard .kc-b{flex-wrap:wrap}#hpCard .kc-b .btn,#dnCard .kc-b .btn{min-height:48px;font-size:17px;padding:8px 14px;white-space:nowrap}
#dnFunkyHud{display:none}
#dnHud.dnFunky #dnLane{display:none}
#dnHud.dnFunky #dnFunkyHud,#dnFunkyCanvas{display:block;position:absolute;inset:0;width:100%;height:100%}
#dnFunkyHud{background:radial-gradient(ellipse at 50% 49%,transparent 54%,#4d204120 84%,#361b3e54)}
#dnFunkyHud .dnEdgeHit{position:absolute;bottom:0;width:48%;height:68%;opacity:0;pointer-events:none;background:radial-gradient(ellipse at 0 100%,#fff5c5e8, #ffdbae7a 33%,#ffdbae00 71%)}
#dnEdgeR{right:0;transform:scaleX(-1)}#dnEdgeL{left:0}
#dnComboPulse{position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse at 50% 49%,transparent 50%,#ffc161 87%,#fb9cc3);pointer-events:none}
#dnHud.dnFunky #dnTop{top:calc(env(safe-area-inset-top,0px) + 14px);left:50%;width:min(440px,calc(100% - 24px))}
#dnHud.dnFunky #dnTop{transform:translateX(calc(-50% + var(--dn-tug,0px)))}
#dnHud.dnFunky #dnMid{left:var(--dn-notch,50%)}
@media (min-width:1360px) and (min-height:680px){
  #dnHud.dnFunky #dnTop{width:min(710px,39vw);gap:16px;padding:10px 18px}
  .dnFunky .dnFace{min-width:106px;font-size:clamp(18px,1.32vw,27px)}.dnFunky .dnFace .em{font-size:36px}
  .dnFunky .dnFace i{font-size:clamp(24px,1.66vw,32px)}.dnFunky #dnBar{height:31px;border-width:4px}
}
#dnHud.dnFunky #dnMsg[data-cue]{left:50%;top:36%;z-index:1}
.dnFunky .dnFace.me b{color:#174b3b}
#dnHud.dnFunky #dnBtns{display:none;position:absolute;inset:0;width:auto;transform:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}
#dnHud.dnFunky.dnTouch #dnBtns{display:block}
#dnHud.dnFunky #dnBtns .btn{position:absolute;width:var(--dn-key,44px);height:var(--dn-key,44px);min-height:44px;transform:translate(-50%,-50%);border:0;padding:0;background:transparent;box-shadow:none;border-radius:50%}
#dnHud.dnFunky #dnBtns .btn svg{display:none}
#dnHud.dnFunky #dnBtns .btn:focus-visible{outline:3px solid #3d2c5e;outline-offset:-3px}
.dnKeys{display:flex;gap:8px;pointer-events:none}
#dnBtns .btn{pointer-events:auto;touch-action:none}
body.dnOverlay #hud{visibility:hidden}
@media (orientation:landscape) and (max-height:500px){#dnHud.dnFunky #dnTop{top:calc(env(safe-area-inset-top,0px) + 8px);width:min(348px,calc(100% - 24px));padding:3px 8px}.dnFunky .dnFace{font-size:12px}.dnFunky .dnFace .em{font-size:18px}.dnFunky .dnFace i{font-size:13px}}
#panel.bottom #card.dnres{align-self:flex-start;width:min(730px,100%);padding:6px 12px;margin:0;animation:dnResultArrival .16s .45s backwards}
@keyframes dnResultArrival{from{visibility:hidden;opacity:0}to{visibility:visible;opacity:1}}
.dnResultHeader{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:4px}
.dnres .who{position:static;display:inline-block;transform:rotate(-2deg);padding:2px 9px;margin:0;font-size:clamp(21px,2.3vw,29px);line-height:1.05}
.dnResults{width:100%;border-collapse:separate;border-spacing:0 2px;table-layout:fixed;color:#291d39;font-size:13px;line-height:1}
.dnResults th,.dnResults td{text-align:center;padding:2px 4px;background:#fff8ef}
.dnResults th:first-child{width:18%;text-align:left;padding-left:8px;border-radius:8px 0 0 8px}
.dnResults :is(th,td):last-child{border-radius:0 8px 8px 0}
.dnResults tbody th{overflow-wrap:anywhere}
.dnResults td{font-size:17px;font-weight:900;font-variant-numeric:tabular-nums}
.dnResults tbody tr:nth-child(2)>:not(.dnScore){background:#eee6f3}
.dnResults thead th,.dnResults tbody .dnScore{color:#fff;background:#3d2c5e}
.dnResults .dnScore{font-size:20px}
.dnResultChip{display:inline-block;padding:2px 5px;border-radius:6px;color:#281b36;white-space:nowrap;text-align:center;font-size:inherit;font-weight:900;box-shadow:inset 0 -2px #3d2c5e28}
.dnResultNote{font-size:12px;line-height:1.15;margin:4px 0 0;color:var(--ink)}
.dnResultActions{flex:0 0 auto;flex-wrap:nowrap;margin:0;gap:7px}
.dnResultActions .btn{min-height:44px;padding:4px 13px;white-space:nowrap}
.dnWinCrown{display:inline-block;transform-origin:50% 85%;padding:0 2px}
.dnResultsWin .dnWinCrown{animation:dnCrownPop .52s .45s cubic-bezier(.23,.75,.32,1) both}
@keyframes dnCrownPop{0%{transform:translateY(12px) scale(.2) rotate(-32deg)}58%{transform:translateY(-7px) scale(1.46) rotate(11deg)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){
  #panel.bottom #card.dnres{animation-duration:0s}
  .dnResultsWin .dnWinCrown{animation:none}
}
@media (min-width:1360px){
  #panel.bottom #card.dnres{width:min(820px,100%);padding:7px 14px}
  .dnResults{font-size:15px}.dnResults td{font-size:19px}.dnResults .dnScore{font-size:22px}
}
@media (max-width:600px),(max-height:500px){
  #panel.bottom #card.dnres{align-self:flex-end;padding:5px 7px}
  .dnResults{font-size:11px}.dnResults th,.dnResults td{padding:1px 2px}
  .dnResults td{font-size:16px}.dnResults .dnScore{font-size:19px}
  .dnResultChip{padding:2px 3px}
  .dnres .who{font-size:20px;padding:2px 5px}.dnResultNote{font-size:11px}
  .dnResultActions .btn{padding:3px 7px;font-size:14px}
}
@media (orientation:landscape) and (max-height:500px){
  body:not(.shoot):not(.dancing) #panel.bottom:has(#card.dnres){padding-left:calc(env(safe-area-inset-left,0px) + 14px)}
  #panel.bottom #card.dnres{display:grid;grid-template-columns:clamp(155px,27vw,228px) minmax(0,1fr);gap:4px 8px;align-items:center}
  .dnResultHeader{display:grid;gap:2px;margin:0}
  .dnResultHeader>div:first-child{display:flex;flex-wrap:wrap;align-items:center;gap:2px 6px}
  .dnres .who{font-size:17px}
  .dnResultNote{font-size:10px;margin:0}
  .dnres>.dnResultNote{grid-column:1/-1}
}
`;document.head.appendChild(st);}   /* the cards' and the dance HUD's looks, in at load time */
const HPT={seen:new Set(),queue:[],cur:null,rem:{},noted:{},ans:null,tiles:null,mats:null,balls:null,room:null,items:0,palette:null,lit:false,t:0,ct:0};
function hpOn(h){h=h===undefined?S&&S.hp:h;return !!(h&&gameMs()>=h.at&&gameMs()<h.at+HP_LEN);}   /* (a party's time is on the one clock: gameMs, so a night skip brings it closer) */
function hpSoon(h){h=h===undefined?S&&S.hp:h;return !!(h&&gameMs()<h.at+HP_LEN);}
function hpWhen(h){const d=clockAt(h.at),n=clockNow();return (d.day===n.day?'today':d.day===n.day+1?'tomorrow':'on '+wdName(d.day))+' at '+clockStr(h.h!=null?h.h:d.time);}
function hpDisco(){return !!(S&&S.home&&S.home.items.some(it=>it.t==='discofloor')&&S.home.items.some(it=>it.t==='discoball'));}
/* 📬 the mailbox: mail, or a party */
function hpMailMenu(){SFX.tap();const h=S.hp,soon=hpSoon(h),on=hpOn(h),yes=h?Object.values(S.rsvpIn||{}).filter(Boolean).length:0;
  openPanel(`<div class="hd"><h2>📬 Mailbox</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    ${h&&soon?`<p class="note">🎉 Your party is ${on?'on right now!':hpWhen(h)+'.'} ${yes?yes+(yes===1?' friend has':' friends have')+' said yes. ':''}${hpDisco()?'🪩 You have a disco floor and ball: a dance party!':'Tip: a 🪩 disco floor and ball make it a dance party!'}</p>`:''}
    <div class="row wrap hpbtns"><button class="btn butter" data-a="hpmail">📬 Check mail</button>${h&&soon?`<button class="btn white" data-a="hpcancel">❌ Cancel the party</button>`:`<button class="btn mint" data-a="hpplan">🎉 Host a party</button>`}</div>`,{bottom:true,cls:'hpcard'});}
ACT.hpmail=()=>{closePanel();checkMail();};
ACT.hpplan=()=>{SFX.tap();const n=clockNow(),opts=[];for(let h=Math.max(8,Math.floor(n.time)+1);h<=21&&opts.length<4;h++)opts.push([n.day,h]);if(opts.length<2)for(const h of[9,10,11,12])opts.push([n.day+1,h]);
  openPanel(`<div class="hd"><h2>🎉 Host a party</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><p class="note">Pick a time. Your friends get an invitation, and when it starts they can come&nbsp;over!</p>
    <div class="grid">${opts.map(([d,h])=>`<button class="it" data-a="hpset:${d}:${h}"><span class="em">${h>=18?'🌙':'☀️'}</span><span>${d===n.day?'Today':'Tomorrow'}<br>${clockStr(h)}</span></button>`).join('')}</div>`,{bottom:true,cls:'hpcard'});};
ACT.hpset=v=>{const [d,h]=v.split(':').map(Number);if(!Number.isFinite(d)||!Number.isFinite(h))return;S.hp={id:uid(),at:msAt(d,h),h,d};S.rsvpIn={};change();closePanel();SFX.yay();
  toast(`🎉 Party ${d===clockNow().day?'today':'tomorrow'} at ${clockStr(h)}! Everyone playing hears about it. ${hpDisco()?'🪩 It will be a dance party!':'A 🪩 disco floor and a disco ball would make it a dance party!'}`,5);};
ACT.hpcancel=()=>{S.hp=null;S.rsvpIn=null;change();closePanel();toast('The party is called off. Maybe another day! 💛',3);};
/* what I send: my party, my answer, my dance round (optional fields: old versions ignore them) */
function hpStamp(st){const h=S.hp;st.py=h&&hpSoon(h)?{id:h.id,at:h.at,h:h.h}:null;st.pa=HPT.ans||null;st.dn=DANCE.mine?Object.assign({},DANCE.mine):null;st.dp=DN_PITCH?1:null;}
function hpFields(a,pr){const obj=v=>v&&typeof v==='object'?v:null;a.py=obj(pr.py);a.pa=obj(pr.pa);a.dn=obj(pr.dn);a.dp=pr.dp===1;}
/* 💌 the invitation card, like the knock card */
function hpCard(){if(HPT.cur||!HPT.queue.length)return;const q=HPT.queue.shift();if(!MP.peers.has(q.peer)){hpCard();return;}HPT.cur=q;const when=hpWhen({at:q.at,h:q.h});
  SFX.ding();   /* (run 4, stage 3: the card says it all; the note that used to show behind it is gone) */
  let el=$('hpCard');if(!el){el=document.createElement('div');el.id='hpCard';document.body.appendChild(el);}
  el.innerHTML=`<div class="kc-t">🎉 A party!</div><div class="kc-m"><b>${esc(q.nm)}</b> is hosting a party ${esc(when)}!<br>Go check it out?</div><div class="kc-b"><button class="btn mint" id="hpYes">✅ I'll come!</button><button class="btn" id="hpNo">🙅 Not this time</button></div>`;
  el.hidden=false;$('hpYes').onclick=()=>hpAnswer(true);$('hpNo').onclick=()=>hpAnswer(false);clearTimeout(HPT.ct);HPT.ct=setTimeout(()=>{if(HPT.cur===q)hpAnswer(false,true);},40000);}
function hpAnswer(ok,quiet){const q=HPT.cur;if(!q)return;HPT.cur=null;const el=$('hpCard');if(el)el.hidden=true;clearTimeout(HPT.ct);S.rsvp=S.rsvp||{};S.rsvp[q.id]=ok?'yes':'no';HPT.ans={id:q.id,ok:ok?1:0};change();
  const a=MP.peers.get(q.peer);if(ok){SFX.yay();if(gameMs()>=q.at){HPT.noted[q.id]=1;if(a&&hpNav(a))HPT.rem[q.id]=1;}else if(!quiet)toast('🎉 Yay! I will tell you when '+q.nm+"'s party starts.",3.4);}else if(!quiet)toast('💛 Okay, maybe next time.',2.4);setTimeout(hpCard,600);}
function hpNav(a,quiet){const j=LANE.slotOf.get(a.peer),ln=LOC.city.lane;if(j==null||!ln||!ln[j]){if(!quiet)toast('🏠 '+a.nm+"'s house is not on Friends Lane right now.",3);return false;}const d=ln[j].door;
  setNavTo({id:'party',n:a.nm+"'s party",i:'🎉',x:d[0],z:d[1],w:4,d:4,door:[d[0],d[1]],flat:1,nq:1},true);toast('🎉 Follow the arrow to '+a.nm+"'s house!",3.2);return true;}
/* 🪩 the disco floor flashes and the ball spins at a party, or while a round is on */
function hpLights(dt){const L=CUR&&(CUR.id==='home'||CUR.id==='visit')?CUR:null;let on=false;
  if(DANCE.spots&&DANCE.spots.userData.funky&&DANCE.spots.userData.funky.room===L)return;
  if(L){if(CUR.id==='home')on=hpOn()||DANCE.on;else{const a=MP.peers.get(VIS.host);on=DANCE.on||!!(a&&a.py&&hpOn(a.py));}}
  if(L!==HPT.room||L&&L.danceFurniture!==HPT.items){
    HPT.room=L;HPT.items=L?.danceFurniture;
    HPT.tiles=[];HPT.mats=[];HPT.balls=[];
    if(L)L.items.traverse(o=>{
      if(o.userData.ball)HPT.balls.push(o);
      if(o.isMesh&&o.userData.tile!==undefined){
        HPT.tiles.push(o);HPT.mats[o.userData.tile]||=o.material;
      }
    });
    HPT.palette=HPT.mats.filter(Boolean);HPT.lit=false;
  }
  if(HPT.balls)for(const ball of HPT.balls)ball.rotation.y+=dt*.33;
  if(!HPT.tiles||!HPT.tiles.length)return;const M=HPT.palette;
  if(on){HPT.t+=dt;const step=Math.floor(HPT.t*3);for(const o of HPT.tiles){const m=M[(o.userData.tile+step)%M.length];if(m&&o.material!==m)o.material=m;}HPT.lit=true;}
  else if(HPT.lit){for(const o of HPT.tiles){const m=HPT.mats[o.userData.tile];if(m)o.material=m;}HPT.lit=false;}}
function hpTick(dt){if(!S)return;
  if(S.hp&&gameMs()>=S.hp.at+HP_LEN){S.hp=null;S.rsvpIn=null;change();if(PLAYING)toast('🎉 Your party is over. What a day!',3);}
  if(MP.grp)for(const a of MP.peers.values()){const py=a.py;
    if(py&&typeof py.id==='string'&&Number.isFinite(py.at)&&gameMs()<py.at+HP_LEN){const key=a.peer+'|'+py.id,r=S.rsvp&&S.rsvp[py.id];
      if(!HPT.seen.has(key)&&!r){HPT.seen.add(key);HPT.queue.push({peer:a.peer,id:py.id,at:py.at,h:py.h,nm:a.nm});}
      if(r==='yes'&&gameMs()>=py.at){if(!HPT.noted[py.id]){HPT.noted[py.id]=1;SFX.ding();showNote('🎉 Party time!',a.nm+"'s party is starting! Follow the arrow to their house.",true,'🎉');}
        if(!HPT.rem[py.id]&&CUR&&CUR.id==='city'&&hpNav(a,true))HPT.rem[py.id]=1;}}   /* (the way is set as soon as the host's house is on Friends Lane) */
    if(S.hp&&a.pa&&a.pa.id===S.hp.id){S.rsvpIn=S.rsvpIn||{};if(S.rsvpIn[a.peer]!==a.pa.ok){S.rsvpIn[a.peer]=a.pa.ok;if(a.pa.ok&&PLAYING)toast('💌 '+a.nm+' is coming to your party!',3);}}}
  if(!HPT.cur&&HPT.queue.length&&PLAYING&&!CUT&&!fading&&!DANCE.on)hpCard();
  hpLights(dt);dnTick(dt);}
/* ================= 🕺💃 the dance game ================= */
/* BEGIN DANCE SOURCES — generated by tools/dance-lab/tools/embed-game.js */
(function (root) {
  'use strict';

  function seedFor(text) {
    let seed = 2166136261;
    for (let i = 0; i < text.length; i++) {
      seed = Math.imul(seed ^ text.charCodeAt(i), 16777619);
    }
    return seed >>> 0;
  }

  function seeded(seed) {
    let state = seed >>> 0;
    return function () {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function makeChart(grid, level, seed) {
    const random = seeded(seed);
    const period = 60 / grid.bpm;
    const notes = [];
    const first = Math.ceil((0.46 - grid.firstBeat) / period);
    const last = Math.floor((grid.duration - 0.64 - grid.firstBeat) / period);
    const span = Math.max(1, last - first);
    let previous = -1;
    function add(time, double) {
      const lane = previous < 0 ? Math.floor(random() * 4) : (previous + 1 + Math.floor(random() * 3)) % 4;
      notes.push({ time, lane });
      if (double) notes.push({ time, lane: (lane + 2) % 4 });
      previous = lane;
    }

    for (let beat = first; beat <= last; beat++) {
      const progress = (beat - first) / span;
      const time = grid.firstBeat + beat * period;
      // Level one stays on alternate beats. At higher levels, extra
      // subdivisions and doubles enter progressively over the round.
      const primary = (beat - first) % 2 === 0 ||
        (level > 1 && (level >= 4 || random() < (level - 1) * (0.21 + progress * 0.22)));
      if (primary) add(time, level === 5 && (beat - first) % (progress < 0.5 ? 8 : 4) === 2);
      if (beat < last && level >= 3 &&
          (level === 5 && progress >= 0.67 || random() < (level - 2) * (0.10 + progress * 0.16))) {
        add(time + period / 2, false);
      }
    }
    return notes;
  }

  const api = { seedFor, seeded, makeChart };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DanceChart = api;
}(typeof window === 'object' ? window : globalThis));
(function (root) {
  'use strict';

  const perfect = { key: 'perfect', label: 'Perfect', points: 15 };
  const good = { key: 'good', label: 'Good', points: 10 };
  const late = { key: 'late', label: 'Late-but-OK', points: 10 };
  const miss = { key: 'miss', label: 'Miss', points: 0 };

  function judge(error, window = 0.28) {
    const distance = Math.abs(error);
    if (distance > window) return miss;
    if (distance <= Math.min(window, 0.10)) return perfect;
    if (distance <= Math.min(window, 0.19)) return good;
    return late;
  }

  function emptyScore() {
    return { total: 0, combo: 0, best: 0, perfect: 0 };
  }

  function score(previous, result) {
    const combo = result.points ? previous.combo + 1 : 0;
    return {
      total: previous.total + result.points,
      combo,
      best: Math.max(previous.best, combo),
      perfect: previous.perfect + Number(result.key === 'perfect')
    };
  }

  const api = { judge, emptyScore, score };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DanceJudge = api;
}(typeof window === 'object' ? window : globalThis));
const DN_TRACK={"id":"alley-cat","src":"music/alley-cat-dumpster-divin.mp3","bpm":112.994,"firstBeat":0.27,"duration":16.991};
const DN_LOOP={"bpm":112.99996,"firstBeat":0,"beats":32,"duration":85,"preroll":1.5,"profiles":{"steady":{"src":"music/alley-cat-round-steady.mp3","segments":[[0,16.991156,1],[16.991156,33.982313,1],[33.982313,50.973469,1],[50.973469,67.964626,1],[67.964626,84.955782,1],[84.955782,85,1]],"accents":[[0.625,25,"snare"],[0.69,22,"snare"],[0.8,64,"snare"],[0.955,50,"melody"],[1.05,39,"kick"],[1.185,25,"kick"],[1.2625,40,"meow"],[1.595,100,"snare"],[1.8675,43,"kick"],[1.905,33,"kick"],[2.0075,25,"snare"],[2.0825,30,"snare"],[2.15,44,"snare"],[2.24,31,"snare"],[2.3,26,"snare"],[2.35,32,"snare"],[2.435,25,"snare"],[2.5325,28,"snare"],[2.66,69,"snare"],[2.74,17,"melody"],[2.925,61,"melody"],[3.0175,47,"kick"],[3.0775,41,"melody"],[3.19,32,"snare"],[3.315,23,"snare"],[3.575,16,"melody"],[3.7075,89,"snare"],[3.8625,34,"snare"],[3.9575,30,"snare"],[3.9925,57,"snare"],[4.15,19,"snare"],[4.205,29,"snare"],[4.285,37,"melody"],[4.3375,24,"snare"],[4.3875,31,"snare"],[4.485,36,"snare"],[4.63,17,"kick"],[4.77,42,"snare"],[5.0475,100,"snare"],[5.2025,31,"kick"],[5.2675,43,"kick"],[5.3,60,"melody"],[5.335,35,"kick"],[5.3975,22,"melody"],[5.59,22,"melody"],[5.8425,100,"snare"],[6.1075,100,"melody"],[6.155,56,"snare"],[6.235,30,"snare"],[6.3375,26,"snare"],[6.3975,40,"snare"],[6.4625,34,"snare"],[6.55,34,"snare"],[6.635,35,"snare"],[6.7325,34,"melody"],[6.8175,38,"snare"],[6.8525,38,"kick"],[6.8925,25,"snare"],[7.17,100,"snare"],[7.2975,36,"snare"],[7.345,28,"snare"],[7.4425,36,"snare"],[7.7025,100,"melody"],[7.7975,42,"kick"],[7.8575,42,"snare"],[7.955,43,"snare"],[7.99,35,"kick"],[8.1225,40,"snare"],[8.1825,42,"melody"],[8.2675,51,"kick"],[8.385,47,"snare"],[8.475,38,"snare"],[8.505,33,"snare"],[8.545,23,"snare"],[8.605,31,"snare"],[8.64,20,"melody"],[8.675,16,"melody"],[8.7225,29,"melody"],[8.7875,29,"kick"],[9.02,100,"melody"],[9.295,59,"snare"],[9.3975,36,"snare"],[9.47,21,"melody"],[9.515,24,"melody"],[9.5825,27,"snare"],[9.6875,35,"snare"],[9.7975,37,"melody"],[9.8675,39,"melody"],[9.9125,23,"melody"],[9.9475,34,"melody"],[10.09,87,"snare"],[10.195,24,"melody"],[10.265,28,"snare"],[10.31,20,"snare"],[10.3875,49,"melody"],[10.6675,38,"melody"],[10.755,25,"snare"],[10.79,38,"meow"],[10.8375,44,"meow"],[10.895,26,"snare"],[10.9675,24,"melody"],[11.005,30,"snare"],[11.1075,24,"melody"],[11.2675,22,"snare"],[11.33,81,"meow"],[11.3975,50,"meow"],[11.435,20,"kick"],[11.51,17,"kick"],[11.55,18,"melody"],[11.605,23,"kick"],[11.685,83,"snare"],[11.9475,16,"melody"],[11.9875,28,"melody"],[12.0825,25,"snare"],[12.1725,18,"snare"],[12.26,19,"melody"],[12.295,22,"melody"],[12.3425,22,"snare"],[12.5175,30,"kick"],[12.6075,27,"snare"],[12.655,29,"snare"],[12.7225,22,"snare"],[12.7775,40,"melody"],[12.8325,26,"snare"],[12.8825,27,"snare"],[12.98,29,"snare"],[13.0175,27,"snare"],[13.15,18,"kick"],[13.285,28,"snare"],[13.4425,39,"snare"],[13.5425,100,"meow"],[13.5925,52,"meow"],[13.64,30,"kick"],[13.8025,29,"melody"],[13.9175,19,"melody"],[14.34,100,"snare"],[14.6025,100,"melody"],[14.65,53,"melody"],[14.7375,30,"snare"],[14.8325,21,"snare"],[14.8675,19,"melody"],[14.9125,33,"kick"],[14.96,31,"snare"],[15.02,31,"kick"],[15.1425,54,"melody"],[15.225,36,"snare"],[15.2775,29,"snare"],[15.315,32,"snare"],[15.395,36,"snare"],[15.4925,29,"snare"],[15.565,31,"snare"],[15.675,48,"snare"],[15.7875,38,"melody"],[15.9225,24,"kick"],[16.0425,22,"kick"],[16.1975,100,"melody"],[16.295,58,"melody"],[16.455,49,"melody"],[16.575,69,"kick"],[16.7575,64,"melody"],[16.875,36,"snare"],[17.03,29,"snare"],[17.09,33,"snare"],[17.1375,36,"snare"],[17.2475,28,"snare"],[17.4125,37,"snare"],[17.4975,33,"snare"],[17.6325,25,"snare"],[17.665,22,"snare"],[17.79,64,"snare"],[17.945,50,"melody"],[18.0425,39,"kick"],[18.1625,25,"kick"],[18.2175,40,"meow"],[18.5875,100,"snare"],[18.86,43,"kick"],[18.895,33,"kick"],[18.9775,25,"snare"],[19.06,30,"snare"],[19.1525,44,"snare"],[19.2325,31,"snare"],[19.2975,26,"snare"],[19.3775,32,"snare"],[19.415,25,"snare"],[19.56,28,"snare"],[19.65,69,"snare"],[19.9175,61,"melody"],[20.01,47,"kick"],[20.07,41,"melody"],[20.165,32,"snare"],[20.27,23,"snare"],[20.7,89,"snare"],[20.8875,34,"snare"],[20.9825,57,"snare"],[21.175,29,"snare"],[21.2625,37,"melody"],[21.33,24,"snare"],[21.39,31,"snare"],[21.4275,36,"snare"],[21.5975,17,"kick"],[21.7625,42,"snare"],[22.0375,100,"snare"],[22.195,31,"kick"],[22.2925,60,"melody"],[22.325,35,"kick"],[22.355,22,"melody"],[22.58,22,"melody"],[22.835,100,"snare"],[23.1,100,"melody"],[23.145,56,"snare"],[23.2125,30,"snare"],[23.315,26,"snare"],[23.39,40,"snare"],[23.455,34,"snare"],[23.51,34,"snare"],[23.6375,35,"snare"],[23.735,34,"melody"],[23.8425,38,"kick"],[23.89,25,"snare"],[24.16,100,"snare"],[24.2575,36,"snare"],[24.3375,28,"snare"],[24.3975,36,"snare"],[24.6925,100,"melody"],[24.8175,42,"kick"],[24.8575,42,"snare"],[24.9475,43,"snare"],[24.9825,35,"kick"],[25.1125,40,"snare"],[25.1975,42,"melody"],[25.2675,51,"kick"],[25.3375,47,"snare"],[25.4975,38,"snare"],[25.5375,23,"snare"],[25.605,31,"snare"],[25.645,20,"melody"],[25.705,29,"melody"],[25.7775,29,"kick"],[26.01,100,"melody"],[26.285,59,"snare"],[26.3825,36,"snare"],[26.46,21,"melody"],[26.55,27,"snare"],[26.725,35,"snare"],[26.7875,37,"melody"],[26.8575,39,"melody"],[26.905,23,"melody"],[26.9375,34,"melody"],[27.08,87,"snare"],[27.1875,24,"melody"],[27.255,28,"snare"],[27.36,49,"melody"],[27.6375,38,"melody"],[27.74,25,"snare"],[27.7875,38,"meow"],[27.8225,44,"meow"],[27.8875,26,"snare"],[27.9575,24,"melody"],[28.02,30,"snare"],[28.0775,24,"melody"],[28.245,22,"snare"],[28.3225,81,"meow"],[28.3875,50,"meow"],[28.4475,20,"kick"],[28.4875,17,"kick"],[28.5275,18,"melody"],[28.5625,23,"kick"],[28.675,83,"snare"],[28.9525,16,"melody"],[28.9875,28,"melody"],[29.0475,25,"snare"],[29.195,18,"snare"],[29.2925,22,"melody"],[29.3275,22,"snare"],[29.5175,30,"kick"],[29.5975,29,"snare"],[29.7675,40,"melody"],[29.825,26,"snare"],[29.88,27,"snare"],[29.96,29,"snare"],[30.045,27,"snare"],[30.105,18,"kick"],[30.2775,28,"snare"],[30.385,24,"melody"],[30.4325,39,"snare"],[30.5325,100,"meow"],[30.6075,52,"meow"],[30.7475,29,"melody"],[30.8875,19,"melody"],[31.33,100,"snare"],[31.595,100,"melody"],[31.7225,30,"snare"],[31.81,21,"snare"],[31.865,19,"melody"],[31.905,33,"kick"],[31.9775,31,"snare"],[32.025,31,"kick"],[32.1325,54,"melody"],[32.22,36,"snare"],[32.27,29,"snare"],[32.305,32,"snare"],[32.3625,36,"snare"],[32.52,31,"snare"],[32.665,48,"snare"],[32.7525,38,"melody"],[32.915,24,"kick"],[33.0575,22,"kick"],[33.1875,100,"melody"],[33.31,58,"melody"],[33.445,49,"melody"],[33.59,69,"kick"],[33.7675,64,"melody"],[33.8525,36,"snare"],[34.01,29,"snare"],[34.0775,33,"snare"],[34.1275,36,"snare"],[34.21,28,"snare"],[34.275,27,"snare"],[34.355,37,"snare"],[34.5,33,"snare"],[34.6125,25,"snare"],[34.6725,22,"snare"],[34.7825,64,"snare"],[34.9375,50,"melody"],[35.0325,39,"kick"],[35.19,25,"kick"],[35.245,40,"meow"],[35.5775,100,"snare"],[35.85,43,"kick"],[35.8875,33,"kick"],[35.99,25,"snare"],[36.0375,30,"snare"],[36.1325,44,"snare"],[36.2225,31,"snare"],[36.2825,26,"snare"],[36.3375,32,"snare"],[36.4175,25,"snare"],[36.49,28,"snare"],[36.6425,69,"snare"],[36.7225,17,"melody"],[36.9075,61,"melody"],[37,47,"kick"],[37.06,41,"melody"],[37.1575,32,"snare"],[37.32,23,"snare"],[37.69,89,"snare"],[37.865,34,"snare"],[37.975,57,"snare"],[38.1325,19,"snare"],[38.1875,29,"snare"],[38.2625,37,"melody"],[38.32,24,"snare"],[38.37,31,"snare"],[38.4675,36,"snare"],[38.6125,17,"kick"],[38.7525,42,"snare"],[39.0275,100,"snare"],[39.185,31,"kick"],[39.25,43,"kick"],[39.2825,60,"melody"],[39.3175,35,"kick"],[39.38,22,"melody"],[39.5725,22,"melody"],[39.825,100,"snare"],[40.09,100,"melody"],[40.1375,56,"snare"],[40.2175,30,"snare"],[40.32,26,"snare"],[40.38,40,"snare"],[40.445,34,"snare"],[40.53,34,"snare"],[40.6175,32,"melody"],[40.665,35,"snare"],[40.715,34,"melody"],[40.8,38,"kick"],[40.875,25,"snare"],[41.0325,16,"kick"],[41.1525,100,"snare"],[41.28,36,"snare"],[41.3275,28,"snare"],[41.4225,36,"snare"],[41.6825,100,"melody"],[41.78,42,"kick"],[41.84,42,"snare"],[41.9375,43,"snare"],[41.9725,35,"kick"],[42.105,40,"snare"],[42.165,42,"melody"],[42.2475,51,"kick"],[42.3675,47,"snare"],[42.4575,38,"snare"],[42.5275,23,"snare"],[42.5875,31,"snare"],[42.705,29,"melody"],[42.77,29,"kick"],[43.0025,100,"melody"],[43.2775,59,"snare"],[43.38,36,"snare"],[43.445,21,"melody"],[43.49,24,"melody"],[43.565,27,"snare"],[43.67,35,"snare"],[43.7825,37,"melody"],[43.85,39,"melody"],[43.895,23,"melody"],[43.93,34,"melody"],[44.0725,87,"snare"],[44.1775,24,"melody"],[44.2475,28,"snare"],[44.31,20,"snare"],[44.37,49,"melody"],[44.65,38,"melody"],[44.73,25,"snare"],[44.7725,38,"meow"],[44.8175,44,"meow"],[44.8775,26,"snare"],[44.95,24,"melody"],[45,30,"snare"],[45.0575,24,"melody"],[45.2675,22,"snare"],[45.3125,81,"meow"],[45.38,50,"meow"],[45.4375,20,"kick"],[45.4775,17,"kick"],[45.5325,18,"melody"],[45.5875,23,"kick"],[45.665,83,"snare"],[45.91,16,"melody"],[45.97,28,"melody"],[46.065,25,"snare"],[46.1725,18,"snare"],[46.2425,19,"melody"],[46.2775,22,"melody"],[46.33,22,"snare"],[46.5,30,"kick"],[46.6375,29,"snare"],[46.705,22,"snare"],[46.7575,40,"melody"],[46.815,26,"snare"],[46.865,27,"snare"],[46.9625,29,"snare"],[47.1325,18,"kick"],[47.2675,28,"snare"],[47.4275,39,"snare"],[47.525,100,"meow"],[47.6225,30,"kick"],[47.785,29,"melody"],[47.9025,19,"melody"],[48.3225,100,"snare"],[48.585,100,"melody"],[48.6325,53,"melody"],[48.7125,30,"snare"],[48.815,21,"snare"],[48.85,19,"melody"],[48.92,33,"kick"],[49.0025,31,"kick"],[49.125,54,"melody"],[49.2075,36,"snare"],[49.2975,32,"snare"],[49.395,36,"snare"],[49.475,29,"snare"],[49.5475,31,"snare"],[49.65,48,"snare"],[49.77,38,"melody"],[49.93,24,"kick"],[50.025,22,"kick"],[50.18,100,"melody"],[50.2775,58,"melody"],[50.435,49,"melody"],[50.5575,69,"kick"],[50.74,64,"melody"],[50.8575,36,"snare"],[51.0125,29,"snare"],[51.0675,33,"snare"],[51.12,36,"snare"],[51.23,28,"snare"],[51.3825,37,"snare"],[51.5025,33,"snare"],[51.615,25,"snare"],[51.7725,64,"snare"],[51.9275,50,"melody"],[52.025,39,"kick"],[52.16,25,"kick"],[52.2725,40,"meow"],[52.57,100,"snare"],[52.8425,43,"kick"],[52.88,33,"kick"],[52.96,25,"snare"],[53.0425,30,"snare"],[53.135,44,"snare"],[53.2025,31,"snare"],[53.28,26,"snare"],[53.3225,32,"snare"],[53.3975,25,"snare"],[53.53,28,"snare"],[53.6325,69,"snare"],[53.9,61,"melody"],[53.99,47,"kick"],[54.0525,41,"melody"],[54.1475,32,"snare"],[54.275,23,"snare"],[54.68,89,"snare"],[54.87,34,"snare"],[54.965,57,"snare"],[55.085,19,"snare"],[55.1775,29,"snare"],[55.245,37,"melody"],[55.3125,24,"snare"],[55.3725,31,"snare"],[55.4575,36,"snare"],[55.64,17,"kick"],[55.745,42,"snare"],[56.02,100,"snare"],[56.1775,31,"kick"],[56.275,60,"melody"],[56.3075,35,"kick"],[56.3375,22,"melody"],[56.5625,22,"melody"],[56.8175,100,"snare"],[57.0825,100,"melody"],[57.1275,56,"snare"],[57.215,30,"snare"],[57.2975,26,"snare"],[57.3725,40,"snare"],[57.4375,34,"snare"],[57.5225,34,"snare"],[57.6075,35,"snare"],[57.7175,34,"melody"],[57.825,38,"kick"],[57.8725,25,"snare"],[58.1425,100,"snare"],[58.24,36,"snare"],[58.32,28,"snare"],[58.38,36,"snare"],[58.675,100,"melody"],[58.77,42,"kick"],[58.84,42,"snare"],[58.93,43,"snare"],[58.965,35,"kick"],[59.095,40,"snare"],[59.18,42,"melody"],[59.25,51,"kick"],[59.32,47,"snare"],[59.48,38,"snare"],[59.5175,23,"snare"],[59.6275,31,"snare"],[59.6875,29,"melody"],[59.76,29,"kick"],[59.9925,100,"melody"],[60.2675,59,"snare"],[60.3725,36,"snare"],[60.4425,21,"melody"],[60.4825,24,"melody"],[60.555,27,"snare"],[60.7075,35,"snare"],[60.77,37,"melody"],[60.84,39,"melody"],[60.8875,23,"melody"],[60.915,34,"melody"],[61.0625,87,"snare"],[61.17,24,"melody"],[61.2375,28,"snare"],[61.27,20,"snare"],[61.3425,49,"melody"],[61.62,38,"melody"],[61.7225,25,"snare"],[61.77,38,"meow"],[61.81,44,"meow"],[61.87,26,"snare"],[61.94,24,"melody"],[62.0025,30,"snare"],[62.06,24,"melody"],[62.2275,22,"snare"],[62.3,81,"meow"],[62.37,50,"meow"],[62.4275,20,"kick"],[62.51,23,"kick"],[62.6575,83,"snare"],[62.935,16,"melody"],[62.97,28,"melody"],[63.0275,25,"snare"],[63.1775,18,"snare"],[63.2725,22,"melody"],[63.315,22,"snare"],[63.5,30,"kick"],[63.58,27,"snare"],[63.6625,29,"snare"],[63.75,40,"melody"],[63.8075,27,"snare"],[63.9425,29,"snare"],[64.015,27,"snare"],[64.0875,18,"kick"],[64.26,28,"snare"],[64.3675,24,"melody"],[64.415,39,"snare"],[64.515,100,"meow"],[64.59,52,"meow"],[64.73,29,"melody"],[64.8925,19,"melody"],[65.3125,100,"snare"],[65.5775,100,"melody"],[65.6225,53,"melody"],[65.71,30,"snare"],[65.7925,21,"snare"],[65.8475,19,"melody"],[65.8875,33,"kick"],[65.9575,31,"snare"],[66.0075,31,"kick"],[66.115,54,"melody"],[66.2025,36,"snare"],[66.2525,29,"snare"],[66.2875,32,"snare"],[66.345,36,"snare"],[66.49,29,"snare"],[66.575,31,"snare"],[66.6475,48,"snare"],[66.735,38,"melody"],[66.895,24,"kick"],[67.04,22,"kick"],[67.17,100,"melody"],[67.2925,58,"melody"],[67.4275,49,"melody"],[67.5725,69,"kick"],[67.75,64,"melody"],[67.835,36,"snare"],[67.985,29,"snare"],[68.06,33,"snare"],[68.16,36,"snare"],[68.24,27,"snare"],[68.3375,37,"snare"],[68.4825,33,"snare"],[68.595,25,"snare"],[68.6425,22,"snare"],[68.765,64,"snare"],[68.92,50,"melody"],[69.015,39,"kick"],[69.1125,25,"kick"],[69.195,40,"meow"],[69.56,100,"snare"],[69.8325,43,"kick"],[70.02,30,"snare"],[70.115,44,"snare"],[70.205,31,"snare"],[70.265,26,"snare"],[70.3025,32,"snare"],[70.425,25,"snare"],[70.4725,28,"snare"],[70.625,69,"snare"],[70.6675,17,"melody"],[70.89,61,"melody"],[70.9825,47,"kick"],[71.0425,41,"melody"],[71.14,32,"snare"],[71.3025,23,"snare"],[71.6725,89,"snare"],[71.8475,34,"snare"],[71.9225,30,"snare"],[71.955,57,"snare"],[72.115,19,"snare"],[72.17,29,"snare"],[72.2375,37,"melody"],[72.3025,24,"snare"],[72.345,31,"snare"],[72.45,36,"snare"],[72.5825,17,"kick"],[72.735,42,"snare"],[73.01,100,"snare"],[73.1675,31,"kick"],[73.23,43,"kick"],[73.265,60,"melody"],[73.3,35,"kick"],[73.3275,22,"melody"],[73.5525,22,"melody"],[73.8075,100,"snare"],[74.0725,100,"melody"],[74.12,56,"snare"],[74.2,30,"snare"],[74.3025,26,"snare"],[74.3625,40,"snare"],[74.4275,34,"snare"],[74.5175,34,"snare"],[74.6475,35,"snare"],[74.72,34,"melody"],[74.7825,38,"kick"],[74.8575,25,"snare"],[75.135,100,"snare"],[75.2625,36,"snare"],[75.31,28,"snare"],[75.405,36,"snare"],[75.665,100,"melody"],[75.7625,42,"kick"],[75.8325,42,"snare"],[75.92,43,"snare"],[75.955,35,"kick"],[76.0875,40,"snare"],[76.1475,42,"melody"],[76.23,51,"kick"],[76.35,47,"snare"],[76.44,38,"snare"],[76.51,23,"snare"],[76.57,31,"snare"],[76.6875,29,"melody"],[76.7525,29,"kick"],[76.985,100,"melody"],[77.26,59,"snare"],[77.3625,36,"snare"],[77.4275,21,"melody"],[77.4725,24,"melody"],[77.5475,27,"snare"],[77.6525,35,"snare"],[77.765,37,"melody"],[77.8325,39,"melody"],[77.9125,34,"melody"],[78.055,87,"snare"],[78.16,24,"melody"],[78.23,28,"snare"],[78.3525,49,"melody"],[78.6375,38,"melody"],[78.7125,25,"snare"],[78.795,44,"meow"],[78.86,26,"snare"],[78.9325,24,"melody"],[78.9825,30,"snare"],[79.04,24,"melody"],[79.25,22,"snare"],[79.295,81,"meow"],[79.36,50,"meow"],[79.42,20,"kick"],[79.46,17,"kick"],[79.515,18,"melody"],[79.57,23,"kick"],[79.6475,83,"snare"],[79.9525,28,"melody"],[80.0475,25,"snare"],[80.1925,19,"melody"],[80.26,22,"melody"],[80.305,22,"snare"],[80.455,30,"kick"],[80.5925,29,"snare"],[80.6875,22,"snare"],[80.74,40,"melody"],[80.7975,26,"snare"],[80.8475,27,"snare"],[80.945,29,"snare"],[81.115,18,"kick"],[81.2475,28,"snare"],[81.42,39,"snare"],[81.5075,100,"meow"],[81.605,30,"kick"],[81.7675,29,"melody"],[81.885,19,"melody"],[82.305,100,"snare"],[82.5675,100,"melody"],[82.615,53,"melody"],[82.695,30,"snare"],[82.7975,21,"snare"],[82.8325,19,"melody"],[82.9025,33,"kick"],[82.985,31,"kick"],[83.1075,54,"melody"],[83.1925,36,"snare"],[83.28,32,"snare"],[83.37,36,"snare"],[83.445,29,"snare"],[83.5175,31,"snare"],[83.6325,48,"snare"],[83.75,38,"melody"],[83.9125,24,"kick"],[84.0075,22,"kick"],[84.1625,100,"melody"],[84.235,58,"melody"],[84.4175,49,"melody"],[84.5375,69,"kick"]]},"fast":{"src":"music/alley-cat-round-fast.mp3","segments":[[0,16.991156,1],[16.991156,33.982313,1],[33.982313,50.011701,1.06],[50.011701,65.182381,1.12],[65.182381,80.353061,1.12],[80.353061,85,1.12]],"accents":[[0.625,25,"snare"],[0.69,22,"snare"],[0.8,64,"snare"],[0.955,50,"melody"],[1.05,39,"kick"],[1.185,25,"kick"],[1.2625,40,"meow"],[1.595,100,"snare"],[1.8675,43,"kick"],[1.905,33,"kick"],[2.0075,25,"snare"],[2.0825,30,"snare"],[2.15,44,"snare"],[2.24,31,"snare"],[2.3,26,"snare"],[2.35,32,"snare"],[2.435,25,"snare"],[2.5325,28,"snare"],[2.66,69,"snare"],[2.74,17,"melody"],[2.925,61,"melody"],[3.0175,47,"kick"],[3.0775,41,"melody"],[3.19,32,"snare"],[3.315,23,"snare"],[3.575,16,"melody"],[3.7075,89,"snare"],[3.8625,34,"snare"],[3.9575,30,"snare"],[3.9925,57,"snare"],[4.15,19,"snare"],[4.205,29,"snare"],[4.285,37,"melody"],[4.3375,24,"snare"],[4.3875,31,"snare"],[4.485,36,"snare"],[4.63,17,"kick"],[4.77,42,"snare"],[5.0475,100,"snare"],[5.2025,31,"kick"],[5.2675,43,"kick"],[5.3,60,"melody"],[5.335,35,"kick"],[5.3975,22,"melody"],[5.59,22,"melody"],[5.8425,100,"snare"],[6.1075,100,"melody"],[6.155,56,"snare"],[6.235,30,"snare"],[6.3375,26,"snare"],[6.3975,40,"snare"],[6.4625,34,"snare"],[6.55,34,"snare"],[6.635,35,"snare"],[6.7325,34,"melody"],[6.8175,38,"snare"],[6.8525,38,"kick"],[6.8925,25,"snare"],[7.17,100,"snare"],[7.2975,36,"snare"],[7.345,28,"snare"],[7.4425,36,"snare"],[7.7025,100,"melody"],[7.7975,42,"kick"],[7.8575,42,"snare"],[7.955,43,"snare"],[7.99,35,"kick"],[8.1225,40,"snare"],[8.1825,42,"melody"],[8.2675,51,"kick"],[8.385,47,"snare"],[8.475,38,"snare"],[8.505,33,"snare"],[8.545,23,"snare"],[8.605,31,"snare"],[8.64,20,"melody"],[8.675,16,"melody"],[8.7225,29,"melody"],[8.7875,29,"kick"],[9.02,100,"melody"],[9.295,59,"snare"],[9.3975,36,"snare"],[9.47,21,"melody"],[9.515,24,"melody"],[9.5825,27,"snare"],[9.6875,35,"snare"],[9.7975,37,"melody"],[9.8675,39,"melody"],[9.9125,23,"melody"],[9.9475,34,"melody"],[10.09,87,"snare"],[10.195,24,"melody"],[10.265,28,"snare"],[10.31,20,"snare"],[10.3875,49,"melody"],[10.6675,38,"melody"],[10.755,25,"snare"],[10.79,38,"meow"],[10.8375,44,"meow"],[10.895,26,"snare"],[10.9675,24,"melody"],[11.005,30,"snare"],[11.1075,24,"melody"],[11.2675,22,"snare"],[11.33,81,"meow"],[11.3975,50,"meow"],[11.435,20,"kick"],[11.51,17,"kick"],[11.55,18,"melody"],[11.605,23,"kick"],[11.685,83,"snare"],[11.9475,16,"melody"],[11.9875,28,"melody"],[12.0825,25,"snare"],[12.1725,18,"snare"],[12.26,19,"melody"],[12.295,22,"melody"],[12.3425,22,"snare"],[12.5175,30,"kick"],[12.6075,27,"snare"],[12.655,29,"snare"],[12.7225,22,"snare"],[12.7775,40,"melody"],[12.8325,26,"snare"],[12.8825,27,"snare"],[12.98,29,"snare"],[13.0175,27,"snare"],[13.15,18,"kick"],[13.285,28,"snare"],[13.4425,39,"snare"],[13.5425,100,"meow"],[13.5925,52,"meow"],[13.64,30,"kick"],[13.8025,29,"melody"],[13.9175,19,"melody"],[14.34,100,"snare"],[14.6025,100,"melody"],[14.65,53,"melody"],[14.7375,30,"snare"],[14.8325,21,"snare"],[14.8675,19,"melody"],[14.9125,33,"kick"],[14.96,31,"snare"],[15.02,31,"kick"],[15.1425,54,"melody"],[15.225,36,"snare"],[15.2775,29,"snare"],[15.315,32,"snare"],[15.395,36,"snare"],[15.4925,29,"snare"],[15.565,31,"snare"],[15.675,48,"snare"],[15.7875,38,"melody"],[15.9225,24,"kick"],[16.0425,22,"kick"],[16.1975,100,"melody"],[16.295,58,"melody"],[16.455,49,"melody"],[16.575,69,"kick"],[16.7575,64,"melody"],[16.875,36,"snare"],[17.03,29,"snare"],[17.09,33,"snare"],[17.1375,36,"snare"],[17.2475,28,"snare"],[17.4125,37,"snare"],[17.4975,33,"snare"],[17.6325,25,"snare"],[17.665,22,"snare"],[17.79,64,"snare"],[17.945,50,"melody"],[18.0425,39,"kick"],[18.1625,25,"kick"],[18.2175,40,"meow"],[18.5875,100,"snare"],[18.86,43,"kick"],[18.895,33,"kick"],[18.9775,25,"snare"],[19.06,30,"snare"],[19.1525,44,"snare"],[19.2325,31,"snare"],[19.2975,26,"snare"],[19.3775,32,"snare"],[19.415,25,"snare"],[19.56,28,"snare"],[19.65,69,"snare"],[19.9175,61,"melody"],[20.01,47,"kick"],[20.07,41,"melody"],[20.165,32,"snare"],[20.27,23,"snare"],[20.7,89,"snare"],[20.8875,34,"snare"],[20.9825,57,"snare"],[21.175,29,"snare"],[21.2625,37,"melody"],[21.33,24,"snare"],[21.39,31,"snare"],[21.4275,36,"snare"],[21.5975,17,"kick"],[21.7625,42,"snare"],[22.0375,100,"snare"],[22.195,31,"kick"],[22.2925,60,"melody"],[22.325,35,"kick"],[22.355,22,"melody"],[22.58,22,"melody"],[22.835,100,"snare"],[23.1,100,"melody"],[23.145,56,"snare"],[23.2125,30,"snare"],[23.315,26,"snare"],[23.39,40,"snare"],[23.455,34,"snare"],[23.51,34,"snare"],[23.6375,35,"snare"],[23.735,34,"melody"],[23.8425,38,"kick"],[23.89,25,"snare"],[24.16,100,"snare"],[24.2575,36,"snare"],[24.3375,28,"snare"],[24.3975,36,"snare"],[24.6925,100,"melody"],[24.8175,42,"kick"],[24.8575,42,"snare"],[24.9475,43,"snare"],[24.9825,35,"kick"],[25.1125,40,"snare"],[25.1975,42,"melody"],[25.2675,51,"kick"],[25.3375,47,"snare"],[25.4975,38,"snare"],[25.5375,23,"snare"],[25.605,31,"snare"],[25.645,20,"melody"],[25.705,29,"melody"],[25.7775,29,"kick"],[26.01,100,"melody"],[26.285,59,"snare"],[26.3825,36,"snare"],[26.46,21,"melody"],[26.55,27,"snare"],[26.725,35,"snare"],[26.7875,37,"melody"],[26.8575,39,"melody"],[26.905,23,"melody"],[26.9375,34,"melody"],[27.08,87,"snare"],[27.1875,24,"melody"],[27.255,28,"snare"],[27.36,49,"melody"],[27.6375,38,"melody"],[27.74,25,"snare"],[27.7875,38,"meow"],[27.8225,44,"meow"],[27.8875,26,"snare"],[27.9575,24,"melody"],[28.02,30,"snare"],[28.0775,24,"melody"],[28.245,22,"snare"],[28.3225,81,"meow"],[28.3875,50,"meow"],[28.4475,20,"kick"],[28.4875,17,"kick"],[28.5275,18,"melody"],[28.5625,23,"kick"],[28.675,83,"snare"],[28.9525,16,"melody"],[28.9875,28,"melody"],[29.0475,25,"snare"],[29.195,18,"snare"],[29.2925,22,"melody"],[29.3275,22,"snare"],[29.5175,30,"kick"],[29.5975,29,"snare"],[29.7675,40,"melody"],[29.825,26,"snare"],[29.88,27,"snare"],[29.96,29,"snare"],[30.045,27,"snare"],[30.105,18,"kick"],[30.2775,28,"snare"],[30.385,24,"melody"],[30.4325,39,"snare"],[30.5325,100,"meow"],[30.6075,52,"meow"],[30.7475,29,"melody"],[30.8875,19,"melody"],[31.33,100,"snare"],[31.595,100,"melody"],[31.7225,30,"snare"],[31.81,21,"snare"],[31.865,19,"melody"],[31.905,33,"kick"],[31.9775,31,"snare"],[32.025,31,"kick"],[32.1325,54,"melody"],[32.22,36,"snare"],[32.27,29,"snare"],[32.305,32,"snare"],[32.3625,36,"snare"],[32.52,31,"snare"],[32.665,48,"snare"],[32.7525,38,"melody"],[32.915,24,"kick"],[33.0575,22,"kick"],[33.1875,100,"melody"],[33.31,58,"melody"],[33.445,49,"melody"],[33.59,69,"kick"],[33.7675,64,"melody"],[33.8525,36,"snare"],[34.025,29,"snare"],[34.0725,33,"snare"],[34.1275,36,"snare"],[34.2075,28,"snare"],[34.28,27,"snare"],[34.365,37,"snare"],[34.45,33,"snare"],[34.585,25,"snare"],[34.6375,22,"snare"],[34.74,64,"snare"],[34.8925,50,"melody"],[34.985,39,"kick"],[35.0775,25,"kick"],[35.1275,40,"meow"],[35.4975,100,"snare"],[35.7825,43,"kick"],[35.8625,25,"snare"],[35.9175,30,"snare"],[36.01,44,"snare"],[36.1025,31,"snare"],[36.1875,32,"snare"],[36.2475,25,"snare"],[36.3575,28,"snare"],[36.4975,69,"snare"],[36.5775,17,"melody"],[36.7425,61,"melody"],[36.835,47,"kick"],[36.895,41,"melody"],[36.985,32,"snare"],[37.135,23,"snare"],[37.4875,89,"snare"],[37.6275,34,"snare"],[37.75,57,"snare"],[37.8825,19,"snare"],[37.95,29,"snare"],[38.0175,37,"melody"],[38.0825,31,"snare"],[38.2175,36,"snare"],[38.3375,17,"kick"],[38.49,42,"snare"],[38.745,100,"snare"],[38.9,31,"kick"],[38.99,60,"melody"],[39.05,22,"melody"],[39.2675,22,"melody"],[39.49,100,"snare"],[39.745,100,"melody"],[39.7925,56,"snare"],[39.9,30,"snare"],[39.955,26,"snare"],[40.0225,40,"snare"],[40.075,34,"snare"],[40.165,34,"snare"],[40.295,35,"snare"],[40.3325,34,"melody"],[40.4175,38,"kick"],[40.4875,25,"snare"],[40.745,100,"snare"],[40.83,36,"snare"],[40.92,28,"snare"],[40.9675,36,"snare"],[41.255,100,"melody"],[41.35,42,"kick"],[41.42,42,"snare"],[41.5025,43,"snare"],[41.5975,40,"snare"],[41.73,42,"melody"],[41.8,51,"kick"],[41.8575,47,"snare"],[41.96,38,"snare"],[42.01,33,"snare"],[42.055,23,"snare"],[42.1425,31,"snare"],[42.21,29,"melody"],[42.2825,29,"kick"],[42.5025,100,"melody"],[42.7475,59,"snare"],[42.85,36,"snare"],[42.915,21,"melody"],[42.96,24,"melody"],[43.035,27,"snare"],[43.09,35,"snare"],[43.235,37,"melody"],[43.305,39,"melody"],[43.3525,34,"melody"],[43.51,87,"snare"],[43.6125,24,"melody"],[43.6675,28,"snare"],[43.7825,49,"melody"],[44.035,38,"melody"],[44.1225,25,"snare"],[44.165,38,"meow"],[44.21,44,"meow"],[44.27,26,"snare"],[44.3425,30,"snare"],[44.4475,24,"melody"],[44.6375,22,"snare"],[44.6775,81,"meow"],[44.745,50,"meow"],[44.7825,20,"kick"],[44.83,17,"kick"],[44.87,18,"melody"],[44.905,23,"kick"],[45.005,83,"snare"],[45.2925,28,"melody"],[45.3875,25,"snare"],[45.4625,18,"snare"],[45.59,22,"melody"],[45.6325,22,"snare"],[45.8,30,"kick"],[45.8875,29,"snare"],[46.0425,40,"melody"],[46.1375,27,"snare"],[46.235,29,"snare"],[46.3925,18,"kick"],[46.5275,28,"snare"],[46.635,24,"melody"],[46.6725,39,"snare"],[46.76,100,"meow"],[46.8575,30,"kick"],[47.015,29,"melody"],[47.085,19,"melody"],[47.5225,100,"snare"],[47.7575,100,"melody"],[47.805,53,"melody"],[47.885,30,"snare"],[47.9875,21,"snare"],[48.055,33,"kick"],[48.125,31,"snare"],[48.27,54,"melody"],[48.345,36,"snare"],[48.395,29,"snare"],[48.4275,32,"snare"],[48.5225,36,"snare"],[48.585,29,"snare"],[48.6575,31,"snare"],[48.7775,48,"snare"],[48.89,38,"melody"],[49.04,24,"kick"],[49.13,22,"kick"],[49.27,100,"melody"],[49.3675,58,"melody"],[49.515,49,"melody"],[49.61,69,"kick"],[49.82,64,"melody"],[49.9175,36,"snare"],[50.0425,29,"snare"],[50.1,33,"snare"],[50.15,36,"snare"],[50.2175,28,"snare"],[50.3025,27,"snare"],[50.3875,37,"snare"],[50.4825,33,"snare"],[50.56,25,"snare"],[50.62,22,"snare"],[50.725,64,"snare"],[50.88,50,"melody"],[50.98,39,"kick"],[51.0475,25,"kick"],[51.0975,40,"meow"],[51.43,100,"snare"],[51.7175,43,"kick"],[51.8075,25,"snare"],[51.855,30,"snare"],[51.9475,44,"snare"],[52.015,31,"snare"],[52.1,32,"snare"],[52.185,25,"snare"],[52.2575,28,"snare"],[52.385,69,"snare"],[52.625,61,"melody"],[52.7175,47,"kick"],[52.855,32,"snare"],[52.9375,23,"snare"],[53.325,89,"snare"],[53.48,34,"snare"],[53.575,57,"snare"],[53.72,19,"snare"],[53.775,29,"snare"],[53.8275,37,"melody"],[53.98,36,"snare"],[54.1375,17,"kick"],[54.2675,42,"snare"],[54.5225,100,"snare"],[54.6675,31,"kick"],[54.7525,60,"melody"],[55.0125,22,"melody"],[55.2425,100,"snare"],[55.4725,100,"melody"],[55.5975,30,"snare"],[55.6525,26,"snare"],[55.7325,40,"snare"],[55.785,34,"snare"],[55.8625,34,"snare"],[55.945,32,"melody"],[55.98,35,"snare"],[56.1025,38,"snare"],[56.1375,38,"kick"],[56.1725,25,"snare"],[56.42,100,"snare"],[56.5025,36,"snare"],[56.5825,28,"snare"],[56.665,36,"snare"],[56.89,100,"melody"],[57.045,42,"snare"],[57.1,43,"snare"],[57.155,35,"kick"],[57.25,40,"snare"],[57.3225,42,"melody"],[57.3975,51,"kick"],[57.5,47,"snare"],[57.59,38,"snare"],[57.6475,23,"snare"],[57.715,31,"snare"],[57.8025,29,"melody"],[57.86,29,"kick"],[58.0775,100,"melody"],[58.31,59,"snare"],[58.4125,36,"snare"],[58.47,24,"melody"],[58.57,27,"snare"],[58.7075,35,"snare"],[58.77,37,"melody"],[58.8275,39,"melody"],[58.8725,23,"melody"],[58.9075,34,"melody"],[59.0275,87,"snare"],[59.1275,24,"melody"],[59.1825,28,"snare"],[59.2925,49,"melody"],[59.54,38,"melody"],[59.6075,38,"meow"],[59.69,44,"meow"],[59.7425,26,"snare"],[59.8,24,"melody"],[59.8475,30,"snare"],[59.9175,24,"melody"],[60.09,22,"snare"],[60.1325,81,"meow"],[60.1975,50,"meow"],[60.235,20,"kick"],[60.2825,18,"melody"],[60.3775,23,"kick"],[60.445,83,"snare"],[60.68,16,"melody"],[60.725,28,"melody"],[60.785,25,"snare"],[60.905,18,"snare"],[61.0025,22,"melody"],[61.195,30,"kick"],[61.285,29,"snare"],[61.36,22,"snare"],[61.4275,40,"melody"],[61.4775,27,"snare"],[61.595,29,"snare"],[61.655,27,"snare"],[61.7275,18,"kick"],[61.875,28,"snare"],[62.0325,39,"snare"],[62.1075,100,"meow"],[62.1575,52,"meow"],[62.205,30,"kick"],[62.345,29,"melody"],[62.4325,19,"melody"],[62.81,100,"snare"],[63.045,100,"melody"],[63.1725,30,"snare"],[63.26,21,"snare"],[63.3075,19,"melody"],[63.34,33,"kick"],[63.375,31,"snare"],[63.4475,31,"kick"],[63.5325,54,"melody"],[63.6075,36,"snare"],[63.6575,32,"snare"],[63.7375,36,"snare"],[63.8825,31,"snare"],[64.015,48,"snare"],[64.115,38,"melody"],[64.2775,24,"kick"],[64.3725,22,"kick"],[64.485,100,"melody"],[64.57,58,"melody"],[64.7175,49,"melody"],[64.825,69,"kick"],[64.955,64,"melody"],[65.0675,36,"snare"],[65.225,29,"snare"],[65.27,33,"snare"],[65.32,36,"snare"],[65.425,28,"snare"],[65.4975,37,"snare"],[65.6425,33,"snare"],[65.75,25,"snare"],[65.895,64,"snare"],[66.075,50,"melody"],[66.13,39,"kick"],[66.245,25,"kick"],[66.6,100,"snare"],[66.8525,43,"kick"],[66.9575,25,"snare"],[67.04,30,"snare"],[67.1075,44,"snare"],[67.185,31,"snare"],[67.235,26,"snare"],[67.2825,32,"snare"],[67.3675,25,"snare"],[67.465,28,"snare"],[67.5575,69,"snare"],[67.6375,17,"melody"],[67.7975,61,"melody"],[67.8875,47,"kick"],[67.9725,41,"melody"],[68.0375,32,"snare"],[68.14,23,"snare"],[68.495,89,"snare"],[68.61,34,"snare"],[68.745,57,"snare"],[68.865,19,"snare"],[68.945,29,"snare"],[69,37,"melody"],[69.095,31,"snare"],[69.15,36,"snare"],[69.3075,17,"kick"],[69.4475,42,"snare"],[69.6925,100,"snare"],[69.8375,31,"kick"],[69.925,60,"melody"],[69.9575,35,"kick"],[70.1825,22,"melody"],[70.4125,100,"snare"],[70.6425,100,"melody"],[70.6875,56,"snare"],[70.755,30,"snare"],[70.8575,26,"snare"],[70.9025,40,"snare"],[70.9575,34,"snare"],[71.03,34,"snare"],[71.115,35,"snare"],[71.1875,34,"melody"],[71.3075,38,"kick"],[71.355,25,"snare"],[71.59,100,"snare"],[71.705,36,"snare"],[71.7475,28,"snare"],[71.8375,36,"snare"],[72.0625,100,"melody"],[72.1575,42,"kick"],[72.205,42,"snare"],[72.325,43,"snare"],[72.455,40,"snare"],[72.4925,42,"melody"],[72.575,51,"kick"],[72.645,47,"snare"],[72.735,38,"snare"],[72.7725,33,"snare"],[72.8175,23,"snare"],[72.8725,31,"snare"],[72.9725,29,"melody"],[73.0325,29,"kick"],[73.2475,100,"melody"],[73.48,59,"snare"],[73.585,36,"snare"],[73.635,21,"melody"],[73.6675,24,"melody"],[73.74,27,"snare"],[73.87,35,"snare"],[73.945,37,"melody"],[73.9975,39,"melody"],[74.045,34,"melody"],[74.1975,87,"snare"],[74.2625,24,"melody"],[74.3525,28,"snare"],[74.445,49,"melody"],[74.69,38,"melody"],[74.82,38,"meow"],[74.8675,44,"meow"],[74.9125,26,"snare"],[74.9825,30,"snare"],[75.11,24,"melody"],[75.2425,22,"snare"],[75.3025,81,"meow"],[75.3675,50,"meow"],[75.4525,17,"kick"],[75.5075,23,"kick"],[75.615,83,"snare"],[75.8875,28,"melody"],[75.955,25,"snare"],[76.0175,18,"snare"],[76.1,19,"melody"],[76.1675,22,"melody"],[76.375,30,"kick"],[76.4625,29,"snare"],[76.545,22,"snare"],[76.5975,40,"melody"],[76.6975,27,"snare"],[76.7775,29,"snare"],[76.9225,18,"kick"],[77.045,28,"snare"],[77.19,39,"snare"],[77.2775,100,"meow"],[77.3275,52,"meow"],[77.515,29,"melody"],[77.6025,19,"melody"],[77.9825,100,"snare"],[78.215,100,"melody"],[78.2625,53,"melody"],[78.39,30,"snare"],[78.425,21,"snare"],[78.51,33,"kick"],[78.6075,31,"kick"],[78.705,54,"melody"],[78.7775,36,"snare"],[78.8275,29,"snare"],[78.8625,32,"snare"],[78.9125,36,"snare"],[79.005,29,"snare"],[79.0775,31,"snare"],[79.18,48,"snare"],[79.2875,38,"melody"],[79.4475,24,"kick"],[79.5175,22,"kick"],[79.655,100,"melody"],[79.74,58,"melody"],[79.8875,49,"melody"],[79.97,69,"kick"],[80.125,64,"melody"],[80.2375,36,"snare"],[80.395,29,"snare"],[80.4375,33,"snare"],[80.5225,36,"snare"],[80.6,27,"snare"],[80.68,37,"snare"],[80.825,33,"snare"],[80.925,25,"snare"],[80.9775,22,"snare"],[81.0675,64,"snare"],[81.2225,50,"melody"],[81.3,39,"kick"],[81.4525,40,"meow"],[81.7725,100,"snare"],[82.0225,43,"kick"],[82.06,33,"kick"],[82.1275,25,"snare"],[82.21,30,"snare"],[82.2775,44,"snare"],[82.3675,31,"snare"],[82.41,26,"snare"],[82.49,32,"snare"],[82.5425,25,"snare"],[82.575,28,"snare"],[82.7275,69,"snare"],[82.8075,17,"melody"],[82.9675,61,"melody"],[83.06,47,"kick"],[83.195,32,"snare"],[83.2925,23,"snare"],[83.5475,16,"melody"],[83.6675,89,"snare"],[83.835,34,"snare"],[83.8825,30,"snare"],[83.9175,57,"snare"],[84.0225,19,"snare"],[84.095,29,"snare"],[84.1825,37,"melody"],[84.2725,31,"snare"],[84.3575,36,"snare"],[84.5275,17,"kick"]]}}};
const DN_AUTHORED={"steady":[[0.543,0,0],[1.101,3,0],[2.68,0,0],[5.861,0,0],[7.207,0,0],[7.742,3,0],[8.531,0,0],[9.042,2,0],[9.599,3,0],[10.11,0,0],[11.178,1,0],[11.712,2,0],[13.291,1,0],[14.359,2,0],[15.706,3,0],[16.24,0,0],[17.03,1,0],[17.54,2,0],[18.608,0,0],[19.677,0,0],[20.211,3,0],[20.721,1,0],[21.79,1,0],[22.858,3,0],[24.971,3,0],[26.039,2,0],[27.107,3,0],[28.175,0,0],[28.709,1,0],[29.22,1,0],[30.288,1,0],[31.356,2,0],[32.703,3,0],[33.469,3,0],[34.537,3,0],[35.071,0,0],[35.605,0,0],[36.14,1,0],[36.674,2,0],[37.208,3,0],[37.719,1,0],[38.787,1,0],[39.855,3,1],[41.968,3,0],[43.036,2,1],[44.104,3,0],[44.638,1,0],[45.172,1,0],[46.217,1,0],[47.564,2,0],[48.353,2,1],[50.211,2,0],[52.068,3,0],[52.602,0,1],[53.137,1,0],[54.716,1,0],[56.852,3,1],[58.175,0,0],[58.709,3,0],[59.499,0,0],[60.567,1,0],[61.101,2,0],[63.214,2,0],[64.561,2,0],[65.606,3,0],[66.674,3,0],[67.208,0,0],[67.997,1,0],[68.508,2,0],[69.065,3,0],[70.644,0,0],[73.826,0,0],[75.172,0,0],[75.706,3,0],[76.496,0,0],[77.007,2,0],[77.564,3,0],[78.075,0,0],[79.143,1,0],[79.677,2,0],[81.256,1,0],[82.324,2,0],[83.671,3,0],[84.205,3,0],[84.994,1,0]],"fast":[[0.543,0,0],[1.101,3,0],[2.68,0,0],[5.861,0,0],[7.207,0,0],[7.742,3,0],[8.531,0,0],[9.042,2,0],[10.11,3,0],[11.178,0,0],[11.712,1,0],[13.291,1,0],[14.359,2,0],[15.706,3,0],[16.24,0,0],[17.03,1,0],[17.54,2,0],[18.608,0,0],[19.677,0,0],[20.211,3,0],[20.721,1,0],[21.79,1,0],[22.858,3,0],[24.971,3,0],[26.039,2,1],[27.107,3,0],[28.175,0,0],[28.709,1,0],[29.22,1,0],[30.288,1,0],[31.356,2,1],[32.703,3,0],[33.469,3,0],[34.514,3,0],[35.025,0,0],[36.023,1,0],[37.51,1,0],[38.787,3,0],[39.785,0,0],[40.784,0,0],[41.527,0,0],[42.037,0,0],[42.525,2,0],[43.547,3,0],[44.545,0,0],[45.033,1,0],[45.52,1,0],[46.542,1,0],[47.541,2,0],[49.305,2,0],[50.048,1,0],[50.513,2,0],[51,0,0],[51.465,0,1],[52.417,0,0],[52.904,3,0],[54.298,1,0],[55.273,3,1],[56.457,0,0],[57.154,0,0],[58.106,2,1],[59.058,3,0],[60.474,0,0],[60.938,1,0],[61.89,1,0],[62.842,2,1],[64.05,2,0],[64.514,2,0],[65.675,0,0],[66.627,0,0],[67.579,0,0],[68.067,3,0],[68.531,1,0],[70.435,3,0],[71.62,0,0],[72.316,0,0],[72.804,0,0],[73.268,2,0],[73.756,3,0],[74.22,0,0],[75.172,1,0],[77.053,1,0],[78.005,2,0],[79.213,2,0],[81.349,3,0],[83.694,1,0],[84.901,3,0]]};
/* END DANCE SOURCES */
const DANCE={on:false,mine:null,ask:null,said:new Set(),card:null,t:0,s:0,r:'',pat:null,partner:null,partnerNm:'',left:1,sc:0,osc:0,bar:.5,mvT:0,mvK:-1,floor:null,cam:null,me:null,hud:null,arrows:[],ended:0,res:null,lastHit:-1,pats:new Map(),gone:0,tg:null,dt:0,serial:0,beat:false,bot:null,style:null,combo:0,first:0};
const DN_N=20,DN_LEAD=1.6,DN_WIN=.28,DN_T0=2.0,DN_GAP=1.15,DN_NAMES=['⬅️','⬇️','⬆️','➡️'],DN_COL=['#ff7aa8','#7cc8ff','#7fdcb5','#ffd45c'],DN_ROT=[270,180,0,90];
function dnArrow(d,sz){return '<svg viewBox="0 0 48 48" width="'+sz+'" height="'+sz+'" aria-hidden="true"><path d="M24 5 L43 26 H32 V43 H16 V26 H5 Z" fill="'+DN_COL[d]+'" stroke="#3d2c5e" stroke-width="3.5" stroke-linejoin="round" transform="rotate('+DN_ROT[d]+' 24 24)"/></svg>';}   /* 🕺 big drawn arrows, one colour per column, the same on every device (run 4, stage 3: the emoji arrows were small grey glyphs without a colour emoji font) */
function dnHash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function dnClassic(r){const q=seeded(dnHash(String(r))),out=[];for(let i=0;i<DN_N;i++)out.push({t:DN_T0+i*DN_GAP,d:(q()*4)|0,j:0});return out;}
function dnPattern(r){let p=DANCE.pats.get(r);if(p)return p;p=dnClassic(r);if(DANCE.pats.size>=64)DANCE.pats.delete(DANCE.pats.keys().next().value);DANCE.pats.set(r,p);return p;}
const DN_BEAT_BUILD=2026112506,DN_BEAT_PREFIX='beat1-',DN_FX_BUILD=2026112507,DN_FX_PREFIX='beat2-';
const DN_LOOP_BUILD=2026112508,DN_FAST_PREFIX='beat3s-',DN_STEADY_PREFIX='beat3n-';
const DN_CHART_BUILD=2026112601,DN_AUTHORED_FAST='beat4s-',DN_AUTHORED_STEADY='beat4n-';
const DN_PITCH=typeof HTMLMediaElement!=='undefined'&&
  ('preservesPitch' in HTMLMediaElement.prototype?'preservesPitch':
    'webkitPreservesPitch' in HTMLMediaElement.prototype?'webkitPreservesPitch':'');
function dnProfile(r){
  if(typeof r!=='string')return null;
  if(r.startsWith(DN_FAST_PREFIX)||r.startsWith(DN_AUTHORED_FAST))return DN_LOOP.profiles.fast;
  return r.startsWith(DN_STEADY_PREFIX)||r.startsWith(DN_AUTHORED_STEADY)?DN_LOOP.profiles.steady:null;
}
const dnOnBeat=r=>typeof r==='string'&&(r.startsWith(DN_BEAT_PREFIX)||r.startsWith(DN_FX_PREFIX)||!!dnProfile(r));
function dnRoundId(a,pitch=!!DN_PITCH){
  const base=realMs().toString(36)+'-'+dnHash(MP.me).toString(36)+'-'+(++DANCE.serial);
  if(!(a.v>=DN_BEAT_BUILD))return base;
  // Older spectators can still index the 20-arrow classic chart to read a move.
  const fast=pitch&&a.dp;
  const prefix=a.v>=DN_CHART_BUILD?(fast?DN_AUTHORED_FAST:DN_AUTHORED_STEADY):
    a.v>=DN_LOOP_BUILD?(fast?DN_FAST_PREFIX:DN_STEADY_PREFIX):a.v>=DN_FX_BUILD?DN_FX_PREFIX:DN_BEAT_PREFIX;
  let r=prefix+base,n=0;
  while(new Set(dnClassic(r).map(note=>note.d)).size<4)r=prefix+base+'-'+(++n);
  return r;
}
function dnBeatAt(t,profile){
  if(!profile)return (t-DN_TRACK.firstBeat)/DN_PERIOD;
  const parts=profile.segments;
  let i=parts.length-1;
  while(i>0&&t<parts[i][0])i--;
  const part=parts[i];
  return i*DN_LOOP.beats+((t-part[0])*part[2]-DN_LOOP.firstBeat)*DN_LOOP.bpm/60;
}
function dnAccents(profile,seed){
  const random=DanceChart.seeded(seed^0x7b31d),out=[];
  let previous=-.2,lastDouble=-4,slot=-1,choices=[];
  function flush(){
    if(!choices.length)return;
    choices.sort((a,b)=>b.rank-a.rank);
    const first=choices[0],run=random()<.37;
    let second=null,rank=-Infinity;
    for(const candidate of choices){
      const gap=Math.abs(candidate.at-first.at);
      if(gap<.124)continue;
      const priority=candidate.rank+(run&&gap<.31?30:0);
      if(priority>rank){second=candidate;rank=priority;}
    }
    const selected=second&&second.power>=20?[first,second].sort((a,b)=>a.at-b.at):[first];
    for(const note of selected){
      if(note.at-previous<.122)continue;
      const lane=out.length?(out[out.length-1].lane+1+Math.floor(random()*3))%4:Math.floor(random()*4);
      out.push({time:note.at,lane,kind:note.kind});previous=note.at;
      if(note.power>=86&&note.at-lastDouble>3.15&&random()<.16){
        out.push({time:note.at,lane:(lane+2)%4,kind:note.kind});
        lastDouble=note.at;
      }
    }
    choices=[];
  }
  for(const [at,power,kind] of profile.accents){
    const bucket=Math.floor(dnBeatAt(at,profile)/2);
    if(bucket!==slot){flush();slot=bucket;}
    choices.push({at,power,kind,rank:power+(kind==='meow'?39:kind==='kick'?6:0)+random()*45});
  }
  flush();
  return out;
}
function dnChartRows(r){
  return r.startsWith(DN_AUTHORED_FAST)?DN_AUTHORED.fast:r.startsWith(DN_AUTHORED_STEADY)?DN_AUTHORED.steady:null;
}
function dnChart(r){
  if(!dnOnBeat(r))return dnPattern(r);
  const classic=dnPattern(r),seed=DanceChart.seedFor(r),style=dnStyle(r),profile=dnProfile(r);
  const starts=seed>>>10,seen=[0,0,0,0];
  const chart=dnChartRows(r);
  // Chart timestamps and dnClock are both relative to the end of the MP3 preroll.
  const notes=chart?chart.flatMap(([time,lane,double])=>double?[{time,lane},{time,lane:3-lane}]:[{time,lane}]):
    profile?dnAccents(profile,seed):DanceChart.makeChart(DN_TRACK,3,seed);
  return notes.map((note,i)=>{
    const d=note.lane;
    let move=i%DN_N;
    for(let n=0;n<DN_N;n++,move=(move+1)%DN_N)if(classic[move].d===d)break;
    const variant=style?style.moves[d][((starts>>>d)+seen[d]++)&1]:d;
    return {t:note.time,d,move,variant,kind:note.kind};
  });
}
/* Only Funky is playable in this slice. The catalogue groups the remaining songs for later rounds. */
const DN_TYPES={
  'alley-cat':'Funky','crushing-it':'Funky','hella-bumps':'Funky',
  'heart-shaped':'Sweet','piecemeal':'Sweet',
  'talking-cute':'Pixel','dance-field':'Pixel','penguin-town':'Pixel',
  'cloak-of-darkness':'Mystery','ludum-dare-30-04':'Mystery','never-miss':'Fast'
};
const DN_STYLES={
  Funky:{moves:[[4,5],[6,7],[8,9],[10,11]],arrow:'funky',spark:['#ff7aa8','#7cc8ff','#7fdcb5','#ffd45c'],
    perfect:'#ffe192',lights:['#ff76ac','#64e7d7']}
};
const DN_PERIOD=60/DN_TRACK.bpm;
const DN_REDUCED=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)');
const DN_COARSE=window.matchMedia&&window.matchMedia('(pointer:coarse)');
const DN_KEYS={ArrowLeft:0,ArrowDown:1,ArrowUp:2,ArrowRight:3,KeyD:0,KeyF:1,KeyJ:2,KeyK:3};
function dnCalm(){return SET.danceCalm===true||!!DN_REDUCED?.matches;}
const dnStyle=r=>typeof r==='string'&&(r.startsWith(DN_FX_PREFIX)||dnProfile(r))?DN_STYLES[DN_TYPES[DN_TRACK.id]]:null;
function dnMoveKind(variant,combo){return combo===10?13:combo===5?12:variant;}
function dnMoveTime(k){return k===13?1.03:k===12?.79:.58;}
function dnRememberMove(wire,note,index,combo,time,profile,chart){
  wire.mv=note.move;
  // A busy run still scores every arrow while a dancer finishes the phrase.
  // A combo milestone can take over immediately on its own musical accent.
  if(combo!==5&&combo!==10&&Number.isFinite(wire.at)){
    const start=wire.at/1000;
    if(profile){
      const k=dnMoveKind(chart[wire.m].variant,wire.c);
      if(dnBeatAt(note.t,profile)-dnBeatAt(start,profile)<DN_PHRASE_BEATS[k-4])return;
    }else if((wire.c===5||wire.c===10)&&time-start<dnMoveTime(dnMoveKind(4,wire.c)))return;
  }
  wire.m=index;wire.c=combo;wire.at=Math.round((profile?note.t:time)*1000);
}

/* Funky moves work on the same limbs the classic dance uses. t is the shared
   playback position; countdown and missed notes leave the dancer step-touching. */
function dnFunkyPoseLegacy(p,k,u,t){
  const b=p.b,l=p.legs[0],r=p.legs[1],a=p.arms[0],z=p.arms[1];
  const beat=(Math.max(0,t)-DN_TRACK.firstBeat)/DN_PERIOD;
  const side=Math.sin(beat*Math.PI),bounce=Math.abs(Math.sin(beat*Math.PI*2));
  b.position.x=.11*side;b.position.y=.027*bounce;b.rotation.set(.02,.12*side,-.12*side);
  p.head.rotation.set(0,0,.10*side);
  a.rotation.set(-.28*side,0,-.51-.26*side);z.rotation.set(.28*side,0,.51-.26*side);
  l.position.y=.62;r.position.y=.62;
  l.rotation.set(-.29*Math.max(0,side),-.12,-.16*Math.max(0,-side));
  r.rotation.set(.29*Math.min(0,side),.12,.16*Math.max(0,side));
  if(k<4)return;
  const s=Math.sin(Math.PI*u),wave=Math.sin(Math.PI*2*u),calm=DN_REDUCED&&DN_REDUCED.matches;
  switch(k){
    case 4: // Point up and pop the opposite hip.
      b.position.x-=.18*s;b.rotation.z=.26*s;p.head.rotation.z=.25*s;
      a.rotation.set(-.28*s,0,-2.67*s-.25);z.rotation.set(-.75*s,0,.70*s+.26);r.rotation.z=.31*s;break;
    case 5: // Turn on the spot with one foot tucked.
      b.rotation.y=(calm?1.5:Math.PI*2)*u*u*(3-2*u);b.position.y=.09*s;
      a.rotation.z=-1.28*s-.4;z.rotation.z=2.04*s+.3;l.rotation.x=-.58*s;r.rotation.y=.36*s;break;
    case 6: { // Sink into a low groove, keeping the shoes on the floor.
      const down=.29*s;b.position.y=-down;b.rotation.x=.25*s;
      l.position.y+=down/(b.scale.y||1);r.position.y+=down/(b.scale.y||1);
      l.rotation.set(.74*s,-.23*s,-.25*s);r.rotation.set(.74*s,.23*s,.25*s);
      a.rotation.set(-.86*s,0,-.55);z.rotation.set(-.86*s,0,.55);break;
    }
    case 7: { // Alternating shoulders and an angled jazz step.
      const roll=Math.sin(Math.PI*5*u)*s;
      b.rotation.set(-.08*s,.52*roll,.18*roll);p.head.rotation.z=-.24*roll;
      a.rotation.set(-1.18*s-.6*roll,0,-1.42*s);z.rotation.set(-1.18*s+.6*roll,0,1.42*s);
      l.rotation.z=-.27*s;r.rotation.z=.27*s;break;
    }
    case 8: // Clap high, then sweep the hands back down.
      a.rotation.set(-.3*s,.09*s,-3.12*s-.16);z.rotation.set(-.3*s,-.09*s,3.12*s+.16);
      b.position.y=.09*s;p.head.rotation.x=-.20*s;b.rotation.y=-.09*s;break;
    case 9: // Wide star jump.
      b.position.y=(calm?.16:.38)*s;a.rotation.z=-2.10*s-.32;z.rotation.z=2.10*s+.32;
      l.rotation.z=-.62*s;r.rotation.z=.62*s;b.rotation.z=-.08*s;break;
    case 10: // Kick forward and counterbalance with the opposite arm.
      r.rotation.set(-1.36*s,.36*s,.39*s);l.rotation.x=.17*s;b.rotation.z=-.16*s;
      b.position.x-=.11*s;a.rotation.set(-.90*s,0,-1.46*s);z.rotation.set(.67*s,0,.46*s+.32);break;
    case 11: { // Pass the wave across the shoulders and out the second hand.
      const sweep=Math.sin(Math.PI*clamp(u*1.5,0,1)),echo=Math.sin(Math.PI*clamp(u*1.5-.5,0,1));
      a.rotation.set(.4*echo,0,-.36-1.84*sweep);z.rotation.set(.4*sweep,0,.36+1.84*echo);
      b.rotation.z=.32*(sweep-echo);p.head.rotation.z=-.19*(sweep-echo);break;
    }
    case 12: // Five combo: two heel-toe steps with alternating high fists.
      b.position.x=.23*wave;b.rotation.y=.43*wave;b.rotation.z=-.23*wave;
      a.rotation.z=-.43-2.22*Math.max(0,wave);z.rotation.z=.43-2.22*Math.min(0,wave);
      l.rotation.x=wave*-.75;r.rotation.x=wave*.75;b.position.y=.13*Math.abs(wave);break;
    case 13: // Ten combo: a rising full turn, then a wide-legged landing.
      b.position.y=(calm?.17:.49)*s;b.rotation.y=(calm?1.5:Math.PI*2)*u*u*(3-2*u);
      a.rotation.z=-.44-1.83*s;z.rotation.z=.44+1.83*s;l.rotation.z=-.52*s;r.rotation.z=.52*s;
      b.rotation.x=-.11*s;p.head.rotation.z=.17*wave;break;
  }
}
const DN_PHRASE_BEATS=[2,2,1,2,1,2,1,2,2,2];
function dnEase(value){const x=clamp(value,0,1);return x*x*(3-2*x);}
function dnPhrasePose(p,k,u,beat){
  const b=p.b,l=p.legs[0],r=p.legs[1],a=p.arms[0],z=p.arms[1],h=p.head;
  const bounce=.5-.5*Math.cos(Math.PI*2*Math.max(0,beat)),knee=.12*bounce,drop=.037*bounce;
  const hip=.62+drop/b.scale.y+.62*(Math.cos(knee)-1)+.03*Math.sin(knee);
  const foot=.62*Math.sin(knee)+.03*(1-Math.cos(knee));
  b.position.set(0,-drop,0);b.rotation.set(0,0,0);
  l.position.set(-.105,hip,foot);r.position.set(.105,hip,foot);
  l.rotation.set(knee,0,0);r.rotation.set(knee,0,0);
  a.rotation.set(-.045*bounce,0,-.22-.038*bounce);z.rotation.set(-.045*bounce,0,.22+.038*bounce);
  h.rotation.set(.027*bounce,0,0);
  if(k<4)return;
  const hold=dnEase(u*7)*dnEase((1-u)*3.8),step=hold*Math.sin(Math.PI*2*u);
  const second=dnEase((u-.37)*6),early=hold*(1-second),late=hold*second;
  switch(k){
    case 4: // Saturday Night Fever: point high, then diagonally across the torso.
      b.position.x=.065*step;b.rotation.set(-.035*hold,.20*hold,-.18*early+.12*late);
      a.rotation.set(-.22*early-.78*late,.35*late,-.22-2.23*early+.31*late);
      z.rotation.set(.10*hold,0,.23+.74*hold);h.rotation.set(-.17*early,.20*hold,-.19*early+.11*late);
      l.rotation.z=-.20*early;r.rotation.set(knee-.22*late,.31*hold,.14*late);break;
    case 5: // Hustle: back rock, recover and turn across the supporting foot.
      b.position.z=-.12*early+.10*late;b.position.x=.09*step;b.rotation.set(.10*early,1.13*step,-.15*step);
      l.rotation.set(knee+.35*early-.25*late,-.21*late,-.14*hold);
      r.rotation.set(knee-.35*early+.16*late,.49*late,.12*hold);
      a.rotation.set(-.41*late,0,-.22-.92*early);z.rotation.set(-.58*early,0,.22+1.11*late);
      h.rotation.set(.08*early,-.47*step,.13*step);break;
    case 6: // The Bump: sink onto the right foot and push the hip out.
      b.position.x=.19*hold;b.position.y-=.065*hold;b.rotation.set(-.11*hold,-.10*hold,.27*hold);
      l.position.y+=.11*hold;r.position.y+=.075*hold;
      l.rotation.set(knee-.29*early,-.26*hold,-.31*hold);r.rotation.set(knee+.23*hold,.18*hold,-.08*hold);
      a.rotation.set(-.45*hold,0,-.22-1.22*hold);z.rotation.set(.15*hold,0,.25+.53*hold);
      h.rotation.set(.06*hold,-.13*hold,-.20*hold);break;
    case 7: { // Funky Chicken: two shoulder pumps, elbows out, alternating taps.
      const pump=.5-.5*Math.cos(Math.PI*4*u);
      b.rotation.set(.17*hold,.14*step,.12*step);b.position.x=.074*step;
      a.rotation.set(-.72*pump*hold,.38*hold,-.22-(.90+.58*pump)*hold);
      z.rotation.set(-.72*pump*hold,-.38*hold,.22+(.90+.58*pump)*hold);
      l.rotation.set(knee-.41*early,-.20*hold,-.19*early);r.rotation.set(knee-.41*late,.20*hold,.19*late);
      h.rotation.set(-.13*pump*hold,-.14*step,-.12*step);break;
    }
    case 8: // Locking point and wrist roll: circular reach, then a firm stop.
      b.position.x=-.13*hold;b.rotation.set(.09*hold,-.29*hold,.19*hold);
      a.rotation.set(-.59*early-.87*late,.83*step,-.22-1.2*hold);
      z.rotation.set(-.50*early,.52*early,.22+.71*late);h.rotation.set(.07*early,-.34*late,.12*hold);
      l.rotation.set(knee+.16*hold,-.23*hold,-.18*hold);r.rotation.set(knee-.44*early,.24*late,.23*hold);break;
    case 9: { // Bus Stop: side, cross behind, side, tap in, compressed to two beats.
      const cross=dnEase((u-.16)*12)*dnEase((.55-u)*10),tap=dnEase((u-.62)*12)*dnEase((1-u)*9);
      b.position.x=-.23*hold;b.rotation.set(.04*hold,.24*cross,-.19*early+.24*tap);
      l.position.x-=.14*early;r.position.x-=.29*cross+.09*tap;r.position.z-=.19*cross;
      l.rotation.set(knee-.23*tap,-.16*hold,-.27*early);
      r.rotation.set(knee+.35*cross-.33*tap,.18*hold,.37*cross);
      a.rotation.set(-.63*late,0,-.22-.86*early);z.rotation.set(-.55*early,0,.22+.83*late);
      h.rotation.set(-.07*tap,-.29*cross,.14*hold);break;
    }
    case 10: // Kick-ball-change: flick, ball of foot down, rock onto the other leg.
      b.position.x=-.13*early+.10*late;b.rotation.set(-.16*early,.25*hold,.18*step);
      r.rotation.set(knee-1.17*early+.27*late,.24*hold,.26*early);
      l.rotation.set(knee+.18*early-.37*late,-.15*hold,-.18*late);
      a.rotation.set(-.80*early,0,-.22-1.07*early);z.rotation.set(-.69*late,0,.22+.88*late);
      h.rotation.set(.12*early,-.09*step,.12*step);break;
    case 11: { // Robot arm wave: close one joint at a time from shoulder to shoulder.
      const from=dnEase(u*8)*dnEase((.66-u)*6),to=dnEase((u-.27)*7)*dnEase((1-u)*9);
      b.position.x=.088*(to-from);b.rotation.set(.12*hold,.22*step,.27*(from-to));
      a.rotation.set(-.71*from-.14*to,.38*to,-.22-1.38*from-.43*to);
      z.rotation.set(-.15*from-.71*to,-.38*from,.22+.43*from+1.38*to);
      l.rotation.set(knee+.22*from,-.18*from,-.11*hold);r.rotation.set(knee-.25*to,.27*to,.12*hold);
      h.rotation.set(.10*hold,-.24*step,-.28*(from-to));break;
    }
    case 12: // Scoo B Doo: little kick, switch, and a two-arm lock.
      b.position.x=-.11*step;b.position.y+=.06*early;b.rotation.set(.12*late,.28*step,-.17*step);
      l.rotation.set(knee-.65*early,-.13*hold,-.19*hold);r.rotation.set(knee-.74*late,.13*hold,.19*hold);
      a.rotation.set(-.48*early-.82*late,0,-.22-1.24*late);
      z.rotation.set(-.53*early-.82*late,0,.22+1.24*late);h.rotation.set(-.14*late,.10*step,.16*step);break;
    case 13: { // Hustle spot turn into a disco point.
      const turn=dnEase(u*1.55),point=hold*dnEase((u-.57)*8);
      b.rotation.set(-.08*point,DN_REDUCED&&DN_REDUCED.matches?1.05*step:Math.PI*2*turn,-.17*point);
      b.position.y+=.13*early;b.position.x=-.10*point;
      l.rotation.set(knee-.32*early,-.26*hold,-.19*point);r.rotation.set(knee+.34*early,.25*hold,.23*point);
      a.rotation.set(-.25*early,0,-.22-1.52*early-2.11*point);
      z.rotation.set(-.67*early,0,.22+1.26*early+.58*point);h.rotation.set(-.22*point,-.31*early,-.15*point);break;
    }
  }
}
const DN_RATINGS=[
  {label:'Perfect',ink:'#ffe184',dark:'#813c36',points:15},
  {label:'Good',ink:'#b2f4c5',dark:'#295846',points:10},
  {label:'OK',ink:'#a5e6ff',dark:'#2e4f79',points:5},
  {label:'What?',ink:'#ffc3df',dark:'#763364',points:0},
  {label:'Dude...',ink:'#e4d9fa',dark:'#524168',points:0},
  {label:'Hit',ink:'#fff3e7',dark:'#5a446c',points:0}
];
const DN_PERFECT=0,DN_GOOD=1,DN_OK=2,DN_WHAT=3,DN_DUDE=4,DN_HIT=5,DN_RATINGS_BUILD=2026112510;
function dnRating(error){
  const n=Math.abs(error);
  return n<=.10?DN_PERFECT:n<=.19?DN_GOOD:n<=DN_WIN?DN_OK:DN_WHAT;
}
function dnTally(){return {counts:new Uint16Array(5),combo:0,best:0};}
function dnTallyRating(tally,grade){
  tally.counts[grade]++;
  tally.combo=grade<=DN_OK?tally.combo+1:0;
  if(tally.combo>tally.best)tally.best=tally.combo;
}
function dnPeerGrade(delta,count,newRules){
  if(count!==1)return DN_HIT;
  if(delta===15)return DN_PERFECT;
  if(delta===10&&newRules)return DN_GOOD;
  if(delta===5&&newRules)return DN_OK;
  return DN_HIT;
}
function dnLeadTarget(mine,other){
  return Math.max(-1,Math.min(1,(mine-other)/480));
}
/* The new profile is a continuous stereo file, so a loop boundary never
   needs a media seek. The shared time disciplines the audible media cursor. */
const DN_MEDIA={el:null,primed:false,tried:false,blocked:false,next:0,profile:null,start:0,
  goTimer:0,syncTimer:0,lastRateAt:0,lastSeekAt:-2,countQueued:false,run:0,playing:false,clockAt:0,clockTime:0,clockSource:-1};
function dnAudio(){
  const A=DN_MEDIA;
  if(!A.el){
    A.el=new Audio();A.el.playsInline=true;A.el.preload='auto';
    A.el.addEventListener('seeking',()=>{A.clockAt=0;});
    A.el.addEventListener('playing',()=>{
      if(A.profile&&!A.playing){
        A.playing=true;
        dnDiscipline(true);
      }
    });
  }
  return A.el;
}
function dnPrime(){
  const A=DN_MEDIA;
  if(!SET.sound||A.primed)return;
  const el=dnAudio();
  if(!el.hasAttribute('src'))el.src='data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAACAgICAgICAgA==';
  A.primed=true;
  el.play()?.catch(()=>{A.primed=false;});
}
function dnOutputDelay(){
  return AC&&AC.state==='running'?Math.max(0,AC.outputLatency||0)+Math.max(0,AC.baseLatency||0):0;
}
function dnLatency(){
  return clamp(Number(SET.danceLatency)||0,-200,200);
}
function dnClock(shared){
  const A=DN_MEDIA,el=A.el;
  if(shared< -DN_LOOP.preroll||!SET.sound||!A.playing||!el||el.paused||el.seeking||el.readyState<3){
    A.clockAt=0;return shared;
  }
  // Media cursors update in batches. Interpolate between reads from the
  // audible cursor so tiny output-buffer steps do not jerk the receptors.
  const now=performance.now(),raw=el.currentTime;
  if(!A.clockAt||now-A.clockAt>105){
    A.clockTime=raw;A.clockAt=now;A.clockSource=raw;
  }else if(raw!==A.clockSource){
    const elapsed=(now-A.clockAt)/1000*el.playbackRate,predicted=A.clockTime+elapsed;
    const delta=raw-predicted;
    A.clockTime=predicted+delta*(Math.abs(delta)>.018?.16:.32);
    A.clockAt=now;A.clockSource=raw;
  }
  const cursor=A.clockTime+(now-A.clockAt)/1000*el.playbackRate;
  return clamp(cursor,raw-.030,raw+.030)-DN_LOOP.preroll-dnOutputDelay()-dnLatency()/1000;
}
function dnLoadTrack(profile,start){
  dnStopTrack();
  if(!SET.sound)return;
  const A=DN_MEDIA,el=dnAudio();
  A.profile=profile;A.start=start;
  if(DN_PITCH)el[DN_PITCH]=true;
  el.playbackRate=1;
  el.src=profile?profile.src:DN_TRACK.src;el.load();
  if(profile){
    A.goTimer=setTimeout(dnStartMedia,Math.max(0,start-realMs()-(DN_LOOP.preroll+dnOutputDelay())*1000));
    A.syncTimer=setInterval(dnDiscipline,63);
  }
}
function dnStopTrack(){
  const A=DN_MEDIA,el=A.el;
  clearTimeout(A.goTimer);clearInterval(A.syncTimer);
  A.profile=null;A.run++;A.playing=false;A.clockAt=0;A.lastRateAt=-DN_LOOP.preroll;A.lastSeekAt=-DN_LOOP.preroll-1;A.tried=false;A.blocked=false;A.next=0;A.countQueued=false;
  if(el&&el.hasAttribute('src')){el.pause();el.removeAttribute('src');el.load();}
}
function dnStartMedia(){
  const A=DN_MEDIA;
  if(A.profile&&!A.tried)dnPlayTrack(Math.max(0,(realMs()-A.start)/1000+DN_LOOP.preroll+dnOutputDelay()));
}
function dnPlayTrack(t){
  const A=DN_MEDIA,el=A.el;
  if(!SET.sound||!el||!el.hasAttribute('src'))return;
  if(t<el.duration&&Math.abs(el.currentTime-t)>(A.profile?.045:.005)&&dnCanSeek(el,t))el.currentTime=t;
  A.tried=true;A.blocked=false;
  const run=A.run;
  el.play()?.catch(e=>{if(A.run===run&&e.name==='NotAllowedError')A.blocked=true;});
}
function dnCanSeek(el,t){return el.seekable.length>0&&t>=el.seekable.start(0)&&t<=el.seekable.end(el.seekable.length-1);}
function dnDiscipline(immediate){
  const A=DN_MEDIA,el=A.el;
  if(!A.profile||!el||el.paused||el.seeking||el.readyState<2)return;
  if(!SET.sound){el.pause();return;}
  const shared=(realMs()-A.start)/1000,latency=dnOutputDelay(),goal=shared+DN_LOOP.preroll+latency;
  if(goal<0||goal>=DN_LOOP.preroll+DN_LOOP.duration-.12)return;
  const silent=shared<-.15&&el.currentTime<DN_LOOP.preroll-.13;
  if((silent&&immediate===true||shared>.6&&shared-A.lastSeekAt>1)&&
    Math.abs(el.currentTime-goal)>(silent?.022:.19)&&dnCanSeek(el,goal)){
    A.lastSeekAt=shared;el.currentTime=goal;
  }else if(DN_PITCH&&shared-A.lastRateAt>=(silent?.10:.17)){
    // The decoder can catch up during silence. Use gentler pitch-preserving
    // corrections once the song is audible and leave room for timer jitter.
    A.lastRateAt=shared;
    const error=dnClock(shared)+dnLatency()/1000-shared,limit=silent?.13:.035;
    const rate=Math.abs(error)<.006?1:Math.round(clamp(1-error*(silent?5:2.6),1-limit,1+limit)*200)/200;
    if(el.playbackRate!==rate)el.playbackRate=rate;
  }
}
function dnTrackTick(t){
  const A=DN_MEDIA,el=A.el;
  if(A.profile){
    if(t>=-DN_LOOP.preroll&&!A.tried)dnStartMedia();
    return;
  }
  if(t<0||!el)return;
  if(!SET.sound){el.pause();return;}
  if(!A.tried)dnPlayTrack(t);
  if(t<A.next||el.paused||el.seeking||el.readyState<2)return;
  A.next=t+.45;
  if(t<el.duration&&Math.abs(el.currentTime-t)>.08)el.currentTime=t;
}
function dnCountSound(){
  const A=DN_MEDIA,D=DANCE;
  if(A.countQueued||!SET.sound||!AC||AC.state!=='running')return;
  A.countQueued=true;
  const go=(D.s-realMs())/1000-dnOutputDelay(),beat=60/DN_LOOP.bpm;
  for(let n=3;n>=1;n--){
    const at=go-n*beat;if(at<0)continue;
    const f=630+(3-n)*155;
    tone(f,.07,'triangle',.13,at,f*.84);
    tone(1690+(3-n)*380,.041,'square',.042,at,930);
    tone(3400,.034,'triangle',.055,at+.015,1050);
  }
  if(go>=0){
    const lead=Math.max(0,go-.18);
    if(go>.05)tone(220,.16,'sine',.068,lead,630);
    tone(138,.16,'triangle',.19,go,65);
    tone(783,.20,'triangle',.10,go,1047);
    tone(2430,.071,'square',.041,go+.021,950);
  }
}
function dnHere(){const out=[];if(!MP.grp||!CUR)return out;for(const a of MP.peers.values()){if(!a.av)continue;if(CUR.id==='home'&&a.loc==='visit'&&a.ho===MP.me)out.push(a);else if(CUR.id==='visit'&&VIS.st==='in'&&((a.loc==='home'&&a.peer===VIS.host)||(a.loc==='visit'&&a.ho===VIS.host&&a.peer!==MP.me)))out.push(a);}return out;}
/* the disco floor of this house (world x,z and its floor), only with a disco ball in the house too */
function dnFloor(){if(!CUR||!S)return null;
  if(CUR.id==='home'){const f=S.home.items.find(it=>it.t==='discofloor');if(!f||!S.home.items.some(it=>it.t==='discoball'))return null;const L=LOC.home;return{x:L.ox+f.x,z:L.oz+UPZ*(f.f|0)+f.z,fl:f.f|0,L,item:HOME_ITEMS.get(f.u)?.g};}
  if(CUR.id==='visit'&&LOC.visit&&LOC.visit.items){let f=null,b=false;for(const g of LOC.visit.items.children){const r=g.userData.row;if(!r)continue;if(r.t==='discofloor'&&!f)f=g;if(r.t==='discoball')b=true;}if(!f||!b)return null;return{x:f.position.x,z:f.position.z,fl:f.userData.fl|0,L:LOC.visit,item:f};}
  return null;}
function dnMyFloor(){const L=CUR;return L?Math.round((P.z-L.oz)/UPZ):0;}
function dnCan(){if(DANCE.on||DANCE.ask||DANCE.mine||!MP.grp||P.ride||CUT)return false;const f=dnFloor();return !!f&&f.fl===dnMyFloor()&&dnHere().length>0;}
function dnAsk(){const here=dnHere();if(!here.length){toast('🕺 Nobody to dance with yet. Wait for a friend!',2.5);return;}
  if(here.length===1)dnAskPeer(here[0]);else openPanel(`<div class="hd"><h2>🕺 Dance with…</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><div class="row wrap">${here.map(a=>`<button class="btn mint" data-a="dnask:${esc(a.peer)}">${esc(a.nm)}</button>`).join('')}</div>`,{bottom:true});}
ACT.dnask=p=>{const a=MP.peers.get(p);closePanel();if(a)dnAskPeer(a);};
function dnAskPeer(a){if(DANCE.mine||DANCE.on)return;audioInit();SFX.tap();const r=dnRoundId(a);if(dnOnBeat(r))dnPrime();DANCE.ask={r,w:a.peer,t0:performance.now(),nm:a.nm};DANCE.mine={r,w:a.peer,st:'ask',s:0,sc:0,mv:-1,k:0,ld:1};toast('🕺 Asking '+a.nm+' to dance…',3);}
function dnCardShow(a){if(DANCE.card)return;DANCE.card={peer:a.peer,r:a.dn.r,nm:a.nm};SFX.ding();let el=$('dnCard');if(!el){el=document.createElement('div');el.id='dnCard';document.body.appendChild(el);}
  el.innerHTML=`<div class="kc-t">🕺 Dance-off!</div><div class="kc-m"><b>${esc(a.nm)}</b> wants to dance with you!<br>Press each arrow as it reaches its target!</div><div class="kc-b"><button class="btn mint" id="dnYes">💃 Let's dance!</button><button class="btn" id="dnNo">🙅 Not now</button></div>`;
  el.hidden=false;$('dnYes').onclick=()=>dnCardAnswer(true);$('dnNo').onclick=()=>dnCardAnswer(false);}
function dnCardAnswer(ok){const c=DANCE.card;if(!c)return;DANCE.card=null;const el=$('dnCard');if(el)el.hidden=true;DANCE.said.add(c.peer+'|'+c.r);const a=MP.peers.get(c.peer);
  if(ok&&a&&a.dn&&a.dn.r===c.r&&a.dn.st==='ask'){audioInit();if(dnOnBeat(c.r))dnPrime();SFX.yay();DANCE.mine={r:c.r,w:c.peer,st:'go',s:0,sc:0,mv:-1,k:0,ld:0};DANCE.partner=c.peer;DANCE.partnerNm=c.nm;toast('💃 Get ready…',2);}
  else{DANCE.mine={r:c.r,w:c.peer,st:'no',s:0,sc:0,mv:-1,k:0,ld:0};setTimeout(()=>{if(DANCE.mine&&DANCE.mine.st==='no')DANCE.mine=null;},6000);if(ok)toast('💛 Too late, the music stopped. Ask them!',2.6);}}
function dnBegin(s,a,left){if(DANCE.res)dnLeave();const f=dnFloor();if(!f){dnCancel();return;}DANCE.on=true;DANCE.s=s;if(DANCE.mine)DANCE.mine.s=s;DANCE.r=DANCE.mine.r;DANCE.partner=a.peer;DANCE.partnerNm=a.nm;DANCE.left=left;DANCE.beat=dnOnBeat(DANCE.r);DANCE.style=dnStyle(DANCE.r);DANCE.profile=dnProfile(DANCE.r);
  DANCE.pat=dnChart(DANCE.r).map(q=>({t:q.t,d:q.d,move:q.move,variant:q.variant,kind:q.kind,j:0}));
  DANCE.combo=0;DANCE.first=0;DANCE.popT=0;DANCE.didGo=false;
  DANCE.tallies=[dnTally(),dnTally()];DANCE.otherNotes=new Uint8Array(DANCE.pat.length);
  DANCE.peerRead={hits:0,score:0,note:-1,first:0};
  DANCE.newPoints=DN_TEST||a.v>=DN_RATINGS_BUILD;
  DANCE.push=DANCE.shove=0;DANCE.result=0;DANCE.pushAt=-4;
  const last=DANCE.pat[DANCE.pat.length-1].t;
  DANCE.length=DANCE.profile?(dnChartRows(DANCE.r)?Math.max(DN_LOOP.duration,last+DN_WIN+.01):DN_LOOP.duration):
    DANCE.beat?DN_TRACK.duration:last+1.8;
  if(DANCE.beat)dnLoadTrack(DANCE.profile,s);
  DANCE.t=(realMs()-s)/1000;DANCE.shared=DANCE.t;DANCE.sc=0;DANCE.osc=0;DANCE.bar=.5;DANCE.mvT=0;DANCE.mvK=-1;DANCE.lastHit=-1;DANCE.ended=0;DANCE.gone=0;DANCE.floor=f;DANCE.ask=null;
  const L=f.L,W=L.W||HOMEW,D=L.D||HOMED,cx=L.ox,cz=L.oz+UPZ*f.fl;let dx=cx-f.x,dz=cz-f.z;const dl=Math.hypot(dx,dz);if(dl<1){dx=0;dz=1;}else{dx/=dl;dz/=dl;}
  {const overlay=!!DANCE.style,cd=innerWidth>innerHeight?(visH()<=500?(overlay?4.1:3.5):(overlay?5:4.4)):5.6,sd=overlay?0:(left?-1:1)*.6;   /* (an upright phone sees a narrow slice: from 5.6 m both dancers fit; run 4, stage 3) */DANCE.cam={x:clamp(f.x+dx*cd+dz*sd,cx-W+.7,cx+W-.7),z:clamp(f.z+dz*cd-dx*sd,cz-D+.7,cz+D-.7),dx,dz};}   /* (run 4, stage 3: nearer on a short sideways screen; the two players' views 1.2 m apart, so after the round they never stand inside each other) */
  if(P.sit)standUp();if(DECO.on)decoEnd();closePanel();P.ride={kind:'dance'};P.jy=0;P.vy=0;document.body.classList.add('dancing');
  const me=makePerson(lookToPerson(packLook()));bakePerson(me);scene.add(me.root);DANCE.me=me;DANCE.watchFloor=null;DANCE.watchCam=null;dnSpots(f,DANCE.style,DANCE.r);dnHud(true);if(DANCE.profile)dnCountSound();else SFX.ding();}
/* A small shared projector paints the same soft mirror flecks onto the
   local walls, floor and character materials. The cones never cast shadows. */
function dnDiscoTexture(){
  const cv=document.createElement('canvas');cv.width=cv.height=64;
  const g=cv.getContext('2d');
  for(const [x,y,r] of [[32,32,9],[17,23,5],[46,22,6],[22,46,6],[44,43,5],[36,14,4],[14,36,3],[50,36,4]]){
    const halo=g.createRadialGradient(x,y,0,x,y,r);
    halo.addColorStop(0,'#fff');halo.addColorStop(.38,'#fffaeecc');halo.addColorStop(1,'#fff0');
    g.fillStyle=halo;g.fillRect(x-r,y-r,r*2,r*2);
    g.fillStyle='#fff0dfb5';g.beginPath();g.moveTo(x,y-r*.58);g.lineTo(x+1,y-1);
    g.lineTo(x+r*.46,y);g.lineTo(x+1,y+1);g.lineTo(x,y+r*.58);
    g.lineTo(x-1,y+1);g.lineTo(x-r*.46,y);g.lineTo(x-1,y-1);g.fill();
  }
  return new THREE.CanvasTexture(cv);
}
function dnDiscoMaterial(base,disco){
  const mat=base.clone(),key=base.customProgramCacheKey();
  mat.customProgramCacheKey=()=>key+':dance-mirror';
  mat.onBeforeCompile=shader=>{
    base.onBeforeCompile(shader);
    Object.assign(shader.uniforms,disco.project);
    shader.vertexShader=`
      varying vec3 mirrorCell0,mirrorCell1,mirrorCell2;
      uniform vec3 mirrorOrigin,mirrorAim[3],mirrorRight[3],mirrorUp[3];
    `+shader.vertexShader.replace('#include <project_vertex>',`
      vec3 mirrorRay=(modelMatrix*vec4(transformed,1.)).xyz-mirrorOrigin;
      mirrorCell0=vec3(dot(mirrorRay,mirrorRight[0]),dot(mirrorRay,mirrorUp[0]),dot(mirrorRay,mirrorAim[0]));
      mirrorCell1=vec3(dot(mirrorRay,mirrorRight[1]),dot(mirrorRay,mirrorUp[1]),dot(mirrorRay,mirrorAim[1]));
      mirrorCell2=vec3(dot(mirrorRay,mirrorRight[2]),dot(mirrorRay,mirrorUp[2]),dot(mirrorRay,mirrorAim[2]));
      #include <project_vertex>
    `);
    shader.fragmentShader=`
      varying vec3 mirrorCell0,mirrorCell1,mirrorCell2;
      uniform vec3 mirrorInk[3];
      uniform float mirrorPower;
      uniform sampler2D mirrorFlecks;
      vec3 mirrorSpot(vec3 lit,vec3 mc,vec3 ink){
        float reach=mc.z;
        float width=max(.15,.32*reach);
        if(reach<=.18||abs(mc.x)>width||abs(mc.y)>width)return lit;
        vec2 cell=mc.xy/width;
        float fleck=texture2D(mirrorFlecks,cell*.5+.5).a;
        float spot=.32*(1.-smoothstep(.07,.66,length(cell)))+fleck*.86;
        float alpha=spot*smoothstep(.18,.82,reach)*mirrorPower;
        return mix(lit,lit*.49+ink*.88,clamp(alpha,0.,.74));
      }
    `+shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );',`
      outgoingLight=mirrorSpot(outgoingLight,mirrorCell0,mirrorInk[0]);
      outgoingLight=mirrorSpot(outgoingLight,mirrorCell1,mirrorInk[1]);
      outgoingLight=mirrorSpot(outgoingLight,mirrorCell2,mirrorInk[2]);
      gl_FragColor=vec4(outgoingLight,diffuseColor.a);
    `);
  };
  return mat;
}
function dnDiscoStart(f,ball,style){
  if(!ball)return null;
  const group=new THREE.Group(),geo=new THREE.CylinderGeometry(.025,1,1,20,1,true);
  geo.translate(0,-.5,0);
  const warm=new THREE.Color('#ffe2b8');
  const ink=style.lights.map(c=>new THREE.Color(c).lerp(warm,.25));ink.push(warm);
  const vectorSet=()=>Array.from({length:3},()=>new THREE.Vector3());
  const flecks=dnDiscoTexture(),origin=new THREE.Vector3();
  const disco={group,geo,flecks,room:[],materials:new Map(),rays:[],up:new THREE.Vector3(0,1,0),
    down:new THREE.Vector3(0,-1,0),origin,strike:-100,
    project:{mirrorOrigin:{value:origin},mirrorAim:{value:vectorSet()},mirrorRight:{value:vectorSet()},
      mirrorUp:{value:vectorSet()},mirrorInk:{value:ink},mirrorPower:{value:0},mirrorFlecks:{value:flecks}}};
  const vertexShader=`
    varying vec3 rayPoint,raySide;
    varying float rayLength;
    void main(){
      rayPoint=(modelMatrix*vec4(position,1.)).xyz;
      raySide=normalize(mat3(modelMatrix)*vec3(position.x,0.,position.z));
      rayLength=-position.y;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    }`;
  const fragmentShader=`
    uniform vec3 ink;
    uniform float power;
    varying vec3 rayPoint,raySide;
    varying float rayLength;
    void main(){
      float axial=smoothstep(.012,.105,rayLength)*(1.-smoothstep(.75,1.,rayLength));
      float across=pow(abs(dot(normalize(raySide),normalize(cameraPosition-rayPoint))),2.1);
      gl_FragColor=vec4(mix(ink,vec3(1.,.94,.83),.26*across),axial*across*power);
    }`;
  for(const color of ink){
    const material=new THREE.ShaderMaterial({vertexShader,fragmentShader,transparent:true,depthWrite:false,
      uniforms:{ink:{value:color},power:{value:0}}});
    const mesh=new THREE.Mesh(geo,material);mesh.frustumCulled=false;group.add(mesh);disco.rays.push(mesh);
  }
  const room=f.L,wall=room.wallM||WALL_M,floor=room.floorM||FLOOR_M;
  room.fls?.[f.fl]?.g.traverse(o=>{
    const base=o.material;
    if(!o.isMesh||(base!==wall&&base!==floor))return;
    let mat=disco.materials.get(base);
    if(!mat){mat=dnDiscoMaterial(base,disco);disco.materials.set(base,mat);}
    disco.room.push({o,base,mat});o.material=mat;
  });
  scene.add(group);
  return disco;
}
function dnDiscoOff(disco){
  if(!disco)return;
  for(const {o,base,mat} of disco.room)if(o.material===mat)o.material=base;
  for(const material of disco.materials.values())material.dispose();
  for(const ray of disco.rays)ray.material.dispose();
  scene.remove(disco.group);disco.flecks.dispose();disco.geo.dispose();
}
function dnDiscoTick(fx,t,calm,wave){
  const D=DANCE,disco=fx.disco,c=D.on||D.res?D.cam:D.watchCam;
  if(!disco||!c)return;
  const p=disco.project,room=fx.room,pos=disco.origin;
  fx.ball.getWorldPosition(pos);
  const fl=fx.ball.parent.userData.fl|0,oz=room.oz+UPZ*fl,W=room.W||HOMEW,H=room.D||HOMED;
  const when=Math.max(0,t)*(calm?.23:.92);
  const hit=clamp(1-(t-disco.strike)/.75,0,1);
  const combo=clamp(1-(t-(D.stageFx?.celebrate??-100))/1.5,0,1);
  const energy=calm?.26+hit*.07:.64+wave*.08+hit*.23+combo*.18;
  p.mirrorPower.value=energy;
  for(let i=0;i<3;i++){
    const a=when*(i===1?.86:1)+i*2.04;
    const x=i===0?-.86+.27*Math.sin(a):i===1?.87+.30*Math.sin(a):.66*Math.sin(a*.91);
    const z=i===2?.51+.26*Math.cos(a):-.71-.23*Math.sin(a*.83);
    const y=i===2?-.88:-.28-.16*Math.cos(a);
    const dir=p.mirrorAim.value[i].set(c.dz*x+c.dx*z,y,c.dz*z-c.dx*x).normalize();
    const right=p.mirrorRight.value[i].crossVectors(dir,disco.up).normalize();
    p.mirrorUp.value[i].crossVectors(right,dir);
    const dx=(room.ox+(dir.x<0?-W:W)-pos.x)/dir.x;
    const dz=(oz+(dir.z<0?-H:H)-pos.z)/dir.z;
    const length=Math.min(dx,dz,(.06-pos.y)/dir.y);
    const ray=disco.rays[i],width=length*(i===2?.143:.11);
    ray.position.copy(pos);ray.quaternion.setFromUnitVectors(disco.down,dir);
    ray.scale.set(width,length,width);
    ray.material.uniforms.power.value=energy*(i===2?.36:.60);
  }
}
/* The existing mirror-ball spots use two instanced palettes in a Funky round. */
function dnSpots(f,style,id){
  dnSpotsOff();
  const g=new THREE.Group();g.position.set(f.x,0,f.z);
  if(style){
    const geo=new THREE.CircleGeometry(1,12),scratch=new THREE.Object3D();
    const tiles=[],original=[];
    if(f.item)f.item.traverse(o=>{
      if(o.isMesh&&o.userData.tile!==undefined){
        tiles.push(o);original.push(HPT.lit&&HPT.mats[o.userData.tile]||o.material);
      }
    });
    const spotM=style.lights.map(color=>new THREE.MeshBasicMaterial({color,transparent:true,opacity:.42,depthWrite:false}));
    const tileM=style.lights.map(color=>toon({color,emissive:new THREE.Color(color),emissiveIntensity:.31}));
    for(let side=0;side<2;side++){
      const spots=new THREE.InstancedMesh(geo,spotM[side],11);spots.frustumCulled=false;
      for(let i=0;i<11;i++){
        const index=i*2+side,a=index*2.39996,r=.63+(index*.37)%2.7;
        scratch.position.set(Math.cos(a)*r,.046+index*.00015,Math.sin(a)*r);
        scratch.rotation.x=-Math.PI/2;scratch.scale.setScalar(.11+(index%3)*.045);
        scratch.updateMatrix();spots.setMatrixAt(i,scratch.matrix);
      }
      spots.instanceMatrix.needsUpdate=true;g.add(spots);
    }
    let ball=null,fallback=null;
    f.L.items.traverse(o=>{
      if(!o.userData.ball)return;
      fallback=o;
      if(o.parent.userData.fl===f.fl)ball=o;
    });
    if(DANCE.on&&!ball)ball=fallback;
    let mount=null;
    if(DANCE.on&&ball){
      const room=f.L,c=DANCE.cam,fixture=ball.parent,oz=room.oz+UPZ*f.fl;
      const back=clamp(.45+((room.ceiling||3.2)-3.2)*.8,.25,1.4);
      mount={fixture,x:fixture.position.x,z:fixture.position.z,floor:fixture.userData.fl};
      fixture.position.x=clamp(f.x-c.dx*back,room.ox-(room.W||HOMEW)+.42,room.ox+(room.W||HOMEW)-.42);
      fixture.position.z=clamp(f.z-c.dz*back,oz-(room.D||HOMED)+.42,oz+(room.D||HOMED)-.42);
      fixture.userData.fl=f.fl;room.vf=-1;
    }
    g.userData.funky={id,room:f.L,geo,tiles,original,spotM,tileM,step:-1,ball,mount,disco:dnDiscoStart(f,ball,style)};
  }else{
    const colors=['#ff4d8d','#7cc8ff','#ffd45c','#5fd4b0','#b79cff'];
    for(let i=0;i<22;i++){
      const a=i*2.39996,r=1.4+(i*.37)%2.4;
      const m=new THREE.Mesh(new THREE.CircleGeometry(.13+(i%3)*.04,14),new THREE.MeshBasicMaterial({color:colors[i%5],transparent:true,opacity:.55,depthWrite:false}));
      m.rotation.x=-Math.PI/2;m.position.set(Math.cos(a)*r,.012+i*.0004,Math.sin(a)*r);g.add(m);
    }
  }
  scene.add(g);DANCE.spots=g;
}
function dnSpotsOff(){
  const D=DANCE,g=D.spots;if(!g)return;
  scene.remove(g);
  const fx=g.userData.funky;
  if(fx){
    dnDiscoOff(fx.disco);
    if(fx.mount){
      const m=fx.mount;m.fixture.position.x=m.x;m.fixture.position.z=m.z;
      m.fixture.userData.fl=m.floor;fx.room.vf=-1;
    }
    for(let i=0;i<fx.tiles.length;i++)fx.tiles[i].material=fx.original[i];
    for(const m of fx.spotM)m.dispose();
    for(const m of fx.tileM)m.dispose();
    for(const spot of g.children)spot.dispose();
    fx.geo.dispose();
  }else g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});
  D.spots=null;
}
function dnPulse(t,profile){
  if(t<0||DN_REDUCED&&DN_REDUCED.matches)return 0;
  const beats=dnBeatAt(t,profile),phase=beats-Math.floor(beats);
  return (1-phase)*(1-phase)*(1-phase);
}
function dnFunkyLights(t,profile){
  const g=DANCE.spots,fx=g&&g.userData.funky;if(!fx)return;
  const calm=DN_REDUCED&&DN_REDUCED.matches;
  const beat=calm?0:Math.max(0,Math.floor(dnBeatAt(t,profile)));
  const wave=dnPulse(t,profile);
  g.rotation.y=calm?0:Math.max(0,t)*.52;
  if(fx.ball)fx.ball.rotation.y=calm?0:Math.max(0,t)*.33;
  dnDiscoTick(fx,t,dnCalm(),wave);
  const streak=DANCE.on&&!dnCalm()?Math.max(DANCE.combo,DANCE.tallies[1].combo):0;
  const boost=streak>=50?.33:streak>=25?.24:streak>=10?.15:0;
  fx.spotM[0].opacity=.38+(.44+boost*.3)*wave;fx.spotM[1].opacity=.41+(.38+boost*.3)*wave;
  fx.tileM[0].emissiveIntensity=.26+(.59+boost)*wave;fx.tileM[1].emissiveIntensity=.25+(.57+boost)*wave;
  if(beat!==fx.step){
    fx.step=beat;
    for(let i=0;i<fx.tiles.length;i++){
      const col=i%6,row=Math.floor(i/6),lane=(row+col+beat)%4;
      fx.tiles[i].material=lane<2?fx.tileM[lane]:fx.original[i];
    }
  }
}
/* Watching a round in this house uses the same stage clock as both dancers. */
function dnWatch(){
  const D=DANCE;
  let dn=null;
  if(MP.grp&&CUR&&(CUR.id==='home'||CUR.id==='visit')){
    for(const a of MP.peers.values()){
      const p=a.dn;
      if(p&&p.st==='go'&&p.s>0&&dnStyle(p.r)&&dnRoomPeer(a)){dn=p;if(p.ld)break;}
    }
  }
  const profile=dn&&dnProfile(dn.r);
  if(!dn||(realMs()-dn.s)/1000>(profile?DN_LOOP.duration:DN_TRACK.duration)+1){
    if(D.watchFloor){dnSpotsOff();D.watchFloor=null;D.watchCam=null;}
    return;
  }
  const fx=D.spots&&D.spots.userData.funky;
  if(!fx||fx.id!==dn.r||fx.room!==CUR){
    const f=dnFloor();if(!f){dnSpotsOff();D.watchFloor=D.watchCam=null;return;}
    let dx=f.L.ox-f.x,dz=f.L.oz+UPZ*f.fl-f.z;
    const len=Math.hypot(dx,dz);if(len<1){dx=0;dz=1;}else{dx/=len;dz/=len;}
    D.watchFloor=f;D.watchCam={dx,dz};
    dnSpots(f,dnStyle(dn.r),dn.r);
  }
  dnFunkyLights((realMs()-dn.s)/1000,profile);
}
function dnCancel(msg){if(msg)toast(msg,3);DANCE.ask=null;DANCE.mine=null;dnStopTrack();}
function dnTick(dt){const D=DANCE;if(!S)return;if(D.spots&&!D.spots.userData.funky)D.spots.rotation.y+=dt*.5;
  {const pa=D.partner&&MP.peers.get(D.partner),tg=pa&&pa.av&&pa.av.tag;if((D.on||D.res)&&tg){tg.visible=false;D.hidTag=tg;}else if(D.hidTag&&!(D.on||D.res)){D.hidTag.visible=true;D.hidTag=null;}}   /* (run 4, stage 3: the partner's tag rests during the round and its result: it hid the mirror ball, and the score bar names both) */
  if(D.res){
    if(CUR!==D.floor.L)dnLeave();
    else{
      dnKeepResults();
      if(D.style)dnFunkyLights(D.t+(performance.now()-D.ended)*.001,D.profile);
      if(D.stageFx)dnConfettiTick(D.stageFx,D.result===1&&!dnCalm()?(performance.now()-D.resultAt)*.001:-1,2.25);
    }
    return;
  }
  /* the asking: the partner answers through presence */
  if(D.ask){const a=MP.peers.get(D.ask.w);const an=a&&a.dn&&a.dn.r===D.ask.r?a.dn:null;
    if(!a)dnCancel('💛 '+D.ask.nm+' left.');else if(an&&an.st==='go'&&!D.on){const s=realMs()+4000;D.mine.st='go';D.mine.s=s;dnBegin(s,a,1);}
    else if(an&&an.st==='no')dnCancel('💛 '+D.ask.nm+': maybe later!');else if(performance.now()-D.ask.t0>30000)dnCancel('💛 '+D.ask.nm+' did not answer. Maybe later!');}
  else if(D.mine&&D.mine.st==='go'&&!D.on&&!D.mine.ld){const a=MP.peers.get(D.mine.w);if(!a||!a.dn||a.dn.r!==D.mine.r||a.dn.st==='no'||a.dn.st==='done'){dnCancel();}else if(a.dn.st==='go'&&a.dn.s>0)dnBegin(a.dn.s,a,0);}
  if(!D.on&&!D.card&&MP.grp&&!D.mine&&PLAYING&&!CUT&&!fading&&dnFloor()){for(const a of MP.peers.values()){if(a.dn&&a.dn.st==='ask'&&a.dn.w===MP.me&&!D.said.has(a.peer+'|'+a.dn.r)&&dnHere().includes(a)){dnCardShow(a);break;}}}
  if(D.card){const a=MP.peers.get(D.card.peer);if(!a||!a.dn||a.dn.r!==D.card.r||a.dn.st!=='ask'){D.card=null;const el=$('dnCard');if(el)el.hidden=true;}}
  /* the dance-off itself */
  if(D.tg){const f=D.on?D.floor:D.watchFloor&&D.watchFloor.L===CUR?D.watchFloor:dnFloor();if(f){D.tg.x=f.x;D.tg.z=f.z;const L=CUR;if(L&&(L.id==='home'||L.id==='visit')&&!L.inter.includes(D.tg))L.inter.push(D.tg);}}
  if(!D.on){if(!D.res&&!DN_TEST)dnWatch();return;}
  const shared=D.beat?(realMs()-D.s)/1000:D.t+dt;
  D.shared=shared;D.dt=dt;
  if(D.beat)dnTrackTick(shared);
  D.t=D.profile?dnClock(shared):shared;
  if(D.profile&&shared<0)dnCountSound();
  const a=DN_TEST?D.bot:MP.peers.get(D.partner);
  if(DN_TEST&&a)dnBotTick(a,shared>=D.length?Math.max(D.t,D.length):D.t);
  if(a&&a.dn&&a.dn.r===D.r){
    if(Number.isFinite(a.dn.sc))D.osc=a.dn.sc;
    if(D.style&&!DN_TEST)dnPeerFeedback(a.dn,D.t);
    D.gone=0;
  }else D.gone+=dt;
  if(D.style){
    dnExpire(D.t);
    const elapsed=clamp(shared-D.pushAt,0,.35);D.pushAt=shared;
    const before=D.push;
    D.push+=(dnLeadTarget(D.sc,D.osc)-D.push)*(1-Math.exp(-elapsed*1.65));
    D.shove+=((D.push-before)/Math.max(.016,elapsed)-D.shove)*(1-Math.exp(-elapsed*10));
    dnFunkyLights(D.t,D.profile);dnStageTick(D.t);
  }
  else for(const q of D.pat)if(!q.j&&D.t>q.t+DN_WIN)q.j=-1;
  const target=(D.sc+1)/(D.sc+D.osc+2);D.bar+=clamp((target-D.bar)*Math.min(1,dt*2.5),-.025,.025);   /* the bar slides: never more than 2.5% a frame, even after a hitch */
  if(D.mvT>0)D.mvT-=dt;
  dnHudTick();
  if(!a||D.gone>6||(CUR.id!=='home'&&CUR.id!=='visit'))dnEnd('gone');
  else if(shared>=D.length){
    // Let a last registered Perfect reach the screen before hiding the lane.
    if(D.style&&shared<D.length+.45&&D.laneFx.sides.some(dnPerfectPending))return;
    dnEnd();
  }
}
function dnPerfectPending(L){
  for(const b of L.bursts)if(b.at===-1&&b.grade===DN_PERFECT)return true;
  return false;
}
/* A press reads the playback clock directly, including between animation frames. */
function dnExpire(t){
  const D=DANCE;
  for(;D.first<D.pat.length;D.first++){
    const q=D.pat[D.first];
    if(q.j)continue;
    if(t<=q.t+DN_WIN)break;
    q.j=-1;dnRate(0,DN_DUDE,q.d,t);
  }
}
function dnRate(side,grade,d,t,knownCombo=0){
  const D=DANCE;let combo=knownCombo;
  if(!side||DN_TEST){
    const tally=D.tallies[side];
    dnTallyRating(tally,grade);
    combo=tally.combo;
    if(!side)D.combo=combo;
  }
  dnLaneFeedback(side,grade,d,t,combo);
}
function dnPeerFeedback(wire,t){
  const D=DANCE,read=D.peerRead,hits=wire.k,score=wire.sc;
  if(!Number.isInteger(hits)||!Number.isFinite(score)||hits<=read.hits||hits>D.pat.length)return;
  const count=hits-read.hits,delta=score-read.score;
  const note=D.pat[wire.m];
  const fresh=note&&wire.m!==read.note&&Math.abs(t-note.t)<1.5;
  if(fresh){
    D.otherNotes[wire.m]=1;
  }
  const lane=dnPattern(D.r)[wire.mv];
  if(lane){
    const grade=dnPeerGrade(delta,count,D.newPoints);
    if(grade<DN_WHAT)D.tallies[1].counts[grade]++;
    const combo=fresh&&Number.isInteger(wire.c)&&wire.c>0&&wire.c<=hits?wire.c:0;
    dnRate(1,grade,lane.d,t,combo);
  }
  if(Number.isInteger(wire.c)&&wire.c>0&&wire.c<=hits)D.tallies[1].best=Math.max(D.tallies[1].best,wire.c);
  read.hits=hits;read.score=score;read.note=wire.m;
}
function dnPress(d){
  const D=DANCE;if(!D.on)return;
  const shared=D.beat?(realMs()-D.s)/1000:D.t;
  if(D.profile&&shared<0){audioInit();dnCountSound();return;}
  if(shared<0||shared>=D.length)return;
  if(D.beat&&DN_MEDIA.blocked)dnPlayTrack(shared+(D.profile?DN_LOOP.preroll+dnOutputDelay():0));
  const t=D.profile?dnClock(shared):shared;
  if(D.style)dnExpire(t);
  let best=-1,bd=DN_WIN;
  for(let i=D.first;i<D.pat.length;i++){
    const q=D.pat[i],delta=t-q.t;
    if(delta<-DN_WIN)break;
    if(!q.j&&q.d===d&&(Math.abs(delta)<bd||D.style&&best<0&&Math.abs(delta)===DN_WIN)){bd=Math.abs(delta);best=i;}
  }
  if(best<0){if(D.style)dnRate(0,DN_WHAT,d,t);return;}
  const grade=D.style?dnRating(bd):-1;
  const note=D.pat[best],pts=D.style?(grade===DN_OK&&!D.newPoints?10:DN_RATINGS[grade].points):
    D.beat?DanceJudge.judge(bd,DN_WIN).points:bd<.1?15:10;
  note.j=1;D.sc+=pts;D.mine.sc=D.sc;D.mine.k++;D.lastHit=best;
  if(D.style){
    dnRate(0,grade,d,t);
    dnRememberMove(D.mine,note,best,D.combo,t,D.profile,D.pat);
  }else{
    D.mine.mv=D.beat?note.move:best;D.mvT=.65;D.mvK=d;dnHudPop(d,pts,pts===15);
  }
  if(D.style&&grade===DN_PERFECT){
    tone(720,.051,'triangle',.083,0,410);
    tone(1047,.095,'triangle',.091,.008,1568);
    tone(2093,.075,'sine',.043,.015,2637);
  }else if(D.style&&grade===DN_OK)tone(437,.052,'sine',.046,0,363);
  else SFX.pop();
}
/* the moves: a lean left or right, a crouch, both arms up (u = how far into the move) */
function dnPose(p,k,u,t,type){if(type){dnFunkyPoseLegacy(p,k,u,t);return;}const s=Math.sin(Math.PI*clamp(u,0,1)),b=p.b;b.rotation.z=0;b.position.y=.03*Math.sin(t*7);p.head.rotation.z=0;for(const l of p.legs)l.position.y=.62;
  if(k===0){b.rotation.z=.35*s;p.arms[0].rotation.z=-2.4*s;p.arms[1].rotation.z=.4*s;p.head.rotation.z=.3*s;}
  else if(k===3){b.rotation.z=-.35*s;p.arms[1].rotation.z=2.4*s;p.arms[0].rotation.z=-.4*s;p.head.rotation.z=-.3*s;}
  else if(k===1){const dy=.2*s;b.position.y=-dy;p.arms[0].rotation.z=-1.3*s;p.arms[1].rotation.z=1.3*s;for(const l of p.legs){l.position.y=.62+dy/(b.scale.y||1);l.rotation.x=.6*s;}}   /* (run 4 finish: the legs slide up into the body as it goes down, so the shoes stay on the floor; they went down with it and sank 13 cm into the dance floor) */
  else if(k===2){b.position.y=.18*s;p.arms[0].rotation.z=-2.7*s;p.arms[1].rotation.z=2.7*s;}
  else{p.arms[0].rotation.z=-.35+.3*Math.sin(t*7);p.arms[1].rotation.z=.35-.3*Math.sin(t*7);}}
/* 💃 an upright phone sees a narrow slice: when the room is too small for the view to stand 5.6 m back, it widens until both dancers and their lean fit (run 4 finish: the host's crown and arm went off the edge) */
function dnFov(){
  const D=DANCE;
  if(!(D.on||D.res)||!D.cam||!D.floor)return 0;
  const d=Math.max(1,Math.hypot(D.cam.x-D.floor.x,D.cam.z-D.floor.z)),a=innerWidth/innerHeight;
  if(D.style)return a<1?96:92;
  return a<1?Math.min(95,2*Math.atan(1.6/(d*a))*180/Math.PI):0;
}
const DN_KNEE=.50;
function dnDesktop(w=innerWidth,h=innerHeight){return w>=1360&&h>=680;}
function dnCameraHeight(){return dnDesktop()?.44:DN_KNEE;}
function dnCameraAim(){return innerWidth<innerHeight?.82:visH()<=500||dnDesktop()?.72:.89;}
function dnCameraPosition(c,f,dist,strafe=0){
  const L=f.L,ox=L.ox,oz=L.oz+UPZ*f.fl,w=(L.W||HOMEW)-.32,d=(L.D||HOMED)-.32;
  c.x=clamp(f.x+c.dx*dist+c.dz*strafe,ox-w,ox+w);
  c.z=clamp(f.z+c.dz*dist-c.dx*strafe,oz-d,oz+d);
}
function dnDancerSide(side){
  const D=DANCE,sign=(side?!D.left:!!D.left)?-1:1;
  const narrow=camera.aspect<.60;
  const base=D.style?narrow?.42:camera.aspect<1?.64:dnDesktop()?.86:.77:.83;
  if(!D.on||dnCalm())return sign*base;
  const amount=Math.max(0,side?D.push:-D.push);if(!amount)return sign*base;
  const c=D.cam,f=D.floor,dist=Math.hypot(c.x-f.x,c.z-f.z);
  const half=dist*Math.tan(Math.max(BASEFOV,dnFov())*Math.PI/360)*camera.aspect;
  const L=f.L,dx=c.dz*sign,dz=-c.dx*sign,fx=f.x-L.ox,fz=f.z-(L.oz+UPZ*f.fl);
  let max=half*(narrow?.74:dnDesktop()?.64:.60)-(dnDesktop()?.51:.44);
  if(Math.abs(dx)>.001)max=Math.min(max,((L.W||HOMEW)-.59-Math.sign(dx)*fx)/Math.abs(dx));
  if(Math.abs(dz)>.001)max=Math.min(max,((L.D||HOMED)-.59-Math.sign(dz)*fz)/Math.abs(dz));
  return sign*lerp(base,Math.max(base,max),amount);
}
function dnPoseFeedback(person,t,side){
  dnStumble(person,t,side);
  const L=DANCE.laneFx.sides[side],a=(t-L.perfectAt)/.25;
  if(a>=0&&a<1&&!dnCalm()){
    const punch=Math.min(a*12,1)*Math.pow(1-a,1.28),arm=L.perfectDir&1,sign=arm?1:-1;
    person.arms[arm].rotation.x-=punch*1.33;
    person.arms[arm].rotation.z+=sign*punch*1.96;
    person.arms[1-arm].rotation.z-=(sign*punch*.64);
    person.b.rotation.z+=sign*punch*.18;person.b.position.y+=punch*.14;
    person.head.rotation.x-=punch*.14;
  }
  const D=DANCE,pressure=Math.max(0,side?D.push:-D.push);
  const which=(side?!D.left:!!D.left)?1:-1;
  const skid=dnCalm()?0:Math.min(.48,Math.max(0,side?D.shove:-D.shove));
  person.b.rotation.z+=which*((dnCalm()?.085:.35)*pressure+skid*.24);
  person.b.position.y-=skid*.075;
  person.legs[which<0?0:1].rotation.z+=which*(pressure*.13+skid*.26);
  person.head.rotation.z-=which*.06*pressure;
}
/* Keep the last rendered dance view for the results. Only its height changes. */
function dnCam(dt){
  const D=DANCE;
  if(!(D.on||D.res)||!D.cam){updateCamera(dt);return;}
  const c=D.cam,f=D.floor;
  if(D.res){
    const view=D.resultCamera,rise=dnEase((performance.now()-D.ended)/570);
    camera.position.set(view.x,lerp(view.y,Math.max(view.y,.87),rise),view.z);
    camera.quaternion.copy(view.rotation);
    if(camera.fov!==view.fov||camera.zoom!==view.zoom){
      camera.fov=view.fov;camera.zoom=view.zoom;camera.updateProjectionMatrix();
    }
  }else{
    const wide=innerWidth>innerHeight,short=visH()<=500;
    if(D.style){
      const a=innerWidth/innerHeight;
      const dist=wide?(short?1.73:dnDesktop()?2.01:1.94):clamp(1.18/a,1.85,2.62);
      dnCameraPosition(c,f,dist);
      const aimX=f.x,aimZ=f.z,targetY=dnCameraAim();
      const ease=1-Math.exp(-dt*8);
      P.x=lerp(P.x,c.x,ease);P.z=lerp(P.z,c.z,ease);
      const dx=aimX-P.x,dz=aimZ-P.z;
      P.yaw=angLerp(P.yaw,Math.atan2(-dx,-dz),ease);
      P.pitch=lerp(P.pitch,Math.atan2(targetY-dnCameraHeight(),Math.hypot(dx,dz)),ease);
      P.moving=false;
    }else{
      const ty=!wide?.03:short?1.3:1.0,lo=wide?.6:0;
      psCamTo(c.x,c.z,f.x+c.dz*lo,ty,f.z-c.dx*lo,dt,4);
    }
    P.cy=0;P.jy=0;updateCamera(dt);
    if(D.style)camera.position.y=dnCameraHeight();
    const zoom=D.style&&!dnCalm()?1+.02*dnPulse(D.t,D.profile):1;
    if(camera.zoom!==zoom){camera.zoom=zoom;camera.updateProjectionMatrix();}
  }
  for(const q of PET_ACTORS)if(q.loc===CUR.id)q.g.visible=false;   /* the pets wait out of the picture during a round (they show again by themselves) */
  if(D.me){
    const m=D.me,side=D.style?dnDancerSide(0):(D.left?-1:1)*.75;
    m.root.position.set(f.x+c.dz*side,0,f.z-c.dx*side);m.root.rotation.y=Math.atan2(c.dx,c.dz);
    animPerson(m,dt,false,1);
    if(D.style)dnSharedPose(m,D.mine,D.pat,D.t,D.profile);
    else dnPose(m,D.mvT>0?D.mvK:-1,D.mvT>0?1-D.mvT/.65:0,D.t);
    if(D.style&&D.on)dnPoseFeedback(m,D.t,0);
    if(D.res)dnResultPose(m,0);
  }}
function dnSharedPose(person,wire,chart,t,profile){
  const note=wire&&chart[wire.m];
  if(profile){
    const beat=dnBeatAt(t,profile);
    if(note&&Number.isFinite(wire.at)){
      const k=dnMoveKind(note.variant,wire.c),u=(beat-dnBeatAt(wire.at/1000,profile))/DN_PHRASE_BEATS[k-4];
      if(u>=0&&u<1){dnPhrasePose(person,k,u,beat);return;}
    }
    dnPhrasePose(person,-1,0,beat);
    return;
  }
  if(note&&Number.isFinite(wire.at)){
    const k=dnMoveKind(note.variant,wire.c),u=(t-wire.at/1000)/dnMoveTime(k);
    if(u>=0&&u<1){dnPose(person,k,u,t,true);return;}
  }
  dnPose(person,-1,0,t,true);
}
function dnRoomPeer(a){
  return CUR.id==='home'?a.loc==='visit'&&a.ho===MP.me:
    CUR.id==='visit'&&VIS.st==='in'&&(a.loc==='home'&&a.peer===VIS.host||a.loc==='visit'&&a.ho===VIS.host);
}
/* A friend's dancer: legacy packets still carry mv; Funky packets add a chart index
   and shared move time so a watching friend sees the same variant and combo move. */
function dnPeer(a,dt){
  const D=DANCE,dn=a.dn&&a.dn.st==='go'?a.dn:null,res=D.res&&a.peer===D.partner;
  const funky=(dn||res)&&dnStyle(dn?dn.r:D.r);
  if(!a.av)return;
  if(a.dnPosed&&(!funky||!CUR||!DN_TEST&&!dnRoomPeer(a))){
    a.av.b.position.x=0;a.av.b.rotation.set(0,0,0);a.av.head.rotation.set(0,0,0);
    a.av.legs[0].position.set(-.105,.62,0);a.av.legs[1].position.set(.105,.62,0);a.dnPosed=false;
  }
  if(!(dn||res)||!CUR||(CUR.id!=='home'&&CUR.id!=='visit')||funky&&!DN_TEST&&!dnRoomPeer(a))return;
  const f=D.on||res?D.floor:funky?D.watchFloor:dnFloor();if(!f)return;
  let c=D.on||res?D.cam:funky?D.watchCam:null;
  if(!c){const L=f.L,cx=L.ox,cz=L.oz+UPZ*f.fl;let dx=cx-f.x,dz=cz-f.z;const dl=Math.hypot(dx,dz);if(dl<1){dx=0;dz=1;}else{dx/=dl;dz/=dl;}c={dx,dz};}
  if(dn)a.dnLd=dn.ld;
  const ours=a.peer===D.partner&&(D.on||res);
  const side=funky&&ours?dnDancerSide(1):(a.dnLd?-1:1)*(funky?.83:.75);
  a.av.root.position.set(f.x+c.dz*side,0,f.z-c.dx*side);
  a.av.root.rotation.y=Math.atan2(c.dx,c.dz);a.av.root.visible=true;
  if(a.pets)for(const q of a.pets)q.g.visible=false;
  if(funky){
    if(dn&&a.dnR!==dn.r){a.dnR=dn.r;a.dnChart=D.r===dn.r?D.pat:dnChart(dn.r);a.dnProfile=dnProfile(dn.r);}
    const start=dn&&dn.s>0?dn.s:res?D.s:0;
    if(start&&a.dnChart){dnSharedPose(a.av,a.dn,a.dnChart,D.on&&a.dnR===D.r?D.t:(realMs()-start)/1000,a.dnProfile);a.dnPosed=true;}
    if(ours&&D.on)dnPoseFeedback(a.av,D.t,1);
    if(res)dnResultPose(a.av,1);
    return;
  }
  if(dn&&(dn.r!==a.dnR||dn.k!==a.dnCount||dn.mv!==a.dnMv)){a.dnR=dn.r;a.dnCount=dn.k;a.dnMv=dn.mv;const move=dnPattern(dn.r)[dn.mv];if(move){a.dnT=.65;a.dnK=move.d;}}
  if(a.dnT>0)a.dnT-=dt;
  a.dnTime=(a.dnTime||0)+dt;dnPose(a.av,a.dnT>0?a.dnK:-1,a.dnT>0?1-a.dnT/.65:0,a.dnTime);if(res)dnResultPose(a.av,1);}
function dnResultPose(p,side){
  const D=DANCE,win=D.result===(side?-1:1),tie=!D.result;
  const age=Math.max(0,(performance.now()-D.ended)/1000);
  const beat=dnCalm()?0:Math.sin(age*8);
  const portrait=innerWidth<innerHeight;
  p.b.rotation.set(0,0,win?(portrait?.025:.05)*beat:0);
  p.b.position.set(0,win?Math.max(0,beat)*.12:0,0);
  p.head.rotation.set(win?-.12:tie?0:.17,0,win?.09*beat:tie?0:-.09);
  // Raise the victory wave in portrait so the outside hand stays in frame.
  const reach=portrait?2.96:1.96,swing=(portrait?.10:.28)*beat;
  p.arms[0].rotation.set(0,0,win?-reach-swing:tie?-.57:-.27);
  p.arms[1].rotation.set(0,0,win?reach-swing:tie?.57:.27);
  for(let i=0;i<2;i++){p.legs[i].position.set(i?.105:-.105,.62,0);p.legs[i].rotation.set(0,0,0);}
}
function dnResultTable(a,why){
  const D=DANCE,ours=D.tallies[0],other=D.tallies[1],nm=esc(dnNm(D.partnerNm));
  const wire=a?.dn,finished=!why&&wire?.r===D.r&&wire.st==='done'&&Number.isInteger(wire.k)&&wire.k>=0&&wire.k<=D.pat.length;
  const cols=[['Score',D.sc,D.osc,'dnScore']];
  for(let i=0;i<5;i++){
    const r=DN_RATINGS[i];
    let count='—';
    if(DN_TEST)count=other.counts[i];
    else if(i===DN_DUDE&&finished&&D.profile)count=D.pat.length-wire.k;
    else if(i<DN_WHAT&&other.counts[i])count='≥'+other.counts[i];
    cols.push([`<span class="dnResultChip" style="background:${r.ink}">${r.label}</span>`,ours.counts[i],count,'']);
  }
  cols.push(['Best combo',ours.best,DN_TEST?other.best:other.best?'≥'+other.best:'—','']);
  const header=cols.map(([label])=>`<th scope="col">${label}</th>`).join('');
  const row=(name,side)=>`<tr><th scope="row">${name}</th>${cols.map(col=>`<td class="${col[3]}">${col[side]}</td>`).join('')}</tr>`;
  return `<table class="dnResults" aria-label="Dance results"><thead><tr><th scope="col">Dancer</th>${header}</tr></thead>
    <tbody>${row('You',1)}${row(nm,2)}</tbody></table>`;
}
function dnKeepResults(){
  if(!UI.open||!UI.lock||$('panel').hidden||!$('card').classList.contains('dnres')){
    openPanel(DANCE.resultHtml,{bottom:true,lock:true,cls:'dnres'});
  }
}
function dnEnd(why){
  const D=DANCE;if(!D.on)return;
  const id=D.r,a=DN_TEST?D.bot:MP.peers.get(D.partner),nm=D.partnerNm;
  if(D.style){
    if(!why&&DN_TEST&&a){dnBotTick(a,D.length);D.osc=a.dn.sc;}
    dnExpire(why?D.t:Math.max(D.t,D.length));
  }
  // dnTick runs before the camera update. This is still the rendered dance view, including any beat or hit punch.
  const {x,y,z}=camera.position;
  D.resultCamera={x,y,z,rotation:camera.quaternion.clone(),fov:camera.fov,zoom:camera.zoom};
  D.on=false;D.res=true;D.ended=performance.now();D.resultAt=Infinity;dnStopTrack();
  D.result=Math.sign(D.sc-D.osc);
  if(D.mine){D.mine.st='done';D.mine.sc=D.sc;}
  document.body.classList.remove('dancing');dnHud(false);
  const fin=()=>{
    if(!D.res||D.r!==id)return;
    if(a?.dn?.r===id&&Number.isFinite(a.dn.sc)){
      D.osc=a.dn.sc;
      if(D.style&&!DN_TEST)dnPeerFeedback(a.dn,D.t);
    }
    D.result=Math.sign(D.sc-D.osc);
    let coins=0;
    if(!DN_TEST){
      S.dance=S.dance||{rounds:0,wins:0};S.dance.rounds++;if(D.result>0)S.dance.wins++;
      if(S.dance.pd!==S.day){S.dance.pd=S.day;S.dance.pn=0;}
      coins=S.dance.pn<3?15:0;S.dance.pn++;S.coins+=coins;
      addXP('sport',3);hardEvent('dance',1);qEvent('dance');change();
    }
    D.resultAt=performance.now();
    const title=D.result>0?'<span class="dnWinCrown" aria-hidden="true">👑</span> You win!':D.result<0?'💛 Nice try!':'🤝 A tie!';
    const note=DN_TEST?'Practice round.':coins?`You got ${coins} 🪙!`:'Great dancing!';
    const details=D.style?dnResultTable(a,why):`<p class="line">You <b>${D.sc}</b> · ${esc(nm)} <b>${D.osc}</b></p>`;
    const limits=!DN_TEST&&D.style?'<p class="dnResultNote">≥ counts the hits your game saw. A dash means the detail wasn’t shared.</p>':'';
    SFX.yay();
    D.resultHtml=`<div class="dnResultHeader"><div><div class="who${D.result>0&&!dnCalm()?' dnResultsWin':''}" style="--c:${D.result>0?'#ffe08a':'#ffb7d6'}">${title}</div>
      <p class="dnResultNote">${why==='gone'?esc(nm)+' had to go. ':D.result<0?esc(dnNm(nm))+' wins this round. ':''}${note}</p></div>
      <div class="row dnResultActions"><button class="btn mint" data-a="dnagain">↻ Again</button><button class="btn white" data-a="dnbye">👋 Done</button></div></div>${details}${limits}`;
    openPanel(D.resultHtml,{bottom:true,lock:true,cls:'dnres'});
    setTimeout(()=>{if(D.mine?.r===id&&D.mine.st==='done')D.mine=null;},5000);
  };
  if(DN_TEST)fin();
  else{
    D.resultHtml='<div class="who">🪩 Dance results</div><p class="line">Finishing the round…</p>';
    openPanel(D.resultHtml,{bottom:true,lock:true,cls:'dnres'});
    setTimeout(fin,1200);
  }
}
ACT.dnagain=()=>{
  const D=DANCE;if(!D.res)return;
  const a=DN_TEST?null:MP.peers.get(D.partner);
  dnLeave();
  if(DN_TEST){const f=dnFloor();if(f)dnTestRound(f);return;}
  if(D.mine?.st==='done')D.mine=null;
  if(a&&dnRoomPeer(a)&&dnFloor())dnAskPeer(a);
  else toast('💛 Your dance partner has left.',2.6);
};
ACT.dnbye=()=>{dnLeave();if(!DN_TEST)toast('🪩 Another round? Tap Dance! on the floor.',2.6);};
function dnLeave(){const D=DANCE;D.res=false;D.resultCamera=null;D.resultHtml='';dnStageOff();dnSpotsOff();
  if($('card').classList.contains('dnres'))closePanel();
  if(DN_TEST&&D.bot){dnDropPerson(D.bot.av);D.bot=null;D.mine=null;}
  if(P.ride&&P.ride.kind==='dance')P.ride=null;if(D.me){if(DN_TEST)dnDropPerson(D.me);else scene.remove(D.me.root);D.me=null;}}   /* back from the dance view */
function dnDropPerson(person){scene.remove(person.root);person.root.traverse(o=>{if(o.isMesh)o.geometry.dispose();});}
function dnNm(n){n=String(n||'');return n.length>13?n.slice(0,12)+'…':n;}   /* a long name ends in … in the score bar */
/* the HUD: the faces and the score bar on top, the falling arrows, four big buttons */
function dnTouchInput(event){
  if(!DANCE.on||!DANCE.style||DANCE.touchKeys||(event.pointerType!=='touch'&&event.pointerType!=='pen'))return;
  DANCE.touchKeys=true;
  $('dnHud').classList.add('dnTouch');
  if(DANCE.laneFx)DANCE.laneFx.dirty=true;
}
function dnTouchButton(i){
  return `<button class="btn white" data-a="dnp:${i}" aria-label="${['Left','Down','Up','Right'][i]} arrow">${dnArrow(i,40)}</button>`;
}
function dnHud(show){
  let h=$('dnHud');
  if(!h){
    h=document.createElement('div');h.id='dnHud';h.hidden=true;
    h.innerHTML=`<div id="dnFunkyHud"><div id="dnComboPulse" aria-hidden="true"></div><div id="dnEdgeL" class="dnEdgeHit" aria-hidden="true"></div><div id="dnEdgeR" class="dnEdgeHit" aria-hidden="true"></div><canvas id="dnFunkyCanvas" aria-hidden="true"></canvas></div>
<div id="dnTop"><div class="dnFace me"><span class="em">😄</span><b id="dnMeN">You</b><i id="dnMeS">0</i></div><div id="dnBar"><i id="dnFill"></i><i id="dnMid"></i></div><div class="dnFace"><span class="em">🙂</span><b id="dnYouN"></b><i id="dnYouS">0</i></div></div>
<div id="dnLane">${DN_NAMES.map((n,i)=>`<div class="dnCol" style="left:${i*25}%"></div>`).join('')}<div id="dnLine"></div>${DN_NAMES.map((n,i)=>`<div class="dnHit" style="left:${i*25}%">${dnArrow(i,48)}</div>`).join('')}</div><div id="dnMsg"></div>
<div id="dnBtns"><div class="dnKeys">${dnTouchButton(0)}${dnTouchButton(1)}</div><div class="dnKeys">${dnTouchButton(2)}${dnTouchButton(3)}</div></div>`;
    document.body.appendChild(h);
    addEventListener('pointerdown',dnTouchInput,true);
    h.addEventListener('pointerdown',e=>{
      const b=e.target.closest('[data-a^="dnp:"]');if(!b)return;
      e.preventDefault();e.stopPropagation();audioInit();dnPress(Number(b.dataset.a[4]));
      b.classList.add('on');setTimeout(()=>b.classList.remove('on'),120);
    });
  }
  h.hidden=!show;
  document.body.classList.toggle('dnOverlay',show&&!!DANCE.style);
  if(!show){
    if(DANCE.res&&DANCE.stageFx){
      const fx=DANCE.stageFx;
      for(const tile of fx.tiles)if(tile)tile.mesh.visible=false;
      for(const ring of fx.rings)ring.mesh.visible=false;
      fx.sparks.visible=fx.confetti.visible=false;dnStageNeutral(fx);
    }else dnStageOff();
    return;
  }
  const lane=$('dnLane');for(const a of DANCE.arrows)a.remove();
  const funky=DANCE.style&&DANCE.style.arrow==='funky';
  h.classList.toggle('dnFunky',!!funky);
  h.classList.toggle('dnTouch',!!(DANCE.touchKeys||DN_COARSE?.matches));
  h.classList.toggle('dnCalm',dnCalm());
  h.classList.toggle('dnCount',!!DANCE.profile);
  DANCE.arrows=funky?[]:DANCE.pat.map(q=>{
    const el=document.createElement('div');el.className='dnArr';
    el.style.left=(q.d*25)+'%';el.style.top='-60px';el.innerHTML=dnArrow(q.d,52);lane.appendChild(el);
    return el;
  });
  const top=$('dnTop'),fill=$('dnFill');
  top.style.removeProperty('--dn-tug');top.style.removeProperty('--dn-notch');
  top.style.flexDirection=funky&&!DANCE.left?'row-reverse':'';
  fill.style.left=funky&&!DANCE.left?'auto':'';fill.style.right=funky&&!DANCE.left?'0':'';
  if(funky){dnLaneStart();dnStageStart();}
  $('dnMeN').textContent='You';$('dnYouN').textContent=dnNm(DANCE.partnerNm);
  $('dnMeS').textContent='0';$('dnYouS').textContent='0';$('dnFill').style.width='50%';
  $('dnMsg').textContent='';$('dnMsg').removeAttribute('data-cue');
}
function dnHudTick(){
  const D=DANCE,lane=$('dnLane');if(!lane)return;
  if(!D.style){
    const H=lane.clientHeight,line=H-48;
  D.pat.forEach((q,i)=>{const el=D.arrows[i];if(!el)return;const dtq=q.t-D.t;if(dtq>DN_LEAD||dtq<-.6){el.style.visibility='hidden';return;}el.style.visibility='visible';el.style.top=(line-dtq/DN_LEAD*line)+'px';if(q.j!==1)el.style.opacity=dtq<0?String(Math.max(0,(q.j===-1?.3:1)*(1+dtq/.22))):'';if(q.j===1&&!el.classList.contains('hit'))el.classList.add('hit');if(q.j===-1&&!el.classList.contains('miss'))el.classList.add('miss');});
  $('dnMeS').textContent=D.sc;$('dnYouS').textContent=D.osc;$('dnFill').style.width=(D.bar*100).toFixed(2)+'%';
  }
  const m=$('dnMsg');
  // The final cue uses the same audible time as the receptors.
  if(D.profile&&D.t>=0&&D.shared>-.22)D.didGo=true;
  const cueTime=D.shared<-.22?D.shared:D.didGo?Math.max(0,D.t):Math.min(-.0001,D.t);
  const txt=D.profile?dnCountCue(cueTime):D.t<-.2?DN_COUNT[Math.min(5,Math.ceil(-D.t))]:D.t<.6?'Dance!':
    !D.style&&D.popT&&performance.now()<D.popT?D.popTxt:'';
  if(m.textContent!==txt){
    m.textContent=txt;
    if(D.profile&&txt)m.dataset.cue=txt;else m.removeAttribute('data-cue');
  }
}
const DN_COUNT=['','1','2','3','4','5'];
function dnCountCue(t){
  if(t>=0)return t<.42?'GO!':'';
  const count=Math.ceil(-t*DN_LOOP.bpm/60);
  return count<=3?DN_COUNT[count]:'';
}
/* One transparent canvas. Only the strips touched by sprites need clearing. */
const DN_BAR_WIDTH=Array.from({length:1001},(_,i)=>i/10+'%');
const DN_NOTE_INK=['#ed427d','#279cef','#26ba87','#ffb437'];
function dnGlyph(color,direction){
  const icon=document.createElement('canvas');icon.width=icon.height=96;
  const g=icon.getContext('2d');
  g.translate(48,48);g.rotate(DN_ROT[direction]*Math.PI/180);
  g.beginPath();g.moveTo(0,-34);g.lineTo(34,-4);g.quadraticCurveTo(37,0,31,1);
  g.lineTo(15,1);g.lineTo(15,28);g.quadraticCurveTo(15,32,11,32);g.lineTo(-11,32);
  g.quadraticCurveTo(-15,32,-15,28);g.lineTo(-15,1);g.lineTo(-31,1);
  g.quadraticCurveTo(-37,0,-34,-4);g.closePath();
  g.lineJoin='round';g.lineCap='round';
  g.fillStyle=color;g.fill();
  g.strokeStyle='#fff1e9';g.lineWidth=13;g.stroke();
  g.strokeStyle='#32213f';g.lineWidth=9;g.stroke();
  g.beginPath();g.moveTo(-16,-6);g.lineTo(0,-21);g.lineTo(12,-10);
  g.strokeStyle='#fff4e8c9';g.lineWidth=4;g.stroke();
  return icon;
}
function dnReceptorArt(color,arrow,quiet=false){
  const art=document.createElement('canvas');art.width=art.height=128;
  const g=art.getContext('2d'),halo=g.createRadialGradient(64,64,15,64,64,64);
  halo.addColorStop(0,'#fffbe9');halo.addColorStop(.61,color+'c9');halo.addColorStop(1,color+'00');
  if(!quiet){g.fillStyle=halo;g.fillRect(0,0,128,128);}
  dnCircle(g,64,64,55);g.fillStyle=quiet?'#fff4e0':color;g.fill();
  g.strokeStyle='#fff4e6';g.lineWidth=4.5;g.stroke();
  dnCircle(g,64,64,43);g.strokeStyle='#4d325e99';g.lineWidth=2;g.stroke();
  g.drawImage(arrow,12,12,104,104);
  return art;
}
function dnNoteTrail(color,up){
  const art=document.createElement('canvas');art.width=72;art.height=96;
  const g=art.getContext('2d'),fade=g.createLinearGradient(0,0,0,96);
  if(up){g.translate(0,96);g.scale(1,-1);}
  fade.addColorStop(0,color+'00');fade.addColorStop(.38,color+'3d');
  fade.addColorStop(.80,color+'b2');fade.addColorStop(1,'#fff9e8');
  g.fillStyle=fade;g.beginPath();g.moveTo(36,0);
  g.bezierCurveTo(38,33,55,64,58,82);g.quadraticCurveTo(58,95,45,96);
  g.lineTo(27,96);g.quadraticCurveTo(14,95,14,82);g.bezierCurveTo(17,64,34,33,36,0);
  g.fill();return art;
}
function dnSparkSprite(color){
  const art=document.createElement('canvas');art.width=art.height=32;
  const g=art.getContext('2d');
  g.fillStyle=color;g.strokeStyle='#533061';g.lineWidth=1.5;g.lineJoin='round';
  g.beginPath();g.moveTo(16,2);g.lineTo(19,12);g.lineTo(30,16);g.lineTo(19,20);
  g.lineTo(16,30);g.lineTo(13,20);g.lineTo(2,16);g.lineTo(13,12);g.closePath();
  g.stroke();g.fill();return art;
}
function dnLetterArt(word,ink,edge){
  const canvas=document.createElement('canvas'),g=canvas.getContext('2d');
  const font='italic 900 72px "Baloo 2","Trebuchet MS",sans-serif';
  g.font=font;
  canvas.width=Math.ceil(g.measureText(word).width)+46;canvas.height=102;
  g.font=font;g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
  const x=canvas.width*.5;
  g.lineWidth=24;g.strokeStyle='#342042';g.strokeText(word,x,56);
  g.lineWidth=17;g.strokeStyle='#fff7ef';g.strokeText(word,x,48);
  g.lineWidth=10;g.strokeStyle=edge;g.strokeText(word,x,48);
  const fill=g.createLinearGradient(0,21,0,78);
  fill.addColorStop(0,'#fffdf4');fill.addColorStop(.37,ink);fill.addColorStop(1,ink);
  g.fillStyle=fill;g.fillText(word,x,49);
  return canvas;
}
function dnDudeArt(){
  const art=document.createElement('canvas');art.width=294;art.height=110;
  const g=art.getContext('2d');
  g.beginPath();g.moveTo(26,15);g.bezierCurveTo(92,5,113,16,142,19);g.bezierCurveTo(183,21,223,31,269,34);
  g.quadraticCurveTo(291,47,273,72);g.quadraticCurveTo(251,94,221,86);g.lineTo(205,104);g.lineTo(191,89);
  g.quadraticCurveTo(77,73,24,72);g.quadraticCurveTo(1,68,10,34);g.quadraticCurveTo(14,20,26,15);g.closePath();
  g.lineJoin='round';g.lineWidth=8;g.strokeStyle='#373341';g.stroke();g.fillStyle='#d5d2dc';g.fill();
  g.font='900 57px "Baloo 2","Trebuchet MS",sans-serif';
  g.textAlign='center';g.textBaseline='middle';g.translate(145,48);g.rotate(.13);
  g.lineWidth=5;g.strokeStyle='#f4edf7';g.strokeText('Dude…',0,0);
  g.fillStyle='#4f4858';g.fillText('Dude…',0,0);
  return art;
}
function dnGoodArt(){
  const art=document.createElement('canvas');art.width=238;art.height=110;
  const g=art.getContext('2d');
  g.beginPath();g.moveTo(51,11);g.lineTo(192,11);
  g.bezierCurveTo(242,11,244,86,190,86);g.lineTo(156,86);g.lineTo(135,101);
  g.lineTo(121,86);g.lineTo(49,86);g.bezierCurveTo(0,86,0,11,51,11);g.closePath();
  g.lineJoin='round';g.lineWidth=7;g.strokeStyle='#215544';g.stroke();g.fillStyle='#b7f4ae';g.fill();
  g.font='italic 900 61px "Baloo 2","Trebuchet MS",sans-serif';
  g.textAlign='center';g.textBaseline='middle';g.lineWidth=5;
  g.strokeStyle='#f5ffdf';g.strokeText('Good!',119,48);
  g.fillStyle='#255841';g.fillText('Good!',119,48);return art;
}
function dnImpactArt(color){
  const art=document.createElement('canvas');art.width=art.height=192;
  const g=art.getContext('2d'),fade=g.createRadialGradient(96,96,8,96,96,94);
  fade.addColorStop(0,'#ffffff');fade.addColorStop(.40,'#fffadc');
  fade.addColorStop(.76,color);fade.addColorStop(1,color+'00');
  g.fillStyle=fade;g.fillRect(0,0,192,192);
  g.beginPath();
  for(let i=0;i<28;i++){
    const a=i*TAU/28,r=i%2?29:54+(i%5)*8;
    g.lineTo(96+Math.cos(a)*r,96+Math.sin(a)*r);
  }
  g.closePath();g.lineJoin='round';g.strokeStyle='#59305c';g.lineWidth=5;g.stroke();
  g.strokeStyle=color;g.lineWidth=2;g.stroke();
  g.fillStyle='#fffeee';g.fill();
  return art;
}
function dnPerfectRays(color){
  const art=document.createElement('canvas');art.width=360;art.height=216;
  const g=art.getContext('2d'),originX=180,originY=194;
  for(let i=0;i<9;i++){
    const a=-Math.PI+.22+i*(Math.PI-.44)/8,dx=Math.cos(a),dy=Math.sin(a);
    const length=136+(i%3)*23,x=originX+dx*length,y=originY+dy*length;
    const ray=g.createLinearGradient(originX,originY,x,y),ink=i%3===1?'#ffdc79':color;
    ray.addColorStop(0,'#fff5cd');ray.addColorStop(.28,ink+'f2');ray.addColorStop(.70,ink+'af');ray.addColorStop(1,ink+'00');
    const spread=i%2?8:15;
    g.fillStyle=ray;g.beginPath();g.moveTo(originX-dy*3,originY+dx*3);
    g.lineTo(x-dy*spread,y+dx*spread);g.lineTo(x+dy*spread,y-dx*spread);
    g.lineTo(originX+dy*3,originY-dx*3);g.fill();
  }
  return art;
}
const DN_COMBO_EFFECTS=[
  {ink:'#ffe060',alt:'#ff77b6'},
  {ink:'#71fff1',alt:'#b18cff'},
  {ink:'#ffadee',alt:'#89f6ff'}
];
const DN_MILESTONES=[10,25,50],DN_PERFECT_LIFE=.84,DN_RATING_HOLD=.66;
function dnLaneStart(){
  const D=DANCE;
  if(!D.laneFx){
    const cv=$('dnFunkyCanvas'),art=DN_NOTE_INK.map(dnGlyph);
    D.laneFx={cv,g:cv.getContext('2d'),art,
      receptors:D.style.spark.map((c,i)=>dnReceptorArt(c,art[i])),quiet:D.style.spark.map((c,i)=>dnReceptorArt(c,art[i],true)),
      trails:[D.style.spark.map(c=>dnNoteTrail(c,false)),D.style.spark.map(c=>dnNoteTrail(c,true))],
      stars:DN_RATINGS.map(r=>dnSparkSprite(r.ink)),
      colors:D.style.spark.map(dnSparkSprite),glow:D.style.spark.map(dnGlowSprite),impacts:D.style.spark.map(dnImpactArt),
      rays:DN_NOTE_INK.map(dnPerfectRays),comboPulse:$('dnComboPulse'),
      words:DN_RATINGS.map((r,i)=>i===DN_DUDE?dnDudeArt():i===DN_GOOD?dnGoodArt():dnLetterArt(i===DN_PERFECT?'PERFECT!':r.label,
        i===DN_WHAT?'#d4c7d3':r.ink,i===DN_WHAT?'#564453':r.dark)),
      milestones:DN_MILESTONES.map((n,i)=>dnLetterArt('COMBO '+n+'!',DN_COMBO_EFFECTS[i].ink,'#633658')),
      gold:dnSparkSprite(D.style.perfect),edges:[$('dnEdgeL'),$('dnEdgeR')],
      crown:dnCrownArt(),parts:new WeakMap(),projector:new THREE.Matrix4(),keys:$('dnBtns'),
      buttons:$('dnBtns').querySelectorAll('button'),top:$('dnTop'),
      captions:new Float32Array(24),notes:new Float32Array(128),captionUsed:0,noteUsed:0,
      sides:Array.from({length:2},()=>({x:new Float32Array(4),near:new Float32Array(4),dim:new Float32Array(4),
        bursts:Array.from({length:12},()=>({at:-100,d:0,grade:0})),step:0,at:-100,shownAt:-100,grade:0,missAt:-100,
        combo:0,comboArt:null,perfectAt:-100,pulseAt:-100,pulseLight:0,
        hitAt:new Float32Array(4),hitGrade:new Uint8Array(4)})),
      pt:new THREE.Vector3(),width:0,height:0,dirty:true,me:$('dnMeS'),you:$('dnYouS'),bar:$('dnFill')};
  }
  const F=D.laneFx;
  const damageSize=(D.pat.length*2+96)*4;
  if(!F.damage||F.damage.length<damageSize)F.damage=new Int32Array(damageSize);
  F.damageUsed=0;F.lastMe=-1;F.lastYou=-1;F.lastBar='';F.tug=0;F.dirty=true;
  F.comboSeen=F.comboShown=-100;F.comboOpacity=0;F.comboPulse.style.opacity='0';
  for(const edge of F.edges)edge.style.opacity='0';
  for(const L of F.sides){
    L.step=0;L.at=L.shownAt=L.missAt=-100;L.combo=0;L.perfectAt=L.pulseAt=-100;L.pulseLight=0;
    L.dim.fill(-100);L.hitAt.fill(-100);
    for(const b of L.bursts)b.at=-100;
  }
}
function dnCrownArt(){
  const art=document.createElement('canvas');art.width=112;art.height=80;
  const g=art.getContext('2d'),gold=g.createLinearGradient(0,14,0,68);
  gold.addColorStop(0,'#fff9bf');gold.addColorStop(.58,'#ffd158');gold.addColorStop(1,'#efa55d');
  g.beginPath();g.moveTo(12,24);g.lineTo(35,40);g.lineTo(56,12);g.lineTo(77,40);
  g.lineTo(100,24);g.lineTo(88,64);g.quadraticCurveTo(56,75,24,64);g.closePath();
  g.lineJoin='round';g.strokeStyle='#452c56';g.lineWidth=9;g.stroke();g.fillStyle=gold;g.fill();
  g.strokeStyle='#fff7dd';g.lineWidth=2.5;g.stroke();
  g.fillStyle='#fa82b0';dnCircle(g,56,49,6);g.fill();g.strokeStyle='#754051';g.stroke();
  return art;
}
function dnComboArt(L,combo){
  if(L.combo===combo)return;
  L.combo=combo;
  if(!combo)return;
  if(!L.comboArt){
    L.comboArt=document.createElement('canvas');L.comboArt.width=284;L.comboArt.height=180;
    L.comboArt.getContext('2d').scale(2,2);
  }
  const g=L.comboArt.getContext('2d'),text=String(combo),center=combo>=5?83:71;
  const label=combo>=5?(combo>=50?'✨':'🔥'):'';
  g.clearRect(0,0,142,90);g.font='900 69px "Baloo 2","Trebuchet MS",sans-serif';
  g.lineJoin='round';g.textAlign='center';g.textBaseline='middle';g.lineWidth=11;
  g.strokeStyle='#39264e';g.strokeText(text,center,34);
  g.lineWidth=5;g.strokeStyle='#fff4de';g.strokeText(text,center,34);
  g.fillStyle=combo>=50?'#f487e0':combo>=25?'#5feec8':combo>=10?'#ffb737':'#fff0ce';g.fillText(text,center,34);
  g.font='900 19px "Baloo 2","Trebuchet MS",sans-serif';g.lineWidth=6;g.strokeStyle='#39264e';g.strokeText('COMBO',71,76);
  g.fillStyle='#fff6e9';g.fillText('COMBO',71,76);
  if(label){g.font='26px sans-serif';g.fillText(label,25,33);}
}
function dnLaneFeedback(side,grade,d,t,combo){
  const L=DANCE.laneFx?.sides[side];if(!L)return;
  const b=L.bursts[L.step];
  // The effect starts when a frame can show it, even after a slow audio or GPU frame.
  b.at=-1;b.d=d;b.grade=grade;
  L.step=(L.step+1)%L.bursts.length;
  if(L.shownAt!==-1||L.grade!==DN_PERFECT||grade===DN_PERFECT){L.at=t;L.grade=grade;L.shownAt=-1;}
  if(grade===DN_DUDE||grade===DN_WHAT){L.missAt=t;L.missDir=d;}
  if(grade<=DN_OK){
    if(grade===DN_PERFECT){L.perfectAt=t;L.perfectDir=d;}
  }
  dnComboArt(L,combo||0);
  if(grade<=DN_OK)dnStageHit(side,d,t,grade===DN_PERFECT,combo);
}
function dnStumble(m,t,side){
  const L=DANCE.laneFx.sides[side],phase=(t-L.missAt)/.24;
  if(phase<0||phase>=1||dnCalm())return;
  const bob=Math.sin(Math.PI*phase);
  m.b.rotation.z+=(L.missDir<2?-1:1)*bob*.105;
  m.b.position.y-=bob*.029;
}
function dnCircle(g,x,y,r){g.beginPath();g.arc(x,y,r,0,TAU);}
function dnLaneLayout(F){
  const w=F.cv.clientWidth,h=F.cv.clientHeight;
  if(!w||!h)return false;
  F.cv.width=w;F.cv.height=h;F.damageUsed=0;F.width=w;F.height=h;
  const D=DANCE,portrait=w<h,up=!!SET.danceUp,short=!portrait&&h<=500,big=dnDesktop(w,h);
  const compact=portrait&&w<620,touch=$('dnHud').classList.contains('dnTouch');
  F.up=up;F.touch=touch;F.compact=compact;
  const insets=getComputedStyle(F.keys),safe=Math.max(9,parseFloat(insets.paddingLeft)||0,parseFloat(insets.paddingRight)||0);
  const safeTop=Math.max(8,parseFloat(insets.paddingTop)||0);
  const safeBottom=Math.max(12,parseFloat(insets.paddingBottom)||0);
  const score=F.top.getBoundingClientRect(),halfWidth=w*.5;
  const inset=up?Math.max(safe+2,w*.032):safe+w*(portrait?.009:big?.082:.019);
  const span=w*(big?.194:short?.218:portrait?.223:.203);
  const step=Math.max(15,up?Math.min(w*.062,(halfWidth-inset-8)/4):(span-safe)/4);
  const besideScore=up&&Math.min(score.left,w-score.right)>inset+step*4+Math.min(46,w*.025)+8;
  for(let side=0;side<2;side++){
    const L=F.sides[side],left=side?!D.left:!!D.left;
    const pitch=touch&&(up||!side)?Math.max(step,44):step;
    const start=left?inset:w-inset-pitch*4;
    const originalPitch=Math.max(15,(span-safe)/4,touch&&(up||!side)?44:0);
    L.size=Math.min(originalPitch*1.39,h*.144);
    L.noteSize=Math.min(originalPitch*1.91,h*.183)*(SET.danceSmall?.79:1);
    L.outer=left?safe*.65:w-safe*.65;
    L.mid=start+pitch*2;L.stepWidth=pitch*3;
    const extent=(L.stepWidth+L.noteSize+8)*.5;
    L.inner=L.mid+(left?extent:-extent);
    L.key=Math.min(76,pitch);
    L.left=left;L.edge=F.edges[left?0:1];
    for(let d=0;d<4;d++)L.x[d]=start+(d+.5)*pitch;
  }
  const half=Math.max(F.sides[0].size*.5,F.sides[0].key*.5);
  F.wordHeight=clamp(Math.min(h*.090,w*.090),23,big?69:62);
  F.comboHeight=clamp(Math.min(h*.093,w*.107),25,84);
  F.safe=safe;
  F.bandBottom=up?h:h-safeBottom;
  F.scoreLeft=score.left;F.scoreRight=score.right;F.scoreTop=score.top;F.scoreBottom=score.bottom;
  const f=D.floor,c=D.cam,dist=Math.max(1.15,Math.hypot(c.x-f.x,c.z-f.z));
  const eye=dnCameraHeight(),pitch=Math.atan2(dnCameraAim()-eye,dist);
  const cos=Math.cos(pitch),sin=Math.sin(pitch);
  const y=(-eye*cos-dist*sin)/(dist*cos-eye*sin);
  const foot=(.5-.5*y/Math.tan(dnFov()*Math.PI/360))*h;
  F.bandTop=up?0:compact?Math.max(score.bottom+7,foot+h*.045):score.bottom+9;
  if(up){
    // At narrow widths the original scoreboard spans the screen. Use a
    // second, still upper row for the targets and their 44 px touch areas.
    F.line=Math.max(h*.182,safeTop+half+3,besideScore?0:score.bottom+half+8);
  }else{
    F.line=Math.min(F.bandBottom-half-2,Math.max(foot+half*.96,h*(short?.894:.927)));
  }
  const arrow=F.sides[0].noteSize;
  F.spawn=up?h+arrow*.53:F.bandTop+arrow*.66;
  const runway=up?Math.abs(F.line-F.spawn):Math.abs(F.line-F.bandTop);
  F.lead=clamp(runway/(up?355:340),short?.94:1.15,DN_LEAD);
  F.travel=(F.line-F.spawn)/F.lead;
  F.keys.style.setProperty('--dn-key',F.sides[0].key+'px');
  for(let d=0;d<4;d++){
    F.buttons[d].style.left=F.sides[0].x[d]+'px';
    F.buttons[d].style.top=F.line+'px';
  }
  F.dirty=false;return true;
}
function dnLaneDamage(F,x,y,rx,ry=rx){
  const hit=F.damage,i=F.damageUsed,left=Math.floor(x-rx),top=Math.floor(y-ry);
  hit[i]=left;hit[i+1]=top;hit[i+2]=Math.ceil(x+rx)-left;hit[i+3]=Math.ceil(y+ry)-top;
  F.damageUsed=i+4;
}
const DN_RAY_X=Array.from({length:24},(_,i)=>Math.cos(i*TAU/24));
const DN_RAY_Y=Array.from({length:24},(_,i)=>Math.sin(i*TAU/24));
function dnGlowSprite(color){
  const art=document.createElement('canvas');art.width=art.height=64;
  const g=art.getContext('2d'),fade=g.createRadialGradient(32,32,3,32,32,31);
  fade.addColorStop(0,color+'b8');fade.addColorStop(.39,color+'64');fade.addColorStop(1,color+'00');
  g.fillStyle=fade;g.fillRect(0,0,64,64);return art;
}
function dnShatter(g,F,size,x,y,d,q,alpha){
  const art=F.art[d];
  g.globalAlpha=alpha*(1-q)*.97;
  for(let i=0;i<9;i++){
    if(i===0||i===2||i===6||i===8)continue;
    const cx=i%3-1,cy=(i/3|0)-1,distance=size*(.60+q*(1.75+(i%3)*.23)),piece=size*(.50-q*.25);
    const px=x+cx*distance,py=y+cy*distance-q*.41*size;
    g.save();g.translate(px,py);g.rotate((i-4)*q*.59);
    g.drawImage(art,(cx+1)*32,(cy+1)*32,32,32,-piece*.5,-piece*.5,piece,piece);g.restore();
  }
}
function dnLaneBurst(g,F,L,b,t,calm,side){
  const grade=b.grade,perfect=grade===DN_PERFECT,good=grade===DN_GOOD;
  const life=perfect?DN_PERFECT_LIFE:good?.32:grade===DN_DUDE?.25:.29,q=(t-b.at)/life;
  if(q<0||q>=1)return;
  const x=L.x[b.d],y=F.line,size=Math.min(L.noteSize,F.height*.168,L.size*1.48),rating=DN_RATINGS[grade],strength=side?.97:1;
  const fade=1-dnEase((q-.58)/.42),flare=1-dnEase(q/.28),wave=Math.sqrt(q);
  dnLaneDamage(F,x,y,size*(perfect?2.44:1.38)+20);
  if(perfect){
    const glow=size*(1.75+wave*.52),impact=size*(.86+q*.57);
    g.globalAlpha=strength*fade*.83;g.drawImage(F.glow[b.d],x-glow*.5,y-glow*.5,glow,glow);
    g.globalAlpha=strength*(.72*flare+.28*fade);
    g.drawImage(F.impacts[b.d],x-impact*.5,y-impact*.5,impact,impact);
    const radius=size*(.50+wave*(calm?.35:1.04));
    const rise=calm?0:wave*size*.34;
    g.beginPath();g.ellipse(x,y-rise,radius,Math.min(radius*.73,F.height*.071),0,0,TAU);
    g.globalAlpha=strength*fade*.97;g.strokeStyle='#38264b';g.lineWidth=Math.max(5,size*.082);
    g.stroke();
    g.strokeStyle='#fffcef';g.lineWidth=Math.max(3,size*.052);
    g.stroke();
    g.strokeStyle=DN_COL[b.d];g.lineWidth=Math.max(2,size*.036);
    g.beginPath();g.ellipse(x,y-rise,radius+size*.076,Math.min(radius*.73+size*.03,F.height*.075),0,0,TAU);g.stroke();
    if(!calm&&q<.44)dnShatter(g,F,size*.70,x,y,b.d,q/.44,strength);
  }
  // The small ring stays on the socket while the bright shockwave opens out.
  const radius=L.size*(.36+(calm?0:wave*(perfect?.24:good?.18:.075)));
  g.globalAlpha=fade*strength*(grade>=DN_WHAT&&grade!==DN_HIT?.40:.92);
  g.strokeStyle=rating.dark;g.lineWidth=perfect?4:2.7;
  dnCircle(g,x,y,radius);g.stroke();
  g.strokeStyle=perfect?'#fffcef':rating.ink;g.lineWidth=perfect?4.3:good?2.9:1.6;
  dnCircle(g,x,y,radius);g.stroke();
  if(!perfect&&(good||grade===DN_OK||grade===DN_HIT)){
    const f=L.size*(1.05+wave*.38);
    g.globalAlpha=.58*fade*strength;g.drawImage(good?F.glow[b.d]:F.art[b.d],x-f/2,y-f/2,f,f);
  }
  if((calm&&!perfect)||grade===DN_DUDE||grade===DN_WHAT)return;
  const n=perfect?(calm?12:24):good?7:grade===DN_OK?3:2;
  for(let i=0;i<n;i++){
    const a=i+b.d*3,ix=(perfect?a:a*3)%24,dx=DN_RAY_X[ix],dy=DN_RAY_Y[ix];
    const r=size*(.53+wave*(perfect?(calm?.42:1.42):.43))*(.79+(i%5)*.082);
    const px=x+dx*r,py=y+dy*r*.77-wave*size*.47,s=size*(perfect?(i%3?.32:.45):good?.19:.13)*fade;
    const star=perfect?(i%3?F.colors[a%4]:F.gold):F.stars[grade];
    if(perfect&&!calm){
      const drag=size*(.29+q*.28);
      g.globalAlpha=fade*.65*strength;g.strokeStyle=i%2?'#fffdf2':DN_COL[a%4];
      g.lineWidth=1.5+3*fade;g.beginPath();g.moveTo(px-dx*drag,py-dy*drag);g.lineTo(px,py);g.stroke();
    }
    g.globalAlpha=fade*strength;
    g.drawImage(star,px-s/2,py-s/2,s,s);
  }
}
function dnLaneRays(g,F,L,b,now){
  const q=(now-b.at)/DN_PERFECT_LIFE;
  if(b.grade!==DN_PERFECT||q<0||q>=1)return;
  const w=Math.min(F.height*.48,L.noteSize*2.7)*(1+q*.22),h=w*.60;
  const x=L.x[b.d],y=F.line-h*.90+(F.up?h*.45:0);
  dnLaneDamage(F,x,y+h*.5,w*.5+1,h*.5+1);
  g.globalAlpha=.76*(1-dnEase((q-.34)/.66));
  g.drawImage(F.rays[b.d],x-w*.5,y,w,h);
}
function dnGradeScale(grade,age){
  const weight=grade===DN_PERFECT?1:grade===DN_GOOD?.59:.29;
  if(age<.078)return 1+weight*(-.56+.98*Math.min(1,age/.078));
  const tail=Math.max(0,1-(age-.085)/.52);
  return 1+weight*.36*tail*Math.cos((age-.085)*20);
}
// Cache local bounds once per baked rig. Pose them with the same transforms as
// the dancers so even a wide sleeve or a leaning head cannot catch a note.
function dnBodyParts(actor){
  const groups=[actor.b,actor.head,...actor.arms,...actor.legs],parts=[],box=new THREE.Box3();
  function add(group,head){
    const bounds=new THREE.Box3();
    for(const child of group.children){
      if(child.isMesh){
        if(!child.geometry.boundingBox)child.geometry.computeBoundingBox();
        child.updateMatrix();
        bounds.union(box.copy(child.geometry.boundingBox).applyMatrix4(child.matrix));
      }else if(!groups.includes(child))add(child,head);
    }
    if(!bounds.isEmpty())parts.push({group,bounds,head});
  }
  for(const group of groups)add(group,group===actor.head);
  return parts;
}
function dnProjectBody(F,L,actor){
  L.bodyUsed=0;
  L.headTop=F.height*.33;L.headBottom=F.height*.49;L.headX=L.left?F.width*.38:F.width*.62;L.headLeft=L.headRight=L.headX;
  if(!actor)return;
  let parts=F.parts.get(actor);
  if(!parts){parts=dnBodyParts(actor);F.parts.set(actor,parts);}
  if(!L.body||L.body.length<parts.length*4)L.body=new Float32Array(parts.length*4);
  actor.root.updateWorldMatrix(true,true);
  const p=F.pt,w=F.width,h=F.height;
  actor.head.getWorldPosition(p).applyMatrix4(F.projector);
  L.headX=(.5+.5*p.x)*w;
  L.headTop=h;L.headBottom=0;L.headLeft=L.headRight=L.headX;
  for(const {group,bounds,head} of parts){
    if(!group.visible)continue;
    const lo=bounds.min,hi=bounds.max;
    let x0=Infinity,x1=-Infinity,y0=Infinity,y1=-Infinity;
    for(let k=0;k<8;k++){
      p.set(k&1?hi.x:lo.x,k&2?hi.y:lo.y,k&4?hi.z:lo.z).applyMatrix4(group.matrixWorld).applyMatrix4(F.projector);
      const x=(.5+.5*p.x)*w,y=(.5-.5*p.y)*h;
      x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
    }
    if(head){
      L.headTop=Math.min(L.headTop,y0);L.headBottom=Math.max(L.headBottom,y1);
      L.headLeft=Math.min(L.headLeft,x0);L.headRight=Math.max(L.headRight,x1);
    }
    const n=L.bodyUsed;
    const pad=head?12:7;
    L.body[n]=x0-pad;L.body[n+1]=x1+pad;L.body[n+2]=y0-pad;L.body[n+3]=y1+pad;L.bodyUsed=n+4;
  }
}
function dnBoxIntersects(x0,x1,y0,y1,boxes,used){
  for(let i=0;i<used;i+=4){
    if(x0<boxes[i+1]&&x1>boxes[i]&&y0<boxes[i+3]&&y1>boxes[i+2])return true;
  }
  return false;
}
function dnStoreBox(boxes,i,x,y,hw,hh){
  boxes[i]=x-hw;boxes[i+1]=x+hw;boxes[i+2]=y-hh;boxes[i+3]=y+hh;
  return i+4;
}
function dnNoteLimit(F,L,y,half){
  let limit=L.inner;
  for(const actor of F.sides){
    const body=actor.body;
    for(let i=0;i<actor.bodyUsed;i+=4){
      if(y+half<=body[i+2]||y-half>=body[i+3])continue;
      limit=L.left?Math.min(limit,body[i]):Math.max(limit,body[i+1]);
    }
  }
  const labels=F.captions;
  for(let i=0;i<F.captionUsed;i+=4){
    if(y+half<=labels[i+2]||y-half>=labels[i+3])continue;
    // Only reserve a caption that is within this dancer's possible note lane.
    if(L.left?labels[i+1]<=L.outer+18:labels[i]>=L.outer-18)continue;
    limit=L.left?Math.min(limit,labels[i]):Math.max(limit,labels[i+1]);
  }
  return limit;
}
function dnNoteClear(F,x,y,hw,hh){
  const x0=x-hw,x1=x+hw,y0=y-hh,y1=y+hh;
  for(const a of F.sides){
    if(dnBoxIntersects(x0,x1,y0,y1,a.body,a.bodyUsed))return false;
  }
  return !dnBoxIntersects(x0,x1,y0,y1,F.captions,F.captionUsed);
}
function dnLaneSide(g,F,L,side,t,now,calm){
  const D=DANCE,notes=D.pat,size=L.size,line=F.line,near=L.near;
  const start=side?D.peerRead.first:D.first;
  const trailing=Math.max(0,side?D.push:-D.push),quiet=F.touch;
  const dim=1-.12*trailing;
  near.fill(0);
  let i=start;
  for(;i<notes.length;i++){
    const n=notes[i],until=n.t-t;
    if(until>F.lead)break;
    if(!(side?D.otherNotes[i]:n.j))near[n.d]=Math.max(near[n.d],1-Math.abs(until)*(until>=0?2.2:4));
  }
  const r=size*.44+4;
  for(let d=0;d<4;d++){
    const x=L.x[d],pulse=near[d],miss=now-L.dim[d]<.25;
    const age=now-L.hitAt[d],pop=calm||age<0||age>.43?0:(1-age/.43)*(L.hitGrade[d]===DN_PERFECT?.22:L.hitGrade[d]===DN_GOOD?.12:.06);
    const f=size*(.96+pop*(quiet?.52:1));
    dnLaneDamage(F,x,line,f*.73+2);
    g.globalAlpha=(miss?.55:.96+pulse*.04)*dim;
    g.drawImage(quiet?F.quiet[d]:F.receptors[d],x-f/2,line-f/2,f,f);
    if(age>=0&&age<.24){
      const hot=1-dnEase(age/.24);
      g.globalAlpha=hot*(L.hitGrade[d]===DN_PERFECT?.86:.56);
      g.fillStyle='#fffcee';dnCircle(g,x,line,f*.34);g.fill();
      g.drawImage(F.art[d],x-f*.29,line-f*.29,f*.58,f*.58);
    }
    if(pulse>0&&!miss&&age>.16){
      g.globalAlpha=pulse*.72;
      g.drawImage(F.glow[d],x-f*.70,line-f*.70,f*1.40,f*1.40);
      g.strokeStyle=DN_NOTE_INK[d];g.lineWidth=Math.max(4,size*.070);
      dnCircle(g,x,line,f*.415);g.stroke();
      g.strokeStyle='#fffce7';g.lineWidth=Math.max(2,size*.034);g.stroke();
    }
  }
  const note=L.noteSize*(calm?1:1+.045*dnPulse(t,D.profile));
  // The arrow's nose reaches the outside rim on the beat. The socket stays
  // readable until judgment, when the burst takes over at its centre.
  const dock=r+note*.50+6,dir=F.up?-1:1;
  const approach=Math.max(0,Math.abs(F.travel)*F.lead-dock)/F.lead;
  for(let j=start;j<i;j++){
    const n=notes[j];if(side?D.otherNotes[j]:n.j)continue;
    const until=n.t-t;
    if(until<-.15)continue;
    const y=line-dir*(dock+Math.max(0,until)*approach);
    let f=note,x=L.x[n.d],clear=false;
    if(F.up){
      // Keep each note on the target's exact vertical line. A sleeve can
      // hide it briefly, but it never jumps sideways or draws over a face.
      for(let attempt=0;attempt<3&&f>=19;attempt++,f*=.79){
        const r=f*.5+2;
        if(dnNoteClear(F,x,y,r,r)&&!dnBoxIntersects(x-r,x+r,y-r,y+r,F.notes,F.noteUsed)){
          F.noteUsed=dnStoreBox(F.notes,F.noteUsed,x,y,r,r);clear=true;break;
        }
      }
    }else{
    const limit=dnNoteLimit(F,L,y,note*.50+3);
    const left=L.left?L.outer:limit,right=L.left?limit:L.outer;
    if(right-left<26)continue;
    // The whole sprite, including its transparent border, has to fit outside
    // the projected rig and captions. Keep rapid notes from stacking as well.
    const paired=notes[j-1]?.t===n.t||notes[j+1]?.t===n.t;
    f=Math.min(note,(right-left-6)*(paired?.37:.71));
    for(let attempt=0;attempt<3&&f>=19;attempt++,f*=.79){
      const radius=f*.5+2,spread=Math.min(1,(right-left-radius*2)/L.stepWidth);
      const half=L.stepWidth*spread*.5+radius;
      x=clamp(L.mid,left+half,right-half)+(L.x[n.d]-L.mid)*spread;
      if(dnNoteClear(F,x,y,radius,radius)&&!dnBoxIntersects(x-radius,x+radius,y-radius,y+radius,F.notes,F.noteUsed)){
        F.noteUsed=dnStoreBox(F.notes,F.noteUsed,x,y,radius,radius);clear=true;break;
      }
    }
    }
    if(!clear)continue;
    dnLaneDamage(F,x,y,f*.51+4,f*.82+3);
    if(!calm&&until>.045){
      const tail=f*.61,ty=F.up?y+f*.09:y-f*.69;
      if(dnNoteClear(F,x,ty+tail*.5,f*.19,tail*.5)){
        g.globalAlpha=(side?.63:.76)*dim;
        g.drawImage(F.trails[F.up?1:0][n.d],x-f*.19,ty,f*.38,tail);
      }
    }
    const alpha=until<0?Math.max(.70,1+until*1.8):1-.11*clamp(until/F.lead,0,1);
    g.globalAlpha=alpha*(side?.95:1)*dim;
    g.drawImage(F.art[n.d],x-f/2,y-f/2,f,f);
  }
}
function dnCaptionSpot(F,x,y,hw,hh){
  if(x-hw<F.safe||x+hw>F.width-F.safe)return false;
  for(const a of F.sides){
    if(x-hw<a.headRight+7&&x+hw>a.headLeft-7&&y-hh<a.headBottom+5&&y+hh>a.headTop-5)return false;
  }
  return !dnBoxIntersects(x-hw,x+hw,y-hh,y+hh,F.captions,F.captionUsed);
}
function dnLaneLabel(g,F,L,side,now,calm){
  const D=DANCE,age=now-L.shownAt,show=age>=0&&age<DN_RATING_HOLD+.23;
  const leading=(side?D.osc-D.sc:D.sc-D.osc)>=25;
  if(!show&&!L.combo&&!leading)return;
  const grade=L.grade,word=F.words[grade],dude=grade===DN_DUDE,good=grade===DN_GOOD;
  const bounce=calm||!show||dude?1:
    1+(dnGradeScale(grade,age+.018)-1)*.48*(1-dnEase(age/.31));
  const drift=calm||!show?0:dnEase(age/.18);
  const wordH=show?F.wordHeight*(good?.86:1)*bounce:0,wordW=wordH*word.width/word.height;
  const comboH=L.combo?F.comboHeight:0,comboW=comboH*1.58;
  const hw=Math.max(wordW,comboW)*.5+5;
  const hh=(wordH+comboH+(show&&comboH?4:0))*.5+3;
  const temple=lerp(L.headTop,L.headBottom,.34);
  const sideY=clamp(temple+hh*.31,F.scoreBottom+7+hh,(F.up?F.bandBottom:F.line)-hh-14);
  const outer=L.left?L.headLeft-hw-10:L.headRight+hw+10;
  const inner=L.left?L.headRight+hw+10:L.headLeft-hw-10;
  let x=outer,y=sideY;
  if(F.compact||!dnCaptionSpot(F,x,y,hw,hh)){
    x=inner;
    if(F.compact||!dnCaptionSpot(F,x,y,hw,hh)){
      const mid=F.width*.5;
      x=clamp(L.headX,L.left?F.safe+hw:mid+hw,L.left?mid-hw:F.width-F.safe-hw);
      y=Math.max(F.scoreBottom+7+hh,L.headTop-9-hh);
    }
  }
  let top=y-hh+3;
  if(comboH){
    F.captionUsed=dnStoreBox(F.captions,F.captionUsed,x,top+comboH*.5,comboW*.5+2,comboH*.5+2);
    dnLaneDamage(F,x,top+comboH*.5,comboW*.53,comboH*.55);
    g.globalAlpha=1;g.drawImage(L.comboArt,x-comboW*.5,top,comboW,comboH);
    top+=comboH+4;
  }
  if(show){
    const shake=dude&&!calm?Math.sin(age*72)*4*(1-dnEase(age/.26)):0;
    const rx=x+shake,ry=top-F.wordHeight*.14*drift;
    F.captionUsed=dnStoreBox(F.captions,F.captionUsed,rx,ry+wordH*.5,wordW*.5+4,wordH*.5+4);
    dnLaneDamage(F,rx,ry+wordH*.5,wordW*.57+4,wordH*.63+4);
    g.globalAlpha=1-dnEase((age-DN_RATING_HOLD)/.23);
    g.drawImage(word,rx-wordW*.5,ry,wordW,wordH);
  }
  if(leading){
    const s=F.comboHeight*.37,cx=L.headX,cy=L.headTop-s*.36;
    if(cy-s*.5>F.scoreBottom+5){
      dnLaneDamage(F,cx,cy,s*.75,s*.55);
      g.globalAlpha=1;g.drawImage(F.crown,cx-s*.7,cy-s*.5,s*1.4,s);
    }
  }
}
function dnMilestoneBanner(g,F,fx,now,calm){
  const age=now-F.comboShown;
  if(age<0||age>=1.65)return;
  const art=F.milestones[fx.tier],q=age/1.65;
  const pop=calm?1:1+.13*(1-dnEase(age/.36))*Math.sin(age*25);
  const w=Math.min(F.width*.51,F.height*.58,610)*pop,h=w*art.height/art.width;
  const x=F.width*.5,y=Math.min(F.height*.80,F.bandBottom-h*.68);
  F.captionUsed=dnStoreBox(F.captions,F.captionUsed,x,y,w*.5+4,h*.5+4);
  dnLaneDamage(F,x,y,w*.52,h*.57);
  g.globalAlpha=1-dnEase((q-.70)/.30);g.drawImage(art,x-w*.5,y-h*.5,w,h);
}
function dnComboBurst(g,F,t){
  const fx=DANCE.stageFx,age=t-fx.celebrate,life=1.05;
  if(age<0||age>=life)return;
  const q=age/life,alpha=1-dnEase((q-.43)/.57),y=F.height*.59,x=F.width*.5;
  const palette=DN_COMBO_EFFECTS[fx.tier];
  // The rays start outside the camera's centre, leaving faces and arrows clear.
  const radius=Math.hypot(x,y),inner=radius*(.48+q*.45),outer=radius*1.15;
  dnLaneDamage(F,x,y,x,y+F.height*.43);
  for(let i=0;i<24;i++){
    const dx=DN_RAY_X[i],dy=DN_RAY_Y[i],wx=DN_RAY_Y[i]*13,wy=-dx*13;
    g.globalAlpha=alpha*(i%2?.43:.67);g.fillStyle=i%2?palette.ink:palette.alt;
    g.beginPath();g.moveTo(x+dx*inner,y+dy*inner);
    g.lineTo(x+dx*outer+wx,y+dy*outer+wy);g.lineTo(x+dx*outer-wx,y+dy*outer-wy);
    g.closePath();g.fill();
    const reach=radius*(.38+q*.66)*(i%3?.89:1.11),s=(i%2?26:42)*(1-q*.47);
    g.globalAlpha=alpha*.86;
    g.drawImage(i%2?F.gold:F.colors[i%4],x+dx*reach-s/2,y+dy*reach-s/2,s,s);
  }
}
function dnLaneDraw(now=performance.now()/1000){
  const D=DANCE,F=D.laneFx,g=F.g,t=D.t;
  if(F.dirty&&!dnLaneLayout(F))return;
  const damage=F.damage,calm=dnCalm();
  for(let k=0;k<F.damageUsed;k+=4)g.clearRect(damage[k],damage[k+1],damage[k+2],damage[k+3]);
  F.damageUsed=F.noteUsed=0;
  const x=(F.scoreLeft+F.scoreRight)*.5,y=(F.scoreTop+F.scoreBottom)*.5;
  F.captionUsed=dnStoreBox(F.captions,0,x,y,(F.scoreRight-F.scoreLeft)*.5+4,(F.scoreBottom-F.scoreTop)*.5+4);
  while(D.peerRead.first<D.pat.length&&D.pat[D.peerRead.first].t<t-.31)D.peerRead.first++;
  if(!calm)dnComboBurst(g,F,t);
  const celebration=D.stageFx.celebrate;
  if(celebration!==F.comboSeen){F.comboSeen=celebration;F.comboShown=now;}
  const comboAge=now-F.comboShown;
  const colorPulse=calm||comboAge>=.42?0:.24*(1-dnEase(comboAge/.42));
  if(colorPulse!==F.comboOpacity){F.comboOpacity=colorPulse;F.comboPulse.style.opacity=colorPulse;}
  for(let side=0;side<2;side++){
    const L=F.sides[side];
    if(L.shownAt===-1)L.shownAt=now;
    for(const b of L.bursts){
      if(b.at!==-1)continue;
      b.at=now;
      if(b.grade===DN_PERFECT)L.pulseAt=now;
      if(b.grade<=DN_OK){L.hitAt[b.d]=now;L.hitGrade[b.d]=b.grade;}
      else if(b.grade===DN_DUDE||b.grade===DN_WHAT)L.dim[b.d]=now;
    }
    if(!calm)for(const b of L.bursts)dnLaneRays(g,F,L,b,now);
    // A hit renews only its dancer's feathered edge pulse. Close hits share
    // a continuous glow, and there is no white full-screen flash.
    const age=now-L.pulseAt,light=calm||age>.34?0:.51*(1-dnEase(age/.34));
    if(light!==L.pulseLight){L.pulseLight=light;L.edge.style.opacity=light;}
  }
  if(!calm){
    const hit=now-F.sides[0].pulseAt,buddy=now-F.sides[1].pulseAt,age=Math.min(hit,buddy);
    if(age>=0&&age<.28){
      const c=D.cam,punch=1-age/.28,shake=(hit<=buddy?.032:.024)*punch*Math.cos(age*41);
      camera.position.x+=c.dz*shake;camera.position.z-=c.dx*shake;
      camera.rotation.z+=shake*.36;
      camera.zoom*=1+.018*punch*punch;camera.updateProjectionMatrix();
    }
  }
  camera.updateMatrixWorld();
  F.projector.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);
  dnProjectBody(F,F.sides[0],D.me);
  dnProjectBody(F,F.sides[1],(DN_TEST?D.bot:MP.peers.get(D.partner))?.av);
  if(celebration>-100)dnMilestoneBanner(g,F,D.stageFx,now,calm);
  for(let side=1;side>=0;side--)dnLaneLabel(g,F,F.sides[side],side,now,calm);
  g.save();g.beginPath();g.rect(0,F.bandTop,F.width,Math.max(1,F.bandBottom-F.bandTop));g.clip();
  dnLaneSide(g,F,F.sides[1],1,t,now,calm);dnLaneSide(g,F,F.sides[0],0,t,now,calm);
  g.restore();
  for(let side=1;side>=0;side--){
    const L=F.sides[side];
    for(const b of L.bursts)dnLaneBurst(g,F,L,b,now,calm,side);
  }
  g.globalAlpha=1;
  if(F.lastMe!==D.sc){F.lastMe=D.sc;F.me.textContent=D.sc;}
  if(F.lastYou!==D.osc){F.lastYou=D.osc;F.you.textContent=D.osc;}
  const bar=DN_BAR_WIDTH[Math.floor(D.bar*1000)];
  if(F.lastBar!==bar){F.lastBar=bar;F.bar.style.width=bar;}
  const share=(D.left?1:-1)*D.push,tug=calm?0:Math.round(-share*Math.min(46,F.width*.025));
  if(tug!==F.tug){
    F.tug=tug;
    F.top.style.setProperty('--dn-tug',tug+'px');
    F.top.style.setProperty('--dn-notch',(50-share*12)+'%');
  }
}
/* Impact feedback is attached to the existing floor and lives only for the round. */
function dnStageStart(){
  dnStageOff();
  const D=DANCE,f=D.floor,c=D.cam,group=new THREE.Group();
  group.position.set(f.x,0,f.z);scene.add(group);
  const stage=D.stageFx={group,ceiling:f.L.ceiling||3.2,celebrate:-100,sweepAt:-100,
    tier:0,tint:-1,slot:0,tiles:[],rings:[],scratch:new THREE.Object3D()};
  stage.comboAt=[-100,-100];stage.comboTier=[0,0];
  stage.comboInk=DN_COMBO_EFFECTS.map(p=>new THREE.Color(p.ink));
  // A feathered pool on the floor with local actor tints, so the spotlight
  // never draws a translucent wall across the moving dancers.
  const light=new THREE.Mesh(new THREE.PlaneGeometry(2.9,2.9),new THREE.ShaderMaterial({
    uniforms:{strength:{value:0}},
    vertexShader:'varying vec2 coord; void main(){coord=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'uniform float strength; varying vec2 coord; void main(){float v=1.-smoothstep(.12,.50,length(coord-.5));gl_FragColor=vec4(1.,.88,.61,v*v*strength);}',
    transparent:true,depthWrite:false}));
  light.rotation.x=-Math.PI/2;light.visible=false;group.add(light);
  stage.light=light;stage.actorTints=[null,null];
  const tileGeo=new THREE.PlaneGeometry(.369,.369),tileCenter=new THREE.Vector3(),chosen=new Set();
  const tiles=D.spots?.userData.funky?.tiles||[];
  for(let i=0;i<8;i++){
    const d=i%4,side=(i<4?D.left:!D.left)?-.83:.83;
    const x=(d<2?-.16:.17)+side,z=d%2?.18:-.18;
    let nearest=null,best=Infinity;
    for(const tile of tiles){
      if(chosen.has(tile))continue;
      tile.getWorldPosition(tileCenter);
      const dx=tileCenter.x-f.x-(c.dz*x+c.dx*z),dz=tileCenter.z-f.z-(-c.dx*x+c.dz*z);
      const dist=dx*dx+dz*dz;
      if(dist<best){best=dist;nearest=tile;}
    }
    if(!nearest)break;
    chosen.add(nearest);nearest.getWorldPosition(tileCenter);
    const mat=new THREE.ShaderMaterial({uniforms:{ink:{value:new THREE.Color(D.style.spark[d])},light:{value:0}},
      vertexShader:'varying vec2 coord; void main(){coord=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'uniform vec3 ink; uniform float light; varying vec2 coord; void main(){vec2 edge=abs(coord-.5)*2.;float trim=smoothstep(.79,.90,max(edge.x,edge.y));gl_FragColor=vec4(mix(ink,vec3(1.,.96,.88),trim*.68),light*(.82+.18*trim));}',
      transparent:true,depthWrite:false});
    const mesh=new THREE.Mesh(tileGeo,mat);mesh.rotation.x=-Math.PI/2;
    mesh.position.set(tileCenter.x-f.x,tileCenter.y+.021,tileCenter.z-f.z);
    mesh.visible=false;group.add(mesh);stage.tiles[i]={mesh,at:-100,perfect:false};
  }
  if(!stage.tiles.length)tileGeo.dispose();
  const ringGeo=new THREE.RingGeometry(.90,1,38);
  for(let i=0;i<6;i++){
    const mat=new THREE.MeshBasicMaterial({color:D.style.perfect,transparent:true,depthWrite:false,opacity:0});
    const mesh=new THREE.Mesh(ringGeo,mat);mesh.rotation.x=-Math.PI/2;
    mesh.position.y=.053+i*.0008;mesh.visible=false;group.add(mesh);
    stage.rings.push({mesh,at:-100,side:0});
  }
  const sparkTex=new THREE.CanvasTexture(D.laneFx.gold);
  const sparkGeo=new THREE.BufferGeometry(),sparkPos=new Float32Array(stage.rings.length*12*3);
  sparkGeo.setAttribute('position',new THREE.BufferAttribute(sparkPos,3).setUsage(THREE.DynamicDrawUsage));
  const sparks=new THREE.Points(sparkGeo,new THREE.PointsMaterial({map:sparkTex,size:.17,color:'#fff5da',
    transparent:true,alphaTest:.13,depthWrite:false}));
  sparks.frustumCulled=false;sparks.visible=false;group.add(sparks);
  stage.sparks=sparks;stage.sparkPos=sparkPos;stage.sparkTex=sparkTex;
  const confetti=new THREE.InstancedMesh(new THREE.PlaneGeometry(.108,.164),
    new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide}),40);
  confetti.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const colors=D.style.lights.map(color=>new THREE.Color(color));
  const scatter=new Float32Array(confetti.count*2);
  for(let i=0;i<confetti.count;i++){
    const a=i*2.399963,r=.32+(i*.173)%1.72;
    scatter[i*2]=Math.sin(a)*r;scatter[i*2+1]=Math.cos(a)*r*.76;
    confetti.setColorAt(i,colors[i%2]);
  }
  confetti.visible=false;confetti.frustumCulled=false;group.add(confetti);
  stage.confetti=confetti;stage.scatter=scatter;
}
function dnStageOff(){
  const D=DANCE,fx=D.stageFx;if(!fx)return;
  dnStageNeutral(fx);scene.remove(fx.group);
  const geometries=new Set();
  for(const item of fx.group.children){geometries.add(item.geometry);item.material.dispose();}
  for(const geometry of geometries)geometry.dispose();
  fx.confetti.dispose();fx.sparkTex.dispose();D.stageFx=null;
}
function dnRestoreTint(state){
  if(!state)return;
  for(const {mesh,original} of state.meshes)mesh.material=original;
  for(const [,mat] of state.materials)mat.dispose();
}
function dnStageNeutral(fx){
  fx.light.visible=false;
  for(let side=0;side<2;side++){dnRestoreTint(fx.actorTints[side]);fx.actorTints[side]=null;}
}
function dnPressureLights(fx,t,calm){
  const D=DANCE,p=D.push,other=(DN_TEST?D.bot:MP.peers.get(D.partner))?.av;
  const leader=p>=0?0:1,strength=Math.abs(p);
  const light=fx.light,c=D.cam;
  light.visible=strength>.014;
  if(light.visible){
    const stance=dnDancerSide(leader);
    light.position.set(c.dz*stance,.075,-c.dx*stance);
    light.material.uniforms.strength.value=strength*.68;
  }
  for(let side=0;side<2;side++){
    const actor=side?other:D.me;
    const age=t-fx.comboAt[side],glow=calm||age<0||age>=1.66?0:1-dnEase(age/1.66);
    let state=fx.actorTints[side];
    if(state&&state.actor!==actor){dnRestoreTint(state);state=fx.actorTints[side]=null;}
    if(!actor)continue;
    if(!state){
      const disco=D.spots?.userData.funky?.disco;
      if(!light.visible&&!glow&&!disco)continue;
      const meshes=[],materials=new Map();
      actor.root.traverse(mesh=>{
        const original=mesh.material;
        if(!mesh.isMesh||!original?.color||original.side===THREE.BackSide)return;
        if(!materials.has(original)){
          const mat=disco?dnDiscoMaterial(original,disco):original.clone();
          if(!disco)mat.onBeforeCompile=original.onBeforeCompile;
          materials.set(original,mat);
        }
        meshes.push({mesh,original});mesh.material=materials.get(original);
      });
      state=fx.actorTints[side]={actor,meshes,materials:[...materials]};
    }
    const shade=(side===leader?1+.14*strength:1-.24*strength)+glow*.24;
    const ink=fx.comboInk[fx.comboTier[side]];
    for(let i=0;i<state.materials.length;i++){
      const pair=state.materials[i],base=pair[0],mat=pair[1];
      mat.color.copy(base.color).multiplyScalar(shade);
      if(mat.emissive)mat.emissive.copy(base.emissive).lerp(ink,glow*.21);
    }
  }
}
function dnStageHit(side,d,t,perfect,combo){
  const D=DANCE,fx=D.stageFx;if(!fx)return;
  const tile=fx.tiles[side*4+d];if(tile){tile.at=t;tile.perfect=perfect;}
  if(perfect){
    const disco=D.spots?.userData.funky?.disco;
    if(disco)disco.strike=t;
    const ring=fx.rings[fx.slot];ring.at=t;ring.side=side;
    ring.mesh.material.color.set(D.style.spark[d]);fx.slot=(fx.slot+1)%fx.rings.length;
    for(let i=0;i<4;i++){
      const neighbour=fx.tiles[side*4+i];
      if(neighbour){neighbour.at=t+(i===d?0:.029+i*.016);neighbour.perfect=true;}
    }
  }
  const tier=DN_MILESTONES.indexOf(combo);
  if(tier>=0){
    fx.tier=tier;fx.celebrate=fx.sweepAt=fx.comboAt[side]=t;fx.comboTier[side]=tier;
  }
  if(combo>=10&&(combo%10===0||combo===25)&&t-fx.sweepAt>.42)fx.sweepAt=t;
}
function dnStageTick(t){
  const D=DANCE,fx=D.stageFx;if(!fx)return;
  const calm=dnCalm();
  dnPressureLights(fx,t,calm);
  for(const tile of fx.tiles){
    const a=(t-tile.at)/(tile.perfect?.74:.29);
    tile.mesh.visible=a>=0&&a<1;
    if(tile.mesh.visible)tile.mesh.material.uniforms.light.value=(1-a)*(tile.perfect?1:.61);
  }
  const positions=fx.sparkPos;
  let offset=0;
  for(const ring of fx.rings){
    const a=(t-ring.at)/.74;
    ring.mesh.visible=!calm&&a>=0&&a<1;
    if(!ring.mesh.visible)continue;
    const c=D.cam,stance=dnDancerSide(ring.side),cx=c.dz*stance,cz=-c.dx*stance;
    ring.mesh.position.x=cx;ring.mesh.position.z=cz;
    ring.mesh.scale.setScalar(.31+Math.sqrt(a)*2.43);ring.mesh.material.opacity=(1-a)*.96;
    if(a>.77)continue;
    for(let i=0;i<12;i++){
      const theta=i*2.399963+ring.at*.69,reach=(.38+.95*a)*(.64+(i%3)*.23);
      positions[offset++]=cx+Math.cos(theta)*reach;
      positions[offset++]=.44+(i%4)*.28+a*.72;
      positions[offset++]=cz+Math.sin(theta)*reach;
    }
  }
  const sparks=fx.sparks;
  sparks.visible=offset>0;
  if(offset){
    sparks.geometry.setDrawRange(0,offset/3);sparks.geometry.attributes.position.needsUpdate=true;
  }
  const win=t-fx.celebrate;
  const tint=win>=0&&win<1.65?fx.tier:-1;
  if(tint!==fx.tint){
    fx.tint=tint;
    const lit=D.spots.userData.funky,theme=DN_COMBO_EFFECTS[tint];
    for(let i=0;i<2;i++){
      const ink=theme?(i?theme.alt:theme.ink):D.style.lights[i];
      lit.spotM[i].color.set(ink);lit.tileM[i].emissive.set(ink);lit.tileM[i].color.set(ink);
    }
  }
  dnConfettiTick(fx,calm?-1:t-fx.sweepAt,1.62);
}
function dnConfettiTick(fx,age,length){
  const confetti=fx.confetti;confetti.visible=age>=0&&age<length;
  if(!confetti.visible)return;
  const part=age/length,o=fx.scratch;
  confetti.material.opacity=Math.min(1,age*12)*(1-part*.87);
  for(let i=0;i<confetti.count;i++){
    const drift=Math.sin(i*1.73+age*3.8)*age*.31;
    o.position.set(fx.scatter[i*2]+drift,fx.ceiling-.15-(i%7)*.065-age*(1.13+(i%4)*.26),fx.scatter[i*2+1]+drift*.65);
    o.rotation.set(i*.47+age*4.8,age*4+i,age*3+i*.91);
    o.updateMatrix();confetti.setMatrixAt(i,o.matrix);
  }
  confetti.instanceMatrix.needsUpdate=true;
}
function dnHudPop(d,pts,perfect){DANCE.popTxt=(perfect?'✨ Perfect +':'+')+pts;DANCE.popT=performance.now()+420;}
/* #dancetest uses the player's actual home and look from this device. Missing
   dance furniture is supplied in memory, and a bot uses the same avatar path. */
function dnTestBoot(){
  SAVEOFF=true;
  const fresh=freshState(),local=readLocal();
  S=Object.assign(fresh,local||{});
  S.home=Object.assign(freshState().home,S.home);
  S.home.items=S.home.items.slice();
  const items=S.home.items;
  let floor=items.find(it=>it.t==='discofloor');
  if(!floor){
    const spots=[[0,-2.85],[2.5,-2],[-2.5,-2],[0,2.25],[2.5,2.25],[-2.5,2.25]];
    const [x,z]=spots.find(([x,z])=>!items.some(it=>!it.f&&FURN[it.t]&&
      Math.abs(it.x-x)<1.2+FURN[it.t].w/2&&Math.abs(it.z-z)<1.2+FURN[it.t].d/2))||spots[0];
    floor={u:'dancetest-floor',t:'discofloor',x,z,r:0,f:0};
    items.push(floor);
  }
  if(!items.some(it=>it.t==='discoball')){
    const dx=-floor.x,dz=-floor.z,len=Math.hypot(dx,dz);
    const ry=len<1?0:Math.atan2(dx,dz);
    items.push({u:'dancetest-ball',t:'discoball',x:clamp(floor.x-Math.sin(ry)*1.15,-5.3,5.3),
      z:clamp(floor.z-Math.cos(ry)*1.15,-4.3,4.3),r:ry,f:floor.f|0,on:1});
  }
  applyHouse();rebuildHome();setLoc('home');
  $('title').hidden=true;$('touch').hidden=true;
  PLAYING=true;
  const f=dnFloor();if(f)dnTestRound(f);
}
function dnTestRound(f){
  P.x=f.x;P.z=f.z;P.yaw=Math.PI;
  audioInit();
  const r=dnRoundId({v:DN_CHART_BUILD,dp:!!DN_PITCH}),bot={peer:'dancetest-bot',nm:'Dance Buddy',av:null,
    dn:{r,st:'go',sc:0,mv:-1,ld:0,k:0}};
  bot.av=makePerson(lookToPerson({hair:'#704d2d',top:'#7fdcb5',style:'short',eyes:'happy',bottom:'#37a4fc'}));
  bakePerson(bot.av);scene.add(bot.av.root);
  DANCE.bot=bot;
  const s=realMs()+4000;
  DANCE.mine={r,w:bot.peer,st:'go',s,sc:0,mv:-1,ld:1,k:0};
  dnBegin(s,bot,1);
  bot.next=0;bot.dn.s=s;bot.events=dnBotPlan(r,DANCE.pat);
}
function dnTestTick(dt){
  hpLights(dt);dnTick(dt);
  floorVis();dnCam(dt);
  const bot=DANCE.bot;
  if(bot&&(DANCE.on||DANCE.res)){
    animPerson(bot.av,dt,false,1);dnPeer(bot,dt);
  }
}
function dnBotPlan(r,chart){
  const random=DanceChart.seeded(DanceChart.seedFor(r+'-bot'));
  const hits=chart.map((_,i)=>i<Math.round(chart.length*.8)),events=[];
  for(let i=hits.length-1;i>0;i--){
    const j=Math.floor(random()*(i+1)),hit=hits[i];hits[i]=hits[j];hits[j]=hit;
  }
  for(const [i,n] of chart.entries()){
    if(hits[i]){
      const roll=random(),error=roll<.68?.025:roll<.89?.146:.23;
      events.push({i,d:n.d,t:n.t+error,grade:dnRating(error)});
    }else{
      const wrong=(n.d+1+(i%3))%4,at=n.t-.04;
      if(i%3!==2&&!chart.some(q=>q.d===wrong&&Math.abs(q.t-at)<=DN_WIN)){
        events.push({i:-1,d:wrong,t:at,grade:DN_WHAT});
      }
      events.push({i,d:n.d,t:n.t+DN_WIN,grade:DN_DUDE});
    }
  }
  return events.sort((a,b)=>a.t-b.t);
}
function dnBotTick(bot,t){
  const D=DANCE,dn=bot.dn;
  while(bot.next<bot.events.length&&bot.events[bot.next].t<=t){
    const e=bot.events[bot.next++];
    if(e.i>=0)D.otherNotes[e.i]=e.grade<=DN_OK?1:2;
    dnRate(1,e.grade,e.d,t);
    if(e.grade>DN_OK)continue;
    dn.sc+=DN_RATINGS[e.grade].points;
    dn.k++;
    const note=D.pat[e.i];
    dnRememberMove(dn,note,e.i,D.tallies[1].combo,e.t,D.profile,D.pat);
  }
}
/* the Dance! spot on the floor of your house and of a house you visit (its place follows the floor) */
DANCE.tg={x:0,z:0,r:2.0,icon:'🕺',label:'Dance!',pri:()=>true,when:()=>dnCan(),act:dnAsk,dnc:1};
/* ===== 🌲 the Tree Park, IN TOWN (24 Nov 2026, the owner: "the monkey trees challenge needs to be in the same world as the real game ... a parkour challenge like we do in Roblox").
   No teleport any more: through the wooden gate in the woods behind the Toy Store (x 74, z -38) a dirt trail leads east into a fenced clearing in the forest (x 92-144, z -60 to -31;
   the town's walkable area reaches out there and only there: walls keep the rest of the east edge at x 80 as before). Three obby paths start side by side at the clearing's west end:
   🟢 Easy, 🟡 Medium, 🔴 Hard. Real jumps (the game's own jump, P.vy/P.jy, the ⬆️ button or Space) from stump to deck to log, a rope bridge, a moving deck, the Hard path's tree tower.
   Checkpoint flags light up when you land on them; touch the ground during a run and you are back on your last checkpoint at once. The timer starts when you leave the start pad and
   stops when you land on the finish; your best time per path is saved (S.tp.best, a new field: old saves simply have none yet). Coins the first time, hardEvent and qEvent at every finish
   as before. A zip line at each finish takes you down to the meadow. The gaps come from the measured jump (run speed, sport level 1, not hungry: 4.26 m on the level; easy at most 60 %,
   medium 80 %, hard 92 % of the most you can jump at that height step; tools/obby/design.py). TP = the park's state; tpTick (every frame after updatePlayer) is the platforms' floor
   physics: where you stand is your floor (P.cy), their sides are solid, walking off one is a fall. Friends see you up there (your floor height P.cy goes with your place: presence cy, main 24 Nov). The old separate place (LOC.treepark,
   run 4) stays as an empty place: a game saved inside it starts at the gate in town ===== */
const TP_Z=-1000,TP={g:null,pl:[],zips:[],signs:[],flags:[],mv:[],run:null,on:null,last:null,pf:0,zone:0,hand:null,mark:null,done:null,el:null,gk:''};
const TP_PATHS={easy:{n:'Easy path',e:'🟢',c:'#5fd4b0',coins:20},medium:{n:'Medium path',e:'🟡',c:'#ffd45c',coins:30},hard:{n:'Hard path',e:'🔴',c:'#ff6b6b',coins:40}};
function tp(){const d=S.tp||(S.tp={done:{},falls:0});if(!d.done)d.done={};if(!d.best||typeof d.best!=='object')d.best={};return d;}
/* the course (from tools/obby/design.py): [kind, x, z, width (x), depth (z), top height, flags, moving]. Kinds: p start pad, s stump (round), d deck, l log, m moving deck.
   Flags: c checkpoint flag, f finish, b a rope bridge from the platform before, t on the Hard path's tree tower. Moving: [axis, how far each way, seconds for a full swing] */
const TP_COURSE={easy:[['p',94,-38.2,2.4,2.4,0.35],
  ['s',97.1,-37.6,1.4,1.4,0.65],['s',99.8,-38.5,1.4,1.4,0.9],['d',103.0,-38.2,2.2,2.2,1.1,'c'],['d',107.4,-38.2,2.2,2.2,1.1,'b'],['l',111.2,-38.7,2.8,0.9,1.35],
  ['s',114.6,-38.1,1.4,1.4,1.6],['d',117.8,-37.1,2.2,2.2,1.85,'c'],['s',121.0,-36.7,1.4,1.4,2.1],['d',124.4,-36.9,2.4,2.4,2.4,'f']],
 medium:[['p',94,-45.4,2.4,2.4,0.35],
  ['s',97.85,-44.6,1.3,1.3,0.7],['s',101.35,-46.1,1.3,1.3,1.05],['d',105.3,-45.4,2.0,2.0,1.4,'c'],['l',110.0,-45.4,3.0,0.7,1.7],['s',114.5,-44.5,1.2,1.2,2.0],
  ['m',117.8,-45.1,1.8,1.8,2.0,'',['x',1.2,6]],['d',121.5,-45.0,2.0,2.0,2.3,'c'],['s',125.6,-45.3,1.2,1.2,2.65],['d',129.8,-43.9,2.4,2.4,3.0,'f']],
 hard:[['p',94,-53.6,2.4,2.4,0.35],
  ['s',98.5,-52.7,1.0,1.0,0.75],['s',102.5,-54.1,1.0,1.0,1.1],['d',106.7,-53.5,1.6,1.6,1.55,'c'],['l',112.0,-53.5,2.6,0.5,1.85],['s',117.05,-52.6,0.9,0.9,2.05],
  ['m',121.2,-53.5,1.4,1.4,2.35,'',['z',1.4,5]],['d',125.3,-53.3,1.6,1.6,2.65,'c'],['s',128.2,-54.3,1.1,1.1,3.05,'t'],['s',130.62,-57.63,1.1,1.1,3.45,'t'],
  ['d',134.53,-56.36,1.1,1.1,3.85,'t'],['s',134.53,-52.24,1.1,1.1,4.25,'ct'],['s',130.62,-50.97,1.1,1.1,4.65,'t'],['d',129.95,-54.3,2.0,2.0,5.1,'ft']]};
const TP_LAND={easy:[139.5,-36.6,.9,0],medium:[139.5,-44.6,.9,0],hard:[121.6,-49.3,-.45,.65]},TP_TOWER=[131.7,-54.3];   /* each finish's zip line: where it lands (a low pad), where it starts (from the finish deck's middle); the tower's trunk */
const TP_MATS={};function tpCrown(c){return TP_MATS[c]||(TP_MATS[c]=toon({color:c,emissive:new THREE.Color(c),emissiveIntensity:.28}));}   /* 🌳 the park's crowns keep their colour on the shady side too (run 4, stage 3) */
function tpTallTree(g,x,z,hh,c,k=1){cyl(g,.42*k,.52*k,hh,'#8f6244',x,0,z,{seg:8,ol:.03});const m=tpCrown(c);sph(g,2.1*k,c,x,hh+.7*k,z,{ws:9,hs:6,mat:m});sph(g,1.5*k,c,x+1.4*k,hh+.1*k,z+.3*k,{ws:8,hs:5,mat:m});sph(g,1.4*k,c,x-1.3*k,hh+.2*k,z-.5*k,{ws:8,hs:5,mat:m});}
function tpIn(x,z){return(x>79.6&&x<=92&&z>-42&&z<-31)||(x>92&&x<144&&z>-60&&z<-31);}   /* in the park (the trail from the gate, then the clearing) */
function tpInside(p,x,z){return p.r?Math.hypot(x-p.x,z-p.z)<=p.r:Math.abs(x-p.x)<=p.w/2&&Math.abs(z-p.z)<=p.d/2;}
function tpNext(p){return p&&p.i>=0?TP.pl.find(q=>q.k===p.k&&q.i===p.i+1)||null:null;}
const tpTime=t=>Math.floor(t/60)+':'+(t%60).toFixed(1).padStart(4,'0');
/* a rope bridge between two decks in a row along x (the plank strip is a platform you walk on) */
function tpBridge(st,a,b){const h=a.h,x0=a.x+a.w/2,x1=b.x-b.w/2,gap=x1-x0,mx=(x0+x1)/2,z=a.z;box(st,gap,.1,.9,'#c99a66',mx,h-.1,z,{ol:.02});
  for(let k=0;k<Math.floor(gap/.5);k++)box(st,.03,.012,.8,'#8f6244',x0+(k+.5)*.5,h,z,{ol:false});
  for(const sd of[-1,1]){for(const u of[.15,gap/2,gap-.15])cyl(st,.05,.05,.95,'#8f6244',x0+u,h,z+sd*.46,{seg:6,ol:.01});box(st,gap,.07,.07,'#e8d7b0',mx,h+.9,z+sd*.46,{ol:.01});box(st,gap,.05,.05,'#e8d7b0',mx,h+.45,z+sd*.46,{ol:false});}
  TP.pl.push({k:a.k,i:-2,t:'w',x:mx,z,w:gap,d:.9,h,r:0,th:.1,posts:[]});}
function tpZipLine(L,st,f,k){const [lx,lz,sx,sz]=TP_LAND[k],lh=.6,ax=f.x+sx,az=f.z+sz,ul=Math.hypot(lx-ax,lz-az),bx=lx-(lx-ax)/ul*.9,bz=lz-(lz-az)/ul*.9;
  for(const [x,z,h] of[[ax,az,f.h],[bx,bz,lh]])cyl(st,.07,.08,2.3,'#8f6244',x,h,z,{seg:7,ol:.012});
  const A=new THREE.Vector3(ax,f.h+2.3,az),B=new THREE.Vector3(bx,lh+2.3,bz),D=B.clone().sub(A),cab=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,D.length(),5),mat('#5a5f8c'));
  cab.position.copy(A).add(B).multiplyScalar(.5);cab.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),D.clone().normalize());st.add(cab);
  /* the landing pad on the meadow */
  cyl(st,1.1,1.15,lh,'#c99a66',lx,0,lz,{seg:18,ol:.02});cyl(st,1.13,1.13,.08,TP_PATHS[k].c,lx,lh-.12,lz,{seg:18,ol:false});
  const pad={k,i:-1,t:'z',x:lx,z:lz,w:2.2,d:2.2,h:lh,r:1.1,th:lh,posts:[]};TP.pl.push(pad);
  const len=D.length(),ux=(bx-ax)/Math.hypot(bx-ax,bz-az),uz=(bz-az)/Math.hypot(bx-ax,bz-az);
  const Z={ax,az,ay:f.h+2.3,bx,bz,by:lh+2.3,T:len/5.5,to:pad,from:f};TP.zips.push(Z);
  inter(L,{x:ax-ux*.9,z:az-uz*.9,r:1.5,icon:'🪢',label:'Ride the zip line!',pri:()=>true,when:()=>TP.on===f&&!P.ride,act:()=>tpZipGo(Z)});}
function buildTreePark(){
  makeLoc('treepark','out',0,TP_Z,[-4,-4,4,4]);   /* the old place (run 4), now empty: an old save made in it starts at the gate in town (tpTick) */
  const L=LOC.city,st=new THREE.Group();L.g.add(st);TP.g=st;const r=seeded(31),TC=()=>TREE_COLS[(r()*TREE_COLS.length)|0];
  /* the walkable area reaches into the park, and only there: walls keep the rest of the town's east edge at x 80 */
  L.bounds.x2=Math.max(L.bounds.x2,144);col(L,80,-200,92,-42);col(L,92,-200,200,-60);col(L,80,-31,200,200);
  /* the forest's own trees in the park get trunks you bump into (they were only scenery out there) */
  for(const [x,z] of [...mapTrees(),...FAR_TREES])if(tpIn(x,z)||tpIn(x+.6,z)||tpIn(x-.6,z)||tpIn(x,z+.6)||tpIn(x,z-.6))colC(L,x,z,.42);
  /* the dirt trail from the gate's path into the park, and the clearing where the three paths start */
  const T=[[79.4,-38],[85.2,-35.2],[92,-35.4]];for(let i=0;i<T.length-1;i++){const [a,b]=[T[i],T[i+1]],len=Math.hypot(b[0]-a[0],b[1]-a[1]);flat(st,2.4,len,'#d9b98a',(a[0]+b[0])/2,.046,(a[1]+b[1])/2,{ry:Math.atan2(b[0]-a[0],b[1]-a[1])});disc(st,1.2,'#d9b98a',b[0],.047,b[1]);}
  flat(st,6.4,21.8,'#d9b98a',95.2,.045,-45.6);
  /* a low log fence round the park (gaps where a forest tree stands in its line) */
  const trees=[...mapTrees(),...FAR_TREES].filter(([x,z])=>x>78&&x<146&&z>-62&&z<-29),clear=(x,z,d)=>!trees.some(([a,b])=>Math.hypot(a-x,b-z)<d);
  for(const [x0,z0,x1,z1] of [[80,-42,92,-42],[92,-42,92,-60],[92,-60,144,-60],[144,-60,144,-31],[144,-31,80.4,-31]]){const len=Math.hypot(x1-x0,z1-z0),n=Math.ceil(len/2.6);let prev=null;
    for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,z=z0+(z1-z0)*i/n,ok=clear(x,z,.75);if(ok)cyl(st,.07,.08,1.0,'#8f6244',x,0,z,{seg:5,ol:false});
      if(prev&&ok&&prev[2]&&clear((x+prev[0])/2,(z+prev[1])/2,.7)){const mx=(x+prev[0])/2,mz=(z+prev[1])/2,l=Math.hypot(x-prev[0],z-prev[1]),ry=Math.atan2(z-prev[1],x-prev[0]);for(const y of[.5,.85])box(st,l,.07,.07,'#b98a5e',mx,y,mz,{ry:-ry,ol:false});}
      prev=[x,z,ok];}}
  /* the Hard path's tree tower: one big tree, its decks on beams round the trunk */
  {const [tx,tz]=TP_TOWER;tpTallTree(st,tx,tz,9.8,TC(),1.35);colC(L,tx,tz,.72);}
  const keys=['easy','medium','hard'],all=[];for(const k of keys)TP_COURSE[k].forEach((q,i)=>all.push([k,i,...q]));
  const near=(x,z,me)=>Math.min(...all.filter(a=>!(a[0]===me[0]&&a[1]===me[1])).map(a=>{const dx=Math.max(0,Math.abs(x-a[3])-a[5]/2),dz=Math.max(0,Math.abs(z-a[4])-a[6]/2);return Math.hypot(dx,dz);}));
  for(const k of keys){const PA=TP_PATHS[k],C=TP_COURSE[k];C.forEach((q,i)=>{const [t,x,z,w,d,h,f='',mv]=q,p={k,i,t,x,z,w,d,h,r:t==='s'||t==='p'?w/2:0,cp:f.includes('c'),fin:f.includes('f'),tw:f.includes('t'),dx:0,dz:0,th:.3,posts:[]};TP.pl.push(p);
    const pc=PA.c,prev=TP.pl.find(o=>o.k===k&&o.i===i-1);
    if(f.includes('b')&&prev)tpBridge(st,prev,p);
    if(p.tw){const [tx,tz]=TP_TOWER,dx=x-tx,dz=z-tz,l=Math.hypot(dx,dz);box(st,l,.16,.16,'#8f6244',tx+dx/2,h-.36,tz+dz/2,{ry:-Math.atan2(dz,dx),ol:.012});}   /* the beam from the trunk */
    if(t==='p'){cyl(st,1.2,1.25,h,'#c99a66',x,0,z,{seg:22,ol:.02});cyl(st,1.22,1.22,.08,pc,x,h-.1,z,{seg:22,ol:false});disc(st,.62,pc,x,h+.004,z,{seg:22});
      const sg=signPlane(PA.e+' '+PA.n,k==='medium'?2.75:2.3,.56,pc,'#3d2c5e');sg.position.set(x-1.62,1.75,z+1.02);sg.rotation.y=-Math.PI/2;L.g.add(sg);TP.signs.push(sg);cyl(st,.07,.08,2.0,'#8f6244',x-1.5,0,z+1.02,{seg:7,ol:.012});colC(L,x-1.5,z+1.02,.12);}
    else if(t==='s'){const rr=w/2;if(!p.tw){cyl(st,.13,.16,h-.2,'#8f6244',x,0,z,{seg:7,ol:.015});p.posts.push([x,z,.16]);}
      cyl(st,rr,rr,.22,'#c99a66',x,h-.22,z,{seg:16,ol:.02});cyl(st,rr+.02,rr+.02,.07,pc,x,h-.15,z,{seg:16,ol:false});disc(st,rr*.55,'#b08257',x,h+.004,z,{seg:16});p.th=.22;}
    else if(t==='l'){const ax=w>d,len=Math.max(w,d),rr=Math.min(w,d)/2;cyl(st,rr,rr,len,'#9b6b4a',x,h-rr,z,{rz:ax?Math.PI/2:0,rx:ax?0:Math.PI/2,center:true,seg:10,ol:.02});
      cyl(st,rr+.015,rr+.015,.14,pc,x,h-rr,z,{rz:ax?Math.PI/2:0,rx:ax?0:Math.PI/2,center:true,seg:10,ol:false});
      for(const s of[-1,1]){const px=ax?x+s*(len/2-.35):x,pz=ax?z:z+s*(len/2-.35);cyl(st,.1,.12,h-2*rr+.06,'#8f6244',px,0,pz,{seg:6,ol:false});p.posts.push([px,pz,.12]);}p.th=2*rr;}
    else if(t==='d'||t==='m'){const g=t==='m'?new THREE.Group():st,ox=t==='m'?0:x,oz=t==='m'?0:z;
      box(g,w,.16,d,'#c99a66',ox,h-.16,oz,{ol:.02});for(let n=1;n<5;n++)box(g,w-.1,.016,.06,'#a06e45',ox,h,oz-d/2+n*d/5,{ol:false});box(g,w+.05,.07,d+.05,pc,ox,h-.23,oz,{ol:false});
      if(t==='m'){g.position.set(x,0,z);bake(g,true);g.userData.keep=1;L.g.add(g);p.mv={ax:mv[0],amp:mv[1],per:mv[2],x0:x,z0:z,g};TP.mv.push(p);p.th=.25;
        const a=mv[0]==='x',e=mv[1]+(a?w:d)/2+.15;box(st,a?2*e:.08,.08,a?.08:2*e,'#8f6244',x,h-.55,z,{ol:false});for(const s of[-1,1])cyl(st,.08,.1,h-.5,'#8f6244',a?x+s*e:x,0,a?z:z+s*e,{seg:6,ol:false});}   /* (its track: a beam with a post at each end) */
      else if(!p.tw){/* a tall tree beside it, on the side farthest from every other platform (never in a jump), else four posts */
        const off=Math.max(w,d)/2+.85,cs=[[off,0],[-off,0],[0,off],[0,-off]].map(([a,b])=>[a,b,near(x+a,z+b,[k,i])]).sort((u,v)=>v[2]-u[2]),[a,b,dd]=cs[0];
        if(dd>=1.4){const tx=x+a,tz=z+b;tpTallTree(st,tx,tz,h+4.6+(i%3)*.5,TC());colC(L,tx,tz,.56);box(st,Math.max(.16,Math.abs(a)),.16,Math.max(.16,Math.abs(b)),'#8f6244',(x+tx)/2,h-.32,(z+tz)/2,{ol:.012});}
        else for(const [sx,sz] of[[-1,-1],[1,-1],[-1,1],[1,1]]){const px=x+sx*(w/2-.15),pz=z+sz*(d/2-.15);cyl(st,.08,.1,h-.16,'#8f6244',px,0,pz,{seg:6,ol:false});p.posts.push([px,pz,.1]);}}}
    if(p.cp){/* 🚩 the checkpoint flag: grey until you land here, then your path's colour */
      const fx=x-w/2+.16,fz=z+d/2-.16;cyl(st,.035,.04,1.75,'#8f6244',fx,h,fz,{seg:6,ol:false});sph(st,.06,'#ffd45c',fx,h+1.78,fz,{ws:6,hs:5,ol:false});
      const fg=new THREE.Group();fg.userData.keep=1;L.g.add(fg);const m=cone(fg,.27,.72,null,fx+.37,h+1.42,fz,{rz:-Math.PI/2,center:true,seg:3,ol:false,s:[1,1,.14],mat:mat('#dcd6cc')});TP.flags.push({p,m,on:mat(pc),off:m.material});p.flag=TP.flags[TP.flags.length-1];}
    if(p.fin){/* 🔔 the finish: a golden bell under a little red roof, the 🏁 banner behind it, and the zip line down to the meadow */
      const bx=x-.25,bz=z+d/2-.35;cyl(st,.06,.07,1.95,'#8f6244',bx,h,bz,{seg:6,ol:false});cone(st,.42,.3,'#d3262f',bx,h+2.05,bz,{seg:6,ol:.012});sph(st,.17,'#ffd45c',bx,h+1.8,bz,{s:[1,.8,1],ws:12,hs:8,ol:.015});cyl(st,.16,.33,.5,'#ffd45c',bx,h+1.3,bz,{seg:16,ol:.02});cyl(st,.37,.37,.07,'#e0a800',bx,h+1.25,bz,{seg:16,ol:.012});
      const fs=signPlane('🏁 Finish',1.4,.46,pc,'#3d2c5e');fs.position.set(x-w/2+.12,h+2.62,z);fs.rotation.y=-Math.PI/2;L.g.add(fs);TP.signs.push(fs);for(const s of[-.65,.65])cyl(st,.05,.05,2.62,'#8f6244',x-w/2+.1,h,z+s,{seg:5,ol:false});
      tpZipLine(L,st,p,k);}
    if(p.cp)inter(L,{x,z,r:Math.max(w,d)/2+.4,icon:'🪜',label:'Climb down (stop the run)',when:()=>TP.on===p&&!P.ride,act:()=>tpDown(p)});});}
  bake(st,true);
  /* the zip-line handle you hang from (shows during a ride), and the turning star over your next platform */
  const hd=new THREE.Group();box(hd,.6,.05,.05,'#5a5f8c',0,0,0,{ol:false});for(const s of[-.22,.22])box(hd,.04,.5,.04,'#e8d7b0',s,-.5,0,{ol:false});box(hd,.5,.04,.04,'#8f6244',0,-.5,0,{ol:false});bake(hd,false);hd.visible=false;hd.userData.keep=1;L.g.add(hd);TP.hand=hd;
  const mk=new THREE.Group();{const m=new THREE.Mesh(starGeo(.42,0,.12),STARM);mk.add(m);hull(mk,starGeo(.42,.042,.12),m,{});}mk.visible=false;mk.userData.keep=1;L.g.add(mk);TP.mark=mk;
  return LOC.treepark;}
/* 🐾 the new Pet Shop's floors (stage 4b; js/02-world.js PSH): you walk up and down the stairs, the floor under you is your height (P.cy); a stair's side,
   the rails round the open middle and the stair holes stop you (you never fall). Pieces on a floor collide only on that floor (CFL) */
function psTick(dt){const L=LOC.pets;if(!L||CUR!==L||!L.psh){PSH.in=0;CFL=0;return;}
  if(!PSH.in){PSH.in=1;PSH.px=P.x;PSH.pz=P.z;}
  if(!PLAYING||CUT||fading||P.sit){PSH.px=P.x;PSH.pz=P.z;CFL=psFl(P.cy||0);return;}
  const c=P.cy||0;let h=psSupport(P.x-L.ox,P.z-L.oz,c);
  if(h===null){const hx=psSupport(P.x-L.ox,PSH.pz-L.oz,c),hz=hx===null?psSupport(PSH.px-L.ox,P.z-L.oz,c):null;if(hx!==null){P.z=PSH.pz;h=hx;}else if(hz!==null){P.x=PSH.px;h=hz;}else{P.x=PSH.px;P.z=PSH.pz;}}   /* (24 Nov: brushing a stair side or a rail slides you along it instead of stopping you dead) */
  if(h!==null)P.cy=Math.abs(h-c)<.01?h:lerp(c,h,Math.min(1,dt*18));
  PSH.px=P.x;PSH.pz=P.z;CFL=psFl(P.cy||0);}
/* ---- the Tree Park's floor physics (in town, 24 Nov 2026) ---- */
function tpMove(){const t=gameMs()/1000;for(const p of TP.mv){const m=p.mv,o=m.amp*Math.sin(t/m.per*TAU),nx=m.ax==='x'?m.x0+o:m.x0,nz=m.ax==='z'?m.z0+o:m.z0;p.dx=nx-p.x;p.dz=nz-p.z;p.x=nx;p.z=nz;m.g.position.set(nx,0,nz);}}   /* the moving decks follow the one clock: friends see them in the same place */
function tpMark(){const mk=TP.mark;if(!mk)return;const R=TP.run,nx=R&&R.go&&CUR&&CUR.id==='city'?tpNext(R.last):null;mk.visible=!!nx;
  if(nx){mk.position.set(nx.x,nx.h+2.3+Math.sin(performance.now()/260)*.14,nx.z);mk.rotation.y=Math.atan2(camera.position.x-nx.x,camera.position.z-nx.z)+Math.sin(performance.now()/500)*.35;}}
function tpTick(dt){const T=TP;
  if(CUR&&CUR.id==='treepark'){if(!fading&&!CUT)exitTo('treepark');return;}   /* the old separate park (a save made inside it): out at the gate in town */
  const city=!!CUR&&CUR.id==='city';if(city&&P.x>60)tpMove();tpMark();
  if(T.hand&&T.hand.visible&&!(P.ride&&P.ride.kind==='zip'))T.hand.visible=false;
  const inz=city&&tpIn(P.x,P.z);T.zone=inz?1:0;
  if(!inz||P.horse||CLIMB){if(T.run)T.run=null;T.on=null;T.pf=(P.cy||0)+P.jy;tpGuide();return;}
  if(P.ride&&P.ride.kind==='zip'){tpZip(dt);tpGuide();return;}
  if(!PLAYING||CUT||fading||P.sit||P.ride){T.pf=(P.cy||0)+P.jy;tpGuide();return;}
  if(T.on&&T.on.mv&&P.jy<=0&&P.vy<=0)[P.x,P.z]=collideXZ(P.x+T.on.dx,P.z+T.on.dz,.3,CUR);   /* a moving deck takes you along */
  const c=P.cy||0,f0=Math.max(T.pf,c+P.jy),grounded=P.jy<=0&&P.vy<=0;let feet=c+P.jy;
  /* solid sides: a platform whose top is above your knees and whose underside is below your head; under a platform, its posts */
  for(const p of T.pl){if(Math.abs(p.x-P.x)>4.5||Math.abs(p.z-P.z)>4.5)continue;
    const bot=p.h-p.th;if(bot>=T.pf+1.6-.001){if(feet+1.6>bot&&tpInside(p,P.x,P.z)){P.jy=Math.max(0,bot-1.6-c);P.vy=Math.min(P.vy,0);feet=c+P.jy;}   /* under it: you bump your head, and its posts are solid */
      for(const [x,z,rr] of p.posts){const q=pushOut(P.x,P.z,.3,{cx:x,cz:z,cr:rr});if(q){P.x=q[0];P.z=q[1];}}}
    else if(p.h>feet+.36&&bot<feet+1.6){const q=p.r?pushOut(P.x,P.z,.3,{cx:p.x,cz:p.z,cr:p.r}):pushOut(P.x,P.z,.3,{x1:p.x-p.w/2,x2:p.x+p.w/2,z1:p.z-p.d/2,z2:p.z+p.d/2});if(q){P.x=q[0];P.z=q[1];}}}
  /* the floor under you: the highest platform top you are over that you were above a moment ago (or can step up onto) */
  let best=0,bp=null;for(const p of T.pl){if(Math.abs(p.x-P.x)>3.5||Math.abs(p.z-P.z)>3.5||p.h>f0+(grounded?.36:.02))continue;if(p.h>best&&tpInside(p,P.x,P.z)){best=p.h;bp=p;}}
  if(best>c){if(grounded||feet<=best+.001){const air=P.jy>.05||P.vy<0;P.cy=best;P.jy=0;P.vy=0;if(air){P.dip=.07;SFX.land();}}else{P.jy=feet-best;P.cy=best;}}
  else if(best<c){P.jy=feet-best;P.cy=best;}   /* walked off an edge (or the deck moved away): the same height, but a lower floor: down you go */
  const on=P.jy<=0&&P.vy<=0&&bp&&Math.abs(bp.h-P.cy)<.01?bp:null;T.on=on;
  const R=T.run;if(R&&!R.go&&on!==R.pad)R.go=true;   /* ⏱ the timer starts when you leave the start pad */
  if(on)tpLand(on);
  if(T.run&&T.run.go&&!on&&(P.cy||0)===0&&P.jy<=0)tpFall();
  if(T.run&&T.run.go&&!UI.open)T.run.t+=dt;
  T.pf=(P.cy||0)+P.jy;tpGuide();}
function tpLand(p){const T=TP;let R=T.run;
  if(p.t==='p'){if(!R||R.k!==p.k||R.go){T.run={k:p.k,t:0,go:false,pad:p,cp:p,last:p,cpn:0,n:T.flags.filter(f=>f.p.k===p.k).length,lit:new Set()};T.done=null;for(const f of T.flags)if(f.p.k===p.k)f.m.material=f.off;if(S.hunger<=0)toast('😋 Too hungry to jump far! Eat something from your 🎒 bag first.',3.2);}else R.t=0;return;}   /* on a start pad: ready (the timer waits at 0:00) */
  if(!R||R.k!==p.k||p.i<0)return;   /* another path's platform, a bridge or a landing pad: nothing */
  if(p.i>R.last.i)R.last=p;
  if(p.cp&&!R.lit.has(p)){R.lit.add(p);R.cp=p;R.cpn=R.lit.size;p.flag.m.material=p.flag.on;SFX.ding();toast('🚩 Checkpoint '+R.cpn+' of '+R.n+'!',1.6);}
  if(p.fin)tpFinish(R);}
function tpPut(p){const n=tpNext(p);P.x=p.x;P.z=p.z;P.cy=p.h;P.jy=0;P.vy=0;P.pitch=-.05;if(n)P.yaw=Math.atan2(-(n.x-p.x),-(n.z-p.z));TP.pf=p.h;TP.on=p;}
function tpFall(){const R=TP.run,p=R.cp,s=tp();if(R.last===R.pad&&p===R.pad){TP.run=null;return;}   /* stepped off the start pad: no run yet */
  s.falls=(s.falls||0)+1;R.last=p;SFX.pop();tpPut(p);toast(p===R.pad?'Whoops! 🍃 Back to the start!':'Whoops! 🍃 Back to checkpoint '+R.cpn+'!',1.8);}   /* a fall: straight back to your last checkpoint (no fade) */
function tpDown(p){if(P.ride)return;SFX.tap();TP.run=null;let at=null;
  for(const [ux,uz] of[[0,1],[0,-1],[-1,0],[1,0]]){const x=p.x+ux*(p.w/2+.7),z=p.z+uz*(p.d/2+.7),q=collideXZ(x,z,.3,CUR);if(Math.hypot(q[0]-x,q[1]-z)<.02&&!TP.pl.some(o=>o.h<2.2&&tpInside(o,x,z))){at=[x,z];break;}}
  if(!at)at=[p.x,p.z+p.d/2+.7];P.x=at[0];P.z=at[1];P.cy=0;P.jy=0;P.vy=0;TP.on=null;TP.pf=0;toast('🪜 Down you go! Jump on a start pad to try again.',2.4);}
function tpFinish(R){const k=R.k,PA=TP_PATHS[k],s=tp(),first=!s.done[k],t=Math.round(R.t*10)/10,old=s.best[k],nb=!(old>0)||t<old;TP.run=null;s.done[k]=1;if(nb)s.best[k]=t;
  TP.done={k,t,nb,old,at:performance.now()};SFX.ding();setTimeout(()=>SFX.yay(),250);addXP('sport',4);
  if(first){S.coins+=PA.coins;popText('+'+PA.coins+' 🪙','coin');}hardEvent('treepark',1);qEvent('treepark');change();
  const all=['easy','medium','hard'].every(q=>s.done[q]);
  toast('🏁 '+PA.n+' in '+tpTime(t)+'!'+(nb&&old>0?' A new best time! 🏆':'')+(first?' +'+PA.coins+' coins.':'')+(all?' All three paths done, you are a tree-top champion! 🏆':' Ride the zip line down! 🪢'),4.5);}
function tpZipGo(Z){if(P.ride||!Z)return;TP.run=null;SFX.pop();P.ride={kind:'zip',Z,t:0};P.jy=0;P.vy=0;if(TP.hand)TP.hand.visible=true;toast('🪢 Hold on tight! Wheee!',1.8);}
function tpZip(dt){const r=P.ride,Z=r.Z;r.t+=dt;const u=Math.min(1,r.t/Z.T),e=u<.15?u*u/.15*.5+u*.5:u;   /* a soft start */
  const x=lerp(Z.ax,Z.bx,e),z=lerp(Z.az,Z.bz,e),y=lerp(Z.ay,Z.by,e)-.35*4*e*(1-e);P.x=x;P.z=z;P.cy=y-2.05;P.jy=0;P.vy=0;P.yaw=Math.atan2(-(Z.bx-Z.ax),-(Z.bz-Z.az));P.moving=false;
  if(TP.hand){TP.hand.position.set(x,y-.08,z);TP.hand.rotation.y=P.yaw;}
  if(u>=1){P.ride=null;if(TP.hand)TP.hand.visible=false;const d=Z.to;P.x=d.x;P.z=d.z;P.cy=d.h;TP.on=d;P.dip=.07;SFX.land();TP.pf=d.h;qEvent('zip');}
  TP.pf=(P.cy||0)+P.jy;}
/* the box at the top of the screen (like the riding lesson's): your path, the timer, checkpoints and your best time */
function tpGuide(){const T=TP;if(!T.el){const d=document.createElement('div');d.id='obGuide';d.hidden=true;d.innerHTML='<div class="lgl"></div><div class="lgd"></div>';document.body.appendChild(d);T.el=d;}
  const R=T.run,D=T.done&&performance.now()-T.done.at<6000?T.done:null,show=PLAYING&&!UI.open&&!CUT&&CUR&&CUR.id==='city'&&(R||D)&&S;let a='',b='',now=false;
  if(show){const best=k=>{const v=S.tp&&S.tp.best&&S.tp.best[k];return v>0?'Best '+tpTime(v):'No best time yet';};
    if(R){const PA=TP_PATHS[R.k];if(!R.go){a=PA.e+' '+PA.n+': ready!';b='Jump off the pad to start the timer · '+best(R.k);}else{a=PA.e+' '+PA.n+' · ⏱ '+tpTime(R.t);b='🚩 Checkpoint '+R.cpn+' of '+R.n+' · '+best(R.k);}}
    else{const PA=TP_PATHS[D.k];a='🏁 '+PA.n+': '+tpTime(D.t);b=D.nb&&D.old>0?'🏆 A new best time!':D.nb?'🏆 Your first best time!':best(D.k);now=true;}}
  const key=show?a+'|'+b+'|'+now:'';if(key===T.gk)return;T.gk=key;T.el.hidden=!show;if(!show)return;T.el.querySelector('.lgl').textContent=a;T.el.querySelector('.lgd').textContent=b;T.el.classList.toggle('now',now);}
/* ===== 📸 run 4, job 15 (item 9): the Photographer job. Rosie offers it like the others. A booking arrives as a text message (a family, a wedding, a birthday, pets with their owners) with the
   place; the map shows the way. At the spot: pick the background (2 or 3 per spot: one button cycles them, the group walks over), tap a person (or walk up and use the action button) for pose
   buttons, then frame, zoom and snap. Pay by how good the photo is (stars 1 to 5, pay 15/35/60/90/120 like the hairstylist): everyone inside the dashed frame and nobody cut off, faces towards
   the camera, everyone posed, the people filling the frame well, the background the client asked for. The client's thank-you message shows the photo. 4 bookings a game day. Touch and
   keyboard (Space snaps, + and - zoom, N = next background, E or a tap on a person = poses). The state object is PHO (PHO.on while a shoot is on; the update guard of job 2 knows it) ===== */
const PT_MAX=4,PT_PAY=[0,30,35,60,90,120],PT_IN=[.88,.84];   /* PT_IN: inside these screen limits (the dashed viewfinder) counts as "in the picture" */
const PT_SPOTS={
  park:{n:'Cozy Park',at:[-22,11.6],bgs:[{id:'fountain',n:'the fountain',g:[-22,15.0],face:Math.PI},{id:'flowers',n:'the flower beds',g:[-28.6,13.6],face:Math.PI*.7},{id:'stage',n:'the Pet Show stage',g:[-33.6,19.4],face:Math.PI*.5}]},
  pond:{n:'Duck Pond',at:[34.6,-31.4],bgs:[{id:'pond',n:'the duck pond',g:[36.2,-33.3],face:0},{id:'bench',n:'the bench',g:[32.6,-37.9],face:Math.PI}]},
  school:{n:'Cozy Town School',at:[-25,-53.2],bgs:[{id:'school',n:'the school door',g:[-25,-56.6],face:0},{id:'flag',n:'the school sign',g:[-22.2,-55.2],face:-.25,at:[-21.6,3.3,-57.5]}]},
  corner:{n:'Flower Corner',at:[-17,-3.6],bgs:[{id:'gate',n:'the garden gate',g:[-17,-6.1],face:0},{id:'hedge',n:'the hedge',g:[-19.8,-6.0],face:.2}]}};   /* (run 4, stage 3: the hedge spot moved 1.8 m east: the pavement tree stood right between the family and the photographer) */
const PT_KINDS={family:{n:'family photo',i:'👨‍👩‍👧',who:3,l:'our family photo'},wedding:{n:'wedding photo',i:'💒',who:2,grown:1,l:'our wedding photo'},birthday:{n:'birthday photo',i:'🎂',who:3,hats:1,l:"my birthday photo with my friends"},pets:{n:'photo with our pets',i:'🐾',who:2,pet:1,l:'a photo with our pet'}};
const PT_POSES=[['smile','😊','Smile'],['wave','👋','Wave'],['peace','✌️','Peace sign'],['jump','🦘','Jump'],['hug','🤗','Hug'],['sit','🧘','Sit']];
const PHO={group:[],on:0,zoom:1,bg:null,inters:0,t:0,last:null,flash:null};
function pt(){const d=S.pt||(S.pt={});if(d.day!==S.day){d.day=S.day;d.done=0;d.wait=rand(4,9);}return d;}
function ptNew(){const d=pt();if(d.o||d.done>=PT_MAX)return false;const kind=pick(Object.keys(PT_KINDS).filter(k=>k!==d.lk)),spot=pick(Object.keys(PT_SPOTS).filter(k=>k!==d.ls)),K=PT_KINDS[kind],Sp=PT_SPOTS[spot],bg=pick(Sp.bgs);
  const pool=Object.keys(WHO).filter(k=>!K.grown||!/^(Grandma|Grandpa|Mrs?\.|Ms\.)/.test(WHO[k].nm)),names=pool.sort(()=>Math.random()-.5).slice(0,K.who),W=WHO[names[0]];
  d.o={id:uid(),kind,spot,bg:bg.id,who:names,pet:K.pet?pick(['dog','cat','bunny']):null,st:'go'};d.lk=kind;d.ls=spot;
  const oth=names.slice(1).map(k=>WHO[k].nm).concat(d.o.pet?['our '+PET_TYPES[d.o.pet].name]:[]),who=oth.length?oth.join(', ')+' and I':'I';   /* (run 4 finish: the writer is "I": "Leo, Zoe and I") */
  const x=`Hi! It's ${W.nm} 😊 Could you take ${K.l} at ${Sp.n}, with ${bg.n} behind us? ${who[0].toUpperCase()+who.slice(1)} will be waiting there! 📸`;
  addMsg('pc','pc',x,{t2:'📸 New booking: '+W.nm});SFX.ding();try{if(navigator.vibrate)navigator.vibrate([120,80,120]);}catch(e){}
  showNote('📸 New booking!',x,false,'📸','pc');change();jobHud(true);return true;}
function ptSpotOf(o){return o&&PT_SPOTS[o.spot];}
function ptTarget(){const o=S.pt&&S.pt.o,Sp=ptSpotOf(o);return Sp?{x:Sp.at[0],z:Sp.at[1]}:null;}
/* the 📸 spot at every photo place: it shows only when your booking is there and not set up yet */
function ptInters(){if(PHO.inters||!LOC.city)return;PHO.inters=1;for(const k in PT_SPOTS){const Sp=PT_SPOTS[k];inter(LOC.city,{x:Sp.at[0],z:Sp.at[1],r:2.4,icon:'📸',label:'Set up the photo',pri:()=>true,when:()=>!!(S&&S.job==='photo'&&S.pt&&S.pt.o&&S.pt.o.spot===k&&S.pt.o.st==='go'),act:()=>ptSetup()});}}
function ptLookOf(id,K,i){const l=Object.assign({},(WHO[id]&&WHO[id].look)||pick(TOWNFOLK));if(K.hats){l.hat='party';l.hatc=pick(['#ff6b6b','#7cc8ff','#ffd45c','#5fd4b0']);}if(K.grown&&i===0){l.top='#ffffff';l.bottom='#ffffff';}return l;}
/* the people (and the pet) of the booking appear at the first background, in a row, facing where the photo is taken from */
function ptSetup(){const d=pt(),o=d.o;if(!o||o.st!=='go')return;o.st='shoot';PHO.bg=null;PHO.zoom=1;if(!PHO.group.length)ptGroup(o);   /* the clients already waiting there are the ones in the photo */
  PHO.on=1;document.body.classList.add('shoot');$('ptvf').hidden=false;$('note').hidden=true;ptPlace(o.bg);ptAside(true);ptMarks();SFX.pop();toast('📸 Pose everyone, then\u00a0Snap!',3.6);change();jobHud(true);}
/* 📸 the booking's people (and its pet), made once: they wait at the place from the moment the booking comes (24 Nov 2026, the owner: "no people actually waiting for the photo": they were made only when you pressed Set up the photo) */
function ptGroup(o){const K=PT_KINDS[o.kind];PHO.group=[];
  o.who.forEach((id,i)=>{const look=ptLookOf(id,K,i),p=makePerson(look);bakePerson(p);scene.add(p.root);const nm=(WHO[id]&&WHO[id].nm)||'Friend';const tg=label(nm,.3);tg.position.y=1.95*(look.scale||1)+.1;tg.material.depthTest=false;tg.renderOrder=30;p.root.add(tg);   /* (run 4, stage 3: a name tag is drawn over anyone nearer the camera, so it is always readable) */
    const m={p,root:p.root,nm,pose:null,t:Math.random()*6,kind:'person',lab:tg};PHO.group.push(m);
    m.tg=inter(LOC.city,{x:0,z:0,r:2.4,pri:()=>true,icon:'🧍',label:()=>(m.pose?PT_POSES.find(q=>q[0]===m.pose)[1]+' ':'')+'Pose: '+nm,act:()=>PHO.on?ptPoseCard(PHO.group.indexOf(m)):ptSetup(),obj:p.root,pt:1,when:()=>!!PHO.on});});   /* (waiting: no button by them, the 📸 spot has it; a tap on one sets the photo up) */
  if(o.pet){const pm=makePet(o.pet,PET_TYPES[o.pet].cols[0]);scene.add(pm.root);const m={p:pm,root:pm.root,nm:PET_TYPES[o.pet].name,pose:'sit',t:0,kind:'pet'};PHO.group.push(m);}}
function ptPlace(bg){const B=ptLine(bg);PHO.bg=B.id;ptBar();ptCamGo(B);}
function ptLine(bg){const o=pt().o,Sp=ptSpotOf(o),B=Sp.bgs.find(b=>b.id===bg)||Sp.bgs[0];const n=PHO.group.length,sx=Math.cos(B.face),sz=-Math.sin(B.face);
  PHO.group.forEach((m,i)=>{const k=i-(n-1)/2,x=B.g[0]+sx*k*1.0,z=B.g[1]+sz*k*1.0;   /* (1 m apart: waving arms went into the next head; run 4, stage 3) */m.x=x;m.z=z;m.y=groundY(x,z);m.root.position.set(x,m.y,z);m.root.rotation.y=B.face;m.face=B.face;if(m.tg){m.tg.x=x;m.tg.z=z;}});return B;}
function ptNextBg(){const o=pt().o,Sp=ptSpotOf(o);if(!PHO.on||!Sp)return;const i=Sp.bgs.findIndex(b=>b.id===PHO.bg);ptPlace(Sp.bgs[(i+1)%Sp.bgs.length].id);SFX.tap();}   /* (the bar shows the background's name; run 4, stage 3: a toast with it sat on the family's legs) */
/* the photo bar (bottom right, where the run and jump buttons are: those hide during a shoot) */
function ptBar(){const o=pt().o,Sp=ptSpotOf(o),bar=$('ptbar');if(!PHO.on||!Sp){bar.hidden=true;bar.innerHTML='';return;}const B=Sp.bgs.find(b=>b.id===PHO.bg)||Sp.bgs[0];
  bar.hidden=false;bar.innerHTML=`<div class="prow"><button class="btn white bg" data-a="ptbg" aria-label="Next background">🏞️ <span>${esc(B.n)}</span> ▸</button><button class="btn white sq" data-a="ptposes" aria-label="Poses">🧍<small>Pose</small></button></div>
    <div class="prow"><button class="btn white sq zm" data-a="ptzoom:-" aria-label="Zoom out">−<small>Zoom out</small></button><button class="btn white sq zm" data-a="ptzoom:+" aria-label="Zoom in">+<small>Zoom in</small></button><button class="btn butter snap" data-a="ptsnap">📸 Snap!</button></div>`;}
ACT.ptbg=()=>ptNextBg();
ACT.ptzoom=w=>{if(!PHO.on)return;PHO.zoom=clamp(w==='+'?PHO.zoom*.82:PHO.zoom/.82,.42,1);SFX.tap();};
function ptPoseCard(i){const m=PHO.group[i];if(!m||m.kind!=='person')return;SFX.tap();toastOff();ptPoseView();   /* (the shoot's hint goes: the card says what to do; run 4, stage 3) */
  const _v=m.root.position.clone();_v.y+=1;_v.project(camera);const right=_v.x<0&&innerWidth>innerHeight;   /* (on a wide screen the card opens on the side away from the person: run 4, stage 3) */
  openPanel(`<div class="hd"><h2>🧍 ${esc(m.nm)}</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><p class="note">Pick a pose</p><div class="grid">${PT_POSES.map(([k,ic,n])=>`<button class="it${m.pose===k?' on':''}" data-a="ptpose:${i}:${k}"><span class="em">${ic}</span><span>${n}</span></button>`).join('')}</div>`,{bottom:true,cls:'ptpose'+(right?' pright':'')});}
/* 📸 on an upright phone a pose card fills the bottom: the camera steps back to where the whole group fits in the frame above it (run 4, stage 3: next to the person only their chin showed above the card) */
function ptPoseView(){if(innerWidth>=innerHeight)return;const Sp=ptSpotOf(pt().o),B=Sp&&Sp.bgs.find(b=>b.id===PHO.bg);if(B)ptCamGo(B);}
ACT.ptposes=()=>{if(!PHO.on)return;SFX.tap();toastOff();ptPoseView();openPanel(`<div class="hd"><h2>🧍 Poses</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><p class="note">A pose for everyone</p>${PHO.group.filter(m=>m.kind==='person').map(m=>{const i=PHO.group.indexOf(m);return`<div class="ptrow"><b>${esc(m.nm)}</b><div class="ptp">${PT_POSES.map(([k,ic,n])=>`<button class="btn ${m.pose===k?'mint':'white'} sq" data-a="ptpose:${i}:${k}" aria-label="${n}">${ic}</button>`).join('')}</div></div>`;}).join('')}`,{bottom:true});};
ACT.ptpose=v=>{const [i,k]=v.split(':'),m=PHO.group[+i];if(!m)return;m.pose=k;SFX.pop();const all=PHO.group.every(q=>q.pose);
  if(document.querySelector('#card .ptrow')){ACT.ptposes();if(all)toast('📸 Everyone is posed! Frame them and\u00a0Snap!',3);return;}
  closePanel();toast(PT_POSES.find(q=>q[0]===k)[1]+' '+m.nm+' will '+PT_POSES.find(q=>q[0]===k)[2].toLowerCase()+'!',2);if(all)setTimeout(()=>toast('📸 Everyone is posed! Frame them and\u00a0Snap!',3),900);};
/* the poses, every frame while the shoot is on */
function ptAnim(dt){for(const m of PHO.group){m.t+=dt;if(m.kind==='pet'){animPet(m.p,dt,false);continue;}const p=m.p,k=m.pose;animPerson(p,dt,false,.6);p.root.position.y=m.y||0;
    if(k==='wave'){p.arms[1].rotation.z=2.8+Math.sin(m.t*9)*.22;p.arms[1].rotation.x=.6;}   /* (run 4 finish: a little forward, in front of the hair: straight up the arm went through Mia's pigtail) */   /* (run 4 finish: a higher wave; the arm swung out into the next person's hair) */else if(k==='peace'){p.arms[1].rotation.z=2.9;p.arms[1].rotation.x=.6;p.head.rotation.z=.12;}
    else if(k==='jump'){const u=Math.max(0,Math.sin(m.t*5));p.root.position.y=(m.y||0)+u*u*.35;p.arms[0].rotation.z=-1.2*u;p.arms[1].rotation.z=1.2*u;}
    else if(k==='hug'){p.arms[0].rotation.z=-1.1;p.arms[1].rotation.z=1.1;p.arms[0].rotation.x=-.5;p.arms[1].rotation.x=-.5;}
    else if(k==='sit'){sitPose(p);p.root.position.y=(m.y||0)-.45;}else if(k==='smile'){p.head.rotation.z=Math.sin(m.t*1.5)*.08;}}}
/* 📸 the snap: the score, the picture, the pay, the thank-you message with the photo */
function ptFrame(){const el=$('ptvf'),R=el&&!el.hidden?el.getBoundingClientRect():null,W=innerWidth,H=innerHeight;if(!R||!R.width)return{x1:-PT_IN[0],x2:PT_IN[0],y1:-PT_IN[1],y2:PT_IN[1]};return{x1:R.left/W*2-1,x2:R.right/W*2-1,y1:1-R.bottom/H*2,y2:1-R.top/H*2};}   /* the frame as it is drawn on this screen, in the camera's -1..1 space */
const PT_RC=new THREE.Raycaster();
/* the four points of a person (or the pet) the photo must hold: the feet, the head and the raised arms at both sides, along the row (run 4, stage 3: a waving hand at the frame's edge was cut off in the photo and still got five stars) */
function ptPts(m,h){const r=m.root,v=new THREE.Vector3(),sx=Math.cos(m.face||0),sz=-Math.sin(m.face||0),w2=m.kind==='pet'?.25:.45;
  return [[0,0],[0,h],[-w2,h*.8],[w2,h*.8]].map(([k,dy])=>v.set(r.position.x+sx*k,r.position.y+dy,r.position.z+sz*k).project(camera).clone());}
function ptBgIn(B,F){const at=B&&(B.at||(B.g?[B.g[0]-Math.sin(B.face||0)*2,1,B.g[1]-Math.cos(B.face||0)*2]:null));if(!at)return true;const v=new THREE.Vector3(at[0],at[1],at[2]).project(camera);   /* (run 4 finish: a background with no point of its own: 2 m behind where the group stands, 1 m up; only the school sign had one, so the bench was "in" a photo of a blue wall) */return v.z<1&&v.x>F.x1&&v.x<F.x2&&v.y>F.y1&&v.y<F.y2;}   /* the background's middle is inside the frame */
function ptSolid(o,own){for(let q=o;q;q=q.parent){if(q===own)return false;if(q.visible===false||q.userData.aside)return false;}   /* (run 4 finish: nor a grandma, who steps out of a shoot) */return !o.isSprite&&!!o.material&&!o.material.transparent&&o.material.side!==THREE.BackSide;}   /* a thing the camera cannot see through (not a name tag, glass or an outline) */
/* nothing between the camera and anyone's chest or head */
function ptView(g){const C=camera.position,objs=[CUR.g,...g.map(k=>k.root)];PT_RC.camera=camera;
  for(const m of g){const h=m.kind==='pet'?.6:1.75*(m.p.b?m.p.b.scale.x:1),r=m.root;
    for(const y of[h*.55,h*.92]){const T=new THREE.Vector3(r.position.x,r.position.y+y,r.position.z),dir=T.clone().sub(C),len=dir.length();dir.normalize();PT_RC.set(C,dir);PT_RC.near=.3;PT_RC.far=Math.max(.4,len-.35);
      if(PT_RC.intersectObjects(objs,true).some(x=>ptSolid(x.object,r)))return false;}}
  return true;}
/* everyone inside the frame (a little in from its edges) and big enough */
function ptFits(F){let minx=1,maxx=-1,miny=1,maxy=-1;for(const m of PHO.group){const h=m.kind==='pet'?.6:1.75*(m.p.b?m.p.b.scale.x:1);
    for(const q of ptPts(m,h)){if(!(q.z<1&&q.x>F.x1+.03&&q.x<F.x2-.03&&q.y>F.y1+.03&&q.y<F.y2-.03))return false;minx=Math.min(minx,q.x);maxx=Math.max(maxx,q.x);miny=Math.min(miny,q.y);maxy=Math.max(maxy,q.y);}}
  return maxy-miny>=.45||maxx-minx>=.5;}
/* 📸 at the start and with every new background the camera steps to a clear spot in front of the group, back just far enough that everyone fits in the frame
   on this screen, tilted so the background shows above them (run 4, stage 3: a tree trunk or the gate stood in front of the family, and an upright phone began
   with the row cut off). You can still walk and zoom from there */
function ptCamGo(B){const g=PHO.group;if(!PHO.on||!g.length||!CUR||CUR.id!=='city')return false;const n=g.length,cx=g.reduce((a,m)=>a+m.x,0)/n,cz=g.reduce((a,m)=>a+m.z,0)/n,F=ptFrame(),
    tv=Math.tan(BASEFOV*PHO.zoom*Math.PI/360),aim=Math.atan(tv*(F.y1+.42*(F.y2-F.y1))),keep=[P.x,P.z,P.yaw,P.pitch];camera.fov=BASEFOV*PHO.zoom;camera.updateProjectionMatrix();
  let fb=null;for(let d=3.4;d<8.05;d+=.3)for(const da of[0,.2,-.2,.4,-.4]){const a=B.face+da,x=cx+Math.sin(a)*d,z=cz+Math.cos(a)*d,q=collideXZ(x,z,.3,CUR);if(Math.hypot(q[0]-x,q[1]-z)>.05)continue;
    P.x=x;P.z=z;P.yaw=a;P.pitch=clamp(Math.atan2(.95-1.5,d)-aim,-.3,.05);updateCamera(0);camera.updateMatrixWorld();
    if(ptFits(F)&&ptBgIn(B,F)){if(ptView(g))return true;if(!fb)fb=[P.x,P.z,P.yaw,P.pitch];}}
  if(fb){[P.x,P.z,P.yaw,P.pitch]=fb;updateCamera(0);camera.updateMatrixWorld();return true;}   /* (run 4 finish: no spot with a clear view: the nearest where everyone fits; the camera stayed where you stood and the feet were out of the frame) */
  [P.x,P.z,P.yaw,P.pitch]=keep;updateCamera(0);camera.updateMatrixWorld();return false;}
function ptHid(m,h){const r=m.root,vis=o=>{for(let q=o;q;q=q.parent)if(q.visible===false)return false;return true;},own=o=>{for(let q=o;q;q=q.parent)if(q===r)return true;return false;};   /* 🌳 someone the photo cannot see: a tree, a post or another of them between the camera and both their chest and their head (run 4, stage 3: a trunk hid one of the family and the photo still got five stars) */
  const objs=[CUR.g,...PHO.group.filter(k=>k!==m).map(k=>k.root)],C=camera.position;let n=0;PT_RC.camera=camera;
  for(const y of [h*.6,h*.9]){const T=new THREE.Vector3(r.position.x,r.position.y+y,r.position.z),dir=T.clone().sub(C),len=dir.length();dir.normalize();PT_RC.set(C,dir);PT_RC.near=.4;PT_RC.far=Math.max(.5,len-.3);
    if(PT_RC.intersectObjects(objs,true).some(x=>!x.object.isSprite&&x.object.material&&!x.object.material.transparent&&x.object.material.side!==THREE.BackSide&&vis(x.object)&&!own(x.object)))n++;}
  return n===2;}
function ptScore(){const o=pt().o,v=new THREE.Vector3(),F=ptFrame();let cut=0,back=0,unposed=0,hid=0,minx=1,maxx=-1,miny=1,maxy=-1;
  for(const m of PHO.group){const r=m.root,h=m.kind==='pet'?.6:1.75*(m.p.b?m.p.b.scale.x:1);
    const pts=ptPts(m,h);
    const inside=pts.every(q=>q.z<1&&q.x>F.x1&&q.x<F.x2&&q.y>F.y1&&q.y<F.y2);if(!inside)cut++;else if(ptHid(m,h))hid++;
    for(const q of pts){minx=Math.min(minx,q.x);maxx=Math.max(maxx,q.x);miny=Math.min(miny,q.y);maxy=Math.max(maxy,q.y);}
    if(m.kind==='person'){const fx=Math.sin(m.face),fz=Math.cos(m.face),dx=camera.position.x-r.position.x,dz=camera.position.z-r.position.z,d=Math.hypot(dx,dz)||1;if((fx*dx+fz*dz)/d<.3)back++;if(!m.pose)unposed++;}}
  const w=Math.max(0,maxx-minx),hh=Math.max(0,maxy-miny),fill=cut?0:(hh>=.45||w>=.5)?1:0;   /* big enough: the people at least 45% of the frame's height (about 5.5 m away) or the row half its width */
  const B=(ptSpotOf(o)||{bgs:[]}).bgs.find(b=>b.id===PHO.bg),bgOk=PHO.bg===o.bg&&ptBgIn(B,F);   /* (run 4, stage 3: the asked background has to be in the photo: the school sign was above the frame and the photo still got five stars) */
  let st=5;if(cut)st--;if(hid)st--;if(back)st--;if(unposed)st--;if(!fill)st--;if(!bgOk)st--;st=Math.max(1,st);
  return {st,cut,hid,back,unposed,fill,bgOk,w:+w.toFixed(2),h:+hh.toFixed(2)};}
function ptFlash(){let f=PHO.flash;if(!f){f=document.createElement('div');f.className='ptflash';document.body.appendChild(f);PHO.flash=f;}f.classList.remove('on');void f.offsetWidth;f.classList.add('on');}
ACT.ptsnap=()=>{if(!PHO.on||CUT||fading)return;const d=pt(),o=d.o;if(!o)return;const sc=ptScore(),pay=PT_PAY[sc.st];
  let pic='',big='';try{const a=camera.aspect||1.6,w=a>=1?960:Math.round(960*a),h=clamp(Math.round(w/a),150,1800);offShot(scene,camera,w,h,0x9fd8ff);const vf=boxOf($('ptvf'));let sx=0,sy=0,sw=w,sh=h;if(vf){sx=clamp(vf.left/innerWidth*w,0,w-8);sy=clamp(vf.top/innerHeight*h,0,h-8);sw=Math.min(w-sx,vf.width/innerWidth*w);sh=Math.min(h-sy,vf.height/innerHeight*h);}
    const cut=(mw,mh,q)=>{const k=Math.min(1,mw/sw,mh/sh),cv=document.createElement('canvas');cv.width=Math.max(8,Math.round(sw*k));cv.height=Math.max(8,Math.round(sh*k));cv.getContext('2d').drawImage(THR.cv,sx,sy,sw,sh,0,0,cv.width,cv.height);return cv.toDataURL('image/jpeg',q);};
    pic=cut(320,400,.7);big=cut(760,900,.86);}catch(e){}   /* (run 4 finish: the card shows a sharp copy, the phone keeps the small one: the photo was 400 px across for the whole screen, then blown up about four times on the card) */   /* the picture is what the dashed frame shows (run 4, stage 3: it was the whole screen) */
  S.ptPics=(S.ptPics||[]).filter(p=>p&&p.id);S.ptPics.push({id:o.id,u:pic});if(pic){PT_DEC=new Image();PT_DEC.src=pic;}   /* (run 4 finish: the phone's copy decoded now, ready when the phone opens: the card shows the sharp one) */while(S.ptPics.length>4)S.ptPics.shift();
  SFX.pop();ptFlash();S.coins+=pay;d.done++;S.ptTotal=(S.ptTotal||0)+1;PHO.last={stars:sc.st,pay,sc};o.st='done';hardEvent('photo',1);qEvent('photo');addXP('friends',3);popText('+'+pay+' 🪙','coin');if(sc.st>=4)setTimeout(()=>SFX.yay(),300);
  const W=WHO[o.who[0]],nm=W?W.nm:'Your client',why=[];if(sc.cut)why.push('someone was cut off');if(sc.hid)why.push('someone was hidden behind something');if(sc.back)why.push('someone was not facing you');if(sc.unposed)why.push('someone had no pose');if(!sc.fill&&!sc.cut)why.push('we are a bit small in the picture');if(!sc.bgOk)why.push('we wanted '+ptSpotOf(o).bgs.find(b=>b.id===o.bg).n+' behind us');
  const line=sc.st===5?pick(['Perfect! We love it! 😍','Wow, what a photo! Thank you! 💕','Just beautiful! Five stars! ✨']):sc.st>=3?'Thank you! Nice photo! 😊'+(why.length?' (Next time: '+why.join(', ')+'.)':''):'Thanks! Hmm… '+why.join(', ')+'. 😅';
  addMsg('pc','pc',line,{t2:'📸 From '+nm,img:o.id});
  openPanel(`<div class="who" style="--c:#ffd45c">📸 ${esc(nm)}</div>${pic?`<img class="ptpic" src="${big||pic}" alt="The photo">`:''}<p class="line">${esc(line).replace(/ (\S+)$/,'\u00a0$1')}</p><p class="earn">${starsHalf5(sc.st)}<br>You got <b>${pay} 🪙</b>!</p><div class="row"><button class="btn mint" data-a="ptbye">👋 Bye!</button></div>`,{bottom:true,lock:true,cls:'ptres'});PHO.res=1;
  $('ptvf').hidden=true;$('ptbar').hidden=true;toastOff();for(const q of PHO.group)if(q.lab)q.lab.visible=false;   /* 📸 the photo is taken: the frame, the bar and the background toast go, the result card has the screen (run 4, stage 3) */
  change();jobHud(true);};
ACT.ptbye=()=>{if(document.querySelector('#card [data-a="ptbye"]'))closePanel();ptLeave();ptClear();const d=pt();d.o=null;d.wait=rand(18,40);change();jobHud(true);setTimeout(()=>{if(PLAYING)toast(d.done>=PT_MAX?`🌟 That's ${PT_MAX} photos today! Great job! More bookings tomorrow.`:'📸 Nice work! The next booking will come soon.',3.4);},400);};
function ptInFan(x,z){if(!FAN.on||!CUR||FAN.loc!==CUR.id)return false;const cx=camera.position.x,cz=camera.position.z;for(const f of FRIEND_ACTORS){if(!f.fan||f.loc!==CUR.id)continue;const dx=f.fan[0]-cx,dz=f.fan[1]-cz,L2=dx*dx+dz*dz||1,u=((x-cx)*dx+(z-cz)*dz)/L2;if(u>.08&&u<.92&&Math.hypot(x-(cx+dx*u),z-(cz+dz*u))<.7)return true;}return false;}   /* 👫 between you and a friend standing round you? A passer-by there steps out of view, like out of a photo (run 4 finish: one stood in front of Luna and Theo) */
function ptInShot(x,z){if(!PHO.on||!PHO.group.length)return false;const m=PHO.group[0],cx=camera.position.x,cz=camera.position.z,dx=m.x-cx,dz=m.z-cz,L2=dx*dx+dz*dz||1;const u=clamp(((x-cx)*dx+(z-cz)*dz)/L2,-.4,1.4);return Math.hypot(x-(cx+dx*u),z-(cz+dz*u))<3;}   /* within 3 m of the line from the camera to the family? */
function ptAside(on){for(const w of PET_ACTORS)if(w.loc==='city'||!on)w.g.visible=!on;for(const f of FRIEND_ACTORS)if(f.mode==='follow'||!on)f.g.visible=!on;}   /* 🐾 your pets and the friends who follow you wait out of the picture during a shoot (run 4, stage 3: they photobombed every photo) */
function ptClear(){ptAside(false);for(const m of PHO.group){scene.remove(m.root);m.root.traverse(o=>{if(o.geometry&&!o.userData.keep)o.geometry.dispose();});}PHO.group=[];PHO.on=0;PHO.res=0;PHO.zoom=1;PHO.bg=null;if(LOC.city)LOC.city.inter=LOC.city.inter.filter(t=>!t.pt);
  document.body.classList.remove('shoot');$('ptvf').hidden=true;ptBar();if(UI.open&&document.querySelector('#card [data-a="ptbye"],#card [data-a^="ptpose"]'))closePanel();}
/* 📸 the photo place you are booked at shows: a cream mat with a pink edge where you stand and a 📸 bobbing above it, while the booking waits (24 Nov 2026, the owner: "an invisible zone":
   the Set up the photo button came up 3.4 m round an empty spot; now it comes up 1.2 m round the mat's edge) */
const PT_MK={},PT_LEAVE=[];
function ptMarks(){const o=S&&S.job==='photo'&&S.pt&&S.pt.o,on=!!(o&&o.st==='go'&&!PHO.on&&LOC.city);
  for(const k in PT_SPOTS){let M=PT_MK[k];const show=on&&o.spot===k;if(!M){if(!show)continue;const Sp=PT_SPOTS[k];M=new THREE.Group();M.position.set(Sp.at[0],groundY(Sp.at[0],Sp.at[1]),Sp.at[1]);
      const d=new THREE.Mesh(new THREE.CircleGeometry(1.0,32),new THREE.MeshBasicMaterial({color:'#fff3c4',transparent:true,opacity:.92,depthWrite:false}));d.rotation.x=-Math.PI/2;d.position.y=.04;M.add(d);
      const r=new THREE.Mesh(new THREE.RingGeometry(1.0,1.16,40),new THREE.MeshBasicMaterial({color:'#ff7aa8',transparent:true,depthWrite:false}));r.rotation.x=-Math.PI/2;r.position.y=.045;M.add(r);
      const pin=label('📸',1.0,{bg:null,bw:0,pad:6});pin.position.y=2.9;M.add(pin);M.pin=pin;LOC.city.dyn.add(M);PT_MK[k]=M;}
    M.visible=show;if(show)M.pin.position.y=2.9+Math.sin(performance.now()/300)*.2;}}
/* 📸 while they wait: they stand where the photo will be taken, facing the street; the one who booked waves when you come near */
function ptWaitAnim(dt){const m0=PHO.group[0],near=m0&&Math.hypot(m0.x-P.x,m0.z-P.z)<14;
  for(const m of PHO.group){m.t+=dt;if(m.kind==='pet'){animPet(m.p,dt,false);continue;}const p=m.p;animPerson(p,dt,false,.6);p.root.position.y=m.y||0;
    if(m===m0&&near){p.arms[1].rotation.z=2.8+Math.sin(m.t*9)*.22;p.arms[1].rotation.x=.6;}}}
/* 📸 after Bye they wave, then walk off along the pavement and are gone */
function ptLeave(){for(const m of PHO.group.splice(0)){if(m.lab)m.lab.visible=false;m.lt=0;PT_LEAVE.push(m);}}
function ptDrop(m){scene.remove(m.root);m.root.traverse(o=>{if(o.geometry&&!o.userData.keep)o.geometry.dispose();});}
function ptLeaveTick(dt){for(let i=PT_LEAVE.length-1;i>=0;i--){const m=PT_LEAVE[i],p=m.p;m.lt+=dt;m.t=(m.t||0)+dt;
  if(!CUR||CUR.id!=='city'||m.lt>7){ptDrop(m);PT_LEAVE.splice(i,1);continue;}
  if(m.lt<1.2){if(m.kind==='pet'){animPet(p,dt,false);continue;}animPerson(p,dt,false,.6);p.root.position.y=m.y||0;p.arms[1].rotation.z=2.8+Math.sin(m.t*9)*.22;p.arms[1].rotation.x=.6;continue;}
  const f=m.face||0,dx=Math.cos(f),dz=-Math.sin(f),q=collideXZ(m.x+dx*1.3*dt,m.z+dz*1.3*dt,.3,LOC.city);m.x=q[0];m.z=q[1];m.y=groundY(m.x,m.z);
  m.root.position.set(m.x,m.y,m.z);m.root.rotation.y=f+Math.PI/2;if(m.kind==='pet')animPet(p,dt,true);else animPerson(p,dt,true,1);}}
function ptTick(dt){const d=pt();ptInters();ptMarks();ptLeaveTick(dt);if(PHO.on&&PHO.res&&!(UI.open&&document.querySelector('#card [data-a="ptbye"]'))){ACT.ptbye();return;}   /* 📸 the result card went another way (the phone or the bag opened over it): the shoot ends as with Bye (run 4 finish: it stayed on, the map and the notepad hidden) */if(S.job!=='photo'){if(PHO.on||PHO.group.length)ptClear();return;}
  if(!d.o&&d.done<PT_MAX&&!CUT&&isDaytime()&&CUR&&CUR.id==='city'){d.wait-=dt;if(d.wait<=0)ptNew();}
  if(PHO.on){if(CUR.id!=='city'){ptClear();if(d.o)d.o.st='go';}else{ptAnim(dt);tagsApart(PHO.group.filter(m=>m.lab&&m.lab.visible).map(m=>({tag:m.lab})));}}
  else if(d.o&&d.o.st==='go'&&CUR.id==='city'){if(!PHO.group.length){ptGroup(d.o);ptLine(d.o.bg);}ptWaitAnim(dt);}else if(PHO.group.length)ptClear();   /* 📸 the clients wait at the place (they go when you leave town, and come back with you) */   /* (the family's name tags step apart on screen) */
  if(d.o&&d.o.st==='shoot'&&!PHO.on)d.o.st='go';   /* (a shoot that was cut short, e.g. by a reload: set it up again) */
  if(S.intro&&!S.ptTut&&!TUT&&!DTUT&&!UI.open&&!CUT&&!fading&&PLAYING){PHO.t+=dt;if(PHO.t>.8)ptTutStart();}else PHO.t=0;}
const PT_TUT=[{t:'Photographer 📸',x:'A booking comes as a message.',pic:'f1'},{t:'Go there 🗺️',x:'Follow the dot to the place.',pic:'f2'},{t:'Poses 🧍',x:'Pick a background, tap each person for a pose.',pic:'f3'},{t:'Snap! 📸',x:'Everyone in, nobody cut off.',pic:'f4'}];
function ptTutStart(){if(TUT||!PLAYING)return;if(UI.open)closePanel();TUT={i:0,pt:1,steps:PT_TUT};$('tut').hidden=false;tutShow();}
$('ptbar').addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;e.stopPropagation();const [k,...r]=b.dataset.a.split(':');if(ACT[k])ACT[k](r.join(':'));});
let PT_DEC=null;
function ptImg(id){const p=(S&&S.ptPics||[]).find(q=>q.id===id);return p&&p.u?`<img class="mimg" src="${p.u}" alt="The photo">`:'<span class="mimg none">📷</span>';}
/* ===== 🎅💗🐰 run 4, job 11: the other holidays at the Flower Corner (the holiday spot of job 4), New Year and the school party ===== */
const HOL_SPOT=[-19.6,-12.6];   /* the holiday spot inside the Flower Corner: the big tree in December, the heart fountain in February; clear of the stepping stones, the mounds and the bushes */
/* 🎅 Santa stands by the tree and gives coins once per real day: 10 on 1 Dec, a little more each day, 300 on 31 Dec */
function santaBuild(L,G,XT){const p=makePerson({skin:'#ffe0c2',hair:'#ffffff',style:'short',eyes:'happy',mouth:'smile',top:'#d3262f',sleeve:'#d3262f',bottom:'#d3262f',shoes:'#2e2347',hat:'beanie',hatc:'#d3262f',scale:1.12,nohat:1,round:true});
  {const h=p.head;box(h,.34,.17,.1,'#ffffff',0,-.07,.2,{ol:false});box(h,.22,.06,.05,'#ffffff',0,.1,.225,{ol:false});box(h,.62,.08,.54,'#ffffff',0,.41,0,{ol:false});}   /* a beard, a moustache, the hat's white brim */
  {const h=p.head;box(h,.4,.22,.14,'#ffffff',0,-.13,.22,{ol:false});sph(h,.05,'#ff8a8a',-.14,-.02,.25,{ws:6,hs:5,ol:false});sph(h,.05,'#ff8a8a',.14,-.02,.25,{ws:6,hs:5,ol:false});}   /* a fuller beard and rosy cheeks (run 4, stage 3) */
  const x=XT[0]+2.95,z=XT[1]-.5;p.root.position.set(x,0,z);p.root.rotation.y=.06;G.add(p.root);HOL.santa=p;HOL.santaXZ=[L.ox+x,L.oz+z];holPiece('santa',x,z,0);HOL.n++;   /* 🎅 he faces the gate, where you come in, and waves (not baked: his arm moves; run 4, stage 3: he stood with his back to the path) */
  if(p.arms&&p.arms[1]){p.arms[1].rotation.z=-2.3;const a=p.arms[1];cyl(a,.13,.13,.035,'#ffd45c',0,-.64,.09,{rx:Math.PI/2,center:true,seg:18,ol:.012});cyl(a,.085,.085,.045,'#f2b632',0,-.64,.09,{rx:Math.PI/2,center:true,seg:18,ol:false});}   /* 🪙 a big gold coin in his waving hand: he gives coins (run 4, stage 3) */
  inter(L,{x,z,r:2.2,icon:'🎅',label:'Talk to Santa',act:santaTalk,obj:p.root,hol:1});}
function santaCoins(d){return Math.round(10+(d.getDate()-1)*290/30);}
function santaTalk(){const d=realDate(),key=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();SFX.talk();
  if(S.santa===key){toast('🎅 “Ho ho ho! You had your coins today. Come back tomorrow for a few more!”',3.6);return;}
  const n=santaCoins(d);S.santa=key;S.coins+=n;SFX.coin();SFX.yay();popText('+'+n+' 🪙','coin');
  toast('🎅 “Ho ho ho! Merry Christmas! Here are '+n+' coins for you 🪙 Come again tomorrow!”',4);qEvent('santa');change();}
/* 💗 February: a heart fountain at the holiday spot, hearts on sticks, pink petals drifting over the corner */
function valentineBuild(L,G,st,glows){const [x,z]=HOL_SPOT,PK='#ff9ec4',RD='#ff4d8d';
  cyl(st,1.15,1.25,.42,'#f6e2ee',x,0,z,{seg:24,ol:.02});disc(st,1.05,'#9fd8f2',x,.43,z,{seg:24});cyl(st,.14,.18,.9,'#f6e2ee',x,.42,z,{seg:10,ol:.015});
  heartShape(st,.62,RD,x,1.6,z,0);for(let i=0;i<6;i++){const a=i/6*TAU;heartShape(st,.16,PK,x+Math.cos(a)*.95,.6,z+Math.sin(a)*.95,-a+Math.PI/2);}   /* little hearts round the rim */
  for(let i=0;i<10;i++){const a=i/10*TAU;sph(st,.05,'#bfe9ff',x+Math.cos(a)*.45,.95+(i%2)*.18,z+Math.sin(a)*.45,{ws:6,hs:5,ol:false});}   /* water drops */
  {const c={cx:L.ox+x,cz:L.oz+z,cr:1.3};L.cols.push(c);HOL.cols.push(c);}holPiece('heart fountain',x,z,0);HOL.n++;glows.push([x,1.5,z,1.6,[1,.45,.7]]);
  for(const [hx,hz] of [[-21,-9.4],[-13,-9.4],[-22.3,-16],[-12.1,-15.8]]){heartShape(st,.22,RD,hx,1.1,hz,0);cyl(st,.03,.03,1.0,'#ffffff',hx,0,hz,{seg:6,ol:.01});holPiece('heart',hx,hz,0);HOL.n++;}   /* hearts on sticks by the mounds and bushes */
  garland(st,-32.2,1.9,8.3,-24.2,8.3,[PK,RD,'#ffffff']);garland(st,-19.8,1.9,8.3,-18.6,8.3,[PK,RD,'#ffffff']);garland(st,-13.8,1.9,8.3,-8.3,8.3,[PK,RD,'#ffffff']);HOL.n+=3;   /* (run 4 finish: in two pieces, either side of the park's bus shelter: it ran along the shelter's back, its string through the roof's rim) */
  HOL.petals=petalCloud();HOL.petals.position.set(-17,0,-16);G.add(HOL.petals);}
/* a heart standing up: two round lobes and a turned square for the point (s = size, ry = which way it faces) */
function heartShape(g,s,c,x,y,z,ry){const q=new THREE.Group();q.position.set(x,y,z);q.rotation.y=ry;g.add(q);const o={ol:.012};
  box(q,s*.72,s*.72,s*.3,c,0,0,0,{rz:Math.PI/4,center:true,...o});for(const k of[-1,1])sph(q,s*.37,c,k*s*.26,s*.26,0,{ws:10,hs:8,...o});}
/* pink petals in one Points mesh, drifting across the corner with the breeze (holAnim moves its clock) */
function petalCloud(){const n=140,H=6,W=13,D=17,pos=new Float32Array(n*3),spd=new Float32Array(n),ph=new Float32Array(n),r=seeded(14);
  for(let i=0;i<n;i++){pos.set([(r()-.5)*W,r()*H,(r()-.5)*D],i*3);spd[i]=.35+r()*.35;ph[i]=r()*6.28;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('spd',new THREE.BufferAttribute(spd,1));g.setAttribute('ph',new THREE.BufferAttribute(ph,1));
  const m=new THREE.ShaderMaterial({uniforms:{tm:{value:0},H:{value:H},W:{value:W},pr:{value:Math.min(2,window.devicePixelRatio||1)}},
    vertexShader:`uniform float tm,H,W,pr;attribute float spd,ph;varying float vr;void main(){vec3 p=position;p.y=mod(p.y-tm*spd,H);p.x=mod(p.x+W*.5+tm*.9+sin(tm*.7+ph)*.6,W)-W*.5;p.z+=cos(tm*.5+ph)*.4;vr=ph;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=clamp(55.0/max(1.0,-mv.z),2.0,7.0)*pr;gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`varying float vr;void main(){vec2 c=gl_PointCoord-.5;if(dot(c,c)>.25)discard;gl_FragColor=vec4(1.0,.62+.2*sin(vr),.8,.85);}`,transparent:true,depthWrite:false,fog:false});m.userData.hol=1;
  const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.userData.keep=1;return pts;}
/* 🥚 the Easter egg hunt: a bunny at the Flower Corner asks you to find 25 eggs hidden around town; the same spots for everyone that year (dealt by the year), each player finds their own.
   All 25: the Bunny costume and 50 coins, once a year. Hunt eggs are bigger, banded with gold and sit in a little nest, so no decorative egg looks like one */
const EGG_SPOTS=[[-33.5,12.2],[-30.2,17.8],[-24.6,16.4],[-19.2,18.6],[-12.6,22.4],[-11.4,27.2],[-16.2,31.4],[-23.8,33.2],[-30.6,33.6],[-35.6,24.4],[-36.2,17.6],[-27.4,27.2],
  [-21.6,-10.2],[-12.6,-12.4],[-20.8,-20.8],[-13.2,-22.6],[-16.4,-21.2],[31.4,-33.4],[38.6,-33.8],[30.2,-40.4],[39.4,-39.6],[34.8,-42.6],
  [6.2,-6.4],[9.4,6.6],[-6.8,6.4],[-6.6,-6.6],[52.8,-29.4],[52.6,-12.6],[53.4,21.6],[53.2,37.4],[-52.8,-23.6],[-52.6,-11.2],[-52.4,37.6],
  [-27.6,-55.2],[-20.4,-55.4],[-32.6,-55.6],[-24.6,55.4],[-20.2,56.2],[-30.4,56.8],[-90.2,6.6],[-104.4,-6.6],[-118.6,6.4],[-91.4,-6.8],[-105.2,6.8],[-119.4,-6.4]];
function eggYear(){return realDate().getFullYear();}
function eggSpots(y){const r=seeded(y*977+5),a=EGG_SPOTS.map((p,i)=>[i,p]);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,25);}
function eggState(){const y=eggYear();if(!S)return{y,f:[]};if(!S.egg||S.egg.y!==y)S.egg={y,f:[]};return S.egg;}   /* 🥚 the title's town is decorated before any save is read: then no egg is found yet (run 4, stage 3, G4-001) */
function eggFound(i){return eggState().f.indexOf(i)>=0;}
function eggHuntBuild(L,G){const list=eggSpots(eggYear());HOL.eggs=list.map(([i,[x,z]])=>{const q=collideXZ(x,z,.3,L);return{i,x:q[0],z:q[1]};});
  for(const e of HOL.eggs)inter(L,{x:e.x,z:e.z,r:1.6,icon:'🥚',label:()=>'Pick up the egg ('+eggState().f.length+'/25)',when:()=>!eggFound(e.i),act:()=>eggGet(e.i),hol:1});
  eggsRebuild();
  const m=makePet('bunny','#ffffff'),b=m.root;b.scale.setScalar(2.1);const bx=-16.6,bz=-12.7;   /* (a step aside from the blossom tree: its crown sat on the bunny's head like a hat; run 4, stage 3) */b.position.set(bx,supportAt(bx,bz),bz);b.rotation.y=.3;G.add(b);HOL.bunny=b;HOL.bunnyXZ=[L.ox+bx,L.oz+bz];holPiece('easter bunny',bx,bz,b.position.y);HOL.n++;
  const bw=new THREE.Group();bw.position.set(0,.31,.1);bw.rotation.set(0,0,-.2);m.head.add(bw);bowShape(bw,.7,'#ffd45c',{ol:.006});
  inter(L,{x:bx,z:bz,r:2.3,icon:'🐰',label:'Talk to the Easter Bunny',act:bunnyTalk,obj:b,hol:1});}
function eggsRebuild(){const G=HOL.g;if(!G||!HOL.eggs)return;if(HOL.eggG){G.remove(HOL.eggG);HOL.eggG.traverse(o=>{if(o.geometry)o.geometry.dispose();});}
  const g=new THREE.Group();HOL.eggG=g;G.add(g);const PC=['#ffb3c7','#bfe6ff','#fff1b8','#c9f2e3','#e6dbff','#ffd9b8'];let n=0;
  for(const e of HOL.eggs){if(eggFound(e.i))continue;const y=supportAt(e.x,e.z),c=PC[e.i%6];n++;
    for(let k=0;k<8;k++){const a=k/8*TAU;sph(g,.1,k%2?'#e2c27a':'#cfa95e',e.x+Math.cos(a)*.23,y+.05,e.z+Math.sin(a)*.23,{s:[1.35,.55,1],ry:-a,ws:6,hs:4,ol:false});}   /* the nest: straw tufts in a ring (run 4, stage 3: green cones read as spikes) */
    sph(g,.27,c,e.x,y+.33,e.z,{s:[1,1.3,1],ws:10,hs:8,ol:.014});cyl(g,.28,.28,.08,'#ffc93c',e.x,y+.3,e.z,{seg:14,ol:false});cyl(g,.21,.21,.07,'#ffc93c',e.x,y+.54,e.z,{seg:12,ol:false});}   /* (run 4, stage 3: the white shine ball bulged out of the egg) */   /* 🥚 bigger, golden-banded and nested, so a hunt egg never looks like a decoration (run 4, stage 3) */
  bake(g,true);HOL.eggN=n;}
function eggGet(i){const st=eggState();if(st.f.indexOf(i)>=0)return;st.f.push(i);SFX.pop();SFX.coin();const e=HOL.eggs&&HOL.eggs.find(q=>q.i===i);if(e)floatText('🥚 '+st.f.length+'/25',e.x,1.2,e.z,{h:.6});
  toast(st.f.length>=25?'🥚 That was the last egg! All 25! Go and tell the Easter Bunny at the Flower Corner 🐰':'🥚 Egg '+st.f.length+' of 25! '+(25-st.f.length)+' to go 🐰',3.2);eggsRebuild();qEvent('egg');change();}
function bunnyTalk(){const st=eggState(),y=st.y;SFX.talk();
  if(st.f.length<25){toast(st.f.length?'🐰 “'+st.f.length+' of my 25 eggs found! Keep looking all around town. The prize is a secret! 🤫”':'🐰 “Happy Easter! I hid 25 eggs all around town. Find them all and I have a surprise for you! 🤫”',4);return;}
  if(S.eggDone===y){toast('🐰 “You found them all! Enjoy your Bunny costume 🐰 See you next year!”',3.6);return;}
  S.eggDone=y;S.wardrobe=S.wardrobe||{};S.wardrobe.co_bunny=1;S.coins+=50;SFX.yay();SFX.coin();floatText('🐰 +50 🪙',P.x-Math.sin(P.yaw)*1.4,1.8,P.z-Math.cos(P.yaw)*1.4,{h:.6});
  toast('🐰 “All 25! Hooray! Here is the surprise: a Bunny costume 🐰 and 50 coins 🪙 Try it on at the mirror!”',4.6);qEvent('eggsdone');change();}
/* 🎈 the school party on 1 Sep: balloon bunches around the school and in its hall; the teacher gives a little globe once a year */
const SCH={on:false,g:null,gin:null,cols:[],pieces:0};
function balloonBunch(g,x,z,cols){cyl(g,.025,.03,1.3,'#ffffff',x,0,z,{seg:6,ol:.008});
  cols.forEach((c,k)=>{const a=k/cols.length*TAU+.4,bx=x+Math.cos(a)*.26,bz=z+Math.sin(a)*.26,by=1.78+(k%2)*.22;sph(g,.24,c,bx,by,bz,{s:[1,1.18,1],ws:10,hs:8,ol:.012});cone(g,.035,.07,c,bx,by-.36,bz,{seg:4,ol:false});box(g,.012,by-.36,.012,'#8a8aa0',bx,0,bz,{ol:false});});}
function schoolBuild(){const L=LOC.city,g=new THREE.Group(),C=['#ff6b6b','#ffd45c','#7cc8ff','#5fd4b0','#ff9ec4','#b79cff'],c0=L.cols.length;L.g.add(g);SCH.g=g;SCH.pieces=0;
  [[-28.6,-58.9],[-21.4,-58.9],[-38.6,-58.9],[-11.4,-58.9],[-33.6,-56.0],[-16.4,-56.0],[-31.6,-57.4],[-18.4,-57.4]].forEach(([x,z],k)=>{balloonBunch(g,x,z,[0,1,2,3,4].map(j=>C[(j+k)%6]));colC(L,x,z,.3);SCH.pieces++;holPiece('balloons',x,z,0);});
  bake(g,true);SCH.cols=L.cols.slice(c0);
  {const b=signPlane('🎈 School party today! 🎈',4.2,.7,'#ff6b6b','#ffffff');b.position.set(-26.3,3.25,-57.72);   /* (run 4 finish: a little higher, clear of the little roof over the door: its end covered the roof's front) */g.add(b);SCH.pieces++;}   /* 🎈 a banner from the left door balloons to the school's name board, read from the street (run 4, stage 3; run 4 finish: shorter, clear of the board on its posts right of the door) */
  const I=LOC.school;if(I){const gi=new THREE.Group();I.g.add(gi);SCH.gin=gi;[[-5.0,3.6],[5.0,3.6],[-2.45,-3.98],[2.45,-3.98]].forEach(([x,z],k)=>{balloonBunch(gi,x,z,[4,1,2,5].map(j=>C[(j+k)%6]));SCH.pieces++;});   /* (run 4 finish: the back two stood in front of the 🌈 and 🚀 posters; now between the posters, a step nearer the middle door, and the side doors: seen as you come in) */bake(gi,true);}}
function schoolClear(){const L=LOC.city;for(const G of [SCH.g,SCH.gin]){if(!G)continue;if(G.parent)G.parent.remove(G);G.traverse(o=>{if(o.geometry)o.geometry.dispose();});}SCH.g=null;SCH.gin=null;
  for(const c of SCH.cols){const i=L.cols.indexOf(c);if(i>=0)L.cols.splice(i,1);}SCH.cols=[];SCH.pieces=0;}
function schoolGift(){const d=realDate();if(!schoolParty(d))return false;const y=d.getFullYear();if(S.globe===y)return false;
  S.globe=y;S.home.store=S.home.store||[];S.home.store.push({u:uid(),t:'globe',c:null,x:0,z:0,r:0});SFX.yay();
  toast('👩‍🏫 “Happy first day of school! 🎈 Here is a little globe for your desk 🌍 It is waiting at home in 📦 My stuff.”',4.4);qEvent('globe');change();return true;}
/* 🥳 New Year: the party hats swap in and out at midnight (31 Dec, 1 Jan), confetti falls outdoors on those days, fireworks on the nights of 28 to 31 Dec */
function partySet(on){if(PARTY.on===on)return;PARTY.on=on;PARTY.hats=PARTY.hats.filter(h=>h.parent);PARTY.own=PARTY.own.filter(h=>h.parent);for(const h of PARTY.hats)h.visible=on;for(const h of PARTY.own)h.visible=!on;}
function extraCheck(){if(!LOC.city)return;const d=realDate();partySet(nyeParty(d));const sp=schoolParty(d);if(sp!==SCH.on){SCH.on=sp;schoolClear();if(sp)schoolBuild();}
  FW.want=nyeFireworks(d)&&!!S&&(S.time>=19||S.time<5.5);}
const FW={m:null,want:false,t:0,k:0,next:0,n:0,c:new Float32Array(18),t0:new Float32Array(6).fill(-99)};
function fwBuild(){if(FW.m)return;const B=6,N=130,P2=new Float32Array(B*N*3),Dd=new Float32Array(B*N*3),C=new Float32Array(B*N*3),BI=new Float32Array(B*N),r=seeded(99),cols=[[1,.45,.5],[1,.85,.35],[.5,.8,1],[.55,1,.7],[.8,.6,1],[1,.6,.3]];
  for(let b=0;b<B;b++)for(let i=0;i<N;i++){const k=b*N+i,u=r()*2-1,ph=r()*TAU,s=Math.sqrt(1-u*u),sp=5.5+r()*4.5;Dd.set([s*Math.cos(ph)*sp,u*sp,s*Math.sin(ph)*sp],k*3);C.set(cols[(b+(i%7===0?1:0))%6],k*3);BI[k]=b;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P2,3));g.setAttribute('dir',new THREE.BufferAttribute(Dd,3));g.setAttribute('col',new THREE.BufferAttribute(C,3));g.setAttribute('bi',new THREE.BufferAttribute(BI,1));
  const m=new THREE.ShaderMaterial({uniforms:{tm:{value:0},c:{value:FW.c},t0:{value:FW.t0},pr:{value:Math.min(2,window.devicePixelRatio||1)}},
    vertexShader:`uniform float tm,pr;uniform vec3 c[6];uniform float t0[6];attribute vec3 dir,col;attribute float bi;varying vec3 vc;varying float va;
      void main(){int b=int(bi+.5);float age=(tm-t0[b])/2.0;vc=col;if(age<0.0||age>1.0){gl_Position=vec4(2.0,2.0,2.0,1.0);gl_PointSize=0.0;va=0.0;return;}
      vec3 p=c[b]+dir*age*(1.0-.35*age);p.y-=4.0*age*age;va=(1.0-age*age*age*age)*smoothstep(0.0,.16,age);vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=clamp(820.0/max(1.0,-mv.z),4.0,16.0)*pr*(1.0-.45*age);gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`varying vec3 vc;varying float va;void main(){vec2 q=gl_PointCoord-.5;float d=dot(q,q);if(d>.25)discard;gl_FragColor=vec4(vc+.25*(1.0-d*4.0),va);}`,
    transparent:true,depthWrite:false,fog:false});
  const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.visible=false;scene.add(pts);FW.m=pts;}   /* (run 4 finish: plain blending: sparks lying on each other keep their colour; added up they made a young burst a white blob) */
function fwTick(dt){const on=FW.want&&!!CUR&&CUR.type!=='in';if(!on){if(FW.m)FW.m.visible=false;return;}fwBuild();FW.m.visible=true;FW.t+=dt;FW.m.material.uniforms.tm.value=FW.t;
  if(FW.t>=FW.next){FW.k=(FW.k+1)%6;const a=Math.atan2(-Math.cos(P.yaw),-Math.sin(P.yaw))+rand(-1.05,1.05),d=rand(34,58);FW.c.set([P.x+Math.cos(a)*d,rand(24,36),P.z+Math.sin(a)*d],FW.k*3);FW.t0[FW.k]=FW.t;FW.next=FW.t+rand(.8,1.5);   /* (run 4, stage 3: where you look and more often: most bursts went off behind you) */FW.n++;
    if(cool('fw',.9))tone(rand(70,110),.18,'sine',.035);}}
const CONF={m:null,op:0};
function confBuild(){if(CONF.m)return;const n=560,H=14,W=24,pos=new Float32Array(n*3),spd=new Float32Array(n),ph=new Float32Array(n),col=new Float32Array(n*3),r=seeded(77),cols=[[1,.42,.42],[1,.83,.36],[.49,.78,1],[.37,.83,.69],[.72,.61,1],[1,.62,.77]];
  for(let i=0;i<n;i++){pos.set([(r()-.5)*W,r()*H,(r()-.5)*W],i*3);spd[i]=1.1+r()*1.1;ph[i]=r()*TAU;col.set(cols[i%6],i*3);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('spd',new THREE.BufferAttribute(spd,1));g.setAttribute('ph',new THREE.BufferAttribute(ph,1));g.setAttribute('col',new THREE.BufferAttribute(col,3));
  const m=new THREE.ShaderMaterial({uniforms:{tm:{value:0},op:{value:0},H:{value:H},pr:{value:Math.min(2,window.devicePixelRatio||1)}},
    vertexShader:`uniform float tm,H,pr;attribute float spd,ph;attribute vec3 col;varying vec3 vc;varying float vr;void main(){vec3 p=position;p.y=mod(p.y-tm*spd,H);p.x+=sin(tm*1.3+ph)*.7;p.z+=cos(tm*.9+ph)*.5;vc=col;vr=tm*3.0+ph;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=clamp(150.0/max(1.0,-mv.z),3.0,13.0)*pr;gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`uniform float op;varying vec3 vc;varying float vr;void main(){vec2 q=gl_PointCoord-.5;float c=cos(vr),s=sin(vr);vec2 r=vec2(q.x*c-q.y*s,q.x*s+q.y*c);if(abs(r.x)>.42||abs(r.y)>.22)discard;gl_FragColor=vec4(vc,op);}`,transparent:true,depthWrite:false,fog:false});
  const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.visible=false;scene.add(pts);CONF.m=pts;}
function confTick(dt){const on=PARTY.on&&!!CUR&&CUR.type!=='in';if(!on&&!CONF.m)return;confBuild();CONF.op=clamp(CONF.op+(on?dt:-dt)*.8,0,1);const m=CONF.m;m.visible=CONF.op>0;if(!m.visible)return;
  m.position.set(camera.position.x,camera.position.y-7,camera.position.z);const u=m.material.uniforms;u.tm.value+=dt;u.op.value=CONF.op*.9;}
/* 🦇🐦🦋 a flock: many little creatures in ONE mesh, each flying its own slow loop and flapping, all worked out on the graphics chip.
   items: [{geo (a vertex-coloured, non-indexed geometry built with the usual box/sph helpers), x,y,z (the middle of its loop), ra (loop size), sp (speed), ph (phase), ya (up-down), fl (flap speed)}] */
function flockGeo(build){const g=new THREE.Group();build(g);g.updateMatrixWorld(true);const parts=[];g.traverse(o=>{if(!o.isMesh||o.material.side===THREE.BackSide)return;const src=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();src.applyMatrix4(o.matrixWorld);
    const n=src.attributes.position.count,C=new Float32Array(n*3),c=o.material.color||new THREE.Color('#ffffff');for(let i=0;i<n;i++){C[i*3]=c.r;C[i*3+1]=c.g;C[i*3+2]=c.b;}src.setAttribute('color',new THREE.BufferAttribute(C,3));parts.push(src);});
  let n=0;for(const p of parts)n+=p.attributes.position.count;const P=new Float32Array(n*3),C=new Float32Array(n*3);let off=0;for(const p of parts){P.set(p.attributes.position.array,off*3);C.set(p.attributes.color.array,off*3);off+=p.attributes.position.count;p.dispose();}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('color',new THREE.BufferAttribute(C,3));return geo;}
function flockMesh(items,o){o=o||{};let n=0;for(const it of items)n+=it.geo.attributes.position.count;
  const P=new Float32Array(n*3),C=new Float32Array(n*3),K=new Float32Array(n*3),F=new Float32Array(n*4),W=new Float32Array(n),G=new Float32Array(n);let off=0;
  for(const it of items){const g=it.geo,m=g.attributes.position.count,pa=g.attributes.position.array;P.set(pa,off*3);C.set(g.attributes.color.array,off*3);
    for(let i=0;i<m;i++){const j=off+i;K[j*3]=it.x;K[j*3+1]=it.y;K[j*3+2]=it.z;F[j*4]=it.ph;F[j*4+1]=it.sp;F[j*4+2]=it.ra;F[j*4+3]=it.ya;W[j]=it.wing?(Math.abs(pa[i*3])>.1?1:0)*it.wing:0;G[j]=it.fl||0;}off+=m;g.dispose();}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('color',new THREE.BufferAttribute(C,3));geo.setAttribute('ctr',new THREE.BufferAttribute(K,3));geo.setAttribute('fly',new THREE.BufferAttribute(F,4));geo.setAttribute('wing',new THREE.BufferAttribute(W,1));geo.setAttribute('flp',new THREE.BufferAttribute(G,1));
  let mx=0;for(const it of items)mx=Math.max(mx,Math.hypot(it.x,it.z)+it.ra+3);geo.boundingSphere=new THREE.Sphere(new THREE.Vector3(0,0,0),mx+40);
  const m=new THREE.ShaderMaterial({uniforms:{tm:{value:0},op:{value:1},cp:{value:new THREE.Vector3(0,-999,0)},cr:{value:o.cr||1.3}},transparent:!!o.fade,depthWrite:!o.fade,
    vertexShader:'attribute vec3 ctr;attribute vec4 fly;attribute float wing;attribute float flp;uniform float tm;uniform vec3 cp;uniform float cr;varying vec3 vC;varying float vY;void main(){float th=tm*fly.y+fly.x;vec3 c=ctr+vec3(sin(th)*fly.z,sin(th*1.7+fly.x*2.0)*fly.w,cos(th)*fly.z);vec2 dv=c.xz-cp.xz;float dl=length(dv);if(dl<cr&&dl>0.001)c.xz+=dv/dl*(cr-dl);'+
      'float yaw=atan(cos(th),-sin(th));vec3 p=position;p.y+=wing*sin(tm*flp+fly.x*3.0)*abs(position.x)*0.9;float cs=cos(yaw),sn=sin(yaw);vec3 r=vec3(p.x*cs+p.z*sn,p.y,-p.x*sn+p.z*cs);vC=color;vY=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(c+r,1.0);}',
    fragmentShader:'uniform float op;varying vec3 vC;varying float vY;void main(){gl_FragColor=vec4(vC*(0.82+0.5*clamp(vY,-0.2,0.2)),op);}',vertexColors:true});
  m.userData.hol=1;const mesh=new THREE.Mesh(geo,m);mesh.userData.keep=1;mesh.frustumCulled=false;const cv=new THREE.Vector3();mesh.onBeforeRender=(r,sc,cam)=>{cv.copy(cam.position);mesh.worldToLocal(cv);m.uniforms.cp.value.copy(cv);};   /* 👻 ghosts glide round you 3 m away, butterflies, bats and birds a little nearer: never through the camera (run 4, stage 3) */return mesh;}
/* several quads with a picture (uv kept: bake() would drop it): [x,y,z,w,h,ry] */
function quadsMesh(list,material){const P=[],U=[],I=[],m=new THREE.Matrix4();list.forEach(([x,y,z,w,h,ry],k)=>{const g=new THREE.PlaneGeometry(w,h);m.makeRotationY(ry||0).setPosition(x,y,z);g.applyMatrix4(m);
    const p=g.attributes.position,u=g.attributes.uv;for(let i=0;i<p.count;i++){P.push(p.getX(i),p.getY(i),p.getZ(i));U.push(u.getX(i),u.getY(i));}for(const i of g.index.array)I.push(i+k*4);g.dispose();});
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(P,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));geo.setIndex(I);geo.computeBoundingSphere();const mesh=new THREE.Mesh(geo,material);mesh.userData.keep=1;return mesh;}
/* 🎏 a garland of little flags on a sagging string between two points */
function garland(g,x1,y1,z1,x2,z2,cols){y1=Math.max(y1,2.4);const len=Math.hypot(x2-x1,z2-z1),n=Math.max(3,Math.round(len/.55)),a=Math.atan2(x2-x1,z2-z1);   /* (run 4, stage 3: at least 2.4 m at its posts, so the flags never hang at your eyes: it sagged to 1.55 m right in front of the camera) */
  for(const [x,z] of[[x1,z1],[x2,z2]])cyl(g,.035,.045,y1+.02,'#5a4634',x,0,z,{seg:6,ol:.01});holPiece('garland',(x1+x2)/2,(z1+z2)/2,0,[[x1,y1,z1],[x2,y1,z2]]);   /* 🪵 it hangs between two posts of its own (run 4, item 13: no garland floats in the air) */
  for(let i=0;i<=n;i++){const t=i/n,x=x1+(x2-x1)*t,z=z1+(z2-z1)*t,y=y1-Math.sin(t*Math.PI)*.35;if(i<n){const t2=(i+1)/n,X=x1+(x2-x1)*t2,Z=z1+(z2-z1)*t2,Y=y1-Math.sin(t2*Math.PI)*.35,hl=Math.hypot(X-x,Z-z),sg=box(g,.03,.03,Math.hypot(hl,Y-y)+.02,'#f4ecff',(x+X)/2,(y+Y)/2,(z+Z)/2,{ol:false,center:true});sg.rotation.order='YXZ';sg.rotation.set(Math.atan2(y-Y,hl),a,0);}   /* (run 4, stage 3: every piece of string runs from point to point, one sagging line, and the flags hang right from it) */
    if(i>0&&i<n)cone(g,.14,.3,cols[i%cols.length],x,y-.17,z,{rx:Math.PI,ry:a,center:true,seg:3,ol:false,s:[1,1,.55]});}}   /* (run 4, stage 3: a flag thick enough not to vanish edge-on) */
/* the doors in town: shops (the same list as the Closed signs), the pizzeria, the school, the fire station */
const HOL_DOORS=[[18,-10.98,0],[32,-10.98,0],[18,10.98,Math.PI],[31.5,10.98,Math.PI],[59.48,-31,-Math.PI/2],[59.48,-14,-Math.PI/2],[59.98,20,-Math.PI/2],[58.98,36,-Math.PI/2],[-59.98,-12.5,Math.PI/2],[59.98,8.6,-Math.PI/2],[-25,-59.0,0],[-59.9,-29.6,Math.PI/2],[-59.98,40.5,Math.PI/2]];   /* (run 4, stage 3: the Hair Salon too) */   /* (the school's door is on its front wall at z -59: its wreath used to hang 1.1 m in front of it: run 4, item 13) */
function pumpkin(g,x,z,ry,s){s=s||1;const p=new THREE.Group();p.position.set(x,supportAt(x,z),z);p.rotation.y=ry;g.add(p);sph(p,.27*s,'#ff8a2b',0,.226*s,0,{s:[1,.84,1],ws:10,hs:7,ol:.02});holPiece('pumpkin',x,z,p.position.y-.0008*s);   /* (it used to hover 2.3 cm: run 4, item 13) */cyl(p,.035*s,.045*s,.1*s,'#5fae64',0,.46*s,0,{seg:6,ol:.01});
  for(const sd of[-1,1])cone(p,.05*s,.07*s,'#2e2347',sd*.09*s,.3*s,.255*s,{rx:Math.PI/2,center:true,seg:3,ol:false});box(p,.16*s,.045*s,.02*s,'#2e2347',0,.18*s,.26*s,{ol:false});for(const sd of[-1,1])box(p,.03*s,.035*s,.02*s,'#2e2347',sd*.055*s,.21*s,.262*s,{ol:false});HOL.n++;}
function holBuild(h){const L=LOC.city,G=new THREE.Group(),st=new THREE.Group();G.add(st);L.g.add(G);HOL.g=G;const glows=[];
  if(h==='halloween'){
    for(const [x,z,ry] of HOL_DOORS){const fx=Math.sin(ry),fz=Math.cos(ry),px=x+fx*.75+Math.cos(ry)*.85,pz=z+fz*.75-Math.sin(ry)*.85;pumpkin(st,px,pz,ry,1);glows.push([px,.3,pz,.5,[.9,.42,.08]],[px,supportAt(px,pz)+.03,pz,1.5,1.5,[.5,.23,.05]]);}
    for(const lp of L.lane||[]){const ry=lp.ry,px=lp.sx+Math.cos(ry)*.55,pz=lp.sz-Math.sin(ry)*.55;pumpkin(st,px,pz,ry,.8);glows.push([px,.26,pz,.42,[.9,.42,.08]],[px,supportAt(px,pz)+.03,pz,1.3,1.3,[.5,.23,.05]]);}   /* 🏡 by every sign on Friends Lane */
    for(const [x,z] of [[-84.6,-4.45],[-84.6,4.45]]){pumpkin(st,x+.55,z,Math.PI/2,1.1);glows.push([x+.55,.32,z,.55,[.9,.42,.08]],[x+.55,supportAt(x+.55,z)+.03,z,1.6,1.6,[.5,.23,.05]]);}
    const OP=['#ff8a2b','#8a4de0'];garland(st,-32.2,1.9,8.3,-24.2,8.3,OP);   /* (run 4, stage 3: it starts east of the food truck; it used to hang across the truck's front) */garland(st,-19.8,1.9,8.3,-18.6,8.3,OP);garland(st,-13.8,1.9,8.3,-8.3,8.3,OP);garland(st,-84.6,3.7,-4.45,-84.6,4.45,OP);garland(st,-37.8,3.9,19.85,-37.8,24.15,OP);HOL.n+=5;   /* (run 4 finish: in two pieces, either side of the park's bus shelter: it ran along the shelter's back, its string through the roof's rim) */   /* the stage's garland hangs from the post tops: its pendants used to hang over the Pet Show sign (run 4, job 5) */
    for(const [x,z] of [[-30,-8.3],[-24,-8.3]])garland(st,x-2.6,2.0,z,x+2.6,z,OP);
    /* 🕸️ cobwebs in corners: the Pet Show stage, the lane gate, the bus shelter */
    {const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=2.2;for(let i=0;i<6;i++){x.beginPath();x.moveTo(0,0);const a=i/5*Math.PI/2;x.lineTo(Math.cos(a)*96,Math.sin(a)*96);x.stroke();}
      for(let r=16;r<96;r+=16){x.beginPath();for(let i=0;i<=10;i++){const a=i/10*Math.PI/2,k=r*(1-.08*(i%2));x.lineTo(Math.cos(a)*k,Math.sin(a)*k);}x.stroke();}
      const tx=new THREE.CanvasTexture(c),wm=new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false,side:THREE.DoubleSide});wm.userData.hol=1;
      const webs=[[-37.72,3.3,19.95,.95,.95,Math.PI/2],[-37.72,3.3,24.05,.95,.95,-Math.PI/2],[-84.3,4.3,-4.3,.9,.9,Math.PI/2],[-84.3,4.3,4.3,.9,.9,-Math.PI/2],[-14.8,1.65,7.05,.7,.7,Math.PI],[-17.6,1.65,7.05,.7,.7,0]];   /* (run 4 finish: the bus shelter's two webs hang in its front corners under the roof: they stood up through the roof, a white zig-zag on it) */G.add(quadsMesh(webs,wm));HOL.n+=6;for(const w of webs)holPiece('cobweb',w[0],w[2],0,[[w[0],w[1],w[2]]]);}
    /* 🦇 bats over the park and the lane gate, 👻 little friendly ghosts floating in the park (one mesh each) */
    const bat=()=>flockGeo(g=>{sph(g,.09,'#2e2347',0,0,0,{s:[1,.8,1.3],ws:7,hs:5,ol:false});for(const s of[-1,1]){box(g,.34,.02,.16,'#3d2c5e',s*.25,0,0,{ol:false});box(g,.12,.02,.1,'#3d2c5e',s*.44,0,-.04,{ol:false});}for(const s of[-1,1])cone(g,.03,.06,'#2e2347',s*.05,.09,.02,{seg:3,ol:false});});
    const bats=[];for(let i=0;i<9;i++){const park=i<6;bats.push({geo:bat(),x:park?-24+(i%3)*5:-80,y:5.5+i*.4,z:park?24+Math.floor(i/3)*3:(i-6)*2-2,ra:3+(i%4),sp:.5+(i%3)*.15,ph:i*1.3,ya:.5,wing:1,fl:14+i});}
    G.add(flockMesh(bats));HOL.n+=bats.length;
    const ghost=c=>flockGeo(g=>{sph(g,.26,c,0,.3,0,{ws:10,hs:8,ol:false});cyl(g,.26,.34,.42,c,0,-.12,0,{seg:10,ol:false});for(let i=0;i<5;i++){const a=i/5*TAU;sph(g,.09,c,Math.cos(a)*.27,-.14,Math.sin(a)*.27,{ws:6,hs:5,ol:false});}
      for(const s of[-1,1])sph(g,.045,'#2e2347',s*.09,.34,.24,{ws:6,hs:5,ol:false});sph(g,.05,'#2e2347',0,.2,.25,{s:[1.2,.6,.5],ws:6,hs:5,ol:false});for(const s of[-1,1])sph(g,.04,'#ffb3c7',s*.17,.25,.22,{ws:6,hs:5,ol:false});});
    /* 👻 little friendly ghosts float all over town (run 4, item 31): over the pavements (the walkers' paths, so never inside a building), the park, Friends Lane and the Flower Corner; one batch */
    const GP=[];for(let i=0;i<WE.length;i+=4){const [a,b]=WE[i],A=WP[a],B=WP[b];GP.push([(A[0]+B[0])/2,(A[1]+B[1])/2,.9]);}
    for(const p of [[-30,16,1.6],[-26,30,1.6],[-14,26,1.6],[-34,36,1.4],[-18.2,18.2,1.6],[-92,-3,1.4],[-104,3,1.4],[-118,-3,1.4],[-132,3,1.4],[-20,-11,1.2],[-14,-14,1.2],[-19,-20,1.2],[-13,-22,1.2]])GP.push(p);
    const gh=GP.map((p,i)=>({geo:ghost(i%2?'#f4f2ff':'#e8f6ff'),x:p[0],y:1.4+(i%4)*.22,z:p[1],ra:p[2],sp:.3+(i%5)*.05,ph:i*2.1,ya:.25,wing:0,fl:0}));
    const gm=flockMesh(gh,{cr:3.2});G.add(gm);HOL.n+=gh.length;HOL.ghosts=GP.map(p=>[p[0],p[1]]);
    spookBuild(L,G,st,glows);}
  else if(h==='xmas'){
    /* 🎄 the big tree at the edge of the park plaza, presents under it, lights, wreaths */
    const XT=HOL_SPOT;const T=buildFurn('xmastree');T.scale.setScalar(4.2);T.position.set(XT[0],0,XT[1]);st.add(T);HOL.n++;holPiece('christmas tree',XT[0],XT[1],0);{const c={cx:L.ox+XT[0],cz:L.oz+XT[1],cr:1.7};L.cols.push(c);HOL.cols.push(c);}   /* 🎄 run 4, job 11: the big tree stands at the Flower Corner (the holiday spot) with its presents; Santa beside it */
    santaBuild(L,G,XT);
    {const LM=HOL_BULB_COLS.map(c=>new THREE.MeshBasicMaterial({color:c}));HOL.bulbs=LM;const prof=y=>{let r=0;for(const [cy,cr,ch] of [[.25,.5,.7],[.65,.4,.6],[1.0,.28,.5]]){const b=cy*4.2,t=(cy+ch)*4.2;if(y>=b&&y<=t)r=Math.max(r,cr*4.2*(1-(y-b)/(t-b)));}return r;};   /* the tree's own three cones (the holiday tree furniture, 4.2 times its size) */
    for(let i=0;i<40;i++){const u=i/40,a=u*TAU*3.4,y=1.2+u*4.75,r=prof(y)+.05;   /* (run 4, stage 3: on the branches; a straight spiral hung up to 30 cm off them between the tiers and at the tip) */const m=new THREE.Mesh(new THREE.SphereGeometry(.13,7,6),LM[i%4]);m.position.set(XT[0]+Math.cos(a)*r,y,XT[1]+Math.sin(a)*r);st.add(m);}}   /* 💡 a string of bright bulbs winding up the tree, seen by day too (run 4, stage 3) */
    for(let i=0;i<10;i++){const a=i/10*TAU+.3,r=1.85+(i%2)*.4,x=XT[0]+Math.cos(a)*r,z=XT[1]+Math.sin(a)*r,s=.44+(i%3)*.1,c=['#ff4d6d','#7cc8ff','#ffd45c','#5fd4b0','#b79cff'][i%5];box(st,s,s,s,c,x,0,z,{ry:a,ol:.012});holPiece('present',x,z,0);box(st,s*1.04,s*1.04,s*.18,'#ffffff',x,-s*.02,z,{ry:a,ol:false});box(st,s*.18,s*1.04,s*1.04,'#ffffff',x,-s*.02,z,{ry:a,ol:false});for(const k of[-1,1])sph(st,s*.13,'#ffffff',x+Math.cos(a)*k*s*.12,s*1.08,z-Math.sin(a)*k*s*.12,{ws:6,hs:5,ol:false});   /* (ribbons over the top and a bow: run 4, stage 3) */HOL.n++;}
    for(let i=0;i<24;i++){const a=i/24*TAU,y=1.3+i*.12,tr=Math.max(2.1*(1-(y-1.05)/2.94),1.68*(1-(y-2.73)/2.52),1.18*(1-(y-4.2)/2.1),0)+.14,gx=XT[0]+Math.cos(a)*tr,gz=XT[1]+Math.sin(a)*tr;if(y<2.6&&Math.hypot(gx-XT[0]-2.95,gz-XT[1]+.5)<1.3)continue;glows.push([gx,y,gz,.48,[[1,.3,.3],[.3,.9,.4],[1,.85,.3],[.4,.6,1]][i%4]]);}   /* (run 4, stage 3: smaller, and none right by Santa's face: they blew it out at night) */   /* (run 4, stage 3: the night glows sit on the tree's surface; inside it they showed as bright slivers through the branches) */
    const LC=[[1,.3,.3],[.3,.9,.4],[1,.85,.3],[.4,.6,1]];let k=0;
    for(const [hx,hz,f] of [[13,-58,1],[25,-58,1],[37,-58,1],[13,58,-1],[25,58,-1],[37,58,-1]])for(let x=hx-4;x<=hx+4.01;x+=.65)glows.push([x,3.55,hz+f*.12,.42,LC[k++%4]]);
    for(const [x,z] of LAMPXZ)for(let i=0;i<3;i++){const a=i/3*TAU;glows.push([x+Math.cos(a)*.28,2.55,z+Math.sin(a)*.28,.42,LC[i%4]]);}
    for(const H of HOUSES){if(isApt(H.id))continue;const fx=Math.sin(H.ry),fz=Math.cos(H.ry),x=H.x+fx*.14,z=H.z+fz*.14,w=new THREE.Group();w.position.set(x,1.95,z);w.rotation.y=H.ry;st.add(w);holPiece('wreath',x,z,0,[[x,1.95,z]]);
      const t=new THREE.Mesh(new THREE.TorusGeometry(.3,.07,7,18),mat('#2f7a4a'));w.add(t);for(let i=0;i<6;i++){const a=i/6*TAU;sph(w,.035,i%2?'#ff4d4d':'#ffd45c',Math.cos(a)*.3,Math.sin(a)*.3,.04,{ws:6,hs:5,ol:false});}bowShape(w,.9,'#ff3b4d',{ol:false});w.children[w.children.length-1].position.set(0,.33,.03);HOL.n++;}
    for(const [x,z,ry] of HOL_DOORS){const fx=Math.sin(ry),fz=Math.cos(ry),w=new THREE.Group();w.position.set(x+fx*.1,2.0,z+fz*.1);w.rotation.y=ry;st.add(w);holPiece('wreath',x+fx*.1,z+fz*.1,0,[[x+fx*.1,2.0,z+fz*.1]]);const t=new THREE.Mesh(new THREE.TorusGeometry(.26,.06,7,18),mat('#2f7a4a'));w.add(t);sph(w,.07,'#ff3b4d',0,-.26,.03,{ws:8,hs:6,ol:false});HOL.n++;}
    garland(st,-38.0,1.9,8.3,-24.2,8.3,['#ff4d6d','#5fd4b0','#ffd45c']);garland(st,-19.8,1.9,8.3,-18.6,8.3,['#ff4d6d','#5fd4b0','#ffd45c']);garland(st,-13.8,1.9,8.3,-8.3,8.3,['#ff4d6d','#5fd4b0','#ffd45c']);HOL.n+=3;}   /* (run 4 finish: in two pieces, either side of the park's bus shelter: it ran along the shelter's back, its string through the roof's rim) */
  else if(h==='valentine'){valentineBuild(L,G,st,glows);}   /* 💗 run 4, job 11 */
  else if(h==='easter'){
    const PC=['#ffb3c7','#bfe6ff','#fff1b8','#c9f2e3','#e6dbff','#ffd9b8'],r=seeded(17);
    const egg=(x,z,i)=>{const c=PC[i%6],e=new THREE.Group();e.position.set(x,supportAt(x,z),z);e.rotation.y=r()*TAU;st.add(e);holPiece('egg',x,z,e.position.y-.009);sph(e,.13,c,0,.16,0,{s:[1,1.3,1],ws:9,hs:7,ol:.012});cyl(e,.135,.135,.05,PC[(i+2)%6],0,.14,0,{seg:12,ol:false});for(let k=0;k<4;k++){const a=k/4*TAU;sph(e,.025,PC[(i+4)%6],Math.cos(a)*.125,.23,Math.sin(a)*.125,{ws:5,hs:4,ol:false});}HOL.n++;};
    let i=0;for(const [x,z] of [[-35,14],[-33,17.5],[-30.5,11.5],[-13,16.5],[-11,19],[-12.5,29.5],[-10.5,31],[-15,33],[-34,34],[-32,31.5],[-36,27.5],[-19,36.5],[-24,13],[-18,13.5],[-25.5,34],[-28,36.5]])egg(x,z,i++);
    for(const [x,z] of [[-21,-11],[-13,-11],[-15.5,-19],[-20.5,-21.5],[-12,-21],[-22,-15.5],[-18.3,-13.3]])egg(x,z,i++);   /* 🌸 the Flower Corner garden */
    for(const [x,z,ry,c] of [[-26.5,11.8,.6,'#ffffff'],[-17.2,12.2,-.5,'#ffc9dc'],[-33.3,30.8,2.2,'#f8f5f0']]){const m=makePet('bunny',c),b=m.root;b.scale.setScalar(1.7);b.position.set(x,supportAt(x,z),z);b.rotation.y=ry;st.add(b);holPiece('bunny',x,z,b.position.y);const bw=new THREE.Group();bw.position.set(0,.31,.1);bw.rotation.set(0,0,-.2);m.head.add(bw);bowShape(bw,.6,PC[(i++)%6],{ol:.006});HOL.n++;}
    garland(st,-38.0,1.9,8.3,-24.2,8.3,PC);garland(st,-19.8,1.9,8.3,-18.6,8.3,PC);garland(st,-13.8,1.9,8.3,-8.3,8.3,PC);garland(st,-84.6,3.7,-4.45,-84.6,4.45,PC);HOL.n+=4;   /* (run 4 finish: in two pieces, either side of the park's bus shelter: it ran along the shelter's back, its string through the roof's rim) */
    eggHuntBuild(L,G);}   /* 🥚 run 4, job 11: the Easter Bunny and the 25 hunt eggs */
  bake(st,true,64);if(glows.length)G.add(glowMesh(glowGeo(glows)));}   /* (64 m chunks: fewer pieces with Halloween on, within the agreed town limit) */
const HOL_BULB_COLS=['#ff4d6d','#ffd45c','#7cc8ff','#5fd4b0'],BULB_PALE=new THREE.Color('#fff8e8');   /* (a bulb that is off goes pale, never dark: dark ones read as holes; run 4, stage 3) */
function holAnim(now){if(!HOL.g)return;const t=(now/1000)%1e4;
  if(HOL.bulbs){const k=Math.floor(t*2.5)%4;HOL.bulbs.forEach((m,i)=>{m.color.set(HOL_BULB_COLS[i]);if((i+k)%4===0)m.color.lerp(BULB_PALE,.62);});}   /* 💡 the tree's bulbs blink in turn, by day too (run 4, stage 3) */HOL.g.traverse(o=>{if(o.material&&o.material.uniforms&&o.material.uniforms.tm)o.material.uniforms.tm.value=t;});
  for(const [o,xz,r0] of [[HOL.santa&&HOL.santa.root,HOL.santaXZ,.06],[HOL.bunny,HOL.bunnyXZ,.3]]){if(!o||!xz||CUR!==LOC.city)continue;const d=Math.hypot(P.x-xz[0],P.z-xz[1]),want=d<7?Math.atan2(P.x-xz[0],P.z-xz[1]):r0;o.rotation.y=angLerp(o.rotation.y,want,.08);}   /* 🎅🐰 they turn to you when you come close (run 4, stage 3) */
  if(HOL.santa&&HOL.santa.arms&&HOL.santa.arms[1]){const a=HOL.santa.arms[1];a.rotation.z=-2.3+Math.sin(t*5)*.32;a.rotation.x=Math.sin(t*5+1)*.12;}}   /* 👋 Santa's wave */
/* 👻 the Spooky path (run 4, job 3): a winding purple-lit trail through the Flower Corner (the holiday spot, job 4), 21 m long (the park's old path was 13.6 m),
   open after 18:00 in October. 6 scare spots with 5 kinds of soft scares: a ghost, a skeleton, a zombie, a bat swarm and a pumpkin head. When one pops up you stop
   and turn smoothly to face it, the view shakes a little and a soft spooky sound plays (only with sound on). Each spot once per night per player; never in jobs,
   class, scenes, sleep, the bus or the Pet Show (SPOOK.ok) */
const SPOOK_WAY=[[-17.35,-14.6],[-19.6,-15.9],[-16.3,-17.6],[-19.8,-19.4],[-15.6,-20.9],[-18.6,-22.6],[-15.2,-24.2]];   /* run 4, stage 3: the purple trail starts where the garden's white stepping stones end (it used to run beside them: a double row) and winds 21.9 m deeper into the corner */
const SPOOK={spots:[{x:-15.5,z:-11.2,px:-13.3,pz:-11.9,k:'ghost'},{x:-18.8,z:-13.2,px:-21.1,pz:-12.9,k:'skel'},{x:-19.3,z:-16.3,px:-21.5,pz:-16.8,k:'zombie'},{x:-16.5,z:-18.2,px:-14.6,pz:-17.0,k:'bats'},{x:-18.3,z:-21.0,px:-20.5,pz:-21.7,k:'pumpkin'},{x:-15.2,z:-23.3,px:-13.0,pz:-22.6,k:'ghost'}],   /* (run 4, stage 3: 2.3 m off the path, beside it, not in your face) */
  kinds:['ghost','skel','zombie','bats','pumpkin'],m:{},cur:null,t:0,len:0,
  open(){return HOL.cur==='halloween'&&!!S&&(S.time>=18||S.time<6);},
  ok(){return!CUT&&!P.sit&&!P.ride&&!UI.open&&!DECO.on&&!fading&&!CLIMB&&!TUT&&!DTUT&&!CR&&!!CUR&&CUR.id==='city'&&!(typeof dlCarrying==='function'&&dlCarrying())&&!(typeof PSX!=='undefined'&&PSX.on&&Math.hypot(P.x+34,P.z-22)<9);},
  near(){return!!S&&!!CUR&&CUR.id==='city'&&P.x>-23.4&&P.x<-10.6&&P.z>-24.5&&P.z<-7;}};
function spookBuild(L,G,st,glows){glows=glows||[];const r=seeded(41),W=SPOOK_WAY;let len=0;
  for(let i=1;i<W.length;i++){const [ax,az]=W[i-1],[bx,bz]=W[i],d=Math.hypot(bx-ax,bz-az),n=Math.max(2,Math.round(d/.9));len+=d;for(let k=0;k<n;k++){const t=k/n,x=ax+(bx-ax)*t+(r()-.5)*.16,z=az+(bz-az)*t+(r()-.5)*.16;disc(st,.36,k%2?'#8a6cc4':'#7a5ab4',x,.044,z,{seg:12});}}
  SPOOK.len=len;
  for(const [x,z] of [[-14.2,-9.6],[-20.3,-14.6],[-15.0,-15.6],[-19.8,-19.6],[-16.9,-23.6]]){cyl(st,.03,.035,.9,'#3d2c5e',x,0,z,{seg:6,ol:.01});box(st,.2,.05,.2,'#2e2347',x,.86,z,{ol:.012});box(st,.15,.2,.15,null,x,.91,z,{ol:.01,mat:new THREE.MeshBasicMaterial({color:'#ffd36b'})});cone(st,.17,.12,'#2e2347',x,1.11,z,{seg:4,ry:Math.PI/4,ol:.012});glows.push([x,1.0,z,.9,[1,.75,.3]]);holPiece('path lamp',x,z,0);}   /* (run 4, stage 3: the lamp glass is lit on its own, so it reads as a lamp at night) */
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
    P.freeze=1.0;SHAKE.t=.4;floatText(SPOOK_SAY[q.k],q.px,1.4,q.pz,{h:.5,life:1.6});SFX.spook(q.k);P.pitch=clamp(P.pitch*.5,-1.2,1.2);});}

/* ⚡ auto speed: when the game stays slow for a few seconds it draws a bit less: first less sharp, then softer shadows and none under small things, then no shadows, last not so far.
   When it runs well again it steps back up. Only this device: kept in its own key (not in the save, nothing sent online). Graphics 'Fast' in Settings starts lower. */
const AQ_STEPS=[{pr:2,sh:2048},{pr:1.5,sh:2048},{pr:1.25,sh:1024},{pr:1,sh:0},{pr:1,sh:0,far:130}];
const AQ={lv:0,n:0,acc:0,pt:0,good:0,hold:0,lock:20000,tryT:0,farT:0,farL:null,farList:null};
try{AQ.lv=Math.min(AQ_STEPS.length-1,Math.max(0,parseInt(localStorage.getItem('cozytown-q'))||0));}catch(e){}
function aqKey(lv){const q=AQ_STEPS[lv],nice=SET.gfx!=='fast';return [nice?Math.min(devicePixelRatio||1,q.pr):1,nice?q.sh:0,q.far||0].join('|');}
function aqStep(dir){const k=aqKey(AQ.lv);for(let l=AQ.lv+dir;l>=0&&l<AQ_STEPS.length;l+=dir)if(aqKey(l)!==k){AQ.lv=l;if(!DN_TEST)try{localStorage.setItem('cozytown-q',String(l));}catch(e){}applyGfx();return true;}return false;}
function aqTick(){if(navigator.webdriver&&!window.__aqTest)return;   /* (test browsers step the game by hand: their frame times say nothing about speed) */
  const t=performance.now(),d=t-(AQ.pt||t);AQ.pt=t;if(!PLAYING||d<=0||d>1500||document.hidden){AQ.acc=AQ.n=0;return;}   /* (a very long stop, like the app coming back from the background, is not counted) */
  AQ.acc+=d;AQ.n++;if(AQ.acc<3000)return;const fps=AQ.n*1000/AQ.acc;AQ.acc=AQ.n=0;
  if(fps<27){AQ.good=0;const tried=AQ.tryT&&t-AQ.tryT<12000;if(aqStep(1)){if(tried)AQ.lock=Math.min(600000,AQ.lock*2);AQ.tryT=0;AQ.hold=t;}}   /* (a step up that was too much: wait twice as long before the next try) */
  else if(fps>50){if(++AQ.good>=4&&t-AQ.hold>AQ.lock){AQ.good=0;if(aqStep(-1)){AQ.tryT=t;AQ.hold=t;}}}else AQ.good=0;}
function aqFar(){const f=AQ_STEPS[AQ.lv].far,L=CUR&&CUR.type==='out'&&f?CUR:null;   /* the last step: far-away things in the place you are in are not drawn (they sit in the fog) */
  if(AQ.farL!==L){if(AQ.farList)for(const o of AQ.farList)o.layers.mask=o.__lm;AQ.farList=null;AQ.farL=L;}if(!L)return;
  if(!AQ.farList){AQ.farList=[];L.g.traverse(o=>{if(!o.isMesh||!o.geometry)return;if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();if(o.geometry.boundingSphere.radius*o.matrixWorld.getMaxScaleOnAxis()<40){o.__lm=o.layers.mask;AQ.farList.push(o);}});}
  const c=camera.position,v=_aqV;for(const o of AQ.farList){v.copy(o.geometry.boundingSphere.center).applyMatrix4(o.matrixWorld);o.layers.mask=Math.hypot(v.x-c.x,v.z-c.z)>f+o.geometry.boundingSphere.radius?0:o.__lm;}}
const _aqV=new THREE.Vector3();
function applyGfx(){const nice=SET.gfx!=='fast',q=AQ_STEPS[AQ.lv],sh=nice&&q.sh>0;renderer.setPixelRatio(Math.min(devicePixelRatio||1,nice?q.pr:1));
  if(sh&&sun.shadow.mapSize.x!==q.sh){sun.shadow.mapSize.set(q.sh,q.sh);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}
  if(renderer.shadowMap.enabled!==sh||sun.castShadow!==sh){renderer.shadowMap.enabled=sh;sun.castShadow=sh;
    scene.traverse(o=>{if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true);}});}
  const sm=sh&&AQ.lv>=2;if(AQ.small!==sm){AQ.small=sm;scene.traverse(o=>{if(!o.isMesh)return;   /* from the third step small things (under 1 m across: lamps, cups, pet and people parts) cast no shadow */
    if(sm){if(o.castShadow&&o.geometry){if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();if(o.geometry.boundingSphere.radius*o.matrixWorld.getMaxScaleOnAxis()<.5){o.castShadow=false;o.__cs=1;}}}else if(o.__cs){o.castShadow=true;o.__cs=0;}});}
  AQ.farT=0;aqFar();resize();}
function resize(){if(DANCE.laneFx)DANCE.laneFx.dirty=true;const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;BASEFOV=w<h?80:70;camera.fov=DANCE.res?DANCE.resultCamera.fov:BASEFOV;camera.updateProjectionMatrix();}
let last=performance.now(),saveT=0,titleT=0,hardT=0,navT=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;
  if(PLAYING&&DN_TEST){dnTestTick(dt);}
  else if(PLAYING){
    {if(clockSync()){newDay();change();}   /* 🕰️ the one clock (run 4, job 1): the time and the day come from the real time, the same for everyone */
      S.hunger=Math.max(0,S.hunger-dt/HOUR*4);if(S.hunger<20&&!hungryWarn){hungryWarn=true;toast('Your tummy is rumbling! Eat something from your 🎒 bag.',4);}if(S.hunger>30)hungryWarn=false;}
    updatePlayer(dt);farmTick(dt);tpTick(dt);psTick(dt);   /* 🐴 the farm (stage 6): nothing runs while you are far from it */
      /* 🌲 the Tree Park's floor physics (run 4, job 16) */
    fanTick(dt);let fi=0;for(const f of FRIEND_ACTORS)f.update(dt,f.mode==='follow'?fi++:0);PET_ACTORS.forEach((p,i)=>p.update(dt,fi+i+(fi?0:1)));petTick(dt);tagsApart([...FRIEND_ACTORS,...PET_ACTORS].filter(f=>f.g.visible&&f.loc===CUR.id&&f.tag).map(f=>({tag:f.tag,bub:f.bub||null})));   /* (run 4 finish: your pets' tags too; indoors three of them piled up) */
    if(CUR.id==='pets')updatePen(dt);
    if(CUR.id==='toys'&&CUR.train){const T=CUR.train;T.userData.t=(T.userData.t||0)+dt*.9;T.children.forEach((c,i)=>{const a=T.userData.t-i*.32;c.position.set(Math.cos(a)*.88,0,Math.sin(a)*.55);c.rotation.y=Math.atan2(-Math.sin(a)*.88,Math.cos(a)*.55);});}
    wkStat();for(const w of WALKERS)w.update(dt);walkersApart(dt);granTick(dt);   /* 🚶 townspeople give way to each other and walk round people who stand or sit about */
    updateCars(dt);mpTick(dt);hpTick(dt);laneTick(dt);zzTick(dt);for(const s of SHOPPERS)s.update(dt);
    updGarden(dt);bdTick(dt);
    fbTick(dt);   /* ⚽ the football friends */
    {const vis=CUR.id==='city'&&sittersOut();for(const s of SITTERS){s.p.root.visible=vis;if(vis){s.t+=dt;s.p.head.rotation.y=Math.sin(s.t*.5)*.35;if(s.p.wave>0){s.p.wave-=dt;s.p.arms[1].rotation.z=2.5+Math.sin(s.p.wave*14)*.35;}else s.p.arms[1].rotation.z*=.85;}}}
    psUpdate(dt);dayTick();holTick(dt);fwTick(dt);confTick(dt);spookTick(dt);wxTick(dt);hsTick(dt);hsTutTick(dt);   /* 🎃 holidays from the real calendar; 👻 the spooky path; 🌦️ the weather */
    for(const k of KEEPERS)if(k.L===CUR){const f=k.lk||[P.x,P.z];k.p.root.rotation.y=angLerp(k.p.root.rotation.y,Math.atan2(f[0]-k.x,f[1]-k.z),.05);if(k.mv)COZY_MOVES.play(k.p,k.mv,(gameMs()-k.mv0)/1000,{kind:'person'});else animPerson(k.p,dt,false);}   /* (🩺 the vet and the nurse: their moves at the exam table, facing it: stage 4) */
    if(CUR&&CUR.id==='studio'&&!CR&&!fading){setLoc('city');P.x=-17;P.z=-4.6;P.yaw=0;P.pitch=0;P.sit=null;P.ride=null;$('hud').hidden=false;camera.clearViewOffset();resize();saveLocal();}
    if(CUT)cutUpdate(dt);if(PS.sign)PS.sign.visible=!(CUT&&CUT.show);   /* 🏆 'Every Saturday!' hides during a show (picture pass 2: the big words sat on it, a stray pink 'Ev' showed) */if(CLIMB)climbUpdate(dt);floorVis();
    if(CR)crCam(dt);else if(P.ride)updateRide(dt);else updateCamera(dt);if(CUT)cutCam(dt);swingUI();
    if(DECO.on)decoUpdate();
    TARGET=(UI.open||DECO.on||CUT||CLIMB||TUT||DTUT)?null:findTarget();showAction();jobTick(dt);
    hudT+=dt;if(hudT>.5||Math.floor(S.time*6)!==hudM){hudT=0;hudM=Math.floor(S.time*6);updHud(false);padSize();}   /* (run 4 finish: and at once when the shown time steps on 10 minutes; the chip and the phone trailed it by up to half a second) */
    saveT+=dt;if(saveT>10){saveT=0;saveLocal();}
    hardT+=dt;if(hardT>1){hardT=0;hardCheck();}
    navT+=dt;if(navT>.15){navT=0;updNav();}if(BEACON&&BEACON.visible&&BEACON.pin)BEACON.pin.position.y=3.4+Math.sin(performance.now()/300)*.25;
    if(MAPV.on){mapT+=dt;if(mapT>=.1){mapT=0;mapTick();}}   /* 🗺️ the open map: your arrow, the dotted way and friends move */
    awTick(dt);netTick(dt);
  }else{titleT+=dt*.05;
    if(CUR&&CUR.id==='city'){wkStat();for(const w of WALKERS)w.update(dt);walkersApart(dt);updateCars(dt);}
    if(!S||!CUR||CUR.id==='city'){const cx=FTN?FTN.fx:0,cz=FTN?FTN.fz:0;camera.position.set(cx+Math.cos(titleT)*30,14,cz+Math.sin(titleT)*30);camera.lookAt(cx,1,cz);}}
  if(CUR&&CUR.type==='out'){const L=LOC.city,tt=now/1000;
    updFountain(dt);updDucks(dt,tt);brTick(dt);updFlies(tt);   /* 🌉 up and over the pond bridge; ✨ fireflies in the park at night */
    updBall(dt);holAnim(now);wildTick(dt,now);   /* 🦇 bats and 👻 ghosts drift on the graphics chip; 🦋 the wild animals too */
    L.swings.forEach((s,i)=>{if(!(P.ride&&P.ride.kind==='swing'&&P.ride.i===i))s.rotation.x=lerp(s.rotation.x,Math.sin(tt*1.3+i*1.7)*.18,.05);});
    for(const c of clouds){c.position.x+=c.userData.sp*dt;if(c.position.x>230)c.position.x=-230;c.scale.setScalar(clamp(Math.min(230-c.position.x,c.position.x+230)/40,.01,1));}   /* ☁️ shrink away before the wrap, grow back after it */
    for(const l of LITTER)l.sp.position.y=.45+Math.sin(tt*3+l.k)*.06;}
  updTVs(dt);updFloats(dt);updBeach(dt);popFades();
  const tx=Math.round(camera.position.x),tz=Math.round(camera.position.z);sun.target.position.set(tx,0,tz);sun.position.set(tx+SUND.x*70,SUND.y*70,tz+SUND.z*70);
  skyMesh.position.copy(camera.position);stars.position.copy(camera.position);
  updSky();lampTick();if(AQ_STEPS[AQ.lv].far&&CUR&&CUR.type==='out'){const f=AQ_STEPS[AQ.lv].far;FOG.far=Math.min(FOG.far,f);FOG.near=Math.min(FOG.near,f*.45);}
  aqTick();AQ.farT+=dt;if(AQ.farT>.5||AQ.farL!==(AQ_STEPS[AQ.lv].far&&CUR&&CUR.type==='out'?CUR:null)){AQ.farT=0;aqFar();}
  if(DANCE.on&&DANCE.style)dnLaneDraw();
  renderer.render(scene,camera);
}
async function boot(){
  if(!DN_TEST)capsEarly();
  try{
    const cv=$('c');renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});RENDER0=renderer.render.bind(renderer);
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    {const K=THREE.ShaderChunk,f=K.shadowmap_pars_fragment;if(f.includes('return shadow;'))K.shadowmap_pars_fragment=f.replace('return shadow;','return mix(shadow,1.0,smoothstep(.72,.98,max(abs(shadowCoord.x-.5),abs(shadowCoord.y-.5))*2.));');}   /* 🌳 shadows fade out softly far away instead of popping in */
    initMaterials(renderer.capabilities.isWebGL2);
    scene=new THREE.Scene();
    scene.updateMatrixWorld=function(force){if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldNeedsUpdate||force){this.matrixWorld.copy(this.matrix);this.matrixWorldNeedsUpdate=false;force=true;}
      for(const c of this.children)if(c.visible||force||!c.__mw0){c.updateMatrixWorld(force);c.__mw0=1;}};   /* ⚡ speed: hidden places (the rooms you are not in, about 4,000 parts) are not re-sized every frame; each is done once, and again when shown */
    FOG=new THREE.Fog('#c4ecff',55,270);scene.fog=FOG;
    camera=new THREE.PerspectiveCamera(70,1,.1,700);camera.rotation.order='YXZ';
    hemi=new THREE.HemisphereLight('#ffffff','#a8c69a',.75);scene.add(hemi);
    sun=new THREE.DirectionalLight('#fff4e0',.9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-30;sc.right=30;sc.top=30;sc.bottom=-30;sc.near=1;sc.far=150;sun.shadow.bias=-.0006;sun.shadow.normalBias=.09;scene.add(sun);scene.add(sun.target);
    lamp=new THREE.PointLight('#ffe2b8',0,20,1.4);scene.add(lamp);
    try{await Promise.race([document.fonts.load('800 40px "CozyCoin","Baloo 2"'),new Promise(r=>setTimeout(r,2000))]);}catch(e){}
    seasonSet();buildSky();buildCity();buildHome();buildMarket();buildPetShop();buildVet();buildFlowerShop();buildCafe();buildSalon();buildClothesShop();buildToyStore();buildBakery();buildIceCream();buildLibrary();buildSchool();buildClassrooms();buildFireStation();buildPizzeria();buildApts();buildClientRoom();buildVisit();buildBeach();buildTreePark();buildStudio();buildActors();buildTownfolk();buildPetShow();buildCars();buildBall();buildShoppers();
    S=freshState();setLoc('city');S=null;holCheck();   /* 🎃 decorations for today's real date */
    setupInput();applyGfx();addEventListener('resize',resize);
    requestAnimationFrame(t=>{last=t;frame(t);});
    if(DN_TEST){dnTestBoot();return;}
    cloudInit();
    const b=$('tPlay');b.disabled=false;b.textContent='Play';b.focus({preventScroll:true});
  }catch(e){console.error(e);const d=document.createElement('div');d.id='err';d.textContent='Oops, the game could not start on this device. ('+(e&&e.message||e)+')';document.body.appendChild(d);}
}
boot();


