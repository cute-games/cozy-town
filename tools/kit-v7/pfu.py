"""Cozy Town check, stage 'pfu' (added to kit v7 on 31 Oct 2026 for the Pets and Farm Update; built into the zip by tools/kit-v7/make_v7.py).
Lines P1.. for the update's stages. Every line starts as FAIL and passes only on proof measured in a test copy. Nothing here is ever made weaker:
a later stage adds lines (or, with the owner's OK, rewrites one and lists it old -> new in its report).
Stage 1 (31 Oct): P1 saves (save version 2, round trip), P2 night skip, P3 morning bus home, P4 hats sit on the hair."""
import asyncio, json, os, re, time
from crawl import INSTR
from checks import start_from_save, save_diff
from night3 import fx, begin, L, guarded

CLOCK_PATH = 'worlds/cozy-town/cozy-world/peers/clock'
def hm(t): H = int(t); M = int((t - H) * 60); return f'{H}:{M:02d}'

# ---------------- P1 saves: version 2, every new field's default, save -> load -> the same ----------------
NEWF = "()=>({sv:S.sv,pets:S.pets.map(d=>[d.sick,d.sad,d.tr,d.tp]),hw:S.hw,vet:S.vet,yard:S.yard,lic:S.lic,ride:S.ride,farm:S.farm})"
WANT = {'hw': {'w': 0, 'cd': 0, 'sick': 0}, 'vet': {'bk': None}, 'yard': {'pet': 1, 'garden': 1}, 'lic': {'lv': 0, 'wins': 0, 'firsts': 0, 'weeks': 0}, 'ride': {'lesson': 0}, 'farm': {'eggs': 0, 'milk': 0}}
async def p1(run, live_w, new_wb, FIX):
    probs = []; det = []
    # a fresh save made by the live version today (main), like B1's
    gs = await run.open(live_w, 'web', 'ipad-landscape', 'light', 'p1-make'); await gs.manual(); await gs.play_intro('ZZTEST-P1'); await gs.ev(INSTR); await gs.step(30)
    fresh = await gs.state(); await run.close(gs)
    saves = list(FIX) + [('fresh save made by the live version today', fresh)]
    for name, sv in saves:
        g = await run.open(new_wb, 'web', 'ipad-landscape', 'light', 'p1-load', save=sv); await start_from_save(g); await g.ev(INSTR); await g.step(4)
        a = await g.state(); nf = await g.ev(NEWF)
        txt = await g.ev("()=>{saveLocal();return localStorage.getItem('cozytown-save-1');}"); errs = g.errors[:]; await run.close(g)
        bad = []
        if nf['sv'] != 2: bad.append(f"sv {nf['sv']}")
        if any(p != [0, 0, 1, 0] and (sv.get('sv') or 0) < 2 for p in nf['pets']): bad.append(f"pet fields {nf['pets'][:3]}")
        for k, v in WANT.items():
            if (sv.get('sv') or 0) < 2 and nf[k] != v: bad.append(f'{k} {nf[k]}')
            if not isinstance(nf[k], dict): bad.append(f'{k} missing')
        if (sv.get('sv') or 0) < 2 and sv.get('v') != a.get('v'): bad.append(f"v changed {sv.get('v')} -> {a.get('v')}")
        if not txt: bad.append('nothing saved'); det.append(f'{name}: {bad}'); probs.append(name); continue
        s2 = json.loads(txt)
        for _ in range(2):   # (a new game day may begin between the two loads (a day is 15 minutes): then the reload is made again, from a fresh first load)
            g2 = await run.open(new_wb, 'web', 'ipad-landscape', 'light', 'p1-reload', save=s2); await start_from_save(g2); await g2.ev(INSTR); await g2.step(4)
            b = await g2.state(); errs += g2.errors[:]; await run.close(g2)
            if b.get('day') == a.get('day'): break
            g = await run.open(new_wb, 'web', 'ipad-landscape', 'light', 'p1-load', save=sv); await start_from_save(g); await g.ev(INSTR); await g.step(4)
            a = await g.state(); s2 = json.loads(await g.ev("()=>{saveLocal();return localStorage.getItem('cozytown-save-1');}")); await run.close(g)
        d1 = save_diff(a, b); d2 = save_diff(b, a)
        if d1 or d2: bad.append(f'round trip differs: {(d1 + d2)[:3]}')
        if errs: bad.append(f'browser errors {errs[:1]}')
        det.append(f"{name}: sv {nf['sv']}, {len(nf['pets'])} pets" + (f' PROBLEMS {bad}' if bad else ', round trip the same'))
        if bad: probs.append(name)
    det.insert(0, f'{len(saves)} saves (the kit\'s saves, from main and the update\'s stages, and a fresh one from the live version)')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- P2 night skip ----------------
