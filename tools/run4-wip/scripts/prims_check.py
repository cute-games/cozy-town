"""Which primitives sit near the point the truck check flagged? A test copy records every primitive placed (type, position, size, colour)."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
src = open('/home/user/cozy-town/index.html', encoding='utf-8').read()
old = "function place(g,m,o,x,y,z){"
assert src.count(old) == 1
src = src.replace(old, old + "(window.PRIMS=window.PRIMS||[]).push([m.geometry.type.replace('Geometry',''),x,y,z,JSON.stringify(m.geometry.parameters).slice(0,70),m.material.color?m.material.color.getHexString():'',o.rz||0,o.ry||0,g]);", 1)
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
async def main():
    async with Run('prims', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/prims-run') as run:
        g = await run.open(src.encode(), 'web', 'ipad-landscape', 'light', 'prims', save=save); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev("""()=>{const C=LOC.city.g,v=new THREE.Vector3(),under=g=>{for(let p=g;p;p=p.parent)if(p===C)return true;return false;},out=[];
          for(const p of PRIMS){const g=p[8];if(!g||!under(g))continue;v.set(p[1],p[2],p[3]);g.localToWorld(v);if(v.x<-34.3||v.x>-29.7||v.z<9.1||v.z>15.1||v.y>4.5)continue;
            out.push([p[0],+v.x.toFixed(2),+v.y.toFixed(2),+v.z.toFixed(2),p[4],p[5],+p[6].toFixed(2),+p[7].toFixed(2),g===LOC.city.g?'city.g':(g.userData&&JSON.stringify(g.userData).slice(0,30))||'group']);}return out;}""")
        print(len(r), 'city primitives in the truck area (world coords):')
        for p in r: print('  ', p)
        await run.close(g)
asyncio.run(main())
