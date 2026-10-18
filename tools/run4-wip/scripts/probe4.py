import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
from PIL import Image
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
CLEAN = "()=>{S.name='Cozy Kid';S.coins=900;S.job=null;jobHud(true);for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.mode='away';}"
SPOTS = {
 'iphone-landscape': [('jobs', "__goto('city');openPhone('msg','ro');ACT.rjob&&ACT.rjob();const sc=document.querySelector('.ph-screen');if(sc)sc.scrollTop=sc.scrollHeight/2;"),
                      ('paint', "closePanel();openHousePaint();"),
                      ('settings', "closePanel();openSettings();"),
                      ('pose', "closePanel();__setClock(null,12);setJob('photo');S.ptTut=1;const d=pt();d.o={id:'px',kind:'family',spot:'park',bg:'fountain',who:['n1','n2','s1'],pet:null,st:'go'};P.x=-22;P.z=10.6;P.yaw=Math.PI;P.pitch=.02;__run(2);ptSetup();ptPoseCard(0);"),
                      ('result', "closePanel();for(const m of PHO.group)m.pose='wave';ACT.ptsnap();")],
 'ipad-landscape': [('settings', "__goto('city');openSettings();"), ('calendar', "closePanel();openPhone('cal');"), ('map', "closePanel();openMap();")],
 'pc-1366': [('map', "__goto('city');openMap();"), ('bag', "closePanel();openBag();")],
 'iphone-portrait': [('calendar', "__goto('city');openPhone('cal');")],
}
async def main():
    shots = []
    async with Run('probe', OUT) as run:
        fb = fake_date_build(NEW, '2026-10-20T12:00:00')
        for prof, spots in SPOTS.items():
            g = await run.open(fb, 'web', prof, 'light', prof, save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(4)
            for name, js in spots:
                await g.ev("(js)=>{try{eval(js);}catch(e){console.error('spot',e);}}", js); await g.step(6); await g.wait(700); await g.step(4)
                p = await g.shot(name, both=False); shots.append((prof, name, p))
                if name == 'jobs': print(prof, name, await g.ev("()=>{const h=document.querySelector('.ph-hd'),s=document.querySelector('.ph-screen');return h&&s?{hTop:Math.round(h.getBoundingClientRect().top),sTop:Math.round(s.getBoundingClientRect().top),scroll:s.scrollTop}:null}"))
                if name in ('settings', 'bag'): print(prof, name, await g.ev("()=>{const c=$('card').getBoundingClientRect(),k=$('stats').getBoundingClientRect();return {cardTop:Math.round(c.top),cardBottom:Math.round(c.bottom),hudBottom:Math.round(k.bottom),H:innerHeight}}"))
            print(prof, 'errors', g.errors[:3], flush=True); await run.close(g)
    w = 420; ims = [Image.open(p) for _, _, p in shots if p]; hs = [int(im.height * w / im.width) for im in ims]
    cols = 3; rows = [ims[i:i + cols] for i in range(0, len(ims), cols)]; rh = [max(int(im.height * w / im.width) for im in r) for r in rows]
    sheet = Image.new('RGB', (cols * (w + 6), sum(rh) + 6 * len(rows)), 'white'); y = 0
    for r, h in zip(rows, rh):
        x = 0
        for im in r: sheet.paste(im.resize((w, int(im.height * w / im.width))), (x, y)); x += w + 6
        y += h + 6
    sheet.save(os.path.join(OUT, 'sheet.png')); print('sheet', sheet.size)
asyncio.run(main())
