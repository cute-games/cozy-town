# Run 4, job 10, part A (items 21, 22, 23): levels to 50, 30 more garden spots (pots along the fence), the house colour. Exact-match edits for edit.py (stage 2 branch).
import json
E = []
# ---- A. every skill to level 50 (same XP rule, same level-up coins) ----
E.append(["const MAXLV=10,xpNeed=lv=>10*lv;", "const MAXLV=50,xpNeed=lv=>10*lv;   /* ⭐ run 4, item 21: every skill goes to 50 (it was 10); the XP rule and the level-up coins are the same, a player at 10 carries on from 10 */"])
# ---- B. the garden: 6 beds + 30 pots along the inside of the fence, 6 more at gardening 10, 20, 30, 40 and 50 ----
E.append(["const YARD_PLOTS=[[0,-21,-20.9],[1,-18.3,-20.9],[2,-15.6,-20.9],[3,-21,-23.0],[4,-18.3,-23.0],[5,-15.6,-23.0]];",
          """const YARD_PLOTS=[[0,-21,-20.9],[1,-18.3,-20.9],[2,-15.6,-20.9],[3,-21,-23.0],[4,-18.3,-23.0],[5,-15.6,-23.0]];
/* 🪴 run 4, item 22: 30 more seed spots: pots along the inside of the fence (never on the way from the gate or the back door, never by the shed), six more at gardening level 10, 20, 30, 40 and 50 */
const YARD_POTS=[[-21.3,-18.95],[-20.6,-18.95],[-19.9,-18.95],[-19.2,-18.95],[-18.5,-18.95],[-17.8,-18.95],
  [-17.1,-18.95],[-16.4,-18.95],[-15.7,-18.95],[-22.55,-20.0],[-22.55,-20.7],[-22.55,-21.4],
  [-22.55,-22.1],[-22.55,-22.8],[-22.55,-23.5],[-22.55,-24.1],[-21.9,-24.15],[-21.2,-24.15],
  [-20.5,-24.15],[-19.8,-24.15],[-19.1,-24.15],[-18.4,-24.15],[-17.7,-24.15],[-17.0,-24.15],
  [-16.3,-24.15],[-15.6,-24.15],[-14.9,-24.15],[-10.95,-20.4],[-10.95,-21.1],[-10.95,-21.8]].map(([x,z],k)=>[6+k,x,z]);
const YARD_ALL=YARD_PLOTS.concat(YARD_POTS);
const plotGate=i=>i<6?1:10*(1+Math.floor((i-6)/6));   /* the gardening level a spot needs: beds 1, pots 10, 20, 30, 40, 50 */
const plotOpen=i=>!!S&&sk('garden').lv>=plotGate(i);"""])
E.append(["  L.plots=[];for(const [i,x,z] of YARD_PLOTS){box(st,1.8,.16,1.2,'#b07a52',x,0,z,{ol:.02});col(FL,x-.92,z-.62,x+.92,z+.62);L.plots.push({i,x,z});}",
          "  L.plots=[];for(const [i,x,z] of YARD_PLOTS){box(st,1.8,.16,1.2,'#b07a52',x,0,z,{ol:.02});col(FL,x-.92,z-.62,x+.92,z+.62);L.plots.push({i,x,z});}\n  for(const [i,x,z] of YARD_POTS){cyl(st,.26,.2,.3,'#c9805a',x,0,z,{seg:10,ol:.015});cyl(st,.29,.29,.05,'#b8704c',x,.28,z,{seg:10,ol:.012});colC(FL,x,z,.32);L.plots.push({i,x,z,pot:1});}   /* 🪴 the pots */"])
