"""Build cozy-check-v7.zip from cozy-check-v6.zip (owner's OK 23 Oct 2026).
Run from the repo root:  python3 tools/kit-v7/make_v7.py   -> writes cozy-check-v7.zip next to cozy-check-v6.zip.
v7 = v6 with the Claude-copy lines out: A1/A2 texts say GitHub, stage 'claude' (C7) and F2 removed, F2a = the GitHub file alone (29 Oct), N19's old-version friend = the night-3 game (29 Oct), F3 = the GitHub
file after upload is exactly the tested file, README steps for GitHub only. Stops if any edit does not match exactly once."""
import hashlib, io, re, sys, zipfile
SRC, DST = 'cozy-check-v6.zip', 'cozy-check-v7.zip'
HEAD = '# Cozy Town check kit - for Claude in a new chat (check version 7, kit updated 23 Oct 2026)\nSince 22 Oct (the owner): ONLY THE GITHUB VERSION EXISTS. The game is index.html on branch main of cute-games/cozy-town (live at cute-games.github.io/cozy-town).\nThe old Claude copy (artifact) is dropped: no syncing, no publishing, no checks on it. Rules for updates: CLAUDE.md and HANDOFF.md in the repo.\nThe kit still tests an offline test copy of the game: strip_online.py removes the online part (online-part.json: 8 lines at the top - manifest, icons,\nHome Screen meta, theme-color - and 47 lines of Firebase scripts) and stops if they are not found. The "--live-claude/--new-claude" names mean that offline copy.\n1. Get the kit from the repo (no Artifact read of the final-check page needed):\n   curl -sL https://raw.githubusercontent.com/cute-games/cozy-town/main/cozy-check-v7.zip -o kit.zip && unzip -q kit.zip -d /home/claude/kit   (or use the repo clone)\n2. Newest live version, read right before the check:\n   curl -s https://raw.githubusercontent.com/cute-games/cozy-town/main/index.html -o /home/claude/kit/live/github-live.html\n   python3 cozycheck/strip_online.py live/github-live.html live/claude-form-of-github-live.html      (this is --live-claude)\n3. The new version: the new GitHub file (the pull request\'s branch tip) -> new/github-new.html;\n   python3 cozycheck/strip_online.py new/github-new.html new/claude-new.html      (this is --new-claude)\n4. Backup before an update (owner\'s OK 23 Oct): a dated branch on GitHub, backup-YYYY-MM-DD, made from main (git push origin origin/main:refs/heads/backup-YYYY-MM-DD,\n   or on github.com: branch menu -> type the name -> "Create branch from main"). Fetch its index.html from raw.githubusercontent.com/cute-games/cozy-town/backup-YYYY-MM-DD/index.html\n   and pass it with --backup and --backup-title "backup-YYYY-MM-DD". A2 compares it with the live GitHub file. To restore: a pull request that puts that branch\'s index.html back on main.\n5. Run (background; runs die between chat messages, so run the same command again to continue; finished stages are skipped):\n   cd /home/claude/kit && setsid nohup python3 -u cozycheck/cozy_check2.py --live-claude live/claude-form-of-github-live.html --new-claude new/claude-new.html \\\n      --live-web live/github-live.html --backup BACKUP.html --backup-title "backup-YYYY-MM-DD" --out /home/claude/kit/run --tag TAG [--full] > run.log 2>&1 < /dev/null &\n   Poll rarely (each poll is a chat turn that costs tokens): sleep as long as the tool allows between looks; read only the tail of run.log.\n   --full = the full sweep for big updates (decision 7 Oct): every screen on all 10 device sizes.\n   Safari\'s engine (WebKit) is not installed in this container, so C1-WK stays NOT RUN; real iPads and iPhones cover it in the notebook.\n   OUT/github-index.html (= new offline copy + the same online part) must be byte for byte new/github-new.html.\n6. Paste the block from "===== COZY TOWN FINAL CHECK =====" to "RESULT:" exactly as printed.\n7. After the owner merges the pull request: run again with --github <raw GitHub fetch of main> to fill F3 (the GitHub file is exactly the tested file).\nChanges in version 7 (23 Oct, owner\'s OK): A1 reads GitHub only; A2 = dated backup branch; stage \'claude\' (C7) and F2 removed; F3 = the GitHub file after upload\nis exactly the tested file; the old step 8 (publish and re-check the Claude copy) removed. Old kits (cozy-check-v4/v5/v5.1/v6.zip, cozy-night-kit.zip) are history only.\n'
def rep(s, a, b, n=1):
    if s.count(a) != n: sys.exit(f'STOP: expected {n} x {a[:60]!r}, found {s.count(a)}')
    return s.replace(a, b)
