# Cozy Town model pack: non-living things (31 Oct 2026, refresh book v164)

For the chat that builds the Pets and Farm Update. Made by the Non-living things models chat from the Main Book's Model Compare (tools/compare.html) after Karolis decided every non-living model.

## Files (published in the Main Book, read with Artifact read path tools/model-pack/<file>)
- model-pack.js: the model code, copied unchanged from tools/compare.html (its model scripts: game model code, rounds 2-21, ChatGPT's catalogue COZY_PET_OBJECTS) + buildPackItem(item). Loads on a blank page with only THREE r128; call initMaterials(true) first.
- pack-list.json: 112 items (31 Oct, book v162). Picked versions are expanded: one item per kept version (opts). Per item: card (Model Compare id), group, name, pick, source (claude / chatgpt), id (PU id or COZY_PET_OBJECTS key), opts, size_m, meshes, note (his comment).
- sheet-0..2.jpg: every item rendered from the pack (load check 31 Oct v162, Sonnet viewer: all 112 OK, numbers = order in pack-list.json).

## Karolis's decisions in this pack
- All 70 non-living cards are picked on their newest version (checked against each model's change time).
- "Both" (dog agility, cat tower, bunny hurdles, monkey bars, hay bale; the hamster maze was 'both' until 31 Oct): BOTH versions go into the game, as two styles (30 Oct). So these have two items: source claude and source chatgpt.
- Farm windmill: the wooden one, opts {v:'old'} ("Old and creaky, alone on the field") (30 Oct). The steel version is not used.
- Paddock = farm:fence + farm:gate (two items).
- ChatGPT only: yarn ball, feather toy, farm sign.

## New on 31 Oct
- Vet clinic (Pet clinic group, stage pfu-4): vet:clinic (outside, 2 floors, cat ears; about 10.4 x 8.9 m, door at +z), vet:room (inside: lobby + 2 vet rooms + staff corner), vet:table, vet:scale, vet:shelf, vet:counter (booking desk + treat jar), vet:bench, vet:bigtable (big-pet platform with ramp), vet:coffee (staff table, 4 seats), vet:treat. Purple/violet + butter yellow. No cages, no X-ray.
- Monkey home: home:tree opts {look:'jungle'} = the 9 m jungle giant (his pick 31 Oct).
- Backyard reference layout: yard:design opts {v:'1'|'2'|'3', items:'full', view:'yard'} (items:'empty' = what the bare level gives). Garden EXACTLY as in js/02-world.js: 6 beds (YARD_PLOTS), 30 pots (YARD_POTS, only drawn when open), shed. Pet corner x -14.4..-11.3, z -20..-22.4 (yard frame). L2: back strip to z -27.6. L3: big-needs pet area (seal pond, jungle tree, bear cave) behind a gate at x -12.4, sign "Big pets"; never the word "exotic".
- Seal pond (home:pond), bear cave (home:den), snake terrarium (home:tank, card warmtank): newest versions.
- Extra garden beds (Game rules 31 Oct): drawn in yard:design. Level 2 = a row of 3 beds behind today's beds at x -21, -18.3, -15.6, z -25.6 (save spots 36-38, left to right); level 3 = a second row at z -27.65 (spots 39-41). garden:bed at scale 1 = 1.8 x 1.2 like today's beds.
- Level 3 reaches z -35 (Map 31 Oct: Friends Lane hedges at 37.5). Gate + 'Big pets' sign at z -29, x -12.4. Big-pet area z -29..-35 full width: home:pond scale .62 at (-20.8,-32.0), home:tree look jungle at (-16.4,-32.4) (roots reach 2.5 units out), home:den scale .65 at (-12.15,-32.4), bear in front at (-12.2,-30.35). Compost bin + play corner behind the shed (x -14.4..-10.8, z -24.9..-27.4) at levels 2 and 3.
- NEW PET SHOP (picked 31 Oct, all approved): shop:building (outside, 14 x 10 units, 3 floors of 3.2, about 11.6 high with roof and sign; Map has to find the spot) and shop:room (inside, opts floor '3', pets 'no': the animals come from the Living models). One open room: open middle x -3.2..3.2, z -2..2.6 (with the shop tree from the play hill to the roof); stairs 1->2 along the left wall x -6.75..-5.15, 2->3 along the right wall x 5.15..6.75, both rising from z 4.6 to z 0.5; floors at y 0, 3.2, 6.4. Pieces: shop:pc_counter (front right), shop:dogsofa (back left), shop:catseat (back wall, under the right window), shop:playhill (middle), shop:capytub + shop:duckpond (floor 2 back), shop:tree, shop:bearlounge (floor 3 left, TV on the left wall: shows 'Cat show', later Izabele's movie), shop:sealpool (floor 3 back right), shop:monkeyframe (floor 3 front left). No pens: each animal has a home spot. Walking the stairs with no fade = Moves chat (board row objects-20261031-petshop-moves).
- SNAKE TERRARIUM (picked 31 Oct, all approved): home:tank is now adult size, 2.5 x 0.9 x 1.15 units (2.08 x 0.78 x 1.04 m), front OPEN with a low glass lip 0.2 high (the snake goes in and out; poses/paths = Living + Moves rows objects-20261031-snake-living / -moves), a half-log hide on the left (x -0.5, z 0.08) to sleep in, water bowl right. All 11 light colours approved (opts.light: day, warm, uv, cyber, pink, sun, sky, mint, lilac, coral, off); the pack lists it once with light 'day'.
- 31 Oct: every non-living model is picked, the Pet Show included.

## New in the v146 refresh (31 Oct)
- Toys: toy:frisbee (monkey) and toy:mouse (snake), picked.
- Pet Show (stage pfu-5), picked: show:podium (3 steps, 1st in the middle, step tops 0.98 / 0.68 / 0.46), show:stage opts {with:'stage'} (the stage alone, 4.6 x 1.8, top 0.5; the podium is its own item), show:license (hand-held card 0.36 x 0.24; opts lv 1-3, the pack lists level 1).
- show:judges (judges' table, 3 chairs, paddles, bell) and show:area opts {people:'no'} (the whole Pet Show layout in Cozy Park, picked 31 Oct): stage at (-36.5, 22) front toward the fountain (+x); podium BESIDE it at (-36.0, 16.9), same facing; judges' table at (-33.8, 27.3) turned toward the stage; sand show lawn ellipse centre (-35, 22), radii 5.46 x 7.8; low rope arc centre (-36.2, 22) r 5.2, angles +-0.3 pi, gap in the middle. Park tree (-37.4, 16.2) moves to (-39.2, 13.4) (Map chat confirms). Rule from Karolis: the podium must never stand in front of the stage.
- Toys: ONE model per type of toy (Karolis 31 Oct: don't clutter the game with many different balls). Ball = petball (ChatGPT version), squeaky bone = squeakybone (ChatGPT version); toy:ball and toy:bone are not used.
- shop:room: listed once (floor 3 = the whole shop); floors 1 and 2 are only views of the same room.
- Pet Shop inside (shop:room, re-picked 31 Oct, book v153): floor 3 re-laid out so a player walks to every animal with no jumping (bear lounge back-left with the TV on the back wall, seal pool back middle, monkey frame against the left wall at the front); stair inner handrails start 0.6 up (1.3 free beside the bottom step); the counter stands along the right wall at (5.5, 2.4) facing the shop and the door, shopkeeper behind it; the big tree is one tree through all 3 floors.
- Model movements fixes (picked 31 Oct, book v161): snake terrarium (branch and rock moved out of the hide, so the hide is empty for the sleeping snake); farm:trough rim 0.34 (was 0.52) so the pig can eat and drink; train:snake basket has an OPEN top (the snake rises out; the lid lies beside it); train:hamster: tubes kept EXACTLY as the Model movements tricks use them (place the hamster gear at scale 4.4, like the moves pack's HAM_MZ; Karolis 31 Oct: no animation redo), plus round elbows, a firmer tube colour, and an axle with 4 spokes on the wheel.
- Hamster wheel and tube maze: his newest pick is ONLY the Claude version (train:hamster); the ChatGPT maze (hamsterplay) is no longer in the pack.
- NEW farm:brush: Ieva's grooming brush (about 20 cm, held by the strap on its back; carry).
- NEW Stan's lesson course (Farm Lane · training field): course:flag in BOTH colours, blue and red (Karolis: both are kept, they can be used for other things later) and course:log (little log jump, 2.5 m long, top 0.35 m).

## Not in this pack
- Living models (pets, farm animals, farmers, vets, labrador): Living things models chat.

## Still game work (not model work)
- Training gear must be interactive with its animals.
- Barn must be enterable.
- Farm road turns into dirt paths inside the farm.
- Pet accessories go in the Pet Shop "Head" slot; their size_m includes the demo pet (capybara).

## Known small leftovers (minor, kept)
- Coop nesting-box lid edge reads a bit like a sliver; stable roof heavy purple, stall dividers stop short of the front rail.
