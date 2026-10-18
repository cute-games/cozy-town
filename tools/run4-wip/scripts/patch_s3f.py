p='/home/user/cozy-town/index.html'; s=open(p,encoding='utf-8').read(); orig=s; R=[]
def rep(name,old,new,n=1): R.append((name,old,new,n))
# 1. the hidden-controls bug: #card keeps its class after closePanel, so every rule must also ask that the panel is open
rep('phone joy rule',"body:has(#card.phonecard) #joy,body:has(#card.phonecard) #moveBtns{visibility:hidden}",
 "body:has(#panel:not([hidden]) #card.phonecard) #joy,body:has(#panel:not([hidden]) #card.phonecard) #moveBtns{visibility:hidden}")
rep('phone hud rule',"@media (max-height:500px){body:has(#card.phonecard) #stats,body:has(#card.phonecard) #bChat{visibility:hidden}}",
 "@media (max-height:500px){body:has(#panel:not([hidden]) #card.phonecard) #stats,body:has(#panel:not([hidden]) #card.phonecard) #bChat{visibility:hidden}}")
rep('pose bar rule',"body:has(#card.ptpose) #ptbar{visibility:hidden}","body:has(#panel:not([hidden]) #card.ptpose) #ptbar{visibility:hidden}")
# 2. small screens: a centered card hides the HUD pieces it would half-cover (they peeked out at its edges)
rep('small screen card hud',"#panel.bottom{align-items:flex-end;background:transparent}",
 "#panel.bottom{align-items:flex-end;background:transparent}@media (max-width:600px),(max-height:500px){body:has(#panel:not([hidden]):not(.bottom):not(.side)) :is(#stats,#topbtns,#bChat,#left,#joy,#moveBtns,#busTip){visibility:hidden}}   /* (run 4, stage 3: on a phone a card takes the screen; the HUD pieces it would cut in half wait under it) */")
# 3. the N34 sign height stays the kit's (the sign is only bigger)
rep('lane sign y',"const tg=label('🏠 '+o.nm,.9+.16*(fl-1));tg.position.set(lp.hx,big?opt.h+3.9+.1*(fl-1):7.9,lp.hz);","const tg=label('🏠 '+o.nm,.9+.16*(fl-1));tg.position.set(lp.hx,big?opt.h+3.9:7.9,lp.hz);")
# 4. the photographer on an upright phone: the frame above the joystick and the bar (a camera app's layout), the pose card at the top, no aim dot
rep('portrait frame',"#ptvf{top:calc(env(safe-area-inset-top,0px) + 150px);bottom:calc(env(safe-area-inset-bottom,0px) + 134px)}body.shoot #joy{bottom:calc(env(safe-area-inset-bottom,0px) + 152px)}",
 "#ptvf{top:calc(env(safe-area-inset-top,0px) + 150px);bottom:calc(env(safe-area-inset-bottom,0px) + 302px)}body.shoot #joy{bottom:calc(env(safe-area-inset-bottom,0px) + 152px)}#panel.bottom:has(.card.ptpose){align-items:flex-start;padding-top:calc(env(safe-area-inset-top,0px) + 150px)}")
rep('frame under buttons',"#ptvf{position:absolute;left:4%;right:4%;top:calc(env(safe-area-inset-top,0px) + 68px)","#ptvf{position:absolute;left:4%;right:4%;top:calc(env(safe-area-inset-top,0px) + 84px)")
rep('no aim dot in shoot',"body.shoot #moveBtns,body.shoot #tasks,body.shoot #pad,body.shoot #job,body.shoot #busTip{visibility:hidden}","body.shoot #moveBtns,body.shoot #tasks,body.shoot #pad,body.shoot #job,body.shoot #busTip,body.shoot #cross{visibility:hidden}")
rep('coin pop portrait',"body:has(#panel.bottom:not([hidden])) .pop.coin{top:9%}","body:has(#panel.bottom:not([hidden])) .pop.coin{top:9%}@media (orientation:portrait){body:has(#panel.bottom:not([hidden])) .pop.coin{top:14%}}")
# 5. the party, dance, knock and tutorial cards follow the theme; the party cards' buttons have a gap
rep('cards theme',"#hpCard,#dnCard{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 74px);transform:translateX(-50%);z-index:9500;background:#fff;border:3px solid #3d2c5e;",
 "#hpCard,#dnCard{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 74px);transform:translateX(-50%);z-index:9500;background:var(--paper);border:3px solid var(--line);")
