"""Run 4 finish: the What's new book's February picture (a townsperson stood at the camera, her bubble cut to "ce.") and its Pet Shop upstairs picture
(pale, a third of it ceiling, the Capybaras sign cut) again, from a few candidate spots each; the clean one goes into the book (bookswap.py).
usage: python3 bookshots5.py OUTDIR  -> OUTDIR/shots/*.png and OUTDIR/cands.json"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW = open('/home/user/cozy-town/index.html', 'rb').read(); FIX = os.path.join(KIT, 'fixtures')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
save = json.load(open(os.path.join(FIX, 'save-prenight3-pets.json')))
HIDE = "#toast,#busTip,#note,#tut,#hud,#tasks,#pad,#job,#nav,#ptbar,#dnHud,#joy,#moveBtns,#actWrap,#cross,#left,#topbtns,#stats,#bChat,.pop{display:none!important}"
CLEAN = "()=>{const st=document.createElement('style');st.textContent='" + HIDE + "';document.head.appendChild(st);S.name='Cozy Kid';S.job=null;jobHud(true);for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.mode='away';for(const p of PET_ACTORS){p.d.stay=true;p.loc=null;}granOut=()=>false;}"   # (the grandmas stay home for the book's pictures: in the old February picture one stood at the camera)
# passers-by, grandmas and cars away from the camera: the picture is of the place
AWAY = "for(const w of WALKERS)if(Math.hypot(w.x-P.x,w.z-P.z)<14){w.x=WP[w.home][0];w.z=WP[w.home][1];w.node=w.home;w.prev=-1;}for(const c of CARS)if(Math.hypot(c.x-P.x,c.z-P.z)<20){c.d+=c.total/2;carPlace(c);}"
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
FX, FZ = -19.6, -12.6
VAL = [('val-a', look(-15.6, -9.4, FX, FZ, .02)), ('val-b', look(-14.4, -12.2, FX, FZ - .4, .03)), ('val-c', look(-15.2, -15.4, FX, FZ + .2, .02)),
       ('val-d', look(-16.4, -8.6, FX - .3, FZ, .04)), ('val-e', look(-13.8, -10.6, FX, FZ, .03))]
PET2 = [('pet-f', "__goto('pets');P.z=LOC.pets.oz+UPZ+4.3;P.x=LOC.pets.ox-.25;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);P.yaw=0;P.pitch=-.2;"), ('pet-g', "__goto('pets');P.z=LOC.pets.oz+UPZ+3.8;P.x=LOC.pets.ox-.25;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);P.yaw=0;P.pitch=-.24;")]
PET = [('pet-a', "__goto('pets');P.z=LOC.pets.oz+UPZ+2.6;P.x=LOC.pets.ox-.4;P.yaw=0;P.pitch=-.02;"),
       ('pet-b', "__goto('pets');P.z=LOC.pets.oz+UPZ+3.2;P.x=LOC.pets.ox+.6;P.yaw=0;P.pitch=-.04;"),
       ('pet-c', "__goto('pets');P.z=LOC.pets.oz+UPZ+2.2;P.x=LOC.pets.ox-1.6;P.yaw=-.18;P.pitch=-.03;")]
async def main():
    cands = {}
    async with Run('bk5', OUT) as run:
        for iso, key, spots in ([('2026-06-16T12:00:00', 'petshop', PET2)] if '--pet2' in sys.argv else [('2026-02-14T12:00:00', 'valentine', VAL), ('2026-06-16T12:00:00', 'petshop', PET)]):
            g = await run.open(fake_date_build(NEW, iso), 'web', 'ipad-landscape', 'light', 'bk5-' + key, save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(4)
            await g.ev("()=>{__goto('city');__setClock(null,12);wxForce('sun');__run(60);}")
            for name, js in spots:
                await g.ev("(js)=>{try{eval(js);}catch(e){console.error('spot',e);}}", js + (AWAY if key == 'valentine' else '')); await g.step(14); await g.wait(600); await g.step(6)
                await g.ev("(js)=>{try{eval(js);}catch(e){}}", AWAY if key == 'valentine' else ''); await g.step(4)
                p = await g.shot(name, both=False); cands[name] = p; print(name, p, flush=True)
            print('errors', g.errors[:3], flush=True); await run.close(g)
    json.dump(cands, open(os.path.join(OUT, 'cands3.json' if '--pet2' in sys.argv else 'cands.json'), 'w'), indent=1)
asyncio.run(main())
