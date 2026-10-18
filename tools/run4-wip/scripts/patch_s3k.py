"""Stage 3, patch k (round-5 critic notes and the pass-7 marks that came in before the sub-agents stopped), part 1: the photographer
and the Flower Corner gate."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))

# k1 the booking's note goes when the shoot starts; a message re-finds its spot when the note goes
ed(r"PHO.on=1;document.body.classList.add('shoot');$('ptvf').hidden=false;ptPlace(o.bg);",
   r"PHO.on=1;document.body.classList.add('shoot');$('ptvf').hidden=false;$('note').hidden=true;ptPlace(o.bg);")
ed(r"function toastSig(){return [UI.open,$('actWrap').hidden,$('actLbl').textContent,$('nav').hidden,$('hud').hidden].join('|');}",
   r"function toastSig(){return [UI.open,$('actWrap').hidden,$('actLbl').textContent,$('nav').hidden,$('hud').hidden,$('note').hidden].join('|');}   /* (and the note going: run 4, stage 3: the shoot's hint sat on the photo bar, placed round the booking note, and stayed there) */")

# k2 the photo's sides are the raised arms along the row; the asked background must be in the frame
ed(r"    const pts=[[0,0,0],[0,h,0],[-.3,h*.6,0],[.3,h*.6,0]].map(([dx,dy,dz])=>{v.set(r.position.x+dx,r.position.y+dy,r.position.z+dz).project(camera);return v.clone();});",
   r"    const pts=ptPts(m,h);")
ed(r"  let st=5;if(cut)st--;if(hid)st--;if(back)st--;if(unposed)st--;if(!fill)st--;if(PHO.bg!==o.bg)st--;st=Math.max(1,st);" "\n"
   r"  return {st,cut,hid,back,unposed,fill,bgOk:PHO.bg===o.bg,w:+w.toFixed(2),h:+hh.toFixed(2)};}",
   r"  const B=(ptSpotOf(o)||{bgs:[]}).bgs.find(b=>b.id===PHO.bg),bgOk=PHO.bg===o.bg&&ptBgIn(B,F);   /* (run 4, stage 3: the asked background has to be in the photo: the school sign was above the frame and the photo still got five stars) */" "\n"
   r"  let st=5;if(cut)st--;if(hid)st--;if(back)st--;if(unposed)st--;if(!fill)st--;if(!bgOk)st--;st=Math.max(1,st);" "\n"
   r"  return {st,cut,hid,back,unposed,fill,bgOk,w:+w.toFixed(2),h:+hh.toFixed(2)};}")
ed(r"function ptHid(m,h){const r=m.root,",
   r"""/* the four points of a person (or the pet) the photo must hold: the feet, the head and the raised arms at both sides, along the row (run 4, stage 3: a waving hand at the frame's edge was cut off in the photo and still got five stars) */
function ptPts(m,h){const r=m.root,v=new THREE.Vector3(),sx=Math.cos(m.face||0),sz=-Math.sin(m.face||0),w2=m.kind==='pet'?.25:.45;
  return [[0,0],[0,h],[-w2,h*.8],[w2,h*.8]].map(([k,dy])=>v.set(r.position.x+sx*k,r.position.y+dy,r.position.z+sz*k).project(camera).clone());}
function ptBgIn(B,F){if(!B||!B.at)return true;const v=new THREE.Vector3(B.at[0],B.at[1],B.at[2]).project(camera);return v.z<1&&v.x>F.x1&&v.x<F.x2&&v.y>F.y1&&v.y<F.y2;}   /* the background's middle is inside the frame */
function ptSolid(o,own){for(let q=o;q;q=q.parent){if(q===own)return false;if(q.visible===false)return false;}return !o.isSprite&&!!o.material&&!o.material.transparent&&o.material.side!==THREE.BackSide;}   /* a thing the camera cannot see through (not a name tag, glass or an outline) */
/* nothing between the camera and anyone's chest or head */
function ptView(g){const C=camera.position,objs=[CUR.g,...g.map(k=>k.root)];PT_RC.camera=camera;
  for(const m of g){const h=m.kind==='pet'?.6:1.75*(m.p.b?m.p.b.scale.x:1),r=m.root;
    for(const y of[h*.55,h*.92]){const T=new THREE.Vector3(r.position.x,r.position.y+y,r.position.z),dir=T.clone().sub(C),len=dir.length();dir.normalize();PT_RC.set(C,dir);PT_RC.near=.3;PT_RC.far=Math.max(.4,len-.35);
      if(PT_RC.intersectObjects(objs,true).some(x=>ptSolid(x.object,r)))return false;}}
  return true;}
