'use strict';
/* ===================== 🗺️ the map (📱 → 🗺️ Map, or the M key) ===================== */
/* One big card with the town and 🏡 Friends Lane, drawn from the data: the roads, PLACES (a new place shows up by itself), the lane's lots
   (your house is "🏠 My House", friends' houses have their names), the 🚌 bus stop, and the 🏖️ beach as a sign at the east edge (you go by bus).
   One finger drags it, two fingers pinch-zoom (PC: drag, mouse wheel), + − zoom for little fingers, 📍 Me finds you. Tap a place (its badge,
   its name or the building): the way there is set at once (the pink arrow and the beacon in town, as before) and shows as a pink dotted line
   along the paths; 🚶 Let's go! closes the map. The ground, roads and buildings are painted into a cache picture a bit bigger than the screen
   (again only after a big move or a zoom); the names (at screen size: the less important ones hide when it gets crowded), the dotted line,
   friends and your arrow go on top, 10 times a second while the map is open. Nothing runs while it is closed */
const MAPV={on:false,s:4,cx:0,cz:0,W:0,H:0,dpr:1,ptr:new Map(),g:null,tap:null,last:null,base:null,bv:null,lay:null,rt:null,rk:'',hint:'',ch:'',list:false,beach:false,you:0,hop:0};
let mapT=0;
const MAP_SMAX=16,MAP_M=120,MAP_NARROW='(max-width: 930px)';   /* most zoomed in (CSS px per metre); the cache picture's extra edge (CSS px); the list is a side column on wider screens */
const MAP_PAL={
  light:{out:'#a9dc90',tree:'#90cd79',treeE:'#79b866',gr:'#c6edab',pave:'#f8efe4',paveE:'#dfcfc3',road:'#b3b0d6',roadE:'#8a84b8',dash:'#ffffff',park:'#a6e18f',parkE:'#7fc76c',plaza:'#f6e5c2',
    field:'#93d981',line:'#ffffff',water:'#8ad8fb',waterE:'#5fb9e3',sand:'#f4dca3',hedge:'#6fc06a',lot:'#d4f1bf',fence:'#ffffff',trail:'#e8d6ad',flowers:'#a9e690',ink:'#3d2c5e',
    shade:'rgba(61,44,94,.18)',txt:'#3d2c5e',halo:'#ffffff',badge:'#ffffff',badgeE:'#3d2c5e',bed:'#b07a52'},
  dark:{out:'#2b453f',tree:'#24403a',treeE:'#1b332d',gr:'#38584a',pave:'#5d5a78',paveE:'#47446a',road:'#4a4672',roadE:'#25213f',dash:'#8f8bbd',park:'#3e6a4e',parkE:'#2d5840',plaza:'#6d6386',
    field:'#3d6b4b',line:'#c9d6e8',water:'#3b78a8',waterE:'#2a5d86',sand:'#8b7a62',hedge:'#2d573c',lot:'#44664d',fence:'#d9d3ee',trail:'#6a6080',flowers:'#4f7a52',ink:'#140e28',
    shade:'rgba(0,0,0,.32)',txt:'#fff1f8',halo:'#241b42',badge:'#fff7fb',badgeE:'#140e28',bed:'#7a563d'}};
/* paths in front of the shops and doors (the same spots as the paving in the town) */
const MAP_PAVE=[[11.5,-11,36,-7],[12,7,35.5,11],[-35.5,-11.4,-26.5,-7],[-22.8,-26.7,-7,-25],[7,-26.7,23.8,-25],[7,25,24.8,26.7],[-39,-59,-11,-57],[57,-37.5,59.6,-24.5],[57,-18.5,59.6,-9.5],
  [57,12.5,60,27.5],[57,32,59.1,40],[57,5.4,59.9,11.8],[-60,-33,-57,-17],[-61,22,-57,28],[-60,-16.5,-57,-8.5]];
const MAP_AT={park:[-33.4,14.6],beach:[91,0]};   /* where a place's badge sits when not in its middle (the park's middle is the fountain) */
const MAP_MQ=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
function mapDark(){const t=document.documentElement.getAttribute('data-theme');return t==='dark'||(t!=='light'&&!!(MAP_MQ&&MAP_MQ.matches));}
function mixC(a,b,t){const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16)),A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
const mapB=()=>({x1:laneEnd()-8,x2:110,z1:-92,z2:92});   /* how far the map moves: the town, all of Friends Lane, the beach sign */
const mapShown=p=>!((p.id==='home'||p.id==='garden')&&p.x>-84);   /* your house and garden are on Friends Lane (not in town) */
let MAP_TR=null;
function mapTrees(){if(MAP_TR)return MAP_TR;const r=seeded(66),T=[];   /* soft round trees on the hills around town (not on Friends Lane or the beach path) */
  for(let i=0;i<4000&&T.length<560;i++){const x=-330+r()*450,z=-125+r()*250,R=1.8+r()*2.6;if(x>-92&&x<93&&z>-92&&z<92)continue;if(x<-78&&Math.abs(z)<31.5)continue;if(x>78&&Math.abs(z)<11)continue;T.push([x,z,R]);}
  return MAP_TR=T;}
/* paint the map: world (ox,oz) is the canvas corner, k = canvas px per metre, u = canvas px per CSS px. o.mini: the little job map (no names) */
function mapPaint(x,ox,oz,k,w,h,o){const P=o.dark?MAP_PAL.dark:MAP_PAL.light,u=o.u||1,mini=!!o.mini,le=laneEnd(),X=v=>(v-ox)*k,Z=v=>(v-oz)*k,
    vis=(x1,z1,x2,z2)=>X(x2)>-40&&X(x1)<w+40&&Z(z2)>-40&&Z(z1)<h+40,
    R=(x1,z1,x2,z2,r)=>rr(x,X(x1),Z(z1),(x2-x1)*k,(z2-z1)*k,Math.max(r*k,u)),
    C=(cx,cz,r)=>{x.beginPath();x.arc(X(cx),Z(cz),Math.max(.5,r*k),0,TAU);},
    pl=(pts)=>{pts.forEach(([a,b],i)=>i?x.lineTo(X(a),Z(b)):x.moveTo(X(a),Z(b)));},
    bc=c=>o.dark?mixC(c,'#241b42',.38):c,stroke=(c,lw)=>{x.strokeStyle=c;x.lineWidth=lw;x.stroke();};
  x.save();x.setTransform(1,0,0,1,0,0);x.lineJoin='round';x.lineCap='round';x.setLineDash([]);
  x.fillStyle=P.out;x.fillRect(0,0,w,h);
  if(!mini){x.beginPath();for(const [tx,tz,tr] of mapTrees())if(vis(tx-tr,tz-tr,tx+tr,tz+tr)){x.moveTo(X(tx)+tr*k,Z(tz));x.arc(X(tx),Z(tz),tr*k,0,TAU);}
    stroke(P.treeE,2.4*u);x.fillStyle=P.tree;x.fill();}
  x.fillStyle=P.gr;R(-88,-88,88,88,7);x.fill();if(!mini){R(le-4,-28.5,-80,28.5,5);x.fill();}   /* the town, and Friends Lane's valley */
  if(!mini){x.fillStyle=P.sand;C(97,0,7.5);x.fill();x.fillStyle=P.water;C(108,0,8.5);x.fill();}   /* 🏖️ a bit of beach past the east edge */
  /* 🌳 the park, the football field, ponds and the lake (flat PLACES, by shape) */
  for(const p of PLACES){if(!p.flat||!mapShown(p)||p.id==='beach'||p.id==='garden'||p.id==='bus')continue;const rr0=p.r||Math.max(p.w,p.d)/2;if(!vis(p.x-rr0,p.z-rr0,p.x+rr0,p.z+rr0))continue;
    if(p.id==='park'){R(p.x-p.w/2,p.z-p.d/2,p.x+p.w/2,p.z+p.d/2,2.6);x.fillStyle=P.park;x.fill();stroke(P.parkE,1.6*u);
      x.beginPath();for(const [a,b] of WE)if(PARKN.has(a)||PARKN.has(b))pl([WP[a],WP[b]]);stroke(P.plaza,1.8*k);
      const f=PLACES.find(q=>q.id==='fountain');if(f){x.fillStyle=P.plaza;C(f.x,f.z,f.r*2.1);x.fill();x.beginPath();pl([p.door,[f.x,f.z]]);stroke(P.plaza,3*k);}}
    else if(p.id==='field'){R(p.x-p.w/2,p.z-p.d/2,p.x+p.w/2,p.z+p.d/2,1.2);x.fillStyle=P.field;x.fill();stroke(P.parkE,1.4*u);
      if(k>1.5*u){const lw=Math.max(u,.16*k),a=p.x-p.w/2+1,b=p.x+p.w/2-1,c=p.z-p.d/2+.9,d=p.z+p.d/2-.9;x.beginPath();x.rect(X(a),Z(c),(b-a)*k,(d-c)*k);pl([[p.x,c],[p.x,d]]);
        x.moveTo(X(p.x)+2.7*k,Z(p.z));x.arc(X(p.x),Z(p.z),2.7*k,0,TAU);x.rect(X(a),Z(p.z-5),4*k,10*k);x.rect(X(b-4),Z(p.z-5),4*k,10*k);stroke(P.line,lw);}}
    else if(p.r){const wet=/^(lake|pond)$/.test(p.id);if(wet){x.fillStyle=P.sand;C(p.x,p.z,p.r+.55);x.fill();}C(p.x,p.z,p.r);x.fillStyle=wet?P.water:bc(p.c);x.fill();stroke(wet?P.waterE:'#ffffff',1.4*u);
      if(p.id==='fountain'){x.fillStyle=P.water;C(p.x,p.z,p.r*.55);x.fill();}
      if(p.id==='lake'&&k>2*u){const a=Math.SQRT1_2,s0=[p.x-a*(p.r+.5),p.z-a*(p.r+.5)];x.beginPath();pl([s0,[s0[0]+a*4.5,s0[1]+a*4.5]]);stroke('#c98f5e',1.5*k);
        x.save();x.translate(X(s0[0]+a*5.8),Z(s0[1]+a*5.8));x.rotate(Math.PI/4);x.fillStyle='#c98f5e';x.fillRect(-1.3*k,-1.3*k,2.6*k,2.6*k);x.restore();}}
    else{R(p.x-p.w/2,p.z-p.d/2,p.x+p.w/2,p.z+p.d/2,1);x.fillStyle=bc(p.c);x.fill();stroke(P.parkE,1.2*u);}}   /* a new flat place: a soft patch in its colour */
  /* 🌸 the Flower Corner (where your house stood in town) */
  if(vis(-24,-25,-10,-6)){R(-23.4,-24.5,-10.6,-7,1.2);x.fillStyle=P.flowers;x.fill();stroke(P.hedge,Math.max(1.4*u,.7*k));
    if(k>2.5*u){const r=seeded(31);for(const [fx,fz,fr] of [[-21.2,-9.7,1.1],[-12.8,-9.7,1.1],[-12.9,-21.6,1.2],[-21.3,-22.3,1],[-15.5,-20.2,.9]]){x.fillStyle=o.dark?'#3f6e49':'#6cc97c';C(fx,fz,fr);x.fill();
        for(let i=0;i<5;i++){const a=r()*TAU,d=r()*fr*.7;x.fillStyle=FLOWER_COLS[i];C(fx+Math.cos(a)*d,fz+Math.sin(a)*d,Math.max(.22,1.2*u/k));x.fill();}}
      x.fillStyle=o.dark?'#2f5a3a':'#5fbf74';C(-20.2,-18.6,1.6);x.fill();}}
  /* pavements, then the roads (rounded ends and corners, a soft outline) */
  const RD=[[[-77,-50],[77,-50]],[[-77,50],[77,50]],[[le+7,0],[77,0]],[[-50,-77],[-50,77]],[[0,-77],[0,77]],[[50,-77],[50,77]]],
    RW=[[[-80,-50],[80,-50]],[[-80,50],[80,50]],[[le+4,0],[75.4,0]],[[-50,-80],[-50,80]],[[0,-80],[0,80]],[[50,-80],[50,80]]];
  x.beginPath();RD.forEach(pl);stroke(P.paveE,14*k+2*u);stroke(P.pave,14*k);
  x.fillStyle=P.pave;for(const [a,b,c,d] of MAP_PAVE)if(vis(a,b,c,d)){R(a,b,c,d,.5);x.fill();}
  if(!mini&&k>2.2*u){x.beginPath();for(const [a,b] of TRAIL)pl([WP[a],WP[b]]);stroke(P.trail,1.5*k);}   /* the nature trail around the old town */
  x.beginPath();RW.forEach(pl);stroke(P.roadE,8*k+2.6*u);stroke(P.road,8*k);
  if(!mini&&k>2.2*u){x.beginPath();const cut=(a,b,f)=>{let t=a;for(const c of[-50,0,50].filter(c=>c>a&&c<b).concat(b)){if(c-8>t+1)f(t,c===b?b:c-8);t=c+8;}};
    for(const c of[-50,50])cut(-82,82,(a,b)=>pl([[a,c],[b,c]]));cut(le+2,82,(a,b)=>pl([[a,0],[b,0]]));for(const c of[-50,0,50])cut(-82,82,(a,b)=>pl([[c,a],[c,b]]));
    x.setLineDash([1.4*k,1.8*k]);x.lineCap='butt';stroke(P.dash,Math.max(u,.18*k));x.setLineDash([]);x.lineCap='round';}
  if(!mini&&k>4.5*u){x.beginPath();for(let t=-78;t<=78;t+=6){if([-50,0,50].some(c=>Math.abs(t-c)<8)||t%12===0)continue;   /* 🌳 the trees along the roads */
      for(const c of[-50,0,50])for(const s of[-1,1])for(const [tx,tz] of [[t,c+s*4.75],[c+s*4.75,t]])if(vis(tx-2,tz-2,tx+2,tz+2)){x.moveTo(X(tx)+1.1*k,Z(tz));x.arc(X(tx),Z(tz),1.1*k,0,TAU);}}
    stroke(P.treeE,1.6*u);x.fillStyle=P.tree;x.fill();}
  /* 🏖️ the big road ends at the old beach gate; the sandy path goes on (the Beach Bus goes this way) */
  x.fillStyle=P.sand;R(79.4,-3.6,100,3.6,1.6);x.fill();x.beginPath();pl([[79.4,-3.3],[79.4,3.3]]);stroke(P.ink,Math.max(2*u,.5*k)+2*u);stroke('#2b8fc4',Math.max(2*u,.5*k));
  /* 🏠 buildings: rounded blocks in their colours, the game's ink outline and a soft shadow */
  const blds=[...PLACES.filter(p=>!p.flat&&p.id!=='home'&&mapShown(p)).map(p=>[p.x,p.z,p.w||p.r*2,p.d||p.r*2,p.c,p.r]),...BLDS];
  const bus=PLACES.find(p=>p.id==='bus');if(bus)blds.push([bus.x,bus.z,bus.w,bus.d,bus.c]);
  for(const [bx,bz,bw,bd,c,round] of blds){if(!vis(bx-bw/2,bz-bd/2,bx+bw/2,bz+bd/2))continue;const r=Math.min(1.4,bw/4,bd/4),sh=Math.max(1.5*u,.5*k);
    x.fillStyle=P.shade;if(round){x.beginPath();x.arc(X(bx)+sh,Z(bz)+sh,bw/2*k,0,TAU);}else rr(x,X(bx-bw/2)+sh,Z(bz-bd/2)+sh,bw*k,bd*k,r*k);x.fill();
    if(round)C(bx,bz,bw/2);else R(bx-bw/2,bz-bd/2,bx+bw/2,bz+bd/2,r);x.fillStyle=bc(c||'#d8cfe6');x.fill();stroke(P.ink,(mini?1.3:1.6)*u);
    if(!mini&&!round&&k>2.5*u&&bw>2.5&&bd>2.5){R(bx-bw/2+.7,bz-bd/2+.7,bx+bw/2-.7,bz+bd/2-.7,Math.max(.4,r-.5));x.fillStyle=o.dark?'rgba(255,255,255,.08)':'rgba(255,255,255,.4)';x.fill();}}   /* a soft roof */
  /* 🏡 Friends Lane: the gate, hedges, every lot (a house when a friend lives there), your garden, the end of the lane */
  x.beginPath();pl([[-84.6,-4.5],[-84.6,4.5]]);stroke(P.ink,Math.max(2*u,.55*k)+2*u);stroke('#ff7aa8',Math.max(2*u,.55*k));
  if(!mini){x.beginPath();for(const s of[-1,1])pl([[-80.3,s*26.6],[le-.9,s*26.6]]);pl([[le-1.35,-27],[le-1.35,27]]);stroke(P.hedge,Math.max(2*u,1*k));
    x.beginPath();pl([[le+.2,-4.2],[le+.2,4.2]]);stroke(P.ink,Math.max(2*u,.4*k)+2*u);stroke('#ff6b6b',Math.max(2*u,.4*k));
    const C0=LOC.city,mine=LANE.mine;
    for(const lp of (C0&&C0.lane)||[]){const X0=lp.X,s=lp.s,o2=LANE.own[lp.j];if(!vis(X0-7,-27,X0+7,27))continue;
      R(X0-6.6,Math.min(s*7.1,s*26.1),X0+6.6,Math.max(s*7.1,s*26.1),1.2);x.fillStyle=P.lot;x.fill();
      if(k>3*u){x.beginPath();pl([[X0-4.6,s*11.3],[X0-4.6,s*8.2],[X0-.9,s*8.2]]);pl([[X0+.9,s*8.2],[X0+4.6,s*8.2],[X0+4.6,s*11.3]]);stroke(P.ink,Math.max(u,.18*k)+1.6*u);stroke(P.fence,Math.max(u,.18*k));}   /* the front fence */
      if(lp.j===mine){const g=PLACES.find(q=>q.id==='garden'),q=(a,b)=>lotPt(lp.j,a,b);   /* 🌱 your garden: the beds, the shed and the stepping stones */
        if(g){R(g.x-6.15,g.z-3,g.x+6.15,g.z+3,.8);x.fillStyle=o.dark?'#4f7a4a':'#a2e48a';x.fill();stroke(P.fence,Math.max(u,.14*k));
          x.fillStyle=P.bed;for(const [a,b] of [[-21,-20.9],[-18.3,-20.9],[-15.6,-20.9],[-21,-23],[-18.3,-23],[-15.6,-23]]){const [cx,cz]=q(a,b);R(cx-.9,cz-.6,cx+.9,cz+.6,.25);x.fill();}
          const [sx2,sz2]=q(-13.4,-23.3);R(sx2-.8,sz2-.7,sx2+.8,sz2+.7,.3);x.fillStyle=bc('#ffd6e0');x.fill();stroke(P.ink,u);
          if(k>3*u){x.fillStyle=P.pave;for(let i=0;i<8;i++){const [a,b]=q(-11.45,-7.6-i*1.4);C(a,b,.36);x.fill();}}}}
      if(o2){const pal=LANE_PAL[hashStr(o2.nm.toLowerCase())%LANE_PAL.length],z1=Math.min(s*11.5,s*18.5),sh=Math.max(1.5*u,.5*k);
        x.fillStyle=P.shade;rr(x,X(X0-4.5)+sh,Z(z1)+sh,9*k,7*k,1.4*k);x.fill();R(X0-4.5,z1,X0+4.5,z1+7,1.4);x.fillStyle=bc(pal[0]);x.fill();stroke(P.ink,1.6*u);
        if(k>2.5*u){R(X0-3.8,z1+.7,X0+3.8,z1+6.3,1);x.fillStyle=o.dark?'rgba(255,255,255,.08)':'rgba(255,255,255,.4)';x.fill();}}
      else if(k>5*u){x.font=`${Math.round(1.6*k)}px ${FONT}`;x.textAlign='center';x.textBaseline='middle';x.fillText('💛',X(X0-3.4),Z(s*7.6));}}}   /* an empty lot: "For a friend 💛" */
  if(mini){x.textAlign='center';x.textBaseline='middle';x.font=`${Math.round(w/26)}px ${FONT}`;for(const p of PLACES)if(p.id!=='garden'&&p.x>-86&&mapShown(p))x.fillText(p.i,X(p.x),Z(p.z));   /* the job map: icons only */
    const ez=Z(0);x.fillStyle='#ff4d8d';x.strokeStyle='#ffffff';x.lineWidth=3;x.beginPath();x.moveTo(w*.006,ez);x.lineTo(w*.036,ez-w*.024);x.lineTo(w*.036,ez+w*.024);x.closePath();x.stroke();x.fill();x.fillText('🏠',w*.068,ez);}   /* 🏡 Friends Lane is past the west edge */
  x.restore();}
