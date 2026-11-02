window.CLIPS2=(function(){const P_=Math.PI,TAU=2*P_;const {scene,cam}=MV;
const cl=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),ease=x=>{x=cl(x);return x*x*(3-2*x);},seg=(t,a,b)=>ease((t-a)/(b-a)),bell=(t,a,b)=>Math.sin(P_*cl((t-a)/(b-a)));
const S2=x=>Math.sin(TAU*x),C2=x=>Math.cos(TAU*x);
function grassTex(col1,col2){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle=col1;x.fillRect(0,0,128,128);x.fillStyle=col2;
  let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<46;i++){const px=rnd()*128,py=rnd()*128,r=2+rnd()*5;x.beginPath();x.ellipse(px,py,r*1.6,r,0,0,TAU);x.fill();}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
function stage(R,o){o=o||{};const S=scene();S.add(R.root2);const tex=grassTex(o.g1||'#8fbf6a',o.g2||'#7aad57');const size=Math.max(R.L,R.H)*40;const tile=o.tile||Math.max(R.L,R.H)*.9;
  tex.repeat.set(size/tile,size/tile);const g=new THREE.Mesh(new THREE.PlaneGeometry(size,size),new THREE.MeshLambertMaterial({map:tex}));g.rotation.x=-P_/2;S.add(g);
  RIG.addShadow(R,S);const r=Math.max(R.L,R.H)*(o.zoom||.8),C=cam(r,R.H*(o.cy||.5),o.yaw??.55,o.pitch??.22);let tl=tile;return {S,C,R,tex,tile,setDist(d){tex.offset.x=d/tl;},fit(D){if(!D)return;const n=Math.max(1,Math.round(Math.abs(D)/tile));tl=Math.abs(D)/n;tex.repeat.set(size/tl,size/tl);}};}
function prop(S,geo,col,x,y,z){const q=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color:col}));q.position.set(x,y,z);S.add(q);return q;}
const mk=(id,o,kind,face,opt)=>RIG.make(id,o,kind,face,opt);
const ADULT={age:'adult'};
/* species gait settings */
function spec(R,id){if(/bunny/.test(id))return {g:'hop',A:.55,B:1.1,f:3};if(R.biped)return {g:'biped',A:.5,B:.9,f:4};return {g:'walk',A:.42,B:.85,f:3};}
/* ---- reusable pose pieces ---- */
function walkP(R,sp,ph,P,amp){P=P||{};amp=amp??1;RIG.gait(R,P,sp.g,ph,sp.A*amp,sp.B*amp);P.root=P.root||{};
  if(sp.g==='hop'){const h=Math.max(0,S2(ph));P.root.y=(P.root.y||0)+h*R.H*.16*amp;P.root.rz=(P.root.rz||0)+.12*C2(ph)*amp;}
  else {P.root.y=(P.root.y||0)+R.H*.02*amp*Math.abs(S2(ph*2));if(R.biped)P.root.rx=(P.root.rx||0)+.12*S2(ph)*amp;P.hp=(P.hp||0)+.05*S2(ph*2)*amp;}
  return P;}
function legAvg(R){return R.legs.length?R.legs.reduce((s,l)=>s+l.len,0)/R.legs.length:R.H*.25;}
function lieP(R,k,P){P=P||{};P.hip=P.hip||[];P.knee=P.knee||[];const len=legAvg(R);
  R.legs.forEach((l,i)=>{if(R.biped){P.knee[i]=(P.knee[i]||0)-1.6*k;P.hip[i]=(P.hip[i]||0)+1.2*k;}else if(l.front){P.hip[i]=(P.hip[i]||0)+1.45*k;P.knee[i]=(P.knee[i]||0)-.1*k;}else{P.hip[i]=(P.hip[i]||0)+1.3*k;P.knee[i]=(P.knee[i]||0)-1.9*k;}});
  P.root=P.root||{};P.root.y=(P.root.y||0)-len*.88*k;return P;}
function sitP(R,k,P){P=P||{};P.hip=P.hip||[];P.knee=P.knee||[];const fr=R.legs.filter(l=>l.front),hd=R.legs.filter(l=>!l.front);if(!fr.length||!hd.length)return lieP(R,k*.6,P);
  const fx=fr[0].x,hx=hd[0].x,len=legAvg(R),th=Math.min(.75,Math.asin(cl(len*.8/(fx-hx+1e-6),0,.99)))*k;
  R.legs.forEach((l,i)=>{if(l.front)P.hip[i]=(P.hip[i]||0)-th;else{P.hip[i]=(P.hip[i]||0)+1.5*k-th;P.knee[i]=(P.knee[i]||0)-2.2*k;}});
  P.root=P.root||{};P.root.rz=(P.root.rz||0)+th;P.root.piv=[fx,0,0];P.hp=(P.hp||0)-th*.8;P.tp=(P.tp||0)+th*.8;return P;}
function wag(P,t,f,a){P.ty=(P.ty||0)+a*S2(t*f);return P;}
function jumpArc(t,a,b,h){const u=cl((t-a)/(b-a));return u>0&&u<1?4*h*u*(1-u):0;}
/* ---------- shared pet moves ---------- */
function shared(id,move){return ()=>{const o=move==='baby'?{age:'baby'}:ADULT;const R=mk(id,o);const sp=spec(R,id);
  const st=stage(R,{zoom:move==='attention'?1.6:.95,cy:move==='happy'?.72:move==='attention'?1.0:.55,yaw:move==='baby'?0.02:.5});const S=st.S;let tick;const L=R.L,H=R.H;
  if(move==='play'){const ball=prop(S,new THREE.SphereGeometry(H*.11,16,12),'#ffcf3a',L*.75,H*.11,0);
    tick=t=>{const P={};// bow 0-.3, hop .35-.6, hop .65-.9
      const bow=bell(t,0,.34);if(bow){P.hip=[];P.knee=[];R.legs.forEach((l,i)=>{if(l.front||R.biped){P.hip[i]=.9*bow;P.knee[i]=-.5*bow;}});P.root={rz:-.28*bow,piv:[R.legs.length?Math.min(...R.legs.map(l=>l.x)):0,0,0],y:-H*.06*bow};P.hp=.35*bow;}
      for(const [a,b] of [[.36,.6],[.64,.88]]){const y=jumpArc(t,a,b,H*.35);const u=cl((t-a)/(b-a));if(u>0&&u<1){P.root={y,rz:.25*Math.cos(P_*u)};P.hip=[];P.knee=[];R.legs.forEach((l,i)=>{P.hip[i]=(l.front?.6:-.6)*Math.sin(P_*u);P.knee[i]=(l.front?-1:1)*.9*Math.sin(P_*u);});}
        const land=bell(t,b,b+.05);if(land)P.root=Object.assign(P.root||{},{sq:1-.15*land});const crouch=bell(t,a-.05,a);if(crouch){P.root=Object.assign(P.root||{},{sq:1-.12*crouch});}}
      wag(P,t,9,.6);ball.position.y=H*.11+jumpArc(t,.38,.62,H*.5)+jumpArc(t,.66,.9,H*.5);RIG.pose(R,P);};}
  else if(move==='rest'){tick=t=>{const P={hip:[],knee:[]};const yawn=bell(t,0,.16);P.hp=.7*yawn;R.legs.forEach((l,i)=>{if(l.front&&!R.biped)P.hip[i]=.7*yawn;});P.root={rz:-.18*yawn,piv:[R.legs.length?Math.min(...R.legs.map(l=>l.x)):0,0,0]};if(R.biped)P.wing=[.6*yawn,.6*yawn];
      const lie=seg(t,.18,.32)*(1-seg(t,.88,.99));lieP(R,lie,P);P.br=lie>.95?.04*S2(t*4):0;P.hp-=.18*lie;P.tp=.35*lie;RIG.pose(R,P);};}
  else if(move==='attention'){const man=RIG.bake('farm:farmer',{who:'b'},-Math.PI/2);man.root.scale.setScalar(1.75/man.H);S.add(man.root);const leg={position:{x:0}},shoe={position:{x:0}};
    const sp2=Object.assign({},sp),D=L*.4;let tile=st.tile;
    tick=t=>{const w=1-seg(t,.3,.36);const ph=sp.f*Math.min(t,.33)/1;const dist=D*seg(t,0,.33)*0+D*cl(t/.33);const P=w>0?walkP(R,sp,ph,{},w):{};
      st.setDist(dist);man.root.position.x=L*.62+.18+D-dist;shoe.position.x+=H*.08;
      const up=seg(t,.36,.46)*(1-seg(t,.9,1));P.hp=(P.hp||0)+.8*up;const nud=t>.5&&t<.85?Math.max(0,S2((t-.5)*4)):0;P.root=Object.assign(P.root||{},{x:L*.12*nud});P.hp+=-.25*nud;wag(P,t,8,.5*up);RIG.pose(R,P);};}
  else if(move==='food'){const bowl=prop(S,new THREE.CylinderGeometry(H*.26,H*.2,H*.13,20),'#9aa7c7',0,H*.065,0);const D=L*.4;
    tick=t=>{const w=1-seg(t,.24,.3);const P=w>0?walkP(R,sp,sp.f*Math.min(t,.27),{},w):{};const dist=D*cl(t/.27);st.setDist(dist);bowl.position.x=L*.62+D-dist;
      const sn=seg(t,.28,.36)*(1-seg(t,.56,.62));P.hp=(P.hp||0)-.5*sn+(sn>.9?.07*S2(t*14):0);P.root=Object.assign(P.root||{},{rz:(P.root&&P.root.rz||0)-.12*sn,piv:[R.legs.length?Math.min(...R.legs.map(l=>l.x)):0,0,0]});
      const sit=seg(t,.62,.72)*(1-seg(t,.93,1));if(sit)sitP(R,sit,P);P.hp=(P.hp||0)-.15*sit;RIG.pose(R,P);};}
  else if(move==='sad'){const f=2,D=RIG.stride(R,sp.A*.5,f);tick=t=>{const P=walkP(R,sp,f*t,{},.7);P.hp=(P.hp||0)-.6;P.tp=2.0;P.root.y=(P.root.y||0)-H*.02;st.setDist(D*t);RIG.pose(R,P);};}
  else if(move==='happy'){tick=t=>{const P={hip:[],knee:[]};const jumps=[[.05,.4],[.5,.9]];let air=0;
      for(const [a,b] of jumps){const u=cl((t-a)/(b-a));if(u>0&&u<1){air=1;P.root={y:jumpArc(t,a,b,H*.38),ry:a>.4?TAU*ease(u):0};R.legs.forEach((l,i)=>{P.hip[i]=(l.front?.7:-.7)*Math.sin(P_*u);P.knee[i]=(l.front?-1.2:1.2)*Math.sin(P_*u);});}
        const c=bell(t,a-.05,a+.01),ld=bell(t,b-.01,b+.06);if(c||ld){P.root=Object.assign(P.root||{},{sq:1-.18*(c+ld)});lieP(R,.25*(c+ld),P);}}
      wag(P,t,12,.8);P.hp=(P.hp||0)+.2;RIG.pose(R,P);};}
  else if(move==='baby'){const f=4,D=RIG.stride(R,sp.A*.8,f)*.6;tick=t=>{const trip=bell(t,.55,.85);const P=walkP(R,sp,f*t+.08*S2(t*3),{},.85*(1-trip));
      P.root.rx=(P.root.rx||0)+.12*S2(t*f/2);if(trip){P.hip=P.hip||[];R.legs.forEach((l,i)=>{if(l.front||R.biped){P.hip[i]=(P.hip[i]||0)+1.0*trip;P.knee[i]=(P.knee[i]||0)-.8*trip;}});P.hp=(P.hp||0)-.35*trip;P.root.rz=(P.root.rz||0)-.32*trip;P.root.piv=[R.B.min.x,0,0];P.root.y=(P.root.y||0)-legAvg(R)*.3*trip;}st.setDist(D*(t-.25*seg(t,.55,.85)));RIG.pose(R,P);};}
  return {S,C:st.C,tick};};}
const pets=[['age:dog','Dog'],['age:cat','Cat'],['age:bunny','Bunny'],['age:duck','Duck']];
const mv=[['food','Unhappy: bowl','to the bowl, sniffs, sits'],['play','Unhappy: play','play bow, hops'],['rest','Unhappy: nap','yawns, lies down'],['attention','Unhappy: attention','walks up, nudges'],['sad','Sad','slow, head and tail low'],['happy','Very happy','big jumps, spin'],['baby','Baby walk','clumsy, trips']];
const sharedCells=[];for(const [id,n] of pets)for(const [k,l,s] of mv)sharedCells.push({label:n+': '+l,sub:s,setup:shared(id,k)});
function cell(label,sub,fn){return {label,sub,setup:fn};}
/* ---------- others ---------- */
function walker(id,o,g,A,B,f,opt,extra){return ()=>{const R=mk(id,o,opt&&opt.kind,opt&&opt.face);const st=stage(R,opt);const sp={g,A,B,f};const D=RIG.stride(R,A,f)*(opt&&opt.dk||1);st.fit(D);
  return {S:st.S,C:st.C,tick:t=>{const P=walkP(R,sp,f*t,{},1);if(extra)extra(P,t,R);st.setDist(D*t);RIG.pose(R,P);if(opt&&opt.after)opt.after(t,R,st);}};};}
function horseGait(name,g,A,B,f,bob,pitch,sub){return cell(name,sub||'',()=>{const R=mk('farm:horse');const st=stage(R,{zoom:.95});const D=RIG.stride(R,A,f);
  return {S:st.S,C:st.C,tick:t=>{const P=RIG.gait(R,{},g,f*t,A,B);P.root={y:R.H*bob*Math.abs(S2(f*t*(g==='gallop'?1:2))),rz:pitch*S2(f*t)};P.hp=-.06+.08*S2(f*t*(g==='gallop'?1:2)+.25);P.ty=.15*S2(f*t);st.setDist(D*t);RIG.pose(R,P);}};});}

function horseP(R,P,g,ph,A,B){P.hip=P.hip||[];P.knee=P.knee||[];P.ank=P.ank||[];const T=RIG.PH[g];
  R.legs.forEach((l,i)=>{const key=(l.front?'F':'H')+(l.side>0?'L':'R');const f=TAU*(ph+T[key]);const lift=Math.max(0,Math.cos(f));
    if(l.front){P.hip[i]=(P.hip[i]||0)+A*Math.sin(f);P.knee[i]=(P.knee[i]||0)-B*lift;P.ank[i]=(P.ank[i]||0)-.5*B*lift+.1;}
    else{const ha=g==='gallop'?.55:.8;P.hip[i]=(P.hip[i]||0)-.16+A*ha*Math.sin(f);P.knee[i]=(P.knee[i]||0)+.32+B*1.1*lift;P.ank[i]=(P.ank[i]||0)-.3-.45*B*lift;}});return P;}