# __clockMs takes the test clock's REAL time; a night skip adds CLK.sk on top, so 'set the game clock to day d, hour h' is __clockMs(msAt(d,h)-CLK.sk)
SETC = "([d,h])=>{__clockMs(msAt(d,h)-CLK.sk);__run(2);return {day:S.day,t:S.time};}"
TOBED = """()=>{__goto('home');__run(2);if(![...HOME_ITEMS.values()].some(r=>FURN[r.it.t].use==='sleep')){S.home.items.push({u:'zzbed',t:'bed',c:'#ff9ec4',x:-4.6,z:-3.85,r:0});rebuildHome();}
  const rec=[...HOME_ITEMS.values()].find(r=>FURN[r.it.t].use==='sleep');if(!rec)return {err:'no bed at home'};P.x=rec.g.position.x+1;P.z=rec.g.position.z;window.__lastToast='';rec.inter.act();__run(2);return {bed:zzIn(),loc:CUR.id};}"""
TENT = """()=>{__goto('beach');__run(2);const L=LOC.beach;P.x=L.ox+CAMP.x+1.9;P.z=L.oz+CAMP.z;bch().camp=1;__run(2);tentSleep();__run(2);return {bed:zzIn(),loc:CUR.id};}"""
ST = "()=>({bed:zzIn(),t:S.time,day:S.day,sk:CLK.sk,peers:MP.peers.size,named:[...MP.peers.values()].every(a=>!!a.nm),toast:window.__lastToast||'',zs:($('zzScr')&&!$('zzScr').hidden)?$('zzScr').textContent:''})"
async def p2(run, live_w, new_wb, FIX):
    probs = []; det = []; base = fx(FIX, 'save-prenight3-pets.json') or FIX[0][1]
    A = await begin(run, new_wb, 'ipad-landscape', 'p2-A', dict(base, name='ZZTEST-NSA'))
    B = await begin(run, new_wb, 'pc-1366', 'p2-B', dict(base, name='ZZTEST-NSB', px=(base.get('px') or -17) + 1.5), theme='dark')
    async def both(n=6, k=3):
        for _ in range(k): await A.step(n); await B.step(n); await asyncio.sleep(.25)
    async def runA(frames):   # A's own frames (50 ms each), with B stepping along so presence flows
        for _ in range(frames // 20):
            await A.ev("()=>__run(20)")
            if B: await B.ev("()=>__run(4)")
            await asyncio.sleep(.2)
    try:
        await both(8, 4)
        D = (await A.ev("()=>S.day")) + 1
        for g in (A, B): await g.ev(SETC, [D, 22.0])
        await both()
        s = await A.ev(ST)
        det.append(f'two test players online: A sees {s["peers"]} other player(s) (the clock entry is not a player: {s["named"]})')
        if s['peers'] != 1 or not s['named']: probs.append('A does not see exactly B as the other player')
        # 1) A in its own bed, B awake in town: the night goes on
        r = await A.ev(TOBED)
        if r.get('err') or not r['bed']: probs.append(f'A could not go to bed: {r}')
        await runA(80); a1 = await A.ev(ST)
        det.append(f"A in bed, B awake: after 4 s A {hm(a1['t'])} in bed {a1['bed']}, sleep screen {a1['zs'][-40:]!r}")
        if not a1['bed'] or not (22 <= a1['t'] < 23) or a1['sk']: probs.append('the night skipped while a friend was awake')
        if 'still awake' not in a1['zs']: probs.append('the sleep screen does not say a friend is still awake')
        # 2) B asleep, but not in its own bed (the beach tent): the night goes on
        r = await B.ev(TENT)
        if not r['bed']: probs.append(f'B could not sleep in the tent: {r}')
        await runA(80); a2 = await A.ev(ST)
        det.append(f"B asleep in the tent (not its own bed): A {hm(a2['t'])}, in bed {a2['bed']}")
        if not a2['bed'] or not (22 <= a2['t'] < 23) or a2['sk']: probs.append('the night skipped while a friend slept outside their own bed')
        # 3) B in its own bed too: both clocks jump to 7:00 together, the skip is saved online once
        await B.ev("()=>{standUp();__run(2);}"); r = await B.ev(TOBED)
        if not r['bed']: probs.append(f'B could not go to bed: {r}')
        await runA(100)
        await B.ev("(ms)=>{__clockMs(ms);}", await A.ev("()=>realMs()")); await both(4, 3)   # (the test clocks run with each page's own frames: B is set to A's real time, as two real devices share it)
        a3 = await A.ev(ST); b3 = await B.ev(ST); rec = run.relay._get(CLOCK_PATH)
        det.append(f"both in their own beds: A {hm(a3['t'])} day {a3['day']} in bed {a3['bed']} ({a3['toast'][:24]!r}); B {hm(b3['t'])} day {b3['day']} in bed {b3['bed']}; skip saved online {bool(rec)} (sk {round((rec or {}).get('sk', 0) / 1000)} s), A {round(a3['sk'] / 1000)} s, B {round(b3['sk'] / 1000)} s")
        if not (7 <= a3['t'] < 7.5 and 7 <= b3['t'] < 7.5 and a3['day'] == D + 1 == b3['day']): probs.append('the clocks did not both jump to 7:00 the next morning')
        if a3['bed'] or b3['bed'] or not a3['toast'].startswith('Good morning'): probs.append('the players did not wake up with the morning')
        if not rec or not rec.get('sk') or abs(rec['sk'] - a3['sk']) > 2000 or abs(a3['sk'] - b3['sk']) > 2000: probs.append('the skip was not saved online once for both')
        # 4) an older version online and awake (it sends no 'in my own bed'): the night goes on until it has gone (it updates itself first)
        C = await run.open(live_w, 'web', 'ipad-landscape', 'light', 'p2-old', save=dict(base, name='ZZTEST-NSOLD')); await start_from_save(C); await C.ev(INSTR)
        for g in (A, B): await g.ev(SETC, [D + 1, 22.0])
        for _ in range(4): await A.step(6); await B.step(6); await C.step(6); await asyncio.sleep(.25)
        for g in (A, B): await g.ev(TOBED)
        await runA(80); a4 = await A.ev(ST)
        det.append(f"an older version online and awake: A sees {a4['peers']} players, {hm(a4['t'])}, in bed {a4['bed']}")
        if a4['peers'] != 2 or not a4['bed'] or not (22 <= a4['t'] < 23): probs.append('the night skipped while an older version was online')
        await run.close(C); await both(4, 3); await runA(100); a5 = await A.ev(ST)
        det.append(f"the older version left: A {hm(a5['t'])}, in bed {a5['bed']}")
        if not (7 <= a5['t'] < 7.5) or a5['bed']: probs.append('the night did not skip after the older version left')
        # 5) alone: your own bed is enough
        await run.close(B); B = None
        for _ in range(3): await A.step(6); await asyncio.sleep(.25)
        await A.ev(SETC, [D + 2, 23.5]); await A.ev(TOBED); await runA(80); a6 = await A.ev(ST)
        det.append(f"alone in bed at 23:30: A {hm(a6['t'])} day {a6['day']}, in bed {a6['bed']}, sees {a6['peers']} players")
        if not (7 <= a6['t'] < 7.5 and a6['day'] == D + 3) or a6['bed']: probs.append('alone, the night did not skip to 7:00')
        errs = A.errors[:]
        if errs: probs.append(f'browser errors: {errs[:2]}')
    finally:
        # test data undone: the clock entry goes, the test pages' skips go
        try: await A.ev("()=>{CLK.sk=0;if(NS.ref)NS.ref.set(null);}")
        except Exception: pass
        run.relay._set(CLOCK_PATH, None)
        await run.close(A)
        if B: await run.close(B)
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- P3 morning bus home ----------------
TT = """([d0,n])=>{const out=[];for(let d=d0;d<d0+n;d++){const a=busArr(d),wb=busWB(d),L=busSess(d),home=L.filter(s=>s.p==='beach'&&s.go==='town').map(s=>[s.a,s.l]),park=L.filter(s=>s.p==='park').map(s=>[s.a,s.l,s.go]);out.push({d,wd:wdName(d),a:a===undefined?null:a,wb,home,park});}return out;}"""
async def p3(run, new_wb, FIX):
    probs = []; det = []; base = fx(FIX, 'save-prenight3-pets.json') or FIX[0][1]
    g = await begin(run, new_wb, 'ipad-landscape', 'p3', dict(base, name='ZZTEST-MBUS'))
    try:
        d0 = await g.ev("()=>{S.wb=null;for(const k in BUS_DAY)delete BUS_DAY[k];return (Math.floor((S.day-1)/7)+1)*7+1;}")   # the next three whole bus weeks (Monday to Sunday)
        tt = await g.ev(TT, [d0, 21]); nobus = []; busd = []
        for r in tt:
            if r['a'] is None:
                nobus.append(r['d'])
                if [8, 9.5] not in r['home']: probs.append(f"{r['wd']} (no bus day): no bus home 8:00-9:30 ({r['home']})")
                if not any(abs(p[0] - 9.5) < 1e-6 and p[2] is None for p in r['park']): probs.append(f"{r['wd']}: the morning bus does not reach town at 9:30")
            else:
                busd.append(r['d']); a = r['a']
                want = [[round(a + 1.5, 4), round(a + 3, 4)], [19.5, 21]]
                got = sorted([[round(x, 4), round(y, 4)] for x, y in r['home']])
                if got != sorted(want): probs.append(f"{r['wd']} (bus day {hm(a)}): buses home changed: {got}")
        mb = sum(1 for r in tt if r['a'] is None and [8, 9.5] in r['home'])
        det.append(f"21 days: {len(busd)} bus days, {len(nobus)} other days, {mb} of them with a bus home 8:00-9:30")
        if len(busd) != 9 or len(nobus) != 12: probs.append(f'not 3 bus days a week ({len(busd)} in 21 days)')
        # ride it: a no-bus day, at the beach, under 20 coins (free) and then with 100 coins (20)
        rides = []
        for k, coins in enumerate((5, 100)):
            d = nobus[k + 1]
            r = await g.ev("""([d,coins])=>{__goto('beach');__setClock(d,7.6);__run(2);const L=LOC.beach;P.x=L.ox-24;P.z=L.oz;__run(4);busTipUpd('beach');const pill=($('busTip')&&!$('busTip').hidden)?$('busTip').textContent:'';
              __setClock(d,8.3);__run(12);S.coins=coins;bch().r1=1;const ready=busReady('beach');busBoard('beach');__run(2);const rid=!!BUS.ride;const c1=S.coins;
              __setClock(d,9.52);__run(4);return {pill,ready,rid,c1};}""", [d, coins])
            await g.wait(2600); await g.step(6)
            e = await g.ev("()=>({loc:CUR.id,coins:S.coins,t:S.time})")
            rides.append(f"{coins} coins: pill at 7:36 {r['pill']!r}, bus ready at 8:18 {r['ready']}, on board {r['rid']}, paid {coins - r['c1']}, now in {e['loc']} at {hm(e['t'])}")
            if '9:30' not in r['pill']: probs.append(f"the pill at the beach does not show the 9:30 bus home: {r['pill']!r}")
            if not r['ready'] or not r['rid'] or e['loc'] != 'city': probs.append(f'the morning bus home did not take you to town ({coins} coins)')
            if (coins - r['c1']) != (0 if coins < 20 else 20): probs.append(f'wrong fare with {coins} coins: {coins - r["c1"]}')
        det += rides
        card = await g.ev("()=>{__goto('beach');__run(2);openBusTable();const t=$('card').innerText;closePanel();return t;}")
        if '8:00 to 9:30' not in card: probs.append('the timetable card does not tell about the morning bus')
        det.append(f"timetable card tells about the morning bus: {'8:00 to 9:30' in card}")
        if g.errors: probs.append(f'browser errors: {g.errors[:2]}')
    finally:
        await run.close(g)
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- P4 hats sit on the hair ----------------
# From above, at every spot over the head where a hat (or a costume's hood) is, the hat must be the top: no hair may stick up through it.
# (A hat part inside the head's own box is never seen, so it is left out.)
# Every hairdo (8 styles, long/shoulder/short) x every hat in the game (shop hats, NPC hats, the party hat), every costume, and the New Year party hat over no hat, a cap and a crown.
HATS_JS = r"""()=>{const HAIR='#13579b',cols={};const look=Object.assign({},DEFAULT_LOOK,{hair:HAIR,top:'#eeeeee',bottom:'#dddddd',shoes:'#cccccc',skin:'#fdc991'});
  const hats=[...new Set([...Object.keys(CLOTHES).filter(k=>CLOTHES[k].hat),...Object.keys(HAT_DEF).filter(k=>!['glasses','sunglasses','hearts'].includes(k)),'chef','helmet'])];
  const styles=[['long','long'],['long','shoulder'],['long','short'],['straight','long'],['bob',''],['ponytail','long'],['bun',''],['pigtails','shoulder'],['curly',''],['short','']];
  const rc=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),o=new THREE.Vector3(),bad=[];let n=0,hits=0;
  const isOL=m=>m.material&&m.material.side===THREE.BackSide;
  const run=(L,lab)=>{const p=makePerson(L);p.root.updateMatrixWorld(true);const hair=[],hat=[];
    p.head.traverse(m=>{if(!m.isMesh||isOL(m)||!m.visible)return;let q=m,inHat=false;while(q&&q!==p.head){if(q.userData.keep&&q.parent===p.head&&q.visible)inHat=true;if(!q.visible)return;q=q.parent;}
      if(inHat)hat.push(m);else if(m.parent===p.head&&m.material.color&&('#'+m.material.color.getHexString())===HAIR)hair.push(m);
      else if(L.co&&m.parent===p.head&&m.material.color&&('#'+m.material.color.getHexString())===COSTUMES[L.co].c.toLowerCase())hat.push(m);});
    let worst=0,cnt=0;for(let x=-.4;x<=.4001;x+=.025)for(let z=-.4;z<=.4001;z+=.025){const hp=p.head.localToWorld(new THREE.Vector3(x,0,z));o.set(hp.x,5,hp.z);rc.set(o,down);
      const a=rc.intersectObjects(hat,false).find(q=>{const v=p.head.worldToLocal(q.point.clone());return !(Math.abs(v.x)<.25&&v.y>0&&v.y<.46&&Math.abs(v.z)<.22);}),b=rc.intersectObjects(hair,false)[0];if(a)hits++;   /* (a hat part hidden inside the head itself is not seen) */if(a&&b&&b.point.y>a.point.y+.004){cnt++;worst=Math.max(worst,b.point.y-a.point.y);}}
    n++;if(cnt)bad.push(lab+' ('+cnt+' spots, up to '+Math.round(worst*100)+' cm)');};
  for(const [s,len] of styles){for(const h of hats)run(Object.assign({},look,{style:s,len:len||undefined,hat:h}),s+(len?'/'+len:'')+'+'+h);
    for(const co of Object.keys(COSTUMES))run(Object.assign({},look,{style:s,len:len||undefined,hat:'none',co}),s+(len?'/'+len:'')+'+costume '+co);
    const p0=PARTY.on;PARTY.on=true;try{for(const h of['none','cap','crown'])run(Object.assign({},look,{style:s,len:len||undefined,hat:h}),s+(len?'/'+len:'')+'+'+h+' on New Year (party hat)');}finally{PARTY.on=p0;}}   /* 31 Dec and 1 Jan: everyone's party hat instead of their own */
  return {n,hits,bad,hats};}"""
async def p4(run, new_wb, FIX):
    g = await begin(run, new_wb, 'pc-1366', 'p4', dict(FIX[0][1], name='ZZTEST-HATS'))
    try:
        r = await g.ev(HATS_JS)
        errs = g.errors[:]
    finally:
        await run.close(g)
    det = f"{r['n']} looks ({len(r['hats'])} hats and every costume on 10 hairdos), hat seen from above at {r['hits']} spots; hair through a hat: {len(r['bad'])} looks" + (f": {r['bad'][:8]}" if r['bad'] else '')
    ok = not r['bad'] and r['hits'] > 1000 and not errs
    return ok, det + (f' | browser errors: {errs[:2]}' if errs else '')

# ---------------- the stage ----------------
async def s_pfu(run, d, live_w, new_wb, FIX):
    tests = [('P1', 'Saves (pets and farm update): every save of the kit (from older versions, today\'s main and the update\'s stages) and a fresh one from the live version loads as save version 2 with every new field at its default; saved again and loaded, it is exactly the same', lambda: p1(run, live_w, new_wb, FIX)),
             ('P2', 'Night skip: at night, when every player online is in their own bed (alone: your own bed), the clock jumps to 7:00 for everyone together and the skip is saved online once; a friend awake, asleep outside their own bed (tent) or an older version online keeps the night going', lambda: p2(run, live_w, new_wb, FIX)),
             ('P3', 'Morning bus home: every day the bus waits at the beach 8:00-9:30 and goes to town (bus days unchanged, still 3 a week); free with under 20 coins, else 20; the pill and the timetable card show it', lambda: p3(run, new_wb, FIX)),
             ('P4', 'Hats sit on the hair: on every hairdo no hair sticks up through any hat, the party hat or a costume\'s hood', lambda: p4(run, new_wb, FIX))]
    only = [x for x in os.environ.get('PFU_ONLY', '').split(',') if x]
    for cid, name, fn in tests:
        if only and cid not in only: continue
        t0 = time.time(); ok, det = await guarded(fn)
        d['lines'].append(L(cid, name, ok, f'{det} ({round(time.time() - t0)} s)'))
        print('   ', 'PASS' if ok else 'FAIL', '|', cid, '|', str(det)[:300], flush=True)
    return d
