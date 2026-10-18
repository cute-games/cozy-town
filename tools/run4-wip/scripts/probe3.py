import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW=open('/home/user/cozy-town/index.html','rb').read()
save=json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
CLEAN="()=>{S.name='Cozy Kid';S.coins=900;S.job=null;jobHud(true);const st=document.createElement('style');st.textContent='#busTip{display:none!important}';document.head.appendChild(st);}"
def look(x,z,tx,tz,pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
SETS=[
 ('2026-12-20T12:00:00','ipad-landscape','light',[
   ('santa-front',"__goto('city');__setClock(null,12);wxForce('sun');const t=LOC.city.inter.find(t=>t.hol&&t.icon==='🎅');P.x=t.x+.3;P.z=t.z+3.0;P.yaw=Math.atan2(-(t.x-P.x),-(t.z-P.z));P.pitch=.1;__run(60);"),
   ('xmas-tree-lights',"__goto('city');"+look(-17,-5,-19.6,-12.6,.15)),
   ('calendar-dec',"openPhone('cal');")]),
 ('2026-10-20T12:00:00','ipad-landscape','light',[
   ('tp-start',"closePanel();__goto('treepark');"+look(0,-1000+22.5,0,-1000+10,.0)),
   ('tp-easy-marker',"__goto('treepark');tpStart('easy');__run(30);const d=TP.decks.find(q=>q.path==='easy'&&q.i===1);P.yaw=Math.atan2(-(d.x-P.x),-(d.z-P.z));P.pitch=.1;"),
   ('tp-finish-bell',"const d=TP.decks.find(q=>q.path==='medium'&&q.fin);P.x=d.x+.6;P.z=d.z+1.0;P.cy=d.h;P.yaw=Math.atan2(-((d.x-.85)-P.x),-(d.z-P.z));P.pitch=.15;TP.last=d;"),
   ('house-paint',"__goto('city');openHousePaint();"),
   ('calendar-oct',"closePanel();openPhone('cal');"),
   ('dance-hud-ipad',"closePanel();__goto('home');DANCE.partnerNm='Leo';DANCE.r='rx';DANCE.pat=dnPattern('rx').map(q=>({t:q.t,d:q.d,j:0}));DANCE.sc=45;DANCE.osc=30;DANCE.bar=.56;DANCE.t=6.2;DANCE.on=true;dnHud(true);dnHudTick();document.body.classList.add('dancing');"),
   ('stage-balloons',"$('dnHud').hidden=true;document.body.classList.remove('dancing');DANCE.on=false;__goto('city');"+look(-30,16,-37.8,22,.1)),
   ('stairs-rail',"__goto('home');S.bighouse=true;S.home.xf=4;applyHouse();P.x=LOC.home.ox-HOMEW+1.2;P.z=LOC.home.oz;P.yaw=Math.PI/2;P.pitch=-.1;")]),
 ('2026-10-20T12:00:00','iphone-portrait','light',[
   ('dance-hud-phone',"__goto('home');DANCE.partnerNm='Leo';DANCE.r='rx';DANCE.pat=dnPattern('rx').map(q=>({t:q.t,d:q.d,j:0}));DANCE.sc=45;DANCE.osc=30;DANCE.bar=.56;DANCE.t=6.2;DANCE.on=true;dnHud(true);dnHudTick();document.body.classList.add('dancing');"),
   ('house-paint-phone',"$('dnHud').hidden=true;document.body.classList.remove('dancing');DANCE.on=false;__goto('city');openHousePaint();")]),
 ('2026-04-10T12:00:00','ipad-landscape','light',[
   ('egg-close',"__goto('city');__setClock(null,12);wxForce('sun');const e=HOL.eggs[3];P.x=e.x+.9;P.z=e.z+2.0;P.yaw=Math.atan2(-(e.x-P.x),-(e.z-P.z));P.pitch=.38;"),
   ('calendar-easter',"openPhone('cal');")]),
]
async def main():
    async with Run('p3','/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/probe3') as run:
        for iso,prof,theme,spots in SETS:
            fb=fake_date_build(NEW,iso); g=await run.open(fb,'web',prof,theme,f'{prof}-{iso[5:7]}',save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(4)
            for name,js in spots:
                await g.ev("()=>{$('note').hidden=true;const t=$('toast');if(t)t.classList.remove('show');}")
                await g.ev("(js)=>{try{eval(js);}catch(e){console.error('spot',e);}}",js)
                for _ in range(6):
                    await g.step(4); await g.wait(60)
                    if not await g.ev("()=>fading||!!CLIMB"): break
                await g.wait(500); await g.step(6); p=await g.shot(name,both=False); print(os.path.basename(p))
            print(prof,iso[:10],'errors',g.errors[:4]); await run.close(g)
asyncio.run(main())
