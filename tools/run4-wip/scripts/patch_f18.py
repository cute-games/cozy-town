"""Run 4 finish, f18: pass 21's kept mark. Each edit must match exactly once.
usage: python3 patch_f18.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. a chat opens at its newest message; when that one is taller than the screen (a photo on a short sideways phone) it opens at the
 #    message's top, not its foot: the thank-you photo's top was under the Photos header
 (r"""if(q)sc.scrollTop+=q.getBoundingClientRect().top-sc.getBoundingClientRect().top-(hd?hd.offsetHeight:0)-6;}}}""",
  r"""const l=q||[...sc.querySelectorAll('.bub')].pop();if(l){const t=l.getBoundingClientRect().top-sc.getBoundingClientRect().top-(hd?hd.offsetHeight:0)-6;if(q||t<0)sc.scrollTop+=t;}}}}   /* (run 4 finish: a newest message taller than the screen opens at its top: the thank-you photo's top was under the header on a sideways phone) */"""),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
