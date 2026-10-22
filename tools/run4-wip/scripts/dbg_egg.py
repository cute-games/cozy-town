import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
save=json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
async def main():
    async with Run('egg', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dbg-egg') as run:
        for label, path in (('before', 'scratchpad/s2head.html'), ('after', '/home/user/cozy-town/index.html')):
            b = open(path if path.startswith('/') else '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/' + path, 'rb').read()
            fb = fake_date_build(b, '2026-04-10T12:00:00')
            sv = json.loads(json.dumps(save)); sv['egg'] = {'y': 2026, 'f': [0, 1, 2]}   # this player already found three eggs
            g = await run.open(fb, 'web', 'ipad-landscape', 'light', label, save=sv); await start_from_save(g); await g.ev(INSTR); await g.step(6)
            st = await g.ev("()=>({cur:HOL.cur,bunny:LOC.city.inter.some(t=>t.hol&&t.icon==='🐰'),eggInters:LOC.city.inter.filter(t=>t.hol&&t.icon==='🥚').length,eggsDrawn:HOL.eggN,found:S.egg&&S.egg.f.length})")
            print(label, st, 'errors:', [e[:90] for e in g.errors[:3]], flush=True)
            await g.ev("()=>{__goto('city');const t=LOC.city.inter.find(t=>t.hol&&t.icon==='🐰');if(t){P.x=t.x+1.5;P.z=t.z+4;P.yaw=Math.atan2(-(t.x-P.x),-(t.z-P.z));P.pitch=.08;}else{P.x=-17;P.z=-5.5;P.yaw=Math.atan2(-(-19.6-P.x),-(-12.6-P.z));P.pitch=.05;}}"); await g.step(8); await g.wait(600); await g.step(4)
            print(await g.shot(f'easter-boot-{label}', both=False))
            await run.close(g)
asyncio.run(main())
