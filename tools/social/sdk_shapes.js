/* Cozy Town: do the friends / texts / calls / world chat calls fit the REAL Firebase library? (25 Nov 2026)
   Loads the two library files the game ships (js/lib-1.js, js/lib-2.js), kept OFFLINE: a made-up local address, goOffline(), and
   WebSocket / XMLHttpRequest / fetch that throw. Nothing can reach any server. Every call shape the social code uses is made once:
   the library checks its arguments right away and throws on a bad path, key or value (the kit's pretend Firebase takes anything).
   Run:  node tools/social/sdk_shapes.js        Ends with "SDK SHAPES: n of n accepted". It does not try the rules or a server. */
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=process.argv[2]||path.join(__dirname,'..','..');
const ctx={console,setTimeout,clearTimeout,setInterval,clearInterval,TextEncoder,TextDecoder,URL,Promise,navigator:{userAgent:'node',onLine:false},location:{protocol:'https:',hostname:'cozy.test',href:'https://cozy.test/'},
  document:{readyState:'complete',addEventListener(){},createElement(){return{}}},addEventListener(){},removeEventListener(){},localStorage:{getItem(){return null},setItem(){},removeItem(){}},sessionStorage:{getItem(){return null},setItem(){},removeItem(){}},
  WebSocket:function(){throw new Error('NO NETWORK IN THIS TEST');},XMLHttpRequest:function(){throw new Error('NO NETWORK IN THIS TEST');},fetch(){throw new Error('NO NETWORK IN THIS TEST');},atob,btoa,crypto};
ctx.self=ctx.window=ctx.globalThis=ctx;vm.createContext(ctx);
for(const f of ['lib-1.js','lib-2.js'])vm.runInContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),ctx,{filename:f});
const out=vm.runInContext(`(()=>{const fb=self.firebase,app=fb.initializeApp({databaseURL:'http://127.0.0.1:9/?ns=zztest-offline'}),db=fb.database(app);db.goOffline();
  const TS=fb.database.ServerValue.TIMESTAMP,R=db.ref('worlds/cozy-town/social'),sid='A'.repeat(22),tid='T'.repeat(43),id='0mwvc03srpp5',res=[];
  const t=(what,f)=>{try{const r=f();if(r&&r.catch)r.catch(()=>{});res.push('ok    | '+what);}catch(e){res.push('THROW | '+what+' | '+e.message);}};
  const cb=()=>{};
  t('SDK version '+fb.SDK_VERSION,()=>0);
  t('inbox: child(in/sid).limitToLast(30).on(value, cb, cancel)',()=>{const r=R.child('in/'+sid);if(typeof r.limitToLast!=='function')throw new Error('no limitToLast');r.limitToLast(30).on('value',cb,cb);});
  t('sealed note: update({in/sid/id: {e,c,at:TS}, ir/sid: {t:TS,id}})',()=>R.update({['in/'+sid+'/'+id]:{e:'B'+'e'.repeat(86),c:'c'.repeat(154),at:TS},['ir/'+sid]:{t:TS,id}}));
  t('tidy a note: child(in/sid/id).remove()',()=>R.child('in/'+sid+'/'+id).remove());
  t('thread: child(t/tid/s).on / off',()=>{const q=R.child('t/'+tid+'/s'),c=q.on('value',cb,cb);if(c!==cb)throw new Error('on() did not hand back the callback');q.off('value',c);});
  t('my side: child(t/tid/s/a).set({s,at:TS,n})',()=>R.child('t/'+tid+'/s/a').set({s:'r',at:TS,n:'n'.repeat(75)}));
  t('texts: child(t/tid/m).limitToLast(60).on / off',()=>{const q=R.child('t/'+tid+'/m').limitToLast(60);q.on('value',cb,cb);q.off('value',cb);});
  t('a text: child(t/tid).update({m/id: {f,c,at:TS}, x/a: {t:TS,id}})',()=>R.child('t/'+tid).update({['m/'+id]:{f:'a',c:'c'.repeat(60),at:TS},['x/a']:{t:TS,id}}));
  t('tidy old lines: orderByKey().limitToFirst(20).on / off, child(id).remove()',()=>{const r=R.child('g');if(typeof r.orderByKey!=='function')throw new Error('no orderByKey');const q=r.orderByKey().limitToFirst(20);q.on('value',cb,cb);q.off('value',cb);r.child(id).remove();});
  t('world chat: child(g).limitToLast(50).on / off',()=>{const q=R.child('g').limitToLast(50);q.on('value',cb,cb);q.off('value',cb);});
  t('a chat line: update({g/id: {s,n,t,at:TS}, gl: {t:TS,id}})',()=>R.update({['g/'+id]:{s:sid,n:'ZZTEST',t:'Hello 👋 ąčę',at:TS},gl:{t:TS,id}}));
  t('call note: child(t/tid/s/ca).onDisconnect().remove() and set({i,k,d,at:TS})',()=>{const r=R.child('t/'+tid+'/s/ca'),p=r.onDisconnect().remove();if(!p||!p.catch)throw new Error('onDisconnect().remove() gave no promise');p.catch(()=>{});return r.set({i:id,k:'o',d:'d'.repeat(5000),at:TS});});
  t('hang up: set({i,k:x,at:TS})',()=>R.child('t/'+tid+'/s/ca').set({i:id,k:'x',at:TS}));
  return res;})()`,ctx);
console.log(out.join('\n'));const bad=out.filter(l=>l.startsWith('THROW')).length;console.log('SDK SHAPES: '+(out.length-bad)+' of '+out.length+' accepted by the real SDK (offline)');process.exit(bad?1:0);
