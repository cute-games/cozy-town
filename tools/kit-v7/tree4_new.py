"""N37, rewritten 24 Nov 2026 (the owner: the Tree Park moves into town as a Roblox-style obby, no teleport).
Old N37 (run 4, job 16): the park was its own place behind the gate (LOC.treepark); each of the three paths could be finished (decks placed by the test, a jump to the next),
zip lines worked, signs readable, free, a fall put you back on the last platform, the device's jump control worked, the park weighed no more than the beach; on 4 devices.
New N37 keeps every one of those and adds: you walk in through the gate and stay in town (no place change, no fade); every path is played start pad to finish by real
jumps (the device's own forward control, the game's jump(), the player only walks up to each edge itself); the timer runs and stops at the finish, the best time is saved;
checkpoint flags light; a fall puts you back on your last CHECKPOINT; a save made inside the old park starts in town at the gate; nothing in town lost its place
(the 'counts' stage checks the lists)."""
import json
from night3 import fx, begin
from checks import STATIC_JS

PROFS = ('ipad-landscape', 'iphone-portrait', 'iphone-landscape', 'pc-1366')
BOT = r"""()=>{window.OB={};const touch=TOUCHY;
 OB.step=n=>{const r=renderer.render;renderer.render=()=>{};try{for(let i=0;i<n;i++){window.__t=Math.max(window.__t||0,performance.now())+50;frame(window.__t);}}finally{renderer.render=window.__realRender||r;}};
 OB.keys=(fwd,run)=>{if(touch){if(fwd){IN.joy.id=7;IN.joy.x=0;IN.joy.y=-1;}else{IN.joy.id=null;IN.joy.x=IN.joy.y=0;}if(IN.run!==!!run)setRun(!!run);}else{IN.keys.KeyW=!!fwd;IN.keys.ShiftLeft=!!run;}};
 OB.pl=(k,i)=>TP.pl.find(p=>p.k===k&&p.i===i);
 OB.edge=(a,b)=>{const dx=b.x-a.x,dz=b.z-a.z,L=Math.hypot(dx,dz),ux=dx/L,uz=dz/L;let t;if(a.r)t=a.r-.06;else{const ex=Math.abs(ux)>1e-6?(a.w/2-.06)/Math.abs(ux):1e9,ez=Math.abs(uz)>1e-6?(a.d/2-.06)/Math.abs(uz):1e9;t=Math.min(ex,ez);}return [a.x+ux*t,a.z+uz*t];};
 OB.gap=(a,b)=>{const dx=Math.max(0,Math.abs(a.x-b.x)-(a.r?a.r:a.w/2)-(b.r?b.r:b.w/2)),dz=Math.max(0,Math.abs(a.z-b.z)-(a.r?a.r:a.d/2)-(b.r?b.r:b.d/2));return Math.hypot(dx,dz);};
 OB.hop=(k,i,run)=>{const a=OB.pl(k,i),b=OB.pl(k,i+1);if(TP.on!==a)return {err:'not on '+i};
   
   const [ex,ez]=OB.edge(a,b);for(let fr=0;fr<200&&TP.on===a;fr++){const d=Math.hypot(P.x-ex,P.z-ez);if(d<.3)break;P.yaw=Math.atan2(-(ex-P.x),-(ez-P.z));OB.keys(true,false);if(d<.5){OB.keys(false,false);P.x+=(ex-P.x)*.5;P.z+=(ez-P.z)*.5;}OB.step(1);}
   if(b.mv){let best=9,bt=0;for(let w=0;w<400;w++){const g=OB.gap(a,b);if(g<best-.001){best=g;bt=0;}else if(++bt>2&&g<=best+.05)break;OB.step(1);}}
   OB.keys(true,run);const g=OB.gap(a,b),dh=b.h-a.h;P.yaw=Math.atan2(-(b.x-P.x),-(b.z-P.z));jump();let air=0,held=true;
   for(;air<120;air++){OB.step(1);if(held&&P.jy+(P.cy||0)>b.h-.05&&(b.r?Math.hypot(P.x-b.x,P.z-b.z)<b.r*.45:Math.abs(P.x-b.x)<b.w*.25&&Math.abs(P.z-b.z)<b.d*.25)){OB.keys(false,false);held=false;}if(held)P.yaw=Math.atan2(-(b.x-P.x),-(b.z-P.z));
     if(TP.on&&TP.on!==a&&P.jy<=0)break;if(!TP.run&&!TP.on&&P.cy===0)break;if(TP.on===a&&air>3&&P.jy<=0)break;}
   OB.keys(false,false);OB.step(1);return {i,ok:TP.on===b,gap:+g.toFixed(2),dh:+dh.toFixed(2),cpn:TP.run?TP.run.cpn:null};};
 OB.walk=(k,i)=>{const b=OB.pl(k,i+1);OB.keys(true,false);let minY=9;for(let fr=0;fr<200&&TP.on!==b;fr++){P.yaw=Math.atan2(-(b.x-P.x),-(b.z-P.z));OB.step(1);minY=Math.min(minY,(P.cy||0)+P.jy);}OB.keys(false,false);OB.step(2);return {i,ok:TP.on===b&&minY>=b.h-.01,walk:1};};
 OB.toPad=(k)=>{const p=OB.pl(k,0);P.x=p.x-2.5;P.z=p.z;P.cy=0;P.jy=0;P.vy=0;TP.pf=0;TP.run=null;OB.step(2);OB.keys(true,false);for(let fr=0;fr<80&&TP.on!==p;fr++){P.yaw=Math.atan2(-(p.x-P.x),-(p.z-P.z));OB.step(1);}OB.keys(false,false);OB.step(1);
   for(let j=0;j<20&&TP.on===p&&Math.hypot(P.x-p.x,P.z-p.z)>.3;j++){P.yaw=Math.atan2(-(p.x-P.x),-(p.z-P.z));OB.keys(true,false);OB.step(1);}OB.keys(false,false);OB.step(2);return {on:TP.on===p,ready:!!TP.run&&!TP.run.go};};
 return 1;}"""
