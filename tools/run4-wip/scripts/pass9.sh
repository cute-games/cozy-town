#!/bin/bash
# Pass 9 pictures: after the live check's Saturday rerun (nothing heavy beside a check) and the book's new pictures (flag file), the
# photographer's three scripts on the current file, one after another; then the kit's pictures of the p9kit run, the change-spotter
# against pass 8, and the viewer batches.
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
cd $S
while [ ! -f $S/book-done.flag ]; do sleep 10; done
while pgrep -f "after-live4.sh" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p9 > $S/p9a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p9a.log)"
python3 -u $S/shots4b.py $S/stage3-p9b > $S/p9b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p9b.log)"
python3 -u $S/shots4c.py $S/stage3-p9c > $S/p9c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p9c.log)"
python3 $S/kitset.py $S/stage3-kit9 kit9 $S/runs/p9kit
python3 -c "import json;m=json.load(open('$S/stage3-kit8/map.json'));[e.update(name=e['name'].replace('kit8-','kit9-',1)) for e in m];json.dump(m,open('$S/stage3-kit8/map-as-kit9.json','w'),indent=1)"   # (the kit's picture names carry the set's prefix)
for d in p9 p9b p9c kit9; do python3 $S/passdiff8.py $S/stage3-$d/map.json $S/stage3-p8/map.json $S/stage3-p8b/map.json $S/stage3-p8c/map.json $S/stage3-kit8/map-as-kit9.json | head -1; done
echo "PASS9 PICTURES DONE $(date -u +%T)"
