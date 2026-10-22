"""Run 4 finish, pass 11: why does a grandma still come right up to the camera at the bus stop (the photographer's house-paint spot, -10, 4)?
Steps the clock through the day with the camera there and logs every moment a grandma is drawn within 2.5 m of it.
usage: python3 probe_gran2.py OUTDIR FILE"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
OUT, FILE = sys.argv[1:3]; os.makedirs(OUT, exist_ok=True)
LIST = """()=>{__goto('city');wxForce('sun');const ms0=realMs();granPlan(ms0);const k0=Math.floor((ms0-GRAN.day0)/GRAN.T),ks=[];
  for(let k=1;k<GRAN.plan.length;k++){const ms=GRAN.day0+k*GRAN.T;if(clockAt(ms).time<9.5||clockAt(ms).time>17.5)continue;
    for(let g=0;g<3;g++){const P0=granPath(GRAN.plan[k-1][g],GRAN.plan[k][g]);let best=99;for(let i=1;i<P0.pts.length;i++){const a=P0.pts[i-1],b=P0.pts[i],dx=b[0]-a[0],dz=b[1]-a[1],L2=dx*dx+dz*dz||1,u=Math.max(0,Math.min(1,((-10-a[0])*dx+(4-a[1])*dz)/L2));best=Math.min(best,Math.hypot(a[0]+dx*u+10,a[1]+dz*u-4));}
      if(best<3){ks.push([k,g,+best.toFixed(2)]);break;}}}
  return ks;}"""
TURN = """([k,g])=>{const ms=GRAN.day0+k*GRAN.T;__clockMs(ms);P.x=-10;P.z=4;P.yaw=Math.atan2(-(-22-P.x),-(16-P.z));P.pitch=.05;const out=[];let mn=99,mnf=null;
  for(let f=0;f<1600;f++){__run(1);const q=GRAN.g[g];const R=q.p.root.position,d=Math.hypot(R.x-camera.position.x,R.z-camera.position.z);if(q.p.root.visible&&d<mn){mn=d;const ps=granPose(q.i,realMs());mnf={f,d:+d.toFixed(2),plan:+Math.hypot(q.x-P.x,q.z-P.z).toFixed(2),moving:ps.moving,arrived:ps.arrived,stop:GRAN_STOPS[ps.stop].id,ox:+(q.ox||0).toFixed(2),oz:+(q.oz||0).toFixed(2),side:q.side||0,sit:q.sitting,face:+ps.face.toFixed(2)};}}
  return mnf;}"""
async def main():
    save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
    async with Run('pg', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'pc-1366', 'light', 'pg', save=save); await start_from_save(g); await g.ev(INSTR)
        ks = await g.ev(LIST); print(len(ks), 'turns with a grandma path within 3 m of the spot:', ks[:30], flush=True)
        for k, gi, best in ks[:12]:
            r = await g.ev(TURN, [k, gi]); print('turn', k, 'grandma', gi, 'path', best, 'm from the spot -> closest drawn', json.dumps(r), flush=True)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
