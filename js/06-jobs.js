'use strict';
/* ================= jobs: Rosie helps you pick one ================= */
const JOBS={delivery:{i:'🍕',n:'Pizza delivery',d:"Bring pizzas to people's houses!"},designer:{i:'🎨',n:'Interior designer',d:'Decorate rooms for people and get stars!'},teacher:{i:'📚',n:'Teacher',d:'Teach a class and grade homework!'},hair:{i:'✂️',n:'Hairstylist',d:'Give people the hairstyle they want!'},photo:{i:'📸',n:'Photographer',d:'Take happy pictures for people!'}};   /* 📸 the 5th job (run 4, job 15) */
const DLV_DAY=3,PIZZAS=['cheese','pepperoni','veggie','pineapple','mushroom','super cheesy'],DLV_TIMES=[120,180,300,1800],PIZZERIA=[59.2,8.6];
const DOT_COLS=[['#ff3b3b','Red'],['#2f7bff','Blue'],['#16c75a','Green'],['#ffd000','Yellow'],['#a24dff','Purple'],['#ff8a00','Orange'],['#ff4fd8','Pink'],['#1d1622','Black'],['#ffffff','White']];
const WHO={
  n1:{nm:'Mia',look:{skin:'#f5cfb0',hair:'#5a3a24',style:'pigtails',top:'#ffd45c',bottom:'#7cc8ff',shoes:'#ff7aa8',eyes:'sparkle',mouth:'small',scale:.9}},
  n2:{nm:'Leo',look:{skin:'#ffd9bd',hair:'#e8734a',style:'short',top:'#7cc8ff',bottom:'#3f4c86',shoes:'#ffffff',eyes:'sparkle',mouth:'small',scale:.92}},
  n3:{nm:'Grandma Rose',look:{skin:'#f6d3bb',hair:'#d8d8e4',style:'bun',top:'#b79cff',bottom:'#6f7dff',shoes:'#3d2c5e',dress:true,glasses:'glasses',eyes:'sparkle',mouth:'small'}},
  s1:{nm:'Zoe',look:{skin:'#8a5a3c',hair:'#2e2347',style:'long',top:'#ff7aa8',bottom:'#ffffff',shoes:'#b79cff',dress:true,eyes:'sparkle',mouth:'small',scale:.92}},
  s2:{nm:'Max',look:{skin:'#c98d63',hair:'#1f1a2e',style:'curly',top:'#5fd4b0',bottom:'#3f4c86',shoes:'#ff6b6b',hat:'cap',hatc:'#ff6b6b',eyes:'sparkle',mouth:'small'}},
  s3:{nm:'Mrs. Lee',look:{skin:'#f2d3b3',hair:'#1f1a2e',style:'bun',top:'#ff8a6b',bottom:'#3f4c86',shoes:'#2e2347',dress:true,eyes:'sparkle',mouth:'small'}},
  nb:{nm:'Ben',look:{skin:'#ffe0c2',hair:'#f2d16b',style:'short',top:'#ff9ec4',bottom:'#5b8cff',shoes:'#ffffff',eyes:'sparkle',mouth:'small',scale:.9}},
  ap1:{nm:'Ava',look:{skin:'#d9a06b',hair:'#9a6a43',style:'long',top:'#5fd4b0',bottom:'#ffffff',shoes:'#ff7aa8',eyes:'sparkle',mouth:'small'}},
  of:{nm:'Mr. Bolt',look:{skin:'#f5cfb0',hair:'#3d2c5e',style:'short',top:'#3d4a7a',bottom:'#3d4a7a',shoes:'#2e2347',glasses:'glasses',eyes:'sparkle',mouth:'small'}},
  ap2:{nm:'Lily',look:{skin:'#ffd9bd',hair:'#f2d16b',style:'pigtails',top:'#b79cff',bottom:'#ffffff',shoes:'#ff7aa8',dress:true,eyes:'sparkle',mouth:'small',scale:.88}},
  ap3:{nm:'Oscar',look:{skin:'#c98d63',hair:'#9a6a43',style:'curly',top:'#ffd45c',bottom:'#3f4c86',shoes:'#5fd4b0',eyes:'sparkle',mouth:'small'}}};
/* more people live in the houses, and rare fancy customers visit sometimes */
const MORE={
  n1:[{nm:'Hana',look:{skin:'#f6d3bb',hair:'#1f1a2e',style:'ponytail',top:'#ff9ec4',bottom:'#3f4c86',shoes:'#ffffff',eyes:'sparkle',mouth:'small'}}],
  n2:[{nm:'Grandpa Joe',look:{skin:'#f5cfb0',hair:'#d8d8e4',style:'short',top:'#9a6a43',bottom:'#3d2c5e',shoes:'#2e2347',glasses:'glasses',hat:'beanie',hatc:'#5fd4b0',eyes:'happy',mouth:'small'}}],
  n3:[{nm:'Sam',look:{skin:'#c98d63',hair:'#1f1a2e',style:'curly',top:'#ff6b6b',bottom:'#3f4c86',shoes:'#ffffff',eyes:'sparkle',mouth:'grin',scale:.88}}],
  s1:[{nm:'Nora',look:{skin:'#8a5a3c',hair:'#1f1a2e',style:'bun',top:'#5fd4b0',bottom:'#3d2c5e',shoes:'#ff7aa8',dress:true,eyes:'sparkle',mouth:'small'}}],
  s2:[{nm:'Uncle Ray',look:{skin:'#c98d63',hair:'#1f1a2e',style:'short',top:'#ffd45c',bottom:'#5b8cff',shoes:'#2e2347',hat:'cowboy',eyes:'happy',mouth:'grin'}}],
  s3:[{nm:'Kai',look:{skin:'#f2d3b3',hair:'#1f1a2e',style:'short',top:'#7cc8ff',bottom:'#ffffff',shoes:'#ff6b6b',hat:'headphones',hatc:'#7cc8ff',eyes:'sparkle',mouth:'small',scale:.9}}],
  nb:[{nm:'Ella',look:{skin:'#ffe0c2',hair:'#f2d16b',style:'ponytail',top:'#b79cff',bottom:'#ffffff',shoes:'#5fd4b0',hat:'bow',eyes:'sparkle',mouth:'small',scale:.9}}],
  ap1:[{nm:'Tom',look:{skin:'#ffd9bd',hair:'#9a6a43',style:'short',top:'#5b8cff',bottom:'#3d2c5e',shoes:'#ffffff',eyes:'sparkle',mouth:'small'}},{nm:'Ruby',look:{skin:'#d9a06b',hair:'#e8734a',style:'long',top:'#ff6b6b',bottom:'#ffffff',shoes:'#ffd45c',dress:true,eyes:'sparkle',mouth:'small'}}],
  of:[{nm:'Ms. Plum',look:{skin:'#f5cfb0',hair:'#a24dff',style:'bun',top:'#b79cff',bottom:'#3d2c5e',shoes:'#2e2347',dress:true,glasses:'glasses',eyes:'sparkle',mouth:'small'}},{nm:'Dev',look:{skin:'#c98d63',hair:'#1f1a2e',style:'short',top:'#ffffff',bottom:'#3f4c86',shoes:'#9a6a43',glasses:'glasses',eyes:'sparkle',mouth:'small'}}],
  ap2:[{nm:'Finn',look:{skin:'#ffe0c2',hair:'#e8734a',style:'curly',top:'#16c75a',bottom:'#3f4c86',shoes:'#ffffff',hat:'cap',hatc:'#2f7bff',eyes:'sparkle',mouth:'grin',scale:.88}},{nm:'Iris',look:{skin:'#8a5a3c',hair:'#2e2347',style:'pigtails',top:'#ffd45c',bottom:'#a24dff',shoes:'#ffffff',hat:'flowers',eyes:'sparkle',mouth:'small',scale:.9}}],
  ap3:[{nm:'Ivy',look:{skin:'#f6d3bb',hair:'#5a3a24',style:'long',top:'#5fd4b0',bottom:'#ffffff',shoes:'#ff7aa8',hat:'bunny',eyes:'sparkle',mouth:'small',scale:.9}},{nm:'Jack',look:{skin:'#ffd9bd',hair:'#f2d16b',style:'short',top:'#ff8a00',bottom:'#3f4c86',shoes:'#2e2347',eyes:'sparkle',mouth:'small'}}]};
