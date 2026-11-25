"""Cozy Town: friends, texting, voice calls and the world chat, played by two and three test players (25 Nov 2026).
Everything runs on TEST COPIES in a local browser, on the check kit's pretend network. Nothing reaches the real game or Firebase.

  python3 tools/kit-v7/make_v7.py && unzip -q -o cozy-check-v7.zip -d KIT          (the kit, unzipped: KIT/cozycheck)
  python3 tools/split/split.py join . NEW.html --edited                            (the game to test, UNSTRIPPED)
  (rules mode needs: mkdir -p RT && cd RT && npm install --no-save targaryen@3.1.0)
  flock /home/user/w/browser.lock python3 tools/social/test_social.py --kit KIT/cozycheck --game NEW.html --live LIVE.html \
        --node-path RT/node_modules --out OUT [--only friends,world,rules,soon,calls,callrules,screens,old]

Parts (each line printed is PASS or FAIL, with what was measured):
  friends  two players on the kit's own pretend network: ask -> must be accepted -> texts both ways -> a text sent while the
           friend is away -> remove -> ask again -> no -> block -> unblock; the list survives a reload
  world    three players: the world chat, block from a line, the filter (when sending and when drawing), the limits, the switch
  rules    the same play, but the pretend database keeps tools/social/firebase-rules.json (rules_server.js): every write the
           game makes must be let in, and a stranger's bad writes must be refused
  soon     the pretend database keeps the OLD rules (firebase-rules-before.json): "coming soon", nothing else breaks
  callrules  the calls part once more, with the pretend database keeping the new rules
  calls    two pages with pretend microphones (Chromium flags): ring, answer, sound really flows (getStats), mute, hang up,
           not now, the caller gives up, a player leaves, busy, a network that cannot connect, no microphone allowed
  screens  every new screen on the kit's 10 screen sizes, light and dark, through the kit's layout audit
  old      a player on the live version and a player on the new one still see each other
"""
import argparse, asyncio, json, os, shutil, sys, time

ap = argparse.ArgumentParser()
ap.add_argument('--kit', required=True); ap.add_argument('--game', required=True); ap.add_argument('--live', default='')
ap.add_argument('--out', default='social-test-out'); ap.add_argument('--only', default=''); ap.add_argument('--node-path', default='')
A = ap.parse_args()
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(A.kit))
import harness                                    # the kit's own harness (pretend network, real taps, layout audit)
from harness import Run, PROFILES
from checks import start_from_save
from crawl import INSTR

KIT = os.path.abspath(A.kit); OUT = os.path.abspath(A.out); os.makedirs(OUT, exist_ok=True)
NEW = open(A.game, 'rb').read(); LIVE = open(A.live, 'rb').read() if A.live else None
FX = json.load(open(os.path.join(KIT, 'fixtures', 'save-pfu6-stage6.json')))
LINES = []
def line(part, what, ok, detail=''):
    LINES.append((part, what, bool(ok), detail)); print(('PASS' if ok else 'FAIL') + f' | {part} | {what} | {str(detail)[:420]}', flush=True)

ST = """()=>({st:SOC.st,sid:SOC.me?SOC.me.sid:'',fr:S.soc?JSON.parse(JSON.stringify(S.soc.fr)):{},bl:S.soc?Object.assign({},S.soc.bl):{},th:Object.keys(SOC.th),
  mp:MP.state,peers:[...MP.peers.values()].map(a=>({nm:a.nm,so:!!a.so,old:!!a.old})),g:SOC.g.map(m=>m.n+': '+m.t),call:SOC.call?SOC.call.st:null,
  badge:$('phBadge').hidden?0:+$('phBadge').textContent,toast:window.__lastToast||'',app:String(PH.app),open:UI.open,unread:socUnread(),asks:socAskN()})"""
BUBS = "()=>[...document.querySelectorAll('#socBubs .bub')].map(b=>[b.classList.contains('me')?'me':'them',b.childNodes.length?[...b.childNodes].filter(n=>!(n.classList&&n.classList.contains('tm'))).map(n=>n.textContent).join('|'):''])"

def save_for(name):
    s = json.loads(json.dumps(FX)); s['name'] = name; s.pop('soc', None); s['pid'] = 'uzz' + name.lower()[-6:]; return s

async def player(run, name, prof='ipad-landscape', theme='light', build=None, save=None):
    g = await run.open(build or NEW, 'web', prof, theme, name, save=save or save_for(name))
    await start_from_save(g); await g.ev(INSTR); await g.step(10)
    await g.ev("()=>{window.__tl=[];const t0=window.toast;window.toast=function(){window.__tl.push(String(arguments[0]));return t0.apply(this,arguments);};}")   # every note the player is shown (the kit's recorder keeps only the last)
    return g

async def pump(*gs, rounds=3, n=6, wait=0.12):
    for _ in range(rounds):
        for g in gs: await g.step(n)
        await asyncio.sleep(wait)

async def until(js, g, others=(), secs=12, arg=None):
    """Play frames on every page until `js` is true on page g (or time runs out). Returns the last value."""
    t0 = time.time(); v = None
    while time.time() - t0 < secs:
        await pump(g, *others, rounds=1)
        v = await (g.ev(js, arg) if arg is not None else g.ev(js))
        if v: return v
    return v

async def st(g): return await g.ev(ST)
async def stored(g): return await g.ev("()=>{saveLocal();return JSON.parse(localStorage.getItem('cozytown-save-1'));}")
async def phone(g, app=None):
    """Open the phone (and an app) with real taps, as a player does."""
    await g.ev("()=>closePanel()"); await g.step(2); r = await g.tap('#bPhone'); await g.step(3); await g.wait(350); await g.settle()
    if app: r = await g.tap(f'#card [data-a="phapp:{app}"]'); await g.step(3); await g.wait(200)
    return r
async def tap(g, sel):
    r = await g.tap(sel); await g.step(3); await g.wait(150); return r
async def say(g, text, act):
    """Type into the phone's text box and tap send."""
    r1 = await g.tap('#socIn'); await g.page.keyboard.type(text); r2 = await tap(g, f'#card [data-a="{act}"]'); return f'{r1}/{r2}'
async def both_on(*gs, secs=25):
    """Everyone online, with the new features on, and each sees every other one with a key."""
    n = len(gs) - 1
    for g in gs:
        if not await until(f"()=>SOC.st==='on'&&[...MP.peers.values()].filter(a=>a.so).length>={n}", g, [x for x in gs if x is not g], secs): return False
    return True
def errs(*gs): return [e for g in gs for e in g.errors]
def audit(part, run):
    """The kit's layout audit ran on every picture taken with shot(): one line for all of this part's pictures (new version only)."""
    new = harness.md5b(NEW); iss = [i for g in run.all_games for i in g.issues if i.get('build') == new and not (i['k'] == 'small-target' and min(i.get('size', [99, 99])) >= 44)]
    n = sum(len(g.shots) for g in run.all_games if g.build_md5 == new); by = {}
    for i in iss: by.setdefault(i['k'] + ': ' + i['el'], i)
    line(part, f"the kit's layout audit finds nothing wrong on this part's {n} pictures (cut off, overlap, text that does not fit, small buttons, contrast)", not by,
         f'{len(by)} problems' + (': ' + '; '.join(f"{k} {v.get('size', '')} @{v['at']} ({v['profile']} {v['theme']})"[:150] for k, v in list(by.items())[:8]) if by else ''))

