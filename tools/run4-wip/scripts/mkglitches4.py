"""Stage 3, REPORTER, passes 7 on: the glitch entries G4-160 onward, one per cause, grouping the viewer marks the
double-checkers kept (stage3-dc7 = pass 7; later passes are added to DC as they come).
"before" = the picture of the first mark; "after" = the newest picture of the same spot (pass 8 if taken, else a probe after the fix).
G4-001 to G4-159 stay as they are, except G4-148, which pass 7 found again and which was then fixed (its entry is brought up to date here).
usage: python3 mkglitches4.py K8HASH   -> rewrites glitches.json from G4-160 on"""
import json, os, re, sys
S = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad'
K8 = sys.argv[1]
DC = {'p7': 'stage3-dc7'}
PASS = {'p7': 'pass 7'}
M = {}
for k, d in DC.items():
    for m in json.load(open(f'{S}/{d}/merged.json')): M[f'{k}:{m["id"]}'] = m
AFTER_SETS = ['stage3-p8', 'stage3-p8b', 'stage3-p8c']
KIT_SETS = ['stage3-kit8']
PROBES = {   # spots whose after picture is a probe taken right after the fix (the pass-8 picture replaces it when there is one)
    's3_ipad-landscape_dark_ipad-landscape-dark_036_inside-home-floor-2-stairs.png': 'probe-k8/ipad/shots/probe5_ipad-landscape_light_ipad-landscape_001_floor-2-stairs.png',
    's3_iphone-portrait_dark_iphone-portrait-dark_026_photo-pose-card.png': 'probe-k8/ip/shots/probe5_iphone-portrait_light_iphone-portrait_001_photo-pose-card.png',
    's3_iphone-landscape_light_iphone-landscape-light_003_phone-jobs.png': 'probe-k8/il/shots/probe5_iphone-landscape_light_iphone-landscape_001_phone-jobs.png',
    's3_iphone-landscape_light_iphone-landscape-light_005_phone-quests.png': 'probe-k8/il/shots/probe5_iphone-landscape_light_iphone-landscape_002_phone-quests.png',
    's3_iphone-landscape_light_iphone-landscape-light_009_phone-calendar.png': 'probe-k8/il/shots/probe5_iphone-landscape_light_iphone-landscape_003_phone-calendar.png',
    's3_iphone-landscape_light_iphone-landscape-light_010_big-map.png': 'probe-k8/il/shots/probe5_iphone-landscape_light_iphone-landscape_005_big-map-5s.png',
    'kit7-n26-map-iphone-landscape-big-map-iphone-landscape.png': 'probe-k8/il/shots/probe5_iphone-landscape_light_iphone-landscape_005_big-map-5s.png',
}
maps = {}
for d in AFTER_SETS + KIT_SETS:
    mp = f'{S}/{d}/map.json'
    if os.path.exists(mp): maps[d] = [e for e in json.load(open(mp)) if e.get('file')]
def pic(ref):
    m = M.get(ref)
    return m['path'] if m and m.get('path') and os.path.exists(m['path']) else None
def after_of(ref):
    m = M.get(ref)
    if not m: return None
    f = os.path.basename(m['path'])
    k = re.match(r'kit\d-(.*)\.png$', f)
    if k:
        for d in KIT_SETS:
            for e in maps.get(d, []):
                if e['file'][5:-4] == k.group(1): return f'{S}/{d}/shots/{e["file"]}'
    else:
        spot = re.sub(r'^.*?_\d{3}_', '', f)[:-4]; parts = f.split('_'); prof, theme = parts[1], parts[2]
        for d in AFTER_SETS:
            for e in maps.get(d, []):
                if e['name'] == spot and e['prof'] == prof and e['theme'] == theme: return f'{S}/{d}/shots/{e["file"]}'
    p = PROBES.get(f)
    return f'{S}/{p}' if p and os.path.exists(f'{S}/{p}') else None
