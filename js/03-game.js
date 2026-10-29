'use strict';
/* ================= game ================= */
/* 🕰️ the clock: day 7:00→21:00 takes 10 real minutes, night 21:00→7:00 takes 5. HOUR = real seconds per game hour
   right now (the main loop sets it every frame), so hunger, pet happiness and plants keep counting game hours */
const hourLen=h=>h>=7&&h<21?600/14:300/10;let HOUR=hourLen(12);
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
function clockSync(){if(!S)return false;const c=clockNow();HOUR=hourLen(c.time);if(c.day===S.day){if(Math.abs(c.time-S.time)>.1)hudT=1;S.time=c.time;return false;}   /* (run 4 finish: after a jump of the clock, a phone waking up, the chip is right at once, not half a second later) */const d0=S.day;S.day=c.day;S.time=c.time;dayJump(d0);return true;}   /* true = a new day began */
function dayJump(d0){if(!S.garden)return;for(const st of S.garden)if(st&&st.seed&&st.g<1&&st.w>0&&st.w<S.day)st.g=1;}   /* 🌱 a plant watered on a day that has passed finished growing */
function clockLoad(){for(const k in BUS_DAY)delete BUS_DAY[k];if(!S.intro){const c=clockNow();S.day=c.day;S.time=c.time;busWelcome();}else clockSync();}   /* a new player starts at the real time; an old save jumps once to the shared day */
function clockServer(h){try{const d=Date.parse(h.get('date')||''),age=+h.get('age')||0;if(!isFinite(d)||age>10)return;const o=d+500-Date.now();if(Math.abs(o)<400*864e5&&Math.abs(o-CLK.off)>1500)CLK.off=o;}catch(e){}}   /* the server's clock: the Date header of a fresh response (1 s steps, so +500 ms) */
const P={x:-17,z:-4.8,yaw:0,pitch:0,bobT:0,bobA:0,moving:false,sit:null,jy:0,vy:0,dip:0,run:false,hd:Math.PI};
let S=null,PLAYING=false,PET_ACTORS=[],FRIEND_ACTORS=[],PEN=[],KEEPERS=[],LITTER=[],HOME_ITEMS=new Map(),TARGET=null;
const UI={open:false,onClose:null,lock:false};
const DEFAULT_LOOK={skin:'#fdc991',hair:'#8d6238',style:'long',eyes:'round',mouth:'smile',top:'#fdc1fa',bottom:'#37a4fc',shoes:'#8c6137',outfit:'sweater',hat:'none',glasses:'none'};
const CLOTHES={dress:{n:'Dresses',i:'👗',p:120},sweaters:{n:'6 new sweater colors',i:'👚',p:100,slot:'top',cols:['#ffd45c','#5fd4b0','#b79cff','#ff6b6b','#ffffff','#2e2347']},
  pants:{n:'6 new pants colors',i:'👖',p:80,slot:'bottom',cols:['#ff9ec4','#b79cff','#ffffff','#2e2347','#ffd45c','#5fd4b0']},shoes:{n:'5 new shoe colors',i:'👟',p:60,slot:'shoes',cols:['#ffffff','#ff7aa8','#ff4d4d','#ffd45c','#7cc8ff']},
  cap:{n:'Cap',i:'🧢',p:60,hat:1,cols:['#ff6b6b','#5fa8ff','#ffd45c','#5fd4b0','#ff9ec4','#2e2347']},beanie:{n:'Beanie',i:'⛄',p:60,hat:1,cols:['#7cc8ff','#ff9ec4','#ffd45c','#b79cff','#ff8a6b']},
  bow:{n:'Big bow',i:'🎀',p:50,hat:1,cols:['#ff4d8d','#ff6b6b','#7cc8ff','#ffd45c','#b79cff','#ffffff']},flowers:{n:'Flower crown',i:'🌸',p:80,hat:1,cols:['#ff7aa8','#b79cff','#ff8a6b','#7cc8ff']},
  bunny:{n:'Bunny ears',i:'🐰',p:70,hat:1,cols:['#ffffff','#ff9ec4','#b79cff','#c49a74']},cat:{n:'Cat ears',i:'🐱',p:70,hat:1,cols:['#2e2347','#ffffff','#ff9ec4','#ff8a6b']},
  cowboy:{n:'Cowboy hat',i:'🤠',p:90,hat:1,cols:['#9a6a43','#ff7aa8','#ffffff','#2e2347']},witch:{n:'Witch hat',i:'🧙',p:90,hat:1,cols:['#2e2347','#b79cff','#5fd4b0']},
  headphones:{n:'Headphones',i:'🎧',p:120,hat:1,cols:['#ff7aa8','#7cc8ff','#5fd4b0','#ffd45c','#2e2347']},tiara:{n:'Tiara',i:'💎',p:180,hat:1,cols:['#ff7aa8','#7cc8ff','#b79cff']},
  flower:{n:'Hair flower',i:'🌺',p:60,hat:1,cols:['#ff7aa8','#ff6b6b','#ffffff','#ffd45c','#b79cff']},halo:{n:'Angel halo',i:'😇',p:100,hat:1,cols:['#ffd45c','#ffffff','#ff9ec4']},
  unicorn:{n:'Unicorn headband',i:'🦄',p:110,hat:1,cols:['#ffffff','#ff9ec4','#b79cff','#7cc8ff']},beret:{n:'Beret',i:'🎨',p:70,hat:1,cols:['#ff6b6b','#2e2347','#ff9ec4','#5fd4b0']},crown:{n:'Crown',i:'👑',p:400,hat:1,cols:['#ffd45c','#d8dcea','#ff9ec4']},
  glasses:{n:'Glasses',i:'👓',p:60,gl:1,cols:['#3d2c5e','#ff7aa8','#7cc8ff','#ffd45c']},sunglasses:{n:'Sunglasses',i:'🕶️',p:80,gl:1,cols:['#2e2347','#ff7aa8','#5fa8ff','#ffd45c']},hearts:{n:'Heart glasses',i:'💖',p:70,gl:1,cols:['#ff4d8d','#ff7aa8','#b79cff']},
  /* 🎃 Halloween costumes (run 4, job 3): in the Clothes Shop in October only; worn over your clothes (one tap on, one tap off at the mirror); kept after October */
  co_cat:{n:'Cat costume',i:'🐈',p:160,co:'cat',oct:1},co_dog:{n:'Dog costume',i:'🐕',p:160,co:'dog',oct:1},co_ghost:{n:'Ghost costume',i:'👻',p:160,co:'ghost',oct:1},co_dino:{n:'Dinosaur costume',i:'🦖',p:180,co:'dino',oct:1},co_bunny:{n:'Bunny costume',i:'🐰',p:0,co:'bunny',gift:1}};   /* 🐰 gift: not for sale, the Easter Bunny gives it (run 4, job 11) */
function variants(k){return(S.outfits||[]).filter(v=>v.k===k);}
function owns(k){const C=CLOTHES[k];if(C&&(C.hat||C.gl))return variants(k).length>0;return !!(S.wardrobe&&S.wardrobe[k]);}
function lookOpts(k){let base=LOOK_OPTS[k];if(k==='top'&&owns('sweaters'))base=base.concat(CLOTHES.sweaters.cols);if(k==='bottom'&&owns('pants'))base=base.concat(CLOTHES.pants.cols);if(k==='shoes'&&owns('shoes'))base=base.concat(CLOTHES.shoes.cols);const x=S&&S.xcol&&S.xcol[k];return x&&x.length?base.concat(x.filter(c=>!base.includes(c))):base;}
const LOOK_OPTS={eyes:[['round','Round'],['happy','Happy'],['sleepy','Sleepy'],['sparkle','Sparkly']],skin:['#fdc991','#d5914c'],
  mouth:[['smile','Smile'],['grin','Big grin'],['small','Small'],['cat','Kitty']],
  style:[['long','Long'],['bob','Bob'],['short','Short'],['ponytail','Ponytail'],['bun','Bun'],['pigtails','Pigtails'],['curly','Curly']],
  hair:['#704d2d','#8d6238','#c5874a','#ffa760'],top:['#fdc1fa','#fe8cf8','#34bffc','#36a4fe'],bottom:['#37a4fc','#35bffb'],shoes:['#8c6137','#232028']};
function lookToPerson(l){l=Object.assign({},DEFAULT_LOOK,l||{});return{co:COSTUMES[l.co]?l.co:null,hatc:l.hatc,glc:l.glc,skin:l.skin,hair:l.hair,hair2:shade(l.hair,-.1),style:l.style,eyes:l.eyes,mouth:l.mouth,top:l.top,sleeve:shade(l.top,-.11),bottom:l.bottom,shoes:l.shoes,round:true,swoop:l.style==='long'||l.style==='bob',dress:l.outfit==='dress',hat:l.hat,glasses:l.glasses};}
let CLO={sel:null,col:null};
function openClothes(){S.wardrobe=S.wardrobe||{};S.outfits=S.outfits||[];
  let body;if(CLO.sel){const C=CLOTHES[CLO.sel],have=variants(CLO.sel).map(v=>v.c);
    body=`<div class="it" style="cursor:default;max-width:240px;margin:8px auto 0"><span class="em">${C.i}</span><span>${C.n}</span><span class="pr">${C.p} 🪙</span></div>
      <p class="note" style="text-align:center">Pick a color${have.length?' (✔ = you have it)':''}</p><div class="swrow" style="justify-content:center">${C.cols.map(c=>`<button class="sw ${c===CLO.col?'on':''}" style="background:${c}" data-a="clocol:${c}" aria-label="Color">${have.includes(c)?'✔':''}</button>`).join('')}</div>
      <div class="row" style="justify-content:center"><button class="btn mint" data-a="clobuy" ${S.coins<C.p?'disabled':''}>Buy it</button><button class="btn white" data-a="cloback">Back</button></div>${S.coins<C.p?'<p class="note" style="text-align:center">Not enough coins yet.</p>':''}`;}
  else body=newInHTML('clothes')+`<div class="sec">All clothes</div><p class="note">Hats and glasses come in lots of colors. Try them on at the 🪞 mirror.</p>
    ${HOL.cur==='halloween'?'<p class="note">🎃 Costumes are here for October! Wear one over your clothes at the 🪞 mirror.</p>':''}<div class="grid" style="margin-top:10px">${Object.entries(CLOTHES).filter(([k,c])=>(!c.oct||HOL.cur==='halloween'||owns(k))&&(!c.gift||owns(k))).sort((a,b)=>HOL.cur==='halloween'?(b[1].oct?1:0)-(a[1].oct?1:0):0).map(([k,c])=>{const n=(c.hat||c.gl)?variants(k).length:0,mine=!(c.hat||c.gl)&&owns(k);
      return`<button class="it" data-a="cloth:${k}"><span class="em">${c.i}</span><span>${c.n}</span><span class="pr">${mine?'✔ Yours':c.p+' 🪙'}</span>${n?`<span class="have">You have ${n}</span>`:''}</button>`;}).join('')}</div>`;
  openPanel(`<div class="hd"><h2>👗 Clothes Shop</h2><div class="chip">🪙 <b id="pc">${S.coins}</b></div><button class="btn x" data-a="close" aria-label="Close">✕</button></div>${shutNote('clothes')}${body}`,{onClose:()=>{CLO.sel=null;}});}
const TASKS=[
  {id:'home',t:'Go inside your new house',r:10},{id:'buy',t:'Buy food at the market',r:10},{id:'eat',t:'Eat a snack from your bag',r:5},
  {id:'friend',t:'Make a friend',r:20},{id:'pet',t:'Adopt a pet',r:20},{id:'decor',t:'Decorate your house',r:20},
  {id:'litter',t:'Pick up 5 pieces of litter',r:15},{id:'visit',t:'Invite a friend to your house',r:25},{id:'sleep',t:'Sleep in your bed',r:10}];
function freshState(){return{v:1,t:0,name:'',day:1,time:8,coins:120,hunger:85,bag:{apple:2,cookie:1},
  home:{wall:'#ffd6e0',floor:'wood',items:[{u:'b1',t:'bed',c:'#ff9ec4',x:-4.6,z:-3.85,r:0},{u:'r1',t:'rug',c:'#b79cff',x:0,z:-.5,r:0},{u:'l1',t:'lamp',c:'#ffd45c',x:-2.9,z:-4.5,r:0,on:1}],store:[]},
  pets:[],fr:{},tasks:{},litter:{day:0,got:[]},mail:0,picked:0,intro:false,loc:'city',px:-17,pz:-4.8,yaw:0,look:Object.assign({},DEFAULT_LOOK),q:{day:0,list:[],st:{}},hard:{}};}

/* ---- saving: this device + your claude.ai account ---- */
const LS='cozytown-save-1';
let SAVEOFF=false;   /* 📦 true = this page writes no more saves: a moved-in game (or a new start) is on its way, the reload must not write the old game back */
function readLocal(){try{return JSON.parse(localStorage.getItem(LS));}catch(e){return null;}}
function snap(){let loc=CUR?CUR.id:'city',x=P.x,z=P.z,yaw=P.yaw;
  if(P.sit&&P.sit.bk)[x,z,yaw]=P.sit.bk;   /* in bed: save the spot beside the bed, not the pillow */
  if(CR&&CR.prev){loc=CR.prev.loc;x=CR.prev.x;z=CR.prev.z;yaw=CR.prev.yaw;}
  if(loc==='client'){const hid=S.ds&&((S.ds.o&&S.ds.o.h)||S.ds.prevH),H=hid&&HOUSE(hid);if(H){loc='city';x=H.x+Math.sin(H.ry)*1.7;z=H.z+Math.cos(H.ry)*1.7;yaw=H.ry+Math.PI;}else loc='studio';}
  if(loc==='visit'){const d=laneHostDoor();loc='city';x=d[0];z=d[1];yaw=d[2];}
  if(loc==='studio'||!LOC[loc]||!isFinite(x)||!isFinite(z)){loc='city';x=-17;z=-4.6;yaw=0;}
  {const q=toSave(loc,x,z);S.yq=(q[0]!==x||q[1]!==z)?1:0;if(q[0]!==x&&LANE_PLOTS[LANE.mine].s>0)yaw-=Math.PI;x=q[0];z=q[1];}   /* in your yard: saved as the old town-yard spot (startGame turns it back); yq says so, because the Flower Corner (the same spot in town) can be walked in now (run 4, job 4) */
  S.loc=loc;S.px=x;S.pz=z;S.yaw=yaw;S.t=Date.now();}
function safeSpot(loc){const L=LOC[loc];if(!L||loc==='studio')return null;const b=L.bounds;if(!isFinite(P.x)||!isFinite(P.z)||P.x<b.x1||P.x>b.x2||P.z<b.z1||P.z>b.z2){
  if((L.type==='in'||loc==='beach')&&DOORS[loc]){const d=DOORS[loc].inside;P.x=L.ox+d[0];P.z=L.oz+d[1];P.yaw=d[2];}else{P.x=-17;P.z=-4.6;P.yaw=0;}}return loc;}
/* 🚌 sitting in the bus before it leaves: the fare is only lent. A game saved now (closing the app, an update, 📦 Move my game) starts again
   standing at the bus stop, so it keeps your coins as if you got off */
function saveJSON(){snap();const R=BUS.ride,f=R&&R.fare&&P.sit&&P.sit.bus?R.fare:0;if(!f)return JSON.stringify(S);S.coins+=f;try{return JSON.stringify(S);}finally{S.coins-=f;}}
function saveLocal(){if(!S||!PLAYING||SAVEOFF)return;try{localStorage.setItem(LS,saveJSON());}catch(e){}}
const CSAVE={ref:null,pending:true,remote:null,dirty:false,writing:false,tm:0};
async function cloudInit(){
  try{
    if(!window.claude||typeof window.claude.use!=='function')throw 0;
    const [db,user]=await Promise.all([EARLY.db||window.claude.use('db'),EARLY.user||window.claude.use('user')]);
    if(!db||!user)throw 0;const id=await user.id();if(!id)throw 0;
    CSAVE.ref=db.doc('data/users/'+id+'/save');
    const sn=await CSAVE.ref.get();
    if(sn.exists){const d=sn.data();if(d&&typeof d.json==='string'){try{CSAVE.remote=JSON.parse(d.json);}catch(e){}}}
  }catch(e){}
  CSAVE.pending=false;
}
async function cloudFlush(){
  if(!CSAVE.ref||CSAVE.writing||!CSAVE.dirty||!S||SAVEOFF)return;
  CSAVE.dirty=false;CSAVE.writing=true;const js=saveJSON();
  try{await CSAVE.ref.set({json:js,t:S.t});}
  catch(e){const c=e&&e.code;if(c==='unavailable'){CSAVE.dirty=true;setTimeout(cloudFlush,2500+Math.random()*2000);}else if(c!=='resource_exhausted')CSAVE.ref=null;else{CSAVE.dirty=true;setTimeout(cloudFlush,8000);}}
  CSAVE.writing=false;if(CSAVE.dirty&&CSAVE.ref)setTimeout(cloudFlush,1500);
}
function change(){hardCheck();saveLocal();if(CSAVE.ref){CSAVE.dirty=true;clearTimeout(CSAVE.tm);CSAVE.tm=setTimeout(cloudFlush,4000);}updHud(true);}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){saveLocal();if(CSAVE.dirty)cloudFlush();}});
window.addEventListener('pagehide',()=>{saveLocal();});

/* ---- time ---- */
const KF=[[0,'#0f1538','#2a2c66',.26,.4,'#8b94ff','#3a3560','#a9b8ff'],[5,'#0f1538','#2a2c66',.26,.4,'#8b94ff','#3a3560','#a9b8ff'],[6.5,'#6f8fe0','#ffb38a',.42,.44,'#ffd0b0','#8a7a9a','#ffcf9e'],
  [8,'#4fb4ff','#c4ecff',.56,.58,'#ffffff','#c6d4bb','#fff4e0'],[17,'#4fb4ff','#c4ecff',.56,.58,'#ffffff','#c6d4bb','#fff4e0'],[19,'#7a6fe0','#ffa07a',.45,.44,'#ffc0a0','#8a7a9a','#ffb98a'],
  [20.5,'#1d2356','#463c7d',.28,.4,'#9a98ff','#3a3560','#b0b8ff'],[24,'#0f1538','#2a2c66',.26,.4,'#8b94ff','#3a3560','#a9b8ff']];
const _c1=new THREE.Color(),_c2=new THREE.Color(),SUND=new THREE.Vector3();
function nightF(h){if(h<5||h>=20.5)return 1;if(h<7)return 1-(h-5)/2;if(h>18.5)return(h-18.5)/2;return 0;}
const isNight=()=>S.time>=21.5||S.time<7;
function clockStr(h){const H=Math.floor(h),M=Math.floor((h-H)*6)*10;return H+':'+(M<10?'0':'')+M;}   /* one hour digit before 10:00, like "9:40 Wed" (the owner's 17 Oct list; run 4, after stage 3) */
function updSky(){
  const h=S?S.time:clockNow().time;let i=0;while(i<KF.length-2&&KF[i+1][0]<=h)i++;   /* 🕰️ the title shows the real time of day too (run 4) */
  const a=KF[i],b=KF[i+1],t=clamp((h-a[0])/(b[0]-a[0]),0,1);
  const C=(k)=>_c1.set(a[k]).lerp(_c2.set(b[k]),t);
  skyU.top.value.copy(C(1));skyU.bot.value.copy(C(2));FOG.color.copy(skyU.bot.value);
  const nf=nightF(h),out=!CUR||CUR.type==='out';
  if(CURTAIN){CURTAIN.color.set(nf>.5?'#7d86d6':'#d6f2ff');JET.color.copy(CURTAIN.color);}
  WIN.emissive.set(nf>.5?'#ffc66b':'#5ab4e8');WIN.emissiveIntensity=nf>.5?nf*.9:.22*(1-nf);const shut=!!S&&!isDaytime();SWIN.emissive.copy(WIN.emissive);SWIN.emissiveIntensity=WIN.emissiveIntensity*(shut&&nf>.5?.4:1);if(CLOSED){CLOSED.visible=shut;CLOSED_L.visible=!!S&&!longOpen();}LAMP.emissiveIntensity=nf*1.2;WATER.emissiveIntensity=.3*(1-.85*nf);   /* (water glows less at night, like the grass round it darkens; run 4, stage 3: the pond stayed daytime blue) */
  if(NGLOW){NGLOW.uniforms.op.value=nf;NGLOW.visible=out&&nf>.01;}
  {const so=nf*(1-(out?WX.sky:0));stars.material.opacity=so;stars.visible=out&&so>.01;}   /* (run 4 finish: no stars through a grey rainy sky) */
  PANE.color.copy(skyU.bot.value).lerp(_c2.set('#ffffff'),.25);
  if(out){const hal=HOL.cur==='halloween'?nf:0;if(hal>0){skyU.top.value.lerp(_c2.set('#3b1d5e'),hal*.55);skyU.bot.value.lerp(_c2.set('#5b2a7a'),hal*.5);FOG.color.copy(skyU.bot.value);}FOG.near=lerp(60,34,hal);FOG.far=lerp(340,230,hal);
    const gk=WX.sky;if(gk>0){const G=WX_SKY[WX.kind]||WX_SKY.cloudy;skyU.top.value.lerp(_c2.set(G[0]).lerp(_c1.set('#181b28'),nf),gk);skyU.bot.value.lerp(_c2.set(G[1]).lerp(_c1.set('#2b2f42'),nf),gk);FOG.color.copy(skyU.bot.value);FOG.near*=1-.35*gk;FOG.far*=1-.3*gk;}}   /* 🎃 Halloween nights: a purple sky and closer fog; 🌧️ grey weather: a proper grey sky, never blue under rain (run 4, item 2) */
  {const gk=out?WX.sky:0,U=CLOUD.uniforms;U.top.value.set('#ffffff').lerp(_c2.set('#d3d9e4'),gk).lerp(_c1.set('#9aa1c8'),nf);U.bot.value.set('#dde4f0').lerp(_c2.set('#a9b2c2'),gk).lerp(_c1.set('#5d6489'),nf);}   /* ☁️ clouds: white tops and blue-grey undersides by day, grey in grey weather, gently lit blue-grey at night (run 4, item 18) */
  if(out){
    SHLIFT.value=1;hemi.intensity=lerp(a[4],b[4],t)*(1-.2*WX.grey);hemi.color.copy(C(5));hemi.groundColor.copy(C(6));sun.color.copy(C(7));sun.intensity=lerp(a[3],b[3],t)*(1-.55*WX.grey);
    let u,day=h>=6&&h<=18.5;u=day?(h-6)/12.5:(((h+24-18.5)%24)/11.5);const ang=Math.PI*u;
    SUND.set(Math.cos(ang)*.85,.32+Math.sin(ang)*.9,.45).normalize();lamp.intensity=0;busLamp();
    sun.shadow.normalBias=.09+.25*(1-clamp(Math.abs(SUND.x)/.2,0,1));   /* 🧱 around noon the sun runs almost along the east and west walls, and the shadow map drew pale diagonal streaks on them (the "white smear", run 4, item 17): a bigger normal bias then; the sun is high, so shadows hardly move */
    sunSprite.visible=day&&h>6.2&&h<18.3&&WX.sky<.5;moonSprite.visible=(!day||h<6.4||h>18.2)&&WX.sky<.5;
    const sp=day?sunSprite:moonSprite;sp.position.copy(camera.position).addScaledVector(SUND,320);
    if(day)moonSprite.position.set(camera.position.x-SUND.x*320,camera.position.y+SUND.y*320,camera.position.z-SUND.z*320);
  }else{
    SHLIFT.value=0;hemi.intensity=.52;hemi.color.set('#ffffff');hemi.groundColor.set('#e6d8f0');sun.color.set('#fff3e0');sun.intensity=.4;SUND.set(.25,1,.35).normalize();sun.shadow.normalBias=.2;   /* (indoors the light comes from above: a bigger normal bias keeps the counters' sides free of shadow stripes; run 4, stage 3) */
    lamp.intensity=.35;lamp.position.set(CUR.ox,1.9,CUR.oz+(CUR.fls&&CUR.fls.length>1?UPZ*flOf(CUR,P.z):0));   /* 💡 the room's warm light follows you to the floor you are on (run 4, stage 3: floors 2 to 6 were dimmer than floor 1) */
  }
}
const WDAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
function wdIdx(d){d=d||(S&&S.day)||1;return((d-1)%7+7)%7;}
function wdName(d){return WDAYS[wdIdx(d)];}
function isShowDay(d){return wdIdx(d)===5;}
function showDone(){return!!(S&&S.show&&S.show.day===S.day);}
function daysToShow(){return(5-wdIdx()+7)%7||7;}
function dayLabel(){return(psLeft()?'🏆 ':'')+wdName().slice(0,3);}   /* 🕰️ only the weekday: the day number is never shown (run 4) */
/* ☀️ Daytime: the shops, the library, the designer's clients and the school's classes run 8:00–20:00 (the Pizzeria keeps its own hours).
   Your home, Friends Lane, the flats, the park, the school building and the fire station are always open. */
const DAY_ON=8,DAY_OFF=20,PS_ON=8,PS_OFF=20;
/* 🛒 six shops keep longer hours, 7:00–23:00 (pet update 1): the Market, the Flower Shop, the Clothes Shop, the Toy Store, the Ice Cream Shop and the Food truck */
const LONG_SHOP={market:1,flowers:1,clothes:1,toys:1,icecream:1,truck:1},LONG_ON=7,LONG_OFF=23;
const SHUT={market:['Market','Mr. Bun'],pets:['Pet Shop','Ms. Paws'],flowers:['Flower Shop','Ms. Petal'],cafe:['Café','Mr. Mocha'],clothes:['Clothes Shop','Ms. Stitch'],
  toys:['Toy Store','Mr. Toby'],bakery:['Bakery','Mrs. Crumb'],icecream:['Ice Cream Shop','Mr. Sprinkles'],library:['Library','Ms. Page'],truck:['Food truck','Mr. Patty'],salon:['Hair Salon','Ms. Snippy']};
function isDaytime(){return!!S&&S.time>=DAY_ON&&S.time<DAY_OFF;}
function longOpen(){return!!S&&S.time>=LONG_ON&&S.time<LONG_OFF;}
function shopOpen(id){return!SHUT[id]||(LONG_SHOP[id]?longOpen():isDaytime());}
function opensAt(id){return LONG_SHOP[id]?LONG_ON:DAY_ON;}
function workAt(){return`🌙 Work starts at ${DAY_ON}:00 ☀️`;}
/* a closed shop: the door says so and you stay outside; inside you can still look, but buying waits for the morning */
function shutNote(id){return shopOpen(id)?'':`<p class="note">🌙 <b>Closed now.</b> You can look, but buying starts again at ${opensAt(id)}:00 ☀️</p>`;}
function shutBuy(id){if(shopOpen(id))return false;const s=SHUT[id],K=KEEPERS.find(k=>k.name===s[1]);if(K)K.p.wave=1.2;SFX.no();toast(`🌙 ${s[1]}: “Sorry, we're closed! Come back at ${opensAt(id)}:00 ☀️”`,3.4);return true;}
function shutDoors(){for(const id in SHUT){const t=LOC.city.inter.find(t=>t.label==='Go into the '+SHUT[id][0]);if(!t||t.shut)continue;const a=t.act,ic=t.icon;t.shut=1;
  t.icon=()=>shopOpen(id)?ic:'🌙';t.say=()=>shopOpen(id)?'':`🌙 Closed · opens at ${opensAt(id)}:00`;t.act=()=>{if(shopOpen(id)){a();return;}SFX.no();toast(`🌙 The ${SHUT[id][0]} is closed now. It opens at ${opensAt(id)}:00 ☀️`,3.6);};}}
let DAYW=null,DAYQ=null;
function dayTick(){const d=isDaytime()+':'+longOpen();if(DAYW===null){DAYW=d;shutDoors();return;}if(d!==DAYW){DAYW=d;DAYQ=CUR&&SHUT[CUR.id]&&!shopOpen(CUR.id)?CUR.id:null;}   /* (a shop's own closing time: 20:00, or 23:00 for the long-hours six) */
  if(DAYQ&&(fading||$('toast').classList.contains('show')))return;const q=DAYQ;DAYQ=null;   /* closing time waits for a fade or a message on screen */
  if(q&&CUR&&CUR.id===q&&!shopOpen(q)){const s=SHUT[CUR.id],K=KEEPERS.find(k=>k.name===s[1]);if(K)K.p.wave=1.2;SFX.talk();toast(`🌙 ${s[1]}: “It's closing time! Buying stops now. See you at ${opensAt(q)}:00 ☀️”`,4.2);}}
/* 🏆 the Pet Show is on Saturdays from 8:00 to 20:00, like the shops (a show that already started always finishes) */
function psOpen(){return isShowDay()&&!!S&&S.time>=PS_ON&&S.time<PS_OFF;}
function psLeft(){return isShowDay()&&!showDone()&&!!S&&S.time<PS_OFF;}
function newDay(){spawnLitter();for(const f of FRIEND_ACTORS)f.wake();for(const w of WALKERS)if(w.state==='home')w.init();qNewDay();for(const r of PLOTS)plotRefresh(r);psDay();}

/* ---- Skills: do things to level up ---- */
const SKILLS={garden:{i:'🌱',n:'Gardening',how:'Water flower beds and put plants in your house.'},cook:{i:'🍳',n:'Cooking',how:'Cook sandwiches on your stove.'},
  pets:{i:'🐾',n:'Pet care',how:'Pet, feed and play with your pets.'},friends:{i:'💗',n:'Friendship',how:'Chat with friends and give presents.'},
  clean:{i:'🧹',n:'Cleaning',how:'Pick up litter around town.'},sport:{i:'🏃',n:'Sports',how:'Run, jump, swing and slide.'},
  decor:{i:'🛋️',n:'Decorating',how:'Put furniture in your house. At level 10 you can buy a bigger house!'},music:{i:'🎹',n:'Music',how:'Play the piano.'},read:{i:'📚',n:'Reading',how:'Read books at the library.'}};
const BOOK_FACTS=['Did you know? Octopuses have three hearts! 🐙','Did you know? Bees dance to tell their friends where flowers are! 🐝','Did you know? A group of flamingos is called a flamboyance! 🦩',
  'Did you know? Sloths can hold their breath longer than dolphins! 🦥','Did you know? Bananas are berries, but strawberries are not! 🍌','Did you know? Some cats sleep 16 hours a day! 😺',
  'Did you know? Snails can sleep for 3 years! 🐌','Did you know? The Moon has moonquakes! 🌙','Did you know? Cows have best friends! 🐄','Did you know? Honey never goes bad! 🍯'];
function readBook(){if(CUR&&CUR.id==='library'&&shutBuy('library'))return;SFX.pop();toast('📖 '+pick(BOOK_FACTS),4.6);if(cool('book',3))addXP('read',4);qEvent('read');}
function knock(id){if(id&&dlCarrying()){deliverKnock(id);return;}if(id&&dsGoing(id)){enterClient();return;}SFX.knock();toast(pick(["Knock knock… nobody's home right now.","Knock knock… someone's playing music inside! 🎶","Knock knock… you hear a dog bark hello. 🐶","Knock knock… “Just a minute!” Someone is baking cookies! 🍪"]));}
const MAXLV=50,xpNeed=lv=>10*lv;   /* ⭐ run 4, item 21: every skill goes to 50 (it was 10); the XP rule and the level-up coins are the same, a player at 10 carries on from 10 */
function sk(k){S.skills=S.skills||{};return S.skills[k]||(S.skills[k]={lv:1,xp:0});}
function addXP(k,n){if(!S||!SKILLS[k])return;const s=sk(k);if(s.lv>=MAXLV)return;s.xp+=n;let up=false;
  while(s.lv<MAXLV&&s.xp>=xpNeed(s.lv)){s.xp-=xpNeed(s.lv);s.lv++;up=true;}if(s.lv>=MAXLV)s.xp=0;
  if(up){const r=10*s.lv;S.coins+=r;SFX.yay();setTimeout(()=>toast(SKILLS[k].i+' '+SKILLS[k].n+' level '+s.lv+'! +'+r+' 🪙',3.6),300);floatText('⭐',P.x-Math.sin(P.yaw)*1.4,1.9,P.z-Math.cos(P.yaw)*1.4,{h:.6});change();}}
function bumpLevel(k,n=1,noPay){if(!S||!SKILLS[k])return;const s=sk(k);for(let i=0;i<n&&s.lv<MAXLV;i++){s.lv++;const r=10*s.lv;if(!noPay)S.coins+=r;}
  s.xp=0;if(s.lv>=MAXLV)s.xp=0;SFX.yay();setTimeout(()=>toast(SKILLS[k].i+' '+SKILLS[k].n+' is now level '+s.lv+'! ⭐',3.6),300);
  floatText('⭐',P.x-Math.sin(P.yaw)*1.4,1.9,P.z-Math.cos(P.yaw)*1.4,{h:.6});change();}
const CD={};function cool(k,s){const t=performance.now();if(CD[k]&&t-CD[k]<s*1000)return false;CD[k]=t;return true;}
/* ---- your backyard garden (behind your house on Friends Lane; it is part of your yard, see buildYard) ---- */
const PLOTS=[];let PLANT=null;
function plotStage(st){if(!st||!st.seed)return -1;if(st.g>=1)return 3;if(st.g>=.5)return 2;if(st.g>=.12)return 1;return 0;}
function gardenInit(){S.garden=S.garden||[];   /* (run 4, stage 2 end: the list keeps the length it was saved with; a new pot gets its entry when you first use it, so an old save re-saves unchanged) */
  if(!PLOTS.length){const L=LOC.city,G=YARD.gin;for(const pl of L.plots){const soilM=toon({color:'#7a5236'});const soil=new THREE.Mesh(pl.pot?new THREE.CylinderGeometry(.22,.22,.04,10):new THREE.BoxGeometry(1.6,.05,1.0),soilM);soil.position.set(pl.x,pl.pot?.32:.15,pl.z);soil.receiveShadow=true;G.add(soil);
    const grp=new THREE.Group();grp.position.set(pl.x,pl.pot?.34:.175,pl.z);if(pl.pot)grp.scale.setScalar(.55);G.add(grp);const rec={pl,soil,soilM,grp,key:'',icon:null,iconK:''};   /* 🪴 a pot grows the same crop, smaller */
    rec.target=pl.pot?{x:pl.x,z:pl.z,r:1.5,obj:grp,icon:'🌱',label:()=>plotLabel(rec),act:()=>usePlot(rec)}:{x:pl.x,z:pl.z,r:1.6,rect:{x1:pl.x-.92,z1:pl.z-.62,x2:pl.x+.92,z2:pl.z+.62},obj:grp,icon:'🌱',label:()=>plotLabel(rec),act:()=>usePlot(rec)};L.inter.push(rec.target);yardInt(rec.target);PLOTS.push(rec);}}
  for(const r of PLOTS)plotRefresh(r);}
function plotLabel(rec){const st=S.garden[rec.pl.i]||{};if(!plotOpen(rec.pl.i))return'🔒 Gardening level '+plotGate(rec.pl.i);if(!st.seed)return'Plant seeds';const K=SEEDS[st.seed];if(st.g>=1)return'Pick your '+K.pl;if(st.w!==S.day)return'Water your '+K.pl;return K.n+' growing… '+Math.floor(st.g*100)+'%';}
function buildCrop(g,seed,sg){const o={ol:.012},spots=[[-.5,-.24],[0,-.24],[.5,-.24],[-.5,.24],[0,.24],[.5,.24]],G='#5fbf74',G2='#4fae64';
  if(sg===0){for(const [x,z] of spots)sph(g,.06,'#5a3a24',x,.0,z,{s:[1,.5,1],ws:6,hs:5,ol:false});return;}
  if(sg===1){for(const [x,z] of spots){cone(g,.05,.14,G,x,0,z,{seg:5,...o});}return;}
  if(seed==='pumpkin'){for(const [x,z] of [[-.55,-.2],[.5,.25],[-.2,.3],[.35,-.3]])sph(g,.16,G,x,.05,z,{s:[1,.45,1],ws:10,hs:6,...o});
    if(sg===3){sph(g,.32,'#ff9a3c',0,.24,0,{s:[1.1,.78,1],ws:14,hs:10,ol:.02});for(let k=0;k<6;k++){const a=k/6*Math.PI;box(g,.02,.4,.68,'#e8822a',0,.07,0,{ry:a,ol:false});}cyl(g,.03,.035,.14,G2,0,.45,0,{seg:6,...o});}return;}
  if(seed==='sunflower'){for(const x of[-.5,0,.5]){const h=sg===3?1.0:.55;cyl(g,.025,.025,h,G2,x,0,0,{seg:5,...o});sph(g,.09,G,x+.08,h*.5,0,{s:[1,.4,.6],ws:8,hs:6,...o});
      if(sg===3){const hd=new THREE.Group();hd.position.set(x,h+.05,.03);hd.rotation.x=-.25;g.add(hd);for(let k=0;k<9;k++){const a=k/9*TAU;box(hd,.07,.14,.025,'#ffd45c',Math.cos(a)*.12,Math.sin(a)*.12,0,{rz:a-Math.PI/2,center:true,ol:.01});}cyl(hd,.09,.09,.04,'#8c6137',0,0,.015,{rx:Math.PI/2,center:true,seg:12,ol:.01});}}return;}
  for(const [x,z] of spots){
    if(seed==='carrot'){for(let k=0;k<3;k++)cone(g,.035,sg===3?.3:.2,G,x+(k-1)*.05,0,z,{seg:5,rz:(k-1)*.3,...o});if(sg===3)cone(g,.055,.1,'#ff8a2b',x,-.04,z,{rx:Math.PI,seg:8,...o});}
    else if(seed==='tomato'){sph(g,sg===3?.19:.14,G,x,.15,z,{ws:10,hs:8,...o});if(sg===3)for(const [dx,dy,dz] of [[.12,.2,.08],[-.1,.12,.12],[.05,.3,-.1],[-.12,.25,-.06]])sph(g,.05,'#ff4d4d',x+dx,dy,z+dz,{ws:8,hs:6,ol:.01});}
    else if(seed==='strawberry'){for(let k=0;k<3;k++){const a=k/3*TAU;sph(g,.08,G,x+Math.cos(a)*.07,.03,z+Math.sin(a)*.07,{s:[1,.45,1],ws:8,hs:6,...o});}if(sg===3){sph(g,.045,'#ff4d6d',x+.08,.04,z+.06,{s:[1,1.2,1],ws:8,hs:6,ol:.01});sph(g,.045,'#ff4d6d',x-.07,.04,z-.05,{s:[1,1.2,1],ws:8,hs:6,ol:.01});sph(g,.025,'#ffffff',x,.08,z,{ws:6,hs:5,ol:false});}}
    else if(seed==='tulip'){box(g,.03,.2,.07,G,x-.04,0,z,{rz:.2,...o});box(g,.03,.2,.07,G,x+.04,0,z,{rz:-.2,...o});if(sg===3){cyl(g,.012,.012,.3,G2,x,0,z,{seg:4,ol:false});cone(g,.06,.12,pick(['#ff7aa8','#ffd45c','#ff8a6b','#b79cff']),x,.3,z,{rx:Math.PI,seg:6,ol:.01});}}
  }}
function plotRefresh(rec){const st=S.garden[rec.pl.i]||{};rec.soilM.color.set(st.seed&&st.w===S.day?'#4a3020':'#7a5236');
  const sg=plotStage(st),key=sg+':'+(st.seed||'');
  if(key!==rec.key){rec.key=key;while(rec.grp.children.length){const c=rec.grp.children[0];rec.grp.remove(c);c.traverse(o=>{if(o.geometry)o.geometry.dispose();});}if(sg>=0){buildCrop(rec.grp,st.seed,sg);bake(rec.grp,true);}}   /* one piece per bed (few draw calls: the garden is in view all down Friends Lane) */
  const lk=!plotOpen(rec.pl.i),need=lk?(rec.pl.lock?'🔒 Level '+plotGate(rec.pl.i):''):!st.seed?'':st.g>=1?'✨':st.w!==S.day?'💧':'';   /* 🔒 a row of locked pots says its level on a little plate (run 4, stage 3) */
  if(need!==rec.iconK){rec.iconK=need;if(rec.icon){YARD.gin.remove(rec.icon);rec.icon=null;}if(need){let s;if(lk){s=new THREE.Group();const t=label(need,.24);t.center.set(.5,0);t.position.y=.57;s.add(t);   /* (run 4 finish: held at its bottom edge, so a plate made smaller close up still sits on the stake) */cyl(s,.016,.02,.34,'#a87a52',0,.24,0,{seg:6,ol:false});s.position.set(rec.pl.x,0,rec.pl.z);}else{s=label(need,.34);s.position.set(rec.pl.x,rec.pl.pot?.82:1.0,rec.pl.z);}YARD.gin.add(s);rec.icon=s;}   /* (run 4, stage 3: the lock plate on a little stake in its pot, the 💧 in a small bubble right over the pot: both hung in the air) */}
  rec.target.icon=!plotOpen(rec.pl.i)?'🔒':!st.seed?'🌱':st.g>=1?'🧺':st.w!==S.day?'💧':'🌿';}
function usePlot(rec){const st=S.garden[rec.pl.i]||(S.garden[rec.pl.i]={});
  if(!plotOpen(rec.pl.i)){SFX.no();toast('🔒 This pot opens at gardening level '+plotGate(rec.pl.i)+'. Plant, water and pick to level up! 🌱',3.2);return;}
  if(!st.seed){const have=Object.keys(SEEDS).filter(k=>S.bag['seed_'+k]>0);if(!have.length){SFX.no();toast('You need seeds! Buy some at the seed box by the shed. 🌱',3.2);return;}
    PLANT=rec;openPanel(`<div class="hd"><h2>🌱 Plant seeds</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><p class="note">What do you want to grow?</p><div class="grid" style="margin-top:8px">${have.map(k=>`<button class="it" data-a="plant:${k}"><span class="em">${SEEDS[k].i}</span><span>${SEEDS[k].n}</span><span class="have">×${S.bag['seed_'+k]}</span></button>`).join('')}</div>`);return;}
  if(st.g>=1)return harvest(rec);
  if(st.w!==S.day){st.w=S.day;SFX.splash();const [wx,wz]=yardPt(rec.pl.x,rec.pl.z);for(let i=0;i<4;i++)setTimeout(()=>floatText('💧',wx+rand(-.6,.6),.7,wz+rand(-.3,.3),{h:.4}),i*120);toast('Glug glug! Now your plants can grow. 💧',2.6);addXP('garden',3);qEvent('water');qEvent('waterplot');plotRefresh(rec);change();return;}
  toast(SEEDS[st.seed].i+' Growing… '+Math.floor(st.g*100)+'%. Come back a bit later!',2.6);}
function plantSeed(k){const rec=PLANT;if(!rec||!S.bag['seed_'+k])return;S.bag['seed_'+k]--;S.garden[rec.pl.i]={seed:k,g:0,w:0};PLANT=null;closePanel();SFX.pop();qEvent('plant:'+k);
  toast('You planted '+SEEDS[k].n.toLowerCase()+' seeds! Now give them water. 💧',3);addXP('garden',2);qEvent('plant');plotRefresh(rec);change();}
function harvest(rec){const st=S.garden[rec.pl.i],K=SEEDS[st.seed];qEvent('harvest:'+st.seed);
  if(K.furn){S.home.store.push({u:uid(),t:K.furn,c:FURN[K.furn].cols?pick(FURN[K.furn].cols):null,x:0,z:0,r:0});toast(K.i+' You picked '+K.pl+'! A pot of them is waiting in 📦 My stuff at home.',3.6);}
  else{const [id,n]=K.yield;S.bag[id]=(S.bag[id]||0)+n;toast('🧺 You picked '+(n>1?n+' '+K.pl:'a '+K.pl)+'! '+K.i+' They\'re in your bag.',3.4);}
  S.garden[rec.pl.i]={};SFX.yay();const [wx,wz]=yardPt(rec.pl.x,rec.pl.z);floatText(K.i,wx,1.1,wz,{h:.6});addXP('garden',5);qEvent('harvest');plotRefresh(rec);change();}
function updGarden(dt){if(!S||!S.garden||!PLOTS.length)return;for(const rec of PLOTS){const st=S.garden[rec.pl.i];if(!st||!st.seed||st.g>=1||st.w!==S.day)continue;
  const before=plotStage(st);st.g=Math.min(1,st.g+dt/HOUR/SEEDS[st.seed].h);
  if(st.g>=1){toast('🧺 Your '+SEEDS[st.seed].rd+' ready to pick!',3.4);SFX.yay();change();}
  if(plotStage(st)!==before)plotRefresh(rec);}}
function waterBed(b){S.water=S.water||{};if(S.water[b.id]===S.day){toast('These flowers already had water today. 🌼');return;}S.water[b.id]=S.day;SFX.splash();
  for(let i=0;i<4;i++)setTimeout(()=>floatText('💧',b.x+rand(-.6,.6),.8,b.z+rand(-.3,.3),{h:.42}),i*130);toast('The flowers look so happy! 🌸',2.4);addXP('garden',5);qEvent('water');change();}

/* ---- Quest app: sign up, do it, get money ---- */
const QUESTS={
  litter:{i:'🧹',t:'Town cleaner',d:'Pick up 5 pieces of litter',n:5,r:30},
  market:{i:'🍎',t:'Shopping trip',d:'Buy 3 things at the Market',n:3,r:20},
  cafe:{i:'☕',t:'Café time',d:'Buy something at the Café',n:1,r:15},
  flower:{i:'🌷',t:'Flower power',d:'Buy something at the Flower Shop',n:1,r:40},
  chat:{i:'💬',t:'Chatterbox',d:'Chat with 3 different friends',n:3,r:25},
  gift:{i:'🎁',t:'Gift giver',d:'Give a present to a friend',n:1,r:20},
  pet:{i:'🐾',t:'Pet lover',d:'Pet, feed or play with your pet 3 times',n:3,r:20,need:()=>S.pets.length>0},
  decor:{i:'🛋️',t:'Home makeover',d:'Put 2 things in your house',n:2,r:30},
  jump:{i:'🦘',t:'Bouncy',d:'Jump 20 times',n:20,r:10},
  run:{i:'🏃',t:'Speedy',d:'Run 300 meters',n:300,r:15},
  wish:{i:'✨',t:'Wish maker',d:'Make a wish at the fountain',n:1,r:10},
  mail:{i:'📬',t:'Mail time',d:'Check your mailbox',n:1,r:10},
  eat:{i:'🍕',t:'Snack time',d:'Eat 2 snacks',n:2,r:10},
  hang:{i:'🤝',t:'Best buddies',d:'Hang out with a friend',n:1,r:20},
  visit:{i:'🏠',t:'Guest time',d:'Invite a friend to your house',n:1,r:25},
  feed:{i:'🦴',t:'Dinner time',d:'Feed your pet',n:1,r:10,need:()=>S.pets.length>0},
  cook:{i:'🍳',t:'Kitchen helper',d:'Cook something on your stove',n:1,r:20},
  clothes:{i:'👗',t:'New look',d:'Buy something at the clothing store',n:1,r:40},
  ducks:{i:'🦆',t:'Duck friends',d:'Feed the ducks at a pond',n:1,r:12},
  mproom:{i:'👫',t:'Play together',d:'Send a message to a friend who is online',n:1,r:15,need:()=>MP.peers.size>0},
  goal:{i:'⚽',t:'Goal!',d:'Score a goal on the sports field',n:1,r:15},
  read:{i:'📚',t:'Bookworm',d:'Read 2 books at the library',n:2,r:15},
  chef3:{i:'👩‍🍳',t:'Chef',d:'Cook 3 recipes on your stove',n:3,r:25,ev:'cook'},
  petstyle:{i:'🎀',t:'Pet fashion show',d:'Make your pet look fabulous!',r:40,need:()=>S.pets.length>0,steps:[{d:'Buy a pet outfit at the pet shop',ev:'buyacc',n:1},{d:'Dress up your pet',ev:'dress',n:1},{d:'Play with your pet',ev:'play',n:1}]},
  explorer:{i:'🗺️',t:'Explorer',d:'See the new parts of town!',r:40,steps:[{d:'Visit the school',ev:'school',n:1},{d:'Say hi at the fire station',ev:'fire',n:1},{d:'Score a goal on the sports field',ev:'goal',n:1}]},
  water:{i:'💧',t:'Little gardener',d:'Water 3 flower beds or garden plots',n:3,r:15},
  plant:{i:'🌱',t:'Little farmer',d:'Plant seeds in your garden',n:2,r:15},
  harvest:{i:'🧺',t:'Harvest time',d:'Pick something from your garden',n:1,r:20},
  farm:{i:'🥕',t:'Garden to table',d:'Grow your own food!',r:50,steps:[{d:'Buy seeds at the seed box',ev:'buy:seed',n:1},{d:'Plant the seeds',ev:'plant',n:1},{d:'Water your garden',ev:'waterplot',n:1},{d:'Pick what you grew',ev:'harvest',n:1}]},
  swing:{i:'🎠',t:'Swing time',d:'Go on the swings',n:1,r:10},
  slide:{i:'🛝',t:'Slide champion',d:'Go down the slide 3 times',n:3,r:15},
  parkday:{i:'🎡',t:'Park day',d:'Have fun at the park!',r:35,steps:[{d:'Go on the swings',ev:'swing',n:1},{d:'Go down the slide',ev:'slide',n:1},{d:'Make a wish at the fountain',ev:'wish',n:1}]},
  party:{i:'🎂',t:'Party time',d:'Throw a little party!',r:50,steps:[{d:'Buy a cake',ev:'buy:cake',n:1},{d:'Invite a friend to your house',ev:'visit',n:1},{d:'Give a present to a friend',ev:'gift',n:1}]},
  chef:{i:'🥪',t:'Little chef',d:'Make a yummy sandwich.',r:45,steps:[{d:'Buy bread at the Market',ev:'buy:bread',n:1},{d:'Buy cheese at the Market',ev:'buy:cheese',n:1},{d:'Cook a sandwich on your stove',ev:'cook',n:1}]},
  spa:{i:'🛁',t:'Pet spa day',d:'Spoil your pet!',r:45,need:()=>S.pets.length>0,steps:[{d:'Buy pet food or cat food',ev:'buy:food',n:1},{d:'Feed your pet',ev:'feed',n:1},{d:'Play ball with your pet',ev:'play',n:1}]},
  garden:{i:'🌷',t:'Flower house',d:'Make your house bloom.',r:80,steps:[{d:'Buy 2 things at the Flower Shop',ev:'flower',n:2},{d:'Put 2 flowers or plants in your house',ev:'placeflower',n:2}]},
  cafedate:{i:'☕',t:'Café friends',d:'Take a friend out for a treat.',r:50,steps:[{d:'Hang out with a friend',ev:'hang',n:1},{d:'Take your friend to the Café',ev:'cafevisit',n:1},{d:'Sit down at a Café table',ev:'cafesit',n:1}]},
  treat:{i:'🍩',t:'Clean & treat',d:'Work hard, then get a treat.',r:40,steps:[{d:'Pick up 5 pieces of litter',ev:'litter',n:5},{d:'Buy a donut at the Café',ev:'buy:donut',n:1},{d:'Eat the donut',ev:'eat:donut',n:1}]},
  lucky:{i:'💌',t:'Lucky day',d:'A day full of surprises.',r:35,steps:[{d:'Check your mailbox',ev:'mail',n:1},{d:'Make a wish at the fountain',ev:'wish',n:1},{d:'Buy a cookie at the Café',ev:'buy:cookie',n:1}]},
  parkfun:{i:'🌳',t:'Park fun',d:'Play like a champion.',r:35,steps:[{d:'Run 200 meters',ev:'run',n:200},{d:'Jump 10 times',ev:'jump',n:10},{d:'Chat with a friend',ev:'chat',n:1}]},
};
const FLOWER_TYPES=['flowers','tulips','rosebush','sunflower','plant','cactus'];
const HARD={
  bff:{i:'💗',t:'Best friends',d:'Make a friend and get 3 hearts',n:3,r:100,prog:()=>Math.max(0,...FRIENDS.map(f=>heartsOf(f.id))),
    tiers:[{d:'Get 5 hearts with a friend',n:5,r:150},{d:'Get 3 hearts with 2 friends',n:2,r:150,prog:()=>FRIENDS.filter(f=>heartsOf(f.id)>=3).length},
      {d:'Get 3 hearts with 4 friends',n:4,r:200,prog:()=>FRIENDS.filter(f=>heartsOf(f.id)>=3).length},{d:'Get 5 hearts with 4 friends',n:4,r:300,prog:()=>FRIENDS.filter(f=>heartsOf(f.id)>=5).length}]},
  everyone:{i:'👫',t:"Everybody's friend",d:'Meet all 4 kids in town',n:4,r:60,prog:()=>FRIENDS.filter(f=>frSt(f.id).met).length},
  home10:{i:'🏡',t:'Dream home',d:'Have 10 things in your house',dn:'Have {n} things in your house',n:10,r:80,grow:1.6,prog:()=>S.home.items.length},
  happypet:{i:'🐾',t:'Happiest pet',d:'Make a pet super happy (5 hearts)',n:5,r:60,prog:()=>Math.max(0,...S.pets.map(d=>clamp(Math.round(d.happy/20),0,5))),
    tiers:[2,3,4,5].map(n=>({d:`Make ${n} pets super happy at the same time`,n,r:60+n*20,prog:()=>S.pets.filter(d=>clamp(Math.round(d.happy/20),0,5)>=5).length}))},
  petfamily:{i:'🐶',t:'Pet family',d:'Adopt 3 pets',dn:'Adopt {n} pets',n:3,r:120,grow:1.6,prog:()=>S.pets.length},
  clean:{i:'🧹',t:'Super cleaner',d:'Pick up 30 pieces of litter',dn:'Pick up {n} pieces of litter',n:30,r:80,ev:'litter',grow:1.6},
  gifts:{i:'🎁',t:'Super giver',d:'Give 5 presents',dn:'Give {n} presents',n:5,r:60,ev:'gift',grow:1.6},
  jumper:{i:'🦘',t:'Mega jumper',d:'Jump 100 times',dn:'Jump {n} times',n:100,r:40,ev:'jump',grow:1.6},
  marathon:{i:'🏃',t:'Marathon',d:'Run 2000 meters',dn:'Run {n} meters',n:2000,r:60,ev:'run',grow:1.6},
  masterchef:{i:'👑',t:'Master chef',d:'Cook every recipe once',n:RECIPES.length,r:150,prog:()=>Object.keys(S.cooked||{}).length},
  striker:{i:'🥅',t:'Star striker',d:'Score 10 goals',dn:'Score {n} goals',n:10,r:60,ev:'goal',grow:1.6},
  farmer:{i:'🚜',t:'Super farmer',d:'Harvest your garden 10 times',dn:'Harvest your garden {n} times',n:10,r:100,ev:'harvest',grow:1.6},
  gardener:{i:'🌻',t:'Master gardener',d:'Reach level 5 in Gardening',n:5,r:100,prog:()=>sk('garden').lv,tiers:[{d:'Reach level 8 in Gardening',n:8,r:150},{d:'Reach MAX level in Gardening',n:MAXLV,r:200}]},
  skillstar:{i:'⭐',t:'Skill star',d:'Get any skill to level 8',n:8,r:150,prog:()=>Math.max(...Object.keys(SKILLS).map(k=>sk(k).lv)),
    tiers:[{d:'Get 2 skills to level 8',n:2,r:200,prog:()=>Object.keys(SKILLS).filter(k=>sk(k).lv>=8).length},{d:'Get a skill to MAX level',n:MAXLV,r:200},
      {d:'Get 3 skills to MAX level',n:3,r:300,prog:()=>Object.keys(SKILLS).filter(k=>sk(k).lv>=MAXLV).length},{d:'Get every skill to MAX level',n:Object.keys(SKILLS).length,r:500,prog:()=>Object.keys(SKILLS).filter(k=>sk(k).lv>=MAXLV).length}]},
  claw:{i:'🕹️',t:'Claw champion',d:'Win 3 prizes from the claw machine',dn:'Win {n} prizes from the claw machine',n:3,r:50,ev:'claw',grow:1.7},
  showwin:{i:'🏆',t:'Pet Show star',d:'Win the Pet Show',dn:'Win the Pet Show {n} times',n:1,r:150,ev:'showwin',grow:2},
  teach:{i:'📚',t:'Super teacher',d:'Teach 3 classes',dn:'Teach {n} classes',n:3,r:100,ev:'teach',grow:1.7},
  rooms:{i:'🎨',t:'Star designer',d:'Decorate 5 rooms for clients',dn:'Decorate {n} rooms for clients',n:5,r:120,ev:'room',grow:1.6},
  deliver:{i:'🍕',t:'Pizza hero',d:'Deliver 10 pizzas',dn:'Deliver {n} pizzas',n:10,r:100,ev:'deliver',grow:1.6},
};
/* hard challenges never run out: finish one and a harder one (II, III, …) pops up */
const ROMAN=['','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
const hardLv=k=>(S&&S.hard&&S.hard[k]&&S.hard[k].lv)|0;
function niceN(v){const m=v<20?1:v<100?5:v<1000?10:v<5000?50:100;return Math.max(1,Math.round(v/m)*m);}
function hq(k,lv){const H=HARD[k];if(!H)return null;if(lv===undefined)lv=hardLv(k);if(!lv)return H;const nm=H.t+' '+(ROMAN[lv]||lv+1);
  if(H.tiers){const T=H.tiers[lv-1];return T?Object.assign({},H,T,{t:nm}):null;}
  if(!H.grow)return null;const n=niceN(H.n*Math.pow(H.grow,lv));return Object.assign({},H,{t:nm,n,r:Math.round(H.r*(1+.35*lv)/5)*5,d:H.dn.replace('{n}',n.toLocaleString('en-US'))});}
function hardMigrate(){if(!S||!S.hard)return;for(const k in S.hard){const st=S.hard[k];if(!HARD[k]||!st){delete S.hard[k];continue;}if(st.s==='done'){const lv=(st.lv|0)+1;if(hq(k,lv))S.hard[k]={s:'on',n:0,lv};}}}
function hardDone(H){SFX.yay();toast('🔥 Hard challenge done: '+H.t+'! Open your phone to get '+H.r+' 🪙',4.5);updPhoneBadge();}
function hardEvent(type,amt){if(!S||!S.hard)return;for(const k in HARD){const st=S.hard[k];if(!st||st.s!=='on')continue;const H=hq(k);if(!H||H.ev!==type)continue;st.n=Math.min(H.n,(st.n||0)+amt);if(st.n>=H.n){st.s='ready';hardDone(H);change();}}}
function hardCheck(){if(!S||!S.hard)return;let hit=false;for(const k in HARD){const st=S.hard[k];if(!st||st.s!=='on')continue;const H=hq(k);if(!H||!H.prog)continue;st.n=Math.min(H.n,H.prog());if(st.n>=H.n){st.s='ready';hit=true;hardDone(H);}}
  if(hit){saveLocal();if(CSAVE.ref){CSAVE.dirty=true;clearTimeout(CSAVE.tm);CSAVE.tm=setTimeout(cloudFlush,4000);}if(PH.app==='quest'&&!$('panel').hidden)renderPhone();}}
const QCACHE={};
const SOME=new Set(['flour','milk','cheese','honey','popcorn','candy','chocolate','tea','eggs','grapes','cherries','bread','corn','pet food','cat food','bunny & hamster food','pet treats','pancakes','hot cocoa','lemonade','pumpkin soup','fruit salad','garden salad','flowers','herb pots','building blocks','candles','drawers']);   /* (the furniture names that are many things: "Put some herb pots in your house", not "a herb pots"; run 4, stage 3) */
const PAIR=new Set(['fairy wings','bunny ears','cat ears','headphones','glasses','sunglasses','heart glasses','pet sunglasses']);   /* (run 4 finish: "Buy a fairy wings" read wrong) */
['fries','noodles','dumplings','chocolate cookies','hot chocolate'].forEach(n=>SOME.add(n));   /* (run 4 finish: the recipes cooked in a quest: "Cook some chocolate cookies") */
const aAn=n=>{const l=n.toLowerCase();return(PAIR.has(l)?'a pair of ':SOME.has(l)?'some ':/^[aeiou]/.test(l)?'an ':'a ')+l;};
const onePl=K=>K.pl==='pumpkin'?'a pumpkin':K.pl;
function shopOf(id){for(const k in SHOPS){const s=SHOPS[k];if((s.items||[]).includes(id)||(s.furn||[]).includes(id))return s.title;}return'shop';}
function getQ(k){return QUESTS[k]||(k in QCACHE?QCACHE[k]:(QCACHE[k]=genQuest(k)));}
function genQuest(k){try{const p=k.split(':'),kind=p[0],a=p[1];
  if(kind==='buy'){const it=itemInfo(a)||FURN[a];return it?{i:it.i,t:'Shopping trip',d:'Buy '+aAn(it.n)+' at the '+shopOf(a),n:1,r:8+Math.min(14,Math.round((it.p||4)/3)),ev:k}:null;}
  if(kind==='eat'){const it=FOODS[a];return it?{i:it.i,t:'Snack time',d:'Eat '+aAn(it.n),n:1,r:10,ev:k}:null;}
  if(kind==='cook'){const R=RECIPES.find(x=>x.id===a);if(!R)return null;const I=recipeInfo(R);return{i:I.i,t:'Chef time',d:'Cook '+aAn(I.n)+' on your stove',n:1,r:22,ev:k};}
  if(kind==='chat'){const f=FRIENDS.find(x=>x.id===a);return f?{i:'💬',t:'Say hello',d:'Chat with '+f.name,n:1,r:10,ev:k}:null;}
  if(kind==='gift'){const f=FRIENDS.find(x=>x.id===a);return f?{i:'🎁',t:'Surprise!',d:'Give '+f.name+' a present',n:1,r:20,ev:k}:null;}
  if(kind==='find'){const pl=PLACES.find(x=>x.id===a);return pl?{i:pl.i,t:'Explorer',d:'Find '+theN(pl)+' with your 🗺️ map',n:1,r:12,ev:k}:null;}
  if(kind==='enter'){const n={salon:'Hair Salon',market:'Market',cafe:'Café',pets:'Pet Shop',flowers:'Flower Shop',clothes:'Clothes Shop',toys:'Toy Store',bakery:'Bakery',icecream:'Ice Cream Shop',library:'Library',school:'School',fire:'Fire Station'}[a];return n?{i:'🚪',t:'Pop in',d:'Go into the '+n,n:1,r:8,ev:k}:null;}
  if(kind==='place'){const F=FURN[a];return F?{i:F.i,t:'Decorator',d:'Put '+aAn(F.n)+' in your house',n:1,r:10+Math.min(30,Math.round(F.p/20)),ev:k}:null;}
  if(kind==='plant'){const K=SEEDS[a];return K?{i:'🌱',t:'Seed time',d:'Plant '+K.n.toLowerCase()+' seeds in your garden',n:1,r:12,ev:k}:null;}
  if(kind==='harvest'){const K=SEEDS[a];return K?{i:K.i,t:'Harvest',d:'Pick '+onePl(K)+' from your garden',n:1,r:25,ev:k}:null;}
  if(kind==='wear'){const C=CLOTHES[a];return C?{i:C.i,t:'Fashion show',d:'Wear your '+C.n.toLowerCase(),n:1,r:12,ev:k,need:()=>owns(a)}:null;}
  if(kind==='hi')return{i:'👋',t:'Friendly face',d:'Say hi to '+a+' people in town',n:+a,r:8+(+a)*3,ev:'hi'};
  if(kind==='trk'){const sub=p[1],arg=p[2];
    if(sub==='recipe'){const R=RECIPES.find(x=>x.id===arg),I=recipeInfo(R);return{i:I.i,t:'Little chef: '+I.n,d:'Shop for it, then cook it!',r:40,steps:Object.keys(R.need).map(it=>({d:'Buy '+aAn(itemInfo(it).n),ev:'buy:'+it,n:1})).concat([{d:'Cook '+aAn(I.n),ev:'cook:'+arg,n:1}])};}
    if(sub==='friend'){const f=FRIENDS.find(x=>x.id===arg);return{i:'💗',t:'A day with '+f.name,d:'Be a super friend!',r:45,steps:[{d:'Chat with '+f.name,ev:'chat:'+arg,n:1},{d:'Give '+f.name+' a present',ev:'gift:'+arg,n:1},{d:'Hang out with '+f.name,ev:'hang:'+arg,n:1}]};}
    if(sub==='grow'){const K=SEEDS[arg];return{i:K.i,t:'Grow '+onePl(K),d:'From a seed to a harvest!',r:50,steps:[{d:'Buy '+K.n.toLowerCase()+' seeds',ev:'buy:seed_'+arg,n:1},{d:'Plant them',ev:'plant:'+arg,n:1},{d:'Water your garden',ev:'waterplot',n:1},{d:'Pick your '+K.pl,ev:'harvest:'+arg,n:1}]};}
    if(sub==='tour'){const ids=arg.split('|');return{i:'🗺️',t:'Town tour',d:'Visit 3 places with your map',r:40,steps:ids.map(id=>{const pl=PLACES.find(x=>x.id===id);return{d:'Find '+theN(pl)+' '+pl.i,ev:'find:'+id,n:1};})};}
    if(sub==='spree'){const ids=arg.split('|');return{i:'🛍️',t:'Shopping spree',d:'Buy 3 different treats',r:35,steps:ids.map(id=>{const it=itemInfo(id);return{d:'Buy '+aAn(it.n)+' '+it.i+' at the '+shopOf(id),ev:'buy:'+id,n:1};})};}}
  return null;}catch(e){return null;}}
/* 🪙 a quest never costs much more than it pays: "Buy a …" only for everyday things (20 🪙 or less: food, pet food and toys), "Put a … in your
   house" only for furniture already waiting in 📦 My stuff. old = the way it was before (a saved game's first day after loading keeps exactly the
   quests the older version gave it) */
const RAWF=['flour','eggs'];   /* 🥚 for cooking, not for snacking (run 4 finish: "Snack time: Eat some flour") */
const qCheap=k=>{const p=k.split(':'),a=p[1];if(p[0]==='eat'&&RAWF.includes(a)||p[0]==='trk'&&a==='spree'&&(p[2]||'').split('|').some(x=>RAWF.includes(x)))return false;if(p[0]==='buy'){const it=itemInfo(a)||FURN[a];return!!it&&(it.p||0)<=20;}
  if(p[0]==='place')return!!S&&!!S.home&&(S.home.store||[]).some(it=>furnOf(it)===a);return true;};
function questCandidates(r,old){const ok=k=>{const Q=getQ(k);return !!Q&&(!Q.need||Q.need())&&(old||qCheap(k));};
  const foods=[...new Set([...SHOPS.market.items,...SHOPS.cafe.items,...SHOPS.bakery.items,...SHOPS.icecream.items,...SHOPS.truck.items])];
  const simple=[...Object.keys(QUESTS).filter(k=>!QUESTS[k].steps),...foods.map(f=>'buy:'+f),...foods.map(f=>'eat:'+f),...RECIPES.map(x=>'cook:'+x.id),
    ...FRIENDS.map(f=>'chat:'+f.id),...FRIENDS.map(f=>'gift:'+f.id),...PLACES.filter(pl=>!pl.nq).map(pl=>'find:'+pl.id),...['market','cafe','pets','flowers','clothes','toys','bakery','icecream','library','school','fire'].map(x=>'enter:'+x),
    ...BUY_FURN.filter(t=>t!=='shellshelf').map(t=>'place:'+t),...Object.keys(SEEDS).map(s=>'plant:'+s),...Object.keys(SEEDS).map(s=>'harvest:'+s),...SHOPS.toys.furn.map(t=>'buy:'+t),
    ...SHOPS.pets.items.map(t=>'buy:'+t),...Object.keys(CLOTHES).map(c=>'wear:'+c),'hi:3','hi:5'].filter(ok);
  const tricky=[...Object.keys(QUESTS).filter(k=>QUESTS[k].steps),...['sandwich','friedegg','pancakes','cookies','hotchoc','lemonade'].map(x=>'trk:recipe:'+x),
    ...FRIENDS.map(f=>'trk:friend:'+f.id),...Object.keys(SEEDS).map(s=>'trk:grow:'+s)];
  const pl=PLACES.filter(q=>!q.nq).map(q=>q.id),pk=a=>a[Math.floor(r()*a.length)];
  for(let i=0;i<8;i++){const a=[];while(a.length<3){const id=pk(pl);if(!a.includes(id))a.push(id);}tricky.push('trk:tour:'+a.join('|'));}
  for(let i=0;i<6;i++){const sh=['market','cafe','bakery','icecream'].sort(()=>r()-.5).slice(0,3);tricky.push('trk:spree:'+sh.map(s=>pk(SHOPS[s].items)).join('|'));}
  return{simple,tricky:tricky.filter(ok)};}
function qHist(keys){S.qhist=(S.qhist||[]).concat(keys).slice(-260);}
function qNewDay(old){let paid=0;if(S.q&&S.q.st)for(const k in S.q.st){const Q=getQ(k);if(S.q.st[k].s==='ready'&&Q)paid+=Q.r;}
  const r=seeded(S.day*97+13),hist=new Set(S.qhist||[]),C=questCandidates(r,old);
  const sh=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const fresh=a=>{const f=a.filter(k=>!hist.has(k));return f.length>=3?f:a;};
  const simple=sh(fresh(C.simple)),multi=sh(fresh(C.tricky));
  const list=[multi[0],simple[0],simple[1],multi[1],simple[2]].filter(Boolean);
  S.q={day:S.day,list,st:{},used:list.slice()};qHist(list);if(paid){S.coins+=paid;setTimeout(()=>toast('📱 You got '+paid+' 🪙 from yesterday\'s quests!',4),4300);}updPhoneBadge();}
function qReady(Q,st){st.s='ready';SFX.yay();toast('📱 Quest done: '+Q.t+'! Open your phone to get '+Q.r+' 🪙',4);updPhoneBadge();change();}
function qEvent(type,amt=1,key){hardEvent(type,amt);if(!S||!S.q)return;let dirty=false;
  for(const k of S.q.list){const Q=getQ(k),st=S.q.st[k];if(!Q||!st||st.s!=='on')continue;
    if(Q.steps){st.c=st.c||[];Q.steps.forEach((sp,i)=>{if(sp.ev!==type)return;const cur=st.c[i]||0;if(cur>=sp.n)return;st.c[i]=Math.min(sp.n,cur+amt);dirty=true;});
      if(Q.steps.every((sp,i)=>(st.c[i]||0)>=sp.n))qReady(Q,st);}
    else if((Q.ev||k)===type){if(key){st.seen=st.seen||[];if(st.seen.includes(key))continue;st.seen.push(key);}st.n=Math.min(Q.n,(st.n||0)+amt);dirty=true;if(st.n>=Q.n)qReady(Q,st);}}
  if(dirty){if(type!=='run')change();if(PH.app==='quest'&&!$('panel').hidden)renderPhone();}}
function readyCount(){if(!S)return 0;return(S.q?Object.values(S.q.st).filter(s=>s.s==='ready').length:0)+(S.hard?Object.values(S.hard).filter(s=>s.s==='ready').length:0);}
function updPhoneBadge(){const n=readyCount()+msgUnread();const b=$('phBadge');b.hidden=!n;b.textContent=n;}

/* ---- tasks ---- */
function doneTask(id){return;if(!S||S.tasks[id])return;const T=TASKS.find(t=>t.id===id);if(!T)return;S.tasks[id]=1;S.coins+=T.r;SFX.yay();toast('✅ '+T.t+'  +'+T.r+' 🪙',3.2);change();}
function renderTasks(){const el=$('tasks');el.hidden=true;return;const left=TASKS.filter(t=>!S.tasks[t.id]);
  if(!left.length){el.innerHTML='<h3>🎉 All done! Keep having fun</h3>';return;}
  el.innerHTML='<h3>To do</h3><ul>'+left.slice(0,3).map(t=>`<li>${esc(t.t)}</li>`).join('')+'</ul>';}

/* ---- friends ---- */
const FRIENDS=[
  {id:'rosie',name:'Rosie',look:{skin:'#ffd9bd',hair:'#e8734a',style:'pigtails',top:'#ff9ec4',bottom:'#6f7dff',shoes:'#ffffff',dress:true,scale:.95},fav:'cake',home:33,
    hello:"Hi! You must be new here! I'm Rosie.",
    lines:["Do you like cake? I LOVE cake. Strawberry is the best!","The fountain in the park sparkles at night. So pretty!","I'm learning to ride my bike. I only fell twice today!","Your house on Friends Lane is so cute! I love it.","Have you met Theo? He knows everything about dinosaurs."]},
  {id:'theo',name:'Theo',look:{skin:'#c98d63',hair:'#2e2347',style:'short',top:'#5fd4b0',bottom:'#3f4c86',shoes:'#ff7aa8',scale:.97},fav:'pizza',home:31,
    hello:"Oh, hey! I'm Theo. Did you know some dinosaurs had feathers?",
    lines:["Pizza is the best food. Extra cheese!","I'm building a robot at home. It can almost wave!","A T. rex had teeth as big as bananas!","The pet shop has a puppy that does a little spin!","Let's race to the fountain sometime!"]},
  {id:'luna',name:'Luna',look:{skin:'#f6d3bb',hair:'#f2d16b',style:'long',top:'#b79cff',bottom:'#ffffff',shoes:'#b79cff',dress:true,scale:.95},fav:'icecream',home:27,
    hello:"Hi! My name's Luna!",greet:"Hi! My name's Luna!",only:true,giftAsk:"A present for me?!",
    lines:["I LOVE ICE CREAM AND DRAWING! Hmm, I wonder which is better...","I drew a cat eating ice cream. Best. Drawing. EVER!","Strawberry or chocolate? I pick BOTH!","I want to draw every house in town. Yours is next!"]},
  {id:'finn',name:'Finn',look:{skin:'#8a5a3c',hair:'#1f1a2e',style:'curly',top:'#ffd45c',bottom:'#5b8cff',shoes:'#2e2347',scale:.98},fav:'apple',home:29,
    hello:"Hi!",greet:"Hi!",only:true,giftAsk:"A present for me?!",
    lines:["I'm gonna be a firefighter when I grow up!","Firefighters need energy. That's why I eat apples!","When I'm a firefighter, I'll rescue cats from trees!","I run every day. Firefighters have to be fast!"]},
];
function frSt(id){return S.fr[id]||(S.fr[id]={pts:0,met:0,chat:0,gift:0,visit:0});}
const heartsOf=id=>Math.min(5,Math.floor(frSt(id).pts/10));
function addPts(f,n){const st=frSt(f.d.id),before=Math.floor(st.pts/10);st.pts=Math.min(50,st.pts+n);const after=Math.floor(st.pts/10);
  if(after>before){floatText('💗',f.x,2.1,f.z,{h:.6});if(after>=1)doneTask('friend');}change();}
class Friend{
  constructor(d){this.d=d;this.p=bakePerson(makePerson(d.look));this.g=this.p.root;scene.add(this.g);const tg=label(d.name,.3);tg.position.y=1.95*(d.look.scale||1);this.g.add(tg);this.tag=tg;
    this.x=WP[d.home][0];this.z=WP[d.home][1];this.node=d.home;this.prev=-1;this.wait=rand(0,3);this.face=0;this.mode='walk';this.loc='city';this.moving=false;this.r=.3;
    this.target={x:0,z:0,r:2.4,icon:'💬',label:()=>'Talk to '+d.name,act:()=>openFriend(this),obj:this.g};this.wakeT=rand(7.1,8.0);this.sleepT=rand(20.2,21.2);}
  awake(){const h=S?S.time:13;return h>=this.wakeT&&h<this.sleepT;}
  wake(){if(this.mode==='follow'||this.mode==='talk')return;this.rt=null;if(this.awake()){this.mode='walk';this.loc='city';this.node=this.d.home;this.x=WP[this.node][0];this.z=WP[this.node][1];this.prev=-1;this.wait=rand(0,4);}else this.mode='away';}
  update(dt,idx){
    const aw=this.awake();
    if(!aw&&this.mode==='walk')this.mode='going';
    if(!aw&&this.mode==='follow'){toast(this.d.name+' has to go home now. See you tomorrow! 👋',3.4);if(this.loc==='city'){this.mode='going';this.node=nearestNode(this.x,this.z);this.prev=-1;}else this.mode='away';}
    if(aw&&this.mode==='away')this.wake();
    if(this.mode==='away'){this.g.visible=false;return;}
    if(this.mode==='talk'){this.moving=false;this.face=Math.atan2(P.x-this.x,P.z-this.z);}
    else if(this.mode==='follow'){this.rt=null;followStep(this,dt,idx);}
    else{
      if(!this.rt&&this.x<-84.2&&this.loc==='city'){this.rt=laneOut(this.x,this.z);const e=this.rt[this.rt.length-1];this.node=nearestNode(e[0],e[1]);this.prev=-1;}   /* 🏡 leaving Friends Lane: by the gate and the pavement */
      if(this.wait>0){this.wait-=dt;this.moving=false;}
      else{const R=this.rt,n=R?R[0]:WP[this.node],dx=n[0]-this.x,dz=n[1]-this.z,d=Math.hypot(dx,dz);
        if(d<.15){if(R){R.shift();if(!R.length)this.rt=null;}else if(this.mode==='going'){if(this.node===this.d.home){this.mode='away';this.g.visible=false;return;}this.prev=this.node;this.node=NEXT[this.node][this.d.home];}
          else{const nb=NEIGH[this.node].filter(k=>k!==this.prev);this.prev=this.node;this.node=nb.length?pick(nb):pick(NEIGH[this.node]);if(Math.random()<(PAUSE.has(this.prev)?.6:.2))this.wait=rand(2,7);}}
        else if(this.loc===CUR.id&&wkBlocked(this,dx/d,dz/d)){this.moving=false;this.blk=(this.blk||0)+dt;if(this.blk>1.6&&!R&&this.prev>=0){const n0=this.node;this.node=this.prev;this.prev=n0;this.blk=0;}}   /* (run 4 finish: like a passer-by; Luna, out for a walk, stood 0.9 m in front of the camera for as long as you stood still) */
        else{const s=Math.min(d,(this.mode==='going'?1.6:1.35)*dt);this.x+=dx/d*s;this.z+=dz/d*s;this.face=Math.atan2(dx,dz);this.moving=true;this.blk=0;}}
    }
    const dcam=Math.hypot(this.x-camera.position.x,this.z-camera.position.z);this.g.visible=this.loc===CUR.id&&dcam<48&&dcam>(this.mode==='talk'?.55:1.3)&&!((PHO.on||DANCE.on||DANCE.res)&&this.mode==='follow');   /* (a friend on its way round you that comes right up to the camera waits unseen for that moment: run 4, stage 3) */   /* (a following friend waits out of a photo shoot and a dance-off, run 4 stage 3) */this.g.position.set(this.x,hopY(this,dt)+brAt(this.loc,this.x,this.z),this.z);this.g.rotation.y=angLerp(this.g.rotation.y,this.face,Math.min(1,dt*8));
    animPerson(this.p,dt,this.moving);this.target.x=this.x;this.target.z=this.z;this.tag.visible=Math.hypot(P.x-this.x,P.z-this.z)>1.3;
  }
}
function hopY(e,dt){if(!e.hopT&&!e.hopA)return 0;if(e.hopT>0){e.hopT-=dt;if(e.hopT<=0){e.hopT=0;e.hopA=.001;}return 0;}e.hopA+=dt*2.6;if(e.hopA>=1){e.hopA=0;return 0;}return Math.sin(e.hopA*Math.PI)*.32;}
/* 🐾 followers keep a cozy gap (about 2 m): stand still and they stay put (no circling, no crowding);
   walk off (3.5 m) and they trot after you, side by side behind the way you walk; very far away = they pop over */
const fOff=n=>(n%2?-.5:.5)*Math.ceil(n/2);   /* follower n's place: 0 right behind, then left, right, further out */
const FOLW={x:0,z:0},FA={x:0,z:0};   /* FOLW: where you stood last frame: moved without walking (a lesson, a ride, a jump to a place) = "behind" is behind your back again. FA: a follower's next spot */
const STEPS=new Float32Array(48),STN={n:0,loc:null};   /* your last 24 footsteps (0.5 m apart): a blocked follower takes the way you walked (through a gate, round a fence) */
const onRoad=(x,z)=>Math.abs(x)<84&&Math.abs(z)<84&&(Math.abs(z+50)<4.3||Math.abs(z)<4.3||Math.abs(z-50)<4.3||Math.abs(x+50)<4.3||Math.abs(x)<4.3||Math.abs(x-50)<4.3);   /* the town's car roads */
const FGAP=.8;   /* 🐾 the gap between followers: no pet (or friend) ever inside you, a friend or another pet (night 3, job 3) */
function fPush(e,o,k){if(o===e||o.loc!==CUR.id||o.mode==='away')return;let qx=FA.x-o.x,qz=FA.z-o.z,q=Math.hypot(qx,qz);if(q>=FGAP)return;if(q<1e-3){qx=Math.sin(k)*1e-3;qz=Math.cos(k)*1e-3;q=1e-3;}
  const mx=FA.x-e.x,mz=FA.z-e.z,m=Math.hypot(mx,mz);
  if(m>1e-4&&qx*mx+qz*mz<-.5*q*m){   /* 🤝 run 4 (stage 1 check, N3): the other one stands right in the way, so a straight push would only send this one back: slip round it sideways instead (two friends used to wedge, one stuck behind the other, 0.8 m apart) */
    const f=(qx*mx+qz*mz)/(m*m);let px=qx-f*mx,pz=qz-f*mz,pp=Math.hypot(px,pz);if(pp<1e-3){const sd=(k&1)?1:-1;px=-mz/m*sd;pz=mx/m*sd;pp=1;}
    FA.x+=px/pp*(FGAP-q);FA.z+=pz/pp*(FGAP-q);return;}
  FA.x+=qx/q*(FGAP-q);FA.z+=qz/q*(FGAP-q);}
function fAvoid(e,x,z,k){FA.x=x;FA.z=z;for(const o of PET_ACTORS)fPush(e,o,k);for(const o of FRIEND_ACTORS)fPush(e,o,k);}   /* pets and friends go round each other and never stand inside each other */
function fMove(e,x,z,k,cap){fAvoid(e,x,z,k);let mx=FA.x-e.x,mz=FA.z-e.z;const m=Math.hypot(mx,mz);if(m>cap){mx*=cap/m;mz*=cap/m;}[e.x,e.z]=collideXZ(e.x+mx,e.z+mz,e.r,CUR);}   /* small steps only: never through a thin fence */
function followStep(e,dt,idx){
  if(!P.moving&&(P.x!==FOLW.x||P.z!==FOLW.z)){P.hd=P.yaw+Math.PI;STN.n=0;}FOLW.x=P.x;FOLW.z=P.z;
  if(STN.loc!==CUR.id){STN.loc=CUR.id;STN.n=0;}if(P.moving){const j=(STN.n+23)%24*2;if(!STN.n||Math.hypot(P.x-STEPS[j],P.z-STEPS[j+1])>.5){STEPS[STN.n%24*2]=P.x;STEPS[STN.n%24*2+1]=P.z;STN.n++;}}
  if(e.fan&&FAN.on&&e instanceof Friend&&!P.moving){fanStep(e,dt,idx);return;}   /* 🤝 standing still: friends come round in front of you */
  const ax=e.x-P.x,az=e.z-P.z,pd=Math.hypot(ax,az),a=P.hd+Math.PI+fOff(idx);
  const tx=P.x+Math.sin(a)*2,tz=P.z+Math.cos(a)*2,dx=tx-e.x,dz=tz-e.z,d=Math.hypot(dx,dz);
  if(d>14){[e.x,e.z]=collideXZ(tx,tz,e.r,CUR);e.moving=false;e.far=e.stk=0;e.wp=-1;return;}
  if(!e.fol){if(pd<3.5)e.far=0;else if(pd>Math.max(3.5,e.far||0)){e.fol=1;e.far=0;e.stk=0;e.wp=-1;}}   /* you came back near it: it forgets it was stuck */
  else if((pd<2.35||d<.3)&&!(P.moving&&ax*Math.sin(P.hd)+az*Math.cos(P.hd)<0)||e.stk>.6&&!P.moving){e.far=e.stk>.6?pd+1.5:0;e.fol=0;e.wp=-1;}  /* close enough (or stuck at a wall): wait here */
  if(e.fol&&d>(e.moving?.05:.3)){let gx=tx,gz=tz;if(e.stk>.15&&!(e.wp>=0)&&!((e.tr-=dt)>0)){e.wp=fTrail(e);e.tr=.5;}   /* blocked: take the way you walked (looks again every 0.5 s) */
    if(e.wp>=0){if(e.wp<STN.n-24||e.wp>=STN.n)e.wp=-1;else{const j=e.wp%24*2;gx=STEPS[j];gz=STEPS[j+1];if(Math.hypot(gx-P.x,gz-P.z)<2.5){e.wp=-1;gx=tx;gz=tz;}else if(Math.hypot(gx-e.x,gz-e.z)<.35)e.wp++;}}
    const gdx=gx-e.x,gdz=gz-e.z,gd=Math.hypot(gdx,gdz)||1e-6,sp=Math.min(6.2,d*3),s=Math.min(gd,sp*dt),ox=e.x,oz=e.z;   /* the further away, the faster; slows down gently near its spot (no stop-and-go when you walk slowly) */
    fMove(e,e.x+gdx/gd*s,e.z+gdz/gd*s,idx,s+.05);if(Math.hypot(e.x-ox,e.z-oz)<s*.3)e.stk=(e.stk||0)+dt;else e.stk=e.tr=0;e.face=Math.atan2(gdx,gdz);e.moving=true;e.spd=clamp(sp/3,.6,1.8);}
  else{let vx=0,vz=0;const hx=Math.sin(P.hd),hz=Math.cos(P.hd),l=ax*hz-az*hx,ox=e.x,oz=e.z;   /* waiting: only small natural moves */
    if(P.moving&&pd<1.4&&ax*hx+az*hz>0&&Math.abs(l)<.9){if(!e.dg)e.dg=l<0?-1:1;vx=hz*e.dg*3.5;vz=-hx*e.dg*3.5;}else e.dg=0;   /* you walk into it: it steps out of your way */
    if(!e.dg&&CUR.id==='city'&&pd>.9&&onRoad(e.x,e.z)&&!onRoad(P.x,P.z)){vx=-ax/pd*2.5;vz=-az/pd*2.5;}   /* never wait on the road (cars stop for pets): come to you on the pavement */
    fMove(e,ox+vx*dt,oz+vz*dt,idx,4*dt);   /* this also gets it out of furniture you just put on its spot */
    const mv=Math.hypot(e.x-ox,e.z-oz);if(e.dg&&mv<dt)e.dg=-e.dg;e.moving=mv>dt*1.5;e.spd=1;e.face=e.moving?Math.atan2(e.x-ox,e.z-oz):angLerp(e.face,Math.atan2(-ax,-az),.08);}
}
/* a free straight way from a to b: no wall, fence or water in between (only the walls near that way are checked: cheap) */
const FL=[];
function fNear(list,x1,z1,x2,z2){for(const c of list){const r=c.cr;if((r!==undefined?c.cx+r:c.x2)<x1||(r!==undefined?c.cx-r:c.x1)>x2||(r!==undefined?c.cz+r:c.z2)<z1||(r!==undefined?c.cz-r:c.z1)>z2)continue;FL.push(c);}}
function fLine(ax,az,bx,bz){const L=CUR,b=L.bounds,dx=bx-ax,dz=bz-az,n=Math.ceil(Math.hypot(dx,dz)/.45),x1=Math.min(ax,bx)-.3,z1=Math.min(az,bz)-.3,x2=Math.max(ax,bx)+.3,z2=Math.max(az,bz)+.3;
  FL.length=0;fNear(L.cols,x1,z1,x2,z2);fNear(L.dcols,x1,z1,x2,z2);
  for(let i=1;i<=n;i++){const px=ax+dx*i/n,pz=az+dz*i/n;if(px<b.x1+.24||px>b.x2-.24||pz<b.z1+.24||pz>b.z2-.24)return false;
    for(const c of FL){const q=pushOut(px,pz,.25,c);if(q&&Math.abs(q[0]-px)+Math.abs(q[1]-pz)>.01)return false;}}
  return true;}
const fClear=(x,z)=>fLine(P.x,P.z,x,z);
function fTrail(e){for(let k=STN.n-1;k>=Math.max(0,STN.n-24);k--){const j=k%24*2;if(fLine(e.x,e.z,STEPS[j],STEPS[j+1]))return k;}return -1;}   /* your newest footstep it can walk straight to */
/* pop a follower a cozy gap from you; it waits there. Beside you (doors, "Take me home", loading): out of view and never in the doorway behind you.
   front=1 ("Bring my pets to me"): in front of you, all of it in view. Never behind a wall or fence (the way to you is free), never on another pet or friend */
function nearMe(e,n,front){const sd=n%2?-1:1,b=P.yaw+Math.PI,f=fOff(front?n-1:n),C=[b+f*.45,3,b+f*.45,2.4];
  for(const r of[2,1.4])for(const s of[sd,-sd])for(let j=0;j<4;j++)C.push(b+s*(1.6+.35*j),r);
  if(!front)C.push(C.shift(),C.shift(),C.shift(),C.shift());   /* beside you first, in front only if there is no room */
  C.push(b+f*.15,2.6,b+Math.PI-f*.3,2);   /* a narrow corridor: just in front, or behind you */
  const rd=CUR.id==='city'&&!onRoad(P.x,P.z);let i=0;for(;i<C.length;i+=2){const x=P.x+Math.sin(C[i])*C[i+1],z=P.z+Math.cos(C[i])*C[i+1];fAvoid(e,x,z,0);if(FA.x===x&&FA.z===z&&!(rd&&onRoad(x,z))&&fClear(x,z))break;}if(i>=C.length)i=0;
  [e.x,e.z]=collideXZ(P.x+Math.sin(C[i])*C[i+1],P.z+Math.cos(C[i])*C[i+1],e.r,CUR);e.loc=CUR.id;e.fol=0;e.far=e.stk=0;e.wp=-1;e.moving=false;e.face=Math.atan2(P.x-e.x,P.z-e.z);}

/* 🤝 hanging out (night 3, job 3): when you stop, the friends who follow you walk to spots IN FRONT of you (a fan about 2.5-3 m away, at least
   1.2 m apart, facing you), never behind your back while you stand still. Turn right round and stand still: after about 1.5 s they walk back
   into view. While you walk they follow as before (behind you). Doors, stairs and the bus work as before. A spot is never on the road,
   in water, in furniture or behind a wall (the straight way from you to it is free) */
const FAN={on:false,yaw:0,turnT:0,loc:''};
function fanHalf(){const a=innerWidth/innerHeight,hf=Math.atan(Math.tan(camera.fov*Math.PI/360)*a);return Math.min(.52,hf*(a>1?.62:.75));}   /* (run 4, stage 3: the friend at the end stood half under the screen's edge and the buttons) */   /* how far to the side the camera still shows (a phone held upright is narrow) */
function fanSpots(n,lo,hi){const h=fanHalf();if(lo==null){lo=-h;hi=h;}const w=hi-lo;   /* (run 4 finish: an arc over the free part of the view: the two at its ends nearer, the ones in the middle further back, so each face shows between the two in front; Finn's and Theo's faces were half behind Luna) */
  if(n<2)return[[(lo+hi)/2,2.8]];if(n===2)return[[lo+w*.3,2.8],[lo+w*.7,2.8]];
  const out=[];for(let i=0;i<n;i++){const t=i/(n-1);out.push([lo+w*t,2.8+1.8*(1-Math.pow(Math.abs(2*t-1),1.5))]);}return out;}
function fanOrders(n){const all=[...Array(n).keys()];if(n>4)return[all];const out=[],go=(p,rest)=>{if(!rest.length){out.push(p);return;}rest.forEach((v,i)=>go(p.concat(v),rest.filter((_,j)=>j!==i)));};go([],all);return out;}
/* the spots, one friend after the other: as near as possible to its place in the fan, free (no wall, fence or furniture on the straight way
   from you), not on the road, not in water, and at least 1.15 m from the spots already given. On a narrow pavement the fan becomes a row
   along the pavement (left, right, further away). As a last resort: 1.8 m in front */
function fanAssign(){const fr=FRIEND_ACTORS.filter(f=>f.mode==='follow'&&f.loc===CUR.id),n=fr.length,h=fanHalf(),base=P.yaw+Math.PI,rd=CUR.id==='city'&&!onRoad(P.x,P.z);
  const okb=(x,z)=>{const q=collideXZ(x,z,.3,CUR);if(Math.hypot(q[0]-x,q[1]-z)>.05)return false;if(rd&&onRoad(x,z))return false;return fLine(P.x,P.z,x,z);},spot=(x,z,a,r)=>({x,z,a,r,b:Math.atan2(x-P.x,z-P.z)}),C=[];
  for(let i=0;i<=10;i++)for(let r=1.6;r<=5.2;r+=.4){const a=-h+h*i/5,x=P.x+Math.sin(base+a)*r,z=P.z+Math.cos(base+a)*r;if(okb(x,z))C.push(spot(x,z,a,r));}   /* the free spots in the fan, found once */
  const mid=C.filter(c=>c.r>=2.4&&c.r<=3.2),want=mid.length?fanSpots(n,Math.min(...mid.map(c=>c.a)),Math.max(...mid.map(c=>c.a))):fanSpots(n);   /* the arc spreads over the free part of the view (a road or a wall on one side narrows it) */
  const hid=(c,got)=>{let p=0;for(const g of got){const da=g.b-c.b,d=Math.abs(Math.atan2(Math.sin(da),Math.cos(da))),hd=.27/c.r+.27/g.r,bd=.42/c.r+.42/g.r;if(d<hd)p+=6;else if(d<bd)p+=1.4*(bd-d)/(bd-hd);}return p;};   /* a face behind another friend's head costs much, a shoulder behind a shoulder a little */
  const run=ord=>{const got=[],out=[];let tot=0;for(const k of ord){const [wa,wr]=want[Math.min(k,want.length-1)];let best=null,bs=1e9;
      for(const c of C){let sc=Math.abs(c.a-wa)*2+Math.abs(c.r-wr)*.6+(c.r<2.4?(2.4-c.r)*1.2:0);if(sc>=bs||got.some(g=>Math.hypot(g.x-c.x,g.z-c.z)<1.22))continue;sc+=hid(c,got);if(sc<bs){best=c;bs=sc;}}
      for(let r=2.0;r>=1.2&&!best;r-=.4)for(let a=-h;a<=h+1e-6&&!best;a+=.2){const x=P.x+Math.sin(base+a)*r,z=P.z+Math.cos(base+a)*r,c=spot(x,z,a,r);if(okb(x,z)&&!got.some(g=>Math.hypot(g.x-x,g.z-z)<1.22)){best=c;bs=8;}}
      if(!best){const q=collideXZ(P.x+Math.sin(base+wa)*1.8,P.z+Math.cos(base+wa)*1.8,.3,CUR);best=spot(q[0],q[1],wa,1.8);bs=12;}
      got.push(best);out[k]=best;tot+=bs;}return{tot,out};};
  let B=null;for(const o of fanOrders(n)){const t=run(o);if(!B||t.tot<B.tot-1e-9)B=t;}   /* the spots of the arc filled in every order (4 friends: 24 tries; the free spots are found once), the order with the least cost wins: the last one no longer takes what is left behind another */
  fr.forEach((f,k)=>{f.fan=[B.out[k].x,B.out[k].z];f.fanStk=0;});}
function fanTick(dt){const fr=FRIEND_ACTORS.filter(f=>f.mode==='follow'&&f.loc===CUR.id);
  if(P.moving||!fr.length||CUT||CLIMB||fading||P.sit||P.ride||CR){if(FAN.on){FAN.on=false;for(const f of FRIEND_ACTORS)f.fan=null;}FAN.turnT=0;return;}
  if(!FAN.on||FAN.loc!==CUR.id){FAN.on=true;FAN.loc=CUR.id;FAN.yaw=P.yaw;FAN.turnT=0;fanAssign();return;}
  if(fr.some(f=>!f.fan)){fanAssign();return;}
  const d=Math.abs(angLerp(FAN.yaw,P.yaw,1)-FAN.yaw);if(d>Math.PI/2){FAN.turnT+=dt;if(FAN.turnT>=1.5){FAN.yaw=P.yaw;FAN.turnT=0;fanAssign();}}else FAN.turnT=0;}
/* a friend walks to its spot in front of you, then stands there facing you */
function fanStep(e,dt,idx){const gx=e.fan[0],gz=e.fan[1],dx=gx-e.x,dz=gz-e.z,d=Math.hypot(dx,dz);
  if(d>.1){const sp=clamp(d*2.4,1.5,5),s=Math.min(d,sp*dt),ox=e.x,oz=e.z;fMove(e,e.x+dx/d*s,e.z+dz/d*s,idx,s+.05);const mv=Math.hypot(e.x-ox,e.z-oz);e.face=Math.atan2(dx,dz);e.moving=mv>dt*.3;e.spd=clamp(sp/3,.7,1.6);
    if(mv<s*.3){e.fanStk=(e.fanStk||0)+dt;if(e.fanStk>.7)fanAssign();}else e.fanStk=0;}   /* stuck on the way (someone in the way): new spots for everyone */
  else{const ox=e.x,oz=e.z;fMove(e,ox,oz,idx,3*dt);e.moving=false;e.spd=1;e.face=angLerp(e.face,Math.atan2(P.x-e.x,P.z-e.z),Math.min(1,dt*6));}}

/* ---- pets ---- */
/* 🏡 a pet at home (d.home, pet update 1) always waits in your yard on Friends Lane, wherever you were when the game saved (S.yq is about you, not the pets) */
function petFrom(d,x,z){return d.home&&d.stay&&d.loc==='city'&&LANE.mine!=null&&inYardR(x,z)?lotPt(LANE.mine,x,z):fromSave(d.loc,x,z);}
class Pet{
  constructor(d){this.d=d;this.m=makePet(petKind(d),d.col);addOutfit(this.m,d);this.g=this.m.root;scene.add(this.g);
    const tg=label(d.name,.24);tg.position.y=petTagY(petKind(d));this.g.add(tg);this.tag=tg;
    [this.x,this.z]=petFrom(d,d.x,d.z);this.loc=d.loc;this.face=0;this.moving=false;this.r=.3;this.wt=0;this.tx=this.x;this.tz=this.z;   /* waiting in your yard: in your yard on Friends Lane */
    this.target={x:0,z:0,r:2.1,icon:PET_TYPES[petKind(d)].icon,label:()=>'Play with '+d.name,act:()=>openPet(this),obj:this.g};}
  update(dt,idx){const d=this.d;if(this.ps)return;
    if(!d.stay){if(this.loc!==CUR.id)nearMe(this,idx);followStep(this,dt,idx);}
    else if(this.loc===CUR.id){this.wt-=dt;if(this.wt<=0){this.wt=rand(2,6);const a=rand(0,TAU),r=rand(0,d.home?.7:1.6),c=petFrom(d,d.sx,d.sz);   /* (a pet at home stays on its patch of the front yard) */[this.tx,this.tz]=collideXZ(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,.6,CUR);[this.x,this.z]=collideXZ(this.x,this.z,this.r,CUR);}   /* 🛋️ never a wander spot inside the furniture */
      const dx=this.tx-this.x,dz=this.tz-this.z,dd=Math.hypot(dx,dz);if(dd>.1){const s=Math.min(dd,1.1*dt),ox=this.x,oz=this.z;[this.x,this.z]=collideXZ(this.x+dx/dd*s,this.z+dz/dd*s,this.r,CUR);this.face=Math.atan2(dx,dz);this.moving=true;if(Math.hypot(this.x-ox,this.z-oz)<s*.3)this.wt=Math.min(this.wt,.4);}else this.moving=false;}
    d.happy=Math.max(0,d.happy-dt/HOUR*2);d.loc=this.loc;[d.x,d.z]=toSave(this.loc,this.x,this.z);
    this.g.visible=this.loc===CUR.id&&!(PHO.on&&this.loc==='city')&&!(DANCE.on||DANCE.res);   /* 🐾 your pets wait out of a photo shoot, a dance-off and its result card (run 4, stage 3) */this.g.position.set(this.x,hopY(this,dt)+brAt(this.loc,this.x,this.z),this.z);this.g.rotation.y=angLerp(this.g.rotation.y,this.face,Math.min(1,dt*8));
    animPet(this.m,dt,this.moving,d.stay?1:this.spd);this.target.x=this.x;this.target.z=this.z;this.tag.visible=Math.hypot(P.x-this.x,P.z-this.z)>1.3;}
}
function addPetActor(d){const p=new Pet(d);PET_ACTORS.push(p);return p;}
function rebuildPet(p){const pos=p.g.position.clone(),rot=p.g.rotation.y;scene.remove(p.g);p.m=makePet(petKind(p.d),p.d.col);addOutfit(p.m,p.d);p.g=p.m.root;p.g.add(p.tag);p.g.position.copy(pos);p.g.rotation.y=rot;scene.add(p.g);p.target.obj=p.g;}
const TOWNFOLK=[{skin:'#f5cfb0',hair:'#3d2c5e',style:'short',top:'#7cc8ff',bottom:'#4a4f7a',shoes:'#2e2347',scale:1.15},
  {skin:'#c98d63',hair:'#1f1a2e',style:'bun',top:'#ff8a6b',bottom:'#3f4c86',shoes:'#ffffff',scale:1.12,dress:true},
  {skin:'#8a5a3c',hair:'#2e2347',style:'short',top:'#ffd45c',bottom:'#5b5f8c',shoes:'#3d2c5e',scale:1.16},
  {skin:'#ffe0c2',hair:'#d8d8e4',style:'bun',top:'#b79cff',bottom:'#6b6f8e',shoes:'#3d2c5e',scale:1.08},
  {skin:'#f6d3bb',hair:'#9a6a43',style:'ponytail',top:'#5fd4b0',bottom:'#ffffff',shoes:'#ff7aa8',scale:.9},
  {skin:'#d9a06b',hair:'#e8734a',style:'curly',top:'#ff9ec4',bottom:'#3d4a7a',shoes:'#ffffff',scale:.92},
  {skin:'#f5cfb0',hair:'#f2d16b',style:'long',top:'#ffffff',bottom:'#7cc8ff',shoes:'#b79cff',scale:1.1,dress:true},
  {skin:'#c98d63',hair:'#3d2c5e',style:'short',top:'#c9f2e3',bottom:'#9a6a43',shoes:'#2e2347',scale:1.14},
  {skin:'#f6d3bb',hair:'#5a3a24',style:'pigtails',top:'#ffd45c',bottom:'#7cc8ff',shoes:'#ffffff',scale:.9},
  {skin:'#8a5a3c',hair:'#1f1a2e',style:'bob',top:'#ff7aa8',bottom:'#3f4c86',shoes:'#3d2c5e',scale:1.1},
  {skin:'#f5cfb0',hair:'#9a6a43',style:'short',top:'#ff8a6b',bottom:'#5b5f8c',shoes:'#ffffff',scale:1.17},
  {skin:'#c98d63',hair:'#f2d16b',style:'ponytail',top:'#7cc8ff',bottom:'#ffffff',shoes:'#ff7aa8',scale:1.08},
  {skin:'#ffe0c2',hair:'#1f1a2e',style:'curly',top:'#5fd4b0',bottom:'#3d4a7a',shoes:'#3d2c5e',scale:.93},
  {skin:'#d9a06b',hair:'#d8d8e4',style:'short',top:'#e6dbff',bottom:'#6b6f8e',shoes:'#9a6a43',scale:1.12}];
const HELLO=['Hello there!','What a lovely day!','Have you tried the cocoa at the Café?','Hi! Welcome to Cozy Town!','The fountain looks so pretty today.','I love the flowers in the park!','Good to see you!','Did you go down the slide yet? So fast!'];
const SIT_LINES=['I love watching the fountain.','Shh, my book is getting exciting!','The water sounds so relaxing.','Lovely day for sitting in the park.'];
const WALKERS=[];
function wkBlocked(w,ux,uz){const px=P.x-w.x,pz=P.z-w.z,pd=Math.hypot(px,pz),c=(px*ux+pz*uz)/(pd||1);if(c>0&&(pd<.95||pd<1.7&&c>.55||pd<2.4&&c>.82))return true;return FAN.on&&FAN.loc===CUR.id&&ptInFan(w.x+ux*.6,w.z+uz*.6)&&!ptInFan(w.x,w.z);}   /* (run 4 finish: straight at you, 2.4 m: at 1.4 m a face filled the view; walking away from you, never held; and not into the space between you and your friends round you) */   /* you are right next to me, or a step ahead on my way */
class Walker{
  constructor(look,node,owl){this.p=bakePerson(makePerson(look));this.g=this.p.root;scene.add(this.g);this.home=node;this.node=node;this.x=WP[node][0];this.z=WP[node][1];this.prev=-1;this.wait=rand(0,4);this.face=0;this.moving=false;this.loc='city';this.r=.3;this.state='home';
    this.nt=0;this.nk=0;this.ld=99;this.wv=0;   /* 👀 noticing you: time left, how much (0…1, eased), your last distance, wave cooldown */
    /* 🦉 night owls stroll all night and sleep in late in the morning; everyone else is home by about 21:00 */
    this.wakeT=owl?rand(9.6,11.4):rand(6.6,8.9);this.sleepT=owl?rand(5.4,6.6):rand(18.4,21.0);
    this.target={x:0,z:0,r:2.2,icon:'👋',label:'Say hi',obj:this.g,act:()=>{this.p.wave=1.2;this.face=Math.atan2(P.x-this.x,P.z-this.z);this.wait=Math.max(this.wait,3);SFX.talk();if(cool('hi'+this.home+this.wakeT,6))qEvent('hi');toast('“'+pick(HELLO)+'”',2.6);}};}
  awake(){const h=S?S.time:13;return this.wakeT<this.sleepT?h>=this.wakeT&&h<this.sleepT:h>=this.wakeT||h<this.sleepT;}
  /* 👀 you walk towards me (I am within 8 m, within about 35° of where you walk, and you get closer): I notice you, wave once, slow down
     (never to a stop), turn to you, and my "Say hi" shows from 3.5 m. You stop: I wait a moment (time to tap "Say hi"), then ease back to
     normal; you walk away: I ease back sooner. Gives 0…1 (smooth). Only numbers, nothing new is made each frame */
  notice(dt){const dx=this.x-P.x,dz=this.z-P.z,d=Math.hypot(dx,dz),walk=PLAYING&&CUR.id==='city'&&P.moving,c=walk&&d>.01?(dx*Math.sin(P.hd)+dz*Math.cos(P.hd))/d:1;
    if(walk&&(this.nt>0?d<9&&(c>.6||d<2.5):d<8&&c>.82&&d<this.ld)){if(this.nt<=0&&this.wv<=0&&this.p.wave<=0){this.p.wave=1.2;this.wv=12;}this.nt=1.6;}
    else this.nt=Math.max(0,this.nt-dt*(walk&&c<0?3:1));
    this.ld=d;this.wv=Math.max(0,this.wv-dt);this.nk=this.nt>0?Math.min(1,this.nk+dt*2.5):Math.max(0,this.nk-dt*1.25);return this.nk*this.nk*(3-2*this.nk);}
  init(){if(this.awake()){this.state='out';const n=Math.floor(Math.random()*WP.length);this.node=n;this.x=WP[n][0];this.z=WP[n][1];this.prev=-1;this.wait=rand(0,3);wkSpawnApart(this);}else{this.state='home';this.node=this.home;this.x=WP[this.home][0];this.z=WP[this.home][1];}}
  update(dt){const aw=this.awake();
    if(this.state==='home'){if(!aw){this.g.visible=false;return;}this.state='out';this.node=this.home;this.x=WP[this.home][0];this.z=WP[this.home][1];this.prev=-1;this.wait=rand(0,2);this.nt=this.nk=0;wkSpawnApart(this);}
    if(!aw&&this.state==='out')this.state='going';
    /* bedtime: out of sight (far away, off the screen, or you are indoors) a walker is home at once, so the night gets quiet; in sight they walk home */
    if(this.state==='going'&&(CUR.id!=='city'||Math.hypot(this.x-camera.position.x,this.z-camera.position.z)>52||!inView(this.x,this.z,5))){this.state='home';this.node=this.home;this.x=WP[this.home][0];this.z=WP[this.home][1];this.g.visible=false;return;}
    const e=this.notice(dt);
    if(this.wait>0){this.wait-=dt;this.moving=false;}
    else{const n=WP[this.node],dx=n[0]-this.x,dz=n[1]-this.z,d=Math.hypot(dx,dz);
      if(d<.15){if(this.state==='going'){if(this.node===this.home){this.state='home';this.g.visible=false;return;}this.prev=this.node;this.node=NEXT[this.node][this.home];}
        else{const nb=NEIGH[this.node].filter(k=>k!==this.prev);this.prev=this.node;this.node=nb.length?pick(nb):pick(NEIGH[this.node]);if(Math.random()<(PAUSE.has(this.prev)?.55:.15))this.wait=rand(2,7);}}
      else if(CUR.id==='city'&&wkBlocked(this,dx/d,dz/d)){this.moving=false;this.blk=(this.blk||0)+dt;if(this.blk>1.6&&this.prev>=0){const n0=this.node;this.node=this.prev;this.prev=n0;this.blk=0;}}   /* you stand on my way: I stop a step before you and, after a moment, walk back the other way (run 4, stage 3: a passer-by waited 0.9 m in front of the camera for as long as you stood still) */
      else{const s=Math.min(d,(this.state==='going'?1.5:1.25)*(1-.58*e)*(this.slow?.45:1)*dt);this.x+=dx/d*s;this.z+=dz/d*s;this.face=Math.atan2(dx,dz);this.moving=true;this.blk=0;}}   /* noticing you: 42% speed; someone right in front walking the same way: slower */
    const dcam=Math.hypot(this.x-camera.position.x,this.z-camera.position.z),far=dcam>48;this.g.visible=CUR.id==='city'&&!far&&dcam>1.3&&!ptInShot(this.x,this.z)&&!ptInFan(this.x,this.z);   /* (run 4 finish: 1.3 m, not 1: at 1.2 m a back filled the middle of the picture) */   /* (a passer-by right at the camera, where their face would fill the screen, waits unseen for that moment; run 4, stage 3) */this.g.position.set(this.x,0,this.z);   /* (a passer-by between the camera and the family steps out of a photo shoot: run 4, stage 3) */
    /* 👀 turning to you: walking, the body turns a little (it still walks along its path); standing, all the way. The head turns the rest
       (angLerp(x,a,1)-x = the smallest turn from x to a) */
    const a=e>0?Math.atan2(P.x-this.x,P.z-this.z):0,fy=e<=0?this.face:this.moving?this.face+clamp(angLerp(this.face,a,1)-this.face,-.6,.6)*e:angLerp(this.face,a,e);
    this.g.rotation.y=angLerp(this.g.rotation.y,fy,Math.min(1,dt*(e>0?5:8)));
    if(!far){animPerson(this.p,dt,this.moving,1-.5*e);const h=this.p.head;h.rotation.y=lerp(h.rotation.y,e>0?clamp(angLerp(this.g.rotation.y,a,1)-this.g.rotation.y,-1,1)*e:0,Math.min(1,dt*6));}
    this.target.x=this.x;this.target.z=this.z;this.target.r=2.2+1.3*e;}   /* "Say hi" reach: 2.2 m, 3.5 m when they notice you */
}
/* 🚶 townspeople give way (night 3, job 4). Walkers used to follow their paths and pass through each other. Now: face to face, each steps about
   0.7 m to its right (never from the pavement onto the road), passes, then walks back to its path by itself; walking the same way, the one behind
   slows down; and nobody is ever closer than 0.6 m to another walker (a gentle push apart every frame). Waiting walkers count too. They also go
   round bench sitters, grandmas, friends, pets and players. Cheap: only walkers near each other are compared (24 walkers, a distance check first) */
const WK={stat:[]};
function wkStat(){const S0=WK.stat;S0.length=0;if(!CUR||CUR.id!=='city')return S0;const add=(x,z,r)=>S0.push({x,z,r});
  if(PLAYING)add(P.x,P.z,.5);if(typeof sittersOut==='function'&&S&&sittersOut())for(const s of SITTERS)add(s.x,s.z,.45);
  if(typeof GRAN!=='undefined')for(const q of GRAN.g)if(q.on&&!q.sitting)add(q.x+(q.ox||0),q.z+(q.oz||0),.45);   /* 👵 the walking grandmas */
  for(const f of FRIEND_ACTORS)if(f.loc==='city'&&f.mode!=='away')add(f.x,f.z,.42);for(const p of PET_ACTORS)if(p.loc==='city')add(p.x,p.z,.36);
  if(typeof MP!=='undefined')for(const a of MP.peers.values())if(a.av&&a.av.root.visible&&a.loc==='city')add(a.x,a.z,.42);return S0;}
/* move a walker a little; from the pavement never onto the road (on a zebra crossing it may move along the road) */
function wkNudge(w,nx,nz){const x=w.x+nx,z=w.z+nz;if(onRoad(x,z)&&!onRoad(w.x,w.z))return false;w.x=x;w.z=z;return true;}
function wkSide(w,k){const rx=Math.cos(w.face),rz=-Math.sin(w.face);if(!wkNudge(w,rx*k,rz*k))wkNudge(w,-rx*k,-rz*k);}   /* a step to its right (or left if the road is there) */
function walkersApart(dt){const W=[];for(const w of WALKERS){if(w.state==='home')continue;w.slow=0;W.push(w);}
  for(let i=0;i<W.length;i++){const a=W[i];for(let j=i+1;j<W.length;j++){const b=W[j];const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);if(d>1.4)continue;
    const ax=Math.sin(a.face),az=Math.cos(a.face),bx=Math.sin(b.face),bz=Math.cos(b.face),dot=ax*bx+az*bz;
    if(dot<-.3&&a.moving&&b.moving){const k=Math.min(.7,(1.4-d))*dt*2.2;wkSide(a,k);wkSide(b,k);}   /* face to face: each steps to its right */
    else if(dot>.5&&d<1.1){const behind=(dx*ax+dz*az)>0?a:b;behind.slow=1;}}   /* same way: the one behind slows down */
    /* people and pets who stand or sit about: walk round them */
    for(const o of WK.stat){const dx=a.x-o.x,dz=a.z-o.z,d=Math.hypot(dx,dz),m=o.r+.3;if(d>=m)continue;if(d<1e-4){wkNudge(a,m,0);continue;}const k=m-d;if(!wkNudge(a,dx/d*k,dz/d*k)){const rx=Math.cos(a.face),rz=-Math.sin(a.face);wkNudge(a,rx*k,rz*k);}}}
  /* never inside each other: a few passes, because pushing one pair apart can nudge a third walker (at a corner where paths meet) */
  for(let pass=0;pass<4;pass++){let moved=false;
    for(let i=0;i<W.length;i++){const a=W[i];for(let j=i+1;j<W.length;j++){const b=W[j];const dx=b.x-a.x,dz=b.z-a.z,d2=Math.hypot(dx,dz);if(d2>=.64)continue;moved=true;
      let px,pz;if(d2<1e-4){px=Math.cos(a.face);pz=-Math.sin(a.face);}else{px=dx/d2;pz=dz/d2;}const k=(.64-d2)/2+.005;
      if(wkNudge(b,px*k,pz*k)){if(!wkNudge(a,-px*k,-pz*k))wkNudge(b,px*k,pz*k);}
      else if(wkNudge(a,-px*k*2,-pz*k*2)){}
      else if(wkNudge(b,-pz*k*2,px*k*2)||wkNudge(b,pz*k*2,-px*k*2)||wkNudge(a,-pz*k*2,px*k*2)||wkNudge(a,pz*k*2,-px*k*2)){}   /* along the pavement */
      else{b.x+=px*k;b.z+=pz*k;a.x-=px*k;a.z-=pz*k;}}}   /* (last resort, almost never: nowhere to go but the road edge) */
    if(!moved)break;}
  for(const a of W){a.g.position.x=a.x;a.g.position.z=a.z;}}
/* a walker that comes out (wakes up, or a new day) never appears inside another one */
function wkSpawnApart(w){for(let t=0;t<6;t++){const o=WALKERS.find(q=>q!==w&&q.state!=='home'&&Math.hypot(q.x-w.x,q.z-w.z)<.75);if(!o)return;const a=w.face+Math.PI/2+t*1.1,x=w.x+Math.cos(a)*.8,z=w.z+Math.sin(a)*.8;if(onRoad(x,z)&&!onRoad(w.x,w.z))continue;w.x=x;w.z=z;}}
/* 🌦️ weather and seasons (night 3, job 11). The season comes from the real date (seasonOf, job 1): the trees take its colours when the town is
   built (they are baked, so a new season shows at the next load). The weather comes from the shared clock only: every 3 game hours a block
   (wxAt(day,hour): sunny, cloudy, rain or snow, by the season's shares; snow only in winter and the Christmas window), so two players with
   the same clock see the same weather, and nothing new is sent online. The last game hour of a block fades into the next (wxNow().k).
   Rain: a greyer sky, a softer sun, rain lines around you, a quiet rain sound outdoors (only with sound on). Snow: flakes around you, and
   the grass turns white while it snows and for the next block. Nothing falls indoors. No thunder. wxForce(kind) is for the tests */
const WX={force:null,cur:'sunny',grey:0,rain:0,snow:0,cover:0,t:0,snd:null,sndG:null,sky:0,kind:'cloudy'};
/* 🌫️ the sky in bad weather (top, bottom), by day; at night it goes towards a dark grey. Rain and snow only fall once the sky is grey (item 2: the owner saw rain under a blue sky: the old
   sky only went 60% grey, and the rain lines started in the first minutes of the change while the sky was still blue) */
const WX_SKY={cloudy:['#9ba7b5','#d3dae2'],rain:['#6e7a8b','#a9b2be'],snow:['#aab4c1','#e4e9ef']};
const WX_SHARE={spring:[['sunny',55],['cloudy',20],['rain',25]],summer:[['sunny',70],['cloudy',15],['rain',15]],autumn:[['sunny',45],['cloudy',25],['rain',30]],
  winter:[['sunny',30],['cloudy',30],['snow',35],['rain',5]],xmas:[['sunny',20],['cloudy',20],['snow',60]]};
function wxHash(d,b){let x=(Math.imul(d|0,8)+(b|0)+11)>>>0;x=Math.imul(x^(x>>>16),2246822519)>>>0;x=Math.imul(x^(x>>>13),3266489917)>>>0;x^=x>>>16;return(x>>>0)/4294967296;}
function wxSeason(){return HOL.cur==='xmas'?'xmas':seasonOf(realDate());}
function wxAt(day,hour){const b=Math.floor(hour/3),T=WX_SHARE[wxSeason()]||WX_SHARE.summer;let u=wxHash(day,b)*100;for(const [k,p] of T){if(u<p)return k;u-=p;}return T[0][0];}
function wxNow(){if(WX.force)return{a:WX.force,b:WX.force,k:0};const d=S?S.day|0:1,h=S?S.time:12,b=Math.floor(h/3),hm=h-b*3;let d2=d,b2=b+1;if(b2>7){b2=0;d2++;}
  return{a:wxAt(d,b*3+1.5),b:wxAt(d2,b2*3+1.5),k:hm>2?clamp(hm-2,0,1):0};}
function wxForce(k){WX.force=k||null;}
function wxKind(){const w=wxNow();return w.k<.5?w.a:w.b;}   /* the grandmas, the butterflies and the birds ask this */
/* a falling cloud of drops around the camera, moved on the GPU: y wraps every H metres, so it never runs out */
function wxCloud(kind,n){const H=18,W=28,rain=kind==='rain',pos=new Float32Array(n*(rain?6:3)),spd=new Float32Array(n*(rain?2:1)),ph=new Float32Array(n*(rain?2:1)),dy=new Float32Array(n*2);
  const r=seeded(rain?31:32);
  for(let i=0;i<n;i++){const x=(r()-.5)*W,y=r()*H,z=(r()-.5)*W,s=rain?12+r()*5:.9+r()*.7,p=r()*6.28;
    if(rain){pos.set([x,y,z,x,y,z],i*6);spd.set([s,s],i*2);ph.set([p,p],i*2);dy.set([0,.5],i*2);}else{pos.set([x,y,z],i*3);spd[i]=s;ph[i]=p;}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('spd',new THREE.BufferAttribute(spd,1));g.setAttribute('ph',new THREE.BufferAttribute(ph,1));
  if(rain)g.setAttribute('dy',new THREE.BufferAttribute(dy,1));
  const u={t:{value:0},op:{value:0},H:{value:H},pr:{value:Math.min(2,window.devicePixelRatio||1)}};
  const vs=rain?`uniform float t,H;attribute float spd,ph,dy;void main(){vec3 p=position;p.y=mod(p.y-t*spd,H)+dy;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`
    :`uniform float t,H,pr;attribute float spd,ph;void main(){vec3 p=position;p.y=mod(p.y-t*spd,H);p.x+=sin(t*.8+ph)*.5;p.z+=cos(t*.6+ph)*.35;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=clamp(70.0/max(1.0,-mv.z),2.0,9.0)*pr;gl_Position=projectionMatrix*mv;}`;
  const fs=rain?`uniform float op;void main(){gl_FragColor=vec4(.78,.85,.97,op*.5);}`
    :`uniform float op;void main(){vec2 c=gl_PointCoord-.5;if(dot(c,c)>.25)discard;gl_FragColor=vec4(1.0,1.0,1.0,op*.9);}`;
  const m=new THREE.ShaderMaterial({uniforms:u,vertexShader:vs,fragmentShader:fs,transparent:true,depthWrite:false,fog:false});
  const o=rain?new THREE.LineSegments(g,m):new THREE.Points(g,m);o.frustumCulled=false;o.visible=false;o.renderOrder=5;o.userData.keep=1;o.userData.wx=kind;return o;}
/* 🍂 autumn leaves fall from the tree crowns around you (run 4, item 18: they used to be little orange diamonds anywhere in a 28 m box reaching 13 m over your head, so they showed high in the night sky).
   90 leaves on the GPU: each belongs to one of the nearest round trees (dealt again once a second as you walk), starts inside its crown, tumbles down to the ground and starts over; none without a tree nearby */
const LEAF={n:90,t:9,loc:null,trees:null,near:0};
function leafCloud(n){const r=seeded(33),LC=[[1,.55,.2],[.95,.3,.25],[1,.8,.25],[.9,.45,.15]],pos=new Float32Array(n*3),org=new Float32Array(n*4),spd=new Float32Array(n),ph=new Float32Array(n),col=new Float32Array(n*3);
  for(let i=0;i<n;i++){const a=r()*6.28,d=Math.sqrt(r());pos.set([Math.cos(a)*d,r(),Math.sin(a)*d],i*3);spd[i]=.5+r()*.5;ph[i]=r()*6.28;col.set(LC[i%4],i*3);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('org',new THREE.BufferAttribute(org,4));g.setAttribute('spd',new THREE.BufferAttribute(spd,1));g.setAttribute('ph',new THREE.BufferAttribute(ph,1));g.setAttribute('col',new THREE.BufferAttribute(col,3));
  const u={t:{value:0},op:{value:0},pr:{value:Math.min(2,window.devicePixelRatio||1)}};
  const vs=`uniform float t,pr;attribute vec4 org;attribute float spd,ph;attribute vec3 col;varying vec3 vc;varying float va;
    void main(){vc=col;float top=max(org.y,.5),fall=mod(t*spd+ph*1.7,top),k=fall/top;
      vec3 p=vec3(org.x+position.x*org.w+sin(t*.9+ph)*.45+k*sin(ph)*1.2,top-fall,org.z+position.z*org.w+cos(t*.7+ph)*.45+k*cos(ph)*1.2);
      va=ph+t*spd*2.5;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_PointSize=clamp(120.0/max(1.0,-mv.z),2.0,16.0)*pr;gl_Position=projectionMatrix*mv;}`;
  const fs=`uniform float op;varying vec3 vc;varying float va;void main(){vec2 c=gl_PointCoord-.5;float s=sin(va),co=cos(va);c=vec2(c.x*co-c.y*s,c.x*s+c.y*co);
      float w=.23*(1.0-c.y*c.y/.2116);if(abs(c.y)>.46||abs(c.x)>w)discard;float rib=abs(c.x)<.018?.78:1.0;gl_FragColor=vec4(vc*rib,op*.95);}`;   /* a pointed oval with a midrib: a leaf */
  const m=new THREE.ShaderMaterial({uniforms:u,vertexShader:vs,fragmentShader:fs,transparent:true,depthWrite:false,fog:false});
  const o=new THREE.Points(g,m);o.frustumCulled=false;o.visible=false;o.renderOrder=5;o.userData.keep=1;o.userData.wx='leaf';return o;}
/* the round trees of the place you are in, in world coordinates (found once per place) */
function leafTrees(){const L=CUR;if(!L||!L.g)return[];if(LEAF.loc!==L){LEAF.loc=L;const v=new THREE.Vector3();LEAF.trees=TREES.filter(t=>{for(let p=t[3];p;p=p.parent)if(p===L.g)return true;return false;}).map(t=>{v.set(t[0],0,t[1]);t[3].localToWorld(v);return[v.x,v.z,t[2]];});}return LEAF.trees;}
function leafDeal(){const T=leafTrees(),cx=camera.position.x,cz=camera.position.z,near=[];
  for(const t of T){const d=Math.hypot(t[0]-cx,t[1]-cz);if(d<26)near.push([d,t]);}near.sort((a,b)=>a[0]-b[0]);const N=Math.min(12,near.length);LEAF.near=N;if(!N)return;
  const a=LEAFM.geometry.attributes.org;let k=0;for(let i=0;i<LEAF.n;i++){if(a.getW(i)>0&&Math.hypot(a.getX(i)-cx,a.getZ(i)-cz)<30)continue;const t=near[k++%N][1],s=t[2];a.setXYZW(i,t[0],3.05*s,t[1],1.15*s);}   /* a leaf keeps its tree while the tree is near: no jumping mid-fall */
  a.needsUpdate=true;}
function leafTick(dt,leaf){if(!LEAFM)return;LEAF.t+=dt;if(leaf>.02&&LEAF.t>1){LEAF.t=0;leafDeal();}else if(leaf<=.02)LEAF.t=9;
  LEAFM.visible=leaf>.02&&LEAF.near>0;LEAFM.material.uniforms.op.value=leaf;LEAFM.material.uniforms.t.value=WX.t;}
let RAINM=null,SNOWM=null,LEAFM=null;
function wxBuild(){if(RAINM||!scene)return;RAINM=wxCloud('rain',700);SNOWM=wxCloud('snow',520);LEAFM=leafCloud(90);scene.add(RAINM,SNOWM,LEAFM);window.RAINM=RAINM;window.SNOWM=SNOWM;window.LEAFM=LEAFM;}
/* the quiet rain: looped noise through a low filter; only outdoors, only with sound on */
function wxSound(v){if(!AC||!SET.sound){v=0;}if(v>0&&!WX.snd){try{const n=AC.sampleRate*2,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*.6;
    const s=AC.createBufferSource();s.buffer=b;s.loop=true;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=800;const g=AC.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(AC.destination);s.start();WX.snd=s;WX.sndG=g;}catch(e){WX.snd=null;}}
  if(WX.sndG){const g=WX.sndG.gain,t=AC.currentTime;g.cancelScheduledValues(t);g.setTargetAtTime(v*.055,t,.4);if(v<=0){const s=WX.snd,gg=WX.sndG;WX.snd=null;WX.sndG=null;setTimeout(()=>{try{s.stop();s.disconnect();gg.disconnect();}catch(e){}},1500);}}}
function wxTick(dt){if(!scene)return;wxBuild();const w=wxNow(),mix=(k)=>(w.a===k?1-w.k:0)+(w.b===k?w.k:0),rain=mix('rain'),snow=mix('snow'),cloud=mix('cloudy');
  WX.cur=w.k<.5?w.a:w.b;WX.rain=rain;   /* (run 4 finish: the chip's weather changes with the sky's, not up to half a second later) */WX.snow=snow;WX.grey=Math.max(cloud*.55,rain*.9,snow*.7);WX.t+=dt;
  {const bad=clamp((cloud+rain+snow)/.4,0,1);WX.sky=bad*bad*(3-2*bad);WX.kind=snow>=rain&&snow>=cloud?'snow':rain>=cloud?'rain':'cloudy';}   /* the sky is fully grey in the first part of a change (run 4, item 2) */
  {const ic=S?skyIc():'';if(ic!==WX.shown){WX.shown=ic;hudT=1;}}   /* the chip shows a new sky at once (run 4 finish: the sky as you see it) */
  /* snow stays on the grass for the block after a snow block */
  let cover=snow;if(S&&!WX.force&&cover<1){const h=S.time,b=Math.floor(h/3);let d0=S.day|0,b0=b-1;if(b0<0){b0=7;d0--;}if(wxAt(d0,b0*3+1.5)==='snow')cover=1;}
  WX.cover=cover;const out=!!CUR&&CUR.type==='out'&&PLAYING;
  if(GRASS_M){_c1.set('#86d36a').lerp(_c2.set('#eef4f8'),cover);GRASS_M.color.lerp(_c1,Math.min(1,dt*1.5));}
  const cam=camera.position;for(const o of[RAINM,SNOWM]){if(!o)continue;o.position.set(cam.x,cam.y-5,cam.z);o.material.uniforms.t.value=WX.t;}
  const leaf=out&&SEASON==='autumn'&&rain<.3&&snow<.3?1-Math.max(rain,snow):0;
  const rv=clamp((rain-.3)/.7,0,1),snv=clamp((snow-.3)/.7,0,1);   /* rain and snow only once the sky is grey (run 4, item 2) */
  RAINM.visible=out&&rv>.02;RAINM.material.uniforms.op.value=rv;SNOWM.visible=out&&snv>.02;SNOWM.material.uniforms.op.value=snv;leafTick(dt,leaf);
  const sv=out&&rv>.02&&PLAYING?rv:0;if(Math.abs(sv-(WX.sv||0))>.02||(sv===0&&WX.snd)){WX.sv=sv;wxSound(sv);}}
/* 🍂 the season's colours for the trees, set when the town is built */
const SEASON_COLS={spring:{tree:['#9fe08a','#b4ea8e','#8fd97e','#a6e68c','#ffc9dc'],pine:['#5fc484','#6bcf8c']},summer:{tree:['#7ed37a','#6cc97c','#93dc76'],pine:['#4fb37a','#5bbf7e']},
  autumn:{tree:['#ff9f43','#ff6b4a','#ffd45c','#e8734a','#ffb347'],pine:['#4fa36f','#56ad76']},winter:{tree:['#cfe8dc','#dff2ea','#b8dcc8','#e8f4ee'],pine:['#9ccfb6','#b7dfcc']}};
let SEASON='summer',TREE_COLS=SEASON_COLS.summer.tree,PINE_COLS=SEASON_COLS.summer.pine;
function seasonSet(){try{SEASON=seasonOf(realDate());}catch(e){SEASON='summer';}const C=SEASON_COLS[SEASON]||SEASON_COLS.summer;TREE_COLS=C.tree;PINE_COLS=C.pine;}
/* 👵 three grandmas (run 4, items 8 and 20). The twelve who sat on the benches by the town houses are gone (the benches stay, two seats each).
   The three walk round town with the one clock: the real day is cut into 80-second turns, and in each turn every grandma has a place to be (a shop
   door, the school, the park, the Flower Corner gate, the bus stop, the beach gate…); every few turns two of them sit on the duck-pond bench, feed
   the ducks and chat about ducks and life. The day's plan comes from a seeded hash of the real date, so every player's game puts them in the same
   spot at the same moment; between places they walk the townspeople's paths at 1.15 m/s and talk about where they stand. Out 9:00 to 18:00 in dry
   weather, as before; "Say hi" gets a kind line, never the same twice in a row */
const GRAN={g:[],last:'',T:80000,SPD:1.15,day:-1,day0:0,plan:null,start:[1,10,14],paths:new Map(),bench:null,crumbs:[],
  lines:["Oh, what a dear! Have a biscuit, sweetheart. 🍪","You remind me of my grandson. Such a nice smile!","In my day we walked everywhere. Keeps you young!","Lovely weather for a walk, isn't it?","Mind you don't catch cold, pet. Button up!","Aren't you a busy bee! Off you go and play.","Would you like a sweet? I always carry some. 🍬","My knitting is nearly done. A scarf for the cat! 🧶","Hello dear! Say hi to your mum from me.","Such good manners! Your parents must be proud."],
  chat:['🧶','☕','Oh my!','In my day…','Lovely weather!','Hee hee!','Did you hear?','🍪','Oh, I know!','My word!']};
const GRAN_LOOKS=[{skin:'#f6d3bb',hair:'#d8d8e4',style:'bun',top:'#b79cff',bottom:'#6f7dff',shoes:'#3d2c5e',dress:true,glasses:'glasses',glc:'#3d2c5e',eyes:'happy',mouth:'small',scale:1.06},
  {skin:'#ffe0c2',hair:'#f4f4f8',style:'bun',top:'#ffb3c7',bottom:'#ffffff',shoes:'#9a6a43',dress:true,glasses:'glasses',glc:'#ff7aa8',eyes:'sleepy',mouth:'small',scale:1.02},
  {skin:'#c98d63',hair:'#c9c9d6',style:'bun',top:'#7fdcb5',bottom:'#3f4c86',shoes:'#3d2c5e',dress:true,glasses:'glasses',glc:'#ffd45c',eyes:'happy',mouth:'smile',scale:1.08},
  {skin:'#8a5a3c',hair:'#e8e8f0',style:'bun',top:'#ffd45c',bottom:'#5b5f8c',shoes:'#ffffff',dress:true,glasses:'glasses',glc:'#7cc8ff',eyes:'sleepy',mouth:'small',scale:1.04},
  {skin:'#f5cfb0',hair:'#bdbdcc',style:'bun',top:'#ff8a6b',bottom:'#6b6f8e',shoes:'#3d2c5e',dress:true,glasses:'glasses',glc:'#3d2c5e',eyes:'happy',mouth:'small',scale:1.1},
  {skin:'#d9a06b',hair:'#f0f0f6',style:'bun',top:'#8fd3ff',bottom:'#ffffff',shoes:'#9a6a43',dress:true,glasses:'glasses',glc:'#b79cff',eyes:'sleepy',mouth:'smile',scale:1.0},
  {skin:'#f6d3bb',hair:'#d2d2de',style:'bun',top:'#c9f2e3',bottom:'#3d2c5e',shoes:'#3d2c5e',dress:true,glasses:'glasses',glc:'#ff7aa8',eyes:'happy',mouth:'small',scale:1.07},
  {skin:'#ffe0c2',hair:'#e4e4ee',style:'bun',top:'#e6dbff',bottom:'#6f7dff',shoes:'#ffffff',dress:true,glasses:'glasses',glc:'#3d2c5e',eyes:'sleepy',mouth:'small',scale:1.03},
  {skin:'#c98d63',hair:'#f6f6fa',style:'bun',top:'#ffe0c4',bottom:'#5b5f8c',shoes:'#3d2c5e',dress:true,glasses:'glasses',glc:'#ffd45c',eyes:'happy',mouth:'smile',scale:1.09},
  {skin:'#f5cfb0',hair:'#cfcfdc',style:'bun',top:'#ff9ec4',bottom:'#3f4c86',shoes:'#9a6a43',dress:true,glasses:'glasses',glc:'#7cc8ff',eyes:'sleepy',mouth:'small',scale:1.01},
  {skin:'#d9a06b',hair:'#e0e0ea',style:'bun',top:'#fff1b8',bottom:'#6b6f8e',shoes:'#3d2c5e',dress:true,glasses:'glasses',glc:'#3d2c5e',eyes:'happy',mouth:'small',scale:1.05},
  {skin:'#8a5a3c',hair:'#cbcbd8',style:'bun',top:'#d9e8ff',bottom:'#ffffff',shoes:'#ffffff',dress:true,glasses:'glasses',glc:'#ff7aa8',eyes:'sleepy',mouth:'smile',scale:1.06}];
function granOut(){return!!S&&S.time>=9&&S.time<18&&!/rain|snow/.test(wxKind());}
/* where they go: a townspeople's path node near each place (they stand a step off the path, facing the place) and what they say there; the pond is first */
const GRAN_STOPS=[
  {id:'pond',at:[33.4,-37.0],via:[44.5,-44.5],look:[36.2,-36.2],lines:["Here, duckies! Crumbs for everyone! 🦆","Look at the little one paddling! 🐥","Life's like a pond, dear: mostly calm, with little ripples.","Share your bread and you'll never be lonely. 🍞","Quack if you want more! Hee hee!","Feeding the ducks is the best part of my day.","The ducks know me, you know. Every one of them."]},
  {id:'school',near:[-25,-57.3],look:[-25,-62],lines:["Clever children in there! 🏫","I went to this school, you know.","Study hard and be kind, dear.","Is that the bell? Ding-a-ling! 🔔"]},
  {id:'toys',near:[57.2,-31],look:[64,-31],lines:["I'd love a teddy bear. At my age! 🧸","Toys were made of wood in my day.","What a lovely window! 🎁"]},
  {id:'bakery',near:[57.2,-14],look:[63,-14],lines:["Mmm, fresh bread! 🥖","The buns here are a dream. 🥐","Just smell that! Heaven."]},
  {id:'library',near:[57.6,20],look:[65,20],lines:["Shh! The books are sleeping. 📚","I read a book a week, dear.","A story a day keeps the frowns away!"]},
  {id:'icecream',near:[57.2,36],look:[62,36],lines:["One scoop of vanilla, please! 🍦","Ice cream in any weather, I say!","My grandson likes the pink one. 🍓"]},
  {id:'pizza',near:[55.5,5.6],look:[63,8.6],lines:["That pizza smell! 🍕","Chef Blaze makes a fine crust.","A slice would do me nicely."]},
  {id:'fire',near:[-57.6,-25],look:[-65,-25],lines:["Such brave firefighters! 🚒","That engine shines like a mirror!","Never play with matches, pet."]},
  {id:'clothes',near:[-57.6,-12.5],look:[-63.5,-12.5],lines:["Ooh, a new cardigan! 🧶","That hat would suit me, don't you think?","Fashions change, cardigans stay."]},
  {id:'salon',near:[-55.5,36],look:[-63.5,40.5],lines:["Time for my blue rinse! 💇","A good haircut lifts the spirits.","Just a trim, dear, just a trim."]},
  {id:'market',near:[20,-5.6],look:[18,-12],lines:["Apples, carrots and a bit of cheese. 🍎","I never forget my shopping list. Almost never!","Fresh as the morning, this market."]},
  {id:'cafe',near:[34,-5.6],look:[32,-12],lines:["A cup of cocoa would be lovely. ☕","Best cake in town, I tell you.","Coffee and a chat: perfect."]},
  {id:'pets',near:[20,5.6],look:[18,12],lines:["Look at those puppies! 🐾","I had a cat called Marmalade.","Pets need love and a warm bed."]},
  {id:'flowers',near:[34,5.6],look:[31.5,12],lines:["Tulips! My favourite. 🌷","Flowers make every day brighter.","I'll take a bunch for the kitchen table."]},
  {id:'park',near:[-22,14],look:[-22,22],lines:["Listen to that fountain! ⛲","I sat on that bench when I was your age.","The park is the heart of our town."]},
  {id:'corner',near:[-20,-5.6],look:[-17,-9],lines:["The Flower Corner! Such a pretty garden. 🌸","Holidays bring something new here, you'll see.","I planted roses here once."]},
  {id:'bus',near:[-20,5.6],look:[-16.2,7.6],lines:["The bus to the beach! 🚌","Three days a week, if you catch it.","I like the window seat."]},
  {id:'beach',near:[75,5.6],look:[80,0],lines:["The sea is that way! 🏖️","Mind the sun, dear. A hat!","Sandcastles are for everyone, even grannies."]},
  {id:'field',near:[-25,59.4],look:[-25,66],lines:["Goal! Did you see that? ⚽","Running keeps you young.","My team always wins. Hee hee!"]},
  {id:'lake',near:[60.6,60.6],look:[69,69],lines:["The lake is so peaceful. 🌊","Ducks here too! Lucky me.","On a still day it's a mirror."]}];
function granNode(x,z){let b=0,bd=1e9;for(let i=0;i<WP.length;i++){const d=Math.hypot(WP[i][0]-x,WP[i][1]-z);if(d<bd){bd=d;b=i;}}return b;}
function granBuild(L){for(const s of GRAN_STOPS){const n=s.near||s.via;s.node=granNode(n[0],n[1]);if(s.at)s.spot=s.at.slice();else{const [nx,nz]=WP[s.node],dx=s.look[0]-nx,dz=s.look[1]-nz,d=Math.hypot(dx,dz)||1;s.spot=[nx+dx/d*.9,nz+dz/d*.9];}
    s.face=Math.atan2(s.look[0]-s.spot[0],s.look[1]-s.spot[1]);}
  GRAN.bench=BENCHES.find(b=>b.loc==='city'&&Math.hypot(b.x-32.6,b.z+36.4)<.8)||null;if(GRAN.bench)for(let i=0;i<2;i++)GRAN.bench.sit[i]=()=>granSeat(i);   /* a seat is taken while a grandma sits on it */
  for(let i=0;i<3;i++){const look=GRAN_LOOKS[i],p=bakePerson(makePerson(look));p.root.visible=false;p.root.userData.aside=1;L.g.add(p.root);
    const q={i,p,look,x:0,z:0,on:false,sitting:false,seat:0,nod:0,turn:0,bub:null,bubT:0,bi:-1,fi:-1,yaw:0};q.target={x:0,z:0,r:2.2,icon:'👋',label:'Say hi',obj:p.root,act:()=>granHi(q)};GRAN.g.push(q);}}
function buildGrandmas(L,st){for(const [hx,hz,ry] of [[13,-57.25,0],[25,-57.25,0],[37,-57.25,0],[13,57.25,Math.PI],[25,57.25,Math.PI],[37,57.25,Math.PI]]){const bx=hx+3.4;bench(st,bx,hz,ry);colC(L,bx,hz,.8);}   /* the six benches by the town houses stay, two seats each */
  granBuild(L);}
/* the walk from one stop to another: along the paths (NEXT = the next node towards a node), with the two steps off the path at the ends */
function granPath(a,b){const key=a+'>'+b;let P0=GRAN.paths.get(key);if(P0)return P0;const A=GRAN_STOPS[a],B=GRAN_STOPS[b],pts=[A.spot];
  if(a!==b){pts.push(WP[A.node]);let n=A.node;for(let g=0;g<90&&n!==B.node;g++){n=NEXT[n][B.node];if(n==null||n<0)break;pts.push(WP[n]);}pts.push(B.spot);}
  const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));P0={pts,cum,len:cum[cum.length-1]};GRAN.paths.set(key,P0);return P0;}
/* the day's plan, the same on every device: a stop per grandma per 80-second turn, never further than 70 m of walking away (85 m to the pond), two
   of the three at the pond about one turn in four, no two at the same shop; seeded by the real date */
function granPlan(ms){const dayKey=Math.floor(ms/86400000);if(GRAN.day===dayKey)return;GRAN.day=dayKey;GRAN.day0=dayKey*86400000;const r=seeded(dayKey*977+13),n=GRAN_STOPS.length,N=Math.ceil(86400000/GRAN.T)+1,plan=[];let cur=GRAN.start.slice();
  const dist=(a,b)=>granPath(a,b).len;
  for(let k=0;k<N;k++){const sl=[-1,-1,-1],pond=r()<.28,stay=Math.floor(r()*3);
    for(let g=0;g<3;g++){const from=cur[g];let s;
      if(pond&&g!==stay&&dist(from,0)<=85)s=0;
      else{const c=[];for(let i=1;i<n;i++)if(i!==from&&!sl.includes(i)&&dist(from,i)<=70)c.push(i);s=c.length?c[Math.floor(r()*c.length)]:from;}
      sl[g]=s;}
    plan.push(sl);cur=sl;}
  GRAN.plan=plan;GRAN.paths.clear();}
/* where grandma g is at this moment: on her way (1.15 m/s along the turn's path) or standing at the turn's stop */
function granPose(g,ms){const k=clamp(Math.floor((ms-GRAN.day0)/GRAN.T),0,GRAN.plan.length-1),u=(ms-GRAN.day0-k*GRAN.T)/1000,stop=GRAN.plan[k][g],prev=k>0?GRAN.plan[k-1][g]:GRAN.start[g],P0=granPath(prev,stop),d=Math.min(P0.len,GRAN.SPD*u);
  let i=1;while(i<P0.cum.length-1&&P0.cum[i]<d)i++;const a=P0.pts[i-1]||P0.pts[0],b=P0.pts[i]||a,seg=(P0.cum[i]||0)-(P0.cum[i-1]||0),t=seg>0?clamp((d-P0.cum[i-1])/seg,0,1):0;
  return{k,u,stop,d,x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t,moving:d<P0.len-.02,arrived:d>=P0.len-.02,face:Math.atan2(b[0]-a[0],b[1]-a[1])};}
function granSeat(i){return GRAN.g.some(q=>q.on&&q.sitting&&q.seat===i);}
function granHi(q){const L=GRAN.lines.filter(x=>x!==GRAN.last),t=pick(L);GRAN.last=t;q.nod=1.2;q.turn=1.6;SFX.talk();toast('“'+t+'”',3.4);if(typeof qEvent==='function'&&cool('granhi',6))qEvent('hi');}
function anA(n){return(/^[aeiou]/i.test(n)?'an ':'a ')+n;}
function granBubble(q,txt){granBubOff(q);for(const o of GRAN.g)if(o!==q&&o.bub&&Math.hypot(o.x-q.x,o.z-q.z)<3)granBubOff(o);   /* (run 4 finish: one speaker at a time on the pond bench, also after a jump of the clock) */
  let b;if(txt.length>22){const sp=[...txt].map((ch,i)=>ch===' '?i:-1).filter(i=>i>0);const m=sp.reduce((a,i)=>Math.abs(i-txt.length/2)<Math.abs(a-txt.length/2)?i:a,sp[0]||-1);   /* a long line wraps onto two lines at the space nearest its middle (run 4 finish: one long pill ran off the screen) */
    if(m>0){const c=textCanvas2([txt.slice(0,m),txt.slice(m+1)]);b=spriteOf(c,.38*c.height/(44*1.36+12));b.userData.w0=b.scale.x;b.userData.h0=b.scale.y;b.userData.lines=b.scale.y/.38;b.onBeforeRender=tagFit;b.center.set(.5,0);}}
  if(!b){b=label(txt,.38);}b.userData.bub=1;b.position.y=(q.sitting?2.1:2.32)-(b.center.y===0?.19:0);b.material.depthTest=false;b.renderOrder=30;   /* (run 4, stage 3: drawn over her own head too) */   /* (run 4, stage 3: above the bun, so her hair never hides a word) */q.p.root.add(b);q.bub=b;q.bubT=2.8;}
function granBubOff(q){const b=q.bub;if(!b)return;q.bub=null;if(b.parent)b.parent.remove(b);b.material.map.dispose();b.material.dispose();}
const granH=(a,b,c)=>Math.floor(seeded(a*131+b*17+c*7+5)()*1e6);
/* 🍞 a sitting grandma tosses three crumbs to the pond; when they land, the ducks of the little pond come to them */
function granCrumbs(q){const C=GRAN.crumbs;if(!C.length)for(let i=0;i<3;i++){const m=sph(LOC.city.dyn,.035,'#f3e2b8',0,0,0,{ws:6,hs:4,ol:false});m.visible=false;C.push({m,t:0,x0:0,y0:0,z0:0,x1:0,z1:0,land:0});}
  const B=GRAN.bench,R=q.p.root.position;for(let i=0;i<3;i++){const c=C[i];c.t=.9+i*.08;c.x0=R.x+Math.sin(B.ry)*.35;c.y0=.95;c.z0=R.z+Math.cos(B.ry)*.35;c.x1=34.9+(i-1)*.35;c.z1=-36.3+((i*7)%3-1)*.3;c.land=1;c.m.visible=true;}}
function granCrumbTick(dt){for(const c of GRAN.crumbs){if(c.t<=0)continue;c.t-=dt;const k=clamp(1-c.t/.9,0,1);c.m.position.set(c.x0+(c.x1-c.x0)*k,c.y0*(1-k)+.03+Math.sin(k*Math.PI)*.5,c.z0+(c.z1-c.z0)*k);
    if(c.t<=0){c.m.visible=false;if(c.land){c.land=0;for(const d of LOC.city.ducks)if(d.pond===0){d.fed=6;d.wait=0;for(let j=0;j<6;j++)if(duckGo(d,34.9+rand(-.5,.5),-36.3+rand(-.5,.5)))break;}}}}}
function granTick(dt){if(!GRAN.g.length)return;const out=granOut()&&!!CUR&&CUR.id==='city',ms=realMs();granPlan(ms);const cam=camera.position,B=GRAN.bench;
  for(const q of GRAN.g){const ps=granPose(q.i,ms),st=GRAN_STOPS[ps.stop];q.x=ps.x;q.z=ps.z;q.on=out;
    const sit=out&&ps.stop===0&&ps.arrived&&!!B;q.sitting=sit;if(sit)q.seat=GRAN.plan[ps.k].slice(0,q.i).filter(s=>s===0).length;
    /* 👵 she walks round you: while she passes she is drawn a step to the side of her way, at least 2.4 m from you, and keeps that step while she stands. On your device only:
       her place in the day's plan (q.x, q.z) stays the same on every device (run 4 finish: at the bus stop a grandma walked through the camera, her head a third of the screen) */
    if(!out||sit){q.ox=q.oz=0;q.side=0;}else if(ps.moving){const fx=Math.sin(ps.face),fz=Math.cos(ps.face),dx=ps.x-P.x,dz=ps.z-P.z,a=dx*fx+dz*fz,l=dx*fz-dz*fx;let t=0;   /* (the side she takes is kept until she has passed: on your exact line it flipped and she swung through you) */
      const u=a/5;if(Math.abs(u)<1){const need=2.4*(1-u*u)*(1-u*u);if(q.side||Math.abs(l)<need){if(!q.side)q.side=l<0?-1:1;t=q.side*Math.max(0,need-q.side*l);}}else q.side=0;   /* (a smooth step aside, from 5 m before you to 5 m past you: at most 0.85 m/s sideways) */
      const k=Math.min(1,Math.max(dt,Math.min(.5,(ms-(q.lms||ms))/1000))*6);q.ox=(q.ox||0)+(fz*t-(q.ox||0))*k;q.oz=(q.oz||0)+(-fx*t-(q.oz||0))*k;}   /* (by the clock, not by drawn frames: run 4 finish, on a slow screen the step lagged and she passed 1.5 m from the camera) */
    const gx=ps.x+(q.ox||0),gz=ps.z+(q.oz||0);q.target.x=gx;q.target.z=gz;q.lms=ms;
    const near=Math.hypot(gx-cam.x,gz-cam.z),shot=ptInShot(gx,gz)||ptInFan(gx,gz),vis=out&&near<48&&near>(sit?.6:1.3)&&!shot;   /* (run 4 finish: not drawn for the moment she walks through the camera, like a friend or a passer-by) */if(q.p.root.visible!==vis)q.p.root.visible=vis;if(!out||shot){if(q.bub)granBubOff(q);continue;}   /* (a grandma between the camera and a photo's family steps out of the shoot like any passer-by, bubble and all; run 4, stage 3) */
    const R=q.p.root,sc=q.look.scale||1;
    if(sit){const s=B.seats[q.seat],fx=Math.sin(B.ry),fz=Math.cos(B.ry);R.position.set(s.x-fx*.06,.55-.62*sc,s.z-fz*.06);R.rotation.y=B.ry;q.yaw=B.ry;q.x=s.x;q.z=s.z;q.target.x=s.x;q.target.z=s.z;sitPose(q.p);q.p.b.position.y=0;}
    else{R.position.set(gx,0,gz);let want=ps.moving?ps.face:st.face;if(q.turn>0&&!ps.moving){q.turn-=dt;want=Math.atan2(P.x-gx,P.z-gz);}q.yaw=angLerp(q.yaw,want,Math.min(1,dt*(ps.moving?8:4)));R.rotation.y=q.yaw;if(vis)animPerson(q.p,dt,ps.moving,1);}
    const h=q.p.head;if(q.nod>0){q.nod-=dt;h.rotation.x=Math.sin(q.nod*12)*.14;}else h.rotation.x*=.85;
    if(q.bub){q.bubT-=dt;if(q.bubT<=0)granBubOff(q);}
    if(ps.arrived&&near<34){const bi=ps.k*4096+Math.floor(ps.u/5.5);if(q.bi!==bi){q.bi=bi;const turn=ps.stop!==0||((Math.floor(ps.u/5.5)+q.seat)%2===0);   /* at the pond the two take turns */
        if(turn){const L=st.lines,hh=granH(ps.k,q.i,bi);granBubble(q,hh%5===0?GRAN.chat[hh%GRAN.chat.length]:L[hh%L.length]);}}
      if(sit){const fi=ps.k*4096+Math.floor((ps.u+q.seat*3)/6);if(q.fi!==fi){q.fi=fi;if(near<40)granCrumbs(q);}}}}
  granCrumbTick(dt);}
/* ---- 🌙 night glows: soft light sprites in one shared additive material (no real lights, no shadows). The sky fades
   them in at dusk and out at dawn; by day the material is switched off, so they cost nothing ---- */
let NGLOW=null,CARGLOW=null;const LAMPXZ=[];
function glowMat(){if(NGLOW)return NGLOW;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.3,'rgba(255,255,255,.45)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);
  NGLOW=new THREE.ShaderMaterial({uniforms:{map:{value:new THREE.CanvasTexture(c)},op:{value:0}},transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,
    vertexShader:'attribute vec2 cor;attribute vec3 tint;varying vec2 vU;varying vec3 vC;void main(){vU=uv;vC=tint;vec4 p=modelViewMatrix*vec4(position,1.);p.xy+=cor;p.z+=length(cor)*.7;gl_Position=projectionMatrix*p;}',
    fragmentShader:'uniform sampler2D map;uniform float op;varying vec2 vU;varying vec3 vC;void main(){gl_FragColor=vec4(vC*texture2D(map,vU).a*op,1.);}'});
  NGLOW.visible=false;return NGLOW;}
/* list of glows: [x,y,z,size,tint] always turns to the camera, [x,y,z,w,d,tint] lies flat on the ground */
function glowGeo(list){const P=[],U=[],K=[],T=[],I=[];
  for(const q of list){const n=P.length/3,t=q[q.length-1],fl=q.length>5;
    for(const [u,v] of[[0,0],[1,0],[1,1],[0,1]]){if(fl)P.push(q[0]+(u-.5)*q[3],q[1],q[2]+(v-.5)*q[4]);else P.push(q[0],q[1],q[2]);
      K.push(fl?0:(u*2-1)*q[3],fl?0:(v*2-1)*q[3]);U.push(u,v);T.push(t[0],t[1],t[2]);}
    I.push(n,n+1,n+2,n,n+2,n+3);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));
  g.setAttribute('cor',new THREE.Float32BufferAttribute(K,2));g.setAttribute('tint',new THREE.Float32BufferAttribute(T,3));g.setIndex(I);g.computeBoundingSphere();g.boundingSphere.radius+=1;return g;}
function glowMesh(geo){const m=new THREE.Mesh(geo,glowMat());m.renderOrder=2;m.userData.keep=1;return m;}
/* ✨ fireflies over Cozy Park at night (the designer's wish): 48 tiny soft glowing dots in ONE mesh with the same soft-dot picture.
   Each one drifts in its own little loop and blinks slowly, all worked out on the graphics chip (nothing moves in the game code).
   They come out a little after sunset and go to bed at dawn; by day the mesh is off, so it costs nothing */
let FLIES=null;
function buildFlies(L){const r=seeded(23),P=[],U=[],K=[],F=[],I=[];let n=0;
  for(let k=0;k<400&&n<48;k++){const x=-39.4+r()*30.4,z=9.4+r()*30.4,y=.45+r()*1.7,ph=r()*TAU,sp=.25+r()*.35,ra=.35+r()*.75,bl=.9+r()*1.3,sz=.09+r()*.05;
    if(Math.hypot(x+22,z-22)<5.6||(x<-31&&z>19&&z<25))continue;   /* not in the fountain's spray, not on the Pet Show stage */
    for(const [u,v] of[[0,0],[1,0],[1,1],[0,1]]){P.push(x,y,z);U.push(u,v);K.push((u*2-1)*sz,(v*2-1)*sz);F.push(ph,sp,ra,bl);}
    I.push(n*4,n*4+1,n*4+2,n*4,n*4+2,n*4+3);n++;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));
  g.setAttribute('cor',new THREE.Float32BufferAttribute(K,2));g.setAttribute('fly',new THREE.Float32BufferAttribute(F,4));g.setIndex(I);g.computeBoundingSphere();g.boundingSphere.radius+=1.5;
  const m=new THREE.ShaderMaterial({uniforms:{map:{value:glowMat().uniforms.map.value},op:{value:0},tm:{value:0}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:'attribute vec2 cor;attribute vec4 fly;uniform float tm,op;varying vec2 vU;varying float vA;void main(){vU=uv;float t=tm*fly.y+fly.x;'+
      'vec3 p=position+vec3(sin(t)*fly.z,sin(t*1.7+fly.x)*.28,cos(t*.8)*fly.z);float b=.5+.5*sin(tm*fly.w+fly.x*3.);vA=op*(.2+.8*b*b);'+
      'vec4 q=modelViewMatrix*vec4(p,1.);q.xy+=cor;gl_Position=projectionMatrix*q;}',
    fragmentShader:'uniform sampler2D map;varying vec2 vU;varying float vA;void main(){gl_FragColor=vec4(vec3(.95,1.,.42)*texture2D(map,vU).a*vA*1.15,1.);}'});
  FLIES=new THREE.Mesh(g,m);FLIES.renderOrder=2;FLIES.userData.keep=1;FLIES.visible=false;L.g.add(FLIES);}
function updFlies(tt){if(!FLIES)return;const op=clamp((nightF(S?S.time:10)-.35)/.45,0,1);FLIES.visible=op>.01;if(op>.01){const u=FLIES.material.uniforms;u.op.value=op;u.tm.value=tt%1e4;}}
/* car lights (one geometry for every car): two warm headlights with a soft pool on the road ahead, two red tail lights */
function carGlowGeo(){const W=[1,.86,.58],R=[1,.16,.1];return CARGLOW||(CARGLOW=glowGeo([[-.55,.69,1.78,.42,W],[.55,.69,1.78,.42,W],[0,.07,4.6,3,6,[.6,.49,.3]],
  [-.55,.7,-1.78,.3,R],[.55,.7,-1.78,.3,R],[0,.07,-2.45,1.9,1.4,[.28,.04,.03]]]));}
/* ---- cars that drive around town ---- */
const CARS=[],XS=[];
function lanePath(pts){const n=pts.length,out=[];for(let i=0;i<n;i++){const a=pts[(i-1+n)%n],b=pts[i],c=pts[(i+1)%n];
  const l1=Math.hypot(b[0]-a[0],b[1]-a[1]),l2=Math.hypot(c[0]-b[0],c[1]-b[1]),d1=[(b[0]-a[0])/l1,(b[1]-a[1])/l1],d2=[(c[0]-b[0])/l2,(c[1]-b[1])/l2];
  const k=2/(1+d1[0]*d2[0]+d1[1]*d2[1]);out.push([b[0]+(-d1[1]-d2[1])*k,b[1]+(d1[0]+d2[0])*k]);}return out;}
function carPlace(c){let d=((c.d%c.total)+c.total)%c.total;const p=c.path,n=p.length;
  for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n],L=Math.hypot(b[0]-a[0],b[1]-a[1]);
    if(d<=L){const t=d/L;c.x=a[0]+(b[0]-a[0])*t;c.z=a[1]+(b[1]-a[1])*t;c.ty=Math.atan2(b[0]-a[0],b[1]-a[1]);const rem=L-d;
      if(rem<4){const q=p[(i+2)%n];c.ty=angLerp(c.ty,Math.atan2(q[0]-b[0],q[1]-b[1]),(4-rem)/8);}return;}d-=L;}}
/* 🌫️ far away people and cars grow in softly over their last 6 m instead of popping in (at 48 m and 80 m). Scale only: no extra drawing */
function popFade(g,R){if(!g||!g.visible)return;const d=Math.hypot(g.position.x-camera.position.x,g.position.z-camera.position.z),k=clamp((R-d)/6,0,1);if(k<=0){g.visible=false;return;}if(g.scale.x!==k)g.scale.setScalar(k);}
function popFades(){for(const w of WALKERS)popFade(w.g,48);for(const f of FRIEND_ACTORS)popFade(f.g,48);for(const c of CARS)popFade(c.g,80);for(const k of FB.k)popFade(k.p.root,55);}   /* (⚽ the football friends too: they are drawn up to 55 m) */
/* 🌙 a "Closed" sign hangs on the shop and library doors in closed hours (20:00-8:00; 23:00-7:00 on the long-hours shops' doors, CLOSED_L): one picture, one material, two meshes, drawn only then */
let CLOSED=null,CLOSED_L=null;
function buildClosedSigns(L){const D=[[32,-10.98,0],[18,10.98,Math.PI],[59.48,-14,-Math.PI/2],[59.98,20,-Math.PI/2]],DL=[[18,-10.98,0],[31.5,10.98,Math.PI],[59.48,-31,-Math.PI/2],[58.98,36,-Math.PI/2],[-59.98,-12.5,Math.PI/2]];
  const sp=signPlane('🌙 Closed',.92,.34,'#3d2c5e','#fff3c4');sp.geometry.dispose();
  const mk=D=>{const P=[],U=[],I=[],m=new THREE.Matrix4();
  D.forEach(([x,z,ry],k)=>{const g=new THREE.PlaneGeometry(.92,.34);m.makeRotationY(ry).setPosition(x+Math.sin(ry)*.11,1.78,z+Math.cos(ry)*.11);g.applyMatrix4(m);
    const p=g.attributes.position,u=g.attributes.uv;for(let i=0;i<p.count;i++){P.push(p.getX(i),p.getY(i),p.getZ(i));U.push(u.getX(i),u.getY(i));}for(const i of g.index.array)I.push(i+k*4);g.dispose();});
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(P,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));geo.setIndex(I);geo.computeBoundingSphere();
    const M=new THREE.Mesh(geo,sp.material);M.visible=false;M.userData.keep=1;L.g.add(M);return M;};
  CLOSED=mk(D);CLOSED_L=mk(DL);}
function buildCars(){for(const x of[-50,0,50])for(const z of[-50,0,50])XS.push({x,z,occ:[]});
  const loops={A:[[-50,-50],[50,-50],[50,50],[-50,50]],B:[[-50,-50],[-50,50],[50,50],[50,-50]],C:[[0,0],[0,-50],[50,-50],[50,0]],D:[[0,0],[0,50],[-50,50],[-50,0]],E:[[0,0],[-50,0],[-50,-50],[0,-50]],F:[[0,0],[50,0],[50,50],[0,50]]};
  const counts={A:3,B:2,C:2,D:2,E:1,F:2},cols=['#ff8a6b','#7cc8ff','#ffd45c','#b79cff','#5fd4b0','#ff7aa8','#ffffff','#9fe486','#ff6b6b','#c9f2e3'];let ci=0;
  for(const k in loops){const path=lanePath(loops[k]);let total=0;for(let i=0;i<path.length;i++){const a=path[i],b=path[(i+1)%path.length];total+=Math.hypot(b[0]-a[0],b[1]-a[1]);}
    for(let i=0;i<counts[k];i++){const g=new THREE.Group();car(g,0,0,0,cols[ci++%cols.length]);bake(g,true);g.add(glowMesh(carGlowGeo()));scene.add(g);
      const c={g,path,total,d:total*i/counts[k]+12,v:0,max:6+Math.random()*1.5,x:0,z:0,yaw:0,ty:0,honk:0,
        owl:CARS.length===0||CARS.length===7,offT:rand(20.3,21.8),onT:rand(5.6,6.9),away:false};carPlace(c);c.yaw=c.ty;CARS.push(c);}}}
/* is this car (with its light pool) on the player's screen? */
const _fr=new THREE.Frustum(),_frM=new THREE.Matrix4(),_frS=new THREE.Sphere();
function inView(x,z,r){_frS.center.set(x,1,z);_frS.radius=r;return _fr.intersectsSphere(_frS);}   /* uses the camera view of the last frame */
function carSeen(c){if(CUR.id!=='city'||Math.hypot(c.x-camera.position.x,c.z-camera.position.z)>92)return false;return inView(c.x,c.z,9);}
function updateCars(dt){const inCity=CUR.id==='city',peds=[],h=S?S.time:12;if(inCity&&PLAYING)peds.push([P.x,P.z,1.7,1]);
  /* 🌙 cozy nights: all but two cars go away for the night and come back in the morning, only where nobody sees it happen */
  _frM.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);_fr.setFromProjectionMatrix(_frM);
  for(const c of CARS){const off=!c.owl&&(h>=c.offT||h<c.onT);if(c.away===off)continue;
    if(off){if(carSeen(c))continue;}
    else{/* coming back: at the spot where it left, or else anywhere on its loop that nobody sees (not near you, no car within 9 m) */
      const ok=()=>!carSeen(c)&&!(inCity&&Math.hypot(P.x-c.x,P.z-c.z)<10)&&!CARS.some(o=>o!==c&&!o.away&&Math.hypot(o.x-c.x,o.z-c.z)<9),d0=c.d;let k=0;
      for(;k<6;k++){if(k){c.d=d0+c.total*k/6;carPlace(c);}if(ok())break;}if(k>=6){c.d=d0;carPlace(c);continue;}if(k)c.yaw=c.ty;}
    c.away=off;c.v=0;c.g.visible=false;for(const X of XS){const i=X.occ.indexOf(c);if(i>=0)X.occ.splice(i,1);}}
  for(const w of WALKERS)if(w.state!=='home')peds.push([w.x,w.z,1.4,0]);for(const q of GRAN.g)if(q.on&&!q.sitting)peds.push([q.x,q.z,1.4,0]);for(const f of FRIEND_ACTORS)if(f.loc==='city'&&f.mode!=='away')peds.push([f.x,f.z,1.4,0]);for(const p of PET_ACTORS)if(p.loc==='city')peds.push([p.x,p.z,1.1,0]);for(const a of MP.peers.values())if(a.loc==='city')peds.push([a.x,a.z,1.4,0]);
  for(const c of CARS){if(c.away)continue;const fx=Math.sin(c.yaw),fz=Math.cos(c.yaw);let block=null;
    for(const [px,pz,w,me] of peds){const dx=px-c.x,dz=pz-c.z,f=dx*fx+dz*fz,l=Math.abs(dx*fz-dz*fx);if(f>0&&f<6.5&&l<w){block=me?'player':'ped';break;}}
    if(!block)for(const o of CARS){if(o===c||o.away)continue;const dx=o.x-c.x,dz=o.z-c.z,f=dx*fx+dz*fz,l=Math.abs(dx*fz-dz*fx);if(f>0&&f<7.5&&l<2.2){block='car';break;}}
    if(!block&&busBlock(c.x,c.z,fx,fz))block='car';   /* 🚌 the bus at its stop or on its way */
    const ax=c.x+fx*5,az=c.z+fz*5;
    for(const X of XS){const inside=Math.abs(c.x-X.x)<6.3&&Math.abs(c.z-X.z)<6.3,near=Math.abs(ax-X.x)<6.3&&Math.abs(az-X.z)<6.3,i=X.occ.indexOf(c);
      if(inside||near){if(i<0){const clash=X.occ.some(o=>Math.abs(Math.sin(o.yaw)*fx+Math.cos(o.yaw)*fz)<.7);if(clash&&!inside)block=block||'cross';else X.occ.push(c);}}
      else if(i>=0)X.occ.splice(i,1);}
    c.v=lerp(c.v,block?0:c.max,Math.min(1,dt*(block?5:1.2)));if(block&&c.v<.05)c.v=0;
    if(block==='player'){c.honk-=dt;if(c.honk<=0){c.honk=3.5;if(Math.hypot(P.x-c.x,P.z-c.z)<12)SFX.honk();}}else c.honk=Math.min(c.honk,.6);
    c.d+=c.v*dt;carPlace(c);c.yaw=angLerp(c.yaw,c.ty,Math.min(1,dt*7));c.g.position.set(c.x,0,c.z);c.g.rotation.y=c.yaw;c.g.visible=inCity&&Math.hypot(c.x-camera.position.x,c.z-camera.position.z)<80;}}
/* ---- ducks ---- */
const PONDS=[{x:36.2,z:-36.2,r:1.45,pads:[[-.75,.3],[.45,.9],[.75,-.6]]},{x:69,z:69,r:6.4,dock:LAKEW}];   /* (run 4 finish: pads: the little pond's lily flowers, a duck keeps 34 cm from each: one sat on a flower, the bud through its chest) */
function duckOk(i,x,z){const p=PONDS[i];if(Math.hypot(x-p.x,z-p.z)>p.r)return false;if(p.pads)for(const [fx,fz] of p.pads)if(Math.hypot(x-p.x-fx,z-p.z-fz)<.34)return false;   /* 🌉 ducks swim under the bridge only in its high middle */
  if(p.dock)for(const w of p.dock){const qx=x-w.ax,qz=z-w.az,t=qx*w.ux+qz*w.uz,s=-qx*w.uz+qz*w.ux;if(t>-.5&&t<w.len+.5&&Math.abs(s)<w.hw+.45)return false;}return true;}
function duckLine(i,x0,z0,x1,z1){const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,z1-z0)/.25));for(let k=1;k<=n;k++){const t=k/n;if(!duckOk(i,x0+(x1-x0)*t,z0+(z1-z0)*t))return false;}return true;}
/* send a duck somewhere it can really swim to: straight there, or round the end of the pier */
function duckGo(d,tx,tz){const i=d.pond;if(!duckOk(i,tx,tz))return false;if(duckLine(i,d.x,d.z,tx,tz)){d.tx=tx;d.tz=tz;d.via=null;return true;}
  const p=PONDS[i],w=p.dock&&p.dock[p.dock.length-1];if(!w)return false;const ex=w.ax+w.ux*(w.len+1.6),ez=w.az+w.uz*(w.len+1.6);
  for(const s of[0,1.2,-1.2]){const vx=ex-w.uz*s,vz=ez+w.ux*s;if(duckOk(i,vx,vz)&&duckLine(i,d.x,d.z,vx,vz)&&duckLine(i,vx,vz,tx,tz)){d.via=[vx,vz];d.tx=tx;d.tz=tz;return true;}}return false;}
function updDucks(dt,tt){for(const d of LOC.city.ducks){if(d.pond===undefined){d.pond=d.cx!==undefined?1:0;const p=PONDS[d.pond];for(let k=0;k<40;k++){d.x=p.x+(Math.random()-.5)*p.r*1.4;d.z=p.z+(Math.random()-.5)*p.r*1.4;if(duckOk(d.pond,d.x,d.z))break;}d.tx=d.x;d.tz=d.z;d.wait=0;d.face=0;d.fed=0;d.via=null;}
  const pd=PONDS[d.pond];if(d.fed>0)d.fed-=dt;
  if(d.wait>0)d.wait-=dt;else{const gx=d.via?d.via[0]:d.tx,gz=d.via?d.via[1]:d.tz,dx=gx-d.x,dz=gz-d.z,dist=Math.hypot(dx,dz);
    if(dist<.08){if(d.via)d.via=null;else if(d.fed>0){d.wait=.6;d.face=Math.atan2(P.x-d.x,P.z-d.z);}else{d.wait=rand(.5,3);for(let k=0;k<12;k++){const a=rand(0,TAU),r=Math.sqrt(Math.random())*pd.r;if(duckGo(d,pd.x+Math.cos(a)*r,pd.z+Math.sin(a)*r))break;}}}
    else{const sp=Math.min(dist,(d.fed>0?1.0:.35)*dt),nx=d.x+dx/dist*sp,nz=d.z+dz/dist*sp;if(duckOk(d.pond,nx,nz)||!duckOk(d.pond,d.x,d.z)){d.x=nx;d.z=nz;d.face=Math.atan2(dx,dz);}else{d.tx=d.x;d.tz=d.z;d.via=null;}}}   /* (run 4 finish: a duck pushed aside by the other swam on straight at its old goal, across a lily flower: a step into water it may not use ends the swim there) */
  for(const e of LOC.city.ducks)if(e!==d&&e.pond===d.pond&&e.x!==undefined){const sx=d.x-e.x,sz=d.z-e.z,sd=Math.hypot(sx,sz);if(sd<.8&&sd>1e-4){const k=(.8-sd)/2,nx=d.x+sx/sd*k,nz=d.z+sz/sd*k;if(duckOk(d.pond,nx,nz)){d.x=nx;d.z=nz;}else{const ex=e.x-sx/sd*k*2,ez=e.z-sz/sd*k*2;if(duckOk(e.pond,ex,ez)){e.x=ex;e.z=ez;}}}}   /* 🦆 two ducks never swim into each other: 80 cm, a duck with its head (run 4, stage 3; at the pond's edge the other one moves) */
  d.g.position.set(d.x,.02+Math.sin(tt*3+d.x)*.02,d.z);d.g.rotation.y=angLerp(d.g.rotation.y,d.face,Math.min(1,dt*5));}}
function feedDucks(i){const k=['bread','bagel','croissant','pretzel'].find(b=>S.bag[b]>0);if(!k){SFX.no();toast('The ducks would love some 🍞 bread! Get some at the Market or the Bakery.',3.4);return;}
  S.bag[k]--;SFX.quack();const pd=PONDS[i],ax=P.x-pd.x,az=P.z-pd.z,al=Math.hypot(ax,az)||1;
  const tk=[];for(const d of LOC.city.ducks)if(d.pond===i){d.fed=7;d.wait=0;let ok=false;const a0=Math.atan2(pd.z-P.z,pd.x-P.x);
    for(const rr of[2.2,2.9,1.7]){for(let k=0;k<16&&!ok;k++){const a=a0+(k%2?1:-1)*Math.ceil(k/2)*.39,x=P.x+Math.cos(a)*rr+rand(-.25,.25),z=P.z+Math.sin(a)*rr+rand(-.25,.25);if(tk.some(t=>Math.hypot(t[0]-x,t[1]-z)<1.0))continue;ok=duckGo(d,x,z);}if(ok)break;}   /* (run 4 finish: each duck its own spot, a metre apart: two went to the same one and stayed there bill to bill) */
    if(!ok)duckGo(d,pd.x+ax/al*(pd.r*.85)+rand(-.4,.4),pd.z+az/al*(pd.r*.85)+rand(-.4,.4));tk.push([d.tx,d.tz]);}
  setTimeout(()=>{SFX.quack();for(const d of LOC.city.ducks)if(d.pond===i)floatText('💗',d.x,.9,d.z,{h:.5});},1500);
  toast('Quack quack! The ducks love your '+FOODS[k].n.toLowerCase()+'! 🦆',3);addXP('pets',2);qEvent('ducks');change();}
/* ---- the little arched bridge over the duck pond went in run 4 (item 3): the pond is solid water all round, the ducks stay; brY stays for the friends' and pets' heights (always 0 now) ---- */
function brY(x,z){return 0;}
const brAt=(loc,x,z)=>0;   /* how high someone stands at x,z in that place (nothing to climb in town any more) */
/* walking over it: your view goes up and down with the arch (P.cy, only while you are on it; cut scenes, rides and stairs set it themselves) */
const BRP={on:false};
function brTick(dt){if(!PLAYING||CUR.id!=='city'||CUT||CLIMB||P.ride){BRP.on=false;return;}const h=brY(P.x,P.z);if(!h&&!BRP.on)return;
  const c=P.cy||0;P.cy=Math.abs(h-c)<.1?h:lerp(c,h,Math.min(1,dt*12));if(!h&&P.cy<.005)P.cy=0;BRP.on=P.cy>0;}
/* ---- the football on the sports field: a real round ball (12 dark pentagons, white hexagons, thin seams) ---- */
function ballTex(){const W=512,H=256,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),im=x.createImageData(W,H),D=im.data,
  t=(1+Math.sqrt(5))/2,V=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(v=>{const l=Math.hypot(v[0],v[1],v[2]);return[v[0]/l,v[1]/l,v[2]/l];}),
  dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],N=[],CS=[],SN=[];for(const v of V)N.push(v[0]/2.3274,v[1]/2.3274,v[2]/2.3274);
  /* pentagons sit on the 12 corners of an icosahedron, hexagons on its 20 triangles (scaled by each face's distance, like a real ball) */
  for(let i=0;i<12;i++)for(let j=i+1;j<12;j++)for(let k=j+1;k<12;k++){const a=V[i],b=V[j],e=V[k];if(dot(a,b)>.4&&dot(b,e)>.4&&dot(a,e)>.4){const s=[a[0]+b[0]+e[0],a[1]+b[1]+e[1],a[2]+b[2]+e[2]],l=Math.hypot(s[0],s[1],s[2])*2.2673;N.push(s[0]/l,s[1]/l,s[2]/l);}}
  const F=new Float64Array(N),nf=F.length;for(let i=0;i<W;i++){const ph=(i+.5)/W*TAU;CS.push(-Math.cos(ph));SN.push(Math.sin(ph));}
  for(let j=0;j<H;j++){const th=(j+.5)/H*Math.PI,st=Math.sin(th),py=Math.cos(th);for(let i=0;i<W;i++){const px=CS[i]*st,pz=SN[i]*st;
    let b1=-9,b2=-9,bi=0;for(let f=0;f<nf;f+=3){const s=px*F[f]+py*F[f+1]+pz*F[f+2];if(s>b1){b2=b1;b1=s;bi=f;}else if(s>b2)b2=s;}
    const e=bi<36?0:clamp((b1-b2-.004)/.004,0,1),o=(j*W+i)*4;D[o]=46+209*e;D[o+1]=35+220*e;D[o+2]=71+184*e;D[o+3]=255;}}
  x.putImageData(im,0,0);const T=new THREE.CanvasTexture(c);T.anisotropy=4;return T;}
function buildBall(){const L=LOC.city,g=new THREE.Group(),m=toon({map:ballTex(),emissive:new THREE.Color('#ffd27a'),emissiveIntensity:0});
  const s=sph(g,BR,'#ffffff',0,0,0,{ws:32,hs:20,ol:.02,mat:m});s.castShadow=s.receiveShadow=true;L.dyn.add(g);L.ball.g=g;L.ball.m=m;g.position.set(L.ball.x,BR,L.ball.z);
  /* the soft glow ring and the aim arrow (shown only when you can kick) */
  const fx=new THREE.Group(),ring=new THREE.Mesh(new THREE.RingGeometry(.3,.44,40),new THREE.MeshBasicMaterial({color:'#fff3c4',transparent:true,opacity:.8,depthWrite:false}));
  ring.rotation.x=-Math.PI/2;ring.position.y=.03;fx.add(ring);
  const ag=new THREE.BufferGeometry();ag.setAttribute('position',new THREE.BufferAttribute(new Float32Array(42),3));ag.setIndex([0,1,2,0,2,3,4,5,6,7,8,9,7,9,10,11,12,13]);ag.addGroup(0,9,0);ag.addGroup(9,9,1);
  const arrow=new THREE.Mesh(ag,[new THREE.MeshBasicMaterial({color:INK,transparent:true,opacity:.55,depthWrite:false,side:THREE.DoubleSide}),new THREE.MeshBasicMaterial({color:'#fff3c4',transparent:true,opacity:.95,depthWrite:false,side:THREE.DoubleSide})]);
  arrow.position.y=.04;arrow.frustumCulled=false;fx.add(arrow);ballArrow(arrow,.9);fx.visible=false;L.dyn.add(fx);L.ball.fx={g:fx,ring,arrow};fbBuild();}
/* the arrow lies on the grass in front of the ball: longer = stronger (ink edge first, then the colour on top) */
function ballArrow(A,len){if(A.userData.len===len)return;A.userData.len=len;const p=A.geometry.attributes.position,a=p.array,s=.36,w=.07,hw=.2,o=.05,e=s+len,h=e-.34;
  [[-w-o,s-o],[w+o,s-o],[w+o,h],[-w-o,h],[-hw-o*1.7,h-o],[hw+o*1.7,h-o],[0,e+o*1.9],[-w,s],[w,s],[w,h+.01],[-w,h+.01],[-hw,h],[hw,h],[0,e]].forEach(([x,z],i)=>{a[i*3]=x;a[i*3+1]=0;a[i*3+2]=z;});p.needsUpdate=true;}
const GZ1=66.1,GZ2=70.9,BR=.22,GOALS=[{gx:-39,s:-1},{gx:-11,s:1}];
function ballHit(b,cx,cz,rr,e){let nx=b.x-cx,nz=b.z-cz;const d=Math.hypot(nx,nz);if(d>=rr)return;
  if(d<1e-6){nx=-b.vx;nz=-b.vz;const l=Math.hypot(nx,nz)||1;nx/=l;nz/=l;}else{nx/=d;nz/=d;}
  b.x=cx+nx*rr;b.z=cz+nz*rr;const vn=b.vx*nx+b.vz*nz;if(vn<0){b.vx-=(1+e)*vn*nx;b.vz-=(1+e)*vn*nz;}}
function ballSeg(b,x1,z1,x2,z2,e){const dx=x2-x1,dz=z2-z1;let t=((b.x-x1)*dx+(b.z-z1)*dz)/(dx*dx+dz*dz);t=t<0?0:t>1?1:t;ballHit(b,x1+dx*t,z1+dz*t,BR,e);}
/* the goal nets catch the ball (soft), the posts are hard and bouncy */
function ballWalls(b){for(const G of GOALS){const bx=G.gx+G.s*1.2;
    ballSeg(b,G.gx,GZ1,bx,GZ1,.2);ballSeg(b,G.gx,GZ2,bx,GZ2,.2);ballSeg(b,bx,GZ1,bx,GZ2,.15);
    for(const pz of[GZ1,GZ2]){ballHit(b,G.gx,pz,BR+.08,.6);ballHit(b,bx,pz,BR+.06,.3);}}
  if(b.z>GZ1&&b.z<GZ2){if(b.x<-40.2+BR){b.x=-40.2+BR;b.vx=Math.abs(b.vx)*.15;}if(b.x>-9.8-BR){b.x=-9.8-BR;b.vx=-Math.abs(b.vx)*.15;}}
  else{if(b.x<-39.9){b.x=-39.9;b.vx=Math.abs(b.vx)*.6;}if(b.x>-10.1){b.x=-10.1;b.vx=-Math.abs(b.vx)*.6;}}
  if(b.z<59.3){b.z=59.3;b.vz=Math.abs(b.vz)*.6;}if(b.z>77.7){b.z=77.7;b.vz=-Math.abs(b.vz)*.6;}}
/* one shared ball: whoever kicked it last is in charge and tells everyone where it is */
const BS={k:0,mine:true,own:''};
function ballMine(){return !MP.grp||BS.mine;}
function ballKick(){BS.k++;BS.mine=true;BS.own=MP.me||'';}
function ballOwnerGone(){if(!BS.mine){BS.mine=true;BS.own=MP.me||'';}}
function ballFrom(a,bl){const b=LOC.city.ball;if(!b||!Array.isArray(bl)||bl.length<6)return;const [x,z,vx,vz,k]=bl,f=Number.isFinite,rs=f(bl[5])?bl[5]:0;
  if(!f(x)||!f(z)||!f(vx)||!f(vz)||!Number.isInteger(k)||k<0||k>1e9)return;
  const lead=.08,VX=clamp(vx,-20,20),VZ=clamp(vz,-20,20),X=clamp(x,-41,-9)+VX*lead,Z=clamp(z,59,78)+VZ*lead,RS=clamp(rs,0,3),cur=BS.mine?(MP.me||''):BS.own;
  if(k>BS.k||(k===BS.k&&a.peer!==cur&&a.peer>cur)){BS.k=k;BS.mine=false;BS.own=a.peer;const ex=X-b.x,ez=Z-b.z;if(Math.hypot(ex,ez)>1.5){b.x=X;b.z=Z;}else{b.x+=ex*.6;b.z+=ez*.6;}b.vx=VX;b.vz=VZ;b.reset=RS;b.cool=.35;return;}
  if(!BS.mine&&a.peer===BS.own&&k===BS.k){const ex=X-b.x,ez=Z-b.z;if(Math.hypot(ex,ez)>1.5){b.x=X;b.z=Z;}else{b.x+=ex*.5;b.z+=ez*.5;}b.vx=VX;b.vz=VZ;b.reset=RS;}}
function scoreFrom(a,sc){if(!Array.isArray(sc)||sc.length<3)return;const [l,r,v]=sc,ok=n=>Number.isInteger(n)&&n>=0&&n<1e6;if(!ok(l)||!ok(r)||!ok(v))return;
  const m=S.match||{l:0,r:0,v:0},mv=m.v||0;if(!(v>mv||(v===mv&&(l!==m.l||r!==m.r)&&a.peer>(MP.me||''))))return;
  const goal=l+r===m.l+m.r+1,blue=l>m.l;S.match={l:Math.min(l,999),r:Math.min(r,999),v};drawScore();change();if(!MP.ready)return;
  if(goal){SFX.yay();toast('⚽ '+a.nm+' scored for '+(blue?'Blue':'Pink')+'! Blue '+S.match.l+' – '+S.match.r+' Pink',3);fbCheer();}
  else if(l+r===0&&m.l+m.r>0)toast('🏆 '+a.nm+' started a new match! Blue 0 – 0 Pink',2.8);}
function updBall(dt){const b=LOC.city.ball;if(!b||!b.g)return;
  if(b.reset>0){b.reset-=dt;if(b.reset<=0){b.reset=0;b.x=-25;b.z=68.5;b.vx=b.vz=0;}}
  if(CUR.id==='city'&&PLAYING&&!b.reset){const dx=b.x-P.x,dz=b.z-P.z,d=Math.hypot(dx,dz);
    /* running into the ball kicks it (touch area a bit bigger than before; not while you hold the kick button) */
    if(d<.85&&b.cool<=0&&!KC.on){const sp=(P.run?10:6.5)+Math.random(),fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),nx=dx/(d||1),nz=dz/(d||1);[b.vx,b.vz]=aimGoal(b.x,b.z,(nx*.5+fx*.5)*sp,(nz*.5+fz*.5)*sp);b.cool=.3;SFX.kick();ballKick();}}
  b.cool-=dt;const spd=Math.hypot(b.vx,b.vz),n=Math.max(1,Math.ceil(spd*dt/.06)),h=dt/n;
  for(let i=0;i<n;i++){b.x+=b.vx*h;b.z+=b.vz*h;ballWalls(b);}
  const fr=Math.exp(-1.0*dt);b.vx*=fr;b.vz*=fr;
  const inGoal=b.z>GZ1&&b.z<GZ2&&(b.x<-39.1||b.x>-10.9);
  if(!b.reset&&inGoal&&ballMine()){b.reset=2.2;SFX.yay();const blue=b.x>-25;for(let i=0;i<5;i++)setTimeout(()=>floatText(pick(['⭐','🎉','✨']),b.x+rand(-1,1),1.2+rand(0,1),b.z+rand(-1,1),{h:.6}),i*120);
    if(!fbGoal(blue)){S.match=S.match||{l:0,r:0,v:0};S.match.v=(S.match.v||0)+1;if(blue)S.match.l++;else S.match.r++;drawScore();toast('⚽ GOAL for '+(blue?'Blue':'Pink')+'! Blue '+S.match.l+' – '+S.match.r+' Pink',3);addXP('sport',5);qEvent('goal');}}
  /* it really rolls: it turns around the flat axis across the way it moves */
  const v=Math.hypot(b.vx,b.vz);if(v>1e-3){BAX.set(b.vz/v,0,-b.vx/v);BQ.setFromAxisAngle(BAX,v*dt/BR);b.g.quaternion.premultiply(BQ);}b.g.position.set(b.x,BR,b.z);ballFx(b,dt);}
const BQ=new THREE.Quaternion(),BAX=new THREE.Vector3(),C_IDLE=new THREE.Color('#fff3c4'),C_SOFT=new THREE.Color('#ffd45c'),C_HARD=new THREE.Color('#ff6b4a');
/* gentle help: a goal roughly in front of the kick (within 45°) bends it a little toward the goal mouth (only at the kick, never a homing ball) */
const AG=[0,0];
function aimGoal(x,z,vx,vz){const sp=Math.hypot(vx,vz);AG[0]=vx;AG[1]=vz;if(sp<1e-3)return AG;let dx=vx/sp,dz=vz/sp;
  for(const G of GOALS){let gx=G.gx+G.s*.3-x,gz=(GZ1+GZ2)/2-z;const gl=Math.hypot(gx,gz);if(gl<.5)continue;gx/=gl;gz/=gl;const a=Math.acos(clamp(dx*gx+dz*gz,-1,1));if(a>=Math.PI/4)continue;
    const w=.4*Math.min(1,(Math.PI/4-a)/.45);dx=dx*(1-w)+gx*w;dz=dz*(1-w)+gz*w;const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;break;}
  AG[0]=dx*sp;AG[1]=dz*sp;return AG;}
/* the kick button: a quick tap is a soft pass, hold it and the power grows (let go = strong shot); the ball goes where you look */
const KR=2,KC={on:false,t:0,key:false,pid:null,eat:false,fill:false,deg:-1};
const BALLT={x:0,z:0,r:KR,icon:'⚽',label:()=>KC.on?'Let go to shoot! 💥':TOUCHY?'Tap: pass · Hold: shoot!':'E: pass · Hold E: shoot!',when:ballNear,pri:()=>true,act:()=>ballShoot(-1)};
function ballNear(){const b=LOC.city.ball;if(!b||!b.g||b.reset||CUR.id!=='city')return false;BALLT.x=b.x;BALLT.z=b.z;if(KC.on)return true;
  const dx=b.x-P.x,dz=b.z-P.z,d=Math.hypot(dx,dz);return d>=1||d<.6||-dx*Math.sin(P.yaw)-dz*Math.cos(P.yaw)>d*.2;}
function kickPow(){return clamp((KC.t-.3)/.8,0,1);}
function ballHold(key,pid){if(KC.on||TARGET!==BALLT)return;KC.on=true;KC.t=0;KC.key=key;KC.pid=pid;KC.eat=!key;KC.fill=true;
  const l=$('actLbl');l.style.minWidth=l.getBoundingClientRect().width+'px';}/* the label keeps its width while you hold, so the button stays under your thumb */
/* the hold ends: clear the orange fill and the fixed label width */
function kcClr(){KC.fill=false;KC.deg=-1;$('act').style.backgroundImage='';$('actLbl').style.minWidth='';}
function ballLet(){if(!KC.on)return;KC.eat=!KC.key;ballShoot(KC.t<.3?-1:kickPow());}
function ballShoot(p){const b=LOC.city.ball;KC.on=false;KC.key=false;KC.pid=null;
  if(!b||!b.g||b.reset||CUR.id!=='city'||!PLAYING||UI.open||Math.hypot(b.x-P.x,b.z-P.z)>KR+.6)return;
  const sp=p<0?5.2:5.2+10.8*p;[b.vx,b.vz]=aimGoal(b.x,b.z,-Math.sin(P.yaw)*sp,-Math.cos(P.yaw)*sp);b.cool=.35;ballKick();SFX.kick();if(p>=.5)SFX.shot();
  floatText(p<.2?'👟':p>=.95?'💥 Wow!':'💥',b.x,.7,b.z,{h:p<.2?.3:.42,life:1});}
/* glow + aim arrow while you can kick; the ⚽ button fills up while you hold it */
function ballFx(b,dt){const F=b.fx,A=$('act');if(KC.on){KC.t+=dt;const far=Math.hypot(b.x-P.x,b.z-P.z)>KR+1.5;if(TARGET!==BALLT||b.reset||!PLAYING||UI.open||CUR.id!=='city'||far){KC.on=false;if(far&&!b.reset&&PLAYING&&!UI.open)toast('The ball rolled away! Run after it 🏃',1.6);}}
  const on=PLAYING&&CUR.id==='city'&&TARGET===BALLT&&!b.reset;F.g.visible=on;b.m.emissiveIntensity=0;
  if(KC.fill&&!KC.on)kcClr();if(!on)return;
  const pu=Math.sin(performance.now()/160),p=KC.on?kickPow():0,ag=aimGoal(b.x,b.z,-Math.sin(P.yaw),-Math.cos(P.yaw)),ax=ag[0],az=ag[1],fm=F.arrow.material[1];
  F.g.position.set(b.x,0,b.z);F.ring.scale.setScalar(1+pu*.07);F.ring.material.opacity=.6+pu*.25;b.m.emissiveIntensity=.14+pu*.08;
  F.arrow.rotation.y=Math.atan2(ax,az);ballArrow(F.arrow,KC.on?Math.round((1+3.2*p)*20)/20:.9);if(KC.on)fm.color.copy(C_SOFT).lerp(C_HARD,p);else fm.color.copy(C_IDLE);
  if(KC.on){const dg=Math.round(p*360);if(dg!==KC.deg){KC.deg=dg;A.style.backgroundImage=dg?'conic-gradient(#ff8a5c '+dg+'deg,transparent 0)':'';}}}
/* ---- ⚽ Football friends: four kids at the field every day 14:00–19:00. ⚡ Zoomy Zac is the star (gold 10 on his back, "Zoom zoom, GOAL!",
   a goal dance), with Tilly, Omar and Bea. On their own they play 2 vs 2 with the town ball (Blue: Zac + Tilly, Pink: Omar + Bea) and the
   scoreboard shows their game. Walk onto the field and Zac asks: take the field (you + Zac vs Omar + Bea), a 1 vs 1 with him, or "Can I
   practice?" (a juice break on the team bench across from the scoreboard; from there you can invite Zac to a 1 vs 1). Kind for little
   players: the other side lets you dribble, your team-mate passes to you a lot, Zac sometimes misses or gets tired.
   They live in your own game only: when a friend online comes near the field they sit down and cheer, so they never fight a real player
   for the ball, and the shared score (S.match) is never touched by their goals ---- */
const FB_ON=14,FB_OFF=19,FBB=[-28.4,-25.4],FBZ=78.4,FBG=[[-31,59],[-19,59]];   /* (two benches 3 m apart, two kids on each with room between them) */
const FB_SPOT={play:[[-28.5,66.5],[-33,71],[-21.5,70.5],[-17,66]],team:[[-28,64.5],0,[-21,70.5],[-17.5,66.5]],duel:[[-20.5,68.5],0,0,0]};
const FBK=[{nm:'Zoomy Zac',star:1,home:'hS2',seat:3,sp:3.9,jc:'#ffd45c',lk:{skin:'#f1c9a5',hair:'#5a3a24',style:'short',swoop:1,top:'#3f7be0',sleeve:'#ffd45c',bottom:'#ffffff',shoes:'#ffd45c',eyes:'sparkle',mouth:'grin',scale:.93}},
  {nm:'Tilly',home:'hS1',seat:0,sp:3.3,jc:'#7fdcb5',lk:{skin:'#f6d3bb',hair:'#e8734a',style:'ponytail',top:'#7cc8ff',bottom:'#3f4c86',shoes:'#ffffff',eyes:'happy',scale:.88}},
  {nm:'Omar',home:'hS3',seat:1,sp:3.3,jc:'#ff8a6b',lk:{skin:'#c98d63',hair:'#1f1a2e',style:'curly',top:'#ff8a6b',bottom:'#3d4a7a',shoes:'#2e2347',scale:.9}},
  {nm:'Bea',home:'aptW',seat:2,sp:3.2,jc:'#ff7aa8',lk:{skin:'#8a5a3c',hair:'#2e2347',style:'pigtails',top:'#ff9ec4',bottom:'#ffffff',shoes:'#ff7aa8',eyes:'sparkle',scale:.86}}];
/* mode: '' gone · play (on their own) · rest (a short sit after their own game) · team / duel (a match with you) · juice (you practice) · watch (a friend online is here) · home (going home) */
const FB={k:[],mode:'',sc:[0,0],t0:0,go:0,me:0,meT:9,kk:0,last:-2,seen:0,away:0,wt:0,hold:0,at:0,af:null,rs:0,lastM:'team',mk:null,ini:0};
function fbS(){return S.fb||(S.fb={w:0});}   /* saved: w = your wins, c = the day of the last win coins, m = met Zac */
const fbBoard=()=>FB.mode==='play'||FB.mode==='team'||FB.mode==='duel';   /* the scoreboard shows the kids' game */
const fbIn=(x,z,m)=>x>-39-m&&x<-11+m&&z>59.6-m&&z<77.4+m;   /* on the field (+ m metres around it) */
const fbNear=(x,z,r)=>CUR.id==='city'&&Math.hypot(x-P.x,z-P.z)<r;
function fbSeen(x,z){return CUR.id==='city'&&PLAYING&&Math.hypot(x-camera.position.x,z-camera.position.z)<55&&inView(x,z,1.5);}
function fbFriend(){if(!MP.grp)return null;for(const a of MP.peers.values())if(a.loc==='city'&&Math.hypot(Math.max(0,-39-a.rx,a.rx+11),Math.max(0,59.6-a.rz,a.rz-77.4))<10)return a;return null;}
const fbSeat=k=>[FBB[k.d.seat>>1]+(k.d.seat&1?.5:-.5),FBZ+.06];
/* the gold 10 on Zac's back (reads right from behind) and his white sweatband */
function fbTen(p){const c='#ffd45c',o={ol:false};box(p.b,.04,.2,.012,c,.075,.74,-.138,o);
  for(const [w,h,x,y] of [[.035,.2,-.02,.74],[.035,.2,-.12,.74],[.135,.035,-.07,.74],[.135,.035,-.07,.905]])box(p.b,w,h,.012,c,x,y,-.138,o);
  box(p.head,.62,.07,.6,'#ffffff',0,.27,0,{ol:false});}
function fbBuild(){const C=LOC.city;for(const bx of FBB)col(C,bx-.85,FBZ-.25,bx+.85,FBZ+.3);   /* the team bench itself is drawn with the field */
  FBK.forEach((d,i)=>{const p=makePerson(d.lk),sc=d.lk.scale;if(d.star)fbTen(p);bakePerson(p);
    const tag=label(d.star?'⚡ '+d.nm:d.nm,.3);tag.position.y=1.62*sc+.32;p.root.add(tag);
    const j=new THREE.Group();box(j,.1,.14,.07,d.jc,0,-.07,0,{ol:.012});box(j,.104,.04,.074,'#ffffff',0,-.01,0,{ol:false});cyl(j,.009,.009,.1,'#ffffff',.025,.07,0,{seg:5,ol:false});bake(j,false);
    j.position.set(0,-.52,.1);j.visible=false;p.arms[0].add(j);p.root.visible=false;scene.add(p.root);   /* 🧃 a tiny juice box in the right hand */
    const k={i,d,p,tag,j,x:0,z:0,face:0,st:'off',path:[],next:'',tm:0,cd:0,plan:null,stuck:0,slow:0,slowT:rand(6,11),cheer:0,dance:0,sip:rand(1,4),bub:null,bubT:0,mv:false,spd:0};
    k.tg={x:0,z:0,r:2.2,icon:()=>fbIcon(k),label:()=>fbLabel(k),act:()=>fbTap(k),obj:p.root};FB.k.push(k);});
  const mk=label('🎯 Score here!',.55);mk.position.set(-10.5,3.05,68.5);mk.visible=false;mk.material.depthTest=false;mk.renderOrder=5;scene.add(mk);FB.mk=mk;}   /* (drawn over the kids' name tags: never covered) */
/* the way home and back: along the town's sidewalks (the walkers' paths) to the field gate between the scoreboard and a bench */
function fbRoute(h){const F=WPN.field,out=[];let n=WPN[h];for(let g=0;g<60&&n!==F&&n!==undefined;g++){out.push(WP[n]);n=NEXT[n][F];}return out;}
function fbArrive(k){const r=fbRoute(k.d.home),g=FBG[(r[r.length-1]||[-30])[0]<-25?0:1];
  [k.x,k.z]=r[0]||g;k.path=[...r.slice(1),g,FB_SPOT.play[k.i]].map(q=>[q[0],q[1]]);k.next='play';k.st='walk';k.tm=k.i<2?1:-1;k.plan=null;}
function fbStand(k){if(k.st==='sit'){k.j.visible=false;for(const l of k.p.legs)l.rotation.x=0;for(const a of k.p.arms)a.rotation.set(0,0,0);}k.cheer=k.dance=0;}
function fbGoTo(k,pts,next){if(k.st==='off')return;const p=pts.map(q=>[q[0],q[1]]);if(k.st==='sit')p.unshift([k.x,77.4]);fbStand(k);k.path=p;k.next=next;k.st='walk';k.plan=null;}
function fbBench(k){if(k.st==='off'||k.st==='sit'||k.next==='sit')return;const s=fbSeat(k),q=[[s[0],77.45],s];
  if(k.st==='walk'&&k.next==='play')k.path.pop(),k.path.push(...q),k.next='sit';else fbGoTo(k,q,'sit');}
function fbArrived(k){const n=k.next;k.path=[];k.next='';if(n==='gone'){k.st='off';fbBubOff(k);k.p.root.visible=false;return;}
  if(n==='sit'){k.st='sit';[k.x,k.z]=fbSeat(k);k.face=Math.PI;k.j.visible=true;k.sip=rand(1,3);return;}k.st='play';}
/* walking: nobody sees it? A walk home ends at once and a walk to the field jumps ahead to the last spot nobody sees */
function fbWalk(k,dt){if(k.next==='gone'&&!fbSeen(k.x,k.z)){fbArrived(k);return;}
  while(k.path.length&&!fbSeen(k.x,k.z)&&!fbSeen(k.path[0][0],k.path[0][1]))[k.x,k.z]=k.path.shift();
  if(!k.path.length){fbArrived(k);return;}
  if(fbMove(k,k.path[0][0],k.path[0][1],2.3,dt)<.12){k.path.shift();if(!k.path.length)fbArrived(k);}}
function fbMove(k,tx,tz,sp,dt){const dx=tx-k.x,dz=tz-k.z,d=Math.hypot(dx,dz);k.mv=d>.06&&sp>0;k.spd=sp;
  if(k.mv){const s=Math.min(d,sp*dt);k.x+=dx/d*s;k.z+=dz/d*s;if(d>.15)k.face=Math.atan2(dx,dz);}return d;}
function fbKeep(k){k.x=clamp(k.x,-39.5,-10.5);k.z=clamp(k.z,59.4,77.6);if((k.x<-38.8||k.x>-11.2)&&k.z>65.7&&k.z<71.3)k.x=clamp(k.x,-38.8,-11.2);}
/* the clock: they come at 14:00 (from their homes, or straight onto the field when nobody sees it) and go home at 19:00 */
function fbClock(){const due=S.time>=FB_ON&&S.time<FB_OFF,m=FB.mode;
  if(due&&!m){FB.mode='play';FB.sc=[0,0];FB.me=0;FB.go=1;FB.seen=0;drawScore();FB.k.forEach(fbArrive);FB.tell=S.time<FB_ON+.3?1:0;}
  else if(!due&&(m==='play'||m==='rest'||m==='juice'||m==='watch'))fbHome();
  else if(m==='home'&&FB.k.every(k=>k.st==='off')){FB.mode='';drawScore();}
  if(!FB.tell)return;if(S.time>=FB_ON+1||FB.mode==='home'||!FB.mode){FB.tell=0;return;}   /* "they are here!" waits for a free moment in town (not in the middle of the Pet Show, a card or a lesson), until 15:00 */
  if(CUR.id==='city'&&PLAYING&&S.intro&&!CUT&&!UI.open&&!fading&&!TUT&&!DTUT){FB.tell=0;toast('⚽ The football friends are at the field until 19:00. Come and play!',3.4,1);}}
function fbHome(){FB.mode='home';FB.at=0;FB.af=null;fbHudOff();drawScore();
  for(const k of FB.k){if(k.st==='off')continue;const r=fbRoute(k.d.home).reverse();fbGoTo(k,[FBG[(r[0]||[-30])[0]<-25?0:1],...r],'gone');}}
function fbFree(){FB.mode='play';FB.sc=[0,0];FB.me=0;FB.go=1.5;FB.at=0;FB.af=null;FB.wt=0;fbHudOff();drawScore();
  FB.k.forEach((k,i)=>{if(k.st==='walk'&&k.next==='play')return;k.tm=i<2?1:-1;fbGoTo(k,[FB_SPOT.play[i]],'play');});}
function fbRest(){FB.mode='rest';drawScore();FB.k.forEach(fbBench);FB.at=rand(18,28);FB.af=fbFree;}
function fbWatch(){FB.mode='watch';FB.wt=0;FB.at=0;FB.af=null;drawScore();FB.k.forEach(fbBench);fbSay(FB.k[0],'A friend is here! We\'ll cheer! 📣');}
function fbAfter(){if(S.time>=FB_OFF||S.time<FB_ON)fbHome();else fbFree();}
function fbWhyNot(){if(!FB.mode||FB.mode==='home')return'⚽ The football friends went home. Come back tomorrow from 14:00!';
  const f=fbFriend();return f?'⚽ '+f.nm+' is at the field! Play together, and try again later. 😊':'';}
/* ---- the game: kick-off spots, who runs to the ball, passes, shots ---- */
function fbSpot(k){const s=FB_SPOT[FB.mode==='team'||FB.mode==='duel'?FB.mode:'play'][k.i];return s||[k.x,k.z];}
function fbAI(k,dt,b){const dir=k.tm,own=dir>0?-39:-11,star=k.d.star,match=FB.me!==0;
  if(star&&(k.slowT-=dt)<=0){k.slowT=rand(8,13);k.slow=2.4;if(fbNear(k.x,k.z,25))floatText('💦',k.x,2,k.z,{h:.4});}if(k.slow>0)k.slow-=dt;
  let sp=k.d.sp*(k.slow>0?.6:1)*(match&&dir!==FB.me?.9:1);
  if(FB.go>0||b.reset>0){const s=fbSpot(k);return[s[0],s[1],2.4];}
  const dk=Math.hypot(b.x-k.x,b.z-k.z),meD=Math.hypot(b.x-P.x,b.z-P.z);
  let chase=true;for(const q of FB.k)if(q!==k&&q.st==='play'&&q.tm===dir&&Math.hypot(b.x-q.x,b.z-q.z)<dk-.4){chase=false;break;}
  if(FB.me===dir&&meD<dk-.6)chase=false;
  /* you have the ball (touched it just now): the other side does not take it away, it stays in front of its goal */
  if(FB.meT<1.2&&meD<2.4&&FB.me!==dir){if(!chase)return fbHelp(k,b,dir,own,sp);let ux=own-b.x,uz=68.5-b.z;const l=Math.hypot(ux,uz)||1;k.plan=null;return[b.x+ux/l*1.9,b.z+uz/l*1.9,sp*.55];}
  if(!chase){k.stuck=0;return fbHelp(k,b,dir,own,sp);}
  if(dk>3.2||(k.plan&&(k.plan.t-=dt)<=0))k.plan=null;
  if(!k.plan&&dk<=3.2)k.plan=fbPlan(k,b,dir);
  if(!k.plan)return[clamp(b.x+b.vx*.4,-39.4,-10.6),clamp(b.z+b.vz*.4,59.5,77.5),sp];
  const pl=k.plan;let ux=pl.ax-b.x,uz=pl.az-b.z;const ul=Math.hypot(ux,uz)||1;ux/=ul;uz/=ul;
  const rx=k.x-b.x,rz=k.z-b.z,ahead=rx*ux+rz*uz;let tx=b.x-ux*.45,tz=b.z-uz*.45;
  if(ahead>-.1&&dk<1.6){const s=(rx*uz-rz*ux)>0?1:-1;tx+=uz*s*.75;tz-=ux*s*.75;}   /* on the wrong side of the ball: walk around it */
  k.stuck=dk<1.2?k.stuck+dt:0;
  if(k.cd<=0&&!b.reset&&dk<.72&&(ahead<.15||k.stuck>2.5))fbKick(k,b,k.stuck>2.5?{k:'drib',ax:-25,az:68.5,sp:5}:pl);
  return[tx,tz,sp];}
/* not the one at the ball: run forward for a pass when your side has it, else go back between the ball and your goal */
function fbHelp(k,b,dir,own,sp){let best=1e9,side=0;const cnt=(x,z,t)=>{const d=Math.hypot(b.x-x,b.z-z);if(d<best){best=d;side=t;}};
  for(const q of FB.k)if(q.st==='play')cnt(q.x,q.z,q.tm);if(FB.me)cnt(P.x,P.z,FB.me);
  if(side===dir)return[clamp(b.x+dir*6.5,-37.5,-12.5),clamp(b.z>68.5?b.z-4.5:b.z+4.5,61,76),sp*.8];
  return[lerp(own,b.x,.5),lerp(68.5,b.z,.6),sp*.75];}
function fbPlan(k,b,dir){const att=dir>0?-11:-39,star=k.d.star;
  if(Math.hypot(att-b.x,68.5-b.z)<(star?11.5:9)){let az=rand(GZ1+.5,GZ2-.5);const miss=Math.random()<(star?.25:.4);if(miss)az+=(Math.random()<.5?-1:1)*rand(2.7,4);   /* sometimes it goes wide */
    return{k:'shot',ax:att,az,sp:rand(9.5,12.5),t:1.8,miss};}
  if(FB.me===dir){const d=Math.hypot(P.x-b.x,P.z-b.z);if(d>2.5&&d<17&&Math.random()<(FB.mode==='team'?.75:.5))return{k:'pass',me:1,ax:P.x-Math.sin(P.yaw)*.7,az:P.z-Math.cos(P.yaw)*.7,sp:clamp(d*1.1+1.6,4,11),t:1.8};}
  for(const q of FB.k)if(q!==k&&q.st==='play'&&q.tm===dir){const d=Math.hypot(q.x-b.x,q.z-b.z);if(d>3&&d<15&&(q.x-b.x)*dir>-1&&Math.random()<.35)return{k:'pass',ax:q.x+dir*.8,az:q.z,sp:clamp(d*1.1+1.6,4,11),t:1.8};}
  return{k:'drib',ax:b.x+dir*4,az:clamp(b.z+(68.5-b.z)*.3+rand(-1.6,1.6),60.5,76.5),sp:k.d.sp+1.5,t:1};}
function fbKick(k,b,pl){let ux=pl.ax-b.x,uz=pl.az-b.z;const l=Math.hypot(ux,uz)||1;b.vx=ux/l*pl.sp;b.vz=uz/l*pl.sp;b.cool=.25;
  ballKick();FB.kk=BS.k;FB.last=k.i;k.cd=pl.k==='drib'?.45:.9;k.plan=null;k.stuck=0;
  if(fbNear(b.x,b.z,28)){SFX.kick();if(pl.k==='shot')SFX.shot();}
  if(pl.me&&cool('fbpass',5))fbSay(k,pick(['Here you go! ⚽','Your turn! 👟','Pass! Now shoot! 💥']));
  if(pl.miss&&k.d.star)setTimeout(()=>{if(k.st==='play')fbSay(k,pick(['Oops! 😅','Whoops, too wide! 🙈']));},900);}
/* a goal while the kids play (called by updBall): their own score, kind words, Zac's dance; false = a normal goal for the shared score */
function fbGoal(blue){if(!fbBoard()){fbCheer();return false;}
  const w=FB.last,tm=blue?1:-1,me=w===-1,K=FB.k,near=fbNear(-25,68.5,FB.me||me?60:30);   /* their own game only makes noise when you are close by */FB.sc[blue?0:1]++;drawScore();fbHudUpd();
  const sc=FB.mode==='duel'?'You '+FB.sc[0]+' – '+FB.sc[1]+' Zac':'Blue '+FB.sc[0]+' – '+FB.sc[1]+' Pink';
  if(me){addXP('sport',5);qEvent('goal');}
  if(near){if(me&&FB.me===tm){const z=FB.mode==='team'?K[0]:K[1];const t=pick(['What a shot! 🌟','Super goal! ⭐','Wow, you did it! 🎉','High five! 🙌']);fbSay(z,t);toast('⚽ GOAL! '+t+' '+sc,3);}
    else if(me&&FB.me)toast('😅 Oops, the wrong goal! That\'s okay! '+sc,3);
    else if(me){fbSay(K[0],'Wow, what a kick! Play with us? 😄');toast('⚽ What a kick! '+sc,3);}
    else if(w>=0&&K[w].tm===tm&&K[w].d.star){K[0].dance=1.8;fbSay(K[0],'Zoom zoom, GOAL! ⚡');floatText('🕺',K[0].x,2.75,K[0].z,{h:.6,life:1.8,top:1});toast('⚡ Zoomy Zac: “Zoom zoom, GOAL!” '+sc,3);}
    else if(w>=0&&K[w].tm===tm)toast('⚽ '+K[w].d.nm+' scored! '+sc,2.6);
    else toast('⚽ Goal! '+sc,2.6);
    if(FB.me&&tm!==FB.me&&FB.mode==='team')setTimeout(()=>{if(FB.mode==='team')fbSay(K[0],pick(['Nice try! We\'ll get the next one! 💪','Don\'t worry, let\'s go again! ⚡']));},1300);}
  for(const k of K)if(k.st==='play'&&k.tm===tm&&!k.dance)k.cheer=1.3;fbCheer();
  if(Math.max(FB.sc[0],FB.sc[1])>=3&&!FB.af){FB.at=2.6;FB.af=FB.mode==='play'?fbRest:()=>fbEnd('done');}
  return true;}
function fbCheer(){let any=0;for(const k of FB.k)if(k.st==='sit'){k.cheer=1.4;any=1;}if(any&&fbNear(-26.9,FBZ,30))floatText(pick(['🎉','📣','👏']),-26.9,2,FBZ,{h:.5});}
/* ---- talking: the card, the bench, saying bye ---- */
function fbTgOn(k){return k.st!=='off'&&k.p.root.visible&&!((FB.mode==='team'||FB.mode==='duel')&&k.st==='play');}
function fbLabel(k){const m=FB.mode,bn=k.st==='sit'||k.next==='sit';if(m==='home')return'Say bye to '+k.d.nm;if(bn&&k.d.star&&m==='juice')return'Invite Zoomy Zac to a 1\u00a0vs\u00a01';
  if(bn&&m!=='rest')return'Say hi to '+k.d.nm;return'Talk to the team';}
function fbIcon(k){const c=fbLabel(k)[0];return c==='I'?'🥇':c==='T'?'⚽':'👋';}
function fbTap(k){const m=FB.mode,bn=k.st==='sit'||k.next==='sit';k.p.wave=1.2;SFX.talk();
  if(m==='home'){toast('👋 '+k.d.nm+': “'+pick(['See you tomorrow! 👋','Bye bye! Time for dinner! 🍝','Bye! Come and play tomorrow! ⚽'])+'”',3);return;}
  if(bn&&m==='juice'&&k.d.star){fbStart('duel');return;}
  if(bn&&m!=='rest'){const L=m==='juice'?['Mmm, apple juice! 🧃','Juice breaks are the best! 😋','Show us your best kick! ⚽','We\'re cheering for you! 📣']:m==='watch'?['Your friend plays so well! 👀','We\'re watching you two play! 📣','Go, go, go! 🎉']:['Go, go, go! 📣','You can do it! ⭐','Woohoo! ⚽'];
    toast('🧃 '+k.d.nm+': “'+pick(L)+'”',3);return;}
  fbCard();}
function fbCard(){const Z=FB.k[0],s=S.fb||{},f=fbFriend();FB.hold=1;Z.p.wave=1.2;SFX.talk();
  for(const k of FB.k)if(k.st==='play')k.face=Math.atan2(P.x-k.x,P.z-k.z);
  const who='<div class="who" style="--c:#ffd45c">⚡ Zoomy Zac</div>',o={bottom:true,onClose:()=>{FB.hold=0;}};
  if(f||FB.mode==='watch'){openPanel(who+`<p class="line">${f?'Your friend '+esc(f.nm)+' is here! Play together! ':''}We'll watch and cheer for you! 📣</p><div class="row"><button class="btn mint" data-a="close">OK! ⚽</button></div>`,o);return;}
  const first=!s.m;if(first){fbS().m=1;change();}
  openPanel(who+`<p class="line">${first?'Hi! I\'m Zoomy Zac! ⚡ These are my football friends: Tilly, Omar and Bea. ':'Hi '+esc(S.name||'friend')+'! '}Do you want to take the field, or a 1&nbsp;vs&nbsp;1?</p>
    ${s.w?`<p class="note" style="text-align:center">🏆 Your wins: <b>${s.w}</b></p>`:''}
    <div class="row"><button class="btn mint" data-a="fbTeam">⚽ Take the field</button><button class="btn butter" data-a="fbDuel">🥇 1&nbsp;vs&nbsp;1 with Zac</button><button class="btn sky" data-a="fbJuice">🧃 Can I practice?</button><button class="btn white" data-a="close">Maybe later</button></div>`,o);}
function fbJuice(){closePanel();FB.hold=0;const why=fbWhyNot();if(why){toast(why,3.2);return;}
  FB.mode='juice';FB.away=0;FB.at=0;FB.af=null;drawScore();FB.k.forEach(fbBench);SFX.pop();
  toast('⚡ Zoomy Zac: “Sure! We need a juice break! 🧃” The field and the ball are all yours!',3.6);fbSay(FB.k[0],'Juice break! 🧃');}
/* ---- a match with you: you are always BLUE and shoot into the goal with the 🎯 (east); first to 3 goals, or 3 game hours ---- */
function fbStart(m){closePanel();FB.hold=0;const why=fbWhyNot();if(why){toast(why,3.2);return;}
  fade(()=>{if(CUR.id!=='city'||fbWhyNot())return;const b=LOC.city.ball;
    FB.mode=m;FB.lastM=m;FB.sc=[0,0];FB.t0=S.day*24+S.time;FB.go=2.2;FB.me=1;FB.meT=9;FB.at=0;FB.af=null;
    if(DECO.on)decoEnd();if(P.ride)stopRide();P.sit=null;P.x=-30.5;P.z=68.5;P.yaw=-Math.PI/2;P.pitch=-.12;
    ballKick();FB.kk=BS.k;b.x=-25;b.z=68.5;b.vx=b.vz=0;b.reset=0;b.cool=0;
    FB.k.forEach((k,i)=>{const s=FB_SPOT[m][i];fbStand(k);fbBubOff(k);k.plan=null;k.path=[];k.next='';k.p.root.visible=true;
      if(s){k.tm=m==='duel'?-1:i<2?1:-1;k.st='play';[k.x,k.z]=s;k.face=k.tm>0?Math.PI/2:-Math.PI/2;}
      else{k.tm=0;k.st='sit';[k.x,k.z]=fbSeat(k);k.face=Math.PI;k.j.visible=true;}});
    fbHud().hidden=false;document.body.classList.add('fbOn');fbHudUpd();FB.mk.visible=true;drawScore();SFX.whistle();
    toast(m==='team'?'⚽ You and Zac are BLUE! Kick the ball into the goal with the 🎯. First to 3 goals wins!':'🥇 You vs Zoomy Zac! Kick the ball into the goal with the 🎯. First to 3 goals wins!',4);});}
function fbEnd(why){const m=FB.mode;if(m!=='team'&&m!=='duel')return;const [a,c]=FB.sc;FB.me=0;FB.at=0;FB.af=null;fbHudOff();
  if(why==='done'){const s=fbS(),won=a>c,draw=a===c,duel=m==='duel';let coin=false;addXP('sport',6);
    if(won){s.w=(s.w||0)+1;if(s.c!==S.day){s.c=S.day;S.coins+=10;coin=true;SFX.coin();}SFX.yay();}change();
    const line=won?(duel?`You beat me ${a} – ${c}! 🏆 Wow, you're super fast!`:`Hooray! We won ${a} – ${c}! 🏆 You're a real football star!`):draw?`A draw, ${a} – ${c}! Everybody wins today! 🤝`
      :duel?`Zoom zoom! I won ${c} – ${a} this time. You played great! 💪`:`Aww, Pink won ${c} – ${a}. What a match! We'll win next time! 💪`;
    const late=S.time>=FB_OFF||S.time<FB_ON;   /* after 19:00 they go home: no "play again" */
    if(!UI.open)openPanel(`<div class="who" style="--c:#ffd45c">⚡ Zoomy Zac</div><p class="line">${line}${late?' Now it\'s time to go home. See you tomorrow! 👋':''}</p>${coin?'<p class="note" style="text-align:center">+10 🪙 for your first win today!</p>':''}
      <div class="row">${late?'':'<button class="btn mint" data-a="fbAgain">⚽ Play again</button>'}<button class="btn white" data-a="close">Bye bye!</button></div>`,{bottom:true});
    else toast('⚡ Zoomy Zac: “'+line+'”',4);}
  else toast(why==='stop'?'⚽ Thanks for playing! See you on the field! 👋':why==='friend'?'👋 A friend came to the field! Play together! 😊':'⚽ You left the field, so the match is over. Come back soon! 👋',3.4);
  fbAfter();}
function fbHud(){let h=$('fbHud');if(h)return h;
  const st=document.createElement('style');st.textContent='#fbHud{pointer-events:auto;display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;background:var(--paper);color:var(--ink);border:3px solid var(--line);border-radius:24px;box-shadow:0 4px 0 var(--soft);padding:4px 5px 4px 12px;font-weight:800;font-size:19px;max-width:100%}#fbHud[hidden]{display:none}#fbTxt{white-space:nowrap}#fbStop{min-height:44px;padding:4px 14px;font-size:17px}@media (max-height:500px){body.fbOn #pad{display:none}}';   /* short phone screens: no notepad during a match, so the column fits */document.head.appendChild(st);
  h=document.createElement('div');h.id='fbHud';h.hidden=true;h.innerHTML='<b id="fbTxt"></b><button class="btn white" id="fbStop" aria-label="Stop the match">✋ Stop</button>';$('left').insertBefore(h,$('tasks'));
  $('fbStop').addEventListener('click',()=>{audioInit();SFX.tap();fbEnd('stop');});return h;}
function fbHudUpd(){const t=$('fbTxt');if(t)t.textContent=FB.mode==='duel'?'🥇 You '+FB.sc[0]+' – '+FB.sc[1]+' Zac':'⚽ Blue '+FB.sc[0]+' – '+FB.sc[1]+' Pink';}
function fbHudOff(){const h=$('fbHud');if(h)h.hidden=true;document.body.classList.remove('fbOn');if(FB.mk)FB.mk.visible=false;}
function fbSay(k,txt,t){if(!fbNear(k.x,k.z,32))return;fbBubOff(k);const b=label(txt,.3);b.userData.bub=1;b.position.y=k.tag.position.y+.42;k.p.root.add(b);k.bub=b;k.bubT=3;
  if(t)toast((k.d.star?'⚡ ':'')+k.d.nm+': “'+txt+'”',3.2);}
function fbBubOff(k){if(!k.bub)return;k.p.root.remove(k.bub);k.bub.material.map.dispose();k.bub.material.dispose();k.bub=null;}
/* ---- every frame ---- */
function fbTick(dt){if(!FB.k.length||!S)return;const m0=FB.mode,b=LOC.city.ball;fbClock();
  if(CUR.id!=='city'){for(const k of FB.k){if(k.st==='walk')fbWalk(k,dt);k.p.root.visible=false;}if(m0==='team'||m0==='duel')fbEnd('left');return;}
  if(!FB.ini){FB.ini=1;if(fbIn(P.x,P.z,1.5))FB.seen=1;}   /* a game loaded right on the field: no card until you come again */
  if(BS.k!==FB.kk){FB.kk=BS.k;if(BS.mine){FB.last=-1;FB.meT=0;}}FB.meT+=dt;   /* your own kicks (the kids note theirs in fbKick) */
  if(b.reset>0)FB.rs=1;else if(FB.rs){FB.rs=0;FB.go=Math.max(FB.go,1.1);}if(FB.go>0&&!b.reset)FB.go-=dt;
  if(FB.hold&&!UI.open)FB.hold=0;
  if(FB.at>0&&(FB.at-=dt)<=0&&FB.af){const f=FB.af;FB.af=null;f();}
  const m=FB.mode,fr=fbFriend();
  if((m==='play'||m==='rest')&&fr)fbWatch();
  else if(m==='watch'){if(fr)FB.wt=0;else if((FB.wt+=dt)>3)fbFree();}
  else if(m==='juice'){if(fbIn(P.x,P.z,8))FB.away=0;else if((FB.away+=dt)>12)fbFree();}
  else if(m==='team'||m==='duel'){if(!FB.af){if(S.day*24+S.time-FB.t0>=3||S.time>=20)fbEnd('done');else if(!fbIn(P.x,P.z,9))fbEnd('left');else if(fr)fbEnd('friend');}}
  /* walk onto the field while they play: Zac asks you to join */
  if(!fbIn(P.x,P.z,14))FB.seen=0;
  else if(!FB.seen&&(m==='play'||m==='rest')&&fbIn(P.x,P.z,1.5)&&PLAYING&&S.intro&&!UI.open&&!CUT&&!CR&&!DECO.on&&!TUT&&!DTUT&&!CLIMB&&!fading&&!P.ride&&!P.sit&&!dlCarrying()&&FB.k[0].st!=='walk'&&FB.k[0].st!=='off'){FB.seen=1;fbCard();}
  /* far away nobody sees them: they wait (no ball kicks, so the shared ball stays still online) */
  const run=Math.hypot(P.x+25,P.z-68.5)<75;
  for(const k of FB.k)fbKid(k,dt,b,run);fbSep();fbTags();}
function fbKid(k,dt,b,run){if(k.st==='off'){k.p.root.visible=false;return;}if(k.cd>0)k.cd-=dt;if(k.bubT>0&&(k.bubT-=dt)<=0)fbBubOff(k);
  const mt=FB.mode==='team'||FB.mode==='duel',stop=FB.hold||!run||(mt&&(UI.open||fading));k.mv=false;
  if(k.st==='walk')fbWalk(k,dt);else if(k.st==='play'&&!stop){const t=fbAI(k,dt,b);fbMove(k,t[0],t[1],t[2],dt);fbKeep(k);}
  if(k.st==='off')return;
  const p=k.p,a=p.arms,sc=k.d.lk.scale,far=Math.hypot(k.x-camera.position.x,k.z-camera.position.z)>55;p.root.visible=!far;
  k.tg.x=k.x;k.tg.z=k.st==='sit'?k.z-.75:k.z;if(far)return;let y=0;
  if(k.st==='sit'){y=.55-.62*sc;for(const l of p.legs)l.rotation.x=-1.45;k.face=Math.PI;
    if(k.cheer>0){k.cheer-=dt;a[0].rotation.set(0,0,-2.5);a[1].rotation.set(0,0,2.5);y+=Math.abs(Math.sin(k.cheer*10))*.06;}
    else{const s0=k.sip;k.sip-=dt;let up=0;if(s0>=0&&k.sip<0&&fbNear(k.x,k.z,6))SFX.sip();if(k.sip<0){up=Math.sin(Math.min(1,-k.sip/1.4)*Math.PI);if(k.sip<-1.4)k.sip=rand(3,7);}
      a[0].rotation.set(-.55-1.6*up,0,.4*up);if(p.wave>0){p.wave-=dt;a[1].rotation.set(0,0,2.5+Math.sin(p.wave*14)*.35);}else a[1].rotation.set(-.55,0,0);}}
  else{animPerson(p,dt,k.mv,k.mv?k.spd/2.4:1);
    if(k.dance>0||k.cheer>0){const d=k.dance>0;if(d)k.dance-=dt;else k.cheer-=dt;a[0].rotation.set(0,0,-2.6);a[1].rotation.set(0,0,2.6);y=Math.abs(Math.sin((d?k.dance:k.cheer)*(d?7:9)))*(d?.22:.15);if(d)p.root.rotation.y+=dt*9;}
    else{a[0].rotation.z*=.8;if(!k.mv)k.face=FB.hold||k.st==='walk'||!b?Math.atan2(P.x-k.x,P.z-k.z):Math.atan2(b.x-k.x,b.z-k.z);}}
  p.root.position.set(k.x,y,k.z);if(!(k.dance>0))p.root.rotation.y=angLerp(p.root.rotation.y,k.face,Math.min(1,dt*10));}
function fbSep(){const K=FB.k,on=k=>k.st==='play'||k.st==='walk';
  for(let i=0;i<K.length;i++){const a=K[i];if(!on(a))continue;
    for(let j=i+1;j<K.length;j++){const c=K[j];if(!on(c))continue;const dx=c.x-a.x,dz=c.z-a.z,d=Math.hypot(dx,dz);if(d<.7&&d>1e-4){const s=(.7-d)/2/d;a.x-=dx*s;a.z-=dz*s;c.x+=dx*s;c.z+=dz*s;}}
    /* you: a kid playing keeps 90 cm away; a kid walking by keeps 1.3 m and steps round you (never through you: its head never fills your view) */
    const dx=a.x-P.x,dz=a.z-P.z,d=Math.hypot(dx,dz),m=a.st==='walk'?1.3:.9;if(d<m&&d>1e-4){a.x=P.x+dx/d*m;a.z=P.z+dz/d*m;if(a.st==='walk'){a.x-=dz/d*.04;a.z+=dx/d*.04;}}}
  for(const k of K)if(on(k))k.p.root.position.set(k.x,k.p.root.position.y,k.z);}
/* 🏷️ the kids' name tags and speech bubbles never pile up: the nearest kid's tag stays put, the others step up (on screen) until they are free */
const _fv=new THREE.Vector3(),_fw=new THREE.Vector3();
function tagsApart(items,extra){camera.updateMatrixWorld();const R=[],L=[],W=innerWidth,H=innerHeight,f=H/(2*Math.tan(camera.fov*Math.PI/360));   /* 🏷️ name tags and speech bubbles never pile up: the nearest one stays put, the others step up on screen until they are free (the football kids since night 3; friends, classroom kids and the Pet Show judges since run 4, stage 3) */
  const scr=o=>{o.getWorldPosition(_fv);const z=-_fw.copy(_fv).applyMatrix4(camera.matrixWorldInverse).z;if(z<.2)return null;_fv.project(camera);return{x:(_fv.x+1)/2*W,y:(1-_fv.y)/2*H,h:o.scale.y*f/z,w:o.scale.x*f/z,d:z};};
  if(extra)for(const o of extra){if(o&&o.visible){const m=scr(o);if(m)R.push(m);}}
  for(const k of items){if(!k.tag)continue;k.tag.center.y=.5;if(k.bub)k.bub.center.y=.5;if(k.off)continue;const s=scr(k.tag);if(s){s.k=k;L.push(s);}}
  L.sort((a,b)=>a.d-b.d);
  for(const s of L){let up=0;
    for(let n=0;n<6;n++){const y=s.y-up,hit=R.find(r=>Math.abs(r.x-s.x)<(r.w+s.w)/2&&Math.abs(r.y-y)<(r.h+s.h)/2);if(!hit)break;up=Math.max(up+1,s.y-(hit.y-(hit.h+s.h)/2-2));}
    if(up>s.h*5)up=0;s.k.tag.center.y=.5-up/s.h;R.push({x:s.x,y:s.y-up,w:s.w,h:s.h});
    const b=s.k.bub,q=b&&scr(b);if(q){b.center.y=.5-up/q.h;R.push({x:q.x,y:q.y-up,w:q.w,h:q.h});}}}
function fbTags(){tagsApart(FB.k.map(k=>({tag:k.tag,bub:k.bub,off:k.st==='off'||!k.p.root.visible})),FB.mk?[FB.mk]:null);}
/* ---- one big world: everyone who opens Cozy Town plays together ---- */
const WORLD='cozy-world',EARLY={room:null,db:null,user:null};
const MP={me:'',room:null,grp:null,peers:new Map(),list:[],t:0,lastKey:'',ready:false,unsub:null,said:0,state:'idle',tries:0,help:false,rt:0};
function capsEarly(){try{if(window.claude&&typeof window.claude.use==='function'){EARLY.room=window.claude.use('room');EARLY.db=window.claude.use('db');EARLY.user=window.claude.use('user');}}catch(e){}}
const QUICK=['👋 Hi!','😊 Hello, friend!','🏃 Follow me!','🌳 Let\'s go to the park!','🛍️ Let\'s go shopping!','🍦 Let\'s get ice cream!','🐾 Look at my pet!','👗 I love your outfit!','😂 Haha!','💗 You\'re my best friend!','⏳ Wait for me!','👋 Bye bye!'];
const EMOS=['😀','😂','😍','🥳','😮','👍','💗','⭐','🎉','🐶'];
const HEX=/^#[0-9a-f]{6}$/i;
function cleanName(n){return(typeof n==='string'?n:'').replace(/[^\p{L}\p{N} _.'-]/gu,'').trim().slice(0,14)||'Friend';}
function cleanLook(l){const o=Object.assign({},DEFAULT_LOOK);if(!l||typeof l!=='object')return o;for(const k of['skin','hair','top','bottom','shoes'])if(HEX.test(l[k]))o[k]=l[k];
  for(const k of['style','eyes','mouth'])if(LOOK_OPTS[k].some(([v])=>v===l[k]))o[k]=l[k];o.outfit=l.outfit==='dress'?'dress':'sweater';
  o.hat=CLOTHES[l.hat]&&CLOTHES[l.hat].hat?l.hat:'none';o.hatc=HEX.test(l.hatc)?l.hatc:null;o.glasses=CLOTHES[l.glasses]&&CLOTHES[l.glasses].gl?l.glasses:'none';o.glc=HEX.test(l.glc)?l.glc:null;o.co=COSTUMES[l.co]?l.co:null;return o;}
function packLook(){const l=Object.assign({},DEFAULT_LOOK,S.look||{});const o={};for(const k of['skin','hair','style','eyes','mouth','top','bottom','shoes','outfit','hat','hatc','glasses','glc','co'])if(typeof l[k]==='string')o[k]=l[k];return o;}   /* co: a costume (run 4; old versions ignore it and show the clothes) */
function mpUI(){if(PH.app==='mp'&&UI.open)renderPhone();}
async function mpConnect(){if(MP.grp||MP.state==='connecting')return;MP.state='connecting';mpUI();let r=null;
  try{const use=window.claude&&typeof window.claude.use==='function'?window.claude.use.bind(window.claude):null;r=await(MP.tries===0&&EARLY.room?EARLY.room:use?use('room'):(window.WEBROOM?window.WEBROOM():null));}catch(e){r=null;}
  MP.tries++;if(!r){MP.state='off';mpUI();mpRetryLater();return;}
  MP.room=r;let g=null;try{g=await r.join(WORLD);}catch(e){if(e&&e.code==='not_permitted')g=r;else{MP.state='off';mpUI();mpRetryLater();return;}}
  if(!PLAYING){MP.state='idle';try{g.onPeers(()=>{},()=>{})();}catch(e){}mpUI();return;}   /* went to the title meanwhile */
  MP.grp=g;MP.jt=MP.jt||Date.now();MP.ready=false;MP.lastKey='';MP.state='on';MP.tries=1;   /* connected: the next drop retries soon again */
  MP.unsub=g.onPeers(ch=>mpPeers(ch),()=>mpLost());setTimeout(()=>{MP.ready=true;},2500);$('bChat').hidden=false;
  toast('🟢 You are online! Friends who play will show up here.',3);mpUI();change();}
function mpRetryLater(){clearTimeout(MP.rt);MP.rt=setTimeout(()=>{if(!MP.grp&&PLAYING)mpConnect();},[4,10,20,40,60][Math.min(MP.tries-1,4)]*1000);}
function mpLost(){ballOwnerGone();if(MP.unsub){try{MP.unsub();}catch(e){}MP.unsub=null;}MP.grp=null;for(const a of MP.peers.values())mpDropAv(a);MP.peers.clear();$('bChat').hidden=true;MP.state='off';mpUI();mpRetryLater();}
function mpPeers(ch){for(const p of ch.left){const a=MP.peers.get(p.peer);if(HOST.cur&&HOST.cur.peer===p.peer)hostAnswer(false,true);if(a){if(BS.own===p.peer)ballOwnerGone();mpDropAv(a);MP.peers.delete(p.peer);if(MP.ready)toast(a.twin?'📱 Your other iPad or phone closed the game.':'👋 '+a.nm+' left.',2.6);}}
  for(const p of ch.peers){if(p.isMe){if(p.sameTab)MP.me=p.peer;continue;}mpUpsert(p);}mpUI();}
function mpTwin(pr){try{return!!S&&cleanName(pr.nm)===cleanName(S.name)&&JSON.stringify(cleanLook(pr.lk))===JSON.stringify(cleanLook(packLook()));}catch(e){return false;}}   /* my own name and look: my own game (moved), open on another iPad or phone */
function mpUpsert(p){const pr=p.presence||{};if(!pr.nm)return;let a=MP.peers.get(p.peer);const nm=cleanName(pr.nm),fresh=!a;
  if(!a){a={peer:p.peer,nm,lk:'',x:0,z:0,tx:0,tz:0,ry:0,rx:0,rz:0,rry:0,mv:false,loc:'city',av:null,bub:null,bubT:0,sayId:pr.say&&pr.say.id,twin:mpTwin(pr)};MP.peers.set(p.peer,a);
    if(MP.ready){SFX.yay();toast(a.twin?'📱 Your game is open on your other iPad or phone too!':'👋 '+nm+' is here! Open 👫 Friends to go to them.',3.4);}}
  a.loc=(typeof pr.loc==='string'&&LOC[pr.loc])?pr.loc:'city';const ok=v=>Number.isFinite(v)&&Math.abs(v)<2000;if(ok(pr.x))a.rx=pr.x;if(ok(pr.z))a.rz=pr.z;if(ok(pr.ry))a.rry=pr.ry;a.mv=!!pr.mv;laneFields(a,pr,fresh);
  const lk=JSON.stringify(pr.lk||{}),old=!(Number.isFinite(pr.v)&&pr.v>=COZY_BUILD);a.v=Number.isFinite(pr.v)?pr.v:0;if(lk!==a.lk||nm!==a.nm||!a.av||old!==a.old){a.lk=lk;a.nm=nm;a.old=old;mpBuildAv(a,cleanLook(pr.lk));if(fresh){const sp=peerSpot(a)||[a.rx,a.rz,a.rry];a.x=a.tx=sp[0];a.z=a.tz=sp[1];a.ry=sp[2];}}
  const s=pr.say;if(s&&typeof s==='object'&&s.id!==a.sayId){a.sayId=s.id;const txt=Number.isInteger(s.m)&&QUICK[s.m]?QUICK[s.m]:Number.isInteger(s.e)&&EMOS[s.e]?EMOS[s.e]:null;if(txt&&!fresh)mpBubble(a,txt);}
  const bk=JSON.stringify(pr.bl||null);if(bk!==a.bk){a.bk=bk;if(pr.bl)ballFrom(a,pr.bl);else if(!BS.mine&&BS.own===a.peer)ballOwnerGone();}
  const ck=JSON.stringify(pr.sc||null);if(ck!==a.ck){a.ck=ck;if(pr.sc)scoreFrom(a,pr.sc);}
  a.zz=pr.zz===1?1:0;a.aw=pr.aw===1?1:0;a.st=pr.st===1?1:0;mpExtra(a,pr,fresh);}
/* 🕰️ run 4, job 1: there is one clock for everyone (clockNow), so nobody takes a friend's clock any more and presence carries no ck */
function mpBuildAv(a,look){mpDropAv(a);const p=makePerson(lookToPerson(look));bakePerson(p);const txt='⭐ '+a.nm+(a.old?' · ⏳ older version':''),tg=label(txt,.3);tg.userData.txt=txt;tg.position.y=2.0;p.root.add(tg);p.tag=tg;scene.add(p.root);a.av=p;a.av.root.position.set(a.x,0,a.z);}
function mpDropAv(a){if(a.av){scene.remove(a.av.root);a.av=null;}a.bub=null;a.lie=false;a.lieK='';if(a.zzs){a.zzs.material.map.dispose();a.zzs.material.dispose();a.zzs=null;}mpPetsDrop(a);}
function mpBubble(a,txt){if(!a.av)return;if(a.bub&&a.bub.parent)a.bub.parent.remove(a.bub);const b=label(txt,.36);b.userData.bub=1;b.position.y=2.45;a.av.root.add(b);a.bub=b;a.bubT=5;SFX.talk();
  if(a.loc===CUR.id)a.av.wave=1.2;toast('⭐ '+a.nm+': '+txt,3.4);}
function mpSay(m,e){if(!MP.grp)return;const say={id:(++MP.said)+'-'+(Date.now()%1e6)};if(m!==undefined)say.m=m;else say.e=e;MP.grp.presence({say}).catch(()=>{});
  const txt=m!==undefined?QUICK[m]:EMOS[e];floatText(txt,P.x-Math.sin(P.yaw)*1.2,2.0,P.z-Math.cos(P.yaw)*1.2,{h:.5});SFX.pop();if(MP.peers.size)qEvent('mproom');}
const PLACE_OF={city:'📍 In town',home:'🏠 At home',studio:'👗 Changing clothes',market:'🍎 At the Market',cafe:'☕ At the Café',pets:'🐾 At the Pet Shop',flowers:'🌷 At the Flower Shop',clothes:'👗 At the Clothes Shop',toys:'🧸 At the Toy Store',bakery:'🥐 At the Bakery',icecream:'🍦 At the Ice Cream Shop',library:'📚 At the Library',school:'🏫 At School',fire:'🚒 At the Fire Station',treepark:'🌲 At the Tree Park'};
/* ===================== 🏡 Friends Lane: everyone gets a house, and you can visit if they let you in ===================== */
PLACE_OF.beach='🏖️ At the Beach';
const LANE={own:[],slotOf:new Map(),mine:null,t:9,free:null};   /* mine: your lot (always there, also when you play alone) */
const VIS={host:null,nm:'',id:'',st:'',t:0,hm:'',seenHome:false,away:0};
const HOST={seen:new Set(),queue:[],cur:null,an:null,until:0,ct:0};
const LANE_PAL=[['#ffd6e0','#ff7aa8'],['#c9f2e3','#5fa8ff'],['#fff1b8','#ff8a6b'],['#e6dbff','#9b7cf0'],['#d9e8ff','#ff9ec4'],['#ffe0c4','#5fd4b0']];
function hashStr(s){let h=5381;for(let i=0;i<s.length;i++)h=((h*33)^s.charCodeAt(i))>>>0;return h;}
function laneMe(){return MP.me||'me';}
/* every player (you too) gets a lot, picked from their name; if two names want the same lot, whoever came first (jt) keeps it.
   jt is when you first lived on Friends Lane (saved), so the same friend keeps the same lot day after day.
   Lots 0-5 use exactly the old versions' rule (they only know those 6); when they are full, lots 6-11 the same way, then more lots */
function laneAssign(){const me=laneMe(),list=[{k:me,nm:cleanName(S.name||'Friend'),jt:MP.jt||0,big:!!S.bighouse,gd:gardenSnap()||'',col:houseCol()||'',fl:homeFloors()}];
  for(const a of MP.peers.values())list.push({k:a.peer,nm:a.nm,jt:Number.isFinite(a.jt)?a.jt:9e15,big:!!a.bh,gd:a.gd||'',col:HEX.test(a.hc||'')?a.hc:'',fl:clamp(+a.hf||(a.bh?2:1),1,6)});   /* hc, hf: house colour and floors (run 4, items 23 and 22) */
  list.sort((a,b)=>a.jt-b.jt||(a.k<b.k?-1:a.k>b.k?1:0));
  const own=[],slot=new Map(),take=(b,h)=>{let j=b+h%6,t=0;while(own[j]&&t<6){j=b+(j-b+1)%6;t++;}return own[j]?-1:j;};
  for(const p of list){const h=hashStr(p.nm.toLowerCase());let j=take(0,h);if(j<0)j=take(6,h);
    if(j<0){j=12;while(own[j])j++;if(j>=LANE_MAX&&p.k!==me)continue;}
    own[j]=p;slot.set(p.k,j);}
  return{own,slot};}
function laneRefresh(force){const C=LOC.city;if(!C||!C.lane||typeof S==='undefined'||!S)return;const r=laneAssign();LANE.slotOf=r.slot;
  const m=r.slot.get(laneMe());while(C.lane.length<r.own.length&&laneGrow(m>=C.lane.length));   /* more players than lots: more lots appear */
  LANE.own=C.lane.map(lp=>r.own[lp.j]||null);
  for(const lp of C.lane){const o=LANE.own[lp.j];const key=o?[o.k===laneMe()?'ME':o.k,o.nm,o.big?1:0,o.gd||'',o.col||'',o.fl||1].join('|'):'';if(key!==lp.key||force){lp.key=key;laneHouse(lp,o);}}
  if(m!=null&&m!==LANE.mine){LANE.mine=m;yardPlace();}}
function laneHouse(lp,o){const C=LOC.city;for(const c of [...lp.g.children])lp.g.remove(c);
  const ci=C.cols.indexOf(lp.col);if(ci>=0)C.cols.splice(ci,1);
  const pal=o?LANE_PAL[hashStr(o.nm.toLowerCase())%LANE_PAL.length]:null;
  let sg;if(o)sg=signPlane(o.nm+"'s house",2.2,.8,pal[1],'#ffffff');else{const f=LANE.free||(LANE.free=signPlane('For a friend 💛',2.2,.8,'#ffffff','#ff7aa8'));sg=new THREE.Mesh(f.geometry,f.material);}   /* empty lots share one sign picture */
  sg.position.set(lp.sx,1.575,lp.sz);sg.rotation.y=lp.ry;lp.g.add(sg);
  if(!o)return;
  const fl=clamp(o.fl||(o.big?2:1),1,6),big=fl>1,hg=new THREE.Group(),opt={x:lp.hx,z:lp.hz,w:9,d:7,h:big?3.8+3.2*(fl-1):3.8,wall:o.col||pal[0],trim:'#ffffff',roof:pal[1],face:lp.s<0?1:-1,gable:true,fgable:big,rh:big?2.8:2.6,chimney:true,door:{x:lp.hx,c:'#5fd4b0'}};   /* 🏡 as many floors as the owner has, in the owner's colour (run 4, items 22, 23) */
  if(big)opt.floors=fl;building(hg,opt);for(const bx of[-19.8,-14.2]){const [x,z]=lotPt(lp.j,bx,-10.6);flowerBed(hg,x,z,3,.9);}
  lp.gdKey=o.k===laneMe()?'':(o.gd||'');if(lp.gdKey)for(const row of lp.gdKey.split(';').slice(0,40)){const [i,seed,sg]=row.split(','),pl=YARD_ALL[+i];if(!pl||!SEEDS[seed])continue;const [x,z]=lotPt(lp.j,pl[1],pl[2]),pot=+i>=6;   /* 🌱 a friend's garden: their soil and crops at the same spots as in a yard (their presence says what grows; old versions send nothing); pots too (run 4, item 22) */
    if(pot){cyl(hg,.26,.2,.3,'#c9805a',x,0,z,{seg:10,ol:.015});}else box(hg,1.8,.16,1.2,'#b07a52',x,0,z,{ol:.02});const cg=new THREE.Group();cg.position.set(x,pot?.34:.16,z);cg.rotation.y=lp.s<0?0:Math.PI;if(pot)cg.scale.setScalar(.55);hg.add(cg);buildCrop(cg,seed,clamp(+sg|0,0,3));}
  bake(hg,true);lp.g.add(hg);C.cols.push(lp.col);
  const tg=label('🏠 '+o.nm,.9+.16*(fl-1));tg.position.set(lp.hx,big?opt.h+3.9:7.9,lp.hz+(big?opt.face*(opt.d/2+.35):0));   /* (a taller house has a bigger name sign; run 4, stage 3: in front of its pointed front roof, which hid it from the lane) */tg.onBeforeRender=laneTagR;lp.g.add(tg);}
function laneTick(dt){LANE.t+=dt;if(LANE.t>=1){LANE.t=0;laneRefresh();}visTick(dt);}
function laneIcon(j){const o=LANE.own[j];return o&&o.k===laneMe()?'🏠':'🔔';}
function laneLabel(j){const o=LANE.own[j];if(!o)return'';if(o.k===laneMe())return'Go inside your house';
  return VIS.st==='knock'&&VIS.host===o.k?'⏳ Waiting at the door…':'Knock on '+o.nm+"'s door";}
function laneDoor(j){const o=LANE.own[j];if(!o)return;if(o.k===laneMe()){enter('home');return;}laneKnock(o.k);}
function laneHostDoor(){const j=LANE.slotOf.get(VIS.host),C=LOC.city;return j!=null&&C&&C.lane&&C.lane[j]?C.lane[j].door:[-17,-4.6,0];}
/* a friend (old version) standing in THEIR own yard in town shows up at their house on Friends Lane */
function citySpot(a){const j=LANE.slotOf.get(a.peer);if(j!=null&&!a.v&&inYardR(a.rx,a.rz)){   /* (only an old version, which sends no v, can stand in its old town yard; a new version there is in the Flower Corner) */const q=lotPt(j,a.rx,a.rz);return[q[0],q[1],LANE_PLOTS[j].s<0?a.rry:a.rry+Math.PI];}return[a.rx,a.rz,a.rry];}
/* where a friend's avatar shows up in MY game (null = not here) */
function peerSpot(a){const me=CUR.id,VD=VOX-LOC.home.ox;
  if(a.loc==='city')return me==='city'?citySpot(a):null;
  if(a.loc==='home')return me==='visit'&&VIS.st==='in'&&VIS.host===a.peer?[a.rx+VD,a.rz,a.rry]:null;
  if(a.loc==='visit'){if(me==='home'&&MP.me&&a.ho===MP.me)return[a.rx,a.rz,a.rry];if(me==='visit'&&VIS.st==='in'&&a.ho===VIS.host)return[a.rx+VD,a.rz,a.rry];return null;}
  if(a.loc==='studio'||a.loc==='client')return null;
  return a.loc===me?[a.rx,a.rz,a.rry]:null;}
function placeOf(a){if(a.loc==='visit'){if(MP.me&&a.ho===MP.me)return'🏠 Visiting your house!';const h=MP.peers.get(a.ho);return'🏠 At '+(h?esc(h.nm)+"'s house":"a friend's house");}return PLACE_OF[a.loc]||'📍 In town';}
function laneFields(a,pr,fresh){a.jt=Number.isFinite(pr.jt)?pr.jt:undefined;a.bh=pr.bh?1:0;a.ho=typeof pr.ho==='string'?pr.ho:null;a.gd=typeof pr.gd==='string'?pr.gd.slice(0,600):'';
  const obj=v=>v&&typeof v==='object'?v:null;a.kn=obj(pr.kn);a.an=obj(pr.an);a.hm=obj(pr.hm);hpFields(a,pr);
  const guest=!!MP.me&&a.loc==='visit'&&a.ho===MP.me;if(guest&&!a.guest&&!fresh){SFX.yay();toast('🏠 '+a.nm+' is visiting your house!',3);}a.guest=guest;
  hostSeeKnock(a);}
function laneStamp(st){st.jt=MP.jt||0;st.bh=S.bighouse?1:0;st.gd=gardenSnap();st.hc=houseCol()||null;st.hf=homeFloors();   /* 🌱 my garden for friends' games (optional; old versions ignore it) */
  if(CUR.id==='visit'&&VIS.st==='in'){st.loc='visit';st.ho=VIS.host;st.x=Math.round((P.x-VOX+LOC.home.ox)*100)/100;}else st.ho=null;
  st.kn=VIS.st==='knock'?{to:VIS.host,id:VIS.id}:null;st.an=HOST.an;
  let hosting=performance.now()<HOST.until;if(!hosting&&MP.me)for(const a of MP.peers.values())if(a.loc==='visit'&&a.ho===MP.me){hosting=true;break;}
  st.hm=null;if(hosting){const lim=MP.pmax||(window.WEBNET?60000:3600);st.hm=homeSnap(0);st.hm=homeSnap(Math.max(0,lim-jsonBytes(st)));}}
const TENC=new TextEncoder();function jsonBytes(o){return TENC.encode(JSON.stringify(o)).length;}
/* the house layout rides along in presence; Claude rooms cap presence at 4 KiB, so a very full house sends what fits (placed-first items first).
   i = the ground floor (old versions only read this); u = upstairs in the big house, sent with what is left, so it is dropped first.
   Run 4, job 2 (item 26, the root cause): a visitor used to GUESS the room size from the spots: a big house with any piece within 70 cm of a wall (a kitchen flush to the
   back wall, |z| > 4.3) looked like an old 18x14 layout, so the visitor drew the old big room around a 12x10 layout and the kitchen stood 2 m from the wall. Now the layout
   says its room size (W, D: half the width and depth); old versions ignore it. Spots are sent to the centimetre (they were rounded to 10 cm) */
function homeSnap(budget){const h=S.home,r=v=>Math.round(v*100)/100;let used=0;
  const rows=fl=>{const out=[];for(const it of h.items.filter(it=>(S.bighouse?it.f|0:0)===fl).slice(0,160)){const s=[it.t,it.c||'',r(it.x),r(it.z),it.r|0,it.on?1:0].concat(it.sh?['s'+((S.beach&&S.beach.n)|0)]:[]).join(',');if(budget!=null&&used+s.length+1>budget)break;out.push(s);used+=s.length+1;}return out.join(';');};
  const n=homeFloors(),o={b:S.bighouse?1:0,w:h.wall,f:h.floor,W:HOMEW,D:HOMED,n,i:rows(0)};if(S.bighouse)o.u=rows(1);for(let k=2;k<n;k++)o['u'+k]=rows(k);return o;}   /* n, u2…u5: the floors above the second (run 4, item 22; old versions ignore them) */
function goKnock(peer){if(busWarp('city'))return;const a=MP.peers.get(peer),j=LANE.slotOf.get(peer);if(!a||j==null||!LOC.city.lane){toast('🏠 Their house is not on Friends Lane right now.',2.8);return;}
  const d=LOC.city.lane[j].door;if(DECO.on)decoEnd();if(P.ride)stopRide();if(P.sit)standUp();closePanel();SFX.door();
  fade(()=>{setLoc('city');P.x=d[0]+Math.sin(d[2]+Math.PI)*1.6;P.z=d[1]+Math.cos(d[2]+Math.PI)*1.6;P.yaw=d[2]+Math.PI;P.pitch=.06;P.sit=null;bringFollowers();saveLocal();setTimeout(()=>laneKnock(peer),450);});}
function laneKnock(peer){const a=MP.peers.get(peer);if(!MP.grp||!a){toast('🏠 Nobody is home right now.',2.6);return;}
  if(VIS.st==='knock'&&VIS.host===peer){toast('🔔 Waiting for '+a.nm+' to open the door…',2.4);return;}
  VIS.host=peer;VIS.nm=a.nm;VIS.id=Date.now().toString(36).slice(-6)+Math.random().toString(36).slice(2,6);VIS.st='knock';VIS.t=performance.now();VIS.hm='';
  SFX.ding();toast('🔔 Ding-dong! Waiting for '+a.nm+' to open the door…',3.2);}
function visReset(){VIS.host=null;VIS.id='';VIS.st='';VIS.hm='';VIS.seenHome=false;VIS.away=0;}
function visTick(dt){if(!VIS.st)return;const now=performance.now(),a=MP.peers.get(VIS.host);
  if(VIS.st==='knock'||VIS.st==='enter'){
    if(!a){toast('🏠 '+VIS.nm+' left the game.',2.6);visReset();return;}
    const an=a.an;
    if(VIS.st==='knock'&&an&&an.to===MP.me&&an.id===VIS.id){if(an.ok){VIS.st='enter';VIS.t=now;}else{SFX.no();toast('💛 '+a.nm+" can't have visitors right now. Maybe later!",3.2);visReset();return;}}
    if(VIS.st==='knock'&&now-VIS.t>45000){toast('🔔 '+a.nm+" didn't open the door. Maybe they are busy!",3.2);visReset();return;}
    if(VIS.st==='enter'){if(a.hm)visEnter(a);else if(now-VIS.t>12000){toast('Hmm, the door is stuck. Try knocking again!',3);visReset();}}
    return;}
  if(VIS.st==='in'){if(CUR.id!=='visit'){if(!fading)visReset();return;}
    if(!a){VIS.away+=dt;if(VIS.away>2)visLeave('👋 '+VIS.nm+' left the game, so you head outside.');return;}
    if(a.hm){const k=JSON.stringify(a.hm);if(k!==VIS.hm){VIS.hm=k;visFill(a.hm);}}
    if(a.loc==='home'){VIS.seenHome=true;VIS.away=0;}else{VIS.away+=dt;if((VIS.seenHome&&VIS.away>2.5)||VIS.away>15)visLeave('🏠 '+a.nm+' left the house, so you head outside too.');}}}
function visEnter(a){if(fading||CUT){VIS.t=performance.now();return;}
  VIS.st='in';VIS.hm=JSON.stringify(a.hm);VIS.seenHome=a.loc==='home';VIS.away=0;
  if(DECO.on)decoEnd();if(P.ride)stopRide();if(P.sit)standUp();closePanel();SFX.door();
  fade(()=>{visFill(a.hm);setLoc('visit');const L=LOC.visit;[P.x,P.z]=visSpot(L,a);P.yaw=0;P.pitch=0;P.sit=null;bringFollowers();SFX.yay();toast('🏠 Welcome to '+a.nm+"'s house!",3);});}
/* 🚪 where a guest steps in: by the door, but not inside the host (who lands on the door spot too) and not right against a sofa */
function visSpot(L,a){const hx=a&&a.loc==='home'&&Number.isFinite(a.rx)&&Number.isFinite(a.rz)?a.rx+VOX-LOC.home.ox:null,hz=hx!==null?a.rz:0,z0=L.oz+L.D-1.3;let best=null,bs=-9;
  for(const [dx,dz] of [[1.3,-.5],[-1.3,-.5],[0,-1.5],[1.6,-1.6],[-1.6,-1.6],[2.6,-.4],[-2.6,-.4],[0,-2.6]]){const x=L.ox+dx,z=z0+dz;let m=Math.hypot(x-L.ox,z-z0)-.3;   /* the door spot is where the host lands */
    for(const r of L.dcols)m=Math.min(m,Math.hypot(Math.max(r.x1-x,0,x-r.x2),Math.max(r.z1-z,0,z-r.z2)));
    if(hx!==null)m=Math.min(m,Math.hypot(hx-x,hz-z)-.3);if(m>=1.0){bs=m;best=[x,z];break;}if(m>bs){bs=m;best=[x,z];}}
  return collideXZ(best[0],best[1],.3,L);}
function visLeave(msg){const d=laneHostDoor();visReset();if(msg)toast(msg,3.2);SFX.door();
  fade(()=>{setLoc('city');P.x=d[0];P.z=d[1];P.yaw=d[2];P.pitch=0;P.sit=null;bringFollowers();saveLocal();});}
function visFill(hm){const L=LOC.visit;if(!L||!hm||typeof hm!=='object')return;
  const wide=hm.W==null&&!!hm.b&&[hm.i,hm.u].some(v=>typeof v==='string'&&v.split(';').some(r=>{const q=r.split(',');return Math.abs(+q[2])>5.3||Math.abs(+q[3])>4.3;}));   /* only a layout that does not say its size (an old version) is guessed at: its big layout = the old 18x14 room (run 4, job 2) */
  visitShell(L,visFloors(hm),wide);
  L.wallM.color.set(HEX.test(hm.w)?hm.w:'#ffd6e0');const fk=FLOORS[hm.f]?hm.f:'wood';
  if(L.fk!==fk){L.fk=fk;if(L.floorM.map)L.floorM.map.dispose();L.floorM.map=floorTex(fk);L.floorM.needsUpdate=true;}L.floorM.map.repeat.set(L.W/2,L.D/2);
  for(const c of [...L.items.children])L.items.remove(c);L.dcols.length=0;L.inter=L.inter.filter(i=>i.vdoor);
  const rows=[];L.vf=-1;for(let fl=0;fl<(L.fls?L.fls.length:1);fl++){const v=hm[fl===0?'i':fl===1?'u':'u'+fl];if(typeof v==='string'&&v)for(const row of v.split(';').slice(0,160))rows.push([row,fl]);}
  for(const [row,fl] of rows){const [t,c,xs,zs,rs,on,sn]=row.split(','),shl=t==='shelf'&&/^s\d+$/.test(sn||''),F=FURN[t];if(!F)continue;const x=+xs,z=+zs,r=(+rs||0)&3,ox=L.ox,oz=L.oz+UPZ*fl;
    if(!Number.isFinite(x)||!Number.isFinite(z)||Math.abs(x)>L.W||Math.abs(z)>L.D)continue;
    const g=buildFurn(shl?'shellshelf':t,HEX.test(c)?c:null);g.position.set(ox+x,0,oz+z);g.rotation.y=r*Math.PI/2;g.traverse(o=>{if(o.isMesh&&o.material!==OL){o.castShadow=true;o.receiveShadow=true;}});g.userData.fl=fl;g.userData.row={t,x,z,r,fl};L.items.add(g);
    if(shl)shelfShow(g,+sn.slice(1));   /* 🐚 their shells, not yours */
    if(F.use==='lamp')setLamp({g,it:{on:on==='1'}});
    const R=fpRect(t,x,z,r),rect={x1:ox+R.x1,z1:oz+R.z1,x2:ox+R.x2,z2:oz+R.z2};if(!F.flat)L.dcols.push(rect);
    if(F.use==='sit'){const yaw=r*Math.PI/2+Math.PI;L.inter.push({x:ox+x,z:oz+z,r:1.7,rect,icon:'🪑',label:'Sit down',
      act:()=>{P.sit={x:ox+x,z:oz+z,yaw};P.x=P.sit.x;P.z=P.sit.z;P.yaw=yaw;P.pitch=-.12;SFX.pop();toast('Comfy! Move to stand up.');}});}}}
function hostSeeKnock(a){const kn=a.kn;if(!kn||!MP.me||kn.to!==MP.me||typeof kn.id!=='string')return;const key=a.peer+'|'+kn.id;if(HOST.seen.has(key))return;HOST.seen.add(key);
  HOST.queue.push({peer:a.peer,id:kn.id,nm:a.nm});hostCard();}
function hostCard(){if(HOST.cur||!HOST.queue.length)return;const q=HOST.queue.shift();if(!MP.peers.has(q.peer)){hostCard();return;}HOST.cur=q;
  if(hpOn()&&CUR.id==='home'&&!CUT){hostAnswer(true,true);toast('🎉 '+q.nm+' came to your party!',2.8);return;}   /* 🎉 a party: the door opens by itself (run 4, job 17) */
  SFX.ding();setTimeout(()=>SFX.ding(),420);try{if(navigator.vibrate)navigator.vibrate([90,60,90]);}catch(e){}
  let el=$('knockCard');if(!el){el=document.createElement('div');el.id='knockCard';document.body.appendChild(el);}
  const home=CUR.id==='home';
  el.innerHTML=`<div class="kc-t">🔔 Ding-dong!</div><div class="kc-m"><b>${esc(q.nm)}</b> is at your door${home?'':' on Friends Lane'}.<br>Let them in?</div><div class="kc-b"><button class="btn mint" id="kcYes">${home?'✅ Come in!':'🏠 Go home &amp; let in'}</button><button class="btn" id="kcNo">🙅 Not now</button></div>`;
  el.hidden=false;document.body.classList.add('kc');$('kcYes').onclick=()=>hostAnswer(true);$('kcNo').onclick=()=>hostAnswer(false);
  clearTimeout(HOST.ct);HOST.ct=setTimeout(()=>{if(HOST.cur===q)hostAnswer(false,true);},40000);}
function hostAnswer(ok,quiet){const q=HOST.cur;if(!q)return;HOST.cur=null;const el=$('knockCard');if(el)el.hidden=true;document.body.classList.remove('kc');clearTimeout(HOST.ct);
  HOST.an={to:q.peer,id:q.id,ok:ok?1:0};
  if(ok){HOST.until=performance.now()+25000;SFX.yay();if(CUR.id!=='home'&&!CUT&&!fading)ACT.gohome();toast('🏠 '+q.nm+' is coming in!',2.6);}
  else if(!quiet)toast('💛 Okay! '+q.nm+' can try again later.',2.4);
  setTimeout(hostCard,700);}
function mpTick(dt){if(!MP.grp)return;const loc=CUR?CUR.id:'city';
  MP.t+=dt;if(MP.t>=.15){MP.t=0;const st={nm:S.name||'Friend',lk:packLook(),loc,x:Math.round(P.x*100)/100,z:Math.round(P.z*100)/100,ry:Math.round((P.sit&&P.sit.bus?P.sit.yaw:P.yaw)*100)/100,mv:P.moving?1:0,v:COZY_BUILD};   /* v: my version stamp (run 4, job 2): a friend with none or a smaller one shows ⏳ older version */   /* (on the bus your body faces forward on the seat, wherever you look) */
    {const b=LOC.city.ball,m=S.match||{l:0,r:0,v:0},r2=v=>Math.round(v*100)/100;st.sc=[m.l|0,m.r|0,m.v|0];st.bl=BS.mine&&b?[r2(b.x),r2(b.z),r2(b.vx),r2(b.vz),BS.k,Math.round((b.reset||0)*10)/10]:null;}
    st.zz=zzIn()?1:null;st.aw=AW.on?1:null;st.st=P.sit&&!P.sit.bed&&!P.sit.bus?1:null;   /* 🪑 sitting on a bench or a chair; 😴 zz: in bed (optional; null clears them: presence merges) */
    mpStamp(st);   /* 🦘 jumps, 🐾 pets with me (optional) */
    laneStamp(st);hpStamp(st);const key=JSON.stringify(st);if(key!==MP.lastKey){MP.lastKey=key;MP.grp.presence(st).catch(()=>{});}}
  for(const a of MP.peers.values()){if(!a.av)continue;let sp=peerSpot(a);const vis=!!sp,lie=vis&&!!a.zz;a.av.root.visible=vis;if(lie)sp=mpBedSpot(a,sp);if(sp){a.tx=sp[0];a.tz=sp[1];a.ry=sp[2];}
    const d=Math.hypot(a.tx-a.x,a.tz-a.z);if(d>8||lie!==!!a.lie){a.x=a.tx;a.z=a.tz;}else{const k=Math.min(1,dt*8);a.x+=(a.tx-a.x)*k;a.z+=(a.tz-a.z)*k;}
    mpPose(a,dt,vis,lie,d);dnPeer(a,dt);if(vis&&!lie&&!(a.dn&&a.dn.st==='go')&&Math.hypot(a.x-camera.position.x,a.z-camera.position.z)<.6)a.av.root.visible=false;
    if(a.bub){a.bubT-=dt;if(a.bubT<=0){a.av.root.remove(a.bub);a.bub=null;}}}}
/* 🦘🐾🛏️💤 more of a friend shows up (optional presence fields: old versions ignore them, and friends on old versions just don't send them):
   jp = how many times they jumped (a new number = a hop), pt = the pets walking with them (at most 3: [kind, colour, name, outfit]).
   In their bed (zz) they lie down on it; away ("Still there?") or asleep, a little 💤 floats over their head */
function mpStamp(st){if(P.jn)st.jp=P.jn;const pt=[];
  for(const d of S.pets){if(d.stay||!PET_TYPES[d.type]||pt.length>=3)continue;const o=d.outfit&&typeof d.outfit==='object'?d.outfit:{};
    const row=[d.type,HEX.test(d.col)?d.col:PET_TYPES[d.type].cols[0],String(d.name||'').slice(0,14),Object.values(o).filter(k=>ACCS[k]).join('.')];if(petKind(d)!==d.type)row.push(petKind(d));pt.push(row);}
  st.pt=pt.length?pt:null;}
function mpExtra(a,pr,fresh){const jp=Number.isInteger(pr.jp)?pr.jp:null;if(!fresh&&jp!==null&&jp!==a.jp)mpHop(a);a.jp=jp;
  const pk=JSON.stringify(Array.isArray(pr.pt)?pr.pt.slice(0,3):null);if(pk!==a.pk){mpPetsBuild(a,pr.pt);a.pk=pk;}
  a.bed=a.zz?mpBed(a):null;}
function mpHop(a){if(a.zz||a.jy>0)return;a.jv=5.4;a.jy=.0001;if(a.pets)for(const q of a.pets)if(!q.hopT&&!q.hopA)q.hopT=.05+Math.random()*.15;}
/* which bed they lie in: their house layout (hm, sent while they have a visitor) lists every bed; take the one whose pillow is closest to them.
   [x,z,yaw] in their own house, like their head on the pillow (null = not found: then they lie where they are, turned like the nearest wall) */
function mpBed(a){const h=a.hm;if(!h||typeof h!=='object')return null;let best=null,bd=1.2;
  for(const fl of[0,1]){const v=h[fl?'u':'i'];if(typeof v!=='string'||!v)continue;
    for(const row of v.split(';').slice(0,160)){const [t,c,xs,zs,rs]=row.split(','),F=FURN[t];if(!F||F.use!=='sleep')continue;
      const r=(+rs||0)&3,fx=Math.sin(r*Math.PI/2),fz=Math.cos(r*Math.PI/2),x=LOC.home.ox+(+xs)-fx*.55,z=LOC.home.oz+fl*UPZ+(+zs)-fz*.55,d=Math.hypot(x-a.rx,z-a.rz);
      if(d<bd){bd=d;best=[x,z,r*Math.PI/2+Math.PI,t,HEX.test(c)?c:F.cols[0]];}}}
  return best;}
function mpBedSpot(a,sp){const b=a.bed,q=Math.PI/2;return b?[b[0]+sp[0]-a.rx,b[1]+sp[1]-a.rz,b[2]]:[sp[0],sp[1],Math.round(a.rry/q)*q];}
function mpPose(a,dt,vis,lie,d){const p=a.av,R=p.root;
  const k=lie?String(a.bed||'-'):'';if(k!==(a.lieK||'')){a.lieK=k;a.lie=lie;p.b.rotation.x=lie?.25-Math.PI/2:0;p.b.position.set(0,lie?-.33:0,lie?1.29:0);if(p.tag)p.tag.position.set(0,lie?1.25:2.0,lie?0.7:0);   /* on their back, head a little up on the pillow, feet to the end of the bed */
    if(p.duv){R.remove(p.duv);p.duv.traverse(o=>{if(o.isMesh)o.geometry.dispose();});p.duv=null;}
    if(lie){for(const l of p.legs)l.rotation.x=0;for(const r of p.arms)r.rotation.set(0,0,0);p.head.rotation.set(0,0,0);   /* tucked in under a puffy duvet in the bed's colour */
      const b=a.bed,bunk=!!b&&b[3]==='bunkbed';p.duv=new THREE.Group();box(p.duv,bunk?.96:1.2,.2,1.2,b?b[4]:'#ff9ec4');p.duv.position.set(0,-.12,.96);R.add(p.duv);p.bunk=bunk;}}
  if(a.jy>0||a.jv>0){a.jv-=18*dt;a.jy+=a.jv*dt;if(a.jy<=0)a.jy=a.jv=0;}
  R.position.set(a.x,lie?0.62:(a.jy||0)+brAt(CUR.id,a.x,a.z)+(a.st&&!a.mv?-.07:0),a.z);R.rotation.y=lie?a.ry+Math.PI:angLerp(R.rotation.y,a.ry+Math.PI,Math.min(1,dt*8));
  if(vis&&!lie){animPerson(p,dt,a.mv&&d>.02&&!a.st);if(a.jy>0){p.legs[0].rotation.x=.55;p.legs[1].rotation.x=-.25;}if(a.st&&!a.mv){sitPose(p);p.b.position.y=0;}}   /* 🪑 sitting: legs forward, a little lower */
  const zz=vis&&(lie||!!a.aw);if(zz&&!a.zzs){a.zzs=label('💤',.42,{bg:null,bw:0,pad:8,stroke:'#ffffff',strokeW:10});R.add(a.zzs);}
  if(a.zzs){a.zzs.visible=zz;if(zz){a.zzT=(a.zzT||0)+dt;const b=Math.sin(a.zzT*2.4)*.07;if(lie)a.zzs.position.set(p.bunk?.72:0,(p.bunk?.42:.7)+b,-.1);else a.zzs.position.set(0,(a.bub?2.95:2.5)+b,0);}}
  mpPetsTick(a,dt,vis);}
const mpOwn=(o,k)=>typeof k==='string'&&Object.prototype.hasOwnProperty.call(o,k);   /* only real kinds and outfits from a friend's data (never "constructor" and such) */
function mpPetsBuild(a,pt){mpPetsDrop(a);if(!Array.isArray(pt))return;const L=[];
  for(const x of pt.slice(0,3)){if(!Array.isArray(x)||!mpOwn(PET_TYPES,x[0]))continue;const T=PET_TYPES[x[0]];
    const kind=typeof x[4]==='string'&&mpOwn(PET_TYPES,x[4])&&PET_TYPES[x[4]].base===x[0]?x[4]:x[0];   /* 🐾 a friend's breed or new animal (night 3, job 14) */
    const d={type:x[0],kind,col:HEX.test(x[1])?x[1]:T.cols[0],outfit:{}};if(typeof x[3]==='string')for(const k of x[3].split('.').slice(0,4))if(mpOwn(ACCS,k))d.outfit[ACCS[k].s]=k;
    const m=makePet(kind,d.col);addOutfit(m,d);const keep=[...m.legs,m.tail].filter(Boolean);for(const g of keep)g.userData.keep=1;bake(m.b,false);for(const g of keep)bake(g,false);   /* few draw calls: only the legs and tail move */
    const nm=(typeof x[2]==='string'?x[2]:'').replace(/[^\p{L}\p{N} _.'-]/gu,'').trim().slice(0,14),tg=label(nm&&!bdBad(nm)?nm:T.name,.24);   /* a name that isn't kind shows as just "puppy" */
    tg.position.y=petTagY(kind);m.root.add(tg);m.root.visible=false;scene.add(m.root);
    L.push({m,g:m.root,tag:tg,x:a.x,z:a.z,face:0,mv:false,spd:1});}
  a.pets=L.length?L:null;a.trl=null;}
function mpPetsDrop(a){if(a.pets)for(const q of a.pets){scene.remove(q.g);q.g.traverse(o=>{if(o.isMesh)o.geometry.dispose();});q.tag.material.map.dispose();q.tag.material.dispose();}a.pets=null;a.pk='';}
/* a point s metres back along the way they walked (past its end: straight behind them), then o metres to the side */
function mpTrail(a,s,o){const T=a.trl;let x=a.x,z=a.z,dx=Math.sin(a.ry),dz=Math.cos(a.ry);
  for(let i=T.length-1;i>=0&&s>0;i--){const px=T[i][0],pz=T[i][1],l=Math.hypot(px-x,pz-z);if(l<1e-4)continue;const k=Math.min(1,s/l);dx=(px-x)/l;dz=(pz-z)/l;x+=(px-x)*k;z+=(pz-z)*k;s-=l*k;}
  if(s>0){x+=dx*s;z+=dz*s;}return[x-dz*o,z+dx*o];}
/* 🐾 their pets trot along the way they walked (so round corners and through doors, like they did), stop when they stop, never block you */
function mpPetsTick(a,dt,vis){const L=a.pets;if(!L)return;
  if(!vis){for(const q of L)q.g.visible=false;a.trl=null;return;}
  const fresh=!a.trl;if(fresh)a.trl=[];const T=a.trl,n=T.length,m=n?Math.hypot(a.x-T[n-1][0],a.z-T[n-1][1]):1e9;
  if(n&&m>8)T.length=0;if(!T.length||m>=.35){T.push([a.x,a.z]);if(T.length>40)T.shift();}   /* popped somewhere else: a new trail */
  const near=Math.hypot(a.x-P.x,a.z-P.z)<24;
  for(let i=0;i<L.length;i++){const q=L[i],[gx,gz]=mpTrail(a,1.4+i*.75,i===1?-.35:i===2?.35:0);
    if(fresh||Math.hypot(gx-q.x,gz-q.z)>9){[q.x,q.z]=collideXZ(gx,gz,.3,CUR);q.mv=false;q.face=Math.atan2(a.x-q.x,a.z-q.z);q.g.rotation.y=q.face;}
    else{const dx=gx-q.x,dz=gz-q.z,dd=Math.hypot(dx,dz);
      if(dd>.06){const sp=Math.min(7,1+dd*3.2),s=Math.min(dd,sp*dt);let nx=q.x+dx/dd*s,nz=q.z+dz/dd*s;if(near)[nx,nz]=collideXZ(nx,nz,.3,CUR);q.x=nx;q.z=nz;q.face=Math.atan2(dx,dz);q.mv=dd>.15;q.spd=clamp(sp/3,.6,1.8);}
      else{q.mv=false;q.face=angLerp(q.face,Math.atan2(a.x-q.x,a.z-q.z),Math.min(1,dt*3));}}
    q.g.visible=true;q.g.position.set(q.x,hopY(q,dt)+brAt(CUR.id,q.x,q.z),q.z);q.g.rotation.y=angLerp(q.g.rotation.y,q.face,Math.min(1,dt*8));animPet(q.m,dt,q.mv,q.spd);q.tag.visible=!a.lie&&Math.hypot(P.x-q.x,P.z-q.z)>1.3;}}   /* (their owner asleep in bed or in the tent: no pet names floating on the pillow) */
/* jump right next to a friend, even into the shop they are in */
function warpTo(loc,fx,fz,nm){if(!LOC[loc]||busWarp(loc,nm))return;if(DECO.on)decoEnd();if(P.ride)stopRide();if(P.sit)standUp();closePanel();SFX.door();
  fade(()=>{setLoc(loc);let x=fx+2.4,z=fz;const fr=[...MP.peers.values()].find(a=>a.nm===nm),ry=fr?fr.ry:0;
    for(let k=0;k<8;k++){const ang=ry+k*Math.PI/4,cx=fx-Math.sin(ang)*2.4,cz=fz-Math.cos(ang)*2.4,[qx,qz]=collideXZ(cx,cz,.3,CUR);if(Math.hypot(qx-cx,qz-cz)<.2){x=qx;z=qz;break;}if(k===7)[x,z]=[qx,qz];}
    P.x=x;P.z=z;P.yaw=Math.atan2(-(fx-x),-(fz-z));P.pitch=0;P.sit=null;bringFollowers();saveLocal();SFX.yay();toast('🚀 You are with '+nm+'!',2.6);});}
function mpPhone(){
  if(MP.state!=='on'){const c=MP.state==='connecting'||MP.state==='idle';
    return`<div style="font-size:54px;text-align:center;margin-top:14px">${c?'⏳':'😕'}</div><p class="ph-sub" style="text-align:center">${c?'Connecting to your friends...':'Can\'t connect to friends right now.'}</p>
      ${c?'':`<div class="row" style="justify-content:center;margin-top:8px"><button class="btn mint" data-a="mpretry">🔄 Try again</button><button class="btn white" data-a="mphelp">❓ How to fix</button></div>`}
      ${MP.help&&!c?`<p class="ph-sub" style="margin-top:12px">${window.WEBNET&&WEBNET.on?'Check that this iPad is online, then tap <b>Try again</b>. Still not working? Ask a grown-up to check the game\'s online setup.':'Friends can only play together if they were invited by email in the <b>Share</b> menu. In Share, <b>Anyone with the link</b> must be turned off, because people who open a plain link can\'t play together.'}</p>`:''}`;}
  const list=MP.list=[...MP.peers.values()];
  const say=`<p class="ph-sub" style="margin-top:12px">Say something:</p><div class="qmsg">${QUICK.map((q,i)=>`<button class="pill" data-a="mpsay:${i}">${esc(q)}</button>`).join('')}</div><div class="qmsg">${EMOS.map((e,i)=>`<button class="emo" data-a="mpemo:${i}">${e}</button>`).join('')}</div>`;
  return`<p class="ph-sub">🟢 You are online! Everyone who opens Cozy Town plays in this world with you.</p>
    <p class="ph-sub" style="margin-top:10px">${list.length?'Playing now:':'No friends are playing right now. When they open Cozy Town, they will show up here! 💗'}</p>
    ${list.map((a,i)=>`<div class="ph-row"><span>⭐ ${esc(a.nm)}${a.old?' <small>⏳ older version</small>':''}<br><small>${placeOf(a)}</small></span><span style="display:flex;gap:6px;flex:none"><button class="btn mint sm" data-a="mpgo:${i}">🚀 Go</button><button class="btn sm" data-a="mpvisit:${i}" aria-label="Visit their house">🏠</button></span></div>`).join('')}${list.length?say:''}`;}
function openChat(){if(!MP.grp)return;openPanel(`<div class="hd"><h2>💬 Say something</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
  <div class="qmsg">${QUICK.map((q,i)=>`<button class="pill" data-a="mpsay:${i}">${esc(q)}</button>`).join('')}</div><div class="qmsg">${EMOS.map((e,i)=>`<button class="emo" data-a="mpemo:${i}">${e}</button>`).join('')}</div>`,{bottom:true});}

/* ---- other people shopping in the stores ---- */
const SHOPPERS=[];
const SHOP_SPOTS={
  market:{n:3,buy:6,spots:[[-4.4,-3.3,Math.PI],[0,-3.3,Math.PI],[4.4,-3.3,Math.PI],[-5.4,-1.4,-Math.PI/2],[-3.6,1.6,Math.PI],[2.5,1.2,Math.PI],[4.9,3.25,Math.PI],[0,2.9,0]]},
  pets:{n:2,buy:5,spots:[[-4.6,-1.25,Math.PI],[0,-1.25,Math.PI],[4.4,-1.25,Math.PI],[3.6,2.25,Math.PI],[5.4,-.6,Math.PI/2],[-4.9,3.2,Math.PI],[1.0,2.8,0]]},
  flowers:{n:2,buy:5,spots:[[-3.6,-2.65,Math.PI],[0,-2.65,Math.PI],[3.6,-2.65,Math.PI],[-2,1,0],[1,.8,0],[4.1,3.05,Math.PI],[2.0,3.1,0]]},
  cafe:{n:2,buy:0,spots:[[-.6,-2.15,Math.PI],[-3.3,-2.15,Math.PI],[0,.6,0],[-1.0,2.7,0],[1.2,2.9,0],[4.6,-.4,Math.PI/2]]},
  toys:{n:3,buy:6,spots:[[-3.6,-3.3,Math.PI],[0,-3.3,Math.PI],[3.6,-3.3,Math.PI],[-1.4,-.4,Math.PI],[1.0,-.4,Math.PI],[3.6,.9,0],[-4.6,1.95,Math.PI],[0,1.6,0]]},
  bakery:{n:2,buy:2,spots:[[0,-2.5,Math.PI],[-1.6,-2.5,Math.PI],[2.45,-2.5,Math.PI],[-4.9,-1.0,-Math.PI/2],[0,1.2,0],[1.6,2.8,0]]},
  icecream:{n:2,buy:2,spots:[[0,-2.5,Math.PI],[-1.6,-2.5,Math.PI],[2.45,-2.5,Math.PI],[-4.0,-2.6,Math.PI],[0,1.0,0],[1.6,2.8,0]]},
  library:{n:2,buy:-1,spots:[[-3.7,-3.15,Math.PI],[-1.2,-3.15,Math.PI],[1.3,-3.15,Math.PI],[3.8,-3.15,Math.PI],[-4.8,-1.5,-Math.PI/2],[4.8,-1.5,Math.PI/2],[0,1.8,0],[4.4,2.9,Math.PI]]},
  clothes:{n:2,buy:4,spots:[[-3.6,-2.85,Math.PI],[0,-2.85,Math.PI],[3.6,-2.85,Math.PI],[4.9,-1.2,Math.PI/2],[3.6,3.15,Math.PI],[-5.4,-.85,Math.PI],[0,1.2,0],[-1.8,.4,0],[1.5,3.2,0]]}};
function segFree(L,a,b){const len=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(len/.3));for(let i=0;i<=n;i++){const t=i/n,x=L.ox+a[0]+(b[0]-a[0])*t,z=L.oz+a[1]+(b[1]-a[1])*t;for(const c of L.cols)if(pushOut(x,z,.3,c))return false;}return true;}
class Shopper{
  constructor(id,cfg){this.L=LOC[id];this.cfg=cfg;this.p=bakePerson(makePerson(randomLook()));this.g=this.p.root;scene.add(this.g);const fr=cfg.spots.map((s,j)=>j).filter(j=>!SHOPPERS.some(o=>o.L===this.L&&o.i===j));this.i=fr.length?pick(fr):Math.floor(Math.random()*cfg.spots.length);
    const s=cfg.spots[this.i];this.x=this.L.ox+s[0];this.z=this.L.oz+s[1];this.face=s[2]||0;this.next=-1;this.wait=rand(0,5);this.moving=false;
    this.target={x:0,z:0,r:2,icon:'👋',label:'Say hi',obj:this.g,act:()=>{this.p.wave=1.2;SFX.talk();toast('“'+pick(['I love this shop!','Shopping is so fun!','This is my favorite store!','Have you tried the new stuff?','Hi! Nice to see you here!'])+'”',2.6);}};}
  update(dt){const open=S.time>=8&&S.time<20,here=CUR===this.L;this.g.visible=open&&here;if(!open)return;
    if(this.wait>0){this.wait-=dt;this.moving=false;}
    else{if(this.next<0){const nb=this.cfg.adj[this.i].filter(j=>!SHOPPERS.some(o=>o!==this&&o.L===this.L&&(o.i===j||o.next===j)));this.next=nb.length?pick(nb):this.i;}   /* 🛍️ never two shoppers on one spot (one hid the other's 👋 Say hi) */
      const t=this.cfg.spots[this.next],tx=this.L.ox+t[0],tz=this.L.oz+t[1],dx=tx-this.x,dz=tz-this.z,d=Math.hypot(dx,dz);
      if(d<.1){this.i=this.next;this.next=-1;this.wait=rand(2,6);this.face=t[2]||this.face;
        if(this.i===this.cfg.buy){this.wait=4;if(here){floatText(pick(['🛍️','🪙','💕']),this.x,2.2,this.z,{h:.5});const k=KEEPERS.find(q=>q.L===this.L);if(k)k.p.wave=1.2;}}}
      else if(here&&wkBlocked(this,dx/d,dz/d)){this.moving=false;this.pb=(this.pb||0)+dt;if(this.pb>1.6){this.pb=0;this.next=this.i;}}   /* (run 4 finish: like a passer-by, a step before you and then back the other way; a shopper waited 0.9 m from the camera at the shop's door) */
      else{const sp=Math.min(d,1.1*dt),nx=this.x+dx/d*sp,nz=this.z+dz/d*sp,bl=SHOPPERS.some(o=>o!==this&&o.L===this.L&&Math.hypot(o.x-nx,o.z-nz)<.7&&Math.hypot(o.x-nx,o.z-nz)<Math.hypot(o.x-this.x,o.z-this.z));
        if(bl){this.moving=false;this.wait=rand(.5,1.2);this.blk=(this.blk||0)+1;if(this.blk>=3){this.blk=0;this.next=this.i;}}   /* 🛍️ someone in the way: wait, then go back */
        else{this.blk=0;this.x=nx;this.z=nz;this.face=Math.atan2(dx,dz);this.moving=true;}}}
    if(!here)return;if(this.next>=0&&this.wait<=0&&Math.hypot(this.x-camera.position.x,this.z-camera.position.z)<1.3)this.g.visible=false;   /* (run 4 finish: on its way, right at the camera, it waits unseen for that moment, like a passer-by in town: a head and a body filled the left sixth of the Toy Store's view) */this.g.position.set(this.x,0,this.z);this.g.rotation.y=angLerp(this.g.rotation.y,this.face,Math.min(1,dt*7));animPerson(this.p,dt,this.moving);this.target.x=this.x;this.target.z=this.z;}}
function buildShoppers(){for(const id in SHOP_SPOTS){const cfg=SHOP_SPOTS[id],L=LOC[id];if(!L)continue;
    cfg.spots=cfg.spots.filter(s=>!L.cols.some(c=>pushOut(L.ox+s[0],L.oz+s[1],.3,c)));
    cfg.adj=cfg.spots.map((a,i)=>cfg.spots.map((b,j)=>j).filter(j=>j!==i&&segFree(L,cfg.spots[i],cfg.spots[j])));
    for(let k=0;k<cfg.n;k++)SHOPPERS.push(new Shopper(id,cfg));}}
const SITTERS=[];
function randomLook(){const kid=Math.random()<.35;return{skin:pick(['#ffe0c2','#f5cfb0','#f6d3bb','#d9a06b','#c98d63','#8a5a3c']),hair:pick(['#1f1a2e','#3d2c5e','#5a3a24','#9a6a43','#e8734a','#f2d16b','#d8d8e4']),
  style:pick(['short','bob','long','ponytail','bun','pigtails','curly']),top:pick(['#7cc8ff','#ff8a6b','#ffd45c','#b79cff','#5fd4b0','#ff9ec4','#ffffff','#c9f2e3','#e6dbff']),
  bottom:pick(['#4a4f7a','#3f4c86','#5b5f8c','#ffffff','#7cc8ff','#9a6a43','#6b6f8e']),shoes:pick(['#2e2347','#ffffff','#ff7aa8','#3d2c5e','#9a6a43']),scale:kid?rand(.88,.95):rand(1.06,1.17),dress:Math.random()<.25};}
function buildTownfolk(){const homes=[27,29,31,33,27,29,31,31,29,27,31];[0,1,2,3,4,5,6,10,11,12,13].forEach((li,i)=>WALKERS.push(new Walker(TOWNFOLK[li],homes[i],i<2)));
  const more=['hN1','hN2','hN3','hS1','hS2','hS3','aptW','aptW','aptW','hN2','hS1','aptW','hS3'];more.forEach((h,i)=>WALKERS.push(new Walker(randomLook(),WPN[h],i===0)));
  const B=LOC.city.benches;[[TOWNFOLK[7],B[0]],[TOWNFOLK[8],B[2]],[TOWNFOLK[9],B[3]]].forEach(([lk,b])=>{const p=makePerson(lk);sitPose(p);bakePerson(p);
    const sc=lk.scale||1,fx=Math.sin(b.ry),fz=Math.cos(b.ry),st=b.b&&b.b.seats[0],sx=st?st.x:b.x,sz=st?st.z:b.z;if(b.b)b.b.sit[0]=()=>sittersOut();   /* 🪑 on one seat (the left one), so you can sit beside them */
    p.root.position.set(sx-fx*.06,.55-.62*sc,sz-fz*.06);p.root.rotation.y=b.ry;scene.add(p.root);
    const s={p,x:sx,z:sz,t:Math.random()*6};s.target={x:sx+fx*.4,z:sz+fz*.4,r:2.2,icon:'👋',label:'Say hi',obj:p.root,act:()=>{p.wave=1.2;SFX.talk();toast('“'+pick(SIT_LINES)+'”',2.6);}};SITTERS.push(s);colC(LOC.city,sx-LOC.city.ox,sz-LOC.city.oz,.01);});}

/* ---- shop people, pen animals, litter ---- */
function buildActors(){
  for(const d of FRIENDS)FRIEND_ACTORS.push(new Friend(d));
  const k1=makePerson({skin:'#f5cfb0',hair:'#9a6a43',style:'bun',top:'#7cc8ff',bottom:'#3d4a7a',shoes:'#3d2c5e',apron:'#ffffff'});
  const k2=makePerson({skin:'#c98d63',hair:'#2e2347',style:'ponytail',top:'#ff9ec4',bottom:'#5b5f8c',shoes:'#3d2c5e',apron:'#ffd45c'});
  const k3=makePerson({skin:'#f6d3bb',hair:'#ff8a6b',style:'bun',top:'#7fdcb5',bottom:'#5b5f8c',shoes:'#3d2c5e',apron:'#ffffff'});
  const k4=makePerson({skin:'#c98d63',hair:'#2e2347',style:'short',top:'#ff8a6b',bottom:'#3f4c86',shoes:'#3d2c5e',apron:'#7fdcb5'});
  const k5=makePerson({skin:'#f6d3bb',hair:'#b79cff',style:'bun',top:'#ff7aa8',bottom:'#2e2347',shoes:'#ffffff',dress:true,glasses:'glasses'});
  const k6=makePerson({skin:'#ffe0c2',hair:'#e8734a',style:'curly',top:'#7cc8ff',bottom:'#ffd45c',shoes:'#ff7aa8',hat:'cap',hatc:'#ff6b6b'});
  const k7=makePerson({skin:'#d9a06b',hair:'#3d2c5e',style:'bun',top:'#ffffff',bottom:'#c98f5e',shoes:'#3d2c5e',apron:'#ffd6a8',hat:'chef'});
  const k8=makePerson({skin:'#f5cfb0',hair:'#9a6a43',style:'short',top:'#ff9ec4',bottom:'#ffffff',shoes:'#7cc8ff',apron:'#ffffff'});
  const k9=makePerson({skin:'#c98d63',hair:'#d8d8e4',style:'bun',top:'#b79cff',bottom:'#3f4c86',shoes:'#3d2c5e',dress:true,glasses:'glasses'});
  const k10=makePerson({skin:'#f6d3bb',hair:'#5a3a24',style:'short',top:'#5fd4b0',bottom:'#3f4c86',shoes:'#3d2c5e',glasses:'glasses'});
  const k11=makePerson({skin:'#8a5a3c',hair:'#1f1a2e',style:'short',top:'#3d4a7a',bottom:'#3d4a7a',shoes:'#2e2347',hat:'helmet'});
  const k12=makePerson({skin:'#f2d3b3',hair:'#f2c14e',style:'short',top:'#ffffff',bottom:'#2e2347',shoes:'#2e2347',apron:'#ff7a1f',hat:'chef',eyes:'sparkle'});
  const k13=makePerson({skin:'#f2d3b3',hair:'#9a6a43',style:'bun',top:'#7fdcb5',bottom:'#3f4c86',shoes:'#3d2c5e',dress:true,glasses:'glasses'});
  const chat=lines=>()=>toast('“'+pick(lines)+'”',3.4);
  for(const [p,L,x,z,name,shop] of [[k1,LOC.market,4.9,.95,'Mr. Bun','market'],[k2,LOC.pets,-4.9,.95,'Ms. Paws','pets'],[k3,LOC.flowers,4.1,.95,'Ms. Petal','flowers'],[k4,LOC.cafe,.3,-4.0,'Mr. Mocha','cafe'],[k5,LOC.clothes,3.6,1.25,'Ms. Stitch','clothes'],[k6,LOC.toys,-4.6,.2,'Mr. Toby','toys'],[k7,LOC.bakery,2.0,-4.2,'Mrs. Crumb','bakery'],[k8,LOC.icecream,2.1,-4.2,'Mr. Sprinkles','icecream'],
    [k9,LOC.library,4.4,1.2,'Ms. Page',(c=>()=>shopOpen('library')?c():toast(`“Shh… the library is closed now. 🌙 Come back at ${DAY_ON}:00 ☀️”`,3.4))(chat(['Shh! Find a book you like. 📚','Books are like magic doors! ✨','Try the shelves. Every book has a fun fact!']))],
    [k10,LOC.school,-5.25,-3.5,'Mr. Owl',chat(['Welcome to school! Tap the fun facts board to learn something. ✏️','The classrooms are down the hall: Math, English and History! 📚','Did you do your homework? Just kidding! 😄'])],
    [k13,LOC.school,5.25,-3.5,'Mrs. Maple',()=>tcTalk()],
    [k11,LOC.fire,1.4,1.0,'Chief Sparky',chat(['Hi! Want to slide down the fire pole? 🚒','Remember: never play with matches! 🔥','If you see smoke, tell a grown-up right away!'])],
    [k12,LOC.pizza,2.0,-3.95,'Chef Blaze',()=>chefTalk()]]){
    bakePerson(p);p.root.position.set(L.ox+x,(p===k7||p===k8)?.2:0,L.oz+z);L.g.parent.add(p.root);const tg=label(name,.3);tg.position.y=(p===k7||p===k12)?2.42:1.95;p.root.add(tg);   /* 🧁 behind the high cases the keepers stand on a little step */
    const k={p,L,x:L.ox+x,z:L.oz+z,name};KEEPERS.push(k);colC(L,x,z,(p===k10||p===k13)?.8:.5);   /* a bit of room round people, so you don't press your nose into them (the two teachers fill their corners: nobody squeezes in behind them) */
    inter(L,{x,z:z+1.1,r:2.2,icon:typeof shop==='function'?'💬':'🛒',label:'Talk to '+name,act:()=>{p.wave=1.2;SFX.talk();if(typeof shop==='function')shop();else if(shop==='clothes')openClothes();else openShop(shop);},obj:p.root});}
  {const p=makePerson({skin:'#d9a06b',hair:'#3d2c5e',style:'short',top:'#ffffff',sleeve:'#ff8a6b',bottom:'#5a5f8c',shoes:'#3d2c5e',hat:'cap',hatc:'#ff6b6b',apron:'#ff6b6b',eyes:'happy',mouth:'grin'});   /* 🍔 Mr. Patty in the food truck */
    bakePerson(p);const L=LOC.city,x=L.ox+TRUCK.x+.2,z=L.oz+TRUCK.z-.35;p.root.position.set(x,.5,z);p.root.rotation.y=Math.PI/2;scene.add(p.root);const tg=label('Mr. Patty',.3);tg.position.y=1.95;p.root.add(tg);KEEPERS.push({p,L,x,z,name:'Mr. Patty'});}
  {const ct=LOC.pizza.inter.find(t=>t.label==='Talk to Chef Blaze');if(ct){ct.icon=()=>dlWaiting()?'🍕':'💬';ct.label=()=>dlWaiting()?'Pick up the pizza':'Talk to Chef Blaze';}}
  const L=LOC.pets;
  L.pens.forEach((pen,i)=>{const kinds=pen.kinds||[pen.type,pen.type];kinds.forEach((t,k)=>{const col2=PET_TYPES[t].cols[t===pen.type&&k>0?1:0];const m=makePet(t,col2);scene.add(m.root);
    const a={m,t,col:col2,x:L.ox+rand(pen.x0,pen.x1),z:pen.pz!==undefined?L.oz+pen.pz:L.oz+rand(pen.z0,pen.z1-(pen.y?0:.45)),tx:0,tz:0,wt:0,pen,face:0,moving:false};
    const o=PEN.find(b=>b.pen===pen);for(let n=0;n<8&&o&&Math.hypot(o.x-a.x,o.z-a.z)<1;n++){a.x=L.ox+rand(pen.x0,pen.x1);a.z=pen.pz!==undefined?L.oz+pen.pz:L.oz+rand(pen.z0,pen.z1-(pen.y?0:.45));}a.tx=a.x;a.tz=a.z;   /* the two start apart */
    a.target={x:0,z:0,r:3.9,icon:'💗',label:()=>'Adopt '+anA(PET_TYPES[t].name),act:()=>openAdopt(t,col2),obj:m.root};PEN.push(a);});});
}
function updatePen(dt){for(const a of PEN){a.wt-=dt;const os=PEN.filter(b=>b!==a&&b.pen===a.pen),fr=a.pen.y?0:.45;   /* 🐶 not nose-first at the front fence, and never inside another one (run 4, stage 3: any of them, not only the first; 85 cm between them, a kitten's length) */
  if(a.wt<=0){a.wt=rand(1.5,5);const L=LOC.pets,sm=a.pen.y?0:.25;for(let k=0;k<8;k++){a.tx=L.ox+rand(a.pen.x0+sm,a.pen.x1-sm);a.tz=a.pen.pz!==undefined?L.oz+a.pen.pz:L.oz+rand(a.pen.z0,a.pen.z1-fr);if(os.every(o=>Math.hypot(a.tx-o.tx,a.tz-o.tz)>1.05))break;}}
  const dx=a.tx-a.x,dz=a.tz-a.z,d=Math.hypot(dx,dz);if(d>.08){const s=Math.min(d,.9*dt),nx=a.x+dx/d*s,nz=a.z+dz/d*s;
    if(!a.pen.y&&os.some(o=>{const e=Math.hypot(nx-o.x,nz-o.z);return e<.85&&e<Math.hypot(a.x-o.x,a.z-o.z);})){a.moving=false;a.wt=Math.min(a.wt,.3);}
    else{a.x=nx;a.z=nz;a.face=Math.atan2(dx,dz);a.moving=true;}}else a.moving=false;
  if(!a.pen.y){const L=LOC.pets;for(const o of os){const ex=a.x-o.x,ez=a.z-o.z,e=Math.hypot(ex,ez);if(e<.85&&e>1e-4){const k=(.85-e)/2;a.x=clamp(a.x+ex/e*k,L.ox+a.pen.x0,L.ox+a.pen.x1);a.z=clamp(a.z+ez/e*k,L.oz+a.pen.z0,L.oz+a.pen.z1);}}}
  if(a.pen.pz!==undefined&&!a.moving)a.face=Math.PI;   /* 🦉 a perched owl faces the room (run 4 finish: it walked the pen in the air and stopped facing the wall) */a.m.root.position.set(a.x,(a.pen.y||0)-(a.pen.swim?.12:0),a.z);a.m.root.rotation.y=angLerp(a.m.root.rotation.y,a.face,.12);animPet(a.m,dt,a.moving&&!a.pen.swim);a.target.x=a.x;a.target.z=a.z;}}   /* 🦆 in their water the ducks swim: low in it, legs under the surface, no waddle (run 4 finish: they stood on it on orange legs) */
function spawnLitter(){
  for(const l of LITTER)LOC.city.dyn.remove(l.g);LITTER=[];
  if(S.litter.day!==S.day)S.litter={day:S.day,got:[]};
  const r=seeded(S.day*31+5),idx=LITTER_SPOTS.map((_,i)=>i);for(let i=idx.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
  for(const k of idx.slice(0,10)){if(S.litter.got.includes(k))continue;const [x,z]=LITTER_SPOTS[k];const g=new THREE.Group();g.position.set(x,0,z);
    const kind=['can','paper','peel','cup'][k%4];g.userData.kind=kind;   /* 🥤📄🍌☕ run 4, item 11: soda cans, crumpled paper, banana peels and coffee cups */
    if(kind==='can'){const c=['#ff6b6b','#7cc8ff','#7fdcb5','#ffd45c'][k%4^(k>>2)%4];cyl(g,.034,.034,.12,c,0,.034,0,{rz:Math.PI/2,ry:.4+k,center:true,seg:10,ol:.012});cyl(g,.03,.03,.012,'#c8cde0',.062*Math.cos(.4+k),.034,-.062*Math.sin(.4+k),{rz:Math.PI/2,ry:.4+k,center:true,seg:10,ol:false});}
    else if(kind==='paper'){for(const [dx,dy,dz,r] of [[0,.06,0,.065],[.045,.05,.03,.045],[-.04,.045,.035,.04],[.01,.09,-.03,.035]])sph(g,r,'#f4f1ea',dx,dy,dz,{ws:5,hs:4,ol:.01});}
    else if(kind==='peel'){cyl(g,.035,.03,.06,'#ffe27a',0,.015,0,{seg:7,ol:.01});for(let i=0;i<3;i++){const a=i*2.1+k;box(g,.045,.012,.14,'#ffd84a',Math.cos(a)*.08,.012,Math.sin(a)*.08,{ry:-a,rx:0,ol:.01});}}
    else{cyl(g,.04,.03,.11,'#ffffff',0,0,0,{seg:10,ol:.012});cyl(g,.038,.038,.025,'#c98f5e',0,.045,0,{seg:10,ol:false});cyl(g,.043,.043,.014,'#3d2c5e',0,.11,0,{seg:10,ol:.01});}
    const sp=label('✨',.32,{bg:null,bw:0,pad:4});sp.position.y=.45;g.add(sp);LOC.city.dyn.add(g);
    const it={g,k,x,z,sp};it.target={x,z,r:1.9,icon:'🗑️',label:'Pick up the litter',obj:g,act:()=>pickLitter(it)};LITTER.push(it);}
}
function pickLitter(it){LOC.city.dyn.remove(it.g);LITTER.splice(LITTER.indexOf(it),1);S.litter.got.push(it.k);S.coins+=3;S.picked++;SFX.coin();floatText('+3 🪙',it.x,1.2,it.z);qEvent('litter');addXP('clean',2);
  if(!LITTER.length)toast('The whole town is clean! You\'re a hero! 🌟');else if(S.picked===1)toast('Thanks for keeping Cozy Town clean! +3 🪙');
  if(S.picked>=5)doneTask('litter');change();}
function checkMail(){if(S.mail===S.day){toast('No new mail today. Check again tomorrow! 📭');return;}S.mail=S.day;qEvent('mail');const n=pick([10,15,20]);S.coins+=n;SFX.coin();
  toast(pick(['A postcard from Grandma with '+n+' 🪙 inside! 💌','A thank-you card from the mayor and '+n+' 🪙!','A birthday card for someone else… with '+n+' 🪙? Lucky you!']),3.6);change();}
function wish(){if(S.coins<1){SFX.no();toast('You need 1 🪙 to make a wish.');return;}S.coins--;qEvent('wish');SFX.splash();floatText('✨',P.x-Math.sin(P.yaw)*1.5,1.6,P.z-Math.cos(P.yaw)*1.5,{h:.7});toast(pick(['You made a wish! ✨','Plip! Your coin sparkles in the water. ✨','Shhh… wishes are secret! ✨']));change();}

/* ---- home furniture ---- */
function fpRect(t,x,z,r){const F=FURN[t],sw=(r%2)?F.d:F.w,sd=(r%2)?F.w:F.d;return{x1:x-sw/2,x2:x+sw/2,z1:z-sd/2,z2:z+sd/2};}
function addHomeItem(it){
  const L=LOC.home,F=FURN[furnOf(it)],up=clamp(it.f|0,0,(L.fls?L.fls.length:1)-1),ox=L.ox,oz=L.oz+UPZ*up;const g=buildFurn(furnOf(it),it.c);g.position.set(ox+it.x,0,oz+it.z);g.rotation.y=it.r*Math.PI/2;
  g.traverse(o=>{if(o.isMesh&&o.material!==OL){o.castShadow=true;o.receiveShadow=true;}});g.userData.u=it.u;g.userData.fl=up;L.items.add(g);L.vf=-1;
  const rec={it,g,col:null,inter:null};
  if(!F.flat&&!F.hang){const R=fpRect(it.t,it.x,it.z,it.r);rec.col={x1:ox+R.x1,z1:oz+R.z1,x2:ox+R.x2,z2:oz+R.z2};L.dcols.push(rec.col);}
  if(F.use){const fx=Math.sin(it.r*Math.PI/2),fz=Math.cos(it.r*Math.PI/2),reach=Math.max(F.w,F.d)/2+1.1;
    const R2=fpRect(it.t,it.x,it.z,it.r);rec.inter={x:ox+it.x,z:oz+it.z,r:1.7,rect:{x1:ox+R2.x1,z1:oz+R2.z1,x2:ox+R2.x2,z2:oz+R2.z2},obj:g,icon:{sleep:'😴',sit:'🪑',tv:'📺',lamp:'💡',piano:'🎹',fridge:'🧊',bath:'🛁',cook:'🍳',dress:'👗',shells:'🐚'}[F.use],
      label:()=>({sleep:'Sleep',sit:'Sit down',tv:rec.on?'Turn off the TV':'Watch TV',lamp:it.on?'Turn off the lamp':'Turn on the lamp',piano:'Play the piano',fridge:'Grab a snack',bath:'Take a bubble bath',cook:'Cook something',dress:'Change your look',shells:'Look at your shells'}[F.use]),
      act:()=>useFurn(rec,fx,fz)};L.inter.push(rec.inter);
    if(F.use==='lamp')setLamp(rec);}
  HOME_ITEMS.set(it.u,rec);return rec;
}
function removeHomeItem(u){const L=LOC.home,rec=HOME_ITEMS.get(u);if(!rec)return;L.items.remove(rec.g);if(rec.col)L.dcols.splice(L.dcols.indexOf(rec.col),1);if(rec.inter)L.inter.splice(L.inter.indexOf(rec.inter),1);HOME_ITEMS.delete(u);}
function setLamp(rec){rec.g.traverse(o=>{if(o.userData.shade)o.material.emissiveIntensity=rec.it.on?.6:0;});}
function rebuildHome(){for(const u of [...HOME_ITEMS.keys()])removeHomeItem(u);for(const it of S.home.items)addHomeItem(it);WALL_M.color.set(S.home.wall);setFloor(S.home.floor);}
/* ---- the big house: Decorating level 10 + BIG_PRICE coins (a big dream: about a week of work) ---- */
const BIG_PRICE=2500;
function applyHouse(){const n=homeFloors();homeShell(LOC.home,n);if(YARD.plaque)YARD.plaque.visible=n<6;}   /* your house on Friends Lane grows by itself (laneRefresh) */
/* 🏡 the house at Decorating 10 (night 3, job 7, the owner's decision 16 Oct): the downstairs stays 12x10 and nothing moves; the upstairs is a
   12x10 room with the same stairs. Price and level stay. A bigger house from before shrinks once, when the save loads: the push-apart is undone
   (x/1.5, z/1.4), every piece is kept inside the walls, in the order it is saved; a piece that overlaps one already kept, or does not fit, goes to
   📦 My stuff with its colour, to place again. Rugs and other flat things never block. The old layout is kept in the save (S.home.old) */
function homeBlocked(R,fl){return(homeFloors()>1&&R.x1<-HOMEW+3&&R.z1<1.4&&R.z2>-1.4)||(fl===0&&((R.x1<1.1&&R.x2>-1.1&&R.z2>HOMED-1.6)||(R.x1<HOMEGX+1.1&&R.x2>HOMEGX-1.1&&R.z1<-HOMED+1.6)));}
function houseShrink(){const h=S.home;if(!S.bighouse||h.shrunk||!Array.isArray(h.items))return 0;
  h.old={t:Date.now(),items:JSON.parse(JSON.stringify(h.items)),store:JSON.parse(JSON.stringify(h.store||[]))};
  const W=6,D=5,kept=[],moved=[];
  for(const it of h.items){const F=FURN[furnOf(it)];if(!F){kept.push(it);continue;}const fl=it.f?1:0;
    const sw=(it.r%2?F.d:F.w)/2,sd=(it.r%2?F.w:F.d)/2;
    let x=Math.round(it.x/1.5*4)/4,z=Math.round(it.z/1.4*4)/4;x=clamp(x,-W+sw+.02,W-sw-.02);z=clamp(z,-D+sd+.02,D-sd-.02);it.x=Math.round(x*100)/100;it.z=Math.round(z*100)/100;
    if(F.flat||F.hang){kept.push(it);continue;}
    const R=fpRect(it.t,it.x,it.z,it.r);let ok=!homeBlocked(R,fl)&&R.x1>=-W-.001&&R.x2<=W+.001&&R.z1>=-D-.001&&R.z2<=D+.001;
    if(ok)for(const o of kept){if((o.f?1:0)!==fl||FURN[furnOf(o)].flat||FURN[furnOf(o)].hang)continue;const Q=fpRect(o.t,o.x,o.z,o.r);if(R.x1<Q.x2-.01&&R.x2>Q.x1+.01&&R.z1<Q.z2-.01&&R.z2>Q.z1+.01){ok=false;break;}}
    if(ok)kept.push(it);else{delete it.f;it.mv=1;moved.push(it);}}
  h.items=kept;h.store=(h.store||[]).concat(moved);h.shrunk=1;h.shrinkN=moved.length;
  if(S.loc==='home'){const ox=LOC.home.ox,oz=LOC.home.oz,dx=S.px-ox,dz=S.pz-oz;if(dx>W||dx<-W||Math.abs(dz)>D){S.px=ox-3.4;S.pz=oz;S.yaw=-Math.PI/2;}}   /* saved upstairs or in the old big room: you start by the stairs */
  return moved.length;}
const storeWaiting=()=>S&&S.home&&S.home.store?S.home.store.filter(it=>it.mv).length:0;
const cozierLine=n=>`Your house got cozier! 🏡 ${n?`${n} thing${n>1?'s are':' is'} waiting in 📦 My stuff to be placed again.`:'Everything still fits!'}`;
function openBigHouse(){const n=homeFloors();if(n>=6){toast('🏡 Six floors! Your house is as tall as it gets 🎉',3);return;}
  const need=10*n,lv=sk('decor').lv,ok=lv>=need&&S.coins>=BIG_PRICE;   /* 🏡 run 4, item 22: floor 2 at decorating 10, 3 at 20 … 6 at 50, the same price each time */
  openPanel(`<div class="hd"><h2>🏡 ${n===1?'Bigger house':'One more floor'}</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    <p class="ph-sub"><b>Floor ${n+1} of 6!</b> ${n===1?'Stairs up to a whole second floor to decorate! Your downstairs stays just as it is: nothing moves.':'The stairs go on up. Everything you have stays where it is.'}</p>
    <div class="ph-row"><span>🛋️ Decorating level ${need}</span><span>${lv>=need?'✅':'level '+lv}</span></div>
    <div class="ph-row"><span>🪙 ${BIG_PRICE} coins</span><span>${S.coins>=BIG_PRICE?'✅':S.coins+' / '+BIG_PRICE}</span></div>${S.coins<BIG_PRICE?`<div class="coinbar" aria-hidden="true"><i style="width:${Math.round(100*S.coins/BIG_PRICE)}%"></i></div>`:''}
    ${ok?`<div class="row" style="justify-content:center;margin-top:12px"><button class="btn mint" data-a="bighouse">🏡 ${n===1?'Buy it!':'Add the floor!'}</button></div>`
      :`<p class="ph-sub" style="margin-top:12px">${lv<need?'Put furniture in your house to level up Decorating 🛋️':'Keep saving your coins 🪙'}</p>`}`,{bottom:true});}
/* 🎨 the outside of your house, any colour (run 4, item 23): 12 ready colours and a "pick any colour" slider; free; everyone sees it through the lane fields (hc) */
const HOUSE_COLS=[['#b79cff','Purple'],['#ffd6e0','Pink'],['#bfe6ff','Blue'],['#b5e3a1','Green'],['#fff1b8','Yellow'],['#ffe0c4','Peach'],['#e6dbff','Lilac'],['#bff0dc','Mint'],['#ffb3a7','Coral'],['#9fd0ff','Sky'],['#fff7e6','Cream'],['#ffffff','White']];   /* (run 4, stage 3: Green and Sky were almost Mint and Blue) */
const houseCol=()=>S&&S.home&&HEX.test(S.home.col||'')?S.home.col:null;
function openHousePaint(){const cur=houseCol();
  openPanel(`<div class="hd"><h2>🎨 House colour</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><p class="note">Paint the outside of your house. Everyone on Friends Lane sees it!</p>
    <div class="dots">${HOUSE_COLS.map(([c,n])=>`<button class="dotb${houseColNow()===c?' on':''}" data-a="hcol:${c}" aria-label="${n}"><i style="background:${c}"></i>${n}</button>`).join('')}</div>
    <div class="opt" style="margin-top:10px"><span>Pick any colour</span><input type="range" id="hcHue" min="0" max="360" value="${Math.round(hexHue(houseColNow()))}" aria-label="Any colour" style="flex:1;min-width:140px"></div>
    <div class="opt"><span>Your house now</span><i id="hcNow" class="hcNow" style="background:${houseColNow()}" aria-hidden="true"></i></div>
    <div class="row" style="justify-content:center;margin-top:8px"><button class="dotb lane${cur?'':' on'}" id="hcLane" data-a="hcol:" aria-label="The lane's own colour"><i style="background:${laneOwnCol()}"></i>🏡 The lane's own colour</button></div>`,{cls:'setcard hpaint'});   /* (run 4, stage 3: the colour the house has now is marked, the lane's own colour is a colour like the others, not a button with a tick that read as a status) */
  const sl=$('hcHue');if(sl)sl.addEventListener('input',()=>setHouseCol(hslHex(+sl.value,.72,.82)),{passive:true});}
function hexHue(h){const r=parseInt(h.slice(1,3),16)/255,g=parseInt(h.slice(3,5),16)/255,b=parseInt(h.slice(5,7),16)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;if(!d)return 0;let hu=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;return (hu*60+360)%360;}
function hslHex(h,s,l){const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;let r=0,g=0,b=0;if(h<60){r=c;g=x;}else if(h<120){r=x;g=c;}else if(h<180){g=c;b=x;}else if(h<240){g=x;b=c;}else if(h<300){r=x;b=c;}else{r=c;b=x;}return'#'+[r,g,b].map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('');}
function laneOwnCol(){return LANE_PAL[hashStr((S.name||'').toLowerCase())%LANE_PAL.length][0];}
function houseColNow(){return houseCol()||laneOwnCol();}   /* the colour the house shows right now (yours, or the lane's own for your name) */
function setHouseCol(c){if(c&&!HEX.test(c))return;if(c)S.home.col=c;else delete S.home.col;change();laneRefresh(true);const sw=$('hcNow');if(sw)sw.style.background=houseColNow();
  const now=houseColNow();for(const b of document.querySelectorAll('#card .dotb'))b.classList.toggle('on',b.id==='hcLane'?!c:b.dataset.a==='hcol:'+now);const sl=$('hcHue');if(sl&&document.activeElement!==sl)sl.value=Math.round(hexHue(houseColNow()));}
function setFloor(k){if(FLOOR_M.map)FLOOR_M.map.dispose();FLOOR_M.map=floorTex(k);FLOOR_M.map.repeat.set(HOMEW/2,HOMED/2);FLOOR_M.needsUpdate=true;}
let tvT=0,tvLast=-1;
function useFurn(rec,fx,fz){const F=FURN[furnOf(rec.it)];
  switch(F.use){
    case 'sleep':return sleep(rec,fx,fz);
    case 'sit':P.sit={x:rec.g.position.x+fx*.1,z:rec.g.position.z+fz*.1,yaw:rec.it.r*Math.PI/2+Math.PI};P.x=P.sit.x;P.z=P.sit.z;P.yaw=P.sit.yaw;P.pitch=-.05;SFX.pop();toast('Comfy! Move to stand up.');return;
    case 'tv':rec.on=!rec.on;SFX.tap();if(rec.on){rec.t0=tvT;toast(pick(['A dancing cat! 🐱','The funny cat show! 😹','Kitty is dancing! 🎶','Meow meow dance party! 🐾']));}return;
    case 'lamp':rec.it.on=rec.it.on?0:1;setLamp(rec);SFX.tap();change();return;
    case 'piano':if(cool('piano',2.5))addXP('music',3);playTune();floatText('🎵',rec.g.position.x,1.6,rec.g.position.z,{h:.6});toast('🎶 La la la!');return;
    case 'fridge':return openBag();
    case 'dress':return openCreator('edit');
    case 'bath':SFX.splash();floatText('🫧',rec.g.position.x,1.2,rec.g.position.z,{h:.7});toast('Splish splash! So many bubbles! 🫧');return;
    case 'cook':return openRecipes();
    case 'clock':{const h=Math.floor(S.time),m=Math.floor((S.time%1)*60);SFX.tap();toast('🕰️ Tick tock! It\'s '+h+':'+String(m).padStart(2,'0')+'.');return;}
    case 'fire':SFX.pop();floatText('🔥',rec.g.position.x,1.3,rec.g.position.z,{h:.6});toast(pick(['So warm and cozy! 🔥','Crackle crackle… 🪵','You warm your hands by the fire. ✨']));return;
    case 'game':SFX.yay();floatText('🎮',rec.g.position.x,1.5,rec.g.position.z,{h:.6});toast(pick(['You beat level 1! 🏆','New high score! ⭐','You found a secret level! 🗝️','Your team won the race! 🏁']));return;
    case 'shells':{const n=(S.beach&&S.beach.n)|0;SFX.pop();floatText('🐚',rec.g.position.x,1.85,rec.g.position.z,{h:.5});
      toast(n?'🐚 You have '+n+(n>1?' shells!':' shell!')+(n<SHELF_T[SHELF_T.length-1]?' Find more at the 🏖️ beach to fill your shelf.':' Your shelf is full of treasures! ✨'):'🐚 No shells yet! Find pretty shells at the 🏖️ beach.',3.6);return;}
    case 'wash':SFX.splash();floatText('🫧',rec.g.position.x,1.2,rec.g.position.z,{h:.6});toast(pick(['Squeaky clean! ✨','Bubbles everywhere! 🫧','All washed and sparkly! 💦']));return;
  }
}
function updTVs(dt){tvT+=dt;const atHome=CUR===LOC.home,tick=tvT-tvLast>=1/24;if(tick)tvLast=tvT;
  for(const rec of HOME_ITEMS.values())if(FURN[rec.it.t].use==='tv'){if(rec.on&&(tvT-(rec.t0||0))*2.2>=TV_SHOW)tvEnd(rec);const on=!!rec.on;if(on?!(atHome&&tick):rec.drawnOff)continue;rec.drawnOff=!on;
    rec.g.traverse(o=>{if(o.userData.ctx){drawCatTV(o.userData.ctx,tvT-(rec.t0||0),on);o.userData.tex.needsUpdate=true;}});}
  tvTune();}
/* 🎶 the dancing cat's music: a little tune for each of the cat's 5 moves (8 beats each, on the cat's own beat: 2.2 a second), with a soft
   bass, a soft drum on the beat and a tiny tick between. It plays only while you are home on the TV's floor and near it (softer further
   away, silent from 7 m, never from bed), and every show ends by itself after 5 rounds of the dance (about 1½ minutes) */
const TV_SHOW=200,TVM={near:null,rec:null,e:0};   /* TV_SHOW: beats in a show */
const TV_MEL=[[0,-1,4,7,12,-1,7,-1,9,7,4,7,5,4,2,-1],[5,-1,9,-1,12,-1,9,-1,7,-1,4,-1,7,9,7,-1],[9,-1,12,9,-1,7,-1,4,7,-1,11,7,-1,4,2,-1],
  [0,4,7,12,2,5,9,14,4,7,11,16,5,9,12,16],[7,-1,14,-1,7,-1,14,-1,12,-1,11,-1,9,-1,7,-1]];   /* eighth notes, steps up from C5 (-1: rest) */
const TV_BAS=[[0,7,0,7,5,0,7,2],[5,0,5,0,0,7,0,7],[9,4,9,4,7,2,7,2],[0,7,2,9,4,11,5,0],[7,2,7,2,7,2,7,2]];   /* one per beat, steps up from C3 */
function tvTune(){let best=null,bd=7;
  if(PLAYING&&CUR===LOC.home){const fl=homeFl();for(const rec of HOME_ITEMS.values())if(rec.on&&FURN[rec.it.t].use==='tv'&&(rec.g.userData.fl|0)===fl){const d=Math.hypot(rec.g.position.x-P.x,rec.g.position.z-P.z);if(d<bd){bd=d;best=rec;}}}
  TVM.near=best;const k=clamp(1-(bd-2.5)/4.5,0,1);if(!best||!AC||!SET.sound||zzIn()||k<.03){TVM.rec=null;return;}
  const B=(tvT-(best.t0||0))*2.2,e1=Math.min(TV_SHOW*2-1,Math.floor((B+.3)*2));   /* the eighths up to about 0.14 s ahead */
  if(TVM.rec!==best||e1<TVM.e||e1-TVM.e>4){TVM.rec=best;TVM.e=Math.ceil(B*2-.45)-1;}   /* (re)start right where the cat is: a note less than 0.1 s late still plays (the first beat too), no catch-up burst after a hiccup */
  for(let e=TVM.e+1;e<=e1;e++){const w=Math.max(0,(e/2-B)/2.2),mv=Math.floor(e/16)%5,i=e%16,m=TV_MEL[mv][i];
    if(m>=0)tone(523.25*Math.pow(2,m/12),.2,'triangle',.045*k,w);
    if(i%2){tone(2400,.03,'triangle',.012*k,w);continue;}
    tone(130.81*Math.pow(2,TV_BAS[mv][i/2]/12),.26,'sine',.065*k,w);tone(150,.11,'sine',.055*k,w,55);}
  TVM.e=Math.max(TVM.e,e1);}
function tvEnd(rec){rec.on=false;if(rec!==TVM.near||zzIn())return;TVM.rec=null;
  [523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,.45,'triangle',.06,i*.08));tone(130.81,.6,'sine',.08,.24);
  toast('📺 The end! The dancing cat takes a bow 🐱👋 Tap the TV to watch again.',3.6);}

/* 🎓 pizza job tips: Chef Blaze shows the new player where everything is */
const TUT_STEPS=[   /* 🖼️ run 4, job 14: 5 picture steps, almost no reading (the old long tips live on in the pictures) */
  {t:'Pizza delivery 🍕',x:'A message dings. Read it!',pic:'p1'},
  {t:'Follow the dot 🗺️',el:'mmBtn',x:'The dot is the house. The arrow is you.',pic:'p2'},
  {t:'Ring the bell 🚪',x:'Find the door and tap it.',pic:'p3'},
  {t:'Be quick! ⚡',x:'Fast pizza = more coins.',pic:'p4'},
  {t:"Let's go! 🛵",x:'Talk to Chef Blaze at the Pizzeria.',pic:'p5'}];
/* 🖼️ run 4, job 14 (item 30): the job tutorials are pictures. tutPic(id) draws one step on a small canvas: big emoji, fat arrows and a pointing hand, a few words at most */
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
    x.fillStyle='#ff4fd8';x.beginPath();x.moveTo(70,150);x.lineTo(90,120);x.lineTo(110,150);x.closePath();x.fill();arrow(100,122,152,70,'#ff4fd8');em('👈',215,60,48);txt('The dot = the house',300,120,20);txt('The arrow = you',300,150,20);em('🗺️',330,60,40);}
  else if(id==='p3'){em('🏠',120,105,120);rr(100,120,42,62,8,'#5fd4b0',INKC);x.fillStyle='#ffd45c';x.beginPath();x.arc(132,152,4,0,6.3);x.fill();em('🍕',280,70,54);arrow(255,95,160,140);up(150,185,44);txt('Find the door, tap it',300,160,20);}
  else if(id==='p4'){em('⏱️',80,80,70);em('⚡',150,70,46);arrow(185,85,250,85);em('🪙',280,80,48);em('🪙',320,70,48);em('🪙',360,82,48);em('⭐',330,150,46);txt('Fast = more coins',150,160,22);}
  else if(id==='p5'){em('🍕',70,60,46);em('👨‍🍳',130,110,90);rr(200,40,110,60,18,'#ffffff',INKC);txt('Hi! 🍕',255,70,24);em('🛵',340,150,70);arrow(205,125,290,150);txt('Talk to Chef Blaze',120,185,20);}
  else if(id==='h1'){em('💺',130,120,100);em('🧑',130,78,60);em('🚪',300,80,70);arrow(265,110,190,118);hand(52,128,46);txt('A customer sits down',210,185,20);}
  else if(id==='h2'){rr(40,40,120,120,14,'#ffffff',INKC);em('💇',100,100,70);txt('=',200,100,46);em('🧑',300,100,80);arrow(170,60,250,60);txt('The picture = the new hair',210,185,19);}
  else if(id==='h3'){for(const [i,e] of[[0,'✂️'],[1,'🪮'],[2,'🎨']]){x.fillStyle='#ffffff';x.beginPath();x.arc(90+i*120,80,42,0,6.3);x.fill();x.lineWidth=4;x.strokeStyle=INKC;x.stroke();em(e,90+i*120,80,46);}txt('shorter',90,138,16);txt('style',210,138,16);txt('colour',330,138,16);up(210,180,44);arrow(60,180,90,130);arrow(360,180,330,130);}
  else if(id==='h4'){em('✅',90,90,86);em('⭐',210,70,44);em('⭐',260,60,44);em('⭐',310,70,44);em('🪙',260,130,46);arrow(145,100,195,100);txt('A match = stars and coins',210,185,20);}
  else if(id==='f1'){rr(30,28,260,80,20,'#ffffff',INKC);em('📸',55,68,34);txt('Mia · Cozy Park',186,55,20);txt('family photo · the fountain',188,86,15);em('🔔',330,44,40);arrow(330,80,300,135);up(270,165,46);txt('Ding! A booking: read it!',130,190,19);}
  else if(id==='f2'){rr(40,25,150,150,16,'#dff3d0',INKC);x.fillStyle='#c9bfe8';for(const k of[60,105,150])x.fillRect(40,k,150,12);for(const k of[80,130])x.fillRect(k,25,12,150);x.fillStyle='#ff3b3b';x.beginPath();x.arc(165,60,11,0,6.3);x.fill();
    x.fillStyle='#ff4fd8';x.beginPath();x.moveTo(70,150);x.lineTo(90,120);x.lineTo(110,150);x.closePath();x.fill();arrow(100,122,152,70,'#ff4fd8');em('📸',300,70,70);txt('Walk to the dot',300,150,22);}
  else if(id==='f3'){em('🧑',90,90,70);em('🧑',170,90,70);em('🧒',250,98,60);em('👋',60,40,34);em('✌️',200,38,34);em('🦘',280,46,34);up(170,170,44);txt('Tap a person: pick a pose',300,170,18);em('🏞️',360,70,54);}
  else if(id==='f4'){rr(60,30,300,150,16,'#ffffff',INKC);em('🧑',150,110,60);em('🧑',220,110,60);em('🧒',280,118,52);txt('everyone in!',210,55,20,'#ff4d8d');em('📸',395,60,40);arrow(390,95,350,140);txt('Snap!',395,165,20);}
  const url=c.toDataURL('image/png');TUTPICS.set(id,url);return url;}
let tutT=0;
function tutStart(){if(TUT||!PLAYING)return;if(UI.open)closePanel();TUT={i:0};$('tut').hidden=false;tutShow();}
function tutShow(){if(!TUT)return;const STEPS=TUT.steps||TUT_STEPS,st=STEPS[TUT.i],el=st.el?$(st.el):null,hole=$('tutHole'),card=$('tutCard');card.querySelector('.tutAv').textContent=TUT.hs?'✂️':TUT.pt?'📸':'👨‍🍳';
  $('tutT').textContent=st.t;{const pic=$('tutPic');if(st.pic){pic.src=tutPic(st.pic);pic.hidden=false;}else pic.hidden=true;}   /* 🖼️ the step's picture (run 4, job 14) */
  $('tutX').innerHTML=esc(st.x)+(st.demo?'<span class="tutDemo"><span class="ni">🍕</span><span><b>📩 Common order — hurry!</b>Mia wants a cheese pizza at the Pink house. ⏱️ 2 minutes!</span></span>':'');
  $('tutNext').textContent=TUT.i===STEPS.length-1?(TUT.hs?"Let's go! ✂️":TUT.pt?"Let's go! 📸":"Let's go! 🛵"):'Next ›';$('tutDots').innerHTML=STEPS.map((_,i)=>`<i class="${i===TUT.i?'on':''}"></i>`).join('');
  const rc=el&&!el.hidden&&el.offsetParent!==null?el.getBoundingClientRect():null,ch=card.offsetHeight,pad=8;
  if(rc&&rc.width>0){hole.classList.remove('none');Object.assign(hole.style,{left:rc.left-pad+'px',top:rc.top-pad+'px',width:rc.width+pad*2+'px',height:rc.height+pad*2+'px'});
    const below=rc.bottom+pad+14;card.style.top=(below+ch<innerHeight-8?below:Math.max(8,rc.top-pad-14-ch))+'px';}
  else{hole.classList.add('none');card.style.top=Math.max(8,(innerHeight-ch)/2)+'px';}SFX.tap();}
function tutEnd(){const hsT=!!(TUT&&TUT.hs),ptT=!!(TUT&&TUT.pt);TUT=null;$('tut').hidden=true;if(S){if(hsT)S.hsTut=1;else if(ptT)S.ptTut=1;else S.tutDone=1;change();}}
$('tutNext').addEventListener('click',e=>{e.stopPropagation();if(!TUT)return;TUT.i++;if(TUT.i>=(TUT.steps||TUT_STEPS).length){tutEnd();SFX.yay();}else tutShow();});
$('tutSkip').addEventListener('click',e=>{e.stopPropagation();tutEnd();});
addEventListener('resize',()=>{if(TUT)setTimeout(tutShow,60);});
function tutMaybe(){tutT=0;dtutT=0;}
/* 🏢 inside the apartment buildings (3 shared floors) */
const APT={get b(){return(S&&S.aptB)||'ap1';},set b(v){if(S)S.aptB=v;}};
function enterApt(id){APT.b=id;enter('apt1',id);}
function exitApt(){exitTo('apt1',APT.b);}
function pickOther(id,o){const me=o?oWho(o):null,L=resList(id).filter(w=>w!==me);return pick(L.length?L:resList(id));}
function knockFlat(f,d){const num=f*10+d,sp=FLAT_SPOT[num];if(!sp||CUT||CLIMB)return;
  if(dsFlat(num)&&!dlCarrying()){enterClient();return;}
  if(!dlCarrying()){SFX.knock();toast(pick([`Knock knock… nobody's home in flat ${num}.`,`Knock knock… someone in flat ${num} is watching cartoons! 📺`,`Knock knock… “Not today, thank you!” 😄`,`Knock knock… you hear a cat meow in flat ${num}. 🐱`]),3);return;}
  const o=dl().o;startCut(Object.assign({},sp,{id:APT.b}),o.h===APT.b&&o.flat===num);}
/* going up or down the stairs: a little climbing walk, then you're on the next floor */
let CLIMB=null,TUT=null;
function climb(f,dir){if(CLIMB||CUT||!LOC['apt'+(f+dir)])return;const L=LOC['apt'+f];P.sit=null;SFX.tap();
  CLIMB={t:0,L,dir,x0:P.x,z0:P.z,y0:P.yaw,p0:P.pitch,x1:L.ox+8.7,z1:L.oz+(dir>0?-1.475:1.475),ya:-Math.PI/2,h:2.7,st:0,fd:false,end:()=>{
    const nf=f+dir,L=LOC['apt'+nf];setLoc('apt'+nf);P.x=L.ox+5;P.z=L.oz+(dir>0?1.4:-1.4);P.yaw=Math.PI/2;P.pitch=0;bringFollowers();saveLocal();
    toast(`🏢 Floor ${nf} · flats ${nf}1–${nf}5`,2.6);}};}
/* the climb (flats and the big house): walk onto the stairs, step by step up (or down), then the next floor. Stops if something else moved you away */
function climbUpdate(dt){const C=CLIMB;if(CUR!==C.L){CLIMB=null;P.cy=0;return;}C.t+=dt;const T=1.6,k=clamp(C.t/T,0,1),e=k*k*(3-2*k),a=clamp(C.t/.45,0,1);
  P.yaw=angLerp(C.y0,C.ya,a);P.pitch=lerp(C.p0,C.dir>0?.3:-.45,a);P.x=lerp(C.x0,C.x1,e);P.z=lerp(C.z0,C.z1,clamp(e*2.2,0,1));
  P.cy=C.dir*C.h*clamp((e-.12)/.88,0,1);P.moving=false;C.st-=dt;if(C.st<=0&&k<1){C.st=.2;SFX.step();}
  if(k>=1&&!C.fd){C.fd=true;fade(()=>{if(CLIMB!==C)return;CLIMB=null;C.end();});}}
/* ✏️ notepad: draw notes. Tap it 2× = new page, 3× = go back, 4× = delete (Settings can bring the last one back) */
const PADK='cozytown-notes-1';
const PAD=(()=>{try{const o=JSON.parse(localStorage.getItem(PADK));if(o&&Array.isArray(o.pages)&&o.pages.length)return{pages:o.pages,i:clamp(o.i|0,0,o.pages.length-1),del:o.del||null};}catch(e){}return{pages:[[]],i:0,del:null};})();
function padSave(){try{localStorage.setItem(PADK,JSON.stringify(PAD));}catch(e){}}
function padPaint(x,W,H,pg,d,hint){x.fillStyle='#fffbe8';x.fillRect(0,0,W,H);x.lineWidth=d;x.strokeStyle='#cfe1f5';
  for(let y=18*d;y<H;y+=16*d){x.beginPath();x.moveTo(0,y);x.lineTo(W,y);x.stroke();}
  x.strokeStyle='#ffb8b8';x.beginPath();x.moveTo(14*d,0);x.lineTo(14*d,H);x.stroke();
  if(!pg.length&&hint){x.fillStyle='rgba(61,44,94,.4)';let fs=Math.round(13*d);x.textAlign='center';x.textBaseline='middle';x.font=`700 ${fs}px ${FONT}`;
    while(fs>8&&x.measureText('✏️ Write here!').width>W-16*d){fs--;x.font=`700 ${fs}px ${FONT}`;}x.fillText('✏️ Write here!',W/2,H/2);}
  x.strokeStyle='#1d1622';x.lineCap='round';x.lineJoin='round';
  for(const st of pg){const p=st.p;x.lineWidth=2.6*d*(st.w||1);x.beginPath();x.moveTo(p[0]*W,p[1]*H);if(p.length<=2)x.lineTo(p[0]*W+.01,p[1]*H);for(let j=2;j<p.length;j+=2)x.lineTo(p[j]*W,p[j+1]*H);x.stroke();}}
const padCv=$('padC'),padX=padCv.getContext('2d');let padSt=null,padTaps=0,padTm=0;
try{new ResizeObserver(()=>padSize()).observe(padCv);}catch(e){}
function padDraw(){const W=padCv.width,H=padCv.height;if(!W||!H)return;padPaint(padX,W,H,PAD.pages[PAD.i],W/(padCv.clientWidth||W),false);$('padH').classList.toggle('off',PAD.pages[PAD.i].length>0);$('padN').textContent=(PAD.i+1)+'/'+PAD.pages.length;}
function padSize(){const w0=padCv.clientWidth,h0=padCv.clientHeight;if(!w0||!h0)return;const d=Math.min(2.5,devicePixelRatio||1),w=Math.round(w0*d),h=Math.round(h0*d);if(padCv.width!==w||padCv.height!==h){padCv.width=w;padCv.height=h;padDraw();}}
function padFlip(){const el=$('pad');el.classList.remove('flip');void el.offsetWidth;el.classList.add('flip');padDraw();padSave();}
const padPt=(e,r)=>[+clamp((e.clientX-r.left)/r.width,0,1).toFixed(3),+clamp((e.clientY-r.top)/r.height,0,1).toFixed(3)];
padCv.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!PLAYING||CUT||padSt)return;audioInit();try{padCv.setPointerCapture(e.pointerId);}catch(_){}
  const st={id:e.pointerId,t:performance.now(),x0:e.clientX,y0:e.clientY,lx:e.clientX,ly:e.clientY,mv:0,s:{p:padPt(e,padCv.getBoundingClientRect())}};
  if(e.pointerType==='pen'&&e.pressure>0)st.s.w=+clamp(.6+e.pressure,.8,1.4).toFixed(2);padSt=st;PAD.pages[PAD.i].push(st.s);padDraw();});
padCv.addEventListener('pointermove',e=>{const st=padSt;if(!st||e.pointerId!==st.id)return;e.preventDefault();const r=padCv.getBoundingClientRect();
  for(const v of(e.getCoalescedEvents&&e.getCoalescedEvents().length?e.getCoalescedEvents():[e])){const dx=v.clientX-st.lx,dy=v.clientY-st.ly;if(dx*dx+dy*dy<2.5)continue;
    st.lx=v.clientX;st.ly=v.clientY;st.mv=Math.max(st.mv,Math.hypot(v.clientX-st.x0,v.clientY-st.y0));st.s.p.push(...padPt(v,r));}
  padDraw();});
function padEnd(e){const st=padSt;if(!st||e.pointerId!==st.id)return;padSt=null;const pg=PAD.pages[PAD.i];
  if(performance.now()-st.t<300&&st.mv<9){const j=pg.indexOf(st.s);if(j>=0)pg.splice(j,1);padDraw();padTaps++;clearTimeout(padTm);padTm=setTimeout(padTap,400);return;}
  padTaps=0;clearTimeout(padTm);padSave();}
padCv.addEventListener('pointerup',padEnd);padCv.addEventListener('pointercancel',padEnd);
padCv.addEventListener('contextmenu',e=>e.preventDefault());
function padTap(){const n=padTaps;padTaps=0;const pg=PAD.pages[PAD.i];
  if(n===1){toast('✏️ Draw with your finger! Tap 2× = new page · 3× = go back · 4× = delete',3.6);return;}
  if(n===2){if(!pg.length){toast('📄 This page is already empty!',2);return;}
    const L=PAD.pages.length-1;if(!PAD.pages[L].length)PAD.i=L;else{PAD.pages.push([]);if(PAD.pages.length>30)PAD.pages.shift();PAD.i=PAD.pages.length-1;}
    SFX.tap();padFlip();toast('📄 New page!',1.6);return;}
  if(n===3){if(PAD.i===0){toast('📄 This is your first page',2);return;}PAD.i--;SFX.tap();padFlip();toast('⬅️ Back to page '+(PAD.i+1),1.8);return;}
  if(!pg.length&&PAD.pages.length===1){toast('📄 Nothing to delete',1.8);return;}
  if(pg.length)PAD.del=pg;PAD.pages.splice(PAD.i,1);if(!PAD.pages.length)PAD.pages.push([]);PAD.i=clamp(PAD.i-1,0,PAD.pages.length-1);
  SFX.pop();padFlip();toast(pg.length?'🗑️ Page deleted! You can get it back in ⚙️ Settings':'🗑️ Empty page removed',3);}
/* ---- sleeping ---- */
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
  if(el.hidden){el.hidden=false;document.body.classList.add('zz');}}

/* ---- away or offline ---- */
/* 👀 no tap, click or key for 3 minutes -> "Still there?" (presence aw:1, so I don't count for "everyone in bed");
   30 s more -> save and go to the title. Idle time adds up the loop's own frame time, so a hidden tab never counts.
   📡 the internet drops after being online -> "Reconnecting…"; back within 20 s = carry on, else save and go to the title.
   The title is a pause: you leave the online world, and Play carries on right where you were */
const AW={t:0,on:0,IDLE:180,WAIT:30},NET={on:0,lost:0,t:0,w:0,fb:null,WAIT:20};
function awake(e){AW.t=0;const t=e&&e.target;if(AW.on&&!(t&&t.closest&&t.closest('#awayBox'))){if(e.type==='keydown')e.stopPropagation();awBack();}}   /* a key only wakes me (no bag/Escape underneath) */   /* a tap on the card itself closes it on click */
for(const t of['pointerdown','touchstart','keydown','wheel'])addEventListener(t,awake,{capture:true,passive:true});
function awBack(){AW.on=0;AW.t=0;awBox();}
function awTick(dt){if(IN.joy.id!==null||CUT||zzIn())AW.t=0;AW.t+=dt;   /* holding the joystick is playing too; a scene (the Pet Show, a client's visit) is watching, not being away (night 3); in bed you are waiting for the morning (run 4) */
  if(!AW.on&&AW.t>=AW.IDLE){AW.on=1;SFX.ding();awBox();}
  if(AW.on&&AW.t>=AW.IDLE+AW.WAIT)awayExit('You took a break, so we saved your game.\u00a0💤');}
function netTick(dt){
  if(!NET.w&&MP.grp&&window.WEBNET&&window.WEBNET.on){try{window.firebase.database().ref('.info/connected').on('value',s=>{NET.fb=s.val()===true;});NET.w=1;}catch(e){NET.w=2;}}
  if(navigator.onLine!==false&&MP.state==='on'&&(NET.w!==1||NET.fb)){NET.on=1;if(NET.lost){NET.lost=0;awBox();toast('🟢 Back online!',2);}return;}
  if(!NET.on)return;   /* not online since Play: playing alone offline, as always */
  if(!NET.lost){NET.lost=1;NET.t=0;awBox();}
  const t0=NET.t;NET.t+=dt;if(NET.t>=NET.WAIT){awayExit('Your internet connection was lost 😢');return;}
  if(Math.floor(NET.t/3)>Math.floor(t0/3)&&!MP.grp&&MP.state!=='connecting'&&navigator.onLine!==false){clearTimeout(MP.rt);mpConnect();}}   /* while the card is up, look for the room every 3 s */
function awBox(){let el=$('awayBox');const k=NET.lost?'net':AW.on?'aw':'';toastHold(!!k);
  if(!k){if(el&&!el.hidden)el.hidden=true;return;}
  if(!el){el=document.createElement('div');el.id='awayBox';el.hidden=true;document.body.appendChild(el);el.addEventListener('click',()=>{if(AW.on){SFX.tap();awBack();}});}
  if(el.dataset.k!==k){el.dataset.k=k;el.innerHTML=k==='net'?'<div class="awc" role="alert"><div class="awt">📡 Reconnecting…</div><div class="aws">The internet went away. Hold on, we are looking for it!</div></div>'
    :'<div class="awc" role="alertdialog" aria-label="Still there?"><div class="awt">Still there? 👀</div><div class="aws">Tap anywhere to keep playing</div><button class="btn mint big" id="awYes">I\'m here!</button></div>';}
  if(el.hidden)el.hidden=false;}
function mpLeave(){clearTimeout(MP.rt);if(MP.grp){ballOwnerGone();if(MP.unsub){try{MP.unsub();}catch(e){}MP.unsub=null;}MP.grp=null;for(const a of MP.peers.values())mpDropAv(a);MP.peers.clear();$('bChat').hidden=true;}
  if(MP.state!=='connecting')MP.state='idle';}
function awayExit(msg){if(!PLAYING)return;saveLocal();if(CSAVE.ref){CSAVE.dirty=true;clearTimeout(CSAVE.tm);cloudFlush();}
  if(HOST.cur)hostAnswer(false,true);mpLeave();PLAYING=false;if(TN.on)tnStop('gone');if(HELD)HELD.visible=false;AW.on=0;AW.t=0;NET.lost=0;NET.on=0;awBox();
  document.body.classList.add('away');AW.hud=$('hud').hidden;$('hud').hidden=true;   /* game cards wait hidden underneath until Play (the HUD stays hidden in the clothes creator) */
  const T=$('title'),b=$('tPlay');let m=$('tMsg');if(!m){m=document.createElement('p');m.id='tMsg';m.setAttribute('role','status');T.insertBefore(m,T.querySelector('.menu'));}
  m.textContent=msg;T.hidden=false;b.disabled=false;b.textContent='Play';try{b.focus({preventScroll:true});}catch(e){}}
function awResume(){const m=$('tMsg');if(m)m.remove();document.body.classList.remove('away');$('title').hidden=true;$('hud').hidden=!!AW.hud;PLAYING=true;
  AW.t=0;NET.t=0;mpConnect();updHud(true);jobHud(true);dcardUpd(true);toast('Welcome back, '+(S.name||'friend')+'! 💗',3);if(CSAVE.ref){CSAVE.dirty=true;cloudFlush();}}

/* ---- ✨ updates: the Home Screen app gets the newest Cozy Town (GitHub version only; inside Claude all of this stays off) ----
   An iPad Home Screen app keeps its old copy. So on start and whenever the app comes back to the front (at most once in 20 s)
   we quietly fetch index.html again past every cache and compare COZY_BUILD. A bigger stamp = newer. The same stamp but a
   different game script = someone forgot to bump it: newer too. A smaller stamp never counts (no going back).
   Newer on the title: save and reload at once. Newer while playing: a "✨ New Cozy Town update!" button; tap = save, then reload.
   Loop guard: at most one automatic reload per new version per session (sessionStorage + the ?u= address), so a server that
   still sends the old file can never cause a reload loop: the button shows instead. No internet = no reload, nothing changes. */
const UPD={on:!!(window.WEBNET&&window.WEBNET.on)&&!window.claude&&/^https?:$/.test(location.protocol),el:null,me:'',came:'',last:-1e9,fail:-1e9,busy:false,go:false,newer:null,iv:0,K:'cozytown-update'};
function updHash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return(h>>>0).toString(36)+'.'+s.length.toString(36);}
function updMine(){if(UPD.me==='')UPD.me=(s=>s?COZY_BUILD+':'+updHash(s.text.replace(/\r\n?/g,'\n')):null)(UPD.el||[...document.scripts].find(x=>x.text.includes('const COZY_BUILD=')));return UPD.me;}   /* this copy: stamp + its game script */
function updRead(t){t=t.replace(/\r\n?/g,'\n');const k=t.indexOf('const COZY_BUILD='),s=k<0?-1:t.lastIndexOf('<script',k),a=s<0?-1:t.indexOf('>',s)+1,b=a<1?-1:t.indexOf('<\/script>',k);if(b<0)return null;   /* the file online: the same two things */
  const code=t.slice(a,b),m=/const COZY_BUILD=(\d+);/.exec(code);return m?{n:+m[1],id:m[1]+':'+updHash(code)}:null;}
const updSS=()=>{try{return JSON.parse(sessionStorage.getItem(UPD.K))||{};}catch(e){return{};}};
function updSSet(o){try{sessionStorage.setItem(UPD.K,JSON.stringify(o));}catch(e){}}
const updTried=id=>id===UPD.came||(updSS().tried||[]).includes(id);
async function updFetch(url,mode){const ac=window.AbortController?new AbortController():null,tm=setTimeout(()=>{if(ac)ac.abort();},25000);
  try{const r=await fetch(url,{cache:mode,signal:ac?ac.signal:undefined});if(r.ok)clockServer(r.headers);return r.ok?await r.text():null;}catch(e){return null;}finally{clearTimeout(tm);}}   /* (the response's Date header corrects the one clock: clockServer) */
async function updCheck(){const now=performance.now();if(!UPD.on||UPD.busy||UPD.go||now-UPD.last<20000)return;UPD.last=now;UPD.busy=true;
  const t=await updFetch(location.pathname+'?cz='+Date.now(),'no-store');UPD.busy=false;if(t==null)return;   /* offline, 404, too slow: try again next time */
  const f=updRead(t);if(f&&(f.n>COZY_BUILD||f.n===COZY_BUILD&&!!updMine()&&f.id!==updMine())){UPD.newer=f;if(!UPD.iv)UPD.iv=setInterval(updAct,500);updAct();}}   /* found once = stays until tapped */
/* ✨ run 4, job 2 (item 27): a newer file found while playing is taken by itself at the next calm moment: never during a card, a scene (a client's visit, a class, the Pet Show,
   the claw machine), the bus, a photo shoot, a dance round, a scare on the spooky path, typing, in bed, decorating, on the stairs or in the character maker. A short
   "✨ Updating Cozy Town…" note shows first (1.4 s), then the game saves and reloads. At most once per new version per session (updTried: the loop guard); after that the button shows */
function updCalm(){return!!(S&&S.intro)&&!UI.open&&!CUT&&!CR&&!TUT&&!DTUT&&!BUS.ride&&!fading&&!CLIMB&&!DECO.on&&!zzIn()&&!kbTyping()&&!$('hud').hidden&&!!CUR&&CUR.id!=='client'&&CUR.id!=='studio'
  &&!(typeof SPOOK!=='undefined'&&(SPOOK.cur||(SPOOK.on&&SPOOK.near&&SPOOK.near())))&&!(typeof PHO!=='undefined'&&PHO&&PHO.on)&&!(typeof DANCE!=='undefined'&&DANCE&&DANCE.on)&&!(typeof TN!=='undefined'&&TN.on)
  &&!(typeof HS!=='undefined'&&HS.cust)&&!(typeof dlCarrying==='function'&&dlCarrying())&&!(typeof KC!=='undefined'&&KC.on);}
function updAct(){if(UPD.go)return;const f=UPD.newer;
  if(f&&navigator.onLine!==false&&performance.now()-UPD.fail>60000&&!updTried(f.id)){
    if(!PLAYING&&!UI.open&&!document.body.classList.contains('bookopen')){updGo(true);return;}
    if(PLAYING&&updCalm()){if(!UPD.note){UPD.note=performance.now();toast('✨ Updating Cozy Town… your game is saved 💾',3.4);}else if(performance.now()-UPD.note>1400){updGo(true);return;}return;}}
  UPD.note=0;updPill();}
function updPill(){const f=UPD.newer,T=$('title');let b=$('updBtn');
  const on=!!f&&(PLAYING?!!(S&&S.intro)&&!UI.open&&!CUT&&!CR&&!TUT&&!DTUT&&!BUS.ride&&!$('hud').hidden:!T.hidden&&!UI.open&&!document.body.classList.contains('bookopen'));   /* waits while a card, a show, a lesson or a bus ride is on (and on short phone screens while the action button is up: no room) */
  if(!on){if(b&&!b.hidden){b.hidden=true;T.classList.toggle('upd',!!$('tUpd'));}return;}
  if(!b){b=document.createElement('button');b.id='updBtn';b.type='button';b.className='btn butter upd';b.addEventListener('click',()=>{if(UPD.go)return;audioInit();SFX.tap();updGo(false);});}
  if(b.dataset.k!=='new'){b.dataset.k='new';b.classList.remove('busy');b.innerHTML='<span class="ue">✨</span><span class="ut"><b>New Cozy Town update!</b><small>Tap to get it</small></span>';}
  if(PLAYING){if(b.parentNode!==$('hud'))$('hud').appendChild(b);}else if(b.parentNode!==T)T.insertBefore(b,T.querySelector('.menu'));
  T.classList.toggle('upd',!PLAYING||!!$('tUpd'));if(b.hidden)b.hidden=false;updPlace();}
/* 📱 a phone held upright: the bus, football, tennis and arrow bars under the clock may be as wide as the screen, so the button sits below them
   (it covered ✋ Stop, the bus countdown and the arrow bar's ✕, and a tap there reloaded the game). Placed again whenever the left column changes */
function updPlace(){const b=$('updBtn');if(!b)return;if(b.style.top)b.style.top='';if(b.hidden||!PLAYING)return;const r0=b.getBoundingClientRect();let y=0;   /* (on the title it sits in the menu: no extra top) */
  for(const id of['busTip','fbHud','tnHud','nav']){const r=boxOf($(id));if(r&&r.right>r0.left-8&&r.left<r0.right&&r.bottom>r0.top-8)y=Math.max(y,r.bottom);}
  if(y)b.style.top=Math.round(y+10)+'px';}
async function updGo(auto){const f=UPD.newer;if(UPD.go||!f)return;UPD.go=true;const b=$('updBtn'),busy=b&&!b.hidden,pb=$('tPlay');
  if(auto)pb.textContent='✨ Updating…';   /* on the title: Play waits for the new copy */
  if(busy){b.dataset.k='go';b.classList.add('busy');b.innerHTML='<span class="ue">✨</span><span class="ut"><b>Getting the update…</b><small>Your game is saved 💾</small></span>';}
  const save=()=>{try{if(DECO.on)decoEnd();}catch(e){}if(!S)return;const p=PLAYING;PLAYING=true;try{saveLocal();padSave();saveSet();}catch(e){}PLAYING=p;};save();   /* furniture in your hands goes back to storage first; the title after a break has S too */
  const t=await updFetch(location.pathname,'reload');   /* refresh the saved copy of the plain address (the next start from the Home Screen) */
  const back=()=>{UPD.go=false;if(b)b.dataset.k='';if(pb.textContent==='✨ Updating…')pb.textContent=pb.disabled?'Loading…':'Play';updPill();};
  if(t==null){UPD.fail=performance.now();if(!auto)toast('📡 No internet right now. Try again in a moment!',3);back();return;}
  save();const o=updSS();o.tried=(o.tried||[]).concat(f.id).slice(-6);o.from=updMine();updSSet(o);   /* the loop guard */
  location.replace(location.pathname+'?u='+encodeURIComponent(f.id)+'~'+Date.now().toString(36)+location.hash);   /* a new address: never an old copy */
  setTimeout(back,15000);}   /* still here? the button comes back */
if(UPD.on){const st=document.createElement('style');st.textContent='#updBtn{position:absolute;top:calc(env(safe-area-inset-top,0px) + 80px);right:calc(env(safe-area-inset-right,0px) + 12px);z-index:6;max-width:min(330px,calc(100% - 24px));min-height:56px;padding:6px 16px 6px 10px;border-radius:999px;gap:9px;white-space:normal;text-align:left;justify-content:flex-start;background:linear-gradient(135deg,#fff6c4,#ffd45c 60%,#ffc2df);animation:updGlow 2.6s ease-in-out infinite}'
  +'#updBtn:active{animation:none}#updBtn .ue{font-size:28px;line-height:1;flex:none;animation:updTw 2.6s ease-in-out infinite}#updBtn .ut{display:flex;flex-direction:column;line-height:1.12}#updBtn b{font-size:18px;font-weight:800}#updBtn small{font-size:14px;font-weight:700;color:#5a4680}'
  +'#updBtn.busy{animation:none}#updBtn.busy .ue{animation:updSpin 1.4s linear infinite}#title #updBtn{position:relative;top:auto;right:auto;z-index:auto;max-width:min(420px,100%)}#title.upd .tag{display:none}'
  +'#tUpd{margin:0;max-width:min(620px,100%);background:var(--paper);color:var(--ink);border:3px solid var(--line);border-radius:20px;box-shadow:0 4px 0 var(--soft);padding:10px 18px;font-weight:800;font-size:clamp(18px,2.8vw,24px);line-height:1.3}'
  +'@media (max-width:600px){#updBtn{top:calc(env(safe-area-inset-top,0px) + 146px);max-width:210px;padding-right:12px}#updBtn b{font-size:15px}#updBtn small{font-size:13px}#updBtn .ue{font-size:24px}}@media (max-height:500px){#tUpd{font-size:18px;padding:6px 14px}#actWrap:not([hidden])~#updBtn,.swinging #updBtn{visibility:hidden}}'
  +'@keyframes updGlow{0%,100%{box-shadow:0 5px 0 #3d2c5e,0 0 0 0 rgba(255,212,92,0)}50%{box-shadow:0 5px 0 #3d2c5e,0 0 0 7px rgba(255,212,92,.6)}}@keyframes updTw{0%,70%,100%{transform:none}78%{transform:rotate(-16deg) scale(1.2)}86%{transform:rotate(12deg) scale(1.1)}}'
  +'@keyframes updSpin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){#updBtn,#updBtn .ue{animation:none}}'
  +'#tVer{position:absolute;right:calc(env(safe-area-inset-right,0px) + 10px);bottom:calc(env(safe-area-inset-bottom,0px) + 8px);background:var(--paper);color:var(--ink);border:2px solid var(--line);border-radius:999px;padding:1px 10px;font-size:13px;font-weight:700;line-height:1.5;opacity:.9;pointer-events:none}';document.head.appendChild(st);
  {const v=document.createElement('div');v.id='tVer';v.textContent='Version '+COZY_BUILD;$('title').appendChild(v);}   /* small, on the title: which copy is running */
  const q=/[?&]u=([^&#]*)/.exec(location.search);
  if(q){try{UPD.came=decodeURIComponent(q[1]).split('~')[0];}catch(e){}try{history.replaceState(history.state,'',location.pathname+location.hash);}catch(e){}   /* back from an update: tidy the address */
    const o=updSS(),fresh=o.from?o.from!==updMine():UPD.came===updMine();delete o.from;updSSet(o);
    if(fresh){const T=$('title'),m=document.createElement('p');m.id='tUpd';m.setAttribute('role','status');m.textContent='✨ Cozy Town is updated!';T.insertBefore(m,T.querySelector('.menu'));T.classList.add('upd');}}
  $('tPlay').addEventListener('click',e=>{if(UPD.go){e.stopImmediatePropagation();return;}const m=$('tUpd');if(m){m.remove();$('title').classList.remove('upd');}});   /* (runs before the game's own Play) */
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(updCheck,500);});
  addEventListener('pageshow',e=>{if(e.persisted)setTimeout(updCheck,500);});addEventListener('focus',()=>setTimeout(updCheck,500));
  setTimeout(updCheck,800);}

/* ---- places ---- */
function setLoc(id){CUR=LOC[id];P.cy=0;for(const k in LOC)LOC[k].g.visible=LOC[k]===CUR;
  const out=CUR.type==='out';outside.visible=out&&id==='city';skyMesh.visible=out;sunSprite.visible=out;moonSprite.visible=out;stars.visible=out;
  FOG.near=out?60:900;FOG.far=out?340:1000;LOC.home.items.visible=id==='home';if(LOC.client)LOC.client.items.visible=id==='client';if(LOC.visit)LOC.visit.items.visible=id==='visit';
  for(const k of KEEPERS)k.p.root.visible=k.L===CUR;for(const a of PEN)a.m.root.visible=CUR.id==='pets';
  if(LOC.clothes&&LOC.clothes.manq)for(const m of LOC.clothes.manq)m.visible=id==='clothes';
  $('bDeco').hidden=id!=='home';renderer.setClearColor(id==='studio'?'#fff4fa':'#000000');updSky();toastLeave(id);}
function bringFollowers(quiet){let n=0;P.hd=P.yaw+Math.PI;for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.loc=null;for(const p of PET_ACTORS)if(!p.d.stay)p.loc=null;   /* placed one by one below */
  for(const f of FRIEND_ACTORS)if(f.mode==='follow'){nearMe(f,++n);
    if(CUR.id==='home'&&!quiet)homeVisit(f);}
  for(const p of PET_ACTORS)if(!p.d.stay)nearMe(p,++n);}
function enter(id,via){SFX.door();qEvent('enter:'+id);fade(()=>{setLoc(id);const d=DOORS[id+(via||'')],L=LOC[id];P.x=L.ox+d.inside[0];P.z=L.oz+d.inside[1];P.yaw=d.inside[2];P.pitch=0;P.sit=null;bringFollowers();if(id==='home')doneTask('home');if(id==='pizza')pizzaIn();if(id==='beach')beachIn();if(id==='cafe'&&FRIEND_ACTORS.some(f=>f.mode==='follow'))qEvent('cafevisit');saveLocal();});}
function exitTo(id,via){if(DECO.on)decoEnd();SFX.door();fade(()=>{setLoc('city');const d=DOORS[id+(via||'')];P.x=d.city[0];P.z=d.city[1];P.yaw=d.city[2];P.pitch=0;P.sit=null;bringFollowers();saveLocal();});}
function homeVisit(f){const st=frSt(f.d.id);setTimeout(()=>{if(CUR.id!=='home')return;const n=S.home.items.length;
  const line=n>=8?"Wow, your house is SO cozy! I love it here!":n>=5?"Your house is really nice! I like your stuff.":"Your house is cute! Maybe add more furniture?";
  toast(f.d.name+': '+line,4);if(st.visit!==S.day){st.visit=S.day;addPts(f,5);}doneTask('visit');qEvent('visit');addXP('friends',5);},900);}

/* ---- input ---- */
const IN={joy:{id:null,ox:0,oy:0,x:0,y:0},look:{id:null,lx:0,ly:0,sx:0,sy:0,t:0,moved:0},keys:{}};
const TOUCHY=('ontouchstart' in window)||navigator.maxTouchPoints>0;
function setupInput(){
  const T=$('touch'),joy=$('joy'),knob=$('knob');if(!TOUCHY)joy.hidden=true;
  const joyHome=()=>{joy.style.left='';joy.style.top='';joy.style.bottom='';joy.classList.remove('on');knob.style.transform='';};
  T.addEventListener('pointerdown',e=>{
    if(!PLAYING||UI.open)return;audioInit();
    const w=innerWidth,h=innerHeight;
    if(!(CUT&&CUT.tch)&&IN.joy.id===null&&e.pointerType!=='mouse'&&e.clientX<w*.42&&e.clientY>h*.3){
      IN.joy.id=e.pointerId;const ox=clamp(e.clientX,74,w*.42),oy=clamp(e.clientY,74,h-74);IN.joy.ox=ox;IN.joy.oy=oy;IN.joy.x=0;IN.joy.y=0;
      joy.style.left=(ox-70)+'px';joy.style.top=(oy-70)+'px';joy.style.bottom='auto';joy.classList.add('on');
    }else if(IN.look.id===null){IN.look.id=e.pointerId;IN.look.lx=IN.look.sx=e.clientX;IN.look.ly=IN.look.sy=e.clientY;IN.look.t=performance.now();IN.look.moved=0;IN.look.cls=!!(CUT&&CUT.tch);}
    try{T.setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();
  });
  T.addEventListener('pointermove',e=>{
    if(e.pointerId===IN.joy.id){let dx=e.clientX-IN.joy.ox,dy=e.clientY-IN.joy.oy;const d=Math.hypot(dx,dy),m=56;if(d>m){dx*=m/d;dy*=m/d;}IN.joy.x=dx/m;IN.joy.y=dy/m;knob.style.transform=`translate(${dx}px,${dy}px)`;}
    else if(e.pointerId===IN.look.id){const dx=e.clientX-IN.look.lx,dy=e.clientY-IN.look.ly;IN.look.lx=e.clientX;IN.look.ly=e.clientY;IN.look.moved+=Math.abs(dx)+Math.abs(dy);
      if(!IN.look.cls&&!(CUT&&CUT.tch)){const k=(e.pointerType==='mouse'?.0045:.0062)*SET.look;ballLookMine();P.yaw-=dx*k;P.pitch=clamp(P.pitch-dy*k,-1.25,1.25);}}
  });
  const up=e=>{if(e.pointerId===IN.joy.id){IN.joy.id=null;IN.joy.x=IN.joy.y=0;joyHome();}
    else if(e.pointerId===IN.look.id){IN.look.id=null;const cl=IN.look.cls;if(e.type==='pointerup'&&IN.look.moved<(cl?40:12)&&performance.now()-IN.look.t<(cl?700:350))tapAt(e.clientX,e.clientY);}};
  T.addEventListener('pointerup',up);T.addEventListener('pointercancel',up);
  addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT'||document.body.classList.contains('away'))return;IN.keys[e.code]=true;
    if(DANCE.on&&/^Arrow(Left|Right|Up|Down)$/.test(e.code)){e.preventDefault();dnPress({ArrowLeft:0,ArrowDown:1,ArrowUp:2,ArrowRight:3}[e.code]);return;}   /* 🕺 the dance-off takes the arrows (run 4, job 17) */   /* away title: keys only press Play */
    if(e.code==='Escape'){if(UI.open&&!UI.lock)closePanel();else if(DECO.placing)decoCancel();return;}
    if(MAPV.on&&UI.open&&mapKeys(e))return;   /* 🗺️ + − zoom, arrows move the map, M closes it */
    if(CUT&&CUT.show&&(e.code==='Space'||e.code==='Enter'||e.code==='KeyE')){e.preventDefault();ACT.pstap();return;}
    if(CUT&&CUT.claw&&(e.code==='Space'||e.code==='Enter'||e.code==='KeyE')){e.preventDefault();ACT.clawtap();return;}
    if(!PLAYING||UI.open)return;
    if(e.code==='Space'){e.preventDefault();if(PHO.on)ACT.ptsnap();else jump();}if(PHO.on&&(e.code==='Equal'||e.code==='NumpadAdd'))ACT.ptzoom('+');if(PHO.on&&(e.code==='Minus'||e.code==='NumpadSubtract'))ACT.ptzoom('-');if(PHO.on&&e.code==='KeyN')ptNextBg();   /* 📸 Space snaps, + and - zoom, N the next background (run 4, job 15) */
    if(e.code==='KeyE'||e.code==='Enter'){e.preventDefault();if(DECO.on)return;if(TARGET===BALLT){if(!e.repeat)ballHold(true,null);}else if(TARGET)useTarget();}
    if(e.code==='KeyB')openBag();if(e.code==='KeyP')openPhone();if(e.code==='KeyM')openPhone('map');if(e.code==='KeyR'&&DECO.placing)decoTurn();});
  addEventListener('keyup',e=>{IN.keys[e.code]=false;if(KC.key&&(e.code==='KeyE'||e.code==='Enter'))ballLet();});
  addEventListener('blur',()=>{IN.keys={};KC.on=false;});
}
/* 🔍 no page zoom while playing. iOS ignores user-scalable=no, so: Safari's pinch (gesture events) is stopped, a two-finger move is stopped
   (not on the game's own touch layer and buttons, which have touch-action:none, and not in text boxes or scrolling lists), and double-tap zoom is
   off through touch-action in the CSS. Walking with one thumb and looking with the other still works: that is the touch layer */
for(const t of['gesturestart','gesturechange','gestureend'])document.addEventListener(t,e=>e.preventDefault(),{passive:false});
document.addEventListener('touchmove',e=>{if(e.touches.length<2||!e.cancelable)return;const t=e.target;if(t&&t.closest&&t.closest('#touch,#hud,input,textarea,.card,.ph-screen'))return;e.preventDefault();},{passive:false});
document.addEventListener('dblclick',e=>{const t=e.target;if(!(t&&t.closest&&t.closest('input,textarea')))e.preventDefault();});
const RAY=new THREE.Raycaster(),NDC=new THREE.Vector2();
function tapAt(cx,cy){if(CUT){if(CUT.tch)tcTap(cx,cy);return;}if(DECO.on){decoTap(cx,cy);return;}if(TN.on){tnSwing();return;}
  NDC.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);RAY.setFromCamera(NDC,camera);
  const ts=targets().filter(t=>t.obj&&t.obj.visible!==false);if(!ts.length)return;
  const hits=RAY.intersectObjects(ts.map(t=>t.obj),true);
  for(const h of hits){if(h.distance>9)break;let o=h.object;const t=ts.find(t=>{let p=o;while(p){if(p===t.obj)return true;p=p.parent;}return false;});
    if(t&&(t.rect?h.distance<5:Math.hypot(t.x-P.x,t.z-P.z)<t.r+2.2)){TARGET=t;useTarget();return;}}}
function targets(){const out=CUR.inter.slice();
  for(const f of FRIEND_ACTORS)if(f.mode!=='away'&&f.loc===CUR.id&&f.g.visible)out.push(f.target);   /* (a friend waiting out of a photo or a dance offers no button: run 4, stage 3) */
  for(const p of PET_ACTORS)if(p.loc===CUR.id&&p.g.visible)out.push(p.target);
  if(CUR.id==='pets')for(const a of PEN)out.push(a.target);
  if(S.time>=8&&S.time<20)for(const s of SHOPPERS)if(s.L===CUR)out.push(s.target);
  if(CUR.id==='city'){for(const l of LITTER)out.push(l.target);for(const w of WALKERS)if(w.state!=='home')out.push(w.target);for(const q of GRAN.g)if(q.on)out.push(q.target);if(sittersOut())for(const s of SITTERS)out.push(s.target);if(PSX.on)for(const j of PSX.judges)out.push(j.target);for(const k of FB.k)if(fbTgOn(k))out.push(k.tg);out.push(BALLT);}
  return out;}
function findTarget(){if(TN.on)return TN.tg;if(P.ride)return P.ride.kind==='swing'?{icon:'🧍',label:'Get off the swing',act:stopRide}:null;if(P.sit)return P.sit.bus?(BUS.ride&&BUS.ride.go?null:BUS_OFF):{icon:'🧍',label:P.sit.bed?'Get up':'Stand up',act:standUp};
  if(KC.on){if(ballNear())return BALLT;KC.on=false;kcClr();}
  const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);let best=null,bs=1e9;
  for(const t of targets()){if(t.when&&!t.when())continue;if(PHO.on&&!t.pt)continue;   /* 📸 during a shoot only its own buttons (run 4 finish: "Pick up the litter" sat inside the photo frame) */let tx=t.x,tz=t.z;if(t.rect){tx=clamp(P.x,t.rect.x1,t.rect.x2);tz=clamp(P.z,t.rect.z1,t.rect.z2);}const dx=tx-P.x,dz=tz-P.z,d=Math.hypot(dx,dz);if(d>t.r)continue;const c=d<.01?1:(dx*fx+dz*fz)/d;if(c<.25&&d>1)continue;let s=d*(1.7-c);if(t.pri&&t.pri())s*=.25;if(s<bs){bs=s;best=t;}}
  return best;}
function useTarget(){if(!TARGET)return;SFX.tap();try{TARGET.act();}catch(e){console.error(e);}}
function standUp(){if(!P.sit)return;if(P.sit.bus){busOff();return;}if(P.sit.bk){const b=P.sit.bk;P.sit=null;[P.x,P.z]=collideXZ(b[0],b[1],.3,CUR);P.yaw=b[2];P.pitch=0;return;}const fx=Math.sin(P.yaw+Math.PI),fz=Math.cos(P.yaw+Math.PI);P.sit=null;[P.x,P.z]=collideXZ(P.x-fx*0,P.z,.3,CUR);
  const nx=P.x-Math.sin(P.yaw)*.55,nz=P.z-Math.cos(P.yaw)*.55;[P.x,P.z]=collideXZ(nx,nz,.3,CUR);}

/* ---- player ---- */
function solids(){const s=[];if(CUR.type==='in'&&S.time>=8&&S.time<20)for(const p of SHOPPERS)if(p.L===CUR)s.push({cx:p.x,cz:p.z,cr:.32});for(const f of FRIEND_ACTORS)if(f.loc===CUR.id&&f.mode!=='away'&&f.mode!=='follow')s.push({cx:f.x,cz:f.z,cr:.32});if(CUR.id==='city'){for(const w of WALKERS)if(w.state!=='home')s.push({cx:w.x,cz:w.z,cr:.32});for(const c of CARS){if(c.away)continue;s.push({ob:1,cx:c.x,cz:c.z,ux:Math.sin(c.yaw),uz:Math.cos(c.yaw),hl:1.78,hw:.95});}   /* 🚗 one box round each car, like the bus: your eyes stay 30 cm from its body and half a metre from its cabin (run 4 finish: its two round ends let you come 15 cm from the cabin's side, just under the roof at eye height, and the view was one flat colour with a dark band) */}busSolids(s);return s;}
const sittersOut=()=>S.time>=9&&S.time<19.5;
/* swing pumping: tap ⬆️ (or Space) while swinging to go higher and higher */
const SW_MAX=1.45;let swOn=false,swFull=false;
function pumpSwing(){const r=P.ride;if(!r||r.kind!=='swing')return;audioInit();
  r.boost=Math.min(SW_MAX,r.boost+.075*(1-Math.min(1,r.amp/1.65)));r.pumps++;if(r.pumps%8===0)addXP('sport',1);
  if(r.pumps%5===0)SFX.whee();else SFX.tap();const b=$('bJump');b.classList.remove('pump');void b.offsetWidth;b.classList.add('pump');}
function swingUI(){const on=!!(P.ride&&P.ride.kind==='swing'&&PLAYING);if(on!==swOn){swOn=on;document.body.classList.toggle('swinging',on);$('swMeter').hidden=!on;if(!on){swFull=false;$('swMeter').classList.remove('full');}}
  if(on){const f=Math.max(0,Math.min(1,(P.ride.amp-.18)/(SW_MAX-.18)));$('swFill').style.height=(f*100).toFixed(1)+'%';const full=P.ride.amp>=1.33;if(full!==swFull){swFull=full;$('swMeter').classList.toggle('full',full);}}}
function startSwing(i){if(P.ride||!PLAYING)return;P.ride={kind:'swing',i,t:0,amp:.18,base:.18,boost:0,pumps:0};P.sit=null;P.jy=0;P.vy=0;P.yaw=0;P.pitch=.05;SFX.pop();SFX.whee();toast(TOUCHY?'Wheee! Tap ⬆️ to go higher! Move to get off.':'Wheee! Press Space to go higher! Move to get off.',3);addXP('sport',3);qEvent('swing');swingUI();}
function startSlide(){if(P.ride||!PLAYING)return;
  const k=[[P.x,1.5,P.z,P.yaw,P.pitch],[-37.2,1.5,28.75,Math.PI,.15],[-37.2,3.3,29.55,Math.PI,.3],[-37.2,2.65,30.5,Math.PI,-.45],[-37.2,.9,33.2,Math.PI,-.25],[-37.2,1.5,34.45,Math.PI,0]];
  P.ride={kind:'slide',k,d:[.45,1.0,.45,.95,.45],seg:0,t:0};P.sit=null;P.jy=0;P.vy=0;SFX.pop();addXP('sport',4);qEvent('slide');}
function stopRide(){const r=P.ride;if(!r)return;if(r.kind==='swing'){const s=LOC.city.swings[r.i];P.x=s.position.x;P.z=36.0;P.yaw=0;P.pitch=0;SFX.land();}P.ride=null;swingUI();}
function updateRide(dt){const r=P.ride;if(r.kind==='zip'){updateCamera(dt);return;}if(r.kind==='dance'){dnCam(dt);return;}if(PB)PB.root.visible=false;   /* 🪢 the Tree Park's zip line moves you itself (tpZip); the camera just follows (run 4, job 16) */
  if(r.kind==='swing'){const s=LOC.city.swings[r.i];r.t+=dt;r.base=Math.min(.6,r.base+dt*.1);r.boost=Math.max(0,r.boost-dt*.06);
    const tg=Math.min(SW_MAX,r.base+r.boost);r.amp+=Math.max(-dt*.25,Math.min(dt*.5,tg-r.amp));
    if(r.amp>=1.33&&!r.sup){r.sup=1;SFX.yay();SFX.whee();toast('🌟 SUPER HIGH! Wheee!',2.6);addXP('sport',5);}
    const a=r.amp*Math.sin(r.t*2.0);s.rotation.x=a;
    const vy=-1.0,vz=.06,c=Math.cos(a),sn=Math.sin(a);camera.position.set(s.position.x,s.position.y+vy*c-vz*sn,s.position.z+vy*sn+vz*c);
    camera.rotation.set(P.pitch+a*.5,P.yaw,0,'YXZ');if(r.t>1&&Math.abs(a)<.05&&!r.w){r.w=1;}return;}
  r.t+=dt;while(r.seg<r.d.length&&r.t>=r.d[r.seg]){r.t-=r.d[r.seg];r.seg++;}
  if(r.seg>=r.d.length){const e=r.k[r.k.length-1];P.x=e[0];P.z=e[2];P.yaw=e[3];P.pitch=0;P.ride=null;SFX.land();updateCamera(dt);return;}
  const A=r.k[r.seg],B=r.k[r.seg+1];let u=r.t/r.d[r.seg];u=r.seg===3?u*u:(u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2);
  if(r.seg===3&&!r.wh){r.wh=1;SFX.whee();}
  const x=lerp(A[0],B[0],u),y=lerp(A[1],B[1],u),z=lerp(A[2],B[2],u);P.x=x;P.z=z;P.yaw=angLerp(A[3],B[3],u);P.pitch=lerp(A[4],B[4],u);
  camera.position.set(x,y,z);camera.rotation.set(P.pitch,P.yaw,0,'YXZ');}
function jump(){if(P.ride&&P.ride.kind==='swing'&&PLAYING&&!UI.open&&!CUT){pumpSwing();return;}if(!PLAYING||UI.open||DECO.on||P.ride||CUT)return;if(P.sit)standUp();if(P.jy>.001)return;audioInit();P.vy=5.4;P.jy=.0001;SFX.jump();qEvent('jump');P.jn=(P.jn||0)+1;if(P.jn%4===0)addXP('sport',1);
  for(const e of [...PET_ACTORS,...FRIEND_ACTORS])if(e.loc===CUR.id&&e.mode!=='away'&&Math.hypot(e.x-P.x,e.z-P.z)<5)e.hopT=.05+Math.random()*.15;}
function setRun(on){IN.run=on;const b=$('bRun');b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');}
function updatePlayer(dt){
  if(P.jy>0||P.vy>0){P.vy-=18*dt;P.jy+=P.vy*dt;if(P.jy<=0){P.jy=0;P.vy=0;P.dip=.07;SFX.land();}}
  P.dip=Math.max(0,P.dip-dt*.5);
  if(UI.open||!PLAYING||CUT||CLIMB||TUT||DTUT){P.moving=false;return;}
  if(P.freeze>0){P.freeze-=dt;P.moving=false;return;}   /* 👻 a scare: you stop for a moment (run 4, job 3) */
  if(P.ride){P.moving=false;if(P.ride.kind==='swing'){const K=IN.keys,jm=IN.joy.id!==null?Math.hypot(IN.joy.x,IN.joy.y):0;if(jm>.5||K.KeyW||K.KeyS||K.KeyA||K.KeyD||K.ArrowUp||K.ArrowDown)stopRide();}return;}
  let f=0,s=0;if(IN.joy.id!==null){f=-IN.joy.y;s=IN.joy.x;}
  const K=IN.keys;f+=(K.KeyW||K.ArrowUp?1:0)-(K.KeyS||K.ArrowDown?1:0);s+=(K.KeyD?1:0)-(K.KeyA?1:0);
  const turn=(K.ArrowRight?1:0)-(K.ArrowLeft?1:0);if(turn)P.yaw-=turn*2.2*dt;
  let m=Math.hypot(f,s);if(m>1){f/=m;s/=m;m=1;}
  if(P.sit){if(m>.35)standUp();else{P.moving=false;return;}}
  P.run=!!(K.ShiftLeft||K.ShiftRight||IN.run);
  if(m>.06){const run=P.run,boost=1+(sk('sport').lv-1)*.03,sp=4.3*(run?1.65:1)*boost*(S.hunger<=0?.6:1),sy=Math.sin(P.yaw),cy=Math.cos(P.yaw);
    const ox=P.x,oz=P.z;[P.x,P.z]=collideXZ(P.x+(-sy*f+cy*s)*sp*dt,P.z+(-cy*f-sy*s)*sp*dt,.3,CUR,solids());P.moving=true;P.bobT+=dt*sp*2.3;P.hd=Math.atan2(-sy*f+cy*s,-cy*f-sy*s);
    if(run){const dd=Math.hypot(P.x-ox,P.z-oz);qEvent('run',dd);P.ra=(P.ra||0)+dd;if(P.ra>=50){P.ra-=50;addXP('sport',1);}}}
  else P.moving=false;
  for(const e of [...FRIEND_ACTORS,...PET_ACTORS]){if(e.loc!==CUR.id||e.mode==='away')continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz),m2=FGAP;if(d<m2&&d>1e-4){[e.x,e.z]=collideXZ(P.x+dx/d*m2,P.z+dz/d*m2,e.r,CUR);}}
}
let PB=null;
const SHADOW_ONLY=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false});
function buildPlayerBody(){if(PB)scene.remove(PB.root);const p=makePerson(lookToPerson(S.look));
  /* you only see your legs and shoes when you look down; the rest of you shows up as your shadow */
  p.b.traverse(o=>{if(!o.isMesh)return;let leg=false;for(let q=o.parent;q;q=q.parent)if(p.legs.includes(q)){leg=true;break;}
    if(o.material.side===THREE.BackSide){if(!leg)o.visible=false;return;}o.castShadow=true;if(!leg)o.material=SHADOW_ONLY;});
  scene.add(p.root);PB=p;}
let BASEFOV=70;
function updateCamera(dt){const bob=P.moving&&P.jy<=0?Math.sin(P.bobT)*.04:0;P.bobA=lerp(P.bobA,bob,.25);
  const tf=Math.max(BASEFOV*(PHO.on?PHO.zoom:1)+(P.run&&P.moving?7:0),dnFov());   /* 📸 the photographer's zoom (run 4, job 15) */if(Math.abs(camera.fov-tf)>.05){camera.fov=lerp(camera.fov,tf,Math.min(1,dt*6));camera.updateProjectionMatrix();}
  if(PB){const show=PLAYING&&!P.sit&&!CR&&!P.ride;PB.root.visible=show;if(show){const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);PB.root.position.set(P.x-fx*.13,P.jy+(P.cy||0),P.z-fz*.13);PB.root.rotation.y=P.yaw+Math.PI;animPerson(PB,dt,P.moving&&P.jy<=0,P.run?1.5:1);
    if(P.jy>0){PB.legs[0].rotation.x=.55;PB.legs[1].rotation.x=-.25;}}}
  if(P.sit){P.x=P.sit.x;P.z=P.sit.z;}
  camera.position.set(P.x,(P.sit?P.sit.h||1.05:1.5)+P.bobA+P.jy-P.dip+(P.cy||0),P.z);ballLook(dt);camera.rotation.set(P.pitch+BLK.a,P.yaw,0,'YXZ');
  if(SHAKE.t>0){SHAKE.t-=dt;const a=SHAKE.t*.08;camera.position.x+=rand(-a,a);camera.position.y+=rand(-a,a)*.5;camera.rotation.z+=rand(-a,a)*.3;}}   /* 👻 a little shake at a scare (run 4) */
const SHAKE={t:0};
/* ⚽ while the ball is your kick target the view dips a little, so you see the ball, its glow and the arrow (a = extra tilt, not your own look;
   when you look around yourself the tilt becomes yours and the helper waits a moment, so it never fights your finger) */
const BLK={a:0,q:0};
function ballLook(dt){let t=0;BLK.q-=dt;if(CUR.id!=='city'){BLK.a=0;return;}const b=LOC.city.ball;
  if(TARGET===BALLT&&PLAYING&&!P.sit&&!P.ride&&!CUT&&!CR&&BLK.q<=0&&P.pitch<.3&&b){const d=Math.max(.5,Math.hypot(b.x-P.x,b.z-P.z)),por=innerHeight>innerWidth;
    t=clamp((por?.3:.5)*BASEFOV*Math.PI/360-Math.atan2(1.5-BR,d)-P.pitch,por?-.65:-.55,0);}/* phone upright: the ball sits higher, above the buttons */
  if(BLK.q<=0||t>BLK.a)BLK.a+=(t-BLK.a)*Math.min(1,dt*4);}
function ballLookMine(){if(BLK.a){P.pitch=clamp(P.pitch+BLK.a,-1.25,1.25);BLK.a=0;}BLK.q=1.5;}

/* 🍳 kitchen: no gaps, easy placing (night 3, job 8). The sink, stove, fridge and the new cupboards are kitchen pieces (FURN[t].kit). While you place
   one, within about 0.35 m of another kitchen piece it snaps edge to edge with the fronts lined up (side by side, or round a corner), and
   against a wall it goes flush to the wall. The ghost turns bright green when it snapped. Saved kitchens never move (snapping only happens while
   you place). A wall cupboard hangs above the counter against a wall and does not block floor pieces */
const KIT_SNAP=.35;
/* the footprint of a piece at (x,z) turned r, and where its front is: 0 = +z, 1 = +x, 2 = -z, 3 = -x (r*90° turns the +z front) */
function kitRect(t,x,z,r){const F=FURN[t],sw=(r%2?F.d:F.w)/2,sd=(r%2?F.w:F.d)/2;return{x1:x-sw,x2:x+sw,z1:z-sd,z2:z+sd,sw,sd,r:((r%4)+4)%4};}
function kitSnap(it,x,z,r,X){const t=furnOf(it),F=FURN[t];if(!F||!F.kit)return{x,z,snap:false};const W=X.W(),D=X.D(),me=kitRect(t,x,z,r),cands=[];
  /* front edges: r 0 → z2 is the front, r 2 → z1, r 1 → x2, r 3 → x1 */
  const front=(R)=>R.r===0?['z',R.z2]:R.r===2?['z',R.z1]:R.r===1?['x',R.x2]:['x',R.x1];
  for(const o of X.list()){const G=FURN[furnOf(o)];if(!G||!G.kit||o===it||G.hang||(X.on&&!X.on(o)))continue;const Q=kitRect(furnOf(o),o.x,o.z,o.r);
    if(me.x1>Q.x2+KIT_SNAP||me.x2<Q.x1-KIT_SNAP||me.z1>Q.z2+KIT_SNAP||me.z2<Q.z1-KIT_SNAP)continue;
    const fm=front(me),fq=front(Q);
    if(fm[0]===fq[0]&&me.r===Q.r){   /* side by side, the same way round: edge to edge, fronts lined up */
      if(fm[0]==='z'){const nz=fq[1]-(me.r===0?me.sd:-me.sd);cands.push([Q.x2+me.sw,nz],[Q.x1-me.sw,nz]);}
      else{const nx=fq[1]-(me.r===1?me.sw:-me.sw);cands.push([nx,Q.z2+me.sd],[nx,Q.z1-me.sd]);}}
    else{   /* round a corner (turned 90°): my side touches its front corner, my back lines up with its side */
      if(fm[0]==='z'){const nz=me.r===0?Q.z1+me.sd:Q.z2-me.sd;cands.push([Q.x2+me.sw,nz],[Q.x1-me.sw,nz]);}
      else{const nx=me.r===1?Q.x1+me.sw:Q.x2-me.sw;cands.push([nx,Q.z2+me.sd],[nx,Q.z1-me.sd]);}}}
  let best=null,bd=KIT_SNAP;for(const c of cands){const d=Math.hypot(c[0]-x,c[1]-z);if(d<bd){bd=d;best=c;}}
  let nx=x,nz=z,snap=false;if(best){nx=best[0];nz=best[1];snap=true;}
  /* flush to a wall (the back of the piece near a wall); beside a neighbour the neighbour's front sets the line, so a shallower sink lines up with the stove */
  const bk=best?0:me.r===0?-1:me.r===2?1:0,bx=best?0:me.r===1?-1:me.r===3?1:0;
  if(bk<0&&Math.abs((nz-me.sd)-(-D))<KIT_SNAP){nz=-D+me.sd+.001;snap=true;}if(bk>0&&Math.abs((nz+me.sd)-D)<KIT_SNAP){nz=D-me.sd-.001;snap=true;}
  if(bx<0&&Math.abs((nx-me.sw)-(-W))<KIT_SNAP){nx=-W+me.sw+.001;snap=true;}if(bx>0&&Math.abs((nx+me.sw)-W)<KIT_SNAP){nx=W-me.sw-.001;snap=true;}
  nx=clamp(nx,-W+me.sw+.001,W-me.sw-.001);nz=clamp(nz,-D+me.sd+.001,D-me.sd-.001);
  return{x:Math.round(nx*1000)/1000,z:Math.round(nz*1000)/1000,snap};}
/* a hanging piece must have a wall at its back */
function kitOnWall(t,x,z,r,W,D){const R=kitRect(t,x,z,r);return(R.r===0&&R.z1<-D+.05)||(R.r===2&&R.z2>D-.05)||(R.r===1&&R.x1<-W+.05)||(R.r===3&&R.x2>W-.05);}
/* ---- decorating ---- */
const DECO={on:false,placing:null,ghost:null,sel:null,mark:null,valid:false,snap:false,x:0,z:0,r:0,X:null};
/* the same decorating tools work in your own house and in a client's room */
/* in the big house it works on the floor you stand on (upstairs things are saved with f:1); the stairs' landing stays free */
const HOMEX={id:'home',L:()=>homeFloorL(homeFl()),list:()=>S.home.items,W:()=>HOMEW,D:()=>HOMED,map:()=>HOME_ITEMS,add:it=>addHomeItem(it),rm:u=>removeHomeItem(u),
  on:o=>(o.f|0)===homeFl(),put:it=>{const k=homeFl();if(k)it.f=k;else delete it.f;},
  blocked:R=>homeBlocked(R,homeFl())};
const CLX={id:'client',L:()=>LOC.client,list:()=>dsItems(),W:()=>CLW,D:()=>CLD,map:()=>CL_ITEMS,add:it=>addClItem(it),rm:u=>removeClItem(u),blocked:R=>(R.x1<1.25&&R.x2>-1.25&&R.z2>CLD-1.75)||(dsTwo()&&R.z1<2.3&&R.z2>.9&&((S.ds.o.ri|0)?R.x2>CLW-1.4:R.x1<-CLW+1.4))};   /* the front door, and the side door to the other room, stay free */
const DX=()=>DECO.X||HOMEX;
function decoStart(){const X=CUR.id==='home'&&!CLIMB?HOMEX:CUR.id==='client'&&dsHere()?CLX:null;if(!X)return;if(zzIn())standUp();DECO.X=X;DECO.on=true;P.sit=null;X.L().grid.visible=true;$('cross').classList.add('big');$('actWrap').hidden=true;renderBar();
  if(X===HOMEX)toast(DECO_HINT,3.4);}
const DECO_HINT='Look at something to move it, or open the shop 🛍️';
function decoEnd(){if(DECO.placing)decoCancel();DECO.on=false;DX().L().grid.visible=false;if(DX()===HOMEX&&LOC.home.fls)for(const F of LOC.home.fls)F.grid.visible=false;$('cross').classList.remove('big');$('bar').hidden=true;selMark(null);change();}
function renderBar(){const b=$('bar');b.hidden=!DECO.on;if(!DECO.on)return;
  if(DECO.placing)b.innerHTML=`<button class="btn sky" data-d="turn">🔄 Turn</button><button class="btn mint" data-d="place" ${DECO.valid?'':'disabled'}>✅ Put it here</button><button class="btn white" data-d="cancel">✖ Cancel</button>`;
  else if(DX()===CLX)b.innerHTML=`<button class="btn butter${dsItems().length?'':' dsPulse'}" data-d="furn">🛋️ Furniture</button>${DECO.sel?`<div class="brow"><button class="btn sky" data-d="move">✋ Move</button><button class="btn lilac" data-d="away">🗑️ Remove</button></div>`:''}<button class="btn mint" data-d="finish">🎉 Finished!</button><button class="btn white sm" data-d="leave">🚪 Leave</button>`;
  else b.innerHTML=`<button class="btn butter" data-d="shop">🛍️ Shop</button>${DECO.sel?`<button class="btn sky" data-d="move">✋ Move it</button><button class="btn lilac" data-d="away">📦 Put away</button>`:'<button class="btn lilac" data-d="paint">🎨 House colour</button>'}<button class="btn mint" data-d="done">✅ Done</button>`;}   /* 🎨 run 4, item 23 */
function startPlacing(it){DECO.placing=it;DECO.r=it.r||0;selMark(null);
  const g=buildFurn(furnOf(it),it.c);g.traverse(o=>{if(!o.isMesh)return;if(o.material===OL||o.material.side===THREE.BackSide){o.visible=false;return;}const m=o.material.clone();m.transparent=true;m.opacity=.72;if(m.emissive)m.emissive.set('#000000');o.material=m;});
  const F=FURN[it.t];const fp=new THREE.Mesh(new THREE.PlaneGeometry(F.w,F.d),new THREE.MeshBasicMaterial({color:'#5fd4b0',transparent:true,opacity:.45,depthWrite:false}));fp.rotation.x=-Math.PI/2;fp.position.y=.03;g.add(fp);g.userData.fp=fp;
  DECO.ghost=g;scene.add(g);renderBar();}
function decoUpdate(){
  if(!DECO.on)return;const X=DX(),L=X.L(),W=X.W(),D=X.D();
  NDC.set(0,0);RAY.setFromCamera(NDC,camera);
  if(DECO.placing){const it=DECO.placing,F=FURN[it.t];let hx,hz;const dy=RAY.ray.direction.y;
    if(dy<-.05){const t=-RAY.ray.origin.y/dy;if(t<7){hx=RAY.ray.origin.x+RAY.ray.direction.x*t;hz=RAY.ray.origin.z+RAY.ray.direction.z*t;}}
    if(hx===undefined){hx=P.x-Math.sin(P.yaw)*2.4;hz=P.z-Math.cos(P.yaw)*2.4;}
    let x=Math.round((hx-L.ox)*4)/4,z=Math.round((hz-L.oz)*4)/4;const sw=(DECO.r%2?F.d:F.w)/2,sd=(DECO.r%2?F.w:F.d)/2;
    x=clamp(x,-W+sw+.02,W-sw-.02);z=clamp(z,-D+sd+.02,D-sd-.02);let snap=false;if(F.kit){const q=kitSnap(it,x,z,DECO.r,X);x=q.x;z=q.z;snap=q.snap;}DECO.x=x;DECO.z=z;   /* 🍳 kitchen pieces snap edge to edge and flush to the wall */
    DECO.ghost.position.set(L.ox+x,0,L.oz+z);DECO.ghost.rotation.y=DECO.r*Math.PI/2;
    const R=fpRect(it.t,x,z,DECO.r);let ok=true;
    if(F.hang&&!kitOnWall(it.t,x,z,DECO.r,W,D))ok=false;   /* a wall cupboard hangs on a wall */
    if(!F.flat&&!F.hang){for(const o of X.list()){if(FURN[o.t].flat||FURN[o.t].hang||(X.on&&!X.on(o)))continue;const Q=fpRect(o.t,o.x,o.z,o.r);if(R.x1<Q.x2-.01&&R.x2>Q.x1+.01&&R.z1<Q.z2-.01&&R.z2>Q.z1+.01){ok=false;break;}}
      const px=P.x-L.ox,pz=P.z-L.oz;if(px>R.x1-.32&&px<R.x2+.32&&pz>R.z1-.32&&pz<R.z2+.32)ok=false;
      if(X.blocked(R))ok=false;}
    if(ok!==DECO.valid||snap!==DECO.snap){DECO.valid=ok;DECO.snap=snap;DECO.ghost.userData.fp.material.color.set(ok?(snap?'#22e07c':'#5fd4b0'):'#ff5d6c');renderBar();}   /* bright green = snapped */
  }else{const hits=RAY.intersectObjects(L.items.children,true);let u=null;if(hits.length&&hits[0].distance<7){let o=hits[0].object;while(o&&!o.userData.u)o=o.parent;if(o)u=o.userData.u;}
    if(u!==(DECO.sel&&DECO.sel.u)){const rec=u?X.map().get(u):null;selMark(rec?rec.it:null);renderBar();}}
}
function decoTap(cx,cy){if(DECO.placing)return;const X=DX();NDC.set(cx/innerWidth*2-1,-(cy/innerHeight)*2+1);RAY.setFromCamera(NDC,camera);const hits=RAY.intersectObjects(X.L().items.children,true);
  if(hits.length&&hits[0].distance<8){let o=hits[0].object;while(o&&!o.userData.u)o=o.parent;if(o){const rec=X.map().get(o.userData.u);if(rec){selMark(rec.it);renderBar();}}}}
function selMark(it){DECO.sel=it;if(DECO.mark){scene.remove(DECO.mark);DECO.mark=null;}
  if(it){const L=DX().L(),R=fpRect(it.t,it.x,it.z,it.r);const m=new THREE.Mesh(new THREE.PlaneGeometry(R.x2-R.x1+.3,R.z2-R.z1+.3),new THREE.MeshBasicMaterial({color:'#ffd45c',transparent:true,opacity:.55,depthWrite:false}));
    m.rotation.x=-Math.PI/2;m.position.set(L.ox+it.x,.035,L.oz+it.z);scene.add(m);DECO.mark=m;}}
function decoTurn(){if(!DECO.placing)return;DECO.r=(DECO.r+1)%4;SFX.tap();}
function decoPlace(){if(!DECO.placing||!DECO.valid)return;const X=DX(),it=DECO.placing;it.x=DECO.x;it.z=DECO.z;it.r=DECO.r;delete it._from;delete it.mv;if(X.put)X.put(it);X.list().push(it);X.add(it);
  scene.remove(DECO.ghost);DECO.ghost=null;DECO.placing=null;DECO.valid=false;SFX.pop();
  if(X===HOMEX){doneTask('decor');qEvent('decor');qEvent('place:'+furnOf(it));if(FLOWER_TYPES.includes(it.t)){qEvent('placeflower');addXP('garden',4);}else addXP('decor',3);}
  else{addXP('decor',2);dcardUpd();jobHud(true);}change();renderBar();}
function decoCancel(){if(!DECO.placing)return;const X=DX(),it=DECO.placing;
  if(X===HOMEX){delete it.f;S.home.store.push(it);}else if(it._from){Object.assign(it,it._from);delete it._from;X.list().push(it);X.add(it);}
  scene.remove(DECO.ghost);DECO.ghost=null;DECO.placing=null;DECO.valid=false;change();renderBar();}
function decoMove(){const X=DX(),it=DECO.sel;if(!it)return;const L=X.list();L.splice(L.indexOf(it),1);X.rm(it.u);if(X===CLX)it._from={x:it.x,z:it.z,r:it.r};startPlacing(it);}
function decoAway(){const X=DX(),it=DECO.sel;if(!it)return;const L=X.list();L.splice(L.indexOf(it),1);X.rm(it.u);selMark(null);SFX.pop();
  if(X===HOMEX){delete it.f;S.home.store.push(it);toast('Put away. Find it in 🛍️ Shop → My stuff.');}else{dcardUpd();jobHud(true);}change();renderBar();}
$('bar').addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b||b.disabled)return;SFX.tap();
  ({turn:decoTurn,place:decoPlace,cancel:decoCancel,shop:()=>openCatalog('buy'),move:decoMove,away:decoAway,done:decoEnd,paint:openHousePaint,furn:()=>openPhone('furn'),finish:dsFinishAsk,leave:()=>exitClient()})[b.dataset.d]();});

