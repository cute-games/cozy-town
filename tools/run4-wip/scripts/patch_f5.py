"""Run 4 finish, edit f5: more of pass 8's kept marks, each from its cause.
- Pet Shop upstairs: the two ducks stood on top of their water on orange legs (the whole pen is water: a pale blue floor round a darker pond).
  The ducks there now swim: they sit low in it, legs under the surface, and glide instead of waddling.
- An upper floor's starter rug lay over the rugs you place (it stood 4 cm high, a placed rug 2.5 cm): it now lies flat under them.
- Your pets' name tags step apart on screen with the friends' (indoors three of them piled up: "Moch", only an "M").
- Garden: the 🔒 Level plate sits on its stake (the tag size cap shrank it round its middle, so it hung above the stake).
- Hair salon: when the hair card opens, the view turns to the customer in the chair so they show above the card (it covered them, the name tab on
  their face).
- Dance-off: on an upright phone the "✨ Perfect +15" pop-up shows under the score bar (it ran into the bar's bottom edge); on a phone on its
  side it shows at the bottom left under the dancers (its ✨ covered the left dancer's face, which read as the back of the head).
- The disco ball hangs from a visible arm on a visible string (the thin pale ones did not show: the ball seemed to float beside the pole).
- A card at the bottom of a short screen (a phone on its side) that reaches up into the top row or over the jump and run buttons: those pieces wait
  out of sight under it, as under a big card (the bigger-house card ran under the round top buttons; the jump button poked out beside a card).
- A job tutorial card on a short screen with nothing to point at hides the top row it would cover (it cut the food chip in half, hid the clock);
  a message that finds no free spot beside a job tutorial waits until it closes (the bus's "Beep beep!" lay on the tutorial's picture).
- The top row's clock chip follows a jump of the clock (a phone waking up) and a change of weather at once: it is refreshed twice a second, so for
  a moment it showed the old hour or weather under the new sky (the check's pictures, taken right after moving the clock: "11:30" at 12:30, the
  sun under an evening sky, a cloud under a blue sky).
- Photo shoot: the wave is higher (the arm swung out into the next person's hair); while a shoot is on, only its own buttons show (the litter's
  "Pick up the litter" and its big button sat inside the photo frame).
- 1 September: the school hall's two back balloon bunches stand by the lockers (they hid the 🌈 and 🚀 posters between the doors).
- A message keeps clear of the top row while you can see it (above a big card on a tablet it lay on the chat and phone buttons; it now waits).
- The clothes maker's ⬇️ "more below" is 46 px like every other one (it was 34 px and looked like a button too small for a finger).
- Decorating: the aim ring in the middle of the screen is a 28 px ring again; the big-button style gave it a button's padding, so it was a
  118 x 70 px ellipse hanging in the room (the designer job's "white ring floating over the sofa").
- The "+20 🪙" pop keeps clear of the message card at the top (it sat on the new client's words).
- Shop cards: the prices of a row sit on one line (a name on two lines pushed its price down); on a short screen the "more below" fade at a
  card's bottom is 40 px, not 58, so the cut row's prices are not greyed out.
- People right at the camera: a passer-by or a walking grandma within 1.3 m is not drawn for that moment (1 m and 0.6 m before: a back or a
  cardigan filled the picture); a grandma sitting next to you on a bench stays.
- Friends round you: on a narrow pavement a friend takes a spot a little nearer at the side (from 1.6 m) before one straight behind another
  friend, and the spots may be 1.22 m apart instead of 1.3 (the check asks 1.2): Finn stood hidden behind Luna, only his name tag showing; now
  all four faces show on the same pavement.
- Light outdoors: a face turned away from the sun takes no cast shadow (the toon shade still lights it at its middle or low tone, as it does
  every such face that nothing shades). A building's own shadow fell on its back wall, so the house's back in the garden was a dull grey
  (darker than the fence facing the same way), and on walls almost edge-on to the sun the shadow test drew a lit strip with a soft seam
  (the apartment block at 12:30) and pale streaks (17:30, the Easter corner at noon, the Tree Park's crowns). The baked pieces (most walls)
  now get the same shade fix as everything else: they never had it, so item 17's cure for the noon streaks (job 6) only reached the loose pieces.
  Indoors nothing changes."""
