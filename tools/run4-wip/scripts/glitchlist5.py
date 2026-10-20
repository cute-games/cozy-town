"""Stage 3, REPORTER: glitches.json -> tools/GLITCH-LIST-4.md, with a small picture per glitch in tools/pictures-4/stage3-glitches/.
glitches.json entries: id, place, device, what, bad (1-3), found_by, fix, before (picture path, relative to the scratchpad or absolute),
after (optional), crop (optional [x0,y0,x1,y1]), status (fixed / open / not a glitch), check (what the fix check saw).
usage: python3 glitchlist.py [--critic CRITIC.md]"""
import json, os, subprocess, sys
S = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad'
REPO = '/home/user/cozy-town'; PICS = os.path.join(REPO, 'tools', 'pictures-4', 'stage3-glitches'); os.makedirs(PICS, exist_ok=True)
G = json.load(open(os.path.join(S, 'glitches.json'), encoding='utf-8'))
head = open(os.path.join(S, 'stage3', 'GLITCH-LIST-4-head.md'), encoding='utf-8').read().rstrip('\n') + '\n'
def small(src, dst, crop=None):
    src = src if src.startswith('/') else os.path.join(S, src)
    if not os.path.exists(src):   # (run 4 finish: the pictures of passes 1 to 7 were not kept; their small copies in the repo stay as they are)
        if os.path.exists(dst): return
        raise FileNotFoundError(src)
    args = ['python3', os.path.join(S, 'glitchpic.py'), src, dst] + ([str(v) for v in crop] if crop else []) + ['--w', '420']
    subprocess.run(args, check=True, capture_output=True)
rows = []
for g in G:
    pics = []
    if g.get('before'):
        d = os.path.join(PICS, f"{g['id']}-before.webp"); small(g['before'], d, g.get('crop')); pics.append(f"[before](pictures-4/stage3-glitches/{g['id']}-before.webp)")
    if g.get('after'):
        d = os.path.join(PICS, f"{g['id']}-after.webp"); small(g['after'], d, g.get('crop')); pics.append(f"[after](pictures-4/stage3-glitches/{g['id']}-after.webp)")
    rows.append(f"| {g['id']} | {g['place']} | {g['device']} | {g['what']} | {g['bad']} | {' · '.join(pics) or '—'} | {g['status']} |")
n = {}
for g in G: n[g['status']] = n.get(g['status'], 0) + 1
md = head + '\n'.join(rows) + '\n\n' + f"{len(G)} entries: " + ', '.join(f'{v} {k}' for k, v in sorted(n.items())) + '.\n\n## Each one in full\n\n'
for g in G:
    md += f"### {g['id']} ({g['status']}, how bad {g['bad']}): {g['place']}\n- Device: {g['device']}\n- What's wrong: {g['what']}\n- Found by: {g.get('found_by', '')}\n"
    if g.get('fix'): md += f"- Fix: {g['fix']}\n"
    if g.get('check'): md += f"- Fix check: {g['check']}\n"
    md += '\n'
if '--critic' in sys.argv:
    md += open(sys.argv[sys.argv.index('--critic') + 1], encoding='utf-8').read()
open(os.path.join(REPO, 'tools', 'GLITCH-LIST-4.md'), 'w', encoding='utf-8').write(md); print('GLITCH-LIST-4.md:', len(G), 'entries', n)
