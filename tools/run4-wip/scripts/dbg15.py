import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from night3 import fx, begin
BUILD = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j15try.html','rb').read()
FIX = [(n, json.load(open(os.path.join(KIT,'fixtures',n)))) for n in ('save-prenight3-pets.json',)]
async def main():
    async with Run('d15', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/d15-run') as run:
        save = dict(fx(FIX, 'save-prenight3-pets.json'), name='ZZTEST-DBG', job=None, ptTut=1)
        g = await begin(run, BUILD, 'pc-1366', 'dbg', save)
        await g.ev("()=>{__goto('city');__setClock(null,12);setJob('photo');}"); await g.step(3)
        cols = await g.ev("""()=>LOC.city.cols.filter(c=>{const x=c.cx!==undefined?c.cx:(c.x1+c.x2)/2,z=c.cz!==undefined?c.cz:(c.z1+c.z2)/2;return x>27&&x<41&&z>-42&&z<-28;}).map(c=>c.cr!==undefined?['circle',+c.cx.toFixed(1),+c.cz.toFixed(1),+c.cr.toFixed(2),!!c.lk]:['box',+c.x1.toFixed(1),+c.z1.toFixed(1),+c.x2.toFixed(1),+c.z2.toFixed(1)])""")
        print('colliders near the duck pond:', cols)
        pond = await g.ev("()=>{const L=LOC.city;return L.pondC?[L.pondC.cx,L.pondC.cz,L.pondC.cr]:null}")
        print('pond collider', pond)
        # a wedding at the park with the flowers behind, on the PC: the score per distance
        sc = await g.ev("""()=>{const d=pt();d.o={id:'x',kind:'wedding',spot:'park',bg:'flowers',who:['ap3','n2'],pet:null,st:'go'};P.x=-22;P.z=12;__run(2);ptSetup();for(const m of PHO.group)m.pose='smile';while(PHO.bg!=='flowers')ptNextBg();
          const out=[];for(const dd of[3,3.6,4.4,5.2]){const g=PHO.group;const cx=g.reduce((a,m)=>a+m.x,0)/g.length,cz=g.reduce((a,m)=>a+m.z,0)/g.length,f=g[0].face;P.x=cx+Math.sin(f)*dd;P.z=cz+Math.cos(f)*dd;P.yaw=f;P.pitch=-.04;P.jy=0;updateCamera(0);camera.updateMatrixWorld();
            const v=new THREE.Vector3();const pts=g.map(m=>{const r=m.root,h=1.75*(m.p.b?m.p.b.scale.x:1);return [[0,0,0],[0,h,0],[-.3,h*.6,0],[.3,h*.6,0]].map(([dx,dy,dz])=>{v.set(r.position.x+dx,r.position.y+dy,r.position.z+dz).project(camera);return [+v.x.toFixed(2),+v.y.toFixed(2),+v.z.toFixed(3)];});});
            out.push({dd,sc:ptScore(),pts,cam:[+camera.position.x.toFixed(2),+camera.position.y.toFixed(2),+camera.position.z.toFixed(2)],fov:camera.fov,asp:+camera.aspect.toFixed(2),grp:g.map(m=>[+m.x.toFixed(2),+m.z.toFixed(2),+m.root.position.y.toFixed(2)])});}
          return out;}""")
        for o in sc: print(json.dumps(o))
        await run.close(g)
asyncio.run(main())
