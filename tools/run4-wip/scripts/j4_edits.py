# Run 4, job 4: the holiday spot at the Flower Corner: a gate in its low fence opens in a holiday month, you can walk in; closed in other months. Exact-match edits for edit.py.
import json
E = []

# --- the corner: real colliders for its hedges, tree, bench, fountain, mounds, bushes and lamps instead of one solid block; the fence gets a gate ---
E.append(["  fence(st,x1,z2,x2,z2);for(const x of[x1,x2])hbox(st,.7,.8,z2-z1-.35,HG,x,(z1+.35+z2)/2,.03);hbox(st,x2-x1+.7,.86,.7,HG,(x1+x2)/2,z1,.03);\n  tree(st,-20.2,-18.6,1.1);BENCH_SKIP=1;bench(st,-17.4,-15.6,0);BENCH_SKIP=0;   /* (nobody can reach this bench: it is inside the hedge) */",
          "  /* 🚪 run 4, job 4 (the holiday spot): the fence has a gate at x -17 (where the stepping stones start). In a holiday month the gate stands open and you can walk in;\n     in other months it is closed and the corner is the flower garden to look at. Every hedge, the tree, the bench, the fountain, the mounds and the bushes are solid on their own */\n  fence(st,x1,z2,FC.gx-FC.gw,z2,L);fence(st,FC.gx+FC.gw,z2,x2,z2,L);fcGateBuild(L,st);\n  for(const x of[x1,x2]){hbox(st,.7,.8,z2-z1-.35,HG,x,(z1+.35+z2)/2,.03);col(L,x-.4,z1-.4,x+.4,z2+.1);}hbox(st,x2-x1+.7,.86,.7,HG,(x1+x2)/2,z1,.03);col(L,x1-.4,z1-.4,x2+.4,z1+.4);\n  tree(st,-20.2,-18.6,1.1);colC(L,-20.2,-18.6,.36);bench(st,-17.4,-15.6,0);col(L,-18.3,-15.95,-16.5,-15.3);   /* (the bench has two seats now that you can reach it) */"])
E.append(["  {const x=-13.4,z=-16.4;cyl(st,.1,.14,.75,'#e9e0f7',x,0,z,{seg:10,ol:.015});cyl(st,.46,.3,.15,'#e9e0f7',x,.75,z,{seg:16,ol:.015});disc(st,.38,'#9fd8f2',x,.905,z,{seg:16});}",
          "  {const x=-13.4,z=-16.4;cyl(st,.1,.14,.75,'#e9e0f7',x,0,z,{seg:10,ol:.015});cyl(st,.46,.3,.15,'#e9e0f7',x,.75,z,{seg:16,ol:.015});disc(st,.38,'#9fd8f2',x,.905,z,{seg:16});colC(L,x,z,.55);}"])
E.append(["  for(const [x,z,R] of [[-21.2,-9.7,1.1],[-12.8,-9.7,1.1],[-12.9,-21.6,1.2],[-21.3,-22.3,1.0],[-15.5,-20.2,.9]]){sph(st,R,'#6cc97c',x,0,z,{s:[1,.32,1],ws:12,hs:6});RAISED.push({x,z,R,h:R*.32});",
          "  for(const [x,z,R] of [[-21.2,-9.7,1.1],[-12.8,-9.7,1.1],[-12.9,-21.6,1.2],[-21.3,-22.3,1.0],[-15.5,-20.2,.9]]){sph(st,R,'#6cc97c',x,0,z,{s:[1,.32,1],ws:12,hs:6});RAISED.push({x,z,R,h:R*.32});colC(L,x,z,R*.9);"])
E.append(["  for(const [x,z] of [[-22.2,-13.8],[-11.8,-13.4]]){const c='#5fbf74';sph(st,.6,c,x,.4,z,{ws:10,hs:8});sph(st,.45,c,x+.45,.32,z+.2,{ws:10,hs:8});sph(st,.42,c,x-.35,.3,z-.25,{ws:10,hs:8});}",
          "  for(const [x,z] of [[-22.2,-13.8],[-11.8,-13.4]]){const c='#5fbf74';sph(st,.6,c,x,.4,z,{ws:10,hs:8});sph(st,.45,c,x+.45,.32,z+.2,{ws:10,hs:8});sph(st,.42,c,x-.35,.3,z-.25,{ws:10,hs:8});colC(L,x,z,.8);}"])
E.append(["  for(const x of[-22.05,-19.95])box(st,.1,1.55,.1,'#ffffff',x,0,-7.3,{ol:.015});box(st,2.3,.62,.08,'#ffffff',-21,1.05,-7.3,{ol:.02});",
          "  for(const x of[-22.05,-19.95]){box(st,.1,1.55,.1,'#ffffff',x,0,-7.3,{ol:.015});colC(L,x,-7.3,.1);}box(st,2.3,.62,.08,'#ffffff',-21,1.05,-7.3,{ol:.02});"])
