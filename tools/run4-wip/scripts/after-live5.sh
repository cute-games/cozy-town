#!/bin/bash
# The live check's town crawl and device tours once more, after pass 9's pictures (nothing heavy beside a check): the crawl now tries a spot
# someone was standing in front of again a moment later (in the 20 Oct Saturday rerun a passer-by took an apartment door's button: C2's only miss).
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
export BACKUP=$S/backups/github-live-2026-10-18.html
export BTITLE="PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-20 (byte for byte tools/prerun4-index.html)"
export PUBLISHED=$S/published/claude-readback-2026-10-20-frame-off.html GITHUB=$S/published/raw-github-main.html
until grep -q "PASS9 PICTURES DONE" $S/pass9.log 2>/dev/null; do sleep 10; done
mkdir -p $S/runs/live20/out/stages-fourth; mv $S/runs/live20/out/stages/crawl_ipad-landscape_town.json $S/runs/live20/out/stages/tour_*.json $S/runs/live20/out/stages-fourth/
cp $S/live20-crawl4.log $S/runs/live20/crawl4-final.log
echo "town crawl and tours rerun (5) starts $(date -u +%T)"
$S/qcheck4.sh live20 $S/published/raw-github-main.html "" "" "" --full > $S/live20-crawl5.log 2>&1
echo "town crawl and tours rerun (5) ended $(date -u +%T): $(grep -E '^RESULT' $S/live20-crawl5.log)"
