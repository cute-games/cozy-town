window.RIG=(function(){
const V=new THREE.Vector3();
function flip(geo){if(geo.index){const a=geo.index.array;for(let i=0;i<a.length;i+=3){const t=a[i+1];a[i+1]=a[i+2];a[i+2]=t;}geo.index.needsUpdate=true;}else{for(const k in geo.attributes){const at=geo.attributes[k],s=at.itemSize,ar=at.array;for(let i=0;i<at.count;i+=3){for(let j=0;j<s;j++){const t=ar[(i+1)*s+j];ar[(i+1)*s+j]=ar[(i+2)*s+j];ar[(i+2)*s+j]=t;}}at.needsUpdate=true;}}}
// build + bake into canonical space: forward +x, up +y, ground y=0, centred
function bake(id,o,face){const g=new THREE.Group();const M=PU[id];M.build(g,Object.assign({},M.dflt,o||{}));g.updateMatrixWorld(true);
  const inv=new THREE.Matrix4().copy(g.matrixWorld).invert();const items=[];
  g.traverse(m=>{if(m.isMesh&&m.visible!==false){items.push([m,new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld)]);}});
  const bb=new THREE.Box3();for(const [m,mm] of items){m.geometry.computeBoundingBox();const b=m.geometry.boundingBox.clone().applyMatrix4(mm);bb.union(b);}
  const c=bb.getCenter(new THREE.Vector3());
  // face: angle that turns model's forward into +x. default: models face +z  -> rotate -90deg about y? (+z -> +x needs rotation +90: x'=z)
  const yaw=face!=null?face:Math.PI/2;
  const T=new THREE.Matrix4().makeRotationY(yaw).multiply(new THREE.Matrix4().makeTranslation(-c.x,-bb.min.y,-c.z));
  const root=new THREE.Group(),parts=[];
  for(const [m,mm] of items){const geo=m.geometry.clone();const X=new THREE.Matrix4().multiplyMatrices(T,mm);geo.applyMatrix4(X);if(X.determinant()<0)flip(geo);
    const n=new THREE.Mesh(geo,m.material);n.renderOrder=m.renderOrder;n.frustumCulled=false;geo.computeBoundingBox();
    const rest=Float32Array.from(geo.attributes.position.array);const nrest=geo.attributes.normal?Float32Array.from(geo.attributes.normal.array):null;
    root.add(n);parts.push({mesh:n,geo,rest,nrest,bb:geo.boundingBox.clone(),outline:m.material&&m.material.side===THREE.BackSide});}
  const B=new THREE.Box3();parts.forEach(p=>B.union(p.bb));
  return {root,parts,B,L:B.max.x-B.min.x,H:B.max.y-B.min.y,W:B.max.z-B.min.z,id};}
function info(R){return R.parts.map((p,i)=>{const b=p.bb;return [i,p.outline?'O':'m',...[b.min.x,b.max.x,b.min.y,b.max.y,b.min.z,b.max.z].map(v=>+v.toFixed(2))];});}
return {bake,info,flip};})();
RIG.analyze=function(R,kind){if(kind==='human')return RIG.human(R);const {parts,B,L,H,W}=R;const cx=p=>(p.bb.min.x+p.bb.max.x)/2,cz=p=>(p.bb.min.z+p.bb.max.z)/2,cy=p=>(p.bb.min.y+p.bb.max.y)/2,sz=(p,a)=>p.bb.max[a]-p.bb.min[a];
  const vol=p=>sz(p,'x')*sz(p,'y')*sz(p,'z');
  // body = biggest non-outline part
  let body=parts.filter(p=>!p.outline).sort((a,b)=>vol(b)-vol(a))[0];
  const isBody=p=>p===body||(p.outline&&Math.abs(cx(p)-cx(body))<.05*L&&Math.abs(cy(p)-cy(body))<.05*H&&vol(p)>vol(body)*.8)||false;const _isB0=p=>p===body||(p.outline&&Math.abs(cx(p)-cx(body))<.05*L&&Math.abs(cy(p)-cy(body))<.05*H&&vol(p)>vol(body)*.8);
  const legs=[];
  if(kind!=='spine'&&kind!=='none'){
    const seeds=parts.filter(p=>!isBody(p)&&p.bb.min.y<.08*H&&sz(p,'x')<.3*L&&sz(p,'z')<.45*W);
    for(const p of seeds){let c=legs.find(l=>Math.hypot(l.x-cx(p),l.z-cz(p))<.12*Math.max(L,W));if(!c){c={x:cx(p),z:cz(p),parts:[]};legs.push(c);}c.parts.push(p);}
    // grow upward
    let grew=true;while(grew){grew=false;for(const p of parts){if(isBody(p)||legs.some(l=>l.parts.includes(p)))continue;if(sz(p,'x')>.3*L||p.bb.min.y>.6*H)continue;
      for(const l of legs){const top=Math.max(...l.parts.map(q=>q.bb.max.y));if(Math.abs(l.z)>.02*W&&Math.abs(cz(p)-l.z)>.6*Math.abs(l.z))continue;if(Math.hypot(l.x-cx(p),l.z-cz(p))<.1*Math.max(L,W)&&p.bb.min.y<=top+.02*H&&p.bb.max.y>top){l.parts.push(p);grew=true;break;}}}}
    for(const l of legs){l.top=Math.max(...l.parts.map(q=>q.bb.max.y));l.bot=Math.min(...l.parts.map(q=>q.bb.min.y));
      const segs=[...new Set(l.parts.filter(q=>!q.outline).map(q=>+q.bb.min.y.toFixed(3)))].sort((a,b)=>b-a);
      l.knee=segs.length>1&&segs[0]>l.bot+.2*(l.top-l.bot)?segs[0]:l.bot+(l.top-l.bot)*.5;l.ank=segs.length>2&&segs[1]>l.bot+.04*(l.top-l.bot)?segs[1]:null;}
    const mx=legs.reduce((s,l)=>s+l.x,0)/Math.max(1,legs.length);legs.forEach(l=>l.front=legs.length>2?l.x>mx:true);
  }
  if(legs.length>=4){const lo=Math.min(...legs.map(l=>l.x))-.1*L,hi=Math.max(...legs.map(l=>l.x))+.1*L;const ls=new Set(legs.flatMap(l=>l.parts));
    const cand=parts.filter(p=>!p.outline&&!ls.has(p)&&cx(p)>lo&&cx(p)<hi&&p.bb.min.y>Math.min(...legs.map(l=>l.top))*.3).sort((a,b)=>vol(b)-vol(a))[0];if(cand)body=cand;}
  const bL=sz(body,'x'),bH=sz(body,'y');
  const neck={x:body.bb.max.x-.12*bL,y:cy(body)+.22*bH};const tail={x:body.bb.min.x+.1*bL,y:cy(body)+.15*bH};
  const legSet=new Set(legs.flatMap(l=>l.parts));
  const head=parts.filter(p=>!isBody(p)&&!legSet.has(p)&&cx(p)>neck.x-.15*L&&p.bb.max.y>neck.y-.15*H);
  const tails=parts.filter(p=>!isBody(p)&&!legSet.has(p)&&!head.includes(p)&&cx(p)<body.bb.min.x+.12*bL);
  // arms: side parts off the ground, mid height (bipeds)
  const arms=[];if(legs.length===2){for(const p of parts){if(isBody(p)||legSet.has(p)||head.includes(p)||tails.includes(p))continue;if(Math.abs(cz(p))>.18*W&&p.bb.min.y>.2*H&&cy(p)<.8*H&&sz(p,'y')>.12*H){let a=arms.find(a=>Math.sign(a.z)===Math.sign(cz(p)));if(!a){a={z:cz(p),x:cx(p),parts:[],top:0};arms.push(a);}a.parts.push(p);a.top=Math.max(a.top,p.bb.max.y);}}}
  return Object.assign(R,{body,legs,neck,tail,head,tails,arms,isBody});};
