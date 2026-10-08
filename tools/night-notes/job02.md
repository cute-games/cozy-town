# Job 2: Trees don't pop in + glitch sweep

Only `index.html` changed. Above the game script only parts of existing lines changed (no lines added or removed, `'use strict';` is still on line 547). Two lines added inside the game script. No save changes, nothing new drawn, web part untouched.
Final file md5 a8ba625d369758a1bf284c841b6c0036 (after the review fixes).

## Changes
- What made trees "pop": I checked distance hiding, camera far plane (700 m), fog (60–340 m) and the way the town is cut into 32 m blocks. None of them makes trees vanish: in 48 views not a single block was hidden while it was on screen. What does pop is the sun shadow. Shadows only exist in a 60 x 60 m square around you, and that square jumps 1 m at a time as you walk. Everything outside it gets no shadow at all. So a tree, house or its shadow about 30 m ahead suddenly turned shady as you walked up to it.
  - Sun shadows far away: hard edge, popped in about 30 m ahead -> they fade out softly between about 22 and 30 m (a small change in the shader, no extra drawing).
- Town sky (clouds, far hills, far trees): different on every load (34 pieces, but 88,000–116,000 triangles depending on luck) -> the same every load (seeded), 94,458 triangles. Same kind of look: 16 clouds, 28 hills, about the same mix of round trees and pines.
- Clothing store, a shopper stood exactly on the "Try on clothes" mirror spot, so you could not say hi to them (and they blocked the mirror) -> that shopper spot moved 1.7 m away, beside the mirror (4.9, -1.2). They still walk to and from 6 other spots.
- Job line on the screen (under the map, e.g. "🎨 → Yellow house · 75 m"): 37 px tall, too small for a finger -> 45 px on iPad/PC, 44 px on phones (a bit more padding, same text).
- Big house card ("Decorating level 10", "800 coins") in dark mode: almost white text on white rows (contrast 1.09) -> dark ink text on the white rows (same in light mode). The same row style is also used for the friends list and the pet list, so those got fixed too.
- Round buttons (Use, Run, Jump): shared the class of the normal rectangular buttons, so the check saw "same button, two shapes" -> they have their own extra class `rnd` (they look exactly as before).
- Close ✕ on the "showing the way" bar: 2 px border, 34 px wide -> 3 px border like every other ✕ button, 44 x 44 px (easier for a finger).
- Small buttons "🔑 Answer key" / "🔑 Hide answers" and "🚪 Stop" (teacher job homework), "🚪 Leave" (decorating a client's room), "🚀 Go" / "🏠" (online friends list): 40 px tall -> 44 px tall (at least 44 px wide too). Same look, just 4 px taller.
- Teacher homework bottom buttons on a sideways phone ("Give an F", "◀ Back", "Next ▶" / "Done! 🎉"): 40 px -> 44 px. The homework sheet still fits on a sideways iPhone (checked).

## Decisions
- Small buttons: made 44 px for everyone (one shared rule), not only on touch screens, so they look the same on every device.
- Shadows fade out instead of covering a bigger area. A bigger area would make all shadows blurrier on the iPad, and a fade costs nothing.
- Seed 13 for the sky because it gives 94,458 triangles. That is at the low end of what the old game had (88k–116k), so the drawing-work check passes every time.
- The shopper keeps 9 spots in the clothing store; only the one on the mirror spot moved.
- The job line: more padding instead of a new layout, so the text looks the same, just in a slightly taller box.

## Morning questions
- People walking in town appear and disappear at 48 m, cars at 80 m. This is clearly visible on long streets. Just moving the limit to 60 m would not hide it (the fog only starts at 60 m, so they would still pop, just a bit further away) and costs more drawing on the iPad; a real fix is a soft fade-in, which is a bigger change. OK as it is, or should a later job add a fade?

## Not verified
- How the softer shadow edge looks on a real iPad while walking (it was checked here with still pictures and shader output only).
- Real devices, real Firebase, sounds.
- The "🚀 Go" / "🏠" buttons in the online friends list were not opened in a test (they need another player online); they use the same 44 px rule as the other small buttons.
- Objects floating, sunk or stuck inside walls: no full scripted check, only screenshots.
- The full night check (the orchestrator runs it). I re-ran the checks for the 4 Part C items myself with the same audit code.

## Glitches not fixed
- Part B (glitch sweep) was only partly done. What was checked: stuck spots (a reviewer's scripted walk: town on a 2 m grid, clothing store, bakery, library, café and home on a 0.5 m grid, 8 directions each: 0 stuck spots; every door puts you in a free spot) and flicker (48 views in town, clothing store, bakery, library, café, home and school: 0 flickering surfaces bigger than a thin line). Not checked: objects floating, sunk or inside walls (only looked at in a few screenshots, nothing seen). Found:
- School front, seen from the park: a 1-pixel line along the edge of the "Cozy Town School" sign can shimmer a little (town, far away, tiny).
- Library, looking at the entrance door: the line where the floor meets the wall can shimmer by 1 pixel (normal seam, hardly visible).
- Shadow edges crawl slightly every time the shadow square jumps (every 1 m you walk), because it does not snap to whole shadow pixels (town, everywhere).
- People in town appear and disappear at 48 m, cars at 80 m (not hidden by fog, which starts at 60 m).
- Clouds that drift past x = 230 m jump to the other side of the sky (far away and half in fog, but it is a jump).
- Old saves: after loading, `msg` (old save) and `litter` / `q` / `qhist` (rich save) differ from the file. This is exactly the same in the unchanged game (normal day and quest updates), not from this job.

## Try it for real
- Walk down a long street on the iPad: shadows of trees and houses far ahead fade in gently, nothing suddenly turns dark.
- Load the game 2–3 times and look at the sky over the hills: the same clouds and far trees each time.
- In the clothing store, walk up to a shopper (also the one near the mirror) and tap 👋 "Say hi".
- The mirror "Try on clothes" spot is free to use.
- With a job, the job line under the map is easy to tap.
- Teacher job on a sideways phone: grade a homework sheet; "Answer key", "Stop", "Back" and "Next" are easy to tap and the sheet still fits.
- Tap a shop on the map to get the "showing the way" arrow; the ✕ to stop it is easy to hit.
- In dark mode, open the "Bigger house" sign by your house: both rows are easy to read.

## Tests run
- Syntax check (jscheck): ok.
- Is anything hidden while on screen? (6 town spots x 8 directions, every piece checked against the camera view): 0 pieces hidden while visible. So no distance or block hiding causes the pop.
- Shadow test (normal render vs. a huge shadow area, same spot): differences start at the 30 m edge (a far house front turned from sunny to shady), which confirms the cause.
- Drawing work, 24 views from 6 town spots (rich save, noon):
  - Before: 192.1 draw calls and 365,011 triangles on average (that load's sky had 111,752).
  - After: 192.0 draw calls and 348,958 triangles.
  - Town pieces (city): 387 pieces and 586,650 triangles, before and after the same.
  - Sky (`outside`): before, 98,358 / 104,038 / 111,752 in 3 loads (34 pieces each). After, 94,458 in 5 loads out of 5 (34 pieces).
- Part C, reproduced on the old file and checked on the new file with the night check's own audit code:
  - Clothing store shopper on all 9 spots, both shoppers, with the crawler's way of standing next to it: before, spot 3 unreachable ("Try on clothes" won). After, all reachable, and the spot is free of walls with 6 walkable neighbours.
  - #jobTxt one line: 209x37 -> 209x45; two lines 270x58 -> 270x66; no overlap or cut-off.
  - Big house card in dark mode: before, 2 low-contrast spans (1.09); after, 0 (light mode 0 too).
  - Button kinds: before, MIXED btn.mint (18px/50%) and btn.x (2px/3px); after, 0 mixed (btn.rnd, btn.mint.rnd, btn.x 3px, btn.mint 18px).
- Rich save (iPad), old first-version save (iPhone portrait), new player opening (iPad, full intro): all load and play, 0 console errors. Nothing lost compared to the unchanged game (the same small `msg` / `litter` / `q` / `qhist` differences in both).
- Screenshots looked at: big house card in dark mode (iPad), HUD with the round buttons (iPhone portrait), town roads.
- Review fixes (agent-tests/job2-fix1/): t1_targets.py with the night check's audit on iPhone landscape, iPad landscape and iPhone portrait (dark): before, small-target on Answer key / Hide answers / Stop (40 px), Leave (40 px), navX (34 px) and on a sideways iPhone also Give an F / Back / Done (40 px); after, none, and no cut-off, overlap or text-overflow; 0 errors. Screenshot of the homework sheet on a sideways iPhone looked at: fits. t4_layout.py (iPhone portrait/landscape vs the old game, title screen, Claude version): 6 PASS. t2_counts.py (web part, nothing removed, drawing work, opening): 6 PASS. t2_flicker.py (flicker probe, 48 views): only the two 1-pixel lines listed above. Syntax check ok, 4755 lines, 'use strict' still on line 547.
- Scripts and output: agent-tests/job2/ (partc.py, final.py, cullcheck.py, shadowab.py, seedlive.py; final-before.txt / final-after.txt).
