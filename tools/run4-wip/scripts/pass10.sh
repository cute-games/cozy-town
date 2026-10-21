#!/bin/bash
# Pass 10 pictures: after the kit's night3 + run4 lines on the f6 file (nothing heavy beside a check), the photographer's three scripts on
# the current file, one after another; then the kit's pictures of the p10kit run, the change-spotter against pass 9, and the viewer batches.
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while pgrep -f "p10kit.sh" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p10 > $S/p10a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p10a.log)"
python3 -u $S/shots4b.py $S/stage3-p10b > $S/p10b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p10b.log)"
python3 -u $S/shots4c.py $S/stage3-p10c > $S/p10c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p10c.log)"
python3 $S/kitset.py $S/stage3-kit10 kit10 $S/runs/p10kit
python3 -c "import json;m=json.load(open('$S/stage3-kit9/map.json'));[e.update(name=e['name'].replace('kit9-','kit10-',1)) for e in m];json.dump(m,open('$S/stage3-kit9/map-as-kit10.json','w'),indent=1)"   # (the kit's picture names carry the set's prefix)
for d in p10 p10b p10c kit10; do python3 $S/passdiff8.py $S/stage3-$d/map.json $S/stage3-p9/map.json $S/stage3-p9b/map.json $S/stage3-p9c/map.json $S/stage3-kit9/map-as-kit10.json | head -1; done
echo "PASS10 PICTURES DONE $(date -u +%T)"
