// injected into c.html page
window.MV=(function(){
const R=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});R.setPixelRatio(1);
const OUT=document.createElement('canvas');const X=OUT.getContext('2d');
function mk(id,o){const g=new THREE.Group();const M=PU[id];M.build(g,Object.assign({},M.dflt,o||{}));
  const bb=new THREE.Box3().setFromObject(g);
  // forward detection: top 30% meshes centre vs whole centre along long horizontal axis
  const sx=bb.max.x-bb.min.x,sz=bb.max.z-bb.min.z,ax=sx>=sz?'x':'z',c=bb.getCenter(new THREE.Vector3());
  const hi=new THREE.Box3();const lim=bb.min.y+(bb.max.y-bb.min.y)*.7;g.updateMatrixWorld(true);
  g.traverse(m=>{if(m.isMesh){const b=new THREE.Box3().setFromObject(m);if(b.max.y>lim)hi.union(b);}});
  const hc=hi.isEmpty()?c:hi.getCenter(new THREE.Vector3());const s=Math.sign(hc[ax]-c[ax])||1;
  g.position.set(-c.x,-bb.min.y,-c.z);
  const inner=new THREE.Group();inner.add(g);
  // rotate so forward = +x
  inner.rotation.y= ax==='x'?(s>0?0:Math.PI):(s>0?Math.PI/2:-Math.PI/2);
  const piv=new THREE.Group();piv.add(inner);// piv: we animate this
  const root=new THREE.Group();root.add(piv);
  root.userData={L:Math.max(sx,sz),H:bb.max.y-bb.min.y,piv,g};return root;}
function scene(bg){const S=new THREE.Scene();S.background=new THREE.Color(bg||'#2a2638');S.add(new THREE.HemisphereLight('#ffffff','#e6d8f0',.65));const D=new THREE.DirectionalLight('#fff3e0',.55);D.position.set(2.5,5,4);S.add(D);return S;}
function ground(S,w,col){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,w),new THREE.MeshLambertMaterial({color:col||'#8fbf6a'}));m.rotation.x=-Math.PI/2;S.add(m);return m;}
function cam(r,cy,yaw,pitch){const C=new THREE.PerspectiveCamera(32,1,.01,500);const d=r/Math.sin(16*Math.PI/180)*1.05;yaw=yaw??.55;pitch=pitch??.3;
  C.position.set(Math.sin(yaw)*Math.cos(pitch)*d,cy+Math.sin(pitch)*d,Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(0,cy,0);C.near=d/100;C.far=d*30;C.updateProjectionMatrix();return C;}
// cells: [{label, setup:()=>({S,C,tick(t)})}]; returns frames as dataURLs
function sheet(cfg){const {cols,cw,ch,cells,frames,title}=cfg;const rows=Math.ceil(cells.length/cols),top=title?34:0;
  const lab=cells.some(c=>c&&c.sub)?40:26,vh=ch-lab;R.setSize(cw,vh,false);OUT.width=cols*cw;OUT.height=rows*ch+top;
  const built=cells.map(c=>c?Object.assign({label:c.label,sub:c.sub},c.setup()):null);const out=[];
  for(let f=0;f<frames;f++){const t=f/frames;X.fillStyle='#1d1a27';X.fillRect(0,0,OUT.width,OUT.height);
    if(title){X.fillStyle='#fff';X.font='bold 20px sans-serif';X.textAlign='left';X.fillText(title,12,24);}
    built.forEach((b,i)=>{if(!b)return;const x=(i%cols)*cw,y=Math.floor(i/cols)*ch+top;b.tick(t);b.C.aspect=cw/vh;b.C.updateProjectionMatrix();R.render(b.S,b.C);X.drawImage(R.domElement,x,y);
      X.strokeStyle='#1d1a27';X.lineWidth=3;X.strokeRect(x,y,cw,ch);
      X.fillStyle='#24202f';X.fillRect(x,y+vh,cw,lab);X.fillStyle='#fff';X.textAlign='center';X.font='bold 15px sans-serif';X.fillText(typeof b.label==='function'?b.label(t):b.label,x+cw/2,y+vh+18);
      if(b.sub){X.font='12px sans-serif';X.fillStyle='#ddd';X.fillText(typeof b.sub==='function'?b.sub(t):b.sub,x+cw/2,y+ch-6);}});
    out.push(OUT.toDataURL('image/png'));}
  return out;}
return {mk,scene,ground,cam,sheet};})();
