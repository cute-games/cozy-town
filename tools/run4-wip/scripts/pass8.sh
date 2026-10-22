#!/bin/bash
# Pass 8 pictures: wait for the live check to end (nothing heavy beside a check), then the kit's own pictures (a night3 + run4 run
# on the current file, which is also that file's check of those lines), then the photographer's three scripts, one after another.
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while pgrep -f "cozy_check2.py.*--tag live20" > /dev/null; do sleep 10; done
echo "live check ended $(date -u +%T)"
md5sum /home/user/cozy-town/index.html
BACKUP=$S/backups/github-live-2026-10-18.html BTITLE="PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-20 (byte for byte tools/prerun4-index.html)" \
  $S/qcheck4.sh p8kit /home/user/cozy-town/index.html "night3,run4" "" "" > $S/p8kit.log 2>&1
echo "kit run ended $(date -u +%T): $(grep -c 'PASS |' $S/p8kit.log) PASS lines, $(grep -c 'FAIL |' $S/p8kit.log) FAIL lines"
python3 $S/kitset.py $S/stage3-kit8 kit8 $S/runs/p8kit
python3 -u $S/shots8.py $S/stage3-p8 > $S/p8a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p8a.log)"
python3 -u $S/shots4b.py $S/stage3-p8b > $S/p8b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p8b.log)"
python3 -u $S/shots4c.py $S/stage3-p8c > $S/p8c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p8c.log)"
echo "PASS8 PICTURES DONE $(date -u +%T)"
