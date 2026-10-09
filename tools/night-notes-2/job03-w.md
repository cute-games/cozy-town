# Job 3 (world part): glitch fixes, pass 1

The 3D-world half of the glitch hunt (the other fixer does the 2D screens, cards, toasts and CSS). Only `index.html` changed
(game script only: lines 1-498 and the web part untouched), plus one before|after picture per fix in `tools/pictures-2/`
(`glitch1-W<NN>-<what>.jpg`: before on the left = the starting version of the hunt, after on the right = this job; same view).
Saves: nothing new, nothing renamed, nothing moved. Online: nothing new is sent. Finding numbers: **B** = inspector B (indoors),
**A** = inspector A (town, beach, park, Pet Show).

## Changes (item: old -> new)
**Indoors**
- **B1 Arriving inside your friend** (`W01`): the guest landed on the door spot, exactly where the host lands after "Go home & let in"
  (camera inside the friend's body) -> the guest steps in 1.3 m beside the door spot (or the next free one of 8 spots: at least 1.3 m from the door
  spot and from the host, at least 1 m from furniture) and looks into the room. Also: a friend's avatar closer than 0.6 m to your
  camera is not drawn, so you never see the inside of a head (walking through a friend, an old-version guest...).
- **B31 Friend's house door spot faces the sofa** (`W19`): same spot rule: the guest never lands right against furniture.
- **B2 + B3 School door signs** (`W02`): the 3 hallway signs shared the door frame's front face (flickering stripes) and sat on its dark
  outline ("y" of History, "g" of English cut) -> 16 cm higher, clear of the frame and its outline. Flicker detector: 3589 -> 0 px.
- **B3 "🏛️ History class" sign** (`W03`): rested on the blackboard frame's outline -> 5 cm higher (all 3 classrooms).
- **B4 Huge close-up name tags** (`W04`, also **A9** and helps **B9**): one rule for every name tag and bubble (shop keepers, teachers,
  townsfolk, friends, pets, online friends and their pets, Pet Show judges and pets, class kids, the coach, football friends...):
  on screen a tag is never taller than a HUD button (max 6.5% of the short screen side, 26-48 px; iPad ~48 px, iPhones 26 px) and
  it fades out when you stand within about 1.4 m (gone at 0.95 m). Far tags look exactly as before. Floating texts (+coins, Pet Show
  calls) and the clothes-mirror name keep their own size. The two teachers in the school hallway (Mr. Owl, Mrs. Maple) now stand in
  the back corners with a bigger "personal space", so you can't squeeze in behind them any more; all shop people get a little
  more room around them (0.35 -> 0.5 m), so the camera never presses into a body.
- **B6 Giant ice-cream cone** (`W05`): upside down and floating (cone() already adds half the height) -> standing on its tip in a little
  white stand, rim at 1.4 m, the three scoops and the cherry on top.
- **B10 Pyramid** (`W06`): the 4-sided cone's corners poked 12 cm out of its box -> turned 45 degrees, it now fits the box exactly.
- **B11 Knight's visor** (`W07`): the slit was on the side of the helmet -> across the face (the knight looks into the room).
- **B12 Rocking horse** (`W08`, toy store display AND the furniture you can buy): the rockers stood up behind it like a bow -> they
  curve under the hooves (touching the floor in the middle).
- **B13 Pizza oven** (`W09`): the dark door, the fire and its glow were buried inside the dome -> the oven mouth sits on the dome's
  front, tilted like the dome, with the fire and glow in it.
- **B14 "🗺️ The world" sign** (`W10`, could not be reproduced: device only): wider (1.9 m instead of 1.3), off the map board's top edge;
  and for ALL signs: the text keeps a wider margin (100 px instead of 50 on the sign picture, so a tablet that draws an emoji
  wider than it measures it still fits), and signs drawn before the round game font arrived (slow internet) are drawn again
  once it is there (only then; usually nothing happens).
