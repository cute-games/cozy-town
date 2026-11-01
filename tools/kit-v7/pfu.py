"""Cozy Town check, stage 'pfu' (added to kit v7 on 31 Oct 2026 for the Pets and Farm Update; built into the zip by tools/kit-v7/make_v7.py).
Lines P1.. for the update's stages. Every line starts as FAIL and passes only on proof measured in a test copy. Nothing here is ever made weaker:
a later stage adds lines (or, with the owner's OK, rewrites one and lists it old -> new in its report).
Stage 1 (31 Oct): P1 saves (save version 2, round trip), P2 night skip, P3 morning bus home, P4 hats sit on the hair.
Stage 2 (1 Nov): P5 one need and food groups, P6 sickness (switched off until the vet clinic), P7 vet booking, P8 care helpers (bowl, naps,
healthy week), P9 friends see your pets for real and can pet them, P10 the moves pack on every pet, P11 following pets are not left behind.
Stage 4 (1 Nov): P17 the vet station and the visit, P18 big-needs pets locked; P6 rewritten (old: sickness switched off until the vet clinic; new: switched on with the vet station in, the switch still proven both ways).
Stage 3 (1 Nov): P12 Friends Lane's wider border, P13 yard levels by skill at the yard sign, P14 only owned things show, P15 training gear and pets playing
on it, P16 friends see your yard. Rewritten: P10 (old: every move's lowest point within -0.07..0.012 m; new: the same for every move on the floor (a yard-gear move: on the pet kinds that play it, e.g. cat.wand on cats), and a
move in water or the air (r.noGround: capy.tub, owl.fly) is measured by its highest point instead, which must stay above 0.05 m)."""
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
        # (stage 4 rewrite: sickness is on, so a pet at 0-1 hearts starts its sickness timer 'sad' from 0 the moment play begins; old: sad exactly 0;
        #  new: sad from 0 by at most the few seconds played before the read, under 0.1 minute. sick, tr, tp exactly as before)
        if any((p[0], p[2], p[3]) != (0, 1, 0) or not (0 <= p[1] < 0.1) for p in nf['pets']) and (sv.get('sv') or 0) < 2: bad.append(f"pet fields {nf['pets'][:3]}")
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

# ================= stage 2 (1 Nov 2026): the pet brain =================
PETS_SAVE = 'save-prenight3-pets.json'   # 4 pets: 3 follow you, a hamster waits at home
NOON = """()=>{__goto('city');const c=clockNow();let d=c.day;while(wdIdx(d)!==1)d++;__setClock(d,12);__run(4);closePanel();
  for(const p of PET_ACTORS){p.d.happy=60;p.d.sick=0;p.d.sad=0;}window.__sk0=PBR.sick;PBR.sick=false;S.vet.bk=null;return {day:S.day,wd:wdName(),pets:PET_ACTORS.length,fol:PET_ACTORS.filter(p=>!p.d.stay).length};}"""
async def pet_page(run, new_wb, tag, prof='ipad-landscape', name=None, FIX=None, theme='light'):
    base = fx(FIX, PETS_SAVE) or FIX[0][1]
    g = await begin(run, new_wb, prof, tag, dict(base, name=name or 'ZZTEST-' + tag.upper()), theme=theme)
    await g.ev(NOON); await g.step(6); return g

# ---------------- P5 one need (happiness) and food groups ----------------
P5_JS = r"""()=>{const o={},bad=[];const W={dog:'meat',pug:'meat',pomchi:'meat',sausage:'meat',owl:'meat',bear:'meat',snake:'meat',cat:'fish',seal:'fish',bunny:'veg',hamster:'veg',capybara:'veg',duck:'veg',monkey:'veg'};
  for(const k in W)if(PET_GROUP[k]!==W[k])bad.push('food group of '+k+': '+PET_GROUP[k]);
  const N={petfood:['Meat',6],catfood:['Fish',6],bunnyfood:['Fruit & veggies',6],treat:['Pet treats',5]};for(const k in N)if(!PET_ITEMS[k]||PET_ITEMS[k].n!==N[k][0]||PET_ITEMS[k].p!==N[k][1])bad.push('shop item '+k+' '+JSON.stringify(PET_ITEMS[k]));
  const e=PET_ACTORS.find(p=>!p.d.stay),d=e.d,t0=d.type,k0=d.kind;let fed=0;
  for(const k of Object.keys(PET_TYPES)){const T=PET_TYPES[k];d.type=T.base||k;if(T.base)d.kind=k;else delete d.kind;const fav=GROUP_FOOD[W[k]],other=PET_FOODS.find(f=>f!==fav&&f!=='treat');
    for(const [f,want,dance] of [[fav,40,true],[other,30,false],['treat',30,false]]){S.bag={[f]:1};d.happy=10;e.sm=null;e.nap=false;openPet(e);ACT.pfeed();const got=Math.round(d.happy-10);fed++;
      if(got!==want||(e.smN==='pet.happyDance')!==dance||e.sm!=='pet.takeFood'||S.bag[f])bad.push(`${k} fed ${f}: +${got}, move ${e.sm} then ${e.smN}`);closePanel();}}
  d.type=t0;if(k0)d.kind=k0;else delete d.kind;o.fed=fed;
  S.bag={};openPet(e);ACT.pfeed();o.nofood=$('card').innerText.split('\n').find(l=>l.includes('food'))||'';closePanel();if(!o.nofood.includes('Ms. Paws sells meat, fish, fruit & veggies.'))bad.push('no food in the bag: '+o.nofood);
  d.happy=100;for(let i=0;i<60;i++)petNeed(e,60);o.hour=Math.round(100-d.happy);if(o.hour<60||o.hour>80)bad.push('one hour of play took '+o.hour+' happiness (want about 70: full to sad)');
  AW.on=1;d.happy=50;petNeed(e,600);AW.on=0;o.away=d.happy;if(d.happy!==50)bad.push('away: happiness changed');
  const h=PET_ACTORS.find(p=>p!==e&&p.d.stay)||PET_ACTORS.find(p=>p!==e);petGoHome(h);S.home.items=S.home.items.filter(it=>!['toybox','cattree','petbowl'].includes(it.t));rebuildHome();
  S.yard.bw=0;petTick(.01);h.d.happy=50;petNeed(h,600);const plain=50-h.d.happy;
  S.home.items.push({u:'zzbox',t:'toybox',c:'#ff7aa8',x:3,z:2,r:0});rebuildHome();S.yard.bw=900;petTick(.01);h.d.happy=50;petNeed(h,600);const care=50-h.d.happy;
  o.home=[+plain.toFixed(2),+care.toFixed(2)];if(!(Math.abs(care-plain/2)<.05&&plain>5))bad.push('home pets with a full bowl and a toy box: '+care+' lost vs '+plain+' (want half)');
  S.home.items=S.home.items.filter(it=>it.u!=='zzbox');rebuildHome();S.yard.bw=0;
  o.hearts=[100,90,70,50,40,30,20,10,0].map(v=>{d.happy=v;return petCode(e)[0]+(petLk(d)||'-');}).join(' ');
  if(o.hearts!=='5- 5- 4- 3- 2- 2- 1d 1d 0d')bad.push('moods by hearts: '+o.hearts);
  e.moving=false;e.sm=null;const now=gameMs()/1000;e.loc=CUR.id;e.g.visible=true;const seen=new Set();
  for(const [v,kind] of [[100,'happy'],[10,'sad'],[10,'sad'],[10,'sad'],[10,'sad'],[10,'sad'],[10,'sad'],[10,'sad']]){d.happy=v;e.sm=null;e.bt=0;petBrain(e,.01,now);seen.add(kind+':'+e.sm);}
  o.moves=[...seen];if(!seen.has('happy:pet.veryHappy'))bad.push('5 hearts: no very happy move');
  if(![...seen].some(x=>/^sad:pet\.unhappy/.test(x)))bad.push('sad: no unhappy body language '+o.moves);
  openShop('pets');const L=[...document.querySelectorAll('#card .it')].map(b=>b.innerText.replace(/\n/g,' | '));closePanel();
  o.shop=L.filter(t=>/Meat|Fish|Fruit|treats/.test(t));const F={Meat:'🐶 🦉 🐻 🐍',Fish:'🐱 🦭','Fruit & veggies':'🐰 🐹 🦫 🦆 🐒','Pet treats':'🐾 all love it'};
  for(const n in F)if(!L.some(t=>t.includes(n)&&t.includes(F[n])))bad.push('shop: '+n+' does not say who loves it');
  const q=QUESTS.spa.steps[0].d;o.quest=q;if(/pet food or cat food/i.test(q))bad.push('quest still says pet food or cat food');
  o.bad=bad;return o;}"""