/* the little job map (corner of the screen) uses the same painter: the whole town, icons only */
function drawMapBase(x,W){mapPaint(x,-88,-88,W/176,W,W,{mini:1,u:W/176});}
/* the badges and names: what can be tapped, by importance (0 = always shown) */
function mapItems(){const it=[],C=LOC.city,nav=NAV&&!NAV.actor?NAV.id:'';
  for(const p of PLACES){if(!mapShown(p))continue;const a=MAP_AT[p.id]||[p.x,p.z],sel=p.id===nav;
    it.push({k:p.id,pl:p,i:p.i,n:p.id==='beach'?'Beach →':p.n,x:a[0],z:a[1],pri:sel||p.id==='home'||p.id==='beach'?0:p.flat&&p.id!=='bus'?2:1,me:p.id==='home',sel,ls:p.id==='beach'?[0,1,3]:null});}   /* (the 🏖️ beach sign at the east edge always shows: you go there by bus; its name never goes left, into the town) */
  if(C&&C.lane)for(const lp of C.lane){const o=LANE.own[lp.j];if(!o||o.k===laneMe())continue;const k='lot'+lp.j;it.push({k,lot:lp.j,i:'🏠',n:o.nm,x:lp.hx,z:lp.hz,pri:k===nav?0:2,sel:k===nav});}
  it.push({k:'lane',deco:'lane',i:'🏡',n:'Friends Lane',x:-92,z:0,pri:1},{k:'fc',deco:'fc',i:HOL.cur==='halloween'?'🎃':HOL.cur==='xmas'?'🎄':HOL.cur==='easter'?'🐰':HOL.cur==='valentine'?'💗':'🌸',n:HOL.cur==='halloween'?'Spooky path':'Flower Corner',x:-17,z:-15.6,pri:HOL.cur?1:3});   /* 🚪 in a holiday month the gate is open and the badge says what is there (run 4) */
  return it;}
function mapLayout(x){const s=MAPV.s,B=mapB(),placed=[],out=[],hit=r=>placed.some(q=>r[0]<q[2]&&r[2]>q[0]&&r[1]<q[3]&&r[3]>q[1]),edge=r=>r[0]<B.x1*s||r[2]>B.x2*s||r[1]<B.z1*s||r[3]>B.z2*s;
  for(const it of mapItems().sort((a,b)=>a.pri-b.pri)){const px=it.x*s,py=it.z*s,R=it.sel?18:it.pri<2?16:it.pri<3?14:12,br=[px-R-2,py-R-2,px+R+2,py+R+2];
    if(it.pri>0&&hit(br))continue;   /* crowded: the less important ones hide (they come back when you zoom in) */
    it.R=R;it.lab=null;const fs=it.pri<3?15:13;x.font=`800 ${fs}px ${FONT}`;const tw=x.measureText(it.n).width,th=fs*1.15;   /* the name: below, right, left or above its badge */
    for(const [k,[lx,ly]] of [[px-tw/2,py+R+2],[px+R+5,py-th/2],[px-R-5-tw,py-th/2],[px-tw/2,py-R-3-th]].entries()){const r=[lx-4,ly-1,lx+tw+4,ly+th+1];if((!it.ls||it.ls.includes(k))&&!hit(r)&&!edge(r)){placed.push(r);it.lab=[lx-px,ly-py,tw,th,fs];break;}}   /* (never poking out of the map's edge: it would be cut there) */
    placed.push(br);out.push(it);}
  return out;}
function mapKey(){const C=LOC.city;return(C&&C.lane?C.lane.map(l=>l.key||'').join(','):'')+'|'+LANE.mine+'|'+LANE_PLOTS.length+'|'+PLACES.length;}   /* the cache picture changes with these */
/* where you are on the map: in town, or at the door of the building you are in */
function mapMe(){const id=CUR?CUR.id:'city';if(id==='city')return{x:P.x,z:P.z,yaw:P.yaw};
  if(id==='beach')return{x:98,z:0,yaw:-Math.PI/2};   /* at the beach: on the sand past the east edge */
  let d=null;const hd=H=>H?[H.x+Math.sin(H.ry)*1.3,H.z+Math.cos(H.ry)*1.3,H.ry+Math.PI]:null;
  if(id==='visit')d=laneHostDoor();else if(id.startsWith('apt'))d=hd(HOUSE(APT.b));else if(id.startsWith('cl_'))d=DOORS.school.city;
  else if(id==='client'){const r=CLRET;d=r&&r.loc&&r.loc!=='city'?hd(HOUSE(APT.b)):hd(HOUSE((r&&r.h)||(S.ds&&S.ds.o&&S.ds.o.h)||'nb'));}
  else if(DOORS[id]&&DOORS[id].city)d=DOORS[id].city;else{const pl=PLACES.find(q=>q.id===INSIDE_AT[id]);if(pl)d=[pl.door[0],pl.door[1],0];}
  return d?{x:d[0],z:d[1],yaw:d[2]||0}:{x:-17,z:-4.6,yaw:0};}
/* friends on the map: friends who hang out in town, and friends online (dots in their house colour) */
function mapPeer(a){const C=LOC.city,door=k=>{const j=LANE.slotOf.get(k);return j!=null&&C.lane&&C.lane[j]?C.lane[j].door:null;};
  if(a.loc==='city'){const q=citySpot(a);return[q[0],q[1]];}if(a.loc==='home')return door(a.peer);
  if(a.loc==='visit')return MP.me&&a.ho===MP.me?DOORS.home.city:door(a.ho);if(a.loc==='beach')return[98,2];
  const pl=PLACES.find(p=>p.id===INSIDE_AT[a.loc]);return pl?pl.door:null;}
function mapFriends(){const out=[];
  for(const f of FRIEND_ACTORS)if(f.loc==='city'&&f.mode!=='away'&&f.mode!=='follow'&&f.g.visible)out.push({x:f.x,z:f.z,c:f.d.look.top||'#ff9ec4',n:f.d.name});
  if(MP.peers)for(const a of MP.peers.values()){const q=mapPeer(a);if(q)out.push({x:q[0],z:q[1],c:LANE_PAL[hashStr(String(a.nm).toLowerCase())%LANE_PAL.length][1],n:a.nm,on:1});}
  return out;}
/* the way along the paths (the walkers' path nodes WP/WE), and along the pavement of Friends Lane */
function mapPath(ax,az,bx,bz){if(Math.hypot(bx-ax,bz-az)<10)return[[ax,az],[bx,bz]];
  const n=WP.length,d=new Array(n).fill(1e9),pv=new Array(n).fill(-1),dn=new Array(n).fill(false),near=(x,z)=>WP.map((p,i)=>[Math.hypot(p[0]-x,p[1]-z),i]).sort((a,b)=>a[0]-b[0]).slice(0,3);
  for(const [dd,i] of near(ax,az))d[i]=Math.min(d[i],dd);
  for(;;){let u=-1,bu=1e9;for(let i=0;i<n;i++)if(!dn[i]&&d[i]<bu){bu=d[i];u=i;}if(u<0)break;dn[u]=true;
    for(const v of NEIGH[u]){const w=d[u]+Math.hypot(WP[u][0]-WP[v][0],WP[u][1]-WP[v][1]);if(w<d[v]){d[v]=w;pv[v]=u;}}}
  let best=-1,bc=1e9;for(const [dd,i] of near(bx,bz))if(d[i]+dd<bc){bc=d[i]+dd;best=i;}
  if(best<0)return[[ax,az],[bx,bz]];const out=[];for(let v=best;v>=0;v=pv[v])out.push(WP[v]);out.reverse();return[[ax,az],...out,[bx,bz]];}
function mapWay(ax,az,bx,bz){const LN=-82,E=s=>WP[WPN[s<0?'E8':'E7']],sd=z=>z<0?-1:1,
    lane=(x,z)=>{const r=Math.abs(z)>6.8?laneOut(x,z):[],e=r.length?r[r.length-1]:[x,z];return[[x,z],...r,[e[0],sd(z)*5.6]];};   /* out of a yard by its gate, onto the pavement */
  if(ax>=LN&&bx>=LN)return mapPath(ax,az,bx,bz);
  if(ax<LN&&bx<LN)return[...lane(ax,az),...lane(bx,bz).reverse()];
  if(bx<LN){const e=E(sd(bz));return[...mapPath(ax,az,e[0],e[1]),...lane(bx,bz).reverse()];}
  const e=E(sd(az));return[...lane(ax,az),...mapPath(e[0],e[1],bx,bz)];}
function mapRoute(){if(!NAV||!CUR||CUR.id==='beach')return null;const me=mapMe(),G=NAV.goal||NAV.door,k=[Math.round(me.x),Math.round(me.z),Math.round(G[0]*2),Math.round(G[1]*2)].join(',');
  if(k!==MAPV.rk){MAPV.rk=k;MAPV.rt=mapWay(me.x,me.z,G[0],G[1]);}return MAPV.rt;}
/* the view: s = CSS px per metre, (cx,cz) = the middle of the map */
const mapSP=(x,z)=>[(x-MAPV.cx)*MAPV.s+MAPV.W/2,(z-MAPV.cz)*MAPV.s+MAPV.H/2];
const mapWP=(sx,sy)=>[MAPV.cx+(sx-MAPV.W/2)/MAPV.s,MAPV.cz+(sy-MAPV.H/2)/MAPV.s];
function mapSmin(){const B=mapB();return Math.min(MAPV.W/(B.x2-B.x1),MAPV.H/(B.z2-B.z1));}
function mapComfy(){return clamp(Math.min(MAPV.W,MAPV.H)/85,mapSmin(),MAP_SMAX);}   /* about 85 m across: comfy to read */
function mapClampV(){const B=mapB(),s=MAPV.s=clamp(MAPV.s,mapSmin(),MAP_SMAX),hw=MAPV.W/2/s,hh=MAPV.H/2/s;   /* you can't lose the town */
  const bp=((($('mpCard')||{}).offsetHeight||0)+16)/s;   /* (the town's bottom row can scroll up above the card at the bottom: run 4, stage 3) */
  MAPV.cx=B.x2-B.x1<=2*hw?(B.x1+B.x2)/2:clamp(MAPV.cx,B.x1+hw,B.x2-hw);MAPV.cz=B.z2-B.z1+bp<=2*hh?(B.z1+B.z2+bp)/2:clamp(MAPV.cz,B.z1+hh,B.z2-hh+bp);}
