# Job 12 (world part): glitch fixes, pass 2

The 3D-world part of the second glitch hunt (bus, beach stop, campsite, football friends, Friends Lane, Flower Corner). The other
two fixers do the 2D screens (HUD, cards, map, texts) and "move my game" + where messages go on the screen. Only `index.html`
changed (game script only: lines 1-498 and the web part untouched), plus one before|after picture per fix in `tools/pictures-2/`
(`glitch2-W<NN>-<what>.jpg`: before on the left = the photographed version c013529, after on the right = this job; same view, same
recipe; NN = the finding number in `glitch2/findings-main.md`). Saves: nothing new, nothing renamed, nothing moved. Online: nothing
new is sent; nothing about presence changed.

## Changes (item: old -> new)
**The bus**
- **2 Seeing inside the bus at its corners** (`W02`): the bus was solid as 4 round circles along its middle, so at the corners you
  could stand with your eyes 11-13 cm from it and the camera cut into the wall (frames and seats seen from inside) -> one turned box
  round the whole bus (bumpers, mirrors, the open door), the same at the beach stop. Measured by walking into it from 72 directions:
  closest before 0.11 m, after 0.38 m everywhere (the camera needs about 0.2 m). You still see in through the window glass, as meant.
- **9 Giant "-20 🪙" after getting off** (`W09`): the fare float spawned 1.2 m in front of where you stood and you came back to that
  spot -> the -20 shows small (0.3 m) in front of your seat inside the bus; getting off before it leaves removes the -20 and shows
  "+20 🪙" 2.4 m in front of you, with Driver Dot's "here are your coins back".