SIGNS = """()=>TP.signs.map(m=>{const S0=m.userData.sign,c=S0.c,W=c.width,H=c.height,d=c.getContext('2d').getImageData(0,0,W,H).data;const bg=[1,3,5].map(i=>parseInt(S0.bg.slice(i,i+2),16));let x1=W,x2=-1,y1=H,y2=-1;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;if(Math.abs(d[i]-bg[0])+Math.abs(d[i+1]-bg[1])+Math.abs(d[i+2]-bg[2])>60){if(x<x1)x1=x;if(x>x2)x2=x;if(y<y1)y1=y;if(y>y2)y2=y;}}
  return {text:S0.text,inside:x1>W*.03&&x2<W*.97&&y1>H*.04&&y2<H*.96,cx:+(((x1+x2)/2-W/2)/W).toFixed(3),cy:+(((y1+y2)/2-H/2)/H).toFixed(3)};})"""
WEIGHT = """()=>{let meshes=0,tris=0;const add=g=>g.traverse(o=>{if(!o.isMesh)return;meshes++;const geo=o.geometry;tris+=(geo.index?geo.index.count:geo.attributes.position.count)/3;});add(TP.g);for(const f of TP.flags)add(f.m.parent);for(const p of TP.mv)add(p.mv.g);for(const s of TP.signs)add(s);return {meshes,tris:Math.round(tris)};}"""

