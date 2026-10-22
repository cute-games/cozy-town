"""Job 4 smoke test: the Flower Corner gate is open in October (you can walk in, the inside objects are solid) and closed in November (the fence line blocks)."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
JS = """(iso)=>{realDate=()=>new Date(iso);holCheck();__run(3);__goto('city');const L=LOC.city,out={hol:HOL.cur,open:fcOpen()};
  const walk=(x0,z0,x1,z1)=>{let x=x0,z=z0;for(let i=0;i<120;i++){const dx=x1-x,dz=z1-z,d=Math.hypot(dx,dz);if(d<.05)break;const s=Math.min(.12,d);[x,z]=collideXZ(x+dx/d*s,z+dz/d*s,.3,L);}return [+x.toFixed(2),+z.toFixed(2)];};
  out.throughGate=walk(-17,-5.5,-17,-9.5);out.throughFence=walk(-20,-5.5,-20,-9.5);out.intoTree=walk(-20.2,-16.5,-20.2,-18.6);out.intoBench=walk(-17.4,-13.5,-17.4,-15.6);out.intoFountain=walk(-13.4,-14.4,-13.4,-16.4);out.intoHedge=walk(-21,-12,-24,-12);
  out.cols=L.cols.length;return out;}"""
async def main():
    async with Run('gate', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/gate-run') as run:
        g = await run.open(NEW, 'web', 'ipad-landscape', 'light', 'gate', save=save); await start_from_save(g); await g.ev(INSTR)
        for iso in ('2026-10-20T12:00:00', '2026-11-20T12:00:00'):
            r = await g.ev(JS, iso); print(iso[:10], json.dumps(r))
        await g.ev("(iso)=>{realDate=()=>new Date(iso);holCheck();__run(3);__goto('city');P.x=-17;P.z=-4.6;P.yaw=0;P.pitch=-.05;}", '2026-10-20T12:00:00'); await g.step(6); await g.shot('corner-gate-open', both=False)
        await g.ev("()=>{P.x=-17;P.z=-9.5;P.yaw=0;P.pitch=-.05;}"); await g.step(4); await g.shot('corner-inside', both=False)
        await g.ev("(iso)=>{realDate=()=>new Date(iso);holCheck();__run(3);P.x=-17;P.z=-4.6;P.yaw=0;}", '2026-11-20T12:00:00'); await g.step(6); await g.shot('corner-gate-closed', both=False)
        print('shots in', run.shots, 'errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
