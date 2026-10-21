# Run 4 finish, pass 18 M-015: N18's visit picture (A's big house, from its door): what is the yellow bar at the bottom-right corner?
# Your own home from the save N18 gives A, entered as the check's visitor enters (at the door); the page elements and the 3D thing at that corner
HOME = "(()=>{closePanel();__goto('home');__setClock(null,14.3);__run(4);return 'P '+P.x.toFixed(2)+','+P.z.toFixed(2)+' yaw '+P.yaw.toFixed(2)+' pitch '+P.pitch.toFixed(2);})()"
WHAT = r"""(()=>{const W=innerWidth,H=innerHeight,out=[];for(const [px,py] of [[W-150,H-6],[W-300,H-6],[W-60,H-4]]){const els=document.elementsFromPoint(px,py).slice(0,4).map(e=>e.tagName+(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.split(' ').join('.'):''));
  const rc=new THREE.Raycaster();rc.camera=camera;camera.updateMatrixWorld();rc.setFromCamera(new THREE.Vector2(px/W*2-1,-(py/H*2-1)),camera);
  const h=rc.intersectObjects(scene.children,true).filter(q=>{if(!q.object.material||q.object.isSprite)return false;const m=Array.isArray(q.object.material)?q.object.material[0]:q.object.material;if(m.colorWrite===false)return false;for(let o=q.object;o;o=o.parent)if(!o.visible)return false;return true;})[0];
  let item='';if(h){for(let o=h.object;o;o=o.parent)if(o.userData&&o.userData.row){item=JSON.stringify(o.userData.row);break;}}
  out.push(px+','+py+': page '+els.join(' > ')+' | 3D '+(h?h.object.geometry.type+' #'+((Array.isArray(h.object.material)?h.object.material[0]:h.object.material).color||{getHexString:()=>'?'}).getHexString()+' at '+h.distance.toFixed(2)+' m '+item:'none'));}
  return out.join('\n');})()"""
VIEWS = [('home-door', HOME), ('home-door-what', WHAT)]
