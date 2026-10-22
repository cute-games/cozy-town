"""Stage 3: the What's new book's eleven pictures again, clean: no HUD, no toasts, no cut name tags (viewers found HUD slivers and cut tags
in the stage-2 crops). One iPad for the places, the holidays on their own dates, and two players for the party and the dance-off.
usage: python3 bookshots4.py OUTDIR  -> OUTDIR/pics.json for mkbook.py"""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build, begin
from party4 import both, until
NEW = open('/home/user/cozy-town/index.html', 'rb').read(); FIX = os.path.join(KIT, 'fixtures')
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
save = json.load(open(os.path.join(FIX, 'save-prenight3-pets.json')))
HIDE = "#toast,#busTip,#note,#tut,#hud,#tasks,#pad,#job,#nav,#ptbar,#dnHud,#joy,#moveBtns,#actWrap,#cross,#left,#topbtns,#stats,#bChat,.pop{display:none!important}"
CLEAN = "()=>{const st=document.createElement('style');st.textContent='" + HIDE + "';document.head.appendChild(st);S.name='Cozy Kid';S.job=null;jobHud(true);for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.mode='away';for(const p of PET_ACTORS){p.d.stay=true;p.loc=null;}}"
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
LANEJS = "laneRefresh(true);__run(2);const j=LANE.own?LANE.own.findIndex(o=>o&&o.k===laneMe()):-1;const d=((j>=0?LOC.city.lane[j]:null)||LOC.city.lane[LANE.mine]||LOC.city.lane[0]).door;"
FURN = "S.home.items=(S.home.items||[]).filter(it=>!['discofloor','discoball','beanbag','bonsai'].includes(it.t));S.home.items.push({u:'bk1',t:'beanbag',c:'#b79cff',x:2.6,z:-2.2,r:0,f:0},{u:'bk2',t:'bonsai',c:'',x:-2.8,z:-3.2,r:0,f:0},{u:'bk3',t:'discofloor',c:'',x:0,z:-.6,r:0,f:0},{u:'bk4',t:'discoball',c:'',x:-1.4,z:-3.4,r:0,f:0,on:1});"
PLACES = [
 ('treepark', "__goto('treepark');__setClock(null,12);wxForce('sun');" + look(0, -1000+22.5, 0, -1000+10, .04)),
 ('treedeck', "__goto('treepark');__setClock(null,12);tpStart('easy');"),
 ('photo', "__goto('city');__setClock(null,12);setJob('photo');S.ptTut=1;const d=pt();d.o={id:'bk',kind:'family',spot:'park',bg:'fountain',who:['n1','n2','s1'],pet:null,st:'go'};P.x=-22;P.z=10.2;P.yaw=Math.PI;P.pitch=.03;__run(2);ptSetup();for(const m of PHO.group)m.pose='wave';__run(30);"),
 ('floors', "if(PHO.on)ptClear();setJob(null);S.bighouse=true;S.home.xf=4;S.home.col='#b79cff';applyHouse();__goto('city');" + LANEJS + "P.x=d[0]-Math.sin(d[2])*16;P.z=d[1]-Math.cos(d[2])*16;P.yaw=d[2]+Math.PI;P.pitch=.42;"),
 ('colour', "S.bighouse=false;S.home.xf=0;S.home.col='#ff9ec4';applyHouse();__goto('city');" + LANEJS + "P.x=d[0]-Math.sin(d[2])*9-Math.cos(d[2])*3;P.z=d[1]-Math.cos(d[2])*9+Math.sin(d[2])*3;P.yaw=Math.atan2(-(d[0]-P.x),-(d[1]-P.z));P.pitch=.12;"),
 ('petshop', "__goto('pets');P.z=LOC.pets.oz+UPZ+1.3;P.x=LOC.pets.ox-.4;P.yaw=0;P.pitch=.12;"),
 ('furniture', FURN + "__goto('home');rebuildHome();__setClock(null,11);P.x=LOC.home.ox+.6;P.z=LOC.home.oz+3.6;P.yaw=0;P.pitch=-.08;"),
]
HOLS = [('2026-02-14T12:00:00', 'valentine', "__goto('city');__setClock(null,12);wxForce('sun');__run(60);" + look(-17, -5.5, -19.6, -12.6, .05)),
        ('2027-03-20T12:00:00', 'easter', "__goto('city');__setClock(null,12);wxForce('sun');__run(30);const t=LOC.city.inter.find(t=>t.hol&&t.icon==='🐰');if(t){P.x=t.x+1.2;P.z=t.z+4.2;P.yaw=Math.atan2(-(t.x-P.x),-(t.z-P.z));P.pitch=.06;}")]
async def shot(g, key, pics):
    p = await g.shot(key, both=False); pics[key] = [p, None]; print(key, p, flush=True)
