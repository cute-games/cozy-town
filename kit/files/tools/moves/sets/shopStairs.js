/* shopStairs (31 Oct): the new Pet Shop is ONE room on 3 floors. The player (stand-in: farmer 'a') walks up and down the real stairs,
   the dog follows on the steps, the camera follows. Room = PU['shop:room'] as built in c12 (numbers below read from buildPetShopRoom). */
(()=>{const H=window.MVH;const {cell,mk,dbg,cl,ease,seg,bell,S2,P_,TAU,cumOf}=H;
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
/* ---- the room's real numbers (c12 buildPetShopRoom): floor box .08 high; slabs .22 thick at y 3.2 / 6.4; 14 steps over 3.2 up, z 4.6 -> 0.5 ---- */
const FH=3.2,NS=14,SZ0=.1,SZ1=4.2,DD=(SZ1-SZ0)/NS;   /* c15: stairs moved 0.4 back */
const LV=[.08,FH+.22,2*FH+.22];                        /* walking height of floor 1, 2, 3 */
const FA={x0:-6.75,x1:-5.15,y0:.08,R:(3.42-.08)/NS,xc:-5.95},FB={x0:5.15,x1:6.75,y0:3.42,R:(6.62-3.42)/NS,xc:5.95};   /* even steps, top step = floor above */  /* 1->2 left wall, 2->3 right wall */
const treadTop=(f,i)=>f.y0+(i+1)*f.R;              /* tread board .06 on top of each step box */
const stepI=z=>Math.max(0,Math.min(NS-1,Math.floor((SZ1-z)/DD)));
function flightAt(x,z,m){m=m||0;for(const f of[FA,FB])if(x>=f.x0-m&&x<=f.x1+m&&z>=SZ0&&z<=SZ1+.015)return f;return null;}
/* surface height under (x,z); lv(x,z) says which floor the walker is on outside the stairs */
function surf(x,z,lv){const f=flightAt(x,z);if(f)return treadTop(f,stepI(z));return LV[lv(x,z)];}
const PH=1.45;                                           /* player height, as on the approved farm sets */

/* ---------- the room ---------- */
function room(){const S=MV.scene('#cfe3ea');const g=new THREE.Group();PU['shop:room'].build(g,{floor:'3',pets:'yes'});S.add(g);return {S,g};}

/* ---------- a path on the floor plan with rounded corners ---------- */
function mkPath(pts,rad){const P=pts.map(p=>V(p[0],0,p[1]));const d=[P[0].clone()];
  for(let i=1;i<P.length-1;i++){const a=P[i-1],b=P[i],c=P[i+1];const u=b.clone().sub(a).normalize(),w=c.clone().sub(b).normalize();const r=Math.min(rad,b.distanceTo(a)/2,b.distanceTo(c)/2);
    const p0=b.clone().addScaledVector(u,-r),p1=b.clone().addScaledVector(w,r);for(let k=0;k<=12;k++){const q=k/12;d.push(p0.clone().multiplyScalar((1-q)*(1-q)).addScaledVector(b,2*q*(1-q)).addScaledVector(p1,q*q));}}
  d.push(P[P.length-1].clone());const cs=[0];for(let i=1;i<d.length;i++)cs[i]=cs[i-1]+d[i].distanceTo(d[i-1]);const L=cs[cs.length-1];
  function at(s){let i=1;if(s<=0){const h=d[1].clone().sub(d[0]).normalize();return {p:d[0].clone().addScaledVector(h,s),h};}
    if(s>=L){const n=d.length;const h=d[n-1].clone().sub(d[n-2]).normalize();return {p:d[n-1].clone().addScaledVector(h,s-L),h};}
    while(cs[i]<s)i++;const q=(s-cs[i-1])/(cs[i]-cs[i-1]||1);const h=d[i].clone().sub(d[i-1]).normalize();return {p:d[i-1].clone().lerp(d[i],q),h};}
  return {L,at};}
/* the same path moved sideways on the stairs only (player on the railing side, dog on the wall side, so both stay in view) */
function offPath(path,d){if(!d)return path;const N=600,s0=-2,ds=(path.L+4)/N;const m=[];for(let k=0;k<=N;k++){const p=path.at(s0+k*ds).p;m[k]=flightAt(p.x,p.z,.1)?1:0;}
  const w=m.map((v,k)=>{let a=0,n=0;for(let j=-40;j<=40;j++){a+=m[Math.max(0,Math.min(N,k+j))];n++;}return ease(a/n*1.6);});
  const wf=s=>{const x=(s-s0)/ds,k=Math.max(0,Math.min(N-1,Math.floor(x))),q=x-k;return w[k]+(w[k+1]-w[k])*q;};
  return {L:path.L,at(s){const a=path.at(s);const nrm=V(a.h.z,0,-a.h.x);return {p:a.p.clone().addScaledVector(nrm,d*wf(s)*a.h.z*a.h.z),h:a.h};}};}
/* phase along the path: one leg cycle per stride, stride shorter on the stairs (one step per foot) */
function phaser(path,flat,stair){const N=1200,ds=(path.L+4)/N,s0=-2;const st=[];for(let k=0;k<=N;k++){const p=path.at(s0+k*ds).p;st[k]=flightAt(p.x,p.z,.3)?stair:flat;}
  const sm=st.map((v,k)=>{let a=0,n=0;for(let j=-25;j<=25;j++){const q=st[Math.max(0,Math.min(N,k+j))];a+=q;n++;}return a/n;});
  const ph=[0];for(let k=1;k<=N;k++)ph[k]=ph[k-1]+ds/((sm[k]+sm[k-1])/2);const z0=ph[Math.round(-s0/ds)];for(let k=0;k<=N;k++)ph[k]-=z0;
  const phiOf=s=>{const x=(s-s0)/ds,k=Math.max(0,Math.min(N-1,Math.floor(x))),q=x-k;return ph[k]+(ph[k+1]-ph[k])*q;};
  const sOf=f=>{let lo=0,hi=N;while(hi-lo>1){const m=(lo+hi)>>1;if(ph[m]<f)lo=m;else hi=m;}const q=(f-ph[lo])/((ph[hi]-ph[lo])||1);return s0+(lo+q)*ds;};
  return {phiOf,sOf};}
/* swing of one foot from A to B (points with y = sole height); goes up early when climbing, down late when going down */
function swingPt(A,B,u,lift){const dy=B.y-A.y;let hu,vy;if(dy>.03){vy=ease(cl(u/.55));hu=ease(cl((u-.22)/.78));}else if(dy<-.03){hu=ease(cl(u/.72));vy=ease(cl((u-.5)/.5));}else{hu=ease(u);vy=hu;}
  const lf=A.distanceTo(B)<.02?0:lift;return V(A.x+(B.x-A.x)*hu,A.y+dy*vy+lf*Math.sin(P_*u),A.z+(B.z-A.z)*hu);}
/* two-bone leg: angles that put the end of the leg on (tx,ty) from the hip (hx,hy); sg -1 = knee forward, +1 = hock back */
function ik2(hx,hy,tx,ty,a,b,sg){let dx=tx-hx,dy=ty-hy,D=Math.hypot(dx,dy);const mx=(a+b)*.9995;if(D>mx){dx*=mx/D;dy*=mx/D;D=mx;}D=Math.max(D,Math.abs(a-b)+1e-4);
  const ph=Math.atan2(dx,-dy),al=Math.acos(cl((a*a+D*D-b*b)/(2*a*D),-1,1)),be=Math.acos(cl((a*a+b*b-D*D)/(2*a*b),-1,1));return sg<0?[ph+al,-(P_-be)]:[ph-al,P_-be];}
const yawOf=h=>Math.atan2(-h.z,h.x);
/* leg schedule: plant n of a leg = where its home point is at the middle of its stance */
function legAt(ph,off,sw,plant){const c=ph-off,n=Math.floor(c),u=c-n;const B=plant(n);if(u>=sw)return {p:B,st:true,A:B,B};const A=plant(n-1);return {u:u/sw,A,B,st:false};}

/* ---------- the player: people rig, feet planted on the treads ---------- */
function player(S){const R=mk('farm:farmer',{who:'a'},'human',undefined,{rigid:true});const sc=PH/R.H;R.root2.scale.setScalar(sc);S.add(R.root2);
  const L0=R.legs[0];const foot=R.legs.map(l=>{const fp=l.parts.filter(q=>q.bb.min.y<l.ank*1.1);let mn=1e9,mx=-1e9,zz=0;fp.forEach(q=>{mn=Math.min(mn,q.bb.min.x);mx=Math.max(mx,q.bb.max.x);});
    l.parts.forEach(q=>zz+=(q.bb.min.z+q.bb.max.z)/2);return {toe:(mx-l.x)*sc,heel:(l.x-mn)*sc,lat:zz/l.parts.length*sc};});
  const ft={toe:Math.max(foot[0].toe,foot[1].toe),heel:Math.max(foot[0].heel,foot[1].heel)};
  dbg('player sc',sc,'toe',ft.toe,'heel',ft.heel,'lat',foot[0].lat,foot[1].lat,'leg',L0.top*sc);
  return {R,sc,ft,lat:foot.map(f=>f.lat),a:(L0.top-L0.knee)*sc,b:(L0.knee-L0.ank)*sc,ank:L0.ank*sc,hip:L0.top*sc};}
/* where a foot goes: on a step the toe stops short of the next riser (going up) or the heel sits at the back of the tread (going down) */
function plantFoot(Q,p,h,lv){let x=p.x,z=p.z;const up=h.z<-.3,down=h.z>.3;const f=flightAt(x,z,.05);const zf=SZ1+.03;
  if(f&&(up||down)){x=Math.max(f.x0+.18,Math.min(f.x1-.18,x));if(z<=SZ1+.015&&z>=SZ0){const i=stepI(z),zb=SZ1-(i+1)*DD;z=zb+(up?.07+Q.ft.toe:.025+Q.ft.heel);
      if(z>SZ1+.015){/* would stick out over the front edge: stand on the floor in front instead */z=zf+(up?Q.ft.toe:Q.ft.heel);}}
    else if(z>SZ1){if(up)z=Math.max(z,zf+Q.ft.toe);else z=Math.max(z,zf+Q.ft.heel);}}
  const zt=z+h.z*Q.ft.toe,zh=z-h.z*Q.ft.heel;const y=Math.max(surf(x+h.x*Q.ft.toe*.8,zt-h.z*.02,lv),surf(x,z,lv),surf(x-h.x*Q.ft.heel*.8,zh+h.z*.02,lv));return V(x,y,z);}
function playerPose(Q,path,phs,s,lv,lean,stats){const R=Q.R;const ph=phs.phiOf(s);const sw=.42;const here=path.at(s);
  const plant=(i)=>n=>{const sb=phs.sOf(n+i*.5+(1+sw)/2);const a=path.at(sb);const nrm=V(a.h.z,0,-a.h.x);
    return plantFoot(Q,a.p.clone().addScaledVector(nrm,-Q.lat[i]),a.h,lv);};
  const legs=[0,1].map(i=>legAt(ph,i*.5,sw,plant(i)));
  const tg=legs.map(g=>g.st?g.p:swingPt(g.A,g.B,g.u,.07));
  /* body: hips over the middle of the feet, never higher than the legs can reach */
  const gy=legs.map((g,i)=>g.st?g.p.y:g.A.y+(g.B.y-g.A.y)*ease(g.u));let hy=(gy[0]+gy[1])/2+Q.hip*.985;
  const Lr=(Q.a+Q.b)*.985;tg.forEach(p=>{const dh=Math.hypot(p.x-here.p.x,p.z-here.p.z);const lim=p.y+Q.ank+Math.sqrt(Math.max(0,Lr*Lr-dh*dh));hy=Math.min(hy,lim);});
  R.root2.position.set(here.p.x,hy-Q.hip,here.p.z);R.root2.rotation.y=yawOf(here.h);
  const P={floor:false,hip:[],knee:[],ank:[],root:{rz:lean,piv:[0,R.legs[0].top,0]}};RIG.pose(R,{floor:false,root:P.root});R.root2.updateMatrixWorld(true);
  R.legs.forEach((l,i)=>{const T=R.root.worldToLocal(V(tg[i].x,tg[i].y+Q.ank,tg[i].z));const [ha,ka]=ik2(l.x,l.top,T.x,T.y,(l.top-l.knee),(l.knee-l.ank),-1);
    let ta=0;if(!legs[i].st){/* toes up a little in the air */ta=.25*Math.sin(P_*legs[i].u);}P.hip[i]=ha;P.knee[i]=ka;P.ank[i]=-(ha+ka+lean)+ta;});
  const hm=(P.hip[0]+P.hip[1])/2;P.arm=[0,1].map(i=>-.9*(P.hip[i]-hm));P.wing=[.06,.06];RIG.pose(R,P);
  if(stats)stats.feet(R,legs,tg,'player');return {legs,tg};}

/* ---------- the dog: approved adult dog, 4 paws on the treads, body tips with the stairs ---------- */
function dog(S){const R=mk('age:dog',{age:'adult'},undefined,undefined,{rigid:true});S.add(R.root2);const fr=R.legs.filter(l=>l.front),hd=R.legs.filter(l=>!l.front);
  const xF=fr[0].x,xH=hd[0].x,top=R.legs[0].top;dbg('dog L',R.L,'H',R.H,'legs',R.legs.length,'xF',xF,'xH',xH,'top',top);return {R,xF,xH,top};}
const DOFF={FL:0,FR:.03,HL:.5,HR:.53};   /* short legs (.24) vs a .23 step: front paws hop up together, then the back paws (as small dogs do) */
function plantPaw(p,lv){let x=p.x,z=p.z;const f=flightAt(x,z,.04);if(f){x=Math.max(f.x0+.12,Math.min(f.x1-.12,x));if(z<=SZ1+.015&&z>=SZ0){const i=stepI(z);z=SZ1-(i+.55)*DD;}else if(z>SZ1&&z<SZ1+.11)z=SZ1+.11;}
  else if(z>SZ0-.06&&z<SZ0&&flightAt(x,SZ0+.01,.04))z=SZ0-.06;return V(x,surf(x,z,lv),z);}
function dogPose(D,path,phs,s,lv,t,stats){const R=D.R;const ph=phs.phiOf(s);const sw=.46;const here=path.at(s);
  /* the body turns smoothly: heading averaged over the dog's own length */here.h=path.at(s-.5).h.add(path.at(s-.25).h).add(here.h.clone()).add(path.at(s+.25).h).add(path.at(s+.5).h).normalize();
  const legs=R.legs.map(l=>{const key=(l.front?'F':'H')+(l.side>0?'L':'R');const off=DOFF[key];
    const plant=n=>{const sb=phs.sOf(n+off+(1+sw)/2);const a=path.at(sb+l.x);const nrm=V(a.h.z,0,-a.h.x);return plantPaw(a.p.clone().addScaledVector(nrm,-l.z),lv);};
    return legAt(ph,off,sw,plant);});
  const tg=legs.map(g=>g.st?g.p:swingPt(g.A,g.B,g.u,.09));const gy=legs.map((g,i)=>g.st?g.p.y:g.A.y+(g.B.y-g.A.y)*ease(g.u));
  const fi=R.legs.map((l,i)=>i).filter(i=>R.legs[i].front),hi=R.legs.map((l,i)=>i).filter(i=>!R.legs[i].front);
  const yF=(gy[fi[0]]+gy[fi[1]])/2,yH=(gy[hi[0]]+gy[hi[1]])/2;let th=cl(Math.atan2(yF-yH,D.xF-D.xH),-.72,.72);
  /* on the stairs the body keeps a slope even when all four paws share a tread (long dog, short tread): head clear of the next steps */
  {const fl=flightAt(here.p.x,here.p.z,.05);if(fl&&Math.abs(here.h.z)>.7){const sl=-Math.sign(here.h.z)*.42;th=sl>0?Math.max(th,sl):Math.min(th,sl);}}   /* tip with the stairs, a bit less than the paws (looks calmer) */
  const nom=D.top*(.76+.12*Math.abs(th)/.72);const rootY=(yH+yF)/2+nom-(((D.xH+D.xF)/2)*Math.sin(th)+D.top*Math.cos(th));
  /* keep the hips over the paws when the body tips */const mx=(D.xF+D.xH)/2,sh=mx-(mx*Math.cos(th)-D.top*Math.sin(th));
  R.root2.position.set(here.p.x+here.h.x*sh,rootY,here.p.z+here.h.z*sh);R.root2.rotation.y=yawOf(here.h);
  const P={floor:false,hip:[],knee:[],root:{rz:th}};RIG.pose(R,{floor:false,root:P.root});R.root2.updateMatrixWorld(true);
  R.legs.forEach((l,i)=>{const T=R.root.worldToLocal(tg[i].clone());if(stats){const dd=Math.hypot(T.x-l.x,T.y-l.top)/(l.top-(l.bot||0));if(dd>stats.dogR){stats.dogR=dd;stats.dogRAt='t'+stats.t.toFixed(2)+' leg'+i+(l.front?'F':'H')+' st'+legs[i].st+' T '+T.x.toFixed(2)+','+T.y.toFixed(2)+' th '+th.toFixed(2)+' gy '+gy.map(v=>v.toFixed(2)).join('/');}}const [ha,ka]=ik2(l.x,l.top,T.x,T.y,l.top-l.knee,l.knee-(l.bot||0),l.front?-1:1);P.hip[i]=ha;P.knee[i]=ka;});
  P.hp=th>0?th*.35:-th*.2;   /* going up: looks up the stairs (head clear of the next steps) */P.ty=.55*S2(t*7);RIG.pose(R,P);if(stats)stats.feet(R,legs,tg,'dog');return {legs,tg};}

/* ---------- strict checks, printed with the render: nothing in the steps, slab, walls or railings; planted feet on the treads ---------- */
function checker(name,lv,walls){const st={dogR:0,dogRAt:'',name,pen:0,penAt:'',gap:0,gapAt:'',wall:0,wallAt:'',t:0};const v=new THREE.Vector3();
  st.body=(R,who)=>{R.root2.updateMatrixWorld(true);for(const q of R.parts){if(q.outline)continue;const a=q.geo.attributes.position.array,M=q.mesh.matrixWorld;for(let k=0;k<a.length;k+=9){v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M);
      const s=Math.min(surf(v.x,v.z,lv),surf(v.x,v.z-.03,lv),surf(v.x,v.z+.03,lv)),p=s-v.y;   /* 3 cm leeway at step edges */if(p>.03)st.nPen=(st.nPen||0)+1;if(who==='player'&&p>(st.pp||0)){st.pp=p;st.ppAt=q.role[0]+' t'+st.t.toFixed(2)+' '+v.x.toFixed(2)+','+v.y.toFixed(2)+','+v.z.toFixed(2);}if(p>st.pen){st.pen=p;st.penAt=who+':'+q.role[0]+' t'+st.t.toFixed(2)+' '+v.x.toFixed(2)+','+v.y.toFixed(2)+','+v.z.toFixed(2);}
      for(const w of walls){const d=w(v);if(d>st.wall){st.wall=d;st.wallAt=who+' t'+st.t.toFixed(2)+' '+v.x.toFixed(2)+','+v.y.toFixed(2)+','+v.z.toFixed(2);}}}}};
  st.feet=(R,legs,tg,who)=>{R.legs.forEach((l,i)=>{if(!legs[i].st)return;let mn=1e9;l.parts.forEach(q=>{if(q.outline)return;const a=q.geo.attributes.position.array,M=q.mesh.matrixWorld;for(let k=0;k<a.length;k+=3){v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M);if(v.y<mn)mn=v.y;}});
      const g=mn-legs[i].p.y;if(Math.abs(g)>Math.abs(st.gap)){st.gap=g;st.gapAt=who+' t'+st.t.toFixed(2)+' leg'+i;}});};
  st.print=()=>dbg('CHECK',name,'sink',st.pen.toFixed(3),'n>3cm',st.nPen||0,'PLAYER',(st.pp||0).toFixed(3),st.ppAt,st.penAt,'| planted foot gap',st.gap.toFixed(3),st.gapAt,'| wall/rail',st.wall.toFixed(3),st.wallAt,'| dog reach',st.dogR.toFixed(2),st.dogRAt);return st;}
