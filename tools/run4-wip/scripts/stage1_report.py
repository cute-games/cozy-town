# Stage 1 end: section 0 line, the full check's output (section 2), sections 3-10 for stage 1. argv[1] = the full check's log, argv[2] = the A3 counts line text (optional)
import sys, re
p='/home/user/cozy-town/tools/RUN-4-REPORT.md'; s=open(p,encoding='utf-8').read()
log=open(sys.argv[1],encoding='utf-8').read()
a3=next((l.strip() for l in log.splitlines() if '| A3 ' in l), '(A3 line not found)')
e1=next((l.strip() for l in log.splitlines() if '| E1 ' in l), '(E1 line not found)')
fails=[l.strip() for l in log.splitlines() if re.match(r'\s*FAIL \|', l)]
row="| 9. Small things and the stage-1 book | yes | yes | N27, N29, N35, N41 pass; book stage W1/W2 pass (7 pages) |\n"
assert row in s
s=s.replace(row,row+f"| Stage 1 end: version stamp 2026101702, full check, kit v6 zip, this report, PR \"Run 4, stage 1\" | yes | yes | full check: {len(fails)} FAIL lines{(' (' + '; '.join(f[:80] for f in fails[:3]) + ')') if fails else ''}; counts: {a3[a3.find('|',10)+1:].strip()[:160]} |\n")
tail=f"""

### Stage 1: the full check (--full, --e1-limits "city:0.15:0.25,pets:1.0:1.0", --backup tools/prerun4-index.html)
```
{log[log.index('[stage files'):].replace('EXIT 0','').rstrip() if '[stage files' in log else log.rstrip()}
```

## 3. Before and after pictures, and the "should look like" lines (stage 1)
All in tools/pictures-4/ (the three before-pictures of the Flower Corner from the start of the run, the after-pictures named by job above). Every job's entry in section 1 carries its "should look like (BUILDER)" line; stage 3 checks against them:
- Flower Corner: after-flower-corner-gate-open-october-night.png, after-flower-corner-spooky-path.png, after-flower-corner-gate-closed-november.png
- Signs: after-pet-show-sign-october.png
- Look fixes: after-food-truck.png, after-soft-clouds-day.png, after-soft-clouds-night.png, after-leaves-from-the-crowns.png, before-apartment-wall-noon-streaks.png, after-apartment-wall-noon.png
- Map: after-corner-map-no-job-ipad.png, after-corner-map-no-job-iphone.png, after-big-map-iphone.png
- Grandmas: after-grandmas-pond.png, after-grandma-at-a-place.png
- Small things: after-pond-no-bridge.png, after-pond-ducks.png, after-trash-soda-can.png, after-trash-banana-peel.png, after-notepad-switch-off.png
- The stage-1 book: the book stage's shots (book-page-1 … 7 on four devices) in the full check's out/shots.

## 4. The glitch list and the critic loop scores
Stage 3 (tools/GLITCH-LIST-4.md). Nothing yet.

## 5. Glitches found and not fixed (stage 1)
- The apartment block's east wall still shows a faint diagonal shade on its shadow side for about 10 game-minutes around 12:30 (mean pixel step .38 against .92 before and .05–.27 elsewhere): the shadow map at a near-edge-on sun. Barely visible; on the list for stage 3.
- In October the stage garland's pendants hang among the Pet Show pennants (moved up so they clear the sign).
- The corner tree at the apartments stands 21 cm from the wall; its crown looks close to the wall from the road (it never enters it).

## 6. NOT VERIFIED (stage 1)
- Real devices (iPad, iPhone, a PC with Safari/Chrome): everything here ran in headless Chromium at iPad, iPhone and PC sizes with a software renderer; WebKit was not installed.
- Sound (the scare sounds, the talk and pop sounds) and how the scares feel to a child.
- Two real players at once: the players stage used the kit's fake relay, not Firebase.
- The real holiday dates (the check fakes the date through realDate()).
- Device clocks that are far wrong (the server Date header offset is read on load; not tried against a wrong clock).
- The automatic update on a real GitHub Pages deploy (tested with a faked newer file).

## 7. Try it for real (stage 1)
- [ ] Open the game on two devices at the same time: same time of day, weekday and weather on both; the clock pill shows no day number.
- [ ] Go to bed at night: the sleep screen waits for 7:00 (Wake up gets you up earlier). Nothing is skipped.
- [ ] In October: buy a costume at the Clothes Shop, wear it, ask a friend if they see it; walk the spooky path at the Flower Corner after 18:00 (five soft scares); ghosts over the pavements.
- [ ] Find the three grandmas: two on the duck-pond bench at some point (crumbs, ducks coming), one at a shop; say hi twice (different lines).
- [ ] Without a job: the round corner map top-left; tap it, the big map opens; turn around: the arrow turns with you.
- [ ] Look at the clouds by day and night, the food truck, the leaves falling from the trees, the apartment block's wall at noon.
- [ ] Pick up a can, a cup, a paper ball and a banana peel; the pond has no bridge; ⚙️ Settings → Notepad Off/On.
- [ ] Read the What's new book on the title screen (7 pages).

## 8. How to go back
- tools/prerun4-rollback.html is made at the end of stage 3 (the starting file with the stamp the last stage shipped + 49). Until then: tools/prerun4-index.html is the exact starting file (md5 709bf763d51be0160c118e2f9249f9f6), and reverting the pull request "Run 4, stage 1" restores main.

## 9. Decisions made alone (stage 1)
Listed per job in section 1 ("Decided alone"). The bigger ones: the one clock's epoch and day length (job 1); the automatic update at calm moments only (job 2); costumes drawn over the clothes, the spooky path at the Flower Corner with a gate (jobs 3, 4); signs centred by the pixels that show against their colour (job 5); the truck moved rather than the flower bed, the corner tree moved to the fence, the edge-on shadow rule (job 6); the corner map's tap opens the big map without a job (job 7); 80-second grandma turns anchored to the real UTC day (job 8); the bridge's own feeding spot went with it (job 9).

## 10. Firebase
No new paths and no rule changes in stage 1: everything new that others see travels in optional presence fields (v, hm.W/D, gd, lk.co), which old versions ignore.
"""
s=s.rstrip('\n')+tail
open(p,'w',encoding='utf-8').write(s); print('stage-1 sections written;', len(fails), 'FAIL lines in the full check'); print(a3); print(e1[:300])