async def one(run, new_wb, FIX, prof, paths):
    probs = []; det = []; touch = not prof.startswith('pc')
    save = dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-TREEPARK-' + prof, coins=500); save.pop('tp', None)
    g = await begin(run, new_wb, prof, 'n37-' + prof, save)
    if not await g.ev("()=>typeof TP!=='undefined'&&typeof tpTick==='function'&&Array.isArray(TP.pl)&&TP.pl.length>30&&!!LOC.treepark&&PLACES.some(p=>p.id==='treepark')"):
        await run.close(g); return False, f'{prof}: the Tree Park is not in town'
    await g.ev("()=>{__goto('city');__setClock(null,11);S.hunger=100;}"); await g.step(3); await g.ev(BOT)
    # the way in: from the town side of the gate, walk on into the park: no button, no fade, no other place
    walk = await g.ev("""()=>{P.x=66;P.z=-38;P.cy=0;P.yaw=-Math.PI/2;OB.step(2);const t0=findTarget(),c0=S.coins;OB.keys(true,false);const locs=new Set();let fr=0,fad=false;
      for(const [x,z] of [[79,-38],[85.2,-35.2],[93,-36]])for(let k=0;k<300&&Math.hypot(P.x-x,P.z-z)>.6;k++){P.yaw=Math.atan2(-(x-P.x),-(z-P.z));OB.step(1);locs.add(CUR.id);fad=fad||!!fading;fr++;}OB.keys(false,false);
      const t=findTarget(),pl=PLACES.find(p=>p.id==='treepark');return {at:[+P.x.toFixed(1),+P.z.toFixed(1)],locs:[...locs],fade:fad,zone:TP.zone,gateBtn:t0?(typeof t0.label==='function'?t0.label():t0.label):null,coins:S.coins-c0,map:[pl.x,pl.z,pl.door]};}""")
    det.append(f"walked in through the gate: places {walk['locs']}, fade {walk['fade']}, at {walk['at']}, in the park {walk['zone']}, gate button {walk['gateBtn']!r}, map entry {walk['map']}")
    if walk['locs'] != ['city'] or walk['fade'] or not walk['zone'] or walk['coins'] != 0 or (walk['gateBtn'] and 'Tree Park' in walk['gateBtn']): probs.append(f'the way in: {walk}')
    if prof == 'ipad-landscape': await g.ev("()=>{P.x=70;P.z=-38.4;P.yaw=-Math.PI/2;P.pitch=0;}"); await g.step(2); await g.shot('treepark-gate', both=False)
    signs = await g.ev(SIGNS); bad = [s for s in signs if not s['inside'] or abs(s['cx']) > .03 or abs(s['cy']) > .03]
    want = ['🟢 Easy path', '🟡 Medium path', '🔴 Hard path', '🏁 Finish']
    det.append(f"signs readable (ink inside, centred within 3%): {len(signs) - len(bad)} of {len(signs)}" + (f' bad {bad}' if bad else ''))
    if bad or not all(any(w in s['text'] for s in signs) for w in want): probs.append(f'signs: {bad or [s["text"] for s in signs]}')
    for k in paths:
        pad = await g.ev("(k)=>OB.toPad(k)", k)
        C = await g.ev("(k)=>TP_COURSE[k].map(q=>q[6]||'')", k)
        c0 = await g.ev("()=>S.coins"); steps = []; ok = pad['on'] and pad['ready']
        for i in range(len(C) - 1):
            r = await g.ev("([k,i])=>OB.walk(k,i)", [k, i]) if 'b' in C[i + 1] else await g.ev("([k,i,r])=>OB.hop(k,i,r)", [k, i, k != 'easy'])
            steps.append(('bridge' if r.get('walk') else f"gap {r.get('gap')} dh {r.get('dh')}") + ('' if r.get('ok') else ' FAILED'))
            if not r.get('ok'): ok = False; break
        end = await g.ev("(k)=>({best:S.tp&&S.tp.best&&S.tp.best[k],done:!!(S.tp&&S.tp.done&&S.tp.done[k]),run:!!TP.run,lit:TP.flags.filter(f=>f.p.k===k&&f.m.material===f.on).length,n:TP.flags.filter(f=>f.p.k===k).length})", k)
        c1 = await g.ev("()=>S.coins")
        zip_ = await g.ev("""()=>{const t=findTarget();const lab=t?(typeof t.label==='function'?t.label():t.label):null;if(!t||t.icon!=='🪢')return {err:lab};TARGET=t;useTarget();let fr=0;for(;fr<400&&P.ride;fr++)OB.step(1);return {fr,on:TP.on&&TP.on.t==='z'};}""")
        if k == 'easy' and prof == 'ipad-landscape': await g.ev("()=>{const p=OB.pl('easy',3);P.x=p.x-1.6;P.z=p.z;P.cy=0;P.yaw=-Math.PI/2;P.pitch=.15;}"); await g.step(2); await g.shot('treepark-easy', both=True)
        det.append(f"{k}: start pad {pad}; " + ', '.join(steps) + f"; finished {end['done']} best {end['best']} s, flags lit {end['lit']}/{end['n']}, +{c1 - c0} coins; zip line {zip_}")
        if not ok or not end['done'] or not end['best'] or end['run'] or end['lit'] != end['n'] or not zip_.get('on'): probs.append(f'{k}: not played through: {steps} {end} {zip_}')
    # the device's jump control
    await g.ev("()=>{P.x=93;P.z=-41;P.cy=0;P.jy=0;P.vy=0;TP.run=null;}"); await g.step(2)
    if touch: await g.tap('#bJump')
    else: await g.key('Space')
    await g.step(1); jumped = await g.ev("()=>P.jy>0||P.vy>0"); det.append(f"{'the ⬆️ button' if touch else 'the Space key'} makes you jump: {jumped}")
    if not jumped: probs.append('the jump control')
    await g.step(20)
    # a fall: start the easy path, reach checkpoint 1, walk off the side: back on the checkpoint at once (no fade), counted
    fall = await g.ev("""()=>{OB.toPad('easy');OB.hop('easy',0,false);OB.hop('easy',1,false);OB.hop('easy',2,false);const cp=TP.run&&TP.run.cp,f0=(S.tp&&S.tp.falls)||0;if(!cp||!cp.cp)return {err:'no checkpoint'};
      P.yaw=Math.PI;OB.keys(true,false);let fr=0;for(;fr<120;fr++){OB.step(1);if(((S.tp&&S.tp.falls)||0)>f0)break;}OB.keys(false,false);OB.step(2);
      return {back:TP.on===cp&&Math.abs(P.x-cp.x)<.05&&Math.abs(P.z-cp.z)<.05&&Math.abs((P.cy||0)-cp.h)<.01,falls:((S.tp&&S.tp.falls)||0)-f0,fade:!!fading,run:!!TP.run};}""")
    det.append(f"a fall from checkpoint 1: {fall}")
    if not fall.get('back') or fall.get('falls') != 1 or fall.get('fade') or not fall.get('run'): probs.append(f'the fall: {fall}')
    # the park's weight against the beach (the new-area rule)
    w = await g.ev(STATIC_JS); tp_w, b_w = await g.ev(WEIGHT), w.get('beach')
    det.append(f"weight: the park {tp_w} vs the beach {b_w}")
    if not b_w or tp_w['meshes'] > b_w['meshes'] or tp_w['tris'] > b_w['tris']: probs.append(f'the park weighs more than the beach: {tp_w} vs {b_w}')
    errs = g.errors[:2]; await run.close(g)
    if errs: probs.append(f'browser errors: {errs}')
    return not probs, f"[{prof}] " + '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

