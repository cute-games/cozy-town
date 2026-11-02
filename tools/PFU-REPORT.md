# Pets and Farm Update: report (full check 1-2 Nov 2026)

Branch `claude/exciting-feynman-ea1031` (stands in for the run doc's `pfu` branch). Live: `main` = a47bb1a (stamp 2026102902). Backup: `backup-2026-11-01` = main a47bb1a.
Final build: stamp **2026110202** (stage 6; the full check changed no game file). Joined game **2,332,697 bytes** (limit 3.0 MB).

## 1. Check output (as printed)
Full kit v7 (`--full`: every stage, the crawls, the 10-screen sweep, two players, old saves from today's main), 22:26 (1 Nov) to 00:40 UTC (2 Nov). Whole log: `tools/pfu-wip/full-check.log`.

```
===== COZY TOWN FINAL CHECK =====
2026-11-01 · check version 7 · update, full sweep for a big update
PASS | A1, A2 (backup "backup-2026-11-01" = live), F3a, F1, F5, A3, E1 (agreed more: pets +10% pieces / up to 45,000 triangles, city +15% pieces / +20% triangles), B1 (25 saves), B2, D1, D2, D3, W1/W2 (4 screens)
PASS | N1 to N41 (all 41)
PASS | P1 to P18, P20 to P24, P26 to P35
FAIL | P19 Speed guard: 30+ fps on an iPad-sized view with 2 players | new 3.5 fps, live 4 (software drawing, no GPU); first load live 5702 ms / new 6629 ms
FAIL | P25 Not slower than live | fps median live 4.00, new 3.80 = 95% (want 90%+: passes); CPU side of a frame live 6.8 ms, new 13.5 ms = 199% (for information);
       first load live 5188 ms, new 6149 ms = 119% (want 115% or less: FAILS)
FAIL | P36 An older version and a new save | the test's own clock (fixed, see 4)
PASS | K1, C2 (723 taps, 26 areas, 326 screens), C2b, C3 (10 screens), T1-T4 (3 screens), C1 (34 screens x light and dark on 7 sizes), C4 (all 5), C5, C8, F6, F2a
FAIL | C6 zero errors in the browser log | 1 error: ipad-landscape p36-live: PAGEERROR Cannot read properties of undefined (reading 'b')   (P36's own, see 4)
NOT RUN | C1-WK (no Safari engine here), F3 (not uploaded yet)
NOT VERIFIED | G real devices, sound, smoothness, two real players online
RESULT: 4 FAIL, 3 not run or not verified · 132 min of testing
```
After the run, P36 fixed in the kit and run again alone: **P36 PASS** ("pets dog, cat, bunny, hamster, monkey, snake; glass tanks placed 1; the live version's own error (expected) reported here; the live version: playing False, save unchanged after starting and leaving True; back in the new version: 0 differences").
So: every line PASS but **P19 and P25** (the two lines the owner allows to fail, NOT VERIFIED until the real iPad), and C6, whose only error was P36's expected one (now reported inside P36, not counted again in C6: the foreman should confirm this is acceptable; C6 was not run again in a full run).
check_split (on the final files): S1 to S4 PASS ("2332697 bytes, identical"; stamp 2026110202; live 2026102902 sees it as an update).

## 2. What was built (per stage)
- Stage 1 (2026103102): economy rebalance, night skip (everyone in bed -> 7:00 together), morning bus home from the beach, hats sit on the hair, save version 2 + migration.
- Stage 2 (2026103103): the pet brain (one need: happiness; moods and body language), food groups, home bowl, naps, healthy-week ribbon, sickness, vet booking, friends see your pets' moves and can pet them.
- Stage 3 (2026110101): Friends Lane hedges at 37.5 m, yard levels (🏡 My yard sign), 6 new beds, only owned things drawn, training gear (10 pieces), friends see your yard.
- Stage 4 (2026110102): the vet station (Penny, Dr. Rūta, Leo, Tomas, 2 floors, the visit), sickness on, big-needs pets locked at the Ms. Paws board.
- Stage 4b (2026110103): monkey/seal/bear/snake with homes (tree, pond, den, snake glass tank), big-pet gear, bear/seal wait outside, the 3-floor Pet Shop, today's pets redrawn; size limit 3.0 MB + speed guard.
- Stage 5 (2026110201): the Pet Show area in the park, tricks, the Pet Show alone and with friends (one clock), town results from a seed, the animal license.
- Stage 6 (2026110202): the farm, horse trail and jump field (the Map plan 1:1), farm animals, 10 shared horses, Ieva and Stan, trail riders, the riding lesson and free rides, eggs and milk, Market sell, feeding and petting, friends see you ride.
Details and the names later work needs: `HANDOFF.md` (stage notes).

## 3. Kit lines rewritten, old -> new (all stages)
- N8 (pet update 1, kept): a 2-room order plays and pays -> new orders are one room; a saved 2-room order still finishes (fixture added).
- N14/N40 size (stage 4b, owner's OK): index.html under 1.8 MB -> the joined game up to 3.0 MB, with the speed guard P19.
- E1/N14/N40 Pet Shop (stage 5, owner): +10% of 15,363 triangles -> up to 45,000 (`pets:0.10:=45000`).
- **E1/N14/N40 town (full check, owner Karolis 1 Nov)**: town +10% pieces / +10% triangles -> **+15% pieces / +20% triangles**; `--e1-limits` default `pets:0.10:=45000` -> `pets:0.10:=45000,city:0.15:0.20` (quick and full kit). Every other area keeps its limit. (N14/N40's names still quote run 4's "15%/25%"; the limits used are printed in each line's detail.)
- B1 (stage 4, then 4b): pets' sad compared exactly -> only "still there" -> still there and within 0.1.
- P1 (stage 4): a new pet's sad exactly 0 -> under 0.1.
- P6 (stage 4): sickness off until the clinic -> on with the station in, the switch proven both ways.
- P10 (stages 3, 4b, 5, 6): lowest point in -0.07..0.012 for every move -> the same on the floor, water/air moves by their highest point; real-shape lowest point; big-pet/toy/home moves on their kind; person moves on a person; farm animals' and coaches' moves left to P34.
- P12 (stage 6): no map tree at |z|<42 west of x -78 -> none but the 2 the plan moved behind the hedge.
- P15 (stage 4b): 10 gear pieces -> 15.
- P17 (stages 5, 6): walls/trees outside the clinic as in the stage-3 build -> without the park's west part (Pet Show area), the map trees within 0.6 m of a planned removal/move and the farm's own walls.
- P18 (stages 4b, 5): board on the old shop's floor 2 -> the new shop's top floor; bear's license line stand-in -> the approved text.
- N28 (stage 4b): 2 floors with 7 fenced areas -> one room, 3 floors, a spot per kind.
- New in the full check: **P36** (a save with a monkey, a snake and a placed glass tank is never written over by the live version, and comes back whole).

## 4. The snake tank and older versions (decision)
Main (a47bb1a) does not know the glass tank or the big-needs pets: with such a save it stops at the title (page error), never sets PLAYING, so it **writes nothing**: the save on the device and in the cloud stays as it was. Main's own update check runs at the title and takes the newer file by itself (S4: live sees this build as an update). So the save is **not damaged**: no game fix. New kit line P36 proves it (save unchanged in the live version; back in the new version 0 differences). P36's first run failed only on the test itself (the Pet Shop is shut at a night hour, and the day turned at midnight); fixed: noon set before adopting, and a day turn during the test skips the day's own list.

## 5. Size and speed
Joined game: live 1,606,558 -> stage 1 1,614,292 -> 2 1,663,820 -> 3 1,702,559 -> 4 1,733,495 -> 4b 1,973,272 -> 5 2,049,426 -> 6 **2,332,697** bytes (+726,139; limit 3,000,000).
Speed (cloud test browser, software drawing, no GPU): P19 new 3.5 fps / live 4 (2 players, iPad view, 460,591 triangles, 208 draws); P25 fps 95% of live, CPU side of a frame 199% (stage 6: 121-124%; it swings a lot here), first load 119% of live (6.1 s vs 5.2 s; stage 6: 116-132%). The owner accepts these numbers; the real iPad decides.

## 6. NOT VERIFIED
- **P19 and P25 on Karolis's real iPad** (30+ fps with 2 players in town and at the farm; the first load in seconds).
- **Picture pass**: NOT DONE in this check. The full-check helper had no tool to start Sonnet picture viewers, and the rules forbid it opening the pictures itself. The pictures where the update touched are ready: 273 kit shots (new screens and areas, iPad/PC/phones, light and dark) in the helper's scratchpad `pics-pfu/` (list in `pics-pfu/list.txt`); the foreman should send them to Sonnet viewers (batches of at most 40, two viewers for new features).
- C1-WK (Safari's engine), F3 (after upload), G (real devices, sound, two real players). Everything in `tools/PFU-TRY-IT.md` until ticked, and each stage's NOT VERIFIED list in `HANDOFF.md`.
- C6 was not run again in a full run after P36's fix (the only error it found was P36's expected one).

## 7. Leftover grade-1 marks
None graded in the full check (no picture pass); picture pass 1: see section 9. Older open items stay: G4-205/222, G4-279, G4-285 and run 4's 15 grade-1 marks (`tools/RUN-4-REPORT.md`, "Leftover minor marks").

## 8. Where the tokens went
Full-check helper only (one session, medium effort): no sub-helpers were started (none available), so no per-helper log. Most of it went on reading the hand-off/kit code, the tank test, writing P36 and waiting on the 132-minute kit run (short looks at the end of the log).

## 9. Picture pass 1 (2 Nov): marks, decisions, fixes (stamp 2026110203)
Pictures: 273 kit shots and 74 gap shots (`tools/pfu-wip/shots_pfu.py`), Sonnet viewers (the foreman). The fix helper checked each grade 2-3 mark on a small
crop and, where unclear, in the game (Playwright probes). Grades are the helper's.

| Mark | Seen | Decision | Fix |
|---|---|---|---|
| M1 (3) | riding: dark void, brown blocks | **real**: you could stand inside a horse (in the kit shot the mount was refused after P32's 21:00 test) | grown horses and cows get a box like the cars (`farmSolids` in `solids()`); one that turns or walks into you pushes you out (`farmTick`). P32's shot mounts at noon |
| G2 (2-3), M2 (2) | stable / trough: camera in a horse | real, same cause | same fix |
| M3 (2-3) | Pet Shop: flat grey walls | kit artefact: N28's 'petshop-floors' faced the front wall at 1 m; the run-4 crawler stands you 0.55-1.1 m from a button with no collision (3 of 6 tries up to 1 m inside a wall or pen) | N28's shot looks into the room and up; crawler unchanged |
| M5 (2) | 'PERFECT!' on 'Bean!' | real (stage 5): the last pet's floating words outlived its turn | they go when the next pet starts (`psBegin`) |
| M7 (2) | slab over the pug/pomchi; capybara | real (stage 4b redrew pug and capybara; big pets new): capes, wings and backpacks used the fitted kind's back (dog 0.44 m): over the pug, inside the capybara and bear | `BACK_FIT`, measured per kind (pomchi, pug, sausage, capybara, monkey, seal, bear, snake) |
| M13 (3) | big pets never reach their homes | **real** (stage 4b): straight at the spot, stopped by the house | `bigWay`/`bigPath`: a 30 cm grid path round the house (side path, garden, big-pets gate); home in about 35 s |
| G4/G9 (2) | bear and seal in each other at the window | real (stage 4b): spots along the shop front 1.1 m apart | one each side of the way out, 1.2 m in front of the door (2.8 m apart at every door) |
| G5 (2) | 'Book the v...' | real (stage 2) | phone header '🩺 Vet' (the Pets app button still says 'Book the vet') |
| show words on the farm | 'Oopsie!', 'YOU WIN!' later | real (stage 5): queued big words outlived the show | `psEnd` drops them (`popDrop`) and the floating words |
| G1 (2) | no hearts/sick/ribbon | by design: moods and sickness are body language; the ribbon only Sat-Sun (shot on a Wednesday); My pets never had hearts (each pet's card has them) | shots on a Saturday |
| G6, G7 (2) | sleep screen faded; jump/lesson subject | shots artefacts (0.8 s fade-in; leftover show banner) | shots wait 1.2 s; retaken |
| M4, M6, M8, G3, G8 (2) | yard sign close; dog sunk; truck in fence; bear on its back; NOW greyed | grade 1: crawler 0.6 m from a sign on the house side; the farm dog lying; truck 0.5 m inside the fence (mesh z 9.03, fence 8.4); the bear sits on the mat (lowest point 0.54 = mat), paws 0.34 m from Dr. Rūta; NOW is off after your tap | none |
| M9-M12 (2) | Market list scrolled; cave den toast; speakerless line; shopper in view | pre-existing or crawler: buy code and shoppers are main's; the toast answers the crawler's tap on the locked Cave den; 'Pet clothes' opens the Pet Shop list on main too | none |

Leftover grade 1 (not fixed): M4, M6, M8, G3, G8's stray 'd', a name tag behind a hat (capybara, seal) or a bow, your own body at the bottom-left in the
shop, kittens close in the crawl, and the viewers' grade-1 notes in the foreman's `marks-g23.md` (locked yard buttons, Adopt text on mint, dark-mode note and
map buttons, vet counter/shelf, license banner peeking, Sir Barkley's line twice, small show name tags, floating coin, map labels on phones, empty Big pets
panel, license strip wrap on phones, seal on the rocks, seal/snake lying in the road, toast over the snake tank, gear hint pill, cowboy hair, vet tags under
the minimap, 'To town' sign). Pre-existing (main): M9-M12, the beach-bus hint toast. Kit note: making the crawler collision-aware would change every crawl
line's walk: the owner's/foreman's call.

New kit lines (each FAILS on the stage-6 build, PASSES now): **P37** big pets reach their homes (full yard, sent home twice, small yard); **P38** never
inside a grown horse or cow (on its spot, walking in from 4 sides, feeding; 14 rays from the camera); **P39** bear and seal apart at every door, the cape on
every kind's back, the show's big words end with it. Shots changed (framing only, no line weakened): P32 'riding', N28 'petshop-floors'.
Quick kit after the fixes (`--only files,counts,saves,night3,run4,pfu`): **87 of 89 PASS**; FAIL A2 (the backup branch is dated 2026-11-01, today is
2 Nov: the foreman makes `backup-2026-11-02`) and P19 (no GPU: 4.8 fps, live 4.2). P25 PASS (fps 100% of live, CPU side 109%, first load 98%).
check_split S1-S4 PASS. Size 2,332,697 -> **2,336,482** bytes. Retakes (45 pictures, list.txt) for the Sonnet viewers: the foreman's scratchpad `pics-fix1/`.

## 10. Picture pass 2 (2 Nov): marks, decisions, fixes (stamp 2026110204)
Pictures: the 45 retakes of pass 1 (`pics-fix1/`), 2 Sonnet viewers each (the foreman; marks R1-R6 in its `view/marks-pass2.md`). The fix helper checked each mark on small crops and
Playwright probes (side and front views, measured heights and distances).

| Mark | Seen | Decision | Fix |
|---|---|---|---|
| R1 vet booking (2) | the bear's body fills the view behind the phone | **real** (stage 4b): after its visit a bear or seal got off on the small pets' spot, 1 m in front of where you stand to watch | `vetOff`: a bear or seal gets off at the foot of its platform (4.5 m from you) |
| R1 stable, P34 trough (2) | a horse's side / head at the camera | framing: you are never inside one (P38) and every horse button works from 2.8 m; the shots stood you against a stall horse (stable) and at the hand-fed horse's head (P34's t+(4,3)). No game camera pull-in is needed (first person, like a wall) | shots: the stable view from the spot near Ieva furthest from any horse; P34's trough picture from 5 m on the side furthest from the horses (shot only, the line's checks unchanged) |
| R2 capes (2) | snake's cape on the ground beside it, seal's up by its head, capybara's past its back | **real** (pass 1's `BACK_FIT`): the snake's body slithers but its cape stayed put; the seal's and capybara's ran onto the neck/shoulder | `BACK_FIT`: capybara and seal shorter, off the neck (capybara tilted to its back, a 5th value), the snake's cape rides on the body piece under it. All 5 points along each cape now 0-5 cm over the back, resting and walking |
| R3 show words (2) | 'Pet Show!' over the banner with tiny pink text; a stray pink 'Ev' before 'Pepper!' | **real** (stage 5): the big words pop up exactly where the stage's 'Every Saturday!' sign hangs; also a skipped turn's name could pop up late | the sign hides while a show runs (main loop); `psBegin` drops big words still waiting. The 'Pet Show!' still up at your trick and the bus toast: the shots script runs the show's start in 0.2 s (framing; cleared before that picture). The bus hint toast over the banner in real play only in the show's first seconds: grade 1 |
| R4 bear on the platform (2, was 1) | lying on its side in the air | **stays grade 1**: measured, the bear's lowest point is the mat (0.54 m) for the whole visit; from the front it sits on the mat, paws up (pet.vetNervous); the shot looked from behind Dr. Rūta's shoulder | shot: from the ramp's front |
| R5 wait outside (2, one viewer) | bear and seal 'inside' with the Go outside button | framing: both stand outside at the shop front (1.8 m from the door); the button was yours, inside | shot hides the use button for that composite picture |
| R6 jump / trail / moods (2-3) | no horse mid-jump; own horse head a box low right; seal and bear not in view | framing: riding is first person (you see the head and neck, not the horse in the air); the shots turned your view but not the horse; the moods note listed every pet, the shot is of 3 | the horse heads where you look in both shots; the note says first person; the moods note lists its 3 pets |

Leftover grade 1 (not fixed): the bus hint toast over the show banner in a show's first seconds (pre-existing toast, the show is new), license strip wraps on phones, vet card text tight
under the header, dark mode only changes the screens (not the 3D scene, as on main), zzz icons over the sleep card, Sandy's name tag large close up, seal not in the pond, Pet Shop windows flat
grey, the farm's blocky cow at the trough (the book's picked model), the jump seen first person is mostly the horse's neck.

New kit line **P40** (fails on the pass-1 build in all 3 parts: bear/seal 0.00 m from you, seal cape 0.15 m off, snake over nothing, sign shown, 3 late words; passes now): after its vet visit
a bear or seal gets off 1.5 m or more from you; the capybara's, seal's and snake's cape on the back along its whole length (within 6 cm) resting and walking; the 'Every Saturday!' sign hides
during a show only; a turn's waiting big words never pop up after the next turn began. No line rewritten (P34: picture framing only).
Quick kit after the fixes (`--only files,counts,saves,night3,run4,pfu`, backup-title `backup-2026-11-02`, `tools/pfu-wip/quick-kit-picture-pass2.log`): **88 of 90 PASS**; FAIL P19 (no GPU: 3 fps, live 4.7;
first load live 5258 / new 6169 ms) and P25 (fps 74% of live in the run: 3.7 vs 5.0, swing up to 30% here; run again alone: **PASS**, fps 100% of live (3.5/3.5), CPU side 100%, first load 88%). A2 PASS.
check_split S1-S4 PASS. Size 2,336,482 -> **2,337,485** bytes. Retakes (30 pictures, list.txt) for the viewers: the foreman's scratchpad `pics-fix2/`.

## 11. Picture pass 3, the full check of 2 Nov, picture pass 4 (stamp 2026110206) and every leftover mark

### Picture pass 3 (re-check of `pics-fix2/`, 32 pictures, 2 Sonnet viewers; fixes in stamp 2026110205, commit 0e04406)
| Mark | Seen | Decision | Fix |
|---|---|---|---|
| T3 trough / cows (2) | a big brown slab at the trough; cows as 2.5 m drums | **real**: the book's bent cow neck (`cowNeckGeo`) came out of the export as a plain unit cylinder; the sheep's neck tube stood upright; fed at the trough every cow and sheep went to one spot | export keeps the neck as recipe 'N' and turned shapes as 'M' (`packGeo`); cow box re-measured; each kind spread evenly round the food |
| T2 judges' paddles (2) | 9, 10, 8 before any judge scored | real (the book's table sign texts) | stars on the paddles; the score is the card a judge holds up |
| T1 'Splash' on the stage (2) | a town pet with your seal's name | real | a town pet never takes one of your pets' names (rest of the day's draw unchanged) |
| T4 Ieva over your ride (2/1) | 'Want a ride? First a lesson' during the ride | real (a 2.6 s timer) | not over a ride; no 'first a lesson' once the lesson is done |
| T5 own horse in a jump (2/1) | the neck fills the screen | real | your view tips up with the horse as it takes off |
| T6 bear on the vet platform (2/fine) | paws up, body behind the ramp | stays grade 1 (measured on the mat in pass 2) | none |
New kit line **P41** (fails on 7d001f3 in every part, passes on 0e04406).

### The full check of 2 Nov (kit v7 `--full`, stamp 2026110205 = HEAD bf83968, 142 min; log in the foreman's scratchpad `kfull/run.log`)
```
===== COZY TOWN FINAL CHECK =====
2026-11-02 · check version 7 · update, full sweep for a big update
PASS | 132 lines (A1, A2 "backup-2026-11-02" = live, F3a, F1, F5, A3, E1, B1, B2, D1-D3, W1/W2, N1-N41, P1-P18, P20-P35, P37-P41, K1, C2, C2b, C3, C1, C4, C5, C6 (0 errors), C8, F6, F2a, T1-T4 on ipad-landscape but T1)
FAIL | P19 Speed guard: 30+ fps on an iPad-sized view with 2 players | 3.3 fps, live 4.2 (software drawing, no GPU); first load live 5448 ms / new 4337 ms
FAIL | P36 An older version and a new save | back in the new version the day's quest list (q.list / q.used) was drawn again, day and quest day unchanged
FAIL | T1 (ipad-landscape) | 2 classes: History ended, None NOT ended; 'no message from the school came'
FAIL | T1-T4 (iphone-landscape), T1-T4 (pc-1920) | 'no message from the school came' (0 kids, 0 papers)
NOT RUN | C1-WK (no Safari engine here), F3 (not uploaded yet)
NOT VERIFIED | G real devices, sound, smoothness, two real players online
RESULT: 11 FAIL, 3 not run or not verified · 142 min of testing
```
Every FAIL and its rerun (same files, same kit):
- **T1-T4 = timing, no game fault.** The teacher stage uses the real one clock (a game day = 15 real minutes; classes only 8:00-20:00). After the restart of the detached run the stages
  ran at 09:12-09:14 UTC = game 19:19-22:28: the iPad's second class and every class on the other two screens fell after 20:00. Run again alone, each started just after game 8:00
  (`kteach/run.sh` waits for it): **ipad-landscape, iphone-landscape, pc-1920: 3 classes each, all ended, no problem**. Merged into the full run's results (stages swapped, all others
  'already done'): **T1-T4 PASS on all three screens** (iPad: 10 of 10 left / 25 of 25 right taps, 14 papers, buttons 58x52 px, gap 16 px, 51 questions; iPhone: 6/6, 29/29, 52x44 px;
  PC: 7/7, 28/28, 58x52 px). (That merged printout's F6 'no test log' is only the merge's own tag; F6 passed in the run.) This update touched no teacher/quest/clock code the
  stage uses (the night skip's `CLK.sk` is 0 offline). Kit note for later runs: start a full check so the teacher stages (about 2 hours in) fall in game daytime, or rerun them alone.
- **P36: PASS alone twice** (09:39 and 09:40 UTC, game 15:00 and 17:30-18:50, the second the same game hour as in the full run): 0 differences. The game draws a day's quests only
  when the save's quest day is not today (`startGame`) or at a new day (`newDay`), from a seed of the day (`seeded(S.day*97+13)`) and the quest history; P1 (every save loaded,
  saved and loaded again exactly the same) passes, so a same-day load keeps the list. P36 now also prints the game day / quest day / time of the save, as loaded and on the way back,
  so a repeat shows where the day moved. In the quick kit after picture pass 4 (below) **P36 PASS** inside the whole pfu stage, as in the full run's order: save day 29327 / quest day 29327, as loaded the same, back the same, 0 differences.
- **P19**: allowed (no GPU here; the real iPad decides). P25 and C6 PASS in this run.

### Picture pass 4 (re-check of `pics-fix3/`, 16 pictures, 2 Sonnet viewers: `view/ans-fix3a.txt`, `ans-fix3b.txt`; fixes in stamp 2026110206)
| Mark | Seen | Decision | Fix |
|---|---|---|---|
| P34 trough, farm-cows (2/1) | cows as big square boxes, no head/neck seen, bodies into each other | **grade 1, the owner's model**: the game cow drawn beside the book's picked cow (living pack `farm:cow`, `buildPackItem`) from the side, front and 3/4: the same blocky body, head, muzzle, horns, spots and legs, the same size (0.90 x 1.72 x 2.08 m; the game's has 24 pieces / 1,732 triangles from the low-detail export, the book's 63 / 2,924). The neck is hidden at rest by the owner's choice ('neck hidden inside the body, only showing when grazing'). P41: every cow part under 1.2 m, cows 1.80 m apart at the trough | none (models frozen) |
| farm-jump-mid (2/1) | own horse's neck fills much of the screen | real, cheap | the view tips up 2.3 x the horse's pitch (was 1.7) |
| farm-trail-ride (2/1) | Ieva's 'Your pets can wait here with me.' over the ride | real: said the moment you got on | said when you talk to Ieva with pets with you (every other time), never on getting on; your pets still wait at the stable |
Kit **P41 rewritten (stronger), old -> new**: "Ieva's second line never shows over your ride" -> "no Ieva line ever comes while you ride" (every toast raised while you are on a horse is
recorded; any Ieva line fails it; the pets waiting at the stable are counted). P36: the day details added (no check changed).
Quick kit after the fixes (`--only files,counts,saves,night3,run4,pfu`, backup-title `backup-2026-11-02`, 09:51-11:45 UTC; foreman's scratchpad `k4/kit/run.log`): **90 of 91 PASS**;
FAIL only **P19** (no GPU: first load live 5994 / new 7359 ms; allowed). A2 PASS (backup-2026-11-02 = live). P25 PASS (fps 95% of live). P36 PASS (0 differences). P41 PASS: pets waiting at the
stable 3, toasts while riding none, top of your horse in the jump 0.07 (limit 0.15). check_split on the final files: **S1-S4 PASS** (2,339,970 bytes, identical; stamp 2026110206; live sees an update).
Size 2,337,485 (pass 2) -> 2,339,669 (pass 3) -> **2,339,970** bytes (pass 4).
Retakes for the viewers: the foreman's scratchpad `pics-fix4/` (12 pictures, `ONLY=farm`, `list.txt`; the cows unchanged, for the record). Render compare of the cows: `cowcmp/cmp.png`.

### Every leftover grade-1 mark (not fixed), all passes
- Pass 1: yard sign seen close (crawler 0.6 m away); the farm dog lying looks sunk; the truck 0.5 m inside the fence; the bear on the vet mat looks on its back; NOW! greyed after your tap
  (G8, and a stray 'd'); name tags behind a hat (capybara, seal) or a bow; your own body bottom-left in the shop; kittens close in the crawl; locked yard buttons; Adopt text on mint;
  dark-mode notes and map buttons; vet counter/shelf; license banner peeking; Sir Barkley's line twice; small show name tags; floating coin; map labels on phones; empty Big pets panel;
  license strip wraps on phones; seal on the rocks; seal/snake lying in the road; toast over the snake tank; gear hint pill; cowboy hair; vet tags under the minimap; 'To town' sign.
- Pass 2: the bus hint toast over the show banner in a show's first seconds; vet card text tight under the header; dark mode changes only the screens (not the 3D scene, as on main);
  zzz icons over the sleep card; Sandy's name tag large close up; seal not in the pond; Pet Shop windows flat grey; the bear on the vet platform (R4).
- Pass 3: Stan says 'trot to the red flag' while the blue flag is in view; Leo's line names Waffles while the bear is on the platform; horses stand in the yard, not in their stalls;
  the dark-mode NOW! button dull brown; Clover the bunny has an orange block on its back; sad and very happy look alike; license strip / Done glaring in dark mode; name tag sizes
  differ (Splash huge); the bear on the vet platform (T6).
- Pass 4: the farm's blocky cows (the book's picked model, see above); at the friend's show a tree trunk and leaves block the stage and the left judge is cut off (P29 shot framing);
  Ieva's faded toast low contrast over her legs at the stable; the NOW! button pale/greyed on the show card (light and dark).
- Pre-existing on main (not this update): the Market list scrolled (M9), the toast answering a tap on the locked Cave den (M10), a line with no speaker (M11), a shopper in view (M12),
  the beach-bus hint toast; G4-205/222 (pets at your heels), G4-279 (salon floor), G4-285 (phone job list on a sideways iPhone); run 4's 15 grade-1 marks (`tools/RUN-4-REPORT.md`).

### NOT VERIFIED (whole update)
P19 and P25 on Karolis's real iPad; C1-WK (Safari's engine), F3 (after upload), G (real devices, sound, two real players); the picture re-check of `pics-fix4/` (12 pictures);
everything in `tools/PFU-TRY-IT.md`; each stage's list in section 12.

### Where the tokens went (this last helper)
One session at medium effort, no sub-helpers: reading the hand-off, the kit's teacher and P36 code, the quest and clock code; the cow render compare (one small picture opened:
the 4-row compare sheet); two short game edits; waiting on the kit (teacher stages about 4 min, P36 1 min twice, the quick kit 114 min, read by its tail). Not logged per call.

## 12. Stage notes (moved here from HANDOFF.md on 2 Nov, when it went back to one page)
### Stage 1 notes the next stages need
- **Save version 2** (`SAVE_V`, `saveMigrate()` in js/03-game.js, called in startGame): `S.sv=2`; each pet gets `sick:0, sad:0, tr:1, tp:0`;
  `S.hw={w,cd,sick}`, `S.vet={bk:null}`, `S.yard={pet:1,garden:1}`, `S.lic={lv,wins,firsts,weeks}`, `S.ride={lesson:0}`, `S.farm={eggs:0,milk:0}`.
  Use these names; do not bump the save version again. `S.v` stays 1. New adopted pets get the four pet fields (js/04-panels.js).
- **Night skip**: `CLK.sk` (total skipped ms) shared online at `worlds/cozy-town/cozy-world/peers/clock` (the players' list: the only place the
  Firebase rules let anyone write without new rules; it has no name, so every version leaves it out of the players). Game time = `gameMs()` =
  realMs()+CLK.sk; use `gameMs()` (not realMs) for anything on the game clock. Presence `ob:1` = in my own bed. Stage 2 adds "pets sleep too".
  Kit tip: set a test clock with `__clockMs(msAt(d,h)-CLK.sk)` once a skip happened.
- **Morning bus**: `busSess` adds `{p:'beach',a:8,l:9.5,go:'town',mb:1}` + park drop-off on days with no bus and no Welcome Bus.
- **Hats**: `HAT_COVER`, `HAT_LIFT`, `hatLift()`, `bunTop()` in js/01-models.js; headphones, unicorn band and the kids' flower were reshaped; under
  a costume hood the side hair is tucked in. Kit P4 checks every hairdo x hat x costume from above.

### Stage 2 notes the next stages need
- Pet brain: js/03-game.js after `rebuildPet` (`PBR`, `petNeed`, `petBrain`, `petPose`, `petAnim`, `petTick`, `hwTick`, `petCare`, `petCode`/`petUncode`,
  vet functions). `PBR.sick=false`: **stage 4 sets it true when the vet clinic is in** and calls `vetCure(list)` (pay 50 a pet, free if broke, mood 2 hearts),
  `petTip(d)` (Nurse Penny's line) and `openVetBook()` (Penny's desk opens the phone screen). Bookings: `S.vet.bk={d,h,ids,rm}`, presence `vb`.
- Rate: 70 happiness per real hour of play (pet decision 19), half at home with `S.yard.bw>0` (bowl, seconds of play left) and a toy box or cat tree in the
  house (`homeCare`; stage 3/4: add yard toys and big-pet homes there). Pets with you nap in bed (`e.nap`), +15 at the morning (`zzMorning`).
- Moves: `COZY_MOVES` at the end of js/01-models.js, cut from the book's pack by `tools/pfu-wip/extract-moves.py <pack> <out> <move,list>` (only the 15
  pet moves used). Stage 4 adds bear/seal/snake/monkey moves (bear.denNap, seal.nap, toy plays...) by re-running it with the longer list.
- Online: pet row = [type, col, name, outfit, kind, code]; code = hearts + s(sick) w(sneeze) r(ribbon) + `.<move letter><start tenths>` (`SMS` table);
  left out while an older version (v < PBR.V) is online. Friend care: presence `pc={to,i,k,n}`. Food: `PET_GROUP`, `GROUP_FOOD`, `PET_LOVE`, `petFood()`;
  `PET_FOOD` kept as an alias (kit N11 reads it). Healthy week: `S.hw.{w,cd,sick,ev,rb}`, written only when you care or a pet is sick; `S.lic.weeks`++.

### Stage 3 notes the next stages need
- Yard (js/02-world.js after YARD_POTS): `yLv(k)` (S.yard.garden / S.yard.pet, 1-3), `yardBack`, `yardShell` (fences/gate/grass/lamps for your yard and friends' lots),
  `yardLv()` rebuilds your yard's level part (call it after any level, pot or gear change), `yardColsSet`. Pet yard 3 = big-pets area z -29..-35 behind a gate
  at x -12.4 (stage 4 puts pond (-20.8,-32) .62, jungle tree (-16.4,-32.4), den (-12.15,-32.4) .65 there, only once bought). `S.yard.gear` = list of gear ids
  (made on first purchase, no migration default: P1 wants yard {pet,garden} for old saves).
- Gear: `GEAR` (prices, levels, kinds), `GEAR_B` builders (js/01-models.js), `GEAR_SLOTS` (3 spots: pet corner L1, play corner L2, big-area front L3),
  `gearPlace` (best fitting free spot, never < 0.6 of the moves' size). Play: `GEAR_PLAY`, `gearUse/gearStep/gearEnd` in js/03-game.js (+20 happiness, Pet care XP,
  petCare). Stage 4 adds big-pet gear (monkey bars, seal ball, bear log, snake basket) the same way: builders in GEAR_B, a GEAR row, a GEAR_PLAY plan, moves via
  extract-moves.py; P15 checks every GEAR id. Stage 5's practice days can hook into gearEnd(e,true).
- homeCare() counts yard gear as a toy. Presence `yd` = garden lv + pet lv + a letter per gear (GEAR_IDS order: append new ids at the end only).
- Soil meshes are made when a spot opens (draw-call budget, N14/N40: town pieces within 10% of live).

### Stage 4 notes the next stages need
- Vet: `buildVet()` (js/02-world.js, loc 'vet' at ox 4500, floors like the Pet Shop), clinic outside `vetClinic(g)` added to the city's static group; the town's bushes/trees
  in the spot are still generated (same random order) into `VDUMP` and their walls removed (`vetSpot`). Visit: `vetStaff`, `openVetDesk/vetDesk`, `vetStart`, `vetStep`
  (called from petTick), `vetEnd` (js/03-game.js). Keepers can play a move: `k.mv` (+`k.mv0`, `k.lk` look-at) in the main loop. Moves added: pet.vetNervous, pet.takeTreat,
  vet.listen, vet.check, nurse.treat (extract-moves.py with the longer list). Furniture uses the pack's rounded box as `vrbox` (the game's `rbox` has another signature).
- Big pets: `BIGP`, `bigLock`, `openBig`, `bigPaws`, `bigHome(k)` (js/04-panels.js; returns false until the homes are sold). License from `S.lic.lv` (stage 5).
  The stage that adds the monkey/seal/bear/snake models must add PET_TYPES rows (base = an old type), the homes (GEAR-like, yard spots in stage 3 notes), make
  bigHome read them, adopt when bigLock is null, and the wait-outside rule (bear, seal). PET_TOY already has their favourite toys.
- Kit: P17 compares the town's trees outside the clinic with `tools/kit-v7/pfu-trees-stage3.json` (stage-3 build; zipped by make_v7.py).

### Stage 4b notes the next stages need
- Pack models as data: `PACKM` (end of js/01-models.js) made by `node tools/pfu-wip/export-pack.js <three-r128.min.js> > x.js; python3 tools/pfu-wip/put-packm.py x.js`
  (the book's packs in kit/files/tools, kept versions). `packBuild(key)` draws one with the game's shapes; `makePet` uses it for monkey/seal/bear/snake/pug/capybara
  (`PACKM.cols`; monkey/bear kinds = fur colour). Add a model: a line in export-pack.js's OUT list, rerun both commands. Moves: extract-moves.py with EXTRA=stairH,tankPath.
- New Pet Shop (js/02-world.js `PSH`, `psSupport`, `psFl`, `buildPetShop`; js/09-mainloop.js `psTick`): floors at 0 / 3.34 / 6.54, P.cy = your height, pets `e.cy`;
  colliders with `.fl` collide only on that floor (`CFL` in collideXZ); targets/inter use `when:()=>psFl(P.cy)===fl`. Pens: `L.pens` with fl, y, hill, face, mv (big pets).
- Big pets: PET_TYPES rows have `big:1`; `BHOME` (homes, yard frame), `S.yard.home` (list, made on first purchase), presence yd + T/P/D letters; `bigHome`, `bigRest`
  (pets at home rest at their home), `snakeTank`/`snakeTankPose` (snake at home lives in the tank), `petWaitOut` (e.wo), `vetBigStaff`. Toy moves `TOY_MV` (not sent online).
  GEAR ids appended: monkey, monkey2, seal, bear, snake (letters k-o). Psrivals (Pet Show) leave big pets out (same draw as old versions).
- Kit rewrites (old -> new): N14/N40 size, B1 sad within 0.1, P10 (real-shape lowest point; big-pet/toy moves on their kind), P15 (15 gear pieces), N28 (the new shop).

### Stage 5 notes the next stages need
- Pet Show (js/07-designer.js, rewritten): `PS` (stage spot -36.3,22 top .56; lawn spot for gear tricks; podium steps `PS.pod`; judges' table `PS.jt`), `psShow(plan,p)`
  runs one show (`plan.ts` null = alone, at your pace, skip allowed; a number = shared timeline on the one clock, `psTurnAt`), `psPlan(r,i,seed)` = town results from
  a seed (the show's start second, never Math.random). Tricks: `trList`, `trLen`, `trSpot` (stage or lawn + gear via `GEAR_B`), `trPractice` (from `gearEnd`; pet
  fields `tr` known 1-3, `tp` practice days, `tq` last practice day), `psGoldW` (.08, .12 for learned tricks). Friends: `PSM`, presence `ps=[t0,jt,pet,style,happy,known,grades]`,
  `psFriendsHere` (version >= `PS_V`=2026110201, in the park), `psJoinCard`, `psWaitCard`, `psmTick`, `psGroups` (4 a show, next right after).
- License: `LIC_NEED`, `licReach`, `licShow(place)` (S.lic wins/firsts; S.lic.seen), hand-over `psLicStart/psLicCut` (moves person.giveCard/takeCard, pet.greet),
  `openLicense`, My pets strip `.licstrip`. Ribbon at the show: +1 Granny Daisy (`psScore10`). Map: Pet Show area pieces in `LOC.city.show`; the park's new walls are
  marked `ps5` and the nature scatter still sees the old park (`PS5_OLD`) so every bush keeps its place. Food truck `TRUCK.ry` (turned); `packBuild(key,txt)` swaps sign texts.
- Moves re-cut with `trick,pet.greet,person.giveCard,person.takeCard` and EXTRA=stairH,tankPath,TRICKS,trickGear,TRICK_LEN,TRICK_KIND,TT.

### Stage 6 notes (the farm)
- Build: `buildFarm` (js/02-world.js, before `FARMD` = the placements as data, made by `python3 tools/pfu-wip/put-farm.py` from kit/kits/pfu-placements.json). Statics baked
  (160 m pieces; props/machines without outline hulls, plain colours merged: `farmLite`), nature instanced (one draw a kind, `farmProto`), ground/roads 2 flat pieces, walls
  (`fw:1`) + an 8 m collider grid `L.fgrid` (turned boxes `farmPush`) that collideXZ reads only out there. Lane: the block north of the hedge is now a thin hedge strip, a new
  block `laneC[4]` shuts the land west of the lane end; city bounds reach x -226, z -196 (`FARM_X1/Z1`); the x -50 road's north barrier is gone; hills step back behind the farm.
  Forest trees on the trail/roads/fields: same random order, drawn into VDUMP (53 of the 64 found; the other 11 went with stage 3's lane border).
- Life (js/03-game.js end): `FARM`, `farmLive` (made lazily within 70 m of the farm: `FARM.q`), `farmTick` (nothing when far; far LOD = one baked piece past 22 m; animals hidden
  past 70 m), `farmRide` (P.horse; `P.cy` = seat height), lesson `farmLessonTick` (S.ride.lesson/paid/met/picked), chores `farmEggs/farmMilk` (S.farm.eggs/milk/ed/md), Market
  `farmSellHTML`/`ACT.fsell`, presence `rd=[horse,gait,heading]` (`farmStamp/farmExtra/farmPeer`, peer fields a.fh..., `a.hm` is the house map!). Models: export-pack.js
  (farm keys, `packBuild` low-detail `PK_LO` for farm keys), moves re-cut with the farm moves (tools/pfu-wip lists in the commit message).
- Speed: pets out of sight are not posed (`petPlay`), the farm leaves the scene graph when far. Rewrites (old -> new): P17 map trees and walls outside the clinic as in the
  stage-3 build -> the same without the map trees within 0.6 m of a planned removal/move and without the farm's own walls (`fw`); P10 every move on every pet kind -> the same
  without the farm animals' and coaches' moves (played on their own models in P34); P12 no map tree at |z|<42 west of x -78 -> none but the 2 the plan moved behind the hedge.
  Fixture `tools/check-fixtures/save-pfu6-stage6.json` (made by this build: lesson done, farm goods).
- NOT VERIFIED (stage 6): how riding feels (camera, speeds, jump) on a real iPad; the farm at night and in snow (no lights); friends riding together on real devices; every
  farm move by eye (only the moves check); Ieva's brush in her hand (pose from the moves pack); animals walk through each other and through you (no animal colliders);
  feeding moves of the player (first person: not drawn); the lesson has no map star for Stan; sounds.

### Open / not verified
- Stage 5 NOT VERIFIED: a shared show with real friends on real devices (clock and presence lag), 3+ players and the next show right after (only a unit test of the
  grouping), how every trick looks on its kind (looked at: the dog's high five, agility on its gear, roll over; the rest only by the moves check), the hand-over on an
  iPad (looked at once in the test copy), sounds (tick, stamp), the license card on a phone, P19 on the real iPad.
- Stage 4b NOT VERIFIED (by eye/real device): big pets walking/playing and their gear moves, the bear/seal waiting pose, the vet platform view, the snake in its tank,
  the shop's stairs on an iPad (camera, feel), the tank card on a phone, friends see your floor in the shop (presence has no height: a friend upstairs is drawn on floor 1),
  capybara faces (only the 'real' face is used), sounds (monkey, seal, bear, hiss, click). An old version (main) cannot place a saved glass tank (unknown furniture).
- Stage 4: pictures looked at: clinic from the road, lobby, upstairs, a dog on the exam table (all look right). NOT VERIFIED: friends seeing the visit (the pet on the
  table is drawn only for you), phone/dark mode/iPad layout of the new cards, the clinic at night, sounds, the toast queue on a real device. A town tree on the
  pavement stands 0.8 m from the clinic's door path (x 4.75, z -78; walkable). Big-pet platform used only by bear/seal (none can be owned yet).
- Stage 3: no pictures looked at but one overview of a level-3 yard (fences, beds, pots, gate look right); how each pet looks on its gear (feet, jumps over the
  bars, the hamster in its wheel, capybara/duck in the water, owl on the perch) NOT VERIFIED by eye; friends do not see the gear moves (the pet stands at its
  spot for them); the map still shows the level-1 garden; yard sign screen on a phone; sounds. Decisions made here (tell Karolis): gear room = 1 piece at pet
  yard 1, 2 at level 2, 3 at level 3; gear scaled to fit its spot (hamster 3.9 not 4.4, dog course 0.88 not 1.25); both styles of dog course, cat tower and
  bunny hurdles are sold as separate items '(style 2)'; garden fence colour per garden level (white, pink, yellow), pet-yard side mint at 2-3, iron round the big area.
- A2 fails on 1 Nov only because the backup branch is dated 31 Oct (the kit wants today's date in the title); main is unchanged (same md5).
- Stage 2: real iPad frame rate (P10 measures 0.5-0.9 ms a frame for 6 pets' moves; whole frames only in the software-drawn test copy); moves seen by
  friends on real devices (clocks a second apart can shorten a short move); one player on two devices; sounds (sneeze) not listened to; no pictures looked at.
  Sick pets, the vet visit itself and bear/seal waiting outside / napping at home: stage 4. The ribbon's Pet Show bonus: stage 5.
- Night skip with real friends on real devices, and with the real Firebase (the kit uses a fake one). Hats: only contact sheets (stage 1).
- Older items from run 4 and pet update 1 stay open (G4-205/222, G4-279, G4-285, 15 grade-1 marks; iPad smoothness with 10 pets).

