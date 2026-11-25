"""pairs: for each case, inside window picture + the wall's painted picture + outside picture from the same spot and height, as one image.
pair.py KIT GAME OUT   (cases below; ONLY=a,b picks some)"""
import asyncio, json, os, sys, base64, io, math
KIT, NEW, OUT = sys.argv[1:4]; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
from PIL import Image, ImageDraw
SAVE = json.load(open(os.environ.get('SAVE') or os.path.join(KIT, 'fixtures', 'save-pfu6-stage6.json')))
HOOK = r"""()=>{window.__pv=[];const f=paneView;paneView=function(x,ci,lv,vx,vz,ox,oz,rx,rz,W,own){__pv.push({ci,lv,vx,vz,ox,oz});return f.apply(this,arguments);};
  const pl=paneLook;window.__pvms=[];paneLook=function(){const t=performance.now();pl();const m=performance.now()-t;if(m>.05)__pvms.push(Math.round(m*10)/10);};
  window.__cell=(ci,lv)=>{const c=document.createElement('canvas');c.width=512;c.height=256;c.getContext('2d').drawImage(PV.x.canvas,ci*512,lv*256,512,256,0,0,512,256);return c.toDataURL('image/png');};return 1;}"""
# name: room, pre, wall dir (real: n/s/e/w), floor, inside camera (x,z,yaw,pitch), climb (pet shop floors)
CASES = {
 'A1_flats-by-park_floor3_east': ('apt3', "()=>{APT.b='ap3';}", 'east', 2, (-5.5, 0, 1.5708, .02)),
 'A2_flats-by-flowers_floor3_south': ('apt3', "()=>{APT.b='ap1';}", 'south', 2, (-5.5, 0, 1.5708, .02)),
 'A3_petshop_ground_west': ('pets', None, 'west', 0, (4.6, -1.4, -1.5708, .05)),
 'A4_myhouse_back_yard': ('home', None, 'south', 0, (0, 1.5, 0, .02)),
 'A5_farm_flats-by-flowers_floor3_north': ('apt3', "()=>{APT.b='ap1';}", 'north', 2, (5.5, 0, -1.5708, .02)),
 'A6_market_west': ('market', None, 'west', 0, (-3, 2.5, 1.5708, .02)),
 'A7_cafe_east_treepark': ('cafe', None, 'east', 0, (2, -.2, -1.5708, .02)),
 'A8_vet_west_farm': ('vet', None, 'west', 0, (0, -2.5, 3.14159, .02)),
}
DIR = {'north': (0, -1), 'south': (0, 1), 'east': (1, 0), 'west': (-1, 0)}
async def main():
    os.makedirs(OUT, exist_ok=True)
    async with Run('pair', os.path.join(OUT, 'run-pair')) as run:
        g = await begin(run, open(NEW, 'rb').read(), 'ipad-landscape', 'pair', dict(SAVE, name='ZZTEST-WV'))
        errs = []; g.page.on('pageerror', lambda e: errs.append(str(e)[:300])); await g.ev(HOOK)
        for nm, (cid, pre, want, lv, cam) in CASES.items():
            if os.environ.get('ONLY') and not any(nm.startswith(o) for o in os.environ['ONLY'].split(',')): continue
            await g.ev("([id,pre])=>{setLoc('city');if(pre)eval(pre)();__pv.length=0;__goto(id);if(pre){eval(pre)();setLoc(id);}__setClock(null,12);}", [cid, pre]); await g.step(4)
            cells = await g.ev("()=>__pv.slice(-16)"); ox, oz = DIR[want]
            c = [q for q in cells if q['lv'] == lv and q['ox'] == ox and q['oz'] == oz]
            if not c: print(nm, 'NO SUCH WALL', [(q['lv'], q['ox'], q['oz']) for q in cells]); continue
            c = c[-1]
            # which interior wall is it: find the interior yaw whose cell index is ci (ry = ci*90deg) -> face it
            yaw = c['ci'] * math.pi / 2
            if cid == 'pets':   # east wall window on the ground floor
                await g.ev("([x,z,y,p])=>{const L=CUR;P.x=L.ox+x;P.z=L.oz+z;P.yaw=y;P.pitch=p;closePanel();$('toast').classList.remove('show');}", list(cam))
            else:
                await g.ev("([y,p,ci])=>{const L=CUR,o=[[0,-1],[-1,0],[0,1],[1,0]][ci],hw=(L.bounds.x2-L.bounds.x1)/2,hd=Math.min(5,(L.bounds.z2-L.bounds.z1)/2);P.x=L.ox+o[0]*Math.max(0,hw-4.2);P.z=L.oz+o[1]*Math.max(0,hd-4.2);P.yaw=y;P.pitch=p;P.sit=null;closePanel();$('toast').classList.remove('show');}", [yaw, cam[3], c['ci']])
            await g.step(4, True); a = Image.open(io.BytesIO(await g.page.screenshot()))
            cell = Image.open(io.BytesIO(base64.b64decode((await g.ev("([a,b])=>__cell(a,b)", [c['ci'], c['lv']])).split(',')[1])))
            ey = 1.6 + 3.2 * lv
            await g.ev("()=>{__goto('city');__setClock(null,12);}"); await g.step(4)
            await g.ev("([x,z])=>{P.x=x;P.z=z;closePanel();$('toast').classList.remove('show');}", [c['vx'] + ox * 2, c['vz'] + oz * 2]); await g.step(6, True)
            await g.ev("([x,y,z,ox,oz])=>{document.getElementById('hud').style.visibility='hidden';const hy=(150+14*%d)/256;camera.position.set(x,y,z);camera.fov=88.3;camera.updateProjectionMatrix();camera.lookAt(x+ox*10,y,z+oz*10);camera.updateMatrixWorld(true);renderer.render(scene,camera);}" % lv, [c['vx'] + ox * (3.2 if cid == 'pets' else .6), ey, c['vz'] + oz * (3.2 if cid == 'pets' else .6), ox, oz])
            b = Image.open(io.BytesIO(await g.page.screenshot())); await g.ev("()=>{document.getElementById('hud').style.visibility='';camera.fov=window.__fov0||camera.fov;}")
            # crop the outside picture to the painted picture's frame: same width of view (the strip is 512 px at 183 px per unit), horizon at the same height
            W, H = b.size; f = (W / 2) / math.tan(math.radians(88.3 / 2) ) ; f = (H / 2) / math.tan(math.radians(88.3 / 2)); k = f / 183.0
            hy = 150 + 14 * lv; x0 = W / 2 - 256 * k; y0 = H / 2 - hy * k; bc = b.crop((int(x0), int(y0), int(x0 + 512 * k), int(y0 + 256 * k))).resize((1024, 512))
            sh = Image.new('RGB', (1024 * 2 + 12, 512 + 512 + 44), 'white'); d = ImageDraw.Draw(sh)
            sh.paste(cell.resize((1024, 512), Image.LANCZOS), (0, 20)); sh.paste(bc, (1036, 20)); sh.paste(a.resize((737, 512)), (0, 552)); sh.paste(b.resize((737, 512)), (1036, 552))
            d.text((4, 4), nm + ': the painted picture of this wall (each window shows a part of it)', fill='black'); d.text((1040, 4), 'the real town from the same spot and height, same frame', fill='black')
            d.text((4, 538), 'inside, in the game', fill='black'); d.text((1040, 538), 'outside, whole screen', fill='black')
            sh.save(os.path.join(OUT, 'pair' + nm + '.png')); print('pair', nm, 'cell', c['ci'], c['lv'], 'from', round(c['vx'], 1), round(c['vz'], 1))
        print('paint ms per door:', await g.ev("()=>__pvms")); print('page errors:', errs)
        await run.close(g)
asyncio.run(main())
