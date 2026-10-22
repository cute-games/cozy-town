#!/bin/bash
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
export BACKUP=$S/backups/github-live-2026-10-19.html
export BTITLE="PRE-RUN 4 LIVE — Cozy Town backup 2026-10-19 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-20 (byte for byte tools/prerun4-index.html)"
cp /home/user/cozy-town/index.html $S/runs/p19kit-file.html
echo "p19kit starts $(date -u +%T) md5 $(md5sum $S/runs/p19kit-file.html | cut -c1-32)"
$S/qcheck4.sh p19kit $S/runs/p19kit-file.html "night3,run4" "" "" > $S/p19kit.log 2>&1
echo "p19kit ended $(date -u +%T): $(grep -c '^    PASS | N[0-9]* [A-Z]' $S/p19kit.log) PASS lines, $(grep -c '^    FAIL | N[0-9]* [A-Z]' $S/p19kit.log) FAIL lines"
