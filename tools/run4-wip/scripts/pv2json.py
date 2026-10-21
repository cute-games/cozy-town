"""Glitch loop rules of 21 Oct: the list of a re-check's pictures for viewfocus.py, from the folders probe_views.py and shots4c_f.py wrote.
usage: python3 pv2json.py OUT.json NOTES.py DIR...   (NOTES.py: NOTES = {view name: what the picture should show}; a name not in it gets its own name)"""
import glob, json, os, re, runpy, sys
OUT, NF, DIRS = sys.argv[1], sys.argv[2], sys.argv[3:]
NOTES = runpy.run_path(NF)['NOTES']
pics = []
for d in DIRS:
    for p in sorted(glob.glob(os.path.join(d, '**', '*.png'), recursive=True)):
        b = os.path.basename(p)
        m = re.match(r'pv_([a-z0-9-]+?)_(light|dark)_pv-.+?_\d{3}_(.+?)-[a-z0-9]+-\1\.png$', b) or re.match(r's3c_([a-z0-9-]+?)_(light|dark)_.+?_\d{3}_(.+?)\.png$', b)
        if not m: print('skipped', b); continue
        prof, theme, name = m.groups()
        pics.append({'path': p, 'prof': prof, 'theme': theme, 'name': name, 'note': NOTES.get(name, name)})
json.dump(pics, open(OUT, 'w'), indent=1); print(len(pics), 'pictures ->', OUT)
