# Run 4: the unfinished work (kept at the owner's wrap-up, 18 Oct 2026)

Branch `claude/run-4-wip` = `main` after run 4 stages 1 to 3 were merged (18 Oct 2026) plus this folder. Nothing here is in the game file: `index.html` is the same as on `main` (stamp 2026101802, md5 8425c145).

What went live on 18 Oct: PRs #4, #5 and #6 merged into `main`; the Claude version (the artifact "Cozy Town", version 43) published from the same game without the web part (md5 579a3449). The final check was stopped by the owner after the save tests; its block, with the publish lines F2 and F3 filled in after the merge, is `final-check-2026-10-18.txt` (every line that ran passes; the walk-through, the device tests and the night-3 and run-4 lines on the final file are NOT VERIFIED). Backups made first (private artifacts, read back byte for byte): "PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3)" and "Cozy Town BACKUP 2026-10-18 — Claude version before run 4".

## What is open

| item | where it stopped | how to pick it up |
|---|---|---|
| S3-L, pass 7 | 4 of its 13 viewer batches finished before the org's spend limit stopped every sub-agent (about 10:50 UTC); the other 9 never ran. Fresh double-checkers kept 15 of the 23 marks; all 15 are fixed (glitch list G4-160 to G4-167, and G4-148 came back and was fixed) but no later pass has looked at the fixes. | Nothing to resume on its own: pass 8 covers the same pictures on the fixed file. The 9 briefs are in `data/stage3-view7/` and `data/stage3-view7b/` (their pictures were in the session's scratch and are gone). |
| S3-N, pass 8 | Started on the final game, stopped by the wrap-up after 71 of about 440 pictures (kept in `data/stage3-p8-partial/`). None looked at. | The full pass, below. |
| Critic round 6 (the last) | Not run. Tree park is done (8, 8, 8). The other five stand at their round-5 scores: photographer 7, parties 8, holiday spot 7, house floors and colour 7, one clock 6. Every round-5 point was fixed (c6d204f, 8f65789, f26b169, fd70159, 8fe0d95) and not scored again. | `criticbrief.py stage3-critic6 6 <pass-8 maps> <kit map>`, then one fresh critic sub-agent per part. After round 6 every loop stops: write where each is stuck in `critic-scores.md` (its last section says where they stand now). |
| Friends around you | Walking round you to the front was tried and dropped: it broke N3 (a friend got stuck behind a fence, or between you and a pet). They walk straight to their spots as before. The narrower fan and the spot rules (8f65789) went in; no critic has seen them yet. | Critic round 6 (one clock). |
| Ducks | New faces (bill, eyes with a shine, wings, a tail; 8f65789). No viewer or critic has seen them yet. | Pass 8 and critic round 6. |
| The final check's untested lines | The owner stopped the final check after the save tests: the walk-through (C2, C2b), the device tests (C1, C3, C4, C5, T1 to T4, K1) and the night-3 and run-4 lines (N1 to N41) did not run on the live file. | Run the full check again on `main` (`qcheck3.sh` with `--full`; the backup argument is the dated GitHub-file backup above, or a new one of the file then live). |
| Clock format | Every time reads with two hour digits ("09:40 Wed", "Sleeping until 07:00"). The plan's example was "9:40 Wed". Both pass N15. | The owner's decision. Going back to one digit: `clockStr()` in `index.html`, the sleep screen line and the `08:00` texts (see `scripts/patch_s3k2.py`, edit o7). |

## A full pass, step by step (pass 8)

All helpers are in `scripts/`. They were written for the session's scratch folder: set `S` (and `KIT`) at the top of each to the folder you unpack this into, and unzip `cozy-check-v6.zip` (repo root) to `kit6/cozycheck` next to them.

1. Photographer: `python3 shots4.py stage3-p8`, `python3 shots4b.py stage3-p8b`, `python3 shots4c.py stage3-p8c` (about 20 minutes; run nothing else heavy at the same time: on a busy machine N15 and N13 can fail on timing alone).
2. Kit pictures: a kit run of `night3,run4` with `qcheck.sh`, then `python3 kitset.py stage3-kit8 kit8 runs/<that run>`.
3. Change-spotter: `python3 passdiff.py stage3-p8/map.json stage3-p7/map.json stage3-p6/map.json` (and the same for p8b, p8c). It forces every spot with a kept mark (`stage3-dc*/merged.json`).
4. Viewers: `python3 viewbatch.py stage3-view8 38 stage3-p8/map.json stage3-p8b/map.json stage3-p8c/map.json stage3-kit8/map.json`, one fresh sub-agent per brief ("You are a PHOTOVIEWER. Read the brief file …/batch-NN.md …").
5. Double-check: `python3 dcfilter7.py stage3-marks8 …` (sets the photographer's own mistakes aside), `python3 dcbrief.py …`, one fresh sub-agent per brief ("You are a DOUBLE-CHECKER …"), then `python3 dcmerge.py stage3-dc8`.
6. Reporter: add the pass-8 entries to `mkglitches4.py` (G4-168 on), run it, then `python3 glitchlist.py` writes `tools/GLITCH-LIST-4.md` and its small pictures.
7. Fixer and fix-checker: fix each kept mark from its cause, take its spot again, run the kit lines of the parts touched.
8. Loop until one full pass finds nothing new. Then the full check (`qcheck3.sh` with `--full`), the report's stage-3 part and the pull request.

## What is in this folder

- `scripts/`: every helper of stage 3: the photographer (`shots4*.py`), change-spotter (`passdiff.py`), batchers and filters (`viewbatch.py`, `dcfilter*.py`, `dcbrief.py`, `dcmerge.py`, `criticbrief.py`), the glitch list and report makers (`mkglitches*.py`, `glitchlist.py`, `glitchpic.py`, `stage3_report.py`, `pr_body3.py`, `pics3commit.py`), probes (`probe*.py`, `n*only.py`), kit runners (`qcheck*.sh`), the counts (`counts3.py`), the rollback maker (`rollback.py`) and the fix patches as they were applied (`patch_s3*.py`; the game file already has them).
- `data/glitches.json`: the source of `tools/GLITCH-LIST-4.md` (G4-001 to G4-167).
- `data/critic-scores.md`: every critic score and what each critic said, round 1 to 5, and where each loop stands.
- `data/stage3/`: the viewer, double-checker and critic prompts, the "should look like" lines, the report's stage-3 sections and the pass notes.
- `data/stage3-view*/`, `data/stage3-marks*/`, `data/stage3-dc*/`, `data/stage3-critic*/`: every brief, viewer mark, double-check answer and critic answer as text.
- `data/stage3-p*/`, `data/stage3-kit*/`: where each picture of each pass was taken (`map.json`), what the change-spotter passed on (`change-spotter.json`), and the photographer's logs.
- `data/counts3.json`: the before/after counts of the wrap-up (live game, end of stage 2, end of stage 3).
- `data/stage3-p8-partial/`: the 71 pictures pass 8 took before the wrap-up stopped it (small webp) and the photographer's log.
- `final-check-2026-10-18.txt`: the final check block of the wrap-up.

Not kept: the pictures themselves (about 3 GB of full-size screenshots in the session's scratch). The photographer scripts take them again; the glitch list's small before and after pictures are in `tools/pictures-4/stage3-glitches/`.
