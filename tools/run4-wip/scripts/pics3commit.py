"""Stage 3: the photographer's pictures for the repo. Every picture of the given maps is saved as a webp no wider than 640 px in
tools/pictures-4/stage3/<set>/, and one map.json there says where each was taken (set, name, device, theme, note, place, time, weather).
usage: python3 pics3commit.py SET=MAPJSON [SET=MAPJSON...]   (a later SET with the same name/device/theme replaces the earlier picture)"""
import json, os, sys
from PIL import Image
REPO = '/home/user/cozy-town'; OUT = os.path.join(REPO, 'tools', 'pictures-4', 'stage3')
entries = {}
for arg in sys.argv[1:]:
    setname, mp = arg.split('=', 1); d = os.path.dirname(mp)
    for e in json.load(open(mp)):
        if not e.get('file'): continue
        k = (e['name'], e['prof'], e['theme'])
        entries[k] = dict(set=setname, src=os.path.join(d, 'shots', e['file']), name=e['name'], prof=e['prof'], theme=e['theme'], note=e.get('note', ''),
                          loc=e.get('loc'), time=e.get('time'), wx=e.get('wx'), date=e.get('date'), open=e.get('open'))
os.makedirs(OUT, exist_ok=True); themap = []; total = 0
for k, e in entries.items():
    sub = os.path.join(OUT, e['set']); os.makedirs(sub, exist_ok=True)
    name = f"{e['name']}--{e['prof']}-{e['theme']}.webp"; dst = os.path.join(sub, name)
    im = Image.open(e['src']).convert('RGB')
    if im.width > 640: im = im.resize((640, round(im.height * 640 / im.width)), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=72); total += os.path.getsize(dst)
    themap.append(dict(file=f"{e['set']}/{name}", **{x: e[x] for x in ('name', 'prof', 'theme', 'note', 'loc', 'time', 'wx', 'date', 'open')}))
json.dump(themap, open(os.path.join(OUT, 'map.json'), 'w'), indent=1, ensure_ascii=False)
print(len(themap), 'pictures,', round(total / 1e6, 1), 'MB ->', OUT)
