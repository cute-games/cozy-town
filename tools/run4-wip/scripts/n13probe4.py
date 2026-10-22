import asyncio, os, sys, json, glob
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
B, OUT, PROF = sys.argv[1], sys.argv[2], sys.argv[3]; os.makedirs(OUT, exist_ok=True)
Q = """(sel)=>{const el=document.querySelector(sel);const out=[];for(let a=el;a;a=a.parentElement)for(const x of a.getAnimations())out.push([a.id||a.className||a.tagName,x.constructor.name,x.animationName||x.transitionProperty,x.playState,Math.round(x.currentTime||0),x.effect.getComputedTiming().endTime]);return out;}"""
async def main():
    async with Run('n13probe4', OUT) as run:
        sv = dict(night3.fx(FIX, 'save-prenight3-pets.json')); sv['job'] = None; sv['coins'] = 300
        g = await night3.begin(run, open(B, "rb").read(), PROF, 'n13p4', sv)
        await g.ev("()=>{__goto('city');__setClock(null,11);openPhone('msg','ro');}"); await g.step(3); await g.wait(250)
        for i in range(4):
            print(i, await g.ev(Q, '#card [data-a="rjob"]'), flush=True)
            await asyncio.sleep(0.3); await g.settle()
        await run.close(g)
asyncio.run(main())
