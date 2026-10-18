# Run 4, job 10, part B (item 22): house floors 2..6: one more floor every 10 decorating levels, each 12x10, the stairs continue up, only the floor you are on and the stairs are drawn; the outside grows for everyone. Exact-match edits (stage 2 branch).
import json
E = []
E.append(["@between", "/* the room inside your house: 12x10; the big house keeps this room and adds the stairs and a 12x10 upstairs (night 3: the downstairs doesn't grow) */",
          "    toast(dir<0?'🏡 Back downstairs':L===LOC.home?'🏡 Upstairs! Tap 🛋️ to decorate up here too.':'🏡 Upstairs!',2.6);}};}",
r"""/* the rooms inside your house: 12x10 each. Floor 0 is the room everyone starts with; the big house adds floor 1 with the stairs in the west wall (night 3), and
   run 4 (item 22) adds one more floor every 10 decorating levels, up to 6. Floor k lives 40 m further along z (UPZ), so every floor has the same local layout and the
   stairs continue up in the same design. Only the floor you stand on is attached to the scene (its own shell and stairs), so a six-floor house draws like a one-floor one */
const UPZ=40;
function homeFloors(){return S&&S.bighouse?clamp(2+(S.home.xf|0),2,6):1;}   /* floors you own: 1, or 2 + the extra floors bought (S.home.xf) */
const flOf=(L,z)=>L&&L.fls&&L.fls.length>1?clamp(Math.round((z-L.oz)/UPZ),0,L.fls.length-1):0;   /* which floor a z is on */
/* the stairs between two floors, in one floor's group: up=1 the flight going up from this floor, up=0 the flight arriving from below (local coordinates, both at the west doorway) */
function stairsIn(g,up,W,H,wm){const n=12,sd=4.2/n,sr=H/n,x0=-W/2,t=.3,a=Math.atan2(H,4.2);
  for(const k of[-1,1])box(g,4.2,H,t,null,x0-2.1,0,k*(UPG+t/2),{mat:wm,ol:false});box(g,t,H,2*UPG+2*t,null,x0-4.2-t/2,0,0,{mat:wm,ol:false});
  for(let i=0;i<n-1+up;i++)box(g,sd,up?(i+1)*sr:H-(i+1)*sr,2*UPG,'#d9a46c',x0-(i+.5)*sd,up?0:-H,0,{ol:.012});
  shaftAt(g,4.2,up?3.2:H,2*UPG,x0-2.1,up?H+1.6:-H/2,0,wm,up?'#f7eef2':'#8f6b4c',up);   /* 🪜 walls in the room's paint (repainting changes them too) */
  if(!up)box(g,4.2,.1,2*UPG,'#f7eef2',x0-2.1,H,0,{ol:false});
  for(const k of[-1,1])box(g,.1,2.7,.1,'#ffffff',x0+.04,0,k*(UPG+.05),{ol:.015});box(g,.1,.1,2*UPG+.2,'#ffffff',x0+.04,2.6,0,{ol:.015});
  box(g,Math.hypot(4.2,H),.07,.08,'#ffffff',x0-2.1,(up?H:-H)/2+.95,-UPG+.07,{rz:up?-a:a,center:true,ol:.01});
  const pg=new THREE.Group();pg.userData.keep=1;g.add(pg);plate(pg,up?'⬆️ Upstairs':'⬇️ Downstairs','#ffffff','#3d2c5e',1.0,.28,x0+.03,(2.6+H)/2,0,Math.PI/2);}
/* every floor of a house (yours or a friend's): its own group, baked on its own, with its doors (floor 0), windows and stairs; flag = the inter tag ('hdoor' / 'vdoor') */
function houseFloors(L,n,W,D,H,wm,fm,wide,flag){const hw=W/2,hd=D/2,gx=wide?6.6:4.4,fls=[];
  for(let k=0;k<n;k++){const g=new THREE.Group(),sh=new THREE.Group();g.add(sh);g.position.set(0,0,UPZ*k);const F={k,g,sh,grid:null};fls.push(F);
    shell({ox:L.ox,oz:L.oz+UPZ*k,cols:L.cols},sh,W,D,H,wm,fm,'#f7eef2',g,n>1?UPG:0);
    if(k===0){doorAt(sh,0,hd-.02,Math.PI,'#5fd4b0',false,true);doorAt(sh,gx,-hd+.02,0,'#5fd4b0',false,true);
      for(const x of wide?[-6.5,-3,1.5]:[-3,1.5])windowIn(sh,x,1.0,-hd+.02,0);
      for(const z of wide?[-3.2,2.6]:[0])windowIn(sh,hw-.02,1.0,z,-Math.PI/2,'#7fdcb5');for(const z of wide?[-3.2,2.6]:(n>1?[-3,3]:[0]))windowIn(sh,-hw+.02,1.0,z,Math.PI/2,'#7fdcb5');   /* 🪟 with stairs no west window at z 0 (run 4, item 25) */
      if(n>1)for(const x of(wide?[-5,5]:[-2.7,2.7]))windowIn(sh,x,1.0,hd-.02,Math.PI);}
    else{for(const x of(W>13?[-6.5,-3,1.5,6.6]:[-3,1.5,4.5]))windowIn(sh,x,1.0,-hd+.02,0);for(const x of(W>13?[-5,0,5]:[-2.7,0,2.7]))windowIn(sh,x,1.0,hd-.02,Math.PI);
      for(const z of(D>11?[-3.2,2.6]:[0]))windowIn(sh,hw-.02,1.0,z,-Math.PI/2,'#7fdcb5');for(const z of(D>11?[-3.2,2.6]:[-3,3]))windowIn(sh,-hw+.02,1.0,z,Math.PI/2,'#7fdcb5');}
    if(k<n-1)stairsIn(sh,1,W,H,wm);if(k>0)stairsIn(sh,0,W,H,wm);
    bake(sh,false);
    const gh=new THREE.GridHelper(W,W*2,0xb79cff,0xd9c8ff);gh.scale.z=D/W;gh.position.set(0,.012,UPZ*k);gh.visible=false;L.g.add(gh);F.grid=gh;
    if(k<n-1)inter(L,{x:-hw+.9,z:UPZ*k-.6,r:1.6,icon:'⬆️',label:'Go upstairs',act:()=>hclimb(1),[flag]:1});
    if(k>0)inter(L,{x:-hw+.9,z:UPZ*k+.6,r:1.6,icon:'⬇️',label:'Go downstairs',act:()=>hclimb(-1),[flag]:1});}
  L.fls=fls;L.g.add(fls[0].g);L.vf=-1;L.grid=fls[0].grid;
  L.bounds={x1:L.ox-hw,z1:L.oz-hd,x2:L.ox+hw,z2:L.oz+UPZ*(n-1)+hd};return fls;}
function homeShell(L,n){n=clamp(n|0,1,6);if(L.nfl===n&&L.fls)return;L.nfl=n;L.big=n>1;
  if(L.fls)for(const F of L.fls){if(F.g.parent)F.g.parent.remove(F.g);F.g.traverse(o=>{if(o.geometry&&!o.userData.keep)o.geometry.dispose();});if(F.grid.parent)F.grid.parent.remove(F.grid);}
  const W=12,D=10,H=3.2;HOMEW=W/2;HOMED=D/2;HOMEGX=4.4;L.cols.length=0;L.inter=L.inter.filter(i=>!i.hdoor);
  houseFloors(L,n,W,D,H,WALL_M,FLOOR_M,false,'hdoor');
  inter(L,{x:0,z:HOMED-.7,r:1.9,icon:'🚪',label:'Go outside',act:()=>exitTo('home'),hdoor:1});
  inter(L,{x:HOMEGX,z:-HOMED+.7,r:1.8,icon:'🌱',label:'Go to your garden',act:()=>exitTo('home','back'),hdoor:1});
  DOORS.home.inside=[0,HOMED-1.3,0];DOORS.homeback.inside=[HOMEGX,-HOMED+1.4,Math.PI];
  if(FLOOR_M.map)FLOOR_M.map.repeat.set(HOMEW/2,HOMED/2);}
/* the floor you stand on in your house: 0 = ground floor */
const homeFl=()=>CUR===LOC.home?flOf(LOC.home,P.z):0;
/* a floor as a place to decorate: the home with that floor's z and grid */
function homeFloorL(k){const L=LOC.home;if(!k||!L.fls||!L.fls[k])return L;const o=Object.create(L);o.oz=L.oz+UPZ*k;o.grid=L.fls[k].grid;return o;}
/* only the floor you stand on is attached and draws its furniture (fewer draw calls on iPads) */
function floorVis(){const L=CUR;if(!L||!L.fls||L.fls.length<2||!L.items)return;const f=flOf(L,P.z);if(f===L.vf)return;L.vf=f;
  L.fls.forEach((F,k)=>{if(k===f){if(!F.g.parent)L.g.add(F.g);}else if(F.g.parent)L.g.remove(F.g);});
  for(const g of L.items.children)g.visible=(g.userData.fl|0)===f;}
/* up or down the stairs: the same step-by-step climb as in the flats, from this floor to the next */
function hclimb(dir){const L=CUR;if(CLIMB||CUT||fading||!L.fls||L.fls.length<2)return;const f=flOf(L,P.z),to=f+dir;if(to<0||to>=L.fls.length)return;if(DECO.on)decoEnd();P.sit=null;SFX.tap();
  const w=L===LOC.home?HOMEW:L.W,x0=L.ox-w,z0=L.oz+UPZ*f;
  CLIMB={t:0,L,dir,x0:P.x,z0:P.z,y0:P.yaw,p0:P.pitch,x1:x0-3.3,z1:z0,ya:Math.PI/2,h:3,st:0,fd:false,end:()=>{
    [P.x,P.z]=collideXZ(L.ox-w+2.6,L.oz+UPZ*to,.3,L);P.yaw=-Math.PI/2;P.pitch=0;P.cy=0;floorVis();bringFollowers(true);saveLocal();
    toast(dir<0?(to?'🏡 Down to floor '+(to+1):'🏡 Back downstairs'):L===LOC.home?(to===1?'🏡 Upstairs! Tap 🛋️ to decorate up here too.':'🏡 Floor '+(to+1)+'! Tap 🛋️ to decorate here too.'):'🏡 Upstairs!',2.6);}};}"""])
