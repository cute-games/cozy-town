import asyncio, json, sys, os
sys.argv=[sys.argv[0],sys.argv[1],'aq']
exec(open('/home/claude/w/pfs/measure.py').read().split('async def main')[0])
ST="()=>({lv:AQ.lv,pr:renderer.getPixelRatio(),sh:renderer.shadowMap.enabled,map:sun.shadow.mapSize.x,cast:sun.castShadow,far:camera.far,fogFar:FOG.far,hidden:AQ.farList?AQ.farList.filter(o=>o.layers.mask===0).length:0,list:AQ.farList?AQ.farList.length:0,lock:AQ.lock,key:localStorage.getItem('cozytown-q'),canvas:[renderer.domElement.width,renderer.domElement.height]})"
async def main():
  async with Run('pf-aq','/home/claude/w/pfs/run-aq') as run:
    g=await begin(run,open(GAME,'rb').read(),PROFILE,'pf-aq',dict(SAVE,name='ZZTEST-PERF'))
    await g.ev(INSTALL); await g.ev(AREAS['town'].replace('H;',D%12)); await g.step(10)
    await g.ev("()=>{Object.defineProperty(window,'devicePixelRatio',{get:()=>2,configurable:true});applyGfx();}")
    print('start',await g.ev(ST))
    cdp=await g.ctx.new_cdp_session(g.page)
    await cdp.send('Emulation.setCPUThrottlingRate',{'rate':6})
    await g.ev("()=>{window.__aqTest=1;window.__loop.manual=false;requestAnimationFrame(frame);}")
    for i in range(8):
      await asyncio.sleep(4); print('slow',i,await g.ev(ST))
    await cdp.send('Emulation.setCPUThrottlingRate',{'rate':1})
    r=await g.ev("""()=>{const real=performance.now;let ft=real.call(performance);performance.now=()=>ft;const out=[];for(let s=0;s<10;s++){for(let i=0;i<20;i++){ft+=60;aqTick();}out.push(AQ.lv);}performance.now=real;return out;}""")
    print('slow sim',r,await g.ev(ST))
    r=await g.ev("()=>{AQ.lv=4;applyGfx();__run(2);return 1;}"); await g.step(3,True); print('far step',await g.ev(ST))
    # fake a fast device: report good frames by speeding the clock check: simulate by calling aqTick with fake times
    r=await g.ev("""()=>{window.__loop.manual=true;const pn=performance.now.bind(performance);let ft=pn();const real=performance.now;performance.now=()=>ft;const out=[];
      for(let s=0;s<200;s++){for(let i=0;i<60;i++){ft+=16;aqTick();}if(s%20===0)out.push([s,AQ.lv]);}performance.now=real;return {out,lv:AQ.lv,lock:AQ.lock};}""")
    print('fast sim',r, await g.ev(ST))
    await g.ev("()=>{ACT.sgfx('nice');closePanel();}"); print('pretty tapped',await g.ev(ST))
    await g.ev("()=>{ACT.sgfx('fast');closePanel();}"); print('fast tapped',await g.ev(ST))
    await g.ev("()=>{ACT.sgfx('nice');closePanel();}")
asyncio.run(main())
