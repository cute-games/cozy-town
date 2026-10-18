"""Stage 3, PHOTOGRAPHER (pass 5 on): a real two-player dance-off on phones. A hosts on an upright iPhone (disco floor and ball at home),
B is the guest on a sideways iPhone: B gets the party note, knocks, comes in; A asks B to dance; pictures from both screens during the
round and of the result. The same flow as the kit's N39 line, only the screens differ.
usage: python3 shots4c.py OUTDIR"""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
from party4 import both, until
NEW = open('/home/user/cozy-town/index.html', 'rb').read(); FIX = os.path.join(KIT, 'fixtures')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
CLEAN = "()=>{const st=document.createElement('style');st.textContent='#busTip{display:none!important}';document.head.appendChild(st);for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.mode='away';}"
async def main():
    themap = []
    def add(name, prof, note, p): themap.append(dict(name=name, prof=prof, theme='light', note=note, file=os.path.basename(p)))
    async with Run('s3c', OUT) as run:
        base = json.load(open(os.path.join(FIX, 'save-prenight3-pets.json')))
        A_save = dict(base, name='ZZTEST-HOSTA', coins=900, px=-17, pz=-4.6); A_save.pop('hp', None); A_save.pop('rsvp', None)
        A_save['home'] = dict(base.get('home') or {}); items = [dict(it) for it in (A_save['home'].get('items') or []) if it.get('t') not in ('discofloor', 'discoball')]
        items += [{'u': 'zzdf', 't': 'discofloor', 'c': '', 'x': 0, 'z': 0, 'r': 0, 'f': 0}, {'u': 'zzdb', 't': 'discoball', 'c': '', 'x': 0, 'z': -3.2, 'r': 0, 'f': 0, 'on': 1}]
        A_save['home']['items'] = items
        B_save = dict(base, name='ZZTEST-GUESTB', coins=100, px=-15.5, pz=-4.6); B_save.pop('hp', None); B_save.pop('rsvp', None)
        A = await begin(run, NEW, 'iphone-portrait', 'dance-A', A_save); B = await begin(run, NEW, 'iphone-landscape', 'dance-B', B_save); P2 = (A, B)
        for g in P2: await g.ev(CLEAN)
        noon = await A.ev("()=>msAt(clockNow().day,12)")
        for g in P2: await g.ev("(ms)=>__clockMs(ms)", noon); await g.ev("()=>__goto('city')")
        print('online', await until(P2, A, "()=>MP.peers.size>=1"), flush=True)
        await A.ev("()=>{const mb=CUR.inter.find(q=>/Mailbox/.test(typeof q.label==='function'?q.label():q.label));if(mb){P.x=mb.x;P.z=mb.z+1.3;P.yaw=0;}__run(3);}")
        await A.ev("()=>{hpMailMenu();}"); await A.step(2); await A.tap('#card [data-a="hpplan"]'); await A.step(2); await A.tap('#card [data-a^="hpset:"]'); await A.step(3)
        hp = await A.ev("()=>S.hp?{id:S.hp.id,at:S.hp.at}:null"); print('party', hp, flush=True)
        print('B note', await until(P2, B, "()=>(!!$('hpCard')&&!$('hpCard').hidden)"), flush=True)
        await asyncio.sleep(.5); await B.tap('#hpYes'); await both(P2, 6, .3)
        print('A hears', await until(P2, A, "()=>!!(S.rsvpIn&&Object.values(S.rsvpIn).some(v=>v===1))", 20), flush=True)
        for g in P2: await g.ev("(ms)=>__clockMs(ms)", hp['at'] + 1500)
        await A.ev("()=>__goto('home')"); await both(P2, 6, .3)
        ap = await B.ev("()=>{const a=[...MP.peers.values()].find(q=>q.nm==='ZZTEST-HOSTA');return a?a.peer:null;}")
        await B.ev("(p)=>goKnock(p)", ap); await asyncio.sleep(.6); await both(P2, 6, .3); await asyncio.sleep(.5); await both(P2, 6, .3)
        print('B inside', await until(P2, B, "()=>CUR.id==='visit'&&VIS.st==='in'&&!fading", 40), flush=True)
        print('B sees the floor', await until(P2, B, "()=>!!dnFloor()", 20), flush=True)
        await A.ev("()=>{const f=dnFloor();P.x=f.x+.4;P.z=f.z+.4;__run(3);TARGET=findTarget();useTarget();}"); await both(P2, 4, .3)
        print('B card', await until(P2, B, "()=>(!!$('dnCard')&&!$('dnCard').hidden)", 30), flush=True)
        await B.tap('#dnYes'); await both(P2, 4, .3)
        on = await until(P2, A, "()=>DANCE.on", 30) and await until(P2, B, "()=>DANCE.on", 20); print('dance on', on, flush=True)
        NEXT = "(k)=>{const q=DANCE.pat.filter(a=>!a.j);if(!q.length)return null;const a=q[0];while(DANCE.t<a.t-.03)__run(1);return {d:a.d};}"
        shot = 0
        for i in range(20):
            na = await A.ev(NEXT, 1); nb = await B.ev(NEXT, 0)
            if not na or not nb: break
            await A.ev("(d)=>dnPress(d)", na['d']); await B.ev("(d)=>dnPress(d)", nb['d'])
            if i == 5 and not shot:
                await A.ev("()=>__run(4)"); await B.ev("()=>__run(4)")
                for nm, gg in (('A', A), ('B', B)): print(nm, await gg.ev("()=>({cam:DANCE.cam,floor:DANCE.floor&&{x:DANCE.floor.x,z:DANCE.floor.z,fl:DANCE.floor.fl},ox:CUR.ox,oz:CUR.oz,W:CUR.W,D:CUR.D,P:[+P.x.toFixed(2),+P.z.toFixed(2),+P.yaw.toFixed(2),+P.pitch.toFixed(2)],ride:P.ride,cur:CUR.id,me:!!DANCE.me,meXZ:DANCE.me?[+DANCE.me.root.position.x.toFixed(2),+DANCE.me.root.position.z.toFixed(2)]:null,note:!$('note').hidden})"), flush=True)
                add('dance-two-portrait', 'iphone-portrait', 'a real dance-off from the host on an upright phone (the guest dances beside)', await A.shot('dance-two-portrait', both=False))
                add('dance-two-landscape', 'iphone-landscape', 'the same dance-off from the guest on a sideways phone', await B.shot('dance-two-landscape', both=False))
                shot = 1
            await both(P2, 3, .12)
        print('result A', await until(P2, A, "()=>!DANCE.on&&!!document.querySelector('#card [data-a=dnbye]')", 60, 8, .3), flush=True)
        print('result B', await until(P2, B, "()=>!DANCE.on&&!!document.querySelector('#card [data-a=dnbye]')", 30, 8, .3), flush=True)
        await asyncio.sleep(2.0); await both(P2, 6, .2)
        add('dance-two-result-portrait', 'iphone-portrait', 'the result card on the host\'s upright phone, the view still on the two dancers', await A.shot('dance-two-result-portrait', both=False))
        add('dance-two-result-landscape', 'iphone-landscape', 'the result card on the guest\'s sideways phone', await B.shot('dance-two-result-landscape', both=False))
        print('errors', A.errors[:2], B.errors[:2], flush=True)
        await run.close(A); await run.close(B)
    json.dump(themap, open(os.path.join(OUT, 'map.json'), 'w'), indent=1); print('pictures', len(themap), 'map at', os.path.join(OUT, 'map.json'))
asyncio.run(main())
