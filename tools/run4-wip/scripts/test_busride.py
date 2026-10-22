"""Try the kit's new C2b bus ride (cozy_check2.ride_bus, copied here because cozy_check2 parses its arguments on import) on a game file.
usage: python3 test_busride.py GAMEFILE OUTDIR"""
import asyncio, json, os, re, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR, Crawler
from checks import start_from_save
S = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad'
src = open(f'{KIT}/cozy_check2.py', encoding='utf-8').read()
code = src[src.index('async def ride_bus('):src.index('def main_recipes(')]
exec(code)   # defines ride_bus(run, g, cr), exactly as in the kit
GAME, OUT = sys.argv[1], sys.argv[2]
fresh = json.load(open(f'{S}/runs/live20/out/stages/saves.json'))['extra']['fresh']
async def main():
    os.makedirs(OUT, exist_ok=True)
    async with Run('bus', OUT) as run:
        g = await run.open(open(GAME, 'rb').read(), 'web', 'ipad-landscape', 'light', 'bus', save=dict(fresh, name='ZZTEST-TOWN')); await start_from_save(g); await g.ev(INSTR)
        cr = Crawler(g, depth=2, per_label=1, budget_s=600, recurse=False)
        r = await ride_bus(run, g, cr)
        print('ride_bus:', r)
        print('areas', cr.res['areas'], 'tested', len(cr.res['tested']), 'views', cr.res['views'])
        for k in ('dead', 'unreachable', 'stuck', 'covered', 'skipped'):
            if cr.res.get(k): print(k, cr.res[k][:8])
        print('recipes kept out of the tours:', len(cr.recipes) == 0, 'page errors:', g.errors[:3])
        await run.close(g)
asyncio.run(main())
