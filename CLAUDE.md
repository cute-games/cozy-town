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

## Glitch loop rules (agreed with the owner 21 Oct; they replace "loop until one full pass finds nothing new" from pass 20, after pass 19)
1. Re-check only what changed. Scripted kit checks still run in full every pass. One full picture pass at the end.
2. 4-5 viewers per pass, each with its own focus (dark mode, iPad touch, shops/people, lighting/objects, text/UI). Rotate the focus each pass.
3. Viewers and first checkers: Sonnet or Opus at Medium. Decisions and game edits: Opus Max. Opus Max confirms every mark before an edit.
4. Stop when 2 passes in a row have no fix above minor, or after 3 passes. Then do one full final pass. Leftover minor marks go into the report and IDEA's PAGE as a visible list.
5. Repeat checks (counts, positions, distances, mark filter) run as plain scripts, not agents.
6. Start a fresh chat once the context passes about 300k.
The final check is unchanged.

How they apply (checked against the real files, 21 Oct):
- What changed = the spots of the last pass's fixes: each fix's probe views (`views_fN.py` with `probe_views.py`), on the screen where the mark was seen and one other screen shape, light and dark for cards; at most about 40 pictures, so every viewer sees all of them. `shots8.py`, `shots4b.py` and `shots4c.py` take no subset: their views build on each other (big-house uses house-paint's camera; the photo views follow one another). A pass with no fixes leaves nothing to re-check.
- Kit checks in full = all 41 lines of the night3 and run4 stages (N1 to N41, about 21 minutes), as in every pass so far. The whole kit, with its crawls and the 10-screen sweep (106 lines, hours), is the final check.
- Viewers: each looks at every picture of its set and reports what is wrong in its focus, and anything broken (grade 3) whatever its focus. With 4 viewers, the focus left out rotates. In a full pass one focus covers 120 to 340 pictures (pass 18: text/UI 342, iPad 233, dark 213, lighting/objects 161, shops/people 120) and a viewer used 140k to 265k tokens for 38 pictures, so in the full final pass each focus runs in batches of at most 40, each picture with the focus it belongs to.
- Models: viewers and first checkers run as Sonnet at medium effort. The main session (Opus at max) decides, edits, and opens every mark's picture itself before an edit; if it runs on another model, an Opus-max sub-agent confirms. NIGHT-PLAN-4's "Opus at max for important work" still holds for decisions and edits.
- Minor = grade 1 on the plan's scale (1 small, 2 clear, 3 broken), set in the glitch entry when the mark is decided. A kit line that fails (not on timing) is above minor. The count starts at pass 20: stop after two passes in a row with no fix above minor, or after pass 22; then the full final pass. The recorded grades show no fix above minor since pass 13, so counting earlier passes would end the loop at once.
- In the full final pass a mark above minor is fixed and re-checked like a pass; minor ones are not fixed. Every leftover minor mark (grade 1, not fixed, the open ones too) goes into `tools/RUN-4-REPORT.md` and as a list section in IDEA's PAGE (the owner's doc, written through the docs connector).
- The mark filter (`dcfilterN.py`) and the counts, positions and distances (`views_f*.py`) are scripts already.
- Fresh chat: the session cannot read its own context size, so it hands off at a pass boundary, after a commit. On this branch: the kit as used (`cozy-check-v6.zip`, rebuilt 21 Oct with the finish's kit fixes), the prompts and "should look like" lines (`tools/run4-wip/scripts/stage3/`), the scripts (`tools/run4-wip/scripts/`; 70 carry the old session's scratchpad path, replace it first), the records (`tools/run4-wip/data/`) and the report drafts (`tools/run4-wip/data/finish-drafts/`). `RUN-4-REPORT.md` section 0 is brought up to date at the end; until then the drafts say where things stand.
