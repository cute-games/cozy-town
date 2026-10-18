import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
BUILD = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j15try.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
async def main():
    async with Run('d15b', '/tmp/claude-0/-home-user-cozy-town/2d15b-run'.replace('/tmp/claude-0/-home-user-cozy-town/2d15b-run','/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/d15b-run')) as run:
        save = dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-DBG', job=None, ptTut=1)
        g = await begin(run, BUILD, 'pc-1366', 'dbg', save)
        await g.ev("()=>{__goto('city');__setClock(null,12);}"); await g.step(2)
        out = await g.ev("""()=>{const L=LOC.city;const hits=(x,z)=>{const h=[];for(const list of[L.cols,L.dcols])for(const c of list){const p=pushOut(x,z,.28,c);if(p)h.push(c.cr!==undefined?'circle('+c.cx.toFixed(1)+','+c.cz.toFixed(1)+' r'+c.cr+(c.lk?' lake':'')+')':'box('+c.x1.toFixed(1)+','+c.z1.toFixed(1)+','+c.x2.toFixed(1)+','+c.z2.toFixed(1)+')');}return h;};
          const grid=[];for(let x=29;x<=38;x+=.5)for(let z=-39;z<=-29;z+=.5){const h=hits(x,z);if(h.length)grid.push([x,z,h.join('|')]);}
          const bench=BENCHES.filter(b=>b.loc==='city'&&Math.hypot(b.x-32.6,b.z+36.4)<.8).map(b=>({x:b.x,z:b.z,ry:b.ry,sit:b.sit&&b.sit.length}));
          return {grid,bench,bounds:L.bounds};}""")
        print('bench', out['bench'], 'bounds', out['bounds'])
        for x, z, h in out['grid']: print(x, z, h)
        await run.close(g)
asyncio.run(main())
