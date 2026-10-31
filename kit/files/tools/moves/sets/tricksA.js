(()=>{const H=window.MVH;const {cell,mk,walkP,lieP,sitP,wag,jumpArc,spec,legAvg,birdLie,dbg,cl,ease,seg,bell,S2,C2,P_,TAU,scene,grassTex}=H;
/* Pet Show tricks, set A: dogs, cat, bunny, hamster, capybara, duck. Rigid parts turning at joints only. */
const RO={rigid:true};
function RP(id,o){let R;if(id==='age:capybara')R=mk(id,{v:'real',age:'adult'},undefined,undefined,RO);else R=mk(id,Object.assign({age:'adult'},id==='age:pomchi'?{v:'game'}:{},o||{}),undefined,undefined,RO);   /* pomchi: Karolis kept TODAY's pomchi (model-pug-pomchi-clear), not the new one */
  if(id==='age:pomchi'){/* today's pomchi: the curled tail sits on top of the back; hinge it where it meets the body (the default pivot is below it, so it swung off) */
    const DX=.04,DY=-.08;/* the puff tail floats a little above the rump in the model itself: seat it on the body as one rigid piece */
    R.parts.filter(p=>p.role[0]==='tail').forEach(p=>{for(let k=0;k<p.rest.length;k+=3){p.rest[k]+=DX;p.rest[k+1]+=DY;}p.bb.translate(new THREE.Vector3(DX,DY,0));});
    const tp=R.parts.filter(p=>p.role[0]==='tail'&&!p.outline);if(tp.length){const bx=Math.max(...tp.map(p=>p.bb.max.x)),by=Math.min(...tp.map(p=>p.bb.min.y));R.tail={x:bx-.05,y:by+.03};}}
  if(id==='age:duck')R.arms.forEach(a=>{a.wz=a.z;});/* duck wings hinge at the top centre of each wing (Living round 43) */
  return R;}
function world(){const S=scene();const tex=grassTex('#8fbf6a','#7aad57');tex.repeat.set(80/1.1,80/1.1);const g=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshLambertMaterial({map:tex}));g.rotation.x=-P_/2;S.add(g);return S;}
function camAt(tx,ty,tz,r,yaw,pitch){const d=r/Math.sin(16*P_/180)*1.05;const C=new THREE.PerspectiveCamera(32,1,.01,500);
  C.set=(x,y,z)=>{C.position.set(x+Math.sin(yaw)*Math.cos(pitch)*d,y+Math.sin(pitch)*d,z+Math.cos(yaw)*Math.cos(pitch)*d);C.lookAt(x,y,z);};C.set(tx,ty,tz);C.near=d/100;C.far=d*30;C.updateProjectionMatrix();return C;}
function gear(S,id,o,s,ry,x,y,z){const W=new THREE.Group(),g=new THREE.Group();const M=PU[id];M.build(g,Object.assign({},M.dflt||{},o||{}));W.add(g);W.scale.setScalar(s||1);W.rotation.y=ry||0;W.position.set(x||0,y||0,z||0);S.add(W);return {W,g};}
function addPet(S,R){S.add(R.root2);RIG.addShadow(R,S);return R;}
const nearF=R=>R.legs.findIndex(l=>l.front&&l.side>0);
const hindX=R=>Math.min(...R.legs.filter(l=>!l.front).map(l=>l.x));
function tuck(R,P,k,b){P.hip=P.hip||[];P.knee=P.knee||[];b=b||1;R.legs.forEach((l,i)=>{P.hip[i]=(P.hip[i]||0)+(l.front?.75:-.75)*k*b;P.knee[i]=(P.knee[i]||0)+(l.front?-1.15:1.15)*k*b;});return P;}
function stretch(R,P,k){P.hip=P.hip||[];R.legs.forEach((l,i)=>{P.hip[i]=(P.hip[i]||0)+(l.front?.6:-.75)*k;});return P;}
function squash(P,k){P.root=P.root||{};P.root.sq=(P.root.sq||1)*(1-.12*k);return P;}
/* gear collision check: count pet vertices inside the chosen gear boxes over the loop */
function boxesOf(G,f){G.W.updateMatrixWorld(true);const out=[];G.g.traverse(m=>{if(m.isMesh&&(!f||f(m))){const b=new THREE.Box3().setFromObject(m);b.expandByScalar(-.012);if(!b.isEmpty())out.push(b);}});return out;}
function hits(R,boxes){R.root2.updateMatrixWorld(true);let n=0;const v=new THREE.Vector3();for(const p of R.parts){const a=p.geo.attributes.position.array,M=p.mesh.matrixWorld;for(let k=0;k<a.length;k+=9){v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M);for(const b of boxes)if(b.containsPoint(v)){n++;break;}}}return n;}
function minY(R){R.root2.updateMatrixWorld(true);let m=1e9;const v=new THREE.Vector3();for(const p of R.parts){const a=p.geo.attributes.position.array,M=p.mesh.matrixWorld;for(let k=0;k<a.length;k+=9){v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M);if(v.y<m)m=v.y;}}return m;}
function audit(name,tick,R,boxes,N){let worst=0,wt=0,lo=1e9,hi=-1e9,ht=0;for(let f=0;f<(N||60);f++){const t=f/(N||60);tick(t);const h=boxes?hits(R,boxes):0;if(h>worst){worst=h;wt=t;}const m=minY(R)-R.root2.position.y;lo=Math.min(lo,m);if(m>hi){hi=m;ht=t;}}dbg(name,'gear hits max',worst,'at t',wt.toFixed(3),'minY',lo.toFixed(3),'maxMinY',hi.toFixed(3),'at',ht.toFixed(3));tick(0);}
function shadowAt(R){R.root2.updateMatrixWorld(true);const c=R.root.localToWorld(new THREE.Vector3(R.bodyC.x,R.bodyC.y,0));R.shadow.position.set(c.x,R.root2.position.y+.004*R.H,c.z);R.shadow.scale.set(R.L*.5,R.W*.6,1);R.shadow.material.opacity=.3;}
/* path of lines and arcs in the ground plane: ['L',x0,z0,x1,z1] or ['A',cx,cz,r,a0,a1] */
function path(segs){const L=segs.map(s=>s[0]==='L'?Math.hypot(s[3]-s[1],s[4]-s[2]):Math.abs(s[5]-s[4])*s[3]);const tot=L.reduce((a,b)=>a+b,0);
  return {tot,at(d){d=((d%tot)+tot)%tot;let i=0;while(i<segs.length-1&&d>L[i]){d-=L[i];i++;}const s=segs[i],u=L[i]?d/L[i]:0;
    if(s[0]==='L'){const dx=s[3]-s[1],dz=s[4]-s[2];return {x:s[1]+dx*u,z:s[2]+dz*u,h:Math.atan2(-dz,dx)};}
    const a=s[4]+(s[5]-s[4])*u,sg=Math.sign(s[5]-s[4]);return {x:s[1]+s[3]*Math.cos(a),z:s[2]+s[3]*Math.sin(a),h:Math.atan2(-Math.cos(a)*sg,-Math.sin(a)*sg)};}};}