def fix_check(s):
    s = rep(s, "CHECK_VERSION = '6'   #", "CHECK_VERSION = '7'   # v7 (23 Oct, owner's OK): the Claude copy of the game is gone (22 Oct), so A1/A2 texts say GitHub, stage 'claude' (C7) and F2 are removed, F3 = the GitHub file after upload is exactly the tested file. Earlier: ")
    s = rep(s, "'newest live versions read right before the check'", "'newest live GitHub version read right before the check'")
    s = rep(s, "'dated private backup of the live game'", "'dated backup branch of the live GitHub game'", 3)
    s = rep(s, "'live GitHub version = live Claude version + web part, nothing else'", "'live GitHub version = its offline test copy + web part, nothing else'")
    s = rep(s, "ORDER = ['files', 'counts', 'saves', 'players', 'claude', 'book',", "ORDER = ['files', 'counts', 'saves', 'players', 'book',")
    m = re.findall(r"\n    if A\.published: p = rb\(A\.published\); lines\.append\(L\('F2'.*?\n    else: lines\.append\(L\('F2'.*?\n", s)
    if len(m) != 1: sys.exit('STOP: F2 lines not found exactly once')
    s = s.replace(m[0], '\n')
    # F2a (29 Oct, first full v7 check): the Claude copy was only loaded by stage 'claude', removed above, and is no longer published,
    # so the files to publish are the GitHub file alone (old: the GitHub file and the Claude copy; new: the GitHub file)
    s = rep(s, "    want = {md5b(new_wb)} | ({md5b(new_c)})\n", "    want = {md5b(new_wb)}   # v7: the Claude copy is no longer published (22 Oct)\n")
    return rep(s, "'GitHub file after upload = new Claude version + same web part, same address'", "'GitHub file after upload is exactly the tested file'", 2)
def fix_readme(s):
    s = HEAD + s[s.index('Setup notes:'):]
    m = re.findall(r'Since 17 Oct the artifact service.*?report F2 as printed and explain it\.\n', s, flags=re.S)
    if len(m) != 1: sys.exit('STOP: F2 frame note not found exactly once')
    return s.replace(m[0], '(17 Oct note on the artifact page frame and F2: moot since version 7, F2 is gone.)\n')
NIGHT3 = 'tools/prerun4-index.html'   # the night-3 game (md5 709bf763), the live file of run 4: it does not know costumes
def fix_run4(s):
    # N19 (29 Oct, the owner's decision): its old-version friend was the live file, which knows costumes since run 4, so the line failed for every
    # new file. Old: the live file reads a costume in presence. New: the night-3 game reads it (as in every run-4 check). Nothing else changes.
    s = rep(s, "    o = await begin(run, live_w, 'pc-1366', 'n19-old',", "    o = await begin(run, open(os.path.join(HERE, 'night3-game.html'), 'rb').read(), 'pc-1366', 'n19-old',")
    return rep(s, 'det.append(f"an old version reading a costume in presence:', 'det.append(f"an old version (the night-3 game) reading a costume in presence:')
