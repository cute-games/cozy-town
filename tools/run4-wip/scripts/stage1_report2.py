# Stage 1 end: the section-0 line, the stage-1 end entry in section 1 (the friends' wedge fix, the kit fixes, the night-3 lines old -> new), the full check's output and the reruns (section 2), sections 3-10 for stage 1.
# argv[1] = the full check's log; argv[2..] = "caption::logfile" reruns, in order
import sys, re
p = '/home/user/cozy-town/tools/RUN-4-REPORT.md'; s = open(p, encoding='utf-8').read()
log = open(sys.argv[1], encoding='utf-8').read()
reruns = [(a.split('::', 1)[0], open(a.split('::', 1)[1], encoding='utf-8').read()) for a in sys.argv[2:]]
def lines(txt, pre):
    return [l.strip() for l in txt.splitlines() if re.match(r'\s*' + pre + r' \| ', l)]
a3 = next((l.strip() for l in log.splitlines() if '| A3 ' in l), '(A3 line not found)')
e1 = next((l.strip() for l in log.splitlines() if '| E1 ' in l), '(E1 line not found)')
# the final state of every line: the last run of each id wins (the full check first, then the reruns in order)
final = {}
for txt in [log] + [t for _, t in reruns]:
    for l in lines(txt, '(?:PASS|FAIL)'):
        m = re.match(r'(PASS|FAIL) \| (\S+) \|', l)
        if m: final[m.group(2)] = (m.group(1), l)
fails = sorted(k for k, v in final.items() if v[0] == 'FAIL' and k != 'X')   # X = a stage crash; both crashes (the run4 table's comma, the PC keys stage run alone) were rerun whole, see the reruns
todo = [k for k in fails if 'not proved' in final[k][1]]
real = [k for k in fails if k not in todo]
row = "| 9. Small things and the stage-1 book | yes | yes | N27, N29, N35, N41 pass; book stage W1/W2 pass (7 pages) |\n"
assert row in s and 'Stage 1 end:' not in s
s = s.replace(row, row + f"| Stage 1 end: version stamp 2026101702, full check, the friends' wedge fix, kit v6 zip, this report, PR \"Run 4, stage 1\" | yes | yes | full check + reruns: every line passes except the {len(todo)} run-4 lines of jobs still to come ({', '.join(todo)}){'; still failing: ' + ', '.join(real) if real else ''}; counts: {a3[a3.find('|', 10) + 1:].strip()[:200]} |\n")

