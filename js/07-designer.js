'use strict';
/* ================= 🎨 INTERIOR DESIGNER JOB =================
   A client messages you → follow the dot to their house → decorate ONE room with furniture
   from the 🛋️ Furniture app (free for the job) → tap 🎉 Finished! → the client walks in,
   looks around and gives you stars: right vibe, right amount, and neat (or messy!). */
/* 🪙 a room pays 20 (no ⭐) / 50 (⭐) / 90 (⭐⭐) / 130 🪙 (⭐⭐⭐), 3 rooms a day; the room's Decorating level-up gives no extra coins */
const DS_MAX=3,CL_ITEMS=new Map(),DS_PAY=st=>st>=2.5?140:st>=1.5?100:st>=.5?70:40;
const DS_PLANTS=['plant','fern','bonsai','cactus','sunflower','lavender','flowers','tulips','rosebush'];
const DS_TOYS=['teddy','toybox','castle','dollhouse','robot','rockinghorse','racecar','unicorn'];
const DS_SEATS=['sofa','armchair'],DS_WALLY=['bed','bunkbed','wardrobe','shelf','dresser','mirror','tv','fireplace','fridge','stove','sink','washer','piano','desk','computer','gaming','clock','dollhouse','bath','cupboard','cupboardn','drawers','cornercup','tallcup'];
const FAMC={'#ff9ec4':'pink','#ffc9dc':'pink','#ff7aa8':'pink','#ffd6e0':'pink','#ff4d6d':'red','#ff6b6b':'red','#7fdcb5':'green','#5fd4b0':'green','#c9f2e3':'green',
  '#8fd3ff':'blue','#7cc8ff':'blue','#bfe6ff':'blue','#5fa8ff':'blue','#8fb7ff':'blue','#b79cff':'purple','#e6dbff':'purple','#ffd45c':'yellow','#fff1b8':'yellow',
  '#ff8a6b':'orange','#ffb36b':'orange','#ffffff':'white','#f4f6fb':'white','#fbf7ff':'white','#c98f5e':'wood','#a8714a':'wood','#3d2c5e':'dark','#c8cde0':'grey'};
const FAMN={pink:'pink',red:'red',green:'green',blue:'blue',purple:'purple',yellow:'yellow',orange:'orange',white:'white',wood:'wooden',dark:'dark',grey:'grey'};
const FAMDOT={pink:'#ff9ec4',green:'#5fd4b0',blue:'#7cc8ff',purple:'#b79cff',yellow:'#ffd45c',orange:'#ff8a6b',white:'#ffffff',wood:'#c98f5e'};
const famOf=c=>c?FAMC[String(c).toLowerCase()]||null:null,aN=w=>(/^[aeio]/i.test(w)?'an ':'a ')+w;
const DROOM={
  bedroom:{n:'bedroom',cnt:[5,8],items:['bed','bunkbed','wardrobe','dresser','mirror','lamp','desk','chair','armchair','beanbag','shelf','clock','rug','rugsq','teddy','unicorn',...DS_PLANTS],must:[['bed','bunkbed']],wall:'#fff3ea',floor:'wood'},
  kitchen:{n:'kitchen',cnt:[5,8],items:['stove','fridge','sink','cupboard','cupboardn','drawers','cornercup','tallcup','wallcup','table','chair','lamp','clock','shelf','washer','rug','rugsq',...DS_PLANTS],must:[['stove'],['fridge']],wall:'#fffbea',floor:'check'},
  living:{n:'living room',cnt:[5,9],items:['sofa','armchair','beanbag','tv','fireplace','table','chair','lamp','shelf','piano','clock','easel','tank','gaming','rug','rugsq','teddy',...DS_PLANTS],must:[['sofa','armchair']],wall:'#fff1e4',floor:'wood'},
  kids:{n:'play room',cnt:[5,9],items:['bed','bunkbed','toybox','beanbag','desk','chair','lamp','shelf','easel','rug','rugsq',...DS_TOYS,...DS_PLANTS],must:[['bed','bunkbed']],toys:2,wall:'#eef6ff',floor:'carpet'}};
const DTHEMES=[
  {id:'natbed',n:'Nature bedroom',e:'🌿',room:'bedroom',pal:['green','wood'],plants:2,ask:'I love plants and green things!',good:"I love all the plants, it's so cozy! 💚",ph:[['bed','#7fdcb5'],['plant'],['lamp','#7fdcb5']]},
  {id:'pinkbed',n:'Beautiful bedroom',e:'🎀',room:'bedroom',pal:['pink','white'],ask:'Pink is my favorite color!',good:'So pink and pretty! I love it! 💗',ph:[['bed','#ff9ec4'],['lamp','#ff9ec4'],['flowers','#ff7aa8']]},
  {id:'bluebed',n:'Dreamy blue bedroom',e:'🌙',room:'bedroom',pal:['blue','white'],ask:'Calm and blue, like the sky!',good:"So calm and blue… I'll sleep so well! 💙",ph:[['bed','#8fd3ff'],['lamp','#8fd3ff'],['dresser','#bfe6ff']]},
  {id:'cozykit',n:'Cozy kitchen',e:'🍳',room:'kitchen',pal:['wood','yellow','orange','white'],ask:"Warm and cozy, like Grandma's kitchen!",good:"So warm and cozy, just like Grandma's! 🧡",ph:[['stove'],['table','#c98f5e'],['lamp','#ffd45c']]},
  {id:'pinkkit',n:'Cupcake kitchen',e:'🧁',room:'kitchen',pal:['pink','white'],ask:'Pink and white, sweet like a cupcake!',good:'Pink and sweet, like a cupcake! 🧁',ph:[['fridge','#ffc9dc'],['table','#ff9ec4'],['flowers','#ff7aa8']]},
  {id:'greenkit',n:'Garden kitchen',e:'🥗',room:'kitchen',pal:['green','white','wood'],plants:2,ask:'I want lots of plants in my kitchen!',good:"So many plants! It's like a garden! 💚",ph:[['fridge','#c9f2e3'],['plant'],['fern']]},
  {id:'sunliv',n:'Sunny living room',e:'🌻',room:'living',pal:['yellow','white','wood'],ask:'Bright and sunny, like summer!',good:'So bright and sunny! 💛',ph:[['sofa','#ffd45c'],['sunflower'],['lamp','#ffd45c']]},
  {id:'cozyliv',n:'Cozy living room',e:'🔥',room:'living',pal:['wood','orange','yellow'],need:[['fireplace','lamp']],ask:'Warm and cozy for movie nights!',good:'So cozy! Perfect for movie night! 🔥',ph:[['fireplace'],['armchair','#ff8a6b'],['lamp','#ffd45c']]},
  {id:'sealiv',n:'Ocean living room',e:'🌊',room:'living',pal:['blue','white'],ask:'Blue like the sea, please!',good:'Blue like the ocean! I love it! 🌊',ph:[['sofa','#8fb7ff'],['tank'],['lamp','#8fd3ff']]},
  {id:'natliv',n:'Forest living room',e:'🌳',room:'living',pal:['green','wood'],plants:2,ask:'Green and leafy, like a forest!',good:'It feels like a forest in here! 💚',ph:[['sofa','#7fdcb5'],['bonsai'],['fern']]},
  {id:'unikids',n:'Unicorn play room',e:'🦄',room:'kids',pal:['purple','pink','white'],ask:'I love unicorns and purple!',good:'Purple and magical! I love it! 🦄',ph:[['unicorn','#e6dbff'],['beanbag','#b79cff'],['castle','#e6dbff']]}];
function ds(){const d=S.ds||(S.ds={});if(d.day!==S.day){d.day=S.day;d.done=0;}if(!isFinite(d.wait))d.wait=5;return d;}
/* 🚪 an order has 1 or 2 rooms (night 3, job 9; since pet update 1 only saved orders have 2): room 2 is o.r2 = {th, items}, o.ri is the room you are in. An old one-room order has no r2 */
const dsThemeOf=(o,ri)=>DTHEMES.find(t=>t.id===(ri&&o.r2?o.r2.th:o.th))||DTHEMES[0];
const dsTheme=o=>{o=o||(S&&S.ds&&S.ds.o)||{};return dsThemeOf(o,o.r2?o.ri|0:0);};
const dsTwo=()=>!!(S&&S.ds&&S.ds.o&&S.ds.o.r2);
function dsWho(o){const L=resList(o.h);return L[o.w|0]||WHO[o.h];}
function dsGoing(id){return!!(S&&S.job==='designer'&&S.ds&&S.ds.o&&S.ds.o.h===id);}
function dsFlat(num){return!!(dsGoing(APT.b)&&S.ds.o.flat===num);}
function dsHere(){return!!(S&&S.job==='designer'&&S.ds&&S.ds.o&&CUR&&CUR.id==='client');}
const dsItems=()=>{const o=S.ds&&S.ds.o;if(!o)return[];if(o.r2&&o.ri)return o.r2.items||(o.r2.items=[]);return o.items||(o.items=[]);};
/* going through the side door: the same room is dressed up as the other one (its colours, floor and things); you come out by the door */
function dsRoomShow(i){const o=S.ds&&S.ds.o,L=LOC.client;if(!o||!o.r2||!L)return;o.ri=i?1:0;dsRoomSetup();
  P.x=L.ox+(i?CLW-1.3:-CLW+1.3);P.z=L.oz+1.6;P.yaw=i?Math.PI/2:-Math.PI/2;P.pitch=-.1;P.sit=null;if(DECO.on){if(DECO.placing)decoCancel();selMark(null);}
  bringFollowers();dcardUpd(true);jobHud(true);change();}
function dsGoRoom(i,cb){const o=S.ds&&S.ds.o;if(!o||!o.r2||fading||(CUT&&!CUT.rev))return;SFX.door();fade(()=>{dsRoomShow(i);if(cb)cb();});}
/* '' = fits, 'room' = wrong kind of room, 'col' = wrong color for this client */
function dsFits(T,t,c){const R=DROOM[T.room];if(!R.items.includes(t))return'room';const F=FURN[t];if(!F||!F.cols)return'';if(T.plants&&DS_PLANTS.includes(t))return'';return T.pal.includes(famOf(c||F.cols[0]))?'':'col';}
/* the "ideas" tray: everything that fits this client, the must-haves first */
function dsTray(T){const R=DROOM[T.room],must=new Set([...(R.must||[]).flat(),...(T.need||[]).flat()]),out=[];
  const order=[...R.items].sort((a,b)=>(must.has(b)-must.has(a))||(DS_PLANTS.includes(a)-DS_PLANTS.includes(b))||(DS_TOYS.includes(a)-DS_TOYS.includes(b)));
  for(const t of order){const F=FURN[t];if(!F)continue;if(!F.cols){out.push([t,'']);continue;}for(const c of F.cols)if(!dsFits(T,t,c))out.push([t,c]);}return out;}
function nearPlace(H){let b=null,bd=1e9;for(const p of PLACES){if(p.id==='home'||p.id==='garden')continue;const d=Math.hypot(p.door[0]-H.x,p.door[1]-H.z);if(d<bd){bd=d;b=p;}}return bd<40?b:null;}
function dsNew(){const d=ds(),H=pick(HOUSES.filter(h=>h.id!==d.last)),T=pick(DTHEMES.filter(t=>t.id!==d.lt));   /* 🚪 a new order is one room (pet update 1); a saved 2-room order still finishes */
  const flat=isApt(H.id)?(1+Math.floor(Math.random()*3))*10+1+Math.floor(Math.random()*5):0;
  const o={h:H.id,th:T.id,w:Math.floor(Math.random()*resList(H.id).length),items:[]};if(flat)o.flat=flat;d.o=o;d.last=H.id;d.lt=T.id;
  const W=dsWho(o),np=/ (by|behind) the /.test(H.n)?null:nearPlace(H);   /* (run 4 finish: a name that says where it is gets no "near": "the Apartments behind the Pet Shop, flat 11, near the Pet Shop") */
  const x=`Hi! I'm ${W.nm} 😊 I live in the ${H.n}${flat?', flat '+flat:''}${np?', near '+theN(np):''}. Can you make me ${aN(T.n.toLowerCase())}? ${T.ask} ${T.e}`;
  addMsg('cl','cl',x,{t2:'🎨 New client: '+W.nm});SFX.ding();try{if(navigator.vibrate)navigator.vibrate([120,80,120]);}catch(e){}
  showNote('🎨 New client!',x,false,'🎨','cl');change();jobHud(true);dcardUpd(true);}
function jobTarget(){if(!S)return null;if(S.job==='delivery')return hasDlOrder()?dlTarget():null;
  if(S.job==='designer'){const o=S.ds&&S.ds.o,H=o&&HOUSE(o.h);return H?{x:H.x+Math.sin(H.ry)*.8,z:H.z+Math.cos(H.ry)*.8}:null;}
  if(S.job==='teacher')return S.tc&&S.tc.o?{x:-25,z:-58.2}:null;if(S.job==='hair')return{x:SALON.door[0],z:SALON.door[1]};if(S.job==='photo')return ptTarget();return null;}

/* scoring: ⭐ vibe (½ if one thing is off) + ⭐ right amount + neat ⭐ (or messy −1) */
function dsNeat(its){const out=[],tol=.35,W=CLW,D=CLD;
  for(const it of its){const seat=DS_SEATS.includes(it.t);if(!seat&&!DS_WALLY.includes(it.t))continue;const R=fpRect(it.t,it.x,it.z,it.r),gap=[R.z1+D,R.x1+W,D-R.z2,W-R.x2];
    if(it.t==='bath'){if(Math.min(...gap)>tol)out.push({k:'mid',it});continue;}
    const back=gap[it.r%4],front=gap[(it.r+2)%4];
    if(seat){if(front<=tol&&back>tol)out.push({k:'face',it});continue;}
    if(back<=tol)continue;out.push({k:front<=tol?'face':'mid',it});}
  if(its.length>=4){const q=[0,0,0,0];for(const it of its)q[(it.x<0?0:1)+(it.z<0?0:2)]++;if(Math.max(...q)>=Math.ceil(its.length*.75))out.push({k:'pile'});}
  return out;}
function dsScore(o,ri){if(ri==null)ri=o.r2?o.ri|0:0;const T=dsThemeOf(o,ri),R=DROOM[T.room],its=(ri&&o.r2?o.r2.items:o.items)||[],n=its.length,[lo,hi]=R.cnt;
  const off=its.filter(it=>dsFits(T,it.t,it.c)),miss=[],mustMiss=(R.must||[]).filter(g=>!its.some(it=>g.includes(it.t))).map(g=>g[0]);
  for(const g of T.need||[])if(!its.some(it=>g.includes(it.t)))miss.push(g[0]);
  if(T.plants&&its.filter(it=>DS_PLANTS.includes(it.t)).length<T.plants)miss.push('plants');
  if(R.toys&&its.filter(it=>DS_TOYS.includes(it.t)).length<R.toys)miss.push('toys');
  const slips=off.length+miss.length+2*mustMiss.length,vibe=!n?0:slips===0?1:slips===1?.5:0,amt=n<lo?'few':n>hi?'many':'ok',prob=dsNeat(its),neat=prob.length?-1:n>=lo?1:0;
  return{T,n,lo,hi,off,miss,mustMiss,vibe,amt,prob,neat,stars:clamp(vibe+(amt==='ok'?1:0)+neat,0,3)};}
const MISS_T={bed:"Wait… where's my bed? 😮",stove:'Where do I cook? I need a stove! 🍳',fridge:"Where's my fridge? 🧊",sofa:'Where do I sit? I need a sofa! 🛋️',
  fireplace:'It needs a warm light, like a lamp or a fireplace! 🔥',plants:'Where are all the plants? 🌿',toys:'Where are the toys? 🧸'};
function dsLines(s){const T=s.T,L=[],D=[],nm=t=>FURN[t].n.toLowerCase();
  if(s.vibe===1)L.push(T.good);
  else if(s.mustMiss.length)L.push(MISS_T[s.mustMiss[0]]||'Hmm, something big is missing…');
  else if(s.vibe===.5){if(s.off.length){const it=s.off[0],why=dsFits(T,it.t,it.c);L.push(why==='room'?`Hmm, a ${nm(it.t)} in my ${DROOM[T.room].n}? 😄 But I like the rest!`:`Hmm, the ${FAMN[famOf(it.c)]||''} ${nm(it.t)} doesn't really fit… but I like the rest!`);}
    else L.push((MISS_T[s.miss[0]]||'Hmm, something is missing…')+' But I like the rest!');}
  else L.push(s.off.length+s.miss.length<=2?"Hmm, some things don't really fit… 🤔":`Hmm… this doesn't feel like ${aN(T.n.toLowerCase())} at all. 🤔`);
  D.push(s.vibe);
  L.push(s.amt==='ok'?pick(['It feels just right! Not too much, not too little. 👌','The perfect amount of stuff! 👌']):s.amt==='few'?"Hmm, it's a bit empty…":"Whoa, it's so crowded in here! 😵");D.push(s.amt==='ok'?1:0);
  if(s.prob.length){const p=s.prob[0];L.push(p.k==='pile'?'Everything is squished in one corner…':p.k==='face'?`Oops, the ${nm(p.it.t)} is looking at the wall! 😂`:`Why is the ${nm(p.it.t)} in the middle of the room? 🤔`);D.push(-1);}
  else if(s.neat>0){L.push(pick(['And everything is so neat! ✨','So neat and tidy! ✨']));D.push(1);}
  return{L,D};}
const starsHalf=n=>`<span class="stars">${'★'.repeat(Math.floor(n))}${n%1?'<em>★</em>':''}<i>${'★'.repeat(3-Math.ceil(n))}</i></span>`;

/* the client's room */
let CLRET=null;const CLFLOORS={};
function dsRoomSetup(){const o=S.ds&&S.ds.o,L=LOC.client;if(!o||!L)return;const T=dsTheme(o),R=DROOM[T.room],H=HOUSE(o.h);
  CL_WALL.color.set(R.wall);if(!CLFLOORS[R.floor]){CLFLOORS[R.floor]=floorTex(R.floor);CLFLOORS[R.floor].repeat.set(CLW/2,CLD/2);}CL_FLOOR.map=CLFLOORS[R.floor];CL_FLOOR.needsUpdate=true;
  L.leafM.color.set(H.dc);L.panM.color.set(shade(H.dc,.12));L.hinge.rotation.y=0;if(L.rdoor){const ri=o.ri|0;L.rdoor.visible=!!o.r2;L.rdoor.material.map=L.rdoorTex[ri];L.rdoor.material.needsUpdate=true;L.rdoor.position.x=ri?CLW-.03:-CLW+.03;L.rdoor.rotation.y=ri?-Math.PI/2:Math.PI/2;}
  for(const u of[...CL_ITEMS.keys()])removeClItem(u);for(const it of dsItems())addClItem(it);}   /* (run 4 finish: each room its own furniture: room 2 showed room 1's) */
function addClItem(it){const L=LOC.client,F=FURN[it.t];if(!F)return null;const g=buildFurn(it.t,it.c||undefined);g.position.set(L.ox+it.x,0,L.oz+it.z);g.rotation.y=it.r*Math.PI/2;
  g.traverse(o=>{if(o.isMesh&&o.material!==OL){o.castShadow=true;o.receiveShadow=true;}if(o.userData&&o.userData.shade&&o.material)o.material.emissiveIntensity=.6;});g.userData.u=it.u;L.items.add(g);
  const rec={it,g,col:null};if(!F.flat&&!F.hang){const R=fpRect(it.t,it.x,it.z,it.r);rec.col={x1:L.ox+R.x1,z1:L.oz+R.z1,x2:L.ox+R.x2,z2:L.oz+R.z2};L.dcols.push(rec.col);}
  CL_ITEMS.set(it.u,rec);return rec;}
function removeClItem(u){const L=LOC.client,rec=CL_ITEMS.get(u);if(!rec)return;L.items.remove(rec.g);if(rec.col){const i=L.dcols.indexOf(rec.col);if(i>=0)L.dcols.splice(i,1);}CL_ITEMS.delete(u);}
function enterClient(){const o=S.ds&&S.ds.o;if(!o||CUT||fading)return;const from=CUR.id.startsWith('apt')?{loc:CUR.id,x:P.x,z:P.z,yaw:P.yaw}:{loc:'city',h:o.h};SFX.door();
  fade(()=>{CLRET=from;setLoc('client');dsRoomSetup();const L=LOC.client;P.x=L.ox;P.z=L.oz+CLD-1.2;P.yaw=0;P.pitch=-.15;P.sit=null;bringFollowers();decoStart();dcardUpd(true);jobHud(true);saveLocal();
});}
function exitClient(cb){if(DECO.on)decoEnd();const r=CLRET;SFX.door();
  fade(()=>{if(cb)cb();if(r&&r.loc!=='city'&&LOC[r.loc]){setLoc(r.loc);P.x=r.x;P.z=r.z;P.yaw=r.yaw+Math.PI;}
    else{setLoc('city');const H=HOUSE((r&&r.h)||(S.ds&&S.ds.o&&S.ds.o.h)||(S.ds&&S.ds.prevH)||'nb');P.x=H.x+Math.sin(H.ry)*1.7;P.z=H.z+Math.cos(H.ry)*1.7;P.yaw=H.ry+Math.PI;}
    P.pitch=0;P.sit=null;CLRET=null;bringFollowers();dcardUpd(true);jobHud(true);saveLocal();});}
function dsFinishAsk(){const o=S.ds&&S.ds.o;if(!o)return;const W=dsWho(o),two=!!o.r2,n1=o.items.length,n2=two?(o.r2.items||[]).length:0,ok=n1>0&&(!two||n2>0);
  const why=ok?'':!two?'The room is still empty! Tap 🛋️ Furniture and put some things in first.':!n1&&!n2?'Both rooms are still empty! Tap 🛋️ Furniture and put some things in each room.':!n2?'Room 2 is still empty! Go through the side door (Room 2 →) and put some things there too.':'Room 1 is still empty! Go back through the side door (← Room 1) and put some things there too.';
  openPanel(`<div class="who" style="--c:#b79cff">🎨 All done?</div><p class="line">${ok?`${esc(W.nm)} will come in and look at your ${two?'rooms':'room'}! 👀`:why}</p><div class="row">${ok?`<button class="btn mint" data-a="dsgo">🎉 Yes, call ${esc(W.nm)}!</button><button class="btn white" data-a="close">Not yet</button>`:'<button class="btn white" data-a="close">OK</button>'}</div>`,{bottom:true});}
ACT.dsgo=()=>{closePanel();revStart();};

/* 🎬 the client comes in, looks around, and gives you stars (seen through your own eyes) */
function rvStarsSet(v,fx){const el=$('rvStars');el.hidden=false;[...el.children].forEach((b,k)=>{const f=clamp(v-k,0,1),fg=b.querySelector('.fg'),w=Math.round(f*100)+'%';
  if(fg.style.width!==w){fg.style.width=w;if(fx==='pop'){b.classList.remove('spop');void b.offsetWidth;b.classList.add('spop');}}
  if(fx==='lose'){b.classList.remove('slose');void b.offsetWidth;b.classList.add('slose');}});}
function rvReset(){const el=$('rvStars');[...el.children].forEach(b=>{b.querySelector('.fg').style.width='0%';b.className='';});el.hidden=true;}
/* the client's look at one room: its score, its lines, the client back at the door */
function revRoom(C,ri){const L=LOC.client,s=dsScore(C.o,ri),{L:lines,D:del}=dsLines(s);C.room=ri;C.s=s;C.rooms[ri]=s;C.lines=lines;C.del=del;C.shown=0;C.run=0;C.hm=0;
  C.p.root.position.set(L.ox+.05,0,L.oz+CLD-.32);C.p.root.rotation.y=Math.PI;C.p.root.visible=false;rvReset();}
function revStart(){const d=ds(),o=d.o;if(!o||CUT)return;const L=LOC.client,W=dsWho(o);if(DECO.on)decoEnd();closePanel();
  const two=!!o.r2,p=makePerson(W.look);p.root.visible=false;scene.add(p.root);
  document.body.classList.add('cut');$('note').hidden=true;P.sit=null;rvReset();
  CUT={rev:1,t:0,stage:-1,shake:0,p,W,o,two,room:0,rooms:[],s:null,stars:0,lines:[],del:[],shown:0,run:0,next:0,vx:L.ox+1.0,vz:L.oz+CLD-1.55,from:{x:P.x,z:P.z}};
  const go=()=>{const C=CUT;if(!C||!C.rev)return;revRoom(C,0);C.from={x:P.x,z:P.z};C.t=0;C.stage=0;setTimeout(()=>{if(CUT&&CUT.rev){SFX.knock();popText('Knock knock! 🚪');}},350);};
  if(two&&(o.ri|0)!==0){SFX.door();fade(()=>{dsRoomShow(0);go();});}else go();}   /* 🚪 two rooms: the client always starts in room 1, even if you called from room 2 */