# the visitor's copy of a friend's house: as many floors as the host says (n), old hosts: 1 or 2
E.append(["@between", "function visitShell(L,big,up,wide){",
          "  L.bounds={x1:L.ox-hw,z1:L.oz-hd,x2:L.ox+hw,z2:L.oz+hd};L.up=up?{ox:L.ox+UPX,oz:L.oz,w:hw}:null;if(up)upSpots(L,'vdoor');}",
r"""function visitShell(L,n,wide){n=clamp(n|0,1,6);wide=!!(n>1&&wide);if(L.nfl===n&&L.wide===wide&&L.fls)return;L.nfl=n;L.big=n>1;L.wide=wide;
  if(L.fls)for(const F of L.fls){if(F.g.parent)F.g.parent.remove(F.g);F.g.traverse(o=>{if(o.geometry&&!o.userData.keep)o.geometry.dispose();});if(F.grid.parent)F.grid.parent.remove(F.grid);}
  const W=wide?18:12,D=wide?14:10,H=wide?3.6:3.2,hw=W/2,hd=D/2;L.W=hw;L.D=hd;L.cols.length=0;L.inter=L.inter.filter(i=>!i.vdoor);
  houseFloors(L,n,W,D,H,L.wallM,L.floorM,wide,'vdoor');
  inter(L,{x:0,z:hd-.7,r:1.9,icon:'🚪',label:'Go outside',act:()=>visLeave('👋 Bye, '+VIS.nm+'! Thanks for having me!'),vdoor:1});}
const visFloors=hm=>clamp(+hm.n||(hm.b&&typeof hm.u==='string'?2:1),1,6);   /* how many floors a host's presence describes (old versions: b and u) */"""])
E.append(["  visitShell(L,!!hm.b,typeof hm.u==='string',wide);", "  visitShell(L,visFloors(hm),wide);"])
E.append(["  const rows=[];L.vf=-1;for(const fl of L.up?[0,1]:[0]){const v=hm[fl?'u':'i'];", "  const rows=[];L.vf=-1;for(let fl=0;fl<(L.fls?L.fls.length:1);fl++){const v=hm[fl===0?'i':fl===1?'u':'u'+fl];"])
E.append(["const x=+xs,z=+zs,r=(+rs||0)&3,ox=L.ox+fl*UPX;", "const x=+xs,z=+zs,r=(+rs||0)&3,ox=L.ox,oz=L.oz+UPZ*fl;"])
E.append(["    const g=buildFurn(shl?'shellshelf':t,HEX.test(c)?c:null);g.position.set(ox+x,0,L.oz+z);g.rotation.y=r*Math.PI/2;", "    const g=buildFurn(shl?'shellshelf':t,HEX.test(c)?c:null);g.position.set(ox+x,0,oz+z);g.rotation.y=r*Math.PI/2;"])
E.append(["    const R=fpRect(t,x,z,r),rect={x1:ox+R.x1,z1:L.oz+R.z1,x2:ox+R.x2,z2:L.oz+R.z2};if(!F.flat)L.dcols.push(rect);", "    const R=fpRect(t,x,z,r),rect={x1:ox+R.x1,z1:oz+R.z1,x2:ox+R.x2,z2:oz+R.z2};if(!F.flat)L.dcols.push(rect);"])
E.append(["    if(F.use==='sit'){const yaw=r*Math.PI/2+Math.PI;L.inter.push({x:ox+x,z:L.oz+z,r:1.7,rect,", "    if(F.use==='sit'){const yaw=r*Math.PI/2+Math.PI;L.inter.push({x:ox+x,z:oz+z,r:1.7,rect,"])
E.append(["      act:()=>{P.sit={x:ox+x,z:L.oz+z,yaw};P.x=P.sit.x;P.z=P.sit.z;P.yaw=yaw;P.pitch=-.12;SFX.pop();toast('Comfy! Move to stand up.');}});}}}",
          "      act:()=>{P.sit={x:ox+x,z:oz+z,yaw};P.x=P.sit.x;P.z=P.sit.z;P.yaw=yaw;P.pitch=-.12;SFX.pop();toast('Comfy! Move to stand up.');}});}}}"])
