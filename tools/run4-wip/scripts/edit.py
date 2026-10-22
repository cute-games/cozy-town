"""Exact-match edits for the game file (and any text file). usage: python3 edit.py FILE EDITS.json
EDITS.json = a list of edits, each one of:
  [old, new]            old must occur exactly once; it is replaced by new
  [old, new, count]     old must occur exactly `count` times; every one is replaced
  ["@between", startAnchor, endAnchor, new]   the text from startAnchor through endAnchor (inclusive, each unique, start before end) becomes new
Stops before writing anything if any edit does not match."""
import json, sys
path, spec = sys.argv[1], sys.argv[2]
s = open(path, encoding='utf-8').read()
edits = json.load(open(spec, encoding='utf-8'))
bad = []
def check(i, e, s):
    if e[0] == '@between':
        a, b = e[1], e[2]
        if s.count(a) != 1: return f'edit {i}: start anchor found {s.count(a)} times: {a[:90]!r}'
        if s.count(b) != 1: return f'edit {i}: end anchor found {s.count(b)} times: {b[:90]!r}'
        if s.index(b) < s.index(a): return f'edit {i}: end anchor comes before the start anchor'
        return None
    old = e[0]; n = e[2] if len(e) > 2 else 1
    c = s.count(old)
    if c != n: return f'edit {i}: expected {n} match(es), found {c}: {old[:90]!r}'
    return None
def apply(e, s):
    if e[0] == '@between':
        i = s.index(e[1]); j = s.index(e[2]) + len(e[2])
        return s[:i] + e[3] + s[j:]
    return s.replace(e[0], e[1])
# edits apply in order, each checked against the text as it stands after the ones before it
t = s
for i, e in enumerate(edits):
    err = check(i, e, t)
    if err: bad.append(err); continue
    t = apply(e, t)
if bad:
    print('\n'.join(bad)); sys.exit('STOP: nothing written')
open(path, 'w', encoding='utf-8').write(t)
print(f'{path}: {len(edits)} edits applied, {len(t)} bytes')
