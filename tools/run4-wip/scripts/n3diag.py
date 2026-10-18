"""N3 diagnosis: replay the friends-follow walk and dump where each friend is, its fan spot, and what blocks it."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import VIEW_JS
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
DUMP = """()=>{const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),out={P:[+P.x.toFixed(2),+P.z.toFixed(2),+P.yaw.toFixed(2)],fan:{on:FAN.on,yaw:+FAN.yaw.toFixed(2)},fr:[]};
  for(const f of FRIEND_ACTORS){if(f.mode!=='follow')continue;const dx=f.x-P.x,dz=f.z-P.z,d=Math.hypot(dx,dz);
    let blocked=null;if(f.fan){const gx=f.fan[0],gz=f.fan[1];const n=20;for(let i=1;i<=n;i++){const x=f.x+(gx-f.x)*i/n,z=f.z+(gz-f.z)*i/n;const q=collideXZ(x,z,.3,CUR);if(Math.hypot(q[0]-x,q[1]-z)>.05){blocked=[+x.toFixed(2),+z.toFixed(2)];break;}}}
    out.fr.push({n:f.d.name,x:+f.x.toFixed(2),z:+f.z.toFixed(2),d:+d.toFixed(2),fwd:+((dx*fx+dz*fz)/(d||1)).toFixed(2),fan:f.fan&&f.fan.map(v=>+v.toFixed(2)),moving:!!f.moving,blocked,loc:f.loc});}
  return out;}"""
async def main():
    async with Run('n3d', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/n3d-run') as run:
        g = await run.open(NEW, 'web', 'ipad-landscape', 'light', 'n3d', save=save); await start_from_save(g); await g.ev(INSTR)
        await g.ev("()=>{__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
        await g.step(10)
        for k in range(2):
            await g.page.keyboard.down('KeyW'); await g.step(50); await g.page.keyboard.up('KeyW'); await g.step(2)
            pass
            for t in range(4):
                await g.step(35)
            st = await g.ev(VIEW_JS); print(f"stop {k+1}", json.dumps(await g.ev(DUMP))); print("  VIEW", json.dumps(st["fr"]), "pets", json.dumps(st["pets"]))
            await g.shot(f'diag-stop-{k+1}', both=False)
            await g.ev("()=>{P.yaw+=Math.PI;}"); await g.step(110); print('  after turn', json.dumps(await g.ev(DUMP)))
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
