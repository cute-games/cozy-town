import asyncio, json, os, sys
KIT = '/tmp/claude-0/-home-user-cozy-town/13646462-56a2-5e69-9aed-e876265ee276/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import begin
NEW = open('/home/user/cozy-town/index.html', 'rb').read(); FIX = os.path.join(KIT, 'fixtures')
async def main():
    async with Run('pch', sys.argv[1]) as run:
        g = await begin(run, NEW, 'ipad-landscape', 'pch', json.load(open(os.path.join(FIX, 'save-prenight3-pets.json'))))
        r = await g.ev("()=>{const s=THREE.ShaderChunk.lights_fragment_begin,i=s.indexOf('NUM_DIR_LIGHTS > 0');return THREE.REVISION+'\\n'+s.slice(i,i+900);}")
        print(r)
        print(await g.ev("()=>{const s=THREE.ShaderChunk.lights_toon_pars_fragment;return s.slice(0,900);}"))
        print(await g.ev("()=>{const s=THREE.ShaderChunk.gradientmap_pars_fragment;return s.slice(0,700);}"))
        await run.close(g)
asyncio.run(main())
