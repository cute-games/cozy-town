"""Stage 3, CHANGE-SPOTTER for a later pass: compare every picture of the new pass with the picture of the same spot (same name,
device and theme) from the earlier pass, taken from the same camera spot. Unchanged pictures (under 3% of the cells differ, so a passer-by or a cloud does not count; a spot with a kept mark in pass 1 always goes on) are
SAME and are not viewed again; CHANGED and NEW ones go on to the PHOTOVIEWER (viewbatch.py reads change-spotter.json).
usage: python3 passdiff.py NEWMAP OLDMAP [OLDMAP...]   (writes change-spotter.json next to NEWMAP and prints a summary)"""
import json, os, sys
from PIL import Image, ImageChops
import numpy as np
new_mp = sys.argv[1]; olds = sys.argv[2:]
import re as _re
FORCED = set()
for _f in ('stage3-dc/merged.json', 'stage3-dc2/merged.json', 'stage3-dc3/merged.json', 'stage3-dc3b/merged.json', 'stage3-dc4/merged.json', 'stage3-dc5/merged.json', 'stage3-dc6/merged.json', 'stage3-dc7/merged.json', 'stage3-dc8/merged.json', 'stage3-dc9/merged.json', 'stage3-dc10/merged.json', 'stage3-dc11/merged.json', 'stage3-dc12/merged.json'):
    try: FORCED |= {m['spot'] for m in json.load(open('/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/' + _f)) if m['verdict'] == 'KEEP'}
    except Exception: pass
old = {}
for mp in olds:
    d = os.path.dirname(mp)
    for e in json.load(open(mp)):
        if e.get('file') and os.path.exists(os.path.join(d, 'shots', e['file'])): old.setdefault((e['name'], e['prof'], e['theme']), os.path.join(d, 'shots', e['file']))   # (run 4 finish: the pictures of passes 1 to 7 were not kept, only their maps; a spot whose earlier picture is gone counts as NEW)
nd = os.path.dirname(new_mp); out = []; n = {}
for e in json.load(open(new_mp)):
    k = (e['name'], e['prof'], e['theme']); rec = dict(name=e['name'], prof=e['prof'], theme=e['theme'], file=e.get('file'))
    if not e.get('file'): rec.update(verdict='NO PICTURE', why=e.get('error', '')[:120])
    elif k not in old: rec.update(verdict='NEW', why='no earlier picture of this spot kept')
    else:
        a = Image.open(os.path.join(nd, 'shots', e['file'])).convert('L'); b = Image.open(old[k]).convert('L')
        if a.size != b.size: rec.update(verdict='CHANGED', why=f'size {a.size} vs {b.size}')
        else:
            a = np.asarray(a.resize((128, 96)), dtype=np.float32); b = np.asarray(b.resize((128, 96)), dtype=np.float32)
            share = float((np.abs(a - b) > 24).mean()); rec.update(ref=old[k], changed_share=round(share, 4), verdict='CHANGED' if share > .03 or e['name'] in FORCED else 'SAME')
    out.append(rec); n[rec['verdict']] = n.get(rec['verdict'], 0) + 1
json.dump(out, open(os.path.join(nd, 'change-spotter.json'), 'w'), indent=1)
print(f"{len(out)} pictures: " + ', '.join(f'{k} {v}' for k, v in sorted(n.items())))
for r in out:
    if r['verdict'] == 'CHANGED': print('  CHANGED', r['name'], r['prof'], r['theme'], r.get('changed_share', r.get('why')))
