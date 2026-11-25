"""Build cozy-check-v7.zip from cozy-check-v6.zip (owner's OK 23 Oct 2026).
Run from the repo root:  python3 tools/kit-v7/make_v7.py   -> writes cozy-check-v7.zip next to cozy-check-v6.zip.
v7 = v6 with the Claude-copy lines out: A1/A2 texts say GitHub, stage 'claude' (C7) and F2 removed, F2a = the GitHub file alone (29 Oct), N19's old-version friend = the night-3 game (29 Oct), F3 = the GitHub
file after upload is exactly the tested file, README steps for GitHub only. Stops if any edit does not match exactly once."""
import glob, hashlib, io, json, os, re, sys, zipfile
SRC, DST = 'cozy-check-v6.zip', 'cozy-check-v7.zip'
HEAD = '# Cozy Town check kit - for Claude in a new chat (check version 7, kit updated 23 Oct 2026)\nSince 22 Oct (the owner): ONLY THE GITHUB VERSION EXISTS. The game is index.html on branch main of cute-games/cozy-town (live at cute-games.github.io/cozy-town).\nThe old Claude copy (artifact) is dropped: no syncing, no publishing, no checks on it. Rules for updates: CLAUDE.md and HANDOFF.md in the repo.\nThe kit still tests an offline test copy of the game: strip_online.py removes the online part (online-part.json: 8 lines at the top - manifest, icons,\nHome Screen meta, theme-color - and 47 lines of Firebase scripts) and stops if they are not found. The "--live-claude/--new-claude" names mean that offline copy.\n1. Get the kit from the repo (no Artifact read of the final-check page needed):\n   curl -sL https://raw.githubusercontent.com/cute-games/cozy-town/main/cozy-check-v7.zip -o kit.zip && unzip -q kit.zip -d /home/claude/kit   (or use the repo clone)\n2. Newest live version, read right before the check:\n   curl -s https://raw.githubusercontent.com/cute-games/cozy-town/main/index.html -o /home/claude/kit/live/github-live.html\n   python3 cozycheck/strip_online.py live/github-live.html live/claude-form-of-github-live.html      (this is --live-claude)\n3. The new version: the new GitHub file (the pull request\'s branch tip) -> new/github-new.html;\n   python3 cozycheck/strip_online.py new/github-new.html new/claude-new.html      (this is --new-claude)\n4. Backup before an update (owner\'s OK 23 Oct): a dated branch on GitHub, backup-YYYY-MM-DD, made from main (git push origin origin/main:refs/heads/backup-YYYY-MM-DD,\n   or on github.com: branch menu -> type the name -> "Create branch from main"). Fetch its index.html from raw.githubusercontent.com/cute-games/cozy-town/backup-YYYY-MM-DD/index.html\n   and pass it with --backup and --backup-title "backup-YYYY-MM-DD". A2 compares it with the live GitHub file. To restore: a pull request that puts that branch\'s index.html back on main.\n5. Run (background; runs die between chat messages, so run the same command again to continue; finished stages are skipped):\n   cd /home/claude/kit && setsid nohup python3 -u cozycheck/cozy_check2.py --live-claude live/claude-form-of-github-live.html --new-claude new/claude-new.html \\\n      --live-web live/github-live.html --backup BACKUP.html --backup-title "backup-YYYY-MM-DD" --out /home/claude/kit/run --tag TAG [--full] > run.log 2>&1 < /dev/null &\n   Poll rarely (each poll is a chat turn that costs tokens): sleep as long as the tool allows between looks; read only the tail of run.log.\n   --full = the full sweep for big updates (decision 7 Oct): every screen on all 10 device sizes.\n   Safari\'s engine (WebKit) is not installed in this container, so C1-WK stays NOT RUN; real iPads and iPhones cover it in the notebook.\n   OUT/github-index.html (= new offline copy + the same online part) must be byte for byte new/github-new.html.\n6. Paste the block from "===== COZY TOWN FINAL CHECK =====" to "RESULT:" exactly as printed.\n7. After the owner merges the pull request: run again with --github <raw GitHub fetch of main> to fill F3 (the GitHub file is exactly the tested file).\nChanges in version 7 (23 Oct, owner\'s OK): A1 reads GitHub only; A2 = dated backup branch; stage \'claude\' (C7) and F2 removed; F3 = the GitHub file after upload\nis exactly the tested file; the old step 8 (publish and re-check the Claude copy) removed. Old kits (cozy-check-v4/v5/v5.1/v6.zip, cozy-night-kit.zip) are history only.\n'
def rep(s, a, b, n=1):
    if s.count(a) != n: sys.exit(f'STOP: expected {n} x {a[:60]!r}, found {s.count(a)}')
    return s.replace(a, b)
