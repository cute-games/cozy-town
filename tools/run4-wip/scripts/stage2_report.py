# Stage 2 end: the section-0 rows, the "Stage 2 end" entry in section 1 (counts before/after, the A3 allowance, what the full check found), the full check's output (section 2),
# the stage-2 sections 3b/5b/6b/7b/9b and a line in 8. argv[1] = the full check's log; argv[2..] = "caption::logfile" reruns, in order.
import sys, re
p = '/home/user/cozy-town/tools/RUN-4-REPORT.md'; s = open(p, encoding='utf-8').read()
log = open(sys.argv[1], encoding='utf-8').read()
reruns = [(a.split('::', 1)[0], open(a.split('::', 1)[1], encoding='utf-8').read()) for a in sys.argv[2:]]
S = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad'
def lines(txt, pre): return [l.strip() for l in txt.splitlines() if re.match(r'\s*' + pre + r' \| ', l)]
final = {}
for txt in [log] + [t for _, t in reruns]:
    for l in lines(txt, '(?:PASS|FAIL)'):
        m = re.match(r'(PASS|FAIL) \| (\S+) ', l)
        if m: final[m.group(2)] = (m.group(1), l)
fails = sorted(k for k, v in final.items() if v[0] == 'FAIL')
a3 = next((l.strip() for l in log.splitlines() if '| A3 ' in l), '(A3 line not found)')
e1 = next((l.strip() for l in log.splitlines() if '| E1 ' in l), '(E1 line not found)')
verdict = 'every line passes' if not fails else ('every line passes but C2b (the crawl does not ride the bus, so it never reaches the beach by playing; the same in the stage-1 full check; section 5b)' if fails == ['C2b'] else 'fails: ' + ', '.join(fails))
row = "| 17. House parties and the dance game | yes | yes | N39 pass |\n"
assert row in s and 'Stage 2 end:' not in s
s = s.replace(row, row + f"| Stage 2 end: the stage-2 book (7 pages), version stamp 2026101801, counts before/after, full check (--full, night3 + run4), kit v6 zip, this report, PR \"Run 4, stage 2\" | yes | yes | full check{' + reruns' if reruns else ''}: {verdict} |\n", 1)
counts = open(S + '/counts2.md', encoding='utf-8').read().strip()
entry = f"""### Stage 2 end: the book, the stamp, the counts, the kit's A3 allowance, what the full check found
- The stage-2 What's new book: 7 pages (cover with four pictures and the credit line as it is; Your house grows; Holidays all year; Pet Shop upstairs & more furniture; New job: Photographer; The Tree Park; Parties and the dance-off), 1 to 3 short kid lines a page, 11 small webp pictures (184 KB) fresh from the stage's own pictures; the stage-1 pages kept in tools/books/run-4-stage-1-pages.js (the night-3 book was already there). index.html is 1.56 MB (limit 1.8).
- Version stamp: 2026101702 → 2026101801 (once, at the stage end; the automatic update of job 2 takes it at the next calm moment).
- Counts before and after stage 2 (the kit's counting code on the stage-1 end file a097543 and on this file; every other list unchanged; nothing lost but the four old pizza-tutorial text steps, below):

{counts}

- The kit's night-3 line A3 ("everything in the live game is still in the new one, by name") and the pizza tutorial: the owner's item 30 turned the 9 text steps into 5 picture steps (job 14), so A3 would list the old steps 6 to 9 as missing. The full check runs with `--agreed-removals "tutorial_steps:#5,tutorial_steps:#6,tutorial_steps:#7,tutorial_steps:#8"` (the kit's existing way to name an agreed removal; the four allowed removals of run 4 are game things that A3 never listed by name). Old → new: A3 old: "everything in the live game is still in the new one, by name (the agreed removals named on the command line)" → new: the same line, with the four old tutorial text steps named as agreed (the owner's item 30); nothing else is excused. The line stays exactly as strong for every other list.
- What the first full check found, and the fixes (all before this commit; the check ran again on the final file, section 2):
  - The Pet Shop's drawing work (N14/N40, E1 "pets up to double"): 7,811 → 18,733 triangles (+140%). Job 12's three new shelf units downstairs stood a food model every 32 cm (108 little models, the same density as the Market's); now every 50 cm in the Pet Shop (66 models; the Market keeps its 32 cm): the shop is within the agreed double. Nothing else changed.
  - The kit's night-3 line N12 (the big house) and its run-4 line N18 (the stairs' view, the visitor's house) still looked for the night-3 upstairs annex (LOC.home.up, UPX, shellG), which job 10 replaced with floors (L.fls, UPZ): rewritten to the floors, never weaker. N12 old: "upstairs = LOC.home.up with half-width 6; the stairs lead to homeFl() 1 at UPX" → new: "a second floor = LOC.home.fls.length ≥ 2, a full 12×10 floor; the stairs lead to floor 1 = one UPZ along z"; the saves, the piece counts, the 12×10 downstairs, the old layout, My stuff and the new upgrade are checked exactly as before. N18: the stairs' looks run on every floor's own shell (up on every floor but the top, down on every floor but the ground), and the visitor's floor count must equal the host's.
  - Old saves (B1): job 10's garden padded an old save's garden list from 6 to 36 entries on load, so the re-saved game differed from the original (nothing lost, but B1 counts every difference). The list keeps the length it was saved with now; a pot gets its entry when first used (gardenInit); the kit's N33 counts the used slots instead of 36.
  - Buttons (C5, "the same kind looks the same everywhere"): the tutorial card's Skip and Next (white buttons) were 18 px since night 3; job 14's ❓ button brought the card in front of the crawl, which saw them next to the 20 px white buttons. They are 20 px now.
  - N13 (the hairstylist on iPad) failed once with "could not take the job" (the job card tap found nothing); the same steps passed on the rerun and in a by-hand repeat with no change to the game: a one-off of the check's timing on the first page of the run (noted in 5b).
- The full check (`--full`, every stage, E1 limits city +15%/+25% and pets +100%, the new-area rule): {verdict}. A3: {a3[:300]}. E1: {e1[:400]}.
"""
m = '## 2. Check output per job, exactly as printed'; assert m in s; s = s.replace(m, entry + '\n' + m, 1)
# section 2: the full check and the reruns, exactly as printed
block = "### Stage 2 end: the full check (`--full`, stages night3 + run4)\n```\n" + log.rstrip('\n') + "\n```\n\n"
for cap, txt in reruns: block += f"### Stage 2 end: rerun, {cap}\n```\n" + txt.rstrip('\n') + "\n```\n\n"
m3 = '## 3. Before and after pictures'; assert m3 in s; s = s.replace(m3, block + m3, 1)
# the stage-2 sections, each after its stage-1 one
sec = open(S + '/stage2_sections.md', encoding='utf-8').read()
blocks = re.split(r'(?m)^(?=## \d+b\. )', sec)
for b in blocks:
    if not b.strip(): continue
    num = re.match(r'## (\d+)b\.', b).group(1)
    nxt = {'3': '## 4. ', '5': '## 6. ', '6': '## 7. ', '7': '## 8. ', '9': '## 10. '}[num]
    assert nxt in s; s = s.replace(nxt, b.rstrip('\n') + '\n\n' + nxt, 1)
m8 = '## 9. Decisions made alone (stage 1)'; assert m8 in s
s = s.replace(m8, "- Stage 2: reverting the pull request \"Run 4, stage 2\" puts the stage-1 file back (stamp 2026101702); tools/prerun4-index.html is still the exact starting file. The rollback copy with the bigger stamp comes at the end of stage 3.\n\n" + m8, 1)
open(p, 'w', encoding='utf-8').write(s); print('report: stage 2 end written;', verdict)
