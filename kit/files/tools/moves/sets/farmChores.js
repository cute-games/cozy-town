/* farmChores (31 Oct): pets wait at the stable, horse to its stall, collect eggs, milk the cow */
(()=>{const H=window.MVH;const {cell,stage,mk,cl,ease,seg,bell,S2,C2,P_,TAU,cumOf,horseP,sitP,lieP,wag,jumpArc,crouchP,armLen,propB,cam,dbg}=H;
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const PH=1.45;/* the player's height, as on the approved horse rides */
function player(){const Q=H.personMk('farm:farmer',{who:'a'});const sc=PH/Q.H;Q.root2.scale.setScalar(sc);Q.sc=sc;return Q;}
/* hand point in the person's own (root) space for arm angle a and side swing w (same maths as MVH.handW) */
function hl(R,i,a,w){const A=R.arms[i],l=armLen(A);let x=A.x+Math.sin(a)*l*.97,y=A.top-Math.cos(a)*l*.97,z=A.z;
  if(w){const s=Math.sign(A.z)||1,c=Math.cos(w*s),sn=Math.sin(w*s),pz=A.wz!=null?A.wz:A.z*.4,dy=y-A.top,dz=z-pz;y=A.top+dy*c-dz*sn;z=pz+dy*sn+dz*c;}return V(x,y,z);}
function solveL(R,i,Tw,wMax){R.root2.updateMatrixWorld(true);const T=R.root.worldToLocal(Tw.clone());let best=1e9,ba=0,bw=0;wMax=wMax??.7;
  for(let a=-.6;a<=3.0;a+=.04)for(let w=-wMax;w<=wMax+1e-6;w+=.05){const d=hl(R,i,a,w).distanceTo(T);if(d<best){best=d;ba=a;bw=w;}}
  for(let a=ba-.04;a<=ba+.04;a+=.01)for(let w=bw-.05;w<=bw+.05;w+=.0125){const d=hl(R,i,a,w).distanceTo(T);if(d<best){best=d;ba=a;bw=w;}}
  return [ba,bw,best];}
function handWorld(R,i,a,w){R.root2.updateMatrixWorld(true);return R.root.localToWorld(hl(R,i,a,w));}
/* the rider's seat on the horse (as in the approved Ride cells) */
function seatOf(R){const sad=R.parts.filter(p=>!R.isBody(p)&&p.role[0]==='rest'&&p.bb.max.y>R.bodyC.y&&p.bb.max.x<R.neck.x&&p.bb.min.x>R.B.min.x*.7);
  const sx=sad.length?sad.reduce((a,p)=>a+(p.bb.min.x+p.bb.max.x)/2,0)/sad.length:-.2;const sy=Math.max(sad.length?Math.max(...sad.map(p=>p.bb.max.y)):0,R.body.bb.max.y+.06);return {sx,sy};}
function seated(R,Q,st,up,arm){const legTop=Q.legs[0].top*Q.sc;Q.root2.position.set(st.sx-.05,st.sy-legTop+.02+R.H*.03*(up||0),0);Q.root2.rotation.set(0,0,0);
  RIG.pose(Q,{floor:false,hip:[1.35,1.35],knee:[-1.45,-1.45],spread:[R.W*.42/Q.sc,R.W*.42/Q.sc],arm:arm||[.7,.7],root:{rz:-.08}});}
/* the "Get on" motion of the approved horse set, as a function of its own time g (0 = beside the horse, .6 = seated) */
function getOn(R,Q,st,g){const legTop=Q.legs[0].top*Q.sc;const up=bell(g,.18,.52);const ky=seg(g,.15,.33),kz=seg(g,.33,.5);
  Q.root2.position.set(st.sx-.05,(st.sy-legTop+.02)*ky,(R.W*.95)*(1-kz));Q.root2.rotation.set(-.35*bell(g,.25,.5),0,0);const sit=seg(g,.45,.58);
  RIG.pose(Q,{floor:false,hip:[1.35*sit+1.5*up*(1-sit),1.35*sit+.5*up*(1-sit)],knee:[-1.45*sit-1.2*up*(1-sit),-1.45*sit],spread:[R.W*.42/Q.sc*sit,R.W*.42/Q.sc*sit],arm:[.7*sit+1.6*up*(1-sit),.7*sit+1.6*up*(1-sit)],root:{rz:-.08*sit}});}
/* walking with planted feet: weight w(t) 0..1, distance and leg cycles follow its running sum */
function walker(wk){const cum=cumOf(wk,960);let Wi=0;for(let k=0;k<960;k++)Wi+=wk((k+.5)/960)/960;return {cum,Wi};}
function camAt(r,cy,yaw,pitch,tx,tz){const C=cam(r,cy,yaw,pitch);C.position.x+=tx;C.position.z+=tz;C.lookAt(tx,cy,tz);return C;}
function addPet(S,id){const R=mk(id,{age:'adult'});S.add(R.root2);RIG.addShadow(R,S);return R;}

/* 1. pets wait at the stable while you ride */
function petsWait(){return cell('Pets wait at the stable','dog and cat wait; you ride back; they greet you',()=>{
  const R=mk('farm:horse');const st=stage(R,{zoom:1});const S=st.S;st.C=camAt(1.95,.9,.32,.2,.5,-.1);
  const stb=propB('farm:stable',{},0);stb.root.position.set(.4,0,-3.75);S.add(stb.root);
  const Q=player();R.root.add(Q.root2);const seat=seatOf(R);
  const D=addPet(S,'age:dog'),Ct=addPet(S,'age:cat');D.root2.position.set(-.25,0,-.35);Ct.root2.position.set(-1.15,0,.15);
  const end=V(2.05,0,.35),dir=V(-.86,0,.51).normalize(),dist=3.6,th=Math.atan2(-dir.z,dir.x);R.root2.rotation.y=th;
  const A=.26,B=.75,ta=.42,tb=.74;const wk=t=>seg(t,ta,ta+.05)*(1-seg(t,tb-.06,tb));const W=walker(wk);const cyc=dist/RIG.stride(R,A,1);
  const faceH=(P,x,z)=>Math.atan2(-(end.z-z),end.x-x);const dTh0=-.5,dThH=faceH(0,-.25,-.35),cTh0=-.75,cThH=faceH(0,-1.15,.15);
  return {S,C:st.C,tick:t=>{const u=W.cum(t),w=wk(t);const pos=end.clone().addScaledVector(dir,-dist*(1-u));R.root2.position.copy(pos);
    const P=horseP(R,{},'walk',cyc*u,A*w,B*w);P.root={y:R.H*.012*w*Math.abs(S2(cyc*u*2)),rz:.02*w*S2(cyc*u)};P.hp=-.06+.08*w*S2(cyc*u*2+.25)+.12*bell(t,.8,.95);P.ty=.15*S2(2*t)+.5*bell(t,.86,.96);RIG.pose(R,P);
    const wave=bell(t,.8,.97);seated(R,Q,seat,0,[.7+2.0*wave,.7]);if(wave){const P2={floor:false,hip:[1.35,1.35],knee:[-1.45,-1.45],spread:[R.W*.42/Q.sc,R.W*.42/Q.sc],arm:[.7+2.1*wave,.7],wing:[-.35*wave*(1+.4*S2(6*t)),0],root:{rz:-.08}};RIG.pose(Q,P2);}
    /* dog: sits and looks round, lies down with a sigh, hears the horse, jumps up and greets */
    {const P={};const lie=seg(t,.24,.34)*(1-seg(t,.66,.72)),sit=(1-seg(t,.22,.3))+seg(t,.93,1)*0,stand=seg(t,.66,.72)*(1-seg(t,.92,1));const sitK=(1-seg(t,.22,.3))+seg(t,.93,.995);
      sitP(D,cl(sitK)*(1-lie),P);if(lie)lieP(D,lie,P);
      const look=(t<.22)?.55*S2(t/.22*.5)*bell(t,.02,.22):0;P.hy=(P.hy||0)+look;
      const sigh=bell(t,.36,.5);P.br=.09*sigh;P.hp=(P.hp||0)+(.2*sigh)-.3*lie*seg(t,.45,.52)*(1-seg(t,.56,.62));
      const ear=bell(t,.56,.68);P.hp+=.25*ear;P.hy=(P.hy||0)-.35*ear;
      let y=0;for(const [a,b] of [[.74,.8],[.82,.88]])y+=jumpArc(t,a,b,D.H*.32);if(y>0){P.hip=P.hip||[];P.knee=P.knee||[];const tk=Math.min(1,y/(D.H*.18));D.legs.forEach((l,i)=>{P.hip[i]=(P.hip[i]||0)+(l.front?.6:-.5)*tk;P.knee[i]=(P.knee[i]||0)+(l.front?-.9:.9)*tk;});}
      P.root=Object.assign(P.root||{},{y:((P.root&&P.root.y)||0)+y});wag(P,t,stand>.2?14:3,stand>.2?.7:.15*(1-lie));if(stand>.2)P.hp+=.2*stand;
      D.root2.rotation.y=dTh0+(dThH-dTh0)*seg(t,.6,.7)*(1-seg(t,.94,1));RIG.pose(D,P);}
    /* cat: sits, looks round, tail flicks; stands up tall with the tail high and hops to say hello */
    {const P={};const up=seg(t,.7,.76)*(1-seg(t,.93,.995));sitP(Ct,1-up,P);const look=bell(t,.1,.42)*S2((t-.1)/.32*.5);P.hy=(P.hy||0)-.6*look+.4*bell(t,.5,.62);
      P.ty=(P.ty||0)+.35*S2(3*t)*(1-up);P.tp=(P.tp||0)-.9*up;P.hp=(P.hp||0)+.25*up;const hop=jumpArc(t,.8,.86,Ct.H*.2);if(hop>0){P.hip=P.hip||[];P.knee=P.knee||[];Ct.legs.forEach((l,i)=>{if(l.front){P.hip[i]=(P.hip[i]||0)+.5;P.knee[i]=(P.knee[i]||0)-.6;}});}
      P.root=Object.assign(P.root||{},{y:((P.root&&P.root.y)||0)+hop});Ct.root2.rotation.y=cTh0+(cThH-cTh0)*seg(t,.64,.74)*(1-seg(t,.94,1));RIG.pose(Ct,P);}
    }};});}

/* 2. the rider gets off; the horse walks to its stall and puts its head over the stall gate */
function toStall(){return cell('Horse goes to its stall','you get off; it walks to its stall, head over the gate',()=>{
  const R=mk('farm:horse');const st=stage(R,{zoom:1});const S=st.S;const stb=propB('farm:stable',{},0);S.add(stb.root);
  const gx=1.125;/* the third stall (gate from x 0.25 to 2.0, at z 2.05..2.15, top 1.07) */
  const front=R.parts.filter(p=>R.isBody(p)).reduce((m,p)=>Math.max(m,p.bb.max.x),-9);const low=R.parts.filter(p=>p.bb.min.y<1.1).reduce((m,p)=>Math.max(m,p.bb.max.x),-9);const zEnd=2.15+Math.max(front,low)+.45,dist=1.9,z0=zEnd+dist;dbg('horse body front x',front.toFixed(2),'low parts front',low.toFixed(2),'zEnd',zEnd.toFixed(2));
  R.root2.rotation.y=P_/2;R.root2.position.set(gx,0,z0);
  const G=new THREE.Group();G.rotation.y=P_/2;G.position.set(gx,0,z0);S.add(G);const Q=player();G.add(Q.root2);RIG.addShadow(Q,S);const seat=seatOf(R);
  {const C=new THREE.PerspectiveCamera(40,1,.05,200);C.position.set(gx+5.6,1.9,6.4);C.lookAt(gx-.1,1.15,3.75);st.C=C;}
  const A=.26,B=.75,ta=.5,tb=.8;const wk=t=>seg(t,ta,ta+.05)*(1-seg(t,tb-.06,tb));const W=walker(wk);const cyc=dist/RIG.stride(R,A,1);
  const sw=t=>seg(t,.44,.47)*(1-seg(t,.53,.56));const SW=walker(sw);
  return {S,C:st.C,tick:t=>{const u=W.cum(t),w=wk(t);R.root2.position.set(gx,0,z0-dist*u);
    const P=horseP(R,{},'walk',cyc*u,A*w,B*w);P.root={y:R.H*.012*w*Math.abs(S2(cyc*u*2)),rz:.02*w*S2(cyc*u)};
    const over=seg(t,.8,.86);P.hp=-.06+.08*w*S2(cyc*u*2+.25)-.32*over+.05*over*S2(2*(t-.8)/.2);P.hy=.25*bell(t,.86,.98);P.ty=.15*S2(2*t)+.5*bell(t,.05,.14);RIG.pose(R,P);if(window.FC_DBG&&t>.6){window.__hy=9;R.root2.updateMatrixWorld(true);let mz=9,my=0;const v=V(0,0,0);R.parts.forEach(q=>{const A=q.geo.attributes.position.array;for(let k=0;k<A.length;k+=3){v.set(A[k],A[k+1],A[k+2]).applyMatrix4(q.mesh.matrixWorld);if(v.y<1.15&&v.z<mz){mz=v.z;my=v.y;}if(v.z<2.3&&v.y<window.__hy){window.__hy=v.y;}}});dbg('t',t.toFixed(3),'min z below 1.15',mz.toFixed(2),'at y',my.toFixed(2),'lowest y in front of z2.3',window.__hy.toFixed(2));}
    /* rider: seated, then the approved "Get on" played backwards, then two steps aside */
    if(t<.08)seated(R,Q,seat,0);else if(t<.42)getOn(R,Q,seat,.6-.6*seg(t,.08,.42));
    else{const s=SW.cum(t),ws=sw(t);const P2=H.walkP(Q,{g:'biped',A:.45,B:.85},3*s,{},ws);Q.root2.position.set(seat.sx-.05,0,R.W*.95+.42*s);Q.root2.rotation.set(0,-1.9*seg(t,.56,.68),0);
      P2.floor=true;P2.hy=.5*seg(t,.7,.8);RIG.pose(Q,P2);}
    if(Q.shadow){Q.root2.updateMatrixWorld(true);const c=Q.root.localToWorld(V(0,0,0));Q.shadow.position.set(c.x,.004,c.z);Q.shadow.scale.set(.3,.3,1);Q.shadow.material.opacity=t<.3?0:.25*seg(t,.3,.42);}}};});}

/* 3. collect eggs from the nest boxes into the egg basket; a hen pecks nearby */
function eggs(){return cell('Collect eggs','takes eggs from the nest boxes into the basket',()=>{
  const Q=player();const st=stage(Q,{zoom:1});const S=st.S;const cp=propB('farm:coop',{},0);S.add(cp.root);
  const nest=[];cp.parts.forEach(q=>{const b=q.bb;if(b.min.x>1.1&&b.min.y>.815&&b.max.y<.96&&b.max.x-b.min.x<.112){const z=Math.round((b.min.z+b.max.z)*5);let n=nest.find(e=>e.k===z);if(!n){n={k:z,parts:[]};nest.push(n);}n.parts.push(q);}});
  nest.sort((a,b)=>b.k-a.k);dbg('egg nests',nest.length,nest.map(n=>n.parts.length).join(','));
  const mkEgg=n=>{const g=new THREE.Group();const bb=new THREE.Box3();n.parts.forEach(q=>bb.union(q.bb));const c=bb.getCenter(V(0,0,0));n.c=c;n.parts.forEach(q=>{const m=new THREE.Mesh(q.geo.clone(),q.mesh.material);m.geometry.translate(-c.x,-c.y,-c.z);m.renderOrder=q.mesh.renderOrder;g.add(m);});g.visible=false;S.add(g);return g;};
  const picks=[nest[0],nest[1]];const E=picks.map(mkEgg);
  const bk=propB('farm:eggs');bk.root.position.set(2.0,0,.4);S.add(bk.root);H.floorShadow(S,2.0,.4,.22,.22);
  const px=1.95,pz0=-.12;Q.root2.position.set(px,0,pz0);
  const hen=H.jointed('farm:chicken');S.add(hen.root2);RIG.addShadow(hen,S);hen.root2.position.set(2.85,0,-.55);hen.root2.rotation.y=-2.3;H.jReset(hen);H.jGround(hen);const hy0=hen.turn.position.y;
  st.C=camAt(1.45,.62,-.12,.18,1.75,.0);
  /* key poses: facing the nest (-x) standing; facing the basket (+z) bent over it */
  const thN=P_,thB=-P_/2;const drop=[V(1.96,.27,.38),V(2.05,.27,.42)];
  const pose=(t,th,k,lean)=>{Q.root2.rotation.y=th;const P=crouchP(Q,k,{},lean);P.floor=true;return P;};
  const plan=[[.04,.3,.5],[.5,.76,.94]];/* reach start, drop, end */
  return {S,C:st.C,tick:t=>{let th=thN,k=.08,lean=.12,arm=[.1,.1],wing=[0,0],hand=null,egg=-1,eggAt=null;
    for(let e=0;e<2;e++){const [a,b,c]=plan[e];if(t<a||t>=c)continue;const reach=bell(t,a,a+.12),turn=seg(t,a+.12,a+.2)*(1-seg(t,b+.04,c-.02)),bend=seg(t,a+.17,b-.02)*(1-seg(t,b+.02,b+.1));
      th=thN+(P_/2)*turn;k=.08+.62*bend;lean=.12+.6*bend;
      RIG.pose(Q,pose(t,th,k,lean));const ia=0;const n=picks[e];const T1=n.c.clone().add(V(.04,0,0));
      if(t<a+.12){const s=solveL(Q,ia,T1,.6);const rk=seg(t,a,a+.06);arm[ia]=.1+(s[0]-.1)*reach;wing[ia]=s[1]*reach;if(t>a+.06){egg=e;}}
      else if(t<b+.02){const T=t<a+.2?T1.clone().lerp(drop[e],seg(t,a+.12,a+.2)):drop[e];const s=solveL(Q,ia,T,.6);const lift=Math.max(seg(t,a+.12,a+.15)*(1-seg(t,a+.18,a+.22)),0);arm[ia]=s[0];wing[ia]=s[1];egg=e;}
      else{const back=1-seg(t,b+.02,b+.1);const s=solveL(Q,ia,drop[e],.6);arm[ia]=.1+(s[0]-.1)*back;wing[ia]=s[1]*back;}
      if(egg===e)eggAt=handWorld(Q,ia,arm[ia],wing[ia]);}
    const P=pose(t,th,k,lean);P.arm=arm;P.wing=wing;P.hp=-.2*bell(t,.06,.16)-.2*bell(t,.52,.62);RIG.pose(Q,P);
    picks.forEach((n,e)=>{const [a,b,c]=plan[e];const taken=t>=a+.06;n.parts.forEach(q=>q.mesh.visible=!taken);const g=E[e];g.visible=taken;if(!taken)return;
      if(eggAt&&egg===e&&t<b+.02){g.position.copy(handWorld(Q,0,arm[0],wing[0]));g.position.y-=.02;}else g.position.copy(drop[e]).add(V(0,-.02,0));});
    /* the hen pecks: three quick pecks, looks up, a step */
    {H.jReset(hen);const m=hen.m;const pk=(5*t)%1,peck=pk<.35?Math.sin(P_*pk/.35):0,bout=t%.5<.32?1:0;m.neck.rotation.x+=.95*peck*bout;m.b.rotation.x+=.25*peck*bout;m.head.rotation.y=.4*bell(t,.33,.47)-.4*bell(t,.83,.97);m.tail.rotation.x=.15*S2(4*t);
      hen.turn.position.y=hy0;}
    if(Q.shadow)H.fixShadow(Q);}};});}

/* 4. milk the cow: crouch by her side with the pail, milk, stand up with the full pail */
function milk(){return cell('Milk the cow','crouches, milks into the pail, stands with it full',()=>{
  const R=H.jointed('farm:cow');const st=stage(R,{zoom:1});const S=st.S;H.jReset(R);H.jGround(R);
  const Q=player();S.add(Q.root2);RIG.addShadow(Q,S);const qx=-.5,qz=.98;Q.root2.position.set(qx,0,qz);Q.root2.rotation.y=1.22;
  const bu=propB('farm:bucket');S.add(bu.root);const hy=bu.H*.98;/* handle top */
  const milkD=new THREE.Mesh(new THREE.CylinderGeometry(.148,.14,.02,16),new THREE.MeshLambertMaterial({color:'#ffffff'}));S.add(milkD);
  const jets=[0,1].map(()=>{const j=new THREE.Mesh(new THREE.CylinderGeometry(.007,.007,1,6),new THREE.MeshBasicMaterial({color:'#ffffff'}));S.add(j);return j;});
  const ud=R.m.b.localToWorld(R.m.milk.clone());dbg('udder',ud.x.toFixed(2),ud.y.toFixed(2),ud.z.toFixed(2));
  const under=V(-.16,0,.22),carry=V(.12,0,1.05);
  st.C=camAt(1.3,.55,1.3,.3,-.15,.45);
  return {S,C:st.C,tick:t=>{H.jReset(R);const m=R.m;const hc=m.head.children[0];hc.rotation.y=.07*S2(8*t);hc.rotation.z=.03*S2(8*t+.25);
    const look=bell(t,.42,.62);m.head.rotation.y=.5*look;m.tail.rotation.z=.18*S2(2*t)+.9*bell(t,.2,.3)+.8*bell(t,.7,.8);m.tail.rotation.x=.3*bell(t,.2,.3);H.jGround(R);
    const down=seg(t,.1,.24)*(1-seg(t,.76,.88));const P=crouchP(Q,.95*down,{},.42*down);P.floor=true;RIG.pose(Q,P);
    /* pail: carried by the near hand, put down under the udder, lifted again full */
    const onF=seg(t,.18,.26)*(1-seg(t,.74,.8));const bp=carry.clone().lerp(under,onF);
    const milking=t>.26&&t<.74;let arm=[.1,.1],wing=[0,0];
    if(!milking){const hc0=handWorld(Q,0,.35,-.3);const full=t>.5,hold=full?seg(t,.8,.9):0;const hc1=handWorld(Q,0,.55,0);hc0.lerp(hc1,hold);const bp=V(hc0.x,0,hc0.z).lerp(under,onF);const by=(1-onF)*Math.max(0,hc0.y-hy);
      const s=solveL(Q,0,V(bp.x,by+hy,bp.z),.7);arm[0]=s[0];wing[0]=s[1];bu.root.position.set(bp.x,by,bp.z);}
    else{bu.root.position.copy(under);const sq=(6*t)%1;const tL=V(ud.x+.03,ud.y-.06,ud.z+.12),tR=V(ud.x-.07,ud.y-.06,ud.z+.12);
      for(const i of [0,1]){const ph=i?Math.sin(TAU*6*t):-Math.sin(TAU*6*t);const T=(i?tR:tL).clone().add(V(0,-.035*ph,0));const s=solveL(Q,i,T,.8);arm[i]=s[0];wing[i]=s[1];}}
    const P2=crouchP(Q,.95*down,{},.42*down);P2.floor=true;P2.arm=arm;P2.wing=wing;P2.hp=.25*down-.15*bell(t,.42,.6);RIG.pose(Q,P2);
    const fill=seg(t,.28,.72);const bp2=bu.root.position;milkD.position.set(bp2.x,bp2.y+.24+.045*fill,bp2.z);milkD.visible=fill>.02&&t<.995;milkD.scale.set(.85+.15*fill,1,.85+.15*fill);
    jets.forEach((j,i)=>{const on=milking&&t>.28&&t<.72&&((i?Math.sin(TAU*6*t):-Math.sin(TAU*6*t))>.3);j.visible=on;if(on){const top=ud.y-.12,bot=bp2.y+.26+.045*fill;j.scale.y=Math.max(.01,top-bot);j.position.set(ud.x+(i?-.05:.03),(top+bot)/2,ud.z+.1);}});
    if(Q.shadow)H.fixShadow(Q);}};});}

CLIPS2.farmChores={title:'Farm chores · pets wait at the stable, horse to its stall, eggs, milking',cols:2,cw:440,ch:330,frames:48,cells:[petsWait(),toStall(),eggs(),milk()]};
})();
