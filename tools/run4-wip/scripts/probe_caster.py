"""Run 4 finish, pass 10 (M-002): which shadow caster draws the dash row on the Tree Park's crown? Binary search: switch off the shadows
of half the casters, render, and see whether the dark dots in the box stay.
usage: python3 probe_caster.py OUTDIR FILE"""
import asyncio, json, os, sys, io
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
from PIL import Image
OUT, FILE = sys.argv[1:3]; os.makedirs(OUT, exist_ok=True)
BOX = (776, 120, 816, 148)   # where the dots sit in the 1180x820 picture
SET = "()=>{__goto('treepark');__setClock(null,11.66);wxForce('sun');tpStart('hard');}"
K = [0]
async def dark(g):
    await g.step(12); await g.wait(500); await g.step(4); K[0] += 1
    p = await g.shot(f'c{K[0]:03d}', both=False); im = Image.open(p).convert('RGB').crop(BOX)
    if REF[0] is None: return 0, im
    a = list(im.getdata()); b = list(REF[0].getdata()); return sum(abs(x[0]-y[0])+abs(x[1]-y[1])+abs(x[2]-y[2]) for x, y in zip(a, b)), im
REF = [None]
async def main():
    save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
    async with Run('pc', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-17')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'pc', save=save); await start_from_save(g); await g.ev(INSTR)
        await g.ev("()=>{const st=document.createElement('style');st.textContent='#toast{display:none!important}';document.head.appendChild(st);}")
        await g.ev(SET); await g.ev("()=>{sun.castShadow=false;}"); _, im1 = await dark(g); im1.resize((400, 280)).save(os.path.join(OUT, 'noshadow.png')); REF[0] = im1; n1 = 0
        await g.ev("()=>{sun.castShadow=true;}"); n0, im0 = await dark(g); im0.resize((400, 280)).save(os.path.join(OUT, 'base.png'))
        print('difference from the shadowless picture: with shadows', n0, flush=True)
        cast = await g.ev("()=>{window.__C=[];scene.traverse(o=>{if(o.isMesh&&o.castShadow&&o.visible)__C.push(o);});return __C.length;}")
        print('casters', cast, flush=True)
        lo, hi = 0, cast   # the culprit is in [lo, hi)
        while hi - lo > 1:
            mid = (lo + hi) // 2
            await g.ev("([a,b])=>{__C.forEach((o,i)=>{o.castShadow=!(i>=a&&i<b);});}", [lo, mid])
            n, _ = await dark(g)
            gone = n <= n0 * .3
            print(f'off [{lo},{mid}) -> diff {n} ({"gone" if gone else "stays"})', flush=True)
            if gone: hi = mid
            else: lo = mid
        info = await g.ev("""(i)=>{const o=__C[i];o.geometry.computeBoundingBox();const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);let p=o,path=[];while(p){path.push((p.name||p.type)+(p.userData&&p.userData.keep?'*':''));p=p.parent;}
          return {i,mat:o.material.color?'#'+o.material.color.getHexString():null,tris:(o.geometry.attributes.position.count/3)|0,min:[b.min.x,b.min.y,b.min.z].map(v=>+v.toFixed(2)),max:[b.max.x,b.max.y,b.max.z].map(v=>+v.toFixed(2)),path:path.slice(0,5)};}""", lo)
        print('culprit', info, flush=True)
        await g.ev("()=>{__C.forEach(o=>o.castShadow=true);}")
        await g.ev("(i)=>{__C[i].castShadow=false;}", lo); n, im = await dark(g); im.resize((400, 240)).save(os.path.join(OUT, 'culprit-off.png')); print('only it off: dark', n)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