# your furniture on floor k
E.append(["  const L=LOC.home,F=FURN[furnOf(it)],up=it.f&&L.up?1:0,ox=L.ox+up*UPX;const g=buildFurn(furnOf(it),it.c);g.position.set(ox+it.x,0,L.oz+it.z);g.rotation.y=it.r*Math.PI/2;",
          "  const L=LOC.home,F=FURN[furnOf(it)],up=clamp(it.f|0,0,(L.fls?L.fls.length:1)-1),ox=L.ox,oz=L.oz+UPZ*up;const g=buildFurn(furnOf(it),it.c);g.position.set(ox+it.x,0,oz+it.z);g.rotation.y=it.r*Math.PI/2;"])
E.append(["  if(!F.flat&&!F.hang){const R=fpRect(it.t,it.x,it.z,it.r);rec.col={x1:ox+R.x1,z1:L.oz+R.z1,x2:ox+R.x2,z2:L.oz+R.z2};L.dcols.push(rec.col);}",
          "  if(!F.flat&&!F.hang){const R=fpRect(it.t,it.x,it.z,it.r);rec.col={x1:ox+R.x1,z1:oz+R.z1,x2:ox+R.x2,z2:oz+R.z2};L.dcols.push(rec.col);}"])
E.append(["    const R2=fpRect(it.t,it.x,it.z,it.r);rec.inter={x:ox+it.x,z:L.oz+it.z,r:1.7,rect:{x1:ox+R2.x1,z1:L.oz+R2.z1,x2:ox+R2.x2,z2:L.oz+R2.z2},obj:g,",
          "    const R2=fpRect(it.t,it.x,it.z,it.r);rec.inter={x:ox+it.x,z:oz+it.z,r:1.7,rect:{x1:ox+R2.x1,z1:oz+R2.z1,x2:ox+R2.x2,z2:oz+R2.z2},obj:g,"])
