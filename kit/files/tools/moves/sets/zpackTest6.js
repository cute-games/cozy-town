/* packTest6 — built file: movespack/zpackTest6.body.js only. Rebuild: movespack/build.sh */
/* ===== packTest6: round 4 (show staff, c15 tank coil, c15 shop stairs, owl perch, seal slide), c15 models, only COZY_MOVES ===== */
(()=>{const H=window.MVH,MV2=window.COZY_MOVES;const {cell,dbg,seg,bell,ease,cl}=H;const P_=Math.PI,TAU=2*P_;const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const v=new THREE.Vector3(),bb=new THREE.Box3();
function lowOf(obj){obj.updateMatrixWorld(true);bb.makeEmpty();obj.traverseVisible(o=>{if(!o.isMesh||!o.geometry||o.userData.noGround)return;const pa=o.geometry.attributes.position;for(let i=0;i<pa.count;i+=pa.count>400?2:1)bb.expandByPoint(v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld));});return bb;}
const W={};function chk(lab,root,r,fy){const low=lowOf(root).min.y-(fy||0);if(!(r&&r.lift)&&!(r&&r.noGround)&&Math.abs(low)>.006&&Math.abs(low)>Math.abs(W[lab]||0)){W[lab]=low;dbg('GROUND',lab,'low',low.toFixed(3));}}
function world(cx,cz,col){const S=H.scene();const tex=H.grassTex(col||'#8fbf6a','#7aad57');tex.repeat.set(120,120);const f=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshLambertMaterial({map:tex}));f.rotation.x=-P_/2;f.position.set(cx||0,-.012,cz||0);S.add(f);return S;}
function camLook(p,t,fov){const C=new THREE.PerspectiveCamera(fov||32,1,.05,400);C.position.set(...p);C.lookAt(...t);C.updateProjectionMatrix();return C;}
function grab(id,opt,fn){let got=null;const og=window[fn];window[fn]=function(...a){const r=og.apply(this,a);if(!got)got=r;return r;};try{PU[id].build(new THREE.Group(),Object.assign({},PU[id].dflt||{},opt||{}));}finally{window[fn]=og;}return got;}
function gearP(S,id,o){const g=new THREE.Group();PU[id].build(g,Object.assign({},PU[id].dflt||{},o||{}));S.add(g);return g;}
function surfY(G,x,z,flt){G.updateMatrixWorld(true);const ms=[];G.traverse(q=>{if(q.isMesh&&q.material.side!==THREE.BackSide&&(!flt||flt(q)))ms.push(q);});const h=new THREE.Raycaster(V(x,40,z),V(0,-1,0)).intersectObjects(ms,false)[0];return h?h.point.y:0;}
const look=Object.assign({},DEFAULT_LOOK,{top:'#ff7aa8',bottom:'#3d3550',hat:'none'});
const BLOOK={skin:'#d9a06b',hair:'#1f1a2e',style:'short',top:'#3d4a7a',bottom:'#2e2347',shoes:'#2e2347',hat:'tophat',glasses:'glasses'};
const toW=(m,a)=>{const r=m.root||m;r.updateMatrixWorld(true);return r.localToWorld(V(...a).divide(r.scale));};   /* root frame (metres) to world */
function brushMk(S){const g=new THREE.Group();const m=c=>new THREE.MeshLambertMaterial({color:c});const b=new THREE.Mesh(new THREE.BoxGeometry(.26,.12,.05),m('#c98f5e'));g.add(b);const br=new THREE.Mesh(new THREE.BoxGeometry(.24,.1,.05),m('#3a2a22'));br.position.z=.045;g.add(br);S.add(g);return g;}

/* 1 grooming: the horse faces +x at z 0; Ieva (a coach) stands at its right side facing it, brushing */
function cGroom(){return cell('Ieva grooms the horse','person.groom + horse.groomed (brush: stand-in)',()=>{const S=world();const hr=farmAnimal('horse',FARM_COLS.horse[0],'adult');S.add(hr.root);hr.root.rotation.y=P_/2;
  const I=grab('farm:coach',{v:'ieva'},'makePerson');S.add(I.root);I.root.position.set(.25,0,.7);I.root.rotation.y=P_;const br=brushMk(S);
  const C=camLook([1.4,2.4,4.2],[0,1.15,.4],32);
  return {S,C,tick:t=>{const sec=t*6;const rh=MV2.play(hr,'horse.groomed',sec,{look:-.32});chk('groomed horse',hr.root,rh);const r=MV2.play(I,'person.groom',sec,{dist:.3,dir:1});chk('groom person',I.root,r);
    br.position.copy(toW(I,r.brush.p));br.quaternion.copy(I.root.quaternion).multiply(new THREE.Quaternion(...r.brush.q));}};});}
