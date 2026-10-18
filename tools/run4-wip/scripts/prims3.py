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
          for(const p of PRIMS){const g=p[8];if(!g||!under(g))continue;v.set(p[1],p[2],p[3]);g.localToWorld(v);if(v.x<-35.8||v.x>-31.6||v.z<9.2||v.z>15.0||v.y>4.5)continue;
            out.push([p[0],+v.x.toFixed(2),+v.y.toFixed(2),+v.z.toFixed(2),p[4],p[5],+p[6].toFixed(2),+p[7].toFixed(2),g===LOC.city.g?'city.g':(g.userData&&JSON.stringify(g.userData).slice(0,30))||'group']);}return out;}""")
        print(len(r), 'city primitives in the NEW truck area (world coords), not in the truck palette:')
        pal={'ff8a6b','ffffff','bfe6ff','5a5f8c','fff1b8','3d2c5e','c8cde0','7cc8ff','ff6b6b','c98f5e','ffd45c','e0a874','ffe0c4','e0745a','fff6d6'}
        for p in r:
            if p[5] not in pal: print('  ', p)
        w = await g.ev("""()=>{const r=[-34.2-1.25,11.8-2.3,-34.2+1.95,11.8+2.85],hit=[];for(const [a,b] of WE){const A=WP[a],B=WP[b];const x1=Math.min(A[0],B[0]),x2=Math.max(A[0],B[0]),z1=Math.min(A[1],B[1]),z2=Math.max(A[1],B[1]);if(x2<r[0]||x1>r[2]||z2<r[1]||z1>r[3])continue;hit.push([A,B]);}
          const cols=LOC.city.cols.filter(c=>c.cr!==undefined?(c.cx>r[0]-c.cr&&c.cx<r[2]+c.cr&&c.cz>r[1]-c.cr&&c.cz<r[3]+c.cr):(c.x2>r[0]&&c.x1<r[2]&&c.z2>r[1]&&c.z1<r[3])).map(c=>c.cr!==undefined?['circle',c.cx,c.cz,c.cr]:['rect',c.x1,c.z1,c.x2,c.z2]);
          const inter=LOC.city.inter.filter(t=>Math.hypot(t.x+32.1,t.z-11.45)<4).map(t=>[t.label||t.icon,+t.x.toFixed(1),+t.z.toFixed(1),t.r]);return {walkerEdges:hit,colliders:cols,nearbyInter:inter};}""")
        t = await g.ev("""()=>{const x=-37,z=10.2,hit=[];for(const [a,b] of WE){const A=WP[a],B=WP[b];const dx=B[0]-A[0],dz=B[1]-A[1],L2=dx*dx+dz*dz,u=Math.max(0,Math.min(1,((x-A[0])*dx+(z-A[1])*dz)/(L2||1))),d=Math.hypot(A[0]+dx*u-x,A[1]+dz*u-z);if(d<1.8)hit.push([A,B,+d.toFixed(2)]);}
          const cols=LOC.city.cols.filter(c=>c.cr!==undefined?Math.hypot(c.cx-x,c.cz-z)<c.cr+1.6:(x>c.x1-1.6&&x<c.x2+1.6&&z>c.z1-1.6&&z<c.z2+1.6)).map(c=>c.cr!==undefined?['circle',c.cx,c.cz,c.cr]:['rect',c.x1,c.z1,c.x2,c.z2]);return {walkersNear:hit,colsNear:cols};}""")
        print('moved tree (-37,10.2): walker edges within 1.8 m:', t['walkersNear'], 'colliders within 1.6 m:', t['colsNear'])
        print('walker edges crossing the new truck rect:', w['walkerEdges']); print('colliders overlapping the new truck rect:', w['colliders']); print('interaction spots within 4 m of the counter spot:', w['nearbyInter'])
        await run.close(g)
asyncio.run(main())
