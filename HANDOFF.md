# HANDOFF — read this first (one page; updated 27 Nov 2026)

## Where things stand (27 Nov 2026)
- **Live: `main` = b6c97f8 (PR #63, stamp 2026112620, 26 Nov 22:2x)**: lamps (colour light, night dimming, 4 ceiling lamps), My stuff tab, sell 50%, recolour 10 coins, CozyCoin font,
  mini-map tidy, dance-off to slice 12b + Windows shader fix. Owner skipped the full check. Backup: `backup-2026-11-26` (= main before #63).
- **Branch `claude/fix-mm-cards` = PR #64 (not merged, stamp 2026112701)**: − + font fix, sell chip/card names; bus news as texts from Rosie (`rosieBus` in 02-world), no "Next bus" pill;
  notepad hidden (`#pad{display:none}`, data kept); `dnLeave` resets camera zoom/fov (the "wide glitch"); phones sideways only (`ROT` shim at the top of 00-core: turns body,
  innerWidth/Height, clientX/Y, getBoundingClientRect, elementFromPoint, matchMedia and @media/vw-vh rules); compact sideways-phone bars + 🗺️ fold chip (`#bFold`, 08-hud) + joystick left.
  Kit harness `center()` maps taps for ROT (in /home/claude/w/gh4 and rel2 copies; put it into the kit zip and list it old → new). Full check running in /home/claude/w/rel2.
- Dance: ChatGPT (Codex chat, local) builds slice 13 on `chatgpt/dance-game` (arrows pass through, judgements by the dancer, dude..., disco + night, beat bounce). Check it in the owner's Edge.
- Dance Map maker live at `dance-map/` (+ `tools/dance-map/analyse.py`, librosa): the game does not load maps yet. Owner maps the cat song to show the style.
- Shop icons: mock (3D thumbs on round pads) shown; owner wants "simplified drawing of a 3D picture" - waiting a/b/c. Shop look: tabs by kind (picked a).
- Emoji set same on every device: asked, no answer. Pet shadows thrown far from pets (floating snake): not fixed. Nibbles tag over the run button on iPad: not fixed.
- **Next job: the easel (owner 27 Nov, "go")**. Plan: buyable item `easel`; tap → drawing card (8 colours, 3 brushes, eraser, undo, clear, done); a drawing = small JPEG
  (256x192, ~10 KB) kept in the save (cap 12, oldest asked before delete); a "Framed drawing" wall item showing it (canvas texture); send to an online friend through the
  texts (#34: only after the owner pastes the Firebase rules; size cap; arrives in My stuff). Effort max (saves + online). Red-team the plan first.

## Older (2 Nov 2026 and before)
- **Horses in town** (24 Nov, branch `claude/horse-town`, stamp 2026112497+): ride anywhere in town (door = "horses wait outside"; the lesson stays at the farm);
  a horse let go walks home on pavements/zebras/park paths/farm roads (`HN` block in `js/03-game.js` after `RIDE_POSE_X`: 0.5 m walk map + one way-home field,
  built a few ms a frame in town; walk = fixed 0.1 s steps from the record [horse,x,z,time], sent online as presence `rh`), groups of near horses (2 wide, single
  file at zebras). The only town-farm way is the x -50 road's end between the farm walls (`hnMouth`, crossed like a zebra). Proof: a ride-into-town script (outside the repo).
- **Speed (24 Nov, branch `claude/perf-1`, stamp 2026112496, pull request "Speed: less lag on weak devices")**: exact faster ground fix for pets and animals (`boxIn`),
  hidden places skipped in the per-frame matrix update (`scene.updateMatrixWorld` in `boot`), Ieva's brush (an undefined store that made all later vector maths make garbage),
  auto speed steps `AQ`/`AQ_STEPS` in `09-mainloop.js` (pixel ratio 2 -> 1.5 -> 1.25 + 1024 shadows + small things cast none -> 1 no shadows -> far things hidden at 130 m; key `cozytown-q`;
  off in test browsers (`navigator.webdriver`) unless `window.__aqTest`; tapping Pretty resets). Measure scripts: `tools/perf-wip/`. Real devices NOT VERIFIED.
- Live: `main` = a47bb1a (pet update 1, stamp 2026102902). Backups: `backup-2026-10-31`, `backup-2026-11-01`, `backup-2026-11-02` = main a47bb1a
  (kit A2 wants a backup branch dated today: make `backup-YYYY-MM-DD` from main on the day of a check).
- **Pets and Farm Update (PFU)**, branch `claude/exciting-feynman-ea1031` (stands in for the run doc's `pfu` branch): all 6 stages built (economy, night skip,
  morning bus, hats; pet brain, food, vet booking; yards and gear; vet station, big-needs pets, 3-floor Pet Shop; Pet Show and animal license; the farm,
  horses and riding), 4 picture passes fixed. Stamp **2026110206**, joined game **2,339,970 bytes** (limit 3.0 MB). **State: ready for the pull request**
  (the foreman opens it; the owner merges). Never push to main.
- Full check (2 Nov, `--full`, stamp 2026110205): 132 PASS; FAIL P19 (allowed: no GPU here), P36 and T1-T4 (iPhone, PC; T1 iPad). Reruns: **T1-T4 PASS on all three
  screens** (timing: they ran after game 20:00), **P36 PASS alone twice**. Picture pass 4 changed only the jump view and when Ieva says her pets line; quick kit after it:
  **90 of 91 PASS** (only P19). check_split S1-S4 PASS. Details, every FAIL and every leftover mark: `tools/PFU-REPORT.md` section 11.
- **Still open for the owner**: P19/P25 on the real iPad; `tools/PFU-TRY-IT.md` (try it for real: Karolis and Izabele); Sonnet viewers on the 12 retakes of picture pass 4
  (the foreman's scratchpad `pics-fix4/` + `list.txt`); the cows are the book's picked blocky model (grade 1, models frozen).

## Read first
1. `CLAUDE.md`, this file. 2. `tools/PFU-REPORT.md` (sections 1-11: checks, rewrites, marks; section 12: every stage's code notes: save v2 names, night skip `CLK.sk`/`gameMs()`,
pet brain, yard/gear, vet, big pets/`PACKM`/`packBuild`, Pet Show, farm). 3. The run doc `kit/kits/pfu-night-run.json` and briefs in `kit/entries/` (book copies; `kit/README.md`).

## The split game and checks
- Edit `js/*.js`, `css/`; the stamp `const COZY_BUILD=` stays inline in `index.html`.
  1. `python3 tools/split/split.py join . <dir>/github-new.html --edited`; live = join of a main checkout (`git worktree add <dir> a47bb1a`).
  2. Kit: `python3 tools/kit-v7/make_v7.py` (rebuilds `cozy-check-v7.zip`), unzip, `strip_online.py` both files, run `cozy_check2.py --live-claude ... --new-claude ...
     --live-web ... --backup <live> --backup-title backup-YYYY-MM-DD --only files,counts,saves,night3,run4,pfu` (quick kit, ~75 min) or `--full` (~140 min).
  3. `python3 tools/split/split.py split <bundle> .` 4. `tools/split/check_split.py --site . --tested ... --live ... --three <kit>/cozycheck/three-r128.min.js`.
- PFU kit lines: `tools/kit-v7/pfu.py` (stage `pfu`; `PFU_ONLY=P36` runs some with `--only pfu`). Fixtures: `tools/check-fixtures/save-pfu*.json`.
- P2, P9, P29, P35, P36 need PFU_OLD_WEB=<join of a47bb1a>; B1 accepts a new friends key for a save that had none (25 Nov, owner's OK). New line B3 (`tools/kit-v7/sockey.py`): the friends key
  is made once and kept. Fixture `save-soc1-friends.json` (key, 2 friends, 1 blocked) comes with `save-soc1-friends.online` (its friends' threads for the test database).
  Pictures: `tools/pfu-wip/shots_pfu.py <kit>/cozycheck <joined> <out>` (`ONLY='farm,...'` for some scenes). Playwright 1.63.0.
- **Kit timing**: the teacher stages (T1-T4) play on the real one clock (a game day = 15 real minutes); classes come only at game 8:00-20:00. A stage that starts late
  in the game day fails with 'no message from the school came'. Rerun it alone just after game 8:00 (game time = clockAt(Date.now()): 8:00 is 252.9 s into each
  900 s day counted from 1 Jan 2026 UTC); a stopped run continues with the same command (finished stages are skipped).
- Run nothing heavy next to a check (N13/N15/P25 fail on timing alone).

## Open / not verified (all in `tools/PFU-REPORT.md` 6, 11, 12)
- Real iPad: P19 (30+ fps, 2 players) and P25 (first load); C1-WK, F3 (after upload), G (real devices, sounds, friends together).
- Older items stay open: G4-205/222, G4-279, G4-285, run 4's 15 grade-1 marks (`tools/RUN-4-REPORT.md`).
- Kit v7 changes 27 Nov (in `cozy-check-v7.zip`, old → new): N35 "Notepad switch: off hides it, on brings it back" → "Notepad gone (owner 27 Nov): never shown, no Settings switch, pages kept";
  N41 "the pill shows the next bus with its weekday" → "Rosie texts the next bus with its weekday at the stop"; P3 "the pill" → "Rosie's text at the stop"; N36 ceiling lamps built for a 3.2 m room
  (same 3.2 m limit); harness `center()`, `book_swipe` and C3's joystick drag map their touch points for an upright phone (ROT); harness can serve `music/` from `COZY_REPO` (off by default: the dance
  clock then waits on real audio and N39 hangs).
