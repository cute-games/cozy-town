"""Stage 3, patch k part 5 (round-5 critic notes, house floors and colour): a floor with stairs both ways shows both flights side by side;
the garden's lock plates on little stakes in their pots and the 💧/✨ marks in a small bubble right over the pot; the colour card marks the colour the
house has now and the lane's own colour is a colour like the others; the bigger-house card says which floor of six and shows the coins on a bar;
on a short sideways phone a card keeps clear of the corner map and the notepad; the little roof over a house door casts no smudgy shadow."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))

# h1 the stairs: both flights side by side on a floor with stairs both ways (the way up hid the way down)
OLD=open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/p8dbg/stairs-old.txt',encoding='utf-8').read().rstrip('\n')
assert OLD.startswith('function stairsIn(g,up,W,H,wm,both){') and OLD.count('\n')==8
NEW=r"""function stairsIn(g,up,W,H,wm,both){const n=12,sd=4.2/n,sr=H/n,x0=-W/2,t=.3,a=Math.atan2(H,4.2),zc=both?(up?-UPG/2:UPG/2):0,zd=both?UPG:2*UPG,zr=both&&!up?UPG-.07:-UPG+.07;   /* a floor with stairs both ways: the way up on the left half of the doorway, the way down on the right, each under its own plate (run 4, stage 3: the flight up hid the flight down) */
  for(const k of[-1,1])box(g,4.2,H,t,null,x0-2.1,0,k*(UPG+t/2),{mat:wm,ol:false});box(g,t,H,2*UPG+2*t,null,x0-4.2-t/2,0,0,{mat:wm,ol:false});
  for(let i=0;i<n-1+up;i++)box(g,sd,up?(i+1)*sr:H-(i+1)*sr,zd,'#d9a46c',x0-(i+.5)*sd,up?0:-H,zc,{ol:.012});
  shaftAt(g,4.2,up?3.2:H,zd,x0-2.1,up?H+1.6:-H/2,zc,wm,up?'#f7eef2':'#8f6b4c',up);   /* 🪜 walls in the room's paint (repainting changes them too) */
  if(!up)box(g,4.2,.1,zd,'#f7eef2',x0-2.1,H,zc,{ol:false});
  if(both&&!up){box(g,4.2,H+.95,.1,null,x0-2.1,-H,0,{mat:wm,ol:false});box(g,4.2,.08,.16,'#ffffff',x0-2.1,.95,0,{ol:.01});}   /* the low wall between the two ways, a white rail on top */
  for(const k of[-1,1])box(g,.1,2.7,.1,'#ffffff',x0+.04,0,k*(UPG+.05),{ol:.015});box(g,.1,.1,2*UPG+.2,'#ffffff',x0+.04,2.6,0,{ol:.015});
  box(g,Math.hypot(4.2,H),.07,.08,'#ffffff',x0-2.1,(up?H:-H)/2+.95,zr,{rz:up?-a:a,center:true,ol:.01});for(const u of[.12,.5,.88])box(g,.07,.92,.07,'#ffffff',x0-u*4.2,up?u*H:-u*H,zr,{ol:.01});   /* the rail's three posts (run 4, stage 3: it floated) */
  const pg=new THREE.Group();pg.userData.keep=1;g.add(pg);plate(pg,up?'⬆️ Upstairs':'⬇️ Downstairs','#ffffff','#3d2c5e',both?.84:1.0,.26,x0+.03,(2.6+H)/2,both?(up?-.44:.44):0,Math.PI/2,false,'⬇️ Downstairs');   /* (both plates in one letter size: run 4, stage 3) */
  {const y=up?H:-H,dw=both?.74:1.3;box(g,.07,2.1,dw,'#5fd4b0',x0-4.2+.04,y,zc,{ol:.015});box(g,.09,.5,both?.36:.5,'#bde9ff',x0-4.2+.05,y+1.35,zc,{ol:.012});sph(g,.045,'#ffd45c',x0-4.2+.1,y+1.0,zc+(both?.25:.42),{ws:6,hs:5,ol:false});plate(pg,up?'⬆️ Upstairs':'⬇️ Downstairs','#ffffff','#3d2c5e',both?.7:1.22,both?.24:.3,x0-4.2+.1,y+.72,zc,Math.PI/2,false,'⬇️ Downstairs');}}   /* 🚪 the stairs end at a door with a window and a knob (run 4, stage 3: they ran into a flat wall) */"""
ed(OLD,NEW)

# h2 the garden: a lock plate on a little stake in its pot; the 💧 / ✨ marks in a small bubble just over the pot
ed(r"if(need){const s=lk?label(need,.3):label(need,.42,{bg:null,bw:0,pad:4});s.position.set(rec.pl.x,lk?.8:rec.pl.pot?1.0:1.25,rec.pl.z);YARD.gin.add(s);rec.icon=s;}",
   r"if(need){let s;if(lk){s=new THREE.Group();const t=label(need,.24);t.position.y=.72;s.add(t);cyl(s,.016,.02,.34,'#a87a52',0,.24,0,{seg:6,ol:false});s.position.set(rec.pl.x,0,rec.pl.z);}else{s=label(need,.34);s.position.set(rec.pl.x,rec.pl.pot?.82:1.0,rec.pl.z);}YARD.gin.add(s);rec.icon=s;}   /* (run 4, stage 3: the lock plate on a little stake in its pot, the 💧 in a small bubble right over the pot: both hung in the air) */")

# h3 the colour card: the house's colour now is marked, and the lane's own colour is a colour like the others
ed(r"""<div class="dots">${HOUSE_COLS.map(([c,n])=>`<button class="dotb${cur===c?' on':''}" data-a="hcol:${c}" aria-label="${n}"><i style="background:${c}"></i>${n}</button>`).join('')}</div>""",
   r"""<div class="dots">${HOUSE_COLS.map(([c,n])=>`<button class="dotb${houseColNow()===c?' on':''}" data-a="hcol:${c}" aria-label="${n}"><i style="background:${c}"></i>${n}</button>`).join('')}</div>""")
ed(r"""<div class="row" style="justify-content:center;margin-top:8px"><button class="btn ${cur?'white':'mint'}" id="hcLane" data-a="hcol:">${cur?'↩️':'✅'} The lane's own colour</button></div>`,{cls:'setcard hpaint'});""",
   r"""<div class="row" style="justify-content:center;margin-top:8px"><button class="dotb lane${cur?'':' on'}" id="hcLane" data-a="hcol:" aria-label="The lane's own colour"><i style="background:${laneOwnCol()}"></i>🏡 The lane's own colour</button></div>`,{cls:'setcard hpaint'});   /* (run 4, stage 3: the colour the house has now is marked, the lane's own colour is a colour like the others, not a button with a tick that read as a status) */""")
