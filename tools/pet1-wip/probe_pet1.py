"""Pet update 1, stage 1: probes for the session (not kit lines). Run with the kit folder as argument:
   python3 tools/pet1-wip/probe_pet1.py <kit>/cozycheck <new github file> <live github file> <out folder> [parts]
parts: hours,pets,give,two,fps (default all). Uses the kit's harness and fake room; test data is ZZTEST."""
import asyncio, json, os, sys
KIT, NEW, LIVE, OUT = sys.argv[1:5]; PARTS = (sys.argv[5] if len(sys.argv) > 5 else 'hours,pets,give,two,fps').split(',')
sys.path.insert(0, KIT)
from harness import Run
from night3 import begin, fx
FIXD = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'check-fixtures')
def load(n): return json.load(open(os.path.join(FIXD, n)))
new_wb, live_w = open(NEW, 'rb').read(), open(LIVE, 'rb').read()
RES = []
def out(k, ok, d): RES.append((k, ok, d)); print(('PASS' if ok else 'FAIL') + ' | ' + k + ' | ' + d, flush=True)
BASE = dict(load('save-prenight3-pets.json'), name='ZZTEST-PET1', pets=[], coins=9000)

HOURS = """()=>{const ids=Object.keys(SHUT),r={};for(const h of [6.5,7.2,7.9,8.5,19.9,20.5,22.5,22.95,23.2]){__setClock(null,h);updSky();
  const door=id=>{const t=LOC.city.inter.find(t=>t.label==='Go into the '+SHUT[id][0]);return t&&t.say?t.say():'(no door)';};
  r[h]={day:isDaytime(),open:ids.filter(id=>shopOpen(id)),closedL:CLOSED_L.visible,closed:CLOSED.visible,market:door('market'),cafe:door('cafe'),truck:(LOC.city.inter.find(t=>t.label==='Food truck')||{say:()=>'?'}).say()};}return r;}"""
async def hours(run):
    g = await begin(run, new_wb, 'ipad-landscape', 'p-hours', BASE)
    r = await g.ev(HOURS); probs = []
    LONG = {'market', 'flowers', 'clothes', 'toys', 'icecream', 'truck'}; SHORT = {'pets', 'cafe', 'bakery', 'library', 'salon'}
    for h, v in r.items():
        h = float(h); op = set(v['open']); lo = 7 <= h < 23; dy = 8 <= h < 20
        if (op & LONG) != (LONG if lo else set()) or (op & SHORT) != (SHORT if dy else set()) or v['day'] != dy or v['closedL'] == lo or v['closed'] == dy: probs.append(f'{h}: {v}')
        if not lo and '7:00' not in v['market']: probs.append(f'{h}: market door says {v["market"]!r}')
        if not lo and '7:00' not in v['truck']: probs.append(f'{h}: truck says {v["truck"]!r}')
        if not dy and '8:00' not in v['cafe']: probs.append(f'{h}: cafe door says {v["cafe"]!r}')
    # closing time inside: the Market at 23:00 and the Café at 20:00; buying in the Market at 22:30 works, at 23:10 says 7:00
    msgs = {}
    for shop, a, b in (('market', 22.9, 23.05), ('cafe', 19.9, 20.05), ('market', 19.9, 20.05)):
        await g.ev(f"()=>{{$('toast').classList.remove('show');__goto('{shop}');__setClock(null,{a});}}"); await g.step(30); await g.ev("()=>$('toast').classList.remove('show')")   # (the welcome toast stays up while the frames are stepped by hand; a closing message waits for it)
        await g.ev("()=>{window.__lastToast='';const t=$('toast');const o=new MutationObserver(()=>{window.__lastToast=t.textContent;});o.observe(t,{childList:true,subtree:true,characterData:true});window.__mo=o;}")
        await g.ev(f"()=>__setClock(null,{b})"); await g.step(10); msgs[f'{shop}@{b}'] = await g.ev("()=>{window.__mo.disconnect();return window.__lastToast;}")
    buy = await g.ev("""()=>{__goto('market');__setClock(null,22.5);openShop('market');const c0=S.coins;ACT.buy('apple');closePanel();const ok=S.coins<c0;__setClock(null,23.2);let msg='';const t=$('toast');openShop('market');const c1=S.coins;ACT.buy('apple');msg=t.textContent;closePanel();return {ok,blocked:S.coins===c1,msg};}""")
    if 'closing' not in msgs['market@23.05'] or '7:00' not in msgs['market@23.05']: probs.append(f"market closing message: {msgs['market@23.05']!r}")
    if 'closing' not in msgs['cafe@20.05'] or '8:00' not in msgs['cafe@20.05']: probs.append(f"cafe closing message: {msgs['cafe@20.05']!r}")
    if 'closing' in msgs['market@20.05']: probs.append(f"the market said closing at 20:00: {msgs['market@20.05']!r}")
    if not buy['ok'] or not buy['blocked'] or '7:00' not in buy['msg']: probs.append(f'buying: {buy}')
    await g.ev("()=>{__goto('city');__setClock(null,21.5);P.x=18;P.z=-4.5;P.yaw=0;P.pitch=.05;}"); await g.step(6); await g.shot('hours-2130-market-cafe', both=False)
    out('hours', not probs and not g.errors, f'{len(r)} hours checked; messages {msgs}; buying {buy}' + (f' | PROBLEMS {probs} {g.errors[:2]}' if probs or g.errors else ''))
    await run.close(g)