import sys
P = '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = []
def ed(old, new, c=1): E.append((old, new, c))

# ducks in their pond
ed(r"""    L.pens.push(Object.assign({type,kinds,x0:x0+.4,x1:x1-.4,z0:Z+z0+.4,z1:Z+z1-.4},o.y?{y:o.y}:{}));};""",
   r"""    L.pens.push(Object.assign({type,kinds,x0:x0+.4,x1:x1-.4,z0:Z+z0+.4,z1:Z+z1-.4},o.y?{y:o.y}:{},o.swim?{swim:1}:{}));};""")
ed(r"""pen('duck',['duck','duck'],-6.7,-3.5,1.9,4.9,'#7cc8ff',{floor:'#9fd8f2'});""",
   r"""pen('duck',['duck','duck'],-6.7,-3.5,1.9,4.9,'#7cc8ff',{floor:'#9fd8f2',swim:1});""")
ed(r"""  a.m.root.position.set(a.x,a.pen.y||0,a.z);a.m.root.rotation.y=angLerp(a.m.root.rotation.y,a.face,.12);animPet(a.m,dt,a.moving);a.target.x=a.x;a.target.z=a.z;}}""",
   r"""  a.m.root.position.set(a.x,(a.pen.y||0)-(a.pen.swim?.12:0),a.z);a.m.root.rotation.y=angLerp(a.m.root.rotation.y,a.face,.12);animPet(a.m,dt,a.moving&&!a.pen.swim);a.target.x=a.x;a.target.z=a.z;}}   /* 🦆 in their water the ducks swim: low in it, legs under the surface, no waddle (run 4 finish: they stood on it on orange legs) */""")

# the starter rug of an upper floor lies under placed rugs
ed(r"""box(sh,3.6,.025,2.5,RC[0],0,.005,0,{ol:.012});box(sh,3.0,.03,1.9,RC[1],0,.006,0,{ol:false});for(const zz of[-.55,0,.55])box(sh,2.4,.034,.12,RC[0],0,.007,zz,{ol:false});}   /* a striped rug with a border (it read as a big plate) */""",
   r"""box(sh,3.6,.008,2.5,RC[0],0,.002,0,{ol:.012});box(sh,3.0,.01,1.9,RC[1],0,.003,0,{ol:false});for(const zz of[-.55,0,.55])box(sh,2.4,.012,.12,RC[0],0,.004,zz,{ol:false});}   /* a striped rug with a border (it read as a big plate); flat under any rug you place (run 4 finish: a placed rug lay half under it) */""")

# pets' name tags step apart with the friends'
ed(r"""for(const f of FRIEND_ACTORS)f.update(dt,f.mode==='follow'?fi++:0);tagsApart(FRIEND_ACTORS.filter(f=>f.g.visible&&f.loc===CUR.id).map(f=>({tag:f.tag,bub:f.bub||null})));PET_ACTORS.forEach((p,i)=>p.update(dt,fi+i+(fi?0:1)));""",
   r"""for(const f of FRIEND_ACTORS)f.update(dt,f.mode==='follow'?fi++:0);PET_ACTORS.forEach((p,i)=>p.update(dt,fi+i+(fi?0:1)));tagsApart([...FRIEND_ACTORS,...PET_ACTORS].filter(f=>f.g.visible&&f.loc===CUR.id&&f.tag).map(f=>({tag:f.tag,bub:f.bub||null})));   /* (run 4 finish: your pets' tags too; indoors three of them piled up) */""")