N8_OLD_START = "    # a new 2-room order, played to the end\n"
N8_OLD_END = "    if not fin2['done'] or s2['coins'] - r2['c0'] < 40 or s2['done'] != 1 or s2['o']: probs.append('the 2-room order did not finish and pay for both rooms')\n"
N8_NEW = """    # new orders are one room (pet update 1): 40 new clients, none asks for two rooms (an old caller's dsNew(2) too)
    r2 = await g.ev(\"\"\"()=>{__setClock(null,11);const out={n:0,two:0,and:0};for(let i=0;i<41;i++){ds().done=0;ds().o=null;i<40?dsNew():dsNew(2);const o=S.ds.o;if(!o)continue;out.n++;if(o.r2)out.two++;
      const m=msgs().cl.slice(-1)[0];if(m&&/ and an? |other room/.test(m.x))out.and++;}ds().o=null;return out;}\"\"\")
    det.append(f"{r2['n']} new orders: {r2['two']} with 2 rooms, {r2['and']} messages asking for two rooms")
    if r2['n'] != 41 or r2['two'] or r2['and']: probs.append('a new order asks for two rooms (or no order was made)')
    errs = g.errors[:]; await run.close(g)
    # a 2-room order saved unfinished (room 1 done, room 2 empty) plays to the end and pays for both rooms
    g = await begin(run, new_wb, 'ipad-landscape', 'n8-designer2', fx(FIX, 'save-prepet1-designer2.json'))
    r2 = await g.ev(\"\"\"()=>{__goto('city');__setClock(null,11);const o=S.ds&&S.ds.o;if(!o||!o.r2)return {err:'no saved 2-room order'};return {h:o.h,th1:o.th,th2:o.r2.th,n1:o.items.length,c0:S.coins,d0:ds().done};}\"\"\")
    if r2.get('err'): await run.close(g); return False, '; '.join(det) + ' | ' + r2['err']
    await g.ev("()=>enterClient()")
    for _ in range(8):
        await g.step(6); await g.wait(150)
        if await g.ev("()=>CUR.id==='client'&&!fading"): break
    await g.shot('designer-room-1', both=False)
    # not done yet: room 2 is empty
    await g.ev("()=>{dsFinishAsk();}"); early = await g.ev("()=>({has:!!document.querySelector('#card [data-a=\\"dsgo\\"]'),txt:$('card').textContent.slice(0,120)})"); await g.ev("()=>closePanel()")
    det.append(f"saved 2-room order ({r2['h']}: {r2['th1']} + {r2['th2']}), room 1 has {r2['n1']} things; 'All done?' with room 2 empty offers to call the client: {early['has']}")
    if early['has']: probs.append("'All done?' let you finish with an empty room 2")
    await g.ev("()=>dsGoRoom(1)")
    for _ in range(8):
        await g.step(6); await g.wait(150)
        if await g.ev("()=>!fading&&(S.ds.o.ri|0)===1"): break
    a2 = await g.ev(\"\"\"()=>{const T=dsTheme(S.ds.o),R=DROOM[T.room],must=(R.must||[])[0]||[R.items[0]];const t=must[0],F=FURN[t];const it={u:uid(),t,c:F.cols?F.cols[0]:null,x:0,z:-CLD+F.d/2+.02,r:0};dsItems().push(it);addClItem(it);
      const t2=R.items.find(k=>FURN[k]&&!FURN[k].flat&&k!==t)||t,F2=FURN[t2],it2={u:uid(),t:t2,c:F2.cols?F2.cols[0]:null,x:-CLW+F2.w/2+.02,z:0,r:1};dsItems().push(it2);addClItem(it2);return {ri:S.ds.o.ri|0,n:dsItems().length,T:T.n,r1:S.ds.o.items.length};}\"\"\")
    await g.shot('designer-room-2', both=False)
    det.append(f"room 2 ({a2['T']}) has {a2['n']} things, room 1 still {a2['r1']}")
    if a2['ri'] != 1 or a2['n'] < 2 or a2['r1'] < 2: probs.append('room 2 did not work')
    await g.ev("()=>{dsFinishAsk();}"); t2 = await g.tap('#card [data-a="dsgo"]'); await g.step(2)
    fin2 = await g.ev(REV_LOOP)
    s2 = await g.ev("()=>({coins:S.coins,done:ds().done,o:!!(S.ds&&S.ds.o),last:(msgs().cl.slice(-1)[0]||{}).x||'',st:window.__dsLast||null})")
    det.append(f"2-room review: go tapped {t2}, ended {fin2['done']} after {fin2['n']} rounds, paid {s2['coins'] - r2['c0']} 🪙, rooms today {r2['d0']} -> {s2['done']}, client said {s2['last'][:80]!r}")
    if not fin2['done'] or s2['coins'] - r2['c0'] < 40 or s2['done'] != r2['d0'] + 1 or s2['o']: probs.append('the saved 2-room order did not finish and pay for both rooms')
    errs += g.errors[:]
"""
N8_OLD_TAIL = "    errs = g.errors[:]; await run.close(g)\n    if errs: probs.append(f'browser errors: {errs[:2]}')\n    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')\n\n# ---------------- N9 food"
N8_NEW_TAIL = "    await run.close(g)\n    if errs: probs.append(f'browser errors: {errs[:2]}')\n    return not probs, '; '.join(det) + (f' | PROBLEMS: {probs}' if probs else '')\n\n# ---------------- N9 food"
def fix_night3(s):
    # N8 (29 Oct, pet update 1, the owner's OK): new designer orders are one room; a 2-room order saved unfinished still finishes.
    # Old: 'a 2-room order plays to the end and pays' (made new with dsNew(2)). New: 41 new orders (dsNew() x40, dsNew(2) x1) are all one room
    # with no two-room message, and the saved unfinished 2-room order (fixture save-prepet1-designer2.json) plays to the end and pays for both rooms;
    # the saved 1-room order part is unchanged.
    a = s.index(N8_OLD_START); b = s.index(N8_OLD_END) + len(N8_OLD_END)
    if s.count(N8_OLD_START) != 1 or s.count(N8_OLD_END) != 1: sys.exit('STOP: N8 block not found exactly once')
    s = s[:a] + N8_NEW + s[b:]
    s = rep(s, N8_OLD_TAIL, N8_NEW_TAIL)
    return rep(s, "('N8', 'Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes',", "('N8', 'Designer: new orders are one room; a saved unfinished 2-room order plays to the end and pays; a saved 1-room order still finishes',")
