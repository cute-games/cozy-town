# Cozy Town: project memory for Claude Code

A three.js toon game for kids in one file, `index.html` (GitHub Pages serves `main`). **Start every session with `HANDOFF.md` (one page). Never read `tools/RUN-4-REPORT.md` whole (488 KB): search it.** The owner plans each run in a `NIGHT-PLAN-*.md` file at the root; the run's report is in `tools/` (`RUN-4-REPORT.md` for run 4, its section "0. Progress" is where a restarted session picks up).

## Status (23 Oct 2026)
- Run 4 finished: pull request #7 merged into `main` on 22 Oct (stamp 2026102101).
- 22 Oct (the owner): only the GitHub version exists. The Claude version (artifact) is dropped: no syncing, no publishing, no checks on it. Lines below that mention it are history.
- 23 Oct (the owner): cheaper update rules v3 (below) and check kit v7 (`cozy-check-v7.zip`). Backups are dated branches `backup-YYYY-MM-DD`.

## History: status on 21 Oct (run 4 finished, waiting for the owner's merge)
- Live: run 4 stages 1 to 3 (stamp 2026101802) on GitHub `main` and in the Claude version (the artifact "Cozy Town"). Its full final check ran on 20 Oct: every line PASS but C5 (fixed in the finish), C1-WK not run and G not verified as before (`tools/run4-wip/final-check-2026-10-20-live.txt`).
- The finish (pull request "Run 4, finished", branch `claude/run-4-finish`, stamp 2026102101): the clock reads "9:40 Wed" (the owner's decision), C5, the full glitch passes 8 to 25 (fixes f3 to f20), critic round 6 (the last), the friends' arc and the ducks. Its full check on the final file: every line PASS (A2 after the backup was read back on 21 Oct, the files stage rerun alone); C1-WK, F2 and F3 not run, G not verified, as before (`tools/run4-wip/final-check-2026-10-21-final.txt`). Not merged: the owner merges it.
- Backups made before the update (private artifacts, read back byte for byte): "PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3)" and "Cozy Town BACKUP 2026-10-18 — Claude version before run 4".
- Run 4 pull requests: #4 "Run 4, stage 1", #5 "Run 4, stage 2", #6 "Run 4, stage 3" (merged into `main` on 18 Oct); the finish: #7 "Run 4, finished".
- Open for the owner: your pets keep close at your heels, so from your eyes they stand at the bottom of the screen and one can be behind another for a moment (G4-205, G4-222); the salon floor softens near the camera on a big screen (G4-279); the phone's job list on a sideways iPhone shows no part of its second row (G4-285); 15 small marks left as they are (grade 1), listed in `tools/RUN-4-REPORT.md` ("Leftover minor marks") and in IDEA's PAGE. The critic loops ended at round 6 with the Tree park done; where the other five stand: `tools/run4-wip/data/critic-scores.md`.
- Going back: `tools/prerun4-rollback.html` (the night-3 game with stamp 2026102150) put live as `index.html` takes every player back by itself; or revert the run-4 pull requests.

## Rules that hold for every run
- Keep family names out of this public repo. The title's credit line stays exactly as it is.
- The 55 online-part lines stay as they are (`strip_online.py` in the kit must find all 55). `index.html` under 1.8 MB.
- Nothing shared between players comes from `Math.random`: only the one clock, data sent online, or a seeded hash. The real calendar only through `realDate()`.
- Old saves keep everything; old and new versions still see each other. Test data is named ZZTEST.
- The check kit (`cozy-check-v7.zip` from 23 Oct, read its `README-KIT.md`; v4 to v6 are history). If `cozy-check-v7.zip` is not in the repo yet, build it from v6 with `python3 tools/kit-v7/make_v7.py` (repo root) and commit it in your first pull request. In the kit every line starts as FAIL, no line is ever made weaker; a rewritten line is listed old → new in the report.
- Bump `COZY_BUILD` once at the end of each stage (date + counter, always bigger than the live stamp).
- Never push to `main`: changes go in through pull requests the owner merges, or a merge the owner asked for after the full check passed.
- Run nothing heavy next to a check: on a busy machine N13 and N15 fail on timing alone.

## Update rules v3 (agreed with the owner 23 Oct; they cut tokens, the final check is not weakened)
Why: a viewer used 140k-265k tokens for 38 pictures; a full pass was about 1,070 picture views (4-7M tokens); no fix above minor since pass 13; pass 7 hit the spend limit.
1. Glitch hunt only where the update touched: the new feature's areas and the spots of fixes. The kit's code sweep of the whole game (layout, errors, saves, counts) runs every update. If shared parts change (lighting, how things are drawn, people or pet movement), photograph the whole game. A whole-game picture pass about once a month.
2. One viewer per picture, with every focus in its checklist (dark mode, iPad touch, shops/people, lighting/objects, text/UI). Pictures of a new feature get two viewers.
3. A viewer gets all its pictures in one message (batches of at most 40) and answers in a short fixed format: picture, grade 1-3, what, where.
4. The main session (Opus at max) never opens pictures. A helper crops the mark's spot and describes it; the main session decides from that text and opens only the small crop for grade 2-3 marks.
5. Critic loop only when the owner asks.
6. Helpers (viewers, first checkers, croppers) run as Sonnet or at medium effort. Decisions and game edits: Opus at max (or Fable at medium or higher).
7. Hand-off: `HANDOFF.md` is kept to one page and updated at the end of every session.
8. Measure: log tokens per helper; report where the tokens went at the end of the update.
9. Before an update: a dated branch `backup-YYYY-MM-DD` made from `main` (no artifact backup).
The 21 Oct rules below still hold where v3 does not change them (stop rule, scripts for repeat checks, leftover minor marks listed).

## Glitch loop rules (agreed with the owner 21 Oct; they replace "loop until one full pass finds nothing new" from pass 20, after pass 19)
1. Re-check only what changed. Scripted kit checks still run in full every pass. One full picture pass at the end.
2. (replaced by v3 rule 2) 4-5 viewers per pass, each with its own focus (dark mode, iPad touch, shops/people, lighting/objects, text/UI). Rotate the focus each pass.
3. (v3 rules 4 and 6 refine this) Viewers and first checkers: Sonnet or Opus at Medium. Decisions and game edits: Opus Max. Opus Max confirms every mark before an edit.
4. Stop when 2 passes in a row have no fix above minor, or after 3 passes. Then do one full final pass. Leftover minor marks go into the report and IDEA's PAGE as a visible list.
5. Repeat checks (counts, positions, distances, mark filter) run as plain scripts, not agents.
6. Start a fresh chat once the context passes about 300k.
The final check is unchanged.

How they apply (checked against the real files, 21 Oct):
- What changed = the spots of the last pass's fixes: each fix's probe views (`views_fN.py` with `probe_views.py`), on the screen where the mark was seen and one other screen shape, light and dark for cards; at most about 40 pictures, so every viewer sees all of them. `shots8.py`, `shots4b.py` and `shots4c.py` take no subset: their views build on each other (big-house uses house-paint's camera; the photo views follow one another). A pass with no fixes leaves nothing to re-check.
- Kit checks in full = all 41 lines of the night3 and run4 stages (N1 to N41, about 21 minutes), as in every pass so far. The whole kit, with its crawls and the 10-screen sweep (106 lines, hours), is the final check.
- Viewers: each looks at every picture of its set and reports what is wrong in its focus, and anything broken (grade 3) whatever its focus. With 4 viewers, the focus left out rotates. In a full pass one focus covers 120 to 340 pictures (pass 18: text/UI 342, iPad 233, dark 213, lighting/objects 161, shops/people 120) and a viewer used 140k to 265k tokens for 38 pictures, so in the full final pass each focus runs in batches of at most 40, each picture with the focus it belongs to.
- Models (replaced by v3 rule 4: the main session no longer opens pictures, only small crops of grade 2-3 marks): viewers and first checkers run as Sonnet at medium effort. The main session (Opus at max) decides, edits, and opens every mark's picture itself before an edit; if it runs on another model, an Opus-max sub-agent confirms. NIGHT-PLAN-4's "Opus at max for important work" still holds for decisions and edits.
- Minor = grade 1 on the plan's scale (1 small, 2 clear, 3 broken), set in the glitch entry when the mark is decided. A kit line that fails (not on timing) is above minor. The count starts at pass 20: stop after two passes in a row with no fix above minor, or after pass 22; then the full final pass. The recorded grades show no fix above minor since pass 13, so counting earlier passes would end the loop at once.
- In the full final pass a mark above minor is fixed and re-checked like a pass; minor ones are not fixed. Every leftover minor mark (grade 1, not fixed, the open ones too) goes into `tools/RUN-4-REPORT.md` and as a list section in IDEA's PAGE (the owner's doc, written through the docs connector).
- The mark filter (`dcfilterN.py`) and the counts, positions and distances (`views_f*.py`) are scripts already.
- Fresh chat: the session cannot read its own context size, so it hands off at a pass boundary, after a commit. On this branch: the kit as used (`cozy-check-v6.zip`, rebuilt 21 Oct with the finish's kit fixes), the prompts and "should look like" lines (`tools/run4-wip/scripts/stage3/`), the scripts (`tools/run4-wip/scripts/`; 70 carry the old session's scratchpad path, replace it first), the records (`tools/run4-wip/data/`) and the report drafts (`tools/run4-wip/data/finish-drafts/`). At the end of the finish (21 Oct) the drafts went into `RUN-4-REPORT.md` (section 0 says where things stand) and were removed.
