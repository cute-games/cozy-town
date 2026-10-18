import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
JS = """()=>{__goto('city');__setClock(null,12);if(typeof wxForce==='function')wxForce('rain');if(typeof WILD!=='undefined'&&WILD.force)WILD.force(true);__run(12);
  const L=LOC.city,out={};let n=0;const name=o=>{let p=o;const path=[];while(p&&p!==L.g){path.push(p);p=p.parent;}const top=path[path.length-1];const i=L.g.children.indexOf(top);return 'child'+i+(top===HOL.g?'(HOL)':top===L.dyn?'(dyn)':'')+'|'+(o.material&&o.material.type)+'|'+(o.material&&o.material.color?'#'+o.material.color.getHexString():'');};
  L.g.traverse(o=>{if(!(o.isMesh||o.isInstancedMesh||o.isSkinnedMesh))return;n++;const k=name(o);out[k]=(out[k]||0)+1;});return {n,out};}"""
async def main():
    res = {}
    async with Run('pd2', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/stage3-piecediff2') as run:
        for tag, path in (('before', '/home/user/cozy-town/index.html'), ('after', '/home/user/cozy-town/index.html')):
            fb = fake_date_build(open(path, 'rb').read(), '2026-10-25T12:00:00' if tag=='before' else '2026-10-27T12:00:00')
            g = await run.open(fb, 'web', 'pc-1366', 'light', tag, save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.step(4)
            res[tag] = await g.ev(JS); await run.close(g)
    a, b = res['before'], res['after']; print('city meshes before', a['n'], 'after', b['n'])
    for k in sorted(set(a['out']) | set(b['out'])):
        x, y = a['out'].get(k, 0), b['out'].get(k, 0)
        if x != y: print(f'{x:3d} -> {y:3d}  {k}')
asyncio.run(main())
