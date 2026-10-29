"""Pet update 1, stage 1: pictures of the spots this stage touched (for the viewers).
   python3 tools/pet1-wip/shots_pet1.py <kit>/cozycheck <new github file> <save10.json from probe_pet1.py> <out folder>"""
import asyncio, json, os, sys
KIT, NEW, SAVE, OUT = sys.argv[1:5]; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
new_wb = open(NEW, 'rb').read(); save = json.load(open(SAVE))
SHAPES = ['ipad-landscape', 'iphone-portrait', 'iphone-landscape', 'pc-1366']
async def main():
    async with Run('pet1shots', OUT) as run:
        for prof in SHAPES:
            for theme in ('light', 'dark'):
                g = await begin(run, new_wb, prof, 'shots-' + prof + '-' + theme, dict(save, name='ZZTEST-SHOTS'), theme=theme) if theme == 'light' else None
                if g is None:
                    from night3 import start_from_save
                    from crawl import INSTR
                    g = await run.open(new_wb, 'web', prof, theme, 'shots-' + prof + '-' + theme, save=dict(save, name='ZZTEST-SHOTS')); await start_from_save(g); await g.ev(INSTR); await g.step(10)
                T = f'{prof}-{theme}'
                await g.ev("()=>{$('toast').classList.remove('show');__goto('city');__setClock(null,12);ACT.mypets();}"); await g.step(3); await g.shot(f'mypets-{T}', both=False)
                await g.ev("()=>{closePanel();__goto('pets');__setClock(null,12);openShop('pets');}"); await g.step(3)
                await g.ev("()=>{const c=$('card');c.scrollTop=c.scrollHeight;}"); await g.step(1); await g.shot(f'petshop-givebutton-{T}', both=False)
                await g.ev("()=>ACT.giveaway()"); await g.step(3); await g.shot(f'give-list-{T}', both=False)
                await g.ev("()=>ACT.gvpick(3)"); await g.step(3); await g.shot(f'give-confirm-{T}', both=False)
                await g.ev("()=>{closePanel();__goto('city');__setClock(null,12);const p=PET_ACTORS.find(q=>q.loc==='city'&&!q.d.stay)||PET_ACTORS[1];openPet(p);}"); await g.step(3); await g.shot(f'petcard-{T}', both=False)
                await g.ev("()=>{closePanel();openSettings();const b=document.querySelector('#card [data-a=\"mypets\"]');if(b)b.scrollIntoView({block:'center'});}"); await g.step(3); await g.shot(f'settings-pets-{T}', both=False)
                if prof == 'ipad-landscape':
                    await g.ev("()=>{closePanel();__goto('pets');__setClock(null,12);openAdopt('bunny',PET_TYPES.bunny.cols[0]);}"); await g.step(3); await g.shot(f'adopt-full-{T}', both=False)
                await run.close(g)
        # the yard with the pets at home (iPad, day and evening), the shop doors at 21:30, the food truck at 21:30, the designer phone page
        g = await begin(run, new_wb, 'ipad-landscape', 'shots-world', dict(save, name='ZZTEST-SHOTS'))
        for h in (12, 19.5):
            await g.ev(f"()=>{{$('toast').classList.remove('show');__goto('city');__setClock(null,{h});const j=LANE.mine,[dx,dz]=lotPt(j,-17,-5.2);P.x=dx;P.z=dz;P.yaw=LANE_PLOTS[j].s<0?0:Math.PI;P.pitch=-.12;}}"); await g.step(120); await g.step(2, render=True); await g.shot(f'yard-home-pets-{h}', both=False)
        LOOK = "(x,z)=>{P.yaw=Math.atan2(-(x-P.x),-(z-P.z));P.pitch=.08;}"
        for nm, dx, dz, px, pz in (('market', 18, -10.98, 18, -5.5), ('cafe', 32, -10.98, 32, -5.5), ('petshop', 18, 10.98, 18, 5.5), ('flowers', 31.5, 10.98, 31.5, 5.5),
                                   ('toys', 59.48, -31, 54, -31), ('bakery', 59.48, -14, 54, -14), ('library', 59.98, 20, 54.5, 20), ('icecream', 58.98, 36, 53.5, 36), ('clothes', -59.98, -12.5, -54.5, -12.5)):
            await g.ev(f"()=>{{__goto('city');__setClock(null,21.5);P.x={px};P.z={pz};}}"); await g.ev(f"()=>({LOOK})({dx},{dz})")
            await g.step(6); await g.step(2, render=True); await g.shot(f'door-2130-{nm}', both=False)
        for h, nm in ((21.5, 'truck-2130-open'), (23.5, 'truck-2330-closed')):
            await g.ev(f"()=>{{__goto('city');__setClock(null,{h});const t=LOC.city.inter.find(t=>t.label==='Food truck');P.x=t.x+2.6;P.z=t.z+.35;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);({LOOK})(t.x-2.1,t.z+.35);}}"); await g.step(6); await g.step(2, render=True); await g.shot(nm, both=False)
        await g.ev(f"()=>{{__setClock(null,6.5);__goto('city');P.x=18;P.z=-8.6;({LOOK})(18,-10.98);}}"); await g.step(6); await g.step(2, render=True); await g.shot('market-door-0630', both=False)
        await run.close(g)
asyncio.run(main())
