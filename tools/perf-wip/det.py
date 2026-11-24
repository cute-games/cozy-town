import asyncio, json, sys, os
sys.argv=[sys.argv[0],sys.argv[1],'det']
exec(open('/home/claude/w/pfs/measure.py').read().split('async def main')[0])
async def main():
  async with Run('pf-det','/home/claude/w/pfs/run-det') as run:
    g=await begin(run,open(GAME,'rb').read(),PROFILE,'pf-det',dict(SAVE,name='ZZTEST-PERF'))
    print('boot',json.dumps(await g.ev("()=>__bad"))[:3000])
    await g.ev(INSTALL)
    for a in AREAS:
      await g.ev(AREAS[a].replace('H;',D%12)); await g.step(30)
    print('play',json.dumps(await g.ev("()=>__bad"))[:4000])
asyncio.run(main())
