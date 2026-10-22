"""Run 4 finish: the kit's N3 walk (two stops, a turn after each) with a map of the fan's free spots. usage: python3 probe_fan.py OUTDIR FILE"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build, VIEW_JS
FIX = os.path.join(KIT, 'fixtures'); OUT, FILE = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
MAP = """()=>{const h=fanHalf(),base=P.yaw+Math.PI,rd=CUR.id==='city'&&!onRoad(P.x,P.z),rows=[];
  for(let r=5.2;r>=1.59;r-=.4){let s='';for(let i=0;i<=10;i++){const a=-h+h*i/5,x=P.x+Math.sin(base+a)*r,z=P.z+Math.cos(base+a)*r,q=collideXZ(x,z,.3,CUR);
    let c=Math.hypot(q[0]-x,q[1]-z)>.05?'#':(rd&&onRoad(x,z))?'~':!fLine(P.x,P.z,x,z)?'x':'.';
    for(const f of FRIEND_ACTORS)if(f.mode==='follow'&&f.fan&&Math.hypot(f.fan[0]-x,f.fan[1]-z)<.25)c=f.d.name[0];s+=c;}rows.push(r.toFixed(1)+' '+s);}
  return {h:+h.toFixed(2),rows,fr:FRIEND_ACTORS.filter(f=>f.mode==='follow').map(f=>[f.d.name,+f.x.toFixed(2),+f.z.toFixed(2),f.fan&&f.fan.map(v=>+v.toFixed(2)),!!f.moving])};}"""
async def main():
    save = json.load(open(os.path.join(FIX, 'save-prenight3-pets.json')))
    async with Run('pf', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-21T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'pf', save=save); await start_from_save(g); await g.ev(INSTR); await g.step(10)
        await g.ev("()=>{__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
        await g.step(10)
        for k in range(2):
            await g.page.keyboard.down('KeyW'); await g.step(50); await g.page.keyboard.up('KeyW'); await g.step(2); await g.step(140)
            m = await g.ev(MAP); print('STOP', k + 1, 'half', m['h']); print('\n'.join(m['rows'])); print(m['fr'])
            await g.shot(f'stop-{k + 1}', both=False)
            await g.ev("()=>{P.yaw+=Math.PI;}"); await g.step(110)
            m = await g.ev(MAP); print('TURN', k + 1); print('\n'.join(m['rows'])); print(m['fr'])
            await g.shot(f'turn-{k + 1}', both=False)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