def fix_check(s):
    # B3 (25 Nov 2026, the owner's OK; new line, starts as FAIL): the friends key is stored the moment the game starts, is the same on 3 reopens, is carried
    # by Move my game, and a new game gets a new one while the kept old game keeps its own (tools/kit-v7/sockey.py)
    s = rep(s, "    d['lines'].append(L('B2', 'the new version keeps the same save key', 'same key: NO' not in det and 'same key: yes' in det, 'key cozytown-save-1'))\n",
            "    d['lines'].append(L('B2', 'the new version keeps the same save key', 'same key: NO' not in det and 'same key: yes' in det, 'key cozytown-save-1'))\n"
            "    ok3, det3 = False, 'not run'\n"
            "    try:\n"
            "        import sockey; ok3, det3 = await sockey.check_key(run, new_wb, FIX)\n"
            "    except Exception as e: ok3, det3 = False, f'the check stopped: {str(e)[:300]}'\n"
            "    d['lines'].append(L('B3', 'the friends key is made once and kept (25 Nov): in the stored save the moment the game starts, the same on 3 reopens, carried by Move my game, a new one for a new game while the kept old game keeps its own', ok3 is True, det3))\n")
    # C2b (25 Nov 2026, the owner: the Tree Park is in town, no separate place to enter). Old: every area of the live game, 'treepark' too, must be entered by the crawl.
    # New: the same for every other area; 'treepark' counts as reached only when N37 passed (it walks in through the gate and plays all three paths on 4 devices).
    s = rep(s, "    unreached = [x for x in all_areas if", "    if any(l[0] == 'N37' and l[2] is True for l in lines): reached.add('treepark')   # 25 Nov 2026: the Tree Park is in town; N37 walks in and plays it\n    unreached = [x for x in all_areas if")
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
    s = rep(s, "'GitHub file after upload = new Claude version + same web part, same address'", "'GitHub file after upload is exactly the tested file'", 2)
    # stage 'pfu' (31 Oct 2026, the Pets and Farm Update): new lines P1.. in pfu.py (tools/kit-v7/pfu.py), run after 'run4'. Nothing else changes.
    s = rep(s, "import run4 as R4\n", "import run4 as R4\nimport pfu as PF   # stage 'pfu' (31 Oct 2026): the Pets and Farm Update's lines P1..\n")
    s = rep(s, "ORDER = ['files', 'counts', 'saves', 'players', 'book', 'night3', 'run4'] +", "ORDER = ['files', 'counts', 'saves', 'players', 'book', 'night3', 'run4', 'pfu'] +")
    s = rep(s, "'run4': lambda run, d: R4.s_run4(run, d, live_w, new_wb, FIX, A.e1_limits)}", "'run4': lambda run, d: R4.s_run4(run, d, live_w, new_wb, FIX, A.e1_limits), 'pfu': lambda run, d: PF.s_pfu(run, d, live_w, new_wb, FIX)}")
    # E1 / N14 / N40 (1 Nov 2026, the owner Karolis in the foreman's chat, Pets and Farm Update stage 5): the Pet Shop room ('pets') may use up to 45,000 triangles
    # (the approved new 3-floor shop; was: +10% of the live shop's 15,363). Pieces stay +10%; the town and every other area keep their limits.
    # Old: --e1-limits default '' (every area +10%). New: default 'pets:0.10:=45000' ('=N' = an absolute cap); a value given on the command line replaces it as before.
    # E1 / N14 / N40 again (1 Nov 2026, the owner Karolis, full check of the Pets and Farm Update): the town ('city') may use up to 15% more pieces and 20% more
    # triangles (the farm, horse trail and jump field). Old: 'pets:0.10:=45000' (town +10% / +10%). New: 'pets:0.10:=45000,city:0.15:0.20'. Every other area keeps its limit.
    s = rep(s, "ap.add_argument('--e1-limits', default='',", "ap.add_argument('--e1-limits', default='pets:0.10:=45000,city:0.15:0.20',")
    return rep(s, "    lim_txt = ', '.join(f'{a} +{round(p*100)}% pieces / +{round(t*100)}% triangles' for a, (p, t) in per.items())\n",
               "    lim_txt = ', '.join(f'{a} {C.limit_txt(p)} pieces / {C.limit_txt(t)} triangles' for a, (p, t) in per.items())\n")
