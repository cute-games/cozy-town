"""Run 4 finish, pass 11: does granTick stop part-way for a grandma (q.x not following her plan)? usage: python3 probe_gran3.py OUTDIR FILE K G"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
OUT, FILE, K, G = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]); os.makedirs(OUT, exist_ok=True)
SET = """([k,g])=>{__goto('city');wxForce('sun');granPlan(realMs());const ms=GRAN.day0+k*GRAN.T;__clockMs(ms);P.x=-10;P.z=4;P.yaw=Math.atan2(-(-22-P.x),-(16-P.z));P.pitch=.05;window.__res={mismatch:0,first:null,err:null,playing:PLAYING,cur:CUR.id,out:granOut()};return 1;}"""
JS = """([k,g])=>{const res=window.__res;
  for(let f=0;f<200;f++){__run(1);const q=GRAN.g[g],ps=granPose(g,realMs());if(Math.hypot(q.x-ps.x,q.z-ps.z)>.3){res.mismatch++;if(!res.first){res.first={f,qx:+q.x.toFixed(2),qz:+q.z.toFixed(2),px:+ps.x.toFixed(2),pz:+ps.z.toFixed(2),time:+S.time.toFixed(2),out:granOut(),playing:PLAYING,ui:UI.open,cut:!!CUT};
        try{granTick(.05);}catch(e){res.err=String(e&&e.stack||e).slice(0,400);}res.first.after=[+GRAN.g[g].x.toFixed(2),+GRAN.g[g].z.toFixed(2)];}}}
  return res;}"""
async def main():
    save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
    async with Run('pg3', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'pc-1366', 'light', 'pg3', save=save); await start_from_save(g); await g.ev(INSTR)
        await g.ev(SET, [K, G])
        for c in range(8):
            r = await g.ev(JS, [K, G])
        print(json.dumps(r, ensure_ascii=False), flush=True)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
