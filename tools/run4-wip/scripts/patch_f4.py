"""Run 4 finish, edit f4: the grandmas, from pass 8's kept marks.
- A long line ("Holidays bring something new here, you'll see.") was one pill about 15 times as wide as tall: capped at a HUD button's height it
  still ran across half an iPad and off the screen's edge. A bubble longer than 22 letters now wraps onto two lines (split at the space nearest
  its middle) and grows upward from above her head; tagFit caps a two-line bubble at the height of two lines.
- Two grandmas on the pond bench take turns; after a jump of the clock (a phone waking up, the check's tests) the next one could start while the
  first one's bubble was still up, one on top of the other. A grandma who starts talking ends the bubble of any grandma within 3 m.
- A grandma whose path runs through the camera (the pavement by the Flower Corner gate, where a new game starts) filled a third of the screen:
  like the friends and passers-by she is not drawn for the moment she is within 0.6 m of the camera (her place stays the same for everyone)."""
import sys
P = '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = []
def ed(old, new, c=1): E.append((old, new, c))

ed(r"""function spriteOf(c,h){""",
   r"""/* 💬 a two-line bubble: the same pill style, rounder corners; lines centred by their inked pixels like textCanvas (run 4 finish) */
function textCanvas2(lines,o={}){const size=o.size||44,pad=o.pad??20,bw=o.bw??6,lh=size*1.18,c=document.createElement('canvas'),x=c.getContext('2d'),f=`800 ${size}px ${FONT}`;x.font=f;
  const inks=lines.map(t=>inkOf(t,f,'middle')),tw=Math.max(4,...inks.map(k=>Math.ceil(k.w)));c.width=tw+pad*2+bw*2;c.height=Math.ceil(lh*lines.length+size*.36)+bw*2;
  x.font=f;x.textAlign='left';x.textBaseline='middle';x.fillStyle=o.bg||'#fff7fb';rr(x,bw/2,bw/2,c.width-bw,c.height-bw,size*.62);x.fill();if(bw){x.lineWidth=bw;x.strokeStyle=o.border||'#3d2c5e';x.stroke();}
  x.fillStyle=o.fg||'#3d2c5e';lines.forEach((t,i)=>x.fillText(t,c.width/2-inks[i].cx,bw+size*.18+lh*(i+.5)+size*.07));return c;}
function spriteOf(c,h){""")
ed(r"""  const nat=u.h0*innerHeight/(2*d*Math.tan((cam.fov||70)*Math.PI/360)),mx=clamp(Math.min(innerWidth,innerHeight)*.065,26,48),k=nat>mx?mx/nat:1;""",
   r"""  const nat=u.h0*innerHeight/(2*d*Math.tan((cam.fov||70)*Math.PI/360)),mx=clamp(Math.min(innerWidth,innerHeight)*.065,26,48)*(u.lines||1),k=nat>mx?mx/nat:1;""")
ed(r"""function granBubble(q,txt){granBubOff(q);const b=label(txt,.38);b.position.y=q.sitting?2.1:2.32;b.material.depthTest=false;b.renderOrder=30;""",
   r"""function granBubble(q,txt){granBubOff(q);for(const o of GRAN.g)if(o!==q&&o.bub&&Math.hypot(o.x-q.x,o.z-q.z)<3)granBubOff(o);   /* (run 4 finish: one speaker at a time on the pond bench, also after a jump of the clock) */
  let b;if(txt.length>22){const sp=[...txt].map((ch,i)=>ch===' '?i:-1).filter(i=>i>0);const m=sp.reduce((a,i)=>Math.abs(i-txt.length/2)<Math.abs(a-txt.length/2)?i:a,sp[0]||-1);   /* a long line wraps onto two lines at the space nearest its middle (run 4 finish: one long pill ran off the screen) */
    if(m>0){const c=textCanvas2([txt.slice(0,m),txt.slice(m+1)]);b=spriteOf(c,.38*c.height/(44*1.36+12));b.userData.w0=b.scale.x;b.userData.h0=b.scale.y;b.userData.lines=b.scale.y/.38;b.onBeforeRender=tagFit;b.center.set(.5,0);}}
  if(!b){b=label(txt,.38);}b.position.y=(q.sitting?2.1:2.32)-(b.center.y===0?.19:0);b.material.depthTest=false;b.renderOrder=30;""")
ed(r"""const near=Math.hypot(ps.x-cam.x,ps.z-cam.z),shot=ptInShot(ps.x,ps.z),vis=out&&near<48&&!shot;""",
   r"""const near=Math.hypot(ps.x-cam.x,ps.z-cam.z),shot=ptInShot(ps.x,ps.z),vis=out&&near<48&&near>.6&&!shot;   /* (run 4 finish: not drawn for the moment she walks through the camera, like a friend or a passer-by) */""")

bad = 0
for old, new, c in E:
    n = s.count(old)
    if n != c: print('COUNT', n, '!=', c, ':', old[:120]); bad += 1
if bad: sys.exit(1)
for old, new, c in E: s = s.replace(old, new)
open(P, 'w', encoding='utf-8').write(s)
print('applied', len(E), 'edits')
