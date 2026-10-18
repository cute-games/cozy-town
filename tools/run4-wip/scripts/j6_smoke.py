"""Job 6 smoke: clouds by day/night/grey, the truck, the leaves near trees (autumn, October); browser errors; leaf anchors."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
async def main():
    async with Run('j6s', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j6s-run') as run:
        fb = fake_date_build(NEW, '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'j6s', save=save); await start_from_save(g); await g.ev(INSTR)
        # the park: trees around, the truck
        await g.ev("()=>{__goto('city');__setClock(null,12);wxForce('sun');P.x=-27.3;P.z=11.45;P.yaw=1.57;P.pitch=.3;}"); await g.step(8); await g.shot('truck-day', both=False)
        r = await g.ev("""()=>{const a=LEAFM.geometry.attributes.org,T=leafTrees(),cam=camera.position;let maxY=0,far=0,n=0;const set=new Set();
          for(let i=0;i<a.count;i++){if(a.getW(i)<=0)continue;n++;maxY=Math.max(maxY,a.getY(i));far=Math.max(far,Math.hypot(a.getX(i)-cam.x,a.getZ(i)-cam.z));set.add(a.getX(i)+','+a.getZ(i));}
          return {visible:LEAFM.visible,op:LEAFM.material.uniforms.op.value,near:LEAF.near,dealt:n,trees:set.size,maxY:+maxY.toFixed(2),far:+far.toFixed(1),townTrees:T.length,season:SEASON,shader:LEAFM.material.fragmentShader.includes('abs(c.x)>w')};}""")
        print('leaves', json.dumps(r))
        await g.ev("()=>{P.x=-20;P.z=20;P.yaw=2.2;P.pitch=.35;}"); await g.step(6); await g.shot('leaves-park-day', both=False)
        await g.ev("()=>{__setClock(null,22);}"); await g.step(8); await g.shot('leaves-park-night', both=False)
        await g.ev("()=>{P.x=41.5;P.z=-29.6;P.yaw=Math.atan2(-(34.9-P.x),-(-30.2-P.z));P.pitch=.25;__setClock(null,12);}"); await g.step(8); await g.shot('clouds-apartments-day', both=False)
        await g.ev("()=>{P.pitch=.9;}"); await g.step(4); await g.shot('clouds-up-day', both=False)
        await g.ev("()=>{wxForce('cloudy');}"); await g.step(10); await g.shot('clouds-up-grey', both=False)
        await g.ev("()=>{wxForce('sun');__setClock(null,22);}"); await g.step(10); await g.shot('clouds-up-night', both=False)
        c = await g.ev("()=>{const U=CLOUD.uniforms;return {top:'#'+U.top.value.getHexString(),bot:'#'+U.bot.value.getHexString(),clouds:clouds.length,beach:BEACH.clouds.length,sky:WX.sky};}")
        print('clouds', json.dumps(c))
        await g.ev("()=>{wxForce(null);__setClock(null,10);P.x=-27.3;P.z=11.45;P.yaw=1.57;P.pitch=.3;}"); await g.step(6); await g.shot('truck-10h', both=False)
        print('errors', g.errors[:5]); print('shots', run.shots); await run.close(g)
asyncio.run(main())