# ---------------------------------------------------------------- friends and texts
async def friends(run, part='friends', strict=None):
    a = await player(run, 'ZZTEST-ANA', 'ipad-landscape'); b = await player(run, 'ZZTEST-BEN', 'iphone-portrait', 'dark')
    ok = await both_on(a, b); sa, sb = await st(a), await st(b)
    line(part, 'two players are online with the new features on', ok and sa['sid'] != sb['sid'], f"A {sa['st']} sees {sa['peers']}; B {sb['st']} sees {sb['peers']}")
    # A asks B with real taps: phone -> Friends -> the plus next to B
    await phone(a, 'mp'); await a.shot(part + '-friends-app-with-plus', both=True)
    r = await tap(a, '#card [data-a^="fadd:"]'); sa = await st(a)
    asked = r == 'ok' and [f['s'] for f in sa['fr'].values()] == ['out']
    got = await until("()=>socAskN()===1", b, [a]); sb = await st(b); sa = await st(a)
    line(part, 'a friend request arrives, and the two are NOT friends until it is answered', asked and got and [f['s'] for f in sb['fr'].values()] == ['in'] and [f['s'] for f in sa['fr'].values()] == ['out'] and sb['badge'] >= 1 and 'wants to be your friend' in sb['toast'],
         f"tap {r}; A's list {[(f['n'], f['s']) for f in sa['fr'].values()]}; B's list {[(f['n'], f['s']) for f in sb['fr'].values()]}; B's phone badge {sb['badge']}; B was told: {sb['toast'][:60]!r}")
    no_text = await a.ev("()=>socSend(Object.keys(S.soc.fr)[0],'hello before yes')")
    line(part, 'no texting before the request is accepted', no_text is False and not await a.ev("()=>document.querySelector('#card [data-a^=\"sms:\"]')"), f'send said {no_text}')
    await phone(b, 'mp'); await b.shot(part + '-request-row', both=True)
    r = await tap(b, '#card [data-a^="fyes:"]')
    fa = await until("()=>Object.values(S.soc.fr).some(f=>f.s==='ok')", a, [b]); sa, sb = await st(a), await st(b)
    line(part, 'B says yes: both lists show a friend', r == 'ok' and fa and [f['s'] for f in sb['fr'].values()] == ['ok'] and 'is your friend now' in sa['toast'] and sb['asks'] == 0,
         f"tap {r}; A {[(f['n'], f['s']) for f in sa['fr'].values()]} ({sa['toast'][:40]!r}); B {[(f['n'], f['s']) for f in sb['fr'].values()]}")
    # texts both ways, like SMS: A writes from the Messages app
    await phone(a, 'msg'); await a.shot(part + '-messages-list', both=True)
    r = await tap(a, '#card [data-a^="sms:"]'); r2 = await say(a, 'Hello Ben! How are you?', 'ssend')
    got = await until("()=>socUnread()===1", b, [a]); sb = await st(b); mine = await a.ev(BUBS)
    line(part, "A's text shows on A's right side, and B gets a badge and a note", r == 'ok' and mine == [['me', 'Hello Ben! How are you?']] and got and sb['badge'] >= 1 and 'Hello Ben' in sb['toast'],
         f"taps {r}, {r2}; A's bubbles {mine}; B unread {sb['unread']}, badge {sb['badge']}, note {sb['toast'][:50]!r}")
    await phone(b, 'msg'); cb = await b.ev("()=>{const c=document.querySelector('#card .chat[data-a^=\"sms:\"]');return c?[c.textContent,!!c.querySelector('.cbadge')]:null}")
    await tap(b, '#card [data-a^="sms:"]'); theirs = await b.ev(BUBS); sb = await st(b)
    r3 = await say(b, 'Hi Ana! I am at the park 🌳', 'ssend'); await until("()=>document.querySelectorAll('#socBubs .bub').length===2", a, [b]); la = await a.ev(BUBS); lb = await b.ev(BUBS)
    line(part, 'B reads it on the left (the badge clears) and answers; the newest text is at the bottom on both phones',
         bool(cb) and cb[1] and theirs == [['them', 'Hello Ben! How are you?']] and sb['unread'] == 0 and la == [['me', 'Hello Ben! How are you?'], ['them', 'Hi Ana! I am at the park 🌳']] and lb == [['them', 'Hello Ben! How are you?'], ['me', 'Hi Ana! I am at the park 🌳']],
         f"B's list row {cb}; B saw {theirs}; unread after reading {sb['unread']}; A's thread {la}; B's thread {lb}")
    await a.shot(part + '-thread-ipad', both=True); await b.shot(part + '-thread-iphone', both=True)
    at_bottom = await a.ev("()=>{const sc=document.querySelector('#card .ph-screen'),bs=[...document.querySelectorAll('#socBubs .bub')],r=bs[bs.length-1].getBoundingClientRect(),s=sc.getBoundingClientRect(),i=$('socIn').getBoundingClientRect();return r.bottom<=i.top+1&&r.top>=s.top&&i.bottom<=s.bottom+1;}")
    line(part, 'the newest bubble sits just above the typing bar, inside the phone', at_bottom, '')
    # limits: length, speed, the filter
    await a.ev("()=>{$('socIn').value='';}"); await a.tap('#socIn'); await a.page.keyboard.insert_text('x' * 230); ln = await a.ev("()=>$('socIn').value.length"); await a.ev("()=>{$('socIn').value='';}")
    await a.wait(1600); t1 = await a.ev("()=>socSend(PH.fc,'one')"); t2 = await a.ev("()=>socSend(PH.fc,'two')"); fast = await a.ev("()=>window.__lastToast")
    await a.wait(1600); bad = []
    for txt in ('you are stupid', 'go to www.example.com', 'call me 86123456', 'my number is 8 6 1 2 3 4 5'):
        bad.append(await a.ev("(t)=>socSend(PH.fc,t)", txt)); await a.wait(100)
    ok5 = await a.ev("()=>socSend(PH.fc,'I have 2500 coins!')"); await pump(a, b)
    lb = await b.ev(BUBS)
    line(part, 'limits: 200 letters, one text every 1.5 s, and rude words, links and long numbers are not sent', ln == 200 and t1 is True and t2 is False and 'Slow down' in fast and bad == [False] * 4 and ok5 is True and [x[1] for x in lb][-2:] == ['one', 'I have 2500 coins!'],
         f'typed 230 -> {ln} letters; two quick sends {t1}, {t2} ({fast[:30]!r}); rude/link/number sends {bad}; "2500 coins" {ok5}; B has {[x[1] for x in lb]}')
    # B goes away (closes the game). A writes. B comes back later and finds it.
    saveB = await stored(b); await run.close(b); await until("()=>MP.peers.size===0", a, []); await a.wait(1600)
    await phone(a, 'mp'); row = await a.ev("()=>{const r=[...document.querySelectorAll('#card .ph-row')].find(r=>r.textContent.includes('💗'));return r?r.textContent:''}")
    await a.shot(part + '-friend-away', both=True)
    sent = await a.ev("()=>socSend(Object.keys(S.soc.fr)[0],'Are you coming back tomorrow?')")
    b = await player(run, 'ZZTEST-BEN', 'iphone-portrait', 'dark', save=saveB)
    got = await until("()=>socUnread()===1", b, [a], 25); sb = await st(b)
    await phone(b, 'msg'); await tap(b, '#card [data-a^="sms:"]'); lb = await b.ev(BUBS)
    line(part, 'a text sent while the friend is away waits online and is there when they come back', 'Not here right now' in row and sent is True and got and sb['badge'] >= 1 and lb[-1] == ['them', 'Are you coming back tomorrow?'] and [f['s'] for f in sb['fr'].values()] == ['ok'],
         f"A's row: {row[:50]!r}; sent {sent}; B after coming back: unread {sb['unread']}, badge {sb['badge']}, last bubble {lb[-1] if lb else None}, still friends {[f['s'] for f in sb['fr'].values()]}")
    # the list survives a reload on A too (an old save keeps its friends)
    saveA = await stored(a); await run.close(a); a = await player(run, 'ZZTEST-ANA', 'ipad-landscape', save=saveA)
    back = await until("()=>socOn()&&Object.values(S.soc.fr).some(f=>f.s==='ok')&&Object.values(SOC.th).some(T=>T.msgs.length>=4)", a, [b], 25)
    line(part, 'after a reload the friend and the texts are still there', bool(back), f"A: {[(f['n'], f['s']) for f in (await st(a))['fr'].values()]}")
    await both_on(a, b)
    # remove: either side can. A removes B from the friend's card.
    await phone(a, 'mp'); r1 = await tap(a, '#card .ph-row [data-a^="fc:"]'); await a.shot(part + '-friend-card', both=True)
    r2 = await tap(a, '#card [data-a="fask:rm"]'); await a.shot(part + '-remove-ask', both=True); r3 = await tap(a, '#card [data-a^="frm:"]')
    gone = await until("()=>Object.keys(S.soc.fr).length===0", b, [a]); sa, sb = await st(a), await st(b)
    nt = await b.ev("()=>socSend(Object.keys(SOC.th)[0]||'x','still there?')")
    line(part, 'A removes B: both lists are empty and texting is closed', [r1, r2, r3] == ['ok'] * 3 and sa['fr'] == {} and gone and 'not on your friends list' in sb['toast'] and nt is False,
         f"taps {r1}/{r2}/{r3}; A {sa['fr']}; B {sb['fr']} ({sb['toast'][:50]!r}); B's send {nt}")
    # ask again after a removal: it must be answered again (no silent "friends again")
    await phone(a, 'mp'); await tap(a, '#card [data-a^="fadd:"]')
    got = await until("()=>socAskN()===1", b, [a]); sa = await st(a)
    still_out = [f['s'] for f in sa['fr'].values()] == ['out']
    await phone(b, 'mp'); r = await tap(b, '#card [data-a^="fno:"]')
    dropped = await until("()=>Object.keys(S.soc.fr).length===0", a, [b]); sa, sb = await st(a), await st(b)
    line(part, 'asking again after a removal needs a new yes; B says no and the request is gone on both sides', got and still_out and r == 'ok' and dropped and sb['fr'] == {} and "can't be friends" in sa['toast'],
         f"B got the request: {bool(got)}; A stayed 'asked': {still_out}; no-tap {r}; A {sa['fr']} ({sa['toast'][:40]!r}); B {sb['fr']}")
    # block: A asks a third time; B blocks from the request's card. Then A's requests, texts and calls do not reach B.
    await phone(a, 'mp'); await tap(a, '#card [data-a^="fadd:"]'); await until("()=>socAskN()===1", b, [a])
    await phone(b, 'mp'); r1 = await tap(b, '#card .ph-row [data-a^="fc:"]'); r2 = await tap(b, '#card [data-a="fask:bl"]'); await b.shot(part + '-block-ask', both=True); r3 = await tap(b, '#card [data-a^="fblk:"]')
    await until("()=>Object.keys(S.soc.fr).length===0", a, [b]); sb = await st(b)
    blocked = [r1, r2, r3] == ['ok'] * 3 and len(sb['bl']) == 1 and sb['fr'] == {}
    await a.wait(3200); await phone(a, 'mp')
    await tap(a, '#card [data-a^="fadd:"]'); await pump(a, b, rounds=14); sa, sb2 = await st(a), await st(b)
    nt = await a.ev("()=>socSend(Object.keys(S.soc.fr)[0],'let me in')"); await a.ev("()=>socCall(Object.keys(S.soc.fr)[0])"); await pump(a, b, rounds=4)
    line(part, "B blocks A: A's new request, texts and calls never reach B", blocked and sb2['fr'] == {} and sb2['asks'] == 0 and sb2['call'] is None and [f['s'] for f in sa['fr'].values()] == ['out'] and nt is False and (await st(a))['call'] is None,
         f"taps {r1}/{r2}/{r3}; B blocked {list(sb['bl'].values())}; after A asked again: B's list {sb2['fr']}, requests {sb2['asks']}, call {sb2['call']}; A waits as {[f['s'] for f in sa['fr'].values()]}; A's send {nt}")
    # unblock: the request that waited shows up
    await phone(b, 'mp'); await b.shot(part + '-friends-with-blocked', both=True); r1 = await tap(b, '#card [data-a="phapp:blk"]'); await b.shot(part + '-blocked-list', both=True); r2 = await tap(b, '#card [data-a^="funb:"]')
    got = await until("()=>socAskN()===1", b, [a]); sb = await st(b)
    line(part, 'B unblocks: the blocked list is empty and the waiting request shows up', r1 == 'ok' and r2 == 'ok' and sb['bl'] == {} and bool(got), f"taps {r1}/{r2}; blocked {sb['bl']}; requests {sb['asks']}")
    e = errs(a, b); line(part, 'no errors in the browser log', not e, e[:3])
    return a, b