/* ---------- deformer ---------- */
RIG.make=function(id,o,kind,face,opt){const R=RIG.analyze(RIG.bake(id,o,face),kind);R.kind=kind||'legs';R.rigid=!!(opt&&opt.rigid);
  // leg order + roles
  const fz=R.legs.filter(l=>l.front),hz=R.legs.filter(l=>!l.front);
  R.legs.forEach(l=>{l.side=l.z>=0?1:-1;l.len=l.top-l.bot;l.band=(new Set(l.parts.filter(q=>!q.outline).map(q=>+q.bb.min.y.toFixed(3)))).size>1?.02*l.len:.18*l.len;});
  R.biped=R.legs.length===2;
  if(R.id==='pet:seal'){const cz=p=>(p.bb.min.z+p.bb.max.z)/2,cx=p=>(p.bb.min.x+p.bb.max.x)/2;R.arms=[1,-1].map(sd=>{const ps=R.parts.filter(p=>!R.isBody(p)&&!R.head.includes(p)&&!R.tails.includes(p)&&p.bb.min.y<.25*R.H&&Math.sign(cz(p))===sd&&Math.abs(cz(p))>.25*R.W*.5&&cx(p)>0);
    const inner=ps.length?Math.min(...ps.map(p=>Math.min(Math.abs(p.bb.min.z),Math.abs(p.bb.max.z)))):.2;return {z:sd*inner,wz:sd*inner,x:ps.length?ps.reduce((a,p)=>a+cx(p),0)/ps.length:0,top:ps.length?Math.max(...ps.map(p=>p.bb.max.y)):.2,parts:ps};});}
  const role=new Map();R.legs.forEach((l,i)=>l.parts.forEach(p=>role.set(p,['leg',i])));R.head.forEach(p=>role.set(p,['head']));R.tails.forEach(p=>role.set(p,['tail']));
  R.arms.forEach((a,i)=>a.parts.forEach(p=>role.set(p,['arm',i])));
  R.parts.forEach(p=>{p.role=role.get(p)||(R.isBody(p)?['body']:['rest']);});
  const B=R.body.bb;R.bodyC={x:(B.min.x+B.max.x)/2,y:(B.min.y+B.max.y)/2};
  R.legs.forEach(l=>{const ml=Math.max(.02*R.H,l.len/6);l.parts.forEach(p=>{const g=RIG.tess(p.geo,ml);p.mesh.geometry=g;p.geo=g;p.rest=Float32Array.from(g.attributes.position.array);p.nrest=g.attributes.normal?Float32Array.from(g.attributes.normal.array):null;});});
  R.hoof=R.id==='farm:horse';if(R.rigid)R.legs.forEach(l=>l.band=.004*l.len);
  R.root2=new THREE.Group();R.root2.add(R.root);
  return R;};
