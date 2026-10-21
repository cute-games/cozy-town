"""Run 4 finish, f9: pass 12's kept marks. Each edit must match exactly once.
usage: python3 patch_f9.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. the What's new book: on a narrow phone the last page's "Let's play!" no longer lies on the page dots (f8's three even columns were narrower than the button)
 ("#book .bk-foot{display:grid;grid-template-columns:1fr auto 1fr;",
  "#book .bk-foot{display:grid;grid-template-columns:minmax(max-content,1fr) auto minmax(max-content,1fr);"),
 # 2. a car is one box, like the bus: your eyes stay 30 cm from its body and half a metre from its cabin (from 15 cm, under the roof edge at eye height, the view was one flat colour with a dark band)
 ("for(const c of CARS){if(c.away)continue;const fx=Math.sin(c.yaw),fz=Math.cos(c.yaw);s.push({cx:c.x+fx*.85,cz:c.z+fz*.85,cr:.95},{cx:c.x-fx*.85,cz:c.z-fz*.85,cr:.95});}",
  "for(const c of CARS){if(c.away)continue;s.push({ob:1,cx:c.x,cz:c.z,ux:Math.sin(c.yaw),uz:Math.cos(c.yaw),hl:1.78,hw:.95});}   /* 🚗 one box round each car, like the bus: your eyes stay 30 cm from its body and half a metre from its cabin (run 4 finish: its two round ends let you come 15 cm from the cabin's side, just under the roof at eye height, and the view was one flat colour with a dark band) */"),
 # 3. the phone's screen fades at its foot only while there is more below (with nothing to scroll the fade showed the dark phone through: a muddy band)
 (".ph-screen{-webkit-mask-image:linear-gradient(to bottom,#000 calc(100% - 22px),transparent);mask-image:linear-gradient(to bottom,#000 calc(100% - 22px),transparent)}",
  ".ph-screen.more{-webkit-mask-image:linear-gradient(to bottom,#000 calc(100% - 22px),transparent);mask-image:linear-gradient(to bottom,#000 calc(100% - 22px),transparent)}"),
 ("function cardMore(){try{cardOver();}catch(e){}const c=$('card');if($('panel').hidden)return;",
  "function cardMore(){try{cardOver();}catch(e){}const c=$('card');if($('panel').hidden)return;{const ps=c.querySelector('.ph-screen');if(ps)ps.classList.toggle('more',ps.scrollHeight-ps.clientHeight-ps.scrollTop>4);}   /* the phone's screen fades at its foot only while there is more below (run 4 finish: with nothing to scroll the fade let the dark phone through, a muddy band) */"),
 ("$('card').addEventListener('scroll',cardMore,{passive:true});",
  "$('card').addEventListener('scroll',cardMore,{passive:true});$('card').addEventListener('scroll',e=>{if(e.target!==$('card'))try{cardMore();}catch(_){}},{passive:true,capture:true});"),
 # 4. the bag's "×3" counts read like the names (13 px at three quarters see-through were hard to read, most of all in the dark theme)
 (".it .have{font-size:13px;opacity:.75;min-height:16px}", ".it .have{font-size:14px;font-weight:800;opacity:.9;min-height:16px}"),
 # 5. the dance-off's crouch: the body goes down, the legs slide up into it and the shoes stay on the floor (the legs went down with the body and the shoes sank 13 cm into the dance floor)
 ("function dnPose(p,k,u,t){const s=Math.sin(Math.PI*clamp(u,0,1)),b=p.b;b.rotation.z=0;b.position.y=.03*Math.sin(t*7);p.head.rotation.z=0;",
  "function dnPose(p,k,u,t){const s=Math.sin(Math.PI*clamp(u,0,1)),b=p.b;b.rotation.z=0;b.position.y=.03*Math.sin(t*7);p.head.rotation.z=0;for(const l of p.legs)l.position.y=.62;"),
 ("else if(k===1){b.position.y=-.24*s;p.arms[0].rotation.z=-1.3*s;p.arms[1].rotation.z=1.3*s;p.legs[0].rotation.x=.6*s;p.legs[1].rotation.x=.6*s;}",
  "else if(k===1){const dy=.2*s;b.position.y=-dy;p.arms[0].rotation.z=-1.3*s;p.arms[1].rotation.z=1.3*s;for(const l of p.legs){l.position.y=.62+dy/(b.scale.y||1);l.rotation.x=.6*s;}}   /* (run 4 finish: the legs slide up into the body as it goes down, so the shoes stay on the floor; they went down with it and sank 13 cm into the dance floor) */"),
 # 6. the dance-off on an upright phone in a small room: the view widens when the camera cannot stand 5.6 m back, so a dancer leaning out stays in the picture
 ("const tf=BASEFOV*(PHO.on?PHO.zoom:1)+(P.run&&P.moving?7:0);",
  "const tf=Math.max(BASEFOV*(PHO.on?PHO.zoom:1)+(P.run&&P.moving?7:0),dnFov());"),
 ("/* the view: a step back from the floor; my dancer on the left (the one who asked) or the right */",
  "/* 💃 an upright phone sees a narrow slice: when the room is too small for the view to stand 5.6 m back, it widens until both dancers and their lean fit (run 4 finish: the host's crown and arm went off the edge) */\n"
  "function dnFov(){const D=DANCE;if(!(D.on||D.res)||!D.cam||!D.floor||innerWidth>=innerHeight)return 0;const d=Math.hypot(D.cam.x-D.floor.x,D.cam.z-D.floor.z),a=innerWidth/innerHeight;return Math.min(95,2*Math.atan(1.6/Math.max(1,d)/a)*180/Math.PI);}\n"
  "/* the view: a step back from the floor; my dancer on the left (the one who asked) or the right */"),
 # 7. the owl and the duck wear their outfits on their own bodies (they borrowed the cat's and the bunny's sizes: the owl's cape lay flat out of its back, its backpack hid inside it, its collar hung off its front; the duck's bow tie was inside its chest)
 ("else if(acc==='cape'||acc==='wings'||acc==='bpack'){const B={dog:[.44,.02,.36,.46],cat:[.39,.02,.3,.4],bunny:[.4,-.02,.3,.32],hamster:[.26,0,.22,.24]}[t]||[.4,0,.3,.4],[y,z,w,l]=B,g=new THREE.Group();g.position.set(0,y,z);p.b.add(g);",
  "else if(acc==='cape'||acc==='wings'||acc==='bpack'){const up=p.type==='owl'&&acc!=='wings',B=up?[.31,-.2,.22,.38]:p.type==='duck'?[.41,-.06,.24,.3]:{dog:[.44,.02,.36,.46],cat:[.39,.02,.3,.4],bunny:[.4,-.02,.3,.32],hamster:[.26,0,.22,.24]}[t]||[.4,0,.3,.4],[y,z,w,l]=B,g=new THREE.Group();g.position.set(0,y,z);if(up)g.rotation.x=-Math.PI/2;p.b.add(g);   /* (run 4 finish: the owl stands upright, so its cape and backpack lie on its back standing up; the duck's are sized to its back) */"),
 ("box(g,w+.06,.12,.025,'#ff4d4d',0,-.11,-l/2-.01,{ol:.012});",
  "if(!up)box(g,w+.06,.12,.025,'#ff4d4d',0,-.11,-l/2-.01,{ol:.012});"),
 ("g=new THREE.Group();g.position.set(0,y-.03,z+.06);p.b.add(g);",
  "g=new THREE.Group();g.position.set(0,y-.03,z+.06);if(p.type==='owl')g.position.set(0,.4,.185);else if(p.type==='duck')g.position.set(0,.375,.2);p.b.add(g);"),
 ("nk.position.set(0,y,z);p.b.add(nk);",
  "nk.position.set(0,y,z);{const NB={owl:[.43,.03,1.42],duck:[.405,.14,.83]}[p.type];if(NB){nk.position.set(0,NB[0],NB[1]);nk.scale.set(NB[2],1,NB[2]);}}p.b.add(nk);   /* (run 4 finish: round the owl's and the duck's own necks) */"),
 # 8. a furniture piece's little picture: a glowing piece shows its colour (the seafoam neon sign's tubes came out white)
 ("try{const sc=shotScene(),g=buildFurn(t,c||undefined);sc.add(g);",
  "try{const sc=shotScene(),g=buildFurn(t,c||undefined);sc.add(g);g.traverse(o=>{const m=o.material;if(m&&!Array.isArray(m)&&m.emissive&&m.emissive.getHex()&&m.emissiveIntensity>.3){o.material=m.clone();o.material.emissiveIntensity=m.emissiveIntensity*.35;}});   /* (run 4 finish: in the little picture's light a glowing piece's colour came out white, the seafoam neon sign's tubes; the room's own pieces keep theirs) */"),
 # 9. the pizza tutorial's "Follow the dot" picture: the hand right of the dot points at it
 ("hand(215,60,48);", "em('👈',215,60,48);"),
 # 10. the hairstylist tutorial: a picture's words no longer repeat the line under it
 ("txt('Make the hair like the picture',210,185,19);", "txt('The picture = the new hair',210,185,19);"),
 ("txt('Tap ✅ when it matches',210,185,20);", "txt('A match = stars and coins',210,185,20);"),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
