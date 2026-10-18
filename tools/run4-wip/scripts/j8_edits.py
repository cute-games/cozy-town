# Run 4, job 8 (items 8, 20): the twelve bench grandmas go; three grandmas walk the town with the one clock. Exact-match edits for edit.py.
import json
E = []
E.append(["@between", "/* 👵 grandmas on benches by the houses (night 3, job 6): a bench beside each of the 6 town houses",
          "chat:['🧶','☕','Oh my!','In my day…','Lovely weather!','Hee hee!','Did you hear?','🍪','Oh, I know!','My word!']};",
r"""/* 👵 three grandmas (run 4, items 8 and 20). The twelve who sat on the benches by the town houses are gone (the benches stay, two seats each).
   The three walk round town with the one clock: the real day is cut into 80-second turns, and in each turn every grandma has a place to be (a shop
   door, the school, the park, the Flower Corner gate, the bus stop, the beach gate…); every few turns two of them sit on the duck-pond bench, feed
   the ducks and chat about ducks and life. The day's plan comes from a seeded hash of the real date, so every player's game puts them in the same
   spot at the same moment; between places they walk the townspeople's paths at 1.15 m/s and talk about where they stand. Out 9:00 to 18:00 in dry
   weather, as before; "Say hi" gets a kind line, never the same twice in a row */
const GRAN={g:[],last:'',T:80000,SPD:1.15,day:-1,day0:0,plan:null,start:[1,10,14],paths:new Map(),bench:null,crumbs:[],
  lines:["Oh, what a dear! Have a biscuit, sweetheart. 🍪","You remind me of my grandson. Such a nice smile!","In my day we walked everywhere. Keeps you young!","Lovely weather for a walk, isn't it?","Mind you don't catch cold, pet. Button up!","Aren't you a busy bee! Off you go and play.","Would you like a sweet? I always carry some. 🍬","My knitting is nearly done. A scarf for the cat! 🧶","Hello dear! Say hi to your mum from me.","Such good manners! Your parents must be proud."],
  chat:['🧶','☕','Oh my!','In my day…','Lovely weather!','Hee hee!','Did you hear?','🍪','Oh, I know!','My word!']};"""])
