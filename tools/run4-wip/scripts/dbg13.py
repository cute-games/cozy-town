import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
BUILD = open('/home/user/cozy-town/index.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
async def main():
    async with Run('d13', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/d13-run') as run:
        sv = dict(fx(FIX, 'save-prenight3-pets.json')); sv['job'] = None; sv['coins'] = 300
        g = await begin(run, BUILD, 'ipad-landscape', 'n13dbg', sv)
        await g.ev("()=>{__goto('city');__setClock(null,12);}"); await g.step(3)
        # the same way n13 does it: Rosie's chat -> rjob -> job:hair
        await g.ev("()=>{__setClock(null,11);openPhone('msg','ro');}"); await g.step(3); await g.wait(250)
        t1 = await g.tap('#card [data-a="rjob"]'); await g.step(3); await g.wait(300)
        st = await g.ev("()=>{const el=document.querySelector('#card [data-a=\"job:hair\"]');const r=el&&el.getBoundingClientRect();const all=[...document.querySelectorAll('#card [data-a^=\"job:\"]')].map(b=>{const q=b.getBoundingClientRect();return [b.dataset.a,Math.round(q.left),Math.round(q.top),Math.round(q.width),Math.round(q.height)];});const card=$('card').getBoundingClientRect();return {t1:null,hair:r&&[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)],all,card:[Math.round(card.left),Math.round(card.top),Math.round(card.width),Math.round(card.height)],H:innerHeight,open:UI.open,cls:$('panel').className,sc:(()=>{let e=el;const o=[];while(e&&e!==document.body){const cs=getComputedStyle(e);if(/(auto|scroll|hidden)/.test(cs.overflowY))o.push([e.id||e.className,cs.overflowY,e.scrollHeight,e.clientHeight]);e=e.parentElement;}return o;})()};}")
        print('t1', t1, json.dumps(st)[:1200])
        t2 = await g.tap('#card [data-a="job:hair"]'); await g.step(3); print('t2', t2, await g.ev("()=>S.job"))
        await g.shot('rosie-jobs-ipad', both=False)
        await run.close(g)
asyncio.run(main())
