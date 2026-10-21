"""Run 4 finish, f17: pass 20's kept marks. Each edit must match exactly once.
usage: python3 patch_f17.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. the photo in the phone's chat (N25): since f16 the thank-you card shows the sharp copy, so the phone's small copy was first decoded
 #    when the phone opened and had no size at that moment; it is decoded at the snap now, as when the card showed it
 (r"""S.ptPics=(S.ptPics||[]).filter(p=>p&&p.id);S.ptPics.push({id:o.id,u:pic});""",
  r"""S.ptPics=(S.ptPics||[]).filter(p=>p&&p.id);S.ptPics.push({id:o.id,u:pic});if(pic){PT_DEC=new Image();PT_DEC.src=pic;}   /* (run 4 finish: the phone's copy decoded now, ready when the phone opens: the card shows the sharp one) */"""),
 (r"""function ptImg(id){""",
  r"""let PT_DEC=null;
function ptImg(id){"""),
 # 2. a speech bubble also stays below the top row (the coins, food and clock chips and the top buttons): on a sideways phone a grandma's
 #    bubble by the pond ran under the clock chip and the buttons ("ducks is the ... of my day."); it moves down at most its own height
 (r"""function bubDodge(s,cam){s.center.x=.5;if(s.material.opacity<=0)return;const R=hudRects();""",
  r"""function bubDodge(s,cam){const u=s.userData;if(u.cy0===undefined)u.cy0=s.center.y;s.center.x=.5;s.center.y=u.cy0;if(s.material.opacity<=0)return;const R=hudRects();"""),
 (r"""  const W=innerWidth,H=innerHeight,f=H/(2*Math.tan(cam.fov*Math.PI/360)),h=s.scale.y*f/z,w=s.scale.x*f/z,x=(_hv.x+1)/2*W,y=(1-_hv.y)/2*H,t=y-h*(1-s.center.y),bt=y+h*s.center.y;
  let lo=6,hi=W-6;""",
  r"""  const W=innerWidth,H=innerHeight,f=H/(2*Math.tan(cam.fov*Math.PI/360)),h=s.scale.y*f/z,w=s.scale.x*f/z,x=(_hv.x+1)/2*W,y=(1-_hv.y)/2*H;let t=y-h*(1-s.center.y),bt=y+h*s.center.y;
  for(const b of R)if(b.left<-1e3&&t<b.bottom+4){const dn=Math.min(h,b.bottom+4-t);s.center.y=u.cy0+dn/h;t+=dn;bt+=dn;}   /* (run 4 finish: below the top row too: on a sideways phone a bubble ran under the clock chip and the buttons) */
  let lo=6,hi=W-6;"""),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
