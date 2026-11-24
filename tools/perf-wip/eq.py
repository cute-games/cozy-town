import asyncio, json, sys, os
sys.argv=[sys.argv[0],sys.argv[1],'eq']
exec(open('/home/claude/w/pfs/measure.py').read().split('async def main')[0])
J=r"""()=>{const _i2=new THREE.Matrix4(),_m2=new THREE.Matrix4(),_v2=new THREE.Vector3(),_b2=new THREE.Box3();function newBox(root,obj,out,skip,precise){root.updateMatrixWorld(true);_i2.copy(root.matrixWorld).invert();out.makeEmpty();
  const walk=o=>{if(!o.visible||(skip&&skip.has(o)))return;
    if(o.isMesh&&!o.userData.noGround&&o.geometry){const g=o.geometry;_m2.multiplyMatrices(_i2,o.matrixWorld);const pa=g.attributes&&g.attributes.position;
      if(precise!==false&&pa&&pa.count<=1200){const st=pa.count>400?2:1;
        if(pa.isInterleavedBufferAttribute||pa.normalized||pa.itemSize!==3)for(let i=0;i<pa.count;i+=st)out.expandByPoint(_v2.fromBufferAttribute(pa,i).applyMatrix4(_m2));
        else{const A=pa.array,e=_m2.elements,n=pa.count,mn=out.min,mx=out.max;let x0=mn.x,y0=mn.y,z0=mn.z,x1=mx.x,y1=mx.y,z1=mx.z;   /* ⚡ speed: the same sums as applyMatrix4 + expandByPoint, read straight from the array (no garbage; pets and animals do this every frame) */
          for(let i=0;i<n;i+=st){const j=i*3,x=A[j],y=A[j+1],z=A[j+2],w=1/(e[3]*x+e[7]*y+e[11]*z+e[15]),px=(e[0]*x+e[4]*y+e[8]*z+e[12])*w,py=(e[1]*x+e[5]*y+e[9]*z+e[13])*w,pz=(e[2]*x+e[6]*y+e[10]*z+e[14])*w;
            x0=Math.min(x0,px);y0=Math.min(y0,py);z0=Math.min(z0,pz);x1=Math.max(x1,px);y1=Math.max(y1,py);z1=Math.max(z1,pz);}
          mn.set(x0,y0,z0);mx.set(x1,y1,z1);}}
      else{if(!g.boundingBox)g.computeBoundingBox();_b2.copy(g.boundingBox).applyMatrix4(_m2);out.union(_b2);}}
    for(const c of o.children)walk(c);};
  walk(obj);return out;};const _i=new THREE.Matrix4(),_mm=new THREE.Matrix4(),_vv=new THREE.Vector3(),_b=new THREE.Box3();
function oldBox(root,obj,out,skip,precise){root.updateMatrixWorld(true);_i.copy(root.matrixWorld).invert();out.makeEmpty();
  const walk=o=>{if(!o.visible||(skip&&skip.has(o)))return;
    if(o.isMesh&&!o.userData.noGround&&o.geometry){const g=o.geometry;_mm.multiplyMatrices(_i,o.matrixWorld);const pa=g.attributes&&g.attributes.position;
      if(precise!==false&&pa&&pa.count<=1200){const st=pa.count>400?2:1;for(let i=0;i<pa.count;i+=st)out.expandByPoint(_vv.fromBufferAttribute(pa,i).applyMatrix4(_mm));}
      else{if(!g.boundingBox)g.computeBoundingBox();_b.copy(g.boundingBox).applyMatrix4(_mm);out.union(_b);}}
    for(const c of o.children)walk(c);};walk(obj);return out;}
 let n=0,diff=0,maxd=0;const roots=[...PET_ACTORS.map(e=>e.m||e.p||e),...(FARM.an||[]).map(a=>a.m),...(FARM.hs||[]).map(a=>a.m),...PEN.map(a=>a.m)].filter(Boolean);
 for(const m of roots){const root=m.root||m;const objs=[];root.traverse(o=>{if(o.isMesh||o.isGroup)objs.push(o);});
  for(const o of objs.slice(0,40)){const a=newBox(root,o,new THREE.Box3()),b=oldBox(root,o,new THREE.Box3());n++;
   const d=Math.max(...['x','y','z'].flatMap(k=>[Math.abs(a.min[k]-b.min[k])||0,Math.abs(a.max[k]-b.max[k])||0]));if(!(a.isEmpty()&&b.isEmpty())&&d>0){diff++;maxd=Math.max(maxd,d);}}}
 return {roots:roots.length,boxes:n,diff,maxd};}"""
async def main():
  async with Run('pf-eq','/home/claude/w/pfs/run-eq') as run:
    g=await begin(run,open(GAME,'rb').read(),PROFILE,'pf-eq',dict(SAVE,name='ZZTEST-PERF'))
    await g.ev(INSTALL)
    await g.ev(AREAS['fields'].replace('H;',D%12)); await g.step(40); await g.ev("()=>{farmLiveAll();}"); await g.step(20)
    print(json.dumps(await g.ev(J)))
    await g.ev(AREAS['petshop'].replace('H;',D%12)); await g.step(40); print(json.dumps(await g.ev(J)))
asyncio.run(main())
