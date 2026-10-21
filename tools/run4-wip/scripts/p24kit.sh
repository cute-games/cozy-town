#!/bin/bash
S=/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad
export BACKUP=$S/backups/github-live-2026-10-18.html
export BTITLE="PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-20 (byte for byte tools/prerun4-index.html)"
cp /home/user/cozy-town/index.html $S/runs/p24kit-file.html
echo "p24kit starts $(date -u +%T) md5 $(md5sum $S/runs/p24kit-file.html | cut -c1-32)"
$S/qcheck4.sh p24kit $S/runs/p24kit-file.html "night3,run4" "" "" > $S/p24kit.log 2>&1
echo "p24kit ended $(date -u +%T): $(grep -c '^    PASS | N[0-9]* [A-Z]' $S/p24kit.log) PASS lines, $(grep -c '^    FAIL | N[0-9]* [A-Z]' $S/p24kit.log) FAIL lines"