function mapHome(z){const me=mapMe();if(z||MAPV.s<mapComfy())MAPV.s=mapComfy();MAPV.cx=me.x;MAPV.cz=me.z;mapClampV();}
function mapShow(fit){if(!NAV||!MAPV.W)return;const me=mapMe(),G=NAV.goal||NAV.door,[gx,gy]=mapSP(G[0],G[1]),pad=clamp(MAPV.W*.15,40,70),bot=Math.max(80,(($('mpCard')||{}).offsetHeight||0)+26);   /* the place is off the screen (or picked from the list): show you and the place */
  if(!fit&&gx>pad&&gx<MAPV.W-pad&&gy>pad&&gy<MAPV.H-bot)return;
  const B=NAV.actor||!Number.isFinite(NAV.x)?G:(MAP_AT[NAV.id]||[NAV.x,NAV.z]),x1=Math.min(me.x,G[0],B[0]),x2=Math.max(me.x,G[0],B[0]),z1=Math.min(me.z,G[1],B[1]),z2=Math.max(me.z,G[1],B[1]),   /* you, the door and the badge */
    sf=Math.min((MAPV.W-2*pad)/Math.max(1,x2-x1),(MAPV.H-pad-bot)/Math.max(1,z2-z1));
  MAPV.s=fit?Math.min(mapComfy(),sf):Math.min(MAPV.s,sf);mapClampV();MAPV.cx=(x1+x2)/2;MAPV.cz=(z1+z2)/2+(bot-pad)/2/MAPV.s;mapClampV();}
function mapZoom(f,px,py){const s0=MAPV.s;if(px==null){px=MAPV.W/2;py=MAPV.H/2;}const [wx,wz]=mapWP(px,py);MAPV.s=clamp(s0*f,mapSmin(),MAP_SMAX);
  MAPV.cx=wx-(px-MAPV.W/2)/MAPV.s;MAPV.cz=wz-(py-MAPV.H/2)/MAPV.s;mapClampV();mapZui();mapDraw();}
function mapZui(){const cv=$('mapc');if(!cv)return;const zi=document.querySelector('#card [data-a="mapz:1"]'),zo=document.querySelector('#card [data-a="mapz:-1"]'),mn=mapSmin(),lv=1+Math.round(Math.log(MAPV.s/mn)/Math.log(1.6));
  if(zi)zi.disabled=MAPV.s>=MAP_SMAX-.001;if(zo)zo.disabled=MAPV.s<=mn+.001;const t='Map of Cozy Town (zoom '+lv+')';if(cv.getAttribute('aria-label')!==t)cv.setAttribute('aria-label',t);}
/* draw: the cache picture (again when needed), then the names, the dotted way, the job's dot, friends and you */
function mapDraw(force){const cv=$('mapc');if(!MAPV.on)return;if(!cv){mapOff();return;}
  const cw=cv.clientWidth,ch=cv.clientHeight;if(cw<40||ch<40)return;const dpr=Math.min(2,devicePixelRatio||1),W=Math.round(cw*dpr),H=Math.round(ch*dpr);
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  if(cw!==MAPV.W||ch!==MAPV.H||dpr!==MAPV.dpr){const first=!MAPV.W;MAPV.W=cw;MAPV.H=ch;MAPV.dpr=dpr;MAPV.bv=null;if(first){mapHome(true);mapShow();}mapClampV();mapZui();}   /* opened: centred on you (and the way, if it is long) */
  if(force)MAPV.lay=null;const x=cv.getContext('2d'),dark=mapDark(),key=dark+'|'+mapKey(),s=MAPV.s,k=s*dpr,v=[MAPV.cx-cw/2/s,MAPV.cz-ch/2/s,MAPV.cx+cw/2/s,MAPV.cz+ch/2/s];let b=MAPV.bv;
  const pz=MAPV.g&&MAPV.g.n===2&&b&&s/b.s>.7&&s/b.s<1.45;   /* while pinching, the cache picture is stretched a little and painted again when the fingers let go */
  if(force||!b||b.key!==key||(b.s!==s&&!pz)||v[0]<b.x1||v[1]<b.z1||v[2]>b.x2||v[3]>b.z2){const m=MAP_M/s,B=MAPV.base||(MAPV.base=document.createElement('canvas')),bw=Math.round((cw+2*MAP_M)*dpr),bh=Math.round((ch+2*MAP_M)*dpr);
    b={x1:v[0]-m,z1:v[1]-m,x2:v[2]+m,z2:v[3]+m,s,key};if(B.width!==bw||B.height!==bh){B.width=bw;B.height=bh;}try{mapPaint(B.getContext('2d'),b.x1,b.z1,k,bw,bh,{dark,u:dpr});}catch(e){console.warn('map',e);}MAPV.bv=b;}   /* a slip in one layer never leaves the map one flat colour (run 4, item 10) */
  const lk=key+'|'+(NAV&&!NAV.actor?NAV.id:'');if(!MAPV.lay||MAPV.lay.s!==s||MAPV.lay.key!==lk)MAPV.lay={s,key:lk,items:mapLayout(x)};   /* the names: again after a zoom, or another place picked */
  const P2=dark?MAP_PAL.dark:MAP_PAL.light,t=performance.now()/1000,S2=(wx,wz)=>[((wx-MAPV.cx)*s+cw/2)*dpr,((wz-MAPV.cz)*s+ch/2)*dpr];
  {const bk=b.s*dpr,sw=Math.min(MAPV.base.width,(v[2]-v[0])*bk),sh=Math.min(MAPV.base.height,(v[3]-v[1])*bk);x.setTransform(1,0,0,1,0,0);
    const r0=b.s===s?Math.round:(q=>q);x.drawImage(MAPV.base,r0(clamp((v[0]-b.x1)*bk,0,MAPV.base.width-sw)),r0(clamp((v[1]-b.z1)*bk,0,MAPV.base.height-sh)),sw,sh,0,0,W,H);}x.lineJoin='round';x.lineCap='round';
  const rt=mapRoute();
  if(rt&&rt.length>1){const pts=rt.map(p=>S2(p[0],p[1]));x.beginPath();pts.forEach(([a,c],i)=>i?x.lineTo(a,c):x.moveTo(a,c));x.strokeStyle='rgba(255,77,141,.24)';x.lineWidth=13*dpr;x.stroke();
    const gap=14*dpr;let carry=gap-(t*24*dpr)%gap;x.fillStyle='#ff4d8d';x.strokeStyle='#ffffff';x.lineWidth=2*dpr;   /* the dots walk towards the place */
    for(let i=1;i<pts.length;i++){const [a,c]=pts[i-1],[e,f]=pts[i],L=Math.hypot(e-a,f-c);let d=carry;for(;d<=L;d+=gap){x.beginPath();x.arc(a+(e-a)*d/L,c+(f-c)*d/L,3.8*dpr,0,TAU);x.fill();x.stroke();}carry=d-L;}}
  if(NAV){const G=NAV.goal||NAV.door,[gx,gy]=S2(G[0],G[1]),ph=(t%1.4)/1.4;x.beginPath();x.arc(gx,gy,(8+12*ph)*dpr,0,TAU);x.strokeStyle=`rgba(255,77,141,${.7*(1-ph)})`;x.lineWidth=3*dpr;x.stroke();
    x.beginPath();x.arc(gx,gy,6*dpr,0,TAU);x.fillStyle='#ff4d8d';x.fill();x.strokeStyle='#ffffff';x.lineWidth=2.5*dpr;x.stroke();}
  {const T=jobTarget();if(T){const col=(S.dl&&S.dl.dot)||'#ff3b3b',[tx,ty]=S2(T.x,T.z);x.beginPath();x.arc(tx,ty,9*dpr,0,TAU);x.fillStyle=col;x.fill();x.lineWidth=3*dpr;x.strokeStyle=col==='#ffffff'?'#1d1622':'#ffffff';x.stroke();
    if(S.job==='delivery'&&S.dl&&S.dl.o&&S.dl.o.r){x.beginPath();x.arc(tx,ty,14*dpr,0,TAU);x.lineWidth=4*dpr;x.strokeStyle='#ffc400';x.stroke();}}}
  x.textAlign='center';x.textBaseline='middle';
  const items=MAPV.lay.items.slice();if(NAV&&NAV.actor)items.push({i:NAV.i,n:NAV.n,x:NAV.door[0],z:NAV.door[1],R:18,sel:1,lab:null});
  /* 🧹 nothing hides under you (glitch fixes, pass 2): a place's name under your arrow moves to another side of its badge (with no room there,
     a small place's name hides and a big one is drawn over the arrow); your "You!" and friends' names go to a side where they cover nothing */
  const me=mapMe(),[mx,my]=S2(me.x,me.z),ph=(t%1.6)/1.6,big=t-MAPV.you<2.2,A=21*dpr,meB=[mx-A,my-A,mx+A,my+A],vis=[],
    hit=(r,L)=>L.some(o=>o!==r&&r[0]<o[2]&&r[2]>o[0]&&r[1]<o[3]&&r[3]>o[1]),inC=r=>r[0]>=0&&r[1]>=0&&r[2]<=W&&r[3]<=H,rects=()=>vis.flatMap(o=>o.l?[o.b,o.l]:[o.b]);
  for(const it of items){const [bx,by]=S2(it.x,it.z),R=it.R*dpr;if(bx<-120*dpr||bx>W+120*dpr||by<-60*dpr||by>H+60*dpr)continue;const o={it,bx,by,R,b:[bx-R,by-R,bx+R,by+R],l:null,top:0};
    if(it.lab){const [lx,ly,tw,th]=it.lab;o.l=[bx+lx*dpr,by+ly*dpr,bx+(lx+tw)*dpr,by+(ly+th)*dpr];}vis.push(o);}
  const fl=[];for(const f of mapFriends()){const [fx,fy]=S2(f.x,f.z),r=(f.on?8:6.5)*dpr;if(fx>=-50&&fx<=W+50&&fy>=-50&&fy<=H+50)fl.push([f,fx,fy,r,[fx-r,fy-r,fx+r,fy+r]]);}
  for(const o of vis){if(!o.l||!hit(o.l,[meB]))continue;const [,,tw,th]=o.it.lab,R=o.it.R,L=[...rects().filter(q=>q!==o.l),...fl.map(q=>q[4])];o.top=1;   /* (the same 4 sides as mapLayout) */
    for(const [lx,ly] of[[-tw/2,R+2],[R+5,-th/2],[-R-5-tw,-th/2],[-tw/2,-R-3-th]]){const r=[o.bx+lx*dpr,o.by+ly*dpr,o.bx+(lx+tw)*dpr,o.by+(ly+th)*dpr];if(inC(r)&&!hit(r,[meB])&&!hit(r,L)){o.l=r;o.top=0;break;}}if(o.top&&o.it.pri>1)o.l=null;}   /* (no room: a small place's name hides, like when it is crowded) */
  for(const o of vis)if(o.it.lab)o.it.sl=o.l?[(o.l[0]-o.bx)/dpr,(o.l[1]-o.by)/dpr,(o.l[2]-o.bx)/dpr,(o.l[3]-o.by)/dpr]:0;   /* where the name is drawn now (mapTap: tap the name where you see it) */
  const name=o=>{const it=o.it,Y=(o.l[1]+o.l[3])/2;x.font=`800 ${it.lab[4]*dpr}px ${FONT}`;x.textAlign='left';x.lineWidth=4.5*dpr;x.strokeStyle=P2.halo;x.strokeText(it.n,o.l[0],Y);x.fillStyle=it.sel?(dark?'#ffb3cf':'#d6286a'):P2.txt;x.fillText(it.n,o.l[0],Y);x.textAlign='center';};
  for(const o of vis){const {it,bx,by,R}=o;
    if(it.sel||it.me){x.beginPath();x.arc(bx,by,R+5*dpr,0,TAU);x.fillStyle=it.sel?'rgba(255,77,141,.35)':'rgba(255,122,168,.25)';x.fill();}
    x.beginPath();x.arc(bx,by+1.5*dpr,R,0,TAU);x.fillStyle=P2.shade;x.fill();x.beginPath();x.arc(bx,by,R,0,TAU);x.fillStyle=P2.badge;x.fill();x.lineWidth=(it.sel||it.me?3.5:2.2)*dpr;x.strokeStyle=it.sel||it.me?'#ff4d8d':P2.badgeE;x.stroke();
    x.font=`${Math.round(R*1.1)}px ${FONT}`;x.fillStyle='#3d2c5e';x.fillText(it.i,bx,by+R*.07);
    if(o.l&&!o.top)name(o);}
  /* you: a pink arrow with a white outline and a soft pulse */
  x.beginPath();x.arc(mx,my,(big?22+26*ph:15+15*ph)*dpr,0,TAU);x.fillStyle=`rgba(255,77,141,${(big?.45:.3)*(1-ph)})`;x.fill();
  x.save();x.translate(mx,my);x.rotate(-me.yaw);const a=1.25*dpr;x.beginPath();x.moveTo(0,-15*a);x.lineTo(11*a,11*a);x.lineTo(0,5*a);x.lineTo(-11*a,11*a);x.closePath();
  x.lineWidth=7*dpr;x.strokeStyle='#3d2c5e';x.stroke();x.lineWidth=3.5*dpr;x.strokeStyle='#ffffff';x.stroke();x.fillStyle='#ff4d8d';x.fill();x.restore();
  for(const o of vis)if(o.l&&o.top)name(o);
  const taken=[...rects(),meB,...fl.map(q=>q[4])];
  for(const [f,fx,fy,r] of fl){x.beginPath();x.arc(fx,fy,r,0,TAU);x.fillStyle=f.c;x.fill();x.lineWidth=2.5*dpr;x.strokeStyle='#ffffff';x.stroke();   /* online friends: a bigger dot (over your arrow, so it never hides them) */
    x.lineWidth=1.2*dpr;x.strokeStyle=P2.ink;x.beginPath();x.arc(fx,fy,r+1.6*dpr,0,TAU);x.stroke();}
  for(const o of vis)if(o.l&&hit(o.l,fl.map(q=>q[4])))name(o);   /* a place's name a friend's dot lies on is drawn again over the dot (run 4 finish: Rosie's dot hid the S of "Spooky path") */
  if(big){x.font=`800 ${15*dpr}px ${FONT}`;const tw=x.measureText('You!').width+18*dpr,ov=q=>taken.reduce((a,o)=>a+Math.max(0,Math.min(q[2],o[2])-Math.max(q[0],o[0]))*Math.max(0,Math.min(q[3],o[3])-Math.max(q[1],o[1])),0);let cx=mx,cy=my-34*dpr,bo=Infinity;   /* "You!" above you, or below, right or left: the side that covers the least */
    for(const [qx,qy] of[[mx,my-34*dpr],[mx,my+34*dpr],[mx+A+6*dpr+tw/2,my],[mx-A-6*dpr-tw/2,my]]){const q=[qx-tw/2,qy-13*dpr,qx+tw/2,qy+13*dpr],v=inC(q)?ov(q):Infinity;if(v<bo){bo=v;cx=qx;cy=qy;if(!v)break;}}
    taken.push([cx-tw/2,cy-13*dpr,cx+tw/2,cy+13*dpr]);rr(x,cx-tw/2,cy-13*dpr,tw,26*dpr,13*dpr);x.fillStyle='#ff4d8d';x.fill();x.lineWidth=2.5*dpr;x.strokeStyle='#ffffff';x.stroke();x.fillStyle='#ffffff';x.fillText('You!',cx,cy+dpr);}
  x.font=`800 ${13*dpr}px ${FONT}`;
  for(const [f,fx,fy,r,own] of fl){const tw=x.measureText(f.n).width/2,tk=taken.filter(o=>o!==own);   /* (run 4 finish: not tested against its own dot: with the air round it every side touched the dot, so no friend's name was drawn since stage 3) */   /* a friend's name above the dot, or below, right or left: where it covers nothing (else no name) */
    for(const [qx,qy] of[[fx,fy-17*dpr],[fx,fy+17*dpr],[fx+r+5*dpr+tw,fy],[fx-r-5*dpr-tw,fy]]){const q=[qx-tw,qy-9*dpr,qx+tw,qy+9*dpr];if(hit([q[0]-7*dpr,q[1]-2*dpr,q[2]+7*dpr,q[3]+2*dpr],tk))continue;taken.push(q);   /* with a little air round it (run 4, stage 3: "Finn" ran into "Duck Pond" and read as one name) */
      x.lineWidth=4*dpr;x.strokeStyle=P2.halo;x.strokeText(f.n,qx,qy);x.fillStyle=P2.txt;x.fillText(f.n,qx,qy);break;}}}
