#!/bin/bash
# Pass 17 pictures: after the kit's night3 + run4 lines on the f13 file (nothing heavy beside a check), the photographer's three scripts on
# the current file, one after another; then the kit's pictures of the p17kit run, the change-spotter against pass 16, and the viewer batches.
# (the wait looks for the check itself: a "p17kit.sh" pattern also matched the shell that started both)
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while pgrep -f "qcheck4.sh p17kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p17 > $S/p17a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p17a.log)"
python3 -u $S/shots4b.py $S/stage3-p17b > $S/p17b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p17b.log)"
python3 -u $S/shots4c.py $S/stage3-p17c > $S/p17c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p17c.log)"
python3 $S/kitset.py $S/stage3-kit17 kit17 $S/runs/p17kit
python3 -c "import json;m=json.load(open('$S/stage3-kit16/map.json'));[e.update(name=e['name'].replace('kit16-','kit17-',1)) for e in m];json.dump(m,open('$S/stage3-kit16/map-as-kit17.json','w'),indent=1)"   # (the kit's picture names carry the set's prefix)
for d in p17 p17b p17c kit17; do python3 $S/passdiff8.py $S/stage3-$d/map.json $S/stage3-p16/map.json $S/stage3-p16b/map.json $S/stage3-p16c/map.json $S/stage3-kit16/map-as-kit17.json 2>/dev/null | head -1; done
echo "PASS17 PICTURES DONE $(date -u +%T)"
