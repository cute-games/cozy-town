"""Run the new N33/N34 tests against the job-10 scratch copy."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import house4
BUILD = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j10try.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prerun4-lv10.json','save-prenight3-pets.json','save-prenight3-bighouse.json','save-prenight3-upstairs.json')]
async def main():
    async with Run('h4', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/h4-run') as run:
        for name, fn in (('N34', house4.n34),):
            try: ok, det = await fn(run, BUILD, FIX)
            except Exception as e:
                import traceback; traceback.print_exc(); ok, det = False, 'crashed: ' + repr(e)[:300]
            print('PASS' if ok else 'FAIL', '|', name, '|', det, flush=True)
asyncio.run(main())