E.append(["function gardenInit(){S.garden=S.garden||[];for(let i=0;i<6;i++)S.garden[i]=S.garden[i]||{};\n  if(!PLOTS.length){const L=LOC.city,G=YARD.gin;for(const pl of L.plots){const soilM=toon({color:'#7a5236'});const soil=new THREE.Mesh(new THREE.BoxGeometry(1.6,.05,1.0),soilM);soil.position.set(pl.x,.15,pl.z);soil.receiveShadow=true;G.add(soil);\n    const grp=new THREE.Group();grp.position.set(pl.x,.175,pl.z);G.add(grp);const rec={pl,soil,soilM,grp,key:'',icon:null,iconK:''};\n    rec.target={x:pl.x,z:pl.z,r:1.6,rect:{x1:pl.x-.92,z1:pl.z-.62,x2:pl.x+.92,z2:pl.z+.62},obj:grp,icon:'🌱',label:()=>plotLabel(rec),act:()=>usePlot(rec)};L.inter.push(rec.target);yardInt(rec.target);PLOTS.push(rec);}}",
          "function gardenInit(){S.garden=S.garden||[];for(let i=0;i<YARD_ALL.length;i++)S.garden[i]=S.garden[i]||{};\n  if(!PLOTS.length){const L=LOC.city,G=YARD.gin;for(const pl of L.plots){const soilM=toon({color:'#7a5236'});const soil=new THREE.Mesh(pl.pot?new THREE.CylinderGeometry(.22,.22,.04,10):new THREE.BoxGeometry(1.6,.05,1.0),soilM);soil.position.set(pl.x,pl.pot?.32:.15,pl.z);soil.receiveShadow=true;G.add(soil);\n    const grp=new THREE.Group();grp.position.set(pl.x,pl.pot?.34:.175,pl.z);if(pl.pot)grp.scale.setScalar(.55);G.add(grp);const rec={pl,soil,soilM,grp,key:'',icon:null,iconK:''};   /* 🪴 a pot grows the same crop, smaller */\n    rec.target=pl.pot?{x:pl.x,z:pl.z,r:1.5,obj:grp,icon:'🌱',label:()=>plotLabel(rec),act:()=>usePlot(rec)}:{x:pl.x,z:pl.z,r:1.6,rect:{x1:pl.x-.92,z1:pl.z-.62,x2:pl.x+.92,z2:pl.z+.62},obj:grp,icon:'🌱',label:()=>plotLabel(rec),act:()=>usePlot(rec)};L.inter.push(rec.target);yardInt(rec.target);PLOTS.push(rec);}}"])
E.append(["function plotLabel(rec){const st=S.garden[rec.pl.i];if(!st.seed)return'Plant seeds';",
          "function plotLabel(rec){const st=S.garden[rec.pl.i]||{};if(!plotOpen(rec.pl.i))return'🔒 Gardening level '+plotGate(rec.pl.i);if(!st.seed)return'Plant seeds';"])
E.append(["  rec.target.icon=!st.seed?'🌱':st.g>=1?'🧺':st.w!==S.day?'💧':'🌿';}",
          "  rec.target.icon=!plotOpen(rec.pl.i)?'🔒':!st.seed?'🌱':st.g>=1?'🧺':st.w!==S.day?'💧':'🌿';}"])
E.append(["function usePlot(rec){const st=S.garden[rec.pl.i];\n  if(!st.seed){",
          "function usePlot(rec){const st=S.garden[rec.pl.i]||(S.garden[rec.pl.i]={});\n  if(!plotOpen(rec.pl.i)){SFX.no();toast('🔒 This pot opens at gardening level '+plotGate(rec.pl.i)+'. Plant, water and pick to level up! 🌱',3.2);return;}\n  if(!st.seed){"])
# the icon over a pot sits lower than over a bed
E.append(["if(need){const s=label(need,.42,{bg:null,bw:0,pad:4});s.position.set(rec.pl.x,1.25,rec.pl.z);YARD.gin.add(s);rec.icon=s;}}",
          "if(need){const s=label(need,.42,{bg:null,bw:0,pad:4});s.position.set(rec.pl.x,rec.pl.pot?1.0:1.25,rec.pl.z);YARD.gin.add(s);rec.icon=s;}}"])
