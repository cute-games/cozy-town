# Run 4, job 2: the same game for everyone (items 27, 26, 25). Exact-match edits for edit.py.
import json
E = []

# --- A. a newer file found while playing: taken by itself at the next calm moment, with a note first ---
E.append(["function updAct(){if(UPD.go)return;const f=UPD.newer;if(f&&!PLAYING&&!UI.open&&!document.body.classList.contains('bookopen')&&navigator.onLine!==false&&performance.now()-UPD.fail>60000&&!updTried(f.id)){updGo(true);return;}updPill();}",
r"""/* ✨ run 4, job 2 (item 27): a newer file found while playing is taken by itself at the next calm moment: never during a card, a scene (a client's visit, a class, the Pet Show,
   the claw machine), the bus, a photo shoot, a dance round, a scare on the spooky path, typing, in bed, decorating, on the stairs or in the character maker. A short
   "✨ Updating Cozy Town…" note shows first (1.4 s), then the game saves and reloads. At most once per new version per session (updTried: the loop guard); after that the button shows */
function updCalm(){return!!(S&&S.intro)&&!UI.open&&!CUT&&!CR&&!TUT&&!DTUT&&!BUS.ride&&!fading&&!CLIMB&&!DECO.on&&!zzIn()&&!kbTyping()&&!$('hud').hidden&&!!CUR&&CUR.id!=='client'&&CUR.id!=='studio'
  &&!(typeof SPOOK!=='undefined'&&(SPOOK.cur||(SPOOK.on&&SPOOK.near&&SPOOK.near())))&&!(typeof PHO!=='undefined'&&PHO&&PHO.on)&&!(typeof DANCE!=='undefined'&&DANCE&&DANCE.on)&&!(typeof TN!=='undefined'&&TN.on)
  &&!(typeof HS!=='undefined'&&HS.cust)&&!(typeof dlCarrying==='function'&&dlCarrying())&&!(typeof KC!=='undefined'&&KC.on);}
function updAct(){if(UPD.go)return;const f=UPD.newer;
  if(f&&navigator.onLine!==false&&performance.now()-UPD.fail>60000&&!updTried(f.id)){
    if(!PLAYING&&!UI.open&&!document.body.classList.contains('bookopen')){updGo(true);return;}
    if(PLAYING&&updCalm()){if(!UPD.note){UPD.note=performance.now();toast('✨ Updating Cozy Town… your game is saved 💾',3.4);}else if(performance.now()-UPD.note>1400){updGo(true);return;}return;}}
  UPD.note=0;updPill();}"""])

# --- B. the version stamp rides along in presence; an older version shows "⏳ older version" by the name ---
E.append(["mv:P.moving?1:0};", "mv:P.moving?1:0,v:COZY_BUILD};   /* v: my version stamp (run 4, job 2): a friend with none or a smaller one shows ⏳ older version */"])
E.append(["  const lk=JSON.stringify(pr.lk||{});if(lk!==a.lk||nm!==a.nm||!a.av){a.lk=lk;a.nm=nm;mpBuildAv(a,cleanLook(pr.lk));",
          "  const lk=JSON.stringify(pr.lk||{}),old=!(Number.isFinite(pr.v)&&pr.v>=COZY_BUILD);if(lk!==a.lk||nm!==a.nm||!a.av||old!==a.old){a.lk=lk;a.nm=nm;a.old=old;mpBuildAv(a,cleanLook(pr.lk));"])
E.append(["function mpBuildAv(a,look){mpDropAv(a);const p=makePerson(lookToPerson(look));bakePerson(p);const tg=label('⭐ '+a.nm,.3);tg.position.y=2.0;p.root.add(tg);p.tag=tg;",
          "function mpBuildAv(a,look){mpDropAv(a);const p=makePerson(lookToPerson(look));bakePerson(p);const txt='⭐ '+a.nm+(a.old?' · ⏳ older version':''),tg=label(txt,.3);tg.userData.txt=txt;tg.position.y=2.0;p.root.add(tg);p.tag=tg;"])
E.append(["""${list.map((a,i)=>`<div class="ph-row"><span>⭐ ${esc(a.nm)}<br><small>${placeOf(a)}</small></span>""",
          """${list.map((a,i)=>`<div class="ph-row"><span>⭐ ${esc(a.nm)}${a.old?' <small>⏳ older version</small>':''}<br><small>${placeOf(a)}</small></span>"""])

