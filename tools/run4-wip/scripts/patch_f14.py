"""Run 4 finish, f14: pass 17's kept marks. Each edit must match exactly once.
usage: python3 patch_f14.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. October: the bus shelter's two cobwebs hang in its front corners, under the roof, from the post to the side glass (they stood up through
 #    the roof: a white zig-zag on top of it)
 (r"""[-14.5,2.3,7.45,.8,.8,0],[-17.9,2.3,7.45,.8,.8,0]];""",
  r"""[-14.8,1.65,7.05,.7,.7,Math.PI],[-17.6,1.65,7.05,.7,.7,0]];   /* (run 4 finish: the bus shelter's two webs hang in its front corners under the roof: they stood up through the roof, a white zig-zag on it) */"""),
 # 2. the bench by the lake faces the water (it faced along the shore, side-on to the lake, seen from the town its seat looked at the grass)
 (r"""bench(st,59.8,64.6,Math.PI*.75);colC(L,59.8,64.6,.7);""",
  r"""bench(st,59.8,64.6,Math.atan2(9.2,4.4));colC(L,59.8,64.6,.7);   /* (run 4 finish: the bench faces the water; it faced along the shore) */"""),
 # 3. dark theme: a furniture picture gets a thin light edge, so a dark piece (the Midnight cat tree) stands out from the dark purple tile
 (r""".ni .nimg{width:58px;height:58px;object-fit:contain}""",
  r""".ni .nimg{width:58px;height:58px;object-fit:contain}:root[data-theme="dark"] .nimg,:root[data-theme="dark"] img[data-th],:root[data-theme="dark"] img.fth{filter:drop-shadow(0 0 1.5px rgba(255,241,248,.8))}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .nimg,:root:not([data-theme="light"]) img[data-th],:root:not([data-theme="light"]) img.fth{filter:drop-shadow(0 0 1.5px rgba(255,241,248,.8))}}   /* (run 4 finish: in the dark theme a furniture picture has a thin light edge: the Midnight cat tree, dark navy, was lost on the dark purple tile) */"""),
 (r"""<img src="${img}" alt="" style="width:110px;height:110px;object-fit:contain">""",
  r"""<img class="fth" src="${img}" alt="" style="width:110px;height:110px;object-fit:contain">"""),
 # 4. a shopper stops a step before you when you stand on its way and, after a moment, goes back, like a passer-by in town (it walked on to
 #    0.9 m and waited there as long as you stood still: at the shop's door a face filled a third of the view)
 (r"""else if(here&&Math.hypot(P.x-this.x,P.z-this.z)<.9)this.moving=false;""",
  r"""else if(here&&wkBlocked(this,dx/d,dz/d)){this.moving=false;this.pb=(this.pb||0)+dt;if(this.pb>1.6){this.pb=0;this.next=this.i;}}   /* (run 4 finish: like a passer-by, a step before you and then back the other way; a shopper waited 0.9 m from the camera at the shop's door) */"""),
 # 5. a bubble or name tag drawn over everything is drawn over everything only near (within 10 m) and while it can be read: further, or too
 #    small (it fades), a wall in front of its speaker hides it (a far grandma's tiny bubble floated over the bus shelter, she stood behind it)
 (r"""this.material.opacity=Math.min(d<1.4?clamp((d-.95)/.45,0,1):1,clamp((nat/(u.lines||1)-11)/4,0,1));}""",
  r"""const ln=nat/(u.lines||1);this.material.opacity=Math.min(d<1.4?clamp((d-.95)/.45,0,1):1,clamp((ln-11)/4,0,1));
  if(u.top===undefined)u.top=!this.material.depthTest;if(u.top)this.material.depthTest=d>10||ln<15;}   /* (run 4 finish: one drawn over everything, a grandma's bubble or a photo family's tag, is so only within 10 m and while it can be read: further, a wall in front hides it; a far grandma's bubble floated over the bus shelter, she stood behind it) */"""),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
