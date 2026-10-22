"""Stage 3: gather the kit's own pictures from check runs into a picture set (shots/ + map.json) for the viewers and critics.
usage: python3 kitset.py SETDIR PREFIX RUNDIR...   (later runs replace earlier pictures of the same name)"""
import json, os, re, shutil, sys
SET, PREFIX = sys.argv[1], sys.argv[2]; runs = sys.argv[3:]
os.makedirs(os.path.join(SET, 'shots'), exist_ok=True); m = {}
for rd in runs:
    sd = os.path.join(rd, 'out', 'shots')
    if not os.path.isdir(sd): continue
    for f in sorted(os.listdir(sd)):
        mm = re.match(r'^[^_]+_([^_]+)_([^_]+)_(n\d+[^_]*)_\d+_(.+)\.png$', f)
        if not mm: continue
        prof, theme, line, name = mm.groups(); key = f'{PREFIX}-{line}-{name}'
        shutil.copy(os.path.join(sd, f), os.path.join(SET, 'shots', key + '.png'))
        m[key] = dict(name=key, prof=prof, theme=theme, note=f"taken by the kit's {line.split('-')[0].upper()} line after the fixes: {name.replace('-', ' ')}", file=key + '.png')
json.dump(list(m.values()), open(os.path.join(SET, 'map.json'), 'w'), indent=1); print(len(m), 'pictures ->', SET)