# friends' gardens on the lane: pots too (old versions skip spots they do not know)
E.append(["const [i,seed,sg]=row.split(','),pl=YARD_PLOTS[+i];if(!pl||!SEEDS[seed])continue;const [x,z]=lotPt(lp.j,pl[1],pl[2]);   /* 🌱 a friend's garden: their soil and crops at the same spots as in a yard (their presence says what grows; old versions send nothing) */\n    box(hg,1.8,.16,1.2,'#b07a52',x,0,z,{ol:.02});const cg=new THREE.Group();cg.position.set(x,.16,z);cg.rotation.y=lp.s<0?0:Math.PI;hg.add(cg);buildCrop(cg,seed,clamp(+sg|0,0,3));}",
          "const [i,seed,sg]=row.split(','),pl=YARD_ALL[+i];if(!pl||!SEEDS[seed])continue;const [x,z]=lotPt(lp.j,pl[1],pl[2]),pot=+i>=6;   /* 🌱 a friend's garden: their soil and crops at the same spots as in a yard (their presence says what grows; old versions send nothing); pots too (run 4, item 22) */\n    if(pot){cyl(hg,.26,.2,.3,'#c9805a',x,0,z,{seg:10,ol:.015});}else box(hg,1.8,.16,1.2,'#b07a52',x,0,z,{ol:.02});const cg=new THREE.Group();cg.position.set(x,pot?.34:.16,z);cg.rotation.y=lp.s<0?0:Math.PI;if(pot)cg.scale.setScalar(.55);hg.add(cg);buildCrop(cg,seed,clamp(+sg|0,0,3));}"])
# ---- C. the house colour: 12 ready colours and any colour, free, in the decorating bar; everyone sees it ----
E.append(["  else b.innerHTML=`<button class=\"btn butter\" data-d=\"shop\">🛍️ Shop</button>${DECO.sel?`<button class=\"btn sky\" data-d=\"move\">✋ Move it</button><button class=\"btn lilac\" data-d=\"away\">📦 Put away</button>`:''}<button class=\"btn mint\" data-d=\"done\">✅ Done</button>`;}",
          "  else b.innerHTML=`<button class=\"btn butter\" data-d=\"shop\">🛍️ Shop</button>${DECO.sel?`<button class=\"btn sky\" data-d=\"move\">✋ Move it</button><button class=\"btn lilac\" data-d=\"away\">📦 Put away</button>`:'<button class=\"btn lilac\" data-d=\"paint\">🎨 House colour</button>'}<button class=\"btn mint\" data-d=\"done\">✅ Done</button>`;}   /* 🎨 run 4, item 23 */"])
E.append(["  ({turn:decoTurn,place:decoPlace,cancel:decoCancel,shop:()=>openCatalog('buy'),move:decoMove,away:decoAway,done:decoEnd,furn:()=>openPhone('furn'),finish:",
          "  ({turn:decoTurn,place:decoPlace,cancel:decoCancel,shop:()=>openCatalog('buy'),move:decoMove,away:decoAway,done:decoEnd,paint:openHousePaint,furn:()=>openPhone('furn'),finish:"])
