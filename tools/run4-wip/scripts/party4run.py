"""Run N39 (party4) against the job-17 scratch copy, with the old live file as the old version."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import party4
BUILD = open(sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j17try.html','rb').read()
LIVE = open('/home/user/cozy-town/tools/prerun4-index.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
async def main():
    async with Run('t17', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/t17-run') as run:
        try: ok, det = await party4.n39(run, LIVE, BUILD, FIX)
        except Exception as e:
            import traceback; traceback.print_exc(); ok, det = False, 'crashed: ' + repr(e)[:300]
        print('PASS' if ok else 'FAIL', '|', 'N39', '|', det, flush=True)
asyncio.run(main())
