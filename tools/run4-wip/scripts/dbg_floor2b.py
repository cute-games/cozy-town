import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW=open('/home/user/cozy-town/index.html','rb').read()
save=json.load(open(os.path.join(KIT,'fixtures','save-prenight3-pets.json')))
PROBE="""()=>{__goto('home');S.bighouse=true;S.home.xf=4;applyHouse();__setClock(null,11);__run(2);const L=LOC.home;const desc=F=>{const out=[];F.g.traverse(o=>{if(o.isMesh){const m=o.material;out.push({n:o.name||'',t:o.geometry.type.slice(0,8),c:m.color?'#'+m.color.getHexString():null,e:m.emissive?'#'+m.emissive.getHexString():null,op:m.opacity,tr:m.transparent,vis:o.visible,uuid:m.uuid.slice(0,5),map:!!m.map,fog:m.fog});}});return out;};
 const a=desc(L.fls[0]),b=desc(L.fls[1]);const key=x=>[x.t,x.c,x.e,x.op,x.tr,x.map].join('|');const ka=new Set(a.map(key)),kb=new Set(b.map(key));
 return {n0:a.length,n1:b.length,only0:[...ka].filter(k=>!kb.has(k)).slice(0,8),only1:[...kb].filter(k=>!ka.has(k)).slice(0,8),fog:scene.fog?{n:scene.fog.near,f:scene.fog.far,c:'#'+scene.fog.color.getHexString()}:null,extra:L.g.children.filter(o=>!L.fls.some(F=>F.g===o)).map(o=>o.type+':'+(o.name||'')+':'+o.children.length).slice(0,12),gpos:L.fls.map(F=>[F.g.position.x,F.g.position.z,F.g.visible])};}"""
async def main():
    async with Run('fl2b','/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dbg-floor2b') as run:
        fb=fake_date_build(NEW,'2026-10-20T12:00:00'); g=await run.open(fb,'web','ipad-landscape','light','f2',save=json.loads(json.dumps(save))); await start_from_save(g); await g.ev(INSTR); await g.step(4)
        print(json.dumps(await g.ev(PROBE),indent=0)[:2500]); await run.close(g)
asyncio.run(main())