/* ---------- shared trick poses (per-pet settings in o) ---------- */
/* high five: sit, raise the near front paw, two taps (or a wave), paw down, stand */
function hi5P(R,t,o){o=o||{};const P={hip:[],knee:[],abd:[]};const k=seg(t,.05,.18)*(1-seg(t,.82,.95));if(k)sitP(R,k,P);
  const i=nearF(R);const a=seg(t,.2,.32)*(1-seg(t,.68,.8));
  const tap=o.wave?0:bell(t,.38,.47)+bell(t,.5,.59);const wv=o.wave?S2((t-.32)/.36*o.wave)*bell(t,.32,.68):0;
  if(a){P.hip[i]=(P.hip[i]||0)+(o.up??1.7)*a+.3*tap;P.knee[i]=(P.knee[i]||0)+(o.kn??0)*a;P.abd[i]=((o.out??-.3)-(o.wave?.4*wv:0))*a;}
  P.hp=(P.hp||0)+(o.hp??.55)*a;P.hy=(P.hy||0)+(o.hy??0)*a;P.root=P.root||{};wag(P,t,o.wf||10,o.wa??(.25+.5*k));return P;}
/* roll over: lie down, roll over the back (belly shows), stand, little shake */
function rollP(R,t,o){o=o||{};const P={hip:[],knee:[]};const k=seg(t,.04,.15)*(1-seg(t,.83,.93));lieP(R,k,P);
  const r1=seg(t,.17,.47),r2=seg(t,.52,.82);const rot=-TAU*r1+TAU*r2;const D=o.D||2.2*R.W;
  if(rot){P.root.rx=rot;P.root.piv=[R.bodyC.x,R.bodyC.y*.8,0];P.root.y=-R.H;const up=Math.abs(Math.sin(rot/2));
    R.legs.forEach((l,i)=>{P.hip[i]+=(l.front?-.45:.35)*up;P.knee[i]+=(l.front?.3:-.5)*up+.2*up*S2(t*8+i*.25);});P.hp=(P.hp||0)-.2*up;}
  P.root.z=-D*(r1-r2);
  const sh=bell(t,.93,1);if(sh){P.root.rx=(P.root.rx||0)+.12*sh*S2(t*25);}
  P.hy=(P.hy||0)-.3*bell(t,.47,.52);wag(P,t,o.wf||10,o.wa??.5);return P;}
