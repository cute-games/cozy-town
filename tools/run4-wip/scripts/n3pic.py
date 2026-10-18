"""A clean picture of the four friends in front of you after the second stop (toasts hidden, sunny)."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin, fx
new_wb = open('/home/user/cozy-town/index.html', 'rb').read()
FIX = [('save-prenight3-pets.json', json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json'))))]
async def main():
    async with Run('n3pic', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/n3pic-run') as run:
        save = fx(FIX, 'save-prenight3-pets.json'); save = dict(save, name='Cozy Kid')
        g = await begin(run, new_wb, 'ipad-landscape', 'n3-pic', save)
        await g.ev("()=>{const st=document.createElement('style');st.textContent='#toast,#busTip,#note,#tut,#dtut{display:none!important}';document.head.appendChild(st);__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);wxForce('sun');for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
        await g.step(10)
        for k in range(2):
            await g.page.keyboard.down('KeyW'); await g.step(50); await g.page.keyboard.up('KeyW'); await g.step(142)
            if k == 0: await g.ev("()=>{P.yaw+=Math.PI;}"); await g.step(110)
        await g.ev("()=>{P.pitch=.04;}"); await g.step(4)
        await g.shot('friends-in-front', both=False); print(run.shots); await run.close(g)
asyncio.run(main())
