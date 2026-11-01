# HANDOFF — read this first (one page; updated 1 Nov 2026, Pets and Farm Update stage 3)

## Where things stand
- Live: `main` = a47bb1a (pet update 1, stamp 2026102902). Backups: `backup-2026-10-31` and `backup-2026-11-01` = main a47bb1a (A2 wants today's date).
- Building the **Pets and Farm Update** (PFU) on branch `claude/exciting-feynman-ea1031` (stands in for the run doc's `pfu` branch). Six stages, one
  helper each; no pull request until all six pass and the foreman's full check is done. Never push to main.
- **Stage 1 done** (stamp 2026103102): economy rebalance patch (2 commits, as written: it targets the split js/ files), night skip, morning bus home,
  hats sit on the hair, save version 2 + migration, kit N8 fixture fixed, new kit stage `pfu` (P1-P4). Quick kit: 54 of 54 PASS
  (`tools/pfu-wip/quick-kit-stage1.log`); check_split S1-S4 PASS. Joined game 1,606,558 -> 1,614,292 bytes (limit 1.8 MB).
- **Stage 2 done** (stamp 2026103103, commit ddfda17): the pet brain (one need = happiness, moods, body language from the moves
  pack), food groups, home bowl, pets nap when you sleep, healthy-week ribbon, sickness (built, OFF), vet booking on the phone, friends see your pets for
  real and pet/play with them. New kit lines P5-P11. Joined game 1,614,292 -> 1,663,820 bytes. Quick kit 60 of 61 PASS (only A2, see Open) `tools/pfu-wip/quick-kit-stage2.log`; check_split PASS.
- **Stage 3 done** (stamp 2026110101, commit see git log): Friends Lane hedges at 37.5 m, yard levels (🏡 My yard sign), 6 new beds (spots 36-41), only open
  pots/owned things drawn, training gear (10 pieces at Ms. Paws, pets play on it), friends see your yard (presence `yd`). Kit lines P12-P16; P10 and N33 rewritten.
  Joined game 1,663,820 -> 1,702,559 bytes (+38,739: moves +10.6 KB, gear models 9.4 KB, code). Quick kit 66 of 66 PASS (N3 failed once on timing in the
  full run, the night3 stage run again alone: all PASS; N3 alone 3 of 3) `tools/pfu-wip/quick-kit-stage3.log`; check_split S1-S4 PASS.
- **Next: stage 4** (`kit/entries/plan-brief-pfu-4.json`: vet clinic, big-needs pets, new pet shop).

## Read first (each stage)
1. `CLAUDE.md`, this file. 2. The run doc `kit/kits/pfu-night-run.json` (field `text`; its Guards and Corrections hold). 3. Your brief
`kit/entries/plan-brief-pfu-N.json` and the entries it names (all in `kit/entries/`; index and versions in `kit/README.md`). Packs: `kit/files/tools/`.

## The split game (Plan 1) and checks
- Edit `js/*.js`, `css/`; the stamp `const COZY_BUILD=` stays inline in `index.html`. Join / kit / split / check_split as below.
  1. `python3 tools/split/split.py join . /tmp/x/bundle.html --edited`; live = join of a main checkout (`git worktree add <dir> a47bb1a`).
  2. Kit: `python3 tools/kit-v7/make_v7.py` (rebuilds `cozy-check-v7.zip` from v6 + every rewrite + stage `pfu` + fixtures), unzip, strip_online both
     files, run `cozy_check2.py ... --backup <live> --backup-title backup-2026-10-31 --only files,counts,saves,night3,run4,pfu` (quick kit, ~70 min).
  3. `python3 tools/split/split.py split /tmp/x/bundle.html .` 4. `tools/split/check_split.py --site . --tested ... --live ... --three <kit>/cozycheck/three-r128.min.js`.
- New kit lines go in `tools/kit-v7/pfu.py` (stage `pfu`, function `s_pfu`; `PFU_ONLY=P2,P4` runs some). Each stage adds a fixture save made by its
  own build: `tools/check-fixtures/save-pfu<N>-*.json` (make_v7.py picks up `save-pfu*.json` and `save-prepfu-*.json`). Stage 1 added
  `save-prepfu-main.json` (made by main) and `save-pfu1-stage1.json`. Python Playwright 1.63.0 (`pip install --break-system-packages playwright==1.63.0`).

## Stage 1 notes the next stages need
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

## Stage 2 notes the next stages need
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

## Stage 3 notes the next stages need
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

## Open / not verified
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
