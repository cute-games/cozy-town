"""Job 13 pictures: the catalog with the new pieces, and a room furnished with some of them."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
BUILD = open('/home/user/cozy-town/index.html', 'rb').read()
save = dict(json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json'))), name='Cozy Kid', coins=5000)
HIDE = "const st=document.createElement('style');st.textContent='#toast,#busTip,#note,#tut,#dtut{display:none!important}';document.head.appendChild(st);"
ROOM = [['cornersofa','#b79cff',-2.6,-2.2,0],['coffeetable','#c98f5e',-1.6,-.4,0],['floorlamp','#ffd45c',-4.6,-3.6,0],['palm',None,4.4,-3.8,0],['rugstar','#b79cff',-1.4,0,0],['cubeshelf','#ffffff',1.8,-4.4,0],['canopybed','#ff9ec4',3.8,2.2,1],['nightstand','#ffffff',4.9,.6,0],['eggchair','#f6e2c8',-4.2,2.6,0],['playtent','#7cc8ff',1.2,3.0,0],['poster','#ffd45c',-1.0,-4.6,0],['wallclock','#ffffff',0.6,-4.6,0],['discoball',None,-4.6,-.6,0]]
async def main():
    async with Run('j13p', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j13p-run') as run:
        g = await begin(run, BUILD, 'ipad-landscape', 'j13-pics', save)
        await g.ev("()=>{" + HIDE + "__goto('home');__setClock(null,11);openCatalog('buy');}"); await g.step(6)
        await g.ev("()=>{const el=document.querySelector('#card .grid');if(el)el.scrollIntoView();const c=$('card');c.scrollTop=c.scrollHeight*.45;}"); await g.step(3); await g.shot('new-furniture-catalog', both=False)
        await g.ev("(R)=>{closePanel();S.home.items=S.home.items.filter(i=>!String(i.u).startsWith('zzp'));for(const [t,c,x,z,r] of R){S.home.items.push({t,c,x,z,r,u:'zzp'+t});}rebuildHome();P.x=LOC.home.ox+1.2;P.z=LOC.home.oz+3.9;P.yaw=Math.PI*.9;P.pitch=.0;}", ROOM); await g.step(8); await g.shot('new-furniture-room', both=False)
        await g.ev("()=>{P.x=LOC.home.ox-5.0;P.z=LOC.home.oz+1.6;P.yaw=-Math.PI*.62;P.pitch=.02;}"); await g.step(6); await g.shot('new-furniture-room-2', both=False)
        print(run.shots, g.errors[:2]); await run.close(g)
asyncio.run(main())
