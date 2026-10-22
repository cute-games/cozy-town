import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
JS = """()=>{__goto('city');__setClock(null,19.5);__run(30);const L=LOC.city,out={};let n=0;
  L.g.traverse(o=>{if(!o.isMesh&&!o.isPoints&&!o.isSprite)return;let v=true;for(let p=o;p;p=p.parent)if(p.visible===false){v=false;break;}if(!v)return;n++;
    const m=o.material,k=(o.isSprite?'sprite':o.isPoints?'points':m.type)+'|'+(m.color?'#'+m.color.getHexString():'')+'|'+(o.parent&&o.parent.userData&&o.parent.userData.loc||'')+'|'+(o.geometry&&o.geometry.attributes.position?o.geometry.attributes.position.count:0);out[k]=(out[k]||0)+1;});
  return {n,out};}"""
async def main():
    res = {}
    async with Run('pd', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/stage3-piecediff') as run:
        for tag, path in (('before', 'pre-s3f.html'), ('after', '/home/user/cozy-town/index.html')):
            fb = fake_date_build(open(path, 'rb').read(), '2026-10-20T19:30:00')
            g = await run.open(fb, 'web', 'ipad-landscape', 'light', tag, save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.step(4)
            res[tag] = await g.ev(JS); await run.close(g)
    a, b = res['before'], res['after']; print('city meshes before', a['n'], 'after', b['n'])
    keys = sorted(set(a['out']) | set(b['out']))
    for k in keys:
        x, y = a['out'].get(k, 0), b['out'].get(k, 0)
        if x != y: print(f'{x:3d} -> {y:3d}  {k}')
asyncio.run(main())