# --- C. item 26: the room size goes with the layout (a visitor never has to guess it); spots to the centimetre ---
E.append(["""/* the house layout rides along in presence; Claude rooms cap presence at 4 KiB, so a very full house sends what fits (placed-first items first).
   i = the ground floor (old versions only read this); u = upstairs in the big house, sent with what is left, so it is dropped first */
function homeSnap(budget){const h=S.home,r=v=>Math.round(v*10)/10;let used=0;""",
"""/* the house layout rides along in presence; Claude rooms cap presence at 4 KiB, so a very full house sends what fits (placed-first items first).
   i = the ground floor (old versions only read this); u = upstairs in the big house, sent with what is left, so it is dropped first.
   Run 4, job 2 (item 26, the root cause): a visitor used to GUESS the room size from the spots: a big house with any piece within 70 cm of a wall (a kitchen flush to the
   back wall, |z| > 4.3) looked like an old 18x14 layout, so the visitor drew the old big room around a 12x10 layout and the kitchen stood 2 m from the wall. Now the layout
   says its room size (W, D: half the width and depth); old versions ignore it. Spots are sent to the centimetre (they were rounded to 10 cm) */
function homeSnap(budget){const h=S.home,r=v=>Math.round(v*100)/100;let used=0;"""])
E.append(["  const o={b:S.bighouse?1:0,w:h.wall,f:h.floor,i:rows(0)};if(S.bighouse)o.u=rows(1);return o;}",
          "  const o={b:S.bighouse?1:0,w:h.wall,f:h.floor,W:HOMEW,D:HOMED,i:rows(0)};if(S.bighouse)o.u=rows(1);return o;}"])
E.append(["""  const wide=!!hm.b&&[hm.i,hm.u].some(v=>typeof v==='string'&&v.split(';').some(r=>{const q=r.split(',');return Math.abs(+q[2])>5.3||Math.abs(+q[3])>4.3;}));   /* an old-version friend's big layout: the old 18x14 room */""",
          """  const wide=hm.W==null&&!!hm.b&&[hm.i,hm.u].some(v=>typeof v==='string'&&v.split(';').some(r=>{const q=r.split(',');return Math.abs(+q[2])>5.3||Math.abs(+q[3])>4.3;}));   /* only a layout that does not say its size (an old version) is guessed at: its big layout = the old 18x14 room (run 4, job 2) */"""])
E.append(["g.userData.fl=fl;L.items.add(g);\n    if(shl)shelfShow(g,+sn.slice(1));",
          "g.userData.fl=fl;g.userData.row={t,x,z,r,fl};L.items.add(g);\n    if(shl)shelfShow(g,+sn.slice(1));"])

# --- D. item 25: no window across the stairs: the west-wall windows sit away from the stair doorway in every house with stairs ---
E.append(["  for(const z of[0]){windowIn(sh,HOMEW-.02,1.0,z,-Math.PI/2,'#7fdcb5');windowIn(sh,-HOMEW+.02,1.0,z,Math.PI/2,'#7fdcb5');}\n  if(big){",
          "  windowIn(sh,HOMEW-.02,1.0,0,-Math.PI/2,'#7fdcb5');for(const z of(big?[-3,3]:[0]))windowIn(sh,-HOMEW+.02,1.0,z,Math.PI/2,'#7fdcb5');   /* 🪟 run 4, job 2 (item 25, the root cause): the west window sat at z 0, right in the stair doorway of the big house, so it hung across the view on the stairs; with stairs the west windows sit at z ±3 */\n  if(big){"])
E.append(["  for(const z of(D>11?[-3.2,2.6]:[0])){windowIn(ug,W/2-.02,1.0,z,-Math.PI/2,'#7fdcb5');windowIn(ug,-W/2+.02,1.0,z,Math.PI/2,'#7fdcb5');}",
          "  for(const z of(D>11?[-3.2,2.6]:[0]))windowIn(ug,W/2-.02,1.0,z,-Math.PI/2,'#7fdcb5');for(const z of(D>11?[-3.2,2.6]:[-3,3]))windowIn(ug,-W/2+.02,1.0,z,Math.PI/2,'#7fdcb5');   /* 🪟 never at z 0: the stairs come up there (run 4, item 25) */"])
E.append(["  for(const z of wide?[-3.2,2.6]:[0]){windowIn(sh,hw-.02,1.0,z,-Math.PI/2,'#7fdcb5');windowIn(sh,-hw+.02,1.0,z,Math.PI/2,'#7fdcb5');}",
          "  for(const z of wide?[-3.2,2.6]:[0])windowIn(sh,hw-.02,1.0,z,-Math.PI/2,'#7fdcb5');for(const z of wide?[-3.2,2.6]:(up?[-3,3]:[0]))windowIn(sh,-hw+.02,1.0,z,Math.PI/2,'#7fdcb5');   /* 🪟 with stairs no west window at z 0 (run 4, item 25) */"])

# --- E. gardens: what you planted rides along in presence; friends see your crops on your lot (old versions ignore it) ---
E.append(["  L.plots=[];for(const [i,x,z] of [[0,-21,-20.9],[1,-18.3,-20.9],[2,-15.6,-20.9],[3,-21,-23.0],[4,-18.3,-23.0],[5,-15.6,-23.0]]){box(st,1.8,.16,1.2,'#b07a52',x,0,z,{ol:.02});col(FL,x-.92,z-.62,x+.92,z+.62);L.plots.push({i,x,z});}",
          "  L.plots=[];for(const [i,x,z] of YARD_PLOTS){box(st,1.8,.16,1.2,'#b07a52',x,0,z,{ol:.02});col(FL,x-.92,z-.62,x+.92,z+.62);L.plots.push({i,x,z});}"])
