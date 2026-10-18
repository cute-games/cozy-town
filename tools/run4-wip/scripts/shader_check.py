import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
async def main():
    async with Run('shc', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/shc-run') as run:
        g = await run.open(NEW, 'web', 'ipad-landscape', 'light', 'shc', save=save); await start_from_save(g); await g.ev(INSTR)
        await g.ev("()=>{__goto('city');__setClock(null,12.5);}"); await g.step(5)
        r = await g.ev("""()=>{const gl=renderer.getContext(),ps=renderer.info.programs||[];let patched=0,withShadow=0,toon=0;for(const p of ps){const s=gl.getShaderSource(p.fragmentShader)||'';if(s.includes('getShadow( directionalShadowMap'))withShadow++;if(s.includes('smoothstep( 0.0, 0.12'))patched++;if(s.includes('gradientMap'))toon++;}
          return {programs:ps.length,withShadow,patched,toon,matHas:!!MATS.values().next().value.onBeforeCompile,shadowOn:renderer.shadowMap.enabled,castShadow:sun.castShadow,nb:sun.shadow.normalBias,sx:SUND.x};}""")
        print(json.dumps(r)); await run.close(g)
asyncio.run(main())
