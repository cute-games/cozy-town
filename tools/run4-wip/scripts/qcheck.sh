#!/bin/bash
# Run the Cozy Town check on the working copy. usage: qcheck.sh TAG "stages" "N3_ONLY" "N4_ONLY" [--full]
# The live versions = the repo's main branch file (tools/prerun4-index.html, the exact live file); the new version = /home/user/cozy-town/index.html.
set -e
SC=/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad
KIT=$SC/kit6/cozycheck
TAG=$1; ONLY=$2; N3=$3; N4=$4; FULL=$5
RUN=$SC/runs/$TAG; mkdir -p $RUN/live $RUN/new
cp /home/user/cozy-town/tools/prerun4-index.html $RUN/live/github-live.html
cp /home/user/cozy-town/index.html $RUN/new/github-new.html
python3 $KIT/strip_online.py $RUN/live/github-live.html $RUN/live/claude-form-of-github-live.html
python3 $KIT/strip_online.py $RUN/new/github-new.html $RUN/new/claude-new.html
touch $RUN/live/github-live.html $RUN/live/claude-form-of-github-live.html
cd $RUN
ARGS=(--live-claude live/claude-form-of-github-live.html --new-claude new/claude-new.html --live-web live/github-live.html
      --backup /home/user/cozy-town/tools/prerun4-index.html --backup-title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked $(date +%F)"
      --out $RUN/out --tag $TAG --e1-limits "city:0.15:0.25,pets:1.0:1.0")
if [ -n "$ONLY" ]; then ARGS+=(--only "$ONLY"); fi
if [ -n "$FULL" ]; then ARGS+=(--full); fi
N3_ONLY="$N3" N4_ONLY="$N4" python3 -u $KIT/cozy_check2.py "${ARGS[@]}"