function revUpdate(dt){const C=CUT;if(C.stage<0||C.stage===4)return;const L=LOC.client,t=(C.t+=dt),sm=k=>k*k*(3-2*k),p=C.p,ease=1-Math.exp(-dt*5);
  for(const w of[...FRIEND_ACTORS,...PET_ACTORS])if(w.g&&w.loc==='client')w.g.visible=false;
  const k=sm(clamp(t/.8,0,1));P.x=lerp(C.from.x,C.vx,k);P.z=lerp(C.from.z,C.vz,k);P.moving=false;
  if(C.stage<3)L.hinge.rotation.y=1.7*sm(clamp((t-1.0)/.6,0,1));else L.hinge.rotation.y=1.7*(1-sm(clamp((t-C.t3-.6)/.6,0,1)));
  if(t>1.2&&C.stage<3)p.root.visible=true;
  const S0={x:L.ox+.02,z:L.oz+CLD-.32},S1={x:L.ox-.4,z:L.oz+CLD-1.45},w=sm(clamp((t-1.3)/1.4,0,1));
  if(C.stage<3){p.root.position.x=lerp(S0.x,S1.x,w);p.root.position.z=lerp(S0.z,S1.z,w);}
  else{const u=sm(clamp((t-C.t3-.15)/.6,0,1));p.root.position.x=lerp(S1.x,S0.x,u);p.root.position.z=lerp(S1.z,S0.z,u);if(u>=1)p.root.visible=false;}
  animPerson(p,dt,(t>1.3&&t<2.7)||(C.stage===3&&t-C.t3>.15&&t-C.t3<.75),.8);
  const face=C.stage===3?Math.atan2(S0.x-S1.x,S0.z-S1.z):t<2.7?Math.atan2(S1.x-S0.x,S1.z-S0.z):t<6.0?Math.PI:Math.atan2(P.x-p.root.position.x,P.z-p.root.position.z);
  p.root.rotation.y=angLerp(p.root.rotation.y,face,1-Math.exp(-dt*7));p.head.rotation.y=t>2.9&&t<6.0?Math.sin((t-2.9)*1.9)*.65:p.head.rotation.y*.85;
  const hd=new THREE.Vector3();p.head.getWorldPosition(hd);
  const look=(x,y,z)=>{const dx=x-P.x,dz=z-P.z;return{yaw:Math.atan2(-dx,-dz),pitch:Math.atan2(y-1.5,Math.hypot(dx,dz))};};
  const aim=t<1.35?look(L.ox,1.3,L.oz+CLD-.15):t<2.9?look(hd.x,hd.y-.1,hd.z):t<6.1?{yaw:lerp(1.1,-.8,sm(clamp((t-2.9)/3.1,0,1))),pitch:-.25}:look(hd.x,hd.y-.05,hd.z);
  P.yaw=angLerp(P.yaw,aim.yaw,t<2.9||t>6.1?ease:Math.min(1,ease*1.6));P.pitch=lerp(P.pitch,aim.pitch,ease);
  if(C.stage===0&&t>2.9&&!C.hm){C.hm=1;popText('Hmm… 🤔');SFX.talk();}
  if(C.stage===0&&t>=6.5){C.stage=1;C.next=t;}
  if(C.stage===1&&t>=C.next){if(C.shown<C.lines.length){const dd=C.del[C.shown];C.shown++;C.run+=dd;rvStarsSet(clamp(C.run,0,3),dd<0?'lose':dd>0?'pop':'');
      if(dd<0)SFX.no();else if(dd>0)SFX.pop();else SFX.talk();revShow();C.next=t+2.8;}
    else if(C.two&&C.room===0){C.stage=4;popText('Now the other room! 🚪');SFX.door();if(UI.open)closePanel();   /* 🚪 then room 2 */
      fade(()=>{const C=CUT;if(!C||!C.rev)return;dsRoomShow(1);revRoom(C,1);C.from={x:P.x,z:P.z};C.t=0;C.stage=0;});}
    else{C.stage=2;revPay();revShow();}}
  if(C.stage===3&&t-C.t3>1.25&&!C.out){C.out=1;exitClient(revEnd);}}
function revShow(){const C=CUT;if(!C||!C.rev)return;const W=C.W;
  let h=`<div class="who" style="--c:${W.look.top}">${esc(W.nm)}</div>${C.lines.slice(0,C.shown).map((x,i)=>`<p class="line rvl${i===C.shown-1&&C.stage<2?' new':''}">${esc(x)}</p>`).join('')}`;
  if(C.stage>=2)h+=`<p class="earn">${starsHalf(C.stars)}${C.two?`<br><small>Room 1 ${starsHalf(C.rooms[0].stars)} · Room 2 ${starsHalf(C.rooms[1].stars)}</small>`:''}<br>You got <b>${C.pay} 🪙</b>!</p><div class="row"><button class="btn mint" data-a="revbye">👋 Bye!</button></div>`;
  openPanel(h,{bottom:true,lock:true});}
function revPay(){const C=CUT,d=ds(),R=C.rooms.filter(Boolean),st=R.length>1?Math.round(R.reduce((a,s)=>a+s.stars,0)/R.length*2)/2:C.s.stars,pay=R.reduce((a,s)=>a+DS_PAY(s.stars),0);   /* 🚪 two rooms: the stars averaged (to halves), each room paid */
  C.pay=pay;C.stars=st;S.coins+=pay;d.done++;d.prevH=C.o.h;d.o=null;d.wait=rand(25,40);
  S.dsTotal=(S.dsTotal||0)+R.length;hardEvent('room',R.length);addMsg('cl','cl',`${st>=2.5?'🌟':st>=1.5?'😊':'🙂'} ${C.W.nm} gave you ${String(st).replace('.5','½')} ⭐ for the ${R.map(q=>q.T.n.toLowerCase()).join(' and the ')}. You got ${pay} 🪙!`,{q:1});
  bumpLevel('decor',R.length,true);change();jobHud(true);dcardUpd(true);SFX.coin();if(st>=2.5)setTimeout(()=>SFX.yay(),300);popText('+'+pay+' 🪙','coin');}
ACT.revbye=()=>{const C=CUT;if(!C||!C.rev||C.stage!==2)return;closePanel();C.stage=3;C.t3=C.t;C.p.wave=1.3;$('rvStars').hidden=true;};
function revEnd(){const C=CUT;if(!C||!C.rev)return;scene.remove(C.p.root);CUT=null;document.body.classList.remove('cut');$('rvStars').hidden=true;if(UI.open)closePanel();
  if(LOC.client)LOC.client.hinge.rotation.y=0;for(const u of[...CL_ITEMS.keys()])removeClItem(u);
  const d=ds();setTimeout(()=>toast(d.done>=DS_MAX?`🌟 That's ${DS_MAX} clients! Great job today! More clients tomorrow.`:'🎨 Nice work! A new client will message you soon.',3.6),500);}

/* 🏆 Pet Show — every Saturday in the park. Four pets take turns on stage, the judges hold up score cards,
   and the pet with the most points wins. The other pets can do great, okay, badly — or even fall out of the show!
   Pets and farm update, stage 5: the show stands in the book's Pet Show area (stage, podium beside it, judges' table at the other corner); every pet does
   its own kind's tricks (COZY_MOVES.TRICKS, 3 per kind, only the ones it knows; tricks learned by practice have a bigger gold zone); friends in the park get
   45 seconds to join and their pets take the town pets' places (4 a show, more: the next show right after), everyone watching the same show; the town pets'
   results come from the shared clock (no dice); the healthy-week ribbon gives +1 from Granny Daisy; top 3 counts for the animal license, which Sir Barkley
   hands over on the podium (rules-pet-show-friends, rules-tricks, rules-animal-license, story-barkley-license, screens-show-join, screens-license-card) */
const PS={sx:-36.3,sz:22,top:.56,lx:-33.6,lz:22,cam:[-30.6,22],rcam:[-31.2,17.2],out:[-30.3,21.4],
  jt:[-33.8,27.3,Math.atan2(-36.0+33.8,22-27.3)],   /* the judges' table: x, z, turned toward the stage */
  pad:[[-36.85,20.35],[-36.95,21.15],[-36.95,22.85],[-36.85,23.65]],
  pod:[[-36.0,16.9,.98],[-36.0,18.2,.68],[-36.0,15.6,.46]],   /* the podium's steps: 1st in the middle, 2nd, 3rd; x, z, top */
  you:[-35.85,17.12],bark:[-35.86,17.86]};   /* the license hand-over: you on step 1, Sir Barkley on step 2 (moves-show-license) */
const PSX={judges:[],rivals:[],on:false,rv:null,pick:null,dirty:false,gear:{}};
const PS_TR=[1,3,4,6,7,9,10];   /* trick points (0-6) → Sir Barkley's card (1-10) */
const PS_AIM=8,PS_JOIN=45,PS_V=2026110201;   /* a shared show: seconds to aim each trick; seconds friends get to join; the first build that shows friends' shows */
const PS_JUDGES=[
  {n:'Lady Fluffington',i:'👒',k:'style',love:'fancy outfits',look:{skin:'#ffe0c2',hair:'#f2d16b',style:'bun',top:'#ff9ec4',bottom:'#ffffff',shoes:'#ff7aa8',dress:true,hat:'flowers',eyes:'sparkle'},
    hi:['Darling, I ADORE pets in fancy outfits! 👒','Hats, bow ties, glasses, capes… the more the better!','Fill all 4 outfit spots and I give a 10! ✨'],
    say:['No outfit at all? Oh dear!','A little plain. Try a hat or a scarf!','Cute! Maybe add one more thing?','So stylish! 💕','MAGNIFICENT outfit, darling! 👒']},
  {n:'Sir Barkley',i:'🎩',k:'trick',love:'tricks',look:{skin:'#d9a06b',hair:'#1f1a2e',style:'short',top:'#3d4a7a',bottom:'#2e2347',shoes:'#2e2347',hat:'tophat',glasses:'glasses'},
    hi:['I judge the TRICKS! 🎩','Tap at just the right moment for a perfect trick!','Practise on your training gear: new tricks, and a bigger gold zone!'],
    say:['Oopsie! Better luck next time!','Practice makes perfect!','A nice try!','Great tricks! 👏','BRAVO! A true superstar! 🌟']},
  {n:'Granny Daisy',i:'🌼',k:'happy',love:'happy pets',look:{skin:'#f6d3bb',hair:'#d8d8e4',style:'bun',top:'#7fdcb5',bottom:'#9a6a43',shoes:'#3d2c5e',dress:true,glasses:'glasses'},
    hi:['I love a happy, loved pet! 🌼','Pet it, feed it and play with it before the show!','A green healthy-week ribbon? One more point from me! 💚'],
    say:['This poor pet needs some love!','A bit sad… give it cuddles!','Fairly happy. A treat would help!','What a happy pet! 😊','Such a happy, loved pet! 💗']}];
const PS_KIDS=['Mia','Leo','Ava','Noah','Lily','Max','Zoe','Finn','Ella','Sam','Ruby','Theo'];
const PS_FLOP={sleep:{e:'😴',say:['Oh dear, a nap on stage!','Zzz… that is not a trick!','Wake up, sleepyhead! 💤']},
  butterfly:{e:'🦋',say:['Come back, little one!','A butterfly?! Focus!','Oh my, it ran away! 🦋']}};
/* 🎩 tricks (rules-tricks): 3 per kind from the moves pack; a pet knows d.tr of them (1 at first); 5 practice days on its training gear (one counts a game day) teach the next */
const trList=k=>COZY_MOVES.TRICKS[k]||COZY_MOVES.TRICKS.dog;
const trLen=(k,id)=>COZY_MOVES.TRICK_LEN[COZY_MOVES.TRICK_KIND(k)+'.'+id]||COZY_MOVES.TT;
const trKnown=d=>clamp(d.tr|0||1,1,3);
const TR_GEAR={'train:dog':'dog','train:cat':'cat','train:bunny':'bunny','train:hamster':'hamster','train:capybara':'capy','train:owl':'owl','train:monkey':'monkey','train:seal':'seal','train:bear':'bear','train:snake':'snake'};
function trPractice(e){const d=e.d;if(d.sick||trKnown(d)>=3)return;if(d.tq===S.day)return;d.tq=S.day;d.tp=(d.tp|0)+1;   /* one practice day counts a game day; a sick pet can't practise (gearUse) */
  if(d.tp>=5){d.tr=trKnown(d)+1;d.tp=0;const t=trList(petKind(d))[d.tr-1];SFX.yay();setTimeout(()=>toast(`🎩 ${d.name} learned a new trick: ${t[1]}! Show it at the Pet Show on Saturday 🏆`,4.6),700);}
  else setTimeout(()=>toast(`🎩 Practice day ${d.tp} of 5: ${d.name} is learning ${trList(petKind(d))[trKnown(d)][1]}!`,3.6),700);}
function trLine(d){const L=trList(petKind(d)),n=trKnown(d);return L.map(([,nm],i)=>i<n?'✅ '+nm:i===n?`🔒 ${nm} (practice ${d.tp|0}/5)`:'🔒 '+nm).join(' · ');}
/* where a trick is done (the stage, or the lawn in front of it for a trick on gear) and how big its path is: measured once on a model of its kind */
const TRX={};
function trSpot(k,id){const key=COZY_MOVES.TRICK_KIND(k)+'.'+id;if(TRX[key])return TRX[key];const G=COZY_MOVES.trickGear(k,id);
  if(!G)return TRX[key]={x:PS.sx,y:PS.top+.03,z:PS.sz,ry:Math.PI/2,G:null};
  const m=makePet(k,PET_TYPES[k].cols[0]),v=new THREE.Vector3(),L=trLen(k,id);let x0=9,x1=-9,z0=9,z1=-9;
  for(let t=0;t<=L;t+=.1){COZY_MOVES.play(m,'trick',t,{kind:k,trick:id,gr:1,h:G.h,water:G.water});m.root.updateMatrixWorld(true);m.b.getWorldPosition(v);x0=Math.min(x0,v.x);x1=Math.max(x1,v.x);z0=Math.min(z0,v.z);z1=Math.max(z1,v.z);}
  m.root.traverse(o=>{if(o.isMesh)o.geometry.dispose();});
  return TRX[key]={x:PS.lx-(x0+x1)/2,y:G.y?-G.y:0,z:PS.lz-(z0+z1)/2,ry:0,G};}   /* gear tricks face along the lawn (+z), their path centred in front of the stage */
function trGear(sp){if(!sp.G||!TR_GEAR[sp.G.id])return null;const id=TR_GEAR[sp.G.id],G=sp.G,o=new THREE.Group(),g=new THREE.Group();GEAR_B[id](g);g.scale.setScalar(G.scale||1);
  g.position.set(G.x||0,G.y||0,G.z||0);g.rotation.y=G.rotY||0;o.add(g);o.position.set(sp.x,sp.y,sp.z);o.rotation.y=sp.ry;o.userData.m=g;scene.add(o);return o;}
function trGearOff(o){if(!o)return;scene.remove(o);o.traverse(q=>{if(q.isMesh)q.geometry.dispose();});}
function psTargetLabel(){if(!S)return'🏆 Pet Show';if(!isShowDay())return'🏆 Pet Show is on Saturday';if(showDone())return'🏆 See you next Saturday!';if(S.time<PS_ON)return`🏆 Pet Show starts at ${PS_ON}:00`;if(S.time>=PS_OFF)return'🏆 Pet Show is over for today';return'🏆 Enter the Pet Show!';}
function psScore(d){return{style:petStyle(d),happy:clamp(Math.round(d.happy/20),1,5)};}
function psScore10(d,pts){return{style:petStyle(d)*2,trick:PS_TR[clamp(pts|0,0,6)],happy:Math.min(10,clamp(Math.ceil(d.happy/10),1,10)+(petRib()?1:0))};}   /* 💚 the healthy-week ribbon: one more point from Granny Daisy */
const psSec=()=>gameMs()/1000;

function buildPetShow(){const [jx,jz,ja]=PS.jt,c=Math.cos(ja),s=Math.sin(ja);
  PS_JUDGES.forEach((J,i)=>{const p=makePerson(J.look);sitPose(p);bakePerson(p);const lx=i-1,lz=-.71;p.root.position.set(jx+lx*c+lz*s,.52-.62,jz-lx*s+lz*c);p.root.rotation.y=ja;p.root.visible=false;scene.add(p.root);   /* in the judges' table's chairs */
    const tg=label(J.i+' '+J.n,.2);tg.position.y=2.34+i*.26;p.root.add(tg);   /* (run 4, stage 3: the three judges' names at three heights, so they read from the square instead of piling up) */
    /* the score card is held in the judge's hand: it hangs off the arm and turns back upright every frame */
    const card=new THREE.Group();card.position.set(0,-.47,.03);card.visible=false;p.arms[1].add(card);box(card,.035,.44,.035,'#9a6a43',0,-.02,.0,{ol:false});
    const j={J,p,tg,card,cm:null,t:Math.random()*6,up:0};
    j.target={x:p.root.position.x+.6*s,z:p.root.position.z+.6*c,r:2.0,icon:'💬',label:'Talk to '+J.n,obj:p.root,act:()=>{p.wave=1.2;SFX.talk();toast(J.i+' '+J.n+': “'+pick(J.hi)+'”',3.8);}};
    PSX.judges.push(j);});}
/* today's three town pets (the same all day, so they're there before the show starts) */
function psRivals(){const r=seeded(S.day*53+7),pk=a=>a[Math.floor(r()*a.length)],wp=w=>{let x=r()*w.reduce((a,b)=>a+b[0],0);for(const [p,v] of w){x-=p;if(x<=0)return v;}return w[w.length-1][1];};
  const types=Object.keys(PET_TYPES).filter(k=>!PET_TYPES[k].big).sort(()=>r()-.5),kids=PS_KIDS.slice().sort(()=>r()-.5),out=[],used=new Set();   /* (big-needs pets left out: old versions draw the same rivals) */
  for(let i=0;i<3;i++){const t=types[i%types.length],T=PET_TYPES[t];let name=pk(T.names);for(let k=0;used.has(name)&&k<8;k++)name=pk(T.names);used.add(name);
    const o={},n=wp([[5,1],[20,2],[35,3],[40,4]]),slots=PSLOTS.map(x=>x[0]).sort(()=>r()-.5).slice(0,n);
    for(const sl of slots)o[sl]=pk(Object.keys(ACCS).filter(k=>ACCS[k].s===sl));
    out.push({type:t,col:pk(T.cols),name,owner:kids[i],outfit:o,style:2+2*n,happy:wp([[1,6],[2,7],[3,8],[3,9],[2,10]])});}
  return out;}
const psRot=i=>Math.PI/2+(i===0?-.35:i===3?.35:0);
function psRefresh(){if(CUT&&CUT.show){PSX.dirty=true;return;}PSX.dirty=false;for(const r of PSX.rivals)scene.remove(r.m.root);PSX.rivals=[];if(!S)return;PSX.rv=psRivals();
  PSX.rv.forEach((R,i)=>{const r=psModel(R);PSX.rivals.push(r);psHome(r,i);});}
function psModel(R){const m=makePet(R.type,R.col);addOutfit(m,{outfit:Object.assign({},R.outfit)});m.root.visible=false;scene.add(m.root);
  const tg=label(R.name,.2);tg.position.y=petTagY(R.type);m.root.add(tg);return{R,m,tg,busy:false};}
function psHome(r,i){const pd=PS.pad[i],m=r.m;m.root.position.set(pd[0],PS.top+.03,pd[1]);m.root.rotation.set(0,psRot(i),0);m.b.rotation.set(0,0,0);m.b.position.set(0,0,0);if(m.head)m.head.rotation.x=0;if(m.legs[0])m.legs[0].rotation.x=0;r.busy=false;}
function psDay(){psRefresh();if(S&&isShowDay())setTimeout(()=>{if(S&&PLAYING&&psLeft())toast(`🏆 It's Pet Show day! The show is in the park from ${clockStr(PS_ON)} to ${clockStr(PS_OFF)}. Dress up your pet!`,4.6);},4800);}
function psUpdate(dt){const on=!!(S&&CUR&&CUR.id==='city'&&(psOpen()||CUT&&CUT.show||UI.open&&PSX.pc&&UI.onClose===PSX.pc));PSX.on=on;
  const judging=!!(CUT&&CUT.show&&/^r?(jin|judge)$/.test(CUT.stage));
  for(const j of PSX.judges){const p=j.p,a=p.arms[1];p.root.visible=on&&!(PHO.on&&ptInShot(p.root.position.x,p.root.position.z));if(!on)continue;   /* (run 4 finish: they step out of a photo shoot like anyone else: two sat right beside the camera at the stage background) */j.t+=dt;j.tg.visible=!judging;
    if(!j.up)p.head.rotation.y=Math.sin(j.t*.45+j.J.n.length)*.3;else p.head.rotation.y*=.85;
    if(p.wave>0){p.wave-=dt;a.rotation.z=2.5+Math.sin(p.wave*14)*.35;}
    else if(j.up){const e=Math.min(1,dt*9);a.rotation.z=lerp(a.rotation.z,2.75,e);a.rotation.x=lerp(a.rotation.x,-.15,e);}
    else{a.rotation.z*=.85;a.rotation.x=lerp(a.rotation.x,-.55,Math.min(1,dt*6));}
    j.card.visible=!!j.up;if(j.up){const k=Math.min(1,j.up+=dt*3);j.card.scale.setScalar(.2+.8*(1-Math.pow(1-k,3)));j.card.rotation.set(-a.rotation.x,0,-a.rotation.z,'ZYX');}}
  const inShow=CUT&&CUT.show;if(inShow)for(const x of CUT.order)if(x.own&&!x.r.busy&&CUT.order[CUT.ri]!==x)animPet(x.r.m,dt,false);
  for(const r of PSX.rivals){r.m.root.visible=on&&!(inShow&&!CUT.order.some(x=>x.r===r));if(on&&!r.busy)animPet(r.m,dt,false);}   /* (in a show with friends the town pets not in it step off) */
  psmTick(dt);}
function psCard(j,v){psCardOff(j);const out=v==='✖',c=signPlane(out?'✖':String(v),.6,.46,'#ffffff',out?'#ff4d6d':'#3d2c5e');c.position.set(0,.66,.03);j.card.add(c);j.cm=c;j.up=.001;}
function psCardOff(j){if(!j.cm)return;j.card.remove(j.cm);j.cm.geometry.dispose();if(j.cm.material.map)j.cm.material.map.dispose();j.cm.material.dispose();j.cm=null;}
function psCardsDown(){for(const j of PSX.judges){j.up=0;j.card.visible=false;psCardOff(j);}}