/* 2 talk + directTo: Ieva talks to the player, then directs them to Stan (target to her left front) */
function cDirect(){return cell('Ieva directs you to Stan','person.talk + coach.directTo',()=>{const S=world();const I=grab('farm:coach',{v:'ieva'},'makePerson');S.add(I.root);
  const P=makePerson(look);S.add(P.root);P.root.position.set(0,0,1.6);P.root.rotation.y=P_;const St=grab('farm:coach',{v:'stan'},'makePerson');S.add(St.root);St.root.position.set(-3.2,0,2.2);St.root.rotation.y=P_/2;
  const C=camLook([3.0,2.0,4.4],[-.6,1.0,.9],36);
  return {S,C,tick:t=>{const sec=t*8;const r=sec<3?MV2.play(I,'person.talk',sec,{}):sec<7?MV2.play(I,'coach.directTo',sec-3,{target:[-3.2,0,2.2]}):MV2.play(I,'person.talk',sec-7,{});chk('ieva',I.root,r);
    chk('player',P.root,MV2.play(P,'person.talk',sec+.4,{}));chk('stan',St.root,MV2.play(St,'person.idle',sec,{}));}};});}
/* 3 the license on the real podium (show:area): player on step 1, Sir Barkley on step 2, the card (show:license) */
const STEP1=.98,STEP2=.68;
function cPodium(){return cell('License on the podium','giveCard (step 2) · takeCard (step 1) · show:license',()=>{const S=world(-30,20);gearP(S,'show:area',{people:'no'});
  const Pl=makePerson(look),B=makePerson(BLOOK);S.add(Pl.root);S.add(B.root);const thP=Math.atan2(.6,.8)*0+Math.atan2(.6*1,-.8*-1),thB=Math.atan2(.6,-.8);
  /* heading for a model facing +z: yaw = atan2(dx,dz); the preview's thP faces (.6,.8)→(x .6, z -.8 world) */
  Pl.root.position.set(-35.85,STEP1,17.12);Pl.root.rotation.y=Math.atan2(.6,.8);B.root.position.set(-35.86,STEP2,17.86);B.root.rotation.y=Math.atan2(.6,-.8);
  const card=new THREE.Group();const ci=new THREE.Group();PU['show:license'].build(ci,{lv:'1'});ci.position.y=-.035;card.add(ci);S.add(card);
  /* the meeting point: between the two near shoulders, a little lower */
  MV2.play(Pl,'person.idle',0,{});MV2.play(B,'person.idle',0,{});Pl.root.updateMatrixWorld(true);B.root.updateMatrixWorld(true);
  const near=(m,o)=>{const op=o.root.position;const d=m.arms.map(a=>a.getWorldPosition(V(0,0,0)).distanceTo(op));return d[0]<d[1]?0:1;};const pi=near(Pl,B),bi=near(B,Pl);const sp=Pl.arms[pi].getWorldPosition(V(0,0,0)),sb=B.arms[bi].getWorldPosition(V(0,0,0));const Tw=sp.clone().lerp(sb,.5).add(V(.28,-.2,0));
  const inR=(m,w)=>{const r=m.root;r.updateMatrixWorld(true);return r.worldToLocal(w.clone()).multiply(r.scale).toArray();};const TP=inR(Pl,Tw),TB=inR(B,Tw),AUD=inR(Pl,V(-30,1.2,17.5));   /* the audience is toward the fountain (+x) */dbg('podium meet',Tw.toArray().map(x=>x.toFixed(2)).join(','));
  const C=camLook([-31.4,2.5,17.5],[-35.7,1.55,17.5],32);
  return {S,C,tick:t=>{const sec=t*6;const rb=MV2.play(B,'person.giveCard',sec,{target:TB,hand:bi});chk('barkley',B.root,rb,STEP2);
    const rp=sec<.9?MV2.play(Pl,'person.idle',sec,{}):MV2.play(Pl,'person.takeCard',sec-.9,{target:TP,hand:pi,showTo:AUD});chk('player',Pl.root,rp,STEP1);
    const cp=rb.cardPose||(sec>=.9&&rp.cardPose)||null;const who=rb.cardPose?B:Pl;card.visible=!!cp&&sec<5.4;if(cp){card.position.copy(toW(who,cp.p));card.rotation.set(-.12,Math.atan2(C.position.x-card.position.x,C.position.z-card.position.z),0);}}};});}   /* like the preview, the card faces the camera */
