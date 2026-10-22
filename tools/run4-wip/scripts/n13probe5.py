import asyncio, os, sys, json, glob, time
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
B, OUT, PROF = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(OUT, exist_ok=True)
async def main():
    async with Run('n13probe5', OUT) as run:
        sv = dict(night3.fx(FIX, 'save-prenight3-pets.json')); sv['job'] = None; sv['coins'] = 300
        g = await night3.begin(run, open(B, "rb").read(), PROF, 'n13p5', sv)
        await g.ev("()=>{__goto('city');__setClock(null,11);openPhone('msg','ro');}"); await g.step(3); await g.wait(250)
        for i in range(3):
            t0 = time.time(); await g.settle(); t1 = time.time(); await g.ev("()=>1"); t2 = time.time(); await g.center('#card [data-a="rjob"]', True); t3 = time.time()
            print('settle', round(t1-t0, 3), 'ev', round(t2-t1, 3), 'center', round(t3-t2, 3), flush=True)
        t0 = time.time(); r = await g.tap('#card [data-a="rjob"]'); print('tap', r, round(time.time()-t0, 3))
        await g.step(3); await g.wait(300)
        t0 = time.time(); r = await g.tap('#card [data-a="job:hair"]'); print('tap2', r, round(time.time()-t0, 3))
        await run.close(g)
asyncio.run(main())
