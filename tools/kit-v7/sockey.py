"""Cozy Town check, line B3 (added to kit v7 on 25 Nov 2026 with the owner's OK, next to B1's rule for the friends key).
The friends key (S.soc.k, pull request #34) names a player online: if it changed, the player's friends and texts would no longer know them.
B3 starts as FAIL and passes only when, in test copies of the new game:
  1. an old save without a key gets one when the game starts, and it is in the stored save at once (before the test triggers any save);
  2. closing and opening the game 3 times gives the very same key every time, in the game and in storage;
  3. "Move my game" (the game's own send, code, get and yes steps) carries the key to a second device, and the game that was there is kept with its own key;
  4. "Start a new game" gives a new key, and the old game kept for "Bring it back" still has its own."""
import asyncio
from checks import start_from_save
KEY = "()=>{let st=null;try{st=JSON.parse(localStorage.getItem('cozytown-save-1'));}catch(e){}const f=k=>k&&typeof k.d==='string'&&typeof k.x==='string'&&typeof k.y==='string'?k.d+'.'+k.x+'.'+k.y:'none';return {mem:(typeof S!=='undefined'&&S&&S.soc)?f(S.soc.k):'none',stored:st&&st.soc?f(st.soc.k):'none'};}"
OLDKEY = "()=>{let o=null;try{o=JSON.parse(localStorage.getItem('cozytown-save-old'));}catch(e){}const k=o&&o.soc&&o.soc.k;return k?k.d+'.'+k.x+'.'+k.y:'none';}"
TITLE = "()=>typeof $==='function'&&$('tPlay')&&!$('tPlay').disabled&&typeof PLAYING!=='undefined'&&!PLAYING"
sh = lambda k: k if k == 'none' else k.split('.')[1][:8] + '…'   # (the report shows only the start of the public half)

async def key_of(g):
    r = None
    for _ in range(25):
        r = await g.ev(KEY)
        if r['mem'] != 'none': return r
        await g.wait(200); await g.step(2)
    return r

async def check_key(run, new_web, fixtures):
    probs = []; det = []; g = h = None
    fx = next((f for n, f in fixtures if n == 'save-prepfu-main.json'), None)
    if fx is None or (fx.get('soc') or {}).get('k'): return False, 'the old save without a key (save-prepfu-main.json) is not in the kit'
    try:
        g = await run.open(new_web, 'web', 'ipad-landscape', 'light', 'key-1', save=dict(fx, name='ZZTEST-KEY'))
        t0 = await g.ev(KEY); await start_from_save(g); r = await key_of(g); k1 = r['mem']
        det.append(f"old save without a key: at the title {sh(t0['stored'])}; started: in the game {sh(r['mem'])}, in storage {sh(r['stored'])}")
        if t0['stored'] != 'none': probs.append('a key before the game started')
        if k1 == 'none' or r['stored'] != k1: probs.append('the key is not in the stored save the moment the game starts')
        seen = []
        for i in range(3):
            await g.page.reload(); await g.page.wait_for_function(TITLE, timeout=240000)
            b = await g.ev(KEY); await start_from_save(g); r = await key_of(g); seen.append((b['stored'], r['mem'], r['stored']))
        same = all(x == (k1, k1, k1) for x in seen)
        det.append(f"3 reopens: the same key every time (storage before the start, the game, storage after) {same}")
        if not same: probs.append(f'the key changed on a reopen: {[tuple(sh(v) for v in x) for x in seen]}')
        # Move my game: device 1 sends, device 2 types the code and says yes
        h = await run.open(new_web, 'web', 'pc-1366', 'light', 'key-2'); await h.manual(); await h.play_intro('ZZTEST-KEY2'); await h.step(10); r2 = await key_of(h); k2 = r2['mem']
        if k2 == 'none' or k2 == k1: probs.append('the second device has no key of its own')
        code = ''
        await g.ev("()=>{openSettings();ACT.mvopen();ACT.mvsend();}")
        for _ in range(40):
            await g.step(2); await h.step(2); await asyncio.sleep(.25); code = await g.ev("()=>MV.code")
            if code: break
        ask = False
        if code:
            await h.ev("()=>{openSettings();ACT.mvopen();ACT.mvget();}"); await h.step(2)
            await h.ev("(c)=>{const i=$('mvIn');i.value=c;i.dispatchEvent(new Event('input',{bubbles:true}));ACT.mvgo();}", code)
            for _ in range(40):
                await g.step(2); await h.step(2); await asyncio.sleep(.25); ask = await h.ev("()=>!!(MV.got&&MV.got.c&&document.querySelector('#card [data-a=\"mvyes\"]'))")
                if ask: break
        if not ask: probs.append(f'Move my game did not reach its "yes" card (code {bool(code)})')
        else:
            try: await h.ev("()=>{ACT.mvyes();}")
            except Exception: pass   # (the page starts again)
            await asyncio.sleep(1); await h.page.wait_for_function(TITLE, timeout=240000)
            await start_from_save(h); r3 = await key_of(h); kept = await h.ev(OLDKEY); nm = await h.ev("()=>S.name")
            det.append(f"Move my game (code typed on device 2): device 2 plays {nm!r} with device 1's key {r3['mem'] == k1} (in storage {r3['stored'] == k1}); the game that was on device 2 is kept with its own key {kept == k2}")
            if r3['mem'] != k1 or r3['stored'] != k1: probs.append('the move did not carry the key')
            if kept != k2: probs.append('the game that was on device 2 lost its key')
        # Start a new game on device 1
        await g.ev("()=>{closePanel();openSettings();ACT.wipe();}"); await g.wait(1000)
        try: await g.ev("()=>{ACT.wipeyes();}")
        except Exception: pass   # (the page starts again)
        await asyncio.sleep(1); await g.page.wait_for_function(TITLE, timeout=240000)
        t1 = await g.ev(KEY); await g.manual(); await g.play_intro('ZZTEST-KEY3'); await g.step(10); r4 = await key_of(g); kept = await g.ev(OLDKEY)
        det.append(f"Start a new game: a new key {r4['mem'] not in ('none', k1, k2)} (in storage {r4['stored'] == r4['mem']}); the old game kept for Bring it back has its own key {kept == k1}")
        if t1['stored'] != 'none' or r4['mem'] in ('none', k1, k2) or r4['stored'] != r4['mem']: probs.append('the new game did not get a new key of its own')
        if kept != k1: probs.append('the old game kept for Bring it back lost its key')
        errs = g.errors[:] + h.errors[:]
        if errs: probs.append(f'browser errors {errs[:2]}')
    finally:
        for x in (g, h):
            if x: await run.close(x)
    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')