const rz=(px,py,a,x,y)=>{const c=Math.cos(a),s=Math.sin(a),dx=x-px,dy=y-py;return [px+dx*c-dy*s,py+dx*s+dy*c];};
RIG.pose=function(R,P){P=P||{};const hip=P.hip||[],knee=P.knee||[],ank=P.ank||[],abd=P.abd||[],arm=P.arm||[],wing=P.wing||[];
  for(const p of R.parts){const pos=p.geo.attributes.position,a=pos.array,r=p.rest,n=p.geo.attributes.normal,na=n&&n.array,nr=p.nrest,cnt=pos.count;const [k,i]=p.role;
    for(let v=0;v<cnt;v++){let x=r[3*v],y=r[3*v+1],z=r[3*v+2];let nx=nr?nr[3*v]:0,ny=nr?nr[3*v+1]:0,nz=nr?nr[3*v+2]:0;
      if(k==='leg'){const l=R.legs[i],ka=knee[i]||0,ha=hip[i]||0;let aa=ank[i];if(aa==null)aa=l.ank!=null&&R.hoof?-(ha+ka)*.6:0;
        let x2=x,y2=y,nx2=nx,ny2=ny;
        const app=(jy,a,band)=>{if(!a)return;const w=Math.min(1,Math.max(0,(y-(jy-band))/(2*band)));if(w>=1)return;const q=rz(l.x,jy,a,x2,y2);const c=Math.cos(a),sn=Math.sin(a);x2=x2+(q[0]-x2)*(1-w);y2=y2+(q[1]-y2)*(1-w);const qn=[nx2*c-ny2*sn,nx2*sn+ny2*c];nx2=nx2+(qn[0]-nx2)*(1-w);ny2=ny2+(qn[1]-ny2)*(1-w);};
        if(l.ank!=null)app(l.ank,aa,.02*l.len);
        app(l.knee,ka,l.band);
        if(abd[i]){const a=abd[i]*l.side,c=Math.cos(a),sn=Math.sin(a),dy=y2-l.top,dz=z-l.z;y2=l.top+dy*c-dz*sn;z=l.z+dy*sn+dz*c;}
        if(ha){const q=rz(l.x,l.top,ha,x2,y2);x2=q[0];y2=q[1];const c=Math.cos(ha),sn=Math.sin(ha);const t=nx2;nx2=t*c-ny2*sn;ny2=t*sn+ny2*c;}
        if(P.spread&&P.spread[i]){z+=P.spread[i]*l.side*Math.min(1,Math.max(0,(l.top-y)/(l.len*.5)));}
        x=x2;y=y2;nx=nx2;ny=ny2;}
      else if(k==='head'&&(P.hp||P.hy||P.hr)){const px=R.neck.x,py=R.neck.y;if(P.hy){const c=Math.cos(P.hy),s=Math.sin(P.hy),dx=x-px,dz=z;x=px+dx*c+dz*s;z=-dx*s+dz*c;const t=nx;nx=t*c+nz*s;nz=-t*s+nz*c;}
        if(P.hp){const q=rz(px,py,P.hp,x,y);x=q[0];y=q[1];const c=Math.cos(P.hp),s=Math.sin(P.hp);const t=nx;nx=t*c-ny*s;ny=t*s+ny*c;}
        if(P.hd||P.hf){const w=Math.min(1,Math.max(0,(r[3*v]-px)/(R.L*.22)));y-=(P.hd||0)*w;x+=(P.hf||0)*w;}}
      if(k==='head'&&P.hT){x+=P.hT[0]||0;y+=P.hT[1]||0;}
      if(k==='tail'&&P.tT){x+=P.tT[0]||0;y+=P.tT[1]||0;}
      if(k==='tail'&&(P.tp||P.ty)){const px=R.tail.x+(P.tT?P.tT[0]||0:0),py=R.tail.y+(P.tT?P.tT[1]||0:0);if(P.ty){const c=Math.cos(P.ty),s=Math.sin(P.ty),dx=x-px;x=px+dx*c+z*s;z=-dx*s+z*c;}if(P.tp){const q=rz(px,py,P.tp,x,y);x=q[0];y=q[1];}}
      else if(k==='arm'){const A=R.arms[i];if(arm[i]){const q=rz(A.x,A.top,arm[i],x,y);x=q[0];y=q[1];}if(wing[i]){const s=Math.sign(A.z)||1,c=Math.cos(wing[i]*s),sn=Math.sin(wing[i]*s),dy=y-A.top,pz=A.wz!=null?A.wz:A.z*.4,dz=z-pz;y=A.top+dy*c-dz*sn;z=pz+dy*sn+dz*c;}}
      if(k==='body'&&P.br){y=R.bodyC.y+(y-R.bodyC.y)*(1+P.br);z=z*(1+P.br*.7);}
      if(P.flex){const F=P.flex,xx=(k==='leg'?R.legs[i].x:r[3*v])-R.bodyC.x,u=xx/(R.L*.5);if(F.y)y+=F.y*R.L*u*u;if(F.z)z+=F.z*R.L*u*u;if(F.zs)z+=F.zs*R.L*u;}
      if(P.spine){const S=P.spine,env=Math.min(1,Math.max(0,(R.B.max.x-x)/(R.L*.25)));const off=S.a*R.L*Math.sin(S.k*x/R.L*Math.PI*2-S.ph)*(.35+.65*env*(S.envBack?1:1));if(S.ax==='z')z+=off;else y+=off*(S.yfloor&&y<.02*R.H?0:1);}
      a[3*v]=x;a[3*v+1]=y;a[3*v+2]=z;if(na){na[3*v]=nx;na[3*v+1]=ny;na[3*v+2]=nz;}}
    pos.needsUpdate=true;if(n)n.needsUpdate=true;}
  // root: rotation about a pivot + offset + squash
  const rt=P.root||{};const s=rt.sq||1,piv=new THREE.Vector3(...(rt.piv||[0,0,0]));R.root.scale.set((rt.sx||1)/Math.sqrt(s),s,1/Math.sqrt(s));R.root.rotation.set(rt.rx||0,rt.ry||0,rt.rz||0,'YXZ');
  const q=piv.clone().multiply(R.root.scale).applyEuler(R.root.rotation);R.root.position.set(piv.x-q.x+(rt.x||0),piv.y-q.y+(rt.y||0),piv.z-q.z+(rt.z||0));
  if(P.floor!==false){R.root2.updateMatrixWorld(true);let mn=Infinity;const vv=new THREE.Vector3();for(const p of R.parts){const a=p.geo.attributes.position.array;const M=p.mesh.matrixWorld;for(let i=0;i<a.length;i+=9){vv.set(a[i],a[i+1],a[i+2]).applyMatrix4(M);if(vv.y<mn)mn=vv.y;}}const base=R.root2.parent?R.root2.getWorldPosition(new THREE.Vector3()).y:0;const lim=base-.004*R.H;if(mn<lim){R.root.position.y+=(lim-mn)/(R.root2.scale.y||1);R.root2.updateMatrixWorld(true);}}
  if(R.shadow){R.root2.updateMatrixWorld(true);const c=R.root.localToWorld(new THREE.Vector3(R.bodyC.x,0,0));const h=P.shadowH!=null?P.shadowH:Math.max(0,R.root.position.y+R.root2.position.y);const f=1/(1+2.2*h/R.H);R.shadow.position.set(c.x,R.root2.position.y+.004*R.H,c.z);R.shadow.scale.set(R.L*.55*f,R.W*.6*f,1);R.shadow.material.opacity=.3*f;}
};
/* gaits: phase per leg */
RIG.PH={walk:{FL:.25,FR:.75,HL:0,HR:.5},trot:{FL:0,FR:.5,HL:.5,HR:0},gallop:{FL:.45,FR:.55,HL:0,HR:.1},pace:{FL:0,FR:.5,HL:0,HR:.5},hop:{FL:.12,FR:.12,HL:0,HR:0},biped:{L:0,R:.5}};
RIG.gait=function(R,P,type,ph,A,B){P.hip=P.hip||[];P.knee=P.knee||[];const T=RIG.PH[R.biped?'biped':type];const TAU=Math.PI*2;
  R.legs.forEach((l,i)=>{const key=R.biped?(l.side>0?'L':'R'):(l.front?'F':'H')+(l.side>0?'L':'R');const f=TAU*(ph+T[key]);
    P.hip[i]=(P.hip[i]||0)+A*Math.sin(f);const lift=Math.max(0,Math.cos(f));P.knee[i]=(P.knee[i]||0)+(R.biped||l.front||P.hindBack?-1:1)*B*lift;});
  return P;};
