"""Stage 3, REPORTER, passes 3 to 5: the glitch entries G4-064 onward, one per cause, grouping the viewer marks the
double-checkers kept (stage3-dc3 = pass 3, stage3-dc3b = pass 3's extra pictures, stage3-dc4 = pass 4, stage3-dc5 = pass 5).
"before" = the picture of the first mark; "after" = the newest picture of the same spot (pass 6 if taken, else pass 5).
usage: python3 mkglitches3.py  -> rewrites glitches.json from G4-064 on (G4-001 to G4-063 stay as they are)"""
import json, os, re
S = '/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad'
DC = {'p3': 'stage3-dc3', 'p3b': 'stage3-dc3b', 'p4': 'stage3-dc4', 'p5': 'stage3-dc5'}
PASS = {'p3': 'pass 3', 'p3b': 'pass 3', 'p4': 'pass 4', 'p5': 'pass 5'}
M = {}
for k, d in DC.items():
    for m in json.load(open(f'{S}/{d}/merged.json')): M[f'{k}:{m["id"]}'] = m
AFTER_SETS = ['stage3-p6', 'stage3-p6b', 'stage3-p6c', 'stage3-p5', 'stage3-p5b', 'stage3-p5c']
KIT_SETS = ['stage3-kit6', 'stage3-kit5']
maps = {}
for d in AFTER_SETS + KIT_SETS:
    mp = f'{S}/{d}/map.json'
    if os.path.exists(mp): maps[d] = [e for e in json.load(open(mp)) if e.get('file')]
def pic(ref):
    m = M.get(ref)
    return m['path'] if m and m.get('path') and os.path.exists(m['path']) else None
def after_of(ref):
    m = M.get(ref)
    if not m: return None
    f = os.path.basename(m['path'])
    k = re.match(r'kit\d-(.*)\.png$', f)
    if k:
        for d in KIT_SETS:
            for e in maps.get(d, []):
                if e['file'][5:-4] == k.group(1): return f'{S}/{d}/shots/{e["file"]}'
        return None
    spot = re.sub(r'^.*?_\d{3}_', '', f)[:-4]; parts = f.split('_'); prof, theme = parts[1], parts[2]
    for d in AFTER_SETS:
        for e in maps.get(d, []):
            if e['name'] == spot and e['prof'] == prof and e['theme'] == theme: return f'{S}/{d}/shots/{e["file"]}'
    return None
