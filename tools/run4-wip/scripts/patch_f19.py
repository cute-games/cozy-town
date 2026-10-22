"""Run 4 finish, f19: the full final pass's (pass 23) marks above minor. Each edit must match exactly once.
usage: python3 patch_f19.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. a two-room designer order: room 2 drew room 1's furniture (dsRoomSetup always laid out o.items, room 1's list), and after a trip back
 #    to room 1 your pieces in room 2 were gone from view; each room now shows its own list (dsItems(), as placing and the check use)
 (r"""for(const u of[...CL_ITEMS.keys()])removeClItem(u);for(const it of o.items)addClItem(it);}""",
  r"""for(const u of[...CL_ITEMS.keys()])removeClItem(u);for(const it of dsItems())addClItem(it);}   /* (run 4 finish: each room its own furniture: room 2 showed room 1's) */"""),
 # 2. a speech bubble whose speaker is itself under the map and notepad column (or off the screen's edge) slides fully clear of it: on an
 #    upright phone that column is a third of the width, and a bubble held over its speaker stayed half under it ("...s the ...ay.")
 (r"""if(b.left<x)lo=Math.max(lo,b.right+6);else hi=Math.min(hi,b.left-6);""",
  r"""if(b.left+b.right<W)lo=Math.max(lo,b.right+6);else hi=Math.min(hi,b.left-6);"""),   # (a rect is on the left or the right by the half of the screen it is in: a speaker off the left edge had the whole map column on its right)
 (r"""s.center.x=clamp(cx,.05,.95);}""",
  r"""s.center.x=x<lo||x>hi?cx:clamp(cx,.05,.95);}   /* (run 4 finish: a speaker under the HUD column or off the edge: the bubble clears it all, readable) */"""),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
