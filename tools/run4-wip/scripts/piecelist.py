import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
JS = """()=>{__goto('city');__setClock(null,12);if(typeof wxForce==='function')wxForce('rain');if(typeof WILD!=='undefined'&&WILD.force)WILD.force(true);__run(12);
  const L=LOC.city,byTop={},byMat={};let n=0;
  const tops=new Map();L.g.children.forEach((c,i)=>tops.set(c,i));
  const lane=new Set((L.lane||[]).map(lp=>lp.g));
  L.g.traverse(o=>{if(!(o.isMesh||o.isInstancedMesh||o.isSkinnedMesh))return;n++;let p=o;while(p.parent&&p.parent!==L.g)p=p.parent;
    const i=tops.get(p),tag=p===HOL.g?'HOL':p===L.dyn?'dyn':lane.has(p)?'lane':p===SCH.g?'school':('top'+i+':'+(p.name||p.type));byTop[tag]=(byTop[tag]||0)+1;
    const m=o.material,k=(m&&m.type)+(m&&m.map?'+map':'')+(m&&m.side===1?'(OL)':'');byMat[k]=(byMat[k]||0)+1;});
  const det={};for(const [nm,G] of [['HOL',HOL.g],['dyn',L.dyn]]){if(!G)continue;const d={};G.children.forEach(c=>{let k=0;c.traverse(o=>{if(o.isMesh||o.isInstancedMesh)k++;});if(!k)return;const m=c.material,key=(c.isMesh?(m&&m.type)+(m&&m.color?'#'+m.color.getHexString():'')+(m&&m.map?'+map':''):c.type+'['+c.children.length+']')+(c.userData&&c.userData.keep?'(keep)':'');d[key]=(d[key]||0)+k;});det[nm]=Object.entries(d).sort((a,b)=>b[1]-a[1]).slice(0,30);}
  const sum=(o)=>Object.entries(o).sort((a,b)=>b[1]-a[1]);return {n,top:sum(byTop).slice(0,8),mat:sum(byMat),lanes:(L.lane||[]).length,own:(LANE.own||[]).filter(Boolean).length,det,litter:typeof LITTER!=='undefined'?LITTER.length:null};}"""
async def main():
    async with Run('pl', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/stage3-piecelist') as run:
        fb = fake_date_build(open('/home/user/cozy-town/index.html', 'rb').read(), '2026-10-25T12:00:00')
        g = await run.open(fb, 'web', 'pc-1366', 'light', 'x', save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.step(4)
        r = await g.ev(JS); print('total', r['n'], 'lanes', r['lanes'], 'owned', r['own'])
        print('by group:'); [print('  ', k, v) for k, v in r['top']]
        print('by material:'); [print('  ', k, v) for k, v in r['mat']]
        print('litter', r['litter'])
        for nm, d in r['det'].items(): print(nm); [print('    ', k, v) for k, v in d]
asyncio.run(main())