function hcell(name,sub,g,A,B,f,bob,pitch){return cell(name,sub,()=>{const R=mk('farm:horse');const st=stage(R,{zoom:.95});const D=RIG.stride(R,A,f);
  return {S:st.S,C:st.C,tick:t=>{const P=horseP(R,{},g,f*t,A,B);const fb=g==='gallop'?1:2;P.root={y:R.H*bob*Math.abs(S2(f*t*fb)),rz:pitch*S2(f*t)};P.hp=-.06+.08*S2(f*t*fb+.25);P.ty=.15*S2(f*t);P.flex=g==='gallop'?{y:.025*S2(f*t)}:{z:.015*S2(f*t)};st.setDist(D*t);RIG.pose(R,P);}};});}
function rcell(name,sub,g,A,B,f,bob,pitch,post){return cell(name,sub,()=>{const R=mk('farm:horse');const st=stage(R,{zoom:.95,cy:.6});const D=RIG.stride(R,A,f);
  const Q=mk('farm:farmer',{who:'a'},'human');const sc=1.45/Q.H;Q.root2.scale.setScalar(sc);R.root.add(Q.root2);const legTop=Q.legs[0].top*sc;
  const sad=R.parts.filter(p=>!R.isBody(p)&&p.role[0]==='rest'&&p.bb.max.y>R.bodyC.y&&p.bb.max.x<R.neck.x&&p.bb.min.x>R.B.min.x*.7);const sx=sad.length?sad.reduce((a,p)=>a+(p.bb.min.x+p.bb.max.x)/2,0)/sad.length:-.2;const sy=Math.max(sad.length?Math.max(...sad.map(p=>p.bb.max.y)):0,R.body.bb.max.y+.06);
  return {S:st.S,C:st.C,tick:t=>{const P=horseP(R,{},g,f*t,A,B);const fb=2;P.root={y:R.H*bob*Math.abs(S2(f*t*fb)),rz:pitch*S2(f*t)};P.hp=-.06+.08*S2(f*t*fb+.25);P.ty=.15*S2(f*t);st.setDist(D*t);RIG.pose(R,P);
    const up=post?Math.max(0,S2(f*t)):0;Q.root2.position.set(sx-.05,sy-legTop+.02+R.H*.03*up,0);RIG.pose(Q,{floor:false,hip:[1.35-.3*up,1.35-.3*up],knee:[-1.45+.2*up,-1.45+.2*up],spread:[R.W*.42/sc,R.W*.42/sc],arm:[.7,.7],root:{rz:-.08+.1*up}});}};});}
function bcell(name,sub,id,fn,gap,place,walk){return cell(name,sub,()=>{const B=cowFix(mk(id,Object.assign({},PU[id].dflt,{age:'baby'})));const M=cowFix(mk(id,Object.assign({},PU[id].dflt,{age:'adult'})));
  const st=stage(M,{zoom:.95,cy:.45,yaw:.6});st.S.add(B.root2);RIG.addShadow(B,st.S);B.root2.position.set(M.L*(id==='farm:chicken'?.85:.6),0,M.W*1.0);
  const D=walk?RIG.stride(M,.4,4):0;
  return {S:st.S,C:st.C,tick:t=>{const P={hip:[],knee:[]},MP={hip:[],knee:[]};fn(B,P,t,M,MP);if(place)place(B,t,M);if(walk)st.setDist(D*t);RIG.pose(M,MP);RIG.pose(B,P);}};});}
