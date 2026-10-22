#!/bin/bash
# Pass 11 pictures: after the kit's night3 + run4 lines on the f7 file (nothing heavy beside a check), the photographer's three scripts on
# the current file, one after another; then the kit's pictures of the p11kit run, the change-spotter against pass 10, and the viewer batches.
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while pgrep -f "p11kit.sh" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p11 > $S/p11a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p11a.log)"
python3 -u $S/shots4b.py $S/stage3-p11b > $S/p11b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p11b.log)"
python3 -u $S/shots4c.py $S/stage3-p11c > $S/p11c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p11c.log)"
python3 $S/kitset.py $S/stage3-kit11 kit11 $S/runs/p11kit
python3 -c "import json;m=json.load(open('$S/stage3-kit10/map.json'));[e.update(name=e['name'].replace('kit10-','kit11-',1)) for e in m];json.dump(m,open('$S/stage3-kit10/map-as-kit11.json','w'),indent=1)"   # (the kit's picture names carry the set's prefix)
for d in p11 p11b p11c kit11; do python3 $S/passdiff8.py $S/stage3-$d/map.json $S/stage3-p10/map.json $S/stage3-p10b/map.json $S/stage3-p10c/map.json $S/stage3-kit10/map-as-kit11.json | head -1; done
echo "PASS11 PICTURES DONE $(date -u +%T)"
