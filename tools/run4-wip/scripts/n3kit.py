"""Run the kit's own N3 (night3.n3) exactly as the stage does, outside the stage, to see the friends' spacing."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3
new_wb = open('/home/user/cozy-town/index.html', 'rb').read()
FIX = [('save-prenight3-pets.json', json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json'))))]
async def main():
    async with Run('n3k', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/n3k-run') as run:
        ok, det = await night3.n3(run, new_wb, FIX); print('PASS' if ok else 'FAIL', det)
asyncio.run(main())