ADOPT = """(n)=>{__goto('pets');__setClock(null,12);const kinds=Object.keys(PET_TYPES);const r=[];$('toast').classList.remove('show');for(let i=0;i<n;i++){const k=kinds[i%kinds.length];closePanel();const old=$('petName');if(old)old.remove();openAdopt(k,PET_TYPES[k].cols[0]);
  const box=$('petName');if(!box){r.push('blocked: '+$('toast').textContent);continue;}box.value='ZZPet'+(S.pets.length+1);ACT.adopt();r.push(S.pets.length+':'+(S.pets[S.pets.length-1].stay?'home':'follow'));}return r;}"""
STATE = "()=>({n:S.pets.length,fol:S.pets.filter(d=>!d.stay).length,home:S.pets.filter(d=>petAtHome(d)).length,actors:PET_ACTORS.length,names:S.pets.map(d=>d.name+(d.stay?(petAtHome(d)?'@home':'@wait'):'')),coins:S.coins})"
async def pets(run):
    g = await begin(run, new_wb, 'ipad-landscape', 'p-pets', BASE); probs = []
    a = await g.ev(ADOPT, 11); s = await g.ev(STATE)
    if s['n'] != 10 or s['fol'] != 3 or s['home'] != 7 or not a[-1].startswith('blocked') or '10 pets' not in a[-1]: probs.append(f'adopting: {a} {s}')
    # My pets: a 4th follower is refused; one goes home, then another may follow
    await g.ev("()=>{__goto('city');__setClock(null,12);ACT.mypets();}"); await g.step(2)
    rows = await g.ev("()=>document.querySelectorAll('#card .petrow').length")
    t1 = await g.tap('#card [data-a="mpfol:5"]'); s1 = await g.ev(STATE); note1 = await g.ev("()=>$('card').querySelector('.note').textContent")
    await g.shot('mypets-card', both=True)
    t2 = await g.tap('#card [data-a="mphome:0"]'); t3 = await g.tap('#card [data-a="mpfol:5"]'); s2 = await g.ev(STATE)
    if rows != 10 or s1['fol'] != 3 or 'already' not in note1 or s2['fol'] != 3 or '@home' not in s2['names'][0] or '@' in s2['names'][5]: probs.append(f'my pets: rows {rows}, {t1} {s1} {note1!r}; {t2} {t3} {s2}')
    await g.ev("()=>closePanel()")
    # the pet card: Follow me on a home pet while 3 follow is refused
    pc = await g.ev("()=>{const p=PET_ACTORS.find(q=>petAtHome(q.d));openPet(p);ACT.pstay();const t=$('card').textContent;closePanel();return {t:t.slice(0,160),fol:S.pets.filter(d=>!d.stay).length};}")
    if 'already' not in pc['t'] or pc['fol'] != 3: probs.append(f'pet card: {pc}')
    # the yard: walk home and look at the pets waiting there
    await g.step(60)
    yard = await g.ev("""()=>{const j=LANE.mine,ps=PET_ACTORS.filter(p=>petAtHome(p.d));const out=ps.map(p=>{const q=lotBack(j,p.x,p.z);return [+q[0].toFixed(2),+q[1].toFixed(2),p.loc];});
      const [dx,dz]=lotPt(j,-17,-5.2);P.x=dx;P.z=dz;P.yaw=LANE_PLOTS[j].s<0?0:Math.PI;P.pitch=-.12;return {j,out};}""")
    await g.step(200); yard2 = await g.ev("()=>PET_ACTORS.filter(p=>petAtHome(p.d)).map(p=>{const q=lotBack(LANE.mine,p.x,p.z);return [+q[0].toFixed(2),+q[1].toFixed(2),inYardR(q[0],q[1])];})")
    await g.step(2, render=True); await g.shot('yard-home-pets', both=True)
    if any(not v[2] for v in yard2) or len(yard2) != 7: probs.append(f'home pets not in the yard: {yard2}')
    # Bring my pets: the 3 followers come, the others stay home
    fb = await g.ev("()=>{$('toast').classList.remove('show');ACT.fetchpets();return {fol:S.pets.filter(d=>!d.stay).length,home:S.pets.filter(d=>petAtHome(d)).length,t:$('toast').textContent};}")
    if fb['fol'] != 3 or fb['home'] != 7: probs.append(f'bring my pets: {fb}')
    # saved and loaded again: everything kept
    sv = await g.ev("()=>{saveLocal();return localStorage.getItem('cozytown-save-1');}")
    out('pets', not probs and not g.errors, f'adopt {a}; my pets rows {rows}, refusal note {note1!r}; after swap {s2["names"]}; pet card {pc["t"][-90:]!r}; yard spots (old yard frame) {yard2}; bring {fb}' + (f' | PROBLEMS {probs} {g.errors[:2]}' if probs or g.errors else ''))
    await run.close(g)
    g = await run.open(new_wb, 'web', 'ipad-landscape', 'light', 'p-pets-reload', save=json.loads(sv))
    from night3 import start_from_save
    from crawl import INSTR
    await start_from_save(g); await g.ev(INSTR); await g.step(10); s3 = await g.ev(STATE)
    out('pets-reload', s3['n'] == 10 and s3['fol'] == 3 and s3['home'] == 7 and not g.errors, f'{s3} {g.errors[:2]}')
    await run.close(g)
    # an old version (the live file) loads the 10-pet save: no errors, 10 pets, 3 follow
    o = await run.open(live_w, 'web', 'ipad-landscape', 'light', 'p-pets-old', save=json.loads(sv)); await start_from_save(o); await o.ev(INSTR); await o.step(30)
    so = await o.ev("()=>({n:S.pets.length,actors:PET_ACTORS.length,fol:S.pets.filter(d=>!d.stay).length,adopt:(()=>{$('toast').classList.remove('show');openAdopt('dog',PET_TYPES.dog.cols[0]);const t=$('toast').textContent;const c=!!$('petName');closePanel();return [t,c];})()})")
    out('pets-old-version', so['n'] == 10 and so['actors'] == 10 and so['fol'] == 3 and not o.errors, f'{so} {o.errors[:2]}')
    await run.close(o)
    return json.loads(sv)

