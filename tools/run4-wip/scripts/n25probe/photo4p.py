"""Run 4, job 15: N25 (the photographer: one booking plays from the message to the pay on iPad, sideways iPhone and PC; a perfect photo gets 5 stars; a photo with someone cut off gets fewer)."""
import json
from night3 import fx, begin

PROFS = ('ipad-landscape', 'iphone-landscape', 'pc-1366')
STATE = """()=>({job:S.job,on:!!PHO.on,n:PHO.group.length,bg:PHO.bg,o:S.pt&&S.pt.o?Object.assign({},S.pt.o):null,done:S.pt?S.pt.done:-1,coins:S.coins,
  hud:$('jobTxt').textContent,bar:!$('ptbar').hidden,vf:!$('ptvf').hidden,shoot:document.body.classList.contains('shoot'),pics:(S.ptPics||[]).map(p=>({id:p.id,len:(p.u||'').length})),
  last:PHO.last?{stars:PHO.last.stars,pay:PHO.last.pay,sc:PHO.last.sc}:null,card:UI.open?(document.querySelector('#card img.ptpic')?'class="ptpic" ':'')+(document.querySelector('#card [data-a="ptbye"]')?'ptbye':''):'',poses:PHO.group.map(m=>m.pose),
  msg:(S.msg&&S.msg.pc||[]).slice(-1).map(b=>({t2:b.t2,x:b.x,img:b.img||null}))[0]||null,tut:!!(TUT&&TUT.pt),tutHidden:$('tut').hidden,zoom:PHO.zoom,fov:+camera.fov.toFixed(1)})"""
# stand in front of the group, at a distance where everyone is inside the frame and fills it (what a player does by walking back a bit)
FRAME = """(d)=>{const g=PHO.group;const cx=g.reduce((a,m)=>a+m.x,0)/g.length,cz=g.reduce((a,m)=>a+m.z,0)/g.length,f=g[0].face;
  P.x=cx+Math.sin(f)*d;P.z=cz+Math.cos(f)*d;P.yaw=f;P.pitch=-.04;P.jy=0;updateCamera(0);camera.updateMatrixWorld();return ptScore();}"""
RECTS = """()=>{const r=e=>{const b=e.getBoundingClientRect();return {x:b.left,y:b.top,w:b.width,h:b.height,t:(e.textContent||e.getAttribute('aria-label')||'').trim().slice(0,20)};};
  const vis=e=>e&&!e.hidden&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0;
  const btns=[...document.querySelectorAll('#ptbar .btn')].map(r);const others=[];for(const id of['joy','actWrap','job','pad','topbtns','stats','nav','tasks','moveBtns'])if(vis($(id)))others.push(Object.assign(r($(id)),{id}));
  return {btns,others,W:innerWidth,H:innerHeight};}"""

def overlap(a, b):
    return a['x'] < b['x'] + b['w'] - 1 and b['x'] < a['x'] + a['w'] - 1 and a['y'] < b['y'] + b['h'] - 1 and b['y'] < a['y'] + a['h'] - 1

