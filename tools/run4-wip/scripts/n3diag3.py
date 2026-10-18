import asyncio, os, sys, json, glob
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
B, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
LOG = "()=>({P:[+P.x.toFixed(2),+P.z.toFixed(2)],fr:FRIEND_ACTORS.filter(f=>f.mode==='follow').map(f=>[f.d.name[0],+f.x.toFixed(2),+f.z.toFixed(2),f.fan?f.fan.map(v=>+v.toFixed(1)):null,f.fanSide||0]),pets:PET_ACTORS.map(p=>[+p.x.toFixed(2),+p.z.toFixed(2)])})"
async def main():
    async with Run('n3diag3', OUT) as run:
        save = night3.fx(FIX, 'save-prenight3-pets.json')
        g = await night3.begin(run, open(B, "rb").read(), 'ipad-landscape', 'n3d', save)
        await g.ev("()=>{__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
        await g.step(10)
        await g.page.keyboard.down('KeyW'); await g.step(50); await g.page.keyboard.up('KeyW'); await g.step(2)
        for t in range(14):
            print('  t', t*10, json.dumps(await g.ev(LOG))[:600]); await g.step(10)
        await run.close(g)
asyncio.run(main())
