LIST = r"""(()=>{closePanel();__goto('city');__setClock(null,11.5);const out=[];for(const p of HOL.pieces||[]){if(!p)continue;const x=p.x!==undefined?p.x:(p.hang?p.hang[0][0]:null),z=p.z!==undefined?p.z:(p.hang?p.hang[0][2]:null);
  if(x===null)continue;const near=(p.hang?p.hang.some(h=>h[0]>-20.5&&h[0]<-12&&h[2]>5.5&&h[2]<9.5):false)||(x>-20.5&&x<-12&&z>5.5&&z<9.5);if(near)out.push(JSON.stringify(p).slice(0,200));}
  let meshes=[];if(HOL.g)HOL.g.traverse(o=>{if(!o.isMesh)return;const b=new THREE.Box3().setFromObject(o);if(b.max.x>-19&&b.min.x<-13.5&&b.max.z>6.3&&b.min.z<7.4&&b.max.y>1.9)meshes.push(o.geometry.type+' #'+((Array.isArray(o.material)?o.material[0]:o.material).color||{getHexString:()=>'?'}).getHexString()+' box '+[b.min.x,b.min.y,b.min.z,b.max.x,b.max.y,b.max.z].map(v=>v.toFixed(2)).join(','));});
  return out.join('\n')+'\nmeshes over the roof front: '+meshes.slice(0,8).join(' | ');})()"""
VIEWS = [('list', LIST)]
