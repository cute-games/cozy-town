# Run 4, job 17 (item 32): house parties and the dance game. Exact-match edits for edit.py; the code is j17_block.js.
import json
E = []
BLOCK = open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j17_block.js', encoding='utf-8').read().rstrip('\n')
# the mailbox: mail or a party
E.append(["  yi(-15.4,-7.1,{r:1.8,icon:'📬',label:'Check your mail',act:checkMail})",
          "  yi(-15.4,-7.1,{r:1.8,icon:'📬',label:()=>S.hp&&hpOn()?'🎉 Mailbox (your party is on!)':'Mailbox: mail or a party',act:hpMailMenu})   /* 🎉 run 4, job 17: 📬 Check mail or 🎉 Host a party */"])
# what I send and what I read (optional presence fields)
E.append(["laneStamp(st);const key=JSON.stringify(st);", "laneStamp(st);hpStamp(st);const key=JSON.stringify(st);"])
E.append(["a.kn=obj(pr.kn);a.an=obj(pr.an);a.hm=obj(pr.hm);", "a.kn=obj(pr.kn);a.an=obj(pr.an);a.hm=obj(pr.hm);hpFields(a,pr);"])
# the dancers on the floor, the parties' tick, the dance camera
E.append(["mpPose(a,dt,vis,lie,d);if(vis&&!lie&&Math.hypot(a.x-camera.position.x,a.z-camera.position.z)<.6)a.av.root.visible=false;",
          "mpPose(a,dt,vis,lie,d);dnPeer(a,dt);if(vis&&!lie&&!(a.dn&&a.dn.st==='go')&&Math.hypot(a.x-camera.position.x,a.z-camera.position.z)<.6)a.av.root.visible=false;"])   # (a dancing friend stands on the floor, not in my camera: never hidden)
E.append(["updateCars(dt);mpTick(dt);laneTick(dt);", "updateCars(dt);mpTick(dt);hpTick(dt);laneTick(dt);"])
E.append(["if(r.kind==='zip'){updateCamera(dt);return;}", "if(r.kind==='zip'){updateCamera(dt);return;}if(r.kind==='dance'){dnCam(dt);return;}"])
# the host's door opens by itself during the party
E.append(["function hostCard(){if(HOST.cur||!HOST.queue.length)return;const q=HOST.queue.shift();if(!MP.peers.has(q.peer)){hostCard();return;}HOST.cur=q;",
          "function hostCard(){if(HOST.cur||!HOST.queue.length)return;const q=HOST.queue.shift();if(!MP.peers.has(q.peer)){hostCard();return;}HOST.cur=q;\n  if(hpOn()&&CUR.id==='home'&&!CUT){hostAnswer(true,true);toast('🎉 '+q.nm+' came to your party!',2.8);return;}   /* 🎉 a party: the door opens by itself (run 4, job 17) */"])
# the arrow keys during a dance-off
E.append(["  addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT'||document.body.classList.contains('away'))return;IN.keys[e.code]=true;",
          "  addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT'||document.body.classList.contains('away'))return;IN.keys[e.code]=true;\n    if(DANCE.on&&/^Arrow(Left|Right|Up|Down)$/.test(e.code)){e.preventDefault();dnPress({ArrowLeft:0,ArrowDown:1,ArrowUp:2,ArrowRight:3}[e.code]);return;}   /* 🕺 the dance-off takes the arrows (run 4, job 17) */"])
# the code, before the tree park's
E.append(["/* ===== 🌲 run 4, job 16 (item 29): the Tree Adventure Park.", BLOCK + "\n/* ===== 🌲 run 4, job 16 (item 29): the Tree Adventure Park."])
json.dump(E, open('/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/j17.json', 'w'), ensure_ascii=False)
print(len(E), 'edits')