const VIPS=[
  {nm:'Princess Poppy',e:'👸',t:'a real princess',she:1,look:{skin:'#ffe0c2',hair:'#f2d16b',style:'long',top:'#ff9ec4',bottom:'#ffffff',shoes:'#ffd45c',dress:true,hat:'tiara',hatc:'#ffd45c',eyes:'sleepy',mouth:'small',scale:.92}},
  {nm:'Stella Star',e:'🎬',t:'a famous movie star',she:1,look:{skin:'#d9a06b',hair:'#1f1a2e',style:'long',top:'#ff4fd8',bottom:'#2e2347',shoes:'#ffd45c',dress:true,glasses:'sunglasses',eyes:'sleepy',mouth:'small'}},
  {nm:'Sir Crumbleton',e:'📝',t:'a famous food critic',she:0,look:{skin:'#f6d3bb',hair:'#d8d8e4',style:'short',top:'#3d4a7a',bottom:'#2e2347',shoes:'#1d1622',glasses:'glasses',glc:'#ffd45c',eyes:'sleepy',mouth:'small'}},
  {nm:'King Fussbert',e:'🤴',t:'a real king',she:0,look:{skin:'#f5cfb0',hair:'#9a6a43',style:'curly',top:'#c0392b',sleeve:'#ffd45c',bottom:'#ffd45c',shoes:'#3d2c5e',hat:'crown',eyes:'sleepy',mouth:'small'}},
  {nm:'DJ Glitter',e:'🎤',t:'a famous pop star',she:1,look:{skin:'#8a5a3c',hair:'#a24dff',style:'ponytail',top:'#5fd4b0',bottom:'#a24dff',shoes:'#ffffff',hat:'headphones',hatc:'#ffd45c',glasses:'hearts',eyes:'sleepy',mouth:'small'}},
  {nm:'Madame Mystery',e:'🔮',t:'a mysterious magician',she:1,look:{skin:'#f2d3b3',hair:'#2e2347',style:'long',top:'#5a3f8a',bottom:'#3d2c5e',shoes:'#a24dff',dress:true,hat:'witch',hatc:'#5a3f8a',eyes:'sleepy',mouth:'small'}}];
const RARE_P=.22,STAR_T=['New pizza kid','Pizza helper','Speedy driver','Pizza pro','Pizza star','Pizza legend 👑'];
const resList=id=>[WHO[id],...(MORE[id]||[])];
function oWho(o){return o.v!=null&&VIPS[o.v]?VIPS[o.v]:(resList(o.h)[o.w|0]||WHO[o.h]);}
const dlStars=()=>clamp(S.dlStars|0,0,5);
/* 🍕 pizza day: 3 pizzas, then the chef says stop. Insist and he bakes 3 more (6 at most). Pay per pizza grows with your Pizza stars:
   3 pizzas at 0 ⭐ (120 🪙) earn less than a weak day in the other jobs (~150 🪙), at 5 ⭐ (390 🪙 + RARE bonus) a little more than their best day (~390 🪙).
   The 3 extra pizzas pay half, so a 5 ⭐ "maniac" day of 6 pizzas is about 600 🪙 (it was 1260) */
const dlMax=()=>dl().more?DLV_DAY*2:DLV_DAY,PZ_PAY=[40,60,75,95,110,130],PZ_RARE=40,dlPay=s=>PZ_PAY[clamp(s==null?dlStars():s|0,0,5)],dlHalf=s=>Math.ceil(dlPay(s)/2);
const dlOff=()=>{const d=dl();return!!d.end||d.done>=dlMax();};   /* no more orders today */
const dlAsk=()=>{const d=dl();return d.done>=DLV_DAY&&d.done<DLV_DAY*2&&!d.more&&!d.end;};   /* 3 done: the chef asks "enough?" */
const starsH=n=>`<span class="stars">${'★'.repeat(n)}<i>${'★'.repeat(5-n)}</i></span>`;
/* real walking distance along the paths, from the Pizzeria door to a house door */
let RTD=null;
function routeLen(x,z){if(!RTD){const n=WP.length,d=new Array(n).fill(1e9),done=new Array(n).fill(false);
    for(let i=0;i<n;i++)d[i]=Math.hypot(WP[i][0]-PIZZERIA[0],WP[i][1]-PIZZERIA[1])*1.6;
    for(;;){let u=-1,m=1e9;for(let i=0;i<n;i++)if(!done[i]&&d[i]<m){m=d[i];u=i;}if(u<0)break;done[u]=true;
      for(const v of NEIGH[u]){const w=d[u]+Math.hypot(WP[u][0]-WP[v][0],WP[u][1]-WP[v][1]);if(w<d[v])d[v]=w;}}RTD=d;}
  let b=1e9;for(let i=0;i<WP.length;i++)b=Math.min(b,RTD[i]+Math.hypot(WP[i][0]-x,WP[i][1]-z)*1.15);return b;}
