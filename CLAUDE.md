# Cozy Town: project memory for Claude Code

A three.js toon game for kids in one file, `index.html` (GitHub Pages serves `main`). The owner plans each run in a `NIGHT-PLAN-*.md` file at the root; the run's report is in `tools/` (`RUN-4-REPORT.md` for run 4, its section "0. Progress" is where a restarted session picks up).

## Status (18 Oct 2026, after the owner's wrap-up)
- Live: run 4 stages 1 to 3 (stamp 2026101802) on GitHub `main` and in the Claude version (the artifact "Cozy Town"), merged and published after the save tests. The rest of that final check was stopped: the walk-through (C2, C2b), the device tests (C1, C3, C4, C5, T1 to T4, K1) and the night-3 and run-4 lines on the final file are NOT VERIFIED (the report, section 2, stage 3 end).
- Backups made before the update (private artifacts, read back byte for byte): "PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3)" and "Cozy Town BACKUP 2026-10-18 — Claude version before run 4".
- Run 4 pull requests: #4 "Run 4, stage 1", #5 "Run 4, stage 2", #6 "Run 4, stage 3" (all three merged into `main` on 18 Oct).
- Open (run 4, stage 3), kept on the branch `claude/run-4-wip` (`tools/run4-wip/README.md` says how to pick each up):
  - S3-L, pass 7: 9 of its 13 viewer batches never ran (spend limit); its 15 kept marks are fixed (G4-160 to G4-167, G4-148), not yet seen by a later pass.
  - S3-N, pass 8: stopped after 71 pictures, none looked at; "loop until one full pass finds nothing new" is not met.
  - Critic round 6, the last: not run. Tree park done; photographer 7, parties 8, holiday spot 7, house floors and colour 7, one clock 6 (round-5 scores; every round-5 point fixed, not scored again).
  - Friends around you: walking round you was dropped (it broke N3); the narrower fan and spot rules are in, not yet seen by a critic.
  - Ducks: new faces, not yet seen by a viewer or critic.
  - Clock format: times read "09:40 Wed" (two hour digits); the plan's example was "9:40 Wed". The owner decides.
- Going back: `tools/prerun4-rollback.html` (the night-3 game with stamp 2026101851) put live as `index.html` takes every player back by itself; or revert the run-4 pull requests.

## Rules that hold for every run
- Keep family names out of this public repo. The title's credit line stays exactly as it is.
- The 55 online-part lines stay as they are (`strip_online.py` in the kit must find all 55). `index.html` under 1.8 MB.
- Nothing shared between players comes from `Math.random`: only the one clock, data sent online, or a seeded hash. The real calendar only through `realDate()`.
- Old saves keep everything; old and new versions still see each other. Test data is named ZZTEST.
- The check kit (`cozy-check-v6.zip`, read its `README-KIT.md`): every line starts as FAIL, no line is ever made weaker; a rewritten line is listed old → new in the report.
- Bump `COZY_BUILD` once at the end of each stage (date + counter, always bigger than the live stamp).
- Never push to `main`: changes go in through pull requests the owner merges, or a merge the owner asked for after the full check passed.
- Run nothing heavy next to a check: on a busy machine N13 and N15 fail on timing alone.
