# Run 4, job 12 (item 12): the Pet Shop gets a second floor. Upstairs: every kind of animal in its own fenced area; downstairs: shelves of snacks, toys and pet clothes.
import json
E = []
NEW_SHOP = r"""/* 🐾 run 4, job 12 (item 12): the Pet Shop has two floors. Downstairs: the counter, shelves of snacks and toys, a rack of pet clothes, the pet furniture for sale, the birdcage and the stairs
   in the west wall. Upstairs (40 m further along z, like the floors of your house): every kind of animal in its own fenced area, so they never mix: puppies with their breeds, kittens, bunnies,
   hamsters on their table, a capybara, ducks at a little pond, an owl on a perch. Adopting (💗 at every animal) and buying (🛒 downstairs) work as before */
function buildPetShop(){
  const L=makeLoc('pets','in',500,0,[-7,-5,7,5]);const W=14,D=10,H=3.4,wm=mat('#c9f2e3'),fm=toon({map:floorTex('mint')});L.W=W/2;L.D=D/2;L.items=new THREE.Group();scene.add(L.items);
  const fls=[];for(let k=0;k<2;k++){const g=new THREE.Group(),sh=new THREE.Group(),pr=new THREE.Group();g.add(sh,pr);g.position.set(0,0,UPZ*k);const F={k,g,sh,pr,grid:null};fls.push(F);
    shell({ox:L.ox,oz:L.oz+UPZ*k,cols:L.cols},sh,W,D,H,wm,fm,'#eef6f2',g,UPG);
    if(k===0){doorAt(sh,0,D/2-.02,Math.PI,null,true,true);windowIn(sh,W/2-.02,1.0,2.6,-Math.PI/2,'#ffd45c');stairsIn(sh,1,W,H,wm);}
    else{for(const z of[2.6,-2.6])windowIn(sh,W/2-.02,1.0,z,-Math.PI/2,'#ffd45c');for(const x of[-2.5,2.5])windowIn(sh,x,1.0,-D/2+.02,0,'#ffd45c');for(const x of[-2.5,2.5])windowIn(sh,x,1.0,D/2-.02,Math.PI,'#ffd45c');stairsIn(sh,0,W,H,wm);}
    const gh=new THREE.GridHelper(W,W*2,0xb79cff,0xd9c8ff);gh.scale.z=D/W;gh.position.set(0,.012,UPZ*k);gh.visible=false;L.g.add(gh);F.grid=gh;}
  L.fls=fls;L.g.add(fls[0].g);L.vf=-1;L.grid=fls[0].grid;L.bounds={x1:L.ox-W/2,z1:L.oz-D/2,x2:L.ox+W/2,z2:L.oz+UPZ+D/2};
  inter(L,{x:-W/2+.9,z:-.6,r:1.6,icon:'⬆️',label:'Upstairs to the animals',act:()=>hclimb(1)});inter(L,{x:-W/2+.9,z:UPZ+.6,r:1.6,icon:'⬇️',label:'Downstairs to the shop',act:()=>hclimb(-1)});
  /* ---- downstairs: the shop ---- */
  const pr=fls[0].pr;
  box(pr,3,1.0,.8,'#ffd45c',-4.9,0,2.0);box(pr,3.1,.08,.9,'#ffffff',-4.9,1.0,2.0);col(L,-6.45,1.55,-3.35,2.45);   /* the counter */
  shelfUnit(pr,-4.1,-4.55,0,4.6,['petfood','catfood','bunnyfood']);shelfUnit(pr,.9,-4.55,0,4.6,['treat','ball','squeaky']);col(L,-6.4,-5,3.2,-4.1);   /* 🦴 snacks and toys along the back wall */
  petClothesRack(pr,5.1,-4.55,0,3.2,['bow','hat','collar','scarf','pcrown','bowtie','cape','wings']);col(L,3.5,-5,6.7,-4.1);   /* 👒 pet clothes */
  shelfUnit(pr,6.5,.6,-Math.PI/2,3.6,['petfood','catfood','ball']);col(L,6.05,-1.3,7,2.5);
  {const t=buildFurn('cattree','#b79cff');t.position.set(-2.5,0,-1.3);pr.add(t);colC(L,-2.5,-1.3,.55);const d=buildFurn('doghouse','#7cc8ff');d.position.set(-6.1,0,-1.4);d.rotation.y=Math.PI/2;pr.add(d);col(L,-6.7,-2.0,-5.5,-.8);const pb=buildFurn('petbed','#ff9ec4');pb.position.set(2.3,0,-1.5);pr.add(pb);colC(L,2.3,-1.5,.5);}   /* pet furniture for sale, on show */
  {cyl(pr,.04,.04,1.3,'#c8c8d8',5.8,0,3.9,{seg:6});const cage=new THREE.Group();cage.position.set(5.8,1.3,3.9);pr.add(cage);for(let k=0;k<10;k++){const a=k/10*TAU;cyl(cage,.012,.012,.8,'#c8c8d8',Math.cos(a)*.35,0,Math.sin(a)*.35,{seg:4,ol:false});}
   cyl(cage,.36,.36,.05,'#ffd45c',0,0,0,{seg:16,ol:.01});cone(cage,.38,.3,'#ffd45c',0,.8,0,{seg:16,ol:.01});sph(cage,.1,'#5fd4b0',0,.35,0,{ws:10,hs:8,ol:.012});sph(cage,.06,'#5fd4b0',0,.49,.06,{ws:8,hs:6,ol:.01});cone(cage,.03,.06,'#ffd45c',0,.47,.14,{rx:Math.PI/2,center:true,seg:5,ol:false});colC(L,5.8,3.9,.45);}
  {const up=signPlane('🐾 Animals upstairs ⬆️',2.4,.5,'#ffd45c','#3d2c5e');up.position.set(-W/2+.06,2.55,-2.4);up.rotation.y=Math.PI/2;fls[0].g.add(up);}
  /* ---- upstairs: every kind in its own area (local z, 40 m along) ---- */
  const pu=fls[1].pr,Z=UPZ;L.pens=[];
  const pen=(type,kinds,x0,x1,z0,z1,c,o)=>{o=o||{};box(pu,x1-x0,.04,z1-z0,o.floor||'#ffe9a8',(x0+x1)/2,0,(z0+z1)/2,{ol:false});
    for(const z of[z0,z1])box(pu,x1-x0,.3,.1,c,(x0+x1)/2,0,z,{ol:.02});for(const x of[x0,x1])box(pu,.1,.3,z1-z0,c,x,0,(z0+z1)/2,{ol:.02});
    for(const x of[x0,x1])for(const z of[z0,z1])box(pu,.14,.5,.14,'#ffffff',x,0,z,{ol:.02});
    col(L,x0-.08,Z+z0-.08,x1+.08,Z+z1+.08);
    const s=signPlane(PET_TYPES[type].icon+' '+PET_TYPES[type].many,Math.min(2.6,x1-x0-.3),.5,c,'#3d2c5e');s.position.set((x0+x1)/2,2.3,Z+(z1<0?-D/2+.06:D/2-.06));if(z1>0)s.rotation.y=Math.PI;fls[1].g.add(s);
    L.pens.push(Object.assign({type,kinds,x0:x0+.4,x1:x1-.4,z0:Z+z0+.4,z1:Z+z1-.4},o.y?{y:o.y}:{}));};
  pen('dog',['dog','pug','pomchi','sausage'],-6.7,-2.1,-4.9,-1.9,'#ffd45c');pen('cat',['cat','cat'],-1.7,1.1,-4.9,-1.9,'#ff9ec4');pen('bunny',['bunny','bunny'],1.5,4.1,-4.9,-1.9,'#b79cff');pen('capybara',['capybara'],4.5,6.7,-4.9,-1.9,'#c9a24a');
  pen('duck',['duck','duck'],-6.7,-3.5,1.9,4.9,'#7cc8ff',{floor:'#9fd8f2'});disc(pu,1.1,'#7cc8ff',-5.1,.05,3.4,{seg:20});   /* 🦆 a little pond */
  pen('owl',['owl'],-3.1,-.5,1.9,4.9,'#9a6a43',{y:.95});{box(pu,.12,.95,.12,'#9a6a43',-2.9,0,3.4,{ol:.015});box(pu,.12,.95,.12,'#9a6a43',-.7,0,3.4,{ol:.015});box(pu,2.3,.08,.1,'#b07a52',-1.8,.9,3.4,{ol:.012});}   /* 🦉 a perch */
  {box(pu,2.6,.8,2.0,'#c98f5e',1.3,0,3.4);box(pu,2.4,.04,1.8,'#ffe7a3',1.3,.8,3.4,{ol:false});const cg=toon({color:'#cfeeff',transparent:true,opacity:.3});box(pu,2.45,.55,1.85,null,1.3,.8,3.4,{mat:cg,ol:false});
   const wh=new THREE.Mesh(new THREE.TorusGeometry(.18,.03,6,16),mat('#ff7aa8'));wh.position.set(2.1,1.02,3.0);pu.add(wh);col(L,-.1,Z+2.3,2.7,Z+4.5);
   const s2=signPlane('🐹 Hamsters',1.6,.4,'#ffd45c','#3d2c5e');s2.position.set(1.3,1.72,Z+2.4);fls[1].g.add(s2);L.pens.push({type:'hamster',x0:.3,x1:2.3,z0:Z+2.7,z1:Z+4.1,y:.82});}   /* 🐹 the hamsters' table */
  {box(pu,1.8,.08,.5,'#c98f5e',4.9,.45,3.9,{ol:.012});for(const x of[4.1,5.7])box(pu,.1,.45,.5,'#c98f5e',x,0,3.9,{ol:.012});box(pu,1.8,.5,.08,'#c98f5e',4.9,.5,4.12,{ol:.012});col(L,4.0,Z+3.6,5.8,Z+4.2);}   /* a little bench to watch the animals from */
  for(const F of fls){bake(F.sh,false);bake(F.pr,true);}
  inter(L,{x:0,z:4.3,r:1.9,icon:'🚪',label:'Go outside',act:()=>exitTo('pets')});
  inter(L,{x:5.6,z:.6,r:2,icon:'🛒',label:'Buy pet food, toys & clothes',act:()=>openShop('pets')});
  inter(L,{x:5.1,z:-3.6,r:1.8,icon:'👒',label:'Pet clothes',act:()=>openShop('pets')});
  return L;
}
/* 👒 a rack of little pet clothes: bows, hats, collars, scarves, crowns, bow ties, capes and wings in bright colours */
function petClothesRack(g,x,z,ry,w,items,c='#ffffff'){const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);
  box(p,w,2.0,.1,c,0,0,-.35);box(p,.1,2.0,.8,c,-w/2+.05,0,0);box(p,.1,2.0,.8,c,w/2-.05,0,0);for(const y of[.1,.75,1.4])box(p,w,.06,.8,c,0,y,0,{ol:.015});box(p,w,.1,.8,c,0,1.95,0);
  const cols=['#ff4d8d','#7cc8ff','#ffd45c','#5fd4b0','#b79cff','#ff8a6b'];let k=0;for(const y of[.16,.81,1.46]){const n=Math.floor((w-.3)/.5);for(let i=0;i<n;i++){const it=items[k%items.length],cc=cols[k%6],xx=-w/2+.4+i*.5;k++;
    if(it==='bow'){const b=new THREE.Group();b.position.set(xx,y+.12,.05);p.add(b);bowShape(b,.5,cc,{ol:.008});}
    else if(it==='hat'){cone(p,.13,.26,cc,xx,y,.05,{seg:10,ol:.01});sph(p,.035,'#ffffff',xx,y+.28,.05,{ws:6,hs:5,ol:false});}
    else if(it==='pcrown'){cyl(p,.12,.13,.1,'#ffd45c',xx,y,.05,{seg:10,ol:.01});for(let q=0;q<4;q++){const a=q/4*TAU;cone(p,.03,.08,'#ffd45c',xx+Math.cos(a)*.1,y+.1,.05+Math.sin(a)*.1,{seg:4,ol:false});}}
    else if(it==='collar'){const t=new THREE.Mesh(new THREE.TorusGeometry(.11,.025,6,16),mat(cc));t.position.set(xx,y+.03,.05);t.rotation.x=Math.PI/2;p.add(t);sph(p,.03,'#ffd45c',xx,y+.03,.16,{ws:6,hs:5,ol:false});}
    else if(it==='scarf'){box(p,.28,.06,.2,cc,xx,y,.05,{ol:.01});box(p,.08,.2,.06,cc,xx+.1,y,.14,{ol:.01});}
    else if(it==='bowtie'){for(const s of[-1,1])cone(p,.06,.12,cc,xx+s*.07,y+.06,.05,{rz:s*Math.PI/2,center:true,seg:5,ol:.008});sph(p,.03,shade(cc,-.2),xx,y+.06,.05,{ws:6,hs:5,ol:false});}
    else if(it==='cape'){box(p,.26,.22,.03,cc,xx,y,0,{ol:.01});box(p,.3,.04,.05,'#ffd45c',xx,y+.22,0,{ol:false});}
    else{for(const s of[-1,1])sph(p,.12,cc,xx+s*.1,y+.1,.04,{s:[1,.7,.25],ws:8,hs:6,ol:.01});}}}}   /* 🧚 wings */
"""
E.append(["@between", "function buildPetShop(){", "  inter(L,{x:5.6,z:.6,r:2,icon:'🛒',label:'Buy pet food & toys',act:()=>openShop('pets')});\n  return L;\n}", NEW_SHOP.rstrip('\n')])
# the climb's little message in the Pet Shop
E.append([":'🏡 Upstairs!',2.6);}};}", ":L===LOC.pets?(dir>0?'🐾 Upstairs! Here are the animals 💗':'🛒 Downstairs: snacks, toys and pet clothes'):'🏡 Upstairs!',2.6);}};}"])
json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j12.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