# the garden's lock plate on its stake
ed(r"""if(lk){s=new THREE.Group();const t=label(need,.24);t.position.y=.72;s.add(t);""",
   r"""if(lk){s=new THREE.Group();const t=label(need,.24);t.center.set(.5,0);t.position.y=.57;s.add(t);   /* (run 4 finish: held at its bottom edge, so a plate made smaller close up still sits on the stake) */""")

# the hair salon: the view turns to the customer when the card opens
ed(r"""function hsCard(){const c=HS.cust;if(!c||!c.sat||c.leaving)return;const h=c.hair;""",
   r"""function hsCard(){const c=HS.cust;if(!c||!c.sat||c.leaving)return;const h=c.hair;if(!(UI.open&&document.querySelector('#card [data-a="hsdone"]')))HS.look=1.2;   /* 👀 a fresh card: the view turns to the customer (run 4 finish) */""")
ed(r"""  c.t+=dt;const p=c.p;if(!CUR||CUR.id!=='salon')return;""",
   r"""  c.t+=dt;const p=c.p;if(!CUR||CUR.id!=='salon')return;
  if(HS.look>0){HS.look-=dt;if(c.sat&&UI.open&&!P.sit&&p.head){const v=HS.v||(HS.v=new THREE.Vector3());p.head.getWorldPosition(v);const dx=v.x-P.x,dz=v.z-P.z,dh=Math.hypot(dx,dz);   /* (run 4 finish: the card covered the customer in the chair: the view turns so they show above it, head a bit above the middle of the space left) */
    if(dh>.4){const H=innerHeight,top=hudLow(),cr=$('card').getBoundingClientRect(),yT=top+(Math.max(cr.top,top+80)-top)*.42,ny=1-2*yT/H,a=Math.atan2(v.y-camera.position.y,dh),k=Math.min(1,dt*5);
      P.yaw=angLerp(P.yaw,Math.atan2(-dx,-dz),k);P.pitch=lerp(P.pitch,clamp(a-Math.atan(ny*Math.tan(camera.fov*Math.PI/360)),-1.2,.6),k);}}}""")

# the dance-off pop-up under the score bar on an upright phone
ed(r"""#dnMsg{position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 128px);""",
   r"""#dnMsg{position:absolute;left:50%;top:calc(env(safe-area-inset-top,0px) + 162px);""")

# the disco ball's arm and string
ed(r"""box(g,.56,.03,.03,'#c8c8d8',.27,2.68,0,{ol:false});cyl(g,.01,.01,.17,'#c8c8d8',.54,2.51,0,{seg:4,ol:false});""",
   r"""box(g,.6,.05,.05,'#c8c8d8',.28,2.65,0,{ol:.012});cyl(g,.016,.016,.18,'#6f6a88',.54,2.48,0,{seg:6,ol:.008});   /* (run 4 finish: a thicker arm with an outline and a dark string: the ball seemed to float) */""")

# a bottom card on a short screen: the HUD pieces it reaches over wait under it
ed(r"""function cardMore(){const c=$('card');if($('panel').hidden)return;""",
   r"""/* 🃏 a card at the bottom of a short screen that reaches up into the top row or over the jump and run buttons: those pieces wait out of sight under it,
   as under a big card (run 4 finish: the bigger-house card ran under the round top buttons; the jump button poked out beside a card) */
function cardOver(){const pn=$('panel'),b=document.body,on=!pn.hidden&&pn.classList.contains('bottom')&&innerHeight<=500&&!b.classList.contains('shoot')&&!b.classList.contains('dancing'),r=on?cardBox():null;
  for(const id of['stats','topbtns','bChat','busTip','moveBtns','joy']){const e=$(id);if(!e)continue;let h=false;if(r){const q=e.getBoundingClientRect();h=q.width>1&&q.left<r.right+4&&q.right>r.left-4&&q.top<r.bottom+4&&q.bottom>r.top-4;}if(e.classList.contains('underCard')!==h)e.classList.toggle('underCard',h);}}
function cardMore(){try{cardOver();}catch(e){}const c=$('card');if($('panel').hidden)return;""")
ed(r"""function closePanel(){const p=$('panel');if(p.hidden)return;p.hidden=true;UI.open=false;UI.lock=false;""",
   r"""function closePanel(){const p=$('panel');if(p.hidden)return;p.hidden=true;try{cardOver();}catch(e){}UI.open=false;UI.lock=false;""")
