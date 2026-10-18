"""Stage 3: try candidate camera spots and make contact sheets. usage: python3 spottest.py OUTDIR"""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
from PIL import Image, ImageDraw
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
CLEAN = "()=>{S.name='Cozy Kid';S.coins=900;S.job=null;jobHud(true);const st=document.createElement('style');st.textContent='#busTip{display:none!important}';document.head.appendChild(st);for(const f of FRIEND_ACTORS)if(f.mode==='follow')f.mode='away';}"
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
WALK = "for(const w of WALKERS)if(Math.hypot(w.x-P.x,w.z-P.z)<9){w.x=WP[w.home][0];w.z=WP[w.home][1];w.node=w.home;w.prev=-1;}"
CITY = "__goto('city');__setClock(null,11);wxForce('sun');"
LANEJS = "__goto('city');laneRefresh(true);__run(2);const j=LANE.own?LANE.own.findIndex(o=>o&&o.k===laneMe()):-1;const lp=(j>=0?LOC.city.lane[j]:null)||LOC.city.lane[LANE.mine]||LOC.city.lane[0];const d=lp.door;window.__lane={mine:LANE.mine,j,n:LOC.city.lane.length,door:d,own:(LANE.own||[]).map(o=>o&&o.k)};"
C = {
 'fountain': [look(-22, 9.0, -22, 19, .06), look(-22, 7.5, -22, 19, .08), look(-18, 7.5, -22.5, 18, .06), look(-26, 7.5, -21.5, 18, .06)],
 'school': [look(-25, -50, -25, -57, .05), look(-25, -47, -25, -58, .08), look(-25, -45, -25, -58, .1)],
 'eastshops': [look(55, -27.5, 64, -32, .05), look(51, -27, 64, -32, .06), look(52, -24, 64, -31, .08)],
 'tpgate': [look(68.6, -38, 74, -38, .05), look(65.5, -38, 74, -38, .08), look(64, -38, 74, -38.5, .1)],
 'petshow': [look(-27.3, 11.45, -33.6, 19.4, .1), look(-26.5, 10.4, -33.6, 19.4, .08), look(-29.5, 12.5, -35.5, 20, .08)],
 'lane6': ["S.bighouse=true;S.home.xf=4;S.home.col='#b79cff';applyHouse();" + LANEJS + "P.x=d[0]-Math.sin(d[2])*12;P.z=d[1]-Math.cos(d[2])*12;P.yaw=d[2]+Math.PI;P.pitch=.38;",
           "S.bighouse=true;S.home.xf=4;S.home.col='#b79cff';applyHouse();" + LANEJS + "P.x=d[0]-Math.sin(d[2])*14;P.z=d[1]-Math.cos(d[2])*14;P.yaw=d[2]+Math.PI;P.pitch=.32;",
           "S.bighouse=true;S.home.xf=4;S.home.col='#b79cff';applyHouse();" + LANEJS + "P.x=d[0]-Math.sin(d[2])*11-Math.cos(d[2])*4;P.z=d[1]-Math.cos(d[2])*11+Math.sin(d[2])*4;P.yaw=Math.atan2(-(d[0]-P.x),-(d[1]-P.z));P.pitch=.4;"],
 'lane1': ["S.bighouse=false;S.home.xf=0;S.home.col='';applyHouse();" + LANEJS + "P.x=d[0]-Math.sin(d[2])*7;P.z=d[1]-Math.cos(d[2])*7;P.yaw=d[2]+Math.PI;P.pitch=.1;"],
 'tpfinish': ["__goto('treepark');const d=TP.decks.find(q=>q.path==='medium'&&q.fin);P.x=d.x+1.0;P.z=d.z+1.1;P.cy=d.h;P.yaw=Math.atan2(-((d.x-.85)-P.x),-(d.z-P.z));P.pitch=.12;TP.last=d;",
              "__goto('treepark');const d=TP.decks.find(q=>q.path==='medium'&&q.fin);P.x=d.x+1.1;P.z=d.z-1.0;P.cy=d.h;P.yaw=Math.atan2(-((d.x-.85)-P.x),-((d.z+.2)-P.z));P.pitch=.1;TP.last=d;",
              "__goto('treepark');const d=TP.decks.find(q=>q.path==='medium'&&q.fin);P.x=d.x+.3;P.z=d.z+1.15;P.cy=d.h;P.yaw=Math.atan2(-((d.x-.85)-P.x),-((d.z-.3)-P.z));P.pitch=.08;TP.last=d;"],
 'hats': ["__goto('city');const ws=WALKERS.filter(w=>w.state==='out').slice(0,3);" + look(-8.5, 1.5, -16.2, 7.6, .02) + "ws.forEach((w,i)=>{const f=P.yaw;w.x=P.x-Math.sin(f)*3.6+Math.cos(f)*(i-1)*1.1;w.z=P.z-Math.cos(f)*3.6-Math.sin(f)*(i-1)*1.1;w.wait=9;w.face=f+Math.PI;w.g.position.set(w.x,0,w.z);});"],
}
INDOORS = ('market','pets','flowers','cafe','clothes','salon','toys','bakery','library','icecream','school','fire','pizza','home')
for k in INDOORS:
    C['in-' + k] = [f"__goto('{k}');__setClock(null,11);__run(2);P.x-=Math.sin(P.yaw)*{s};P.z-=Math.cos(P.yaw)*{s};[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);P.pitch=.02;for(const q of (CUR.shoppers||[]))if(q.g&&Math.hypot(q.x-P.x,q.z-P.z)<3)q.g.visible=false;" for s in (0.6, 1.5, 2.4)]
