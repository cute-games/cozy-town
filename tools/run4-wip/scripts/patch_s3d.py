p='/home/user/cozy-town/index.html'; s=open(p,encoding='utf-8').read(); orig=s; R=[]
def rep(name,old,new,n=1): R.append((name,old,new,n))
# the scroll hint: outside the card when there is room (below, else to the right), else on the bottom edge in the middle
rep('moreHint place',"a.hidden=!m||!!f;if(a.hidden)return;const r=c.getBoundingClientRect(),p=$('panel').getBoundingClientRect(),side=innerWidth-r.right>=20;   /* no room on the right (a phone held upright): on the bottom edge */\n  a.style.left=Math.round((side?r.right-72:(r.left+r.right)/2-23)-p.left)+'px';a.style.top=Math.round(Math.min(r.bottom-24,visH()-50)-p.top)+'px';}",
 "a.hidden=!m||!!f;if(a.hidden)return;const r=c.getBoundingClientRect(),p=$('panel').getBoundingClientRect(),below=visH()-r.bottom>=54,right=innerWidth-r.right>=54;   /* run 4, stage 3: outside the card when there is room (under it, else beside it), so it never sits on a button or a word; only on a phone held upright on the bottom edge, in the middle */\n  if(below){a.style.left=Math.round((r.left+r.right)/2-23-p.left)+'px';a.style.top=Math.round(r.bottom+4-p.top)+'px';}else if(right){a.style.left=Math.round(r.right+4-p.left)+'px';a.style.top=Math.round(r.bottom-54-p.top)+'px';}else{a.style.left=Math.round((r.left+r.right)/2-23-p.left)+'px';a.style.top=Math.round(Math.min(r.bottom-24,visH()-50)-p.top)+'px';}}")
# upright phones: the party and dance cards hide the corner map and the notepad under them
rep('portrait cards css',"#hpCard,#dnCard{position:fixed;left:50%;","@media (orientation:portrait){body:has(#hpCard:not([hidden])) #mmBtn,body:has(#hpCard:not([hidden])) #pad,body:has(#dnCard:not([hidden])) #mmBtn,body:has(#dnCard:not([hidden])) #pad{visibility:hidden}}   /* (run 4, stage 3: the card sat on the map and the notepad) */\n#hpCard,#dnCard{position:fixed;left:50%;")
# the coin pop above a bottom card
rep('coin pop',".pop.coin{top:20%;color:#c88a00}",".pop.coin{top:20%;color:#c88a00}body:has(#panel.bottom:not([hidden])) .pop.coin{top:9%}")
# striped party hats
rep('party hat stripes',"else if(k==='party'){cone(h,.19,.46,c,0,.4,0,{seg:14,...o});for(let i=0;i<3;i++)for(let j=0;j<3;j++){const a=j/3*TAU+i*.7,rr=.19*(1-(i+.5)*.3);sph(h,.028,'#ffffff',Math.cos(a)*rr,.4+(i+.5)*.153,Math.sin(a)*rr,{ws:6,hs:5,ol:false});}sph(h,.06,'#ffd45c',0,.9,0,{ws:8,hs:6,ol:false});}",
 "else if(k==='party'){cone(h,.19,.46,c,0,.4,0,{seg:14,...o});cone(h,.19*.67+.004,.46*.67,'#ffffff',0,.4+.46*.33-.002,0,{seg:14,ol:false});cone(h,.19*.34+.004,.46*.34,c,0,.4+.46*.66-.002,0,{seg:14,ol:false});sph(h,.06,'#ffd45c',0,.9,0,{ws:8,hs:6,ol:false});}   /* 🥳 three stripes: the colour, white, the colour (run 4, stage 3) */")
# the phone header title ends in … when long
rep('ph-hd h3',".ph-hd h3{margin:0;font-size:26px;font-weight:800;flex:1;line-height:1}",".ph-hd h3{margin:0;font-size:26px;font-weight:800;flex:1;line-height:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}")
# the fire station's bell: 50 cm further from the sign
rep('fire bell',"box(pr,.62,.62,.05,'#d3262f',1.2,2.3,-4.45,{ol:.012});cyl(pr,.07,.07,.2,'#8f6244',1.2,2.3,-4.38,{rx:Math.PI/2,center:true,seg:6,ol:false});sph(pr,.28,'#ffd45c',1.2,2.3,-4.28,{s:[1,1,.6],ws:12,hs:8});inter(L,{x:1.2,z:-3.5,r:1.7,icon:'🔔',label:'Ring the bell',act:()=>{SFX.honk();floatText('🔔',L.ox+1.2,2.6,L.oz-4.1,{h:.6});",
 "box(pr,.62,.62,.05,'#d3262f',1.7,2.3,-4.45,{ol:.012});cyl(pr,.07,.07,.2,'#8f6244',1.7,2.3,-4.38,{rx:Math.PI/2,center:true,seg:6,ol:false});sph(pr,.28,'#ffd45c',1.7,2.3,-4.28,{s:[1,1,.6],ws:12,hs:8});inter(L,{x:1.7,z:-3.5,r:1.7,icon:'🔔',label:'Ring the bell',act:()=>{SFX.honk();floatText('🔔',L.ox+1.7,2.6,L.oz-4.1,{h:.6});")
# the hunt egg: no white ball on its front
rep('egg ball',"cyl(g,.21,.21,.07,'#ffc93c',e.x,y+.54,e.z,{seg:12,ol:false});sph(g,.07,'#ffffff',e.x+.11,y+.46,e.z+.2,{ws:6,hs:5,ol:false});}","cyl(g,.21,.21,.07,'#ffc93c',e.x,y+.54,e.z,{seg:12,ol:false});}   /* (run 4, stage 3: the white shine ball bulged out of the egg) */")
# the spooky path lamps glow by themselves
rep('spooky lamp glass',"box(st,.14,.18,.14,'#ffd36b',x,.94,z,{ol:false});holPiece('path lamp',x,z,0);}","box(st,.14,.18,.14,null,x,.94,z,{ol:false,mat:new THREE.MeshBasicMaterial({color:'#ffd36b'})});holPiece('path lamp',x,z,0);}   /* (run 4, stage 3: the lamp glass is lit on its own, so it reads as a lamp at night) */")
# upright phones: the joystick above the photo bar during a shoot
rep('shoot joy portrait',"#ptvf{top:calc(env(safe-area-inset-top,0px) + 150px);bottom:calc(env(safe-area-inset-bottom,0px) + 134px)}","#ptvf{top:calc(env(safe-area-inset-top,0px) + 150px);bottom:calc(env(safe-area-inset-bottom,0px) + 134px)}body.shoot #joy{bottom:calc(env(safe-area-inset-bottom,0px) + 152px)}")
bad=[]
for name,old,new,n in R:
    c=s.count(old)
    if c!=n: bad.append((name,c)); continue
    s=s.replace(old,new)
print('applied',len(R)-len(bad),'of',len(R)); print('FAILED:',bad)
if s!=orig: open(p,'w',encoding='utf-8').write(s)
