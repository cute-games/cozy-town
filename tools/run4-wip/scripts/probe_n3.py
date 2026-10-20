"""Run 4 finish: the friends after a turn (kit N3's walk-stop-turn), watched step by step: where each friend is, its spot, moving or not, and
pictures at 2, 3.5, 5.5 and 8 s after the turn. usage: python3 probe_n3.py OUTDIR"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin, VIEW_JS
NEW = open(os.environ.get('GAME', '/home/user/cozy-town/index.html'), 'rb').read(); FIX = os.path.join(KIT, 'fixtures')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
async def main():
    async with Run('pn3', OUT) as run:
        g = await begin(run, NEW, 'ipad-landscape', 'pn3', json.load(open(os.path.join(FIX, 'save-prenight3-pets.json'))))
        await g.ev("()=>{__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
        await g.step(10)
        for k in range(2):
            await g.page.keyboard.down('KeyW'); await g.step(50); await g.page.keyboard.up('KeyW'); await g.step(2); await g.step(140)
            st = await g.ev(VIEW_JS); print('stop', k + 1, [(f['n'], f['d'], f['fwd'], f['ndc']) for f in st['fr']])
            await g.ev("()=>{P.yaw+=Math.PI;}")
            t = 0
            for upto in (40, 70, 110, 160):
                await g.step(upto - t); t = upto
                st = await g.ev(VIEW_JS)
                print(f' turn {k + 1} +{t * .05:.1f}s fan {st["fanOn"]}:', [(f['n'], 'd', f['d'], 'fwd', f['fwd'], 'mv' if f['moving'] else 'st', 'ndc', f['ndc'], 'spot', f['fan']) for f in st['fr']], flush=True)
                await g.shot(f'turn{k + 1}-{t * 5}', both=False)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