async def p5(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p5', FIX=FIX)
    try: r = await g.ev(P5_JS); errs = g.errors[:]
    finally: await run.close(g)
    det = (f"{r['fed']} feedings (every pet kind x its own group's food, another food, a treat); no food: {r['nofood']!r}; one hour of play: -{r['hour']}; "
           f"away: {r['away']}; a pet at home lost {r['home'][0]} in 10 min, with a full bowl and a toy box {r['home'][1]}; hearts/look 100..0: {r['hearts']}; "
           f"body language seen {r['moves']}; shop {r['shop']}; quest step {r['quest']!r}")
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    return not bad, det + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P6 sickness (built, switched off until the vet clinic) ----------------
P6_JS = r"""()=>{const o={},bad=[];const e=PET_ACTORS.find(p=>!p.d.stay),d=e.d;o.off=window.__sk0;if(window.__sk0!==true||!LOC.vet)bad.push('sickness is not switched on with the vet station in the game');PBR.sick=false;
  d.happy=0;d.sad=0;for(let i=0;i<120;i++){d.happy=0;petNeed(e,60);}o.offSick=d.sick;if(d.sick)bad.push('a pet got sick while sickness is off');
  PBR.sick=true;d.sick=0;d.sad=0;const at=[];for(let m=1;m<=70;m++){d.happy=10;petNeed(e,60);if(petCode(e).includes('w')&&!at.w)at.w=m;if(d.sick&&!at.s)at.s=m;}
  o.warnAt=at.w;o.sickAt=at.s;if(!(at.s>=58&&at.s<=62))bad.push('sick after '+at.s+' minutes at 0-1 hearts (want about 60)');if(!(at.w>=44&&at.w<=47))bad.push('warning sneeze from minute '+at.w+' (want 15 before)');
  const e2=PET_ACTORS.find(p=>p!==e&&!p.d.stay)||PET_ACTORS.find(p=>p!==e),d2=e2.d;d2.sick=0;d2.sad=0;for(let m=0;m<50;m++){d2.happy=10;petNeed(e2,60);}d2.happy=60;petNeed(e2,1);o.recover=d2.sad;if(d2.sad!==0||petCode(e2).includes('w'))bad.push('a happier pet still on its way to sickness');
  o.code=petCode(e);if(!/^\ds/.test(o.code))bad.push('the sick pet\'s code has no s: '+o.code);
  d.happy=100;petNeed(e,600);if(!d.sick)bad.push('happiness cured the sickness (only the vet may)');
  e.sm=null;e.bt=0;e.moving=false;petBrain(e,.01,gameMs()/1000);o.sickMove=e.sm;
  const i=S.pets.indexOf(d);window.__lastToast='';ACT.gvpick(i);o.paws=window.__lastToast||($('card')&&$('card').innerText.slice(0,80));closePanel();if(!/well first/.test(o.paws))bad.push('Ms. Paws took a sick pet: '+o.paws);
  S.coins=500;d2.sick=1;let c=vetCure([d,d2]);o.cure=[c,S.coins,d.sick,d2.sick,petHearts(d),petHearts(d2)];if(c!==100||S.coins!==400||d.sick||d2.sick||petHearts(d)!==2)bad.push('vet: '+o.cure);
  d.sick=1;S.coins=30;c=vetCure([d]);o.free=[c,S.coins];if(c!==0||S.coins!==30||d.sick)bad.push('vet with too few coins is not free: '+o.free);
  PBR.sick=true;o.bad=bad;return o;}"""
SHOW_JS = r"""()=>{const c=clockNow();let d=c.day;while(wdIdx(d)!==5)d++;__setClock(d,10);__run(4);__goto('city');P.x=-36;P.z=2;bringFollowers(true);__run(4);
  const L=PET_ACTORS.filter(p=>!p.d.stay);PBR.sick=true;for(const p of L)p.d.sick=1;window.__lastToast='';closePanel();openShow();const t1=window.__lastToast,open1=UI.open&&$('card').innerText.includes('Pick');closePanel();
  L[0].d.sick=0;openShow();const picks=[...document.querySelectorAll('#card .pscard')].length;closePanel();for(const p of L)p.d.sick=0;PBR.sick=false;return {t1,open1,picks,n:L.length};}"""
async def p6(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p6', FIX=FIX)
    try:
        r = await g.ev(P6_JS); sh = await g.ev(SHOW_JS); errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'][:]
    if sh['open1'] or 'vet' not in sh['t1']: bad.append(f"Pet Show with only sick pets: {sh['t1']!r}")
    if sh['picks'] != 1: bad.append(f"Pet Show with one healthy pet offers {sh['picks']} pets")
    det = (f"in the game: switched on {r['off']} (with the switch off for the test, 2 hours at 0 hearts: sick {r['offSick']}); switched on: warning sneeze from minute {r['warnAt']}, sick at minute {r['sickAt']}, "
           f"a pet cheered up in time: {r['recover']} minutes left; sick code {r['code']!r}, its move {r['sickMove']}; Ms. Paws: {r['paws']!r}; "
           f"vet for 2 pets with 500 coins: paid {r['cure'][0]}, hearts after {r['cure'][4]}; with 30 coins: paid {r['free'][0]}; "
           f"Pet Show with sick pets only: {sh['t1']!r}, with one well: {sh['picks']} to pick")
    if errs: bad.append(f'browser errors {errs[:2]}')
    return not bad, det + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P7 vet booking on the phone ----------------
P7_JS = r"""()=>{const o={},bad=[];const L=PET_ACTORS.map(p=>p.d);for(const d of L)d.sick=0;S.vet.bk=null;
  PH.app='pets';renderPhone();const b=document.querySelector('#card .vetgo');o.btn=b?[b.innerText,Math.round(b.getBoundingClientRect().height),Math.round(b.getBoundingClientRect().width)]:null;
  if(!b||!b.innerText.includes('Book the vet'))bad.push('no Book the vet button in the Pets app');else{const r=b.getBoundingClientRect();if(r.height<44||r.width<44)bad.push('button under 44 px');}
  ACT.phapp('vet');o.well=$('card').innerText.includes('All your pets are well');if(!o.well)bad.push('no sick pet: not "All your pets are well"');
  L[0].sick=1;renderPhone();const sl=[...document.querySelectorAll('#card .vetslots .btn')];o.slots=sl.map(x=>x.innerText);
  if(sl.length!==8)bad.push(sl.length+' times offered (want the next 8)');
  const hrs=vetSlots().map(s=>s[1]);if(hrs.some(h=>h<7||h+2>23||h%2!==1))bad.push('a time outside 7:00-23:00 two-hour windows: '+hrs);
  if(!$('card').innerText.includes(L[0].name))bad.push('the sick pet is not listed');if(L.slice(1).some(d=>$('card').innerText.includes(' '+d.name+'.')))bad.push('a well pet is listed');
  const small=sl.filter(x=>x.getBoundingClientRect().height<44).length;if(small)bad.push(small+' time buttons under 44 px');
  sl[1].click();const bk=S.vet.bk;o.bk=bk&&[bk.d,bk.h,bk.ids.length];const t=$('card').innerText;o.card=t.split('\n').filter(l=>/Your time|Bring|Cancel/.test(l));
  if(!bk||!t.includes('Your time')||!t.includes('Cancel')||!t.includes(L[0].name))bad.push('no booked card with time, pet and Cancel');
  const c0=S.coins;__clockMs(msAt(bk.d,bk.h)-30000);PBR.t=0;petTick(.01);o.note=!$('note').hidden?$('note').innerText:'';if(!/Vet time soon/.test(o.note))bad.push('no reminder one game hour before: '+o.note);
  window.__lastToast='';__clockMs(msAt(bk.d,bk.h+2)+5000);PBR.t=0;petTick(.01);o.late=[S.vet.bk,window.__lastToast,S.coins-c0];if(S.vet.bk||S.coins!==c0||!/missed/.test(window.__lastToast))bad.push('late: '+JSON.stringify(o.late));
  renderPhone();sl.length=0;const s2=document.querySelector('#card .vetslots .btn.mint');s2.click();ACT.vetx();o.cancel=S.vet.bk;if(S.vet.bk)bad.push('Cancel did not cancel');closePanel();
  o.bad=bad;return o;}"""
async def p7(run, new_wb, FIX):
    A = await pet_page(run, new_wb, 'p7-A', FIX=FIX, name='ZZTEST-VETA'); B = None
    try:
        r = await A.ev(P7_JS); bad = r['bad'][:]
        B = await pet_page(run, new_wb, 'p7-B', prof='pc-1366', FIX=FIX, name='ZZTEST-VETB', theme='dark')
        await A.ev("()=>{S.pets[0].sick=1;S.vet.bk=null;const s=vetSlots()[0];ACT.vetbk(0);return S.vet.bk;}")
        for _ in range(6): await A.step(6); await B.step(6); await asyncio.sleep(.3)
        sh = await B.ev("()=>{S.pets[0].sick=1;PH.app='vet';renderPhone();const t=[...document.querySelectorAll('#card .vetslots .btn')].map(b=>[b.innerText,b.disabled]);closePanel();S.pets[0].sick=0;return t;}")
        a_bk = await A.ev("()=>S.vet.bk&&vetWhen(S.vet.bk.d,S.vet.bk.h)")
        taken = [x for x in sh if x[1]]
        if not taken or a_bk not in taken[0][0]: bad.append(f'the other player does not see A\'s time {a_bk} as taken: {sh[:3]}')
        errs = A.errors[:] + B.errors[:]
    finally:
        await run.close(A)
        if B: await run.close(B)
    det = (f"Pets app button {r['btn']}; no sick pet: all well {r['well']}; one sick: times {r['slots']}; booked {r['bk']}, card {r['card']}; reminder {r['note'][:70]!r}; "
           f"late: booking {r['late'][0]}, coins lost {r['late'][2]}, {r['late'][1]!r}; another player sees A's {a_bk} as {taken[:1]}")
    if errs: bad.append(f'browser errors {errs[:2]}')
    return not bad, det + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P8 care helpers: the bowl, naps, the healthy week ----------------
P8_JS = r"""()=>{const o={},bad=[];__goto('home');__run(4);
  S.home.items=S.home.items.filter(it=>it.t!=='petbowl');S.home.items.push({u:'zzbowl',t:'petbowl',c:'#ff7aa8',x:2,z:1,r:0});rebuildHome();S.yard.bw=0;
  const rec=HOME_ITEMS.get('zzbowl');o.label=rec.inter&&rec.inter.label();S.bag={catfood:2};rec.inter.act();o.fill=[S.bag.catfood,S.yard.bw];if(S.bag.catfood!==1||S.yard.bw!==900)bad.push('fill the bowl: '+o.fill);
  rec.inter.act();if(S.bag.catfood!==1)bad.push('a full bowl took more food');
  const h=PET_ACTORS.find(p=>p.d.stay)||PET_ACTORS[3];petGoHome(h);for(let i=0;i<90;i++)petTick(10);o.left=S.yard.bw;if(S.yard.bw!==0)bad.push('the bowl is not empty after a game day of play: '+S.yard.bw);
  S.home.items=S.home.items.filter(it=>it.u!=='zzbowl');rebuildHome();
  const c=clockNow();let d=c.day;while(wdIdx(d)!==1)d++;__setClock(d,22);__run(4);bringFollowers(true);__run(10);
  if(![...HOME_ITEMS.values()].some(r=>FURN[r.it.t].use==='sleep')){S.home.items.push({u:'zzbed',t:'bed',c:'#ff9ec4',x:-4.6,z:-3.85,r:0});rebuildHome();}
  const bed=[...HOME_ITEMS.values()].find(r=>FURN[r.it.t].use==='sleep');P.x=bed.g.position.x+1;P.z=bed.g.position.z;const W=PET_ACTORS.filter(p=>!p.d.stay&&p.loc==='home');for(const p of W)p.d.happy=50;bed.inter.act();__run(24);   /* (alone in your own bed the night skips after 2 s: look at the naps before) */
  o.nap=W.map(p=>[p.sm,Math.round(p.d.happy*10)/10,petCode(p)]);
  if(!W.length||!zzIn()||W.some(p=>p.sm!=='pet.nap'||p.d.happy<50||!petCode(p).includes('.i')))bad.push('pets with you in bed: '+JSON.stringify(o.nap));
  const hb=W.map(p=>p.d.happy);__run(120);o.morning=W.map((p,i)=>Math.round(p.d.happy-hb[i]));o.woke=[zzIn(),S.time.toFixed(2)];if(zzIn()||W.some((p,i)=>p.d.happy<hb[i]+14))bad.push('no happier morning: '+o.morning+' '+o.woke);
  S.home.items=S.home.items.filter(it=>it.u!=='zzbed');rebuildHome();__goto('city');__run(4);
  const wk=[];for(const days of [[1,2,3],[1,2],[1,2,3]]){let m=clockNow().day;while(wdIdx(m)!==0)m++;const sick=wk.length===2;
    for(let i=0;i<5;i++){__setClock(m+i,12);__run(2);PBR.t=0;petTick(.01);if(days.includes(i)){const e=PET_ACTORS.find(p=>!p.d.stay);S.bag={treat:1};openPet(e);ACT.pfeed();closePanel();}if(sick&&i===3){S.pets[0].sick=1;PBR.t=0;petTick(.01);S.pets[0].sick=0;}}
    const w0=S.lic.weeks;__setClock(m+5,10);__run(2);PBR.t=0;petTick(.01);__run(4);const e=PET_ACTORS.find(p=>!p.d.stay);
    wk.push({care:days.length,sick,rib:petRib(),code:petCode(e),mesh:!!(e.m.rib&&e.m.rib.parent),lic:S.lic.weeks-w0});__setClock(m+7,12);__run(2);PBR.t=0;petTick(.01);wk[wk.length-1].monday=petRib();}
  o.weeks=wk;const want=[[true,1],[false,0],[false,0]];wk.forEach((w,i)=>{if(w.rib!==want[i][0]||w.lic!==want[i][1]||w.mesh!==want[i][0]||w.code.includes('r')!==want[i][0]||w.monday)bad.push('week '+(i+1)+': '+JSON.stringify(w));});
  o.bad=bad;return o;}"""
async def p8(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p8', FIX=FIX)
    try: r = await g.ev(P8_JS); errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    det = (f"bowl: {r['label']!r}, one fish fills it for {r['fill'][1]} s of play, left after a game day {r['left']}; in bed: {r['nap']}; morning +{r['morning']}; "
           f"weeks (care days, a pet sick): " + '; '.join(f"{w['care']} days{' + sick' if w['sick'] else ''}: ribbon {w['rib']} (on the pet {w['mesh']}, online {w['code']!r}), license weeks +{w['lic']}, Monday {w['monday']}" for w in r['weeks']))
    return not bad, det + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P9 friends see your pets for real, and pet and play with them ----------------
async def p9(run, live_w, new_wb, FIX):
    probs = []; det = []
    A = await pet_page(run, new_wb, 'p9-A', FIX=FIX, name='ZZTEST-PFA'); B = await pet_page(run, new_wb, 'p9-B', prof='pc-1366', FIX=FIX, name='ZZTEST-PFB', theme='dark'); C = None
    async def flow(*gs, k=6):
        for _ in range(k):
            for g in gs: await g.step(6)
            await asyncio.sleep(.3)
    try:
        await A.ev("()=>{P.x=-20;P.z=-5.6;bringFollowers(true);}"); await B.ev("()=>{P.x=-17;P.z=-4;P.yaw=Math.PI/2;}"); await flow(A, B)
        await B.ev("(ms)=>{__clockMs(ms);}", await A.ev("()=>realMs()"))   # (the test clocks run with each page's own frames: B is set to A's time, as two real devices share it)
        a = await A.ev("()=>{const L=PET_ACTORS.filter(p=>!p.d.stay);L[0].d.happy=100;L[1].d.happy=10;PBR.sick=true;L[1].d.sick=1;PBR.sick=false;petMove(L[0],'pet.veryHappy');return {rows:MP.lastKey?JSON.parse(MP.lastKey).pt:null,names:L.map(p=>p.d.name)};}")
        await flow(A, B)
        rows = await A.ev("()=>JSON.parse(MP.lastKey).pt")
        b = await B.ev("""()=>{const a=[...MP.peers.values()].find(x=>x.pets);if(!a)return null;return a.pets.map(q=>({nm:q.nm,h:q.h,look:q.look,sm:q.sm,t:Math.round((gameMs()/1000-q.sm0)*10)/10,vis:q.g.visible}));}""")
        av = await A.ev("()=>PET_ACTORS.filter(p=>!p.d.stay).map(p=>({sm:p.sm,t:Math.round((gameMs()/1000-p.sm0)*10)/10,h:petHearts(p.d),sick:p.d.sick}))")
        det.append(f"A's pet rows online {rows}; A's pets {av}; B sees {b}")
        if not rows or any(len(r) != 6 for r in rows): probs.append('the rows do not carry the code at the end (index 5)')
        if not b or len(b) != len(av): probs.append('B does not see A\'s pets')
        else:
            for x, y in zip(av, b):
                if x['h'] != y['h']: probs.append(f"hearts differ {x['h']} vs {y['h']}")
                if (y['look'] == 's') != bool(x['sick']): probs.append('sick look not shown to the friend')
            if av[0]['sm'] == 'pet.veryHappy' and (b[0]['sm'] != 'pet.veryHappy' or abs(b[0]['t'] - av[0]['t']) > .6): probs.append(f"the friend does not see the same move at the same time: {b[0]}")
        h0 = await A.ev("()=>Math.round(PET_ACTORS.filter(p=>!p.d.stay)[1].d.happy)")
        x0 = await B.ev("()=>sk('pets').xp+sk('pets').lv*1000")
        tg = await B.ev("""()=>{const a=[...MP.peers.values()].find(x=>x.pets),q=a.pets[1];const t=targets().includes(q.target);q.target.act();const t1=$('card').innerText;ACT.fpet('p');__run(2);return {t,t1:t1.slice(0,60),label:q.target.label()};}""")
        await flow(A, B)
        await B.ev("()=>{ACT.fpet('y');closePanel();}"); await flow(A, B)
        h1 = await A.ev("()=>Math.round(PET_ACTORS.filter(p=>!p.d.stay)[1].d.happy)"); x1 = await B.ev("()=>sk('pets').xp+sk('pets').lv*1000")
        feed = await B.ev("()=>{const a=[...MP.peers.values()].find(x=>x.pets);a.pets[1].target.act();const t=$('card').innerText;closePanel();return /Feed/.test(t);}")
        det.append(f"B taps A's pet: {tg}; A's pet happiness {h0} -> {h1} (pet +10, play +20); B's pet XP +{x1 - x0}; a Feed button for a friend's pet: {feed}")
        if not tg['t']: probs.append('a friend\'s pet has no tap target')
        if h1 - h0 != 30: probs.append(f'A\'s pet got +{h1 - h0} from the friend (want +30)')
        if x1 <= x0: probs.append('the friend got no pet XP')
        if feed: probs.append('friends can feed your pet')
        # an older version online: the codes are left out (old versions would rebuild the pets at every change) and it still sees the pets
        C = await run.open(live_w, 'web', 'ipad-landscape', 'light', 'p9-old', save=dict(fx(FIX, PETS_SAVE), name='ZZTEST-PFOLD')); await start_from_save(C); await C.ev(INSTR)
        await C.ev("()=>{__goto('city');P.x=-18;P.z=-3;}")
        await flow(A, B, C, k=8)
        rows2 = await A.ev("()=>JSON.parse(MP.lastKey).pt")
        cp = await C.ev("()=>{const a=[...MP.peers.values()].find(x=>x.pets&&x.nm==='ZZTEST-PFA');return a?a.pets.length:0;}")
        det.append(f"older version online: A's rows {rows2}; the older version shows {cp} of A's pets")
        if not rows2 or any(len(r) > 5 for r in rows2): probs.append('codes still sent while an older version is online')
        if cp != len(av): probs.append('the older version does not show A\'s pets')
        errs = A.errors[:] + B.errors[:] + [e for e in C.errors if 'PAGEERROR' in e]
        if errs: probs.append(f'browser errors {errs[:2]}')
    finally:
        for g in (A, B, C):
            if g: await run.close(g)
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- P10 the moves pack on every pet, and its cost ----------------
P10_JS = r"""()=>{const bad=[],bb=new THREE.Box3(),wet={},USE={},need0=['pet.idle','pet.walk','pet.sad','pet.unhappyBowl','pet.unhappyPlay','pet.unhappyNap','pet.unhappyNudge','pet.veryHappy','pet.happyDance','pet.sickWalk','pet.sickLie','pet.sneeze','pet.warnSneeze','pet.nap','pet.takeFood'];let n=0,worst=0;
  if(typeof GEAR_PLAY!=='undefined')for(const id in GEAR_PLAY)for(const sg of GEAR_PLAY[id])if(!need0.includes(sg.m))(USE[sg.m]=USE[sg.m]||[]).push(...GEAR[id].k);   /* (stage 3: a yard-gear move is checked on the kinds that play it) */
  for(const k of Object.keys(PET_TYPES)){const m=makePet(k,PET_TYPES[k].cols[0]);addOutfit(m,{outfit:{head:'tophat',back:'cape'}});scene.add(m.root);
    for(const nm of COZY_MOVES.list){if(USE[nm]&&!USE[nm].includes(k))continue;let lo=9,hi=-9,top=9;for(let t=0;t<4.5;t+=.25){const r=COZY_MOVES.play(m,nm,t,{kind:k,dist:t*.8,mood:nm==='pet.walk'&&t>2?'sad':undefined});n++;m.root.updateMatrixWorld(true);bb.setFromObject(m.root);if(r.noGround){top=Math.min(top,bb.max.y);wet[nm]=1;}else if(!r.lift){lo=Math.min(lo,bb.min.y);hi=Math.max(hi,bb.min.y);}}
      if(m.__mv.warned){bad.push(k+' '+nm+': error');m.__mv.warned=0;}worst=Math.min(worst,lo);if(lo<-.07||hi>.012)bad.push(k+' '+nm+': lowest point '+lo.toFixed(3)+'..'+hi.toFixed(3)+' m');if(top<.05)bad.push(k+' '+nm+': sinks out of view (highest point '+top.toFixed(3)+' m)');}scene.remove(m.root);}
  const need=['pet.idle','pet.walk','pet.sad','pet.unhappyBowl','pet.unhappyPlay','pet.unhappyNap','pet.unhappyNudge','pet.veryHappy','pet.happyDance','pet.sickWalk','pet.sickLie','pet.sneeze','pet.warnSneeze','pet.nap','pet.takeFood'];
  for(const x of need)if(!COZY_MOVES.list.includes(x))bad.push('missing move '+x);
  return {kinds:Object.keys(PET_TYPES).length,poses:n,worst:+worst.toFixed(3),wet:Object.keys(wet),bad};}"""
COST_JS = r"""()=>{__goto('city');P.x=-20;P.z=-5.6;bringFollowers(true);__run(10);const peers=[...MP.peers.values()].filter(a=>a.pets);const fr=[];
  for(let i=0;i<120;i++){const t0=performance.now();for(const p of PET_ACTORS)petAnim(p,.05);for(const a of peers)for(const q of a.pets)if(q.g.visible)petPose(q.m,q.kind,q,gameMs()/1000,true,q.look);fr.push(performance.now()-t0);}
  fr.sort((a,b)=>a-b);const own=PET_ACTORS.filter(p=>p.loc===CUR.id&&p.g.visible).length,fp=peers.reduce((s,a)=>s+a.pets.filter(q=>q.g.visible).length,0);
  let fps=0;{const r0=performance.now();let k=0;while(performance.now()-r0<3000){window.__t=Math.max(window.__t||0,performance.now())+16;frame(window.__t);k++;}fps=k/3;}
  return {own,fp,med:+fr[60].toFixed(2),p90:+fr[108].toFixed(2),fps:Math.round(fps)};}"""
async def p10(run, new_wb, FIX):
    A = await pet_page(run, new_wb, 'p10', FIX=FIX, name='ZZTEST-MVA'); B = None
    try:
        r = await A.ev(P10_JS); bad = r['bad'][:]
        B = await pet_page(run, new_wb, 'p10-B', prof='pc-1366', FIX=FIX, name='ZZTEST-MVB')
        await B.ev("()=>{P.x=-19;P.z=-4;bringFollowers(true);}")
        for _ in range(6): await A.step(6); await B.step(6); await asyncio.sleep(.3)
        c = await A.ev(COST_JS)
        errs = A.errors[:]
    finally:
        await run.close(A)
        if B: await run.close(B)
    if c['own'] + c['fp'] < 6: bad.append(f"only {c['own']} + {c['fp']} pets in view for the cost test")
    if c['p90'] > 4: bad.append(f"the pets' moves take {c['p90']} ms a frame (want under 4 ms for 2 players x 3 pets)")
    if errs: bad.append(f'browser errors {errs[:2]}')
    det = (f"{r['poses']} poses: every move x {r['kinds']} pet kinds (top hat and cape on), no move errors; lowest point at worst {r['worst']} m (allowed -0.07: a head dipping to sniff); moves in water or in the air (no floor by design: {', '.join(r['wet'])}) keep the head above 0.05 m; "
           f"2 players x 3 pets: {c['own']} own + {c['fp']} friend's pets in view, the moves take {c['med']} ms a frame (90%: {c['p90']} ms); "
           f"whole frames in this test copy (software drawing, no GPU, not an iPad): {c['fps']} a second (NOT VERIFIED on a real iPad)")
    return not bad, det + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P11 following pets are not left behind (bug-pets-left-behind) ----------------
# A long walk with 3 following pets: round the corners and fences of Friends Lane, through the park and along the beach. Every second each pet's
# distance to you is measured; a pet left behind = more than 9 m away for more than 3 s, or not in your place after the walk.
WALK_JS = r"""([loc,pts])=>{__goto(loc);P.x=pts[0][0];P.z=pts[0][1];P.yaw=0;bringFollowers(true);__run(10);const fol=PET_ACTORS.filter(p=>!p.d.stay);const far=fol.map(()=>0),worst=fol.map(()=>0),stuck=[];let reached=0,walked=0;
  for(let i=1;i<pts.length;i++){const [tx,tz]=pts[i];let best=1e9,still=0;for(let f=0;f<900;f++){const dx=tx-P.x,dz=tz-P.z,d=Math.hypot(dx,dz);if(d<.7){reached++;break;}if(d<best-.05){best=d;still=0;}else if((still+=.05)>3)break;
      P.yaw=Math.atan2(-dx,-dz);IN.keys.KeyW=true;const ox=P.x,oz=P.z;__run(1);walked+=Math.hypot(P.x-ox,P.z-oz);
      fol.forEach((p,j)=>{const g=p.loc===CUR.id?Math.hypot(p.x-P.x,p.z-P.z):99;worst[j]=Math.max(worst[j],g);far[j]=g>9?far[j]+.05:0;if(far[j]>3&&!stuck.some(s=>s.startsWith(p.d.name)))stuck.push(p.d.name+' near '+P.x.toFixed(1)+','+P.z.toFixed(1));});}
    IN.keys.KeyW=false;}
  IN.keys.KeyW=false;__run(80);const end=fol.map(p=>p.loc===CUR.id?+Math.hypot(p.x-P.x,p.z-P.z).toFixed(1):99);
  return {loc,n:fol.length,legs:pts.length-1,reached,walked:Math.round(walked),worst:worst.map(v=>+v.toFixed(1)),end,stuck,at:[+P.x.toFixed(1),+P.z.toFixed(1)]};}"""
ROUTES = [('Friends Lane, round the yard fences and gates', 'city', [[-97, 6.5], [-97, 1], [-111, 1], [-111, 6.5], [-111, 1], [-139, 1], [-139, -6.5], [-139, -1], [-170, -1], [-170, 1], [-100, 1], [-97, 6.5]]),
          ('town: corners of the park and the pavements', 'city', [[-20, -5.6], [-30, -5.6], [-45, -5.6], [-45, 6], [-30, 6], [-30, 20], [-6, 20], [-6, -6], [-20, -5.6]]),
          ('the beach, end to end', 'beach', [[976, -10], [1015, -10], [1015, 30], [976, 30], [976, -10]])]
async def p11(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p11', FIX=FIX)
    bad = []; det = []
    try:
        for name, loc, pts in ROUTES:
            r = await g.ev(WALK_JS, [loc, pts])
            det.append(f"{name}: {r['n']} pets, {r['reached']} of {r['legs']} legs walked ({r['walked']} m), farthest {r['worst']} m, after the walk {r['end']} m" + (f", LEFT BEHIND {r['stuck']}" if r['stuck'] else ''))
            if r['n'] < 3: bad.append(f'{name}: only {r["n"]} pets follow')
            if r['walked'] < 80: bad.append(f'{name}: the walk itself did not get through ({r["reached"]} of {r["legs"]} legs, stuck at {r["at"]})')
            if r['stuck']: bad.append(f'{name}: left behind {r["stuck"]}')
            if any(e > 4.5 for e in r['end']): bad.append(f'{name}: a pet not with you after the walk {r["end"]}')
        errs = g.errors[:]
        if errs: bad.append(f'browser errors {errs[:2]}')
    finally:
        await run.close(g)
    det.append('NOT IN THE GAME YET: bear and seal waiting outside (stage 4)')
    return not bad, '; '.join(det) + (f' | PROBLEMS: {bad}' if bad else '')

# ================= stage 3 (1 Nov): yard levels by skill, +3 garden beds a level, only owned things show, training gear =================
# ---------------- P12 Friends Lane's wider green border (map-lane-border) ----------------
P12_JS = r"""()=>{__goto('city');const L=LOC.city,bad=[],o={};const [a,b,c]=L.laneC;o.laneC=[a.z2,b.z1,c.z1,c.z2];
  if(a.z2!==-37.05||b.z1!==37.05||c.z1!==-37.05||c.z2!==37.05)bad.push('lane end walls '+o.laneC);
  o.free=[laneFree(-90,41.5),laneFree(-90,-41.5),laneFree(-90,43)];if(!o.free[0]||!o.free[1]||o.free[2])bad.push('laneFree '+o.free);
  o.mapTrees=mapTrees().filter(([x,z])=>x<-78&&Math.abs(z)<42).length;if(o.mapTrees)bad.push(o.mapTrees+' map trees in the lane valley');
  /* walk the strip behind every lot: free up to the new hedge, the hedge stops you at 37.5 (both sides of the road) */
  const blocked=[],through=[];for(const p of LANE_PLOTS){if(p.j===LANE.mine)continue;for(const tz of[-28,-31,-34,-36.4]){const [x,z]=lotPt(p.j,-11,tz),q=collideXZ(x,z,.3,L);if(Math.hypot(q[0]-x,q[1]-z)>.05)blocked.push([p.j,tz]);}
    const [x,z]=lotPt(p.j,-17,-37.5),q=collideXZ(x,z,.3,L);if(Math.hypot(q[0]-x,q[1]-z)<.05)through.push(p.j);}
  if(blocked.length)bad.push('the strip behind the lots is not free at '+JSON.stringify(blocked.slice(0,4)));if(through.length)bad.push('no hedge at 37.5 behind lots '+through);
  o.lots=LANE_PLOTS.length;o.blocked=blocked.length;return {o,bad};}"""
async def p12(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p12', FIX=FIX)
    try:
        r = await g.ev(P12_JS); errs = g.errors[:]
    finally:
        await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    o = r['o']
    return not bad, f"lane end walls at z {o['laneC']}; forest kept off |z| < 42 ({o['free']}), map trees in the valley {o['mapTrees']}; {o['lots']} lots: the strip behind each is free to z -36.4 and the hedge stands at 37.5" + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P13 yard levels by skill, bought at the yard sign ----------------
SIGN = r"""()=>{const t=YARD.ints.find(i=>i.icon==='🏡'&&/My yard/.test(typeof i.label==='function'?i.label():i.label));if(!t)return null;P.x=t.x;P.z=t.z+.3;t.act();
  const c=$('card');return {h:c.querySelector('h2')?c.querySelector('h2').textContent:'',rows:[...c.querySelectorAll('.row')].map(r=>r.innerText.replace(/\s+/g,' ').trim()),
    btn:[...c.querySelectorAll('.row button')].map(b=>({a:b.dataset.a||'',dis:b.disabled,t:b.innerText.trim(),h:Math.round(b.getBoundingClientRect().height)}))};}"""
P13_JS = r"""()=>{__goto('city');const bad=[],o={};S.coins=10000;S.yard={pet:1,garden:1};sk('garden').lv=19;sk('pets').lv=19;yardLv();
  const sign=()=>{const t=YARD.ints.find(i=>/My yard/.test(typeof i.label==='function'?i.label():i.label||''));t.act();const c=$('card');
    const r={rows:[...c.querySelectorAll('.row')].map(x=>x.innerText.replace(/\s+/g,' ').trim()),btn:[...c.querySelectorAll('.row button')].map(b=>({a:b.dataset.a||'',dis:b.disabled,t:b.innerText.trim(),h:Math.round(b.getBoundingClientRect().height)}))};return r;};
  const click=a=>{const b=document.querySelector('#card [data-a="'+a+'"]');if(!b)return false;b.click();return true;};
  const back=()=>Math.min(...YARD.lcols.filter(c=>c.x1!==undefined&&c.x2-c.x1>3).map(c=>c.z1));
  let s=sign();o.lv1=s.rows;if(!(s.btn.length===2&&s.btn.every(b=>b.dis)&&/🔒 Gardening level 20/.test(s.btn[0].t)&&/🔒 Pet care level 20/.test(s.btn[1].t)))bad.push('skill 19: '+JSON.stringify(s.btn));
  click('yardup:garden');if(S.yard.garden!==1)bad.push('garden level 2 bought at gardening 19');
  o.back1=+back().toFixed(2);o.beds1=[36,39].map(plotOpen);closePanel();
  sk('garden').lv=20;sk('pets').lv=20;s=sign();o.btn20=s.btn.map(b=>b.t);if(!/Level 2 · 600 🪙/.test(s.btn[0].t)||!/Level 2 · 800 🪙/.test(s.btn[1].t)||s.btn.some(b=>b.dis||b.h<44))bad.push('level 2 buttons '+JSON.stringify(s.btn));
  let c0=S.coins;click('yardup:garden');o.paidG2=c0-S.coins;c0=S.coins;click('yardup:pet');o.paidP2=c0-S.coins;o.lv2=[S.yard.garden,S.yard.pet];o.back2=+back().toFixed(2);
  o.beds2=[36,37,38,39,40,41].map(plotOpen);s=sign();o.btn2=s.btn.map(b=>b.t);if(!s.btn.every(b=>b.dis&&/level 40/.test(b.t)))bad.push('level 3 before skill 40: '+JSON.stringify(s.btn));closePanel();
  sk('garden').lv=40;sk('pets').lv=40;s=sign();if(!/Level 3 · 1,500 🪙/.test(s.btn[0].t)||!/Level 3 · 2,000 🪙/.test(s.btn[1].t))bad.push('level 3 buttons '+JSON.stringify(s.btn));
  c0=S.coins;click('yardup:garden');o.paidG3=c0-S.coins;o.backG3=+back().toFixed(2);c0=S.coins;click('yardup:pet');o.paidP3=c0-S.coins;o.back3=+back().toFixed(2);
  o.beds3=[36,37,38,39,40,41].map(plotOpen);s=sign();o.top=s.rows;if(s.btn.length||s.rows.filter(r=>/Top level! ⭐/.test(r)).length!==2)bad.push('top level rows '+JSON.stringify(s.rows));closePanel();
  /* the big-pets gate: two posts at z -29 with a way between, the iron fence round the area */
  o.gate=YARD.lcols.filter(c=>c.cr!==undefined&&Math.abs(c.cz+29)<.01).map(c=>+c.cx.toFixed(2));if(o.gate.length!==2)bad.push('gate posts '+o.gate);
  /* not enough coins: nothing bought */
  S.yard={pet:1,garden:1};yardLv();S.coins=500;s=sign();click('yardup:garden');o.poor=[S.yard.garden,S.coins];if(S.yard.garden!==1||S.coins!==500)bad.push('bought with too few coins');closePanel();
  /* a new bed works like today's: plant, water */
  S.yard={pet:3,garden:3};yardLv();S.bag.seed_carrot=2;const rec=PLOTS.find(p=>p.pl.i===40);rec.target.act();const pb=document.querySelector('#card [data-a="plant:carrot"]');if(pb)pb.click();o.planted=(S.garden[40]||{}).seed||null;
  rec.target.act();o.watered=(S.garden[40]||{}).w===S.day;o.when=[rec.target.when(),PLOTS.find(p=>p.pl.i===36).target.when()];if(o.planted!=='carrot'||!o.watered||!o.when.every(Boolean))bad.push('bed 41 (spot 40): '+JSON.stringify([o.planted,o.watered,o.when]));
  o.slots=S.garden.length;o.max=PET_MAX;if(PET_MAX!==10)bad.push('pet limit '+PET_MAX);
  const W={paidG2:600,paidP2:800,paidG3:1500,paidP3:2000};for(const k in W)if(o[k]!==W[k])bad.push(k+' '+o[k]);
  if(o.back1!==-24.68||o.back2!==-27.68||o.backG3!==-29.08||o.back3!==-35.1)bad.push('back fence '+[o.back1,o.back2,o.backG3,o.back3]);
  if(o.beds1.some(Boolean)||o.beds2.join()!=='true,true,true,false,false,false'||!o.beds3.every(Boolean))bad.push('new beds open '+[o.beds1,o.beds2,o.beds3]);
  return {o,bad};}"""
async def p13(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p13', FIX=FIX)
    try:
        r = await g.ev(P13_JS); await g.step(4); errs = g.errors[:]
    finally:
        await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    o = r['o']
    det = (f"🏡 My yard at skill 19: {o['lv1']} (both faded, 🔒 Gardening/Pet care level 20); at 20: {o['btn20']}; paid {o['paidG2']} + {o['paidP2']}, levels {o['lv2']}; at 40: paid {o['paidG3']} + {o['paidP3']}; then {o['top']}; "
           f"back fence z {o['back1']} -> {o['back2']} -> {o['backG3']} (garden 3) -> {o['back3']} (pet yard 3), big-pets gate posts at x {o['gate']}; new beds open at garden 1/2/3: {o['beds1']} / {o['beds2']} / {o['beds3']}; "
           f"with 500 coins nothing bought {o['poor']}; spot 41 planted {o['planted']}, watered {o['watered']}; pet limit {o['max']}")
    return not bad, det + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P14 only what you own shows ----------------
P14_JS = r"""()=>{__goto('city');const bad=[],o={};S.yard={pet:1,garden:1};const pots=()=>YARD.lcols.filter(c=>c.cr!==undefined&&Math.abs(c.cr-.32)<1e-6).length;
  const shown=lv=>{sk('garden').lv=lv;yardLv();const vis=PLOTS.filter(r=>r.pl.pot&&r.soil&&r.soil.visible).length,act=PLOTS.filter(r=>r.pl.pot&&r.target.when()).length,plates=PLOTS.filter(r=>r.pl.pot&&!plotOpen(r.pl.i)&&r.icon).length;return [pots(),vis,act,plates];};
  o.pots={};for(const lv of[1,9,10,20,30,40,50]){o.pots[lv]=shown(lv);const n=lv<10?0:6*Math.floor(lv/10);const [a,b,c,d]=o.pots[lv];if(a!==n||b!==n||c!==n||d)bad.push(`gardening ${lv}: ${a} pots drawn, ${b} soils, ${c} usable, ${d} lock plates (want ${n}, ${n}, ${n}, 0)`);}
  sk('garden').lv=1;yardLv();o.beds=PLOTS.filter(r=>!r.pl.pot&&r.soil&&r.soil.visible).length;if(o.beds!==6)bad.push(o.beds+' beds at garden level 1');
  o.gear=YARD.gear.filter(Boolean).length;S.yard.gear=[];yardLv();o.gear0=YARD.gear.filter(Boolean).length+YARD.lvg.children.length-1;if(o.gear0)bad.push('gear drawn before it is bought');
  o.doghouse=S.home.items.filter(it=>it.t==='doghouse').length;return {o,bad};}"""
async def p14(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p14', FIX=FIX)
    try:
        r = await g.ev(P14_JS); errs = g.errors[:]
    finally:
        await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    o = r['o']
    return not bad, f"pots [drawn, soil, usable, lock plates] by gardening level: {o['pots']}; beds at garden 1: {o['beds']}; nothing else drawn before it is bought (gear {o['gear0']})" + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P15 training gear: bought at Ms. Paws, stands in the yard, pets play on it ----------------
P15_SHOP = r"""()=>{__goto('city');const bad=[],o={};S.yard={pet:1,garden:1};yardLv();S.coins=5000;openShop('pets');
  const btn=id=>document.querySelector('#card [data-a="gear:'+id+'"]');o.n=GEAR_IDS.filter(btn).length;o.dog=btn('dog')&&btn('dog').innerText.replace(/\s+/g,' ');
  if(o.n!==10||!/🔒 Pet yard level 2/.test(o.dog||''))bad.push('gear in the shop: '+o.n+', dog '+o.dog);
  const W={dog:300,dog2:300,cat:200,cat2:200,bunny:150,bunny2:150,hamster:150,duck:200,owl:200,capy:250};for(const k in W)if(GEAR[k].p!==W[k])bad.push('price '+k+' '+GEAR[k].p);
  let c=S.coins;btn('dog').click();o.dogL1=[c-S.coins,(S.yard.gear||[]).length];if(o.dogL1[0]||o.dogL1[1])bad.push('dog course bought at pet yard 1');
  c=S.coins;btn('cat').click();o.cat=c-S.coins;c=S.coins;btn('bunny').click();o.full=[c-S.coins,S.yard.gear.join()];if(o.cat!==200||o.full[0]||o.full[1]!=='cat')bad.push('pet yard 1: '+JSON.stringify([o.cat,o.full]));
  o.own=btn('cat').disabled&&/In your yard/.test(btn('cat').innerText);if(!o.own)bad.push('the cat tower does not say it is yours');
  S.yard.pet=2;yardLv();openShop('pets');c=S.coins;btn('dog').click();o.dog2=c-S.coins;S.yard.pet=3;yardLv();openShop('pets');btn('duck').click();o.l3=S.yard.gear.join();o.place=YARD.gear.map(q=>q&&[q.id,q.k,+q.s.toFixed(2)]);
  if(o.dog2!==300||o.l3!=='cat,dog,duck'||YARD.gear.filter(Boolean).length!==3)bad.push('levels 2 and 3: '+JSON.stringify([o.dog2,o.l3,o.place]));closePanel();
  /* every piece fits a spot at pet yard 3, never smaller than 0.6 of its moves' size, and inside the yard */
  o.fit={};for(const id of GEAR_IDS){const q=gearPlace([id],3)[0];o.fit[id]=q?[q.k,+(q.s/GEAR[id].s).toFixed(2)]:null;if(!q)bad.push(id+' fits nowhere');}
  S.yard.bw=0;o.hc0=homeCare();S.yard.bw=600;S.home.items=S.home.items.filter(it=>!['toybox','cattree'].includes(it.t));rebuildHome();o.hc=homeCare();if(o.hc0||!o.hc)bad.push('home care with a full bowl and yard gear: '+[o.hc0,o.hc]);
  return {o,bad};}"""
P15_PLAY = r"""([id])=>{__goto('city');S.yard={pet:3,garden:1,gear:[id]};yardLv();const q=YARD.gear.find(Boolean),k=GEAR[id].k[0],T=PET_TYPES[k];
  const e=PET_ACTORS.find(p=>!p.d.stay);e.d.type=T.base||k;if(T.base)e.d.kind=k;else delete e.d.kind;rebuildPet(e);e.d.sick=0;
  const sl=GEAR_SLOTS[q.k],[px,pz]=yardPt(sl.x,sl.z+(q.k===2?-1.6:1.9));P.x=px;P.z=pz;bringFollowers(true);__run(6);
  q.o.updateWorldMatrix(true,true);const B=new THREE.Box3().setFromObject(q.o).expandByScalar(1),seen=[],t=gearLabel(q.k);let out=0,frames=0,y0=9,y1=-9,lift=0;const real=renderer.render;renderer.render=()=>{};
  for(const p of PET_ACTORS)p.d.happy=50;let e2=e;
  try{gearUse(q.k);e2=PET_ACTORS.find(p=>p.gp)||e;for(let i=0;i<900&&e2.gp;i++){window.__t=Math.max(window.__t||0,performance.now())+50;frame(window.__t);frames++;if(e2.gm&&!seen.includes(e2.gm))seen.push(e2.gm);
    if(e2.gp&&e2.gp.i>0){if(e2.x<B.min.x||e2.x>B.max.x||e2.z<B.min.z||e2.z>B.max.z)out++;y0=Math.min(y0,e2.gy);y1=Math.max(y1,e2.gy);}}}finally{renderer.render=real;}
  return {id,label:t,moves:seen,frames,s:+(frames*.05).toFixed(1),done:!e2.gp,happy:Math.round(e2.d.happy-50),after:e2.sm,out,y:[+y0.toFixed(2),+y1.toFixed(2)],warned:!!(e2.m.__mv&&e2.m.__mv.warned)};}"""
GEAR_WANT = {'dog': ['dog.agility'], 'dog2': ['dog.agility'], 'cat': ['cat.wand'], 'cat2': ['cat.wand'], 'bunny': ['bunny.hurdles'], 'bunny2': ['bunny.hurdles'],
             'hamster': ['hamster.wheel'], 'duck': ['duck.splash', 'duck.paddle'], 'owl': ['owl.fly', 'owl.perch'], 'capy': ['capy.hopIn', 'capy.tub']}
async def p15(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p15', FIX=FIX); bad = []; det = []
    try:
        r = await g.ev(P15_SHOP); bad += r['bad']; o = r['o']
        det.append(f"Ms. Paws sells {o['n']} pieces of gear (dog course: '{o['dog']}' at pet yard 1); cat tower {o['cat']} coins, a second piece at pet yard 1 refused {o['full']}; dog course at level 2 {o['dog2']}; at level 3 {o['place']}; "
                   f"fit [spot, size vs the moves' size]: {o['fit']}; home pets at half speed with a full bowl and yard gear (no toy box) {o['hc']}")
        for gid, want in GEAR_WANT.items():
            p = await g.ev(P15_PLAY, [gid])
            ok = p['done'] and all(m in p['moves'] for m in want) and p['happy'] == 20 and p['after'] == 'pet.happyDance' and p['out'] == 0 and not p['warned']
            det.append(f"{gid}: '{p['label']}' -> {p['moves']} for {p['s']} s, +{p['happy']} happiness, then {p['after']}, height {p['y']} m" + ('' if p['out'] == 0 else f", {p['out']} frames more than 1 m off its gear"))
            if not ok: bad.append(f'{gid}: {p}')
        errs = g.errors[:]
        if errs: bad.append(f'browser errors {errs[:2]}')
    finally:
        await run.close(g)
    det.append('NOT VERIFIED: how the gear play looks (no pictures looked at in stage 3); friends do not see the gear moves themselves (the move code is left out), they see the pet at its spot')
    return not bad, '; '.join(det) + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P16 friends see your yard (levels, gear), old versions as before ----------------
P16_JS = r"""()=>{__goto('city');const bad=[],o={};S.yard={pet:3,garden:2,gear:['cat','dog','duck']};sk('pets').lv=40;yardLv();const st={};laneStamp(st);o.yd=st.yd;if(o.yd!=='23cah')bad.push('presence yd '+o.yd);
  S.yard={pet:1,garden:1};yardLv();const s2={};laneStamp(s2);o.yd0=s2.yd;if(s2.yd!==null)bad.push('levels 1 and no gear send '+s2.yd);
  const lp=LOC.city.lane.find(l=>l.j!==LANE.mine),cnt=()=>{let v=0;lp.g.traverse(m=>{if(m.isMesh&&m.geometry&&m.geometry.attributes.position)v+=m.geometry.attributes.position.count;});return v;},C=LOC.city;
  const base={k:'zz',nm:'Zed',big:0,fl:1,col:'',gd:''};laneHouse(lp,base);const a=cnt(),ca=C.cols.length;laneHouse(lp,Object.assign({},base,{yd:'23cah'}));const b=cnt(),cb=C.cols.length;
  o.yc=lp.yc.length;const back=Math.max(...lp.yc.filter(c=>c.x1!==undefined).map(c=>Math.max(Math.abs(c.z1),Math.abs(c.z2))));o.back=+back.toFixed(2);
  laneHouse(lp,Object.assign({},base,{yd:'zz<script>'}));const c=cnt(),cc=C.cols.length;laneHouse(lp,base);const d=cnt(),cd=C.cols.length;
  o.v=[a,b,c,d];o.cols=[ca,cb,cc,cd];if(!(b>a&&c===a&&d===a&&cb>ca&&cc===ca&&cd===ca))bad.push('friend lot vertices/walls without, with, bad yd, again: '+o.v+' / '+o.cols);if(Math.abs(o.back-35.1)>.05)bad.push('friend back fence '+o.back);
  const pr={peer:'zz',nm:'Zed',loc:'city',yd:'23cah'};const A={};laneFields(A,pr,true);o.read=A.yd;const pr2={peer:'zz',nm:'Zed',loc:'city'};const A2={};laneFields(A2,pr2,true);o.old=A2.yd;
  MP.peers.set('zz',Object.assign({peer:'zz',nm:'Zed',jt:1,gd:'',hc:'',hf:1},A));const as=laneAssign();const j=as.slot.get('zz');MP.peers.delete('zz');o.list=j!=null&&as.own[j].yd;if(o.read!=='23cah'||o.old!==''||o.list!=='23cah')bad.push('presence read '+[o.read,o.old,o.list]);
  return {o,bad};}"""
async def p16(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p16', FIX=FIX)
    try:
        r = await g.ev(P16_JS); await g.step(4); errs = g.errors[:]
    finally:
        await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    o = r['o']
    return not bad, (f"presence yd '{o['yd']}' (garden 2, pet yard 3, cat tower + dog course + duck tub), {o['yd0']} at levels 1 with no gear (old look); a friend's lot drawn from it: vertices {o['v'][0]} -> {o['v'][1]}, "
                     f"{o['yc']} fence walls, back fence at {o['back']} m; a bad yd and no yd draw it as before; read from presence {o['read']!r}, an old version's {o['old']!r}, on the lane list {o['list']!r}; "
                     "NOT VERIFIED: two real devices (the fake online kit only)") + (f' | PROBLEMS: {bad}' if bad else '')

# ================= stage 4 (1 Nov 2026): the vet station, big-needs pets locked =================
# ---------------- P17 the vet station: the building, inside, the four staff, the visit ----------------
TREES_JS = r"""()=>{const out=(x,z)=>!(x>6&&x<21.5&&z>-86&&z<-68.5),r=v=>Math.round(v*100)/100,C=LOC.city;
  return {groups:(C.treeGroups||[]).map(g=>g.map(r)),map:mapTrees().filter(([x,z])=>out(x,z)).map(t=>t.map(r)),cols:C.cols.filter(c=>c.cr!==undefined?out(c.cx,c.cz):out((c.x1+c.x2)/2,(c.z1+c.z2)/2)).length};}"""
P17_JS = r"""()=>{const o={},bad=[],V=LOC.vet,C=LOC.city;if(!V)return {bad:['no vet station in the game']};
  const lab=t=>typeof t.label==='function'?t.label():t.label,door=C.inter.find(t=>/Vet Station/.test(lab(t)));o.door=door?[r2(door.x),r2(door.z)]:null;
  function r2(v){return Math.round(v*10)/10;}
  if(!door||Math.hypot(door.x-8.6,door.z+77.2)>1)bad.push('no door into the vet station at x 8.6, z -77.2 (Map: x 14.2, z -77.2, door to the west)');
  if(!PLACES.some(p=>p.id==='vet'&&p.nq))bad.push('the vet station is not on the map (or counts for quests)');
  const inBox=(x,z)=>x>9.7&&x<18.7&&z>-83.2&&z<-71.2;o.walkIn=[[14,-76],[12,-74],[17,-79],[10.2,-77.2]].filter(([x,z])=>{const q=collideXZ(x,z,.3,C);return inBox(q[0],q[1]);}).length;
  if(o.walkIn)bad.push(o.walkIn+' spots inside the clinic you can stand on');
  o.stray=C.cols.filter(c=>c.cr!==undefined&&inBox(c.cx,c.cz)).length+(C.owlTrees||[]).filter(([x,z])=>x>6&&x<21.5&&z>-86&&z<-68.5).length+mapTrees().filter(([x,z])=>inBox(x,z)).length;if(o.stray)bad.push(o.stray+' trees or bushes left inside the clinic');
  o.staff=KEEPERS.filter(k=>k.L===V).map(k=>k.name);for(const n of['Nurse Penny','Dr. Rūta','Vet nurse Leo','Dr. Tomas'])if(!o.staff.includes(n))bad.push('missing '+n);
  if(!V.fls||V.fls.length!==2)bad.push('the station should have 2 floors');
  /* the people's moves at the table keep their feet on the floor */
  const bb=new THREE.Box3();o.feet=[];for(const [n,mv] of[['Dr. Rūta','vet.listen'],['Dr. Rūta','vet.check'],['Vet nurse Leo','nurse.treat']]){const k=KEEPERS.find(q=>q.name===n),y0=k.p.root.position.y;let lo=9,hi=-9;
    for(let t=0;t<3;t+=.25){COZY_MOVES.play(k.p,mv,t,{kind:'person'});k.p.root.updateMatrixWorld(true);bb.setFromObject(k.p.root);lo=Math.min(lo,bb.min.y-y0);hi=Math.max(hi,bb.min.y-y0);}COZY_MOVES.play(k.p,mv,0,{kind:'person'});
    o.feet.push(n+' '+mv+' '+lo.toFixed(3)+'..'+hi.toFixed(3));if(lo<-.07||hi>.03)bad.push(n+' '+mv+': feet at '+lo.toFixed(3)+'..'+hi.toFixed(3)+' m');}
  /* in through the door, up the stairs */
  P.x=door.x;P.z=door.z;door.act();o.in=null;return {o,bad};}"""
VISIT_JS = r"""()=>{const o={},bad=[],V=LOC.vet;o.loc=CUR.id;o.at=[Math.round((P.x-V.ox)*10)/10,Math.round((P.z-V.oz)*10)/10];if(CUR!==V)bad.push('the door did not take you in: '+CUR.id);
  const T=[];window.toast=(m)=>{T.push(m);};const F=PET_ACTORS.filter(e=>!e.d.stay),said=()=>T.splice(0).join(' | ');
  const up=()=>{setT(12);__goto('vet');P.x=V.ox-2.2;P.z=V.oz+UPZ-.4;P.yaw=0;floorVis();bringFollowers(true);__run(2);for(const e of F){e.d.sick=0;e.d.sad=0;}S.vet.bk=null;};
  const setT=h=>{__clockMs(msAt(S.day,h)-CLK.sk);__run(1);};   /* (the test clock under a night skip that an earlier test left in the shared room) */
  up();o.fl=flOf(V,P.z);
  /* a visit with two sick pets and 500 coins */
  F[0].d.sick=1;F[1].d.sick=1;S.coins=500;said();vetStart();__run(60);const e=F[0];o.table=[e.ps,Math.round((e.g.position.x-V.ox)*100)/100,e.g.position.y,Math.round((e.g.position.z-V.oz-UPZ)*100)/100,VX&&VX.pm];
  if(!e.ps||Math.abs(e.g.position.y-.99)>.01||Math.hypot(e.g.position.x-(V.ox-2.2),e.g.position.z-(V.oz+UPZ-2.6))>.05)bad.push('the first pet is not on the exam table: '+o.table);
  o.vetMv=VK('Dr. Rūta').mv;if(!/^vet\./.test(o.vetMv||''))bad.push('Dr. Rūta does not examine (move '+o.vetMv+')');
  __run(110);o.leo=VK('Vet nurse Leo').mv;if(o.leo!=='nurse.treat')bad.push('Leo does not give the treat (move '+o.leo+')');
  __run(400);o.after=[!!VX,F[0].d.sick,F[1].d.sick,S.coins,Math.round(F[0].d.happy),F.some(x=>x.ps)];o.lines=said();
  if(VX||F[0].d.sick||F[1].d.sick||S.coins!==400||Math.round(F[0].d.happy)!==40||F.some(x=>x.ps))bad.push('after the visit: '+o.after);
  const want=["Hello, "+F[0].d.name+"! Let's have a look.",'Ears... fine.','Teeth... fine.','Ah, a little cold.',"Here's a treat for being brave!","Next one! Hello, "+F[1].d.name+"!","Don't let "+F[0].d.name+" and "+F[1].d.name+" get sad. Play, cuddles, toys every day!","That's 100 coins for 2 pets, please."];
  let at=0;for(const w of want){const i=o.lines.indexOf(w,at);if(i<0){bad.push('missing or out of order: '+w);}else at=i;}
  /* too few coins: free */
  up();F[0].d.sick=1;S.coins=30;vetStart();__run(300);o.free=[S.coins,F[0].d.sick,said().includes("Don't worry, it's free today.")];if(S.coins!==30||F[0].d.sick||!o.free[2])bad.push('with 30 coins: '+o.free);
  /* your time later today: wait; a friend's time now: busy; closed at night; nobody sick */
  up();F[0].d.sick=1;S.vet.bk={d:S.day,h:19,ids:[F[0].d.id]};vetStart();o.early=[!!VX,said()];if(VX||!o.early[1].includes('Your time is'))bad.push('too early: '+o.early);
  S.vet.bk=null;MP.peers.set('zztest-vet',{vb:[S.day,11]});vetStart();o.taken=[!!VX,said()];MP.peers.delete('zztest-vet');if(VX||!/busy/.test(o.taken[1]))bad.push("a friend's time now: "+o.taken);
  setT(23.5);vetStart();o.night=[!!VX,said()];if(VX||!/closed/.test(o.night[1]))bad.push('at night: '+o.night);
  up();vetStart();o.well=said();if(!/healthy/.test(o.well))bad.push('nobody sick: '+o.well);
  /* walking away in the middle: no cure, no coins */
  F[0].d.sick=1;S.coins=500;vetStart();__run(40);__goto('city');__run(3);o.away=[!!VX,F[0].d.sick,S.coins,F[0].ps];if(VX||!F[0].d.sick||S.coins!==500||F[0].ps)bad.push('walked away: '+o.away);
  /* Nurse Penny's desk */
  up();__goto('vet');__run(2);const card=()=>($('card')&&!$('panel').hidden?$('card').innerText:'');openVetDesk();o.hello=card();if(!o.hello.includes('Welcome to the vet station'))bad.push('Penny: '+o.hello);
  vetDesk('b');o.d1=card();vetDesk('t');o.d2=card();F[0].d.sick=1;vetDesk('b');o.d3=card();S.vet.bk={d:S.day,h:19,ids:[F[0].d.id]};vetDesk('b');o.d4=card();S.vet.bk=null;
  MP.peers.set('zztest-vet',{vb:[S.day,11]});vetDesk('b');o.d5=[PH.app,!$('panel').hidden];MP.peers.delete('zztest-vet');closePanel();F[0].d.sick=0;
  if(!o.d1.includes('Your pets look healthy'))bad.push('Penny, nobody sick: '+o.d1);if(!/very happy|bored|loves the/.test(o.d2))bad.push('Penny, tip: '+o.d2);
  if(!o.d3.includes('Nobody is waiting'))bad.push('Penny, walk in: '+o.d3);if(!o.d4.includes('Come back between 19:00 and 21:00'))bad.push('Penny, booked: '+o.d4);if(o.d5[0]!=='vet')bad.push('Penny, time taken: the booking screen did not open '+o.d5);
  for(const k of['hello','d1','d2','d3','d4'])o[k]=o[k].split('\n').filter(Boolean)[1]||'';
  __goto('vet');__run(1);P.x=V.ox-(V.W-.9);P.z=V.oz-.6;hclimb(1);for(let i=0;i<60;i++)__run(1);   /* (the climb ends with a fade: P17 waits, then reads the floor) */
  return {o,bad};}"""
async def p17(run, live_w, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p17', FIX=FIX, name='ZZTEST-VET')
    try:
        await g.ev("()=>{__goto('city');__run(2);}")
        a = await g.ev(P17_JS); await g.wait(1200); await g.step(10)
        b = await g.ev(VISIT_JS); await g.wait(1200); await g.step(4)
        b['o']['climb'] = await g.ev("()=>flOf(LOC.vet,P.z)")
        if b['o']['climb'] != 1: b['bad'].append('the stairs did not take you up')
        trees_new = await g.ev(TREES_JS); errs = g.errors[:]
    finally: await run.close(g)
    # the town's trees, bushes and walls outside the clinic, as the stage-3 build made them (pfu-trees-stage3.json, measured with TREES_JS on 1 Nov;
    # the live game is no reference: stage 3's wider Friends Lane valley already moved the forest)
    trees_live = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pfu-trees-stage3.json')))
    bad = a.get('bad', []) + b['bad']
    same = trees_new == trees_live
    if not same: bad.append(f"the town's trees and bushes outside the clinic moved: groups {trees_live['groups'][:2]} -> {trees_new['groups'][:2]}, map trees {len(trees_live['map'])} -> {len(trees_new['map'])}, walls {trees_live['cols']} -> {trees_new['cols']}")
    if errs: bad.append(f'browser errors {errs[:2]}')
    o, v = a.get('o', {}), b['o']
    det = (f"door {o.get('door')}, walk-in spots inside the walls {o.get('walkIn')}, trees/bushes left there {o.get('stray')}; staff {o.get('staff')}; people's feet {o.get('feet')}; "
           f"in at {v['at']}; pet on the table {v['table']}, vet move {v['vetMv']}, nurse move {v['leo']}; after (visit on, sick, sick, coins, hearts*20, on table) {v['after']}; lines: {v['lines'][:400]!r}; "
           f"30 coins {v['free']}; too early {v['early']}; friend's time {v['taken']}; night {v['night']}; well {v['well']!r}; walked away {v['away']}; "
           f"Penny {v['hello']!r} / {v['d1']!r} / {v['d2']!r} / {v['d3']!r} / {v['d4']!r} / time taken -> {v['d5']}; stairs -> floor {v['climb']}; "
           f"other trees and bushes as in the stage-3 build: {same} ({len(trees_new['map'])} map trees, {len(trees_new['groups'])} groups)")
    return not bad, det + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P18 big-needs pets: locked at Ms. Paws, the first missing thing named ----------------
P18_JS = r"""()=>{const o={},bad=[],L=LOC.pets;__goto('pets');const it=L.inter.find(t=>t.label==='Big pets');if(!it||Math.abs(it.z-L.oz-UPZ)>2)bad.push('no Big pets board upstairs in the Pet Shop');
  const keep=[sk('pets').lv,S.yard.pet,S.lic.lv,window.bigHome],K=['monkey','seal','bear','snake'],texts=[];
  const rows=()=>{openBig();const B=[...document.querySelectorAll('#card [data-a^="bigp:"]')];o.small=(o.small||0)+B.filter(b=>b.getBoundingClientRect().height<44).length;texts.push($('card').innerText);const r=B.map(b=>b.innerText.replace(/\s+/g,' ').trim());closePanel();return r;};
  const say=k=>{let m='';const t0=window.toast;window.toast=x=>{m=x;};bigPaws(k);window.toast=t0;texts.push(m);return m.replace(/^🐾 Ms\. Paws: “|”$/g,'');};
  const steps=[['start',()=>{sk('pets').lv=1;S.yard.pet=1;S.lic.lv=0;},['🐒 🔒 Pet care 40','🦭 🔒 Pet care 40','🐻 🔒 Pet care 40','🐍 🔒 Glass tank'],{monkey:'Monkeys need a lot of care. Reach Pet care 40 first!',snake:'Where would it live? Get a glass tank in your house first!'}],
    ['Pet care 40',()=>{sk('pets').lv=40;},['🐒 🔒 Pet yard level 3','🦭 🔒 Pet yard level 3','🐻 🔒 Pet yard level 3','🐍 🔒 Glass tank'],{seal:'A seal needs lots of space. Grow your pet yard to level 3!'}],
    ['pet yard 3',()=>{S.yard.pet=3;},['🐒 🔒 Climbing tree','🦭 🔒 Pond','🐻 🔒 Cave den','🐍 🔒 Glass tank'],{bear:'Where would it live? Get a cave den first!'}],
    ['homes',()=>{window.bigHome=()=>true;},['🐒 🔒 Animal license 1','🦭 🔒 Animal license 1','🐻 🔒 Animal license 3','🐍 🔒 Animal license 1'],{bear:'You need an animal license, level 3. Win at the Pet Show!'}],
    ['license 1',()=>{S.lic.lv=1;},['🐒 Ready!','🦭 Ready!','🐻 🔒 Animal license 3','🐍 Ready!'],{snake:'Everything is ready. A snake will love your home!'}],
    ['license 3',()=>{S.lic.lv=3;},['🐒 Ready!','🦭 Ready!','🐻 Ready!','🐍 Ready!'],{bear:'Everything is ready. A bear will love your home!'}]];
  o.seen=[];for(const [n,f,want,lines] of steps){f();const r=rows();o.seen.push(n+': '+r.join(', '));if(JSON.stringify(r)!==JSON.stringify(want))bad.push(n+': '+r.join(', '));
    for(const k in lines){const m=say(k);if(m!==lines[k])bad.push(n+' '+k+': '+m);}}
  [sk('pets').lv,S.yard.pet,S.lic.lv,window.bigHome]=keep;
  if(texts.some(t=>/exotic/i.test(t)))bad.push('the word exotic');if(o.small)bad.push(o.small+' buttons under 44 px');
  return {o,bad};}"""
async def p18(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p18', FIX=FIX, name='ZZTEST-BIG')
    try: r = await g.ev(P18_JS); errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    return not bad, f"Big pets board upstairs; {' | '.join(r['o']['seen'])}" + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- the stage ----------------
async def s_pfu(run, d, live_w, new_wb, FIX):
    tests = [('P1', 'Saves (pets and farm update): every save of the kit (from older versions, today\'s main and the update\'s stages) and a fresh one from the live version loads as save version 2 with every new field at its default; saved again and loaded, it is exactly the same', lambda: p1(run, live_w, new_wb, FIX)),
             ('P2', 'Night skip: at night, when every player online is in their own bed (alone: your own bed), the clock jumps to 7:00 for everyone together and the skip is saved online once; a friend awake, asleep outside their own bed (tent) or an older version online keeps the night going', lambda: p2(run, live_w, new_wb, FIX)),
             ('P3', 'Morning bus home: every day the bus waits at the beach 8:00-9:30 and goes to town (bus days unchanged, still 3 a week); free with under 20 coins, else 20; the pill and the timetable card show it', lambda: p3(run, new_wb, FIX)),
             ('P4', 'Hats sit on the hair: on every hairdo no hair sticks up through any hat, the party hat or a costume\'s hood', lambda: p4(run, new_wb, FIX)),
             ('P5', 'One need, happiness (stage 2): about an hour of play from full to sad, paused while away, half speed at home with a full bowl and a toy; moods by hearts (5 very very happy, 3-4 happy, 2 normal, 0-1 sad) with body language; 3 food groups (meat, fish, fruit & veggies; same items): every pet eats every food, its own +40 and a happy dance, others and treats +30; the no-food line; the shop says who loves each food', lambda: p5(run, new_wb, FIX)),
             ('P6', 'Sickness (stage 2; switched on since stage 4 put the vet station in): on in the game; with the switch off no pet ever gets sick; on, about an hour of play at 0-1 hearts makes a pet sick, with warning sneezes the last 15 minutes that stop when it cheers up; only the vet cures it (normal mood, 50 coins a pet, free with too few); no Pet Show and no Ms. Paws while sick', lambda: p6(run, new_wb, FIX)),
             ('P7', 'Vet booking (stage 2): Book the vet in the Pets app (44 px); all well, or the sick pets and the next 8 two-hour times between 7:00 and 23:00; booked card with time, pets and Cancel; a reminder one game hour before; late = booking gone, no coins lost; one list for the room (a friend sees the time taken)', lambda: p7(run, new_wb, FIX)),
             ('P8', 'Care helpers (stage 2): one food fills the home bowl for one game day of play; the pets with you nap when you sleep (no loss at night) and wake happier; a healthy week (care on 3+ days Mon-Fri, no pet sick) puts the green ribbon on every pet for the weekend and counts for the animal license', lambda: p8(run, new_wb, FIX)),
             ('P9', 'Friends see your pets for real (stage 2): hearts, sick look and the same move at the same time, as a short code at the end of each pet row; friends pet and play with your pets (no feeding), your pet gets happier and they get pet XP; with an older version online the codes are left out and it still shows the pets', lambda: p9(run, live_w, new_wb, FIX)),
             ('P10', 'Moves pack (stage 2; stage 3 adds the yard-gear moves): every pet move on every pet kind without an error, feet on the floor (a yard-gear move on the kinds that play it; a move in water or in the air: the head stays in view); the moves of 2 players x 3 following pets take under 4 ms a frame', lambda: p10(run, new_wb, FIX)),
             ('P11', 'Pets are not left behind (stage 2 play test): long walks with 3 following pets on Friends Lane round the yard fences, through town corners and along the beach; no pet more than 9 m away for over 3 s, all with you after each walk', lambda: p11(run, new_wb, FIX)),
             ('P12', 'Friends Lane border (stage 3, map-lane-border): the hedges stand 37.5 m off the road (were 26.6), the lane ends and walls with them, the forest and the map keep the valley free to 42 m; the strip behind every lot is free', lambda: p12(run, new_wb, FIX)),
             ('P13', 'Yard levels by skill (stage 3): the 🏡 My yard sign sells garden level 2 (600, gardening 20) and 3 (1,500, gardening 40) and pet yard level 2 (800, Pet care 20) and 3 (2,000, Pet care 40), faded with the skill too low, Top level! at 3; the yard grows at once (fence back, big-pets gate at level 3); each garden level opens 3 new beds (spots 36-41) that work like the old ones; the pet limit stays 10', lambda: p13(run, new_wb, FIX)),
             ('P14', 'Only what you own shows (stage 3): a pot is drawn and usable only once it opens (6 at each gardening level 10-50), no lock plates; the new beds only with their garden level; no training gear before it is bought', lambda: p14(run, new_wb, FIX)),
             ('P15', 'Training gear (stage 3): Ms. Paws sells the 10 pieces at their prices (dog course from pet yard level 2), one of each, refused when the yard has no room; it stands in the yard at once; tapped, a pet of its kind plays on it with its own moves (+20 happiness, then a happy dance); a full bowl and yard gear keep home pets at half speed', lambda: p15(run, new_wb, FIX)),
             ('P16', "Friends see your yard (stage 3): your garden level, pet yard level and gear go online as one short code (nothing at levels 1 with no gear); a friend's lot is drawn from it with its fences and gear; an old version's or a bad code draws the lot as before", lambda: p16(run, new_wb, FIX)),
             ('P17', "Vet station (stage 4): the clinic on the town's north edge (Map x 14.2, z -77.2, door to the west, on the map), solid walls, no tree or bush left inside it and every other one where the stage-3 build has it; 2 floors, Nurse Penny, Dr. Rūta, Vet nurse Leo, Dr. Tomas; the visit: sick pets with you go on the exam table one by one, Dr. Rūta checks (ears, teeth, a little cold), Leo gives a treat, cured, normal mood, 50 coins a pet or free with too few; too early, a friend's time or closed: no visit; walking away: no cure, no coins; Penny books, tips and sends you up; the people's feet on the floor", lambda: p17(run, live_w, new_wb, FIX)),
             ('P18', "Big-needs pets (stage 4): a Big pets board upstairs at Ms. Paws; monkey, seal and bear locked by Pet care 40, then pet yard level 3, then their home, then the animal license (bear 3, others 1); the snake by its glass tank, then license 1; Ms. Paws says the first missing thing in one line; never the word exotic; buttons 44 px", lambda: p18(run, new_wb, FIX))]
    only = [x for x in os.environ.get('PFU_ONLY', '').split(',') if x]
    for cid, name, fn in tests:
        if only and cid not in only: continue
        t0 = time.time(); ok, det = await guarded(fn)
        d['lines'].append(L(cid, name, ok, f'{det} ({round(time.time() - t0)} s)'))
        print('   ', 'PASS' if ok else 'FAIL', '|', cid, '|', str(det)[:300], flush=True)
    return d