# presence: every floor's pieces (u = floor 1 as before, u2..u5 new; n = the floor count); old versions read b and u only
E.append(["  const rows=fl=>{const out=[];for(const it of h.items.filter(it=>(it.f&&S.bighouse?1:0)===fl).slice(0,160)){", "  const rows=fl=>{const out=[];for(const it of h.items.filter(it=>(S.bighouse?it.f|0:0)===fl).slice(0,160)){"])
E.append(["  const o={b:S.bighouse?1:0,w:h.wall,f:h.floor,W:HOMEW,D:HOMED,i:rows(0)};if(S.bighouse)o.u=rows(1);return o;}",
          "  const n=homeFloors(),o={b:S.bighouse?1:0,w:h.wall,f:h.floor,W:HOMEW,D:HOMED,n,i:rows(0)};if(S.bighouse)o.u=rows(1);for(let k=2;k<n;k++)o['u'+k]=rows(k);return o;}   /* n, u2…u5: the floors above the second (run 4, item 22; old versions ignore them) */"])
# decorating on any floor
E.append(["const HOMEX={id:'home',L:()=>homeFl()?LOC.home.up:LOC.home,", "const HOMEX={id:'home',L:()=>homeFloorL(homeFl()),"])
E.append(["  on:o=>(o.f|0)===homeFl(),put:it=>{if(homeFl())it.f=1;else delete it.f;},", "  on:o=>(o.f|0)===homeFl(),put:it=>{const k=homeFl();if(k)it.f=k;else delete it.f;},"])
E.append(["DX().L().grid.visible=false;if(DX()===HOMEX&&LOC.home.up)LOC.home.grid.visible=LOC.home.up.grid.visible=false;", "DX().L().grid.visible=false;if(DX()===HOMEX&&LOC.home.fls)for(const F of LOC.home.fls)F.grid.visible=false;"])
E.append(["function homeBlocked(R,fl){return(!!LOC.home.up&&R.x1<-HOMEW+3&&R.z1<1.4&&R.z2>-1.4)||", "function homeBlocked(R,fl){return(homeFloors()>1&&R.x1<-HOMEW+3&&R.z1<1.4&&R.z2>-1.4)||"])
# buying floors: the big house at decorating 10, then one more floor every 10 levels, the same price each time
E.append(["function applyHouse(){const big=!!S.bighouse;homeShell(LOC.home,big);if(YARD.plaque)YARD.plaque.visible=!big;}", "function applyHouse(){const n=homeFloors();homeShell(LOC.home,n);if(YARD.plaque)YARD.plaque.visible=n<6;}"])
E.append(["@between", "function openBigHouse(){if(S.bighouse){toast('🏡 This is your big house! Enjoy all that space 🎉',3);return;}",
          "      :`<p class=\"ph-sub\" style=\"margin-top:12px\">${lv<10?'Put furniture in your house to level up Decorating 🛋️':'Keep saving your coins 🪙'}</p>`}`,{bottom:true});}",
r"""function openBigHouse(){const n=homeFloors();if(n>=6){toast('🏡 Six floors! Your house is as tall as it gets 🎉',3);return;}
  const need=10*n,lv=sk('decor').lv,ok=lv>=need&&S.coins>=BIG_PRICE;   /* 🏡 run 4, item 22: floor 2 at decorating 10, 3 at 20 … 6 at 50, the same price each time */
  openPanel(`<div class="hd"><h2>🏡 ${n===1?'Bigger house':'One more floor'}</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    <p class="ph-sub">${n===1?'Stairs up to a whole second floor to decorate! Your downstairs stays just as it is: nothing moves.':'Floor '+(n+1)+' of 6: the stairs go on up. Everything you have stays where it is.'}</p>
    <div class="ph-row"><span>🛋️ Decorating level ${need}</span><span>${lv>=need?'✅':'level '+lv}</span></div>
    <div class="ph-row"><span>🪙 ${BIG_PRICE} coins</span><span>${S.coins>=BIG_PRICE?'✅':S.coins+' / '+BIG_PRICE}</span></div>
    ${ok?`<div class="row" style="justify-content:center;margin-top:12px"><button class="btn mint" data-a="bighouse">🏡 ${n===1?'Buy it!':'Add the floor!'}</button></div>`
      :`<p class="ph-sub" style="margin-top:12px">${lv<need?'Put furniture in your house to level up Decorating 🛋️':'Keep saving your coins 🪙'}</p>`}`,{bottom:true});}"""])
