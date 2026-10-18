import asyncio, os, sys, json, glob
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
B, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
LOG = "()=>({P:[+P.x.toFixed(2),+P.z.toFixed(2),+P.yaw.toFixed(2)],fan:FAN.on,fr:FRIEND_ACTORS.filter(f=>f.mode==='follow').map(f=>[f.d.name,+f.x.toFixed(2),+f.z.toFixed(2),f.fan?f.fan.map(v=>+v.toFixed(2)):null,f.fanSide||0,+(f.fanStk||0).toFixed(2)])})"
async def main():
    async with Run('n3diag2', OUT) as run:
        save = night3.fx(FIX, 'save-prenight3-pets.json')
        g = await night3.begin(run, open(B, "rb").read(), 'ipad-landscape', 'n3d', save)
        await g.ev("()=>{__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
        await g.step(10)
        for k in range(2):
            await g.page.keyboard.down('KeyW'); await g.step(50); await g.page.keyboard.up('KeyW'); await g.step(2); await g.step(140)
            print('stop', k+1, json.dumps(await g.ev(LOG)))
            await g.ev("()=>{P.yaw+=Math.PI;}")
            for t in range(11):
                await g.step(10)
                if k == 1: print('  t', (t+1)*10, json.dumps(await g.ev(LOG))[:700])
        await run.close(g)
asyncio.run(main())
