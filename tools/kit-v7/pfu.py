"""Cozy Town check, stage 'pfu' (added to kit v7 on 31 Oct 2026 for the Pets and Farm Update; built into the zip by tools/kit-v7/make_v7.py).
Lines P1.. for the update's stages. Every line starts as FAIL and passes only on proof measured in a test copy. Nothing here is ever made weaker:
a later stage adds lines (or, with the owner's OK, rewrites one and lists it old -> new in its report).
Stage 1 (31 Oct): P1 saves (save version 2, round trip), P2 night skip, P3 morning bus home, P4 hats sit on the hair.
Stage 2 (1 Nov): P5 one need and food groups, P6 sickness (switched off until the vet clinic), P7 vet booking, P8 care helpers (bowl, naps,
healthy week), P9 friends see your pets for real and can pet them, P10 the moves pack on every pet, P11 following pets are not left behind."""
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

# ================= stage 2 (1 Nov 2026): the pet brain =================
PETS_SAVE = 'save-prenight3-pets.json'   # 4 pets: 3 follow you, a hamster waits at home
NOON = """()=>{__goto('city');const c=clockNow();let d=c.day;while(wdIdx(d)!==1)d++;__setClock(d,12);__run(4);closePanel();
  for(const p of PET_ACTORS){p.d.happy=60;p.d.sick=0;p.d.sad=0;}PBR.sick=false;S.vet.bk=null;return {day:S.day,wd:wdName(),pets:PET_ACTORS.length,fol:PET_ACTORS.filter(p=>!p.d.stay).length};}"""
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
P6_JS = r"""()=>{const o={},bad=[];const e=PET_ACTORS.find(p=>!p.d.stay),d=e.d;o.off=PBR.sick;if(PBR.sick!==false)bad.push('sickness is switched on before the vet clinic');
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
  PBR.sick=false;o.bad=bad;return o;}"""
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
    det = (f"switched off: {r['off']} (2 hours at 0 hearts: sick {r['offSick']}); switched on (as the vet clinic will): warning sneeze from minute {r['warnAt']}, sick at minute {r['sickAt']}, "
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
P10_JS = r"""()=>{const bad=[],bb=new THREE.Box3();let n=0,worst=0;for(const k of Object.keys(PET_TYPES)){const m=makePet(k,PET_TYPES[k].cols[0]);addOutfit(m,{outfit:{head:'tophat',back:'cape'}});scene.add(m.root);
    for(const nm of COZY_MOVES.list){let lo=9,hi=-9;for(let t=0;t<4.5;t+=.25){const r=COZY_MOVES.play(m,nm,t,{kind:k,dist:t*.8,mood:nm==='pet.walk'&&t>2?'sad':undefined});n++;m.root.updateMatrixWorld(true);bb.setFromObject(m.root);if(!r.lift){lo=Math.min(lo,bb.min.y);hi=Math.max(hi,bb.min.y);}}
      if(m.__mv.warned){bad.push(k+' '+nm+': error');m.__mv.warned=0;}worst=Math.min(worst,lo);if(lo<-.07||hi>.012)bad.push(k+' '+nm+': lowest point '+lo.toFixed(3)+'..'+hi.toFixed(3)+' m');}scene.remove(m.root);}
  const need=['pet.idle','pet.walk','pet.sad','pet.unhappyBowl','pet.unhappyPlay','pet.unhappyNap','pet.unhappyNudge','pet.veryHappy','pet.happyDance','pet.sickWalk','pet.sickLie','pet.sneeze','pet.warnSneeze','pet.nap','pet.takeFood'];
  for(const x of need)if(!COZY_MOVES.list.includes(x))bad.push('missing move '+x);
  return {kinds:Object.keys(PET_TYPES).length,poses:n,worst:+worst.toFixed(3),bad};}"""
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
    det = (f"{r['poses']} poses: every move x {r['kinds']} pet kinds (top hat and cape on), no move errors; lowest point at worst {r['worst']} m (allowed -0.07: a head dipping to sniff); "
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

# ---------------- the stage ----------------
async def s_pfu(run, d, live_w, new_wb, FIX):
    tests = [('P1', 'Saves (pets and farm update): every save of the kit (from older versions, today\'s main and the update\'s stages) and a fresh one from the live version loads as save version 2 with every new field at its default; saved again and loaded, it is exactly the same', lambda: p1(run, live_w, new_wb, FIX)),
             ('P2', 'Night skip: at night, when every player online is in their own bed (alone: your own bed), the clock jumps to 7:00 for everyone together and the skip is saved online once; a friend awake, asleep outside their own bed (tent) or an older version online keeps the night going', lambda: p2(run, live_w, new_wb, FIX)),
             ('P3', 'Morning bus home: every day the bus waits at the beach 8:00-9:30 and goes to town (bus days unchanged, still 3 a week); free with under 20 coins, else 20; the pill and the timetable card show it', lambda: p3(run, new_wb, FIX)),
             ('P4', 'Hats sit on the hair: on every hairdo no hair sticks up through any hat, the party hat or a costume\'s hood', lambda: p4(run, new_wb, FIX)),
             ('P5', 'One need, happiness (stage 2): about an hour of play from full to sad, paused while away, half speed at home with a full bowl and a toy; moods by hearts (5 very very happy, 3-4 happy, 2 normal, 0-1 sad) with body language; 3 food groups (meat, fish, fruit & veggies; same items): every pet eats every food, its own +40 and a happy dance, others and treats +30; the no-food line; the shop says who loves each food', lambda: p5(run, new_wb, FIX)),
             ('P6', 'Sickness (stage 2, switched off until the vet clinic): off, no pet ever gets sick; on, about an hour of play at 0-1 hearts makes a pet sick, with warning sneezes the last 15 minutes that stop when it cheers up; only the vet cures it (normal mood, 50 coins a pet, free with too few); no Pet Show and no Ms. Paws while sick', lambda: p6(run, new_wb, FIX)),
             ('P7', 'Vet booking (stage 2): Book the vet in the Pets app (44 px); all well, or the sick pets and the next 8 two-hour times between 7:00 and 23:00; booked card with time, pets and Cancel; a reminder one game hour before; late = booking gone, no coins lost; one list for the room (a friend sees the time taken)', lambda: p7(run, new_wb, FIX)),
             ('P8', 'Care helpers (stage 2): one food fills the home bowl for one game day of play; the pets with you nap when you sleep (no loss at night) and wake happier; a healthy week (care on 3+ days Mon-Fri, no pet sick) puts the green ribbon on every pet for the weekend and counts for the animal license', lambda: p8(run, new_wb, FIX)),
             ('P9', 'Friends see your pets for real (stage 2): hearts, sick look and the same move at the same time, as a short code at the end of each pet row; friends pet and play with your pets (no feeding), your pet gets happier and they get pet XP; with an older version online the codes are left out and it still shows the pets', lambda: p9(run, live_w, new_wb, FIX)),
             ('P10', 'Moves pack (stage 2): every pet move on every pet kind without an error, feet on the floor; the moves of 2 players x 3 following pets take under 4 ms a frame', lambda: p10(run, new_wb, FIX)),
             ('P11', 'Pets are not left behind (stage 2 play test): long walks with 3 following pets on Friends Lane round the yard fences, through town corners and along the beach; no pet more than 9 m away for over 3 s, all with you after each walk', lambda: p11(run, new_wb, FIX))]
    only = [x for x in os.environ.get('PFU_ONLY', '').split(',') if x]
    for cid, name, fn in tests:
        if only and cid not in only: continue
        t0 = time.time(); ok, det = await guarded(fn)
        d['lines'].append(L(cid, name, ok, f'{det} ({round(time.time() - t0)} s)'))
        print('   ', 'PASS' if ok else 'FAIL', '|', cid, '|', str(det)[:300], flush=True)
    return d
