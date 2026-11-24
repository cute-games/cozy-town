import asyncio, json, sys, os
sys.argv=[sys.argv[0],sys.argv[1],'exp3']
exec(open('/home/claude/w/pfs/measure.py').read().split('async def main')[0])
GL=r"""()=>{if(window.__glc)return;const gl=renderer.getContext();const c=window.__glc={n:0,v:0};for(const f of ['drawElements','drawArrays','drawElementsInstanced','drawArraysInstanced']){const o=gl[f];if(!o)continue;gl[f]=function(){c.n++;c.v+=(f.startsWith('drawElements')?arguments[1]:arguments[2])*(f.endsWith('Instanced')?arguments[f.startsWith('drawElements')?4:3]:1);return o.apply(gl,arguments);};}}"""
CNT=r"""()=>{__glc.n=0;__glc.v=0;sun.shadow.needsUpdate=true;window.__RW(scene,camera);const all={draws:__glc.n,tris:Math.round(__glc.v/3)};const m={calls:renderer.info.render.calls,tris:renderer.info.render.triangles};
 let cast=0,castT=0;scene.traverse(o=>{if(o.isMesh&&o.castShadow){let v=true;for(let x=o;x;x=x.parent)if(!x.visible){v=false;break;}if(v){cast++;}}});return {allDraws:all.draws,allTris:all.tris,mainCalls:m.calls,mainTris:m.tris,shadowDraws:all.draws-m.calls,shadowTris:all.tris-m.tris,castersVisible:cast};}"""
async def main():
  async with Run('pf-exp3','/home/claude/w/pfs/run-exp3') as run:
    g=await begin(run,open(GAME,'rb').read(),PROFILE,'pf-exp3',dict(SAVE,name='ZZTEST-PERF'))
    await g.ev(INSTALL); await g.ev(GL)
    await g.ev("()=>{Object.defineProperty(window,'devicePixelRatio',{get:()=>2,configurable:true});}")
    for nm in ['town','park','fields','petshop','home']:
      await g.ev(AREAS[nm].replace('H;',D%12)); await g.step(30)
      row=[]
      for l in range(5):
        await g.ev("(l)=>{AQ.lv=l;applyGfx();}",l); await g.step(2)
        c=await g.ev(CNT); px=await g.ev("()=>renderer.domElement.width*renderer.domElement.height")
        row.append(f"L{l}: {c['allDraws']} draws ({c['shadowDraws']} shadow), {round(c['allTris']/1000)}k tris, {round(px/1e6,2)}M px")
      print(nm,' | '.join(row),flush=True)
      await g.ev("()=>{AQ.lv=0;applyGfx();}")
asyncio.run(main())