async def give(run, save):
    g = await run.open(new_wb, 'web', 'iphone-portrait', 'dark', 'p-give', save=save)
    from night3 import start_from_save
    from crawl import INSTR
    await start_from_save(g); await g.ev(INSTR); await g.step(10); probs = []
    s0 = await g.ev(STATE)
    await g.ev("()=>{__goto('pets');__setClock(null,12);openShop('pets');}"); await g.step(2)
    t1 = await g.tap('#card [data-a="giveaway"]'); await g.step(2); rows = await g.ev("()=>document.querySelectorAll('#card .petrow').length"); await g.shot('give-list', both=True)
    t2 = await g.tap('#card [data-a="gvpick:4"]'); await g.step(2)
    cd = await g.ev("()=>({t:$('card').textContent,img:(document.querySelector('#card img.gvpic')||{}).src||'',w:(document.querySelector('#card img.gvpic')||{}).naturalWidth||0})")
    await g.shot('give-confirm', both=True)
    t3 = await g.tap('#card [data-a="giveaway"]'); s1 = await g.ev(STATE)   # "No, keep": back to the list, nothing lost
    t4 = await g.tap('#card [data-a="gvpick:4"]'); t5 = await g.tap('#card [data-a="gvyes"]'); await g.step(4); s2 = await g.ev(STATE); msg = await g.ev("()=>$('toast').textContent")
    gone = s0['names'][4]
    if rows != 10 or s1['n'] != 10 or s2['n'] != 9 or s2['actors'] != 9 or s2['coins'] != s0['coins'] or any(gone.split('@')[0] == n.split('@')[0] for n in s2['names']): probs.append(f'{s0} {s1} {s2}')
    if gone.split('@')[0] not in cd['t'] or not cd['img'].startswith('data:image') or cd['w'] < 50: probs.append(f'confirm card: {cd["t"][:120]!r} img {cd["img"][:30]} w {cd["w"]}')
    ad = await g.ev("()=>{openAdopt('cat',PET_TYPES.cat.cols[0]);const ok=!!$('petName');closePanel();return ok;}")
    if not ad: probs.append('no room to adopt after giving one away')
    out('give', not probs and not g.errors, f'taps {t1} {t2} {t3} {t4} {t5}; list rows {rows}; card {cd["t"][:110]!r}, picture {cd["w"]} px; gave {gone}: {s0["n"]} -> {s2["n"]} pets, coins {s0["coins"]} -> {s2["coins"]}; Ms. Paws: {msg!r}; adopt again possible {ad}' + (f' | PROBLEMS {probs} {g.errors[:2]}' if probs or g.errors else ''))
    await run.close(g)

