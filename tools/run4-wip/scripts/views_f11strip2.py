# Run 4 finish, pass 14: the dark strip at the bottom-right during a photo shoot is in the 3D view: what does the camera see there?
JS = """(()=>{__goto('city');__setClock(null,12);setJob('photo');S.ptTut=1;const d=pt();if(!d.o)ptNew();const o=d.o;if(!o)return 'no booking';const sp=PT_SPOTS[o.spot];P.x=sp.at[0];P.z=sp.at[1]-1.2;__run(3);ptSetup();__run(5);updateCamera(0);camera.updateMatrixWorld();
  const rc=new THREE.Raycaster(),out=[];const kids=camera.children.map(c=>(c.name||c.type)+':'+c.visible);out.push('camera children: '+kids.join(','));
  for(const [sx,sy] of [[1150,817],[1100,817],[1150,812]]){rc.setFromCamera(new THREE.Vector2(sx/innerWidth*2-1,-(sy/innerHeight*2-1)),camera);const hs=rc.intersectObjects(scene.children,true).filter(h=>h.object.visible).slice(0,3);
   out.push(sx+','+sy+': '+hs.map(h=>{let o=h.object,ch=[];while(o&&ch.length<4){ch.push(o.name||o.type);o=o.parent;}const m=h.object.material;return h.distance.toFixed(2)+'m '+(m&&m.color?m.color.getHexString():'')+' side '+(m&&m.side)+' ['+ch.join('<')+']';}).join(' | '));}
  return out.join('\\n');})()"""
VIEWS = [('shoot-strip2', JS)]