/* the card at the bottom: the place you picked (how far, 🚶 Let's go!, ✕), or a tip */
function mapCard(){const el=$('mpCard');if(!el)return;let h;
  if(NAV){const me=mapMe(),G=NAV.goal||NAV.door,d=Math.round(Math.hypot(G[0]-me.x,G[1]-me.z)),
      sub=CUR.id==='beach'?'Take the bus home first 🚌':MAPV.beach&&NAV.id==='bus'?d+' m away · the Beach Bus leaves from here 🏖️':NAV.actor?d+' m away · walking around':(CUR.id!=='city'?'Go outside first · ':'')+d+' m away';
    h=`<span class="mpc-i">${NAV.i}</span><span class="mpc-t"><b>${esc(NAV.n)}</b><span>${sub}</span></span><button class="btn mint mpgo" data-a="mapgo">🚶 Let's go!</button><button class="btn x" data-a="mapclr" aria-label="Stop showing the way">✕</button>`;}
  else h=MAPV.hint==='me'?`<span class="mpc-i">📍</span><span class="mpc-t"><span>That's you! The pink arrow points where you look.</span></span>`:`<span class="mpc-i">👆</span><span class="mpc-t"><span>Tap a place to see the way there!</span></span>`;
  if(h!==MAPV.ch){MAPV.ch=h;el.innerHTML=h;el.classList.toggle('go',!!NAV);el.classList.remove('tipgone');clearTimeout(MAPV.tipT);if(!NAV)MAPV.tipT=setTimeout(()=>{if(!NAV&&$('mpCard'))$('mpCard').classList.add('tipgone');},4000);}   /* (run 4, stage 3: the tip fades after a moment: it sat on the map's bottom row) */
  for(const b of document.querySelectorAll('#card .place')){const on=!!NAV&&b.dataset.a==='mapsel:'+(MAPV.beach&&NAV.id==='bus'?'beach':NAV.id);if(b.classList.contains('on')!==on){b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);}}}
function mapBounce(sel){const b=document.querySelector(sel);if(!b)return;MAPV.hop^=1;b.classList.remove('hop','hop2');b.classList.add(MAPV.hop?'hop':'hop2');}
/* tap on the map: your arrow, a badge or a name, a building, a lot on Friends Lane */
function mapTap(px,py){const me=mapMe(),[mx,my]=mapSP(me.x,me.z);
  let best=null,bd=1e9;for(const it of (MAPV.lay&&MAPV.lay.items)||[]){const [bx,by]=mapSP(it.x,it.z),d=Math.hypot(bx-px,by-py);if(d<it.R+10&&d<bd){bd=d;best=it;}
    else if(it.lab&&it.sl!==0&&!best){const [lx,ly,tw,th]=it.lab,[x1,y1,x2,y2]=it.sl||[lx,ly,lx+tw,ly+th];if(px>=bx+x1-6&&px<=bx+x2+6&&py>=by+y1-6&&py<=by+y2+6)best=it;}}
  if(Math.hypot(mx-px,my-py)<24&&(!best||bd>12)){ACT.mapme();return true;}
  if(!best){const [wx,wz]=mapWP(px,py);let ba=1e9;
    for(const p of PLACES){if(!mapShown(p))continue;const r=p.r,inside=r?Math.hypot(wx-p.x,wz-p.z)<=r+1:Math.abs(wx-p.x)<=p.w/2+1&&Math.abs(wz-p.z)<=p.d/2+1,ar=r?r*r*3:p.w*p.d;if(inside&&ar<ba){ba=ar;best={pl:p};}}
    const C=LOC.city;if(!best&&C&&C.lane)for(const lp of C.lane)if(Math.abs(wx-lp.X)<=6.6&&wz*lp.s>=6.5&&wz*lp.s<=26.5){const o=LANE.own[lp.j];best=o&&o.k===laneMe()?{pl:PLACES.find(q=>q.id==='home')}:o?{lot:lp.j}:{deco:'free'};break;}
    if(!best&&wx>-23.6&&wx<-10.4&&wz>-24.8&&wz<-6.8)best={deco:'fc'};}
  if(best)mapPick(best);return!!best;}
function mapPick(it,fit){
  if(it.deco){SFX.tap();toast(it.deco==='fc'?(fcOpen()?(HOL.cur==='halloween'?'🎃 The Flower Corner: the gate is open! The Spooky path winds through it after 18:00 👻':'🌸 The Flower Corner: the gate is open, come in!'):'🌸 The Flower Corner: a little garden full of flowers (the gate opens for holidays)!'):it.deco==='lane'?'🏡 Friends Lane: every friend who plays has a house here!':'💛 This spot is for a friend! When a friend plays with you, their house pops up here.',3.4);return;}
  let id,go;
  if(it.lot!=null){const o=LANE.own[it.lot],lp=LOC.city.lane[it.lot];if(!o||!lp)return;id='lot'+it.lot;go=()=>setNavTo({id,n:o.nm+"'s house",i:'🏠',nt:1,x:lp.hx,z:lp.hz,door:lotPt(it.lot,-17,-6.9)},true);}
  else{const pl=it.pl;if(!pl)return;id=pl.id;go=()=>{MAPV.beach=pl.id==='beach'&&CUR.id!=='beach';if(MAPV.beach)setNav('beach',true);else setNavTo(pl,true);};}
  const same=NAV&&!NAV.actor&&(NAV.id===id||(id==='beach'&&MAPV.beach&&NAV.id==='bus'));if(same&&id==='bus')MAPV.beach=false;   /* the bus stop itself now (not "the way to the beach"): its own row in the list and its own card */
  if(same){SFX.tap();mapCard();mapShow(fit);mapBounce('#mpCard');}else{go();SFX.pop();MAPV.hint='';mapCard();mapShow(fit);}   /* (the card first: the map makes room for it) */
  mapCard();mapZui();mapDraw();}
/* one finger drags, two fingers pinch; a short touch without moving is a tap */
function mapEv(cv){const at=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top];};
  const gest=()=>{const ps=[...MAPV.ptr.values()];if(ps.length===1)MAPV.g={n:1,x:ps[0].x,y:ps[0].y,cx:MAPV.cx,cz:MAPV.cz,drag:false};
    else if(ps.length>=2){const [a,c]=ps,mx=(a.x+c.x)/2,my=(a.y+c.y)/2,[wx,wz]=mapWP(mx,my);MAPV.g={n:2,d:Math.max(20,Math.hypot(a.x-c.x,a.y-c.y)),s:MAPV.s,wx,wz};}else MAPV.g=null;};
  cv.addEventListener('pointerdown',e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId);}catch(_){}const [px,py]=at(e);MAPV.ptr.set(e.pointerId,{x:px,y:py});
    MAPV.tap=MAPV.ptr.size===1?{id:e.pointerId,x:px,y:py,t:performance.now()}:null;gest();});
  cv.addEventListener('pointermove',e=>{const p=MAPV.ptr.get(e.pointerId),g=MAPV.g;if(!p||!g)return;[p.x,p.y]=at(e);const ps=[...MAPV.ptr.values()];
    if(g.n===1&&ps.length===1){const dx=p.x-g.x,dy=p.y-g.y;if(!g.drag&&Math.hypot(dx,dy)<8)return;g.drag=true;MAPV.cx=g.cx-dx/MAPV.s;MAPV.cz=g.cz-dy/MAPV.s;}
    else if(g.n===2&&ps.length>=2){const [a,c]=ps;MAPV.s=clamp(g.s*Math.hypot(a.x-c.x,a.y-c.y)/g.d,mapSmin(),MAP_SMAX);MAPV.cx=g.wx-((a.x+c.x)/2-MAPV.W/2)/MAPV.s;MAPV.cz=g.wz-((a.y+c.y)/2-MAPV.H/2)/MAPV.s;}
    else return;mapClampV();mapDraw();});
  const up=e=>{if(!MAPV.ptr.has(e.pointerId))return;const T=MAPV.tap,[px,py]=at(e);MAPV.ptr.delete(e.pointerId);
    if(e.type==='pointerup'&&T&&T.id===e.pointerId&&Math.hypot(px-T.x,py-T.y)<10&&performance.now()-T.t<800){const L=MAPV.last,now=performance.now();
      if(L&&now-L.t<380&&Math.hypot(px-L.x,py-L.y)<30&&!L.hit){MAPV.last=null;mapZoom(1.6,px,py);}else MAPV.last={t:now,x:px,y:py,hit:mapTap(px,py)};}   /* a double tap on the map zooms in */
    MAPV.tap=null;gest();mapZui();mapDraw();};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('lostpointercapture',up);
  cv.addEventListener('wheel',e=>{e.preventDefault();const [px,py]=at(e);mapZoom(Math.exp(-clamp(e.deltaY*(e.deltaMode?30:1),-150,150)*.0028),px,py);},{passive:false});
  cv.addEventListener('gesturestart',e=>e.preventDefault());}
/* open the map: centred on you at a comfy zoom (the list of places is at the side on big screens, behind 📋 Places on small ones) */
function openMap(){const narrow=window.matchMedia&&matchMedia(MAP_NARROW).matches;PH.app='map';PH.chat=null;
  Object.assign(MAPV,{on:true,W:0,H:0,g:null,tap:null,last:null,bv:null,lay:null,rk:'',rt:null,hint:'',ch:'',list:!narrow,you:performance.now()/1000});MAPV.ptr.clear();   /* "You!" pops up for a moment */
  if(!NAV)MAPV.beach=false;
  const list=PLACES.filter(mapShown).map(p=>`<button class="place" data-a="mapsel:${p.id}" aria-pressed="false"><span class="pi">${p.i}</span>${esc(p.n)}</button>`).join('');
  openPanel(`<div class="mp${MAPV.list?' lst':''}" role="dialog" aria-label="Map"><div class="mp-hd"><button class="btn x" data-a="phapp:" aria-label="Back to the phone">‹</button><h2>🗺️ Map</h2>
    <button class="btn white mpl${MAPV.list?' on':''}" data-a="maplist" aria-pressed="${MAPV.list}">📋 Places</button><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    <div class="mp-body"><div class="mp-list"><div class="places">${list}</div></div><div class="mp-wrap"><canvas id="mapc" aria-label="Map of Cozy Town"></canvas>
    <div class="mp-ctl"><button class="btn mpb me" data-a="mapme" aria-label="Show me where I am">📍 Me</button><button class="btn mpb" data-a="mapz:1" aria-label="Zoom in">+</button><button class="btn mpb" data-a="mapz:-1" aria-label="Zoom out">−</button></div>
    <div class="mp-card" id="mpCard" role="status"></div></div></div></div>`,{cls:'mapcard',onClose:()=>{mapOff();PH.app=null;PH.chat=null;PH.jobs=false;}});
  mapCtlPlace();mapEv($('mapc'));mapCard();mapDraw();setTimeout(()=>{if(MAPV.on)mapDraw(true);},0);const ml=document.querySelector('#card .mp-list');if(ml)ml.addEventListener('scroll',mapListMore,{passive:true});}
function mapOff(){MAPV.on=false;MAPV.ptr.clear();MAPV.g=null;MAPV.bv=null;MAPV.lay=null;if(MAPV.base){MAPV.base.width=MAPV.base.height=0;MAPV.base=null;}}
function mapCtlPlace(){const c=document.querySelector('.mp-ctl'),h=document.querySelector('.mp-hd');if(!c||!h)return;if(innerWidth>innerHeight&&innerHeight<520||innerWidth>=900){c.classList.add('inhd');h.insertBefore(c,h.querySelector('[data-a="close"]'));}}   /* 📍 on a phone held sideways the Me and zoom buttons move up into the title row, off the map's labels (run 4, stage 3) */
function mapTick(){if(!$('mapc')){mapOff();return;}mapCard();mapDraw();mapListMore();}
/* 🧹 glitch fixes, pass 2 (the map on small phones): held upright, the card's buttons go under its words (the words had ~150 px: 5 lines);
   held sideways, the list of places has 5 narrower columns, so every place fits; a list that still scrolls shows a little bouncing ⬇️ */
{const st=document.createElement('style');st.textContent='@media (max-width:440px){.mp-card.go{flex-wrap:wrap;row-gap:6px}.mp-card.go .mpc-t{flex:1 1 calc(100% - 40px)}.mp-card.go .mpgo{flex:1 1 auto}}'
  +'@media (max-height:500px){.mp-list .places{grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:5px}.mp-list .place{min-height:44px;padding:3px 6px;gap:4px;font-size:13px;line-height:1.1}.mp-list .place .pi{font-size:18px}}'
  +'.mp-list.more::after{content:"⬇️";position:sticky;bottom:0;z-index:3;display:block;height:46px;margin:-46px 0 0;padding-top:20px;box-sizing:border-box;background:linear-gradient(to bottom,transparent,var(--paper) 62%);font-size:19px;line-height:22px;text-align:center;pointer-events:none}body:has(#panel:not([hidden]) #card .mp) #left{visibility:hidden}';
 document.head.appendChild(st);}