/* 4 the snake in the c15 tank: asleep coiled in the hide, out, looks, back in, coils again */
function cSnake(){return cell('Snake + c15 tank','sleeps coiled in the hide, out, back, coils',()=>{const S=world(0,0,'#d8b386');gearP(S,'home:tank');const m=puPet('snake',null,'adult');S.add(m.root);const TP=MV2.examples.tankPath();
  dbg('c15 tank path len',TP.len.toFixed(2),'out',TP.out.map(x=>x.toFixed(2)),'in',TP.in.map(x=>x.toFixed(2)));const C=camLook([1.9,.75,3.6],[-.1,.3,.55],32);const T=14;
  /* clip check: the front lip (glass + rail, top .29), the bottom rails and the corner posts (c15 tank boxes, 3 mm margin) */
  const BX=[[-1.25,0,.42,1.25,.29,.45],[-1.27,0,-.47,1.27,.06,.47],[-1.25,0,.41,-1.21,1.21,.45],[1.21,0,.41,1.25,1.21,.45]].map(q=>new THREE.Box3(V(q[0],q[1],q[2]).addScalar(.003),V(q[3],q[4],q[5]).addScalar(-.003)));let pen=0,penAt='';
  return {S,C,tick:t=>{const sec=t*T;
    if(sec>0){m.root.updateMatrixWorld(true);}
    if(sec<1.2)MV2.play(m,'snake.sleepHide',sec,{pts:TP.pts,s:TP.out[0]});
    else if(sec<6)MV2.play(m,'snake.path',sec,{pts:TP.pts,s:TP.out[0]+(TP.out[1]-TP.out[0])*ease((sec-1.2)/4.8)});
    else if(sec<8)MV2.play(m,'snake.look',sec-6,{pts:TP.pts,s:TP.out[1]});
    else if(sec<12.6)MV2.play(m,'snake.path',sec,{pts:TP.pts,s:TP.in[0]+(TP.in[1]-TP.in[0])*ease((sec-8)/4.6)});
    else MV2.play(m,'snake.sleepHide',sec-12.6,{pts:TP.pts,s:TP.in[1]});
    m.root.updateMatrixWorld(true);m.root.traverseVisible(q=>{if(!q.isMesh||q.material.side===THREE.BackSide)return;const pa=q.geometry.attributes.position;for(let i=0;i<pa.count;i+=2){v.fromBufferAttribute(pa,i).applyMatrix4(q.matrixWorld);for(const b of BX)if(b.containsPoint(v)){const d=Math.min(v.y-b.min.y,b.max.y-v.y);if(d>pen){pen=d;penAt='t'+t.toFixed(3)+' '+v.toArray().map(x=>x.toFixed(2)).join(',');}}}});
    if(t>=71/72-1e-6)dbg('TANK CLIP (lip, rails, posts)',pen.toFixed(3),penAt);}};});}
function cSleep(){return cell('Snake asleep, coiled','snake.sleepHide (c15 hide)',()=>{const S=world(0,0,'#d8b386');gearP(S,'home:tank');const m=puPet('snake',null,'adult');S.add(m.root);const TP=MV2.examples.tankPath();
  const C=camLook([-.5,.75,1.6],[-.6,.25,.05],32);return {S,C,tick:t=>{MV2.play(m,'snake.sleepHide',t*4.5,{pts:TP.pts,s:TP.sleep});}};});}
