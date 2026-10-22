"""Run 4 finish, edit f3: fixes from pass 8 (the double-checkers' kept marks), each from its cause.
- Quests: "Buy a fairy wings at the Pet shop": a pair of wings, glasses, ears or headphones ("a pair of"), some fries, noodles or dumplings; the shop
  names in quests, cards and the friends list are the names on the buildings (Pet Shop, Flower Shop, Toy Store, Ice Cream Shop, Clothes Shop).
- Café, Bakery and Ice Cream chalkboards: their rows are spaced to the board, so a fifth row keeps air above the frame.
- Designer job: the wish card's "room 1 of 2" goes on its own line (the card is 170 px wide; the title was cut to "Sunny living room · r...").
- Hairstylist tutorial: the bottom captions are centred in the picture (they sat at x 250 and 230 of 420).
- What's new book: no emoji alone on a line (a non-breaking space before a line's last emoji), "dance-off" and 🕺💃 never split,
  and page 5's last line says what the ❓ is for instead of ending in a ❓ like a question.
- Night sky: the stars and the moon fade out with the grey sky in rain, snow and cloudy weather (they shone between the rain streaks).
- October ghosts: the one that circled the park fountain at 1.2 m from its middle (its bowls) circles 4 m from it.
- 1 September: the school party banner hangs from the left balloons to the school's name board, clear of the board (stage 3 put the board on
  posts right of the door, across the banner's right end)."""
import sys
P = '/home/user/cozy-town/index.html'
s = open(P, encoding='utf-8').read()
E = []
def ed(old, new, c=1): E.append((old, new, c))

# quests: plural things and shop names
ed(r"""const aAn=n=>{const l=n.toLowerCase();return(SOME.has(l)?'some ':/^[aeiou]/.test(l)?'an ':'a ')+l;};""",
   r"""const PAIR=new Set(['fairy wings','bunny ears','cat ears','headphones','glasses','sunglasses','heart glasses','pet sunglasses']);   /* (run 4 finish: "Buy a fairy wings" read wrong) */
['fries','noodles','dumplings'].forEach(n=>SOME.add(n));
const aAn=n=>{const l=n.toLowerCase();return(PAIR.has(l)?'a pair of ':SOME.has(l)?'some ':/^[aeiou]/.test(l)?'an ':'a ')+l;};""")
ed(r"icecream:{title:'Ice cream shop',", r"icecream:{title:'Ice Cream Shop',")
ed(r"toys:{title:'Toy store',", r"toys:{title:'Toy Store',")
ed(r"pets:{title:'Pet shop',", r"pets:{title:'Pet Shop',")
ed(r"flowers:{title:'Flower shop',", r"flowers:{title:'Flower Shop',")
ed(r"<h2>👗 Clothing store</h2>", r"<h2>👗 Clothes Shop</h2>")
ed(r"d:'Buy something at the Flower shop'", r"d:'Buy something at the Flower Shop'")
ed(r"{d:'Buy 2 things at the Flower shop',", r"{d:'Buy 2 things at the Flower Shop',")
ed(r"flowers:'Flower shop',clothes:'Clothing store',toys:'Toy Store',bakery:'Bakery',icecream:'Ice Cream shop'", r"flowers:'Flower Shop',clothes:'Clothes Shop',toys:'Toy Store',bakery:'Bakery',icecream:'Ice Cream Shop'")
ed(r"flowers:'🌷 At the Flower shop',clothes:'👗 At the Clothing store'", r"flowers:'🌷 At the Flower Shop',clothes:'👗 At the Clothes Shop'")
ed(r"icecream:'🍦 At the Ice Cream shop'", r"icecream:'🍦 At the Ice Cream Shop'")

# chalkboards
ed(r"""  x.font=`700 52px ${FONT}`;rows.forEach(([a,b],i)=>{const y=200+i*66;x.textAlign='left';x.fillText(a,70,y);x.textAlign='right';x.fillText(b,W-70,y);});""",
   r"""  const st=rows.length>1?Math.min(66,(440-196)/(rows.length-1)):0;x.font=`700 ${rows.length>4?48:52}px ${FONT}`;rows.forEach(([a,b],i)=>{const y=196+i*st;x.textAlign='left';x.fillText(a,70,y);x.textAlign='right';x.fillText(b,W-70,y);});   /* (run 4 finish: rows spaced to the board; a fifth row sat on the frame) */""")

# designer wish card
ed(r"#dcard .dct{font:800 13px/1.15 var(--font);padding:5px 7px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
   r"#dcard .dct{font:800 13px/1.15 var(--font);padding:5px 7px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#dcard .dct small{display:block;font-size:12px;opacity:.8}")