function mapListMore(){const l=document.querySelector('#card .mp-list');if(l)l.classList.toggle('more',!!MAPV.list&&l.scrollHeight-l.clientHeight-l.scrollTop>12);}
ACT.mapsel=id=>{const pl=PLACES.find(p=>p.id===id);if(!pl)return;if(MAPV.list&&window.matchMedia&&matchMedia(MAP_NARROW).matches)ACT.maplist();mapPick({pl},true);};   /* from the list: show you and the place */
ACT.mapgo=()=>{const n=NAV;closePanel();if(!n)return;SFX.pop();toast(CUR.id==='beach'?'🚌 Take the bus home first, then follow the arrow to '+theN(n)+'!':MAPV.beach&&n.id==='bus'?'🏖️ The beach bus leaves from the 🚌 bus stop at the park. Follow the arrow!':'📍 Follow the arrow to '+theN(n)+'!',3);};
ACT.mapclr=()=>{clearNav();MAPV.beach=false;MAPV.hint='';mapCard();mapDraw();};
ACT.mapme=()=>{mapHome(false);MAPV.you=performance.now()/1000;MAPV.hint='me';mapBounce('#card [data-a="mapme"]');mapCard();mapZui();mapDraw();};
ACT.mapz=d=>{mapZoom(+d>0?1.6:1/1.6);};
/* ⌨️ on a PC: + and − zoom, the arrow keys (or W A S D) move the map, M closes it */
function mapKeys(e){const c=e.code;if(c==='KeyM'){closePanel();return true;}if(c==='Equal'||c==='NumpadAdd'){mapZoom(1.6);return true;}if(c==='Minus'||c==='NumpadSubtract'){mapZoom(1/1.6);return true;}
  const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1],KeyA:[-1,0],KeyD:[1,0],KeyW:[0,-1],KeyS:[0,1]}[c];if(!d)return false;e.preventDefault();MAPV.cx+=d[0]*80/MAPV.s;MAPV.cz+=d[1]*80/MAPV.s;mapClampV();mapDraw();return true;}
ACT.maplist=()=>{MAPV.list=!MAPV.list;const m=document.querySelector('#card .mp'),b=document.querySelector('#card [data-a="maplist"]');if(m)m.classList.toggle('lst',MAPV.list);
  if(b){b.classList.toggle('on',MAPV.list);b.setAttribute('aria-pressed',MAPV.list);}setTimeout(()=>{if(MAPV.on)mapDraw();},0);};
if(MAP_MQ){const f=()=>{if(MAPV.on)mapDraw(true);};if(MAP_MQ.addEventListener)MAP_MQ.addEventListener('change',f);else if(MAP_MQ.addListener)MAP_MQ.addListener(f);}
/* showing the way to a place */
let NAV=null,BEACON=null;
function setNav(id,quiet){if(id==='beach'&&CUR&&CUR.id!=='beach'){setNavTo(PLACES.find(p=>p.id==='bus'),quiet);if(!quiet)toast('🏖️ The beach bus leaves from the 🚌 bus stop at the park. Follow the arrow!',3.6);return;}   /* 🚌 the bus is the way to the beach */
  const pl=PLACES.find(p=>p.id===id);if(pl)setNavTo(pl,quiet);}
function setNavTo(pl,quiet){NAV=pl.actor?pl:Object.assign({},pl,{goal:pl.door,door:pl.door.slice()});if(!quiet)closePanel();   /* NAV.door: where the arrow points now (updNav), NAV.goal: the place */
  if(!BEACON){BEACON=new THREE.Group();const m=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,16,12,1,true),new THREE.MeshBasicMaterial({color:'#ff7aa8',transparent:true,opacity:.35,depthWrite:false,side:THREE.DoubleSide}));m.position.y=8;BEACON.add(m);LOC.city.dyn.add(BEACON);}
  if(BEACON.pin){BEACON.remove(BEACON.pin);}const pin=label(pl.i,1.4,{bg:null,bw:0,pad:6});pin.position.y=3.4;BEACON.add(pin);BEACON.pin=pin;BEACON.position.set(pl.door[0],0,pl.door[1]);BEACON.visible=true;
  $('nav').hidden=false;if(!quiet){SFX.pop();toast('📍 Follow the arrow to '+theN(pl)+'!',2.8);}updNav();}
function clearNav(){NAV=null;$('nav').hidden=true;if(BEACON)BEACON.visible=false;}
function updNav(){if(!NAV)return;if(NAV.actor){const f=NAV.actor;if(f.mode==='away'){toast('😴 '+NAV.n+' went home to sleep.',3);clearNav();return;}if(f.loc===CUR.id&&CUR.id!=='city'){toast('📍 You found '+NAV.n+'! 🎉',2.8,2);SFX.yay();clearNav();return;}
    if(f.loc==='city'){NAV.door[0]=f.x;NAV.door[1]=f.z;if(BEACON)BEACON.position.set(f.x,0,f.z);}}
  if(CUR.id!=='city'){if(INSIDE_AT[CUR.id]===NAV.id){qEvent('find:'+NAV.id);toast('📍 You found '+theN(NAV)+'! 🎉',2.8,2);SFX.yay();clearNav();return;}if(CUR.id==='beach'){navBeach();return;}navSet(NAV.i+' '+NAV.n+': go outside first','none');return;}
  const G=NAV.goal;if(G){const a=P.x>-84,b=G[0]>-84;let w=a===b?G:[a?Math.max(P.x-12,-88):Math.min(P.x+12,-80),0];   /* 🏡 between town and Friends Lane: along the middle of the big road */
    if(!a&&Math.abs(P.z)>6.8){const r=laneOut(P.x,P.z);if(r.length>2)w=r.find(q=>Math.hypot(q[0]-P.x,q[1]-P.z)>1)||w;}   /* in a yard or garden on Friends Lane: out by the gate first */
    NAV.door[0]=w[0];NAV.door[1]=w[1];}
  const dx=NAV.door[0]-P.x,dz=NAV.door[1]-P.z,d=G?Math.hypot(G[0]-P.x,G[1]-P.z):Math.hypot(dx,dz);if(d<3.2){if(NAV.id==='beach'){toast('🏖️ This gate is just for looking! 🚌 The beach bus leaves from the park.',3.4,2);SFX.pop();clearNav();return;}qEvent('find:'+NAV.id);toast('📍 You found '+theN(NAV)+'! 🎉'+(NAV.actor?' Talk to her!':''),2.8,2);SFX.yay();clearNav();return;}
  const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),rx=Math.cos(P.yaw),rz=-Math.sin(P.yaw),rel=Math.atan2(dx*rx+dz*rz,dx*fx+dz*fz);
  navSet(NAV.i+' '+NAV.n+' '+Math.round(d)+' m',`rotate(${rel}rad)`);}
/* the pink arrow bar: its words change only when they really change (a new text reflows the HUD column) */
function navSet(t,tf){const a=$('navArrow'),b=$('navTxt');if(b.textContent!==t)b.textContent=t;if(a.style.transform!==tf)a.style.transform=tf;}
/* 🏖️ at the beach the arrow shows the way to the beach bus stop: the bus takes you to town first (then it points to your place again) */
function navBeach(){const [x,z]=busW(2.2,1.9,busXZ('beach',0)),dx=x-P.x,dz=z-P.z,fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),rx=Math.cos(P.yaw),rz=-Math.sin(P.yaw);
  navSet(NAV.id==='home'?'🚌 Take the bus home':'🚌 Take the bus to town',Math.hypot(dx,dz)<2.5?'none':`rotate(${Math.atan2(dx*rx+dz*rz,dx*fx+dz*fz)}rad)`);}
$('navX').addEventListener('click',()=>{SFX.tap();clearNav();});
function qCard(Q,st,k,hard){let foot;const p=hard?'h':'q',steps=Q.steps;
  const total=steps?steps.length:Q.n,done=steps?(st?steps.filter((sp,i)=>((st.c||[])[i]||0)>=sp.n).length:0):Math.floor(st&&st.n||0);
  const list=steps?`<ul class="qsteps">${steps.map((sp,i)=>{const c=st&&st.c?(st.c[i]||0):0,ok=c>=sp.n;return`<li class="${ok?'ok':''}"><i>${ok?'✔':'○'}</i><span>${esc(sp.d).replace(/ at the (.+)$/,(m,a)=>' at the '+a.replace(/ /g,'\u00a0'))}${sp.n>1&&!ok&&st?' ('+Math.floor(c)+'/'+sp.n+')':''}</span></li>`;}).join('')}</ul>`:'';
  if(!st)foot=`<button class="btn mint qbtn" data-a="${p}sign:${k}">Sign up</button>`;
  else if(st.s==='on')foot=`<span class="qprog"><i style="width:${Math.round(done/total*100)}%"></i></span><span class="qn">${done}/${total}${steps?' steps':''}</span>`;
  else if(st.s==='ready')foot=`<button class="btn butter qbtn" data-a="${p}get:${k}">Get ${Q.r} 🪙</button>`;
  else foot=`<span class="qdone">✔ Done</span>`;
  return`<div class="qcard${hard?' hard':''}"><div class="qtop"><span class="qi">${Q.i}</span><div><div class="qt">${esc(Q.t)}${hard?'<span class="qtag">🔥 Hard</span>':''}${steps?'<span class="qtag tricky">🧩 Tricky</span>':''}</div><div class="qd">${esc(Q.d)}</div></div></div>${list}<div class="qfoot"><span class="qr">${Q.r} 🪙</span>${foot}</div></div>`;}
function openPhone(app,chat){PH.app=app||null;PH.chat=chat||null;PH.jobs=false;if(chat){msgs().u[chat]=0;updPhoneBadge();}SFX.tap();renderPhone();}
const phDate=()=>`${wdName()}${psLeft()?' · 🏆 Pet Show today!':''}`;
/* 🕐 an open phone keeps its clock right: refreshed with the HUD clock */
function phClock(){const ph=UI.open&&$('card').querySelector('.phone');if(!ph)return;const c=clockStr(S.time),set=(el,v)=>{if(el&&el.textContent!==v)el.textContent=v;};
  set(ph.querySelector('.ph-status span'),c);set(ph.querySelector('.ph-clock'),c);set(ph.querySelector('.calic i'),c);set(ph.querySelector('.ph-date'),phDate());}
function renderPhone(){if(PH.app==='map'){openMap();return;}if(MAPV.on)mapOff();hardCheck();const a=PH.app,q=S.q,ready=readyCount();let body='';
  if(!a){body=`<div class="ph-clock">${clockStr(S.time)}</div><div class="ph-date">${phDate()}</div>
    <div class="apps"><button class="app" data-a="phapp:msg"><span class="ic" style="background:#5fd4b0">💬</span>Messages${msgUnread()?`<span class="badge">${msgUnread()}</span>`:''}</button><button class="app" data-a="phapp:quest"><span class="ic" style="background:#ffd45c">🏆</span>Quest${ready?`<span class="badge">${ready}</span>`:''}</button>
    <button class="app" data-a="phapp:skills"><span class="ic" style="background:#b79cff">⭐</span>Skills</button>
    <button class="app" data-a="phapp:pets"><span class="ic" style="background:#7fdcb5">🐾</span>Pets</button>
    <button class="app" data-a="phapp:map"><span class="ic" style="background:#7cc8ff">🗺️</span>Map</button>
    <button class="app" data-a="phapp:mp"><span class="ic" style="background:#ff9ec4">👫</span>Friends</button>
    <button class="app" data-a="phapp:job"><span class="ic" style="background:#ffb36b">💼</span>Job${hasDlOrder()||(S.job==='designer'&&S.ds&&S.ds.o)||(S.job==='teacher'&&S.tc&&S.tc.o)?'<span class="badge">!</span>':''}</button>
    <button class="app" data-a="phapp:furn"><span class="ic" style="background:#ff9ec4">🛋️</span>Furniture</button>
    <button class="app" data-a="phapp:cal"><span class="ic calic" aria-hidden="true"><b>${wdName().slice(0,3).toUpperCase()}</b><i class="tm">${clockStr(S.time)}</i></span>Calendar${psLeft()?'<span class="badge">!</span>':''}</button></div>`;}
  else{const hd=(t)=>`<div class="ph-hd"><button class="btn ph-back" data-a="phapp:" aria-label="Back to home screen">‹</button><h3>${t}</h3><span class="ph-coins">🪙 ${S.coins}</span></div>`;
    if(a==='quest'){const tab=PH.tab,dr=Object.values(q.st).filter(s=>s.s==='ready').length,hr=Object.values(S.hard).filter(s=>s.s==='ready').length;
      body=hd('🏆 Quest')+`<div class="ph-tabs"><button class="pill ${tab==='daily'?'on':''}" data-a="qtab:daily">📅 Daily${dr?' ('+dr+')':''}</button><button class="pill ${tab==='hard'?'on':''}" data-a="qtab:hard">🔥 Hard${hr?' ('+hr+')':''}</button></div>`;
      if(tab==='daily')body+=`<p class="ph-sub">Sign up for a quest, do it, and get money!</p>`+q.list.filter(k=>getQ(k)).map(k=>qCard(getQ(k),q.st[k],k,false)).join('')+`<p class="ph-sub" style="margin-top:14px;text-align:center">Finish a quest and a brand new one shows up!</p>`;
      else{const ord=k=>{const st=S.hard[k];return !st?2:st.s==='ready'?0:st.s==='on'?1:3;};body+=`<p class="ph-sub">Big challenges with big rewards! Finish one and a harder one pops up. 🔥</p>`+Object.keys(HARD).sort((a,b)=>ord(a)-ord(b)).map(k=>qCard(hq(k)||HARD[k],S.hard[k],k,true)).join('');}}
    else if(a==='mp'){body=hd('👫 Friends')+mpPhone();}
    else if(a==='job'){body=hd('💼 Job')+jobPhone();}
    else if(a==='furn'){body=hd('🛋️ Furniture')+furnPhone();setTimeout(thumbFill,0);}
    else if(a==='msg'){const C=PH.chat&&CHATS[PH.chat];body=(C?`<div class="ph-hd"><button class="btn ph-back" data-a="chat:" aria-label="Back to chats">‹</button><h3 class="chh"><span class="cav hcav" style="background:${C.c}">${C.av}</span>${C.h||C.n.split(' · ')[0]}</h3><span class="ph-coins">🪙 ${S.coins}</span></div>`:hd('💬 Messages'))+msgPhone();}
    else if(a==='cal'){body=hd('🗓️ Calendar')+calBody();}
    else if(a==='skills'){body=hd('⭐ Skills')+'<p class="ph-sub">Do things in town to level up your skills!</p>'+Object.keys(SKILLS).map(k=>{const s=sk(k),K=SKILLS[k],need=xpNeed(s.lv),pct=s.lv>=MAXLV?100:Math.round(s.xp/need*100);
      return`<div class="qcard"><div class="qtop"><span class="qi">${K.i}</span><div style="flex:1"><div class="qt">${K.n}</div><div class="qd">${K.how}</div></div><div class="sklv">Level<b>${s.lv}</b></div></div><div class="qfoot"><span class="qprog" style="max-width:none"><i style="width:${pct}%"></i></span><span class="qn">${s.lv>=MAXLV?'Max!':s.xp+'/'+need}</span></div></div>`;}).join('');}
    else{body=hd('🐾 Pets')+(S.pets.map(d=>`<div class="ph-row"><span>${PET_TYPES[petKind(d)].icon} ${esc(d.name)}</span><span class="hearts">${hearts(clamp(Math.round(d.happy/20),0,5))}</span></div>`).join('')||'<p class="ph-sub">Visit the pet shop to adopt a pet!</p>');}}
  openPanel(`<div class="phone" role="dialog" aria-label="Phone"><div class="ph-status"><span>${clockStr(S.time)}</span><span>${PH.app?"":"🪙 "+S.coins}</span></div><div class="ph-screen">${body}</div><button class="ph-home" data-a="close" aria-label="Close phone"></button></div>`,{cls:'phonecard',onClose:()=>{PH.app=null;PH.chat=null;PH.jobs=false;}});
  if(PH.app==='msg'&&PH.chat){const sc=document.querySelector('#card .ph-screen');if(sc){sc.scrollTop=sc.scrollHeight;const q=PH.jobs&&[...sc.querySelectorAll('.bub.them')].pop(),hd=sc.querySelector('.ph-hd');const l=q||[...sc.querySelectorAll('.bub')].pop();if(l){const t=l.getBoundingClientRect().top-sc.getBoundingClientRect().top-(hd?hd.offsetHeight:0)-6;if(q||t<0)sc.scrollTop+=t;}}}}   /* (run 4 finish: a newest message taller than the screen opens at its top: the thank-you photo's top was under the header on a sideways phone) */   /* (the job cards: from Rosie's question down, so on a short screen the first jobs are in view; run 4, stage 3) */
