# HANDOFF — read this first (one page; updated 25 Nov 2026: the night of 24-25 Nov is live; the Foreman file is `FOREMAN.md` on branch `claude/foreman-handoff`)

## Dance branch `claude/dance-pass` (27 Nov 2026, stamp 2026112720) — test copy only, NOT live
- Live main is PR #64 (2026112702). PR #77 `claude/phone-map` (no corner map on phones, 🗺️ chip opens the big map, kit N26 rewritten) waits for the owner's "merge #77".
- This branch (worktree was /tmp/dfx) = Codex dance work + owner picks: arrows fall down, see-through, pass through; flashy floor/rays; score screen = banner + one card per dancer (`dnResultCards`, CSS at the end of css/style-1.css, "🏆" comments); camera = soft push on each bar (`fx.push`), no tilt.
- Charts: `tools/dance-map/chart3.py <loop.json> <steady|fast> <easy|hard> <mp3>` → `DN_CHARTS6` (rows [t,lane,double,hold s]). Round ids `beat6{n|s}{e|h}-` when the partner's version ≥ DN_HOLD_BUILD (2026112720), else beat5 as before. Starter picks via SET.danceEasy (Settings › Dance level). Holds: `dnRelease`/`dnHoldDone`, 10 pts/s, early let-go = What?, wire field `hb` keeps hold points apart from hit points.
- Checked: autoplay holds complete, early release = What? + combo 0, touch lift releases, Easy/Hard/old prefixes (photo tools in /home/claude/w/dance-photos: dp5 score screen, dp7 holds, dp8 prefixes). NOT run: the kit on this branch, two real players.
- To go live later: rebase on main, stamp above live, full check, owner's merge.

## Where things stand (25 Nov 2026)
- **Live: `main` = the merge of pull request #34, stamp 2026112504, joined game 2,463,690 bytes.** Backups: `backup-2026-11-25` (c974534), `backup-2026-11-25c` (ad8827f, main before #34).
- Merged in the night of 24-25 Nov: #29 Pet Shop taller top floor + painted windows in all interiors; #30 house paint works and costs 150 coins, friends see the colour, calm duck and owl;
  #31 Tree Park parkour obby in town; #32 horses ride anywhere and walk home in groups; #34 friends (accept, remove, block), texts, voice calls, world chat.
- **#34 rests until the owner pastes the new Firebase rules** (`tools/social/FIREBASE-STEPS.md`, rules `tools/social/firebase-rules.json`): until then the Friends app says "Coming soon".
  Its tests: `tools/social/` (rules_test.js 138, logic_test.js 34, sdk_shapes.js 13, test_social.py 109). **Pull request #33 (another version of the same) must NOT be merged**: with its rules
  a stranger can become a child's friend and read texts (the comment on #33 has the list).
- First full check of main after #30-#32 (655069d, 25 Nov): nothing new broken. Open and older than that night: P8, P9, P29, P36 FAIL the same on ffeb0b3 (cause not found; P9/P29/P36 compare
  with an "older version"); C4: the mini-map button overlaps its zoom buttons on iPad landscape (a player can see it); the pfu stage's lines P11-P24 fail as a "Page.goto timeout" cascade
  inside the stage and PASS alone (`PFU_ONLY=`); P25 breaks at page `p25-A-new-0` on this kind of machine (kit problem); P19 needs a GPU.
- Kit commit ad8827f (C2b and P17 rewritten for the park in town) went straight to main by mistake (kit files only). Push with `git push origin HEAD:refs/heads/<branch>`, never a plain `git push`
  from a branch made from `origin/main`.
- Not verified on real devices: everything from that night (iPad Safari microphone and sound for calls, real Firebase rules, speed with the obby in town, how the horses and the waddle feel).
- Music: the pick page "Pick the Music" has play buttons for all 49 songs; only Yes picks go into the game later, as separate files (see FOREMAN.md).

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
  Pictures: `tools/pfu-wip/shots_pfu.py <kit>/cozycheck <joined> <out>` (`ONLY='farm,...'` for some scenes). Playwright 1.63.0.
- **Kit timing**: the teacher stages (T1-T4) play on the real one clock (a game day = 15 real minutes); classes come only at game 8:00-20:00. A stage that starts late
  in the game day fails with 'no message from the school came'. Rerun it alone just after game 8:00 (game time = clockAt(Date.now()): 8:00 is 252.9 s into each
  900 s day counted from 1 Jan 2026 UTC); a stopped run continues with the same command (finished stages are skipped).
- Run nothing heavy next to a check (N13/N15/P25 fail on timing alone).

## Open / not verified (all in `tools/PFU-REPORT.md` 6, 11, 12)
- Real iPad: P19 (30+ fps, 2 players) and P25 (first load); C1-WK, F3 (after upload), G (real devices, sounds, friends together).
- Older items stay open: G4-205/222, G4-279, G4-285, run 4's 15 grade-1 marks (`tools/RUN-4-REPORT.md`).
