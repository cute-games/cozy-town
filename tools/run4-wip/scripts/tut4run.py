"""Run N1 (night3) and N20-N22 (hol4) against the job-11 scratch copy."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import tut4
BUILD = open(sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j14try.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
only = sys.argv[2].split(',') if len(sys.argv) > 2 else None
async def main():
    async with Run('t14', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/t14-run') as run:
        for name, fn in (('N38', tut4.n38),):
            if only and name not in only: continue
            try: ok, det = await fn(run, BUILD, FIX)
            except Exception as e:
                import traceback; traceback.print_exc(); ok, det = False, 'crashed: ' + repr(e)[:300]
            print('PASS' if ok else 'FAIL', '|', name, '|', det, flush=True)
asyncio.run(main())
