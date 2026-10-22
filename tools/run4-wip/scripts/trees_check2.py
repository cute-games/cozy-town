"""Job 6 (item 17): every town tree's crown spheres against every building's WALL box (recorded from buildingIn in a test copy), not the walking collider. Pictures of the worst three from the road."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
src = open('/home/user/cozy-town/index.html', encoding='utf-8').read()
n0 = len(src)
src = src.replace("function tree(g,x,z,s=1){const c=pick(TREE_COLS);", "window.TREEXZ=window.TREEXZ||[];function tree(g,x,z,s=1){TREEXZ.push([x,z,s,'tree']);const c=pick(TREE_COLS);", 1)
src = src.replace("function pine(g,x,z,s=1){cyl(g,.14*s,.18*s,.8*s,'#9b6b4a',x,0,z,{seg:8});", "function pine(g,x,z,s=1){TREEXZ.push([x,z,s,'pine']);cyl(g,.14*s,.18*s,.8*s,'#9b6b4a',x,0,z,{seg:8});", 1)
assert src.count("function buildingIn(g,o){") == 1
src = src.replace("function buildingIn(g,o){", "window.BLDG=window.BLDG||[];function buildingIn(g,o){BLDG.push([o.x,o.z,o.w,o.d,o.h||4,o.sign||'']);", 1)
assert src.count('TREEXZ.push') == 2 and 'BLDG.push' in src
TMP = src.encode()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
JS = """()=>{const out=[];const crowns=(x,z,s,k)=>k==='pine'?[[x,z,1.2*s,.7*s,2.3*s],[x,z,.92*s,1.55*s,2.95*s],[x,z,.62*s,2.35*s,3.55*s]]
    :[[x,z,1.15*s,1.9*s,4.2*s],[x+.7*s,z+.15*s,.75*s,2.0*s,3.5*s],[x-.62*s,z-.3*s,.72*s,2.08*s,3.52*s],[x+.1*s,z+.4*s,.62*s,2.98*s,4.22*s]];
  for(const [x,z,s,k] of TREEXZ){let worst=null;for(const [bx,bz,w,d,h,sign] of BLDG){const r=[bx-w/2,bz-d/2,bx+w/2,bz+d/2];
      for(const [cx,cz,cr,y0,y1] of crowns(x,z,s,k)){if(y0>h+.6)continue;const dx=Math.max(r[0]-cx,0,cx-r[2]),dz=Math.max(r[1]-cz,0,cz-r[3]),dd=Math.hypot(dx,dz),into=cr-dd;
        if(into>-.25&&(!worst||into>worst.into))worst={into:+into.toFixed(2),bld:sign||(bx+','+bz),rect:r.map(v=>+v.toFixed(1)),h,cy:[+y0.toFixed(1),+y1.toFixed(1)]};}}
    if(worst)out.push({x:+x.toFixed(1),z:+z.toFixed(1),s:+s.toFixed(2),k,...worst});}
  return {trees:TREEXZ.length,buildings:BLDG.length,bad:out.sort((a,b)=>b.into-a.into)};}"""
async def main():
    async with Run('trees2', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/trees2-run') as run:
        g = await run.open(TMP, 'web', 'ipad-landscape', 'light', 'trees2', save=save); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev(JS); print('trees', r['trees'], 'buildings', r['buildings'], 'crowns into or within 25 cm of a wall:', len(r['bad']))
        for b in r['bad'][:25]: print(b)
        k = 0
        for b in r['bad'][:4]:
            if b['into'] <= -.25: break
            # stand 7 m from the tree on the side away from the building, look at the tree
            rx, rz = (b['rect'][0]+b['rect'][2])/2, (b['rect'][1]+b['rect'][3])/2
            await g.ev("([x,z,bx,bz])=>{__goto('city');__setClock(null,12);const dx=x-bx,dz=z-bz,d=Math.hypot(dx,dz)||1;P.x=x+dx/d*7;P.z=z+dz/d*7;P.yaw=Math.atan2(-(x-P.x),-(z-P.z));P.pitch=.25;}", [b['x'], b['z'], rx, rz]); await g.step(6); await g.shot('tree-wall-%d' % k, both=False); k += 1
        print('shots', run.shots, 'errors', g.errors[:2]); await run.close(g)
asyncio.run(main())
