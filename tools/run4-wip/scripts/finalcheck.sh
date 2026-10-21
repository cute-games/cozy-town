#!/bin/bash
# The final check, unchanged (run 4 finish, the final stage): the whole kit on the final file, nothing heavy beside it.
S=/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad
export BACKUP=$S/backups/github-live-2026-10-18.html
export BTITLE="PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-20 (byte for byte tools/prerun4-index.html)"
cp /home/user/cozy-town/index.html $S/runs/final-file.html
echo "FINAL starts $(date -u +%T) md5 $(md5sum $S/runs/final-file.html | cut -c1-32)"
$S/qcheck4.sh FINAL $S/runs/final-file.html "" "" "" --full > $S/final.log 2>&1
echo "FINAL ended $(date -u +%T): $(grep -c '^    PASS |' $S/final.log) PASS, $(grep -c '^    FAIL |' $S/final.log) FAIL"