# ---------------------------------------------------------------- the world chat (three players)
async def world(run, part='world'):
    a = await player(run, 'ZZTEST-ANA', 'ipad-landscape'); b = await player(run, 'ZZTEST-BEN', 'pc-1366', 'dark'); c = await player(run, 'ZZTEST-CAT', 'iphone-landscape')
    ok = await both_on(a, b, c); line(part, 'three players are online', ok, [(await st(g))['peers'] for g in (a, b, c)])
    for g in (a, b, c): await phone(g, 'mp'); await tap(g, '#card [data-a="phapp:gc"]')
    await a.shot(part + '-empty', both=True)
    r = await say(a, 'Hello everyone! 👋', 'gsend')
    await until("()=>SOC.g.length===1", b, [a, c]); await until("()=>SOC.g.length===1", c, [a, b])
    la, lb, lc = await a.ev(BUBS), await b.ev(BUBS), await c.ev(BUBS)
    line(part, 'a line shows for everyone: mine on the right, theirs on the left with the name', la == [['me', 'Hello everyone! 👋']] and lb == lc == [['them', 'ZZTEST-ANA||Hello everyone! 👋']], f'taps {r}; A {la}; B {lb}; C {lc}')
    await b.wait(300); await say(b, 'Hi Ana!', 'gsend'); await until("()=>SOC.g.length===2", c, [a, b]); await pump(a, b, c)
    await c.shot(part + '-iphone-landscape', both=True)
    # C taps A's line and blocks A: C does not see A any more, B still does
    await c.ev("()=>document.querySelector('#socBubs .bub.them').scrollIntoView({block:'center'})")   # (on a short phone the oldest line sits under the header: a player scrolls to it)
    r1 = await tap(c, '#socBubs .bub.them'); await c.ev("()=>{const b=document.querySelector('#socBubs [data-a^=\"ghide:\"]');if(b)b.scrollIntoView({block:'center'});}"); await c.shot(part + '-block-ask', both=True); r2 = await tap(c, '#socBubs [data-a^="ghide:"]'); sc = await st(c); lc = await c.ev(BUBS)
    await a.wait(4100); await a.ev("()=>socSay('Can everybody see this?')"); await until("()=>SOC.g.length===3", b, [a, c]); await pump(a, b, c)
    lb, lc2 = await b.ev(BUBS), await c.ev(BUBS)
    line(part, "C blocks A from a chat line: A's lines are hidden for C, and B still sees them", r1 == 'ok' and r2 == 'ok' and len(sc['bl']) == 1 and lc == lc2 == [['them', 'ZZTEST-BEN||Hi Ana!']] and len(lb) == 3 and lb[-1] == ['them', 'ZZTEST-ANA||Can everybody see this?'],
         f"taps {r1}/{r2}; C blocked {list(sc['bl'].values())}; C sees {lc2}; B sees {[x[1] for x in lb]}")
    await pump(a, b, c); rq = await a.ev("()=>{const k=[...MP.peers.values()].find(p=>p.nm==='ZZTEST-CAT');socAsk(k.so,k.nm);return 1}"); await pump(a, b, c, rounds=14); sc = await st(c)
    line(part, 'a blocked player also cannot send a friend request', sc['fr'] == {} and sc['asks'] == 0, f"C's list {sc['fr']}")
    # the filter when sending
    await b.wait(4100); out = []
    for txt in ('you idiot', 'look at https://x.example', 'my phone is 86123456', 'I live at 12 Oak Street'):
        out.append(await b.ev("(t)=>socSay(t)", txt)); out.append((await b.ev("()=>window.__lastToast"))[:24]); await b.wait(60)
    n0 = await a.ev("()=>SOC.g.length")
    # the filter when drawing: a changed game writes straight into the database (the test does it here)
    P = "worlds/cozy-town/social/g/"
    raw = {'zz0000000001': {'s': 'x' * 22, 'n': 'ZZTEST-HACK', 't': 'you are all stupid', 'at': int(time.time() * 1000)}, 'zz0000000002': {'s': 'x' * 22, 'n': 'ZZTEST-HACK', 't': 'visit www.bad.example now', 'at': int(time.time() * 1000) + 1},
           'zz0000000003': {'s': 'y' * 22, 'n': 'idiot', 't': 'a nice line from a rude name', 'at': int(time.time() * 1000) + 2}, 'zz0000000004': {'s': 'y' * 22, 'n': 'ZZTEST-LONG', 't': 'L' * 300, 'at': int(time.time() * 1000) + 3}, 'zz0000000005': 'junk'}
    if getattr(run.relay, 'rules', None) is None:
        for k, v in raw.items(): run.relay._set(P + k, v)
        await run.relay._notify(P[:-1]); await pump(a, b, c)
        shown = await a.ev("()=>socShown().map(m=>m.n+': '+m.t)"); dom = await a.ev(BUBS)
        line(part, 'lines that are rude or carry a link are not drawn, a rude name becomes "Friend", a long line is cut', out[0::2] == [False] * 4 and n0 == 3 and not any('stupid' in s or 'www' in s or 'idiot' in s for s in shown) and 'Friend: a nice line from a rude name' in shown and any(s == 'ZZTEST-LONG: ' + 'L' * 120 for s in shown) and len(dom) == len(shown),
             f'sends {out}; lines stored by players {n0}; drawn: {[s[:40] for s in shown]}')
        # only the newest 50
        for i in range(60): run.relay._set(P + 'zy%010d' % i, {'s': 'z' * 22, 'n': 'ZZTEST-MANY', 't': f'line {i}', 'at': int(time.time() * 1000) + 10 + i})
        await run.relay._notify(P[:-1]); await pump(a, b, c); n = await a.ev("()=>[SOC.g.length,document.querySelectorAll('#socBubs .bub').length,SOC.g[SOC.g.length-1].t]")
        line(part, 'only the newest 50 lines are kept and drawn', n[0] == 50 and n[1] <= 50 and n[2] == 'line 59', n)
    else:
        line(part, 'rude words, links, phone numbers and addresses are not sent', out[0::2] == [False] * 4 and n0 == 3, f'sends {out}; lines stored {n0}')
    await a.wait(4100); t1 = await a.ev("()=>socSay('first')"); t2 = await a.ev("()=>socSay('second right away')"); fast = await a.ev("()=>window.__lastToast")
    line(part, 'one line every 4 seconds for each player', t1 is True and t2 is False and 'Slow down' in fast, f'{t1}, {t2} ({fast[:30]!r})')
    # the grown-ups' switch
    await b.ev("()=>closePanel()"); await b.step(2); r1 = await tap(b, '#bMenu'); await b.shot(part + '-settings', both=True); row = await b.ev("()=>{const b=document.querySelector('#card [data-a=\"swchat\"]');return b?b.textContent:null}")
    r2 = await tap(b, '#card [data-a="swchat"]'); off = await b.ev("()=>[SET.wchat,SOC.g.length,!!SOC.qg,document.querySelector('#card [data-a=\"swchat\"]').textContent,JSON.parse(localStorage.getItem('cozytown-settings')).wchat]")
    await phone(b, 'mp'); await tap(b, '#card [data-a="phapp:gc"]'); txt = await b.ev("()=>$('card').textContent"); has_in = await b.ev("()=>!!$('socIn')"); await b.shot(part + '-turned-off', both=True)
    no = await b.ev("()=>socSay('am I still here?')")
    await b.ev("()=>closePanel()"); await tap(b, '#bMenu'); await tap(b, '#card [data-a="swchat"]'); await pump(a, b, c); on = await b.ev("()=>[SET.wchat,SOC.g.length>0,!!SOC.qg]")
    line(part, 'Settings has a World chat switch: off = no lines, no typing, nothing is listened to; on brings it back', r1 == 'ok' and r2 == 'ok' and row and 'On' in row and off[0] is False and off[1] == 0 and off[2] is False and 'Off' in off[3] and off[4] is False and 'turned off' in txt and not has_in and no is False and on == [True, True, True],
         f"row {row!r}; after off: {off}; the chat screen says {txt[-90:]!r}; typing box there {has_in}; send {no}; after on: {on}")
    e = errs(a, b, c); line(part, 'no errors in the browser log', not e, e[:3])
    return a, b, c

