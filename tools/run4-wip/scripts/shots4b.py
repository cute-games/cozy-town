"""Stage 3, PHOTOGRAPHER part 2: faked holiday dates (Valentine's, the Easter month, December, New Year, 1 Sep), Halloween at night,
the sleep screen, job steps (the hairstylist's customer card, a delivery on the way), and two ZZTEST players together.
usage: python3 shots4b.py OUTDIR [tags]   (tags: a comma list of set tags, and "two" for the two-player part; default all)"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
OUT = sys.argv[1]
CLEAN = "()=>{S.name='Cozy Kid';S.coins=900;S.job=null;jobHud(true);const st=document.createElement('style');st.textContent='#busTip{display:none!important}';document.head.appendChild(st);for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.mode='away';}"
WALK = "for(const w of WALKERS)if(Math.hypot(w.x-P.x,w.z-P.z)<9){w.x=WP[w.home][0];w.z=WP[w.home][1];w.node=w.home;w.prev=-1;}for(const q of PET_ACTORS){const f=P.yaw;q.x=P.x+Math.sin(f)*2.5;q.z=P.z+Math.cos(f)*2.5;}for(const c of CARS)if(Math.hypot(c.x-P.x,c.z-P.z)<16){c.d+=c.total/2;carPlace(c);}"
LANEJS = "laneRefresh(true);__run(2);const j=LANE.own?LANE.own.findIndex(o=>o&&o.k===laneMe()):-1;const d=((j>=0?LOC.city.lane[j]:null)||LOC.city.lane[LANE.mine]||LOC.city.lane[0]).door;"
STAGE = "const ws=WALKERS.filter(w=>w.state==='out').slice(0,3),f=P.yaw,at=(i,o)=>[P.x-Math.sin(f)*3.6+Math.cos(f)*((i-1)*1.1+o),P.z-Math.cos(f)*3.6-Math.sin(f)*((i-1)*1.1+o)];let off=0;for(const o of[0,-.6,.6,-1.2,1.2,-1.8,1.8,-2.4,2.4])if([0,1,2].every(i=>!onRoad(...at(i,o)))){off=o;break;}ws.forEach((w,i)=>{[w.x,w.z]=at(i,off);w.wait=9;w.face=f;w.g.rotation.y=f;w.g.position.set(w.x,0,w.z);});"   # three townsfolk pose in front of the camera (their hats are the subject); pass 10: the row shifts sideways until none of them stands on the road (one stood in the car lane)
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
RESET = "()=>{$('note').hidden=true;const t=$('toast');if(t)t.classList.remove('show');if($('zzScr')&&!$('zzScr').hidden&&$('zzUp'))$('zzUp').click();}"
BED = ("__setClock(null,22.0);__goto('home');__run(2);if(![...HOME_ITEMS.values()].some(r=>FURN[r.it.t].use==='sleep')){S.home.items.push({u:'zzbed',t:'bed',c:'#ff9ec4',x:-4.6,z:-3.85,r:0});rebuildHome();}"
       "const rec=[...HOME_ITEMS.values()].find(r=>FURN[r.it.t].use==='sleep');if(rec){P.x=rec.g.position.x+1;P.z=rec.g.position.z;rec.inter.act();__run(40);}")
HAIR = "S.hsTut=1;setJob('hair');closePanel();__goto('salon');__setClock(null,12);"
DLV = "S.tutDone=1;setJob('delivery');closePanel();__goto('city');__setClock(null,12);const dd=DOORS.pizza.city;P.x=dd[0]+Math.sin(dd[2]+Math.PI)*6;P.z=dd[1]+Math.cos(dd[2]+Math.PI)*6;P.yaw=dd[2];P.pitch=.05;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR,solids());"   # (pass 12: out of a car standing there too, as walking would keep you; the town was one flat colour and a dark band)
# a set: tag, the faked real date, theme, spots (name, js, note[, wait-for js[, then js]])
SETS = [
 ('valentine', '2026-02-14T12:00:00', 'light', [
   ('holiday-valentine-from-gate', "__goto('city');__setClock(null,12);wxForce('sun');__run(60);" + look(-17, -5.5, -19.6, -12.6, .05), "the Flower Corner on Valentine's from the open gate: the heart fountain and petals"),
   ('holiday-valentine-inside', "__goto('city');" + look(-14.5, -16.5, -19.6, -12.6, .05), "inside the Valentine's corner"),
   ('holiday-valentine-phone-calendar', "openPhone('cal');", "the phone's calendar in February")]),
 ('easter', '2026-04-10T12:00:00', 'light', [
   ('holiday-easter-bunny', "__goto('city');__setClock(null,12);wxForce('sun');const t=LOC.city.inter.find(t=>t.hol&&t.icon==='🐰');if(t){P.x=t.x+1.5;P.z=t.z+4;P.yaw=Math.atan2(-(t.x-P.x),-(t.z-P.z));P.pitch=.08;}", 'the Easter Bunny at the Flower Corner'),
   ('holiday-easter-bunny-talk', "const t=LOC.city.inter.find(t=>t.hol&&t.icon==='🐰');if(t)t.act();", "the Easter Bunny's words"),
   ('holiday-easter-egg', "closePanel();__goto('city');const e=HOL.eggs&&HOL.eggs[3];if(e){P.x=e.x+.9;P.z=e.z+2.1;P.yaw=Math.atan2(-(e.x-P.x),-(e.z-P.z));P.pitch=-.36;}", 'a hunt egg somewhere in town'),
   ('holiday-easter-corner', "__goto('city');" + look(-17, -5.5, -19.6, -12.6, .05), 'the Flower Corner in the Easter month from the gate')]),
 ('christmas', '2026-12-20T12:00:00', 'light', [
   ('holiday-christmas-tree', "__goto('city');__setClock(null,12);wxForce('sun');__run(60);" + look(-17, -3, -19.6, -12.6, .16), 'the Christmas tree at the Flower Corner from the gate'),
   ('holiday-christmas-santa', "__goto('city');const t=LOC.city.inter.find(t=>t.hol&&t.icon==='🎅');if(t){const dx=t.x-HOL_SPOT[0],dz=t.z-HOL_SPOT[1],l=Math.hypot(dx,dz)||1;P.x=t.x+dx/l*3.8;P.z=t.z+dz/l*3.8;P.yaw=Math.atan2(-(t.x-P.x),-(t.z-P.z));P.pitch=.06;}", 'Santa at the Flower Corner (the tree behind him)'),
   ('holiday-christmas-santa-talk', "const t=LOC.city.inter.find(t=>t.hol&&t.icon==='🎅');if(t)t.act();", "Santa's words"),
   ('holiday-christmas-park', "closePanel();__goto('city');" + look(-22, 9.0, -22, 19, .06) + WALK, 'the park in December (the big tree moved to the corner)')]),
 ('christmas-night', '2026-12-20T21:30:00', 'dark', [
   ('holiday-christmas-tree-night', "__goto('city');__setClock(null,21.5);wxForce('snow');" + look(-17, -4, -19.6, -12.6, .12), 'the Christmas tree at night in snow'),
   ('holiday-christmas-lane-night', "__goto('city');__run(60);" + LANEJS + "P.x=d[0]-Math.sin(d[2])*9;P.z=d[1]-Math.cos(d[2])*9;P.yaw=d[2]+Math.PI;P.pitch=.12;", 'my house on Friends Lane on a December night')]),
 ('newyear-night', '2026-12-30T21:30:00', 'dark', [
   ('holiday-newyear-fireworks', "__goto('city');__setClock(null,21.6);wxForce('sun');" + look(-16, 12.5, -22, 30, .5) + "updateCamera(0);__run(420);", 'fireworks over the park on 30 Dec'),   # (pass 8: turn first, then wait: the bursts go off where you look)
   ('holiday-newyear-fireworks-2', look(10, 20, 10, 40, .55) + "updateCamera(0);__run(200);", 'fireworks from the main road')]),
 ('newyear-day', '2026-12-31T12:00:00', 'light', [
   ('holiday-newyear-hats', "__goto('city');__setClock(null,12);wxForce('sun');__run(60);" + look(-8.5, 1.5, -16.2, 7.6, .02) + STAGE, 'party hats and confetti on 31 Dec: townsfolk by the bus stop'),
   ('holiday-newyear-hats-stage', "__goto('city');" + look(-26.5, 10.4, -33.6, 19.4, .08) + STAGE, 'party hats at the Pet Show corner'),
   ('holiday-newyear-hats-close', "__goto('city');" + look(-22, 9.0, -22, 19, .0) + STAGE, 'party hats close up at the fountain')]),
 ('school', '2026-09-01T12:00:00', 'light', [
   ('holiday-school-front', "__goto('city');__setClock(null,12);wxForce('sun');__run(200);" + look(-25, -47, -25, -58, .08) + WALK, 'the school front on 1 Sep: balloons and the banner'),
   ('holiday-school-inside', "__goto('school');__setClock(null,12);", 'inside the school on 1 Sep')]),
 ('halloween-night', '2026-10-20T19:30:00', 'dark', [
   ('halloween-spooky-gate', "__goto('city');__setClock(null,19.5);wxForce('sun');__run(30);" + look(-17, -1.0, -17, -9, .05) + WALK, 'the spooky path gate after 18:00'),   # (pass 9: your pets a step behind you, as in the town views)
   ('halloween-spooky-inside', "__goto('city');" + look(-17.2, -12.0, -19.6, -15.9, -.05), 'on the spooky path (it starts where the stepping stones end)'),
   ('halloween-ghosts-square', "__goto('city');" + look(-22, 9.0, -22, 19, .1) + WALK, 'the square at night with the little ghosts'),
   ('halloween-ghosts-lane', "__goto('city');" + look(-80, 9, -97, 9.4, .05), 'Friends Lane at night in October'),
   ('halloween-clothes-costumes', "__goto('clothes');__setClock(null,19.5);const t=LOC.clothes.inter.find(q=>/shop|buy|clothes/i.test(typeof q.label==='function'?q.label():q.label||''));if(t)t.act();", 'the Clothes Shop card in October: the costumes')]),
 ('jobs', '2026-10-20T12:00:00', 'light', [
   ('job-sleep-screen', BED, 'in bed at 22:00: the sleep screen', None, None, 1400),
   ('job-hair-card', HAIR, "the hairstylist's customer card at the salon", "()=>!!(HS.cust&&HS.cust.sat)", "()=>{const t=LOC.salon.inter.find(t=>t.hs);if(t){P.x=t.x;P.z=t.z;t.act();const c=HS.cust;if(c){const dx=c.x-t.x,dz=c.z-t.z,d=Math.hypot(dx,dz)||1;P.x=t.x-dx/d*.9+dz/d*.9;P.z=t.z-dz/d*.9-dx/d*.9;[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);P.yaw=Math.atan2(-(c.x-P.x),-(c.z-P.z));P.pitch=-.08;}}}"),
   ('job-delivery-way', DLV + "dl().wait=1e9;if(!dl().o)newOrder();pickUp();closePanel();toastOff();", 'a pizza delivery on the way: the job box and the corner map', "()=>!!(dl().o&&dl().o.st==='carry')", None),   # (pass 6: the order is made and picked up; pass 5 never started one; pass 11: Chef Blaze's card is closed, as on the way: in the pizzeria the timer waits for it, in the street it ran under it)
   ('job-delivery-note', "closePanel();dl().o=null;newOrder();", 'the delivery message', "()=>!$('note').hidden||!!document.querySelector('#toast.show')", None)]),
]

async def shoot(g, name, js, note, themap, prof, theme, waitfor=None, then=None, keep_note=False, extra=0):
    try:
        if not keep_note: await g.ev(RESET)
        if js: await g.ev("(js)=>{try{eval(js);}catch(e){console.error('spot',e);}}", js)
        if waitfor:
            for _ in range(40):
                await g.step(20); await g.wait(60)
                if await g.ev(waitfor): break
            if then: await g.ev(then)
        for _ in range(6):
            await g.step(4); await g.wait(60)
            if not await g.ev("()=>fading||!!CLIMB"): break
        await g.wait(900 + extra); await g.step(6)
        p = await g.shot(name, both=False)
        st = await g.ev("()=>({loc:CUR&&CUR.id,x:+P.x.toFixed(1),z:+P.z.toFixed(1),yaw:+P.yaw.toFixed(2),time:clockStr(S.time),wx:WX.cur,open:UI.open,hol:HOL.cur,date:realDate().toISOString().slice(0,10)})")
        themap.append(dict(name=name, prof=prof, theme=theme, note=note, file=os.path.basename(p) if p else None, **st))
    except Exception as e:
        themap.append(dict(name=name, prof=prof, theme=theme, note=note, error=repr(e)[:200]))

TAGS = sys.argv[2].split(',') if len(sys.argv) > 2 else None
async def main():
    os.makedirs(OUT, exist_ok=True); themap = []
    async with Run('s3b', OUT) as run:
        for tag, iso, theme, spots in SETS:
            if TAGS and tag not in TAGS: continue
            fb = fake_date_build(NEW, iso); prof = 'ipad-landscape'
            g = await run.open(fb, 'web', prof, theme, f'{tag}-{theme}', save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(4)
            for sp in spots:
                name, js, note = sp[:3]; waitfor = sp[3] if len(sp) > 3 else None; then = sp[4] if len(sp) > 4 else None; extra = sp[5] if len(sp) > 5 else 0
                await shoot(g, name, js, note, themap, prof, theme, waitfor, then, keep_note=(name == 'job-delivery-note'), extra=extra)
            print(tag, 'errors', g.errors[:3], flush=True); await run.close(g)
        if TAGS and 'two' not in TAGS:
            json.dump(themap, open(os.path.join(OUT, 'map.json'), 'w'), indent=1); print('pictures', len(themap), 'map at', os.path.join(OUT, 'map.json')); return
        # two ZZTEST players together, in the same fake room
        fb = fake_date_build(NEW, '2026-10-20T12:00:00')
        s1 = json.loads(json.dumps(save)); s2 = json.loads(json.dumps(save)); s2['name'] = 'ZZTEST-Two'
        A = await run.open(fb, 'web', 'ipad-landscape', 'light', 'two-A', save=s1); await start_from_save(A); await A.ev(INSTR); await A.ev(CLEAN); await A.step(4)
        B = await run.open(fb, 'web', 'pc-1366', 'light', 'two-B', save=s2); await start_from_save(B); await B.ev(INSTR); await B.ev(CLEAN); await B.ev("()=>{S.name='ZZTEST-Two';}"); await B.step(4)
        await A.ev("()=>{__goto('city');__setClock(null,12);wxForce('sun');" + look(-23.2, 7.6, -20.2, 9.8, .02) + "}")   # (pass 9: both on the open square; the PC view was boxed in by a tree and the Ideas Board)
        await B.ev("()=>{__goto('city');__setClock(null,12);wxForce('sun');" + look(-20.2, 9.8, -23.2, 7.6, .02) + "}")
        for _ in range(30):
            await A.step(6); await B.step(6); await asyncio.sleep(.12)
        seen = await A.ev("()=>[...MP.peers.values()].map(p=>({nm:p.nm,x:p.x,z:p.z,v:p.v}))")
        print('A sees', seen, flush=True)
        await shoot(A, 'two-players-ipad', "", 'two players face to face at the fountain (iPad view; the other is ZZTEST-Two on a PC)', themap, 'ipad-landscape', 'light')
        await shoot(B, 'two-players-pc', "", 'the same moment from the PC player', themap, 'pc-1366', 'light')
        await A.ev("()=>{openPhone('mp');}"); await A.step(4); await A.wait(300)
        await shoot(A, 'two-players-friends-list', "", 'the friends list with the other player online', themap, 'ipad-landscape', 'light')
        await run.close(A); await run.close(B)
    json.dump(themap, open(os.path.join(OUT, 'map.json'), 'w'), indent=1); print('pictures', len(themap), 'map at', os.path.join(OUT, 'map.json'))
asyncio.run(main())
