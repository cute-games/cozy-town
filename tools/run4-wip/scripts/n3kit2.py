"""The kit's N3 sequence step by step, with the fan state printed (why do the friends stand close together here but not in n3diag?)"""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin, VIEW_JS, fx
new_wb = open('/home/user/cozy-town/index.html', 'rb').read()
FIX = [('save-prenight3-pets.json', json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json'))))]
ST = """()=>({P:[+P.x.toFixed(2),+P.z.toFixed(2),+P.yaw.toFixed(2)],moving:!!P.moving,fan:{on:FAN.on,loc:FAN.loc,yaw:+(FAN.yaw||0).toFixed(2),turnT:FAN.turnT},cut:!!(typeof CUT!=='undefined'&&CUT),climb:!!(typeof CLIMB!=='undefined'&&CLIMB),fading:!!(typeof fading!=='undefined'&&fading),sit:!!P.sit,ride:!!P.ride,cr:!!(typeof CR!=='undefined'&&CR),loc:CUR.id,
  fr:FRIEND_ACTORS.filter(f=>f.mode==='follow').map(f=>({n:f.d.name,x:+f.x.toFixed(2),z:+f.z.toFixed(2),fan:f.fan&&f.fan.map(v=>+v.toFixed(2)),fol:f.fol,stk:+(f.stk||0).toFixed(2),moving:!!f.moving,loc:f.loc}))})"""
async def main():
    async with Run('n3k2', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/n3k2-run') as run:
        save = fx(FIX, 'save-prenight3-pets.json')
        g = await begin(run, new_wb, 'ipad-landscape', 'n3-friends', save)
        print('after begin', json.dumps(await g.ev(ST)))
        await g.ev("()=>{__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
        await g.step(10); print('after setup+10', json.dumps(await g.ev(ST)))
        await g.page.keyboard.down('KeyW'); await g.step(50); await g.page.keyboard.up('KeyW'); await g.step(2)
        print('walk end', json.dumps(await g.ev(ST)))
        for t in range(4):
            await g.step(35); print(f'  +{(t+1)*35}', json.dumps(await g.ev(ST)))
        st = await g.ev(VIEW_JS); print('VIEW', json.dumps(st['fr']))
        await run.close(g)
asyncio.run(main())