# section 1: the stage-1 end entry, before section 2
entry = """### Stage 1 end: what the full check found (the friends' wedge, four kit gaps) and the night-3 lines old → new
- Friends walking round each other (found by the night-3 line N3 in the full check). Old: when a friend or pet walked towards its spot and another one stood right in the way, the "keep 0.8 m apart" push sent it straight back, so it stopped dead behind the other one (Theo stuck 0.8 m behind Rosie, both meant to stand in front of you; the live game does the same when the pets happen to crowd the friends, 2 of 2 kit runs on the new file, 0 of 3 on the live file by luck of where the pets wandered). New: `fPush` notices when the push would run against the way it is going (the other one is in the way, not beside it) and slips sideways round it instead; standing friends still step back radially as before. Test N3 (3 kit runs after the fix: 4 of 4 friends in view, 1.47–1.54 m apart at both stops).
- Start-up time (found by N15 in the full check, "loads in under 1 s"). Old: job 5's sign centring measured every text by reading its pixels back from a full-size scratch canvas; in a tablet-like browser each read came back from the graphics chip at about 0.4 s, so `startGame` took 11.2 s on the check machine (the live file: 0.1 s) and every sign built later cost the same again. New: the scratch canvas is kept in main memory (`willReadFrequently`), big text is measured at 48 px and scaled back up, a text is measured once (a small memo, cleared when the web font arrives). `startGame` is back to 80 ms on the same machine; the signs' centring is unchanged (N23 rerun). Tests N15, N23.
- Kit v6 gaps the full check showed (all in the kit, not the game): the run4 line table had lost a comma between N40 and N41 (Python read the two as a call and the whole stage crashed in 1 s: "'tuple' object is not callable"); a stage crash now names its file and line in the FAIL text; N11's "old version" is now whatever was live before the run (the run-4 starting file already knows the night-3 breeds and shows a pug as a pug, which the test called "did not cope"); N18 read the grandmas through the pre-job-8 fields (`GRAN.benches`) and crashed, it now compares each grandma's turn, place, out and sitting; N24 compared the two devices' grandma places only with their clocks 1 s apart against a 1.3 m limit (1 s of walking is 1.15 m, and the rest was frame rounding): it now compares them at the same clock moment (within 0.35 m, same turn and stop) and with the clocks 1 s apart (within 1.7 m). K1 (the PC keys line from kit v2) opened the Market at whatever hour the shared clock had and found it shut at 20:50 ("Closed · opens at 8:00"); it now sets noon first like the other lines. N15's clock-chip rule did not allow the Pet Show trophy that marks Saturdays since night 3 ("10:10 🏆 Sat"); it now allows the trophy and still nothing else but the time and the weekday. N15's "loads in under 1 s" first looked like a busy machine (the full check and two reruns ran at once: 10.5 s and 18.1 s), but alone it still measured 9.2 s: the real cause was the sign measuring above.
- The night-3 lines whose subject changed today, rewritten, never weaker (kit v5.1 → v6):
  - N1 old: "Holidays: Halloween 17 Oct-1 Nov, Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene" → new: "Holidays: Halloween 1-31 Oct (run 4), Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene" (the test fakes 1 Oct, 31 Oct and 1 Nov as well as the old dates).
  - N6 old: "Grandmas: out in dry daytime; inside in rain, snow and at night; their bench is full while they sit" → new: "Grandmas (rewritten for run 4): the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit" (it counts exactly three, checks the duck-pond bench's two seats instead of the 12 house benches, and that a player can sit there once they have gone).
  - N10 old: "Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors" → new: the same words; the test behind it now gives both players the shared clock (`__clockMs`) instead of a day number, so "the same clock" means the one clock of run 4 (5 clock moments, the weather the same at all 5).
  - N14 old: "Smooth and light: E1 within the agreed limits, measured with Halloween on, rain on and the animals out; index.html under 1.8 MB" → new: "Smooth and light (rewritten for run 4): E1 within the run-4 limits given to the check (town up to 15% more pieces and 25% more triangles, measured with Halloween, rain and the ghosts on; pet shop up to double; every other area 10%; a new area at most the beach's size), measured against the starting file; index.html under 1.8 MB" (N40 in the run4 stage is the same measurement under the run-4 wording).
- Should look like (BUILDER): when you stop walking, all four friends come round in front of you and stand in a loose arc at least 1.2 m apart, none hidden behind another; a friend arriving late steps round the one in its way instead of stopping behind it.
- Decided alone: the sideways slip is only for a mover whose push runs against its own direction (the standing one still steps back as before), so nothing else about following changes.

"""
k = s.index('## 2. Check output'); s = s[:k] + entry + s[k:]

def block(txt):
    t = txt[txt.index('[stage files'):] if '[stage files' in txt else txt
    return t.replace('EXIT 0', '').rstrip()
tail = f"""

### Stage 1: the full check (--full, --e1-limits "city:0.15:0.25,pets:1.0:1.0", --backup tools/prerun4-index.html); the night-3 line N3 found the friends' wedge, N11 the kit's old-version gap, and the run4 stage crashed on the kit's missing comma
```
{block(log)}
```
"""
for cap, txt in reruns:
    tail += f"\n### Stage 1: {cap}\n```\n{block(txt)}\n```\n"