# ---------------------------------------------------------------- the pretend database with rules
class RulesRelay(harness.Relay):
    """The kit's relay, but every read and write first asks rules_server.js (targaryen) whether the rules allow it."""
    def __init__(self, rules): super().__init__(); self.rules = rules; self.n = 0; self.denied = []; self.proc = None; self.lock = asyncio.Lock(); self.ops = 0
    async def start(self):
        env = dict(os.environ); env['NODE_PATH'] = os.path.abspath(A.node_path) if A.node_path else env.get('NODE_PATH', '')
        self.proc = await asyncio.create_subprocess_exec('node', os.path.join(HERE, 'rules_server.js'), self.rules, stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE, env=env, limit=1 << 24)
    async def stop(self):
        if self.proc: self.proc.stdin.close(); await self.proc.wait()
    async def ask(self, op, path, val, now):
        async with self.lock:
            self.n += 1; self.proc.stdin.write((json.dumps({'id': self.n, 'op': op, 'path': path, 'val': val, 'now': now}) + '\n').encode()); await self.proc.stdin.drain()
            r = json.loads(await self.proc.stdout.readline())
        if not r['ok']: self.denied.append(f'{op} {path}: {r["why"]}')
        return r['ok']
    def stamp(self, v, now):
        if isinstance(v, dict):
            if v.get('.sv') == 'timestamp' and len(v) == 1: return now
            return {k: self.stamp(x, now) for k, x in v.items()}
        if isinstance(v, list): return [self.stamp(x, now) for x in v]
        return v
    async def handle(self, source, payload):
        page = source['page']; m = json.loads(payload); op, path = m['op'], m['path']; now = int(time.time() * 1000)
        info = self.pages.setdefault(page, {'listen': set(), 'ondisc': set()})
        if op == 'listen':
            if not await self.ask('read', path, None, now): return 'denied'
            info['listen'].add(path); await self._push(page, path); return True
        if op == 'ondisc': info['ondisc'].add(path); return True
        val = self.stamp(m.get('val'), now); self.ops += 1
        if not await self.ask('update' if op == 'update' else 'write', path, val if op != 'remove' else None, now): return 'denied'
        if op == 'set': self._set(path, val)
        elif op == 'update':
            for k, v in (val or {}).items(): self._set(path + '/' + k, v)
        else: self._set(path, None)
        await self._notify(path); return True
    async def disconnect(self, page):
        info = self.pages.pop(page, None)
        for p in (info['ondisc'] if info else []):
            if await self.ask('write', p, None, int(time.time() * 1000)): self._set(p, None); await self._notify(p)

def rules_kit(tag):
    """A copy of the kit folder whose fakenet.js is ours (it can say no). The harness reads its files from harness.HERE."""
    d = os.path.join(OUT, 'kit-' + tag)
    if not os.path.isdir(d):
        os.makedirs(d)
        for f in os.listdir(KIT):
            if os.path.isfile(os.path.join(KIT, f)) and f != 'fakenet.js': os.symlink(os.path.join(KIT, f), os.path.join(d, f))
        shutil.copy(os.path.join(HERE, 'fakenet_rules.js'), os.path.join(d, 'fakenet.js'))
    return d

async def with_rules(tag, rules_file, fn, cls=None):
    old = harness.HERE; harness.HERE = rules_kit('rules')
    try:
        async with (cls or Run)(tag, OUT) as run:
            run.relay = RulesRelay(os.path.join(HERE, rules_file)); await run.relay.start()
            try: r = await fn(run); audit(tag[4:], run); return r
            finally: await run.relay.stop()
    finally: harness.HERE = old

def split_denied(denied):
    """What the rules refused: real refusals, and the speed limits doing their job (one note per inbox in 3 s, one chat line per second: the game waits and sends again)."""
    import re
    slow = [d for d in denied if re.search(r'/social/(ir/[-\w]{22}|gl): validate ', d) and d.count('=> false') == 1]
    return [d for d in denied if d not in slow], len(slow)

