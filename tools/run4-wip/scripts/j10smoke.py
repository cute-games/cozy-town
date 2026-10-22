"""Job 10 smoke test on the scratch copy (j10try.html): floors 2..6, decorating per floor, presence n/u2.., visiting a 3-floor house, house colour, garden pots, levels to 50, an old upstairs save."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
BUILD = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j10try.html', 'rb').read()
fx = lambda n: json.load(open(os.path.join(KIT, 'fixtures', n)))
CLIMB_WAIT = "()=>{let n=0;while(CLIMB&&n<400){__run(1);n++;}return n;}"
async def main():
    async with Run('j10s', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j10s-run') as run:
        g = await run.open(BUILD, 'web', 'ipad-landscape', 'light', 'j10-big', save=dict(fx('save-prenight3-bighouse.json'), name='ZZTEST-J10')); await start_from_save(g); await g.ev(INSTR); await g.step(5)
        print('A1 start', json.dumps(await g.ev("()=>({floors:homeFloors(),fls:LOC.home.fls.length,bz2:LOC.home.bounds.z2-LOC.home.oz,loc:CUR.id,xf:S.home.xf|0,items:S.home.items.length})")))
        await g.ev("()=>{__goto('home');}"); await g.step(5)
        print('A2 home', json.dumps(await g.ev("()=>({dz:+(P.z-LOC.home.oz).toFixed(2),attached:LOC.home.fls.map(F=>!!F.g.parent),vf:LOC.home.vf,ints:LOC.home.inter.filter(i=>i.hdoor).map(i=>i.icon)})")))
        await g.ev("()=>{hclimb(1);}"); n = await g.ev(CLIMB_WAIT); await g.step(3)
        print('A3 up', n, json.dumps(await g.ev("()=>({dz:+(P.z-LOC.home.oz).toFixed(2),dx:+(P.x-LOC.home.ox).toFixed(2),attached:LOC.home.fls.map(F=>!!F.g.parent),climb:!!CLIMB,fl:homeFl()})")))
        print('A4 item', json.dumps(await g.ev("()=>{const it={t:'chair',c:'#ff6b6b',x:1.5,z:1.5,r:0,f:1,u:'zz1'};S.home.items.push(it);addHomeItem(it);const rec=HOME_ITEMS.get('zz1')||[...HOME_ITEMS.values()].find(r=>r.it===it);const gg=rec&&rec.g;return {found:!!rec,z:gg&&+(gg.position.z-LOC.home.oz).toFixed(2),vis:gg&&gg.visible,fl:gg&&(gg.userData.fl|0)};}")))
        await g.ev("()=>{hclimb(-1);}"); n = await g.ev(CLIMB_WAIT); await g.step(3)
        print('A5 down', n, json.dumps(await g.ev("()=>{const rec=[...HOME_ITEMS.values()].find(r=>r.it&&r.it.u==='zz1');return {dz:+(P.z-LOC.home.oz).toFixed(2),attached:LOC.home.fls.map(F=>!!F.g.parent),itemVis:rec&&rec.g.visible,fl:homeFl()};}")))
        print('A6 buy floor 3', json.dumps(await g.ev("()=>{sk('decor').lv=20;S.coins=9000;const n0=homeFloors();ACT.bighouse();return {before:n0,after:homeFloors(),fls:LOC.home.fls.length,xf:S.home.xf|0,coins:S.coins,bz2:LOC.home.bounds.z2-LOC.home.oz,items:S.home.items.length,itemKept:!!S.home.items.find(i=>i.u==='zz1')};}")))
        await g.ev("()=>{hclimb(1);}"); await g.ev(CLIMB_WAIT); await g.ev("()=>{hclimb(1);}"); n = await g.ev(CLIMB_WAIT); await g.step(3)
        print('A7 floor 3', n, json.dumps(await g.ev("()=>({dz:+(P.z-LOC.home.oz).toFixed(2),attached:LOC.home.fls.map(F=>!!F.g.parent),fl:homeFl(),up:LOC.home.inter.filter(i=>i.hdoor&&i.icon==='⬆️').length,down:LOC.home.inter.filter(i=>i.hdoor&&i.icon==='⬇️').length})")))
        print('A8 presence', json.dumps(await g.ev("()=>{const st={};laneStamp(st);const hm=homeSnap(0);return {hf:st.hf,hc:st.hc,n:hm.n,keys:Object.keys(hm),u:hm.u,u2:hm.u2,vis:visFloors(hm)};}")))
        print('A9 colour', json.dumps(await g.ev("()=>{setHouseCol('#bfe6ff');const a=houseCol();const st={};laneStamp(st);laneRefresh(true);const hex=st.hc;setHouseCol(null);return {set:a,stamped:hex,cleared:houseCol(),col:S.home.col};}")))
        print('A10 visit', json.dumps(await g.ev("""()=>{const fn=Object.getOwnPropertyNames(window).find(k=>{try{return typeof window[k]==='function'&&window[k].toString().includes('visitShell(L,visFloors(hm)');}catch(e){return false;}});
            const hm={b:1,n:3,w:'#ffd6e0',f:'wood',W:6,D:5,i:'chair,#ff6b6b,1,1,0,0',u:'chair,#5fd4b0,1,1,0,0',u2:'chair,#7cc8ff,1,1,0,0'};window[fn](hm);const L=LOC.visit;
            return {fn,fls:L.fls&&L.fls.length,items:L.items.children.length,zs:L.items.children.map(c=>+(c.position.z-L.oz).toFixed(1)),bz2:L.bounds.z2-L.oz};}""")))
        print('A11 garden', json.dumps(await g.ev("()=>{sk('garden').lv=10;S.garden[6]={seed:'carrot',g:0,w:S.day};const snap=gardenSnap();const lp=LOC.city.lane[3];laneHouse(lp,{k:'zz',nm:'Zed',big:1,fl:4,col:'#bfe6ff',gd:'0,tomato,2;6,carrot,1;30,carrot,1'});return {open:[plotOpen(5),plotOpen(6),plotOpen(11),plotOpen(12)],gate:[plotGate(6),plotGate(12),plotGate(35)],snap,plots:LOC.city.plots.length,garden:S.garden.length,lot:lp.g.children.length};}")))
        print('A12 levels', json.dumps(await g.ev("()=>{const k=Object.keys(SKILLS)[0];addXP(k,1e6);const a={lv:sk(k).lv,xp:sk(k).xp};addXP(k,50);return {k,a,b:{lv:sk(k).lv,xp:sk(k).xp},maxlv:MAXLV};}")))
        print('A errors', g.errors[:4]); await run.close(g)
        g = await run.open(BUILD, 'web', 'ipad-landscape', 'light', 'j10-ups', save=dict(fx('save-prenight3-upstairs.json'), name='ZZTEST-J10U')); await start_from_save(g); await g.ev(INSTR); await g.step(5)
        print('B1 old upstairs save', json.dumps(await g.ev("()=>({loc:CUR.id,dz:+(P.z-LOC.home.oz).toFixed(2),dx:+(P.x-LOC.home.ox).toFixed(2),fl:homeFl(),attached:LOC.home.fls.map(F=>!!F.g.parent),items:S.home.items.length,upItems:S.home.items.filter(i=>i.f).length})")))
        await g.shot('old-upstairs-save', both=False); print('B errors', g.errors[:4]); await run.close(g)
asyncio.run(main())