def fix_limits(s):
    # 1 Nov 2026 (stage 5, the owner's OK for the Pet Shop: up to 45,000 triangles): a per-area limit may be an absolute cap '=N' instead of a fraction.
    # Fractions work exactly as before; nothing else changes.
    s = rep(s, "        a, p, t = part.strip().split(':'); out[a] = (float(p), float(t))\n",
               "        a, p, t = part.strip().split(':'); out[a] = (lim_val(p), lim_val(t))\n")
    s = rep(s, "def parse_limits(spec):\n",
            "def lim_val(x):\n    x = x.strip()\n    return ('=', int(x[1:])) if x.startswith('=') else float(x)\n"
            "def limit_txt(v):\n    return f'up to {v[1]:,}' if isinstance(v, tuple) else f'+{round(v*100)}%'\n"
            "def parse_limits(spec):\n")
    return rep(s, "            if o[f] and n[f] > o[f] * (1 + lim): worse.append(f'{k} {\"pieces\" if f == \"meshes\" else \"triangles\"} {o[f]} -> {n[f]} (limit +{round(lim*100)}%)')\n",
               "            cap = lim[1] if isinstance(lim, tuple) else o[f] * (1 + lim)\n"
               "            if o[f] and n[f] > cap: worse.append(f'{k} {\"pieces\" if f == \"meshes\" else \"triangles\"} {o[f]} -> {n[f]} (limit {limit_txt(lim)})')\n")
def fix_readme(s):
    s = HEAD + s[s.index('Setup notes:'):]
    m = re.findall(r'Since 17 Oct the artifact service.*?report F2 as printed and explain it\.\n', s, flags=re.S)
    if len(m) != 1: sys.exit('STOP: F2 frame note not found exactly once')
    s = s.replace(m[0], '(17 Oct note on the artifact page frame and F2: moot since version 7, F2 is gone.)\n')
    return s + ('\nAdded 31 Oct 2026 (Pets and Farm Update, stage 1): stage \'pfu\' (pfu.py) with lines P1 saves (save version 2 and a round trip), P2 night skip,\n'
                'P3 morning bus home, P4 hats sit on the hair; later stages add their lines there. Quick kit: --only files,counts,saves,night3,run4,pfu.\n'
                'Fixtures added: save-prepet1-designer2.json (N8 needs it; it was only in tools/check-fixtures), save-prepfu-main.json (made by main a47bb1a, 31 Oct)\n'
                'and the saves of each finished stage of the update (save-pfu<N>-*.json).\n'
                'Added 1 Nov 2026 (stage 2, the pet brain): P5 one need and food groups, P6 sickness (built, switched off until the vet clinic), P7 vet booking,\n'
                'P8 bowl, naps and the healthy week, P9 friends see your pets for real and pet them, P10 the moves pack on every pet and its cost, P11 pets not\n'
                'left behind on long walks. PFU_ONLY=P5,P9 runs some of them. Fixture save-pfu2-stage2.json.\n'
                'Added 1 Nov 2026 (stage 4): P17 the vet station and the visit, P18 big-needs pets locked at Ms. Paws; P6 rewritten (old: sickness switched off\n'
                'until the vet clinic; new: switched on with the vet station in, the switch still proven both ways). Fixture save-pfu4-stage4.json,\n'
                'P17 reference pfu-trees-stage3.json. B1 rewritten (old: a pet\'s sickness timer "sad" compared exactly; new: like happiness, only\n'
                'as still there, because it moves while you play now that sickness is on).\n'
                'Added 1 Nov 2026 (stage 4b, owner\'s OK 1 Nov): size limit N14/N40 old -> new: index.html under 1.8 MB -> the joined game up to 3.0 MB, with the speed\n'
                'guard P19 (30+ fps on an iPad-sized view with 2 players, first load measured). P20 big-needs pets, P21 their homes and the snake tank, P22 waiting\n'
                'outside and the big-pet platform, P23 the new 3-floor Pet Shop, P24 today\'s pets redrawn. Rewritten (old -> new): B1 (sad only still there -> still\n'
                'there and within 0.1), P15 (10 gear pieces -> 15), P18 (board upstairs: old shop floor 2 -> top floor of the new shop), N28 (2 floors with 7 fenced areas -> one room with 3 floors and a spot per kind). Fixture save-pfu4b-*.json.\n'
                'Added 1 Nov 2026 (stage 5, the owner Karolis in the foreman\'s chat): E1/N14/N40 old -> new: the Pet Shop room (\'pets\') may use up to 45,000 triangles\n'
                '(was +10% of 15,363; pieces still +10%; every other area keeps its limit): --e1-limits now defaults to "pets:0.10:=45000" (\'=N\' = an absolute cap; a value\n'
                'given on the command line replaces it as before). P19 (30+ fps, iPad view, 2 players) stays and stays FAIL in a cloud browser with no GPU (NOT VERIFIED:\n'
                'measure on the real iPad); new P25: the new build is not slower than the live game in the same test browser (fps at least 90% of live\'s, first load at\n'
                'most 115%; fps: medians of 3 turns each (they swing up to 30% run to run here), the CPU time of a frame reported; first load: means of 2). P26 the Pet Show area, P27 tricks, P28 the Pet Show alone, P29 the Pet Show with friends, P30 the animal\n'
                'license. Rewritten (old -> new): P18 the bear\'s license line (stand-in -> the approved rules text), P10 (person moves on a person, not on pets), P17 (walls outside the clinic, without the park\'s west part where the approved Pet Show area stands). The license card\'s fonts (Alfa Slab One, Roboto Slab 700/800) are served locally like Baloo 2 (fonts.css). Fixture save-pfu5-stage5.json.\n'
                'Added 1 Nov 2026 (full check of the Pets and Farm Update, the owner Karolis): E1/N14/N40 old -> new: the town (\'city\') +10% pieces / +10% triangles ->\n'
                '+15% pieces / +20% triangles (the farm, horse trail and jump field): --e1-limits now defaults to "pets:0.10:=45000,city:0.15:0.20". Every other area keeps\n'
                'its limit. P19 and P25 keep their limits and keep running; they stay NOT VERIFIED until the owner measures on the real iPad.\n'
                'Added 2 Nov 2026 (picture pass 1): P37 big pets reach their homes round the house, P38 never inside a grown horse or cow, P39 bear and seal wait apart\n'
                'at every door, the cape on every kind\'s back, the Pet Show\'s big words end with it. Shots reframed (no line changed): P32 riding, N28 petshop-floors.\n')
