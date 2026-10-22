"""Run N1 (night3) and N25 (photo4) against the job-15 scratch copy."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT); sys.path.insert(0,'/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad/n25probe')
from harness import Run
import photo4p as photo4
BUILD = open(sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad/j15try.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
only = sys.argv[2].split(',') if len(sys.argv) > 2 else None
async def main():
    async with Run('t15', '/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad/t15-run') as run:
        for name, fn in (("N25", photo4.n25),):
            if only and name not in only: continue
            try: ok, det = await fn(run, BUILD, FIX)
            except Exception as e:
                import traceback; traceback.print_exc(); ok, det = False, 'crashed: ' + repr(e)[:300]
            print('PASS' if ok else 'FAIL', '|', name, '|', det, flush=True)
asyncio.run(main())
