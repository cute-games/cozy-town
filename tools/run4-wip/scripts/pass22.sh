#!/bin/bash
# Pass 22 (the glitch loop rules of 21 Oct, CLAUDE.md): after the kit's night3 + run4 lines on the f18 file (nothing heavy beside a check), the
# pictures of what changed only: f18's probe views (the phone's chat right after a snap) where the marks
# were seen and on one other screen shape (sideways iPhone and iPad, light; iPad dark); then their list and the five briefs.
S=/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad
cd $S; F=/home/user/cozy-town/index.html
while pgrep -f "qcheck4.sh p22kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum $F | cut -c1-32)"
python3 probe_views.py $S/runs/r22 $F 2026-10-19 iphone-landscape,ipad-landscape r22 $S/views_f18.py > $S/p22a.log 2>&1; echo "views light: $(grep -c 'png' $S/p22a.log) pictures, $(grep errors $S/p22a.log | tr '\n' ' ')"
PV_THEME=dark python3 probe_views.py $S/runs/r22d $F 2026-10-19 ipad-landscape r22d $S/views_f18.py > $S/p22b.log 2>&1; echo "views dark: $(grep -c 'png' $S/p22b.log) pictures"
python3 $S/pv2json.py $S/runs/r22.json $S/notes_f18.py $S/runs/r22 $S/runs/r22d
python3 $S/viewfocus.py $S/stage3-view22 22 5 $S/runs/r22.json
echo "PASS22 PICTURES DONE $(date -u +%T)"
