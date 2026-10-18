"""Pictures for the stage-1 What's new book (taken from the new game): evening town, ghosts, the grandmas at the pond and at a shop, the pond without its bridge, trash, the corner map."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
OUT2 = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/bookshots2'
async def main():
    async with Run('bk2', OUT2) as run:
        fb = fake_date_build(NEW, '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'bk', save=save); await start_from_save(g); await g.ev(INSTR)
        await g.ev("()=>{__goto('city');S.job=null;jobHud(true);document.body.classList.add('cut');}")   # the HUD out of the way (the cut-scene class hides the buttons)
        pt = await g.ev("""(ms0)=>{__clockMs(ms0);granPlan(realMs());const k0=Math.floor((ms0-GRAN.day0)/GRAN.T);for(let k=k0;k<GRAN.plan.length;k++){if(GRAN.plan[k].filter(s=>s===0).length!==2)continue;const ms=GRAN.day0+k*GRAN.T+78000,t=clockAt(ms).time;if(t>=10&&t<=16)return [k,ms];}return null;}""", 1792497600000)
        if pt:
            await g.ev("(ms)=>{__clockMs(ms);wxForce('sun');__run(40);P.x=35.3;P.z=-38.9;P.yaw=Math.atan2(-(32.8-P.x),-(-36.3-P.z));P.pitch=-.02;}", pt[1]); await g.step(8); await g.shot('grandmas-a', both=False)
            await g.ev("()=>{P.x=37.7;P.z=-34.0;P.yaw=Math.atan2(-(32.8-P.x),-(-36.4-P.z));P.pitch=-.02;}"); await g.step(6); await g.shot('grandmas-b', both=False)
            await g.ev("()=>{P.x=34.9;P.z=-39.4;P.yaw=Math.atan2(-(33.0-P.x),-(-36.2-P.z));P.pitch=.0;}"); await g.step(6); await g.shot('grandmas-c', both=False)
        await g.ev("()=>{__setClock(null,11);wxForce('sun');P.x=36.3;P.z=-32.2;P.yaw=Math.PI;P.pitch=-.42;}"); await g.step(10); await g.shot('pond', both=False)
        await g.ev("()=>{P.x=38.6;P.z=-33.6;P.yaw=Math.atan2(-(36.2-P.x),-(-36.2-P.z));P.pitch=-.4;}"); await g.step(6); await g.shot('pond-b', both=False)
        await g.ev("()=>{const l=LITTER.find(x=>x.g.userData.kind==='peel')||LITTER[0];P.x=l.x+.75;P.z=l.z+.75;P.yaw=Math.atan2(-(l.x-P.x),-(l.z-P.z));P.pitch=-.95;}"); await g.step(6); await g.shot('trash', both=False)
        await g.ev("()=>{const l=LITTER.find(x=>x.g.userData.kind==='can')||LITTER[0];P.x=l.x+.75;P.z=l.z+.75;P.yaw=Math.atan2(-(l.x-P.x),-(l.z-P.z));P.pitch=-.95;}"); await g.step(6); await g.shot('trash2', both=False)
        await g.ev("()=>{const l=LITTER.find(x=>x.g.userData.kind==='cup')||LITTER[0];P.x=l.x+.75;P.z=l.z+.75;P.yaw=Math.atan2(-(l.x-P.x),-(l.z-P.z));P.pitch=-.95;}"); await g.step(6); await g.shot('trash3', both=False)
        # the corner map as its own picture (drawn at 600 px)
        png = await g.ev("()=>{document.body.classList.remove('cut');__setClock(null,12);P.x=-20;P.z=14;P.yaw=.6;jobHud(true);const cv=$('mm');Object.defineProperty(cv,'clientWidth',{get:()=>600,configurable:true});MM.yaw=NaN;miniTick(1);return cv.toDataURL('image/png');}")
        import base64; open(OUT2 + '/corner-map-600.png', 'wb').write(base64.b64decode(png.split(',')[1])); print('corner map saved')
        print('shots', run.shots, 'errors', g.errors[:2]); await run.close(g)
asyncio.run(main())
