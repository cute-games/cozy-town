### Run 4 finish (20 Oct 2026): the open items of tools/run4-wip/README.md, done alone

The owner's words: "Finish run 4 … do every open item in it, alone. First the full final check on the live game. Clock: show "9:40 Wed" (one
hour digit), as the 17 Oct list says. Same rules as NIGHT-PLAN-4.md. End with a pull request. Never stop to ask."
Branch `claude/run-4-finish`, from `main` with the unfinished work of `claude/run-4-wip` (0138269). Every game change below is a patch script
in `tools/run4-wip/scripts/` (patch_f1.py … ), applied with exact-match edits and a syntax check of every script block.

**The clock (the owner's decision of 20 Oct)** (f1, a844bc9): old: "09:40 Wed", "Sleeping until 07:00", "from 08:00 to 20:00" (stage 3 had
padded the hour) → new: "9:40 Wed", "Sleeping until 7:00", "from 8:00 to 20:00" (clockStr and every text stage 3 touched). The bus times and the
"${DAY_ON}:00" texts were never padded.

**C5 on the live game** (f2, 10ae96a): old: the dance-off's four arrow buttons had 20 px corners (since job 17) → new: 18 px like every white
button. Stage 2's C5 rerun counted only the crawl's screens and never saw them; the full check of 20 Oct on the live file was the first.

