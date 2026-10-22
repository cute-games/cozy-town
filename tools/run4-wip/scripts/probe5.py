"""generic probe: python3 probe5.py OUTDIR DATE PROF STEP...
DATE like 2026-04-10T12:00:00; PROF a kit profile (ipad-landscape, iphone-portrait, ...); each STEP is JS (an expression or statements;
its value is printed as JSON) or 'shot:NAME' (a picture into OUTDIR) or 'wait:MS'."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
OUT, DATE, PROF, steps = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]; os.makedirs(OUT, exist_ok=True)
CLEAN = "()=>{S.name='Cozy Kid';S.coins=900;S.job=null;jobHud(true);for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.mode='away';}"
async def main():
    async with Run('probe5', OUT) as run:
        g = await run.open(fake_date_build(NEW, DATE), 'web', PROF, 'light', PROF, save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(4)
        for s in steps:
            if s.startswith('shot:'): p = await g.shot(s[5:], both=False); print('SHOT', p); continue
            if s.startswith('wait:'): await g.wait(int(s[5:])); await g.step(3); continue
            r = await g.ev("(js)=>{try{const v=(0,eval)('(()=>{'+js+'})()');return JSON.stringify(v===undefined?null:v);}catch(e){return JSON.stringify('ERR '+e.message);}}", s)
            await g.step(2); print('>>', s[:80], '\n', r[:3000])
        print('page errors:', g.errors[:3])
asyncio.run(main())