/* the pets that can go on stage with you: following you, in town, near, not sick (🩺 no Pet Show while sick); the same order as your online pet list (one button each) */
function psMine(){return S.pets.filter(d=>!d.stay&&PET_TYPES[d.type]).slice(0,3).map(d=>PET_ACTORS.find(p=>p.d===d)).filter(p=>p&&p.loc==='city'&&Math.hypot(p.x-P.x,p.z-P.z)<18);}
function openShow(){if(!S)return;
  if(!isShowDay()){const n=daysToShow();SFX.talk();toast(`🏆 The Pet Show is every Saturday! Today is ${wdName()}, so it's in ${n} day${n>1?'s':''}. Get your pet ready!`,4.8);return;}
  if(showDone()){toast(`🏆 You already did today's show! Come back next Saturday.`,4);return;}
  if(S.time<PS_ON){SFX.talk();toast(`🏆 The Pet Show starts at ${PS_ON}:00! The judges are on their way. Dress up your pet! 🎀`,4.6);return;}
  if(S.time>=PS_OFF){SFX.talk();toast(`🏆 Today's Pet Show is over (${clockStr(PS_ON)} to ${clockStr(PS_OFF)}). The next one is next Saturday!`,4.6);return;}
  if(!S.pets.length){SFX.no();toast('You need a pet for the Pet Show! Adopt one at the 🐾 Pet Shop.',4);return;}
  const near=PET_ACTORS.filter(p=>p.loc==='city'&&Math.hypot(p.x-P.x,p.z-P.z)<18),here=near.filter(p=>!p.d.sick);   /* 🩺 no Pet Show while sick (stage 2) */
  if(!here.length){SFX.no();toast(near.length?`🩺 ${near[0].d.name} doesn't feel well. Get well at the vet first!`:'Bring a pet to the park! Tip: ⚙️ Settings → 🐾 Bring my pets to me',4.8);return;}
  const g=psOpenGather();if(g){psJoinCard(g);return;}   /* a friend's show is open: join it */
  if(PSM.g){psWaitCard();return;}
  if(PSX.dirty||!PSX.rivals.length)psRefresh();
  SFX.yay();PSX.pick=here;const rv=PSX.rv||[],fr=psFriendsHere().length;if(!PSX.pc)PSX.pc=()=>{};
  openPanel(`<div class="hd"><h2>🏆 Pet Show!</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    <div class="psj">${PS_JUDGES.map(J=>`<div><span>${J.i}</span><b>${J.n}</b><i>loves ${J.love}</i></div>`).join('')}</div>
    <p class="note">${fr?`👫 Friends in the park get ${PS_JOIN} seconds to join you! Free places go to today's town pets: `:'Today\'s other pets: '}${rv.map(R=>`${PET_TYPES[R.type].icon} <b>${esc(R.name)}</b> (${esc(R.owner)})`).join(', ')}. They practiced a lot! Can you beat them?</p>
    <p class="note">🥇 <b>200 🪙</b> + 🐾 Pets +2 levels · 🥈 80 🪙 · 🥉 40 🪙 · 🪪 top 3 counts for your animal license</p>
    <div class="pspick">${here.map((p,i)=>{const d=p.d,o=petOutfit(d),sc=psScore(d);return`<button class="pscard" data-a="psgo:${i}"><span class="pi">${PET_TYPES[petKind(d)].icon}</span><b>${esc(d.name)}</b>
      <span class="pso">${PSLOTS.map(([sl])=>o[sl]?ACCS[o[sl]].i:'').join('')||'no outfit yet'}</span><span>👒 ${starRow(sc.style)}</span><span>🌼 ${starRow(sc.happy)}${petRib()?' 💚':''}</span><span>🎩 ${trKnown(d)} trick${trKnown(d)>1?'s':''}</span><i>⭐ Pick ${esc(d.name)}!</i></button>`;}).join('')}</div>
    <p class="note">Tip: dress your pet in all 4 outfit spots, make it super happy, and hit the gold when you do tricks!</p>`,{onClose:PSX.pc});}
ACT.psgo=i=>{const p=PSX.pick&&PSX.pick[+i];if(!p||CUT)return;closePanel();if(psFriendsHere().length&&MP.me){psHost(p);return;}psStart(p);};

/* ---------- 👫 shows with friends (rules-pet-show-friends, screens-show-join). Online: presence ps = [t0, jt, pet, style, happy, tricks known, grades] while you are
   in a show (t0 = when the first player entered, on the one clock, seconds; jt = when you joined; pet = your place in your online pet list, -1 = just watching;
   grades = '0'..'2' per trick done). Everyone sorts the players the same way (by jt, then id), fills the 4 places in that order and runs the same timeline
   from t0 + 45 s; the town pets' results come from the one clock. An older version sends no ps and is never asked. ---------- */
const PSM={g:null,no:{},tk:-1};
function psFriendsHere(){if(!MP.peers)return[];return[...MP.peers.values()].filter(a=>a.loc==='city'&&(a.v|0)>=PS_V&&a.rx>-41&&a.rx<-8&&a.rz>8&&a.rz<41);}   /* friends in the park on a version that knows shared shows */
function psOpenGather(){if(!MP.peers||PSM.g||CUT)return null;const now=psSec();let best=null;
  for(const a of psFriendsHere()){const s=a.ps;if(!s||s[1]!==s[0]||now>=s[0]+PS_JOIN-2||now<s[0]-5)continue;if(!best||s[0]<best.t0)best={t0:s[0],host:a};}return best;}
function psStampMine(st){const g=PSM.g;if(!g){st.ps=null;return;}const d=g.p&&g.p.d;st.ps=d?[g.t0,g.jt,g.pi,g.sc.style,g.sc.happy,trKnown(d),g.gr||'']:[g.t0,g.jt,-1];}
function psExtra(a,pr){const s=pr.ps;a.ps=Array.isArray(s)&&s.length>=3&&s.slice(0,3).every(Number.isFinite)&&s.length<=7?s.map((v,i)=>i===6?String(v||'').replace(/[^012]/g,'').slice(0,3):v):null;}
function psHost(p){const t=Math.round(psSec());PSM.g={t0:t,jt:t,p,pi:psMine().indexOf(p),sc:psScore10(p.d,0),gr:''};if(PSM.g.pi<0){PSM.g=null;psStart(p);return;}SFX.yay();psWaitCard();}
function psJoinCard(g){const sec=Math.max(0,Math.ceil(g.t0+PS_JOIN-psSec())),mine=psMine();PSM.card=g.t0;
  openPanel(`<div class="hd"><h2>🏆 ${esc(g.host.nm||'A friend')} entered the Pet Show!</h2><span class="psn">⏱️ <b id="psCnt">${sec}</b> s</span></div>
    <p class="note">Join with a pet that follows you, or just watch. The show starts when the time is up.</p>
    <div class="row">${mine.map((p,i)=>`<button class="btn ${p.d.sick?'white':'butter'}" data-a="psjoin:${i}"${p.d.sick?' disabled':''}>${PET_TYPES[petKind(p.d)].icon} ${esc(p.d.name)}${p.d.sick?' 🩺':''}</button>`).join('')}
    <button class="btn sky" data-a="psjoin:w">👀 Just watch</button><button class="btn white" data-a="psno">No, thanks</button></div>`,{bottom:true,onClose:()=>{PSM.card=0;}});}
ACT.psjoin=k=>{const g=psOpenGather();if(!g){closePanel();toast('🏆 Too late, the show has started! Next Saturday 🐾',3);return;}PSM.no[g.t0]=1;
  if(k==='w'){PSM.g={t0:g.t0,jt:Math.round(psSec()),watch:1};closePanel();SFX.tap();psWaitCard();return;}
  if(showDone()){closePanel();toast(`🏆 You already did today's show! You can watch.`,3.4);return;}
  const p=psMine()[+k];if(!p||p.d.sick)return;PSM.g={t0:g.t0,jt:Math.round(psSec()),p,pi:+k,sc:psScore10(p.d,0),gr:''};closePanel();SFX.yay();psWaitCard();};
ACT.psno=()=>{if(PSM.card)PSM.no[PSM.card]=1;closePanel();};
/* the players of a show, sorted the same way on every screen: by when they joined, then by id */
function psPlayers(t0){const L=[];const g=PSM.g;
  if(g&&g.t0===t0&&g.p)L.push({me:1,jt:g.jt,id:MP.me||'',p:g.p,sc:g.sc,tk:trKnown(g.p.d),kind:petKind(g.p.d)});
  for(const a of psFriendsHere()){const s=a.ps;if(!s||s[0]!==t0||s[2]<0||s[1]>t0+PS_JOIN-1)continue;const q=a.pets&&a.pets.find(x=>x.i===s[2]);if(!q)continue;
    L.push({peer:a,t0,jt:s[1],id:a.peer,q,kind:q.kind,sc:{style:clamp(s[3]|0,2,10),trick:0,happy:clamp(s[4]|0,1,10)},tk:clamp(s[5]|0,1,3)});}
  return L.sort((x,y)=>x.jt-y.jt||(x.id<y.id?-1:x.id>y.id?1:0));}
function psWaitCard(){const g=PSM.g;if(!g||CUT)return;const sec=Math.max(0,Math.ceil(g.t0+PS_JOIN-psSec())),L=psPlayers(g.t0),me=L.findIndex(x=>x.me);
  const row=(x,i)=>x?`<div class="psrow on${x.me?' me':''}"><span class="pji">${PET_TYPES[x.kind].icon}</span><div><b>${esc(x.me?x.p.d.name:x.q.nm)}</b><i>${x.me?'You!':esc(x.peer.nm||'Friend')}</i></div><span class="pjs">${i+1}</span></div>`
    :`<div class="psrow"><span class="pji">🐾</span><div><b>Free place</b><i>a town pet</i></div><span class="pjs">${i+1}</span></div>`;
  const first=L.slice(0,4),rest=L.slice(4);
  openPanel(`<div class="hd"><h2>🏆 The Pet Show starts in <b id="psCnt">${sec}</b> s</h2></div>
    <p class="note">${g.watch?'👀 You are watching. ':''}Friends in the park can join now. Free places get town pets.</p>${[0,1,2,3].map(i=>row(first[i],i)).join('')}
    ${rest.length?`<p class="note">⏭️ Next show, right after: ${rest.map(x=>esc(x.me?'you':x.peer.nm||'Friend')).join(', ')}${me>=4?' (you!)':''}</p>`:''}`,{bottom:true,lock:true,cls:'psc'});}
/* every frame: the join card for friends in the park, the countdown, and the start of a shared show */
function psmTick(dt){if(!S||!MP.peers)return;const now=psSec(),g=PSM.g;
  if(g&&!CUT){const left=g.t0+PS_JOIN-now,el=$('psCnt');if(el)el.textContent=Math.max(0,Math.ceil(left));
    if(Math.ceil(left)!==PSM.tk){PSM.tk=Math.ceil(left);if(left<=5&&left>0)SFX.tick();if(UI.open&&$('card').classList.contains('psc')&&!(left<=0))psWaitCard();}
    if(left<=0){if(UI.open)closePanel();psGroupStart();}
    else if(CUR.id!=='city'||(g.p&&g.p.d.sick)){PSM.g=null;if(UI.open&&$('card').classList.contains('psc'))closePanel();toast('🏆 You left the Pet Show.',2.6);}
    return;}
  if(CUT||showDone()&&!psOpenGather())return;const o=psOpenGather();
  if(o&&!PSM.no[o.t0]&&!UI.open&&!PSM.card&&CUR&&CUR.id==='city'&&P.x>-41&&P.x<-8&&P.z>8&&P.z<41){psJoinCard(o);return;}
  if(PSM.card){const el=$('psCnt');if(el&&o)el.textContent=Math.max(0,Math.ceil(o.t0+PS_JOIN-now));if(!o&&UI.open&&$('card').querySelector('[data-a^="psjoin"]')){closePanel();PSM.card=0;}
    if(o&&Math.ceil(o.t0+PS_JOIN-now)!==PSM.tk){PSM.tk=Math.ceil(o.t0+PS_JOIN-now);if(PSM.tk<=5&&PSM.tk>0)SFX.tick();}}}
/* the shared show starts: my group of 4 (the first 4 players, or the next show right after), town pets in the free places, one timeline from the one clock */
function psGroupStart(){const g=PSM.g,L=psPlayers(g.t0),me=L.findIndex(x=>x.me),ts=g.t0+PS_JOIN;
  if(L.length<1&&g.watch){PSM.g=null;toast('🏆 Nobody is in the show after all.',3);return;}
  const mine=me<0?0:Math.floor(me/4),plans=psGroups(L,ts);
  g.plans=plans;g.gi=0;g.mine=g.watch?-1:mine;psShow(plans[0],g.watch||mine!==0?null:L[me].p);}
/* 4 a show: the first 4 players, the next 4 in the show right after (its start = the end of the one before, on the one clock) */
function psGroups(L,ts){const groups=[];for(let i=0;i<L.length;i+=4)groups.push(L.slice(i,i+4));if(!groups.length)groups.push([]);
  let t=ts;return groups.map(G=>{const o=psOrder(G,Math.round(t));const len=psLen(o);const r={o,ts:t,len};t+=len;return r;});}
/* the order: town pets first (in the free places), then the players in their sorted order */
function psOrder(G,seed){if(PSX.dirty||!PSX.rivals.length)psRefresh();const n=4-G.length,o=[];
  for(let i=0;i<n;i++)o.push(psPlan(PSX.rivals[i],i,seed));
  for(const x of G)o.push(x.me?{you:1,kind:x.kind,tk:x.tk,tr:psTrs(x.kind,x.tk)}:psPeerEntry(x));
  return o;}
function psPeerEntry(x){const R={type:x.kind,col:x.q.col,name:x.q.nm,owner:x.peer.nm||'Friend',outfit:{}};for(const k of String(x.q.of||'').split('.').slice(0,4))if(mpOwn(ACCS,k))R.outfit[ACCS[k].s]=k;
  const r=psModel(R);return{peer:x.peer,t0:x.t0,R,r,kind:x.kind,tk:x.tk,sc:x.sc,g:[],tr:psTrs(x.kind,x.tk),done:false,out:false,own:1};}
/* a friend's taps so far (from their ps); a trick that timed out here stays an oopsie */
function psPeerG(x){const s=x.peer.ps;if(!s||s[0]!==x.t0)return;const g=String(s[6]||'');for(let i=0;i<g.length&&i<3;i++)if(x.g[i]==null)x.g[i]=+g[i];}
/* the 3 tricks of a show: the known ones in turn (1 known: three times) */
function psTrs(kind,tk){const L=trList(kind);return[0,1,2].map(i=>L[i%tk]);}
const PS_MV=.9,PS_RES=2.2+2*2.4+1.4+2.0+6;
/* the longest a turn can take (a shared show's timeline: each turn starts at its time on the one clock, a short turn waits) */
function psTurnLen(x){if(x.you||x.peer)return 1.7+x.tr.reduce((s,[id])=>s+2*PS_MV+PS_AIM+trLen(x.kind,id),0)+1.2+3*1.4+1.4+1.6+1;
  return 1.7+(x.out?6.3:x.tr.reduce((s,[id])=>s+2*PS_MV+trLen(x.kind,id),0))+1.1+3*1.15+1.4+1.6+1;}
function psLen(o){return 3.4+o.reduce((s,x)=>s+psTurnLen(x),0)+PS_RES;}

/* how each town pet will do today: great, good, medium, bad — or out of the show. From the one clock (seed = the show's start), never dice: everyone sees the same */
function psPlan(r,i,seed){const q=seeded((seed|0)*7+i*131+17);let x=q()*100,form='good';for(const [p,v] of [[22,'great'],[28,'good'],[24,'medium'],[16,'bad'],[10,'out']]){x-=p;if(x<=0){form=v;break;}}
  const R=r.R,o={r,i,R,form,done:false,out:form==='out',kind:R.type,npc:1};
  if(o.out){o.flop=q()<.5?'sleep':'butterfly';o.tr=[];return o;}
  const pk=a=>a[Math.floor(q()*a.length)],pts=pk({great:[6,6,5],good:[5,4,4],medium:[3,4,2],bad:[1,0,2]}[form]),g=[0,0,0];let left=pts;
  while(left>0){const k=Math.floor(q()*3);if(g[k]<2){g[k]++;left--;}}
  o.g=g;o.tr=psTrs(R.type,1+Math.floor(q()*3));o.sc={style:R.style,trick:PS_TR[pts],happy:R.happy};o.tot=o.sc.style+o.sc.trick+o.sc.happy;return o;}
function psStart(p){const t=Math.round(psSec());if(PSX.dirty||!PSX.rivals.length)psRefresh();
  psShow({o:PSX.rivals.map((r,i)=>psPlan(r,i,t)).concat([{you:1,kind:petKind(p.d),tk:trKnown(p.d)}]),ts:null},p);}
/* one show: p = your pet on stage (null: you watch). plan.ts = the shared start (null: alone, the show runs at your pace and you can skip) */
function psShow(plan,p){if(P.ride)stopRide();if(document.fonts)for(const f of['25px "Alfa Slab One"','800 20px "Roboto Slab"','700 20px "Roboto Slab"'])document.fonts.load(f).catch(()=>{});   /* (the license card's fonts, ready before Sir Barkley draws it) */
  P.sit=null;document.body.classList.add('cut');$('note').hidden=true;
  const order=plan.o,me=order.findIndex(x=>x.you);let d=null;
  if(p){d=p.d;p.ps=true;p.moving=false;p.tag.visible=false;const x=order[me];x.tr=psTrs(petKind(d),trKnown(d));x.done=false;x.out=false;}
  for(const x of order)if(x.own)x.r.m.root.visible=true;
  CUT={show:1,t:0,shake:0,p,d,stage:'intro',st:0,round:0,pts:0,res:[],tr:me>=0?order[me].tr:[],from:{x:P.x,z:P.z,yaw:P.yaw,pitch:P.pitch},px:p?p.x:PS.out[0],pz:p?p.z:PS.out[1],jn:-1,order,ri:-1,me,ts:plan.ts,len:plan.len||0,plan};
  for(let i=0;i<order.length;i++){const x=order[i];if(x.own)psHome(x.r,i);else if(x.npc&&x.i!==i)psHome(x.r,i);}
  SFX.yay();popText('🏆 Pet Show!');psPanel('intro');}
function psGo(stage){CUT.stage=stage;CUT.st=CUT.t;}
const psNm=x=>x.you?CUT.d.name:x.R.name,psOwner=x=>x.you?'Your pet!':x.peer?'⭐ '+esc(x.R.owner)+'\'s '+PET_TYPES[x.kind].name:esc(x.R.owner)+'\'s '+PET_TYPES[x.kind].name;
function psBoard(){const C=CUT;return C.order.map((x,i)=>{const me=!!x.you,ic=PET_TYPES[x.kind].icon,cur=i===C.ri&&!x.done;
  const sc=x.done?(x.out?'😴 Out':x.tot+' ⭐'):cur?'🎤':'…';
  return`<div class="psrow on${me?' me':''}${cur?' cur':''}"><span class="pji">${ic}</span><div><b>${esc(psNm(x))}</b><i>${psOwner(x)}</i></div><span class="pjs">${sc}</span></div>`;}).join('');}
function psPanel(kind){const C=CUT,n=C.order.length;let h;const x=C.order[C.ri];
  if(kind==='intro')h=`<div class="hd"><h2>🎤 Welcome to the Pet Show!</h2></div><p class="note">4 pets, 3 judges, 1 winner! ${C.me===n-1&&C.order.filter(x=>x.npc).length===n-1?'The other pets go first. Watch how they do!':'The town pets go first, then the players.'}</p>${psBoard()}`;
  else if(kind==='rival')h=`<div class="hd"><h2>${PET_TYPES[x.kind].icon} ${esc(psNm(x))}'s turn!</h2><span class="psn">Pet ${C.ri+1} of ${n}</span></div>${psBoard()}`;
  else h=`<div class="hd"><h2>⭐ Your turn, ${esc(C.d.name)}!</h2><span class="psn">Pet ${C.ri+1} of ${n}</span></div><p class="note">The score to beat: <b>${Math.max(0,...C.order.filter(x=>!x.you&&x.done&&!x.out).map(x=>x.tot))} ⭐</b></p>${psBoard()}`;
  const skip=kind!=='you'&&C.ts==null&&C.me>=0&&C.ri<C.me;
  openPanel(h+(skip?`<div class="row"><button class="btn white" data-a="psskip">⏩ Skip to my turn</button></div>`:''),{bottom:true,lock:true,cls:'psc'});}
/* the next turn: alone, at once; in a shared show at its time on the one clock (everyone's turns line up) */
function psTurnAt(i){const C=CUT;if(C.ts==null)return 0;let t=C.ts+3.4;for(let k=0;k<i;k++)t+=psTurnLen(C.order[k]);return t;}
function psNext(){const C=CUT;const i=C.ri+1;if(C.ts!=null&&psSec()<psTurnAt(i)-.05){psGo('wait');C.wi=i;return;}psBegin(i);}
function psBegin(i){const C=CUT;C.ri=i;for(const f of FLOATS)f.t=f.life;popDrop();   /* (picture pass 2: and big words still waiting, so a skipped turn's name never pops up over the next one) */   /* the last pet's words above the stage go before the next name pops up (picture pass: 'PERFECT!' sat on 'Bean!') */
  if(i>=C.order.length){psResultsAt();return;}const x=C.order[i];
  if(x.you){psToYou();return;}x.r.busy=true;x.k=0;psGo('rin');psPanel('rival');popText(PET_TYPES[x.kind].icon+' '+psNm(x)+'!');const snd=SFX[PET_TYPES[x.kind].snd];if(snd)snd();}
function psToYou(){const C=CUT,g=C.p.g;C.ix=g.position.x;C.iy=g.position.y;C.iz=g.position.z;C.round=0;C.pts=0;C.res=[];psGo('in');psPanel('you');popText('⭐ Your turn!');}
ACT.psskip=()=>{const C=CUT;if(!C||!C.show||C.ts!=null||C.me<0||C.ri>=C.me||!/^(intro|r|wait)/.test(C.stage))return;
  for(let i=Math.max(0,C.ri);i<C.me;i++){const x=C.order[i];x.done=true;psHome(x.r,i);if(x.bf){scene.remove(x.bf);x.bf=null;}}
  trGearOff(C.gearO);C.gearO=null;psCardsDown();SFX.tap();C.ri=C.me;psToYou();};
function psJudgePanel(){const C=CUT,x=C.order[C.ri],nm=psNm(x),on=/judge$/.test(C.stage);
  const rows=PS_JUDGES.map((J,i)=>{const shown=on&&i<=C.jn,v=x.out?'✖':x.sc[J.k],line=x.out?PS_FLOP[x.flop].say[i]:J.say[Math.ceil(v/2)-1];
    return`<div class="psrow${shown?' on':''}"><span class="pji">${J.i}</span><div><b>${J.n}</b><i>${shown?esc(line):'…'}</i></div><span class="pjs">${shown?(x.out?'✖':v+'/10'):''}</span></div>`;}).join('');
  openPanel(`<div class="hd"><h2>⭐ The judges score ${esc(nm)}…</h2></div>${rows}${on&&C.jn>=2?`<p class="earn">${x.out?PS_FLOP[x.flop].e+' Out of the show!':'Total: <b>'+x.tot+' ⭐</b>'}</p>`:''}`,{bottom:true,lock:true,cls:'psc'});}
const psLook=(x,y,z)=>{const dx=x-P.x,dz=z-P.z;return{yaw:Math.atan2(-dx,-dz),pitch:Math.atan2(y-1.5,Math.hypot(dx,dz))};};
function psCamTo(x,z,ax,ay,az,dt,sp){const e=1-Math.exp(-dt*(sp||4));P.x=lerp(P.x,x,e);P.z=lerp(P.z,z,e);const a=psLook(ax,ay,az);P.yaw=angLerp(P.yaw,a.yaw,e);P.pitch=lerp(P.pitch,a.pitch,e);P.moving=false;}
function psPose(g,m,x,y,z,ry){g.visible=true;g.position.set(x,y,z);g.rotation.set(0,ry,0);m.b.rotation.set(0,0,0);m.b.position.set(0,0,0);}
function psPetPose(p,x,y,z,ry){psPose(p.g,p.m,x,y,z,ry);p.x=x;p.z=z;}
function psButterfly(){const g=new THREE.Group();for(const s of[-1,1]){const w=new THREE.Group();g.add(w);sph(w,.075,s<0?'#ff9ec4':'#ff7aa8',s*.075,0,0,{s:[1,.15,.75],ws:8,hs:5,ol:.006});sph(w,.048,'#ffd45c',s*.085,0,-.065,{s:[1,.15,.8],ws:6,hs:4,ol:false});}
  box(g,.022,.022,.11,'#3d2c5e',0,-.011,0,{ol:false});return g;}
function psBfly(u){const cx=PS.sx,cz=PS.sz;if(u<2.4){const a=u*2.4+Math.PI;return[cx+.85*Math.cos(a),.95+.15*Math.sin(u*5),cz+.85*Math.sin(a)];}
  const s=u-2.4,a0=2.4*2.4+Math.PI,sx=cx+.85*Math.cos(a0),sz=cz+.85*Math.sin(a0);
  if(s<2.0){const k=s/2;return[lerp(sx,-32.9,k),.9+.25*Math.sin(s*4),lerp(sz,23.9,k)+Math.sin(s*3)*.5];}
  const k=s-2;return[-32.9+k*.6,.9+k*1.6,23.9+k*.9];}
/* "out of the show": a nap on stage, or chasing a butterfly off into the park */
function psFlop(x,u,dt){const g=x.r.m.root,m=x.r.m,BY=PS.top+.03,F=Math.PI/2;
  if(x.flop==='sleep'){psPose(g,m,PS.sx,BY,PS.sz,F);
    if(u<1.3){animPet(m,dt,false);if(!x.y1&&u>.5){x.y1=1;floatText('🥱',PS.sx,1.2,PS.sz,{h:.45});}}
    else{const k=clamp((u-1.3)/.7,0,1),e=k*k*(3-2*k);m.b.rotation.z=e*1.35;m.b.position.set(e*.1,e*.04,0);
      if(!x.y2){x.y2=1;popText('😴 '+x.R.name+' fell asleep!');SFX.tap();}
      if(!x.zt||u-x.zt>.7){x.zt=u;floatText('💤',PS.sx+rand(-.1,.2),.95+rand(0,.25),PS.sz+rand(-.25,.25),{h:.42});}}
    return;}
  if(!x.bf&&u<5.5){x.bf=psButterfly();scene.add(x.bf);popText('🦋 Oh no! '+x.R.name+' sees a butterfly!');}
  if(x.bf){const bp=psBfly(u),f=x.bf;f.rotation.y=Math.atan2(bp[0]-f.position.x,bp[2]-f.position.z+1e-6);f.position.set(bp[0],bp[1],bp[2]);
    f.children[0].rotation.z=.5+Math.sin(u*28)*.6;f.children[1].rotation.z=-.5-Math.sin(u*28)*.6;if(bp[1]>3.2){scene.remove(f);x.bf=null;}}
  let q;if(u<4.6)q=psBfly(Math.max(0,u-.55));else{const k=clamp((u-4.6)/1.4,0,1),e=k*k*(3-2*k),a=x.ret||(x.ret=[g.position.x,g.position.z]);q=[lerp(a[0],PS.sx,e),0,lerp(a[1],PS.sz,e)];}
  const px=g.position.x,pz=g.position.z,mv=Math.hypot(q[0]-px,q[2]-pz),gy=lerp(BY,0,clamp((q[0]+35.5)/.4,0,1));
  psPose(g,m,q[0],gy+(mv>.004?Math.abs(Math.sin(u*14))*.05:0),q[2],mv>.004?Math.atan2(q[0]-px,q[2]-pz):g.rotation.y);animPet(m,dt,mv>.004);}
