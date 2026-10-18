"""the kit's own tap after a forced frame sneaks in: python3 n13probe3.py BUILD.html OUTDIR PROF"""
import asyncio, os, sys, json, glob
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
B, OUT, PROF = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(OUT, exist_ok=True)
async def main():
    async with Run('n13probe3', OUT) as run:
        for k in range(2):
            sv = dict(night3.fx(FIX, 'save-prenight3-pets.json')); sv['job'] = None; sv['coins'] = 300
            g = await night3.begin(run, open(B, "rb").read(), PROF, 'n13p3-%d' % k, sv)
            await g.ev("()=>{__goto('city');__setClock(null,11);openPhone('msg','ro');}"); await g.step(3); await g.wait(250)
            orig = g.center
            async def center(sel, scroll=True):      # a frame sneaks in right after the measure, as under load
                c = await orig(sel, scroll); await g.page.screenshot(path=os.path.join(OUT, 'mid.png')); return c
            if k == 1: g.center = center
            import time; t0 = time.time()
            t1 = await g.tap('#card [data-a="rjob"]'); dt = time.time() - t0; await g.step(3); await g.wait(300)
            t2 = await g.tap('#card [data-a="job:hair"]'); await g.step(3); await g.wait(300)
            print(k, t1, t2, round(dt, 2), await g.ev("()=>({jobs:!!PH.jobs,job:S.job})"), flush=True)
            await run.close(g)
asyncio.run(main())
