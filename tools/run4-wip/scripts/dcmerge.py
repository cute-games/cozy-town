"""Stage 3: merge one pass's DOUBLE-CHECKER answers (DCDIR/out/dc-*.txt, lines 'M-001 | KEEP | why') with its marks (DCDIR/marks.json)
into DCDIR/merged.json (verdict, dc, spot). Marks no checker answered yet get verdict 'OPEN'.
usage: python3 dcmerge.py DCDIR"""
import json, glob, re, sys, os
D = sys.argv[1]
marks = json.load(open(f'{D}/marks.json')); ans = {}
for f in sorted(glob.glob(f'{D}/out/dc-*.txt')):
    for line in open(f, encoding='utf-8'):
        p = [q.strip() for q in line.split('|', 2)]
        if len(p) == 3 and re.match(r'^M-\d+$', p[0]) and p[1] in ('KEEP', 'DROP'): ans[p[0]] = (p[1], p[2])
out = []
for m in marks:
    v, why = ans.get(m['id'], ('OPEN', ''))
    out.append(dict(m, verdict=v, dc=why, spot=re.sub(r'^.*?_\d{3}_', '', m['file'])[:-4]))
json.dump(out, open(f'{D}/merged.json', 'w'), indent=1, ensure_ascii=False)
n = {}
for m in out: n[m['verdict']] = n.get(m['verdict'], 0) + 1
print(D, n)
