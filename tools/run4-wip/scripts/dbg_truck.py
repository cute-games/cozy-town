import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW=open('/home/user/cozy-town/index.html','rb').read()
save=json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
PROBE="""()=>{__goto('city');__setClock(null,12);wxForce('sun');P.x=-30.6;P.z=16.2;P.yaw=Math.atan2(-(-34.2-P.x),-(11.8-P.z));P.pitch=-.12;__run(3);camera.updateMatrixWorld();
 const rc=new THREE.Raycaster(),by=new Map();const objs=[];scene.traverse(o=>{if((o.isMesh||o.isInstancedMesh)&&o.visible&&o.geometry&&o.geometry.attributes&&o.geometry.attributes.position)objs.push(o);});
 for(let yy=-.1;yy>=-.95;yy-=.05)for(let xx=.1;xx<=.95;xx+=.05){rc.setFromCamera(new THREE.Vector2(xx,yy),camera);const h=rc.intersectObjects(objs,false)[0];if(!h)continue;const o=h.object,m=Array.isArray(o.material)?o.material[h.face?h.face.materialIndex:0]:o.material;const c=m&&m.color?'#'+m.color.getHexString():'?';if(c==='#8fd47a'||c==='#7ed37a')continue;const k=o.uuid.slice(0,6)+'|'+c;const e=by.get(k)||{n:0,type:o.type,name:o.name||(o.parent&&o.parent.name)||'',col:c,inst:o.isInstancedMesh?o.count:0,tris:o.geometry.index?o.geometry.index.count/3:o.geometry.attributes.position.count/3,pts:[],keep:!!o.userData.keep,mat:m&&m.type};e.n++;if(e.pts.length<2)e.pts.push([+h.point.x.toFixed(1),+h.point.y.toFixed(2),+h.point.z.toFixed(1)]);by.set(k,e);}
 return [...by.values()].sort((a,b)=>b.n-a.n).slice(0,14);}"""
async def main():
    async with Run('trk','/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dbg-truck') as run:
        fb=fake_date_build(NEW,'2026-10-20T12:00:00'); g=await run.open(fb,'web','ipad-landscape','light','t',save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.step(4)
        r=await g.ev(PROBE); print(json.dumps(r)[:2500]); await g.step(4); print(await g.shot('truck-probe',both=False)); await run.close(g)
asyncio.run(main())