def fix_checks(s):
    # B1 (1 Nov 2026, pets and farm update stage 4): sickness is switched on now, so a pet's sickness timer (pets.N.sad: minutes played at 0-1 hearts)
    # moves on every frame played, like happiness, and two loads a few frames apart differ in the third decimal (save-pfu2-stage2.json: 12.5 -> 12.513).
    # Old: compared exactly. New: compared like happiness, only as 'still there'. Everything else is compared as before.
    # B1 again (1 Nov 2026, stage 4b, the owner's ask): old (stage 4): 'sad' only as 'still there'; new: still there AND within 0.1 (minutes) of the saved value,
    # the same small tolerance P1 uses for a new pet's sad (it starts counting at once)
    s = rep(s, "            if path.startswith('pets.') and path.count('.') == 2 and k == 'happy': continue\n",
               "            if path.startswith('pets.') and path.count('.') == 2 and k == 'happy': continue\n"
               "            # 1 Nov 2026 (kit v7, pets and farm update stage 4): the sickness timer 'sad' drifts like happiness now that sickness is on: compared only as 'still there'\n"
               "            if path.startswith('pets.') and path.count('.') == 2 and k == 'sad':\n"
               "                if k not in b: out.append(f'{path}{k}: missing')\n"
               "                # 1 Nov 2026 (stage 4b, the owner's ask): the value is compared too, with a small tolerance like P1's (0.1 minute): two loads a few frames apart\n"
               "                elif not isinstance(b[k], (int, float)) or not isinstance(v, (int, float)) or abs(b[k] - v) > 0.1: out.append(f'{path}{k}: {v} -> {b[k]} (more than 0.1 apart)')\n"
               "                continue\n")
    # B1 (25 Nov 2026, the owner's OK; friends update, pull request #34): a save that never had a friends key (soc.k) gets a new random one when it loads, in the
    # live game and in the new one, so the two loads could never match (every old save showed 3 differences: soc.k.d, soc.k.x, soc.k.y).
    # Old: no rule for the key. New: like the player id: a save file with no key may get one (the note says so); a save that has a key must keep exactly
    # the same one. Nothing else is excused: the friends list (soc.fr) and the blocked list (soc.bl) are compared as before.
    s = rep(s, "        if 'laneT' not in fx: d = [x for x in d if x.split(':', 1)[0] != 'laneT']\n",
            "        if 'laneT' not in fx: d = [x for x in d if x.split(':', 1)[0] != 'laneT']\n"
            "        # 25 Nov 2026 (kit v7, the owner's OK): the same for the friends key soc.k (pull request #34): a save that never had one gets a new random key at\n"
            "        # load. A save that has one must keep exactly the same key. The friends and blocked lists (soc.fr, soc.bl) are always compared.\n"
            "        has_key = isinstance(fx.get('soc'), dict) and bool(fx['soc'].get('k'))\n"
            "        new_key = not has_key and any(x.startswith('soc.k.') for x in d)\n"
            "        if not has_key: d = [x for x in d if not x.startswith('soc.k.')]\n"
            "        # stricter (25 Nov): what the save FILE holds about friends (its key, friends list, blocked list) must be in the new version's load exactly,\n"
            "        # not only what the live version's load kept of it\n"
            "        if isinstance(fx.get('soc'), dict): d += [x for x in save_diff({'soc': fx['soc']}, {'soc': b.get('soc') or {}}) if x not in d]\n")
    # B1's fixture with friends (25 Nov): a friend stays on the list only while the shared database has the two players' thread (both said yes), so the fixture
    # save-soc1-friends.json comes with save-soc1-friends.online: those threads, put into the run's stand-in database before the save is loaded
    s = rep(s, "        go = await run.open(old_web, 'web', 'ipad-landscape', 'light', 'save-old', save=fx)\n",
            "        on_ = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixtures', fname[:-5] + '.online')   # 25 Nov 2026: what this save needs online (its friends' threads)\n"
            "        if fname.endswith('.json') and os.path.exists(on_):\n"
            "            for p_, v_ in json.load(open(on_)).items(): run.relay._set(p_, v_)\n"
            "        go = await run.open(old_web, 'web', 'ipad-landscape', 'light', 'save-old', save=fx)\n")
    s = rep(s, """{"; a Friends Lane time given (the save had none)" if new_lane else ""}""", """{"; a Friends Lane time given (the save had none)" if new_lane else ""}{"; new friends key given (the save had none)" if new_key else ""}""")
    return s
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
def fix_size(s):
    # N14 (1 Nov 2026, the owner's OK, Pets and Farm Update stage 4b): the size limit. Old: index.html (the joined game) under 1.8 MB. New: the joined game
    # up to 3.0 MB (3,000,000 bytes); the speed guard that goes with it is the new line P19 (30+ fps on an iPad-sized view with 2 players, first load measured).
    s = rep(s, "    if size >= 1.8e6: probs.append('index.html is 1.8 MB or more')\n", "    if size > 3.0e6: probs.append('the joined game is over 3.0 MB (limit since 1 Nov: 3.0 MB, owner\\'s OK; speed guard: P19)')\n")
    return rep(s, "a new area at most the beach\\'s size), measured against the starting file; index.html under 1.8 MB',", "a new area at most the beach\\'s size), measured against the starting file; the joined game up to 3.0 MB (owner\\'s OK 1 Nov; was under 1.8 MB; speed guard P19)',")
