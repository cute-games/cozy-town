"""Friends, texts, calls, global chat: two and three test players on the kit's fake network (no real Firebase).
python3 so_flow.py GAME.html OUTDIR"""
import asyncio, json, os, sys, time
KIT = '/home/claude/w/kit/cozycheck'; sys.path.insert(0, KIT)
import harness
from checks import start_from_save
from crawl import INSTR
GAME, OUT = sys.argv[1], sys.argv[2]
FIX = json.load(open('/home/claude/gh9/tools/check-fixtures/save-pfu6-stage6.json'))
RES = []
def line(k, ok, det): RES.append((k, ok, det)); print(('PASS ' if ok else 'FAIL ') + k + ': ' + det, flush=True)

class Run(harness.Run):
    async def __aenter__(self):
        from playwright.async_api import async_playwright
        self.pw = await async_playwright().start()
        self.browser = await self.pw.chromium.launch(args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required',
            '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
        nc = self.browser.new_context
        async def new_context(**kw):
            c = await nc(**kw); c.set_default_navigation_timeout(300000); c.set_default_timeout(120000); return c
        self.browser.new_context = new_context
        return self

async def open_p(run, prof, theme, name, save=None):
    s = save or dict({k: v for k, v in FIX.items() if k != 'pid'}, name=name)
    for k in range(4):
        try: g = await run.open(open(GAME, 'rb').read(), 'web', prof, theme, name, save=s); break
        except Exception as e:
            print('open retry', k, repr(e)[:100], flush=True); await asyncio.sleep(20)
            if k == 3: raise
    await g.ctx.grant_permissions(['microphone'])
    await start_from_save(g); await g.ev(INSTR); await g.step(10)
    await g.ev("()=>{__goto('city');closePanel();}")
    return g

async def flow(*gs, k=4, f=4):
    for _ in range(k):
        for g in gs: await g.step(f)
        await asyncio.sleep(.2)

async def until(gs, js, t=20, arg=None):
    t0 = time.time()
    while time.time() - t0 < t:
        await flow(*gs, k=1)
        v = await gs[0].ev(js, arg) if arg is not None else await gs[0].ev(js)
        if v: return v
    return None

ST = "()=>({st:SOC.st,me:SOC.me,fr:Object.keys(SOC.fr),req:Object.keys(SOC.req),out:Object.keys(socS().out),bl:Object.keys(socS().bl),un:socUnread(),badge:$('phBadge').hidden?0:+$('phBadge').textContent,peers:[...MP.peers.values()].map(a=>[a.nm,a.pi])})"
async def st(g): return await g.ev(ST)
async def phone(g, tab=None):
    await g.ev("()=>{closePanel();openPhone('mp');}"); await g.step(2)
    if tab: await g.tap(f'[data-a="stab:{tab}"]'); await g.step(2)

async def main():
    async with Run('so', OUT) as run:
        A = await open_p(run, 'ipad-landscape', 'light', 'ZZTEST-SOA')
        B = await open_p(run, 'pc-1366', 'dark', 'ZZTEST-SOB')
        ok = await until([A, B], "()=>SOC.st==='on'&&[...MP.peers.values()].some(a=>a.pi)", 30)
        ok2 = await until([B, A], "()=>SOC.st==='on'&&[...MP.peers.values()].some(a=>a.pi)", 30)
        a, b = await st(A), await st(B)
        line('S0 social on, ids in presence', bool(ok and ok2), f"A {a['st']} {a['me']} sees {a['peers']}; B {b['st']} {b['me']} sees {b['peers']}")
        # ---- request -> accept (through the screens)
        await phone(A, 'on'); await A.shot('online-list', both=True)
        r = await A.tap(f'[data-a="socadd:{b["me"]}"]'); await flow(A, B, k=3)
        got = await until([B, A], "(id)=>Object.keys(SOC.req).includes(id)", 10, a['me'])
        await B.step(2); await B.shot('toast-request')
        await phone(B, 'rq'); await B.shot('requests', both=True)
        r2 = await B.tap(f'[data-a="socyes:{a["me"]}"]'); await flow(A, B, k=4)
        fa = await until([A, B], "(id)=>Object.keys(SOC.fr).includes(id)", 10, b['me']); fb = await B.ev("(id)=>Object.keys(SOC.fr).includes(id)", a['me'])
        a, b = await st(A), await st(B)
        line('S1 request -> accept', bool(r == 'ok' and got and r2 == 'ok' and fa and fb and not a['out'] and not b['req']), f"tap add {r}, B got request {bool(got)}, tap yes {r2}; A friends {a['fr']} out {a['out']}; B friends {b['fr']} req {b['req']}")
        # ---- texts both ways
        await phone(A, 'fr'); await A.shot('friends-list', both=True)
        await A.tap(f'[data-a="sfr:{b["me"]}"]'); await A.step(2)
        await A.page.fill('#socIn', 'Hi B, want to play? 🎉'); await A.tap('[data-a="socsend"]'); await flow(A, B, k=3)
        bt = await until([B, A], "(id)=>{const T=SOC.th[id];return T&&T.L.length?{L:T.L.map(m=>m.t),un:socUnread1(id),badge:$('phBadge').textContent,toast:window.__lastToast}:null}", 10, a['me'])
        await B.step(1); await B.shot('toast-text')
        await B.ev("()=>{closePanel();openPhone();}"); await B.step(2); await B.shot('home-badge', both=True)
        await phone(B, 'fr'); await B.tap(f'[data-a="sfr:{a["me"]}"]'); await B.step(2)
        await B.page.click('#socIn'); await B.page.keyboard.type('Yes! Meet at the park'); await B.page.keyboard.press('Enter'); await flow(A, B, k=3)
        at = await until([A, B], "(id)=>{const T=SOC.th[id];return T&&T.L.length>=2?T.L.map(m=>[m.f===SOC.me?'me':'them',m.t]):null}", 10, b['me'])
        pos = await B.ev("()=>[P.x,P.z]")
        await A.step(2); await A.shot('thread', both=True); await B.shot('thread-pc', both=True)
        line('S2 texts both ways', bool(bt and bt['un'] == 1 and at and at[1] == ['them', 'Yes! Meet at the park'] and 'Hi B' in (bt['toast'] or '')),
             f"B got {bt}; A thread {at}; B typing moved the player? pos {pos}")
        # ---- offline text delivered later
        await B.ev("()=>{closePanel();saveLocal();}"); bsave = json.loads(await B.ev("()=>localStorage.getItem('cozytown-save-1')"))
        await run.close(B); await flow(A, k=6)
        await A.ev("()=>{closePanel();}"); sent = await A.ev("(id)=>{SOC.sent=0;return socSend(id,'Are you there? 😊')}", b['me']); await flow(A, k=3)
        B = await open_p(run, 'pc-1366', 'dark', 'ZZTEST-SOB', save=bsave)
        bt = await until([B, A], "(id)=>{const T=SOC.th[id];return T&&!T.first&&T.L.length>=3?{un:socUnread1(id),last:T.L[T.L.length-1].t,badge:$('phBadge').textContent}:null}", 15, a['me'])
        await asyncio.sleep(2); await B.step(1); tst = await B.ev("()=>window.__lastToast"); await B.shot('offline-toast')
        line('S3 offline text delivered later', bool(sent == '' and bt and bt['un'] == 1 and bt['last'] == 'Are you there? 😊' and 'new text' in (tst or '')), f"send {sent!r}; B on return {bt}, toast {tst!r}")
        # ---- global chat both ways, filter, rate limit
        await until([A, B], "()=>SOC.st==='on'&&MP.grp", 10); await flow(A, B, k=2)
        await A.ev("()=>{closePanel();}"); await A.tap('#bChat'); await A.step(2)
        await A.page.fill('#gcIn', 'Hello everyone! 👋'); await A.tap('[data-a="gcsend"]'); await A.step(1)
        await A.page.fill('#gcIn', 'second right away'); await A.tap('[data-a="gcsend"]'); await A.step(1)
        rate = await A.ev("()=>({err:$('gcErr').hidden?'':$('gcErr').textContent,val:$('gcIn').value})")
        await asyncio.sleep(2.1); await A.page.fill('#gcIn', 'you are stupid'); await A.tap('[data-a="gcsend"]')
        filt = await A.ev("()=>({err:$('gcErr').hidden?'':$('gcErr').textContent})")
        await asyncio.sleep(2.1); await A.page.fill('#gcIn', 'call me 0612345678'); await A.tap('[data-a="gcsend"]')
        filt2 = await A.ev("()=>({err:$('gcErr').hidden?'':$('gcErr').textContent})")
        await B.ev("()=>closePanel()"); await B.step(2); await B.page.mouse.move(300, 300)
        dot = await until([B, A], "()=>$('bChat').classList.contains('gcnew')", 8)
        await B.page.keyboard.press('Slash'); await B.step(2)
        bopen = await B.ev("()=>UI.open&&$('card').classList.contains('gccard')&&document.activeElement&&document.activeElement.id==='gcIn'")
        p0 = await B.ev("()=>[P.x,P.z]"); await B.page.keyboard.type('Hi A wasd'); await B.step(10); p1 = await B.ev("()=>[P.x,P.z]")
        await asyncio.sleep(2.1); await B.page.keyboard.press('Enter'); await flow(A, B, k=3)
        la = await until([A, B], "()=>SOC.gc.map(m=>m.t)", 5); la = await A.ev("()=>SOC.gc.map(m=>m.t)"); lb = await B.ev("()=>SOC.gc.map(m=>m.t)")
        await A.step(2); await A.shot('global-chat', both=True); await B.shot('global-chat-pc', both=True)
        ok = la == ['Hello everyone! 👋', 'Hi A wasd'] and lb == la and rate['err'] and 'friendly' in filt['err'] and 'friendly' in filt2['err'] and dot and bopen and p0 == p1
        line('S4 global chat both ways + filter + rate limit + / key', bool(ok), f"A sees {la}; B sees {lb}; 2nd line at once: {rate}; rude: {filt}; phone number: {filt2}; B's red dot {bool(dot)}; / opened chat with focus {bopen}; typing moved player {p0 != p1}")
        # ---- three players: block
        C = await open_p(run, 'iphone-portrait', 'light', 'ZZTEST-SOC')
        await until([C, A, B], "()=>SOC.st==='on'&&[...MP.peers.values()].filter(a=>a.pi).length>=2", 30); await flow(A, B, C, k=3)
        c = await st(C)
        await C.ev("(id)=>socAdd(id,'ZZTEST-SOB')", b['me']); await flow(A, B, C, k=3)
        gotc = await until([B, A, C], "(id)=>!!SOC.req[id]", 8, c['me'])
        await C.ev("()=>{SOC.sent=0;}"); await C.ev("()=>{closePanel();$('bChat').click();}"); await C.step(2); await C.page.fill('#gcIn', 'I am C'); await C.tap('[data-a="gcsend"]'); await flow(A, B, C, k=3)
        await B.ev("()=>{closePanel();SOC.gtab='all';openChat();}"); await B.step(2)
        seenC = await B.ev("()=>SOC.gc.filter(gcShown).map(m=>m.t)")
        k = await B.ev("()=>{const m=SOC.gc.find(x=>x.t==='I am C');return m&&m.k}")
        await B.tap(f'[data-a="gcflag:{k}"]'); await B.step(2); await B.shot('flag-line', both=True)
        await B.tap(f'[data-a="gcbl:{k}"]'); await flow(A, B, C, k=3)
        b2 = await st(B)
        hidden = await B.ev("()=>SOC.gc.filter(gcShown).map(m=>m.t)")
        # C keeps trying: a new request, a text into the thread, a call, a chat line
        await C.ev("(id)=>{socS().out={};SOC.reqT=0;socAdd(id,'ZZTEST-SOB');}", b['me']); await C.ev("()=>{SOC.sent=0;}")
        await C.ev("([me,id])=>{SOC.root.child('dm/'+[me,id].sort().join('_')+'/'+uid()).set({f:me,t:'hello from C',at:Date.now()});SOC.root.child('gc/'+uid()).set({p:me,n:'ZZTEST-SOC',t:'C again',at:Date.now()});SOC.root.child('call/'+id).set({f:me,n:'C',id:'zz'+uid(),at:Date.now(),o:'v=0',st:'ring'});}", [c['me'], b['me']])
        await flow(A, B, C, k=5)
        b3 = await B.ev("(cid)=>({req:Object.keys(SOC.req),gc:SOC.gc.filter(gcShown).map(m=>m.t),call:!!SOC.call,thread:!!SOC.th[cid],card:$('callCard')?!$('callCard').hidden:false})", c['me'])
        callv = await C.ev("(id)=>socOnce(SOC.root.child('call/'+id))", b['me'])
        await C.ev("(id)=>SOC.root.child('call/'+id).remove()", b['me'])
        ok = gotc and 'I am C' in seenC and c['me'] in b2['bl'] and 'I am C' not in hidden and not b3['req'] and 'C again' not in b3['gc'] and not b3['call'] and not b3['card'] and not b3['thread'] and callv and callv.get('st') == 'no'
        line('S5 block (3 players)', bool(ok), f"B got C's request {bool(gotc)}; before block B saw {seenC}; after: blocked {b2['bl']}, lines {hidden}; C tries again -> B requests {b3['req']}, lines {b3['gc']}, call shown {b3['card']}, C's call answered {callv and callv.get('st')}, thread with C {b3['thread']}")
        await B.ev("(id)=>{closePanel();openPhone('mp');PH.stab='rq';renderPhone();}", c['me']); await B.step(2); await B.shot('blocked-list', both=True)
        await run.close(C)
        # ---- voice call: connect, audio, hang up
        await A.ev("()=>closePanel()"); await B.ev("()=>closePanel()")
        await A.ev("(id)=>{openPhone('mp');ACT.sfr(id);}", b['me']); await A.step(2)
        await A.tap(f'[data-a="sccall:{b["me"]}"]')
        ring = await until([B, A], "()=>SOC.call&&SOC.call.st==='ring'&&!$('callCard').hidden", 10)
        await A.step(1); await A.shot('calling'); await B.shot('ringing', both=True)
        await B.tap('#ccYes')
        live = await until([A, B], "()=>SOC.call&&SOC.call.st==='live'&&!$('callBar').hidden", 20)
        await asyncio.sleep(3)
        STATS = "async()=>{const c=SOC.call;if(!c||!c.pc)return null;let rx=0,tx=0;(await c.pc.getStats()).forEach(r=>{if(r.type==='inbound-rtp'&&r.kind==='audio')rx+=r.bytesReceived||0;if(r.type==='outbound-rtp'&&r.kind==='audio')tx+=r.bytesSent||0;});return {cs:c.pc.connectionState,rx,tx,tracks:c.rs.getTracks().map(t=>t.readyState),paused:c.au.paused};}"
        sa = await A.ev(STATS); sb = await B.ev(STATS)
        await A.step(1); await A.shot('in-call', both=True); await B.shot('in-call-pc', both=True)
        await A.tap('#cbMute'); mute = await A.ev("()=>SOC.call.ms.getAudioTracks().every(t=>!t.enabled)"); await A.tap('#cbMute')
        await B.tap('#cbEnd'); await flow(A, B, k=3)
        gone = await until([A, B], "()=>!SOC.call&&$('callBar').hidden", 8)
        node = await A.ev("(id)=>socOnce(SOC.root.child('call/'+id))", b['me'])
        tA = await A.ev("()=>SOC.lastEnd")
        ok = ring and live and sa and sb and sa['cs'] == 'connected' and sb['cs'] == 'connected' and sa['rx'] > 0 and sb['rx'] > 0 and mute and gone and node is None
        line('S6 voice call connects, audio flows, hang up', bool(ok), f"ringing {bool(ring)}, live {bool(live)}; A {sa}; B {sb}; mute works {mute}; ended both {bool(gone)} (A: {tA}), call node left {node}")
        # ---- decline
        await A.ev("(id)=>ACT.sccall(id)", b['me']); r = await until([B, A], "()=>SOC.call&&SOC.call.st==='ring'", 10)
        await B.tap('#ccNo'); d = await until([A, B], "()=>!SOC.call&&SOC.lastEnd", 10); da = await A.ev("()=>[SOC.lastEnd,window.__lastToast]")
        await A.step(1); await A.shot('declined')
        node = await A.ev("(id)=>socOnce(SOC.root.child('call/'+id))", b['me'])
        line('S7 decline', bool(r and d and da[0] == 'declined' and node is None and not await B.ev("()=>!!SOC.call")), f"A: {da}, node left {node}")
        # ---- no answer (30 s)
        t0 = time.time(); await A.ev("(id)=>ACT.sccall(id)", b['me']); r = await until([B, A], "()=>SOC.call&&SOC.call.st==='ring'", 10)
        d = await until([A, B], "()=>!SOC.call", 45); da = await A.ev("()=>[SOC.lastEnd,window.__lastToast]"); db = await B.ev("()=>[SOC.lastEnd,window.__lastToast,!!SOC.call]")
        line('S8 no answer', bool(r and d and da[0] == 'noanswer' and db[0] == 'missed' and not db[2]), f"after {time.time()-t0:.0f} s A: {da}; B: {db}")
        # ---- can't connect (ICE candidates never arrive) -> 15 s
        await A.ev("()=>{window.__cc=callCand;callCand=()=>{};}"); await B.ev("()=>{window.__cc=callCand;callCand=()=>{};}")
        await A.ev("(id)=>ACT.sccall(id)", b['me']); await until([B, A], "()=>SOC.call&&SOC.call.st==='ring'", 10); await B.tap('#ccYes'); t0 = time.time()
        d = await until([A, B], "()=>!SOC.call", 30); da = await A.ev("()=>[SOC.lastEnd,window.__lastToast]"); db = await B.ev("()=>[SOC.lastEnd,!!SOC.call]")
        await A.step(1); await A.shot('cant-connect')
        await A.ev("()=>{callCand=window.__cc;}"); await B.ev("()=>{callCand=window.__cc;}")
        line('S9 cannot connect -> message after ~15 s', bool(d and da[0] == 'fail' and "couldn't connect" in (da[1] or '') and not db[1]), f"after {time.time()-t0:.0f} s A: {da}; B: {db}")
        # ---- leaving the game ends the call
        await asyncio.sleep(1); await A.ev("(id)=>ACT.sccall(id)", b['me']); await until([B, A], "()=>SOC.call&&SOC.call.st==='ring'", 10); await B.tap('#ccYes')
        live = await until([A, B], "()=>SOC.call&&SOC.call.st==='live'", 20)
        await run.close(B); d = await until([A], "()=>!SOC.call", 15); da = await A.ev("()=>[SOC.lastEnd,window.__lastToast]")
        line('S10 a friend leaving ends the call', bool(live and d), f"live {bool(live)}; A after B closed: {da}")
        # ---- remove friend
        B = await open_p(run, 'pc-1366', 'dark', 'ZZTEST-SOB', save=bsave)
        await until([B, A], "()=>SOC.st==='on'", 15); await flow(A, B, k=3)
        await A.ev("(id)=>{closePanel();openPhone('mp');ACT.sfr(id);}", b['me']); await A.step(2); await A.tap('[data-a="socask:rm"]'); await A.step(1); await A.shot('remove-ask', both=True)
        await A.tap(f'[data-a="socrm:{b["me"]}"]'); await flow(A, B, k=3)
        rb = await until([B, A], "(id)=>!SOC.fr[id]", 8, a['me']); ra = await A.ev("(id)=>!SOC.fr[id]", b['me'])
        line('S11 remove friend', bool(rb and ra), f"A list {await A.ev('()=>Object.keys(SOC.fr)')}, B list {await B.ev('()=>Object.keys(SOC.fr)')}")
        # tap a player in town -> their card
        await B.ev("()=>{closePanel();P.x=-17;P.z=-4.6;P.yaw=0;}"); await A.ev("()=>{closePanel();P.x=-17;P.z=-6.2;P.yaw=Math.PI;}"); await flow(A, B, k=6)
        tg = await A.ev("()=>{TARGET=findTarget();return TARGET?TARGET.icon+' '+TARGET.label:null}")
        await A.ev("()=>{if(TARGET)useTarget();}"); await A.step(2); card = await A.ev("()=>UI.open&&$('card').classList.contains('socpl')?$('card').innerText:''")
        await A.shot('player-card', both=True)
        line('S12 walk up to a player: their card', bool(tg and 'ZZTEST-SOB' in tg and 'Add friend' in card), f"button {tg!r}; card {card[:80]!r}")
        # ---- rules not published: everything rests and a clear line shows
        await A.ev("()=>{closePanel();socFail();openPhone('mp');}"); await A.step(2)
        dead = await A.ev("()=>({st:SOC.st,txt:$('card').innerText})"); await A.shot('rules-missing', both=True)
        line('S14 rules missing -> clear line in the Friends app', bool(dead['st'] == 'dead' and 'one-time online setup' in dead['txt']), f"st {dead['st']}; card {dead['txt'][:160]!r}")
        errs = [e for g in run.all_games for e in g.errors if 'favicon' not in e]
        line('S13 no page errors', not errs, f"{errs[:6]}")
        issues = [i for g in run.all_games for i in g.issues]
        json.dump(issues, open(os.path.join(OUT, 'audit.json'), 'w'), indent=1)
        print('audit issues', len(issues)); 
        for i in issues[:40]: print('  ', i)
    print('\nSUMMARY', sum(1 for r in RES if r[1]), 'of', len(RES), 'PASS')
asyncio.run(main())
