#!/bin/bash
# Pass 20, the first under the glitch loop rules of 21 Oct (CLAUDE.md): after the kit's night3 + run4 lines on the f16 file (nothing heavy
# beside a check), the pictures of what changed only: f16's probe views where each mark was seen and on one other screen shape (iPad and
# sideways iPhone, light; iPad dark), the school on 1 September (iPad, PC), a real two-phone dance-off; then their list and the five briefs.
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S; F=/home/user/cozy-town/index.html
while pgrep -f "qcheck4.sh p20kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum $F | cut -c1-32)"
python3 probe_views.py $S/runs/r20 $F 2026-10-19 ipad-landscape,iphone-landscape r20 $S/views_f16.py > $S/p20a.log 2>&1; echo "views light: $(grep -c 'png' $S/p20a.log) pictures, $(grep errors $S/p20a.log | tr '\n' ' ')"
PV_THEME=dark python3 probe_views.py $S/runs/r20d $F 2026-10-19 ipad-landscape r20d $S/views_f16.py > $S/p20b.log 2>&1; echo "views dark: $(grep -c 'png' $S/p20b.log) pictures"
python3 probe_views.py $S/runs/r20s $F 2026-09-01 ipad-landscape,pc-1366 r20s $S/views_f16b.py > $S/p20c.log 2>&1; echo "school: $(grep -c 'png' $S/p20c.log) pictures"
python3 -u $S/shots4c_f.py $S/runs/r20dance $F > $S/p20d.log 2>&1; echo "dance: $(tail -1 $S/p20d.log)"
python3 $S/pv2json.py $S/runs/r20.json $S/notes_f16.py $S/runs/r20 $S/runs/r20d $S/runs/r20s $S/runs/r20dance
python3 $S/viewfocus.py $S/stage3-view20 20 5 $S/runs/r20.json
echo "PASS20 PICTURES DONE $(date -u +%T)"