**Pass 8 (S3-N), the full GLITCH HUNTER pass on the file with the clock and button fixes** (it replaces pass 7's nine batches that never ran):
the kit's own pictures (night3 + run4 on that file: every line PASS), the photographer's three scripts (456 + 32 + 4 pictures; the duck close-up
added for the new faces), 17 viewer batches, 8 double-checkers: 118 marks, 92 KEEP, 26 DROP. Each kept mark, its cause and what was done:
`tools/run4-wip/data/stage3/pass8-fixplan.md`; the glitch list entries G4-168 on.

**f3 (27 edits), from pass 8's kept marks:**
- Quests: old "Buy a fairy wings at the Pet shop" → new "Buy a pair of fairy wings at the Pet Shop" (a pair of wings, glasses, ears or headphones;
  some fries, noodles or dumplings); the shop names in quests, cards and the friends list are the names on the buildings (Pet Shop, Flower Shop,
  Toy Store, Ice Cream Shop, Clothes Shop).
- Café, Bakery and Ice Cream chalkboards: old a fifth row sat on the bottom frame → new the rows are spaced to the board (48 px type from 5 rows).
- Designer job wish card: old "Sunny living room · r…" → new the title on its line, "room 1 of 2" on a line of its own.
- Hairstylist tutorial: old the bottom captions sat at x 250 and 230 of 420 → new centred.
- What's new book: old an emoji alone on a line, "dance-" / "off", 🕺 / 💃 split, page 5 ending in a ❓ → new a non-breaking space before a
  line's last emoji, "dance-off" and 🕺💃 never split, "Job tutorials are pictures now: tap ❓ on a job card to see one!".
- Night sky: old stars and the moon shone between rain streaks → new they fade out with the grey sky in rain, snow and cloudy weather.
- October ghosts: old one circled 1.2 m from the park fountain's middle (inside its bowls) → new 4 m from it.
- 1 September: old the school banner ran behind the name board on its posts → new a shorter banner from the left balloons to the board.

**f4 (4 edits), the grandmas:** old a long line was one pill running off the screen → new over 22 letters it wraps onto two lines (capped at
two lines' height); old two grandmas on the pond bench could talk at once after a jump of the clock → new one starting to talk ends the
bubble of any grandma within 3 m; old a grandma walking through the camera filled a third of the screen → new she is not drawn for that moment.

**f5 (37 edits), the rest of pass 8's kept marks, each from its cause** (probes before and after each: the ducks, the rug, the tags, the
garden plate, the hair card on iPad and a sideways iPhone, the disco ball, the short-screen cards, the tutorial, the friends after a turn,
the two-phone dance-off, the designer's room, the light on ten views before and after):
- Pet Shop upstairs: old the ducks stood on their water on orange legs (the whole pen is water) → new they swim, low in it, no waddle.
- An upper floor's starter rug: old 4 cm high, a placed rug lay half under it → new flat (1 cm) under any rug you place.
- Pets' name tags: old only the friends' tags stepped apart (indoors "Moch", only an "M") → new your pets' tags step apart with them.
- Garden: old the 🔒 Level plate hung above its stake (the size cap shrank it round its middle) → new it is held at its bottom edge.
- Hair salon: old the hair card covered the customer in the chair → new when the card opens the view turns to the customer, who shows above
  it (on a phone on its side the card fills the screen's height: nothing can show above it there).
- Dance-off: old the "✨ Perfect +15" ran into the score bar (upright phone) and its ✨ covered the left dancer's face (sideways phone, read as
  "the guest's dancer faces away"; both dancers face the view: rotation 0 = asked 0) → new under the bar; at the bottom left on a sideways phone.
- Disco ball: old a pale 3 cm arm and 1 cm string that did not show (the ball floated beside its pole) → new a thicker arm with an outline
  and a dark string.
- A card at the bottom of a short screen: old it ran under the round top buttons, the jump button poked out beside it → new the HUD pieces it
  reaches over wait out of sight under it, as under a big card.
- Job tutorials on a short screen: old the card covered the top row while it showed (the food chip cut in half, the clock hidden) → new with
  nothing to point at, the row waits under it; a message with no free spot beside a tutorial waits until it closes.
- The clock chip: old refreshed twice a second, so right after a jump of the clock it showed the old hour or weather ("11:30" at 12:30, the sun
  under an evening sky, a cloud under a blue sky) → new refreshed at once after a jump of the clock or a change of weather.
- Photo shoot: old the wave swung into the next person's hair; "Pick up the litter" and its big button sat in the photo frame → new a higher
  wave; while a shoot is on only its own buttons show.
- 1 September: old two balloon bunches stood in front of the school hall's 🌈 and 🚀 posters → new by the lockers.
- Messages: old above a big card on a tablet the message lay on the chat and phone buttons → new the top row counts fully while it is in
  sight (the message waits).
- Clothes maker: old a 34 px ⬇️ "more below" → new 46 px like every other.
- Decorating: old the aim ring was a 118 × 70 px ellipse hanging in the room (the big-button class gave it a button's padding: the designer's
  "white ring over the sofa") → new a 28 px ring again.
- The "+20 🪙" pop: old on the new client's message → new it keeps clear of the message card.
- Shop cards: old a two-line name pushed its price down, the cut row's prices greyed by the 58 px fade → new prices on one line in a row;
  a 40 px fade on short screens.
- People at the camera: old a passer-by within 1–1.2 m or a grandma within 0.6 m filled the picture with a back or a cardigan → new not drawn
  within 1.3 m for that moment (a grandma sitting by you on a bench stays).
- Friends round you: old on a narrow pavement the fourth friend stood straight behind another, only a name tag showing → new a nearer spot at
  the side first, and spots 1.22 m apart (the check asks 1.2; it was 1.3): all four faces show (the kit's N3 passes: 1.28 m and 1.25 m).
- Light outdoors: old a face turned away from the sun still took cast shadows, and the baked pieces (most walls) never had the shade fix of
  item 17 → new no cast shadow on such faces outdoors, and the baked pieces have the fix: the house's back in the garden is its own colour in
  the shade (it was a dull grey), the apartment block at 12:30 is one tone (it had a lit strip and a soft seam), no pale streaks at 17:30 or on
  the Tree Park's crowns. Indoors nothing changes (shown before and after on ten views).

Not glitches (pass 8 marks the double-checkers kept, with the reason): M-073 to M-078, "a toy and a hand in mid-air beside a lamp pole":
the toy is the game's play feedback (an emoji that rises over the pet and fades); the hand is a townsperson's arm behind the pole at the kit's
N11 spot. M-091, "small pastel eggs, no golden-banded egg in a nest": those are the Flower Corner's spring decorations, by design ("so no
decorative egg looks like one"); the check had picked up the hunt eggs near the bunny (18/25).

The photographer's scripts for pass 9 (the marks that were the framing, not the game): the pond ducks are photographed after you feed them
(they swim up; from a fixed spot they were small at the far rim behind the cattails); the school hall from nearer its door; your pets a step
behind you indoors and at the October gate; an upright phone's room views a little lower (a ceiling lamp filled the top); the delivery
message with the chef's card closed first; the two players on the open square (the PC view was boxed in by a tree and the Ideas Board).

**Pass 9, the full pass on the file with f3 to f5 and the two new book pictures**: the kit's own pictures (night3 + run4: every line PASS),
the photographer's three scripts, 15 viewer batches: 112 marks; 57 set aside with their reason (`dcfilter9.py`: decided earlier, the check's
or the photographer's staging; pass 8's dropped ⬇️ hint over a tile gap), 55 double-checked (8 double-checkers), 37 kept. Each kept mark and
what was done: glitch list entries G4-212 to G4-226, `tools/run4-wip/data/stage3-dc9/`.

**f6 (27 edits), from pass 9's kept marks and the last critic round's clear points** (probes before and after each):
- Calendar: old a Saturday's ⭐ and 🏆 sat to the left of its tile → new centred under the day. Old the today tile always ☀️ or 🌙 (under a
  grey sky too) → new the clock chip's sky (skyIc()). The chip's weekday: old 600 weight at 80 % → new bold and dark.
- The clock chip and the phone: old refreshed twice a second, so the first moment after the shown time stepped on ten minutes still said
  the old time → new refreshed the moment it steps on.
- Pet Shop card: old "Buy one and something new pops up!" 12 px at 70 % → new 14 px, bolder.
- Old an emoji alone on the last line (the furniture page's 🎨, the delivery pill's 🍕) → new a no-break space before it.
- Hair salon: old "Ava sits down!" lay across her face as the view turned to her (G4-194's turn), and under the check's fast clock "Ben comes
  in!" did too → new when the card opens at once its tab names who sat down, so the big words pop only when it cannot; as the view turns to
  a face, big words on the screen or still waiting go (popDrop()). Old on a sideways phone the hair card cut the job pill ("Ben is in your
  ch") → new under a bottom card on a short screen the pill waits out of sight like the other HUD pieces it would touch.
- Flower shop: old from the door the middle basket's rod came out of the ceiling lamp's bulb → new it hangs 1.5 m to the right.
- 1 September, the school hall: old f5 had put the back balloons by the lockers, out of sight from the door → new between the posters and
  the side doors, the 🌈 and 🚀 posters 65 cm nearer the middle door.
- Ducks: old two fed ducks swam to the same spot and stayed bill to bill, facing each other → new each to a spot of its own (a metre
  apart), and once there they turn to you; old eyes 2.6 cm with a 0.9 cm shine (no eyes seen from the bank) → new 3.4 cm, a 1.2 cm shine.
- Friends round you: old a fan of near and far spots (2.6 / 3.1 m) over the whole width, filled one friend after the other: with a road or
  a wall on one side the last friend stood half behind another (Finn's or Theo's face beside Luna's hair) → new an arc over the free part
  of the view, its ends nearer (2.8 m) and its middle further back (up to 4.6 m), so each face shows between the two in front; every
  order of filling it is tried (24 for four friends) and a face behind another's head costs most. A friend on the way to a spot waits
  unseen within 1.3 m of the camera (it was 1 m), like a passer-by. The kit's N3: PASS.
- Photo shoot on a short sideways screen: old the "Everyone is posed!" message lay over the background the booking asked for → new the
  shoot's messages sit at the top, above the viewfinder.
- Photo booking: old "Mia, Leo and Zoe will be waiting there!" from Mia → new "Leo, Zoe and I will be waiting there!" ("…, our kitten and I").
- House stairs: old the use button showed a ladder 🪜 while the plates show ⬆️ Upstairs / ⬇️ Downstairs → new the plate's arrow.
- The What's new book's Pet Shop picture: old soft, its lower third an empty floor, the Capybaras sign cut → new a step nearer: the four
  pens with their animals and all four signs whole (bookswap.py).

Not glitches (pass 9 marks the double-checkers kept, with the reason; G4-223 to G4-226): a car right at the camera (the photographer's
school-front spot stood 30 cm into the road); the garden's back wall pink after the purple six-floor picture (the garden spot repaints the
house in the lane's own colour on purpose); two shoppers inside each other (the photographer's own move of a shopper onto a spot another one
was walking to; the game keeps two shoppers off one spot); a posed townsperson on the road (the photographer's New Year row); the big map's
names at its edges and under the tip (the map scrolls; the tip fades after 4 s); a pink thing in the fountain at Christmas (an autumn
leaf at the end of its fall: the check jumps from October to December in one page); pet feedback piled up (N11 feeds and plays in one go);
"🥚 18/25" under "All 25!" (each egg's count rises where it was found; the check picks up all 25 at once); the beds of an old save "pushed
together" (70 cm apart, side by side). Left open for the owner again: your pets at your heels (G4-222, as G4-205).

The photographer's scripts for pass 10: the school front from the pavement (it stood 30 cm into the road); the Pet Show stage a step in
through the park gate (its post filled an upright phone's view); a shopper moved off the camera goes only to a spot no one stands at or walks
to; the New Year row of townsfolk shifts sideways until no one stands on the road. The viewers' line for the clock chip says what the game
does since stage 3: the 🏆 shows on Saturdays until the Pet Show is over at 20:00.

**Pass 10, the full pass on the file with f6**: the kit's own pictures (night3 + run4: every line PASS), the photographer's three scripts, 15
viewer batches: 159 marks; 96 set aside with their reason (`dcfilter10.py`), 63 double-checked (8 double-checkers), 41 kept. Each kept mark
and what was done: glitch list entries G4-227 to G4-248, `tools/run4-wip/data/stage3-dc10/`.

**f7 (32 edits), from pass 10's kept marks** (probes before and after each; what a still picture cannot show was checked by script,
`probe_f7js.py`: the grandma's way past you, a walking friend, the friends' circle, the chip's sky for each sky, every hair wish, the coin pop):
- Grandmas: old a grandma walked through you (unseen only within 1.3 m of the camera): at the Beach Bus stop her head filled a third of the
  screen, her shoes stuck out under a card → new she walks round you, at least 2.1 m away (a smooth step aside from 4.5 m before you to 4.5 m
  past you), and keeps her step while she stands. Only on your device: her place in the day's plan, the one every device shares (and N24
  compares), is unchanged. The check: walking along the very line you stand on, 2.06 m at the closest, never out of sight.
- Friends out for a walk: old a friend stopped 0.95 m from you and stood there for as long as you stood still (Luna's back and hair filled a
  quarter of the view) → new she gives way like a passer-by: coming straight at you she stops 2.4 m away and after a moment walks back; right
  at the camera (1.3 m) she waits unseen, like a friend who follows you; only a friend you talk to may stand closer. The check: she stops at
  2.39 m and turns back (before: 0.9 m, for good).
- Passers-by: old one coming straight at you stopped 1.7 m away (with others pushing, 1.4 m: a face filled the view), and one within 0.95 m
  was held there whichever way it walked → new 2.4 m when coming straight at you; one walking away from you is never held; none steps into
  the space between you and your friends round you, and one standing there when they gather steps out of view, as in a photo shoot.
- Name tags and bubbles: old far ones were tiny pills piled into unreadable stacks (the Pet Show judges from the fountain), and a far
  grandma's bubble, drawn over everything, sat on a near face → new a tag or bubble whose line would be under 15 px tall fades, gone under
  11 px (they shrink with distance; close up they were already capped at a button's height).
- The clock chip: old ☀️ under a grey sky (the sky is fully grey 40 % into a weather change, the chip turned at 50 %) → new the sky as you
  see it: ☁️ from half grey, 🌧️ or 🌨️ as soon as rain or snow falls; the chip changes the moment its sky does.
- Coin pops: old drawn under a card (on a sideways phone the photo's and the haircut's "+120" half behind the result card's top edge) → new
  over it; old a message coming a moment after a pop lay under it (the designer's "+20" on "New client!") → new the pop moves clear of it.
- A photo shoot on a short sideways screen: old the messages still lay over the background the booking asked for (f6's style rule did not
  take: the game places its messages itself) → new during a shoot the coin, food and clock chips step aside and the messages sit there.
- Hair wishes: old "I'd like my hair shoulder-length and bun, in brown" → new "I'd like brown hair, shoulder-length, in a bun" ("long and
  straight", "short, in pigtails").
- The calendar on a short sideways screen: old on a Saturday the month's line stopped at "…and the" in the phone's bottom fade → new the
  week's tiles are lower, so the line shows in full.
- The phone's job list: old "Photographer" touched both sides of its card → new the titles 13 px.
- Colour dots: old their light ring showed only with dark picked in the settings, so on a phone in dark mode a near-black dot vanished on
  the dark card (the Clothes Shop's Special cap) → new in the device's dark mode too (the book's page dots too).
- The Toy Store's corner post: old a faint dashed line from the roof to the pavement → new (the cause, found by switching the ink outlines
  off: the wall's ink shell ran 4 cm behind the post's face, too close for the depth test from across the street) the corner posts of
  every flat-roofed building stand 11 cm out from the wall, not 7.
- Awnings: old seen from one end, the open far end looked like a strip in the air past the shop's corner → new both ends closed by a side
  valance.
- The duck pond: old the reeds' shadows broke into blotches on the water → new the 3.6 cm stems cast no shadow.
- The Tree Park: old the star over your next deck was two crossed stars turning (half-way round, a bell drawn through a star) → new one star
  that faces you and sways a little.
- The Bakery and the Ice Cream Shop: old the counter's right-hand shopper stood right in front of the shopkeeper as seen from the door → new
  that spot 85 cm further right.
The kit's night3 and run4 lines on the f7 file (md5 cc68e9d6, before pass 11's pictures): 41 of 41 PASS, N3 (friends), N4 (walkers), N6 and
N24 (grandmas: the same places on two devices), N13 (hair), N16 and N18 (sky, the same on two devices) and N25 (photo shoot) among them.

Not glitches (pass 10 marks the double-checkers kept, with the reason; G4-246 to G4-248): the fountain mottled at night (the water falling
from its bowls, blue at night; the same sheets show in rain); a house sign without a garland in October (the line means garlands hanging on
posts of their own); the Toy Store's name off-centre on its board (measured: it sits in the middle, above the door; from the shop's end the
board's far half looks about half as long as its near half); shoppers at the Pet Shop's screen edges (their spots by the side shelves); the
delivery timer under Chef Blaze's card (the photographer picked the pizza up in the street; in the pizzeria the timer waits for the card);
in the check's pictures a townsperson's back at the fountain (the check puts you there in one step, onto their way), the Pet Show's drum
message fading over a new pet (N11 runs the show in fast game time) and a dimmed picture (taken as the stairs' fade ended). Written down
again: a crown's soft dots (G4-244: the shadow map, as G4-088; found by switching each shadow caster off in turn) and your pets (G4-245, as
G4-205).

For pass 11: the photographer closes Chef Blaze's card on the delivery spot; the viewers' Halloween line, old "garlands on their posts" → new
"garlands hanging between posts of their own (no garland floats in the air)" (pass 10's viewer read it as garlands on the house-sign posts);
the filter (`dcfilter11.py`) sets aside pass 10's decisions, and its patterns for the check's pictures take two-digit sets (kit10's pictures
had slipped past five of them).

**Pass 11, the full pass on the file with f7**: the kit's own pictures (night3 + run4: 41 of 41 PASS), the photographer's three scripts, 15
viewer batches: 103 marks; 60 set aside with their reason (`dcfilter11.py`), 43 double-checked, 27 kept: G4-249 to G4-260,
`tools/run4-wip/data/stage3-dc11/`. (pass11.sh waited for good after the check: its wait looked for a "p11kit.sh" process, and the shell that
started both carried that name; it was started on its own, and pass12.sh waits for the check itself.)

**f8 (19 edits), from pass 11's kept marks** (probes before and after; checks by script, `probe_f8js.py`, `probe_f8toast*.py`):
- Grandmas (after f7): old on the PC pictures one still passed 1.5 m from the camera: her step aside followed the drawn frames, so on a slow
  screen it lagged → new it follows the clock, and keeps 2.4 m like a passer-by. The check, frames 50 and 200 ms apart: 2.37 m and 2.4 m at
  the closest (before: 2.06 m and 1.79 m). Two of these pictures had been set aside by the filter as the photographer's camera spot (a wrong
  reason); the pass-12 filter never sets a grandma at the camera aside.
- The big map: old your friends' dots had no names since stage 3 (each name was tested against its own dot with the air round it, so every
  side touched the dot) → new tested against the others only: Luna, Rosie and Theo by their dots again; a place's name a friend's dot lies on
  is drawn again over the dot (Rosie's dot hid the S of "Spooky path").
- The What's new book: old on the last page the dots sat 21 px left of the middle ("Let's play!" is wider) → new a three-column footer.
- Messages: old a message that waited for its turn showed after the clock had jumped (at 22:10: "The football friends are at the field until
  19:00") → new dropped once the game clock has moved half an hour or a day since. Old on an upright tablet with the big map open, the
  "online" message lay on the chat and phone buttons → new up in the top row, left of the round buttons.
- New Year's fireworks: old thin sprays of pale dots, a young burst a white smudge → new bigger sparks (up to 16 px), 130 to a burst, in
  their own colours (added up, sparks lying on each other made a white blob), fading in over the first moment and bright for longer.
- The photographer's stars: old only the school sign had a point to check that the background is in the photo, every other background
  always counted as in (a photo of a blue wall for "the bench behind us" got the full score; the last critics had said so too) → new each
  background has one, 2 m behind where the group stands, 1 m up. The check: from the front 5 stars; from behind the group the bench no
  longer counts.
- The Pet Show judges step out of a photo shoot like anyone else (two sat right beside the camera at the stage background).
The kit's night3 and run4 lines on the f8 file (md5 c1ef5ec7): 41 of 41 PASS (N21 fireworks, N24 grandmas, N25 photographer among them).

Not glitches or written down again (G4-257 to G4-260): shadows' dots and stripes (G4-088), your pets (G4-205), the book over the dimmed HUD,
the garden's repainted wall, the joystick's place on a sideways phone, your own shadow on the market's stand, the iPad's notepad over two
townsfolk's heads, the places list's scroll hint; in the check's pictures: the spooky path's picture facing the street, a grandma standing at
her park stop 2.7 m in front of N10's camera, a lamp post above a new pet, a townsperson's hat inside a low tree crown right at the camera, the
camera tilted after a pick-up.

For pass 12: the filter (`dcfilter12.py`) sets aside pass 11's decisions; a grandma at the camera is never set aside as the photographer's spot.

**Pass 12, the full pass on the file with f8**: the kit's own pictures (night3 + run4: 41 of 41 PASS), the photographer's three scripts, 15
viewer batches: 96 marks; 59 set aside with their reason (`dcfilter12.py`), 37 double-checked, 29 kept: G4-261 to G4-272,
`tools/run4-wip/data/stage3-dc12/`.

**f9 (18 edits), from pass 12's kept marks** (probes before and after; checks by script, `probe_f9js.py`, `probe_petfit.py`,
`probe_carcam.py`; the two-phone dance-off run on the fixed file):
- The What's new book (after f8): old on an upright phone the last page's "Let's play!" lay on the page dots and hid three of them (f8's
  three even columns were narrower than the button) → new each side column is at least as wide as its button; the dots stay in the middle
  where they fit (every page on the iPad, the PC and a sideways phone) and sit 46 px left of it on an upright phone's last page, never under
  a button.
- Cars: old the delivery picture showed no town at all, a flat green field and a dark band: a car stood at the photographer's spot on the
  road, its cabin 15 cm from the camera and its roof edge 2 cm above eye height. Walking up to a car's middle brought your eyes as near (each
  car was two round ends) → new one box round each car, like the bus: the check by script from every side, eyes to the cabin 0 before (from
  inside the car's middle the two ends pushed against each other), 0.50 m after; eyes to its body 0.69 m. The photographer's delivery spot
  keeps out of a car standing there, as walking would (`shots4b.py`, old `collideXZ(P.x,P.z,.3,CUR)` → new `collideXZ(P.x,P.z,.3,CUR,solids())`).
- The phone: old a muddy band along the foot of every page (its fade let the dark phone through, with nothing to scroll too) → new the fade
  shows only while there is more below (friends: none; quests and calendar: there).
- The bag: old the "×3" counts at 13 px, three quarters see-through → new 14 px, bold, nearly solid.
- The dance-off: old in the crouch the dancer's shoes sank 23 cm into the floor (the legs went down with the body) → new the legs slide up
  into the body, the shoes within 1 cm of the floor through the whole move. Old on an upright phone the host's dancer leaned out of the
  picture: in a plain house the view stands 4.3 m back, not the 5.6 m it wants → new it widens until both dancers and their lean fit (77° in
  a plain house, at most 95°; 70° as before when the room is deep enough, and on every sideways screen).
- Pets: old a new owl's cape stood flat out of its back, its backpack hid inside it and its collar hung off its front; the duck's bow tie was
  inside its chest (they borrowed the cat's and the bunny's sizes) → new their own: the owl's cape and backpack lie on its upright back, the
  collar and scarf go round both birds' necks, the bow tie sits under the beak. A cat or a bunny in every piece: the same pixel for pixel.
- The Home shop's little pictures: old a glowing piece came out nearly white (the "Seafoam neon sign" with white tubes; the pink, mint and
  blue lamp shades; the lanterns) → new it glows less in its little picture, so its colour shows; in the room it glows as before.
- Job tutorials: old in "Follow the dot" the hand right of the dot pointed away from it → new 👈. Old the hair pictures' words were the line
  under them again → new "The picture = the new hair", "A match = stars and coins" (the lines stay).
The kit's night3 and run4 lines on the f9 file (md5 0ded5b6f): 41 of 41 PASS (N11 pets, N13 hairstylist, N38 tutorials, N39 dance-off among them).

Not glitches or written down again (G4-270 to G4-272): the football field's scoreboard 8 m behind a pavement tree, the garden fence in front
of the photographer's garden spot; a shopper at the market's shelves, your own shadow on the fruit stand, the corner map's 🎨 (tap the map to
change your dot's colour), your pets' tags behind the see-through joystick; in the check's pictures: a friend walking by N10's fountain spot,
N11's lamp post, N19's fixed view of the gate, N27 looking up.

For pass 13: the filter (`dcfilter13.py`) sets aside pass 12's decisions and drops, with the wordings pass 12 used for the known ones (on
pass 12's own marks it keeps exactly the 14 that f9 fixed).

**Pass 13, the full pass on the file with f9**: the kit's own pictures (night3 + run4: 41 of 41 PASS), the photographer's three scripts, 15
viewer batches: 83 marks; 51 set aside with their reason (`dcfilter13.py`), 32 double-checked, 21 kept: G4-273 to G4-281,
`tools/run4-wip/data/stage3-dc13/`. None of f9's fixes came back.

**f10 (16 edits), from pass 13's kept marks** (checks by script before and after, `probe_f10js.py`; pictures of the garland):
- The clock chip: old 🌧️ while nothing fell yet, the scene still in sunshine (the streaks fade in from rain level 0.3 to 1, the chip turned
  at 0.3) → new rain and snow show on the chip from 0.55, the streaks a third in.
- The photographer: old opening the phone or the bag over a photo's result card left the shoot on: the map, the notepad and the job box
  hidden and only the shoot's own buttons working, until you left town (only the card's Bye ended it) → new once its result card is gone,
  however it goes, the shoot ends as with Bye. The check: the phone over the result card, the shoot on before, over after; Bye as before.
- Quests: old "Snack time: Eat some flour", flour among "3 different treats" (400 such snack quests and 66 such sprees in 200 days) → new
  never raw flour or eggs to snack on or as treats, on new days; an old day's quests stay.
- The Pet Shop's owl: old it walked its whole pen at perch height, in the air most of the time, and stopped facing the wall → new it keeps
  to the perch and turns to the room.
- The park's holiday garland (both marks dropped by the double-checker: from the front its string is behind the shelter's back wall): it
  ran along the bus shelter's back, through its roof's rim (the shelter came in run 4) → new two pieces, either side of the shelter, at every
  holiday.
The kit's night3 and run4 lines on the f10 file (md5 d6313dcb): 41 of 41 PASS (N1 counts 103 Halloween pieces with the garland in two, N25 photographer, N28 Pet Shop: no animal outside its area).

Not glitches or written down (G4-278 to G4-281): two ducks one behind the other from the pond's spot (80 cm apart at the nearest), a bird
flying over edge-on, the salon floor softening near the camera on a big screen (256-pixel floor pictures, open), the photographer's Pet Show
spot on an upright phone, the places list's scroll hint, the salon's sign under the round buttons; in the check's pictures: crates at the edge
of its photo shoot, the Ideas Board before N16's camera, a townsperson's back in N21's, a post, a lamp post, a door at the camera, a friend
partly behind another.

For pass 14: the photographer's night and rain town views move the cars near a spot along, as its day views do (a car passing 2 m in front
of the school spot filled the night picture); the filter (`dcfilter14.py`) sets aside pass 13's decisions and drops (on pass 13's own marks
it keeps exactly the 8 that f10 fixed).

**Pass 14, the full pass on the file with f10**: the kit's own pictures (night3 + run4: 41 of 41 PASS), the photographer's three scripts, 14
viewer batches: 75 marks; 58 set aside with their reason (`dcfilter14.py`), 17 double-checked, 14 kept: G4-282 to G4-289,
`tools/run4-wip/data/stage3-dc14/`. None of f10's fixes came back.

**f11 (2 edits, the second in five job boxes), from pass 14's kept marks** (pictures of the salon card and the job box):
- The salon card: old the customer's words wrapped so their last emoji and the closing quote stood alone on a line ("💕”", "✨”") → new the
  last word keeps to the word before it.
- The job box: old "Purple house" on one line, "· 86 m" starting the next → new the distance keeps to the place before it (the
  photographer's, the hairstylist's, the teacher's, the designer's and the pizza job box).
The kit's night3 and run4 lines on the f11 file (md5 ddef2182): 41 of 41 PASS (N8 designer, N13 hairstylist, N25 photographer among them).

Not glitches or written down (G4-284 to G4-289): a dark strip at the iPad's bottom-right corner in the photo shoot at the Duck Pond (a bush
just below the screen's edge: its outline, 2 cm bigger, shows a step before the bush does; traced by replaying the check's shoot with its
booking), the phone's job list on a sideways iPhone (its second row starts right at the screen's foot, which fades while there is more;
written down, section 5c), your friends in a shop at the view's edge or at the counter, the designer's reveal ("Knock knock! 🚪" rising and
fading), the hair card on a sideways phone and your pets at your heels (decided before); in the check's pictures: the grandmas right in front
of N6's camera, N9's "closed" toast still up at noon (it tries the truck at 21:00 first), a pavement tree at the left of N25's frame at the
hedge (in front of nobody, five stars).

For pass 15: the filter (`dcfilter15.py`) sets aside pass 14's decisions and drops (on pass 14's own marks it keeps exactly the 3 that f11
fixed; on passes 12 and 13 it sets aside nothing more than `dcfilter14.py`).

**Pass 15, the full pass on the file with f11**: the kit's own pictures (night3 + run4: 41 of 41 PASS), the photographer's three scripts, 15
viewer batches: 94 marks; 78 set aside with their reason (`dcfilter15.py`), 16 double-checked, 13 kept: G4-290 to G4-296,
`tools/run4-wip/data/stage3-dc15/`. None of f11's fixes came back.

**f12 (5 edits), from pass 15's kept marks** (checks by script and pictures before and after, `views_f12.py`):
- A quest's steps: old a long step wrapped under its ○ and "Ice / Cream Shop" was split over two lines → new a step wraps under its own
  words and the shop's name keeps together.
- The photo frame on a touch screen held sideways: old its left edge kept off the joystick and its right edge stayed, so its middle was 70 to
  76 px right of the camera's: the family you faced stood left of the frame's middle, in the photo too → new the same space on both sides
  (the frame's middle and the family's: 498 and 422 before, 422 and 422 after; five stars both times).
- The clock chip: old 🌙 on a cloudy night while the clouds hid the moon and the stars → new ☁️ under a grey night sky (a clear night 🌙).
- The path through the Tree Park's gate in town: old it stopped in a straight edge in the grass → new its far end is round.
The kit's night3 and run4 lines on the f12 file (md5 43dddb98): 41 of 41 PASS (N15 one clock, N16 rain sky, N25 photographer, N37 Tree Park among them).

Not glitches or written down (G4-294 to G4-296): saw-tooth marks on a Tree Park crown (traced: nothing between that point and the sun; the
steps of the sun's shadow map, as G4-088 and G4-257), the white duck from behind at night, the market's keeper behind the fruit stand from
the door on an upright phone, the photographer's Santa view with the tree's star above the screen's top, a firework burst at the screen's
edge; decided before: the HUD over a sign on an upright phone, your own shadow, N21 right behind a townsperson.

For pass 16: the filter (`dcfilter16.py`) sets aside pass 15's decisions and drops (on pass 15's own marks it keeps exactly the 5 that f12
fixed; on passes 13 and 14 it sets aside nothing more than `dcfilter15.py`).

**Pass 16, the full pass on the file with f12**: the kit's own pictures (night3 + run4: 41 of 41 PASS), the photographer's three scripts, 14
viewer batches: 65 marks; 56 set aside with their reason (`dcfilter16.py`), 9 double-checked, 8 kept: G4-297 to G4-300,
`tools/run4-wip/data/stage3-dc16/`. None of f12's fixes came back.

**f13 (4 edits), from pass 16's kept marks** (checks by script and pictures before and after, `views_f13*.py`, `eyegeo2.py`):
- The ducks and the lily flowers: old the white duck sat on a lily pad, the flower through its chest (a duck pushed aside by the other swam on
  straight at its old goal across a flower) → new the little pond's ducks keep 34 cm from each flower, and a step into water a duck may not use
  ends that swim (within 34 cm of a flower in 368 duck-frames of 14400 before, none after; the ducks still swim and come when fed).
- A duck's eyes: old from behind and from the side the far eye's shine stuck out past the head's outline, a ring like a googly eye (from 1148
  of 1440 view directions) → new the eyes sit a little deeper and their shine on their top, inside the outline (none).