E.append(["ACT.bighouse=()=>{if(S.bighouse||sk('decor').lv<10||S.coins<BIG_PRICE)return;S.coins-=BIG_PRICE;S.bighouse=true;closePanel();\n  applyHouse();rebuildHome();SFX.coin();SFX.yay();change();toast('🎉 You got the big house! Go inside: the stairs are in the west wall! 🪜',4.5);\n  laneRefresh();",
          "ACT.bighouse=()=>{const n=homeFloors();if(n>=6||sk('decor').lv<10*n||S.coins<BIG_PRICE)return;S.coins-=BIG_PRICE;if(n===1)S.bighouse=true;else S.home.xf=(S.home.xf|0)+1;closePanel();\n  applyHouse();rebuildHome();SFX.coin();SFX.yay();change();toast(n===1?'🎉 You got the big house! Go inside: the stairs are in the west wall! 🪜':'🎉 Floor '+(n+1)+' is yours! The stairs go on up 🪜',4.5);\n  laneRefresh(true);"])
E.append(["label:()=>S.bighouse?'Your big house!':'Bigger house',act:()=>openBigHouse()", "label:()=>homeFloors()>=6?'Your big house!':homeFloors()>1?'One more floor?':'Bigger house',act:()=>openBigHouse()"])
# an old save made on the old upstairs (40 m east) lands on floor 1 (40 m north now)
E.append(["  else{let loc=S.loc;P.x=S.px;P.z=S.pz;P.yaw=isFinite(S.yaw)?S.yaw:0;P.pitch=0;",
          "  else{let loc=S.loc;P.x=S.px;P.z=S.pz;P.yaw=isFinite(S.yaw)?S.yaw:0;P.pitch=0;if(loc==='home'&&P.x>LOC.home.ox+UPX/2){P.x-=UPX;P.z+=UPZ;}   /* 🪜 a save made upstairs before run 4 (the upstairs used to stand 40 m east; now floor 1 stands 40 m north) */"])
json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j10b.json', 'w'), ensure_ascii=False)
print(len(E), 'edits (not applied)')
