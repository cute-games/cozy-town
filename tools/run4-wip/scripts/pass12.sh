#!/bin/bash
# Pass 12 pictures: after the kit's night3 + run4 lines on the f8 file (nothing heavy beside a check), the photographer's three scripts on
# the current file, one after another; then the kit's pictures of the p12kit run, the change-spotter against pass 11, and the viewer batches.
# (the wait looks for the check itself: a "p12kit.sh" pattern also matched the shell that started both, and pass 11's pictures waited for good)
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while pgrep -f "qcheck4.sh p12kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p12 > $S/p12a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p12a.log)"
python3 -u $S/shots4b.py $S/stage3-p12b > $S/p12b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p12b.log)"
python3 -u $S/shots4c.py $S/stage3-p12c > $S/p12c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p12c.log)"
python3 $S/kitset.py $S/stage3-kit12 kit12 $S/runs/p12kit
python3 -c "import json;m=json.load(open('$S/stage3-kit11/map.json'));[e.update(name=e['name'].replace('kit11-','kit12-',1)) for e in m];json.dump(m,open('$S/stage3-kit11/map-as-kit12.json','w'),indent=1)"   # (the kit's picture names carry the set's prefix)
for d in p12 p12b p12c kit12; do python3 $S/passdiff8.py $S/stage3-$d/map.json $S/stage3-p11/map.json $S/stage3-p11b/map.json $S/stage3-p11c/map.json $S/stage3-kit11/map-as-kit12.json 2>/dev/null | head -1; done
echo "PASS12 PICTURES DONE $(date -u +%T)"
