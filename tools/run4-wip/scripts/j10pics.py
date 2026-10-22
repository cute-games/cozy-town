"""Job 10 pictures: the six-floor house in its colour from the lane, the colour panel, the garden pots, inside floor 4."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
BUILD = open(sys.argv[1] if len(sys.argv) > 1 else '/home/user/cozy-town/index.html', 'rb').read()
save = dict(json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-bighouse.json'))), name='Cozy Kid')
HIDE = "const st=document.createElement('style');st.textContent='#toast,#busTip,#note,#tut,#dtut{display:none!important}';document.head.appendChild(st);"
async def main():
    async with Run('j10p', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j10p-run') as run:
        g = await begin(run, BUILD, 'ipad-landscape', 'j10-pics', save)
        await g.ev("()=>{" + HIDE + "__setClock(null,11);wxForce('sun');for(let n=2;n<6;n++){sk('decor').lv=10*n;S.coins=BIG_PRICE;ACT.bighouse();}setHouseCol('#bfe6ff');__goto('city');laneRefresh(true);"
                   "const j=LANE.mine,p=LANE_PLOTS[j],s=p.s;P.x=p.X;P.z=s<0?-2.2:2.2;P.yaw=s<0?0:Math.PI;P.pitch=.42;}")
        await g.step(8); await g.shot('house-six-floors', both=False)
        await g.ev("()=>{P.pitch=.1;openHousePaint();}"); await g.step(4); await g.shot('house-colour-panel', both=False)
        await g.ev("()=>{closePanel();sk('garden').lv=20;S.bag.seed_carrot=5;S.garden[6]={seed:'carrot',g:.6,w:S.day};S.garden[7]={seed:'tomato',g:1,w:S.day};S.garden[12]={seed:'carrot',g:.3,w:S.day};gardenInit();for(const r of PLOTS)plotRefresh(r);"
                   "const j=LANE.mine,[x,z]=lotPt(j,-13.6,-21.3),[lx,lz]=lotPt(j,-20,-20);P.x=x;P.z=z;P.yaw=Math.atan2(-(lx-x),-(lz-z));P.pitch=-.12;}")
        await g.step(8); await g.shot('garden-pots', both=False)
        await g.ev("()=>{__goto('home');P.x=LOC.home.ox+2;P.z=LOC.home.oz+120+2.5;P.yaw=Math.PI/2+.5;P.pitch=.02;floorVis();}"); await g.step(8); await g.shot('floor-4-inside', both=False)
        print('shots', run.shots, 'errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
