import asyncio, json, sys, os, shutil
sys.argv=[sys.argv[0],sys.argv[1],'exp']+sys.argv[2:]
exec(open('/home/claude/w/pfs/measure.py').read().split('async def main')[0])
GL=r"""()=>{if(window.__glc)return;const gl=renderer.getContext();const c=window.__glc={n:0,v:0};for(const f of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']){const o=gl[f];if(!o)continue;gl[f]=function(){c.n++;c.v+=(f.startsWith('drawElements')?arguments[1]:arguments[2])*(f.endsWith('Instanced')?arguments[f.startsWith('drawElements')?4:3]:1);return o.apply(gl,arguments);};}}"""
CNT=r"""()=>{__glc.n=0;__glc.v=0;sun.shadow.needsUpdate=true;window.__RW(scene,camera);const all={draws:__glc.n,tris:Math.round(__glc.v/3)};const m={calls:renderer.info.render.calls,tris:renderer.info.render.triangles};
 let cast=0,castT=0;scene.traverse(o=>{if(o.isMesh&&o.castShadow){let v=true;for(let x=o;x;x=x.parent)if(!x.visible){v=false;break;}if(v){cast++;}}});return {allDraws:all.draws,allTris:all.tris,mainCalls:m.calls,mainTris:m.tris,shadowDraws:all.draws-m.calls,shadowTris:all.tris-m.tris,castersVisible:cast};}"""
async def main():
  async with Run('pf-exp','/home/claude/w/pfs/run-exp') as run:
    g=await begin(run,open(GAME,'rb').read(),PROFILE,'pf-exp',dict(SAVE,name='ZZTEST-PERF'))
    await g.ev(INSTALL); await g.ev(GL)
    for nm in (ONLY or list(AREAS)):
      if nm in ('vet','petshop','school','home'): continue
      if nm=='trail': continue
      await g.ev(AREAS[nm].replace('H;',D%12)); await g.step(30)
      print(nm,json.dumps(await g.ev(CNT)),flush=True)
    await g.ev(AREAS['petshop'].replace('H;',D%12)); await g.step(30)
    print('pen floors',await g.ev("()=>{const o={};for(const a of PEN){const f=a.pen.fl|0;let n=0;a.m.root.traverse(x=>{if(x.isMesh&&x.visible)n++;});o[f]=(o[f]||0)+n;}return o;}"))
asyncio.run(main())
