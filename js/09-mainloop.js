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
#dnBtns{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);transform:translateX(-50%);display:flex;gap:10px;pointer-events:auto}#dnBtns .btn{width:66px;height:66px;min-height:66px;padding:0;display:flex;align-items:center;justify-content:center}#dnBtns .btn[data-a="dnp:0"]{background:#ffe6ef}#dnBtns .btn[data-a="dnp:1"]{background:#e3f3ff}#dnBtns .btn[data-a="dnp:2"]{background:#e4f8f0}#dnBtns .btn[data-a="dnp:3"]{background:#fff5d6}
@media (orientation:portrait){body.dancing #stats{visibility:hidden}}
body.dancing #joy,body.dancing #moveBtns,body.dancing #actWrap,body.dancing #pad,body.dancing #job,body.dancing #note,body.dancing #toast{visibility:hidden}
@media (orientation:portrait){#dnLane{height:min(36vh,300px)}}
@media (orientation:landscape) and (max-height:500px){#panel.bottom .card.dnres{margin-left:auto;margin-right:0;width:min(380px,46vw)}#dnMsg{right:auto;left:3%;top:calc(env(safe-area-inset-top,0px) + 12px);bottom:auto;transform:none;font-size:34px}}body:has(#panel:not([hidden]) #card.dnres) #joy{visibility:hidden}body:has(#panel:not([hidden]) #card.ptres) :is(#joy,#moveBtns){visibility:hidden}   /* (the result card at the side, the two dancers in view: run 4, stage 3) */
@media (orientation:landscape){#dnLane{left:auto;right:3%;transform:none;width:min(300px,30vw);top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 96px);height:min(62vh,420px)}#dnBtns{left:auto;right:3%;transform:none;width:min(300px,30vw);justify-content:space-between;gap:0}#dnBtns .btn{width:62px;height:62px;min-height:62px}#dnTop{top:calc(env(safe-area-inset-top,0px) + 64px);left:33%}#dnMsg{left:auto;right:calc(3% + min(300px,30vw) + 14px);top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 140px);transform:none;font-size:40px}}@media (orientation:landscape) and (max-height:500px){#dnLane{top:calc(env(safe-area-inset-top,0px) + 6px);height:auto}body.dancing #topbtns,body.dancing #stats{visibility:hidden}#dnTop{top:calc(env(safe-area-inset-top,0px) + 8px)}#dnMsg{left:3%;right:auto;top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 16px);font-size:34px}}   /* (run 4 finish: the pop-up under the dancers, not on them: its ✨ covered the left dancer's face) */   /* wide screens: the lane on the right with its four buttons right under it, the dancers in view (run 4, stage 3) */
@media (orientation:portrait){body:has(#hpCard:not([hidden])) #mmBtn,body:has(#hpCard:not([hidden])) #pad,body:has(#dnCard:not([hidden])) #mmBtn,body:has(#dnCard:not([hidden])) #pad{visibility:hidden}}   /* (run 4, stage 3: the card sat on the map and the notepad) */
#hpCard,#dnCard{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 74px);transform:translateX(-50%);z-index:9500;background:var(--paper);border:3px solid var(--line);border-radius:22px;padding:14px 16px 16px;box-shadow:0 6px 0 #3d2c5e;text-align:center;width:min(410px,92vw);color:var(--ink);animation:kcPop .2s ease-out}#hpCard .kc-b,#dnCard .kc-b{display:flex;gap:10px;justify-content:center}#hpCard .kc-t,#dnCard .kc-t{font-size:28px;line-height:1.15}#hpCard[hidden],#dnCard[hidden]{display:none}@media (orientation:portrait){#hpCard,#dnCard{top:calc(env(safe-area-inset-top,0px) + 150px)}}#hpCard .kc-b,#dnCard .kc-b{flex-wrap:wrap}#hpCard .kc-b .btn,#dnCard .kc-b .btn{min-height:48px;font-size:17px;padding:8px 14px;white-space:nowrap}`;document.head.appendChild(st);}   /* the cards' and the dance HUD's looks, in at load time */
const HPT={seen:new Set(),queue:[],cur:null,rem:{},noted:{},ans:null,tiles:null,mats:null,ball:null,lit:false,key:'',t:0,ct:0};
function hpOn(h){h=h===undefined?S&&S.hp:h;return !!(h&&realMs()>=h.at&&realMs()<h.at+HP_LEN);}
function hpSoon(h){h=h===undefined?S&&S.hp:h;return !!(h&&realMs()<h.at+HP_LEN);}
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
function hpStamp(st){const h=S.hp;st.py=h&&hpSoon(h)?{id:h.id,at:h.at,h:h.h}:null;st.pa=HPT.ans||null;st.dn=DANCE.mine?Object.assign({},DANCE.mine):null;}
function hpFields(a,pr){const obj=v=>v&&typeof v==='object'?v:null;a.py=obj(pr.py);a.pa=obj(pr.pa);a.dn=obj(pr.dn);}
/* 💌 the invitation card, like the knock card */
function hpCard(){if(HPT.cur||!HPT.queue.length)return;const q=HPT.queue.shift();if(!MP.peers.has(q.peer)){hpCard();return;}HPT.cur=q;const when=hpWhen({at:q.at,h:q.h});
  SFX.ding();   /* (run 4, stage 3: the card says it all; the note that used to show behind it is gone) */
  let el=$('hpCard');if(!el){el=document.createElement('div');el.id='hpCard';document.body.appendChild(el);}
  el.innerHTML=`<div class="kc-t">🎉 A party!</div><div class="kc-m"><b>${esc(q.nm)}</b> is hosting a party ${esc(when)}!<br>Go check it out?</div><div class="kc-b"><button class="btn mint" id="hpYes">✅ I'll come!</button><button class="btn" id="hpNo">🙅 Not this time</button></div>`;
  el.hidden=false;$('hpYes').onclick=()=>hpAnswer(true);$('hpNo').onclick=()=>hpAnswer(false);clearTimeout(HPT.ct);HPT.ct=setTimeout(()=>{if(HPT.cur===q)hpAnswer(false,true);},40000);}
function hpAnswer(ok,quiet){const q=HPT.cur;if(!q)return;HPT.cur=null;const el=$('hpCard');if(el)el.hidden=true;clearTimeout(HPT.ct);S.rsvp=S.rsvp||{};S.rsvp[q.id]=ok?'yes':'no';HPT.ans={id:q.id,ok:ok?1:0};change();
  const a=MP.peers.get(q.peer);if(ok){SFX.yay();if(realMs()>=q.at){HPT.noted[q.id]=1;if(a&&hpNav(a))HPT.rem[q.id]=1;}else if(!quiet)toast('🎉 Yay! I will tell you when '+q.nm+"'s party starts.",3.4);}else if(!quiet)toast('💛 Okay, maybe next time.',2.4);setTimeout(hpCard,600);}
function hpNav(a,quiet){const j=LANE.slotOf.get(a.peer),ln=LOC.city.lane;if(j==null||!ln||!ln[j]){if(!quiet)toast('🏠 '+a.nm+"'s house is not on Friends Lane right now.",3);return false;}const d=ln[j].door;
  setNavTo({id:'party',n:a.nm+"'s party",i:'🎉',x:d[0],z:d[1],w:4,d:4,door:[d[0],d[1]],flat:1,nq:1},true);toast('🎉 Follow the arrow to '+a.nm+"'s house!",3.2);return true;}
/* 🪩 the disco floor flashes and the ball spins at a party, or while a round is on */
function hpLights(dt){const L=CUR&&(CUR.id==='home'||CUR.id==='visit')?CUR:null;let on=false;
  if(L){if(CUR.id==='home')on=hpOn()||DANCE.on;else{const a=MP.peers.get(VIS.host);on=DANCE.on||!!(a&&a.py&&hpOn(a.py));}}
  const key=L?L.id+':'+L.items.children.length:'';if(key!==HPT.key){HPT.key=key;HPT.tiles=[];HPT.mats=[];HPT.ball=null;if(L)L.items.traverse(o=>{if(!o.isMesh||!o.userData)return;if(o.userData.tile!==undefined){HPT.tiles.push(o);if(!HPT.mats[o.userData.tile])HPT.mats[o.userData.tile]=o.material;}if(o.userData.ball)HPT.ball=o;});HPT.lit=false;}
  if(!HPT.tiles||!HPT.tiles.length)return;const M=HPT.mats.filter(Boolean);
  if(on){HPT.t+=dt;const step=Math.floor(HPT.t*3);for(const o of HPT.tiles){const m=M[(o.userData.tile+step)%M.length];if(m&&o.material!==m)o.material=m;}if(HPT.ball)HPT.ball.rotation.y+=dt*2.2;HPT.lit=true;}
  else if(HPT.lit){for(const o of HPT.tiles){const m=HPT.mats[o.userData.tile];if(m)o.material=m;}HPT.lit=false;}}
function hpTick(dt){if(!S)return;
  if(S.hp&&realMs()>=S.hp.at+HP_LEN){S.hp=null;S.rsvpIn=null;change();if(PLAYING)toast('🎉 Your party is over. What a day!',3);}
  if(MP.grp)for(const a of MP.peers.values()){const py=a.py;
    if(py&&typeof py.id==='string'&&Number.isFinite(py.at)&&realMs()<py.at+HP_LEN){const key=a.peer+'|'+py.id,r=S.rsvp&&S.rsvp[py.id];
      if(!HPT.seen.has(key)&&!r){HPT.seen.add(key);HPT.queue.push({peer:a.peer,id:py.id,at:py.at,h:py.h,nm:a.nm});}
      if(r==='yes'&&realMs()>=py.at){if(!HPT.noted[py.id]){HPT.noted[py.id]=1;SFX.ding();showNote('🎉 Party time!',a.nm+"'s party is starting! Follow the arrow to their house.",true,'🎉');}
        if(!HPT.rem[py.id]&&CUR&&CUR.id==='city'&&hpNav(a,true))HPT.rem[py.id]=1;}}   /* (the way is set as soon as the host's house is on Friends Lane) */
    if(S.hp&&a.pa&&a.pa.id===S.hp.id){S.rsvpIn=S.rsvpIn||{};if(S.rsvpIn[a.peer]!==a.pa.ok){S.rsvpIn[a.peer]=a.pa.ok;if(a.pa.ok&&PLAYING)toast('💌 '+a.nm+' is coming to your party!',3);}}}
  if(!HPT.cur&&HPT.queue.length&&PLAYING&&!CUT&&!fading&&!DANCE.on)hpCard();
  hpLights(dt);dnTick(dt);}
/* ================= 🕺💃 the dance game ================= */
const DANCE={on:false,mine:null,ask:null,said:new Set(),card:null,t:0,s:0,r:'',pat:null,partner:null,partnerNm:'',left:1,sc:0,osc:0,bar:.5,mvT:0,mvK:-1,floor:null,cam:null,me:null,hud:null,arrows:[],ended:0,res:null,lastHit:-1,pats:new Map(),gone:0,tg:null,dt:0};
const DN_N=20,DN_LEAD=1.6,DN_WIN=.28,DN_T0=2.0,DN_GAP=1.15,DN_NAMES=['⬅️','⬇️','⬆️','➡️'],DN_COL=['#ff7aa8','#7cc8ff','#7fdcb5','#ffd45c'],DN_ROT=[270,180,0,90];
function dnArrow(d,sz){return '<svg viewBox="0 0 48 48" width="'+sz+'" height="'+sz+'" aria-hidden="true"><path d="M24 5 L43 26 H32 V43 H16 V26 H5 Z" fill="'+DN_COL[d]+'" stroke="#3d2c5e" stroke-width="3.5" stroke-linejoin="round" transform="rotate('+DN_ROT[d]+' 24 24)"/></svg>';}   /* 🕺 big drawn arrows, one colour per column, the same on every device (run 4, stage 3: the emoji arrows were small grey glyphs without a colour emoji font) */
function dnHash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function dnPattern(r){let p=DANCE.pats.get(r);if(p)return p;const q=seeded(dnHash(String(r))),out=[];for(let i=0;i<DN_N;i++)out.push({t:DN_T0+i*DN_GAP,d:(q()*4)|0,j:0});DANCE.pats.set(r,out);return out;}
function dnHere(){const out=[];if(!MP.grp||!CUR)return out;for(const a of MP.peers.values()){if(!a.av)continue;if(CUR.id==='home'&&a.loc==='visit'&&a.ho===MP.me)out.push(a);else if(CUR.id==='visit'&&VIS.st==='in'&&((a.loc==='home'&&a.peer===VIS.host)||(a.loc==='visit'&&a.ho===VIS.host&&a.peer!==MP.me)))out.push(a);}return out;}
/* the disco floor of this house (world x,z and its floor), only with a disco ball in the house too */
function dnFloor(){if(!CUR||!S)return null;
  if(CUR.id==='home'){const f=S.home.items.find(it=>it.t==='discofloor');if(!f||!S.home.items.some(it=>it.t==='discoball'))return null;const L=LOC.home;return{x:L.ox+f.x,z:L.oz+UPZ*(f.f|0)+f.z,fl:f.f|0,L};}
  if(CUR.id==='visit'&&LOC.visit&&LOC.visit.items){let f=null,b=false;for(const g of LOC.visit.items.children){const r=g.userData.row;if(!r)continue;if(r.t==='discofloor'&&!f)f=g;if(r.t==='discoball')b=true;}if(!f||!b)return null;return{x:f.position.x,z:f.position.z,fl:f.userData.fl|0,L:LOC.visit};}
  return null;}
function dnMyFloor(){const L=CUR;return L?Math.round((P.z-L.oz)/UPZ):0;}
function dnCan(){if(DANCE.on||DANCE.ask||DANCE.mine||!MP.grp||P.ride||CUT)return false;const f=dnFloor();return !!f&&f.fl===dnMyFloor()&&dnHere().length>0;}
function dnAsk(){const here=dnHere();if(!here.length){toast('🕺 Nobody to dance with yet. Wait for a friend!',2.5);return;}
  if(here.length===1)dnAskPeer(here[0]);else openPanel(`<div class="hd"><h2>🕺 Dance with…</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><div class="row wrap">${here.map(a=>`<button class="btn mint" data-a="dnask:${esc(a.peer)}">${esc(a.nm)}</button>`).join('')}</div>`,{bottom:true});}
ACT.dnask=p=>{const a=MP.peers.get(p);closePanel();if(a)dnAskPeer(a);};
function dnAskPeer(a){if(DANCE.mine||DANCE.on)return;SFX.tap();const r=uid();DANCE.ask={r,w:a.peer,t0:performance.now(),nm:a.nm};DANCE.mine={r,w:a.peer,st:'ask',s:0,sc:0,mv:-1,k:0,ld:1};toast('🕺 Asking '+a.nm+' to dance…',3);}
function dnCardShow(a){if(DANCE.card)return;DANCE.card={peer:a.peer,r:a.dn.r,nm:a.nm};SFX.ding();let el=$('dnCard');if(!el){el=document.createElement('div');el.id='dnCard';document.body.appendChild(el);}
  el.innerHTML=`<div class="kc-t">🕺 Dance-off!</div><div class="kc-m"><b>${esc(a.nm)}</b> wants to dance with you!<br>Press the arrows as they fall!</div><div class="kc-b"><button class="btn mint" id="dnYes">💃 Let's dance!</button><button class="btn" id="dnNo">🙅 Not now</button></div>`;
  el.hidden=false;$('dnYes').onclick=()=>dnCardAnswer(true);$('dnNo').onclick=()=>dnCardAnswer(false);}
function dnCardAnswer(ok){const c=DANCE.card;if(!c)return;DANCE.card=null;const el=$('dnCard');if(el)el.hidden=true;DANCE.said.add(c.peer+'|'+c.r);const a=MP.peers.get(c.peer);
  if(ok&&a&&a.dn&&a.dn.r===c.r&&a.dn.st==='ask'){SFX.yay();DANCE.mine={r:c.r,w:c.peer,st:'go',s:0,sc:0,mv:-1,k:0,ld:0};DANCE.partner=c.peer;DANCE.partnerNm=c.nm;toast('💃 Get ready…',2);}
  else{DANCE.mine={r:c.r,w:c.peer,st:'no',s:0,sc:0,mv:-1,k:0,ld:0};setTimeout(()=>{if(DANCE.mine&&DANCE.mine.st==='no')DANCE.mine=null;},6000);if(ok)toast('💛 Too late, the music stopped. Ask them!',2.6);}}
function dnBegin(s,a,left){if(DANCE.res)dnLeave();const f=dnFloor();if(!f){dnCancel();return;}DANCE.on=true;DANCE.s=s;if(DANCE.mine)DANCE.mine.s=s;DANCE.r=DANCE.mine.r;DANCE.partner=a.peer;DANCE.partnerNm=a.nm;DANCE.left=left;DANCE.pat=dnPattern(DANCE.r).map(q=>({t:q.t,d:q.d,j:0}));
  DANCE.t=-(s-realMs())/1000;DANCE.sc=0;DANCE.osc=0;DANCE.bar=.5;DANCE.mvT=0;DANCE.mvK=-1;DANCE.lastHit=-1;DANCE.ended=0;DANCE.gone=0;DANCE.floor=f;DANCE.ask=null;
  const L=f.L,W=L.W||HOMEW,D=L.D||HOMED,cx=L.ox,cz=L.oz+UPZ*f.fl;let dx=cx-f.x,dz=cz-f.z;const dl=Math.hypot(dx,dz);if(dl<1){dx=0;dz=1;}else{dx/=dl;dz/=dl;}
  {const cd=innerWidth>innerHeight?(visH()<=500?3.5:4.4):5.6,sd=(left?-1:1)*.6;   /* (an upright phone sees a narrow slice: from 5.6 m both dancers fit; run 4, stage 3) */DANCE.cam={x:clamp(f.x+dx*cd+dz*sd,cx-W+.7,cx+W-.7),z:clamp(f.z+dz*cd-dx*sd,cz-D+.7,cz+D-.7),dx,dz};}   /* (run 4, stage 3: nearer on a short sideways screen; the two players' views 1.2 m apart, so after the round they never stand inside each other) */
  if(P.sit)standUp();if(DECO.on)decoEnd();closePanel();P.ride={kind:'dance'};P.jy=0;P.vy=0;document.body.classList.add('dancing');
  const me=makePerson(lookToPerson(packLook()));bakePerson(me);scene.add(me.root);DANCE.me=me;dnSpots(f);dnHud(true);SFX.ding();}
/* 🪩 coloured light spots from the mirror ball sweep round the floor during a dance-off and its result (run 4, stage 3) */
function dnSpots(f){dnSpotsOff();const g=new THREE.Group(),C=['#ff4d8d','#7cc8ff','#ffd45c','#5fd4b0','#b79cff'];for(let i=0;i<22;i++){const a=i*2.39996,r=1.4+(i*.37)%2.4,m=new THREE.Mesh(new THREE.CircleGeometry(.13+(i%3)*.04,14),new THREE.MeshBasicMaterial({color:C[i%5],transparent:true,opacity:.55,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(Math.cos(a)*r,.012+i*.0004,Math.sin(a)*r);g.add(m);}g.position.set(f.x,0,f.z);scene.add(g);DANCE.spots=g;}
function dnSpotsOff(){const g=DANCE.spots;if(!g)return;scene.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});DANCE.spots=null;}
function dnSpot(left){const c=DANCE.cam,f=DANCE.floor,rx=c.dz,rz=-c.dx,s=left?-1:1;return [f.x+rx*.75*s,f.z+rz*.75*s];}
function dnCancel(msg){if(msg)toast(msg,3);DANCE.ask=null;DANCE.mine=null;}
function dnTick(dt){const D=DANCE;if(!S)return;if(D.spots)D.spots.rotation.y+=dt*.5;
  {const pa=D.partner&&MP.peers.get(D.partner),tg=pa&&pa.av&&pa.av.tag;if((D.on||D.res)&&tg){tg.visible=false;D.hidTag=tg;}else if(D.hidTag&&!(D.on||D.res)){D.hidTag.visible=true;D.hidTag=null;}}   /* (run 4, stage 3: the partner's tag rests during the round and its result: it hid the mirror ball, and the score bar names both) */
  /* the asking: the partner answers through presence */
  if(D.ask){const a=MP.peers.get(D.ask.w);const an=a&&a.dn&&a.dn.r===D.ask.r?a.dn:null;
    if(!a)dnCancel('💛 '+D.ask.nm+' left.');else if(an&&an.st==='go'&&!D.on){const s=realMs()+4000;D.mine.st='go';D.mine.s=s;dnBegin(s,a,1);}
    else if(an&&an.st==='no')dnCancel('💛 '+D.ask.nm+': maybe later!');else if(performance.now()-D.ask.t0>30000)dnCancel('💛 '+D.ask.nm+' did not answer. Maybe later!');}
  else if(D.mine&&D.mine.st==='go'&&!D.on&&!D.mine.ld){const a=MP.peers.get(D.mine.w);if(!a||!a.dn||a.dn.r!==D.mine.r||a.dn.st==='no'||a.dn.st==='done'){dnCancel();}else if(a.dn.st==='go'&&a.dn.s>0)dnBegin(a.dn.s,a,0);}
  if(!D.on&&!D.card&&MP.grp&&!D.mine&&PLAYING&&!CUT&&!fading&&dnFloor()){for(const a of MP.peers.values()){if(a.dn&&a.dn.st==='ask'&&a.dn.w===MP.me&&!D.said.has(a.peer+'|'+a.dn.r)&&dnHere().includes(a)){dnCardShow(a);break;}}}
  if(D.card){const a=MP.peers.get(D.card.peer);if(!a||!a.dn||a.dn.r!==D.card.r||a.dn.st!=='ask'){D.card=null;const el=$('dnCard');if(el)el.hidden=true;}}
  /* the dance-off itself */
  if(D.tg){const f=dnFloor();if(f){D.tg.x=f.x;D.tg.z=f.z;const L=CUR;if(L&&(L.id==='home'||L.id==='visit')&&!L.inter.includes(D.tg))L.inter.push(D.tg);}}
  if(D.res&&((D.shown&&performance.now()-D.ended>1500&&!UI.open)||(performance.now()-D.ended>9000&&!UI.open)||(CUR.id!=='home'&&CUR.id!=='visit')))dnLeave();   /* (run 4, stage 3: only once the result card has been up; on a slow device the card came after the 1.5 s and the view went back first) */   /* the result card went some other way: back to the normal view */
  if(!D.on)return;
  D.t+=dt;D.dt=dt;const a=MP.peers.get(D.partner);
  if(a&&a.dn&&a.dn.r===D.r){if(Number.isFinite(a.dn.sc))D.osc=a.dn.sc;D.gone=0;}else{D.gone+=dt;}
  for(const q of D.pat)if(!q.j&&D.t>q.t+DN_WIN)q.j=-1;
  const target=(D.sc+1)/(D.sc+D.osc+2);D.bar+=clamp((target-D.bar)*Math.min(1,dt*2.5),-.025,.025);   /* the bar slides: never more than 2.5% a frame, even after a hitch */
  if(D.mvT>0)D.mvT-=dt;
  dnHudTick();
  if(!a||D.gone>6||(CUR.id!=='home'&&CUR.id!=='visit'))dnEnd('gone');else if(D.t>D.pat[D.pat.length-1].t+1.8)dnEnd();}
/* ⬅️⬇️⬆️➡️ a press: the arrow of that way inside the window is a hit */
function dnPress(d){const D=DANCE;if(!D.on||D.t<0)return;let best=null,bd=9;for(const q of D.pat){if(q.j||q.d!==d)continue;const e=Math.abs(D.t-q.t);if(e<DN_WIN&&e<bd){bd=e;best=q;}}
  if(!best){return;}best.j=1;const pts=bd<.1?15:10;D.sc+=pts;D.mine.sc=D.sc;D.mine.k=(D.mine.k||0)+1;D.mine.mv=D.pat.indexOf(best);D.lastHit=D.mine.mv;D.mvT=.65;D.mvK=d;SFX.pop();dnHudPop(d,pts,bd<.1);}
/* the moves: a lean left or right, a crouch, both arms up (u = how far into the move) */
function dnPose(p,k,u,t){const s=Math.sin(Math.PI*clamp(u,0,1)),b=p.b;b.rotation.z=0;b.position.y=.03*Math.sin(t*7);p.head.rotation.z=0;for(const l of p.legs)l.position.y=.62;
  if(k===0){b.rotation.z=.35*s;p.arms[0].rotation.z=-2.4*s;p.arms[1].rotation.z=.4*s;p.head.rotation.z=.3*s;}
  else if(k===3){b.rotation.z=-.35*s;p.arms[1].rotation.z=2.4*s;p.arms[0].rotation.z=-.4*s;p.head.rotation.z=-.3*s;}
  else if(k===1){const dy=.2*s;b.position.y=-dy;p.arms[0].rotation.z=-1.3*s;p.arms[1].rotation.z=1.3*s;for(const l of p.legs){l.position.y=.62+dy/(b.scale.y||1);l.rotation.x=.6*s;}}   /* (run 4 finish: the legs slide up into the body as it goes down, so the shoes stay on the floor; they went down with it and sank 13 cm into the dance floor) */
  else if(k===2){b.position.y=.18*s;p.arms[0].rotation.z=-2.7*s;p.arms[1].rotation.z=2.7*s;}
  else{p.arms[0].rotation.z=-.35+.3*Math.sin(t*7);p.arms[1].rotation.z=.35-.3*Math.sin(t*7);}}
/* 💃 an upright phone sees a narrow slice: when the room is too small for the view to stand 5.6 m back, it widens until both dancers and their lean fit (run 4 finish: the host's crown and arm went off the edge) */
function dnFov(){const D=DANCE;if(!(D.on||D.res)||!D.cam||!D.floor||innerWidth>=innerHeight)return 0;const d=Math.hypot(D.cam.x-D.floor.x,D.cam.z-D.floor.z),a=innerWidth/innerHeight;return Math.min(95,2*Math.atan(1.6/Math.max(1,d)/a)*180/Math.PI);}
/* the view: a step back from the floor; my dancer on the left (the one who asked) or the right */
function dnCam(dt){const D=DANCE;if(!(D.on||D.res)||!D.cam){updateCamera(dt);return;}const c=D.cam,f=D.floor,wide=innerWidth>innerHeight,short=visH()<=500,ty=!wide?.15:short?(D.res?1.2:1.3):(D.res?.55:1.0),lo=wide?(D.res&&short?1.9:.6):0;   /* (run 4, stage 3: with the result card up, the view looks further aside on a short sideways screen and lower on a tablet or computer, so the card covers neither dancer) */psCamTo(c.x,c.z,f.x+c.dz*lo,ty,f.z-c.dx*lo,dt,4);   /* (the dancers above the lane on an upright phone, under the score bar on a short sideways one: run 4, stage 3) */P.cy=0;P.jy=0;updateCamera(dt);
  for(const q of PET_ACTORS)if(q.loc===CUR.id)q.g.visible=false;   /* the pets wait out of the picture during a round (they show again by themselves) */
  if(D.me){const [x,z]=dnSpot(D.left),m=D.me;m.root.position.set(x,0,z);m.root.rotation.y=Math.atan2(c.dx,c.dz);animPerson(m,dt,false,1);dnPose(m,D.mvT>0?D.mvK:-1,D.mvT>0?1-D.mvT/.65:0,D.t);}}
/* a friend's dancer: on the floor, facing the view, doing the moves they hit (watchers see both) */
function dnPeer(a,dt){const dn=a.dn&&a.dn.st==='go'?a.dn:null,res=DANCE.res&&a.peer===DANCE.partner;if(!(dn||res)||!a.av||!CUR||(CUR.id!=='home'&&CUR.id!=='visit'))return;   /* (on the floor from the moment they said yes, through the countdown, and while the result card shows: run 4, stage 3) */
  let f=DANCE.on||res?DANCE.floor:dnFloor();if(!f)return;let c=DANCE.on||res?DANCE.cam:null;if(!c){const L=f.L,cx=L.ox,cz=L.oz+UPZ*f.fl;let dx=cx-f.x,dz=cz-f.z;const dl=Math.hypot(dx,dz);if(dl<1){dx=0;dz=1;}else{dx/=dl;dz/=dl;}c={dx,dz};}
  if(dn)a.dnLd=dn.ld;const rx=c.dz,rz=-c.dx,s=a.dnLd?-1:1,x=f.x+rx*.75*s,z=f.z+rz*.75*s;a.av.root.position.set(x,0,z);a.av.root.rotation.y=Math.atan2(c.dx,c.dz);a.av.root.visible=true;if(a.pets)for(const q of a.pets)q.g.visible=false;
  if(dn&&dn.mv!==a.dnMv){a.dnMv=dn.mv;if(dn.mv>=0){a.dnT=.65;a.dnK=dnPattern(dn.r)[dn.mv].d;}}if(a.dnT>0)a.dnT-=dt;
  a.dnTime=(a.dnTime||0)+dt;dnPose(a.av,a.dnT>0?a.dnK:-1,a.dnT>0?1-a.dnT/.65:0,a.dnTime);}
function dnEnd(why){const D=DANCE;if(!D.on)return;D.on=false;D.res=true;D.shown=false;D.ended=performance.now();const a=MP.peers.get(D.partner),nm=D.partnerNm;if(D.mine){D.mine.st='done';D.mine.sc=D.sc;}
  document.body.classList.remove('dancing');dnHud(false);   /* (the view stays on the two dancers until Done: dnLeave; run 4, stage 3) */
  const fin=()=>{const osc=a&&a.dn&&a.dn.r===D.r&&Number.isFinite(a.dn.sc)?a.dn.sc:D.osc;const win=D.sc>osc,tie=D.sc===osc;S.dance=S.dance||{rounds:0,wins:0};S.dance.rounds++;if(win)S.dance.wins++;const coins=15;S.coins+=coins;addXP('sport',3);hardEvent('dance',1);qEvent('dance');change();
    SFX.yay();openPanel(`<div class="who" style="--c:#ff9ec4">🕺 Dance-off</div><p class="line">${why==='gone'?esc(nm)+' had to go. ':''}You <b>${D.sc}</b> · ${esc(nm)} <b>${osc}</b></p><p class="earn">${tie?'🤝 A tie! Great moves, both of you!':win?'🏆 You win! What a dancer!':'🎉 '+esc(nm)+' wins! Great moves!'}<br>You got <b>${coins} 🪙</b>!</p><div class="row" style="justify-content:center"><button class="btn mint" data-a="dnbye" style="min-height:58px;font-size:21px;padding:0 34px">👋 Done</button></div>`,{bottom:true,lock:true,cls:'dnres'});D.shown=true;
    setTimeout(()=>{if(D.mine&&D.mine.r===D.r)D.mine=null;},5000);};
  setTimeout(fin,1200);}
ACT.dnbye=()=>{closePanel();dnLeave();toast('🪩 Another round? Tap Dance! on the floor.',2.6);};
function dnLeave(){const D=DANCE;D.res=false;dnSpotsOff();if(P.ride&&P.ride.kind==='dance')P.ride=null;if(D.me){scene.remove(D.me.root);D.me=null;}}   /* back from the dance view */
function dnNm(n){n=String(n||'');return n.length>13?n.slice(0,12)+'…':n;}   /* a long name ends in … in the score bar */
/* the HUD: the faces and the score bar on top, the falling arrows, four big buttons */
function dnHud(show){let h=$('dnHud');if(!h){
    h=document.createElement('div');h.id='dnHud';h.hidden=true;
    h.innerHTML=`<div id="dnTop"><div class="dnFace me"><span class="em">😄</span><b id="dnMeN">You</b><i id="dnMeS">0</i></div><div id="dnBar"><i id="dnFill"></i><i id="dnMid"></i></div><div class="dnFace"><span class="em">🙂</span><b id="dnYouN"></b><i id="dnYouS">0</i></div></div>
<div id="dnLane">${[0,1,2,3].map(i=>`<div class="dnCol" style="left:${i*25}%"></div>`).join('')}<div id="dnLine"></div>${DN_NAMES.map((n,i)=>`<div class="dnHit" style="left:${i*25}%">${dnArrow(i,48)}</div>`).join('')}</div><div id="dnMsg"></div>
<div id="dnBtns">${DN_NAMES.map((n,i)=>`<button class="btn white" data-a="dnp:${i}" aria-label="${['Left','Down','Up','Right'][i]} arrow">${dnArrow(i,40)}</button>`).join('')}</div>`;document.body.appendChild(h);
    h.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-a^="dnp:"]');if(!b)return;e.preventDefault();e.stopPropagation();audioInit();dnPress(+b.dataset.a.split(':')[1]);b.classList.add('on');setTimeout(()=>b.classList.remove('on'),120);});}
  h.hidden=!show;if(show){const lane=$('dnLane');for(const a of DANCE.arrows)a.remove();DANCE.arrows=DANCE.pat.map((q,i)=>{const d=document.createElement('div');d.className='dnArr';d.style.left=(q.d*25)+'%';d.style.top='-60px';d.innerHTML=dnArrow(q.d,52);lane.appendChild(d);return d;});
    $('dnMeN').textContent='You';$('dnYouN').textContent=dnNm(DANCE.partnerNm);$('dnMeS').textContent='0';$('dnYouS').textContent='0';$('dnFill').style.width='50%';$('dnMsg').textContent='';}}
function dnHudTick(){const D=DANCE,lane=$('dnLane');if(!lane)return;const H=lane.clientHeight,line=H-48;
  D.pat.forEach((q,i)=>{const el=D.arrows[i];if(!el)return;const dtq=q.t-D.t;if(dtq>DN_LEAD||dtq<-.6){el.style.visibility='hidden';return;}el.style.visibility='visible';el.style.top=(line-dtq/DN_LEAD*line)+'px';if(q.j!==1)el.style.opacity=dtq<0?String(Math.max(0,(q.j===-1?.3:1)*(1+dtq/.22))):'';if(q.j===1&&!el.classList.contains('hit'))el.classList.add('hit');if(q.j===-1&&!el.classList.contains('miss'))el.classList.add('miss');});
  $('dnMeS').textContent=D.sc;$('dnYouS').textContent=D.osc;$('dnFill').style.width=(D.bar*100).toFixed(2)+'%';
  const m=$('dnMsg');const txt=D.t<-.2?String(Math.ceil(-D.t)):D.t<.6?'Dance!':(D.popT&&performance.now()<D.popT?D.popTxt:'');if(m.textContent!==txt)m.textContent=txt;}
function dnHudPop(d,pts,perfect){DANCE.popTxt=(perfect?'✨ Perfect +':'+')+pts;DANCE.popT=performance.now()+420;}
/* the Dance! spot on the floor of your house and of a house you visit (its place follows the floor) */
DANCE.tg={x:0,z:0,r:2.0,icon:'🕺',label:'Dance!',pri:()=>true,when:()=>dnCan(),act:dnAsk,dnc:1};
/* ===== 🌲 run 4, job 16 (item 29): the Tree Adventure Park. A free climbing park up in the trees, its own place (like the beach) behind a wooden gate in the woods east of the
   Toy Store, so the town stays smooth. Three paths with signs (🟢 Easy, 🟡 Medium, 🔴 Hard): you pick one at the start, climb the ladder, then jump from deck to deck, cross
   plank bridges and ride a zip line to the finish bell. Falling is cozy: you land softly and pop back up on the last deck you stood on. On the map. TP = the park's state;
   tpTick runs every frame after updatePlayer: it is the park's floor physics (decks and bridges are the floor where you stand, their sides are solid, the ground is a fall) ===== */
const TP_Z=-1000,TP={decks:[],walk:[],zips:[],signs:[],last:null,path:null,px:0,pz:0,in:0,falling:0,hand:null,rung:{}};
const TP_PATHS={easy:{n:'Easy path',e:'🟢',c:'#5fd4b0',coins:20},medium:{n:'Medium path',e:'🟡',c:'#ffd45c',coins:30},hard:{n:'Hard path',e:'🔴',c:'#ff6b6b',coins:40}};
function tp(){const d=S.tp||(S.tp={done:{},falls:0});if(!d.done)d.done={};return d;}
/* the course: decks (x,z = the middle, s = the side, h = the floor height), b = a plank bridge to the next deck, zip = a zip line to the next deck */
const TP_COURSE={
  easy:[{x:-10,z:10,h:2.6},{x:-10,z:6.6,h:2.6,b:1},{x:-10,z:2.4,h:2.8},{x:-12.2,z:-1.2,h:2.8},{x:-9,z:-4.6,h:3},{x:-9,z:-8,h:3,zip:1},{x:-9,z:-22,h:2,fin:1}],
  medium:[{x:0,z:9,h:3},{x:0,z:5.2,h:3},{x:2.6,z:1.6,h:3.3},{x:2.6,z:-2.6,h:3.3,b:1},{x:6.6,z:-2.6,h:3.3},{x:6.6,z:-6.6,h:3.6},{x:3.6,z:-10.4,h:3.6},{x:3.6,z:-14.4,h:3.6,zip:1},{x:3.6,z:-30,h:2.4},{x:3.6,z:-33.8,h:2.4,fin:1}],
  hard:[{x:12,z:9,h:3.6},{x:12,z:4.8,h:3.6},{x:15.4,z:1.6,h:4},{x:15.4,z:-2.6,h:4,s:2,b:1},{x:19,z:-2.6,h:4.2,s:2},{x:19,z:-6.8,h:4.4,s:2},{x:15.6,z:-10,h:4.4,s:2},{x:15.6,z:-14.2,h:4.6,s:2},{x:15.6,z:-18.4,h:4.8,s:2,zip:1},{x:15.6,z:-36,h:3,s:2},{x:15.6,z:-40.2,h:3,fin:1}]};
const TP_MATS={};function tpCrown(c){return TP_MATS[c]||(TP_MATS[c]=toon({color:c,emissive:new THREE.Color(c),emissiveIntensity:.28}));}   /* 🌳 the park's crowns keep their colour on the shady side too (run 4, stage 3: a crown seen from its dark side was a muddy olive) */
function tpTallTree(g,x,z,hh,c){cyl(g,.42,.52,hh,'#8f6244',x,0,z,{seg:8,ol:.03});const m=tpCrown(c);sph(g,2.1,c,x,hh+.7,z,{ws:9,hs:6,mat:m});sph(g,1.5,c,x+1.4,hh+.1,z+.3,{ws:8,hs:5,mat:m});sph(g,1.4,c,x-1.3,hh+.2,z-.5,{ws:8,hs:5,mat:m});}
function tpDeck(L,st,d,c,i,prev,next){const s=d.s||2.4,x=d.x,z=d.z,h=d.h;box(st,s,.14,s,'#c99a66',x,h-.14,z,{ol:.02});for(let k=1;k<5;k++)box(st,s-.1,.016,.06,'#a06e45',x,h,z-s/2+k*s/5,{ol:false});   /* the plank lines (four, run 4, stage 3) */
  /* its tree: on the side farthest from the deck before and the deck after (never in a bridge or a jump), not where the ladder (west) or the finish sign (north) is */
  const off=1.95*(s/2.4),cands=[[off,0],[-off,0],[0,off],[0,-off]].filter(([ox,oz])=>!((i===0||d.fin)&&ox<0)&&!(d.fin&&oz<0));
  const far=([ox,oz])=>Math.min(...[prev,next].filter(Boolean).map(q=>Math.hypot(x+ox-q.x,z+oz-q.z)),99);cands.sort((a,b)=>far(b)-far(a));const [ox,oz]=cands[0],tx=x+ox,tz=z+oz;
  tpTallTree(st,tx,tz,h+(d.fin?4.2:5.4)+(i%3)*.5,pick(TREE_COLS));colC(L,tx,tz,.56);box(st,Math.max(.16,Math.abs(ox)),.16,Math.max(.16,Math.abs(oz)),'#8f6244',(x+tx)/2,h-.32,(z+tz)/2,{ol:.012});   /* the beam that holds the deck */
  cyl(st,.04,.04,1.3,'#8f6244',x+s/2-.12,h,z+s/2-.12,{seg:6,ol:false});sph(st,.05,'#ffd45c',x+s/2-.12,h+1.32,z+s/2-.12,{ws:6,hs:5,ol:false});cone(st,.19,.56,c,x+s/2-.12+.3,h+1.04,z+s/2-.12,{rz:-Math.PI/2,center:true,seg:3,ol:.012,s:[1,1,.12]});   /* the path's little pennant on its pole (run 4, stage 3: it was a flat slab) */
  TP.decks.push({x:L.ox+x,z:L.oz+z,w:s,d:s,h,i,path:d.path,fin:!!d.fin});}
function tpBridge(L,st,a,b){const h=a.h,dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz),ax=Math.abs(dx)>Math.abs(dz),sa=(a.s||2.4)/2,sb=(b.s||2.4)/2,x0=ax?a.x+Math.sign(dx)*sa:a.x,z0=ax?a.z:a.z+Math.sign(dz)*sa,gap=len-sa-sb;
  const mx=(x0+(ax?Math.sign(dx)*gap/2:0)),mz=(z0+(ax?0:Math.sign(dz)*gap/2));box(st,ax?gap:.9,.1,ax?.9:gap,'#c99a66',mx,h-.1,mz,{ol:.02});
  for(let k=0;k<Math.floor(gap/.5);k++){const u=(k+.5)*.5;box(st,ax?.03:.8,.012,ax?.8:.03,'#8f6244',ax?x0+Math.sign(dx)*u:mx,h,ax?mz:z0+Math.sign(dz)*u,{ol:false});}
  for(const sd of[-1,1]){const px=ax?0:sd*.46,pz=ax?sd*.46:0;for(const u of[.15,gap/2,gap-.15]){cyl(st,.05,.05,.95,'#8f6244',(ax?x0+Math.sign(dx)*u:mx)+px,h,(ax?mz:z0+Math.sign(dz)*u)+pz,{seg:6,ol:.01});}
    box(st,ax?gap:.07,.07,ax?.07:gap,'#e8d7b0',mx+px,h+.9,mz+pz,{ol:.01});box(st,ax?gap:.05,.05,ax?.05:gap,'#e8d7b0',mx+px,h+.45,mz+pz,{ol:false});}   /* rope rails: a top rope and a middle rope (run 4, stage 3: thicker, seen from a distance) */
  TP.walk.push({x1:L.ox+mx-(ax?gap/2:.45),x2:L.ox+mx+(ax?gap/2:.45),z1:L.oz+mz-(ax?.45:gap/2),z2:L.oz+mz+(ax?.45:gap/2),h});}
function tpZipLine(L,st,a,b,c){const sa=(a.s||2.4)/2,sb=(b.s||2.4)/2,dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz),ux=dx/len,uz=dz/len;const ax=a.x+ux*(sa-.3),az=a.z+uz*(sa-.3),bx=b.x-ux*(sb-.3),bz=b.z-uz*(sb-.3);
  for(const [x,z,h] of[[ax,az,a.h],[bx,bz,b.h]]){cyl(st,.07,.08,2.3,'#8f6244',x,h,z,{seg:7,ol:.012});}
  const A=new THREE.Vector3(ax,a.h+2.3,az),B=new THREE.Vector3(bx,b.h+2.3,bz),D=B.clone().sub(A),cab=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,D.length(),5),mat('#5a5f8c'));
  cab.position.copy(A).add(B).multiplyScalar(.5);cab.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),D.clone().normalize());st.add(cab);
  const Z={ax:L.ox+ax,az:L.oz+az,ay:a.h+2.3,bx:L.ox+bx,bz:L.oz+bz,by:b.h+2.3,T:D.length()/5.5,to:null,from:null};TP.zips.push(Z);
  inter(L,{x:ax-ux*.9,z:az-uz*.9,r:1.5,icon:'🪢',label:'Ride the zip line!',pri:()=>true,when:()=>Math.abs((P.cy||0)-a.h)<.7&&!P.ride,act:()=>tpZipGo(Z)});return Z;}
function buildTreePark(){
  const L=makeLoc('treepark','out',0,TP_Z,[-32,-52,36,30]);const st=new THREE.Group();L.g.add(st);const r=seeded(29);
  const gr=new THREE.Mesh(new THREE.PlaneGeometry(1400,1400),toon({color:'#8fd47a',polygonOffset:true,polygonOffsetFactor:4,polygonOffsetUnits:8}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;gr.userData.keep=1;L.g.add(gr);
  flat(st,9,14,'#d9b98a',0,.012,19);flat(st,3,6,'#d9b98a',0,.014,27);   /* the earth floor of the start deck and the way in */
  /* far hills and a few clouds (the town's sky things stay in town) */
  const hl=new THREE.Group();L.g.add(hl);for(let i=0;i<8;i++){const a=i/8*TAU;sph(hl,rand(38,52),pick(['#86d37c','#79c973','#93dc85']),Math.cos(a)*170,-rand(8,14),Math.sin(a)*170,{ol:.9,ws:12,hs:7,s:[1,.45,1]});}bake(hl,false);
  for(let i=0;i<4;i++){const c=new THREE.Group();const n=3+(i%2);for(let k=0;k<n;k++)sph(c,rand(5,8),null,k*6.5-n*3.2,rand(-1.5,1.5),rand(-3,3),{mat:CLOUD,ol:false,ws:9,hs:6,s:[1,.68,1]});c.position.set(rand(-120,120),rand(56,74),-60-rand(0,120));bake(c,false);L.g.add(c);}
  /* the gate back to town (south), with a fence */
  for(const s of[-1,1]){box(st,.3,3.6,.3,'#8f6244',s*2.2,0,26,{ol:.03});sph(st,.27,'#5fd4b0',s*2.2,3.85,26,{ws:10,hs:8});colC(L,s*2.2,26,.25);}
  box(st,4.9,.7,.24,'#8f6244',0,3.0,26,{ol:.03});{const sg=signPlane('🏘 To town',3.6,.56,'#8f6244','#ffffff');sg.position.set(0,3.35,25.86);sg.rotation.y=Math.PI;L.g.add(sg);}
  for(const s of[-1,1]){for(let x=3.2;x<16;x+=1.6){cyl(st,.06,.07,1.1,'#8f6244',s*x,0,26,{seg:5,ol:false});}box(st,12.6,.07,.07,'#b98a5e',s*9.6,.95,26,{ol:false});box(st,12.6,.07,.07,'#b98a5e',s*9.6,.55,26,{ol:false});col(L,s*3.0,25.7,s*16,26.3);}
  inter(L,{x:0,z:25.2,r:1.8,rect:{x1:-1.9,z1:TP_Z+24.2,x2:1.9,z2:TP_Z+26.4},icon:'🏘',label:'Back to town',act:()=>exitTo('treepark')});   /* (rect: world coordinates) */
  /* the three paths: a signpost and a ladder each, then the decks, bridges and zip lines */
  const keys=['easy','medium','hard'];keys.forEach((k,pi)=>{const PA=TP_PATHS[k],C=TP_COURSE[k],x0=[-9,0,9][pi];
    const sx=[-3.2,0,3.2][pi];cyl(st,.07,.08,2.0,'#8f6244',sx,0,16.5,{seg:7,ol:.012});const sg=signPlane(PA.e+' '+PA.n,k==='medium'?2.75:2.3,.56,PA.c,'#3d2c5e');   /* (the longer name gets a longer sign: the same letters as the others) */sg.position.set(sx,1.75,16.6);   /* (the sign 2 cm in front of its post; run 4, stage 3: the three signposts stand side by side, all three in view from the clearing) */L.g.add(sg);TP.signs.push(sg);colC(L,sx,16.5,.12);
    inter(L,{x:sx,z:17.6,r:1.7,icon:'🪜',label:'Climb up: the '+PA.n.toLowerCase(),pri:()=>true,when:()=>(P.cy||0)<.3&&!P.ride,act:()=>tpStart(k)});
    C.forEach((d,i)=>{d.path=k;tpDeck(L,st,d,PA.c,i,C[i-1],C[i+1]);if(i===0||d.fin){const l=d.x-(d.s||2.4)/2-.25,lz=d.z;for(const s of[-.22,.22])box(st,.07,d.h+.3,.07,'#b98a5e',l,0,lz+s,{rx:0,ol:false});for(let y=.35;y<d.h;y+=.42)box(st,.09,.05,.5,'#b98a5e',l,y,lz,{ol:false});   /* a ladder on the west side */
        inter(L,{x:l+.5,z:d.z,r:1.1,icon:'🪜',label:'Climb down',when:()=>Math.abs((P.cy||0)-d.h)<.7&&!P.ride,act:()=>tpDown()});}
      if(d.fin){const bx=d.x-.85;cyl(st,.06,.07,1.95,'#8f6244',bx,d.h,d.z,{seg:6,ol:false});cone(st,.42,.3,'#d3262f',bx,d.h+2.05,d.z,{seg:6,ol:.012});sph(st,.17,'#ffd45c',bx,d.h+1.8,d.z,{s:[1,.8,1],ws:12,hs:8,ol:.015});cyl(st,.16,.33,.5,'#ffd45c',bx,d.h+1.3,d.z,{seg:16,ol:.02});cyl(st,.37,.37,.07,'#e0a800',bx,d.h+1.25,d.z,{seg:16,ol:.012});sph(st,.08,'#8f6244',bx,d.h+1.16,d.z,{ws:6,hs:5,ol:false});box(st,.025,.42,.025,'#e8d7b0',bx,d.h+.74,d.z,{ol:false});   /* (a real bell: a dome, a flared mouth with a rim, the clapper and a rope; run 4, stage 3) */   /* 🔔 a big golden bell under a little red roof, on the deck's free side (run 4, stage 3: it hid behind the deck's tree) */
        const fx=d.x-.5,fs=signPlane('🏁 Finish',1.4,.46,PA.c,'#3d2c5e');fs.position.set(fx,d.h+2.62,d.z-(d.s||2.4)/2+.18);fs.rotation.y=0;L.g.add(fs);TP.signs.push(fs);for(const s of[-.65,.65])cyl(st,.05,.05,2.62,'#8f6244',fx+s,d.h,d.z-(d.s||2.4)/2+.1,{seg:5,ol:false});   /* (run 4, stage 3: the banner hangs behind the bell, so it shows while you ring it, and above the bell's roof) */   /* (the sign 3 cm in front of its posts) */
        inter(L,{x:bx,z:d.z,r:1.6,icon:'🔔',label:'Ring the bell!',pri:()=>true,when:()=>Math.abs((P.cy||0)-d.h)<.7&&!P.ride,act:()=>tpFinish(k)});}
      if(i<C.length-1){const n=C[i+1];if(d.b)tpBridge(L,st,d,n);else if(d.zip){const Z=tpZipLine(L,st,d,n,PA.c);Z.from=TP.decks[TP.decks.length-1];Z.toIdx=TP.decks.length;}}});
    TP.zips.forEach(Z=>{if(Z.toIdx!==undefined&&!Z.to){Z.to=TP.decks[Z.toIdx];}});});
  TP.zips.forEach(Z=>{if(!Z.to)Z.to=TP.decks.find(d=>Math.abs(d.x-Z.bx)<2&&Math.abs(d.z-Z.bz)<2.5);});
  /* the woods around: bushes, flowers and plenty of trees away from the course */
  const onCourse=(x,z)=>TP.decks.some(d=>Math.abs(d.x-L.ox-x)<4.5&&Math.abs(d.z-L.oz-z)<4.5)||(Math.abs(x)<16&&z>12&&z<30);
  for(let i=0,n=0;i<900&&n<74;i++){const x=-31+r()*66,z=-51+r()*79;if(onCourse(x,z))continue;const k=r();
    if(k<.5){const s=.8+r()*.5;if(r()<.4)pineLo(st,x,0,z,s*1.3,pick(PINE_COLS));else treeLo(st,x,0,z,s,pick(TREE_COLS));colC(L,x,z,.3);}
    else if(k<.75){const c=pick(['#5fbf74','#6cc97c','#4fae64']);sph(st,.5,c,x,.35,z,{ws:7,hs:5});sph(st,.36,c,x+.4,.28,z+.15,{ws:7,hs:5});colC(L,x,z,.55);}
    else if(k<.9){for(let q=0;q<3;q++){const fx=x+r()*1.2-.6,fz=z+r()*1.2-.6;cyl(st,.014,.014,.26,'#4fae5c',fx,0,fz,{seg:4,ol:false});sph(st,.07,pick(['#ff7aa8','#ffd45c','#ffffff','#b79cff']),fx,.3,fz,{ws:6,hs:5,ol:.01});}}
    else{const h=.14+r()*.1;cyl(st,.04,.05,h,'#fff4e0',x,0,z,{seg:6,ol:.01});sph(st,.11,'#ff5d6c',x,h,z,{s:[1,.6,1],ws:8,hs:6,ol:.012});}n++;}
  bake(st,true,32);
  /* the zip-line handle you hang from (shows during a ride) */
  const hd=new THREE.Group();box(hd,.6,.05,.05,'#5a5f8c',0,0,0,{ol:false});for(const s of[-.22,.22])box(hd,.04,.5,.04,'#e8d7b0',s,-.5,0,{ol:false});box(hd,.5,.04,.04,'#8f6244',0,-.5,0,{ol:false});hd.visible=false;L.g.add(hd);TP.hand=hd;
  const mk=new THREE.Group();{const m=new THREE.Mesh(starGeo(.42,0,.12),STARM);mk.add(m);hull(mk,starGeo(.42,.042,.12),m,{});}   /* (run 4, stage 3: a turning star; the arrow looked like a floating pencil in two pieces) */mk.visible=false;mk.userData.keep=1;L.g.add(mk);TP.mark=mk;   /* ⬇️ a bobbing yellow arrow over the next deck of your path (run 4, stage 3) */
  return L;}
/* ---- the floor physics ---- */
function tpSupport(x,z,feet){let h=0;for(const d of TP.decks){if(d.h<=feet+.5&&Math.abs(x-d.x)<=d.w/2&&Math.abs(z-d.z)<=d.d/2)h=Math.max(h,d.h);}for(const w of TP.walk){if(w.h<=feet+.5&&x>=w.x1&&x<=w.x2&&z>=w.z1&&z<=w.z2)h=Math.max(h,w.h);}return h;}
function tpDeckAt(x,z,h){return TP.decks.find(d=>Math.abs(d.h-h)<.3&&Math.abs(x-d.x)<=d.w/2&&Math.abs(z-d.z)<=d.d/2)||null;}
function tpMark(){const L=LOC.treepark,mk=TP.mark;if(!mk||!L)return;const last=TP.last,nx=last&&!last.fin&&(P.cy||0)>.3&&CUR===L?TP.decks.find(d=>d.path===last.path&&d.i===last.i+1):null;mk.visible=!!nx;if(nx){mk.position.set(nx.x-L.ox,nx.h+2.3+Math.sin(performance.now()/260)*.14,nx.z-L.oz);mk.rotation.y=Math.atan2(camera.position.x-nx.x,camera.position.z-nx.z)+Math.sin(performance.now()/500)*.35;}}
function tpTick(dt){tpMark();const T=TP;if(!CUR||CUR.id!=='treepark'){if(T.in){T.in=0;T.last=null;T.path=null;if(P.ride&&P.ride.kind==='zip')P.ride=null;if(T.hand)T.hand.visible=false;}return;}
  if(!T.in){T.in=1;T.last=null;T.path=null;T.px=P.x;T.pz=P.z;setTimeout(()=>{if(CUR&&CUR.id==='treepark')toast('🌲 Welcome to the Tree Park! Pick a path at the signs and climb up. Falling is fine: you pop back up! 🍃',4.5);},700);}
  if(!PLAYING||CUT||fading)return;
  if(P.ride&&P.ride.kind==='zip'){tpZip(dt);return;}
  const c=P.cy||0;
  if(P.jy<=0&&P.vy<=0){const h=tpSupport(P.x,P.z,c);
    if(Math.abs(h-c)<.4){P.cy=h;if(h>0){const d=tpDeckAt(P.x,P.z,h);if(d)T.last=d;}}
    else if(h>c){P.x=T.px;P.z=T.pz;}   /* a deck's side: solid */
    else{P.jy=c-h;P.cy=h;P.vy=0;}   /* walked off an edge: the same height, but the floor is now the lower one: down you go */
    if((P.cy||0)===0&&T.last&&!T.falling&&P.jy<=0)tpFall();}
  else{const a=c+P.jy,h=tpSupport(P.x,P.z,a);
    if(h>a+.03){P.x=T.px;P.z=T.pz;}   /* jumping into a deck's side */
    else if(h>c){if(P.vy<=0&&a<=h+.12){P.cy=h;P.jy=0;P.vy=0;P.dip=.07;SFX.land();const d=tpDeckAt(P.x,P.z,h);if(d)T.last=d;}}
    else if(h<c){P.jy+=c-h;P.cy=h;}}   /* over lower ground: the same height, a lower floor */
  T.px=P.x;T.pz=P.z;}
function tpFall(){const T=TP,d=T.last;if(!d)return;T.falling=1;const s=tp();s.falls=(s.falls||0)+1;SFX.pop();toast('Whoops! 🍃 Soft landing… back up to the last deck!',2.6);
  fade(()=>{P.x=d.x;P.z=d.z;P.cy=d.h;P.jy=0;P.vy=0;P.pitch=0;T.px=P.x;T.pz=P.z;T.falling=0;});}
function tpStart(k){const C=TP_COURSE[k],d=TP.decks.find(q=>q.path===k&&q.i===0);if(!d||P.ride)return;SFX.tap();const PA=TP_PATHS[k];
  fade(()=>{P.x=d.x;P.z=d.z;P.cy=d.h;P.jy=0;P.vy=0;P.pitch=-.05;const n=TP.decks.find(q=>q.path===k&&q.i===1);if(n)P.yaw=Math.atan2(-(n.x-d.x),-(n.z-d.z));TP.last=d;TP.path=k;TP.px=P.x;TP.pz=P.z;TP.rung[k]=0;
    toast(PA.e+' Jump from deck to deck ('+(TOUCHY?'⬆️':'⬆️ or Space')+'), then ring the bell! 🔔',4);});}
function tpDown(){if(P.ride)return;SFX.tap();fade(()=>{P.x=TP_PATHS[TP.path]?[-9,0,9][['easy','medium','hard'].indexOf(TP.path)]:0;P.z=TP_Z+19.5;P.cy=0;P.jy=0;P.vy=0;P.yaw=Math.PI;TP.last=null;TP.path=null;TP.px=P.x;TP.pz=P.z;});}
function tpZipGo(Z){if(P.ride||!Z)return;SFX.pop();P.ride={kind:'zip',Z,t:0};P.jy=0;P.vy=0;if(TP.hand)TP.hand.visible=true;toast('🪢 Hold on tight! Wheee!',1.8);}
function tpZip(dt){const r=P.ride,Z=r.Z;r.t+=dt;const u=Math.min(1,r.t/Z.T),e=u<.15?u*u/.15*.5+u*.5:u;   /* a soft start */
  const x=lerp(Z.ax,Z.bx,e),z=lerp(Z.az,Z.bz,e),y=lerp(Z.ay,Z.by,e)-.35*4*e*(1-e);P.x=x;P.z=z;P.cy=y-2.05;P.jy=0;P.vy=0;P.yaw=Math.atan2(-(Z.bx-Z.ax),-(Z.bz-Z.az));P.moving=false;
  if(TP.hand){TP.hand.position.set(x-LOC.treepark.ox,y-.08,z-LOC.treepark.oz);TP.hand.rotation.y=P.yaw;}
  if(u>=1){P.ride=null;if(TP.hand)TP.hand.visible=false;const d=Z.to;if(d){P.cy=d.h;TP.last=d;}P.dip=.07;SFX.land();TP.px=P.x;TP.pz=P.z;qEvent('zip');}}
function tpFinish(k){const PA=TP_PATHS[k];if(TP.rung[k])return;TP.rung[k]=1;const s=tp(),first=!s.done[k];s.done[k]=1;SFX.ding();setTimeout(()=>SFX.yay(),250);addXP('sport',4);
  if(first){S.coins+=PA.coins;popText('+'+PA.coins+' 🪙','coin');}hardEvent('treepark',1);qEvent('treepark');change();
  const all=['easy','medium','hard'].every(q=>s.done[q]);toast((first?'🎉 You finished the '+PA.n.toLowerCase()+'! ':'🔔 Ding! The '+PA.n.toLowerCase()+' again! ')+(all?'All three paths done, you are a tree-top champion! 🏆':first?'+'+PA.coins+' coins. Climb down for another path!':'Great jumping!'),4.5);}
/* ===== 📸 run 4, job 15 (item 9): the Photographer job. Rosie offers it like the others. A booking arrives as a text message (a family, a wedding, a birthday, pets with their owners) with the
   place; the map shows the way. At the spot: pick the background (2 or 3 per spot: one button cycles them, the group walks over), tap a person (or walk up and use the action button) for pose
   buttons, then frame, zoom and snap. Pay by how good the photo is (stars 1 to 5, pay 15/35/60/90/120 like the hairstylist): everyone inside the dashed frame and nobody cut off, faces towards
   the camera, everyone posed, the people filling the frame well, the background the client asked for. The client's thank-you message shows the photo. 4 bookings a game day. Touch and
   keyboard (Space snaps, + and - zoom, N = next background, E or a tap on a person = poses). The state object is PHO (PHO.on while a shoot is on; the update guard of job 2 knows it) ===== */
const PT_MAX=4,PT_PAY=[0,15,35,60,90,120],PT_IN=[.88,.84];   /* PT_IN: inside these screen limits (the dashed viewfinder) counts as "in the picture" */
const PT_SPOTS={
  park:{n:'Cozy Park',at:[-22,11.6],bgs:[{id:'fountain',n:'the fountain',g:[-22,15.0],face:Math.PI},{id:'flowers',n:'the flower beds',g:[-28.6,13.6],face:Math.PI*.7},{id:'stage',n:'the Pet Show stage',g:[-33.6,19.4],face:Math.PI*.5}]},
  pond:{n:'Duck Pond',at:[34.6,-31.4],bgs:[{id:'pond',n:'the duck pond',g:[36.2,-33.3],face:0},{id:'bench',n:'the bench',g:[32.6,-37.9],face:Math.PI}]},
  school:{n:'Cozy Town School',at:[-25,-53.2],bgs:[{id:'school',n:'the school door',g:[-25,-56.6],face:0},{id:'flag',n:'the school sign',g:[-23.0,-55.2],face:-.25,at:[-22.4,3.3,-57.5]}]},
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
function ptInters(){if(PHO.inters||!LOC.city)return;PHO.inters=1;for(const k in PT_SPOTS){const Sp=PT_SPOTS[k];inter(LOC.city,{x:Sp.at[0],z:Sp.at[1],r:3.4,icon:'📸',label:'Set up the photo',pri:()=>true,when:()=>!!(S&&S.job==='photo'&&S.pt&&S.pt.o&&S.pt.o.spot===k&&S.pt.o.st==='go'),act:()=>ptSetup()});}}
function ptLookOf(id,K,i){const l=Object.assign({},(WHO[id]&&WHO[id].look)||pick(TOWNFOLK));if(K.hats){l.hat='party';l.hatc=pick(['#ff6b6b','#7cc8ff','#ffd45c','#5fd4b0']);}if(K.grown&&i===0){l.top='#ffffff';l.bottom='#ffffff';}return l;}
/* the people (and the pet) of the booking appear at the first background, in a row, facing where the photo is taken from */
function ptSetup(){const d=pt(),o=d.o;if(!o||o.st!=='go')return;const K=PT_KINDS[o.kind];o.st='shoot';PHO.bg=null;PHO.zoom=1;PHO.group=[];
  o.who.forEach((id,i)=>{const look=ptLookOf(id,K,i),p=makePerson(look);bakePerson(p);scene.add(p.root);const nm=(WHO[id]&&WHO[id].nm)||'Friend';const tg=label(nm,.3);tg.position.y=1.95*(look.scale||1)+.1;tg.material.depthTest=false;tg.renderOrder=30;p.root.add(tg);   /* (run 4, stage 3: a name tag is drawn over anyone nearer the camera, so it is always readable) */
    const m={p,root:p.root,nm,pose:null,t:Math.random()*6,kind:'person',lab:tg};PHO.group.push(m);
    m.tg=inter(LOC.city,{x:0,z:0,r:2.4,pri:()=>true,icon:'🧍',label:()=>(m.pose?PT_POSES.find(q=>q[0]===m.pose)[1]+' ':'')+'Pose: '+nm,act:()=>ptPoseCard(PHO.group.indexOf(m)),obj:p.root,pt:1});});
  if(o.pet){const pm=makePet(o.pet,PET_TYPES[o.pet].cols[0]);scene.add(pm.root);const m={p:pm,root:pm.root,nm:PET_TYPES[o.pet].name,pose:'sit',t:0,kind:'pet'};PHO.group.push(m);}
  PHO.on=1;document.body.classList.add('shoot');$('ptvf').hidden=false;$('note').hidden=true;ptPlace(o.bg);ptAside(true);SFX.pop();toast('📸 Pose everyone, then\u00a0Snap!',3.6);change();jobHud(true);}
function ptPlace(bg){const o=pt().o,Sp=ptSpotOf(o),B=Sp.bgs.find(b=>b.id===bg)||Sp.bgs[0];PHO.bg=B.id;const n=PHO.group.length,sx=Math.cos(B.face),sz=-Math.sin(B.face);
  PHO.group.forEach((m,i)=>{const k=i-(n-1)/2,x=B.g[0]+sx*k*1.0,z=B.g[1]+sz*k*1.0;   /* (1 m apart: waving arms went into the next head; run 4, stage 3) */m.x=x;m.z=z;m.y=groundY(x,z);m.root.position.set(x,m.y,z);m.root.rotation.y=B.face;m.face=B.face;if(m.tg){m.tg.x=x;m.tg.z=z;}});ptBar();ptCamGo(B);}
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
ACT.ptbye=()=>{if(document.querySelector('#card [data-a="ptbye"]'))closePanel();ptClear();const d=pt();d.o=null;d.wait=rand(18,40);change();jobHud(true);setTimeout(()=>{if(PLAYING)toast(d.done>=PT_MAX?`🌟 That's ${PT_MAX} photos today! Great job! More bookings tomorrow.`:'📸 Nice work! The next booking will come soon.',3.4);},400);};
function ptInFan(x,z){if(!FAN.on||!CUR||FAN.loc!==CUR.id)return false;const cx=camera.position.x,cz=camera.position.z;for(const f of FRIEND_ACTORS){if(!f.fan||f.loc!==CUR.id)continue;const dx=f.fan[0]-cx,dz=f.fan[1]-cz,L2=dx*dx+dz*dz||1,u=((x-cx)*dx+(z-cz)*dz)/L2;if(u>.08&&u<.92&&Math.hypot(x-(cx+dx*u),z-(cz+dz*u))<.7)return true;}return false;}   /* 👫 between you and a friend standing round you? A passer-by there steps out of view, like out of a photo (run 4 finish: one stood in front of Luna and Theo) */
function ptInShot(x,z){if(!PHO.on||!PHO.group.length)return false;const m=PHO.group[0],cx=camera.position.x,cz=camera.position.z,dx=m.x-cx,dz=m.z-cz,L2=dx*dx+dz*dz||1;const u=clamp(((x-cx)*dx+(z-cz)*dz)/L2,-.4,1.4);return Math.hypot(x-(cx+dx*u),z-(cz+dz*u))<3;}   /* within 3 m of the line from the camera to the family? */
function ptAside(on){for(const w of PET_ACTORS)if(w.loc==='city'||!on)w.g.visible=!on;for(const f of FRIEND_ACTORS)if(f.mode==='follow'||!on)f.g.visible=!on;}   /* 🐾 your pets and the friends who follow you wait out of the picture during a shoot (run 4, stage 3: they photobombed every photo) */
function ptClear(){ptAside(false);for(const m of PHO.group){scene.remove(m.root);m.root.traverse(o=>{if(o.geometry&&!o.userData.keep)o.geometry.dispose();});}PHO.group=[];PHO.on=0;PHO.res=0;PHO.zoom=1;PHO.bg=null;if(LOC.city)LOC.city.inter=LOC.city.inter.filter(t=>!t.pt);
  document.body.classList.remove('shoot');$('ptvf').hidden=true;ptBar();if(UI.open&&document.querySelector('#card [data-a="ptbye"],#card [data-a^="ptpose"]'))closePanel();}
function ptTick(dt){const d=pt();ptInters();if(PHO.on&&PHO.res&&!(UI.open&&document.querySelector('#card [data-a="ptbye"]'))){ACT.ptbye();return;}   /* 📸 the result card went another way (the phone or the bag opened over it): the shoot ends as with Bye (run 4 finish: it stayed on, the map and the notepad hidden) */if(S.job!=='photo'){if(PHO.on||PHO.group.length)ptClear();return;}
  if(!d.o&&d.done<PT_MAX&&!CUT&&isDaytime()&&CUR&&CUR.id==='city'){d.wait-=dt;if(d.wait<=0)ptNew();}
  if(PHO.on){if(CUR.id!=='city'){ptClear();if(d.o)d.o.st='go';}else{ptAnim(dt);tagsApart(PHO.group.filter(m=>m.lab&&m.lab.visible).map(m=>({tag:m.lab})));}}   /* (the family's name tags step apart on screen) */
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

function applyGfx(){const nice=SET.gfx!=='fast';renderer.setPixelRatio(Math.min(devicePixelRatio||1,nice?2:1));renderer.shadowMap.enabled=nice;sun.castShadow=nice;
  scene.traverse(o=>{if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true);}});resize();}
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;BASEFOV=w<h?80:70;camera.fov=BASEFOV;camera.updateProjectionMatrix();}
let last=performance.now(),saveT=0,titleT=0,hardT=0,navT=0;
function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;
  if(PLAYING){
    {if(clockSync()){newDay();change();}   /* 🕰️ the one clock (run 4, job 1): the time and the day come from the real time, the same for everyone */
      S.hunger=Math.max(0,S.hunger-dt/HOUR*4);if(S.hunger<20&&!hungryWarn){hungryWarn=true;toast('Your tummy is rumbling! Eat something from your 🎒 bag.',4);}if(S.hunger>30)hungryWarn=false;}
    updatePlayer(dt);tpTick(dt);   /* 🌲 the Tree Park's floor physics (run 4, job 16) */
    fanTick(dt);let fi=0;for(const f of FRIEND_ACTORS)f.update(dt,f.mode==='follow'?fi++:0);PET_ACTORS.forEach((p,i)=>p.update(dt,fi+i+(fi?0:1)));tagsApart([...FRIEND_ACTORS,...PET_ACTORS].filter(f=>f.g.visible&&f.loc===CUR.id&&f.tag).map(f=>({tag:f.tag,bub:f.bub||null})));   /* (run 4 finish: your pets' tags too; indoors three of them piled up) */
    if(CUR.id==='pets')updatePen(dt);
    if(CUR.id==='toys'&&CUR.train){const T=CUR.train;T.userData.t=(T.userData.t||0)+dt*.9;T.children.forEach((c,i)=>{const a=T.userData.t-i*.32;c.position.set(Math.cos(a)*.88,0,Math.sin(a)*.55);c.rotation.y=Math.atan2(-Math.sin(a)*.88,Math.cos(a)*.55);});}
    wkStat();for(const w of WALKERS)w.update(dt);walkersApart(dt);granTick(dt);   /* 🚶 townspeople give way to each other and walk round people who stand or sit about */
    updateCars(dt);mpTick(dt);hpTick(dt);laneTick(dt);zzTick(dt);for(const s of SHOPPERS)s.update(dt);
    updGarden(dt);bdTick(dt);
    fbTick(dt);   /* ⚽ the football friends */
    {const vis=CUR.id==='city'&&sittersOut();for(const s of SITTERS){s.p.root.visible=vis;if(vis){s.t+=dt;s.p.head.rotation.y=Math.sin(s.t*.5)*.35;if(s.p.wave>0){s.p.wave-=dt;s.p.arms[1].rotation.z=2.5+Math.sin(s.p.wave*14)*.35;}else s.p.arms[1].rotation.z*=.85;}}}
    psUpdate(dt);dayTick();holTick(dt);fwTick(dt);confTick(dt);spookTick(dt);wxTick(dt);hsTick(dt);hsTutTick(dt);   /* 🎃 holidays from the real calendar; 👻 the spooky path; 🌦️ the weather */
    for(const k of KEEPERS)if(k.L===CUR){k.p.root.rotation.y=angLerp(k.p.root.rotation.y,Math.atan2(P.x-k.x,P.z-k.z),.05);animPerson(k.p,dt,false);}
    if(CUR&&CUR.id==='studio'&&!CR&&!fading){setLoc('city');P.x=-17;P.z=-4.6;P.yaw=0;P.pitch=0;P.sit=null;P.ride=null;$('hud').hidden=false;camera.clearViewOffset();resize();saveLocal();}
    if(CUT)cutUpdate(dt);if(CLIMB)climbUpdate(dt);floorVis();
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
  updSky();renderer.render(scene,camera);
}
async function boot(){
  capsEarly();
  try{
    const cv=$('c');renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});RENDER0=renderer.render.bind(renderer);
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    {const K=THREE.ShaderChunk,f=K.shadowmap_pars_fragment;if(f.includes('return shadow;'))K.shadowmap_pars_fragment=f.replace('return shadow;','return mix(shadow,1.0,smoothstep(.72,.98,max(abs(shadowCoord.x-.5),abs(shadowCoord.y-.5))*2.));');}   /* 🌳 shadows fade out softly far away instead of popping in */
    initMaterials(renderer.capabilities.isWebGL2);
    scene=new THREE.Scene();FOG=new THREE.Fog('#c4ecff',55,270);scene.fog=FOG;
    camera=new THREE.PerspectiveCamera(70,1,.1,700);camera.rotation.order='YXZ';
    hemi=new THREE.HemisphereLight('#ffffff','#a8c69a',.75);scene.add(hemi);
    sun=new THREE.DirectionalLight('#fff4e0',.9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=-30;sc.right=30;sc.top=30;sc.bottom=-30;sc.near=1;sc.far=150;sun.shadow.bias=-.0006;sun.shadow.normalBias=.09;scene.add(sun);scene.add(sun.target);
    lamp=new THREE.PointLight('#ffe2b8',0,20,1.4);scene.add(lamp);
    try{await Promise.race([document.fonts.load('800 40px "Baloo 2"'),new Promise(r=>setTimeout(r,2000))]);}catch(e){}
    seasonSet();buildSky();buildCity();buildHome();buildMarket();buildPetShop();buildFlowerShop();buildCafe();buildSalon();buildClothesShop();buildToyStore();buildBakery();buildIceCream();buildLibrary();buildSchool();buildClassrooms();buildFireStation();buildPizzeria();buildApts();buildClientRoom();buildVisit();buildBeach();buildTreePark();buildStudio();buildActors();buildTownfolk();buildPetShow();buildCars();buildBall();buildShoppers();
    S=freshState();setLoc('city');S=null;holCheck();   /* 🎃 decorations for today's real date */
    setupInput();applyGfx();addEventListener('resize',resize);
    requestAnimationFrame(t=>{last=t;frame(t);});
    cloudInit();
    const b=$('tPlay');b.disabled=false;b.textContent='Play';b.focus({preventScroll:true});
  }catch(e){console.error(e);const d=document.createElement('div');d.id='err';d.textContent='Oops, the game could not start on this device. ('+(e&&e.message||e)+')';document.body.appendChild(d);}
}
boot();