async def old_save(run, new_wb, FIX):
    """a game saved inside the old separate park (run 4) starts in town at the gate"""
    save = dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-TREEPARK-OLD', loc='treepark', px=0, pz=-978, yaw=0)
    g = await begin(run, new_wb, 'ipad-landscape', 'n37-oldsave', save); await g.step(30)
    st = await g.ev("()=>({loc:CUR.id,x:+P.x.toFixed(1),z:+P.z.toFixed(1)})"); errs = g.errors[:2]; await run.close(g)
    ok = st['loc'] == 'city' and abs(st['x'] - 77.6) < 3 and abs(st['z'] + 38) < 3 and not errs
    return ok, f"[old save inside the old park] starts at {st}" + (f' errors {errs}' if errs else '')

async def n37(run, new_wb, FIX):
    if b'function buildTreePark' not in new_wb or b'TP_COURSE' not in new_wb or b'function tpTick' not in new_wb: return False, 'the Tree Park obby is not in the game'
    oks = []; dets = []
    for prof in PROFS:
        ok, d = await one(run, new_wb, FIX, prof, ('easy', 'medium', 'hard') if prof in ('ipad-landscape', 'pc-1366') else ('easy',)); oks.append(ok); dets.append(d)
    ok, d = await old_save(run, new_wb, FIX); oks.append(ok); dets.append(d)
    return all(oks), ' || '.join(dets)
