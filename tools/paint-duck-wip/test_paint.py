"""House paint works and costs coins (25 Nov): played for real on test copies (ZZTEST data only; the kit's fake network, so the UNSTRIPPED joined files).
   python3 tools/paint-duck-wip/test_paint.py <kit>/cozycheck <joined new game> <joined live game> <out folder>
   A paints with real taps; B (new version) and C (the live version) are online with A and must see the colour; A reloads; an old save with paint loads.
   Prints one line a check (PASS/FAIL) and writes pictures after-paint-*.png / before-paint-*.png."""
import asyncio, json, os, shutil, sys
KIT, NEW, LIVE, OUT = sys.argv[1:5]; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
from checks import start_from_save
HERE = os.path.dirname(os.path.abspath(__file__))
BASE = json.load(open(os.path.join(HERE, '..', 'check-fixtures', 'save-prenight3-pets.json')))
os.makedirs(OUT, exist_ok=True)
RES = []
def ck(name, ok, detail=''):
    RES.append(bool(ok)); print(('PASS' if ok else 'FAIL'), name, '|', detail, flush=True)

ST = """()=>{const lp=LOC.city.lane&&LANE.mine!=null?LOC.city.lane[LANE.mine]:null,cols=new Set();if(lp)lp.g.traverse(o=>{const c=o.isMesh&&o.geometry.attributes.color;if(c){const K=new THREE.Color();for(let i=0;i<c.count;i+=3)cols.add('#'+K.setRGB(c.getX(i),c.getY(i),c.getZ(i)).getHexString());}});
  const b=$('hcPay');let saved=null;try{saved=(JSON.parse(localStorage.getItem('cozytown-save-1')).home||{}).col||null;}catch(e){}
  return {coins:S.coins,col:houseCol(),now:houseColNow(),lane:laneOwnCol(),saved,wall:[...cols],pay:b?{off:b.disabled,txt:b.textContent}:null,on:[...document.querySelectorAll('#card .dotb.on')].map(d=>d.dataset.a),
    note:(document.querySelector('#card .note')||{}).textContent||'',toast:window.__lastToast||'',pick:typeof HP_PICK==='undefined'?'none':HP_PICK};}"""
OPEN = "()=>{__goto('home');__run(3);decoStart();__run(2);}"
SEES = """(nm)=>{const a=[...MP.peers.values()].find(p=>p.nm===nm);if(!a)return null;laneRefresh(true);const j=LANE.slotOf.get(a.peer),lp=j!=null?LOC.city.lane[j]:null,cols=new Set();
  if(lp)lp.g.traverse(o=>{const c=o.isMesh&&o.geometry.attributes.color;if(c){const K=new THREE.Color();for(let i=0;i<c.count;i+=3)cols.add('#'+K.setRGB(c.getX(i),c.getY(i),c.getZ(i)).getHexString());}});return {hc:a.hc||null,own:lp&&LANE.own[j]?LANE.own[j].col:null,wall:[...cols]};}"""
HOUSECAM = """()=>{__goto('city');__setClock(null,12);if(typeof wxForce==='function')wxForce('sun');laneRefresh(true);__run(4);const lp=LOC.city.lane[LANE.mine],f=lp.s<0?1:-1;
  const r=window.__realRender||renderer.render;window.__realRender=function(s,c){if(window.__pre)window.__pre();return r.call(renderer,s,c);};renderer.render=window.__realRender;
  window.__pre=()=>{if(PB)PB.root.visible=false;camera.position.set(lp.hx+5,3.2,lp.hz+f*15);camera.lookAt(lp.hx,3,lp.hz);};$('toast').classList.remove('show');}"""

async def pics(g, tag, what, both=True):
    n0 = len(g.shots); await g.shot(what, both=both)
    for p in g.shots[n0:]:
        theme = 'dark' if f'_{g.profile}_dark_' in os.path.basename(p) else 'light'
        shutil.copy(p, os.path.join(OUT, f'{tag}-{what}-{g.profile}-{theme}.png'))

async def sync(pages, n=8):
    for _ in range(3):
        for g in pages: await g.step(n)
        await asyncio.sleep(.3)

