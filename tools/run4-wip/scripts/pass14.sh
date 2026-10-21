#!/bin/bash
# Pass 14 pictures: after the kit's night3 + run4 lines on the f10 file (nothing heavy beside a check), the photographer's three scripts on
# the current file, one after another; then the kit's pictures of the p14kit run, the change-spotter against pass 13, and the viewer batches.
# (the wait looks for the check itself: a "p14kit.sh" pattern also matched the shell that started both)
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while pgrep -f "qcheck4.sh p14kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p14 > $S/p14a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p14a.log)"
python3 -u $S/shots4b.py $S/stage3-p14b > $S/p14b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p14b.log)"
python3 -u $S/shots4c.py $S/stage3-p14c > $S/p14c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p14c.log)"
python3 $S/kitset.py $S/stage3-kit14 kit14 $S/runs/p14kit
python3 -c "import json;m=json.load(open('$S/stage3-kit13/map.json'));[e.update(name=e['name'].replace('kit13-','kit14-',1)) for e in m];json.dump(m,open('$S/stage3-kit13/map-as-kit14.json','w'),indent=1)"   # (the kit's picture names carry the set's prefix)
for d in p14 p14b p14c kit14; do python3 $S/passdiff8.py $S/stage3-$d/map.json $S/stage3-p13/map.json $S/stage3-p13b/map.json $S/stage3-p13c/map.json $S/stage3-kit13/map-as-kit14.json 2>/dev/null | head -1; done
echo "PASS14 PICTURES DONE $(date -u +%T)"
