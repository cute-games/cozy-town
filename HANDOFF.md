# HANDOFF — read this first (one page; updated 29 Oct 2026)

## Where things stand
- Live: `main` (cute-games.github.io/cozy-town), run 4 finished (PR #7, stamp 2026102101), merged 22 Oct.
- 29 Oct: Plan 1 (split the game file) is in the pull request from `claude/beautiful-noether-vinvf2` (stamp 2026102901), waiting for the owner's merge. Backup: branch `backup-2026-10-29`. Plan 2 (Blender models, another chat) waits for this merge before touching game files.
- Only the GitHub version exists (22 Oct). The old Claude artifact copy is dropped.
- Rules: `CLAUDE.md` ("Rules that hold for every run" + "Update rules v3"). Check kit: `cozy-check-v7.zip` (README-KIT.md inside; `tools/kit-v7/make_v7.py` rebuilds it from v6). The kit needs Python Playwright: `pip install --break-system-packages playwright==<the version of the node one>` (the container has the browser).
- Ideas, plan, what is live, open questions: the owner's IDEA's PAGE (link in the Claude project memory, not in this public repo).
- Open from run 4: G4-205/G4-222 (pets at your heels), G4-279 (salon floor on a big screen), G4-285 (phone job list, sideways iPhone), 15 grade-1 marks ("Leftover minor marks" in `tools/RUN-4-REPORT.md`).

## The game is split (Plan 1, owner's OK 29 Oct; once merged)
- `index.html` (10 KB: page, inline version stamp, small Firebase glue) + `css/style-1.css` + `js/00-core.js` … `js/09-mainloop.js` (the game, in the order of its section banners: core, models, world, game, panels, map, jobs, designer, hud, main loop) + `js/lib-1.js`, `js/lib-2.js` (Firebase). Edit the js/css files; never read a whole big one (02 and 03 are about 250-300 KB).
- Scripts in `tools/split/`: `split.py` (split / join / verify), `check_split.py` (lines S1-S4), `prepare.py` (one-time, already done: do not run again).
- The files run one after another. Code that runs while the game loads may only call functions of its own file or an earlier one (in one file every function was known from the start). The split found one such line (the party hats call `realDate`/`nyeParty`); those two functions now sit in models.
- Each file is loaded as `?v=<its hash>` and the stamp script names a hash of all files, so phones never mix old and new files. The stamp `const COZY_BUILD=` stays inline in `index.html`: old Home Screen copies look for it there.
- Before every pull request (the kit tests one joined file):
  1. At the end of a stage bump `COZY_BUILD` in `index.html`. Then `python3 tools/split/split.py join . /tmp/bundle.html --edited` (`--edited` because the edited files no longer match their old `?v=` hashes)
  2. Kit v7 full check on `/tmp/bundle.html` as `new/github-new.html`; the live file for the kit is the joined `main` (`split.py join` of a `main` checkout).
  3. `python3 tools/split/split.py split /tmp/bundle.html .` (writes the files and the new hashes)
  4. `python3 tools/split/check_split.py --site . --tested /tmp/bundle.html --live <live index.html: the joined main> --three <kit>/cozycheck/three-r128.min.js` (all four lines PASS). Not next to a kit run (it starts a browser).
- After the merge: kit with `--github` on the joined live site (`split.py join` of a fresh `main` checkout), and `check_split.py` on it.

## How to start an update (cheapest safe order)
1. Read this file and `CLAUDE.md`. Do not read `tools/RUN-4-REPORT.md` whole; search it.
2. Agree the plan with the owner (short plan, wait for OK).
3. Backup: branch `backup-YYYY-MM-DD` from `main`.
4. Build on a branch `claude/<name>`; search the code for every place a changed part is used.
5. Check: as above (join, kit v7, split, check_split). Glitch hunt only where the update touched (CLAUDE.md, v3 rule 1).
6. Pull request; the owner merges. Then the after-merge checks above.
7. Update this file (keep it one page) and say where the tokens went.

## Next session should know
- 29 Oct (Plan 1): full check `tools/split/final-check-2026-10-29.txt`: ALL PASS (102 lines; C1-WK, F3 not run, G not verified); check_split S1-S4 PASS. Kit v7 lines rewritten (old → new in that file): F2a, N19 (its old-version friend is the night-3 game now), S2. After the merge: run the after-merge checks above.
- Known bugs to fix in the next update: none found by this check. The skeleton's "0 sounds" in N19 is NOT a bug: N19 turns sound off for the 2nd scare (the skeleton) to prove scares are silent then; it fails only if that one makes a sound (run 4 report, job 3).
- Kit timing: B1 can show "spook: missing" (spooky path, October nights) and the teacher stages need game daytime (8:00-20:00 of the 15-minute day): rerun the stage alone, the teacher one just after game 8:00.