N9_OLD = [("        shut = await g.ev(\"\"\"()=>{__setClock(null,21);", "        late = await g.ev(\"\"\"()=>{__setClock(null,21);"),
          ("        det.append(f\"truck: tap buy burger {tp}, you have {have}; at 21:00: card opens {shut['open']}, bought {shut['bought']} ({shut['toast'][:40]!r})\")\n",
           "        shut = await g.ev(\"\"\"()=>{__setClock(null,23.5);const t=LOC.city.inter.find(t=>/food truck/i.test(typeof t.label==='function'?t.label():t.label));window.__lastToast='';t.act();const o=UI.open;let bought=false;if(o){S.coins=500;const n=S.bag.fries|0;ACT.buy('fries');bought=(S.bag.fries|0)>n;}closePanel();__setClock(null,12);return {open:o,bought,toast:window.__lastToast};}\"\"\")\n"
           "        det.append(f\"truck: tap buy burger {tp}, you have {have}; at 21:00: card opens {late['open']}, bought {late['bought']}; at 23:30: card opens {shut['open']}, bought {shut['bought']} ({shut['toast'][:40]!r})\")\n"),
          ("        if shut['bought']: probs.append('the truck sold food after 20:00')\n",
           "        if not late['bought']: probs.append('the truck did not sell food at 21:00 (open 7:00-23:00 since pet update 1)')\n        if shut['bought']: probs.append('the truck sold food after 23:00')\n")]
def fix_n9(s):
    # N9 (29 Oct, pet update 1: the owner's new hours, the Food truck is open 7:00-23:00). Old: at 21:00 the truck must not sell.
    # New: at 21:00 it must sell, and at 23:30 it must not (the same closed-hours test at the truck's new closing time). Nothing else changes.
    for a, b in N9_OLD: s = rep(s, a, b)
    return s
src = zipfile.ZipFile(SRC); out = io.BytesIO(); dst = zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED)
for info in src.infolist():
    data = src.read(info.filename)
    if info.filename == 'cozycheck/cozy_check2.py': data = fix_check(data.decode('utf-8')).encode('utf-8'); compile(data, info.filename, 'exec')
    if info.filename == 'cozycheck/README-KIT.md': data = fix_readme(data.decode('utf-8')).encode('utf-8')
    if info.filename == 'cozycheck/night3.py': data = fix_n9(fix_night3(data.decode('utf-8'))).encode('utf-8'); compile(data, info.filename, 'exec')
    if info.filename == 'cozycheck/run4.py': data = fix_run4(data.decode('utf-8')).encode('utf-8'); compile(data, info.filename, 'exec')
    dst.writestr(info, data)
n3 = open(NIGHT3, 'rb').read()
if hashlib.md5(n3).hexdigest() != '709bf763d51be0160c118e2f9249f9f6': sys.exit(f'STOP: {NIGHT3} is not the night-3 game')
dst.writestr('cozycheck/night3-game.html', n3)
dst.close(); open(DST, 'wb').write(out.getvalue()); print(f'{DST}: {len(src.infolist())} files written')
