'use strict';
/* ================= panels ================= */
function openPanel(html,o={}){const p=$('panel'),fresh=p.hidden;p.classList.toggle('bottom',!!o.bottom);p.classList.toggle('side',!!o.side);$('card').className='card'+(o.cls?' '+o.cls:'');$('card').innerHTML=html;if(!KB.on){$('card').style.maxHeight='';delete $('card').dataset.mh;}p.hidden=false;if(fresh)$('card').scrollTop=0;   /* a card opened anew starts at its top (it used to keep the last card's scroll) */UI.open=true;UI.onClose=o.onClose||null;UI.lock=!!o.lock;
  IN.joy.id=null;IN.joy.x=IN.joy.y=0;IN.look.id=null;$('joy').classList.remove('on');$('knob').style.transform='';$('actWrap').hidden=true;TQ.card=performance.now();TQ.cev=toastEv();try{toastFit(1);cardMore();}catch(e){}setTimeout(()=>{try{cardMore();}catch(e){}},350);}
/* ⬇️ a card taller than the screen shows a little bouncing arrow at its bottom until you scroll to the end (the clothes maker: a soft fade over its "That's me!" bar).
   The arrow sits on the card's edge, half outside (the right edge, or the bottom edge on a narrow screen), next to the buttons and words instead
   of on them (it used to cover a button's corner) */
/* 🃏 a card at the bottom of a short screen that reaches up into the top row or over the jump and run buttons: those pieces wait out of sight under it,
   as under a big card (run 4 finish: the bigger-house card ran under the round top buttons; the jump button poked out beside a card) */
function cardOver(){const pn=$('panel'),b=document.body,on=!pn.hidden&&pn.classList.contains('bottom')&&innerHeight<=500&&!b.classList.contains('shoot')&&!b.classList.contains('dancing'),r=on?cardBox():null;
  for(const id of['stats','topbtns','bChat','busTip','moveBtns','joy','jobTxt']){const e=$(id);if(!e)continue;let h=false;if(r){const q=e.getBoundingClientRect();h=q.width>1&&q.left<r.right+4&&q.right>r.left-4&&q.top<r.bottom+4&&q.bottom>r.top-4;}if(e.classList.contains('underCard')!==h)e.classList.toggle('underCard',h);}}
function cardMore(){try{cardOver();}catch(e){}const c=$('card');if($('panel').hidden)return;{const ps=c.querySelector('.ph-screen');if(ps)ps.classList.toggle('more',ps.scrollHeight-ps.clientHeight-ps.scrollTop>4);}   /* the phone's screen fades at its foot only while there is more below (run 4 finish: with nothing to scroll the fade let the dark phone through, a muddy band) */const m=!c.classList.contains('phonecard')&&/auto|scroll/.test(getComputedStyle(c).overflowY)&&c.scrollHeight-c.clientHeight-c.scrollTop>30,f=c.querySelector('.crsave');
  if(f){f.classList.toggle('more',m);c.classList.remove('more');}else c.classList.toggle('more',m);
  let a=$('moreHint');if(!a){a=document.createElement('div');a.id='moreHint';a.setAttribute('aria-hidden','true');a.textContent='⬇️';$('panel').appendChild(a);}
  let b=$('moreBand');if(!b){b=document.createElement('div');b.id='moreBand';b.setAttribute('aria-hidden','true');$('panel').appendChild(b);}b.hidden=a.hidden=!m||!!f;if(a.hidden)return;
  const r=c.getBoundingClientRect(),p=$('panel').getBoundingClientRect(),R=parseFloat(getComputedStyle(c).borderBottomLeftRadius)||0;
  b.style.left=Math.round(r.left+3-p.left)+'px';b.style.width=Math.round(r.width-6)+'px';b.style.top=Math.round(r.bottom-3-b.offsetHeight-p.top)+'px';b.style.borderRadius=`0 0 ${Math.max(0,R-3)}px ${Math.max(0,R-3)}px`;
  a.style.left=Math.round((r.left+r.right)/2-23-p.left)+'px';a.style.top=Math.round(r.bottom-54-p.top)+'px';}   /* run 4, stage 3: the ⬇️ sits inside the card, on a soft fade over its bottom (beside or under the card critics read it as a loose button, and a row cut by the card's edge with no fade as a mistake); it never takes a tap */
$('card').addEventListener('scroll',cardMore,{passive:true});$('card').addEventListener('scroll',e=>{if(e.target!==$('card'))try{cardMore();}catch(_){}},{passive:true,capture:true});if(window.ResizeObserver)new ResizeObserver(()=>{try{cardMore();}catch(e){}}).observe($('card'));
function closePanel(){const p=$('panel');if(p.hidden)return;p.hidden=true;try{cardOver();}catch(e){}UI.open=false;UI.lock=false;const f=UI.onClose;UI.onClose=null;if(f)f();try{toastPlace();}catch(e){}}   /* (a message placed round the card moves to its own spot when the card goes: run 4, stage 3) */
$('panel').addEventListener('pointerdown',e=>{if(e.target===$('panel')&&!UI.lock)closePanel();});
/* ⌨️ typing on an iPad or phone: the keyboard covers the bottom of the screen (iOS only shrinks the "visual viewport"). While a text box in a card
   has focus, the card area fits the part of the screen above the keyboard and the text box scrolls into view; done typing = back to normal */
const KB={on:false,vv:null,iv:0};
function kbTyping(){const el=document.activeElement,p=$('panel');return!!(el&&el.matches&&el.matches('input,textarea')&&!p.hidden&&p.contains(el));}
function kbFit(){const vv=window.visualViewport,p=$('panel'),H=document.documentElement.clientHeight||innerHeight;
  if(vv&&KB.vv!==vv){if(KB.vv){KB.vv.removeEventListener('resize',kbFit);KB.vv.removeEventListener('scroll',kbFit);}KB.vv=vv;vv.addEventListener('resize',kbFit);vv.addEventListener('scroll',kbFit);}
  if(!(vv&&kbTyping()&&(vv.height<H-40||vv.offsetTop>1))){if(KB.on){KB.on=false;clearInterval(KB.iv);p.style.top=p.style.bottom=p.style.height=p.style.paddingTop=p.style.paddingBottom=$('card').style.maxHeight='';if(scrollX||scrollY)scrollTo(0,0);}return;}
  const t=Math.max(0,Math.round(vv.offsetTop)),h=Math.round(Math.min(vv.height,H-t));
  if(!KB.on){KB.on=true;KB.iv=setInterval(()=>{if(!kbTyping())kbFit();},400);}
  if(p.style.top!==t+'px'||p.style.height!==h+'px'){p.style.top=t+'px';p.style.height=h+'px';p.style.bottom='auto';p.style.paddingTop=p.style.paddingBottom='6px';$('card').style.maxHeight=(h-12)+'px';}
  const el=document.activeElement,c=el.closest('.card');if(c){const r=el.getBoundingClientRect(),cr=c.getBoundingClientRect(),f=c.querySelector('.crsave'),B=Math.min(cr.bottom,f&&f.offsetParent?f.getBoundingClientRect().top:1e9);   /* (not under the creator's sticky "That's me!" bar) */
    let d=r.bottom>B-8?r.bottom-B+8:0;if(r.top-d<cr.top+8)d=r.top-cr.top-8;if(Math.abs(d)>1)c.scrollTop+=d;}}   /* its top always shows */