def R(pfx, *ids): return [f'{pfx}:M-{i:03d}' for i in ids]
FIXED_LATER = 'The pictures of this pass were taken before the fix went in.'
# (id suffix, marks, place, device, what, bad, status, fix, check)
G = [
 # ---- pass 7 ----
 ('160', R('p7', 1, 4), 'the front door of a house on Friends Lane', 'iPad', "Dark blurred smudges lay on the wall either side of the front door and over its top half, with a jagged grey band under the roof edge.", 1, 'fixed',
  "The smudges were the shadow of the little roof over the door and its two brackets, which the town's soft shadows drew as blurred blots on the wall. The little door roof and its brackets cast no shadow now (f26b169). " + FIXED_LATER, 'a probe of a one-storey and a six-floor house after the fix: the wall round the door is clean; pass 8 pictures.'),
 ('161', R('p7', 3), 'the stair plates on floor 2', 'iPad', '"⬇️ Downstairs" ran to both edges of its plate, while "⬆️ Upstairs" beside it had room.', 1, 'fixed',
  f'A plate\'s words keep 8% of its width free at each side (the fit test let them run to the edge) ({K8}). ' + FIXED_LATER, 'a probe of floor 2 after the fix: both plates have room at the sides; pass 8 pictures.'),
 ('162', R('p7', 12), 'the square, looking to the Flower Corner', 'iPhone upright', 'The camera seemed to be inside a vehicle: a dark outline and two small windows filled the view.', 3, 'not a glitch',
  "On an upright phone the photographer steps back 4 m to fit more in; on a bus morning that put it half a metre from the side of the Beach Bus waiting at the stop, and through the bus's windows on both sides the view looked like the inside of a box. A child can stand there too and sees the bus's side, as next to any bus; the bus is solid and an arriving bus moves you aside (G4-141). The photographer's step back now stops 1.5 m short of the bus or a car.", '—'),
 ('163', R('p7', 13, 14, 15), 'the phone on a short sideways screen', 'iPhone sideways', "The phone was narrow, so its words wrapped into many lines: Rosie's three job cards were cut at the bottom, the quest's second step and the calendar's Halloween line sat half under the bottom fade.", 1, 'fixed',
  f'On a short sideways screen the phone is wider (up to 72% of the screen, at most 600 px), so the job cards, the calendar line and the quest card\'s first steps fit; a list that goes on below still shows its soft fade ({K8}). ' + FIXED_LATER, "a probe on a sideways iPhone after the fix: Rosie's cards and the Halloween line read in full; the quest list ends in its fade because more quests follow; pass 8 pictures."),
 ('164', R('p7', 16, 18), 'the big map on a short sideways screen', 'iPhone sideways', 'The "Tap a place to see the way there!" tip sat over the map\'s bottom row: Pet Shop and Cozy Park lost their names under it, and a cut "Ice Cream Shop" peeked out below it.', 1, 'fixed',
  f'The tip fades away after four seconds (and comes back with the next tip); the card for a place you picked stays ({K8}). ' + FIXED_LATER, 'a probe of the big map on a sideways iPhone after the fix: after five seconds the tip is gone and every name on the bottom row reads; N26 passes.'),
 ('165', R('p7', 17), 'friends on the big map', 'iPhone sideways', '"Finn" stood 3 px from "Duck Pond", so it read as one name, "Finn Duck Pond".', 1, 'fixed',
  f"A friend's name on the map keeps 7 px of air from every place name and icon; it takes the next side of its dot that has room ({K8}). " + FIXED_LATER, 'N26 passes; pass 8 map pictures.'),
 ('166', R('p7', 20, 21, 22), 'a photo shoot at the school', 'PC', 'The asked background, "the school sign", was above the dashed frame, cut by the top of the screen and under the coin and time chips; the "Everyone is posed!" tip sat in the frame over Mia and the cat; the photo had no school sign in it and still got five stars.', 2, 'fixed',
  'The school has a name board on two tall posts right of its door, the "school sign" background, at a height a photo from the pavement takes in (the name over the door was too high); the asked background has to be in the frame for the stars; the shoot\'s tips sit under the top row (c6d204f). ' + FIXED_LATER, 'N25 passes; a probe of a school shoot after the fix: the board in the frame, the tip at the top; pass 8 pictures.'),
 ('167', R('p7', 23), 'the big map\'s left edge', 'PC', 'A cut "ne" of "Friends Lane" hung alone at the map\'s left edge.', 1, 'not a glitch',
  'A map is cut at its edge like any map you can move and zoom; the name shows in full when you move the map (decided in section 9c, with the names at the map\'s edge in pass 5).', '—'),
]
old = json.load(open(f'{S}/glitches.json', encoding='utf-8'))
out = [g for g in old if int(g['id'].split('-')[1]) < 160]
for g in out:   # G4-148 (pass 5: taken for the photographer's camera) came back in pass 7 and was fixed in the game
    if g['id'] == 'G4-148':
        g['status'] = 'fixed'
        g['what'] = re.sub(r' \(viewer marks .*\)$', '', g['what']) + ' (viewer marks M-031, M-040 (pass 5), M-011 (pass 7))'
        g['found_by'] = 'PHOTOVIEWER + DOUBLE-CHECKER (pass 5, pass 7)'
        g['fix'] = ("Pass 5 put it down to the photographer's camera standing too close. Pass 7 found it again, and in play it happens too: a child "
                    f"who walks up to a friend to pose them sees them from close by. On an upright phone, opening a pose card now steps the camera back to the spot "
                    f"that frames the whole group, so the card sits under them ({K8}).")
        g['check'] = 'a probe of the pose card on an upright iPhone after the fix: all three in the dashed frame above the card; N25 passes.'
        g['after'] = f'{S}/probe-k8/ip/shots/probe5_iphone-portrait_light_iphone-portrait_001_photo-pose-card.png'
        if not g.get('before') or not os.path.exists(g['before'] or ''): g['before'] = pic('p7:M-011')