function psTags(){const pr=POPQ.el&&POPQ.el.getBoundingClientRect(),v=new THREE.Vector3(),W=innerWidth,H=innerHeight;
  for(const r of PSX.rivals.concat(CUT.order.filter(x=>x.own).map(x=>x.r))){let on=true;if(pr&&r.m.root.visible){r.tg.getWorldPosition(v);v.project(camera);const x=(v.x+1)/2*W,y=(1-v.y)/2*H;on=v.z>1||x<pr.left-50||x>pr.right+50||y<pr.top-30||y>pr.bottom+30;}if(r.tg.visible!==on)r.tg.visible=on;}}
/* a trick, one frame: g/m the pet, at its spot (the stage, or the lawn with its gear); u = seconds since it started */
function psTrick(g,m,kind,id,gr,u,C,x){const sp=trSpot(kind,id);psPose(g,m,sp.x,sp.y,sp.z,sp.ry);
  if(sp.G&&!C.gearO)C.gearO=trGear(sp);
  const r=COZY_MOVES.play(m,'trick',u,{kind,trick:id,gr,h:sp.G&&sp.G.h,water:sp.G&&sp.G.water});
  const bl=C.gearO&&C.gearO.userData.m.userData.ball;if(bl&&r.ball){const w=m.root.localToWorld(new THREE.Vector3(r.ball.x??r.ball[0],r.ball.y??r.ball[1],r.ball.z??r.ball[2]));bl.parent.worldToLocal(w);bl.position.copy(w);}
  if(id==='highFive'&&gr&&x&&!x.hf&&u>1.9){x.hf=1;floatText('🙌',sp.x+.3,1.45,sp.z,{h:.55});}
  return r;}
/* hop from one place to another (from the pad to a trick's spot and back) */
function psHop(g,m,a,b,k,dt,ry){const e=k*k*(3-2*k);psPose(g,m,lerp(a[0],b[0],e),lerp(a[1],b[1],e)+Math.sin(Math.PI*k)*.45,lerp(a[2],b[2],e),ry);animPet(m,dt,k<1);}
function psCut(dt){psTags();const C=CUT,p=C.p,t=(C.t+=dt),u=t-C.st,sm=k=>k*k*(3-2*k),BY=PS.top+.03,FACE=Math.PI/2,me=C.me>=0?C.order[C.me]:null;
  for(const w of PET_ACTORS)if(w!==p&&w.loc==='city')w.g.visible=false;for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.g.visible=false;   /* 🐾 your other pets and friends watch from out of sight, so the show stays clear */
  for(const w of [...WALKERS,...FRIEND_ACTORS])if(w.g.visible&&Math.abs(w.x-PS.sx-3)<9&&Math.abs(w.z-PS.sz)<9)w.g.visible=false;   /* 🚶 and people walking past the stage don't step into the pictures */
  for(const x of C.order)if(x.peer&&x.peer.pets)for(const q of x.peer.pets)q.g.visible=false;   /* 👫 a friend's pet is on the stage, not at their heels */
  const spot=C.spot||[PS.sx,PS.sz],lawn=spot[0]>PS.sx+1,showCam=()=>psCamTo(lawn?spot[0]+3.4:-32.9,lawn?spot[1]+.4:PS.sz+(spot[1]-PS.sz)*.5+.6,spot[0],lawn?.3:.6,spot[1],dt,3.2);   /* (close to the stage, a step further back for a trick on gear in front of it) */
  const [jx,jz,ja]=PS.jt,judgeCam=()=>psCamTo(jx+3.3*Math.sin(ja),jz+3.3*Math.cos(ja),jx-.7*Math.sin(ja),.95,jz-.7*Math.cos(ja),dt,3.4);
  const padOf=i=>[PS.pad[i][0],BY,PS.pad[i][1]];
  const youWait=()=>{if(!p||C.ri===C.me)return;const pd=PS.pad[C.me];psPetPose(p,pd[0],BY,pd[1],psRot(C.me));animPet(p.m,dt,false);};
  if(C.stage==='intro'){showCam();if(p){const k=sm(clamp(u/1.7,0,1)),pd=PS.pad[C.me];psPetPose(p,lerp(C.px,pd[0],k),lerp(0,BY,k)+Math.sin(Math.PI*k)*.9,lerp(C.pz,pd[1],k),k<.85?Math.atan2(pd[0]-C.px,pd[1]-C.pz):psRot(C.me));animPet(p.m,dt,k<1);
      if(u>=1.8&&!C.hi){C.hi=1;const snd=SFX[PET_TYPES[petKind(C.d)].snd];if(snd)snd();}}
    if(u>=3.4)psNext();return;}
  if(C.stage==='wait'){showCam();youWait();if(psSec()>=psTurnAt(C.wi)-.05)psBegin(C.wi);return;}
  const x=C.order[C.ri];
  if(x&&!x.you&&C.ri<C.order.length){youWait();const r=x.r,g=r.m.root,rm=r.m,pd=padOf(C.ri),kind=x.kind;
    const tr=()=>x.tr[x.k],sp=()=>trSpot(kind,tr()[0]),at=s=>[s.x,s.y,s.z];
    if(C.stage==='rin'){C.spot=[PS.sx,PS.sz];showCam();if(x.out){const k=sm(clamp(u/1.5,0,1));psHop(g,rm,pd,[PS.sx,BY,PS.sz],k,dt,FACE);if(u>=1.7)psGo('rflop');return;}
      const s=sp();C.spot=[s.x,s.z];const k=clamp(u/PS_MV,0,1);psHop(g,rm,pd,at(s),k,dt,k<.9?Math.atan2(s.x-pd[0],s.z-pd[2]):s.ry);
      if(u>=PS_MV){x.fb=0;x.hf=0;x.s0=null;psGo('rtr');}return;}
    if(C.stage==='rtr'){showCam();if(x.peer)psPeerG(x);let gr=x.g[x.k];
      if(!x.npc&&gr==null){const s=sp();psPose(g,rm,s.x,s.y,s.z,s.ry);animPet(rm,dt,false);if(!x.wt)x.wt=C.t;if(C.t-x.wt<PS_AIM+3)return;gr=x.g[x.k]=0;}   /* 👫 a friend's trick waits for their tap (or their time runs out) */
      x.wt=null;if(x.s0==null){x.s0=C.t;floatText('🎩 '+tr()[1]+'!',C.spot[0],1.55,C.spot[1],{h:.42,top:1});}const v=C.t-x.s0;
      psTrick(g,rm,kind,tr()[0],gr,v,C,x);
      if(!x.fb&&v>.9){x.fb=1;floatText(['🙈 Oops!','⭐ Good!','🌟 PERFECT!'][gr],C.spot[0],1.3,C.spot[1],{h:.42,top:1});gr===2?SFX.whee():gr===1?SFX.pop():SFX.tap();}
      if(v>=trLen(kind,tr()[0])){const s=sp();x.bx=[s.x,s.y,s.z];trGearOff(C.gearO);C.gearO=null;x.fb=0;x.hf=0;x.s0=null;
        if(x.k<2){const n=trSpot(kind,x.tr[x.k+1][0]);x.k++;if(n.x!==s.x||n.z!==s.z||n.ry!==s.ry){x.mv0=x.bx;psGo('rmv');}else psGo('rtr');}else psGo('rback0');}
      return;}
    if(C.stage==='rmv'){showCam();const s=sp(),k=clamp(u/PS_MV,0,1);C.spot=[s.x,s.z];psHop(g,rm,x.mv0,at(s),k,dt,s.ry);if(u>=PS_MV)psGo('rtr');return;}
    if(C.stage==='rback0'){showCam();const k=clamp(u/PS_MV,0,1),c=[PS.sx,BY,PS.sz];psHop(g,rm,x.bx,c,k,dt,FACE);if(u>=PS_MV){C.spot=[PS.sx,PS.sz];psScorePeer(x);psGo('rjin');}return;}
    if(C.stage==='rflop'){showCam();psFlop(x,u,dt);if(u>=(x.flop==='sleep'?4.4:6.3))psGo('rjin');return;}
    if(C.stage==='rjin'){judgeCam();if(x.flop!=='sleep')psPose(g,rm,PS.sx,BY,PS.sz,FACE);if(u>1.1){psGo('rjudge');C.jn=-1;psJudgePanel();}return;}
    if(C.stage==='rjudge'){judgeCam();const n=Math.floor(u/1.15);
      if(n>C.jn&&n<3){C.jn=n;const j=PSX.judges[n],v=x.out?'✖':x.sc[j.J.k];psCard(j,v);if(x.out)SFX.no();else if(v>=8)SFX.yay();else SFX.pop();psJudgePanel();}
      if(u>3*1.15+1.4){psCardsDown();x.done=true;x.bx=[g.position.x,g.position.y,g.position.z];psGo('rback');psPanel('rival');}return;}
    if(C.stage==='rback'){showCam();const k=sm(clamp(u/1.4,0,1));psHop(g,rm,x.bx,pd,k,dt,k<.9?Math.atan2(pd[0]-x.bx[0],pd[2]-x.bx[2]):psRot(C.ri));
      if(u>=1.5){psHome(r,C.ri);psNext();}return;}
    return;}
  const m=p&&p.m;
  if(C.stage==='in'){C.spot=[PS.sx,PS.sz];showCam();const k=sm(clamp(u/1.4,0,1));psPetPose(p,lerp(C.ix,PS.sx,k),lerp(C.iy,BY,k)+Math.abs(Math.sin(k*Math.PI*2))*.12,lerp(C.iz,PS.sz,k),k<.85?Math.atan2(PS.sx-C.ix,PS.sz-C.iz):FACE);animPet(m,dt,k<1);
    if(u>=1.6){C.round=0;C.pos=[PS.sx,BY,PS.sz];psGo('mv');}return;}
  if(C.stage==='mv'){const s=trSpot(petKind(C.d),C.tr[C.round][0]),k=clamp(u/PS_MV,0,1);C.spot=[s.x,s.z];showCam();psHop(p.g,m,C.pos,[s.x,s.y,s.z],k,dt,s.ry);p.x=p.g.position.x;p.z=p.g.position.z;
    if(u>=PS_MV){psGo('aim');psAim();}return;}
  if(C.stage==='aim'||C.stage==='trick'){showCam();const kind=petKind(C.d),[id]=C.tr[C.round],s=trSpot(kind,id);
    if(C.stage==='aim'){psPetPose(p,s.x,s.y,s.z,s.ry);animPet(m,dt,false);const el=$('psMark');if(el)el.style.left=(psPos()*100).toFixed(1)+'%';
      if(C.ts!=null&&u>=PS_AIM)psTapped(0);   /* in a shared show the time to aim runs out (the others are waiting): an oopsie */
      return;}
    psTrick(p.g,m,kind,id,C.res[C.round],u,C,C);p.x=s.x;p.z=s.z;
    if(u>=trLen(kind,id)){C.hf=0;trGearOff(C.gearO);C.gearO=null;C.pos=[s.x,s.y,s.z];
      if(C.round<2){C.round++;psGo('mv');}else psGo('back0');}
    return;}
  if(C.stage==='back0'){C.spot=[PS.sx,PS.sz];showCam();const k=clamp(u/PS_MV,0,1);psHop(p.g,m,C.pos,[PS.sx,BY,PS.sz],k,dt,FACE);
    if(u>=PS_MV){me.sc=psScore10(C.d,C.pts);const g=PSM.g;if(C.ts!=null&&g&&g.sc){me.sc.style=g.sc.style;me.sc.happy=g.sc.happy;}   /* (a shared show: style and happiness as sent when you joined, so every screen adds up the same) */
      me.tot=me.sc.style+me.sc.trick+me.sc.happy;psGo('jin');C.jn=-1;psJudgePanel();}return;}
  if(C.stage==='jin'||C.stage==='judge'){judgeCam();psPetPose(p,PS.sx,BY,PS.sz,FACE);animPet(m,dt,false);
    if(C.stage==='jin'&&u>1.2){psGo('judge');C.jn=-1;}
    if(C.stage==='judge'){const n=Math.floor(u/1.4);if(n>C.jn&&n<3){C.jn=n;const j=PSX.judges[n],v=me.sc[j.J.k];psCard(j,v);if(v>=8)SFX.yay();else SFX.pop();psJudgePanel();}
      if(u>3*1.4+1.4){psCardsDown();me.done=true;if(C.ri<C.order.length-1){psGo('yback');psPanel('rival');}else psNext();}}
    return;}
  if(C.stage==='yback'){showCam();const k=sm(clamp(u/1.4,0,1)),pd=padOf(C.me);psHop(p.g,m,[PS.sx,BY,PS.sz],pd,k,dt,psRot(C.me));p.x=p.g.position.x;p.z=p.g.position.z;if(u>=1.5)psNext();return;}
  if(C.stage==='rwait'){showCam();youWait();if(psSec()>=C.rt-.05)psResults();return;}
  if(C.stage==='res'){P.cy=lerp(P.cy||0,.35,Math.min(1,dt*3));psCamTo(PS.rcam[0],PS.rcam[1],-36.0,1.0,16.9,dt,2.6);
    const n=C.ann.length;
    for(let j=0;j<n;j++){const a=C.ann[j],T=2.2+j*2.4+(j===n-1?1.4:0);
      if(j===n-1&&u>=T-1.4&&!C.drum){C.drum=1;popText('🥁 And the winner is…');SFX.knock();}
      if(u>=T&&!a.shown)psReveal(a);
      if(a.shown)psOnPod(a,u-T,dt);}
    if(p&&!C.ann.some(a=>a.x.you&&a.shown))youWait();
    const T1=2.2+(n-1)*2.4+1.4;
    if(u>=T1&&(!C.cf||u-C.cf>(C.place===1?.5:.8))){C.cf=u;const sd=Math.random()<.5?-1:1;floatText(pick(['🎉','⭐','✨','🎊']),-36.0+rand(-.6,.6),rand(1.9,2.6),16.9+sd*rand(.8,1.6),{h:.3});}
    if(u>=T1+2.0&&!C.paid){C.paid=1;psPay();}
    if(C.ts!=null&&C.me<0&&C.paid&&!C.nx&&psSec()>=C.ts+C.len){C.nx=1;psAfter();}
    return;}
  if(C.stage==='lic'){psLicCut(u,dt);return;}
  if(C.stage==='out'){P.cy=lerp(P.cy||0,0,Math.min(1,dt*4));const k=sm(clamp(u/1.1,0,1)),o=PS.out;psCamTo(o[0],o[1],PS.sx,.9,PS.sz,dt,4);
    if(p)psPetPose(p,lerp(C.ox,o[0]-.7,k),lerp(C.oy,0,k)+Math.sin(Math.PI*k)*.7,lerp(C.oz,o[1]-.9,k),Math.atan2(o[0]-C.ox,o[1]-C.oz)),animPet(m,dt,k<1);
    if(u>=1.3)psEnd();}}
/* a friend's turn is scored from what they sent: style and happiness when they joined, the trick card from their taps */
function psScorePeer(x){if(x.npc)return;const pts=x.g.reduce((s,v)=>s+(v|0),0);x.sc.trick=PS_TR[clamp(pts,0,6)];x.tot=x.sc.style+x.sc.trick+x.sc.happy;}
/* the results: in a shared show at the same moment for everyone */
function psResultsAt(){const C=CUT;if(C.ts!=null){C.rt=psTurnAt(C.order.length);if(psSec()<C.rt-.05){psGo('rwait');return;}}psResults();}
function psResults(){const C=CUT,ix=x=>C.order.indexOf(x),placed=C.order.filter(x=>!x.out).sort((a,b)=>b.tot-a.tot||b.sc.trick-a.sc.trick||(a.npc?1:0)-(b.npc?1:0)||ix(a)-ix(b));   /* ties: players before town pets, then the earlier turn: the same on every screen */
  C.placed=placed;C.place=me0(C)?placed.indexOf(C.order[C.me])+1:0;C.ann=placed.slice(0,3).map((x,i)=>({x,i})).reverse();
  closePanel();psGo('res');P.x=PS.rcam[0];P.z=PS.rcam[1];{const a=psLook(-36.0,1.0,16.9);P.yaw=a.yaw;P.pitch=a.pitch;}SFX.ding();popText('🏆 And the results are…');}
const me0=C=>C.me>=0&&!!C.p;
function psReveal(a){const C=CUT,x=a.x,nm=psNm(x),med=['🥇','🥈','🥉'][a.i];a.shown=1;
  popText(a.i===0?(x.you?'🥇 YOU WIN!':'🥇 '+nm+' wins!'):med+' '+['1st','2nd','3rd'][a.i]+' place: '+nm+'!');
  if(a.i===0){SFX.yay();setTimeout(()=>SFX.whee(),300);}else SFX.ding();
  const g=x.you?C.p.g:x.r.m.root;a.f=[g.position.x,g.position.y,g.position.z];if(!x.you)x.r.busy=true;}
function psOnPod(a,v,dt){const C=CUT,x=a.x,[bx,bz,h]=PS.pod[a.i],top=h+.02,k=clamp(v/.9,0,1),e=k*k*(3-2*k);
  const px=lerp(a.f[0],bx,e),pz=lerp(a.f[2],bz,e),py=lerp(a.f[1],top,e)+Math.sin(Math.PI*k)*.8+(k>=1&&a.i===0?Math.abs(Math.sin(v*6))*.18:0),ry=k<1?Math.atan2(bx-a.f[0],bz-a.f[2]):Math.PI/2;
  if(x.you){psPetPose(C.p,px,py,pz,ry);animPet(C.p.m,dt,k<1);}else{psPose(x.r.m.root,x.r.m,px,py,pz,ry);animPet(x.r.m,dt,k<1);}}
function psRow(x,med){const me=!!x.you;
  return`<div class="psrow on${me?' me':''}"><span class="pji">${med}</span><div><b>${PET_TYPES[x.kind].icon} ${esc(psNm(x))}</b><i>${psOwner(x)}</i></div><span class="pjs">${x.out?'Out':x.tot+' ⭐'}</span></div>`;}
function psPay(){const C=CUT,med=['🥇','🥈','🥉','4️⃣'],rows=C.placed.map((x,i)=>psRow(x,med[i]||'')).join('')+C.order.filter(x=>x.out).map(x=>psRow(x,'😴')).join('');
  if(!me0(C)){openPanel(`<div class="hd"><h2>🏆 ${esc(psNm(C.placed[0]))} wins!</h2></div>${rows}<p class="note">${C.plan&&PSM.g&&PSM.g.mine>(PSM.g.gi|0)?'⏭️ Your show is next!':'The next Pet Show is next Saturday! 📅'}</p>
    <div class="row"><button class="btn mint" data-a="psbye">👍 OK!</button></div>`,{bottom:true,lock:true,cls:'psc'});return;}
  const d=C.d,me=C.order[C.me],place=C.place,tot=me.tot;
  const lv0=sk('pets').lv;let pay=0,lvUp=0;
  if(place===1){pay=200;S.coins+=pay;bumpLevel('pets',2);lvUp=sk('pets').lv-lv0;S.showWins=(S.showWins||0)+1;}
  else{pay=[0,0,80,40][place]||15;S.coins+=pay;addXP('pets',place===2?10:place===3?5:3);SFX.coin();}
  S.show={day:S.day,place,tot,pet:d.name};S.showLast=(['','🥇 ','🥈 ','🥉 '][place]||'4th place · ')+d.name+' — '+tot+' ⭐';qEvent('petshow');if(place===1){qEvent('petshowwin');hardEvent('showwin',1);}
  d.happy=Math.min(100,d.happy+15);C.lic=licShow(place);change();saveLocal();
  const prize=place===1?`You win <b>200 🪙</b>${lvUp?` and 🐾 Pets <b>+${lvUp} level${lvUp>1?'s':''}</b>`:' (your Pets skill is already MAX! 🌟)'}!`
    :place<=3?`You got <b>${pay} 🪙</b>. So close! Next time: hit the gold for perfect tricks! 💪`:`You got <b>${pay} 🪙</b> for joining. Practice your tricks and try again next Saturday! 💪`;
  openPanel(`<div class="hd"><h2>${place===1?'🏆 '+esc(d.name)+' WINS!':place===2?'🥈 2nd place!':place===3?'🥉 3rd place!':'4th place'}</h2></div>${rows}<p class="earn">${prize}</p>${place<=3?'<p class="note">🪪 Top 3: it counts for your animal license!</p>':''}<p class="note">The next Pet Show is next Saturday! 📅</p>
    <div class="row"><button class="btn ${place===1?'butter':'mint'}" data-a="psbye">${place===1?'🎉 Yay!':'👍 OK!'}</button></div>`,{bottom:true,lock:true,cls:'psc'});}
ACT.psbye=()=>{const C=CUT;if(!C||!C.show||C.stage!=='res'||!C.paid)return;closePanel();psCardsDown();
  if(C.lic&&C.lic.up){psLicStart();return;}
  if(C.ts!=null&&C.me<0&&!C.nx){C.nx=1;psAfter();return;}
  psOut();};
function psOut(){const C=CUT;C.order.forEach((x,i)=>{if(!x.you)psHome(x.r,i);});const g=C.p?C.p.g:null;if(g){C.ox=g.position.x;C.oy=g.position.y;C.oz=g.position.z;}psGo('out');}
/* after a shared show: the next show right after (more than 4 players), or home */
function psAfter(){const C=CUT,g=PSM.g;if(!g||!g.plans){psOut();return;}g.gi=(g.gi|0)+1;const nx=g.plans[g.gi];
  if(!nx||g.gi>g.mine&&g.mine>=0||g.watch&&!nx){psOut();return;}
  psEnd(true);const L=psPlayers(g.t0),me=L.findIndex(x=>x.me);psShow(nx,g.mine===g.gi&&me>=0?L[me].p:null);}
function psPos(){const C=CUT,T=[1.8,1.5,1.25][C.round],ph=(((performance.now()-C.t0)/1000)/T+C.ph)%1;return ph<.5?ph*2:2-ph*2;}
/* the gold zone: a trick learned by practising (the 2nd and 3rd) has a bigger one (rules-tricks) */
const psGoldW=C=>C.tr[C.round]&&trList(petKind(C.d)).findIndex(t=>t[0]===C.tr[C.round][0])>0?.12:.08;
function psAim(){const C=CUT,[,nm]=C.tr[C.round],gw=psGoldW(C);C.t0=performance.now();C.ph=(Math.round(psSec()*10)%10)/10;
  openPanel(`<div class="hd"><h2>🎩 ${esc(nm)}!</h2><span class="psn">Trick ${C.round+1} of 3</span></div>
    <p class="note">🎩 Tap <b>⭐ NOW!</b> when the paw is in the <b>gold</b> spot!${gw>.08?' <b>Practised trick: a bigger gold spot!</b>':''}</p>
    <div class="psbar"><div class="psgood"></div><div class="psgold" style="left:${50-gw*100}%;right:${50-gw*100}%"></div><div id="psMark" class="psm">🐾</div></div>
    <div class="row"><button class="btn butter psnow" data-a="pstap">⭐ NOW!</button></div>`,{bottom:true,lock:true,cls:'psc aim'});}
ACT.pstap=()=>{const C=CUT;if(!C||!C.show||C.stage!=='aim'||C.t-C.st<.25)return;const pos=psPos(),d=Math.abs(pos-.5),g=d<=psGoldW(C)?2:d<=.22?1:0;psTapped(g,pos);};
function psTapped(g,pos){const C=CUT;C.res[C.round]=g;C.pts+=g;if(PSM.g&&C.ts!=null)PSM.g.gr=(PSM.g.gr||'')+g;C.stage='trick';C.st=C.t;const el=$('psMark');if(el&&pos!=null){el.style.left=(pos*100).toFixed(1)+'%';el.classList.add('hit');}
  const b=document.querySelector('.psnow');if(b)b.disabled=true;const sp=C.spot;
  if(g===2){SFX.whee();setTimeout(()=>SFX.yay(),250);popText('PERFECT! 🌟');for(let i=0;i<4;i++)setTimeout(()=>{if(CUT&&CUT.show)floatText('⭐',sp[0]+rand(-.6,.6),rand(1.1,1.7),sp[1]+rand(-.6,.6),{h:.42});},i*120);}
  else if(g===1){SFX.pop();popText('Good! ⭐');}else{SFX.tap();popText(pos==null?'Too slow! 🙈':'Oopsie! 🙈');floatText('💦',sp[0],1.3,sp[1],{h:.45});}}
