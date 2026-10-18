"""The wrap-up's final block: the owner stopped the full check (18 Oct) after the save tests. This prints the lines of the stages that
finished exactly as they printed them, the end-of-run lines the kit computes from those stages (C6, C8, F6, F2a), and every line of the
stages that did not run as NOT VERIFIED. usage: python3 compose_final.py RUNDIR [--published F] [--github F]"""
import json, os, sys, hashlib, re, time
sys.path.insert(0, '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck')
import checks as C
RUN = sys.argv[1]; arg = dict(zip(sys.argv[2::2], sys.argv[3::2]))
md5 = lambda p: hashlib.md5(open(p, 'rb').read()).hexdigest()
DONE = ['files', 'counts', 'saves', 'players', 'claude', 'book']
R = {n: json.load(open(f'{RUN}/out/stages/{n}.json')) for n in DONE}
lines = [l for n in DONE for l in R[n]['lines']]
NV = 'NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)'
for cid, name in [('N1-N14', 'the night-3 lines (stage night3)'), ('N15-N41', 'the run-4 lines (stage run4)'),
                  ('C2', 'every spot and button does something (iPad finger taps; the walk-through)'), ('C2b', 'every area is reached by playing (the walk-through)'),
                  ('C3', 'walking works (every device)'), ('T1-T4', 'teacher job on iPad, sideways iPhone and PC'), ('K1', 'PC keyboard'),
                  ('C1', 'every screen opens (the device tests: iPhone upright and sideways, Android phones and tablets, PC 1366, light and dark)'),
                  ('C4', 'nothing cut off, no overlaps, text fits, buttons at least 44 px, readable (from the device tests)'), ('C5', 'the same kind of button looks the same everywhere (from the device tests)')]:
    lines.append([cid, name, None, NV])
errors = [e for n in DONE for e in R[n].get('errors', [])]; blocked = sorted(set(b for n in DONE for b in R[n].get('blocked', [])))
served = {}
for n in DONE:
    for k, v in R[n].get('served', {}).items(): served[k] = served.get(k, 0) + v
lines.append(['C6', 'zero errors in the browser log (the stages that ran)', not errors, f'{len(errors)} errors' + (': ' + ' | '.join(errors[:4]) if errors else '')])
lines.append(['C8', 'test copies never reached the real internet (the stages that ran)', not blocked, f'{len(blocked)} outside requests stopped' + (f': {blocked[:4]}' if blocked else '')])
lines.append(['C1-WK', "every screen in Safari's engine (iPhone, iPad)", None, "NOT RUN: Safari's engine is not installed on this computer"])
log = f'{RUN}/out/testlog_s3final.txt'; ok, det = C.check_log(log); lines.append(['F6', 'every test action is logged and undone', ok, det])
new_wb, new_c = f'{RUN}/new/github-new.html', f'{RUN}/new/claude-new.html'
want = {md5(new_wb), md5(new_c)}
lines.append(['F2a', 'the tests used exactly the files to publish', want <= set(served), f'files tested: {sorted(served)}; to publish: {sorted(want)}'])
if '--published' in arg: lines.append(['F2', 'published Claude version = tested file', md5(arg['--published']) == md5(new_c), f"{md5(arg['--published'])} vs {md5(new_c)}"])
else: lines.append(['F2', 'published Claude version = tested file', None, 'NOT RUN: not published yet'])
if '--github' in arg: lines.append(['F3', 'GitHub file after upload = new Claude version + same web part, same address', md5(arg['--github']) == md5(new_wb), f"{md5(arg['--github'])} vs {md5(new_wb)}"])
else: lines.append(['F3', 'GitHub file after upload = new Claude version + same web part, same address', None, 'NOT RUN: not uploaded yet'])
lines.append(['G', 'real devices, sound, smoothness, two real players online', None, 'NOT VERIFIED: in the "Try it for real" notebook until ticked'])
mins = round(sum(R[n].get('secs', 0) for n in DONE) / 60)
print('===== COZY TOWN FINAL CHECK =====')
print('2026-10-18 · check version 6 · update, full sweep for a big update · STOPPED by the owner after the save tests: stages files, counts, saves, players, claude and book ran; every other line NOT VERIFIED')
print(f"live Claude {md5(RUN + '/live/claude-form-of-github-live.html')} · new Claude {md5(new_c)} · live GitHub {md5(RUN + '/live/github-live.html')} · new GitHub {md5(new_wb)}")
for cid, name, ok, det in lines:
    print(f"{'PASS' if ok else ('NOT RUN' if ok is None and not str(det).startswith('NOT VERIFIED') else ('NOT VERIFIED' if ok is None else 'FAIL'))} | {cid} {name} | {det}")
fails = [l for l in lines if l[2] is False]; nr = [l for l in lines if l[2] is None]
print(f"RESULT: {'ALL PASS' if not fails else str(len(fails)) + ' FAIL'}" + (f', {len(nr)} not run or not verified' if nr else '') + f' · {mins} min of testing (stopped early)')
