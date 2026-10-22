"""Job 5 debug: for the flagged signs, which triangle crosses the text? (world vertices of the hit face) + ghost spots near the Pet Show stage."""
import asyncio, json, os, sys
KIT='/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck'; sys.path.insert(0, KIT)
from harness import Run
from crawl import INSTR
from checks import start_from_save
from night3 import fake_date_build
NEW = open('/home/user/cozy-town/index.html', 'rb').read()
save = json.load(open(os.path.join(KIT, 'fixtures', 'save-prenight3-pets.json')))
JS = """()=>{const out=[],vis=o=>{for(let q=o;q;q=q.parent)if(q.visible===false)return false;return true;};
  const rc=new THREE.Raycaster(),n=new THREE.Vector3(),p=new THREE.Vector3(),q=new THREE.Quaternion(),ux=new THREE.Vector3(),uy=new THREE.Vector3(),o=new THREE.Vector3();rc.camera=camera;
  const want=['💇 Long · Bob · Ponytail','🌀 Bun · Pigtails · Curly','🏆 Pet Show','Every Saturday!'];
  for(const id of ['salon','city']){const L=LOC[id];setLoc(id);const signs=[];L.g.traverse(m=>{if(m.isMesh&&m.userData.sign&&want.includes(m.userData.sign.text))signs.push(m);});
    for(const m of signs){const S0=m.userData.sign,c=S0.c,W=c.width,H=c.height;m.getWorldPosition(p);m.getWorldQuaternion(q);n.set(0,0,1).applyQuaternion(q);ux.set(1,0,0).applyQuaternion(q);uy.set(0,1,0).applyQuaternion(q);
      const r={text:S0.text,loc:id,pos:p.toArray().map(v=>+v.toFixed(2)),hits:[]};
      for(let a=0;a<5;a++)for(let b=0;b<3;b++){const px=(((a+.5)/5)-.5)*S0.w*.8,py=(.5-(b+.5)/3)*S0.h*.7;
        o.copy(p).addScaledVector(ux,px).addScaledVector(uy,py).addScaledVector(n,1.2);rc.set(o,n.clone().negate());
        const hits=rc.intersectObject(L.g,true).filter(h=>!h.object.isSprite&&vis(h.object)&&!(h.object.material&&h.object.material.side===THREE.BackSide));
        const f=hits[0];if(f&&f.object!==m){const ob=f.object,g=ob.geometry,pa=g.attributes.position,idx=g.index,fc=f.face,vs=[fc.a,fc.b,fc.c].map(i=>{const v=new THREE.Vector3().fromBufferAttribute(pa,i);ob.localToWorld(v);return v.toArray().map(t=>+t.toFixed(2));});
          r.hits.push({ray:[a,b],d:+f.distance.toFixed(3),pt:f.point.toArray().map(v=>+v.toFixed(2)),col:ob.material&&ob.material.color?'#'+ob.material.color.getHexString():'?',tris:pa.count/3|0,name:ob.name||ob.parent&&ob.parent.name||'',tri:vs,hol:!!(ob.material&&ob.material.userData&&ob.material.userData.hol),par:(ob.parent&&ob.parent.userData&&JSON.stringify(ob.parent.userData).slice(0,60))});}}
      out.push(r);}}
  setLoc('city');
  const near=HOL.ghosts.map((p,i)=>[i,p,+Math.hypot(p[0]+37.8,p[1]-22).toFixed(2)]).filter(x=>x[2]<4);
  const C=LOC.city,rects=C.cols.filter(c=>c.cr===undefined&&(c.x2-c.x1)>2.5&&(c.z2-c.z1)>2.5);
  const close=HOL.ghosts.map((p,i)=>{let best=99;for(const r of rects){const dx=Math.max(r.x1-p[0],0,p[0]-r.x2),dz=Math.max(r.z1-p[1],0,p[1]-r.z2);best=Math.min(best,Math.hypot(dx,dz));}return [i,p,+best.toFixed(2)];}).filter(x=>x[2]<1.0);
  return {out,near,close,ghosts:HOL.ghosts.length};}"""
async def main():
    async with Run('dbg', '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/dbg-run') as run:
        fb = fake_date_build(NEW, '2026-10-20T12:00:00')
        g = await run.open(fb, 'web', 'ipad-landscape', 'light', 'dbg', save=save); await start_from_save(g); await g.ev(INSTR); await g.step(3)
        r = await g.ev(JS)
        for s in r['out']:
            print(s['text'], s['loc'], s['pos'], len(s['hits']), 'crossing rays')
            seen=set()
            for h in s['hits']:
                k=(h['col'],h['tris'],tuple(map(tuple,h['tri'])))
                if k in seen: continue
                seen.add(k); print('   ', json.dumps(h))
        print('ghosts near the stage', r['near']); print('ghost spots within 1 m of a big rect', r['close'], 'of', r['ghosts'])
        await run.close(g)
asyncio.run(main())