function psEnd(keep){const C=CUT;if(!C||!C.show)return;const p=C.p,o=PS.out;CUT=null;popDrop();for(const f of FLOATS)f.t=f.life;   /* the show's big words (and any still waiting) end with it (picture pass: 'Oopsie!' followed you to the farm) */
  for(const r of PSX.rivals)r.tg.visible=true;if(!keep)document.body.classList.remove('cut');if(UI.open)closePanel();psCardsDown();trGearOff(C.gearO);
  for(const x of C.order){if(x.bf){scene.remove(x.bf);x.bf=null;}if(x.own){scene.remove(x.r.m.root);x.r.m.root.traverse(q=>{if(q.isMesh)q.geometry.dispose();});}}PSX.rivals.forEach((r,i)=>psHome(r,i));
  psLicOff(C);
  if(p){p.ps=false;p.m.b.rotation.set(0,0,0);p.m.b.position.set(0,0,0);if(p.m.legs[0])p.m.legs[0].rotation.x=0;p.g.rotation.set(0,p.g.rotation.y,0);p.x=o[0]-.7;p.z=o[1]-.9;p.tx=p.x;p.tz=p.z;p.loc='city';p.d.loc='city';p.d.x=p.x;p.d.z=p.z;p.tag.visible=true;}
  if(keep)return;
  if(PSM.g&&(C.ts!=null||PSM.g.t0))PSM.g=null;
  P.x=o[0];P.z=o[1];P.pitch=0;P.cy=0;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);change();if(PSX.dirty)psRefresh();
  if(C.place===1)setTimeout(()=>toast('🏆 '+C.d.name+' is the Pet Show champion! See you next Saturday!',4),400);
  else if(C.lic&&C.lic.near)setTimeout(()=>toast('🎩 Sir Barkley: “'+C.lic.near+'”',4.4),400);}

/* 🪪 the animal license (rules-animal-license): top 3 at a show counts as a win (only for the license), 1st place as a first; healthy weeks from the ribbon.
   Level 1 = 1 win + 1 healthy week, level 2 = 2 + 2, level 3 = 3 wins (one of them 1st) + 3 healthy weeks. Counted from this update, never taken away;
   a new level is handed over by Sir Barkley on the podium after a show (story-barkley-license) */
const LIC_NEED=[null,[1,1,0],[2,2,0],[3,3,1]];
function licReach(l){let lv=l.lv|0;while(lv<3){const n=LIC_NEED[lv+1];if((l.wins|0)>=n[0]&&(l.weeks|0)>=n[1]&&(l.firsts|0)>=n[2])lv++;else break;}return lv;}
function licShow(place){const l=S.lic;if(!l)return null;if(place>=1&&place<=3)l.wins=(l.wins|0)+1;if(place===1)l.firsts=(l.firsts|0)+1;
  const lv=licReach(l),up=lv>(l.lv|0);if(up){l.lv=lv;l.seen=0;}
  let near='';if(!up&&(l.lv|0)<3){const n=LIC_NEED[(l.lv|0)+1],w=n[0]-(l.wins|0),k=n[1]-(l.weeks|0),f=n[2]-(l.firsts|0),miss=Math.max(0,w)+Math.max(0,k)+Math.max(0,f);
    if(miss===1)near=`One more ${k>0?'healthy week':'win'} and your license grows!`;}
  return{up,lv:l.lv|0,near};}
function licStars(lv){return'★'.repeat(lv)+'☆'.repeat(3-lv);}
const LIC_LINE=['','Splendid! Here is your animal license, level 1. Wear it with pride!','Marvellous! Your license is now level 2.','Bravo! Level 3! You may now care for any animal in Cozy Town.'];
/* the hand-over: you on podium step 1, Sir Barkley on step 2 hands you the card (person.giveCard / person.takeCard), your pet hops (pet.greet) */
function psLicStart(){const C=CUT,lv=C.lic.lv;C.order.forEach((x,i)=>{if(!x.you){psHome(x.r,i);x.r.busy=false;}});
  const B=makePerson(PS_JUDGES[1].look),Y=makePerson(lookToPerson(S.look));for(const q of[B,Y])scene.add(q.root);
  B.root.position.set(PS.bark[0],PS.pod[1][2]+.02,PS.bark[1]);B.root.rotation.y=Math.atan2(.6,-.8);Y.root.position.set(PS.you[0],PS.pod[0][2]+.02,PS.you[1]);Y.root.rotation.y=Math.atan2(.6,.8);
  const card=psLicCard(lv);scene.add(card);C.lb={B,Y,card,lv};const j=PSX.judges[1];if(j)j.p.root.visible=false;
  B.root.updateMatrixWorld(true);Y.root.updateMatrixWorld(true);const mid=new THREE.Vector3((PS.bark[0]+PS.you[0])/2+.28,PS.pod[0][2]+.9,(PS.bark[1]+PS.you[1])/2);   /* the meeting point: between the near shoulders, .28 toward the audience, a little lower */C.lb.tB=B.root.worldToLocal(mid.clone()).toArray();C.lb.tY=Y.root.worldToLocal(mid.clone()).toArray();
  C.lb.show=Y.root.worldToLocal(new THREE.Vector3(PS.rcam[0],1.5,PS.rcam[1])).toArray();
  psGo('lic');toast('🎩 Sir Barkley: “'+LIC_LINE[lv]+'”',4.6);}
function psLicCut(u,dt){const C=CUT,L=C.lb,p=C.p;P.cy=lerp(P.cy||0,.35,Math.min(1,dt*3));psCamTo(-30.9,17.4,-35.9,1.55,17.5,dt,2.6);
  if(p){psPetPose(p,-35.0,0,17.5,Math.PI/2);if(!C.hop||u-C.hop>2.2)C.hop=u;COZY_MOVES.play(p.m,'pet.greet',u-C.hop,{kind:petKind(C.d)});}
  const rb=COZY_MOVES.play(L.B,'person.giveCard',u,{target:L.tB}),ry=u>.85?COZY_MOVES.play(L.Y,'person.takeCard',u-.85,{target:L.tY,showTo:L.show}):{};
  const cp=rb.cardPose||ry.cardPose,who=rb.cardPose?L.B:ry.cardPose?L.Y:null;L.card.visible=!!who;
  if(who){who.root.updateMatrixWorld(true);L.card.position.fromArray(cp.p).applyMatrix4(who.root.matrixWorld);L.card.quaternion.fromArray(cp.q).premultiply(who.root.quaternion);}
  if(u>1.3&&!C.stamp){C.stamp=1;SFX.stamp();setTimeout(()=>SFX.yay(),260);}
  if(u>4.6&&!C.licOpen){C.licOpen=1;openLicense(true);}}
ACT.licok=()=>{const C=CUT;closePanel();if(C&&C.show&&C.stage==='lic')psOut();};
function psLicOff(C){const L=C&&C.lb;if(!L)return;for(const q of[L.B,L.Y,L.card]){scene.remove(q.root||q);(q.root||q).traverse(o=>{if(o.isMesh){o.geometry.dispose();if(o.material&&o.material.map&&o.material.map.isCanvasTexture){o.material.map.dispose();o.material.dispose();}}});}C.lb=null;const j=PSX.judges[1];if(j&&PSX.on)j.p.root.visible=true;}
/* the hand-held card: the book's show:license model, its face drawn by the game (your name, level stars, stamp) */
function psLicCard(lv){const o=packBuild('show.license').root,c=document.createElement('canvas');c.width=768;c.height=512;licDraw(c.getContext('2d'),lv,S.name||'You');
  const tx=new THREE.CanvasTexture(c);o.traverse(q=>{if(q.isMesh&&q.material&&q.material.type==='MeshBasicMaterial'&&q.geometry.type==='PlaneGeometry')q.material=new THREE.MeshBasicMaterial({map:tx});});return o;}
function licDraw(x,lv,name){const F='"Roboto Slab","Alfa Slab One",Georgia,serif';
  x.fillStyle='#f3e6c4';x.fillRect(0,0,768,512);x.strokeStyle='#7a5a36';x.lineWidth=10;x.strokeRect(14,14,740,484);x.lineWidth=3;x.strokeRect(30,30,708,452);
  x.fillStyle='#3d5bd9';x.beginPath();x.moveTo(80,90);x.lineTo(240,90);x.lineTo(240,210);x.quadraticCurveTo(240,300,160,340);x.quadraticCurveTo(80,300,80,210);x.closePath();x.fill();x.strokeStyle='#ffd45c';x.lineWidth=8;x.stroke();
  x.fillStyle='#ffd45c';x.beginPath();x.ellipse(160,230,34,28,0,0,TAU);x.fill();for(const [dx,dy] of[[-40,-30],[-14,-52],[14,-52],[40,-30]]){x.beginPath();x.ellipse(160+dx,230+dy,13,17,0,0,TAU);x.fill();}
  x.fillStyle='#3a2a1a';x.textAlign='left';x.font='44px "Alfa Slab One",Georgia,serif';x.fillText('ANIMAL LICENSE',280,135);
  x.font='700 30px '+F;x.fillStyle='#5a4630';x.fillText('Cozy Town Pet Office',282,178);
  x.font='800 42px '+F;x.fillStyle='#2a3a8f';x.fillText(String(name).slice(0,16),282,250);
  x.font='700 30px '+F;x.fillStyle='#5a4630';x.fillText('Level '+lv,282,305);x.font='48px '+F;x.fillStyle='#d4a017';x.fillText(licStars(lv),420,308);
  if(lv){x.save();x.translate(575,385);x.rotate(-.22);x.strokeStyle=lv===3?'#9a6e08':'#c0392b';x.fillStyle=x.strokeStyle;x.lineWidth=7;x.beginPath();x.arc(0,0,82,0,TAU);x.stroke();x.lineWidth=3;x.beginPath();x.arc(0,0,68,0,TAU);x.stroke();
    x.textAlign='center';x.font='800 '+(lv===3?21:23)+'px '+F;x.fillText(lv===3?'TOP LEVEL':'CERTIFIED',0,8);x.font='700 15px '+F;x.fillText('valid forever',0,36);x.restore();}
  x.font='600 22px '+F;x.fillStyle='#7a5a36';x.textAlign='left';x.fillText('Signed: Sir Barkley',80,440);}
/* 🪪 the license card screen (screens-license-card): paper, the same in dark mode; your level, what's next, the animals you may have */
function openLicense(given){const l=S.lic||{},lv=l.lv|0,n=LIC_NEED[Math.min(3,lv+1)],first=S.pets[0],ic=first?PET_TYPES[petKind(first)].icon:'🐾';
  const can=Object.keys(BIGP).filter(k=>lv>=BIGP[k][4]).map(k=>BIGP[k][0]);
  const next=lv>=3?'<b>Top level!</b> Every animal in Cozy Town.':`Next level: 🏆 Pet Show top 3 <b>${Math.min(l.wins|0,n[0])}/${n[0]}</b>${n[2]?` · 🥇 1st place <b>${Math.min(l.firsts|0,n[2])}/${n[2]}</b>`:''} · 💚 Healthy weeks <b>${Math.min(l.weeks|0,n[1])}/${n[1]}</b>`;
  const once=given&&!l.seen;if(given)l.seen=1;
  openPanel(`<div class="lic"><div class="licTop"><div class="licShield">${ic}</div><div><div class="licT">ANIMAL LICENSE</div><div class="licS">Cozy Town Pet Office</div></div></div>
    <div class="licN">${esc(S.name||'You')}</div><div class="licL">Level ${lv} <span class="licStars">${licStars(lv)}</span></div>
    <div class="licX">${next}</div><div class="licX">${lv?'You may have: '+(can.length?can.join(' '):'')+' and every other pet':'Finish top 3 at a Pet Show and have a healthy week for level 1.'}${lv&&lv<3?' · 🐻 at level 3':''}</div>
    ${lv?`<div class="licStamp${lv===3?' gold':''}">${lv===3?'TOP LEVEL':'CERTIFIED'}<small>valid forever</small></div>`:''}<div class="licSig">Signed: Sir Barkley</div></div>
    ${once?'<p class="note">🎩 Sir Barkley: “Find your license in My pets.”</p>':''}<div class="row"><button class="btn butter" data-a="${given?'licok':'close'}">${given?'🎉 Yay!':'OK'}</button></div>`,{cls:'licc'});if(given)change();}
ACT.lic=()=>{SFX.tap();openLicense(false);};

/* 🕹️ Claw machine in the Toy Store: stop the claw over a capsule, drop it, and win a prize! */
const CLAW_COST=10,CLAW_FURN=['teddy','unicorn','toybox','robot','racecar','rockinghorse','dollhouse','castle','tulips','sunflower','bonsai','cactus'],GOLD_FURN=['gteddy','gunicorn','gtrophy','gstar'];
const clawK=()=>LOC.toys&&LOC.toys.cl;
const tri=v=>{const f=((v%2)+2)%2;return f<1?f:2-f;};
function clawOpen(){const K=clawK();if(!K||CUT||!S)return;SFX.talk();
  openPanel(`<div class="hd"><h2>🕹️ Claw machine</h2><div class="chip">🪙 <b id="pc">${S.coins}</b></div><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    ${shutNote('toys')}<p class="line">Catch a capsule and win a prize! 🎁 Every try is <b>${CLAW_COST} 🪙</b>.</p>
    <p class="note">First stop the claw left-right, then front-back, right above a capsule! Capsules have furniture, coins or a level-up inside. A <b>✨ gold capsule</b> has a golden treasure you can't buy anywhere, plus a level-up!</p>
    <div class="row"><button class="btn butter" data-a="clawgo" ${S.coins<CLAW_COST?'disabled':''}>🕹️ Play! (${CLAW_COST} 🪙)</button></div>${S.coins<CLAW_COST?'<p class="note">Not enough coins yet. '+earnTip()+'</p>':''}`);}
function clawNew(K){K.x=K.rx;K.z=K.rz;K.y=K.ry;K.open=.1;clawPose(K);
  CUT={claw:1,t:0,st:0,shake:0,stage:'x',K,t0:performance.now(),hold:null,res:null};clawPanel();}
ACT.clawgo=()=>{const K=clawK();if(!K||CUT||shutBuy('toys')||clawEmpty())return;if(S.coins<CLAW_COST){SFX.no();toast('Not enough coins! 🪙');return;}
  S.coins-=CLAW_COST;SFX.coin();change();closePanel();if(P.ride)stopRide();P.sit=null;document.body.classList.add('cut');$('note').hidden=true;clawNew(K);};
ACT.clawagain=()=>{const C=CUT;if(!C||!C.claw||shutBuy('toys')||clawEmpty())return;if(S.coins<CLAW_COST){SFX.no();return;}clawTidy(C);S.coins-=CLAW_COST;SFX.coin();change();clawNew(C.K);};
ACT.clawdone=()=>{const C=CUT;if(!C||!C.claw)return;clawEnd();};
function clawPanel(){const C=CUT;
  if(C.stage==='x')openPanel(`<div class="hd"><h2>🕹️ Left or right?</h2><span class="psn">Step 1 of 2</span></div><p class="note">Tap <b>⏹ STOP</b> when the claw is right above a capsule!</p><div class="row"><button class="btn butter psnow" data-a="clawtap">⏹ STOP</button></div>`,{bottom:true,lock:true});
  else if(C.stage==='z')openPanel(`<div class="hd"><h2>🕹️ Front or back?</h2><span class="psn">Step 2 of 2</span></div><p class="note">Now tap <b>⬇️ DROP</b> when it's right above the capsule!</p><div class="row"><button class="btn butter psnow" data-a="clawtap">⬇️ DROP</button></div>`,{bottom:true,lock:true});
  else closePanel();}
ACT.clawtap=()=>{const C=CUT;if(!C||!C.claw||C.t-C.st<.3)return;
  if(C.stage==='x'){C.stage='z';C.st=C.t;C.t0=performance.now();SFX.tap();clawPanel();}
  else if(C.stage==='z'){C.stage='drop';C.st=C.t;SFX.pop();clawPanel();}};
function clawResolve(){const C=CUT,K=C.K;let best=null,bd=1e9;for(const c of K.caps){const d=Math.hypot(c.x-K.x,c.z-K.z);if(d<bd){bd=d;best=c;}}
  C.res='miss';if(best&&bd<.14){const ch=(bd<.05?.92:bd<.09?.7:.4)*(best.gold?.8:1);C.res=Math.random()<ch?'win':bd<.11?'slip':'miss';}
  if(C.res!=='miss'){C.hold=best;K.caps.splice(K.caps.indexOf(best),1);C.won=best;SFX.tap();}
  else if(best&&bd<.2){best.x=clamp(best.x+(best.x-K.x)*.35,K.mx-.38,K.mx+.38);best.z=clamp(best.z+(best.z-K.z)*.35,K.mz-.44,K.mz+.44);best.g.position.set(best.x,best.y,best.z);}}
function clawCut(dt){const C=CUT,K=C.K,L=LOC.toys,t=(C.t+=dt),u=t-C.st,sm=k=>k*k*(3-2*k);
  psCamTo(L.ox+K.mx+1.75,L.oz+K.mz,L.ox+K.mx,1.3,L.oz+K.mz,dt,4);
  const el=(performance.now()-C.t0)/1000;
  if(C.stage==='x')K.z=lerp(K.mz+.42,K.mz-.42,tri(el/2.4));
  else if(C.stage==='z')K.x=lerp(K.mx+.36,K.mx-.36,tri(el/2.0));
  else if(C.stage==='drop'){const k=sm(clamp(u,0,1));K.y=lerp(K.ry,K.lo,k);K.open=lerp(K.open,.55,Math.min(1,dt*8));if(u>=1.1){C.stage='grab';C.st=t;}}
  else if(C.stage==='grab'){K.open=lerp(.55,.1,clamp(u/.45,0,1));if(u>=.5){clawResolve();C.stage='lift';C.st=t;}}
  else if(C.stage==='lift'){K.y=lerp(K.lo,K.ry,sm(clamp(u,0,1)));
    if(C.hold&&C.res==='slip'&&u>.45&&!C.fell){C.fell={c:C.hold,y:C.hold.y,t};C.hold=null;SFX.no();popText('😱 It slipped!');}
    if(u>=1.05){C.stage=C.hold?'carry':'home';C.st=t;C.cx=K.x;C.cz=K.z;}}
  else if(C.stage==='carry'||C.stage==='home'){const k=sm(clamp(u/1.1,0,1));K.x=lerp(C.cx,K.rx,k);K.z=lerp(C.cz,K.rz,k);
    if(u>=1.2){if(C.stage==='carry'){C.stage='release';C.st=t;C.drop=C.hold;C.hold=null;}else{C.stage='done';C.st=t;clawResult();}}}
  else if(C.stage==='release'){K.open=lerp(.1,.55,clamp(u/.3,0,1));const c=C.drop;
    if(c&&c.g.visible){c.y=Math.max(.6,K.y-.17-u*u*6);c.g.position.set(K.x,c.y,K.z);if(c.y<=.61){c.g.visible=false;SFX.pop();}}
    if(u>=.9){C.stage='prize';C.st=t;clawPop();}}
  else if(C.stage==='prize'){clawPopAnim(u);if(u>=2.0&&!C.shown){C.shown=1;clawResult();}}
  if(C.hold){const c=C.hold;c.x=K.x;c.z=K.z;c.y=K.y-.17;c.g.position.set(c.x,c.y,c.z);}
  if(C.fell){const f=C.fell,v=t-f.t,c=f.c;c.y=Math.max(K.fy,f.y-v*v*7);c.g.position.set(c.x,c.y+(c.y<=K.fy?Math.abs(Math.sin(v*14))*.03*Math.max(0,1-v):0),c.z);}
  clawPose(K);}
/* 🪙 economy rebalance (30 Oct): at most 10 prizes a game day; a level prize gives the level, no coins */
const CLAW_DAY=10,clawToday=()=>S.clawDay&&S.clawDay[0]===S.day?S.clawDay[1]:0;
function clawEmpty(){if(clawToday()<CLAW_DAY)return false;SFX.no();toast('🧸 Mr. Toby: “The claw machine is empty for today! New prizes tomorrow.”',3.8);return true;}
function clawSkill(){const ks=Object.keys(SKILLS).filter(k=>sk(k).lv<MAXLV);return ks.length?pick(ks):null;}
function clawPrize(cap){const out={};
  if(cap.gold){const id=pick(GOLD_FURN);S.home.store.push({u:uid(),t:id,c:null,x:0,z:0,r:0});out.gold=1;out.furn=id;const k=clawSkill();if(k){bumpLevel(k,1,true);out.sk=k;}else{S.coins+=100;out.coins=100;}}
  else{const r=Math.random();
    if(r<.58){const id=pick(CLAW_FURN),F=FURN[id],c=F.cols?pick(F.cols):null;S.home.store.push({u:uid(),t:id,c,x:0,z:0,r:0});out.furn=id;out.c=c;}
    else if(r<.88){const n=pick([20,25,30,30,40,50]);S.coins+=n;out.coins=n;}
    else{const k=clawSkill();if(k){bumpLevel(k,1,true);out.sk=k;}else{S.coins+=40;out.coins=40;}}}
  S.clawWins=(S.clawWins||0)+1;S.clawDay=[S.day,clawToday()+1];qEvent('claw');hardEvent('claw',1);change();saveLocal();return out;}
function clawPop(){const C=CUT,K=C.K,c=C.won,g=new THREE.Group(),r=.13;
  const top=new THREE.Mesh(new THREE.SphereGeometry(r,14,7,0,TAU,0,Math.PI/2),mat(c.col)),bot=new THREE.Mesh(new THREE.SphereGeometry(r,14,7,0,TAU,Math.PI/2,Math.PI/2),mat(c.gold?'#fff1b8':'#ffffff'));
  g.add(top,bot);K.g.add(g);C.pop={g,top,bot};g.position.set(K.mx+.84,.3,K.mz+.3);C.prize=clawPrize(c);SFX.pop();}
function clawPopAnim(u){const C=CUT,K=C.K,Q=C.pop,L=LOC.toys;if(!Q)return;const k=clamp(u/.7,0,1),e=k*k*(3-2*k);
  Q.g.position.set(lerp(K.mx+.84,K.mx+.98,e),.3+Math.sin(Math.PI*k)*.4+e*.85,lerp(K.mz+.3,K.mz+.1,e));Q.g.rotation.y=u*3;Q.g.rotation.z=u>.7&&u<1.05?Math.sin((u-.7)*40)*.25:0;
  if(u>=1.05){const v=u-1.05;Q.top.position.y=v*1.3;Q.top.rotation.x=-v*4;Q.bot.position.y=-v*.25;
    if(!C.opened){C.opened=1;const pr=C.prize,F=pr.furn&&FURN[pr.furn],em=F?F.i:pr.sk?SKILLS[pr.sk].i:'🪙',p=Q.g.position;
      floatText(em,L.ox+p.x-.15,p.y+.3,L.oz+p.z,{h:.4,life:2});if(C.won.gold){SFX.rare();for(let i=0;i<5;i++)setTimeout(()=>floatText('✨',L.ox+p.x-.2+rand(-.3,.3),p.y+rand(0,.5),L.oz+p.z+rand(-.5,.5),{h:.26}),i*110);}else SFX.yay();}}}
