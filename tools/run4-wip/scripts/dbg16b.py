import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
BUILD = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j16try.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
async def main():
    async with Run('d16b', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/d16b-run') as run:
        save = dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-DBG', job=None)
        g = await begin(run, BUILD, 'pc-1366', 'dbg', save)
        await g.ev("()=>{__goto('treepark');}"); await g.step(4)
        r = await g.ev("""()=>{const Z=TP.zips[0],d=Z.from;P.x=d.x;P.z=d.z;P.cy=d.h;P.jy=0;P.vy=0;TP.last=d;TP.px=P.x;TP.pz=P.z;const L=Math.hypot(Z.bx-Z.ax,Z.bz-Z.az),ux=(Z.bx-Z.ax)/L,uz=(Z.bz-Z.az)/L;P.x=Z.ax-ux*.9;P.z=Z.az-uz*.9;__run(2);
          const t=findTarget();const lab=t?(typeof t.label==='function'?t.label():t.label):null;const pre={fading,CUT:!!CUT,PLAYING,ride:!!P.ride,in:TP.in,cur:CUR.id};
          const f0=tpZip;let calls=0;window.tpZip=function(dt){calls++;return f0(dt);};
          if(t){TARGET=t;useTarget();}const after={ride:P.ride?P.ride.kind:null,t:P.ride&&P.ride.t};
          const log=[];for(let fr=0;fr<80&&P.ride;fr++){__run(1);if(fr<6||fr%10===0)log.push([fr,P.ride&&+P.ride.t.toFixed(2),+(P.cy||0).toFixed(2),+P.x.toFixed(2),+P.z.toFixed(2),fading]);}
          window.tpZip=f0;return {lab,pre,after,calls,log,end:{ride:!!P.ride,cy:P.cy,on:(tpDeckAt(P.x,P.z,P.cy||0)||{}).i,T:Z.T}};}""")
        print(json.dumps(r))
        print('errors', g.errors[:3])
        await run.close(g)
asyncio.run(main())
