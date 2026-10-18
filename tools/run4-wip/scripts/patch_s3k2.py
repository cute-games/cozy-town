"""Stage 3, patch k part 2 (round-5 critic notes, one clock): friends walk round you and stand fully in view, apart; ducks with faces;
a card that scrolls shows its fade and arrow inside; the times all read like the clock; the calendar's header; one coin count in the phone."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))

# o1 the fan a little narrower, so the friends at its ends stand fully on screen, clear of the side buttons
ed(r"function fanHalf(){const a=innerWidth/innerHeight,hf=Math.atan(Math.tan(camera.fov*Math.PI/360)*a);return Math.min(.62,hf*.78);}",
   r"function fanHalf(){const a=innerWidth/innerHeight,hf=Math.atan(Math.tan(camera.fov*Math.PI/360)*a);return Math.min(.52,hf*(a>1?.62:.75));}   /* (run 4, stage 3: the friend at the end stood half under the screen's edge and the buttons) */")
# o2 a spot straight behind another friend only when there is no other free spot
ed(r"<.24;})?.6:0;};   /* a spot straight behind another friend as you look costs a little more (run 4, stage 3) */",
   r"<.24;})?2.2:0;};   /* a spot straight behind another friend as you look: only when no other free spot is left (run 4, stage 3: it cost a little more, and friends still hid behind each other) */")
# o3 friends behind you walk round you to the front, never through you
ed(r"function fanStep(e,dt,idx){const gx=e.fan[0],gz=e.fan[1],dx=gx-e.x,dz=gz-e.z,d=Math.hypot(dx,dz);" "\n"
   r"  if(d>.1){const sp=clamp(d*2.4,1.5,5),s=Math.min(d,sp*dt),ox=e.x,oz=e.z;fMove(e,e.x+dx/d*s,e.z+dz/d*s,idx,s+.05);const mv=Math.hypot(e.x-ox,e.z-oz);e.face=Math.atan2(dx,dz);",
   r"""/* 🤝 round you, never through you: when the straight way to its spot passes close to you, a friend walks a circle round you first (run 4, stage 3: after you turned, one walked through the camera and its face filled the screen) */
function fanWay(e,gx,gz){const px=P.x,pz=P.z,sx=gx-e.x,sz=gz-e.z,L2=sx*sx+sz*sz||1,t=((px-e.x)*sx+(pz-e.z)*sz)/L2,cx=e.x+sx*clamp(t,0,1)-px,cz=e.z+sz*clamp(t,0,1)-pz;
  if(t<=0||t>=1||Math.hypot(cx,cz)>=1.15){e.fanSide=0;return [gx,gz];}
  const ae=Math.atan2(e.x-px,e.z-pz),ag=Math.atan2(gx-px,gz-pz),da=Math.atan2(Math.sin(ag-ae),Math.cos(ag-ae)),at=(a,r)=>[px+Math.sin(a)*r,pz+Math.cos(a)*r];
  if(!e.fanSide){e.fanSide=2;pick:for(const r of[Math.max(1.45,Math.hypot(e.x-px,e.z-pz)),1])for(const sd of(da<0?[-1,1]:[1,-1])){const span=sd*da>0?Math.abs(da):2*Math.PI-Math.abs(da),n=Math.max(1,Math.ceil(span/.3));let [x0,z0]=[e.x,e.z],ok=true;
      for(let i=1;i<=n&&ok;i++){const [x1,z1]=at(ae+sd*span*i/n,r);ok=fLine(x0,z0,x1,z1);[x0,z0]=[x1,z1];}if(ok&&fLine(x0,z0,gx,gz)){e.fanSide=sd;e.fanR=r;break pick;}}}   /* the side whose whole way round is free of walls and fences (the shorter first, wide, then close round you); none: straight on, as before. It keeps what it picked */
  return e.fanSide===2?[gx,gz]:at(ae+e.fanSide*.9,e.fanR);}
