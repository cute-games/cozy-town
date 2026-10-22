"""Run 4 finish, pass 12: how each outfit piece sits on each pet kind (the duck and the owl borrowed the bunny's and the cat's sizes).
Renders every kind with each back, neck, head and face piece, from the front-left and the back-right, into one sheet per kind.
usage: python3 probe_petfit.py OUTDIR FILE [kinds] [accs]"""
import asyncio, base64, io, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
from PIL import Image, ImageDraw
OUT, FILE = sys.argv[1:3]; os.makedirs(OUT, exist_ok=True)
KINDS = (sys.argv[3] if len(sys.argv) > 3 else 'duck,owl,cat,bunny').split(',')
ACCS = (sys.argv[4] if len(sys.argv) > 4 else 'cape,bpack,wings,collar,scarf,bowtie,hat,tophat,pcrown,flowerc,pflower,bow,shades,hglasses,monocle').split(',')
JS = """([kind,acc])=>{const T=PET_TYPES[kind]||{};const col=(T.cols||['#c49a74'])[0];const out=[];
  for(const [ax,ay,az] of [[-1.1,.55,1.25],[1.25,.7,-1.05]]){const sc=shotScene(),m=makePet(kind,col);if(acc!=='none')addAcc(m,acc);sc.add(m.root);m.root.updateMatrixWorld(true);
    const b=new THREE.Box3().setFromObject(m.root),ct=b.getCenter(new THREE.Vector3()),r=b.getSize(new THREE.Vector3()).length()/2;
    const cam=new THREE.PerspectiveCamera(30,1,.02,30);cam.position.copy(ct).addScaledVector(new THREE.Vector3(ax,ay,az).normalize(),r/Math.sin(15*Math.PI/180)*1.05);cam.lookAt(ct);out.push(offShot(sc,cam,200,200,0xfff7ee));}
  return out;}"""
async def main():
    save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
    async with Run('pfit', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'pfit', save=save); await start_from_save(g); await g.ev(INSTR)
        for kind in KINDS:
            cols = ['none'] + ACCS; sheet = Image.new('RGB', (len(cols) * 102, 2 * 102 + 16), 'white'); d = ImageDraw.Draw(sheet)
            for i, acc in enumerate(cols):
                urls = await g.ev(JS, [kind, acc])
                for j, u in enumerate(urls):
                    im = Image.open(io.BytesIO(base64.b64decode(u.split(',', 1)[1]))).convert('RGB').resize((100, 100))
                    sheet.paste(im, (i * 102, 16 + j * 102))
                d.text((i * 102 + 3, 2), acc, fill=(60, 40, 90))
            p = os.path.join(OUT, f'fit-{kind}.png'); sheet.save(p); print(kind, p, flush=True)
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
