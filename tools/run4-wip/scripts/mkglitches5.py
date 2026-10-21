"""Run 4 finish, REPORTER for pass 8 on: keeps G4-001 to G4-167 as they are (their pictures are in the repo already), brings up to date the
entries pass 8 checked (UPDATES), and adds one entry per cause for the marks the double-checkers kept (G4-168 on, ENTRIES in glitches5_data.py).
"before" = the picture of the first mark; "after" = the newest picture of the same spot from a later pass (or a probe after the fix).
usage: python3 mkglitches5.py   -> rewrites glitches.json"""
import json, os, re, sys
S = '/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad'
sys.path.insert(0, S)
import glitches5_data as D   # DC (pass key -> double-check folder), PASS (pass key -> words), AFTER_SETS (newest first), KIT_SETS, PROBES, UPDATES, ENTRIES
M = {}
for k, d in D.DC.items():
    p = f'{S}/{d}/merged.json'
    if os.path.exists(p):
        for m in json.load(open(p)): M[f'{k}:{m["id"]}'] = m
maps = {}
for d in D.AFTER_SETS + D.KIT_SETS:
    mp = f'{S}/{d}/map.json'
    if os.path.exists(mp): maps[d] = [e for e in json.load(open(mp)) if e.get('file')]
def pic(ref):
    m = M.get(ref)
    return m['path'] if m and m.get('path') and os.path.exists(m['path']) else None
def spot_key(f):
    """(kind, name, prof, theme) of a picture file of a photographer or kit set."""
    k = re.match(r'kit\d+-(.*)\.png$', f)
    if k: return ('kit', k.group(1), None, None)
    parts = f.split('_'); return ('s3', re.sub(r'^.*?_\d{3}_', '', f)[:-4], parts[1], parts[2])
def newest_of(f, skip_set=None):
    """the newest picture of the same spot as picture file f, from the sets in D.AFTER_SETS / D.KIT_SETS (newest first)."""
    kind, name, prof, theme = spot_key(os.path.basename(f))
    for d in (D.KIT_SETS if kind == 'kit' else D.AFTER_SETS):
        if d == skip_set: continue
        for e in maps.get(d, []):
            if kind == 'kit' and re.sub(r'^kit\d+-', '', e['file'])[:-4] == name: return f'{S}/{d}/shots/{e["file"]}'
            if kind == 's3' and e['name'] == name and e['prof'] == prof and e['theme'] == theme: return f'{S}/{d}/shots/{e["file"]}'
    p = D.PROBES.get(os.path.basename(f))
    return f'{S}/{p}' if p and os.path.exists(f'{S}/{p}') else None
def after_of(ref):
    m = M.get(ref)
    if not m or not m.get('path'): return None
    own = m['path'].split('/')[-3] if m['path'].count('/') >= 3 else None   # the set the mark's own picture is in: an after picture comes from a later set
    a = newest_of(m['path'], skip_set=own)
    return a if a and a != m['path'] else None
old = json.load(open(f'{S}/glitches.json', encoding='utf-8'))
out = [g for g in old if int(g['id'].split('-')[1]) < 168]
used = set()
for suf, marks, place, device, what, bad, status, fix, check in D.ENTRIES:
    real = [m for m in marks if m in M]; used |= set(marks)
    miss = [m for m in marks if m not in M]
    if miss: print('missing marks', suf, miss)
    bad_v = [m for m in real if M[m]['verdict'] != 'KEEP']
    if bad_v: print('not kept by the double-checker', suf, bad_v)
    before = next((pic(m) for m in real if pic(m)), None)
    after = next((after_of(m) for m in real if after_of(m)), None) if status == 'fixed' else None
    passes = sorted({D.PASS[m.split(':')[0]] for m in real})
    lab = ', '.join(m.split(':')[1] + ' (' + D.PASS[m.split(':')[0]] + ')' for m in marks)
    out.append(dict(id='G4-' + suf, place=place, device=device, what=what + (f" (viewer marks {lab})" if marks else ""), bad=bad,
                    found_by=D.FOUND_BY.get(suf, 'PHOTOVIEWER + DOUBLE-CHECKER (' + ', '.join(passes) + ')'), fix=fix, before=D.BEFORE.get(suf, before), after=D.AFTER.get(suf, after), status=status, check=check))
# (run 4 finish, 21 Oct: the updates come after the new entries are built, so an entry from G4-168 on can be updated too)
by = {g['id']: g for g in out}
for gid, upd in D.UPDATES.items():
    g = by[gid]
    for k, v in upd.items():
        if k == 'after_spot': g['after'] = v if v and os.path.exists(v) else g.get('after')
        elif k == 'what_add': g['what'] = re.sub(r' \(viewer marks (.*)\)$', lambda mm: ' (viewer marks ' + mm.group(1) + ', ' + v + ')', g['what']) if '(viewer marks' in g['what'] else g['what'] + f' (viewer marks {v})'
        else: g[k] = v
kept = set()
for k, d in D.DC.items():
    p = f'{S}/{d}/merged.json'
    if os.path.exists(p): kept |= {f'{k}:{m["id"]}' for m in json.load(open(p)) if m['verdict'] == 'KEEP'}
used |= set(D.KNOWN)   # kept marks that are an earlier entry seen again (listed in that entry's UPDATES what_add)
if kept - used: print('kept marks with no entry:', sorted(kept - used))
json.dump(out, open(f'{S}/glitches.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
n = {}
for g in out: n[g['status']] = n.get(g['status'], 0) + 1
print(len(out), 'entries', n, '; new entries without a before picture:', [g['id'] for g in out if int(g['id'][3:]) >= 168 and not g['before']],
      '; fixed without an after picture:', [g['id'] for g in out if int(g['id'][3:]) >= 168 and g['status'] == 'fixed' and not g['after']])
