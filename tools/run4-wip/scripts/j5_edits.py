# Run 4, job 5: signs and text (item 7): signPlane fits text by the pixels it really drew; plates and labels centre by ink too; the four named signs cleaned. Exact-match edits for edit.py.
import json
E = []

# --- signPlane: fit and centre by the inked pixels, not by measureText ---
E.append(["@between", "function signPlane(text,w,h,bg,fg){text=String(text).replace(/\\ufe0f/g,'');",
          "  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));m.userData.keep=1;return m;\n}",
r"""/* 🔤 run 4, job 5 (item 7), the root cause of off-centre and cut-off signs: the text was placed by measureText, but a colour emoji (iPad) can draw wider than it
   measures, so "🏖 To the beach" or "🏰 Knights & castles" slid off centre or past the edge (the test machine had no colour emoji, so the checks never saw it).
   Now every sign, plate and label draws the text once on a scratch canvas, finds the pixels it REALLY covers (inkOf) and scales and centres by those */
let INKC=null;
function inkBox(x,W,H){const d=x.getImageData(0,0,W,H).data;let x1=W,y1=H,x2=-1,y2=-1;for(let j=0;j<H;j++){const row=j*W*4;for(let i=0;i<W;i++){if(d[row+i*4+3]>40){if(i<x1)x1=i;if(i>x2)x2=i;if(j<y1)y1=j;if(j>y2)y2=j;}}}return x2<0?null:{x1,y1,x2:x2+1,y2:y2+1};}
/* the ink of a text drawn with this font: its size and its middle, relative to the text's origin (textAlign left, the given baseline) */
function inkOf(text,font,baseline){const c=INKC||(INKC=document.createElement('canvas')),x=c.getContext('2d');x.font=font;const tw=Math.ceil(x.measureText(text).width),s=parseInt(font.match(/(\d+)px/)[1],10)||40;
  const W=Math.min(4096,Math.ceil(tw*1.6+s*2+40)),H=Math.min(1024,Math.ceil(s*2.6));if(c.width!==W||c.height!==H){c.width=W;c.height=H;}
  x.clearRect(0,0,W,H);x.font=font;x.textAlign='left';x.textBaseline=baseline||'alphabetic';x.fillStyle='#000';const ox=Math.floor(s*.6),oy=Math.floor(H*(baseline==='middle'?.5:.66));x.fillText(text,ox,oy);
  const b=inkBox(x,W,H);if(!b)return{w:tw,h:s,cx:tw/2,cy:baseline==='middle'?0:-s*.35,x1:0};return{w:b.x2-b.x1,h:b.y2-b.y1,cx:(b.x1+b.x2)/2-ox,cy:(b.y1+b.y2)/2-oy,x1:b.x1-ox};}
function signPlane(text,w,h,bg,fg){text=String(text).replace(/️/g,'');   /* 🧹 no hidden character after an emoji: some tablets drew it as a little box (night 3, job 18) */
  const H=160,W=Math.round(H*w/h),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const draw=()=>{x.fillStyle=bg;x.fillRect(0,0,W,H);let s=104,f=()=>`800 ${s}px ${FONT}`,b=inkOf(text,f(),'alphabetic');
    const mx=Math.max(12,W*.06),my=Math.max(8,H*.1),k=Math.min((W-2*mx)/(b.w||1),(H-2*my)/(b.h||1),1);if(k<1){s=Math.max(12,Math.floor(s*k));b=inkOf(text,f(),'alphabetic');}   /* a wide margin: inside the sign with room to spare */
    x.font=f();x.textAlign='left';x.textBaseline='alphabetic';x.fillStyle=fg;x.fillText(text,W/2-b.cx,H/2-b.cy);};   /* the ink's middle lands in the sign's middle */
  draw();const t=new THREE.CanvasTexture(c);t.anisotropy=4;fontLate(()=>{draw();t.needsUpdate=true;});
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));m.userData.keep=1;m.userData.sign={text,w,h,bg,fg,c};return m;
}"""])
# plates (apartment doors, "Upstairs") centre by ink too
E.append(["  while(x.measureText(t).width>w-34&&fs>12){fs-=3;x.font=`900 ${fs}px ${FONT}`;}x.fillText(t,w/2,h/2+fs*.06);",
          "  while(x.measureText(t).width>w-34&&fs>12){fs-=3;x.font=`900 ${fs}px ${FONT}`;}let b=inkOf(t,x.font,'middle');while(b.w>w-34&&fs>12){fs-=3;x.font=`900 ${fs}px ${FONT}`;b=inkOf(t,x.font,'middle');}x.textAlign='left';x.fillText(t,w/2-b.cx,h/2-b.cy);   /* centred by the ink (run 4, job 5) */"])
