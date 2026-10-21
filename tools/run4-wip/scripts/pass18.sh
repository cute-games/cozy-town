#!/bin/bash
# Pass 18 pictures: after the kit's night3 + run4 lines on the f14 file (nothing heavy beside a check), the photographer's three scripts on
# the current file, one after another; then the kit's pictures of the p18kit run, the change-spotter against pass 17, and the viewer batches.
# (the wait looks for the check itself: a "p18kit.sh" pattern also matched the shell that started both)
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while pgrep -f "qcheck4.sh p18kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p18 > $S/p18a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p18a.log)"
python3 -u $S/shots4b.py $S/stage3-p18b > $S/p18b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p18b.log)"
python3 -u $S/shots4c.py $S/stage3-p18c > $S/p18c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p18c.log)"
python3 $S/kitset.py $S/stage3-kit18 kit18 $S/runs/p18kit
python3 -c "import json;m=json.load(open('$S/stage3-kit17/map.json'));[e.update(name=e['name'].replace('kit17-','kit18-',1)) for e in m];json.dump(m,open('$S/stage3-kit17/map-as-kit18.json','w'),indent=1)"   # (the kit's picture names carry the set's prefix)
for d in p18 p18b p18c kit18; do python3 $S/passdiff8.py $S/stage3-$d/map.json $S/stage3-p17/map.json $S/stage3-p17b/map.json $S/stage3-p17c/map.json $S/stage3-kit17/map-as-kit18.json 2>/dev/null | head -1; done
echo "PASS18 PICTURES DONE $(date -u +%T)"
