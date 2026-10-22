# Run 4 finish, pass 12: what stands behind the yellow tree at the football field (two dark posts into its crown)?
JS = """(()=>{__goto('city');P.x=-39.6;P.z=49.4;P.yaw=Math.atan2(-(-25-P.x),-(64-P.z));P.pitch=.04;updateCamera(0);camera.updateMatrixWorld();
 const rc=new THREE.Raycaster(),out=[];for(const [sx,sy] of [[395,450],[470,450],[430,330],[470,300],[480,330]]){rc.setFromCamera(new THREE.Vector2(sx/1180*2-1,-(sy/820*2-1)),camera);
  const hs=rc.intersectObjects(scene.children,true).filter(h=>h.object.visible&&h.object.isMesh).slice(0,4);
  out.push([sx,sy].join(',')+': '+hs.map(h=>{const o=h.object,b=new THREE.Box3().setFromObject(o),c=o.material&&o.material.color?o.material.color.getHexString():'';return h.distance.toFixed(1)+'m '+c+' box '+[b.min.x,b.min.y,b.min.z,b.max.x,b.max.y,b.max.z].map(v=>v.toFixed(2)).join(',');}).join(' | '));}
 return out.join('\\n');})()"""
VIEWS = [('football-posts', JS)]