E.append(["  col(L,x1-.45,z1-.45,x2+.45,-6.85);}   /* nobody stands inside (see YARDR) */",
          "  for(const [x,z] of [[-14.2,-9.6],[-20.3,-14.6],[-15.0,-15.6],[-19.8,-19.6],[-16.9,-23.6]])colC(L,x,z,.12);}   /* the spooky path's lamps (October) stand at these spots */\n/* 🚪 the Flower Corner gate: a little picket gate in the fence gap; open (swung inwards) in a holiday month, closed (and solid) otherwise. holCheck calls fcGate */\nconst FC={gx:-17,gw:.9,z:-7,g:null,open:null,col:null,L:null,lamps:[]};\nfunction fcGateBuild(L,st){const g=new THREE.Group();g.position.set(FC.gx-FC.gw,0,FC.z);L.g.add(g);FC.g=g;FC.L=L;const w=2*FC.gw-.1;\n  for(let i=0;i<=4;i++)box(g,.07,.78,.07,'#ffffff',.08+i*(w-.16)/4,0,0,{ol:.015});for(const y of[.28,.58])box(g,w,.07,.05,'#ffffff',w/2,y,0,{ol:.015});bake(g,true);\n  FC.col={x1:L.ox+FC.gx-FC.gw-.05,z1:L.oz+FC.z-.1,x2:L.ox+FC.gx+FC.gw+.05,z2:L.oz+FC.z+.1};fcGate(false);}\nfunction fcGate(open){open=!!open;if(FC.open===open||!FC.g)return;FC.open=open;FC.g.rotation.y=open?-1.75:0;const i=FC.L.cols.indexOf(FC.col);if(open){if(i>=0)FC.L.cols.splice(i,1);}else if(i<0)FC.L.cols.push(FC.col);}\nconst fcOpen=()=>!!FC.open;"])
E.append(["function holCheck(){if(!LOC.city)return;const h=holidayOf(realDate());if(h===HOL.cur)return;holClear();HOL.cur=h;if(h){try{holBuild(h);}catch(e){console.error(e);}}}",
          "function holCheck(){if(!LOC.city)return;const h=holidayOf(realDate());if(h===HOL.cur)return;holClear();HOL.cur=h;if(h){try{holBuild(h);}catch(e){console.error(e);}}fcGate(!!h);}   /* 🚪 the Flower Corner's gate opens in a holiday month (run 4, job 4) */"])

# --- standing in the corner is not standing in the old town yard: a run-4 save says whether its spot was remapped (yq), and a new-version friend's spot is never remapped ---
E.append(["  {const q=toSave(loc,x,z);if(q[0]!==x&&LANE_PLOTS[LANE.mine].s>0)yaw-=Math.PI;x=q[0];z=q[1];}   /* in your yard: saved as the old town-yard spot (startGame turns it back) */",
          "  {const q=toSave(loc,x,z);S.yq=(q[0]!==x||q[1]!==z)?1:0;if(q[0]!==x&&LANE_PLOTS[LANE.mine].s>0)yaw-=Math.PI;x=q[0];z=q[1];}   /* in your yard: saved as the old town-yard spot (startGame turns it back); yq says so, because the Flower Corner (the same spot in town) can be walked in now (run 4, job 4) */"])
E.append(["function fromSave(loc,x,z){return loc==='city'&&LANE.mine!=null&&inYardR(x,z)?lotPt(LANE.mine,x,z):[x,z];}",
          "function fromSave(loc,x,z){return loc==='city'&&LANE.mine!=null&&inYardR(x,z)&&(!S||S.yq!==0)?lotPt(LANE.mine,x,z):[x,z];}   /* (a save made in the Flower Corner says yq 0: it stays there) */"])
E.append(["    if(loc==='city'&&inYardR(P.x,P.z)){[P.x,P.z]=fromSave(loc,P.x,P.z);if(LANE_PLOTS[LANE.mine].s>0)P.yaw+=Math.PI;}   /* in your yard (an old save: the old town yard): in your yard on Friends Lane */",
          "    if(loc==='city'&&inYardR(P.x,P.z)&&S.yq!==0){[P.x,P.z]=fromSave(loc,P.x,P.z);if(LANE_PLOTS[LANE.mine].s>0)P.yaw+=Math.PI;}   /* in your yard (an old save: the old town yard): in your yard on Friends Lane; a run-4 save in the Flower Corner stays there */"])
E.append(["function citySpot(a){const j=LANE.slotOf.get(a.peer);if(j!=null&&inYardR(a.rx,a.rz)){",
          "function citySpot(a){const j=LANE.slotOf.get(a.peer);if(j!=null&&!a.v&&inYardR(a.rx,a.rz)){   /* (only an old version, which sends no v, can stand in its old town yard; a new version there is in the Flower Corner) */"])
E.append(["  const lk=JSON.stringify(pr.lk||{}),old=!(Number.isFinite(pr.v)&&pr.v>=COZY_BUILD);",
          "  const lk=JSON.stringify(pr.lk||{}),old=!(Number.isFinite(pr.v)&&pr.v>=COZY_BUILD);a.v=Number.isFinite(pr.v)?pr.v:0;"])

# --- the map: the corner's badge shows the holiday and says the gate is open ---
E.append(["{k:'fc',deco:'fc',i:'🌸',n:'Flower Corner',x:-17,z:-15.6,pri:3});",
          "{k:'fc',deco:'fc',i:HOL.cur==='halloween'?'🎃':HOL.cur==='xmas'?'🎄':HOL.cur==='easter'?'🐰':HOL.cur==='valentine'?'💗':'🌸',n:HOL.cur==='halloween'?'Spooky path':'Flower Corner',x:-17,z:-15.6,pri:HOL.cur?1:3});   /* 🚪 in a holiday month the gate is open and the badge says what is there (run 4) */"])
E.append(["toast(it.deco==='fc'?'🌸 The Flower Corner: a little garden full of flowers!':",
          "toast(it.deco==='fc'?(fcOpen()?(HOL.cur==='halloween'?'🎃 The Flower Corner: the gate is open! The Spooky path winds through it after 18:00 👻':'🌸 The Flower Corner: the gate is open, come in!'):'🌸 The Flower Corner: a little garden full of flowers (the gate opens for holidays)!'):"])

json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j4.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