/* rear-up pirouette on the hind feet */
function pirP(R,t,o){o=o||{};const P={hip:[],knee:[]};const hx=hindX(R);const k=seg(t,.08,.22)*(1-seg(t,.74,.88));const ang=(o.rear||.95)*k;
  P.root={rz:ang,piv:[hx,0,0],ry:TAU*seg(t,.24,.72)};R.legs.forEach((l,i)=>{if(l.front){P.hip[i]=.7*k;P.knee[i]=-1.3*k;}else P.hip[i]=-ang;});
  P.hp=-.65*ang;P.tp=-.4*k;P.hy=-.25*bell(t,.74,.95);wag(P,t,6,.3);return P;}

/* =================== DOGS =================== */
function dogHi5(){return cell('Dog · High five','starter',()=>{const S=world();const R=addPet(S,RP('age:dog'));const C=camAt(.05,.4,0,.62,.4,-.1);
  return {S,C,tick:t=>{RIG.pose(R,hi5P(R,t));}};});}
function dogsHi5(){return cell('Sausage dog · Pug · Pomchi','same High five, every size',()=>{const S=world();const ids=['age:sausage','age:pug','age:pomchi'];const off=[-.95,0,.8];const yaw=.4;
  const ax=[Math.cos(yaw),-Math.sin(yaw)];const Rs=ids.map((id,j)=>{const R=addPet(S,RP(id));const d=off[j];R.root2.position.set(ax[0]*d,0,ax[1]*d);return R;});const C=camAt(-.12,.3,-.02,.92,yaw,-.06);
  return {S,C,tick:t=>{Rs.forEach(R=>RIG.pose(R,hi5P(R,t)));}};});}
function dogAgility(){return cell('Dog · Agility jump','on its agility gear',()=>{const S=world();const s=1.25;const G=gear(S,'train:dog',{},s,0,0,0,0);
  const R=addPet(S,RP('age:dog'));const bx1=-1.6*s,bx2=-.6*s,r=(bx2-bx1)/2,cx=(bx1+bx2)/2,zl=.9;
  const pa=path([['L',bx1,-zl,bx1,zl],['A',cx,zl,r,P_,0],['L',bx2,zl,bx2,-zl],['A',cx,-zl,r,0,-P_]]);
  const L1=2*zl,LA=P_*r;const s0=L1+LA/2;const jumps=[[zl,.58,.62],[L1+LA+zl,.62,.8]];/* [path pos of bar, half span, height] */
  const A=.5,Bk=.9,d1=RIG.stride(R,A,1)*.8;const C=camAt(cx,.35,.1,1.3,.32,.36);
  const tick=t=>{const pr=seg(t,.08,.92);const d=s0+pa.tot*pr;const q=pa.at(d);const run=Math.min(1,bell(t,.08,.92)*1.6);const P={};RIG.gait(R,P,'gallop',(d-s0)/d1,A*run,Bk*run);P.root={y:0};
    for(const [jb,w,hh] of jumps){const dd=((d-jb)%pa.tot+pa.tot)%pa.tot;const e=dd>pa.tot/2?dd-pa.tot:dd;if(Math.abs(e)<w){const v=(e+w)/(2*w);P.root.y=jumpArc(v,0,1,hh);P.hip=[];P.knee=[];tuck(R,P,Math.sin(P_*v),1.05);P.root.rz=.28*Math.cos(P_*v);}}
    if(run<1){P.hy=-.35*(1-run)*(t<.5?bell(t,0,.16):bell(t,.84,1))*2;wag(P,t,10,.6*(1-run));}
    R.root2.position.set(q.x,0,q.z);R.root2.rotation.y=q.h;RIG.pose(R,P);};
  audit('dogAgility',tick,R,boxesOf(G,m=>!(m.geometry.type==='CylinderGeometry'&&m.geometry.parameters.openEnded)&&m.geometry.type!=='TorusGeometry'));
  return {S,C,tick};});}
function dogRoll(){return cell('Dog · Roll over','learned at its gear',()=>{const S=world();const R=addPet(S,RP('age:dog'));const D=2.2*R.W;const C=camAt(0,.3,-D/2,.72,1.15,.22);
  const tick=t=>{RIG.pose(R,rollP(R,t));shadowAt(R);};audit('dogRoll',tick,R);return {S,C,tick};});}

/* =================== CAT =================== */
function catSpin(){return cell('Cat · Spin','starter',()=>{const S=world();const R=addPet(S,RP('age:cat'));const C=camAt(-.15,.42,0,.68,.62,.16);
  const tick=t=>{RIG.pose(R,pirP(R,t));};audit('catSpin',tick,R);return {S,C,tick};});}
