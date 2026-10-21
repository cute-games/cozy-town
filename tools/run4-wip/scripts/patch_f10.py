"""Run 4 finish, f10: pass 13's kept marks. Each edit must match exactly once.
usage: python3 patch_f10.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
G = "   /* (run 4 finish: in two pieces, either side of the park's bus shelter: it ran along the shelter's back, its string through the roof's rim) */"
E = [
 # 1. the clock chip's rain and snow show once the rain or snow can be seen (the streaks fade in from 0.3 to 1; the chip turned at 0.3, with nothing falling yet)
 ("WX.rain>.3?'🌧️':WX.snow>.3?'🌨️':WX.sky>.5?(n?'🌙':'☁️'):n?'🌙':'☀️'",
  "WX.rain>.55?'🌧️':WX.snow>.55?'🌨️':WX.sky>.5?(n?'🌙':'☁️'):n?'🌙':'☀️'"),
 # 2. the park's holiday garland by the bus shelter hangs in two pieces, either side of it (the shelter came in run 4; the garland ran along its back)
 ("garland(st,-19.8,1.9,8.3,-8.3,8.3,[PK,RD,'#ffffff']);HOL.n+=2;",
  "garland(st,-19.8,1.9,8.3,-18.6,8.3,[PK,RD,'#ffffff']);garland(st,-13.8,1.9,8.3,-8.3,8.3,[PK,RD,'#ffffff']);HOL.n+=3;" + G),
 ("garland(st,-19.8,1.9,8.3,-8.3,8.3,OP);garland(st,-84.6,3.7,-4.45,-84.6,4.45,OP);garland(st,-37.8,3.9,19.85,-37.8,24.15,OP);HOL.n+=4;",
  "garland(st,-19.8,1.9,8.3,-18.6,8.3,OP);garland(st,-13.8,1.9,8.3,-8.3,8.3,OP);garland(st,-84.6,3.7,-4.45,-84.6,4.45,OP);garland(st,-37.8,3.9,19.85,-37.8,24.15,OP);HOL.n+=5;" + G),
 ("garland(st,-19.8,1.9,8.3,-8.3,8.3,['#ff4d6d','#5fd4b0','#ffd45c']);HOL.n+=2;}",
  "garland(st,-19.8,1.9,8.3,-18.6,8.3,['#ff4d6d','#5fd4b0','#ffd45c']);garland(st,-13.8,1.9,8.3,-8.3,8.3,['#ff4d6d','#5fd4b0','#ffd45c']);HOL.n+=3;}" + G),
 ("garland(st,-19.8,1.9,8.3,-8.3,8.3,PC);garland(st,-84.6,3.7,-4.45,-84.6,4.45,PC);HOL.n+=3;",
  "garland(st,-19.8,1.9,8.3,-18.6,8.3,PC);garland(st,-13.8,1.9,8.3,-8.3,8.3,PC);garland(st,-84.6,3.7,-4.45,-84.6,4.45,PC);HOL.n+=4;" + G),
 # 3. a photo shoot ends when its result card goes, however it goes (opening the phone or the bag over the card left the shoot on: the map, the notepad
 #    and the job box stayed hidden and only the shoot's own buttons worked, until you left town)
 ("{bottom:true,lock:true,cls:'ptres'});", "{bottom:true,lock:true,cls:'ptres'});PHO.res=1;"),
 ("ACT.ptbye=()=>{closePanel();ptClear();", "ACT.ptbye=()=>{if(document.querySelector('#card [data-a=\"ptbye\"]'))closePanel();ptClear();"),
 ("PHO.group=[];PHO.on=0;", "PHO.group=[];PHO.on=0;PHO.res=0;"),
 ("function ptTick(dt){const d=pt();ptInters();",
  "function ptTick(dt){const d=pt();ptInters();if(PHO.on&&PHO.res&&!(UI.open&&document.querySelector('#card [data-a=\"ptbye\"]'))){ACT.ptbye();return;}   /* 📸 the result card went another way (the phone or the bag opened over it): the shoot ends as with Bye (run 4 finish: it stayed on, the map and the notepad hidden) */"),
 # 4. "Snack time" never asks you to eat raw flour or eggs, and a shopping spree's "treats" are not flour or eggs (new days only: an old day's quests stay)
 ("const qCheap=k=>{const p=k.split(':'),a=p[1];if(p[0]==='buy'){",
  "const RAWF=['flour','eggs'];   /* 🥚 for cooking, not for snacking (run 4 finish: \"Snack time: Eat some flour\") */\nconst qCheap=k=>{const p=k.split(':'),a=p[1];if(p[0]==='eat'&&RAWF.includes(a)||p[0]==='trk'&&a==='spree'&&(p[2]||'').split('|').some(x=>RAWF.includes(x)))return false;if(p[0]==='buy'){"),
 # 5. the Pet Shop's owl stays on its perch (it walked the whole pen at perch height, in the air) and faces the room when it stops
 ("pen('owl',['owl'],-3.1,-.5,1.9,4.9,'#9a6a43',{y:.95});", "pen('owl',['owl'],-3.1,-.5,1.9,4.9,'#9a6a43',{y:.95,pz:3.4});"),
 ("o.y?{y:o.y}:{},o.swim?{swim:1}:{}));};", "o.y?{y:o.y}:{},o.pz!==undefined?{pz:Z+o.pz}:{},o.swim?{swim:1}:{}));};   /* (run 4 finish: pz: the line of the perch a bird keeps to) */"),
 ("z:L.oz+rand(pen.z0,pen.z1-(pen.y?0:.45)),tx:0", "z:pen.pz!==undefined?L.oz+pen.pz:L.oz+rand(pen.z0,pen.z1-(pen.y?0:.45)),tx:0"),
 ("a.z=L.oz+rand(pen.z0,pen.z1-(pen.y?0:.45));}a.tx=a.x;", "a.z=pen.pz!==undefined?L.oz+pen.pz:L.oz+rand(pen.z0,pen.z1-(pen.y?0:.45));}a.tx=a.x;"),
 ("a.tz=L.oz+rand(a.pen.z0,a.pen.z1-fr);", "a.tz=a.pen.pz!==undefined?L.oz+a.pen.pz:L.oz+rand(a.pen.z0,a.pen.z1-fr);"),
 ("a.m.root.position.set(a.x,(a.pen.y||0)-(a.pen.swim?.12:0),a.z);",
  "if(a.pen.pz!==undefined&&!a.moving)a.face=Math.PI;   /* 🦉 a perched owl faces the room (run 4 finish: it walked the pen in the air and stopped facing the wall) */a.m.root.position.set(a.x,(a.pen.y||0)-(a.pen.swim?.12:0),a.z);"),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