/* blockers: >0 = how far a point is inside */
const wallL=v=>v.y<9.8&&v.z<5&&v.z>-5?(-6.8)-v.x:0;                   /* left wall inner face x -6.8 */
const wallR=v=>v.y<9.8&&v.z<5&&v.z>-5?v.x-6.82:0;                      /* right wall (cut away here, full wall in the shop) */
const wallF=v=>v.x<7&&v.x>-7?v.z-4.92:0;                               /* front wall (cut away here) */
function handrail(f){const xr=f.xc+(f.xc<0?.84:-.84);return v=>{if(v.z<SZ0||v.z>SZ1||Math.abs(v.x-xr)>.3)return 0;if(v.z>SZ1-.6)return 0;const yr=f.y0+.9+(SZ1-v.z)/(SZ1-SZ0)*f.R*NS+.05;if(v.y>yr)return 0;return f.xc<0?v.x-(xr-.04):(xr+.04)-v.x;};}
function railMid(lvY){return v=>{if(v.y<lvY-.1||v.y>lvY+1.2)return 0;let d=0;
  if(v.x>-3.25&&v.x<3.25&&v.z>-2.05&&v.z<2.65)d=Math.min(v.x+3.25,3.25-v.x,v.z+2.05,2.65-v.z);return d;};}