def fix_n40(s):
    # N40 (1 Nov 2026, as N14): old: index.html under 1.8 MB; new: the joined game up to 3.0 MB (it runs N14's own code)
    return rep(s, "others 10%); index.html under 1.8 MB'", "others 10%); the joined game up to 3.0 MB (owner\\'s OK 1 Nov; was under 1.8 MB; speed guard P19)'")
def fix_n28(s):
    # N28 (1 Nov 2026, Pets and Farm Update stage 4b, the owner's approved new Pet Shop: one room, 3 open floors, a cozy spot per kind, no pens).
    # Old: 2 floors, 7 fenced areas upstairs, each kind in its own area, shelves downstairs, the stairs (a fade), adopting a pug. New: tools/kit-v7/n28_new.py.
    i = s.index('async def n28(run, new_wb, FIX):')
    if s.count('async def n28(run, new_wb, FIX):') != 1: sys.exit('STOP: N28 not found exactly once')
    return s[:i] + open('tools/kit-v7/n28_new.py', encoding='utf-8').read()
def fix_n28_title(s):
    s = rep(s, "('N37', 'Tree park: each of the three paths can be finished; zip lines work; signs readable; free; a fall puts you back on the last platform; on every device'",
               "('N37', 'Tree park (rewritten 24 Nov: in town, a Roblox-style obby): walked into through the gate with no place change; each of the three paths played start to finish by real jumps; timer and best time saved; checkpoint flags light; zip lines work; signs readable; free; a fall puts you back on the last checkpoint; a save made in the old park starts at the gate; on every device'")
    return rep(s, "('N28', 'Pet shop: two floors; each kind in its own area upstairs, no kind in another\\'s area; clothes and snacks on shelves downstairs; adopting and buying still work'",
               "('N28', 'Pet shop (rewritten 1 Nov, stage 4b: the new shop): 3 open floors in one room; each kind at its own cozy spot, no kind at another\\'s spot, nobody leaves its spot; a shelf of snacks and the clothes rack on floor 1; the stairs walked up and down; adopting and buying still work'")
