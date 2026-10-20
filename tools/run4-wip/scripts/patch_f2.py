"""Run 4 finish, edit f2: the dance-off's four arrow buttons get the same 18 px corners as every other button (C5, "the same kind of button looks the
same everywhere": they had 20 px since job 17; the stage-2 rerun of C5 counted only the crawl's screens, so the full check of 20 Oct on the live game
was the first to see them)."""
import sys
P = '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
old = "#dnBtns .btn{width:66px;height:66px;min-height:66px;padding:0;display:flex;align-items:center;justify-content:center;border-radius:20px}"
new = "#dnBtns .btn{width:66px;height:66px;min-height:66px;padding:0;display:flex;align-items:center;justify-content:center}"
if s.count(old) != 1: sys.exit(f'COUNT {s.count(old)} != 1')
s = s.replace(old, new); open(P, 'w', encoding='utf-8').write(s); print('applied 1 edit')
