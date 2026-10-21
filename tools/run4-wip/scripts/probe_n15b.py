"""Run 4 finish, pass 17: N15's first two-player sample, replayed with the kit's own set-up (manual frames, WRAP, the day-58 and day-1 saves),
with what happens in each player's frames: frame() errors caught and counted, the loop mode, the test clock, S.time. usage: probe_n15.py OUT FILE TAG"""
import asyncio, glob, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
import run4
OUT, FILE, TAG = sys.argv[1:4]; os.makedirs(OUT, exist_ok=True)
FIX = dict((os.path.basename(f), json.load(open(f))) for f in glob.glob(os.path.join(KIT, 'fixtures', '*.json')))
CATCH = """()=>{if(window.__fw)return;window.__fw=1;window.__ferr=[];window.__fms=[];const f0=frame;window.frame=function(t){const a=performance.now();try{return f0(t);}catch(e){if(window.__ferr.length<5)window.__ferr.push(String(e&&e.stack||e).slice(0,300));}finally{window.__fms.push(Math.round(performance.now()-a));}};}"""
INFO = """()=>({fms:window.__fms.splice(0),t:+S.time.toFixed(3),manual:!!(window.__loop&&window.__loop.manual),tt:window.__t-window.__tt0,now:performance.now()-window.__tt0,err:window.__ferr,loc:CUR&&CUR.id,ducks:LOC.city.ducks.map(d=>[+(d.x||0).toFixed(2),+(d.z||0).toFixed(2),d.pond])})"""
async def main():
    wb = open(FILE, 'rb').read()
    async with Run('pn15', OUT) as run:
        A = await run.open(wb, 'web', 'ipad-landscape', 'light', 'n15-A', save=dict(FIX['save-prerun4-day58.json'], name='ZZTEST-CLKA')); await A.manual(); await A.ev(run4.WRAP); await start_from_save(A); await A.ev(INSTR); await A.ev(CATCH); await A.step(6)
        B = await run.open(wb, 'web', 'pc-1366', 'dark', 'n15-B', save=dict(FIX['save-prerun4-day1.json'], name='ZZTEST-CLKB')); await B.manual(); await B.ev(run4.WRAP); await start_from_save(B); await B.ev(INSTR); await B.ev(CATCH); await B.step(6)
        D = await A.ev("()=>S.day")
        for g, off in ((A, 0), (B, 1000)): await g.ev("([d,h,o])=>__clockMs(msAt(d,h)+o)", [D, 10.0, off])
        print('after setting the clocks: A', json.dumps(await A.ev(INFO)), flush=True); print('B', json.dumps(await B.ev(INFO)), flush=True)
        for k in range(3):
            import time; t0=time.time(); r1 = await A.step(4); t1=time.time(); r2 = await B.step(4); t2=time.time(); print('round',k,'A.step %.2fs B.step %.2fs'%(t1-t0,t2-t1), 'B frames', json.dumps(await B.ev("()=>window.__fms.slice(-4)")), flush=True)
            print('round', k, 'steps', r1, r2, 'A', json.dumps(await A.ev(INFO)), flush=True)
        print('B', json.dumps(await B.ev(INFO)), flush=True)
        print('errors', A.errors[:3], B.errors[:3])
asyncio.run(main())
