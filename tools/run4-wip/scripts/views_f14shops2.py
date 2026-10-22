# Run 4 finish, pass 17 M-015/M-016: who is the figure right at the camera's edge inside the Pet Shop and the Flower shop? (a ray from the camera through it)
import runpy, os
V = runpy.run_path(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'views_f14shops.py'))['VIEWS']
RAY = r"""(()=>{const W=innerWidth,H=innerHeight,rc=new THREE.Raycaster(),out=[];camera.updateMatrixWorld();
  for(const [px,py] of PTS){rc.setFromCamera(new THREE.Vector2(px/W*2-1,-(py/H*2-1)),camera);
    const h=rc.intersectObjects(scene.children,true).filter(q=>{if(!q.object.material||q.object.isSprite)return false;const m=Array.isArray(q.object.material)?q.object.material[0]:q.object.material;if(m.colorWrite===false||m.visible===false)return false;for(let o=q.object;o;o=o.parent)if(!o.visible)return false;return true;})[0];if(!h){out.push(px+','+py+': nothing');continue;}
    let o=h.object,chain=[];while(o&&o!==scene){chain.push((o.type)+(o.name?':'+o.name:'')+(Object.keys(o.userData||{}).length?'{'+Object.keys(o.userData).join(',')+'}':''));o=o.parent;}
    let root=h.object;while(root.parent&&root.parent!==scene&&root.parent!==CUR.g&&root.parent!==CUR.dyn)root=root.parent;
    const lists={SHOPPERS:typeof SHOPPERS!=='undefined'?SHOPPERS:[],WALKERS:typeof WALKERS!=='undefined'?WALKERS:[],FRIEND_ACTORS:typeof FRIEND_ACTORS!=='undefined'?FRIEND_ACTORS:[],PET_ACTORS:typeof PET_ACTORS!=='undefined'?PET_ACTORS:[]};
    const inl=[];for(const k in lists)lists[k].forEach((q,i)=>{for(const v of Object.values(q))if(v===root||(v&&v.root===root)||(v&&v.g===root))inl.push(k+'['+i+']');});
    let anc=h.object,found='';while(anc&&!found){for(const k in lists)lists[k].forEach((q,i)=>{for(const v of Object.values(q))if(v&&(v===anc||v.root===anc||v.g===anc))found=k+'['+i+'] '+JSON.stringify(Object.fromEntries(Object.entries(q).filter(([a,b])=>typeof b!=='object'&&typeof b!=='function'))).slice(0,300);});anc=anc.parent;}
    const p=new THREE.Vector3();root.getWorldPosition(p);
    out.push(px+','+py+': hit at '+h.distance.toFixed(2)+' m; root '+root.type+' at '+[p.x,p.y,p.z].map(v=>v.toFixed(2)).join(',')+' parent '+(root.parent===CUR.g?'CUR.g':root.parent===CUR.dyn?'CUR.dyn':root.parent===scene?'scene':'?')+'; in '+(found||inl.join(',')||'no list')+'\n   chain '+chain.slice(0,7).join(' < '));}
  return 'P '+P.x.toFixed(2)+','+P.z.toFixed(2)+' yaw '+P.yaw.toFixed(2)+'\n'+out.join('\n');})()"""
VIEWS = [V[0], ('ray-pets', RAY.replace('PTS', '[[40,450],[60,380],[20,600]]')), (V[2][0], V[2][1]), ('ray-flowers', RAY.replace('PTS', '[[1330,380],[1320,500],[1350,300]]'))]
