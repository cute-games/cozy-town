"""Run 4 finish, f15: pass 18's kept marks. Each edit must match exactly once.
usage: python3 patch_f15.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. a cooking quest says "Cook a cheese sandwich", "Cook some pancakes" (it said "Cook cheese sandwich on your stove"), like the other quests
 (r"""d:'Cook '+I.n.toLowerCase()+' on your stove'""",
  r"""d:'Cook '+aAn(I.n)+' on your stove'"""),
 (r"""{d:'Cook '+I.n.toLowerCase(),ev:'cook:'+arg,n:1}""",
  r"""{d:'Cook '+aAn(I.n),ev:'cook:'+arg,n:1}"""),
 (r"""['fries','noodles','dumplings'].forEach(n=>SOME.add(n));""",
  r"""['fries','noodles','dumplings','chocolate cookies','hot chocolate'].forEach(n=>SOME.add(n));   /* (run 4 finish: the recipes cooked in a quest: "Cook some chocolate cookies") */"""),
 # 2. a shop's "New in!" row never shows one piece twice in two colours a child cannot tell apart on its little picture ("Grape" and "Violet"
 #    dog houses looked like one item twice)
 (r"""const colName=c=>{const f=NEWCOLS.find(x=>x[0]===c);return f?f[1]:'Special';};""",
  r"""const colName=c=>{const f=NEWCOLS.find(x=>x[0]===c);return f?f[1]:'Special';};
const colNear=(a,b)=>{if(a===b)return true;const h=c=>/^#[0-9a-f]{6}$/i.test(c)?[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)):null,p=h(a),q=h(b);return!!p&&!!q&&Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])<90;};   /* two colours that look the same on a little picture (run 4 finish: "Grape" and "Violet") */"""),
 (r"""if(it&&!(avoid||[]).some(a=>a&&a.k===it.k&&a.c===it.c))return it;}""",
  r"""if(it&&!(avoid||[]).some(a=>a&&a.k===it.k&&colNear(a.c,it.c)))return it;}"""),
 # 3. a design client whose building's name says where it is says no "near" too ("the Apartments behind the Pet Shop, flat 11, near the Pet Shop")
 (r"""const W=dsWho(o),np=H.id==='nb'?null:nearPlace(H);""",
  r"""const W=dsWho(o),np=/ (by|behind) the /.test(H.n)?null:nearPlace(H);   /* (run 4 finish: a name that says where it is gets no "near": "the Apartments behind the Pet Shop, flat 11, near the Pet Shop") */"""),
 # 4. a photo shoot's start spot: a grandma steps out of a shoot, so she is not in the way of the camera's search (at the fountain her park stop
 #    is where the family stands: every spot failed and the camera stayed where it was, the feet out of the frame); and when no spot has a clear
 #    view, the nearest spot where everyone fits
 (r"""p.root.visible=false;L.g.add(p.root);""",
  r"""p.root.visible=false;p.root.userData.aside=1;L.g.add(p.root);"""),
 (r"""function ptSolid(o,own){for(let q=o;q;q=q.parent){if(q===own)return false;if(q.visible===false)return false;}""",
  r"""function ptSolid(o,own){for(let q=o;q;q=q.parent){if(q===own)return false;if(q.visible===false||q.userData.aside)return false;}   /* (run 4 finish: nor a grandma, who steps out of a shoot) */"""),
 (r"""for(let d=3.4;d<8.05;d+=.3)for(const da of[0,.2,-.2,.4,-.4]){""",
  r"""let fb=null;for(let d=3.4;d<8.05;d+=.3)for(const da of[0,.2,-.2,.4,-.4]){"""),
 (r"""if(ptFits(F)&&ptBgIn(B,F)&&ptView(g))return true;}""",
  r"""if(ptFits(F)&&ptBgIn(B,F)){if(ptView(g))return true;if(!fb)fb=[P.x,P.z,P.yaw,P.pitch];}}"""),
 (r"""  [P.x,P.z,P.yaw,P.pitch]=keep;updateCamera(0);camera.updateMatrixWorld();return false;}""",
  r"""  if(fb){[P.x,P.z,P.yaw,P.pitch]=fb;updateCamera(0);camera.updateMatrixWorld();return true;}   /* (run 4 finish: no spot with a clear view: the nearest where everyone fits; the camera stayed where you stood and the feet were out of the frame) */
  [P.x,P.z,P.yaw,P.pitch]=keep;updateCamera(0);camera.updateMatrixWorld();return false;}"""),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
