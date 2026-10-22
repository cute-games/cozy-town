#!/bin/bash
# After the live check: one heavy job at a time.
# 1. the kit's own pictures for pass 8 (night3 + run4 on the current file, also that file's check of those lines)
# 2. the live check's town crawl again with the kit's bus ride (C2, C2b), in the same run folder: every other stage is already done
# 3. at the next game Friday (wait_friday.py: 21:00-21:15 UTC, then every 105 min) the live check's run-4 stage again, so N15 starts on a Friday and meets the Pet Show 🏆 on Saturday morning
# 4. the photographer's three scripts
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
export BACKUP=$S/backups/github-live-2026-10-18.html
export BTITLE="PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-20 (byte for byte tools/prerun4-index.html)"
while pgrep -f "cozy_check2.py.*--tag live20" > /dev/null; do sleep 10; done
echo "live check ended $(date -u +%T)"
md5sum /home/user/cozy-town/index.html
$S/qcheck4.sh p8kit /home/user/cozy-town/index.html "night3,run4" "" "" > $S/p8kit.log 2>&1
echo "kit run ended $(date -u +%T): $(grep -c '^    PASS | N[0-9]* [A-Z]' $S/p8kit.log) PASS lines, $(grep -c '^    FAIL | N[0-9]* [A-Z]' $S/p8kit.log) FAIL lines"
python3 $S/kitset.py $S/stage3-kit8 kit8 $S/runs/p8kit
mv $S/runs/live20/out/stages/crawl_ipad-landscape_town.json $S/runs/live20/out/stages/crawl_ipad-landscape_town.first.json
PUBLISHED=$S/published/claude-readback-2026-10-20-frame-off.html GITHUB=$S/published/raw-github-main.html \
  $S/qcheck4.sh live20 $S/published/raw-github-main.html "" "" "" --full > $S/live20-crawl2.log 2>&1
echo "town crawl rerun ended $(date -u +%T): $(grep -E '^(PASS|FAIL) \| C2' $S/live20-crawl2.log | cut -c1-200)"
python3 $S/wait_friday.py
mv $S/runs/live20/out/stages/run4.json $S/runs/live20/out/stages/run4.first.json
echo "run-4 rerun starts $(date -u +%T)"
PUBLISHED=$S/published/claude-readback-2026-10-20-frame-off.html GITHUB=$S/published/raw-github-main.html \
  $S/qcheck4.sh live20 $S/published/raw-github-main.html "" "" "" --full > $S/live20-run4b.log 2>&1
echo "run-4 rerun ended $(date -u +%T): $(grep -E '^RESULT' $S/live20-run4b.log)"
md5sum /home/user/cozy-town/index.html
python3 -u $S/shots8.py $S/stage3-p8 > $S/p8a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p8a.log)"
python3 -u $S/shots4b.py $S/stage3-p8b > $S/p8b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p8b.log)"
python3 -u $S/shots4c.py $S/stage3-p8c > $S/p8c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p8c.log)"
echo "PASS8 PICTURES DONE $(date -u +%T)"