async def rules(run, part='rules'):
    relay = run.relay
    a, b = await friends(run, part)
    den, slow = split_denied(relay.denied)
    line(part, 'friends and texts: every read and write the game made was let in by the new rules', not den, f'{relay.ops} writes; refused: {den[:4]}; held back by a speed limit and sent again by the game: {slow}')
    await run.close(a); await run.close(b); relay.denied.clear()
    a, b, c = await world(run, part)
    den, slow = split_denied(relay.denied)
    line(part, 'the world chat: every read and write the game made was let in by the new rules', not den, f'refused: {den[:4]}; held back by a speed limit and sent again by the game: {slow}')
    # a stranger with the address of the database (page B's console stands in): what the rules must refuse
    HOSTILE = """async()=>{const db=window.firebase.database(),S='worlds/cozy-town/social',TS=window.firebase.database.ServerValue.TIMESTAMP,out={};
      const rd=p=>new Promise(ok=>{let done=0;db.ref(p).on('value',s=>{if(!done){done=1;ok('read')}},()=>{if(!done){done=1;ok('refused')}});setTimeout(()=>{if(!done){done=1;ok('no answer')}},3000)});
      const wr=(k,p)=>p.then(()=>{out[k]='written'},()=>{out[k]='refused'});
      out.list_all=await rd(S);out.list_threads=await rd(S+'/t');out.list_inboxes=await rd(S+'/in');out.guess_thread=await rd(S+'/t/'+'A'.repeat(43));
      await wr('wipe',db.ref(S).remove());await wr('wipe_chat',db.ref(S+'/g').remove());
      await wr('chat_no_timer',db.ref(S+'/g/zz0000000009').set({s:'x'.repeat(22),n:'ZZTEST-HACK',t:'hi',at:TS}));
      await wr('chat_long',db.ref(S).update({'g/zz0000000010':{s:'x'.repeat(22),n:'ZZTEST-HACK',t:'L'.repeat(500),at:TS},gl:TS}));
      await wr('chat_old_time',db.ref(S).update({'g/zz0000000011':{s:'x'.repeat(22),n:'ZZTEST-HACK',t:'hi',at:5},gl:TS}));
      await wr('chat_extra',db.ref(S).update({'g/zz0000000012':{s:'x'.repeat(22),n:'ZZTEST-HACK',t:'hi',at:TS,img:'x'},gl:TS}));
      await wr('inbox_junk',db.ref(S+'/in/'+'B'.repeat(22)+'/zz0000000013').set({e:'x',c:'y',at:TS}));
      await wr('thread_text',db.ref(S+'/t/'+'A'.repeat(43)).update({'m/zz0000000014':{f:'a',c:'c'.repeat(60),at:TS},'x/a':TS}));
      await wr('thread_call',db.ref(S+'/t/'+'A'.repeat(43)+'/s/ca').set({i:'zz0000000015',k:'o',d:'x',at:TS}));
      await wr('elsewhere',db.ref('worlds/cozy-town/social2/x').set(1));
      await wr('flood1',db.ref(S).update({'g/zz0000000016':{s:'x'.repeat(22),n:'ZZTEST-HACK',t:'one',at:TS},gl:TS}));
      await wr('flood2',db.ref(S).update({'g/zz0000000017':{s:'x'.repeat(22),n:'ZZTEST-HACK',t:'two',at:TS},gl:TS}));
      return out;}"""
    await b.wait(1200); h = await b.ev(HOSTILE)
    want = dict(list_all='refused', list_threads='refused', list_inboxes='refused', guess_thread='refused', wipe='refused', wipe_chat='refused', chat_no_timer='refused', chat_long='refused', chat_old_time='refused',
                chat_extra='refused', inbox_junk='refused', thread_text='refused', thread_call='refused', elsewhere='refused', flood1='written', flood2='refused')
    line(part, "a stranger cannot list or wipe anything, cannot write into a thread, and cannot flood the chat", h == want, {k: v for k, v in h.items() if want.get(k) != v} or 'all 16 tries as wanted')
    for g in (a, b, c): await run.close(g)

async def soon(run, part='soon'):
    relay = run.relay
    a = await player(run, 'ZZTEST-ANA', 'ipad-landscape'); b = await player(run, 'ZZTEST-BEN', 'iphone-portrait', 'dark')
    seen = await until("()=>MP.peers.size===1&&SOC.st==='soon'", a, [b], 25) and await until("()=>MP.peers.size===1&&SOC.st==='soon'", b, [a], 25)
    sa, sb = await st(a), await st(b)
    line(part, 'with the old rules the two players still see each other, and the new features say "soon"', bool(seen), f"A {sa['st']} sees {sa['peers']}; B {sb['st']} sees {sb['peers']}")
    await phone(a, 'mp'); txt = await a.ev("()=>$('card').textContent"); btns = await a.ev("()=>[...document.querySelectorAll('#card [data-a]')].map(b=>b.dataset.a.split(':')[0])"); await a.shot(part + '-friends-app', both=True)
    await phone(b, 'mp'); await b.shot(part + '-friends-app-iphone', both=True)
    line(part, 'the Friends app shows "Coming soon" and none of the new buttons, and the old ones are all there', 'Coming soon' in txt and 'Playing now' in txt and not any(k in btns for k in ('fadd', 'sms', 'fc', 'fyes', 'fcall')) and 'gc' not in ''.join(await a.ev("()=>[...document.querySelectorAll('#card [data-a]')].map(b=>b.dataset.a)")) and 'mpgo' in btns and 'mpvisit' in btns and 'mpsay' in btns,
         f'buttons {sorted(set(btns))}; text {txt[-70:]!r}')
    # the rest of the game: the quick chat, the Messages app, Settings, a walk
    await a.ev("()=>closePanel()"); r = await tap(a, '#bChat'); r2 = await tap(a, '#card [data-a="mpsay:0"]'); heard = await until("()=>(window.__lastToast||'').includes('ZZTEST-ANA')||[...MP.peers.values()].some(p=>!!p.bub)", b, [a])
    await phone(a, 'msg'); chats = await a.ev("()=>[...document.querySelectorAll('#card .chat')].map(c=>c.dataset.a)")
    await a.ev("()=>closePanel()"); await tap(a, '#bMenu'); sw = await a.ev("()=>!!document.querySelector('#card [data-a=\"swchat\"]')"); await a.ev("()=>closePanel()")
    before = await b.ev("()=>{const p=[...MP.peers.values()][0];return [p.rx,p.rz]}"); await a.page.keyboard.down('KeyW') if not a.p['touch'] else await a.ev("()=>{P.x+=3;}"); await pump(a, b, rounds=6)
    if not a.p['touch']: await a.page.keyboard.up('KeyW')
    after = await b.ev("()=>{const p=[...MP.peers.values()][0];return [p.rx,p.rz]}")
    line(part, 'everything else works as before: quick chat, the Messages app, Settings, moving', r == 'ok' and r2 == 'ok' and bool(heard) and chats == ['chat:pz', 'chat:ro', 'chat:cl', 'chat:dr', 'chat:pc'] and not sw and before != after,
         f'quick chat {r}/{r2}, heard {bool(heard)}; chats {chats}; world chat switch in Settings {sw}; B saw A move {before} -> {after}')
    saved = await stored(a); den = sorted(set(d.split(':')[0] for d in relay.denied))
    line(part, 'only the new places were refused, and the save still got its key (ready for the day the rules are in)', all('/social/' in d for d in den) and bool(saved.get('soc', {}).get('k')), f'refused: {den[:6]}')
    e = errs(a, b); line(part, 'no errors in the browser log', not e, e[:3])