document.addEventListener('focusin',()=>setTimeout(kbFit,0));document.addEventListener('focusout',()=>setTimeout(kbFit,60));kbFit();
/* 👀 a line that just changed in a card (an answer under a text box) scrolls into view: above the keyboard, and on a short screen too,
   without pushing the top of the text box (keep) out of sight */
function cardShow(el,keep){const c=$('card');if(!el||$('panel').hidden||!c.contains(el))return;const cr=c.getBoundingClientRect(),r=el.getBoundingClientRect();
  let d=r.bottom-(Math.min(cr.bottom,visH())-8);if(d<=1)return;if(keep)d=Math.min(d,keep.getBoundingClientRect().top-Math.max(cr.top,0)-8);if(d>1)c.scrollTop+=d;}
const ACT={};
const quietCard=()=>!!(typeof FR!=='undefined'&&FR&&quietFriend(FR))||!!(typeof PH!=='undefined'&&PH.app==='msg'&&PH.chat==='ro');   /* 🤫 a card of Rosie's: even the button tap is silent */
$('card').addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||b.disabled)return;const [k,...r]=b.dataset.a.split(':');if(k!=='buy'&&!quietCard())SFX.tap();if(ACT[k])ACT[k](r.join(':'),b);});
ACT.close=()=>closePanel();
ACT.tnGo=()=>{closePanel();tnStart();};
ACT.fbTeam=()=>fbStart('team');ACT.fbDuel=()=>fbStart('duel');ACT.fbJuice=()=>fbJuice();ACT.fbAgain=()=>fbStart(FB.lastM);
ACT.cloth=k=>{const c=CLOTHES[k];if(!c)return;SFX.tap();
  if(c.hat||c.gl){CLO.sel=k;CLO.col=c.cols.find(x=>!variants(k).some(v=>v.c===x))||c.cols[0];openClothes();return;}
  if(owns(k)){toast(c.i+' You have these already! Try them on at the 🪞 mirror.',3);return;}if(c.gift){toast('🐰 This one is a prize: find all 25 Easter eggs!',3);return;}if(c.oct&&HOL.cur!=='halloween'){toast('🎃 Costumes come back in October!',3);return;}if(shutBuy('clothes'))return;
  if(S.coins<c.p){SFX.no();toast('Not enough coins yet! 🪙');return;}S.coins-=c.p;S.wardrobe[k]=1;SFX.coin();SFX.yay();toast(c.i+' '+c.n+': it\'s yours! Try it on at the mirror. 🪞',3.2);qEvent('clothes');qEvent('buy:'+k);change();openClothes();};
ACT.clocol=c=>{CLO.col=c;openClothes();};
ACT.cloback=()=>{CLO.sel=null;openClothes();};
ACT.clobuy=()=>{const k=CLO.sel,C=CLOTHES[k];if(!C||shutBuy('clothes'))return;if(S.coins<C.p){SFX.no();toast('Not enough coins yet! 🪙');return;}S.coins-=C.p;S.outfits.push({k,c:CLO.col});SFX.coin();SFX.yay();
  toast(C.i+' New '+C.n.toLowerCase()+'! Try it on at the 🪞 mirror.',3.2);qEvent('clothes');qEvent('buy:'+k);CLO.sel=null;change();openClothes();};
ACT.plant=k=>plantSeed(k);
const hearts=n=>'♥'.repeat(n)+'<span class="off">'+'♥'.repeat(5-n)+'</span>';
const fill=(s,f)=>String(s).replace(/\{name\}/g,S.name||'friend').replace(/\{food\}/g,f||'');

/* friends */
let FR=null;
const quietFriend=f=>!!f&&f.d.id==='rosie';   /* 🤫 Rosie makes no sound at all (night 3, job 2): no chat blip, no ding for her messages */
function openFriend(f,line){FR=f;if(f.mode!=='talk'){f.prev=f.mode;f.mode='talk';}f.face=Math.atan2(P.x-f.x,P.z-f.z);f.g.rotation.y=f.face;f.p.wave=1;if(!quietFriend(f))SFX.talk();const st=frSt(f.d.id);
  if(!line){if(!st.met){st.met=1;line=f.d.hello;addPts(f,3);}else line=bdRosie(f)||f.d.greet||pick(["Hi {name}! Nice to see you!","Hey {name}! What are you up to?","Oh, {name}! Hi hi!"]);}
  renderFriend(line);}
function renderFriend(line,sub){const f=FR,st=frSt(f.d.id),h=heartsOf(f.d.id),fol=f.prev==='follow';
  openPanel(`<div class="who" style="--c:${f.d.look.top}">${esc(f.d.name)}</div><div class="hearts" aria-label="${h} of 5 hearts">${hearts(h)}</div>
    <p class="line">${esc(fill(line))}</p>${sub||`<div class="row"><button class="btn mint" data-a="fchat">💬 Chat</button><button class="btn butter" data-a="fgift">🎁 Give a present</button>
    ${f.d.id==='rosie'?'<button class="btn lilac" data-a="fjob">💼 Jobs</button>':''}${fol?'<button class="btn sky" data-a="fstop">👋 See you later</button>':`<button class="btn sky" data-a="fhang" ${h<1?'disabled':''}>🤝 Hang out${h<1?' (needs 1 ♥)':''}</button>`}
    <button class="btn white" data-a="close">Bye!</button></div>`}`,{bottom:true,onClose:()=>{if(f.mode==='talk')f.mode=f.prev==='follow'?'follow':'walk';FR=null;}});}
ACT.fchat=()=>{const f=FR,st=frSt(f.d.id);if(!quietFriend(f))SFX.talk();qEvent('chat',1,f.d.id);qEvent('chat:'+f.d.id);const pk=a=>{const b=Math.random()<.75&&bdRosie(f);if(b&&b!==f.d._last)return f.d._last=b;const L=a.length>1?a.filter(x=>x!==f.d._last):a,r=pick(L.length?L:a);f.d._last=r;return r;};if(st.chat!==S.day){st.chat=S.day;addPts(f,4);addXP('friends',4);renderFriend(pk(f.d.lines));}else renderFriend(pk(f.d.only?f.d.lines:f.d.lines.concat(["We talked so much today! Let's hang out.","Hehe, you're fun to talk to!"])));};
ACT.fgift=()=>{const foods=Object.keys(S.bag).filter(k=>FOODS[k]&&S.bag[k]>0);
  if(!foods.length){renderFriend("You don't have any food in your bag. The market has yummy stuff!");return;}
  renderFriend(FR.d.giftAsk||'Ooh, a present? For me?',`<div class="grid" style="margin-top:12px">${foods.map(k=>`<button class="it" data-a="give:${k}"><span class="em">${FOODS[k].i}</span><span>${FOODS[k].n}</span><span class="have">×${S.bag[k]}</span></button>`).join('')}</div><div class="row"><button class="btn white" data-a="fback">Back</button></div>`);};
