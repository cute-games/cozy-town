"""Counts before and after run 4 (wrap-up, 18 Oct): the kit's COUNTS_JS on the live file (tools/prerun4-index.html = main, night 3),
on the stage-2 end file (git 1874409) and on the finished stage-3 file; prints a markdown table of the plan's lists and every changed list, and anything lost."""
import asyncio, json, os, sys, subprocess
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run, COUNTS_JS
R = '/home/user/cozy-town'
FILES = [('live (before run 4)', open(f'{R}/tools/prerun4-index.html', 'rb').read()),
         ('end of stage 2', subprocess.check_output(['git', '-C', R, 'show', '1874409:index.html'])),
         ('after stage 3', open(f'{R}/index.html', 'rb').read())]
PLAN = ('areas','places','doors','houses','shops','furniture','furniture_for_sale','foods','clothes','costumes','hats','pet_kinds','quests','jobs','townsfolk','chat_phrases','signs','benches')
async def main():
    async with Run('cnt3', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/cnt3-run') as run:
        out = {}
        for tag, b in FILES:
            g = await run.open(b, 'web', 'pc-1366', 'light', 'counts-' + tag.split()[0]); await g.manual(); await g.wait(600)
            out[tag] = await g.ev(COUNTS_JS); await run.close(g)
        json.dump(out, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/counts3.json', 'w'), indent=0)
        tags = [t for t, _ in FILES]; A, M, B = (out[t] for t in tags)
        def n(v): return len(v) if isinstance(v, (list, dict)) else v
        keys = sorted(set(A) | set(M) | set(B))
        print(f'| list | {tags[0]} | {tags[1]} | {tags[2]} |'); print('|---|---|---|---|')
        tot = [0, 0, 0]
        for k in keys:
            v = [n(d.get(k)) for d in (A, M, B)]
            for i, x in enumerate(v): tot[i] += x if isinstance(x, int) else 0
            if len(set(map(str, v))) > 1 or k in PLAN: print(f'| {k} | ' + ' | '.join(str(x) for x in v) + ' |')
        print(f'| (all {len(keys)} lists) | ' + ' | '.join(str(x) for x in tot) + ' |')
        def lost(a, b):
            L = {}
            for k in a:
                va, vb = a.get(k), b.get(k)
                if isinstance(va, list) and isinstance(vb, list):
                    miss = [x for x in va if x not in vb]
                    if miss: L[k] = miss
            return L
        l1, l2 = lost(A, B), lost(M, B)
        print('LOST from the live game:', json.dumps(l1, ensure_ascii=False)[:900] if l1 else 'nothing')
        print('LOST in stage 3:', json.dumps(l2, ensure_ascii=False)[:900] if l2 else 'nothing')
asyncio.run(main())