async def main():
    pics = {}
    async with Run('bk4', OUT) as run:
        g = await run.open(fake_date_build(NEW, '2026-06-16T12:00:00'), 'web', 'ipad-landscape', 'light', 'bk4', save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(4)
        for key, js in PLACES:
            await g.ev("(js)=>{try{eval(js);}catch(e){console.error('spot',e);}}", js); await g.step(12); await g.wait(500); await g.step(6)
            await shot(g, key, pics)
        print('errors', g.errors[:3], flush=True); await run.close(g)
        for iso, key, js in HOLS:
            g = await run.open(fake_date_build(NEW, iso), 'web', 'ipad-landscape', 'light', 'bk4-' + key, save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(4)
            await g.ev("(js)=>{try{eval(js);}catch(e){console.error('spot',e);}}", js); await g.step(14); await g.wait(600); await g.step(6)
            await shot(g, key, pics); await run.close(g)
        # the party and the dance-off: two players, the host on an iPad
        base = json.loads(json.dumps(save))
        A_save = dict(base, name='ZZTEST-HOSTA', coins=900, px=-17, pz=-4.6); A_save.pop('hp', None); A_save.pop('rsvp', None)
        A_save['home'] = dict(base.get('home') or {}); items = [dict(it) for it in (A_save['home'].get('items') or []) if it.get('t') not in ('discofloor', 'discoball')]
        items += [{'u': 'zzdf', 't': 'discofloor', 'c': '', 'x': 0, 'z': 0, 'r': 0, 'f': 0}, {'u': 'zzdb', 't': 'discoball', 'c': '', 'x': 0, 'z': -3.2, 'r': 0, 'f': 0, 'on': 1}]
        A_save['home']['items'] = items
        B_save = dict(base, name='Mia', coins=100, px=-15.5, pz=-4.6)   # (a friend's name in the book's picture, not a test name); B_save.pop('hp', None); B_save.pop('rsvp', None)
        B_save['look'] = dict(base.get('look') or {}, hair='#ffd45c', top='#7cc8ff', style='ponytail')
        A = await begin(run, NEW, 'ipad-landscape', 'bk4-A', A_save); B = await begin(run, NEW, 'pc-1366', 'bk4-B', B_save); P2 = (A, B)
        noon = await A.ev("()=>msAt(clockNow().day,12)")
        for x in P2: await x.ev("(ms)=>__clockMs(ms)", noon); await x.ev("()=>__goto('city')")
        await until(P2, A, "()=>MP.peers.size>=1")
        await A.ev("()=>{const mb=CUR.inter.find(q=>/Mailbox/.test(typeof q.label==='function'?q.label():q.label));if(mb){P.x=mb.x;P.z=mb.z+1.3;P.yaw=0;}__run(3);hpMailMenu();}"); await A.step(2)
        await A.tap('#card [data-a="hpplan"]'); await A.step(2); await A.tap('#card [data-a^="hpset:"]'); await A.step(3)
        hp = await A.ev("()=>S.hp?{id:S.hp.id,at:S.hp.at}:null")
        await until(P2, B, "()=>(!!$('hpCard')&&!$('hpCard').hidden)"); await asyncio.sleep(.5); await B.tap('#hpYes'); await both(P2, 6, .3)
        await until(P2, A, "()=>!!(S.rsvpIn&&Object.values(S.rsvpIn).some(v=>v===1))", 20)
        for x in P2: await x.ev("(ms)=>__clockMs(ms)", hp['at'] + 1500)
        await A.ev("()=>__goto('home')"); await both(P2, 6, .3)
        ap = await B.ev("()=>{const a=[...MP.peers.values()].find(q=>q.nm==='ZZTEST-HOSTA');return a?a.peer:null;}")
        await B.ev("(p)=>goKnock(p)", ap); await asyncio.sleep(.6); await both(P2, 6, .3); await asyncio.sleep(.5); await both(P2, 6, .3)
        await until(P2, B, "()=>CUR.id==='visit'&&VIS.st==='in'&&!fading", 40)
        await both(P2, 8, .3)
        await A.ev(CLEAN); await A.ev("()=>{const f=dnFloor();P.x=f.x-1.6;P.z=f.z-3.0;P.yaw=Math.atan2(-(f.x+.4-P.x),-(f.z+3.5-P.z));P.pitch=.0;}"); await both(P2, 10, .3); await A.wait(400); await A.step(4)
        await shot(A, 'party', pics)
        await A.ev("()=>{const f=dnFloor();P.x=f.x+.4;P.z=f.z+.4;__run(3);TARGET=findTarget();useTarget();}"); await both(P2, 4, .3)
        await until(P2, B, "()=>(!!$('dnCard')&&!$('dnCard').hidden)", 30); await B.tap('#dnYes'); await both(P2, 4, .3)
        print('dance on', await until(P2, A, "()=>DANCE.on", 30) and await until(P2, B, "()=>DANCE.on", 20), flush=True)
        NEXT = "(k)=>{const q=DANCE.pat.filter(a=>!a.j);if(!q.length)return null;const a=q[0];while(DANCE.t<a.t-.03)__run(1);return {d:a.d};}"
        for i in range(8):
            na = await A.ev(NEXT, 1); nb = await B.ev(NEXT, 0)
            if not na or not nb: break
            await A.ev("(d)=>dnPress(d)", na['d']); await B.ev("(d)=>dnPress(d)", nb['d']); await both(P2, 3, .12)
        await A.ev("()=>__run(3)"); await shot(A, 'dance', pics)
        print('errors', A.errors[:2], B.errors[:2], flush=True); await run.close(A); await run.close(B)
    json.dump(pics, open(os.path.join(OUT, 'pics.json'), 'w'), indent=1); print('pictures', len(pics))
asyncio.run(main())