ACT.fback=()=>renderFriend('So, what do you want to do?');
ACT.give=k=>{const f=FR,st=frSt(f.d.id);if(st.gift===S.day){renderFriend("You're so sweet! But I'm full. Maybe tomorrow? 😊");return;}
  S.bag[k]--;st.gift=S.day;if(!quietFriend(f))SFX.pet();qEvent('gift');qEvent('gift:'+f.d.id);addXP('friends',5);const fav=f.d.fav===k;addPts(f,fav?10:5);floatText('💗',f.x,2.1,f.z,{h:.6});
  renderFriend(fav?`Wow, ${FOODS[k].n.toLowerCase()}! That's my FAVORITE! Thank you, {name}!`:`Ooh, ${FOODS[k].n.toLowerCase()}! Thank you, {name}!`);change();};
ACT.fhang=()=>{const f=FR;f.prev='follow';if(!quietFriend(f))SFX.yay();qEvent('hang');qEvent('hang:'+f.d.id);addXP('friends',3);renderFriend("Yay! Let's go! I'll follow you. Show me your house!");};
ACT.fstop=()=>{const f=FR;f.prev='walk';if(f.loc!=='city'){f.loc='city';f.node=f.d.home;f.x=WP[f.node][0];f.z=WP[f.node][1];}renderFriend('Okay! See you later, {name}! 👋');};

/* pets */
let PT=null;
function openPet(p){PT=p;p.face=Math.atan2(P.x-p.x,P.z-p.z);p.g.rotation.y=p.face;SFX[PET_TYPES[petKind(p.d)].snd]();renderPet();petLook(p);}
/* 👀 a pet card opened while the pet is out of sight (or behind the card) turns the camera to the pet; the old up/down look comes back after */
function petLook(p){const c=boxOf($('card'));if(!c||P.sit||P.ride||CUT)return;const v=new THREE.Vector3(p.x,.35,p.z).project(camera),W=innerWidth,H=innerHeight,sx=(v.x+1)/2*W,sy=(1-v.y)/2*H;
  if(v.z<1&&sx>W*.1&&sx<W*.9&&sy>H*.12&&sy<c.top-20)return;
  const dx=p.x-P.x,dz=p.z-P.z,d=Math.hypot(dx,dz);if(d<.25)return;const f=Math.tan(camera.fov*Math.PI/360),yT=Math.max(H*.22,c.top*.55),a=Math.atan((1-2*yT/H)*f);
  p.lk0=P.pitch;P.yaw=Math.atan2(-dx,-dz);P.pitch=clamp(Math.atan2(.35-1.5,d)-a,-1.2,.3);}
function petBye(){if(PT&&PT.lk0!=null){if(!CUT&&!P.sit)P.pitch=PT.lk0;PT.lk0=null;}PT=null;}
function renderPet(msg){const p=PT,d=p.d,h=Math.round(d.happy/20);
  openPanel(`<div class="who" style="--c:${d.col}">${PET_TYPES[petKind(d)].icon} ${esc(d.name)}</div><div class="hearts">${hearts(clamp(h,0,5))}</div>
    <p class="line">${esc(msg||(d.happy>70?d.name+' is super happy!':d.happy>35?d.name+' wags happily at you.':d.name+' looks a little lonely. Some love would help!'))}</p>
    <div class="row"><button class="btn mint" data-a="ppet">💗 Pet</button>${(()=>{const n=(PET_FOOD[petKind(d)]||PET_FOOD[d.type]).reduce((s,k)=>s+(S.bag[k]||0),0);return`<button class="btn butter" data-a="pfeed">${PET_ITEMS[(PET_FOOD[petKind(d)]||PET_FOOD[d.type])[0]].i} Feed${n?' ('+n+')':''}</button>`;})()}
    <button class="btn sky" data-a="pplay">${PET_ITEMS[(PET_TOY[petKind(d)]||PET_TOY[d.type])].i} Play</button><button class="btn coral" data-a="pdress">🎀 Dress up</button><button class="btn lilac" data-a="pstay">${d.stay?'🐾 Follow me':'🏠 Stay here'}</button>${S.pets.length>PET_FOLLOW?'<button class="btn sky" data-a="mypets">🐾 My pets</button>':''}<button class="btn white" data-a="close">Bye!</button></div>`,{bottom:true,onClose:petBye});}
ACT.ppet=()=>{const d=PT.d;d.happy=Math.min(100,d.happy+10);qEvent('pet');if(cool('pet'+d.id,3))addXP('pets',2);SFX.pet();floatText('💗',PT.x,1.1,PT.z,{h:.55});renderPet(pick([d.name+' loves that!',d.name+' wiggles happily!','So soft!']));change();};
ACT.pfeed=()=>{const d=PT.d,list=(PET_FOOD[petKind(d)]||PET_FOOD[d.type]),k=list.find(f=>S.bag[f]>0);
  if(!k){SFX.no();renderPet('No food for '+d.name+' in your bag. The pet shop sells '+list.map(f=>PET_ITEMS[f].i+' '+PET_ITEMS[f].n.toLowerCase()).join(' and ')+'!');return;}
  const fav=k===list[0]&&list.length>1;S.bag[k]--;d.happy=Math.min(100,d.happy+(fav?40:30));qEvent('pet');qEvent('feed');addXP('pets',3);SFX.eat();floatText(fav?PET_ITEMS[k].i:'😋',PT.x,1.1,PT.z,{h:.55});
  renderPet(fav?d.name+' LOVES '+PET_ITEMS[k].n.toLowerCase()+'! Yum yum!':'Munch munch! '+d.name+' loved it!');change();};
ACT.pplay=()=>{const d=PT.d,fav=(PET_TOY[petKind(d)]||PET_TOY[d.type]),toy=S.bag[fav]?fav:['ball','yarn','squeaky','frisbee','mouse'].find(k=>S.bag[k]);if(!toy){SFX.no();renderPet('You need a toy! The pet shop has '+PET_ITEMS[fav].i+' '+PET_ITEMS[fav].n.toLowerCase()+'s.');return;}
  if(toy===fav){d.happy=Math.min(100,d.happy+30);SFX[PET_TYPES[petKind(d)].snd]();floatText(PET_ITEMS[toy].i,PT.x,1.2,PT.z,{h:.55});qEvent('pet');qEvent('play');addXP('pets',3);renderPet(d.name+' LOVES the '+PET_ITEMS[toy].n.toLowerCase()+'! So much fun!');change();return;}
  d.happy=Math.min(100,d.happy+20);qEvent('pet');qEvent('play');addXP('pets',3);SFX[PET_TYPES[petKind(d)].snd]();floatText(PET_ITEMS[toy].i,PT.x,1.2,PT.z,{h:.55});renderPet(d.name+' plays with the '+PET_ITEMS[toy].n.toLowerCase()+'!');change();};
