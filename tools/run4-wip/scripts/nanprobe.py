"""Which geometry in the job-12 Pet Shop has NaN positions?"""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
BUILD=open(sys.argv[1],'rb').read()
save=json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
async def main():
    async with Run('j12n','/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j12n-run') as run:
        g=await run.open(BUILD,'web','ipad-landscape','light','nan',save=save); await start_from_save(g); await g.ev(INSTR)
        r=await g.ev("""()=>{const bad=[];scene.traverse(o=>{if(!o.isMesh||!o.geometry)return;const p=o.geometry.attributes.position;if(!p)return;let nan=0;for(let i=0;i<p.count*3;i++)if(!Number.isFinite(p.array[i])){nan++;}
          if(nan){const chain=[];let q=o;while(q){chain.push(q.name||q.type+(q.userData&&q.userData.keep?'(keep)':''));q=q.parent;}const w=new THREE.Vector3();o.getWorldPosition(w);bad.push({nan,count:p.count,chain:chain.slice(0,5).join('<'),col:o.material&&o.material.color?'#'+o.material.color.getHexString():null,pos:[+w.x.toFixed(1),+w.y.toFixed(1),+w.z.toFixed(1)]});}});
          return {bad:bad.slice(0,8),n:bad.length,pens:LOC.pets.pens.map(p=>[p.type,p.kinds&&p.kinds.length,+p.x0.toFixed(1),+p.z0.toFixed(1)]),pen:PEN.length,benches:BENCHES.filter(b=>b.loc!=='city'&&b.loc!=='beach').length};}""")
        print(json.dumps(r)); print('errors', g.errors[:4]); await run.close(g)
asyncio.run(main())