E.append(["function setFloor(k){if(FLOOR_M.map)FLOOR_M.map.dispose();",
          """/* 🎨 the outside of your house, any colour (run 4, item 23): 12 ready colours and a "pick any colour" slider; free; everyone sees it through the lane fields (hc) */
const HOUSE_COLS=[['#b79cff','Purple'],['#ffd6e0','Pink'],['#bfe6ff','Blue'],['#c9f2e3','Green'],['#fff1b8','Yellow'],['#ffe0c4','Peach'],['#e6dbff','Lilac'],['#bff0dc','Mint'],['#ffb3a7','Coral'],['#d9e8ff','Sky'],['#fff7e6','Cream'],['#ffffff','White']];
const houseCol=()=>S&&S.home&&HEX.test(S.home.col||'')?S.home.col:null;
function openHousePaint(){const cur=houseCol();
  openPanel(`<div class="hd"><h2>🎨 House colour</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><p class="note">Paint the outside of your house. Everyone on Friends Lane sees it!</p>
    <div class="dots">${HOUSE_COLS.map(([c,n])=>`<button class="dotb${cur===c?' on':''}" data-a="hcol:${c}" aria-label="${n}"><i style="background:${c}"></i>${n}</button>`).join('')}</div>
    <div class="opt" style="margin-top:10px"><span>Pick any colour</span><input type="range" id="hcHue" min="0" max="360" value="${cur?Math.round(hexHue(cur)):270}" aria-label="Any colour" style="flex:1;min-width:140px;height:44px"></div>
    <div class="row" style="justify-content:center;margin-top:8px"><button class="btn white" data-a="hcol:">↩️ The lane's own colour</button></div>`,{cls:'setcard'});
  const sl=$('hcHue');if(sl)sl.addEventListener('input',()=>setHouseCol(hslHex(+sl.value,.72,.82)),{passive:true});}
function hexHue(h){const r=parseInt(h.slice(1,3),16)/255,g=parseInt(h.slice(3,5),16)/255,b=parseInt(h.slice(5,7),16)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;if(!d)return 0;let hu=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4;return (hu*60+360)%360;}
function hslHex(h,s,l){const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;let r=0,g=0,b=0;if(h<60){r=c;g=x;}else if(h<120){r=x;g=c;}else if(h<180){g=c;b=x;}else if(h<240){g=x;b=c;}else if(h<300){r=x;b=c;}else{r=c;b=x;}return'#'+[r,g,b].map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('');}
function setHouseCol(c){if(c&&!HEX.test(c))return;if(c)S.home.col=c;else delete S.home.col;change();laneRefresh(true);
  const on=document.querySelector('#card .dotb.on');if(on)on.classList.remove('on');const b=c&&document.querySelector(`#card [data-a="hcol:${c}"]`);if(b)b.classList.add('on');}
ACT.hcol=c=>{SFX.pop();setHouseCol(c||null);};
function setFloor(k){if(FLOOR_M.map)FLOOR_M.map.dispose();"""])
# the lane: my colour and my friends' colours travel in the lane fields (hc), old versions ignore them
E.append(["function laneAssign(){const me=laneMe(),list=[{k:me,nm:cleanName(S.name||'Friend'),jt:MP.jt||0,big:!!S.bighouse,gd:gardenSnap()||''}];\n  for(const a of MP.peers.values())list.push({k:a.peer,nm:a.nm,jt:Number.isFinite(a.jt)?a.jt:9e15,big:!!a.bh,gd:a.gd||''});",
          "function laneAssign(){const me=laneMe(),list=[{k:me,nm:cleanName(S.name||'Friend'),jt:MP.jt||0,big:!!S.bighouse,gd:gardenSnap()||'',col:houseCol()||'',fl:homeFloors()}];\n  for(const a of MP.peers.values())list.push({k:a.peer,nm:a.nm,jt:Number.isFinite(a.jt)?a.jt:9e15,big:!!a.bh,gd:a.gd||'',col:HEX.test(a.hc||'')?a.hc:'',fl:clamp(+a.hf||(a.bh?2:1),1,6)});   /* hc, hf: house colour and floors (run 4, items 23 and 22) */"])
E.append(["const key=o?[o.k===laneMe()?'ME':o.k,o.nm,o.big?1:0,o.gd||''].join('|'):'';", "const key=o?[o.k===laneMe()?'ME':o.k,o.nm,o.big?1:0,o.gd||'',o.col||'',o.fl||1].join('|'):'';"])
E.append(["function laneStamp(st){st.jt=MP.jt||0;st.bh=S.bighouse?1:0;st.gd=gardenSnap();", "function laneStamp(st){st.jt=MP.jt||0;st.bh=S.bighouse?1:0;st.gd=gardenSnap();st.hc=houseCol()||null;st.hf=homeFloors();"])
E.append(["  const big=!!o.big,hg=new THREE.Group(),opt={x:lp.hx,z:lp.hz,w:9,d:7,h:big?7.0:3.8,wall:pal[0],trim:'#ffffff',roof:pal[1],face:lp.s<0?1:-1,gable:true,rh:big?2.8:2.6,chimney:true,door:{x:lp.hx,c:'#5fd4b0'}};\n  if(big)opt.floors=2;",
          "  const fl=clamp(o.fl||(o.big?2:1),1,6),big=fl>1,hg=new THREE.Group(),opt={x:lp.hx,z:lp.hz,w:9,d:7,h:big?3.8+3.2*(fl-1):3.8,wall:o.col||pal[0],trim:'#ffffff',roof:pal[1],face:lp.s<0?1:-1,gable:true,rh:big?2.8:2.6,chimney:true,door:{x:lp.hx,c:'#5fd4b0'}};   /* 🏡 as many floors as the owner has, in the owner's colour (run 4, items 22, 23) */\n  if(big)opt.floors=fl;"])
E.append(["  const tg=label('🏠 '+o.nm,.9);tg.position.set(lp.hx,big?10.9:7.9,lp.hz);", "  const tg=label('🏠 '+o.nm,.9);tg.position.set(lp.hx,big?opt.h+3.9:7.9,lp.hz);"])
json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j10a.json', 'w'), ensure_ascii=False)
print(len(E), 'edits (not applied)')