def R(pfx, *ids): return [f'{pfx}:M-{i:03d}' for i in ids]
FIXED_LATER = 'The pictures of this pass were taken before the fix went in.'
# (id suffix, marks, place, device, what, bad, status, fix, check)
G = [
 # ---- pass 3 ----
 ('064', R('p3', 5, 6, 7, 8, 10, 12), 'the bus stop at the park', 'iPad', "The bus stop's pole ran up across the front of its round sign and put a dark line through the bus picture.", 1, 'fixed',
  'The pole stands behind the round sign and ends in it (a7dbc07).', 'pass 4 and 5 pictures of the bus stop.'),
 ('065', R('p3', 9, 11, 94, 95), 'the party invitation and the dance-off card', 'iPad, iPhone', "The two answer buttons (\"✅ I'll come!\" / \"🙅 Not this time\", \"💃 Let's dance!\" / \"🙅 Not now\") touched, with no gap, so it was easy to tap the wrong one.", 1, 'fixed',
  'The party cards\' buttons have a gap (2c0c488).', 'pass 4 pictures of the two cards.'),
 ('066', R('p3', 13, 98, 163), 'the hairstylist tutorial', 'every device', 'In the tutorial picture the 👉 hand under the door pointed at empty space, not at the chair or the customer.', 1, 'fixed',
  'The hand points at the chair (2c0c488).', 'pass 4 tutorial pictures.'),
 ('067', R('p3', 14, 100, 165) + R('p3b', 25), 'the photographer tutorial', 'every device', 'The booking line "family photo · the fountain" was squeezed against the 📸 icon and nearly touched the right border.', 1, 'fixed',
  'The booking line has room (2c0c488).', 'pass 5 PC tutorial picture: the line sits clear of the icon.'),
 ('068', R('p3', 15, 38, 102) + R('p4', 13, 31) + R('p5', 9, 23, 50, 68), 'the photographer\'s pose card', 'iPad, iPhone sideways', 'The "Pick a pose" card covered one of the people being posed (Mia in pass 3; Zoe from the eyes down in passes 4 and 5).', 2, 'fixed',
  'Pass 3: the single pose card opens away from the person (5e94f9c). Pass 4: on a wide screen the card is narrower, three poses a row (002c9f6). Pass 5: at most 30% of the width, the margin beside a framed family (ceb35b2). ' + FIXED_LATER, 'a probe of the pose card on a sideways iPhone and an iPad after ceb35b2: all three people in view beside the card; pass 6 pictures.'),
 ('069', R('p3', 16, 18, 166, 167), 'the photo frame', 'iPad, PC', 'The dashed photo frame ran under the round 💬📱🎒⚙️ buttons; the ⚙️ button hid its corner.', 1, 'fixed',
  'The frame starts under the round top buttons (2c0c488), and the photo is what the frame shows (9777d26).', 'pass 4 and 5 photo-shoot pictures.'),
 ('070', R('p3', 17), 'a photo shoot', 'iPad', "The three posing people stood so close that their waving arms went into the next person's head.", 2, 'fixed',
  'The people in a photo stand 1 m apart (a7dbc07).', 'pass 4 photo-shoot pictures.'),
 ('071', R('p3', 20, 25) + R('p3b', 29), 'the Pet Show stage', 'iPad, PC', 'The yellow "🏆 Pet Show" board ran behind the right red pillar, so its last letter touched the pillar.', 1, 'fixed',
  'The board is 2.8 m wide, clear of the pillars (a7dbc07), with wider margins (9777d26).', 'N23 passes (nothing crosses the Pet Show sign); pass 5 stage pictures.'),
 ('072', R('p3', 21, 23) + R('p5', 25, 26), 'the Toy Store window', 'iPad', 'A thin dashed vertical line ran down the big right window just inside its edge (and down the pink corner post), at night and in rain.', 1, 'fixed',
  "Cause, found by rendering the spot with every mesh switched off in halves: the shop window's frame and sill ran 7 to 22 cm into the corner post at the front, and the glass 7 cm. The post's side, seen almost edge-on, won some of the screen's sub-pixel depth tests against the glass in front of it. The windows now end 3 cm short of the posts on every flat-roofed shop (57358da). " + FIXED_LATER, 'the same night view rendered after the fix: no dark pixel column left on the glass.'),
 ('073', R('p3', 26), 'the Tree Park gate', 'iPad', 'The earth path stopped at the gate posts and a tree trunk stood in the middle of the gateway.', 1, 'fixed',
  'The path goes on through the gate and the tree behind it stepped aside (5e94f9c).', 'pass 4 and 5 gate pictures.'),
 ('074', R('p3', 27), 'a shopper in the Café', 'iPad', "On the orange-haired shopper the bob's hem band covered the cheeks down to the mouth.", 1, 'fixed',
  "The bob's hem wraps round the back only; the long styles' side panels sit a hair behind the face, so they no longer flicker (d00af6b).", 'pass 5 Café pictures.'),
 ('075', R('p3', 28) + R('p3b', 10), 'the Clothes Shop', 'iPad', 'Under the clothes racks the back wall had blurry grey streaks, like dirt.', 2, 'fixed',
  "They were the shirts' soft shadows; the racks by the back wall cast no shadow (7f754f0) and bake with the walls (2502632).", 'pass 4 and 5 Clothes Shop pictures.'),
 ('076', R('p3', 33, 35, 36, 37, 155, 156, 157, 158, 182), 'cards over the clock chip', 'iPad, PC', "An open card (bag, settings, a shop, the costumes) covered most of the weather/time chip; only its icon poked out.", 1, 'not a glitch',
  'By design (G4-033, G4-060): a card takes the screen while it is open; the HUD behind is dimmed and cannot be tapped.', '—'),
 ('077', R('p3', 39, 40, 41, 42, 43, 44, 45, 46, 47, 76, 77, 78, 79, 80, 81, 82, 83, 84, 113, 114, 116, 117, 119, 120, 121, 122, 124), 'the phone', 'iPhone', "The phone frame's bottom edge lay over the joystick and the run and jump buttons, which poked out from under it.", 1, 'fixed',
  'The joystick and the buttons hide while the phone is open (5e94f9c); closing the phone shows them again (2c0c488).', 'pass 4 and 5 phone pictures.'),
 ('078', R('p3', 127, 129, 131, 133, 136, 142, 143, 144, 146, 147), "a long card's scroll arrow", 'iPhone sideways', "The card's ⬇️ scroll arrow sat on top of the big ⬆️ jump button.", 2, 'fixed',
  'The scroll arrow never lands on the run or jump button (5e94f9c).', 'pass 4 pictures of the bag, settings and shop cards.'),
 ('079', R('p3', 48, 88, 91) + R('p4', 60) + R('p5', 28, 37), "a long card's scroll arrow", 'iPhone upright', 'The round ⬇️ arrow sat on the last row of a tall card: on "🐾 Bring my pets to…", then on "📦 Move my game" (cut to "Move my ga") and on a shop tile\'s corner.', 2, 'fixed',
  'On an upright phone a card taller than the screen gets a little shorter, so its ⬇️ sits under it, never on its words (002c9f6). ' + FIXED_LATER, 'a probe of Settings, the Market and the Pet Shop on an upright iPhone after the fix: the arrow sits under the card.'),
 ('080', R('p4', 79, 97), 'the pose card', 'iPhone sideways', 'The ⬇️ arrow sat on the bottom-right corner of the "Jump" tile.', 2, 'fixed',
  'On a sideways phone the pose card fits without scrolling (three poses a row), so it has no arrow (9777d26).', 'pass 5 pose-card pictures.'),
 ('081', R('p4', 106, 113), 'the big map', 'PC', 'The ⬇️ arrow sat on the last row of the place list, over "Beach" and "Bus stop".', 2, 'fixed',
  'The list shows "more below" as a soft fade (9777d26).', 'pass 5 big-map pictures.'),
 ('082', R('p3', 52, 57, 58, 59, 86, 87, 89, 90, 92, 93, 96, 97, 99, 128, 130, 132, 134, 135, 139, 148, 149, 150, 152) + R('p4', 95, 96), 'cards on a phone', 'iPhone', 'A card cut HUD pieces in half: the corner map under its top edge, the round buttons poking above it, the joystick under its bottom edge.', 1, 'fixed',
  'On a phone a card that takes the screen hides the HUD pieces it would cut in half (2c0c488); tall cards start under the HUD row (5e94f9c); the pose card\'s top buttons step aside (9777d26).', 'pass 4 and 5 card pictures.'),
 ('083', R('p3', 53, 54, 55, 56) + R('p3b', 20, 21, 22, 23, 24, 31), 'party and holiday garlands', 'iPhone, PC', 'The garland string was a staircase of separate pieces and the flags hung 10 px below it, joined to nothing.', 1, 'fixed',
  'The flags hang from their string (2c0c488) and every piece of string runs point to point, one sagging line (50db62c).', 'pass 4 and 5 pictures of the party cards and the Flower Corner.'),
 ('084', R('p3', 60, 101), 'the pose card', 'iPhone', 'The photo bar behind the card showed as dark rims around its bottom edge.', 1, 'fixed',
  'The bar hides under the card (5e94f9c), and a rule that only looked at the card\'s class now also asks that the panel is open (2c0c488).', 'pass 4 pictures.'),
 ('085', R('p3', 62, 103, 138, 151) + R('p4', 80, 82, 98, 101), 'a photo shoot', 'iPhone', 'The joystick ring sat inside the photo frame, over the family\'s legs.', 2, 'fixed',
  'Upright: the frame sits above the joystick and the bar like a camera app (2c0c488). Sideways: the joystick moves to the screen\'s left edge while a shoot is on (50db62c).', 'pass 5 photo-shoot pictures.'),
 ('086', R('p3', 63, 104, 168) + R('p3b', 28), 'a photo shoot', 'every device', "The white aim dot sat on Leo's forehead.", 1, 'fixed',
  'No aim dot during a shoot (2c0c488).', 'pass 4 and 5 photo-shoot pictures (a pass-5 viewer saw it gone).'),
 ('087', R('p3', 65), 'the photo result', 'iPhone', 'The "+120 🪙" pop overlapped the 💬 and 📱 buttons.', 1, 'fixed',
  'The coin pop avoids the chips and buttons (50db62c).', 'pass 5 result pictures.'),
 ('088', R('p3', 66) + R('p3b', 1, 4, 6) + R('p5', 1, 3, 4, 13, 14), 'sun shadows', 'iPad', "Faint stripes and saw-tooth edges in the sun's shadows: on the fountain basin's side, under window sills and eaves, on the tree crowns at the Tree Park.", 1, 'open',
  "Not fixed in stage 3. The sun's shadow map is 2048 px over 60 m, chosen for the iPad; its edges are soft and a little saw-toothed and round surfaces almost edge-on to the sun show faint stripes. A sharper map would cost the iPad four times the memory, and a tighter one would cut the shadows off nearer to you.", '—'),
 ('089', R('p3', 69), 'the Flower Corner in October', 'iPhone', 'The purple path patches showed as broken purple dashes on the grass.', 1, 'fixed',
  'The spooky path stones are lifted off the grass (2c0c488).', 'pass 4 Flower Corner pictures.'),
 ('090', R('p3', 72, 73, 75, 109, 111) + R('p4', 56, 57, 73, 74) + R('p5', 16, 32, 33, 35, 43, 44, 45), 'the shop ceiling lamp', 'iPhone, iPad', 'Seen from below near the door the lamp showed as black wedges (its outline shell); without the outline (9777d26) it read as a faint, see-through smudge on the cream ceiling.', 2, 'fixed',
  'A pink shade with a darker rim on a short stem, still without an outline shell (fda1555). ' + FIXED_LATER, 'a probe of the Market on an upright iPhone after the fix: a solid pink lamp.'),
 ('091', R('p3', 115, 140, 153) + R('p3b', 33), "the phone: Rosie's chat", 'iPhone sideways, PC', 'Earlier messages and job cards scrolled up under the floating chat header and showed cut in half above it.', 2, 'fixed',
  'The phone header sits flush at the top of the screen (5e94f9c).', 'pass 4 phone pictures.'),
 ('092', R('p3', 125), 'the big map', 'iPhone sideways', 'The "Duck Pond" label ran over Finn\'s name tag.', 1, 'not a glitch',
  'A friend\'s tag on the map can pass under a place name for a moment as they walk; both stay readable.', '—'),
 ('093', R('p3', 141) + R('p4', 59), 'the big map', 'iPhone', 'The "👆 Tap a place…" bar lay over the bottom row of places (Cozy Park, Pet Shop, Football Field).', 1, 'fixed',
  'The map scrolls its bottom row up above the hint card (405e0ae).', 'pass 5 big-map pictures.'),
 ('094', R('p3', 145), 'the Pet Shop card', 'iPhone sideways', '"Mint dog house" wrapped its colour dot onto a line of its own, so its price sat lower than its neighbours\'.', 1, 'fixed',
  'A New-in tile\'s colour dot always sits under its name (5e94f9c).', 'pass 4 Pet Shop pictures.'),
 ('095', R('p3', 159, 160, 161, 162, 164), 'the party, dance and tutorial cards', 'PC', 'These cards stayed bright white in the dark theme while every other card went dark.', 1, 'fixed',
  'They follow the light/dark theme (2c0c488).', 'pass 4 dark-theme pictures.'),
 ('096', R('p3', 137) + R('p4', 81, 100) + ['p4:M-150'], 'a photo shoot', 'iPhone sideways', 'The "📸 Pose everyone…" hint sat in the middle of the frame over the heads and name tags (and on the − / + Zoom buttons).', 2, 'fixed',
  'The hint clears at the snap (5e94f9c), never sits on the photo bar (50db62c) and goes when a pose card opens (9777d26).', 'pass 5 pictures.'),
 ('097', R('p3', 154) + R('p3b', 34), 'the big map', 'PC', 'The pink "📍 Me" pill and the + button sat on a place and its name.', 2, 'fixed',
  "On wide screens the map's Me and zoom buttons are in the title row (5e94f9c).", 'pass 4 big-map pictures.'),
 ('098', R('p3', 170, 171), 'pumpkins in October', 'PC', 'No pumpkin at the Hair Salon door or at two houses\' doors, though the "should look like" line said "at every door".', 1, 'fixed',
  'The Hair Salon has its pumpkin (9777d26); the "should look like" line now says what was built: by every shop door and by every house sign on Friends Lane.', 'pass 5 pictures of the west road.'),
 ('099', R('p3', 172, 173), 'Santa', 'iPad', 'Santa stood side-on and never turned to you, so his face could not be seen while he talked.', 2, 'fixed',
  'Santa and the Easter Bunny turn to you when you come close (5e94f9c).', 'pass 4 and 5 Santa pictures.'),
 ('100', R('p3', 175), 'Santa by the tree', 'iPad', "Santa stood half inside the tree's bottom layer, a tree light on his beard.", 1, 'fixed',
  "Santa stands clear of the tree's lowest branches (2c0c488).", 'pass 4 pictures.'),
 ('101', R('p3', 176), 'the big oak by the Ideas Board', 'iPad', 'On New Year\'s Eve the big round tree behind the bus stop was summer green while every other tree was snowy.', 1, 'fixed',
  'Cause: the oak was built in an earlier run with fixed greens; the season colours of job 11 never reached it. It takes the season\'s tree colours now (149c405).', 'a probe on 31 Dec and on 20 Oct after the fix: pale in winter, orange in autumn.'),
 ('102', R('p3', 178), 'the school party', 'iPad', 'A yellow plate over the door poked through the red "School party today!" banner.', 2, 'fixed',
  'The banner hangs clear of the door (5e94f9c).', 'pass 5 school picture.'),
 ('103', R('p3', 179) + R('p4', 121), "a pet's party hat", 'iPad', "Waffles' party-hat pompom was drawn over his own name tag.", 1, 'not a glitch',
  'As G4-059: a hat right under a tag can cover a letter for a moment as the pet moves.', '—'),
 ('104', R('p3', 181), 'the spooky path', 'iPad', 'The path\'s little lamps were unlit black boxes and its stones near-black blots.', 2, 'fixed',
  'The lit glass sat inside the dark lamp box; the lamps show their light and the stones are lighter (2c0c488).', 'pass 4 and 5 Halloween pictures.'),
 ('105', R('p3', 183), 'the Clothes Shop in October', 'iPad', 'The note said "Costumes are here for October!" but the costumes came last, after 22 ordinary items.', 1, 'fixed',
  'In October the costumes are listed first (3620e54).', 'pass 4 and 5 costume pictures.'),
 ('106', R('p3b', 18), 'my house, floor 2', 'iPad', 'A big plain white disc on the floor looked like a giant blank plate.', 2, 'fixed',
  'A striped rug with a border upstairs (5e94f9c).', 'pass 4 floor-2 pictures.'),
 ('107', R('p3b', 19), 'the phone: quests', 'iPad', 'The text on the purple "🧩 Tricky" tag was about 7 px, dark on purple.', 1, 'fixed',
  'A bigger Tricky tag, white on purple (9777d26).', 'pass 5 quest pictures.'),
 # ---- pass 4 ----
 ('108', R('p4', 5, 23), 'the Pet Shop upstairs', 'iPad', 'The pen signs overlapped the windows: a curtain cut "Puppies" to "Puppie", a window covered most of "Bunnies".', 2, 'fixed',
  'The pen signs sit above the windows (50db62c).', 'pass 5 and 6 upstairs pictures.'),
 ('109', R('p4', 7, 8, 26, 28), 'the corner map', 'iPad', 'The pink "you" arrow was stuck on the map\'s left border and half cut off.', 1, 'fixed',
  'The corner map keeps its whole arrow inside the frame (9777d26).', 'pass 5 lane pictures.'),
 ('110', R('p4', 10, 114), 'the big map', 'iPad, PC', 'The corner map peeked out above and beside the big map panel.', 1, 'fixed',
  'The corner map steps aside while the big map is open (9777d26).', 'pass 5 big-map pictures.'),
 ('111', R('p4', 12), "the What's new book", 'iPad', 'The cover pictures were rough crops: a name tag cut to "ffles", HUD slivers.', 1, 'fixed',
  'All eleven pictures taken again with no HUD, messages or cut tags (2ea1029).', 'pass 5 book pictures.'),
 ('112', R('p4', 15, 34), 'pumpkin glows at night', 'iPad', "A pumpkin's orange glow stopped in a hard straight line on the pavement below the step.", 1, 'fixed',
  'A small glow and a soft pool on the ground (9777d26).', 'pass 5 night pictures.'),
 ('113', R('p4', 18, 19), 'the Tree Park', 'iPad', 'The yellow pointer over the next deck was in two pieces, the shaft and the head floating apart.', 1, 'fixed',
  'A spinning star marks the next deck (50db62c).', 'pass 5 Tree Park pictures.'),
 ('114', R('p4', 3, 20), "the Tree Park's finish deck", 'iPad', 'The "🏁 Finish" banner ran off the screen and the bell filled the middle.', 1, 'fixed',
  "The banner hangs behind the bell so it shows while you ring it (50db62c), and above the bell's roof, which covered its first letters (2ac45c7; N23 found the overlap). The camera spot was the photographer's.", 'N23 passes; a probe picture from the finish deck after 2ac45c7.'),
 ('115', R('p4', 24), 'the Pet Shop upstairs', 'iPad', "A big pale see-through slab (the hamsters' glass) washed out a corner of the picture.", 1, 'fixed',
  "The hamsters' glass is fainter (50db62c).", 'pass 5 upstairs pictures.'),
 ('116', R('p4', 25) + R('p5', 0)[:0], 'a tall house on Friends Lane', 'iPad', 'The six-floor house had no name tag on top.', 2, 'fixed',
  "Cause: the tags fade by the straight distance, and a six-floor house's tag hangs 24 m up, so from where the whole house shows it had faded; and the pointed front roof (50db62c) hid it from the lane. The tags now fade by the distance along the ground, and a tall house's tag hangs in front of its roof, at the same height (fda1555).", 'a probe from the lane after the fix: "🏠 Cozy Kid" on top of the purple six-floor house; N34 passes (the tag heights).'),
 ('117', R('p4', 40), 'Settings', 'iPhone upright', 'Settings had "Show me the tips" rows for three jobs but none for the photographer.', 1, 'fixed',
  "Settings has the photographer's tips (9777d26).", 'pass 5 settings pictures.'),
 ('118', R('p4', 42) + ['p4:M-136'], 'Halloween ghosts', 'iPhone, iPad', 'A ghost floated right at the camera as a big grey blob.', 1, 'fixed',
  'Ghosts and bats glide round the camera (50db62c) and keep 3 m from it (9777d26).', 'pass 5 pictures.'),
 ('119', R('p4', 47, 49, 66, 68), 'shop and school signs', 'iPhone upright', 'The notepad covered the start of a sign ("ozy Town School", "…ore").', 2, 'not a glitch',
  'Decided (section 9c): on an upright phone the fixed HUD can cover part of a sign while you walk; it stays where the thumbs and eyes expect it.', '—'),
 ('120', R('p4', 48, 50, 53, 54, 67, 69, 71, 72), 'name tags', 'iPhone upright', "A pet's round button or the action pill covered the end of a name tag, or a tag ran off the screen edge.", 1, 'not a glitch',
  'As G4-119: the fixed HUD and the screen edge can cut a tag for a moment.', '—'),
 ('121', R('p4', 55, 112), 'inside the Market', 'iPhone, PC', 'Faint zigzag stripes on the floor between the fruit counters and on their inner sides.', 1, 'fixed',
  "Indoor shadows have a bigger normal bias (50db62c).", 'pass 5 Market pictures: no viewer marked them again.'),
 ('122', R('p4', 58, 75), 'the Pet Shop', 'iPhone upright', 'A washed-out view: pale mint walls, near-white floor and white shelves ran together.', 1, 'fixed',
  'The Pet Shop is a little less pale (9777d26).', 'pass 5: one viewer still called the upright view mostly empty; the double-checker dropped it (the narrow upright view).'),
 ('123', R('p4', 77, 94), 'the house colour card', 'iPhone sideways', 'The 12 colour chips were about 34 px tall, smaller than a fingertip.', 1, 'fixed',
  'The chips are at least 44 px (50db62c).', 'pass 5 colour-card pictures.'),
 ('124', R('p4', 83), 'a photo shoot', 'iPhone sideways', 'The dashed frame sat right of the middle (187 px gap on the left, 35 px on the right).', 1, 'not a glitch',
  'Decided (section 9c): on a sideways touch screen the frame starts right of the joystick; a child turns to put the family in it.', '—'),
 ('125', R('p4', 86, 87, 88, 89, 104), 'town views', 'iPhone sideways', 'The joystick ring sat over the fountain, the gate, the pond.', 1, 'not a glitch',
  "The owner's joystick position on a sideways phone (300 px in, commit 0f5939f); only during a photo shoot it moves to the edge.", '—'),
 ('126', R('p4', 90), 'the toy phone', 'iPhone sideways', 'The phone screen stayed white and pastel in the dark theme.', 1, 'not a glitch',
  "Decided (section 9c): a phone's screen is lit; the cards around it go dark.", '—'),
 ('127', R('p4', 110, 115), 'the duck pond', 'PC', 'The white and the yellow duck were stuck into each other like one blob.', 2, 'fixed',
  'Ducks keep apart (50db62c), 80 cm, a duck with its head; at the pond\'s edge the other one moves (ceb35b2).', 'pass 5: the double-checker found the two ducks in line, not stuck (M-052 dropped); pass 6 pictures.'),
 ('128', R('p4', 111), 'the Tree Park gate', 'PC', 'Little flowers grew on the earth path just past the gate.', 1, 'fixed',
  'The gate path stays clear (9777d26).', 'pass 5 gate pictures.'),
 ('129', R('p4', 116), 'the Pet Shop card', 'PC', 'The line broke between 🛋️ and "Decorate."', 1, 'fixed',
  '"with 🛋️ Decorate." stays on one line (002c9f6).', 'pass 5 Pet Shop pictures.'),
 ('130', R('p4', 120), 'the holiday tree at night', 'iPad', "Lights too bright: Santa's face a yellow-white blob.", 1, 'fixed',
  "No Christmas glow sits on Santa's face (9777d26).", 'pass 5 night pictures.'),
 ('131', R('p4', 123), 'the Hair Salon', 'iPad', 'The "✂️ Nora sits down!" pop text ran into the salon\'s wall sign.', 1, 'not a glitch',
  'A pop text shows for a moment and floats away.', '—'),
 ('132', ['p4:M-127'], 'the clothes maker', 'iPad', 'The "Cat costume: it\'s yours!" message lay across the figure\'s chin and chest.', 2, 'fixed',
  "The clothes maker's message sits above your figure (9777d26).", 'kit pictures of N19.'),
 ('133', ['p4:M-128'], 'the spooky path', 'iPad', 'A soft monster popped up right in the camera\'s face.', 2, 'fixed',
  'The monsters pop up 2.3 m beside the path (9777d26).', 'kit pictures of N19.'),
 ('134', ['p4:M-129'], 'the Flower Corner at Easter', 'iPad', 'A big gold box-like shape hung in the sky next to the map.', 1, 'fixed',
  'It was a butterfly right at the lens (a retake at the same spot shows butterflies); butterflies and birds keep a little distance from the camera (9777d26).', 'a retake of the kit\'s spot on 10 Mar 2027.'),
 ('135', ['p4:M-135'], 'the phone: the photo booking chat', 'iPad', 'The header "Photo booki…" disappeared under the 🪙 chip.', 2, 'fixed',
  'The chat header says "Photos" (50db62c).', 'kit pictures of N25.'),
 ('136', ['p4:M-137', 'p4:M-138', 'p4:M-141'] + R('p5', 124, 125, 126, 127), 'friends who follow you', 'iPad', 'After you stop, one friend stood straight behind another (only the tag showed) and one came right up to the camera.', 2, 'fixed',
  'Pass 4: friends were made never to stand straight behind each other (50db62c), but that rule left them no good spots and N3 failed (0.75 m apart). Now a spot straight behind another friend only costs a little more, and the 1.2 m between friends comes first (2ac45c7). ' + FIXED_LATER, 'N3 passes again (1.42 m and 1.63 m apart); its pictures show all four in front.'),
 ('137', ['p4:M-147'], 'the dance-off score bar', 'iPad', 'The players\' names in the score bar were 7–8 px.', 1, 'fixed',
  'Bigger titles and "You" on the score bar (50db62c).', 'kit pictures of N39.'),
 ('138', ['p4:M-148', 'p4:M-149'], 'the dance result', 'iPad', "Mochi stood right at the lens under the run/jump buttons, its crown a black silhouette.", 2, 'fixed',
  'Pets wait out of a dance-off and its result card, and the view frames the dancers (50db62c, c012566).', 'kit pictures of N39: no pet at the lens.'),
 ('139', ['p4:M-152'], 'the photo result', 'iPhone sideways', 'The "+120 🪙" pop landed on the clock chip.', 1, 'fixed',
  'The coin pop avoids the chips (50db62c).', 'kit pictures of N25.'),
 ('140', ['p4:M-154', 'p4:M-155'] + R('p5', 133, 134, 135), 'a photo shoot', 'PC, iPhone sideways', 'A tree trunk stood in the middle of the frame and hid one of the family, a passing grandma stood in the group with her back turned, and the photo still got five stars.', 2, 'fixed',
  "Pass 4: the school-sign spot got no tree in the way (50db62c). Pass 5: the hedge spot at the Flower Corner moved 1.8 m east, out from behind the pavement tree (an audit of all nine backgrounds found no other in the way); a grandma between the camera and the family steps out of the shoot like any passer-by; someone hidden behind a tree, a post or another of the group costs a star (ceb35b2). " + FIXED_LATER, 'N25 passes with the new score (5 stars, nobody hidden); the background audit after the fix is clear on every spot.'),
 # ---- pass 5 ----
 ('141', R('p5', 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 72, 73, 74, 75, 76, 77, 78, 79, 80, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103), 'the bus stop at the park', 'iPhone sideways, PC', 'Behind the phone and every card the view was inside the parked Beach Bus: seats, windows, the yellow pole.', 2, 'fixed',
  "Cause: when you come into town while the bus waits at the stop (or it jumps ahead out of view), the bus is placed where the timetable says, and the push-out from its solid box only happened when you walked. Standing still in its spot, you stayed inside it. Now you step out on its door side, onto the pavement, whenever the bus stands on you (fda1555). " + FIXED_LATER, 'a probe on a bus day with the player in the bus\'s spot: moved to the pavement by the shelter, "Get on the bus" offered.'),
 ('142', R('p5', 5, 18), 'the Pet Shop upstairs', 'iPad', 'In the pens two animals were bunched into one blob (a kitten sticking out of another\'s back, the puppies piled up).', 1, 'fixed',
  'Pen-mates keep 85 cm apart, a kitten\'s length (it was 60 cm) (ceb35b2).', 'a probe upstairs after the fix: the closest two 0.85 m apart.'),
 ('143', R('p5', 6, 19), 'the stair plates', 'iPad', '"Downstairs" was drawn smaller than "Upstairs" on the plate next to it.', 1, 'fixed',
  'Both plates take the letter size of the longer word (ceb35b2).', 'pass 6 floor-2 pictures.'),
 ('144', R('p5', 7, 21, 27, 36), 'the phone: quests', 'every device', 'The Decorator quest said "Put a herb pots in your house".', 1, 'fixed',
  '"Put some herb pots in your house", and the same for flowers, building blocks, candles and drawers (fda1555).', 'pass 6 quest pictures.'),
 ('145', R('p5', 10, 11, 12), 'the food truck corner', 'iPad', "A tree's crown sat right on the truck's cab, as if it grew out of the truck.", 1, 'fixed',
  'The corner tree stands a metre further from the truck, 4.3 m away (960fd04).', 'pass 6 or 7 pictures of the stage.'),
 ('146', R('p5', 15, 106), 'inside the Market', 'iPad, PC', 'A big soft round shadow lay across the fruit counter with nothing in view casting it.', 1, 'not a glitch',
  'It is your own shadow: in first person you see only your legs and shoes, and the rest of you shows up as your shadow (since night 1); switching off the shadows of the meshes at the camera takes it away.', '—'),
 ('147', R('p5', 24), 'the duck pond at night', 'iPad', 'The pond water stayed bright blue while the grass and stones around it went dark.', 1, 'fixed',
  'The water glows less at night (ceb35b2).', 'pass 6 night pictures.'),
 ('148', R('p5', 31, 40), 'the pose card', 'iPhone upright', 'Mia and Zoe stuck out of the dashed frame and the card hid everything below their chins.', 1, 'not a glitch',
  "The photographer's camera stood too close for an upright phone; the pose card sits under the frame. A child steps back to fit everyone in the frame.", '—'),
 ('149', R('p5', 38), "the What's new book", 'iPhone upright', 'In the dark theme the inactive page dots were dark rings on the dark card, almost invisible.', 1, 'fixed',
  'They get a light ring in the dark theme (960fd04).', 'pass 7 book pictures.'),
 ('150', R('p5', 41, 42), 'the park fence in October', 'iPhone upright', 'The October garland hung at eye height right in front of the camera; huge pennants cut across the view.', 2, 'fixed',
  'Every garland hangs at least 2.4 m at its posts, so its flags stay above a child\'s eyes (it sagged to 1.55 m) (960fd04). The camera spot also stood against the stage\'s side; pass 6 turned it.', 'pass 7 pictures.'),
 ('151', R('p5', 51, 70), 'the photo result', 'iPhone sideways', 'The joystick ring and knob stuck out half cut by the result card.', 1, 'fixed',
  'The result card hides the joystick and the move buttons (ceb35b2).', 'pass 6 result pictures.'),
 ('152', R('p5', 67), 'the house colour card', 'iPhone sideways', '"Green" and "Mint" were the same pale mint, "Blue" and "Sky" almost the same.', 1, 'fixed',
  'Green is a leaf green and Sky a deeper sky blue (Blue and Mint stay: saved houses keep their colour) (ceb35b2).', 'pass 6 colour-card pictures.'),
 ('153', R('p5', 108), 'the Easter Bunny', 'iPad', "The Bunny's words sat over its face: only the top of its eyes showed.", 2, 'fixed',
  'What someone you talk to says sits up under the top row, not on their face (960fd04).', 'a probe of the Bunny talking after the fix: the words at the top, its face clear.'),
 ('154', R('p5', 110), 'the holiday tree', 'iPad', 'Light bulbs and their string hung in the air beside the tree and at its tip.', 1, 'fixed',
  'The 40 bulbs sit on the tree\'s three cones; a straight spiral hung them up to 30 cm off the branches (960fd04).', 'pass 7 December pictures.'),
 ('155', R('p5', 111, 113), 'the Flower Corner sign', 'iPad', "The board flickered at its ends: the posts' faces ran through the board and the sign.", 1, 'fixed',
  'The posts stand just behind the board (ceb35b2).', 'pass 6 night pictures; N23 passes.'),
 ('156', R('p5', 114), 'the Clothes Shop in October', 'iPad', 'A dark colour dot on a dark card could not be seen, so two "Special witch hat" cards looked the same.', 1, 'fixed',
  'Colour dots get a light ring in the dark theme (ceb35b2).', 'pass 6 dark pictures.'),
 ('157', R('p5', 115), 'the Hair Salon', 'iPad', 'The dye shelf ran behind the window curtain and over the window.', 2, 'fixed',
  'The shelf and its bottles moved 55 cm along the wall, clear of the curtain (ceb35b2).', 'pass 6 salon pictures.'),
 ('158', R('p5', 116, 117), 'the dance-off on two phones', 'iPhone', 'Upright: your dancer was half off the left edge. Sideways: "Perfect +15" was drawn across both dancers.', 2, 'fixed',
  'On an upright phone the view is 5.6 m back so both dancers fit; on a short sideways screen "Perfect" shows in the free top-left corner (the old rule left the centred top position in place) (960fd04).', 'pass 7 two-phone dance pictures.'),
 ('159', R('p5', 119), 'the dance result', 'iPhone sideways', "The white aim dot sat on the partner's eye.", 1, 'fixed',
  'No aim dot during a dance-off and its result (ceb35b2).', 'pass 6 or 7 dance pictures.'),
]
old = json.load(open(f'{S}/glitches.json', encoding='utf-8'))
out = [g for g in old if int(g['id'].split('-')[1]) < 64]
for suf, marks, place, device, what, bad, status, fix, check in G:
    real = [m for m in marks if m in M]
    miss = [m for m in marks if m not in M]
    if miss: print('missing marks', suf, miss)
    kit = []
    before = next((pic(m) for m in real if pic(m)), None)
    if not before and kit:
        kid = kit[0].split(':')[1]; km = json.load(open(f'{S}/stage3-dc4/merged.json'))
        before = next((x['path'] for x in km if x['id'] == kid), None)
    after = next((after_of(m) for m in real if after_of(m)), None)
    passes = sorted({PASS[m.split(':')[0]] for m in real} | ({'pass 4'} if kit else set()))
    lab = ', '.join(m.split(':')[1] + ' (' + PASS.get(m.split(':')[0], 'pass 4') + ')' for m in marks)
    out.append(dict(id='G4-' + suf, place=place, device=device, what=what + f" (viewer marks {lab})", bad=bad,
                    found_by='PHOTOVIEWER + DOUBLE-CHECKER (' + ', '.join(passes) + ')', fix=fix, before=before, after=after, status=status, check=check))
json.dump(out, open(f'{S}/glitches.json', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
n = {}
for g in out: n[g['status']] = n.get(g['status'], 0) + 1
print(len(out), 'entries', n, '; new entries without a before picture:', [g['id'] for g in out if int(g['id'][3:]) >= 64 and not g['before']],
      '; without an after picture:', [g['id'] for g in out if int(g['id'][3:]) >= 64 and not g['after']])
