"""find pictures in picture sets by spot name: python3 findpic.py SETDIR SPOT_SUBSTRING [PROF] [THEME]"""
import json, os, sys
d, sub = sys.argv[1], sys.argv[2]; prof = sys.argv[3] if len(sys.argv) > 3 else ''; theme = sys.argv[4] if len(sys.argv) > 4 else ''
for e in json.load(open(os.path.join(d, 'map.json'))):
    if e.get('file') and sub in e['name'] and prof in e.get('prof', '') and theme in e.get('theme', ''):
        print(os.path.join(d, 'shots', e['file']))