ACT.phapp=a=>{PH.app=a||null;PH.chat=null;PH.jobs=false;renderPhone();};
ACT.nav=id=>setNav(id);
ACT.mpretry=()=>{MP.tries=Math.max(MP.tries,1);clearTimeout(MP.rt);mpConnect();};ACT.mphelp=()=>{MP.help=!MP.help;renderPhone();};
ACT.mpgo=i=>{const a=MP.list[+i];if(!a)return;if(a.loc==='home'){goKnock(a.peer);return;}if(a.loc==='visit'){if(MP.me&&a.ho===MP.me)ACT.gohome();else if(a.ho&&MP.peers.has(a.ho))goKnock(a.ho);else toast('🏠 '+a.nm+' is visiting a friend. Try again soon!',3);return;}
  if(a.loc!=='studio'&&busWarp(a.loc==='beach'?'beach':'city',a.nm))return;   /* 🚌 the beach and back: only by bus */
  if(a.loc==='studio'){toast('👗 '+a.nm+' is changing clothes. Try again soon!',3);return;}if(a.loc==='city'){const sp=citySpot(a);warpTo('city',sp[0],sp[1],a.nm);return;}warpTo(a.loc,a.rx,a.rz,a.nm);};
ACT.mpvisit=i=>{const a=MP.list[+i];if(a)goKnock(a.peer);};
ACT.mpsay=i=>{mpSay(+i);if(!PH.app)closePanel();};ACT.mpemo=i=>{mpSay(undefined,+i);if(!PH.app)closePanel();};
ACT.qtab=t=>{PH.tab=t;renderPhone();};
ACT.hsign=k=>{S.hard[k]={s:'on',n:0};SFX.pop();toast('Signed up: '+hq(k).t+'! 🔥',2.6);change();renderPhone();};
ACT.hget=k=>{const st=S.hard[k],H=hq(k);if(!st||st.s!=='ready'||!H)return;S.coins+=H.r;SFX.coin();SFX.yay();
  const lv=(st.lv|0)+1,N=hq(k,lv);if(N){S.hard[k]={s:'on',n:0,lv};setTimeout(()=>{SFX.pop();toast('🔥 New challenge: '+N.t+'! '+N.d,4.2);},800);}else st.s='done';
  updPhoneBadge();change();renderPhone();hardCheck();};
ACT.qsign=k=>{const Q=getQ(k);if(!Q)return;S.q.st[k]={s:'on',n:0};SFX.pop();toast('Signed up: '+Q.t+'! '+Q.i,2.6);change();renderPhone();};
ACT.qget=k=>{const st=S.q.st[k],Q=getQ(k);if(!st||st.s!=='ready'||!Q)return;st.s='done';S.coins+=Q.r;SFX.coin();SFX.yay();
  const idx=S.q.list.indexOf(k),C=questCandidates(Math.random),hist=new Set(S.qhist||[]),base=(Q.steps?C.tricky:C.simple).filter(q=>!S.q.used.includes(q));
  const pool=base.filter(q=>!hist.has(q)).length?base.filter(q=>!hist.has(q)):base;
  if(idx>=0&&pool.length){const nk=pick(pool),N=getQ(nk);S.q.list[idx]=nk;S.q.used.push(nk);qHist([nk]);delete S.q.st[k];setTimeout(()=>toast('📱 New quest: '+N.t+' '+N.i,3),900);}
  updPhoneBadge();change();renderPhone();};

/* recipe book */
function recipeInfo(r){const F=FOODS[r.id];return{n:r.n||F.n,i:r.i||F.i,out:r.makes?r.makes:[r.id,1]};}
function openRecipes(){S.cooked=S.cooked||{};
  const rows=RECIPES.map(r=>{const R=recipeInfo(r),can=Object.entries(r.need).every(([k,n])=>(S.bag[k]||0)>=n),O=FOODS[R.out[0]];
    return`<div class="rc"><div class="qtop"><span class="qi">${R.i}</span><div style="flex:1"><div class="qt">${esc(R.n)}${S.cooked[r.id]?' ✔':''}</div><div>${Object.entries(r.need).map(([k,n])=>{const it=itemInfo(k),ok=(S.bag[k]||0)>=n;return`<span class="ing ${ok?'ok':''}">${it.i} ${n>1?n+' ':''}${esc(it.n)}</span>`;}).join('')}</div></div></div>
      <div class="qfoot"><span class="qr">Makes ${R.out[1]>1?R.out[1]+' ':''}${O.i}</span><button class="btn ${can?'mint':'white'} qbtn" data-a="cookr:${r.id}" ${can?'':'disabled'}>Cook</button></div></div>`;}).join('');
  openPanel(`<div class="hd"><h2>📖 Recipes</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><p class="note">Buy ingredients at the market, or grow them in your garden!</p>${rows}`);}
ACT.cookr=id=>{const r=RECIPES.find(x=>x.id===id);if(!r)return;if(!Object.entries(r.need).every(([k,n])=>(S.bag[k]||0)>=n))return;
  for(const [k,n] of Object.entries(r.need))S.bag[k]-=n;const R=recipeInfo(r);S.bag[R.out[0]]=(S.bag[R.out[0]]||0)+R.out[1];S.cooked=S.cooked||{};S.cooked[id]=1;
  SFX.pop();SFX.yay();toast('You made '+R.n.toLowerCase()+'! '+R.i+' It\'s in your bag 🎒',3.2);addXP('cook',6);qEvent('cook');qEvent('cook:'+id);change();openRecipes();};

/* settings */
function openSettings(){const fromTitle=!PLAYING;
  openPanel(`<div class="hd"><h2>⚙️ Settings</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    <div class="opt"><span>Look speed</span><span class="row" style="margin:0">${[['Slow',.6],['Normal',1],['Fast',1.6]].map(([n,v])=>`<button class="btn ${SET.look===v?'butter':'white'}" data-a="slook:${v}">${n}</button>`).join('')}</span></div>
    <div class="opt"><span>Sound</span><button class="btn ${SET.sound?'mint':'white'}" data-a="ssound">${SET.sound?'🔊 On':'🔇 Off'}</button></div>
    <div class="opt"><span>Graphics</span><span class="row" style="margin:0"><button class="btn ${SET.gfx==='nice'?'butter':'white'}" data-a="sgfx:nice">Pretty</button><button class="btn ${SET.gfx==='fast'?'butter':'white'}" data-a="sgfx:fast">Fast</button></span></div>
    <div class="opt"><span>🍕 Pizza job</span><button class="btn white" data-a="tutgo">📖 Show me the tips</button></div>
    <div class="opt"><span>🎨 Designer job</span><button class="btn white" data-a="dtutgo">📖 Show me the tips</button></div>
    <div class="opt"><span>✂️ Hairstylist job</span><button class="btn white" data-a="hstutgo">📖 Show me the tips</button></div>
    <div class="opt"><span>📸 Photographer job</span><button class="btn white" data-a="pttutgo">📖 Show me the tips</button></div>
    <div class="opt"><span>✏️ Notepad</span><span class="row" style="margin:0"><button class="btn ${SET.pad!==false?'mint':'white'}" data-a="spad" aria-pressed="${SET.pad!==false}">${SET.pad!==false?'✏️ On':'Off'}</button><button class="btn ${PAD.del?'butter':'white'}" data-a="padrest"${PAD.del?'':' disabled'}>↩️ Last page</button></span></div>
    ${PLAYING&&S&&S.pets.length?`<div class="opt"><span>🐾 Pets</span><button class="btn mint" data-a="fetchpets">🐾 Bring my pets to me</button></div>`:''}
    ${PLAYING?'<div class="opt"><span>Stuck somewhere?</span><button class="btn mint" data-a="gohome">🏠 Take me home</button></div>':''}
    ${MV.on?'<div class="opt"><span>📱 Another iPad or phone</span><button class="btn sky" data-a="mvopen">📦 Move my game</button></div>':''}
    ${mvBefore()?'<div class="opt"><span>↩️ Your old game</span><button class="btn white" data-a="mvundo">↩️ Bring it back</button></div>':''}
    <p class="note">${TOUCHY?'Walk: drag on the left side. Look: drag on the right side. Jump: ⬆️. Run: 🏃. Tap things to use them.':'Walk: WASD. Look: drag with the mouse. Jump: Space. Run: hold Shift. Use things: E or click. Bag: B.'}<br>✏️ Notepad: draw on it! Tap it 2× for a new page, 3× to go back, 4× to delete.</p>
    <div class="row"><button class="btn coral" data-a="wipe">🗑️ Start a new game</button></div>`,{cls:'setcard',onClose:()=>{WIPE=false;}});}
ACT.fetchpets=()=>{if(!S||!S.pets.length){toast('You don\'t have any pets yet! Adopt one at the Pet Shop. 🐾',3);return;}
  let n=0;for(const p of PET_ACTORS)p.loc=null;for(const p of PET_ACTORS){const d=p.d;d.stay=false;nearMe(p,++n,1);
    d.loc=p.loc;p.tx=p.x;p.tz=p.z;[d.x,d.z]=toSave(p.loc,p.x,p.z);p.g.visible=true;p.g.position.set(p.x,p.g.position.y,p.z);}
  SFX.yay();change();saveLocal();const nm=S.pets.length===1?S.pets[0].name:S.pets.length+' pets';toast('🐾 '+nm+' '+(S.pets.length===1?'is':'are')+' right here with you!',3);closePanel();};
ACT.gohome=()=>{if(CUR.id==='beach'&&!CR){closePanel();if(DECO.on)decoEnd();fade(()=>{const L=LOC.beach,d=DOORS.beach.inside;P.sit=null;P.ride=null;P.x=L.ox+d[0];P.z=L.oz+d[1];P.yaw=d[2];P.pitch=0;bringFollowers();saveLocal();busWarp('city');setNav('home',true);});return;}   /* at the beach: back to the boardwalk (home is by bus), and the pink arrow shows the way to your house */
  closePanel();if(DECO.on)decoEnd();fade(()=>{if(CR){if(CR.av)scene.remove(CR.av.root);CR=null;camera.clearViewOffset();}setLoc('home');const L=LOC.home;P.x=L.ox;P.z=L.oz+DOORS.home.inside[1];P.yaw=0;P.pitch=0;P.sit=null;P.ride=null;
  $('hud').hidden=false;resize();bringFollowers();saveLocal();toast('Home sweet home! 🏡',2.6);});};
let WIPE=false;
ACT.slook=v=>{SET.look=+v;saveSet();openSettings();};
ACT.ssound=()=>{SET.sound=!SET.sound;saveSet();audioInit();openSettings();};
ACT.spad=()=>{SET.pad=SET.pad===false;saveSet();dcardUpd(true);leftFit();openSettings();};   /* ✏️ the Notepad switch (run 4, item 24): off hides the notepad, on brings it back; the notes stay in their own storage */
ACT.sgfx=v=>{SET.gfx=v;saveSet();applyGfx();openSettings();};
ACT.padrest=()=>{if(!PAD.del){toast('No deleted page to bring back',2);return;}SFX.tap();
  openPanel(`<div class="hd"><h2>✏️ Last page</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div><p class="line">Do you want to bring back the last page you deleted?</p><canvas id="padPrev" width="340" height="230"></canvas><div class="row"><button class="btn mint" data-a="padyes">✅ Yes, bring it back</button><button class="btn white" data-a="padno">No</button></div>`);
  const c=$('padPrev');padPaint(c.getContext('2d'),c.width,c.height,PAD.del,2,false);};
ACT.padyes=()=>{if(!PAD.del)return;const L=PAD.pages.length-1;if(!PAD.pages[L].length)PAD.pages[L]=PAD.del;else PAD.pages.push(PAD.del);PAD.del=null;PAD.i=PAD.pages.length-1;padSave();padFlip();closePanel();SFX.yay();toast('📄 Your page is back!',2.4);};
ACT.padno=()=>openSettings();
/* 🗑️ Start a new game: a card of its own asks first ("No, keep my game" / "Yes, start over", in other places than the Settings button, and a
   second tap within 0.8 s doesn't count), and the game is kept: ⚙️ Settings → ↩️ Bring it back (the same place Move my game keeps a game) */
ACT.wipe=()=>{const h=mvHere(),pets=h&&Array.isArray(h.pets)?h.pets.length:0;WIPE=performance.now()||1;
  openPanel(`<div class="hd"><h2>🗑️ Start a new game?</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>
    ${h?`<div class="mvgame"><b>${mvNm(h)}</b><span>🪙 ${Math.round(+h.coins||0)}${pets?' · 🐾 '+pets+(pets>1?' pets':' pet'):''}</span></div>`:''}
    <p class="line">${h?'Your game goes away and a brand-new game starts. You can bring it back later in ⚙️ Settings.':'A brand-new game starts.'}</p>
    <div class="row"><button class="btn mint" data-a="close">💗 No, keep my game</button><button class="btn coral" data-a="wipeyes">🗑️ Yes, start over</button></div>`,{cls:'wipeask',onClose:()=>{WIPE=false;}});};
ACT.wipeyes=()=>{if(!WIPE||!mvOn('wipeask')){toast('💗 Your game is still here!',2.4);return;}   /* (only right after "Start a new game") */
  if(performance.now()-WIPE<800)return;   /* the second tap of a quick double tap: it doesn't count */
  WIPE=false;try{if(PLAYING&&DECO.on)decoEnd();}catch(e){}if(PLAYING&&S)saveLocal();let old=null;try{old=localStorage.getItem(LS);}catch(e){}   /* (furniture in your hands goes back to storage first) */
  if(mvGame(old)){try{localStorage.setItem(MV.OLD,old);}catch(e){closePanel();toast('😢 Oops, that did not work. Your game is still here!',3.4);return;}   /* kept: ↩️ Bring it back */
    try{sessionStorage.setItem('cozytown-new','1');}catch(e){}}   /* (the title says where it is) */
  SAVEOFF=true;clearTimeout(CSAVE.tm);CSAVE.dirty=false;   /* (SAVEOFF: leaving the page used to save the old game right back) */
  try{localStorage.removeItem(LS);}catch(e){}CSAVE.remote=null;if(CSAVE.ref){CSAVE.ref.delete().catch(()=>{});CSAVE.ref=null;}location.reload();};