const doorLen=H=>routeLen(H.x+Math.sin(H.ry),H.z+Math.cos(H.ry));
/* VIPs are always a rush: about 5 m per second plus a little, so you need to RUN. Flats add time for the stairs. */
function rareLim(H,flat){let t=12+doorLen(H)/5.2;if(flat)t+=12+(Math.floor(flat/10)-1)*8;return Math.max(20,Math.round(t/5)*5);}
const pizzaOpen=()=>wdIdx()<5&&S.time>=12&&S.time<21,PZ_TIME='Pizza time is 12:00–21:00, Monday to Friday';   /* orders come only then; the Pizzeria itself stays open */
const pzNext=()=>wdIdx()===4||wdIdx()===5?'on Monday':'tomorrow';
const pzShutLine=()=>(wdIdx()>4?"It's the WEEKEND! 😎 My oven is having a rest. ":S.time<12?"Too early! 🥱 My pizza dough is still sleeping. ":"The kitchen is CLOSED! Even chefs need to sleep! 🌙 ")+PZ_TIME+' 🍕';
const mmss=t=>{t=Math.max(0,Math.ceil(t));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0');};
function dl(){const d=S.dl||(S.dl={});if(d.day!==S.day){d.day=S.day;d.done=0;d.on=false;d.rares=0;d.lr=false;d.more=0;d.end=0;}if(!d.dot)d.dot='#ff3b3b';if(!isFinite(d.wait))d.wait=6;return d;}
function dlCarrying(){return!!(S&&S.job==='delivery'&&S.dl&&S.dl.o&&S.dl.o.st==='carry');}
function dlWaiting(){return!!(S&&S.job==='delivery'&&S.dl&&S.dl.o&&S.dl.o.st==='wait');}
function hasDlOrder(){return!!(S&&S.job==='delivery'&&S.dl&&S.dl.o);}

/* picking a job */
let JOBCTX='talk',askT=0;
const rosieHd=()=>`<div class="who" style="--c:#ff9ec4">Rosie</div>`;
function jobCards(){return`<div class="jobs">${Object.keys(JOBS).map(k=>{const J=JOBS[k],on=S.job===k;
  return`<button class="jobc${on?' on':''}" data-a="job:${k}" ${J.soon?'disabled':''}><span class="ji">${J.i}</span><b>${J.n}</b><small>${J.soon?'🔨 Coming soon!':on?'✅ Your job now':J.d}</small></button>${on&&(k==='delivery'||k==='hair'||k==='photo')?`<button class="btn white jobq" data-a="jobtut:${k}" aria-label="How does this job work?">❓ How does it work?</button>`:''}`;}).join('')}</div>`;}
ACT.jobtut=k=>{closePanel();PH.jobs=false;setTimeout(()=>{if(k==='hair')hsTutStart();else if(k==='photo')ptTutStart();else tutStart();},60);};   /* ❓ the picture tutorial again, any time (run 4, job 14) */
function jobHello(k){const later=' Want a different job later? '+(JOBCTX==='msg'?'Just message me! 📱':'Just come talk to me!');
  return k==='delivery'?"Pizza delivery! 🍕 Yay! Go to the Pizzeria, next to the Bakery. Chef Blaze will give you pizzas to bring to people."+later
    :k==='designer'?"Interior designer! 🎨 Yay! People will send you a message when they want a room decorated. Go to their house and pick furniture on your phone. It's free for your job! Make it pretty and get stars! ⭐"+later
    :k==='teacher'?"Teacher! 📚 Yay! Mrs. Maple, the school director, will message you which class to teach. Go to the school, find the right classroom, sit at your desk and teach! Then grade the homework. ✏️"+later
    :k==='hair'?"Hairstylist! ✂️ Yay! Go to the Hair Salon on the west road, by the Apartments. Customers sit in your chair and show you the hair they want. Cut, comb and dye it, and get stars! ⭐"+later
    :k==='photo'?"Photographer! 📸 Yay! People will message you when they want a photo: a family, a wedding, a birthday, their pets… Go to the place on your map, pick the background, give everyone a pose, frame them and snap! Lovely photos get stars! ⭐"+later:'Great choice!';}
function setJob(k){if(S.job===k)return;if(S.dl)S.dl.o=null;if(S.ds)S.ds.o=null;if(S.tc)S.tc.o=null;tcClear();hsClear();if(S.pt)S.pt.o=null;ptClear();if(CUR&&CUR.id==='client')exitClient();S.job=k||null;S.jobAsk=true;change();jobHud(true);dcardUpd(true);}
/* 💬 Messages: chats with the Pizzeria and Rosie, saved in your game */
function msgs(){const m=S.msg||(S.msg={pz:[],ro:[]});if(!m.pz)m.pz=[];if(!m.ro)m.ro=[];if(!m.cl)m.cl=[];if(!m.dr)m.dr=[];if(!m.pc)m.pc=[];if(!m.u)m.u={pz:0,ro:0};return m;}
const msgUnread=()=>S?Object.values(msgs().u).reduce((a,b)=>a+(b|0),0):0;
const phoneOpen=()=>UI.open&&!!document.querySelector('#card .phone');
function addMsg(ch,from,text,o){const m=msgs(),L=m[ch];L.push(Object.assign({f:from,x:text,d:S.day,h:+S.time.toFixed(2)},o||{}));if(L.length>40)L.splice(0,L.length-40);
  const looking=phoneOpen()&&PH.app==='msg'&&PH.chat===ch;if(from!=='me'&&!(o&&o.q)&&!looking)m.u[ch]=Math.min(L.length,(m.u[ch]|0)+1);change();updPhoneBadge();if(looking)renderPhone();}
const CHATS={pz:{n:'Pizzeria · Chef Blaze',av:'👨‍🍳',c:'#ffb36b'},ro:{n:'Rosie',av:'👧',c:'#ff9ec4'},cl:{n:'Clients',av:'🎨',c:'#b79cff'},dr:{n:'School · Mrs. Maple',av:'👩‍🏫',c:'#7fdcb5'},pc:{n:'Photo bookings',h:'Photos',av:'📸',c:'#ffd45c'}};
function msgPhone(){const m=msgs(),c=PH.chat;
  if(!c)return`<p class="ph-sub">Your chats. Orders from the Pizzeria are saved here!</p><div class="chats">${Object.keys(CHATS).map(k=>{const C=CHATS[k],L=m[k],last=L[L.length-1],u=m.u[k]|0;
    return`<button class="chat" data-a="chat:${k}"><span class="cav" style="background:${C.c}">${C.av}</span><span class="cmid"><b>${C.n}</b><small>${last?esc((last.f==='me'?'You: ':'')+last.x):'No messages yet'}</small></span>${u?`<span class="cbadge">${u}</span>`:''}</button>`;}).join('')}</div>`;
  const C=CHATS[c],L=m[c];let h=`<div class="bubs">`;
  h+=L.length?L.map(b=>`<div class="bub ${b.f==='me'?'me':'them'}${b.r?' r':''}">${b.t2?`<b>${esc(b.t2)}</b><br>`:''}${b.img?ptImg(b.img):''}${esc(b.x)}<span class="tm">${wdName(b.d).slice(0,3)} · ${clockStr(b.h)}</span></div>`).join(''):`<p class="ph-sub">No messages yet.</p>`;h+='</div>';
  if(c==='pz')h+=`<p class="ph-sub" style="margin-top:10px">✏️ Write the flat number on your notepad so you don't forget!</p>`;
  if(c==='ro'){if(PH.jobs)h+=`<div class="phjobs">${jobCards()}</div>`;h+=`<div class="creply"><button class="btn mint" data-a="rjob">💼 I want a new job</button><button class="btn white" data-a="rhi">👋 Just saying hi!</button></div>`;}
  return h;}
ACT.chat=c=>{PH.chat=c||null;PH.jobs=false;if(c){msgs().u[c]=0;updPhoneBadge();change();}if(c!=='ro')SFX.tap();renderPhone();};
ACT.phchat=c=>{openPhone('msg',c);};
ACT.tutgo=()=>{closePanel();setTimeout(tutStart,250);};
const rosieLater=(t,ms)=>setTimeout(()=>{addMsg('ro','ro',t);},ms||800);   /* (no sound: Rosie is quiet) */
ACT.rjob=()=>{addMsg('ro','me','I want a new job! 💼');JOBCTX='msg';addMsg('ro','ro','Yay! 🎉 Which job do you want? Pick one!');PH.jobs=true;renderPhone();};   /* her question comes with the cards, so nothing jumps under your finger (night 3) */
ACT.rhi=()=>{addMsg('ro','me','Just saying hi! 👋');PH.jobs=false;renderPhone();
  rosieLater(pick([`Hi ${S.name||'friend'}! 💗 You made my day!`,"Hiii! 👋 Come find me at the park by the fountain later!","Hi hi! 🌸 Have you tried the ice cream shop? It's sooo yummy!","Hello! 😊 I hope you're having a super cozy day!","Hey! 🐶 Did you know you can adopt a pet at the Pet Shop?"]),900);};
function askJob(){S.jobAsk=true;change();addMsg('ro','ro',`Hi ${S.name||'friend'}! 👋 Guess what? Now you can have a JOB in Cozy Town! 💼 Tap “I want a new job” to pick one!`);
  showNote('📱 New message from Rosie!','Open 💬 Messages on your phone to read it.',false,'💬','ro');}   /* (no ding: Rosie is quiet) */
function askJobOld(){S.jobAsk=true;JOBCTX='ask';change();
  openPanel(`${rosieHd()}<p class="line">📱 Hi ${esc(S.name||'friend')}! Guess what? Now you can have a JOB in Cozy Town! What do you want to be?</p>${jobCards()}<div class="row"><button class="btn white" data-a="jobskip">Maybe later</button></div>`,{bottom:true,lock:true});}
ACT.job=k=>{if(!JOBS[k]||JOBS[k].soon)return;const same=S.job===k;setJob(k);if(!quietCard())SFX.yay();
  if(JOBCTX==='msg'){PH.jobs=false;addMsg('ro','me',`${JOBS[k].i} ${JOBS[k].n}, please!`);rosieLater(same?`That's already your job! You're doing great. ${JOBS[k].i}`:jobHello(k),700);if(!same)setTimeout(()=>tutMaybe(),1200);return;}
  if(JOBCTX==='intro'){openPanel(`${rosieHd()}<p class="line">${esc(jobHello(k))}</p><div class="row"><button class="btn mint" data-a="inext">Next</button></div>`,{bottom:true,lock:true});return;}
  const line=same?`That's already your job! You're doing great. ${JOBS[k].i}`:jobHello(k),go=k==='delivery'?`<button class="btn butter" data-a="nav:pizza">📍 Show me the way</button>`:'';
  if(JOBCTX==='talk'&&FR){renderFriend(line,`<div class="row">${go}<button class="btn white" data-a="fback">Back</button></div>`);return;}
  openPanel(`${rosieHd()}<p class="line">${esc(line)}</p><div class="row">${go}<button class="btn mint" data-a="close">OK!</button></div>`,{bottom:true});};
ACT.jobskip=()=>{if(JOBCTX==='intro'){INTRO++;introStep();return;}closePanel();toast('OK! Talk to Rosie any time to get a job. 💼',3.2);};
ACT.nojob=()=>{setJob(null);renderFriend('OK! No job for now. Come back any time you want one! 💗');};
ACT.fjob=()=>{JOBCTX='talk';renderFriend(S.job?`Right now your job is ${JOBS[S.job].i} ${JOBS[S.job].n}. Want to change it?`:'What job do you want to do?',
  jobCards()+`<div class="row">${S.job?'<button class="btn white" data-a="nojob">No job for now</button>':''}<button class="btn white" data-a="fback">Back</button></div>`);};
ACT.findrosie=()=>{const f=FRIEND_ACTORS.find(a=>a.d.id==='rosie');if(!f||f.mode==='away'){SFX.no();toast('😴 Rosie is sleeping now. Find her in the morning!',3.2);return;}setNavTo({id:'rosie',n:'Rosie',i:'👧',nt:1,door:[f.x,f.z],actor:f});};

/* the chef at the pizzeria */
function chefSay(line,btns,lock,wait){const K=KEEPERS.find(k=>k.name==='Chef Blaze');if(K)K.p.wave=1.2;SFX.talk();
  openPanel(`<div class="who" style="--c:#ff7a1f">${CUR.id==='pizza'?'🔥':'📱'} Chef Blaze</div><p class="line">${esc(line)}</p><div class="row">${(btns||[['🛒 Buy food','pzshop'],['OK!','close']]).map(([t,a],i)=>`<button class="btn ${i?'white':'mint'}" data-a="${a}">${t}</button>`).join('')}</div>`,{bottom:true,lock:!!lock,cls:wait?'chefw':''});}
ACT.pzshop=()=>openShop('pizza');
function chefTalk(){if(S.job!=='delivery'){chefSay("WELCOME to my kitchen! 🔥 I'm Chef Blaze. The BEST pizza in town — I promise! Hungry?",[['🛒 Buy food','pzshop'],['Bye!','close']]);return;}
  const d=dl(),o=d.o;
  if(o&&o.st==='wait'){pickUp();return;}
  if(o){const W=oWho(o);chefSay(o.r?`What are you doing back here?! ⭐ ${W.nm} is WAITING! Go, go, GO! 🛵`:`Why are you still here?! ${W.nm} is waiting for that ${o.pz} pizza! GO, GO, GO! 🛵`,[['🛵 Yes, Chef!','close']]);return;}
  if(d.fb){const f=d.fb;d.fb=null;change();chefSay(f==='bad'?"A BAD review?! 😱 Come ON! I know you can be faster than that! Next time: run, run, RUN! 🏃":"A FIVE-star review! 🌟 BEAUTIFUL! That's how we do it in MY kitchen!",[['🔥 Yes, Chef!','close']]);return;}
  if(dlAsk()){chefAsk();return;}
  if(d.done>=DLV_DAY*2){chefSay("That's it, see ya!",[['👋 Bye, Chef!','close']]);return;}
  if(d.end==='rest'){chefSay(`You again?! 😄 No more pizzas today: go and CHILL! See you ${pzNext()}!`);return;}
  if(!pizzaOpen()){chefSay(pzShutLine());return;}
  if(!d.on){d.on=true;d.wait=Math.min(d.wait,5);change();}
  chefSay(d.quiet>0?"It's very quiet… 😟 People read that bad review. Wait here — an order will come soon!":"No orders yet! Patience… wait right here, they'll come! 📩",null,0,1);}
function pickUp(){const d=dl(),o=d.o;if(!o||o.st!=='wait')return;o.st='carry';o.left=o.lim;change();SFX.pop();jobHud(true);
  const H=HOUSE(o.h),W=oWho(o);const at=`the ${H.n}${o.flat?', flat '+o.flat:''}`;
  if(o.r)chefSay(`Listen up! ⭐ This ${o.pz} pizza is for ${W.nm}, ${W.t}! ${W.she?'She':'He'} doesn't even LIKE pizza… so you must be FAST. Lightning fast! Take it to ${at}. Your timer starts when you close this. GO!`,[["🔥 Yes, Chef!",'close']]);
  else chefSay(`Here it is! One PERFECT ${o.pz} pizza for ${W.nm}! 🍕 Take it to ${at}. Now go — don't let it get cold!`,[["🛵 Yes, Chef!",'close']]);}
function pizzaIn(){if(S.job!=='delivery')return;const d=dl();
  if(d.o&&d.o.st==='wait'){setTimeout(()=>toast('📩 Talk to Chef Blaze to pick up the pizza!',3),600);return;}
  if(d.o)return;
  if(dlAsk()){setTimeout(()=>{if(CUR.id==='pizza'&&!UI.open&&!CUT)chefTalk();},700);return;}
  if(dlOff())return;
  if(!pizzaOpen()){setTimeout(()=>{if(CUR.id==='pizza'&&!UI.open)toast('🕛 '+PZ_TIME+' 🍕',3.4);},600);return;}
  if(!d.on){d.on=true;d.wait=Math.min(d.wait,6);change();setTimeout(()=>{if(CUR.id==='pizza'&&!UI.open)chefSay('Welcome to work! 🍕 Wait here, an order will come soon!',[['OK!','close']],0,1);},700);}}

/* after the 3rd pizza: "enough?" — the kid decides. After the 6th or at 21:00 the chef says bye */
function chefAsk(){if(!pizzaOpen()){dlShut();return;}chefSay("Right! That's enough. Chill for today!",[['Yay! Chef, bye!','pzrest'],['PIZZAS MUST BE DELIVERED','pzmore']],1);}
function dlShut(){const d=dl();d.end='shut';change();jobHud(true);chefSay("Today's done, great work! Ciao!",[['👋 Ciao!','close']]);}
ACT.pzrest=()=>{closePanel();if(!dlAsk())return;dl().end='rest';change();jobHud(true);SFX.yay();toast(`😎 Chill time! Pizza time again ${pzNext()} at 12:00.`,3.4);};
ACT.pzmore=()=>{if(!dlAsk()){closePanel();return;}if(!pizzaOpen()){dlShut();return;}const d=dl();d.more=1;d.on=true;d.wait=Math.min(d.wait,8);change();jobHud(true);
  chefSay("You absolute maniac! Fine! I'll bake THREE more. Three! And not ONE more!",[['🛵 Yes, Chef!','close']]);};
/* a delivery is done: the chef calls when the day's pizzas are done or the Pizzeria closed (waits until nothing else is on screen) */
function dlAfter(bad,n=0){if(!S||S.job!=='delivery')return;if(UI.open||CUT||TUT||fading||$('toast').classList.contains('show')){if(n<150)setTimeout(()=>dlAfter(bad,n+1),800);return;}const d=dl();
  if(d.done>=DLV_DAY*2&&!d.end){d.end='six';change();jobHud(true);SFX.yay();chefSay("That's it, see ya!",[['👋 Bye, Chef!','close']]);}
  else if(d.on&&!d.end&&!d.o&&!pizzaOpen())dlShut();
  else if(dlAsk())chefAsk();
  else toast(bad?'😟 Bad review… it will be quiet for a while. Be FAST next time! 💪':d.on&&pizzaOpen()&&!dlOff()?'🍕 Nice delivery! A new order will come soon.':'🍕 Nice delivery!',3.4);}

/* a new order comes in */
function newOrder(){const d=dl();let H=pick(HOUSES.filter(h=>h.id!==d.last));const pz=pick(PIZZAS),ex=d.done>=DLV_DAY,bp=ex?dlHalf():dlPay();   /* ex: one of the 3 extra pizzas (half pay) */
  const rare=(S.dlTotal||0)>=2&&!d.lr&&(d.rares||0)<3&&Math.random()<RARE_P;let o,far=false;
  if(rare){const L=HOUSES.filter(h=>h.id!==d.last).sort((a,b)=>doorLen(b)-doorLen(a));far=Math.random()<.6;H=pick(far?L.slice(0,4):L.slice(-4));}
  const flat=isApt(H.id)?(1+Math.floor(Math.random()*3))*10+1+Math.floor(Math.random()*5):0;
  if(rare){let v=Math.floor(Math.random()*VIPS.length);if(v===d.lv)v=(v+1)%VIPS.length;d.lv=v;d.rares=(d.rares||0)+1;const lim=rareLim(H,flat);o={h:H.id,pz,lim,pay:bp+PZ_RARE,st:'wait',left:lim,r:1,v};}
  else{const lim=pick(DLV_TIMES);o={h:H.id,pz,lim,pay:bp,st:'wait',left:lim,w:Math.floor(Math.random()*resList(H.id).length)};}
  if(flat)o.flat=flat;if(ex)o.x=1;d.o=o;d.lr=rare;d.last=H.id;if(d.quiet>0)d.quiet--;change();
  SFX.ding();if(rare)setTimeout(()=>SFX.rare(),650);try{if(navigator.vibrate)navigator.vibrate(rare?[120,80,120,80,320]:[120,80,120]);}catch(e){}
  const W=oWho(o);
  const at=`the ${H.n}${o.flat?', flat '+o.flat:''}`,sh=W.she?'She':'He';let t,x;
  if(rare){t='⭐ RARE customer! Be careful!';x=far?`${W.nm} ${W.e} wants a ${pz} pizza at ${at}. That's FAR away! ${sh} doesn't like pizza much… ⏱️ Only ${o.lim} seconds! RUN! 💰 Big reward!`:`${W.nm} ${W.e} wants a ${pz} pizza at ${at}. It's close… but ${sh.toLowerCase()} is SO impatient! ⏱️ Only ${o.lim} seconds! 💰 Big reward!`;}
  else{t=o.lim>=1800?'📩 Common order — no rush 😌':'📩 Common order — hurry!';x=`${W.nm} wants a ${pz} pizza at ${at}. ⏱️ ${o.lim>=1800?'30 minutes.':Math.round(o.lim/60)+' minutes!'} ${CUR.id==='pizza'?'Pick it up from Chef Blaze!':'Come to the Pizzeria to pick it up!'}`;}
  if(UI.open&&$('card').classList.contains('chefw'))closePanel();   /* the order came: the Chef's "wait here" card is done */
  showNote(t,x,rare);addMsg('pz','pz',x,{r:rare?1:0,t2:t});
  jobHud(true);}
let noteTm=0;
let NOTE_CHAT=null;
function showNote(t,x,rare,icon,chat){const n=$('note');$('noteT').textContent=t;$('noteX').textContent=x;n.querySelector('.ni').textContent=icon||(rare?'🌟':'🍕');NOTE_CHAT=chat||null;
  n.querySelector('small').textContent=chat?'Tap to read it':'Tap to close · saved in 📱 Messages';n.classList.toggle('rare',!!rare);n.hidden=false;const refit=()=>{try{notePlace();toastPlace();const pe=POPQ.el;if(pe&&pe.classList.contains('coin'))popFit(pe);}catch(e){}};refit();setTimeout(refit,30);n.classList.remove('in');void n.offsetWidth;n.classList.add('in');clearTimeout(noteTm);noteTm=setTimeout(()=>{n.hidden=true;},rare||chat?12000:9000);}
$('note').addEventListener('click',()=>{SFX.tap();$('note').hidden=true;if(NOTE_CHAT&&!CUT&&!UI.open)openPhone('msg',NOTE_CHAT);});

/* the job box and the little map in the top left corner */
let jobT=0,mmT=0,MMB=null,dcT=0;
function dlTarget(){const d=dl(),o=d.o;if(!o)return null;if(o.st==='wait')return{x:PIZZERIA[0],z:PIZZERIA[1]};const H=HOUSE(o.h);return{x:H.x+Math.sin(H.ry)*.8,z:H.z+Math.cos(H.ry)*.8};}
function jobHud(force){const el=$('job'),job=!!(PLAYING&&S&&(S.job==='delivery'||S.job==='designer'||S.job==='teacher'||S.job==='hair'||S.job==='photo')),town=!!(PLAYING&&S&&CUR&&CUR.id==='city'),on=job||town;   /* 🗺️ the corner map is for everyone in town, job or not (run 4, item 10: without a job the whole box was hidden, map included) */
  if(el.hidden===on)el.hidden=!on;const jt=$('jobTxt');if(jt.hidden!==!job)jt.hidden=!job;el.classList.toggle('nojob',!job);const mb=$('mmBtn'),al=job?'Your map. Tap to change the dot color':'Your map. Tap to open the big map';if(mb.getAttribute('aria-label')!==al)mb.setAttribute('aria-label',al);
  if(!on)return;if(!job){if(mb.hidden!==!town)mb.hidden=!town;jobHud.last=null;return;}
  if(S.job==='photo'){const d=pt(),o=d.o;let h;   /* 📸 the photographer (run 4, job 15) */
    if(!o)h=d.done>=PT_MAX?`🌟 All ${PT_MAX} photos done today!`:!isDaytime()?workAt():`📸 Waiting for a booking… <small>(${d.done}/${PT_MAX})</small>`;
    else if(PHO.on)h=PHO.group.every(m=>m.pose)?`📸 Frame everyone and <b>Snap</b>!`:`📸 Tap each person for a pose <small>(${PHO.group.filter(m=>m.pose).length}/${PHO.group.length})</small>`;
    else{const Sp=ptSpotOf(o),tg=jobTarget(),m=CUR.id==='city'&&tg?'\u00a0<span class="nw">· '+Math.round(Math.hypot(tg.x-P.x,tg.z-P.z))+' m</span>':'';h=`📸 → <b>${esc(Sp.n)}</b>${m} <small>${PT_KINDS[o.kind].i} ${esc(PT_KINDS[o.kind].n)} · ${d.done}/${PT_MAX}</small>`;}
    if(force||h!==jobHud.last){$('jobTxt').innerHTML=h;jobHud.last=h;}
    $('jobTxt').classList.remove('late','rare');const mh=CUR.id!=='city';if($('mmBtn').hidden!==mh)$('mmBtn').hidden=mh;return;}
  if(S.job==='hair'){const d=hs(),c=HS.cust;let h;   /* ✂️ the hairstylist (job 15) */
    if(CUR.id==='salon')h=c?(c.sat?`✂️ <b>${esc(c.name)}</b> is in your chair!`:c.leaving?`👋 Bye, ${esc(c.name)}!`:`✂️ ${esc(c.name)} is coming in…`):d.done>=HS_MAX?`🌟 All ${HS_MAX} customers done today!`:!isDaytime()?workAt():`✂️ Waiting for a customer… <small>(${d.done}/${HS_MAX})</small>`;
    else{const tg=jobTarget(),m=CUR.id==='city'&&tg?'\u00a0<span class="nw">· '+Math.round(Math.hypot(tg.x-P.x,tg.z-P.z))+' m</span>':'';h=`✂️ → <b>Hair Salon</b>${m} <small>(${d.done}/${HS_MAX})</small>`;}
    if(force||h!==jobHud.last){$('jobTxt').innerHTML=h;jobHud.last=h;}
    $('jobTxt').classList.remove('late','rare');const mh=CUR.id!=='city';if($('mmBtn').hidden!==mh)$('mmBtn').hidden=mh;return;}
  if(S.job==='teacher'){const d=tc(),o=d.o;let h;
    if(o){const S0=SUBJ[o.subj],id=CUR.id;
      if(id==='cl_'+o.subj)h=`📚 Sit at your desk to start the <b>${S0.n}</b> class!`;
      else if(id.startsWith('cl_'))h=`📚 Wrong room! Your class is <b>${S0.i} ${S0.n}</b>`;
      else if(id==='school')h=`📚 Find the <b>${S0.i} ${S0.n}</b> room!`;
      else{const tg=jobTarget(),m=CUR.id==='city'&&tg?'\u00a0<span class="nw">· '+Math.round(Math.hypot(tg.x-P.x,tg.z-P.z))+' m</span>':'';h=`📚 → <b>School</b> · ${S0.i} ${S0.n} class${m}`;}}
    else if(d.done>=TC_MAX)h=`🌟 All ${TC_MAX} classes done today!`;
    else if(!isDaytime())h=workAt();
    else h=`📚 Waiting for a message from school… <small>(${d.done}/${TC_MAX})</small>`;
    if(force||h!==jobHud.last){$('jobTxt').innerHTML=h;jobHud.last=h;}
    $('jobTxt').classList.remove('late','rare');const mh=CUR.id!=='city';if($('mmBtn').hidden!==mh)$('mmBtn').hidden=mh;return;}
  if(S.job==='designer'){const d=ds(),o=d.o;let h;
    if(o){const H=HOUSE(o.h),T=dsTheme(o);
      if(CUR.id==='client'){const R=DROOM[T.room];h=`${o.r2?`<small>Room ${(o.ri|0)+1}/2</small> `:''}${T.e} <b>${esc(T.n)}</b><div class="tm">🪑 ${dsItems().length} <small>(${R.cnt[0]}–${R.cnt[1]})</small></div>`;}
      else{const tg=jobTarget(),m=CUR.id==='city'&&tg?'\u00a0<span class="nw">· '+Math.round(Math.hypot(tg.x-P.x,tg.z-P.z))+' m</span>':'',inA=CUR.id.startsWith('apt');
        h=inA&&APT.b===o.h?`🎨 Find flat <b>${o.flat}</b>!`:inA?`🎨 Wrong building! → <b>${esc(H.n)}</b>`:`🎨 → <b>${esc(H.n)}</b>${o.flat?' · flat '+o.flat:''}${m}`;}}
    else if(d.done>=DS_MAX)h=`🌟 All ${DS_MAX} rooms done today!`;
    else if(!isDaytime())h=workAt();
    else h=`🎨 Waiting for a client… <small>(${d.done}/${DS_MAX})</small>`;
    if(force||h!==jobHud.last){$('jobTxt').innerHTML=h;jobHud.last=h;}
    $('jobTxt').classList.remove('late','rare');const mh=CUR.id!=='city';if($('mmBtn').hidden!==mh)$('mmBtn').hidden=mh;return;}
  const d=dl(),o=d.o,inPz=CUR.id==='pizza';let h;
  if(o&&o.st==='carry'){const H=HOUSE(o.h),late=o.left<=0,T=dlTarget(),m=CUR.id==='city'?'\u00a0<span class="nw">· '+Math.round(Math.hypot(T.x-P.x,T.z-P.z))+' m</span>':'';
    const inA=CUR.id.startsWith('apt'),where=!o.flat?`🍕 → <b>${esc(H.n)}</b>${m}`:inA&&APT.b===o.h?'🍕 Find the right door! <small class="nw">(flat number: 📱 Messages)</small>':inA?`🍕 Wrong building! → <b>${esc(H.n)}</b>`:`🍕 → <b>${esc(H.n)}</b>${m} <small class="nw">· flat number in 📱</small>`;
    h=`<div>${o.r?'<span class="rt">⭐ RARE</span> ':''}${where}</div><div class="tm">${late?'⏰ Late! Hurry!':'⏱️ '+mmss(o.left)+(o.lim>=1800?' <small>no rush 😌</small>':'')}</div>`;}
  else if(o)h=(o.r?'<span class="rt">⭐ RARE</span> ':'')+(inPz?'📩 Pick up the pizza from <b>Chef Blaze</b>!':'📩 New order! Go to the <b>Pizzeria</b>&nbsp;🍕'+(CUR.id==='beach'?' <small class="nw">· 🚌 bus first</small>':''));
  else if(dlAsk())h=`🌟 ${d.done} pizzas done! Talk to <b>Chef Blaze</b>`;
  else if(dlOff())h=`😎 Done for today! <small>(${d.done} 🍕)</small>`;
  else if(!pizzaOpen())h=(wdIdx()>4?'😎 ':'🕛 ')+PZ_TIME;
  else if(d.on)h=`🍕 Waiting for an order… <small>(${d.done}/${dlMax()})</small>`;
  else h='🍕 Go to the <b>Pizzeria</b> to start work'+(CUR.id==='beach'?' <small class="nw">· 🚌 bus first</small>':'');   /* (at the beach the way to work is the bus) */
  if(force||h!==jobHud.last){$('jobTxt').innerHTML=h;jobHud.last=h;}
  $('jobTxt').classList.toggle('late',!!(o&&o.st==='carry'&&o.left<=0));$('jobTxt').classList.toggle('rare',!!(o&&o.r));const mh=CUR.id!=='city';if($('mmBtn').hidden!==mh)$('mmBtn').hidden=mh;}
function mmBase(){if(MMB)return MMB;const c=document.createElement('canvas');c.width=c.height=704;try{drawMapBase(c.getContext('2d'),704,{labels:false});}catch(e){console.warn('map',e);}MMB=c;return c;}
const MM0=-86,MMW=172;/* the corner map shows the whole town: find the dot yourself! */
const MM={x:NaN,z:NaN,yaw:NaN,t:0};
function miniTick(dt){if($('job').hidden||$('mmBtn').hidden)return;MM.t+=dt;if(P.x===MM.x&&P.z===MM.z&&P.yaw===MM.yaw&&MM.t<.07)return;MM.t=0;MM.x=P.x;MM.z=P.z;MM.yaw=P.yaw;MM.n=(MM.n|0)+1;drawMini();}   /* 🧭 the arrow turns the very frame you turn; the pulsing dot still beats 14 times a second */
function drawMini(){const cv=$('mm');if(!cv||$('job').hidden||$('mmBtn').hidden)return;
  const want=Math.max(120,Math.round(cv.clientWidth*Math.min(2.5,devicePixelRatio||1)));if(want&&cv.width!==want)cv.width=cv.height=want;
  const x=cv.getContext('2d'),N=cv.width,k=N/MMW,B=mmBase(),M=v=>(clamp(v,MM0+2,MM0+MMW-2)-MM0)*k;
  x.fillStyle='#9fe486';x.fillRect(0,0,N,N);x.drawImage(B,(MM0+88)*4,(MM0+88)*4,MMW*4,MMW*4,0,0,N,N);
  const T=jobTarget(),col=dl().dot,edge=col==='#ffffff'?'#1d1622':'#ffffff';
  if(T){const tx=M(T.x),tz=M(T.z),pl=.5+.5*Math.sin(performance.now()/170);
    x.globalAlpha=.3+.3*(1-pl);x.beginPath();x.arc(tx,tz,N*(.05+.05*pl),0,TAU);x.fillStyle=col;x.fill();x.globalAlpha=1;
    x.beginPath();x.arc(tx,tz,N*.045,0,TAU);x.fillStyle=col;x.fill();x.lineWidth=N*.016;x.strokeStyle=edge;x.stroke();
    if(S.job==='delivery'&&dl().o&&dl().o.r){x.beginPath();x.arc(tx,tz,N*.072,0,TAU);x.lineWidth=N*.02;x.strokeStyle='#ffc400';x.stroke();}}
  const s=N*.05,mg=s*1.6+N*.04;x.save();x.translate(clamp(M(P.x),mg,N-mg),clamp(M(P.z),mg,N-mg));x.rotate(-P.yaw);   /* (run 4, stage 3: a whole arrow inside the map's rounded frame, also at the edge of town) */x.lineJoin='round';
  x.beginPath();x.moveTo(0,-s*1.5);x.lineTo(s,s);x.lineTo(0,s*.35);x.lineTo(-s,s);x.closePath();
  x.lineWidth=N*.032;x.strokeStyle='#3d2c5e';x.stroke();x.lineWidth=N*.014;x.strokeStyle='#ffffff';x.stroke();x.fillStyle='#ff4d8d';x.fill();x.restore();}
$('mmBtn').addEventListener('click',()=>{audioInit();if($('job').classList.contains('nojob'))openPhone('map');else openDot();});   /* without a job the corner map opens the big map (run 4, item 10) */
$('jobTxt').addEventListener('click',()=>{audioInit();openPhone('job');});
function openDot(){const d=dl();SFX.tap();
  openPanel(`<div class="hd"><h2>🎨 Map dot color</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><p class="note">Pick a color that's easy to see on your map!</p>
    <div class="dots">${DOT_COLS.map(([c,n])=>`<button class="dotb${d.dot===c?' on':''}" data-a="dot:${c}" aria-label="${n}"><i style="background:${c}"></i>${n}</button>`).join('')}</div>
    <canvas id="dotPrev" width="560" height="150" aria-label="How the dot looks on the map"></canvas>`);setTimeout(drawDotPrev,0);}
function drawDotPrev(){const cv=$('dotPrev');if(!cv)return;const x=cv.getContext('2d'),W=cv.width,H=cv.height,col=dl().dot,edge=col==='#ffffff'?'#1d1622':'#ffffff';
  [['#ff8f8f','🚒'],['#9fe486','🌳'],['#b9bcd6','🚗'],['#c7e6ff','📚']].forEach(([bg,ic],i)=>{const w=W/4;x.fillStyle=bg;x.fillRect(i*w,0,w,H);x.font=`${Math.round(H*.22)}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText(ic,i*w+w*.24,H*.24);
    x.beginPath();x.arc(i*w+w/2,H*.55,H*.16,0,TAU);x.fillStyle=col;x.fill();x.lineWidth=5;x.strokeStyle=edge;x.stroke();});}
ACT.dot=c=>{if(!DOT_COLS.some(v=>v[0]===c))return;dl().dot=c;SFX.pop();change();openDot();drawMini();};
ACT.dotpick=()=>openDot();

/* the pizza box you carry */
let HELD=null;
const HELD_AT=[.1,-.5,-.95];
function heldInit(){if(HELD)return;HELD=new THREE.Group();box(HELD,.48,.07,.48,'#ffffff',0,0,0,{ol:.008});box(HELD,.24,.006,.24,'#ff6b6b',0,.07,0,{ol:false});box(HELD,.06,.006,.2,'#ffd45c',.0,.074,0,{ol:false});
  HELD.traverse(o=>{o.castShadow=false;o.receiveShadow=false;});scene.add(camera);heldHome();}
function heldHome(){camera.add(HELD);HELD.position.set(...HELD_AT);HELD.rotation.set(.5,-.18,0);HELD.scale.setScalar(1);HELD.visible=false;}
function heldFit(){if(!HELD||HELD.parent!==camera)return;const k=clamp(camera.aspect/1.25,.5,1);if(Math.abs(HELD.scale.x-k)>.01){HELD.scale.setScalar(k);HELD.position.set(HELD_AT[0]*k,HELD_AT[1],HELD_AT[2]);}}
/* big words that pop up on the screen (always fit, even on a phone) */
/* 💬 one big text at a time: a new one waits until the last one was readable for 0.8 s, then takes its place (no more texts on top of each other) */
const POPQ={el:null,at:0,gen:0};
function popDrop(){POPQ.gen++;POPQ.at=0;if(POPQ.el){POPQ.el.remove();POPQ.el=null;}}   /* the big words on screen and any still waiting go (the view turns to a face) */
function popText(t,cls){const now=performance.now(),at=Math.max(now,POPQ.at),gen=POPQ.gen;POPQ.at=at+800;
  setTimeout(()=>{if(gen!==POPQ.gen)return;if(POPQ.el)POPQ.el.remove();const e=document.createElement('div');e.className='pop '+(cls||'');e.textContent=t;document.body.appendChild(e);POPQ.el=e;if(cls==='coin')popFit(e);popClear();setTimeout(()=>{e.remove();if(POPQ.el===e)POPQ.el=null;},1600);},at-now);}
function popFit(e){const W=innerWidth,w=e.offsetWidth,h=e.offsetHeight,K=[],add=(el,k)=>{const r=boxOf(el);if(r)K.push([r,k]);};   /* 🪙 the coin pop flies where no chip, button or card is (run 4, stage 3: it sat on the clock chip) */
  for(const id of['stats','topbtns','left','bChat','tasks','job','note'])add($(id),4);if(!$('panel').hidden){const r=cardBox();if(r)K.push([r,1]);}   /* (run 4 finish: and the message card: the designer's "+20" sat on the new client's words) */
  const st=boxOf($('stats')),tb=boxOf($('topbtns')),nt=boxOf($('note')),sx=st?st.right:0,ty=(tb?tb.bottom:hudLow())+6,s=spotFor(w,h,[[W/2,visH()*.2-h/2],[W/2,hudLow()+6],[(sx+W)/2,ty]].concat(nt?[[W/2,nt.bottom+6],[(sx+nt.left)/2,ty]]:[]),K);
  if(s){e.style.left=Math.round(s[0])+'px';e.style.top=Math.round(s[1]+h/2)+'px';}}
function popClear(){const e=POPQ.el,t=$('toast');if(!e||!t.classList.contains('show'))return;const a=t.offsetTop,b=a+t.offsetHeight,h=e.offsetHeight,y=e.offsetTop;   /* a big text never sits on a message: it slides below it */
  if(y+h/2>a&&y-h/2<b)e.style.top=Math.round(b+h*.65+8)+'px';}

/* knocking: the door opens, and it's the right house… or not! */
let CUT=null;
function deliverKnock(id){const H=HOUSE(id),o=dl().o;if(!H||!o||CUT||!WHO[id])return;startCut(H,o.h===id);}
function startCut(H,ok){const o=dl().o,rare=!!(ok&&o&&o.r),W=ok&&o?oWho(o):pickOther(H.id,o);closePanel();$('note').hidden=true;document.body.classList.add('cut');P.sit=null;
  const g=new THREE.Group();g.position.set(H.x,0,H.z);g.rotation.y=H.ry;scene.add(g);
  const tex=peekRoom(g,H);
  const hinge=new THREE.Group();hinge.position.set(-.61,0,.13);g.add(hinge);const pc=shade(H.dc,.12);
  box(hinge,1.22,2.12,.08,H.dc,.61,.15,0,{ol:.015});box(hinge,.8,.55,.02,pc,.61,1.45,.05,{ol:false});box(hinge,.8,.55,.02,pc,.61,.5,.05,{ol:false});sph(hinge,.07,'#ffd45c',1.05,1.1,.07,{ol:.012});
  if(H.flat){const pm=new THREE.Mesh(new THREE.PlaneGeometry(.46,.28),new THREE.MeshBasicMaterial({map:plateTex(String(H.flat),'#ffffff','#3d2c5e',512,312)}));pm.position.set(.61,1.98,.09);hinge.add(pm);}
  const p=makePerson(W.look);g.add(p.root);p.root.position.set(0,.15,-.6);p.root.traverse(o=>o.renderOrder=26);hinge.traverse(o=>o.renderOrder=26);
  if(rare){const tg=label('★ '+W.nm,.26,{bg:'#ffd45c',size:40});tg.position.y=2.02*(W.look.scale||1);tg.material.depthTest=false;tg.renderOrder=20;p.root.add(tg);}
  const sd=H.sd||(H.id==='ap1'?2.1:2.75),to={x:H.x+Math.sin(H.ry)*sd,z:H.z+Math.cos(H.ry)*sd,yaw:H.ry,pitch:-.2};
  CUT={H,ok,rare,W,t:0,g,hinge,p,tex,from:{x:P.x,z:P.z,yaw:P.yaw,pitch:P.pitch},to,stage:0,shake:0,t3:0};
  SFX.knock();popText('Knock knock! 🚪');}
/* 🚪 the room you see when a door opens. The house is a solid block, so the doorway
   "punches a hole" in the depth buffer and a little furnished room is drawn behind it. */
let HOLE_M=null;
const holeMat=()=>HOLE_M||(HOLE_M=new THREE.ShaderMaterial({vertexShader:'void main(){vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0);p.z=p.w*.99999;gl_Position=p;}',
  fragmentShader:'void main(){gl_FragColor=vec4(0.0);}',depthFunc:THREE.AlwaysDepth,colorWrite:false}));
function peekRoom(g,H){const z0=-(H.wallT||.04),W=3.4,Dp=3.0,Ht=2.6,zc=z0-Dp/2,back=z0-Dp,R=new THREE.Group(),tex=[];g.add(R);
  const hole=new THREE.Mesh(new THREE.PlaneGeometry(1.2,2.24),holeMat());hole.position.set(0,1.14,.115);hole.renderOrder=24;g.add(hole);
  const r=seeded([...String(H.flat||H.id)].reduce((a,c)=>a*31+c.charCodeAt(0),7)%100000),kind=Math.floor(r()*3),pk=a=>a[Math.floor(r()*a.length)];
  const fm=toon({map:floorTex(pk(['wood','wood','dark','pink','mint']))});fm.map.repeat.set(2,1.8);tex.push(fm.map);
  const wm=toon({color:shade(H.wc||'#fff0e2',.04)}),pl=(w,h,m,x,y,z,rx,ry)=>{const q=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);q.position.set(x,y,z);q.rotation.set(rx||0,ry||0,0);R.add(q);};
  pl(W,Dp,fm,0,.012,zc,-Math.PI/2);pl(W,Dp,new THREE.MeshBasicMaterial({color:'#fffaf2'}),0,Ht,zc,Math.PI/2);
  pl(W,Ht,wm,0,Ht/2,back);pl(Dp,Ht,wm,-W/2,Ht/2,zc,0,Math.PI/2);pl(Dp,Ht,wm,W/2,Ht/2,zc,0,-Math.PI/2);
  box(R,W,.12,.04,'#ffffff',0,0,back+.02,{ol:false});box(R,.04,.12,Dp,'#ffffff',-W/2+.02,0,zc,{ol:false});box(R,.04,.12,Dp,'#ffffff',W/2-.02,0,zc,{ol:false});
  cyl(R,.3,.22,.12,'#ffffff',0,Ht-.12,zc,{seg:14});sph(R,.16,null,0,Ht-.15,zc,{mat:GLOW,ol:false,ws:10,hs:8});
  const F=(t,c,x,z,ry,sc)=>{const m=buildFurn(t,c);m.position.set(x,0,z);m.rotation.y=ry||0;if(sc)m.scale.setScalar(sc);R.add(m);};
  const pic=(x,y,c)=>{box(R,.9,.66,.05,'#a8714a',x,y,back+.03,{ol:.012});box(R,.76,.52,.02,c,x,y+.07,back+.06,{ol:false});sph(R,.09,'#ffd45c',x+.2,y+.42,back+.075,{ol:false,s:[1,1,.2]});box(R,.76,.16,.02,'#5fd4b0',x,y+.07,back+.07,{ol:false});};
  const sofaC=pk(['#ff9ec4','#7cc8ff','#b79cff','#5fd4b0','#ffb36b']);
  if(kind===0){F('sofa',sofaC,0,back+.5,0,.95);F('lamp',null,-1.3,back+.35);F('plant',null,1.3,back+.35);F('rug',pk(['#ff9ec4','#ffd45c','#7cc8ff']),0,zc+.2);pic(0,1.35,pk(['#ffe0f0','#d9f0ff','#fff3c4']));}
  else if(kind===1){F('shelf',null,-.5,back+.25,0,.9);F('armchair',sofaC,1.05,zc-.2,-.6);F('tulips',null,-1.35,zc+.4);F('rugsq',pk(['#ffd45c','#b79cff','#ff9ec4']),.2,zc+.3,0,.8);F('clock',null,1.2,back+.2,0,.8);}
  else{F('fireplace',null,0,back+.3,0,.9);F('armchair',sofaC,-1.05,zc-.1,.55);F('plant',null,1.3,back+.35);F('rug',pk(['#ff8a6b','#7fdcb5','#ffd45c']),.1,zc+.3);F('teddy',null,1.0,zc+.6,-.4,.8);pic(-1.0,1.4,'#ffe0f0');}
  R.traverse(o=>{o.renderOrder=25;if(o.isMesh){o.castShadow=false;o.receiveShadow=false;}});return tex;}
/* people walking by hide while the door clip plays, so nobody blocks the view */
function cutHide(C){const hx=C.H.x+Math.sin(C.H.ry)*1.4,hz=C.H.z+Math.cos(C.H.ry)*1.4,near=(x,z)=>Math.hypot(x-hx,z-hz)<3.6;
  for(const w of[...WALKERS,...FRIEND_ACTORS,...PET_ACTORS])if(w.g&&w.g.visible&&near(w.x,w.z))w.g.visible=false;
  if(typeof MP!=='undefined'&&MP.peers)for(const a of MP.peers.values())if(a.av&&a.av.root.visible&&near(a.x,a.z))a.av.root.visible=false;}
function cutUpdate(dt){const C=CUT;if(!C)return;if(C.rev){revUpdate(dt);return;}if(C.show){psCut(dt);return;}if(C.claw){clawCut(dt);return;}if(C.tch){tcCut(dt);return;}C.t+=dt;cutHide(C);const t=C.t,sm=k=>k*k*(3-2*k);
  const k=sm(clamp(t/.75,0,1));P.x=lerp(C.from.x,C.to.x,k);P.z=lerp(C.from.z,C.to.z,k);P.yaw=angLerp(C.from.yaw,C.to.yaw,k);P.pitch=lerp(C.from.pitch,C.to.pitch,k);P.moving=false;
  if(C.stage===0&&t>1.05){C.stage=1;SFX.creak();}
  if(C.stage>=1&&C.stage<4){const op=sm(clamp((t-1.05)/.6,0,1));C.hinge.rotation.y=-1.7*op;
    const st=clamp((t-1.35)/.7,0,1);C.p.root.position.z=lerp(-.6,.32,sm(st));animPerson(C.p,dt,st>0&&st<1,.7);}
  if(C.stage===1&&t>2.1){C.stage=2;cutSay();}
  if(C.stage===2&&C.ok){const b=clamp((t-2.15)/.5,0,1);if(C.box&&b<1){C.box.position.lerpVectors(C.b0,C.b1,sm(b));C.box.position.y+=Math.sin(b*Math.PI)*.18;C.box.scale.setScalar(lerp(C.s0||1,1,sm(b)));}
    if(C.box&&b>=1&&!C.held){C.held=true;C.box.scale.setScalar(1);C.p.root.attach(C.box);}if(b>0){C.p.arms[0].rotation.x=C.p.arms[1].rotation.x=-1.25;}}
  if(C.stage===2&&!C.ok&&t>3.9){C.stage=4;C.t4=t;}
  if(C.stage===3){const u=t-C.t3;C.p.root.position.z=lerp(.32,-.6,sm(clamp((u-.25)/.5,0,1)));animPerson(C.p,dt,u>.25&&u<.75,.7);C.hinge.rotation.y=-1.7*(1-sm(clamp((u-.6)/.55,0,1)));
    if(u>1.3)endCut();}
  if(C.stage===4){const u=t-C.t4;C.p.root.position.z=lerp(.32,-.6,clamp(u/.16,0,1));C.hinge.rotation.y=-1.7*(1-clamp((u-.08)/.12,0,1));
    if(!C.slam&&u>.2){C.slam=true;SFX.slam();C.shake=.4;popText('SLAM! 💥','slam');}
    if(u>1.5){const fl=C.H.flat;endCut();toast(fl?'😅 Wrong door! Check the flat number in 📱 Messages':'😅 Wrong house! Look for the dot on your map 🗺️',3.4);}}}
function cutCam(dt){const C=CUT;if(!C||C.shake<=0)return;C.shake-=dt;const a=C.shake*.12;camera.position.x+=rand(-a,a);camera.position.y+=rand(-a,a)*.6;camera.rotation.z=rand(-a,a)*.25;}
function cutSay(){const C=CUT,o=dl().o,W=C.W;let line,extra='',btn='';
  if(C.ok){const late=o.left<=0,s0=dlStars(),op=(o.pay|0)||dlPay(s0)+(o.r?PZ_RARE:0);let pay,rv='';C.late=late;
    if(o.r){if(!late){pay=op;S.dlStars=Math.min(5,s0+1);line=pick([`Hmm… I don't really like pizza… *sniff*… but WOW, that was SO fast! I'm giving you five stars! ⭐⭐⭐⭐⭐`,`Pizza? I'm not a pizza person… but you were super quick! I'm impressed. Five stars! ⭐⭐⭐⭐⭐`,`Already here?! Lightning fast! Maybe pizza isn't so bad after all… Five stars! ⭐⭐⭐⭐⭐`]);}
      else{pay=Math.ceil((o.x?dlHalf(s0):dlPay(s0))/2);S.dlStars=Math.max(0,s0-1);line=pick([`Hmph! Too slow! And it's cold. See? This is why I don't like pizza. One star. ⭐ I'm telling EVERYONE!`,`Finally! I waited and waited… One star for you. Hmph! ⭐ I'm writing a bad review!`]);}
      const s1=dlStars();rv=!late?`<p class="earn rv">🌟 Great review! Pizza stars: ${starsH(s1)}<br><small>${s0>=5?'You already have all 5 stars! 👑':s1>=5?"You're a Pizza legend! 👑":'More coins for every pizza now! 🪙'}</small></p>`:`<p class="earn rv bad">😬 BAD review! ${s1<s0?'You lost a pizza star. ':''}Pizza stars: ${starsH(s1)}<br><small>People read reviews… fewer orders will come for a while.</small></p>`;}
    else{pay=late?Math.ceil(op/2):op;
      line=late?`There you are! It's a little cold… but thank you for my ${o.pz} pizza! 🙂`:pick([`Yay, my ${o.pz} pizza! 😋 Thank you so much!`,`Mmm, it smells sooo good! Thank you! 🍕`,`My pizza! You're the best! 💗`]);}
    S.coins+=pay;const d=dl();d.done++;d.o=null;d.wait=rand(8,14)*(1-.07*dlStars());
    if(o.r){d.fb=late?'bad':'good';if(late){d.wait=rand(32,42);d.quiet=2;}addMsg('pz','pz',late?`😬 ${W.nm} gave you a BAD review. Fewer people will order for a while…`:`🌟 ${W.nm} gave you a 5-star review! Great job!`,{q:1});}S.dlTotal=(S.dlTotal||0)+1;hardEvent('deliver',1);change();jobHud(true);SFX.coin();
    if(o.r&&late)setTimeout(()=>SFX.no(),250);else{setTimeout(()=>SFX.yay(),250);if(o.r)setTimeout(()=>SFX.rare(),700);}
    popText('+'+pay+' 🪙','coin');
    extra=`<p class="earn">You got <b>${pay} 🪙</b>${late?(o.r?'!':' (you were late)'):o.r?'! 💰 RARE bonus!':o.x?' for an extra pizza!':s0?` with your ${s0} ⭐!`:'!'}</p>${rv}`;btn=`<div class="row"><button class="btn mint" data-a="cutbye">👋 Bye!</button></div>`;
    if(HELD){HELD.visible=true;HELD.traverse(o=>o.renderOrder=26);C.box=HELD;C.s0=HELD.scale.x;scene.attach(HELD);C.b0=HELD.position.clone();C.b1=C.g.localToWorld(new THREE.Vector3(0,1.02,.68));}}
  else{line=pick(["What are you doing here?! I didn't order any pizza! 😠","Huh? What are you doing here? I didn't order a pizza! 😤"]);
    for(const s of[-1,1]){const br=new THREE.Mesh(new THREE.BoxGeometry(.13,.03,.02),mat('#1d1622'));br.position.set(s*.11,.32,.226);br.rotation.z=s*.38;C.p.head.add(br);}
    {const q=C.g.localToWorld(new THREE.Vector3(.36,1.72,.65));floatText('💢',q.x,q.y,q.z,{h:.4,life:1.6});}SFX.no();}
  openPanel(`<div class="who" style="--c:${W.look.top}">${C.rare?'⭐ ':''}${esc(W.nm)}</div><p class="line">${esc(line)}</p>${extra}${btn}`,{bottom:true,lock:true});}
ACT.cutbye=()=>{const C=CUT;if(!C||C.stage!==2)return;closePanel();C.stage=3;C.t3=C.t;C.p.wave=1.2;};
function endCut(){const C=CUT;if(!C)return;if(C.rev){revEnd();return;}CUT=null;if(UI.open)closePanel();document.body.classList.remove('cut');
  scene.remove(C.g);C.g.traverse(o=>{if(o.geometry)o.geometry.dispose();});for(const t of C.tex||[])t.dispose();if(HELD){HELD.traverse(o=>o.renderOrder=0);heldHome();}P.pitch=0;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);
  if(C.ok){const bad=!!(C.rare&&C.late);setTimeout(()=>dlAfter(bad),400);}}

