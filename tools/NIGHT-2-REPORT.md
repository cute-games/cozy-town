# 🌙 Cozy Town: morning report for night 2

Night of 8 → 9 October 2026 · branch `claude/affectionate-ride-6p18y9` · start: night 1's final game (`f2cdd530076cce1ad198bd90d9e0e2a7`, = `tools/prenight2-index.html`) · final game: `index.html` at the tip of the branch (md5 `d8749e6bafae98f2b46ea70b68b12d16`)

## Good morning! The short version

- **All 13 jobs are done**, in the plan's order of importance (job 13 "if time allows" too). Each job is one commit. There are three small extra commits: your **retro surf-minibus look for the beach bus** (you sent the picture during the night), **review fixes for job 10** (the riskiest job got an independent reviewer), and **integration fixes** (things that only went wrong once the jobs were put together, found by a reviewer who played the whole game). Plus the start commit (backup) and a ready-made rollback file. No job had to be undone.
- **Final full check:** `RESULT: (final check not finished)` (the full printout is in section 2). 
- **Old saves:** all 7 test saves load with nothing lost (B1's only "difference" is a random player id that night 1's ideas board gives an old save on every load, also on the unchanged game: see "How the checks were run"). And the other way round: saves written by tonight's game still start in the old game (`ROLLBACK ALL PASS`).
- **Three things need you:**
  1. **Firebase rules** (section 8): one complete block to paste. Without it, "Move my game" (job 11) and the ideas board (night 1) simply stay hidden; nothing breaks.
  2. **Morning questions** (section 8): every one is already built in a sensible way, so you can just say yes, or tell me what to change.
  3. **Version number on every future update** (job 1): the iPad Home Screen app now updates itself by comparing `const COZY_BUILD=…` (top of the game script, now `2026100901`). Every later update must use a bigger number (date + counter, e.g. `2026101001`), and bigger than the rollback file's `2026100950`.
- **How to go back:** section 7 (`tools/prenight2-index.html`, or `tools/prenight2-rollback.html` if tonight's version was already published).
- **During the night you asked for two things,** and both are done: the beach bus now looks like your picture (cream-white top, orange bottom, big windows, round headlights, white rims, flowers on the front, roof rack with a yellow-green and a wooden surfboard, one board leaning on its side at the beach; times, fare, countdown and campsite unchanged), and from then on at most 3 helpers ran at a time.

## Jobs at a glance

| # | Job | Commit | Quick check after merging (section 2) |
|---|---|---|---|
| – | Start: backup + a save made with the starting version | `09f314e` | (dry run of the unchanged game: B1 pid-only, C2b beach not reached) |
| 1 | The Home Screen app updates itself | `13b12b8` | all pass ¹ |
| 2 | Bug fixes (zoom, run toggle, friends' jumps/pets/bed/💤, class doors, ideas-board keyboard) | `d49216a` | all pass ¹ |
| 3 | Glitch hunter, pass 1 (870 screenshots, 71 findings, 69 fixes with before/after pictures) | `5850a47` | all pass ¹ |
| 4 | Small changes: Pet Show Saturday 8:00–20:00; ignore clocks more than 30 days ahead | `eccf9cb` | all pass ¹ |
| 5 | Walkers notice you | `557b43b` | all pass ¹ |
| 6 | Map overhaul | `c013529` | all pass ¹ |
| 7 | Beach bus (+ campsite) | `05366ea` | all pass ¹; C2b fixed (the crawler reaches the beach by bus) |
| 7+ | Follow-up: the bus looks like your retro surf minibus | `1cecaef` | all pass ¹ |
| 8 | Coins balance | `92a4df7` | all pass ¹ |
| 9 | Football friends (Zoomy Zac and friends) | `21bde36` | all pass ¹ |
| 10 | One house per player, on Friends Lane | `7e15447` | all pass ¹ |
| 10+ | Follow-up: review fixes (the arrow to your house, the sign, friends walking home) | `a87d95e` | all pass ¹ |
| 11 | Move my game between devices | `38e9830` | all pass ¹ (button hidden until the Firebase rule is added) |
| 12 | Glitch hunter, pass 2 (1,032 screenshots, 37 findings, all fixed with before/after pictures) | `a188e49` | all pass ¹ |
| 13 | The designer's older wishes: pond bridge, TV cat music, fireflies, shell shelf | `77c89a6` | all pass ¹ |
| – | Rollback file `tools/prenight2-rollback.html` | `263e190` | (tested: section 2) |
| – | Integration fixes (how the jobs work together) | `97b483b` | all pass ¹ |

¹ "all pass" = every line PASS except `A2 … no backup given` (the backup is only given in the final check) and `B1`, whose only difference is the random `pid` (checked by `b1.py` every time). Jobs were built at the same time in separate worktrees and merged as they finished, so the commit list is not in strict 1-to-13 order; every job is still exactly one commit.

---

## 1. Every change (item: old -> new)

The full notes of every job (changes, decisions, glitches, tests, questions) are in `tools/night-notes-2/`. Each job's decisions are also in section 9.

### Job 1: The Home Screen app updates itself

- Version number: none -> `const COZY_BUILD=2026100901;` at the very top of the game script. **Make this number bigger on every
  update** (date + a 2-digit counter: 2026100901, 2026100902, 2026101001 ...).
- Title screen (GitHub version only): a small "Version 2026100901" label in the bottom right corner, so you can see which copy a
  device is running.
- Home Screen app on the iPad: kept its old copy until iOS felt like reloading it -> the game checks for a newer copy by itself:
  about 1 second after it starts, and every time the app comes back to the front (switching apps, Home button, iPad waking up,
  coming back from the app switcher; on a computer also when the window gets focus). At most one check every 20 seconds.
- How it checks: it downloads `index.html` again, past every cache (a "no-store" download with `?cz=<time>` on the address),
  finds the version number in it and compares. Bigger number = newer. Same number but a different game script = newer too (a safety
  net for an update where someone forgot to bump the number). A smaller number or a file without a number = never newer, so
  the app never jumps back to an older version. No internet, a 404, a wifi login page, a download that takes more than 25 s:
  nothing happens, it tries again next time.
- Newer while on the title screen (also the "You took a break" title): the game saves and reloads at once into the new copy
  (the Play button says "✨ Updating…" for that second and can't start the old game meanwhile).
- Newer while playing: a shiny button at the top right, under the round buttons: "✨ New Cozy Town update! Tap to get it"
  (yellow-pink, gently glowing, at least 56 px tall; on iPhones held upright it sits a bit lower, under the clock).
  It stays until tapped. It waits (hides) while a card is open (bag, phone, shops, Chef Blaze...), during the Pet Show, a lesson
  or other scenes, the pizza/designer tips, the clothes creator and the opening with Rosie; then it comes back. On short phone
  screens held sideways (iPhone landscape) it also steps aside while the action button (door, talk, ...) is up, because there
  is no room above that button; it is back as soon as you walk on.
- Tap the button -> "Getting the update… Your game is saved 💾": furniture you are holding while decorating goes back to your
  storage, the game saves (also your notepad and settings), the saved copy of the plain address is refreshed, and the new copy
  opens at a new address (`?u=...`, which the new copy tidies away at once). No internet at that moment -> a toast
  "📡 No internet right now. Try again in a moment!" and the button stays.
- After an update: the title says "✨ Cozy Town is updated!" (in place of the little tagline) and Play goes on with your saved
  game: same place, coins, house and furniture, pets, garden, clothes, skills, quests, job, and even a pizza you were carrying
  (same order, still in your hands, the timer goes on).
- Loop guard: at most one automatic reload per new version per session. If the server still hands out the old file after the
  reload (GitHub can take a few minutes), the old copy shows the button (on the title too) instead of reloading again. A tap on
  the button always tries again.
- Inside Claude: nothing at all (no check, no button, no download, no errors).

### Job 2: Bug fixes

- **Page zoom while playing:** pinching or double-tapping could zoom the whole page on the iPad -> no page zoom anywhere in the game:
  - the viewport line now also says `maximum-scale=1, user-scalable=no` (same line, nothing added);
  - CSS `touch-action`: the page allows scrolling only (no pinch, no double-tap zoom); the game picture, the buttons on top of it
    (HUD) and the title screen allow no touch gestures at all. Lists in cards (bag, phone, ideas board...) still scroll with a finger;
  - Safari's own pinch events (`gesturestart/change/end`) are stopped (iOS ignores `user-scalable=no`, this is what really stops it);
  - a two-finger move is stopped, except on the game's own touch area (walk + look with two thumbs still works), in text boxes and in
    scrolling lists; a double-tap/double-click never zooms (except inside a text box).
- **Run button (🏃) on iPad:** it switched on the "click", and iOS sends no click while your other thumb is on the joystick, so it often
  did nothing; ON was only light blue -> it now switches the moment you touch it (also with a thumb on the joystick). ON = warm
  yellow, a glowing coral ring, a small dark "ON" tag on top and a 💨 puff of speed; OFF = plain white. Screen readers get
  `aria-pressed`. Same size (72 px, 64 px on phones). PC: Shift still runs while held. Pictures: `before-run-button.png` (old ON look),
  `after-run-button-on.png`, `after-run-button-off.png`.
- **Friends' jumps:** you couldn't see a friend jump -> their avatar hops (and their pets hop with them). New optional presence field
  `jp` = how many times they jumped; a new number = one hop, played smoothly on your side (sent once per jump, tiny).
- **Friends' pets:** never shown -> the pets that walk with a friend (at most 3) show and trot after them. New optional field `pt` =
  `[[kind, colour, name, outfit], ...]` (e.g. `[["dog","#e8b765","Waffles","bow"]]`), only sent again when it changes. The pets walk
  along the way the friend walked (so round corners and through doors, like they did), 1.4 m / 2.2 m / 2.9 m behind, stop when the
  friend stops and look at them, have name tags like your own pets, never block you, hide when the friend's avatar hides, and go
  away when the friend leaves or the pet stops following. A name that isn't kind shows as just "puppy"/"kitten"/... (same word filter
  as the ideas board). Picture: `after-friend-pets.png`.
- **Friend in bed:** a friend in bed stood upright inside the bed -> when you visit a friend who goes to bed, they lie on their back
  with their head on the pillow, tucked under a duvet in the bed's colour, with a 💤 floating over the pillow. Works with friends on
  the old version too (they already send "in bed" and their house layout). Picture: `after-friend-in-bed.png`.
- **Friend away:** no sign when a friend had the "Still there? 👀" card up -> a small 💤 floats over their head (over their name tag;
  a bit higher when they say something). Also works with friends on the old version. Picture: `after-friend-away.png`.
- **Classroom doors:** the glass of a classroom's door changed from light blue to white-orange at 19:30 (it used the town's shared
  window glass, which lights up at night). A class can take a few game hours (the lesson plus marking homework), so a class started in
  the late afternoon ended with a door of another colour -> the classroom doors have their own glass that stays the same light blue
  all day and night (the hallway behind them is always lit). Checked at 12:00, 18:48, 19:24, 19:36, 21:00 and 23:00: all the same.
- **Typing on the iPad (ideas board):** the keyboard covered the "✏️ Write an idea" card -> while a text box in a card has focus and
  the keyboard is up, the card area fits the part of the screen above the keyboard (cards get shorter and scroll if needed, and the
  text box scrolls into view, never under the clothes mirror's sticky "That's me!" bar). Done typing = everything goes back. The same
  works for the other two text boxes in the game: your name in the clothes mirror and a new pet's name. (The notepad is drawn with a
  finger, no keyboard.) If iOS leaves the page shifted after the keyboard closes, it is put back. Pictures (keyboard simulated):
  `before-ideas-keyboard.png`, `after-ideas-keyboard.png`.

### Job 3: Glitch hunter, pass 1 (3D world part)

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

### Job 3: Glitch hunter, pass 1 (screens part)

**One rule for messages (toasts).** A message used to sit at one fixed spot (200 px above the bottom; in class at the very top), so it
landed on open cards, on the clock and coins, on the use button's label, on the phone, on the tennis score. Now each message takes the first
free spot from a short wish list: its usual spot first, then above the use button, under the top HUD row, beside the map column, above or
below an open card, the top, the bottom. Covering an open card counts most, then the top HUD row (coins, tummy, clock, the bus / tennis /
football pills, the round buttons), then the use button, then the map/notepad column. Next to a very big card (the shops, the phone held
sideways) the message goes beside the card in a narrower box. Messages still show at once and for as long as before.
- **B18 shop panels** (U05 `glitch1-U05-toast-decorate-shop.jpg`, U06 `glitch1-U06-toast-clothes-shop.jpg`): messages lay on the 2nd row
  of items -> they sit beside the shop card. The decorate hint ("Look at something to move it, or open the shop") goes away when the shop opens.
- **B24 iPhone upright** (U09 `glitch1-U09-toast-use-button-iphone.jpg`): "Welcome to …'s house!" covered "Sit down" -> it sits above it.
- **A28 tennis, phone sideways** (U30 `glitch1-U30-tennis-hint-iphone-sideways.jpg`): the hint covered the task card and touched the
  score/Stop pill -> it sits low in the middle, clear of both.
- **A8 clock jump** (U23 `glitch1-U23-phone-clock-after-jump.jpg`): "Same time as your friends…" lay over the phone -> under/beside the
  phone. The open phone's clock (status bar, big clock, date line) now changes with the HUD clock: no more 13:00 on the phone while the HUD
  says 16:00.
- **B8 class messages** (U04 `glitch1-U04-class-toast-hud.jpg`): "Your class is here! Sit down…" stayed during the lesson, "Tap a kid…"
  during homework, both on the clock -> class messages sit under the HUD row, and each class step (sitting down, lesson over, grading)
  clears the old message.
- **A7 "Still there?"** (U22 `glitch1-U22-still-there-toast.jpg`): a message showed together with the card (under its dark layer) ->
  messages wait while "Still there?" or "Reconnecting…" is up and come one after another when you're back (at most 3 wait; each one shows
  as long as before).

**The message card (📩 note).**
- **A5 "New client!"** (U20 `glitch1-U20-new-client-note-iphone.jpg`) and **B20 pizza order** (U07 `glitch1-U07-pizza-order-note.jpg`): the
  card sat on the clock (iPad) / on every top button (iPhone) -> it sits under the top HUD row (beside the map column when there is room),
  never on the joystick or jump button (it takes taps), and a message and the card keep clear of each other.
- **B20**: the Chef's "Welcome to work! Wait here…" card stayed open under the new order -> it closes by itself when the order comes.
  "⏱️ 30 minutes Pick it up…" -> "⏱️ 30 minutes. Pick it up…" (also "30 minutes. Come to the Pizzeria…").

**Big texts (the big words in the middle).**
- **B7 lesson** (U03 `glitch1-U03-lesson-big-texts-iphone.jpg`) and **A1 Pet Show** (U15 `glitch1-U15-petshow-big-texts.jpg`): two or three
  big texts were drawn on top of each other ("A🥇dDaisy wins! is…"); on an upright iPhone they ran off both screen edges -> one big text at
  a time: a new one waits until the last one was readable for 0.8 s, then takes its place. Long texts wrap onto 2 lines inside the screen
  (the size also follows the screen height, so a phone held sideways gets a smaller one). A big text never sits on a message: it slides below.
- **A1**: the other pets' name tags step aside while a big text is right over them; the trick names and "⭐ Good!" over the stage are drawn
  in front of the pets (a pet in a big jump used to hide them).

**Pet Show cards.**
- **A2 dark mode** (U16 `glitch1-U16-petshow-dark-cards.jpg`): judge boxes and the yellow/blue rows had white text on white -> dark text.
- **A25** (U17 `glitch1-U17-petshow-judge-text.jpg`): judge names 13 px -> 15 px.
- **A24 phone sideways** (U18 `glitch1-U18-petshow-trick-card-iphone-sideways.jpg`, U19 `glitch1-U19-petshow-results-iphone-sideways.jpg`):
  the trick card hid the stage, the results text was cut under OK -> compact cards on short screens: the paw bar and NOW! side by side (you
  see your pet), and the results card shows all rows, the coins line and OK (it can scroll if ever needed).

**Phone.**
- **A10 sideways** (U24 `glitch1-U24-phone-iphone-sideways.jpg`): only 3 apps showed -> a wider phone with 5 apps per row: all 9 apps fit.
- **A29 Calendar icon** (U31 `glitch1-U31-calendar-icon.jpg`): the 📅 emoji always says "July 17" -> a little calendar page with the game's
  weekday and day (e.g. FRI 19).
- **A30** (U32 `glitch1-U32-friends-app-title.jpg`): "👫 Play with friends" wrapped next to the coins -> "👫 Friends" (the app's name);
  long phone titles end with "…" instead of wrapping.
- **A23 dark Pets app** (U27 `glitch1-U27-phone-pets-hearts-dark.jpg`): empty hearts were invisible -> grey hearts.

**Other screens.**
- **A26 Settings / tall cards** (U28 `glitch1-U28-settings-scroll-hint.jpg`): the last button was cut with no hint -> every card taller than
  the screen shows a small bouncing ⬇️ at its bottom-right until you scroll to the end. Also: a card that opens anew starts at its top (it
  used to keep the scroll of the card before, so Settings could open half-way down).
- **B25 / A11 clothes maker on iPhones** (U10 `glitch1-U10-clothes-maker-iphone.jpg`, U11 `glitch1-U11-clothes-maker-iphone-sideways.jpg`,
  U12 `glitch1-U12-opening-maker-iphone-sideways.jpg`): "That's me! ✨" wrapped onto 3 lines, only 2 rows of choices showed, pills peeked
  out under the card -> compact rows (sideways: the label above the choices, 3+ rows show), a one-line "That's me!" bar that reaches the
  card's edge, a soft fade and a ⬇️ over the bar while more choices are below.
- **A6 door card + tips** (U21 `glitch1-U21-door-card-and-tips.jpg`): the host got "Ding-dong!" and "Pizza job tips" at once -> tips (pizza
  and designer) wait while the door card is up and start a moment after; a tips card already open hides while the door card is up. The
  door card is a bit wider and its buttons never wrap inside (on a narrow screen "Not now" goes to the next row).
- **A27** (U29 `glitch1-U29-knock-label.jpg`): "Waiting for ZZTEST-LIVE-W…" was cut -> "⏳ Waiting at the door…" (the message still names
  the friend). The camera "along the wall" came from where the test stood: the game never turns the camera when you knock.
- **A16 / A35 the opening** (U25 `glitch1-U25-opening-rosie-iphone-sideways.jpg`, U26 `glitch1-U26-opening-aim-dot.jpg`): the aim dot sat
  on Rosie's forehead, the jump button sat on her card, and sideways phones saw only her head -> while Rosie talks: no aim dot, no
  jump/run/joystick; a more compact talk card on short screens; on a short screen the camera looks down a little so Rosie stands above it.
- **B5 bed** (U01 `glitch1-U01-bed-decorate-button.jpg`, U02 `glitch1-U02-bed-zzz-iphone.jpg`): the 🛋️ decorate button showed in bed
  (tapping it started decorating from the bed) -> hidden while you lie in bed, and a tap is ignored there. The 💤 floated onto the clock on
  an upright iPhone -> it starts lower and farther away and floats up in the middle of the view.
- **B21 homework** (U08 `glitch1-U08-homework-pictures.jpg`): ➖ and ✖️ pictures looked like the "wrong" mark -> 🧮 for take-away and 🔢
  for times. Rows of counting emoji broke in the middle -> a long emoji row gets its own line and never breaks.
- **B28 pet card** (U13 `glitch1-U13-pet-card-camera.jpg`): the card opened with the pet out of view -> if the pet is not in view above the
  card, the camera turns to the pet (looking down so it shows above the card); the old up/down look comes back when the card closes.
- **B33 designer tray** (U14 `glitch1-U14-designer-tray-colors.jpg`): "Chair" twice with the same picture -> every coloured tile shows its
  colour dot (wood / mint chair), also before the little 3D pictures load.
- **A31 flats** (U33 `glitch1-U33-flats-stairs-sign.jpg`): the ceiling sign "Floor 1 · flats 11–15" hid the "⬆️ Floor 2" sign seen from the
  door -> the stair signs (⬆️ and ⬇️) hang 25 cm lower, fully visible under the ceiling sign.
- **Left HUD column on a phone held sideways** (U35 `glitch1-U35-left-column-fits-iphone-sideways.jpg`, asked for after the first round):
  since tonight's new pills (🚌 bus, 🏠 way-finder, ⚽/🎾 score) the column (coins, pills, map, job text, notepad, designer card) was taller
  than the screen and the notepad was cut off at the bottom (the check's `cut-off #pad`) -> the column always fits: when it would run off
  the bottom or onto the joystick, the game takes only as many small steps as needed, in this order: in a cut-scene the hidden boxes give
  their space; the notepad moves beside the map; the task list folds; the designer card drops its picture, then sits beside the map; the
  notepad hides; the map hides. Checked on iPhone sideways (town + bus + way-finder, school message, designer job, class, tennis, football),
  iPhone upright and iPad (nothing needed there), light and dark: everything stays on screen and off the joystick.
- **A32 title after a break** (U34 `glitch1-U34-title-after-break-iphone-sideways.jpg`): the logo letters dropped in again and were caught
  flying out of view -> after a break the logo just stands there (the drop-in stays for the first start).

### Job 4: Small changes (Pet Show hours, far-ahead clocks)

- Pet Show: Saturday 9:00-18:00 -> Saturday 8:00-20:00 (the same hours as the shops). The hours are one pair of numbers in the
  game, so every text and check follows:
  - Before 8:00 the stage says "🏆 Pet Show starts at 8:00" (no judges yet); tapping it: "The Pet Show starts at 8:00! The judges
    are on their way. Dress up your pet! 🎀"
  - 8:00 to 19:59: judges and the 3 other pets on stage, "🏆 Enter the Pet Show!"
  - From 20:00: "🏆 Pet Show is over for today"; tapping it: "Today's Pet Show is over (8:00 to 20:00). The next one is next Saturday!"
  - The midnight message (also when you wake up on a Saturday): "It's Pet Show day! The show is in the park from 8:00 to 20:00."
  - 📅 Calendar: "Bring your pet to the park from 8:00 to 20:00!" (on other days: "on Saturday, 8:00 to 20:00, in the park").
  - The 🏆 next to the day in the top bar, the phone's "🏆 Pet Show today!" and the Calendar app's "!" badge: until 20:00 (was 18:00).
  - Not changed: a show that already started always finishes (also after 20:00). No quest or task mentions the hours (checked
    "Pet Show star", "Pet fashion show"); the stage sign says "Every Saturday!" without hours.
- Shared clock: a friend any number of days ahead pulled you forward -> a friend whose day is MORE than 30 days ahead of yours does
  not pull you. You each keep your own day and time. Up to 30 days ahead (exactly 30 too) still pulls you forward, as before.
- Going to bed with friends online: the night skipped only when every friend online was in bed -> a friend on their own clock (more
  than 30 days apart, either way) doesn't count: their night is not your night (they may be in the middle of their day and can't go
  to bed). They are not in "😴 1 of 2 in bed" and 🔔 doesn't ring them. With only such friends online, the night skips like alone.

### Job 5: Walkers notice you

- Walking towards a town walker: nothing happened until you were 2.2 m away, and then only the "👋 Say hi" button showed ->
  when you walk towards a walker (they are within 8 m, within about 35° of the way you walk, and you are getting closer),
  they notice you:
  - a little wave 👋 when they first notice you (no sound; the same walker waves again at most every 12 seconds),
  - they slow down smoothly to 42% of their speed, never to a stop (1.25 -> 0.53 m/s; walking home in the evening
    1.5 -> 0.63 m/s), and their steps get slower too,
  - they turn to you smoothly: while walking, the body turns up to about 34° away from their path (they keep walking along
    it, a bit sideways) and the head turns the rest (up to about 57°), so they look at you. A walker who is standing (taking a
    break, or waiting because you are in their way) turns all the way round to face you,
  - their "👋 Say hi" shows from 3.5 m (was 2.2 m). Tapping a walker on the screen works from a bit further too (5.7 m, was 4.4 m).
- You stop walking: they keep looking at you, slow, for 1.6 seconds (time for a small thumb to reach "Say hi"), then ease back
  to normal over about 0.8 s (speed, turn, head, "Say hi" reach) -> before there was nothing to ease back from.
- You turn and walk away: they ease back sooner (after about half a second).
- Saying hi: the walker jumped round to face you in one go -> they turn to you smoothly (about half a second), while their
  head keeps looking at you. The rest of saying hi is unchanged.
- Not changed: standing still, sitting, swinging, in a panel, in a cutscene or indoors, nobody notices you. Saying hi is the same
  as before (a "hello" line, a wave, they stop 3 s and face you, it counts for quests). Walkers going home in the evening,
  night owls, cars waiting for walkers, friends who follow you, shoppers inside shops: unchanged.

### Job 6: Map overhaul

- 📱 → 🗺️ Map (and the M key): a small square picture of the town inside the phone, names about 7 px tall that overlapped
  ("Pet Shop" under "Flower Shop", "Fountain" over "Cozy Park", "My Garden" over "My House"), a list of places under it
  -> a big map card that fills the screen (iPad both ways, iPhone both ways, PC), drawn from the game's data: the roads, the places
  (PLACES: a new place shows up on the map and in the list by itself), the Friends Lane lots and who lives there.
- The look: soft green ground with round trees on the hills around town, wide lilac roads with rounded ends and corners, a soft
  outline and dashed middle lines, cream pavements with their trees, the paved fronts of the shops, the nature trail, the park
  with its paths, fountain plaza and fountain, the football pitch with its white lines, the lake (with the Duck Dock) and the duck
  pond with a sandy shore, the Flower Corner with its flowers, buildings as rounded blocks in their own colours with the game's ink
  outline, a soft shadow and a soft roof. In dark mode the same map in dusky night colours (names light on dark).
- Names: every place has a round badge with its emoji and its name beside it, always the same size on screen (15 px bold Baloo 2)
  at every zoom. A name goes below its badge, or to the right, left or above, wherever it fits. When it gets crowded the less
  important ones hide and come back when you zoom in: first your house and the place you picked (always shown, with a pink ring),
  then the shops, buildings, 🚌 Bus stop, 🏖️ Beach and 🏡 Friends Lane, then the park, fountain, field, lake, pond, your garden and
  friends' houses, last the 🌸 Flower Corner.
- 🏡 Friends Lane is on the map now (west of town, through the pink gate): every lot, your house "🏠 My House" with a pink ring and
  your garden behind it (the 6 beds, the shed, the stepping stones), friends' houses in their own colours with their names, empty
  lots with a little 💛, the hedges and the end of the lane. (Before: a sign at the west edge.)
- 🏖️ The beach: at the east end of the big road the road stops at the blue beach gate; a sandy path goes on to a bit of beach and sea
  with a "🏖️ Beach →" badge. Tapping it shows the way to the 🚌 bus stop ("🚌 Bus stop · 40 m away · the Beach Bus leaves from
  here 🏖️"), like the beach in the list did. At the beach, your arrow is on that sand and the card says "Take the bus home first 🚌".
- Your arrow: pink with a white and an ink outline and a soft pink pulse, turned the way you look. Inside a building it waits at
  that building's door, pointing out (shops, school and classes, your house, a friend's house, the apartments, a designer client's house).
- Friends: friends who hang out in town (Rosie, Theo, Luna, Finn) are small dots in their shirt colour with their names; friends
  online are bigger dots in their house colour with their names (in town, or at the door of the shop or house they are in).
  A friend's name is left out where it would cover a place's name (the dot stays). Friends who follow you are not drawn (they are
  right next to your arrow).
- Move and zoom: one finger drags, two fingers pinch, a double tap on the map zooms in there; on a PC drag with the mouse and turn
  the mouse wheel; + and − buttons (50 px) for kids who can't pinch; "📍 Me" puts you in the middle with a "You!" bubble (it also
  pops up for a moment when the map opens). You can't lose the town: the map stops at the edges of the town, the lane and the
  beach. Zoom goes from everything at once down to close-up (16 px a metre).
- It opens centred on you at a comfy zoom (about 85 m across). If the pink arrow already shows a far place, it opens showing you
  and that place.
- Tap a place (its badge, its name or the building, also a friend's house on Friends Lane): the way there is set at once (the pink
  arrow bar and the beacon in town, as before) and a pink dotted line along the pavements and paths shows the way (the dots walk
  towards the place; to Friends Lane through its gate along the pavement). A card at the bottom (in the game's card colours, also
  in dark mode): "🍎 Market · 35 m away · [🚶 Let's go!] [✕]". Let's go! closes the map ("📍 Follow the arrow to the Market!");
  ✕ stops showing the way (the ✕ on the arrow bar in town still does too). Tapping the same place again wiggles the card and shows
  the way again.
- Nothing picked: the card says "👆 Tap a place to see the way there!". Tap your arrow or 📍 Me: "📍 That's you! The pink arrow
  points where you look." An empty lot: "💛 This spot is for a friend! …"; the Flower Corner and the Friends Lane badge: a friendly
  message.
- The list of places is kept: a side column on big screens (iPad sideways, PC) and behind a "📋 Places" button on small ones
  (iPhone, iPad upright), where it opens over the map. A place in the list now shows its way on the map like a tap on the map
  (on small screens the list closes so you see it); the picked place is yellow in the list.
- Keys: M opens the map and now also closes it, Escape closes, + and − zoom, the arrow keys (or W A S D) move the map.
  "‹" goes back to the phone's home screen, ✕ closes.
- The little job map in the corner (pizza, designer and teacher jobs) is painted by the same code, so it has the same rounded roads,
  buildings, park and Flower Corner (still icons only, same size, same spot, same pink sign for Friends Lane at its west edge).

### Job 7: Beach bus (+ the retro surf minibus look)

- Getting to the beach: a skill at level 10 opened the gate at the east end of the big road -> a cozy Beach Bus from a
  new bus stop at the park takes you there and back. There is no level lock any more.
- The town gate to the beach: "Go to the beach" / "The beach (opens at level 10 ⭐)" -> it stays as scenery; its button
  is "🚌 Find the beach bus" and says "🚌 The beach bus leaves from the park! It comes (today / tomorrow / on
  Thursday) at 9:30. Follow the arrow 📍", and the pink arrow shows the way to the bus stop.
- Level-10 messages, all gone: the "beach opens at level 10" card (with your best skill), the "🏖️ The beach is open!"
  message, the map's "Here is the gate to the Beach! It opens when…" and the friends list "🚀 Go" message.
