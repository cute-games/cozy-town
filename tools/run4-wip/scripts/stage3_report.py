# Stage 3 end: the report's stage-3 parts. Reads everything from files, so it can run once the stage is done.
# usage: python3 stage3_report.py FULLCHECK.log STAMP "caption::rerunlog" ...
import json, re, sys, os
S = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad'
p = '/home/user/cozy-town/tools/RUN-4-REPORT.md'; s = open(p, encoding='utf-8').read()
log = open(sys.argv[1], encoding='utf-8').read(); stamp = sys.argv[2]
reruns = [(a.split('::', 1)[0], open(a.split('::', 1)[1], encoding='utf-8').read()) for a in sys.argv[3:]]
def lines(txt): return [l.strip() for l in txt.splitlines() if re.match(r'\s*(?:PASS|FAIL) \| ', l)]
final = {}
for txt in [log] + [t for _, t in reruns]:
    for l in lines(txt):
        m = re.match(r'(PASS|FAIL) \| (\S+) ', l)
        if m: final[m.group(2)] = (m.group(1), l)
fails = sorted(k for k, v in final.items() if v[0] == 'FAIL')
verdict = ('stopped by the owner after the save tests (18 Oct): every line that ran passes (files, counts, saves, the two players in the test room, the Claude version, the book); the walk-through, the device tests and the night-3 and run-4 lines did not run on the final file and are NOT VERIFIED' + ('' if not fails else '; reruns on earlier stage-3 builds failed: ' + ', '.join(fails))) if 'STOPPED by the owner' in log else 'every line passes' if not fails else ('every line passes but C2b (the crawl does not ride the bus, so it never reaches the beach by playing; the same in the stage-1 and stage-2 full checks)' if fails == ['C2b'] else 'fails: ' + ', '.join(fails))
G = json.load(open(f'{S}/glitches.json', encoding='utf-8'))
n = {}
for g in G: n[g['status']] = n.get(g['status'], 0) + 1
gsum = f"{len(G)} entries: " + ', '.join(f'{v} {k}' for k, v in sorted(n.items()))
scores = open(f'{S}/critic-scores.md', encoding='utf-8').read()
tbl = scores[scores.index('| part'):scores.index('## What the critics said')].strip()
passes = open(f'{S}/stage3/pass-notes.md', encoding='utf-8').read().strip() if os.path.exists(f'{S}/stage3/pass-notes.md') else ''
# 0. progress
row = '| Stage 2 end:'
i = s.index(row); j = s.index('\n', i)
s = s[:j + 1] + f"| 19. Stage 3: the GLITCH HUNTER pass (photographer, change-spotter, viewers, double-checker, reporter, fixer, fix-checker) and the critic loops; version stamp {stamp}; the rollback copy; full check; this report; PR \"Run 4, stage 3\" | partly: passes 1 to 7, five critic rounds, the stamp, the rollback copy, the counts and the full check; pass 8 and critic round 6 are open (the owner's wrap-up, 18 Oct; kept on the branch claude/run-4-wip) | yes | glitch list tools/GLITCH-LIST-4.md ({gsum}); critic loop: see section 4; full check: {verdict} |\n" + s[j + 1:]
notes = open(f'{S}/stage3/wrapup-notes.md', encoding='utf-8').read().strip()
k = s.index('(filled in after every job; if the session restarts: undo any half-done job, carry on from the next one)')
k2 = s.index('\n', k)
s = s[:k2 + 1] + '\n' + notes + '\n' + s[k2 + 1:]
# 1. every change: the stage-3 entry
entry = f"""### Job 19 / stage 3: the GLITCH HUNTER pass and the critic loops
- How it ran: {passes}
- Every fix of the pass, old → new, is in tools/GLITCH-LIST-4.md (one entry per cause, with the viewer marks it covers, a before and an after picture): {gsum}.
- The critic loops (section 4): six parts, a fresh critic each round, done after three scores of 8 or more in a row. Five rounds ran; the tree park is done; round 6, the last, is open (the owner's wrap-up).
- Version stamp: → {stamp} (once, at the stage end). tools/prerun4-rollback.html is the starting file with the stamp {int(stamp) + 49} (section 8).
- The What's new book: no new pages (stage 3 fixed things; it added nothing a child would look for); the dance page's picture was taken again with the drawn arrows.
- Kit v6 lines touched: N37 finds the ladder button where the game put it (the signposts moved together); N39 reads the invitation card (it is the notification now, with the host's name and the two buttons) and, at the end of a round, checks that the view stays on the two dancers while the result card shows (old → new in section 5c). Two kit helpers changed, no check line: a tap waits for a popping-up phone or card around its button, and N15's sleep-screen picture waits for the screen to fade in (section 5c). None is weaker.
- Full check (`--full`): {verdict}.
"""
m = '## 2. Check output per job, exactly as printed'; assert m in s and 'Job 19 / stage 3' not in s; s = s.replace(m, entry + '\n' + m, 1)
# 2. the full check and reruns
block = "### Stage 3 end: the full check (`--full`), stopped by the owner after the save tests; the final block is made from the stages that ran, every other line NOT VERIFIED\n```\n" + log.rstrip('\n') + "\n```\n\n"
for cap, txt in reruns: block += f"### Stage 3 end: rerun, {cap}\n```\n" + txt.rstrip('\n') + "\n```\n\n"
m3 = '## 3. Before and after pictures'; s = s.replace(m3, block + m3, 1)
# 3c, 4, 5c, 6c, 7c, 9c from the sections file
sec = open(f'{S}/stage3/stage3_sections.md', encoding='utf-8').read()
sec = sec.replace('{{CRITIC_TABLE}}', tbl).replace('{{GSUM}}', gsum)
blocks = re.split(r'(?m)^(?=## \d+c?\. )', sec)
for b in blocks:
    if not b.strip(): continue
    head = re.match(r'## (\d+)(c?)\.', b)
    num, c = head.group(1), head.group(2)
    if num == '4' and not c:
        # section 4 is replaced whole (it was "to come" in stages 1 and 2)
        i = s.index('## 4. '); j = s.index('## 5. '); s = s[:i] + b.rstrip('\n') + '\n\n' + s[j:]
    else:
        nxt = {'3': '## 4. ', '5': '## 6. ', '6': '## 7. ', '7': '## 8. ', '9': '## 10. '}[num]
        s = s.replace(nxt, b.rstrip('\n') + '\n\n' + nxt, 1)
# 8. how to go back: the rollback copy exists now
s = s.replace('- tools/prerun4-rollback.html is made at the end of stage 3 (the starting file with the stamp the last stage shipped + 49). Until then: tools/prerun4-index.html is the exact starting file',
              f'- tools/prerun4-rollback.html: made at the end of stage 3: the starting file (night 3, stamp 2026101701) with the stamp {int(stamp) + 49}, bigger than any stamp run 4 shipped, so putting it live makes every run-4 player\'s game go back by itself at the next calm moment. tools/prerun4-index.html is still the exact starting file', 1)
s = s.replace('## 9. Decisions made alone (stage 1)', f"- Stage 3: reverting the pull request \"Run 4, stage 3\" puts the stage-2 file back (stamp 2026101801).\n\n## 9. Decisions made alone (stage 1)", 1)
open(p, 'w', encoding='utf-8').write(s); print('report: stage 3 written;', verdict)
