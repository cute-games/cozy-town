#!/bin/bash
# Pass 15 pictures: after the kit's night3 + run4 lines on the f11 file (nothing heavy beside a check), the photographer's three scripts on
# the current file, one after another; then the kit's pictures of the p15kit run, the change-spotter against pass 14, and the viewer batches.
# (the wait looks for the check itself: a "p15kit.sh" pattern also matched the shell that started both)
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while pgrep -f "qcheck4.sh p15kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p15 > $S/p15a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p15a.log)"
python3 -u $S/shots4b.py $S/stage3-p15b > $S/p15b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p15b.log)"
python3 -u $S/shots4c.py $S/stage3-p15c > $S/p15c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p15c.log)"
python3 $S/kitset.py $S/stage3-kit15 kit15 $S/runs/p15kit
python3 -c "import json;m=json.load(open('$S/stage3-kit14/map.json'));[e.update(name=e['name'].replace('kit14-','kit15-',1)) for e in m];json.dump(m,open('$S/stage3-kit14/map-as-kit15.json','w'),indent=1)"   # (the kit's picture names carry the set's prefix)
for d in p15 p15b p15c kit15; do python3 $S/passdiff8.py $S/stage3-$d/map.json $S/stage3-p14/map.json $S/stage3-p14b/map.json $S/stage3-p14c/map.json $S/stage3-kit14/map-as-kit15.json 2>/dev/null | head -1; done
echo "PASS15 PICTURES DONE $(date -u +%T)"