RIG.stride=(R,A,f)=>{const len=R.legs.length?R.legs.reduce((s,l)=>s+l.len,0)/R.legs.length:R.H*.3;return 4*Math.sin(A)*len*f*.85;};

RIG.human=function(R){const {parts,H}=R;const cx=p=>(p.bb.min.x+p.bb.max.x)/2,cz=p=>(p.bb.min.z+p.bb.max.z)/2,szz=p=>p.bb.max.z-p.bb.min.z;
  const ground=parts.filter(p=>p.bb.min.y<.05*H&&szz(p)<.35);const legTop=Math.max(...parts.filter(p=>p.bb.min.y<.2*H&&szz(p)<.3&&p.bb.max.y<.5*H).map(p=>p.bb.max.y));
  const gz=Math.max(...ground.map(p=>Math.abs(cz(p))));const legs=[1,-1].map(sd=>({side:sd,z:.12*sd,x:0,parts:parts.filter(p=>p.bb.max.y<=legTop+.03*H&&szz(p)<.3&&Math.sign(cz(p))===sd&&Math.abs(cz(p))<=gz+.03),top:legTop,bot:0,front:true}));
  legs.forEach(l=>{l.knee=legTop*.5;l.ank=legTop*.14;l.x=l.parts.length?l.parts.reduce((s,p)=>s+cx(p),0)/l.parts.length:0;});
  const ls=new Set(legs.flatMap(l=>l.parts));
  const torso=parts.filter(p=>!ls.has(p)&&!p.outline&&p.bb.min.y>legTop*.8&&p.bb.min.y<legTop*1.3&&szz(p)<.6).sort((a,b)=>(b.bb.max.y-b.bb.min.y)-(a.bb.max.y-a.bb.min.y))[0]||parts[0];
  const tTop=torso.bb.max.y,tW=(torso.bb.max.z-torso.bb.min.z)/2;
  const arms=[1,-1].map(sd=>{const ps=parts.filter(p=>!ls.has(p)&&p.bb.max.y<=tTop+.03*H&&p.bb.min.y>legTop*.6&&Math.sign(cz(p))===sd&&Math.abs(cz(p))>tW*.95&&szz(p)<.3);return {z:sd*(tW+.05),x:0,parts:ps,top:ps.length?Math.max(...ps.map(p=>p.bb.max.y)):tTop};});
  const as=new Set(arms.flatMap(a=>a.parts));const head=parts.filter(p=>!ls.has(p)&&!as.has(p)&&p.bb.min.y>=tTop-.04*H);
  const body=torso;return Object.assign(R,{body,legs,arms,head,tails:[],neck:{x:0,y:tTop},tail:{x:0,y:0},isBody:p=>!ls.has(p)&&!as.has(p)&&!head.includes(p)&&p.bb.min.y<tTop});};

