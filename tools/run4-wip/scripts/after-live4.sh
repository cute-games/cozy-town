#!/bin/bash
# The live check's town crawl and device tours once more, on a game Saturday like the last time: the kit's replay now meets a time-bound thing on the
# crawl's own game day (the bus timetable changes from week to week; on "the next Tuesday" 5 of 7 tours met no bus).
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
export BACKUP=$S/backups/github-live-2026-10-18.html
export BTITLE="PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-20 (byte for byte tools/prerun4-index.html)"
export PUBLISHED=$S/published/claude-readback-2026-10-20-frame-off.html GITHUB=$S/published/raw-github-main.html
python3 $S/wait_gameday.py 5 600
mkdir -p $S/runs/live20/out/stages-third; mv $S/runs/live20/out/stages/crawl_ipad-landscape_town.json $S/runs/live20/out/stages/tour_*.json $S/runs/live20/out/stages-third/
echo "town crawl and tours rerun (4) starts $(date -u +%T)"
$S/qcheck4.sh live20 $S/published/raw-github-main.html "" "" "" --full > $S/live20-crawl4.log 2>&1
echo "town crawl and tours rerun (4) ended $(date -u +%T): $(grep -E '^RESULT' $S/live20-crawl4.log)"
