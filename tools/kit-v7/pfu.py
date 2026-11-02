"""Cozy Town check, stage 'pfu' (added to kit v7 on 31 Oct 2026 for the Pets and Farm Update; built into the zip by tools/kit-v7/make_v7.py).
Lines P1.. for the update's stages. Every line starts as FAIL and passes only on proof measured in a test copy. Nothing here is ever made weaker:
a later stage adds lines (or, with the owner's OK, rewrites one and lists it old -> new in its report).
Stage 1 (31 Oct): P1 saves (save version 2, round trip), P2 night skip, P3 morning bus home, P4 hats sit on the hair.
Stage 2 (1 Nov): P5 one need and food groups, P6 sickness (switched off until the vet clinic), P7 vet booking, P8 care helpers (bowl, naps,
healthy week), P9 friends see your pets for real and can pet them, P10 the moves pack on every pet, P11 following pets are not left behind.
Stage 4 (1 Nov): P17 the vet station and the visit, P18 big-needs pets locked; P6 rewritten (old: sickness switched off until the vet clinic; new: switched on with the vet station in, the switch still proven both ways).
Stage 3 (1 Nov): P12 Friends Lane's wider border, P13 yard levels by skill at the yard sign, P14 only owned things show, P15 training gear and pets playing
on it, P16 friends see your yard. Rewritten: P10 (old: every move's lowest point within -0.07..0.012 m; new: the same for every move on the floor (a yard-gear move: on the pet kinds that play it, e.g. cat.wand on cats), and a
move in water or the air (r.noGround: capy.tub, owl.fly) is measured by its highest point instead, which must stay above 0.05 m).
Stage 6 (1 Nov): P31 the farm on the map, P32 riding, P33 chores and the Market, P34 feeding and petting, P35 friends see you ride.
Full check (1 Nov): P36 a save with big-needs pets and the glass tank is never written over by the live version, and comes back whole.
Picture pass 1 (2 Nov): P37 big pets reach their homes, P38 never inside a horse or cow, P39 waiting outside apart, capes on the back, show words end with the show.
Picture pass 3 (2 Nov): P41 cows and sheep their real size, apart at the trough, no score on the table paddles, no town pet with your pet's name, Ieva's line not over your ride, the jump view.
Picture pass 2 (2 Nov): P40 big pets off the vet platform away from you, capes along the back (capybara, seal, snake slithering), the show's sign and late big words. P34's trough picture reframed (shot only).
Stage 5 (1 Nov): P25 not slower than live (the owner's ask: P19 stays for the real iPad), P26 the Pet Show area, P27 tricks, P28 the Pet Show alone (town results
from the one clock, the ribbon), P29 the Pet Show with friends, P30 the animal license. Rewritten (old -> new): P18 Ms. Paws' line for the bear's license
(old: 'You need an animal license, level 3. Win at the Pet Show!', the stage-4 stand-in; new: the approved rules-animal-license line 8, 'A bear needs an animal
license level 3. Finish top 3 at 3 Pet Shows, once in 1st place!'; the check is otherwise the same); P10 (old: every move in the pack on every pet
kind; new: the same for every pet move, and a person's move (person.giveCard / person.takeCard, the license hand-over, stage 5) on a person, never on a pet); P17 (old: every wall outside
the clinic as in the stage-3 build; new: the same without the park's west part, where the approved Pet Show area changes walls: 640 there before and after).
Stage 4b (1 Nov): P19 speed guard (with the owner's new size limit, 3.0 MB), P20 big-needs pets, P21 their homes and the snake's tank, P22 waiting outside and the
big-pet platform, P23 the new 3-floor Pet Shop, P24 today's pets redrawn. Rewritten (old -> new): P10 (old: the lowest point from each piece's bounding box, every
move on every kind except gear moves; new: the lowest point on the real shape (a turned round piece's box reaches below it: the bear sitting measured -0.18 m
while touching the floor), and a big-needs pet's own, toy and home moves only on that kind, like the gear moves); P15 (old: 10 gear pieces; new: 15, the 5
big-pet pieces with their prices, each played to the end like the others); P18 (old: the Big pets board 'upstairs' = 40 m along, the old shop's
floor 2; new: in the one-room shop, a board that can be used only on the top floor)."""
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
  /* (stage 4b: a big-needs pet's own moves, toy and home moves likewise: named after the kind, or in TOY_MV / HOME_NAP) */
  for(const nm of COZY_MOVES.list){const k=nm.split('.')[0];if(PET_TYPES[k]&&PET_TYPES[k].big)(USE[nm]=USE[nm]||[]).push(k);}
  if(typeof TOY_MV!=='undefined')for(const k in TOY_MV)(USE[TOY_MV[k]]=USE[TOY_MV[k]]||[]).push(k);
  const _v=new THREE.Vector3(),lowY=r=>{let y=9;r.updateMatrixWorld(true);r.traverse(o=>{if(!o.isMesh||!o.visible||o.userData.noGround)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){_v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld);if(_v.y<y)y=_v.y;}});return y;};   /* (stage 4b: the real lowest point, not the corners of turned pieces' boxes) */
  for(const k of Object.keys(PET_TYPES)){const m=makePet(k,PET_TYPES[k].cols[0]);addOutfit(m,{outfit:{head:'tophat',back:'cape'}});scene.add(m.root);
    for(const nm of COZY_MOVES.list){if(USE[nm]&&!USE[nm].includes(k))continue;if(/^person\./.test(nm))continue;   /* (stage 5: a person's move is played on a person below, not on pets) */if(/^(coach|farm|cow|sheep|pig|chicken|horse|farmdog)\./.test(nm))continue;   /* (stage 6: the farm animals' and the coaches' moves are played on their own models in P34, not on pets) */let lo=9,hi=-9,top=9;for(let t=0;t<4.5;t+=.25){const r=COZY_MOVES.play(m,nm,t,{kind:k,dist:t*.8,mood:nm==='pet.walk'&&t>2?'sad':undefined});n++;m.root.updateMatrixWorld(true);bb.setFromObject(m.root);if(r.noGround){top=Math.min(top,bb.max.y);wet[nm]=1;}else if(!r.lift){const ly=lowY(m.root);lo=Math.min(lo,ly);hi=Math.max(hi,ly);}}
      if(m.__mv.warned){bad.push(k+' '+nm+': error');m.__mv.warned=0;}worst=Math.min(worst,lo);if(lo<-.07||hi>.012)bad.push(k+' '+nm+': lowest point '+lo.toFixed(3)+'..'+hi.toFixed(3)+' m');if(top<.05)bad.push(k+' '+nm+': sinks out of view (highest point '+top.toFixed(3)+' m)');}scene.remove(m.root);}
  {const pm=makePerson(PS_JUDGES[1].look);scene.add(pm.root);for(const nm of COZY_MOVES.list.filter(x=>/^person\./.test(x))){for(let t=0;t<4.5;t+=.25){COZY_MOVES.play(pm,nm,t,{target:[.1,1.15,.45],showTo:[0,1.5,3]});n++;}if(pm.__mv&&pm.__mv.warned){bad.push('person '+nm+': error');pm.__mv.warned=0;}}scene.remove(pm.root);}   /* (stage 5: the license hand-over moves, on a person) */
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
  /* (stage 6 rewrite: the farm plan (pfu-placements townMoved) moves 2 forest trees off its new road to just behind the north hedge (z -41.5 and -37.9, outside every backyard); old: no map tree at |z| < 42 west of x -78; new: none but those 2 planned spots, each still behind the hedge, |z| > 37.5) */
  const planned=([x,z])=>typeof FARMD==='object'&&FARMD.mv.some(q=>Math.abs(q[2]-x)<.05&&Math.abs(q[3]-z)<.05)&&Math.abs(z)>37.5;o.planned=mapTrees().filter(t=>t[0]<-78&&Math.abs(t[1])<42&&planned(t)).length;
  o.mapTrees=mapTrees().filter(t=>t[0]<-78&&Math.abs(t[1])<42&&t[2]>0&&!planned(t)).length;if(o.mapTrees)bad.push(o.mapTrees+' map trees in the lane valley');
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
    return not bad, f"lane end walls at z {o['laneC']}; forest kept off |z| < 42 ({o['free']}), map trees in the valley {o['mapTrees']} (and {o.get('planned', 0)} moved there by the farm plan, behind the hedge); {o['lots']} lots: the strip behind each is free to z -36.4 and the hedge stands at 37.5" + (f' | PROBLEMS: {bad}' if bad else '')

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
  if(o.n!==15||!/🔒 Pet yard level 2/.test(o.dog||''))bad.push('gear in the shop: '+o.n+', dog '+o.dog);
  const W={dog:300,dog2:300,cat:200,cat2:200,bunny:150,bunny2:150,hamster:150,duck:200,owl:200,capy:250,monkey:250,monkey2:250,seal:150,bear:250,snake:150};   /* (stage 4b: + the big-needs pets' 5 pieces) */for(const k in W)if(GEAR[k].p!==W[k])bad.push('price '+k+' '+GEAR[k].p);
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
             'hamster': ['hamster.wheel'], 'duck': ['duck.splash', 'duck.paddle'], 'owl': ['owl.fly', 'owl.perch'], 'capy': ['capy.hopIn', 'capy.tub'],
             # stage 4b: the big-needs pets' gear (P15 rewritten: 10 pieces -> 15, each played to the end like the others)
             'monkey': ['monkey.climb', 'monkey.bars'], 'monkey2': ['monkey.climb', 'monkey.bars'], 'seal': ['seal.ball'], 'bear': ['bear.logPush', 'bear.sitUp'], 'snake': ['snake.basket']}
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
  const F=typeof FARMD==='object'?FARMD:{del:[],mv:[]};
  return {groups:(C.treeGroups||[]).map(g=>g.map(r)),map:mapTrees().filter(([x,z])=>out(x,z)).map(t=>t.map(r)),farm:F.del.concat(F.mv.map(q=>[q[0],q[1]]),F.mv.map(q=>[q[2],q[3]])).map(q=>q.map(r)),farmWalls:C.cols.filter(c=>c.fw&&out((c.x1+c.x2)/2,(c.z1+c.z2)/2)).length,cols:C.cols.filter(c=>c.cr!==undefined?out(c.cx,c.cz):out((c.x1+c.x2)/2,(c.z1+c.z2)/2)).length,
  park:C.cols.filter(c=>{const x=c.cr!==undefined?c.cx:(c.x1+c.x2)/2,z=c.cr!==undefined?c.cz:(c.z1+c.z2)/2;return x>-41&&x<-29&&z>8&&z<41;}).length};}"""
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
    # (P17 rewritten in stage 5: the approved Pet Show area (map-petshow-park) changes the walls in the park's west part (x -41..-29, z 8..41): stage, podium,
    # judges, rope posts, the moved tree, slide and truck. Old: every wall outside the clinic counted; new: the same, without that part of the park (17 walls
    # there in the stage-3/4b build, measured 1 Nov: 'park' in the reference); trees, bushes and groups are compared exactly as before)
    # (P17 rewritten in stage 6: the approved farm plan (map-forest-clear, pfu-placements townDeleted/townMoved) takes 64 forest trees out and moves 3, and the farm
    # adds its walls (the town's north edge, the land behind the lane's hedge, the farm's east side, west of the lane end: marked fw). Old: every map tree and every wall
    # outside the clinic as in the stage-3 build; new: the same, without the map trees within 0.6 m of a planned removal or move (P31 checks those exactly) and without the farm's
    # own walls. Groups, every other map tree (position and size) and every other wall are compared exactly as before)
    near = lambda t: any(abs(t[0] - q[0]) < .6 and abs(t[1] - q[1]) < .6 for q in trees_new.get('farm', []))
    map_new = [t for t in trees_new['map'] if not near(t)]; map_live = [t for t in trees_live['map'] if not near(t)]
    same = trees_new['groups'] == trees_live['groups'] and map_new == map_live and trees_new['cols'] - trees_new['park'] - trees_new.get('farmWalls', 0) == trees_live['cols'] - trees_live['park']
    if not same: bad.append(f"the town's trees and bushes outside the clinic moved: groups {trees_live['groups'][:2]} -> {trees_new['groups'][:2]}, map trees {len(trees_live['map'])} -> {len(trees_new['map'])}, walls outside the Pet Show area {trees_live['cols'] - trees_live['park']} -> {trees_new['cols'] - trees_new['park']}")
    if errs: bad.append(f'browser errors {errs[:2]}')
    o, v = a.get('o', {}), b['o']
    det = (f"door {o.get('door')}, walk-in spots inside the walls {o.get('walkIn')}, trees/bushes left there {o.get('stray')}; staff {o.get('staff')}; people's feet {o.get('feet')}; "
           f"in at {v['at']}; pet on the table {v['table']}, vet move {v['vetMv']}, nurse move {v['leo']}; after (visit on, sick, sick, coins, hearts*20, on table) {v['after']}; lines: {v['lines'][:400]!r}; "
           f"30 coins {v['free']}; too early {v['early']}; friend's time {v['taken']}; night {v['night']}; well {v['well']!r}; walked away {v['away']}; "
           f"Penny {v['hello']!r} / {v['d1']!r} / {v['d2']!r} / {v['d3']!r} / {v['d4']!r} / time taken -> {v['d5']}; stairs -> floor {v['climb']}; "
           f"other trees and bushes as in the stage-3 build: {same} ({len(trees_new['map'])} map trees, {len(trees_new['groups'])} groups)")
    return not bad, det + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P18 big-needs pets: locked at Ms. Paws, the first missing thing named ----------------
P18_JS = r"""()=>{const o={},bad=[],L=LOC.pets;__goto('pets');const it=L.inter.find(t=>t.label==='Big pets');   /* (P18 rewritten in stage 4b: old: upstairs = the old shop's floor 2, 40 m along; new: in the new one-room shop, the board can be used only on the top floor) */
  const up=!!it&&(L.psh?!!it.when&&(()=>{const c=P.cy;P.cy=PSH.F[2];const a=it.when();P.cy=0;const b=it.when();P.cy=c;return a&&!b;})():Math.abs(it.z-L.oz-UPZ)<=2);if(!up)bad.push('no Big pets board upstairs in the Pet Shop');
  const keep=[sk('pets').lv,S.yard.pet,S.lic.lv,window.bigHome],K=['monkey','seal','bear','snake'],texts=[];
  const rows=()=>{openBig();const B=[...document.querySelectorAll('#card [data-a^="bigp:"]')];o.small=(o.small||0)+B.filter(b=>b.getBoundingClientRect().height<44).length;texts.push($('card').innerText);const r=B.map(b=>b.innerText.replace(/\s+/g,' ').trim());closePanel();return r;};
  const say=k=>{let m='';const t0=window.toast;window.toast=x=>{m=x;};bigPaws(k);window.toast=t0;texts.push(m);return m.replace(/^🐾 Ms\. Paws: “|”$/g,'');};
  const steps=[['start',()=>{sk('pets').lv=1;S.yard.pet=1;S.lic.lv=0;},['🐒 🔒 Pet care 40','🦭 🔒 Pet care 40','🐻 🔒 Pet care 40','🐍 🔒 Glass tank'],{monkey:'Monkeys need a lot of care. Reach Pet care 40 first!',snake:'Where would it live? Get a glass tank in your house first!'}],
    ['Pet care 40',()=>{sk('pets').lv=40;},['🐒 🔒 Pet yard level 3','🦭 🔒 Pet yard level 3','🐻 🔒 Pet yard level 3','🐍 🔒 Glass tank'],{seal:'A seal needs lots of space. Grow your pet yard to level 3!'}],
    ['pet yard 3',()=>{S.yard.pet=3;},['🐒 🔒 Climbing tree','🦭 🔒 Pond','🐻 🔒 Cave den','🐍 🔒 Glass tank'],{bear:'Where would it live? Get a cave den first!'}],
    ['homes',()=>{window.bigHome=()=>true;},['🐒 🔒 Animal license 1','🦭 🔒 Animal license 1','🐻 🔒 Animal license 3','🐍 🔒 Animal license 1'],{bear:'A bear needs an animal license level 3. Finish top 3 at 3 Pet Shows, once in 1st place!'}],
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

# ================= stage 4b (1 Nov 2026): the big-needs pets, their homes and gear, waiting outside, the big-pet table, the new 3-floor Pet Shop,
# today's pets redrawn, and the speed guard that goes with the new size limit (owner's OK 1 Nov: the joined game up to 3.0 MB) =================

# ---------------- P19 speed guard: 30+ fps on an iPad-sized view with 2 players online, the first load measured ----------------
FPS_JS = r"""(ms)=>new Promise(res=>{const L=window.__loop,R=renderer.render;let k=0;renderer.render=function(a,b){k++;return R.call(this,a,b);};L.manual=false;if(L.cb){const cb=L.cb;L.cb=null;requestAnimationFrame(cb);}const t0=performance.now();
  setTimeout(()=>{L.manual=true;renderer.render=R;res({fps:+(k*1000/(performance.now()-t0)).toFixed(1),calls:renderer.info.render.calls,tris:renderer.info.render.triangles});},ms);})"""   # the game's own loop on the browser's real frames for ms, counting the frames drawn
LOAD_JS = r"""()=>{const n=performance.getEntriesByType('navigation')[0]||{};return {dom:Math.round(n.domContentLoadedEventEnd||0),load:Math.round(n.loadEventEnd||0),ready:Math.round(window.__p19ready||0)}}"""
async def p19(run, live_w, new_wb, FIX):
    probs = []; det = []; A = B = None
    try:
        out = {}
        for tag, wb in (('live', live_w), ('new', new_wb)):
            t0 = time.time(); g = await run.open(wb, 'web', 'ipad-landscape', 'light', 'p19-load-' + tag); await g.manual(); out[tag] = (round(time.time() - t0, 2), await g.ev(LOAD_JS)); await run.close(g)
        det.append(f"first load on an iPad-sized view (test copy): the page loaded at live {out['live'][1]['load']} ms / new {out['new'][1]['load']} ms after it was opened (the test's own wait for the title screen: live {out['live'][0]} s, new {out['new'][0]} s, it varies 6-13 s run to run)")
        if not out['new'][1]['load']: probs.append('the first load was not measured')
        res = {}
        for tag, wb in (('live', live_w), ('new', new_wb)):
            sv = fx(FIX, PETS_SAVE) or FIX[0][1]
            A = await begin(run, wb, 'ipad-landscape', 'p19-A-' + tag, dict(sv, name='ZZTEST-SPA')); B = await begin(run, wb, 'pc-1366', 'p19-B-' + tag, dict(sv, name='ZZTEST-SPB'))
            for g in (A, B): await g.ev("()=>{__goto('city');__setClock(null,12);P.x=18;P.z=4;P.yaw=0;P.pitch=0;bringFollowers(true);}")
            for _ in range(8): await A.step(4); await B.step(4); await asyncio.sleep(.3)
            seen = await A.ev("()=>[...MP.peers.values()].length")
            f = await A.ev(FPS_JS, 6000); res[tag] = (f, seen)
            if tag == 'live': await run.close(A); await run.close(B); A = B = None
        f, seen = res['new']
        det.append(f"2 players in town in front of the Pet Shop (iPad view, the other on a PC; the other online: {seen > 0}), the game's own loop for 6 s: new {f['fps']} frames a second ({f['calls']} draws, {f['tris']} triangles), live {res['live'][0]['fps']} ({res['live'][0]['calls']} draws) in the same test browser (software drawing, no GPU)")
        if seen < 1: probs.append('the second player was not online with the first')
        if f['fps'] < 30: probs.append(f"only {f['fps']} fps in this test browser (want 30+; live: {res['live'][0]['fps']}): measure on a real iPad or a machine with a GPU")
        errs = A.errors[:] + B.errors[:]
        if errs: probs.append(f'browser errors {errs[:2]}')
    finally:
        if A: await run.close(A)
        if B: await run.close(B)
    det.append('NOT VERIFIED on a real iPad (the test browser draws without a GPU)')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- P25 relative speed (stage 5, the owner's ask 1 Nov): the new build is not slower than the live game in the same test browser ----------------
# P19 (30+ fps) needs a real iPad (no GPU here), so this line lets the cloud kit still catch slowdowns: same view, same players, same spot, measured in turns
# live, new, new, live(, live, new for fps: the median of 3, so one slow minute of the machine does not decide); passes when the new build's fps is at least 90% of live's and its mean first
# load at most 115% of live's (the allowance is the test browser's own run-to-run spread, printed with the numbers).
# for information: the CPU side of a whole frame (the game's update and handing its drawing to the browser), the median of 80 frames
FRAME_JS = r"""()=>{const q=[];for(let i=0;i<90;i++){const t=performance.now();window.__t=Math.max(window.__t||0,performance.now())+16;frame(window.__t);const d=performance.now()-t;if(i>=10)q.push(d);}q.sort((a,b)=>a-b);return +q[40].toFixed(2);}"""
async def p25(run, live_w, new_wb, FIX):
    probs = []; det = []; A = B = None; fps = {'live': [], 'new': []}; load = {'live': [], 'new': []}; seen = []; ft = {'live': [], 'new': []}
    try:
        for tag in ('live', 'new', 'new', 'live'):
            wb = live_w if tag == 'live' else new_wb
            g = await run.open(wb, 'web', 'ipad-landscape', 'light', f'p25-load-{tag}-{len(load[tag])}'); await g.manual(); load[tag].append((await g.ev(LOAD_JS))['load']); await run.close(g)
        for tag in ('live', 'new', 'new', 'live', 'live', 'new'):
            wb = live_w if tag == 'live' else new_wb; sv = fx(FIX, PETS_SAVE) or FIX[0][1]; i = len(fps[tag])
            A = await begin(run, wb, 'ipad-landscape', f'p25-A-{tag}-{i}', dict(sv, name='ZZTEST-SPA')); B = await begin(run, wb, 'pc-1366', f'p25-B-{tag}-{i}', dict(sv, name='ZZTEST-SPB'))
            for g in (A, B): await g.ev("()=>{__goto('city');__setClock(null,12);P.x=18;P.z=4;P.yaw=0;P.pitch=0;bringFollowers(true);}")
            for _ in range(8): await A.step(4); await B.step(4); await asyncio.sleep(.3)
            seen.append(await A.ev("()=>[...MP.peers.values()].length"))
            fps[tag].append((await A.ev(FPS_JS, 6000))['fps']); ft[tag].append(await A.ev(FRAME_JS))
            errs = A.errors[:] + B.errors[:]
            if errs and tag == 'new': probs.append(f'browser errors {errs[:2]}')
            await run.close(A); await run.close(B); A = B = None
        mean = lambda v: sorted(v)[len(v) // 2] if len(v) % 2 else sum(v) / len(v)   # (fps: the median of 3 turns each; first load: the mean of 2)
        fl, fn, ll, ln = mean(fps['live']), mean(fps['new']), mean(load['live']), mean(load['new']); tl, tn = mean(ft['live']), mean(ft['new'])
        det.append(f"2 players in town in front of the Pet Shop (iPad view + a PC), the game's own loop 6 s each, turns live/new/new/live/live/new: live {fps['live']} fps (median {fl:.2f}), new {fps['new']} (median {fn:.2f}) = {100 * fn / fl if fl else 0:.0f}% of live (want 90%+); for information, the CPU side of one frame (the update and handing the drawing over, median of 80 frames each turn): live {ft['live']} ms (median {tl}), new {ft['new']} ms (median {tn}) = {100 * tn / tl if tl else 0:.0f}% of live's")
        det.append(f"first load (page loaded after it was opened, iPad view), turns live/new/new/live: live {load['live']} ms (mean {ll:.0f}), new {load['new']} ms (mean {ln:.0f}) = {100 * ln / ll if ll else 0:.0f}% of live (want 115% or less)")
        if min(seen) < 1: probs.append('the second player was not online with the first')
        if not fl or not fn: probs.append('fps not measured')
        elif fn < 0.9 * fl: probs.append(f'the new build draws slower than live: {fn:.2f} vs {fl:.2f} frames a second (medians)')
        if not ll or not ln: probs.append('first load not measured')
        elif ln > 1.15 * ll: probs.append(f'the new build loads slower than live: {ln:.0f} vs {ll:.0f} ms')
    finally:
        if A: await run.close(A)
        if B: await run.close(B)
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- P20 big-needs pets: models, rows, adoption only when ready, 400 coins, toys ----------------
P20_JS = r"""()=>{__goto('pets');const bad=[],o={seen:[]};const K={monkey:['cat',8],seal:['dog',4],bear:['dog',6],snake:['hamster',4]};
  for(const k in K){const T=PET_TYPES[k];if(!T||T.base!==K[k][0]||T.cols.length!==K[k][1]||!T.big||typeof SFX[T.snd]!=='function'||!PET_TOY[k]||!PET_GROUP[k]){bad.push('row '+k);continue;}
    let nm=[];for(const c of T.cols){const m=makePet(k,c);let n=0;m.root.traverse(q=>{if(q.isMesh)n++;});nm.push(n);if(n<30||!m.head||!m.b||(k==='snake'?!(m.segs&&m.segs.length>20&&m.tongue):!(m.legs.length>=2))||(k==='seal'&&!(m.rear&&m.rear.length===2)))bad.push(k+' model '+c+' '+n+' pieces');}
    o.seen.push(k+': '+T.cols.length+' looks ('+nm.join('/')+' pieces), saved as '+T.base);}
  S.coins=5000;S.lic.lv=0;S.yard={pet:1,garden:1};sk('pets').lv=1;const n0=S.pets.length;
  openAdopt('bear',PET_TYPES.bear.cols[0]);ACT.adopt();closePanel();if(S.pets.length!==n0)bad.push('adopted a locked bear');
  sk('pets').lv=40;S.yard={pet:3,garden:1,home:['tree','pond','den']};yardLv();S.lic.lv=3;S.home.store.push({u:'zztank',t:'snaketank',c:'#7a2bff',x:0,z:0,r:0});
  for(const k in K){const l=bigLock(k);if(l)bad.push(k+' still locked: '+l[0]);const c0=S.coins;openAdopt(k,PET_TYPES[k].cols[1]);ACT.adopt();const d=S.pets[S.pets.length-1];
    if(c0-S.coins!==400||d.kind!==k||d.type!==K[k][0])bad.push('adopt '+k+': paid '+(c0-S.coins)+', saved '+d.type+'/'+d.kind);}
  o.seen.push('adopted when ready for 400 each (locked: refused)');
  const toys=[];for(const k in K){const e=PET_ACTORS.find(p=>petKind(p.d)===k);S.bag[PET_TOY[k]]=1;e.sm=null;openPet(e);ACT.pplay();toys.push(k+' '+e.sm);if(e.sm!==TOY_MV[k])bad.push(k+' plays '+e.sm);closePanel();}
  o.seen.push('favourite toys: '+toys.join(', '));
  const w=[];for(const k in K){const e=PET_ACTORS.find(p=>petKind(p.d)===k);for(let t=0;t<5;t+=.5)COZY_MOVES.play(e.m,TOY_MV[k],t,{kind:k});if(e.m.__mv&&e.m.__mv.warned)w.push(k);}if(w.length)bad.push('toy moves with errors: '+w);
  o.bad=bad;return o;}"""
async def p20(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p20', FIX=FIX, name='ZZTEST-BIGP')
    try: r = await g.ev(P20_JS); errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    return not bad, '; '.join(r['seen']) + '; NOT VERIFIED: how each looks walking and playing (only a line-up picture looked at)' + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P21 homes: tree, pond, den in the big-pets area; the snake's glass tank; friends see them ----------------
P21_JS = r"""()=>{__goto('city');const bad=[],o={};S.coins=9000;sk('pets').lv=40;S.yard={pet:2,garden:1};yardLv();openShop('pets');ACT.bhome('den');o.l2=[(S.yard.home||[]).length,S.coins];closePanel();if(o.l2[0])bad.push('a home sold at pet yard 2');
  S.yard.pet=3;yardLv();const cnt=()=>{let v=0;YARD.lvg.traverse(m=>{if(m.isMesh)v+=m.geometry.attributes.position.count;});return v;},v0=cnt(),c0=LOC.city.cols.length;
  const paid={};for(const id of BHOME_IDS){const c=S.coins;openShop('pets');ACT.bhome(id);paid[id]=c-S.coins;closePanel();}o.paid=paid;if(paid.tree!==400||paid.pond!==700||paid.den!==700)bad.push('prices '+JSON.stringify(paid));
  const v1=cnt(),c1=LOC.city.cols.length;o.drawn=v1>v0+5000;o.solid=c1-c0;if(!o.drawn||o.solid<3)bad.push('homes not drawn or not solid: '+[v0,v1,c0,c1]);
  for(const id of BHOME_IDS){const H=BHOME[id],[x,z]=lotPt(LANE.mine,H.x,H.z);if(Math.hypot(...collideXZ(x,z,.3,LOC.city).map((q,i)=>q-[x,z][i]))<.2)bad.push(id+': you can walk into its middle');}
  const st={};laneStamp(st);o.yd=st.yd;if(!/^13TPD$/.test(st.yd||''))bad.push('presence yd '+st.yd);
  const lp=LOC.city.lane.find(l=>l.j!==LANE.mine),fc=()=>{let v=0;lp.g.traverse(m=>{if(m.isMesh&&m.geometry&&m.geometry.attributes.position)v+=m.geometry.attributes.position.count;});return v;};
  const base={k:'zz',nm:'Zed',big:0,fl:1,col:'',gd:''};laneHouse(lp,Object.assign({},base,{yd:'13'}));const f0=fc();laneHouse(lp,Object.assign({},base,{yd:'13TPD'}));const f1=fc();laneHouse(lp,Object.assign({},base,{yd:'13Q'}));const f2=fc();
  o.friend=[f0,f1,f2];if(!(f1>f0+5000)||f2!==fc())bad.push('a friend\'s homes: '+o.friend);laneHouse(lp,null);
  /* the snake's tank: furniture at Ms. Paws (400), placed in your house; light on/off and 8 colours, saved as the piece's colour */
  const c2=S.coins;S.home.store=S.home.store.filter(i=>i.t!=='snaketank');openShop('pets');const b=document.querySelector('#card [data-a="buy:snaketank"]');if(b)b.click();closePanel();o.tank=[c2-S.coins,S.home.store.filter(i=>i.t==='snaketank').length];
  if(o.tank[0]!==400||o.tank[1]!==1)bad.push('tank bought '+o.tank);const it=S.home.store.find(i=>i.t==='snaketank');S.home.store=S.home.store.filter(i=>i!==it);it.x=0;it.z=-3;it.r=0;S.home.items.push(it);rebuildHome();
  let rec=[...HOME_ITEMS.values()].find(r=>r.it===it);if(!rec||!rec.inter||rec.inter.label()!=='Glass tank')bad.push('no Glass tank button');
  rec.inter.act();o.panel=!!document.querySelector('#card [data-a="tank:off"]')&&document.querySelectorAll('#card .sw').length;ACT.tank('off');const off=it.c;ACT.tank('on');const on=it.c;ACT.tank('3');const pink=it.c;closePanel();
  o.light=[o.panel,off,on,pink];if(o.panel!==8||off!=='#5a5f72'||on!=='#7a2bff'||pink!=='#ff7aa8')bad.push('tank light '+o.light);
  /* a snake at home lives in its tank: it sleeps in the hide and goes out over the lip and back */
  S.lic.lv=1;openAdopt('snake',PET_TYPES.snake.cols[0]);ACT.adopt();closePanel();const d=S.pets[S.pets.length-1],e=PET_ACTORS.find(p=>p.d===d);d.stay=true;d.home=1;__goto('home');for(let i=0;i<10;i++)__run(1);
  rec=[...HOME_ITEMS.values()].find(r=>r.it===it);const T=rec.g.position;o.snake=[e.loc,!!e.tk,+Math.hypot(e.x-T.x,e.z-T.z).toFixed(2)];if(e.loc!=='home'||!e.tk||o.snake[2]>.05)bad.push('the snake is not in its tank: '+o.snake);
  const box=new THREE.Box3(),inHide=[];for(const s of[2,30,35,41]){window.__clk=s;snakeTankPose(e.m,e,s);e.m.root.updateMatrixWorld(true);rec.g.updateWorldMatrix(true,false);box.setFromObject(e.m.head);const p=rec.g.worldToLocal(box.getCenter(new THREE.Vector3()));inHide.push([s,+p.x.toFixed(2),+p.z.toFixed(2)]);}
  o.path=inHide;if(!(Math.abs(inHide[0][1]+.6)<.5&&inHide[0][2]<.5))bad.push('asleep: the head is not in the hide '+JSON.stringify(inHide[0]));if(!inHide.some(q=>q[2]>.6))bad.push('the snake never comes out over the lip');
  o.bad=bad;return o;}"""
async def p21(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p21', FIX=FIX, name='ZZTEST-HOMES')
    try: r = await g.ev(P21_JS); errs = g.errors[:]
    finally: await run.close(g)
    o = r; bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    det = (f"at pet yard 2 no home is sold {o['l2']}; at 3: paid {o['paid']}, drawn {o['drawn']}, {o['solid']} new solid parts, presence '{o['yd']}', a friend's lot [no homes, homes, a bad letter] {o['friend']} vertices; "
           f"the glass tank: bought [coins, in My stuff] {o['tank']}, its card [colours, off, on, pink] {o['light']}; a snake at home [where, in the tank, m from it] {o['snake']}, head [s, x, z in the tank] {o['path']}")
    return not bad, det + ' NOT VERIFIED: the snake moving in and out by eye' + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P22 bear and seal wait outside buildings (not at the vet); the big-pet platform ----------------
P22_JS = r"""()=>{__goto('city');const bad=[],o={};S.coins=9000;sk('pets').lv=40;S.yard={pet:3,garden:1,home:['tree','pond','den']};S.lic.lv=3;yardLv();for(const d of S.pets)d.stay=true;
  for(const k of['seal','bear','monkey']){openAdopt(k,PET_TYPES[k].cols[0]);ACT.adopt();closePanel();}const A=PET_ACTORS.filter(e=>!e.d.stay);
  const D=DOORS.market.city;P.x=D[0];P.z=D[1];P.yaw=D[2];bringFollowers(true);__run(20);setLoc('market');bringFollowers();__run(40);
  o.inside=A.map(e=>[petKind(e.d),e.loc,!!e.wo,+Math.hypot(e.x-D[0],e.z-D[1]).toFixed(1)]);
  for(const q of o.inside)if(q[0]==='monkey'?q[1]!=='market':(q[1]!=='city'||!q[2]||q[3]>4))bad.push('in the Market: '+q);
  setLoc('city');P.x=D[0];P.z=D[1];bringFollowers();__run(40);o.back=A.map(e=>[petKind(e.d),e.loc,!!e.wo,+Math.hypot(e.x-P.x,e.z-P.z).toFixed(1)]);for(const q of o.back)if(q[1]!=='city'||q[2]||q[3]>4)bad.push('back outside: '+q);
  setLoc('vet');const L=LOC.vet;P.x=L.ox-1.6;P.z=L.oz+UPZ-1.2;bringFollowers();__run(10);o.vet=A.map(e=>[petKind(e.d),e.loc]);for(const q of o.vet)if(q[1]!=='vet')bad.push('at the vet: '+q);
  const b=A.find(e=>petKind(e.d)==='bear');b.d.sick=1;VX={L:[b],i:0,t:0,said:0};const R=VK('Dr. Rūta'),r0=[R.x,R.z];let up=0,climb=0,near=9;
  for(let i=0;i<260&&VX;i++){__run(1);if(VX&&VX.pm==='pet.climbOn')climb++;if(b.ps&&Math.abs(b.g.position.y-.54)<.01)up++;if(b.ps)near=Math.min(near,Math.hypot(R.x-b.x,R.z-b.z));}
  o.platform=[climb,up,+near.toFixed(2),b.d.sick,+Math.hypot(R.x-r0[0],R.z-r0[1]).toFixed(2)];if(!climb||!up||near>2.2||b.d.sick||o.platform[4]>.01)bad.push('the big-pet platform: '+o.platform);
  o.bad=bad;return o;}"""
async def p22(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p22', FIX=FIX, name='ZZTEST-WAIT')
    try: r = await g.ev(P22_JS); errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    det = (f"in the Market [kind, where, waiting, m from the door]: {r['inside']}; back outside: {r['back']}; at the vet station: {r['vet']}; "
           f"the bear on the big-pet platform [frames climbing on, frames on top at .54 m, Dr. Rūta's closest m, sick after, Dr. Rūta back at her place m]: {r['platform']}")
    return not bad, det + ' NOT VERIFIED: the waiting and the platform by eye' + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P23 the new Pet Shop: 3 open floors, stairs, rails, cozy spots ----------------
P23_JS = r"""()=>{__goto('pets');__setClock(null,12);const bad=[],o={},L=LOC.pets;o.room=[!!L.psh,!L.fls,PSH.F.join('/')];if(!L.psh||L.fls)bad.push('not one 3-floor room');
  const go=(x,z,n)=>{const sx=P.x,sz=P.z;for(let i=1;i<=n;i++){P.x=sx+(L.ox+x-sx)*i/n;P.z=sz+(L.oz+z-sz)*i/n;__run(1);}return [+(P.x-L.ox).toFixed(2),+(P.z-L.oz).toFixed(2),+(P.cy||0).toFixed(2)];};
  const e=PET_ACTORS.find(p=>!p.d.stay);P.x=L.ox;P.z=L.oz+3.7;P.cy=0;bringFollowers(true);__run(5);
  const path=[[-4.6,4.5,40],[-5.95,4.5,20],[-5.95,2.2,40],[-5.95,-.3,40],[-4.2,-.5,30],[-4.0,-2.2,30],[-2.9,-2.25,30],[3.0,-2.3,60],[4.4,-1.2,30],[4.4,4.6,60],[5.95,4.6,20],[5.95,-.3,80],[4.0,-1.0,30]];
  o.up=path.map(q=>go(...q));if(o.up[3][2]!==3.34||o.up[11][2]!==6.54)bad.push('up the stairs: '+JSON.stringify(o.up));o.pet=[+(e.cy||0).toFixed(2),+Math.hypot(e.x-P.x,e.z-P.z).toFixed(1)];
  if(Math.abs((e.cy||0)-6.54)>.05||o.pet[1]>4.5)bad.push('the pet did not follow up: '+o.pet);
  o.hole=go(0,0,30);if(o.hole[2]!==6.54||Math.abs(o.hole[0])<3.2&&o.hole[1]>-2&&o.hole[1]<2.6)bad.push('walked into the open middle: '+o.hole);
  const down=[[5.95,-.3,30],[5.95,4.6,80],[4.4,4.6,20],[3.0,-2.3,60],[-2.9,-2.25,60],[-4.2,-.5,30],[-5.95,-.3,30],[-5.95,4.6,80],[-4.6,4.5,20],[0,3.7,40]];o.down=down.map(q=>go(...q)).slice(-1)[0];if(o.down[2]!==0)bad.push('down again: '+o.down);
  o.side=go(-5.95,2.0,30);if(o.side[2]!==0||o.side[0]<-5.1&&o.side[1]<3.9)bad.push('walked into the side of the stairs: '+o.side);
  const pens=L.pens.map(p=>[p.type,p.fl|0]);o.kinds=[...new Set(pens.map(p=>p[0]))].sort().join(',');if(o.kinds!=='bear,bunny,capybara,cat,dog,duck,hamster,monkey,owl,seal')bad.push('spots '+o.kinds);
  for(const a of PEN)if(a.pen.type==='bear'||a.pen.type==='seal'||a.pen.type==='monkey'){if((a.pen.fl|0)!==2)bad.push(a.t+' not on floor 3');}
  let off=0,n=0;for(let f=0;f<600;f++){__run(1);for(const a of PEN){n++;const q=a.pen,x=a.x-L.ox,z=a.z-L.oz;if(x<q.x0-.45||x>q.x1+.45||z<q.z0-.45||z>q.z1+.45)off++;}}o.wander=[off,n];if(off)bad.push('animals off their spots: '+off);
  P.x=L.ox;P.z=L.oz+3.7;P.cy=0;__run(2);const bear=PEN.find(a=>a.t==='bear');P.x=bear.x+1;P.z=bear.z+1.5;__run(1);o.bearT=targets().includes(bear.target)&&bear.target.when();if(o.bearT)bad.push('the bear on floor 3 can be tapped from floor 1');
  P.x=L.ox+4.4;P.z=L.oz+2.4;P.cy=0;__run(2);const shop=L.inter.find(t=>/Buy pet food/.test(typeof t.label==='function'?t.label():t.label));o.buy=!!shop&&shop.when();if(!o.buy)bad.push('no Buy button on floor 1');
  const K=KEEPERS.find(k=>k.name==='Ms. Paws');o.paws=[+(K.x-L.ox).toFixed(2),+(K.z-L.oz).toFixed(2)];if(Math.abs(K.x-L.ox-6.25)>.01)bad.push('Ms. Paws is not behind the counter');
  const c=LOC.city.cols.find(q=>q.x1!==undefined&&Math.abs(q.x1-10.9)<.01&&Math.abs(q.z2-20.7)<.01);o.town=!!c;if(!c)bad.push('the shop in town is not 14 x 10');
  o.bad=bad;return o;}"""
async def p23(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p23', FIX=FIX, name='ZZTEST-SHOP3')
    try:
        r = await g.ev(P23_JS); errs = g.errors[:]
        await g.ev("()=>{const L=LOC.pets;P.x=L.ox;P.z=L.oz+4.3;P.cy=0;P.yaw=0;P.pitch=.3;}"); await g.step(3); await g.shot('petshop-3floors', both=False)
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    det = (f"one room, floors at {r['room'][2]} m; walked up both stairs [x, z, height]: {r['up'][3]} and {r['up'][11]}, the following pet [height, m from you] {r['pet']}; the open middle stops you {r['hole']}; "
           f"down again {r['down']}; the stairs' side stops you {r['side']}; spots for {r['kinds']}; 30 s of animals: {r['wander'][0]} of {r['wander'][1]} off their spot; "
           f"floor 3 bear tappable from floor 1: {r['bearT']}; Buy on floor 1 {r['buy']}; Ms. Paws at {r['paws']}; the 14 x 10 building in town {r['town']}")
    return not bad, det + ' NOT VERIFIED: the camera on the stairs and the floors by eye on a real iPad' + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P24 today's pets redrawn to the kept versions ----------------
P24_JS = r"""()=>{const bad=[],o={};const n=m=>{let v=0;m.root.traverse(q=>{if(q.isMesh)v++;});return v;};
  const pug=makePet('pug',PET_TYPES.pug.cols[0]),capy=makePet('capybara','#c49a74'),pom=makePet('pomchi',PET_TYPES.pomchi.cols[0]),duck=makePet('duck','#ffe08a'),owl=makePet('owl','#8a5a36');
  o.pug=n(pug);o.capy=[n(capy),packPetKey('capybara','#c49a74')];o.pom=[pom.tail.position.y,pom.tail.position.z];o.wings=[duck.wings&&duck.wings.length,owl.wings&&owl.wings.length,duck.wings&&duck.wings[0].children.length,owl.wings&&owl.wings[0].children.length];
  if(o.pug!==PACKM.o['pug.0'].n.length&&o.pug<40)bad.push('pug is not the new pug: '+o.pug);if(o.capy[1]!=='capybara.0'||o.capy[0]<40)bad.push('capybara '+o.capy);
  if(Math.abs(o.pom[0]-.28)>1e-6||Math.abs(o.pom[1]+.17)>1e-6)bad.push('pomchi tail '+o.pom);if(o.wings[0]!==2||o.wings[1]!==2||!o.wings[2]||!o.wings[3])bad.push('wings '+o.wings);
  for(const [m,k] of[[duck,'duck'],[owl,'owl']]){for(let t=0;t<3;t+=.5)COZY_MOVES.play(m,'pet.veryHappy',t,{kind:k});if(m.__mv&&m.__mv.warned)bad.push(k+' move error');}
  const old=[];for(const k of['dog','cat','bunny','hamster','sausage']){const m=makePet(k,PET_TYPES[k].cols[0]);old.push(k+' '+n(m));}o.same=old;
  o.bad=bad;return o;}"""
async def p24(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p24', FIX=FIX, name='ZZTEST-REDRAW')
    try: r = await g.ev(P24_JS); errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    return not bad, (f"pug (new) {r['pug']} pieces; capybara (real, an old saved colour picks {r['capy'][1]}) {r['capy'][0]}; pomchi tail at {r['pom']}; duck and owl wings [joints, joints, pieces, pieces] {r['wings']}; "
                     f"unchanged (the kept version is today's): {', '.join(r['same'])}") + (f' | PROBLEMS: {bad}' if bad else '')

# ============ stage 5 (1 Nov): the Pet Show with friends, tricks, the healthy-week ribbon at the show, the animal license ============
SAT = """()=>{__goto('city');const c=clockNow();let d=c.day;while(wdIdx(d)!==5)d++;__clockMs(msAt(d,12)-CLK.sk);__run(4);closePanel();
  for(const p of PET_ACTORS){p.d.happy=90;p.d.sick=0;p.d.sad=0;}PBR.sick=false;S.show=null;P.x=-31;P.z=22.6;P.yaw=Math.PI/2;bringFollowers(true);__run(6);return {day:S.day,wd:wdName(),t:Math.round(S.time*10)/10};}"""
# one frame loop for a show: taps 'perfect' (or the given grade's spot) when aiming, OK on the results, Yay on the license card; stops at a stage or at the end
SHOWRUN = r"""([until,gr,skip,max])=>{let n=0;const at=g=>g===2?.25:g===1?.12:0;while(n<(max||6000)){__run(1);n++;const C=CUT;if(!C||!C.show)return {end:true,n};if(until&&C.stage===until)return {stage:C.stage,n,ri:C.ri,round:C.round};
    if(C.stage==='aim'&&C.t-C.st>.3){C.t0=performance.now()-((at(gr==null?2:gr)+1-C.ph)%1)*[1.8,1.5,1.25][C.round]*1000;ACT.pstap();}
    if(skip&&/^(intro|r|wait)/.test(C.stage)&&C.ri<C.me&&C.ts==null)ACT.psskip();
    if(C.stage==='res'&&C.paid)ACT.psbye();if(C.stage==='lic'&&C.licOpen)ACT.licok();}
  return {timeout:true,stage:CUT&&CUT.stage,n};}"""

# ---------------- P26 the Pet Show area in Cozy Park (objects-petshow-area, map-petshow-park) ----------------
P26_JS = r"""()=>{const L=LOC.city,A=L.show||{},bad=[],o={};
  const inb=(k,x,z)=>A[k]&&x>=A[k][0]-.05&&x<=A[k][1]+.05&&z>=A[k][2]-.05&&z<=A[k][3]+.05;
  if(!inb('show.stage',-36.5,22)||!inb('show.podium',-36.0,16.9)||!inb('show.judges',-33.8,27.3))bad.push('stage/podium/judges not at their places '+JSON.stringify(A));
  o.area=A;const pod=A['show.podium'],st=A['show.stage'];if(pod&&st&&pod[0]<st[1]&&pod[3]>st[2]&&pod[1]>st[0]&&pod[2]<st[3]&&pod[1]>st[1])bad.push('the podium stands in front of the stage');
  if(st&&!(st[0]>-37.6&&st[1]<-35.0))bad.push('stage depth '+st);
  const signs=[];L.g.traverse(m=>{if(m.isMesh&&m.userData.sign)signs.push(m.userData.sign.text);});o.signs=['🏆 Pet Show','Every Saturday!','Lady Fluffington','Sir Barkley','Granny Daisy'].map(t=>t+':'+signs.filter(s=>s===t).length);
  for(const t of ['🏆 Pet Show','Every Saturday!','Lady Fluffington','Sir Barkley','Granny Daisy'])if(signs.filter(s=>s===t).length!==1)bad.push('sign '+t+' x'+signs.filter(s=>s===t).length);
  const solid=(x,z)=>{const q=collideXZ(x,z,.3,L);return Math.hypot(q[0]-x,q[1]-z)>.05;};
  o.solid={stage:solid(-36.5,22),podium:solid(-36.0,16.9),judges:solid(PS.jt[0],PS.jt[1]),lawn:solid(-33.2,22),out:solid(PS.out[0],PS.out[1])};
  if(!o.solid.stage||!o.solid.podium||!o.solid.judges||o.solid.lawn||o.solid.out)bad.push('solid '+JSON.stringify(o.solid));
  const trees=L.cols.filter(c=>c.cr===.28).map(c=>[c.cx,c.cz]);o.tree=[trees.some(t=>Math.hypot(t[0]+39.2,t[1]-13.4)<.01),trees.some(t=>Math.hypot(t[0]+37.4,t[1]-16.2)<.01)];if(!o.tree[0]||o.tree[1])bad.push('park tree not moved to -39.2,13.4');
  const sl=L.inter.find(i=>i.label==='Go down the slide');o.slide=sl&&[sl.x,sl.z];if(!sl||Math.hypot(sl.x+39.0,sl.z-30.1)>.01)bad.push('slide spot '+o.slide);
  o.slideCol=L.cols.some(c=>c.x1===-39.7&&c.z1===30.4&&c.x2===-38.3&&c.z2===35.8);if(!o.slideCol)bad.push('slide collider not moved');
  o.truck=[TRUCK.x,TRUCK.z,+TRUCK.ry.toFixed(3)];if(TRUCK.x!==-32.7||TRUCK.z!==10.3||Math.abs(TRUCK.ry+Math.PI/2)>1e-6)bad.push('food truck '+o.truck);
  const ti=L.inter.find(i=>i.label==='Food truck');o.truckSpot=ti&&[+ti.x.toFixed(2),+ti.z.toFixed(2)];if(!ti||Math.abs(ti.x+32.35)>.01||Math.abs(ti.z-12.4)>.01)bad.push('truck order spot '+o.truckSpot+' (want -32.35, 12.4: the window faces the park)');
  const K=KEEPERS.find(k=>k.name==='Mr. Patty');o.patty=K&&[+K.x.toFixed(2),+K.z.toFixed(2)];if(!K||Math.abs(K.x+32.35)>.01||Math.abs(K.z-10.5)>.01)bad.push('Mr. Patty not in the turned truck '+o.patty);
  const sg=[];L.g.traverse(m=>{if(m.isMesh&&m.userData.sign&&m.userData.sign.text==='🍔 Food truck'){const v=new THREE.Vector3();m.getWorldPosition(v);const n=new THREE.Vector3(0,0,1).applyQuaternion(m.getWorldQuaternion(new THREE.Quaternion()));sg.push([+v.x.toFixed(2),+v.z.toFixed(2),+n.x.toFixed(2),+n.z.toFixed(2)]);}});
  o.truckSign=sg;if(sg.length!==1||sg[0][3]<.9)bad.push('the truck sign does not face the park '+JSON.stringify(sg));
  const ins=L.inter.find(i=>i.icon==='🏆');o.enter=ins&&[ins.x,ins.z];if(!ins||ins.x<-35.2||ins.x>-33)bad.push('enter spot '+o.enter);
  const J=PSX.judges.map(j=>{const p=j.p.root.position;return [+p.x.toFixed(2),+p.z.toFixed(2)];});o.judges=J;if(J.some(p=>Math.hypot(p[0]-PS.jt[0],p[1]-PS.jt[1])>1.6))bad.push('judges not at their table '+J);
  o.bad=bad;return o;}"""
async def p26(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p26', FIX=FIX, name='ZZTEST-AREA')
    try:
        await g.ev(SAT); r = await g.ev(P26_JS)
        await g.ev("()=>{P.x=-29.6;P.z=22;P.yaw=Math.PI/2;P.pitch=-.12;}"); await g.step(6); await g.shot('show-area', both=True)
        await g.ev("()=>{P.x=-31.5;P.z=6.8;P.yaw=Math.PI*.85;P.pitch=-.15;}"); await g.step(6); await g.shot('truck-turned')
        errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    return not bad, (f"pieces (x0,x1,z0,z1,top): {r['area']}; signs {r['signs']}; solid {r['solid']}; tree moved {r['tree']}; slide {r['slide']} (collider moved {r['slideCol']}); "
                     f"food truck {r['truck']}, order spot {r['truckSpot']}, Mr. Patty {r['patty']}, sign {r['truckSign']}; enter at {r['enter']}; judges seated at {r['judges']}") + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P27 tricks (rules-tricks, moves-show-tricks) ----------------
P27_JS = r"""()=>{const bad=[],o={};const want={dog:'highFive,agility,rollOver',cat:'spin,tower,highFive',bunny:'bigJump,hurdles,spin',hamster:'spin,maze,rollOver',capybara:'dance,bathSpin,rollOver',duck:'dance,bigJump,spin',owl:'headTurn,perchHop,spin',monkey:'clap,bars,flip',seal:'clap,ballNose,rollOver',bear:'wave,logWalk,rollOver',snake:'sway,basket,coilSpin'};
  const kinds=Object.keys(PET_TYPES);o.kinds=kinds.length;const plays=[];
  for(const k of kinds){const L=trList(k).map(t=>t[0]).join(','),w=want[COZY_MOVES.TRICK_KIND(k)];if(L!==w)bad.push(k+' tricks '+L);
    const m=makePet(k,PET_TYPES[k].cols[0]);for(const [id] of trList(k)){const len=trLen(k,id);if(len<5)bad.push(k+'.'+id+' lasts '+len+' s (want 5+)');const sp=trSpot(k,id),gO=trGear(sp);
      if(sp.G&&!gO&&TR_GEAR[sp.G.id])bad.push(k+'.'+id+' gear not built');for(const gr of[0,1,2])for(let t=0;t<=len;t+=.5)COZY_MOVES.play(m,'trick',t,{kind:k,trick:id,gr,h:sp.G&&sp.G.h,water:sp.G&&sp.G.water});
      if(m.__mv&&m.__mv.warned){bad.push(k+'.'+id+' errors');m.__mv.warned=0;}trGearOff(gO);plays.push(k+'.'+id+(sp.G?'@lawn':''));}}
  o.plays=plays.length;o.gear=plays.filter(x=>x.endsWith('@lawn')).length;
  const e=PET_ACTORS.find(p=>!p.d.stay&&petKind(p.d)==='dog')||PET_ACTORS.find(p=>!p.d.stay),d=e.d;d.tr=1;d.tp=0;delete d.tq;o.start=trKnown(d);
  const day0=S.day,log=[];for(let i=0;i<7;i++){S.day=day0+i;trPractice(e);if(i===0)trPractice(e);log.push(d.tr+'/'+d.tp);}S.day=day0;o.practice=log.join(' ');
  if(log[3]!=='1/4'||log[4]!=='2/0')bad.push('5 practice days (one a game day) should teach the 2nd trick: '+o.practice);
  d.tr=2;d.tp=3;d.sick=1;delete d.tq;trPractice(e);if(d.tp!==3)bad.push('a sick pet practised');d.sick=0;
  openPet(e);o.card=([...document.querySelectorAll('#card .trk')].map(x=>x.innerText)[0]||'');closePanel();if(!/✅ High five/.test(o.card)||!/🔒 Roll over \(practice 3\/5\)/.test(o.card))bad.push('pet card tricks: '+o.card);
  d.tr=1;o.show1=psTrs(petKind(d),trKnown(d)).map(t=>t[0]).join('/');d.tr=2;o.show2=psTrs(petKind(d),trKnown(d)).map(t=>t[0]).join('/');d.tr=3;o.show3=psTrs(petKind(d),3).map(t=>t[0]).join('/');
  if(o.show1!=='highFive/highFive/highFive'||o.show2!=='highFive/agility/highFive'||o.show3!=='highFive/agility/rollOver')bad.push('show tricks by what it knows '+[o.show1,o.show2,o.show3]);
  CUT={tr:psTrs('dog',3),round:0,d};o.gold=[0,1,2].map(r=>{CUT.round=r;return psGoldW(CUT);});CUT=null;if(o.gold.join()!=='0.08,0.12,0.12')bad.push('gold zones '+o.gold);
  d.tr=1;d.tp=0;o.bad=bad;return o;}"""
async def p27(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p27', FIX=FIX, name='ZZTEST-TRK')
    try:
        r = await g.ev(P27_JS); old = await g.ev("()=>S.pets.map(d=>d.tr)")
        errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    if any(t != 1 for t in old): bad.append(f'an old save\'s pets do not all know their first trick: {old}')
    return not bad, (f"{r['kinds']} pet kinds x 3 tricks = {r['plays']} tricks played (oopsie, good, perfect) without errors, {r['gear']} on their gear in front of the stage; old save's pets know {old}; "
                     f"practice (tr/tp, game day by game day, the 1st day twice) {r['practice']}; sick: no practice; pet card: {r['card']!r}; at the show: 1 known {r['show1']}, 2 {r['show2']}, 3 {r['show3']}; gold zone by trick {r['gold']}") + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P28 the Pet Show alone: town pets from the one clock, every trick from the moves pack, the ribbon, one show a Saturday ----------------
P28_JS = r"""()=>{const bad=[],o={};if(PSX.dirty||!PSX.rivals.length)psRefresh();const r0=Math.random;let calls=0;Math.random=function(){calls++;return r0();};
  const A=PSX.rivals.map((r,i)=>psPlan(r,i,123456)),B=PSX.rivals.map((r,i)=>psPlan(r,i,123456)),C2=PSX.rivals.map((r,i)=>psPlan(r,i,123457));Math.random=r0;
  const sig=L=>L.map(x=>[x.form,x.flop||'',(x.g||[]).join(''),(x.tr||[]).map(t=>t[0]).join('/'),x.tot||0].join(':')).join(' | ');o.a=sig(A);o.c=sig(C2);o.rnd=calls;
  if(sig(A)!==sig(B))bad.push('the same second gives other town results');if(calls)bad.push('dice: Math.random was used '+calls+' times');
  let diff=0;for(let s=1;s<40;s++)if(sig(PSX.rivals.map((r,i)=>psPlan(r,i,s)))!==o.a)diff++;if(diff<30)bad.push('the town results hardly change from show to show ('+diff+'/39)');
  const d=PET_ACTORS.find(p=>!p.d.stay).d;d.happy=85;S.hw.rb=0;const a=psScore10(d,3).happy;S.hw.rb=petWeek()+1;const b=psScore10(d,3).happy;d.happy=100;const c=psScore10(d,3).happy;S.hw.rb=0;o.rib=[a,b,c];
  if(b!==a+1||c!==10)bad.push('ribbon: Granny Daisy '+o.rib+' (want +1, at most 10)');o.bad=bad;return o;}"""
async def p28(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p28', FIX=FIX, name='ZZTEST-SHOW'); probs = []; det = []
    try:
        await g.ev(SAT); r = await g.ev(P28_JS); probs += r['bad']
        det.append(f"town pets for the show at second 123456: {r['a']}; at 123457: {r['c']}; dice used {r['rnd']}; ribbon (happy 85 without/with, 100 with) {r['rib']}")
        st = await g.ev("()=>{const p=PET_ACTORS.find(q=>!q.d.stay);p.d.tr=3;p.d.outfit={head:'tophat',back:'cape'};S.hw.rb=petWeek()+1;window.__tr=[];const f=COZY_MOVES.play;COZY_MOVES.play=function(m,n,t,o){if(n==='trick'&&o)window.__tr.push(o.kind+'.'+o.trick+'.'+Math.round(t*10));return f.apply(this,arguments);};psStart(p);return {ts:CUT.ts,order:CUT.order.map(x=>x.you?'you':x.kind)};}")
        run1 = await g.ev(SHOWRUN, ['res', 2, False, 9000])
        mid = await g.ev("()=>{const C=CUT,me=C.order[C.me];const by={};for(const k of window.__tr){const [a,b,t]=k.split('.');const id=a+'.'+b;by[id]=Math.max(by[id]||0,+t);}COZY_MOVES.play=COZY_MOVES.play;return {me:me.sc,tot:me.tot,res:C.res,tr:C.tr.map(t=>t[0]),longest:by,place:C.place,placed:C.placed.map(x=>(x.you?'you':x.kind)+' '+x.tot)};}")
        await g.shot('show-results')
        end = await g.ev(SHOWRUN, [None, 2, False, 3000])
        after = await g.ev("()=>{const sh=S.show;window.__lastToast='';openShow();return {show:sh,again:window.__lastToast,cut:!!CUT,p:[P.x,P.z]};}")
        det.append(f"alone: starts at once ({st['ts']} = no shared timeline), order {st['order']}; ran {run1}; you {mid['me']} = {mid['tot']} (taps {mid['res']}, tricks {mid['tr']}); placed {mid['placed']}; each trick played up to (tenths of a second) {mid['longest']}; after: {after}")
        if st['ts'] is not None or st['order'][-1] != 'you': probs.append('a show alone did not start at once with you last')
        if mid['res'] != [2, 2, 2] or mid['me']['trick'] != 10: probs.append('three perfect taps did not give a 10 from Sir Barkley')
        if mid['me']['happy'] != min(10, 9 + 1): probs.append(f"the ribbon did not add 1 to happiness: {mid['me']}")
        short = {k: v for k, v in mid['longest'].items() if v < 48}
        if short: probs.append(f'tricks cut short (under 4.8 s): {short}')
        if not any(k.startswith('dog.agility') or k.startswith('dog.highFive') for k in mid['longest']): probs.append('your dog\'s own tricks were not played')
        if not end.get('end') or not after['show'] or after['show']['place'] != mid['place'] or 'already' not in after['again']: probs.append(f'the show did not end with S.show saved and one show a Saturday: {end} {after}')
        errs = g.errors[:]
    finally: await run.close(g)
    if errs: probs.append(f'browser errors {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- P29 the Pet Show with friends (rules-pet-show-friends, screens-show-join) ----------------
P29_RUN = r"""([max])=>{let n=0;const C0=CUT;while(n<max){__run(1);n++;const C=CUT;if(!C||!C.show)return {end:true,n};if(C.stage==='aim'&&C.t-C.st>.3&&!C.tapd){C.t0=performance.now()-((1.25-C.ph)%1)*[1.8,1.5,1.25][C.round]*1000;ACT.pstap();}
    if(C.stage==='res'&&C.paid)return {res:true,n};}return {stage:CUT&&CUT.stage,ri:CUT&&CUT.ri,n};}"""
P29_RES = r"""()=>{const C=CUT;return {placed:C.placed.map(x=>psNm(x)+' '+x.tot),me:C.me,place:C.place,ts:C.ts,order:C.order.map(x=>x.you?'you:'+psNm(x):x.peer?'friend:'+psNm(x):'town:'+x.kind),npc:C.order.filter(x=>x.npc).map(x=>[x.form,(x.g||[]).join('')].join(':'))};}"""
async def p29(run, live_w, new_wb, FIX):
    probs = []; det = []; A = B = O = None
    async def flow(*gs, k=4, f=6):
        for _ in range(k):
            for g in gs: await g.step(f)
            await asyncio.sleep(.25)
    try:
        A = await pet_page(run, new_wb, 'p29-A', FIX=FIX, name='ZZTEST-SHA'); B = await pet_page(run, new_wb, 'p29-B', prof='pc-1366', FIX=FIX, name='ZZTEST-SHB', theme='dark')
        await A.ev(SAT); await B.ev(SAT)
        await B.ev("(ms)=>{__clockMs(ms);}", await A.ev("()=>realMs()"))
        await B.ev("()=>{P.x=-30.5;P.z=24.5;const d=PET_ACTORS.find(p=>!p.d.stay).d;d.name='Biscuit';bringFollowers(true);change();}"); await flow(A, B, k=6)
        here = await A.ev("()=>psFriendsHere().map(a=>a.nm)")
        await A.ev("()=>{openShow();ACT.psgo(0);}"); await flow(A, B, k=4)
        a1 = await A.ev("()=>({g:PSM.g&&{t0:PSM.g.t0,pi:PSM.g.pi},card:$('card').innerText,ps:JSON.parse(MP.lastKey).ps})")
        b1 = await B.ev("()=>({card:UI.open?$('card').innerText:'',btn:[...document.querySelectorAll('#card [data-a^=\"psjoin\"]')].map(b=>[b.innerText,Math.round(b.getBoundingClientRect().height)])})")
        await B.shot('join-card', both=False)
        det.append(f"friends A sees in the park {here}; A entered: {a1['g']}, ps {a1['ps']}; B's card: {b1['card'][:120]!r}, buttons {b1['btn']}")
        if not a1['g'] or 'starts in' not in a1['card']: probs.append('A did not wait for friends (45 s)')
        if 'entered the Pet Show' not in b1['card'] or not any('Just watch' in t for t, h in b1['btn']) or len(b1['btn']) < 2: probs.append('B did not get the join card with its pets and Just watch')
        if any(h < 44 for t, h in b1['btn']): probs.append('join buttons under 44 px')
        await B.ev("()=>ACT.psjoin('0')"); await flow(A, B, k=4)
        a2 = await A.ev("()=>({card:$('card').innerText,players:psPlayers(PSM.g.t0).map(x=>x.me?'me':x.peer.nm)})"); await A.shot('waiting-list', both=False)
        det.append(f"after B joined, A's waiting list: {a2['players']}")
        if len(a2['players']) != 2: probs.append('A does not see B in the waiting list')
        # the 45 seconds pass on both (the test clocks run with each page's frames), then the same show runs on both screens
        for _ in range(24):
            for g in (A, B): await g.ev("()=>__run(40)")
            await asyncio.sleep(.15)
            if await A.ev("()=>!!(CUT&&CUT.show)") and await B.ev("()=>!!(CUT&&CUT.show)"): break
        sa = await A.ev("()=>CUT&&CUT.show?{ts:CUT.ts,order:CUT.order.map(x=>x.you?'you':x.peer?'friend':'town:'+x.kind)}:null"); sb = await B.ev("()=>CUT&&CUT.show?{ts:CUT.ts,order:CUT.order.map(x=>x.you?'you':x.peer?'friend':'town:'+x.kind)}:null")
        det.append(f"the show started: A {sa}, B {sb}")
        if not sa or not sb or sa['ts'] != sb['ts']: probs.append('the show did not start on both screens at the same time')
        ra = rb = None
        for i in range(400):
            ra = await A.ev(P29_RUN, [12]); rb = await B.ev(P29_RUN, [12]); await asyncio.sleep(.05)
            if i == 60: await A.shot('friend-show', both=False)
            if (ra.get('res') or ra.get('end')) and (rb.get('res') or rb.get('end')): break
        xa = await A.ev(P29_RES) if ra.get('res') else None; xb = await B.ev(P29_RES) if rb.get('res') else None
        await A.shot('friend-results', both=False)
        det.append(f"results on A: {xa}; on B: {xb}")
        if not xa or not xb: probs.append(f'the show did not reach the results on both: {ra} {rb}')
        else:
            if xa['placed'] != xb['placed']: probs.append('the two screens show different results')
            if xa['npc'] != xb['npc']: probs.append('the town pets did differently on the two screens')
            if sorted(o.split(':')[0] for o in xa['order']) != ['friend', 'town', 'town', 'you']: probs.append(f"not 2 town pets + you + the friend: {xa['order']}")
            if [o.split(':', 1)[1] for o in xa['order']] != [o.split(':', 1)[1] for o in xb['order']]: probs.append('the order differs between the screens')
        for g in (A, B): await g.ev(SHOWRUN, [None, 2, False, 3000])
        await B.ev("()=>{__goto('city');P.x=10;P.z=-40;}")   # (B leaves the park)
        # more than 4: the next show right after (6 players sorted the same way: 4, then 2 + 2 town pets, the second starting at the end of the first)
        gr = await A.ev("""()=>{const fake=i=>({me:0,peer:{nm:'F'+i,pets:null},t0:1000,jt:1000+i,id:'z'+i,q:{nm:'P'+i,col:PET_TYPES.dog.cols[0],of:'',kind:'dog'},kind:'dog',sc:{style:2,trick:0,happy:5},tk:1});
          const L=[0,1,2,3,4,5].map(fake);const G=psGroups(L,1045);const o=G.map(g=>({ts:g.ts,len:Math.round(g.len),who:g.o.map(x=>x.npc?'town':x.R.owner)}));for(const g of G)for(const x of g.o)if(x.own){scene.remove(x.r.m.root);}return o;}""")
        det.append(f"6 players: {gr}")
        if len(gr) != 2 or gr[0]['who'] != ['F0', 'F1', 'F2', 'F3'] or gr[1]['who'] != ['town', 'town', 'F4', 'F5'] or abs(gr[1]['ts'] - (gr[0]['ts'] + gr[0]['len'])) > 1: probs.append('more than 4 players: not the next show right after')
        # an older version in the park: never asked, the show starts at once
        O = await begin(run, live_w, 'pc-1366', 'p29-old', dict(fx(FIX, PETS_SAVE) or FIX[0][1], name='ZZTEST-SHO'))
        await O.ev("()=>{__goto('city');P.x=-30.5;P.z=24.5;}"); await A.ev("()=>{S.show=null;}"); await flow(A, B, O, k=6)
        old = await A.ev("()=>{const n=[...MP.peers.values()].filter(a=>a.loc==='city'&&a.rx>-41&&a.rx<-8&&a.rz>8&&a.rz<41).length,f=psFriendsHere().length;openShow();ACT.psgo(0);return {peers:n,asked:f,cut:!!(CUT&&CUT.show),ts:CUT&&CUT.ts,g:!!PSM.g};}")
        det.append(f"with an older version in the park: peers {old['peers']}, friends asked {old['asked']}, the show started at once {old['cut']} (timeline {old['ts']})")
        if not old['peers'] or old['asked'] or not old['cut'] or old['ts'] is not None or old['g']: probs.append('an older version in the park changed the show')
        errs = A.errors[:] + B.errors[:]
        if errs: probs.append(f'browser errors {errs[:2]}')
    finally:
        for g in (A, B, O):
            if g: await run.close(g)
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- P30 the animal license (rules-animal-license, story-barkley-license, screens-license-card, moves-show-license) ----------------
P30_JS = r"""()=>{const bad=[],o={};const L=(w,k,f,lv)=>licReach({wins:w,weeks:k,firsts:f,lv:lv||0});
  o.table=[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[2,1,0],[2,2,0],[3,3,0],[3,3,1],[3,2,1],[5,5,2]].map(a=>a.join('/')+'='+L(...a));
  const want='0/0/0=0 1/0/0=0 0/1/0=0 1/1/0=1 2/1/0=1 2/2/0=2 3/3/0=2 3/3/1=3 3/2/1=2 5/5/2=3';if(o.table.join(' ')!==want)bad.push('levels '+o.table.join(' '));
  if(L(0,0,0,2)!==2)bad.push('a level was taken away');
  S.lic={lv:0,wins:0,firsts:0,weeks:0};const p4=licShow(4);const p3=licShow(3);S.lic.weeks=1;const p2=licShow(2);o.count=[p4,p3,p2,Object.assign({},S.lic)];
  if(S.lic.wins!==2||S.lic.firsts!==0||!p2.up||S.lic.lv!==1||p4.up||p3.up)bad.push('counting top 3 '+JSON.stringify(o.count));
  if(p3.near!=='One more healthy week and your license grows!')bad.push('almost-there line: '+p3.near);
  const f1=licShow(1);o.first=[f1,Object.assign({},S.lic)];if(S.lic.firsts!==1||S.lic.wins!==3)bad.push('1st place counts as a win and a first');
  sk('pets').lv=40;S.yard={pet:3,garden:1,home:['tree','pond','den']};S.home.store.push({u:'zztank',t:'snaketank',c:'#7a2bff',x:0,z:0,r:0});
  S.lic={lv:1,wins:1,firsts:0,weeks:1};o.locks=Object.keys(BIGP).map(k=>{const l=bigLock(k);return k+':'+(l?l[0]:'ok');});S.lic={lv:3,wins:3,firsts:1,weeks:3};o.locks3=Object.keys(BIGP).map(k=>{const l=bigLock(k);return k+':'+(l?l[0]:'ok');});
  if(o.locks.some(x=>/license 1/.test(x))||!o.locks.some(x=>/bear:Animal license 3/.test(x))||o.locks3.some(x=>/license/.test(x)))bad.push('big pets by license '+o.locks+' | '+o.locks3);
  S.lic={lv:0,wins:0,firsts:0,weeks:0};openMyPets();const st=document.querySelector('#card .licstrip');o.strip=st&&[st.innerText.replace(/\s+/g,' '),Math.round(st.getBoundingClientRect().height)];closePanel();
  if(!st||!/ANIMAL LICENSE · No level yet ☆☆☆/.test(o.strip[0])||o.strip[1]<44)bad.push('My pets strip '+o.strip);
  S.lic={lv:2,wins:2,firsts:0,weeks:2};openMyPets();ACT.lic();const c=document.querySelector('#card .lic');const cs=c&&getComputedStyle(c);o.card=c&&c.innerText.replace(/\s+/g,' ');o.bg=cs&&cs.backgroundColor;
  closePanel();S.home.store=S.home.store.filter(i=>i.u!=='zztank');
  if(!c||!/Level 2/.test(o.card)||!/1st place 0\/1/.test(o.card)||!/CERTIFIED/.test(o.card)||!/Signed: Sir Barkley/.test(o.card))bad.push('license card '+o.card);
  o.bad=bad;return o;}"""
async def p30(run, new_wb, FIX):
    probs = []; det = []
    g = await pet_page(run, new_wb, 'p30', FIX=FIX, name='ZZTEST-LIC', theme='dark')
    try:
        await g.ev(SAT); r = await g.ev(P30_JS); probs += r['bad']
        await g.ev("()=>{openMyPets();ACT.lic();}"); await g.step(4)
        r['fonts'] = await g.ev("""()=>Promise.race([document.fonts.ready.then(()=>[document.fonts.check('25px "Alfa Slab One"'),document.fonts.check('800 20px "Roboto Slab"'),document.fonts.check('700 20px "Roboto Slab"')]),new Promise(r=>setTimeout(()=>r(['timeout']),8000))])""")
        det.append(f"levels (wins/weeks/firsts) {' '.join(r['table'])}; counting {r['count']}; 1st {r['first']}; big pets at level 1 {r['locks']}, level 3 {r['locks3']}; strip {r['strip']}; card {r['card']!r} on {r['bg']} in dark mode; fonts loaded {r['fonts']}")
        if r['bg'] != 'rgb(243, 230, 196)': probs.append(f"the card is not paper-coloured in dark mode: {r['bg']}")
        if not all(r['fonts']): probs.append(f"the license fonts are not loaded: {r['fonts']}")
        await g.ev("()=>{openMyPets();ACT.lic();}"); await g.step(4); await g.shot('license-card', both=True); await g.ev("()=>closePanel()")
        # a show that brings level 1: Sir Barkley hands the card over on the podium
        await g.ev("()=>{S.lic={lv:0,wins:0,firsts:0,weeks:1};const p=PET_ACTORS.find(q=>!q.d.stay);p.d.happy=100;p.d.outfit={head:'tophat',back:'cape',neck:'bow',face:'shades'};psStart(p);}")
        await g.ev(SHOWRUN, ['res', 2, True, 9000]); await g.ev("()=>{let n=0;while(!CUT.paid&&n++<2000)__run(1);}")
        pl = await g.ev("()=>({place:CUT.place,lic:CUT.lic})")
        await g.ev("()=>ACT.psbye()")
        seq = await g.ev(r"""()=>{const out=[];let n=0;while(n++<200){__run(1);const C=CUT;if(!C||C.stage!=='lic')break;const L=C.lb,u=C.t-C.st;if(!L)break;
          const v=new THREE.Vector3();L.card.getWorldPosition(v);const b=L.B.root.position,y=L.Y.root.position;if(n%6===0)out.push([+u.toFixed(1),L.card.visible,+Math.hypot(v.x-b.x,v.z-b.z).toFixed(2),+Math.hypot(v.x-y.x,v.z-y.z).toFixed(2),+v.y.toFixed(2)]);if(C.licOpen)break;}
          return {seq:out,stage:CUT&&CUT.stage,card:UI.open?$('card').innerText.replace(/\s+/g,' ').slice(0,420):'',B:CUT&&CUT.lb&&[CUT.lb.B.root.position.x,CUT.lb.B.root.position.y,CUT.lb.B.root.position.z].map(v=>+v.toFixed(2)),toast:window.__lastToast};}""")
        await g.shot('license-given', both=False)
        end = await g.ev(SHOWRUN, [None, 2, False, 3000]); lic = await g.ev("()=>S.lic")
        det.append(f"the show: place {pl['place']}, {pl['lic']}; hand-over (time, card shown, from Sir Barkley, from you, height): {seq['seq']}; Sir Barkley on step 2 at {seq['B']}; said {seq['toast']!r}; card {seq['card']!r}; after {lic}")
        if not pl['lic'] or not pl['lic']['up'] or pl['place'] > 3: probs.append('top 3 with a healthy week did not bring level 1')
        s = seq['seq']
        if not s or not any(x[1] and x[2] < .7 for x in s[:4]) or not any(x[1] and x[3] < .7 and x[0] > 1.5 for x in s): probs.append('the card did not go from Sir Barkley\'s hand to yours')
        if 'Splendid! Here is your animal license, level 1' not in seq['toast'] or 'Find your license in My pets' not in seq['card']: probs.append('Sir Barkley\'s lines are missing')
        if not seq['B'] or abs(seq['B'][1] - .70) > .05: probs.append('Sir Barkley is not on podium step 2')
        if lic['lv'] != 1 or not end.get('end'): probs.append(f'the license is not level 1 after the show: {lic} {end}')
        errs = g.errors[:]
    finally: await run.close(g)
    if errs: probs.append(f'browser errors {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ================= stage 6 (1 Nov 2026): the farm, riding, chores =================
FARM_GO = """()=>{__goto('city');const c=clockNow();let d=c.day;while(wdIdx(d)!==1)d++;__setClock(d,12);__run(4);closePanel();S.coins=Math.max(S.coins,2000);S.ride={lesson:0};S.farm={eggs:0,milk:0};P.x=-100;P.z=-101;P.yaw=Math.PI/2;__run(4);return FARM.on;}"""
# ---------------- P31 the farm on the map: placements 1:1, trees taken out, walls, hills, the town's edge; nothing runs far away ----------------
P31_JS = r"""()=>{const bad=[],o={};farmLiveAll();o.lazy=FARM.lazy===true;o.liveMs=FARM.msLive;o.bootMs=FARM.ms;const want={};for(const [k] of FARMD.p)want[k]=(want[k]||0)+1;
  o.things=FARMD.p.length;o.kinds=Object.keys(want).length;o.built={an:FARM.an.length,horses:FARM.hs.length,people:FARM.ppl.map(p=>p.who),riders:FARM.riders.map(h=>h.rider.who),stables:FARM.stables.length,jumps:Object.keys(FARM.jumps).length,flags:Object.keys(FARM.flags).sort()};
  const nat=['pine','tree','bush','rock','nat.oak','nat.fir','nat.firs','nat.birch','mtn'].reduce((a,k)=>a+(want[k]||0),0),inst=FARM.inst.reduce((a,m)=>a,0);o.natural=nat;
  const animals=FARMD.p.filter(q=>q[0].startsWith('fa.')&&!q[0].startsWith('fa.horse.adult')).length;if(FARM.an.length!==animals)bad.push('farm animals '+FARM.an.length+' of '+animals);
  if(FARM.hs.length!==10)bad.push('horses '+FARM.hs.length+' (want 10)');if(FARM.hs.filter(h=>h.kind==='pad').length!==4)bad.push('paddock horses');
  if(o.built.people.join()!=='stan,ieva'&&o.built.people.join()!=='ieva,stan')bad.push('people '+o.built.people);if(o.built.riders.join()!=='cody,hank,rose')bad.push('riders '+o.built.riders);
  if(o.built.jumps!==12||o.built.flags.join()!=='blue,red'||o.built.stables!==2)bad.push('jumps/flags/stables '+JSON.stringify(o.built));
  const J=FARM.jumps.o122;if(!J||Math.hypot(J.x+175.72,J.z+94.42)>.05)bad.push('lesson jump o122 at '+JSON.stringify(J));
  if(Math.hypot(FARM.flags.blue.x+174,FARM.flags.blue.z+116)>.05||Math.hypot(FARM.flags.red.x+189,FARM.flags.red.z+114)>.05)bad.push('flags at '+JSON.stringify(FARM.flags));
  const IV=FARM.ppl.find(p=>p.who==='ieva'),SN=FARM.ppl.find(p=>p.who==='stan');if(Math.hypot(SN.x+167.2,SN.z+98)>.05||Math.hypot(IV.x+113,IV.z+111.5)>.05)bad.push('Stan/Ieva spots');
  /* the trees taken out (map-forest-clear) are gone from the world and the map, the others stay */
  const all=[...mapTrees().filter(t=>t[2]>0).map(t=>[t[0],t[1]]),...FAR_TREES];let left=0;for(const q of FARMD.del)if(all.some(t=>Math.hypot(t[0]-q[0],t[1]-q[1])<.6))left++;o.taken=FARM.deln;o.moved=FARM.mvn;
  if(left)bad.push(left+' trees to take out still stand');if(FARM.deln<53)bad.push('only '+FARM.deln+' trees taken out (53 of the 64 stand in the forest today; the other 11 went with the lane border, stage 3)');
  /* walls: the farm road is open, the rest of the town's north edge and the lane's hedge are not; hills stepped aside */
  const walk=(x,z,tx,tz)=>{P.x=x;P.z=z;for(let i=0;i<400;i++){const dx=tx-P.x,dz=tz-P.z,d=Math.hypot(dx,dz);if(d<.3)break;[P.x,P.z]=collideXZ(P.x+dx/d*.25,P.z+dz/d*.25,.3,LOC.city,solids());}return [+P.x.toFixed(1),+P.z.toFixed(1)];};
  o.road=walk(-50,-70,-50,-95);if(o.road[1]>-94)bad.push('the farm road is blocked at '+o.road);
  o.edge=walk(0,-70,0,-95);if(o.edge[1]<-80.5)bad.push('walked out of town at x 0: '+o.edge);
  o.hedge=walk(-120,-30,-120,-60);if(o.hedge[1]<-38.5)bad.push('walked through the lane hedge: '+o.hedge);
  o.west=walk(-185,-20,-200,-20);if(o.west[0]<laneEnd()-3.5)bad.push('walked past the lane end: '+o.west);
  o.barn=walk(-95,-111.1,-104.3,-111.1);if(Math.abs(o.barn[0]+104.3)<2)bad.push('walked into the barn: '+o.barn);
  let hill=0;for(let x=-224;x<=-46;x+=4)for(let z=-194;z<=-82;z+=4)if(farmZone(x,z)&&groundY(x,z)>.01)hill++;if(hill)bad.push(hill+' spots of the farm stand on a hill');
  /* speed: in town the farm's living things are hidden and nothing of the farm runs */
  __goto('city');P.x=18;P.z=4;__run(10);const t0=FARM.tick;__run(30);o.townTicks=FARM.tick-t0;o.dynShown=FARM.dyn.visible;if(o.townTicks||o.dynShown)bad.push('the farm works while you are in town');if(!o.lazy)bad.push('the farm animals were made while the game loaded (want: on the way to the farm)');
  const tri=g=>g.index?g.index.count/3:g.attributes.position.count/3;let st=0,sn=0;FARM.st.traverse(q=>{if(q.isMesh){st+=tri(q.geometry);sn++;}});o.drawn={static:[sn,st],inst:FARM.inst.map(m=>m.count+'x'+tri(m.geometry)),ground:FARM.ground.length};
  o.bad=bad;return o;}"""
async def p31(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p31', FIX=FIX, name='ZZTEST-FARM')
    try:
        r = await g.ev(P31_JS)
        for nm, js in (('farm-yard', "()=>{__goto('city');__setClock(null,12);P.x=-92;P.z=-104;P.yaw=Math.PI*.55;P.pitch=-.08;}"), ('jump-field', "()=>{P.x=-166;P.z=-88;P.yaw=Math.PI*.35;P.pitch=-.1;}"),
                       ('farm-road', "()=>{P.x=-50;P.z=-72;P.yaw=0;P.pitch=-.05;}")):
            await g.ev(js); await g.step(8); await g.shot(nm, both=(nm == 'farm-yard'))
        errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    return not bad, (f"{r['things']} placed things of {r['kinds']} kinds ({r['natural']} trees, bushes, rocks and mountains instanced); built {r['built']}; trees taken out {r['taken']}, moved {r['moved']}; "
                     f"walks: farm road {r['road']}, town edge {r['edge']}, lane hedge {r['hedge']}, lane end {r['west']}, into the barn {r['barn']}; in town the farm ran {r['townTicks']} times, living things shown {r['dynShown']}, made on the way there {r['lazy']} ({r['liveMs']} ms; the rest of the farm while loading: {r['bootMs']} ms); drawn {r['drawn']}") + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P32 riding: lesson with Stan (5 steps, 100 once), then free rides, gaits, town edge, get off at the stable, hours, pets wait ----------------
P32_JS = r"""()=>{const bad=[],o={},now=()=>gameMs()/1000,msg=()=>(TQ.q.length?String(TQ.q[TQ.q.length-1].m):($('toast').textContent||''));
  const H=FARM.hs.find(h=>h.kind==='pad'),LH=FARM.hs.find(h=>h.kind==='lesson');
  farmMount(H);o.before=[!!P.horse,msg()];if(P.horse)bad.push('rode before the lesson');
  farmIeva();o.ieva1=msg();farmIeva();o.ieva2=msg();
  const c0=S.coins;farmLessonStart();o.card=$('card').innerText.replace(/\s+/g,' ').slice(0,160);ACT.flesson();o.paid=c0-S.coins;if(o.paid!==100)bad.push('lesson paid '+o.paid);
  const step=()=>FARM.lesson?FARM.lesson.step:-1,log=[];log.push(step());
  const tg=()=>{const out=[];farmTargets(out);return out;};P.x=LH.x+1;P.z=LH.z+1;FARM.on=true;const t1=tg().find(t=>t.label==='Get on');if(!t1)bad.push('no Get on button by the lesson horse');else t1.act();log.push(step());
  const go=(x,z)=>{for(let i=0;i<300&&P.horse&&Math.hypot(P.x-x,P.z-z)>1;i++){const r=P.horse;P.yaw=Math.atan2(-(x-P.x),-(z-P.z));IN.keys.KeyW=true;farmRide(1/30);farmLessonTick(1/30);}IN.keys.KeyW=false;};
  go(FARM.flags.blue.x,FARM.flags.blue.z);log.push(step());go(FARM.flags.red.x,FARM.flags.red.z);log.push(step());
  const J=FARM.jumps.o122;go(J.x+3*Math.sin(J.ry),J.z+3*Math.cos(J.ry));P.x=J.x;P.z=J.z;P.horse.j=-9;farmLessonTick(.1);o.noJump=[step(),msg()];
  P.x=J.x;P.z=J.z;P.horse.sp=4;P.horse.j=now();farmLessonTick(.1);log.push(step());
  const SN=FARMD.lesson.stan;go(SN[0],SN[1]);for(let i=0;i<60;i++){P.horse&&(P.horse.sp=0);farmLessonTick(1/30);}log.push(step());o.steps=log.join(' ');o.done=[S.ride.lesson,!!P.horse,LH.st,msg().slice(0,60)];
  if(o.steps!=='0 1 2 3 4 -1'||S.ride.lesson!==1||P.horse)bad.push('lesson steps '+o.steps);if(o.noJump[0]!==3)bad.push('passed the jump without jumping');
  /* free rides after: a paddock horse, the gaits */
  const c1=S.coins;P.x=H.x+1;P.z=H.z;FARM.on=true;const rb=tg().find(t=>t.label==='Ride');if(!rb)bad.push('no Ride button by a free horse');else rb.act();o.free=c1-S.coins;if(!P.horse||o.free)bad.push('a free ride did not start (or cost '+o.free+')');
  const sp=keys=>{Object.assign(IN.keys,keys);const x0=P.x,z0=P.z;for(let i=0;i<60;i++)farmRide(1/30);for(const k in keys)IN.keys[k]=false;return +(Math.hypot(P.x-x0,P.z-z0)/2).toFixed(2);};
  P.x=-120;P.z=-100;P.yaw=Math.PI/2;sp({KeyW:true});o.trot=sp({KeyW:true});o.gallop=sp({KeyW:true,ShiftLeft:true});o.gaits=[o.trot,o.gallop];if(!(o.trot>3.5&&o.gallop>o.trot+1.5))bad.push('gaits '+o.gaits);
  /* the town edge: the horse stops and says so */
  P.horse.said=false;P.x=-50;P.z=-88;P.yaw=Math.PI;for(let i=0;i<90;i++){IN.keys.KeyW=true;farmRide(1/30);}IN.keys.KeyW=false;o.edge=[+P.z.toFixed(2),P.horse.said,msg()];if(P.z>-79.9||!P.horse.said||!/won't go into town/.test(msg()))bad.push('town edge '+o.edge);
  /* pets wait at the stable */
  o.wait=PET_ACTORS.filter(e=>e.fw).length;const fol=PET_ACTORS.filter(e=>!e.d.stay&&e.loc==='city').length;if(o.wait!==fol)bad.push('pets waiting '+o.wait+' of '+fol);
  /* get off: only at the stable */
  P.x=-150;P.z=-100;o.offFar=!!tg().find(t=>t.label==='Get off');const S0=FARM.stables[0];P.x=S0.x+2;P.z=S0.z+5;const off=tg().find(t=>t.label==='Get off');o.offNear=!!off;if(o.offFar||!off)bad.push('Get off far '+o.offFar+' near '+o.offNear);
  const hh=P.horse.h;off.act();o.after=[!!P.horse,hh.st,PET_ACTORS.filter(e=>e.fw).length];if(P.horse||hh.st!=='back'||o.after[2])bad.push('after getting off '+o.after);
  for(let i=0;i<2000&&hh.st==='back';i++)farmAnimal(hh,.05,gameMs(),now());o.home=[hh.st,+Math.hypot(hh.x-hh.hx,hh.z-hh.hz).toFixed(2)];if(hh.st!=='home')bad.push('the horse did not walk home '+o.home);
  /* hours: closed at night, and at closing you get off */
  P.x=H.x+1;P.z=H.z;farmMount(H);__setClock(null,21.2);P.horse&&farmRide(1/30);o.closing=[!!P.horse,msg().slice(0,40)];if(P.horse)bad.push('still riding after 21:00');
  farmMount(H);o.night=[!!P.horse,msg().slice(0,40)];if(P.horse)bad.push('rode at night');__setClock(null,12);
  /* a foal is not ridden; one rider a horse (a friend on it) */
  const foal=FARM.an.find(a=>a.type==='horse');P.x=foal.x+1;P.z=foal.z;o.foal=tg().filter(t=>Math.hypot(t.x-foal.x,t.z-foal.z)<.01).map(t=>t.label);if(o.foal.some(l=>/Ride/.test(l)))bad.push('a foal can be ridden');
  MP.peers.set('zzpeer',{peer:'zzpeer',rd:[H.i,'w',0]});o.taken=farmHorseFree(H);MP.peers.delete('zzpeer');if(o.taken)bad.push('a horse a friend rides is offered');
  o.saved=JSON.stringify(S).includes('"horse"');if(o.saved)bad.push('riding is saved (leaving the game must leave the horse at the farm)');
  o.bad=bad;return o;}"""
async def p32(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p32', FIX=FIX, name='ZZTEST-RIDE')
    try:
        await g.ev(FARM_GO); r = await g.ev(P32_JS)
        await g.ev("()=>{__setClock(null,12);const H=FARM.hs.find(h=>h.kind==='pad');H.st='home';H.x=H.hx;H.z=H.hz;H.m.root.position.set(H.x,0,H.z);P.x=H.x;P.z=H.z;farmMount(H);P.yaw=Math.PI*.6;P.pitch=-.2;}"); await g.step(8); await g.shot('riding', both=True)   # (picture pass 1: after the 21:00 test the horse was refused and you stood in it; noon, the horse at its spot)
        errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    return not bad, (f"before the lesson {r['before']}; Ieva {r['ieva1']!r} / {r['ieva2']!r}; Stan's card {r['card']!r}, paid {r['paid']}; steps {r['steps']} (no jump: {r['noJump']}), done {r['done']}; free ride cost {r['free']}, "
                     f"m/s trot/gallop {r['gaits']}; town edge {r['edge']}; pets waiting {r['wait']}; Get off far/near {r['offFar']}/{r['offNear']}, after {r['after']}, horse {r['home']}; closing {r['closing']}, night {r['night']}; foal {r['foal']}") + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P33 chores and the Market: eggs and milk once a game day, sold for 10 each ----------------
P33_JS = r"""()=>{const bad=[],o={},msg=()=>(TQ.q.length?String(TQ.q[TQ.q.length-1].m):($('toast').textContent||''));const d0=S.day;
  farmEggs();farmEggs();o.eggs=[S.farm.eggs,msg().slice(0,40)];farmMilk();farmMilk();o.milk=[S.farm.milk,msg().slice(0,40)];if(S.farm.eggs!==1||S.farm.milk!==1)bad.push('twice a day '+JSON.stringify(S.farm));
  S.day=d0+1;farmEggs();farmMilk();o.next=[S.farm.eggs,S.farm.milk];S.day=d0;if(S.farm.eggs!==2||S.farm.milk!==2)bad.push('next day '+o.next);
  const back=JSON.parse(JSON.stringify(S.farm));o.saved=back;
  __goto('market');openShop('market');o.card=($('card').querySelector('.farmsell')||{}).innerText||'';const c0=S.coins;ACT.fsell();o.sold=[S.coins-c0,S.farm.eggs,S.farm.milk];if(o.sold[0]!==40||S.farm.eggs||S.farm.milk)bad.push('sold '+o.sold);
  o.after=!!$('card').querySelector('.farmsell');closePanel();if(o.after)bad.push('the Sell part shows with nothing to sell');if(!/Farm eggs × 2/.test(o.card)||!/Farm milk × 2/.test(o.card)||!/40/.test(o.card))bad.push('sell card '+o.card);
  o.buy=SHOPS.market.items.includes('egg')||SHOPS.market.items.includes('milk');o.bad=bad;return o;}"""
async def p33(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p33', FIX=FIX, name='ZZTEST-CHORE')
    try:
        await g.ev(FARM_GO); r = await g.ev(P33_JS)
        await g.ev("()=>{S.farm.eggs=1;S.farm.milk=1;openShop('market');}"); await g.step(2); await g.shot('market-sell', both=True); await g.ev("()=>closePanel()")
        errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    return not bad, f"eggs [count, 2nd try] {r['eggs']}; milk {r['milk']}; next day {r['next']}; saved {r['saved']}; Market card {r['card']!r}; sold [coins, eggs, milk] {r['sold']}" + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P34 feeding and petting (free bucket); every farm move on its model ----------------
P34_JS = r"""()=>{const bad=[],o={};const t=FARM.troughs[0],now=()=>gameMs()/1000;const near=k=>FARM.an.filter(a=>a.type===k);
  const d0=near('cow').map(a=>Math.hypot(a.x-t.x,a.z-t.z));farmFeed(t.x,t.z,['cow','sheep'],1.6,'x');for(let i=0;i<700;i++){FARM.an.forEach(a=>farmAnimal(a,.05,gameMs(),now()));}
  const d1=near('cow').map(a=>Math.hypot(a.x-t.x,a.z-t.z));o.cows=[Math.max(...d0).toFixed(1),Math.max(...d1).toFixed(1)];if(Math.max(...d1)>2.6)bad.push('cows did not come to the trough '+o.cows);
  const c=near('cow')[0];P.x=c.x+1;P.z=c.z;farmPet(c);o.pat=c.act&&c.act.mv;if(o.pat!=='cow.patLean')bad.push('pet a cow: '+o.pat);
  const h=FARM.hs.find(q=>q.kind==='pad');farmHandFeed(h);o.hand=h.act&&h.act.mv;if(o.hand!=='horse.handEat')bad.push('hand feed: '+o.hand);
  const ch=near('chicken')[0];farmPet(ch);o.puff=ch.act.mv;
  /* every farm move on its own model without errors */
  const M={cow:['farm.walk','cow.graze','cow.stand','farm.troughEat','cow.patLean','farm.lookAtYou'],sheep:['farm.walk','sheep.graze','sheep.look','farm.troughEat','sheep.patLean'],pig:['farm.walk','pig.root','pig.roll','pig.bucketEat'],
    chicken:['chicken.walk','chicken.peck','chicken.run','chicken.grainPeck','chicken.puff'],horse:['horse.walk','horse.trot','horse.gallop','horse.jump','horse.idle','horse.refuse','horse.overGate','horse.handEat','horse.groomed'],lab:['farmdog.sleep']};
  let n=0;const warn=[];for(const a of FARM.an.concat(FARM.hs,FARM.riders)){for(const mv of M[a.type]||[]){for(let s=0;s<6;s+=.7){COZY_MOVES.play(a.m,mv,s,{kind:a.type,dist:s,h:.55});n++;}if(a.m.__mv&&a.m.__mv.warned){warn.push(a.type+' '+mv);a.m.__mv.warned=0;}}}
  for(const p of FARM.ppl.concat(FARM.riders.map(h=>h.rider)))for(const mv of p.type==='rider'?['person.ride']:['person.groom','coach.point','coach.whistle','coach.cheer','coach.directTo','person.idle']){for(let s=0;s<5;s+=.7){COZY_MOVES.play(p.m,mv,s,{kind:'person',horse:p.horse&&p.horse.m,target:[1,0,2]});n++;}if(p.m.__mv&&p.m.__mv.warned){warn.push(p.who+' '+mv);p.m.__mv.warned=0;}}
  o.plays=n;if(warn.length)bad.push('moves with errors: '+warn.slice(0,8));o.bad=bad;return o;}"""
async def p34(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p34', FIX=FIX, name='ZZTEST-FEED')
    try:
        await g.ev(FARM_GO); r = await g.ev(P34_JS)
        await g.ev("()=>{const t=FARM.troughs[0];farmFeed(t.x,t.z,['cow','sheep'],1.6,'x');let best=null;for(let a=0;a<16;a++){const [x,z]=collideXZ(t.x+Math.sin(a/16*TAU)*5,t.z+Math.cos(a/16*TAU)*5,.3,CUR),c=Math.min(...FARM.hs.map(h=>Math.hypot(h.m.root.position.x-x,h.m.root.position.z-z)));if(!best||c>best[2])best=[x,z,c];}P.x=best[0];P.z=best[1];P.yaw=Math.atan2(-(t.x-P.x),-(t.z-P.z));P.pitch=-.25;}"); await g.step(40); await g.shot('trough')   # (picture pass 2: 5 m from the trough on the side furthest from the horses; t+(4,3) stood you at the hand-fed horse's head)
        errs = g.errors[:]
    finally: await run.close(g)
    bad = r['bad'] + ([f'browser errors {errs[:2]}'] if errs else [])
    return not bad, f"cows furthest from the trough before/after feeding {r['cows']} m; pat {r['pat']}, hand {r['hand']}, hen {r['puff']}; {r['plays']} farm move plays" + (f' | PROBLEMS: {bad}' if bad else '')

# ---------------- P35 friends see you ride; the trail riders come from the one clock ----------------
async def p35(run, live_w, new_wb, FIX):
    probs = []; det = []; A = B = O = None
    try:
        A = await pet_page(run, new_wb, 'p35-A', FIX=FIX, name='ZZTEST-RDA'); B = await pet_page(run, new_wb, 'p35-B', prof='pc-1366', FIX=FIX, name='ZZTEST-RDB')
        for g in (A, B): await g.ev(FARM_GO); await g.ev("()=>{S.ride.lesson=1;P.x=-110;P.z=-104;}")
        await B.ev("(ms)=>{__clockMs(ms);}", await A.ev("()=>realMs()"))   # (the same clock, as in P29)
        for _ in range(8): await A.step(6); await B.step(6); await asyncio.sleep(.25)
        det.append(f"online: A sees {await A.ev('()=>[...MP.peers.values()].map(q=>q.nm)')}")
        a = await A.ev("()=>{const H=FARM.hs.find(h=>h.kind==='pad');farmMount(H);P.yaw=Math.PI/2;IN.keys.KeyW=true;return H.i;}")
        for _ in range(10): await A.step(3); await B.step(3); await asyncio.sleep(.3)
        b = await B.ev("()=>{const a=[...MP.peers.values()].find(q=>q.nm==='ZZTEST-RDA');if(!a)return null;const H=FARM.hs[a.rd?a.rd[0]:-1];return {rd:a.rd,horse:!!(a.fh&&a.fh.root.visible),y:+a.av.root.position.y.toFixed(2),st:H&&H.st,free:H?farmHorseFree(H):null,d:a.fh?+Math.hypot(a.fh.root.position.x-a.x,a.fh.root.position.z-a.z).toFixed(2):null};}")
        det.append(f"A rides horse {a}; B sees {b}")
        if not b or not b['rd'] or b['rd'][0] != a or not b['horse'] or b['y'] < .8 or b['st'] != 'peer' or b['free'] or (9 if b['d'] is None else b['d']) > .05: probs.append(f'B does not see A ride: {b}')
        await A.ev("()=>{IN.keys.KeyW=false;farmOff(true);}")
        for _ in range(8): await A.step(3); await B.step(3); await asyncio.sleep(.3)
        b2 = await B.ev(f"()=>{{const H=FARM.hs[{a}];const a=[...MP.peers.values()].find(q=>q.nm==='ZZTEST-RDA');return {{st:H.st,rd:a&&a.rd,horse:!!(a&&a.fh&&a.fh.root.visible)}};}}")
        det.append(f'after A got off, B: {b2}')
        if b2['rd'] or b2['horse'] or b2['st'] not in ('back', 'home'): probs.append(f'after getting off B still sees a rider: {b2}')
        rid = await A.ev("()=>{const out=[];for(const ms of [1e12,1e12+123456,1e12+400000]){out.push(FARM.riders.map(h=>{const p=farmRiderAt(h,ms);return p?[+p.x.toFixed(2),+p.z.toFixed(2)]:null;}));}return out;}")
        rid2 = await B.ev("()=>{const out=[];for(const ms of [1e12,1e12+123456,1e12+400000]){out.push(FARM.riders.map(h=>{const p=farmRiderAt(h,ms);return p?[+p.x.toFixed(2),+p.z.toFixed(2)]:null;}));}return out;}")
        det.append(f'trail riders at 3 clock times (A): {rid}')
        if rid != rid2: probs.append('the two players see the riders at different spots')
        if not any(p for row in rid for p in row): probs.append('no rider on the trail at any of the 3 times')
        O = await begin(run, live_w, 'pc-1366', 'p35-old', dict(fx(FIX, PETS_SAVE) or FIX[0][1], name='ZZTEST-RDO'))
        await A.ev("()=>{const H=FARM.hs.find(h=>h.kind==='pad'&&farmHorseFree(h));farmMount(H);}")
        for _ in range(6): await A.step(3); await O.step(3); await asyncio.sleep(.3)
        seen = await O.ev("()=>[...MP.peers.values()].map(q=>q.nm)")
        det.append(f'the live version online with a rider: sees {seen}, errors {O.errors[:1]}')
        if O.errors: probs.append(f'the live version has errors: {O.errors[:2]}')
        errs = A.errors[:] + B.errors[:]
        if errs: probs.append(f'browser errors {errs[:2]}')
    finally:
        for g in (A, B, O):
            if g: await run.close(g)
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- P36 (full check, 1 Nov): a save with big-needs pets and the glass tank is safe in an older version ----------------
# The live version (main) does not know the new pets or the tank: it stops at the title (its own update check then takes the newer file). The line proves the
# save is never written over there: the same bytes after it tried to start, and the new version still loads it with nothing lost.
P36_JS = r"""()=>{__goto('city');__setClock(null,12);__run(4);closePanel();S.coins=9000;sk('pets').lv=40;S.yard={pet:3,garden:1,home:['tree','pond','den']};S.lic.lv=3;yardLv();
  const F=FURN.snaketank,it={u:uid(),t:'snaketank',c:F.cols[0],x:0,z:-2,r:0};S.home.items.push(it);addHomeItem(it);
  for(const k of['monkey','snake']){openAdopt(k,PET_TYPES[k].cols[0]);ACT.adopt();closePanel();}change();saveLocal();
  return {js:localStorage.getItem('cozytown-save-1'),kinds:S.pets.map(d=>petKind(d))};}"""
async def p36(run, live_w, new_wb, FIX):
    probs = []; det = []; A = O = B = None
    try:
        A = await begin(run, new_wb, 'ipad-landscape', 'p36-new', dict(fx(FIX, PETS_SAVE) or FIX[0][1], name='ZZTEST-OLDV')); r = await A.ev(P36_JS); errs = A.errors[:]; await run.close(A); A = None   # (the real clock, as the two later pages)
        s1 = r['js']; sv = json.loads(s1)
        tanks = sum(1 for i in sv['home']['items'] if i.get('t') == 'snaketank')
        det.append(f"new save: pets {r['kinds']}, glass tanks placed {tanks}")
        if 'monkey' not in r['kinds'] or 'snake' not in r['kinds'] or not tanks: probs.append('the new version did not make the save with a monkey, a snake and a placed tank')
        O = await run.open(live_w, 'web', 'ipad-landscape', 'light', 'p36-live', save=sv)
        await start_from_save(O); await O.step(30); await asyncio.sleep(2)
        st = await O.ev("()=>({playing:!!PLAYING,js:localStorage.getItem('cozytown-save-1')})")
        det.append(f"the live version's own error (expected: it does not know the new pets and the tank) {O.errors[:1]}"); O.errors = []   # (reported here, so C6 counts only unexpected errors)
        await O.ev("()=>{try{saveLocal();}catch(e){}window.dispatchEvent(new Event('pagehide'));}")
        s2 = await O.ev("()=>localStorage.getItem('cozytown-save-1')")
        same = json.loads(st['js'] or 'null') == sv and json.loads(s2 or 'null') == sv   # (the kit seeds the save re-written by Python: compared as data)
        det.append(f"the live version: playing {st['playing']}, save unchanged after starting and leaving {same}")
        if not same:
            diffs = save_diff(sv, json.loads(s2 or 'null') or {})
            if diffs: probs.append(f'the live version changed the save and lost {len(diffs)} things: {diffs[:3]}')
            else: det.append('(written again by the live version with nothing lost)')
        await run.close(O); O = None
        B = await begin(run, new_wb, 'ipad-landscape', 'p36-back', json.loads(s2 or s1))
        back = await B.ev("()=>JSON.parse(localStorage.getItem('cozytown-save-1')||'null')")
        b = await B.ev("()=>{saveLocal();return JSON.parse(localStorage.getItem('cozytown-save-1'));}")
        diffs = [x for x in save_diff(sv, b) if not re.search(r"\.(happy|sad|t|px|pz|yaw|time)\b|^pets\.\d+\.loc: \"city\" -> \"home\"", x)]   # (a snake with its tank goes to live in it)
        if b.get('day') != sv.get('day') or (b.get('q') or {}).get('day') != (sv.get('q') or {}).get('day'): diffs = [x for x in diffs if not re.match(r'(day|litter\.day|q\.)', x)]; det.append(f"(the day turned {sv.get('day')} -> {b.get('day')} during the test: the day's own list and day numbers not compared)")
        det.append(f"days (game day / quest day / time): save {sv.get('day')}/{(sv.get('q') or {}).get('day')}/{round(sv.get('time') or 0, 2)}, as loaded {(back or {}).get('day')}/{((back or {}).get('q') or {}).get('day')}, back {b.get('day')}/{(b.get('q') or {}).get('day')}/{round(b.get('time') or 0, 2)}")   # (picture pass 4: the full check once saw the day's quest list drawn again on the way back)
        det.append(f"back in the new version: {len(diffs)} differences, tanks {sum(1 for i in b['home']['items'] if i.get('t') == 'snaketank')}, pets {len(b['pets'])}")
        if diffs: probs.append(f'lost on the way back: {diffs[:6]}')
        errs += B.errors[:]
        if errs: probs.append(f'browser errors (new version) {errs[:2]}')
    finally:
        for g in (A, O, B):
            if g: await run.close(g)
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- picture pass 1 (2 Nov): guards for the real problems the pictures found ----------------
BIGPETS = """()=>{__goto('city');__setClock(null,12);__run(4);closePanel();S.coins=9000;sk('pets').lv=40;sk('garden').lv=40;S.lic.lv=3;S.lic.wins=Math.max(S.lic.wins||0,3);PBR.sick=false;
  S.yard={pet:3,garden:3,home:['tree','pond','den'],gear:['dog','cat','bear']};yardLv();
  for(const k of['monkey','seal','bear'])if(!S.pets.some(d=>petKind(d)===k)){for(const e of PET_ACTORS)if(!e.d.stay)petGoHome(e);openAdopt(k,PET_TYPES[k].cols[0]);ACT.adopt();closePanel();}
  return PET_ACTORS.filter(e=>['monkey','seal','bear'].includes(petKind(e.d))).length;}"""
# P37: a big pet sent home walked straight at its rest spot and stood against the house (z 11.1) for good; now it walks round by the side path and the big-pets gate
P37_JS = r"""()=>{const bad=[],o={},big=PET_ACTORS.filter(e=>['monkey','seal','bear'].includes(petKind(e.d))),j=LANE.mine,[x,z]=lotPt(j,-17,-5.2);
  const at=e=>{const h=bigRest(e.d);return !!h&&Math.hypot(h[0]-e.x,h[1]-e.z)<1.2;};
  const run=tag=>{let f=0;while(f<2400&&!big.every(at)){__run(20);f+=20;}o[tag]=Math.round(f*.05)+' s: '+big.map(e=>petKind(e.d)+(at(e)?' home':' at '+lotBack(j,e.x,e.z).map(v=>v.toFixed(1)))).join(', ');
    if(!big.every(at))bad.push(tag+': not at home after 120 s of play ('+o[tag]+')');};
  const again=()=>{for(const e of big){e.d.stay=false;delete e.d.home;e.far=0;}bringFollowers(true);__run(40);for(const e of big)petGoHome(e);};
  P.x=x;P.z=z;P.cy=0;for(const e of big)petGoHome(e);run('full yard (garden 3, all pots, 3 gear pieces), from the front yard');
  again();run('sent home again');
  S.yard.garden=1;S.yard.gear=[];yardLv();again();run('garden 1, no gear');
  return {bad,o};}"""
async def p37(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p37', FIX=FIX, name='ZZTEST-BIGHOME')
    try:
        n = await g.ev(BIGPETS)
        if n < 3: return False, f'adopting the big pets: {n} of 3'
        r = await g.ev(P37_JS); probs = r['bad'] + ([f'browser errors {g.errors[:2]}'] if g.errors else [])
        return not probs, '; '.join(f'{k}: {v}' for k, v in r['o'].items()) + (f' | PROBLEMS: {probs}' if probs else '')
    finally: await run.close(g)

# P38: the camera stood inside a horse (riding shot, stable, trough): you never stand inside a grown horse or cow, walking into one, standing where one is, or feeding one
P38_JS = r"""()=>{const bad=[],o={};farmLiveAll();S.ride.lesson=1;
  const A=[...FARM.hs,...FARM.an].filter(a=>/^fa\.(horse|cow)\.adult/.test(a.key||'')),rc=new THREE.Raycaster(),D=[];rc.camera=camera;for(const x of[-1,0,1])for(const y of[-1,0,1])for(const z of[-1,0,1])if(Math.abs(x)+Math.abs(y)+Math.abs(z)===1||Math.abs(x)+Math.abs(y)+Math.abs(z)===3)D.push(new THREE.Vector3(x,y,z).normalize());
  const inside=()=>{camera.updateMatrixWorld(true);const c=camera.position;for(const a of A){const R=a.m.root;if(!R.visible||Math.hypot(c.x-R.position.x,c.z-R.position.z)>3.2)continue;R.updateMatrixWorld(true);
    let out=false;for(const d of D){rc.set(c,d);rc.far=4;const h=rc.intersectObject(R,true)[0];if(!h||h.object.material.side!==THREE.BackSide){out=true;break;}}if(!out)return a.key+'#'+(a.i??a.id);}return null;};   /* inside a body every ray, all 14 ways, first meets its outline from within (the dark void of the riding picture); outside, some ray sees a front face or nothing */
  let n=0;const hit=(what)=>{n++;const w=inside();if(w&&bad.length<6)bad.push(what+': the camera is inside '+w);};
  for(const a of A){const R=a.m.root;
    P.x=R.position.x;P.z=R.position.z;__run(4);hit('stood where it stands');   /* (the riding picture: put on a horse's spot, the horse not ridden) */
    for(const k of[0,1,2,3]){const t=k*Math.PI/2+.3;P.x=R.position.x+Math.sin(t)*3.5;P.z=R.position.z+Math.cos(t)*3.5;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);
      P.yaw=Math.atan2(-(R.position.x-P.x),-(R.position.z-P.z));P.pitch=0;IN.keys.KeyW=true;for(let f=0;f<36;f++){P.yaw=Math.atan2(-(R.position.x-P.x),-(R.position.z-P.z));__run(1);hit('walked into it');}IN.keys.KeyW=false;}
    if(a.kind){const t=R.rotation.y+Math.PI/2;P.x=R.position.x+Math.sin(t)*.9;P.z=R.position.z+Math.cos(t)*.9;__run(2);farmHandFeed(a);for(let f=0;f<40;f++){__run(1);hit('fed it from the hand');}}}
  o.animals=A.length;o.views=n;return {bad,o};}"""
async def p38(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p38', FIX=FIX, name='ZZTEST-NOHORSE')
    try:
        await g.ev(FARM_GO); r = await g.ev(P38_JS); probs = r['bad'] + ([f'browser errors {g.errors[:2]}'] if g.errors else [])
        return not probs, f"{r['o']['animals']} grown horses and cows, {r['o']['views']} views checked" + (f' | PROBLEMS: {probs}' if probs else '')
    finally: await run.close(g)

# P39: bear and seal waiting outside stood in each other at the shop front; capes floated over the pug or sat inside the bear; the Pet Show's big words followed you out
P39_WAIT = r"""()=>{const bad=[],o=[];const W=PET_ACTORS.filter(e=>['bear','seal'].includes(petKind(e.d)));for(const e of PET_ACTORS)if(!['bear','seal'].includes(petKind(e.d))&&!e.d.stay)petGoHome(e);
  for(const e of W){e.d.stay=false;delete e.d.home;e.far=0;}
  for(const id of Object.keys(DOORS)){const D=DOORS[id];if(!D||!D.city||id==='vet'||!LOC[id]||LOC[id].type!=='in')continue;__goto('city');P.x=D.city[0];P.z=D.city[1];P.yaw=D.city[2];bringFollowers(true);__run(6);
    setLoc(id);const L=LOC[id];P.x=L.ox+D.inside[0];P.z=L.oz+D.inside[1];bringFollowers();__run(6);const w=W.filter(e=>e.wo);
    if(w.length!==2){bad.push(id+': '+w.length+' of 2 wait outside');continue;}const gap=Math.hypot(w[0].x-w[1].x,w[0].z-w[1].z),door=Math.min(...w.map(e=>Math.hypot(e.x-D.city[0],e.z-D.city[1])));
    const moved=w.map(e=>{const q=collideXZ(e.x,e.z,.45,LOC.city);return Math.hypot(q[0]-e.x,q[1]-e.z);});o.push(id+' '+gap.toFixed(1)+'/'+door.toFixed(1));
    if(gap<1.9)bad.push(id+': bear and seal '+gap.toFixed(2)+' m apart (in each other)');if(Math.max(...moved)>.05)bad.push(id+': one waits inside a wall or fence');}
  __goto('city');return {bad,o};}"""
P39_BACK = r"""()=>{const bad=[],o=[],rc=new THREE.Raycaster();for(const k of Object.keys(PET_TYPES)){const m=makePet(k,PET_TYPES[k].cols[0]);m.root.updateMatrixWorld(true);
    const before=new Set();m.b.traverse(o=>before.add(o));addOutfit(m,{outfit:{back:'cape'}});m.root.updateMatrixWorld(true);
    const cape=[];m.b.traverse(x=>{if(!before.has(x)&&x.isMesh&&x.material.side!==THREE.BackSide)cape.push(x);});if(!cape.length){bad.push(k+': no cape drawn');continue;}
    if(k==='owl'){o.push('owl (upright on its back, run 4)');continue;}const top=cape.reduce((a,x)=>{const B=new THREE.Box3().setFromObject(x),A=(B.max.x-B.min.x)*(B.max.z-B.min.z);return A>a[1]?[x,A,B]:a;},[null,0,null]);   /* the cape itself (not its hanging end) */const B=top[2],c=B.getCenter(new THREE.Vector3());
    const hs=new Set();if(m.head)m.head.traverse(x=>hs.add(x));const body=[];m.b.traverse(x=>{if(x.isMesh&&before.has(x)&&!hs.has(x)&&x.material.side!==THREE.BackSide)body.push(x);});
    rc.set(new THREE.Vector3(c.x,c.y+2,c.z),new THREE.Vector3(0,-1,0));const h=rc.intersectObjects(body,false)[0],d=h?B.min.y-h.point.y:null;o.push(k+' '+(d==null?'-':d.toFixed(2)));
    if(d==null||d>.05||d<-.06)bad.push(k+': the cape is '+(d==null?'over nothing':(d>0?d.toFixed(2)+' m above':(-d).toFixed(2)+' m inside')+' its back'));}
  return {bad,o};}"""
P39_SHOW = r"""()=>{__goto('city');const c=clockNow();let d=c.day;while(wdIdx(d)!==5)d++;__setClock(d,12);__run(4);closePanel();for(const p of PET_ACTORS){p.d.happy=90;p.d.sick=0;}
  P.x=-34;P.z=25;const p=PET_ACTORS.find(e=>!PET_TYPES[petKind(e.d)].big);if(!p)return 'no pet';p.d.stay=false;delete p.d.home;p.x=P.x+1;p.z=P.z+1;p.loc='city';psStart(p);__run(20);if(!(CUT&&CUT.show))return 'no show';
  for(const t of['one','two','three','four'])popText(t);psEnd();window.__pops=0;new MutationObserver(m=>{for(const r of m)for(const n of r.addedNodes)if(n.classList&&n.classList.contains('pop'))window.__pops++;}).observe(document.body,{childList:true});return 'ok';}"""
async def p39(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p39', FIX=FIX, name='ZZTEST-PP1')
    probs = []; det = []
    try:
        if await g.ev(BIGPETS) < 3: return False, 'adopting the big pets failed'
        w = await g.ev(P39_WAIT); probs += w['bad']; det.append('waiting outside (apart/from the door, m): ' + ', '.join(w['o']))
        b = await g.ev(P39_BACK); probs += b['bad']; det.append('cape bottom over the back (m): ' + ', '.join(b['o']))
        s = await g.ev(P39_SHOW)
        if s != 'ok': probs.append(f'the show did not start: {s}')
        else:
            await asyncio.sleep(3.5); n = await g.ev("()=>window.__pops+document.querySelectorAll('.pop').length")
            det.append(f'big words shown after the show ended: {n}')
            if n: probs.append(f'{n} of the show\'s big words popped up after it ended')
        if g.errors: probs.append(f'browser errors {g.errors[:2]}')
        return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')
    finally: await run.close(g)

# P40 (picture pass 2, 2 Nov): after its vet visit a bear stood a metre in front of you (the small pets' spot) and filled the view; the snake's cape lay beside it
# while it slithered and the seal's stuck up by its head; the Pet Show's big words sat on the 'Every Saturday!' sign (a stray pink 'Ev') and a skipped turn's name popped up late
P40_VET = r"""()=>{const bad=[],o=[];const V=LOC.vet;for(const k of['bear','seal']){__goto('vet');__setClock(null,12);const b=PET_ACTORS.find(e=>petKind(e.d)===k);if(!b){bad.push('no '+k);continue;}
    for(const e of PET_ACTORS){if(e===b){e.d.stay=false;delete e.d.home;}else if(!e.d.stay)petGoHome(e);}P.x=V.ox-2.2;P.z=V.oz+UPZ-.4;P.yaw=0;floorVis();bringFollowers(true);__run(4);
    b.d.sick=1;VX={L:[b],i:0,t:0,said:0};let n=0;while(VX&&n++<900)__run(1);if(VX){bad.push(k+': the visit did not end');continue;}
    b.g.updateMatrixWorld(true);const B=new THREE.Box3().setFromObject(b.m.b),dx=Math.max(B.min.x-P.x,0,P.x-B.max.x),dz=Math.max(B.min.z-P.z,0,P.z-B.max.z),d=Math.hypot(dx,dz);
    o.push(k+' '+d.toFixed(2));if(d<1.5)bad.push(k+' gets off '+d.toFixed(2)+' m from you (under 1.5 m)');b.d.sick=0;}
  return {bad,o};}"""
P40_CAPE = r"""()=>{const bad=[],o=[],rc=new THREE.Raycaster();for(const k of['capybara','seal','snake'])for(const t of[null,.2,.45,.7]){const m=makePet(k,PET_TYPES[k].cols[0]);
    const before=new Set();m.root.traverse(x=>before.add(x));addOutfit(m,{outfit:{back:'cape'}});if(t!=null)COZY_MOVES.play(m,'pet.walk',t,{kind:k,dist:t*1.5});m.root.updateMatrixWorld(true);
    const cape=[];m.root.traverse(x=>{if(!before.has(x)&&x.isMesh&&x.material.side!==THREE.BackSide)cape.push(x);});const top=cape.reduce((a,x)=>{const B=new THREE.Box3().setFromObject(x),A=(B.max.x-B.min.x)*(B.max.z-B.min.z);return A>a[1]?[x,A]:a;},[null,0])[0];
    if(!top){bad.push(k+': no cape');continue;}const hs=new Set();if(m.head)m.head.traverse(x=>hs.add(x));const body=[];m.root.traverse(x=>{if(x.isMesh&&before.has(x)&&!hs.has(x)&&x.material.side!==THREE.BackSide)body.push(x);});
    top.geometry.computeBoundingBox();const g=top.geometry.boundingBox,r=[];for(const f of[-.45,-.25,0,.25,.45]){const v=new THREE.Vector3((g.min.x+g.max.x)/2,g.min.y,(g.min.z+g.max.z)/2+f*(g.max.z-g.min.z));top.localToWorld(v);
      rc.set(new THREE.Vector3(v.x,v.y+2,v.z),new THREE.Vector3(0,-1,0));const h=rc.intersectObjects(body,false)[0];r.push(h?v.y-h.point.y:null);}
    const w=r.reduce((a,x)=>x==null||a==null?null:Math.max(a,Math.abs(x)),0);if(t==null||w==null||w>.06)o.push(k+(t==null?' resting':' walking '+t+' s')+' '+r.map(x=>x==null?'-':x.toFixed(2)).join('/'));
    if(w==null||w>.06)bad.push(k+(t==null?'':' walking')+': the cape '+(w==null?'is over nothing in part':'is '+w.toFixed(2)+' m off its back')+' ('+r.map(x=>x==null?'-':x.toFixed(2)).join('/')+')');}
  return {bad,o};}"""
P40_SHOW = r"""()=>{__goto('city');const c=clockNow();let d=c.day;while(wdIdx(d)!==5)d++;__setClock(d,12);__run(4);closePanel();for(const p of PET_ACTORS){p.d.happy=90;p.d.sick=0;}
  P.x=-34;P.z=25;const p=PET_ACTORS.find(e=>!PET_TYPES[petKind(e.d)].big);if(!p)return {err:'no pet'};p.d.stay=false;delete p.d.home;p.x=P.x+1;p.z=P.z+1;p.loc='city';
  const s0=!!(PS.sign&&PS.sign.visible);psStart(p);__run(20);if(!(CUT&&CUT.show))return {err:'no show'};const s1=!!(PS.sign&&PS.sign.visible);
  window.__stale=0;new MutationObserver(m=>{for(const r of m)for(const n of r.addedNodes)if(n.classList&&n.classList.contains('pop')&&/ZZstale/.test(n.textContent))window.__stale++;}).observe(document.body,{childList:true});
  for(const t of['ZZstale1','ZZstale2','ZZstale3'])popText(t);psBegin(0);return {s0,s1,has:!!PS.sign};}"""
async def p40(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p40', FIX=FIX, name='ZZTEST-PP2')
    probs = []; det = []
    try:
        if await g.ev(BIGPETS) < 3: return False, 'adopting the big pets failed'
        v = await g.ev(P40_VET); probs += v['bad']; det.append('after the vet visit, from you to the pet (m): ' + ', '.join(v['o']))
        c = await g.ev(P40_CAPE); probs += c['bad']; det.append('cape bottom over the back along its length (m): ' + '; '.join(c['o']))
        s = await g.ev(P40_SHOW)
        if s.get('err'): probs.append('the show did not start: ' + s['err'])
        else:
            await asyncio.sleep(3.5); n = await g.ev("()=>window.__stale")
            await g.ev("()=>{psEnd();}"); await g.step(3); s2 = await g.ev("()=>!!(PS.sign&&PS.sign.visible)")
            det.append(f"'Every Saturday!' sign before/during/after the show: {s['s0']}/{s['s1']}/{s2}; a skipped turn's big words shown late: {n}")
            if not s['has']: probs.append('no Every Saturday sign found')
            if not s['s0'] or s['s1'] or not s2: probs.append("the 'Every Saturday!' sign is not hidden during the show only")
            if n: probs.append(f'{n} big words from before the next turn popped up after it began')
        if g.errors: probs.append(f'browser errors {g.errors[:2]}')
        return not probs, ' | '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')
    finally: await run.close(g)

# P41 (picture pass 3, 2 Nov): every cow was a 2.5 m drum (its bent neck tube came out of the book as a plain unit cylinder) and the sheep's neck stood upright;
# fed at the trough, every cow and sheep went to one spot (one big heap); the judges' table paddles said 9, 10, 8 before any score; a town pet on the stage had your seal's name;
# Ieva's 'first a lesson' line came on a timer over your ride (and after the lesson); in a jump the horse's neck filled the whole view
P41_MODELS = r"""()=>{const bad=[],o=[];for(const k of Object.keys(PACKM.o).filter(k=>/^fa\.(cow|sheep)\./.test(k))){const m=farmModel(k);m.root.rotation.set(0,0,0);m.root.updateMatrixWorld(true);
    const b=new THREE.Box3().setFromObject(m.root),w=b.max.x-b.min.x;o.push(k.slice(3)+' '+w.toFixed(2));if(w>1.2)bad.push(k+' is '+w.toFixed(2)+' m wide');
    if(k.includes('sheep')){let n=null;packBuild(k).root.traverse(q=>{const P=q.isMesh&&q.geometry.parameters;if(P&&P.radiusTop===.045)n=q;});if(!n)bad.push(k+': no neck tube');else{n.geometry.computeBoundingBox();const g=n.geometry.boundingBox;
      if(g.max.y-g.min.y>.15||g.max.z-g.min.z<.4)bad.push(k+' neck tube not along the neck ('+[g.max.y-g.min.y,g.max.z-g.min.z].map(v=>v.toFixed(2))+')');}}}
  return {bad,o};}"""
P41_FEED = r"""()=>{const bad=[],o=[];farmLiveAll();const t=FARM.troughs[0],now=()=>gameMs()/1000;farmFeed(t.x,t.z,['cow','sheep'],1.6,'x');for(let i=0;i<700;i++)FARM.an.forEach(a=>farmAnimal(a,.05,gameMs(),now()));
  for(const [k,need] of [['cow',1.0],['sheep',.6]]){const A=FARM.an.filter(a=>a.type===k&&Math.hypot(a.x-t.x,a.z-t.z)<3);let mn=99;for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++)mn=Math.min(mn,Math.hypot(A[i].x-A[j].x,A[i].z-A[j].z));
    o.push(k+': '+A.length+' at the trough, closest two '+mn.toFixed(2)+' m');if(A.length<2)bad.push(k+': only '+A.length+' came');else if(mn<need)bad.push(k+' at the trough '+mn.toFixed(2)+' m apart (under '+need+')');}
  return {bad,o};}"""
P41_SHOW = r"""()=>{const bad=[],o=[];const find=n=>{const r=[];const w=x=>{if(x[0]===2&&['9','10','8'].includes(String(x[2][0])))r.push(x[2]);const k=x[0]===2?null:x[0]===0?x[4]:x[2];if(Array.isArray(k))k.forEach(w);};w(n);return r;};
  const refs=find(PACKM.o['show.judges'].n).map(a=>signPlane(...a).material.map.image.toDataURL());o.push(refs.length+' paddle signs in the book table');if(refs.length!==3)bad.push('the book table has '+refs.length+' number paddles, not 3');
  const [jx,jz]=PS.jt,v=new THREE.Vector3();let n=0,hit=0;scene.traverse(q=>{const m=q.material,im=m&&m.map&&m.map.image;if(!q.isMesh||!im||!im.toDataURL)return;q.getWorldPosition(v);if(Math.hypot(v.x-jx,v.z-jz)>3)return;n++;if(refs.includes(im.toDataURL()))hit++;});
  o.push(n+' signs at the judges\' table, '+hit+' showing 9/10/8');if(n<3)bad.push('the table\'s signs were not found ('+n+')');if(hit)bad.push(hit+' table paddles show a score before any judge scored');
  const r0=psRivals(),keep=S.pets[0].name;S.pets[0].name=r0[0].name;const r1=psRivals(),mine=new Set(S.pets.map(d=>d.name));S.pets[0].name=keep;
  o.push('town pets '+r0.map(r=>r.name)+' -> with your pet named '+r0[0].name+': '+r1.map(r=>r.name));if(r1.some(r=>mine.has(r.name)))bad.push('a town pet has your pet\'s name');
  if(JSON.stringify(r0.map(r=>[r.type,r.col,r.outfit,r.owner]))!==JSON.stringify(r1.map(r=>[r.type,r.col,r.outfit,r.owner])))bad.push('renaming changed the day\'s town pets');
  return {bad,o};}"""
P41_RIDE = r"""()=>{FARM.lesson=null;S.ride={lesson:1};if(P.horse)farmOff(true);P.x=-100;P.z=-101;__run(4);$('toast').classList.remove('show');farmIeva();window.__iv=$('toast').textContent;
  if(!window.__rideT){window.__rideT=[];const t1=window.toast;window.toast=function(){if(P.horse)window.__rideT.push(String(arguments[0]||''));return t1.apply(this,arguments);};}   /* (picture pass 4: every toast while you ride) */
  const H=FARM.hs.find(h=>h.kind==='pad'&&farmHorseFree(h));P.x=H.x;P.z=H.z;farmMount(H);__run(4);return !!P.horse;}"""
P41_JUMP = r"""()=>{const bad=[],o=[];if(!P.horse)return {bad:['not on a horse'],o};const J=FARM.jumps.o122;P.x=J.x+3*Math.sin(J.ry);P.z=J.z+3*Math.cos(J.ry);P.yaw=Math.atan2(-(J.x-P.x),-(J.z-P.z));P.pitch=-.12;P.horse.ry=P.yaw+Math.PI;__run(3);
  const m=P.horse.h.m,v=new THREE.Vector3(),top=()=>{m.root.updateMatrixWorld(true);camera.updateMatrixWorld(true);let mx=-9;m.root.traverse(q=>{if(!q.isMesh||!q.visible)return;const p=q.geometry.attributes.position;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(q.matrixWorld).project(camera);if(Math.abs(v.x)<.15&&v.z<1)mx=Math.max(mx,v.y);}});return mx;};
  const t0=top();P.horse.sp=4;P.horse.j=gameMs()/1000;let mx=-9,at=0,n=0;for(let i=0;i<200&&gameMs()/1000-P.horse.j<1.5;i++){__run(1);const u=gameMs()/1000-P.horse.j;if(u<.25)continue;n++;const t=top();if(t>mx){mx=t;at=u;}}
  o.push('top of your horse in the middle of the view (screen, -1 bottom .. 1 top): riding '+t0.toFixed(2)+', in the jump up to '+mx.toFixed(2)+' at '+at.toFixed(2)+' s ('+n+' frames)');if(!n)bad.push('no jump frames');if(mx>.15)bad.push('in the jump your horse reaches '+mx.toFixed(2)+' up the screen (over 0.15: it fills the middle of the view)');
  farmOff(true);return {bad,o};}"""
async def p41(run, new_wb, FIX):
    g = await pet_page(run, new_wb, 'p41', FIX=FIX, name='ZZTEST-PP3')
    probs = []; det = []
    try:
        for js in (P41_MODELS,):
            r = await g.ev(js); probs += r['bad']; det += r['o']
        await g.ev(FARM_GO)
        r = await g.ev(P41_FEED); probs += r['bad']; det += r['o']
        r = await g.ev(P41_SHOW); probs += r['bad']; det += r['o']
        await g.ev(FARM_GO)
        if not await g.ev(P41_RIDE): probs.append('could not get on a horse')
        seen = set()
        for _ in range(16):   # Ieva's second line came 2.6 s after her first, on a real timer, and could wait in the toast queue
            await asyncio.sleep(.5); t = await g.ev("()=>$('toast').classList.contains('show')?$('toast').textContent:''")
            if t: seen.add(t)
        det.append('toasts in the 8 s after meeting Ieva and getting on: ' + ' / '.join(sorted(seen)))
        bad_t = [t for t in seen if re.search('First a lesson|Pick a horse', t)]
        if bad_t: probs.append(f"Ieva's timed line shows over your ride: {bad_t}")
        rt = await g.ev("()=>(window.__rideT||[]).slice()"); nfw = await g.ev("()=>PET_ACTORS.filter(e=>e.fw).length"); det.append(f"pets waiting at the stable {nfw}; toasts raised while riding: {rt}")   # (picture pass 4: no Ieva line at all while you ride)
        if [t for t in rt if 'Ieva' in t]: probs.append(f"an Ieva line comes while you ride: {rt}")
        r = await g.ev(P41_JUMP); probs += r['bad']; det += r['o']
        if g.errors: probs.append(f'browser errors {g.errors[:2]}')
        return not probs, ' | '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')
    finally: await run.close(g)

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
             ('P10', 'Moves pack (stage 2; stage 3 adds the yard-gear moves; stage 4b the big-needs pets\' moves): every pet move on every pet kind without an error, feet on the floor measured on the real shape (a yard-gear move, a big-needs pet\'s own, toy or home move on the kinds that play it; a move in water or in the air: the head stays in view); the moves of 2 players x 3 following pets take under 4 ms a frame', lambda: p10(run, new_wb, FIX)),
             ('P11', 'Pets are not left behind (stage 2 play test): long walks with 3 following pets on Friends Lane round the yard fences, through town corners and along the beach; no pet more than 9 m away for over 3 s, all with you after each walk', lambda: p11(run, new_wb, FIX)),
             ('P12', 'Friends Lane border (stage 3, map-lane-border): the hedges stand 37.5 m off the road (were 26.6), the lane ends and walls with them, the forest and the map keep the valley free to 42 m; the strip behind every lot is free', lambda: p12(run, new_wb, FIX)),
             ('P13', 'Yard levels by skill (stage 3): the 🏡 My yard sign sells garden level 2 (600, gardening 20) and 3 (1,500, gardening 40) and pet yard level 2 (800, Pet care 20) and 3 (2,000, Pet care 40), faded with the skill too low, Top level! at 3; the yard grows at once (fence back, big-pets gate at level 3); each garden level opens 3 new beds (spots 36-41) that work like the old ones; the pet limit stays 10', lambda: p13(run, new_wb, FIX)),
             ('P14', 'Only what you own shows (stage 3): a pot is drawn and usable only once it opens (6 at each gardening level 10-50), no lock plates; the new beds only with their garden level; no training gear before it is bought', lambda: p14(run, new_wb, FIX)),
             ('P15', 'Training gear (stage 3; stage 4b adds 5 for the big-needs pets): Ms. Paws sells the 15 pieces at their prices (dog course from pet yard level 2), one of each, refused when the yard has no room; it stands in the yard at once; tapped, a pet of its kind plays on it with its own moves (+20 happiness, then a happy dance); a full bowl and yard gear keep home pets at half speed', lambda: p15(run, new_wb, FIX)),
             ('P16', "Friends see your yard (stage 3): your garden level, pet yard level and gear go online as one short code (nothing at levels 1 with no gear); a friend's lot is drawn from it with its fences and gear; an old version's or a bad code draws the lot as before", lambda: p16(run, new_wb, FIX)),
             ('P17', "Vet station (stage 4): the clinic on the town's north edge (Map x 14.2, z -77.2, door to the west, on the map), solid walls, no tree or bush left inside it and every other one where the stage-3 build has it; 2 floors, Nurse Penny, Dr. Rūta, Vet nurse Leo, Dr. Tomas; the visit: sick pets with you go on the exam table one by one, Dr. Rūta checks (ears, teeth, a little cold), Leo gives a treat, cured, normal mood, 50 coins a pet or free with too few; too early, a friend's time or closed: no visit; walking away: no cure, no coins; Penny books, tips and sends you up; the people's feet on the floor", lambda: p17(run, live_w, new_wb, FIX)),
             ('P18', "Big-needs pets (stage 4): a Big pets board upstairs at Ms. Paws; monkey, seal and bear locked by Pet care 40, then pet yard level 3, then their home, then the animal license (bear 3, others 1); the snake by its glass tank, then license 1; Ms. Paws says the first missing thing in one line; never the word exotic; buttons 44 px", lambda: p18(run, new_wb, FIX)),
             ('P19', "Speed guard (owner's OK 1 Nov, with the 3.0 MB limit): 30+ frames a second on an iPad-sized view with 2 players online in town; the first load measured and reported (live and new)", lambda: p19(run, live_w, new_wb, FIX)),
             ('P20', "Big-needs pets (stage 4b): monkey (8 looks), seal (4), bear (6), snake (4) from the book's picked models (legs, flippers, the snake's body and tongue), saved as an old kind + their kind; locked ones are never adopted; when ready Ms. Paws lets you adopt them for 400; each plays with its favourite toy (frisbee, ball, squeaky toy, toy mouse) with its own move", lambda: p20(run, new_wb, FIX)),
             ('P21', "Big pet homes (stage 4b): climbing tree 400, pond 700, cave den 700 sold only at pet yard level 3, drawn and solid in the big-pets area, sent to friends as letters and drawn on their lot (a bad letter draws nothing); the snake's glass tank (400) is furniture with a Glass tank card: light on/off and 8 colours, saved as its colour; a snake at home lives in it, sleeps in the hide and goes out over the lip", lambda: p21(run, new_wb, FIX)),
             ('P22', "Waiting outside (stage 4b): bear and seal wait by the door of a building (Market) and join you again when you come out; at the vet station they come in; the monkey follows everywhere; a bear's vet visit is on the big-pet platform (it climbs on, Dr. Rūta comes over and goes back)", lambda: p22(run, new_wb, FIX)),
             ('P23', "The new Pet Shop (stage 4b): one room with 3 open floors (no fade), both stairs walked up and down with a following pet, the open middle and the stairs' sides stop you, each kind at its own spot (big pets on floor 3) and staying there, buttons only on their floor, Ms. Paws at the counter, the building in town 14 x 10", lambda: p23(run, new_wb, FIX)),
             ('P24', "Today's pets redrawn (stage 4b): the new pug, the real capybara (old saved colours map to the new ones), the pomchi's tail on its rump, duck and owl wings on joints; the others are the kept versions of today's", lambda: p24(run, new_wb, FIX)),
             ('P25', "Not slower than live (stage 5, the owner's ask 1 Nov; P19 stays for the real iPad): in the same test browser, the same iPad-sized view with 2 players online in town, the new build draws at least 90% of the live game's frames a second (medians of turns live/new/new/live/live/new; the CPU time of a frame reported) and its first load takes at most 115% of live's (means of live/new/new/live)", lambda: p25(run, live_w, new_wb, FIX)),
             ('P26', "The Pet Show area (stage 5, objects-petshow-area, map-petshow-park): the book's stage at (-36.5, 22), the podium BESIDE it at (-36, 16.9), the judges' table at (-33.8, 27.3) with the judges seated, on one sand lawn with a low rope; solid; the signs 🏆 Pet Show, Every Saturday! and the judges' names; the park tree moved to (-39.2, 13.4), the slide 1.8 m west and 2 m back, the food truck turned along the south fence with its window, order spot, Mr. Patty and sign facing the park", lambda: p26(run, new_wb, FIX)),
             ('P27', "Tricks (stage 5, rules-tricks): every pet kind has its 3 tricks from the moves pack (the 4 dogs share one set), each lasting 5 s or more and played (oopsie, good, perfect) without errors, gear tricks with their gear; a pet starts knowing 1 (old saves too); 5 practice days on its gear (one counts a game day) teach the next, never while sick; the pet card lists them; at the show only known tricks; a trick learned by practice has a bigger gold zone", lambda: p27(run, new_wb, FIX)),
             ('P28', "The Pet Show alone (stage 5): starts at once, you last; the town pets' results come from the one clock (the same second = the same results, never dice); your pet does its own known tricks, each played to its end; the healthy-week ribbon gives 1 more from Granny Daisy (at most 10); the show ends with your place saved, then one show a Saturday", lambda: p28(run, new_wb, FIX)),
             ('P29', "The Pet Show with friends (stage 5, rules-pet-show-friends, screens-show-join): a friend in the park entering gives you a join card (who, countdown, a button per following pet, Just watch, 44 px); the one who entered sees the places fill; after 45 s the same show starts on both screens with friends' pets in the town pets' places, and both screens show the same town results and the same final results; more than 4: the next show right after; an older version in the park is never asked", lambda: p29(run, live_w, new_wb, FIX)),
             ('P30', "The animal license (stage 5, rules-animal-license): level 1 = 1 top-3 + 1 healthy week, 2 = 2 + 2, 3 = 3 (one 1st) + 3, never taken away; top 3 counts only for the license; Sir Barkley hands a new level over on the podium (the card goes from his hand to yours) with his lines; the license card (paper, the same in dark mode, its fonts loaded) in My pets (strip 44 px); big pets unlock by level (bear 3)", lambda: p30(run, new_wb, FIX))]
    tests += [('P31', "The farm on the map (stage 6, map-farm-area-plan, pfu-placements): every placed thing at its spot (farm animals baby or adult, 10 horses, Ieva by the stable, Stan at the jump field, Cody, Hank and Rose, 12 jumps, the lesson flags blue (-174,-116) and red (-189,-114), 2 stables); the forest trees on the trail, roads, fields and building spots taken out (from the world and the map), the rest kept; the farm road open from the x -50 road, the town's north edge, the lane's hedge and its end still closed; buildings solid; no hill on the farm; in town nothing of the farm runs (speed guard)", lambda: p31(run, new_wb, FIX)),
              ('P32', "Riding (stage 6, rules-riding, story-ieva-stan, screens-riding, economy-riding-lesson-price, economy-stable-hours): no ride before the lesson; Ieva's first lines send you to Stan; Stan's lesson card costs 100 once; the 5 steps (get on, blue flag, red flag, jump o122 - not passed without jumping -, stop by Stan); then any free horse for free; walk/trot/gallop speeds; the horse stops at the town edge and says so; your pets wait at the stable; Get off only at the stable, the horse walks back to its spot; at 21:00 you get off, closed at night; a foal is not ridden; a horse a friend rides is not offered; riding is never saved", lambda: p32(run, new_wb, FIX)),
              ('P33', "Farm chores and the Market (stage 6, rules-farm-chores, economy-eggs-milk-price, screens-market-sell): eggs and milk once a game day each, again the next day, kept in the save; Mr. Bun's card shows a Sell part only with farm goods (rows and the total), Sell all pays 10 each", lambda: p33(run, new_wb, FIX)),
              ('P34', "Feeding and petting (stage 6, economy-farm-feed, moves-farm-feed, moves-farm-graze-necks): the free bucket fills the trough and the cows and sheep come to eat; petting (cow leans in, the hen puffs up), the horse eats from your hand; every farm move on every farm model and person without an error", lambda: p34(run, new_wb, FIX)),
              ('P35', "Friends see you ride (stage 6, rules-riding 7, guard 4): your horse and gait go online as a short code; a friend sees you on that horse (seated, the horse under you) and that horse is taken for them; you get off, it is free again; the trail riders stand at the same spot for both (the one clock); the live version online with a rider has no errors", lambda: p35(run, live_w, new_wb, FIX))]
    tests += [('P36', "An older version and a new save (full check, 1 Nov; project rule: old and new versions still see each other, saves keep everything): a save from this update with a monkey, a snake and a placed glass tank, opened in the live version, is never written over there (the live version stops at its title and its update check takes the newer file), and the new version loads it again with nothing lost", lambda: p36(run, live_w, new_wb, FIX))]
    tests += [('P37', "Big pets go home (picture pass 1, 2 Nov): a monkey, seal and bear sent home at pet yard level 3 walk round the house (side path, garden, the big-pets gate) to their own homes within 120 s of play: in a full yard (garden 3, every pot, 3 gear pieces), sent home a second time, and in a yard with garden 1 and no gear", lambda: p37(run, new_wb, FIX)),
              ('P38', "Never inside a horse or cow (picture pass 1, 2 Nov): put where a grown horse or cow stands, walking into it from 4 sides, or feeding a horse from your hand, the camera is never inside its body", lambda: p38(run, new_wb, FIX)),
              ('P39', "Picture pass 1 guards (2 Nov): at every building door bear and seal wait outside 1.9 m apart or more, never in a wall; the cape sits on the back of every pet kind (bottom within 5 cm above to 6 cm into it); the Pet Show's big words never pop up after the show ended", lambda: p39(run, new_wb, FIX)),
              ('P40', "Picture pass 2 guards (2 Nov): after its vet visit a bear or a seal gets off 1.5 m or more from where you stand; the capybara's, seal's and snake's cape lies on its back along its whole length (within 6 cm), resting and while walking (the snake's slithers with it); during a Pet Show the 'Every Saturday!' sign under the banner hides (the big words pop up there) and a turn's big words left waiting never pop up after the next turn began", lambda: p40(run, new_wb, FIX)),
              ('P41', "Picture pass 3 guards (2 Nov): every cow and sheep model is its real size (no part wider than 1.2 m; the sheep's neck tube lies along the neck); fed at the trough, the cows stand 1 m or more apart and the sheep 0.6 m or more (not one heap); the judges' table paddles never show a score; no town pet on the stage has one of your pets' names (and the day's town pets stay the same); no Ieva line ever comes while you ride (picture pass 4; was: Ieva's second line never shows over your ride); in a jump (take-off to landing) your own horse never fills the middle of the view", lambda: p41(run, new_wb, FIX))]
    only = [x for x in os.environ.get('PFU_ONLY', '').split(',') if x]
    for cid, name, fn in tests:
        if only and cid not in only: continue
        t0 = time.time(); ok, det = await guarded(fn)
        d['lines'].append(L(cid, name, ok, f'{det} ({round(time.time() - t0)} s)'))
        print('   ', 'PASS' if ok else 'FAIL', '|', cid, '|', str(det)[:300], flush=True)
    return d
