#!/bin/bash
# Pass 21 (the glitch loop rules of 21 Oct, CLAUDE.md): after the kit's night3 + run4 lines on the f17 file (nothing heavy beside a check), the
# pictures of what changed only: f17's probe views (the photo in the phone's chat after a snap; a grandma's bubble by the pond) where the marks
# were seen and on one other screen shape (sideways iPhone and iPad, light; iPad dark); then their list and the five briefs.
S=/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad
cd $S; F=/home/user/cozy-town/index.html
while pgrep -f "qcheck4.sh p21kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum $F | cut -c1-32)"
python3 probe_views.py $S/runs/r21 $F 2026-10-19 iphone-landscape,ipad-landscape r21 $S/views_f17.py > $S/p21a.log 2>&1; echo "views light: $(grep -c 'png' $S/p21a.log) pictures, $(grep errors $S/p21a.log | tr '\n' ' ')"
PV_THEME=dark python3 probe_views.py $S/runs/r21d $F 2026-10-19 ipad-landscape r21d $S/views_f17.py > $S/p21b.log 2>&1; echo "views dark: $(grep -c 'png' $S/p21b.log) pictures"
python3 $S/pv2json.py $S/runs/r21.json $S/notes_f17.py $S/runs/r21 $S/runs/r21d
python3 $S/viewfocus.py $S/stage3-view21 21 5 $S/runs/r21.json
echo "PASS21 PICTURES DONE $(date -u +%T)"
