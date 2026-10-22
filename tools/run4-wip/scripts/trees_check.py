"""Job 6 (item 17): which tree crowns reach into a building? A temporary copy of the game records every town tree (tree() / pine()) and the page compares
the crown with the building colliders (shrunk by their 0.4 m walking margin). Also takes a picture of the worst spot."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
src = open('/home/user/cozy-town/index.html', encoding='utf-8').read()
src = src.replace("function tree(g,x,z,s=1){const c=pick(TREE_COLS);", "window.TREEXZ=window.TREEXZ||[];function tree(g,x,z,s=1){TREEXZ.push([x,z,s,'tree']);const c=pick(TREE_COLS);", 1)
src = src.replace("function pine(g,x,z,s=1){cyl(g,.14*s,.18*s,.8*s,'#9b6b4a',x,0,z,{seg:8});", "function pine(g,x,z,s=1){TREEXZ.push([x,z,s,'pine']);cyl(g,.14*s,.18*s,.8*s,'#9b6b4a',x,0,z,{seg:8});", 1)
assert 'TREEXZ.push' in src
TMP = src.encode()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
JS = """()=>{const C=LOC.city,rects=C.cols.filter(c=>c.cr===undefined&&(c.x2-c.x1)>3&&(c.z2-c.z1)>3).map(r=>({x1:r.x1+.1,z1:r.z1+.1,x2:r.x2-.1,z2:r.z2-.1}));
  const out=[];for(const [x,z,s,k] of TREEXZ){const R=(k==='pine'?1.2:1.45)*s;for(const r of rects){const dx=Math.max(r.x1-x,0,x-r.x2),dz=Math.max(r.z1-z,0,z-r.z2),d=Math.hypot(dx,dz);
    if(d<R)out.push({x:+x.toFixed(1),z:+z.toFixed(1),s,k,into:+(R-d).toFixed(2),rect:[r.x1,r.z1,r.x2,r.z2].map(v=>+v.toFixed(1))});}}
  return {trees:TREEXZ.length,rects:rects.length,bad:out.sort((a,b)=>b.into-a.into)};}"""
async def main():
    async with Run('trees', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/trees-run') as run:
        g = await run.open(TMP, 'web', 'ipad-landscape', 'light', 'trees', save=save); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev(JS); print('trees', r['trees'], 'building rects', r['rects'], 'crowns into a building:', len(r['bad']))
        for b in r['bad'][:20]: print(b)
        if r['bad']:
            b = r['bad'][0]
            await g.ev("([x,z])=>{__goto('city');__setClock(null,12);const dx=x-0,dz=z-0;P.x=x+ (x>0?-4:4);P.z=z+(z>0?-4:4);P.yaw=Math.atan2(-(x-P.x),-(z-P.z));P.pitch=.15;}", [b['x'], b['z']]); await g.step(6); await g.shot('tree-into-building', both=False)
        print('shots', run.shots); await run.close(g)
asyncio.run(main())
