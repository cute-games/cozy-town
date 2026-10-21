"""Run 4 finish, f16: pass 19's kept marks. Each edit must match exactly once.
usage: python3 patch_f16.py [FILE]   (default: the repo's index.html)"""
import sys
P = sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = [
 # 1. a raised arm in a photo pose (wave, peace sign) leans a little forward, in front of the hair: straight up it went through Mia's pigtail
 (r"""if(k==='wave'){p.arms[1].rotation.z=2.8+Math.sin(m.t*9)*.22;}""",
  r"""if(k==='wave'){p.arms[1].rotation.z=2.8+Math.sin(m.t*9)*.22;p.arms[1].rotation.x=.6;}   /* (run 4 finish: a little forward, in front of the hair: straight up the arm went through Mia's pigtail) */"""),
 (r"""else if(k==='peace'){p.arms[1].rotation.z=2.9;p.arms[1].rotation.x=-.2;""",
  r"""else if(k==='peace'){p.arms[1].rotation.z=2.9;p.arms[1].rotation.x=.6;"""),
 # 2. the photo on the thank-you card is drawn sharp (it was 400 px across for the whole screen, then blown up about four times: soft faces and
 #    tags); the copy kept in your phone stays small
 (r"""let pic='';try{const w=400,h=clamp(Math.round(w/(camera.aspect||1.6)),150,900);offShot(scene,camera,w,h,0x9fd8ff);const vf=boxOf($('ptvf'));let cv=THR.cv;if(vf){const sx=clamp(vf.left/innerWidth*w,0,w-8),sy=clamp(vf.top/innerHeight*h,0,h-8),sw=Math.min(w-sx,vf.width/innerWidth*w),sh=Math.min(h-sy,vf.height/innerHeight*h),k=Math.min(1,320/sw,400/sh);cv=document.createElement('canvas');cv.width=Math.max(8,Math.round(sw*k));cv.height=Math.max(8,Math.round(sh*k));cv.getContext('2d').drawImage(THR.cv,sx,sy,sw,sh,0,0,cv.width,cv.height);}pic=cv.toDataURL('image/jpeg',.7);}catch(e){}""",
  r"""let pic='',big='';try{const a=camera.aspect||1.6,w=a>=1?960:Math.round(960*a),h=clamp(Math.round(w/a),150,1800);offShot(scene,camera,w,h,0x9fd8ff);const vf=boxOf($('ptvf'));let sx=0,sy=0,sw=w,sh=h;if(vf){sx=clamp(vf.left/innerWidth*w,0,w-8);sy=clamp(vf.top/innerHeight*h,0,h-8);sw=Math.min(w-sx,vf.width/innerWidth*w);sh=Math.min(h-sy,vf.height/innerHeight*h);}
    const cut=(mw,mh,q)=>{const k=Math.min(1,mw/sw,mh/sh),cv=document.createElement('canvas');cv.width=Math.max(8,Math.round(sw*k));cv.height=Math.max(8,Math.round(sh*k));cv.getContext('2d').drawImage(THR.cv,sx,sy,sw,sh,0,0,cv.width,cv.height);return cv.toDataURL('image/jpeg',q);};
    pic=cut(320,400,.7);big=cut(760,900,.86);}catch(e){}   /* (run 4 finish: the card shows a sharp copy, the phone keeps the small one: the photo was 400 px across for the whole screen, then blown up about four times on the card) */"""),
 (r"""${pic?`<img class="ptpic" src="${pic}" alt="The photo">`:''}""",
  r"""${pic?`<img class="ptpic" src="${big||pic}" alt="The photo">`:''}"""),
 # 3. a shopper walking past you right at the camera waits unseen for that moment, like a passer-by in town (a head and a body filled the
 #    left sixth of the Toy Store's view)
 (r"""if(!here)return;this.g.position.set(this.x,0,this.z);this.g.rotation.y=angLerp""",
  r"""if(!here)return;if(this.next>=0&&this.wait<=0&&Math.hypot(this.x-camera.position.x,this.z-camera.position.z)<1.3)this.g.visible=false;   /* (run 4 finish: on its way, right at the camera, it waits unseen for that moment, like a passer-by in town: a head and a body filled the left sixth of the Toy Store's view) */this.g.position.set(this.x,0,this.z);this.g.rotation.y=angLerp"""),
 # 4. the dance-off on a short sideways screen: the score bar at the top (the buttons and chips above it are hidden for the round); it sat on
 #    the dancers' crowns
 (r"""body.dancing #topbtns,body.dancing #stats{visibility:hidden}""",
  r"""body.dancing #topbtns,body.dancing #stats{visibility:hidden}#dnTop{top:calc(env(safe-area-inset-top,0px) + 8px)}"""),
 # 5. 1 September: the "School party today!" banner hangs a little higher, clear of the little roof over the school's door (its end covered
 #    the roof's front)
 (r"""b.position.set(-26.3,2.98,-57.72);""",
  r"""b.position.set(-26.3,3.25,-57.72);   /* (run 4 finish: a little higher, clear of the little roof over the door: its end covered the roof's front) */"""),
 # 6. a speech bubble (a grandma, another player, a football friend) slides sideways, still over its speaker, to stay clear of the map and
 #    notepad column and of the screen's edges (a grandma's bubble ran under the corner map: "eding the ducks is the best part of my day.")
 (r"""if(u.top)this.material.depthTest=d>10||ln<15;}""",
  r"""if(u.top)this.material.depthTest=d>10||ln<15;if(u.bub)bubDodge(this,cam);}"""),
 (r"""if(dn>Math.max(h*2.5,H*.22))s.material.opacity=0;else if(dn>0){s.center.y=.5+dn/h;s.material.depthTest=false;}}   /* (moved down onto its house: drawn on top of it; too far under the HUD: not shown) */
""",
  r"""if(dn>Math.max(h*2.5,H*.22))s.material.opacity=0;else if(dn>0){s.center.y=.5+dn/h;s.material.depthTest=false;}}   /* (moved down onto its house: drawn on top of it; too far under the HUD: not shown) */
/* 💬 a speech bubble slides sideways, still over its speaker (who stays inside it, at worst near its end), to stay clear of the map and notepad
   column, the buttons and the screen's edges (run 4 finish: a grandma's bubble ran under the corner map: "eding the ducks is the best part of my day.") */
function bubDodge(s,cam){s.center.x=.5;if(s.material.opacity<=0)return;const R=hudRects();
  _hv.setFromMatrixPosition(s.matrixWorld);const z=-_hw.copy(_hv).applyMatrix4(cam.matrixWorldInverse).z;if(z<.2)return;_hv.project(cam);
  const W=innerWidth,H=innerHeight,f=H/(2*Math.tan(cam.fov*Math.PI/360)),h=s.scale.y*f/z,w=s.scale.x*f/z,x=(_hv.x+1)/2*W,y=(1-_hv.y)/2*H,t=y-h*(1-s.center.y),bt=y+h*s.center.y;
  let lo=6,hi=W-6;for(const b of R)if(b.left>-1e3&&t<b.bottom&&bt>b.top){if(b.left<x)lo=Math.max(lo,b.right+6);else hi=Math.min(hi,b.left-6);}   /* (the top row's band is not a side: it stays as it is) */
  let cx=.5;if(x-w/2<lo)cx=(x-lo)/w;else if(x+w/2>hi)cx=1-(hi-x)/w;s.center.x=clamp(cx,.05,.95);}
"""),
 (r"""if(!b){b=label(txt,.38);}b.position.y=""",
  r"""if(!b){b=label(txt,.38);}b.userData.bub=1;b.position.y="""),
 (r"""const b=label(txt,.36);b.position.y=2.45;a.av.root.add(b);""",
  r"""const b=label(txt,.36);b.userData.bub=1;b.position.y=2.45;a.av.root.add(b);"""),
 (r"""const b=label(txt,.3);b.position.y=k.tag.position.y+.42;""",
  r"""const b=label(txt,.3);b.userData.bub=1;b.position.y=k.tag.position.y+.42;"""),
 # 7. butterflies keep 2.2 m from the camera (1.3 m before): right at the lens a butterfly's two wings read as a big gold or blue block
 (r"""WILD.bf=flockMesh(bf);""",
  r"""WILD.bf=flockMesh(bf,{cr:2.2});   /* (run 4 finish: 2.2 m from the camera, not 1.3: that near, its two flat wings read as a big gold block in the air) */"""),
]
for i, (a, b) in enumerate(E, 1):
    n = s.count(a)
    if n != 1: sys.exit(f'edit {i}: found {n} times: {a[:90]!r}')
    s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s); print(len(E), 'edits applied to', P)