E.append(["@between", "function granOut(){return!!S&&S.time>=9&&S.time<18&&!/rain|snow/.test(wxKind());}", "else q.p.root.position.y=q.y0;}}}",
r"""function granOut(){return!!S&&S.time>=9&&S.time<18&&!/rain|snow/.test(wxKind());}
/* where they go: a townspeople's path node near each place (they stand a step off the path, facing the place) and what they say there; the pond is first */
const GRAN_STOPS=[
  {id:'pond',at:[33.4,-37.0],via:[44.5,-44.5],look:[36.2,-36.2],lines:["Here, duckies! Crumbs for everyone! 🦆","Look at the little one paddling! 🐥","Life's like a pond, dear: mostly calm, with little ripples.","Share your bread and you'll never be lonely. 🍞","Quack if you want more! Hee hee!","Feeding the ducks is the best part of my day.","The ducks know me, you know. Every one of them."]},
  {id:'school',near:[-25,-57.3],look:[-25,-62],lines:["Clever children in there! 🏫","I went to this school, you know.","Study hard and be kind, dear.","Is that the bell? Ding-a-ling! 🔔"]},
  {id:'toys',near:[57.2,-31],look:[64,-31],lines:["I'd love a teddy bear. At my age! 🧸","Toys were made of wood in my day.","What a lovely window! 🎁"]},
  {id:'bakery',near:[57.2,-14],look:[63,-14],lines:["Mmm, fresh bread! 🥖","The buns here are a dream. 🥐","Just smell that! Heaven."]},
  {id:'library',near:[57.6,20],look:[65,20],lines:["Shh! The books are sleeping. 📚","I read a book a week, dear.","A story a day keeps the frowns away!"]},
  {id:'icecream',near:[57.2,36],look:[62,36],lines:["One scoop of vanilla, please! 🍦","Ice cream in any weather, I say!","My grandson likes the pink one. 🍓"]},
  {id:'pizza',near:[55.5,5.6],look:[63,8.6],lines:["That pizza smell! 🍕","Chef Blaze makes a fine crust.","A slice would do me nicely."]},
  {id:'fire',near:[-57.6,-25],look:[-65,-25],lines:["Such brave firefighters! 🚒","That engine shines like a mirror!","Never play with matches, pet."]},
  {id:'clothes',near:[-57.6,-12.5],look:[-63.5,-12.5],lines:["Ooh, a new cardigan! 🧶","That hat would suit me, don't you think?","Fashions change, cardigans stay."]},
  {id:'salon',near:[-55.5,36],look:[-63.5,40.5],lines:["Time for my blue rinse! 💇","A good haircut lifts the spirits.","Just a trim, dear, just a trim."]},
  {id:'market',near:[20,-5.6],look:[18,-12],lines:["Apples, carrots and a bit of cheese. 🍎","I never forget my shopping list. Almost never!","Fresh as the morning, this market."]},
  {id:'cafe',near:[34,-5.6],look:[32,-12],lines:["A cup of cocoa would be lovely. ☕","Best cake in town, I tell you.","Coffee and a chat: perfect."]},
  {id:'pets',near:[20,5.6],look:[18,12],lines:["Look at those puppies! 🐾","I had a cat called Marmalade.","Pets need love and a warm bed."]},
  {id:'flowers',near:[34,5.6],look:[31.5,12],lines:["Tulips! My favourite. 🌷","Flowers make every day brighter.","I'll take a bunch for the kitchen table."]},
  {id:'park',near:[-22,14],look:[-22,22],lines:["Listen to that fountain! ⛲","I sat on that bench when I was your age.","The park is the heart of our town."]},
  {id:'corner',near:[-20,-5.6],look:[-17,-9],lines:["The Flower Corner! Such a pretty garden. 🌸","Holidays bring something new here, you'll see.","I planted roses here once."]},
  {id:'bus',near:[-20,5.6],look:[-16.2,7.6],lines:["The bus to the beach! 🚌","Three days a week, if you catch it.","I like the window seat."]},
  {id:'beach',near:[75,5.6],look:[80,0],lines:["The sea is that way! 🏖️","Mind the sun, dear. A hat!","Sandcastles are for everyone, even grannies."]},
  {id:'field',near:[-25,59.4],look:[-25,66],lines:["Goal! Did you see that? ⚽","Running keeps you young.","My team always wins. Hee hee!"]},
  {id:'lake',near:[60.6,60.6],look:[69,69],lines:["The lake is so peaceful. 🌊","Ducks here too! Lucky me.","On a still day it's a mirror."]}];
function granNode(x,z){let b=0,bd=1e9;for(let i=0;i<WP.length;i++){const d=Math.hypot(WP[i][0]-x,WP[i][1]-z);if(d<bd){bd=d;b=i;}}return b;}
function granBuild(L){for(const s of GRAN_STOPS){const n=s.near||s.via;s.node=granNode(n[0],n[1]);if(s.at)s.spot=s.at.slice();else{const [nx,nz]=WP[s.node],dx=s.look[0]-nx,dz=s.look[1]-nz,d=Math.hypot(dx,dz)||1;s.spot=[nx+dx/d*.9,nz+dz/d*.9];}
    s.face=Math.atan2(s.look[0]-s.spot[0],s.look[1]-s.spot[1]);}
  GRAN.bench=BENCHES.find(b=>b.loc==='city'&&Math.hypot(b.x-32.6,b.z+36.4)<.8)||null;if(GRAN.bench)for(let i=0;i<2;i++)GRAN.bench.sit[i]=()=>granSeat(i);   /* a seat is taken while a grandma sits on it */
  for(let i=0;i<3;i++){const look=GRAN_LOOKS[i],p=bakePerson(makePerson(look));p.root.visible=false;L.g.add(p.root);
    const q={i,p,look,x:0,z:0,on:false,sitting:false,seat:0,nod:0,turn:0,bub:null,bubT:0,bi:-1,fi:-1,yaw:0};q.target={x:0,z:0,r:2.2,icon:'👋',label:'Say hi',obj:p.root,act:()=>granHi(q)};GRAN.g.push(q);}}
function buildGrandmas(L,st){for(const [hx,hz,ry] of [[13,-57.25,0],[25,-57.25,0],[37,-57.25,0],[13,57.25,Math.PI],[25,57.25,Math.PI],[37,57.25,Math.PI]]){const bx=hx+3.4;bench(st,bx,hz,ry);colC(L,bx,hz,.8);}   /* the six benches by the town houses stay, two seats each */
  granBuild(L);}
/* the walk from one stop to another: along the paths (NEXT = the next node towards a node), with the two steps off the path at the ends */
function granPath(a,b){const key=a+'>'+b;let P0=GRAN.paths.get(key);if(P0)return P0;const A=GRAN_STOPS[a],B=GRAN_STOPS[b],pts=[A.spot];
  if(a!==b){pts.push(WP[A.node]);let n=A.node;for(let g=0;g<90&&n!==B.node;g++){n=NEXT[n][B.node];if(n==null||n<0)break;pts.push(WP[n]);}pts.push(B.spot);}
  const cum=[0];for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));P0={pts,cum,len:cum[cum.length-1]};GRAN.paths.set(key,P0);return P0;}
/* the day's plan, the same on every device: a stop per grandma per 80-second turn, never further than 70 m of walking away (85 m to the pond), two
   of the three at the pond about one turn in four, no two at the same shop; seeded by the real date */
function granPlan(ms){const dayKey=Math.floor(ms/86400000);if(GRAN.day===dayKey)return;GRAN.day=dayKey;GRAN.day0=dayKey*86400000;const r=seeded(dayKey*977+13),n=GRAN_STOPS.length,N=Math.ceil(86400000/GRAN.T)+1,plan=[];let cur=GRAN.start.slice();
  const dist=(a,b)=>granPath(a,b).len;
  for(let k=0;k<N;k++){const sl=[-1,-1,-1],pond=r()<.28,stay=Math.floor(r()*3);
    for(let g=0;g<3;g++){const from=cur[g];let s;
      if(pond&&g!==stay&&dist(from,0)<=85)s=0;
      else{const c=[];for(let i=1;i<n;i++)if(i!==from&&!sl.includes(i)&&dist(from,i)<=70)c.push(i);s=c.length?c[Math.floor(r()*c.length)]:from;}
      sl[g]=s;}
    plan.push(sl);cur=sl;}
  GRAN.plan=plan;GRAN.paths.clear();}
/* where grandma g is at this moment: on her way (1.15 m/s along the turn's path) or standing at the turn's stop */
function granPose(g,ms){const k=clamp(Math.floor((ms-GRAN.day0)/GRAN.T),0,GRAN.plan.length-1),u=(ms-GRAN.day0-k*GRAN.T)/1000,stop=GRAN.plan[k][g],prev=k>0?GRAN.plan[k-1][g]:GRAN.start[g],P0=granPath(prev,stop),d=Math.min(P0.len,GRAN.SPD*u);
  let i=1;while(i<P0.cum.length-1&&P0.cum[i]<d)i++;const a=P0.pts[i-1]||P0.pts[0],b=P0.pts[i]||a,seg=(P0.cum[i]||0)-(P0.cum[i-1]||0),t=seg>0?clamp((d-P0.cum[i-1])/seg,0,1):0;
  return{k,u,stop,x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t,moving:d<P0.len-.02,arrived:d>=P0.len-.02,face:Math.atan2(b[0]-a[0],b[1]-a[1])};}
function granSeat(i){return GRAN.g.some(q=>q.on&&q.sitting&&q.seat===i);}
function granHi(q){const L=GRAN.lines.filter(x=>x!==GRAN.last),t=pick(L);GRAN.last=t;q.nod=1.2;q.turn=1.6;SFX.talk();toast('“'+t+'”',3.4);if(typeof qEvent==='function'&&cool('granhi',6))qEvent('hi');}
function granBubble(q,txt){granBubOff(q);const b=label(txt,.3);b.position.y=q.sitting?1.72:1.92;q.p.root.add(b);q.bub=b;q.bubT=2.8;}
function granBubOff(q){const b=q.bub;if(!b)return;q.bub=null;if(b.parent)b.parent.remove(b);b.material.map.dispose();b.material.dispose();}
const granH=(a,b,c)=>Math.floor(seeded(a*131+b*17+c*7+5)()*1e6);
/* 🍞 a sitting grandma tosses three crumbs to the pond; when they land, the ducks of the little pond come to them */
function granCrumbs(q){const C=GRAN.crumbs;if(!C.length)for(let i=0;i<3;i++){const m=sph(LOC.city.dyn,.035,'#f3e2b8',0,0,0,{ws:6,hs:4,ol:false});m.visible=false;C.push({m,t:0,x0:0,y0:0,z0:0,x1:0,z1:0,land:0});}
  const B=GRAN.bench,R=q.p.root.position;for(let i=0;i<3;i++){const c=C[i];c.t=.9+i*.08;c.x0=R.x+Math.sin(B.ry)*.35;c.y0=.95;c.z0=R.z+Math.cos(B.ry)*.35;c.x1=34.9+(i-1)*.35;c.z1=-36.3+((i*7)%3-1)*.3;c.land=1;c.m.visible=true;}}
function granCrumbTick(dt){for(const c of GRAN.crumbs){if(c.t<=0)continue;c.t-=dt;const k=clamp(1-c.t/.9,0,1);c.m.position.set(c.x0+(c.x1-c.x0)*k,c.y0*(1-k)+.03+Math.sin(k*Math.PI)*.5,c.z0+(c.z1-c.z0)*k);
    if(c.t<=0){c.m.visible=false;if(c.land){c.land=0;for(const d of LOC.city.ducks)if(d.pond===0){d.fed=6;d.wait=0;for(let j=0;j<6;j++)if(duckGo(d,34.9+rand(-.5,.5),-36.3+rand(-.5,.5)))break;}}}}}
function granTick(dt){if(!GRAN.g.length)return;const out=granOut()&&!!CUR&&CUR.id==='city',ms=realMs();granPlan(ms);const cam=camera.position,B=GRAN.bench;
  for(const q of GRAN.g){const ps=granPose(q.i,ms),st=GRAN_STOPS[ps.stop];q.x=ps.x;q.z=ps.z;q.on=out;q.target.x=ps.x;q.target.z=ps.z;
    const sit=out&&ps.stop===0&&ps.arrived&&!!B;q.sitting=sit;if(sit)q.seat=GRAN.plan[ps.k].slice(0,q.i).filter(s=>s===0).length;
    const near=Math.hypot(ps.x-cam.x,ps.z-cam.z),vis=out&&near<48;if(q.p.root.visible!==vis)q.p.root.visible=vis;if(!out){if(q.bub)granBubOff(q);continue;}
    const R=q.p.root,sc=q.look.scale||1;
    if(sit){const s=B.seats[q.seat],fx=Math.sin(B.ry),fz=Math.cos(B.ry);R.position.set(s.x-fx*.06,.55-.62*sc,s.z-fz*.06);R.rotation.y=B.ry;q.yaw=B.ry;q.x=s.x;q.z=s.z;q.target.x=s.x;q.target.z=s.z;sitPose(q.p);q.p.b.position.y=0;}
    else{R.position.set(ps.x,0,ps.z);let want=ps.moving?ps.face:st.face;if(q.turn>0&&!ps.moving){q.turn-=dt;want=Math.atan2(P.x-ps.x,P.z-ps.z);}q.yaw=angLerp(q.yaw,want,Math.min(1,dt*(ps.moving?8:4)));R.rotation.y=q.yaw;if(vis)animPerson(q.p,dt,ps.moving,1);}
    const h=q.p.head;if(q.nod>0){q.nod-=dt;h.rotation.x=Math.sin(q.nod*12)*.14;}else h.rotation.x*=.85;
    if(q.bub){q.bubT-=dt;if(q.bubT<=0)granBubOff(q);}
    if(ps.arrived&&near<34){const bi=ps.k*4096+Math.floor(ps.u/5.5);if(q.bi!==bi){q.bi=bi;const turn=ps.stop!==0||((Math.floor(ps.u/5.5)+q.seat)%2===0);   /* at the pond the two take turns */
        if(turn){const L=st.lines,hh=granH(ps.k,q.i,bi);granBubble(q,hh%5===0?GRAN.chat[hh%GRAN.chat.length]:L[hh%L.length]);}}
      if(sit){const fi=ps.k*4096+Math.floor((ps.u+q.seat*3)/6);if(q.fi!==fi){q.fi=fi;if(near<40)granCrumbs(q);}}}}
  granCrumbTick(dt);}"""])
