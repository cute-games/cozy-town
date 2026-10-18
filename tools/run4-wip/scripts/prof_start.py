"""Where does startGame spend its time? Wrap the likely heavy functions in a test copy and time them (new build vs live build)."""
import asyncio, json, os, sys, time
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
FNS = ['signPlane','inkOf','inkBox','label','bake','tree','pine','leafCloud','granBuild','buildCity','buildGrandmas','flowerCorner','makeLoc','textCanvas','buildBeach','buildHome','homeShell','laneBuild','applyHouse','gardenBuild','buildLane','mkBook','bookBuild','fontLate','updSky','buildBridge','litterBuild','placeLitter','granPlan','leafTrees','mapPaint','drawMapBase','drawMini','makePerson','bakePerson','makePet']
WRAP = """(names)=>{window.__prof={};for(const n of names){try{const f=eval(n);if(typeof f!=='function')continue;const w=function(){const t0=performance.now();try{return f.apply(this,arguments);}finally{const p=window.__prof[n]||(window.__prof[n]={ms:0,n:0});p.ms+=performance.now()-t0;p.n++;}};
  try{eval(n+'=w');}catch(e){}}catch(e){}}
  const f0=startGame;startGame=function(){const t0=performance.now();try{return f0.apply(this,arguments);}finally{window.__loadMs=performance.now()-t0;}};}"""
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
async def one(run, build, tag):
    g = await run.open(build, 'web', 'ipad-landscape', 'light', tag, save=save); await g.manual(); await g.ev(WRAP, FNS); await start_from_save(g); await g.ev(INSTR); await g.step(3)
    r = await g.ev("()=>({load:window.__loadMs,prof:window.__prof})")
    print(tag, 'startGame', round(r['load']), 'ms'); items = sorted(r['prof'].items(), key=lambda kv: -kv[1]['ms'])
    print('   ', ', '.join(f"{k} {round(v['ms'])} ms x{v['n']}" for k, v in items[:14]))
    await run.close(g)
async def main():
    async with Run('prof', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/prof-run') as run:
        pass
        await one(run, open('/home/user/cozy-town/index.html','rb').read(), 'new')
asyncio.run(main())
