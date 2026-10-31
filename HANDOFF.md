# HANDOFF — read this first (one page; updated 31 Oct 2026, Pets and Farm Update stage 1)

## Where things stand
- Live: `main` = a47bb1a (pet update 1, stamp 2026102902). Backup: `backup-2026-10-31` = main a47bb1a.
- Building the **Pets and Farm Update** (PFU) on branch `claude/exciting-feynman-ea1031` (stands in for the run doc's `pfu` branch). Six stages, one
  helper each; no pull request until all six pass and the foreman's full check is done. Never push to main.
- **Stage 1 done** (stamp 2026103102): economy rebalance patch (2 commits, as written: it targets the split js/ files), night skip, morning bus home,
  hats sit on the hair, save version 2 + migration, kit N8 fixture fixed, new kit stage `pfu` (P1-P4). Quick kit: 54 of 54 PASS
  (`tools/pfu-wip/quick-kit-stage1.log`); check_split S1-S4 PASS. Joined game 1,606,558 -> 1,614,292 bytes (limit 1.8 MB).
- **Next: stage 2** (`kit/entries/plan-brief-pfu-2.json`: one need = happiness, sickness kept switched off until the vet clinic, food groups, care helpers, moves pack, vet app screen).

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

## Open / not verified
- Night skip with real friends on real devices, and with the real Firebase (the kit uses a fake one). Not checked: the visit-a-friend's-bed case
  directly (a friend asleep in the beach tent stands in for "not in their own bed"). Away players (aw) and older versions behave as in P2.
- Hats looked at in two contact sheets only (helper pictures not run); the foreman's picture pass covers them.
- Older items from run 4 and pet update 1 stay open (G4-205/222, G4-279, G4-285, 15 grade-1 marks; iPad smoothness with 10 pets).