# ---------------------------------------------------------------- voice calls
class CallRun(Run):
    """The kit's run with pretend microphones: Chromium makes a test tone and says yes to the microphone question."""
    async def __aenter__(self):
        from playwright.async_api import async_playwright
        self.pw = await async_playwright().start()
        self.browser = await self.pw.chromium.launch(args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required',
                                                           '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
        return self

STATS = """async()=>{const c=SOC.call;if(!c||!c.pc)return null;let inb=0,out=0,lvl=0;(await c.pc.getStats()).forEach(r=>{if(r.type==='inbound-rtp'&&r.kind==='audio'){inb+=r.bytesReceived||0;lvl=Math.max(lvl,r.audioLevel||0);}if(r.type==='outbound-rtp'&&r.kind==='audio')out+=r.bytesSent||0;});
  return {st:c.st,inb,out,lvl,conn:c.pc.connectionState,playing:!!(c.au&&!c.au.paused&&c.au.srcObject),tracks:c.ms?c.ms.getAudioTracks().map(t=>[t.readyState,t.enabled]):[]};}"""
BOX = "()=>{const e=$('socCall');if(!e||e.hidden)return null;const r=e.getBoundingClientRect();return {txt:e.textContent,btns:[...e.querySelectorAll('button')].map(b=>{const q=b.getBoundingClientRect();return [b.dataset.c,Math.round(q.width),Math.round(q.height)]}),in:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight};}"
GUM = "()=>{window.__gum=0;const md=navigator.mediaDevices,g0=md.getUserMedia.bind(md);md.getUserMedia=function(c){window.__gum++;window.__gumArg=JSON.stringify(c);return g0(c);};}"

async def make_friends(a, b, bname='ZZTEST-BEN'):
    await a.ev("(n)=>{const k=[...MP.peers.values()].find(p=>p.so&&p.nm===n);socAsk(k.so,k.nm);}", bname)
    if not await until("()=>socAskN()===1", b, [a]): return False
    await b.ev("()=>socAnswer(Object.keys(S.soc.fr)[0],1)")
    return bool(await until("()=>Object.values(S.soc.fr).some(f=>f.s==='ok')&&Object.values(SOC.th).some(T=>T.qm)", a, [b]))

async def calls(run, part='calls'):
    a = await player(run, 'ZZTEST-ANA', 'ipad-landscape'); b = await player(run, 'ZZTEST-BEN', 'iphone-portrait', 'dark')
    ok = await both_on(a, b) and await make_friends(a, b); await pump(a, b)
    for g in (a, b): await g.ev(GUM)
    line(part, 'two friends are online', ok, '')
    cap = await a.ev("()=>({rtc:!!window.RTCPeerConnection,gum:!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia),secure:isSecureContext})")
    # A calls from the Friends app with a real tap
    await phone(a, 'mp'); r = await tap(a, '#card [data-a^="fcall:"]')
    ring = await until("()=>SOC.call&&SOC.call.st==='in'", b, [a], 15); ba, bb = await a.ev(BOX), await b.ev(BOX); gb = await b.ev("()=>window.__gum"); ga = await a.ev("()=>[window.__gum,window.__gumArg]")
    await a.page.screenshot(path=os.path.join(run.shots, f'{part}-calling.png')); await b.page.screenshot(path=os.path.join(run.shots, f'{part}-ringing.png'))
    line(part, "A calls: A's card says calling, B's phone rings with Answer and Not now; the microphone was asked for on A only", r == 'ok' and bool(ring) and ba and 'Calling' in ba['txt'] and bb and 'is calling you' in bb['txt'] and [x[0] for x in bb['btns']] == ['yes', 'bye'] and ga[0] == 1 and gb == 0 and ga[1] == '{"audio":true}',
         f"tap {r}; browser can call: {cap}; A's card {ba}; B's card {bb}; microphone asked: A {ga}, B {gb}")
    r = await b.tap('#socCall [data-c="yes"]')
    on = await until("()=>SOC.call&&SOC.call.st==='on'", a, [b], 25) and await until("()=>SOC.call&&SOC.call.st==='on'", b, [a], 10)
    await asyncio.sleep(2.5); s1a, s1b = await a.ev(STATS), await b.ev(STATS); await asyncio.sleep(1.5); s2a, s2b = await a.ev(STATS), await b.ev(STATS)
    flows = bool(on and s1a and s1b and s2a and s2b and s1a['inb'] > 0 and s1b['inb'] > 0 and s2a['inb'] > s1a['inb'] and s2b['inb'] > s1b['inb'] and s2a['out'] > 0 and s2b['out'] > 0)
    line(part, 'B answers: the call connects and sound really flows both ways (bytes received keep growing, the speaker element plays)', r == 'ok' and flows and s2a['playing'] and s2b['playing'] and await b.ev("()=>window.__gum") == 1,
         f"answer tap {r}; A {s1a} -> received {s2a and s2a['inb']}; B {s1b} -> received {s2b and s2b['inb']}")
    await a.page.screenshot(path=os.path.join(run.shots, f'{part}-talking-ipad.png')); await b.page.screenshot(path=os.path.join(run.shots, f'{part}-talking-iphone.png'))
    box = await b.ev(BOX); walk0 = await a.ev("()=>[P.x,P.z]"); await a.ev("()=>closePanel()"); await a.page.keyboard.down('KeyW'); await a.step(20); await a.page.keyboard.up('KeyW'); walk1 = await a.ev("()=>[P.x,P.z]")
    line(part, 'while talking the card is small, shows the time, Mute and Hang up (buttons 44 px or more), and you can keep playing', bool(box) and box['in'] and all(w >= 44 and h >= 44 for _, w, h in box['btns']) and [x[0] for x in box['btns']] == ['mute', 'bye'] and walk0 != walk1 and ':' in box['txt'],
         f'card {box}; A walked {walk0} -> {walk1}')
    # mute: B hears silence from A
    await a.tap('#socCall [data-c="mute"]'); await asyncio.sleep(1.2); m = await a.ev(STATS); lv = []
    for _ in range(3): await asyncio.sleep(0.5); lv.append((await b.ev(STATS))['lvl'])
    await a.tap('#socCall [data-c="mute"]'); await asyncio.sleep(1.5); un = await a.ev(STATS); lv2 = (await b.ev(STATS))['lvl']
    line(part, 'Mute turns my microphone off (the friend receives silence), and on again', m['tracks'] == [['live', False]] and max(lv[1:]) < 0.001 and un['tracks'] == [['live', True]] and 'Muted' not in (await a.ev(BOX))['txt'],
         f"muted: track {m['tracks']}, the friend's sound level {lv}; unmuted: track {un['tracks']}, level {lv2}")
    # hang up: both ends are clean
    ms_b = await b.ev("()=>{window.__ms=SOC.call.ms;window.__pc=SOC.call.pc;return 1}"); await a.tap('#socCall [data-c="bye"]')
    done = await until("()=>!SOC.call", b, [a], 8); ea = await a.ev("()=>({call:SOC.call,box:$('socCall').hidden,ring:SOC.ring})")
    eb = await b.ev("()=>({call:SOC.call,box:$('socCall').hidden,tracks:window.__ms.getTracks().map(t=>t.readyState),pc:window.__pc.connectionState,toast:window.__lastToast})")
    line(part, 'Hang up ends the call on both sides: cards gone, the microphone is let go, the connection is closed', bool(done) and ea == {'call': None, 'box': True, 'ring': 0} and eb['box'] and eb['tracks'] == ['ended'] and eb['pc'] == 'closed' and 'call ended' in eb['toast'], f'A {ea}; B {eb}')
    # not now
    await a.wait(300); await a.ev("()=>socCall(Object.keys(S.soc.fr)[0])"); await until("()=>SOC.call&&SOC.call.st==='in'", b, [a], 15); await b.tap('#socCall [data-c="bye"]')
    done = await until("()=>!SOC.call", a, [b], 8); ta = await a.ev("()=>window.__lastToast"); gb = await b.ev("()=>window.__gum")
    line(part, 'Not now: the caller is told kindly, and B was never asked for the microphone', bool(done) and "can't talk right now" in ta and gb == 1 and await b.ev("()=>!SOC.call"), f'A was told {ta!r}; microphone questions on B so far: {gb}')
    # the caller gives up while it rings
    await a.wait(300); await a.ev("()=>socCall(Object.keys(S.soc.fr)[0])"); await until("()=>SOC.call&&SOC.call.st==='in'", b, [a], 15); await a.tap('#socCall [data-c="bye"]')
    done = await until("()=>!SOC.call", b, [a], 8); tb = await b.ev("()=>window.__lastToast")
    line(part, 'the caller hangs up while it rings: B stops ringing and reads "missed a call"', bool(done) and 'missed a call' in tb, f'B was told {tb!r}')
    # a player leaves in the middle of a call
    await a.wait(300); await a.ev("()=>socCall(Object.keys(S.soc.fr)[0])"); await until("()=>SOC.call&&SOC.call.st==='in'", b, [a], 15); await b.tap('#socCall [data-c="yes"]')
    on = await until("()=>SOC.call&&SOC.call.st==='on'", a, [b], 25); saveB = await stored(b); await run.close(b)
    done = await until("()=>!SOC.call", a, [], 10); ta = await a.ev("()=>window.__tl.slice(-3)"); clean = await a.ev("()=>({box:$('socCall').hidden,sound:document.querySelectorAll('audio').length})")
    line(part, 'a player closes the game in the middle of a call: the call ends cleanly for the other one', bool(on) and bool(done) and any('left the call' in t for t in ta) and clean == {'box': True, 'sound': 0}, f'connected {bool(on)}; A was told {ta}; {clean}')
    # calling a friend who is not playing
    await a.wait(500); await pump(a, rounds=4); await a.ev("()=>socCall(Object.keys(S.soc.fr)[0])"); ta = await a.ev("()=>window.__lastToast"); ga = await a.ev("()=>window.__gum")
    line(part, 'calling a friend who is not playing: a kind line, no call, no microphone question', 'not playing right now' in ta and await a.ev("()=>!SOC.call") and ga == 4, f'{ta!r}; microphone questions on A so far: {ga}')
    # a network that cannot connect (no relay server): both pages are only allowed relay routes, and there is none
    b = await player(run, 'ZZTEST-BEN', 'iphone-portrait', 'dark', save=saveB); await both_on(a, b); await until("()=>Object.values(SOC.th).some(T=>T.qm)", b, [a])
    for g in (a, b): await g.ev("()=>{const R=window.RTCPeerConnection;window.RTCPeerConnection=function(c){return new R(Object.assign({},c,{iceTransportPolicy:'relay'}));};}")
    await a.ev("()=>socCall(Object.keys(S.soc.fr)[0])"); await until("()=>SOC.call&&SOC.call.st==='in'", b, [a], 15); await b.tap('#socCall [data-c="yes"]')
    t0 = time.time(); done = await until("()=>!SOC.call", a, [b], 40); ta = await a.ev("()=>window.__lastToast"); await until("()=>!SOC.call", b, [a], 30); tb = await b.ev("()=>window.__lastToast")
    line(part, 'a network that cannot connect: after a short wait both read a kind "could not connect"', bool(done) and 'could not connect' in ta and ('could not connect' in tb or 'call ended' in tb or 'left the call' in tb),
         f'ended after {round(time.time() - t0)} s; A {ta[:60]!r}; B {tb[:60]!r}')
    # the microphone is not allowed
    await a.ev("()=>{navigator.mediaDevices.getUserMedia=()=>Promise.reject(new DOMException('no','NotAllowedError'));}")
    await a.wait(300); await a.ev("()=>socCall(Object.keys(S.soc.fr)[0])"); done = await until("()=>!SOC.call", a, [b], 8); ta = await a.ev("()=>window.__lastToast"); await pump(a, b)
    line(part, 'the microphone is not allowed: a kind line, and the friend is not rung', bool(done) and 'microphone' in ta and await b.ev("()=>!SOC.call"), f'{ta!r}')
    e = errs(a, b); line(part, 'no errors in the browser log', not e, e[:3])

async def callrules(run, part='callrules'):
    """The same calls once more, with the pretend database keeping the new rules: every call note the game writes must be let in."""
    await calls(run, part)
    den, slow = split_denied(run.relay.denied)
    line(part, 'calls: every read and write the game made was let in by the new rules', not den, f'{run.relay.ops} writes; refused: {den[:4]}; held back by a speed limit: {slow}')

# ---------------------------------------------------------------- every new screen on every screen size
async def screens(run, part='screens'):
    profs = list(PROFILES)
    b = await player(run, 'ZZTEST-BEN', 'ipad-portrait'); c = await player(run, 'ZZTEST-CATHERINE1', 'pc-1366')
    a = await player(run, 'ZZTEST-ANASTASIA2', profs[0]); await both_on(a, b, c)
    ok = await make_friends(a, b)
    await a.ev("()=>socSend(Object.keys(S.soc.fr)[0],'Hi Ben! Do you want to go to the Tree Park with me after school today?')"); await a.wait(1600)
    await b.ev("()=>socSend(Object.keys(S.soc.fr)[0],'Yes!! 🌲')"); await b.wait(1600); await a.ev("()=>socSend(Object.keys(S.soc.fr)[0],'Supercalifragilisticexpialidocious_and_a_very_long_word_without_any_spaces_in_it_at_all')"); await pump(a, b, c)
    await c.ev("()=>{const k=[...MP.peers.values()].find(p=>p.nm.startsWith('ZZTEST-ANA'));socAsk(k.so,k.nm);}"); await until("()=>socAskN()===1", a, [b, c])
    # one more friend who is away, one request of mine that waits, two blocked players: made with real keys, by hand
    await a.ev("""async()=>{const mk=async()=>{const kp=await crypto.subtle.generateKey(SOCEC,true,['deriveBits']);return b64u(await crypto.subtle.exportKey('raw',kp.publicKey));};
      const k1=await mk(),k2=await mk(),p=await socPair(k1);await SOC.ref.child('t/'+p.tid+'/s/'+(SOC.me.sid<socSid(k1)?'b':'a')).set({s:'y',at:socTS()});   /* (the away friend's own yes, so the list keeps them) */
      S.soc.fr[socSid(k1)]={k:k1,n:'ZZTEST-AWAYFRND',s:'ok',t:1};S.soc.fr[socSid(k2)]={k:k2,n:'ZZTEST-WAITING1',s:'out',t:1};S.soc.bl['z'.repeat(22)]='ZZTEST-BLOCKED';S.soc.bl['w'.repeat(22)]='ZZTEST-BLOCKED2';
      socThread(socSid(k1),k1);socThread(socSid(k2),k2);change();}""")
    await b.wait(4100); await b.ev("()=>socSay('Hello! Does anyone want to play football in the park?')"); await c.wait(1200); await c.ev("()=>socSay('Me! 🙋')"); await a.wait(1200); await a.ev("()=>socSay('Coming!')"); await pump(a, b, c)
    saveA = await stored(a); n_shots = 0; cards = []
    for i, prof in enumerate(profs):
        if i: await run.close(a); a = await player(run, 'ZZTEST-ANASTASIA2', prof, save=saveA); await both_on(a, b, c); await until("()=>Object.values(SOC.th).some(T=>T.msgs.length>=3)&&SOC.g.length>=3", a, [b, c], 20)
        async def shot(label): nonlocal n_shots; await a.step(2); await a.wait(120); await a.shot(f'{part}-{label}', both=True); n_shots += 2
        await phone(a); await shot('phone-home')
        await tap(a, '#card [data-a="phapp:mp"]'); await shot('friends')
        await a.ev("()=>{document.querySelector('#card .ph-screen').scrollTop=1e6;}"); await shot('friends-bottom')
        fk = await a.ev("()=>Object.keys(S.soc.fr).find(k=>S.soc.fr[k].n==='ZZTEST-BEN')")
        await a.ev("(k)=>ACT.fc(k)", fk); await shot('card'); await a.ev("()=>ACT.fask('rm')"); await shot('card-remove'); await a.ev("()=>ACT.fask('bl')"); await shot('card-block')
        await a.ev("()=>ACT.fc(Object.keys(S.soc.fr).find(k=>S.soc.fr[k].s==='out'))"); await shot('card-waiting')
        await a.ev("()=>ACT.fc(Object.keys(S.soc.fr).find(k=>S.soc.fr[k].s==='in'))"); await shot('card-request')
        await a.ev("()=>ACT.phapp('blk')"); await shot('blocked')
        await a.ev("()=>ACT.phapp('msg')"); await shot('messages')
        await a.ev("(k)=>ACT.sms(k)", fk); await shot('thread')
        r = await a.tap('#socIn'); await a.page.keyboard.type('typing…'); await shot('thread-typing'); await a.ev("()=>{$('socIn').value='';$('socIn').blur();}")
        fit = await a.ev("""()=>{const c=$('card'),ph=c.querySelector('.phone'),i=$('socIn');i.focus();c.style.maxHeight='300px';const r=ph.getBoundingClientRect(),q=i.getBoundingClientRect(),s=c.querySelector('.ph-screen');
          const o={h:Math.round(r.height),inView:q.bottom<=r.bottom+1&&q.top>=r.top,scroll:s.scrollHeight>s.clientHeight};c.style.maxHeight='';i.blur();return o;}""")
        await a.ev("()=>ACT.phapp('gc')"); await shot('world')
        await a.ev("()=>ACT.gline(SOC.g.find(m=>m.s!==SOC.me.sid).id)"); await shot('world-block-ask'); await a.ev("()=>ACT.gline('')")
        await a.ev("()=>{SET.wchat=false;renderPhone();}"); await shot('world-off'); await a.ev("()=>{SET.wchat=true;renderPhone();closePanel();}")
        await tap(a, '#bMenu'); await shot('settings'); await a.ev("()=>closePanel()")
        # the call card in its four looks (drawn without a real call)
        for stt in ('in', 'out', 'join', 'on'):
            box = await a.ev("(s)=>{SOC.call={sid:'x',T:null,id:'x',st:s,nm:'ZZTEST-ANASTASIA2',t1:performance.now()-83000,tap:s==='on'};socCallUI();const e=$('socCall'),r=e.getBoundingClientRect(),top=$('topbtns').getBoundingClientRect();" +
                             "const o={s,in:r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,small:[...e.querySelectorAll('button')].filter(b=>{const q=b.getBoundingClientRect();return q.width<44||q.height<44}).length,over:r.top<top.bottom&&r.right>top.left&&r.left<top.right,w:Math.round(r.width),h:Math.round(r.height)};return o;}", stt)
            await a.page.screenshot(path=os.path.join(run.shots, f'{part}-call-{stt}-{prof}.png')); cards.append((prof, box))
        await a.ev("()=>{clearInterval(SOC.ring);SOC.ring=0;SOC.call=null;socCallUI();}")
        line(part, f'{prof}: the typing bar stays inside the phone when the keyboard takes half the screen', fit['inView'] and fit['h'] <= 300, fit)
    iss = [i for i in a.issues]
    for g in run.all_games:
        if g is not a and g.name == a.name: iss += g.issues
    by = {}
    for i in iss:
        if i['k'] == 'small-target' and min(i.get('size', [99, 99])) >= 44: continue
        by.setdefault(i['k'], {}).setdefault(i['el'] + ' @' + i['at'].replace(part + '-', ''), i)
    for k, name in (('cut-off', 'nothing is cut off the screen'), ('overlap', 'no buttons overlap'), ('text-overflow', 'all text fits its box'), ('small-target', 'every button is at least 44 px for a finger'), ('low-contrast', 'text is readable in light and dark')):
        v = by.get(k, {}); line(part, f'{name} (the new screens, 10 screen sizes, light and dark, {n_shots} pictures)', not v, f'{len(v)} problems' + (': ' + '; '.join(f"{e} {v[e].get('size', '')} ({v[e]['profile']} {v[e]['theme']})"[:130] for e in list(v)[:6]) if v else ''))
    btn = [x for g in run.all_games for x in g.btn]; groups = {}
    for x in btn: groups.setdefault(x['cls'], set()).add((x['font'], x['rad'], x['bw']))
    mixed = {k: sorted(map(list, v)) for k, v in groups.items() if len(v) > 1}
    line(part, 'the same kind of button looks the same on every new screen', not mixed, f'{len(groups)} kinds' + (f'; MIXED {json.dumps(mixed)[:300]}' if mixed else ''))
    badc = [(p, x) for p, x in cards if not x['in'] or x['small'] or x['over']]
    line(part, 'the call card (ringing, calling, connecting, talking) is on the screen, clear of the top buttons, with buttons of 44 px or more, on all 10 sizes', not badc, badc[:4] or f'{len(cards)} cards looked at')
    e = errs(*[g for g in run.all_games]); line(part, 'no errors in the browser log', not e, e[:3])

# ---------------------------------------------------------------- an old version and a new one together
async def old(run, part='old'):
    if not LIVE: line(part, 'a live version was given (--live)', False, 'not given: this part did not run'); return
    a = await player(run, 'ZZTEST-OLDIE', 'ipad-landscape', build=LIVE); b = await player(run, 'ZZTEST-NEWBIE', 'pc-1366', 'dark')
    sees = await until("()=>MP.peers.size===1&&!![...MP.peers.values()][0].av", a, [b], 20) and await until("()=>MP.peers.size===1&&SOC.st==='on'&&!![...MP.peers.values()][0].av", b, [a], 20)
    sb = await st(b); before = await b.ev("()=>{const p=[...MP.peers.values()][0];return [p.rx,p.rz]}"); await a.ev("()=>{P.x+=3;}"); await pump(a, b, rounds=6); after = await b.ev("()=>{const p=[...MP.peers.values()][0];return [p.rx,p.rz]}")
    await a.ev(INSTR); await b.ev("()=>mpSay(0)"); heard = await until("()=>(window.__lastToast||'').includes('ZZTEST-NEWBIE')", a, [b])
    await phone(b, 'mp'); row = await b.ev("()=>{const r=[...document.querySelectorAll('#card .ph-row')].find(r=>r.textContent.includes('ZZTEST-OLDIE'));return r?[r.textContent,[...r.querySelectorAll('[data-a]')].map(x=>x.dataset.a.split(':')[0])]:null}")
    await b.shot(part + '-friends-app', both=True)
    line(part, 'a player on the live version and one on the new version see each other, walk and talk as before', bool(sees) and before != after and bool(heard), f"new sees {sb['peers']}; old heard the new one: {bool(heard)}; moved {before} -> {after}")
    line(part, "the older version has no ➕ (it cannot get requests), and its row is as before", bool(row) and row[1] == ['mpgo', 'mpvisit'], row)
    e = errs(a, b); line(part, 'no errors in the browser log (old and new)', not e, e[:3])

async def main():
    want = [p for p in (A.only.split(',') if A.only else ['friends', 'world', 'rules', 'soon', 'calls', 'callrules', 'screens', 'old']) if p]
    t0 = time.time()
    for p in want:
        print(f'[{p}: running]', flush=True); t = time.time()
        try:
            if p == 'friends':
                async with Run('soc-friends', OUT) as run: await friends(run); audit(p, run)
            elif p == 'world':
                async with Run('soc-world', OUT) as run: await world(run); audit(p, run)
            elif p == 'rules': await with_rules('soc-rules', 'firebase-rules.json', rules)
            elif p == 'soon': await with_rules('soc-soon', 'firebase-rules-before.json', soon)
            elif p == 'calls':
                async with CallRun('soc-calls', OUT) as run: await calls(run)
            elif p == 'callrules': await with_rules('soc-callrules', 'firebase-rules.json', callrules, CallRun)
            elif p == 'screens':
                async with Run('soc-screens', OUT) as run: await screens(run)
            elif p == 'old':
                async with Run('soc-old', OUT) as run: await old(run); audit(p, run)
        except Exception as e:
            import traceback; traceback.print_exc(); line(p, 'the test itself ran to its end', False, repr(e)[:300])
        print(f'[{p}: done in {round(time.time() - t)} s]', flush=True)
    bad = [l for l in LINES if not l[2]]
    print(f"SOCIAL TEST: {len(LINES) - len(bad)} of {len(LINES)} PASS" + (f' · {len(bad)} FAIL' if bad else '') + f' · {round((time.time() - t0) / 60)} min', flush=True)
    json.dump(LINES, open(os.path.join(OUT, 'social-result.json'), 'w'), indent=1)
    sys.exit(1 if bad else 0)

asyncio.run(main())