E.append(["const YARD={g:null,gin:null,cols:[],wc:[],ints:[],on:false,j:null,plaque:null};",
          "const YARD={g:null,gin:null,cols:[],wc:[],ints:[],on:false,j:null,plaque:null};\n/* 🌱 the seed spots in the yard (the old town-yard frame; lotPt moves them to your lot). Friends' lots draw the same spots from their presence (gd) */\nconst YARD_PLOTS=[[0,-21,-20.9],[1,-18.3,-20.9],[2,-15.6,-20.9],[3,-21,-23.0],[4,-18.3,-23.0],[5,-15.6,-23.0]];\nfunction gardenSnap(){if(!S||!Array.isArray(S.garden))return null;const out=[];S.garden.forEach((st,i)=>{if(st&&st.seed&&SEEDS[st.seed])out.push(i+','+st.seed+','+plotStage(st));});return out.length?out.join(';'):null;}   /* \"spot,seed,stage;…\" (run 4, job 2) */"])
E.append(["function laneAssign(){const me=laneMe(),list=[{k:me,nm:cleanName(S.name||'Friend'),jt:MP.jt||0,big:!!S.bighouse}];\n  for(const a of MP.peers.values())list.push({k:a.peer,nm:a.nm,jt:Number.isFinite(a.jt)?a.jt:9e15,big:!!a.bh});",
          "function laneAssign(){const me=laneMe(),list=[{k:me,nm:cleanName(S.name||'Friend'),jt:MP.jt||0,big:!!S.bighouse,gd:gardenSnap()||''}];\n  for(const a of MP.peers.values())list.push({k:a.peer,nm:a.nm,jt:Number.isFinite(a.jt)?a.jt:9e15,big:!!a.bh,gd:a.gd||''});"])
E.append(["const key=o?[o.k===laneMe()?'ME':o.k,o.nm,o.big?1:0].join('|'):'';if(key!==lp.key||force){lp.key=key;laneHouse(lp,o);}",
          "const key=o?[o.k===laneMe()?'ME':o.k,o.nm,o.big?1:0,o.gd||''].join('|'):'';if(key!==lp.key||force){lp.key=key;laneHouse(lp,o);}"])
E.append(["  if(big)opt.floors=2;building(hg,opt);for(const bx of[-19.8,-14.2]){const [x,z]=lotPt(lp.j,bx,-10.6);flowerBed(hg,x,z,3,.9);}bake(hg,true);lp.g.add(hg);C.cols.push(lp.col);",
          "  if(big)opt.floors=2;building(hg,opt);for(const bx of[-19.8,-14.2]){const [x,z]=lotPt(lp.j,bx,-10.6);flowerBed(hg,x,z,3,.9);}\n  lp.gdKey=o.k===laneMe()?'':(o.gd||'');if(lp.gdKey)for(const row of lp.gdKey.split(';').slice(0,40)){const [i,seed,sg]=row.split(','),pl=YARD_PLOTS[+i];if(!pl||!SEEDS[seed])continue;const [x,z]=lotPt(lp.j,pl[1],pl[2]);   /* 🌱 a friend's garden: their soil and crops at the same spots as in a yard (their presence says what grows; old versions send nothing) */\n    box(hg,1.8,.16,1.2,'#b07a52',x,0,z,{ol:.02});const cg=new THREE.Group();cg.position.set(x,.16,z);cg.rotation.y=lp.s<0?0:Math.PI;hg.add(cg);buildCrop(cg,seed,clamp(+sg|0,0,3));}\n  bake(hg,true);lp.g.add(hg);C.cols.push(lp.col);"])
E.append(["function laneFields(a,pr,fresh){a.jt=Number.isFinite(pr.jt)?pr.jt:undefined;a.bh=pr.bh?1:0;a.ho=typeof pr.ho==='string'?pr.ho:null;",
          "function laneFields(a,pr,fresh){a.jt=Number.isFinite(pr.jt)?pr.jt:undefined;a.bh=pr.bh?1:0;a.ho=typeof pr.ho==='string'?pr.ho:null;a.gd=typeof pr.gd==='string'?pr.gd.slice(0,600):'';"])
E.append(["function laneStamp(st){st.jt=MP.jt||0;st.bh=S.bighouse?1:0;",
          "function laneStamp(st){st.jt=MP.jt||0;st.bh=S.bighouse?1:0;st.gd=gardenSnap();   /* 🌱 my garden for friends' games (optional; old versions ignore it) */"])

json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j2.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
