"""Run 4 finish, edit f1: the clock reads with one hour digit ("9:40 Wed"), as the owner's 17 Oct list says.
Stage 3 had padded the hour to two digits everywhere (patch_s3k2.py, edit o7); this puts back the plan's form in every place o7 touched.
The ${DAY_ON}:00 texts and the bus times (busHM) were never padded and stay as they are."""
import sys
P = '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = []
def ed(old, new, c=1): E.append((old, new, c))

ed(r"function clockStr(h){const H=Math.floor(h),M=Math.floor((h-H)*6)*10;return (H<10?'0':'')+H+':'+(M<10?'0':'')+M;}   /* 01:30 like 22:00 (run 4, stage 3) */",
   r'''function clockStr(h){const H=Math.floor(h),M=Math.floor((h-H)*6)*10;return H+':'+(M<10?'0':'')+M;}   /* one hour digit before 10:00, like "9:40 Wed" (the owner's 17 Oct list; run 4, after stage 3) */''')
ed(r">Sleeping until 07:00 🌙</div>", r">Sleeping until 7:00 🌙</div>")
ed(r"' Clients message you from 08:00 to 20:00.'", r"' Clients message you from 8:00 to 20:00.'")
ed(r"' Classes are from 08:00 to 20:00.'", r"' Classes are from 8:00 to 20:00.'")
ed(r"' The salon is open from 08:00 to 20:00.'", r"' The salon is open from 8:00 to 20:00.'")
ed(r'<b id="clock">08:00</b>', r'<b id="clock">8:00</b>')

bad = 0
for old, new, c in E:
    n = s.count(old)
    if n != c: print('COUNT', n, '!=', c, ':', old[:110]); bad += 1
if bad: sys.exit(1)
for old, new, c in E: s = s.replace(old, new)
open(P, 'w', encoding='utf-8').write(s)
print('applied', len(E), 'edits')
