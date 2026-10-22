"""Run 4 finish, f7: pass 10's kept marks. Each edit must match exactly once.
usage: python3 patch_f7.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. a hair customer's wish reads like a child would say it: "I'd like brown hair, shoulder-length, in a bun, please!" (it said "shoulder-length and bun")
 ("const hsAsk=c=>`Hi! I'd like my hair ${hsLenN(c.want.len)} and ${hsStyleN(c.want.style)}, in ${hsColN(c.want.col)}, please! ${pick(['💇','✨','😊','💕'])}`;",
  "const hsAsk=c=>{const s=c.want.style,how=s==='straight'||s==='curly'?' and '+s:s==='pigtails'?', in pigtails':', in a '+s;return`Hi! I'd like ${hsColN(c.want.col)} hair, ${hsLenN(c.want.len)}${how}, please! ${pick(['💇','✨','😊','💕'])}`;};   /* (run 4 finish: \"long and straight\", \"short, in pigtails\", \"shoulder-length, in a bun\"; it said \"shoulder-length and bun\") */"),
 # 2. a coin pop is never drawn behind a card (on a sideways phone the photo's "+120" sat half under the result card's top edge)
 (".pop.coin{top:20%;color:#c88a00}", ".pop.coin{top:20%;color:#c88a00;z-index:21}"),
 # 3. a message that comes after a coin pop moves the pop clear of it (the designer's "+20" lay on the "New client!" words that came a moment later)
 ("n.hidden=false;try{notePlace();toastPlace();}catch(e){}setTimeout(()=>{try{notePlace();toastPlace();}catch(e){}},30);",
  "n.hidden=false;const refit=()=>{try{notePlace();toastPlace();const pe=POPQ.el;if(pe&&pe.classList.contains('coin'))popFit(pe);}catch(e){}};refit();setTimeout(refit,30);"),
 # 4. the chip's sky is the sky you see: grey from the moment the sky is half grey (it turns fully grey at 40 % of a change, the chip turned at 50 %, so a grey sky had ☀️ for a while), rain and snow as soon as they fall
 ("function skyIc(){return WX.cur==='rain'?'🌧️':WX.cur==='snow'?'🌨️':WX.cur==='cloudy'?(nightF(S.time)>.5?'🌙':'☁️'):nightF(S.time)>.5?'🌙':'☀️';}",
  "function skyIc(){const n=nightF(S.time)>.5;return WX.rain>.3?'🌧️':WX.snow>.3?'🌨️':WX.sky>.5?(n?'🌙':'☁️'):n?'🌙':'☀️';}"),
 ("WX.cur=w.k<.5?w.a:w.b;if(WX.cur!==WX.shown){WX.shown=WX.cur;hudT=1;}WX.rain=rain;", "WX.cur=w.k<.5?w.a:w.b;WX.rain=rain;"),
 ("WX.kind=snow>=rain&&snow>=cloud?'snow':rain>=cloud?'rain':'cloudy';}   /* the sky is fully grey in the first part of a change (run 4, item 2) */",
  "WX.kind=snow>=rain&&snow>=cloud?'snow':rain>=cloud?'rain':'cloudy';}   /* the sky is fully grey in the first part of a change (run 4, item 2) */\n  {const ic=S?skyIc():'';if(ic!==WX.shown){WX.shown=ic;hudT=1;}}   /* the chip shows a new sky at once (run 4 finish: the sky as you see it) */"),
 # 5. a passer-by (and now a friend out for a walk) coming straight at you stops 2.4 m away; one walking away from you is never held; nobody walks in between you and your friends round you
 ("function wkBlocked(w,ux,uz){const px=P.x-w.x,pz=P.z-w.z,pd=Math.hypot(px,pz);return pd<.95||pd<1.7&&(px*ux+pz*uz)/pd>.55;}",
  "function wkBlocked(w,ux,uz){const px=P.x-w.x,pz=P.z-w.z,pd=Math.hypot(px,pz),c=(px*ux+pz*uz)/(pd||1);if(c>0&&(pd<.95||pd<1.7&&c>.55||pd<2.4&&c>.82))return true;return FAN.on&&FAN.loc===CUR.id&&ptInFan(w.x+ux*.6,w.z+uz*.6)&&!ptInFan(w.x,w.z);}   /* (run 4 finish: straight at you, 2.4 m: at 1.4 m a face filled the view; walking away from you, never held; and not into the space between you and your friends round you) */"),
 ("this.g.visible=CUR.id==='city'&&!far&&dcam>1.3&&!ptInShot(this.x,this.z);",
  "this.g.visible=CUR.id==='city'&&!far&&dcam>1.3&&!ptInShot(this.x,this.z)&&!ptInFan(this.x,this.z);"),
 ("function ptInShot(x,z){",
  "function ptInFan(x,z){if(!FAN.on||!CUR||FAN.loc!==CUR.id)return false;const cx=camera.position.x,cz=camera.position.z;for(const f of FRIEND_ACTORS){if(!f.fan||f.loc!==CUR.id)continue;const dx=f.fan[0]-cx,dz=f.fan[1]-cz,L2=dx*dx+dz*dz||1,u=((x-cx)*dx+(z-cz)*dz)/L2;if(u>.08&&u<.92&&Math.hypot(x-(cx+dx*u),z-(cz+dz*u))<.7)return true;}return false;}   /* 👫 between you and a friend standing round you? A passer-by there steps out of view, like out of a photo (run 4 finish: one stood in front of Luna and Theo) */\nfunction ptInShot(x,z){"),
 # 6. a friend out for a walk gives way like a passer-by (a step before you, then back the other way) and, like a following friend, waits unseen right at the camera; only a friend you talk to may stand closer
 ("dcam>(this.fan&&FAN.on?1.3:.55)", "dcam>(this.mode==='talk'?.55:1.3)"),
 ("else if(this.loc===CUR.id&&Math.hypot(P.x-this.x,P.z-this.z)<.95){this.moving=false;}",
  "else if(this.loc===CUR.id&&wkBlocked(this,dx/d,dz/d)){this.moving=false;this.blk=(this.blk||0)+dt;if(this.blk>1.6&&!R&&this.prev>=0){const n0=this.node;this.node=this.prev;this.prev=n0;this.blk=0;}}   /* (run 4 finish: like a passer-by; Luna, out for a walk, stood 0.9 m in front of the camera for as long as you stood still) */"),
 ("else{const s=Math.min(d,(this.mode==='going'?1.6:1.35)*dt);this.x+=dx/d*s;this.z+=dz/d*s;this.face=Math.atan2(dx,dz);this.moving=true;}}",
  "else{const s=Math.min(d,(this.mode==='going'?1.6:1.35)*dt);this.x+=dx/d*s;this.z+=dz/d*s;this.face=Math.atan2(dx,dz);this.moving=true;this.blk=0;}}"),
 # 7. a photo shoot on a short sideways screen: the coin, food and clock chips step aside and the shoot's messages sit there, top left, off the picture's background
 ("@media (orientation:landscape) and (max-height:500px){body.shoot #toast{top:calc(env(safe-area-inset-top,0px) + 6px)}}",
  "@media (orientation:landscape) and (max-height:500px){body.shoot #stats{visibility:hidden}}"),
 ("let s=spotFor(w,h,[cre?[W*.27,sT+8]:null,shoot||talk?[W/2,hb]:null,",
  "let s=spotFor(w,h,[cre?[W*.27,sT+8]:null,shoot&&W>innerHeight&&innerHeight<=500?[(parseFloat(cs.paddingLeft)||0)+10+w/2,sT+6]:null,shoot||talk?[W/2,hb]:null,"),
 # 8. a grandma walks round you, at least 2.1 m away, instead of through you (her place in the day's plan stays the same on every device)
 ("for(const q of GRAN.g){const ps=granPose(q.i,ms),st=GRAN_STOPS[ps.stop];q.x=ps.x;q.z=ps.z;q.on=out;q.target.x=ps.x;q.target.z=ps.z;",
  "for(const q of GRAN.g){const ps=granPose(q.i,ms),st=GRAN_STOPS[ps.stop];q.x=ps.x;q.z=ps.z;q.on=out;"),
 ("const sit=out&&ps.stop===0&&ps.arrived&&!!B;q.sitting=sit;if(sit)q.seat=GRAN.plan[ps.k].slice(0,q.i).filter(s=>s===0).length;",
  "const sit=out&&ps.stop===0&&ps.arrived&&!!B;q.sitting=sit;if(sit)q.seat=GRAN.plan[ps.k].slice(0,q.i).filter(s=>s===0).length;\n"
  "    /* 👵 she walks round you: while she passes she is drawn a step to the side of her way, at least 2.1 m from you, and keeps that step while she stands. On your device only:\n"
  "       her place in the day's plan (q.x, q.z) stays the same on every device (run 4 finish: at the bus stop a grandma walked through the camera, her head a third of the screen) */\n"
  "    if(!out||sit){q.ox=q.oz=0;q.side=0;}else if(ps.moving){const fx=Math.sin(ps.face),fz=Math.cos(ps.face),dx=ps.x-P.x,dz=ps.z-P.z,a=dx*fx+dz*fz,l=dx*fz-dz*fx;let t=0;   /* (the side she takes is kept until she has passed: on your exact line it flipped and she swung through you) */\n"
  "      const u=a/4.5;if(Math.abs(u)<1){const need=2.1*(1-u*u)*(1-u*u);if(q.side||Math.abs(l)<need){if(!q.side)q.side=l<0?-1:1;t=q.side*Math.max(0,need-q.side*l);}}else q.side=0;   /* (a smooth step aside, from 4.5 m before you to 4.5 m past you: at most 0.8 m/s sideways) */\n"
  "      const k=Math.min(1,dt*5);q.ox=(q.ox||0)+(fz*t-(q.ox||0))*k;q.oz=(q.oz||0)+(-fx*t-(q.oz||0))*k;}\n"
  "    const gx=ps.x+(q.ox||0),gz=ps.z+(q.oz||0);q.target.x=gx;q.target.z=gz;"),
 ("const near=Math.hypot(ps.x-cam.x,ps.z-cam.z),shot=ptInShot(ps.x,ps.z),vis=out&&near<48&&near>(sit?.6:1.3)&&!shot;",
  "const near=Math.hypot(gx-cam.x,gz-cam.z),shot=ptInShot(gx,gz)||ptInFan(gx,gz),vis=out&&near<48&&near>(sit?.6:1.3)&&!shot;"),
 ("else{R.position.set(ps.x,0,ps.z);let want=ps.moving?ps.face:st.face;if(q.turn>0&&!ps.moving){q.turn-=dt;want=Math.atan2(P.x-ps.x,P.z-ps.z);}",
  "else{R.position.set(gx,0,gz);let want=ps.moving?ps.face:st.face;if(q.turn>0&&!ps.moving){q.turn-=dt;want=Math.atan2(P.x-gx,P.z-gz);}"),
 ("for(const q of GRAN.g)if(q.on&&!q.sitting)add(q.x,q.z,.45);", "for(const q of GRAN.g)if(q.on&&!q.sitting)add(q.x+(q.ox||0),q.z+(q.oz||0),.45);"),
 # 9. name tags and bubbles too small to read (far away) fade out: far tags piled up into unreadable stacks, and a far grandma's bubble, drawn over everything, sat on a near face
 ("   and they fade away when you stand right next to someone. Worked out just before drawing: no extra drawing work */",
  "   and they fade away when you stand right next to someone, and when they are too far away to read (a line under 15 px tall; gone under 11 px: run 4 finish,\n   far tags piled into unreadable stacks, and a far grandma's bubble, drawn over everything, sat on a near face). Worked out just before drawing: no extra drawing work */"),
 ("this.material.opacity=d<1.4?clamp((d-.95)/.45,0,1):1;}", "this.material.opacity=Math.min(d<1.4?clamp((d-.95)/.45,0,1):1,clamp((nat/(u.lines||1)-11)/4,0,1));}"),
 # 10. the pond's thin reeds cast no shadow (on the water theirs broke into blotches)
 ("for(let k=0;k<9;k++){const a=1.9+k*.12+r()*.05,d=1.55+r()*.3;const h=.7+r()*.4;r();cyl(st,.018,.018,h,'#5fae64',px+Math.cos(a)*d,0,pz+Math.sin(a)*d,{seg:5,ol:false});sph(st,.04,'#9b6b4a',px+Math.cos(a)*d,h+.05,pz+Math.sin(a)*d,{s:[1,2.2,1],ws:6,hs:5,ol:false});}",
  "{const rd=new THREE.Group();st.add(rd);for(let k=0;k<9;k++){const a=1.9+k*.12+r()*.05,d=1.55+r()*.3;const h=.7+r()*.4;r();cyl(rd,.018,.018,h,'#5fae64',px+Math.cos(a)*d,0,pz+Math.sin(a)*d,{seg:5,ol:false});sph(rd,.04,'#9b6b4a',px+Math.cos(a)*d,h+.05,pz+Math.sin(a)*d,{s:[1,2.2,1],ws:6,hs:5,ol:false});}bake(rd,false);rd.userData.keep=1;}   /* (run 4 finish: the thin reeds cast no shadow: on the water theirs broke into blotches) */"),
 # 11. the corner posts stand 11 cm out from the wall (7 before): the wall's ink shell, 4 cm behind the post's face, showed through it as a dashed line
 ("for(const s of[-1,1])box(g,.34,h-.14,.34,trim,x+s*(w/2-.1),0,fz-f*.1,{ol:.02});}",
  "for(const s of[-1,1])box(g,.34,h-.14,.34,trim,x+s*(w/2-.06),0,fz-f*.06,{ol:.02});}   /* (run 4 finish: 11 cm out from the wall, not 7: the wall's ink shell, 4 cm behind the post's face, showed through it as a dashed line from across the street) */"),
 # 12. the awning's ends are closed by a side valance (seen from one end, its open far end looked like a strip hanging in the air past the shop's corner)
 ("for(let i=0;i<n;i++)box(p,sw,.26,.04,i%2?'#ffffff':o.awning,-(w+.4)/2+sw*(i+.5),2.36,1.42,{ol:.012});",
  "for(let i=0;i<n;i++)box(p,sw,.26,.04,i%2?'#ffffff':o.awning,-(w+.4)/2+sw*(i+.5),2.36,1.42,{ol:.012});\n    for(const s of[-1,1])box(p,.04,.26,1.5,o.awning,s*((w+.4)/2-.02),2.699,.646,{rx:.32,ol:.012,center:true});   /* its two ends closed by a side valance (run 4 finish: seen from one end, the open far end looked like a strip hanging in the air past the shop's corner) */"),
 # 13. in the Bakery and the Ice Cream Shop a shopper at the counter's right end no longer stands right in front of the shopkeeper as seen from the door (the two read as one figure)
 ("bakery:{n:2,buy:2,spots:[[0,-2.5,Math.PI],[-1.6,-2.5,Math.PI],[1.6,-2.5,Math.PI],", "bakery:{n:2,buy:2,spots:[[0,-2.5,Math.PI],[-1.6,-2.5,Math.PI],[2.45,-2.5,Math.PI],"),
 ("icecream:{n:2,buy:2,spots:[[0,-2.5,Math.PI],[-1.6,-2.5,Math.PI],[1.6,-2.5,Math.PI],", "icecream:{n:2,buy:2,spots:[[0,-2.5,Math.PI],[-1.6,-2.5,Math.PI],[2.45,-2.5,Math.PI],"),
 # 14. the Tree Park's marker over your next deck: one star that faces you and sways a little (the turning pair, seen half-way round, looked like a bell drawn through a star)
 ("const mk=new THREE.Group();starOn(mk,0,0,0,.42);", "const mk=new THREE.Group();{const m=new THREE.Mesh(starGeo(.42,0,.12),STARM);mk.add(m);hull(mk,starGeo(.42,.042,.12),m,{});}"),
 ("mk.rotation.y=performance.now()/700;", "mk.rotation.y=Math.atan2(camera.position.x-nx.x,camera.position.z-nx.z)+Math.sin(performance.now()/500)*.35;"),
 # 15. the phone's job titles a little smaller, so "Photographer" has air on both sides of its card
 (".phjobs .jobc b{font-size:14px}", ".phjobs .jobc b{font-size:13px;letter-spacing:-.2px}"),
 # 16. on a short sideways screen the calendar's week is lower, so the month's holiday line shows in full above the phone's bottom fade
 (".cd.show{background:#fff3c4;border-color:#ffb800}",
  ".cd.show{background:#fff3c4;border-color:#ffb800}@media (orientation:landscape) and (max-height:500px){.cal{margin:6px 0}.cd{padding:3px 0}.cd span{font-size:16px;line-height:1.2}.cd i{min-height:0;font-size:14px}}"),
 # 17. a colour dot keeps its light ring when the device is in dark mode, not only when dark is picked in the settings (the Special cap's near-black dot vanished on the dark card)
 (':root[data-theme="dark"] .dot{border-color:#fff1f8}', ':root[data-theme="dark"] .dot{border-color:#fff1f8}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .dot{border-color:#fff1f8}}'),
 (':root[data-theme="dark"] .bk-dot{border-color:#b9a6cf}', ':root[data-theme="dark"] .bk-dot{border-color:#b9a6cf}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .bk-dot{border-color:#b9a6cf}}'),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