rep('cards ink',"text-align:center;width:min(410px,92vw);color:#3d2c5e;animation:kcPop .2s ease-out}","text-align:center;width:min(410px,92vw);color:var(--ink);animation:kcPop .2s ease-out}#hpCard .kc-b,#dnCard .kc-b{display:flex;gap:10px;justify-content:center}")
rep('knock theme',"#knockCard{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 74px);transform:translateX(-50%);z-index:9500;background:#fff;border:3px solid #3d2c5e;",
 "#knockCard{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 74px);transform:translateX(-50%);z-index:9500;background:var(--paper);border:3px solid var(--line);")
rep('knock ink',"text-align:center;width:min(340px,88vw);color:#3d2c5e;animation:kcPop .35s ease-out}","text-align:center;width:min(340px,88vw);color:var(--ink);animation:kcPop .35s ease-out}")
rep('tut theme',"#tutCard{position:fixed;left:50%;transform:translateX(-50%);width:min(430px,calc(100vw - 24px));background:#fff;color:#3d2c5e;border:4px solid #3d2c5e;",
 "#tutCard{position:fixed;left:50%;transform:translateX(-50%);width:min(430px,calc(100vw - 24px));background:var(--paper);color:var(--ink);border:4px solid var(--line);")
# 6. the tutorial pictures: the hand points at the chair; air round the booking line
rep('tut h1 hand',"hand(330,150,46);txt('A customer sits down',250,185,20);}","hand(52,128,46);txt('A customer sits down',250,185,20);}")
rep('tut f1 text',"em('📸',62,68,38);txt('Mia · Cozy Park',180,55,20);txt('family photo · the fountain',180,86,16);","em('📸',55,68,34);txt('Mia · Cozy Park',186,55,20);txt('family photo · the fountain',188,86,15);")
# 7. October: the path lamps show their light (the lit glass sat inside the dark lamp box); lighter path stones, off the grass
rep('spooky lamps',"box(st,.2,.26,.2,'#2e2347',x,.9,z,{ol:.012});box(st,.14,.18,.14,null,x,.94,z,{ol:false,mat:new THREE.MeshBasicMaterial({color:'#ffd36b'})});",
 "box(st,.2,.05,.2,'#2e2347',x,.86,z,{ol:.012});box(st,.15,.2,.15,null,x,.91,z,{ol:.01,mat:new THREE.MeshBasicMaterial({color:'#ffd36b'})});cone(st,.17,.12,'#2e2347',x,1.11,z,{seg:4,ry:Math.PI/4,ol:.012});glows.push([x,1.0,z,.9,[1,.75,.3]]);")
rep('spooky stones',"disc(st,.36,k%2?'#5a3e8a':'#4a2f74',x,.028,z,{seg:12});","disc(st,.36,k%2?'#8a6cc4':'#7a5ab4',x,.044,z,{seg:12});")
rep('spookBuild glows',"function spookBuild(L,G,st){const r=seeded(41),W=SPOOK_WAY;let len=0;","function spookBuild(L,G,st,glows){glows=glows||[];const r=seeded(41),W=SPOOK_WAY;let len=0;")
rep('spookBuild call',"    spookBuild(L,G,st);}","    spookBuild(L,G,st,glows);}")
# 8. Santa steps out of the tree's lowest branches
rep('santa out of tree',"const x=XT[0]+2.3,z=XT[1]-.4;","const x=XT[0]+2.95,z=XT[1]-.5;")
# 9. garland flags hang from their string
rep('garland flags',"cone(g,.14,.3,cols[i%cols.length],x,y-.3,z,{rx:Math.PI,ry:a,center:true,seg:3,ol:false,s:[1,1,.55]});","cone(g,.14,.3,cols[i%cols.length],x,y-.17,z,{rx:Math.PI,ry:a,center:true,seg:3,ol:false,s:[1,1,.55]});")
# 10. the phone screen shows that it scrolls (a soft fade at its bottom edge)
rep('phone fade',".ph-screen:has(>.ph-hd){padding-top:0}",".ph-screen:has(>.ph-hd){padding-top:0}.ph-screen{-webkit-mask-image:linear-gradient(to bottom,#000 calc(100% - 22px),transparent);mask-image:linear-gradient(to bottom,#000 calc(100% - 22px),transparent)}")
bad=[]
for name,old,new,n in R:
    c=s.count(old)
    if c!=n: bad.append((name,c)); continue
    s=s.replace(old,new)
print('applied',len(R)-len(bad),'of',len(R)); print('FAILED:',bad)
if s!=orig: open(p,'w',encoding='utf-8').write(s)