def fix_n9(s):
    # N9 (29 Oct, pet update 1: the owner's new hours, the Food truck is open 7:00-23:00). Old: at 21:00 the truck must not sell.
    # New: at 21:00 it must sell, and at 23:30 it must not (the same closed-hours test at the truck's new closing time). Nothing else changes.
    for a, b in N9_OLD: s = rep(s, a, b)
    return s
def fix_house4(s):
    # N33 (1 Nov, Pets and Farm Update stage 3, the owner's approved rules-garden-levels: garden levels 2 and 3 add 3 beds each at the back, save spots 36-41).
    # Old: the yard has exactly 36 spots (6 beds + 30 pots). New: exactly 42 (6 beds + 30 pots + the 6 back beds); every other part of the line is unchanged.
    return rep(s, """    if gd['plots'] != 36 or gd['pots'] != 30 or gd['garden'] < 6: probs.append(f"not 6 beds + 30 pots: {gd['plots']} spots, {gd['pots']} pots, {gd['garden']} slots")""",
               """    if gd['plots'] != 42 or gd['pots'] != 30 or gd['garden'] < 6: probs.append(f"not 6 beds + 30 pots + 6 back beds (garden levels 2 and 3): {gd['plots']} spots, {gd['pots']} pots, {gd['garden']} slots")""")