The kit's night3 and run4 lines on the f13 file (md5 9e76e1c2): 40 of 41 PASS; N15 failed on its first two-device sample (the second test player was read 14 game minutes after the first; its other two samples 2 minutes apart). N15 alone on the same file, nothing else running: failed once the same way, then passed twice; on the f12 file alone it passed three times. Replayed with the kit's own set-up on both files (`probe_n15.py`): on both, one of the second player's steps takes 8.6 to 9.3 s of real time, and the player read before it lags by that (A 10:00 against B 10:14 on both files); the game's own frames take 0 to 4 ms each, the pause is outside them (`probe_n15b.py`): the line's own timing, as CLAUDE.md warns for N15, not the file (`tools/run4-wip/data/n15-runs.txt`). The line stays as it is and runs again in the final check.

Not glitches or decided before (G4-299, G4-300): Luna on her own walk behind the lamp post beside the photographer's bus-stop spot, two ducks
one behind the other from the pond's spot, N39's picture catching the invitation card's pop-in, a grandma passing 2.1 m in front of an upright
phone, the pose card over the photo frame.

For pass 17: the filter (`dcfilter17.py`) sets aside pass 16's decisions and drops, and no longer reads "Pet Shop" as a pet (one mark got the
pets' reason in pass 16; its twin was set aside as the photographer's spot).