async def two(run, save):
    from night3 import start_from_save
    from crawl import INSTR
    sa = dict(save, name='ZZTEST-PA', pid='zzpetaaa'); sb = dict(save, name='ZZTEST-PB', pid='zzpetbbb')
    A = await run.open(new_wb, 'web', 'ipad-landscape', 'light', 'p-two-A', save=sa); await start_from_save(A); await A.ev(INSTR)
    B = await run.open(new_wb, 'web', 'pc-1366', 'light', 'p-two-B', save=sb); await start_from_save(B); await B.ev(INSTR)
    C = await run.open(live_w, 'web', 'pc-1366', 'light', 'p-two-old', save=dict(sb, name='ZZTEST-PC', pid='zzpetccc')); await start_from_save(C); await C.ev(INSTR)
    for g in (A, B, C): await g.ev("()=>{__goto('city');__setClock(null,12);P.x=0;P.z=-4;}")
    seen = {}
    for _ in range(40):
        for g in (A, B, C): await g.step(3)
        await asyncio.sleep(0.25)
        seen = {n: await g.ev("()=>[...MP.peers.values()].map(a=>[a.nm,(a.pets||[]).length])") for n, g in (('A', A), ('B', B), ('old', C))}
        if all(len(v) >= 2 and all(c == 3 for _, c in v) for v in seen.values()): break
    ok = all(len(v) >= 2 and all(c == 3 for _, c in v) for v in seen.values())
    out('two-players', ok and not (A.errors or B.errors or C.errors), f'each sees the others with their 3 following pets: {seen} {A.errors[:1]}{B.errors[:1]}{C.errors[:1]}')
    for g in (A, B, C): await run.close(g)

FPS = """(sec)=>new Promise(res=>{let n=0,t0=performance.now();const ts=[];const f=t=>{n++;ts.push(t);if(t-t0<sec*1000)requestAnimationFrame(f);else{const d=[];for(let i=1;i<ts.length;i++)d.push(ts[i]-ts[i-1]);d.sort((a,b)=>a-b);
  res({fps:+(n/((t-t0)/1000)).toFixed(1),p50:+d[Math.floor(d.length*.5)].toFixed(1),p95:+d[Math.floor(d.length*.95)].toFixed(1)});}};requestAnimationFrame(f);})"""
