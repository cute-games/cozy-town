"""Stage 3, patch h: the photo is what the frame shows, the pose card on sideways phones, the corner map's arrow, the big map's list hint,
pumpkin glows, sign margins, flocks round the camera, the Christmas glows, the clothes maker's message, the scare spots, the ceiling lamp,
pen animals apart, the Tricky tag, the pond stones, the photographer's tips row, the Tree Park gate path, the salon's pumpkin, the Pet Shop's colours."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))
# h1 the photo is what the dashed frame shows
ed("let pic='';try{const w=320,h=clamp(Math.round(w/(camera.aspect||1.6)),150,640);offShot(scene,camera,w,h,0x9fd8ff);pic=THR.cv.toDataURL('image/jpeg',.7);}catch(e){}   /* the picture is what the screen shows (its own shape) */",
   "let pic='';try{const w=400,h=clamp(Math.round(w/(camera.aspect||1.6)),150,900);offShot(scene,camera,w,h,0x9fd8ff);const vf=boxOf($('ptvf'));let cv=THR.cv;if(vf){const sx=clamp(vf.left/innerWidth*w,0,w-8),sy=clamp(vf.top/innerHeight*h,0,h-8),sw=Math.min(w-sx,vf.width/innerWidth*w),sh=Math.min(h-sy,vf.height/innerHeight*h),k=Math.min(1,320/sw,400/sh);cv=document.createElement('canvas');cv.width=Math.max(8,Math.round(sw*k));cv.height=Math.max(8,Math.round(sh*k));cv.getContext('2d').drawImage(THR.cv,sx,sy,sw,sh,0,0,cv.width,cv.height);}pic=cv.toDataURL('image/jpeg',.7);}catch(e){}   /* the picture is what the dashed frame shows (run 4, stage 3: it was the whole screen) */")
# h2 the pose card on a short sideways screen: the top HUD steps aside, the card has the height it needs; the shoot's hint goes when a pose card opens
ed("#panel.bottom .card.ptpose{max-height:calc(100vh - 84px);overflow:auto}","#panel.bottom .card.ptpose{max-height:calc(100vh - 20px);overflow:auto}")
ed("body:has(#panel:not([hidden]) #card.ptpose) :is(#ptbar,#joy){visibility:hidden}",
   "body:has(#panel:not([hidden]) #card.ptpose) :is(#ptbar,#joy){visibility:hidden}@media (max-height:500px){body:has(#panel:not([hidden]) #card.ptpose) :is(#topbtns,#stats,#bChat){visibility:hidden}}")
ed("function ptPoseCard(i){const m=PHO.group[i];if(!m||m.kind!=='person')return;SFX.tap();",
   "function ptPoseCard(i){const m=PHO.group[i];if(!m||m.kind!=='person')return;SFX.tap();toastOff();   /* (the shoot's hint goes: the card says what to do; run 4, stage 3) */")
ed("ACT.ptposes=()=>{if(!PHO.on)return;SFX.tap();openPanel(","ACT.ptposes=()=>{if(!PHO.on)return;SFX.tap();toastOff();openPanel(")
# h3 the corner map keeps the whole arrow inside its rounded frame
ed("const s=N*.05;x.save();x.translate(M(P.x),M(P.z));x.rotate(-P.yaw);",
   "const s=N*.05,mg=s*1.6+N*.04;x.save();x.translate(clamp(M(P.x),mg,N-mg),clamp(M(P.z),mg,N-mg));x.rotate(-P.yaw);   /* (run 4, stage 3: a whole arrow inside the map's rounded frame, also at the edge of town) */")
# h4 the big map's list: the more-below hint is a soft fade with the arrow, over no words; the corner map steps aside while the big map is open
ed('.mp-list.more::after{content:"⬇️";position:sticky;bottom:4px;z-index:3;display:block;width:40px;height:40px;margin:-40px auto 0;border-radius:50%;background:var(--paper);border:3px solid var(--line);box-shadow:0 3px 0 var(--soft);font-size:17px;line-height:34px;text-align:center;pointer-events:none;animation:moreBob .9s ease-in-out infinite alternate}',
   '.mp-list.more::after{content:"⬇️";position:sticky;bottom:0;z-index:3;display:block;height:46px;margin:-46px 0 0;padding-top:20px;box-sizing:border-box;background:linear-gradient(to bottom,transparent,var(--paper) 62%);font-size:19px;line-height:22px;text-align:center;pointer-events:none}body:has(#panel:not([hidden]) #card .mp) #left{visibility:hidden}')
# h5 the pumpkins' glow: a small one at the pumpkin and a soft pool of light on the ground (a big glow was cut straight by the pavement)
ed("pumpkin(st,px,pz,ry,1);glows.push([px,.3,pz,1.1,[.9,.42,.08]])","pumpkin(st,px,pz,ry,1);glows.push([px,.3,pz,.5,[.9,.42,.08]],[px,supportAt(px,pz)+.03,pz,1.5,1.5,[.5,.23,.05]])")
ed("pumpkin(st,px,pz,ry,.8);glows.push([px,.26,pz,.95,[.9,.42,.08]]);","pumpkin(st,px,pz,ry,.8);glows.push([px,.26,pz,.42,[.9,.42,.08]],[px,supportAt(px,pz)+.03,pz,1.3,1.3,[.5,.23,.05]]);")
ed("pumpkin(st,x+.55,z,Math.PI/2,1.1);glows.push([x+.55,.32,z,1.2,[.9,.42,.08]]);","pumpkin(st,x+.55,z,Math.PI/2,1.1);glows.push([x+.55,.32,z,.55,[.9,.42,.08]],[x+.55,supportAt(x+.55,z)+.03,z,1.6,1.6,[.5,.23,.05]]);")
# h6 a sign can ask for wider side margins; the Pet Show board and its plate get them
ed("function signPlane(text,w,h,bg,fg){","function signPlane(text,w,h,bg,fg,pad){")
ed("const mx=Math.max(12,W*.06),my=Math.max(8,H*.1)","const mx=Math.max(12,W*(pad||.06)),my=Math.max(8,H*.1)")
ed("const sg=signPlane('🏆 Pet Show',2.8,.8,'#ffd45c','#3d2c5e');","const sg=signPlane('🏆 Pet Show',2.8,.8,'#ffd45c','#3d2c5e',.13);")
ed("const sg2=signPlane('Every Saturday!',1.9,.38,'#ffffff','#ff4d8d');","const sg2=signPlane('Every Saturday!',1.9,.38,'#ffffff','#ff4d8d',.12);")
# h7 each flock keeps its own distance from the camera: ghosts 3 m, butterflies and birds a little
ed("cp:{value:new THREE.Vector3(0,-999,0)}}","cp:{value:new THREE.Vector3(0,-999,0)},cr:{value:o.cr||1.3}}")
ed("uniform float tm;uniform vec3 cp;","uniform float tm;uniform vec3 cp;uniform float cr;")
ed("if(dl<3.2&&dl>0.001)c.xz+=dv/dl*(3.2-dl);","if(dl<cr&&dl>0.001)c.xz+=dv/dl*(cr-dl);")
ed("/* 👻 ghosts and bats glide round you 3 m away, never through the camera (run 4, stage 3) */","/* 👻 ghosts glide round you 3 m away, butterflies, bats and birds a little nearer: never through the camera (run 4, stage 3) */")
ed("const gm=flockMesh(gh);","const gm=flockMesh(gh,{cr:3.2});")
# h8 the Christmas tree's night glows: smaller, and none right by Santa's face
ed("for(let i=0;i<24;i++){const a=i/24*TAU,y=1.3+i*.12,tr=Math.max(2.1*(1-(y-1.05)/2.94),1.68*(1-(y-2.73)/2.52),1.18*(1-(y-4.2)/2.1),0)+.14;glows.push([XT[0]+Math.cos(a)*tr,y,XT[1]+Math.sin(a)*tr,.6,[[1,.3,.3],[.3,.9,.4],[1,.85,.3],[.4,.6,1]][i%4]]);}",
   "for(let i=0;i<24;i++){const a=i/24*TAU,y=1.3+i*.12,tr=Math.max(2.1*(1-(y-1.05)/2.94),1.68*(1-(y-2.73)/2.52),1.18*(1-(y-4.2)/2.1),0)+.14,gx=XT[0]+Math.cos(a)*tr,gz=XT[1]+Math.sin(a)*tr;if(y<2.6&&Math.hypot(gx-XT[0]-2.95,gz-XT[1]+.5)<1.3)continue;glows.push([gx,y,gz,.48,[[1,.3,.3],[.3,.9,.4],[1,.85,.3],[.4,.6,1]][i%4]]);}   /* (run 4, stage 3: smaller, and none right by Santa's face: they blew it out at night) */")
# h9 in the clothes maker a message sits above your figure
ed("const shoot=document.body.classList.contains('shoot');","const shoot=document.body.classList.contains('shoot'),cre=!!document.querySelector('#panel:not([hidden]) #card .crsave');   /* (in the clothes maker the message sits above your figure, not on it: run 4, stage 3) */")
ed("let s=spotFor(w,h,[shoot?[W/2,hb]:null,","let s=spotFor(w,h,[cre?[W*.27,sT+8]:null,shoot?[W/2,hb]:null,")
# h10 the spooky path's monsters pop up beside the path, not in your face
ed("const SPOOK={spots:[{x:-15.5,z:-11.2,px:-14.2,pz:-11.6,k:'ghost'},{x:-18.8,z:-13.2,px:-20.1,pz:-13.0,k:'skel'},{x:-19.3,z:-16.3,px:-20.6,pz:-16.6,k:'zombie'},{x:-16.5,z:-18.2,px:-15.4,pz:-17.5,k:'bats'},{x:-18.3,z:-21.0,px:-19.6,pz:-21.4,k:'pumpkin'},{x:-15.2,z:-23.3,px:-13.9,pz:-22.9,k:'ghost'}],",
   "const SPOOK={spots:[{x:-15.5,z:-11.2,px:-13.3,pz:-11.9,k:'ghost'},{x:-18.8,z:-13.2,px:-21.1,pz:-12.9,k:'skel'},{x:-19.3,z:-16.3,px:-21.5,pz:-16.8,k:'zombie'},{x:-16.5,z:-18.2,px:-14.6,pz:-17.0,k:'bats'},{x:-18.3,z:-21.0,px:-20.5,pz:-21.7,k:'pumpkin'},{x:-15.2,z:-23.3,px:-13.0,pz:-22.6,k:'ghost'}],   /* (run 4, stage 3: 2.3 m off the path, beside it, not in your face) */")
# h11 the ceiling lamp without its dark outline (seen from below by the door it showed black wedges)
ed("cyl(g,.42,.3,.16,'#ffffff',0,H-.16,0,{seg:16});sph(g,.22,null,0,H-.2,0,{mat:GLOW,ol:false,ws:12,hs:8});",
   "cyl(g,.42,.3,.16,'#ffffff',0,H-.16,0,{seg:16,ol:false});sph(g,.22,null,0,H-.2,0,{mat:GLOW,ol:false,ws:12,hs:8});   /* (no dark outline round the ceiling lamp: from below, near the door, it showed as black wedges; run 4, stage 3) */")
# h12 the pen animals keep apart from all the others in their pen
ed("function updatePen(dt){for(const a of PEN){a.wt-=dt;const o=PEN.find(b=>b!==a&&b.pen===a.pen),fr=a.pen.y?0:.45;   /* 🐶 not nose-first at the front fence, and never inside the other one */\n  if(a.wt<=0){a.wt=rand(1.5,5);const L=LOC.pets,sm=a.pen.y?0:.25;for(let k=0;k<6;k++){a.tx=L.ox+rand(a.pen.x0+sm,a.pen.x1-sm);a.tz=L.oz+rand(a.pen.z0,a.pen.z1-fr);if(!o||Math.hypot(a.tx-o.tx,a.tz-o.tz)>.9)break;}}\n  const dx=a.tx-a.x,dz=a.tz-a.z,d=Math.hypot(dx,dz);if(d>.08){const s=Math.min(d,.9*dt),nx=a.x+dx/d*s,nz=a.z+dz/d*s;\n    if(o&&!a.pen.y&&Math.hypot(nx-o.x,nz-o.z)<.7&&Math.hypot(nx-o.x,nz-o.z)<Math.hypot(a.x-o.x,a.z-o.z)){a.moving=false;a.wt=Math.min(a.wt,.3);}\n    else{a.x=nx;a.z=nz;a.face=Math.atan2(dx,dz);a.moving=true;}}else a.moving=false;",
   "function updatePen(dt){for(const a of PEN){a.wt-=dt;const os=PEN.filter(b=>b!==a&&b.pen===a.pen),fr=a.pen.y?0:.45;   /* 🐶 not nose-first at the front fence, and never inside another one (run 4, stage 3: any of them, not only the first) */\n  if(a.wt<=0){a.wt=rand(1.5,5);const L=LOC.pets,sm=a.pen.y?0:.25;for(let k=0;k<8;k++){a.tx=L.ox+rand(a.pen.x0+sm,a.pen.x1-sm);a.tz=L.oz+rand(a.pen.z0,a.pen.z1-fr);if(os.every(o=>Math.hypot(a.tx-o.tx,a.tz-o.tz)>.9))break;}}\n  const dx=a.tx-a.x,dz=a.tz-a.z,d=Math.hypot(dx,dz);if(d>.08){const s=Math.min(d,.9*dt),nx=a.x+dx/d*s,nz=a.z+dz/d*s;\n    if(!a.pen.y&&os.some(o=>{const e=Math.hypot(nx-o.x,nz-o.z);return e<.7&&e<Math.hypot(a.x-o.x,a.z-o.z);})){a.moving=false;a.wt=Math.min(a.wt,.3);}\n    else{a.x=nx;a.z=nz;a.face=Math.atan2(dx,dz);a.moving=true;}}else a.moving=false;\n  if(!a.pen.y){const L=LOC.pets;for(const o of os){const ex=a.x-o.x,ez=a.z-o.z,e=Math.hypot(ex,ez);if(e<.6&&e>1e-4){const k=(.6-e)/2;a.x=clamp(a.x+ex/e*k,L.ox+a.pen.x0,L.ox+a.pen.x1);a.z=clamp(a.z+ez/e*k,L.oz+a.pen.z0,L.oz+a.pen.z1);}}}")
# h13 the quests' Tricky tag: bigger, white on purple
ed(".qtag.tricky{background:#9b7cf0}",".qtag.tricky{background:#7b5ce0;color:#fff}.qtag{font-size:14px;line-height:1.45}")
# h14 the pond's stones rest on the ground
ed("sph(st,sr,pick(['#b8b4c4','#a7a3b5','#c8c4d6']),sx,.05,sz,{s:[1.2,.6,1],ws:8,hs:6,ol:.015});",
   "sph(st,sr,pick(['#b8b4c4','#a7a3b5','#c8c4d6']),sx,sr*.5,sz,{s:[1.2,.6,1],ws:8,hs:6,ol:.015});   /* (resting on the ground, not half buried: a buried stone's outline showed loose slivers; run 4, stage 3) */")
# h15 Settings: the photographer's tips too
ed("    <div class=\"opt\"><span>✂️ Hairstylist job</span><button class=\"btn white\" data-a=\"hstutgo\">📖 Show me the tips</button></div>",
   "    <div class=\"opt\"><span>✂️ Hairstylist job</span><button class=\"btn white\" data-a=\"hstutgo\">📖 Show me the tips</button></div>\n    <div class=\"opt\"><span>📸 Photographer job</span><button class=\"btn white\" data-a=\"pttutgo\">📖 Show me the tips</button></div>")
ed("ACT.hstutgo=()=>{closePanel();setTimeout(hsTutStart,250);};","ACT.hstutgo=()=>{closePanel();setTimeout(hsTutStart,250);};\nACT.pttutgo=()=>{closePanel();setTimeout(ptTutStart,250);};")
# h16 no flowers or bushes on the Tree Park's gate path
ed("const free=(x,z,rad)=>{if(Math.abs(x)<8.5","const free=(x,z,rad)=>{if(x>63&&x<82&&z>-41&&z<-35)return false;   /* (run 4, stage 3: the Tree Park's gate path stays clear) */if(Math.abs(x)<8.5")
# h17 the Hair Salon's door gets its pumpkin (and wreath) too
ed("[-25,-59.0,0],[-59.9,-29.6,Math.PI/2]];","[-25,-59.0,0],[-59.9,-29.6,Math.PI/2],[-59.98,40.5,Math.PI/2]];   /* (run 4, stage 3: the Hair Salon too) */")
# h18 the Pet Shop a little less pale
ed("const W=14,D=10,H=3.4,wm=mat('#c9f2e3'),fm=toon({map:floorTex('mint')})","const W=14,D=10,H=3.4,wm=mat('#b0e6d2'),fm=toon({map:floorTex('mint')})")
ed("shell({ox:L.ox,oz:L.oz+UPZ*k,cols:L.cols},sh,W,D,H,wm,fm,'#eef6f2',g,UPG);","shell({ox:L.ox,oz:L.oz+UPZ*k,cols:L.cols},sh,W,D,H,wm,fm,'#e2f1eb',g,UPG);   /* (run 4, stage 3: the walls and ceiling a little deeper: the shop looked washed out) */")
bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
