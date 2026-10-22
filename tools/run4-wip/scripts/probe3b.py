import asyncio, json, os, sys, re
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW=open('/home/user/cozy-town/index.html','rb').read()
save=json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
src=open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/shots4.py').read()
JS=re.search(r"\('dance-hud', \"(.*?)\", 'the", src, re.S).group(1).replace("ACT.ptbye();setJob(null);","")
CLEAN="()=>{S.name='Cozy Kid';S.coins=900;S.job=null;jobHud(true);const st=document.createElement('style');st.textContent='#busTip{display:none!important}';document.head.appendChild(st);}"
async def main():
    async with Run('p3b','/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/probe3b') as run:
        fb=fake_date_build(NEW,'2026-10-20T12:00:00')
        for prof in ('ipad-landscape','iphone-portrait','iphone-landscape'):
            g=await run.open(fb,'web',prof,'light',prof,save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(4)
            await g.ev("()=>{$('note').hidden=true;const t=$('toast');if(t)t.classList.remove('show');}")
            await g.ev("(js)=>{try{eval(js);}catch(e){console.error('spot',e);}}",JS)
            await g.step(6); await g.wait(400); await g.step(4)
            st=await g.ev("()=>({on:DANCE.on,hud:!$('dnHud').hidden,lane:$('dnLane').getBoundingClientRect().toJSON(),btns:$('dnBtns').getBoundingClientRect().toJSON(),svg:$('dnLane').querySelectorAll('svg').length})")
            print(prof, json.dumps(st)[:400]); p=await g.shot('dance-'+prof,both=False); print(os.path.basename(p)); print('errors',g.errors[:3]); await run.close(g)
asyncio.run(main())