/* 5 the c15 shop stairs: 14 even steps (.2386 up, .2929 deep); the dog 1.4 m behind the player */
function cStairs(){return cell('c15 shop stairs','player + dog 1.4 m behind',()=>{const S=world(0,0,'#f6ecd8');const rise=.2386,run=.2929,n=14,o={rise,run,n};const Wg=new THREE.Group();S.add(Wg);Wg.rotation.y=P_/2;
  for(let k=0;k<n;k++){const h=(k+1)*rise;const q=new THREE.Mesh(new THREE.BoxGeometry(1.6,h,run),new THREE.MeshLambertMaterial({color:k%2?'#e0c49a':'#d4b48a'}));q.position.set(0,h/2,k*run+run/2);Wg.add(q);}
  const P=makePerson(look),D=makePet('dog',PET_TYPES.dog.cols[0]);Wg.add(P.root);Wg.add(D.root);P.root.position.x=.35;D.root.position.x=-.35;const T=8,d1=n*run+.3;const C=camLook([2.2,2.6,7.4],[2.2,1.6,0],40);
  return {S,C,tick:t=>{const sec=t*T;const dp=-.3+(d1+1.7)*ease(cl(sec/7.6));const dd=Math.min(dp-1.4,dp-.3);P.root.position.z=dp;D.root.position.z=dd;P.root.position.y=0;D.root.position.y=0;
    MV2.play(P,'person.stairs',sec,Object.assign({dist:dp},o));MV2.play(D,'pet.stairs',sec,Object.assign({dist:dd},o));}};});}
/* 6 owl on the real shop perch (shop:tree perch plank) */
function cOwl(){return cell('Owl on the shop perch','owl.perch on the c15 perch plank',()=>{const S=world(0,0,'#f6ecd8');gearP(S,'shop:playhill');const T=gearP(S,'shop:tree');
  const a=.3,bx=Math.cos(a)*.83,bz=Math.sin(a)*.83;const by=surfY(T,bx,bz,q=>q.material.color&&q.material.color.getHexString()==='c98f5e');dbg('owl perch y',by.toFixed(3));
  const m=grab('age:owl',{age:'adult'},'makePet');S.add(m.root);m.root.position.set(bx,by,bz);m.root.rotation.y=Math.atan2(-Math.cos(a),-Math.sin(a))+P_/2;
  const yw=Math.atan2(-Math.sin(a),Math.cos(a)),dc=.62/Math.sin(16*P_/180)*1.05;const C=camLook([bx+Math.sin(yw)*Math.cos(.08)*dc,by+.42+Math.sin(.08)*dc,bz+Math.cos(yw)*Math.cos(.08)*dc],[bx,by+.42,bz],32);return {S,C,tick:t=>{const r=MV2.play(m,'owl.perch',t*5,{});chk('owl',m.root,r,by);}};});}
/* 7 seal: down the bigger c15 pool's slide (angle .641), swims, galumphs back up */
function cSeal(){return cell('Seal: c15 pool slide','seal.slide (o.slope) · swim · galumph up',()=>{const S=world(0,0,'#f6ecd8');const G=gearP(S,'shop:sealpool');const wy=surfY(G,0,0),top=surfY(G,-2.5,-.6);dbg('seal water',wy.toFixed(2),'deck',top.toFixed(2));
  const sa=Math.atan2(1.68-.56,1.5),ST=[-1.8,top+.025],SL=Math.hypot(1.5,1.12);const m=puPet('seal',null,'adult');S.add(m.root);const C=camLook([.2,2.6,4.6],[-.6,.6,-.4],38);
  const line=x=>ST[1]-(x-ST[0])*Math.tan(sa);
  return {S,C,tick:t=>{const sec=t*9;let r;
    if(sec<2){const u=ease(sec/2),x=ST[0]+Math.cos(sa)*SL*.95*u;m.root.position.set(x,line(x),-.6);m.root.rotation.y=P_/2;r=MV2.play(m,'seal.slide',sec,{slope:{pitch:-sa}});}
    else if(sec<5){const u=(sec-2)/3,a2=TAU*u;m.root.position.set(.35+.5*Math.sin(a2),wy-.32,-.6+.5*(1-Math.cos(a2)));m.root.rotation.y=P_/2-a2;r=MV2.play(m,'seal.swim',sec,{});}
    else{const u=ease((sec-5)/4),x=ST[0]+Math.cos(sa)*SL*.95*(1-u);m.root.position.set(x,line(x),-.6);m.root.rotation.y=-P_/2;r=MV2.play(m,'seal.galumph',sec,{dist:u*SL,slope:{pitch:sa}});}}};});}
CLIPS2.packTest6={title:'Moves pack round 4: show staff, c15 tank coil, c15 shop (only COZY_MOVES)',cols:4,cw:300,ch:250,frames:72,cells:[cGroom(),cDirect(),cPodium(),cSnake(),cSleep(),cStairs(),cOwl(),cSeal()]};
})();
