#!/bin/bash
# Run the Cozy Town check (kit v6). usage: qcheck4.sh TAG NEWFILE "stages" "N3_ONLY" "N4_ONLY" [--full]
# The live (before) version = the run's starting file (tools/prerun4-index.html, night 3, 709bf763), as in every run-4 stage's full check;
# the new version = NEWFILE (a GitHub file). Env: BACKUP, BTITLE (the dated backup and its title); PUBLISHED, GITHUB (F2, F3) if set.
set -e
: "${BACKUP:?}" "${BTITLE:?}"
SC=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
KIT=$SC/kit6/cozycheck
TAG=$1; NEW=$2; ONLY=$3; N3=$4; N4=$5; FULL=$6
RUN=$SC/runs/$TAG; mkdir -p $RUN/live $RUN/new
cp /home/user/cozy-town/tools/prerun4-index.html $RUN/live/github-live.html
cp "$NEW" $RUN/new/github-new.html
python3 $KIT/strip_online.py $RUN/live/github-live.html $RUN/live/claude-form-of-github-live.html
python3 $KIT/strip_online.py $RUN/new/github-new.html $RUN/new/claude-new.html
touch $RUN/live/github-live.html $RUN/live/claude-form-of-github-live.html
cd $RUN
ARGS=(--live-claude live/claude-form-of-github-live.html --new-claude new/claude-new.html --live-web live/github-live.html
      --backup "$BACKUP" --backup-title "$BTITLE"
      --out $RUN/out --tag $TAG --e1-limits "city:0.15:0.25,pets:1.0:1.0" --agreed-removals "tutorial_steps:#5,tutorial_steps:#6,tutorial_steps:#7,tutorial_steps:#8")
if [ -n "$PUBLISHED" ]; then ARGS+=(--published "$PUBLISHED"); fi
if [ -n "$GITHUB" ]; then ARGS+=(--github "$GITHUB"); fi
if [ -n "$ONLY" ]; then ARGS+=(--only "$ONLY"); fi
if [ -n "$FULL" ]; then ARGS+=(--full); fi
N3_ONLY="$N3" N4_ONLY="$N4" python3 -u $KIT/cozy_check2.py "${ARGS[@]}"
