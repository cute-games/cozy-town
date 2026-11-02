# Cozy Town model pack: living things (1 Nov 2026, v7)

For the chat that builds the Pets and Farm Update. Made by the Living things models chat from the Main Book's Model Compare (tools/compare.html), from Karolis's Keep picks.

## Files (in the Main Book, read with Artifact read path tools/living-pack/<file>)
- model-pack.js: the model code, copied unchanged from tools/compare.html (scripts 3-5: game model code, rounds 2-44, COZY_PET_OBJECTS) + buildPackItem(item, extra). Loads on a blank page with only THREE r128; call initMaterials(true) first.
- pack-list.json: 57 items from 26 Model Compare cards. Per item: card (Model Compare id), group, name, id (PU id), opts (the kept version), ages and colours (the game picks one: buildPackItem(item,{age:'baby',c:item.colours[1]})), status, note, his_note, size_m (at adult), meshes.
- sheet-0..1.jpg: every item rendered from the pack (load check, Sonnet viewer: all 57 OK).

## Karolis's decisions in this pack
- Monkey: 8 kinds kept (golden spider monkey dropped).
- Bear: all 6 kept. Capybara: ONE body, 7 faces (incl. Sauna zen for training), colours only.
- Farm animals: only Baby or Adult; a baby never grows up (foal, calf, lamb, piglet, chick = age baby).
- Farm dog = St. Bernard: asleep curled, asleep on its side, standing (walks between spots).
- Farmers: Hugo, Fern, Grandma Ona, Jonas. Vets (names from Karolis's Story pick, 31 Oct): the vet is Dr. Rūta (older, round glasses; Karolis 1 Nov: not Dr. Fern); the lobby nurse is Nurse Penny = Mila's model (white coat, clipboard); Dr. Tomas and Vet nurse Leo stay as staff. See game_name in pack-list.json.
- Riding: instructor Ieva and Stan; trail riders Cody, Hank, Rose. Riders use RIDE_POSE inside riderOn().
- Cow, chicken, St. Bernard and the jointed puppy have pivot groups for moves (legs[] + lower[], neck, head, tail). See board rows to moves.

## Picks since v1 (31 Oct)
- Seal: Spotted harbour seal kept (Round dropped). Pomchi: today's game pomchi kept.
- Sheep: more wool (his note), round 41. Kept.
- Pug: New pug, face fixed (nose and mouth, no rings), round 41. Kept.
- All living models are decided. Nothing waits.
- Cow: neck is now a round tube, still hidden at rest (no change to the look).

## Poses and joints for other chats (round 42, in model-pack.js)
- petPose(m,'sit'): any four-legged pet sits on its bottom (bear on the Pet Shop sofa). petPose(m,'lie'): lies on its belly (dogs, cats on beds and sofas). Adds hip joints m.hips; puts the lowest point on the floor.
- Sheep: m.neck, hidden in the wool at rest. Graze: m.b.rotation.x=.15; neck.position.z+=.3, y-=.12; neck.rotation.x+=1.6; head.rotation.x+=.4 (muzzle reaches the grass).
- Snake: snakeAlong(m,pts,start) lays the body along a path (slide start to slither in/out over the terrarium lip); snakeCoil(m) = asleep, two rings, head on top (about 0.6 units across).
- Card in Model Compare: "Pet poses" (pet:poses). Karolis kept all 4 for this update; bear poses get fixed after the update.
- Duck and owl (round 43): m.wings[0] left, [1] right, hinged at the shoulder; flap = rotation.z (left +, right -).
- Pomchi (round 44): today's pomchi tail moved down onto the rump (it floated about 9 cm above it).
- Snake (round 43): m.tongue, hinged at the back of the mouth; flick = scale.z from 0 (hidden) to 1.

## Not in this pack
- Size lineup card (reference only). Mood effects: in the non-living pack (tools/model-pack/).
- Puppy jointed test: in the pack as a movement test, not a new pet.
