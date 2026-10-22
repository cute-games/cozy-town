"""The kit's N3 exactly (with its screenshots), plus a dump of friends and pets every 35 frames of the second stop."""
import asyncio, json, os, sys, time
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin, VIEW_JS, fx, pairs_min
new_wb = open('/home/user/cozy-town/index.html', 'rb').read()
FIX = [('save-prenight3-pets.json', json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json'))))]
ST = """()=>({P:[+P.x.toFixed(2),+P.z.toFixed(2),+P.yaw.toFixed(2)],moving:!!P.moving,fan:{on:FAN.on,turnT:+FAN.turnT.toFixed(2)},
  fr:FRIEND_ACTORS.filter(f=>f.mode==='follow').map(f=>({n:f.d.name,x:+f.x.toFixed(2),z:+f.z.toFixed(2),fan:f.fan&&f.fan.map(v=>+v.toFixed(2)),fol:f.fol,stk:+(f.stk||0).toFixed(2),mv:!!f.moving})),
  pets:PET_ACTORS.filter(p=>!p.d.stay).map(p=>({n:p.d.name,x:+p.x.toFixed(2),z:+p.z.toFixed(2),loc:p.loc,mv:!!p.moving,st:p.state||p.mode||null}))})"""
async def main():
    async with Run('n3k3', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/n3k3-run') as run:
        save = fx(FIX, 'save-prenight3-pets.json')
        g = await begin(run, new_wb, 'ipad-landscape', 'n3-friends', save)
        await g.ev("()=>{__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
        await g.step(10)
        for k in range(2):
            await g.page.keyboard.down('KeyW'); await g.step(50); await g.page.keyboard.up('KeyW'); await g.step(2)
            print(f'walk {k+1} end', json.dumps(await g.ev(ST)))
            for t in range(4):
                await g.step(35); print(f'  +{(t+1)*35}', json.dumps(await g.ev(ST)))
            st = await g.ev(VIEW_JS); print(f'  stop {k+1}: pairs min {pairs_min(st["fr"]):.2f}; VIEW', json.dumps(st['fr']))
            t0 = time.time(); await g.shot(f'friends-in-view-{k+1}', both=False); print(f'  shot took {time.time()-t0:.1f} s real')
            await g.ev("()=>{P.yaw+=Math.PI;}"); await g.step(110)
            print('  after turn', json.dumps(await g.ev(ST)))
            t0 = time.time(); await g.shot(f'friends-after-turn-{k+1}', both=False); print(f'  shot took {time.time()-t0:.1f} s real')
            print('  after shot', json.dumps(await g.ev(ST)))
        await run.close(g)
asyncio.run(main())
