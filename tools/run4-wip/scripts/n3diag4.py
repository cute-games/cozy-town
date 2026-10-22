import asyncio, os, sys, json, glob
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
B, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
DIAG = """()=>{const fr=FRIEND_ACTORS.filter(f=>f.mode==='follow'),h=fanHalf(),base=P.yaw+Math.PI,rd=CUR.id==='city'&&!onRoad(P.x,P.z);
  const ang=f=>{const a=Math.atan2(f.x-P.x,f.z-P.z)-base;return +Math.atan2(Math.sin(a),Math.cos(a)).toFixed(3);};
  let okN=0,road=0,wall=0,tot=0;for(let a=-h;a<=h+1e-6;a+=.1)for(let r=2.4;r<=5.2;r+=.4){tot++;const x=P.x+Math.sin(base+a)*r,z=P.z+Math.cos(base+a)*r,q=collideXZ(x,z,.3,CUR);if(Math.hypot(q[0]-x,q[1]-z)>.05){wall++;continue;}if(rd&&onRoad(x,z)){road++;continue;}if(!fLine(P.x,P.z,x,z)){wall++;continue;}okN++;}
  return {h:+h.toFixed(3),rd,grid:{tot,okN,road,wall},fr:fr.map(f=>[f.d.name,ang(f),+Math.hypot(f.x-P.x,f.z-P.z).toFixed(2)]),want:fanSpots(fr.length).map(w=>w.map(v=>+v.toFixed(2)))};}"""
async def main():
    async with Run('n3diag4', OUT) as run:
        save = night3.fx(FIX, 'save-prenight3-pets.json')
        g = await night3.begin(run, open(B, "rb").read(), 'ipad-landscape', 'n3d', save)
        await g.ev("()=>{__goto('city');P.x=-20;P.z=-5.6;P.yaw=Math.PI/2;__setClock(null,12);for(const f of FRIEND_ACTORS){f.mode='follow';f.loc='city';f.wakeT=0;f.sleepT=24;}bringFollowers(true);}")
        await g.step(10)
        for k in range(2):
            await g.page.keyboard.down('KeyW'); await g.step(50); await g.page.keyboard.up('KeyW'); await g.step(2); await g.step(140)
            print('stop', k+1, json.dumps(await g.ev(DIAG)))
            await g.ev("()=>{P.yaw+=Math.PI;}"); await g.step(110)
            print('turn', k+1, json.dumps(await g.ev(DIAG)))
        await run.close(g)
asyncio.run(main())
