"""Take only the pet moves the game uses from the book's moves pack (run doc guard 3): every top-level definition the chosen moves need, in pack order."""
import re, sys
src = open(sys.argv[1], encoding='utf-8').read().split('\n')
WANT = sys.argv[3].split(',')   # move names
# body lines: between "'use strict';" and "const M={"
i0 = next(i for i, l in enumerate(src) if l.startswith("'use strict';")) + 1
iM = next(i for i, l in enumerate(src) if l.startswith('const M={'))
defs = []  # (names, lines)
def topnames(t):
    out=[];dep=0;i=0;start=True;q=None
    while i<len(t):
        c=t[i]
        if q:
            if c=='\\': i+=2; continue
            if c==q: q=None
        elif c in '\'"`': q=c
        elif c in '([{': dep+=1
        elif c in ')]}': dep-=1
        elif c==';' and dep==0: break
        elif c==',' and dep==0: start=True
        elif start and dep==0:
            m=re.match(r'\s*([A-Za-z_$][\w$]*)\s*=',t[i:])
            if m: out.append(m.group(1)); i+=m.end(); start=False; continue
            start=False
        i+=1
    return out
cur = None; pending = []
incom = False
for l in src[i0:iM]:
    if incom:
        pending.append(l); incom = '*/' not in l; continue
    if l.startswith('/*') and '*/' not in l:
        pending.append(l); incom = True; continue
    m = re.match(r'(function\s+([A-Za-z_$][\w$]*)|const\s+(.*?)=)', l)
    if m and not l.startswith(' '):
        names = [m.group(2)] if m.group(2) else re.findall(r'(?:^|,)\s*([A-Za-z_$][\w$]*)\s*=', l[6:].split(';')[0] + '=')
        if m.group(3): names = topnames(l[6:])
        cur = [names, pending + [l]]; pending = []; defs.append(cur)
    elif l.startswith('/*') and (cur is None or not l.startswith('   ')) and not l.startswith(' '):
        pending.append(l)
    else:
        if cur is None or (l.strip() == '' ): pending.append(l) if l.strip() else None
        else: cur[1].append(l)
table = {}
for line in src[iM:]:
    for k, v in re.findall(r"'([\w.]+)':\[((?:\([^)]*\)=>[^\]]*?|[A-Za-z_$][\w$]*),\s*[^\]]*)\]", line): table[k] = v
byname = {}
for d in defs:
    for n in d[0]: byname.setdefault(n, d)
need = set(); todo = []
rows = []
for w in WANT:
    v = table[w]; rows.append(f" '{w}':[{v}]"); todo.append(v)
ip0 = next(i for i, l in enumerate(src) if l.startswith('function play('))
todo.append('\n'.join(src[ip0:ip0+4]))
seen = set()
while todo:
    txt = todo.pop()
    for ident in set(re.findall(r'[A-Za-z_$][\w$]*', re.sub(r'/\*.*?\*/','',txt,flags=re.S))):
        d = byname.get(ident)
        if d and id(d) not in seen: seen.add(id(d)); todo.append('\n'.join(d[1]))
out = [l for l in src[:i0]]
for d in defs:
    if id(d) in seen: out += d[1]
out.append('const M={'); out.append(',\n'.join(rows)); out.append('};')
# play() and the export (only what the game uses)
ip = next(i for i, l in enumerate(src) if l.startswith('function play('))
k = ip
while not src[k].startswith('window.COZY_MOVES'): out.append(src[k]); k += 1
out.append("window.COZY_MOVES={version:'2026-10-31d (pets: the moves the game uses)',play,list:Object.keys(M),KIND};")
out.append('})();')
open(sys.argv[2], 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(len('\n'.join(out)), 'bytes;', len(seen), 'definitions')