function starRow(n){n=clamp(Math.round(n),0,5);return'⭐'.repeat(n)+'<span class="st0">'+'★'.repeat(5-n)+'</span>';}
function petStyle(d){const o=petOutfit(d);return 1+PSLOTS.filter(([sl])=>o[sl]).length;}
ACT.pdress=msg=>{const p=PT;if(!p)return;const d=p.d,o=petOutfit(d),own=Object.keys(ACCS).filter(k=>S.bag[k]>0),st=petStyle(d);
  const slots=PSLOTS.map(([sl,ic,nm])=>o[sl]?`<button class="slot on" data-a="poff:${sl}" aria-label="Take off the ${ACCS[o[sl]].n}"><b>${nm}</b><span class="si">${ACCS[o[sl]].i}</span><i>✕ off</i></button>`:`<div class="slot"><b>${nm}</b><span class="si">${ic}</span><i>empty</i></div>`).join('');
  openPanel(`<div class="who" style="--c:${d.col}">${PET_TYPES[petKind(d)].icon} ${esc(d.name)}</div>
    <p class="line">${typeof msg==='string'&&msg?esc(msg):st>=5?esc(d.name)+' looks AMAZING! ✨':'What should '+esc(d.name)+' wear? Fill all 4 spots!'}</p>
    <div class="slots">${slots}</div><p class="pstyle">Style ${starRow(st)}</p>
    ${own.length?`<div class="row">${own.map(k=>`<button class="btn lilac" data-a="pwear:${k}">${ACCS[k].i} ${ACCS[k].n}${S.bag[k]>1?' ×'+S.bag[k]:''}</button>`).join('')}</div>`:'<p class="note">The 🐾 Pet Shop sells hats, crowns, bow ties, glasses, capes and wings!</p>'}
    <div class="row"><button class="btn white" data-a="pback">Back</button></div>`,{bottom:true,onClose:petBye});};
ACT.pwear=k=>{const p=PT;if(!p||!S.bag[k]||!ACCS[k])return;const d=p.d,o=petOutfit(d),sl=ACCS[k].s;if(o[sl])S.bag[o[sl]]=(S.bag[o[sl]]||0)+1;S.bag[k]--;o[sl]=k;rebuildPet(p);SFX.pet();floatText('✨',p.x,1.1,p.z,{h:.55});qEvent('dress');
  change();ACT.pdress(d.name+' looks so cute in the '+ACCS[k].n.toLowerCase()+'!');};
ACT.poff=sl=>{const p=PT;if(!p)return;const d=p.d,o=petOutfit(d);const list=sl?[sl]:PSLOTS.map(x=>x[0]);let any=false;for(const x of list)if(o[x]){S.bag[o[x]]=(S.bag[o[x]]||0)+1;delete o[x];any=true;}
  if(!any)return;rebuildPet(p);SFX.pop();change();ACT.pdress('Taken off!');};
ACT.pback=()=>renderPet();
ACT.pstay=()=>{const p=PT,d=p.d;if(d.stay&&petFollowers()>=PET_FOLLOW){SFX.no();renderPet(`${PET_FOLLOW} pets follow you already! Send one home in 🐾 My pets, then ${d.name} can come along.`);return;}d.stay=!d.stay;delete d.home;p.far=0;if(d.stay){[d.sx,d.sz]=toSave(p.loc,p.x,p.z);renderPet(d.name+' will stay here and wait for you.');}else renderPet(d.name+' will follow you!');change();};

/* adopting */
let AD=null;const ADOPT_COST=200;
/* 🪙 not enough coins? jobs pay the most, quests a little extra */
const earnTip=()=>S&&S.job?'Go to work and do your 📱 quests to earn more! 💼':'Get a job from Rosie to earn coins! 💼';
function openAdopt(type,col){if(S.pets.length>=PET_MAX){toast(`You have ${PET_MAX} pets already. That\'s a full house! 🏠`);return;}
  const T=PET_TYPES[type];AD={type,col,name:pick(T.names)};SFX[T.snd]();renderAdopt();}
function renderAdopt(){const T=PET_TYPES[AD.type];
  openPanel(`<div class="hd"><h2>${T.icon} Adopt ${anA(T.name)}</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>${shutNote('pets')}
    <p class="note">Pick a color</p><div class="swrow">${T.cols.map(c=>`<button class="sw ${c===AD.col?'on':''}" style="background:${c}" data-a="acol:${c}" aria-label="Color"></button>`).join('')}</div>
    <p class="note">Give your ${T.name} a name</p><input class="inp" id="petName" maxlength="14" value="${esc(AD.name)}" autocomplete="off">
    <div class="row"><button class="btn mint" data-a="adopt" ${S.coins<ADOPT_COST?'disabled':''}>💗 Adopt for ${ADOPT_COST} 🪙</button></div>${S.coins<ADOPT_COST?`<p class="note">You need ${ADOPT_COST} 🪙. ${earnTip()}</p>`:''}`);}
ACT.acol=c=>{AD.name=($('petName').value||AD.name);AD.col=c;renderAdopt();};
/* 🐾 a spot in front of you, a little to the side, with room for a pet (not inside a pen or a shelf) */
function petSpot(){for(const d of [1.7,1.4,1.1])for(const a of [.35,-.35,.7,-.7]){const x=P.x-Math.sin(P.yaw+a)*d,z=P.z-Math.cos(P.yaw+a)*d,q=collideXZ(x,z,.3,CUR);if(Math.hypot(q[0]-x,q[1]-z)<.02)return q;}
  for(const a of [1.2,-1.2,1.6,-1.6,2.2,-2.2]){const x=P.x-Math.sin(P.yaw+a)*1.2,z=P.z-Math.cos(P.yaw+a)*1.2,q=collideXZ(x,z,.3,CUR);if(Math.hypot(q[0]-x,q[1]-z)<.02)return q;}   /* no room in front (right at a pen): beside you */
  return collideXZ(P.x+Math.sin(P.yaw)*1.2,P.z+Math.cos(P.yaw)*1.2,.3,CUR);}
ACT.adopt=()=>{if(shutBuy('pets')||S.pets.length>=PET_MAX)return;const nm=($('petName').value||'').trim().slice(0,14)||AD.name;if(S.coins<ADOPT_COST)return;S.coins-=ADOPT_COST;
  const T=PET_TYPES[AD.type],[nx,nz]=petSpot(),full=petFollowers()>=PET_FOLLOW,d={id:uid(),type:T.base||AD.type,col:AD.col,name:nm,happy:80,stay:false,loc:CUR.id,x:nx,z:nz,sx:0,sz:0};if(T.base)d.kind=AD.type;S.pets.push(d);const pa=addPetActor(d);   /* 🐾 saved as the old kind + the real kind */
  if(full)petGoHome(pa);   /* 🏡 3 pets follow you already: the new one waits at home in your yard */
  closePanel();SFX.yay();toast(full?`Welcome home, ${nm}! ${PET_TYPES[AD.type].icon} ${PET_FOLLOW} pets follow you already, so ${nm} waits for you at home in your yard 🏡`:`Welcome home, ${nm}! ${PET_TYPES[AD.type].icon} Look at ${nm} to play.`,4.6);doneTask('pet');change();};

/* 🐾 up to 10 pets (pet update 1). At most 3 follow you; the others wait at home in your yard (stay + home, at a spot in the yard; old versions
   see them as pets told to stay). 🐾 My pets picks who follows. Ms. Paws at the Pet Shop takes a pet you give away: it finds a new family and frees a spot */
