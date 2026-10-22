"""Where does startGame spend its time for a given save? Wraps the functions startGame calls and times each."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from checks import start_from_save
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', sys.argv[1] if len(sys.argv) > 1 else 'save-prerun4-day58.json')))
WRAP = """()=>{window.__tm={};const names=['clockLoad','applyHouse','houseShrink','rebuildHome','laneRefresh','addPetActor','spawnLitter','gardenInit','drawScore','mpConnect','bdInit','psRefresh','hardMigrate','qNewDay','buildPlayerBody','setLoc','safeSpot','collideXZ','busLoad','heldInit','jobHud','dcardUpd','updHud','startIntro','nearMe','toast'];
  for(const n of names){const f=window[n];if(typeof f!=='function')continue;window[n]=function(){const t0=performance.now();try{return f.apply(this,arguments);}finally{window.__tm[n]=(window.__tm[n]||0)+performance.now()-t0;}};}
  const f0=startGame;startGame=function(){const t0=performance.now();try{return f0.apply(this,arguments);}finally{window.__tm.startGame=performance.now()-t0;}};}"""
async def main():
    async with Run('prof', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/prof-run') as run:
        g = await run.open(NEW, 'web', 'ipad-landscape', 'light', 'prof', save=dict(save, name='ZZTEST-PROF')); await g.manual(); await g.ev(WRAP); await start_from_save(g)
        tm = await g.ev("()=>window.__tm"); print(json.dumps({k: round(v) for k, v in sorted(tm.items(), key=lambda x: -x[1])}, indent=0))
        print('errors', g.errors[:3]); await run.close(g)
asyncio.run(main())
