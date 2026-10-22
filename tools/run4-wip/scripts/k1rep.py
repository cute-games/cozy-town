"""K1 reproduction: approach the market door like the kit does and see what E would use, at several clock hours."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import Crawler, INSTR
import checks as C
NEW = open('/home/user/cozy-town/index.html','rb').read()
DUMP = """()=>{const t=TARGET;const d=DOORS.market.city;return {time:+S.time.toFixed(2),wx:WX.cur,P:[+P.x.toFixed(2),+P.z.toFixed(2),+P.yaw.toFixed(2)],target:t?(typeof t.label==='function'?t.label():t.label):null,targetIcon:t?(typeof t.icon==='function'?t.icon():t.icon):null,
  doorDist:+Math.hypot(P.x-d[0],P.z-d[1]).toFixed(2),grans:GRAN.g.map(q=>({on:q.on,sit:q.sitting,d:+Math.hypot(q.x-P.x,q.z-P.z).toFixed(2),r:q.target&&q.target.r,stop:GRAN_STOPS[granPose(q.i,realMs()).stop].id})),
  near:targets().filter(t=>!(t.when&&!t.when())).map(t=>{const tx=t.rect?clamp(P.x,t.rect.x1,t.rect.x2):t.x,tz=t.rect?clamp(P.z,t.rect.z1,t.rect.z2):t.z;return [typeof t.label==='function'?t.label():t.label,+Math.hypot(tx-P.x,tz-P.z).toFixed(2),t.r];}).filter(x=>x[1]<x[2]+.5).sort((a,b)=>a[1]-b[1]).slice(0,6)};}"""
async def main():
    async with Run('k1', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/k1-run') as run:
        sv = C.fresh_save() if hasattr(C,'fresh_save') else json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
        for hour in (10, 13, 16):
            g = await run.open(NEW, 'web', 'pc-1920', 'light', f'k1-{hour}', save=dict(sv, name='ZZTEST-PC')); await C.start_from_save(g); await g.ev(INSTR)
            await g.ev("(h)=>{__setClock(null,h);wxForce('sun');}", hour); await g.step(4)
            cr = Crawler(g, depth=0, per_label=1, budget_s=120); ts = await cr.targets()
            door = next((x for x in ts if x['when'] and 'market' in x['label'].lower()), None)
            ap = await cr.approach(door['i']) if door else 'no door'
            st = await g.ev(DUMP); print(hour, 'approach', ap, json.dumps(st))
            await g.key('KeyE'); await cr.settle(6, 800); print('   after E: loc', await g.ev("()=>CUR.id"), 'errors', g.errors[:2])
            await run.close(g)
asyncio.run(main())
