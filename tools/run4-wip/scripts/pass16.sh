#!/bin/bash
# Pass 16 pictures: after the kit's night3 + run4 lines on the f12 file (nothing heavy beside a check), the photographer's three scripts on
# the current file, one after another; then the kit's pictures of the p16kit run, the change-spotter against pass 15, and the viewer batches.
# (the wait looks for the check itself: a "p16kit.sh" pattern also matched the shell that started both)
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while pgrep -f "qcheck4.sh p16kit" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p16 > $S/p16a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p16a.log)"
python3 -u $S/shots4b.py $S/stage3-p16b > $S/p16b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p16b.log)"
python3 -u $S/shots4c.py $S/stage3-p16c > $S/p16c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p16c.log)"
python3 $S/kitset.py $S/stage3-kit16 kit16 $S/runs/p16kit
python3 -c "import json;m=json.load(open('$S/stage3-kit15/map.json'));[e.update(name=e['name'].replace('kit15-','kit16-',1)) for e in m];json.dump(m,open('$S/stage3-kit15/map-as-kit16.json','w'),indent=1)"   # (the kit's picture names carry the set's prefix)
for d in p16 p16b p16c kit16; do python3 $S/passdiff8.py $S/stage3-$d/map.json $S/stage3-p15/map.json $S/stage3-p15b/map.json $S/stage3-p15c/map.json $S/stage3-kit15/map-as-kit16.json 2>/dev/null | head -1; done
echo "PASS16 PICTURES DONE $(date -u +%T)"