function rollRoot(R,th){const cy=R.bodyC.y,c=Math.cos(th),sn=Math.sin(th);const d=cy*Math.max(c,0)**2+(R.H-cy)*.85*Math.max(-c,0)**2+(R.W*.5)*sn*sn;return {rx:th,piv:[0,cy,0],y:d-cy};}
function cowFix(R){if(!/^farm:cow/.test(R.id))return R;const bx=R.body.bb.max.x;R.head.filter(q=>q.bb.max.x<=bx+.01*R.L&&q.bb.max.x-q.bb.min.x<.02*R.L&&q.bb.min.y<R.neck.y).forEach(q=>{q.role=['rest',0];R.head.splice(R.head.indexOf(q),1);});return R;}
function cowTail(R){if(!R.tails.length)return null;const top=Math.max(...R.tails.map(q=>q.bb.max.y));const d=top-(R.body.bb.max.y-.04*R.H);return d>0?[0,-d]:null;}
function chickNeck(R){const b=R.body.bb;R.neck.x=b.max.x-.25*(b.max.x-b.min.x);R.neck.y=(b.min.y+b.max.y)/2+.1*(b.max.y-b.min.y);}
const SETS={
shared:{title:'Shared pet moves: Unhappy signs and moods (one set for every pet)',cols:7,cw:190,ch:170,cells:sharedCells},
capy1:{title:'Capybara: one model, moods in face and pose',cols:1,cw:520,ch:400,frames:144,cells:[cell('Mood','what it shows',()=>{
  const FACES={normal:{},curious:{eye:1.1,ear:1.6,mouth:'o'},happy:{eyes:'happy',mouth:'open',blush:1},content:{eyes:'sleepy',mouth:'smile',blush:1},tired:{eyes:'sleepy'},yawn:{eyes:'sleepy',mouth:'yawn'}};
  const rigs={};for(const k in FACES){const id='capy:face_'+k;PU[id]={dflt:{},build(g){g.add(puAge(capyReal2('#b8784a',FACES[k]),'adult').root);}};rigs[k]=mk(id,{});}
  const base=rigs.normal;const st=stage(base,{zoom:.72,cy:.5,yaw:1.0});for(const k in rigs)if(rigs[k]!==base)st.S.add(rigs[k].root2);
  const SEQ=[[0,.1,'Normal','calm, breathes, looks around','normal'],[.1,.22,'Curious','ears up, big eyes, looks left and right','curious'],[.22,.36,'Very happy','happy face, little hops','happy'],[.36,.46,'Content','smile and blush, gentle sway','content'],[.46,.58,'Tired','sleepy eyes, nods off','tired'],[.58,.65,'Yawn','big yawn','yawn'],[.65,.73,'Lies down','sleepy','tired'],[.73,.9,'Asleep','lying, chin down, deep breaths','tired'],[.9,1.01,'Wakes up','stands up','normal']];
  const cur=t=>SEQ.find(s=>t>=s[0]&&t<s[1])||SEQ[0];
  return {S:st.S,C:st.C,label:t=>cur(t)[2],sub:t=>cur(t)[3],tick:t=>{const s=cur(t),u=(t-s[0])/(s[1]-s[0]);const P={hip:[],knee:[]};
    const br=.05*Math.sin(TAU*t*12);P.br=br;
    if(s[2]==='Normal')P.hy=.35*Math.sin(TAU*u);
    if(s[2]==='Curious'){P.hp=.18*ease(cl(u/.2));const k=u*3,i=Math.floor(k),f=k-i;P.hy=.55*[0,1,-1,0][Math.min(3,i)]*(1-ease(cl(f/.3)))+.55*[1,-1,0,0][Math.min(3,i)]*ease(cl(f/.3));}
    if(s[2]==='Very happy'){const y=jumpArc(u,.05,.45,base.H*.3)+jumpArc(u,.5,.9,base.H*.3);const ld=bell(u,.42,.5)+bell(u,.87,.95);P.root={y,sq:1-.1*ld};const a=bell(u,.1,.42)+bell(u,.55,.87);base.legs.forEach((l,i)=>{P.hip[i]=(l.front?.4:-.4)*a;P.knee[i]=(l.front?-.6:.6)*a;});P.hp=.12;}
    if(s[2]==='Content'){P.root={rx:.06*Math.sin(TAU*u*2)};P.hp=.06;P.hy=.12*Math.sin(TAU*u);}
    if(s[2]==='Tired'){const v=(u*2)%1;P.hp=-.35*ease(cl(v/.75))+.35*ease(cl((v-.8)/.2));}
    if(s[2]==='Yawn'){P.hp=.45*bell(u,0,1);P.root={sq:1+.03*bell(u,0,1)};}
    const lie=s[2]==='Lies down'?ease(u):s[2]==='Asleep'?1:s[2]==='Wakes up'?1-ease(cl(u/.6)):0;
    if(lie){lieP(base,lie,P);P.hp=(P.hp||0)-.12*lie;}
    if(s[2]==='Asleep'){P.br=.1*Math.sin(TAU*u*3);P.root=Object.assign(P.root||{},{sq:1+.03*Math.sin(TAU*u*3)});}
    for(const k in rigs){rigs[k].root2.visible=(k===s[4]);RIG.pose(rigs[k],JSON.parse(JSON.stringify(P)));}}};})]},
capy:{title:'Capybara reactions: your capybara versions as body language',cols:5,cw:240,ch:210,cells:(()=>{
 const C=(v,label,sub,kind,fn)=>cell(label,sub,()=>{const R=mk('age:capybara',{v,age:'adult'},kind);const st=stage(R,{zoom:R.L>1.3?.58:.75,cy:.5,yaw:.9});return {S:st.S,C:st.C,tick:t=>{const P={};fn(P,t,R);RIG.pose(R,P);}};});
 const breathe=(P,t,a)=>{P.br=(P.br||0)+(a||.05)*S2(2*t);};
 const steps=t=>{const k=4*t,i=Math.floor(k),f=k-i;return [0,1,0,-1][i%4]*(1-ease(cl((f-.0)/.3)))+[1,0,-1,0][i%4]*ease(cl((f-.0)/.3));};
 return [
  C('real','Normal','calm, looks around',null,(P,t)=>{breathe(P,t);P.hy=.3*S2(t);}),
  C('s_smile','Content','after food or attention',null,(P,t)=>{breathe(P,t);P.root={rx:.05*S2(t)};P.hp=.05*S2(2*t);}),
  C('r_sleepy','Tired','rest need: dozes, nods off',null,(P,t)=>{breathe(P,t,.04);const u=(2*t)%1;P.hp=-.5*ease(cl(u/.8))+(u>.8?.5*ease((u-.8)/.2):0);}),
  C('s_yawn','Yawn','rest need rising',null,(P,t)=>{breathe(P,t);P.hp=.45*bell(t,.15,.65);P.root={sq:1+.04*bell(t,.15,.65)};}),
  C('s_tilt','Cute idle','head tilt, sways',null,(P,t)=>{breathe(P,t);P.hy=.3*S2(t);P.root={rx:.12*S2(t)};}),
  C('r_lie','Resting','lying, slow breaths','none',(P,t)=>{breathe(P,t,.1);P.root={sq:1+.03*S2(2*t)};}),
  C('s_chin','Asleep','chin down, deep breaths','none',(P,t)=>{breathe(P,t,.12);P.root={sq:1+.04*S2(2*t)};}),
  C('r_happy','Very happy','little happy hops',null,(P,t,R)=>{const y=jumpArc(t,.1,.4,R.H*.25)+jumpArc(t,.55,.85,R.H*.25);const ld=bell(t,.4,.48)+bell(t,.85,.93);P.root={y,sq:1-.1*ld};P.hip=[];P.knee=[];R.legs.forEach((l,i)=>{const a=bell(t,.1,.4)+bell(t,.55,.85);P.hip[i]=(l.front?.4:-.4)*a;P.knee[i]=(l.front?-.6:.6)*a;});}),
  C('r_curious','Curious','ears up, looks left and right',null,(P,t)=>{breathe(P,t);P.hy=.7*steps(t);P.hp=.15;}),
  null,
  C('sleepy','Cute set: sleepy','kept as a second style',null,(P,t)=>{breathe(P,t);P.hp=-.08*S2(t);}),
  C('happy','Cute set: happy','kept as a second style',null,(P,t,R)=>{breathe(P,t);P.root={y:jumpArc(t,.2,.5,R.H*.1),sq:1-.08*bell(t,.5,.58)};}),
  C('loaf','Cute set: lying loaf','resting',null,(P,t)=>{breathe(P,t,.1);}),
  C('chubby','Cute set: chubby baby face','',null,(P,t)=>{breathe(P,t);P.hy=.25*S2(t);}),
  null];})()},
snake:{title:'Snake',cols:2,cw:320,ch:240,cells:[
 cell('Slither','S-wave travels down the body',()=>{const R=mk('pet:snake',{},'spine');const st=stage(R,{zoom:.6,cy:.3,pitch:.75,yaw:.3});return {S:st.S,C:st.C,tick:t=>{RIG.pose(R,{spine:{a:.1,k:1.6,ph:TAU*2*t,ax:'z'}});st.setDist(R.L*.8*t);}};}),
 cell('In its glass tank','slow S-wave behind the glass',()=>{const S=scene();const tk=RIG.bake('home:tank');S.add(tk.root);tk.parts.forEach(q=>{if(q.bb.min.y>tk.H*.85){q.mesh.visible=false;return;}if(q.bb.max.y>tk.H*.12){const m=q.mesh.material.clone();m.transparent=true;m.opacity=q.outline?.04:.06;m.depthWrite=false;q.mesh.material=m;q.mesh.renderOrder=5;}});const R=mk('pet:snake',{},'spine');const sc=tk.L*.85/R.L;R.root2.scale.setScalar(sc);R.root2.position.y=tk.H*.16;S.add(R.root2);MV.ground(S,20,'#6d5a4a');const C=cam(tk.L*.6,tk.H*.2,.25,.85);
   return {S,C,tick:t=>RIG.pose(R,{floor:false,spine:{a:.14,k:1.1,ph:TAU*2*t,ax:'z'},hp:.15*S2(2*t)})};})]},
sheep:{title:'Sheep: a flock in its own spot',cols:1,cw:620,ch:320,cells:[cell('Flock walks together','the leader moves, the others follow',()=>{const S=scene();const off=[[0,0],[-1.5,1.25],[-1.35,-1.25]];const Rs=off.map(()=>mk('farm:sheep'));Rs.forEach(R=>S.add(R.root2));const L=Rs[0].L,H=Rs[0].H;
   const tex=grassTex('#8fbf6a','#7aad57');const sz=L*80;tex.repeat.set(sz/(L*.9),sz/(L*.9));const g=new THREE.Mesh(new THREE.PlaneGeometry(sz,sz),new THREE.MeshLambertMaterial({map:tex}));g.rotation.x=-P_/2;S.add(g);const D=RIG.stride(Rs[0],.38,3);
   const C=cam(L*1.2,H*.45,.35,.32);C.position.x-=L*.7;C.lookAt(-L*.7,H*.45,0);
   return {S,C,tick:t=>{tex.offset.x=D*t/(L*.9);Rs.forEach((R,i)=>{R.root2.position.set(off[i][0]*L+L*.08*S2(t+i*.2),0,off[i][1]*L*.8);R.root2.rotation.y=.08*S2(t+i*.3);const P=RIG.gait(R,{},'walk',3*t+i*.27,.4,1.0);P.root={y:H*.045*Math.abs(S2(6*t+i*.3)),rx:.04*S2(3*t+i*.3)};P.hp=-.15+.15*S2(3*t+i);P.ty=.3*S2(6*t);RIG.pose(R,P);});}};})]},
farmers:{title:'Farmers at work: knees bend, arms swing',cols:4,cw:220,ch:280,cells:['b','a','ona','jonas'].map((w,i)=>cell(['Hugo','Fern','Grandma Ona','Jonas'][i],i===2?'slower steps, sways':'walks, arms swing',()=>{const R=mk('farm:farmer',{who:w},'human');const st=stage(R,{zoom:.75,cy:.5,yaw:.35});const f=i===2?2:3,A=i===2?.32:.45;const D=RIG.stride(R,A,f);
   return {S:st.S,C:st.C,tick:t=>{const P=RIG.gait(R,{},'biped',f*t,A,1.15*A/.45);P.arm=R.arms.map(a=>-1.7*A*S2(f*t+(a.z>0?.5:0)));P.root={y:R.H*.025*Math.abs(S2(2*f*t)),rx:i===2?.1*S2(f*t):.03*S2(f*t)};st.setDist(D*t);RIG.pose(R,P);}};}))},
sleep:{title:'Pets sleep in beds and dog houses',cols:2,cw:320,ch:240,cells:[
 cell('Pet bed','walks in, turns, curls up',()=>{const S=scene();const bed=RIG.bake('bed',{size:'m'});S.add(bed.root);const R=mk('age:dog',ADULT);S.add(R.root2);MV.ground(S,20,'#c9a77a');const C=cam(bed.L*1.2,.25,.5,.4);const sp=spec(R,'age:dog');
   return {S,C,tick:t=>{const P=t<.45?walkP(R,sp,3*t,{},1):{};const k=cl(t/.25);R.root2.position.set(-bed.L*(1-k)*1.1,bed.H*.3*seg(t,.2,.3),0);R.root2.rotation.y=TAU*seg(t,.28,.45);
     const lie=seg(t,.45,.58);if(lie){lieP(R,lie,P);P.hp=(P.hp||0)-.3*lie;P.hy=.35*lie;P.ty=.8*lie;P.tp=1.2*lie;P.br=lie>.95?.2*S2(t*3):0;P.root=Object.assign(P.root||{},{sq:lie>.95?1+.05*S2(t*3):1});}RIG.pose(R,P);}};}),
 cell('Dog house','walks to its house, turns, lies down at the door',()=>{const S=scene();const h=RIG.bake('doghouse');S.add(h.root);const R=mk('age:dog',ADULT);S.add(R.root2);MV.ground(S,30);const C=cam(h.L*1.15,h.H*.42,.75,.28);C.position.x+=h.L*.4;C.lookAt(h.L*.4,h.H*.4,0);const sp=spec(R,'age:dog');
   return {S,C,tick:t=>{const k=seg(t,.0,.36);const turn=seg(t,.37,.47);const x=h.L*1.8*(1-k)+(h.L*.9)*k;R.root2.position.set(x,0,0);R.root2.rotation.y=P_*(1-turn);
     const P=t<.47?walkP(R,sp,4*t,{},1):{};const lie=seg(t,.48,.58);if(lie){lieP(R,lie,P);P.hp=(P.hp||0)-.15*lie;P.br=lie>.95?.2*S2(t*3):0;if(lie>.95)P.root.sq=1+.05*S2(t*3);}RIG.pose(R,P);}};})]},

seal:{title:'Seal: galumphs on land, sculls with its hind flippers in water',cols:3,cw:300,ch:240,cells:[
 cell('Galumph on land','bunches up, then stretches forward',()=>{const R=mk('pet:seal',{},'spine');const st=stage(R,{zoom:.7});let dist=0,lastT=0;
   return {S:st.S,C:st.C,tick:t=>{const u=(2*t)%1;const bunch=Math.sin(P_*cl(u/.5)),push=Math.sin(P_*cl((u-.5)/.5));
     const F=-.11*bunch;const P={flex:{y:F},root:{y:-F*R.L*.95,rz:.12*push,sx:1-.16*bunch+.07*push},hp:.3*push-.1*bunch,wing:[-.5*push+.3*bunch,-.5*push+.3*bunch],arm:[.5*push-.3*bunch,.5*push-.3*bunch],ty:.15*bunch};
     const d=R.L*.26*(Math.floor(2*t)+ease(cl((u-.5)/.5)));st.setDist(d);RIG.pose(R,P);}};}),
 cell('Swim in its pond','hind flippers scull side to side',()=>{const R=mk('pet:seal',{},'spine');const st=stage(R,{zoom:.7,g1:'#4f8fc9',g2:'#457fb6',pitch:.45});const w=prop(st.S,new THREE.PlaneGeometry(R.L*30,R.L*30),'#3b78b8',0,R.H*.62,0);w.rotation.x=-P_/2;w.material.transparent=true;w.material.opacity=.4;st.S.remove(R.shadow);R.shadow=null;
   return {S:st.S,C:st.C,tick:t=>{const P={floor:false,ty:.8*S2(3*t),hy:-.15*S2(3*t),spine:{a:.04,k:.5,ph:TAU*3*t,ax:'z'},root:{y:R.H*.18+R.H*.16*S2(t),rz:.18*C2(t),rx:.12*S2(1.5*t)},wing:[.15,.15],arm:[-.25,-.25]};st.setDist(R.L*1.2*t);RIG.pose(R,P);}};}),
 cell('Ball on its nose','balances, claps with its flippers',()=>{const R=mk('pet:seal',{},'spine');const st=stage(R,{zoom:.8,cy:.75});const br=R.H*.14;const ball=prop(st.S,new THREE.SphereGeometry(br,16,12),'#e8483f',0,0,0);
   return {S:st.S,C:st.C,tick:t=>{const b=Math.pow(Math.max(0,S2(2*t)),2);const clap=Math.max(0,S2(4*t+.25));const P={hp:.55-.1*(1-b),root:{rz:.25,piv:[0,0,0],sq:1-.04*(1-b)},hy:.08*S2(t),wing:[-.9*clap,-.9*clap],arm:[.4*clap,.4*clap]};RIG.pose(R,P);const tp=RIG.headTop(R);ball.position.set(tp.x,tp.y+br*.85+R.H*.25*b,tp.z);}};})]},
monkey:{title:'Monkey (new model): walks on all fours, climbs, jumps',cols:3,cw:300,ch:240,cells:[
 cell('Walk on all fours','legs bend, back sways',walker('pet:monkey',{age:'adult'},'walk',.5,1.1,3,{zoom:.75},(P,t,R)=>{P.flex={zs:0,z:.03*S2(3*t)};P.hy=-.15*S2(3*t);P.ty=.35*S2(3*t+.2);P.root.y=(P.root.y||0)+R.H*.025*Math.abs(S2(6*t));})),
 cell('Climb a trunk','reach, grab, pull up',()=>{const R=mk('pet:monkey',{age:'adult'});const S=scene();S.add(R.root2);MV.ground(S,40);const mh=R.L*.6,rr=mh*.18;prop(S,new THREE.CylinderGeometry(rr,rr*1.15,mh*8,16),'#7a5434',rr,mh*4,0);const C=cam(mh*1.5,mh*1.5,-.35,.1);C.position.x-=mh*.3;C.lookAt(-mh*.3,mh*1.5,0);
   return {S,C,tick:t=>{const ph=2*t;const P={hip:[],knee:[]};R.legs.forEach((l,i)=>{const sd=l.side>0?0:.5;const c=S2(ph+sd);if(l.front){P.hip[i]=1.4+1.0*c;P.knee[i]=-.5-.7*Math.max(0,-c);}else{P.hip[i]=.7-.7*c;P.knee[i]=1.0*Math.max(0,c);}});P.root={rz:P_/2,piv:[0,0,0]};P.hp=.4;P.ty=.4*S2(2*t);P.floor=false;RIG.pose(R,P);const k=4*t,stp=Math.floor(k),fr=k-stp;R.root2.position.set(0,mh*.3+mh*.35*(stp+ease(cl((fr-.35)/.5))),0);}};}),
 cell('Very happy','bouncy hops, tail up',()=>{const R=mk('pet:monkey',{age:'adult'});const st=stage(R,{zoom:.85,cy:.65,yaw:.5});return {S:st.S,C:st.C,tick:t=>{const P={hip:[],knee:[]};let y=0;
   for(const [a,b] of [[.05,.4],[.5,.85]]){const u=cl((t-a)/(b-a));if(u>0&&u<1){y=jumpArc(t,a,b,R.H*.4);R.legs.forEach((l,i)=>{P.hip[i]=(l.front?.8:-.7)*Math.sin(P_*u);P.knee[i]=(l.front?-1.1:1.1)*Math.sin(P_*u);});}
     const cr=bell(t,a-.05,a+.01),ld=bell(t,b-.01,b+.06);if(cr||ld){P.root={sq:1-.15*(cr+ld)};lieP(R,.25*(cr+ld),P);}}
   P.root=Object.assign(P.root||{},{y:y+(P.root&&P.root.y||0)});P.ty=.6+.3*S2(t*4);P.tp=-.6;P.hp=.25;RIG.pose(R,P);}};})]},
bear:{title:'Bear (approved models): bendy walk, sit up, roll',cols:3,cw:300,ch:240,cells:[
 cell('Walk','heavy, rolling, bendy',walker('pet:bear',{v:'teddy',age:'adult'},'walk',.36,.9,2,{zoom:.9},(P,t,R)=>{P.flex={z:.04*S2(2*t)};P.root.rx=(P.root.rx||0)+.06*S2(2*t);P.hy=-.15*S2(2*t+.1);P.hp=(P.hp||0)-.05+.05*S2(4*t);P.root.y=(P.root.y||0)+R.H*.015*Math.abs(S2(4*t));})),
 cell('Sit up','on its bottom, paws dangle',()=>{const R=mk('pet:bear',{v:'teddy',age:'adult'});const st=stage(R,{zoom:1.0,cy:.7});const hl=R.legs.filter(l=>!l.front)[0];const top=hl.top,len=hl.len;
   return {S:st.S,C:st.C,tick:t=>{const k=seg(t,.1,.35)*(1-seg(t,.82,.97));const th=1.2*k;const P={hip:[],knee:[]};R.legs.forEach((l,i)=>{if(l.front){P.hip[i]=(.5-th)*k+.15*S2(t*3)*k;P.knee[i]=-.8*k;}else{P.hip[i]=(1.4-th)*k;P.knee[i]=-.2*k;}});
     P.root={rz:th,piv:[hl.x,top,0],y:-(top-.25*len)*k,rx:.05*S2(t*2)*k};P.hp=-th*.85+.08*S2(t*2)*k;P.hy=.25*S2(t)*k;P.br=.04*S2(2*t)*k;RIG.pose(R,P);}};}),
 cell('Roll on its back','very happy, paws paddle',()=>{const R=mk('pet:bear',{v:'teddy',age:'adult'});const st=stage(R,{zoom:1,cy:.4,yaw:.9});return {S:st.S,C:st.C,tick:t=>{const k=seg(t,.08,.3)*(1-seg(t,.8,.95));const P=RIG.gait(R,{},'trot',3*t,.6*k,.9*k);P.root=rollRoot(R,P_*k*.98+.15*S2(2*t)*k);P.hp=-.75*k;P.hy=.3*k;P.flex={y:-.03*k};P.shadowH=0;RIG.pose(R,P);}};})]},
cows:{title:'Cows',cols:2,cw:320,ch:260,frames:72,cells:[
 cell('Walk','4-beat walk, head nods',()=>{const R=cowFix(mk('farm:cow',{},null,null,{rigid:true}));const st=stage(R,{zoom:.85});const D=RIG.stride(R,.2,4);st.fit(D);R.hoof=true;const tT=cowTail(R);return {S:st.S,C:st.C,tick:t=>{const P={hindBack:true};RIG.gait(R,P,'walk',4*t,.2,.5);P.root={y:R.H*.04*Math.abs(S2(8*t)),rx:.05*S2(4*t)};P.ty=.25*S2(4*t+.15);P.tT=tT;P.hp=-.1+.17*S2(8*t+.1);st.setDist(D*t);RIG.pose(R,P);}};}),
 cell('Stand, chew, look around','chews cud, looks around, flicks ears',()=>{const R=cowFix(mk('farm:cow',{},null,null,{rigid:true}));const st=stage(R,{zoom:.8,yaw:.36});const tT=cowTail(R);
   const ears=R.head.filter(q=>Math.abs((q.bb.min.z+q.bb.max.z)/2)>.22&&q.bb.max.y<1.5*R.H/1.73);const muz=R.head.filter(q=>q.bb.min.x>R.neck.x+.47*(R.B.max.x-R.neck.x)&&q.bb.max.y<R.neck.y+.08*R.H);
   const mb=new THREE.Box3();muz.forEach(q=>mb.union(q.bb));const mpx=mb.min.x,mpy=mb.max.y;
   const rot=(parts,fn)=>{const sv=parts.map(q=>q.rest.slice());parts.forEach(q=>{const r=q.rest;for(let v=0;v<r.length;v+=3){const o=fn(r[v],r[v+1],r[v+2]);r[v]=o[0];r[v+1]=o[1];r[v+2]=o[2];}});return ()=>parts.forEach((q,i)=>q.rest.set(sv[i]));};
   return {S:st.S,C:st.C,tick:t=>{
     const A=seg(t,.06,.24)*(1-seg(t,.4,.56)),B=seg(t,.46,.6)*(1-seg(t,.76,.92));const look=-.6*A-.28*B;const alert=Math.max(A,B);
     const cp=6*t,ch=S2(cp),open=.5-.5*C2(cp);
     const P={hindBack:true,hip:[],knee:[]};P.hp=-.12+.08*A+.1*B-.035*open;P.hy=look+.02*ch;P.tT=tT;
     P.ty=.1*S2(2*t);
     P.br=.025*(.5-.5*C2(2*t));P.root={z:.03*R.W*S2(t),rx:.02*S2(t)};
     const fl=Math.max(bell(t,.3,.36),bell(t,.88,.94));const ea=.3*fl;
     const undo=[];
     undo.push(rot(muz,(x,y,z)=>{const a=.09*ch,c=Math.cos(a),s=Math.sin(a),dx=x-mpx;const x1=mpx+dx*c+z*s,z1=-dx*s+z*c;const p=-.16*open,cq=Math.cos(p),sq=Math.sin(p),ddx=x1-mpx,ddy=y-mpy;return [mpx+ddx*cq-ddy*sq,mpy+ddx*sq+ddy*cq,z1];}));
     ears.forEach(q=>{const zc=(q.bb.min.z+q.bb.max.z)/2,sd=Math.sign(zc),bz=sd*Math.min(Math.abs(q.bb.min.z),Math.abs(q.bb.max.z)),by=(q.bb.min.y+q.bb.max.y)/2;
       undo.push(rot([q],(x,y,z)=>{const a=-sd*ea,c=Math.cos(a),s=Math.sin(a),dy=y-by,dz=z-bz;return [x,by+dy*c-dz*s,bz+dy*s+dz*c];}));});
     RIG.pose(R,P);undo.forEach(f=>f());}};})]},
cowsG:{title:'Cow graze (try)',cols:1,cw:440,ch:320,cells:[
 cell('Graze','head down in the meadow, bites and tears, steps',()=>{const R=cowFix(mk('farm:cow',{},null,null,{rigid:true}));R.neck.x=R.body.bb.max.x-.08*R.L;R.neck.y=R.body.bb.max.y-.12*R.H;const st=stage(R,{zoom:.78,yaw:.4});const tT=cowTail(R);const hx=Math.min(...R.legs.map(l=>l.x));
   const pose=t=>{const P={hip:[],knee:[],hindBack:true};R.legs.forEach((l,i)=>{if(l.front)P.hip[i]=l.side>0?.31:-.21;});P.root={rz:-.05,piv:[hx,0,0]};P.hp=-1.05;P.tT=tT;P.ty=.25*S2(t*3);return P;};
   RIG.pose(R,Object.assign(pose(0),{floor:false}));R.root2.updateMatrixWorld(true);const hb=new THREE.Box3();R.head.forEach(q=>{q.geo.computeBoundingBox();hb.union(q.geo.boundingBox.clone().applyMatrix4(q.mesh.matrixWorld));});
   const tipY=hb.min.y+.05;const fld=new THREE.Group();let s=11;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
   for(let i=0;i<420;i++){const h=tipY*(.72+.38*rnd());const q=new THREE.Mesh(new THREE.ConeGeometry(R.H*.016,h,4),new THREE.MeshLambertMaterial({color:['#5f9e45','#6fae50','#7cbb5b','#8cc466'][i%4]}));q.position.set((rnd()-.5)*R.L*3.2,h/2,(rnd()-.5)*R.L*2.6);q.rotation.z=.18*(rnd()-.5);q.rotation.x=.18*(rnd()-.5);fld.add(q);}st.S.add(fld);
   return {S:st.S,C:st.C,tick:t=>{const step=bell(t,.5,.68);const sd=R.L*.14*seg(t,.5,.68);const P=pose(t);RIG.gait(R,P,'walk',t*2.8,.18*step,.5*step);
     const bt=(6*t)%1,tear=bt>.55&&bt<.8?Math.sin(P_*(bt-.55)/.25):0,push=bt<.55?Math.sin(P_*bt/.55):0,eat=1-step;P.hp+=(-.08*push+.16*tear)*eat;P.hy=(.18*tear*((Math.floor(6*t)%2)?1:-1)+.06*S2(t))*eat;
     RIG.pose(R,P);fld.position.x=-sd;}};})]},
chickens:{title:'Chickens',cols:3,cw:300,ch:250,cells:[
 cell('Walk','head holds still, then jerks forward',()=>{const R=mk('farm:chicken');chickNeck(R);const st=stage(R,{zoom:1});const f=4,D=RIG.stride(R,.5,f);st.fit(D);return {S:st.S,C:st.C,tick:t=>{const P=RIG.gait(R,{},'biped',f*t,.5,1.0);const ph=(2*f*t)%1;const lag=D/(2*f);const k=ph<.7?ph/.7:1-ease((ph-.7)/.3);P.hT=[.7*lag*(.5-k),R.H*.012*(ph<.7?0:Math.sin(P_*(ph-.7)/.3))];P.root=Object.assign(P.root||{},{y:R.H*.03*Math.abs(S2(2*f*t)),rz:-.12+.04*S2(2*f*t),rx:.08*S2(f*t)});P.tp=-.3+.08*S2(2*f*t);P.ty=.28*S2(f*t);P.wing=[-.08,-.08];P.hy=.3*S2(t);st.setDist(D*t);RIG.pose(R,P);}};}),
 cell('Scratch and peck','rakes the ground, steps back, pecks the spot',()=>{const R=mk('farm:chicken');chickNeck(R);const st=stage(R,{zoom:1});const l0=R.legs[0],piv=[l0.x,l0.top,0];const D=R.L*.45;
   const pat=new THREE.Mesh(new THREE.CircleGeometry(R.L*.2,14),new THREE.MeshLambertMaterial({color:'#8a6a45'}));pat.rotation.x=-P_/2;pat.position.y=.002;st.S.add(pat);
   for(let i=0;i<5;i++){const g=new THREE.Mesh(new THREE.SphereGeometry(R.L*.018,5,4),new THREE.MeshLambertMaterial({color:'#f2d27a'}));g.position.set(((i*37)%7/7-.5)*R.L*.25,((i*53)%5/5-.5)*R.L*.25,R.L*.01);pat.add(g);}
   return {S:st.S,C:st.C,tick:t=>{const P={hip:[],knee:[]};let th=-.16,hp=-.45,dist=0;const wg=-.3*seg(t,0,.05)*(1-seg(t,.28,.34));
   if(t<.32){const u=t/.32,i0=u<.5?0:1,ph=(u*2)%1;let hip,kn,dip=0;
     if(ph<.3){const q=ph/.3;hip=.55*ease(q);kn=-.7*Math.sin(P_*q);}else if(ph<.4){hip=.55;kn=0;}else if(ph<.85){const q=seg(ph,.4,.85);hip=.55-1.1*q;kn=0;dip=Math.sin(P_*(ph-.4)/.45);}else{const q=seg(ph,.85,1);hip=-.55*(1-q);kn=-.5*Math.sin(P_*q);}
     P.hip[i0]=hip;P.knee[i0]=kn;P.knee[1-i0]=-.2*dip;th=-.16-.24*dip;hp=-.45-.15*dip;}
   else if(t<.46){const u=(t-.32)/.14;RIG.gait(R,P,'biped',-2*u,.45,.9);dist=-D*ease(u);}
   else if(t<.86){dist=-D;const u=(t-.46)/.4;const x=(u*3.2)%1;const pk=(u<.94&&x<.72)?Math.sin(P_*x/.72):0;th=-.16-.46*pk;hp=-.45-.55*pk;P.hT=[R.L*.04*pk,0];P.ty=.06*S2(t*4);}
   else{const u=(t-.86)/.14;RIG.gait(R,P,'biped',2*u,.45,.9);dist=-D*(1-ease(u));}
   R.legs.forEach((l,i)=>{P.hip[i]=(P.hip[i]||0)-th;});P.wing=[wg,wg];P.root={rz:th,piv};P.hp=hp;P.tp=-.3;st.setDist(dist);pat.position.x=-dist;RIG.pose(R,P);}};}),
 cell('Run and flap','scatters when you run past',()=>{const R=mk('farm:chicken');chickNeck(R);const st=stage(R,{zoom:1});const f=7;const runK=t=>seg(t,.2,.32)*(1-seg(t,.62,.88));
   const N=720,cum=[0];for(let k=1;k<=N;k++)cum[k]=cum[k-1]+runK((k-.5)/N)/N;const D=RIG.stride(R,.65,f)*cum[N];st.fit(D);
   return {S:st.S,C:st.C,tick:t=>{const run=runK(t);const P=RIG.gait(R,{},'biped',f*t,.65*run,1.2*run);const fl=run*Math.abs(Math.sin(TAU*3*t));
     const cr=seg(t,.1,.18)*(1-seg(t,.24,.3));P.wing=[-.3-1.9*fl-.3*cr,-.3-1.9*fl-.3*cr];P.root=Object.assign(P.root||{},{y:(P.root&&P.root.y||0)+R.H*.05*run*Math.abs(S2(2*f*t))-R.H*.14*cr,rz:-.42*run-.3*cr+.05*(1-run)});P.hp=.15*run-.25*cr+.1*(1-run);P.hy=-1.2*bell((t+.1)%1,0,.22);P.tp=-.4*run+.3*cr;
     st.setDist(D*cum[Math.min(N,Math.round(t*N))]/cum[N]);RIG.pose(R,P);}};})]},
pigs:{title:'Pigs',cols:2,cw:320,ch:240,cells:[
 cell('Trot','bouncy, wiggly, snout down',walker('farm:pig',{},'trot',.5,1.0,4,{zoom:.9},(P,t,R)=>{P.hp=-.5+.1*S2(4*t);P.hy=.12*S2(4*t+.15);P.ty=.4*S2(8*t);P.flex={z:.03*S2(4*t),y:.015*S2(8*t)};P.root.y=(P.root.y||0)+R.H*.03*Math.abs(S2(8*t));P.root.rx=(P.root.rx||0)+.05*S2(4*t);})),
 cell('Roll in mud','lies down, rolls full circles, legs kick',()=>{const R=mk('farm:pig');const st=stage(R,{zoom:.95,g1:'#6b4a2f',g2:'#5a3e27',yaw:.9});const cy0=R.bodyC.y,Hh=R.H,Wh=R.W;
   return {S:st.S,C:st.C,tick:t=>{const k=seg(t,.04,.14)*(1-seg(t,.88,.97));const th=k>.99?TAU*2*seg(t,.14,.88):0;const P=RIG.gait(R,{},'trot',6*t,.55*k,.9*k);const c=Math.cos(th),s=Math.sin(th);
     const dlow=cy0*Math.max(c,0)**2+(Hh-cy0)*.85*Math.max(-c,0)**2+(Wh*.5)*s*s;P.root={rx:-th,piv:[0,cy0,0],y:dlow-cy0,sq:1-.05*Math.abs(s)};P.shadowH=0;P.hy=.3*S2(4*t)*k;P.flex={y:-.03*Math.abs(s)*k};RIG.pose(R,P);}};})]},
lab:{title:'Farm dog (St. Bernard): sleeps by a farm building',cols:1,cw:440,ch:300,cells:[cell('Sleeps by a farm building','slow, calm breathing (about 20 a minute)',()=>{const R=mk('farm:lab',{},'none',0);const st=stage(R,{zoom:.65,cy:.4,yaw:.35});st.S.remove(R.shadow);R.shadow=null;const zz=R.parts.slice().sort((a,b)=>b.bb.max.y-a.bb.max.y).filter((q,i,arr)=>q.bb.min.y>arr[0].bb.min.y-.05*R.H);zz.forEach(q=>{q.mesh.material=q.mesh.material.clone();q.mesh.material.transparent=true;});
   return {S:st.S,C:st.C,tick:t=>{const b=.5-.5*Math.cos(TAU*t);RIG.pose(R,{br:.16*b,root:{sq:1+.045*b}});zz.forEach(q=>{q.mesh.position.set(R.L*.03*t,R.H*.15*t,0);q.mesh.material.opacity=t<.8?1:(1-t)/.2;});}};})]},
horse:{title:'Horse: walk, trot, gallop, jump, and with a rider',cols:3,cw:300,ch:250,cells:[
 hcell('Walk','4-beat, hocks point back','walk',.26,.75,2,.012,.02),hcell('Trot','diagonal pairs, springy','trot',.36,.9,3,.05,.03),hcell('Gallop','fast, gathers and stretches','gallop',.45,.75,3,.12,.08),
 cell('Jump','crouch, take off, tuck, land',()=>{const R=mk('farm:horse');const st=stage(R,{zoom:1.0,cy:.45});const C0=st.C.position.clone();const fe=RIG.bake('farm:fence',{},0);st.S.add(fe.root);const fh=fe.H,L=R.L;
   return {S:st.S,C:st.C,tick:t=>{const P={hip:[],knee:[],ank:[]};const a=.34,b=.66;const u=cl((t-a)/(b-a));const air=u>0&&u<1;
     const x=t<a?-1.75*L+(t/a)*.55*L:t<b?-1.2*L+2.4*L*u:1.2*L+((t-b)/(1-b))*.55*L;
     if(!air)horseP(R,P,'gallop',3*t,.5,1.0);const crouch=bell(t,a-.07,a),land=bell(t,b,b+.09);
     if(air){const s=Math.pow(Math.sin(P_*u),.5);R.legs.forEach((l,i)=>{P.hip[i]=l.front?.85*s:-.5*s;P.knee[i]=l.front?-2.0*s:1.6*s;P.ank[i]=l.front?-.6*s:-.5*s;});}
     if(crouch||land)lieP(R,.3*(crouch+land),P);const y=air?4*fh*1.25*u*(1-u):0;
     P.root={x,y:y+(P.root?P.root.y||0:0),rz:air?.16*Math.cos(P_*u):-.1*crouch+.1*land,piv:[0,R.H*.4,0]};P.hp=air?-.25*Math.sin(P_*u):0;P.flex={y:air?-.03*Math.sin(P_*u):0};RIG.pose(R,P);const cx=x;st.C.position.set(C0.x+cx,C0.y,C0.z);st.C.lookAt(cx,R.H*.5,0);}};}),
 rcell('Ride: walk','a rider in the saddle','walk',.26,.75,2,.012,.02,0),rcell('Ride: trot','rider rises with the trot','trot',.36,1.1,3,.05,.03,1),
 cell('Get on','rider climbs into the saddle',()=>{const R=mk('farm:horse');const st=stage(R,{zoom:.95,cy:.55,yaw:.75});const Q=mk('farm:farmer',{who:'a'},'human');const sc=1.45/Q.H;Q.root2.scale.setScalar(sc);R.root.add(Q.root2);const legTop=Q.legs[0].top*sc;const sy=R.body.bb.max.y+.06,sx=-.25;
   return {S:st.S,C:st.C,tick:t=>{const P={};P.ty=.15*S2(t);P.hp=-.05+.04*S2(2*t);RIG.pose(R,P);const k=seg(t,.15,.55);const up=bell(t,.18,.52);
     const ky=seg(t,.15,.33),kz=seg(t,.33,.5);Q.root2.position.set(sx-.05,(sy-legTop+.02)*ky,(R.W*.95)*(1-kz));Q.root2.rotation.x=-.35*bell(t,.25,.5);Q.root2.rotation.y=0;const sit=seg(t,.45,.58);RIG.pose(Q,{floor:false,hip:[1.35*sit+1.5*up*(1-sit),1.35*sit+.5*up*(1-sit)],knee:[-1.45*sit-1.2*up*(1-sit),-1.45*sit],spread:[R.W*.42/sc*sit,R.W*.42/sc*sit],arm:[.7*sit+1.6*up*(1-sit),.7*sit+1.6*up*(1-sit)],root:{rz:-.08*sit}});}};}),
 cell('Stops at the town edge','refuses to go on, tosses its head',()=>{const R=mk('farm:horse');const st=stage(R,{zoom:1.05,yaw:.8});const D=RIG.stride(R,.36,3);
   const posts=[];for(let i=0;i<5;i++){const q=prop(st.S,new THREE.BoxGeometry(.12,1.1,.12),'#c9b38a',0,.55,-1.2+i*.6);posts.push(q);}
   return {S:st.S,C:st.C,tick:t=>{const w=1-seg(t,.3,.42);const P=horseP(R,{},'trot',3*t,.36*w,.9*w);const dist=D*Math.min(t,.36)-D*.14*seg(t,.72,.9);st.setDist(dist);posts.forEach(q=>q.position.x=R.L*.72+D*.36-dist);
     const stop=seg(t,.36,.46);P.root={rz:.3*bell(t,.4,.6),piv:[-.8,0,0],y:R.H*.05*Math.abs(S2(3*t))*w};P.hy=.5*Math.sin(TAU*3*t)*bell(t,.55,.95);P.hp=.35*bell(t,.4,.6)+.3*Math.sin(TAU*3*t+1)*bell(t,.55,.95);P.ty=.6*S2(2*t)*stop;if(t>.72&&t<.9)horseP(R,P,'walk',-3*t,.2,.5);RIG.pose(R,P);}};})]},
};
SETS.capy2={title:'Capybara: one model. Good moods (left) and bad moods (right)',cols:2,cw:520,ch:400,frames:144,cells:[SETS.capy1.cells[0],cell('Mood','what it shows',()=>{
  const FACES={normal:{},sad:{eyes:'sleepy',ear:.6},plead:{eye:1.35,ear:.7},happy:{eyes:'happy',mouth:'open',blush:1}};
  const rigs={};for(const k in FACES){const id='capy:neg_'+k;PU[id]={dflt:{},build(g){g.add(puAge(capyReal2('#b8784a',FACES[k]),'adult').root);}};rigs[k]=mk(id,{});}
  const base=rigs.normal;const st=stage(base,{zoom:.85,cy:.55,yaw:1.0});for(const k in rigs)if(rigs[k]!==base)st.S.add(rigs[k].root2);
  const L=base.L,H=base.H;const man=RIG.bake('farm:farmer',{who:'b'},-P_/2);man.root.scale.setScalar(1.75/man.H);st.S.add(man.root);
  const bowl=prop(st.S,new THREE.CylinderGeometry(H*.22,H*.17,H*.11,20),'#9aa7c7',0,H*.055,0);const ball=prop(st.S,new THREE.SphereGeometry(H*.1,16,12),'#ff8a3d',0,H*.1,0);
  const tear=prop(st.S,new THREE.SphereGeometry(H*.055,12,10),'#5fb8ff',0,0,0);tear.scale.set(.8,1.25,.8);
  const SEQ=[[0,.16,'Sad','head and ears droop, sighs, a tear','sad'],[.16,.34,'Lonely','walks to you, looks up sadly, nudges','sad'],[.34,.5,'Hungry','sits by the empty bowl, sniffs, sighs','sad'],[.5,.64,'Bored','nudges its ball, sighs, flops with chin on it','sad'],[.64,.86,'Very sad (ignored a long time)','lies flat, head on the ground, tears','sad'],[.86,1.01,'Cheers up','you came back: happy again','happy']];
  const cur=t=>SEQ.find(s=>t>=s[0]&&t<s[1])||SEQ[0];
  const eyePt=R=>{R.root2.updateMatrixWorld(true);const bb=new THREE.Box3();R.head.forEach(q=>{q.geo.computeBoundingBox();bb.union(q.geo.boundingBox.clone().applyMatrix4(q.mesh.matrixWorld));});return new THREE.Vector3(bb.max.x-(bb.max.x-bb.min.x)*.3,bb.min.y+(bb.max.y-bb.min.y)*.62,bb.max.z*.75);};
  return {S:st.S,C:st.C,label:t=>cur(t)[2],sub:t=>cur(t)[3],tick:t=>{const s=cur(t),u=(t-s[0])/(s[1]-s[0]);const P={hip:[],knee:[]};P.br=.04*Math.sin(TAU*t*10);let dist=0,showMan=0,showBowl=0,showBall=0,tearOn=0;
    if(s[2]==='Sad'){const d=ease(cl(u/.25));P.hp=-.65*d;P.root={y:-H*.06*d,sq:1-.07*d-.06*bell(u,.45,.75)};P.hy=.12*Math.sin(TAU*u);P.tp=.5*d;tearOn=d;}
    if(s[2]==='Lonely'){showMan=1;P.hy=-.35*seg(u,.45,.6);tearOn=u>.55?1:0;const w=1-seg(u,.45,.55);RIG.gait(base,P,'walk',4*u,.35*w,.8*w);dist=L*.5*cl(u/.5);const up=seg(u,.5,.62);P.hp=.55*up;const nud=u>.65&&u<.95?Math.max(0,Math.sin(TAU*3*(u-.65))):0;P.root={x:L*.08*nud,y:H*.012*Math.abs(Math.sin(TAU*8*u))*w};P.hp+=-.2*nud;}
    if(s[2]==='Hungry'){showBowl=1;const sn=seg(u,.02,.15)*(1-seg(u,.45,.55));P.hp=-.7*sn+(sn>.9?.06*Math.sin(TAU*u*14):0);P.root={x:L*.04*Math.max(0,Math.sin(TAU*3*cl((u-.2)/.25)))*(u>.2&&u<.45?1:0)};tearOn=u>.6?1:0;const sit=seg(u,.5,.62);if(sit){sitP(base,sit,P);P.hp=(P.hp||0)-.1*sit+.25*bell(u,.65,.8);P.root=Object.assign(P.root||{},{sq:1-.05*bell(u,.82,.97)});}}
    if(s[2]==='Bored'){showBall=1;const push=bell(u,.05,.3);P.hp=-.35*push;P.root={x:L*.06*push,sq:1-.06*bell(u,.32,.48)};const flop=seg(u,.45,.6);if(flop){lieP(base,flop,P);P.hp=(P.hp||0)-.3*flop;}}
    if(s[2]==='Very sad (ignored a long time)'){lieP(base,ease(cl(u/.2)),P);P.hp=-.35*ease(cl(u/.2));P.br=.07*Math.sin(TAU*u*3);P.root=Object.assign(P.root||{},{sq:1+.025*Math.sin(TAU*u*3)});tearOn=1;}
    if(s[2]==='Cheers up'){const k=1-ease(cl(u/.4));lieP(base,k,P);P.hp=-.35*k+.2*seg(u,.3,.6);P.root=Object.assign(P.root||{},{y:(P.root&&P.root.y||0)+jumpArc(u,.6,.9,H*.15)});}
    st.setDist(dist);man.root.visible=!!showMan;man.root.position.x=L*.55+.18+L*.5-dist;man.root.position.z=-base.W*1.1;bowl.visible=!!showBowl;bowl.position.x=L*.52+(s[2]==='Hungry'?L*.06*seg(u,.2,.45):0);bowl.rotation.z=s[2]==='Hungry'?.15*Math.sin(TAU*6*u)*bell(u,.2,.45):0;ball.visible=!!showBall;ball.position.x=L*.5+L*.12*seg(u,.1,.35);
    for(const k in rigs){rigs[k].root2.visible=(k===s[4]);RIG.pose(rigs[k],JSON.parse(JSON.stringify(P)));}
    tear.visible=tearOn>.5;if(tear.visible){const e=eyePt(rigs[s[4]]);const ft=(t*4)%1;tear.position.set(e.x,e.y-H*.18*ft,e.z);tear.material.transparent=true;tear.material.opacity=1-ft*.7;}}};})]};
