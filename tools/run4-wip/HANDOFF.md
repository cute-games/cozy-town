# Run 4 finish: pick up here (hand-off of 21 Oct)

The owner's words (20 Oct): "Finish run 4 … do every open item … alone. First the full final check on the live game. Clock: show "9:40 Wed" …
Same rules as NIGHT-PLAN-4.md. End with a pull request. Never stop to ask." On 21 Oct the owner set new glitch loop rules (`CLAUDE.md`,
"Glitch loop rules") and asked for a fresh chat once the context passes about 300k: this is that hand-off.

## Where things stand
- Done: the full final check on the live game (`tools/run4-wip/final-check-2026-10-20-live.txt`), the clock "9:40 Wed", C5, critic round 6,
  the friends' arc, the ducks, glitch passes 8 to 19 with fixes f3 to f16 (`tools/run4-wip/scripts/patch_f*.py`, all applied to
  `index.html`, md5 d30bebcd, 1,596,164 bytes, 55 online-part lines). Glitch entries G4-168 to G4-326 (`tools/run4-wip/scripts/glitches5_data.py`).
- Pass 19, the last under the old rules: 74 marks; 22 to 8 double-checkers, 16 kept; f16 (7 fixes, 13 edits) applied after probes before and after (`views_f16*.py`, a real two-phone dance-off `shots4c_f.py`); entries G4-317 to G4-326; the fix plan `tools/run4-wip/data/stage3-dc19/pass19-fixplan.md`; its section in `finish-drafts/report-finish-draft.md`. The kit has not run on the f16 file yet: pass 20 does that first (KIT20 in the report draft).
- Next: pass 20, the first under the new rules: it re-checks only f16's spots (f16's seven fixes; `pass20.sh` takes the pictures (26: `views_f16.py` on iPad and sideways iPhone in light and on iPad in dark, `views_f16b.py` on 1 September on iPad and PC, the dance-off), lists them (`pv2json.py`, notes in `notes_f16.py`) and writes the five briefs (`viewfocus.py`)). Then the stop rule, the full final pass, the final
  stage (below).
- Pass 20 (21 Oct, a fresh session): done. The kit on the f16 file: 40 of 41 PASS, N25 FAIL (the phone's copy of the photo, an f16 side
  effect); 17 of 18 marks kept; f17 (`patch_f17.py`, 4 edits: N25's phone photo, a speech bubble below the top row) applied (md5 528fe0df,
  1,596,650 bytes); G4-327 to G4-330; `stage3-dc20/pass20-fixplan.md`. Fixes above minor, so the clean-pass count starts at 21. Next: pass 21
  (`p21kit.sh`, `pass21.sh`, `dcfilter21.py` ready). Set-up note: `pip install playwright==1.56.0` (it matches the Chromium in /opt/pw-browsers).
