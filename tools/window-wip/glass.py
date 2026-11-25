"""glass proof: glass.py KIT GAME OUT TAG : same views for a build; then `glass.py join OUT` makes before/after pairs"""
import asyncio, json, os, sys, io
from PIL import Image, ImageDraw
if sys.argv[1] == 'join':
    O = sys.argv[2]
    for n in ['petshop-top_day', 'house-yard_day', 'flats-park_day', 'petshop-top_night']:
        a, b = Image.open(f'{O}/raw/before_{n}.png'), Image.open(f'{O}/raw/after_{n}.png'); sh = Image.new('RGB', (a.width * 2 + 10, a.height + 22), 'white'); sh.paste(a, (0, 22)); sh.paste(b, (a.width + 10, 22))
        d = ImageDraw.Draw(sh); d.text((6, 5), 'BEFORE  ' + n, fill='black'); d.text((a.width + 16, 5), 'AFTER (glass)  ' + n, fill='black'); sh.save(f'{O}/pair_{n}.png')
    for t in ['before', 'after']:
        fr = [Image.open(f'{O}/raw/{t}_step{i}.png').crop((290, 150, 890, 620)) for i in range(3)]; sh = Image.new('RGB', (600 * 3 + 20, 470 + 22), 'white')
        for i, f in enumerate(fr): sh.paste(f, (i * 610, 22))
        ImageDraw.Draw(sh).text((6, 5), t.upper() + ': one house window, the camera steps 0.5 m to the right each frame (and turns to keep the window in the middle)', fill='black'); sh.save(f'{O}/parallax_{t}.png')
    sys.exit()
KIT, NEW, OUT, TAG = sys.argv[1:5]; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
SAVE = json.load(open(os.path.join(KIT, 'fixtures', 'save-pfu6-stage6.json')))
PETUP = """()=>{const L=LOC.pets;const go=(x,z,n)=>{const sx=P.x,sz=P.z;for(let i=1;i<=n;i++){P.x=sx+(L.ox+x-sx)*i/n;P.z=sz+(L.oz+z-sz)*i/n;__run(1);}};
  P.x=L.ox;P.z=L.oz+3.7;P.cy=0;__run(3);for(const q of [[-4.6,4.5,40],[-5.95,4.5,20],[-5.95,2.2,40],[-5.95,-.3,40],[-4.2,-.5,30],[-4.0,-2.2,30],[-2.9,-2.25,30],[3.0,-2.3,60],[4.4,-1.2,30],[4.4,4.6,60],[5.95,4.6,20],[5.95,-.3,80],[4.0,-1.0,30]])go(...q);__run(30);return P.cy;}"""
CLEAN = "()=>{closePanel();$('toast').classList.remove('show');}"
async def main():
    os.makedirs(OUT + '/raw', exist_ok=True)
    async with Run('gl', os.path.join(OUT, 'run-gl-' + TAG)) as run:
        g = await begin(run, open(NEW, 'rb').read(), 'ipad-landscape', 'gl', dict(SAVE, name='ZZTEST-WV'))
        errs = []; g.page.on('pageerror', lambda e: errs.append(str(e)[:300])); g.page.on('console', lambda m: errs.append(m.text[:300]) if m.type == 'error' else None)
        async def snap(n): await g.ev(CLEAN); await g.step(4, True); await g.page.screenshot(path=f'{OUT}/raw/{TAG}_{n}.png'); print(' pic', n)
        for hour, dn in ((12, 'day'), (23, 'night')):
            await g.ev("(h)=>{__goto('pets');__setClock(null,h);}", hour); await g.step(4); await g.ev(PETUP)
            await g.ev("()=>{const L=LOC.pets;P.x=L.ox+1.5;P.z=L.oz-.6;P.yaw=0;P.pitch=.1;}"); await snap('petshop-top_' + dn)
        await g.ev("()=>{__goto('home');__setClock(null,12);}"); await g.step(4)
        await g.ev("()=>{const L=CUR;P.x=L.ox-.8;P.z=L.oz+.2;P.yaw=0;P.pitch=.02;}"); await snap('house-yard_day')
        for i in range(3):
            await g.ev("(i)=>{const L=CUR,x=-2.2+i*.5,z=-1.6;P.x=L.ox+x;P.z=L.oz+z;P.yaw=Math.atan2(-(-3-x),-(-5-z));P.pitch=.0;}", i); await snap('step%d' % i)
        await g.ev("()=>{APT.b='ap3';__goto('apt3');APT.b='ap3';setLoc('apt3');__setClock(null,12);}"); await g.step(4)
        await g.ev("()=>{const L=CUR;P.x=L.ox-6.2;P.z=L.oz+.3;P.yaw=Math.PI/2;P.pitch=.02;}"); await snap('flats-park_day')
        r = await g.ev("""()=>{const out={};for(const id of['home','pets']){__goto(id);__run(5);const L=CUR;P.x=L.ox;P.z=L.oz+1;P.yaw=0;const ts=[];for(let i=0;i<120;i++){window.__t=(window.__t||performance.now())+50;const t=performance.now();frame(window.__t);renderer.getContext().finish();ts.push(performance.now()-t);}ts.sort((a,b)=>a-b);out[id]={median:+ts[60].toFixed(2),p90:+ts[108].toFixed(2),calls:renderer.info.render.calls};}
          const d=[];for(const id of['pets','home','apt3','market','pets','home']){setLoc('city');const t=performance.now();setLoc(id);d.push(+(performance.now()-t).toFixed(1));}out.door_ms=d;return out;}""")
        print('MEASURE', TAG, json.dumps(r)); print('page errors:', errs[:6])
        await run.close(g)
asyncio.run(main())