ed(r"""#panel.bottom .card{overflow:visible;margin-bottom:8px}""",
   r"""#panel.bottom .card{overflow:visible;margin-bottom:8px}.underCard{visibility:hidden!important}@media (max-height:500px){body:has(#tut:not([hidden]) #tutHole.none) :is(#stats,#topbtns,#bChat,#busTip){visibility:hidden}}   /* (run 4 finish: a job tutorial card with nothing to point at covers the top row on a phone on its side: the row waits under it) */""")

# a message that finds no free spot waits while a job tutorial is open
ed(r"""  if(!ok&&!m.keep&&(m.news||TQ.card>m.at&&!toastWith(m))){""",
   r"""  if(!ok&&!m.keep&&(m.news||TQ.card>m.at&&!toastWith(m)||!$('tut').hidden)){""")

# the clock chip follows a jump of the clock and a change of weather at once
ed(r"""function clockSync(){if(!S)return false;const c=clockNow();HOUR=hourLen(c.time);if(c.day===S.day){S.time=c.time;return false;}""",
   r"""function clockSync(){if(!S)return false;const c=clockNow();HOUR=hourLen(c.time);if(c.day===S.day){if(Math.abs(c.time-S.time)>.1)hudT=1;S.time=c.time;return false;}   /* (run 4 finish: after a jump of the clock, a phone waking up, the chip is right at once, not half a second later) */""")
ed(r"""  WX.cur=w.k<.5?w.a:w.b;WX.rain=rain;""",
   r"""  WX.cur=w.k<.5?w.a:w.b;if(WX.cur!==WX.shown){WX.shown=WX.cur;hudT=1;}WX.rain=rain;   /* (run 4 finish: the chip's weather changes with the sky's, not up to half a second later) */""")

# the photo shoot: a higher wave; only the shoot's own buttons while it is on
ed(r"""    if(k==='wave'){p.arms[1].rotation.z=2.5+Math.sin(m.t*9)*.4;}""",
   r"""    if(k==='wave'){p.arms[1].rotation.z=2.8+Math.sin(m.t*9)*.22;}   /* (run 4 finish: a higher wave; the arm swung out into the next person's hair) */""")
ed(r"""  for(const t of targets()){if(t.when&&!t.when())continue;let tx=t.x""",
   r"""  for(const t of targets()){if(t.when&&!t.when())continue;if(PHO.on&&!t.pt)continue;   /* 📸 during a shoot only its own buttons (run 4 finish: "Pick up the litter" sat inside the photo frame) */let tx=t.x""")

# the school hall's party balloons stand by the lockers, not in front of the two posters
ed(r"""[[-5.0,3.6],[5.0,3.6],[-2.0,-4.1],[2.0,-4.1]].forEach(([x,z],k)=>{balloonBunch(gi,x,z,[4,1,2,5].map(j=>C[(j+k)%6]));SCH.pieces++;});""",
   r"""[[-5.0,3.6],[5.0,3.6],[-4.95,-.2],[4.95,-.2]].forEach(([x,z],k)=>{balloonBunch(gi,x,z,[4,1,2,5].map(j=>C[(j+k)%6]));SCH.pieces++;});   /* (run 4 finish: the back two stood in front of the 🌈 and 🚀 posters; now by the lockers) */""")

# a message keeps clear of the top row while it is in sight (it lay on the round buttons above a big card on a tablet)
ed(r"""for(const id of['stats','busTip','tnHud','fbHud','topbtns','updBtn'])add($(id),4*u);""",
   r"""for(const id of['stats','busTip','tnHud','fbHud','topbtns','updBtn'])add($(id),4);   /* (run 4 finish: the top row counts fully while you can see it: above a big card on a tablet the message lay on the round buttons) */""")

