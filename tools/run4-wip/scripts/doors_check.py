"""Every holiday door (HOL_DOORS): how far is the wreath/pumpkin spot from the nearest building face? Asks the game itself."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
async def main():
    async with Run('dr', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dr-run') as run:
        g = await run.open(NEW, 'web', 'ipad-landscape', 'light', 'dr', save=save); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev("""()=>{const C=LOC.city,rects=C.cols.filter(c=>c.cr===undefined&&(c.x2-c.x1)>2&&(c.z2-c.z1)>2);
          return HOL_DOORS.map(([x,z,ry])=>{const fx=Math.sin(ry),fz=Math.cos(ry),px=x+fx*.1,pz=z+fz*.1;let best=null;
            for(const r of rects){const dx=Math.max(r.x1-px,0,px-r.x2),dz=Math.max(r.z1-pz,0,pz-r.z2),d=Math.hypot(dx,dz),inside=px>r.x1&&px<r.x2&&pz>r.z1&&pz<r.z2;const v=inside?-Math.min(px-r.x1,r.x2-px,pz-r.z1,r.z2-pz):d;if(best===null||Math.abs(v)<Math.abs(best.v))best={v:+v.toFixed(2),r:[r.x1,r.z1,r.x2,r.z2]};}
            return {door:[x,z,+ry.toFixed(2)],spot:[+px.toFixed(2),+pz.toFixed(2)],faceDist:best&&best.v,rect:best&&best.r};});}""")
        for d in r: print(d)
        await run.close(g)
asyncio.run(main())
