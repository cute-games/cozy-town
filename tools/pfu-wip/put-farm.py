"""Stage 6: the farm's placements as game data (FARMD at the end of js/02-world.js), from kit/kits/pfu-placements.json (the Map chat's approved plan).
Usage (repo root): python3 tools/pfu-wip/put-farm.py"""
import json, re
d = json.loads(json.load(open('kit/kits/pfu-placements.json'))['text'])
FN = {'Rock': 'rock', 'Bush': 'bush', 'Pine': 'pine', 'Tree': 'tree', 'Oak': 'nat.oak', 'Fir': 'nat.fir', 'Snowy pine': 'nat.firs', 'Mountain': 'mtn',
      'Windmill': 'farm.windmill', 'Old combine': 'farm.combine', 'FARM arch': 'farm.arch'}
JUMPS = ['x', 'v', 'o', 's', 'x', 'v', 'x', 'o', 's', 'v', 'x', 's']   # o111..o122 (pfu-scene-readme)
r2 = lambda v: round(v, 2)
rows = []
for p in d['plan']:
    if p.get('fn') == 'Object':
        i = int(p['id'][1:]) - 111; k = 'course.%s.%d' % (JUMPS[i], i % 4)
    elif p.get('fn'): k = FN[p['fn']]
    elif p.get('animal'): k = 'fa.%s.%s' % (p['animal'], p['age'])
    elif p['pu'] in ('farm:cow', 'farm:sheep', 'farm:pig', 'farm:chicken', 'farm:horse'): k = 'fa.%s.adult' % p['pu'][5:]
    elif p['pu'] == 'nature:birch': k = 'nat.birch'
    else: k = 'farm.' + p['pu'][5:]
    rows.append([k, r2(p['x']), r2(p['z']), r2(p['ry']), r2(p['s']), p['id']])
AD = {'n:fir': 'nat.fir', 'n:birch': 'nat.birch', 'n:oak': 'nat.oak', 'f:lab': 'fa.lab', 'pu:farm:stable': 'farm.stable'}
for a in d['added']:
    m = a['model']
    if m in AD: k = AD[m]
    elif m == 'pu:farm:coach': k = 'coach.' + a['o']['v']
    elif m == 'pu:course:flag': k = 'flag.' + a['o']['c']
    else: continue   # the vet clinic and the Pet Show area: built by stages 4 and 5
    rows.append([k, r2(a['x']), r2(a['z']), r2(a['ry']), 1, a['id']])
roads = [[{'road': 0, 'path': 1, 'trail': 2}[r['kind']], r['width']] + [r2(v) for v in r['pts']] for r in d['roads']]
ground = [[{'farm': 0, 'mud': 1, 'sand': 2}[g['k']], r2(g['x']), r2(g['z']), r2(g['r'])] + ([1 if g.get('sm') else 0, r2(g.get('sx', 1))] if g.get('sm') or g.get('sx') else []) for g in d['ground']]
dele = [[r2(t['x']), r2(t['z'])] for t in d['townDeleted'] if t['name'].startswith('Forest')]
moved = [[r2(t['from'][0]), r2(t['from'][1]), r2(t['to'][0]), r2(t['to'][1])] for t in d['townMoved'] if t['name'].startswith('Forest')]
L = d['lesson']
out = ('/* 🐴 the farm, the horse trail and the jump field as placed in the Map chat\'s approved Area plan (pets and farm update, stage 6; made by tools/pfu-wip/put-farm.py\n'
       '   from kit/kits/pfu-placements.json): p = [model, x, z, ry, scale, id], roads = [0 road | 1 path | 2 trail, width, x,z,...], ground = [0 farm | 1 mud | 2 sand, x, z, r, smooth, x stretch],\n'
       '   del = forest trees taken out (trail, roads, fields, buildings), mv = forest trees moved [from x,z, to x,z]. Game metres, city frame */\n'
       'const FARMD=' + json.dumps({'box': d['farmBox'], 'p': rows, 'roads': roads, 'ground': ground, 'del': dele, 'mv': moved,
                                    'lesson': {'stan': L['stan'], 'blue': L['blueFlag'], 'red': L['redFlag'], 'jump': 'o122'}}, separators=(',', ':')) + ';\n')
p = 'js/02-world.js'; s = open(p, encoding='utf-8').read()
a = s.find("/* 🐴 the farm, the horse trail and the jump field as placed")
if a >= 0: b = s.find('\n', s.find('const FARMD=', a)) + 1; s = s[:a] + out + s[b:]
else: s = s.rstrip('\n') + '\n' + out
open(p, 'w', encoding='utf-8').write(s)
print(len(out), 'bytes;', len(rows), 'things,', len(roads), 'roads,', len(ground), 'ground,', len(dele), 'deleted,', len(moved), 'moved')
