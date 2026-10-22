"""Cozy Town check, stage 'night3' (check version 5, 16/17 Oct 2026): lines N1 to N14 for the night-3 jobs.
Every line starts as FAIL and passes only on proof measured in a test copy. Nothing here is ever made weaker.
The real date is faked by replacing the game's ONE date function (realDate) in the test copy, exactly as the plan says."""
import asyncio, json, os, re, time
from harness import md5b
from crawl import INSTR
from checks import start_from_save, weight_static, compare_static, parse_limits

HERE = os.path.dirname(os.path.abspath(__file__))
NEW_FOODS = ['sushi', 'riceball', 'burger', 'fries', 'hotdog', 'taco', 'noodles', 'dumplings', 'lollipop', 'pudding']
NEW_KINDS = ['pomchi', 'pug', 'sausage', 'capybara', 'duck', 'owl']
BREEDS = ['pomchi', 'pug', 'sausage']
RE_DATE = re.compile(r'function realDate\(\)\{return new Date\(\);\}')

def fake_date_build(build_bytes, iso):
    """A test copy whose single date function always says `iso` (the plan's way to fake the real date; the game itself has no date setting)."""
    s = build_bytes.decode()
    if not RE_DATE.search(s): return None
    return RE_DATE.sub('function realDate(){return new Date(%s);}' % json.dumps(iso), s, count=1).encode()

def fx(fixtures, name):
    for n, f in fixtures:
        if n == name: return f
    return None

async def begin(run, build, prof, name, save, theme='light'):
    g = await run.open(build, 'web', prof, theme, name, save=save)
    await start_from_save(g); await g.ev(INSTR); await g.step(10)
    return g

def L(cid, name, ok, detail): return [cid, name, bool(ok) if ok is not None else None, detail]

async def guarded(fn, *a):
    try: return await fn(*a)
    except Exception as e:
        import traceback; traceback.print_exc()
        return False, 'the test itself failed: ' + repr(e)[:260]