ed(r"""const on=document.querySelector('#card .dotb.on');if(on)on.classList.remove('on');const b=c&&document.querySelector(`#card [data-a="hcol:${c}"]`);if(b)b.classList.add('on');const lb=$('hcLane');if(lb){lb.className='btn '+(c?'white':'mint');lb.textContent=(c?'↩️':'✅')+" The lane's own colour";}""",
   r"""const now=houseColNow();for(const b of document.querySelectorAll('#card .dotb'))b.classList.toggle('on',b.id==='hcLane'?!c:b.dataset.a==='hcol:'+now);""")
ed(r"function houseColNow(){return houseCol()||LANE_PAL[hashStr((S.name||'').toLowerCase())%LANE_PAL.length][0];}",
   r"function laneOwnCol(){return LANE_PAL[hashStr((S.name||'').toLowerCase())%LANE_PAL.length][0];}" "\n"
   r"function houseColNow(){return houseCol()||laneOwnCol();}")

# h4 the bigger-house card: which floor of six, and the coins on a bar
ed(r"""<p class="ph-sub">${n===1?'Stairs up to a whole second floor to decorate! Your downstairs stays just as it is: nothing moves.':'Floor '+(n+1)+' of 6: the stairs go on up. Everything you have stays where it is.'}</p>""",
   r"""<p class="ph-sub"><b>Floor ${n+1} of 6!</b> ${n===1?'Stairs up to a whole second floor to decorate! Your downstairs stays just as it is: nothing moves.':'The stairs go on up. Everything you have stays where it is.'}</p>""")
ed(r"""<div class="ph-row"><span>🪙 ${BIG_PRICE} coins</span><span>${S.coins>=BIG_PRICE?'✅':S.coins+' / '+BIG_PRICE}</span></div>""",
   r"""<div class="ph-row"><span>🪙 ${BIG_PRICE} coins</span><span>${S.coins>=BIG_PRICE?'✅':S.coins+' / '+BIG_PRICE}</span></div>${S.coins<BIG_PRICE?`<div class="coinbar" aria-hidden="true"><i style="width:${Math.round(100*S.coins/BIG_PRICE)}%"></i></div>`:''}""")
ed(r".bar i{display:block;height:100%;width:50%;background:var(--mint);transition:width .4s}",
   r".bar i{display:block;height:100%;width:50%;background:var(--mint);transition:width .4s}.coinbar{height:14px;margin:6px 2px 0;border-radius:99px;background:var(--paper2);border:2px solid var(--line);overflow:hidden}.coinbar i{display:block;height:100%;background:var(--butter)}")

# h5 a short sideways phone: a card at the bottom keeps clear of the corner map and the notepad (not in a shoot or a dance: those cards have their own places)
ed(r"#panel.bottom{align-items:flex-end;background:transparent}",
   r"#panel.bottom{align-items:flex-end;background:transparent}@media (orientation:landscape) and (max-height:500px){body:not(.shoot):not(.dancing) #panel.bottom{padding-left:calc(env(safe-area-inset-left,0px) + 126px)}}   /* (run 4, stage 3: the card ran into the corner map and the notepad) */")

# h6 the little roof over a house's door casts no shadow (it fell on the wall as dark smudges round the door)
ed(r"    for(const s of[-1,1])box(p,.1,.36,.42,'#ffffff',s*.9,2.26,.21,{ol:.012});}",
   r"    for(const s of[-1,1])box(p,.1,.36,.42,'#ffffff',s*.9,2.26,.21,{ol:.012});if(o.gable){bake(p,false);p.userData.keep=1;}}   /* (run 4, stage 3: a house's little door roof and its brackets cast no shadow: on the wall they were dark smudges round the door) */")

bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
