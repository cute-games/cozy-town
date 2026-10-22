"""run the kit's N3 (friends in view, pets apart) alone on a build: python3 n3only.py BUILD.html OUTDIR"""
import asyncio, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3, run4, glob, json
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
B, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
async def main():
    async with Run('n3only', OUT) as run:
        ok, msg = await run4.n23(run, None, open(B, "rb").read(), FIX)
        print('PASS' if ok else 'FAIL', msg)
asyncio.run(main())
