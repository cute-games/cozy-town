"""Run 4 finish, f11: pass 14's kept marks. Each edit must match exactly once (the job box's edit: its five places).
usage: python3 patch_f11.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. the hairstylist's card: the customer's words never leave their last emoji and the closing quote alone on a line ("💕”")
 ("<p class=\"line\">“${esc(hsAsk(c))}”<br>",
  "<p class=\"line\">“${esc(hsAsk(c)).replace(/ (\\S+)$/,'\\u00a0$1')}”<br>", 1),
 # 2. the job box: "· 86 m" never starts a line (the space before it could break; the photographer's, the hairstylist's, the teacher's, the designer's and the pizza box)
 ("' <span class=\"nw\">· '", "'\\u00a0<span class=\"nw\">· '", 5),
]
for i, (a, b, k) in enumerate(E, 1):
    n = s.count(a)
    if n != k: sys.exit(f'edit {i}: found {n} times (wanted {k}): {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