/* 📦 Move my game (GitHub version only). Device 1 sends its save under a 6-letter code that works for 10 minutes
   (worlds/cozy-town/move/<CODE>); device 2 types the code and gets the very same save: it replaces the game there and the page
   starts again, the same way as opening the game. The code is taken down when it is used, runs out, or its card closes.
   The database says no (or inside Claude, whose saves already follow your claude.ai account) = no button in Settings. */
const MV={on:false,dead:false,ref:null,off:0,code:'',exp:0,iv:0,lis:null,tries:[],got:null,mk:false,go:false,
  PATH:'worlds/cozy-town/move',K:'cozytown-move',OLD:'cozytown-save-old',AB:'BCDFGHJKLMNPRSTVWXZ',MAX:60000,LIFE:600000,   /* code letters: no vowels (no words by accident), no I, O or Q */
  TC:['#ffd45c','#5fd4b0','#7cc8ff','#b79cff','#ff9ec4','#ff8a6b'],TR:[-3,2,-2,3,-2,2],   /* the letter tiles: the logo's colours and tilt */
  BAD:"Hmm, that code doesn't work. Check the letters and try again! 🔍"};
const mvDev=()=>!TOUCHY?'computer':Math.min(innerWidth,innerHeight)<500?'phone':'iPad';   /* what this one is called in the words on the cards */
{const st=document.createElement('style');st.textContent='.mvbig{display:flex;flex-direction:column;gap:12px;margin-top:16px}.mvb{width:100%;font-size:22px;min-height:62px;line-height:1.15}'
  +'.mvt{display:flex;justify-content:center;gap:8px;margin:16px 0 6px}.mvt b{flex:0 1 58px;min-width:0;height:70px;display:flex;align-items:center;justify-content:center;color:#3d2c5e;border:3px solid #3d2c5e;border-radius:14px;box-shadow:0 4px 0 #3d2c5e;font-size:44px;font-weight:800;line-height:1}'
  +'.mvclock{font-size:22px;font-weight:800;text-align:center;margin:10px 0 0}.mverr{font-size:19px;font-weight:800;text-align:center;margin:10px 0 0}'
  +'.inp.mvin{display:block;max-width:330px;margin:12px auto 0;font-size:38px;font-weight:800;text-align:center;letter-spacing:.28em;text-indent:.28em;text-transform:uppercase;padding:4px 10px}'
  +'.inp.mvin::placeholder{letter-spacing:0;text-indent:0;font-size:22px;color:#76699a;text-transform:none}'
  +'.mvgame{border:3px solid var(--line);border-radius:18px;padding:10px 14px;margin-top:4px;background:var(--paper2);color:var(--ink);text-align:center}.mvgame b{display:block;font-size:26px;overflow-wrap:anywhere}.mvgame span{display:block;font-size:20px;font-weight:700}'
  +'#title.mvd .tag{display:none}.mvub{white-space:nowrap}.mvbk{font-size:18px;margin-top:16px}'
  +'@media (max-width:420px),(max-height:500px){.mvt b{height:58px;font-size:36px}.mvb{font-size:19px;min-height:54px}.inp.mvin{font-size:32px}}'
  +'@media (max-height:500px) and (min-width:600px){.mvbig{flex-direction:row}.mvbig .mvb{flex:1 1 0;min-width:0;width:auto}.mvbk{margin-top:10px}}';   /* a phone held sideways: the two big buttons side by side */
  document.head.appendChild(st);}
const mvNow=()=>Date.now()+MV.off;   /* the database's clock (this device's own clock can be off) */
const mvHd=t=>`<div class="hd"><h2>${t}</h2><button class="btn x" data-a="close" aria-label="Close">✕</button></div>`;
const mvLeft=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return'⏰ '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+' left';};
const mvOn=k=>UI.open&&$('card').classList.contains(k);
const mvCard=(h,o)=>{openPanel(h,o);$('card').scrollTop=0;};   /* each move card opens at its top */
const mvWait=(p,ms)=>Promise.race([p,new Promise(ok=>setTimeout(()=>ok('slow'),ms))]);   /* 'slow' = no answer in time */
function mvCode(){const a=new Uint8Array(16),n=MV.AB.length;let c='';
  while(c.length<6){crypto.getRandomValues(a);for(const b of a){if(c.length>=6||b>=256-256%n)continue;const x=MV.AB[b%n];if(x!==c[c.length-1])c+=x;}}return c;}   /* never the same letter twice in a row */
function mvGame(s){if(typeof s!=='string'||s.length<2||s.length>MV.MAX)return null;let o=null;try{o=JSON.parse(s);}catch(e){return null;}   /* a real Cozy Town save, or null */
  const ob=v=>v==null||typeof v==='object'&&!Array.isArray(v);
  return o&&typeof o==='object'&&!Array.isArray(o)&&typeof o.name==='string'&&o.name.trim()&&Number.isFinite(o.coins)&&ob(o.home)&&ob(o.bag)&&ob(o.look)&&(o.pets==null||Array.isArray(o.pets))?o:null;}
function mvHere(){const h=PLAYING&&S?S:readLocal();return h&&typeof h.name==='string'&&h.name.trim()?h:null;}   /* the game on this device now */
function mvClean(v,d){if(typeof v==='string')return v.replace(/[<>"`\\]/g,'').replace(/url\s*\(/gi,'');if(!v||typeof v!=='object')return v;if(d>20)return null;   /* a game from another device: nothing in it can sneak into the page as code */
  if(Array.isArray(v))return v.map(x=>mvClean(x,d+1));const o={};for(const k of Object.keys(v)){const c=mvClean(k,0);if(c!=='__proto__')o[c]=mvClean(v[k],d+1);}return o;}
function mvBefore(){let s=null;try{s=localStorage.getItem(MV.OLD);}catch(e){}const o=mvGame(s);return o?{s,o}:null;}   /* ↩️ the game that was here before the last move */
const mvNm=x=>esc(String(x.name).trim().slice(0,16));
function mvFail(){const was=MV.on;MV.dead=true;MV.on=false;MV.mk=false;mvStop();
  if(UI.open&&/\bmv(card|sc|gc|ok)\b/.test($('card').className)){closePanel();if(was)toast('📦 Moving games is resting right now. Try again later!',3.6);}
  else if(mvOn('setcard'))openSettings();}
async function mvInit(){if(MV.ref||MV.dead||!(window.WEBNET&&WEBNET.on)||typeof window.WEBROOM!=='function')return;   /* inside Claude there is no shared database: no button */
  try{await WEBROOM();const db=window.firebase.database();MV.ref=db.ref(MV.PATH);db.ref('.info/serverTimeOffset').on('value',s=>{MV.off=+(s&&s.val())||0;});
    const r=MV.ref.child(mvCode());let rd=false,wr=false;const go=()=>{if(rd&&wr&&!MV.dead&&!MV.on){MV.on=true;mvOld();if(mvOn('setcard'))openSettings();}};
    const f=()=>{r.off('value',f);rd=true;go();};r.on('value',f,()=>mvFail());
    r.set(null).then(()=>{wr=true;go();},()=>mvFail());   /* writes nothing; just asks "may I read and write here?" */
  }catch(e){mvFail();}}
function mvOld(){let o=null;try{o=JSON.parse(localStorage.getItem(MV.K));localStorage.removeItem(MV.K);}catch(e){}   /* a code this device showed last time (the game closed meanwhile): take it down */
  if(o&&typeof o.c==='string'&&/^[A-Z]{6}$/.test(o.c)&&o.c!==MV.code)try{MV.ref.child(o.c).remove().catch(()=>{});}catch(e){}}
function mvRead(c){return new Promise((ok,no)=>{const r=MV.ref.child(c);let done=0,t=0;   /* what is under a code, read once: null = nothing; 'slow' = no answer */
  const fin=(v,e)=>{if(done)return;done=1;clearTimeout(t);try{r.off('value',f);}catch(x){}if(e)no(e);else ok(v);},f=s=>fin(s?s.val():null);
  t=setTimeout(()=>fin('slow'),9000);r.on('value',f,e=>fin(null,e||'no'));});}
function mvStop(){const c=MV.code;clearInterval(MV.iv);MV.iv=0;if(!c)return;MV.code='';   /* take this device's code down */
  try{const r=MV.ref.child(c);if(MV.lis)r.off('value',MV.lis);r.remove().catch(()=>{});}catch(e){}MV.lis=null;try{localStorage.removeItem(MV.K);}catch(e){}}
addEventListener('pagehide',()=>{const c=MV.code;if(!c)return;mvStop();try{localStorage.setItem(MV.K,JSON.stringify({c}));}catch(e){}});   /* closed with a code up: taken down (and again next time, in case it didn't reach the server) */
function mvTry(){const t=performance.now();MV.tries=MV.tries.filter(x=>t-x<60000);if(MV.tries.length>=6)return false;MV.tries.push(t);return true;}   /* at most 6 tries a minute */
function mvTick(){if(!MV.code){clearInterval(MV.iv);MV.iv=0;return;}
  if(!mvOn('mvsc')){mvStop();return;}   /* its card went away: so does the code */
  if(PLAYING)AW.t=0;   /* the code stays on screen: no "Still there?" meanwhile */
  const left=MV.exp-mvNow();if(left<=0){mvStop();mvSendCard('time');return;}
  const el=$('mvClock');if(el)el.textContent=mvLeft(left);}
function mvSendCard(k){const c=MV.code;let b;
  if(k==='make')b='<p class="line">📦 Making your code…</p>';
  else if(k==='code')b=`<p class="line">On your other iPad or phone, type this code:</p><div class="mvt" role="img" aria-label="Code: ${[...c].join(' ')}">${[...c].map((x,i)=>`<b style="background:${MV.TC[i]};transform:rotate(${MV.TR[i]}deg)">${x}</b>`).join('')}</div>
    <p class="mvclock" id="mvClock">${mvLeft(MV.exp-mvNow())}</p><p class="note">On the other one: ⚙️ Settings → 📦 Move my game → 📥 Get my game. Keep this card open until your game has moved.</p>
    <div class="row"><button class="btn white" data-a="mvstop">✋ Stop sending</button></div>`;
  else if(k==='time')b='<p class="line">⏰ The code ran out of time.</p><div class="row"><button class="btn butter" data-a="mvsend">🔄 Make a new code</button><button class="btn white" data-a="mvopen">⬅️ Back</button></div>';
  else b='<p class="line">Your other iPad or phone has your game now. Have fun! 💗</p><p class="note">Coins you earn on one of them stay on that one. You can move your game again any time. 📦</p><div class="row"><button class="btn mint" data-a="close">👍 OK</button></div>';
  mvCard(mvHd(k==='moved'?'🎉 Your game moved!':'📤 Send my game')+b,{cls:k==='moved'?'mvdone':'mvsc',onClose:k==='code'||k==='make'?mvStop:null});}
ACT.mvopen=()=>{WIPE=false;mvStop();MV.got=null;if(!MV.on){closePanel();toast('📦 Moving games is resting right now. Try again later!',3.4);return;}const bk=mvBefore();
  mvCard(mvHd('📦 Move my game')+`<p class="line">Take your game to another iPad or phone! 📱</p>
    <div class="mvbig"><button class="btn butter mvb" data-a="mvsend">📤 Send my game from this ${mvDev()}</button><button class="btn sky mvb" data-a="mvget">📥 Get my game on this ${mvDev()}</button></div>
    <p class="note">Open Cozy Town on both. Tap 📤 on the one that has your game, then 📥 on the other one.</p>
    ${bk?`<p class="line mvbk">↩️ Your old game <b>${mvNm(bk.o)}</b> (🪙 ${Math.round(bk.o.coins)}) is still on this ${mvDev()}.</p>`:''}
    <div class="row">${bk?'<button class="btn white mvub" data-a="mvundo">↩️ Bring it back</button>':''}<button class="btn white" data-a="mvback">⬅️ Back</button></div>`,{cls:'mvcard'});};
ACT.mvundo=()=>{const b=mvBefore();if(!b){openSettings();return;}MV.got={c:'',s:b.s,o:b.o,back:1};mvAsk();};   /* (from Move my game, or from ⚙️ Settings in every version) */
ACT.mvback=()=>openSettings();
ACT.mvstop=()=>{mvStop();ACT.mvopen();};
ACT.mvsend=async()=>{if(!MV.on)return;if(MV.mk){mvSendCard('make');return;}   /* still making one (slow internet): it shows when ready */
  try{if(PLAYING&&DECO.on)decoEnd();}catch(e){}   /* furniture in your hands goes back to storage first */
  let s=null;if(PLAYING&&S){saveLocal();s=saveJSON();}else try{s=localStorage.getItem(LS);}catch(e){}   /* the game right now (on the title: the saved one) */
  if(!mvGame(s)){SFX.no();toast(s&&s.length>MV.MAX?'📦 Oh no, this game is too big to move right now.':'🌱 There is no game on this '+mvDev()+' yet! Play first, then you can send it.',3.6);return;}
  if(!mvTry()){SFX.no();toast("⏳ Let's take a little break. Try again in a minute!",3.4);return;}
  mvStop();MV.mk=true;mvSendCard('make');let c=null,err=null;
  try{for(let i=0;i<4&&!c&&!err;i++){const k=mvCode(),v=await mvRead(k);if(v==='slow')err='slow';else if(!v||!(+v.exp>mvNow()))c=k;}}catch(e){err=e||'no';}   /* a code nobody is using */
  const exp=Math.round(mvNow()+MV.LIFE);
  if(c&&!err){const w=MV.ref.child(c).set({s,at:window.firebase.database.ServerValue.TIMESTAMP,exp,v:1});w.catch(()=>{});
    try{if(await mvWait(w,12000)==='slow')err='slow';}catch(e){err=e||'no';}}
  MV.mk=false;
  if(err&&err!=='slow'){mvFail();return;}   /* the database said no */
  if(err||!c){if(c)try{MV.ref.child(c).remove().catch(()=>{});}catch(e){}if(mvOn('mvsc')){SFX.no();ACT.mvopen();toast('📡 The internet is slow right now. Try again in a moment!',3.4);}return;}
  if(!mvOn('mvsc')){try{MV.ref.child(c).remove().catch(()=>{});}catch(e){}return;}   /* the card was closed meanwhile */
  MV.code=c;MV.exp=exp;try{localStorage.setItem(MV.K,JSON.stringify({c}));}catch(e){}
  const r=MV.ref.child(c),lis=x=>{if(MV.code!==c||!x||x.val()!=null)return;   /* gone = the other device took it (and took it down) */
    const late=MV.exp-mvNow()<5000;MV.code='';clearInterval(MV.iv);MV.iv=0;try{r.off('value',lis);}catch(e){}MV.lis=null;try{localStorage.removeItem(MV.K);}catch(e){}
    if(late){if(mvOn('mvsc'))mvSendCard('time');return;}   /* at the very end it was tidied away as too old, not taken */
    SFX.yay();if(mvOn('mvsc'))mvSendCard('moved');else toast('🎉 Your game moved to your other iPad or phone!',3.6);};
  MV.lis=lis;r.on('value',lis);SFX.pop();mvSendCard('code');clearInterval(MV.iv);MV.iv=setInterval(mvTick,1000);};
ACT.mvget=()=>{if(!MV.on)return;MV.got=null;
  mvCard(mvHd('📥 Get my game')+`<p class="line">Type the code from your other iPad or phone:</p>
    <input class="inp mvin" id="mvIn" placeholder="6 letters" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" enterkeyhint="go" aria-label="The 6-letter code">
    <p class="mverr" id="mvErr" role="status" hidden></p>
    <div class="row" style="justify-content:center"><button class="btn mint" data-a="mvgo" id="mvGo">📥 Get it!</button><button class="btn white" data-a="mvopen">⬅️ Back</button></div>
    <p class="note">No code yet? On the one that has your game: ⚙️ Settings → 📦 Move my game → 📤 Send.</p>`,{cls:'mvgc'});
  const i=$('mvIn');i.addEventListener('input',()=>{const v=i.value.toUpperCase().replace(/[^A-Z]/g,'').slice(0,6);if(v!==i.value)i.value=v;$('mvErr').hidden=true;});
  i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();ACT.mvgo();}else if(e.key==='Escape'){i.blur();closePanel();}});i.focus({preventScroll:true});};
