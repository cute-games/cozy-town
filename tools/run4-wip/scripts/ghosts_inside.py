"""Which ghost spots sit inside a building collider, and which colliders are near the school door wreath? Asks the game itself."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
async def main():
    async with Run('gh', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/gh-run') as run:
        fb = fake_date_build(NEW, '2026-10-25T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'gh', save=save); await start_from_save(g); await g.ev(INSTR); await g.step(4)
        r = await g.ev("""()=>{const C=LOC.city,rects=C.cols.filter(c=>c.cr===undefined&&(c.x2-c.x1)>2.5&&(c.z2-c.z1)>2.5);
          const inside=HOL.ghosts.map((p,i)=>[i,p,rects.filter(r=>p[0]>r.x1+.2&&p[0]<r.x2-.2&&p[1]>r.z1+.2&&p[1]<r.z2-.2).map(r=>[r.x1,r.z1,r.x2,r.z2])]).filter(x=>x[2].length);
          const near=(x,z,r)=>C.cols.filter(c=>c.cr!==undefined?Math.hypot(x-c.cx,z-c.cz)<c.cr+r:x>c.x1-r&&x<c.x2+r&&z>c.z1-r&&z<c.z2+r).map(c=>c.cr!==undefined?['c',c.cx,c.cz,c.cr]:['r',c.x1,c.z1,c.x2,c.z2]);
          return {inside,school:near(-25,-57.8,1.5),fire:near(-59.9,-29.6,1.5)};}""")
        print(json.dumps(r)); await run.close(g)
asyncio.run(main())
