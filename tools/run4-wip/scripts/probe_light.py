"""Run 4 finish: the same outdoor and indoor views on two game files (light before/after). usage: python3 probe_light.py OUTDIR FILE_A FILE_B"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
FIX = os.path.join(KIT, 'fixtures'); OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
LANEJS = "laneRefresh(true);__run(2);const j=LANE.own?LANE.own.findIndex(o=>o&&o.k===laneMe()):-1;const d=((j>=0?LOC.city.lane[j]:null)||LOC.city.lane[LANE.mine]||LOC.city.lane[0]).door;"
VIEWS = [
 ('garden', "S.bighouse=false;S.home.xf=0;S.home.col='';applyHouse();__goto('city');__setClock(null,11);wxForce('sun');" + LANEJS + "const q=lotPt(LANE.mine,-18.3,-25.6),t=lotPt(LANE.mine,-18.3,-20.5);P.x=q[0];P.z=q[1];P.yaw=Math.atan2(-(t[0]-P.x),-(t[1]-P.z));P.pitch=-.5;"),
 ('wall-12-5', "__goto('city');__setClock(null,12.5);wxForce('sun');P.x=41.5;P.z=-29.6;P.yaw=Math.atan2(-(34.9-P.x),-(-30.2-P.z));P.pitch=.25;"),
 ('wall-17-5', "__setClock(null,17.5);"),
 ('wall-9', "__setClock(null,9);"),
 ('square', "__setClock(null,11);P.x=-22;P.z=9;P.yaw=Math.atan2(-(-22-P.x),-(19-P.z));P.pitch=.06;"),
 ('east-shops', "P.x=53;P.z=-25.5;P.yaw=Math.atan2(-(64-P.x),-(-31.5-P.z));P.pitch=.06;"),
 ('lane-house', "S.home.col='#b79cff';applyHouse();" + LANEJS + "P.x=d[0]-Math.sin(d[2])*7;P.z=d[1]-Math.cos(d[2])*7;P.yaw=d[2]+Math.PI;P.pitch=.1;"),
 ('north-view', "P.x=-17;P.z=-4.8;P.yaw=Math.PI;P.pitch=.05;"),
 ('treepark', "__goto('treepark');__setClock(null,11);P.x=0;P.z=-1000+22.5;P.yaw=Math.atan2(-(0-P.x),-(-1000+10-P.z));P.pitch=0;"),
 ('inside-cafe', "__goto('cafe');__setClock(null,11);__run(2);P.pitch=.02;"),
]
async def main():
    save = json.load(open(os.path.join(FIX, 'save-prenight3-pets.json')))
    async with Run('pl', OUT) as run:
        for tag, f in (('A', sys.argv[2]), ('B', sys.argv[3])):
            fb = fake_date_build(open(f, 'rb').read(), '2026-10-20T12:00:00')
            g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'pl-' + tag, save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR)
            await g.ev("()=>{S.name='Cozy Kid';for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.mode='away';for(const p of PET_ACTORS){p.d.stay=true;p.loc=null;}const st=document.createElement('style');st.textContent='#toast,#note{display:none!important}';document.head.appendChild(st);}"); await g.step(4)
            for name, js in VIEWS:
                await g.ev("(js)=>{try{eval(js);}catch(e){console.error('v',e);}}", js); await g.step(12); await g.wait(500); await g.step(4)
                p = await g.shot(f'{name}-{tag}', both=False); print(tag, name, p, flush=True)
            print(tag, 'errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