async def fps(run, save):
    """2 players x 10 pets (new) against 2 players x 3 pets (the live game), both on the iPad screen in the town by your yard, drawing for real.
    The container draws with SwiftShader (on the CPU, no graphics chip), so the numbers are for comparing, not a real iPad's frame rate.
    Also the game's own work per frame (frame() without drawing), which does not depend on the graphics chip."""
    from night3 import start_from_save
    from crawl import INSTR
    res = {}
    for label, wb, sv in (('live, 2 players x 3 pets', live_w, dict(save, pets=[d for d in save['pets'] if not d.get('stay')][:3])), ('new, 2 players x 10 pets', new_wb, save)):
        gs = []
        for nm in ('ZZTEST-FA', 'ZZTEST-FB'):
            g = await run.open(wb, 'web', 'ipad-landscape', 'light', 'p-fps-' + nm, save=dict(sv, name=nm, pid=nm.lower())); await start_from_save(g); await g.ev(INSTR); gs.append(g)
        for g in gs: await g.ev("()=>{__setClock(null,12);__goto('city');const j=LANE.mine,[dx,dz]=lotPt(j,-17,-5.2);P.x=dx;P.z=dz;P.yaw=LANE_PLOTS[j].s<0?0:Math.PI;P.pitch=-.12;}")
        for _ in range(30):
            for g in gs: await g.step(2)
            await asyncio.sleep(0.2)
        g = gs[0]
        cnt = await g.ev("()=>({pets:PET_ACTORS.filter(p=>p.g.visible).length,peerPets:[...MP.peers.values()].reduce((s,a)=>s+(a.pets||[]).length,0)})")
        work = await g.ev("""()=>{const real=renderer.render;renderer.render=()=>{};const t0=performance.now();for(let i=0;i<200;i++){window.__t=Math.max(window.__t||0,performance.now())+33;frame(window.__t);}const a=(performance.now()-t0)/200;renderer.render=real;
          const gl=renderer.getContext();renderer.render(scene,camera);const calls=renderer.info.render.calls,tris=renderer.info.render.triangles;const t1=performance.now();for(let i=0;i<30;i++){renderer.render(scene,camera);gl.finish();}const b=(performance.now()-t1)/30;
          return {update:+a.toFixed(2),draw:+b.toFixed(1),calls,tris,inView:PET_ACTORS.filter(p=>p.g.visible&&inView(p.x,p.z,.5)).length};}""")
        await g.ev("()=>{window.__loop.manual=false;}"); await gs[1].ev("()=>{window.__loop.manual=false;}")
        cdp = await g.ctx.new_cdp_session(g.page); await cdp.send('Emulation.setCPUThrottlingRate', {'rate': 4})
        f4 = await g.ev(FPS, 10); await cdp.send('Emulation.setCPUThrottlingRate', {'rate': 1}); f1 = await g.ev(FPS, 10)
        res[label] = dict(cnt, **work, fps=f1, fps_cpu4x=f4)
        await g.shot('fps-' + label.split(',')[0], both=False)
        for x in gs: await run.close(x)
    a, b = res['live, 2 players x 3 pets'], res['new, 2 players x 10 pets']
    out('fps', b['pets'] >= 10 and b['peerPets'] >= 3, json.dumps(res))

async def main():
    os.makedirs(OUT, exist_ok=True)
    async with Run('pet1', OUT) as run:
        if 'hours' in PARTS: await hours(run)
        save = None
        if 'pets' in PARTS: save = await pets(run)
        if save is None: save = json.load(open(os.path.join(OUT, 'save10.json')))
        else: json.dump(save, open(os.path.join(OUT, 'save10.json'), 'w'))
        if 'give' in PARTS: await give(run, save)
        if 'two' in PARTS: await two(run, save)
        if 'fps' in PARTS: await fps(run, save)
    json.dump(RES, open(os.path.join(OUT, 'probe-results.json'), 'w'), ensure_ascii=False, indent=1)
asyncio.run(main())
