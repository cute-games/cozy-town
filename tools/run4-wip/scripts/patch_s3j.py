"""Stage 3, patch j: the scroll arrow never sits on a card's words (on an upright phone the card makes room for it below), the wide-screen
pose card narrower with three poses a row, the Pet Shop card's Decorate words together."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))
ed("a.hidden=!m||!!f;if(a.hidden)return;const r=c.getBoundingClientRect(),p=$('panel').getBoundingClientRect(),below=visH()-r.bottom>=54,right=innerWidth-r.right>=54;",
   "a.hidden=!m||!!f;if(a.hidden)return;const r=c.getBoundingClientRect(),p=$('panel').getBoundingClientRect(),below=visH()-r.bottom>=54,right=innerWidth-r.right>=54;\n  if(!below&&!right&&!KB.on&&!c.dataset.mh&&r.height>300){c.dataset.mh='1';c.style.maxHeight=Math.round(r.height-2*(54-(visH()-r.bottom)))+'px';return cardMore();}   /* (run 4, stage 3: no room beside or under a tall card on an upright phone: the card gets a little shorter, so the arrow sits under it, never on its words) */")
ed("$('card').innerHTML=html;p.hidden=false;if(fresh)$('card').scrollTop=0;","$('card').innerHTML=html;if(!KB.on){$('card').style.maxHeight='';delete $('card').dataset.mh;}p.hidden=false;if(fresh)$('card').scrollTop=0;")
ed("@media (orientation:landscape){#panel.bottom .card.ptpose{margin-right:auto;margin-left:0;width:min(420px,46vw)}",
   "@media (orientation:landscape){#panel.bottom .card.ptpose{margin-right:auto;margin-left:0;width:min(360px,40vw)}#panel.bottom .card.ptpose .grid{grid-template-columns:repeat(3,1fr);gap:8px}#panel.bottom .card.ptpose .it .em{font-size:32px}")
ed("Place them at home with 🛋️ Decorate.</p>","Place them at home with&nbsp;🛋️&nbsp;Decorate.</p>")
bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
