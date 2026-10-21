"""Run 4 finish, f9: checks by script on one game file: how near your eyes come to a car from every side, the phone screen's fade (only
when there is more below), the dance crouch's lowest shoe point, the upright phone's dance view width, the little pictures of glowing
furniture and the tutorial pictures (saved as sheets), plus pictures of the phone pages and the bag on a sideways iPhone.
usage: python3 probe_f9js.py OUTDIR FILE TAG"""
import asyncio, base64, io, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
from PIL import Image
OUT, FILE, TAG = sys.argv[1:4]; os.makedirs(OUT, exist_ok=True)
CARGAP = """()=>{__goto('city');__setClock(null,12);const c=CARS.find(c=>!c.away);c.v=0;const f=Math.sin(c.yaw),g=Math.cos(c.yaw);let mB=9,mC=9,at=null;
  const gap=(px,pz,y,hw,lo,hi,y0,y1)=>{const dx=px-c.x,dz=pz-c.z,al=dx*f+dz*g,lat=dx*g-dz*f;return Math.hypot(Math.max(0,Math.abs(lat)-hw),Math.max(0,lo-al,al-hi),Math.max(0,y0-y,y-y1));};
  for(let a=0;a<6.283;a+=Math.PI/48)for(let r=.2;r<=2.6;r+=.2){P.x=c.x+Math.sin(a)*r;P.z=c.z+Math.cos(a)*r;const q=collideXZ(P.x,P.z,.3,CUR,solids());
    const b=gap(q[0],q[1],1.5,.85,-1.7,1.7,.3,.92),cb=gap(q[0],q[1],1.5,.75,-1.1,.8,.92,1.52);if(b<mB)mB=b;if(cb<mC){mC=cb;at=[+a.toFixed(2),+r.toFixed(1)];}}
  return {car:CARS.indexOf(c),eyesToBody:+mB.toFixed(3),eyesToCabin:+mC.toFixed(3),closestFrom:at};}"""
CROUCH = """()=>{const f=FRIEND_ACTORS.find(f=>f.p&&f.p.legs&&f.p.legs.length===2);if(!f)return 'no person';const p=f.p,r=p.root;const low=()=>{r.updateMatrixWorld(true);let m=9;for(const l of p.legs)l.traverse(o=>{if(o.isMesh&&o.visible&&!(o.material&&o.material.side===THREE.BackSide)){const b=new THREE.Box3().setFromObject(o);m=Math.min(m,b.min.y);}});return +(m-r.position.y).toFixed(3);};
  const out={};for(const u of[0,.25,.5,.75]){dnPose(p,1,u,0);out['u'+u]=low();}dnPose(p,0,0,0);out.after=low();return out;}"""
FOV = """()=>{const keep={on:DANCE.on,res:DANCE.res,cam:DANCE.cam,floor:DANCE.floor},out={};if(typeof dnFov!=='function')return 'no dnFov (before f9)';
  DANCE.on=true;DANCE.res=false;DANCE.floor={x:0,z:0};for(const d of[3,4,5,5.6,7]){DANCE.cam={x:d,z:0,dx:1,dz:0};out['d'+d]=+dnFov().toFixed(1);}Object.assign(DANCE,keep);out.off=dnFov();out.screen=innerWidth+'x'+innerHeight;return out;}"""
THUMBS_JS = """()=>{const out=[];for(const t of Object.keys(FURN))if(FURN[t].use==='lamp'){for(const c of (FURN[t].cols||[null]).slice(0,4)){THUMBS.delete(t+'|'+(c||''));out.push([t,c,thumb(t,c)]);}}return out;}"""
TUT_JS = """()=>{const out=[];for(const id of['p2','h2','h4']){TUTPICS.delete(id);out.push([id,tutPic(id)]);}return out;}"""
PHONE = """(k)=>{closePanel();openPhone(k);return new Promise(r=>setTimeout(()=>{const ps=document.querySelector('#card .ph-screen');r(ps?{page:k,more:ps.classList.contains('more'),left:ps.scrollHeight-ps.clientHeight-ps.scrollTop,mask:getComputedStyle(ps).webkitMaskImage||getComputedStyle(ps).maskImage}:'no screen');},500));}"""
def sheet(items, name, w=144):
    ims = [Image.open(io.BytesIO(base64.b64decode(u.split(',', 1)[1]))).convert('RGB') for u in items]
    ims = [i.resize((w, int(i.height * w / i.width))) for i in ims]
    h = max(i.height for i in ims); S = Image.new('RGB', (len(ims) * (w + 4), h), 'white')
    for k, i in enumerate(ims): S.paste(i, (k * (w + 4), 0))
    p = os.path.join(OUT, f'{name}-{TAG}.png'); S.save(p); return p
async def main():
    save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
    async with Run('pf9', OUT) as run:
        fb = fake_date_build(open(FILE, 'rb').read(), '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'pf9-' + TAG, save=save); await start_from_save(g); await g.ev(INSTR)
        for nm, js in (('eyes and a car', CARGAP), ('the dance crouch: lowest shoe point (m above the floor)', CROUCH)):
            try: r = await g.ev(js)
            except Exception as e: r = f'ERROR {e}'
            print(nm, '->', json.dumps(r), flush=True)
        th = await g.ev(THUMBS_JS); print('lamp pictures', [f'{t}:{c}' for t, c, _ in th], '->', sheet([u for _, _, u in th], 'lamps'), flush=True)
        tp = await g.ev(TUT_JS); print('tutorial pictures', [i for i, _ in tp], '->', sheet([u for _, u in tp], 'tutpics', 420), flush=True)
        print('errors', g.errors[:3]); await run.close(g)
        for prof, theme in (('iphone-portrait', 'light'), ('iphone-landscape', 'dark')):
            g = await run.open(fb, 'web', prof, theme, f'pf9-{TAG}-{prof}', save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR)
            await g.ev("()=>{S.name='Cozy Kid';__goto('city');__setClock(null,11);}"); await g.step(6)
            print(prof, 'dance view', json.dumps(await g.ev(FOV)), flush=True)
            if prof == 'iphone-landscape':
                for k in ('mp', 'quest', 'cal'):
                    r = await g.ev(PHONE, k); await g.step(4); p = await g.shot(f'phone-{k}-{TAG}', both=False); print(prof, 'phone', json.dumps(r), p, flush=True)
                await g.ev("()=>{closePanel();openBag();}"); await g.step(6); await g.wait(400); print(prof, 'bag', await g.shot(f'bag-{TAG}', both=False), flush=True)
            print(prof, 'errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
