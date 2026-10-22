import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
BUILD = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j17try.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
async def main():
    async with Run('d17', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/d17-run') as run:
        save = dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-HOSTA', coins=900)
        A = await begin(run, BUILD, 'ipad-landscape', 'dbgA', save)
        noon = await A.ev("()=>msAt(clockNow().day,12)"); await A.ev("(ms)=>__clockMs(ms)", noon); await A.ev("()=>__goto('city')"); await A.step(3)
        m = await A.ev("()=>{const mb=CUR.inter.find(q=>/Mailbox/.test(typeof q.label==='function'?q.label():q.label));if(!mb)return {lab:'no mailbox inter',near:[],all:CUR.inter.length};P.x=mb.x;P.z=mb.z+1.3;P.yaw=0;__run(3);const t=findTarget();const lab=t?(typeof t.label==='function'?t.label():t.label):null;const near=CUR.inter.filter(q=>Math.hypot(q.x-P.x,q.z-P.z)<3).map(q=>[typeof q.label==='function'?q.label():q.label,+Math.hypot(q.x-P.x,q.z-P.z).toFixed(2)]);return {lab,near,grp:!!MP.grp,me:MP.me};}")
        print('mailbox', json.dumps(m))
        r = await A.ev("()=>{const t=findTarget();if(t){TARGET=t;useTarget();}return {open:UI.open,card:$('card').innerHTML.slice(0,300)};}"); print('after use', json.dumps(r)[:400])
        await A.step(2)
        t1 = await A.tap('#card [data-a="hpplan"]'); await A.step(2)
        o = await A.ev("()=>({open:UI.open,opts:[...document.querySelectorAll('#card [data-a^=\"hpset:\"]')].map(b=>[b.dataset.a,b.textContent.trim()]),html:$('card').innerHTML.slice(0,200)})"); print('plan tap', t1, json.dumps(o)[:500])
        t2 = await A.tap('#card [data-a^="hpset:"]'); await A.step(3)
        print('set tap', t2, await A.ev("()=>({hp:S.hp,open:UI.open,toast:$('toast')&&$('toast').textContent})"))
        print('errors', A.errors[:4])
        await run.close(A)
asyncio.run(main())
