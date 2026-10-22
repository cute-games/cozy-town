import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW=open('/home/user/cozy-town/index.html','rb').read()
save=json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
JS_AT="""(fl)=>{__goto('home');S.bighouse=true;S.home.xf=4;applyHouse();__setClock(null,11);P.x=LOC.home.ox;P.z=LOC.home.oz+UPZ*fl+3.5;P.yaw=0;P.pitch=.05;__run(3);}"""
PROBE="""()=>{const L=LOC.home,W=HOMEW,D=HOMED;const sun=scene.children.find(o=>o.isDirectionalLight)||window.SUN||window.sun;const out={shadows:renderer.shadowMap.enabled,sun:sun?{x:+sun.position.x.toFixed(1),y:+sun.position.y.toFixed(1),z:+sun.position.z.toFixed(1),cast:sun.castShadow,cam:sun.shadow&&{l:sun.shadow.camera.left,r:sun.shadow.camera.right,t:sun.shadow.camera.top,b:sun.shadow.camera.bottom,n:sun.shadow.camera.near,f:sun.shadow.camera.far},tgt:sun.target&&[+sun.target.position.x.toFixed(1),+sun.target.position.z.toFixed(1)]}:null};
 return out;}"""
async def main():
    async with Run('fl2','/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dbg-floor2') as run:
        fb=fake_date_build(NEW,'2026-10-20T12:00:00'); g=await run.open(fb,'web','ipad-landscape','light','f2',save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.step(4)
        await g.ev(JS_AT,1); await g.step(6); await g.wait(400); await g.step(3)
        print(json.dumps(await g.ev(PROBE))[:900])
        p1=await g.shot('floor2-shadows-on',both=False)
        await g.ev("()=>{renderer.shadowMap.enabled=false;scene.traverse(o=>{if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms)m.needsUpdate=true;}});}"); await g.step(4)
        p2=await g.shot('floor2-shadows-off',both=False)
        await g.ev("()=>{renderer.shadowMap.enabled=true;scene.traverse(o=>{if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms)m.needsUpdate=true;}});}")
        await g.ev(JS_AT,0); await g.step(6); await g.wait(300); p0=await g.shot('floor1',both=False)
        from PIL import Image; import numpy as np
        for p in (p0,p1,p2):
            im=np.asarray(Image.open(p).convert('RGB')).astype(float); print(os.path.basename(p)[-26:], 'wall', im[300:330,480:600].reshape(-1,3).mean(0).round(), 'floor', im[600:640,480:700].reshape(-1,3).mean(0).round())
        await run.close(g)
asyncio.run(main())
