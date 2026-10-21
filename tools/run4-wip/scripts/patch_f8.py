"""Run 4 finish, f8: pass 11's kept marks. Each edit must match exactly once.
usage: python3 patch_f8.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. a grandma's step round you keeps up on any screen (it followed the drawn frames: on a slow screen it lagged and she passed 1.5 m from the camera) and keeps 2.4 m, like a passer-by
 ("while she passes she is drawn a step to the side of her way, at least 2.1 m from you, and keeps that step while she stands.",
  "while she passes she is drawn a step to the side of her way, at least 2.4 m from you, and keeps that step while she stands."),
 ("const u=a/4.5;if(Math.abs(u)<1){const need=2.1*(1-u*u)*(1-u*u);", "const u=a/5;if(Math.abs(u)<1){const need=2.4*(1-u*u)*(1-u*u);"),
 ("(a smooth step aside, from 4.5 m before you to 4.5 m past you: at most 0.8 m/s sideways)", "(a smooth step aside, from 5 m before you to 5 m past you: at most 0.85 m/s sideways)"),
 ("const k=Math.min(1,dt*5);q.ox=(q.ox||0)+(fz*t-(q.ox||0))*k;q.oz=(q.oz||0)+(-fx*t-(q.oz||0))*k;}",
  "const k=Math.min(1,Math.max(dt,Math.min(.5,(ms-(q.lms||ms))/1000))*6);q.ox=(q.ox||0)+(fz*t-(q.ox||0))*k;q.oz=(q.oz||0)+(-fx*t-(q.oz||0))*k;}   /* (by the clock, not by drawn frames: run 4 finish, on a slow screen the step lagged and she passed 1.5 m from the camera) */"),
 ("const gx=ps.x+(q.ox||0),gz=ps.z+(q.oz||0);q.target.x=gx;q.target.z=gz;", "const gx=ps.x+(q.ox||0),gz=ps.z+(q.oz||0);q.target.x=gx;q.target.z=gz;q.lms=ms;"),
 # 2. the big map: friends' names show again (with the air round a name, every side touched the friend's own dot, so no name was drawn since stage 3)
 ("for(const [f,fx,fy,r] of fl){const tw=x.measureText(f.n).width/2;", "for(const [f,fx,fy,r,own] of fl){const tw=x.measureText(f.n).width/2,tk=taken.filter(o=>o!==own);   /* (run 4 finish: not tested against its own dot: with the air round it every side touched the dot, so no friend's name was drawn since stage 3) */"),
 ("if(hit([q[0]-7*dpr,q[1]-2*dpr,q[2]+7*dpr,q[3]+2*dpr],taken))continue;", "if(hit([q[0]-7*dpr,q[1]-2*dpr,q[2]+7*dpr,q[3]+2*dpr],tk))continue;"),
 # 3. the big map: a place's name a friend's dot lies on is drawn again over the dot (Rosie's dot hid the S of "Spooky path")
 ("x.lineWidth=1.2*dpr;x.strokeStyle=P2.ink;x.beginPath();x.arc(fx,fy,r+1.6*dpr,0,TAU);x.stroke();}",
  "x.lineWidth=1.2*dpr;x.strokeStyle=P2.ink;x.beginPath();x.arc(fx,fy,r+1.6*dpr,0,TAU);x.stroke();}\n  for(const o of vis)if(o.l&&hit(o.l,fl.map(q=>q[4])))name(o);   /* a place's name a friend's dot lies on is drawn again over the dot (run 4 finish: Rosie's dot hid the S of \"Spooky path\") */"),
 # 4. the What's new book: its page dots stay in the middle on every page (on the last page the wider "Let's play!" pushed them 21 px to the left)
 ("#book .bk-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:16px}",
  "#book .bk-foot{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;margin-top:16px}#book .bk-foot>#bkPrev{justify-self:start}#book .bk-foot>#bkNext{justify-self:end}"),
 # 5. a message that waited for its turn is dropped when the game clock has jumped since (the football friends' "until 19:00" showed at 22:10)
 ("news:!ev&&now-TQ.card>100,", "news:!ev&&now-TQ.card>100,gd:S?S.day:-1,gt:S?S.time:0,"),
 ("if(!m.keep&&now-m.at>T_OLD||toastGone(m,now)){i--;continue;}",
  "if(!m.keep&&now-m.at>T_OLD||toastGone(m,now)||!m.keep&&S&&m.gd>=0&&(S.day!==m.gd||Math.abs(S.time-m.gt)>.5)){i--;continue;}   /* (run 4 finish: or the game clock has jumped since: the football friends' \"until 19:00\" showed at 22:10) */"),
 # 6. a big card on a tall screen: a message goes up in the top row, left of the round buttons, before it would lie on them (the "online" message hid the chat and phone buttons over the map)
 ("for(const x1 of[W-8,a?a.left-8:0]){const s2=narrow(x0,x1,()=>[[(x0+x1)/2,hb]]);if(s2){s=s2;break;}}}",
  "for(const x1 of[W-8,a?a.left-8:0]){const s2=narrow(x0,x1,()=>[[(x0+x1)/2,hb]]);if(s2){s=s2;break;}}}\n  if(c&&s&&!s.free){const tb=boxOf($('topbtns'));if(tb&&tb.left>200){const s2=narrow(8,tb.left-8,()=>[[tb.left/2,sT+8]]);if(s2)s=s2;}}   /* a big card on a tall screen: up in the top row, left of the round buttons (run 4 finish: the \"online\" message lay on the chat and phone buttons over the map) */"),
 # 7. New Year's fireworks: bigger, brighter bursts of more sparks (they read as a pale spray of dots)
 ("const B=6,N=90,", "const B=6,N=130,"),
 ("gl_PointSize=clamp(360.0/max(1.0,-mv.z),2.5,9.0)*pr*(1.0-.5*age);", "gl_PointSize=clamp(820.0/max(1.0,-mv.z),4.0,16.0)*pr*(1.0-.45*age);"),
 ("gl_FragColor=vec4(vc+.35*(1.0-d*4.0),va*.95);", "gl_FragColor=vec4(vc+.25*(1.0-d*4.0),va);"),
 ("va=1.0-age*age;vec4 mv=", "va=(1.0-age*age*age*age)*smoothstep(0.0,.16,age);vec4 mv="),
 ("transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false});\n  const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.visible=false;scene.add(pts);FW.m=pts;}",
  "transparent:true,depthWrite:false,fog:false});\n  const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.visible=false;scene.add(pts);FW.m=pts;}   /* (run 4 finish: plain blending: sparks lying on each other keep their colour; added up they made a young burst a white blob) */"),   # (the sparks fade in over the first moment, so a fresh burst is not a white blob, and stay bright longer)
 # 8. the photographer's stars: the background asked for has to be in the photo for every background (only the school sign had a point to check; the others always counted as in)
 ("function ptBgIn(B,F){if(!B||!B.at)return true;const v=new THREE.Vector3(B.at[0],B.at[1],B.at[2]).project(camera);",
  "function ptBgIn(B,F){const at=B&&(B.at||(B.g?[B.g[0]-Math.sin(B.face||0)*2,1,B.g[1]-Math.cos(B.face||0)*2]:null));if(!at)return true;const v=new THREE.Vector3(at[0],at[1],at[2]).project(camera);   /* (run 4 finish: a background with no point of its own: 2 m behind where the group stands, 1 m up; only the school sign had one, so the bench was \"in\" a photo of a blue wall) */"),
 # 9. the Pet Show judges step out of a photo shoot like anyone else (two sat right beside the camera, cut by the screen's edge, at the stage background)
 ("for(const j of PSX.judges){const p=j.p,a=p.arms[1];p.root.visible=on;if(!on)continue;",
  "for(const j of PSX.judges){const p=j.p,a=p.arms[1];p.root.visible=on&&!(PHO.on&&ptInShot(p.root.position.x,p.root.position.z));if(!on)continue;   /* (run 4 finish: they step out of a photo shoot like anyone else: two sat right beside the camera at the stage background) */"),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
