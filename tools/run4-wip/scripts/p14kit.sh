#!/bin/bash
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
export BACKUP=$S/backups/github-live-2026-10-18.html
export BTITLE="PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-20 (byte for byte tools/prerun4-index.html)"
cp /home/user/cozy-town/index.html $S/runs/p14kit-file.html
echo "p14kit starts $(date -u +%T) md5 $(md5sum $S/runs/p14kit-file.html | cut -c1-32)"
$S/qcheck4.sh p14kit $S/runs/p14kit-file.html "night3,run4" "" "" > $S/p14kit.log 2>&1
echo "p14kit ended $(date -u +%T): $(grep -c '^    PASS | N[0-9]* [A-Z]' $S/p14kit.log) PASS lines, $(grep -c '^    FAIL | N[0-9]* [A-Z]' $S/p14kit.log) FAIL lines"