# the clothes maker's scroll hint is as big as every other one
ed(r""".crsave.more::after{content:"⬇️";position:absolute;right:14px;bottom:calc(100% + 4px);width:34px;height:34px;border-radius:50%;background:var(--paper);border:3px solid var(--line);font-size:15px;line-height:28px;""",
   r""".crsave.more::after{content:"⬇️";position:absolute;right:14px;bottom:calc(100% + 4px);width:46px;height:46px;border-radius:50%;background:var(--paper);border:3px solid var(--line);box-shadow:0 3px 0 var(--soft);font-size:21px;line-height:40px;""")

# the aim ring while decorating: the big-button class gave it a button's padding (a 118 x 70 px ellipse)
ed(r"""#cross.big{width:28px;height:28px;margin:-14px 0 0 -14px;""",
   r"""#cross.big{width:28px;height:28px;padding:0;min-height:0;margin:-14px 0 0 -14px;""")

# the coin pop keeps clear of the message card at the top
ed(r"""  for(const id of['stats','topbtns','left','bChat','tasks','job'])add($(id),4);if(!$('panel').hidden){const r=cardBox();if(r)K.push([r,1]);}
  const st=boxOf($('stats')),tb=boxOf($('topbtns')),sx=st?st.right:0,ty=(tb?tb.bottom:hudLow())+6,s=spotFor(w,h,[[W/2,visH()*.2-h/2],[W/2,hudLow()+6],[(sx+W)/2,ty]],K);""",
   r"""  for(const id of['stats','topbtns','left','bChat','tasks','job','note'])add($(id),4);if(!$('panel').hidden){const r=cardBox();if(r)K.push([r,1]);}   /* (run 4 finish: and the message card: the designer's "+20" sat on the new client's words) */
  const st=boxOf($('stats')),tb=boxOf($('topbtns')),nt=boxOf($('note')),sx=st?st.right:0,ty=(tb?tb.bottom:hudLow())+6,s=spotFor(w,h,[[W/2,visH()*.2-h/2],[W/2,hudLow()+6],[(sx+W)/2,ty]].concat(nt?[[W/2,nt.bottom+6],[(sx+nt.left)/2,ty]]:[]),K);""")

# shop cards: the prices sit on one line along a row; on a short screen the "more below" fade is lower
ed(r""".it .pr{font-weight:800}""", r""".it .pr{font-weight:800;margin-top:auto}""")
ed(r"""b.style.top=Math.round(r.bottom-61-p.top)+'px';""", r"""b.style.top=Math.round(r.bottom-3-b.offsetHeight-p.top)+'px';""")
ed(r"""#moreBand{position:absolute;z-index:2;height:58px;""", r"""@media (max-height:500px){#moreBand{height:40px!important}}#moreBand{position:absolute;z-index:2;height:58px;""")

# people right at the camera: a passer-by or a walking grandma within 1.3 m is not drawn (it was 1 m and 0.6 m: a back filled the picture)
ed(r"""far=dcam>48;this.g.visible=CUR.id==='city'&&!far&&dcam>1&&!ptInShot(this.x,this.z);""",
   r"""far=dcam>48;this.g.visible=CUR.id==='city'&&!far&&dcam>1.3&&!ptInShot(this.x,this.z);   /* (run 4 finish: 1.3 m, not 1: at 1.2 m a back filled the middle of the picture) */""")
ed(r"""vis=out&&near<48&&near>.6&&!shot;""", r"""vis=out&&near<48&&near>(sit?.6:1.3)&&!shot;""")