def fix_map4(s):
    # N26 (24 Nov 2026, the owner: "the mini map ... does not include the farm. Pressing it should expand and show everything"; and "we do not need the map
    # dot editor"). The corner map now shows the 64 m round you (north up, your arrow in the middle) from one picture of the whole world, and a tap opens
    # the big map for everyone. Old -> new:
    #  1. the pink arrow is looked for at your spot on the old whole-town map (MM0/MMW, gone) -> in the middle of the corner map (same pixel test, same radius)
    #  2. with a job the label must say 'dot color' (the picker) -> must say 'big map' (the picker is gone; the tap opens the big map)
    #  New checks (nothing removed): a tap on the corner map with a job opens the big map and no dot picker exists; every PLACES entry shown on the map and
    #  the farm's places are on the big map inside its bounds; the corner map draws (12+ colours) at the farm, on the horse trail and on Friends Lane;
    #  one corner-map drawing costs under 1 ms (200 drawings, the canvas read back after them)
    s = rep(s, "k=N/MMW,M=v=>(clamp(v,MM0+2,MM0+MMW-2)-MM0)*k,px=M(P.x),pz=M(P.z),cols=new Set();", "px=N/2,pz=N/2,cols=new Set();")
    s = rep(s, "if not r['shown'] or not r['txt'] or r['colours'] < 12 or 'dot color' not in (r['label'] or ''): probs.append(f'{prof}: corner map with the {jb} job wrong: {r}')",
               "if not r['shown'] or not r['txt'] or r['colours'] < 12 or 'big map' not in (r['label'] or ''): probs.append(f'{prof}: corner map with the {jb} job wrong: {r}')")
    s = rep(s, """        inside = await g.ev("()=>{S.job=null;__goto('salon');""", """        await g.ev("()=>{S.job='delivery';jobHud(true);miniTick(1);}"); await g.step(2); tp = await g.tap('#mmBtn'); await g.step(8)
        tb = await g.ev("()=>({on:MAPV.on,canvas:!!$('mapc'),picker:typeof openDot!=='undefined'||!!document.querySelector('[data-a^=dot]')})")
        det.append(f"{prof}: tap on the corner map with a job: {tp}, big map open {tb['on'] and tb['canvas']}, dot picker anywhere {tb['picker']}")
        if tp != 'ok' or not tb['on'] or not tb['canvas'] or tb['picker']: probs.append(f'{prof}: a tap on the corner map with a job does not open the big map, or the dot picker is still there: {tp} {tb}')
        await g.ev("()=>{closePanel();S.job=null;jobHud(true);}"); await g.step(3)
        if prof == 'ipad-landscape':
            pl = await g.ev("()=>{openPhone('map');const B=mapB(),it=new Set(mapItems().map(i=>i.k)),miss=[];for(const p of PLACES.filter(mapShown).concat(MAP_FARM)){const a=(MAP_AT[p.id]||[p.x,p.z]);if(!it.has(p.id)||a[0]<B.x1||a[0]>B.x2||a[1]<B.z1||a[1]>B.z2)miss.push(p.id);}const n=PLACES.filter(mapShown).length;closePanel();return {n,farm:MAP_FARM.map(p=>p.id),miss};}")
            det.append(f"{prof}: big map: {pl['n']} places + farm places {pl['farm']} inside its bounds, missing {pl['miss']}")
            if pl['miss'] or pl['n'] < 20 or len(pl['farm']) < 4: probs.append(f'{prof}: places missing from the big map: {pl}')
            for nm, js in (('farm', 'P.x=-100;P.z=-101;'), ('trail', 'P.x=-101;P.z=-152.4;'), ('lane', 'P.x=laneEnd()+40;P.z=0;')):
                r = await g.ev("(js)=>{__goto('city');S.job=null;jobHud(true);eval(js);miniTick(1);const cv=$('mm'),N=cv.width,d=cv.getContext('2d').getImageData(0,0,N,N).data,c=new Set();for(let q=0;q<d.length;q+=32)c.add((d[q]>>4)+','+(d[q+1]>>4)+','+(d[q+2]>>4));return {shown:!$('mmBtn').hidden,colours:c.size};}", js)
                det.append(f"{prof}: corner map at the {nm}: {r['colours']} colours"); await g.step(2); await g.shot('corner-map-' + nm, both=False)
                if not r['shown'] or r['colours'] < 12: probs.append(f'{prof}: the corner map at the {nm} is flat or hidden: {r}')
            c = await g.ev("()=>{P.x=-20;P.z=14;drawMini();const cv=$('mm'),t0=performance.now();for(let i=0;i<200;i++){P.x+=.05;drawMini();}cv.getContext('2d').getImageData(0,0,1,1);return +((performance.now()-t0)/200).toFixed(3);}")
            det.append(f"{prof}: one corner-map drawing {c} ms (200 in a row)")
            if not (c < 1): probs.append(f'{prof}: a corner-map drawing costs {c} ms (limit 1 ms)')
        inside = await g.ev("()=>{S.job=null;__goto('salon');""")
    return s