- **B15 Bed flicker** (`W11`): the frame and the head/footboards were exactly 1.4 m wide (shared side faces) -> boards 4 cm wider.
  Every bed (yours, a client's, a friend's). Flicker detector: 64 -> 0 px.
- **B16 Stairwells** (`W12`, flats + the big house): a dark navy void with a lamp floating at 5.2 m -> the stairwell up has walls in
  the hallway colour and a ceiling with a little flush lamp; the way down has walls that get softly darker going down and a floor.
  In your house (and a friend's) the stairwell walls share the room's wall paint (repainting changes them too).
- **B17 English room alphabet** (`W13`): A to P, its first letters hidden behind the bookcase -> A to Z, up above the bookcase.
- **B19 Pets in the sofa** (`W14`): staying pets picked wander spots inside furniture and pressed into it -> their wander spots
  are always at least 0.6 m from furniture, a pet that bumps into furniture picks a new spot at once, pets keep 0.3 m (was 0.25)
  of room round them; friends' pets (online) the same. Measured at home with the rich save: before pets stood pressed at 0.25 m
  from the sofa for many seconds (head inside); after mostly 0.4-0.9 m.
- **B23 Shop people behind the cases, tags on the menus** (`W15`): Mrs. Crumb (bakery), Mr. Sprinkles (ice cream) and Chef Blaze
  (pizzeria) stood in the middle, right under the menu board (their tags sat on "Croissant", "Milkshake", "Pizza 12"), and the
  first two were hidden behind the high glass cases -> they stand beside the menu board (2 m to the right, by the oven for the
  chef), the bakery and ice-cream keepers on a little wooden step behind the case; shoppers now buy in front of them.
- **B26 Walking behind counters** (`W16`): the café counter's wall left a 0.95 m gap at the west wall, and you could walk round the
  ends of the bakery / ice-cream cases -> the counters reach the walls.
- **B27 A new pet at the camera** (`W17`): a newly adopted pet appeared 1 m from the camera, behind you (`P + (0.6, 0.8)`) -> it hops
  out 1.1-1.7 m in front of you, a little to the side, where there is room (not inside a pen or a shelf); only when you stand right
  at a pen fence is there no room in front, then it appears beside you. Measured: before 1.0 m behind you, after 1.7 m in front.
  **Pen pets at the fence**: the puppies/kittens/bunnies in the shop pens now keep 0.85 m from the front fence and 0.65 m from the
  side fences (their heads filled the view over the fence).
- **B29 People/animals inside each other** (`W18`): shoppers walked through each other -> a shopper waits when another one is in the
  way (and after 3 tries goes back the way it came, so they never get stuck); the two pets in each pen start apart, pick spots apart
  and stop before bumping into each other. Measured over 60 s in all 9 shops: closest two shoppers 0.13-0.58 m -> 0.7 m or more;
  closest two pen pets 0.04 m -> 0.7 m.
- **B30 Toy-store shoppers 6 cm into the floor**: checked, not changed (see Glitches not fixed).

**Town, beach, park**
- **A3 Shops look open at night** (`W20`): in closed hours (20:00-8:00) the 8 shops with opening hours and the library get a "🌙 Closed"
  sign on the door, and their windows/glass doors glow at 40% (houses still glow warmly). One picture, one material and ONE
  mesh for all nine signs, drawn only at night; the shop glass is one extra shared material. The school, fire station, pizzeria
  and flats are open at night, so they get no sign.
- **A4 People pop in at 48 m, cars at 80 m** (`W21`): townsfolk, friends and cars now grow in over their last 6 m (scale from 0 to full),
  so they don't pop. Scale only: no extra drawing. It's a small separate helper (`popFades()`, called once per frame before
  drawing), nothing in the walker code itself was touched.
- **A12 Pet Show cameras** (`W22`): "And the results are…" was shown while the camera was still turning from the judges, so the
  big text lay over the park's tree and a balloon string -> the results start with a camera cut straight to the stage; people
  walking past (townsfolk, friends) are kept out of the show's pictures; the front-right balloon bunch stands at the back of the
  stage now, so its string no longer runs across the walk-in picture right by the camera.
- **A13 "🦆 Duck Dock" sign** (`W23`): the post went through the middle ("Du|k Dock") -> the sign hangs 8 cm in front of its post.
- **A14 Beach "🎾 Tennis ➡️" signpost** (`W24`): the post showed through the text -> the post stands behind the board (only the
  signpost was touched).
- **A15 Clouds jump** (`W25`): a cloud vanished at x 230 and popped up far west -> clouds shrink away over their last 40 m and grow
  back after the wrap (scale only). The beach's clouds did the same (gone at x 320, back at once at x 40, right overhead): same
  fix there (one line in the beach's update; nothing else at the beach touched, not the bus).
- **A17 Shadow acne** (`W26`): stripes on tree tops and clothes -> shadow normal bias 0.03 -> 0.09 (about 3 shadow-map texels;
  compared 0.03 / 0.06 / 0.09 / 0.12: 0.06 still showed bands, 0.09 removes the big jagged ones). Faint fine banding can still
  show inside a tree top's own shade; much weaker than before.
- **A18 Kerb flicker** (`W27`): a dark line flickered along the kerbs (the bottom of the kerb's ink outline showed through the
  pavement) -> kerbs reach 8 cm into the ground (same look above it). Town and Friends Lane. Flicker detector: 305 -> ~108 px (what
  is left is the kerb's own thin outline line far away, normal for the outline look).
- **A19 Small flickers** (`W28`): Friends Lane lot signs ("For a friend 💛", "<name>'s house") shared their post's front face -> 1.5 cm
  further out. Detector: 136 -> 0 and 132 -> 0 px. (Football field line and window panes: see not fixed.)
- **A20 Cattails** (`W29`): the brown heads floated 10-30 cm above their stems (two different random heights) -> on top of their stem.
- **A21 A walker in the middle of the street** (`W30`): 4 walker paths crossed the big roads away from any zebra crossing (one of them
  at x -39 on main street, the "walking down the lane" one) -> those 4 paths are gone; walkers use the zebra crossings 5 m away
  (the paths there already existed). Shown as a top view with the walkers' paths drawn on it.
- **A33 Trees and lamp posts in front of signs** (`W31`): the street tree in front of the Library door is left out; the lamp in front of
  "Cozy Town School" moved 3.5 m east; the two lamps between the Flower Corner and "Fire Station" moved 3 m north.
- **A36 Rosie walks through the camera after the opening** (`W32`, checked with job 10's new greeting spot: it still happened: she
  walked to the corner and back past your nose, 1.0 m) -> after "Bye, Rosie!" she walks on away from you, west along the street
  (closest 2.7 m, where she stood).
- **A37 North-facing fronts slate grey** (`W33`): a little more soft daylight fill for the whole town (sky light 0.5 -> 0.58, its
  ground colour a bit lighter) and a touch less sun (0.6 -> 0.56), so sunny sides stay about the same and shady sides are ~20% lighter.
- **A38 Camera into the tennis fence** (`W34`): the fence kept you only 0.4 m away -> 0.8 m (from inside and outside; the gate
  opening is still 1.6 m wide, plenty to walk through).
- **A34 Garden sparkle on the water tag** (`W35`, re-check only): the ✨ was not litter but the "ready to pick" icon of another plot;
  on Friends Lane no litter is near your garden. Icons of two plots can still line up from some angles (like any two things in a
  row), but they are small now (tag rule). Nothing else changed.

Pictures (`tools/pictures-2/`, before left | after right): `glitch1-W01-guest-spawn.jpg`, `glitch1-W02-school-door-signs.jpg`, `glitch1-W03-history-class-sign.jpg`, `glitch1-W04-name-tags.jpg`, `glitch1-W05-icecream-cone.jpg`, `glitch1-W06-pyramid.jpg`, `glitch1-W07-knight-visor.jpg`, `glitch1-W08-rocking-horse.jpg`, `glitch1-W09-pizza-oven.jpg`, `glitch1-W10-world-sign.jpg`, `glitch1-W11-bed-flicker.jpg`, `glitch1-W12-stairwells.jpg`, `glitch1-W13-alphabet.jpg`, `glitch1-W14-pets-sofa.jpg`, `glitch1-W15-shopkeepers.jpg`, `glitch1-W16-cafe-corner.jpg`, `glitch1-W17-new-pet-pen.jpg`, `glitch1-W18-no-overlaps.jpg`, `glitch1-W19-friend-door-spot.jpg`, `glitch1-W20-closed-signs.jpg`, `glitch1-W21-popin.jpg`, `glitch1-W22-petshow-cameras.jpg`, `glitch1-W23-duck-dock.jpg`, `glitch1-W24-tennis-signpost.jpg`, `glitch1-W25-clouds.jpg`, `glitch1-W26-shadow-acne.jpg`, `glitch1-W27-kerb-flicker.jpg`, `glitch1-W28-lane-sign-flicker.jpg`, `glitch1-W29-cattails.jpg`, `glitch1-W30-walker-crossing.jpg`, `glitch1-W31-signs-clear.jpg`, `glitch1-W32-rosie-after-opening.jpg`, `glitch1-W33-north-fronts.jpg`, `glitch1-W34-tennis-fence.jpg`, `glitch1-W35-garden-sparkle.jpg`.

## Decisions I made
- Name tags: one rule in the place every tag is made (`label()`), not in each of the ~20 places that make tags; things that must
  keep their size say so (`fit:false`: floating texts, the clothes mirror). Tag size is capped on screen, not changed in the world,
  so far tags are untouched. The fade (1.4 m -> 0.95 m) matches the existing "hide your own pet's tag under 1.3 m" rule.
- Keepers moved instead of the menu boards (the rooms are 3.3 m high: a 1.4 m board can't go higher, and the tags sit at 2-2.6 m).
- The guest's spot is chosen from 8 spots around the door, never the door spot itself (the host always lands there after "Go home
  & let in", and their position may not have arrived yet when you come in).
- "Closed" signs only on places that really close (`SHUT` list: 8 shops + the library). The school building stays open at night.
- Pop-in and cloud fades use scale, not transparency: transparency would need extra materials and sorting (more drawing work).
- Pet Show results: a camera cut (like on TV) rather than a faster turn.
- Kerbs: sunk into the ground instead of removing their outline (keeps the drawn look).
- The jaywalk paths were removed with a small separate block next to the walker graph (job 5 is changing walkers at the same time):
  it finds the 4 paths by their end points' positions, not by node numbers, so it still works if the graph is renumbered (and does
  nothing if those paths are gone). Checked: 174 -> 170 paths, every walker spot still reachable.

## Glitches found and not fixed
- **B30** toy-store shoppers "6 cm into the floor": it is the 1.5 cm ink outline under every person's shoes plus 2 cm of the toe
  mid-step (adult size 1.17); invisible in every picture. Not worth changing the walk.
- **A19 football field line** (8 px from the side, a white line on grass at a grazing angle: shimmer, not two surfaces fighting)
  and **window panes** (1-3 px ink-outline slivers between window frames and shutters, e.g. 41 px on an attic window sill 20 m
  away on Friends Lane): part of the outline look; changing the shared window model risks more than it gains.
- Not mine: the other fixer has the 2D items (B5, B7, B8, B18, B20-22, B24, B25, B28, B32, B33, A1, A2, A5-A8, A10, A11, A16,
  A23-A32, A35) and B9 (class bubbles over the kids' tags; the tag size rule here helps it); A22 (map labels) is job 6.

## NOT VERIFIED (real devices, sound, feel)
- iPad Safari: the "The world" sign cut (B14) never showed in Chromium; the fix makes it very unlikely, but only a real iPad can tell.
- How the tag fade feels when you walk up to people; the cap size on a real iPhone (26 px).
- The shadow bias on real iPads (acne depends on the GPU); flicker on 16-bit depth devices.
- Two real players visiting each other (tested with two test pages on the fake server, new + new).

## Try it for real (tick-box tasks)
- [ ] Walk up to Mrs. Crumb, Chef Blaze, a teacher, your pet: the name tag stays small and fades when you're right next to them.
- [ ] School hallway at the back corners: you can't get behind the teachers; the door signs don't flicker.
- [ ] Ice cream shop: the big cone stands on its tip. Toy store: rocking horse rockers under the hooves. History room: pyramid, knight.
- [ ] Flats: look up the stairwell (walls, a ceiling lamp) and down it on floors 2-3. Big house: the stairs down.
- [ ] Visit a friend: you arrive beside the door, not inside them; nothing is right in your face.
- [ ] Adopt a pet: it hops out in front of you. Watch the pens for a minute: no pets inside each other or at the fence.
- [ ] At 22:00 walk down main street: "Closed" signs on the shop doors, dim shop windows, houses still glowing.
- [ ] Walk towards someone far down Friends Lane: they grow in instead of popping.
- [ ] Pet Show on a Saturday: the results start on the stage.

## Morning questions (each already built in a sensible way)
- Tag cap: built as at most 6.5% of the short screen side (26-48 px); or a bit bigger on phones (e.g. 30 px)?
- Daylight fill: built so shady house fronts are ~20% lighter (sunny sides ~+4%); or lighter still?
- "Closed" sign: built as "🌙 Closed" on a dark purple board; or also show the opening time ("Opens 8:00 ☀️")?
- The school at night: built without a Closed sign (you can still go in); or close it too?
- Removed street tree in front of the Library: built as a gap (an open entrance); or a small flower bed there?

## Quick check
On the final file: `SRC=index.html tools/quick.sh job03w-d files,counts,saves,players,claude,crawl_ipad-landscape_town,crawl_ipad-landscape_inA,crawl_ipad-landscape_inB,crawl_ipad-landscape_inC`
```
new claude e8cfaceb658dd73b25c8224aa367cb95 · new web 282a8bad737a11f7232f8f3bb1e00747 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 63 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1301 pieces, 986564 triangles in total | for information, seen from 5 spots: city 138 draws; home 34 draws; market 48 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 210 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzolo4akz446" -> "umuzolvntnm7ga"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 35 s]
    FAIL | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: False; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 22 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 190 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 245 s]
[stage crawl_ipad-landscape_inB: running]
[stage crawl_ipad-landscape_inB: done in 266 s]
[stage crawl_ipad-landscape_inC: running]
[stage crawl_ipad-landscape_inC: done in 74 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
Rerun of the two-player stage on the same file (`job03w-d` failed D1 once, see below), `quick.sh job03w-p3 saves,players`:
```
[stage saves: done in 227 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzp8wd13un6o" -> "umuzp977kbxvln"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: done in 37 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
```
- **A2** FAIL: no dated backup is given to a fixer (made before publishing).
- **B1** FAIL: the only difference in all 7 saves is `pid`, the random player id that both versions make when an old save has
  none; the `b1.py` helper: "B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7" (same in both runs).
- **D1** "A saw B walk: False" once in `job03w-d`: B walks 30 frames forward from the same start spot each time (the sidewalk
  at main street); in that run B's screenshot shows a townsperson right in front of B's face (townsfolk are solid, and one was
  walking past on the sidewalk just ahead), so B most likely could not walk forward. The same stage passed in my earlier runs
  (`job03w-a`, `job03w-b`) and in the rerun above on the same final file. Nothing this job changed is near that spot, and nothing new is
  sent online.
- Crawl stages: town 98 things tested, inA 207, inB 162, inC 24: 0 dead, 0 unreachable, 0 stuck, 0 covered, 0 errors, 0 issues
  (town's 11 "not available right now" skips are the same in every run of every job).
- iPhone portrait + landscape (light earlier, dark now): bakery, school hallway, main street at 22:00: tags small (26 px),
  the "Closed" sign on the Market door, nothing of mine under the HUD.
- Also: `node --check` of the game script OK; lines 1-498 identical; web part round trip identical; ZZTEST 0 times.
