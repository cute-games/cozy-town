#!/bin/bash
# The full final pass (pass 23; glitch loop rules of 21 Oct, CLAUDE.md), on the file after the last loop pass: the kit's night3 + run4
# pictures of that file's run (KITRUN, the last loop pass's kit), the photographer's three scripts one after another, every picture listed
# (no change-spotter: the earlier passes' pictures are not in this container), and the briefs by focus in batches of at most 40.
S=/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad
KITRUN=${1:-$S/runs/p22kit}
cd $S
while pgrep -f "qcheck4.sh" > /dev/null || pgrep -f "cozy_check2.py" > /dev/null; do sleep 10; done
echo "checks ended $(date -u +%T); file $(md5sum /home/user/cozy-town/index.html | cut -c1-32)"
python3 -u $S/shots8.py $S/stage3-p23 > $S/p23a.log 2>&1; echo "shots8 ended $(date -u +%T): $(tail -1 $S/p23a.log)"
python3 -u $S/shots4b.py $S/stage3-p23b > $S/p23b.log 2>&1; echo "shots4b ended $(date -u +%T): $(tail -1 $S/p23b.log)"
python3 -u $S/shots4c.py $S/stage3-p23c > $S/p23c.log 2>&1; echo "shots4c ended $(date -u +%T): $(tail -1 $S/p23c.log)"
python3 $S/kitset.py $S/stage3-kit23 kit23 $KITRUN
python3 $S/viewbatch.py $S/stage3-list23 40 $S/stage3-p23/map.json $S/stage3-p23b/map.json $S/stage3-p23c/map.json $S/stage3-kit23/map.json
python3 $S/viewfocus.py $S/stage3-view23 23 5 $S/stage3-list23/pictures.json --full
echo "PASS23 PICTURES DONE $(date -u +%T)"