ed(r"${o.r2?` <small>· room ${(o.ri|0)+1} of 2</small>`:''}", r"${o.r2?` <small>room ${(o.ri|0)+1} of 2</small>`:''}")

# hairstylist tutorial captions
ed(r"hand(52,128,46);txt('A customer sits down',250,185,20);}", r"hand(52,128,46);txt('A customer sits down',210,185,20);}")
ed(r"txt('Make the hair like the picture',230,185,19);}", r"txt('Make the hair like the picture',210,185,19);}")

# the What's new book
ed(r"""p:['Decorate more and your house gets floors, up to six! 🏠','Pick a colour for your house at the paint pot 🎨','Every skill goes up to level 50 ⭐']""",
   r"""p:['Decorate more and your house gets floors, up to six!&nbsp;🏠','Pick a colour for your house at the paint pot&nbsp;🎨','Every skill goes up to level 50&nbsp;⭐']""")
ed(r"""p:['February: a heart fountain at the Flower Corner 💗','At Easter the bunny hides 25 eggs. Find them all!','December: a big tree and Santa; fireworks at New Year 🎆']""",
   r"""p:['February: a heart fountain at the Flower Corner&nbsp;💗','At Easter the bunny hides 25 eggs. Find them all!','December: a big tree and Santa; fireworks at New Year&nbsp;🎆']""")
ed(r"""p:['The Pet Shop has an upstairs: every animal in its own corner 🐣','72 new pieces of furniture, even a disco floor 🪩']""",
   r"""p:['The Pet Shop has an upstairs: every animal in its own corner&nbsp;🐣','72 new pieces of furniture, even a disco floor&nbsp;🪩']""")
ed(r"""'Pick the background, give everyone a pose, then Snap! 📸','Your tutorials are pictures now ❓']""",
   r"""'Pick the background, give everyone a pose, then Snap!&nbsp;📸','Job tutorials are pictures now: tap&nbsp;❓ on a job card to see one!']""")
ed(r"""'Jump from deck to deck, ride the zip lines 🪢',""", r"""'Jump from deck to deck, ride the zip lines&nbsp;🪢',""")
ed(r"""h:'🎉 Parties and the dance-off',p:['Host a party at your mailbox and pick a time! 📬','Friends get the news and come over 🎈','With a disco floor: a dance-off for two! 🕺💃']""",
   r"""h:'🎉 Parties and the <span class="nw">dance-off</span>',p:['Host a party at your mailbox and pick a time!&nbsp;📬','Friends get the news and come over&nbsp;🎈','With a disco floor: a <span class="nw">dance-off</span> for two!&nbsp;<span class="nw">🕺💃</span>']""")
ed(r".tutRow{display:flex;justify-content:space-between;gap:10px}", r".nw{white-space:nowrap}.tutRow{display:flex;justify-content:space-between;gap:10px}")

# the night sky in grey weather
ed(r"  stars.material.opacity=nf;stars.visible=out&&nf>0;",
   r"  {const so=nf*(1-(out?WX.sky:0));stars.material.opacity=so;stars.visible=out&&so>.01;}   /* (run 4 finish: no stars through a grey rainy sky) */")
ed(r"moonSprite.visible=!day||h<6.4||h>18.2;", r"moonSprite.visible=(!day||h<6.4||h>18.2)&&WX.sky<.5;")

# the ghost by the park fountain
ed(r"for(const p of [[-30,16,1.6],[-26,30,1.6],[-14,26,1.6],[-34,36,1.4],[-20,20,1.6],", r"for(const p of [[-30,16,1.6],[-26,30,1.6],[-14,26,1.6],[-34,36,1.4],[-18.2,18.2,1.6],")

# the school party banner
ed(r"""{const b=signPlane('🎈 School party today! 🎈',6.4,.7,'#ff6b6b','#ffffff');b.position.set(-25,2.98,-57.72);g.add(b);SCH.pieces++;}   /* 🎈 a banner between the door's balloons, read from the street (run 4, stage 3) */""",
   r"""{const b=signPlane('🎈 School party today! 🎈',4.2,.7,'#ff6b6b','#ffffff');b.position.set(-26.3,2.98,-57.72);g.add(b);SCH.pieces++;}   /* 🎈 a banner from the left door balloons to the school's name board, read from the street (run 4, stage 3; run 4 finish: shorter, clear of the board on its posts right of the door) */""")

bad = 0
for old, new, c in E:
    n = s.count(old)
    if n != c: print('COUNT', n, '!=', c, ':', old[:120]); bad += 1
if bad: sys.exit(1)
for old, new, c in E: s = s.replace(old, new)
open(P, 'w', encoding='utf-8').write(s)
print('applied', len(E), 'edits')