function clawResult(){const C=CUT,K=C.K;
  if(C.res==='win'&&C.prize){const pr=C.prize,F=pr.furn&&FURN[pr.furn],img=F?thumb(pr.furn,pr.c):'',lines=[];
    if(F)lines.push(`${F.i} <b>${F.n}</b>! It's waiting in 📦 My stuff at home.`);if(pr.coins)lines.push(`🪙 <b>${pr.coins} coins</b>!`);if(pr.sk)lines.push(`${SKILLS[pr.sk].i} <b>${SKILLS[pr.sk].n} +1 level!</b>`);
    while(K.caps.length<14){const s=clawSpot(K);if(!s)break;clawAdd(K,s[0],s[1],Math.random()<.12);}
    openPanel(`<div class="hd"><h2>${pr.gold?'✨ GOLD CAPSULE! ✨':'🎉 You won!'}</h2><div class="chip">🪙 <b>${S.coins}</b></div></div>${img?`<div style="text-align:center"><img class="fth" src="${img}" alt="" style="width:110px;height:110px;object-fit:contain"></div>`:''}<p class="line" style="text-align:center">${lines.join('<br>')}</p>
      <div class="row"><button class="btn butter" data-a="clawagain" ${S.coins<CLAW_COST?'disabled':''}>🕹️ Play again (${CLAW_COST} 🪙)</button><button class="btn white" data-a="clawdone">Done</button></div>`,{bottom:true,lock:true});return;}
  if(C.fell){K.caps.push(C.fell.c);C.fell.c.g.position.set(C.fell.c.x,K.fy,C.fell.c.z);C.fell=null;}
  const msg=C.res==='slip'?'😱 So close! It slipped out of the claw!':pick(['😅 Missed! Try to stop right above a capsule.','🙈 Nothing this time! Aim for the middle of a capsule.','😮 Almost! Watch the claw carefully.']);
  openPanel(`<div class="hd"><h2>${C.res==='slip'?'Oh no!':'No prize this time'}</h2><div class="chip">🪙 <b>${S.coins}</b></div></div><p class="line">${msg}</p>
    <div class="row"><button class="btn butter" data-a="clawagain" ${S.coins<CLAW_COST?'disabled':''}>🕹️ Try again (${CLAW_COST} 🪙)</button><button class="btn white" data-a="clawdone">Done</button></div>${S.coins<CLAW_COST?'<p class="note">Not enough coins for another try.</p>':''}`,{bottom:true,lock:true});}
function clawTidy(C){const K=C.K;if(C.pop){K.g.remove(C.pop.g);C.pop=null;}if(C.drop){K.g.remove(C.drop.g);C.drop=null;}if(C.hold){K.caps.push(C.hold);C.hold=null;}if(C.fell){K.caps.push(C.fell.c);C.fell=null;}}
function clawEnd(){const C=CUT;if(!C||!C.claw)return;const K=C.K,L=LOC.toys;clawTidy(C);K.x=K.rx;K.z=K.rz;K.y=K.ry;K.open=.1;clawPose(K);
  CUT=null;document.body.classList.remove('cut');if(UI.open)closePanel();P.x=L.ox+K.mx+1.35;P.z=L.oz+K.mz;const a=psLook(L.ox+K.mx,1.5,L.oz+K.mz);P.yaw=a.yaw;P.pitch=0;change();}
/* 📚 Teacher job: Mrs. Maple, the school director, texts you which class to teach. Find the room in the school
   hallway, sit at your desk and stop kids who goof off (their names float over their heads — write them on your
   notepad!). Then the kids hand in their homework and you mark every answer ✔ or ✗. The game works out the grades. */
/* 🪙 job pay is even: a weak day ~150, a good day ~270, the best day ~390 🪙 in every job. A class pays 75 / 135 / 195 by ⭐ (2 a day) */
const TC_MAX=2,TC_PAY=s=>30+60*s,TC_NAMES=['Alexa','Ben','Chloe','Daniel','Emma','Felix','Grace','Henry','Isla','Jack','Lucy','Mason','Nora','Oscar','Pia','Ryan','Sofia','Tom','Zara','Leo'];
const GOOFS=[['talk','🗣️'],['plane','✈️'],['phone','📱'],['sleep','💤'],['dance','💃'],['silly','😜']];
Object.assign(PLACE_OF,{cl_math:'📐 In Math class',cl_english:'📖 In English class',cl_history:'🏛️ In History class'});
function tc(){const d=S.tc||(S.tc={});if(d.day!==S.day){d.day=S.day;d.done=0;}if(!isFinite(d.wait))d.wait=5;return d;}
function tcGoing(id){return!!(S&&S.job==='teacher'&&S.tc&&S.tc.o&&S.tc.o.subj===id);}
function tcHere(id){return tcGoing(id)&&!!CUR&&CUR.id==='cl_'+id;}
const tcDoor=S0=>S0.pos==='middle'?'the middle door':'the door on the '+S0.pos;
function tcNew(){const d=tc(),id=pick(Object.keys(SUBJ).filter(k=>k!==d.last)),S0=SUBJ[id];d.o={subj:id};d.last=id;
  const x=`Good ${S.time<5||S.time>=18?'evening':S.time<12?'morning':'afternoon'}, ${S.name||'teacher'}! ${nightF(S.time)>.5?'🌙':'☀️'} Today I'd like you to teach the ${S0.n} class, if that's okay! ${S0.i} Go to the school. In the hallway, the ${S0.n} room is ${tcDoor(S0)}.`;
  addMsg('dr','dr',x,{t2:'📚 Your class today: '+S0.n});SFX.ding();try{if(navigator.vibrate)navigator.vibrate([120,80,120]);}catch(e){}
  showNote('📚 Message from the school!',x,false,'📚','dr');change();jobHud(true);}
function tcTick(dt){const d=tc();if(!d.o&&d.done<TC_MAX&&!CUT&&isDaytime()){d.wait-=dt;if(d.wait<=0)tcNew();}jobHud();}
function tcTalk(){if(S&&schoolGift())return;   /* 🎈 1 Sep: the teacher's globe, once a year (run 4, job 11) */
  const o=S&&S.job==='teacher'&&S.tc&&S.tc.o;
  if(o){const S0=SUBJ[o.subj];toast(`“Your class today is ${S0.n}! ${S0.i} It's ${tcDoor(S0)}. Good luck!”`,3.8);return;}
  if(S&&S.job==='teacher'){toast(tc().done>=TC_MAX?'“You taught all your classes today! Thank you! 🌟”':!isDaytime()?`“No classes at night! 🌙 Work starts at ${DAY_ON}:00. I will message you! ☀️”`:'“No class right now. I will message you when a class needs you! 📱”',3.6);return;}
  toast('“Welcome to Cozy Town School! Want to be a teacher? Ask Rosie for a job! 📚”',3.8);}
function tcClear(){for(const id in SUBJ){const L=LOC['cl_'+id];if(L&&L.kids){for(const k of L.kids)L.g.remove(k.p.root);L.kids=null;}}}
function enterClass(id){const L=LOC['cl_'+id];if(!L||fading)return;SFX.door();
  fade(()=>{setLoc('cl_'+id);P.x=L.ox;P.z=L.oz+3.4;P.yaw=0;P.pitch=0;P.sit=null;if(tcGoing(id))tcSpawn(id);bringFollowers();saveLocal();
    const o=S.job==='teacher'&&S.tc&&S.tc.o;
    if(tcGoing(id))setTimeout(()=>toast('📚 Your class is here! Sit down at your desk to start the lesson.',3.4),500);
    else if(o)setTimeout(()=>toast(`This is the ${SUBJ[id].n} room. Your class today is ${SUBJ[o.subj].n}! ${SUBJ[o.subj].i}`,3.6),500);});}
function leaveClass(id){const L=LOC.school;if(!L||fading)return;SFX.door();
  fade(()=>{setLoc('school');P.x=L.ox+SUBJ[id].x;P.z=L.oz-3.2;P.yaw=Math.PI;P.pitch=0;P.sit=null;bringFollowers();saveLocal();});}
function tcLook(){const a=x=>pick(x);return{skin:a(['#fdc991','#f6d3bb','#d5914c','#c98d63','#8a5a3c','#ffe0c2']),hair:a(['#704d2d','#2e2347','#f2c14e','#e8734a','#9a6a43','#1f1a2e','#c5874a']),
  style:a(['long','bob','short','ponytail','bun','pigtails','curly']),top:a(['#ff9ec4','#7cc8ff','#ffd45c','#7fdcb5','#b79cff','#ff8a6b','#ffffff']),bottom:a(['#3f4c86','#37a4fc','#2e2347','#9a6a43','#ff9ec4']),
  shoes:a(['#ffffff','#3d2c5e','#ff7aa8','#7cc8ff']),eyes:a(['round','happy','sparkle']),scale:.8,hat:Math.random()<.3?a(['cap','bow','beanie','flower']):'none',hatc:a(['#ff6b6b','#ff4d8d','#7cc8ff','#ffd45c'])};}
function tcTag(k,hot){if(k.tag){k.p.root.remove(k.tag);if(k.tag.material.map)k.tag.material.map.dispose();k.tag.material.dispose();}
  const t=label(k.nm+(k.warn?' '+'⚠️'.repeat(k.warn):''),.22,Object.assign(k.warn>=3?{fg:'#ff3b5c'}:{},hot?{bg:'#ffd45c'}:{}));t.position.y=1.72;k.p.root.add(t);k.tag=t;}
function tcSpawn(id){const L=LOC['cl_'+id];if(L.kids)return;const names=TC_NAMES.slice().sort(()=>Math.random()-.5).slice(0,6),bad=new Set([0,1,2,3,4,5].sort(()=>Math.random()-.5).slice(0,2));
  L.kids=SEATS.map(([x,z],i)=>{const p=makePerson(tcLook());sitPose(p);bakePerson(p);p.root.position.set(x,-.04,z+.5);p.root.rotation.y=Math.PI;L.g.add(p.root);
    const k={p,nm:names[i],i,x,z,warn:0,goof:null,bad:bad.has(i),acc:bad.has(i)?rand(.45,.7):rand(.72,.95),t:Math.random()*9,tag:null,bub:null};tcTag(k);return k;});}
function tcFov(){const a=innerWidth/innerHeight;return a<1?clamp(2*Math.atan(Math.tan(27*Math.PI/180)/a)*180/Math.PI,78,100):70;}
function tcBar(h){let e=$('tchBar');if(!h){if(e)e.remove();return;}if(!e){e=document.createElement('div');e.id='tchBar';document.body.appendChild(e);}if(e._h!==h){e.innerHTML=h;e._h=h;}}
function tcDesk(id){if(!tcHere(id)){SFX.tap();toast(S.job==='teacher'?"This isn't your class today! Check your messages. 📱":"This is the teacher's desk. Want to be a teacher? Ask Rosie for a job! 📚",3.4);return;}
  const L=CUR;if(!L.kids)tcSpawn(id);if(P.ride)stopRide();P.sit=null;closePanel();document.body.classList.add('cut','tch');$('note').hidden=true;
  BASEFOV=tcFov();camera.fov=BASEFOV;camera.updateProjectionMatrix();
  CUT={tch:1,t:0,st:0,shake:0,stage:'sit',id,L,kids:L.kids,next:2.5,caught:0,missed:0,oops:0,pile:[],planes:[]};toastOff();
  tcBar('📚 Get ready… the lesson is about to start!');SFX.pop();}
function tcCut(dt){const C=CUT,L=C.L,t=(C.t+=dt),u=t-C.st;if(L.kids)tagsApart(L.kids);
  for(const w of FRIEND_ACTORS)if(w.loc===L.id)w.g.visible=false;for(const w of PET_ACTORS)if(w.loc===L.id)w.g.visible=false;   /* 🐾 pets and friends who came along wait out of sight in class, so nobody blocks the kids */
  const gr=C.stage==='grade'||C.stage==='done';P.cy=lerp(P.cy||0,gr?.2:.85,Math.min(1,dt*3));if(gr)psCamTo(L.ox,L.oz-3.65,L.ox,.55,L.oz-2.6,dt,3);else psCamTo(L.ox,L.oz-3.75,L.ox,.55,L.oz+.75,dt,3);
  for(const k of C.kids)tcAnim(k,dt);tcPlanes(dt);
  if(C.stage==='sit'){if(u>2.2){C.stage='lesson';C.st=t;C.len=40;SFX.ding();popText('🔔 The '+SUBJ[C.id].n+' lesson starts!');setTimeout(()=>{if(CUT&&CUT.tch)toast('✋ Tap a kid who goofs off to stop them!',3.6);},900);}return;}
  if(C.stage==='lesson'){const left=Math.max(0,C.len-u);
    C.next-=dt;if(C.next<=0&&u<C.len-5){C.next=rand(2.2,3.6);if(C.kids.filter(k=>k.goof).length<2)tcGoof();}
    for(const k of C.kids)if(k.goof&&t-k.goof.t0>k.goof.dur){C.missed++;tcStop(k);}
    tcBar(`${SUBJ[C.id].i} <b>${SUBJ[C.id].n}</b> · ⏱ ${Math.ceil(left)} s · ✋ ${C.caught} stopped${C.missed?' · 🙈 '+C.missed+' missed':''}`);
    if(u>=C.len){for(const k of C.kids)if(k.goof)tcStop(k);C.stage='hw';C.st=t;toastOff();SFX.ding();popText('🔔 Ring! The lesson is over!');tcBar('📝 Homework time! Everyone brings you their homework…');tcHwPlan();}
    return;}
  if(C.stage==='hw'){tcHwWalk(u,dt);if(u>C.hwEnd||C.kids.every(k=>k.done)&&u>3){C.stage='grade';C.st=t;toastOff();tcBar(null);tcPaperStart();}}}
function tcGoof(){const C=CUT,free=C.kids.filter(k=>!k.goof);if(!free.length)return;const w=free.map(k=>k.bad?3:1);let r=Math.random()*w.reduce((a,b)=>a+b,0),k=free[0];
  for(let i=0;i<free.length;i++){r-=w[i];if(r<=0){k=free[i];break;}}
  const g=pick(GOOFS);k.goof={k:g[0],t0:C.t,dur:rand(4.6,6.2)};k.bub=label(g[1],.3);k.bub.position.set(.42,1.3,0);k.p.root.add(k.bub);tcTag(k,true);if(g[0]==='plane')tcPlane(k);}
function tcStop(k){if(k.bub){k.p.root.remove(k.bub);if(k.bub.material.map)k.bub.material.map.dispose();k.bub.material.dispose();k.bub=null;}const was=!!k.goof;k.goof=null;if(was&&!k.walk)tcTag(k);}
function tcAnim(k,dt){if(k.walk)return;const p=k.p,b=p.b,h=p.head,A=p.arms,g=k.goof;k.t+=dt;const t=k.t;
  b.rotation.set(0,0,0);b.position.y=0;h.rotation.set(.12+Math.sin(t*.9)*.04,Math.sin(t*.4)*.12,0);A[0].rotation.set(-.6,0,0);A[1].rotation.set(-.75+Math.sin(t*6)*.06,0,0);
  if(!g)return;const s=k.x<=0?1:-1;
  if(g.k==='talk'){h.rotation.set(0,s*.9+Math.sin(t*9)*.08,0);A[0].rotation.set(-1.0,0,-.4-Math.abs(Math.sin(t*7))*.5);}
  else if(g.k==='plane'){A[1].rotation.x=-2.6+((t*1.1)%1)*1.8;h.rotation.y=Math.sin(t*2)*.4;}
  else if(g.k==='phone'){h.rotation.x=.5;A[0].rotation.x=-1.25;A[1].rotation.x=-1.25;}
  else if(g.k==='sleep'){b.rotation.x=.38;h.rotation.x=.35;A[0].rotation.x=-1.4;A[1].rotation.x=-1.4;}
  else if(g.k==='dance'){b.position.y=Math.abs(Math.sin(t*8))*.05;b.rotation.z=Math.sin(t*8)*.12;A[0].rotation.set(0,0,-2.4+Math.sin(t*8)*.3);A[1].rotation.set(0,0,2.4-Math.sin(t*8)*.3);}
  else{h.rotation.set(0,Math.sin(t*5)*.4,Math.sin(t*10)*.3);}
  if(k.bub)k.bub.position.y=1.3+Math.abs(Math.sin(t*4))*.06;}
function tcPlane(k){const C=CUT,g=new THREE.Group();cone(g,.07,.22,'#ffffff',0,0,0,{rx:Math.PI/2,center:true,seg:3,s:[1.6,.35,1],ol:.006});g.visible=false;C.L.g.add(g);
  C.planes.push({g,a:[k.x,1.25,k.z+.5],b:[rand(-2.4,2.4),.03,rand(-1.8,2.6)],t:0,dur:1.6,delay:.5});}
function tcPlanes(dt){for(const pl of CUT.planes){pl.t+=dt;const k=clamp((pl.t-pl.delay)/pl.dur,0,1);pl.g.visible=pl.t>pl.delay;
  const x=lerp(pl.a[0],pl.b[0],k),z=lerp(pl.a[2],pl.b[2],k),y=lerp(pl.a[1],pl.b[1],k)+Math.sin(Math.PI*k)*.9;if(k<1)pl.g.rotation.set(0,Math.atan2(pl.b[0]-pl.a[0],pl.b[2]-pl.a[2]),Math.sin(pl.t*6)*.3);pl.g.position.set(x,y,z);}}
function tcTap(cx,cy){const C=CUT;if(!C||C.stage!=='lesson')return;const r=renderer.domElement.getBoundingClientRect(),v=new THREE.Vector3();let best=null,bd=1e9,bg=null,bgd=1e9;
  for(const k of C.kids){v.set(0,1.0,0);k.p.root.localToWorld(v);v.project(camera);const sx=r.left+(v.x+1)/2*r.width,sy=r.top+(1-v.y)/2*r.height,d=Math.hypot(sx-cx,sy-cy);if(d<bd){bd=d;best=k;}if(k.goof&&d<bgd){bgd=d;bg=k;}}
  if(bg&&bgd<Math.max(80,r.width*.11)*1.2)tcScold(bg);else if(best&&bd<Math.max(80,r.width*.11))tcScold(best);}
function tcScold(k){const C=CUT;if(!k.goof){SFX.tap();toast(`😇 ${k.nm} is listening nicely!`,2);return;}
  C.caught++;k.warn=Math.min(3,k.warn+1);tcStop(k);SFX.no();popText(`✋ Stop goofing off, ${k.nm}!`);
  const b=label('😳',.34);b.position.y=2.0;k.p.root.add(b);setTimeout(()=>k.p.root.remove(b),1300);
  if(k.warn===3)setTimeout(()=>{if(CUT&&CUT.tch)toast(`📕 ${k.nm} goofed off 3 times! You can give an F on the homework.`,3.8);},700);}
/* homework time: everyone stands up, walks to your desk, puts the paper down and goes home */
function tcHwPlan(){const C=CUT;C.kids.forEach((k,i)=>{const side=k.x<0?-1:k.x>0?1:(i%2?1:-1),ax=k.x+side*.66,sx=side*2.5;
  k.path=[[k.x,k.z+.5],[ax,k.z+.5],[ax,-1.55],[(i-2.5)*.22,-2.1],[sx,-1.55],[sx,3.4],[0,4.1]];k.t0=.6+i*1.2;k.seg=0;k.walk=false;k.done=false;k.drop=false;k.wait=0;});C.hwEnd=.6+5*1.2+9;}
function tcStand(k){const p=k.p;for(const l of p.legs)l.rotation.x=0;for(const a of p.arms)a.rotation.set(0,0,0);p.b.rotation.set(0,0,0);p.b.position.y=0;p.head.rotation.set(0,0,0);tcStop(k);}
function tcDropPaper(){const C=CUT,n=C.pile.length,m=new THREE.Mesh(new THREE.BoxGeometry(.24,.012,.32),mat('#ffffff'));m.position.set(-.08+rand(-.04,.04),.825+n*.013,-2.75+rand(-.03,.03));m.rotation.y=rand(-.25,.25);C.L.g.add(m);C.pile.push(m);}
function tcHwWalk(u,dt){for(const k of CUT.kids){if(k.done||u<k.t0)continue;const p=k.p;
  if(!k.walk){k.walk=true;k.seg=1;tcStand(k);p.root.position.set(k.path[0][0],0,k.path[0][1]);}
  if(k.wait>0){k.wait-=dt;animPerson(p,dt,false);continue;}
  const tg=k.path[k.seg],dx=tg[0]-p.root.position.x,dz=tg[1]-p.root.position.z,d=Math.hypot(dx,dz);
  if(d<.05){if(k.seg===3&&!k.drop){k.drop=true;k.wait=.45;tcDropPaper();SFX.pop();}k.seg++;if(k.seg>=k.path.length){k.done=true;p.root.visible=false;}continue;}
  const s=Math.min(d,1.9*dt);p.root.position.x+=dx/d*s;p.root.position.z+=dz/d*s;p.root.rotation.y=angLerp(p.root.rotation.y,Math.atan2(dx,dz),Math.min(1,dt*10));animPerson(p,dt,true);}}
/* homework questions with pictures */
const hwR=n=>Math.floor(Math.random()*n);
const HW_ANIM=[['🦁','lion','tiger'],['🐘','elephant','hippo'],['🦒','giraffe','zebra'],['🐧','penguin','parrot'],['🦓','zebra','horse'],['🐙','octopus','jellyfish'],['🐢','turtle','frog'],['🦉','owl','eagle'],['🐬','dolphin','shark'],['🐝','bee','fly'],['🦊','fox','dog'],['🐰','rabbit','mouse']];
const HW_SPELL=[['🐱','cat','kat'],['🐶','dog','dgo'],['🍌','banana','bananna'],['🏠','house','hous'],['☀️','sun','son'],['🌈','rainbow','ranebow'],['🍎','apple','aple'],['🐟','fish','fihs'],['🌙','moon','mone'],['🎂','cake','caik'],['🌳','tree','tre'],['⭐','star','starr']];
const HW_OPP=[['hot','cold','warm'],['big','small','tall'],['happy','sad','funny'],['up','down','over'],['fast','slow','quick'],['day','night','noon'],['old','new','big'],['wet','dry','rainy']];
const HW_HIST=[['🏰','Who lived in castles?','kings and queens','astronauts'],['🛡️','What did knights wear?','armor','pajamas'],['🦕','Are dinosaurs still alive today?','no, they lived long ago','yes, in my garden'],
  ['🔺','Where are the big pyramids?','in Egypt','on the Moon'],['🐎','Before cars, people rode…','horses','skateboards'],['🕯️','Before lamps, people used…','candles','phones'],
  ['⛵','Vikings sailed in…','wooden ships','airplanes'],['🪶','Long ago, people wrote with…','feather pens','computers'],['👑','What does a king wear on his head?','a crown','a swim cap'],
  ['🪨','Cave people lived in…','caves','big hotels'],['🏹','Long ago, hunters used…','bows and arrows','video games'],['🐫','In the desert, people rode…','camels','penguins']];
function hwQ(subj){
  if(subj==='math'){const t=pick(['add','sub','count','mul']);
    if(t==='add'){const a=1+hwR(5),b=1+hwR(4),e=pick(['🍎','⭐','🐟','🌸','🍪']);return{pic:e.repeat(a)+' + '+e.repeat(b),q:'How many in all?',a:String(a+b),w:[String(a+b+1),String(a+b-1)]};}
    if(t==='sub'){const a=5+hwR(6),b=1+hwR(4);return{pic:'🧮',q:`${a} − ${b} = ?`,a:String(a-b),w:[String(a-b+1),String(a+b)]};}
    if(t==='count'){const n=3+hwR(6),e=pick(['🐞','🎈','🍓','🐥']);return{pic:e.repeat(n),q:'How many are there?',a:String(n),w:[String(n+1),String(n-1)]};}
    const a=2+hwR(4),b=2+hwR(2);return{pic:'🔢',q:`${a} × ${b} = ?`,a:String(a*b),w:[String(a*b+a),String(a*b+1)]};}
  if(subj==='english'){const t=pick(['animal','spell','opp']);
    if(t==='animal'){const [p,a,w]=pick(HW_ANIM);return{pic:p,q:'What animal is this?',a,w:[w]};}
    if(t==='spell'){const [p,a,w]=pick(HW_SPELL);return{pic:p,q:'Spell it!',a,w:[w]};}
    const [x,a,w]=pick(HW_OPP);return{pic:'↔️',q:`The opposite of “${x}” is…`,a,w:[w]};}
  const [p,q,a,w]=pick(HW_HIST);return{pic:p,q,a,w:[w]};}
function hwMake(subj,k){const out=[],seen=new Set(),acc=clamp(k.acc-k.warn*.1,.2,.97);
  for(let n=0;out.length<3&&n<40;n++){const q=hwQ(subj),key=q.q+q.pic;if(seen.has(key))continue;seen.add(key);const w=q.w.filter(x=>x!==q.a);q.ans=Math.random()<acc||!w.length?q.a:pick(w);out.push(q);}
  return out;}
