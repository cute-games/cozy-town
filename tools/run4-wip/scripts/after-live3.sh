#!/bin/bash
# The rest, one heavy job at a time: (1) the p8kit run already going: wait for it; kit pictures; (2) the photographer's three scripts on the file with the
# clock and button fixes; (3) at the next game Friday the live check's run-4 stage again; (4) at the game Saturday after it, the live check's town crawl
# and the device tours again (the judges are out; the bus ride; the crawl finds targets by label; the tours meet time-bound things at the crawl's hour).
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
export BACKUP=$S/backups/github-live-2026-10-18.html
export BTITLE="PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-20 (byte for byte tools/prerun4-index.html)"
while pgrep -f "tag p8kit" > /dev/null; do sleep 10; done
echo "kit run ended $(date -u +%T): $(grep -c '^    PASS | N[0-9]* [A-Z]' $S/p8kit.log) PASS lines, $(grep -c '^    FAIL | N[0-9]* [A-Z]' $S/p8kit.log) FAIL lines"
python3 $S/kitset.py $S/stage3-kit8 kit8 $S/runs/p8kit
md5sum /home/user/cozy-town/index.html
python3 -u $S/shots8.py $S/stage3-p8 > $S/p8a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p8a.log)"
python3 -u $S/shots4b.py $S/stage3-p8b > $S/p8b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p8b.log)"
python3 -u $S/shots4c.py $S/stage3-p8c > $S/p8c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p8c.log)"
echo "PASS8 PICTURES DONE $(date -u +%T)"
export PUBLISHED=$S/published/claude-readback-2026-10-20-frame-off.html GITHUB=$S/published/raw-github-main.html
python3 $S/wait_gameday.py 4 120
mv $S/runs/live20/out/stages/run4.json $S/runs/live20/out/stages/run4.first.json
echo "run-4 rerun starts $(date -u +%T)"
$S/qcheck4.sh live20 $S/published/raw-github-main.html "" "" "" --full > $S/live20-run4b.log 2>&1
echo "run-4 rerun ended $(date -u +%T): $(grep -E '^RESULT' $S/live20-run4b.log)"
python3 $S/wait_gameday.py 5 300
mkdir -p $S/runs/live20/out/stages-first; mv $S/runs/live20/out/stages/crawl_ipad-landscape_town.json $S/runs/live20/out/stages/tour_*.json $S/runs/live20/out/stages-first/
echo "town crawl and tours rerun starts $(date -u +%T)"
$S/qcheck4.sh live20 $S/published/raw-github-main.html "" "" "" --full > $S/live20-crawl2.log 2>&1
echo "town crawl and tours rerun ended $(date -u +%T): $(grep -E '^RESULT' $S/live20-crawl2.log)"
