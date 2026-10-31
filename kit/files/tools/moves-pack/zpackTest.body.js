/* ===== packTest: real c12 models driven ONLY through window.COZY_MOVES (the moves pack above) ===== */
(()=>{const H=window.MVH,MV2=window.COZY_MOVES;const {cell,stage,dbg,seg}=H;const P_=Math.PI;
/* hold a builder's model so it faces +x on the stage (like jointed()); the pack does all posing and the ground fix */
function hold(m){const root2=new THREE.Group(),turn=new THREE.Group();turn.rotation.y=P_/2;turn.add(m.root);root2.add(turn);root2.updateMatrixWorld(true);
  const bb=new THREE.Box3().setFromObject(root2);return {m,root2,turn,L:bb.max.x-bb.min.x,H:bb.max.y-bb.min.y,W:bb.max.z-bb.min.z,worst:0};}
/* after each frame: shadow under the body, and a check that the lowest point is on the ground (ERR line if not, unless in the air) */
const bb=new THREE.Box3(),v=new THREE.Vector3();
function after(R,name,r,lab){R.root2.updateMatrixWorld(true);bb.makeEmpty();R.root2.traverseVisible(o=>{if(!o.isMesh||!o.geometry)return;const pa=o.geometry.attributes.position;for(let i=0;i<pa.count;i+=pa.count>400?2:1)bb.expandByPoint(v.fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld));});
  const low=bb.min.y;if(!(r&&r.lift)&&!(r&&r.noGround)&&Math.abs(low)>.006&&Math.abs(low)>Math.abs(R.worst)){R.worst=low;dbg('GROUND',lab,name,'low',low.toFixed(3));}
  if(R.shadow){const c=bb.getCenter(v);R.shadow.position.set(c.x,.004,c.z);R.shadow.scale.set((bb.max.x-bb.min.x)*.55,(bb.max.z-bb.min.z)*.55,1);R.shadow.material.opacity=.28;}}
/* a cell that plays a list of [move, seconds, opts] in order over the loop; walks scroll the ground by o.walk (metres per second) */
function story(label,sub,build,steps,camO){return cell(label,sub,()=>{const m=build();const R=hold(m);const st=stage(R,Object.assign({zoom:.95,yaw:.5,cy:.5},camO||{}));
  const T=steps.reduce((s,x)=>s+x[1],0);let D=0;const starts=[];for(const s of steps){starts.push(D);D+=(s[2]&&s[2].walk||0)*s[1];}st.fit(D);
  const extra=(steps.extra||(()=>null))(st,R);
  return {S:st.S,C:st.C,tick:t=>{const sec=t*T;let a=0,i=0;while(i<steps.length-1&&sec>=a+steps[i][1]){a+=steps[i][1];i++;}const [name,dur,o0]=steps[i];const o=Object.assign({},o0||{});const lt=sec-a;
    let dist=starts[i];if(o.walk){const k=o.stop?1-seg(lt,dur-o.stop,dur):1;dist+=o.walk*lt;o.dist=dist;if(o.stop)o.amp=k;}
    const r=MV2.play(m,name,lt,o);if(extra&&extra.tick)extra.tick(sec,dist,r);st.setDist(dist);after(R,name,r,label);}};});}
const col=(k,i)=>FARM_COLS[k][i||0];
/* 1 jointed puppy: walks to its bowl, sniffs, sits (Unhappy sign 1) */
const s1=[['pet.walk',1.2,{walk:.55,stop:.4}],['pet.unhappyBowl',3.8]];
s1.extra=(st,R)=>{const g=new THREE.Mesh(new THREE.CylinderGeometry(.11,.085,.06,20),new THREE.MeshLambertMaterial({color:'#9aa7c7'}));st.S.add(g);const x0=R.L*.5+.01;
  return {tick:(sec,dist)=>{g.position.set(x0+(.55*1.2-dist),.03,0);}};};
/* 12 coach: points at the jump, blows the whistle, cheers */
const look=Object.assign({},DEFAULT_LOOK,{top:'#5fae6a',bottom:'#3d3550',hat:'none'});
const SETS_PACK={title:'Moves pack test: real models, moved only by COZY_MOVES',cols:4,cw:300,ch:240,frames:60,cells:[
  story('Puppy (jointed)','to the bowl, sniffs, sits',()=>dogJoint(PET_TYPES.dog.cols[0]),s1,{zoom:.7,yaw:.75,cy:.45}),
  story('Cat','play bow, two hops',()=>makePet('cat',PET_TYPES.cat.cols[0]),[['pet.unhappyPlay',3]],{zoom:.8,cy:.7}),
  story('Bunny','hops, then very happy',()=>makePet('bunny',PET_TYPES.bunny.cols[1]),[['pet.walk',2.4,{walk:.5}],['pet.veryHappy',2.4]],{zoom:.85,cy:.8}),
  story('Puppy (game)','sick: slow walk, lies, sneezes',()=>makePet('dog',PET_TYPES.dog.cols[1]),[['pet.sickWalk',2,{walk:.2}],['pet.sickLie',4]],{zoom:.75,yaw:.7}),
  story('Cow','graze: neck out and down, bites',()=>farmAnimal('cow',col('cow')),[['cow.graze',6]],{zoom:.62,yaw:.75,pitch:.3}),
  story('Sheep','walk, stop, look around',()=>farmAnimal('sheep',col('sheep')),[['farm.walk',2.5,{walk:.5,stop:.5}],['sheep.look',3.5]],{zoom:.7}),
  story('Chicken','head-bob walk, scratch, peck',()=>farmAnimal('chicken',col('chicken',1)),[['chicken.walk',2,{walk:.35,stop:.3}],['chicken.peck',3]],{zoom:.8,yaw:.8}),
  story('Pig','rolls full circles in the mud',()=>farmAnimal('pig',col('pig')),[['pig.roll',3.2]],{zoom:.72,yaw:.6,g1:'#a0805a',g2:'#8a6a48'}),
  story('Seal','galumphs on land',()=>makePUPet('seal'),[['seal.galumph',3,{walk:.4}]],{zoom:.8,yaw:.6}),
  cell('Horse + rider','gallop, rider seated',()=>{const h=farmAnimal('horse',col('horse'),'adult');const p=riderOn(h,{top:'#ff7aa8'});const R=hold(h);const st=stage(R,{zoom:.62,yaw:.45,cy:.55});
    const sd=MV2.core.stride(h,.55),T=2,N=Math.max(1,Math.round(T*7/sd)),D=N*sd;st.fit(D);
    return {S:st.S,C:st.C,tick:t=>{const r=MV2.play(h,'horse.gallop',t*T,{dist:D*t});MV2.play(p,'person.ride',t*T,{horse:h});st.setDist(D*t);after(R,'horse.gallop',r,'Horse');}};}),
  story('Bear','very happy: rolls on its back',()=>makePUPet('bear'),[['bear.roll',4.8]],{zoom:.7,yaw:.6}),
  story('Coach','points, whistles, cheers',()=>makePerson(look),[['coach.point',2.5],['coach.whistle',2],['coach.cheer',3.2]],{zoom:.75,yaw:1.05,cy:.55})
]};CLIPS2.packTest=SETS_PACK;
})();