# ---------------- N1 holidays ----------------
HOL_ST = "()=>({cur:typeof HOL!=='undefined'?HOL.cur:'NO HOL',n:typeof HOL!=='undefined'?HOL.n|0:-1,open:typeof SPOOK!=='undefined'?!!SPOOK.open():'NO SPOOK',ok:typeof SPOOK!=='undefined'?!!SPOOK.ok():null})"
async def n1(run, new_wb, FIX):
    save = fx(FIX, 'save-prenight3-pets.json'); det = []; probs = []
    g = await begin(run, new_wb, 'ipad-landscape', 'n1-holidays', save)
    if not await g.ev("()=>typeof realDate==='function'&&typeof HOL!=='undefined'&&typeof SPOOK!=='undefined'&&typeof holCheck==='function'"):
        await run.close(g); return False, 'the game has no realDate()/HOL/SPOOK/holCheck yet'
    async def at(iso, hour, label):
        await g.ev("(d)=>{realDate=()=>new Date(d);__setClock(null,%s);holCheck();}" % hour, iso); await g.step(8); st = await g.ev(HOL_ST)
        await g.ev("()=>__goto('city')"); await g.ev("()=>{P.x=-22;P.z=12;P.yaw=Math.PI;P.pitch=-.1;}"); await g.step(3)
        await g.shot('holiday-' + label, both=False); return st
    s = await at('2026-10-25T12:00:00', 12, 'halloween-day')
    det.append(f"25 Oct day: {s['cur']} ({s['n']} pieces), spooky path open {s['open']}")
    if s['cur'] != 'halloween' or s['n'] <= 0 or s['open']: probs.append('25 Oct day')
    s = await at('2026-10-25T20:00:00', 19.5, 'halloween-night')
    det.append(f"25 Oct 19:30: {s['cur']}, spooky path open {s['open']}")
    if s['cur'] != 'halloween' or not s['open']: probs.append('25 Oct night')
    # jump scares: a spot fires once per night, a second visit does nothing; never in bed or in a scene
    boo = await g.ev("""()=>{const sp=SPOOK.spots;if(!sp||sp.length<3)return {err:'fewer than 3 spots: '+(sp?sp.length:0)};__goto('city');__setClock(null,19.5);window.__boo=0;
      const f0=window.floatText;window.floatText=function(t){if(/BOO|Rattle|Braaains|Flap|Hee/.test(String(t)))window.__boo++;return f0.apply(this,arguments);};
      const q=sp[0];P.x=q.x;P.z=q.z;P.yaw=0;__run(60);const a=window.__boo,f1=S.spook?JSON.stringify(S.spook):'';
      P.x+=3;__run(20);P.x-=3;__run(60);const b=window.__boo;
      P.sit={bed:1,x:P.x,z:P.z,yaw:0};const okBed=SPOOK.ok();P.sit=null;const c0=CUT;CUT={test:1};const okCut=SPOOK.ok();CUT=c0;
      __run(1);return {a,b,okBed,okCut,f1};}""")
    if boo.get('err'): probs.append(boo['err']); det.append(boo['err'])
    else:
        det.append(f"spot 1: BOO {boo['a']} time(s) on the first visit, {boo['b']} after a second visit; scare allowed in bed: {boo['okBed']}, in a scene: {boo['okCut']}")
        if boo['a'] != 1 or boo['b'] != 1 or boo['okBed'] or boo['okCut']: probs.append('jump scare rules')
    await g.shot('spooky-path', both=False)
    s = await at('2026-12-20T12:00:00', 12, 'christmas'); det.append(f"20 Dec: {s['cur']} ({s['n']} pieces)")
    if s['cur'] != 'xmas' or s['n'] <= 0: probs.append('20 Dec')
    s = await at('2027-03-28T12:00:00', 12, 'easter'); det.append(f"28 Mar 2027: {s['cur']} ({s['n']} pieces)")
    if s['cur'] != 'easter' or s['n'] <= 0: probs.append('28 Mar 2027')
    s = await at('2027-02-10T12:00:00', 12, 'valentine'); det.append(f"10 Feb 2027: {s['cur']} ({s['n']} pieces)")
    if s['cur'] != 'valentine' or s['n'] <= 0: probs.append('10 Feb 2027')
    s = await at('2027-05-10T12:00:00', 12, 'plain-day'); det.append(f"10 May: {s['cur']} ({s['n']} pieces)")
    if s['cur'] is not None or s['n'] != 0: probs.append('10 May shows something')
    # the edges of the windows
    edges = []
    for iso, want in (('2026-09-30T23:00:00', None), ('2026-10-01T00:10:00', 'halloween'), ('2026-10-31T23:00:00', 'halloween'), ('2026-11-01T00:10:00', None),   # run 4: Halloween is all of October
                      ('2026-12-01T00:10:00', 'xmas'), ('2026-12-31T23:00:00', 'xmas'), ('2027-01-01T00:10:00', None), ('2027-01-31T23:00:00', None), ('2027-02-01T00:10:00', 'valentine'), ('2027-02-28T23:00:00', 'valentine'),
                      ('2027-03-01T00:10:00', 'easter'), ('2027-03-31T23:00:00', 'easter'), ('2027-04-01T00:10:00', None), ('2026-04-01T00:10:00', 'easter'), ('2026-04-30T23:00:00', 'easter'), ('2026-05-01T00:10:00', None)):   # run 4, job 11: whole months (Easter Sunday 28 Mar 2027, 5 Apr 2026)
        await g.ev("(d)=>{realDate=()=>new Date(d);holCheck();}", iso); await g.step(3); c = await g.ev("()=>HOL.cur")
        if c != want: edges.append(f'{iso[:10]}: {c} (wanted {want})')
    if edges: probs.append('window edges: ' + '; '.join(edges))
    errs = g.errors[:]
    await run.close(g)
    if errs: probs.append(f'browser errors: {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N2 Rosie is silent ----------------
TONES = "if(!window.__tn0){window.__tn0=1;window.__tn=0;const t0=tone;tone=function(){window.__tn++;return t0.apply(this,arguments);};}window.__tn=0;"
async def n2(run, new_wb, FIX):
    save = fx(FIX, 'save-prenight3-pets.json'); probs = []; det = []
    g = await begin(run, new_wb, 'ipad-landscape', 'n2-rosie', save)
    await g.ev("()=>{SET.sound=true;AC=AC||{state:'running',currentTime:0,createOscillator(){return{type:'',frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},start(){},stop(){}}},createGain(){return{gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}},destination:{}};}")   # sound on, with a stand-in for the audio engine so tone() really runs
    r = await g.ev("()=>{" + TONES + "__goto('city');const f=FRIEND_ACTORS.find(a=>a.d.id==='rosie');f.loc='city';f.mode='walk';f.x=P.x-1.5;f.z=P.z-1.5;openFriend(f);return window.__tn;}")
    det.append(f'open Rosie: {r} sounds')
    if r: probs.append('opening Rosie made a sound')
    t = await g.tap('#card [data-a="fchat"]'); await g.step(3); r2 = await g.ev("()=>window.__tn"); det.append(f'💬 Chat with Rosie: {r2} sounds (tap {t})')
    if r2 or t != 'ok': probs.append('chatting with Rosie made a sound')
    await g.ev("()=>closePanel()")
    r3 = await g.ev("()=>{window.__tn=0;askJob();return window.__tn;}"); det.append(f"Rosie's job message arrives: {r3} sounds")
    if r3: probs.append("Rosie's message made a sound")
    r4 = await g.ev("()=>new Promise(res=>{window.__tn=0;rosieLater('hi there',10);setTimeout(()=>res(window.__tn),120);})"); det.append(f'rosieLater: {r4} sounds')
    if r4: probs.append('rosieLater made a sound')
    r5 = await g.ev("()=>{window.__tn=0;showNote('📱 Rosie','x',false,'💬','ro');return window.__tn;}"); det.append(f"showNote for Rosie: {r5} sounds")
    if r5: probs.append('showNote(ro) made a sound')
    r6 = await g.ev("()=>{window.__tn=0;const f=FRIEND_ACTORS.find(a=>a.d.id==='theo');f.loc='city';f.mode='walk';f.x=P.x-1.5;f.z=P.z+1.5;openFriend(f);const a=window.__tn;closePanel();window.__tn=0;chefSay('Pizza!');const b=window.__tn;closePanel();window.__tn=0;addMsg('cl','cl','hi',{});showNote('🎨 New client!','x',false,'🎨','cl');SFX.ding();return [a,b,window.__tn];}")
    det.append(f'Theo: {r6[0]} sounds; the chef: {r6[1]}; a client note + ding: {r6[2]}')
    if not r6[0] or not r6[1] or not r6[2]: probs.append('other people lost their sound')
    errs = g.errors[:]; await run.close(g)
    if errs: probs.append(f'browser errors: {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N3 friends in view, pets apart ----------------
VIEW_JS = """()=>{const out={fr:[],pets:[]},fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),v=new THREE.Vector3();
  for(const f of FRIEND_ACTORS){if(f.mode!=='follow'||f.loc!==CUR.id)continue;v.set(f.x,1.2,f.z).project(camera);const dx=f.x-P.x,dz=f.z-P.z,d=Math.hypot(dx,dz),fwd=(dx*fx+dz*fz)/(d||1);
    out.fr.push({n:f.d.name,x:+f.x.toFixed(2),z:+f.z.toFixed(2),d:+d.toFixed(2),inView:v.z<1&&Math.abs(v.x)<1&&Math.abs(v.y)<1.1,fwd:+fwd.toFixed(2),moving:!!f.moving,fan:f.fan?f.fan.map(v=>+v.toFixed(2)):null,ndc:[+v.x.toFixed(2),+v.y.toFixed(2)]});}
  out.P=[+P.x.toFixed(2),+P.z.toFixed(2),+P.yaw.toFixed(2)];out.fanOn=!!(typeof FAN!=='undefined'&&FAN.on);
  for(const p of PET_ACTORS){if(p.loc!==CUR.id||p.d.stay)continue;out.pets.push({n:p.d.name,x:+p.x.toFixed(2),z:+p.z.toFixed(2),d:+Math.hypot(p.x-P.x,p.z-P.z).toFixed(2)});}
  return out;}"""
def pairs_min(pts):
    m = 99
    for i in range(len(pts)):
        for j in range(i + 1, len(pts)):
            m = min(m, ((pts[i]['x'] - pts[j]['x']) ** 2 + (pts[i]['z'] - pts[j]['z']) ** 2) ** .5)
    return m
async def n3(run, new_wb, FIX):
    save = fx(FIX, 'save-prenight3-pets.json'); probs = []; det = []
    g = await begin(run, new_wb, 'ipad-landscape', 'n3-friends', save)
    await g.ev("()=>{__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
    await g.step(10)
    async def walk_and_stop(frames):
        await g.page.keyboard.down('KeyW'); await g.step(frames); await g.page.keyboard.up('KeyW'); await g.step(2)
        await g.step(140)   # 7 s of game time standing still
        return await g.ev(VIEW_JS)
    for k in range(2):
        st = await walk_and_stop(50)
        fr = st['fr']; n = len(fr)
        if n < 4: probs.append(f'only {n} friends following')
        bad_view = [f['n'] for f in fr if not f['inView'] or f['fwd'] <= 0]
        if bad_view: probs.append(f'walk {k + 1}: not in view or behind: {bad_view}; you at {st.get("P")}, fan on {st.get("fanOn")}, friends {[(f["n"], f["x"], f["z"], "fwd", f["fwd"], "spot", f.get("fan"), "screen", f.get("ndc"), "moving" if f["moving"] else "still") for f in fr]}')
        md = pairs_min(fr) if n > 1 else 9
        if md < 1.2 - .02: probs.append(f'walk {k + 1}: friends only {md:.2f} m apart')
        allp = fr + st['pets'] + [{'x': 0, 'z': 0}]   # pets vs friends vs pets vs you (you = P)
        pm = 99
        P = await g.ev("()=>[P.x,P.z]")
        for p in st['pets']:
            pm = min(pm, ((p['x'] - P[0]) ** 2 + (p['z'] - P[1]) ** 2) ** .5)
            for q in fr + st['pets']:
                if q is p: continue
                pm = min(pm, ((p['x'] - q['x']) ** 2 + (p['z'] - q['z']) ** 2) ** .5)
        if st['pets'] and pm < .8 - .03: probs.append(f'walk {k + 1}: a pet only {pm:.2f} m from you, a friend or another pet')
        det.append(f"stop {k + 1}: {n} friends, {sum(1 for f in fr if f['inView'] and f['fwd'] > 0)} in view in front, {md:.2f} m apart; {len(st['pets'])} pets, closest gap {pm:.2f} m")
        await g.shot(f'friends-in-view-{k + 1}', both=False)
        # turn right round and stand still: after ~1.5 s they walk back into view
        await g.ev("()=>{P.yaw+=Math.PI;}"); await g.step(110)
        st2 = await g.ev(VIEW_JS); bad2 = [f['n'] for f in st2['fr'] if not f['inView'] or f['fwd'] <= 0]
        det.append(f'after turning round: {len(st2["fr"]) - len(bad2)} of {len(st2["fr"])} back in view')
        if bad2: probs.append(f'turned round {k + 1}: still out of view: {bad2}')
        await g.shot(f'friends-after-turn-{k + 1}', both=False)
    errs = g.errors[:]; await run.close(g)
    if errs: probs.append(f'browser errors: {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N4 walkers never closer than 0.5 m ----------------
async def n4(run, new_wb, FIX):
    save = fx(FIX, 'save-prenight3-pets.json')
    g = await begin(run, new_wb, 'ipad-landscape', 'n4-walkers', save)
    r = await g.ev("""()=>{__goto('city');__setClock(null,11);P.x=-20;P.z=-5.6;for(const w of WALKERS)w.init();const real=renderer.render;renderer.render=()=>{};let mn=99,pair='',n=0,frames=0;const t0=performance.now();
      try{while(S.time<14&&frames<9000){__run(1);frames++;const W=WALKERS.filter(w=>w.state!=='home');n=Math.max(n,W.length);
        for(let i=0;i<W.length;i++)for(let j=i+1;j<W.length;j++){const d=Math.hypot(W[i].x-W[j].x,W[i].z-W[j].z);if(d<mn){mn=d;pair=i+'/'+j+' at '+W[i].x.toFixed(1)+','+W[i].z.toFixed(1)+' h'+S.time.toFixed(2);}}}}
      finally{renderer.render=real;}return {mn:+mn.toFixed(3),pair,n,frames,hours:3,ms:Math.round(performance.now()-t0)};}""")
    await g.shot('walkers-give-way', both=False)
    errs = g.errors[:]; await run.close(g)
    ok = r['mn'] >= .5 and r['n'] >= 10 and not errs
    return ok, f"{r['frames']} frames (11:00 to 14:00), up to {r['n']} walkers out, closest two walkers {r['mn']} m ({r['pair']})" + (f'; browser errors: {errs[:2]}' if errs else '')

# ---------------- N5 benches ----------------
async def n5(run, new_wb, FIX):
    save = fx(FIX, 'save-prenight3-pets.json'); probs = []; det = []
    g = await begin(run, new_wb, 'ipad-landscape', 'n5-benches', save)
    if not await g.ev("()=>typeof BENCHES!=='undefined'&&Array.isArray(BENCHES)&&typeof seatTaken==='function'"):
        await run.close(g); return False, 'the game has no BENCHES list / seatTaken() yet'
    r = await g.ev("""()=>{const out=[];let ok=0,taken=0,bad=[];__setClock(null,12);
      for(const b of BENCHES){if(!b.seats||b.seats.length!==2){bad.push(b.id+': '+(b.seats?b.seats.length:0)+' seats');continue;}
        for(let i=0;i<2;i++){const s=b.seats[i];if(!LOC[b.loc]){bad.push(b.id+' in unknown area');continue;}
          __goto(b.loc);P.sit=null;if(seatTaken(b,i)){taken++;continue;}const t=s.tg;if(!t||typeof t.act!=='function'){bad.push(b.id+'/'+i+': no sit target');continue;}
          P.x=s.x+Math.sin(s.yaw)*.6;P.z=s.z+Math.cos(s.yaw)*.6;P.yaw=s.yaw;__run(1);t.act();__run(1);
          if(P.sit&&Math.hypot(P.x-s.x,P.z-s.z)<.06&&Math.abs(((P.yaw-s.yaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI)<.05)ok++;else bad.push(b.id+'/'+i+': sit '+!!P.sit+' at '+(P.sit?Math.hypot(P.x-s.x,P.z-s.z).toFixed(2):'-')+' m');
          standUp();P.sit=null;}}
      return {benches:BENCHES.length,areas:[...new Set(BENCHES.map(b=>b.loc))],ok,taken,bad:bad.slice(0,8)};}""")
    det.append(f"{r['benches']} benches in {r['areas']}; {r['ok']} seats sat on, {r['taken']} taken by someone sitting there")
    if r['benches'] < 17 or r['bad'] or r['ok'] + r['taken'] != r['benches'] * 2: probs.append(f"seats: {r['bad']}")
    # eating from the bag while sitting
    e = await g.ev("""()=>{const b=BENCHES.find(q=>q.loc==='city'&&!seatTaken(q,0));__goto('city');__setClock(null,12);const s=b.seats[0];P.x=s.x+Math.sin(s.yaw)*.6;P.z=s.z+Math.cos(s.yaw)*.6;P.yaw=s.yaw;s.tg.act();__run(1);
      S.bag.apple=(S.bag.apple||0)+1;S.hunger=50;openBag();const h0=S.hunger;ACT.eat('apple');__run(6);const r={sat:!!P.sit,ate:S.hunger>h0,bagOpen:UI.open};closePanel();standUp();return r;}""")
    det.append(f"eating on a bench: still sitting {e['sat']}, ate {e['ate']}")
    if not (e['sat'] and e['ate']): probs.append('eating made you stand up (or did not work)')
    await g.shot('bench-sit', both=False)
    errs = g.errors[:]; await run.close(g)
    # two players: the second never gets the same seat, and sees the first one sitting
    A = await begin(run, new_wb, 'ipad-landscape', 'n5-A', dict(save, name='ZZTEST-SITA'))
    B = await begin(run, new_wb, 'pc-1366', 'n5-B', dict(save, name='ZZTEST-SITB', px=-18.5))
    for _ in range(6): await A.step(8); await B.step(8); await asyncio.sleep(.25)
    sitA = await A.ev("""()=>{const b=BENCHES.find(q=>q.loc==='city'&&!seatTaken(q,0)&&!seatTaken(q,1));__goto('city');__setClock(null,12);const s=b.seats[0];P.x=s.x+Math.sin(s.yaw)*.6;P.z=s.z+Math.cos(s.yaw)*.6;P.yaw=s.yaw;s.tg.act();__run(4);return {id:b.id,x:P.x,z:P.z,sit:!!P.sit};}""")
    for _ in range(8): await A.step(6); await B.step(6); await asyncio.sleep(.25)
    seen = await B.ev("""(nm)=>{const a=[...MP.peers.values()].find(p=>p.nm===nm);if(!a)return {found:false};return {found:true,st:a.st|0,legs:a.av?+a.av.legs[0].rotation.x.toFixed(2):null,x:a.x,z:a.z};}""", 'ZZTEST-SITA')
    tryB = await B.ev("""(id)=>{const b=BENCHES.find(q=>q.id===id);__goto('city');__setClock(null,12);window.__lastToast='';const s=b.seats[0];P.x=s.x+Math.sin(s.yaw)*.6;P.z=s.z+Math.cos(s.yaw)*.6;P.yaw=s.yaw;s.tg.act();__run(4);
      const d0=Math.hypot(P.x-s.x,P.z-s.z),s1=b.seats[1],d1=Math.hypot(P.x-s1.x,P.z-s1.z);return {sit:!!P.sit,onSeat0:!!P.sit&&d0<.06,onSeat1:!!P.sit&&d1<.06,toast:window.__lastToast||''};}""", sitA['id'])
    await B.shot('bench-other-player-sits', both=False)
    det.append(f"two players: A sits on seat 1 of {sitA['id']}; B sees A sitting (sit flag {seen.get('st')}, legs {seen.get('legs')}); B's try for the same seat: seat 1 {tryB['onSeat0']}, seat 2 {tryB['onSeat1']}, toast {tryB['toast'][:30]!r}")
    if not sitA['sit'] or not seen.get('found') or seen.get('st') != 1 or seen.get('legs') is None or seen['legs'] > -1.0: probs.append('the other player does not see the sit pose')
    if tryB['onSeat0'] or not (tryB['onSeat1'] or 'full' in tryB['toast'].lower()): probs.append('two players could share a seat')
    errs += A.errors + B.errors; await run.close(A); await run.close(B)
    if errs: probs.append(f'browser errors: {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N6 grandmas ----------------
async def n6(run, new_wb, FIX):
    save = fx(FIX, 'save-prenight3-pets.json'); probs = []; det = []
    g = await begin(run, new_wb, 'ipad-landscape', 'n6-grandmas', save)
    if not await g.ev("()=>typeof GRAN!=='undefined'&&Array.isArray(GRAN.benches)&&typeof wxForce==='function'"):
        await run.close(g); return False, 'the game has no GRAN benches / wxForce() yet'
    r = await g.ev("""()=>{const res={};const look=()=>{__run(6);
        return {out:GRAN.benches.filter(b=>b.g.every(q=>q.p.root.visible)).length,full:GRAN.benches.filter(b=>seatTaken(b.b,0)&&seatTaken(b.b,1)).length,free:GRAN.benches.filter(b=>!seatTaken(b.b,0)&&!seatTaken(b.b,1)).length};};
      __goto('city');wxForce('sunny');__setClock(null,12);res.day=look();__setClock(null,22);res.night=look();__setClock(null,12);wxForce('rain');res.rain=look();wxForce('snow');res.snow=look();wxForce(null);__setClock(null,12);res.n=GRAN.benches.length;
      res.looks=new Set(GRAN.benches.flatMap(b=>b.g.map(q=>JSON.stringify(q.look)))).size;res.grans=GRAN.benches.reduce((a,b)=>a+b.g.length,0);
      const b=GRAN.benches[0];__setClock(null,22);look();const s=b.b.seats[0];P.x=s.x+Math.sin(s.yaw)*.6;P.z=s.z+Math.cos(s.yaw)*.6;P.yaw=s.yaw;s.tg.act();look();res.nightSit=!!P.sit;standUp();P.sit=null;__setClock(null,12);look();return res;}""")
    det.append(f"{r['n']} grandma benches, {r['grans']} grandmas ({r['looks']} different looks); 12:00 dry: {r['day']['out']} benches out, {r['day']['full']} full; 22:00: {r['night']['out']} out, {r['night']['free']} free, you can sit {r['nightSit']}; rain: {r['rain']['out']} out; snow: {r['snow']['out']} out")
    if r['n'] < 3 or r['grans'] < 6 or r['looks'] < 6: probs.append('fewer than 3 benches with 2 different grandmas each')
    if r['day']['out'] != r['n'] or r['day']['full'] != r['n']: probs.append('by day the grandmas are not all out / their bench is not full')
    if r['night']['out'] or r['night']['free'] != r['n'] or not r['nightSit']: probs.append('at night the grandmas did not go inside / the bench is not free')
    if r['rain']['out'] or r['snow']['out']: probs.append('in rain or snow the grandmas stay out')
    await g.ev("()=>{__setClock(null,12);wxForce('sunny');P.x=GRAN.benches[0].b.x+Math.sin(GRAN.benches[0].b.ry)*3.2;P.z=GRAN.benches[0].b.z+Math.cos(GRAN.benches[0].b.ry)*3.2;P.yaw=GRAN.benches[0].b.ry;P.pitch=-.05;}"); await g.step(30); await g.shot('grandmas', both=False)
    await g.ev("()=>wxForce(null)")
    errs = g.errors[:]; await run.close(g)
    if errs: probs.append(f'browser errors: {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N7 kitchen ----------------
async def n7(run, new_wb, FIX):
    save = fx(FIX, 'save-prenight3-pets.json'); probs = []; det = []
    g = await begin(run, new_wb, 'ipad-landscape', 'n7-kitchen', save)
    if not await g.ev("()=>typeof kitSnap==='function'"):
        await run.close(g); return False, 'the game has no kitSnap() yet'
    r = await g.ev("""()=>{__goto('home');const L=LOC.home;S.home.items=S.home.items.filter(it=>!/^k/.test(it.u));rebuildHome();
      const st={u:'k1',t:'stove',c:null,x:-2,z:-4.65,r:0};S.home.items.push(st);addHomeItem(st);
      const fr=kitSnap({u:'k2',t:'fridge',c:'#f4f6fb'},-1.05,-4.5,0,HOMEX),sk=kitSnap({u:'k3',t:'sink',c:'#ffffff'},-2.95,-4.55,0,HOMEX),far=kitSnap({u:'k4',t:'fridge',c:'#f4f6fb'},1.5,-2,0,HOMEX);
      const gapF=fr.x-.4-(st.x+.4),gapS=(st.x-.4)-(sk.x+.4),frontF=(fr.z+.35)-(st.z+.35),frontS=(sk.z+.275)-(st.z+.35);
      const wall=kitSnap({u:'k5',t:'stove',c:null},0,-4.4,0,HOMEX),wallGap=(-HOMED)-(wall.z-.35);
      return {gapF:+gapF.toFixed(3),gapS:+gapS.toFixed(3),frontF:+frontF.toFixed(3),frontS:+frontS.toFixed(3),snapF:!!fr.snap,snapS:!!sk.snap,farSnap:!!far.snap,wallGap:+wallGap.toFixed(3),wallSnap:!!wall.snap,
        cup:['cupboard','cupboardn','drawers','cornercup','tallcup','wallcup'].filter(k=>FURN[k]&&BUY_FURN.includes(k)),cols:FURN.cupboard?(FURN.cupboard.cols||[]).length:0};}""")
    det.append(f"fridge beside the stove: gap {r['gapF']} m, fronts off by {r['frontF']} m (snapped {r['snapF']}); sink: gap {r['gapS']} m, fronts off by {r['frontS']} m (snapped {r['snapS']}); far away: snapped {r['farSnap']}; against the wall: gap {r['wallGap']} m (snapped {r['wallSnap']}); cupboards for sale: {r['cup']} in {r['cols']} colours")
    if abs(r['gapF']) >= .01 or abs(r['gapS']) >= .01 or abs(r['frontF']) >= .01 or abs(r['frontS']) >= .01 or not r['snapF'] or not r['snapS']: probs.append('kitchen pieces do not touch with fronts lined up')
    if r['farSnap']: probs.append('a far piece snapped')
    if abs(r['wallGap']) >= .01: probs.append('not flush to the wall')
    if len(r['cup']) < 5 or r['cols'] < 5: probs.append('cupboards missing')
    # the ghost turns green when snapped: place a fridge next to the stove with the real tools (look at the spot)
    gh = await g.ev("""()=>{P.x=LOC.home.ox-1.2;P.z=LOC.home.oz-2.4;P.yaw=0;P.pitch=-.6;decoStart();startPlacing({u:'k9',t:'fridge',c:'#f4f6fb',x:0,z:0,r:0});__run(4);
      const c='#'+DECO.ghost.userData.fp.material.color.getHexString();const r={x:DECO.x,z:DECO.z,valid:DECO.valid,snap:!!DECO.snap,col:c};decoCancel();decoEnd();return r;}""")
    det.append(f"ghost by the stove: at {gh['x']},{gh['z']} valid {gh['valid']} snapped {gh['snap']} colour {gh['col']}")
    if not gh['snap'] or not gh['valid']: probs.append('the ghost did not snap/turn green by the stove')
    await g.shot('kitchen-snap', both=False)
    # saved kitchens don't move: a kitchen with a 0.2 m gap stays exactly as saved
    k = await g.ev("""()=>{S.home.items=S.home.items.filter(it=>!/^k/.test(it.u));S.home.items.push({u:'kq1',t:'stove',c:null,x:1,z:-4.65,r:0},{u:'kq2',t:'fridge',c:'#f4f6fb',x:2.0,z:-4.65,r:0});rebuildHome();saveLocal();return JSON.parse(localStorage.getItem('cozytown-save-1')).home.items.filter(it=>/^kq/.test(it.u));}""")
    g2 = await run.open(new_wb, 'web', 'ipad-landscape', 'light', 'n7-reload', save=json.loads(await g.ev("()=>localStorage.getItem('cozytown-save-1')")))
    await start_from_save(g2); k2 = await g2.ev("()=>S.home.items.filter(it=>/^kq/.test(it.u)).map(it=>({u:it.u,x:it.x,z:it.z,r:it.r}))")
    same = [dict(u=i['u'], x=i['x'], z=i['z'], r=i['r']) for i in k] == k2
    det.append(f'a saved kitchen with a gap after a reload: {"unchanged" if same else "CHANGED " + json.dumps(k2)}')
    if not same: probs.append('saved kitchen moved')
    errs = g.errors + g2.errors; await run.close(g); await run.close(g2)
    if errs: probs.append(f'browser errors: {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N8 designer ----------------
REV_LOOP = """()=>new Promise(res=>{let n=0;const tick=()=>{if(!CUT||!CUT.rev){res({done:true,n});return;}if(n++>1400){res({done:false,n,stage:CUT.stage});return;}
  __run(10);if(CUT&&CUT.rev&&CUT.stage===2&&!CUT.__bye){CUT.__bye=1;ACT.revbye();}
  if(fading)setTimeout(tick,120);else setTimeout(tick,0);};tick();})"""
async def n8(run, new_wb, FIX):
    save = fx(FIX, 'save-prenight3-designer.json'); probs = []; det = []
    g = await begin(run, new_wb, 'ipad-landscape', 'n8-designer', save)
    # the saved one-room order (made by the starting version) still finishes and pays
    r1 = await g.ev("""()=>{__goto('city');__setClock(null,11);const o=S.ds&&S.ds.o;if(!o)return {err:'no saved order'};const c0=S.coins,d0=ds().done;enterClient();return {c0,d0,h:o.h,rooms:o.r2?2:1,items:o.items.length};}""")
    if r1.get('err'): await run.close(g); return False, r1['err']
    for _ in range(6):
        await g.step(6); await g.wait(150)
        if await g.ev("()=>CUR.id==='client'&&!fading"): break
    await g.ev("()=>{dsFinishAsk();}"); t = await g.tap('#card [data-a="dsgo"]'); await g.step(2)
    fin = await g.ev(REV_LOOP)
    s1 = await g.ev("()=>({coins:S.coins,done:ds().done,o:!!(S.ds&&S.ds.o),loc:CUR.id})")
    det.append(f"saved 1-room order ({r1['h']}, {r1['items']} things): go tapped {t}, review ended {fin['done']} after {fin['n']} rounds, paid {s1['coins'] - r1['c0']} 🪙, rooms today {r1['d0']} -> {s1['done']}")
    if not fin['done'] or s1['coins'] <= r1['c0'] or s1['done'] != r1['d0'] + 1 or s1['o']: probs.append('the saved 1-room order did not finish and pay')
    for _ in range(8):
        await g.step(6); await g.wait(150)
        if await g.ev("()=>CUR.id==='city'&&!fading&&!CUT"): break
    # a new 2-room order, played to the end
    if not await g.ev("()=>typeof dsGoRoom==='function'"):
        await run.close(g); return False, '; '.join(det) + ' | the game has no 2-room orders (dsGoRoom) yet'
    r2 = await g.ev("""()=>{__setClock(null,11);ds().done=0;ds().o=null;dsNew(2);const o=S.ds.o;if(!o||!o.r2)return {err:'dsNew(2) made no 2-room order'};
      const msg=msgs().cl.slice(-1)[0];return {h:o.h,th1:o.th,th2:o.r2.th,c0:S.coins,txt:msg?msg.x:''};}""")
    if r2.get('err'): await run.close(g); return False, '; '.join(det) + ' | ' + r2['err']
    await g.ev("()=>enterClient()")
    for _ in range(8):
        await g.step(6); await g.wait(150)
        if await g.ev("()=>CUR.id==='client'&&!fading"): break
    a1 = await g.ev("""()=>{const T=dsTheme(S.ds.o),R=DROOM[T.room],must=(R.must||[])[0]||[R.items[0]];const t=must[0],F=FURN[t];const it={u:uid(),t,c:F.cols?F.cols[0]:null,x:0,z:-CLD+F.d/2+.02,r:0};dsItems().push(it);addClItem(it);
      const t2=R.items.find(k=>FURN[k]&&!FURN[k].flat&&k!==t)||t,F2=FURN[t2],it2={u:uid(),t:t2,c:F2.cols?F2.cols[0]:null,x:-CLW+F2.w/2+.02,z:0,r:1};dsItems().push(it2);addClItem(it2);return {ri:S.ds.o.ri|0,n:dsItems().length,T:T.n};}""")
    await g.shot('designer-room-1', both=False)
    # not done yet: room 2 is empty
    await g.ev("()=>{dsFinishAsk();}"); early = await g.ev("()=>({has:!!document.querySelector('#card [data-a=\"dsgo\"]'),txt:$('card').textContent.slice(0,120)})"); await g.ev("()=>closePanel()")
    det.append(f"2-room order ({r2['h']}: {r2['th1']} + {r2['th2']}); message: {r2['txt'][:70]!r}; room 1 has {a1['n']} things; 'All done?' with room 2 empty offers to call the client: {early['has']}")
    if early['has']: probs.append("'All done?' let you finish with an empty room 2")
    if 'and' not in r2['txt']: probs.append('the client message does not ask for two rooms')
    await g.ev("()=>dsGoRoom(1)")
    for _ in range(8):
        await g.step(6); await g.wait(150)
        if await g.ev("()=>!fading&&(S.ds.o.ri|0)===1"): break
    a2 = await g.ev("""()=>{const T=dsTheme(S.ds.o),R=DROOM[T.room],must=(R.must||[])[0]||[R.items[0]];const t=must[0],F=FURN[t];const it={u:uid(),t,c:F.cols?F.cols[0]:null,x:0,z:-CLD+F.d/2+.02,r:0};dsItems().push(it);addClItem(it);
      const t2=R.items.find(k=>FURN[k]&&!FURN[k].flat&&k!==t)||t,F2=FURN[t2],it2={u:uid(),t:t2,c:F2.cols?F2.cols[0]:null,x:-CLW+F2.w/2+.02,z:0,r:1};dsItems().push(it2);addClItem(it2);return {ri:S.ds.o.ri|0,n:dsItems().length,T:T.n,r1:S.ds.o.items.length};}""")
    await g.shot('designer-room-2', both=False)
    dump = await g.ev("()=>{const its=dsItems();return {CLW,CLD,items:its.map(it=>{const F=FURN[furnOf(it)];return [it.t,+it.x.toFixed(2),+it.z.toFixed(2),it.r,F.w,F.d];}),cam:[+camera.position.x.toFixed(2),+camera.position.z.toFixed(2)],drawn:[...CL_ITEMS.values()].map(r=>r.it.t),room1:S.ds.o.items.map(i=>i.t),ri:S.ds.o.ri};}")
    print('PROBE', dump, flush=True)
    await g.ev("()=>dsGoRoom(0)"); await g.step(20); await g.wait(700); await g.step(6)
    await g.ev("()=>dsGoRoom(1)"); await g.step(20); await g.wait(700); await g.step(6)
    d2 = await g.ev("()=>({ri:S.ds.o.ri,drawn:[...CL_ITEMS.values()].map(r=>r.it.t),room2:dsItems().map(i=>i.t)})")
    print('PROBE2', d2, flush=True)
    det.append(f"room 2 ({a2['T']}) has {a2['n']} things, room 1 still {a2['r1']}")
    if a2['ri'] != 1 or a2['n'] < 2 or a2['r1'] < 2: probs.append('room 2 did not work')
    await g.ev("()=>{dsFinishAsk();}"); t2 = await g.tap('#card [data-a="dsgo"]'); await g.step(2)
    fin2 = await g.ev(REV_LOOP)
    s2 = await g.ev("()=>({coins:S.coins,done:ds().done,o:!!(S.ds&&S.ds.o),last:(msgs().cl.slice(-1)[0]||{}).x||'',st:window.__dsLast||null})")
    det.append(f"2-room review: go tapped {t2}, ended {fin2['done']} after {fin2['n']} rounds, paid {s2['coins'] - r2['c0']} 🪙, done {s2['done']}, client said {s2['last'][:80]!r}")
    if not fin2['done'] or s2['coins'] - r2['c0'] < 40 or s2['done'] != 1 or s2['o']: probs.append('the 2-room order did not finish and pay for both rooms')
    errs = g.errors[:]; await run.close(g)
    if errs: probs.append(f'browser errors: {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N9 food ----------------
async def n9(run, new_wb, FIX):
    save = fx(FIX, 'save-prenight3-pets.json'); probs = []; det = []
    g = await begin(run, new_wb, 'ipad-landscape', 'n9-food', save)
    r = await g.ev("""(F)=>{const out={missing:[],eat:[],bad:[]};for(const k of F){const f=FOODS[k];if(!f||!f.i||!f.n||!(f.p>0)||!(f.f>0)){out.missing.push(k);continue;}
      S.bag[k]=1;S.hunger=40;const h0=S.hunger;try{ACT.eat(k);}catch(e){out.bad.push(k+' eat threw '+e.message);delete S.bag[k];closePanel();continue;}if(!(S.hunger>h0)||S.bag[k]!==0){out.bad.push(k+' eat');delete S.bag[k];}else out.eat.push(k);closePanel();}
      out.truck=SHOPS.truck?SHOPS.truck.items.slice():null;out.market=F.filter(k=>SHOPS.market.items.includes(k));out.sold=F.filter(k=>Object.values(SHOPS).some(s=>(s.items||[]).includes(k)));return out;}""", NEW_FOODS)
    det.append(f"{len(r['eat'])} of {len(NEW_FOODS)} new foods eaten from the bag; food truck sells {r['truck']}; the Market sells {r['market']}")
    if r['missing'] or r['bad'] or len(r['sold']) != len(NEW_FOODS): probs.append(f"foods missing {r['missing']} / not eatable {r['bad']} / not sold {sorted(set(NEW_FOODS) - set(r['sold']))}")
    if not r['truck'] or not all(k in r['truck'] for k in ['burger', 'fries', 'hotdog', 'taco']): probs.append('the food truck does not sell burgers, fries, hot dogs and tacos')
    if not all(k in r['market'] for k in ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']): probs.append('the Market does not sell the other new foods')
    # buy at the truck with a real tap, in opening hours and after closing
    b = await g.ev("""()=>{__goto('city');__setClock(null,12);const t=LOC.city.inter.find(t=>/food truck/i.test(typeof t.label==='function'?t.label():t.label));if(!t)return {err:'no food truck spot in town'};P.x=t.x;P.z=t.z;P.yaw=0;S.coins=500;t.act();return {open:UI.open,x:t.x,z:t.z};}""")
    if b.get('err'): probs.append(b['err']); det.append(b['err'])
    else:
        await g.step(3); await g.wait(200)
        tp = await g.tap('#card [data-a="buy:burger"]'); await g.step(2); have = await g.ev("()=>S.bag.burger|0"); await g.shot('food-truck-shop', both=True)
        await g.ev("()=>closePanel()")
        shut = await g.ev("""()=>{__setClock(null,21);const t=LOC.city.inter.find(t=>/food truck/i.test(typeof t.label==='function'?t.label():t.label));window.__lastToast='';t.act();const o=UI.open;let bought=false;if(o){S.coins=500;const n=S.bag.fries|0;ACT.buy('fries');bought=(S.bag.fries|0)>n;}closePanel();__setClock(null,12);return {open:o,bought,toast:window.__lastToast};}""")
        det.append(f"truck: tap buy burger {tp}, you have {have}; at 21:00: card opens {shut['open']}, bought {shut['bought']} ({shut['toast'][:40]!r})")
        if tp != 'ok' or have < 1: probs.append('could not buy at the truck')
        if shut['bought']: probs.append('the truck sold food after 20:00')
    # eat on a bench while sitting
    e = await g.ev("""()=>{if(typeof BENCHES==='undefined')return {err:'no benches'};const b=BENCHES.find(q=>q.loc==='city'&&!seatTaken(q,0));__goto('city');__setClock(null,12);const s=b.seats[0];P.x=s.x+Math.sin(s.yaw)*.6;P.z=s.z+Math.cos(s.yaw)*.6;P.yaw=s.yaw;s.tg.act();__run(1);
      S.bag.taco=1;S.hunger=50;ACT.eat('taco');__run(5);const r={sat:!!P.sit,ate:S.hunger>50};closePanel();standUp();return r;}""")
    if e.get('err'): probs.append(e['err'])
    else:
        det.append(f"taco on a bench: still sitting {e['sat']}, ate {e['ate']}")
        if not (e['sat'] and e['ate']): probs.append('eating on a bench failed')
    # the bag shows icon and name
    await g.ev("()=>{S.bag.sushi=2;openBag();}"); await g.step(2)
    bag = await g.ev("()=>{const b=document.querySelector('#card [data-a=\"eat:sushi\"]');return b?b.textContent:''}"); await g.ev("()=>closePanel()")
    det.append(f'bag shows {bag.strip()[:30]!r}')
    if '🍣' not in bag or 'Sushi' not in bag: probs.append('the bag does not show the sushi icon and name')
    await g.ev("()=>{__goto('city');const T=typeof TRUCK!=='undefined'?TRUCK:{x:-30.5,z:20};P.x=T.x+6.5;P.z=T.z-.3;P.yaw=Math.PI/2;P.pitch=-.05;__setClock(null,12);}"); await g.step(10); await g.shot('food-truck', both=False)
    errs = g.errors[:]; await run.close(g)
    if errs: probs.append(f'browser errors: {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N10 weather and seasons ----------------
async def n10(run, new_wb, FIX):
    save = fx(FIX, 'save-prenight3-pets.json'); probs = []; det = []
    g = await begin(run, new_wb, 'ipad-landscape', 'n10-weather', save)
    if not await g.ev("()=>typeof WX!=='undefined'&&typeof wxNow==='function'&&typeof wxForce==='function'&&typeof seasonOf==='function'"):
        await run.close(g); return False, 'the game has no WX / wxNow / wxForce / seasonOf yet'
    # same clock = same weather: two players
    A = g; B = await begin(run, new_wb, 'pc-1366', 'n10-B', dict(save, name='ZZTEST-WXB'))
    same = []
    for day, hour in ((30, 9.2), (30, 16.7), (31, 2.5), (45, 12.1), (70, 19.9)):
        wa = await A.ev("([d,h])=>{__setClock(d,h);const w=wxNow();return [w.a,w.b,Math.round(w.k*20)/20];}", [day, hour])
        wb = await B.ev("([d,h])=>{__setClock(d,h);const w=wxNow();return [w.a,w.b,Math.round(w.k*20)/20];}", [day, hour])
        same.append(wa == wb)
    det.append(f'two players, 5 clock times: same weather {sum(same)} of 5')
    if not all(same): probs.append('two players with the same clock saw different weather')
    await run.close(B)
    # seasons by date
    sea = await g.ev("""()=>['2026-03-05','2026-05-31','2026-06-01','2026-08-31','2026-09-01','2026-11-30','2026-12-01','2027-02-28'].map(d=>seasonOf(new Date(d+'T12:00:00')))""")
    want = ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']
    det.append(f'seasons: {sea}')
    if sea != want: probs.append('the seasons are wrong')
    # each weather shows outdoors and nothing falls indoors
    shows = {}
    for kind in ('sunny', 'cloudy', 'rain', 'snow'):
        r = await g.ev("""(k)=>{__goto('city');__setClock(null,12);wxForce(k);__run(30);
          const vis=o=>!!(o&&o.visible&&o.parent),out={k,rain:vis(window.RAINM),snow:vis(window.SNOWM),sky:'#'+skyU.top.value.getHexString(),sun:+sun.intensity.toFixed(2),ground:'#'+(typeof GRASS_M!=='undefined'&&GRASS_M?GRASS_M.color.getHexString():'?')};
          __goto('home');__run(8);out.inRain=vis(window.RAINM);out.inSnow=vis(window.SNOWM);__goto('city');return out;}""", kind)
        shows[kind] = r
        await g.ev("()=>{P.x=-22;P.z=12;P.yaw=Math.PI;P.pitch=-.05;}"); await g.step(10); await g.shot('weather-' + kind, both=False)
    s = shows
    det.append(f"rain: lines {s['rain']['rain']} (indoors {s['rain']['inRain']}), sky {s['rain']['sky']}, sun {s['rain']['sun']}; snow: flakes {s['snow']['snow']} (indoors {s['snow']['inSnow']}), ground {s['snow']['ground']}; sunny: sky {s['sunny']['sky']}, sun {s['sunny']['sun']}, no rain {not s['sunny']['rain']}; cloudy: sun {s['cloudy']['sun']}")
    if not s['rain']['rain'] or s['rain']['inRain'] or s['rain']['snow']: probs.append('rain does not fall only outdoors')
    if not s['snow']['snow'] or s['snow']['inSnow'] or s['snow']['rain']: probs.append('snow does not fall only outdoors')
    if s['sunny']['rain'] or s['sunny']['snow'] or s['cloudy']['rain'] or s['cloudy']['snow']: probs.append('something falls in dry weather')
    if not (s['rain']['sun'] < s['sunny']['sun'] and s['cloudy']['sun'] < s['sunny']['sun']): probs.append('rain or clouds do not soften the sun')
    if s['snow']['ground'] == s['sunny']['ground']: probs.append('snow does not whiten the grass')
    # season probabilities roughly as agreed (counted over many blocks)
    pr = await g.ev("""()=>{const out={};for(const [sea,d0] of [['autumn','2026-10-10'],['winter','2027-01-20'],['spring','2027-04-20'],['summer','2027-07-20'],['xmas','2026-12-20']]){realDate=()=>new Date(d0+'T12:00:00');if(typeof holCheck==='function')holCheck();const c={};let n=0;for(let d=1;d<=120;d++)for(let b=0;b<8;b++){const w=wxAt(d,b*3+1.5);c[w]=(c[w]||0)+1;n++;}out[sea]=Object.fromEntries(Object.entries(c).map(([k,v])=>[k,Math.round(v/n*100)]));}realDate=()=>new Date('2026-10-20T12:00:00');if(typeof holCheck==='function')holCheck();return out;}""")
    det.append(f'weather shares (% of blocks): {json.dumps(pr)}')
    def near(sea, k, want, tol=8): return abs(pr.get(sea, {}).get(k, 0) - want) <= tol
    if not (near('autumn', 'rain', 30) and near('autumn', 'cloudy', 25) and near('winter', 'snow', 35) and near('winter', 'cloudy', 30) and near('spring', 'rain', 25) and near('summer', 'rain', 15) and near('xmas', 'snow', 60) and pr.get('summer', {}).get('snow', 0) == 0 and pr.get('winter', {}).get('rain', 0) <= 8):
        probs.append('the weather shares are off')
    # trees take the season's colours at load (a test copy with a fixed date for each season)
    cols = {}
    for sea, iso in (('spring', '2027-04-20T12:00:00'), ('summer', '2027-07-20T12:00:00'), ('autumn', '2026-10-20T12:00:00'), ('winter', '2027-01-20T12:00:00')):
        fb = fake_date_build(new_wb, iso)
        if not fb: probs.append('no realDate() to fake'); break
        h = await begin(run, fb, 'ipad-landscape', 'n10-season-' + sea, save)
        cols[sea] = await h.ev("()=>({season:typeof SEASON!=='undefined'?SEASON:null,cols:typeof TREE_COLS!=='undefined'?TREE_COLS.slice(0,4):null})")
        await h.ev("()=>{__goto('city');wxForce('sunny');P.x=-22;P.z=12;P.yaw=Math.PI;P.pitch=-.05;__setClock(null,12);}"); await h.step(30); await h.shot('season-' + sea, both=False)
        await h.ev("()=>wxForce(null)"); await run.close(h)
    det.append('tree colours by season: ' + '; '.join(f"{k}: {v['season']} {v['cols']}" for k, v in cols.items()))
    if len(cols) < 4 or any(v['season'] != k or not v['cols'] for k, v in cols.items()) or len({json.dumps(v['cols']) for v in cols.values()}) < 4: probs.append('the trees do not change colour with the season')
    await g.ev("()=>wxForce(null)")
    errs = g.errors[:]; await run.close(g)
    if errs: probs.append(f'browser errors: {errs[:2]}')
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N11 pets ----------------
SHOW_LOOP = """()=>new Promise(res=>{let n=0;const tick=()=>{if(!CUT||!CUT.show){res({done:true,n,show:S.show?S.show.place:null});return;}if(n++>900){res({done:false,n,stage:CUT.stage});return;}
  __run(12);
  if(CUT&&CUT.show){if(CUT.stage==='aim'&&CUT.t-CUT.st>.3)ACT.pstap();else if(CUT.stage==='res'&&CUT.paid)ACT.psbye();else if(/^(intro|r)/.test(CUT.stage)&&CUT.ri<3&&n>4)ACT.psskip();}
  setTimeout(tick,0);};tick();})"""
async def n11(run, live_w, new_wb, FIX):
    probs = []; det = []
    base = dict(fx(FIX, 'save-prenight3-pets.json')); base['pets'] = []; base['coins'] = 5000; base['day'] = 6; base['time'] = 10
    base['bag'] = {'apple': 2, 'petfood': 6, 'catfood': 3, 'bunnyfood': 3, 'treat': 3, 'ball': 1, 'yarn': 1, 'squeaky': 1, 'frisbee': 1, 'mouse': 1, 'hat': 1, 'collar': 1, 'shades': 1, 'cape': 1}
    g = await begin(run, new_wb, 'ipad-landscape', 'n11-pets', base)
    kinds = await g.ev("()=>Object.keys(PET_TYPES)")
    missing = [k for k in NEW_KINDS if k not in kinds]
    if missing: await run.close(g); return False, f'PET_TYPES has no {missing}'
    for kind in NEW_KINDS:
        r = await g.ev("""(k)=>{__goto('city');__setClock(6,10);const T=PET_TYPES[k];openAdopt(k,T.cols[0]);const nm=$('petName')?$('petName').value:'';ACT.adopt();const d=S.pets[S.pets.length-1],p=PET_ACTORS[PET_ACTORS.length-1];
      const out={k,adopted:!!d&&(typeof petKind==='function'?petKind(d):d.type)===k,base:d&&d.type,name:nm,icon:T.icon,snd:T.snd,cols:(T.cols||[]).length,names:(T.names||[]).length,follows:false,fed:false,played:false,slots:0,tagY:null,food:PET_FOOD[k]&&PET_FOOD[k][0],toy:PET_TOY[k]};
      if(!d||!p)return out;__run(30);P.x+=6;__run(80);out.follows=p.loc===CUR.id&&Math.hypot(p.x-P.x,p.z-P.z)<4.5;
      PT=p;d.happy=30;S.bag[PET_FOOD[k][0]]=1;ACT.pfeed();out.fed=d.happy>30;closePanel();d.happy=30;S.bag[PET_TOY[k]]=1;PT=p;ACT.pplay();out.played=d.happy>30;closePanel();
      PT=p;for(const [sl] of PSLOTS){const acc=Object.keys(ACCS).find(a=>ACCS[a].s===sl);S.bag[acc]=1;ACT.pwear(acc);}out.slots=Object.keys(petOutfit(d)).length;closePanel();out.tagY=+p.tag.position.y.toFixed(2);
      out.sound=typeof SFX[T.snd]==='function';return out;}""", kind)
        await g.ev("()=>{const p=PET_ACTORS[PET_ACTORS.length-1];P.x=p.x+1.6;P.z=p.z+1.6;P.yaw=Math.atan2(-(p.x-P.x),-(p.z-P.z));P.pitch=-.35;}"); await g.step(4); await g.shot('pet-' + kind, both=False)
        show = await g.ev("()=>{const p=PET_ACTORS[PET_ACTORS.length-1];__goto('city');__setClock(6,12);P.x=-34;P.z=25;p.x=P.x+1;p.z=P.z+1;p.loc='city';psStart(p);return !!(CUT&&CUT.show);}")
        sh = await g.ev(SHOW_LOOP) if show else {'done': False, 'n': 0}
        await g.ev("()=>{for(const p of PET_ACTORS)scene.remove(p.g);PET_ACTORS.length=0;S.pets.length=0;S.show=null;}")
        line = f"{kind}: adopt {r['adopted']} (saved as {r['base']}), follows {r['follows']}, fed {r['fed']}, played {r['played']}, {r['slots']}/4 outfit slots, tag {r['tagY']}, sound {r.get('sound')}, {r['cols']} colours, {r['names']} names, Pet Show {sh['done']} ({sh.get('show')})"
        det.append(line)
        if not (r['adopted'] and r['follows'] and r['fed'] and r['played'] and r['slots'] == 4 and r.get('sound') and r['cols'] >= 3 and r['names'] >= 3 and sh['done'] and r['tagY']): probs.append(kind)
        if r['base'] not in ('dog', 'cat', 'bunny', 'hamster'): probs.append(kind + ' is not saved as one of the 4 old kinds (an old version could not load it)')
        if kind in BREEDS and r['base'] != 'dog': probs.append(kind + ' is not a dog breed')
    errs = g.errors[:]; await run.close(g)
    if errs: probs.append(f'browser errors: {errs[:2]}')
    # the old version: a save with the new kinds loads as the base animals, and a friend's new pets show as the base animal / are skipped, no crash
    newsave = dict(base); newsave['pets'] = [
        {'id': 'zq1', 'type': 'dog', 'kind': 'pug', 'col': '#e8b765', 'name': 'Pugsy', 'happy': 80, 'stay': False, 'loc': 'city', 'x': -15.5, 'z': -4.2, 'sx': 0, 'sz': 0, 'outfit': {}},
        {'id': 'zq2', 'type': 'hamster', 'kind': 'capybara', 'col': '#c49a74', 'name': 'Capy', 'happy': 80, 'stay': False, 'loc': 'city', 'x': -16.5, 'z': -3.2, 'sx': 0, 'sz': 0, 'outfit': {}}]
    o = await run.open(live_w, 'web', 'ipad-landscape', 'light', 'n11-old', save=newsave); await start_from_save(o); await o.ev(INSTR)
    old = await o.ev("""()=>{const r={playing:PLAYING,pets:PET_ACTORS.length,types:PET_ACTORS.map(p=>p.m.type)};const a={peer:'zz',x:P.x,z:P.z,ry:0,nm:'Z'};
      mpPetsBuild(a,[['dog','#e8b765','Rex','bow','pug'],['hamster','#c49a74','Capy','','capybara'],['capybara','#c49a74','Nope','','']]);r.peerPets=a.pets?a.pets.map(q=>q.m.type):[];mpPetsDrop(a);return r;}""")
    await o.shot('old-version-sees-breed-as-puppy', both=False)
    det.append(f"old version: loads a save with a pug and a capybara: playing {old['playing']}, {old['pets']} pets shown as {old['types']}; a friend's pug + capybara + unknown kind show as {old['peerPets']}")
    # the old version is whatever was live before this run: before night 3 it shows the base animals (dog, hamster) and drops the unknown kind; from night 3 on it knows the breeds and shows them as themselves. Either copes; a missing pet, a stop or an error does not
    copes = old['playing'] and old['pets'] == 2 and old['types'] in (['dog', 'hamster'], ['pug', 'capybara']) and old['peerPets'] in (['dog', 'hamster'], ['pug', 'capybara', 'capybara'], ['pug', 'capybara']) and not o.errors
    if not copes: probs.append(f"the old version did not cope: playing {old['playing']}, {old['pets']} pets {old['types']}, peer {old['peerPets']}, errors {o.errors[:2]}")
    await run.close(o)
    # the new version shows a friend's breed as the breed
    n = await begin(run, new_wb, 'ipad-landscape', 'n11-new-peer', base)
    nw = await n.ev("""()=>{const a={peer:'zz',x:P.x,z:P.z,ry:0,nm:'Z'};mpPetsBuild(a,[['dog','#e8b765','Rex','bow','pug'],['hamster','#c49a74','Capy','','capybara']]);const t=a.pets?a.pets.map(q=>q.m.type):[];mpPetsDrop(a);
      const st={};mpStamp(st);return {t,pt:st.pt||null};}""")
    det.append(f"new version shows a friend's pets as {nw['t']}")
    if nw['t'] != ['pug', 'capybara']: probs.append('the new version does not show a friend\'s breed')
    await run.close(n)
    return not probs, ' | '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N12 house ----------------
HOUSE_JS = """()=>{const its=S.home.items,W=HOMEW,D=HOMED,out={big:!!S.bighouse,W,D,n:its.length,store:S.home.store.length,out:[],over:[],old:!!(S.home.old&&S.home.old.items),shrunk:!!S.home.shrunk,up:!!(LOC.home.fls&&LOC.home.fls.length>=2),fls:LOC.home.fls?LOC.home.fls.length:1,px:P.x-LOC.home.ox,pz:P.z-LOC.home.oz,loc:CUR.id};   /* up: a second floor (run 4, job 10: floors at z offsets, not the night-3 upstairs annex) */
  const R=it=>{const F=FURN[furnOf(it)],sw=(it.r%2?F.d:F.w)/2,sd=(it.r%2?F.w:F.d)/2;return {x1:it.x-sw,x2:it.x+sw,z1:it.z-sd,z2:it.z+sd,fl:FURN[furnOf(it)].flat};};
  for(const it of its){const r=R(it);if(r.x1<-W-.001||r.x2>W+.001||r.z1<-D-.001||r.z2>D+.001)out.out.push(it.u+' '+it.t+' '+it.x+','+it.z);}
  for(let i=0;i<its.length;i++)for(let j=i+1;j<its.length;j++){const a=its[i],b=its[j];if((a.f|0)!==(b.f|0))continue;const ra=R(a),rb=R(b);if(ra.fl||rb.fl)continue;if(ra.x1<rb.x2-.01&&ra.x2>rb.x1+.01&&ra.z1<rb.z2-.01&&ra.z2>rb.z1+.01)out.over.push(a.u+'/'+b.u);}
  return out;}"""
async def n12(run, new_wb, FIX):
    probs = []; det = []
    for name in ('save-prenight3-bighouse.json', 'save-prenight3-upstairs.json', 'save-f2cdd53-rich.json', 'save-live-web-rich.json'):
        sv = fx(FIX, name)
        if not sv or not sv.get('bighouse'): continue
        before = len(sv['home']['items']) + len(sv['home'].get('store', []))
        g = await begin(run, new_wb, 'ipad-landscape', 'n12-' + name[:-5], sv)
        h = await g.ev(HOUSE_JS)
        await g.ev("()=>{__goto('home');P.x=LOC.home.ox+4.6;P.z=LOC.home.oz+3.9;P.yaw=Math.PI/4;P.pitch=-.18;}"); await g.step(4); await g.shot('house-after-' + name[:-5], both=False)
        await g.ev("()=>{P.x=LOC.home.ox+4.6;P.z=LOC.home.oz+UPZ+3.9;}"); await g.step(4); await g.shot('house-upstairs-after-' + name[:-5], both=False)   # floor 1 lies UPZ further along z (run 4, job 10)
        after = h['n'] + h['store']
        line = f"{name}: {h['W'] * 2}x{h['D'] * 2} room, upstairs {h['up']}, {h['n']} placed + {h['store']} in My stuff = {after} (before {before}), outside the walls {len(h['out'])}, overlaps {len(h['over'])}, old layout kept {h['old']}"
        if name == 'save-prenight3-upstairs.json': line += f"; the player (saved upstairs) starts at {h['px']:.1f},{h['pz']:.1f} in {h['loc']}"
        det.append(line)
        if h['W'] != 6 or h['D'] != 5 or not h['up'] or h['out'] or h['over'] or after != before or not h['old'] or not h['shrunk']: probs.append(name)
        if name == 'save-prenight3-upstairs.json' and not (h['loc'] == 'home' and -6 < h['px'] < -1.5 and abs(h['pz']) < 2.5): probs.append('the upstairs player does not start by the stairs')
        if g.errors: probs.append(f'{name} errors {g.errors[:2]}')
        await run.close(g)
    # a new upgrade adds the upstairs and moves nothing
    sv = dict(fx(FIX, 'save-prenight3-pets.json')); sv['coins'] = 2600; sv['skills'] = dict(sv.get('skills', {}), decor={'lv': 10, 'xp': 0}); sv['bighouse'] = False
    sv['home'] = {'wall': '#ffd6e0', 'floor': 'wood', 'items': [{'u': 'q1', 't': 'bed', 'c': '#ff9ec4', 'x': -4.6, 'z': -3.85, 'r': 0}, {'u': 'q2', 't': 'sofa', 'c': '#b79cff', 'x': 2, 'z': 2, 'r': 0}, {'u': 'q3', 't': 'lamp', 'c': '#ffd45c', 'x': 5.5, 'z': -4.5, 'r': 0, 'on': 1}], 'store': []}
    g = await begin(run, new_wb, 'ipad-landscape', 'n12-upgrade', sv)
    u = await g.ev("""()=>{const before=JSON.stringify(S.home.items.map(it=>[it.x,it.z,it.r]));ACT.bighouse();__run(6);
      return {big:!!S.bighouse,same:before===JSON.stringify(S.home.items.map(it=>[it.x,it.z,it.r])),W:HOMEW,D:HOMED,up:!!(LOC.home.fls&&LOC.home.fls.length>=2),coins:S.coins,upW:LOC.home.fls&&LOC.home.fls.length>=2?HOMEW:null};}""")   # the second floor is a full 12x10 floor now (run 4, job 10)
    det.append(f"a new upgrade: big {u['big']}, furniture unchanged {u['same']}, downstairs {u['W'] * 2}x{u['D'] * 2}, upstairs {u['up']} (half-width {u['upW']}), coins left {u['coins']}")
    if not (u['big'] and u['same'] and u['W'] == 6 and u['D'] == 5 and u['up'] and u['upW'] == 6): probs.append('the new upgrade changed the downstairs or moved furniture')
    await g.ev("()=>{__goto('home');hclimb(1);}")
    for _ in range(40):
        await g.step(5); await g.wait(60)
        if await g.ev("()=>!CLIMB&&!fading&&Math.round((P.z-LOC.home.oz)/UPZ)===1"): break
    up = await g.ev("()=>({fl:Math.round((P.z-LOC.home.oz)/UPZ),x:P.x-LOC.home.ox,z:P.z-LOC.home.oz-UPZ})")   # the floor you stand on = how many UPZ along z (run 4, job 10)
    det.append(f"stairs up: floor {up['fl']} at {up['x']:.1f},{up['z']:.1f}")
    if up['fl'] != 1: probs.append('the stairs do not lead upstairs')
    await g.shot('house-new-upstairs', both=False)
    if g.errors: probs.append(f'upgrade errors {g.errors[:2]}')
    await run.close(g)
    return not probs, ' | '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N13 hairstylist ----------------
async def n13(run, new_wb, FIX):
    probs = []; det = []
    for prof in ('ipad-landscape', 'iphone-landscape', 'pc-1920'):
        sv = dict(fx(FIX, 'save-prenight3-pets.json')); sv['job'] = None; sv['coins'] = 300
        g = await begin(run, new_wb, prof, 'n13-' + prof, sv)
        if not await g.ev("()=>!!JOBS.hair&&typeof HS!=='undefined'&&!!LOC.salon"):
            await run.close(g); return False, 'the game has no hairstylist job (JOBS.hair / HS / LOC.salon) yet'
        # take the job from Rosie's chat with real taps
        await g.ev("()=>{__goto('city');__setClock(null,11);openPhone('msg','ro');}"); await g.step(3); await g.wait(250)
        t1 = await g.tap('#card [data-a="rjob"]'); await g.step(3); await g.wait(300)
        t2 = await g.tap('#card [data-a="job:hair"]'); await g.step(3); await g.wait(300)
        job = await g.ev("()=>S.job"); await g.shot('hair-job-card', both=False); await g.ev("()=>closePanel()")
        if job != 'hair': probs.append(f'{prof}: could not take the job ({t1}/{t2}, job {job})')
        # a first-time tutorial shows, and can be skipped
        tut = await g.ev("()=>{let n=0;const real=renderer.render;renderer.render=()=>{};try{for(let i=0;i<120&&!(TUT&&TUT.hs);i++){__run(1);n++;}}finally{renderer.render=real;}return {on:!!(TUT&&TUT.hs),n};}")
        if tut['on']: await g.shot('hair-tutorial', both=False); await g.tap('#tutSkip'); await g.step(2)
        else: probs.append(f'{prof}: no hairstylist tutorial the first time')
        # into the salon: a customer comes and sits
        await g.ev("()=>{__goto('salon');__setClock(null,12);}")
        cust = await g.ev("()=>{let n=0;const real=renderer.render;renderer.render=()=>{};try{for(let i=0;i<600&&!(HS.cust&&HS.cust.sat);i++){__run(1);n++;}}finally{renderer.render=real;}return {sat:!!(HS.cust&&HS.cust.sat),n,card:UI.open};}")
        if not cust['sat']: probs.append(f'{prof}: no customer sat down'); await run.close(g); det.append(f'{prof}: no customer'); continue
        await g.step(3); await g.wait(200)
        if not await g.ev("()=>UI.open&&!!document.querySelector('#card [data-a=\"hsdone\"]')"):
            r = await g.ev("()=>{const t=LOC.salon.inter.find(t=>t.hs);if(t){P.x=t.x;P.z=t.z;t.act();}return !!t;}"); await g.step(2); await g.wait(200)
        await g.shot('hair-card', both=True)
        pic = await g.ev("()=>{const im=document.querySelector('#card img.hspic');return {img:!!im,loaded:!!im&&im.complete&&im.naturalWidth>0,want:HS.cust.want,hair:HS.cust.hair};}")
        if not pic['loaded']: probs.append(f'{prof}: no picture of the wanted hairstyle')
        # work towards a perfect match with real taps
        taps = []
        for _ in range(3):
            cur = await g.ev("()=>HS.cust.hair"); want = pic['want']
            if cur['len'] != want['len']:
                taps.append(await g.tap('#card [data-a="hscut"]')); await g.step(2); await g.wait(150); continue
            break
        cur = await g.ev("()=>HS.cust.hair")
        if cur['style'] != pic['want']['style']: taps.append(await g.tap(f'#card [data-a="hscomb:{pic["want"]["style"]}"]')); await g.step(2); await g.wait(150)
        cur = await g.ev("()=>HS.cust.hair")
        if cur['col'] != pic['want']['col']: taps.append(await g.tap(f'#card [data-a="hsdye:{pic["want"]["col"]}"]')); await g.step(2); await g.wait(150)
        cur = await g.ev("()=>HS.cust.hair"); match = cur == pic['want']
        await g.shot('hair-before-done', both=False)
        c0 = await g.ev("()=>S.coins")
        td = await g.tap('#card [data-a="hsdone"]'); await g.step(4); await g.wait(300)
        res = await g.ev("()=>({stars:HS.last?HS.last.stars:null,pay:HS.last?HS.last.pay:null,coins:S.coins,done:S.hs?S.hs.done:null,txt:$('card').textContent.slice(0,160)})")
        await g.shot('hair-stars', both=True)
        fin = await g.ev("()=>{let n=0;const real=renderer.render;renderer.render=()=>{};try{if(UI.open&&document.querySelector('#card [data-a=\"hsbye\"]'))ACT.hsbye();for(let i=0;i<400&&HS.cust;i++){__run(1);n++;}}finally{renderer.render=real;}return {gone:!HS.cust,n};}")
        det.append(f"{prof}: job taken {job == 'hair'}, tutorial {tut['on']}, customer sat after {cust['n']} frames, picture {pic['loaded']}, taps {taps} (all ok {all(t == 'ok' for t in taps)}), hair matches {match}, Done {td}: {res['stars']} stars, paid {res['pay']} (coins {c0} -> {res['coins']}), customers today {res['done']}, customer left {fin['gone']}")
        if not (match and td == 'ok' and res['stars'] == 5 and res['coins'] > c0 and res['pay'] and fin['gone'] and all(t == 'ok' for t in taps)): probs.append(f'{prof}: the customer did not play through to 5 stars and pay')
        if g.errors: probs.append(f'{prof} errors {g.errors[:2]}')
        await run.close(g)
    return not probs, ' | '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- N14 smooth and light ----------------
async def n14(run, live_w, new_wb, FIX, limits):
    probs = []; det = []
    size = len(new_wb); det.append(f'index.html {size / 1e6:.2f} MB')
    if size >= 1.8e6: probs.append('index.html is 1.8 MB or more')
    # both games started and standing in town (the rain and the animals only show in a started game), the same save
    save = fx(FIX, 'save-prenight3-pets.json')
    g0 = await begin(run, live_w, 'pc-1366', 'n14-old', save); await g0.ev("()=>{__goto('city');__setClock(null,12);}"); await g0.step(4); so = await weight_static(g0); await run.close(g0)
    fb = fake_date_build(new_wb, '2026-10-25T12:00:00') or new_wb
    g = await begin(run, fb, 'pc-1366', 'n14-new', save)
    st = await g.ev("()=>({hol:typeof HOL!=='undefined'?HOL.cur:null,wx:typeof wxForce==='function'})")
    await g.ev("()=>{__goto('city');__setClock(null,12);if(typeof wxForce==='function')wxForce('rain');if(typeof WILD!=='undefined'&&WILD.force)WILD.force(true);__run(12);}")
    sn = await weight_static(g)
    anim = await g.ev("()=>({bf:!!(typeof WILD!=='undefined'&&WILD.bf&&WILD.bf.visible),birds:!!(typeof WILD!=='undefined'&&WILD.birds&&WILD.birds.visible),rain:!!(window.RAINM&&RAINM.visible)})")
    per = parse_limits(limits); worse = compare_static(so, sn, per=per)
    tp = sum(v['meshes'] for v in sn.values()); tt = sum(v['tris'] for v in sn.values())
    city = f"town {so.get('city', {}).get('meshes')} -> {sn.get('city', {}).get('meshes')} pieces, {so.get('city', {}).get('tris')} -> {sn.get('city', {}).get('tris')} triangles"
    det.append(f"measured with Halloween {st['hol']}, rain {anim['rain']}, butterflies {anim['bf']}, birds {anim['birds']}: {len(sn)} areas, {tp} pieces, {tt} triangles; {city}; limits {limits or 'none'}")
    if st['hol'] != 'halloween' or not anim['rain'] or not anim['bf']: probs.append('Halloween, rain or the animals were not on while measuring')
    if worse: probs.append(f'MORE than agreed: {worse}')
    await g.ev("()=>{if(typeof wxForce==='function')wxForce(null);}")
    await run.close(g)
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')

# ---------------- the stage ----------------
async def s_night3(run, d, live_w, new_wb, FIX, limits):
    """Every line below starts as FAIL and passes only when the test copy proves it."""
    tests = [('N1', 'Holidays fill their month (run 4): Halloween 1-31 Oct, Valentine all February, Easter the month of Easter Sunday, Christmas 1-31 Dec, nothing in other months (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene', lambda: n1(run, new_wb, FIX)),
             ('N2', "Rosie: zero sounds while chatting with her and when her messages arrive; other friends, the chef and clients still sound", lambda: n2(run, new_wb, FIX)),
             ('N3', "Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet", lambda: n3(run, new_wb, FIX)),
             ('N4', 'Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m', lambda: n4(run, new_wb, FIX)),
             ('N5', "Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose", lambda: n5(run, new_wb, FIX)),
             ('N6', 'Grandmas (rewritten for run 4): the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit', lambda: __import__('gran4').n6(run, new_wb, FIX)),
             ('N7', 'Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged', lambda: n7(run, new_wb, FIX)),
             ('N8', 'Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes', lambda: n8(run, new_wb, FIX)),
             ('N9', 'Food: every new food can be bought, eaten (also on a bench) and shows its icon and name', lambda: n9(run, new_wb, FIX)),
             ('N10', 'Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors', lambda: n10(run, new_wb, FIX)),
             ('N11', 'Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds', lambda: n11(run, live_w, new_wb, FIX)),
             ('N12', 'House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing', lambda: n12(run, new_wb, FIX)),
             ('N13', 'Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars', lambda: n13(run, new_wb, FIX)),
             ('N14', 'Smooth and light (rewritten for run 4): E1 within the run-4 limits given to the check (town up to 15% more pieces and 25% more triangles, measured with Halloween, rain and the ghosts on; pet shop up to double; every other area 10%; a new area at most the beach\'s size), measured against the starting file; index.html under 1.8 MB', lambda: n14(run, live_w, new_wb, FIX, limits))]
    only = [x for x in os.environ.get('N3_ONLY', '').split(',') if x]   # a quick check after one job runs only its lines; the full check runs all 14
    for cid, name, fn in tests:
        if only and cid not in only: continue
        t0 = time.time(); ok, det = await guarded(fn)
        d['lines'].append(L(cid, name, ok, f'{det} ({round(time.time() - t0)} s)'))
        print('   ', 'PASS' if ok else 'FAIL', '|', cid, '|', str(det)[:300], flush=True)
    return d
