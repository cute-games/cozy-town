# HANDOFF — read this first (one page; updated 23 Oct 2026)

## Where things stand
- Live: `index.html` on `main` (cute-games.github.io/cozy-town), run 4 finished (PR #7, stamp 2026102101), merged 22 Oct.
- Only the GitHub version exists (22 Oct). The old Claude artifact copy is dropped.
- Rules: `CLAUDE.md` ("Rules that hold for every run" + "Update rules v3"). Check kit: `cozy-check-v7.zip` (README-KIT.md inside); if it is missing, build it with `python3 tools/kit-v7/make_v7.py` and commit it.
- Ideas, plan, what is live, open questions: the owner's IDEA's PAGE (link in the Claude project memory, not in this public repo).
- Open from run 4: G4-205/G4-222 (pets at your heels), G4-279 (salon floor on a big screen), G4-285 (phone job list, sideways iPhone), 15 grade-1 marks ("Leftover minor marks" in `tools/RUN-4-REPORT.md`).

## How to start an update (cheapest safe order)
1. Read this file and `CLAUDE.md`. Do not read `tools/RUN-4-REPORT.md` whole; search it.
2. Agree the plan with the owner (short plan, wait for OK).
3. Backup: branch `backup-YYYY-MM-DD` from `main`.
4. Build on a branch `claude/<name>`; search the code for every place a changed part is used (the game file is 1.6 MB; never read it whole).
5. Check: kit v7 (README-KIT.md). Glitch hunt only where the update touched (CLAUDE.md, v3 rule 1).
6. Pull request; the owner merges. Then run the kit again with `--github` to fill F3.
7. Update this file (keep it one page) and say where the tokens went.

## Next session should know
- (fill in at the end of each session: what was done, what is open, where work stopped)