function catTower(){return cell('Cat · Tower climb and leap','on its cat tower',()=>{const S=world();const s=1.6;const G=gear(S,'train:cat',{},s,0,0,0,0);
  const R=addPet(S,RP('age:cat'));const sp=spec(R,'age:cat');const d1=RIG.stride(R,sp.A,1);const y1=(.6+.11)*s,y2=(1.05+.11)*s;
  const A=[1.45,0],P1=[.56,y1,0],P2=[-.55,y2,.15],LD=[-.9,1.2];/* ground, platform 1, platform 2 (round the pole), landing in front */
  const C=camAt(.15,1.0,.35,1.75,.5,.2);const cv=new THREE.QuadraticBezierCurve(new THREE.Vector2(P1[0],0),new THREE.Vector2(.05,1.0),new THREE.Vector2(P2[0],P2[2]));
  const back=new THREE.CatmullRomCurve3([new THREE.Vector3(LD[0],0,LD[1]),new THREE.Vector3(.3,0,1.4),new THREE.Vector3(1.45,0,1.1),new THREE.Vector3(2.05,0,.45),new THREE.Vector3(A[0],0,A[1])]);const bl=back.getLength();
  const jump=(P,u,hh)=>{tuck(R,P,Math.sin(P_*u),1.1);P.root.rz=.3*Math.cos(P_*u);return jumpArc(u,0,1,hh);};
  const tick=t=>{let P={hip:[],knee:[]};P.root={};let x,y=0,z=0,h=P_;
    const cr=bell(t,.02,.08)+bell(t,.23,.28)+bell(t,.48,.52),ld=bell(t,.19,.24)+bell(t,.39,.44)+bell(t,.6,.65);
    if(t<.07){x=A[0];}
    else if(t<.2){const u=cl((t-.07)/.13);x=A[0]+(P1[0]-A[0])*u;y=P1[1]*ease(u)+jump(P,u,.55);}
    else if(t<.27){x=P1[0];y=P1[1];}
    else if(t<.4){const u=cl((t-.27)/.13);const p=cv.getPoint(ease(u)),tg=cv.getTangent(ease(u));x=p.x;z=p.y;y=P1[1]+(P2[1]-P1[1])*ease(u)+jump(P,u,.45);h=Math.atan2(-tg.y,tg.x);if(h<0)h+=TAU;}
    else if(t<.51){x=P2[0];y=P2[1];z=P2[2];h=P_+P_/2*seg(t,.43,.49);if(t>.43){P.tp=-.6*bell(t,.43,.51);}}
    else if(t<.61){const u=cl((t-.51)/.1);const g=1-(1-u)*(1-u);h=1.5*P_;x=P2[0]+(LD[0]-P2[0])*g;z=P2[2]+(LD[1]-P2[2])*g;y=P2[1]*(1-u*u)+jump(P,u,.35);}
    else if(t<.66){x=LD[0];z=LD[1];h=1.5*P_;}
    else{const u=seg(t,.66,.97);const p=back.getPointAt(u),tg=back.getTangentAt(u);x=p.x;z=p.z;h=Math.atan2(-tg.z,tg.x);if(h<0)h+=TAU;h=h+(P_-h)*seg(t,.93,.99);
      P=walkP(R,sp,u*bl/d1,P,Math.min(1,bell(t,.66,.99)*2.5));P.root=P.root||{};}
    if(cr)lieP(R,.3*cr,P);if(ld)squash(P,ld);P.hy=(P.hy||0)-.45*bell(t,.6,.7);
    R.root2.position.set(x,y,z);R.root2.rotation.y=h;RIG.pose(R,P);};
  audit('catTower',tick,R,boxesOf(G,m=>m.parent===G.g&&!(m.material&&m.material.side===THREE.BackSide)));
  return {S,C,tick};});}
function catHi5(){return cell('Cat · High five','paw wave, learned at its tower',()=>{const S=world();const R=addPet(S,RP('age:cat'));const C=camAt(.05,.42,0,.64,.4,-.1);
  return {S,C,tick:t=>{RIG.pose(R,hi5P(R,t,{wave:3,wf:4,wa:.3}));}};});}

