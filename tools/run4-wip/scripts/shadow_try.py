"""Job 6 (item 17, the white smear): the apartment block's wall by the corner tree with different shadow settings; one picture each."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
async def main():
    async with Run('shd', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/shd-run') as run:
        g = await run.open(NEW, 'web', 'ipad-landscape', 'light', 'shd', save=save); await start_from_save(g); await g.ev(INSTR)
        await g.ev("()=>{__goto('city');__setClock(null,12);P.x=41.5;P.z=-29.6;P.yaw=Math.atan2(-(34.9-P.x),-(-30.2-P.z));P.pitch=.25;}"); await g.step(4)
        for nb, b in ((.09, -.0006), (.18, -.0006), (.3, -.0006), (.09, -.002), (.18, -.0015)):
            await g.ev("([nb,b])=>{sun.shadow.normalBias=nb;sun.shadow.bias=b;}", [nb, b]); await g.step(3); await g.shot('nb%s_b%s' % (nb, b), both=False)
        await g.ev("()=>{sun.shadow.normalBias=.09;sun.shadow.bias=-.0006;__setClock(null,9);}"); await g.step(4); await g.shot('nb.09_9h', both=False)
        await g.ev("()=>{sun.shadow.normalBias=.18;}"); await g.step(3); await g.shot('nb.18_9h', both=False)
        print('shots', run.shots, 'errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
