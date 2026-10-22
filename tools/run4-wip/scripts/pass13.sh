#!/bin/bash
# Pass 13 pictures: after the kit's night3 + run4 lines on the f9 file (nothing heavy beside a check), the photographer's three scripts on
# the current file, one after another; then the kit's pictures of the p13kit run, the change-spotter against pass 12, and the viewer batches.
# (the wait looks for the check itself: a "p13kit.sh" pattern also matched the shell that started both)
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while pgrep -f "qcheck4.sh p13kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p13 > $S/p13a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p13a.log)"
python3 -u $S/shots4b.py $S/stage3-p13b > $S/p13b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p13b.log)"
python3 -u $S/shots4c.py $S/stage3-p13c > $S/p13c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p13c.log)"
python3 $S/kitset.py $S/stage3-kit13 kit13 $S/runs/p13kit
python3 -c "import json;m=json.load(open('$S/stage3-kit12/map.json'));[e.update(name=e['name'].replace('kit12-','kit13-',1)) for e in m];json.dump(m,open('$S/stage3-kit12/map-as-kit13.json','w'),indent=1)"   # (the kit's picture names carry the set's prefix)
for d in p13 p13b p13c kit13; do python3 $S/passdiff8.py $S/stage3-$d/map.json $S/stage3-p12/map.json $S/stage3-p12b/map.json $S/stage3-p12c/map.json $S/stage3-kit12/map-as-kit13.json 2>/dev/null | head -1; done
echo "PASS13 PICTURES DONE $(date -u +%T)"
