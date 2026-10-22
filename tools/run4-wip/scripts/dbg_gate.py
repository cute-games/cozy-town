import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
NEW=open('/home/user/cozy-town/index.html','rb').read()
save=json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
async def main():
    async with Run('gate','/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dbg-gate') as run:
        g=await run.open(NEW,'web','ipad-landscape','light','g',save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.step(3)
        print(await g.ev("()=>{const L=LOC.city;const near=L.cols.filter(c=>c.cr!==undefined&&Math.hypot(c.cx+17,c.cz+3.5)<5).map(c=>[+c.cx.toFixed(1),+c.cz.toFixed(1),+c.cr.toFixed(2)]);const rects=L.cols.filter(c=>c.x1!==undefined&&c.x1<-13&&c.x2>-21&&c.z1<0&&c.z2>-8).map(c=>[c.x1,c.z1,c.x2,c.z2].map(v=>+v.toFixed(1)));return {near,rects:rects.slice(0,8),gate:[FC.gx,FC.z,FC.gw]};}"))
        await run.close(g)
asyncio.run(main())
