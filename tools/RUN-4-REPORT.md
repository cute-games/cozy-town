# Cozy Town: RUN 4 report

Branches `claude/run-4-s1` (stage 1), `claude/run-4-s2` (stage 2, from s1), `claude/run-4-s3` (stage 3, from s2); one commit per job, pushed at once. Starting file: index.html md5 `709bf763d51be0160c118e2f9249f9f6` (1,355,180 bytes, night 3, COZY_BUILD 2026101701), kept as `tools/prerun4-index.html`. Check kit: version 6 (`cozy-check-v6.zip`, made from 5.1: a stage "run4" with lines N15 to N41, every line starts as FAIL; the one clock in the test pages; the B1 one-clock rule; N1/N6/N10/N14 rewritten to the owner's 17 Oct design).

## 0. Progress
| Job | Done | Pushed | Checked |
|---|---|---|---|
| Setup: kit v6, fixtures, backup, counts before | kit v6 run4 stage + fixtures done; counts before: see 1 | with job 1 | A3/E1 pass |
| 1. One clock for everyone | yes | yes | N15, N16, N10 (rewritten), B1 pass |
| 2. The same game for everyone | yes | yes | N17, N18 pass |
| 3. Halloween, all of October | yes | yes | N1 (rewritten) pass; N19 passes once job 4 frees the corner (see job 4) |
| 4. The holiday spot at the Flower Corner | yes | yes | N19 pass (with the gate); gate smoke test pass |
| 5. Signs and text | yes | yes | N23 pass (66 signs in 15 places, worst off-centre 0.6%, nothing crossed or coplanar) |
| 6. Look fixes (truck, clouds, trees, leaves) | yes | yes | N30, N31, N32 pass |
| 7. Map | yes | yes | N26 pass (5 screen sizes) |
| 8. Grandmas | yes | yes | N24 pass; N6 (rewritten) pass |
| 9. Small things and the stage-1 book | yes | yes | N27, N29, N35, N41 pass; book stage W1/W2 pass (7 pages) |

(filled in after every job; if the session restarts: undo any half-done job, carry on from the next one)

## 1. Every change, old → new

### Job 1: One clock for everyone (items 15, 2; the owner's decision 17 Oct)
- Old: each device had its own game clock (saved in the save, paused when nobody played), friends pulled each other's clocks forward (mpClock / clockFrom / clockJump, the 30-day rule), the night skipped to 7:00 when everyone was in bed (zzSkip), and "Day N" showed in the clock chip, the phone, the calendar, messages and the morning line.
- New: game time is ONE formula of the real time: `clockAt(realMs())`, a game day = 15 real minutes at the old speed (7:00–21:00 in 600 s, 21:00–7:00 in 300 s), days counted from 1 Jan 2026 UTC. `realMs()` = the device clock + an offset from the web server's Date header, read whenever the update check fetches index.html (`clockServer`; the Claude version has none). The frame loop only reads the clock (`clockSync`); at midnight `newDay()` runs once (never a loop over skipped days). The day number is never shown: the chip says "9:40 Wed", the phone "Wednesday", the calendar app a week of weekday names, messages "Wed · 9:40", the Move-my-game cards drop the day. An old save jumps once at load (`clockLoad`): plants watered on a day that passed finish growing (`dayJump`), the day's quests are drawn fresh, daily counters reset, the Pet Show week and the bus timetable follow the shared day; nothing else in the save changes (B1 rule in the kit). Load time of the day-58 save: 138 ms (the designer card's theme photo is now drawn right after the load, not inside it: it took 7 s on a chip without a GPU).
- Beds: from 21:00 you lie down and a soft sleep screen shows 💤, "23:40 · Wed", "Sleeping until 7:00 🌙" and a 48 px "🌅 Wake up" button; at 7:00 "Good morning! It's Wed ☀️". No skip; the "😴 2 of 3 in bed" card and the phone ring are gone. The away timer ("Still there?") does not count while you sleep.
- The Welcome Bus (free, both ways) comes on a new player's first day on the one clock: from the next 10 minutes after Rosie's welcome for 4 game hours (from 8:00 if early; the next morning 8:00–12:00 if it is 17:00 or later), saved as `wb:[day, comes, leaves]`.
- Presence no longer carries `ck` (old versions keep their own clocks and see new players normally).
- Item 2 (rain under a blue sky), the root cause: the old sky only went 60–70% grey in rain (#74a1cb at noon: still blue) and the rain lines started in the first minutes of a weather change while the sky was still blue (the fade mixed both at once). New: WX_SKY palettes (cloudy, rain, snow; dark grey at night); the sky is fully grey after the first 40% of a change (smoothstep), rain and snow only fall once the mix is past 30%, the sun sprite hides in grey weather. Proved at 8:00, 12:00, 18:00 and 23:00 (N16) and through a real sunny→rain change minute by minute.
- The title screen's sky follows the real time of day too.

### Job 2: The same game for everyone (items 27, 26, 25)
- Updates (item 27): a newer file found while playing is now taken by itself at the next calm moment (`updCalm`: never during a card, a scene, a class, the Pet Show, the claw machine, the bus, a photo shoot, a dance round, a scare on the spooky path, typing, in bed, decorating, on the stairs or in the character maker). A "✨ Updating Cozy Town… your game is saved 💾" note shows first (1.4 s), then the game saves and reloads. The loop guard stays (at most once per version per session; a version already tried only shows the button). The title keeps its old behaviour.
- Old-version players: presence now carries `v` (the version stamp). A friend with none or a smaller one shows "⏳ older version" after the name on the name tag and in the 👫 Friends list. Nothing else changes for them.
- Item 26 (a kitchen in the middle of the room on a friend's PC), the root cause: the visitor guessed the room size from the furniture spots: in a big house any piece within 70 cm of a wall (|x| > 5.3 or |z| > 4.3, e.g. a kitchen flush to the back wall at z −4.65) made the layout look like an old 18x14 room, so the visitor drew the old big room around a 12x10 layout and the kitchen stood 2 m from the wall. Now the layout says its room size (`hm.W`, `hm.D`), spots are sent to the centimetre (they were rounded to 10 cm), and only a layout that says no size (an old version) is guessed at. Old versions ignore the new fields.
- Item 25 (a window across the view on the stairs), the root cause: the west-wall window sat at z 0, exactly in the stair doorway of the big house (home and visit, downstairs and upstairs), so it hung across the view on the stairs; houses without stairs and old 18x14 layouts (windows at z −3.2 / 2.6) never had it, which is why only some players saw it. With stairs the west windows now sit at z ±3 (home, upstairs, visit). Proved by looking along the stair slope from the bottom, the middle and the top on both floors: nothing nearer than 3.9 m.
- Gardens: what you planted rides along in presence (`gd`: spot, seed, stage); friends see your soil and crops on your Friends Lane lot (old versions send and show nothing). The seed spots live in one list (`YARD_PLOTS`) for job 10.
- Item 27, everything others can see and where it comes from: time and weather (the one clock), holiday pieces and ghosts (built from fixed lists and seeded draws), trash spots (a seeded draw of the day), houses (big or not, from presence; floors and colour come with job 10), furniture (presence `hm`, now with the room size), gardens (presence `gd`), sitting, bed, jumps, pets and their outfits (presence), clothes and costumes (presence `lk`; costumes with job 3), name and version (presence). Local scenery that nobody shares and that is not the same on two devices: the townspeople walkers, cars, ducks, birds and butterflies (they wander on each device). Grandmas: the same places for everyone from job 8.

### Job 3: Halloween, all of October (items 1, 4 October part, 13, 31)
- Window: 1 to 31 October (was 17 Oct to 1 Nov). Everything night 3 built for Halloween stays (pumpkins, garlands, cobwebs, bats, the purple night sky and closer fog).
- Costumes (item 1): the Clothes Shop sells a 🐈 cat, 🐕 dog, 👻 ghost and 🦖 dinosaur costume in October (160–180 🪙, like the dearer clothes). A costume is a hooded onesie over your clothes (the face stays open) with ears, a tail, spikes or a ghostly hem; you wear it at the 🪞 mirror with one tap on the "Costume" row and take it off with the same tap. Saved in `look.co`, sent in presence (`lk.co`); old versions drop it and show the clothes. After October the shop stops selling them; what you bought stays in your wardrobe and can be worn.
- The spooky path moves to the Flower Corner: a winding purple-disc trail of 20.8 m (the park's was 13.6 m, so +53%) from the gate (x −17) past the bench, the little fountain and the mounds, with 5 purple lamps; its "👻 Spooky path" and "Open after 18:00 🌙" signs stand on two posts with a board each (no post crosses the words). The park's west-side path and signs are gone (an agreed removal).
- Scares: 6 spots, 5 kinds, never gory: a ghost, a skeleton, a zombie (a green townsperson with its arms out), a bat swarm (7 little bats) and a pumpkin head on a dark cloak. When one pops up you stop for a second (`P.freeze`), turn smoothly to face it (within 0.01 rad in 0.7 s), the view shakes a little (`SHAKE`) and a soft short sound plays (`SFX.spook(kind)`: a boo, a rattle, a low moan, a flutter, a woo; quiet, only with sound on). Each spot once per night per player (`S.spook`), never in jobs, class, scenes, sleep, the bus or the Pet Show (`SPOOK.ok`).
- Ghosts (item 31): 56 little friendly ghosts in one batch float over the pavements (every fourth walkers' path, so never inside a building), the park, Friends Lane and the Flower Corner (the park used to have 4).
- Item 13 (floating decorations), the root causes and the fixes: pumpkins hovered 2.3 cm (their sphere sat at y 0.25 with a squashed radius of 0.227: now 0.226 → on the ground); the garlands by the Flower Corner and the park hung in the air between nothing (now every garland has two thin posts of its own); the school's holiday door spot was 1.1 m in front of the school's wall (now on the wall, z −59); Easter eggs and the bunnies sit on the ground or on the flower beds and mounds they stand on (`supportAt`). Every piece writes down its bottom and its support (`HOL.pieces`), so the check can measure every Halloween, Christmas and Easter piece: gap under 2 cm, hanging pieces within 0.6 m of a post or a wall.
- Should look like (BUILDER): the Flower Corner in October: a purple-lit winding path through the flower garden with 5 little lamps, two signs on posts by the gate, and now and then a soft monster popping up beside the path at night; the town in October: little white ghosts drifting over the pavements, the park, the lane and the corner, pumpkins on the ground at every door, garlands on their posts.

### Job 4: The holiday spot at the Flower Corner (item 4, the spot itself)
- Old: the whole corner block was one solid collider ("nobody stands inside"); the fence had no gate.
- New: the low fence has a 1.8 m gate at x −17 (where the stepping stones start). `holCheck` opens it in a holiday month (swung inwards, its collider removed) and closes it in other months (`fcGate`). Inside, every hedge, the tree, the bench (which now has two seats you can reach), the little fountain, the five mounds, the two bushes, the sign posts and the path lamps are solid on their own. Smoke test on 20 Oct: through the gate you reach z −9.5; the fence stops you at −6.6; the tree, bench, fountain and hedge stop you. On 20 Nov the gate stops you at −6.6.
- Standing in the corner is not standing in the old town yard (the same spot in town): a save made by run 4 says whether its spot was remapped from the Friends Lane yard (`S.yq`; older saves without it keep the old rule), and only an old-version friend (no `v` in presence) is remapped from the old yard to their lot; a new-version friend in the corner shows in the corner.
- Map: the corner's badge shows 🎃 "Spooky path" in October (🎄, 🐰, 💗 in the other holiday months from job 11) and its tap says the gate is open; otherwise 🌸 "Flower Corner".
- Walkers: no townsperson path enters the corner, so nothing changes for them.
- Should look like (BUILDER): from the north road in a holiday month: the white fence with an open gate in the middle, the stepping stones leading in, the "🌸 Flower Corner" sign left of the gate and (October) the two spooky signs right of it; in other months the same garden with the gate closed. Pictures: tools/pictures-4/after-flower-corner-gate-open-october-night.png, after-flower-corner-spooky-path.png, after-flower-corner-gate-closed-november.png.

### Job 5: Signs and text (item 7)
- Old: `signPlane` placed its text with measureText (centre-aligned) and only shrank the font while the measured width was wider than the sign; a colour emoji (iPad) draws wider than it measures, so "🏖 To the beach" and "🏰 Knights & castles" slid off centre or past the edge, and plates (apartment doors) and labels (name tags, bubbles) had the same weak spot. The food truck's sign stood in the awning's plane (the awning's inner edge ran through the sign's top, the lamp in front of it); the Pet Show signs were flush with the stage's back wall (z-fighting) and the Halloween garland's pendants hung over the sign's middle; the salon's two hairstyle posters had their left end behind the window curtain's top; the shop signs on buildings were 1 cm in front of their board, the school's "Fun facts" board 1 cm, the claw machine's price sign 6 mm, the Ideas Board's header 2 mm.
- New: `inkOf`/`inkBox`: every sign, plate and label draws its text once on a scratch canvas and measures the pixels it really covers; a sign scales its font so the ink fits inside a 6% margin and puts the ink's middle on the sign's middle, then looks once more at the drawn sign and centres by the pixels that stand out against the sign's colour (the steam of ☕ is nearly white on a white sign). Food truck: sign on a board on the roof's edge above the awning, the lamp under the awning's end. Pet Show: both signs 2 cm in front of the wall, the stage garland hangs from the post tops (3.9 m, pendants above the sign among the pennants). Salon posters: 2.8 m wide, moved 65 cm along the wall, clear of the curtain. Building signs 2 cm in front of their board; "Fun facts" 2 cm; claw price 2 cm; Ideas Board 1.6 cm.
- Test: N23 (66 signs in 15 places; worst off-centre 0.6%, limit 3%; nothing crossed or coplanar; with measureText bent 30% wider and 35% narrower every sign is still centred within 0.6% and inside). The first N23 run also found a bug in the test itself: a ray through a sign's own diagonal hits both its triangles, which it counted as "coplanar with something"; the test now ignores the sign's own second hit.
- Should look like (BUILDER): every sign's text sits in the middle of its board with air all around. The Food truck sign stands on the truck's roof edge above the striped awning, the little lamp at the awning's far end. The Pet Show sign is on the stage's back wall between the red pillars with "Every Saturday!" under it; in October the garland hangs high by the post tops. In the salon the two hairstyle posters hang on the east wall right of the window, clear of the curtain. Picture: tools/pictures-4/after-pet-show-sign-october.png.

### Job 6: Look fixes (items 14, 16, 17, 18)
- Food truck (one truck in the game, the one by the Pet Show park corner). Old: its windscreen's front face was flush with the cab's front (z-fighting: "they flicker"), the headlights shared the cab's side face and sat inside the windscreen, the wheel hubs were 1 cm proud of the tyres, each awning slat had its own outline (dark seams and specks), and the whole truck stood over the park's second flower bed: the counter and awning hung above the bed's flowers ("mixed into other shapes"). New: windscreen 2 cm proud of the cab, headlights over the bumper inside the cab's width, hubs 2 cm proud, six slats with one outline around the whole awning, the roof sign board taller and the sign higher (3.1 m) so the awning never hides it from a low viewpoint; the truck moved 1.7 m west (TRUCK x −34.2) so nothing but its own parts stands in its area, and the park tree that stood there (−36, 12.5) moved to the fence (−37, 10.2) with its bird perch. Mr. Patty, the counter spot and the collider move with it. The flower beds no longer put two flowers inside each other (20 cm apart at least). Test N32 measures every pair of same-facing surfaces in the truck's area: 0 within 1 cm (the live truck had 34); the sign centred 0.3%, nothing crosses it, the burger drawn.
- Clouds. Old: toon-shaded spheres with a thick dark purple outline hull ("grey rocks"). New: a cloud shader of their own, a soft top-to-bottom shade (white tops, blue-grey undersides by day; grey in grey weather; a gently lit blue-grey at night), no outline, no light-dependent hard faces; updSky sets the two colours every frame. Test N30: 22 cloud meshes all on the cloud material, 0 outline hulls, 0.0% dark pixels in the day sky band, day/grey/night colours in range.
- Trees by buildings. Checked every round tree (219) and pine (57) crown sphere against every building's wall box (25 buildings, recorded from the builder in the test copy): none inside a wall; the closest is the owner's corner tree at the apartments (34.9, −30.2), 21 cm from the wall (it stays: the plan allows no removals beyond the four). The "white smear" on that wall was the shadow map: around noon the sun runs almost along the east and west walls, and the shadow test flipped texel by texel, drawing pale diagonal streaks. Two fixes: (1) the toon materials' shadow test blends to a geometric answer within 7° of edge-on (facing the sun = lit, facing away = shadowed), pasted in through onBeforeCompile; (2) the sun's normal bias rises from .09 to .34 while the sun is within ±56 game-minutes of running along the walls (the sun is high then, so shadows barely move). Test N31 measures the wall's pixel steps at 9:00, 11:30, 12:00, 12:30, 15:00, 17:30: all clean (worst mean step .38 on the shadow side at 12:30, against .92 on the streaked wall before).
- Orange specks. They were the autumn leaf particles: a 28 m box around the camera reaching 13 m above your head, drawn as little diamonds, so they floated in the night sky. New: 90 leaves, each dealt to one of the 12 nearest round trees (dealt again once a second as you walk; a leaf keeps its tree while it is near, so none jumps mid-fall), starting inside the crown (3.05 m × the tree's size at most) and tumbling to the ground; a pointed-oval leaf shape with a midrib; none at the beach or anywhere without a round tree within 26 m; none outside autumn. Test N30: 90 of 90 dealt to 12 trees, highest start 3.05 m, farthest tree 19 m, invisible at the beach and in winter.
- Should look like (BUILDER): the food truck stands west of the park's second flower bed with a metre of grass between, the striped awning in one piece, the red "🍔 Food truck" sign on top of the roof above the awning, headlights above the bumper; clouds are soft white puffs with a faint blue-grey underside (blue-grey at night, grey in rain); on autumn days small orange and yellow leaves tumble down from the tree crowns around you, never above them; the apartment block's east wall at noon is flat light blue with the tree's soft shadow and no streaks. Pictures: tools/pictures-4/after-food-truck.png, after-soft-clouds-day.png, after-soft-clouds-night.png, after-leaves-from-the-crowns.png, before-apartment-wall-noon-streaks.png, after-apartment-wall-noon.png.
- Decided alone: the truck moved rather than the flower bed (the four beds sit symmetrically around the fountain and the watering job uses them); the corner tree moved 3 m to the fence rather than being removed.

### Job 7: Map (item 10)
- Which map players lose, and when: the small corner map lives inside the job box, and the job box was hidden whenever there was no job (so a player without a job never had the corner map); worse, the pizza job's every-frame tick hid the whole box for everyone whose job was not "delivery", so the hairstylist and anyone between jobs lost it too, and the teacher's and hairstylist's ticks never drew it at all: with those jobs the corner map was a plain green circle ("the whole map was only green"). The corner map was also only redrawn 14 times a second and only inside the delivery and designer ticks, so the facing arrow lagged or froze when you turned. The 📱 Map was never lost by itself, but one slip inside its painter would have left it a flat colour with no way out.
- New: the job box shows for everyone in town (the job text only with a job; indoors and at the beach it hides as before: town only). A new `miniTick` runs every frame from the job tick for everyone and redraws the corner map the very frame you move or turn (and 14 times a second otherwise, for the pulsing job dot); the pizza tick no longer hides the box. Without a job, tapping the corner map opens the 📱 Map (with a job it still picks the dot colour; the 🎨 badge hides without a job). The map painters are wrapped so a slip in one layer can never leave either map one flat colour.
- Test N26 on iPad landscape, iPhone upright and sideways, PC 1366 and an Android tablet: without a job the corner map is shown and drawn (110–228 colours), the job text hidden; five turns in a row each redraw the map that frame with rotate(−yaw) and pink arrow pixels at your spot; with the teacher, hairstylist, delivery and designer jobs the box shows text and a drawn map; hidden indoors, back in town; the 📱 Map draws 198–356 colours at every size.
- Should look like (BUILDER): in town, with or without a job, the round corner map (the night-2 design: green blocks, lilac roads, the little buildings) sits top-left under the chips, with a pink arrow that swings as you turn; without a job there is no job text under it and tapping it opens the big 📱 Map. Pictures: tools/pictures-4/after-corner-map-no-job-ipad.png, after-corner-map-no-job-iphone.png, after-big-map-iphone.png.
- Decided alone: without a job the corner map's tap opens the big map (the dot colour means nothing without a job).

### Job 8: Grandmas (items 8, 20)
- Old: twelve grandmas sat in pairs on six benches by the town houses (two baked parts each), chatting in bubbles; "Say hi" at each bench. Their seats were taken while they sat.
- New: the twelve are gone; the six benches stay as ordinary benches with two seats each (removal 1 of the 4 allowed). Three grandmas (the first three looks of the twelve) walk round town with the one clock: the real UTC day is cut into 80-second turns, and a seeded plan of the real date gives each grandma a place for every turn: 19 stops (a step off a townspeople's path node in front of the school, each shop, the fire station, the salon, the park, the Flower Corner gate, the bus stop, the beach gate, the field, the lake) and the duck-pond bench, where two of them sit together about one turn in four, toss crumbs every 6 s (the ducks of the little pond come to them) and chat about ducks and life; a stop is never more than 70 m of walking from the last (85 m to the pond), no two at the same shop. Between turns they walk the paths at 1.15 m/s (face along the way, then towards the place), talk about where they stand in bubbles every 5.5 s (the pond pair take turns), nod when greeted; "Say hi" gets one of the ten kind lines, never the same twice in a row. The pond bench's seats count as taken while a grandma sits on them. They are walkers for the townspeople (given way to), pedestrians for the cars and the bus. Out 9:00 to 18:00 in dry weather as before; gone (and the bench free) at night and in rain or snow. Nothing is saved or sent: position is a pure function of the shared clock, so every device shows them in the same spot.
- Tests: N24 (3 grandmas; the 6 house benches never held; two devices with clocks 1 s apart agree on every grandma's place at 8 moments within 1.3 m; a turn with the pair sitting on the two seats, ducks fed within 8 s; a 20 m+ walk at 1.15 m/s, standing at the place at 72 s with a bubble; Say hi 4 times never repeats). N6 rewritten (old: "out in dry daytime; inside in rain, snow and at night; their bench is full while they sit" → new: "the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit"), never weaker.
- Should look like (BUILDER): three little grandmas with grey buns and cardigans strolling the pavements, one stopping in front of a shop window with a speech bubble about it; some turns two of them side by side on the bench by the duck pond, crumbs flying, the ducks paddling over. Pictures: tools/pictures-4/after-grandmas-pond.png, after-grandma-at-a-place.png.
- Decided alone: 80-second turns and the real UTC day as the plan's anchor (the plan restarts at midnight UTC when nobody sees it); the three looks are the first three of the old twelve; the pond pair is chosen by the plan, the third grandma goes elsewhere.

### Job 9: Small things (items 3, 11, 24, 19) and the stage-1 book
- Pond (item 3). Old: a wooden arched bridge over the duck pond with a walk strip through the water, four post colliders, hand rails, its own "Feed the ducks" spot, and the pond's rim stones kept clear of it. New: the bridge is gone (removal 2 of the 4 allowed): the pond is solid water all round (walking at it from four sides stops 2.5 m from its middle, the water's edge is 1.45 m), the 14 rim stones go all the way round, the two ducks stay with their feeding spot by the bench; `brY`/`brAt` stay as functions that return 0 (friends' and pets' heights used them). Test N29.
- Trash (item 11). Old: three looks (a white ball, a coloured tube, two yellow sticks). New: four looks, picked by the spot's number (removal 3 of 4, the old looks): a soda can (a coloured tin on its side with a grey lid), crumpled paper (four off-white lumps), a banana peel (a stub with three yellow strips) and a coffee cup (white cup, brown band, dark lid); each piece carries its kind. Picking up works as before (+3 coins, remembered for the day, the quests and tasks count). Test N27: over 8 days all four kinds show; 28 spots, 10 a day.
- Notepad switch (item 24). New: ⚙️ Settings → "✏️ Notepad": On/Off (default On, saved with the other settings, 52 px tall). Off hides the notepad, On brings it back; the notes live in their own storage and are untouched. The designer card still takes the notepad's place while it shows, and the notepad returns after it. Test N35.
- Bus (item 19). No change by design; proved with the one clock (N41): every week has exactly 3 bus days, two devices agree on every bus day and hour, and the park-stop pill names the weekday of the next bus on a morning without one.
- What's new book (stage 1): 7 pages (cover with four pictures and the credit line as it is; One clock; Halloween all October; Three grandmas; Your map; Look around; Small things), 1 to 3 short kid lines each, 11 new 400×300 webp pictures (135 KB in all, taken from the new game). The night-3 book is kept in tools/books/night-3-pages.js with its 13 pictures in tools/books/night-3/. The kit's book stage now reads the page count from the game (it was fixed at 9).
- Should look like (BUILDER): the duck pond is a round blue pool ringed by grey stones with two ducks and the bench beside it, no bridge; on the pavements small cans, paper balls, peels and cups with a ✨ above them; ⚙️ Settings shows "✏️ Notepad  [✏️ On] [↩️ Last page]"; the title's "What's new" opens a 7-page book that starts with a four-picture cover. Pictures: tools/pictures-4/after-pond-no-bridge.png, after-pond-ducks.png, after-trash-soda-can.png, after-trash-banana-peel.png, after-notepad-switch-off.png, and the book pages in the check's shots.
- Decided alone: the bridge's feeding spot went with it (the bench's spot stays); the Notepad switch sits in the same Settings row as "↩️ Last page".

## 2. Check output per job, exactly as printed

### Job 1 (first run: B1 showed two kit gaps, both clock stamps: `home.old.t` is the moment this load shrank an old big house, and a pet's happiness drifts a little per frame like hunger; N15 showed the designer photo's 7 s inside the load, the test's own clocks drifting apart (one page's stepped time had run ahead), and that the day-58 save has no bed)
```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 59 s]
    PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 728 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 26 areas, 1426 pieces, 1167048 triangles in total | for information, seen from 5 spots: city 214 draws; home 34 draws; market 44 draws; cafe 52 draws; school 44 draws
[stage saves: running]
[stage saves: done in 404 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none);
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage night3: running]
    PASS | N10 | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #6e7a8b, sun 0.28; snow: flakes True (indoors False), ground #e3f0ea; sunny: sky #4fb4ff, sun 0.56, no rain True; cloudy: 
[stage night3: done in 68 s]
    PASS | N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #6e7a8b, sun 0.28; sno
[stage run4: running]
    FAIL | N15 | the code writes a day number in 0 places; the day-58 save loaded in 7215 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 54 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, skills 
    PASS | N16 | cloudy 8:00 #9ba7b5/#d3dae2; cloudy 12:00 #9ba7b5/#d3dae2; cloudy 18:00 #9ba7b5/#d3dae2; cloudy 23:00 #181a28/#2b2f41; rain 8:00 #6e7a8b/#a9b2be; rain 12:00 #6e7a8b/#a9b2be; rain 18:00 #6e7a8b/#a9b2be; rain 23:00 #181b28/#2b2f42; snow 8:00 #aab4c1/#e4e9ef; snow 12:00 #aab4c1/#e4e9ef; snow 18:00 #aab
[stage run4: done in 42 s]
    FAIL | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 7215 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 54 ms and jumped to the same day: True; after 
    PASS | N16 Rain sky: in rain, snow and cloudy weather the sky top and bottom are grey, never bright blue, at 8:00, 12:00, 18:00 and 23:00 | cloudy 8:00 #9ba7b5/#d3dae2; cloudy 12:00 #9ba7b5/#d3dae2; cloudy 18:00 #9ba7b5/#d3dae2; cloudy 23:00 #181a28/#2b2f41; rain 8:00 #6e7a8b/#a9b2be; rain 12:00 #6e7a8b/#a9b2be; rain 18:00 #6e7a8b/#a9b2be
```

### Job 1 (after the fixes: the saves stage and N15 again)
```
[stage files: running]
[stage files: done in 0 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 55 s]
    PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 728 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 26 areas, 1426 pieces, 1167048 triangles in total | for information, seen from 5 spots: city 176 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 395 s]
    PASS | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none);
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage run4: running]
    PASS | N15 | the code writes a day number in 0 places; the day-58 save loaded in 138 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 68 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, skills k
[stage run4: done in 29 s]
    PASS | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 138 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 68 ms and jumped to the same day: True; after t
```

### Job 2 (first run: N18 failed twice in the test itself: the host's own lot has no garden key to compare, and the stair rays were shot horizontally at eye height, so they hit the rising steps)
```
[stage files: running]
[stage files: done in 0 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 58 s]
    PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 728 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 26 areas, 1423 pieces, 1166656 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 14 draws; cafe 30 draws; school 44 draws
[stage run4: running]
    PASS | N17 | a newer file found while the phone was open: update started False (toast ''); during a scene: started False; calm: note '✨ Updating Cozy Town… your game is' then reload after 1800 ms; the page now runs version 2026101702 (title True, says '✨ Cozy Town is updated!'); the save made first has coins 777
    FAIL | N18 | iPad and PC: time 14:15 / 14:15, Wednesday / Wednesday, weather sunny / sunny, holiday halloween with 49 / 49 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, garden) same False, grandmas same True; B visits A (ok/ok/ok, let in True): in visit, room 12x10 (host 
[stage run4: done in 60 s]
    PASS | N17 Updates: a newer file appears while playing -> the game saves and reloads by itself at the next calm moment, never inside a job, scene, class, show, bus ride, shoot, dance round or typing; never twice for one version; an older-version player shows "⏳ older version" | a newer file found while the phone was open: update started False (toast ''); during a scene: started False; calm: note '✨ Updating Cozy Town… your game is' then reload after 1800 ms; the page now run
    FAIL | N18 Same for everyone: an iPad-size player and a PC-size player see the same time, weather, every house's floors and colour, every furniture piece (x, z, turn, floor) on visits, gardens, holiday pieces, ghosts, trash, grandmas; on every house's stairs no wall or window crosses the view | iPad and PC: time 14:15 / 14:15, Wednesday / Wednesday, weather sunny / sunny, holiday halloween with 49 / 49 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, gar
```

### Job 2 (N18 after fixing the test's rays: along the stair slope, away from and back towards the doorway)
```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage run4: running]
    FAIL | N18 | iPad and PC: time 14:15 / 14:15, Wednesday / Wednesday, weather sunny / sunny, holiday halloween with 49 / 49 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, garden) same True, grandmas same True; B visits A (ok/ok/ok, let in True): in visit, room 12x10 (host 1
[stage run4: done in 23 s]
    FAIL | N18 Same for everyone: an iPad-size player and a PC-size player see the same time, weather, every house's floors and colour, every furniture piece (x, z, turn, floor) on visits, gardens, holiday pieces, ghosts, trash, grandmas; on every house's stairs no wall or window crosses the view | iPad and PC: time 14:15 / 14:15, Wednesday / Wednesday, weather sunny / sunny, holiday halloween with 49 / 49 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, gar
```
```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage run4: running]
    PASS | N18 | iPad and PC: time 14:15 / 14:15, Wednesday / Wednesday, weather sunny / sunny, holiday halloween with 49 / 49 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, garden) same True, grandmas same True; B visits A (ok/ok/ok, let in True): in visit, room 12x10 (host 1
[stage run4: done in 29 s]
    PASS | N18 Same for everyone: an iPad-size player and a PC-size player see the same time, weather, every house's floors and colour, every furniture piece (x, z, turn, floor) on visits, gardens, holiday pieces, ghosts, trash, grandmas; on every house's stairs no wall or window crosses the view | iPad and PC: time 14:15 / 14:15, Wednesday / Wednesday, weather sunny / sunny, holiday halloween with 49 / 49 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, gar
```

### Job 3 (N1 rewritten to October passes; N19: the only remaining marks were the 4 ghosts at the Flower Corner, which the corner's whole-block collider counted as 'inside a building' until job 4 replaces it, and the school wreath, fixed right after; the skeleton's '4 sounds with sound off' was the test counting calls instead of played tones)
```
[stage files: running]
[stage files: done in 0 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 60 s]
    PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 732 after; grew: {"clothes": "22 -> 26"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 26 areas, 1441 pieces, 1204820 triangles in total | for information, seen from 5 spots: city 184 draws; home 34 draws; market 38 draws; cafe 52 draws; school 44 draws
[stage night3: running]
    PASS | N1 | 25 Oct day: halloween (101 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (32 pieces); 28 Mar 2027: easter (29 pieces); 10 Feb: None (0 pie
[stage night3: done in 18 s]
    PASS | N1 Holidays: Halloween 1-31 Oct (run 4), Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (101 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: Fals
[stage run4: running]
    FAIL | N19 | oct1-day: halloween (101 pieces, path open False); oct1-night: halloween (101 pieces, path open True); oct31-day: halloween (101 pieces, path open False); oct31-night: halloween (101 pieces, path open True); nov1: None (0 pieces, path open False); sep30: None (0 pieces, path open False); October sho
[stage run4: done in 29 s]
    FAIL | N19 Halloween: October 1 and 31 (day and night) show it, 1 Nov doesn't; costumes on sale only in October, wearable, seen by others, kept after; the spooky path at the Flower Corner at least 20% longer than the park's was, at least 5 scare kinds, each turns you to face it with a small shake and a soft sound only with sound on; ghosts all over town, none inside; every holiday piece touches the ground or a support (gap under 2 cm) | oct1-day: halloween (101 pieces, path open False); oct1-night: halloween (101 pieces, path open True); oct31-day: halloween (101 pieces, path open False); oct31-night: halloween (101 pieces, path open
```

### Job 4 (N19 with the gate and the corner's own colliders; the gate smoke test printed: 2026-10-20 open true, throughGate z −9.46, throughFence −6.62, intoTree −17.94, intoBench −15.0, intoFountain −15.55, intoHedge x −22.7; 2026-11-20 open false, throughGate −6.6)
```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 58 s]
    PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 732 after; grew: {"clothes": "22 -> 26"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 26 areas, 1443 pieces, 1205012 triangles in total | for information, seen from 5 spots: city 130 draws; home 34 draws; market 14 draws; cafe 30 draws; school 44 draws
[stage run4: running]
    PASS | N19 | oct1-day: halloween (101 pieces, path open False); oct1-night: halloween (101 pieces, path open True); oct31-day: halloween (101 pieces, path open False); oct31-night: halloween (101 pieces, path open True); nov1: None (0 pieces, path open False); sep30: None (0 pieces, path open False); October sho
[stage run4: done in 29 s]
    PASS | N19 Halloween: October 1 and 31 (day and night) show it, 1 Nov doesn't; costumes on sale only in October, wearable, seen by others, kept after; the spooky path at the Flower Corner at least 20% longer than the park's was, at least 5 scare kinds, each turns you to face it with a small shake and a soft sound only with sound on; ghosts all over town, none inside; every holiday piece touches the ground or a support (gap under 2 cm) | oct1-day: halloween (101 pieces, path open False); oct1-night: halloween (101 pieces, path open True); oct31-day: halloween (101 pieces, path open False); oct31-night: halloween (101 pieces, path open
```

### Job 5 (N23 after the mounts and the test's own diagonal bug were fixed; the first two runs printed 28 flagged signs: 25 shop signs 1 cm off their boards, the Pet Show sign under the garland, the salon posters behind the curtain, and the three flush signs named above)
```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage run4: running]
    PASS | N23 | 66 signs in 15 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castles': off centre 0.0%, inside True, nothing crosses it True, nothing coplanar True; '🏆 Pet Show': off 
[stage run4: done in 22 s]
    PASS | N23 Signs: every sign's text centered (within 3% of the sign) and inside its box with a margin, with and without a colour emoji font; the four named signs clean; no post, roof, light or spike crosses any sign's text | 66 signs in 15 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castle
[partial run: some stages skipped by --only]
```

### Job 6 (N30 after the test's sky band was moved clear of the HUD buttons; the first run counted the notepad and buttons as 'dark sky')
```
[stage run4: running]
    PASS | N30 | clouds: 16 in the sky + 6 at the beach, 22 meshes, 0 not the cloud material, 0 outline hulls; by day top #ffffff bottom #dde4f0; day sky picture: 0.0% dark pixels in the sky band clear of the buttons (limit 0.3%); grey weather: top #d3d9e4 bottom #a9b2c2; night: top #9aa1c8 bottom #5d6489; leaves in
    PASS | N31 | 219 round trees and 57 pines against 25 buildings' walls: 0 crowns inside a wall; the closest crown {'gap': 0.21, 'tree': [34.9, -30.2, 'tree'], 'building': '23,-31'}; wall at 12: steps>6 0.72% (limit 1.5), mean step 0.227 (limit .45; the streaked wall had 4.5% and .92), lum 206; wall at 11.5: steps
[stage run4: done in 36 s]
    PASS | N30 Sky: clouds soft (no outlines, no hard dark faces) by day and night; no orange specks above the trees; any leaves are leaf-shaped and near trees | clouds: 16 in the sky + 6 at the beach, 22 meshes, 0 not the cloud material, 0 outline hulls; by day top #ffffff bottom #dde4f0; day sky picture: 0.0% dark pixels in the sky band clear of the buttons 
    PASS | N31 Trees: no tree crown inside any building; no white smear on any wall | 219 round trees and 57 pines against 25 buildings' walls: 0 crowns inside a wall; the closest crown {'gap': 0.21, 'tree': [34.9, -30.2, 'tree'], 'building': '23,-31'}; wall at 12: steps>6 0.72% (limit
[partial run: some stages skipped by --only]
```

### Job 6 (N31 and N32 after the truck moved; the first N32 run found 20 pairs, all two flower heads of the park bed under the truck's counter, the live truck 68)
```
[stage run4: running]
    PASS | N31 | 219 round trees and 57 pines against 25 buildings' walls: 0 crowns inside a wall; the closest crown {'gap': 0.21, 'tree': [34.9, -30.2, 'tree'], 'building': '23,-31'}; wall at 12: steps>6 0.72% (limit 1.5), mean step 0.227 (limit .45; the streaked wall had 4.5% and .92), lum 206; wall at 11.5: steps
    PASS | N32 | the truck at (-34.2, 11.8): 842 triangles in 152 facing directions, 466 close same-facing pairs looked at, 0 overlapping within 1 cm; food trucks in the game (by their sign): 1; the sign: off centre 0.3%, crossed [], coplanar 0; the burger picture on the sign (left 35%): 6536 coloured pixels besides
[stage run4: done in 48 s]
    PASS | N31 Trees: no tree crown inside any building; no white smear on any wall | 219 round trees and 57 pines against 25 buildings' walls: 0 crowns inside a wall; the closest crown {'gap': 0.21, 'tree': [34.9, -30.2, 'tree'], 'building': '23,-31'}; wall at 12: steps>6 0.72% (limit
    PASS | N32 Food trucks: no flicker (no two surfaces closer than 1 cm facing the same way); the sign and the burger picture clean | the truck at (-34.2, 11.8): 842 triangles in 152 facing directions, 466 close same-facing pairs looked at, 0 overlapping within 1 cm; food trucks in the game (by their sign): 1; the sign: off centre 0
[partial run: some stages skipped by --only]
```

### Job 7 (N26 after three test fixes: the first run measured the arrow from its pink fill, which the outline eats at 20 px; it now watches the canvas rotate call; one run found the pizza tick hiding the box, fixed in the game)
```
[stage run4: running]
    PASS | N26 | ipad-landscape: no job: corner map shown True, job text hidden True, 228 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 2
[stage run4: done in 73 s]
    PASS | N26 Map: the corner map and 📱 Map draw the town (never one flat colour) on every screen size; the facing arrow turns every frame you turn; the corner map shows wherever it should | ipad-landscape: no job: corner map shown True, job text hidden True, 228 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that fra
[partial run: some stages skipped by --only]
```

### Job 8 (the rewritten N6 from the first run, and N24 after two test fixes: the game hour follows the shared clock, so the test picks real moments that are game daytime; the walk is measured along the path, 20 m or more)
```
[stage night3: running]
    PASS | N6 | day (game clock 13:10): out [True, True, True], visible to a player standing near [False, False, True], sitting [True, True, False], pond bench taken [True, True]; night (game clock 4:30): out [False, False, False], visible to a player standing near [False, False, False], sitting [False, False, Fals
[stage night3: done in 17 s]
    PASS | N6 Grandmas (rewritten for run 4): the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit | day (game clock 13:10): out [True, True, True], visible to a player standing near [False, False, True], sitting [True, True, False], pond bench taken [True, True]; night (game clock 4:30): out [False,
[stage run4: running]
    FAIL | N24 | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the biggest difference in a grandma's place 1.27 m (1 s of walking is 1.15 m); turn 545: at 76 s two sit 2, seats [0, 1, 0], the pond bench taken [True, 
[stage run4: done in 34 s]
    FAIL | N24 Grandmas: exactly 3; none by the town houses; they sit on the duck-pond bench feeding the ducks at times, walk to places and talk about them; the same places for two players | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the biggest difference in a grandma's place 1.27 m (1
[partial run: some stages skipped by --only]
```
```
[stage run4: running]
    PASS | N24 | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the biggest difference in a grandma's place 1.24 m (1 s of walking is 1.15 m); turn 545: at 76 s two sit 2, seats [0, 1, 0], the pond bench taken [True, 
[stage run4: done in 33 s]
    PASS | N24 Grandmas: exactly 3; none by the town houses; they sit on the duck-pond bench feeding the ducks at times, walk to places and talk about them; the same places for two players | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the biggest difference in a grandma's place 1.24 m (1
[partial run: some stages skipped by --only]
```

### Job 9 (N27, N29 and N35 from the first run, where N29 failed on the test's own too-wide look for bridge bits: it counted the lake pier's walk strip; N29 again after narrowing it to the pond; N41 after fixing the test's own day loop, which moved its end with the clock it set; the book stage with 7 pages)
```
[stage run4: running]
    PASS | N27 | 10 pieces of trash out of 28 spots today, kinds {'paper': 3, 'can': 1, 'cup': 4, 'peel': 2}; picking one up: True (+3 coins, remembered); over 8 days the trash kinds are ['can', 'cup', 'paper', 'peel']
    FAIL | N29 | walking at the pond from four sides stops 2.5 m from its middle (the water's edge is 1.45 m); hand-rail tubes left: 0; ducks 2, Feed-the-ducks spots 3, walk strips through water 1, height over the pond 0 | PROBLEMS: ['bits of the bridge are still there']
    PASS | N35 | default: switch on True, notepad shown True; Settings has the switch: {'text': '✏️ On', 'w': 92.6875, 'h': 52}; after Off: shown False, switch 'Off', saved False, notes kept True; after On: shown True, notes kept True; with the designer card the notepad steps aside True and comes back True
Terminated
EXIT 143
```
```
[stage run4: running]
    PASS | N29 | walking at the pond from four sides stops 2.5 m from its middle (the water's edge is 1.45 m); hand-rail tubes left: 0; ducks 2, Feed-the-ducks spots 3, walk strips through water 0, height over the pond 0
[stage run4: done in 24 s]
    PASS | N29 Pond: no bridge; nobody can walk on the water | walking at the pond from four sides stops 2.5 m from its middle (the water's edge is 1.45 m); hand-rail tubes left: 0; ducks 2, Feed-the-ducks spots 3, walk strips through water 0, height over the pon
[partial run: some stages skipped by --only]
```
```
[stage run4: running]
    PASS | N41 | bus days per week (6 weeks): [3, 3, 3, 3, 3, 3]; the two devices agree on every bus day and hour: True; 10 mornings at the park stop: 4 bus days, 6 without; a morning without a bus says e.g. 🚌 Next bus: Fri 11:30; a bus day says e.g. 🚌 Next bus: 11:30
[stage run4: done in 41 s]
    PASS | N41 Bus: with the one clock the bus still comes 3 days a week and the pill shows the next bus with its weekday | bus days per week (6 weeks): [3, 3, 3, 3, 3, 3]; the two devices agree on every bus day and hour: True; 10 mornings at the park stop: 4 bus days, 6 without; a morning without a bus says e.g. 🚌 Next bu
[partial run: some stages skipped by --only]
```
```
[stage book: running]
[stage book: done in 103 s]
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 7 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 7 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 7 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 7 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
[partial run: some stages skipped by --only]
```
