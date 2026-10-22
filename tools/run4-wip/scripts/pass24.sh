#!/bin/bash
# Pass 24: the re-check of the full final pass's fixes (f19), like a pass (glitch loop rules of 21 Oct, CLAUDE.md): the kit's night3 + run4
# lines on the f19 file first (nothing heavy beside a check; N8's own pictures show the designer's room 2), then f19's probe views where the
# marks were seen (upright iPhone, dark) and on one other screen shape (iPad, dark; and both in light), the kit's two designer pictures,
# their list and the five briefs.
S=/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad
cd $S; F=/home/user/cozy-town/index.html
while pgrep -f "qcheck4.sh p24kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum $F | cut -c1-32)"
PV_THEME=dark python3 probe_views.py $S/runs/r24d $F 2026-10-19 iphone-portrait,ipad-landscape r24d $S/views_f19.py > $S/p24a.log 2>&1; echo "views dark: $(grep -c 'png' $S/p24a.log) pictures, $(grep errors $S/p24a.log | tr '\n' ' ')"
python3 probe_views.py $S/runs/r24 $F 2026-10-19 iphone-portrait,ipad-landscape r24 $S/views_f19.py > $S/p24b.log 2>&1; echo "views light: $(grep -c 'png' $S/p24b.log) pictures"
mkdir -p $S/runs/r24k/shots; for n in designer-room-1 designer-room-2; do cp $S/runs/p24kit/out/shots/*_n8-designer_*_$n.png $S/runs/r24k/shots/ 2>/dev/null; done; ls $S/runs/r24k/shots | wc -l
python3 $S/pv2json.py $S/runs/r24.json $S/notes_f19.py $S/runs/r24d $S/runs/r24
python3 - <<PY
import json,glob,os
L=json.load(open('$S/runs/r24.json'))
for f in sorted(glob.glob('$S/runs/r24k/shots/*.png')):
    L.append(dict(path=f,prof='ipad-landscape',theme='light',note="the kit's N8: a two-room designer order, "+("room 1" if 'room-1' in f else "room 2: only room 2's own pieces (room 1's furniture is not drawn here)")))
json.dump(L,open('$S/runs/r24.json','w'),indent=1); print(len(L),'pictures')
PY
python3 $S/viewfocus.py $S/stage3-view24 24 5 $S/runs/r24.json
echo "PASS24 PICTURES DONE $(date -u +%T)"