function tcPaperStart(){const C=CUT;for(const k of C.kids){k.hw=hwMake(C.id,k);k.mk=[null,null,null];k.hint=[];k.minus=false;k.giveF=false;k.seen=false;}C.pi=0;C.key=false;C.ask=false;tcPaper();}
function tcGrade(k){const n=k.hw.filter(q=>q.ans===q.a).length;if(k.giveF)return'F';let g=['D','C','B','A'][n];if(k.minus)g+='−';else if(!k.warn&&n>0)g+='+';return g;}
function tcPaper(){const C=CUT,k=C.kids[C.pi],mk=k.mk,all=mk.every(Boolean);
  if(C.ask){openPanel(`<div class="hd"><h2>🚪 Stop grading?</h2></div><p class="line">Mrs. Maple will grade the rest of the papers for you. You still get paid for the class!</p>
    <div class="row"><button class="btn butter" data-a="tstopy">✅ Yes, stop</button><button class="btn white" data-a="tstopn">✏️ No, keep grading</button></div>`,{lock:true,cls:'tpaper'});return;}
  const rows=k.hw.map((q,i)=>{const show=C.key||k.hint[i],lp=[...q.pic].length>3;return`<div class="tq${k.hint[i]&&!mk[i]?' oops':''}"><div class="tqq${lp?' lp':''}"><span class="tpic${lp?' long':''}">${q.pic}</span><span><b>${i+1}.</b> ${esc(q.q)}${show?`<span class="tkey">🔑 ${esc(q.a)}</span>`:''}</span></div>
    <div class="tqa"><span class="hand">${esc(q.ans)}</span>${mk[i]?`<span class="mk ${mk[i]}">${mk[i]==='ok'?'✔':'✗'}</span>`:`<button class="btn mint tb" data-a="tmk:${i}:ok" aria-label="Right">✔</button><button class="btn pink tb" data-a="tmk:${i}:x" aria-label="Wrong">✗</button>`}</div>
    ${k.hint[i]&&!mk[i]?`<div class="thint">🤔 Look again! The right answer is <b>${esc(q.a)}</b>. Is “${esc(q.ans)}” right?</div>`:''}</div>`;}).join('');
  const last=C.pi>=C.kids.length-1,back=C.pi>0?`<button class="btn white" data-a="tback">◀ Back</button>`:'';
  const extra=all?(k.warn>=3?`<button class="btn ${k.giveF?'pink':'white'}" data-a="tgf">📕 ${k.giveF?'F given!':'Give an F'}</button>`
      :k.warn?`<button class="btn ${k.minus?'pink':'white'}" data-a="tgm">➖ ${k.minus?'Minus given!':'Give a minus'}</button>`:''):'';
  const foot=`<div class="tfoot">${all?`<span class="stamp">${tcGrade(k)}</span>`:''}${extra}<span class="tsp"></span>${back}${all?`<button class="btn butter" data-a="tnext">${last?'Done! 🎉':'Next ▶'}</button>`:''}</div>`;
  openPanel(`<div class="hd"><h2>📄 ${esc(k.nm)}'s homework</h2><span class="psn">${C.pi+1} of ${C.kids.length}</span></div>
    <p class="note">${k.warn?'📝 '+'⚠️'.repeat(k.warn)+' '+esc(k.nm)+' goofed off '+k.warn+' time'+(k.warn>1?'s':'')+' in class.':'😇 '+esc(k.nm)+' listened nicely in class.'} Mark every answer: ✔ right or ✗ wrong!</p>
    <div class="ttop"><button class="btn ${C.key?'mint':'white'} sm" data-a="tkey">🔑 ${C.key?'Hide answers':'Answer key'}</button><button class="btn white sm" data-a="tstop">🚪 Stop</button></div>
    <div class="paper">${rows}</div>${foot}`,{lock:true,cls:'tpaper'});}
const tcOn=()=>{const C=CUT;return!!(C&&C.tch&&C.stage==='grade');};
ACT.tmk=(i,v)=>{if(typeof i==='string'&&i.includes(':')){const p=i.split(':');i=p[0];v=p[1];}if(!tcOn())return;const C=CUT,k=C.kids[C.pi],q=k.hw[+i];if(!q||k.mk[+i])return;const right=q.ans===q.a;
  if((v==='ok')!==right){C.oops++;SFX.no();k.hint[+i]=true;tcPaper();return;}
  k.mk[+i]=v;if(v==='ok')SFX.pop();else SFX.tap();tcPaper();};
ACT.tkey=()=>{if(!tcOn())return;CUT.key=!CUT.key;SFX.tap();tcPaper();};
ACT.tgm=()=>{if(!tcOn())return;const k=CUT.kids[CUT.pi];k.minus=!k.minus;SFX.tap();tcPaper();};
ACT.tgf=()=>{if(!tcOn())return;const k=CUT.kids[CUT.pi];k.giveF=!k.giveF;SFX.tap();tcPaper();};
ACT.tback=()=>{if(!tcOn()||CUT.pi<=0)return;CUT.pi--;SFX.tap();tcPaper();};
ACT.tnext=()=>{if(!tcOn())return;const C=CUT,k=C.kids[C.pi];if(!k.mk.every(Boolean))return;k.grade=tcGrade(k);SFX.pop();
  if(!k.seen){k.seen=true;const pp=C.pile.pop();if(pp)C.L.g.remove(pp);}
  if(C.pi<C.kids.length-1){C.pi++;tcPaper();}else{C.stage='done';C.st=C.t;tcSummary();}};
ACT.tstop=()=>{if(!tcOn())return;CUT.ask=true;SFX.tap();tcPaper();};
ACT.tstopn=()=>{if(!tcOn())return;CUT.ask=false;SFX.tap();tcPaper();};
ACT.tstopy=()=>{if(!tcOn())return;const C=CUT;C.ask=false;for(const k of C.kids){k.hw.forEach((q,i)=>{if(!k.mk[i])k.mk[i]=q.ans===q.a?'ok':'x';});k.grade=tcGrade(k);}
  for(const pp of C.pile)C.L.g.remove(pp);C.pile=[];C.stage='done';C.st=C.t;SFX.pop();tcSummary();};

function tcSummary(){const C=CUT,S0=SUBJ[C.id],eps=C.caught+C.missed,ratio=eps?C.caught/eps:1,stars=clamp(1+(ratio>=.45?1:0)+(ratio>=.8&&C.oops<=2?1:0),1,3),pay=TC_PAY(stars);
  S.coins+=pay;S.tcTotal=(S.tcTotal||0)+1;const d=tc();d.done++;d.o=null;d.wait=rand(25,40);hardEvent('teach',1);qEvent('teach');addXP('read',4);change();saveLocal();
  addMsg('dr','dr',`${stars>=3?'🌟':stars===2?'😊':'🙂'} Thank you for teaching the ${S0.n} class! You got ${'⭐'.repeat(stars)} and ${pay} 🪙. ${stars>=3?'The kids loved it! 🎉':stars===2?'Nice job!':'Next time, stop more kids from goofing off! 💪'}`,{q:1});
  const rows=C.kids.map(k=>`<div class="psrow on"><span class="pji">${k.warn>=3?'📕':k.warn?'⚠️':'😇'}</span><div><b>${esc(k.nm)}</b><i>${k.warn?'goofed off '+k.warn+'×':'listened nicely'}</i></div><span class="pjs tg">${k.grade}</span></div>`).join('');
  SFX.coin();if(stars>=3)setTimeout(()=>SFX.yay(),300);
  openPanel(`<div class="hd"><h2>🎉 Class finished!</h2><div class="chip">🪙 <b>${S.coins}</b></div></div>${rows}
    <p class="earn">${'⭐'.repeat(stars)}${'<span style="opacity:.25">⭐</span>'.repeat(3-stars)} · You earned <b>${pay} 🪙</b>!</p>
    <p class="note">✋ You stopped ${C.caught} of ${eps} goof-offs.${C.oops?' You fixed '+C.oops+' grading mistake'+(C.oops>1?'s':'')+'.':' Perfect grading! ✏️'}</p>
    <div class="row"><button class="btn butter" data-a="tbye">👍 OK!</button></div>`,{bottom:true,lock:true});}
ACT.tbye=()=>{const C=CUT;if(!C||!C.tch||C.stage!=='done')return;tcEnd();};
function tcEnd(){const C=CUT;if(!C||!C.tch)return;const L=C.L;for(const k of C.kids)L.g.remove(k.p.root);L.kids=null;for(const pl of C.planes)L.g.remove(pl.g);for(const pp of C.pile)L.g.remove(pp);
  CUT=null;document.body.classList.remove('cut','tch');tcBar(null);if(UI.open)closePanel();resize();P.cy=0;P.x=L.ox;P.z=L.oz-1.8;P.yaw=Math.PI;P.pitch=0;change();jobHud(true);
  const d=tc();setTimeout(()=>toast(d.done>=TC_MAX?'🌟 All your classes are done today! More tomorrow.':'📚 Great job! Mrs. Maple will message you about your next class.',3.6),500);}
function calHolidayLine(){const d=realDate();let t='';   /* 🎉 the month's holiday, in a line a child understands (run 4, stage 3) */
  if(nyeParty(d))t='🎉 Happy New Year! Party hats and confetti for everyone today!';else if(schoolParty(d))t='🎈 School party day! Balloons at the school: talk to a teacher for a little globe.';
  else if(HOL.cur==='halloween')t='🎃 Halloween month! Costumes at the Clothes Shop, little ghosts in town, and the spooky path at the Flower Corner after 18:00.';
  else if(HOL.cur==='valentine')t="💝 Valentine's month! The heart fountain and pink petals are at the Flower Corner.";
  else if(HOL.cur==='easter')t=`🐰 Easter month! The bunny hid 25 eggs around town. You found ${eggState().f.length} of 25.`;
  else if(HOL.cur==='xmas')t='🎄 Christmas month! The big tree and Santa are at the Flower Corner. Santa has coins for you once a day!'+(nyeFireworks(d)?' 🎆 Fireworks tonight from 19:00!':'');
  return t?`<p class="ph-sub hol">${t}</p>`:'';}
function skyIc(){const n=nightF(S.time)>.5;return WX.rain>.55?'🌧️':WX.snow>.55?'🌨️':WX.sky>.5?'☁️':n?'🌙':'☀️';}   /* the sky as the clock chip shows it (the calendar's today too) */
function calBody(){const i0=wdIdx(),n=daysToShow();   /* 🕰️ the week: weekday names only, no day numbers (run 4) */
  let h=`<p class="ph-sub"><b>Today is ${wdName()}!</b> ${isShowDay()?(showDone()?'You did the 🏆 Pet Show today. The next one is next Saturday!':S.time>=PS_OFF?'Today\'s 🏆 Pet Show is over. The next one is next Saturday!':`🏆 It's Pet Show day! Bring your pet to the park from ${clockStr(PS_ON)} to ${clockStr(PS_OFF)}!`):`🏆 Pet Show in ${n} day${n>1?'s':''}: on Saturday, ${clockStr(PS_ON)} to ${clockStr(PS_OFF)}, in the park.`}</p>`;   /* ("Today is…" comes first, above the week: on a short screen it was below the fold; run 4, stage 3) */
  h+='<div class="cal">';
  for(let i=0;i<7;i++){h+=`<div class="cd${i===i0?' today':''}${i===5?' show':''}"><b>${WDAYS[i].slice(0,3)}</b><span>${i===i0?skyIc():i<i0?'✔':'<em>○</em>'}</span><i>${i===i0?'⭐':''}${i===5?'🏆':''}</i></div>`;}
  h+='</div>'+calHolidayLine();
  h+=`<div class="caltips">${PS_JUDGES.map(J=>`<div><span>${J.i}</span><span><b>${J.n}</b> loves ${J.love}</span></div>`).join('')}</div>`;
  if(S.showLast)h+=`<p class="ph-sub">Last show: ${esc(S.showLast)}</p>`;if(S.showWins)h+=`<p class="ph-sub">🏆 Pet Show wins: ${S.showWins}</p>`;
  return h;}

let DISCOTEX=null;function discoTex(){if(DISCOTEX)return DISCOTEX;const c=document.createElement('canvas');c.width=128;c.height=64;const x=c.getContext('2d'),r=seeded(31),G=['#f4f7ff','#c9d2e6','#9aa6c2','#ffffff','#e3e8f5'],K=['#ff9ec4','#7cc8ff','#ffd45c','#b79cff'];   /* 🪩 a mirror ball: little silver tiles with a few coloured glints (run 4, stage 3: it read as a white balloon) */
  x.fillStyle='#6d7894';x.fillRect(0,0,128,64);for(let j=0;j<8;j++)for(let i=0;i<16;i++){x.fillStyle=r()<.1?K[(r()*K.length)|0]:G[(r()*G.length)|0];x.fillRect(i*8+1,j*8+1,6,6);}DISCOTEX=new THREE.CanvasTexture(c);return DISCOTEX;}
/* 🖼️ little pictures of furniture, made with the game's own 3D models */
const THUMBS=new Map(),PHOTOS=new Map();let THR=null,THF=0;
function offShot(sc,cam,w,h,clear){const R=THR||(THR={rt:null,buf:null,w:0,h:0,cv:document.createElement('canvas')});
  if(R.w!==w||R.h!==h){if(R.rt)R.rt.dispose();R.rt=new THREE.WebGLRenderTarget(w,h);R.buf=new Uint8Array(w*h*4);R.w=w;R.h=h;R.cv.width=w;R.cv.height=h;}
  const oc=renderer.getClearColor(new THREE.Color()),oa=renderer.getClearAlpha();
  renderer.setRenderTarget(R.rt);renderer.setClearColor(clear||0x000000,clear?1:0);renderer.clear();(RENDER0||renderer.render.bind(renderer))(sc,cam);   /* (the real render, even while a test runs frames without drawing) */renderer.readRenderTargetPixels(R.rt,0,0,w,h,R.buf);renderer.setRenderTarget(null);renderer.setClearColor(oc,oa);
  const x=R.cv.getContext('2d'),img=x.createImageData(w,h),row=w*4;for(let y=0;y<h;y++)img.data.set(R.buf.subarray((h-1-y)*row,(h-y)*row),y*row);x.putImageData(img,0,0);return R.cv.toDataURL('image/png');}
function shotScene(){const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight('#ffffff','#e6d8f0',.55));const d=new THREE.DirectionalLight('#fff3e0',.48);d.position.set(2.5,5,4);sc.add(d);return sc;}
function thumb(t,c){const k=t+'|'+(c||'');if(THUMBS.has(k))return THUMBS.get(k);let url='';
  try{const sc=shotScene(),g=buildFurn(t,c||undefined);sc.add(g);g.traverse(o=>{const m=o.material;if(m&&!Array.isArray(m)&&m.emissive&&m.emissive.getHex()&&m.emissiveIntensity>.3){o.material=m.clone();o.material.emissiveIntensity=m.emissiveIntensity*.35;}});   /* (run 4 finish: in the little picture's light a glowing piece's colour came out white, the seafoam neon sign's tubes; the room's own pieces keep theirs) */const b=new THREE.Box3().setFromObject(g),ct=b.getCenter(new THREE.Vector3()),r=b.getSize(new THREE.Vector3()).length()/2;
    const cam=new THREE.PerspectiveCamera(32,1,.05,60);cam.position.copy(ct).addScaledVector(new THREE.Vector3(.62,.55,1).normalize(),r/Math.sin(16*Math.PI/180)*1.02);cam.lookAt(ct);url=offShot(sc,cam,144,144);}catch(e){console.warn(e);}
  THUMBS.set(k,url);return url;}
function thumbFill(){cancelAnimationFrame(THF);const run=()=>{const im=[...document.querySelectorAll('#card img[data-th]:not([src])')];if(!im.length)return;const t0=performance.now();
  for(const m of im){const [t,c]=m.dataset.th.split('|'),u=thumb(t,c);if(u){m.src=u;m.parentNode.classList.add('ok');}else m.removeAttribute('data-th');if(performance.now()-t0>12)break;}THF=requestAnimationFrame(run);};THF=requestAnimationFrame(run);}
function dsPhoto(T){if(PHOTOS.has(T.id))return PHOTOS.get(T.id);let url='';
  try{const sc=shotScene(),R=DROOM[T.room],ft=floorTex(R.floor);ft.repeat.set(4,3);const fl=new THREE.Mesh(new THREE.PlaneGeometry(8,6),toon({map:ft}));fl.rotation.x=-Math.PI/2;fl.position.z=.8;sc.add(fl);
    const wl=new THREE.Mesh(new THREE.PlaneGeometry(8,3.2),toon({color:R.wall}));wl.position.set(0,1.6,-1.2);sc.add(wl);
    const n=T.ph.length,sp=n>2?1.45:1.7;T.ph.forEach(([t,c],i)=>{const g=buildFurn(t,c);g.position.set((i-(n-1)/2)*sp,0,-1.2+FURN[t].d/2+.05);sc.add(g);});
    const cam=new THREE.PerspectiveCamera(34,1.6,.05,50);cam.position.set(0,2.0,4.6);cam.lookAt(0,.6,-.9);url=offShot(sc,cam,320,200,0xfff7ee);}catch(e){console.warn(e);}
  PHOTOS.set(T.id,url);return url;}

/* 📋 the theme card (it takes the notepad's place when you're a designer) */
let DCARD_KEY='';
function dcardUpd(force){const el=$('dcard');if(!el)return;const on=!!(PLAYING&&S&&S.job==='designer');if(el.hidden===on)el.hidden=!on;{const ph=on||SET.pad===false;if($('pad').hidden!==ph)$('pad').hidden=ph;}if(!on){DCARD_KEY='';return;}
  const d=ds(),o=d.o;
  if(!o){const key='none:'+d.done+':'+isDaytime();if(!force&&key===DCARD_KEY)return;DCARD_KEY=key;el.classList.add('empty');
    el.innerHTML=`<div class="dct">🎨 ${d.done>=DS_MAX?'All done today! 🌟':!isDaytime()?`Clients come at ${DAY_ON}:00 ☀️`:'Waiting for a client…'}</div><div class="dcr"><span>${d.done} / ${DS_MAX} clients today</span></div>`;return;}
  const T=dsTheme(o),R=DROOM[T.room],n=dsItems().length,inR=CUR&&CUR.id==='client',key=[o.h,o.th,o.ri|0,n,inR].join(':');if(!force&&key===DCARD_KEY)return;DCARD_KEY=key;el.classList.remove('empty');
  el.innerHTML=`<div class="dct">${T.e} ${esc(T.n)}${o.r2?` <small>room ${(o.ri|0)+1} of 2</small>`:''}</div><img class="dci" alt="" data-ph="${T.id}"><div class="dcr"><span class="dcp">${T.pal.map(f=>`<i style="background:${FAMDOT[f]}"></i>`).join('')}${T.plants?'🌿':''}</span><span class="dcn">🪑 ${R.cnt[0]}–${R.cnt[1]}${inR?` <small>(${n})</small>`:''}</span></div>`;
  setTimeout(()=>{const im=el.querySelector('img.dci[data-ph]');if(im&&im.dataset.ph===T.id)im.src=dsPhoto(T);},0);}   /* 📷 the theme photo is drawn right after, not inside the load (run 4: a save with a designer order took 7 s to load on a slow chip) */
$('dcard').addEventListener('click',()=>{audioInit();SFX.tap();dcardBig();});
function dcardBig(){const o=S.ds&&S.ds.o;if(!o){openPhone('job');return;}const T=dsTheme(o),R=DROOM[T.room],W=dsWho(o),H=HOUSE(o.h);
  openPanel(`<div class="hd"><h2>${T.e} ${esc(T.n)}</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    <img class="dcbig" alt="" src="${dsPhoto(T)}"><p class="line">${esc(W.nm)}: “${esc(T.ask)}”</p>${o.r2?`<p class="note">🚪 Two rooms! This is room ${(o.ri|0)+1}: ${esc(T.n)}. The other one: ${esc(dsThemeOf(o,(o.ri|0)?0:1).n)}. The door in the side wall leads there.</p>`:''}
    <div class="dcrow"><span class="dcp lg">${T.pal.map(f=>`<i style="background:${FAMDOT[f]}"></i>`).join('')}</span><span>${T.pal.map(f=>FAMN[f]).join(' · ')}</span></div>
    <div class="dcrow">🪑 <b>${R.cnt[0]}–${R.cnt[1]}</b> things${T.plants?` · 🌿 ${T.plants}+ plants`:''}</div>
    <p class="note">📍 ${esc(H.n)}${o.flat?', flat '+o.flat:''}. The picture is just an idea. Make it your own way! ✨</p>`);}

/* 🛋️ the Furniture app: free ideas for your client, or shopping for your own house */
const DS_ALL=[...new Set([...BUY_FURN.filter(k=>k!=='petbed'&&k!=='xmastree'&&k!=='shellshelf'),...DS_TOYS,...FLOWER_SHOP])];
function furnPhone(){
  if(dsHere()){const o=S.ds.o,T=dsTheme(o),tile=(t,c)=>`<button class="fit" data-a="fpick:${t}:${c||''}"><img data-th="${t}|${c||''}" alt=""><span class="em">${FURN[t].i}</span>${c?`<i class="swc" style="background:${c}" aria-hidden="true"></i>`:''}<span>${esc(FURN[t].n)}</span></button>`;
    return`<p class="ph-sub">✨ Everything is <b>free</b> for your job! Tap something to put it in the room.</p><div class="fsec">${T.e} Ideas for ${esc(dsWho(o).nm)}</div><div class="fgrid">${dsTray(T).map(([t,c])=>tile(t,c)).join('')}</div>
      ${PH.all?`<div class="fsec">All furniture</div><div class="fgrid">${DS_ALL.flatMap(t=>FURN[t]?(FURN[t].cols||['']).map(c=>[t,c]):[]).map(([t,c])=>`<button class="fit e" data-a="fpick:${t}:${c}"><span class="em">${FURN[t].i}</span>${c?`<i class="swc" style="background:${c}"></i>`:''}<span>${esc(FURN[t].n)}</span></button>`).join('')}</div>`:`<div class="row"><button class="btn white" data-a="fall">🔎 Show all furniture</button></div>`}`;}
  return`<p class="ph-sub">Buy furniture for <b>your own house</b> here. When you decorate for a client, everything is <b>free</b>!&nbsp;🎨</p><div class="row"><button class="btn butter" data-a="fhome">🛍️ Shop for my house</button></div>`;}
ACT.fpick=a=>{const i=a.indexOf(':'),t=i<0?a:a.slice(0,i),c=i<0?'':a.slice(i+1);if(!FURN[t]||!dsHere())return;closePanel();if(!DECO.on)decoStart();if(DECO.placing)decoCancel();
  startPlacing({u:uid(),t,c:c||null,x:0,z:0,r:0});toast('Look where it should go, then tap ✅ Put it here',2.8);};
ACT.fall=()=>{PH.all=!PH.all;renderPhone();};
ACT.fhome=()=>{closePanel();openCatalog('buy');};