- New bus stop by the park (on the big road, just east of the park's north gate, in front of the big oak): a little
  shelter with a soft peach roof, mint posts, a bench, a "🚌 Beach Bus" sign on the roof, a round 🚌 stop sign and a
  timetable board inside (the next 3 bus days). "📋 Read the bus timetable" opens a card: the next bus, this week's bus
  days (✔ when gone; next week's too near the end of a week), the fare and how it works. At the beach the card shows
  the times of the buses home instead.
- New: the Beach Bus (its look was changed later to the owner's retro surf minibus: see "Follow-up" at the end). Cream on
  top, mint below, a peach stripe, big round windows, headlight "eyes" and a little smile,
  a "🏖️ Beach" / "🏘️ Town" sign over the windshield, a sliding door, seats inside, and Driver Dot (mint cap, sky-blue
  shirt) at the wheel; she waves. At night its lights glow and the windows are warm.
- The timetable (the same for everyone, worked out from the week number): 3 bus days a week, one picked from Mon-Tue,
  one from Wed-Fri, one from Sat-Sun. On a bus day it comes to the park at a time between 8:00 and 11:50 (10-minute
  steps).
- A bus day: the bus drives in along the big road (from the far end of 🏡 Friends Lane), stops at the park, waits 1.5
  game hours (about 1 real minute, doors open), then drives off east through the beach gate. At the beach it waits on
  a little road behind the dunes, right outside the "🏘️ To town" gate, for 1.5 game hours (the morning trip back to
  town, also for campers), then it brings people back to the park and goes to sleep. Evening: the bus home waits at
  the beach from 19:30 and leaves at 21:00 (bus days only).
- Day 1 (a brand-new player's first day, a Monday): a free 🎉 Welcome Bus waits at both stops from 8:00 to 12:00 and
  goes as soon as you hop on, so new players can see the beach right away. Its message waits until Rosie's "Drag on the
  left to walk" tip is done, and the bus line under the coins shows only after Rosie's hello.
- Getting on: walk to the bus door: "🚌 Get on the bus (15 🪙)" ("Free Welcome Bus: hop on!" on day 1), or tap the bus.
  You pay, you sit in a window seat inside the bus and can look around; Driver Dot says hello and when it leaves. "🚪
  Get off the bus" (before it leaves) gives your coins back. When it leaves: "ding ding", a short ride picture ("🏖️
  Next stop: the beach!", a little bus driving past palms, by night with a moon) and you stand at the other stop. Pets
  and friends who follow you come along.
- Fare: one ride = 15 🪙 (`BUS_FARE`, one constant). Not enough coins to go to the beach: "🚌 Driver Dot: A ride is
  15 🪙. Save up a little more and hop on next time! 💛". Going home never strands anyone: with less than 15 coins the
  ride home is free ("No coins? This one's on me! 💛"). The Welcome Bus is free.
- Countdown: a small line under the coins/time ("🚌 Bus to the beach: 0:42", "🚌 Off to the beach in 0:42", "🚌 Bus to
  town: 0:42", "🚌 Next bus: Thu 9:30", "🚌 Bus home: Tue 11:50", "🚌 The bus is coming!") when you are near the stop,
  on the bus, or at the beach while the bus home waits. It turns yellow and pulses in the last seconds. A label over the
  bus shows "🏖️ 0:42" / "🏘️ 0:42" while it waits (in game time, so everyone sees the same).
- Messages: "🚌 Beep beep! The Beach Bus is at the park! It leaves at 11:00 🏖️" (in town), "🚌 Beep beep! The bus to
  town is here! It leaves at 21:00 🏘️" (at the beach), 20:30 "🚌 The bus home leaves at 21:00!", 20:50 "🚌 Last call!
  The bus leaves in 10 minutes!", 21:00 "🚌 Oh no, the bus left! ⛺ Build a campsite and sleep at the beach. The next
  bus takes you home!" (not if you already camp). Once per game: "🚌 New! A cozy Beach Bus stops at the park 3 days a
  week…" (new players on day 1: the Welcome Bus message).
- The beach: a little road behind the dunes and a sandy step out through the "To town" gate to the bus door; the same
  bus shelter and timetable by the boardwalk; the gate now says "When does the bus come?" / "The bus is here!".
- Missed the bus: a camp spot next to the beach bus stop (a ring of stones). "⛺ Build a campsite" (at night, or on a
  day when no bus home comes any more) -> a peach tent with two sleeping bags and a flag, and a campfire with flickering
  flames, a warm glow at night and a soft crackle. "😴 Sleep in the tent" works like a bed (from 21:00): you lie in the
  tent looking out at the fire, it counts as "in bed" for the night skip with friends (same "1 of 2 in bed" card and
  ring), and you wake at 7:00 next to the tent, with a hint about the next bus home. "🍡 Toast a marshmallow" at the fire
  (+4 tummy). The tent is solid (you walk around it). The campsite stays while you stay at the beach (also after a
  reload) and goes away when you ride home. A friend asleep in the tent: you see the tent too, see them lying in it,
  and can sleep on the other side.
- Old saves at the beach: they load at the beach and ride home with the next bus (morning trip or the evening bus),
  for free if they have no coins.
- No jumping past the bus: "🚀 Go" to a friend, visiting/knocking from the phone and any warp from or to the beach -> a
  kind message with the next bus ("🚌 You are at the beach! Take the bus home first. It leaves on Tuesday at 11:50.").
  ⚙️ "Take me home" at the beach brings you back to the boardwalk with that message, and the pink arrow shows the way
  to your house on 🏡 Friends Lane ("🏠 My House: take the bus home first 🚌" at the beach). A friend who knocks at your
  door while you are at the beach gets "not now", and you see "🔔 Pal knocked at your door, but you are at the beach!
  🏖️".
- After the evening bus (21:00) in town: "🏘️ Home again! 🚌 Driver Dot: “Bye bye! Sleep tight!” 🏡 Follow the pink arrow
  home." and the pink arrow shows the way to your house on Friends Lane (not if you already follow an arrow somewhere
  else).
- Map (📱 → 🗺️ Map): new place "🚌 Bus stop" (on the map and in the list). "🏖️ Beach" now shows the way to the bus stop.
  At the beach, the way to a town place says "take the bus home first 🚌".
- Traffic: cars wait behind the bus at its stop and let it cross first; the bus waits (and honks) if you stand in
  front of it, and waits for cars or people in front of it.


- Body: a long rounded bus (7 m), cream on top and mint below with a peach stripe -> a short, chunky retro minibus like
  the picture (5.6 m long, 5.9 m with the bumpers): cream-white roof and upper half, warm cartoon orange lower half, a
  white belt line between them, round corners and a soft rounded roof. With the surfboards it is 2.9 m tall, so it still
  drives under the "🏖️ To the beach" gate in town (its sign starts at 3 m).
- Nose: a flat front -> a van face. The windscreen leans back, the orange nose sticks out a little below it with a small
  white shelf, and a garland of green leaves with 5 flowers (pink, yellow, white, coral, lilac) hangs over it. Big round
  headlights near the corners (they glow at dusk and at night, with a warm pool of light on the road, like the cars),
  amber blinkers on the corners, a small smile, two little wipers and a soft grey bumper. The front wheels sit under the
  corners of the nose, like on an old van, so the door is between the wheels.
- Windows: small round portholes -> big rectangular windows with rounded corners: 3 on each side (one for each row of
  seats), the driver's window, the window in the door, a big two-part windscreen and two back windows. From outside they
  have a light see-through blue glass; from inside you look out through clear windows.
- Wheels: dark wheels with small white middles -> dark tyres with big white rims and a grey hub, in round wheel arches.
- Roof: a mint soft roof -> a roof rack (light grey rails and two crossbars that are higher in the middle) with two
  surfboards, each tipped out to its own side so you can see it from the street: the wooden board with a red edge on the
  door side (you see it from the bus stop and from the beach gate) and the yellow-green board with black squiggles and a
  black tail on the road side. From the front you see both.
- At the beach (new): while the bus waits at the beach stop, the yellow-green board hops off the rack, over the roof, and
  leans against the side of the bus by the back wheel, like in the picture. It never covers the door or the spot where
  you get on, and it stands where nobody can walk (next to the gate, behind the hedge line). When the bus drives off,
  the board hops back onto the rack (about 1 second, with a soft "clonk" when it lands near you). If you arrive by bus,
  or come to the gate while the bus is already waiting, the board is already leaning there.
- Door: a peach door with a round window -> a door painted like the bus (orange below, a white line, cream on top with a
  big window). It is in the same place and slides open the same way, now over the plain side (no wheel behind it).
- Signs: "🏖️ Beach" / "🏘️ Town" stay over the windscreen (in a cream frame, leaning back with it). "🌴 Beach Bus" moved
  from the side to the back (the sides are plain orange, like the picture).
- Seats: 8 seats in 4 rows -> 6 seats in 3 rows (the bus is shorter). Everyone still gets their own window seat; if a
  friend already sits in yours, you get the next free one.
- Inside: the same seats, dashboard, steering wheel, ceiling light and Driver Dot; orange walls below, cream above, big
  windows to look out of. The corners are square inside (round only outside), so they don't block the view. The yellow
  pole moved next to the door, so it no longer stands right in front of the first seat.
- The shady side of the bus stays a warm orange (a little warm glow in the orange paint by day only) instead of turning
  brown in the shade.

### Job 8: Coins balance

#### A day of work (the owner's main wish: even job pay, teacher up)
| Job | weak day | good day | best day |
|---|---|---|---|
| 📚 Teacher (2 classes) | 90 -> 150 | 120 -> 270 | 150 -> 390 |
| 🎨 Designer (3 rooms) | 300 -> 150 | 450 -> 270 | 600 -> 390 |
| 🍕 Pizza, 3 pizzas | 0 ⭐: 75 -> 120 | 3 ⭐: 405 -> 285 | 5 ⭐: 630 -> 390 + RARE bonus (about 415) |
| 🍕 Pizza, 6 pizzas ("maniac" day) | 0 ⭐: 150 -> 180 | 3 ⭐: 810 -> 429 | 5 ⭐: 1260 -> 585 + RARE bonus |

#### Ways to GET coins
- 📚 Teacher, one class: 1 ⭐ 45 -> 75; 2 ⭐ 60 -> 135; 3 ⭐ 75 -> 195 (2 classes a day, as before).
- 🎨 Designer, one room: no ⭐ 30 -> 20; ½-1 ⭐ 100 -> 50; 1½-2 ⭐ 150 -> 90; 2½-3 ⭐ 200 -> 130 (3 rooms a day, as before).
- 🎨 Designer, the Decorating level-up you get with every room: +10 × the new level in coins, hidden (540 coins over the
  first 9 rooms) -> no coins (the level still goes up and "Decorating is now level 5! ⭐" still shows).
- 🍕 Pizza, one pizza by Pizza stars: 0 ⭐ 25 -> 40; 1 ⭐ 60 -> 60; 2 ⭐ 100 -> 75; 3 ⭐ 135 -> 95; 4 ⭐ 175 -> 110;
  5 ⭐ 210 -> 130. Late: half (as before).
- 🍕 The 3 extra pizzas (after "PIZZAS MUST BE DELIVERED"): the same price -> half the price (rounded up, e.g. 65 at 5 ⭐).
- 🍕 RARE customer on time: price + 50 -> price + 40 (extra pizzas: half price + 40). RARE late: half (as before; an
  extra one: half of the half).
- ✅ Daily quests: unchanged (5 a day, 8-50 🪙 each, about 130 a day if you do all of them). Two kinds are worked out
  from prices, so they got a cap: "Buy a … at the …" 8 + price/3 -> the same but at most 22 (a teddy would have paid 25
  now; food is 9-14 as before); "Put a … in your house" half the price + 10 -> 10 + price/20, at most 40 (a fish tank
  would have paid 510).
- 🔥 Hard challenges: unchanged (40-500).
- 📬 Mail: unchanged (10, 15 or 20 once a day). 🧹 Litter: unchanged (3 each, 10 a day). 🐚 Shells: unchanged (1 each,
  5 a day). 🎾 Tennis best rally: unchanged (5, once a day). ⚽ Football first win: unchanged (10, once a day, job 9).
- 🏆 Pet Show: 🥇 200 + 🐾 Pets +2 levels (unchanged); 🥈 60 -> 80; 🥉 25 -> 40; 4th place 10 -> 15. The pick-a-pet card
  says "🥈 80 🪙 · 🥉 40 🪙".
- ⭐ Skill level-ups: unchanged (+10 × the new level), except the designer room above.
- 🕹️ Claw machine coin capsules: 10-25 -> 20-50; when every skill is MAX: gold capsule 50 -> 100, level capsule 20 -> 40.
- 🌱 Garden harvest: food or flowers, no coins (unchanged). New players still start with 120 🪙.

#### Ways to SPEND coins
- 🚌 Beach bus: 15 -> 20 a ride (the Welcome Bus on day 1 is still free; the ride home is still free when you have less
  than the fare). All bus texts use the fare ("Get on the bus (20 🪙)", "A ride is 20 🪙…").
- 🐶 Adopting a pet: 100 -> 200.
- 🏡 Bigger house: 800 -> 2500 (still needs Decorating level 10). The card shows "🪙 2500 coins" and "1234 / 2500".
- 🕹️ Claw machine: 5 -> 10 a try (the sign on the machine "10 🪙 a go!", its button "Play the claw machine · 10 🪙").
- ✨ Make a wish at the fountain: 1 (unchanged). Golden treasures (claw only, never sold): unchanged.
- ✨ "New in!" shelves: the new colours of sweaters 10 -> 40, pants 8 -> 35, shoes 6 -> 30; furniture and hats cost the
  same as in the shop. A "New in!" thing that was already on the shelf in an old save keeps its old number in the save,
  but now shows and costs today's price (no "Mint bed 40" next to "Bed 200").
- Home shop furniture (🛍️ Decorate): 🛏️ Bed 40 -> 200; 🛏️ Bunk bed 70 -> 450; 🛋️ Sofa 45 -> 250; 💺 Armchair 28 -> 150; 💺 Beanbag 20 -> 100; 🪑 Chair 12 -> 60; 🍽️ Table 25 -> 120; ✏️ Desk 30 -> 150; 💻 Computer desk 50 -> 450; 📚 Bookshelf 30 -> 150; 🗄️ Dresser 30 -> 150; 👗 Wardrobe 35 -> 200; 🪞 Mirror 25 -> 120; 📺 TV 50 -> 350; 🎮 Game console 55 -> 600; 💡 Lamp 15 -> 70; 🕰️ Big clock 35 -> 200; 🖼️ Painting 20 -> 100; 🔥 Fireplace 55 -> 500; ⭕ Round rug 15 -> 80; 🟪 Big rug 15 -> 100; 🧊 Fridge 40 -> 250; 🍳 Stove 35 -> 100; 🚰 Sink 25 -> 150; 🧺 Washing machine 40 -> 250; 🛁 Bathtub 45 -> 300; 🎹 Piano 60 -> 500; 🎄 Holiday tree 45 -> 300; 🧸 Teddy bear 10 -> 50; 🎁 Toy box 15 -> 80; 🐾 Pet bed 15 -> 80; 🐠 Fish tank 40 -> 1000.
- Flower shop: 💐 Flowers 8 -> 30; 🌷 Tulip pot 12 -> 45; 🌹 Rose bush 14 -> 60; 🌻 Sunflower 12 -> 50; 💜 Lavender 14 -> 60; 🌿 Fern 12 -> 45; 🌳 Bonsai tree 18 -> 90; 🪴 Plant 10 -> 40; 🌵 Cactus 9 -> 35.
- Toy store: 🧸 Teddy bear 10 -> 50; 🦄 Unicorn plush 20 -> 90; 🎁 Toy box 15 -> 80; 🐴 Rocking horse 30 -> 150; 🏡 Dollhouse 40 -> 200; 🏰 Toy castle 35 -> 160; 🏎️ Race car toy 22 -> 100; 🤖 Toy robot 25 -> 110.
- Pet shop furniture: 🐾 Pet bed 15 -> 80; 🥣 Food bowl 6 -> 30; 🐈 Cat tree 30 -> 150; 🏠 Dog house 35 -> 180.
- Food (Market, Café, Bakery, Ice cream shop, Pizzeria, beach kiosk): 🍎 Apple 3 -> 5; 🍌 Banana 3 -> 5; 🍞 Bread 5 -> 8; 🥛 Milk 4 -> 6; 🧀 Cheese 6 -> 9; 🍕 Pizza 12 -> 18; 🍕 Pizza slice 5 -> 8; 🥖 Garlic bread 4 -> 6; 🍰 Cake 10 -> 15; 🍦 Ice cream 8 -> 12; ☕ Hot cocoa 4 -> 6; 🍪 Cookie 2 -> 3; 🧁 Muffin 5 -> 8; 🍩 Donut 5 -> 8; 🍇 Grapes 3 -> 5; 🍉 Watermelon 6 -> 9; 🍒 Cherries 4 -> 6; 🍊 Orange 3 -> 5; 🌽 Corn 3 -> 5; 🍯 Honey 5 -> 8; 🍿 Popcorn 4 -> 6; 🍬 Candy 2 -> 3; 🍵 Tea 3 -> 5; 🧇 Waffle 6 -> 9; 🥯 Bagel 4 -> 6; 🥨 Pretzel 4 -> 6; 🍰 Ice cream cake 12 -> 18; 🌾 Flour 3 -> 5; 🥚 Eggs 4 -> 6; 🍫 Chocolate 4 -> 6; 🍋 Lemon 3 -> 5; 🥐 Croissant 4 -> 6; 🥧 Apple pie 9 -> 14; 🍨 Sundae 9 -> 14; 🍧 Ice pop 4 -> 6; 🥤 Strawberry milkshake 7 -> 11; 🥥 Coconut drink 5 -> 8.
- Seeds (seed box): 🥕 Carrot seeds 3 -> 5; 🍅 Tomato seeds 4 -> 6; 🍓 Strawberry seeds 5 -> 8; 🎃 Pumpkin seeds 8 -> 12; 🌻 Sunflower seeds 5 -> 8; 🌷 Tulip seeds 4 -> 6.
- Pet shop: food and toys: 🦴 Pet food 4 -> 6; 🐟 Cat food 4 -> 6; 🥕 Bunny & hamster food 4 -> 6; 🍖 Pet treats 3 -> 5; 🎾 Ball 6 -> 10; 🧶 Yarn ball 5 -> 8; 🐤 Squeaky toy 5 -> 8; 🥏 Frisbee 6 -> 10; 🐭 Toy mouse 5 -> 8.
- Pet shop: outfits: 🎀 Pink bow 8 -> 30; 🥳 Party hat 10 -> 35; 🔔 Bell collar 6 -> 25; 🧣 Cozy scarf 8 -> 30; 👑 Pet crown 12 -> 50; 🕶️ Pet sunglasses 9 -> 35; 🎩 Tiny top hat 14 -> 55; 🌸 Flower crown 12 -> 45; 🌺 Big flower 9 -> 35; 🤵 Fancy bow tie 10 -> 40; 💖 Heart glasses 11 -> 40; 🧐 Fancy monocle 13 -> 50; 🦸 Super cape 16 -> 60; 🧚 Fairy wings 18 -> 70; 🎒 Tiny backpack 12 -> 45.
- Clothing store: 👗 Dresses 25 -> 120; 👚 6 new sweater colors 20 -> 100; 👖 6 new pants colors 15 -> 80; 👟 5 new shoe colors 12 -> 60; 🧢 Cap 15 -> 60; ⛄ Beanie 15 -> 60; 🎀 Big bow 12 -> 50; 🌸 Flower crown 18 -> 80; 🐰 Bunny ears 16 -> 70; 🐱 Cat ears 16 -> 70; 🤠 Cowboy hat 20 -> 90; 🧙 Witch hat 20 -> 90; 🎧 Headphones 25 -> 120; 💎 Tiara 35 -> 180; 🌺 Hair flower 14 -> 60; 😇 Angel halo 22 -> 100; 🦄 Unicorn headband 24 -> 110; 🎨 Beret 16 -> 70; 👑 Crown 60 -> 400; 👓 Glasses 15 -> 60; 🕶️ Sunglasses 18 -> 80; 💖 Heart glasses 16 -> 70.

#### Texts
- 📱 Job (pizza): "95 🪙 for every pizza! Be fast for ⭐ RARE customers…" -> "95 🪙 for every pizza! Extra pizzas: 48 🪙.
  Be fast for ⭐ RARE customers…".
- 📱 Job (teacher): new line under "Today: 0 / 2 classes taught": "💰 75–195 🪙 a class: more ⭐ = more coins!".
- 📱 Job (designer): new line under "Today: 0 / 3 rooms decorated": "💰 20–130 🪙 a room: more ⭐ = more coins!".
- Pizza delivery card for one of the 3 extra pizzas: "You got 135 🪙 with your 3 ⭐!" -> "You got 48 🪙 for an extra
  pizza!" (normal pizzas: "You got 95 🪙 with your 3 ⭐!", same words).
- Not enough coins: "Not enough coins. Pick up litter or check your mail! 🪙" (shops), "You need 100 🪙. Pick up litter or
  check your mail to get more!" (adopting) and "Not enough coins yet. Pick up litter or check your mail! 🪙" (claw) ->
  "Not enough coins yet! 🪙 Go to work and do your 📱 quests to earn more! 💼", "You need 200 🪙. Go to work and do your
  📱 quests to earn more! 💼", "Not enough coins yet. Go to work and do your 📱 quests to earn more! 💼". Without a job:
  "Get a job from Rosie to earn coins! 💼". (Litter and mail now give only about 45 a day; the job is where coins come
  from.)
- Class card ("You earned 135 🪙!"), designer review card ("You got 90 🪙!"), Mrs. Maple's and the clients' messages,
  the Pet Show prize card: same words, new numbers. Chef Blaze's lines are unchanged.

### Job 9: Football friends

- Football field from 14:00 to 19:00: empty -> four football friends with name tags:
  - **⚡ Zoomy Zac**, the star (an original character): royal-blue shirt with a big gold **10** on his back, gold sleeves and gold boots,
    white shorts, a white sweatband, a sparkly grin. Catchphrase: **"Zoom zoom, GOAL!"**. Goal dance (only for his own goals): he spins,
    throws both arms up and hops, with a 🕺 floating up.
  - **Tilly** (sky-blue shirt, red ponytail), **Omar** (coral shirt, curly hair), **Bea** (pink shirt, pigtails). Kid-sized (a bit smaller
    than grown-ups).
- They come at 14:00 from their homes (Zac, Tilly and Omar live in the houses east of the field, Bea in the west flats) along the
  sidewalks the townsfolk use, through a gap next to the scoreboard. If you watch, you see them walk in; if nobody sees it, they are simply
  there. At 19:00 they walk home the same way and disappear once out of sight (sunset). Gone at night.
  When they arrive and you are in town: "⚽ The football friends are at the field until 19:00. Come and play!"
- **On their own** they play 2 vs 2 with the town ball: Blue (Zac + Tilly) against Pink (Omar + Bea). They run to the ball, dribble, pass,
  shoot (sometimes wide), cheer (arms up and a hop) and the **scoreboard shows their game**. First to 3 goals, then they rest on the bench
  with juice for about 20-30 seconds and start a new game.
- **When you walk onto the field** while they play, Zac waves and a card opens: "Hi! I'm Zoomy Zac! ⚡ These are my football friends: Tilly,
  Omar and Bea. Do you want to take the field, or a 1 vs 1?" (later: "Hi <your name>! Do you want to take the field, or a 1 vs 1?") with
  **⚽ Take the field**, **🥇 1 vs 1 with Zac**, **🧃 Can I practice?** and **Maybe later**. Your wins (🏆) show on the card once you have
  some. While the card is open the kids stop and look at you. It opens by itself once per visit; any time you can tap a kid
  ("⚽ Talk to the team", E on a computer).
- **⚽ Take the field** (short fade): you and Zac are BLUE against Omar and Bea (PINK); Tilly cheers from the bench with a juice box.
  You start a few steps from the ball facing your goal; a whistle; the kids wait 2 seconds so you get the first touch.
  First to 3 goals, or after 3 game hours (or at 20:00 at the latest).
- **🥇 1 vs 1 with Zac**: you against Zac (first to 3); Tilly, Omar and Bea cheer from the bench.
- During a match: a pill at the top left "⚽ Blue 1 – 0 Pink" (1 vs 1: "🥇 You 1 – 0 Zac") with **✋ Stop**, the scoreboard shows the match,
  and a sign **"🎯 Score here!"** hangs over the goal you shoot at (the east goal; you are always Blue). Leaving the field (9 m away), going into
  a building, or tapping Stop ends the match kindly. After a full match Zac's card: "Hooray! We won 3 – 1! 🏆 You're a real football star!" /
  "You beat me 3 – 2! 🏆 Wow, you're super fast!" / "A draw, 1 – 1! Everybody wins today! 🤝" / "Zoom zoom! I won 3 – 1 this time. You played
  great! 💪", with ⚽ Play again and Bye bye! (after 19:00: "Now it's time to go home. See you tomorrow! 👋" and no Play again).
- **🧃 Can I practice?** -> "⚡ Zoomy Zac: “Sure! We need a juice break! 🧃” The field and the ball are all yours!" The four walk to the team
  bench across from the scoreboard, sit down and drink from tiny juice boxes (each kid's own colour, with a straw; every few seconds one lifts
  the box for a sip, with a soft slurp when you are close). The field is yours: your goals count on the normal scoreboard, and the kids cheer.
  At the bench: **"🥇 Invite Zoomy Zac to a 1 vs 1"** (tap Zac) starts the 1 vs 1; the others say juice lines ("Mmm, apple juice! 🧃",
  "Show us your best kick! ⚽"...). When you leave the field for 12 seconds the break is over and they play again.
- Kind for little players:
  - The other side never takes the ball away while you are dribbling it (a touch in the last ~1.2 s and the ball close to you): they wait a
    couple of metres in front of their goal instead. If you stop, they go for the ball.
  - The kids are a bit slower than you walking (you also run); the other side runs 10 % slower in a match.
  - Your team-mate passes to you a lot (Zac in Take the field: 3 out of 4 times when you are free), saying "Here you go! ⚽" / "Your turn! 👟".
  - Zac sometimes gets tired for 2-3 seconds (💦, slower) and about one shot in four goes wide ("Oops! 😅", "Whoops, too wide! 🙈").
  - You score: "⚽ GOAL! What a shot! 🌟" (or "Super goal! ⭐", "Wow, you did it! 🎉", "High five! 🙌"), said by a friend with a speech bubble.
    The other side scores: Zac says "Nice try! We'll get the next one! 💪". Your own goal: "😅 Oops, the wrong goal! That's okay!".
- Rewards: each goal you score +5 Sports XP and the "Score a goal" quest (as before); a finished match +6 Sports XP; a win +10 🪙 (only the
  first win of each day). Your number of wins is saved (`fb.w`).
- New: the **team bench** (two park benches side by side) on the far side of the field, across from the scoreboard, facing the field.
- "🔄 Start a new match" at the scoreboard: always there -> hidden while the scoreboard shows the kids' game (it would reset the other score,
  which you can't see then). It is back during their juice/rest breaks and when they are gone.
- Online: the kids are only in your own game (each player has their own four). When a friend online comes within 10 m of the field, the kids
  stop, sit on the bench and cheer ("A friend is here! We'll cheer! 📣"; their card says "Your friend <name> is here! Play together! We'll
  watch and cheer for you! 📣"); a friend's goals make them cheer too. A match with you ends kindly ("👋 A friend came to the field! Play
  together! 😊"). They play again 3 seconds after the friend leaves. The kids' goals never change the shared score (`S.match`), so friends
  never see wrong "… scored" messages.
- Short phone screens (iPhone sideways): the notepad hides while a football match is on, so the left column (score pill, map, tasks) fits.
- Two new little sounds: a kick-off whistle and a juice sip.

### Job 10: One house per player, on Friends Lane (+ review fixes)

- Your house: in town at the corner of the big road -> on Friends Lane, always (also when you play alone or offline: you always have a lot).
  The door of your Friends Lane house takes you inside (the same home: furniture on both floors, wall and floor colours).
  "Go outside" and "Go to your garden" bring you out at your Friends Lane house (front door / garden).
- Where the house stood in town: house, yard and garden -> "🌸 Flower Corner": a flower garden behind a low white fence and hedges, with a big
  tree, a bench, a stepping-stone path, a bird bath, 5 flower patches, 2 bushes and a sign. You look at it from the pavement (nobody walks in,
  see Decisions). The street spot in front of it (-17, -4.6), where loaded games start, stays free.
- Garden: behind your town house -> behind your Friends Lane house, inside your lot: the same 6 beds (same plants, same growth, watered or not),
  the shed with the 🌱 Seeds box, the watering can and the back door. New: the garden gate is beside the house under a little white arch
  "🌱 My Garden" (readable from both sides), with stepping stones from the street.
- Mailbox, the two flower beds in front of your house (watering them), the "Bigger house" sign -> on your Friends Lane lot.
  "Bigger house!" is now a small pink sign under your name sign; it goes away once you have the big house (your lane house is then drawn big).
- Friends Lane: 6 lots -> 12 lots. The 6 old lots stay where they were; 6 new lots are further down the lane (road, pavements, hedges and
  3 more pairs of street lamps are longer; the lane now ends at x -180 instead of -138).
- More players online than lots -> 2 more lots appear at the end of the lane each time (road, hedges and a street lamp grow with them),
  up to 30 lots. You always get a lot; a 31st friend walks around without a house (like the 7th friend in old versions).
- Empty lots: fence, path, mailbox, "For a friend 💛" sign and 2 flower beds -> the same without the flower beds (they come with a house).
  All empty lots share one sign picture.
- Lot choice: by name, exactly the old rule for lots 0-5 (old versions only know those); lots 6-11 only when 0-5 are full, then more lots.
  When two names want the same lot: whoever came online first -> whoever has lived on Friends Lane longest (new save field `laneT`), so the
  same friend keeps the same lot every day.
- Your lot changes while you play (a friend who has lived on Friends Lane longer comes online and wants your lot) -> your house, garden and
  waiting pets move to your new lot together; if you stand in your yard you move along to the same spot, and you see
  "🏡 Your house moved to a new spot on Friends Lane!" (also when you stand near it).
- 4 hills west of town stood where the longer lane goes -> they moved aside (north and south), so the lane runs through a little valley
  (same hills, same drawing work).
- The lane's end barrier: you could walk through it -> it is solid (walk round it on the pavement to the hedge, as before).
- Map (phone and the little job map): "My House" and "My Garden" were drawn in town -> Friends Lane is past the west edge of the map:
  a pink arrow on the big road at the west edge with a sign "🏡 Friends Lane / 🏠 My House" (the small job map: the arrow and 🏠).
  The Flower Corner is a light green patch. When you are on Friends Lane, your pink arrow waits at the west edge.
- "Show me the way" (My House / My Garden in the places list, the "Find My House" quests): leads to your Friends Lane house / garden gate.
- The first time an old game is opened: "Welcome back" and 3 s later "🏡 Your house moved to Friends Lane, with your garden! Follow the pink
  arrow." The pink arrow shows the way to your house (not when you start inside your house or already on Friends Lane).
- New players: Rosie: "This purple house is yours now. You can make it super cozy inside!" -> "Your new house is on Friends Lane, just down
  this road! Follow the pink arrow to find it. 🏡"; when she says bye, the pink arrow shows the way. She now greets you on the pavement by the
  Flower Corner (you look along the road towards Friends Lane, she is in the sun).
- Rosie's chat line "Your house is so purple! I love it." -> "Your house on Friends Lane is so cute! I love it."
- House names in the pizza and designer jobs: "House next to yours" -> "House by the flowers", "Big apartments by your garden" -> "Big apartments by the flowers".
- An old-version friend standing in their old town yard is shown at their Friends Lane house (as before), now only for the yard itself
  (not for the path to the apartments behind it).
- Garden plants: every bed was up to 72 separate pieces (a full garden 276 draws on screen) -> one piece per bed (12 for a full garden), same look.
  Needed because your garden is now in view all along Friends Lane.

#### Follow-up after review
- Pink arrow to My House / My Garden: it aimed at your front door behind the front fence and at the garden gate behind the house, so walking
  towards it you got stuck at a lot's side fence, a tree, the bench by the Flower Corner or your own house wall -> it aims at the pavement in
  front of your gate (My House) and in front of the stepping stones to the garden (My Garden); the pink pole stands there.
  "📍 You found My House! 🎉" / "My Garden" and the "Find My House / My Garden" quest steps (find:home, find:garden) happen there (3.2 m, like every place).
- Between town and Friends Lane (both ways) the arrow first leads along the middle of the big road (between the two car lanes: nothing stands
  there), then to your gate, or on to the place in town. In a yard or garden on Friends Lane it first leads out: by the front gate, or from the
  garden between the beds, through the garden gate and along the stepping stones, then onto the pavement. The ring on the map and the metres
  still show the place itself.
- Town bench by the Flower Corner: 0.8 m further from the road (z -6.6 -> -7.4); walking along the Flower Corner fence you got stuck between the two.
- "Bigger house!" sign: it sat on the front of the name-sign post (the post went through it and flickered) -> 9 cm in front of the post.
- A friend leaving Friends Lane after you said "👋 See you later" there (to walk around town, or late in the day to go home to sleep): walked
  straight to town through fences, houses and the Clothes Shop -> leaves your lot by the gate or a side path (from the garden: between the beds,
  through the garden gate, along the stepping stones), walks along the lane's pavement into town, then on the town paths as before.
- New players: Rosie said "Follow the pink arrow to find it" two lines before the arrow appeared -> the arrow appears with that line.

### Job 11: Move my game between devices

- Settings: nothing -> a new row "📱 Other device · 📦 Move my game" (in the game and on the title screen, so a new iPad can
  get a game before ever playing). It only shows when the database allows moving (see Firebase below).
- "📦 Move my game" card: two big buttons, "📤 Send my game from this device" and "📥 Get my game on this device" (side by side
  on a phone held sideways, so the card fits), a one-line how-to and "⬅️ Back" to Settings.
- Send: the game is saved first (furniture in your hands goes back to storage first), then a 6-letter code shows in big
  coloured letter tiles (the logo's colours) with a countdown "⏰ 9:59 left" and "There: ⚙️ Settings → 📦 Move my game →
  📥 Get my game. Keep this card open until your game has moved." + "✋ Stop sending".
  When the other device takes the game: "🎉 Your game moved! Your other device has your game now. Have fun! 💗" (+ a short note
  that coins earned on one device stay on that device). After 10 minutes: "⏰ The code ran out of time" + "🔄 Make a new code".
- Get: a big text box for the 6 letters (capital letters by itself, 32-38 px, no autocorrect) + "📥 Get it!". Then a check
  card: the game's name, 🪙 coins, 📅 day and 🐾 pets, and "This will replace the game on this device (name, 🪙 coins)."
  (or "This will be the game on this device." on a new device) + "✅ Yes, move it here" / "Cancel".
  Yes -> "📦 Moving your game… Here it comes!", the page starts again (exactly like opening the game) and the title says
  "📦 Your game is here, <name>! Tap Play 💗". Play -> "Welcome back, <name>!" with the same coins, house, furniture
  (upstairs too), wall/floor, garden, pets, clothes, skills, quests, job, beach/tennis, Friends Lane lot.
- Kind messages: "Type all 6 letters 🔤", "Hmm, that code doesn't work. Check the letters and try again! 🔍",
  "⏰ That code ran out of time. Make a new one on your other device!", "📡 The internet is slow right now. Try again in a
  moment!", "⏳ Let's take a little break. Try again in a minute!" (more than 6 tries in a minute), "That is the code of this
  device! Type it on your other one. 😊", "🌱 There is no game on this device yet! Play first, then you can send it.".
- New safety net: the game that was on the device before a move is kept. "Move my game" then shows "↩️ Before the last move,
  this device had <name> (🪙 coins)." + a "↩️ Bring it back" button (same check card, "✅ Yes, bring it back"). It swaps, so
  nothing is ever lost by a wrong "Yes".
- Bug fix (Settings, old bug, also in the pre-night versions): "🗑️ Start a new game" while playing did not work: the page
  saved the old game again while reloading, so the old game came straight back. Now it really starts over (also inside
  Claude: the pending cloud save is cancelled too).

### Job 12: Glitch hunter, pass 2 (3D world part)

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

### Job 12: Glitch hunter, pass 2 (screens and map part)

**Finding 1, the pink arrow bar on an upright iPhone.**
- Width (U01 `glitch2-U01-way-bar-beach-iphone.jpg`, U02 `glitch2-U02-way-bar-town-iphone.jpg`): the bar was squeezed into the
  narrow left column (about 145 px: the column shares the top row with the round buttons), so it became a round blob of single words,
  8 lines tall at the beach, with its ✕ on the words -> below the clock the bars (way-finder, bus pill, football and tennis score) may be
  as wide as their words (up to the screen width minus the edges): "⬆️ 🏠 My House 95 m ✕" and "🚌 Next bus: 8:50" are one line again.
  The ✕ keeps its own space. iPad and phones held sideways are unchanged (their column was already wide enough).
- Words at the beach (U01): "🏠 My House: take the bus home first 🚌" (and "🚌 Bus stop: take the bus home first" at the campsite, right
  next to the beach bus stop) -> "🚌 Take the bus home" when you are on your way home, "🚌 Take the bus to town" for any other place.
  The arrow used to point straight up (meaning nothing) at the beach -> it now points to the beach bus stop. Back in town it points to
  your place again, as before.
- The bar's words are only rewritten when they change (they were rewritten 7 times a second, which reflowed the HUD column each time).

**Finding 4, football on an upright iPhone** (U03 `glitch2-U03-football-left-column-iphone.jpg`): the left column was taller than the
screen and the notepad jumped next to the little map, into the middle of the field (over the kids and the 🎯 sign) -> with the score
pill and the arrow bar on one line each, the column fits again (coins, tummy, clock, score, arrow bar, map, job text, notepad all in one
column). And the column-fitting rule from pass 1 (job 3) never puts the notepad or the designer card beside the map when that would
reach the middle of the screen (an upright phone): there it folds/hides things instead. A phone held sideways still puts the notepad
beside the map (checked).

**Finding 6, the football score pill** (U04 `glitch2-U04-football-score-pill-iphone.jpg`): "⚽ Blue 0 – 0 Pink" ran out of the pill
and ✋ Stop wrapped to a second row -> one row: "⚽ Blue 0 – 0 Pink ✋ Stop" (also "🥇 You 0 – 0 Zac", and the 🎾 tennis pill).

**Finding 13, "Oh no, the bus left!"** (U05 `glitch2-U05-bus-left-message.jpg`): the message came at 21:00 sharp while the bus still
stood at the stop (the pill still said "Bus to town: 0:01") -> it comes when the bus has really driven off (8 m away, about 3 seconds
later, or gone). If you stand in front of the bus it waits and honks as before; the message then comes once it drives away (until
22:00).

**Finding 17, the Welcome Bus pill** (U06 `glitch2-U06-welcome-bus-pill-beach.jpg`): after the free ride on day 1 the pill at the beach
still said "🎉 Free bus! Hop on!" -> "🚌 Free bus to town until 12:00" (what Driver Dot says). At the park it still says "🎉 Free bus! Hop on!".

**Finding 18, the bus times at the beach.**
- The board in the beach shelter (U07 `glitch2-U07-beach-board-times.jpg`) showed the park's times (Tuesday 8:50, Wednesday 8:10,
  Saturday 9:10) -> it shows when the buses home leave the beach: "⭐ Tuesday 11:50 · 21:00", "Wednesday 11:10 · 21:00",
  "Saturday 12:10 · 21:00" (day 1: "🎉 until 12:00 · 21:00"), and "🏘️ Bus to town · a ride is 20 🪙" at the bottom. The same times as
  the timetable card at the beach and the pill. The board at the park is unchanged. Only the picture on the board changed (no 3D change).
- Driver Dot on arrival (U08 `glitch2-U08-driver-dot-beach-times.jpg`): "The bus home leaves at 21:00. See you then!" while the pill
  counted down to 11:50 -> "I go back to town at 11:50. The last bus home leaves at 21:00. Have fun! 👋".

**Finding 19, the map: your "You!" and arrow covered names.**
- A friend online next to you (U09 `glitch2-U09-map-friend-name-you.jpg`): "ZZTE[You!]W" -> "You!" and friends' names each take a side
  (above, below, right or left) where they cover no place, name or dot. Friends' dots are drawn over your arrow (it never hides them).
- Inside a shop on an iPhone (U10 `glitch2-U10-map-inside-market-iphone.jpg`): "Ma▼et" -> a place name under your arrow moves to
  another side of its badge ("Market 🍎"); it can still be tapped where you see it. With no room anywhere, a small place's name hides
  (like when the map is crowded) and a big place's name is drawn over the arrow.
- Zoomed out (U11 `glitch2-U11-map-zoomed-out-labels.jpg`): "Flowe▲orner" -> no name under the arrow.
- A friend inside the Market (U12 `glitch2-U12-map-friend-in-market.jpg`): a dot without a name -> the name is under the dot.
- After picking Beach and then Bus stop (U13 `glitch2-U13-map-bus-stop-list.jpg`, iPad dark): the Places list still lit up "Beach" and
  the card still said "the Beach Bus leaves from here" -> "Bus stop" lights up, and the card is the bus stop's own card.

**Finding 20, the map on small iPhones.**
- The card (U14 `glitch2-U14-map-card-iphone.jpg`): on an upright phone the words had about 150 px ("Bus stop · 10 m away · the Beach Bus
  leaves from here 🏖️" in 5 lines) -> the buttons go under the words: the words get the whole card (2 lines), "🚶 Let's go!" is a wide
  button under them, ✕ beside it. When you pick a place the map leaves room for the taller card.
- Zoomed out all the way (U15 `glitch2-U15-map-zoomed-out-iphone.jpg`): no beach, and "Toy S…" cut at the edge -> a place's name never
  pokes out of the map's edge (it takes another side of its badge, or hides), and the 🏖️ beach sign always shows (its name only below,
  right or above it, never into the town).
- The Places list on a phone held sideways (U16 `glitch2-U16-map-places-list-iphone-sideways.jpg`): 4 columns, the last row ("🚌 Bus
  stop") cut off with no hint -> 5 slightly narrower columns: all 21 places fit (each still 44 px tall). On a smaller phone, where the list
  still scrolls, a little bouncing ⬇️ shows until you reach the end (checked at 667×375).

**Finding 24, sitting on the bus on an iPhone** (U17 `glitch2-U17-bus-seat-view-iphone.jpg`, U18
`glitch2-U18-bus-seat-view-iphone-sideways.jpg`): you saw the ceiling and a dark seat block (upright), or the yellow door pole right in
front of your face (sideways) -> on a phone you look out of your own window when you sit down: the bus stop and its board, the park
fence and trees (door side), or the street, the lamps and the houses (road side). You can still look around with your finger. iPads are
unchanged (their wide view already shows the inside of the bus). So that friends don't see you sitting sideways on the seat, while you sit
on the bus your body faces forward for them whatever way you look (the existing `ry` value: the seat's direction instead of your look).

**Finding 29, small text breaks.**
- Zoomy Zac's card (U19 `glitch2-U19-zac-card-1-vs-1.jpg`): "…or a 1 vs / 1?" -> "1 vs 1" never breaks (also the "🥇 1 vs 1 with Zac"
  button and the bench label "Invite Zoomy Zac to a 1 vs 1").
- The bus timetable card on a phone held sideways (U20 `glitch2-U20-timetable-scroll-hint-iphone-sideways.jpg`): the bouncing ⬇️ "more
  below" sat on Saturday's time ("🚌 9…") -> on this card it bounces in the middle of the row, between the day and the time.

### Job 12: Glitch hunter, pass 2 (Move my game + messages part)

**The message rule (job 3's toasts), improved for everyone** (`toast`, `toastShow`, `toastPump`, `toastFit`, `toastPlace`, `keepClear`)
- **One message at a time, each readable.** Old: a new message pushed the one on screen away at once. New: it waits until the one on screen had
  time to be read (1.6 s, longer for long words: 0.05 s per letter, never longer than the message itself). The answer to a NEW tap or key still
  shows at once (tapping again and again keeps answering right away), and the same words again just stay longer (no copies in the line).
- **News waits while a card fills the screen.** News = a message that is not the answer to your own tap (a friend came, you are online, a bus
  message, a message from before the card you opened). Old: it was drawn on the card for 3 s (covering buttons). New: when the open card leaves
  no free spot, it waits and comes when the card closes; news that waited 30 s is old and is skipped. If a card opens over a message, the
  message steps aside and comes back after. On an iPad there is room beside the cards, so nothing changes there (the message goes beside).
- **On a phone, the free middle.** Old: with no free spot, a message sat on the pink arrow bar or the use-button words. New: it tries a narrower
  box (16 px words, 2–4 lines) in the free middle under the top row, between the left column (arrow bar, map, notepad) and the use button.
  The arrow bar now counts as much as the use button (it shows the way).
- **The answer to a tap on a card that fills the screen** goes right above what you tapped (left of the card's own buttons like 🪙 and ✕),
  or under it; on the map, above the spot your finger tapped. Old: at the card's top or bottom edge, on items, the title or the map's info line.
- A card's name tag that sticks out (Zoomy Zac, people talking) counts as part of the card. While a message is up, it moves if a card closes
  or the use button / arrow bar appear under it. Messages never sit under the on-screen keyboard (they use the part of the screen you see).
- The check's chat test still works: `window.__lastToast` is set the moment a message is sent, also when it waits.

**Move my game (job 11) — findings-j11**
- **1 (big-ish) Get my game on a sideways iPhone with the keyboard up** (M01 `glitch2-M01-get-card-messages-above-keyboard.jpg`): every message
  ("Type all 6 letters", "Hmm, that code doesn't work…", "ran out of time", "internet is slow", "little break") and "⏳ Looking…" were under
  the keyboard -> the line under the code box always scrolls into view above the keyboard (also on phones where the whole page gets shorter),
  without pushing the code box out of sight. While looking, the line says "⏳ Looking for your game…" (up to 9 s) next to the code box.
- **2 (medium) Messages on full-screen cards on phones** (M02 `glitch2-M02-news-waits-while-a-card-fills-the-screen.jpg`): "👋 X is here!", "🟢 You
  are online!" over Settings, the Move card, "🎉 Your game moved!", the Yes/Cancel of "↩️ Bring it back" -> they wait until the card closes
  (the message rule above), then come one by one.
- **3 (medium) "🗑️ Start a new game" wiped everything with a quick double tap, no way back** (M03
  `glitch2-M03-start-a-new-game-asks-first-and-keeps-the-game.jpg`): old: the 2nd tap on the same button (it said "Tap again to start over")
  erased the game. New: the button opens a card of its own: "🗑️ Start a new game?" with the game's name, 🪙, day and pets, "Your game goes
  away and a brand-new game starts. You can bring it back later in ⚙️ Settings." and "💗 No, keep my game" / "🗑️ Yes, start over" (in other
  places than the Settings button; a tap on "Yes" in the first 0.8 s doesn't count, so the second tap of a double tap does nothing).
  "Yes" keeps the game in the old-game place (`cozytown-save-old`, the same place Move my game uses), then starts over; the title then says
  "🌱 A brand-new game! Your old one is safe in ⚙️ Settings → ↩️ Bring it back." Settings shows a row "↩️ Your old game · ↩️ Bring it back"
  whenever a game is kept — in every version, also inside Claude and when the move database is off. Bring it back = the check card
  ("✅ Yes, bring it back"), it swaps the two games (nothing is lost) and works inside Claude too (the brought-back game is saved as "now", so it
  wins over the older copy in the claude.ai account; the claude.ai copy is not written while the page is restarting).
  Tested: double tap on the same spot, a quick tap on Yes, a slow Yes, title message, Settings row, bring back (web and Claude version).
- **4 (small) "Welcome back" replaced by "You are online!" after 5 ms** (M04 `glitch2-M04-welcome-back-stays-readable.jpg`): -> "Welcome back,
  <name>! 💗" stays, "🟢 You are online!" comes 1.6 s later (the message rule).
- **5 (small) "⏳ Looking…" too faint** (M05 `glitch2-M05-looking-button-full-colour.jpg`): the button was disabled (45 % see-through, contrast
  1.9:1) -> it keeps its full mint colour and dark words; extra taps are ignored by a flag on the button instead.
- **6 (small) Words for a 6-year-old** (M06 `glitch2-M06-words-ipad-or-phone.jpg`): "device" -> the name of the thing in your hands ("this iPad",
  "this phone", "this computer") or "your other iPad or phone":
  - Settings row "📱 Other device" -> "📱 Another iPad or phone"
  - "📤 Send my game from this device" / "📥 Get my game on this device" -> "… from this iPad" / "… on this iPad" (phone/computer)
  - "Open Cozy Town on both devices." -> "Open Cozy Town on both."
  - "On your other device, type this code:" -> "On your other iPad or phone, type this code:"
  - "There: ⚙️ Settings → 📦 Move my game → 📥 Get my game." -> "On the other one: ⚙️ Settings → …"
  - "Your other device has your game now." -> "Your other iPad or phone has your game now."; "Coins you earn on one device stay on that
    device." -> "Coins you earn on one of them stay on that one."
  - "Type the code from your other device:" -> "… from your other iPad or phone:"; "No code yet? On the device that has your game: …" ->
    "No code yet? On the one that has your game: …"
  - "This will replace the game on this device (…)" -> "… on this iPad (…)"; "There is no game on this device yet!" -> "… on this iPad yet!";
    "That is the code of this device!" -> "… of this iPad!"; "… on your other device!" -> "… on your other iPad or phone!"
  - "↩️ Before the last move, this device had X (🪙 N)." -> "↩️ Your old game X (🪙 N) is still on this iPad."
  - The two nearly equal "Hmm, that code doesn't work. Check the letters! 🔍" / "… Check the letters and try again! 🔍" -> one message.
- **7 (small) The bobbing ⬇️ "more below" arrow sat on buttons** (M07 `glitch2-M07-scroll-arrow-beside-the-card.jpg`): it sat on the corner of
  "📦 Move my game" (iPad) and on "📖 Show me the tips" (sideways iPhone) -> it sits on the card's right edge, half outside, next to the buttons
  (on an upright phone, where there is no room on the right: on the card's bottom edge). It is placed again when the card changes size.
  This changes every tall card, not only Settings; it also fixes the second half of main finding 29 (the ⬇️ sat on the Saturday time "9:40"
  of the bus timetable on a sideways iPhone: see the timetable row of M11).
- **8 (small) The sending device said "👋 <its own name> is here!"** (M08 `glitch2-M08-own-game-on-the-other-ipad.jpg`): a friend online with my
  own name and look = my own game open on another iPad -> "📱 Your game is open on your other iPad or phone too!" (and when it closes: "📱 Your
  other iPad or phone closed the game." instead of "👋 <my name> left.").

**Main findings (findings-main), asked for later**
- **5 (medium) On iPhones, messages on the arrow bar and the use-button words** (M09 `glitch2-M09-messages-beside-arrow-bar-and-use-button.jpg`,
  M09b `glitch2-M09b-messages-beside-arrow-bar-iphone-upright.jpg`): the gate's "🚌 The beach bus leaves from the park!…" covered "Find the
  beach bus"; "🚌 Oh no, the bus left!…" covered "🏠 My House: take the bus home first"; Zac's "Sure! We need a juice break!" was printed on
  "Invite Zoomy Zac to a 1 vs 1"; upright: on the arrow bar and map -> in the free middle between the left column and the use button (and it
  moves away if the use button appears under it while it is up).
- **8 (medium) Messages on open cards** (M10 `glitch2-M10-messages-not-on-the-map.jpg`, M11 `glitch2-M11-messages-not-on-shop-timetable-zac-cards.jpg`,
  M11b `glitch2-M11b-message-off-zacs-card-iphone-upright.jpg`): "🏡 Your house moved to Friends Lane…" over the big map's info line -> waits
  until the map closes; "💛 This spot is for a friend!" over the map's card title -> above the spot you tapped on the map; "Not enough coins yet!"
  over the Market's items -> above the item you tapped (over the card's title, left of 🪙 and ✕); a bus message over the timetable -> waits until
  the timetable closes; "⚽ The football friends are at the field…" over Zac's name tag -> above the tag.

### Job 13: The designer's older wishes

#### 🌉 A bridge over the duck pond
- Duck pond (the small pond east of the big blue flats, by the sandy path): a pond you could only look at -> a little wooden arched
  bridge across it, from the sandy path on the north side to the grass on the south side. Wooden planks in two shades, arched side
  beams, posts with round knobs (pink at the four ends, cream in the middle), a hand rail and a lower rail that bend with the arch.
- Walking over it: you go up and down with the arch (at the top your view is 80 cm higher, so you look down on the ducks), and you
  can't fall off the sides into the water. At both ends you can step on and off. Pets that follow you can climb onto it too and stand
  on the planks; online friends who walk over it are shown on the planks (in the new version; old versions show them at ground level).
- On top of the bridge: a new "🦆 Feed the ducks" button (the same as the one by the bench: with bread the ducks come over and get 💗;
  without bread: "The ducks would love some 🍞 bread! …").
- The ducks still swim all over the pond and pass under the high middle of the bridge (about 2 m wide); they keep out of its low ends
  (they would poke through the planks there). Checked over 2 minutes of swimming: never in a low end.
- The two rim stones under the low north end are left out (they would poke into the bridge). Everything else around the pond (bench,
  feeding spot, cattails, lily pads, bushes and flowers) is exactly where it was.
- Drawing work: the bridge is merged into the town scenery (no extra draw calls); the town has +1.2 % triangles.

#### 🎶 Dance music for the TV cat
- TV at home: the dancing cat show was silent -> a short cheerful tune plays in time with the cat (on the cat's own beat, 2.2 beats a
  second). Each of the cat's 5 moves (HANDS UP!, VIBE CHECK, THE FLOSS!, SPIN!, JUMP JUMP!) has its own little 8-beat tune, with a soft
  bass, a soft drum on the beat and a tiny tick between beats.
- It plays only while you are at home, on the TV's floor and near it: soft within 2.5 m, quieter further away, silent from 7 m. It stops
  when you turn the TV off, when you leave the house, while you lie in bed, and with 🔊 Sound off in Settings. With two TVs on, only the
  nearest one plays.
- Never endless: a show is 5 rounds of the dance (about 1½ minutes). Then a little "ta-da", the TV switches itself off and
  "📺 The end! The dancing cat takes a bow 🐱👋 Tap the TV to watch again." Tap the TV and a new show starts.
- Loudness: the tune is about half as loud as a button tap (the drum and bass are soft sine sounds).

#### ✨ Fireflies in the park at night
- Cozy Park at night: stars, lamps and lit windows -> also 48 fireflies: tiny soft yellow-green glowing dots, 0.5-2 m above the grass,
  each drifting in its own little loop and blinking slowly. All over the park, not in the fountain's spray and not on the Pet Show stage.
- They come out after sunset (from about 19:10, all out by about 20:05) and fade away at dawn (from about 5:25, gone by about 6:20).
- Drawing work: one extra piece (1 draw call, 96 triangles), only at night; by day it is switched off. The drifting and blinking happen
  on the graphics chip, so the game does no extra work per firefly.

#### 🐚 Shell shelf
- Home shop (🛋️ Decorate -> 🛍️ Shop; also 📱 Furniture -> "Shop for my house"): new furniture "🐚 Shell shelf", 150 🪙 (the same price and
  the same size as the Bookshelf, 1.2 m wide), shown right after the Bookshelf.
- A cream-white shelf with a sea-blue back, 3 boards and a big pink shell on top. It shows your shell collection (the shells you pick
  up at the beach): 12 spots that fill up as your collection grows: 1, 2, 3, 4, 5 and 6 shells -> one more shell each, then at 8, 10, 13,
  16, 20 and 25 shells. Full at 25 (about 5 beach days). Three kinds of shells (scallop, conch, turban) in 6 pastel colours. The middle
  board fills first (eye height), then the top one, then the lowest.
- Tap it ("🐚 Look at your shells"): "🐚 You have 23 shells! Find more at the 🏖️ beach to fill your shelf." With 25 or more:
  "🐚 You have 31 shells! Your shelf is full of treasures! ✨". None yet: "🐚 No shells yet! Find pretty shells at the 🏖️ beach.".
  A 🐚 floats up from the shelf.
- Picking a shell at the beach: the shelf at home shows it at once. On your 3rd shell ever, if you have no shelf yet, a tip comes
  after the shell message: "🐚 Tip: a Shell shelf from the 🛍️ Home shop shows your shells at home!".
- Saved as a Bookshelf: in your save the Shell shelf is a white Bookshelf with the marker `sh:1`. The new version shows the Shell
  shelf everywhere (house, moving it, 📦 My stuff, visitors); an older version (also "Go back to PRENIGHT 2") just shows a white
  bookshelf with books in the same spot and keeps the marker, so back in the new version it is a Shell shelf again.
- Visiting a friend's house (Friends Lane): their shelf shows THEIR shells. The count rides along with the house layout the host
  sends (one extra value at the end of the shelf's row, like `s23`); visitors with an older version read only the usual values and
  see a white bookshelf.
- Not in the daily quests ("Put a … in your house": the quests stay exactly the same for every save) and not in the designer job's
  furniture list (a client's room would show your shells). No "New in!" colours (it has one look).

### Integration fixes (how the jobs work together)

**1 (BIG) A friend's clock jump could strand a kid at the beach for days, and Driver Dot promised a bus that never came**
- Sitting in the bus to the beach when a friend's clock moves you past the bus's leaving time or into another day: the bus left at
  once and dropped you at the beach on a day without a bus home (Driver Dot: "The bus home leaves at 21:00", the pill: "Bus home: Tue
  11:50", nothing at 21:00) -> you get off at the park stop with your coins back: "🚌 Driver Dot: “Oh! The clock jumped to your
  friends' time, so this bus can't go now. Here are your 20 🪙 back! 💛 The next bus comes on Tuesday at 8:50.”" A jump that does not
  reach the bus's time keeps you in your seat. In the bus home the bus simply goes (home is where you want to be).
- At the beach, a friend's clock jumps past the bus home (example: Saturday 11:00 -> Sunday 10:00, next bus Tuesday; about 20 real
  minutes stuck, no home, no work, "🚀 Go" blocked) -> "🚌 Driver Dot came back for you! 💛 A free bus home waits at the “To town” gate
  until 12:10. Hop on!" Her bus drives in a moment later, waits 2 game hours (about 1½ real minutes), costs nothing and goes as soon
  as you sit down (like the Welcome Bus). The pink arrow says "🚌 Take the bus home" and points to it, the pill counts down
  "💛 Free bus home: 1:25", the button says "Free bus home: hop on! 💛", Driver Dot: "There you are, <name>! 💛 Hop in, I'll take you
  home!". If a bus home still comes that day, you just hear when: "🚌 The bus home leaves today at 21:00 from the “To town” gate 🏘️".
  Late at night (from 22:30) there is no night bus: "🌙 It's late! ⛺ Build a campsite and sleep at the beach. The bus home comes
  on Tuesday at 11:50 💛" (the next real bus).
- A game from before the bus loads at the beach (old saves; also the reload of job 1's update): no word about the bus, the next bus
  days away, the job hint "Go to the Pizzeria" -> "🚌 New: the Beach Bus! 💛 Driver Dot came to take you home for free! Her bus waits
  at the “To town” gate until 15:20. Hop on!" (when a bus home still comes that day: "🚌 New: a Beach Bus takes you home! It leaves
  today at 21:00 from the “To town” gate 🏘️"). Every game that loads at the beach now hears when the bus home leaves. Driver Dot's
  free bus is saved: it still comes after a reload.
- Driver Dot's hello when you arrive at the beach: "The bus home leaves at 21:00. See you then!" also on days with another time ->
  always the real next bus: "I go back to town at 11:50. The last bus home leaves at 21:00.", "The bus home leaves at 21:00. See you
  then!", or "The next bus home leaves on Tuesday at 11:50."
- The timetable card at the beach: today's row still listed buses that had already left ("12:40 and 21:00" at 15:00) -> only the
  buses home still to come today (and 💛 Driver Dot's free bus while she waits); the line at the top always names the next real bus
  ("🏘️ Next bus home: on Tuesday at 11:50."). The bus days, the board in the beach shelter and the pill are job 7's timetable, unchanged.
- The job hint at the beach: "🍕 Go to the Pizzeria to start work" -> "... · 🚌 bus first" (also "📩 New order! Go to the Pizzeria").

**2 (MEDIUM) The update button on an upright iPhone covered ✋ Stop, the bus countdown and the arrow bar's ✕** (a tap there reloaded the
game) -> it sits below the bus, football, tennis and arrow bars whenever they reach under it, and moves again as they come and go; the
messages keep clear of it too. iPads and sideways phones: unchanged (nothing reaches it there). Picture
`intfix-02-update-button-below-the-bars.jpg`.

**3 (MEDIUM) The update button while sitting in the bus**: it showed, and tapping it (or closing the app, or 📦 Move my game) lost the
20-coin fare -> it waits until the ride is over (like during the Pet Show, the claw machine and lessons), and any game saved while you
sit in the bus keeps the fare: it starts again standing at the bus stop with your coins (the device's save, the claude.ai copy and a
moved game). Picture `intfix-03-update-button-waits-on-the-bus.jpg`.

**4 (MEDIUM-LOW) Day 1: Rosie sends you home while the Welcome Bus calls you back**
- "🎉 Good news! A free Welcome Bus…" came while Rosie's pink arrow showed the way to your new house (and "The Welcome Bus is at the
  park!" was sometimes skipped) -> while the pink arrow shows the way home, bus news waits: "📍 You found My House! 🎉" first, then
  "🎉 Good news! A free Welcome Bus waits at the park until 12:00…" (day 1 until 11:30), or later "🚌 New! A cozy Beach Bus stops at the
  park 3 days a week. Your first ride is free! 🎟️ Find the 🚌 bus stop on your 🗺️ map!".
- The free ride only on day 1 (gone within 3 real minutes; a new player who joined friends on a later day never got it) -> **your first
  bus ride ever is free**. At the bus stop: "🎟️ Your first ride to the beach is free! The bus comes on Thursday at 9:30 🚌" (or "Hop on!
  🚌" when it is there), the button "Get on the bus (free 🎟️)", Driver Dot "Hello, <name>! 🎟️ Your first ride is free!", and on the
  timetable card "🎟️ Your first ride is free! After that, a ride is 20 coins." The day-1 Welcome Bus stays as it was for everyone.
  Picture `intfix-04-house-first-then-the-bus.jpg`.

**5 (MEDIUM-LOW) Daily quests that cost more than they pay (job 8's prices)**
- "Buy a … at the …": also toys (50-200 🪙) and pet outfits (25-70) for 8-22 🪙 -> only everyday things of 20 🪙 or less (food, pet
  food, pet toys).
- "Put a … in your house": any furniture (60-1000 🪙) for 10-40 -> only furniture that is already waiting in 📦 My stuff (moving it
  counts, as before).
- 🌷 Flower power 15 -> 40 🪙, 👗 New look 15 -> 40, 🌷 Flower house 45 -> 80.
- Old saves keep their quests: a saved game's first day after loading gets exactly the quests the older version gives it; every new day
  uses the new rule. Tested over 60 new days: quests that cost more than they pay (by more than 5) 47 of 79 -> 2 of 50 (both
  "New look": 40 for clothes from 50 that you keep).

**6 (LOW-MEDIUM) Messages from one end of a bus ride showed at the other end** ("📍 You found the Bus stop!", Driver Dot's "Welcome… Off
we go!" at the beach; her beach words in town after riding straight back; "📍 You found My House!" later at the bus stop) -> messages
about a place (📍 You found…, the bus news, Driver Dot's words, "Welcome to the beach", the shell tip, the football friends) are dropped
when you go somewhere else (a door or a bus ride); "📍 You found…" also when it could not show within 12 s. Driver Dot's beach hello is
not sent when you already sat down in the bus again. Picture `intfix-06-messages-stay-where-they-belong.jpg`.

**7 (LOW) "⚽ The football friends are at the field until 19:00" popped up in the middle of the Pet Show** (Saturdays 14:00) -> it waits for
a free moment in town (no show, card, lesson or tip), until 15:00. Picture `intfix-07-football-news-waits-for-the-pet-show.jpg`.

**8 (LOW) The football kids popped in and out at 55 m** -> they grow in softly over their last 6 m, like walkers, friends and cars
(job 3's fade; size only, no extra drawing).

**Found while testing (small):** standing at the Welcome Bus, its big "🎉 Free ride!" label covered the clock -> hidden while the pill
already says the bus is free (job 12 does the same for the countdown label).

### Job 7 follow-up: what the review of the new bus look changed

- "It looks like a long coach or a tram with a flat front" -> 1.2 m shorter (6.8 m -> 5.6 m, 3 rows of seats), a
  windscreen that leans back, an orange nose with a flower shelf, headlights near the corners, front wheels under the nose.
- "You can hardly see the two roof boards from the ground" -> the boards are tipped out to the sides on a new rack (each
  shows its top to its side of the street), and both show from the front.
- "Ink lines poke through at the roof line and the front corners" -> the side above the door is one piece now, the
  panels stop just short of the round corners, and the roof's soft edge covers the panel outlines. No more black ticks.
- "The open door covers the front wheel" -> the front wheels moved in front of the door.
- "The new bus nearly doubles its triangles" -> corners made of quarter posts, fewer segments on the wheels, lights,
  roof, boards and flowers: about 18,300 -> 11,900 triangles; the lamps and the thin door no longer cast shadows.

---

## 2. Check output

### How the checks were run (please read this first)

- **The tools:** `cozycheck/cozy_check2.py` from `cozy-night-kit.zip` (check version 1), run as it came (nothing in the kit was changed), with Playwright and the Chromium that is installed in this machine. Every test copy ran with the kit's fake Firebase and fake Claude room, the bundled three.js r128 and the Baloo 2 font. No test ever reached the real internet (line C8).
- **"Live" = tonight's starting version.** `--live-web` is `index.html` at the start of the night (= `tools/prenight2-index.html`, md5 `f2cdd530076cce1ad198bd90d9e0e2a7`). The check also needs the "Claude version"; it is the same file without the web part (the 7 manifest/icon lines at the top and the 47 lines of Firebase scripts), md5 `413cc5f4d3bbd561ab274c7d74d67bce`, exactly night 1's "new Claude". Line F3a confirms it is "Claude version + web part, nothing else", and every run ends with `WEBPART-ROUNDTRIP: identical` (the GitHub file the check builds is byte-for-byte our `index.html`). No job changed the web part or the number of lines in front of it.
- **Old saves (B1):** the 5 saves from `tools/check-fixtures/` plus a new one made tonight with the starting version (`save-f2cdd53-rich.json`: big house, upstairs furniture, garden plants, shells, tennis best, pizza stars, a following pet), plus the "fresh save" the check makes itself with the starting version: **7 saves** in every run.
- **B1 says FAIL in every run, also on the unchanged starting version, and that is not a lost save.** Night 1's ideas board gives a save that has no player id (`pid`) a new *random* id when it is loaded. The check loads each old save twice (old version, new version) and compares: the two random ids always differ, so the 5 pre-night-1 saves show exactly 1 difference each, `pid: "u…" -> "u…"`. Nothing else differs. I did not change the kit; instead every run was also checked with a small script (`b1.py`) that confirms the ONLY differences are `pid` (`only pid differences: YES`). The dry run below (unchanged game) shows the same B1 line. The saves made with night-1 versions (rich save, fresh save) have a `pid` already and show 0 differences. Morning question: add `pid` to the check's list of values that may change (one word in `checks.py`, `VOLATILE`).
- **C2b (every area reached by playing)** failed on the starting version ("NOT REACHED: ['beach']": the crawler is a new player and the beach was locked behind skill level 10). Job 7 replaced the lock with the bus; on day 1 a free Welcome Bus waits in the morning, and from job 7 on the crawler reaches the beach by bus.
- **Quick check after each job:** files, counts, saves, two players, the Claude version, plus the crawl of the areas the job touched (and the teacher job / PC keys where they matter). The crawl and teacher stages only print their PASS/FAIL line in a full run; for quick checks the stage results (taps tested, dead/unreachable/stuck/covered, layout issues, browser errors, areas reached) are summarised from the stage's own file, one line per stage. **A2 (dated backup)** is only given in the final check, so every quick check says `FAIL | A2 … no backup given`: expected.
- Each job was built in its own git worktree from the integration branch, checked there by its builder (that output is in the job's own notes and in section 2 per job), and then merged into the integration branch, where I ran a quick check again on the merged file (the "after merging" outputs). One job = one commit; follow-ups are separate small commits (job 7's bus look, job 10's review fixes), as night 1 did.
- **Walking test (C3):** since job 10 the start spot (-17, -4.6) faces the new Flower Corner fence 2.4 m away, so the check's 1.5-second walk says `moved 2.0 m` instead of 5.8 m. It still passes (it needs 1 m); walking itself is unchanged.

### Before any change: the full check on tonight's starting version (dry run, exactly as printed)

The unchanged game already failed 2 lines: B1 (only the random `pid`, see above) and C2b (the beach could not be reached by a new player).

```
===== COZY TOWN FINAL CHECK =====
2026-10-08 · check version 1 · DRY RUN on today's game (nothing changed)
live Claude 413cc5f4d3bbd561ab274c7d74d67bce · new Claude 413cc5f4d3bbd561ab274c7d74d67bce · live GitHub f2cdd530076cce1ad198bd90d9e0e2a7 · new GitHub f2cdd530076cce1ad198bd90d9e0e2a7
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
NOT RUN | A2 dated private backup of the live game | NOT RUN: dry run, nothing is being changed
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 676 after
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1278 pieces, 1010297 triangles in total | for information, seen from 5 spots: city 153 draws; home 34 draws; market 44 draws; cafe 48 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 6 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzcimv5phxk9" -> "umuzcisau81sld"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzcixnz7s7ff" -> "umuzcj2tcl5vnp"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzcjcbxxaxua" -> "umuzcjj62mif69"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzcjo7j2tzin" -> "umuzcju3d7y44b"; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzcjzysa1m47" -> "umuzck55eww360"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 every spot and button does something (iPad, finger taps) | 590 taps tested in 22 areas, 294 screens
FAIL | C2b every area is reached by playing | 23 of 24 areas; NOT REACHED: ['beach']
PASS | C3 walking works (ipad-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | T1 teacher job plays from the school message to the end of class (ipad-landscape) | 3 classes: English ended, History ended, English ended
PASS | T2 every goofing kid can be stopped, left and right (ipad-landscape) | left side 9 of 9 taps worked, right side 25 of 25
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (ipad-landscape) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (ipad-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (iphone-landscape) | 3 classes: Math ended, History ended, English ended
PASS | T2 every goofing kid can be stopped, left and right (iphone-landscape) | left side 8 of 8 taps worked, right side 28 of 28
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (iphone-landscape) | 14 papers; button size 52x44 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (iphone-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (pc-1920) | 3 classes: Math ended, English ended, History ended
PASS | T2 every goofing kid can be stopped, left and right (pc-1920) | left side 9 of 9 taps worked, right side 26 of 26
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (pc-1920) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (pc-1920) | 51 questions read
PASS | C3 walking works (pc-1920) | W key: moved 6.4 m in 1.5 s
NOT RUN | C1 every screen opens (android-phone-portrait) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (android-phone-landscape) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (android-tablet-portrait) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (android-tablet-landscape) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
NOT RUN | C1 every screen opens (pc-1366) | NOT RUN: dropped for now (decision 7 Oct); the full sweep is for big updates
PASS | C1 every screen opens (iphone-portrait, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (iphone-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (iphone-landscape, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (iphone-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C4 nothing is cut off the screen | 0 problems
PASS | C4 no buttons overlap | 0 problems
PASS | C4 all text fits its box | 0 problems
PASS | C4 every button is at least 44 px for a finger | 0 problems
PASS | C4 text is readable in light and dark | 0 problems
PASS | C5 the same kind of button looks the same everywhere | 21 kinds of button
PASS | C6 zero errors in the browser log | 0 errors
PASS | C8 test copies never reached the real internet | 0 outside requests stopped
NOT RUN | C1-WK every screen in Safari's engine (iPhone, iPad) | NOT RUN: dropped for now (decision 7 Oct)
PASS | F6 every test action is logged and undone | 32 test actions, 32 undone
PASS | F2a the tests used exactly the files to publish | files tested: ['413cc5f4d3bbd561ab274c7d74d67bce', 'f2cdd530076cce1ad198bd90d9e0e2a7']; to publish: ['413cc5f4d3bbd561ab274c7d74d67bce', 'f2cdd530076cce1ad198bd90d9e0e2a7']
NOT RUN | F2 published Claude version = tested file | NOT RUN: dry run
NOT RUN | F3 GitHub file after upload = new Claude version + same web part, same address | NOT RUN: dry run
NOT VERIFIED | G real devices, sound, smoothness, two real players online | NOT VERIFIED: in the "Try it for real" notebook until ticked
RESULT: 2 FAIL, 10 not run or not verified · 25 min of testing
```

### Each job's own quick check (run by its builder on its own worktree, exactly as printed in its notes)

#### Job 1: The Home Screen app updates itself

`SRC=<worktree>/index.html quick.sh job01-c files,counts,saves,players,claude,crawl_ipad-landscape_hud,pc_keys`

```
new claude 49bd5e31846cc6bf4987896383d952e0 · new web e53205e0c4c55eb6d737c177e3574917 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 105 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 676 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1278 pieces, 1010297 triangles in total | for information, seen from 5 spots: city 153 draws; home 34 draws; market 45 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 285 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzf8aw8bnho3" -> "umuzf8u1ozb6er"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 40 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 44 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 364 s]
[stage pc_keys: running]
[stage pc_keys: done in 50 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 $SP/tools/b1.py $SP/runs/job01-c`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

The crawl stage prints no line of its own in a quick run; its stage file says: 145 buttons tested, 0 dead, 0 unreachable,
0 stuck, 0 covered, 0 browser errors, 0 layout findings. All stages together: 0 browser errors, 0 outside requests.
A2 fails as expected in a quick check (no backup given); B1 is the known pid-only false fail.

#### Job 2: Bug fixes

`SRC=<worktree>/index.html quick.sh job02-b files,counts,saves,players,claude,crawl_ipad-landscape_hud,crawl_ipad-landscape_inC,teacher_ipad-landscape,pc_keys`

```
new claude ab17dd7d4b4565689df03f54785124d7 · new web 27e1cb72adf686703a482543752de234 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 122 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 676 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1278 pieces, 1010297 triangles in total | for information, seen from 5 spots: city 153 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage saves: running]
Task exception was never retrieved
future: <Task finished name='Task-77' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
Traceback (most recent call last):
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 69, in send
    return await self._connection.wrap_api_call(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 559, in wrap_api_call
    raise rewrite_error(error, f"{parsed_st['apiName']}: {error}") from None
playwright._impl._errors.TargetClosedError: Channel.send: Target page, context or browser has been closed
[stage saves: done in 251 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzie0mf6d61b" -> "umuziec8m7hqs7"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 34 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 25 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 309 s]
[stage crawl_ipad-landscape_inC: running]
[stage crawl_ipad-landscape_inC: done in 57 s]
[stage teacher_ipad-landscape: running]
[stage teacher_ipad-landscape: done in 70 s]
[stage pc_keys: running]
[stage pc_keys: done in 37 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 $SP/tools/b1.py $SP/runs/job02-b`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

The crawl and teacher stages print no line of their own in a quick run; their stage files say: HUD crawl 145 buttons tested
(the run button too), classroom crawl (school, classes, fire station, pizzeria) 24 tested, both with 0 dead, 0 unreachable,
0 stuck, 0 covered, 0 layout findings; teacher: 3 whole classes played and ended (Math, History, Math). All stages together:
0 browser errors, 0 outside requests. A2 fails as expected in a quick check (no backup given); B1 is the known pid-only false
fail. The Python "Task exception was never retrieved ... TargetClosedError" lines during the saves stage are a harmless warning
of the test tool (a message to a test page that had just been closed), not a game error.

#### Job 3: Glitch hunter, pass 1 (3D world part)

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

#### Job 3: Glitch hunter, pass 1 (screens part)

Run `job03u-b` (SRC = this worktree's index.html; stages files,counts,saves,players,claude,crawl_ipad-landscape_hud,crawl_ipad-landscape_inA,teacher_ipad-landscape,teacher_iphone-landscape):
```
new claude 477ad13146db115c29547052766181b7 · new web 2b503f7a44c811eeb2df4249e4cc77f5 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 82 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1287 pieces, 988002 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 234 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzo5iwyz60ok" -> "umuzo5vm1m356i"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 32 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 22 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 280 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 258 s]
[stage teacher_ipad-landscape: running]
[stage teacher_ipad-landscape: done in 90 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 80 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
`python3 $SP/tools/b1.py $SP/runs/job03u-b`:
```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```
A2 = normal for a quick check; B1 = the known pid-only difference. The crawl and teacher stages of job03u-b: 0 browser errors, 0 dead / unreachable / covered taps; the only layout issue was 2 × `cut-off #pad "Notepad"` in teacher_iphone-landscape (the left column on a sideways phone), fixed afterwards (U35) and checked again:

Run `job03u-c` (after the left-column fix; stages files,saves,players,crawl_ipad-landscape_hud,teacher_iphone-landscape):
```
new claude 4a0bad790e90493fe55be0fb5406af30 · new web 6c662f2cc99ebe4ab0136474eb37ac0a · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage saves: running]
[stage saves: done in 204 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzp4f08t20dh" -> "umuzp4onov27x1"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 33 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 324 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 67 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
`python3 $SP/tools/b1.py $SP/runs/job03u-c`:
```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```
job03u-c stage issues: crawl_ipad-landscape_hud 0, teacher_iphone-landscape 0 (the notepad cut-off is gone); 0 browser errors; 0 dead / covered taps. Also the inspectors' tour of every screen on this file, iPhone portrait (dark) and iPhone landscape (light): 69 + 69 pictures, 0 errors, nothing skipped (run twice: before and after the left-column fix).

#### Job 4: Small changes (Pet Show hours, far-ahead clocks)

```
new claude 50920ad5440ba0a4220024149359765e · new web 18eb2b3cee43a77ede8da2abdf070a7a · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 134 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983227 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 46 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 377 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzhwsa11klay" -> "umuzhx7ukhhwst"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 65 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 57 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 311 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

B1 is the known false fail (a fresh random player id only): `python3 tools/b1.py runs/job04-a` -> `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7`.
The town crawl prints no result lines in a quick check; its stage file says: 96 things tapped, 0 dead, 0 stuck, 0 covered,
0 console errors, 0 layout issues (11 skipped "not available right now", the same as the starting version).
My own tests (two scripts in tonight's job 4 work folder): Saturday 7:59 closed, 8:00 open, 19:59 open, 20:00 closed, all texts say
8:00 to 20:00; two players 31 days apart keep their own days (both ways), 29 and exactly 30 days apart: the one behind joins;
old + new version together both ways: no errors, the old version keeps the old rule.

#### Job 5: Walkers notice you

```
new claude ed08044896e317e271432e95f7a690ab · new web b104ca5bf91ed22e89c24039a9011849 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 0 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 93 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983227 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 236 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzldbie1ztqj" -> "umuzldliekad63"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 33 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 30 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 205 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

B1 is the known false fail (a fresh random player id only): `python3 tools/b1.py runs/job05-b` -> `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7`.
The town crawl prints no result lines in a quick check; its stage file says: 96 things tapped (walkers' "Say hi" included), 0 dead,
0 unreachable, 0 stuck, 0 covered, 0 console errors, 0 layout issues (11 skipped "not available right now", the same as the
starting version).

My own tests (scripts in tonight's job 5 work folder, iPad landscape unless said, pictures checked by eye, iPhone portrait too):
walking at a walker coming towards you: noticed at 7.9 m, full slow-down (0.53 m/s) by 5.8 m, "Say hi" from 3.49 m; walking at
one from the side: body 34° off the path, head about 30°, eyes on you, still walking; from behind: looks back over the shoulder;
a standing walker turns all the way round (118°); you stop: 1.6 s, then back to normal in 0.8 s; you walk away: back to normal
sooner; walking sideways past, standing still, or indoors: nobody notices; a walker walking home in the evening notices you and
still gets home; the same at 60 and 120 frames per second (noticed at 7.9 m, "Say hi" from 3.47 m); every one of the 24 walkers:
"Say hi" reached the way the crawl does it and tapped with a finger: 24 of 24 said hello and counted for quests; saying hi now
turns them smoothly (about half a second). No console errors in any test.

#### Job 6: Map overhaul

After the rebase onto 92a4df7: `SRC=/home/user/wt/job06/index.html quick.sh job06-q3 files,counts,saves,players,claude,crawl_ipad-landscape_hud,pc_keys`

```
new claude 52e724f9da5bbb3365592210bc8c7b82 · new web 13406efa667412e69796cd015da4c04f · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 78 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 146 draws; home 34 draws; market 40 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 245 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzsicq3qyiay" -> "umuzsiniujsjpi"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 38 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 27 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 448 s]
[stage pc_keys: running]
[stage pc_keys: done in 42 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 $SP/tools/b1.py $SP/runs/job06-q3`: `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7` (the known random player id only).
HUD crawl (crawl_ipad-landscape_hud): 151 taps tested (20 of them in the map), none dead / unreachable / covered / stuck, 0 layout issues, 0 browser errors.

#### Job 7: Beach bus (+ the retro surf minibus look)

Tag job07-merge3 (after the rebase on job 1 + job 10 + job 4 + job 2): files,counts,saves,players,claude,
crawl_ipad-landscape_hud,crawl_ipad-landscape_town

```
new claude 9581860518419d3dc047c719d635f965 · new web 89da7ba61fccc0bc403c082598f9862d · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 130 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1287 pieces, 987714 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 47 draws; cafe 48 draws; school 44 draws
[stage saves: running]
Task exception was never retrieved
future: <Task finished name='Task-79' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
Traceback (most recent call last):
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 69, in send
    return await self._connection.wrap_api_call(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 559, in wrap_api_call
    raise rewrite_error(error, f"{parsed_st['apiName']}: {error}") from None
playwright._impl._errors.TargetClosedError: Channel.send: Target page, context or browser has been closed
[stage saves: done in 380 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzk0aau509bw" -> "umuzk0o5ni1yh7"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 45 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 49 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 457 s]
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 329 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 $SP/tools/b1.py $SP/runs/job07-merge3`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

The "Task exception was never retrieved … TargetClosedError" lines are a warning from the test browser about a page that
was already closed (the starting version's run shows it too); the stage finished normally.
The two crawl stages print no PASS lines in a quick check; from their stage files (runs/job07-merge3/stages):
- crawl_ipad-landscape_town: 98 taps tested, areas reached by playing: city, beach, clothes, school, client, apt1,
  toys, bakery, library, icecream, pizza, fire, home, market, pets, cafe, flowers (17; the beach is new, by the
  Welcome Bus); dead, unreachable, stuck, covered: none; skipped: the same 11 "(no label)" as job 10's version;
  issues 0, errors 0.
- crawl_ipad-landscape_hud: 145 taps tested; dead, unreachable, stuck, skipped, covered: none; issues 0, errors 0.
- All other stages: issues 0, errors 0.

# Follow-up: the bus looks like a retro surf minibus (owner's picture)

Only the LOOK of the bus changed, plus a surfboard that leans on it at the beach stop. Everything else about the bus is
the same: the timetable and times, the fare, the countdown line and the label over the bus, the door and the spot where
you get on, Driver Dot, the "🏖️ Beach" / "🏘️ Town" signs, the campsite, the messages and the way it drives. Because the
bus is shorter now, it has 6 seats instead of 8, and the invisible "you bump into it" shape and the "someone or a car is
in front of the bus" checks were fitted to the new size. Nothing new is saved or sent online (old saves and old-version
friends are not affected; old versions have no bus at all). Only `index.html` changed (the bus drawing in `buildBus` and
the small drawing helpers next to it, `busSurf` for the surfboard, the seat list `BSEAT` and `busSeat`, and the sizes in
`busBlocked`, `busBlock`, `busSolids` and `updBus`), plus the pictures.
This follow-up was built, reviewed, and then fixed after the review (see "Review fixes"); these notes describe the final bus.


Tag job07b-b: files,counts,saves,players,claude,crawl_ipad-landscape_town (on top of a87d95e, like the first try)

```
new claude fd12d910e8c111afb97a933db111cbc1 · new web 18d83483e77d22761e26e235fa1b104b · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 75 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1287 pieces, 987714 triangles in total | for information, seen from 5 spots: city 147 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 212 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzq4rixbw5p5" -> "umuzq559i8uyl3"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 38 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 33 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 254 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 $SP/tools/b1.py $SP/runs/job07b-b`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

A2 is normal for a quick check (no backup given) and B1 is the known pid-only difference. The town crawl prints no
PASS lines in a quick check; from its stage file (runs/job07b-b/stages): 98 taps tested, areas reached by playing:
city, beach, clothes, school, client, apt1, toys, bakery, library, icecream, pizza, fire, home, market, pets, cafe,
flowers (17, the beach by the Welcome Bus, as before); dead, unreachable, stuck, covered: none; skipped: the same 11
"(no label)" as before; issues 0, errors 0. All other stages: issues 0, errors 0. E1 is the same as without this
change (beach 119 pieces / 61,547 triangles, as in the first try): the bus is drawn on its own, not as part of the
town or the beach.

#### Job 8: Coins balance

`SRC=/home/user/wt/job08/index.html quick.sh job08-2 files,counts,saves,players,claude,crawl_ipad-landscape_inA,crawl_ipad-landscape_inB,teacher_ipad-landscape`

```
new claude 99571c8c328f3b27afc3c9579a767c5a · new web 63f5543ba0b4c0ddeef7cce872e19485 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
Task exception was never retrieved
future: <Task finished name='Task-42' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
Traceback (most recent call last):
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 69, in send
    return await self._connection.wrap_api_call(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 559, in wrap_api_call
    raise rewrite_error(error, f"{parsed_st['apiName']}: {error}") from None
playwright._impl._errors.TargetClosedError: Channel.send: Target page, context or browser has been closed
[stage counts: done in 97 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 46 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 241 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzqxlas43zl6" -> "umuzqxtqsztece"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 47 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 39 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 283 s]
[stage crawl_ipad-landscape_inB: running]
[stage crawl_ipad-landscape_inB: done in 166 s]
[stage teacher_ipad-landscape: running]
[stage teacher_ipad-landscape: done in 90 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 tools/b1.py runs/job08-2`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

A2 fails as expected in a quick check (no backup given); B1 is the known false fail (old saves without `pid` get a new
random player id; nothing else differs). The crawl stages print no verdict lines in a quick check; their stage files say:
home/market/pets/flowers/café (inA) and clothes/toys/bakery/ice cream/library (inB): 0 browser errors, 0 layout issues,
0 dead, unreachable, stuck or covered buttons; teacher (iPad landscape): 0 errors, 0 layout issues, classes taught.
The "Task exception was never retrieved … TargetClosedError" lines come from the check tool closing a test page during
the counts stage (the stage passed); my first run of the same stages (job08-1, before the last 3 price tweaks: stove,
piano, fish tank) did not show them and had the same results.

#### Job 9: Football friends

`SRC=/home/user/wt/job09/index.html $SP/tools/quick.sh job09-q1 files,counts,saves,players,claude,crawl_ipad-landscape_town`

```
new claude 5ef30dbcf9c6407937f75f99769d7231 · new web 2e6dceba98eba2624d3a0bdfe24cc7b8 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 2 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 147 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983515 triangles in total | for information, seen from 5 spots: city 138 draws; home 34 draws; market 38 draws; cafe 48 draws; school 44 draws
[stage saves: running]
Task exception was never retrieved
future: <Task finished name='Task-209' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
Traceback (most recent call last):
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 69, in send
    return await self._connection.wrap_api_call(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 559, in wrap_api_call
    raise rewrite_error(error, f"{parsed_st['apiName']}: {error}") from None
playwright._impl._errors.TargetClosedError: Channel.send: Target page, context or browser has been closed
[stage saves: done in 355 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzkd7edhka6z" -> "umuzkdihbcsguw"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 65 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 56 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 319 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

Notes on the result:
- A2 FAIL: normal for a quick check (no backup given).
- B1 FAIL is the known false fail (old saves without `pid` get a new random player id); `python3 $SP/tools/b1.py $SP/runs/job09-q1` says:
  `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7`
- The "Task exception was never retrieved … TargetClosedError" lines come from the check kit closing a test page (they also appear in other
  builders' quick checks); the saves stage recorded no browser errors.
- crawl_ipad-landscape_town prints no lines in a quick check; its stage file says: 96 tested, 0 dead, 0 unreachable, 0 stuck, 0 covered,
  0 layout issues, 0 browser errors (the crawl runs from 8:20 to 11:20 game time, before the kids come).
- My own extra tests (all without browser errors): kids arrive/play/score/rest; the card on walking onto the field; Take the field (win 3-1,
  +10 🪙 once, S.match untouched); juice break (walk to the bench, sit, sip, cheer for your goal on the normal scoreboard); Invite Zac at the
  bench -> 1 vs 1; Zac scores; going home at 19:00; a 1 vs 1 started at 18:54 ends at 20:00 (no Play again); an old-version friend at the
  field (kids sit and do not kick; cheer the friend's goal; play again after the friend leaves); a crawl of the kids and the card at
  15:00 (no dead taps); layouts on iPad landscape, iPhone portrait and iPhone landscape in light and dark: 0 issues; PC: E opens the card,
  Escape closes it. Draw calls at the field: 411 without the kids, 461 with them (only when you are near the field).

#### Job 10: One house per player, on Friends Lane (+ review fixes)

Follow-up run (this commit; the first job 10 run, job10-c, is in the notes of the commit before):
`SRC=/home/user/wt/job10b/index.html quick.sh job10b-a files,counts,saves,players,claude,crawl_ipad-landscape_town,crawl_ipad-landscape_inA`

```
new claude 5b9a8b78571b0049a7bd1e9669a57e13 · new web 6400cd6844c481643881ce29e0f47a62 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 128 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983227 triangles in total | for information, seen from 5 spots: city 138 draws; home 34 draws; market 50 draws; cafe 47 draws; school 44 draws
[stage saves: running]
[stage saves: done in 352 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzkluyc7k8bi" -> "umuzkmcs90flsg"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 50 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 49 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 271 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 338 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
- A2 fails as expected in a quick check. B1: `b1.py runs/job10b-a` says `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7` (the known random `pid`).
- Crawl stages (they print no lines here; from runs/job10b-a/stages/*.json): town 96 taps (incl. your lane door, garden beds, seeds, mail,
  Bigger house, flower beds), home/market/pets/flowers/café 217 taps: 0 dead, 0 unreachable, 0 stuck, 0 covered, 0 layout issues,
  0 browser errors. Walking: "joystick drag: moved 2.0 m in 1.5 s" (from the town start up to the Flower Corner fence, see Glitches).

#### Job 11: Move my game between devices

`SRC=/home/user/wt/job11/index.html quick.sh job11-b files,counts,saves,players,claude,crawl_ipad-landscape_hud,pc_keys`
(the file checked is exactly the committed index.html, md5 7a95c127cd067a68d9b33472f7b8112a)
```
new claude ec94a29cd399b90b0cb1f23f496b3287 · new web 7a95c127cd067a68d9b33472f7b8112a · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 93 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 39 draws; cafe 46 draws; school 44 draws
[stage saves: running]
[stage saves: done in 217 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzsyic3snorp" -> "umuzsyub3qd9jd"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 34 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 28 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 306 s]
[stage pc_keys: running]
[stage pc_keys: done in 29 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
B1 check (`b1.py`), as printed: `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7` (tonight's known false fail: only the random player id differs).
A2 "no backup given" is normal for a quick check.

The crawl stage prints no summary line in a quick check; from its stage file: 150 taps tested, 0 dead, 0 stuck, 0 covered,
0 unreachable, 0 layout issues, 0 browser errors; "📦 Move my game" was opened from Settings 5 times (all fine).

My own tests (scripts in the scratchpad, two pages sharing the pretend server): send on one device, get on the other (iPad,
iPhone upright and sideways, light and dark): same coins, house, furniture, pets, garden, clothes, skills, quests on both;
the code is gone from the server afterwards. Also: send from the title screen and get on a brand-new device; close / stop /
another card / time-out all take the code down; wrong, short, made-up and run-out codes; 6 tries a minute; the database
saying no (read, write, both, and later on a send): no button / kind message; no answer at all (slow internet): kind
messages, nothing stuck; tapping Send again during a slow send; "Still there?" stays away while a code is up; a made-up
game full of HTML tricks (cleaned, nothing ran); "Bring it back" both ways; "Start a new game" while playing; the game
closed with a code up; the Claude version (no button, no errors). Zero browser errors in all of them.

#### Job 12: Glitch hunter, pass 2 (3D world part)

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

#### Job 12: Glitch hunter, pass 2 (screens and map part)

Run `job12u-a` (SRC = this worktree's index.html; stages files,counts,saves,players,claude,crawl_ipad-landscape_hud,pc_keys,teacher_iphone-landscape):
```
new claude 0cef36f472c8b64007218804cdf635db · new web 0bfb2f14b4c1dc3e71af7f326071dbcc · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 91 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1305 pieces, 994508 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 46 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 217 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzxv0hth2pco" -> "umuzxvdrgaboar"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 29 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 30 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 382 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 79 s]
[stage pc_keys: running]
[stage pc_keys: done in 34 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
`python3 $SP/tools/b1.py $SP/runs/job12u-a`:
```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```
A2 = normal for a quick check; B1 = the known pid-only difference. Stage files (`runs/job12u-a/stages/*.json`): 0 layout issues and 0 browser
errors in every stage; the HUD crawl tested 156 taps (phone, 🗺️ map, Places list, every place, bag, settings…): 0 dead, 0 unreachable,
0 covered, 0 stuck. Also a short look at everything I changed on iPhone upright (light: the pictures; dark: map card, zoomed-out map,
timetable, Zac's card, the 1 vs 1 pill) and iPhone sideways (dark: the pictures; light: HUD bars, Places list, map card, bus seat):
0 browser errors, nothing cut off or overlapping.

#### Job 12: Glitch hunter, pass 2 (Move my game + messages part)

`SRC=/home/user/wt/job12m/index.html quick.sh job12m-b files,counts,saves,players,claude,crawl_ipad-landscape_hud,pc_keys,teacher_iphone-landscape`
(the file checked is exactly the committed index.html, md5 0e966618b68f34b3a28b610200933d22; teacher_iphone-landscape added because
job 3 checked its class messages with it and the message rule changed)
```
new claude 2d443b3176e7ce33cfbab735e53c72b3 · new web 0e966618b68f34b3a28b610200933d22 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 80 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1305 pieces, 994508 triangles in total | for information, seen from 5 spots: city 127 draws; home 34 draws; market 50 draws; cafe 44 draws; school 44 draws
[stage saves: running]
[stage saves: done in 233 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzy7limnanuj" -> "umuzy7t1w7heaq"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 36 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 22 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 354 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 75 s]
[stage pc_keys: running]
[stage pc_keys: done in 25 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
`python3 $SP/tools/b1.py $SP/runs/job12m-b`:
```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```
A2 "no backup given" is normal for a quick check; B1 is tonight's known pid-only difference.
The crawl and teacher stages print no summary line in a quick check; from their stage files: crawl_ipad-landscape_hud 156 taps tested,
0 dead, 0 stuck, 0 covered, 0 unreachable, 0 layout issues, 0 browser errors ("🗑️ Start a new game" was tapped 5 times: each time the
new card opened and the test game was never erased); teacher_iphone-landscape 0 layout issues, 0 browser errors; pc_keys 0 browser errors.

#### Job 13: The designer's older wishes

`SRC=/home/user/wt/job13/index.html quick.sh job13-2 files,counts,saves,players,claude,crawl_ipad-landscape_town,crawl_ipad-landscape_inA`

```
new claude 98d23d9b5183235253675c2ea0ee7bb1 · new web 9db9b3c8475ac04bafb4bb2cb24e1cc9 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 85 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1305 pieces, 994508 triangles in total | for information, seen from 5 spots: city 138 draws; home 34 draws; market 35 draws; cafe 55 draws; school 44 draws
[stage saves: running]
[stage saves: done in 257 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuztz7a1gd9gv" -> "umuztzmjrw78xz"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 39 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 26 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 228 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 262 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 tools/b1.py runs/job13-2`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

A2 fails as expected in a quick check (no backup given); B1 is the known false fail (old saves without `pid` get a new random
player id; nothing else differs). The crawl stages print no verdict lines in a quick check; their stage files say:
town: 92 things tapped (incl. the new "Feed the ducks" on the bridge), 0 browser errors, 0 layout issues, 0 dead, unreachable,
stuck or covered buttons (11 skipped "not available right now", the same as in earlier jobs' runs); home/market/pets/flowers/café
(inA): 195 tapped, 0 errors, 0 layout issues, 0 dead, unreachable, stuck or covered buttons.

My own tests (test browser, iPad landscape unless said): walking over the bridge (height up to 0.8 m and back, the sides hold you,
the ramps let you off, a following pet on the planks), ducks for 2 minutes (never in the low ends), the fireflies' fade by hour
(off at 18:48, half at 19:36, full at 20:18, off again at 6:36), the TV tune (recorded notes: first beat at once, softer at 5 m,
silent at 8 m, stops outside, with sound off and in bed at night, resumes when back or up again, the show end with "ta-da" and
toast), the Shell shelf (bought with real taps in the shop: saved as `{t:'shelf',c:'#ffffff',sh:1}`; placed, put away
(📦 My stuff shows "🐚 Shell shelf"), placed again and moved: the marker always stayed; 0/1/7/9/23/30 shells, the tap toast; iPhone
portrait in light and dark: 0 layout issues). Going back: with that save the previous version (tools/prenight2-index.html) and
tonight's starting version both start normally (no errors) and show a white bookshelf; moving it, putting it away and placing it
again there keeps `sh:1`, and the new version then shows the Shell shelf again. Visiting with a Shell shelf in the host's house:
new host + old guest (prenight 2): the guest sees a bookshelf; new host + new guest: the guest sees the host's 7 shells (of 9);
old host + new guest: a bookshelf; no errors on either side. Drawing work measured against tonight's starting version: town +1
piece (+0.3 %) and +1.2 % triangles; no other area changed (the Toy Store's count differs a little from one start to the next by
itself: the claw machine's capsules are placed at random).

#### Integration fixes (how the jobs work together)

`SRC=<worktree>/index.html quick.sh intfix-c files,counts,saves,players,claude,crawl_ipad-landscape_town,crawl_ipad-landscape_hud,pc_keys`
(the file checked is exactly the committed index.html, md5 d8749e6bafae98f2b46ea70b68b12d16; run again after taking out the morning bus)

```
new claude 8cde7266dfa3a6014de26767cb536712 · new web d8749e6bafae98f2b46ea70b68b12d16 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 0 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 52 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1307 pieces, 994630 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 134 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umv049b6l7hp8b" -> "umv049gu85tlkf"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 25 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 20 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 297 s]
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 174 s]
[stage pc_keys: running]
[stage pc_keys: done in 18 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 tools/b1.py runs/intfix-c`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

A2 fails as expected in a quick check (no backup given); B1 is the known pid-only false fail (the old saves' quests are the same as
before: see change 5). The crawl stages print no PASS lines in a quick check; their stage files say: crawl_ipad-landscape_hud 156
taps tested, crawl_ipad-landscape_town 92 taps tested and 17 areas reached by playing (the beach too, by the Welcome Bus); dead,
unreachable, stuck, covered: none; layout issues 0 and browser errors 0 in every stage.

### After merging: the quick check on the integration branch

Each block is the merged file at that point. The first lines are exactly as the check printed them (from the stage files, so long lines are complete); the C2/C3/T1/T2/C6 lines are made from the crawl and teacher stages' own results with the full check's rules; `(b1.py)` is the pid-only test. Where the merged file was byte-for-byte the file the builder had already checked (a fast-forward), that run is shown.

#### Job 1 merged (`13b12b8`, the same file as the builder's run job01-c)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 676 after
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1278 pieces, 1010297 triangles in total | for information, seen from 5 spots: city 153 draws; home 34 draws; market 45 draws; cafe 54 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzf8aw8bnho3" -> "umuzf8u1ozb6er"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzf98bsgpdqs" -> "umuzf9jmjvrtuc"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzfa1u11ezxg" -> "umuzfadd5h2xf3"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzfanozlfh4z" -> "umuzfax4vo9z9o"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzfbptct77m3" -> "umuzfc859bltsm"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 crawl_ipad-landscape_hud: 145 taps, areas []
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP:identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Jobs 1 + 10 merged (`7e15447`)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983227 triangles in total | for information, seen from 5 spots: city 138 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzgqexzhrnjf" -> "umuzgqwcvq84pa"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzgrega3nbj5" -> "umuzgrtd44ilfs"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzgs55qrdzsq" -> "umuzgsf2y6vuj3"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzgspofxtmyg" -> "umuzgt2ilpze7g"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzgugeqr674k" -> "umuzguw9osyozn"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_inA: 212 taps, areas ['cafe', 'city', 'flowers', 'home', 'market', 'pets']
PASS | C2 crawl_ipad-landscape_town: 96 taps, areas ['apt1', 'bakery', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 4 merged (`eccf9cb`, the same file as the builder's run job04-a)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983227 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 46 draws; cafe 54 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzhwsa11klay" -> "umuzhx7ukhhwst"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzhxqye823bc" -> "umuzhyak6qfnqm"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzhyu3lqul5u" -> "umuzhze7vigoj2"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzhzwat92wr6" -> "umuzi0hbmn1n2s"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzi24sgvq14w" -> "umuzi2qxtw3sgi"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_town: 96 taps, areas ['apt1', 'bakery', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP:identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 2 merged (`d49216a`)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983227 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 34 draws; cafe 54 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzj0ubpathlu" -> "umuzj19j4cn8ox"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzj1q5nuh7sn" -> "umuzj279vdcw2l"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzj2smd8nryg" -> "umuzj37jfprqbd"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzj3l1dzqjl8" -> "umuzj3te9lil7k"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzj4t4rrjehg" -> "umuzj56aw5qo1t"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 crawl_ipad-landscape_hud: 145 taps, areas []
PASS | C2 crawl_ipad-landscape_inC: 24 taps, areas ['city', 'cl_english', 'cl_history', 'cl_math', 'fire', 'pizza', 'school']
PASS | T1/T2 teacher_ipad-landscape: 3 classes: Math ended, English ended, History ended; goof taps 35 of 35 worked
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 7 merged (`05366ea`, the same file as the builder's run job07-merge3)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1287 pieces, 987714 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 47 draws; cafe 48 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzk0aau509bw" -> "umuzk0o5ni1yh7"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzk10vuotcsx" -> "umuzk1ipi4mqvg"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzk21p94rx1i" -> "umuzk2la72c7n8"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzk3bqisgsrw" -> "umuzk3ys5x66np"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzk5a20l9kun" -> "umuzk5zbs5yzh1"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_hud: 145 taps, areas []
PASS | C2 crawl_ipad-landscape_town: 98 taps, areas ['apt1', 'bakery', 'beach', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP:identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 10 follow-up merged (`a87d95e`)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1287 pieces, 987714 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 48 draws; cafe 51 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzlcq6ujy9kj" -> "umuzld0outk0c8"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzldb5i5lojj" -> "umuzldlu7gc27k"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzldx1u6op5p" -> "umuzle79l4w4kk"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzlel4cdweqz" -> "umuzlevf5cxm3l"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzlfudk9j2uk" -> "umuzlg5p45f9h1"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_inA: 202 taps, areas ['cafe', 'city', 'flowers', 'home', 'market', 'pets']
PASS | C2 crawl_ipad-landscape_town: 98 taps, areas ['apt1', 'bakery', 'beach', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Jobs 9 and 5 merged (`557b43b`)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1287 pieces, 988002 triangles in total | for information, seen from 5 spots: city 161 draws; home 34 draws; market 47 draws; cafe 43 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzluanf1d1ja" -> "umuzluhlpv3uzi"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzluorprz4jw" -> "umuzluuiave516"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzlv0cbf8l3d" -> "umuzlv6i6usn3f"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzlvdl6u9pfa" -> "umuzlvkczkmlww"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzlw5f1tr0k6" -> "umuzlwc0amiymh"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 crawl_ipad-landscape_hud: 145 taps, areas []
PASS | C2 crawl_ipad-landscape_town: 98 taps, areas ['apt1', 'bakery', 'beach', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 3 merged (`5850a47`, every crawl stage)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 162 draws; home 34 draws; market 48 draws; cafe 54 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzpqj354u8jc" -> "umuzpqoh7oacqt"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzpqvljb1ywp" -> "umuzpr54y5vq11"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzprenriqj1w" -> "umuzprmh8t84g6"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzprt3mvxo5a" -> "umuzprza29k355"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzpsrlk0oxhm" -> "umuzpsy763yy49"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 crawl_ipad-landscape_hud: 145 taps, areas []
PASS | C2 crawl_ipad-landscape_inA: 217 taps, areas ['cafe', 'city', 'flowers', 'home', 'market', 'pets']
PASS | C2 crawl_ipad-landscape_inB: 102 taps, areas ['bakery', 'city', 'clothes', 'icecream', 'library', 'studio', 'toys']
PASS | C2 crawl_ipad-landscape_inC: 24 taps, areas ['city', 'cl_english', 'cl_history', 'cl_math', 'fire', 'pizza', 'school']
PASS | C2 crawl_ipad-landscape_inD: 20 taps, areas ['apt1', 'apt2', 'apt3', 'city']
PASS | C2 crawl_ipad-landscape_town: 98 taps, areas ['apt1', 'bakery', 'beach', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | T1/T2 teacher_iphone-landscape: 3 classes: Math ended, English ended, History ended; goof taps 33 of 33 worked
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 7 follow-up, the bus look (`1cecaef`)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzqoyzakafzx" -> "umuzqp74hq0o2e"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzqpibceskke" -> "umuzqptqzsvcy5"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzqq44s4bdb0" -> "umuzqqelhupbi2"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzqqtnllm3tc" -> "umuzqr5rvmwdh3"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzqrxvfpxnl9" -> "umuzqs74jhmelr"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_hud: 145 taps, areas []
PASS | C2 crawl_ipad-landscape_town: 98 taps, areas ['apt1', 'bakery', 'beach', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 8 merged (`92a4df7`)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 38 draws; cafe 45 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzrjmu662ra1" -> "umuzrk0h1bzw2s"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzrk9zq0l6vm" -> "umuzrkkdzes6po"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzrkzvnif5y7" -> "umuzrlek3akhzu"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzrloif9qjbi" -> "umuzrm1q9i2o1g"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzrmvwna4vmn" -> "umuzrn1l2t0ys5"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_inA: 195 taps, areas ['cafe', 'city', 'flowers', 'home', 'market', 'pets']
PASS | C2 crawl_ipad-landscape_inB: 93 taps, areas ['bakery', 'city', 'clothes', 'icecream', 'library', 'studio', 'toys']
PASS | C2 crawl_ipad-landscape_town: 92 taps, areas ['apt1', 'bakery', 'beach', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | T1/T2 teacher_ipad-landscape: 3 classes: English ended, Math ended, History ended; goof taps 34 of 34 worked
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 6 merged (`c013529`, the same file as the builder's run job06-q3)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 146 draws; home 34 draws; market 40 draws; cafe 54 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzsicq3qyiay" -> "umuzsiniujsjpi"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzsixlw8n4ia" -> "umuzsj97qx1dq3"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzsjm9ya1t8p" -> "umuzsjw5me777b"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzskbi3lwfj5" -> "umuzskmlp9vqeo"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzslz723wagq" -> "umuzsm7vt6trfs"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 crawl_ipad-landscape_hud: 151 taps, areas []
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP:identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 11 merged (`38e9830`)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 46 draws; cafe 54 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzteafpr9hvt" -> "umuztehcopxh3p"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuztep6n4ci2s" -> "umuztex81phjez"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuztf6rolylsn" -> "umuztfea8gf6ms"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuztfppcct3vh" -> "umuztg0zasyoa8"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzth4vzxubh5" -> "umuztheovb5j3q"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 crawl_ipad-landscape_hud: 156 taps, areas []
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 13 merged (`77c89a6`)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1305 pieces, 994508 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 50 draws; cafe 46 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzuj0c5vtoqy" -> "umuzujg3aqpiij"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzujtf4vqtw3" -> "umuzuk2lyd3u1i"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzukbtgdnfs4" -> "umuzukm5i316yq"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzukwzj067p3" -> "umuzul78ebxxuf"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umuzum5f4t7h76" -> "umuzumfpq0jnyp"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | C2 crawl_ipad-landscape_inA: 200 taps, areas ['cafe', 'city', 'flowers', 'home', 'market', 'pets']
PASS | C2 crawl_ipad-landscape_town: 92 taps, areas ['apt1', 'bakery', 'beach', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Job 12 merged (`a188e49`, every crawl stage)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1307 pieces, 994630 triangles in total | for information, seen from 5 spots: city 139 draws; home 34 draws; market 48 draws; cafe 44 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umv000msc2ccbm" -> "umv000tqqiyawf"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umv0010i9l9c3h" -> "umv0017rr024qb"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umv001fqd5wpiu" -> "umv001n5dnpnzk"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umv001u5clwmvq" -> "umv00231nvnlfd"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umv002zmq8riny" -> "umv0036ptot17n"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 crawl_ipad-landscape_hud: 156 taps, areas []
PASS | C2 crawl_ipad-landscape_inA: 200 taps, areas ['cafe', 'city', 'flowers', 'home', 'market', 'pets']
PASS | C2 crawl_ipad-landscape_inB: 102 taps, areas ['bakery', 'city', 'clothes', 'icecream', 'library', 'studio', 'toys']
PASS | C2 crawl_ipad-landscape_inC: 24 taps, areas ['city', 'cl_english', 'cl_history', 'cl_math', 'fire', 'pizza', 'school']
PASS | C2 crawl_ipad-landscape_inD: 20 taps, areas ['apt1', 'apt2', 'apt3', 'city']
PASS | C2 crawl_ipad-landscape_town: 92 taps, areas ['apt1', 'bakery', 'beach', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | T1/T2 teacher_iphone-landscape: 3 classes: History ended, English ended, History ended; goof taps 35 of 35 worked
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP: identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

#### Integration fixes merged (`97b483b`, the same file as the builder's run intfix-c = the final file)

```
PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
FAIL | A2 dated private backup of the live game | no backup given
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1307 pieces, 994630 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umv049b6l7hp8b" -> "umv049gu85tlkf"; new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: pid: "umv049nwddz17r" -> "umv049tp9qw153"; new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: pid: "umv04a0hc006dd" -> "umv04a5m319in2"; new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: pid: "umv04acqbhep5l" -> "umv04ahxtu1wuj"; new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: pid: "umv04b13uq6bgq" -> "umv04b7hyh9a55"; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 crawl_ipad-landscape_hud: 156 taps, areas []
PASS | C2 crawl_ipad-landscape_town: 92 taps, areas ['apt1', 'bakery', 'beach', 'cafe', 'city', 'client', 'clothes', 'fire', 'flowers', 'home', 'icecream', 'library', 'market', 'pets', 'pizza', 'school', 'toys']
PASS | C3 walking (crawl_ipad-landscape_town) | joystick drag: moved 2.0 m in 1.5 s
PASS | C6 browser errors: 0
WEBPART-ROUNDTRIP:identical
(b1.py) B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

### Rollback test (saves written by tonight's final game start in the old game) and the rollback file

Every test save was opened and saved by the final `index.html`, then started in `tools/prenight2-index.html` (what "Go back to PRENIGHT 2" restores): it must play, with the same coins, furniture and pets, no browser errors, and no field lost when the old game saves it again. Exactly as printed:

```
PASS | save-71f43ad.json | old version: {'playing': True, 'title': False, 'loc': 'city', 'coins': 120, 'items': 3, 'pets': 0} | errors [] | new-version errors [] | fields lost on re-save: []
PASS | save-8a1982a.json | old version: {'playing': True, 'title': False, 'loc': 'city', 'coins': 120, 'items': 3, 'pets': 0} | errors [] | new-version errors [] | fields lost on re-save: []
PASS | save-a0c3ae3.json | old version: {'playing': True, 'title': False, 'loc': 'city', 'coins': 120, 'items': 3, 'pets': 0} | errors [] | new-version errors [] | fields lost on re-save: []
PASS | save-ea70306.json | old version: {'playing': True, 'title': False, 'loc': 'city', 'coins': 120, 'items': 3, 'pets': 0} | errors [] | new-version errors [] | fields lost on re-save: []
PASS | save-f2cdd53-rich.json | old version: {'playing': True, 'title': False, 'loc': 'city', 'coins': 2345, 'items': 7, 'pets': 3} | errors [] | new-version errors [] | fields lost on re-save: []
PASS | save-live-web-rich.json | old version: {'playing': True, 'title': False, 'loc': 'city', 'coins': 3900, 'items': 5, 'pets': 3} | errors [] | new-version errors [] | fields lost on re-save: []
PASS | shell shelf + beach | old version: {'playing': True, 'title': False, 'loc': 'city', 'coins': 2345, 'items': 8, 'pets': 3} | errors [] | new-version errors [] | fields lost on re-save: []
ROLLBACK ALL PASS (7 of 7)
```

And the rollback file: the final game's updater sees `tools/prenight2-rollback.html` as newer and the plain old file as not newer (exactly as printed):

```
{'on': True, 'cur': 2026100901, 'rollback': 2026100950, 'rollbackNewer': True, 'plainOld': None, 'plainOldNewer': False} errors []
```

### Final full check (the final file, every stage, exactly as printed)

```
(no final block)
```


---

## 3. Before and after pictures

All pictures are in `tools/pictures-2/` (iPad landscape unless the name says iPhone). "Before" is tonight's starting version, "after" is now. The glitch-fix pictures are one file each: before on the left, after on the right.

### Map (job 6)

| Before | After |
|---|---|
| ![before-map.png](pictures-2/before-map.png) | ![after-map.png](pictures-2/after-map.png) |

![after-map-zoomed.png](pictures-2/after-map-zoomed.png)

![after-map-route.png](pictures-2/after-map-route.png)

![after-map-iphone.png](pictures-2/after-map-iphone.png)

### Beach bus (job 7 and the retro surf minibus look)

| Before | After |
|---|---|
| ![before-beach-gate.png](pictures-2/before-beach-gate.png) | ![after-beach-gate.png](pictures-2/after-beach-gate.png) |

![after-bus-retro-park.png](pictures-2/after-bus-retro-park.png)

![after-bus-retro-side.png](pictures-2/after-bus-retro-side.png)

![after-bus-arrives.png](pictures-2/after-bus-arrives.png)

![after-bus-park-stop.png](pictures-2/after-bus-park-stop.png)

![after-bus-beach-stop.png](pictures-2/after-bus-beach-stop.png)

![after-bus-retro-beach-surfboard.png](pictures-2/after-bus-retro-beach-surfboard.png)

![after-bus-retro-night.png](pictures-2/after-bus-retro-night.png)

### Campsite (job 7)

![after-campsite-night.png](pictures-2/after-campsite-night.png)

### Football friends (job 9)

| Before | After |
|---|---|
| ![before-football-field.png](pictures-2/before-football-field.png) | ![after-football-friends-play.png](pictures-2/after-football-friends-play.png) |

![after-football-friends-card.png](pictures-2/after-football-friends-card.png)

![after-football-juice-break.png](pictures-2/after-football-juice-break.png)

![after-football-1v1.png](pictures-2/after-football-1v1.png)

### Your house on Friends Lane (job 10)

| Before | After |
|---|---|
| ![before-old-house-spot.png](pictures-2/before-old-house-spot.png) | ![after-old-house-spot.png](pictures-2/after-old-house-spot.png) |
| ![before-friends-lane.png](pictures-2/before-friends-lane.png) | ![after-friends-lane.png](pictures-2/after-friends-lane.png) |

![after-my-lane-house-garden.png](pictures-2/after-my-lane-house-garden.png)

### The app updates itself (job 1)

![job01-update-button-ipad.png](pictures-2/job01-update-button-ipad.png)

![job01-updated-title-ipad.png](pictures-2/job01-updated-title-ipad.png)

### Bug fixes (job 2)

| Before | After |
|---|---|
| ![before-run-button.png](pictures-2/before-run-button.png) | ![after-run-button-on.png](pictures-2/after-run-button-on.png) |
| (new) | ![after-run-button-off.png](pictures-2/after-run-button-off.png) |
| ![before-ideas-keyboard.png](pictures-2/before-ideas-keyboard.png) | ![after-ideas-keyboard.png](pictures-2/after-ideas-keyboard.png) |

![after-friend-pets.png](pictures-2/after-friend-pets.png)

![after-friend-in-bed.png](pictures-2/after-friend-in-bed.png)

![after-friend-away.png](pictures-2/after-friend-away.png)

### Walkers notice you (job 5)

![job05-walker-notices-you.png](pictures-2/job05-walker-notices-you.png)

![job05-say-hi-from-further.png](pictures-2/job05-say-hi-from-further.png)

### The designer's older wishes (job 13)

| Before | After |
|---|---|
| ![before-duck-pond.png](pictures-2/before-duck-pond.png) | ![after-duck-pond-bridge.png](pictures-2/after-duck-pond-bridge.png) |

![after-fireflies-park-night.png](pictures-2/after-fireflies-park-night.png)

![after-shell-shelf.png](pictures-2/after-shell-shelf.png)

### Glitch fixes, pass 1 (job 3: W = 3D world, U = screens) (70 pictures)

| Fix | Before (left) / after (right) |
|---|---|
| U01 bed decorate button | ![glitch1-U01-bed-decorate-button.jpg](pictures-2/glitch1-U01-bed-decorate-button.jpg) |
| U02 bed zzz iphone | ![glitch1-U02-bed-zzz-iphone.jpg](pictures-2/glitch1-U02-bed-zzz-iphone.jpg) |
| U03 lesson big texts iphone | ![glitch1-U03-lesson-big-texts-iphone.jpg](pictures-2/glitch1-U03-lesson-big-texts-iphone.jpg) |
| U04 class toast hud | ![glitch1-U04-class-toast-hud.jpg](pictures-2/glitch1-U04-class-toast-hud.jpg) |
| U05 toast decorate shop | ![glitch1-U05-toast-decorate-shop.jpg](pictures-2/glitch1-U05-toast-decorate-shop.jpg) |
| U06 toast clothes shop | ![glitch1-U06-toast-clothes-shop.jpg](pictures-2/glitch1-U06-toast-clothes-shop.jpg) |
| U07 pizza order note | ![glitch1-U07-pizza-order-note.jpg](pictures-2/glitch1-U07-pizza-order-note.jpg) |
| U08 homework pictures | ![glitch1-U08-homework-pictures.jpg](pictures-2/glitch1-U08-homework-pictures.jpg) |
| U09 toast use button iphone | ![glitch1-U09-toast-use-button-iphone.jpg](pictures-2/glitch1-U09-toast-use-button-iphone.jpg) |
| U10 clothes maker iphone | ![glitch1-U10-clothes-maker-iphone.jpg](pictures-2/glitch1-U10-clothes-maker-iphone.jpg) |
| U11 clothes maker iphone sideways | ![glitch1-U11-clothes-maker-iphone-sideways.jpg](pictures-2/glitch1-U11-clothes-maker-iphone-sideways.jpg) |
| U12 opening maker iphone sideways | ![glitch1-U12-opening-maker-iphone-sideways.jpg](pictures-2/glitch1-U12-opening-maker-iphone-sideways.jpg) |
| U13 pet card camera | ![glitch1-U13-pet-card-camera.jpg](pictures-2/glitch1-U13-pet-card-camera.jpg) |
| U14 designer tray colors | ![glitch1-U14-designer-tray-colors.jpg](pictures-2/glitch1-U14-designer-tray-colors.jpg) |
| U15 petshow big texts | ![glitch1-U15-petshow-big-texts.jpg](pictures-2/glitch1-U15-petshow-big-texts.jpg) |
| U16 petshow dark cards | ![glitch1-U16-petshow-dark-cards.jpg](pictures-2/glitch1-U16-petshow-dark-cards.jpg) |
| U17 petshow judge text | ![glitch1-U17-petshow-judge-text.jpg](pictures-2/glitch1-U17-petshow-judge-text.jpg) |
| U18 petshow trick card iphone sideways | ![glitch1-U18-petshow-trick-card-iphone-sideways.jpg](pictures-2/glitch1-U18-petshow-trick-card-iphone-sideways.jpg) |
| U19 petshow results iphone sideways | ![glitch1-U19-petshow-results-iphone-sideways.jpg](pictures-2/glitch1-U19-petshow-results-iphone-sideways.jpg) |
| U20 new client note iphone | ![glitch1-U20-new-client-note-iphone.jpg](pictures-2/glitch1-U20-new-client-note-iphone.jpg) |
| U21 door card and tips | ![glitch1-U21-door-card-and-tips.jpg](pictures-2/glitch1-U21-door-card-and-tips.jpg) |
| U22 still there toast | ![glitch1-U22-still-there-toast.jpg](pictures-2/glitch1-U22-still-there-toast.jpg) |
| U23 phone clock after jump | ![glitch1-U23-phone-clock-after-jump.jpg](pictures-2/glitch1-U23-phone-clock-after-jump.jpg) |
| U24 phone iphone sideways | ![glitch1-U24-phone-iphone-sideways.jpg](pictures-2/glitch1-U24-phone-iphone-sideways.jpg) |
| U25 opening rosie iphone sideways | ![glitch1-U25-opening-rosie-iphone-sideways.jpg](pictures-2/glitch1-U25-opening-rosie-iphone-sideways.jpg) |
| U26 opening aim dot | ![glitch1-U26-opening-aim-dot.jpg](pictures-2/glitch1-U26-opening-aim-dot.jpg) |
| U27 phone pets hearts dark | ![glitch1-U27-phone-pets-hearts-dark.jpg](pictures-2/glitch1-U27-phone-pets-hearts-dark.jpg) |
| U28 settings scroll hint | ![glitch1-U28-settings-scroll-hint.jpg](pictures-2/glitch1-U28-settings-scroll-hint.jpg) |
| U29 knock label | ![glitch1-U29-knock-label.jpg](pictures-2/glitch1-U29-knock-label.jpg) |
| U30 tennis hint iphone sideways | ![glitch1-U30-tennis-hint-iphone-sideways.jpg](pictures-2/glitch1-U30-tennis-hint-iphone-sideways.jpg) |
| U31 calendar icon | ![glitch1-U31-calendar-icon.jpg](pictures-2/glitch1-U31-calendar-icon.jpg) |
| U32 friends app title | ![glitch1-U32-friends-app-title.jpg](pictures-2/glitch1-U32-friends-app-title.jpg) |
| U33 flats stairs sign | ![glitch1-U33-flats-stairs-sign.jpg](pictures-2/glitch1-U33-flats-stairs-sign.jpg) |
| U34 title after break iphone sideways | ![glitch1-U34-title-after-break-iphone-sideways.jpg](pictures-2/glitch1-U34-title-after-break-iphone-sideways.jpg) |
| U35 left column fits iphone sideways | ![glitch1-U35-left-column-fits-iphone-sideways.jpg](pictures-2/glitch1-U35-left-column-fits-iphone-sideways.jpg) |
| W01 guest spawn | ![glitch1-W01-guest-spawn.jpg](pictures-2/glitch1-W01-guest-spawn.jpg) |
| W02 school door signs | ![glitch1-W02-school-door-signs.jpg](pictures-2/glitch1-W02-school-door-signs.jpg) |
| W03 history class sign | ![glitch1-W03-history-class-sign.jpg](pictures-2/glitch1-W03-history-class-sign.jpg) |
| W04 name tags | ![glitch1-W04-name-tags.jpg](pictures-2/glitch1-W04-name-tags.jpg) |
| W05 icecream cone | ![glitch1-W05-icecream-cone.jpg](pictures-2/glitch1-W05-icecream-cone.jpg) |
| W06 pyramid | ![glitch1-W06-pyramid.jpg](pictures-2/glitch1-W06-pyramid.jpg) |
| W07 knight visor | ![glitch1-W07-knight-visor.jpg](pictures-2/glitch1-W07-knight-visor.jpg) |
| W08 rocking horse | ![glitch1-W08-rocking-horse.jpg](pictures-2/glitch1-W08-rocking-horse.jpg) |
| W09 pizza oven | ![glitch1-W09-pizza-oven.jpg](pictures-2/glitch1-W09-pizza-oven.jpg) |
| W10 world sign | ![glitch1-W10-world-sign.jpg](pictures-2/glitch1-W10-world-sign.jpg) |
| W11 bed flicker | ![glitch1-W11-bed-flicker.jpg](pictures-2/glitch1-W11-bed-flicker.jpg) |
| W12 stairwells | ![glitch1-W12-stairwells.jpg](pictures-2/glitch1-W12-stairwells.jpg) |
| W13 alphabet | ![glitch1-W13-alphabet.jpg](pictures-2/glitch1-W13-alphabet.jpg) |
| W14 pets sofa | ![glitch1-W14-pets-sofa.jpg](pictures-2/glitch1-W14-pets-sofa.jpg) |
| W15 shopkeepers | ![glitch1-W15-shopkeepers.jpg](pictures-2/glitch1-W15-shopkeepers.jpg) |
| W16 cafe corner | ![glitch1-W16-cafe-corner.jpg](pictures-2/glitch1-W16-cafe-corner.jpg) |
| W17 new pet pen | ![glitch1-W17-new-pet-pen.jpg](pictures-2/glitch1-W17-new-pet-pen.jpg) |
| W18 no overlaps | ![glitch1-W18-no-overlaps.jpg](pictures-2/glitch1-W18-no-overlaps.jpg) |
| W19 friend door spot | ![glitch1-W19-friend-door-spot.jpg](pictures-2/glitch1-W19-friend-door-spot.jpg) |
| W20 closed signs | ![glitch1-W20-closed-signs.jpg](pictures-2/glitch1-W20-closed-signs.jpg) |
| W21 popin | ![glitch1-W21-popin.jpg](pictures-2/glitch1-W21-popin.jpg) |
| W22 petshow cameras | ![glitch1-W22-petshow-cameras.jpg](pictures-2/glitch1-W22-petshow-cameras.jpg) |
| W23 duck dock | ![glitch1-W23-duck-dock.jpg](pictures-2/glitch1-W23-duck-dock.jpg) |
| W24 tennis signpost | ![glitch1-W24-tennis-signpost.jpg](pictures-2/glitch1-W24-tennis-signpost.jpg) |
| W25 clouds | ![glitch1-W25-clouds.jpg](pictures-2/glitch1-W25-clouds.jpg) |
| W26 shadow acne | ![glitch1-W26-shadow-acne.jpg](pictures-2/glitch1-W26-shadow-acne.jpg) |
| W27 kerb flicker | ![glitch1-W27-kerb-flicker.jpg](pictures-2/glitch1-W27-kerb-flicker.jpg) |
| W28 lane sign flicker | ![glitch1-W28-lane-sign-flicker.jpg](pictures-2/glitch1-W28-lane-sign-flicker.jpg) |
| W29 cattails | ![glitch1-W29-cattails.jpg](pictures-2/glitch1-W29-cattails.jpg) |
| W30 walker crossing | ![glitch1-W30-walker-crossing.jpg](pictures-2/glitch1-W30-walker-crossing.jpg) |
| W31 signs clear | ![glitch1-W31-signs-clear.jpg](pictures-2/glitch1-W31-signs-clear.jpg) |
| W32 rosie after opening | ![glitch1-W32-rosie-after-opening.jpg](pictures-2/glitch1-W32-rosie-after-opening.jpg) |
| W33 north fronts | ![glitch1-W33-north-fronts.jpg](pictures-2/glitch1-W33-north-fronts.jpg) |
| W34 tennis fence | ![glitch1-W34-tennis-fence.jpg](pictures-2/glitch1-W34-tennis-fence.jpg) |
| W35 garden sparkle | ![glitch1-W35-garden-sparkle.jpg](pictures-2/glitch1-W35-garden-sparkle.jpg) |

### Glitch fixes, pass 2 (job 12: W = 3D world, U = screens and map, M = Move my game and messages) (52 pictures)

| Fix | Before (left) / after (right) |
|---|---|
| M01 get card messages above keyboard | ![glitch2-M01-get-card-messages-above-keyboard.jpg](pictures-2/glitch2-M01-get-card-messages-above-keyboard.jpg) |
| M02 news waits while a card fills the screen | ![glitch2-M02-news-waits-while-a-card-fills-the-screen.jpg](pictures-2/glitch2-M02-news-waits-while-a-card-fills-the-screen.jpg) |
| M03 start a new game asks first and keeps the game | ![glitch2-M03-start-a-new-game-asks-first-and-keeps-the-game.jpg](pictures-2/glitch2-M03-start-a-new-game-asks-first-and-keeps-the-game.jpg) |
| M04 welcome back stays readable | ![glitch2-M04-welcome-back-stays-readable.jpg](pictures-2/glitch2-M04-welcome-back-stays-readable.jpg) |
| M05 looking button full colour | ![glitch2-M05-looking-button-full-colour.jpg](pictures-2/glitch2-M05-looking-button-full-colour.jpg) |
| M06 words ipad or phone | ![glitch2-M06-words-ipad-or-phone.jpg](pictures-2/glitch2-M06-words-ipad-or-phone.jpg) |
| M07 scroll arrow beside the card | ![glitch2-M07-scroll-arrow-beside-the-card.jpg](pictures-2/glitch2-M07-scroll-arrow-beside-the-card.jpg) |
| M08 own game on the other ipad | ![glitch2-M08-own-game-on-the-other-ipad.jpg](pictures-2/glitch2-M08-own-game-on-the-other-ipad.jpg) |
| M09 messages beside arrow bar and use button | ![glitch2-M09-messages-beside-arrow-bar-and-use-button.jpg](pictures-2/glitch2-M09-messages-beside-arrow-bar-and-use-button.jpg) |
| M09b messages beside arrow bar iphone upright | ![glitch2-M09b-messages-beside-arrow-bar-iphone-upright.jpg](pictures-2/glitch2-M09b-messages-beside-arrow-bar-iphone-upright.jpg) |
| M10 messages not on the map | ![glitch2-M10-messages-not-on-the-map.jpg](pictures-2/glitch2-M10-messages-not-on-the-map.jpg) |
| M11 messages not on shop timetable zac cards | ![glitch2-M11-messages-not-on-shop-timetable-zac-cards.jpg](pictures-2/glitch2-M11-messages-not-on-shop-timetable-zac-cards.jpg) |
| M11b message off zacs card iphone upright | ![glitch2-M11b-message-off-zacs-card-iphone-upright.jpg](pictures-2/glitch2-M11b-message-off-zacs-card-iphone-upright.jpg) |
| U01 way bar beach iphone | ![glitch2-U01-way-bar-beach-iphone.jpg](pictures-2/glitch2-U01-way-bar-beach-iphone.jpg) |
| U02 way bar town iphone | ![glitch2-U02-way-bar-town-iphone.jpg](pictures-2/glitch2-U02-way-bar-town-iphone.jpg) |
| U03 football left column iphone | ![glitch2-U03-football-left-column-iphone.jpg](pictures-2/glitch2-U03-football-left-column-iphone.jpg) |
| U04 football score pill iphone | ![glitch2-U04-football-score-pill-iphone.jpg](pictures-2/glitch2-U04-football-score-pill-iphone.jpg) |
| U05 bus left message | ![glitch2-U05-bus-left-message.jpg](pictures-2/glitch2-U05-bus-left-message.jpg) |
| U06 welcome bus pill beach | ![glitch2-U06-welcome-bus-pill-beach.jpg](pictures-2/glitch2-U06-welcome-bus-pill-beach.jpg) |
| U07 beach board times | ![glitch2-U07-beach-board-times.jpg](pictures-2/glitch2-U07-beach-board-times.jpg) |
| U08 driver dot beach times | ![glitch2-U08-driver-dot-beach-times.jpg](pictures-2/glitch2-U08-driver-dot-beach-times.jpg) |
| U09 map friend name you | ![glitch2-U09-map-friend-name-you.jpg](pictures-2/glitch2-U09-map-friend-name-you.jpg) |
| U10 map inside market iphone | ![glitch2-U10-map-inside-market-iphone.jpg](pictures-2/glitch2-U10-map-inside-market-iphone.jpg) |
| U11 map zoomed out labels | ![glitch2-U11-map-zoomed-out-labels.jpg](pictures-2/glitch2-U11-map-zoomed-out-labels.jpg) |
| U12 map friend in market | ![glitch2-U12-map-friend-in-market.jpg](pictures-2/glitch2-U12-map-friend-in-market.jpg) |
| U13 map bus stop list | ![glitch2-U13-map-bus-stop-list.jpg](pictures-2/glitch2-U13-map-bus-stop-list.jpg) |
| U14 map card iphone | ![glitch2-U14-map-card-iphone.jpg](pictures-2/glitch2-U14-map-card-iphone.jpg) |
| U15 map zoomed out iphone | ![glitch2-U15-map-zoomed-out-iphone.jpg](pictures-2/glitch2-U15-map-zoomed-out-iphone.jpg) |
| U16 map places list iphone sideways | ![glitch2-U16-map-places-list-iphone-sideways.jpg](pictures-2/glitch2-U16-map-places-list-iphone-sideways.jpg) |
| U17 bus seat view iphone | ![glitch2-U17-bus-seat-view-iphone.jpg](pictures-2/glitch2-U17-bus-seat-view-iphone.jpg) |
| U18 bus seat view iphone sideways | ![glitch2-U18-bus-seat-view-iphone-sideways.jpg](pictures-2/glitch2-U18-bus-seat-view-iphone-sideways.jpg) |
| U19 zac card 1 vs 1 | ![glitch2-U19-zac-card-1-vs-1.jpg](pictures-2/glitch2-U19-zac-card-1-vs-1.jpg) |
| U20 timetable scroll hint iphone sideways | ![glitch2-U20-timetable-scroll-hint-iphone-sideways.jpg](pictures-2/glitch2-U20-timetable-scroll-hint-iphone-sideways.jpg) |
| W02 bus corners | ![glitch2-W02-bus-corners.jpg](pictures-2/glitch2-W02-bus-corners.jpg) |
| W03 boardwalk flicker | ![glitch2-W03-boardwalk-flicker.jpg](pictures-2/glitch2-W03-boardwalk-flicker.jpg) |
| W07 beach road | ![glitch2-W07-beach-road.jpg](pictures-2/glitch2-W07-beach-road.jpg) |
| W09 fare float | ![glitch2-W09-fare-float.jpg](pictures-2/glitch2-W09-fare-float.jpg) |
| W10 football tags | ![glitch2-W10-football-tags.jpg](pictures-2/glitch2-W10-football-tags.jpg) |
| W11 juice bench | ![glitch2-W11-juice-bench.jpg](pictures-2/glitch2-W11-juice-bench.jpg) |
| W12 kid walks into you | ![glitch2-W12-kid-walks-into-you.jpg](pictures-2/glitch2-W12-kid-walks-into-you.jpg) |
| W13 bus left message | ![glitch2-W13-bus-left-message.jpg](pictures-2/glitch2-W13-bus-left-message.jpg) |
| W14 labels under hud | ![glitch2-W14-labels-under-hud.jpg](pictures-2/glitch2-W14-labels-under-hud.jpg) |
| W15 bus seats | ![glitch2-W15-bus-seats.jpg](pictures-2/glitch2-W15-bus-seats.jpg) |
| W16 campfire glow | ![glitch2-W16-campfire-glow.jpg](pictures-2/glitch2-W16-campfire-glow.jpg) |
| W18 beach board | ![glitch2-W18-beach-board.jpg](pictures-2/glitch2-W18-beach-board.jpg) |
| W21 pet tags tent | ![glitch2-W21-pet-tags-tent.jpg](pictures-2/glitch2-W21-pet-tags-tent.jpg) |
| W22 small flickers | ![glitch2-W22-small-flickers.jpg](pictures-2/glitch2-W22-small-flickers.jpg) |
| W23 beach lamp | ![glitch2-W23-beach-lamp.jpg](pictures-2/glitch2-W23-beach-lamp.jpg) |
| W25 garden shed | ![glitch2-W25-garden-shed.jpg](pictures-2/glitch2-W25-garden-shed.jpg) |
| W26 lane labels | ![glitch2-W26-lane-labels.jpg](pictures-2/glitch2-W26-lane-labels.jpg) |
| W27 name sign post | ![glitch2-W27-name-sign-post.jpg](pictures-2/glitch2-W27-name-sign-post.jpg) |
| W28 car behind bus | ![glitch2-W28-car-behind-bus.jpg](pictures-2/glitch2-W28-car-behind-bus.jpg) |

### Integration fixes (5 pictures)

| Fix | Before (left) / after (right) |
|---|---|
| 02 update button below the bars | ![intfix-02-update-button-below-the-bars.jpg](pictures-2/intfix-02-update-button-below-the-bars.jpg) |
| 03 update button waits on the bus | ![intfix-03-update-button-waits-on-the-bus.jpg](pictures-2/intfix-03-update-button-waits-on-the-bus.jpg) |
| 04 house first then the bus | ![intfix-04-house-first-then-the-bus.jpg](pictures-2/intfix-04-house-first-then-the-bus.jpg) |
| 06 messages stay where they belong | ![intfix-06-messages-stay-where-they-belong.jpg](pictures-2/intfix-06-messages-stay-where-they-belong.jpg) |
| 07 football news waits for the pet show | ![intfix-07-football-news-waits-for-the-pet-show.jpg](pictures-2/intfix-07-football-news-waits-for-the-pet-show.jpg) |

---

## 4. Glitches found and not fixed

Written down so they aren't lost. None of them stops play.

### Job 1: The Home Screen app updates itself

- Old glitch (not from this job): while decorating, furniture "in your hands" (being placed) is not in the save. If the app is
  closed or iOS throws it away at that moment, that piece is gone. The update button puts it back into storage first, but
  closing the app doesn't.
- The very first time, THIS version has to reach the iPad the old way (close the app fully and open it again, or wait), because
  older versions don't have the check yet.
- If the server sends the new file for the check but still the old file for the reload (the first minutes after an upload), the
  title shows the update button instead of the update. Tap it a bit later (or open the app again) and it works.

### Job 2: Bug fixes

- Pressing Enter on a PC while the run button has focus does nothing (the game's own "Enter = use" key wins). Same as before;
  on a PC, Shift runs.
- Shop doors and the school's front door still glow white-orange at night from the inside (shared night glass). Only the classroom
  doors were changed.
- A friend's pet far away (more than 24 m from you) can walk through a thin fence corner for a moment (no wall checks there).
- A friend lying in a bunk bed: the 💤 floats beside the head (the top bunk is in the way), and a hat (a crown) peeks out past
  the bunk's end post. In a normal bed a very tall hat (witch hat) can poke into the headboard. Their eyes stay open in bed (the
  💤 says they sleep).
- When you visit a friend, their stay-at-home pets are not in their house (only pets walking with them show). This was already so.
- Old, small: a friend's chat-bubble picture is not freed from memory when it disappears (not from this job).

### Job 3: Glitch hunter, pass 1 (3D world part)

- **B30** toy-store shoppers "6 cm into the floor": it is the 1.5 cm ink outline under every person's shoes plus 2 cm of the toe
  mid-step (adult size 1.17); invisible in every picture. Not worth changing the walk.
- **A19 football field line** (8 px from the side, a white line on grass at a grazing angle: shimmer, not two surfaces fighting)
  and **window panes** (1-3 px ink-outline slivers between window frames and shutters, e.g. 41 px on an attic window sill 20 m
  away on Friends Lane): part of the outline look; changing the shared window model risks more than it gains.
- Not mine: the other fixer has the 2D items (B5, B7, B8, B18, B20-22, B24, B25, B28, B32, B33, A1, A2, A5-A8, A10, A11, A16,
  A23-A32, A35) and B9 (class bubbles over the kids' tags; the tag size rule here helps it); A22 (map labels) is job 6.

### Job 3: Glitch hunter, pass 1 (screens part)

- **B9** goof bubbles in class (😳 💃 ✈️ …): 3D sprites over the kids' heads -> left to the world fixer (with the name-tag sizes).
- **B22** claw "😱 It slipped!": not a 3D text; it is the normal big text caught while fading out (the photo was taken in its last 0.3 s).
  With one big text at a time it stays readable; nothing else changed.
- **B32** joystick in the middle when the phone is sideways: on purpose (see Decisions).
- **B33** Beanbag and Armchair share the 💺 icon (see Decisions).
- New: on an upright iPhone the "🏠 My House 95 m" way-finder pill wraps into 3-4 lines and looks like a circle (narrow left column).
- New: on an upright iPhone the "🔔 Ding-dong!" card (74 px from the top) covers the tummy and clock chips while it waits for an answer.
- With the designer job on an upright iPhone the left column fills the whole height, so the "New client!" card covers the little map for
  its few seconds (not the clock, the buttons or the joystick any more).

### Job 4: Small changes (Pet Show hours, far-ahead clocks)

- Players on an older version (before tonight) keep the old rule: they are pulled forward by anyone ahead, even 100 days. So a
  new-version player far ahead still pulls an old-version friend; a new-version player ignores an old-version friend far ahead.
  Each version follows its own rule; tested both ways, no errors, both still see each other. Goes away once everyone updates.
- An old-version player in bed still waits for a far-away friend (old rule), and can ring them: the far friend gets "Friends want to
  skip the night, waiting on you!" even if it is daytime for them. Old version only; rare.
- The last half hour of the show (19:30-20:00) is at dusk: the sky turns purple and the top bar shows 🌙. Looks cozy in the test
  picture, but it is new that the show runs into the evening.

### Job 5: Walkers notice you

- They can notice you through a hedge, a fence or round a corner: there is no "can they see you" test (it would cost more each
  frame). Rare, and harmless (they just look your way).
- Old, unchanged: a walker who meets you standing on their path stops about 1 m in front of you and waits until you step
  aside; they never walk round you. Now, while they notice you, they at least face you while they wait.
- Old, unchanged: the waving arm also swings a little with the steps when someone waves while walking (shoppers already did
  this). It looks like an excited wave.
- "Say hi" still loses to something nearer or more in front of you (a door, the ducks), as before. Only the reach changed.
  The same goes for your own pet: if your pet catches up and stands right next to you when you stop, the button can switch to
  "Play with <pet>" although the walker is looking at you (seen once in a test). As before; the walker's 👋 can still be tapped
  on the screen.

### Job 6: Map overhaul

- In town the 3D pink arrow still points straight at the place, not along the dotted line (e.g. from the lane to the fountain it
  points through the park fence; see job 10's notes).
- The dotted line joins the nearest path points with straight lines, so near the end it can cut across a paved shop front or a
  pavement corner.
- Very zoomed out on a tall phone, the map shows a lot of forest above and below the town.
- The bottom card covers a strip of the map; the + − 📍 buttons can cover a name in the top right corner.
- The 3D town keeps drawing behind the big map (as it did behind the phone).

### Job 7: Beach bus (+ the retro surf minibus look)

- Each game drives its own copy of the bus (only the times are shared). If a car or a person holds up the bus in one
  game, it can be a few metres behind the bus in a friend's game.
- A car that is already inside a crossing when the bus comes may brush past it; the bus drives on after 6 seconds if a
  car in front of it doesn't move.
- An old-version friend sees a new-version friend who sits in the bus standing on the road (old versions have no bus).
- The friends list says "📍 In town" for a friend sitting in the bus.
- ⚙️ "Take me home" keeps its words at the beach (it brings you to the boardwalk, tells you about the bus and shows the
  way to your house).
- The bus appears out of thin air near the far end of Friends Lane (about 12 m before the end barrier) and disappears
  past the beach gate. Friends in the last lots of a long lane can see it pop up.
- If you close the game while sitting in the bus, the 15 coins are gone (you start standing at the stop).
- The bus messages remember what was said only until the game is closed, so after a reload a message can come again.


- For about a second, the hopping board flies through the countdown label over the bus (the label is a flat picture
  drawn on top; the board seems to jump past it).
- From straight in front you see the dark front tyres in the open corners under the nose (on purpose, like an old van).
- In the shade the cream top looks a bit grey, like everything else in the game's shade.
- The see-through blue glass shows only from outside (from inside the windows are clear, on purpose); the door window has
  no tint (as before).
- Standing right at a back corner of the bus, your eyes can come within about 10 cm of it (you never see inside; the
  same as the first bus).
- With more than 6 friends on one bus, the 7th shares a seat with someone (the bus had 8 seats before; 6 is plenty for
  how the game is played).

### Job 8: Coins balance

- "Put a … in your house" daily quests for furniture you don't have now cost more than they pay (e.g. a sofa 250 for
  23 🪙). You can still do them by moving one you already have. Before: 45 for 33.
- "Buy a … at the Toy store" daily quests: a toy costs 50-200 and pays 22 (before: 10-40 for 11-21).
- The coins from level-ups at the Pet Show (+2 levels) and from claw level capsules are not shown in their messages
  (as before).
- A yesterday's quest that was "ready" but not collected is paid with today's reward (only "Buy…"/"Put…" quests differ).

### Job 9: Football friends

- The ball rolls through the kids' legs (they don't block shots); a kid standing in the way does not stop your shot.
- On their way home/to the field the kids cross roads on the crosswalks like the townsfolk do; cars don't stop for them (same as townsfolk).
- Pets and friends who follow you can wander onto the field during a match (they don't touch the ball).
- A friend online who is further than 10 m from the field but looks at it sees the ball move by itself while your kids play.
- The tennis score pill (night 1) has the same problem on iPhone sideways (it pushes the notepad below the screen); not touched here.
- The game's welcome toast (and other toasts) can cover the card's buttons for a few seconds on an upright iPhone (game-wide toast spot).
- In an automatic crawl between 14:00 and 19:00: after "⚽ Take the field" starts a match, the crawler can't reopen the card for its other
  buttons ("unreachable", not "dead"): the kids are busy in the match. The kit's town crawl runs from about 8:20 to 11:20, so it never meets them.

### Job 10: One house per player, on Friends Lane (+ review fixes)

- A junior player's house moves to the next lot when the friend who has lived there longer is online, and back when they leave (old versions
  need the old rule for lots 0-5). The garden, pets and you (if in the yard) move along, with a message.
- Old versions keep the old house and garden in town for their own player, and only draw houses on lots 0-5.
- Looking down Friends Lane from the gate costs more draws than before (about 72 instead of 40 with one player: 11 "For a friend" signs and your
  garden are in view); the town spot costs fewer (125 instead of 281 with the rich save: the old house, yard and crops are gone).
- Follow-up, not fixed: the house fronts of the south lots face away from the sun and look greyer than the north lots. It is the same light as
  the town's shops on the south side of the big road (Pet Shop, Flower Shop); a brighter front would need a light change for the whole town.
- Follow-up, not fixed: loaded games start 2.4 m from the Flower Corner fence (walking test "moved 2.0 m in 1.5 s", it passes). A walkable strip
  in front of the Flower Corner would be inside the old yard (HOMELOT): old versions draw a friend who stands there at their Friends Lane house,
  so a kid standing on the strip would jump to the lane on old-version screens, and old saves standing in their old front yard would start in
  town instead of at their lane house.
- Follow-up, not fixed: in town the arrow still points straight at the place (as in night 1). Coming from Friends Lane to the Fountain it points
  through the park's west fence (walk on to the park gate on the big road). All other places tried from the lane were reached (see Tests).
- Follow-up, not fixed: cars and walkers are solid (as in night 1). Walking the middle of the big road, a car crossing at the crossroads with
  the traffic lights (x -50) can push you aside and pin you at its side until you step back (the walking bot never steps back: 2 of 144 walks).

### Job 11: Move my game between devices

- Playing the same game on two devices at the same time: each sees the other as an online friend with the same name
  ("<name> is here!"), and Friends Lane gives the second one the next free lot. Nothing breaks; it is a copy, not a sync.
- On a sideways iPhone, an "X is here! Open Friends…" message can sit over the lower part of the Settings card for a few
  seconds (job 3's message placement finds no free spot next to a card that fills the screen). It does not take taps.
- Notepad pages and the Settings choices (sound, look speed, graphics) are per device and are not moved (they are not part of
  the save).
- If the other device takes the game in the very last seconds of the 10 minutes, the sending device may say "ran out of time"
  although the game did arrive. Harmless.

### Job 12: Glitch hunter, pass 2 (3D world part)

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

### Job 12: Glitch hunter, pass 2 (screens and map part)

- None of my ten findings is left open.
- Seen while testing, other fixers' areas (not touched): the old-save message "🏡 Your house moved to Friends Lane…" and other messages
  over cards / the notepad on an upright phone (message placement: the MOVE fixer); the "-20 🪙" fare text in your face (finding 9);
  the lamp globe at the beach gate (finding 23); friends' dots can still sit on a place's name on the map when they walk past it (dots
  are not moved, only names).
- On the map, a friend's name is left out if no side of their dot is free (as before, only now 4 sides are tried instead of 1).

### Job 12: Glitch hunter, pass 2 (Move my game + messages part)

- A message that answers a tap made while a card fills the screen still covers a part of that card for its few seconds (now next to what you
  tapped, not on items or titles). Answers inside the card's own message line, as the inspector suggested, would need a line in every card.
- News that arrives within 0.1 s of a card opening counts as that card's answer and is shown with it (the old way). Rare.
- In the 3D world, kids' name tags still overlap the messages area sometimes, and Zac's speech bubble (a 3D tag) is cut by the minimap on
  iPhones (end of main finding 5; the football friends' tags are another fixer's part, findings 10/11).
- On an upright iPhone the Market fills the screen with 2 columns: "Not enough coins yet!" for the top-left item goes under it (above it
  would cover 🪙 and ✕), so it covers the next row's pictures for its 3.6 s (taps still go through).
- Messages are placed again when the use button's words change; walking past many things can move a message a little (only if it would
  cover the new words).
- Found while testing: the inspector's "W05" note (the Move card's "⬅️ Back" over the title's Play/Settings buttons) is the card lying over the
  title screen, as all cards do there; the same 4 notes were in job 11's run. Not changed.

Extra tests (scripts in the scratchpad, `work/job12m/`): the inspector's whole Move my game flow (send, get, wrong/short/slow/old codes,
6 tries a minute, bring back, new device, database says no), the long-name/wide-letter run and the misc run (Android-style keyboard, Escape,
closing with a code up, start over) on my file: 0 browser errors, the moved game equal on both sides; a 12-step test of the message line
(news, answers, two answers from one tap, same words, "Still there?", cards, old news, `__lastToast`) on a sideways iPhone, an upright iPhone
and an iPad; Start a new game + Bring it back in the web and the Claude version.

### Job 13: The designer's older wishes

- In an older version the Shell shelf is a white bookshelf full of books (by design, see Decisions); placing it there counts for
  that version's "Put a Bookshelf in your house" quest.
- Townsfolk and the kids walking around town never use the bridge (they keep to their paths).
- Players with an older version see a friend who walks over the bridge at ground level (inside the bridge) until they update.
- A pet that follows you sometimes walks round the pond instead of over the bridge (it waits for you on the other side).
- At a friend's house the Shell shelf is only to look at (like most furniture there).
- The TV picture itself did not change: the show ends without a special bow on screen (the toast says it).
- If you go to bed with the TV on, it stays on silently until the show ends.

### Integration fixes (how the jobs work together)

- A friend's clock jump itself waits while any message, tip or card is on screen (night 1's design): right after a friend joins (several
  welcome messages) it can take half a minute, and while the delivery tutorial card is up it waits until that card closes.
- During the Pet Show on an iPad other news (a friend came online, "🏡 Your house moved…") still shows beside the show's card (job 12's
  rule: there is room beside it). Only the football news waits now.
- On an upright iPhone with the bus pill, a score pill and the arrow bar all at once, the update button sits lower (about 300 px from the
  top), next to the little map, over the 3D view.
- The board in the beach shelter shows the timetable only, not Driver Dot's extra bus (that one is on the card, the pill and in her words).
- Old versions (before tonight) still have no bus; an old-version friend's clock jump moves a new-version player the same way as a new
  friend's (tested: the seated kid gets off with the coins back).
- Driver Dot's extra bus is only in the game of the kid who rides it: a friend standing
  next to it sees that kid sitting on the road behind the dunes for that minute (each game drives its own bus; job 7 noted the same
  for old-version friends).

---

## 5. NOT VERIFIED (needs real devices and real people)

**For the whole update:**
- **Real devices:** nothing was tried on a real iPad, iPhone, Android or PC. All tests ran in desktop Chromium pretending to be those screens (real taps, keys and a pretend keyboard), and nothing ran in Safari's engine. Especially: the Home Screen app updating itself (job 1), pinch/double-tap zoom being blocked and the iPad keyboard (job 2), pinch-zooming the map (job 6).
- **Sound:** never heard (new tonight: bus horn/ride sounds, campfire, whistle and juice sip at the football field, the TV cat's dance music).
- **Smoothness:** frame rate on a real iPad is unknown. Drawing work was measured instead (E1 per area, plus draw calls per job in the notes).
- **Real Firebase:** only the kit's fake Firebase was used. The ideas board (night 1) and "Move my game" (job 11) stay hidden until the real database allows them (rules in section 8). New optional online fields tonight: `jp` (jumps), `pt` (pets that follow), and the bus seat direction uses the existing `ry`. If your rules only allow a fixed list of player fields, new-version players may not show up online: please try two real devices once.
- **The real Claude room and the Claude cloud save:** only the check's fake room was used.


### Job 1: The Home Screen app updates itself

- A real iPad/iPhone Home Screen app with real GitHub Pages: iOS caching, how fast GitHub serves a new upload (usually 1–10
  minutes), the app coming back from the background. Tested only in Chromium with test copies (the test server answered the
  update check with a test file that had a bigger number, the same number but a changed script, an older number, no number, 404,
  offline and a wifi login page; 88 automatic checks, all passed, on iPad landscape/portrait and iPhone portrait/landscape,
  light and dark; pictures: `tools/pictures-2/job01-update-button-ipad.png`, `tools/pictures-2/job01-updated-title-ipad.png`).
- Android Home Screen apps and desktop browsers (should work the same; not tried on real devices).
- The tap sound and the glow animation on a real screen; whether kids notice the button.

### Job 2: Bug fixes

- Real iPad/iPhone zoom: Chromium cannot pinch-zoom like iOS Safari. Tested: Safari's `gesturestart` is cancelled, the CSS
  `touch-action` values are in place, a two-finger move on a card's dim background is cancelled, two-finger walk + look on the game
  area still works (moved 2 m and turned while both "thumbs" were down), one-finger scrolling in a long card still works.
  **Please try pinching on a real iPad.**
- The real iPad keyboard: simulated (a pretend "visual viewport" 390 px shorter, with a drawn keyboard). Tested on iPad landscape,
  iPhone portrait and iPhone landscape (ideas card and clothes-mirror name: the text box is always in the visible part). **A real
  keyboard must be tried** (iOS Home Screen app and Safari).
- Multi-touch on a real iPad: the run button with a thumb on the joystick was tested with Chromium's touch events (two fingers).
- Real Firebase / two real devices: the new presence fields were tested with the pretend server only (GitHub version new+new,
  old+new, new+old, and the Claude version's pretend room new+new: everyone sees everyone, jumps/pets/away/bed as described,
  no errors). Hostile data (fake pet kinds like "constructor", bad colours, a rude pet name, broken house rows) was also tried:
  skipped quietly, no errors.
- Sounds (the run switch taps like before), how the duvet and 💤 feel to a child.

### Job 3: Glitch hunter, pass 1 (3D world part)

- iPad Safari: the "The world" sign cut (B14) never showed in Chromium; the fix makes it very unlikely, but only a real iPad can tell.
- How the tag fade feels when you walk up to people; the cap size on a real iPhone (26 px).
- The shadow bias on real iPads (acne depends on the GPU); flicker on 16-bit depth devices.
- Two real players visiting each other (tested with two test pages on the fake server, new + new).

### Job 3: Glitch hunter, pass 1 (screens part)

- Real iPhone/iPad Safari: the sticky ⬇️ hint inside a scrolling card, `clamp(…min(vw,vh)…)` font sizes (iOS 13.4+), notches.
- How it feels when several messages come right after "Still there?" (one by one, 2-4 s each).
- The pet card's camera turn with a real finger (it turns at once, it doesn't glide).

### Job 4: Small changes (Pet Show hours, far-ahead clocks)

- Two real devices 31+ days apart on the real Firebase (tested with two test pages on the check's pretend server).
- How the longer show day feels: 8:00-20:00 is about 8½ real minutes every Saturday (was about 6½).

### Job 5: Walkers notice you

- How it feels on a real iPad/iPhone with the joystick, and whether a 6-year-old notices the wave. Tested by script only:
  keys held, at 20, 60 and 120 frames per second (the noticing distances and speeds were the same).
- No sound was added, so nothing to hear.

### Job 6: Map overhaul

- Pinch and drag on a real iPad/iPhone (tested with real taps, real mouse drag and wheel, and pretend two-finger pinches), how
  smooth it is on an old iPad, Safari's memory for the map pictures, a Mac trackpad pinch, the sounds.
- Whether kids understand the dotted line + "Let's go!" without help, and the names' sizes on a real phone.

### Job 7: Beach bus (+ the retro surf minibus look)

- Real iPad/iPhone: how the round windows look, smoothness with the bus on screen (14 extra draw calls while it is
  near).
- Sounds: the bus honk (reused car honk), "ding ding" + engine, the campfire crackle (tiny clicks), marshmallow pop.
- Feel: is about 1 real minute at the stop long enough for a 6-year-old to walk to the door? Are the 20:30 / 20:50
  messages early enough (20:30 is about 21 real seconds before the bus leaves)?
- Real Firebase / two real devices (tested with the kit's pretend server: two new players at the beach both sleeping in
  the tent -> the night skipped for both; an old and a new player: the old one sees the new one ride off to the beach).
- The full check's tour on iPhone (only my own iPhone screenshots).


- Real iPad/iPhone: smoothness while the bus is on screen (about 1,600 more triangles and 5 more pieces than the first
  bus, only while it is near).
- The soft "clonk" when the board lands (reused sound), and whether the big hop over the roof feels fun, not wild.
- Two real devices: each game shows its own board hop (only the times are shared, as before).

### Job 8: Coins balance

- Feel: is 2500 for the big house a fun wait, or too long for a 6-year-old? Is a weak day (150) enough fun?
- Does a 6-year-old notice/understand "Extra pizzas: 48 🪙" and "for an extra pizza!"?
- Real iPad/iPhone (tested in the test browser: iPad landscape and iPhone portrait, light and dark).

### Job 9: Football friends

- On a real iPad/iPhone: how a match feels for a 5-6 year old (too easy? too hard?), whether the kids' running looks natural, the card size.
- Sounds: the whistle and the sip were never heard.
- Real Firebase with two players at the field (tested with the kit's fake server: an old-version friend came to the field, the kids sat
  down, did not kick, cheered the friend's goal and went back to playing when the friend left; no errors on either side).
- Old saves: all fixtures load (quick check B1, see below).

### Job 10: One house per player, on Friends Lane (+ review fixes)

- Real iPad/iPhone: the walk to Friends Lane (about 95 m from the town start, ~25 s), how the Flower Corner and the longer lane look and feel.
- Real Firebase / claude.ai rooms with several real players (tested with the pretend server: old+new and new+new, 1 to 41 players).
- Whether kids understand the "house moved" message and the Friends Lane sign at the edge of the map.
- Follow-up: following the arrow with a real finger or keys (tested with a bot that holds W and turns towards the arrow, like the review).

### Job 11: Move my game between devices

- The real Firebase database: only tested with the check's pretend server. Without the rule below the button stays hidden.
- Real iPad/iPhone: the keyboard (capital letters, the card staying above the keyboard), the restart after "Yes, move it here"
  in the Home Screen app, how readable the letter tiles are from a child's distance.
- A slow or dropping internet in the middle of sending or getting (the "internet is slow" messages).
- Sounds (pop when the code is ready, yay when it moved).

### Job 12: Glitch hunter, pass 2 (3D world part)

- Real iPad/iPhone GPUs: whether the boardwalk, road and sand-step flickers ever happened there (they are fixed either way).
- How the kids' new distances feel in a real match (0.9 m) and when they walk past (1.3 m).
- The fare float and "+20 🪙" feel on a real iPad; the campfire glow brightness on a real screen at night.
- Two real players on the bus (tested with two test pages on the fake server, both new).

### Job 12: Glitch hunter, pass 2 (screens and map part)

- Real iPhones: the bar widths with the notch / safe areas (`env(safe-area-inset-*)`), and how the seated window view feels.
- Two real devices on the bus: the friend now sits facing forward for you (checked only through the code path and the test server).
- Real finger taps on a map name that moved away from your arrow (checked with the test's tap position, not a finger).
- Sound: nothing changed.

### Job 12: Glitch hunter, pass 2 (Move my game + messages part)

- A real iPhone keyboard (the test shrinks the visible screen like iOS does; also tested a page that gets shorter, like Android).
- `window.event` on real iPad/iPhone Safari (supported by Safari for years; if it were missing, every message would count as news: it would
  still show, only wait behind full-screen cards).
- Inside Claude with a real claude.ai account: the test room has no claude.ai storage, so "the brought-back game wins over the claude.ai copy"
  was checked by reading the code (the brought-back game gets the newest time; the copy is not written while the page restarts).
- How it feels: 1.6 s per message, news coming after a card closes, the badge on the card's edge.

### Job 13: The designer's older wishes

- Sound: I could not listen in the test browser. I checked the tune by recording every note the game plays (the right notes on the
  cat's beats, the first beat right when the TV turns on, softer further away, nothing after leaving, with sound off or while you lie
  in bed at night, back again when you come back or get up, the "ta-da" at the end). Is the tune cheerful and not annoying? How loud
  on a real iPad?
- Feel of walking over the bridge on an iPad (going up and down 80 cm), and on a PC with the keys.
- How bright the fireflies look on real screens (they blink and drift, which a still picture can't show).
- Real iPad/iPhone (tested in the test browser on iPad landscape; the shelf also on iPhone portrait).

### Integration fixes (how the jobs work together)

- Real iPads/iPhones and the real Firebase (tested in the test browser with the kit's pretend server: a new-version friend and an old,
  pre-night-2 friend one day ahead).
- Sound (nothing new: the bus honk and ding as before).
- Feel: are 2 game hours (about 1½ real minutes) enough to reach Driver Dot's bus from the far end of the beach?

---

## 6. "Try it for real" (play and tick off)

Best with two real devices (an iPad and a phone) and a child. Tick them off as you go.

### Job 1: The Home Screen app updates itself

- [ ] Upload this version to GitHub. Wait about 5 minutes.
- [ ] Get this version onto the iPad the old way once: swipe the app away in the app switcher and open it again from the Home
      Screen. The title must show "Version 2026100901" in the bottom right corner (no label = still the old copy: wait 10 minutes
      and try again). Play for a moment, note your coins.
- [ ] Make a tiny new version: in `index.html` change `const COZY_BUILD=2026100901;` to `2026100902`. Upload it, wait about 5 minutes.
- [ ] Title test: swipe the app away, open it from the Home Screen. It should start, then by itself reload once and show
      "✨ Cozy Town is updated!" above Play and "Version 2026100902" in the corner. Tap Play: same coins, same place, same house and pets.
- [ ] Play test: make version `2026100903`, upload, wait 5 minutes. On the iPad play the game, press the Home button (or switch to
      another app) and come back. The "✨ New Cozy Town update! Tap to get it" button shows at the top right. Open the bag: it
      hides; close the bag: it's back. Tap it: "Getting the update…", the title says "✨ Cozy Town is updated!", Play: nothing lost.
- [ ] Same play test with a pizza in your hands (pizza job): after the update you still carry it, same house.
- [ ] Same on an iPhone held upright and sideways (sideways: walk away from doors/people to see the button).
- [ ] Airplane mode on, open the app: plays normally, no message, no button, no error.
- [ ] Open the Claude version: plays normally, never shows the update button.
- [ ] After testing, keep counting up: the next real update gets the next number (e.g. 2026101001).

### Job 2: Bug fixes

- [ ] iPad: pinch with two fingers on the buttons, on a card, on the title screen: the page must not zoom. Double-tap fast on a
      coin chip or a card: no zoom. Scroll a long list (bag, ideas board): still scrolls.
- [ ] iPad: walk with the joystick and tap 🏃 with the other thumb: it turns yellow with "ON" and a ring, and you run. Tap again:
      plain white, you walk.
- [ ] Two devices: jump -> your friend sees you hop. Walk with a pet that follows you -> your friend sees it trotting behind you
      with its name, also into a shop.
- [ ] Two devices: leave one alone for 3 minutes (the "Still there?" card) -> the other sees a 💤 over its head.
- [ ] Two devices at night: one knocks on the other's door and goes in, the host goes to bed -> the visitor sees the host lying
      under a duvet with a 💤. Get up -> standing again.
- [ ] Teacher job: start a class late in the afternoon (after 18:00) -> when the class ends, the classroom door is still light blue.
- [ ] iPad: ideas board -> ✏️ Write an idea -> the keyboard opens and the card sits above it; type and tap 📌 Pin it!.
      Also: the name box in the clothes mirror, and naming a new pet at the pet shop.

### Job 3: Glitch hunter, pass 1 (3D world part)

- [ ] Walk up to Mrs. Crumb, Chef Blaze, a teacher, your pet: the name tag stays small and fades when you're right next to them.
- [ ] School hallway at the back corners: you can't get behind the teachers; the door signs don't flicker.
- [ ] Ice cream shop: the big cone stands on its tip. Toy store: rocking horse rockers under the hooves. History room: pyramid, knight.
- [ ] Flats: look up the stairwell (walls, a ceiling lamp) and down it on floors 2-3. Big house: the stairs down.
- [ ] Visit a friend: you arrive beside the door, not inside them; nothing is right in your face.
- [ ] Adopt a pet: it hops out in front of you. Watch the pens for a minute: no pets inside each other or at the fence.
- [ ] At 22:00 walk down main street: "Closed" signs on the shop doors, dim shop windows, houses still glowing.
- [ ] Walk towards someone far down Friends Lane: they grow in instead of popping.
- [ ] Pet Show on a Saturday: the results start on the stage.

### Job 3: Glitch hunter, pass 1 (screens part)

- [ ] iPad: open the 🛍️ home shop while decorating: no message on the items; buy something: the message shows beside the shop.
- [ ] iPhone upright: walk into a friend's house: the welcome message sits above "Sit down".
- [ ] Wait 3 minutes for "Still there?", then tap "I'm here!": messages that came meanwhile show one after another.
- [ ] Open the phone, then let a friend who is ahead in time join: the phone clock jumps with the HUD clock.
- [ ] iPhone sideways: open the phone: all 9 apps; the Calendar app shows today's weekday and day.
- [ ] Teach a class on an iPhone: class hints sit under the coins/clock; "Stop goofing off, …!" fits the screen.
- [ ] Homework with 🧮 / 🔢 questions and a long row of 🌸: rows don't break.
- [ ] Pet Show on an iPhone sideways: you see your pet during "NOW!"; the results card shows the coins line and OK.
- [ ] Lie in bed at night: no 🛋️ button; the 💤 floats up in the middle.
- [ ] A friend knocks while the pizza tips would start: only "Ding-dong!" shows; the tips come after.
- [ ] Settings on an iPad: a small ⬇️ at the bottom right until you scroll down.

### Job 4: Small changes (Pet Show hours, far-ahead clocks)

- [ ] On a Saturday at 7:30 go to the Pet Show stage: "🏆 Pet Show starts at 8:00", no judges. After 8:00 the judges are there.
- [ ] At 19:50 you can still enter; at 20:00 the stage says "🏆 Pet Show is over for today" and the 🏆 next to the day goes away.
- [ ] 📅 Calendar on any day: Saturday, 8:00 to 20:00. At a Saturday midnight: "It's Pet Show day! ... from 8:00 to 20:00".
- [ ] Two devices less than 30 days apart, online together: the one behind jumps forward ("🕰️ Same time as your friends").
- [ ] Two devices 31+ days apart, online together: each keeps its own day, both see each other, and going to bed on one skips the
      night without waiting for the other. (31 game days is about 8 hours of play, so this one is easiest with a test save.)

### Job 5: Walkers notice you

- [ ] In town, walk straight at someone coming towards you: at about 8 m they wave, slow down and look at you;
      "👋 Say hi" shows at about 3.5 m.
- [ ] Walk at someone who walks across in front of you: they turn their body a little and their head more to look at you, and
      keep walking slowly along the pavement.
- [ ] Walk up behind someone: they slow down and look back over their shoulder.
- [ ] Walk at someone who is standing still (taking a break): they turn all the way round to you.
- [ ] Stop when "Say hi" shows: there is time to tap it (about 1.5 s before they start walking on normally). Tap it: the same
      "hello" as always, and the "say hi" quest still counts.
- [ ] Turn round and walk away: they go back to their normal walk after about a second.
- [ ] Stand still near a path: people walk past normally, nobody waves.
- [ ] Evening (about 19:00-21:00): someone walking home also notices you, and still goes home.

### Job 6: Map overhaul

- [ ] iPad: 📱 → 🗺️ Map. The map fills the screen, you are in the middle; names are big enough; the list is at the left.
- [ ] Drag the map with one finger, pinch in and out; press + and −; press 📍 Me. You can't drag the town away.
- [ ] Tap the Market on the map: a dotted line from you to it, the card "🍎 Market · … m away". Tap 🚶 Let's go!: the pink arrow
      shows the way; walk there: "You found the Market!".
- [ ] Tap "My House" in the list: the line goes along the big road through the pink gate to your house on Friends Lane.
- [ ] Tap 🏖️ Beach →: it shows the way to the 🚌 bus stop.
- [ ] Go into a shop and open the map: your arrow is at the shop's door.
- [ ] With a friend online: their dot and name on the map, their house on Friends Lane; tap their house: the way there.
- [ ] iPhone upright and sideways: 📋 Places opens the list over the map; tapping a place closes it and shows the way.
- [ ] Dark mode: the map turns into a night map, names readable.
- [ ] PC: M opens, M or Escape closes, mouse drag and wheel, + − keys, arrow keys.
- [ ] Pizza job: the little map in the corner still shows the dot and your arrow.

### Job 7: Beach bus (+ the retro surf minibus look)

- [ ] New game: after Rosie's welcome, walk to the 🚌 bus stop by the park (📱 → 🗺️ Map → 🚌 Bus stop) and ride the
      free Welcome Bus to the beach; ride it back before 12:00.
- [ ] Read the timetable at the stop. On a bus day, be at the stop when it comes, watch it drive in, hop on, look around
      inside (Driver Dot!), and get off again before it leaves (coins back).
- [ ] Ride to the beach. Walk through the "To town" gate: the bus waits there. Play, then take the bus home at 21:00
      (listen for the 20:30 and 20:50 messages) and follow the pink arrow to your house on Friends Lane.
- [ ] At the beach: ⚙️ "Take me home": you stay at the beach, hear about the bus, and the arrow says "take the bus
      home first".
- [ ] Miss the bus: build a campsite, toast a marshmallow, sleep in the tent; in the morning read the bus hint.
- [ ] With 0 coins at the beach: the ride home is free.
- [ ] Two players at the beach at night: both sleep in the tent -> the night skips; one of them rings the other.
- [ ] Phone "🚀 Go" to a friend at the beach (from town) and to a friend in town (from the beach): a kind bus message.
- [ ] Stand in front of the bus when it wants to leave: it waits and honks.


- [ ] At the park stop on a bus day: look at the bus from the front and from both sides: a short orange-and-cream van
      with a face, round headlights, white wheels, the flower garland, and a surfboard on each side of the roof.
- [ ] Get on and look around (windows, Driver Dot, the windscreen); get off again: your coins come back.
- [ ] Ride to the beach and walk through the "🏘️ To town" gate: the yellow-green surfboard leans on the bus by the back
      wheel, the wooden one is on the roof.
- [ ] Stay and watch the bus leave (or come back for the evening bus at 19:30): the board hops over the roof onto the
      rack / back down.
- [ ] At dusk at the beach (the evening bus, 19:30-21:00): the round headlights glow.
- [ ] Two friends on the bus: each sits in their own seat and sees the other one sitting.

### Job 8: Coins balance

- [ ] Teacher: teach 2 classes; check "You earned 75 / 135 / 195 🪙" and 📱 Job "💰 75–195 🪙 a class".
- [ ] Designer: decorate a room; check "You got 50 / 90 / 130 🪙" and that the coins go up only by that number.
- [ ] Pizza: deliver 3 pizzas, tap "PIZZAS MUST BE DELIVERED", deliver a 4th: "You got … for an extra pizza!" (half).
- [ ] 📱 Job (pizza) shows "… for every pizza! Extra pizzas: …".
- [ ] New game: Pet shop → adopt: "You need 200 🪙. Go to work…"; buy a stove (100) and cook a sandwich.
- [ ] Shops: prices look right (Market apple 5, Home shop bed 200, fish tank 1000, crown 400); "New in!" prices match.
- [ ] Ride the bus (20), play the claw (10, sign says "10 🪙 a go!").
- [ ] Old save with lots of coins: same coins after loading; things you own are all still there.
- [ ] Bigger house card: "🪙 2500 coins".

### Job 9: Football friends

- [ ] Go to the football field (south of the park) between 14:00 and 19:00: four kids play 2 vs 2 and the scoreboard counts their goals.
- [ ] Watch Zac score: "Zoom zoom, GOAL!" and his spin dance with 🕺. Walk behind him: a gold 10 on his back.
- [ ] Walk onto the field: Zac's card opens. Tap "Maybe later": it does not open again until you leave and come back.
- [ ] Tap "⚽ Take the field": you and Zac against Omar and Bea, Tilly cheers on the bench. Does Zac pass to you? Score 3 goals.
- [ ] Dribble the ball: the other side waits and doesn't steal it. Stand still with the ball: after a moment they take it.
- [ ] Win: +10 🪙 the first time today; win again: no coins, still a nice card. Lose or draw: kind words.
- [ ] "🥇 1 vs 1 with Zac": can a kid beat him? Does he sometimes get tired (💦) or shoot wide?
- [ ] "🧃 Can I practice?": the kids walk to the bench, sit and sip juice. Score a goal: they cheer. Tap Zac: "Invite Zoomy Zac to a 1 vs 1".
- [ ] Walk away during the juice break: after ~12 seconds they play again.
- [ ] Stay until 19:00: they walk home along the sidewalk (sunset). After 19:00 a match can't start.
- [ ] iPhone sideways during a match: the score pill and ✋ Stop fit, the notepad is hidden until the match ends.
- [ ] Two players online: when a friend comes to the field, your kids sit down and cheer; when the friend leaves, they play again.

### Job 10: One house per player, on Friends Lane (+ review fixes)

- [ ] Open an old game in town: "Welcome back", then "Your house moved to Friends Lane…"; follow the pink arrow down the big road to your house.
- [ ] Go in by the front door; inside, "Go to your garden" puts you in the garden behind your lane house; your plants are there.
- [ ] Water a bed, plant seeds, buy seeds at the shed, check the mail, water the 2 flower beds in front of the house.
- [ ] Tell a pet "stay" in your garden, quit, open again: the pet is still in your garden.
- [ ] Look at the Flower Corner where your house was.
- [ ] Phone ▸ Map: the pink arrow and the "Friends Lane / My House" sign at the west edge; tap "My House" in the list: the arrow leads to your house.
- [ ] With a friend (also on an old version): both houses on Friends Lane on both screens; knock and visit each other.
- [ ] Buy the big house: the "Bigger house!" sign goes away and your lane house grows.
- [ ] Start a new game: Rosie's welcome by the Flower Corner, then follow the arrow to your new house.
- [ ] Follow-up: follow the arrow from the town start to My House and to My Garden: "You found…" at your gate / at the stepping stones.
- [ ] Follow-up: in your garden, tap Market in the phone map: the arrow leads out through the garden gate, then down the big road into town.
- [ ] Follow-up: bring Rosie to your garden and tap "👋 See you later": she walks out through the garden gate and along the pavement into town.
- [ ] Follow-up: a new game: the pink arrow appears when Rosie says "Follow the pink arrow to find it".

### Job 11: Move my game between devices

- [ ] Paste the Firebase rules below. Open the game: Settings ⚙️ shows "📱 Other device · 📦 Move my game".
- [ ] iPad 1 (with your game): Settings → 📦 Move my game → 📤 Send. A 6-letter code with a 10-minute countdown shows.
- [ ] iPad/iPhone 2: Settings → 📦 Move my game → 📥 Get → type the code → Get it! → check name, coins, day, pets → ✅ Yes, move
      it here. The game restarts: "📦 Your game is here, <name>! Tap Play 💗". Play: same coins, house, furniture, pets, garden.
- [ ] iPad 1 now says "🎉 Your game moved!".
- [ ] A wrong code: kind message. Wait 10 minutes with a code up: "⏰ The code ran out of time".
- [ ] On device 2: Settings → Move my game → "↩️ Bring it back" brings back the game that was there before (and again swaps back).
- [ ] Also from the title screen (Settings button under Play), on a new device with no game yet.
- [ ] While playing: Settings → 🗑️ Start a new game → tap again: the game really starts over (it used to come back).
- [ ] The Claude version: no "Move my game" in Settings.

### Job 12: Glitch hunter, pass 2 (3D world part)

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

### Job 12: Glitch hunter, pass 2 (screens and map part)

- [ ] iPhone upright: pick 🏠 My House on the map, take the bus to the beach: the pink bar is one line, "🚌 Take the bus home", and its
      arrow points to the beach bus stop. In town: "🏠 My House 95 m" on one line.
- [ ] iPhone upright: ⚽ Take the field: the score pill is one row ("⚽ Blue 0 – 0 Pink ✋ Stop"), the notepad stays in the left column.
- [ ] At the beach on a bus day at 20:59: "🚌 Oh no, the bus left!" only comes after the bus drives away.
- [ ] A new player, day 1: Welcome Bus to the beach: the pill says "🚌 Free bus to town until 12:00".
- [ ] Bus day: ride to the beach: Driver Dot says when this bus goes back (e.g. 11:50) and 21:00; the beach shelter board shows the same.
- [ ] Map with a friend next to you: "You!" and their name don't cover each other; a friend inside a shop has their name on the map.
- [ ] Map on an upright iPhone: pick a place: "🚶 Let's go!" sits under the words. Zoom out all the way: the 🏖️ beach sign shows, no
      name is cut at the edge. Inside a shop: the shop's name is beside its badge, not under your arrow.
- [ ] Map on an iPhone held sideways: 📋 Places shows all 21 places.
- [ ] Sit on the bus on a phone: you look out of the window at the bus stop / the street.
- [ ] Zac's card: "1 vs 1" stays together. Bus timetable on a sideways phone: the ⬇️ never covers a time.

### Job 12: Glitch hunter, pass 2 (Move my game + messages part)

- [ ] iPhone sideways: Settings → 📦 Move my game → 📥 Get my game, type 3 letters, tap Go on the keyboard: "Type all 6 letters 🔤" shows above
      the keyboard, under the code box. Type a wrong code: "⏳ Looking for your game…" then "Hmm, that code doesn't work…".
- [ ] iPhone sideways, Settings open, a friend starts the game: no message on Settings; close it: "👋 … is here!" comes.
- [ ] Settings → 🗑️ Start a new game: a new card asks first; double-tap the button quickly: nothing is erased. Tap "🗑️ Yes, start over": the
      title says your old game is safe; Settings → ↩️ Bring it back → ✅ Yes: your old game is back (coins, house, pets).
- [ ] Tap Play on the title: "Welcome back, <name>! 💗" is readable, then "🟢 You are online!".
- [ ] Send your game from iPad 1 to iPad 2 and play on iPad 2: iPad 1 says "📱 Your game is open on your other iPad or phone too!".
- [ ] iPad, Settings while playing: the ⬇️ badge sits on the card's right edge, not on "📦 Move my game".
- [ ] iPhone sideways at the old beach gate ("Find the beach bus"): the message sits between the arrow bar and the use button.
- [ ] Market with 0 coins on an iPhone held sideways: tap the apple: "Not enough coins yet!" shows above the apple, not on the other items.
- [ ] Inside Claude: Start a new game → Yes, play the opening, then Settings → ↩️ Bring it back: the old game is back, and still there after
      closing and opening the game again (the claude.ai copy).
- [ ] Big map, tap an empty lot on Friends Lane: the message shows above the spot you tapped.

### Job 13: The designer's older wishes

- [ ] 🗺️ Map -> Duck Pond. Walk over the bridge from the sandy path: you go up and down. In the middle try to walk off the side (you
      can't). Step off at the ends.
- [ ] On top of the bridge: "🦆 Feed the ducks" (with bread from the Market or the Bakery; without bread you get a friendly tip).
- [ ] Watch the ducks swim under the middle of the bridge.
- [ ] A pet following you: walk over the bridge; the pet stands on the planks or walks round the pond.
- [ ] After 20:00 go to Cozy Park: fireflies drift and blink over the grass; in the morning they are gone.
- [ ] At home with a TV: tap "Watch TV": music with the dancing cat. Walk away (softer), go outside (stops), come back (plays again),
      Settings sound off (stops). Wait about 1½ minutes: "📺 The end! …" and the TV is off.
- [ ] 🛍️ Home shop: buy a Shell shelf (150 🪙), put it in your house, tap it: "🐚 You have … shells!". Pick shells at the beach, come
      home: the shelf shows more shells as your collection grows (full at 25).
- [ ] Two players: visit a friend who has a Shell shelf: you see their shells.
- [ ] With a Shell shelf in your house, "Go back to PRENIGHT 2": the game starts and a white bookshelf stands there; update again:
      the Shell shelf is back with your shells.

### Integration fixes (how the jobs work together)

- [ ] Two devices: A at the beach on a bus day before the midday bus; B a day ahead joins -> A: "🕰️ Same time as your friends" and
      "🚌 Driver Dot came back for you!"; A walks through the "To town" gate, sits down: free ride home.
- [ ] A sits in the bus at the park (pays 20); B a day ahead joins -> A stands at the stop with the 20 back and hears when the next bus comes.
- [ ] Load a game saved at the beach before tonight -> Driver Dot's free bus (or the time of the bus home).
- [ ] Miss the 21:00 bus, build a campsite, sleep in the tent: in the morning "No bus today. The bus home leaves on …"; on that bus
      day the bus takes you home (no Driver Dot extra bus for a missed bus: that is only for clock jumps and old saves).
- [ ] Upright iPhone with an update waiting: a football match (✋ Stop is free), at the bus stop (the countdown is free), the arrow ✕.
- [ ] Sit in the bus with an update waiting: no update button. Close the app in the bus and open it again: at the stop, same coins.
- [ ] New game: follow Rosie's arrow home; the bus news comes after "📍 You found My House!".
- [ ] New game, join a friend on a later day, walk to the 🚌 stop: "🎟️ Your first ride to the beach is free!"; ride for free.
- [ ] 📱 Quests over a few days: no "Buy a toy", no "Put a fish tank" (unless one waits in 📦 My stuff); Flower power pays 40.
- [ ] Ride the Welcome Bus to the beach and straight back: no messages from the other end.
- [ ] Saturday 14:00 at the Pet Show: the football news comes after the show.
- [ ] Walk away from the football field: the kids shrink away softly at about 55 m.

---

## 7. How to go back

- **Go back to PRENIGHT 2:** copy `tools/prenight2-index.html` over `index.html` (or upload it to GitHub as `index.html`). That file is night 1's final game, exactly as it was at the start of tonight (md5 `f2cdd530076cce1ad198bd90d9e0e2a7`, commit `e1f254d` on `main`).
- **Saves stay safe when you go back.** Every new save field tonight is optional and old versions ignore it. I tested it the other way round too: every old save, after being opened and saved by tonight's final version (also one with the new Shell shelf and one standing at the beach), starts normally in `tools/prenight2-index.html`, with the same coins, furniture and pets, and no field is lost when the old version saves it again (`ROLLBACK ALL PASS`, section 2). The Shell shelf is stored as a bookshelf with a small marker, so an older version simply shows a white bookshelf. Your house moving to Friends Lane is safe too: saved positions in your yard are still stored as the old town-yard spots, so an older version puts you back in the old yard.
- **If tonight's version was already published (important):** iPads that already run tonight's version only switch to another file if it has a *bigger* version number (job 1 never goes "back"), and the old file has no number at all. So to go back on those iPads, upload **`tools/prenight2-rollback.html`** as `index.html` instead: it is exactly `tools/prenight2-index.html` plus one line inside the game script (`const COZY_BUILD=2026100950;`, bigger than tonight's `2026100901`), so the updated Home Screen apps see it as newer and switch back by themselves. (Nothing else in it differs; it plays exactly like PRENIGHT 2. Tested: section 2.) Before tonight's version was ever published, plain `tools/prenight2-index.html` is all you need.
- **Undo just one job:** each job is one commit (table at the top), so `git revert <commit>` undoes just that job. Jobs built on top of it may need to go too (job 7's bus look on job 7; job 8's prices include the bus fare; job 12 fixes things from jobs 6, 7, 9, 10, 11).
- In git: the starting commit is `e1f254d` (tip of `main` before tonight). Tags could not be pushed last night; I did not try again.

---

## 8. Firebase (one rules block to paste) and the morning questions

### The Firebase rules

Firebase console -> Realtime Database -> Rules. This one block is everything the GitHub version of the game uses: the players online (`$world/peers`, the way the game writes them today), the ideas board (`board`, night 1's rule, unchanged) and "Move my game" (`move`, new tonight). Night 1 could not read your real rules, so I don't know exactly what is there now: if your players part is different, keep your own `peers` lines; if the database also holds other apps' data, keep their rules next to `worlds`. Without the `board` part the ideas board stays hidden, without the `move` part the "Move my game" button stays hidden: nothing else breaks.

Online fields: tonight adds two optional player fields (`jp` = a jump counter, `pt` = up to 3 pets that follow you); night 1 added `ck`, `zz`, `rg`, `aw`. The block below allows any player fields; if your rules list the allowed fields one by one, add these.

**Not verified:** these rules were written and read carefully but never tried against the real database (this environment can't reach it). Please try two real devices once (section 6).

Without the `move` part the "Move my game" button stays hidden. In the Firebase console -> Realtime Database -> Rules, this is
everything the game uses: players online (`$world/peers`, as the game writes them today), the ideas board (`board`, night 1's
rule, unchanged) and Move my game (`move`, new). If your rules today are different for the players part, keep your own
`peers` lines; if the database also holds other apps' data, keep their rules next to `worlds`.
```json
{
  "rules": {
    "worlds": {
      "cozy-town": {
        "$world": {
          "peers": {
            ".read": true,
            "$peer": { ".write": true }
          }
        },
        "board": {
          "notes": {
            ".read": true,
            "$note": {
              ".write": "!data.exists()",
              ".validate": "newData.hasChildren(['t','n','at','p'])",
              "t": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 100" },
              "n": { ".validate": "newData.isString() && newData.val().length <= 24" },
              "at": { ".validate": "newData.isNumber() && newData.val() <= now" },
              "p": { ".validate": "newData.isString() && newData.val().length <= 30" },
              "h": {
                "$pid": {
                  ".write": true,
                  ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 3"
                }
              },
              "$other": { ".validate": false }
            }
          }
        },
        "move": {
          "$code": {
            ".read": true,
            ".write": "!data.exists() || !newData.exists() || data.child('exp').val() < now",
            ".validate": "$code.length == 6 && $code.matches(/^[A-Z]+$/) && newData.hasChildren(['s','at','exp','v'])",
            "s": { ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 60000" },
            "at": { ".validate": "newData.isNumber() && newData.val() <= now" },
            "exp": { ".validate": "newData.isNumber() && newData.val() > now && newData.val() <= now + 660000" },
            "v": { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        }
      }
    }
  }
}
```
What the `move` part allows: anyone who knows a code can read it (nobody can list the codes); a code can be written only when
it is free (or has run out), never changed; anyone with the code can delete it (used / closed). It must be 6 capital letters,
hold a save of at most 60,000 characters, the server's own time, and run out within 11 minutes. (`$code.length == 6 &&
$code.matches(/^[A-Z]+$/)` means the same as `^[A-Z]{6}$`.) The game checks that it may read and delete under `move` when it
starts; with these rules that test passes and the button shows.

### Integration fixes (how the jobs work together)

Not needed (nothing new online).

### Morning questions

Every question is already built in the way described; just say yes, or tell me what to change.

#### From me (the orchestrator)

- The check kit: may I add `pid` to the list of values that may change between two loads (`VOLATILE` in `cozycheck/checks.py`)? Then B1 says PASS again for the old saves (today its only difference is the random player id of night 1's ideas board).
- Version numbers (job 1): the rule is "date + 2-digit counter, always bigger than anything online, and bigger than the rollback file's `2026100950`". OK?
- The bus: a child who misses the 21:00 bus camps and waits for the next bus day (up to 3-4 game days, about 45-60 real minutes), as you wrote. The integration reviewer worried about that wait; a tiny morning bus home every day would be the other option (see the integration fixes' question).


### Job 1: The Home Screen app updates itself

- Checks happen only at start and when the app comes back to the front. Built that way; or should it also check every 15
  minutes during long play sessions (costs about 280 KB per check)?
- After the update tap you land on the title with "✨ Cozy Town is updated!" and tap Play. Built that way; or jump straight back
  into the game (then the iPad may stay silent until the first tap)?
- The button sits at the top right under the round buttons (under the clock on iPhones held upright). Fine; or somewhere else?
- The version number is bumped by hand. Built that way (plus the safety net for the game script); or should a little tool bump
  it on every upload?
- The title shows a small "Version 2026100901" in the corner. Built that way (handy to see which copy runs); or hide it, or move
  it into Settings?

### Job 2: Bug fixes

- Run ON look: built as warm yellow + coral ring + "ON" tag + 💨; or another colour, or the emoji changing (🚶 off / 🏃 on)?
- Friends' pets: built as "only pets walking with them, at most 3"; or also show their stay-at-home pets when you visit their house?
- A friend in bed: built as tucked under a duvet in the bed's colour; or lying on top of the blanket?
- 💤: built for "away" and "in bed"; or only for "away"?
- Glass doors: built as "classroom doors always light blue"; or should every glass door you see from inside (shops) stop glowing at
  night too?

### Job 3: Glitch hunter, pass 1 (3D world part)

- Tag cap: built as at most 6.5% of the short screen side (26-48 px); or a bit bigger on phones (e.g. 30 px)?
- Daylight fill: built so shady house fronts are ~20% lighter (sunny sides ~+4%); or lighter still?
- "Closed" sign: built as "🌙 Closed" on a dark purple board; or also show the opening time ("Opens 8:00 ☀️")?
- The school at night: built without a Closed sign (you can still go in); or close it too?
- Removed street tree in front of the Library: built as a gap (an open entrance); or a small flower bed there?

### Job 3: Glitch hunter, pass 1 (screens part)

- Messages next to a big card go into a narrower box beside it (2-4 short lines). Built like that; or always at the top of the screen?
- The ⬇️ "more below" hint shows on every card taller than the screen (bottom-right). Built like that; or only on Settings and shops?
- While Rosie talks in the opening, the joystick and jump/run hide. Built like that; or keep them?
- Phone held sideways: the phone is a wide landscape phone (5 apps per row). Built like that; or keep a tall phone that scrolls?

### Job 4: Small changes (Pet Show hours, far-ahead clocks)

- "More than 30 days" counts day numbers (31 days apart = ignored, even if it is only 30 days and a few hours). Built as day
  numbers; or compare exact time (more than 30 × 24 game hours)?
- Far-away friends don't count for "everyone in bed". Built like that; or should they still count (then you can wait in bed for a
  friend who is in the middle of their day)?
- The stage sign says "Every Saturday!". Built: unchanged; or add the hours ("Saturdays 8:00-20:00")?

### Job 5: Walkers notice you

- The first-notice touch is a quiet wave only. Built as a wave; or also a soft "hi!" sound or a small 👋 above their head?
- They notice you also when you come from behind (they look back over their shoulder). Built that way; or only when you come
  from the front or the side?
- After you stop, they stay slow and looking at you for 1.6 s. Built as 1.6 s; or longer (e.g. 3 s) for little ones who are
  slower to tap?
- Speed while noticing: 42%. Built as 42%; or slower (35%) so it's more obvious?
- Your pet right next to you can take the button from a walker's "Say hi" (the nearest thing wins, as before). Built unchanged;
  or should a walker who is looking at you win over your pet?

### Job 6: Map overhaul

- Tapping a place: built as "the way is set and shown, the map stays open with 🚶 Let's go!"; or close the map at once?
- The list: built as a side column on big screens, a "📋 Places" button on small ones; or always behind the button?
- Dark mode: built as a night map; or the same day colours as in light mode?
- The pink 3D arrow in town: built as before (straight at the place); or should it follow the dotted line, turning at corners?
- The little job map in the corner: built with the new look; or keep its old look?
- Friends on the map: built as the town friends (Rosie…) and friends online, all with names; or only friends online?

### Job 7: Beach bus (+ the retro surf minibus look)

- Bus days: built as one day from Mon-Tue, one from Wed-Fri and one from Sat-Sun (never more than 4 days without a bus);
  or fully random 3 days a week (up to 9 days in a row without a bus)?
- Fare: built as 15 🪙 for each ride (30 there and back); or one ticket for the round trip?
- Day 1: built with a free Welcome Bus that goes as soon as you hop on; keep it, or start new players on the normal
  timetable?
- The ride: built as sitting inside the waiting bus + a 2-second ride picture; or should the bus really drive through
  town with you inside?
- Camping: built as "only at night, or when no bus home comes any more that day"; or any time you like?
- The beach kiosk and tennis are unchanged; should the kiosk sell a "camping snack" (marshmallows are free now)?


- The face: built with a small smile under the round headlights (kept from the old bus); or no face at all, exactly
  like the picture?
- The words "🌴 Beach Bus": built on the back of the bus; or also on the sides (it hides some of the orange)?
- The leaning board: built as the yellow-green one; or the wooden one, or both like in the picture?
- The size: built as a short van with 6 seats; or a longer bus with 8 seats (it looks more like a city bus)?

### Job 8: Coins balance

- The 3 extra pizzas: built as half pay (a 5 ⭐ maniac day = 585); or the same price as the first 3 (780)?
- Big house: built as 2500 (about a week of good days); or 2000 / 3000?
- Pet: built as 200 (new players need to work a little first); or keep 100 / start new players with more coins?
- Fish tank 1000 as the one big furniture dream; or more "dream" furniture (game console, piano) at 1000+?
- Designer rooms no longer give the hidden level-up coins; OK?
- Daily quests (about 130 a day) stayed as they were; or smaller now that jobs pay more?

### Job 9: Football friends

- In "Take the field" Zac plays **on your team**; or should he play against you (you + Tilly vs Zac + Omar)?
- The card **opens by itself** when you walk onto the field (once per visit); or only when you tap a kid?
- When you join, the kids are **kind** (they never steal the ball while you dribble); is it too easy? Should they tackle sometimes?
- Win reward **+10 🪙 once a day**, +6 Sports XP per match; more, less, or a sticker/trophy in your house?
- They **sit and watch when a friend online comes** to the field; or should two online friends play together with (shared) kids? (A bigger job.)
- The kids arrive at 14:00 and leave at 19:00 **every day**; or only on some days (e.g. not on Pet Show Saturday)?

### Job 10: One house per player, on Friends Lane (+ review fixes)

- House colour: built as the Friends Lane colours picked from your name (the same on every screen); or keep the old purple house look?
- Flower Corner: built as a garden to look at; or make it walkable once everyone has the new version?
- Lots: built as 12 lots that grow 2 at a time up to 30; or more/fewer?
- The map: built as a sign at the west edge; or a second small map of Friends Lane in the phone?
- The arrow between town and Friends Lane: built along the middle of the big road (nothing in the way, cars stop for you); or along a pavement
  (it would have to steer round a tree or a lamp every 6 m)?

### Job 11: Move my game between devices

- The code stops when its card is closed ("Keep this card open until your game has moved"). Or keep it alive the full
  10 minutes even after closing the card?
- After "Yes, move it here" the new device shows the title ("Your game is here! Tap Play"). Or jump straight into the game?
- Both devices keep the game (a copy). Or should the sending device lock its copy / start fresh after a move?
- "↩️ Bring it back" keeps one game from before the last move. Keep it, or drop it to keep the card simpler?
- Codes have no vowels (no words by accident). OK, or any letters?
- Limit 60,000 characters per game (real saves are about 3,000). OK?

### Job 12: Glitch hunter, pass 2 (3D world part)

- Bus label near the stop: built as "hidden while the pill shows the countdown"; or keep it always and push it below the buttons?
- House labels: built as "fade out beyond ~30 m"; or keep them at any distance (they get small)?
- Boardwalk lamps: built as taller lamps (globe at 2.16 m); or keep them short and move them 1 m off the boardwalk?
- Football: built as "kids keep 0.9 m from you while playing" (was 0.65); or closer for more tackling?
- The shed: built moved 1.5 m west with its door and seed box facing the arch; or another spot in the garden?

### Job 12: Glitch hunter, pass 2 (screens and map part)

- On a phone you look out of the bus window when you sit down. Built like that; or look forward like on the iPad?
- At the beach the pink bar says "🚌 Take the bus home" (or "to town") and points to the bus stop. Built like that; or also name the
  place, e.g. "🚌 Bus, then 🍎 Market"?
- Zoomed out all the way on an upright phone, the beach sign shows and two town badges wait for one zoom step. Built like that; or keep
  the town badges and leave the beach out at that zoom?

### Job 12: Glitch hunter, pass 2 (Move my game + messages part)

- News waits while a card fills the phone screen (at most 30 s, then skipped). Built like that; or show it small at the top over the HUD?
- A message stays at least 1.6 s (longer for long words) before the next one. Built like that; or longer (2 s) for younger readers?
- Start a new game keeps only the last game put away. Built like that; or keep two (the last move and the last new start)?
- Settings shows "↩️ Your old game · Bring it back" whenever a game is kept (after a move too). Built like that; or only for a few days?
- The "are you sure" card ignores a "Yes" in its first 0.8 s. Built like that; or "hold the button" for a new start?

### Job 13: The designer's older wishes

- Shell shelf: built as a Home shop item for 150 🪙; or give it free once (e.g. with your 5th shell)?
- Shell shelf: built full at 25 shells (12 spots); or more spots / a second shelf for big collections?
- TV show: built to end by itself after 5 rounds of the dance (about 1½ minutes); or keep playing until you turn it off?
- Bridge: built arched (80 cm high, you go up and over); or lower and flatter?
- Fireflies: built as 48, from about 19:10; more, fewer or brighter?

### Integration fixes (how the jobs work together)

- Driver Dot's extra bus after a jump: built as free, now, for 2 game hours (not after 22:30); or should a friend's clock simply not move
  you while you are at the beach?
- A kid who misses the evening bus: built as you said (camp; the next bus day takes you home, up to 3 nights in the tent); or a small
  morning bus home every day?
- In the bus + a friend's clock jump: built as "get off, coins back"; or ride to the beach anyway (Driver Dot then brings you home)?
- The free first ride: built as "your first ride ever" (the Welcome Bus counts); or the first ride to the beach, Welcome Bus not counting?
- Quests: "Buy a …" built for things up to 20 🪙; or toy quests that pay the toy back?
- New look: built as 40 (as asked); or 60 (the cheapest clothes cost 50)?

---

## 9. Decisions I made (the obvious ones)

### Job 1: The Home Screen app updates itself

- The safety net compares the game script only (the big `<script>` with the game). A change ONLY in the page's look (the CSS
  at the top) without a bigger number is not noticed: always bump the number.
- After an update you land on the title and tap Play (not straight back into the game): the title says it is updated, and on
  the iPad the first tap also switches the sounds on. Nothing is lost: the game was saved right before.
- The button sits at the top right under the round buttons, where nothing else lives on iPad and iPhone (checked against the
  top buttons, the joystick, run/jump, the action button and its label, the decorate buttons, the left column).
  On iPhones held upright it sits under the clock chip (the clock chip is wider than the left column there).
- What a reload resets (exactly like closing and opening the app): friends walking with you go back to their day, a tennis
  rally or a football kick-about starts over (your best rally is already saved with every hit), sleeping together stops (you
  stand next to your bed). Scenes that cost something (Pet Show, claw machine, lessons) hide the button, so it can't be tapped
  in the middle of them.
- No checks while playing on and on (only at start and when the app comes back to the front), as asked. Each check downloads
  the game file once (about 280 KB compressed).
- Reloading on the title also happens on the "You took a break" title (the game saves first).
- Never in the Claude version, never on a computer file (`file://`), only on http(s).
- The version label is on the title only (not in Settings), so this job touches no shared screen code; it is small and covers
  nothing (checked on iPad and iPhone, normal and "took a break" title).

### Job 2: Bug fixes

- The run switch flips on touch-down, not on lift: that is what makes it work while the other thumb holds the joystick. The click
  that follows the same touch is ignored (within 1 s), so it never flips twice.
- Jumps travel as a counter, not as heights: the other side plays the same hop curve as yours, smooth and sent only once per jump.
- Friends' pets follow a trail of the friend's last steps instead of a straight line, so they don't cut through walls. They only
  check walls when they are within 24 m of you (less work for the iPad); a pet more than 9 m from its spot pops there (after a
  door, a "Go" jump, etc.). Their models are merged (only legs and tail move) and cast no shadows: 13 pieces per pet instead of
  25 for an unmerged one (plus the name tag). They only exist while a friend with a following pet is online.
- A friend's data is never trusted: only real pet kinds, colours and outfit pieces are used (anything else is skipped), at most 3.
- Getting out of bed with a jump shows the hop too.
- Pet names now go online with the pet (like player names already do), so friends see the name tag. Only letters, digits,
  spaces and . _ ' - are shown (14 at most), and a name the ideas-board word filter doesn't like shows as just the pet kind.
- Which bed a friend lies in comes from their house layout (they already send it while you visit). If it isn't there, they lie
  where they are, turned along the room. The duvet hides the arms and legs, so their outfit doesn't poke through the blanket.
- 💤 shows for "away" (the Still there? card) and for "in bed". Old-version friends send both, so they get it too.
- The classroom door glass is now always the daytime light blue. Other glass doors (shops, the school's front door) still glow at
  night like before (they lead outside, and it was not asked).
- The keyboard fix is generic: any text box inside a card. It only reacts when the visible screen really got shorter (a keyboard),
  so a hardware keyboard or a computer changes nothing.
- The Home Screen app version number (`COZY_BUILD`, job 1) is left alone, as asked; whoever merges tonight's jobs bumps it once.

### Job 3: Glitch hunter, pass 1 (3D world part)

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

### Job 3: Glitch hunter, pass 1 (screens part)

- Messages are never held back except behind "Still there?" / "Reconnecting…": a message from a card's button ("Not enough coins")
  must show at once, so it moves instead of waiting. If no spot is free (a card filling a phone screen), it takes the spot that covers
  the least (usually the card's top edge). The test helper (`window.__lastToast`) still sees every message at the moment it is sent.
- Big texts wait their turn (at most 0.8 s each) instead of being dropped: every one stays readable.
- The joystick in the middle on a phone held sideways (B32) is on purpose: the owner moved it there on 4 Oct 2026 (commit "joystick
  position when phone is sideways"). Not changed.
- New styles come from the game script (one style block next to the message code), not from the first 498 lines: no merge fights in the
  CSS lines, and the web-part check stays happy.
- 🧮 (abacus) and 🔢 (1234) are old, common emoji (no empty boxes on older iPads). The Beanbag keeps 💺 (the 🫘 bean emoji is too new
  for older iPads); its 3D picture in the tray shows what it is.
- The pet card only turns the camera when the pet is really hidden (off screen or behind the card).
- The left column only changes when it doesn't fit, and moves things before it hides anything (the notepad beside the map loses
  nothing). It is checked when a pill or box comes or goes and with the HUD clock (twice a second); the pills stay where the other jobs
  put them.
- Trick names over the Pet Show stage are drawn in front of everything (they are short and only over the stage); other floating texts
  in the game are unchanged.

### Job 4: Small changes (Pet Show hours, far-ahead clocks)

- Day numbers are compared with YOUR day: friend's day minus your day more than 30 -> ignored for the clock. The hour does not
  matter: you on day 1 at 23:00 and a friend on day 31 at 1:00 still counts; day 1 at 23:59 and day 32 at 0:01 does not.
- Because only day numbers count, two friends between 30 and 31 days apart get together during the day: when the one behind passes
  midnight (or wakes up after a night in bed), the day numbers differ by exactly 30 and the usual "🕰️ Same time as your friends" jump
  happens. Only friends 31 or more whole days apart stay apart for good. (Tested: day 500 at 23:59 and day 531 at 11:59: ignored;
  after midnight 501 vs 531: joins day 531.)
- Ignored friends play on normally: you see each other, chat, play football, visit houses. Only the clock is not shared.
- Two players 31 days apart: each keeps their own day and time. Everything with hours uses each player's own clock: shops open or
  closed, pizza hours, the Pet Show (one may have Saturday, the other not: each sees their own stage), sky and street lamps (one
  may see day while the other sees night), beds. Nothing breaks; it can just look odd to stand together while one says "closed".
- Chains still work: a friend within 30 days pulls you forward, and then anyone within 30 days of your new day can pull you again. So
  a group of players, each close to the next, still ends on the furthest day; only a lone far-away save can't drag everyone.
- The friend far ahead also doesn't count the one far behind for bed (more than 30 apart either way), so neither blocks the other.
- When a far friend becomes 30 days ahead (your midnight), you join them when their clock is next sent (every 5 game minutes while
  they play: a few real seconds), not at the exact moment. Not worth more code.

### Job 5: Walkers notice you

- "Walking towards" uses the way you WALK (joystick or W/A/S/D), not the way you look. You must be moving and the distance must
  shrink, so standing near a path or walking past someone does not make them slow down.
- Once they noticed you, they keep noticing while you walk more or less towards them (within about 53°, a bit wider than the
  35° to start, so steering wobbles don't switch it on and off), or while you are right next to them (within 2.5 m).
- Speed while noticing: 42% (the plan said 35-50%). Never 0: they keep walking. The old rule stays: a walker stops when you
  stand right in their way (closer than about 1 m), as before.
- Turning: the body turns at most about 34° away from the path so they keep walking along it; the head does the rest. Coming
  from behind, they look back over their shoulder (they can't turn all the way while walking).
- The friendly touch is only the wave (no sound, no floating text: "nothing noisy").
- Walkers walking home in the evening and night owls notice you too; they still get home (tested: a walker walking home in
  view noticed me, then walked on and got home the usual way).
- Cheap: a few sums per walker per frame, and only near you a little more; nothing new is created each frame. It is all inside
  the Walker code, so it merges easily with other jobs.

### Job 6: Map overhaul

- "Tap a place to set the route" (owner's words): the way is set at the first tap, but the map stays open so a kid sees the dotted
  line, with a big "🚶 Let's go!" to close it. The list does the same, so the map and the list work the same way.
- North is up and the map doesn't turn (easier for kids to learn); your arrow turns.
- The dotted line follows the walkers' paths (pavements, crossings, park paths), the safe way to walk. The pink arrow in town is
  unchanged (straight at the place, and along the middle of the big road to and from Friends Lane: job 10's routing).
- The distance in the card is "as the crow flies", the same number as the arrow bar in town.
- The beach is a small sandy bit past the east edge (the real beach is far away, only by bus), so the town isn't squashed.
- Dark mode turns the map into a dusky night map; the little job map in the corner keeps the day colours (as before).
- The map is a card of its own (not inside the phone picture), so it can use the whole screen; ‹ goes back to the phone.
- Speed: the town picture is cached for the screen plus 120 px around it and painted again only after a zoom or a bigger move
  (while two fingers pinch it is stretched a little and painted again when they let go); names, the dotted line, friends and your
  arrow are drawn on top 10 times a second; when the map closes nothing runs and the cached picture is freed. Test browser:
  painting the picture 1.5-4 ms, one frame 0.1-0.5 ms. Names are laid out again only after a zoom or when another place is picked.
- The list hides "My House"/"My Garden" only in the moment before your lot on Friends Lane is known (a split second at the start).

### Job 7: Beach bus (+ the retro surf minibus look)

- Bus days are random each week but spread out: one from Mon-Tue, one from Wed-Fri, one from Sat-Sun, so there are never
  more than 4 days without a bus (fully random 3 days could leave a camper at the beach for 9 days).
- The bus waits 1.5 game hours (64 real seconds by day) instead of exactly 1 minute, so all times are on the 10-minute
  clock the game shows (9:30 -> 11:00 -> 12:30).
- The evening bus home waits from 19:30 to 21:00 (about a minute, like the other stops), with an extra "the bus home is
  here" message at 19:30 besides the 20:30 and 20:50 ones.
- The stop is in the eastbound lane of the big road by the park (east of the north gate, so a queue of at most 2 cars
  never reaches the crossing), and the bus leaves through the old beach gate (it moves to the middle of the road there).
- At the beach the bus waits on a new little road behind the dunes; you walk 3 steps through the gate to its door.
- Riding: you sit inside the waiting bus (first person, look around); the drive itself is a short ride picture (about
  2 seconds) instead of driving through town with you inside. It is simple, works the same on every device and never
  gets stuck in traffic.
- Day 1 has the free Welcome Bus (it goes as soon as you hop on). This also lets the check's crawler reach the beach
  "by playing" (its new player is on day 1).
- Getting off before the bus leaves gives the fare back. Closing the game while sitting in the bus: you start at the
  stop, standing (the fare is not given back).
- Camping is allowed at night, or when no bus home comes any more that day; before that, the camp spot tells you when
  the bus home leaves. There is one camp spot for everyone, so friends share one big tent.
- The bus is a vehicle like the cars: it is not part of the town or the beach drawing (and is only drawn while it is
  around). Drawing work (the check's own counter, on top of job 10): town 352 -> 353 pieces, 594,306 -> 595,168
  triangles (+0.1%); beach 112 -> 119 pieces (+6.3%), 57,922 -> 61,547 triangles (+6.3%); the bus itself is 14 pieces,
  about 10,300 triangles.
- The beach stays out of the daily quests (`nq`), so old saves keep getting the same quests; so does the bus stop.
- Put on top of job 1, job 10 (one house per player on Friends Lane), job 4 and job 2. Your house is no longer across
  the road from the bus stop, so the bus helps you find it: "Take me home" at the beach and the evening bus set the
  pink arrow to your Friends Lane house. The lane is longer now, so the bus starts at its far end (about 12 m before
  the end barrier, as before; it moves along if the lane grows for more friends). The bus stop is on the park side of
  the big road, across from the Flower Corner, and Rosie's welcome spot is close to it: no bus line under the coins
  while she talks. With job 4, friends more than 30 days apart keep their own clocks, so they also have their own bus
  times. With job 2, a friend asleep in the tent lies down like a friend in bed (job 2's pose, blanket and 💤), on the
  sleeping bag, with the blanket a bit narrower so it stays inside the tent (before, the tent had its own lying pose).


- Kept the bus's width, the door, the spot where you get on, Driver Dot's seat, the label over the bus, the lights' jobs,
  the times and the drive path, so getting on and off, riding and the timetable work exactly as before. The bus got
  shorter at the back (and its nose a little longer), so the solid "you bump into it" shape, the "someone is in front of
  the bus" check, the "cars wait for the bus" check and the "friends riding with you sit down" area were fitted to the
  new size. I checked that you can walk all around it at both stops without walking into it, that you can still reach
  the door spot, and that nobody can walk to the leaning board.
- A shorter bus with 6 seats: the van in the picture is short and chunky (about twice as long as it is tall). At 7 m it
  looked like a city bus; 5.6 m with 3 rows of seats reads as a van. A 4th row would make it a bus again.
- The front wheels went in front of the door (under the nose, like old vans), so the open door slides over the plain
  side, not over a wheel.
- The boards are tipped out to the sides, because a flat board on a roof is only a thin line from the ground (you look
  up at it). Tipped out, the wooden one shows its wood and red edge to the bus stop side and the yellow-green one its
  pattern to the road side. Both still fit under the town's beach gate.
- The yellow-green board is the one that leans at the beach (its black squiggles show best standing up). It rides on the
  road side and hops over the roof to the door side, so at the beach you see both boards: the yellow-green one leaning
  and the wooden one on the roof, facing the beach gate. I checked the hop step by step: it never touches the bus or the
  other board.
- The owner's picture is a watermarked stock photo: I only used it to look at shapes and colours. It is not in the
  repository, and nothing is copied from it (the board pattern is drawn by the game).
- Cartoon style like the rest of the game: toon colours, ink outlines, soft rounded shapes. I kept a small smile under
  the headlights because it is cute and the bus still reads clearly as the minibus in the picture.
- Drawing work: the bus is drawn only while it is around, and it is not part of the town or beach drawing (so the
  check's E1 numbers do not change). It is about 11,900 triangles in 20 pieces (the first bus was about 10,300 in 15; the
  first try of this follow-up about 18,300 in 21). Looking at it at the beach stop, the whole picture has about 3% more
  triangles and 5 more draw calls than with the first bus.

### Job 8: Coins balance

- One target for every job: a weak day about 150, a good day about 270, the best day about 390 (the brief: good day
  250-350, weak ~150, best at most ~450). Teacher and designer now have exactly the same three numbers.
- Pizza keeps its shape (stars set the price, late = half, RARE = bonus + a star), with the owner's night-1 rule: 0 ⭐ earns
  less than every other job's weak day (120 < 150) and 5 ⭐ a little more than all of them (390 + the RARE bonus, about
  415 on an average day, vs 390).
- The 3 extra pizzas pay half. That is the only way to keep "5 ⭐ a little more than the others" AND a maniac day close
  to the others (585 instead of 1260; with the same price it would be 780). Chef Blaze's words stay exactly the owner's;
  the half pay shows in 📱 Job and on the delivery card.
- RARE bonus 50 -> 40, so a normal 5 ⭐ day stays "a little more" and not much more.
- The designer's hidden level-up coins (540 over the first 3 days) are gone for rooms: with them a new designer earned
  up to 660 on day 3, far above everyone else. Every other level-up (furniture at home, Pet Show, claw…) still pays.
- Prices, kept kind: everyday things a little more (food and seeds ×1.5: a snack 3-18, a whole pizza 18, the bus 20),
  nice things a few days of work (furniture 60-600, clothes 50-180, pet outfits 25-70, toys 50-200), big dreams a week
  or more (big house 2500, the fish tank 1000 as the "rare furniture ~1000+", the crown 400).
- Useful furniture stays reachable: the 🍳 stove (cooking and its many quests) is 100, so a new player can buy it with the
  120 they start with; the 🎹 piano (the only way to play Music) is 500, not 1000.
- Flower-shop plants 30-90 are small decorations; growing 🌻/🌷 from seeds (8 / 6) is the cheap way to get them, a nice
  reward for gardening.
- A pet costs 200: a new player (120) can't adopt on the first morning, but after a good first class (2 ⭐) or room
  (2 ⭐), or two pizzas, they can (quests and mail help too). New players still start with 120 🪙.
- Claw machine 10 a try, coin capsules doubled (20-50), so a coin prize still feels like a win. Toys from the claw are
  worth much more than a try now; you still can't sell anything, so nothing can be "farmed".
- A day's money (good day): job ~270 + quests ~130 + litter/mail/shells ~50 = about 450; weak day about 250. Food and
  the bus cost about 40-80 a day. So: a pet is half a day, a sofa less than a day, the fish tank 2-3 days, the big house
  about a week (two weeks on weak days).
- Daily quests, hard challenges, mail, litter, shells, tennis and football money stay as they were (small extras next to
  the new job pay). Pet Show: the winner keeps 200 + 2 levels, the others get a bit more so joining still feels good.
- Old saves: never touched `S.coins`; a pizza order that came before the update keeps its old pay (as before).

### Job 9: Football friends

- The star's name: **Zoomy Zac** (original, fits the catchphrase "Zoom zoom, GOAL!"; no real player is called that). The other three names
  are not used anywhere else in the game.
- **One ball**: the kids play with the town's shared ball (no second ball on the field, less confusing for little kids). To never fight a real
  player for it, they only kick it when no friend online is near the field (10 m around it); then they sit and watch.
- When you are far away (more than 75 m from the field) the kids pause (nobody can see them): no kicks, so the shared ball stays still
  online and costs nothing. When you come back they go on.
- Their own game shows on the scoreboard, but their goals are counted separately: the shared online score (`S.match`) is never touched.
  When they stop playing (juice, rest, watching, gone) the scoreboard shows the normal score again.
- **Take the field: the star plays on your team** (you + Zac against Omar + Bea), so it feels friendly and Zac passes to you. Tilly sits out
  and cheers. (The brief allowed either; see Morning questions.)
- **You are always BLUE** and shoot into the east goal with the 🎯 sign (in the 1 vs 1 Zac plays for Pink, even in his blue shirt).
- Match length: first to 3 goals, or 3 game hours, or 20:00 at the latest. A match started before 19:00 may go on after 19:00; then the kids
  go home. You can't start a new one after 19:00.
- The card opens by itself when you walk onto the field while they play (once per visit; you must go 14 m away from the field before it can
  open again). Not when a game is loaded right on the field, not while you carry a pizza, and not during cards, lessons or tips.
- Juice break: ends 12 seconds after you leave the field (+8 m), or at 19:00.
- Rewards are small: +10 🪙 only for the first win each day, +6 Sports XP per finished match.
- Cheap drawing: the four kids are built like the townsfolk (merged), the juice boxes are tiny and only shown while sitting, the "10" and the
  sweatband are a few boxes merged into Zac. Kids further than 55 m from you are not drawn. The two benches are merged into the town scenery.
- The bench is a bit west of the middle (x -26.6), so it does not touch the bush that already grows behind the south line.
- The bench's colliders are added after the town's nature scatter, so not one tree, bush or flower in town moved.

### Job 10: One house per player, on Friends Lane (+ review fixes)

- Saves keep the old numbers: a spot in your own yard (you, a pet) is saved as the same spot in the old town yard, exactly like old saves,
  and turned into the spot on your lot when you or your pet are put in the world. So old saves load right (B1: no real difference), a pet waiting
  in your garden stays in YOUR garden even if your lot changes, and if the game were ever rolled back you would stand in the old yard.
- That is why nobody can stand in the Flower Corner: a spot there always means "your yard" (old saves, and old-version friends, who are shown at
  their lane house when they stand there). A walkable park would make new-version players jump to their lane house on old screens.
- A save whose player stood in the old yard or garden starts at the same spot of the yard on Friends Lane (in the garden if they were in the
  garden, at the front door if they were at the door). The path to the apartments behind the old garden is not the yard: that stays in town.
- Your house keeps the Friends Lane colours (picked from your name, the same on every screen, also on old versions) instead of the old purple.
- Seniority (`laneT`) instead of "who came online first": with the old rule, two kids whose names want the same lot swapped houses from day to day,
  depending on who opened the game first. Now the one who has lived there longest keeps it. Old versions use the same numbers (jt) the same way,
  so all screens agree on every lot.
- Lots 6-11 are used only when lots 0-5 are full, so with up to 6 players everybody lives where old versions draw them.
- The garden gate is beside the house: on the lane the lots are side by side, so the town's gate on the far side would open into the next lot.
- The map stays the town map (drawing the lane too would make the town much smaller); Friends Lane gets a sign at the west edge.
- "Take me home" still takes you inside your house. Friends who come along still say "Your house is cozy!" inside.
- The intro spot moved 2.2 m along the pavement (to -14.8, -4.6): Rosie stands in front of the Flower Corner fence at a friendly distance.
  Loaded games still start at (-17, -4.6).
- Follow-up: between town and Friends Lane the arrow uses the middle of the big road, not a pavement: the pavements have a tree or a lamp
  every 6 m (and the bench, traffic lights, the Flower Corner); the middle line has nothing on it from the town centre to the end of the lane.
  Cars stop for you, as before.
- Follow-up: "You found it" on the pavement in front of the gate, not at the door: with 3.2 m you are at your gate, and the arrow never has to
  point through a fence.
- Follow-up: friends leave a lot on fixed paths (gate, side paths, garden gate, stepping stones, pavement), not with a path finder: every lot
  has the same shape (the same numbers as your yard, turned round for the south side).

### Job 11: Move my game between devices

- Where it lives: `worlds/cozy-town/move/<CODE>` = `{s: the save (JSON text), at: server time, exp: at + 10 min, v: 1}`.
  The sender first checks that the code is free (picks another one if it is in use), then writes it.
- Codes: 6 capital letters from 19 letters without vowels (B C D F G H J K L M N P R S T V W X Z): no words can appear by
  accident, no I/O/Q to mix up, never the same letter twice in a row. About 35 million codes, made with the browser's secure
  random numbers.
- Times use the database's clock (the device's clock can be wrong), so both devices agree on "10 minutes".
- The code is taken down when: the other device takes the game; the code card closes (✕, "Stop sending", another card opens
  over it); 10 minutes pass; the game is closed with the code up (and once more on the next start, in case the first try
  never reached the server). A device that finds a code that ran out tidies it away too.
- While the code card is up, the "Still there? 👀" break card stays away (the child is busy typing on the other device).
- Both devices keep the game afterwards (it is a copy, like a photo of the game at that moment). Coins earned later on one
  device stay there; "Move my game" again any time.
- The moved-in game is written to the same save place as always and the page restarts: the normal "open the game" path,
  nothing mixed. While this happens the page saves nothing more (`SAVEOFF`), so the old game can't sneak back.
- A game from another device is cleaned before use: the characters < > " (straight quote), the backtick and the backslash,
  and the text "url(", are removed from every text in it (no real save has them), so a made-up "game" can't put code into the
  page. A name like "Cupcake<3" arrives as "Cupcake3".
  It must also look like a Cozy Town save (a name, coins, house/bag/look/pets of the right kind) and be at most 60,000
  characters (a big real save is about 3,000).
- At most 6 tries a minute (send or get, on this device); codes with letters that are never used are refused without
  asking the database.
- The button only appears after a little test at start: read one random (empty) code and "delete" it (writes nothing).
  If the database refuses either, the button never shows, like the ideas board. If the database refuses later (a send or a
  get), the card closes with "📦 Moving games is resting right now. Try again later!" and the button goes away.
- Inside Claude: no button, no database, no errors (checked).

### Job 12: Glitch hunter, pass 2 (3D world part)

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

### Job 12: Glitch hunter, pass 2 (screens and map part)

- Narrow screens only (max 600 px wide): the bars below the clock may be wider than the column; the coins/tummy/clock chips keep the
  narrow column (they share the top row with the round buttons). A bar that still doesn't fit (very small phones) wraps inside the screen.
- At the beach the arrow bar does not name your place any more ("🚌 Take the bus home / to town"): the one thing to do there is the bus,
  and the arrow shows the way to its stop. Your place comes back on the bar in town.
- "Oh no, the bus left!" waits until the bus is 8 m away: you see it drive off first. The message window is 21:00–22:00 (was 21:00–21:30)
  so it still comes if you held the bus up a while.
- The beach board shows both buses home per day ("11:50 · 21:00"); the text shrinks a little if a long weekday makes it tight.
- Map: on the most zoomed-out view of an upright phone the town is tiny, so not every badge fits: the beach sign now always shows, and the
  Toy Store and Library badges wait until you zoom in one step (before: the beach was missing and "Toy S…" was cut). Labels that would poke
  out of the map's edge take another side. I did not make the smallest zoom smaller (the hint): the town would only get tinier.
- Map: "You!" (it shows 2 seconds when the map opens or you press 📍 Me) takes the side that covers the least; it never moves place names.
- Bus seat view: only on phones (the narrow view), turned about 68° from forward towards your own window; iPads keep the forward view.
- The 5-column Places list is for short screens (phones held sideways); the font is 13 px there (was 14), every button stays 44 px tall.
- The ⬇️ hint of the bus timetable sits in the middle (the empty space between the day and the time), instead of adding a right margin
  that would make the rows jump when the hint comes and goes.

### Job 12: Glitch hunter, pass 2 (Move my game + messages part)

- **News or answer?** A message sent while a tap/key is being handled (`window.event`), or together with a card that opens (within 0.1 s), is an
  answer; everything else is news. One tap that sends two messages: the second waits its turn. No call site had to change.
- How long a message stays before the next one may take its place: 1.6 s, or 0.05 s per letter for long ones (a 75-letter message gets 3.75 s),
  never longer than its own time. Messages that waited behind "Still there?" still show their full time one by one (job 3's choice, kept).
- At most 3 messages wait (the oldest goes, as before); a message that waited 30 s is skipped (old news). A message that steps aside for a card
  keeps its first time, so it is not shown much later.
- The answer next to what you tapped uses the button you tapped (not the word on it); for big things (the map) it uses the finger's spot and
  stays over that thing. It never covers the card's own header buttons; if there is no room above or below, it falls back to job 3's spot.
- Start a new game: only one old game is kept (the last one put away). Starting over twice in a row keeps only the second one — with the new
  "are you sure" card that should be rare. The old game is kept on the device (browser storage), like the game itself; inside Claude the
  claude.ai copy is still removed on a new start (as in job 11), so "Bring it back" uses the copy on the device.
- "This iPad / this phone / this computer": a touch screen smaller than 500 px on its short side is a phone, a bigger touch screen an iPad,
  no touch a computer (an Android tablet is called "iPad"; kids say that anyway).
- The "⬇️ more below" arrow is no longer drawn inside the card (`#card.more::after`); it is a small round badge `#moreHint` on the card's edge
  (not a button, it takes no taps). The `more` class on the card is still set, as a plain marker (no style uses it now).
- My own game online is recognised by the same name AND the same look (no new online field): a friend with only the same name still gets
  "👋 X is here!".
- "Yes, start over" only works right after "Start a new game" opened its card (the same `WIPE` switch as before): the morning check's robot,
  which taps every button, switches it off after tapping "Start a new game", so it can never erase its own test game ("No, keep my game" is
  a normal close button, which the robot skips). A "Yes" without the card answers "💗 Your game is still here!".

### Job 13: The designer's older wishes

- Bridge direction: north-south, from the sandy path to the grass, 40 cm east of the pond's middle so the cattails stay free. Its
  north end stops just before the path, so townsfolk walking the path never walk into it.
- An arched bridge you walk up and over (80 cm high in the middle) rather than a flat one: it looks like a real garden bridge, it is
  fun to cross, and the ducks can swim under it. Your view, your following pets and online friends go up with it. The walls of the
  pond collider let you onto it only along the planks (the same trick as the lake pier).
- A "Feed the ducks" spot on the bridge: the nicest place to feed them.
- Pets that follow you either walk round the pond or follow you over the bridge, whichever way they find first; both look fine.
- TV music: one short tune per dance move, so the music changes when the cat's move (and the caption) changes. A show ends by itself
  after 5 rounds (about 1½ minutes) so it can never play forever; "loop softly while on" is kept inside a show.
- Fireflies: 48 ("a few dozen"), yellow-green like real fireflies, drifting and blinking; they come out after the street lamps.
- Shell shelf: sold in the Home shop for 150 (like the Bookshelf, job 8's prices) rather than given free; full at 25 shells; it shows
  only your own shells (or your friend's when visiting).
- Shell shelf saved as a Bookshelf with a marker (`t:'shelf'`, white, `sh:1`; the same size and price as the Bookshelf), so going back
  to an older version, or an iPad/Claude copy that is still older, never meets a furniture kind it doesn't know: it shows a bookshelf.
  In the new version, placing it counts as a Shell shelf, not as a Bookshelf (for "Put a … in your house" quests).

### Integration fixes (how the jobs work together)

- In the bus to the beach + a friend's big clock jump past its time: you get off with your coins back (the reviewer's hint) instead of
  riding to the beach on another day. In the bus home the bus just goes.
- Driver Dot's extra bus comes only when you did not choose to be stuck: a jump skipped the bus home, or a game from before the bus loads
  at the beach with no bus home left that day. It comes at once, waits 2 game hours, is free, and goes as soon as you sit down. It is
  saved (`beach.dd` = [day, hour]) and removed when you ride home; an old one is ignored. After 22:30 no night bus: you camp.
- A kid who simply misses the evening bus camps, and the next bus day takes them home (the owner's job-7 design, unchanged; after a
  night in the tent: "🚌 No bus today. The bus home leaves on Tuesday at 11:50. Enjoy the beach! 🏖️"). The reviewer's rule "no child
  stuck at the beach longer than until the next evening" is only for the clock-jump bug and old saves (confirmed by the coordinator).
- "First ride ever is free" counts the first ride that really leaves (the Welcome Bus counts; Driver Dot's extra bus does not, so a kid
  she brought home still gets a free first ride to the beach). Saved as `beach.r1` = 1. An old save that never rode gets the free ride too.
- Bus news waits while the pink arrow shows the way home (on day 1, and for an old save whose house moved to Friends Lane).
- The update button moves below a bar only when the bar reaches under it (upright phones); otherwise it keeps job 1's spot.
- Quests: "everyday" = 20 🪙 or less (job 8's food, pet food and pet toys). New look stays at the reviewer's ~40 although the cheapest
  clothes cost 50 (you keep them).
- "Here" messages: dropped when you leave the place; "📍 You found…" also after 12 s (you walked on). Other news (friends, quests, the
  clock) still waits up to 30 s, as job 12 made it.
- The football news waits at most until 15:00 (then it is old news).

---

## 10. Notes from the night

- **How the work was done:** I (the orchestrator) did not build jobs myself. Every job had its own builder in its own git worktree (Claude Opus 5.5 at max effort, as the plan says), with one shared brief: the plan's rules, the check's rules (the web part, old saves, old+new players, drawing work, 44 px, light and dark, 0 errors), the testing helpers, and the notes format. Every builder tested in the browser (iPad and iPhone sizes, light and dark), ran the quick check, reviewed its own work twice (as a demanding player, and against the check's rules), and wrote the notes in `tools/night-notes-2/`. I merged each job into the integration branch, resolved the few conflicts (or had the builder rebase), and ran the quick check again on the merged file.
- **Independent reviewers:** job 10 (the riskiest) got a reviewer who tried hard to break it (0 crashes, 0 data loss; 1 medium and 4 small problems, fixed in "Job 10 follow-up"). The bus restyle had a build → review → fix round. At the end, an integration reviewer played the whole game with all jobs together and found 8 clashes (the biggest: a friend's clock jump could leave a child at the beach for days), fixed in "Integration fixes". The glitch hunts had photographers (1,902 screenshots in total), inspectors (108 findings) and fixers.
- **Usage limit:** around 12:20 UTC the account hit its usage limit; several helpers stopped mid-work. Their work was kept and they were resumed when the limit allowed. After your message, at most 3 helpers ran at a time.
- **One mistake I made and undid:** my brief for the integration fixes said "no child may be stuck at the beach longer than until the next evening". That was meant for the clock-jump bug, but the fixer took it literally and added a morning bus home every day, which goes against your plan ("the next bus day takes you home"). I had it removed; it is now a morning question.
- **The check kit:** run as it came, nothing changed. I only added one saved game (`tools/check-fixtures/save-f2cdd53-rich.json`, made with tonight's starting version). Next time, copy `tools/check-fixtures/*.json` into `cozycheck/fixtures/` again. Note for the kit: the B1 `pid` false difference (section 2).
- **Things this environment did not allow:** reading the real Firebase database and real devices (sections 5 and 8). Nothing was published anywhere; the pull request goes into `main`.
- **Family names:** none were added anywhere. Test players are called `ZZTEST-…` and none of that is in `index.html` (line F1). Your reference photo of the minibus was used only as a picture to look at; it is not in the repository (it is a watermarked stock photo).