for suf, marks, place, device, what, bad, status, fix, check in G:
    real = [m for m in marks if m in M]
    miss = [m for m in marks if m not in M]
    if miss: print('missing marks', suf, miss)
    bad_v = [m for m in real if M[m]['verdict'] != 'KEEP']
    if bad_v: print('not kept by the double-checker', suf, bad_v)
    before = next((pic(m) for m in real if pic(m)), None)
    after = next((after_of(m) for m in real if after_of(m)), None) if status == 'fixed' else None
    passes = sorted({PASS[m.split(':')[0]] for m in real})
    lab = ', '.join(m.split(':')[1] + ' (' + PASS[m.split(':')[0]] + ')' for m in marks)
    out.append(dict(id='G4-' + suf, place=place, device=device, what=what + f" (viewer marks {lab})", bad=bad,
                    found_by='PHOTOVIEWER + DOUBLE-CHECKER (' + ', '.join(passes) + ')', fix=fix, before=before, after=after, status=status, check=check))
kept = {f'p7:{m["id"]}' for m in json.load(open(f'{S}/stage3-dc7/merged.json')) if m['verdict'] == 'KEEP'}
used = {m for g in G for m in g[1]} | {'p7:M-011'}
if kept - used: print('kept marks with no entry:', sorted(kept - used))
json.dump(out, open(f'{S}/glitches.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
n = {}
for g in out: n[g['status']] = n.get(g['status'], 0) + 1
print(len(out), 'entries', n, '; new entries without a before picture:', [g['id'] for g in out if int(g['id'][3:]) >= 160 and not g['before']],
      '; fixed without an after picture:', [g['id'] for g in out if int(g['id'][3:]) >= 160 and g['status'] == 'fixed' and not g['after']])