**Pass 17, the full pass on the file with f13**: the kit's own pictures (night3 + run4: 40 of 41 PASS, N15 its own timing, above), the
photographer's three scripts, 14 viewer batches: 63 marks; 49 set aside with their reason (`dcfilter17.py`; 3 of them under a reason that did
not fit, sent on too), 17 double-checked, 12 kept: G4-301 to G4-309, `tools/run4-wip/data/stage3-dc17/`. None of f13's fixes came back.

**f14 (6 edits), from pass 17's kept marks** (checks by script and pictures before and after, `views_f14*.py`):
- The bus shelter's cobwebs (October): old its two webs stood up through the roof, their middle at the roof's height (a white line on the roof,
  read as a garland string through it) → new they hang in its front corners under the roof, from the post to the side glass.
- The lake bench: old it faced along the shore, side-on to the water → new it faces the water (its two seats turn with it).
- Furniture pictures in the dark theme: old the Midnight cat tree, dark navy, was lost on the dark purple tile → new a furniture picture (a
  shop's New in, the designer's list, the claw machine's prize) has a thin light edge in the dark theme.
- Shoppers at the door: old a shopper walked on to 0.9 m from you and waited there for as long as you stood still (a giant half face at the edge
  of the view as you came in) → new it stops a step before you when you stand on its way (2.4 m straight ahead, 1.7 m at an angle) and after a
  moment goes back, like a passer-by in town (a shopper within 1.2 m in front of you in 7 of 9 shops before, for nearly all of 30 s in four; in
  none after).
- A far grandma's bubble: old drawn over everything at any distance (a far one floated over the bus shelter with nobody under it) → new drawn
  over everything only within 10 m and while it can be read; further, a wall in front of her hides it (a photo family's tags the same).
The kit's night3 and run4 lines on the f14 file (md5 854e060c): 41 of 41 PASS (N15 among them).

Not glitches, known or written down (G4-306 to G4-309): the steps of the sun's shadow map on a Tree Park crown (G4-294 again), the
photographer's start spot at the pond's bench not looking for the background (section 5c), Armchair and Beanbag sharing 💺, the ⬇️ in its fade
over two tiles' corners, N27's camera tipped up after a pick-up, the chips stepping aside during a shoot on a sideways phone.

For pass 18: the filter (`dcfilter18.py`) sets aside pass 17's decisions and drops, and three rules no longer take what they were not for: the
ducks' rule read the "pad" of "ipad" as a lily pad (every iPad duck mark went on), the camera-spot rule took a person right against the camera
for the camera against a post, the edge-bubble rule took a tiny far bubble for one cut at the screen's edge. On pass 17's marks it keeps exactly
the 6 that f14 fixed.

**Pass 18, the full pass on the file with f14**: the kit's own pictures (night3 + run4: 41 of 41 PASS), the photographer's three scripts, 14
viewer batches: 75 marks; 58 set aside with their reason (`dcfilter18.py`; 3 of them under a reason that did not fit, sent on too), 20
double-checked, 15 kept: G4-310 to G4-316, `tools/run4-wip/data/stage3-dc18/`. None of f14's fixes came back.

**f15 (11 edits), from pass 18's kept marks** (checks by script before and after, `views_f15*.py`):
- Cooking quests: old "Cook cheese sandwich on your stove" → new "Cook a cheese sandwich", "Cook some pancakes" (all 12 recipes, and a recipe
  quest's last step).
- A shop's "New in!" row: old one piece could come twice in colours a child cannot tell apart on its little picture ("Grape" and "Violet" dog
  houses; 16 to 463 of 3000 rows per shop) → new never (none).
- A design client's line: old "the Apartments behind the Pet Shop, flat 11, near the Pet Shop" → new a building whose name says where it is gets
  no "near"; the coloured houses keep theirs.
- A photo shoot's start: old when no spot had a clear view the camera stayed where you stood (on a sideways iPhone everyone's feet were below the
  frame), and a grandma counted as in the way although she steps out of a shoot (one in front of the family failed every spot) → new she no
  longer counts, and with no clear spot the camera takes the nearest where everyone fits.
The kit's night3 and run4 lines on the f15 file (md5 26b602a7): 41 of 41 PASS.

Not glitches or decided before (G4-314 to G4-316): a New Year burst just above a cloud's top (drawn in front of it), the placing grid while you
decorate, a yellow piece just below the view on a visit, an older chat bubble under the header, someone passing close on an upright phone, the
bush outline at the pond's spot, the sideways hair card, N20's and N30's camera spots.

For pass 19: the filter (`dcfilter19.py`) sets aside pass 18's decisions and drops, and four rules take the words pass 18's viewers used. On
pass 18's marks it keeps exactly the 4 that f15 fixed.

**Pass 19, the last full pass under the old rules, on the file with f15**: the kit's own pictures (night3 + run4: 41 of 41 PASS), the
photographer's three scripts, 14 viewer batches: 74 marks; 55 set aside with their reason (`dcfilter19.py`; 3 of them under a reason that did
not fit, sent on too), 22 double-checked, 16 kept: G4-317 to G4-326, `tools/run4-wip/data/stage3-dc19/`. None of f15's fixes came back.

