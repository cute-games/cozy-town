import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
BUILD = open('/home/user/cozy-town/index.html','rb').read()
OLD = open('/home/user/cozy-town/tools/prerun4-index.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
JS = """()=>{const L=LOC.pets;const tri=o=>{let t=0;o.traverse(m=>{if(!(m.isMesh||m.isInstancedMesh))return;const g=m.geometry;if(!g)return;const n=g.index?g.index.count:(g.attributes.position?g.attributes.position.count:0);t+=(n/3)*(m.isInstancedMesh?m.count:1);});return Math.round(t);};
  const out=[];L.g.children.forEach((c,i)=>{c.children.forEach((d,j)=>{(d.children.length?d.children:[d]).forEach((e,k)=>{out.push([i+'.'+j+'.'+k,e.type,tri(e),e.material&&e.material.color?'#'+e.material.color.getHexString():'',e.material?e.material.type+(e.material.side===THREE.BackSide?'/back':''):'',e.geometry?e.geometry.attributes.position.count:0]);});});});
  const pen=typeof PEN!=='undefined'?PEN.length:0;const penTri=typeof PEN!=='undefined'?PEN.reduce((a,q)=>a+tri(q.g||q.m&&q.m.root||new THREE.Group()),0):0;
  return {total:tri(L.g),children:out,pen,penTri,fls:L.fls?L.fls.length:1};}"""
async def main():
    async with Run('dpets', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dpets-run') as run:
        for tag, b in (('new', BUILD), ('old', OLD)):
            g = await begin(run, b, 'pc-1366', 'pets-' + tag, dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-PETS'))
            await g.ev("()=>{__goto('pets');}"); await g.step(3)
            r = await g.ev(JS); print(tag, 'total', r['total'], 'PEN', r['pen'], 'penTri', r['penTri'], 'floors', r['fls'])
            for row in sorted(r['children'], key=lambda x: -x[2])[:40]: print('  ', row)
            await run.close(g)
asyncio.run(main())
