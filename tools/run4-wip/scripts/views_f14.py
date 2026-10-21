# Run 4 finish, f14 (pass 17's kept marks), before and after: the bus shelter's cobwebs in October (the photographer's bus-stop view and both
# corners close), the lake bench (from the town and from behind it), a far grandma's bubble with the bus shelter between her and you (and a near
# one), and the shoppers of nine shops while you stand just inside the door (how near one comes in front of you, over 30 s each)
WALK = "for(const w of WALKERS)if(Math.hypot(w.x-P.x,w.z-P.z)<9){w.x=WP[w.home][0];w.z=WP[w.home][1];w.node=w.home;w.prev=-1;}for(const q of PET_ACTORS){const f=P.yaw;q.x=P.x+Math.sin(f)*2.5;q.z=P.z+Math.cos(f)*2.5;}for(const c of CARS)if(Math.hypot(c.x-P.x,c.z-P.z)<16){c.d+=c.total/2;carPlace(c);}"
def look(x, z, tx, tz, pitch=0.0): return f"P.x={x};P.z={z};P.yaw=Math.atan2(-({tx}-P.x),-({tz}-P.z));P.pitch={pitch};"
BUS = "(()=>{closePanel();__goto('city');__setClock(null,11.5);wxForce('sunny');P.x=-14.5;P.z=2.0;P.yaw=Math.atan2(-(-16.2-P.x),-(9.6-P.z));P.pitch=.05;" + WALK + "})()"
WR = "(()=>{" + look(-15.3, 5.3, -14.55, 7.05, .14) + WALK + "})()"
WL = "(()=>{" + look(-17.1, 5.3, -17.85, 7.05, .14) + WALK + "})()"
LAKE = "(()=>{" + look(58, 58, 69, 69, -.1) + WALK + "})()"
LAKE2 = "(()=>{" + look(57.4, 63.4, 69, 69, -.08) + WALK + "})()"
GPARK = """(()=>{closePanel();__goto('city');__setClock(null,11);wxForce('sunny');let ms=realMs();granPlan(ms);const T=GRAN.T,ip=GRAN_STOPS.findIndex(s=>s.id==='park');
  let k0=-1,g0=-1;for(let k=Math.floor((ms-GRAN.day0)/T)+1;k<GRAN.plan.length-1&&k0<0;k++)for(let j=0;j<GRAN.plan[k].length;j++)if(GRAN.plan[k][j]===ip&&granPose(j,GRAN.day0+k*T+60000).arrived){k0=k;g0=j;break;}   /* (a turn where she has stood at the park for a while) */
  if(k0<0)return 'no park turn';const off=GRAN.day0+k0*T+76000-Date.now();realMs=()=>Date.now()+off;__run(3);const q=GRAN.g[g0];window.__gq=q;""" + look(-10, 4, -22, 16, .05) + WALK + """__run(2);granBubble(q,'The park is the heart of our town.');
  return 'grandma '+g0+' at '+q.x.toFixed(1)+','+q.z.toFixed(1)+', on '+q.on+', '+Math.hypot(q.x-P.x,q.z-P.z).toFixed(1)+' m from you';})()"""
INFO = r"""(()=>{const q=window.__gq;if(!q||!q.bub)return 'no bubble';const b=q.bub,u=b.userData,wp=new THREE.Vector3();b.getWorldPosition(wp);camera.updateMatrixWorld();
  const head=new THREE.Vector3(q.x,1.5,q.z),dir=head.clone().sub(camera.position),dist=dir.length();dir.normalize();const rc=new THREE.Raycaster(camera.position.clone(),dir,.05,dist-.4);rc.camera=camera;
  const h=rc.intersectObjects(scene.children,true).filter(x=>{if(!x.object.material||x.object.isSprite)return false;const m=Array.isArray(x.object.material)?x.object.material[0]:x.object.material;if(m.colorWrite===false||m.transparent&&m.opacity<.5)return false;for(let o=x.object;o;o=o.parent)if(!o.visible)return false;return true;})[0];
  return 'bubble: depthTest '+b.material.depthTest+', opacity '+b.material.opacity.toFixed(2)+', lines '+(u.lines||1).toFixed(2)+', k '+u.k+'; her head hidden from you by: '+(h?h.object.geometry.type+' #'+((Array.isArray(h.object.material)?h.object.material[0]:h.object.material).color||{getHexString:()=>'?'}).getHexString()+' at '+h.distance.toFixed(1)+' m':'nothing')+' (she is '+dist.toFixed(1)+' m away)';})()"""
NEAR = "(()=>{const q=window.__gq;P.x=q.x+2.6;P.z=q.z-1.2;P.yaw=Math.atan2(-(q.x-P.x),-(q.z-P.z));P.pitch=.18;" + WALK + "granBubble(q,'Listen to that fountain! ⛲');return 'near: '+Math.hypot(q.x-P.x,q.z-P.z).toFixed(1)+' m';})()"
NEARI = INFO
STEP = {'market': 0.6, 'pets': 1.5, 'flowers': 0.6, 'cafe': 1.5, 'clothes': 0.6, 'toys': 2.4, 'bakery': 0.6, 'library': 0.6, 'icecream': 0.6}
def shop(k): return f"""(()=>{{closePanel();__goto('{k}');__setClock(null,11);__run(2);P.x-=Math.sin(P.yaw)*{STEP[k]};P.z-=Math.cos(P.yaw)*{STEP[k]};[P.x,P.z]=collideXZ(P.x,P.z,.3,CUR);P.pitch=0;
  const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),cv=Math.cos(55*Math.PI/180);let n=0,n12=0,n17=0,mn=99,fr=0;for(let f=0;f<1800;f++){{AW.t=0;__run(1);fr++;for(const q of SHOPPERS){{if(q.L!==CUR)continue;const dx=q.x-P.x,dz=q.z-P.z,d=Math.hypot(dx,dz);if((dx*fx+dz*fz)/(d||1)<cv)continue;n++;if(d<mn)mn=d;if(d<1.2)n12++;if(d<1.7)n17++;}}}}
  return '{k}: '+fr+' frames, shopper-frames in view '+n+', nearest '+mn.toFixed(2)+' m, within 1.2 m '+n12+', within 1.7 m '+n17+(document.body.classList.contains('away')?' (AWAY)':'');}})()"""
VIEWS = [('web-bus', BUS), ('web-right', WR), ('web-left', WL), ('lake-town', LAKE), ('lake-behind', LAKE2), ('park-bubble', GPARK), ('park-bubble-info', INFO), ('near-bubble', NEAR), ('near-bubble-info', NEARI)] + [('shop-' + k, shop(k)) for k in STEP]
