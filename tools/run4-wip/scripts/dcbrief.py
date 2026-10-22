"""Stage 3, DOUBLE-CHECKER briefs: the PHOTOVIEWER's marks (one per line: FILE | where | what | how bad, as collected in marks.txt)
get temporary ids (M-001...) and are split into briefs of PER marks, each with the picture's full path and the one-line claim.
usage: python3 dcbrief.py MARKS.txt OUTDIR PER PICTURES.json...   (PICTURES.json = viewbatch's list, to find each file's folder)"""
import json, os, re, sys
S = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad'
marks_file, OUT, PER = sys.argv[1], sys.argv[2], int(sys.argv[3]); os.makedirs(OUT, exist_ok=True)
where = {}
for pj in sys.argv[4:]:
    for p in json.load(open(pj)): where[os.path.basename(p['path'])] = p['path']
prompt = open(f'{S}/stage3/prompt-doublechecker.md', encoding='utf-8').read().strip()
marks = []
for l in open(marks_file, encoding='utf-8'):
    l = l.strip()
    if not l or l.startswith('#'): continue
    parts = [x.strip() for x in l.split('|')]
    if len(parts) < 4: continue
    f = parts[0]; f = re.sub(r'^.*/', '', f)
    if f not in where:
        # a viewer sometimes shortens the name: find the one file that ends with it
        c = [k for k in where if k.endswith(f) or f.endswith(k)]
        if len(c) == 1: f = c[0]
    marks.append(dict(id=f'M-{len(marks) + 1:03d}', file=f, path=where.get(f), where=parts[1], what=parts[2], bad=parts[3]))
json.dump(marks, open(os.path.join(OUT, 'marks.json'), 'w'), indent=1)
batches = [marks[i:i + PER] for i in range(0, len(marks), PER)]
for i, b in enumerate(batches, 1):
    lines = [prompt, '', f'## {len(b)} marks to check (brief {i} of {len(batches)})', '', 'Read each picture with the Read tool, then answer one line per mark: ID | KEEP or DROP | why.', '']
    for m in b:
        lines.append(f"- {m['id']}: picture {m['path'] or m['file']}")
        lines.append(f"  claim: {m['where']} | {m['what']} | how bad {m['bad']}")
    open(os.path.join(OUT, f'dc-{i:02d}.md'), 'w', encoding='utf-8').write('\n'.join(lines))
print(len(marks), 'marks in', len(batches), 'briefs ->', OUT, '; unmatched files:', [m['id'] for m in marks if not m['path']])