E.append(["if(typeof GRAN!=='undefined')for(const b of GRAN.benches)if(b.out)add(b.b.x,b.b.z,1.0);", "if(typeof GRAN!=='undefined')for(const q of GRAN.g)if(q.on&&!q.sitting)add(q.x,q.z,.45);   /* 👵 the walking grandmas */"])
E.append(["for(const w of WALKERS)if(w.state!=='home')out.push(w.target);", "for(const w of WALKERS)if(w.state!=='home')out.push(w.target);for(const q of GRAN.g)if(q.on)out.push(q.target);"])
E.append(["  for(const w of WALKERS)if(w.state!=='home')peds.push([w.x,w.z,1.4,0]);", "  for(const w of WALKERS)if(w.state!=='home')peds.push([w.x,w.z,1.4,0]);for(const q of GRAN.g)if(q.on&&!q.sitting)peds.push([q.x,q.z,1.4,0]);"])
E.append(["  for(const w of WALKERS)if(w.state!=='home'&&near(w.x,w.z,1.5))return'ped';", "  for(const w of WALKERS)if(w.state!=='home'&&near(w.x,w.z,1.5))return'ped';for(const q of GRAN.g)if(q.on&&near(q.x,q.z,1.5))return'ped';"])
json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j8.json', 'w'), ensure_ascii=False)
print(len(E), 'edits (not applied)')
