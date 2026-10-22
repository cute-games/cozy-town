"""Book pictures, clean: no toasts, no test names, HUD buttons away. Evening, ghosts, grandmas at the pond, a grandma at a shop, the pond, the truck, leaves, the costume mirror."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
OUT = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/bookshots3'
CLEAN = "()=>{const st=document.createElement('style');st.textContent='#toast,#busTip,#note,#tut{display:none!important}';document.head.appendChild(st);S.name='Cozy Kid';document.body.classList.add('cut');__goto('city');S.job=null;jobHud(true);}"
async def main():
    async with Run('bk3', OUT) as run:
        fb = fake_date_build(NEW, '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'bk3', save=save); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN)
        await g.ev("()=>{__setClock(null,19.6);wxForce('sun');P.x=-16;P.z=12.5;P.yaw=Math.atan2(-(-22-P.x),-(22-P.z));P.pitch=.1;}"); await g.step(14); await g.shot('evening', both=False)
        await g.ev("()=>{__setClock(null,21.8);P.x=-22;P.z=12;P.yaw=Math.atan2(-(-26-P.x),-(30-P.z));P.pitch=.22;}"); await g.step(14); await g.shot('ghosts', both=False)
        pt = await g.ev("""(ms0)=>{__clockMs(ms0);granPlan(realMs());const k0=Math.floor((ms0-GRAN.day0)/GRAN.T);for(let k=k0;k<GRAN.plan.length;k++){if(GRAN.plan[k].filter(s=>s===0).length!==2)continue;const ms=GRAN.day0+k*GRAN.T+78000,t=clockAt(ms).time;if(t>=10&&t<=16)return [k,ms];}return null;}""", 1792497600000)
        if pt:
            await g.ev("(ms)=>{__clockMs(ms);wxForce('sun');__run(40);P.x=34.9;P.z=-39.4;P.yaw=Math.atan2(-(33.0-P.x),-(-36.2-P.z));P.pitch=.0;}", pt[1]); await g.step(8); await g.shot('grandmas', both=False)
        wk = await g.ev("""(ms0)=>{__clockMs(ms0);granPlan(realMs());const k0=Math.floor((ms0-GRAN.day0)/GRAN.T);for(let k=k0+1;k<GRAN.plan.length;k++)for(let gi=0;gi<3;gi++){const st=GRAN.plan[k][gi],ms=GRAN.day0+k*GRAN.T+74000;if(st!==0&&['toys','bakery','market','flowers','cafe'].includes(GRAN_STOPS[st].id)&&clockAt(ms).time>=10&&clockAt(ms).time<=16)return [k,gi,ms,st];}return null;}""", 1792497600000)
        if wk:
            await g.ev("([k,gi,ms,st])=>{__clockMs(ms);__run(3);const q=GRAN.g[gi],L=GRAN_STOPS[st].look,dx=L[0]-q.x,dz=L[1]-q.z,d=Math.hypot(dx,dz)||1;P.x=q.x+dx/d*2.6+dz/d*.6;P.z=q.z+dz/d*2.6-dx/d*.6;P.yaw=Math.atan2(-(q.x-P.x),-(q.z-P.z));P.pitch=.02;__run(2);}", wk); await g.step(4); await g.shot('granny', both=False)
        await g.ev("()=>{__setClock(null,11);wxForce('sun');P.x=38.6;P.z=-33.6;P.yaw=Math.atan2(-(36.2-P.x),-(-36.2-P.z));P.pitch=-.4;}"); await g.step(10); await g.shot('pond', both=False)
        await g.ev("()=>{__setClock(null,10);P.x=-27.3;P.z=11.45;P.yaw=1.57;P.pitch=.35;}"); await g.step(10); await g.shot('truck', both=False)
        await g.ev("()=>{__setClock(null,12);P.x=-20;P.z=20;P.yaw=2.2;P.pitch=.35;}"); await g.step(30); await g.shot('leaves', both=False)
        await g.ev("()=>{document.body.classList.remove('cut');S.look.co='cat';buildPlayerBody();P.x=-17;P.z=-4.2;P.yaw=0;openCreator('edit');}")
        for _ in range(8):
            await g.step(5); await g.wait(150)
            if await g.ev("()=>!!(CR&&CR.av)&&!fading"): break
        await g.step(4); await g.shot('costume', both=False)
        print('shots', run.shots, 'errors', g.errors[:2]); await run.close(g)
asyncio.run(main())