ACT.mvgo=async()=>{const i=$('mvIn'),b=$('mvGo');if(!i||!b||!MV.on||b.dataset.busy)return;   /* (still looking: the button keeps its colour, extra taps wait) */
  const no=m=>{SFX.no();mvSay(m);},c=i.value.toUpperCase().replace(/[^A-Z]/g,'');
  if(c.length!==6)return no('Type all 6 letters 🔤');
  if(c===MV.code)return no('That is the code of this '+mvDev()+'! Type it on your other one. 😊');
  if([...c].some(x=>!MV.AB.includes(x)))return no(MV.BAD);
  if(!mvTry())return no("⏳ Let's take a little break. Try again in a minute!");
  b.dataset.busy=1;b.textContent='⏳ Looking…';mvSay('⏳ Looking for your game…');let v=null,err=null;
  try{v=await mvRead(c);}catch(e){err=e||'no';}
  delete b.dataset.busy;if(!mvOn('mvgc')||$('mvGo')!==b)return;   /* the card was closed meanwhile */
  b.textContent='📥 Get it!';
  if(err){mvFail();return;}
  if(v==='slow')return no('📡 The internet is slow right now. Try again in a moment!');
  if(!v)return no(MV.BAD);
  if(!(+v.exp>mvNow())){try{MV.ref.child(c).remove().catch(()=>{});}catch(e){}return no('⏰ That code ran out of time. Make a new one on your other iPad or phone!');}
  const o=mvGame(v.s),s=o&&JSON.stringify(mvClean(o,0)),oc=mvGame(s);if(!oc)return no("Hmm, that game didn't come through. Make a new code and try again!");
  MV.got={c,s,o:oc};SFX.pop();mvAsk();};
/* the line under the code box: always where you can see it, above the keyboard too (a phone held sideways only shows the top of the card) */
function mvSay(m){const er=$('mvErr');if(!er)return;er.textContent=m;er.hidden=false;cardShow(er,$('mvIn'));}
function mvAsk(){const g=MV.got;if(!g)return;const o=g.o,h=mvHere(),nm=mvNm,pets=Array.isArray(o.pets)?o.pets.length:0;   /* "are you sure?" */
  mvCard(mvHd(g.back?'↩️ Bring it back':'📥 Get my game')+`<div class="mvgame"><b>${nm(o)}</b><span>🪙 ${Math.round(o.coins)}${pets?' · 🐾 '+pets+(pets>1?' pets':' pet'):''}</span></div>
    <p class="line">${h?`This will replace the game on this ${mvDev()} (${nm(h)}, 🪙 ${Math.round(+h.coins||0)}).`:`This will be the game on this ${mvDev()}. 💗`}</p>
    <div class="row"><button class="btn mint" data-a="mvyes">${g.back?'✅ Yes, bring it back':'✅ Yes, move it here'}</button><button class="btn white" data-a="close">Cancel</button></div>`,{cls:'mvok',onClose:()=>{MV.got=null;}});}
ACT.mvyes=async()=>{const g=MV.got;if(!g||MV.go)return;MV.go=true;
  try{if(PLAYING&&DECO.on)decoEnd();}catch(e){}if(PLAYING&&S)saveLocal();let old=null;try{old=localStorage.getItem(LS);}catch(e){}
  SAVEOFF=true;clearTimeout(CSAVE.tm);CSAVE.dirty=false;   /* from now on this page saves nothing: the game that came must not be written over */
  let s=g.s;try{const o=JSON.parse(s);o.t=Date.now();s=JSON.stringify(o);}catch(e){}   /* saved "now": inside Claude it wins over the older copy in the claude.ai account */
  try{if(mvGame(old)&&old!==g.s)localStorage.setItem(MV.OLD,old);}catch(e){}   /* the game that was here is kept: ↩️ Bring it back */
  try{localStorage.setItem(LS,s);}catch(e){SAVEOFF=false;MV.go=false;SFX.no();toast('😢 This '+mvDev()+' could not keep the game. Try again!',3.6);return;}
  try{sessionStorage.setItem('cozytown-moved',String(g.o.name).trim().slice(0,16));}catch(e){}
  mvCard('<div class="hd"><h2>📦 Moving your game…</h2></div><p class="line">Here it comes! 💗</p>',{cls:'mvok',lock:true});SFX.yay();
  if(g.c)try{const w=MV.ref.child(g.c).remove();w.catch(()=>{});await mvWait(w,3000);}catch(e){}   /* used = taken down (the other device sees that) */
  location.reload();};   /* a clean start with the game that came, the same way as opening the game */
{let n=null,w=null;try{n=sessionStorage.getItem('cozytown-moved');w=sessionStorage.getItem('cozytown-new');sessionStorage.removeItem('cozytown-moved');sessionStorage.removeItem('cozytown-new');}catch(e){}   /* 📦 just moved here / 🌱 just started over: say so on the title */
  if(n!==null||w!==null){const T=$('title'),m=document.createElement('p');m.id='tMsg';m.setAttribute('role','status');
    m.textContent=n!==null?'📦 Your game is here'+(n?', '+n:'')+'! Tap Play 💗':'🌱 A brand-new game! Your old one is safe in ⚙️ Settings → ↩️ Bring it back.';
    T.classList.add('mvd');T.insertBefore(m,T.querySelector('.menu'));
    $('tPlay').addEventListener('click',()=>{if($('tMsg')===m&&!document.body.classList.contains('away')){m.remove();T.classList.remove('mvd');}});}}
setTimeout(mvInit,600);

/* character maker (from the drawing: name on top, avatar on the left, choices on the right) */
let CR=null;
function openCreator(mode){if(CR)return;
  CR={mode,look:Object.assign({},DEFAULT_LOOK,S.look||{}),name:S.name||'',prev:{loc:CUR.id,x:P.x,z:P.z,yaw:P.yaw,pitch:P.pitch},rot:0,drag:null,av:null,tag:null};
  UI.onClose=null;closePanel();P.sit=null;
  fade(()=>{setLoc('studio');$('hud').hidden=true;crAvatar();crTag();renderCreator();if(CR.av)CR.av.wave=1.2;SFX.pop();});}
function crAvatar(){const old=CR.av;const p=makePerson(lookToPerson(CR.look));p.root.position.set(LOC.studio.ox,0,0);p.root.rotation.y=CR.rot;
  p.root.traverse(o=>{if(o.isMesh&&o.material.side!==THREE.BackSide)o.castShadow=true;});scene.add(p.root);CR.av=p;
  if(CR.tag){if(CR.tag.parent)CR.tag.parent.remove(CR.tag);p.root.add(CR.tag);}
  if(old)scene.remove(old.root);}
function crTag(){if(CR.tag){if(CR.tag.parent)CR.tag.parent.remove(CR.tag);CR.tag.material.map.dispose();CR.tag.material.dispose();}
  const t=label(CR.name||'Your name',.34,CR.name?{fit:false}:{fg:'#a08bb5',fit:false});t.position.y=1.95;CR.tag=t;if(CR.av)CR.av.root.add(t);}
function renderCreator(){const L=CR.look;
  const sw=k=>lookOpts(k).map(c=>`<button class="sw ${L[k]===c?'on':''}" style="background:${c}" data-a="lk:${k}:${c}" aria-label="Color"></button>`).join('');
  const own=f=>[['none','None']].concat((S.outfits||[]).filter(v=>CLOTHES[v.k]&&CLOTHES[v.k][f]).map(v=>[v.k+'|'+v.c,`${CLOTHES[v.k].i} ${CLOTHES[v.k].n} <i class="dot" style="background:${v.c}"></i>`]));
  const cur=k=>k==='hat'?(L.hat&&L.hat!=='none'?L.hat+'|'+(L.hatc||HAT_DEF[L.hat]):'none'):k==='glasses'?(L.glasses&&L.glasses!=='none'?L.glasses+'|'+(L.glc||HAT_DEF[L.glasses]):'none'):k==='co'?(L.co||'none'):L[k];
  const pl2=(k,opts)=>opts.map(([v,n])=>`<button class="pill ${cur(k)===v?'on':''}" data-a="lk:${k}:${v}">${n}</button>`).join('');
  const pl=k=>LOOK_OPTS[k].map(([v,n])=>`<button class="pill ${L[k]===v?'on':''}" data-a="lk:${k}:${v}">${n}</button>`).join('');
  const row=(lab,inner,k)=>`<div class="crow" data-k="${k}"><span class="cl">${lab}</span><div class="chs">${inner}</div></div>`;
  openPanel(`<div class="cr"><input class="inp crname" id="crName" maxlength="14" placeholder="Type your name" value="${esc(CR.name)}" autocomplete="off" aria-label="Your name">
    <p class="note crhint" id="crHint" hidden>Type your name first!</p>
    ${row('Eyes',pl('eyes'),'eyes')}${row('Skin tone',sw('skin'),'skin')}${row('Mouth',pl('mouth'),'mouth')}${row('Hair',pl('style'),'style')}
    ${row('Hair color',sw('hair'),'hair')}${owns('dress')?row('Outfit',pl2('outfit',[['sweater','👚 Sweater & pants'],['dress','👗 Dress']]),'outfit'):''}${own('hat').length>1?row('Hat',pl2('hat',own('hat')),'hat'):''}${own('gl').length>1?row('Glasses',pl2('glasses',own('gl')),'glasses'):''}${Object.keys(CLOTHES).some(k=>CLOTHES[k].co&&owns(k))?row('Costume',pl2('co',[['none','None']].concat(Object.keys(CLOTHES).filter(k=>CLOTHES[k].co&&owns(k)).map(k=>[CLOTHES[k].co,CLOTHES[k].i+' '+CLOTHES[k].n]))),'co'):''}${row('Sweater color',sw('top'),'top')}${row('Pants color',sw('bottom'),'bottom')}${row('Shoe color',sw('shoes'),'shoes')}
    ${Object.keys(CLOTHES).some(k=>!owns(k))?'<p class="note" style="text-align:center">Get dresses, hats and more at the 👗 clothing store!</p>':''}
    <div class="row crsave"><button class="btn mint big crgo" data-a="crdone">That's me! ✨</button>${CR.mode==='edit'?'<button class="btn white" data-a="crcancel">Cancel</button>':''}</div></div>`,{lock:true,side:true});
  const n=$('crName');n.addEventListener('input',()=>{CR.name=n.value.trim().slice(0,14);crTag();$('crHint').hidden=true;});n.addEventListener('keydown',e=>{if(e.key==='Enter')n.blur();});}
ACT.lk=arg=>{const i=arg.indexOf(':'),k=arg.slice(0,i);let v=arg.slice(i+1);
  if(k==='hat'||k==='glasses'){const [a,c]=v.split('|');CR.look[k]=a;if(k==='hat')CR.look.hatc=c||null;else CR.look.glc=c||null;}else if(k==='co'){if(v===(CR.look.co||'none'))v='none';CR.look.co=v==='none'?null:v;}else CR.look[k]=v;crAvatar();CR.av.wave=.7;SFX.pop();   /* 🎃 a costume: one tap on, the same tap off */
  const row=document.querySelector(`.crow[data-k="${k}"]`);if(row)row.querySelectorAll('[data-a]').forEach(b=>b.classList.toggle('on',b.dataset.a==='lk:'+k+':'+v));};
ACT.crdone=()=>{const n=$('crName'),nm=(n.value||'').trim().slice(0,14);if(!nm){$('crHint').hidden=false;n.focus();SFX.no();return;}
  n.blur();S.name=nm;S.look=Object.assign({},CR.look);SFX.yay();const mode=CR.mode;closePanel();if(S.look.hat&&S.look.hat!=='none')qEvent('wear:'+S.look.hat);if(S.look.glasses&&S.look.glasses!=='none')qEvent('wear:'+S.look.glasses);
  closeCreator(()=>{buildPlayerBody();change();if(mode==='intro'){INTRO=2;introStep();}else toast('Looking great, '+S.name+'! ✨');});};
ACT.crcancel=()=>{closePanel();closeCreator();};
ACT.mylook=()=>openCreator('edit');
function closeCreator(cb){if(!CR||CR.closing)return;CR.closing=true;fade(()=>{if(!CR)return;if(CR.av)scene.remove(CR.av.root);camera.clearViewOffset();const pv=CR.prev;CR=null;setLoc(pv.loc);P.x=pv.x;P.z=pv.z;P.yaw=pv.yaw;P.pitch=pv.pitch;$('hud').hidden=false;resize();if(cb)cb();});}
function crCam(dt){const w=innerWidth,h=innerHeight,port=w/h<.95,th=Math.tan(15*Math.PI/180);
  const cx=port?w/2:w*.27,cy=port?h*.23:h*.5,W2=2*Math.max(cx,w-cx),H2=2*Math.max(cy,h-cy),frac=port?.36:.64,d=2.3*(H2/h)/(2*th*frac);
  camera.fov=30;camera.aspect=W2/H2;camera.setViewOffset(W2,H2,W2/2-cx,H2/2-cy,w,h);
  camera.position.set(LOC.studio.ox,1.1,d);camera.rotation.set(0,0,0,'YXZ');
  if(CR.av){CR.av.root.rotation.y=CR.rot+Math.sin(performance.now()/1000*.9)*.15;animPerson(CR.av,dt,false);}}
$('panel').addEventListener('pointerdown',e=>{if(CR&&e.target===$('panel')){CR.drag=e.clientX;try{$('panel').setPointerCapture(e.pointerId);}catch(_){}}});
$('panel').addEventListener('pointermove',e=>{if(CR&&CR.drag!==null){CR.rot+=(e.clientX-CR.drag)*.012;CR.drag=e.clientX;}});
for(const ev of['pointerup','pointercancel'])$('panel').addEventListener(ev,()=>{if(CR)CR.drag=null;});

