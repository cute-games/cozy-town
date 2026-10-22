import asyncio, json, os, sys, glob
KIT='/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT); sys.path.insert(0,'/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad/n8probe')
from harness import Run
import night3p as night3
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
async def main():
    async with Run('n8p', '/tmp/claude-0/-home-user-cozy-town/c7fb71e2-c81b-5a34-ae06-7b8688b27515/scratchpad/n8probe/out') as run:
        ok, det = await night3.n8(run, open(sys.argv[1],'rb').read(), FIX)
        print('PASS' if ok else 'FAIL', det[:200])
asyncio.run(main())
