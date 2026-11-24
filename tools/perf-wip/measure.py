"""Perf measure: python3 measure.py <stripped game> <tag> [areas,comma] ; writes /home/claude/w/pfs/res-<tag>.json"""
import asyncio, json, sys, os, time
KIT='/home/claude/w/kit/cozycheck'; sys.path.insert(0,KIT)
import harness
from harness import Run
from night3 import begin
SAVE=json.load(open('/home/claude/gh3/tools/check-fixtures/save-prenight3-pets.json'))
GAME, TAG = sys.argv[1], sys.argv[2]
ONLY=[a for a in (sys.argv[3] if len(sys.argv)>3 else '').split(',') if a]
THR=float(os.environ.get('THR','4')); NF=int(os.environ.get('NF','40'))
PROFILE=os.environ.get('PROF','ipad-landscape')
_old=Run.__aenter__
async def _enter(self):
  from playwright.async_api import async_playwright
  self.pw=await async_playwright().start()
  self.browser=await self.pw.chromium.launch(args=['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required','--enable-precise-memory-info','--js-flags=--expose-gc'])
  return self
Run.__aenter__=_enter
# GOTO_PATCH: slow machine
from playwright.async_api import Page as _Pg
_og=_Pg.goto
async def _goto(self,url,**k):
  k.setdefault('timeout',240000); return await _og(self,url,**k)
_Pg.goto=_goto

