# Cozy Town moves pack (31 Oct 2026, round 4: show staff, c15 tank, c15 Pet Shop)

`moves-pack.js` is one plain script with no imports. It defines `window.COZY_MOVES`, which turns every approved movement into rotations and positions of the model's own groups. It never bends a mesh. Load it after three.js and before the game files that animate (for example, in the same place as `js/01-models.js`).

## How to call it from the game loop

```js
// once per model (optional; play() does it on first use). kind = the real animal: petKind(d) for pets
COZY_MOVES.core.rig(pet.m, {kind: petKind(pet.d)});
// every frame, instead of animPet(p, dt, moving, spd):
const r = COZY_MOVES.play(pet.m, pet.move, now - pet.moveStart, {dist: pet.walked, mood: pet.mood});
if (r.done && !r.hold) pet.move = pet.moving ? 'pet.walk' : 'pet.idle';
```

- `play(model, name, t, opts)`: `t` is the number of seconds since this move started. Each frame, play() does four things in order: (1) resets the model to its rest pose, (2) runs the move, (3) puts the lowest point on the floor (`root` y = floor), (4) adds `r.lift` for jumps. It returns `{lift, done, hold, noGround, ...}`.
- Walking: pass `opts.dist`, the total metres this model has walked. The phase is distance divided by stride, so feet do not slide. Without `dist`, it uses `t × steps per second`.
- `opts.mood`: `'sad' | 'sick' | 'happy'` on `pet.walk`. `opts.kind` overrides the type. The game's capybara, duck and owl are saved with base types (hamster, bunny, cat), so always pass `petKind(d)`.
- Replacing `animPet`: call `play(m, moving ? 'pet.walk' : 'pet.idle', t, {dist})` at every place that calls `animPet` now (03-game.js lines 540, 1495, 1598; 09-mainloop.js line 356). The Pet Show (`psTrickAnim` / `psPetPose`) can keep its own code or call these moves.
- People: `play(p, 'person.walk', t, {dist})` replaces `animPerson`. Keep `p.wave` (`animPerson`'s wave) as it is, or run it after play().
- Rider: play the horse first, then `play(rider, 'person.ride', t, {horse: horseModel})` in the same frame. The rider follows the saddle (bob, posting in the trot, leaning in the gallop and the jump).
- Friends online: send `{move, start}` (the name and the start time, on the shared clock) plus `dist` for walks. Each friend calls `play` with `t = now - start`, so the same moves show on every screen. This needs no animation data on the network.
- Slopes: pass `opts.slope = {pitch, roll}` (radians; + pitch = the ground rises ahead, + roll = it rises to the model's left). play() tilts the body to the slope and puts it on the sloped floor. Use it for the play hill (bunny, hamster), the seal's chute and the duck's ramp.
- Props are the game's, never the pack's: bowl, gear, table, card, podium, tub, chute, bars, ball, Zzz. Moves take what they need as opts (`target`, `h`, `height`, `pts`, `jumps`, `gap`) and some return where a prop goes (`r.ball`, `r.card`, `r.hit`, `r.speed`, `r.sink`, `r.bar`).
- Cost: the ground fix measures real vertices, so it is exact (rotated spheres would float on a box). Passing `{fast:true}` uses bounding boxes instead, which costs less and floats slightly. With many animals, run the ground fix only on near ones, or every 2nd frame.

## Moves and what triggers them (game rules)

The length is in seconds. "loop" means it repeats until the game changes the move. "hold" means it stays in its last pose.

| Move | What it does | Game trigger |
|---|---|---|
| pet.idle / pet.walk | breathe, look around / per-type gait: dog and cat walk, bunny bound, duck waddle, owl hop, hamster scurry, capybara and bear heavy walk, pig trot, seal galumph, snake slither | moving or not |
| pet.unhappyBowl (4, hold) | sniffs the bowl, sits by it, head low | happiness low (the one need): walk to the bowl first |
| pet.unhappyPlay (loop 3) | play bow, two hops | happiness low: bring a toy first |
| pet.unhappyNap (4, hold) | big yawn, lies down, slow breathing | happiness low: tired |
| pet.unhappyNudge (loop 3) | looks up at you, nudges twice | happiness low: follow the owner with pet.walk, then this |
| pet.veryHappy (loop 2.4) | two big jumps, the second with a spin | very happy |
| pet.happyDance (2) | wiggle and two small hops | favourite food (plays the very-happy move) |
| pet.sad / pet.walk {mood:'sad'} | head and tail low, sighs / half-speed legs | sad mood |
| pet.sickWalk, pet.sickLie, pet.sneeze (1.2) | droop, slow walk, lies a lot, sneezes (sickLie sneezes every 6 s) | sick: only after being very unhappy for a long time |
| pet.warnSneeze (1.4) | a healthy sneeze and a head shake | now and then before getting sick |
| pet.nap (hold) | turns once, lies down, curls up, breathes slowly | tired, or the owner sleeps (walk to the bed first). Naps make pets happier |
| pet.eat (loop 1.6) | head in the bowl, chews | eating |
| pet.sit (hold) | sits | general |
| bear.sitUp, bear.roll | sits on its bottom with paws dangling; rolls on its back, paws paddle | idle / very happy |
| seal.galumph, seal.swim, seal.ball, seal.clap | flops on land; sculls in the pond (no ground fix); ball on its nose with claps; clap | moving / in the pond / ball stand / very happy |
| monkey.climb, monkey.happy | upright on the trunk, arms reach and pull (the game moves it up, `climbRate` m/s); bouncy hops, tail up | climbing tree / very happy |
| snake.slither, snake.coil, snake.lookUp | S-wave / spiral rest / head lifts | moving / under the tank light / attention |
| farm.walk, farm.lookAtYou | gait for cow (knees and hocks), sheep, pig, farm dog / head turns to the player | moving / player close (`opts.look` = the angle) |
| cow.graze (loop 6), cow.stand (loop 6) | neck slides out and down, bites, tears, chews, one step (`r.step` = how far the game may move it) / chews cud, looks around, tail swat | grazing spot / idle |
| sheep.look, sheep.lambHop | after stopping: looks around, breathes, tail wiggle / lamb pronks | flock stops / lamb near its mum |
| chicken.walk, chicken.peck (loop 3), chicken.run | head holds still then jerks forward / scratches, steps back, pecks 3× / scatters | moving / idle near the coop / player runs past |
| pig.root, pig.roll (loop 3.2) | nose in the ground / two full rolls in the mud | idle / mud spot |
| horse.walk, horse.trot, horse.gallop, horse.jump (1.6), horse.idle, horse.refuse (2) | gaits with planted hooves; jump: gathers, front then back legs lift, lands; tail swish; stops and tosses its head | joystick or W+Shift / Space or the jump button / near town |
| farmdog.sleep, farmdog.lie | slow breathing (one breath per 3 s) on the sleep models / the standing model lies down | sleeping spot |
| person.walk, person.idle, person.ride, person.crouch | arm swing / seated on the horse / lunge crouch | |
| coach.point, coach.whistle, coach.cheer | points at the jump / hand to the mouth / both arms up, hops | coaches at the jump field |
| vet.listen, vet.check, nurse.treat (3) | leans in with a hand to the chest / both hands at the head / crouches and holds the treat out low | vet visit; after the treat, the sick look ends (game switches move) |
| cow.graze (loop 6) **updated** | neck slides out .45 (was .35), body tilt solved so all 4 hooves stay down, neck turned .4 less, muzzle solved to just touch the grass; bites, tears, chews, one step, looks round. `r.step` = m/s to move forward during the step | grazing spot · grazeNecks |
| seal.galumph, seal.swim, seal.ball, seal.clap **updated** | new flippers (m.legs front, m.rear back): bunch and push with a surge; scull with tail + back flippers, front flippers steer (`r.sink` .32: root = water − .32); sits up, ball on the nose, claps once a second (`r.ball` = ball centre, root frame); clap uses solved open/closed flipper turns | land / pond / ball stand / very happy · sealNew |
| pet.eat (loop 1.6) **updated** | `o.h` = bowl rim height (m): body tips over the front legs, head goes down until the muzzle is at the rim (solved), chews. Without `o.h`: the old head-down | eating · petEat |

### Round 2 (31 Oct): moves from the approved previews

| Move | What it does | Length | Game trigger | Preview |
|---|---|---|---|---|
| sheep.graze | neck slides out of the wool and down (no body tilt, neck turn −.3, lamb −.4), muzzle solved to touch the grass; bites, tears, chews, lifts, looks round (`o.side`). Lamb: `o.lamb` or a scaled sheep | loop 6 | grazing spot | grazeNecks |
| snake.path | lays the whole body along `o.pts` (root-frame floor line, m, head end last), follow-the-leader with the c13 spacing; head at `o.s` (or `o.s0 + o.speed·t`); tongue flicks; `done` at the path end | loop | out of / into the terrarium, any route | snakeTank |
| snake.sleepHide | lies stretched at the path end (`o.s`, default the end: in the half-log hide), eyes shut (lids), breathing wave, head bob. No `o.pts`: sleeping coil | hold | asleep | snakeTank |
| snake.look | head and neck up, looks left and right, tongue flicks (on the path at `o.s`, or in place) | loop 4 | stops outside, curious | snakeTank |
| snake.basket | rises out of the basket and sways to the flute (root = basket rim centre) | loop 4 | yard gear | yardGear |
| person.stairs | hops each step with both feet (no knees); feet land on the tread tops, whole foot on the tread | loop | on a flight | shopStairs |
| pet.stairs | front paws hop up together, then the back paws; body tips with the stairs; rears up / lifts its rump so the body clears each step (paws come off the tread for that moment). Duck/owl: hop like people | loop | following up/down a flight | shopStairs |
| pet.lie | lies (petPose 'lie' angles; a petPose-posed model is used as is), chin resting low on the paws (`o.nap:false` = head up), slow breaths, tail thumps twice | loop 5 | sofa, bed, window seat | shopSpots |
| cat.window | lies, looks out of the window and back (`o.side`), tail swishes | loop 5 | window seat | shopSpots |
| bunny.hillHop, hamster.run | pet.walk (bound / quick scurry with bob) for the play hill; pass `o.slope` from the hill | loop | play hill (route = game) | shopSpots |
| capy.tub | soaks to the chin: legs tucked, slow bob, head sway, eyes half shut with two slow blinks (pack-added lids). No ground fix: root = the water surface (`o.chin` = water line below the chin, .02) | loop 5 | warm tub | shopSpots |
| duck.paddle | sits on the water (legs tucked), dips its head under twice (body tips, tail up, wings lift), tail wag. `r.sink` .15 | loop 5 | pond | shopSpots |
| owl.perch | blinks (eyes squash), turns its head right round, wing shuffle (wing pieces turn at the shoulder) | loop 5 | branch / perch (root = branch top) | shopSpots |
| bear.tv | sits back (petPose 'sit', or the same angles on an unposed bear), laughs twice: bounces, leans back, head thrown back and wobbling, slaps its paws | loop 5 | shop sofa + TV | shopSpots |
| seal.slide | flat on its belly, front flippers back, head up (with `o.slope` = chute) | hold | sliding down the chute | shopSpots |
| monkey.bars | hangs, swings hand over hand along the bars, turns on the last bar, swings back. Root = bar 0 grip point facing along the bars; `o.gap` (.34), `o.n` (3), `o.swing` (.58 s), `o.turn` (.78 s); `r.bar`, `r.hand` | loop 2(n·swing+turn) | shop climbing frame, yard bars | shopSpots, yardGear |
| bear.denNap | lies down, head low and to the side, slow breathing | hold | den (walk in = game) | petsHome |
| seal.nap | flat by the pond: chin down, head aside, flippers out flat, slow breathing | hold | by its pond | petsHome |
| pet.takeFood | leans up to the hand, takes, chews, steps back; then play pet.happyDance | 2 | favourite food from the hand | petsHome |
| person.offerFood | crouches, hand out low to `o.target` (root frame, m) | hold | feeding by hand | petsHome |
| dog.agility, bunny.hurdles | gallop (dog) / bound (bunny) with a jump over each `o.jumps=[[at,height],…]` along `o.dist` | loop | agility course, hurdles | yardGear |
| cat.wand | crouches (tail twitch), sits up, swats with one paw then the other; `r.hit` for the wand prop | loop 4 | wand tower | yardGear |
| hamster.wheel | runs in place; `r.speed` (m/s) → the game turns the wheel by speed/radius | loop | wheel | yardGear |
| bear.logPush | walks (o.dist, backwards too) with the body tipped up and front paws on the log (`o.reach`) | loop | log / tyre | yardGear |
| capy.hopIn | crouches, hops over the rim (`o.height`), then capy.tub | 1.2 | warm bath | yardGear |
| duck.splash | hops into the tub, wings flapping; then duck.paddle (ramp walk = pet.walk + `o.slope`) | 1 | ramp and splash tub | yardGear |
| owl.fly | flight pose: body tipped forward, legs back, head up, wings flap (`o.glide`: still). No ground fix | loop | hoops course (path = game) | yardGear |
| pet.wait | sits (seal: lies flat), looks around, sighs twice, looks at the door (`o.look`) | loop 6 | waiting outside / at the stable | waitOutside, farmChores |
| pet.waitLie | lies down with a sigh; `o.perk` 0..1 lifts head and ears when you come back | hold | waiting long | farmChores |
| pet.greet | two hops and a happy wag (seal: head up, flippers wave) | 1.6 | you come back | waitOutside, farmChores, license |
| pet.climbOn | front paws up, then the back, body lifts to `o.h`; afterwards the game puts the root on the table | 1.4 | onto the vet's big table | vetBig |
| pet.vetNervous | lies on the table, trembles, head low, watches the vet (`o.look`) | loop | vet visit | vetBig |
| pet.takeTreat | head forward to the treat, chews, then happy | 2.4 | nurse.treat | vetBig |
| person.giveCard | Sir Barkley takes the card out, holds it out to `o.target`, lets go, claps; `r.card` 'hand' → 'given' at 1.84 s | 4 | license on the podium | license |
| person.takeCard | reaches to `o.target`, takes it, holds it up high, cheers with two hops | 3.6 | license | license |
| person.reach | bends (deeper for a low target) and reaches one hand (`o.hand`) to `o.target` | hold | eggs: nest box, then basket (turning = game) | farmChores |
| person.milk | deep lunge by the cow, both hands toward `o.target` (udder), squeezing in turn; the cow plays cow.stand | loop | milking | farmChores |
| horse.overGate | head down over the stall gate, looks round, tail swish | loop | in its stall (walking there = horse.walk + game route) | farmChores |

### Round 3 (31 Oct): Pet Show tricks, toy play, farm feeding and petting (models: c14)

**Tricks.** One API: `play(m,'trick',t,{kind, trick, gr})`. `trick` = an id ('highFive'), an index 0..2 or the game's label ('High five'); `kind` = `petKind(d)`; `gr` 0 oopsie (wobble, 2 s), 1 good, 2 perfect (= `big`: higher jumps, more turns). Each trick is also a named move `trick.<kind>.<id>`. `COZY_MOVES.TRICKS[kind]` = `[[id, label] ×3]` (starter, gear trick, third); dog, pug, pomchi and sausage share the dog set. A trick lasts 5 s (`COZY_MOVES.trickLength(kind,id)`; monkey bars 6.2 s), then `r.done`. The pet starts at the root, facing +z; gear tricks move the body away and bring it back to the root. `COZY_MOVES.trickGear(kind,id)` = where the game puts the gear in that frame: `{id, scale, x, z, rotY, h?}`.

| Pet | starter · gear trick · third | Notes (gear) | Preview |
|---|---|---|---|
| dog / pug / pomchi / sausage | highFive (sits, paw up, two taps) · agility (gallops round two bars, jumps each) · rollOver (lies, rolls over its back and back) | train:dog 1.25 | tricksA |
| cat | spin (rears up, pirouette) · tower (onto platform 1, round the pole to 2, leaps down, walks back) · highFive (paw wave) | train:cat 1.6 | tricksA |
| bunny | bigJump (hop with a twist) · hurdles (three hurdles, turn, back) · spin (hop spin) | train:bunny 1.3 | tricksA |
| hamster | spin (two tail-chase circles) · maze (low tube, up the riser, peeks out, back) · rollOver (ball roll) | train:hamster 4.4; `r.inside` = in a tube (hide its shadow) | tricksA |
| capybara | dance (slow sway, feet in turn) · bathSpin (lies in the water, paddles round once; root = bath centre, `o.water` .574) · rollOver | train:capybara 1.35 | tricksA |
| duck | dance (waddle, wings flap) · bigJump (wings flap) · spin (waddles round, wings out) | c14 m.wings | tricksA |
| owl | headTurn (head right round both ways, blinks) · perchHop (hops along the perch and back, wings open; `o.h` 2.55) · spin (hop spin, wings open) | train:owl 1.7 | tricksB |
| monkey | clap (sits, solved paws clap) · bars (monkey.bars with `swingBack`: 4 rungs .3 apart, swings out and back facing the same way; root = rung 0 grip) · flip (back flip, two happy hops) | train:monkey | tricksB |
| seal | clap · ballNose (bumps the ball up, balances it, tosses it back; `r.ball` = the gear's origin, `r.ballRot`) · rollOver | train:seal (the ball) | tricksB |
| bear | wave (sits up .7, waves the far paw) · logWalk (along the log, hop-turns; `o.h` .8) · rollOver (paws paddle) | train:bear 1.6 | tricksB |
| snake | sway (rises from its coil, sways, tongue) · basket (rises out of the basket, the body below the rim hidden; `o.h` .624) · coilSpin | train:snake 1.3 | tricksB |

**Replacing psTrickAnim** (js/07-designer.js): keep `psPose` (puts g at the stage spot); then, instead of `psTrickAnim(g,m,type,tk,gr,u,BY,face,fx)`, call `const r=COZY_MOVES.play(m,'trick',u,{kind:type,trick:tk,gr})` and place the gear once from `trickGear` (a child of g, so it turns with the pet). The round needs `trickLength` seconds, not 1.1 s: wait for `r.done`. The show's trick list (TRICKS, 6 shared) becomes `COZY_MOVES.TRICKS[petKind(d)]` (3 per type). The 🙌 float text can stay on the game side (show it at u ≈ 1.9 s for highFive).

| Move | What it does | Length | Game trigger | Preview |
|---|---|---|---|---|
| monkey.frisbee | sits up, throws, gallops round a circle (r .55 about the root) after it, catches, claps. `r.frisbee = {p, q}` root frame: the game draws toy:frisbee there | 5 | Play (monkey) | toyPlay |
| seal.toyBall | sits up, the ball bounces three times on the nose tip, rests there while it claps. `r.ball` = toy:ball (2.2) centre, `r.ballRot` | 5 | Play (seal) | toyPlay |
| bear.squeaky | sits, squeezes the bone between its front paws twice, rolls back happily. `r.toy = {p, q, scale}` (toy:bone at 2.1 × scale) | 5 | Play (bear) | toyPlay |
| snake.mouse | slides up, flicks its tongue, noses the mouse, coils round it, head up, uncoils. The mouse at the root, turned `o.mouseYaw` (−.5); `r.mouseRock` | 5 | Play (snake) | toyPlay |
| person.pourBucket | pail in the left hand: lifted out to the side, over the top, tipped over the trough, back. `r.hand`, `r.tip`, `r.pour` | 2.4 | fill the trough | farmFeed |
| person.scatterGrain | pail held in front, dips and throws three times, watches. `r.hand`, `r.throwHand`, `r.release` (0..2) | loop 3 | feed the hens | farmFeed |
| person.handFeed | crouched with the hand in the pail, stands, flat hand out to `o.target`, back. `r.hand`, `r.offer` | loop 6 | feed the horse | farmFeed |
| person.pat | hand to `o.target`, three soft pats (`o.side` for a face, `o.crouch` for low animals) | loop 2 | pet an animal | farmFeed |
| farm.troughEat | cow or sheep: head into the trough (muzzle solved to `o.h`, .55), chewing nods | loop 2 | eating at the trough | farmFeed |
| pig.bucketEat | snout in the held pail, nods, tail wiggle | loop .75 | pig fed from the pail | farmFeed |
| chicken.grainPeck | quick pecks, beak solved to the grain (`o.h` .026) (run up = chicken.run + route) | loop .375 | grain on the ground | farmFeed |
| horse.handEat | head down to the hand, nibbles, up, chews, tail swish. `r.lips` | loop 6 | fed from the hand | farmFeed |
| cow.patLean, sheep.patLean, chicken.puff (1.5) | leans in, head up to the hand, tail swish / leans in, fast tail wiggle / feathers puff up 20 %, shake | loop 2 | patted | farmFeed |

Model notes (c14): the c14 bear's legs pivot at the foot; the pack hangs each on a hip joint at the top of the leg once (like c14 petPose; a posed model's own `m.hips` are used), so every bear move swings its legs from the hip. Duck and owl wings are `m.wings` (open = `rotation.z` by sign(x)·a: wings[0] negative); the snake tongue is `m.tongue` (flick = scale.z 0→1→0). The round-2 moves now use them too.

### Round 4 (31 Oct): show staff, the c15 terrarium and the c15 Pet Shop (models: c15)

| Move | What it does | Length | Game trigger | Preview |
|---|---|---|---|---|
| person.groom | faces the horse's side (`o.dist` .3 from the brushing shoulder), long strokes along the hair, 3 per 6 s, brush lifted on the way back; leans in a little. `r.brush = {p, q}` (the hand, root frame m): the game draws the brush there. **The brush model is missing** (the test uses a plain stand-in box) | loop 2 | Ieva grooms a horse at the stable | showStaff |
| horse.groomed | stands calm: tail swish, weight shift, turns its head toward the groomer (`o.look`, rad) and back | loop 6 | being groomed | showStaff |
| person.talk | small nods, one hand gestures (the game turns the root to the listener) | loop | talking | showStaff |
| coach.directTo | turns toward `o.target` (root frame m), talks, points at it with the arm on that side, turns back | 4 | Ieva sends you to Stan at the jump field | showStaff |
| person.giveCard **updated** | Sir Barkley (a person in a top hat, on podium step 2): card out, held at the chest, held out to `o.target` (the meeting point over the step edge), let go at 1.25 s, claps. `r.cardPose {p, q}` while in his hand; `o.hand` | 4 | license | showStaff |
| person.takeCard **updated** | the player (on step 1): reaches to `o.target`, takes the card, holds it in front of the chest (the hand on its lower corner), cheers with the other arm, two small bounces; `o.showTo` = where the audience is (root frame m): the card is held and turned toward it. `r.cardPose` | 3.6 | license | showStaff |
| snake.sleepHide **updated** | with the c15 tank path the path ENDS in the c15 snakeCoil spiral inside the widened hide (two rings round (−.6, .06), inner ring raised .13, outer ring over the rock): asleep coiled, head on top, breathing lifts only | hold | asleep | snakeTank |

**Pet Show podium (c15 `show:area`, world metres):** the stage is at (−36.5, 22), top .56 (its steps run down toward +x along z 20.5); the podium stands beside it at (−36.0, 16.9), both facing the fountain (+x). Step 1 (winner) top .98, the player stands at (−35.85, 17.12) facing (.6, .8); step 2 top .68, Sir Barkley at (−35.86, 17.86) facing (.6, −.8); the low box in front is .18 high at (−35.13, 16.9) (hop onto it, then up). The card is `show:license` {lv}: its origin is the card's lower middle; the preview turns it toward the camera. The route (walk, hop up, hop down) is the game's; the hand-over meeting point is between the two near shoulders, about .28 toward +x and .2 lower.

**Terrarium (c15 `home:tank`):** `COZY_MOVES.examples.tankPath()` is the c15 path, in the tank's own frame (put the snake's root at the tank's origin with the tank's turn): out over the lip in a clear arch (body bottom ≥ .32 above the .29 lip), clear of the corner posts and rails (packTest6 checks: 0 mm into the lip, rails or posts), a round in front, back in, into the hide (r .44, axis x −.6, z −.25..+.41), ending in the coil. `out` = [asleep, outside], `in` = [outside, coiled]; `sleep` = the path end.

**Pet Shop (c15):** stairs: 14 even steps per flight, rise .2386, run .2929 (now the defaults of person.stairs / pet.stairs / `stairH`); flight 1→2 at x −6.75..−5.15, z 4.2 → .1 (floor .08 → 3.42), flight 2→3 at x 5.15..6.75 (3.42 → 6.62); the handrail starts .6 up. The dog follows on the same flight 1.4 m behind the player and never closer than .3: the game passes the dog `dist = playerDist − 1.4`. Owl: on the `shop:tree` perch plank, at radius .83, angle .3 round the trunk, plank top ≈ 4.24 m; root there, facing the room (yaw = atan2(−cos .3, −sin .3) + π/2). Seal pool (`shop:sealpool`, bigger): deck top 1.68, water .56, slide from (−1.8, deck) down at .641 rad (atan(1.12/1.5)), 1.87 long, along z −.6: play seal.slide with `o.slope = {pitch: −.641}` going down, seal.galumph with `{pitch: .641}` coming up, seal.swim in the water (root = water − .32).

Stairs contract: the game moves the root along the flight (model +z), keeps `root.y` at the floor where the flight starts, and passes `o.dist` (m from the first riser), `o.rise`, `o.run`, `o.n`, `o.down` or `o.h(d)`. `r.floor` = height under the walker; switch back to pet.walk/person.walk after the last step and set root.y to the new floor. `COZY_MOVES.stairH(o,d)` gives the same heights.

Example snake path (the c13 terrarium, PU['home:tank'] built as is, snake root at the tank origin, unturned): `const T=COZY_MOVES.examples.tankPath();` → `T.pts` (floor line: gravel .18, arch over the .29 lip, room floor), `T.out=[asleep, outside]`, `T.in=[outside, in the hide]`. Out: `play(snake,'snake.path',t,{pts:T.pts, s:T.out[0]+(T.out[1]-T.out[0])*k})`; look: `snake.look` with `s:T.out[1]`; in: same with `T.in`; sleep: `snake.sleepHide` with `s:T.in[1]`. Its control points (x,z): the inside loop `[1.03,.10]…[-.45,.305]` (in front of the hide), out `[-.45,.45]→[-.45,1.20]→[.29,1.94]→[1.03,1.20]→[1.03,.30]`, back in along the same inside loop to `[-.45,.40]`; smoothed with centripetal Catmull-Rom, 40 points per segment.

The core is in `COZY_MOVES.core`: clock, ease, seg, bell, arc, legAng (planted-foot leg angle), swingK, rig, reset, ground, boxIn, stride, rotAbout, solveTilt, aimArm, wag, tailUp, headDown, breathe, and (round 2) slopeGround, lids, blink, wingTurn, poseLie, poseSit, pathOf/pathAt/snakePlace, muzzleSolve.

Round-2 additions to the model: for capy.tub and snake.sleepHide the pack adds eyelid pieces once (head-coloured, hidden, never grounded). Owl blinks squash the eye balls; duck/owl wings, the snake tongue and the eye pieces are turned or moved as rigid pieces and put back by reset. A petPose-posed model (m.hips, m.sitPivot) works: the ground fix moves sitPivot when the body hangs under it.

## Not covered, or needs a model change

- **Knees** bend only on models with `lower[]`: dogJoint, cow2, chicken2, stBernardStand. The game's current pets, sheep5, the pig, the bear, the monkey and horse5 have one-piece legs. They swing from the hip, so a swinging foot can brush the ground mid-step. The horse also lost the 3-joint legs of the preview (baked rig). The Living chat's pack would need `lower[]` on the horse and pets to get that look back.
- **Knee direction:** the pack bends front knees with the foot going back and hind hocks with the foot going forward (the real-life way). The approved cowsJ preview bent the cow's hind legs the other way. Look at this once on the cow.
- **Stairs:** the approved preview walked with knees (baked rig). Without knees a person cannot stand on two treads at once, so person.stairs is a two-foot hop per step (feet land on the treads, nothing sinks). The small dog's stiff legs are about as long as a step is high: it tips steeply (up to ~50°), rears up at the first step and its whole body is in the air for a moment (max 19 cm). Paw corners touch a riser by up to 5 mm. NOT the preview's look: needs knee groups.
- **Horse grazing** needs a neck group: horse5's neck block is not exported as a group, so its head cannot go down to graze. (Sheep and cow graze now.)
- **Chicken wings:** the wings are not groups, so "run and flap" has no flapping.
- **People** have no knees, waist or elbows. Every crouch (person.crouch, vet.listen, vet.check, nurse.treat, person.offerFood, person.reach, person.milk, person.handFeed, person.pat) is a small lean from the hips (60 % of the old one) with a wider stance that lowers the hips a little, and the head turns back up to look ahead. Without knees the body cannot go lower. Crouch, reach, offer food and milking are a lunge with the body leaning from the hips. Hands cannot reach the floor, the nest boxes low down or the cow's udder: the arm points at the target and stops short (milking: the hands reach the cow's flank). Rider hands and reins are missing in the model.
- **Snake:** its tongue flicks (round 2). The tank path is an example made for the c13 tank built as is; another tank size needs its own points. The c13 sleeping coil (.71 across) does not fit the hide, so it sleeps stretched (as approved).
- **Farm dog sleep models** (curled up, on its side) have no head or tail groups: only breathing works.
- **Duck dip:** the duck has no neck; its head turns 1.7 rad on its own pivot, so the dip reads as "head down" more than the preview's tail-up dabble. Owl/duck wings turn about a guessed shoulder (.13 above the wing centre).
- **Props and places** are the game's: podium, license card, ball, bowl, treat, tub water, chute, bars, hill, stall gate, Zzz. Routes (farmers, riders, the walk to a bowl, bed, den or stall, walking in and turning round, following you, the flock), moving the cow forward in its step, and switching moves are game logic.
- **Tricks without knees:** tricksA was made on the baked rig (knees). The game pets swing their legs from the hip only, so tucks, the sit and the high-five paw are stiffer; the dog's raised paw hides behind its big head from the front. The bear's waving paw and the cat's paw wave read weakly from the front (the paw is in front of the chest). The oopsie is short (about 2 s).
- **Horse eats from the hand:** horse5 has no neck group; its head group (with the neck) turns at most 1.1 rad, so the lips only come down to about 1.6 m and the head looks raised, not lowered as in the preview. Needs a neck group.
- **Farm props** (trough, feed layer, grain, pail, its hinge, milk) are the game's; the moves return the hand points and tip angles.
- **Faces** (sad or sick mouth, tears, capybara moods) are model and face swaps, not moves.
- **Verified in pictures:** every move in the table is now in a test cell (packTest to packTest5). Shown without their props (the game's): seal.ball (no ball), monkey.climb (no trunk), pet.climbOn (no table: it ends in the air at `o.h`), owl.fly (no flight path), person.reach / offerFood / pat (arms point at a target; no knees). NOT VERIFIED: the baby moves (foal frisk, calf skip, piglet zoomies): they are not separate functions (pet.walk / farm.walk on the baby model + sheep.lambHop or pet.veryHappy), and how the bear's and cat's waving paw reads from the game's camera (from the front it is beside the chin, small).

## Test

`movespack/build.sh` builds `mv/sets/zpackTest.js` (pack + zpackTest.body.js = round 1, 12 cells) and `mv/sets/zpackTest2.js` (zpackTest2.body.js = round 2, 16 cells: sheep and cow graze, snake tank path, stairs up and down (person + dog), bear TV (posed model), seal chute, monkey bars, dog agility, milking, license hand-over, capybara tub, duck pond, owl perch, dog lie + cat window, bowl eating), then `mv/sets/zpackTest3.js` (zpackTest3.body.js = round 3, 20 cells: a gear trick per pet type (dog agility, cat tower, bunny hurdles, hamster maze, capybara bath spin, duck big jump, owl perch hop, monkey flip, seal ball on the nose, bear log walk, snake basket, dog high five, each with its gear from trickGear), the four toy plays, trough (pour + cow + sheep), grain (scatter + three hens), hand feed (person + horse), pat (person + cow)), then `mv/sets/zpackTest4.js` (zpackTest4.body.js: the other 21 tricks + pug high five, the oopsie (gr 0), pig.bucketEat, sheep.patLean, chicken.puff, 26 cells), then `mv/sets/zpackTest5.js` (zpackTest5.body.js: every move that was still NOT VERIFIED, 57 cells; on a slope the check measures to the sloped floor), then `mv/sets/zpackTest6.js` (zpackTest6.body.js: round 4: grooming, talk + directTo, the podium hand-over on the real show:area with show:license, the c15 snake round and coil, the c15 stairs with the dog 1.4 m behind, the owl on the real perch, the seal on the bigger pool's slide), then runs `node run9.js packTest packTest2 packTest3 packTest4 packTest5 packTest6` (c15.html). Built-in checks print `GROUND …` when the lowest point leaves the floor outside a jump, and `STAIRS …` (deepest sink into a step, biggest gap under the dog). Pictures: `mv/gif2/moves-packTest.gif`, `mv/gif2/moves-packTest2.gif`, `mv/gif2/moves-packTest3.gif`, `mv/gif2/moves-packTest4.gif`, `mv/gif2/moves-packTest5.gif`, `mv/gif2/moves-packTest6.gif`, `mv/chk2/pack6S_*.jpg`, `mv/chk2/pack5S_*.jpg`, `mv/chk2/pack3S_*.jpg`, `mv/chk2/pack4S_*.jpg`, `mv/chk2/packTest.jpg`, `mv/chk2/packTest2.jpg`, strips `mv/chk2/packS_*.jpg`, `mv/chk2/pack2S_*.jpg`. `probeStairs.js up|down` measures stairs sink per body part. Backups: round 1 `moves-pack.v1.js`, `README.v1.md`, `zpackTest.body.v1.js`, `build.v1.sh`; round 2 `moves-pack.v2.js`, `README.v2.md`; round 3 `moves-pack.v3.js`; round 3b `moves-pack.v4.js`, `README.v4.md`.
