"""Run 4 finish, f10: checks by script on one game file: the clock chip against the rain streaks, the park garland's pieces against the bus
shelter, a photo shoot whose result card goes another way (the phone opened over it), the quests over 200 days, the Pet Shop's owl over
many frames; pictures of the garland at Halloween from the front and the park side.
usage: python3 probe_f10js.py OUTDIR FILE TAG"""
import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
OUT, FILE, TAG = sys.argv[1:4]; os.makedirs(OUT, exist_ok=True)
CHIP = """()=>{const keep={rain:WX.rain,snow:WX.snow,sky:WX.sky},o=[];for(const r of[.3,.4,.5,.55,.6,.7,.85,1]){WX.rain=r;WX.snow=0;WX.sky=1;o.push(r+':'+skyIc()+' (streaks '+Math.round(Math.max(0,(r-.3)/.7)*100)+'%)');}Object.assign(WX,keep);return o.join('  ');}"""
GARL = """()=>{__goto('city');const sx0=-18.25,sx1=-14.15,o=[];let bad=0;for(const p of HOL.pieces)if(p.k==='garland'&&p.hang){const [[x1,,z1],[x2,,z2]]=p.hang;if(Math.abs(z1-8.3)<.01&&Math.abs(z2-8.3)<.01){o.push(x1.toFixed(1)+'..'+x2.toFixed(1));const lo=Math.min(x1,x2),hi=Math.max(x1,x2);if(hi>sx0-.2&&lo<sx1+.2)bad++;}}return {hol:HOL.cur,n:HOL.n,pieces:HOL.pieces.length,parkLine:o,overShelter:bad};}"""
SHOOT = """async()=>{__goto('city');__setClock(null,12);setJob('photo');S.ptTut=1;const d=pt();if(!d.o)ptNew();const o=d.o;if(!o)return 'no booking';const sp=PT_SPOTS[o.spot];P.x=sp.at[0];P.z=sp.at[1]-1.2;__run(3);ptSetup();for(const m of PHO.group)if(m.kind==='person')m.pose='smile';__run(10);
  ACT.ptsnap();__run(3);const res=!!document.querySelector('#card [data-a="ptbye"]');openPhone('msg','pc');__run(6);
  const job=$('job'),pad=$('pad');return {resultCard:res,phoneOpen:!!document.querySelector('#card .ph-screen'),shootOn:!!PHO.on,shootClass:document.body.classList.contains('shoot'),jobShown:!!job&&getComputedStyle(job).visibility!=='hidden'&&!job.hidden,padShown:!!pad&&getComputedStyle(pad).visibility!=='hidden',booking:!!pt().o};}"""
SHOOT_BYE = """()=>{closePanel();const d=pt();d.wait=0;__run(3);if(!d.o)ptNew();const o=d.o;if(!o)return 'no booking';const sp=PT_SPOTS[o.spot];P.x=sp.at[0];P.z=sp.at[1]-1.2;__run(3);ptSetup();for(const m of PHO.group)if(m.kind==='person')m.pose='smile';__run(10);
  ACT.ptsnap();__run(30);const still=!!document.querySelector('#card [data-a="ptbye"]')&&!!PHO.on;ACT.ptbye();__run(3);return {cardStaysUntilBye:still,afterBye:{shootOn:!!PHO.on,shootClass:document.body.classList.contains('shoot'),open:UI.open}};}"""
QUESTS = """()=>{const keepDay=S.day,keepQ=JSON.stringify(S.q||null),keepH=JSON.stringify(S.qhist||[]);let rawEat=0,rawSpree=0,cand=0,days=0;
  for(let dd=0;dd<200;dd++){const r=seeded((keepDay+dd)*97+13);const C=questCandidates(r,false);cand+=C.simple.length+C.tricky.length;rawEat+=C.simple.filter(k=>k==='eat:flour'||k==='eat:eggs').length;rawSpree+=C.tricky.filter(k=>/^trk:spree:/.test(k)&&/(^|[:|])(flour|eggs)(\\||$)/.test(k)).length;days++;}
  const old=questCandidates(seeded(1),true);S.q=JSON.parse(keepQ);S.qhist=JSON.parse(keepH);
  return {days,candidatesPerDay:Math.round(cand/days),rawEat,rawSpree,oldVersionKeepsThem:old.simple.includes('eat:flour')};}"""
OWL = """()=>{__goto('pets');const L=LOC.pets;const a=PEN.find(q=>q.t==='owl');if(!a)return 'no owl';let zs=new Set(),flo=0,n=0,stopFace=[];for(let f=0;f<1500;f++){__run(1);zs.add((a.z-L.oz).toFixed(2));n++;if(!a.moving)stopFace.push(+((a.m.root.rotation.y%6.283+6.283)%6.283).toFixed(2));}
  const pen=a.pen;return {perchZ:pen.pz!==undefined?+(pen.pz).toFixed(2):null,zsSeen:[...zs].slice(0,6),frames:n,facingWhenStopped:[...new Set(stopFace.slice(-200))].slice(0,5)};}"""
async def main():
    save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
    async with Run('pf10', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'pf10-' + TAG, save=save); await start_from_save(g); await g.ev(INSTR)
        for nm, js in (('the chip by rain level', CHIP), ('the park garland at Halloween', GARL), ('a shoot, then the phone over its result card', SHOOT), ('a shoot ended with Bye', SHOOT_BYE), ('quests over 200 days', QUESTS), ('the Pet Shop owl', OWL)):
            try: r = await g.ev(js)
            except Exception as e: r = f'ERROR {e}'
            print(nm, '->', json.dumps(r, ensure_ascii=False), flush=True)
        await g.ev("()=>{closePanel();__goto('city');__setClock(null,12);wxForce('sun');P.x=-16.2;P.z=1.4;P.yaw=Math.PI;P.pitch=.05;for(const w of WALKERS)if(Math.hypot(w.x-P.x,w.z-P.z)<9){w.x=WP[w.home][0];w.z=WP[w.home][1];}}"); await g.step(12); await g.wait(500); await g.step(4)
        await g.shot(f'garland-front-{TAG}', both=False)
        await g.ev("()=>{P.x=-20.6;P.z=10.2;P.yaw=Math.atan2(-(-16.2-P.x),-(8.3-P.z));P.pitch=.22;}"); await g.step(12); await g.wait(500); await g.step(4)
        await g.shot(f'garland-side-{TAG}', both=False)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