async def main():
    sheets = {}
    async with Run('spot', OUT) as run:
        fb = fake_date_build(NEW, '2026-10-20T12:00:00')
        for prof, theme in (('ipad-landscape', 'dark'), ('iphone-portrait', 'light')):
            g = await run.open(fb, 'web', prof, theme, f'{prof}-{theme}', save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.ev(CLEAN); await g.step(4)
            keys = list(C) if prof == 'ipad-landscape' else ['school', 'eastshops', 'tpgate', 'petshow', 'fountain']
            for key in keys:
                for i, js in enumerate(C[key]):
                    pre = CITY if not js.startswith('__goto') and 'applyHouse' not in js else ''
                    try:
                        await g.ev("(js)=>{try{eval(js);}catch(e){console.error('spot',e);}}", pre + js + (WALK if 'hats' not in key else ''))
                        for _ in range(8):
                            await g.step(4); await g.wait(80)
                            if not await g.ev("()=>fading||!!CLIMB"): break
                        await g.wait(700); await g.step(6)
                        p = await g.shot(f'{key}-{i}', both=False)
                        if key.startswith('lane'): print(key, prof, await g.ev("()=>JSON.stringify(window.__lane)"), flush=True)
                        sheets.setdefault((prof, key), []).append(p)
                    except Exception as e: print('ERR', key, i, repr(e)[:200], flush=True)
            print(prof, 'errors', g.errors[:4], flush=True); await run.close(g)
    # contact sheets: one per key, thumbnails 420 px wide
    for (prof, key), ps in sheets.items():
        ims = [Image.open(p) for p in ps if p]
        if not ims: continue
        w = 420; hs = [int(im.height * w / im.width) for im in ims]
        sheet = Image.new('RGB', (w * len(ims) + 8 * (len(ims) - 1), max(hs)), 'white'); x = 0
        for im, h in zip(ims, hs): sheet.paste(im.resize((w, h)), (x, 0)); ImageDraw.Draw(sheet).text((x + 6, 6), f'{key} {ps.index(ps[ims.index(im)])}', fill='red'); x += w + 8
        sheet.save(os.path.join(OUT, f'sheet-{prof}-{key}.png'))
    print('sheets', len(sheets))
asyncio.run(main())
