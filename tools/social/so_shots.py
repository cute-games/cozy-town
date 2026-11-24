"""Pictures of every new screen on a phone-sized screen (iPhone portrait + landscape), light and dark. python3 so_shots.py GAME OUT"""
import asyncio, json, sys, time
sys.argv = sys.argv[:3]
import so_flow as F
async def main():
    async with F.Run('sop', F.OUT) as run:
        A = await F.open_p(run, 'iphone-portrait', 'light', 'ZZTEST-SOA'); B = await F.open_p(run, 'iphone-landscape', 'dark', 'ZZTEST-SOB')
        await F.until([A, B], "()=>SOC.st==='on'&&[...MP.peers.values()].some(a=>a.pi)", 40); await F.until([B, A], "()=>SOC.st==='on'&&[...MP.peers.values()].some(a=>a.pi)", 40)
        a, b = await F.st(A), await F.st(B)
        await F.phone(A, 'on'); await A.shot('online', both=True)
        await A.ev("(id)=>socAdd(id,'ZZTEST-SOB')", b['me']); await F.until([B, A], "(id)=>!!SOC.req[id]", 10, a['me'])
        await F.phone(B, 'rq'); await B.shot('requests', both=True)
        await B.ev("(id)=>socAccept(id)", a['me']); await F.until([A, B], "(id)=>!!SOC.fr[id]", 10, b['me'])
        for t in ['Hi! 👋 Want to go to the park?', 'Yes!! I am at the fountain', 'Coming! 🏃']:
            g = A if t != 'Yes!! I am at the fountain' else B; o = b if g is A else a
            await g.ev("([id,t])=>{SOC.sent=0;return socSend(id,t)}", [o['me'], t]); await F.flow(A, B, k=2)
        await F.phone(A, 'fr'); await A.shot('friends', both=True); await B.ev("()=>closePanel()"); await F.phone(B, 'fr'); await B.shot('friends', both=True)
        await A.ev("(id)=>ACT.sfr(id)", b['me']); await A.step(2); await A.shot('thread', both=True)
        await B.ev("(id)=>ACT.sfr(id)", a['me']); await B.step(2); await B.shot('thread', both=True)
        await A.ev("()=>ACT.socask('bl')"); await A.step(1); await A.shot('block-ask', both=True)
        for g, t in [(A, 'Hello everyone!'), (B, 'Hi! Who wants to play tag? 🏃')]:
            await g.ev("(t)=>{SOC.sent=0;SOC.root.child('gc/'+uid()).set({p:SOC.me,n:socMyName(),t,at:Date.now()});}", t); await F.flow(A, B, k=2)
        for g in (A, B):
            await g.ev("()=>{closePanel();SOC.gtab='all';openChat();}"); await g.step(2); await g.shot('chat', both=True)
            await g.ev("()=>{SOC.gtab='hi';openChat();}"); await g.step(2); await g.shot('chat-hi', both=True); await g.ev("()=>{SOC.gtab='all';closePanel();}")
        await B.ev("()=>{const m=SOC.gc.find(x=>x.p!==SOC.me);ACT.gcflag(m.k);}"); await B.step(2); await B.shot('flag', both=True); await B.ev("()=>closePanel()")
        await A.ev("([id,n])=>socCard(id,n)", [b['me'], 'ZZTEST-SOB']); await A.step(2); await A.shot('card', both=True); await A.ev("()=>closePanel()")
        await A.ev("(id)=>ACT.sccall(id)", b['me']); await F.until([B, A], "()=>SOC.call&&SOC.call.st==='ring'", 15)
        await A.step(2); await A.shot('calling', both=True); await B.shot('ringing', both=True)
        await B.ev("()=>callAnswer()"); await F.until([A, B], "()=>SOC.call&&SOC.call.st==='live'&&!$('callBar').hidden", 25); await asyncio.sleep(2)
        await A.step(2); await A.shot('in-call', both=True); await B.shot('in-call', both=True)
        await A.ev("()=>callEnd('hang')"); await F.flow(A, B, k=2)
        print('shots', len(A.shots) + len(B.shots), 'issues', [i for g in run.all_games for i in g.issues][:30])
        print('errors', [e for g in run.all_games for e in g.errors][:5])
asyncio.run(main())
