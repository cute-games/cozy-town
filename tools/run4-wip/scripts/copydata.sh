#!/bin/bash
# Run 4 finish: copy a pass's text records (no pictures) into tools/run4-wip/data. usage: copydata.sh N (pass number) [CRITIC_ROUND]
S=/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad
D=/home/user/cozy-town/tools/run4-wip/data; N=$1
for s in p$N p${N}b p${N}c; do if [ -d $S/stage3-$s ]; then mkdir -p $D/stage3-$s; for f in map.json change-spotter.json testlog_s3.txt; do [ -f $S/stage3-$s/$f ] && cp $S/stage3-$s/$f $D/stage3-$s/; done; fi; done
for L in $S/p${N}a.log:stage3-p$N $S/p${N}b.log:stage3-p${N}b $S/p${N}c.log:stage3-p${N}c; do src=${L%%:*}; dst=${L##*:}; [ -f $src ] && cp $src $D/$dst/photographer.log; done
if [ -d $S/stage3-kit$N ]; then mkdir -p $D/stage3-kit$N; for f in map.json change-spotter.json; do [ -f $S/stage3-kit$N/$f ] && cp $S/stage3-kit$N/$f $D/stage3-kit$N/; done; fi
if [ -d $S/stage3-view$N ]; then mkdir -p $D/stage3-view$N; cp $S/stage3-view$N/*.md $S/stage3-view$N/pictures.json $D/stage3-view$N/; fi
if [ -d $S/stage3-marks$N ]; then mkdir -p $D/stage3-marks$N; cp $S/stage3-marks$N/*.txt $D/stage3-marks$N/; fi
if [ -d $S/stage3-dc$N ]; then mkdir -p $D/stage3-dc$N/out; cp $S/stage3-dc$N/dc-*.md $S/stage3-dc$N/marks.json $S/stage3-dc$N/merged.json $D/stage3-dc$N/ 2>/dev/null; cp $S/stage3-dc$N/out/*.txt $D/stage3-dc$N/out/ 2>/dev/null; fi
if [ -n "$2" ] && [ -d $S/stage3-critic$2 ]; then mkdir -p $D/stage3-critic$2; cp $S/stage3-critic$2/*.md $S/stage3-critic$2/*.txt $D/stage3-critic$2/; fi
du -sh $D/stage3-*$N* $D/stage3-critic$2 2>/dev/null