function fanStep(e,dt,idx){const D=Math.hypot(e.fan[0]-e.x,e.fan[1]-e.z),[gx,gz]=D>.1?fanWay(e,e.fan[0],e.fan[1]):e.fan,dx=gx-e.x,dz=gz-e.z,d=Math.hypot(dx,dz)||1e-6;
  if(D>.1){const sp=clamp(Math.min(d,D)*2.4,1.5,5),s=Math.min(d,sp*dt),ox=e.x,oz=e.z;fMove(e,e.x+dx/d*s,e.z+dz/d*s,idx,s+.05);const mv=Math.hypot(e.x-ox,e.z-oz);e.face=Math.atan2(dx,dz);""")
ed("got.push(best);f.fan=best;f.fanStk=0;});}","got.push(best);f.fan=best;f.fanStk=0;f.fanSide=0;});}")
# o4 a friend coming round never fills the camera
ed(r"this.g.visible=this.loc===CUR.id&&Math.hypot(this.x-camera.position.x,this.z-camera.position.z)<48&&!((PHO.on||DANCE.on||DANCE.res)&&this.mode==='follow');",
   r"const dcam=Math.hypot(this.x-camera.position.x,this.z-camera.position.z);this.g.visible=this.loc===CUR.id&&dcam<48&&!(this.fan&&FAN.on&&dcam<.75)&&!((PHO.on||DANCE.on||DANCE.res)&&this.mode==='follow');   /* (a friend on its way round you that comes right up to the camera waits unseen for that moment: run 4, stage 3) */")

# o5 ducks with faces and feathers, one piece each
ed(r"function duckEyes(d){",
   r"""/* 🦆 a duck's face and feathers: a wide flat orange bill, round dark eyes with a shine, wings a shade darker and a little upturned tail; one piece per duck (run 4, stage 3: from the path the ducks read as faceless blobs and the white one as a snowman) */
function duckDress(d,c){const w=c==='#f7f2ec'?'#e3d9cb':'#f2c94c';sph(d,.055,'#ff9a3c',0,.315,.275,{s:[1.25,.42,1.55],ws:10,hs:6,ol:.012});
  for(const s of[-1,1]){sph(d,.026,INK,s*.058,.358,.245,{ws:8,hs:6,ol:false});sph(d,.009,'#ffffff',s*.06,.368,.266,{ws:6,hs:4,ol:false});sph(d,.12,w,s*.135,.17,-.03,{s:[.42,.62,1.15],ws:10,hs:6,ol:.012});}
  cone(d,.07,.13,c,0,.2,-.25,{rx:-Math.PI/2+.65,center:true,seg:6,ol:.012});bake(d,false);}
function duckEyes(d){""")
ed(r"cone(d,.045,.11,'#ff9a3c',0,.31,.3,{rx:Math.PI/2,center:true,seg:6,ol:.012});duckEyes(d);L.ducks.push({g:d,a:k*2.1,",
   r"duckDress(d,c);L.ducks.push({g:d,a:k*2.1,")
ed(r"cone(d,.045,.11,'#ff9a3c',0,.31,.3,{rx:Math.PI/2,center:true,seg:6,ol:.012});duckEyes(d);L.ducks.push({g:d,a:k*Math.PI,",
   r"duckDress(d,k?'#f7f2ec':'#ffe27a');L.ducks.push({g:d,a:k*Math.PI,")

# o6 a card that scrolls: a soft fade over its bottom and the ⬇️ in it, inside the card (critics read the arrow beside the card as a loose button)
OLD_CM=open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/p8dbg/cardmore-old.txt',encoding='utf-8').read().rstrip('\n')
assert OLD_CM.startswith("  a.hidden=!m||!!f;if(a.hidden)return;") and OLD_CM.count('\n')==2
ed(OLD_CM,
   r"  let b=$('moreBand');if(!b){b=document.createElement('div');b.id='moreBand';b.setAttribute('aria-hidden','true');$('panel').appendChild(b);}b.hidden=a.hidden=!m||!!f;if(a.hidden)return;" "\n"
   r"  const r=c.getBoundingClientRect(),p=$('panel').getBoundingClientRect(),R=parseFloat(getComputedStyle(c).borderBottomLeftRadius)||0;" "\n"
   r"  b.style.left=Math.round(r.left+3-p.left)+'px';b.style.width=Math.round(r.width-6)+'px';b.style.top=Math.round(r.bottom-61-p.top)+'px';b.style.borderRadius=`0 0 ${Math.max(0,R-3)}px ${Math.max(0,R-3)}px`;" "\n"
   r"  a.style.left=Math.round((r.left+r.right)/2-23-p.left)+'px';a.style.top=Math.round(r.bottom-54-p.top)+'px';}   /* run 4, stage 3: the ⬇️ sits inside the card, on a soft fade over its bottom (beside or under the card critics read it as a loose button, and a row cut by the card's edge with no fade as a mistake); it never takes a tap */")
ed(r"#moreHint{position:absolute;z-index:3;",
   r"#moreBand{position:absolute;z-index:2;height:58px;background:linear-gradient(to bottom,rgba(255,250,253,0),var(--paper) 70%);pointer-events:none}#moreBand[hidden]{display:none}#moreHint{position:absolute;z-index:3;")

# o7 every time in words reads like the clock (09:40, 07:00, 08:00)
ed(r">Sleeping until 7:00 🌙</div>", r">Sleeping until 07:00 🌙</div>")
ed(r"' Clients message you from 8:00 to 20:00.'", r"' Clients message you from 08:00 to 20:00.'")
ed(r"' Classes are from 8:00 to 20:00.'", r"' Classes are from 08:00 to 20:00.'")
ed(r"' The salon is open from 8:00 to 20:00.'", r"' The salon is open from 08:00 to 20:00.'")
ed(r"${PS_ON}:00 to ${PS_OFF}:00", r"${clockStr(PS_ON)} to ${clockStr(PS_OFF)}", 4)
ed(r'<b id="clock">8:00</b>', r'<b id="clock">08:00</b>')
# o8 the calendar's header without a date in its picture (📅 is drawn with "17" or "JUL 17")
ed(r"hd('📅 Calendar')", r"hd('🗓️ Calendar')")
# o9 one coin count in the phone: the status bar shows it on the home screen, an app's header inside the app
ed(r'<span>🪙 ${S.coins}</span></div><div class="ph-screen">', r'<span>${PH.app?"":"🪙 "+S.coins}</span></div><div class="ph-screen">')

bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