const PET_MAX=10,PET_FOLLOW=3;
const PET_HOME=[[-22.4,-8.4],[-18.4,-8.5],[-17.0,-8.9],[-15.6,-8.4],[-13.0,-8.6],[-21.6,-9.3],[-16.3,-9.4],[-12.4,-8.8],[-19.2,-8.0]];   /* spots in your front yard, clear of the flower beds and the bench (the old town-yard frame, like every yard spot in a save) */
const petFollowers=()=>S.pets.filter(d=>!d.stay).length;
const petAtHome=d=>!!d.stay&&!!d.home&&d.loc==='city'&&inYardR(d.sx,d.sz);
function petGoHome(p){const d=p.d,taken=S.pets.filter(q=>q!==d&&petAtHome(q)),s=PET_HOME.find(([x,z])=>!taken.some(q=>Math.hypot(q.sx-x,q.sz-z)<1))||PET_HOME[taken.length%PET_HOME.length];
  d.stay=true;d.home=1;d.loc=p.loc='city';[d.sx,d.sz]=s;[d.x,d.z]=s;[p.x,p.z]=petFrom(d,s[0],s[1]);p.tx=p.x;p.tz=p.z;p.wt=rand(1,3);p.far=0;}
/* an old version can let more than 3 follow (its 🐾 Bring my pets calls them all): the first 3 keep following, the others go home */
function petsCap(){let n=0;for(const p of PET_ACTORS)if(!p.d.stay&&++n>PET_FOLLOW)petGoHome(p);}
let PETPICS=new Map(),GV=null;
function petPic(d){const k=[d.id,petKind(d),d.col,JSON.stringify(petOutfit(d))].join('|');if(PETPICS.has(k))return PETPICS.get(k);let url='';
  try{const sc=shotScene(),m=makePet(petKind(d),d.col);addOutfit(m,d);m.root.rotation.y=.55;sc.add(m.root);m.root.updateMatrixWorld(true);
    const b=new THREE.Box3().setFromObject(m.root),c=b.getCenter(new THREE.Vector3()),z=b.getSize(new THREE.Vector3()),r=Math.max(z.x,z.y,z.z);
    const cam=new THREE.PerspectiveCamera(30,1,.05,30);cam.position.set(c.x,c.y+r*.45,c.z+r*2.2);cam.lookAt(c.x,c.y,c.z);url=offShot(sc,cam,200,200,0xfff0f6);}catch(e){console.warn(e);}
  PETPICS.set(k,url);return url;}
const petImg=(d,cls)=>{const u=petPic(d);return u?`<img class="${cls}" src="${u}" alt="">`:`<span class="${cls} none">${PET_TYPES[petKind(d)].icon}</span>`;};
const petWhere=d=>!d.stay?'🐾 Follows you':petAtHome(d)?'🏡 At home':'📍 Waits where you left it';
function openMyPets(msg){const n=petFollowers();
  openPanel(`<div class="hd"><h2>🐾 My pets</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    <p class="note">${msg?esc(msg):`Pick up to ${PET_FOLLOW} pets to follow you. The others wait for you at home in your yard 🏡`} <b>(${n}/${PET_FOLLOW} follow you)</b></p>
    <div class="petlist">${S.pets.map((d,i)=>`<div class="petrow">${petImg(d,'petpic')}<span><b>${esc(d.name)}</b><small>${petWhere(d)}</small></span>${d.stay?`<button class="btn mint" data-a="mpfol:${i}">🐾 Follow me</button>`:`<button class="btn lilac" data-a="mphome:${i}">🏡 Go home</button>`}</div>`).join('')}</div>
    <div class="row"><button class="btn white" data-a="close">Done</button></div>`);$('card').scrollTop=0;}
ACT.mypets=()=>{petBye();openMyPets();};
ACT.mpfol=i=>{const d=S.pets[+i],p=d&&PET_ACTORS.find(a=>a.d===d);if(!p)return;if(petFollowers()>=PET_FOLLOW){SFX.no();openMyPets(`${PET_FOLLOW} pets follow you already! Send one home first.`);return;}
  d.stay=false;delete d.home;p.far=0;SFX[PET_TYPES[petKind(d)].snd]();change();openMyPets(`${d.name} will follow you!`);};
ACT.mphome=i=>{const d=S.pets[+i],p=d&&PET_ACTORS.find(a=>a.d===d);if(!p)return;petGoHome(p);SFX.tap();change();openMyPets(`${d.name} runs home to your yard 🏡`);};
/* 💔 giving a pet to Ms. Paws: pick the pet, one yes with its name and picture, no coins back, gone for good */
function openGiveAway(){if(!S.pets.length){toast('You don\'t have any pets yet! 🐾',3);return;}
  openPanel(`<div class="hd"><h2>💔 Give a pet to Ms. Paws</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    <p class="note">Ms. Paws finds a loving new family for a pet you can't look after. Which one?</p>
    <div class="petlist">${S.pets.map((d,i)=>`<div class="petrow">${petImg(d,'petpic')}<span><b>${esc(d.name)}</b><small>${petWhere(d)}</small></span><button class="btn white" data-a="gvpick:${i}">Pick</button></div>`).join('')}</div>
    <div class="row"><button class="btn white" data-a="gvback">Back</button></div>`);$('card').scrollTop=0;}
ACT.giveaway=()=>openGiveAway();
ACT.gvback=()=>openShop('pets');
ACT.gvpick=i=>{const d=S.pets[+i];if(!d)return;GV=d;
  openPanel(`<div class="hd"><h2>${PET_TYPES[petKind(d)].icon} ${esc(d.name)}</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>${petImg(d,'gvpic')}
    <p class="line">Give <b>${esc(d.name)}</b> to Ms. Paws? She will find ${esc(d.name)} a loving new family.</p>
    <p class="note">You don't get coins back, and ${esc(d.name)} won't come back.</p>
    <div class="row"><button class="btn coral" data-a="gvyes">💔 Yes, give ${esc(d.name)} away</button><button class="btn mint" data-a="giveaway">💗 No, keep ${esc(d.name)}</button></div>`);$('card').scrollTop=0;};
ACT.gvyes=()=>{const d=GV;GV=null;const i=d?S.pets.indexOf(d):-1;if(i<0){closePanel();return;}
  const p=PET_ACTORS.find(a=>a.d===d);if(p){scene.remove(p.g);PET_ACTORS.splice(PET_ACTORS.indexOf(p),1);}S.pets.splice(i,1);
  const K=KEEPERS.find(k=>k.name==='Ms. Paws');if(K)K.p.wave=1.2;SFX.talk();change();saveLocal();closePanel();
  toast(`💗 Ms. Paws: “I will find ${d.name} a wonderful new family. Thank you!” Now you have room for ${PET_MAX-S.pets.length} more ${PET_MAX-S.pets.length===1?'pet':'pets'}.`,5);};