SETS.babies={title:'Farm babies (stay babies, never grow up), each beside its mother',cols:3,cw:320,ch:270,cells:[
 bcell('Foal','frisks: little bucks and bursts','farm:horse',(B,P,t,M,MP)=>{const k=(2*t)%1;const run=k<.55;if(run)horseP(B,P,'gallop',6*t,.45,.9);const buck=bell(k,.6,.85);P.root={rz:-.35*buck,piv:[B.legs.filter(l=>l.front)[0].x,0,0],y:B.H*.08*Math.abs(Math.sin(TAU*6*t))*(run?1:0)};B.legs.forEach((l,i)=>{if(!l.front&&buck){P.hip[i]=(P.hip[i]||0)-.9*buck;P.knee[i]=(P.knee[i]||0)+.4*buck;}});P.ty=.6*Math.sin(TAU*6*t);MP.hp=-.15+.06*Math.sin(TAU*t*2);MP.ty=.3*Math.sin(TAU*t*2);},.6),
 bcell('Lamb','pronks: bounces on four stiff legs','farm:sheep',(B,P,t,M,MP)=>{const k=(3*t)%1;const y=4*B.H*.45*k*(1-k)*(k<.6?1:0)/1;const kk=cl(k/.6);P.root={y:4*B.H*.4*kk*(1-kk)*(k<.6?1:0),rz:.15*Math.sin(TAU*kk)};const ld=bell(k,.6,.72);if(ld){P.root.sq=1-.12*ld;lieP(B,.2*ld,P);}P.ty=.5*Math.sin(TAU*9*t);MP.hp=-.6+.05*Math.sin(TAU*t*8);},.5),
 bcell('Calf','clumsy skip, tail up','farm:cow',(B,P,t,M,MP)=>{RIG.gait(B,P,'trot',4*t+.08*Math.sin(TAU*2*t),.5,1.15);P.root={y:B.H*.14*Math.max(0,Math.sin(TAU*4*t)),rx:.1*Math.sin(TAU*2*t),rz:.12*Math.sin(TAU*4*t)};P.tp=-.7;P.ty=.3*Math.sin(TAU*8*t);P.hp=.1*Math.sin(TAU*4*t);MP.hp=-.7;MP.ty=.4*Math.sin(TAU*t*3);},.5),
 bcell('Piglet','zoomies around mum, tail wiggles','farm:pig',(B,P,t,M,MP)=>{RIG.gait(B,P,'trot',8*t,.55,1.1);P.root={y:B.H*.05*Math.abs(Math.sin(TAU*8*t))};P.ty=.6*Math.sin(TAU*16*t);P.hy=.15*Math.sin(TAU*4*t);MP.hp=-.4;},null,(B,t,M)=>{const a=TAU*t;B.root2.position.set(Math.cos(a)*M.L*.85,0,Math.sin(a)*M.W*1.3);B.root2.rotation.y=-a-P_/2;}),
 cell('Chicks','a flock playing catch around the hen',()=>{const M=mk('farm:chicken',Object.assign({},PU['farm:chicken'].dflt,{age:'adult'}));const st=stage(M,{zoom:1.45,cy:.35,yaw:.6,pitch:.5});const N=5,Cs=[];for(let i=0;i<N;i++){const B=mk('farm:chicken',Object.assign({},PU['farm:chicken'].dflt,{age:'baby'}));st.S.add(B.root2);RIG.addShadow(B,st.S);Cs.push(B);}
   return {S:st.S,C:st.C,tick:t=>{const MP={};MP.hp=.1*S2(4*t);RIG.pose(M,MP);Cs.forEach((B,i)=>{const sp=1+.25*Math.sin(TAU*(t+i*.21));const a=TAU*(t*2*sp*.5+t)+i*.55+.25*Math.sin(TAU*3*t+i);const r=M.L*(1.05+.4*Math.sin(TAU*(2*t+i*.3)))+(i===0?M.L*.15*Math.sin(TAU*6*t):0);const x=Math.cos(a)*r,z=Math.sin(a)*r*.8;B.root2.position.set(x,0,z);B.root2.rotation.y=-a-P_/2;const P=RIG.gait(B,{},'biped',14*t+i*.3,.6,1.1);const hop=Math.abs(S2(7*t+i*.2));P.root={y:B.H*.12*hop,rz:-.15};P.hp=.1*S2(14*t);RIG.pose(B,P);});}};})]};