/* =================== BUNNY =================== */
function bunJump(){return cell('Bunny · Big jump','starter: happy hop',()=>{const S=world();const R=addPet(S,RP('age:bunny'));const C=camAt(0,.85,0,1.0,.62,.12);
  const tick=t=>{const P={hip:[],knee:[]};P.root={};const c=bell(t,.08,.22),l=bell(t,.52,.6),c2=bell(t,.6,.66),l2=bell(t,.78,.84);if(c+c2)lieP(R,.35*(c+.5*c2),P);if(l+l2)squash(P,l+.6*l2);
    const u=cl((t-.2)/.33);if(u>0&&u<1){P.root.y=jumpArc(u,0,1,.75);stretch(R,P,Math.sin(P_*u));P.root.ry=.55*Math.sin(TAU*u);P.root.rx=.3*Math.sin(P_*u)*Math.sin(TAU*u);P.root.rz=.25*Math.cos(P_*u);}
    const u2=cl((t-.65)/.14);if(u2>0&&u2<1){P.root.y=jumpArc(u2,0,1,.2);tuck(R,P,Math.sin(P_*u2),.7);}
    RIG.pose(R,P);};audit('bunJump',tick,R);return {S,C,tick};});}
function bunHurdles(){return cell('Bunny · Hurdle hops','on its hurdles',()=>{const S=world();const s=1.3;const G=gear(S,'train:bunny',{},s,P_/2,0,0,0);
  const R=addPet(S,RP('age:bunny'));const sp=spec(R,'age:bunny');const X=1.9;const hs=[[-1.3,.5,.62],[0,.5,.7],[1.3,.5,.78]];
  const C=camAt(0,.62,0,1.75,.22,.2);const d1=RIG.stride(R,sp.A,1);
  /* straight line through the hurdles: over and back, turning round at each end (same distance from the camera all loop) */
  const leg=(u,dir,P)=>{const x=dir>0?-X+2*X*u:X-2*X*u;let air=false;for(const [xb,w,hh] of hs){const e=(x-xb)*dir;if(Math.abs(e)<w){air=true;const v=(e+w)/(2*w);P.hip=[];P.knee=[];P.root={y:jumpArc(v,0,1,hh),rz:.3*Math.cos(P_*v)};stretch(R,P,Math.sin(P_*v));}}
    if(!air)walkP(R,sp,u*2*X/d1*1.4,P,.75*Math.min(1,bell(u,0,1)*4));return x;};
  const tick=t=>{let P={};let x,h;
    if(t<.04){x=-X;h=0;}
    else if(t<.44){x=leg(seg(t,.04,.44),1,P);h=0;}
    else if(t<.54){x=X;h=P_*seg(t,.45,.53);walkP(R,sp,t*14,P,.45*bell(t,.44,.54));}
    else if(t<.94){x=leg(seg(t,.54,.94),-1,P);h=P_;}
    else{x=-X;h=P_+P_*seg(t,.94,1);walkP(R,sp,t*14,P,.45*bell(t,.94,1));}
    R.root2.position.set(x,0,0);R.root2.rotation.y=h;RIG.pose(R,P);};
  audit('bunHurdles',tick,R,boxesOf(G));return {S,C,tick};});}
function bunSpin(){return cell('Bunny · Spin','spins in a hop, learned at its hurdles',()=>{const S=world();const R=addPet(S,RP('age:bunny'));const C=camAt(0,.78,0,.95,.62,.12);
  const tick=t=>{const P={hip:[],knee:[]};P.root={piv:[R.bodyC.x,0,0]};const c=bell(t,.08,.2),l=bell(t,.56,.64);if(c)lieP(R,.35*c,P);if(l)squash(P,l);
    const u=cl((t-.18)/.4);if(u>0&&u<1){P.root.y=jumpArc(u,0,1,.55);P.root.ry=TAU*ease(u);tuck(R,P,Math.sin(P_*u),.8);}
    P.hy=-.3*bell(t,.66,.95);RIG.pose(R,P);};audit('bunSpin',tick,R);return {S,C,tick};});}

/* =================== HAMSTER =================== */
function hamSpin(){return cell('Hamster · Spin','starter: chases its tail',()=>{const S=world();const R=addPet(S,RP('age:hamster'));const rr=.13;const C=camAt(0,.18,rr,.42,.62,.3);
  const sp={g:'trot',A:.5,B:1};const d1=RIG.stride(R,.5,1);
  const tick=t=>{const th=2*TAU*seg(t,.1,.9);const run=Math.min(1,bell(t,.1,.9)*2);const P={};RIG.gait(R,P,'trot',th*rr/d1*1.6,.5*run,1*run);
    P.root={rx:.18*run,y:.01*Math.abs(S2(th*rr/d1*3.2))};P.hy=.25*run;P.hp=.1*run;
    R.root2.position.set(rr*Math.sin(th),0,rr*(1-Math.cos(th)));R.root2.rotation.y=-th;RIG.pose(R,P);};audit('hamSpin',tick,R);return {S,C,tick};});}
