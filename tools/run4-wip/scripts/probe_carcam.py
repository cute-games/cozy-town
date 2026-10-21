"""Run 4 finish, pass 12: the delivery picture with no town (a flat green field and an ink band): is it a car right at the camera?
Puts each car whose loop passes the photographer's delivery spot (6 m in front of the Pizzeria door) at points along it, places you as the
photographer does, runs the frames, and reports where the camera is in the car's own frame (inside its body or cabin, or how far from it).
usage: python3 probe_carcam.py OUTDIR FILE"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
OUT, FILE = sys.argv[1:3]; os.makedirs(OUT, exist_ok=True)
SETUP = """()=>{S.tutDone=1;setJob('delivery');closePanel();__goto('city');__setClock(null,12);const dd=DOORS.pizza.city;const sx=dd[0]+Math.sin(dd[2]+Math.PI)*6,sz=dd[1]+Math.cos(dd[2]+Math.PI)*6;window.__spot=[sx,sz,dd[2]];
  const near=[];CARS.forEach((c,i)=>{if(c.away)return;const d0=c.d;let best=[99,0];for(let d=0;d<c.total;d+=.25){c.d=d;carPlace(c);const k=Math.hypot(c.x-sx,c.z-sz);if(k<best[0])best=[k,d];}c.d=d0;carPlace(c);if(best[0]<2.5)near.push([i,+best[0].toFixed(2),+best[1].toFixed(2)]);});return {spot:[+sx.toFixed(2),+sz.toFixed(2)],near};}"""
TRY = """([i,d,frames])=>{for(const o of CARS)if(o!==CARS[i]&&!o.away&&Math.hypot(o.x-__spot[0],o.z-__spot[1])<14){o.d+=o.total/2;carPlace(o);o.yaw=o.ty;}
  const c=CARS[i];c.d=d;carPlace(c);c.yaw=c.ty;c.v=0;c.g.position.set(c.x,0,c.z);c.g.rotation.y=c.yaw;
  P.x=__spot[0];P.z=__spot[1];P.yaw=__spot[2];P.pitch=.05;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);__run(frames);
  const cp=camera.position,dx=cp.x-c.x,dz=cp.z-c.z,f=Math.sin(c.yaw),g=Math.cos(c.yaw),along=dx*f+dz*g,lat=dx*g-dz*f,y=cp.y;
  const ins=(hw,lo,hi,y0,y1)=>Math.abs(lat)<hw&&along>lo&&along<hi&&y>y0&&y<y1;
  const gapBox=(hw,lo,hi,y0,y1)=>{const ex=Math.max(0,Math.abs(lat)-hw),ez=Math.max(0,lo-along,along-hi),ey=Math.max(0,y0-y,y-y1);return Math.hypot(ex,ez,ey);};
  return {car:i,col:c.col||null,d:+d.toFixed(2),moved:+(c.d-d).toFixed(2),cam:[+cp.x.toFixed(2),+cp.y.toFixed(2),+cp.z.toFixed(2)],along:+along.toFixed(2),lat:+lat.toFixed(2),
    inBody:ins(.85,-1.7,1.7,.3,.92),inCabin:ins(.75,-1.1,.8,.92,1.52),gapBody:+gapBox(.85,-1.7,1.7,.3,.92).toFixed(3),gapCabin:+gapBox(.75,-1.1,.8,.92,1.52).toFixed(3),P:[+P.x.toFixed(2),+P.z.toFixed(2)]};}"""
async def main():
    save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
    async with Run('pcc', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'pcc', save=save); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev(SETUP); print('spot', json.dumps(r), flush=True)
        worst = None
        for i, k, d in r['near']:
            for off in [x / 2 for x in range(-8, 9)]:
                for frames in (1, 30):
                    q = await g.ev(TRY, [i, d + off, frames])
                    gap = min(q['gapBody'], q['gapCabin'])
                    if q['inBody'] or q['inCabin'] or gap < .12: print(json.dumps(q), flush=True)
                    if worst is None or gap < worst[0]: worst = (gap, i, d + off, frames)
        print('closest', worst, flush=True)
        if worst:
            await g.ev(TRY, [worst[1], worst[2], worst[3]]); await g.step(2); await g.shot('carcam-closest', both=False)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
