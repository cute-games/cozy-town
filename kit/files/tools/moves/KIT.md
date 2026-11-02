# Model movements preview kit (read first)

Folder: /tmp/claude-0/-home-claude/03bcb129-e23f-5805-992d-da53e260c961/scratchpad/mv  (run all commands from here)

## What exists
- c15.html — the newest Model Compare page (copy of the live book tools/compare.html with three.js local; c14, c13 and c12 are older) (all model builders). Global functions/objects in it you can call from your set file: PU[id].build(group, opts) (PU[id].dflt = default opts), farmAnimal(type,col,age) (returns m with groups: root, b, legs[], lower[] (cow/chicken), neck, head, tail), makePerson(look) (returns p with root, b, legs[], arms[], head), makePUPet(type,...) (pets with groups; seal: m.legs = front flippers, m.rear = back flippers), dogJoint(col) / dogPose(m,'walk'|'sit'|'sniff') (puppy with knees), petPose(puPet('bear'|'dog'|'cat',null,'adult'),'sit'|'lie'), snakeCoil(puPet('snake',null,'adult')), cow2, sheep5, stBernardStand/Side/Sleep, COWBOYS/COWGIRLS/COACHES/VETS arrays, FARM_COLS. Search c15.html with grep for a builder before using it; never read the whole file (860 KB).
- engine.js renders sheets; rig.js = baked rig (RIG.make/RIG.pose/RIG.gait) used by older clips; anim2.js = all clip sets (window.CLIPS2) and helpers exported as window.MVH. DO NOT EDIT anim2.js, rig.js, engine.js, run9.js.
- Helpers in window.MVH (read their code in anim2.js when you need details — grep "function <name>"):
  cell(label,sub,setup) where setup returns {S,C,tick(t)} (t in [0,1) over the loop);
  stage(R,{zoom,cy,yaw,pitch,g1,g2,tile}) → {S (scene with grass ground, light, shadow for R), C (camera), setDist(d) scroll ground, fit(D) make ground loop seamless}; R needs root2, L, H, W (and gets R.shadow);
  jointed('farm:cow'|'farm:sheep',{c,age}) → R {m (model groups), root2, turn (faces +x), L,H,W, rest}; jReset(R) restores rest pose each frame; jGround(R) puts the lowest point on the ground + moves the shadow; jWalk3(R,phase,A,amp) 4-beat walk with planted feet (legAng); sheepIdle; cowGrazeK(R,k);
  mk(id,o,kind,face,{rigid:true}) baked rig (kind 'human' for people) + RIG.pose(R,P) with P.hip[],knee[],ank[],hp,hy,hT,tp,ty,arm[],wing[],root{x,y,z,rx,ry,rz,piv,sq},br,floor; walkP/lieP/sitP/wag/jumpArc/spec/legAvg/petMk(pet id); personMk(id,o) (people rig); crouchP(R,k,P,lean); handW/solveArm/placeReach (put a hand on a target point); mouthW/headTopW/headBackTopW/headBoxL; fixShadow(R); floorShadow(S,x,z,rx,rz); zzz(S,x,y,z,size) sleep Zzz; propB(id,o,face) bakes a static prop (returns {root,L,H,W}); prop(S,geometry,color,x,y,z); cumOf(fn,N) normalised running sum; seg(t,a,b) eased 0→1; bell(t,a,b) 0→1→0; cl; ease; S2(x)=sin(2πx); C2; P_=π; TAU=2π; dbg(...) prints during render.
- Models face +z in c13; bake/jointed turn them to face +x. People face +x after baking.
- Model ids you may need (PU): toy:frisbee, toy:mouse, toy:ball, toy:<PU_TOYS key> (toys), show:podium, show:license, show:stage (Pet Show), farm:bucket (feed bucket), farm:trough, farm:hay, farm:fence, farm:gate, home:den, home:pond, home:tank, foodbowl {full:'1'}, waterbowl, toybox, bed {size:'s'|'m'|'l'}, train:dog|bunny|cat|hamster|monkey|seal|bear|capybara|duck|owl|snake (training gear), vet:bigtable, vet:table, vet:clinic, vet:vet {v:'mila'|'tomas'|'ruta'|'leo'} (leo = vet nurse), vet:treat, farm:stable, farm:coop, farm:eggs, farm:milk, farm:bucket, farm:horse, farm:cow, farm:chicken, farm:farmer {who:'a'|'b'} (stand-in for the player), pet ids: age:dog|cat|bunny|hamster|capybara|duck|owl|pug|pomchi|sausage {age:'adult'}, pet:bear {v:'teddy'}, pet:monkey, pet:seal, pet:snake, pet:dogjoint. Approved capybara: age:capybara {v:'real'}.

## How to add your clips
- Write ONLY your own file sets/<yourname>.js. In it: `(()=>{const H=window.MVH; CLIPS2.<setname>={title:'...',cols:2,cw:340,ch:270,frames:48,cells:[H.cell('Label','short sub',()=>{...return {S,C,tick:t=>{...}}})]};})();`
- Render: `node run9.js <setname>` → frames in fr2/<setname>/000.png… (errors print as ERR / E). 36 frames default, set frames in the set.
- GIF: `ffmpeg -loglevel error -y -framerate 12 -i fr2/<set>/%03d.png -vf "split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" -loop 0 gif2/moves-<set>.gif`
- Contact sheet to look at: `convert \( fr2/<set>/000.png fr2/<set>/008.png fr2/<set>/016.png +append \) \( fr2/<set>/024.png fr2/<set>/032.png fr2/<set>/040.png +append \) -append -resize '1800x>' chk2/<set>.jpg` then Read it (and single frames for detail).

## Karolis's rules (must hold)
- Never bend the mesh: parts move only as rigid pieces at joints (group rotations, or rig with {rigid:true}).
- Nothing clips into the ground or into props; feet on the ground; no floating or detached parts.
- One body per animal (colour variants only); use the newest models; faces visible when they matter (camera choice).
- Bad moods look clearly sad. Minimal text in labels (short label + short sub).
- Loops seamless (frame last → 0), or a clear story loop.
- Missing model → a plain stand-in clearly marked "model missing" (e.g. a box with a label), never a silent fake.
- Be strict with your own pictures: fix and re-check, max 3 passes, then list leftovers honestly.
- Before a new job: refresh c13 from the live book (Artifact read tools/compare.html, swap the three.js CDN src to three.min.js).

## Kept versions (check before using a model!)
- Many models have several versions/looks; the DEFAULT is not always the one Karolis kept. Use the kept one:
  age:pomchi {v:'game'} (today's pomchi; the 'new' one was rejected) · age:pug {v:'new'} · pet:seal {look:'spotted'} (same body, spots) · farm:coach {v:'ieva'|'stan'} · farm:cowgirl {v:'rose'} · age:capybara {v:'real'} · pet:bear {v:'teddy'} (6 kept looks).
- Check script: node audit_v.js (in the scratchpad: loads c15 + the book's cmp_picks export in db11/cmp_picks) lists every model whose default is not a kept version. Refresh db11 (ArtifactData list cmp_picks) first.
