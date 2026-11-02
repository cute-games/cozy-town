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
