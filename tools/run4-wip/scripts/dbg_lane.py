import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW=open('/home/user/cozy-town/index.html','rb').read()
save=json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
JS="""()=>{S.bighouse=true;S.home.xf=4;S.home.col='#b79cff';applyHouse();__goto('city');laneRefresh(true);__run(3);const j=LANE.mine,d=LOC.city.lane[j].door,o=LANE.own[j];return {mine:j,door:d,own:o&&{k:o.k,nm:o.nm,fl:o.fl,col:o.col},me:laneMe(),plots:LOC.city.lane.map((p,i)=>[i,LANE.own[i]?LANE.own[i].nm:null,+p.door[0].toFixed(1),+p.door[1].toFixed(1),+p.door[2].toFixed(2)])};}"""
async def main():
    async with Run('lane','/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dbg-lane') as run:
        fb=fake_date_build(NEW,'2026-10-20T12:00:00'); g=await run.open(fb,'web','ipad-landscape','light','l',save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.step(4)
        r=await g.ev(JS); print(json.dumps(r)[:900])
        for dist,yaw in ((9,'d[2]'),(9,'d[2]+Math.PI')):
            await g.ev("(a)=>{const d=LOC.city.lane[LANE.mine].door;P.x=d[0]+Math.sin(d[2]+Math.PI)*a[0];P.z=d[1]+Math.cos(d[2]+Math.PI)*a[0];P.yaw=eval(a[1]);P.pitch=.2;}",[dist,yaw]); await g.step(6); await g.wait(300); print(await g.shot(f'lane-{dist}-{yaw.replace("+","p").replace(".","")}',both=False))
        await run.close(g)
asyncio.run(main())