- **13 "Oh no, the bus left!" while it still stands there** (logic only; the text is the screens fixer's): the message came from the
  clock at 21:00 sharp, when the bus only closes its doors -> it comes once the bus has really driven 8 m away (about 3 seconds
  later; if you stand in its way it waits until it drives on). Measured: before at 21:00.0 with the bus at 0 m; after 21:05.8, bus 8.6 m.
- **14 The bus countdown label under the HUD** (`W14`): standing near the waiting bus, its "🏖️ 0:47" label sat under the round top
  buttons (at the beach behind the "To town" sign) -> while the pill at the top left shows the same countdown (near the stop, and at
  the beach), the label over the bus is not shown. From further away it still floats over the bus.
- **15 Your friend's head fills your view on the bus** (`W15`): the seat came from a number made from your player id, so you could
  get the seat right behind a friend -> you never sit right behind (or right in front of) a friend if another seat is free: beside
  them across the aisle, or two rows apart. (Friends online use the same rule, old versions have no bus.)
  Also (found while testing): a friend's pets stood in the bus aisle while the friend sat -> they ride along unseen, like your own.
- **18 Bus times at the beach** (`W18`, the 3D board): the board in the beach shelter showed the park's times -> it shows when the
  buses leave the beach ("Tuesday 11:50 · 21:00", day 1 "until 12:00") and "Buses to town · a ride is 20 🪙". Driver Dot's arrival
  words are a text: left to the screens fixer.
- **28 A car touching the back of the bus** (`W28`): when the bus pops up at its stop (you come out of a shop, or load the game while
  it waits) a car standing there stayed glued to (or inside) its back -> that car rolls back to wait with a 2.5 m gap (a car past the
  bus's middle rolls ahead of it instead). Measured: before its nose stood inside the bus's back bumper, after 2.5 m behind it.

**The beach stop and the campsite**
- **3 Boardwalk flicker at night** (`W03`, the biggest flicker): the boardwalk's dark outline beat its planks over a big area when the
  camera moved 1-2 cm (the test browser draws big triangles next to the camera imprecisely) -> the boardwalk is 5 shorter pieces lifted
  1.5 cm off the sand (same look; a faint line between the pieces like plank joints). Flicker detector: 2408 changing px -> 0-1 px.
- **7 The road under the waiting bus turned into grass** (`W07`): the lavender road lay 8 mm above the green land strip and the two
  swapped places from some angles -> the green land no longer runs under the road or the sandy step (they lie on the sand, which always
  loses), and the road is 12 pieces of 20 m. Lavender from every angle now (checked 0, 45, 135, 225, 315 degrees and through the gate).
- **16 The campfire's light was a hard-edged box** (`W16`): the warm halo (a 2.4 m sprite that always turns to you) reached 60 cm into
  the sand and was cut straight by the ground -> a smaller halo (1.2 m) that stays above the sand, and the soft light pool on the sand
  a bit bigger and warmer (7 m). Soft and round from every side, also from inside the tent.
- **21 (tent) A friend asleep in the tent** (`W21`): their ⭐ name was cut by the tent roof and the 💤 drawn on the cloth -> both float
  above the tent.
- **22 (sand step) The sandy step's edge flickered** (`W22`, row 4): it overlapped the road by 0.9 m (4 mm apart) -> it ends at the
  road's edge.
- **23 A lamp globe in your face** (`W23`): the two short lamps at the end of the boardwalk had their white globes at eye height (1.36 m),
  so walking past filled a corner with a white blob -> taller posts, globes at 2.16 m (above your eyes).

**The football friends**
- **10 Name tags on top of each other and on "🎯 Score here!"** (`W10`): the nearest kid's tag stays put; any tag (or speech bubble)
  that would cover a nearer one steps up on the screen to the first free place (worked out every frame from where they are drawn);
  the "🎯 Score here!" sign keeps its place too and is drawn over everything; Zac's goal-dance 🕺 now dances above his bubble, drawn on top
  (it was hidden behind his tag and bubble).
- **11 Juice break: kids inside each other** (`W11`): two benches 1.8 m apart with seats 0.8 m apart -> the benches 3 m apart, seats
  1 m apart (two kids per bench, room between them); with the tag rule above the side view is readable too.
- **12 A kid walks through you** (`W12`): a kid walking (home, to the bench, onto the field) kept only 65 cm from you, so her head filled
  the view -> a walking kid keeps 1.3 m and steps round you; a playing kid keeps 0.9 m (was 0.65). Measured: closest 0.65 m -> 1.30 m.

**Friends Lane and your yard**
- **21 (bed) A pet's name on a sleeping friend** (`W21`): a friend's pet hidden in their bed still showed its name on the pillow -> a
  friend's pets show no name while the friend sleeps (bed or tent).
- **14 + 26 House labels under the HUD and piled up** (`W14` row 2, `W26`): "🏠 name" labels far down the lane piled up (24-30%) and one
  poked out beside the map -> house labels fade out between 26 and 34 m; a label that would sit under the HUD (the top row band, the map
  column, the buttons) slides down onto its house and is drawn on top of it; if it would have to move very far (a long name on a narrow
  phone held upright), it is not shown.
- **25 The garden arch led into the shed** (`W25`): the shed stood right behind the arch -> the shed moved 1.5 m to the side; its door,
  the seed box and the "🌱 Seeds" sign now face the arch, and the way through the arch is free to the back fence. The map shows the
  shed in its new spot.
- **27 The name-sign post poked through the sign** (`W27`): the post was thicker than the board and went 15 cm into it -> it stops
  under the board (every lot).

**Flower Corner**
- **22 (hedges) A dark line flickering at the hedges' feet, ink lines crossing at the corners** (`W22`): the hedges' ink outline reached
  3 cm under the grass and flickered through it; the side hedges ran into the back hedge so their outlines crossed on its top -> the
  outline starts 1.5 cm above the grass; the back hedge runs the full width and is 6 cm taller, the side hedges end at it.

Pictures (`tools/pictures-2/`, before left | after right): `glitch2-W02-bus-corners.jpg`, `glitch2-W03-boardwalk-flicker.jpg`,
`glitch2-W07-beach-road.jpg`, `glitch2-W09-fare-float.jpg`, `glitch2-W10-football-tags.jpg`, `glitch2-W11-juice-bench.jpg`,
`glitch2-W12-kid-walks-into-you.jpg`, `glitch2-W13-bus-left-message.jpg`, `glitch2-W14-labels-under-hud.jpg`, `glitch2-W15-bus-seats.jpg`,
`glitch2-W16-campfire-glow.jpg`, `glitch2-W18-beach-board.jpg`, `glitch2-W21-pet-tags-tent.jpg`, `glitch2-W22-small-flickers.jpg`,
`glitch2-W23-beach-lamp.jpg`, `glitch2-W25-garden-shed.jpg`, `glitch2-W26-lane-labels.jpg`, `glitch2-W27-name-sign-post.jpg`,
`glitch2-W28-car-behind-bus.jpg`. The flicker pictures (W03, W22) show three camera spots 1-2 cm apart, zoomed: before they differ,
after they are the same.

## Decisions I made
- The bus keeps its look exactly (the owner's design): only its invisible collision box, the fare float, the seat choice, the label
  and the timing of one message changed. The beach board keeps its look too (only its times).
- One shared rule for "solid turned box" (the bus) in the collision code, used only by the bus; everything else is untouched.
- Bus label: hidden while the pill shows the same countdown, rather than moving a 3D label around the HUD (simpler, and the pill is
  easier to read). From afar the label still marks the bus.
- Flickers: geometry changes only (short pieces, a small lift, no overlaps), no global change to the ink outline material (that would
  change every outline in the game).
- Football tags: the nearest kid's tag never moves; the others step up only as far as needed. During a match the sign is more
  important than the names, so it is drawn on top.
- Kids' distance: 1.3 m when they walk past you (like grown-ups in town, who stop about 1 m away), 0.9 m while playing football
  (close enough to play for the ball near you).
- Seats: "not right behind a friend" (or right in front); if the bus is full that way, any free seat as before.
- Shed: moved to the side and turned to face the arch, instead of moving the arch (the arch fits the gap between the house and the
  fence, and the stepping stones lead to it).
- House labels: faded beyond about 30 m (the map shows everyone's house anyway); a label is never moved more than about a fifth of the
  screen: then it is hidden instead (it would no longer belong to its house).
- Lamps by the boardwalk made taller rather than moved (they mark the end of the boardwalk).

## Glitches found and not fixed
- **10 (last part)**: a kid's tag can still slide under the left HUD column when that kid stands at the very edge of the screen; moving
  the tag sideways would separate it from the kid. Turning towards the kid shows it.
- **12 (test camera)**: "Tilly walks into the view and fills half of it" on the photographer's free test camera: not a spot a player's
  camera can be; from the player's own eyes she now keeps 1.3 m.
- **21 (tent, your own pets)**: your own pets standing behind the tent are partly hidden by it like anything behind a tent (normal).
- **The test browser's precision**: the boardwalk/road/sand-step flickers came from the test browser (SwiftShader) drawing very long
  triangles next to the camera imprecisely; the fixes cure them there; other very long thin things could still show tiny slivers in
  the test browser only. Real iPads draw these exactly.
- On a phone held upright, a friend's house label with a long name is hidden when it would sit under the map column (the name is also
  on the sign by the gate).
- Not mine: 1, 4, 5, 6, 8, 17, 19, 20, 24, 29 and the texts of 13 and 18 (screens fixer / move fixer).

## NOT VERIFIED (real devices, sound, feel)
- Real iPad/iPhone GPUs: whether the boardwalk, road and sand-step flickers ever happened there (they are fixed either way).
- How the kids' new distances feel in a real match (0.9 m) and when they walk past (1.3 m).
- The fare float and "+20 🪙" feel on a real iPad; the campfire glow brightness on a real screen at night.
- Two real players on the bus (tested with two test pages on the fake server, both new).

## Try it for real (tick-box tasks)
- [ ] At the park stop, walk all round the waiting bus and push into its corners: you never see inside through a wall.
- [ ] Get on the bus (20 🪙), then get off right away: a small -20 inside, then "+20 🪙" and your coins back.
- [ ] Near the waiting bus: the pill counts down; no label stuck under the buttons. From across the road the label floats over the bus.
- [ ] Beach stop at 10:50 on a bus day: the road under the bus is lavender from every side; the shelter board shows 11:50 · 21:00.
- [ ] Stay at the beach past 21:00 by the gate: "Oh no, the bus left!" comes when the bus is driving away, not while it stands there.
- [ ] Build the campsite at night and sit by the fire: a soft round glow; the boardwalk doesn't flicker when you turn.
- [ ] Walk past the lamps at the end of the boardwalk at night: no white blob in your face.
- [ ] Football at 15:00: crowd the ball with the kids, tags never pile up; take the field: "🎯 Score here!" always readable.
- [ ] "Can I practice?": the four kids sit on two benches with room between them.
- [ ] Stand in the way of a kid going home at 19:00: they step round you about a metre away.
- [ ] Friends Lane with a friend online: walk through the "My Garden" arch to the back fence; the seed box by the shed works.
- [ ] With a friend: both get on the bus; you don't sit right behind them. Watch them sleep in bed / in the tent: no pet names on them.

## Morning questions (each already built in a sensible way)
- Bus label near the stop: built as "hidden while the pill shows the countdown"; or keep it always and push it below the buttons?
- House labels: built as "fade out beyond ~30 m"; or keep them at any distance (they get small)?
- Boardwalk lamps: built as taller lamps (globe at 2.16 m); or keep them short and move them 1 m off the boardwalk?
- Football: built as "kids keep 0.9 m from you while playing" (was 0.65); or closer for more tackling?
- The shed: built moved 1.5 m west with its door and seed box facing the arch; or another spot in the garden?

## Quick check (the output, exactly as printed)
`SRC=/home/user/wt/job12w/index.html quick.sh job12w-q2 files,counts,saves,players,claude,crawl_ipad-landscape_town,crawl_ipad-landscape_inA`

```
new claude bf52b0068aca4f3ef8727b12eae40412 · new web d9f1969bbf36ddb077b43eb9f251c885 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 61 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1307 pieces, 994630 triangles in total | for information, seen from 5 spots: city 163 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 160 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzzjih8otbzd" -> "umuzzjp519ylq6"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 35 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 25 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 188 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 224 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 tools/b1.py runs/job12w-q2`: `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7` (the known false fail: only the random
player id differs). Crawl stages (town, inA): 0 layout issues, 0 browser errors (`runs/job12w-q2/stages/*.json`).
A short iPhone look (portrait light, landscape dark) at the bus stop, a bus corner, the beach road, the campfire, the garden arch, a
lane house and the football bench: fine (pictures in `$SP/work/job12w/phone/`).