- Pass 21: done. The kit on the f17 file 41 of 41 PASS; 7 marks, 5 kept; f18 (`patch_f18.py`, 1 edit, grade 1: a chat opens at a tall newest
  message's top) applied (md5 d93c5870); G4-331, G4-332. The first clean pass. Next: pass 22 (`p22kit.sh`, `pass22.sh`, `dcfilter22.py`), the
  last loop pass; then the full final pass.
- Not yet done (the final stage): the version stamp, the rollback copy, the full check on the final file, the glitch list, the report, the PR.

## Set up a fresh container (the scratchpad of the old session is gone)
```
R=/home/user/cozy-town; S=<this session's scratchpad>; OLD='/tmp/claude-0/-home-user-cozy-town/[0-9a-f-]{36}/scratchpad'
mkdir -p $S $S/backups $S/runs && cp -r $R/tools/run4-wip/scripts/. $S/
grep -rlE "$OLD" $S | xargs sed -i -E "s#$OLD#$S#g"     # about 200 scripts carry the scratchpad path of an old session (stage 3's or this one's)
mkdir -p $S/kit6 && unzip -q $R/cozy-check-v6.zip -d $S/kit6  # the kit as used (rebuilt 21 Oct)
cp $R/tools/prerun4-index.html $S/backups/github-live-2026-10-18.html   # qcheck4.sh's BACKUP (md5 709bf763, the same file)
```
The prompts and the "should look like" lines are in `$S/stage3/` after the copy. Playwright and Chromium are in the environment.

## A pass under the new rules (pass 20 as the example)
1. Kit: `bash $S/p20kit.sh` (ready; later passes: 20→21), alone; all 41 night3 and run4 lines must PASS (N15 on timing: run it alone again).
   (`p19kit.sh` named a backup file `github-live-2026-10-19.html` that never existed; the night3 and run4 lines do not open it. The backup is
   `github-live-2026-10-18.html`, as in the other kit scripts and `p20kit.sh`.)
2. Pictures of what changed: `bash $S/pass20.sh` (it waits for the kit, then does all of this step for pass 20). In general: the probe views of each fix of the last pass (`views_f16*.py`, written with the fix) through `probe_views.py`
   on the screen where each mark was seen and one other screen shape (light and dark for cards); about 40 pictures at most. A list
   [{path, prof, theme, note}] of them (`pv2json.py OUT.json NOTES.py DIR...`) goes to `viewfocus.py $S/stage3-view20 20 5 list.json`: five focus
   briefs (dark mode, iPad touch, shops/people, lighting/objects, text/UI; the order rotates with the pass number).
3. Five viewers: the PHOTOVIEWER prompt of `stage3/agent-prompts.md` with each brief, Agent model sonnet, effort medium; answers to
   `$S/stage3-marks20/batch-NN.txt` (one per viewer: `dcfilter20.py` reads `batch-*.txt`).
4. `dcfilter20.py $S/stage3-marks20` (ready: `dcfilter19.py` plus pass 19's decisions and drops; for pass 21 make `dcfilter21.py` the same way) → `marks-keep.txt`; read `marks-aside.txt` for reasons
   that do not fit and send those on too. `dcbrief.py marks-keep.txt $S/stage3-dc20 3 <pictures json>` → first checkers (the
   DOUBLE-CHECKER prompt, sonnet, medium) → `dcmerge.py $S/stage3-dc20`.
5. Decide each kept mark (this session, Opus at max): open its picture before any edit; trace the cause in the code; grade it on the plan's
   scale (1 small, 2 clear, 3 broken). Fixes: `patch_f17.py` (each edit must match once), on a copy first (`jscheck.py`, `strip_online.py`
   finds 55, size under 1.8 MB), probes before and after (`views_f17*.py`), then the real file.
6. Records: entries in `glitches5_data.py` (DC, PASS, F17, G4-3xx with grade and status), the pass's fixplan in `$S/stage3-dc20/`, its
   section in `finish-drafts/report-finish-draft.md` before "#### Decisions made alone (run 4 finish)", `copydata.sh 20`, the scripts to
   `tools/run4-wip/scripts/`, commit, push to `claude/run-4-finish`.
7. Stop rule (counting from pass 20): two passes in a row with no fix above minor (grade 1 only), or after pass 22. Then the full final
   pass: `pass19.sh`-style full pictures (made from `pass19.sh`), `viewfocus.py OUT 23 5 pictures.json --full` (batches of 40 by focus,
   about 14 viewers, sonnet medium), the filter, first checkers, decisions; a mark above minor is fixed and re-checked like a pass, minor
   ones are not fixed. Every leftover minor mark (grade 1, not fixed, the open ones too) goes into the report and IDEA's PAGE (a list
   section next to "Open questions", through the docs connector; the doc is https://claude.ai/artifact/1FUaiZuvAye9SBkN3heUVK).

## The final stage
- `COZY_BUILD`: a stamp bigger than the live 2026101802 (e.g. 2026102101), once; then `python3 rollback.py STAMP` (the rollback copy
  becomes STAMP+49) and check it.
- The final check, unchanged: `qcheck4.sh FINAL <the final index.html> "" "" "" --full` with BACKUP and BTITLE as in `p20kit.sh`,
  nothing heavy beside it (run N15 alone again if it fails on timing); 55 online-part lines; under 1.8 MB.
- `glitches5_data.py`: AFTER_SETS and KIT_SETS to the last pass; `mkglitches5.py` and `glitchlist5.py` → `tools/GLITCH-LIST-4.md`.
- `tools/RUN-4-REPORT.md` from `finish-drafts/` (`report-s0-draft.md` → section 0; `report-finish-draft.md` → section 1's "Run 4
  finish"; `report-tail-draft.md` → 3c, 4, 5c, 6c, 7c, 8, 9c; fill every placeholder: LASTPASS, LASTFIX, STAMP, ROLLBACKSTAMP,
  GLITCHCOUNT, GLASTID, FINALCHECK, PASSESLINE, LASTPASSLINE, PASSTAIL, FRIENDSPASS10, DUCKSPASS10, PRNUM, PLACEHOLDER, KIT20, NEWRULESLINE), the
  leftover minor list; `critic-scores.md`; `tools/run4-wip/README.md` from `readme-wip-draft.md`; `CLAUDE.md` status from
  `claude-status-draft.md`; `cozy-check-v6.zip` rebuilt if the kit changed. Then delete `finish-drafts/` and this file.
- Commit, push, and the pull request "Run 4, finished" into `main` (`pr-body-draft.md`; look for a PR template first). Never push to main.