async def main():
    new = open(NEW, 'rb').read(); live = open(LIVE, 'rb').read()
    sv = lambda name, coins, x, col=None: dict(BASE, name=name, coins=coins, px=x, pz=-4.6, home=dict(BASE['home'], **({'col': col} if col else {})))
    async with Run('pd-paint', os.path.join(OUT, '_run_paint')) as run:
        # ---- before (the live game): the colour buttons do nothing
        L = await begin(run, live, 'ipad-landscape', 'paint-live', sv('ZZTEST-PAINTL', 120, -12))
        await L.ev(OPEN); await L.tap('[data-d="paint"]'); await L.step(4); s0 = await L.ev(ST)
        await pics(L, 'before', 'paint-card')
        r = await L.tap('#card [data-a="hcol:#ffb3a7"]'); await L.step(4); s1 = await L.ev(ST); hasAct = await L.ev("()=>typeof ACT.hcol")
        ck('BEFORE (live game): tapping Coral on the colour card changes nothing (the bug)', s1['col'] is None and hasAct == 'undefined', f"tap {r}; ACT.hcol is {hasAct}; colour {s1['col']}; coins {s0['coins']} -> {s1['coins']}")
        await L.ev("()=>{closePanel();decoEnd();setHouseCol('#ffb3a7');}"); await L.ev(HOUSECAM); await pics(L, 'before', 'house-coral-set-by-test')
        await run.close(L)

        # ---- after: A paints, B (new) and C (live version) watch online
        A = await begin(run, new, 'ipad-landscape', 'paint-A', sv('ZZTEST-PAINTA', 120, -17))
        B = await begin(run, new, 'pc-1366', 'paint-B', sv('ZZTEST-PAINTB', 100, -15.5))
        C = await begin(run, live, 'iphone-landscape', 'paint-Cold', sv('ZZTEST-PAINTC', 100, -14))
        ALL = (A, B, C)
        for g in ALL: await g.ev("()=>__goto('city')")
        for _ in range(40):
            await sync(ALL, 6)
            if await A.ev("()=>MP.peers.size>=2") and await B.ev("()=>MP.peers.size>=2") and await C.ev("()=>MP.peers.size>=2"): break
        ck('three players online together (A, B new; C the live version)', await A.ev("()=>MP.peers.size>=2"), str(await A.ev("()=>[...MP.peers.values()].map(a=>a.nm)")))
        b0 = await B.ev(SEES, 'ZZTEST-PAINTA'); c0 = await C.ev(SEES, 'ZZTEST-PAINTA')
        await A.ev(HOUSECAM); await pics(A, 'after', 'house-0-lane-colour'); await A.ev("()=>{window.__pre=null;}")

        await A.ev(OPEN); r = await A.tap('[data-d="paint"]'); await A.step(4); s = await A.ev(ST); lane = s['lane']
        ck('the card opens from the 🎨 House colour button and shows the price before paying', s['pay'] is not None and '50' in s['note'], f"tap {r}; note: {s['note']!r}")
        ck('nothing picked yet: the button is off and says the house has this colour', s['pay'] and s['pay']['off'] and 'has this colour' in s['pay']['txt'], str(s['pay']))
        await pics(A, 'after', 'paint-card-0-open')

        r = await A.tap('#card [data-a="hcol:#ffb3a7"]'); await A.step(4); p = await A.ev(ST)
        ck('tap Coral: only picked, nothing paid, the house not painted yet, the button shows the price', p['coins'] == 120 and p['col'] is None and p['pay'] and not p['pay']['off'] and '50' in p['pay']['txt'] and p['on'] == ['hcol:#ffb3a7'],
           f"tap {r}; coins {p['coins']}; colour {p['col']}; button {p['pay']}; marked {p['on']}")
        await pics(A, 'after', 'paint-card-1-picked')
        r = await A.tap('#hcPay'); await A.step(4); p = await A.ev(ST)
        ck('tap Paint it!: 50 coins taken once, the house is Coral, saved', p['coins'] == 70 and p['col'] == '#ffb3a7' and p['saved'] == '#ffb3a7' and '#ffb3a7' in p['wall'] and lane not in p['wall'],
           f"tap {r}; coins 120 -> {p['coins']}; colour {p['col']}; in the save {p['saved']}; Coral on the house walls {'#ffb3a7' in p['wall']}; message {p['toast']!r}")
        ck('after painting the button is off again (this colour costs nothing)', p['pay'] and p['pay']['off'], str(p['pay']))
        await pics(A, 'after', 'paint-card-2-painted')
        r = await A.tap('#card [data-a="hcol:#ffb3a7"]'); await A.step(3); r2 = await A.tap('#hcPay'); await A.step(3); p = await A.ev(ST)
        ck('picking the colour the house already has costs nothing', p['coins'] == 70 and p['col'] == '#ffb3a7' and p['pay']['off'], f"taps {r}, {r2}; coins {p['coins']}; button {p['pay']}")

        # online: B and C see it
        await A.ev("()=>{closePanel();decoEnd();__goto('city');}")
        b1 = c1 = None
        for _ in range(40):
            await sync(ALL, 6); b1 = await B.ev(SEES, 'ZZTEST-PAINTA'); c1 = await C.ev(SEES, 'ZZTEST-PAINTA')
            if b1 and c1 and b1['hc'] == '#ffb3a7' and c1['hc'] == '#ffb3a7': break
        ck('B (new version, online) sees A\'s house in Coral', b1 and b1['own'] == '#ffb3a7' and '#ffb3a7' in b1['wall'] and '#ffb3a7' not in b0['wall'], f"before {b0['own']!r}, after {b1 and b1['own']!r}; Coral on the walls of A's house in B's game: {b1 and '#ffb3a7' in b1['wall']}")
        ck('C (the live version, online) goes on as before: it never read a friend\'s house colour, so it shows A\'s house in the lane\'s colour; no error', c1 is not None and c1['own'] == '' and not C.errors, f"C shows {c1 and c1['own']!r}; A sent {c1 and c1['hc']!r}; errors {C.errors[:2]}")
        await A.ev(HOUSECAM); await pics(A, 'after', 'house-1-coral'); await A.ev("()=>{window.__pre=null;}")

        # the slider, then not enough coins
        await A.ev(OPEN); await A.tap('[data-d="paint"]'); await A.step(4)
        await A.ev("()=>{const sl=$('hcHue');sl.value=200;sl.dispatchEvent(new Event('input',{bubbles:true}));}"); await A.step(2); p = await A.ev(ST)
        ck('the "any colour" slider only picks too', p['coins'] == 70 and p['col'] == '#ffb3a7' and p['pick'] not in (None, '', '#ffb3a7', 'none') and not p['pay']['off'], f"picked {p['pick']}; coins {p['coins']}; house {p['col']}")
        pk = p['pick']; await A.tap('#hcPay'); await A.step(4); p = await A.ev(ST)
        ck('paying for the slider colour: 50 more coins, painted', p['coins'] == 20 and p['col'] == pk and pk in p['wall'], f"coins {p['coins']}; colour {p['col']}")
        await A.tap('#card [data-a="hcol:#bfe6ff"]'); await A.step(3); await A.ev("()=>{window.__lastToast='';}"); r = await A.tap('#hcPay'); await A.step(4); p2 = await A.ev(ST)
        ck('20 coins, Blue picked, Paint it!: a friendly message, no paint, no coins taken', p2['coins'] == 20 and p2['col'] == pk and 'Not enough coins yet' in p2['toast'], f"tap {r}; coins {p2['coins']}; colour {p2['col']}; message {p2['toast']!r}")
        await pics(A, 'after', 'paint-card-3-not-enough', both=False)
        await A.ev("()=>{S.coins=60;}"); await A.tap('#hcLane'); await A.step(3); p = await A.ev(ST); await A.tap('#hcPay'); await A.step(4); p2 = await A.ev(ST)
        ck('back to the lane\'s own colour is a paint job too (50), and the saved colour is gone', p['coins'] == 60 and p2['coins'] == 10 and p2['col'] is None and p2['saved'] is None and lane in p2['wall'], f"coins {p['coins']} -> {p2['coins']}; colour {p2['col']}; marked {p2['on']}")
        # paint Coral again and reload
        await A.ev("()=>{S.coins=55;}"); await A.tap('#card [data-a="hcol:#ffb3a7"]'); await A.step(3); await A.tap('#hcPay'); await A.step(4)
        await A.ev("()=>{closePanel();decoEnd();saveLocal();}")
        await A.page.reload(); await A.page.wait_for_function("()=>typeof $==='function'&&$('tPlay')&&!$('tPlay').disabled", timeout=240000)
        await start_from_save(A); await A.ev("()=>__goto('city')"); await A.step(30); await A.ev("()=>laneRefresh(true)"); p = await A.ev(ST)
        ck('after a reload the house is still Coral and no coins were taken again', p['col'] == '#ffb3a7' and p['coins'] == 5 and '#ffb3a7' in p['wall'], f"colour {p['col']}; coins {p['coins']}; on the walls {'#ffb3a7' in p['wall']}")
        errs = {g.name: g.errors[:4] for g in ALL if g.errors}
        ck('no errors in the three games', not errs, json.dumps(errs)[:600])
        for g in ALL: await run.close(g)

        # ---- an old save that already has paint keeps it, for free
        O = await begin(run, new, 'ipad-landscape', 'paint-old', sv('ZZTEST-PAINTO', 33, -17, '#bfe6ff'))
        await O.ev("()=>{__goto('city');laneRefresh(true);}"); await O.step(10); p = await O.ev(ST)
        ck('an old save with a painted house keeps its colour and its coins', p['col'] == '#bfe6ff' and p['coins'] == 33 and '#bfe6ff' in p['wall'], f"colour {p['col']}; coins {p['coins']}")
        await run.close(O)

        # ---- the card on phones (the layout has one more row)
        for prof in ('iphone-landscape', 'iphone-portrait'):
            g = await begin(run, new, prof, 'paint-' + prof, sv('ZZTEST-PAINTP', 120, -17))
            await g.ev(OPEN); await g.tap('[data-d="paint"]'); await g.step(4); await g.tap('#card [data-a="hcol:#9fd0ff"]'); await g.step(3)
            n0 = len(g.issues); await pics(g, 'after', 'paint-card-picked')
            r = await g.tap('#hcPay'); await g.step(4); p = await g.ev(ST)
            ck(f'{prof}: the Paint it! button can be tapped and paints', r == 'ok' and p['col'] == '#9fd0ff' and p['coins'] == 70, f"tap {r}; coins {p['coins']}; layout marks on the card: {[(i['k'], i['el']) for i in g.issues[n0:]][:6]}")
            await run.close(g)
    print(f'RESULT {sum(RES)} of {len(RES)} PASS', flush=True)
asyncio.run(main())