/* ---------- camera: follows the player's smoothed position, no cuts ---------- */
function follower(C,fn,off,look){return t=>{const T=V(0,0,0);let n=0;for(let k=-6;k<=6;k++){const w=1-Math.abs(k)/7;T.addScaledVector(fn(cl(t+k*.012,0,.999)),w);n+=w;}T.multiplyScalar(1/n);
  const o2=typeof off==='function'?off(T):off;C.position.set(T.x+o2[0],Math.min(T.y+o2[1],o2[3]||99),T.z+o2[2]);C.lookAt(T.x+(look?look[0]:0),T.y+(look?look[1]:.6),T.z+(look?look[2]:0));};}

/* ---------- one stairs cell ---------- */
function walkCell(label,sub,o){return cell(label,sub,()=>{const {S,g}=room();const Q=player(S),D=dog(S);const path0=mkPath(o.pts,o.rad||.45);const pathD0=o.dpts?mkPath(o.dpts,o.drad||o.rad||.45):path0,dShift=pathD0.L-path0.L;   /* dpts: the dog's own way in (same end as the player's) */
  const path=offPath(path0,o.pl||0),pathD=offPath(pathD0,o.dl||0);
  /* cut-away: the low stubs that stand for the front wall are hidden so the camera sees in (the real shop has a full front wall) */
  g.updateMatrixWorld(true);g.traverse(m=>{if(!m.isMesh)return;const b=new THREE.Box3().setFromObject(m),z=b.getSize(V(0,0,0));if(z.z<.2&&b.min.z>4.8&&z.y<.7&&z.x>.5)m.visible=false;});
  const pp=phaser(path0,.95,2*DD),pd=phaser(pathD0,.5,2*DD);const gap=o.gap||1.4;   /* dog stays well behind (body .9 long + 0.3 clear) */const s0=o.dpts?0:gap,s1=path.L-(o.endBack||0);
  const w=t=>seg(t,o.t0,o.t0+.07)*(1-seg(t,o.t1-.07,o.t1));const cum=cumOf(w,1000);
  /* stop both walkers with all feet down: end phase snapped to a still moment */
  const f0=pp.phiOf(s0),f1r=pp.phiOf(s1);const f1=Math.floor(f1r-.45)+.45;const sP=t=>pp.sOf(f0+(f1-f0)*cum(t));
  /* the dog follows the player at a fixed path distance (gap); at the end it shifts to the nearest all-paws-down moment */
  const e0=sP(.999)+dShift-gap,fe=pd.phiOf(e0),corr=pd.sOf(Math.round(fe-.495)+.495)-e0;
  const sD=t=>sP(t)+dShift-gap+corr*seg(t,o.t1-.12,o.t1);
  const C=new THREE.PerspectiveCamera(o.fov||32,1,.05,200);
  /* camera aims between the player and the dog (player weighted more) */
  const posAt=t=>{const a=path.at(sP(t)).p,b=pathD.at(sD(t)).p;const ya=surf(a.x,a.z,o.lv),yb=surf(b.x,b.z,o.lv);const k=o.dw??.35;return V(a.x*(1-k)+b.x*k,ya*(1-k)+yb*k,a.z*(1-k)+b.z*k);};
  const cf=follower(C,posAt,o.cam,o.look);if(o.hide){g.updateMatrixWorld(true);g.traverse(m=>{if(m.isMesh&&o.hide(new THREE.Box3().setFromObject(m)))m.visible=false;});}
  const st=checker(label,o.lv,o.walls||[]);
  /* real rail test: every railing/handrail/post mesh of the room (thin, green), point inside its own box + 3 cm gap */
  g.updateMatrixWorld(true);const rails=[];g.traverse(m=>{if(!m.isMesh||!m.visible||!m.material||!m.material.color||m.material.side===THREE.BackSide)return;const h=m.material.color.getHexString();if(h!=='2f8f78'&&h!=='5fd4b0')return;
    m.geometry.computeBoundingBox();const bb=m.geometry.boundingBox,sz=bb.getSize(V(0,0,0));const ds=[sz.x,sz.y,sz.z].sort((x,y)=>x-y);if(ds[1]>.1||ds[2]<.5)return;   /* line-like only: bars, posts, handrails */rails.push({inv:m.matrixWorld.clone().invert(),bb:bb.clone().expandByScalar(.03),wb:new THREE.Box3().setFromObject(m).expandByScalar(.05)});});
  st.rail=0;st.railAt='';const vv=V(0,0,0),vl=V(0,0,0);
  const railTest=(R,who)=>{for(const q of R.parts){if(q.outline)continue;const a=q.geo.attributes.position.array,M=q.mesh.matrixWorld;for(let k=0;k<a.length;k+=9){vv.set(a[k],a[k+1],a[k+2]).applyMatrix4(M);
    for(const r of rails){if(!r.wb.containsPoint(vv))continue;vl.copy(vv).applyMatrix4(r.inv);if(r.bb.containsPoint(vl)){st.rail++;if(!st.railAt.includes(who+' t'+st.t.toFixed(2)))st.railAt+=who+' t'+st.t.toFixed(2)+'('+q.role[0]+' '+vv.x.toFixed(2)+','+vv.y.toFixed(2)+','+vv.z.toFixed(2)+') ';}}}}};
  return {S,C,tick:t=>{st.t=t;const s=sP(t);const lean=o.lean?o.lean(path.at(s).p):0;playerPose(Q,path,pp,s,o.lv,lean,st);dogPose(D,pathD,pd,sD(t),o.lv,t,st);
    st.body(Q.R,'player');st.body(D.R,'dog');{/* clear gap dog - player, by real vertex distance */const A=[],B=[];const v=V(0,0,0);for(const [R,L] of [[Q.R,A],[D.R,B]])for(const q of R.parts){if(q.outline)continue;const a=q.geo.attributes.position.array,M=q.mesh.matrixWorld;for(let k=0;k<a.length;k+=24)L.push(v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M).clone());}
      let m=9;for(const a of A)for(const b of B){const d=a.distanceToSquared(b);if(d<m)m=d;}m=Math.sqrt(m);if(m<(st.gapMin??9)){st.gapMin=m;st.gapMinAt=t.toFixed(2);}}railTest(Q.R,'P');railTest(D.R,'D');cf(t);if(t>=(o.frames-1)/o.frames-1e-6){st.print();dbg('DOG-PLAYER min gap',label,(st.gapMin||0).toFixed(2),'at t',st.gapMinAt);dbg('RAIL',label,rails.length,'hits',st.rail,st.railAt.slice(0,400));}}};});}

