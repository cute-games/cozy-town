"""Stage 3, CHANGE-SPOTTER: for every stage-3 picture, find the night-3 picture of the same spot (tools/pictures-3) and say
whether the spot changed. Pictures with no night-3 counterpart are NEW. The two sets were taken by different scripts from
different camera spots, so the comparison is a coarse one: the pictures are shrunk to 64x64 grey, and the mean difference and the
share of changed cells (over 12% difference) are measured; a spot counts as CHANGED when more than a fifth of its cells differ.
usage: python3 changespot.py MAPJSON... > change-spotter.md   (writes change-spotter.json next to the first map)"""
import json, os, sys
from PIL import Image
import numpy as np
P3 = '/home/user/cozy-town/tools/pictures-3'
# stage-3 spot name -> the night-3 picture of the same place (the 'after' picture of night 3 = what was live before run 4)
SAME = {
 'town-square-fountain': 'after-park-fountain.png', 'town-square-fountain-night': 'after-park-night.png',
 'town-pet-show-stage': 'after-food-truck.png', 'town-apartments': 'after-west-road-by-apartments.png',
 'lane-my-house': 'after-friends-lane-west.png', 'town-flower-corner': 'after-holidays-halloween.png',
 'halloween-spooky-gate': 'after-holidays-spooky-path.png', 'holiday-easter-corner': 'after-holidays-easter.png',
 'inside-pets': 'after-pet-shop-pens.png', 'inside-home': 'after-kitchen-at-home.png', 'inside-home-floor-2': 'after-house-upstairs-save.png',
 'big-map': 'after-town-map.png', 'town-square-fountain-rain': 'after-weather-rain.png', 'town-east-shops': 'after-town-corner-southwest.png',
 'town-school-front': 'after-town-edge-north.png', 'job-hair-card': 'after-salon-card.png', 'tutorial-hair': 'after-salon-tips.png',
 'town-bus-stop': 'after-park-bench.png', 'town-football': 'after-season-autumn.png', 'town-lake': 'after-sky-over-town.png',
}
def grey(p, n=64):
    im = Image.open(p).convert('L').resize((n, n), Image.BILINEAR)
    a = np.asarray(im, dtype=np.float32) / 255.0
    return a
out = []; shots_dirs = []
for mp in sys.argv[1:]:
    d = os.path.dirname(mp); shots = os.path.join(d, 'shots'); shots_dirs.append(shots)
    for e in json.load(open(mp)):
        if not e.get('file'): out.append(dict(name=e['name'], prof=e['prof'], theme=e['theme'], verdict='NO PICTURE', why=e.get('error', '')[:120])); continue
        base = e['name']; ref = SAME.get(base)
        rec = dict(name=e['name'], prof=e['prof'], theme=e['theme'], file=e['file'])
        if not ref or not os.path.exists(os.path.join(P3, ref)):
            rec.update(verdict='NEW', why='no night-3 picture of this spot' if not ref else f'{ref} missing')
        else:
            a = grey(os.path.join(shots, e['file'])); b = grey(os.path.join(P3, ref))
            diff = np.abs(a - b); share = float((diff > .12).mean()); mean = float(diff.mean())
            rec.update(ref=ref, mean_diff=round(mean, 3), changed_share=round(share, 3), verdict='CHANGED' if share > .2 else 'SAME')
        out.append(rec)
json.dump(out, open(os.path.join(os.path.dirname(sys.argv[1]), 'change-spotter.json'), 'w'), indent=1)
n = {}
for r in out: n[r['verdict']] = n.get(r['verdict'], 0) + 1
print('# CHANGE-SPOTTER\n')
print(f"{len(out)} pictures: " + ', '.join(f'{k} {v}' for k, v in sorted(n.items())) + '.\n')
print('Pictures with a night-3 picture of the same spot (tools/pictures-3), coarse 64x64 grey comparison:\n')
print('| picture | night-3 picture | mean diff | cells changed | verdict |\n|---|---|---|---|---|')
for r in out:
    if r.get('ref'): print(f"| {r['file']} | {r['ref']} | {r['mean_diff']} | {int(r['changed_share']*100)}% | {r['verdict']} |")
print('\nEvery CHANGED and every NEW picture goes on to the PHOTOVIEWER; a SAME picture is dropped.')