function hamMaze(){return cell('Hamster · Maze run','in and out of its tube maze',()=>{const S=world();const s=4.4;const G=gear(S,'train:hamster',{},s,P_,0,0,0);
  const R=addPet(S,RP('age:hamster'));const bc=R.bodyC;const by=.04*s,ty1=.09*s,xv=-.32*s,ty2=.34*s;const yT=ty1-.03,yTop=ty2-.03;
  /* body-centre path from the board into the low tube; the way back is the same path reversed */
  const cIn=new THREE.CatmullRomCurve3([new THREE.Vector3(1.0,by+bc.y,.85),new THREE.Vector3(.62,by+bc.y,.66),new THREE.Vector3(.32,by+bc.y+.01,.15),new THREE.Vector3(.05,yT,0),new THREE.Vector3(-.4,yT,0)]);
  const h0=(()=>{const g=cIn.getTangentAt(0);return Math.atan2(-g.z,g.x);})();
  const C=camAt(-.2,.78,.25,1.3,-.45,.25);const f=7;
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  const tick=t=>{const P={};let p,yaw=P_,pit=0,mv=1;
    if(t<.03){p=cIn.getPointAt(0);yaw=h0;mv=0;}
    else if(t<.17){const u=seg(t,.03,.17);p=cIn.getPointAt(u);const g=cIn.getTangentAt(u);yaw=Math.atan2(-g.z,g.x);}
    else if(t<.25){const u=cl((t-.17)/.08);p=V(-.4+(xv+.4)*u,yT,0);}
    else if(t<.28){p=V(xv,yT,0);pit=P_/2*seg(t,.25,.28);}
    else if(t<.38){p=V(xv,yT+(yTop-yT)*seg(t,.28,.38),0);pit=P_/2;}
    else if(t<.41){p=V(xv,yTop,0);pit=P_/2;yaw=P_+P_/2*seg(t,.38,.41);mv=.4;}
    else if(t<.44){p=V(xv,yTop,0);pit=P_/2*(1-seg(t,.41,.44));yaw=1.5*P_;}
    else if(t<.5){p=V(xv,yTop,.62*bell(t,.44,.5));yaw=1.5*P_;mv=.6;P.hy=.4*S2((t-.44)/.06);}
    else if(t<.53){p=V(xv,yTop,0);pit=-P_/2*seg(t,.5,.53);yaw=1.5*P_;}
    else if(t<.63){p=V(xv,yTop+(yT-yTop)*seg(t,.53,.63),0);pit=-P_/2;yaw=1.5*P_;}
    else if(t<.66){p=V(xv,yT,0);pit=-P_/2;yaw=1.5*P_+P_/2*seg(t,.63,.66);mv=.4;}
    else if(t<.69){p=V(xv,yT,0);pit=-P_/2*(1-seg(t,.66,.69));yaw=TAU;}
    else if(t<.77){const u=cl((t-.69)/.08);p=V(xv+(-.4-xv)*u,yT,0);yaw=TAU;}
    else if(t<.92){const u=1-seg(t,.77,.92);p=cIn.getPointAt(u);const g=cIn.getTangentAt(u);yaw=Math.atan2(g.z,-g.x);}
    else{p=cIn.getPointAt(0);const hb=Math.atan2(cIn.getTangentAt(0).z,-cIn.getTangentAt(0).x);let d=h0-hb;while(d<0)d+=TAU;yaw=hb+d*seg(t,.92,.99);mv=.5*bell(t,.92,1);}
    RIG.gait(R,P,'trot',f*t,.5*mv,1*mv);P.hy=(P.hy||0)+(t>.92?.25*bell(t,.93,1):0);
    P.root=Object.assign(P.root||{},{rz:pit,piv:[bc.x,bc.y,0]});P.floor=false;R.root2.rotation.y=yaw;
    const o=new THREE.Vector3(bc.x,0,0).applyAxisAngle(new THREE.Vector3(0,1,0),yaw);R.root2.position.set(p.x-o.x,p.y-bc.y,p.z-o.z);RIG.pose(R,P);
    const inside=t>.16&&t<.78;R.shadow.visible=!inside;if(!inside)R.shadow.position.y=by+.004;};
  tick(0);return {S,C,tick};});}
function hamRoll(){return cell('Hamster · Roll over','curls into a ball and rolls',()=>{const S=world();const R=addPet(S,RP('age:hamster'));const bc=R.bodyC;const rb=.15,D=TAU*rb;const C=camAt(D/2,.18,0,.62,.55,.22);
  const tick=t=>{const P={hip:[],knee:[]};const k=seg(t,.05,.16)*(1-seg(t,.84,.95));lieP(R,.6*k,P);tuck(R,P,.8*k,1);P.hp=-.9*k;P.tp=.6*k;
    const f=seg(t,.18,.48),b=seg(t,.52,.82);const ang=-TAU*f+TAU*b;P.root.rz=ang;P.root.piv=[bc.x,bc.y*.75,0];P.root.y=-R.H;R.root2.position.x=D*(f-b);
    P.hy=-.3*bell(t,.86,1);RIG.pose(R,P);shadowAt(R);};audit('hamRoll',tick,R);return {S,C,tick};});}