/* ===== NEXT sets (31 Oct): sick pets, nap + friends, riders + instructor, vet visit ===== */
function petMk(id){if(id==='age:capybara')return mk(id,{v:'real',age:'adult'});if(id==='pet:bear')return mk(id,{v:'teddy',age:'adult'});if(id==='pet:seal'||id==='pet:snake')return mk(id,{},'spine');return mk(id,{age:'adult'});}
function cumOf(fn,N){const c=[0];for(let k=1;k<=N;k++)c[k]=c[k-1]+fn((k-.5)/N)/N;return t=>c[Math.min(N,Math.max(0,Math.round(t*N)))]/c[N];}
function sneezeP(R,P,t,a,amp,headOnly){amp=amp||1;const pre=bell(t,a,a+.05),snap=bell(t,a+.05,a+.09);if(headOnly){P.hy=(P.hy||0)+.85*snap*amp-.3*pre*amp;return snap;}P.hp=(P.hp||0)+(.3*pre-.12*snap)*amp;P.hy=(P.hy||0)-.25*(pre+snap)*amp;P.root=P.root||{};P.root.sq=(P.root.sq||1)*(1-.12*snap*amp);P.root.x=(P.root.x||0)-R.L*.07*snap*amp;P.root.rz=(P.root.rz||0)+.05*pre*amp;return snap;}
function propB(id,o,face){return RIG.bake(id,o||PU[id].dflt||{},face);}
function personMk(id,o){return mk(id,o,'human');}
function armLen(A){if(A.len==null){let mn=1e9;A.parts.forEach(q=>mn=Math.min(mn,q.bb.min.y));A.len=A.top-mn;}return A.len;}
function handW(R,i,a,w){const A=R.arms[i],l=armLen(A);let x=A.x+Math.sin(a)*l*.97,y=A.top-Math.cos(a)*l*.97,z=A.z;
  if(w){const s=Math.sign(A.z)||1,c=Math.cos(w*s),sn=Math.sin(w*s),pz=A.wz!=null?A.wz:A.z*.4,dy=y-A.top,dz=z-pz;y=A.top+dy*c-dz*sn;z=pz+dy*sn+dz*c;}
  R.root2.updateMatrixWorld(true);return R.root.localToWorld(new THREE.Vector3(x,y,z));}
