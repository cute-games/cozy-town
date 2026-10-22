"""Job 12 pictures: the Pet Shop downstairs (shelves and the clothes rack) and upstairs (the areas)."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
from house4 import climb
BUILD = open('/home/user/cozy-town/index.html', 'rb').read()
save = dict(json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json'))), name='Cozy Kid')
HIDE = "const st=document.createElement('style');st.textContent='#toast,#busTip,#note,#tut,#dtut{display:none!important}';document.head.appendChild(st);"
async def main():
    async with Run('j12p', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j12p-run') as run:
        g = await begin(run, BUILD, 'ipad-landscape', 'j12-pics', save)
        await g.ev("()=>{" + HIDE + "__goto('pets');__setClock(null,11);wxForce('sun');const L=LOC.pets;P.x=L.ox-1.2;P.z=L.oz+3.4;P.yaw=.18;P.pitch=.0;}"); await g.step(8); await g.shot('petshop-downstairs', both=False)
        await g.ev("()=>{const L=LOC.pets;P.x=L.ox+2.0;P.z=L.oz-1.2;P.yaw=-Math.PI/2+.5;P.pitch=.05;}"); await g.step(6); await g.shot('petshop-clothes-rack', both=False)
        await climb(g, 1)
        await g.ev("()=>{const L=LOC.pets;P.x=L.ox-3.2;P.z=L.oz+UPZ+.2;P.yaw=-Math.PI/2-.35;P.pitch=-.08;}"); await g.step(8); await g.shot('petshop-upstairs', both=False)
        await g.ev("()=>{const L=LOC.pets;P.x=L.ox+2.6;P.z=L.oz+UPZ+.4;P.yaw=Math.PI/2+.6;P.pitch=-.1;}"); await g.step(6); await g.shot('petshop-upstairs-ducks-owl', both=False)
        print(run.shots, g.errors[:2]); await run.close(g)
asyncio.run(main())