/* =================== CAPYBARA =================== */
function capDance(){return cell('Capybara · Dance','starter: slow sway',()=>{const S=world();const R=addPet(S,RP('age:capybara'));const C=camAt(0,.45,0,1.15,.75,.16);
  const tick=t=>{const e=seg(t,.04,.14)*(1-seg(t,.88,.97));const P={hip:[],knee:[]};const w=S2(2*t),st=C2(2*t);
    R.legs.forEach((l,i)=>{const up=Math.max(0,(l.front?1:-1)*l.side*st);P.hip[i]=(l.front?.9:-.6)*up*e;P.knee[i]=(l.front?-1.3:1.0)*up*e;});
    P.root={rx:.28*w*e,ry:.45*S2(t)*e,y:.08*Math.abs(st)*e,z:.22*w*e,piv:[R.bodyC.x,0,0]};P.hp=.35*Math.abs(S2(2*t))*e-.1*e;P.hy=-.5*w*e;RIG.pose(R,P);shadowAt(R);};audit('capDance',tick,R);return {S,C,tick};});}
function capSpin(){return cell('Capybara · Spin','slow spin in its warm bath',()=>{const S=world();const s=1.35;const G=gear(S,'train:capybara',{},s,0,0,0,0);
  const yz=G.g.children.filter(c=>c.isMesh&&c.geometry.type==='SphereGeometry'&&Math.abs(c.position.y-.43)<.01);const steam=G.g.children.filter(c=>c.isMesh&&c.material&&c.material.depthWrite===false&&c.geometry.type==='SphereGeometry');
  const stream=G.g.children.find(c=>c.isMesh&&c.geometry.type==='CylinderGeometry'&&Math.abs(c.position.x-.39)<.01);
  const R=addPet(S,RP('age:capybara'));R.shadow.visible=false;const bc=R.bodyC;const wy=.425*s;
  const P0={hip:[],knee:[]};lieP(R,.8,P0);P0.floor=false;RIG.pose(R,P0);let top=-1e9;{R.root2.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(R.root);top=bb.max.y;}const Y=wy+.42*R.H-top;
  steam.forEach(m=>{m.userData.y0=m.position.y;});const yk=[];yz.forEach(m=>{const k=m.position.x.toFixed(2)+m.position.z.toFixed(2);let j=yk.indexOf(k);if(j<0){yk.push(k);j=yk.length-1;}m.userData.j=j;});const ray=new THREE.Raycaster();const C=camAt(0,.75,0,1.25,.55,.42);
  const tick=t=>{const yaw=-TAU*seg(t,.06,.94)+.5;const P={hip:[],knee:[]};lieP(R,.8,P);P.floor=false;R.legs.forEach((l,i)=>{P.hip[i]+=.25*S2(t*6+(l.front?0:.5)+(l.side>0?.25:0));});
    P.hp=-.05+.1*S2(t*2);P.hy=.15*S2(t*3);P.br=.03*S2(t*3);
    const o=new THREE.Vector3((R.B.min.x+R.B.max.x)/2,0,0).applyAxisAngle(new THREE.Vector3(0,1,0),yaw);R.root2.position.set(-o.x,Y,-o.z);R.root2.rotation.y=yaw;RIG.pose(R,P);
    yz.forEach(m=>{const i=m.userData.j;const a=-yaw+(i<2?P_/2:-P_/2)+(i%2?.55:-.55);const rad=i===4?.56:.5;const aa=i===4?-yaw-P_/2:a;m.position.set(Math.cos(aa)*rad,.43+.01*S2(t*2+i*.3),-Math.sin(aa)*rad);});
    steam.forEach((m,i)=>{m.position.y=m.userData.y0+.22+.05*S2(t+i/3);});
    if(stream){R.root2.updateMatrixWorld(true);R.parts.forEach(q=>q.geo.computeBoundingSphere());ray.set(new THREE.Vector3(.39*s,2,0),new THREE.Vector3(0,-1,0));const h=ray.intersectObjects(R.parts.map(q=>q.mesh));
      const bot=h.length?h[0].point.y/s:.42;const top0=.84;stream.scale.y=Math.max(.01,(top0-bot)/.42);stream.position.y=(bot+top0)/2;stream.userData.bot=bot;}};
  {let mr=0,mt=0;const v=new THREE.Vector3();for(let f=0;f<60;f++){tick(f/60);R.root2.updateMatrixWorld(true);R.parts.forEach(q=>{const a=q.geo.attributes.position.array;for(let k=0;k<a.length;k+=9){v.set(a[k],a[k+1],a[k+2]).applyMatrix4(q.mesh.matrixWorld);if(v.y>wy-.05){const r=Math.hypot(v.x,v.z);if(r>mr){mr=r;mt=f;}}}});}dbg('capSpin max radius above water',mr.toFixed(3),'f',mt,'rim inner',(.68*s).toFixed(3));}
  tick(0);dbg('capSpin stream',stream?stream.geometry.parameters.height:'none','pos',stream?stream.position.y:0,'yuzu',yz.length,'steam',steam.length);
  return {S,C,tick};});}
