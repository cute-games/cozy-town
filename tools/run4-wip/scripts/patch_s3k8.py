"""Stage 3, patch k part 8 (the pass-7 marks the double-checkers kept): a plate's words keep some air at both ends; a wider phone on a short
sideways screen; the big map's tip fades after a moment (it sat on the map's bottom row); on an upright phone a pose card brings the camera
back to where the whole group fits above it."""
import sys
P='/home/user/cozy-town/index.html'
s=open(P,encoding='utf-8').read()
E=[]
def ed(old,new,count=1):E.append((old,new,count))
ed(r"while(x.measureText(fit).width>w-34&&fs>12){fs-=3;x.font=`900 ${fs}px ${FONT}`;}let b=inkOf(fit,x.font,'middle');while(b.w>w-34&&fs>12)",
   r"while(x.measureText(fit).width>w*.84&&fs>12){fs-=3;x.font=`900 ${fs}px ${FONT}`;}let b=inkOf(fit,x.font,'middle');while(b.w>w*.84&&fs>12)")   # (run 4, stage 3: "⬇️ Downstairs" ran right to both ends of its plate)
ed(r"+'.phone{width:min(440px,94vw);padding:8px 10px 6px;gap:4px}",
   r"+'.phone{width:min(600px,72vw);padding:8px 10px 6px;gap:4px}")   # (run 4, stage 3: on a short sideways screen the phone was narrow, so job and quest cards ran under its bottom fade)
ed(r"if(h!==MAPV.ch){MAPV.ch=h;el.innerHTML=h;el.classList.toggle('go',!!NAV);}",
   r"if(h!==MAPV.ch){MAPV.ch=h;el.innerHTML=h;el.classList.toggle('go',!!NAV);el.classList.remove('tipgone');clearTimeout(MAPV.tipT);if(!NAV)MAPV.tipT=setTimeout(()=>{if(!NAV&&$('mpCard'))$('mpCard').classList.add('tipgone');},4000);}   /* (run 4, stage 3: the tip fades after a moment: it sat on the map's bottom row) */")
ed(r"function ptPoseCard(i){const m=PHO.group[i];if(!m||m.kind!=='person')return;SFX.tap();toastOff();",
   r"function ptPoseCard(i){const m=PHO.group[i];if(!m||m.kind!=='person')return;SFX.tap();toastOff();ptPoseView();")
ed(r"ACT.ptposes=()=>{if(!PHO.on)return;SFX.tap();toastOff();openPanel(",
   r"""/* 📸 on an upright phone a pose card fills the bottom: the camera steps back to where the whole group fits in the frame above it (run 4, stage 3: next to the person only their chin showed above the card) */
function ptPoseView(){if(innerWidth>=innerHeight)return;const Sp=ptSpotOf(pt().o),B=Sp&&Sp.bgs.find(b=>b.id===PHO.bg);if(B)ptCamGo(B);}
ACT.ptposes=()=>{if(!PHO.on)return;SFX.tap();toastOff();ptPoseView();openPanel(""")
bad=0
for old,new,c in E:
    n=s.count(old)
    if n!=c:print('COUNT',n,'!=',c,':',old[:110]);bad+=1
if bad:sys.exit(1)
for old,new,c in E:s=s.replace(old,new)
open(P,'w',encoding='utf-8').write(s)
print('applied',len(E),'edits')
