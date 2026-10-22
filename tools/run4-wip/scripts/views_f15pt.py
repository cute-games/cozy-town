# Run 4 finish, pass 18 M-018: the photographer's fountain shoot on a sideways phone: does the start spot fit everyone's feet in the frame?
WALK = "for(const w of WALKERS)if(Math.hypot(w.x-P.x,w.z-P.z)<9){w.x=WP[w.home][0];w.z=WP[w.home][1];w.node=w.home;w.prev=-1;}for(const q of PET_ACTORS){const f=P.yaw;q.x=P.x+Math.sin(f)*2.5;q.z=P.z+Math.cos(f)*2.5;}for(const c of CARS)if(Math.hypot(c.x-P.x,c.z-P.z)<16){c.d+=c.total/2;carPlace(c);}"
SETUP = "tutEnd();__goto('city');__setClock(null,12);setJob('photo');S.ptTut=1;const d=pt();d.o={id:'px',kind:'family',spot:'park',bg:'fountain',who:['n1','n2','s1'],pet:null,st:'go'};P.x=-22;P.z=11.4;P.yaw=Math.PI;P.pitch=.02;__run(2);ptSetup();"
INFO = r"""(()=>{updateCamera(0);camera.updateMatrixWorld();const F=ptFrame(),Sp=ptSpotOf(pt().o),B=Sp.bgs.find(b=>b.id===PHO.bg);const fits=ptFits(F),bg=ptBgIn(B,F),view=ptView(PHO.group);
  const feet=PHO.group.map(m=>{const q=ptPts(m,1.75*(m.p.b?m.p.b.scale.x:1))[0];return q.y.toFixed(2);});
  return 'camera '+P.x.toFixed(2)+','+P.z.toFixed(2)+' yaw '+P.yaw.toFixed(2)+' pitch '+P.pitch.toFixed(3)+'; frame y '+F.y1.toFixed(2)+'..'+F.y2.toFixed(2)+' x '+F.x1.toFixed(2)+'..'+F.x2.toFixed(2)+'; feet y '+feet.join(',')+'; fits '+fits+' bg '+bg+' view '+view+'; the spot the view set first: -22,11.4';})()"""
TRY = r"""(()=>{const Sp=ptSpotOf(pt().o),B=Sp.bgs.find(b=>b.id===PHO.bg),F=ptFrame(),g=PHO.group,n=g.length,cx=g.reduce((a,m)=>a+m.x,0)/n,cz=g.reduce((a,m)=>a+m.z,0)/n,tv=Math.tan(BASEFOV*PHO.zoom*Math.PI/360),aim=Math.atan(tv*(F.y1+.42*(F.y2-F.y1)));
  const keep=[P.x,P.z,P.yaw,P.pitch],res={};let first=null;for(let d=3.4;d<8.05;d+=.3)for(const da of[0,.2,-.2,.4,-.4]){const a=B.face+da,x=cx+Math.sin(a)*d,z=cz+Math.cos(a)*d,q=collideXZ(x,z,.3,CUR);if(Math.hypot(q[0]-x,q[1]-z)>.05){res.blocked=(res.blocked||0)+1;continue;}
    P.x=x;P.z=z;P.yaw=a;P.pitch=clamp(Math.atan2(.95-1.5,d)-aim,-.3,.05);updateCamera(0);camera.updateMatrixWorld();const f=ptFits(F),b=ptBgIn(B,F),v=ptView(g);const k=(f?'F':'-')+(b?'B':'-')+(v?'V':'-');res[k]=(res[k]||0)+1;if(f&&b&&v&&!first)first=d.toFixed(1)+'/'+da;}
  [P.x,P.z,P.yaw,P.pitch]=keep;updateCamera(0);return 'aim '+aim.toFixed(3)+'; spots tried: '+JSON.stringify(res)+'; first good '+first;})()"""
CARD = "(()=>{ptPoseCard(0);return 'fov '+camera.fov.toFixed(1)+' zoom '+PHO.zoom+' P '+P.x.toFixed(2)+','+P.z.toFixed(2)+' pitch '+P.pitch.toFixed(3);})()"
VIEWS = [('pt-start', "(()=>{" + SETUP + WALK + "})()"), ('pt-start-info', INFO), ('pt-card', CARD), ('pt-card-info', INFO)]

BOX = r"""(()=>{updateCamera(0);camera.updateMatrixWorld();const H=innerHeight,out=[],v=new THREE.Vector3();for(const m of PHO.group){m.root.updateMatrixWorld(true);let lo=-1e9,minY=1e9;
    m.root.traverse(o=>{if(!o.isMesh||o.isSprite)return;const g=o.geometry;if(!g.attributes||!g.attributes.position)return;const pa=g.attributes.position;for(let i=0;i<pa.count;i+=1){v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld);minY=Math.min(minY,v.y);const q=v.clone().project(camera);lo=Math.max(lo,(1-q.y)/2*H);}});
    const r=m.root.position.clone().project(camera);out.push(m.nm+': root y '+m.root.position.y.toFixed(3)+' lowest vertex y '+minY.toFixed(3)+'; root on screen '+((1-r.y)/2*H).toFixed(0)+' px, lowest drawn point '+lo.toFixed(0)+' px');}
  const F=ptFrame();out.push('frame bottom '+((1-F.y1)/2*H).toFixed(0)+' px of '+H);return out.join('\n');})()"""
VIEWS = VIEWS + [('pt-box', BOX)]