function solveArm(R,i,T,wMax){let best=1e9,ba=0,bw=0;for(let a=0;a<=3.0;a+=.04)for(let w=-(wMax||.7);w<=(wMax||.7)+1e-6;w+=.05){const d=handW(R,i,a,w).distanceTo(T);if(d<best){best=d;ba=a;bw=w;}}return [ba,bw,best];}
function placeReach(F,i,T,poseFn,x0,xLim){let x=x0,sol=[0,0,9];for(let it=0;it<5;it++){F.root2.position.x=x;poseFn();const h0=handW(F,i,0,0);F.root2.position.z+=T.z-h0.z;poseFn();sol=solveArm(F,i,T,.25);const h=handW(F,i,sol[0],sol[1]);x+=T.x-h.x;if(xLim)x=xLim(x);}F.root2.position.x=x;poseFn();sol=solveArm(F,i,T,.25);return sol;}
function crouchP(R,k,P,lean){P=P||{};const a=.85*k,top=R.legs[0].top,ln=(lean||0)*k;P.hip=[a+ln,a+ln];P.knee=[-2*a,-2*a];P.ank=[a,a];P.root=Object.assign(P.root||{},{y:-top*(1-Math.cos(a))*.9,rz:-ln,piv:[0,top,0]});return P;}
function headBoxL(R){const bb=new THREE.Box3(),v=new THREE.Vector3();R.head.forEach(q=>{const a=q.geo.attributes.position.array;for(let k=0;k<a.length;k+=3)bb.expandByPoint(v.set(a[k],a[k+1],a[k+2]));});return bb;}
function mouthW(R,up){const b=headBoxL(R),sx=b.max.x-b.min.x,sy=b.max.y-b.min.y;R.root2.updateMatrixWorld(true);return R.root.localToWorld(new THREE.Vector3(b.max.x-.12*sx,b.min.y+(up??.3)*sy,(b.min.z+b.max.z)/2));}
function headTopW(R){const b=headBoxL(R);R.root2.updateMatrixWorld(true);return R.root.localToWorld(new THREE.Vector3((b.min.x+b.max.x)/2,b.max.y,(b.min.z+b.max.z)/2));}
function fixShadow(R){if(!R.shadow)return;R.root2.updateMatrixWorld(true);const bb=new THREE.Box3(),v=new THREE.Vector3();R.parts.filter(q=>q.role[0]==='leg').forEach(q=>{const a=q.geo.attributes.position.array;const M=q.mesh.matrixWorld;for(let k=0;k<a.length;k+=9)bb.expandByPoint(v.set(a[k],a[k+1],a[k+2]).applyMatrix4(M));});if(bb.isEmpty())return;R.shadow.position.x=(bb.min.x+bb.max.x)/2;R.shadow.position.z=(bb.min.z+bb.max.z)/2;R.shadow.scale.set(R.L*.5,R.W*.45,1);R.shadow.material.opacity=.3;}
function dbg(...a){(window.__dbg=window.__dbg||[]).push(a.map(x=>typeof x==='number'?x.toFixed(3):String(x)).join(' '));}
function headBackTopW(R){const b=headBoxL(R),sx=b.max.x-b.min.x;R.root2.updateMatrixWorld(true);return R.root.localToWorld(new THREE.Vector3(b.min.x+.32*sx,b.max.y+.01,(b.min.z+b.max.z)/2));}
function floorShadow(S,x,z,rx,rz){const m=new THREE.Mesh(new THREE.CircleGeometry(1,28),new THREE.MeshBasicMaterial({color:'#000',transparent:true,opacity:.22,depthWrite:false}));m.rotation.x=-Math.PI/2;m.scale.set(rx,rz,1);m.position.set(x,.003,z);S.add(m);return m;}
function zzz(S,x,y,z,s){const Z=propB('fx:zzz',{},0);Z.root.scale.setScalar(s/Math.max(Z.H,.01));Z.root.position.set(x,y,z);S.add(Z.root);Z.parts.forEach(q=>{q.mesh.material=q.mesh.material.clone();q.mesh.material.transparent=true;});
  return (t,on)=>{Z.root.visible=on!==false;const u=(t*2)%1;Z.root.position.y=y+s*.6*u;Z.parts.forEach(q=>q.mesh.material.opacity=u<.7?1:(1-u)/.3);};}

/* ---- sick pets: one shared sick set for every pet type ---- */
function birdLie(R,k,P){P.hip=P.hip||[];P.knee=P.knee||[];R.legs.forEach((l,i)=>{P.hip[i]=(P.hip[i]||0)-1.45*k;P.knee[i]=0;});P.root=P.root||{};P.root.y=(P.root.y||0)-legAvg(R)*.92*k;return P;}
function sickCell(id,name){return cell(name,'',()=>{const R=petMk(id);const snake=id==='pet:snake',seal=id==='pet:seal';
  const st=snake?stage(R,{zoom:.6,cy:.3,pitch:.75,yaw:.3}):stage(R,{zoom:R.L>1.3?.62:.9,yaw:.55,cy:.45});if(snake){st.S.remove(R.shadow);R.shadow=null;}const H=R.H,L=R.L;const sp=spec(R,id);
  const wk0=t=>seg(t,0,.06)*(1-seg(t,.3,.36));const wk=snake?(t=>.35+.65*wk0(t)):wk0;const fr=2.5;const cum=cumOf(wk,720);let Wi=0;for(let k=0;k<720;k++)Wi+=wk((k+.5)/720)/720;const D=(snake||seal)?L*.35:RIG.stride(R,sp.A*.5,fr)*Wi;st.fit(D);
  return {S:st.S,C:st.C,tick:t=>{const w=wk(t);let P={};const lie=seg(t,.5,.62)*(1-seg(t,.88,.98));
    if(snake){P.spine={a:.07*w+.02*lie,k:1.4,ph:TAU*(1.2*t+.5*lie*t),ax:'z'};P.hp=-.1;}
    else if(seal){const u=(fr*t)%1;const bunch=w*Math.sin(P_*cl(u/.5)),push=w*Math.sin(P_*cl((u-.5)/.5));const F=-.07*bunch;P.flex={y:F};P.root={y:-F*L*.95,rz:.06*push,sx:1-.1*bunch+.04*push};P.hp=-.3-.25*lie;P.wing=[.3*lie,.3*lie];P.arm=[-.25*lie,-.25*lie];P.br=.07*lie*S2(3*t);}
    else{P=walkP(R,sp,fr*t,{},.5*w);const owl=id==='age:owl',monkey=id==='pet:monkey';P.hp=(P.hp||0)+(owl?-.1:-.6+.25*lie);P.tp=(P.tp||0)+1.6;P.root=P.root||{};P.root.y=(P.root.y||0)-H*.025;
      if(!owl)P.hT=[L*.02,-H*.045];P.root.rz=(P.root.rz||0)-.07;P.root.piv=[R.legs.length?Math.min(...R.legs.map(l=>l.x)):0,0,0];
      if(lie){if(R.biped){birdLie(R,lie,P);P.root.sq=1-.1*lie;P.br=(P.br||0)+.06*lie;if(!owl)P.hT=[L*.02,-H*.08];}else if(monkey){P.root.rz=(P.root.rz||0)*(1-lie);P.hT=[L*.02*(1-lie),-H*.045*(1-lie)];P.hp=(P.hp||0)*(1-lie)+.1*lie;P.hip=P.hip||[];P.knee=P.knee||[];R.legs.forEach((l,i)=>{P.hip[i]=(P.hip[i]||0)*(1-lie)+(l.front?1.6:1.5)*lie;P.knee[i]=(P.knee[i]||0)*(1-lie)-2.4*lie;});P.root.y=(P.root.y||0)-legAvg(R)*lie;P.tp=(P.tp||0)*(1-lie)-.4*lie;}else{lieP(R,lie,P);R.legs.forEach((l,i)=>{if(l.front)P.hip[i]-=.35*lie;});}}
      P.br=(P.br||0)+.06*lie*S2(3*t);}
    sneezeP(R,P,t,.38,1,snake);
    st.setDist(D*cum(t));RIG.pose(R,P);}};});}
function sneezeWarn(){return cell('Warning sneeze','healthy, sneezes first',()=>{const R=petMk('age:dog');const st=stage(R,{zoom:.9,yaw:.55,cy:.45});
  return {S:st.S,C:st.C,tick:t=>{const P={};wag(P,t,6,.35);P.hp=.05*S2(t);sneezeP(R,P,t,.34,1.3);const sh=seg(t,.44,.46)*(1-seg(t,.56,.62));P.hy=(P.hy||0)+.55*sh*S2(t*14);RIG.pose(R,P);}};});}
function friendView(){return cell('A friend sees','simple copy: legs, tail down',()=>{const R=petMk('age:dog');const st=stage(R,{zoom:.9,yaw:-.6,cy:.45});const sp=spec(R,'age:dog');const f=2,D=RIG.stride(R,sp.A*.5,f);st.fit(D);
  return {S:st.S,C:st.C,tick:t=>{const P=RIG.gait(R,{},sp.g,f*t,sp.A*.5,sp.B*.5);P.tp=1.6;P.ty=.08*S2(f*t);st.setDist(D*t);RIG.pose(R,P);}};});}
SETS.sick={title:'Sick pet: droops, walks slowly, lies down, sneezes',cols:4,cw:230,ch:190,cells:[
  ...[['age:dog','Dog'],['age:pomchi','Pomchi'],['age:pug','Pug'],['age:sausage','Sausage dog'],['age:cat','Cat'],['age:bunny','Bunny'],['age:hamster','Hamster'],['age:capybara','Capybara'],
     ['age:duck','Duck'],['age:owl','Owl'],['pet:bear','Bear'],['pet:monkey','Monkey'],['pet:seal','Seal'],['pet:snake','Snake']].map(([id,n])=>sickCell(id,n)),sneezeWarn()]};

/* ---- nap near you; friends pet and play with your pet ---- */
function napCell(){return cell('Naps near you','you sleep, your pet comes and naps',()=>{const R=petMk('age:dog');const st=stage(R,{zoom:2.2,yaw:.6,cy:.3,pitch:.55});const S=st.S,L=R.L;
  const Y=personMk('farm:farmer',{who:'a'});S.add(Y.root2);Y.root2.rotation.z=P_/2;const pz=-L*1.55;Y.root2.position.set(Y.H*.5,-Y.B.min.x+.03,pz);RIG.pose(Y,{floor:false});
  Y.root2.updateMatrixWorld(true);const yb=new THREE.Box3().setFromObject(Y.root2);const bc=yb.getCenter(new THREE.Vector3());
  prop(S,new THREE.BoxGeometry(yb.max.x-yb.min.x+.3,.03,yb.max.z-yb.min.z+.3),'#e88aa8',bc.x,.015,bc.z);dbg('nap person box',yb.min.x,yb.max.x,yb.min.z,yb.max.z);
  const z1=zzz(S,yb.min.x+.15,.75,pz,.6),z2=zzz(S,L*.35,.62,.45,.45);const sp=spec(R,'age:dog');const D0=L*2.8;
  return {S,C:st.C,tick:t=>{const k=seg(t,0,.34);const turn=seg(t,.36,.5);R.root2.position.set(-D0*(1-k)+L*.15*Math.sin(P_*turn),0,.1+L*.25*Math.sin(P_*turn));R.root2.rotation.y=TAU*turn;
    const P=t<.5?walkP(R,sp,3.5*t,{},1):{};const lie=seg(t,.5,.62);if(lie){lieP(R,lie,P);P.hp=(P.hp||0)-.3*lie;P.hy=.2*lie;P.tp=1.1*lie;P.ty=.6*lie;P.br=lie>.95?.06*S2(t*3):0;}
    RIG.pose(R,P);RIG.pose(Y,{br:.03*S2(t*2),floor:false});z1(t);z2(t,t>.66);}};});}
function petByFriend(simple){return cell(simple?'What the friend sees':'A friend pets your pet',simple?'simple copy: tail and legs only':'leans in, wags, happy hop',()=>{const R=petMk('age:dog');const st=stage(R,{zoom:2.25,yaw:-.12,cy:.42,pitch:.25});const S=st.S,L=R.L;
  const F=personMk('farm:farmer',{who:'b'});S.add(F.root2);RIG.addShadow(F,S);F.root2.rotation.y=P_;
  RIG.pose(R,simple?{}:{hp:.25,root:{x:L*.05,rz:.05}});const T=headBackTopW(R);T.y+=.04;const sol=placeReach(F,1,T,()=>RIG.pose(F,crouchP(F,1,{},.35)),L*.5+.55);dbg('pet solve',F.root2.position.x,F.root2.position.z,sol[0],sol[1],sol[2]);
  return {S,C:st.C,tick:t=>{const ck=seg(t,.1,.24)*(1-seg(t,.84,.96));const stroke=t>.3&&t<.74?S2((t-.3)*7):0;const FP=crouchP(F,ck,{},.35);FP.arm=[.1*ck,(sol[0]+.1*stroke)*ck];FP.wing=[0,sol[1]*ck];FP.hp=.12*ck;RIG.pose(F,FP);fixShadow(F);
    const P={};wag(P,t,simple?6:11,simple?.5:.8*(.4+ck));if(!simple){const lean=bell(t,.26,.8);P.hp=.25*lean+.05*stroke;P.root={x:L*.05*lean,rz:.05*lean};const u=cl((t-.82)/.1);if(u>0&&u<1){P.root={y:jumpArc(t,.82,.92,R.H*.28)};P.hip=[];P.knee=[];R.legs.forEach((l,i)=>{P.hip[i]=(l.front?.6:-.6)*Math.sin(P_*u);P.knee[i]=(l.front?-1:1)*Math.sin(P_*u);});}}
    else{P.hip=[];P.knee=[];R.legs.forEach((l,i)=>{const s=Math.max(0,S2(3*t+i*.25));P.hip[i]=.25*s;P.knee[i]=(l.front?-1:1)*.45*s;});}
    RIG.pose(R,P);}};});}
