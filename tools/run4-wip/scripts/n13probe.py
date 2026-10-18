"""N13 first-tap probe under CPU throttle: python3 n13probe.py BUILD.html OUTDIR RATE PROF"""
import asyncio, os, sys, json, glob
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
import night3
FIX=[(os.path.basename(f), json.load(open(f))) for f in sorted(glob.glob(os.path.join(KIT,'fixtures','*.json')))]
B, OUT, RATE, PROF = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]; os.makedirs(OUT, exist_ok=True)
LOG = """()=>{window.__tl=[];const ph=()=>{const p=document.querySelector('#card .phone');if(!p)return null;return Math.round(p.getBoundingClientRect().top*10)/10;};
 for(const t of ['touchstart','touchend','click'])document.addEventListener(t,e=>{const tg=e.target;window.__tl.push({t,at:Math.round(performance.now()),tg:(tg.dataset&&tg.dataset.a)||tg.className||tg.tagName,ph:ph(),x:e.touches&&e.touches[0]?e.touches[0].clientX:e.clientX,y:e.touches&&e.touches[0]?e.touches[0].clientY:e.clientY});},true);}"""
async def main():
    async with Run('n13probe', OUT) as run:
        res = []
        for k in range(int(os.environ.get('N','4'))):
            sv = dict(night3.fx(FIX, 'save-prenight3-pets.json')); sv['job'] = None; sv['coins'] = 300
            g = await night3.begin(run, open(B, "rb").read(), PROF, 'n13p-%d' % k, sv)
            cdp = await g.page.context.new_cdp_session(g.page)
            await cdp.send('Emulation.setCPUThrottlingRate', {'rate': RATE})
            await g.ev(LOG)
            await g.ev("()=>{__goto('city');__setClock(null,11);openPhone('msg','ro');window.__t0=performance.now();}"); await g.step(3); await g.wait(250)
            pre = await g.ev("()=>{const p=document.querySelector('#card .phone');const b=document.querySelector('#card [data-a=\"rjob\"]');const r=b&&b.getBoundingClientRect();return {dt:Math.round(performance.now()-window.__t0),ph:p&&p.getBoundingClientRect().top,anims:p?p.getAnimations().map(a=>[a.animationName,a.playState,Math.round(a.currentTime||0)]):null,b:r&&[r.top,r.bottom]};}")
            t1 = await g.tap('#card [data-a="rjob"]'); await g.step(3); await g.wait(300)
            post = await g.ev("()=>({jobs:!!PH.jobs,n:(msgs().c&&msgs().c.ro||[]).length,tl:window.__tl,dt:Math.round(performance.now()-window.__t0)})")
            res.append((k, t1, pre, post))
            print(k, t1, json.dumps(pre), json.dumps(post)[:900], flush=True)
            await run.close(g)
asyncio.run(main())