src = zipfile.ZipFile(SRC); out = io.BytesIO(); dst = zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED)
for info in src.infolist():
    data = src.read(info.filename)
    if info.filename == 'cozycheck/cozy_check2.py': data = fix_check(data.decode('utf-8')).encode('utf-8'); compile(data, info.filename, 'exec')
    if info.filename == 'cozycheck/README-KIT.md': data = fix_readme(data.decode('utf-8')).encode('utf-8')
    if info.filename == 'cozycheck/night3.py': data = fix_size(fix_n9(fix_night3(data.decode('utf-8')))).encode('utf-8'); compile(data, info.filename, 'exec')
    if info.filename == 'cozycheck/house4.py': data = fix_house4(data.decode('utf-8')).encode('utf-8'); compile(data, info.filename, 'exec')
    if info.filename == 'cozycheck/checks.py': data = fix_limits(fix_checks(data.decode('utf-8'))).encode('utf-8'); compile(data, info.filename, 'exec')
    if info.filename == 'cozycheck/run4.py': data = fix_n28_title(fix_n40(fix_run4(data.decode('utf-8')))).encode('utf-8'); compile(data, info.filename, 'exec')
    if info.filename == 'cozycheck/fonts.css': data = data + (b"@font-face{font-family:'Alfa Slab One';font-style:normal;font-weight:400;font-display:swap;src:url(https://fonts.gstatic.com/__cozytest/alfaslabone-400.woff2) format('woff2')}\n"
                                                             b"@font-face{font-family:'Roboto Slab';font-style:normal;font-weight:700;font-display:swap;src:url(https://fonts.gstatic.com/__cozytest/robotoslab-700.woff2) format('woff2')}\n"
                                                             b"@font-face{font-family:'Roboto Slab';font-style:normal;font-weight:800;font-display:swap;src:url(https://fonts.gstatic.com/__cozytest/robotoslab-800.woff2) format('woff2')}\n")
    if info.filename == 'cozycheck/map4.py': data = fix_map4(data.decode('utf-8')).encode('utf-8'); compile(data, info.filename, 'exec')
    if info.filename == 'cozycheck/pets4.py': data = fix_n28(data.decode('utf-8')).encode('utf-8'); compile(data, info.filename, 'exec')
    # N37 (24 Nov 2026, the owner: the Tree Park moves into town as a Roblox-style obby, no teleport). Old: tree4.py tested the separate park (LOC.treepark).
    # New: tools/kit-v7/tree4_new.py: the same checks in town (every path finished, zip lines, signs readable, free, a fall puts you back, the jump control,
    # the park no heavier than the beach, on 4 devices) played by real jumps, plus the walk in with no place change, the timer and best time, the checkpoint
    # flags, and a save made inside the old park starting at the gate.
    if info.filename == 'cozycheck/tree4.py': data = open('tools/kit-v7/tree4_new.py', 'rb').read(); compile(data, info.filename, 'exec')
    dst.writestr(info, data)
# fixtures that were only in tools/check-fixtures (31 Oct 2026): N8's save-prepet1-designer2.json, the save made by main before the
# Pets and Farm Update, and the saves made by each of its stages; and the stage 'pfu' module
have = {i.filename for i in src.infolist()}
for f in sorted(glob.glob('tools/check-fixtures/save-prepet1-designer2.json') + glob.glob('tools/check-fixtures/save-prepfu-*.json') + glob.glob('tools/check-fixtures/save-pfu*.json') + glob.glob('tools/check-fixtures/save-soc*.json')):   # (25 Nov: save-soc1-friends.json, a save with a friends key, 2 friends and 1 blocked player, for B1)
    n = 'cozycheck/fixtures/' + os.path.basename(f)
    if n in have: sys.exit(f'STOP: {n} is already in {SRC}')
    json.load(open(f)); dst.write(f, n)
    if os.path.exists(f[:-5] + '.online'): json.load(open(f[:-5] + '.online')); dst.write(f[:-5] + '.online', n[:-5] + '.online')   # (25 Nov: the threads a save with friends needs online)
pf = open('tools/kit-v7/pfu.py', 'rb').read(); compile(pf, 'cozycheck/pfu.py', 'exec'); dst.writestr('cozycheck/pfu.py', pf)
sk = open('tools/kit-v7/sockey.py', 'rb').read(); compile(sk, 'cozycheck/sockey.py', 'exec'); dst.writestr('cozycheck/sockey.py', sk)   # B3 (25 Nov)
dst.write('tools/kit-v7/pfu-trees-stage3.json', 'cozycheck/pfu-trees-stage3.json')
# the license card's fonts (1 Nov 2026, stage 5, screens-license-card: Alfa Slab One + Roboto Slab 700/800 from Google Fonts): the test copy serves them locally
# like Baloo 2 (npm @fontsource/alfa-slab-one 5.0.21 and @fontsource/roboto-slab 5.0.21, latin files); fonts.css gets their faces
for f in ('alfaslabone-400', 'robotoslab-700', 'robotoslab-800'): dst.write(f'tools/kit-v7/fonts/{f}.woff2', f'cozycheck/{f}.woff2')   # P17's reference: the town's trees outside the vet station (stage 4)
n3 = open(NIGHT3, 'rb').read()
if hashlib.md5(n3).hexdigest() != '709bf763d51be0160c118e2f9249f9f6': sys.exit(f'STOP: {NIGHT3} is not the night-3 game')
dst.writestr('cozycheck/night3-game.html', n3)
dst.close(); open(DST, 'wb').write(out.getvalue()); print(f'{DST}: {len(src.infolist())} files written')