# labels (name tags, bubbles, floating texts): the box is as wide as the ink, and the ink sits in its middle
E.append(["  const tw=Math.ceil(x.measureText(text).width);\n  c.width=tw+pad*2+bw*2;c.height=Math.ceil(size*1.36)+bw*2;\n  x.font=f;x.textAlign='center';x.textBaseline='middle';",
          "  const ink=inkOf(text,f,'middle'),tw=Math.max(Math.ceil(ink.w),4);   /* the pixels the text really covers (run 4, job 5: an emoji can draw wider than it measures) */\n  c.width=tw+pad*2+bw*2;c.height=Math.ceil(size*1.36)+bw*2;\n  x.font=f;x.textAlign='left';x.textBaseline='middle';"])
E.append(["  if(o.stroke){x.lineJoin='round';x.lineWidth=o.strokeW||10;x.strokeStyle=o.stroke;x.strokeText(text,c.width/2,ty);}\n  x.fillStyle=o.fg||'#3d2c5e';x.fillText(text,c.width/2,ty);",
          "  const tx=c.width/2-ink.cx;if(o.stroke){x.lineJoin='round';x.lineWidth=o.strokeW||10;x.strokeStyle=o.stroke;x.strokeText(text,tx,ty);}\n  x.fillStyle=o.fg||'#3d2c5e';x.fillText(text,tx,ty);"])

# --- the food truck sign: on the roof's edge above the awning (the awning's inner edge ran through the sign's top), its lamp at the counter's end ---
E.append(["  const sg=signPlane('🍔 Food truck',2.4,.6,'#ff6b6b','#ffffff');sg.position.set(x+1.13,2.05,z-.35);sg.rotation.y=Math.PI/2;L.g.add(sg);\n  sph(st,.11,null,x+1.75,1.95,z-.35,{mat:LAMP,ol:.012,ws:8,hs:6});   /* a little lamp under the awning for the evening */",
          "  box(st,.08,.74,2.6,W,x+1.0,2.5,z-.35,{ol:.015});const sg=signPlane('🍔 Food truck',2.4,.6,'#ff6b6b','#ffffff');sg.position.set(x+1.06,2.87,z-.35);sg.rotation.y=Math.PI/2;L.g.add(sg);   /* 🪧 on the roof's edge above the awning (run 4, job 5: the awning's inner edge used to run through the sign's top) */\n  sph(st,.11,null,x+1.75,1.95,z+.95,{mat:LAMP,ol:.012,ws:8,hs:6});   /* a little lamp under the awning's end for the evening (no longer in front of the sign) */"])
# --- the Pet Show signs: a board behind each sign, the text 4 cm in front of it (nothing coplanar, nothing through the letters) ---
E.append(["    const sg=signPlane('🏆 Pet Show',3.0,.8,'#ffd45c','#3d2c5e');sg.position.set(-37.82,2.62,SZ);sg.rotation.y=Math.PI/2;L.g.add(sg);\n    const sg2=signPlane('Every Saturday!',1.9,.38,'#ffffff','#ff4d8d');sg2.position.set(-37.82,1.98,SZ);sg2.rotation.y=Math.PI/2;L.g.add(sg2);",
          "    box(st,.08,.9,3.16,'#3d2c5e',-37.92,2.17,SZ,{ol:.015});box(st,.08,.46,2.02,'#ff4d8d',-37.92,1.75,SZ,{ol:.012});   /* boards for the two signs (run 4, job 5) */\n    const sg=signPlane('🏆 Pet Show',3.0,.8,'#ffd45c','#3d2c5e');sg.position.set(-37.84,2.62,SZ);sg.rotation.y=Math.PI/2;L.g.add(sg);\n    const sg2=signPlane('Every Saturday!',1.9,.38,'#ffffff','#ff4d8d');sg2.position.set(-37.84,1.98,SZ);sg2.rotation.y=Math.PI/2;L.g.add(sg2);"])

json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j5.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