RIG.headTop=function(R){R.root2.updateMatrixWorld(true);let best=null,by=-1e9;const v=new THREE.Vector3();for(const p of R.head.length?R.head:R.parts){const a=p.geo.attributes.position.array;for(let i=0;i<a.length;i+=3){v.set(a[i],a[i+1],a[i+2]).applyMatrix4(p.mesh.matrixWorld);if(v.y>by){by=v.y;best=v.clone();}}}return best;};

RIG.addShadow=function(R,S){const m=new THREE.Mesh(new THREE.CircleGeometry(1,28),new THREE.MeshBasicMaterial({color:'#000',transparent:true,opacity:.3,depthWrite:false}));m.rotation.x=-Math.PI/2;S.add(m);R.shadow=m;return m;};

RIG.tess=function(geo,maxLen,maxIter){maxIter=maxIter||8;const g=geo.index?geo.toNonIndexed():geo;const names=Object.keys(g.attributes);const A=names.map(n=>({n,s:g.attributes[n].itemSize,a:Array.from(g.attributes[n].array)}));
  const P=A.find(x=>x.n==='position');let tris=[];const cnt=P.a.length/3;for(let i=0;i<cnt;i+=3)tris.push([i,i+1,i+2]);
  // vertices as arrays of per-attribute values
  const V=[];for(let i=0;i<cnt;i++)V.push(A.map(x=>x.a.slice(i*x.s,i*x.s+x.s)));
  const pos=v=>V[v][A.indexOf(P)];const d=(u,w)=>{const a=pos(u),b=pos(w);return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);};
  const mid=(u,w)=>{V.push(V[u].map((arr,k)=>arr.map((x,j)=>(x+V[w][k][j])/2)));return V.length-1;};
  for(let it=0;it<maxIter;it++){let ch=false;const nt=[];for(const [a,b,c] of tris){const e=[d(a,b),d(b,c),d(c,a)];const m=Math.max(...e);if(m>maxLen){ch=true;const k=e.indexOf(m);const [p,q,r]=k===0?[a,b,c]:k===1?[b,c,a]:[c,a,b];const mm=mid(p,q);nt.push([p,mm,r],[mm,q,r]);}else nt.push([a,b,c]);}tris=nt;if(!ch)break;}
  const out=new THREE.BufferGeometry();A.forEach((x,k)=>{const arr=new Float32Array(tris.length*3*x.s);let o=0;for(const t of tris)for(const v of t){for(const val of V[v][k])arr[o++]=val;}out.setAttribute(x.n,new THREE.BufferAttribute(arr,x.s));});
  out.computeBoundingBox();return out;};