INSTALL=r"""()=>{if(window.__pf)return;const T=window.__pf={t:{},n:0};
 const names=['updatePlayer','farmTick','tpTick','psTick','fanTick','petTick','tagsApart','updatePen','wkStat','walkersApart','granTick','updateCars','mpTick','hpTick','laneTick','zzTick',
  'updGarden','bdTick','fbTick','psUpdate','dayTick','holTick','fwTick','confTick','spookTick','wxTick','hsTick','hsTutTick','floorVis','updateCamera','updateRide','swingUI','findTarget','showAction','jobTick',
  'updHud','padSize','saveLocal','hardCheck','updNav','awTick','netTick','updFountain','updDucks','brTick','updFlies','updBall','holAnim','wildTick','updTVs','updFloats','updBeach','popFades','updSky','animPerson','clockSync','cutUpdate','climbUpdate'];
 const wrap=(obj,k,label)=>{const f=obj[k];if(typeof f!=='function'||f.__w)return;const w=function(){const a=performance.now();try{return f.apply(this,arguments);}finally{T.t[label]=(T.t[label]||0)+performance.now()-a;}};w.__w=1;obj[k]=w;};
 for(const k of names)wrap(window,k,k);
 for(const [nm,arr] of [['walker.update',WALKERS],['friend.update',FRIEND_ACTORS],['pet.update',PET_ACTORS],['shopper.update',SHOPPERS]]){if(arr&&arr[0]){const pr=Object.getPrototypeOf(arr[0]);if(pr&&pr.update&&pr!==Object.prototype)wrap(pr,'update',nm);else for(const a of arr)wrap(a,'update',nm);}}
 const R=renderer;const rr=R.render;window.__rrender=rr;const RW=function(s,c){const a=performance.now();try{return rr.call(R,s,c);}finally{T.t.render=(T.t.render||0)+performance.now()-a;}};R.render=RW;window.__RW=RW;window.__realRender=RW;
 window.LOOKP=(x,z,p)=>{P.yaw=Math.atan2(-(x-P.x),-(z-P.z));P.pitch=p==null?-.1:p;};
 window.__counts=()=>{camera.updateMatrixWorld(true);const fr=new THREE.Frustum(),m=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);fr.setFromProjectionMatrix(m);
   let vis=0,inv=0,cast=0,castIn=0,tris=0,skinned=0,inst=0,sprites=0,lights=0,shl=[],objs=0,mats=new Set();
   const walk=(o,v)=>{v=v&&o.visible;if(!v)return;objs++;if(o.isLight){lights++;if(o.castShadow&&o.shadow)shl.push(o.type+':'+o.shadow.mapSize.x);}
     if(o.isSprite)sprites++;if(o.isMesh){vis++;if(o.isInstancedMesh)inst++;if(o.castShadow)cast++;mats.add(o.material);let inF=!o.frustumCulled;if(!inF){if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();inF=fr.intersectsObject(o);}if(inF){inv++;}}
     for(const c of o.children)walk(c,v);};walk(scene,true);
   const i=renderer.info;return {visMeshes:vis,inFrustum:inv,casters:cast,objects:objs,sprites,inst,lights,shadowLights:shl,materials:mats.size,
     calls:i.render.calls,tris:i.render.triangles,geoms:i.memory.geometries,texs:i.memory.textures,progs:(i.programs||[]).length,pr:renderer.getPixelRatio(),shadowOn:renderer.shadowMap.enabled,
     canvas:[renderer.domElement.width,renderer.domElement.height]};};
 window.__runF=(n)=>{renderer.render=window.__RW;T.t={};const fr=[];let gcN=0,heap0=performance.memory.usedJSHeapSize,alloc=0;
   for(let i=0;i<n;i++){window.__t=Math.max(window.__t||0,performance.now())+16.7;const h0=performance.memory.usedJSHeapSize;const a=performance.now();frame(window.__t);const b=performance.now();const h1=performance.memory.usedJSHeapSize;if(h1>=h0)alloc+=h1-h0;else gcN++;fr.push(b-a);}
   fr.sort((x,y)=>x-y);const tot=fr.reduce((s,x)=>s+x,0);const top=Object.entries(T.t).map(([k,v])=>[k,+(v/n).toFixed(3)]).sort((a,b)=>b[1]-a[1]);
   const rend=(T.t.render||0)/n;return {frameMs:+(tot/n).toFixed(2),p90:+fr[Math.floor(n*.9)].toFixed(2),renderMs:+rend.toFixed(2),jsMs:+(tot/n-rend).toFixed(2),allocKB:+(alloc/n/1024).toFixed(1),gcs:gcN,top:top.slice(0,14)};};
}"""
D="__setClock(null,%s);"
AREAS={
 'town':"()=>{__goto('city');H;P.x=4;P.z=-3;LOOKP(40,-3,-.05);}",
 'park':"()=>{__goto('city');H;P.x=-14;P.z=30;LOOKP(-30,30,-.08);}",
 'lane':"()=>{__goto('city');H;P.x=-80;P.z=0;LOOKP(-140,0,-.05);}",
 'farmyard':"()=>{__goto('city');H;P.x=-92;P.z=-104;P.yaw=Math.PI*.55;P.pitch=-.08;bringFollowers(true);}",
 'fields':"()=>{__goto('city');H;P.x=-118;P.z=-90;LOOKP(-140,-108,-.08);bringFollowers(true);}",
 'trail':"()=>{__goto('city');H;P.x=-100;P.z=-101;bringFollowers(true);__run(4);if(typeof farmLiveAll==='function'){farmLiveAll();__run(4);S.ride=S.ride||{};S.ride.lesson=1;const H2=FARM.hs.find(h=>h.kind==='pad'&&farmHorseFree(h));if(H2){P.x=H2.x;P.z=H2.z;farmMount(H2);const T=FARM.trail,i=Math.floor(T.length*.45),a=T[i],b=T[Math.min(T.length-1,i+3)];P.x=a[0]??a.x;P.z=a[1]??a.z;LOOKP(b[0]??b.x,b[1]??b.z,-.12);if(P.horse){P.horse.ry=P.yaw+Math.PI;IN.keys.KeyW=true;}}}}",
 'jumps':"()=>{__goto('city');H;P.x=-168;P.z=-100;LOOKP(-185,-100,-.1);bringFollowers(true);}",
 'vet':"()=>{__goto('vet');H;}",
 'petshop':"()=>{__goto('pets');H;}",
 'school':"()=>{__goto('school');H;}",
 'home':"()=>{__goto('home');H;}",
}
async def main():
  res={'game':GAME,'thr':THR,'areas':{}}
  async with Run('pf-'+TAG,'/home/claude/w/pfs/run-'+TAG) as run:
    t0=time.time()
    g=await begin(run,open(GAME,'rb').read(),PROFILE,'pf-'+TAG,dict(SAVE,name='ZZTEST-PERF'))
    res['openS']=round(time.time()-t0,1)
    await g.ev(INSTALL)
    await g.ev("()=>{const c=clockNow();let d=c.day;while(wdIdx(d)!==1)d++;__clockMs(msAt(d,12)-CLK.sk);__run(4);closePanel();if(typeof toastOff==='function')toastOff();}")
    cdp=await g.ctx.new_cdp_session(g.page)
    for nm,js in AREAS.items():
      if ONLY and nm not in ONLY: continue
      for tod,h in [('day',12),('night',21.5)]:
        try:
          await cdp.send('Emulation.setCPUThrottlingRate',{'rate':1})
          await g.ev(js.replace('H;',D%h))
          await g.step(40)   # settle (farm builds lazily, followers arrive)
          if nm=='trail': await g.ev("()=>{IN.keys.KeyW=true;}")
          await g.step(1,True)
          c=await g.ev("()=>__counts()")
          await g.ev("()=>{gc&&gc();__runF(10);}")
          await cdp.send('Emulation.setCPUThrottlingRate',{'rate':THR})
          if os.environ.get('CPUPROF'):
            await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval',{'interval':200}); await cdp.send('Profiler.start')
            await cdp.send('HeapProfiler.enable'); await cdp.send('HeapProfiler.startSampling',{'samplingInterval':2048,'includeObjectsCollectedByMajorGC':True,'includeObjectsCollectedByMinorGC':True})
          t=await g.ev("(n)=>__runF(n)",NF)
          if os.environ.get('CPUPROF'):
            pr=(await cdp.send('Profiler.stop'))['profile']; hp=(await cdp.send('HeapProfiler.stopSampling'))['profile']
            json.dump(pr,open(f'/home/claude/w/pfs/prof-{TAG}-{nm}-{tod}.cpuprofile','w')); json.dump(hp,open(f'/home/claude/w/pfs/heap-{TAG}-{nm}-{tod}.json','w'))
          fps=await g.ev("()=>new Promise(res=>{let n=0;const f0=window.frame;window.frame=function(t){n++;return f0(t);};window.__loop.manual=false;requestAnimationFrame(frame);setTimeout(()=>{window.__loop.manual=true;window.frame=f0;res(n/4);},4000);})")
          t['fps']=fps
          await cdp.send('Emulation.setCPUThrottlingRate',{'rate':1})
          await g.step(2)
          if nm=='trail': await g.ev("()=>{IN.keys.KeyW=false;if(P.horse)farmOff(true);}")
          res['areas'][f'{nm}-{tod}']={**c,**t}
          print(nm,tod,json.dumps({k:c[k] for k in ['calls','tris','visMeshes','inFrustum','casters','progs','geoms','texs']}),'frame',t['frameMs'],'render',t['renderMs'],'js',t['jsMs'],'alloc',t['allocKB'],'fps',t['fps'],t['top'][:6],flush=True)
          if os.environ.get('SHOT'): await g.shot(f'{nm}-{tod}',both=False)
        except Exception as e:
          print('FAIL',nm,tod,repr(e)[:300],flush=True); res['areas'][f'{nm}-{tod}']={'err':repr(e)[:300]}
    if os.environ.get('SHOT'):
      import shutil; os.makedirs(f'/home/claude/w/pfs/shots-{TAG}',exist_ok=True)
      for p in g.shots: shutil.copy(p,f'/home/claude/w/pfs/shots-{TAG}/')
  json.dump(res,open(f'/home/claude/w/pfs/res-{TAG}.json','w'),indent=1)
asyncio.run(main())