function capRoll(){return cell('Capybara · Roll over','learned at its warm bath',()=>{const S=world();const R=addPet(S,RP('age:capybara'));const D=2.2*R.W;const C=camAt(-.1,.45,-D/2,1.08,1.15,.22);
  const tick=t=>{RIG.pose(R,rollP(R,t,{wa:0}));shadowAt(R);};audit('capRoll',tick,R);return {S,C,tick};});}

/* =================== DUCK =================== */
function duckDance(){return cell('Duck · Dance','starter: waddle dance',()=>{const S=world();const R=addPet(S,RP('age:duck'));const C=camAt(0,.36,0,.62,1.0,.14);
  const tick=t=>{const e=seg(t,.04,.14)*(1-seg(t,.86,.96));const P={hip:[],knee:[]};const w=S2(3*t);
    R.legs.forEach((l,i)=>{const up=Math.max(0,l.side*w);P.hip[i]=.5*up*e;P.knee[i]=-.7*up*e;});
    P.root={rx:-.2*w*e,ry:.35*S2(t*1.5)*e*0+.3*S2(t)*e,piv:[R.bodyC.x,0,0],y:.02*Math.abs(w)*e};P.wing=[-(.35+.35*Math.abs(S2(6*t)))*e,-(.35+.35*Math.abs(S2(6*t+.5)))*e];P.hp=.15*S2(6*t)*e;P.hy=-.2*e;P.ty=.4*S2(6*t)*e;RIG.pose(R,P);};
  audit('duckDance',tick,R);return {S,C,tick};});}
function duckJump(){return cell('Duck · Big jump','flaps its wings, learned on its ramp',()=>{const S=world();const R=addPet(S,RP('age:duck'));const C=camAt(0,.75,0,.82,1.15,.1);
  const tick=t=>{const P={hip:[],knee:[]};P.root={};const c=bell(t,.1,.24),l=bell(t,.62,.7);if(c)birdLie(R,.35*c,P);if(l){birdLie(R,.25*l,P);squash(P,l);}
    const u=cl((t-.22)/.42);const fl=bell(t,.18,.74);P.wing=[0,0];if(fl){const w=-(.2+1.0*(.5+.5*Math.sin(TAU*5*t)))*fl;P.wing=[w,w];}
    if(u>0&&u<1){P.root.y=jumpArc(u,0,1,.75);R.legs.forEach((l2,i)=>{P.hip[i]=(P.hip[i]||0)-.6*Math.sin(P_*u);P.knee[i]=(P.knee[i]||0)+.5*Math.sin(P_*u);});P.hp=.2*Math.sin(P_*u);}
    P.hy=-.25*bell(t,.74,1);RIG.pose(R,P);};audit('duckJump',tick,R);return {S,C,tick};});}
function duckSpin(){return cell('Duck · Spin','waddles round, wings out',()=>{const S=world();const R=addPet(S,RP('age:duck'));const sp=spec(R,'age:duck');const C=camAt(0,.36,0,.62,1.0,.14);
  const tick=t=>{const e=seg(t,.08,.2)*(1-seg(t,.8,.92));const u=seg(t,.12,.88);let P={};P=walkP(R,sp,u*4,P,.7*e);P.root.ry=TAU*u;P.root.piv=[R.bodyC.x,0,0];
    P.wing=[-.55*e,-.55*e];P.hp=(P.hp||0)+.1*e;RIG.pose(R,P);};audit('duckSpin',tick,R);return {S,C,tick};});}

CLIPS2.tricksA={title:'Pet Show tricks A: starter + two learned on the pet’s own gear',cols:3,cw:300,ch:250,frames:60,cells:[
  dogHi5(),dogAgility(),dogRoll(),catSpin(),catTower(),catHi5(),bunJump(),bunHurdles(),bunSpin(),hamSpin(),hamMaze(),hamRoll(),capDance(),capSpin(),capRoll(),duckDance(),duckJump(),duckSpin(),dogsHi5()]};
})();