async def one(run, new_wb, FIX, prof, first):
    probs = []; det = []
    save = dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-PHOTO-' + prof, job=None, coins=100); save.pop('pt', None); save.pop('ptPics', None); save.pop('ptTut', None)
    if not first: save['ptTut'] = 1
    g = await begin(run, new_wb, prof, 'n25-' + prof, save)
    if not await g.ev("()=>typeof PHO!=='undefined'&&typeof ptNew==='function'&&!!JOBS.photo&&!!$('ptbar')"):
        await run.close(g); return False, f'{prof}: the photographer job is not in the game'
    await g.ev("()=>{__goto('city');__setClock(null,12);setJob('photo');}"); await g.step(4)
    if first:   # the first time: the picture tips show by themselves (4 steps), like the other jobs
        shown = None
        for _ in range(40):
            await g.step(6); await g.wait(100); s = await g.ev(STATE)
            if s['tut'] and not s['tutHidden']: shown = s; break
        steps = await g.ev("()=>TUT?TUT.steps.map(s=>[s.t,!!s.pic,(s.x||'').split(/\\s+/).length]):[]") if shown else []
        det.append(f"tips card by itself: {bool(shown)} ({len(steps)} steps {steps})")
        if not shown or len(steps) != 4 or not all(p for _, p, _ in steps) or any(w > 9 for _, _, w in steps): probs.append('the first-time tips card (4 picture steps)')
        await g.ev("()=>{for(let i=0;i<6&&TUT;i++)$('tutNext').click();}"); await g.step(2)
    # the booking: a message in the phone, the note, the job box, the map's target
    got = await g.ev("()=>{const r=ptNew();return {r,hud:$('jobTxt').textContent,tg:jobTarget(),o:S.pt.o,msg:(S.msg.pc||[]).slice(-1)[0],note:!$('note').hidden&&$('noteT').textContent}}")
    o = got['o']; spot = await g.ev("(k)=>PT_SPOTS[k]", o['spot'])
    det.append(f"booking: {o['kind']} at {spot['n']} with {o['bg']} behind, for {o['who']}{' + ' + o['pet'] if o['pet'] else ''}; message '{(got['msg'] or {}).get('t2')}', the note {got['note']!r}, job box '{got['hud'][:60]}', map target {got['tg']}")
    if not got['r'] or not got['msg'] or 'booking' not in (got['msg'].get('t2') or '') or spot['n'] not in got['msg']['x']: probs.append('the booking message')
    if not got['tg'] or abs(got['tg']['x'] - spot['at'][0]) > .01 or abs(got['tg']['z'] - spot['at'][1]) > .01 or spot['n'] not in got['hud']: probs.append('the job box or the map target')
    # every photo place: the spot and every background stand on walkable ground (nobody inside a fountain or a wall)
    blocked = await g.ev("""()=>{const out=[];for(const k in PT_SPOTS){const Sp=PT_SPOTS[k];const q=collideXZ(Sp.at[0],Sp.at[1],.3,LOC.city);if(Math.hypot(q[0]-Sp.at[0],q[1]-Sp.at[1])>.05)out.push(k+' spot');
      for(const B of Sp.bgs){const sx=Math.cos(B.face),sz=-Math.sin(B.face);for(const kk of[-1.275,-.425,.425,1.275]){const x=B.g[0]+sx*kk,z=B.g[1]+sz*kk,p=collideXZ(x,z,.28,LOC.city);if(Math.hypot(p[0]-x,p[1]-z)>.05)out.push(k+'/'+B.id+' at '+kk);}
      const free=[3,3.6,4.4,5.2].some(d=>{const x=B.g[0]+Math.sin(B.face)*d,z=B.g[1]+Math.cos(B.face)*d,p=collideXZ(x,z,.3,LOC.city);return Math.hypot(p[0]-x,p[1]-z)<.05;});if(!free)out.push(k+'/'+B.id+' nowhere to stand in front');}}return out;}""")
    det.append(f"all {await g.ev('()=>Object.keys(PT_SPOTS).length')} places and their backgrounds on walkable ground: {not blocked}{' ' + str(blocked) if blocked else ''}")
    if blocked: probs.append(f'a photo place inside something: {blocked}')
    # walk to the spot: the 📸 button is there, it sets the shoot up
    tgt = await g.ev("(a)=>{P.x=a[0];P.z=a[1]-1.2;P.yaw=Math.PI;__run(3);const t=findTarget();return t?{icon:t.icon,label:typeof t.label==='function'?t.label():t.label}:null;}", spot['at'])
    det.append(f"at the spot the button says {tgt}")
    if not tgt or tgt['icon'] != '📸': probs.append(f'no 📸 button at the spot: {tgt}'); await g.ev("()=>ptSetup()")
    else: await g.ev("()=>{TARGET=findTarget();useTarget();}")
    await g.step(3); s = await g.ev(STATE)
    want_n = len(o['who']) + (1 if o['pet'] else 0)
    det.append(f"set up: {s['n']} in the group (wanted {want_n}), shoot on {s['on']}, bar {s['bar']}, frame {s['vf']}, background {s['bg']}")
    if not s['on'] or s['n'] != want_n or not s['bar'] or not s['vf'] or not s['shoot']: probs.append('the shoot did not set up')
    # the bar: every button at least 44 px and none under another HUD part
    rc = await g.ev(RECTS)
    small = [b for b in rc['btns'] if b['w'] < 44 or b['h'] < 44]; over = [(b['t'], o2['id']) for b in rc['btns'] for o2 in rc['others'] if o2['id'] != 'moveBtns' and overlap(b, o2)]
    moving = [o2 for o2 in rc['others'] if o2['id'] == 'moveBtns']
    det.append(f"bar: {len(rc['btns'])} buttons, smallest {min([min(b['w'], b['h']) for b in rc['btns']] or [0]):.0f} px, overlaps {over}, run/jump buttons hidden {not moving}")
    if len(rc['btns']) != 5 or small or over or moving: probs.append(f'the bar: small {small} overlaps {over} run/jump still there {bool(moving)}')
    # poses: tap a person (the action button when near) and pick from the card; the rest from the 🧍 card in the bar
    near = await g.ev("()=>{const m=PHO.group[0];P.x=m.x+Math.sin(m.face)*1.6;P.z=m.z+Math.cos(m.face)*1.6;P.yaw=m.face;__run(3);const t=findTarget();return t?{label:typeof t.label==='function'?t.label():t.label,icon:t.icon}:null;}")
    det.append(f"next to {o['who'][0]}: the button says {near}")
    if not near or 'Pose' not in near['label']: probs.append(f'no pose button next to a person: {near}')
    else:
        await g.ev("()=>{TARGET=findTarget();useTarget();}"); await g.step(2)
        n_it = await g.ev("()=>document.querySelectorAll('#card [data-a^=\"ptpose:0:\"]').length")
        r = await g.tap('#card [data-a="ptpose:0:wave"]'); await g.step(2)
        s = await g.ev(STATE); det.append(f"the pose card: {n_it} poses, tapped Wave -> {s['poses'][0]} (tap {r})")
        if n_it != 6 or s['poses'][0] != 'wave': probs.append('the pose card from the person')
    r = await g.tap('#ptbar [data-a="ptposes"]'); await g.step(2)
    rows = await g.ev("()=>document.querySelectorAll('#card .ptrow').length")
    for i in range(len(o['who'])):
        pose = ['peace', 'smile', 'jump'][i % 3]
        if not await g.tap(f'#card [data-a="ptpose:{i}:{pose}"]'): await g.ev("(v)=>ACT.ptpose(v)", f'{i}:{pose}'); probs.append(f'could not tap the pose button for person {i}')
        await g.step(2)
    await g.ev("()=>{if(UI.open)closePanel();}"); s = await g.ev(STATE)
    det.append(f"the 🧍 card ({rows} rows) -> poses {s['poses']}")
    if rows != len(o['who']) or not all(s['poses']): probs.append('the poses card in the bar')
    # the background: the bar's button cycles them; the group walks over; the client asked for one of them
    cyc = await g.ev("""()=>{const Sp=PT_SPOTS[S.pt.o.spot],seen=[],pos=[];for(let i=0;i<Sp.bgs.length;i++){seen.push(PHO.bg);pos.push(PHO.group[0].x.toFixed(1)+','+PHO.group[0].z.toFixed(1));document.querySelector('#ptbar [data-a=ptbg]').click();}
      return {seen,pos,n:Sp.bgs.length,distinct:new Set(pos).size};}""")
    det.append(f"backgrounds: {cyc['n']} to pick from, the button cycled {cyc['seen']}, the group stood at {cyc['pos']}")
    if len(set(cyc['seen'])) != cyc['n'] or cyc['distinct'] != cyc['n']: probs.append('cycling the backgrounds')
    picked = await g.ev("()=>{const Sp=PT_SPOTS[S.pt.o.spot];for(let i=0;i<6&&PHO.bg!==S.pt.o.bg;i++)document.querySelector('#ptbar [data-a=ptbg]').click();return PHO.bg===S.pt.o.bg;}")
    if not picked: probs.append('could not pick the asked background')
    # frame everyone: step back until nobody is cut off and the group fills the frame; zoom works
    score = None
    for d in (3.6, 4.4, 5.2, 6.2, 7.4, 9):
        sc = await g.ev(FRAME, d)
        if not sc['cut'] and sc['fill']: score = (d, sc); break
    det.append(f"framed from {score[0] if score else '?'} m: {score[1] if score else sc}")
    if not score or score[1]['st'] != 5: probs.append(f'no 5-star framing found: {score or sc}')
    z = await g.ev("()=>{const f0=camera.fov;document.querySelector('#ptbar [data-a=\"ptzoom:+\"]').click();__run(30);const f1=camera.fov,z1=PHO.zoom;document.querySelector('#ptbar [data-a=\"ptzoom:-\"]').click();__run(30);return {f0:+f0.toFixed(1),f1:+f1.toFixed(1),z1,f2:+camera.fov.toFixed(1),z2:PHO.zoom};}")
    det.append(f"zoom: fov {z['f0']} -> {z['f1']} (zoom {z['z1']}) -> {z['f2']}")
    if not (z['f1'] < z['f0'] - 3 and z['z2'] == 1 and abs(z['f2'] - z['f0']) < .6): probs.append(f'the zoom buttons: {z}')
    await g.ev(FRAME, score[0] if score else 5.2); await g.ev("()=>{$('note').hidden=true;}"); await g.step(2)
    await g.shot('photo-shoot-' + prof, both=(prof == 'ipad-landscape'))
    # snap: Space on the PC, the bar's button on touch
    c0 = (await g.ev(STATE))['coins']
    if prof.startswith('pc'): await g.key('Space')
    else:
        if not await g.tap('#ptbar [data-a="ptsnap"]'): probs.append('could not tap Snap'); await g.ev("()=>ACT.ptsnap()")
    await g.step(3); s = await g.ev(STATE)
    pic_ok = bool(s['pics']) and s['pics'][-1]['id'] == o['id'] and s['pics'][-1]['len'] > 1500
    det.append(f"snap: {s['last']['stars'] if s['last'] else '?'} stars, +{s['coins'] - c0} coins, picture saved {pic_ok} ({s['pics'][-1]['len'] if s['pics'] else 0} chars), the thank-you message '{(s['msg'] or {}).get('t2')}' with the photo {bool(s['msg'] and s['msg']['img'] == o['id'])}, card with the photo {'class=\"ptpic\"' in s['card']} and Bye {'ptbye' in s['card']}")
    if not s['last'] or s['last']['stars'] != 5 or s['coins'] - c0 != 120 or not pic_ok or not s['msg'] or s['msg']['img'] != o['id'] or 'ptpic' not in s['card'] or 'ptbye' not in s['card']: probs.append('the perfect photo: 5 stars, 120 coins, the picture in the message and the card')
    await g.wait(700)   # the snap flash (0.5 s) is over before the picture (run 4, stage 3)
    await g.shot('photo-result-' + prof, both=False)
    # the phone shows the photo in the chat
    ph = await g.ev("()=>{closePanel();openPhone('msg','pc');const img=document.querySelector('#card img.mimg');const r=img?img.getBoundingClientRect():null;return !!img&&img.src.length>1500&&r.width>80;}")
    dbg = await g.ev("()=>{const img=document.querySelector('#card img.mimg');const r=img?img.getBoundingClientRect():null;return img?{len:img.src.length,w:r.width,complete:img.complete,nw:img.naturalWidth}:document.querySelector('#card')?.innerHTML.slice(0,200);}")
    await g.wait(500)
    dbg2 = await g.ev("()=>{const img=document.querySelector('#card img.mimg');const r=img?img.getBoundingClientRect():null;return img?{len:img.src.length,w:r.width,complete:img.complete,nw:img.naturalWidth}:null;}")
    print('PROBE', prof, ph, dbg, dbg2, flush=True)
    if prof == 'ipad-landscape': await g.shot('photo-chat-' + prof, both=False)
    await g.ev("()=>closePanel()")
    det.append(f"the photo shows in the phone chat: {ph}")
    if not ph: probs.append('the photo in the phone chat')
    await g.ev("()=>ACT.ptbye()"); await g.step(3); s = await g.ev(STATE)
    det.append(f"after Bye: shoot off {not s['on']}, group gone {s['n'] == 0}, bar hidden {not s['bar']}, done {s['done']}")
    if s['on'] or s['n'] or s['bar'] or s['vf'] or s['shoot'] or s['done'] != 1 or s['o']: probs.append('after Bye')
    # a second booking with someone cut off: fewer stars and less pay
    b2 = await g.ev("()=>{S.pt.wait=0;__run(2);return !!S.pt.o;}")
    if not b2: await g.ev("()=>ptNew()")
    o2 = await g.ev("()=>S.pt.o"); spot2 = await g.ev("(k)=>PT_SPOTS[k]", o2['spot'])
    await g.ev("(a)=>{P.x=a[0];P.z=a[1]-1.2;__run(3);ptSetup();for(let i=0;i<PHO.group.length;i++)if(PHO.group[i].kind==='person')PHO.group[i].pose='smile';while(PHO.bg!==S.pt.o.bg)ptNextBg();}", spot2['at'])
    d2 = None
    for d in (3.6, 4.4, 5.2, 6.2, 7.4, 9):
        sc = await g.ev(FRAME, d)
        if not sc['cut'] and sc['fill']: d2 = d; break
    cut = await g.ev("(d)=>{const g=PHO.group;const cx=g.reduce((a,m)=>a+m.x,0)/g.length,cz=g.reduce((a,m)=>a+m.z,0)/g.length,f=g[0].face;P.x=cx+Math.sin(f)*d;P.z=cz+Math.cos(f)*d;P.yaw=f;let sc=null;for(let k=.2;k<1.4;k+=.1){P.yaw=f+k;updateCamera(0);camera.updateMatrixWorld();sc=ptScore();if(sc.cut>0&&sc.cut<g.length)break;}return sc;}", d2 or 5.2)
    c0 = (await g.ev(STATE))['coins']; await g.step(1)
    await g.ev("()=>ACT.ptsnap()"); await g.step(2); s = await g.ev(STATE)
    det.append(f"second booking ({o2['kind']} at {spot2['n']}), turned so {cut['cut']} of {len(o2['who']) + (1 if o2['pet'] else 0)} is cut off: {s['last']['stars'] if s['last'] else '?'} stars, +{s['coins'] - c0} coins, the message says '{(s['msg'] or {}).get('x', '')[:70]}'")
    if not cut['cut'] or not s['last'] or s['last']['stars'] >= 5 or s['coins'] - c0 >= 120 or 'cut off' not in (s['msg'] or {}).get('x', ''): probs.append('the cut-off photo should get fewer stars')
    await g.ev("()=>ACT.ptbye()"); await g.step(2)
    # four a day, then "all done"; leaving the job clears everything
    lim = await g.ev("()=>{S.pt.done=4;S.pt.wait=0;__run(3);const no=!S.pt.o&&!ptNew();jobHud(true);const hud=$('jobTxt').textContent;S.pt.done=2;setJob(null);__run(2);return {no,hud,on:!!PHO.on,n:PHO.group.length,inters:LOC.city.inter.filter(t=>t.pt).length,bar:!$('ptbar').hidden};}")
    det.append(f"after 4 photos no new booking {lim['no']}, the box says '{lim['hud'][:40]}'; quitting the job clears the shoot {not lim['on'] and lim['n'] == 0 and lim['inters'] == 0 and not lim['bar']}")
    if not lim['no'] or 'All 4' not in lim['hud'] or lim['on'] or lim['n'] or lim['inters'] or lim['bar']: probs.append('the daily limit or quitting the job')
    errs = g.errors[:2]; await run.close(g)
    if errs: probs.append(f'browser errors: {errs}')
    return not probs, f"[{prof}] " + '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

async def n25(run, new_wb, FIX):
    if b'function ptNew' not in new_wb or b'id="ptbar"' not in new_wb: return False, 'the photographer job is not built yet (job 15)'
    oks = []; dets = []
    for i, prof in enumerate(PROFS):
        ok, d = await one(run, new_wb, FIX, prof, i == 0); oks.append(ok); dets.append(d)
    return all(oks), ' || '.join(dets)