const FR=84;
/* which floor a walker stands on outside the stairs */
const lvUp1=(x,z)=>z<SZ0+.001&&x<-3.3?1:0;   /* floor 2 behind the stairs */
const lvUp2=(x,z)=>z<SZ0+.001&&x>3.3?2:1;
const lvMid=()=>1;
const onA=p=>flightAt(p.x,p.z,.2)===FA,onB=p=>flightAt(p.x,p.z,.2)===FB;
const cells=[
  walkCell('Up to floor 2','stand-in player · front wall cut away · story loop',{pts:[[-3.9,4.56],[-5.95,4.56],[-5.95,-2.3]],dpts:[[-2.5,4.6],[-5.95,4.6],[-5.95,-2.3]],rad:.3,drad:.55,lv:lvUp1,t0:.02,t1:.9,frames:FR,pl:0,dl:.3,
    cam:[.5,2.9,6.6,6.05],look:[0,.6,0],lean:p=>onA(p)?-.12:0,walls:[wallL,wallF,handrail(FA)]}),
  walkCell('Up to floor 3','same, on the right stairs · story loop',{pts:[[3.9,4.56],[5.95,4.56],[5.95,-1.8]],dpts:[[2.5,4.6],[5.95,4.6],[5.95,-1.8]],rad:.3,drad:.55,lv:lvUp2,t0:.02,t1:.9,frames:FR,pl:0,dl:-.3,
    cam:[-.5,2.9,6.6,9.25],look:[0,.6,0],lean:p=>onB(p)?-.12:0,walls:[wallR,wallF,handrail(FB)]}),
  walkCell('Down again','floor 2 to 1 · dog follows · story loop',{pts:[[-5.95,-1.3],[-5.95,4.56],[-3.9,4.56]],dpts:[[-5.3,-2.7],[-5.3,-1.0],[-5.95,-.2],[-5.95,4.56],[-3.9,4.56]],drad:.4,rad:.3,lv:lvUp1,t0:.02,t1:.9,frames:FR,pl:0,dl:-.3,
    cam:[.5,2.2,6.4,6.05],look:[0,.7,0],lean:p=>onA(p)?-.04:0,walls:[wallL,wallF,handrail(FA)]}),
  walkCell('Open middle is safe','floor 2 · tree cut away for the camera',{pts:[[.6,-2.5],[-3.9,-2.5],[-3.9,3.6]],rad:.5,lv:lvMid,t0:.02,t1:.92,frames:FR,
    cam:[4.2,2.6,3.4],look:[0,.5,0],walls:[railMid(LV[1])],
    /* cut-away: the shop tree in the open middle (and the pets on it) is hidden above floor 2 so the camera sees the walk */
    hide:b=>{const c=b.getCenter(V(0,0,0));return c.x>-2.9&&c.x<2.9&&c.z>-1.7&&c.z<2.3&&c.y>3.7;}}),
];
CLIPS2.shopStairs={title:'Pet Shop: one room, 3 floors, real stairs (no cutscene, no fade)',cols:2,cw:400,ch:330,frames:FR,cells};
})();
