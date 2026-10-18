import asyncio, os, sys, json, glob
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
B, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
NEAR = """()=>{const C=camera.position,out=[];const d=o=>+Math.hypot(o.x-C.x,o.z-C.z).toFixed(2);
  for(const w of WALKERS)if(w.g.visible&&d(w)<2.5)out.push(['walker',d(w),w.state,w.moving,+w.x.toFixed(2),+w.z.toFixed(2)]);
  for(const f of FRIEND_ACTORS)if(d(f)<2.5)out.push(['friend '+f.d.name,d(f),f.mode,f.g.visible,f.fan?1:0]);
  for(const p of PET_ACTORS)if(d(p)<2.5)out.push(['pet',d(p),p.g.visible]);
  const t=TARGET;return {C:[+C.x.toFixed(2),+C.z.toFixed(2)],near:out,target:t?(typeof t.label==='function'?t.label():t.label):null,fan:FAN.on};}"""
async def main():
    async with Run('n3diag5', OUT) as run:
        save = night3.fx(FIX, 'save-prenight3-pets.json')
        g = await night3.begin(run, open(B, "rb").read(), 'ipad-landscape', 'n3d', save)
        await g.ev("()=>{__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
        await g.step(10)
        for k in range(2):
            await g.page.keyboard.down('KeyW'); await g.step(50); await g.page.keyboard.up('KeyW'); await g.step(2); await g.step(140)
            print('stop', k+1, json.dumps(await g.ev(NEAR)))
            await g.ev("()=>{P.yaw+=Math.PI;}"); await g.step(110)
            print('turn', k+1, json.dumps(await g.ev(NEAR)))
        await run.close(g)
asyncio.run(main())