/* everyone inside the frame (a little in from its edges) and big enough */
function ptFits(F){let minx=1,maxx=-1,miny=1,maxy=-1;for(const m of PHO.group){const h=m.kind==='pet'?.6:1.75*(m.p.b?m.p.b.scale.x:1);
    for(const q of ptPts(m,h)){if(!(q.z<1&&q.x>F.x1+.03&&q.x<F.x2-.03&&q.y>F.y1+.03&&q.y<F.y2-.03))return false;minx=Math.min(minx,q.x);maxx=Math.max(maxx,q.x);miny=Math.min(miny,q.y);maxy=Math.max(maxy,q.y);}}
  return maxy-miny>=.45||maxx-minx>=.5;}
/* 📸 at the start and with every new background the camera steps to a clear spot in front of the group, back just far enough that everyone fits in the frame
   on this screen, tilted so the background shows above them (run 4, stage 3: a tree trunk or the gate stood in front of the family, and an upright phone began
   with the row cut off). You can still walk and zoom from there */
function ptCamGo(B){const g=PHO.group;if(!PHO.on||!g.length||!CUR||CUR.id!=='city')return false;const n=g.length,cx=g.reduce((a,m)=>a+m.x,0)/n,cz=g.reduce((a,m)=>a+m.z,0)/n,F=ptFrame(),
    tv=Math.tan(BASEFOV*PHO.zoom*Math.PI/360),aim=Math.atan(tv*(F.y1+.42*(F.y2-F.y1))),keep=[P.x,P.z,P.yaw,P.pitch];camera.fov=BASEFOV*PHO.zoom;camera.updateProjectionMatrix();
  for(let d=3.4;d<8.05;d+=.3)for(const da of[0,.2,-.2,.4,-.4]){const a=B.face+da,x=cx+Math.sin(a)*d,z=cz+Math.cos(a)*d,q=collideXZ(x,z,.3,CUR);if(Math.hypot(q[0]-x,q[1]-z)>.05)continue;
    P.x=x;P.z=z;P.yaw=a;P.pitch=clamp(Math.atan2(.95-1.5,d)-aim,-.3,.05);updateCamera(0);camera.updateMatrixWorld();
    if(ptFits(F)&&ptBgIn(B,F)&&ptView(g))return true;}
  [P.x,P.z,P.yaw,P.pitch]=keep;updateCamera(0);camera.updateMatrixWorld();return false;}
