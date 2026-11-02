# HANDOFF — read this first (one page; updated 2 Nov 2026: Pets and Farm Update ready for its pull request)

## Where things stand
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
