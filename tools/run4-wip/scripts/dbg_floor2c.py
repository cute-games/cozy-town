import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
from PIL import Image; import numpy as np
NEW=open('/home/user/cozy-town/index.html','rb').read()
save=json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
AT="""(fl)=>{__goto('home');S.bighouse=true;S.home.xf=4;applyHouse();__setClock(null,11);P.x=LOC.home.ox;P.z=LOC.home.oz+UPZ*fl+3.5;P.yaw=0;P.pitch=.05;__run(3);}"""
def meas(p):
    im=np.asarray(Image.open(p).convert('RGB')).astype(float); return im[300:330,480:600].reshape(-1,3).mean(0).round().tolist(), im[600:640,480:700].reshape(-1,3).mean(0).round().tolist()
async def main():
    async with Run('fl2c','/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dbg-floor2c') as run:
        fb=fake_date_build(NEW,'2026-10-20T12:00:00'); g=await run.open(fb,'web','ipad-landscape','light','f2',save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.step(4)
        for variant,js in (('base',"()=>{}"),('nocast',"()=>{sun.castShadow=false;}"),('hemionly',"()=>{sun.castShadow=true;sun.intensity=0;}"),('sunonly',"()=>{sun.intensity=.9;hemi.intensity=0;}")):
            await g.ev(js)
            for fl in (0,1):
                await g.ev(AT,fl); await g.step(6); await g.wait(200); await g.step(2); p=await g.shot(f'{variant}-fl{fl}',both=False); print(variant,'floor',fl+1,'wall/floor',meas(p))
            await g.ev("()=>{sun.intensity=.9;hemi.intensity=.75;sun.castShadow=true;}")
        print(await g.ev("()=>({sund:[+SUND.x.toFixed(2),+SUND.y.toFixed(2),+SUND.z.toFixed(2)],cam:[+camera.position.x.toFixed(1),+camera.position.y.toFixed(1),+camera.position.z.toFixed(1)],home:[LOC.home.ox,LOC.home.oz],lamp:[lamp.intensity,+lamp.position.x.toFixed(1),+lamp.position.z.toFixed(1)]})"))
        await run.close(g)
asyncio.run(main())
