"""Run 4 finish, f12: pass 15's kept marks. Each edit must match exactly once.
usage: python3 patch_f12.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. a quest's steps: a long step wraps under its own words, not under the ○ (no hanging indent: "Cream Shop" started under the ring), and the
 #    shop's name keeps together ("Ice / Cream Shop" was split over two lines)
 (r""".qsteps li.ok{color:#2f9a77}""",
  r""".qsteps li.ok{color:#2f9a77}.qsteps li{display:flex;gap:.3em}.qsteps li>i{flex:none;font-style:normal}   /* (run 4 finish: a long step wraps under its words, not under the ○) */"""),
 (r"""<li class="${ok?'ok':''}">${ok?'✔':'○'} ${esc(sp.d)}${sp.n>1&&!ok&&st?' ('+Math.floor(c)+'/'+sp.n+')':''}</li>""",
  r"""<li class="${ok?'ok':''}"><i>${ok?'✔':'○'}</i><span>${esc(sp.d).replace(/ at the (.+)$/,(m,a)=>' at the '+a.replace(/ /g,'\u00a0'))}${sp.n>1&&!ok&&st?' ('+Math.floor(c)+'/'+sp.n+')':''}</span></li>"""),
 # 2. the photo frame on a touch screen held sideways keeps to the middle of the view: its left edge moved off the joystick and its right edge
 #    stayed, so its middle was 70 px right of the camera's: a family you face stood left of the frame's middle, in the photo too
 (r"""@media (orientation:landscape) and (pointer:coarse){#ptvf{left:calc(env(safe-area-inset-left,0px) + 186px)}}""",
  r"""@media (orientation:landscape) and (pointer:coarse){#ptvf{left:calc(env(safe-area-inset-left,0px) + 186px);right:calc(env(safe-area-inset-right,0px) + 186px)}}   /* (run 4 finish: the frame keeps to the middle of the view, the same space on both sides: whom you face is in the middle of the photo) */"""),
 # 3. the clock chip under a grey night sky: ☁️, as by day (it showed 🌙 while the clouds hid the moon and the stars)
 (r"""WX.sky>.5?(n?'🌙':'☁️'):n?'🌙':'☀️'""",
  r"""WX.sky>.5?'☁️':n?'🌙':'☀️'"""),
 # 4. the path through the Tree Park's gate in town ends round (it stopped in a straight edge in the grass a few steps past the gate)
 (r"""flat(st,6,2.4,'#d9b98a',GX+3,.044,GZ);   /* (the path goes on through the gate: run 4, stage 3) */""",
  r"""flat(st,6,2.4,'#d9b98a',GX+3,.044,GZ);disc(st,1.2,'#d9b98a',GX+6,.043,GZ);   /* (the path goes on through the gate: run 4, stage 3; its far end is round: run 4 finish, it stopped in a straight edge) */"""),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
