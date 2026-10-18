"""Stage 3, patch k part 6 (round-5 critic notes, parties and the dance game): arrows fade once past the hit line; a solid soft lane; the
partner's name tag rests during the round and its result (the score bar names both); the result view keeps both dancers clear of the card;
the mailbox card's two buttons big and in the middle, the party cards' words bigger, "come over!" together."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))

# d1 an arrow that is past the hit line and not hit fades out in a moment (it slid on and was cut by the lane's bottom edge)
ed(r"if(q.j===1&&!el.classList.contains('hit'))el.classList.add('hit');",
   r"if(q.j!==1)el.style.opacity=dtq<0?String(Math.max(0,(q.j===-1?.3:1)*(1+dtq/.22))):'';if(q.j===1&&!el.classList.contains('hit'))el.classList.add('hit');")
# d2 the lane a solid soft white (the floor tiles and the window showed through behind the arrows)
ed(r"height:min(44vh,330px);background:rgba(255,255,255,.55);", r"height:min(44vh,330px);background:rgba(255,250,253,.92);")
# d3 the partner's name tag rests while you dance and while the result shows (it hid the mirror ball; the score bar has both names)
ed(r"function dnTick(dt){const D=DANCE;if(!S)return;if(D.spots)D.spots.rotation.y+=dt*.5;",
   r"function dnTick(dt){const D=DANCE;if(!S)return;if(D.spots)D.spots.rotation.y+=dt*.5;" "\n"
   r"  {const pa=D.partner&&MP.peers.get(D.partner),tg=pa&&pa.av&&pa.av.tag;if((D.on||D.res)&&tg){tg.visible=false;D.hidTag=tg;}else if(D.hidTag&&!(D.on||D.res)){D.hidTag.visible=true;D.hidTag=null;}}   /* (run 4, stage 3: the partner's tag rests during the round and its result: it hid the mirror ball, and the score bar names both) */")
# d4 the result view: the two dancers clear of the result card (beside it on a short sideways screen, above it on a tablet or computer)
ed(r"const c=D.cam,f=D.floor,ty=innerWidth<innerHeight?.15:visH()<=500?1.3:1.0,lo=innerWidth>innerHeight?.6:0;",
   r"const c=D.cam,f=D.floor,wide=innerWidth>innerHeight,short=visH()<=500,ty=!wide?.15:short?(D.res?1.2:1.3):(D.res?.55:1.0),lo=wide?(D.res&&short?1.9:.6):0;   /* (run 4, stage 3: with the result card up, the view looks further aside on a short sideways screen and lower on a tablet or computer, so the card covers neither dancer) */")
# d5 the mailbox card: its two buttons big and in the middle; the party cards' words bigger; "come over!" together
ed(r"""<div class="row wrap"><button class="btn butter" data-a="hpmail">📬 Check mail</button>""",
   r"""<div class="row wrap hpbtns"><button class="btn butter" data-a="hpmail">📬 Check mail</button>""")
ed(r"""<button class="btn mint" data-a="hpplan">🎉 Host a party</button>`}</div>`,{bottom:true});}""",
   r"""<button class="btn mint" data-a="hpplan">🎉 Host a party</button>`}</div>`,{bottom:true,cls:'hpcard'});}""")
ed(r"""<p class="note">Pick a time. Your friends get an invitation, and when it starts they can come over!</p>""",
   r"""<p class="note">Pick a time. Your friends get an invitation, and when it starts they can come&nbsp;over!</p>""")
ed(r"""<span>${d===n.day?'Today':'Tomorrow'}<br>${clockStr(h)}</span></button>`).join('')}</div>`,{bottom:true});};""",
   r"""<span>${d===n.day?'Today':'Tomorrow'}<br>${clockStr(h)}</span></button>`).join('')}</div>`,{bottom:true,cls:'hpcard'});};""")
ed(r".dnCol{position:absolute;top:0;bottom:0;width:25%;",
   r"#card.hpcard .note{font-size:17px}#card.hpcard .hpbtns{justify-content:center;gap:12px}#card.hpcard .hpbtns .btn{min-height:60px;font-size:19px;padding:10px 20px;flex:1 1 200px;max-width:280px}   /* (run 4, stage 3: bigger words and buttons for a child; the buttons in the middle) */" "\n"
   r".dnCol{position:absolute;top:0;bottom:0;width:25%;")

bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
