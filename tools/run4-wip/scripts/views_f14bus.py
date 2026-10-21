# Run 4 finish, pass 17 M-001: the white zig-zag along the bus shelter's roof in the photographer's bus-stop view (October): what is it?
BUS = "(()=>{closePanel();__goto('city');__setClock(null,11.5);wxForce('sunny');P.x=-14.5;P.z=2.0;P.yaw=Math.atan2(-(-16.2-P.x),-(9.6-P.z));P.pitch=.05;})()"
RAY = r"""(()=>{const W=innerWidth,H=innerHeight,rc=new THREE.Raycaster(),out=[];camera.updateMatrixWorld();
  for(const [px,py] of [[440,311],[470,312],[500,314],[950,325],[970,327],[990,327]]){rc.setFromCamera(new THREE.Vector2(px/W*2-1,-(py/H*2-1)),camera);
    const h=rc.intersectObjects(scene.children,true).filter(q=>q.object.visible&&q.object.material&&q.distance>.3&&q.object.layers.test(camera.layers)&&!q.object.isSprite)[0];
    if(!h){out.push(px+','+py+': sky');continue;}const m=Array.isArray(h.object.material)?h.object.material[0]:h.object.material,p=h.point;
    let best=null,bd=9;for(const pc of HOL.pieces||[]){if(!pc||!Array.isArray(pc.hang)||pc.hang.length<2||!Array.isArray(pc.hang[0])||!Array.isArray(pc.hang[1]))continue;const [x1,y1,z1]=pc.hang[0],[x2,y2,z2]=pc.hang[1];const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz)||1,t=Math.max(0,Math.min(1,((p.x-x1)*dx+(p.z-z1)*dz)/(L*L))),d=Math.hypot(p.x-(x1+dx*t),p.z-(z1+dz*t));if(d<bd){bd=d;best=pc.k+' '+[x1,z1,x2,z2].map(v=>v.toFixed(1)).join(',');}}
    out.push(px+','+py+': '+h.object.type+'/'+(h.object.geometry&&h.object.geometry.type)+' #'+(m.color?m.color.getHexString():'')+(m.transparent?' transparent':'')+' at '+[p.x,p.y,p.z].map(v=>v.toFixed(2)).join(',')+' d '+h.distance.toFixed(1)+' | nearest hung piece: '+best+' ('+bd.toFixed(2)+' m)');}
  return 'holiday '+HOL.cur+', pieces '+(HOL.pieces||[]).length+', a piece: '+JSON.stringify((HOL.pieces||[]).find(q=>q&&q.hang)||(HOL.pieces||[])[0]||null).slice(0,160)+'\n'+out.join('\n');})()"""
VIEWS = [('bus', BUS), ('bus-ray', RAY)]
