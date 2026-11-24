import asyncio, json, sys, os, time
KIT='/home/claude/w/kit/cozycheck'; sys.path.insert(0,KIT)
from harness import Run
async def main():
  out={}
  async with Run('pf-load','/home/claude/w/pfs/run-load') as run:
    for rep in range(int(os.environ.get('REP','3'))):
      for tag in sys.argv[1:]:
        f=f'/home/claude/w/pf/pf-lt-{tag}.html'
        t0=time.time(); g=await run.open(open(f,'rb').read(),'web','ipad-landscape','light','load-'+tag); wall=time.time()-t0
        r=await g.ev("()=>({nav:performance.getEntriesByType('navigation')[0].domInteractive,boot0:__LT0,ready:__LT1,parts:__LT})")
        await run.close(g)
        d=out.setdefault(tag,[]);d.append(dict(wall=round(wall,2),scriptStart=round(r['boot0']),bootMs=round(r['ready']-r['boot0']),readyMs=round(r['ready']),top=sorted(r['parts'],key=lambda x:-x[1])[:8]))
        print(tag,d[-1],flush=True)
  json.dump(out,open('/home/claude/w/pfs/load.json','w'),indent=1)
asyncio.run(main())