function ptHid(m,h){const r=m.root,""")
ed(r"m.x=x;m.z=z;m.y=groundY(x,z);m.root.position.set(x,m.y,z);m.root.rotation.y=B.face;m.face=B.face;if(m.tg){m.tg.x=x;m.tg.z=z;}});ptBar();}",
   r"m.x=x;m.z=z;m.y=groundY(x,z);m.root.position.set(x,m.y,z);m.root.rotation.y=B.face;m.face=B.face;if(m.tg){m.tg.x=x;m.tg.z=z;}});ptBar();ptCamGo(B);}")

# k3 the school's name board on two tall posts, the "school sign" background; it is the background's middle
ed(r"{id:'flag',n:'the school sign',g:[-23.0,-55.2],face:-.25}",
   r"{id:'flag',n:'the school sign',g:[-23.0,-55.2],face:-.25,at:[-22.4,3.3,-57.5]}")
ed(r"{const s1=signPlane('🏫 Cozy Town School',7,1.0,'#ff7aa8','#ffffff');s1.position.set(-25,5.6,-58.84);L.g.add(s1);box(st,7.3,1.3,.1,'#ffffff',-25,5.0,-58.97);",
   r"{const s1=signPlane('🏫 Cozy Town School',7,1.0,'#ff7aa8','#ffffff');s1.position.set(-25,5.6,-58.84);L.g.add(s1);box(st,7.3,1.3,.1,'#ffffff',-25,5.0,-58.97);" "\n"
   r"   {const bd=new THREE.Group();bd.position.set(-22.4,0,-57.5);bd.rotation.y=-.25;L.g.add(bd);for(const sx of[-1.63,1.63])cyl(bd,.07,.08,3.78,'#8a5a3c',sx,0,0,{seg:8,ol:.012});box(bd,3.1,.84,.12,'#ffffff',0,2.88,0,{ol:.012});bake(bd,true);" "\n"
   r"    const s2=signPlane('🏫 Cozy Town School',2.9,.64,'#ff7aa8','#ffffff');s2.position.set(0,3.3,.1);bd.add(s2);colC(L,-22.4-1.58,-57.5-.40,.16);colC(L,-22.4+1.58,-57.5+.40,.16);}   /* 🏫 the school's name board on two tall posts, right of the door: the photographer's \"school sign\" (run 4, stage 3: the name over the door is too high for a photo from the pavement) */")

# k4 the result card: a bigger photo and bigger stars on a tablet or a computer; the zoom buttons say Zoom out / Zoom in
ed(r".ptpic,.mimg{display:block;max-width:min(320px,100%);max-height:40vh;border-radius:14px;border:3px solid #3d2c5e;margin:8px auto;background:#e8e2f0}",
   r".ptpic,.mimg{display:block;max-width:min(320px,100%);max-height:40vh;border-radius:14px;border:3px solid #3d2c5e;margin:8px auto;background:#e8e2f0}@media (min-width:700px) and (min-height:600px){#card.ptres .ptpic{max-width:min(540px,100%);max-height:46vh;width:100%;object-fit:cover}#card.ptres .line{font-size:20px}#card.ptres .earn{font-size:22px}#card.ptres .stars{font-size:1.7em;letter-spacing:4px}}   /* 📸 on a tablet or a computer the photo fills the card (run 4, stage 3) */")
ed(r"""<button class="btn white sq" data-a="ptzoom:-" aria-label="Zoom out">−<small>Zoom</small></button><button class="btn white sq" data-a="ptzoom:+" aria-label="Zoom in">+<small>Zoom</small></button>""",
   r"""<button class="btn white sq zm" data-a="ptzoom:-" aria-label="Zoom out">−<small>Zoom out</small></button><button class="btn white sq zm" data-a="ptzoom:+" aria-label="Zoom in">+<small>Zoom in</small></button>""")
ed(r"#ptbar .btn.sq small{font-size:14px;font-weight:900;line-height:1.1}",
   r"#ptbar .btn.sq small{font-size:14px;font-weight:900;line-height:1.1}#ptbar .btn.sq.zm{width:78px;flex:0 0 78px;font-size:26px}#ptbar .btn.sq.zm small{font-size:13px;white-space:nowrap}")

# k4b a short sideways phone: the photo bar in one row at the bottom, the frame ends above it (the two-row bar sat inside the frame)
ed(r"@media (orientation:landscape) and (min-height:501px){#ptvf{bottom:calc(env(safe-area-inset-bottom,0px) + 142px)}}",
   r"@media (orientation:landscape) and (min-height:501px){#ptvf{bottom:calc(env(safe-area-inset-bottom,0px) + 142px)}}@media (orientation:landscape) and (max-height:500px){#ptbar{flex-direction:row;width:min(580px,calc(100vw - 240px))}#ptbar .prow:first-child{flex:1 1 0;min-width:0}#ptbar .prow:last-child{flex:0 0 auto}#ptbar .btn.snap{flex:0 0 auto;padding:6px 14px}#ptvf{bottom:calc(env(safe-area-inset-bottom,0px) + 86px)}}   /* 📸 a short sideways phone: the photo bar in one row, the frame ends above it (run 4, stage 3) */")

# k5 the Flower Corner gate, when open, folds back inside the garden flat along the fence (it swung out into the street, in front of the photo family)
ed(r"function fcGate(open){open=!!open;if(FC.open===open||!FC.g)return;FC.open=open;FC.g.rotation.y=open?-1.75:0;",
   r"function fcGate(open){open=!!open;if(FC.open===open||!FC.g)return;FC.open=open;FC.g.rotation.y=open?Math.PI-.05:0;FC.g.position.z=FC.z-(open?.14:0);")
ed(r"/* 🚪 the Flower Corner gate: a little picket gate in the fence gap; open (swung inwards) in a holiday month, closed (and solid) otherwise. holCheck calls fcGate */",
   r"/* 🚪 the Flower Corner gate: a little picket gate in the fence gap; open (folded back inside, flat along the fence) in a holiday month, closed (and solid) otherwise. holCheck calls fcGate (run 4, stage 3: it swung out over the pavement) */")

bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
