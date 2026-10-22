"""Run 4 finish (pass 19): run a list of js steps in the game and print what each returns (numbers, positions), with a picture where asked.
usage: python3 probe_js.py OUTDIR FILE DATE PROFILE TAG STEPFILE
STEPFILE: a python file with STEPS = [(name, js, shoot), ...]; each js runs in the game (its value is printed), then 4 steps; shoot: a picture.
env PV_SAVE (a fixture's name), PV_THEME (light/dark)."""
import asyncio, json, os, sys, runpy
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
FIX = os.path.join(KIT, 'fixtures')
OUT, FILE, DATE, PROF, TAG, SF = sys.argv[1:7]; os.makedirs(OUT, exist_ok=True)
STEPS = runpy.run_path(SF)['STEPS']
async def main():
    save = json.load(open(os.path.join(FIX, os.environ.get('PV_SAVE', 'save-prenight3-pets.json'))))
    async with Run('pj', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), DATE)
        g = await run.open(fb, 'web', PROF, os.environ.get('PV_THEME', 'light'), 'pj-' + TAG + '-' + PROF, save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR)
        await g.ev("()=>{S.name='Cozy Kid';}"); await g.step(4)
        for name, js, shoot in STEPS:
            r = await g.ev("(js)=>{try{const v=eval(js);return v===undefined?null:v;}catch(e){return 'ERR '+e;}}", js); await g.step(4)
            print(name, json.dumps(r), flush=True)
            if shoot:
                await g.wait(300); p = await g.shot(f'{name}-{TAG}-{PROF}', both=False); print('  picture', p, flush=True)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