/* 🎓 the designer tips: pictures that move, hardly any reading */
let DTUT=null,dtutT=0;
const DTUT_STEPS=[
 {t:'📩 A client sends you a message!',s:`<svg viewBox="0 0 300 200"><rect width="300" height="200" rx="18" fill="#efe6ff"/><g class="dt-shake" style="transform-origin:150px 105px"><rect x="105" y="18" width="90" height="168" rx="16" fill="#3d2c5e"/><rect x="112" y="32" width="76" height="138" rx="8" fill="#fff"/><g class="dt-pop" style="transform-origin:150px 80px"><rect x="118" y="52" width="64" height="50" rx="12" fill="#b79cff" stroke="#3d2c5e" stroke-width="3"/><text x="150" y="86" font-size="26" text-anchor="middle">🎨</text></g><g class="dt-pop2" style="transform-origin:190px 28px"><circle cx="190" cy="28" r="14" fill="#ff4d6d" stroke="#fff" stroke-width="3"/><text x="190" y="34" font-size="16" font-weight="800" fill="#fff" text-anchor="middle">1</text></g></g><text x="44" y="112" font-size="46" class="dt-bob">📩</text><text x="214" y="112" font-size="46" class="dt-bob b2">😊</text></svg>`},
 {t:'🗺️ Follow the dot to their house',s:`<svg viewBox="0 0 300 200"><rect width="300" height="200" rx="18" fill="#9fe486"/><rect x="0" y="88" width="300" height="26" fill="#b9bcd6"/><rect x="138" y="0" width="26" height="200" fill="#b9bcd6"/><rect x="24" y="22" width="62" height="48" rx="6" fill="#ffd6e0" stroke="#3d2c5e" stroke-width="3"/><rect x="190" y="22" width="80" height="48" rx="6" fill="#c9f2e3" stroke="#3d2c5e" stroke-width="3"/><rect x="24" y="134" width="70" height="46" rx="6" fill="#fff1b8" stroke="#3d2c5e" stroke-width="3"/><rect x="200" y="140" width="64" height="44" rx="6" fill="#e6dbff" stroke="#3d2c5e" stroke-width="3"/><circle cx="232" cy="130" r="14" fill="#ff3b3b" class="dt-pulse" style="transform-origin:232px 130px"/><circle cx="232" cy="130" r="10" fill="#ff3b3b" stroke="#fff" stroke-width="4"/><path d="M14,0 L-10,10 L-4,0 L-10,-10 Z" fill="#ff4d8d" stroke="#fff" stroke-width="3"><animateMotion dur="3.2s" repeatCount="indefinite" rotate="auto" keyPoints="0;1;1" keyTimes="0;.8;1" calcMode="linear" path="M30,101 L151,101 L151,124 L218,124"/></path></svg>`},
 {t:'📋 This card shows what they want',s:`<svg viewBox="0 0 300 200"><rect width="300" height="200" rx="18" fill="#fff4e8"/><g class="dt-float"><rect x="80" y="14" width="140" height="170" rx="14" fill="#fff" stroke="#3d2c5e" stroke-width="4"/><text x="150" y="42" font-size="20" text-anchor="middle">🌿 🛏️</text><rect x="92" y="52" width="116" height="74" rx="6" fill="#fff3ea" stroke="#eee4ff" stroke-width="2"/><rect x="92" y="106" width="116" height="20" fill="#e6c49c"/><rect x="104" y="96" width="54" height="18" rx="4" fill="#7fdcb5" stroke="#3d2c5e" stroke-width="2"/><rect x="104" y="80" width="9" height="34" rx="2" fill="#7fdcb5" stroke="#3d2c5e" stroke-width="2"/><rect x="176" y="98" width="15" height="15" fill="#e88f6a" stroke="#3d2c5e" stroke-width="2"/><circle cx="183.5" cy="89" r="12" fill="#6fcf7a" stroke="#3d2c5e" stroke-width="2"/><circle cx="106" cy="152" r="9" fill="#5fd4b0" stroke="#3d2c5e" stroke-width="2.5"/><circle cx="128" cy="152" r="9" fill="#c98f5e" stroke="#3d2c5e" stroke-width="2.5"/><text x="208" y="158" font-size="17" font-weight="800" text-anchor="end" fill="#3d2c5e">🪑 5–8</text></g><text x="222" y="196" font-size="36" class="dt-tap">👆</text></svg>`},
 {t:"🛋️ Pick furniture. It's free!",s:`<svg viewBox="0 0 300 200"><rect width="300" height="200" rx="18" fill="#e8f6ff"/><rect x="34" y="12" width="112" height="178" rx="16" fill="#3d2c5e"/><rect x="41" y="26" width="98" height="152" rx="8" fill="#fff"/><text x="90" y="44" font-size="13" font-weight="800" text-anchor="middle" fill="#3d2c5e">✨ FREE ✨</text><g class="dt-tile" style="transform-origin:66px 72px"><rect x="47" y="52" width="40" height="40" rx="8" fill="#ffe3ef" stroke="#3d2c5e" stroke-width="2"/><text x="67" y="81" font-size="22" text-anchor="middle">🛏️</text></g><rect x="93" y="52" width="40" height="40" rx="8" fill="#f6f0ff" stroke="#3d2c5e" stroke-width="2"/><text x="113" y="81" font-size="22" text-anchor="middle">🪴</text><rect x="47" y="98" width="40" height="40" rx="8" fill="#f6f0ff" stroke="#3d2c5e" stroke-width="2"/><text x="67" y="127" font-size="22" text-anchor="middle">💡</text><rect x="93" y="98" width="40" height="40" rx="8" fill="#f6f0ff" stroke="#3d2c5e" stroke-width="2"/><text x="113" y="127" font-size="22" text-anchor="middle">🛋️</text><rect x="47" y="144" width="40" height="28" rx="8" fill="#f6f0ff" stroke="#3d2c5e" stroke-width="2"/><rect x="93" y="144" width="40" height="28" rx="8" fill="#f6f0ff" stroke="#3d2c5e" stroke-width="2"/><rect x="176" y="40" width="108" height="120" rx="8" fill="#fff3ea" stroke="#3d2c5e" stroke-width="4"/><rect x="176" y="128" width="108" height="32" fill="#e6c49c"/><text x="67" y="81" font-size="22" text-anchor="middle" class="dt-fly" style="transform-origin:67px 74px">🛏️</text><text x="58" y="118" font-size="36" class="dt-hand">👆</text></svg>`},
 {t:'🧱 Big things go against the wall',s:`<svg viewBox="0 0 300 200"><rect width="300" height="200" rx="18" fill="#f3f0ff"/><rect x="62" y="18" width="176" height="164" rx="6" fill="#e6c49c" stroke="#3d2c5e" stroke-width="8"/><rect x="126" y="174" width="48" height="10" fill="#5fd4b0"/><g class="dt-slide"><rect x="122" y="72" width="56" height="76" rx="6" fill="#ff9ec4" stroke="#3d2c5e" stroke-width="3"/><rect x="129" y="78" width="42" height="16" rx="5" fill="#fff" stroke="#3d2c5e" stroke-width="2"/></g><text x="196" y="118" font-size="38" class="dt-no">❌</text><text x="196" y="64" font-size="38" class="dt-yes">✅</text></svg>`},
 {t:'🙂 Not too empty, not too full',s:`<svg viewBox="0 0 300 200"><rect width="300" height="200" rx="18" fill="#fff8e6"/><rect x="12" y="44" width="84" height="84" rx="6" fill="#fff3ea" stroke="#3d2c5e" stroke-width="4"/><rect x="40" y="70" width="26" height="18" rx="3" fill="#7fdcb5" stroke="#3d2c5e" stroke-width="2"/><text x="54" y="168" font-size="34" text-anchor="middle">😕</text><g class="dt-glow"><rect x="108" y="44" width="84" height="84" rx="6" fill="#fff3ea" stroke="#5fd4b0" stroke-width="6"/></g><rect x="114" y="50" width="26" height="16" rx="3" fill="#7fdcb5" stroke="#3d2c5e" stroke-width="2"/><rect x="160" y="50" width="26" height="12" rx="3" fill="#c98f5e" stroke="#3d2c5e" stroke-width="2"/><circle cx="120" cy="116" r="7" fill="#6fcf7a" stroke="#3d2c5e" stroke-width="2"/><circle cx="180" cy="116" r="7" fill="#6fcf7a" stroke="#3d2c5e" stroke-width="2"/><rect x="138" y="86" width="26" height="18" rx="9" fill="#ffd45c" stroke="#3d2c5e" stroke-width="2"/><text x="150" y="168" font-size="34" text-anchor="middle">😍</text><rect x="204" y="44" width="84" height="84" rx="6" fill="#fff3ea" stroke="#3d2c5e" stroke-width="4"/><g stroke="#3d2c5e" stroke-width="2"><rect x="208" y="48" width="22" height="16" fill="#7fdcb5"/><rect x="232" y="48" width="24" height="18" fill="#ff9ec4"/><rect x="258" y="48" width="26" height="14" fill="#7cc8ff"/><rect x="208" y="66" width="18" height="22" fill="#ffd45c"/><rect x="228" y="68" width="28" height="18" fill="#b79cff"/><rect x="258" y="64" width="26" height="24" fill="#c98f5e"/><rect x="208" y="90" width="26" height="16" fill="#ff8a6b"/><rect x="236" y="88" width="22" height="18" fill="#5fd4b0"/><rect x="260" y="90" width="24" height="16" fill="#ff9ec4"/><rect x="208" y="108" width="34" height="16" fill="#7cc8ff"/><rect x="244" y="108" width="40" height="16" fill="#ffd45c"/></g><text x="246" y="168" font-size="34" text-anchor="middle">😵</text></svg>`},
 {t:'🎉 Tap Finished! Then get stars!',s:`<svg viewBox="0 0 300 200"><rect width="300" height="200" rx="18" fill="#eafff6"/><g class="dt-btnp" style="transform-origin:72px 156px"><rect x="8" y="134" width="128" height="44" rx="14" fill="#5fd4b0" stroke="#3d2c5e" stroke-width="3"/><text x="72" y="162" font-size="15" font-weight="800" text-anchor="middle" fill="#3d2c5e">🎉 Finished!</text></g><text x="88" y="186" font-size="32" class="dt-hand2">👆</text><g class="dt-walkin"><rect x="-16" y="18" width="32" height="44" rx="9" fill="#b79cff" stroke="#3d2c5e" stroke-width="3"/><circle cx="0" cy="2" r="17" fill="#f5cfb0" stroke="#3d2c5e" stroke-width="3"/><circle cx="-6" cy="0" r="2.6" fill="#3d2c5e"/><circle cx="6" cy="0" r="2.6" fill="#3d2c5e"/><path d="M-6,8 Q0,13 6,8" stroke="#3d2c5e" stroke-width="2.5" fill="none"/></g><text x="150" y="58" font-size="40" class="dt-star s1" style="transform-origin:170px 44px">⭐</text><text x="196" y="58" font-size="40" class="dt-star s2" style="transform-origin:216px 44px">⭐</text><text x="242" y="58" font-size="40" class="dt-star s3" style="transform-origin:262px 44px">⭐</text></svg>`}];
function dtutStart(){if(DTUT||!PLAYING)return;if(UI.open)closePanel();if(DECO.placing)decoCancel();DTUT={i:0};$('dtut').hidden=false;dtutShow();}
function dtutShow(){const st=DTUT_STEPS[DTUT.i],last=DTUT.i===DTUT_STEPS.length-1;$('dtPic').innerHTML=st.s;$('dtCap').textContent=st.t;
  $('dtDots').innerHTML=DTUT_STEPS.map((_,k)=>`<i class="${k===DTUT.i?'on':''}"></i>`).join('');$('dtNext').textContent=last?"Let's go! 🎨":'Next ▶';$('dtSkip').hidden=last;SFX.pop();}
function dtutEnd(){DTUT=null;$('dtut').hidden=true;if(S){S.dsTut=1;change();}}
$('dtNext').addEventListener('click',()=>{audioInit();SFX.tap();if(!DTUT)return;if(DTUT.i>=DTUT_STEPS.length-1){dtutEnd();return;}DTUT.i++;dtutShow();});
$('dtSkip').addEventListener('click',()=>{SFX.tap();dtutEnd();});
ACT.dtutgo=()=>{closePanel();setTimeout(dtutStart,250);};
/* ✂️ the hairstylist's buttons (job 15; here because ACT is made just above) */
SFX.snip=()=>{tone(1800,.05,'square',.05);tone(1500,.05,'square',.05,.08);};
ACT.hscut=()=>{const c=HS.cust;if(!c||!c.sat)return;const h=c.hair;if(h.len==='long')h.len='shoulder';else if(h.len==='shoulder')h.len='short';else return;SFX.snip();hsRebuild(c);floatText('✂️',c.p.root.position.x,1.6,c.p.root.position.z,{h:.5});hsCard();};
ACT.hscomb=k=>{const c=HS.cust;if(!c||!c.sat||!HS_STYLES.some(s=>s[0]===k))return;c.hair.style=k;SFX.pop();hsRebuild(c);hsCard();};
ACT.hsdye=k=>{const c=HS.cust;if(!c||!c.sat||!HS_COLS.some(x=>x[0]===k))return;c.hair.col=k;SFX.pop();hsRebuild(c);hsCard();};
ACT.hsdone=()=>{const c=HS.cust;if(!c||!c.sat)return;const h=c.hair,w=c.want,d=hs();let st=5;if(h.len!==w.len)st--;if(h.style!==w.style)st--;if(h.col!==w.col)st--;if(HS_LENS.indexOf(h.len)>HS_LENS.indexOf(w.len))st--;st=Math.max(1,st);
  const pay=HS_PAY[st];S.coins+=pay;d.done++;S.hsTotal=(S.hsTotal||0)+1;HS.last={stars:st,pay};hardEvent('hair',1);SFX.coin();if(st>=4)setTimeout(()=>SFX.yay(),300);popText('+'+pay+' 🪙','coin');change();jobHud(true);
  const line=st===5?pick(["It's exactly what I wanted! 😍","Perfect! I love it! 💕","Wow, just like the picture! ✨"]):st>=3?pick(['Oh, that looks nice! Thank you! 😊','I like it! A bit different, but nice! 💕']):pick(["Hee hee, that's… different! But hair grows back! 😄","Oh my! Well, it's a new look! 😅 Thank you!"]);
  openPanel(`<div class="who" style="--c:#ff9ec4">✂️ ${esc(c.name)}</div><p class="line">${esc(line)}</p><p class="earn">${starsHalf5(st)}<br>You got <b>${pay} 🪙</b>!</p><div class="row"><button class="btn mint" data-a="hsbye">👋 Bye!</button></div>`,{bottom:true,lock:true});};
ACT.hsbye=()=>{const c=HS.cust;if(!c)return;closePanel();c.sat=false;c.leaving=true;hsRebuild(c,true);c.p.wave=1.2;const d=hs();
  setTimeout(()=>{if(PLAYING)toast(d.done>=HS_MAX?`🌟 That's ${HS_MAX} customers! Great job today! More tomorrow.`:'✂️ Nice work! The next customer will come soon.',3.4);},400);};
ACT.hstutgo=()=>{closePanel();setTimeout(hsTutStart,250);};
ACT.pttutgo=()=>{closePanel();setTimeout(ptTutStart,250);};


/* the designer job, every frame */
function dsTick(dt){const d=ds();
  if(!S.dsTut&&S.intro&&!DTUT&&!TUT&&!UI.open&&!CUT&&!CLIMB&&!fading&&!HOST.cur&&(CUR.id==='city'||CUR.id==='client')){dtutT+=dt;if(dtutT>1.2)dtutStart();}else dtutT=0;
  if(!d.o&&d.done<DS_MAX&&!CUT&&!DTUT&&isDaytime()){d.wait-=dt;if(d.wait<=0)dsNew();}
  if(HELD&&!CUT)HELD.visible=false;}

/* runs every frame */
function jobTick(dt){
  jobT+=dt;if(jobT>.25){jobT=0;jobHud();}miniTick(dt);   /* 🗺️ the HUD box and the corner map for everyone, the map drawn the very frame you move or turn (run 4, item 10: it used to draw only inside the delivery and designer ticks, 14 times a second, and never for the teacher or the hairstylist, whose corner map stayed a green circle) */
  if(S.job==='delivery'&&!S.tutDone&&S.intro&&!TUT&&!UI.open&&!CUT&&!CLIMB&&!fading&&!HOST.cur&&CUR.id==='city'){tutT+=dt;if(tutT>1.6)tutStart();}else tutT=0;
  if(S.job==='delivery'&&S.dl&&S.dl.o&&!S.dl.o.flat&&isApt(S.dl.o.h)){const o=S.dl.o,W=oWho(o);o.flat=(1+Math.floor(Math.random()*3))*10+1+Math.floor(Math.random()*5);addMsg('pz','pz',`📩 Order update: ${W.nm} lives in flat ${o.flat} at the ${HOUSE(o.h).n}.`);change();}
  if(S.intro&&!S.jobAsk){askT+=dt;if(askT>2.5&&!UI.open&&!CUT&&!fading&&CUR.id==='city')askJob();}
  dcT+=dt;if(dcT>.3){dcT=0;dcardUpd();}
  if(S.job==='designer'){dsTick(dt);return;}
  if(S.job==='teacher'){tcTick(dt);return;}
  if(S.job==='photo'){ptTick(dt);if(HELD&&!CUT)HELD.visible=false;return;}   /* 📸 run 4, job 15 */
  if(S.job!=='delivery'){if(HELD&&!CUT)HELD.visible=false;return;}   /* (this line used to hide the whole HUD box, corner map included, every frame for everyone without the pizza job: run 4, item 10) */
  const d=dl(),o=d.o;
  if(o&&o.st==='carry'&&!CUT&&!TUT&&!AW.on&&!NET.lost&&!(UI.open&&CUR.id==='pizza')){const was=o.left;o.left-=dt;
    if(o.lim<1800&&was>30&&o.left<=30){toast('⏰ 30 seconds left! Hurry!',2.6);SFX.late();}
    if(was>0&&o.left<=0){toast("⏰ Oh no, you're late! Bring it anyway, quick!",3.4);SFX.late();}}
  /* waiting inside the Pizzeria when pizza time starts: the shift starts by itself */
  if(!o&&!d.on&&CUR.id==='pizza'&&!dlOff()&&!dlAsk()&&pizzaOpen()&&!UI.open&&!CUT&&!TUT&&!fading&&!$('toast').classList.contains('show')){d.on=true;d.wait=Math.min(d.wait,6);change();jobHud(true);chefSay("Pizza time! 🕛 Welcome to work! 🍕 Wait here, an order will come soon!",[['OK!','close']],0,1);}
  if(!o&&d.on&&!dlOff()&&pizzaOpen()&&!CUT){d.wait-=dt;if(d.wait<=0)newOrder();}
  if(!o&&d.on&&!d.end&&d.done<DLV_DAY*2&&!pizzaOpen()&&!UI.open&&!CUT&&!TUT&&!CLIMB&&!fading&&!DECO.on&&!CR&&!$('toast').classList.contains('show'))dlShut();
  if(HELD&&!CUT){HELD.visible=!!(o&&o.st==='carry')&&!DECO.on&&!CR&&CUR.id!=='studio';if(HELD.visible)heldFit();}
}
function jobPhone(){let h;
  if(!S.job)return`<p class="ph-sub">You don't have a job yet! Message <b>Rosie</b> or find her in town to pick one. 💬</p><div class="row"><button class="btn mint" data-a="phchat:ro">💬 Message Rosie</button><button class="btn white" data-a="findrosie">📍 Find Rosie</button></div>`;
  const J=JOBS[S.job];h=`<div class="qcard"><div class="qtop"><span class="qi">${J.i}</span><div><div class="qt">${J.n}</div><div class="qd">${J.d}</div></div></div></div>`;
  if(S.job==='delivery'){const d=dl(),o=d.o;h+=`<p class="ph-sub">Today: <b>${d.done} / ${dlMax()}</b> pizzas delivered<br>🕛 ${PZ_TIME} 🍕</p><div class="qcard"><div class="qtop"><span class="qi">🌟</span><div><div class="qt">Pizza stars: ${starsH(dlStars())}</div><div class="qd"><b>${STAR_T[dlStars()]}</b> · <b>${dlPay()} 🪙</b> for every pizza! Extra pizzas: <b>${dlHalf()} 🪙</b>. Be fast for ⭐ RARE customers to win stars. More stars = more coins!</div></div></div></div>`;
    if(o){const H=HOUSE(o.h);h+=`<div class="qcard"><div class="qtop"><span class="qi">🍕</span><div><div class="qt">${o.r?'⭐ RARE · ':''}${esc(oWho(o).nm)}: ${o.pz} pizza</div><div class="qd">${o.st==='wait'?'Pick it up at the Pizzeria first!':`Take it to the <b>${esc(H.n)}</b>${o.flat?', flat <b>'+o.flat+'</b>':''}. ${o.left>0?'⏱️ '+mmss(o.left):'⏰ Late!'}`}</div></div></div></div>`;}
    h+=`<div class="row"><button class="btn butter" data-a="nav:pizza">📍 Show me the Pizzeria</button><button class="btn sky" data-a="dotpick">🎨 Dot color</button></div>`;}
  if(S.job==='designer'){const d=ds(),o=d.o;h+=`<p class="ph-sub">Today: <b>${d.done} / ${DS_MAX}</b> clients<br>💰 <b>${DS_PAY(0)}–${DS_PAY(3)} 🪙</b> a room: more ⭐ = more coins!</p>`;
    if(o){const T=dsTheme(o),H=HOUSE(o.h),W=dsWho(o);h+=`<div class="qcard"><div class="qtop"><span class="qi">${T.e}</span><div><div class="qt">${esc(W.nm)}: ${esc(dsThemeOf(o,0).n)}${o.r2?' and '+esc(dsThemeOf(o,1).n):''}</div><div class="qd">At the <b>${esc(H.n)}</b>${o.flat?', flat <b>'+o.flat+'</b>':''}. Follow the dot on your map!</div></div></div></div>`;}
    else h+=`<p class="ph-sub">${d.done>=DS_MAX?'🌟 All done for today! More clients tomorrow.':!isDaytime()?workAt()+' Clients message you from 8:00 to 20:00.':'🎨 A client will message you soon!'}</p>`;
    h+=`<div class="row"><button class="btn sky" data-a="dotpick">🎨 Dot color</button><button class="btn white" data-a="dtutgo">📖 Tips</button></div>`;}
  if(S.job==='teacher'){const d=tc(),o=d.o;h+=`<p class="ph-sub">Today: <b>${d.done} / ${TC_MAX}</b> classes taught<br>💰 <b>${TC_PAY(1)}–${TC_PAY(3)} 🪙</b> a class: more ⭐ = more coins!</p>`;
    if(o){const S0=SUBJ[o.subj];h+=`<div class="qcard"><div class="qtop"><span class="qi">${S0.i}</span><div><div class="qt">Teach the ${S0.n} class</div><div class="qd">Go to <b>Cozy Town School</b>. In the hallway, it's ${tcDoor(S0)}.</div></div></div></div>`;}
    else h+=`<p class="ph-sub">${d.done>=TC_MAX?'🌟 All classes done today! More tomorrow.':!isDaytime()?workAt()+' Classes are from 8:00 to 20:00.':'📱 Mrs. Maple will message you when a class needs you.'}</p>`;
    h+=`<div class="row"><button class="btn butter" data-a="nav:school">📍 Show me the school</button><button class="btn sky" data-a="phchat:dr">💬 Messages</button></div>`;}
  if(S.job==='hair'){const d=hs();h+=`<p class="ph-sub">Today: <b>${d.done} / ${HS_MAX}</b> customers<br>💰 <b>${HS_PAY[1]}–${HS_PAY[5]} 🪙</b> a customer: more ⭐ = more coins!</p>
    <p class="ph-sub">${d.done>=HS_MAX?'🌟 All customers done today! More tomorrow.':!isDaytime()?workAt()+' The salon is open from 8:00 to 20:00.':'✂️ Go to the Hair Salon on the west road. Customers come in and sit in your chair!'}</p>
    <div class="row"><button class="btn butter" data-a="nav:salon">📍 Show me the salon</button><button class="btn white" data-a="hstutgo">📖 Tips</button></div>`;}
  return h+`<p class="ph-sub" style="margin-top:14px">Want a different job? Message Rosie!</p><div class="row"><button class="btn white" data-a="phchat:ro">💬 Message Rosie</button></div>`;}

/* intro */
let INTRO=0;const ROSIE=()=>FRIEND_ACTORS[0];
const INTRO_LINES=["Hi! You must be new here! I'm Rosie. I live in this town.","What's your name? And what do you look like? Show me!","{name}! What a great name. And I love your look! Welcome to Cozy Town!","Oh! Everyone in Cozy Town has a job. What job do you want to do?","Your new house is on Friends Lane, just down this road! Follow the pink arrow to find it. 🏡",
  "The market and the pet shop are just down the street. Look for the signs!","I'll be at the park by the fountain. Come find me! Bye for now!"];
function introStep(){const f=ROSIE(),i=INTRO,line=INTRO_LINES[i];f.p.wave=.8;document.body.classList.add('talk');   /* 👋 while Rosie talks: no aim dot on her face, no jump/run buttons on her card */
  if(i===1){openPanel(`<div class="who" style="--c:#ff9ec4">Rosie</div><p class="line">${esc(line)}</p><div class="row"><button class="btn mint" data-a="imake">✨ Make my character</button></div>`,{bottom:true,lock:true});return;}
  if(i===3){JOBCTX='intro';S.jobAsk=true;openPanel(`${rosieHd()}<p class="line">${esc(line)}</p>${jobCards()}<div class="row"><button class="btn white" data-a="jobskip">I'll pick later</button></div>`,{bottom:true,lock:true});return;}
  if(i===4)setNav('home',true);   /* the pink arrow shows up as Rosie talks about it */
  openPanel(`<div class="who" style="--c:#ff9ec4">Rosie</div><p class="line">${esc(fill(line))}</p><div class="row"><button class="btn mint" data-a="inext">${i===INTRO_LINES.length-1?'Bye, Rosie!':'Next'}</button></div>`,{bottom:true,lock:true});}
ACT.inext=()=>{INTRO++;if(INTRO>=INTRO_LINES.length){closePanel();document.body.classList.remove('talk');const f=ROSIE();f.mode='walk';f.node=1;f.prev=2;S.intro=true;frSt('rosie').met=1;addPts(f,3);setNav('home',true);change();toast(TOUCHY?'Drag on the left to walk, and on the right to look around! Tap ⬆️ to jump and 🏃 to run.':'WASD to walk, drag the mouse to look, Space to jump, Shift to run, E to use things.',6);return;}introStep();};
ACT.imake=()=>openCreator('intro');
ACT.iname=()=>{const n=$('nameIn'),v=(n&&n.value||'').trim().slice(0,14);if(!v){n&&n.focus();return;}n.blur();S.name=v;INTRO=2;introStep();};
function startIntro(){const f=ROSIE();f.mode='talk';f.loc='city';f.x=-16.8;f.z=-6.4;f.face=0;P.x=-14.8;P.z=-4.6;P.yaw=.84;P.pitch=innerHeight<500?-.3:-.05;   /* a phone held sideways: look down a bit, so Rosie stands above her card */INTRO=0;setTimeout(introStep,500);}