**f16 (13 edits), from pass 19's kept marks** (probes and pictures before and after, `views_f16*.py`, a real two-phone dance-off `shots4c_f.py`):
- A raised arm in a photo pose: old straight up, it went through Mia's pigtail → new it leans a little forward, in front of the hair (wave,
  peace sign).
- The photo on the thank-you card: old made 400 px across for the whole screen and blown up about four times (soft faces and tags) → new a
  sharp copy on the card; the phone keeps the small one, as before.
- A shopper on its way: old it could stop 0.95 m beside you (a head and a body filled the left sixth of the Toy Store's view) → new within
  1.3 m of the camera it waits unseen for that moment, like a passer-by and a friend.
- The dance-off on a short sideways screen: old the score bar sat 64 px down, on the dancers' crowns and over the mirror ball → new at the top
  (the chips and buttons above it are hidden for the round).
- The school party banner (1 September): old its end covered the front of the little roof over the door → new 27 cm higher, clear of it.
- Speech bubbles: old a grandma's bubble ran under the corner map ("eding the ducks is the best part of my day.") → new a speech bubble
  (a grandma's, another player's, a football friend's) slides sideways, still over its speaker, clear of the map and notepad column, the
  buttons and the screen's edges.
- Butterflies: old they came within 1.3 m of the camera, where two flat wings read as a big gold block in the air → new they keep 2.2 m.
The kit's night3 and run4 lines on the f16 file (md5 d30bebcd): 40 of 41 PASS; N25 FAIL ("the photo in the phone chat", on all three screens: G4-327, fixed in f17) (pass 20).

Not glitches, decided before or open (G4-324 to G4-326): your cat Mochi stretched at the corner of a sideways phone when the hair card turns the
view (found by hiding each part in turn while drawing; with the pets question, for the owner), a shopper crossing in front of Mrs. Crumb,
butterflies in front of a crown, the fed ducks one behind the other, your pets' tags, someone close at the edge of the view, an older chat
bubble under the header.

For pass 20: the filter (`dcfilter20.py`) sets aside pass 19's decisions and drops, and three rules take the words pass 19's viewers used. On
pass 19's marks it keeps exactly the 8 that f16 fixed. From pass 20 the loop follows the owner's rules of 21 Oct (`CLAUDE.md`, "Glitch loop
rules"): NEWRULESLINE

**Pass 20, the first under the owner's rules of 21 Oct** (re-check only what changed): the kit's night3 and run4 lines in full on the f16 file
(40 of 41 PASS, N25 FAIL), then 26 pictures of f16's spots only (`pass20.sh`), five viewers by focus, `dcfilter20.py`, six first checkers: 12 viewer marks, 6 of them
set aside under a reason that did not fit and sent on too; 18 double-checked, 17 kept: G4-327 to G4-330, `tools/run4-wip/data/stage3-dc20/`.
(Setting up the fresh container: the Python package playwright 1.56.0 matches the Chromium in the environment; a newer one looks for another.)

**f17 (4 edits), from pass 20** (probes before and after, `views_f17.py`; N25 alone):
- The photo in your phone's chat (the kit's N25): old since f16 the card showed the sharp copy, so the phone's small copy was first decoded
  when the phone opened and had no size at that moment (N25 FAIL on all three screens) → new it is decoded at the snap; N25 PASS twice.
- Speech bubbles: old a bubble kept clear of the map column and the buttons sideways only; on a sideways phone a grandma's bubble by the pond
  ran under the clock chip and the top buttons ("ducks is the ... of my day.") → new it also stays below the top row (down at most its own
  height, then sideways as before).

Left open, grade 1 (G4-329): a group member's name tag peeking out behind the "Pose: Mia" label on a sideways phone. Not glitches (G4-330): the
notepad's cream paper in the dark theme (by design); a shopper about 1.5 m from you at the right edge of the Toy Store (G4-171, G4-300).

For pass 21: the filter (`dcfilter21.py`) sets aside pass 20's decisions and its one drop; the bubble and clock chip rules leave a speech bubble
under the clock chip or the top buttons to the first checkers. On pass 20's marks it keeps exactly the 9 that f17 fixed.

**Pass 21** (the f17 file): the kit's night3 and run4 lines 41 of 41 PASS; 12 pictures of f17's spots (`pass21.sh`), five viewers, `dcfilter21.py`,
three first checkers: 7 marks, all double-checked (one sent on from the set-aside list), 5 kept: G4-331, G4-332. f17's fixes held (the photo
in the phone's chat; the bubble below the top row, no mark about it).

**f18 (1 edit), from pass 21** (probe before and after, `views_f18.py`):
- A chat opening: old at the foot of the newest message, so on a sideways phone the thank-you photo's top lay under the Photos header → new
  when the newest message is taller than the screen it opens at its top (the fade at the foot shows there is more).
Grade 1 (minor): pass 21 is the first clean pass under the stop rule.

Not glitches (G4-332): a palette badge on the corner map (part of the map's picture; the whole map is the tap target), the fed ducks one behind
the other (G4-278), two townsfolk one in front of the other.

**Pass 22** (the f18 file): the kit's night3 and run4 lines 41 of 41 PASS; 9 pictures of f18's spot (`pass22.sh`), five viewers, `dcfilter22.py`,
one first checker: 3 marks, 1 set aside (the phone's lit screen, G4-126), 1 kept (G4-333: two townsfolk one in front of the other, not a glitch),
1 dropped. No fix. f18 held (the chat opens at the thank-you photo's top).

**The stop rule** (counting from pass 20): pass 20 fixed two marks above minor (G4-327, G4-328, grade 2); passes 21 (one grade-1 fix) and 22
(none) are two in a row with no fix above minor, and pass 22 is the cap. The loop stopped after pass 22.

**Pass 23, the full final pass** (the f18 file): the photographer's three scripts and the kit's own pictures of pass 22's run, every picture
(628) with the one focus it belongs to, 18 batches of at most 40, 18 viewers, `dcfilter23.py`, 6 first checkers: 28 marks, 16 double-checked,
12 kept: G4-334 to G4-339, `tools/run4-wip/data/stage3-dc23/`. Two marks above minor, fixed in f19 and re-checked like a pass (pass 24):

**f19 (3 edits), from pass 23** (probes before and after: `views_f19.py`; the kit's N8 with what is drawn read out):
- The designer job's two-room orders: old room 2 drew room 1's furniture, and after a trip back your pieces in room 2 were gone from view
  (the lists themselves were right) → new each room shows its own furniture. (Since stage 3.)
- Speech bubbles on an upright phone: old a grandma's bubble lay half under the map and notepad column when she stood under it or off the
  left edge → new such a bubble slides fully clear of the column, readable.

Minor marks left as they are (grade 1): see the leftover list below.

**Pass 24, the re-check of f19** (the f19 file): the kit's night3 and run4 lines 41 of 41 PASS; 10 pictures of f19's spots, five viewers, one first
checker: the Flower Corner bubble, clear of the map column now, ran past the right edge on an upright phone (G4-340, grade 2); the designer's
room 2 and the pond bubble held.

**f20 (1 edit), from pass 24**: old a bubble that slid clear of the column but was wider than the space beside it ran past the screen's edge
→ new it is drawn smaller to fit. Re-checked like a pass (pass 25).

**Pass 25, the re-check of f20** (the f20 file): the kit 40 of 41 PASS, N15 on its own timing (its first sample only; alone on the same file:
PASS, FAIL the same way, PASS); 10 pictures, five viewers, one first checker: 4 marks kept, all decided before (G4-341). f20 and f19 held. No fix:
the full final pass is done.

#### Decisions made alone (run 4 finish)
- The kit, never weaker (every change in `cozy-check-v6.zip`, listed in its README-KIT.md and here, old → new):
  - N15's chip rule: old `^\d{1,2}:\d\d (Mon|…|Sun)$` → new the same with an optional "🏆 " before the weekday, as the two-device test above
    it already allowed: this test reads the chip on the day after the bed test's night, so a run started on a game Friday read the Saturday
    Pet Show's 🏆 and failed with no day number shown. Every other part of the line is unchanged.
  - The crawl parts (C2, C2b, C1's recipes): old they played at whatever hour the shared clock gave (a third of each game day is night, when
    the shops, the salon and the clients are shut, so C2b missed them) → new each crawl part sets the game clock to 10:00 of the shared day
    first and says so in the log, as K1 does at noon.
  - C2b: old the beach (reached only by the Beach Bus, 3 days a week) was never reached, so C2b failed in every full check → new the town
    part rides the bus once like a player: the clock is set to the next moment the bus stands at the park stop (said in the log), the crawler
    walks to its door and uses the use button (up to three tries, people walk past the stop), stays on to the end, and crawls the place it
    arrives in.
  - The crawl finds a target again by its label and place (its list index drifts when people walk about: "Talk to Sir Barkley" had become
    Zac's "1 vs 1"), and an entry recorded once is opened again by its label.
  - C1's tours: old a thing that is only there on some days or hours (the Saturday Pet Show, a match by day, the bus) was looked for at the
    tour's own hour ("thing not found") → new the tour meets it on the game day and hour the iPad crawl met it (`when` in the recipe; the
    second fix: the exact day, not the next same weekday, since the bus timetable changes from week to week).
  - The crawl's use button: old when it did not take the target from any of the six sides, the target was unreachable (in the 20 Oct
    Saturday rerun a passer-by whose path runs 0.38 m from an apartment door took that door's button for a moment) → new the crawler waits
    2 s of game time and tries the six sides once more before it says unreachable.
- The clock chip, the shade fix, the friends' spacing (1.22 m; the check asks 1.2), the hair card turning the view, and the people not drawn
  within 1.3 m of the camera: each is in the list above with its reason.
- f14 narrows a stage-3 decision ("grandma speech bubbles and the photo families' name tags are drawn over everything"): they are drawn over
  everything only within 10 m and while they can be read; further, a wall in front of the speaker hides them (G4-305: a far grandma's bubble
  floated over the bus shelter with nobody under it).
- Two kept marks judged not glitches (above), and one left open for the owner: your pets keep close at your heels, so from your eyes they
  stand at the bottom of the screen and one can be behind another for a moment (G4-205).

#### The full check on the live game (20 Oct)
The live game = `main` as merged on 18 Oct (GitHub file md5 8425c145, its Claude form 579a3449, both read back on 20 Oct and equal to what the
18 Oct check tested: F2, F3). Run with the kit v6 (`qcheck4.sh live20 … --full`; the backup argument is the 18 Oct GitHub-file backup, read back
byte for byte). It ran in blocks, nothing heavy beside it:
1. The whole check (66 min): 11 FAIL. N15 (the kit's chip rule met the Saturday 🏆: the run started on a game Friday); C2 (3 "unreachable"
   that were the crawl's index drift onto Zac's football buttons; a probe reached all three judges); C2b (the beach: the crawl never rode the
   bus); C1 on all 7 devices (the Saturday Pet Show entry and a daytime match looked for at another day or hour); C5 (the dance-off's arrow
   buttons: 20 px corners against 18 px, a real one, fixed in the branch, f2).
2. The run-4 lines again on the next game Friday (N15 with the kit's chip rule fixed): N15 PASS.
3. The town crawl and the tours again with the crawl finding targets by label and the tours meeting time-bound things at the crawl's hour:
   C2 PASS, C1 PASS ×7; C2b failed (the crawl ran at game night: salon, clients and beach shut).
4. Again with the crawl at 10:00 and the bus ride: C2 PASS, C2b PASS (25 of 25 areas); C1 failed on 5 devices ("Get on the bus (free 🎟️)":
   the tours looked for the bus on the next same weekday, another week with no bus).
5. Again on a game Saturday with the exact day in the tours: C1 PASS ×7 (34 of 34 screens), C2b PASS; C2: one "Go inside" (an apartment door)
   unreachable: a passer-by's path runs 0.38 m from that door (a probe at 80 moments found the door's button reachable every time); the crawl
   now tries such a spot again a moment later.
6. The town crawl and the tours once more with that retry (on a game Saturday at 10:00, 66 min): C2 PASS (808 taps in 25 areas, 385
   screens), C2b PASS (25 of 25 areas), C1 PASS ×7 (34 of 34 screens each, light and dark).
Last state of every line on the live game (`tools/run4-wip/final-check-2026-10-20-live.txt`, every line as printed): all PASS but C5;
C1-WK not run (no Safari engine here) and G not verified (real devices), as on 18 Oct. The only real failure of the live game: C5 (fixed in
this pull request, f2).
