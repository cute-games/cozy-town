"""Try the kit's tour replay of a time-bound thing: the Pet Show entry recorded on a Saturday at 16:00, replayed on a Monday at noon.
usage: python3 test_replay.py GAMEFILE OUTDIR"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR, Crawler, replay
from checks import start_from_save
S = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad'
GAME, OUT = sys.argv[1], sys.argv[2]
fresh = json.load(open(f'{S}/runs/live20/out/stages/saves.json'))['extra']['fresh']
async def main():
    os.makedirs(OUT, exist_ok=True)
    async with Run('rp', OUT) as run:
        g = await run.open(open(GAME, 'rb').read(), 'web', 'iphone-portrait', 'light', 'rp', save=dict(fresh, name='ZZTEST-T')); await start_from_save(g); await g.ev(INSTR)
        mon = await g.ev("()=>{let d=S.day;while(wdIdx(d)!==0)d++;return d;}"); await g.ev("([d])=>__setClock(d,12)", [mon]); await g.step(6)
        cr = Crawler(g, depth=0, per_label=1, budget_s=300)
        print('now', await g.ev("()=>wdName()+' '+clockStr(S.time)"))
        for rec in ({'kind': 'target', 'loc': 'city', 'tlabel': '🏆 Enter the Pet Show!', 'nth': 0, 'path': [], 'when': [5, 16.0]},
                    {'kind': 'target', 'loc': 'city', 'tlabel': '🏆 Enter the Pet Show!', 'nth': 0, 'path': []}):
            r = await replay(cr, rec); print('replay', 'with' if rec.get('when') else 'without', 'the recorded hour:', r, '| now', await g.ev("()=>wdName()+' '+clockStr(S.time)"), '| card', await g.ev("()=>UI.open?$('card').innerText.slice(0,80):'(no card)'"), '| toast', await g.ev("()=>window.__lastToast.slice(0,80)"))
            await cr.recover('city')
            await g.ev("([d])=>__setClock(d,12)", [mon]); await g.step(6)
        print('page errors:', g.errors[:3])
        await run.close(g)
asyncio.run(main())
