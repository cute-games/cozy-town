"""Stage 3: split the pictures the CHANGE-SPOTTER passed on into PHOTOVIEWER batches; write one brief per batch (the prompt, the
picture list with where each was taken, the "should look like" lines).
usage: python3 viewbatch.py OUTDIR PER_BATCH MAPJSON..."""
import json, os, sys
S = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad'
OUT = sys.argv[1]; PER = int(sys.argv[2]); maps = sys.argv[3:]
os.makedirs(OUT, exist_ok=True)
prompt = open(f'{S}/stage3/prompt-photoviewer.md', encoding='utf-8').read().strip()
should = open(f'{S}/stage3/should-look-like.md', encoding='utf-8').read().strip()
cs = {}
for mp in maps:
    d = os.path.dirname(mp)
    try:
        for r in json.load(open(os.path.join(d, 'change-spotter.json'))): cs[(r['name'], r['prof'], r['theme'])] = r['verdict']
    except FileNotFoundError: pass
SKIP_NAMES = {'dance-hud'}   # the staged dance still (no partner): the kit's real two-player pictures stand in for it
pics = []; seen_k = set()
for mp in maps:
    d = os.path.dirname(mp)
    for e in json.load(open(mp)):
        if not e.get('file'): continue
        if (e['name'], e['prof'], e['theme']) in seen_k: continue
        seen_k.add((e['name'], e['prof'], e['theme']))
        if cs.get((e['name'], e['prof'], e['theme'])) == 'SAME' or e['name'] in SKIP_NAMES: continue
        pics.append(dict(path=os.path.join(d, 'shots', e['file']), name=e['name'], prof=e['prof'], theme=e['theme'], note=e.get('note', ''), loc=e.get('loc'), open=e.get('open'), time=e.get('time'), wx=e.get('wx')))
# group by device so one viewer sees one screen shape at a time; keep the order of the map
batches = [pics[i:i + PER] for i in range(0, len(pics), PER)]
for i, b in enumerate(batches, 1):
    lines = [prompt, '', f'## Batch {i} of {len(batches)}: {len(b)} pictures', '',
             'Read every picture file below with the Read tool (they are PNG screenshots) and judge it. The line after each path says where it was taken.', '']
    for p in b:
        lines.append(f"- {p['path']}")
        lines.append(f"  {p['prof']}, {p['theme']} theme: {p['note']}" + (f" (place {p['loc']}, {p['time']}, weather {p['wx']})" if p.get('loc') else ''))
    lines += ['', should, '', 'Answer with the problem lines only (PICTURE FILE | where | what is wrong | how bad), then the count. The PICTURE FILE is the file name only (not the folder).']
    open(os.path.join(OUT, f'batch-{i:02d}.md'), 'w', encoding='utf-8').write('\n'.join(lines))
json.dump(pics, open(os.path.join(OUT, 'pictures.json'), 'w'), indent=1)
print(len(pics), 'pictures in', len(batches), 'batches ->', OUT)
