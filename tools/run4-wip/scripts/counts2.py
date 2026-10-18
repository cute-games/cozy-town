"""Counts before and after stage 2: the kit's COUNTS_JS on the stage-1 end file (git a097543) and on the file now; prints a markdown table of the plan's list and every changed list."""
import asyncio, json, os, sys, subprocess
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run, COUNTS_JS
OLD = subprocess.check_output(['git','-C','/home/user/cozy-town','show','a097543:index.html'])
NEW = open('/home/user/cozy-town/index.html','rb').read()
async def main():
    async with Run('cnt2', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/cnt2-run') as run:
        out = {}
        for tag, b in (('before', OLD), ('after', NEW)):
            g = await run.open(b, 'web', 'pc-1366', 'light', 'counts-' + tag); await g.manual(); await g.wait(600)
            out[tag] = await g.ev(COUNTS_JS); await run.close(g)
        json.dump(out, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/counts2.json','w'), indent=0)
        a, b = out['before'], out['after']
        def n(v): return len(v) if isinstance(v, (list, dict)) else v
        keys = sorted(set(a) | set(b))
        rows = []
        for k in keys:
            na, nb = n(a.get(k)), n(b.get(k))
            if na != nb or k in ('areas','houses','shops','furniture','foods','clothes','costumes','hats','pet_kinds','quests','jobs','townsfolk','chat_phrases','signs','benches','places','doors'): rows.append((k, na, nb))
        print('| list | before stage 2 | after stage 2 |'); print('|---|---|---|')
        for k, na, nb in rows: print(f'| {k} | {na} | {nb}{" (+"+str(nb-na)+")" if isinstance(na,int) and isinstance(nb,int) and nb>na else ""} |')
        # anything lost?
        lost = {}
        for k in keys:
            va, vb = a.get(k), b.get(k)
            if isinstance(va, list) and isinstance(vb, list):
                miss = [x for x in va if x not in vb]
                if miss: lost[k] = miss
        print('LOST:', json.dumps(lost)[:600] if lost else 'nothing')
asyncio.run(main())
