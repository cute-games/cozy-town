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
None graded in this check (no picture pass). Older open items stay: G4-205/222, G4-279, G4-285 and run 4's 15 grade-1 marks (`tools/RUN-4-REPORT.md`, "Leftover minor marks").

## 8. Where the tokens went
Full-check helper only (one session, medium effort): no sub-helpers were started (none available), so no per-helper log. Most of it went on reading the hand-off/kit code, the tank test, writing P36 and waiting on the 132-minute kit run (short looks at the end of the log).
