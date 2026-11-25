/* Cozy Town: the friends logic played without a browser (25 Nov 2026). Three "players", each with its own copy of the game's
   social code (cut out of js/08-hud.js as it is), on one pretend database that keeps tools/social/firebase-rules.json (targaryen,
   an open-source stand-in for the rules engine; not Google's own). About 70 seconds, no browser lock needed.
   Run:  mkdir -p /tmp/rt && cd /tmp/rt && npm install --no-save targaryen@3.1.0
         NODE_PATH=/tmp/rt/node_modules node tools/social/logic_test.js
   What it plays: ask -> yes -> texts -> a text while the friend is away -> remove -> ask again -> no -> block -> unblock ->
   remove and ask again while the friend is away (no silent "friends again") -> both ask at once -> a forged yes (somebody who knows
   the thread writes the other player's half: that player must NOT become a friend) -> the world chat, a blocked player, two lines
   in the same second, the grown-ups' switch. Ends with "LOGIC: n of n". The phone screens and calls are in test_social.py. */
const fs=require('fs'),targaryen=require('targaryen');
const path=require('path'),ROOT=path.join(__dirname,'..','..');
const src=fs.readFileSync(path.join(ROOT,'js','08-hud.js'),'utf8'),mod=src.slice(src.indexOf('/* ================= 💌 friends'));
const game=fs.readFileSync(path.join(ROOT,'js','03-game.js'),'utf8');
const cleanNameSrc=game.match(/function cleanName\(n\)\{[^\n]*?\}\n/)[0];
const hud=src.slice(0,src.indexOf('/* ================= 💌 friends'));
const bdSrc=hud.match(/const BD_ROOT=[\s\S]*?\nfunction bdBad\(s\)\{[\s\S]*?\n  return \[t\.replace[^\n]*\n/)[0];
let rules=JSON.parse(fs.readFileSync(path.join(__dirname,'firebase-rules.json'),'utf8'));
let db=targaryen.database(rules,{},Date.now()),tree={},denied=[];const L=new Map();
const get=p=>{let n=tree;for(const k of p.split('/').filter(Boolean)){if(n==null||typeof n!=='object'||!(k in n))return null;n=n[k];}return n===undefined?null:n;};
const put=(p,v)=>{const ks=p.split('/').filter(Boolean);let n=tree;for(const k of ks.slice(0,-1)){if(typeof n[k]!=='object'||n[k]==null)n[k]={};n=n[k];}if(v==null)delete n[ks[ks.length-1]];else n[ks[ks.length-1]]=v;
  for(let i=ks.length-1;i>0;i--){const par=get(ks.slice(0,i).join('/'));if(par&&typeof par==='object'&&!Object.keys(par).length)put(ks.slice(0,i).join('/'),null);else break;}};
const stamp=(v,now)=>v&&typeof v==='object'?(v['.sv']==='timestamp'?now:Object.fromEntries(Object.entries(v).map(([k,x])=>[k,stamp(x,now)]))):v;
const notify=p=>{for(const [lp,S] of L)if(lp===p||lp.startsWith(p+'/')||p.startsWith(lp+'/'))for(const cb of [...S])setImmediate(()=>{if(S.has(cb))cb({val:()=>{const v=get(lp);return v==null?null:JSON.parse(JSON.stringify(v));}});});};
function write(op,p,val){return new Promise((ok,no)=>setImmediate(()=>{const now=Date.now();val=stamp(val,now);const r=op==='update'?db.update(p,val,{now}):db.write(p,val==null?null:val,{now});
  if(!r.allowed){denied.push(op+' '+p+' '+(op==='update'?Object.keys(val).join(','):''));const e=new Error('PERMISSION_DENIED');return no(e);}db=r.newDatabase;
  if(op==='update')for(const k in val)put(p+'/'+k,val[k]);else put(p,val);notify(p);ok();}));}
const norm=p=>String(p).replace(/^\/+|\/+$/g,'');
function ref(p,ctx){p=norm(p);const disc=ctx.disc;return{key:p.split('/').pop(),child:k=>ref(p+'/'+k,ctx),set:v=>write('set',p,v),update:v=>write('update',p,v),remove:()=>write('set',p,null),
  onDisconnect:()=>({remove:()=>{disc.add(p);return Promise.resolve();}}),
  on:(ev,cb,err)=>{setImmediate(()=>{const r=db.read(p,{now:Date.now()});if(!r.allowed){denied.push('listen '+p);if(err)err(new Error('PERMISSION_DENIED'));return;}if(ctx.gone)return;if(!L.has(p))L.set(p,new Set());L.get(p).add(cb);ctx.mine.add(cb);cb({val:()=>{const v=get(p);return v==null?null:JSON.parse(JSON.stringify(v));}});});return cb;},
  off:(ev,cb)=>{const S=L.get(p);if(S)S.delete(cb);}};}
function player(name,save){const ctx={disc:new Set(),mine:new Set(),gone:false},disc=ctx.disc,mine=ctx.mine,toasts=[];
  const fb={database:Object.assign(()=>({ref:p=>ref(p,ctx)}),{ServerValue:{TIMESTAMP:{'.sv':'timestamp'}}})};
  const body=`const TENC=new TextEncoder(),CLK={off:0},SET={},ACT={},MP={peers:new Map(),list:[]},PH={},SFX=new Proxy({},{get:()=>()=>{}});let S=save||{name:NAME},PLAYING=true;
    const window={firebase:fb,WEBNET:{on:true},WEBROOM:async()=>({}),crypto,RTCPeerConnection:null},WEBNET=window.WEBNET,WEBROOM=window.WEBROOM,navigator={};
    const saveLocal=()=>{},change=()=>{},toast=(m)=>{toasts.push(m);},phoneOpen=()=>false,updPhoneBadge=()=>{},renderPhone=()=>{},mpUI=()=>{},audioInit=()=>{},tone=()=>{},openSettings=()=>{},saveSet=()=>{},cardMore=()=>{};
    const addEventListener=()=>{},$=()=>null,document={querySelector:()=>null,createElement:()=>({setAttribute(){},addEventListener(){},style:{}}),body:{appendChild(){}}},realDate=()=>new Date(),esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
    ${cleanNameSrc}\n${bdSrc}\n${mod}
    return {SOC,S:()=>S,MP,PH,SOCAPP,socMine,socAsks,socRow,socChats,socTabs,socBubs,socInit,socAsk,socAnswer,socRemove,socBlock,socSend,socSay,socUnread,socAskN,socPeer,socWorld,socShown,socStamp,ACT,socCall,socRing,toasts,disc,name:NAME,SET,
      leave(){ctx.gone=true;for(const [lp,Sx] of L){for(const cb of [...Sx])if(mine.has(cb))Sx.delete(cb);}for(const p of disc)write('set',p,null).catch(()=>{});},};`;
  return new Function('NAME','save','fb','toasts','crypto','L','write','mine','disc','ctx',body)(name,save,fb,toasts,crypto,L,write,mine,disc,ctx);}
const sleep=ms=>new Promise(ok=>setTimeout(ok,ms));
async function until(f,ms=3000){const t=Date.now();while(Date.now()-t<ms){if(f())return true;await sleep(20);}return false;}
const meet=(...ps)=>{for(const a of ps)for(const b of ps)if(a!==b){let o=a.MP.peers.get(b.name);if(!o){o={nm:b.name,peer:b.name};a.MP.peers.set(b.name,o);}const st={};b.socStamp(st);a.socPeer(o,st);}};
const fr=p=>Object.values(p.S().soc.fr).map(f=>f.n+':'+f.s).join(',')||'-';
let n=0,bad=0;const ok=(what,c,d)=>{n++;if(!c)bad++;console.log((c?'PASS':'FAIL')+' | '+what+(d!==undefined?' | '+d:''));};
(async()=>{
  const A=player('Ana'),B=player('Ben'),C=player('Cat');
  await Promise.all([A,B,C].map(p=>p.socInit()));await until(()=>[A,B,C].every(p=>p.SOC.st==='on'));
  ok('three players on',[A,B,C].every(p=>p.SOC.st==='on'),[A,B,C].map(p=>p.SOC.st)+' denied '+denied);meet(A,B,C);
  const pk=p=>p.SOC.me.pk,sid=p=>p.SOC.me.sid;
  await A.socAsk(pk(B),'Ben');await until(()=>B.socAskN()===1);
  ok('request arrives; not friends yet',fr(A)==='Ben:out'&&fr(B)==='Ana:in',fr(A)+' / '+fr(B)+' toasts '+B.toasts.slice(-1));
  ok('no text before yes',await A.socSend(sid(B),'hi')===false);
  B.socAnswer(sid(A),1);await until(()=>fr(A)==='Ben:ok');ok('accepted on both',fr(A)==='Ben:ok'&&fr(B)==='Ana:ok',fr(A)+' / '+fr(B)+' | '+A.toasts.slice(-1));
  await sleep(300);ok('text A->B',await A.socSend(sid(B),'Hello Ben')===true);await until(()=>B.socUnread()===1);ok('B unread 1',B.socUnread()===1,B.toasts.slice(-1)[0]);
  await sleep(100);ok('text B->A at once',await B.socSend(sid(A),'Hi Ana')===true);await until(()=>A.SOC.th[sid(B)].msgs.length===2);
  ok('both threads in order',JSON.stringify(A.SOC.th[sid(B)].msgs.map(m=>A.SOC.th[sid(B)].txt[m.id]))==='["Hello Ben","Hi Ana"]'&&B.SOC.th[sid(A)].msgs.length===2);
  ok('too fast is stopped by the game',await A.socSend(sid(B),'again')===false);
  // offline delivery: B leaves, A writes, B comes back from its save
  const saveB=JSON.parse(JSON.stringify(B.S()));B.leave();A.MP.peers.delete('Ben');await sleep(1600);
  ok('text while B is away',await A.socSend(sid(B),'Are you there?')===true);
  const B2=player('Ben',saveB);await B2.socInit();await until(()=>B2.SOC.st==='on'&&B2.socUnread()>=1);ok('B back: the texts waited (2 unread: B never opened the thread here)',B2.socUnread()===2&&fr(B2)==='Ana:ok',B2.socUnread()+' '+fr(B2));meet(A,B2,C);
  // remove
  A.socRemove(sid(B2));await until(()=>fr(B2)==='-');ok('A removes: both empty',fr(A)==='-'&&fr(B2)==='-',fr(A)+' / '+fr(B2)+' | '+B2.toasts.slice(-1));
  await sleep(1600);ok('no text after removal',await B2.socSend(sid(A),'hey')===false);
  // ask again -> must be a new request, not friends
  await sleep(3100);await A.socAsk(pk(B2),'Ben');await until(()=>B2.socAskN()===1);ok('ask again: a new request, not friends',fr(A)==='Ben:out'&&fr(B2)==='Ana:in',fr(A)+' / '+fr(B2));
  B2.socAnswer(sid(A),0);await until(()=>fr(A)==='-');ok('B says no: gone on both',fr(A)==='-'&&fr(B2)==='-',A.toasts.slice(-1)[0]);
  // block
  await sleep(3100);await A.socAsk(pk(B2),'Ben');await until(()=>B2.socAskN()===1);B2.socBlock(sid(A),'Ana');await until(()=>fr(A)==='-');
  ok('B blocks from the request',fr(B2)==='-'&&Object.keys(B2.S().soc.bl).length===1&&fr(A)==='-',fr(A)+' / '+fr(B2));
  await sleep(3100);await A.socAsk(pk(B2),'Ben');await sleep(800);ok('blocked: the new request never shows',fr(B2)==='-'&&B2.socAskN()===0&&fr(A)==='Ben:out',fr(A)+' / '+fr(B2));
  B2.ACT.funb(sid(A));await until(()=>B2.socAskN()===1);ok('unblock: the waiting request shows',fr(B2)==='Ana:in',fr(B2));
  B2.socAnswer(sid(A),1);await until(()=>fr(A)==='Ben:ok');ok('friends again after a real yes',fr(A)==='Ben:ok'&&fr(B2)==='Ana:ok');
  // remove + ask again while the other is away: must not be silent friends
  const saveB2=JSON.parse(JSON.stringify(B2.S()));B2.leave();A.MP.peers.delete('Ben');A.socRemove(sid(B2));await sleep(3100);A.MP.peers.set('Ben',{nm:'Ben',peer:'Ben'});await A.socAsk(saveB2.soc&&pk(B2),'Ben');await sleep(500);
  ok('removed and asked again while B is away: A only waits',fr(A)==='Ben:out',fr(A));
  const B3=player('Ben',saveB2);await B3.socInit();await until(()=>B3.SOC.st==='on'&&fr(B3)==='Ana:in');ok('B comes back: sees a request to answer, is not a silent friend',fr(B3)==='Ana:in',fr(B3));
  ok('...and A still waits',fr(A)==='Ben:out',fr(A));B3.socAnswer(sid(A),1);await until(()=>fr(A)==='Ben:ok');ok('yes -> friends',fr(A)==='Ben:ok'&&fr(B3)==='Ana:ok');
  // the phone's screens are built as text: every one must come out whole in every state (the browser test looks at them drawn)
  { meet(A,B3,C);const htmlOK=h=>typeof h==='string'&&!/undefined|NaN|\[object|null/.test(h),out=[];B3.PH.fc=sid(A);B3.PH.app='sms';
    const C2=await (async()=>{await C.socAsk(pk(B3),'Cat');await until(()=>B3.socAskN()===1,6000);return 1;})();
    const scr={friends:B3.socTabs('mp')+B3.socAsks()+B3.socRow(B3.MP.peers.get('Ana'),0)+B3.socRow(B3.MP.peers.get('Cat'),1)+B3.socMine(),chats:B3.socChats(),thread:B3.SOCAPP.sms(),world:(B3.PH.app='gc',B3.SOCAPP.gc()),
      card:(B3.PH.app='fc',B3.PH.ask='',B3.SOCAPP.fc()),cardRemove:(B3.PH.ask='rm',B3.SOCAPP.fc()),cardBlock:(B3.PH.ask='bl',B3.SOCAPP.fc()),cardRequest:(B3.PH.fc=sid(C),B3.PH.ask='',B3.SOCAPP.fc()),blocked:B3.SOCAPP.blk(),gone:(B3.PH.fc='nobody',B3.SOCAPP.fc()),closed:(B3.PH.app='sms',B3.SOCAPP.sms())};
    for(const k in scr)if(!htmlOK(scr[k]))out.push(k+': '+String(scr[k]).slice(0,160));
    ok('every phone screen builds whole (11 screens with a friend, a request and a blocked player)',!out.length&&/fyes:/.test(scr.friends)&&/fcall:/.test(scr.friends)&&/sms:/.test(scr.chats)&&/socIn/.test(scr.thread)&&/Take a|Remove/.test(scr.cardRemove)&&/funb:|Nobody/.test(scr.blocked),out.join(' | ')||Object.keys(scr).map(k=>k+' '+scr[k].length).join(', '));
    B3.socAnswer(sid(C),0);await until(()=>B3.socAskN()===0); await sleep(3200); }
  // both ask at the same moment
  meet(A,B3,C);await Promise.all([C.socAsk(pk(A),'Ana'),A.socAsk(pk(C),'Cat')]);await until(()=>fr(C)==='Ana:ok'&&/Cat:ok/.test(fr(A)),6000);ok('both asked each other: friends',fr(C)==='Ana:ok'&&/Cat:ok/.test(fr(A)),fr(A)+' / '+fr(C));
  // a forged yes: Cat's own half written by somebody who knows the thread (Ana) must not make Cat a friend of a stranger... (Ben asks Cat, then writes Cat's half himself)
  await B3.socAsk(pk(C),'Cat');const gotReq=await until(()=>C.socAskN()===1,6000);const T=B3.SOC.th[sid(C)];
  await ref('worlds/cozy-town/social/t/'+T.tid+'/s/'+(T.slot==='a'?'b':'a'),{disc:new Set(),mine:new Set()}).set({s:'y',at:{'.sv':'timestamp'}});await sleep(600);
  ok("a forged yes: the cheater's own game may think so, but Cat does not become Ben's friend (the request just goes)",gotReq&&!/Ben/.test(fr(C))&&/Cat:ok/.test(fr(B3)),'Cat: '+fr(C)+' | Ben: '+fr(B3));
  await sleep(1600);const junk=await B3.socSend(sid(C),'let me in');await sleep(400);ok("...and what the cheater then writes never shows on Cat's side",C.socUnread()===0&&!C.SOC.th[sid(B3)]&&C.toasts.every(t=>!/let me in/.test(t)),'sent '+junk+'; Cat unread '+C.socUnread());
  // the world chat
  await sleep(1100);ok('world chat line',await A.socSay('Hello everyone')===true);await until(()=>C.SOC.g.length===1);ok('others see it',C.SOC.g.length===1&&B3.SOC.g.length===1);
  ok('rude line refused by the game',await B3.socSay('you idiot')===false);
  C.socBlock(sid(B3),'Ben');await sleep(1100);await B3.socSay('Ben here');await until(()=>A.SOC.g.length===2);ok('blocked player hidden for Cat only',C.socShown().length===1&&A.socShown().length===2,C.socShown().length+' / '+A.socShown().length);
  await sleep(4100);const two=await Promise.all([A.socSay('at the same time 1'),C.socSay('at the same time 2')]);await sleep(300);ok('two lines in the same second: both arrive (one after a second try)',two.every(Boolean)&&A.SOC.g.length===4,two+' lines '+A.SOC.g.length);
  // the grown-ups' switch
  A.SET.wchat=false;A.socWorld(false);ok('world chat off: nothing kept, nothing sent',A.SOC.g.length===0&&!A.SOC.qg&&await A.socSay('still here?')===false);
  A.SET.wchat=true;A.socWorld(true);await until(()=>A.SOC.g.length>=4);ok('world chat on again',A.SOC.g.length>=4,A.SOC.g.length);
  console.log('refused by the rules during play:',denied.length?denied:'nothing');
  console.log(`LOGIC: ${n-bad} of ${n}`+(bad?` · ${bad} FAIL`:''));process.exit(bad?1:0);
})().catch(e=>{console.error('LOGIC TEST CRASHED',e);process.exit(2);});
