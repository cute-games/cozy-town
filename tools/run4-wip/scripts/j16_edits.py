# Run 4, job 16 (item 29): the Tree Adventure Park. Exact-match edits for edit.py; the park's own code is j16_block.js.
import json
E = []
BLOCK = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j16_block.js', encoding='utf-8').read().rstrip('\n')
# the door (in and out), the build call, the frame tick
E.append(["DOORS.beach={city:[77.2,0,Math.PI/2],inside:[-25.5,0,-Math.PI/2]};",
          "DOORS.beach={city:[77.2,0,Math.PI/2],inside:[-25.5,0,-Math.PI/2]};\nDOORS.treepark={city:[71.6,-38,Math.PI/2],inside:[0,23.5,0]};   /* 🌲 the Tree Park's gate (run 4, job 16): in the woods behind the Toy Store; inside you start by the signs */"])
E.append(["buildBeach();buildStudio();", "buildBeach();buildTreePark();buildStudio();"])
E.append(["function updateRide(dt){const r=P.ride;if(PB)PB.root.visible=false;", "function updateRide(dt){const r=P.ride;if(r.kind==='zip'){updateCamera(dt);return;}if(PB)PB.root.visible=false;   /* 🪢 the Tree Park's zip line moves you itself (tpZip); the camera just follows (run 4, job 16) */"])
E.append(["    updatePlayer(dt);\n    fanTick(dt);", "    updatePlayer(dt);tpTick(dt);   /* 🌲 the Tree Park's floor physics (run 4, job 16) */\n    fanTick(dt);"])
# the gate in the woods east of the Toy Store (before the nature scatter, so bushes and trees keep clear of it)
E.append(["   inter(L,{x:GX-1.5,z:0,r:1.6,rect:{x1:GX-3.4,z1:-2.6,x2:GX-.2,z2:2.6},icon:'🚌',label:'Find the beach bus',act:busGate});}\n  // scatter nature along the edges of town",
          """   inter(L,{x:GX-1.5,z:0,r:1.6,rect:{x1:GX-3.4,z1:-2.6,x2:GX-.2,z2:2.6},icon:'🚌',label:'Find the beach bus',act:busGate});}
  /* 🌲 the gate to the Tree Park, in the woods behind the Toy Store (run 4, job 16): a wooden gate with a sign and a few trees; the park itself is its own place */
  {const GX=74,GZ=-38;for(const s of[-1,1]){box(st,.3,3.6,.3,'#8f6244',GX,0,GZ+s*1.9,{ol:.03});sph(st,.27,'#5fd4b0',GX,3.85,GZ+s*1.9,{ws:10,hs:8});colC(L,GX,GZ+s*1.9,.25);}
   box(st,.24,.7,4.3,'#8f6244',GX,3.0,GZ,{ol:.03});flat(st,4.4,3.2,'#d9b98a',GX-2.2,.045,GZ);
   const sg=signPlane('🌲 Tree Park',3.8,.56,'#8f6244','#ffffff');sg.position.set(GX-.14,3.35,GZ);sg.rotation.y=-Math.PI/2;L.g.add(sg);
   for(const [x,z,s] of [[76.6,-41.2,1.2],[77.0,-34.6,1.15],[70.6,-33.4,1.0],[78.2,-38.2,1.3]]){tree(st,x,z,s);colC(L,x,z,.3);}
   inter(L,{x:GX-1.6,z:GZ,r:1.8,rect:{x1:GX-3.6,z1:GZ-2.3,x2:GX-.2,z2:GZ+2.3},icon:'🌲',label:'Climb into the Tree Park',act:()=>enter('treepark')});}
  // scatter nature along the edges of town"""])
# the map, where you are, and the park's own code
E.append(["PLACES.push({id:'bus',n:'Bus stop',i:'🚌',x:-16.2,z:7.6,w:4,d:1.5,c:'#ffd9c2',door:[-14.3,5.2],flat:1,nq:1});",
          "PLACES.push({id:'bus',n:'Bus stop',i:'🚌',x:-16.2,z:7.6,w:4,d:1.5,c:'#ffd9c2',door:[-14.3,5.2],flat:1,nq:1});\nPLACES.push({id:'treepark',n:'Tree Park',i:'🌲',x:75.6,z:-40.6,w:9,d:9,c:'#9fd88a',door:[71.6,-38],flat:1,nq:1});   /* 🌲 run 4, job 16: the gate in the woods behind the Toy Store */"])
E.append(["school:'school',fire:'fire',pizza:'pizza'};", "school:'school',fire:'fire',pizza:'pizza',treepark:'treepark'};"])
E.append(["fire:'🚒 At the Fire Station'};", "fire:'🚒 At the Fire Station',treepark:'🌲 At the Tree Park'};"])
E.append(["/* ===== 📸 run 4, job 15 (item 9): the Photographer job.", BLOCK + "\n/* ===== 📸 run 4, job 15 (item 9): the Photographer job."])
json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j16.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
