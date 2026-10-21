# Run 4: the unfinished work, finished (20 and 21 Oct 2026)

This folder kept run 4's open work at the owner's wrap-up (18 Oct). On 20 and 21 Oct every open item was done on the branch
`claude/run-4-finish` (the pull request "Run 4, finished" into `main`); this file says how each one ended and where its traces are.
The report is `tools/RUN-4-REPORT.md` (section 0, and the "Run 4 finish" parts of sections 1, 2, 4, 5c and 9c).

## How each open item ended

| item | how it ended |
|---|---|
| The final check's untested lines | Run on the live game (the GitHub file of 18 Oct, md5 8425c145) on 20 Oct, in blocks: the whole check, then the lines the kit's own gaps had failed, again after each kit fix (nothing heavy beside them). Last state: every line PASS but C5, a real one (the dance-off's arrow buttons had 20 px corners), fixed here (`scripts/patch_f2.py`); C1-WK not run and G not verified, as on 18 Oct. Every line as printed: `final-check-2026-10-20-live.txt`. The kit's fixes (never weaker) are in `cozy-check-v6.zip`'s README-KIT.md and the report. |
| Clock format | The owner's decision of 20 Oct: one hour digit, "9:40 Wed" (`scripts/patch_f1.py`). |
| S3-L, pass 7 | Covered by pass 8 on the fixed file, as planned. |
| S3-N, pass 8 | Done: the full pass (92 kept marks, fixed or written down: f3, f4, f5, G4-168 to G4-211), then PASSES. |
| Critic round 6 (the last) | Done on pass 9's pictures: photographer 7, parties 8, holiday spot 7, house floors and colour 8, one clock 7. The loops end there; where each is stuck: `data/critic-scores.md`. |
| Friends around you | Seen in pass 8 (one hidden behind another on a narrow pavement: f5), by critic round 6 and pass 9 (still a face half behind Luna): they now stand on an arc over the free part of the view, its ends nearer and its middle further back (f6); N3 passes. FRIENDSPASS10 |
| Ducks | The new faces seen in pass 9 and by critic round 6 ("no eyes, facing each other after feeding"): bigger eyes with a shine, and fed ducks each swim to a spot of their own and turn to you (f6). DUCKSPASS10 |

## What is in this folder
- `scripts/`: every helper of stage 3 and of the finish, and every patch as applied (`patch_s3*.py` in stage 3, `patch_f1.py` to `patch_f6.py` in the finish; `bookswap.py` and `bookshots*.py` for the What's new book's pictures).
- `data/`: briefs, marks, double-checks, critics and maps of every pass (`stage3-p*`, `stage3-kit*`, `stage3-view*`, `stage3-marks*`, `stage3-dc*`, `stage3-critic*`), the glitch list's source (`glitches.json`), the critic scores (`critic-scores.md`).
- `final-check-2026-10-18.txt`: the final check block of the wrap-up; `final-check-2026-10-20-live.txt`: the live game's check of 20 Oct.

## A full pass, step by step (as run in the finish)
All helpers are in `scripts/`. They were written for the session's scratch folder: set `S` (and `KIT`) at the top of each to the folder you unpack this into, and unzip `cozy-check-v6.zip` (repo root) to `kit6/cozycheck` next to them.
1. Kit pictures and lines: a kit run of `night3,run4` on the file (`qcheck4.sh`), then `python3 kitset.py stage3-kitN kitN runs/<that run>`.
2. Photographer, after the check (nothing heavy beside a check): `shots8.py stage3-pN`, `shots4b.py stage3-pNb`, `shots4c.py stage3-pNc` (about 16 minutes).
3. Change-spotter: `passdiff8.py stage3-pN/map.json` against the last pass's maps (`pass10.sh` shows the whole step); it forces every spot with a kept mark.
4. Viewers: `viewbatch.py stage3-viewN 30 …/map.json …`, one fresh sub-agent per brief.
5. Double-check: `dcfilter10.py stage3-marksN` (sets aside what earlier passes decided, each with its reason), `dcbrief.py`, one fresh sub-agent per brief, `dcmerge.py stage3-dcN`.
6. Reporter: the entries in `glitches5_data.py`, then `mkglitches5.py` and `glitchlist5.py` (`tools/GLITCH-LIST-4.md` and its pictures).
7. Fixer: each kept mark from its cause (a patch script), probes before and after, the kit lines of the parts touched. Loop until one full pass finds nothing new.
