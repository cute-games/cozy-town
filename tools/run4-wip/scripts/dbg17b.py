import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
from party4 import both, until
BUILD = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j17try.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
async def main():
    async with Run('d17b', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/d17b-run') as run:
        base = fx(FIX, 'save-prenight3-pets.json')
        A_save = dict(base, name='ZZTEST-HOSTA', coins=900); A_save['home'] = dict(base.get('home') or {})
        items = [dict(it) for it in (A_save['home'].get('items') or []) if it.get('t') not in ('discofloor', 'discoball')]
        items += [{'u': 'zzdf', 't': 'discofloor', 'c': '', 'x': 0, 'z': 0, 'r': 0, 'f': 0}, {'u': 'zzdb', 't': 'discoball', 'c': '', 'x': 0, 'z': -3.2, 'r': 0, 'f': 0, 'on': 1}]
        A_save['home']['items'] = items
        B_save = dict(base, name='ZZTEST-GUESTB', coins=100, px=-15.5)
        A = await begin(run, BUILD, 'ipad-landscape', 'dA', A_save); B = await begin(run, BUILD, 'pc-1366', 'dB', B_save); P2 = (A, B)
        noon = await A.ev("()=>msAt(clockNow().day,12)")
        for g in P2: await g.ev("(ms)=>__clockMs(ms)", noon); await g.ev("()=>__goto('city')")
        print('met', await until(P2, A, "()=>MP.peers.size>=1"))
        print('host', await A.ev("()=>{const mb=CUR.inter.find(q=>/Mailbox/.test(typeof q.label==='function'?q.label():q.label));P.x=mb.x;P.z=mb.z+1.3;__run(3);const n=clockNow();S.hp={id:uid(),at:msAt(n.day,13),h:13,d:n.day};S.rsvpIn={};change();return S.hp;}"))
        print('B got card', await until(P2, B, "()=>(!!$('hpCard')&&!$('hpCard').hidden)"))
        await B.ev("()=>hpAnswer(true)"); await both(P2, 6, .3)
        hp = await A.ev("()=>S.hp")
        for g in P2: await g.ev("(ms)=>__clockMs(ms)", hp['at'] + 1500)
        await A.ev("()=>__goto('home')"); await both(P2, 6, .3)
        print('B nav', await until(P2, B, "()=>!!(NAV&&NAV.id==='party')", 20), await B.ev("()=>NAV&&[NAV.id,NAV.n]"))
        ap = await B.ev("()=>{const a=[...MP.peers.values()].find(q=>q.nm==='ZZTEST-HOSTA');return a?a.peer:null;}")
        await B.ev("(p)=>goKnock(p)", ap); await asyncio.sleep(.6); await both(P2, 6, .3); await asyncio.sleep(.5); await both(P2, 6, .3)
        print('B knock state', await B.ev("()=>({st:VIS.st,cur:CUR.id,host:VIS.host})"), 'A host', await A.ev("()=>({cur:CUR.id,hpOn:hpOn(),queue:HOST.queue.length,cur2:!!HOST.cur,an:HOST.an})"))
        print('B inside', await until(P2, B, "()=>CUR.id==='visit'&&VIS.st==='in'&&!fading", 40), await B.ev("()=>({st:VIS.st,cur:CUR.id})"))
        print('A sees guest', await until(P2, A, "()=>[...MP.peers.values()].some(a=>a.nm==='ZZTEST-GUESTB'&&a.guest)", 20))
        print('A lights', await A.ev("()=>({lit:HPT.lit,tiles:HPT.tiles?HPT.tiles.length:0,ball:!!HPT.ball,on:hpOn()})"))
        print('B floor', await until(P2, B, "()=>!!dnFloor()", 20), await B.ev("()=>{const f=dnFloor();return f&&[f.x,f.z,f.fl];}"))
        print('A dance btn', await A.ev("()=>{const f=dnFloor();P.x=f.x+.4;P.z=f.z+.4;__run(3);const t=findTarget();return {t:t?[t.icon,typeof t.label==='function'?t.label():t.label]:null,can:dnCan(),here:dnHere().map(a=>a.nm),fl:[f.fl,dnMyFloor()],grp:!!MP.grp,ride:!!P.ride,inter:CUR.inter.includes(DANCE.tg)};}"))
        await A.ev("()=>{const t=findTarget();if(t){TARGET=t;useTarget();}else dnAsk();}"); await both(P2, 4, .3)
        print('A mine', await A.ev("()=>({mine:DANCE.mine,ask:!!DANCE.ask})"))
        print('B pieces', await B.ev("()=>{const D=DANCE;return {on:D.on,card:!!D.card,grp:!!MP.grp,mine:!!D.mine,PLAYING,CUT:!!CUT,fading,floor:!!dnFloor(),me:MP.me,hpTickOk:typeof hpTick,cands:[...MP.peers.values()].map(a=>[a.nm,a.dn&&a.dn.st,a.dn&&a.dn.w,dnHere().includes(a),D.said.has(a.peer+'|'+(a.dn&&a.dn.r))])};}"))
        print('B lane', await B.ev("()=>{const a=[...MP.peers.values()].find(q=>q.nm==='ZZTEST-HOSTA');return {slot:a&&LANE.slotOf.get(a.peer),lane:!!LOC.city.lane,slots:[...LANE.slotOf.entries()],jt:a&&a.jt,myjt:MP.jt};}"))
        print('B card', await until(P2, B, "()=>(!!$('dnCard')&&!$('dnCard').hidden)", 30), await B.ev("()=>{const a=[...MP.peers.values()].find(q=>q.nm==='ZZTEST-HOSTA');return {dn:a&&a.dn,here:dnHere().map(x=>x.nm),floor:!!dnFloor(),card:!!DANCE.card,said:[...DANCE.said]};}"))
        await B.ev("()=>dnCardAnswer(true)"); await both(P2, 4, .3)
        print('B mine', await B.ev("()=>({mine:DANCE.mine})"))
        for i in range(12):
            await both(P2, 4, .3)
            sa = await A.ev("()=>({on:DANCE.on,mine:DANCE.mine,ask:!!DANCE.ask,t:DANCE.on?+DANCE.t.toFixed(2):null})"); sb = await B.ev("()=>({on:DANCE.on,mine:DANCE.mine,t:DANCE.on?+DANCE.t.toFixed(2):null})")
            print(i, 'A', json.dumps(sa), 'B', json.dumps(sb))
            if sa['on'] and sb['on']: break
        for _ in range(12): await both(P2, 5, .15)
        print('A view', await A.ev("()=>{const a=[...MP.peers.values()].find(q=>q.nm==='ZZTEST-GUESTB');return {cam:DANCE.cam,P:[+P.x.toFixed(2),+P.z.toFixed(2),+P.yaw.toFixed(2),+P.pitch.toFixed(2)],camPos:camera.position.toArray().map(v=>+v.toFixed(2)),W:LOC.home.W,D:LOC.home.D,HOMEW,HOMED,floor:DANCE.floor&&[DANCE.floor.x,DANCE.floor.z,DANCE.floor.fl],ride:P.ride&&P.ride.kind,me:DANCE.me&&DANCE.me.root.position.toArray().map(v=>+v.toFixed(2)),av:a&&a.av&&a.av.root.position.toArray().map(v=>+v.toFixed(2)),t:+DANCE.t.toFixed(1)};}"))
        await A.shot('dance-view', both=False)
        print('errors', A.errors[:3], B.errors[:3])
        for g in P2: await run.close(g)
asyncio.run(main())
