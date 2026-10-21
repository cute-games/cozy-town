"""Run 4 finish, f20: pass 24's kept mark (the re-check of f19). Each edit must match exactly once.
usage: python3 patch_f20.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. a speech bubble that slides clear of the HUD column (f19) and is wider than the space beside it is drawn smaller to fit: on an upright
 #    phone the Flower Corner grandma's bubble ran past the screen's right edge ("Such" cut). tagFit sets the size again whenever u.k changes,
 #    so the smaller size is set anew each frame (u.k reset)
 (r"""let cx=.5;if(x-w/2<lo)cx=(x-lo)/w;else if(x+w/2>hi)cx=1-(hi-x)/w;s.center.x=x<lo||x>hi?cx:clamp(cx,.05,.95);}""",
  r"""let cx=.5;if(x-w/2<lo)cx=(x-lo)/w;else if(x+w/2>hi)cx=1-(hi-x)/w;const fr=x<lo||x>hi;
  if(fr&&w>hi-lo&&hi-lo>40){const k=(hi-lo)/w;s.scale.x*=k;s.scale.y*=k;u.k=-1;s.updateMatrix();if(s.parent)s.matrixWorld.multiplyMatrices(s.parent.matrixWorld,s.matrix);cx=x<lo?(x-lo)/(hi-lo):1-(hi-x)/(hi-lo);}   /* (run 4 finish: wider than the space beside the column: drawn smaller to fit; a bubble ran past the screen's edge) */
  s.center.x=fr?cx:clamp(cx,.05,.95);}"""),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
