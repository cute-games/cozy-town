"""Call bar on an upright phone: off the run/jump buttons. python3 so_bar.py GAME OUT"""
import asyncio, sys
import so_flow as F
async def main():
    async with F.Run('sob', F.OUT) as run:
        A = await F.open_p(run, 'iphone-portrait', 'light', 'ZZTEST-SOA'); B = await F.open_p(run, 'ipad-landscape', 'dark', 'ZZTEST-SOB')
        await F.until([A, B], "()=>SOC.st==='on'&&[...MP.peers.values()].some(a=>a.pi)", 40); await F.until([B, A], "()=>SOC.st==='on'&&[...MP.peers.values()].some(a=>a.pi)", 40)
        a, b = await F.st(A), await F.st(B)
        await A.ev("(id)=>socAdd(id,'ZZTEST-SOB')", b['me']); await F.until([B, A], "(id)=>!!SOC.req[id]", 10, a['me'])
        await B.ev("(id)=>socAccept(id)", a['me']); await F.until([A, B], "(id)=>!!SOC.fr[id]", 10, b['me'])
        await A.ev("()=>closePanel()"); await A.ev("(id)=>ACT.sccall(id)", b['me']); await F.until([B, A], "()=>SOC.call&&SOC.call.st==='ring'", 15)
        await B.ev("()=>callAnswer()"); live = await F.until([A, B], "()=>SOC.call&&SOC.call.st==='live'&&!$('callBar').hidden", 25); await asyncio.sleep(2)
        await A.step(2)
        hit = await A.ev("""()=>{const r=$('callBar').getBoundingClientRect(),o=[];for(const el of document.querySelectorAll('button,#mmBtn,.btn')){if(el.closest('#callBar')||!el.offsetParent)continue;const q=el.getBoundingClientRect();if(q.width&&q.right>r.left&&q.left<r.right&&q.bottom>r.top&&q.top<r.bottom)o.push((el.id||el.className)+'');}return {bar:[r.left,r.top,r.right,r.bottom].map(Math.round),over:o}}""")
        await A.shot('in-call-phone', both=True); await B.shot('in-call-ipad')
        print(('PASS' if live and not hit['over'] else 'FAIL'), 'call bar on upright phone', hit, flush=True)
        await A.ev("()=>callEnd('hang')")
asyncio.run(main())