/* shops */
let SHOP=null;
function openShop(k){SHOP=k;const sh=SHOPS[k];SFX.talk();
  const list=(sh.items||[]).map(id=>({id,...itemInfo(id)})).concat((sh.furn||[]).map(t=>({id:t,n:FURN[t].n,i:FURN[t].i,p:FURN[t].p,f:1})));
  openPanel(`<div class="hd"><h2>${sh.title}</h2><div class="chip">🪙 <b id="pc">${S.coins}</b></div><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    ${shutNote(k)}${sh.furn?'<p class="note">Furniture and decorations go to 📦 My stuff. Place them at home with&nbsp;🛋️&nbsp;Decorate.</p>':''}${newInHTML(k)}
    <div class="grid" style="margin-top:10px">${list.map(it=>`<button class="it" data-a="buy:${it.id}"><span class="em">${it.i}</span><span>${it.n}</span><span class="pr">${it.p} 🪙</span><span class="have" id="hv-${it.id}">${it.f?'':(S.bag[it.id]?'You have '+S.bag[it.id]:'')}</span></button>`).join('')}</div>
    ${k==='pets'&&S.pets.length?'<div class="row"><button class="btn white" data-a="giveaway">💔 Give a pet to Ms. Paws</button></div>':''}`);}
ACT.buy=(id,b)=>{if(shutBuy(SHOP))return;const sh=SHOPS[SHOP],F=(sh.furn&&sh.furn.includes(id))?FURN[id]:null,info=F||itemInfo(id);
  if(S.coins<info.p){SFX.no();toast('Not enough coins yet! 🪙 '+earnTip(),3.6);return;}
  S.coins-=info.p;SFX.coin();
  if(F){S.home.store.push({u:uid(),t:id,c:F.cols?pick(F.cols):null,x:0,z:0,r:0});toast(F.i+' '+F.n+' is waiting in 📦 My stuff at home!');}
  else{S.bag[id]=(S.bag[id]||0)+1;const hv=$('hv-'+id);if(hv)hv.textContent='You have '+S.bag[id];if(FOODS[id])doneTask('buy');}
  qEvent({market:'market',cafe:'cafe',flowers:'flower'}[SHOP]||'none');if(id.startsWith('seed_'))qEvent('buy:seed');if(ACCS[id])qEvent('buyacc');if(SHOP==='flowers')addXP('garden',1);qEvent('buy:'+id);if(id==='petfood'||id==='catfood')qEvent('buy:food');
  if($('pc'))$('pc').textContent=S.coins;b&&b.animate&&b.animate([{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:180});change();};

/* ✨ "New in!" shelves: buy one and a brand-new thing pops up in its place, so the shops never run out */
const NEWCOLS=[['#ff8fab','Bubblegum'],['#ff6f61','Coral'],['#ffa45c','Mango'],['#ffe066','Lemon'],['#c5e86c','Lime'],['#6ee7b7','Mint'],['#4dd4c6','Teal'],['#7dd3fc','Sky'],['#3b82f6','Ocean'],['#a78bfa','Grape'],['#e9b8ff','Lilac'],['#f0abfc','Orchid'],
  ['#ffc4a8','Peach'],['#fde68a','Butter'],['#9ff0d0','Seafoam'],['#e8ecf3','Cloud'],['#334155','Midnight'],['#c2843a','Caramel'],['#ff3d9a','Hot pink'],['#8b5cf6','Violet'],['#22c55e','Leaf'],['#ef4444','Cherry'],['#fbbf24','Sunny'],['#94a3b8','Silver']];
const colName=c=>{const f=NEWCOLS.find(x=>x[0]===c);return f?f[1]:'Special';};
const colNear=(a,b)=>{if(a===b)return true;const h=c=>/^#[0-9a-f]{6}$/i.test(c)?[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)):null,p=h(a),q=h(b);return!!p&&!!q&&Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])<90;};   /* two colours that look the same on a little picture (run 4 finish: "Grape" and "Violet") */
const NEWIN_SHOPS={clothes:1,toys:1,flowers:1,pets:1,home:1};let NEWPOP=null;
/* a "New in!" thing costs today's price (one saved before the coins balance keeps its old number in the save, but costs the same as in the shop) */
const NI_COLP={top:40,bottom:35,shoes:30},niP=it=>(it.kind==='furn'?FURN[it.k]&&FURN[it.k].p:it.kind==='hat'?CLOTHES[it.k]&&CLOTHES[it.k].p:NI_COLP[it.k])||it.p;
function niFurnPool(sh){return(sh==='home'?BUY_FURN:(SHOPS[sh]&&SHOPS[sh].furn)||[]).filter(t=>FURN[t]&&FURN[t].cols&&!FURN[t].gold);}
function niMake(sh,avoid){
  for(let k=0;k<80;k++){let it=null;
    if(sh==='clothes'){
      if(Math.random()<.75){const key=pick(Object.keys(CLOTHES).filter(x=>CLOTHES[x].hat||CLOTHES[x].gl)),C=CLOTHES[key],c=pick(NEWCOLS.map(x=>x[0]).concat(C.cols));
        if(!variants(key).some(v=>v.c===c))it={kind:'hat',k:key,c,n:colName(c)+' '+C.n.toLowerCase(),i:C.i,p:C.p};}
      else{const sl=pick(['top','bottom','shoes']),c=pick(NEWCOLS)[0];if(!lookOpts(sl).includes(c))it={kind:'col',k:sl,c,n:colName(c)+' '+{top:'sweater',bottom:'pants',shoes:'shoes'}[sl],i:{top:'👚',bottom:'👖',shoes:'👟'}[sl],p:NI_COLP[sl]};}}
    else{const pool=niFurnPool(sh);if(!pool.length)return null;const t=pick(pool),F=FURN[t],c=pick(NEWCOLS)[0];if(!F.cols.includes(c))it={kind:'furn',k:t,c,n:colName(c)+' '+F.n.toLowerCase(),i:F.i,p:F.p};}
    if(it&&!(avoid||[]).some(a=>a&&a.k===it.k&&colNear(a.c,it.c)))return it;}
  return null;}
function newIn(sh){S.newin=S.newin||{};let L=S.newin[sh];if(!Array.isArray(L))L=S.newin[sh]=[];
  for(let i=0;i<3;i++){const it=L[i];if(!it||(it.kind==='hat'&&variants(it.k).some(v=>v.c===it.c))||(it.kind==='col'&&lookOpts(it.k).includes(it.c))||(it.kind==='furn'&&!FURN[it.k]))L[i]=niMake(sh,L);}
  return L;}
function newInHTML(sh){if(!S||!NEWIN_SHOPS[sh])return'';const L=newIn(sh);if(!L.some(Boolean))return'';
  return`<div class="sec">✨ New in! <small class="nisub">Buy one and something new pops up!</small></div><div class="grid newin">${L.map((it,i)=>{if(!it)return'';const img=it.kind==='furn'?thumb(it.k,it.c):'';
    return`<button class="it ni${NEWPOP===sh+i?' nipop':''}" data-a="nbuy:${sh}:${i}"><span class="nbadge">NEW</span>${img?`<img class="nimg" src="${img}" alt="">`:`<span class="em">${it.i}</span>`}<span>${esc(it.n)}&nbsp;<i class="dot" style="background:${it.c}"></i></span><span class="pr">${niP(it)} 🪙</span></button>`;}).join('')}</div>`;}
ACT.nbuy=(sh,i)=>{if(typeof sh==='string'&&sh.includes(':')){const p=sh.split(':');sh=p[0];i=p[1];}if(shutBuy(sh))return;const L=newIn(sh),it=L[+i];if(!it)return;const ip=niP(it);if(S.coins<ip){SFX.no();toast('Not enough coins yet! 🪙');return;}
  S.coins-=ip;SFX.coin();SFX.yay();
  if(it.kind==='hat'){S.outfits=S.outfits||[];S.outfits.push({k:it.k,c:it.c});toast(it.i+' '+it.n+'! Try it on at the 🪞 mirror.',3.2);qEvent('clothes');}
  else if(it.kind==='col'){S.xcol=S.xcol||{};(S.xcol[it.k]=S.xcol[it.k]||[]).push(it.c);toast(it.i+' '+it.n+'! Try it on at the 🪞 mirror.',3.2);qEvent('clothes');}
  else{S.home.store.push({u:uid(),t:it.k,c:it.c,x:0,z:0,r:0});toast(it.i+' '+it.n+' is waiting in 📦 My stuff at home!',3.2);}
  L[+i]=niMake(sh,L);NEWPOP=sh+i;setTimeout(()=>{NEWPOP=null;},1400);setTimeout(()=>popText('✨ Something new popped up!'),350);change();
  if(sh==='clothes')openClothes();else if(sh==='home')renderCatalog();else openShop(sh);};
/* bag */
function openBag(){const foods=Object.keys(S.bag).filter(k=>S.bag[k]>0);
  openPanel(`<div class="hd"><h2>🎒 My bag</h2><div class="chip">🪙 <b>${S.coins}</b></div><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    <div class="row" style="margin:0 0 12px"><button class="btn lilac" data-a="mylook">👗 Change my look</button></div>${storeWaiting()?`<p class="note">${cozierLine(storeWaiting())} Tap 🛋️ at home, then 🛍️ Shop → 📦 My stuff.</p>`:''}
    ${foods.length?`<p class="note">Tap food to eat it.</p><div class="grid" style="margin-top:8px">${foods.map(k=>{const it=itemInfo(k);return`<button class="it" data-a="eat:${k}"><span class="em">${it.i}</span><span>${it.n}</span><span class="have">×${S.bag[k]}</span></button>`;}).join('')}</div>`:'<p class="line">Your bag is empty. The market and the café have yummy food!</p>'}
    <div class="sec">Friends</div>${FRIENDS.filter(f=>frSt(f.id).met).map(f=>`<div class="opt"><span>${esc(f.name)}</span><span class="hearts" style="position:static">${hearts(heartsOf(f.id))}</span></div>`).join('')||'<p class="note">Say hi to the kids in town to make friends!</p>'}
    <div class="sec">Pets</div>${S.pets.map(d=>`<div class="opt"><span>${PET_TYPES[petKind(d)].icon} ${esc(d.name)}</span><span class="hearts" style="position:static">${hearts(clamp(Math.round(d.happy/20),0,5))}</span></div>`).join('')||'<p class="note">Visit the pet shop to adopt a pet!</p>'}`);}
ACT.eat=k=>{const it=itemInfo(k);if(!FOODS[k]){toast(k==='petfood'?'That\'s for your pet! Look at your pet and tap 🦴 Feed.':k==='catfood'?'That\'s for your kitten! Look at your kitten and tap 🐟 Feed.':k.startsWith('seed_')?'Plant these in your garden behind your house! 🌱':PET_ITEMS[k]?'That\'s for your pet! Look at your pet to use it. 🐾':'Look at your pet and tap 🎾 Play!');return;}
  if(S.hunger>=99){toast("You're full! Save it for later.");return;}S.bag[k]--;S.hunger=Math.min(100,S.hunger+it.f);SFX.eat();toast('Yum! '+it.i);qEvent('eat');qEvent('eat:'+k);doneTask('eat');change();openBag();};

/* decorate catalog */
let CAT={tab:'buy',sel:null,col:null};
function openCatalog(tab){CAT.tab=tab||CAT.tab;if($('toast').textContent===DECO_HINT)toastOff();renderCatalog();}
function renderCatalog(){const t=CAT.tab;let body='';
  if(t==='buy'){if(CAT.sel){const F=FURN[CAT.sel];body=`<div class="it" style="cursor:default;max-width:220px;margin:0 auto"><span class="em">${F.i}</span><span>${F.n}</span><span class="pr">${F.p} 🪙</span></div>
      ${F.cols?`<p class="note">Pick a color</p><div class="swrow">${F.cols.map(c=>`<button class="sw ${c===CAT.col?'on':''}" style="background:${c}" data-a="ccol:${c}" aria-label="Color"></button>`).join('')}</div>`:''}
      <div class="row"><button class="btn mint" data-a="cbuy" ${S.coins<F.p?'disabled':''}>Buy &amp; place it</button><button class="btn white" data-a="cback">Back</button></div>${S.coins<F.p?'<p class="note">Not enough coins yet.</p>':''}`;}
    else body=newInHTML('home')+`<div class="sec">All furniture</div><div class="grid">${BUY_FURN.map(k=>{const F=FURN[k];return`<button class="it" data-a="csel:${k}"><span class="em">${F.i}</span><span>${F.n}</span><span class="pr">${F.p} 🪙</span></button>`;}).join('')}</div>`;}
  else if(t==='mine'){body=S.home.store.length?`<p class="note">Tap something to place it.</p><div class="grid" style="margin-top:8px">${S.home.store.map((it,i)=>`<button class="it" data-a="cplace:${i}"><span class="em">${FURN[furnOf(it)].i}</span><span>${FURN[furnOf(it)].n}</span>${it.c&&!it.sh?`<span class="sw" style="width:22px;height:22px;background:${it.c};border-width:2px"></span>`:''}</button>`).join('')}</div>`:'<p class="line">Nothing here yet. Things you put away show up here.</p>';}
  else body=`<div class="sec" style="margin-top:0">Wall color</div><div class="swrow">${WALLS.map(c=>`<button class="sw ${c===S.home.wall?'on':''}" style="background:${c}" data-a="wall:${c}" aria-label="Wall color"></button>`).join('')}</div>
    <div class="sec">Floor</div><div class="row" style="margin-top:4px">${Object.entries(FLOORS).map(([k,n])=>`<button class="btn ${k===S.home.floor?'butter':'white'}" data-a="floor:${k}">${n}</button>`).join('')}</div>`;
  openPanel(`<div class="hd"><h2>🛍️ Home shop</h2><div class="chip">🪙 <b>${S.coins}</b></div><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    <div class="tabs"><button class="btn ${t==='buy'?'on':'off'}" data-a="ctab:buy">Furniture</button><button class="btn ${t==='mine'?'on':'off'}" data-a="ctab:mine">📦 My stuff (${S.home.store.length})</button><button class="btn ${t==='room'?'on':'off'}" data-a="ctab:room">🎨 Walls &amp; floor</button></div>${body}`);}
ACT.ctab=t=>{CAT.tab=t;CAT.sel=null;renderCatalog();};
ACT.csel=k=>{CAT.sel=k;CAT.col=FURN[k].cols?FURN[k].cols[0]:null;renderCatalog();};
ACT.ccol=c=>{CAT.col=c;renderCatalog();};
ACT.cback=()=>{CAT.sel=null;renderCatalog();};
ACT.cbuy=()=>{const F=FURN[CAT.sel];if(S.coins<F.p)return;S.coins-=F.p;SFX.coin();const it=shopItem(CAT.sel,CAT.col);CAT.sel=null;
  if(!(CUR.id==='home'&&DECO.on&&DX()===HOMEX)){S.home.store.push(it);change();renderCatalog();toast('📦 Bought! Go home and place it from 📦 My stuff.',3.6);return;}
  closePanel();startPlacing(it);toast('Look where it should go, then tap ✅',3);change();};
ACT.cplace=i=>{if(!(CUR.id==='home'&&DECO.on&&DX()===HOMEX)){SFX.no();toast('🏠 Go home to place it! Tap 🛋️ in your house.',3.2);return;}const it=S.home.store.splice(+i,1)[0];if(!it)return;closePanel();startPlacing(it);change();};
ACT.bighouse=()=>{const n=homeFloors();if(n>=6||sk('decor').lv<10*n||S.coins<BIG_PRICE)return;S.coins-=BIG_PRICE;if(n===1)S.bighouse=true;else S.home.xf=(S.home.xf|0)+1;closePanel();
  applyHouse();rebuildHome();SFX.coin();SFX.yay();change();toast(n===1?'🎉 You got the big house! Go inside: the stairs are in the west wall! 🪜':'🎉 Floor '+(n+1)+' is yours! The stairs go on up 🪜',4.5);
  laneRefresh(true);
ACT.hcol=c=>{SFX.pop();setHouseCol(c||null);};   /* 🎨 the house-colour buttons (run 4, item 23) */const [hx,hz]=yardPt(-17,-10.5);for(let i=0;i<8;i++)setTimeout(()=>floatText(pick(['🎉','⭐','✨','🏡']),hx+rand(-3,3),4.5+rand(0,3),hz+rand(-1,1),{h:.8}),i*150);};
ACT.wall=c=>{S.home.wall=c;WALL_M.color.set(c);SFX.pop();change();renderCatalog();};
ACT.floor=k=>{S.home.floor=k;setFloor(k);SFX.pop();change();renderCatalog();};

/* the phone */
const PH={app:null,tab:'daily'};
const PLACES=[
  {id:'home',n:'My House',nt:1,i:'🏠',x:-17,z:-15,w:9,d:7,c:'#d9c8ff',door:[-17,-10.4]},{id:'garden',n:'My Garden',nt:1,i:'🌱',x:-16.75,z:-21.5,w:12,d:6,c:'#a2e48a',door:[-9.8,-20.3],flat:1},
  {id:'market',n:'Market',i:'🍎',x:18,z:-15,w:12,d:8,c:'#fff1b8',door:[18,-10.1]},{id:'cafe',n:'Café',i:'☕',x:32,z:-14,w:7,d:6,c:'#ffd6e0',door:[32,-10.1]},
  {id:'pets',n:'Pet Shop',i:'🐾',x:18,z:15,w:11,d:8,c:'#c9f2e3',door:[18,10.1]},{id:'flowers',n:'Flower Shop',i:'🌷',x:31.5,z:14,w:7,d:6,c:'#e6dbff',door:[31.5,10.1]},
  {id:'park',n:'Cozy Park',nt:1,i:'🌳',x:-24.4,z:24.5,w:32,d:32,c:'#78cc6c',door:[-22,7.6],flat:1},{id:'fountain',n:'Fountain',i:'⛲',x:-22,z:22,r:4.8,c:'#cfe9ff',door:[-22,16.6],flat:1},
  {id:'school',n:'Cozy Town School',nt:1,i:'🏫',x:-25,z:-64.5,w:28,d:11,c:'#ffe7a3',door:[-25,-58.2]},{id:'toys',n:'Toy Store',i:'🧸',x:64,z:-31,w:9,d:12,c:'#ffd6e0',door:[58.7,-31]},
  {id:'bakery',n:'Bakery',i:'🥐',x:63,z:-14,w:7,d:8,c:'#fff1b8',door:[58.7,-14]},{id:'library',n:'Library',i:'📚',x:65,z:20,w:10,d:14,c:'#c7e6ff',door:[59.2,20]},
  {id:'icecream',n:'Ice Cream Shop',i:'🍦',x:62,z:36,w:6,d:7,c:'#e6dbff',door:[58.4,36]},{id:'fire',n:'Fire Station',i:'🚒',x:-65,z:-25,w:10,d:14,c:'#ff8f8f',door:[-59.2,-25]},
  {id:'clothes',n:'Clothes Shop',i:'👗',x:-63.5,z:-12.5,w:7,d:8,c:'#ffe3ef',door:[-59.2,-12.5]},{id:'salon',n:'Hair Salon',i:'✂️',x:-63.5,z:40.5,w:7,d:8,c:'#ffe6f5',door:[-59.2,40.5]},{id:'field',n:'Football Field',i:'⚽',x:-25,z:68.5,w:28,d:18,c:'#6fc45f',door:[-25,59.8],flat:1},
  {id:'lake',n:'Lake',i:'🦆',x:69,z:69,r:7.6,c:'#7fd8ff',door:[61.2,61.2],flat:1},{id:'pond',n:'Duck Pond',i:'🦆',x:36.2,z:-36.2,r:2.1,c:'#7fd8ff',door:[33.6,-38.8],flat:1},
  {id:'pizza',n:'Pizzeria',i:'🍕',x:63,z:8.6,w:6,d:7,c:'#ffd2bd',door:[59.2,8.6]}];
/* nq: not used for quests (old saves must get the same quests as before) */
PLACES.push({id:'beach',n:'Beach',i:'🏖️',x:80,z:0,w:8,d:14,c:'#f6dfa9',door:[77.4,0],flat:1,nq:1});
PLACES.push({id:'bus',n:'Bus stop',i:'🚌',x:-16.2,z:7.6,w:4,d:1.5,c:'#ffd9c2',door:[-14.3,5.2],flat:1,nq:1});
PLACES.push({id:'treepark',n:'Tree Park',i:'🌲',x:75.6,z:-40.6,w:9,d:9,c:'#9fd88a',door:[71.6,-38],flat:1,nq:1});   /* 🌲 run 4, job 16: the gate in the woods behind the Toy Store */
const theN=pl=>pl.nt?pl.n:'the '+pl.n;
const BLDS=[[-31,-15,7,7,'#bff0dc'],[-22,-31,18,8,'#ffd0b5'],[23,-31,20,8,'#c7e6ff'],[24,31,18,8,'#ffe0c4'],[13,-61.5,8,7,'#ffd6e0'],[25,-61.5,8,7,'#c9f2e3'],[37,-61.5,8,7,'#fff1b8'],[13,61.5,8,7,'#e6dbff'],[25,61.5,8,7,'#d9e8ff'],[37,61.5,8,7,'#ffe0c4'],[-66,25,10,20,'#ffd0b5']];
const INSIDE_AT={beach:'beach',home:'home',market:'market',pets:'pets',flowers:'flowers',cafe:'cafe',clothes:'clothes',toys:'toys',bakery:'bakery',icecream:'icecream',library:'library',school:'school',fire:'fire',pizza:'pizza',treepark:'treepark'};
