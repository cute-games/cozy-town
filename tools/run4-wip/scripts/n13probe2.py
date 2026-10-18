"""force a frame between measuring the button and tapping: python3 n13probe2.py BUILD.html OUTDIR PROF"""
import asyncio, os, sys, json, glob
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
B, OUT, PROF = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(OUT, exist_ok=True)
async def main():
    async with Run('n13probe2', OUT) as run:
        sv = dict(night3.fx(FIX, 'save-prenight3-pets.json')); sv['job'] = None; sv['coins'] = 300
        g = await night3.begin(run, open(B, "rb").read(), PROF, 'n13p2', sv)
        await g.ev("()=>{__goto('city');__setClock(null,11);openPhone('msg','ro');}"); await g.step(3); await g.wait(250)
        c = await g.center('#card [data-a="rjob"]', True)
        await g.page.screenshot(path=os.path.join(OUT, 'mid.png'))
        c2 = await g.center('#card [data-a="rjob"]', False)
        await g.tap_xy(c['x'], c['y']); await g.step(3); await g.wait(300)
        post = await g.ev("()=>({jobs:!!PH.jobs,ph:document.querySelector('#card .phone').getBoundingClientRect().top})")
        print('before', c, 'after a frame', c2, post, flush=True)
        await run.close(g)
asyncio.run(main())
