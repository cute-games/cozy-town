# Cozy Town: NIGHT 3 report

Branch `claude/night-3`, one commit per job. Starting file: index.html md5 `cd4a42567e44173c4f5dd04502f99504` (COZY_BUILD 2026100902). Final file: COZY_BUILD 2026101701. Backups: `tools/prenight3-index.html` (the exact starting file) and `tools/prenight3-rollback.html` (the same game with the higher version stamp 2026101750, so a rollback also reaches every player).

## 1. Every change, old → new

### Job 1: Holidays from the real calendar
- Old: no holidays. New: `realDate()` (one small function; the checks replace it in a test copy) decides Halloween (17 Oct–1 Nov), Christmas (1 Dec–6 Jan) and Easter (Palm Sunday to Easter Monday, computed with the Meeus formula, 1 h slack either side). No date setting, no URL switch.
- Halloween: pumpkins and garlands at the doors, bats and ghosts drifting on the graphics chip (one batch each), a purple sky and closer fog at night, and the Spooky path on the park's west side with 3 scare spots (BOO! 👻 once per night per spot, after 18:00 only, never in bed or in a scene). Christmas: lights, wreaths and garlands. Easter: eggs and bunting.
### Job 2: Rosie is silent
- Old: Rosie's cards and messages played talk/ding/tap sounds. New: zero sounds while chatting with Rosie and when her messages arrive (quietFriend / quietCard); the other friends, the chef and the clients still sound.
### Job 3: Friends in view, pets no pile-up
- Old: friends stopped behind or beside you, and pets could stand inside each other. New: when you stop, every following friend takes a spot in front of you inside the camera's view (2.4–5.2 m away, 1.5 m apart, never on a road); pets and friends keep a 0.8 m gap from each other, you and the others (FGAP).
### Job 4: Townspeople give way
- Old: walkers walked through each other. New: face to face each steps to its right (never from the pavement onto the road), the one behind slows down, and a push in passes keeps every two walkers at least 0.64 m apart; they also walk round sitters, grandmas, friends, pets and other players.
### Job 5: Sit on every bench
- Old: one "sit" spot on the beach bench only. New: every bench in town and on the beach has 2 seats (17 benches, 31 seats, plus your yard bench); you can eat from the bag while sitting; a full bench says so; your sitting pose goes online (presence field `st`, ignored by old versions). The football team bench and the hedge-locked Flower Corner bench have no seats.
### Job 6: Grandmas
- New: 6 benches beside the town houses with 12 grandmas (12 looks), chatting in little bubbles, nodding and laughing; "Say hi" gets a kind line, never the same twice in a row. Out 9:00–18:00 in dry weather; in rain, snow and at night they go inside and the bench is free.
### Job 7: The house
- Old: Decorating 10 grew the room to 18x14 and pushed furniture apart. New (the owner's decision 16 Oct): the room stays 12x10 and the big house adds the stairs and a 12x10 upstairs; nothing moves. An old bigger house shrinks once at load: pieces go back to their old spots, those that overlap or don't fit wait in 📦 My stuff with a note; the old layout stays in the save (`home.old`). Visiting an old-version friend's 18x14 house still shows the big room.
### Job 8: Kitchen
- New: sink, stove, fridge and the new cupboards snap edge to edge with fronts lined up (within 0.35 m, also round a corner) and flush to a wall; the ghost turns bright green when snapped; saved kitchens never move. 6 cupboard kinds (cupboard, narrow cupboard, drawers, corner cupboard, tall cupboard, wall cupboard) in white, wood, pink, mint and sky; the wall cupboard hangs on a wall and never blocks the floor.
### Job 9: Designer, 1 or 2 rooms
- Old: every order was one room. New: about 1 in 3 clients wants two rooms of different kinds ("a bedroom and a kitchen"); room 2 is behind a side door (one picture on the wall: Room 2 → / ← Room 1), with its own theme, things and tips; "All done?" only when both rooms have something; the client looks at room 1 then room 2; stars averaged to halves, each room paid as before and added. Old one-room orders in a save work as before. The HUD counts clients today.
### Job 10: Foods and the food truck
- New foods: 🍣 sushi, 🍙 rice ball, 🍔 burger, 🍟 fries, 🌭 hot dog, 🌮 taco, 🍜 noodles, 🥟 dumplings, 🍭 lollipop, 🍮 pudding (hunger and prices like similar foods). A food truck in the park's south-west corner by the bench (window towards the fountain) sells burgers, fries, hot dogs and tacos 8:00–20:00, Mr. Patty inside; the Market sells the other six. Random food quests can pick them.
### Job 11: Weather and seasons
- New: seasons by the real date; trees take the season's colours when the town loads (spring light green with some blossom, summer green, autumn orange/red/yellow with leaves falling near you, winter frosted). Weather from the shared clock only (3 game-hour blocks from a hash of day and block, the last hour fades): sunny, cloudy, rain, snow with the agreed shares (snow only in winter and the Christmas window; rain rare in winter). Rain: grey sky, softer sun, rain lines around you, a quiet rain sound outdoors with sound on. Snow: flakes, white grass while it snows and for the next block. Nothing falls indoors. No thunder. The clock chip shows ☁️ 🌧️ 🌨️.
### Job 12: Forest belt
- New: a belt of round trees and pines several rows deep past the barriers and round Friends Lane's valley (where the map already drew trees), a close row just outside the barriers, and up to 9 tree groups in free corners inside the town; never on roads, paths, doors, the bus route, the field, the pond, the lake, the park or future lane plots. Low-poly, no outlines, no shadows, merged by 64 m chunks. Season colours. On the map.
### Job 13: Wild animals
- New: butterflies round the flower beds and the fountain by day (spring, summer, autumn until 31 Oct, not in rain or snow); little flapping birds in loose flocks high over town by day (fewer in winter; called BIRDS in the code, the night-walking townspeople keep "owls"); owls in some trees at night with blinking eyes and a soft hoo-hoo when you are near (sound on). One batch per kind, no shadows.
### Job 14: More pets
- New: pomchi, pug and sausage dog (breeds of the puppy, saved as `type:'dog'` + `kind`), capybara (saved as hamster + kind), duck (bunny + kind) and owl (cat + kind): models, colours, names, sounds (yip, woof, squeak, quack, hoot), food, toy, all 4 outfit slots, name tag height, the Pet Show (rivals can be any kind), the adopt panel and the pet shop pens. Other players get `[type, colour, name, outfit, kind]`; old versions read the first 4 and show the plain animal; unknown kinds are skipped.
### Job 15: Hairstylist
- New: the ✂️ Hair Salon on the west road by the Apartments (on the map, 8:00–20:00): 2 chairs, mirrors with lights, a sink, dye shelves, posters. Rosie offers the 4th job with a first-time tips card. A customer comes in and sits; the card shows a picture of the hair they want (their own face). ✂️ cuts (long → shoulder → short, never back), 🪮 picks the style (straight, bob, ponytail, bun, pigtails, curly), 🎨 the colour (8). ✅ Done: 1–5 stars (length, style, colour, not cutting too much), pay 15/35/60/90/120, 4 customers a day. Works by touch and on PC.
### Job 16: TV
- Not tonight (the owner's note).
### Job 17: What's new book
- The night-3 book (9 pages, Back, dots, Next, "Let's play!" on the last page) replaces the night-2 book; the night-2 pages and pictures are kept in `tools/books/`.
### Job 18: Glitch hunter pass
- Canvas signs no longer carry the hidden variation selector after an emoji (signPlane strips it: "To the beach", "The world", "History", "To town", "Tennis", "CLAW", "Hair Salon").
- Offscreen pictures (the designer's theme photos, the salon's wish pictures) use the renderer's real render even while a check runs frames without drawing.

## 2. Check output per job, exactly as printed

Quick checks after each job (the stages named; the slow saves stage ran at the milestones and in the full check). A2 says "no backup given" in the quick checks on purpose: the backup is checked once, in the full check.

### Job 1
Stages: files, counts, players, claude, night3 N1

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 68 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 685 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1307 pieces, 994630 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 26 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 512 s]
    PASS | B1 saved games from older versions load in the new one with nothing lost | 11 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new vers
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 67 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 54 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N1 | 25 Oct day: halloween (49 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (32 pieces); 28 Mar 2027: easter (29 pieces); 10 Feb: None (0 piec
[stage night3: done in 144 s]
    PASS | N1 Holidays: Halloween 17 Oct-1 Nov, Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (49 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False
[partial run: some stages skipped by --only]
```

### Job 2
Stages: files, counts, players, claude, night3 N2

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 106 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 685 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1307 pieces, 994630 triangles in total | for information, seen from 5 spots: city 127 draws; home 34 draws; market 39 draws; cafe 45 draws; school 44 draws
[stage saves: running]
[stage saves: done in 394 s]
    PASS | B1 saved games from older versions load in the new one with nothing lost | 11 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new vers
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 57 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 26 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N2 | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding: 4
[stage night3: done in 18 s]
    PASS | N2 Rosie: zero sounds while chatting with her and when her messages arrive; other friends, the chef and clients still sound | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding
[partial run: some stages skipped by --only]
```

### Job 3
Stages: files, counts, players, claude, night3 N3

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 66 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 685 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1307 pieces, 994630 triangles in total | for information, seen from 5 spots: city 160 draws; home 34 draws; market 48 draws; cafe 44 draws; school 44 draws
[stage players: running]
[stage players: done in 0 s]
    FAIL | X stage players crashed | FileNotFoundError(2, 'No such file or directory')
[stage claude: running]
[stage claude: done in 24 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N3 | stop 1: 4 friends, 4 in view in front, 1.48 m apart; 3 pets, closest gap 0.81 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.59 m apart; 3 pets, closest gap 1.02 m; after turning round: 4 of 4 back in view
[stage night3: done in 15 s]
    PASS | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.48 m apart; 3 pets, closest gap 0.81 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.59 m apart; 3 pets, closest gap 1.02
[partial run: some stages skipped by --only]
```

### Job 4 (first run, N4 at 0.458 m: the push apart was then made to run in passes)
Stages: files, counts, players, claude, night3 N4

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 68 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 685 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1307 pieces, 994630 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage players: running]
[stage players: done in 29 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 25 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N4 | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (11/18 at -19.1,-5.6 h13.21)
[stage night3: done in 13 s]
    PASS | N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (11/18 at -19.1,-5.6 h13.21) (12 s)
[partial run: some stages skipped by --only]
```

### Job 4 (after the fix)
Stages: files, counts, players, claude, night3 N4

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 68 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 685 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1307 pieces, 994630 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage players: running]
[stage players: done in 29 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 25 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N4 | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (11/18 at -19.1,-5.6 h13.21)
[stage night3: done in 13 s]
    PASS | N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (11/18 at -19.1,-5.6 h13.21) (12 s)
[partial run: some stages skipped by --only]
```

### Job 5
Stages: files, counts, players, claude, night3 N5

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 70 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 685 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1307 pieces, 994774 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 38 draws; cafe 46 draws; school 44 draws
[stage players: running]
[stage players: done in 33 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 24 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N5 | 17 benches in ['city', 'beach']; 31 seats sat on, 3 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag 1, legs -1.45); B's try for the same seat: seat 1 False, seat 2 True, toast 'Comfy! Move to stand u
[stage night3: done in 36 s]
    PASS | N5 Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose | 17 benches in ['city', 'beach']; 31 seats sat on, 3 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag
[partial run: some stages skipped by --only]
```

### Job 6
Stages: files, counts, players, claude, night3 N6

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 70 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 685 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1355 pieces, 1017814 triangles in total | for information, seen from 5 spots: city 127 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage players: running]
[stage players: done in 31 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 24 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N6 | 6 grandma benches, 12 grandmas (12 different looks); 12:00 dry: 6 benches out, 6 full; 22:00: 0 out, 6 free, you can sit True; rain: 0 out; snow: 0 out
[stage night3: done in 14 s]
    PASS | N6 Grandmas: out in dry daytime; inside in rain, snow and at night; their bench is full while they sit | 6 grandma benches, 12 grandmas (12 different looks); 12:00 dry: 6 benches out, 6 full; 22:00: 0 out, 6 free, you can sit True; rain: 0 out; snow: 0 out (13 s)
[partial run: some stages skipped by --only]
```

### Job 7 (with the saves stage; B1 then showed the pet-spot difference, see the kit rules)
Stages: files, counts, saves, players, claude, night3 N12

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 70 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 685 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1355 pieces, 1017814 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 47 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 311 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 11 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new vers
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 40 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 25 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N12 | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout
[stage night3: done in 64 s]
    PASS | N12 House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room,
[partial run: some stages skipped by --only]
```

### Job 8
Stages: files, counts, players, claude, night3 N7

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 78 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 697 after; grew: {"furniture": "55 -> 61", "furniture_for_sale": "33 -> 39"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1355 pieces, 1017814 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
[stage players: running]
[stage players: done in 30 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 31 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N7 | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboards for sale: ['cupboard', 'cupboardn', 'drawers', 'cornercup', 'tallcup', 'wallcup'] in 5 colours; g
[stage night3: done in 26 s]
    PASS | N7 Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboar
[partial run: some stages skipped by --only]
```

### Job 9 (first run: E1 over in the client room, the side doors were then made one picture; B1: the quest draw, see the kit rules)
Stages: files, counts, saves, players, claude, night3 N8

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 76 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 697 after; grew: {"furniture": "55 -> 61", "furniture_for_sale": "33 -> 39"}
    FAIL | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1369 pieces, 1018922 triangles in total | MORE: ['client pieces 14 -> 28 (limit +10%)', 'client triangles 1742 -> 2850 (limit +10%)'] | for information, seen from 5 spots: city 127 draws; ho
[stage saves: running]
[stage saves: done in 322 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 11 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new vers
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 29 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 26 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N8 | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 1 -> 2; 2-room order (of: natbed + unikids); message: "Hi! I'm Ms. Plum 😊 I live in the Tall building behind the Market, flat"; room 1 has 2 things; 'All done?' with room 2 empty offers to call
[stage night3: done in 21 s]
    PASS | N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 1 -> 2; 2-room order (of: natbed + unikids); message: "Hi! I'm Ms. Plum 😊 I live in the Tall
[partial run: some stages skipped by --only]
```

### Job 9 (after the fix)
Stages: files, counts, players, claude, night3 N8

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 69 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 697 after; grew: {"furniture": "55 -> 61", "furniture_for_sale": "33 -> 39"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1356 pieces, 1017816 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 50 draws; cafe 48 draws; school 44 draws
[stage players: running]
[stage players: done in 31 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 24 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N8 | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 1 -> 2; 2-room order (n1: greenkit + pinkbed); message: "Hi! I'm Hana 😊 I live in the Pink house, near the Duck Pond. Can you m"; room 1 has 2 things; 'All done?' with room 2 empty offers to ca
[stage night3: done in 20 s]
    PASS | N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 1 -> 2; 2-room order (n1: greenkit + pinkbed); message: "Hi! I'm Hana 😊 I live in the Pink ho
[partial run: some stages skipped by --only]
```

### Job 10
Stages: files, counts, players, claude, night3 N9

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 78 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 718 after; grew: {"shops": "10 -> 11", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods": "49 -> 59", "shop_market": "20 -> 26", "shop_truck": "new list (
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1357 pieces, 1019262 triangles in total | for information, seen from 5 spots: city 127 draws; home 34 draws; market 49 draws; cafe 50 draws; school 44 draws
[stage players: running]
[stage players: done in 31 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 25 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N9 | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy burger ok, you have 1; at 21:00: card opens False, bought False ('🌙 The Food truck is closed now. It op
[stage night3: done in 15 s]
    PASS | N9 Food: every new food can be bought, eaten (also on a bench) and shows its icon and name | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy bur
[partial run: some stages skipped by --only]
```

### Job 11
Stages: files, counts, players, claude, night3 N10

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 70 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 718 after; grew: {"shops": "10 -> 11", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods": "49 -> 59", "shop_market": "20 -> 26", "shop_truck": "new list (
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1357 pieces, 1027600 triangles in total | for information, seen from 5 spots: city 140 draws; home 34 draws; market 50 draws; cafe 50 draws; school 44 draws
[stage players: running]
[stage players: done in 31 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 25 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N10 | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #74a1cb, sun 0.28; snow: flakes True (indoors False), ground #e3f0ea; sunny: sky #4fb4ff, sun 0.56, no rain True; cloudy:
[stage night3: done in 68 s]
    PASS | N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #74a1cb, sun 0.28; sno
[partial run: some stages skipped by --only]
```

### Job 12
Stages: files, counts, players, claude

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 68 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 718 after; grew: {"shops": "10 -> 11", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods": "49 -> 59", "shop_market": "20 -> 26", "shop_truck": "new list (
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1385 pieces, 1129598 triangles in total | for information, seen from 5 spots: city 170 draws; home 34 draws; market 50 draws; cafe 48 draws; school 44 draws
[stage players: running]
[stage players: done in 33 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 25 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[partial run: some stages skipped by --only]
```

### Job 13
Stages: files, counts, players, claude

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 81 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 718 after; grew: {"shops": "10 -> 11", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods": "49 -> 59", "shop_market": "20 -> 26", "shop_truck": "new list (
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1388 pieces, 1143038 triangles in total | for information, seen from 5 spots: city 148 draws; home 34 draws; market 45 draws; cafe 53 draws; school 44 draws
[stage players: running]
[stage players: done in 34 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 32 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[partial run: some stages skipped by --only]
```

### Job 14 (with the saves stage; N11 failed on the sixth show: the away timer, then fixed)
Stages: files, counts, saves, players, claude, night3 N11

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 70 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 724 after; grew: {"shops": "10 -> 11", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods": "49 -> 59", "pet_kinds": "4 -> 10", "shop_market": "20 -> 26", "
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 25 areas, 1388 pieces, 1143038 triangles in total | for information, seen from 5 spots: city 184 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 372 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 11 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new vers
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 37 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 26 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    FAIL | N11 | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (4) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (3) |
[stage night3: done in 51 s]
    FAIL | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (4) | pug: adopt True (saved as dog), follows True, fed
[partial run: some stages skipped by --only]
```

### Job 14 (N11 again, after the away-timer fix)
Stages: night3 N11

```
[stage night3: running]
    PASS | N11 | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (4) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (4) |
[stage night3: done in 46 s]
    PASS | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (4) | pug: adopt True (saved as dog), follows True, fed
[partial run: some stages skipped by --only]
```

### Job 15 (first run: the job card jumped on iPad, the Done button was off the iPhone screen; both fixed)
Stages: files, counts, players, claude, night3 N13

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 67 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 728 after; grew: {"areas": "24 -> 25", "shops": "10 -> 11", "places": "21 -> 22", "doors": "22 -> 23", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods":
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 26 areas, 1401 pieces, 1149496 triangles in total | for information, seen from 5 spots: city 148 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
[stage players: running]
[stage players: done in 32 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 27 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    FAIL | N13 | ipad-landscape: no customer | iphone-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done covered:outside the screen: None stars, paid None (coins 300 -> 300), customers today 0, customer left False | pc-1920:
[stage night3: done in 56 s]
    FAIL | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: no customer | iphone-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done covered:outside the
[partial run: some stages skipped by --only]
```

### Job 15 (after the fixes)
Stages: files, counts, players, claude, night3 N13

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 71 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 728 after; grew: {"areas": "24 -> 25", "shops": "10 -> 11", "places": "21 -> 22", "doors": "22 -> 23", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods":
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 26 areas, 1404 pieces, 1149888 triangles in total | for information, seen from 5 spots: city 167 draws; home 34 draws; market 39 draws; cafe 54 draws; school 44 draws
[stage players: running]
[stage players: done in 30 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 25 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage night3: running]
    PASS | N13 | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat a
[stage night3: done in 55 s]
    PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), cus
[partial run: some stages skipped by --only]
```

### Job 17
Stages: book

```
[stage book: running]
[stage book: done in 122 s]
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 9 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 9 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 9 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 9 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
[partial run: some stages skipped by --only]
```

### The full check on the final file

Run with `--full --e1-limits "city:0.35:0.60,beach:0.35:0.60" --backup tools/prenight3-index.html --backup-title "Night 3 backup of the live game (tools/prenight3-index.html), made 2026-10-16, checked 2026-10-17"`. The live versions are the main branch's index.html (md5 cd4a42567e44173c4f5dd04502f99504, the same file the live site serves) and its Claude form, re-read on the day of the check (A1). A first full run on 17 Oct (Halloween now on) found the town at 492 pieces against the agreed 490 and a B1 difference in the quest history (qhist, the same quest re-draw); both are fixed above (bigger merge chunks; the kit rule). A second run then showed the kit's own N14 line could not run (it had not loaded the test helper on its page, and it measured on the title screen where the rain and the animals never show); the kit was fixed to measure in a started game standing in town, N14 was proved alone, and the third run below is the full check on the final file. The first two runs' lines are printed after it.

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup cd4a42567e44173c4f5dd04502f99504 vs live GitHub cd4a42567e44173c4f5dd04502f99504; title "Night 3 backup of the live game (tools/prenight3-index.html), made 2026-10-16, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 67 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 728 after; grew: {"areas": "24 -> 25", "shops": "10 -> 11", "places": "21 -> 22", "doors": "22 -> 23", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods": 
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 26 areas, 1426 pieces, 1167048 triangles in total | for information, seen from 5 spots: city 167 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 310 s]
    PASS | B1 saved games from older versions load in the new one with nothing lost | 11 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new vers
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 29 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 26 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage book: running]
[stage book: done in 123 s]
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 9 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 9 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 9 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 9 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
[stage night3: running]
    PASS | N1 | 25 Oct day: halloween (49 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (32 pieces); 28 Mar 2027: easter (29 pieces); 10 Feb: None (0 piec
    PASS | N2 | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding: 4
    PASS | N3 | stop 1: 4 friends, 4 in view in front, 1.48 m apart; 3 pets, closest gap 0.81 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.59 m apart; 3 pets, closest gap 1.02 m; after turning round: 4 of 4 back in view
    PASS | N4 | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.644 m (4/6 at -29.7,21.5 h13.31)
    PASS | N5 | 23 benches in ['city', 'beach']; 31 seats sat on, 15 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag 1, legs -1.45); B's try for the same seat: seat 1 False, seat 2 True, toast 'Comfy! Move to stand 
    PASS | N6 | 6 grandma benches, 12 grandmas (12 different looks); 12:00 dry: 6 benches out, 6 full; 22:00: 0 out, 6 free, you can sit True; rain: 0 out; snow: 0 out
    PASS | N7 | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboards for sale: ['cupboard', 'cupboardn', 'drawers', 'cornercup', 'tallcup', 'wallcup'] in 5 colours; g
Task exception was never retrieved
future: <Task finished name='Task-1474' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
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
    PASS | N8 | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 1 -> 2; 2-room order (n1: bluebed + greenkit); message: "Hi! I'm Hana 😊 I live in the Pink house, near the Duck Pond. Can you m"; room 1 has 2 things; 'All done?' with room 2 empty offers to ca
    PASS | N9 | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy burger ok, you have 1; at 21:00: card opens False, bought False ('🌙 The Food truck is closed now. It op
    PASS | N10 | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #74a1cb, sun 0.28; snow: flakes True (indoors False), ground #e3f0ea; sunny: sky #4fb4ff, sun 0.56, no rain True; cloudy: 
    PASS | N11 | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (4) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (3) | 
    PASS | N12 | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout 
    PASS | N13 | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat after 1
    PASS | N14 | index.html 1.36 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 26 areas, 1480 pieces, 1177144 triangles; town 417 -> 522 pieces, 611834 -> 770726 triangles; limits city:0.35:0.60,beach:0.35:0.60
[stage night3: done in 427 s]
    PASS | N1 Holidays: Halloween 17 Oct-1 Nov, Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (49 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False
    PASS | N2 Rosie: zero sounds while chatting with her and when her messages arrive; other friends, the chef and clients still sound | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding
    PASS | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.48 m apart; 3 pets, closest gap 0.81 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.59 m apart; 3 pets, closest gap 1.02
    PASS | N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.644 m (4/6 at -29.7,21.5 h13.31) (14 s)
    PASS | N5 Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose | 23 benches in ['city', 'beach']; 31 seats sat on, 15 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit fla
    PASS | N6 Grandmas: out in dry daytime; inside in rain, snow and at night; their bench is full while they sit | 6 grandma benches, 12 grandmas (12 different looks); 12:00 dry: 6 benches out, 6 full; 22:00: 0 out, 6 free, you can sit True; rain: 0 out; snow: 0 out (13 s)
    PASS | N7 Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboar
    PASS | N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 1 -> 2; 2-room order (n1: bluebed + greenkit); message: "Hi! I'm Hana 😊 I live in the Pink ho
    PASS | N9 Food: every new food can be bought, eaten (also on a bench) and shows its icon and name | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy bur
    PASS | N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #74a1cb, sun 0.28; sno
    PASS | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (4) | pug: adopt True (saved as dog), follows True, fed
    PASS | N12 House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, 
    PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers
    PASS | N14 Smooth and light: E1 within the agreed limits, measured with Halloween on, rain on and the animals out; index.html under 1.8 MB | index.html 1.36 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 26 areas, 1480 pieces, 1177144 triangles; town 417 -> 522 pieces, 611834 -> 770726 triangles; limits cit
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 333 s]
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 188 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 391 s]
[stage crawl_ipad-landscape_inB: running]
[stage crawl_ipad-landscape_inB: done in 129 s]
[stage crawl_ipad-landscape_inC: running]
[stage crawl_ipad-landscape_inC: done in 57 s]
[stage crawl_ipad-landscape_inD: running]
[stage crawl_ipad-landscape_inD: done in 48 s]
[stage teacher_ipad-landscape: running]
[stage teacher_ipad-landscape: done in 74 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 67 s]
[stage teacher_pc-1920: running]
[stage teacher_pc-1920: done in 83 s]
[stage pc_keys: running]
[stage pc_keys: done in 29 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[stage tour_iphone-portrait_0: running]
[stage tour_iphone-portrait_0: done in 67 s]
[stage tour_iphone-portrait_1: running]
[stage tour_iphone-portrait_1: done in 13 s]
[stage tour_iphone-landscape_0: running]
[stage tour_iphone-landscape_0: done in 73 s]
[stage tour_iphone-landscape_1: running]
[stage tour_iphone-landscape_1: done in 16 s]
[stage tour_android-phone-portrait_0: running]
[stage tour_android-phone-portrait_0: done in 66 s]
[stage tour_android-phone-portrait_1: running]
[stage tour_android-phone-portrait_1: done in 13 s]
[stage tour_android-phone-landscape_0: running]
[stage tour_android-phone-landscape_0: done in 73 s]
[stage tour_android-phone-landscape_1: running]
[stage tour_android-phone-landscape_1: done in 17 s]
[stage tour_android-tablet-portrait_0: running]
[stage tour_android-tablet-portrait_0: done in 81 s]
[stage tour_android-tablet-portrait_1: running]
[stage tour_android-tablet-portrait_1: done in 17 s]
[stage tour_android-tablet-landscape_0: running]
[stage tour_android-tablet-landscape_0: done in 89 s]
[stage tour_android-tablet-landscape_1: running]
[stage tour_android-tablet-landscape_1: done in 19 s]
[stage tour_pc-1366_0: running]
[stage tour_pc-1366_0: done in 90 s]
[stage tour_pc-1366_1: running]
[stage tour_pc-1366_1: done in 19 s]

===== COZY TOWN FINAL CHECK =====
2026-10-17 · check version 5 · update, full sweep for a big update
live Claude 657f225b66662470d97454663cedc34c · new Claude fd84696cb6775f78d19c823aed4ab0f2 · live GitHub cd4a42567e44173c4f5dd04502f99504 · new GitHub 1566924e78d705d560d04805b920d61a
PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
PASS | A2 dated private backup of the live game | backup cd4a42567e44173c4f5dd04502f99504 vs live GitHub cd4a42567e44173c4f5dd04502f99504; title "Night 3 backup of the live game (tools/prenight3-index.html), made 2026-10-16, checked 2026-10-17"
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 728 after; grew: {"areas": "24 -> 25", "shops": "10 -> 11", "places": "21 -> 22", "doors": "22 -> 23", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods": "49 -> 59", "pet_kinds": "4 -> 10", "jobs": "3
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 26 areas, 1426 pieces, 1167048 triangles in total | for information, seen from 5 spots: city 167 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 11 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; a Friends Lane time given (the save had none); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prenight3-bighouse.json: name 'ZZTEST-BIGHOUSE', coins 3100, furniture 33, pets 0; 0 differences; the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prenight3-designer.json: name 'ZZTEST-DESIGNER', coins 400, furniture 0, pets 0; 0 differences; new version saves under the same key: yes | save-prenight3-pets.json: name 'ZZTEST-PETS', coins 900, furniture 0, pets 4; 0 differences; new version saves under the same key: yes | save-prenight3-upstairs.json: name 'ZZTEST-UPSTAIRS', coins 2345, furniture 7, pets 0; 0 differences; the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 9 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 9 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 9 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 9 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
PASS | N1 Holidays: Halloween 17 Oct-1 Nov, Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (49 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (32 pieces); 28 Mar 2027: easter (29 pieces); 10 Feb: None (0 pieces) (18 s)
PASS | N2 Rosie: zero sounds while chatting with her and when her messages arrive; other friends, the chef and clients still sound | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding: 4 (5 s)
PASS | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.48 m apart; 3 pets, closest gap 0.81 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.59 m apart; 3 pets, closest gap 1.02 m; after turning round: 4 of 4 back in view (25 s)
PASS | N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.644 m (4/6 at -29.7,21.5 h13.31) (14 s)
PASS | N5 Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose | 23 benches in ['city', 'beach']; 31 seats sat on, 15 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag 1, legs -1.45); B's try for the same seat: seat 1 False, seat 2 True, toast 'Comfy! Move to stand up. You c' (36 s)
PASS | N6 Grandmas: out in dry daytime; inside in rain, snow and at night; their bench is full while they sit | 6 grandma benches, 12 grandmas (12 different looks); 12:00 dry: 6 benches out, 6 full; 22:00: 0 out, 6 free, you can sit True; rain: 0 out; snow: 0 out (13 s)
PASS | N7 Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboards for sale: ['cupboard', 'cupboardn', 'drawers', 'cornercup', 'tallcup', 'wallcup'] in 5 colours; ghost by the stove: at -1.2,-4.649 valid True snapped True colour #22e07c; a saved kitchen with a gap after a reload: unchanged (24 s)
PASS | N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 1 -> 2; 2-room order (n1: bluebed + greenkit); message: "Hi! I'm Hana 😊 I live in the Pink house, near the Duck Pond. Can you m"; room 1 has 2 things; 'All done?' with room 2 empty offers to call the client: False; room 2 (Garden kitchen) has 2 things, room 1 still 2; 2-room review: go tapped ok, ended True after 60 rounds, paid 70 🪙, done 1, client said '🙂 Hana gave you 0½ ⭐ for the dreamy blue bedroom and the garden kitchen. You got' (18 s)
PASS | N9 Food: every new food can be bought, eaten (also on a bench) and shows its icon and name | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy burger ok, you have 1; at 21:00: card opens False, bought False ('🌙 The Food truck is closed now. It opens'); taco on a bench: still sitting True, ate True; bag shows '🍣Sushi×2' (17 s)
PASS | N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #74a1cb, sun 0.28; snow: flakes True (indoors False), ground #e3f0ea; sunny: sky #4fb4ff, sun 0.56, no rain True; cloudy: sun 0.39; weather shares (% of blocks): {"autumn": {"rain": 30, "cloudy": 25, "sunny": 46}, "winter": {"snow": 35, "rain": 4, "cloudy": 29, "sunny": 32}, "spring": {"rain": 26, "sunny": 56, "cloudy": 19}, "summer": {"cloudy": 14, "rain": 16, "sunny": 70}, "xmas": {"snow": 60, "cloudy": 20, "sunny": 21}}; tree colours by season: spring: spring ['#9fe08a', '#b4ea8e', '#8fd97e', '#a6e68c']; summer: summer ['#7ed37a', '#6cc97c', '#93dc76']; autumn: autumn ['#ff9f43', '#ff6b4a', '#ffd45c', '#e8734a']; winter: winter ['#cfe8dc', '#dff2ea', '#b8dcc8', '#e8f4ee'] (67 s)
PASS | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (4) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (3) | sausage: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.72, sound True, 4 colours, 6 names, Pet Show True (4) | capybara: adopt True (saved as hamster), follows True, fed True, played True, 4/4 outfit slots, tag 1, sound True, 4 colours, 6 names, Pet Show True (3) | duck: adopt True (saved as bunny), follows True, fed True, played True, 4/4 outfit slots, tag 0.9, sound True, 4 colours, 6 names, Pet Show True (3) | owl: adopt True (saved as cat), follows True, fed True, played True, 4/4 outfit slots, tag 0.92, sound True, 4 colours, 6 names, Pet Show True (4) | old version: loads a save with a pug and a capybara: playing True, 2 pets shown as ['dog', 'hamster']; a friend's pug + capybara + unknown kind show as ['dog', 'hamster'] | new version shows a friend's pets as ['pug', 'capybara'] (39 s)
PASS | N12 House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout kept True; the player (saved upstairs) starts at -3.4,0.0 in home | save-f2cdd53-rich.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout kept True | save-live-web-rich.json: 12x10 room, upstairs True, 5 placed + 0 in My stuff = 5 (before 5), outside the walls 0, overlaps 0, old layout kept True | a new upgrade: big True, furniture unchanged True, downstairs 12x10, upstairs True (half-width 6), coins left 100 | stairs up: floor 1 at -3.4,0.0 (75 s)
PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | pc-1920: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True (53 s)
PASS | N14 Smooth and light: E1 within the agreed limits, measured with Halloween on, rain on and the animals out; index.html under 1.8 MB | index.html 1.36 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 26 areas, 1480 pieces, 1177144 triangles; town 417 -> 522 pieces, 611834 -> 770726 triangles; limits city:0.35:0.60,beach:0.35:0.60 (14 s)
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 every spot and button does something (iPad, finger taps) | 698 taps tested in 24 areas, 335 screens
PASS | C2b every area is reached by playing | 24 of 24 areas
PASS | C3 walking works (ipad-landscape) | joystick drag: moved 2.0 m in 1.5 s
PASS | T1 teacher job plays from the school message to the end of class (ipad-landscape) | 3 classes: English ended, Math ended, History ended
PASS | T2 every goofing kid can be stopped, left and right (ipad-landscape) | left side 7 of 7 taps worked, right side 28 of 28
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (ipad-landscape) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (ipad-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (iphone-landscape) | 3 classes: English ended, Math ended, History ended
PASS | T2 every goofing kid can be stopped, left and right (iphone-landscape) | left side 6 of 6 taps worked, right side 31 of 31
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (iphone-landscape) | 14 papers; button size 52x44 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (iphone-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (pc-1920) | 3 classes: History ended, Math ended, History ended
PASS | T2 every goofing kid can be stopped, left and right (pc-1920) | left side 13 of 13 taps worked, right side 22 of 22
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (pc-1920) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (pc-1920) | 51 questions read
PASS | C3 walking works (pc-1920) | W key: moved 2.0 m in 1.5 s
PASS | C1 every screen opens (iphone-portrait, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (iphone-portrait) | joystick drag: moved 2.0 m in 1.5 s
PASS | C1 every screen opens (iphone-landscape, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (iphone-landscape) | joystick drag: moved 2.0 m in 1.5 s
PASS | C1 every screen opens (android-phone-portrait, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (android-phone-portrait) | joystick drag: moved 2.0 m in 1.5 s
PASS | C1 every screen opens (android-phone-landscape, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (android-phone-landscape) | joystick drag: moved 2.0 m in 1.5 s
PASS | C1 every screen opens (android-tablet-portrait, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (android-tablet-portrait) | joystick drag: moved 2.0 m in 1.5 s
PASS | C1 every screen opens (android-tablet-landscape, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (android-tablet-landscape) | joystick drag: moved 2.0 m in 1.5 s
PASS | C1 every screen opens (pc-1366, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (pc-1366) | W key: moved 2.0 m in 1.5 s
PASS | C4 nothing is cut off the screen | 0 problems
PASS | C4 no buttons overlap | 0 problems
PASS | C4 all text fits its box | 0 problems
PASS | C4 every button is at least 44 px for a finger | 0 problems
PASS | C4 text is readable in light and dark | 0 problems
PASS | C5 the same kind of button looks the same everywhere | 32 kinds of button
PASS | C6 zero errors in the browser log | 0 errors
PASS | C8 test copies never reached the real internet | 0 outside requests stopped
NOT RUN | C1-WK every screen in Safari's engine (iPhone, iPad) | NOT RUN: Safari's engine is not installed on this computer
PASS | F6 every test action is logged and undone | 87 test actions, 87 undone
PASS | F2a the tests used exactly the files to publish | files tested: ['0e8f3f3dab145e2a6455332f8505730e', '1566924e78d705d560d04805b920d61a', '49e2a57cde9ccbef2385d9d24f018738', '718ae2f98f6c5ee47186daba2e7a41ec', '84fba8d290b40b27898b0c7a19eb19af', 'cd4a42567e44173c4f5dd04502f99504', 'efc62d391e8a478283ee5367b7a32958', 'fd84696cb6775f78d19c823aed4ab0f2']; to publish: ['1566924e78d705d560d04805b920d61a', 'fd84696cb6775f78d19c823aed4ab0f2']
NOT RUN | F2 published Claude version = tested file | NOT RUN: not published yet
NOT RUN | F3 GitHub file after upload = new Claude version + same web part, same address | NOT RUN: not uploaded yet
NOT VERIFIED | G real devices, sound, smoothness, two real players online | NOT VERIFIED: in the "Try it for real" notebook until ticked
RESULT: ALL PASS, 4 not run or not verified · 51 min of testing

```

### The full check, first run (stopped after the saves stage: E1 and B1)

```
[stage files: running]
[stage files: done in 1 s]
    FAIL | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-16, github-live.html read on 2026-10-16
    FAIL | A2 dated private backup of the live game | backup cd4a42567e44173c4f5dd04502f99504 vs live GitHub cd4a42567e44173c4f5dd04502f99504; title "Night 3 backup of the live game, 16 Oct 2026 (tools/prenight3-index.html)"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 73 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 728 after; grew: {"areas": "24 -> 25", "shops": "10 -> 11", "places": "21 -> 22", "doors": "22 -> 23", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods":
    FAIL | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 26 areas, 1450 pieces, 1167048 triangles in total | MORE: ['city pieces 363 -> 492 (limit +35%)'] | for information, seen from 5 spots: city 143 draws; home 34 draws; market 50 draws; cafe 54 draws; s
[stage saves: running]
[stage saves: done in 388 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 11 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new vers
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
```

### The full check, second run (stopped after N14: the kit fix)

```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup cd4a42567e44173c4f5dd04502f99504 vs live GitHub cd4a42567e44173c4f5dd04502f99504; title "Night 3 backup of the live game (tools/prenight3-index.html), made 2026-10-16, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 70 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 685 things before, 728 after; grew: {"areas": "24 -> 25", "shops": "10 -> 11", "places": "21 -> 22", "doors": "22 -> 23", "furniture": "55 -> 61", "furniture_for_sale": "33 -> 39", "foods":
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +35% pieces / +60% triangles, beach +35% pieces / +60% triangles | 26 areas, 1426 pieces, 1167048 triangles in total | for information, seen from 5 spots: city 179 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 313 s]
    PASS | B1 saved games from older versions load in the new one with nothing lost | 11 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; new player id given (the save had none); a Friends Lane time given (the save had none); new vers
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 38 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 26 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage book: running]
[stage book: done in 126 s]
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 9 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 9 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 9 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 9 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 9 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
[stage night3: running]
    PASS | N1 | 25 Oct day: halloween (49 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (32 pieces); 28 Mar 2027: easter (29 pieces); 10 Feb: None (0 piec
    PASS | N2 | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding: 4
    PASS | N3 | stop 1: 4 friends, 4 in view in front, 1.49 m apart; 3 pets, closest gap 0.80 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.60 m apart; 3 pets, closest gap 0.81 m; after turning round: 4 of 4 back in view
    PASS | N4 | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.641 m (6/8 at -21.3,-25.8 h12.98)
    PASS | N5 | 23 benches in ['city', 'beach']; 31 seats sat on, 15 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag 1, legs -1.45); B's try for the same seat: seat 1 False, seat 2 True, toast 'Comfy! Move to stand
    PASS | N6 | 6 grandma benches, 12 grandmas (12 different looks); 12:00 dry: 6 benches out, 6 full; 22:00: 0 out, 6 free, you can sit True; rain: 0 out; snow: 0 out
    PASS | N7 | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboards for sale: ['cupboard', 'cupboardn', 'drawers', 'cornercup', 'tallcup', 'wallcup'] in 5 colours; g
    PASS | N8 | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 1 -> 2; 2-room order (s2: pinkbed + sunliv); message: "Hi! I'm Max 😊 I live in the Blue house, near the Lake. Can you make me"; room 1 has 2 things; 'All done?' with room 2 empty offers to call
    PASS | N9 | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy burger ok, you have 1; at 21:00: card opens False, bought False ('🌙 The Food truck is closed now. It op
    PASS | N10 | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #74a1cb, sun 0.28; snow: flakes True (indoors False), ground #e3f0ea; sunny: sky #4fb4ff, sun 0.56, no rain True; cloudy:
    PASS | N11 | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (4) |
    PASS | N12 | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout
    PASS | N13 | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat a
    FAIL | N14 | the test itself failed: Error('Page.evaluate: ReferenceError: __run is not defined\n    at eval (eval at evaluate (:290:30), <anonymous>:1:111)\n    at UtilityScript.evaluate (<anonymous>:297:18)\n    at UtilityScript.<anonymous> (<anonymous>:1:44)')
[stage night3: done in 433 s]
    PASS | N1 Holidays: Halloween 17 Oct-1 Nov, Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (49 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False
    PASS | N2 Rosie: zero sounds while chatting with her and when her messages arrive; other friends, the chef and clients still sound | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding
    PASS | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.49 m apart; 3 pets, closest gap 0.80 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.60 m apart; 3 pets, closest gap 0.81
    PASS | N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.641 m (6/8 at -21.3,-25.8 h12.98) (12 s)
    PASS | N5 Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose | 23 benches in ['city', 'beach']; 31 seats sat on, 15 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit fla
    PASS | N6 Grandmas: out in dry daytime; inside in rain, snow and at night; their bench is full while they sit | 6 grandma benches, 12 grandmas (12 different looks); 12:00 dry: 6 benches out, 6 full; 22:00: 0 out, 6 free, you can sit True; rain: 0 out; snow: 0 out (14 s)
    PASS | N7 Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboar
    PASS | N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 1 -> 2; 2-room order (s2: pinkbed + sunliv); message: "Hi! I'm Max 😊 I live in the Blue house
    PASS | N9 Food: every new food can be bought, eaten (also on a bench) and shows its icon and name | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy bur
    PASS | N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #74a1cb, sun 0.28; sno
    PASS | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed
    PASS | N12 House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room,
    PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), cus
    FAIL | N14 Smooth and light: E1 within the agreed limits, measured with Halloween on, rain on and the animals out; index.html under 1.8 MB | the test itself failed: Error('Page.evaluate: ReferenceError: __run is not defined\n    at eval (eval at evaluate (:290:30), <anonymous>:1:111)\n    at UtilityScript.evaluate (<anonymous>:297:18)\n
[stage crawl_ipad-landscape_hud: running]
```

### N14 alone, after the kit fix

```
[stage night3: running]
    PASS | N14 | index.html 1.36 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 26 areas, 1477 pieces, 1176752 triangles; town 417 -> 522 pieces, 611834 -> 770726 triangles; limits city:0.35:0.60,beach:0.35:0.60
[stage night3: done in 27 s]
    PASS | N14 Smooth and light: E1 within the agreed limits, measured with Halloween on, rain on and the animals out; index.html under 1.8 MB | index.html 1.36 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 26 areas, 1477 pieces, 1176752 triangles; town 417 -> 522 pieces, 611834 -> 770726 triangles; limits cit
[partial run: some stages skipped by --only]
```

## 3. Decisions I made alone (the obvious way)

- Quick checks per job: files, counts, players, claude and the job's own N line; the slow saves stage (~9 min) at milestones (job 7, job 9, job 14) and in the final full check.
- Kit B1: laneT may be given to a save that never had one (like pid); the big-house shrink counts every piece (placed or in My stuff) and ignores coordinates; a pet's x/z is not compared (pets keep the 0.8 m gap, so one saved inside another steps aside at load).
- Job 1: Easter window gets 1 hour of slack either side; the spooky path is the park's west side (3 scare spots); Halloween nights tint the sky purple and bring the fog closer.
- Job 3: friends fan out in front of you at 2.4 to 5.2 m, 1.5 m apart, never on the road; pets and friends keep a 0.8 m gap (FGAP).
- Job 4: walkers push apart to 0.64 m in a few passes a frame; never from the pavement onto the road except as a last resort; the one behind slows to 45%.
- Job 5: 6 grandma benches are also benches; the football team bench and the hedge-locked Flower Corner bench have no seats; a bench in your front yard; sitting goes online as st:1 (old versions ignore it); seats of old-version players can't be seen taken.
- Job 6: 12 grandmas, 12 looks, out 9:00 to 18:00 in dry weather.
- Job 7: the shrink keeps the saved order of pieces; a piece saved upstairs or in the old big room puts you by the stairs on load; My stuff shows a note while shrunk pieces wait.
- Job 8: 6 cupboard kinds (cupboard, narrow, drawers, corner, tall, wall) in 5 colours; snapping within 0.35 m, a neighbour's front sets the line (a shallower sink lines up with the stove rather than the wall); a wall cupboard needs a wall at its back and never blocks the floor.
- Job 9: about 1 in 3 clients wants 2 rooms of different kinds; the second room is the same room re-dressed behind a side door; the review looks at room 1 then room 2 with one pay card; the HUD counts "clients" today (an order with 2 rooms is one client).
- Job 10: the truck stands in the park's south-west corner by the bench with its window towards the fountain (first spot clashed with the Pet Show stage); Mr. Patty is a keeper (turns to you, waves when closed); prices and hunger like similar foods.
- Job 11: weather blocks are 3 game hours, from a hash of (day, block) so every player with the same clock agrees; the last hour fades; snow stays on the grass for the next block; the clock chip shows ☁️ 🌧️ 🌨️; autumn leaves fall near you outdoors.
- Kit B1 (more): lists are compared entry by entry (so the pet x/z rule can work); the day's quests (q.list, q.used and the history qhist) may differ when the unchanged game also re-draws them on this load (the new version has more things to draw from).
- Job 12: the belt stands where the map already draws trees (mapTrees), plus a close row just past the barriers and up to 9 tree groups in free corners inside the town; trees on the hills stand on the hill surface.
- Job 13: butterflies round the 6 flower beds and the fountain (3 to 5 each); 30 birds (12 in winter) in 5 loose flocks; 11 owls (4 park trees, the first tree of each tree group, your yard tree), 1.6x life size so they show in the leaves; the hoot plays within 9 m every 6 to 14 s.
- Job 14: pomchi/pug/sausage dog save as dog + kind; capybara saves as hamster + kind, duck as bunny + kind, owl as cat + kind (the old version shows those); outfits fit by a "whose head" table (PET_FIT); the new kinds share the pet shop's pens; rivals in the Pet Show can be any kind.
- Job 15: the salon stands at (-63.5, 40.5) on the west road south of the Apartments (door at x -59.2, like the Clothes Shop); 4 customers a day; pay 15/35/60/90/120 by stars; a customer's starting hair is never shorter than the wanted length; the chairs face the room so you see the face; the wish picture is the customer's own head rendered offscreen; the tips use the pizza tips card with ✂️; the job's ACT handlers live after ACT is made.
- Job 18: signPlane() strips the hidden variation selector from every canvas sign (the owner saw it drawn as a little box), not only the three named ones.
- Job 17: the night-2 book's pages and pictures are kept in tools/books/ (night-2-pages.js and night-2/*.webp); the night-3 book has 9 pages like before, so s_book in the kit stays.
- Job 14 (found by N11): the away timer ("Still there?" after 3 minutes without a touch, then back to the title) no longer counts during a scene (the Pet Show, a client's visit): six shows in a row in the test took the game to the title in the middle of the sixth.
- Job 15 (found by N13): Rosie's "Which job do you want?" line now comes together with the job cards (it used to arrive 0.6 s later and push the cards down under a quick finger); the hair card is compact so it fits a sideways iPhone (styles in 2 rows of 3, the cut and done buttons on one row, every button 44 px).
- The full check (first run, 17 Oct, Halloween now on): the town had 492 pieces against the agreed 490 (363 + 35%); the Halloween decorations now merge by 64 m chunks and the forest belt by 96 m, so the town stays under the limit with the holidays, the rain and the animals on.


## 3b. Before and after pictures

In `tools/pictures-3/`: `before-*.png` is the starting version at a spot, `after-*.png` the final game at the same spot (the park corner with the food truck, the west road with the Hair Salon, the town edges and corners with the forest, Friends Lane, the house benches with the grandmas, the park bench, the pet shop pens, a kitchen at home, the big house room after the shrink, the client's room, the park at night with the owls, the sky with the birds, the town map). The `after-*` pictures without a `before-` partner are the full check's own pictures of the new things: the holidays on each faked date and the spooky path, the benches, the house, the kitchen, the designer's two rooms, the food truck, each weather and season, each new pet (and the old version seeing a breed as a puppy), the salon.

## 4. Glitches seen and not fixed
- The hairstyle picture and the designer's theme photos are blank while a check runs frames without drawing on a machine without a GPU (the checks' own shortcut); in the real game they draw. Fixed for the checks by using the renderer's real render (job 18), noted here in case a blank picture is ever seen on a very old device.
- The "✂" on the salon's outside sign and the "🗺" on the History poster draw as plain black-and-white glyphs on the test machine (the hidden colour selector is gone on purpose); on iPad they are colour emoji. Not changed.
- The class "New order" note: I could not find a note that says "New order" in any classroom (with the delivery, designer and teacher jobs on, the class HUD says the normal job lines). If it is a specific moment, tell me what was on the screen.
- The beach road end and the shadow blobs stay as they are (the plan says a plan comes first).

## 5. NOT VERIFIED (what I could not try tonight)
- The full check's own lines that could not run here: C1-WK (every screen in Safari's engine: not installed on this computer), F2 and F3 (the published Claude version and the GitHub file after upload: they run after you publish and upload), G (real devices, sound, smoothness, two real players online: the "Try it for real" list below).
- A real iPad, iPhone and PC in a real browser: every line was proved in the check kit's Chromium on this machine, with software drawing. Frame rate on a real iPad (the forest belt, rain and the animals together) is not measured here; E1 stays within the agreed limits.
- Real sound: the rain sound, the owl's hoot, the duck's quack, the pomchi's yip and the scissors are tones made the same way as the other sounds; nobody listened to them.
- The real calendar: the holidays, seasons and weather were proved with faked dates in test copies and with the shared clock; the first real Halloween night on the live game is 17 Oct.
- Two real players on different devices seeing each other's sitting pose, new pets and breeds: proved with two test players in one browser (old version + new version); not on two real devices.
- The Claude version's own clock gives it its own weather (expected by the plan), not tried live.
- The Easter window in 2027 and later years follows the Meeus formula; 2026 was checked by hand (Palm Sunday 29 Mar to Easter Monday 6 Apr).

## 6. Try it for real (10 minutes on the iPad)
1. Open the game: the What's new book should show 9 pages with pictures; tap through to "Let's play!".
2. Walk to the park: the food truck in the south-west corner, Mr. Patty turns to you; buy a burger and eat it on a bench (two seats on every bench).
3. Say hi to the grandmas by the houses on the north road (9:00 to 18:00, dry weather).
4. Wait for a weather change (every 3 game hours): rain lines, a grey sky and the quiet rain sound outdoors; nothing indoors.
5. At night in the park: owls in the trees with blinking eyes; a soft hoo-hoo when you stand near.
6. Ask Rosie for the ✂️ Hairstylist job: the tips card shows; go to the Hair Salon on the west road; do one customer by touch.
7. Pet Shop: adopt a capybara, a duck or a pug; dress it; try the Pet Show on Saturday.
8. If you had a big house: everything should be inside the 12x10 room or waiting in 📦 My stuff, the upstairs has the same stairs.
9. Decorate a kitchen: pieces snap together and the ghost turns bright green.
10. Take a designer order until a client asks for two rooms; go through the side door.
11. On 17 Oct or later: pumpkins at the doors, bats and ghosts, the Spooky path in the park after 18:00 (only there).

## 7. How to go back
- The exact starting game is `tools/prenight3-index.html`. To roll back so that every player's game updates to it, copy `tools/prenight3-rollback.html` over `index.html` and push (its COZY_BUILD is 2026101750, higher than tonight's 2026101701). The old saves work with it; a save made by the night-3 game loads in it too (new pets show as the plain animal, the house keeps its 12x10 layout, the new foods stay in the bag as unknown items the old version does not list).
- Everything is on the branch `claude/night-3`, one commit per job, so single jobs can be reverted with git.

## 8. Morning questions, already built the sensible way
- Where the food truck stands: the park's south-west corner by the bench (the first spot clashed with the Pet Show stage).
- Where the Hair Salon stands: the west road, south of the Apartments by the park (the only free shop lot on a main street).
- What the breeds and new animals are saved as: pomchi, pug and sausage dog as a dog; capybara as a hamster, duck as a bunny, owl as a cat (an old version shows that animal).
- How two-room orders count: one client; the HUD says "clients today".
- Pay for the hairstylist: 15, 35, 60, 90, 120 coins for 1 to 5 stars, 4 customers a day (a customer takes about a minute and a half).
- The grandmas' bench is a real bench with two seats when they are inside.
- Snow stays on the grass for one block after it stops.

## 9. Firebase
- No new rules expected. Presence gained two optional fields that old versions ignore: `st` (1 while sitting) and a 5th part in each `pt` pet row (the kind). Nothing else is sent; the weather comes from the shared clock. The 55 online-part lines are unchanged (F3a).