function playByFriend(){return cell('A friend plays with your pet','throws the ball, your pet catches it',()=>{const R=petMk('age:dog');const st=stage(R,{zoom:2.7,yaw:-.12,cy:.45,pitch:.25});const S=st.S,L=R.L,H=R.H;
  const F=personMk('farm:farmer',{who:'b'});S.add(F.root2);RIG.addShadow(F,S);const fx=L*.5+1.45;F.root2.position.set(fx,0,0);F.root2.rotation.y=P_;const br=.1;const ball=prop(S,new THREE.SphereGeometry(br,16,12),'#e8483f',0,0,0);
  RIG.pose(F,crouchP(F,1,{},.4));const g0=new THREE.Vector3(fx-.45,br,handW(F,1,0,0).z);const pk=solveArm(F,1,new THREE.Vector3(g0.x,br*1.3,g0.z),.25);dbg('pick',pk[2]);
  return {S,C:st.C,tick:t=>{const wind=bell(t,.02,.16),thr=seg(t,.14,.2)*(1-seg(t,.3,.4));const pick=bell(t,.8,.97);const FP=crouchP(F,pick,{},.4);FP.hp=.15*pick;FP.arm=[0,-.9*wind+2.0*thr+pk[0]*pick];FP.wing=[0,pk[1]*pick];RIG.pose(F,FP);fixShadow(F);
    const P={};const bow=bell(t,0,.24);if(bow){P.hip=[];P.knee=[];R.legs.forEach((l,i)=>{if(l.front){P.hip[i]=1.45*bow;P.knee[i]=-.7*bow;}});P.root={rz:-.48*bow,piv:[Math.min(...R.legs.map(l=>l.x)),0,0],y:-H*.1*bow};P.hp=.55*bow;}
    const ja=.3,jb=.52,y=jumpArc(t,ja,jb,H*.55),u=cl((t-ja)/(jb-ja));if(u>0&&u<1){P.root={y,rz:.3*Math.cos(P_*u)};P.hip=[];P.knee=[];R.legs.forEach((l,i)=>{P.hip[i]=(l.front?.7:-.6)*Math.sin(P_*u);P.knee[i]=(l.front?-1:1)*.9*Math.sin(P_*u);});P.hp=.3*Math.sin(P_*u);}
    const hop=bell(t,.55,.63)+bell(t,.65,.73);if(hop){P.root={y:H*.2*hop};P.hp=.15*hop;}wag(P,t,12,.8);RIG.pose(R,P);
    const mouth=mouthW(R,.2);const hand=handW(F,1,FP.arm[1],FP.wing[1]);const rel=handW(F,1,2.0,0);
    if(t<.2)ball.position.copy(hand);else if(t<.41){const v=cl((t-.2)/.21);ball.position.set(rel.x+(mouth.x-rel.x)*v,rel.y+(mouth.y-rel.y)*v+H*1.3*v*(1-v)*2,rel.z+(mouth.z-rel.z)*v);}
    else if(t<.76)ball.position.copy(mouth);else if(t<.86){const v=seg(t,.76,.86);ball.position.set(mouth.x+(g0.x-mouth.x)*v,Math.max(br,mouth.y+(br-mouth.y)*v+H*.25*Math.sin(P_*Math.min(1,v*2))),mouth.z+(g0.z-mouth.z)*v);}
    else if(t<.89)ball.position.copy(g0);else{const w=seg(t,.89,.97);ball.position.copy(g0).lerp(hand,w);}}};});}
SETS.friends={title:'Nap near you · friends pet and play',cols:3,cw:340,ch:260,frames:48,cells:[napCell(),petByFriend(false),playByFriend()]};

/* ---- riders on the trail, riding instructor at the jump field ---- */
function riderMk(id,v){const L=id==='farm:cowboy'?COWBOYS:COWGIRLS;const D=(L.find(c=>c[0]===v)||L[0])[2];const R=mk(id,{v});const n=RIG.bake('farm:horse',{c:D.horse,age:'adult',rider:'no'}).parts.length;
  const rp=R.parts.slice(n);rp.forEach(q=>{q.role=['rest',0];const i=R.head.indexOf(q);if(i>=0)R.head.splice(i,1);});R.legs.forEach(l=>{l.parts=l.parts.filter(q=>!rp.includes(q));});R.rider=rp;return R;}
function trailCell(id,v,name,sub,g,A,B,f,bob,pitch){return cell(name,sub,()=>{const R=riderMk(id,v);const st=stage(R,{zoom:.82,cy:.5,g1:'#c9a77a',g2:'#b8956a',tile:R.L*1.2});const D=RIG.stride(R,A,f);st.fit(D);const fb=g==='gallop'?1:2;
  return {S:st.S,C:st.C,tick:t=>{const P=horseP(R,{},g,f*t,A,B);P.root={y:R.H*bob*Math.abs(S2(f*t*fb)),rz:pitch*S2(f*t)};P.hp=-.06+.08*S2(f*t*fb+.25);P.ty=.15*S2(f*t);st.setDist(D*t);RIG.pose(R,P);
    const sw=.012*R.H*S2(f*t*fb+.3);R.rider.forEach(q=>{const a=q.geo.attributes.position.array;for(let k=1;k<a.length;k+=3)a[k]+=sw;q.geo.attributes.position.needsUpdate=true;});}};});}
function coachCell(v,name,slow){return cell(name,'stands, points, whistles, cheers',()=>{const R=personMk('farm:coach',{v});const st=stage(R,{zoom:1.3,cy:.5,yaw:.45});const S=st.S;
  for(const [x,z] of [[3.6,.9],[1.6,-3.8]]){const fe=propB('farm:fence');fe.root.position.set(x,0,z);S.add(fe.root);}
  const ext=i=>{let mx=-1e9;R.arms[i].parts.forEach(q=>mx=Math.max(mx,q.bb.max.x));return mx;};const held=ext(0)>ext(1)+.05?0:(ext(1)>ext(0)+.05?1:-1);const pa=held===1?0:1,oa=1-pa;const k=slow?.8:1;
  RIG.pose(R,{});const M=mouthW(R,.18);M.x+=.32;const ws=solveArm(R,pa,M,.6);dbg('coach '+v,pa,ws[0],ws[1],ws[2]);
  const arcs=[];for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.TorusGeometry(.16+.11*i,.04,6,18,1.5),new THREE.MeshBasicMaterial({color:'#ffd23a',transparent:true}));m.rotation.set(0,P_/2,-.75);S.add(m);arcs.push(m);}
  return {S,C:st.C,tick:t=>{const P={arm:[0,0],wing:[0,0]};const pt=seg(t,.1,.2)*(1-seg(t,.36,.44));const wh=seg(t,.46,.52)*(1-seg(t,.64,.68));const ch=seg(t,.7,.76)*(1-seg(t,.92,.98));
    P.arm[pa]=1.75*pt+ws[0]*wh;P.wing[pa]=ws[1]*wh;P.root={ry:-.25*pt};P.hy=-.2*pt;P.hp=.1*pt+.1*wh;
    const pump=Math.max(0,S2((t-.7)*6));const up=ch*(2.7+.2*pump);P.arm[pa]+=up;P.wing[pa]+=.8*ch;if(held<0){P.arm[oa]+=ch*(2.7+.2*(1-pump));P.wing[oa]+=.8*ch;}else{P.arm[oa]+=.3*ch;}
    P.root.y=R.H*.15*ch*Math.abs(S2((t-.7)*6))*k;P.root.ry=(P.root.ry||0)-.9*ch;P.hy+=.3*S2(t)*(1-pt)*(1-ch)*(1-wh);P.br=.02*S2(2*t);RIG.pose(R,P);
    const mo=mouthW(R,.18);arcs.forEach((m,i)=>{const on=wh>.6?Math.max(0,S2((t-.5)*7-i*.18)):0;m.visible=on>.05;m.material.opacity=Math.min(1,on*1.5);m.position.set(mo.x+.32+.09*i,mo.y,mo.z);});}};});}
SETS.riders={title:'Riders on the trail · riding instructor at the jump field',cols:3,cw:300,ch:250,frames:48,cells:[
  trailCell('farm:cowboy','cody','Cody rides the trail','walk','walk',.26,.75,4,.012,.02),
  trailCell('farm:cowboy','hank','Hank jogs the trail','slow jog','trot',.26,.6,4,.014,.012),
  trailCell('farm:cowgirl','rose','Rose lopes the trail','slow canter','gallop',.45,.75,6,.035,.05),
  coachCell('ieva','Coach Ieva',false),coachCell('stan','Coach Stan',true)]};

/* ---- vet visit: exam, scale, treat, lobby ---- */
function freeArm(V){const ext=i=>{let mx=-1e9;V.arms[i].parts.forEach(q=>mx=Math.max(mx,q.bb.max.x));return mx;};return ext(0)>ext(1)+.05?1:0;}
function vetCell(kind){const T={exam:['Exam table','listens, checks ears; pet a bit nervous, licks'],scale:['Scale','pet steps on, sits, the vet notes it'],treat:['Nurse gives a treat','pet eats it, happy again'],lobby:['Lobby desk','the nurse greets and books a time']}[kind];
 return cell(T[0],T[1],()=>{const who=kind==='exam'||kind==='scale'?'mila':'leo';const V=personMk('vet:vet',{v:who});
  const st=stage(V,{zoom:{exam:.95,scale:1.15,treat:.95,lobby:.8}[kind],cy:{exam:.5,scale:.4,treat:.4,lobby:.62}[kind],yaw:{exam:.3,scale:.95,treat:0,lobby:1.25}[kind],pitch:kind==='exam'?.3:.22,g1:'#e9e4f2',g2:'#ddd6ea',tile:2});const S=st.S;
  const free=freeArm(V);let R=null,tick;
  if(who==='leo'){const o=V.arms[1-free],f=V.arms[free];let fm=1e9;f.parts.forEach(q=>fm=Math.min(fm,q.bb.min.y));o.parts.forEach(q=>{if(q.bb.min.y<fm-.01)q.mesh.visible=false;});}
  if(kind!=='lobby'){R=petMk('age:dog');S.add(R.root2);RIG.addShadow(R,S);}
  if(kind==='exam'){const tb=propB('vet:table');tb.root.rotation.y=-P_/2;S.add(tb.root);floorShadow(S,-.27,.04,1.05,.55);const ty=.98;R.root2.position.set(-.27,ty,.04);R.root2.rotation.y=P_;V.root2.rotation.y=-P_/2;V.root2.position.set(0,0,-.72);
    RIG.pose(R,{});R.root2.updateMatrixWorld(true);const db=new THREE.Box3().setFromObject(R.root2);const bodyB=(()=>{const bb=new THREE.Box3(),v=new THREE.Vector3();const a=R.body.geo.attributes.position.array;for(let k=0;k<a.length;k+=3)bb.expandByPoint(v.set(a[k],a[k+1],a[k+2]).applyMatrix4(R.body.mesh.matrixWorld));return bb;})();
    const chest=new THREE.Vector3(bodyB.min.x+.16,bodyB.max.y+.03,(bodyB.min.z+bodyB.max.z)/2-.06);
    RIG.pose(R,{hy:-.4,hp:.15});const ht=headTopW(R);const earT=new THREE.Vector3(chest.x-.06,ht.y+.03,ht.z-.03);
    const poseV=()=>RIG.pose(V,crouchP(V,.1,{},.4));for(let it=0;it<4;it++){poseV();const h0=handW(V,free,0,0);V.root2.position.x+=chest.x-h0.x;}poseV();const sc=solveArm(V,free,chest,.3),se=solveArm(V,free,earT,.5);dbg('exam chest',sc[2],'ear',se[2],'vetx',V.root2.position.x);
    tick=t=>{const lean=seg(t,.06,.18)*(1-seg(t,.86,.96));const ear=seg(t,.46,.54)*(1-seg(t,.76,.84));const VP=crouchP(V,.1*lean,{},.4);VP.arm=[0,0];VP.wing=[0,0];
      VP.arm[free]=(sc[0]*(1-ear)+se[0]*ear)*lean;VP.wing[free]=(sc[1]*(1-ear)+se[1]*ear)*lean;VP.hp=-.05*lean;RIG.pose(V,VP);fixShadow(V);
      const P={};const nerv=1-seg(t,.4,.5);P.br=.03*S2(t*16)*nerv;P.root={x:.012*S2(t*16)*nerv};P.hy=.06*S2(t*8)*nerv-.4*ear;P.tp=.8*nerv;const lick=t>.58&&t<.76?Math.max(0,S2((t-.58)*12)):0;P.hp=-.2*nerv+.15*ear+.14*lick;const wig=bell(t,.84,.97);P.root.ry=.15*S2(t*10)*wig;wag(P,t,8,.35*(1-nerv));RIG.pose(R,P);};}
  else if(kind==='scale'){const sc=propB('vet:scale');S.add(sc.root);const ty=.12;V.root2.position.set(-1.0,0,.35);V.root2.rotation.y=0;const sp=spec(R,'age:dog');
    tick=t=>{const kin=seg(t,0,.3),kout=seg(t,.8,.97);const z=-3.6*(1-kin)+.12+4.4*kout;const on=seg(t,.24,.3)*(1-seg(t,.8,.84));R.root2.position.set(.1,ty*on,z);R.root2.rotation.y=-P_/2;
      let P=(t<.3||t>.8)?walkP(R,sp,4*t,{},1):{};const sit=seg(t,.36,.46)*(1-seg(t,.74,.8));if(sit)sitP(R,sit,P);P.hy=(P.hy||0)+.15*S2(t*6)*sit;wag(P,t,6,.25);RIG.pose(R,P);
      const VP={arm:[0,0]};VP.arm[1-free]=.6+.08*Math.max(0,S2(t*8))*sit;VP.hp=-.45*sit;VP.hy=-.2*sit;const nod=sit>.9?.1*Math.max(0,S2(t*4)):0;VP.hp-=nod;RIG.pose(V,VP);};}
  else if(kind==='treat'){const tr=propB('vet:treat');tr.root.scale.setScalar(2.4);S.add(tr.root);V.root2.position.set(-1.0,0,0);V.root2.rotation.y=0;R.root2.position.set(0,0,0);R.root2.rotation.y=P_;
    const lieH=(h)=>{const P={};lieP(R,1,P);P.hp=(P.hp||0)+h;return P;};RIG.pose(R,lieH(.35));const M=mouthW(R,.3);M.x-=.08;const so=placeReach(V,free,M,()=>RIG.pose(V,crouchP(V,1,{},.3)),-1.0);dbg('treat',so[2]);
    tick=t=>{const ck=seg(t,.1,.22)*(1-seg(t,.5,.6));const VP=crouchP(V,ck,{},.3);VP.arm=[0,0];VP.wing=[0,0];VP.arm[free]=so[0]*ck;VP.wing[free]=so[1]*ck;VP.hp=-.1*ck;RIG.pose(V,VP);fixShadow(V);
      const happy=seg(t,.5,.58);const sick=1-happy;let P={};const lie=1-seg(t,.5,.58);lieP(R,lie,P);const sniff=seg(t,.22,.3);P.hp=(P.hp||0)-.45*sick*(1-sniff)+.35*sniff*sick;P.tp=(P.tp||0)+1.4*sick;
      const eat=t>.38&&t<.5?Math.max(0,S2((t-.38)*25)):0;P.hp+=.12*eat;
      const hops=[[.62,.72],[.74,.84]];for(const [a,b] of hops){const u=cl((t-a)/(b-a));if(u>0&&u<1){P.root={y:jumpArc(t,a,b,R.H*.35),ry:a>.7?TAU*ease(u):0};P.hip=[];P.knee=[];R.legs.forEach((l,i)=>{P.hip[i]=(l.front?.6:-.6)*Math.sin(P_*u);P.knee[i]=(l.front?-1:1)*Math.sin(P_*u);});}}
      if(happy)wag(P,t,12,.9*happy);RIG.pose(R,P);
      const hand=handW(V,free,VP.arm[free],VP.wing[free]);const mouth=mouthW(R,.3);const m=seg(t,.32,.4);
      const th=tr.H*2.4*.5;tr.root.position.set(hand.x+(mouth.x-hand.x)*m,hand.y+(mouth.y-hand.y)*m-th,hand.z+(mouth.z-hand.z)*m);tr.root.visible=t<.47;};}
  else{const ct=propB('vet:counter');S.add(ct.root);floorShadow(S,.05,0,.55,1.25);V.root2.position.set(-.75,0,.55);V.root2.rotation.y=0;V.shadow.visible=false;
    tick=t=>{const wave=seg(t,.16,.22)*(1-seg(t,.44,.5));const type=seg(t,.56,.62)*(1-seg(t,.9,.96));const VP={arm:[0,0],wing:[0,0]};VP.arm[free]=2.7*wave+.95*type+.06*Math.max(0,S2(t*16))*type;VP.wing[free]=wave*(.45+.4*S2((t-.16)*9));VP.arm[1-free]=.95*type;
      VP.hp=.06*wave-.3*type;VP.hy=.35*S2(t)*(1-wave)*(1-type);VP.br=.02*S2(2*t);RIG.pose(V,VP);};}
  return {S,C:st.C,tick};});}
