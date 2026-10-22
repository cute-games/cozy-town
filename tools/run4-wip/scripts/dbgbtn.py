import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
BUILD = open('/home/user/cozy-town/index.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
SCAN = """(tag)=>{const out=[];for(const b of document.querySelectorAll('.btn.white')){if(!b.offsetParent&&getComputedStyle(b).position!=='fixed')continue;const cs=getComputedStyle(b);out.push([tag,(b.id||'')+'/'+(b.dataset.a||b.dataset.d||'')+'/'+b.textContent.trim().slice(0,14),cs.fontSize,cs.borderWidth,[...b.classList].join('.')]);}return out;}"""
async def main():
    async with Run('dbtn', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dbtn-run') as run:
        g = await begin(run, BUILD, 'ipad-landscape', 'btn', dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-BTN', job=None))
        rows = []
        for tag, js in (('hud', "__goto('city');"), ('tut', "tutStart();"), ('jobs', "tutEnd();openPhone('msg','ro');ACT.rjob();"), ('mail', "closePanel();hpMailMenu();"), ('plan', "ACT.hpplan();"), ('paint', "closePanel();openHousePaint();"), ('big', "closePanel();openBigHouse();"), ('furn', "closePanel();openPhone('furn');"), ('settings', "closePanel();openSettings();"), ('bag', "closePanel();openBag();"), ('hpcard', "closePanel();MP.peers.set('fp',{peer:'fp',nm:'Mia',av:null});HPT.cur=null;HPT.queue=[{peer:'fp',id:'pid',at:realMs()+60000,h:13,nm:'Mia'}];hpCard();"), ('ptbar', "hpAnswer(false,true);__setClock(null,12);setJob('photo');S.ptTut=1;const d=pt();d.o={id:'px',kind:'family',spot:'park',bg:'fountain',who:['n1','n2','s1'],pet:null,st:'go'};P.x=-22;P.z=11.6;__run(2);ptSetup();")):
            await g.ev("(js)=>{try{eval(js);}catch(e){console.error(e);}}", js); await g.step(3); await g.wait(200)
            rows += await g.ev(SCAN, tag)
        seen = {}
        for r in rows:
            k = (r[2], r[3], r[4]); seen.setdefault(k, []).append(r[0] + ':' + r[1])
        for k, v in sorted(seen.items()): print(k, v[:6])
        await run.close(g)
asyncio.run(main())
