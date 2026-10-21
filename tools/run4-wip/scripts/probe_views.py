"""Run 4 finish (pass 9 fixes): pictures of a few views on one game file, for probing a change before and after.
usage: python3 probe_views.py OUTDIR FILE DATE PROFILE[,PROFILE] TAG VIEWFILE
VIEWFILE: a python file with VIEWS = [(name, js), ...]; each js runs in the game, then 12 steps, half a second, 4 steps, a picture."""
import asyncio, json, os, sys, runpy
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
FIX = os.path.join(KIT, 'fixtures')
OUT, FILE, DATE, PROFS, TAG, VF = sys.argv[1:7]; os.makedirs(OUT, exist_ok=True)
VIEWS = runpy.run_path(VF)['VIEWS']
async def main():
    save = json.load(open(os.path.join(FIX, os.environ.get('PV_SAVE', 'save-prenight3-pets.json'))))
    async with Run('pv', OUT) as run:
        for prof in PROFS.split(','):
            fb = fake_date_build(open(FILE, 'rb').read(), DATE)
            g = await run.open(fb, 'web', prof, os.environ.get('PV_THEME', 'light'), 'pv-' + TAG + '-' + prof, save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR)
            await g.ev("()=>{S.name='Cozy Kid';const st=document.createElement('style');st.textContent='#toast{display:none!important}';document.head.appendChild(st);}"); await g.step(4)
            for name, js in VIEWS:
                r = await g.ev("(js)=>{try{const v=eval(js);return v===undefined?null:v;}catch(e){return 'ERR '+e;}}", js); await g.step(12); await g.wait(500); await g.step(4)
                p = await g.shot(f'{name}-{TAG}-{prof}', both=False); print(prof, name, r, p, flush=True)
            print(prof, 'errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