SETS.vet={title:'Vet visit: exam, scale, treat, lobby',cols:2,cw:340,ch:270,frames:48,cells:[vetCell('exam'),vetCell('scale'),vetCell('treat'),vetCell('lobby')]};

/* ===== jointed models (31 Oct): animate the model's own pivot groups (no baking, no mesh bending) ===== */
function jointed(id,o){const M=PU[id];const opt=Object.assign({},M.dflt,o||{});const type=id.split(':')[1];const m=farmAnimal(type,opt.c,opt.age||'adult');
  const root2=new THREE.Group(),turn=new THREE.Group();turn.rotation.y=P_/2;turn.add(m.root);root2.add(turn);root2.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(root2);
  const snap=g=>g?{p:g.position.clone(),r:g.rotation.clone()}:null;const R={m,root2,turn,L:bb.max.x-bb.min.x,H:bb.max.y-bb.min.y,W:bb.max.z-bb.min.z,id};
  R.rest={b:snap(m.b),neck:snap(m.neck),head:snap(m.head),tail:snap(m.tail),legs:(m.legs||[]).map(snap),lower:(m.lower||[]).map(snap),hc:snap(m.head&&m.head.children[0])};return R;}
function jReset(R){const m=R.m,rs=R.rest,put=(g,s)=>{if(g&&s){g.position.copy(s.p);g.rotation.copy(s.r);}};put(m.b,rs.b);put(m.neck,rs.neck);put(m.head,rs.head);put(m.tail,rs.tail);(m.legs||[]).forEach((g,i)=>put(g,rs.legs[i]));(m.lower||[]).forEach((g,i)=>put(g,rs.lower[i]));if(m.head)put(m.head.children[0],rs.hc);}
function jGround(R){R.turn.position.y=0;R.root2.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(R.turn);R.turn.position.y=-bb.min.y;R.root2.updateMatrixWorld(true);
  if(R.shadow){const c=bb.getCenter(new THREE.Vector3());R.shadow.position.set(c.x,R.root2.position.y+.004,c.z);R.shadow.scale.set(R.L*.55,R.W*.62,1);R.shadow.material.opacity=.3;}return bb;}
function jHeadBox(R){R.root2.updateMatrixWorld(true);return new THREE.Box3().setFromObject(R.m.head);}
/* 4-beat walk on the model's legs: legs order = front(-x), front(+x), back(-x), back(+x) by position; upper rotation.x + = foot back */
function jWalk(R,ph,A,B){const m=R.m;const off=[.25,.75,0,.5];m.legs.forEach((u,i)=>{const fr=R.rest.legs[i].p.z>0;const k=m.legs[i].position.z>0;const f=TAU*(ph+off[i]);u.rotation.x=R.rest.legs[i].r.x-A*Math.sin(f);m.lower[i].rotation.x=R.rest.lower[i].r.x+B*Math.max(0,Math.cos(f));});}
function jStride(R,A,f){return 4*Math.sin(A)*.62*1.25*f*.85;}
function grassPatch(S,n,x0,x1,z0,z1,h0,h1,seed){const g=new THREE.Group();let s=seed||7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;const cols=['#5f9e45','#6fae50','#7cbb5b','#8cc466'];
  for(let i=0;i<n;i++){const h=h0+(h1-h0)*rnd();const q=new THREE.Mesh(new THREE.ConeGeometry(.018+.01*rnd(),h,4),new THREE.MeshLambertMaterial({color:cols[i%4]}));q.position.set(x0+(x1-x0)*rnd(),h/2,z0+(z1-z0)*rnd());q.rotation.z=.25*(rnd()-.5);q.rotation.x=.25*(rnd()-.5);g.add(q);}S.add(g);return g;}
function cowGrazeK(R,k){const m=R.m,rs=R.rest;m.neck.position.z=rs.neck.p.z+.35*k;m.neck.position.y=rs.neck.p.y-.14*k;m.neck.rotation.x=rs.neck.r.x+1.3*k;m.head.rotation.x=rs.head.r.x+.35*k;m.b.rotation.x=rs.b.r.x+.1*k;
  for(const i of [0,1]){m.legs[i].rotation.x=rs.legs[i].r.x+.15*k;m.lower[i].rotation.x=rs.lower[i].r.x-.3*k;}}
SETS.cowsJ={title:'Cows (jointed model)',cols:3,cw:320,ch:260,frames:72,cells:[
 cell('Walk','calm 4-beat walk, head nods',()=>{const R=jointed('farm:cow');const st=stage(R,{zoom:.85,yaw:.45});const A=.24,B=.85,f=4,D=jStride(R,A,f);st.fit(D);
   return {S:st.S,C:st.C,tick:t=>{jReset(R);const m=R.m;jWalk(R,f*t,A,B);m.head.rotation.x+=.11*S2(2*f*t+.1);m.b.rotation.z=.03*S2(f*t);m.tail.rotation.z=.3*S2(f*t+.2);st.setDist(D*t);jGround(R);}};}),
 cell('Graze','neck down to the grass, bites, tears, chews, steps',()=>{const R=jointed('farm:cow');const st=stage(R,{zoom:.8,yaw:.75,pitch:.3});
   jReset(R);cowGrazeK(R,1);jGround(R);const hb=jHeadBox(R);const mx=hb.max.x,mz=(hb.min.z+hb.max.z)/2,my=hb.min.y;dbg('graze muzzle y',my,'x',mx);
   const D=R.L*.16;const g=new THREE.Group();st.S.add(g);for(let k=-6;k<=6;k++){const gp=grassPatch(g,26,0,D,-R.W*1.8,R.W*1.8,.06,.16,11);gp.position.x=k*D;}
   return {S:st.S,C:st.C,tick:t=>{jReset(R);const m=R.m;cowGrazeK(R,1);
     const step=seg(t,.44,.64),sb=bell(t,.44,.64);if(sb>0){const ph=(t-.44)/.2;m.legs.forEach((u,i)=>{const f=TAU*(ph+[.25,.75,0,.5][i]);u.rotation.x+=-.2*Math.sin(f)*sb;m.lower[i].rotation.x+=.6*Math.max(0,Math.cos(f))*sb;});}
     const eat=1-bell(t,.44,.64);const bt=(5*t)%1;const push=bt<.45?Math.sin(P_*bt/.45):0,tear=bt>.5&&bt<.72?Math.sin(P_*(bt-.5)/.22):0,chew=bt>.72?Math.sin(TAU*2*(bt-.72)/.28):0;const side=Math.floor(5*t)%2?1:-1;
     m.neck.rotation.x+=(.1*push-.14*tear)*eat;m.head.rotation.y=(.38*tear*side)*eat;m.head.rotation.x+=(.08*push-.06*tear)*eat;const hc=m.head.children[0];hc.rotation.y=.09*chew*eat;
     m.tail.rotation.z=.2*S2(t*2)+.8*bell(t,.8,.9);m.tail.rotation.x=.25*bell(t,.8,.9);
     const dist=D*step;g.position.x=-dist;jGround(R);}};}),
 cell('Stand, chew, look around','chews cud, turns to look',()=>{const R=jointed('farm:cow');const st=stage(R,{zoom:.82,yaw:.36});
   return {S:st.S,C:st.C,tick:t=>{jReset(R);const m=R.m;const A=seg(t,.06,.24)*(1-seg(t,.4,.56)),Bk=seg(t,.46,.6)*(1-seg(t,.76,.92));
     m.head.rotation.y=-.65*A-.3*Bk;m.head.rotation.x+=-.08*A-.12*Bk+.03*S2(6*t);const hc=m.head.children[0];hc.rotation.y=.07*S2(6*t);hc.rotation.z=.03*S2(6*t+.25);
     m.tail.rotation.z=.15*S2(2*t)+.9*bell(t,.64,.74);m.tail.rotation.x=.3*bell(t,.64,.74);m.b.rotation.z=.012*S2(t);jGround(R);}};})]};

/* ===== jointed sheep flock (31 Oct): the sheep's own leg, head and tail groups ===== */
/* stance/swing leg angle: the foot moves back at an even speed while on the ground (62% of the step), then swings forward */
function legAng(ph,A){ph=((ph%1)+1)%1;if(ph<.62)return -A+2*A*(ph/.62);const u=(ph-.62)/.38;return A-2*A*ease(u);}
function jWalk3(R,ph,A,amp){const m=R.m;const off=[.25,.75,0,.5];m.legs.forEach((u,i)=>{u.rotation.x=R.rest.legs[i].r.x+legAng(ph+off[i],A)*amp;});
  m.b.position.y=R.rest.b.p.y+.025*amp*Math.cos(TAU*2*ph);m.b.rotation.z=.05*amp*Math.sin(TAU*ph);m.b.rotation.x=R.rest.b.r.x+.03*amp*Math.sin(TAU*2*ph+.4);m.head.rotation.x+=.22*amp*Math.sin(TAU*2*ph+.5);}
function sheepIdle(R,t,k,amt){const m=R.m;amt=amt??1;m.b.position.y+=.01*amt*Math.sin(TAU*2*t+k);m.b.scale.x=1+.012*amt*Math.sin(TAU*2*t+k);m.tail.rotation.z=.4*Math.sin(TAU*3*t+k)*(Math.sin(TAU*t+k)>.3?1:.25);}
function sheepFlockCell(){return cell('Flock walks together','the leader moves, the others follow; a lamb hops by its mum',()=>{
  const C=FARM_COLS.sheep;const L0=.6;const defs=[{c:C[0],x:1.0,z:-.45,a:0},{c:C[0],x:-.45,z:.75,a:.1},{c:C[1],x:-.85,z:-1.45,a:.2},{c:C[0],x:-.35,z:1.75,a:.12,lamb:true}];
  const Rs=defs.map(d=>{const R=jointed('farm:sheep',{c:d.c,age:d.lamb?'baby':'adult'});R.d=d;return R;});const R0=Rs[0];
  const st=stage(R0,{zoom:1.7,cy:.4,yaw:.5,pitch:.3});const S=st.S;Rs.slice(1).forEach(R=>{S.add(R.root2);RIG.addShadow(R,S);});
  const leg=.38,A=.36,f=7;const stride=2*leg*Math.sin(A);
  Rs.forEach(R=>{const d=R.d;R.wk=t=>seg(t,d.a,d.a+.07)*(1-seg(t,d.a+L0-.07,d.a+L0));
    R.mv=d.lamb?(t=>R.wk(t)*Math.max(0,Math.sin(TAU*6*t))):R.wk;let Wi=0;for(let k=0;k<720;k++)Wi+=R.mv((k+.5)/720)/720;R.Wi=Wi;R.cum=cumOf(R.mv,720);});
  const D=stride*f*Rs[0].Wi;st.fit(D);
  const looks=[[.6,.86,-.8],[.7,.95,.7],[.8,.99,.6],[.72,.97,-.6]];
  return {S,C:st.C,tick:t=>{const cm=D*Rs.reduce((s,R)=>s+R.cum(t),0)/Rs.length;st.setDist(cm);
    Rs.forEach((R,k)=>{jReset(R);const m=R.m,d=R.d,w=R.wk(t);const x=d.x+D*R.cum(t)-cm;const lk=looks[k];const look=bell(t,lk[0],lk[1])*(1-w);
      if(d.lamb){const s6=Math.sin(TAU*6*t),hop=w*Math.max(0,s6),hh=[.13,.09,.15][Math.floor(6*t)%3];m.legs.forEach((u,i)=>{u.rotation.x=R.rest.legs[i].r.x+(i<2?-.55:.5)*hop;});
        m.tail.rotation.z=.7*Math.sin(TAU*9*t);m.head.rotation.x+=-.15*hop;m.head.rotation.y=lk[2]*look;sheepIdle(R,t,k,1-w);R.root2.position.set(x,0,d.z);jGround(R);R.turn.position.y+=hh*hop;}
      else{jWalk3(R,f*t+k*.13,A,w);const nib=0;
        m.head.rotation.y=lk[2]*look;m.head.rotation.x+=.85*nib+.08*nib*Math.sin(TAU*10*t)-.08*look;
        sheepIdle(R,t,k,1-w);R.root2.position.set(x,0,d.z);jGround(R);}});}};});}
function sheepCloseCell(){return cell('One sheep: walk, stop, look','legs swing under the wool, body bobs, head nods',()=>{const R=jointed('farm:sheep');const st=stage(R,{zoom:.95,yaw:.55,cy:.45});
  const A=.36,f=5,leg=.38;const wk=t=>t<.55?1-seg(t,.4,.54):seg(t,.86,.97);const cum=cumOf(wk,720);let Wi=0;for(let k=0;k<720;k++)Wi+=wk((k+.5)/720)/720;const D=2*leg*Math.sin(A)*f*Wi;st.fit(D);
  return {S:st.S,C:st.C,tick:t=>{jReset(R);const m=R.m,w=wk(t);jWalk3(R,f*t,A,w);const look=(1-w)*bell(t,.5,.9);m.head.rotation.y=-.85*look;m.head.rotation.x+=-.1*look;sheepIdle(R,t,0,1-w);st.setDist(D*cum(t));jGround(R);}};});}
SETS.sheepJ={title:'Sheep: a flock in its own spot',cols:2,cw:460,ch:300,frames:72,cells:[sheepFlockCell(),sheepCloseCell()]};

window.MVH={cell,stage,mk,prop,walkP,lieP,sitP,wag,jumpArc,spec,legAvg,petMk,cumOf,sneezeP,propB,personMk,armLen,handW,solveArm,placeReach,crouchP,headBoxL,mouthW,headTopW,headBackTopW,zzz,fixShadow,floorShadow,dbg,jointed,jReset,jGround,jHeadBox,jWalk,jStride,grassPatch,cowGrazeK,legAng,jWalk3,sheepIdle,cowFix,cowTail,chickNeck,rollRoot,horseP,grassTex,birdLie,cl,ease,seg,bell,S2,C2,P_,TAU,scene,cam};window.MVH.SETS=SETS;
return SETS;})();
