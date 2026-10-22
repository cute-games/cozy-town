"""Run 4 finish, f8: on an upright Android tablet with the big map open, where does a message go? usage: python3 probe_f8toast2.py OUTDIR FILE"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
OUT, FILE = sys.argv[1:3]; os.makedirs(OUT, exist_ok=True)
JS = """()=>{closePanel();__goto('city');__setClock(null,11);openMap();TQ.q.length=0;clearTimeout(TQ.tm);toastEnd();TQ.card=-1e9;
  return new Promise(r=>setTimeout(()=>{toast('🟢 You are online! Friends who play will show up here.',30);setTimeout(()=>{const t=$('toast').getBoundingClientRect(),b=$('topbtns').getBoundingClientRect(),c=cardBox();
    const ov=(p,q)=>Math.max(0,Math.min(p.right,q.right)-Math.max(p.left,q.left))*Math.max(0,Math.min(p.bottom,q.bottom)-Math.max(p.top,q.top));
    r({toast:[t.left,t.top,t.right,t.bottom].map(Math.round),buttons:[b.left,b.top,b.right,b.bottom].map(Math.round),card:c?[c.left,c.top,c.right,c.bottom].map(Math.round):null,onButtons:Math.round(ov(t,b)),onCard:c?Math.round(ov(t,c)):0});},400);},300));}"""
async def main():
    save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
    async with Run('pt2', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'android-tablet-portrait', 'light', 'pt2', save=save); await start_from_save(g); await g.ev(INSTR)
        r = await g.ev(JS); print(json.dumps(r), flush=True); await g.shot('map-toast', both=False)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