tail += f"""
### Stage 1: the last state of every line after the reruns
PASS: {', '.join(k for k in sorted(final, key=lambda x: (len(x), x)) if final[k][0] == 'PASS')}
FAIL, jobs still to come (every run-4 line starts as FAIL and passes only on proof): {', '.join(todo)}
FAIL, anything else: {', '.join(real) if real else 'none'}

## 3. Before and after pictures, and the "should look like" lines (stage 1)
All in tools/pictures-4/ (the three before-pictures of the Flower Corner from the start of the run, the after-pictures named by job above). Every job's entry in section 1 carries its "should look like (BUILDER)" line; stage 3 checks against them:
- Flower Corner: after-flower-corner-gate-open-october-night.png, after-flower-corner-spooky-path.png, after-flower-corner-gate-closed-november.png
- Signs: after-pet-show-sign-october.png
- Look fixes: after-food-truck.png, after-soft-clouds-day.png, after-soft-clouds-night.png, after-leaves-from-the-crowns.png, before-apartment-wall-noon-streaks.png, after-apartment-wall-noon.png
- Map: after-corner-map-no-job-ipad.png, after-corner-map-no-job-iphone.png, after-big-map-iphone.png
- Grandmas: after-grandmas-pond.png, after-grandma-at-a-place.png
- Small things: after-pond-no-bridge.png, after-pond-ducks.png, after-trash-soda-can.png, after-trash-banana-peel.png, after-notepad-switch-off.png
- Friends in front of you after the wedge fix: after-friends-in-front.png
- The stage-1 book: the book stage's shots (book-page-1 … 7 on four devices) in the full check's out/shots.

## 4. The glitch list and the critic loop scores
Stage 3 (tools/GLITCH-LIST-4.md). Nothing yet.

## 5. Glitches found and not fixed (stage 1)
- The apartment block's east wall still shows a faint diagonal shade on its shadow side for about 10 game-minutes around 12:30 (mean pixel step .38 against .92 before and .05–.27 elsewhere): the shadow map at a near-edge-on sun. Barely visible; on the list for stage 3.
- In October the stage garland's pendants hang among the Pet Show pennants (moved up so they clear the sign).
- The corner tree at the apartments stands 21 cm from the wall; its crown looks close to the wall from the road (it never enters it).
- The first full check's N3 run also had Finn (the fourth friend) out of the picture once at the second stop (1.62 m apart, the fallback spots); the same cause (one friend stuck behind another until the spots were dealt again); not seen in 7 runs since the fix.

## 6. NOT VERIFIED (stage 1)
- Real devices (iPad, iPhone, a PC with Safari/Chrome): everything here ran in headless Chromium at iPad, iPhone and PC sizes with a software renderer; WebKit was not installed.
- Sound (the scare sounds, the talk and pop sounds) and how the scares feel to a child.
- Two real players at once: the players stage used the kit's fake relay, not Firebase.
- The real holiday dates (the check fakes the date through realDate()).
- Device clocks that are far wrong (the server Date header offset is read on load; not tried against a wrong clock).
- The automatic update on a real GitHub Pages deploy (tested with a faked newer file).
- The 1-second load rule (N15) on a real tablet: here it is timed in headless Chromium on an idle machine.

## 7. Try it for real (stage 1)
- [ ] Open the game on two devices at the same time: same time of day, weekday and weather on both; the clock pill shows no day number.
- [ ] Go to bed at night: the sleep screen waits for 7:00 (Wake up gets you up earlier). Nothing is skipped.
- [ ] In October: buy a costume at the Clothes Shop, wear it, ask a friend if they see it; walk the spooky path at the Flower Corner after 18:00 (five soft scares); ghosts over the pavements.
- [ ] Find the three grandmas: two on the duck-pond bench at some point (crumbs, ducks coming), one at a shop; say hi twice (different lines).
- [ ] Without a job: the round corner map top-left; tap it, the big map opens; turn around: the arrow turns with you.
- [ ] Look at the clouds by day and night, the food truck, the leaves falling from the trees, the apartment block's wall at noon.
- [ ] Pick up a can, a cup, a paper ball and a banana peel; the pond has no bridge; ⚙️ Settings → Notepad Off/On.
- [ ] Walk with four friends and three pets, stop by a fence: all four come round in front of you, none stuck behind another.
- [ ] Read the What's new book on the title screen (7 pages).

## 8. How to go back
- tools/prerun4-rollback.html is made at the end of stage 3 (the starting file with the stamp the last stage shipped + 49). Until then: tools/prerun4-index.html is the exact starting file (md5 709bf763d51be0160c118e2f9249f9f6), and reverting the pull request "Run 4, stage 1" restores main.

## 9. Decisions made alone (stage 1)
Listed per job in section 1 ("Decided alone"). The bigger ones: the one clock's epoch and day length (job 1); the automatic update at calm moments only (job 2); costumes drawn over the clothes, the spooky path at the Flower Corner with a gate (jobs 3, 4); signs centred by the pixels that show against their colour (job 5); the truck moved rather than the flower bed, the corner tree moved to the fence, the edge-on shadow rule (job 6); the corner map's tap opens the big map without a job (job 7); 80-second grandma turns anchored to the real UTC day (job 8); the bridge's own feeding spot went with it (job 9); the sideways slip for a friend or pet whose way is blocked by another, and measuring text at 48 px in main memory (stage 1 end).

## 10. Firebase
No new paths and no rule changes in stage 1: everything new that others see travels in optional presence fields (v, hm.W/D, gd, lk.co), which old versions ignore.
"""
s = s.rstrip('\n') + tail
open(p, 'w', encoding='utf-8').write(s)
print('stage-1 sections written; final FAIL ids:', fails); print('still failing beyond the jobs to come:', real); print(a3); print(e1[:300])