# friends round you on a narrow pavement: a near spot at the side before a spot hidden behind another friend; 1.22 m apart (the kit's N3 asks 1.2)
ed(r"""for(const g of got)if(Math.hypot(g[0]-x,g[1]-z)<1.3)return false;""", r"""for(const g of got)if(Math.hypot(g[0]-x,g[1]-z)<1.22)return false;""")
ed(r"""for(let i=0;i<=10;i++)for(let r=2.4;r<=5.2;r+=.4){const a=-h+h*i/5;let sc=Math.abs(a-wa)*2+Math.abs(r-wr)*.6;if(sc>=bs)continue;""",
   r"""for(let i=0;i<=10;i++)for(let r=1.6;r<=5.2;r+=.4){const a=-h+h*i/5;let sc=Math.abs(a-wa)*2+Math.abs(r-wr)*.6+(r<2.4?(2.4-r)*1.2:0);if(sc>=bs)continue;   /* (run 4 finish: a little nearer, at the side, before a spot straight behind another friend: on a narrow pavement Finn stood hidden behind Luna) */""")

# the dance-off pop-up on a phone on its side: at the bottom left, under the dancers (its ✨ sat on the guest's face, read as the back of a head)
ed(r"""@media (orientation:landscape) and (max-height:500px){#dnLane{top:calc(env(safe-area-inset-top,0px) + 6px);height:auto}body.dancing #topbtns,body.dancing #stats{visibility:hidden}}""",
   r"""@media (orientation:landscape) and (max-height:500px){#dnLane{top:calc(env(safe-area-inset-top,0px) + 6px);height:auto}body.dancing #topbtns,body.dancing #stats{visibility:hidden}#dnMsg{left:3%;right:auto;top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 16px);font-size:34px}}   /* (run 4 finish: the pop-up under the dancers, not on them: its ✨ covered the left dancer's face) */""")

# outdoors a face turned away from the sun takes no cast shadow (the toon shade lights it at its middle or low tone; a building's own shadow
# made its back wall darker than a fence facing the same way, and the shadow test drew streaks and seams on such walls)
ed(r"""const SHADE_FIX=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <lights_fragment_begin>',THREE.ShaderChunk.lights_fragment_begin.replace('? getShadow(""",
   r"""const SHLIFT={value:1};   /* 1 outdoors: a face turned away from the sun takes no cast shadow (run 4 finish) */
const SHADE_FIX=sh=>{sh.uniforms.shLift=SHLIFT;sh.fragmentShader='uniform float shLift;\n'+sh.fragmentShader.replace('#include <lights_fragment_begin>',THREE.ShaderChunk.lights_fragment_begin.replace('? getShadow(""")
ed(r"""  '? mix( dot( geometry.normal, directLight.direction ) > 0.0 ? 1.0 : 0.0, getShadow(""",
   r"""  '? ( shLift > 0.5 && dot( geometry.normal, directLight.direction ) < 0.0 ) ? 1.0 : mix( dot( geometry.normal, directLight.direction ) > 0.0 ? 1.0 : 0.0, getShadow(""")
ed(r"""    hemi.intensity=lerp(a[4],b[4],t)*(1-.2*WX.grey);""", r"""    SHLIFT.value=1;hemi.intensity=lerp(a[4],b[4],t)*(1-.2*WX.grey);""")
ed(r"""    hemi.intensity=.52;hemi.color.set('#ffffff');""", r"""    SHLIFT.value=0;hemi.intensity=.52;hemi.color.set('#ffffff');""")
ed(r"""TOONVC=new THREE.MeshToonMaterial({color:'#ffffff',vertexColors:true,gradientMap:GRAD});""",
   r"""TOONVC=new THREE.MeshToonMaterial({color:'#ffffff',vertexColors:true,gradientMap:GRAD});TOONVC.onBeforeCompile=SHADE_FIX;   /* (run 4 finish: the baked pieces, most walls, too: without it their shadow test still drew the noon streaks) */""")

bad = 0
for old, new, c in E:
    n = s.count(old)
    if n != c: print('COUNT', n, '!=', c, ':', old[:120]); bad += 1
if bad: sys.exit(1)
for old, new, c in E: s = s.replace(old, new)
open(P, 'w', encoding='utf-8').write(s)
print('applied', len(E), 'edits')
