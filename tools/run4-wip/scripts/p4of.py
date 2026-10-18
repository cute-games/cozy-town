"""print the pass-4 picture of the same spot as each pass-3 mark: python3 p4of.py M-001 M-002 ..."""
import json, os, re, sys
S = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad'
by = {m['id']: m for m in json.load(open(f'{S}/stage3-dc3/merged.json'))}
idx = {}
for d in ('stage3-p4', 'stage3-p4b', 'stage3-kit4'):
    for e in json.load(open(f'{S}/{d}/map.json')):
        if e.get('file'): idx.setdefault((e['name'], e['prof'], e['theme']), f'{S}/{d}/shots/{e["file"]}')
def after(m):
    f = m['file']
    if f.startswith('kit'):
        key = re.sub(r'^kit\d-', '', f)[:-4]
        for k, v in idx.items():
            if k[0].endswith(key): return v
        return None
    spot = re.sub(r'^.*?_\d{3}_', '', f)[:-4]; prof, theme = f.split('_')[1], f.split('_')[2]
    return idx.get((spot, prof, theme))
for a in sys.argv[1:]:
    m = by[a]; print(a, m['verdict'], '|', after(m))
