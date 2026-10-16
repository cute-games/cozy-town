# Cozy Town: NIGHT 3 (plan for the night session)

Same system as nights 1 and 2. Work alone all night. Never ask questions, never stop, never wait for "continue" or "OK".
Important work: Claude Opus 5.5 at max effort, or Claude Fable at medium effort or higher.
Keep family names out of this public repo. The credit line on the title screen stays exactly as it is.
If usage runs low: finish the job in hand, write the report, open the pull request.
This plan was red-teamed against the real game file on 16 Oct. The owner's answers (16 Oct) are under "Decisions".

## Start
1. Start from main: index.html md5 cd4a42567e44173c4f5dd04502f99504 (1,305,338 bytes, night 2 + What's new book). If it differs, read it and merge; never overwrite.
2. Backup: copy it to tools/prenight3-index.html. Make tools/prenight3-rollback.html: the same file with a higher version stamp, like tools/prenight2-rollback.html (iPads only switch to a bigger version number). "Go back to PRENIGHT 3" = put the rollback copy live. A private copy named PRENIGHT 3 also exists outside the repo (made 16 Oct, checked: exactly this file).
3. Check kit: cozy-check-v4.zip in the repo root (check version 4). Read its README-KIT.md. The old cozy-night-kit.zip is version 1: history only, don't use it.
4. Old saves: the kit's fixtures, tools/check-fixtures, and new saves made tonight with the starting version: (a) a big house with crowded rooms on both floors, (b) a designer order in progress, (c) pets of every kind with outfits, (d) a player saved upstairs. Name all test data ZZTEST.
5. Count everything before and after (areas, houses, shops, furniture, foods, clothes, hats, pets, quests, jobs, townspeople, chat phrases). Tonight only adds; nothing may go missing (check line A3).
6. Work on a new branch. One job = one commit. Quick check after each job; the full check with --full on the final file.
7. Bump the version stamp (COZY_BUILD, now 2026100902) once, at the end, so every iPad updates.
8. Before building anything: add a stage "night3" to the check kit with lines N1 to N14 (below). Every line starts as FAIL and passes only on proof. Never make any line weaker.

## Rules
- Something now, polish later: build each job in a simple, working, cozy way. Scuffed bits go on the glitch list; they don't stop the night.
- A half-done job is undone, never shipped. If a job breaks something, undo only that job and carry on.
- Old saves must keep working: coins, house, furniture, garden, pets, clothes, skills, quests, jobs. Never skipped.
- Old-version and new-version players must still see each other and visit each other.
- Smooth on iPad. New things are built light: shared materials, merged or instanced, no real lights (glow sprites like the car lights), no shadows from small things, particles only near the camera.
- Drawing work (check line E1): the owner allowed more on 16 Oct. Run the check with --e1-limits "city:0.35:0.60,beach:0.35:0.60" (town and beach: up to 35% more pieces and 60% more triangles; every other area: 10% as before). Over the limit: make it lighter first, then use fewer.
- File size: the Home Screen app downloads the whole index.html each time it looks for an update. Keep index.html under 1.8 MB (now 1.31 MB). No videos, sound files or big pictures inside it; small pictures for the book only.
- Real calendar: seasons and holidays use the device's real date, read in ONE small function, so tests can fake the date by replacing that function in the test copy. No date setting, no URL switch in the game.
- Weather: worked out only from the shared world clock (game day and hour). Same clock = same weather on every device. No new Firebase data.
- Don't change the 55 online-part lines (strip_online.py must still find them).
- Kids first: cozy, never gory. Jump scares only as described in job 1.
- Every new thing works in light and dark, on iPad, iPhone upright and sideways, and PC (keyboard). Buttons at least 44 px.
- Emoji on signs drawn as pictures: no emoji with a hidden extra character (the iPhone/iPad sign bug, idea 38).
- Make obvious decisions yourself; list them in the report.

## Decisions (owner, 16 Oct) and decisions made in the red team
- Existing bigger houses shrink to the new size (job 7). Furniture that doesn't fit goes to the player's things to place again. Nothing is lost.
- TV cat show: not tonight. The designer will make a video later. Leave the TV as it is.
- More drawing work is OK for the town and the beach (limits above).
- Theo, the fourth friend, follows the same hang-out rule as Rosie, Finn and Luna.
- Pets get the same "no pile-up" gap.
- Jump scares only on a marked spooky path at night.
- Pomchi, pug and sausage dog are dog breeds. New animals get simple models in today's style; workshop models can replace them later.
- New foods are sold from a food truck in the park, and at the Market.

## Jobs, in this order (the order is the priority)

### 1. Holidays from the real calendar (Halloween starts 17 Oct: first)
- Halloween, 17 Oct to 1 Nov: jack-o'-lanterns at shop doors and on Friends Lane, bats, cobwebs, little friendly ghosts, orange and purple garlands. At night the pumpkins glow (glow sprites) and the town feels creepier (a purple tint in the night sky and fog).
- Jump scares: a marked "👻 Spooky path" in a quiet corner of the park, with a sign. Open after 18:00 game time. On the path, 3 spots where a ghost or skeleton pops up with "BOO!", a quick wobble and a soft sound (only if sound is on). Each spot once per night per player. Never during jobs, class, cut-scenes, sleep, the bus or the Pet Show.
- Christmas, 1 Dec to 6 Jan: a big Christmas tree in the park (reuse the "Holiday tree" furniture model, scaled up), presents under it, lights on houses and lamp posts (glow sprites), wreaths on doors. More snow in this window (job 11).
- Easter, Palm Sunday to Easter Monday (Western Easter by the calendar rule; 2027: 21 to 29 March): painted eggs in the park and gardens, bunny decorations, pastel garlands.
- Other dates: nothing shows. Decorations are added or removed when the game loads and when the real date changes while playing. The player's own home: nothing forced.
- Check with faked dates: 25 Oct (day and night), 20 Dec, 28 Mar 2027, 10 Feb (nothing).

### 2. Rosie is silent
- Rosie makes no sound at all: no chat blip when you talk to her, no ding when her phone messages arrive, nothing she triggers. Her messages still show, with the badge.
- Other friends, the chef and clients keep their sounds.
- Where: SFX.talk in the friend chat; SFX.ding with her messages (addMsg 'ro', rosieLater, the job messages, showNote for 'ro').

### 3. Hanging out: friends stand where you can see them
- Today friends use the pets' follow code (followStep, nearMe, fOff): they aim 2 m behind you and wait where they are, so they stand behind your back, close together.
- New, for Rosie, Theo, Luna and Finn: when you stop, they walk to spots in front of you: a fan at about 2.5 to 3 m (left, middle, right; a 4th further out if needed), at least 1.2 m apart, facing you. Never behind your back while you stand still. You turn more than about 90 degrees and stand still: after about 1.5 s they walk back into view. Walking: they follow as today. Doors, stairs and the bus: as today. Never in a doorway, furniture, water or the road.
- Pets: no pet stands inside you, another pet or a friend (at least 0.8 m apart). They still wait behind you.

### 4. Townspeople give way
- Today walkers (24, class Walker) follow their paths and never check each other, so they pass through.
- New: face to face, one steps about 0.7 m to its right (never onto the road), passes, then steps back. Same direction: the one behind slows down. Waiting walkers count too. They also go around bench sitters, grandmas, friends, pets and players.
- Cheap: only walkers near each other are compared.

### 5. Sit on every bench and eat there
- Today about 17 benches; only the beach bench has "Sit". Three people sit in the middle of park benches by the fountain (SITTERS).
- New: every bench (town, park, football field, lake, bus stops, the beach, your yard) has 2 seats. Tap a free seat: sit, like the beach bench. Move: stand up.
- The 3 park sitters move to one seat, so you can sit beside them.
- Sitting, the bag opens as usual and eating doesn't make you stand up.
- Other players see you sitting (send the sit pose like the bed pose; mpPose only knows lying down today). Old versions just see you standing there.
- Two players never share a seat: the second gets the other seat, or "This bench is full".

### 6. Grandmas on benches by the houses
- New benches next to at least 3 town houses (not Friends Lane plots), each with 2 grandmas (grey or white hair, buns, glasses, cardigans; all different looks).
- They chat: small speech bubbles (🧶, ☕, "Oh my!", "In my day…", "Lovely weather!"), take turns, nod, laugh.
- "Say hi": a kind grandma line, never the same twice in a row.
- Out 9:00 to 18:00 in dry weather. Rain, snow or night: they go inside, and you can sit on their bench. Until job 11 is in, treat the weather as dry.
- A bench with grandmas on it is full.

### 7. House: level 10 adds an upstairs; the downstairs doesn't grow
- Today, at Decorating 10 and 2,500 coins, the downstairs grows from 12 x 10 to 18 x 14 (homeShell), all furniture is pushed apart (growFurniture: x 1.5 across, x 1.4 deep), and an 18 x 14 upstairs is added. The outside on Friends Lane only gets taller.
- New: the downstairs stays 12 x 10, nothing moves, and the upstairs is 12 x 10 with the same stairs. Price and level stay. The outside stays as today (2 floors).
- Existing bigger houses (owner's decision): shrink once, when the save loads:
  - Downstairs: undo the push-apart (x / 1.5, z / 1.4), then keep each piece inside the walls.
  - Upstairs: the same squeeze.
  - Keep pieces in the order they are saved. A piece that overlaps one already kept, or doesn't fit, goes to "📦 My stuff" (S.home.store, in the Home shop), with its colour, to place again. Rugs and other flat things never block.
  - One friendly note: "Your house got cozier! 🏡 3 things are waiting in 📦 My stuff to be placed again." The 🎒 bag shows the same line while any are waiting, so they are easy to find.
  - Keep a copy of the old layout inside the save, so it can be undone later.
  - A player saved upstairs or in the old big rooms starts by the stairs.
  - Lamps on or off, the shell shelf, wall and floor colours: unchanged.
- Also: visitShell (friends visiting), floor switching, decorating upstairs, quests that count both floors. Old-version and new-version friends can still visit.
- Test with every old save, especially crowded big houses. Furniture count before = placed + My stuff after.

### 8. Kitchen: no gaps, easy placing
- Root cause: the sink, stove and fridge are 0.8 m wide, but placing snaps to 0.25 m (decoUpdate: Math.round(x*4)/4). So two pieces either overlap (red) or leave a 0.2 m gap. The sink is 0.55 m deep, the stove and fridge 0.7 m, so their fronts don't line up. There are no cupboards.
- New: a kitchen piece snaps to its neighbour. Within about 0.35 m of another kitchen piece (side by side or around a corner) it moves edge to edge, with the fronts lined up. Against a wall it goes flush to the wall. The ghost is green when snapped.
- New cupboards, all 0.7 m deep, in colours (white, wood, pink, mint, sky): cupboard 0.8, narrow cupboard 0.4, drawers 0.8, corner cupboard, tall cupboard 0.8, wall cupboard 0.8 (hangs above a counter against a wall and doesn't block floor pieces). If the wall cupboard can't be made to work well tonight, leave it out and say so.
- Saved kitchens don't move. The sink keeps its size; snapping uses the fronts.

### 9. Interior designer: one or two rooms
- Today every order is one room (dsNew picks one theme).
- New: each order asks for 1 or 2 rooms, never more; about 1 in 3 asks for 2 (for example "a bedroom and a kitchen").
- The client's flat gets a second room through a door ("➡️ Room 2" and "⬅️ Room 1"). Each room has its own theme, furniture and tips.
- "All done?" only when both rooms have something. The client looks at room 1, then room 2. Stars: the two averaged (to halves). Pay: each room paid as today (DS_PAY), added together.
- An order already in a save (one room) keeps working exactly as before.

### 10. More food and a food truck
- 48 foods today; 🍬 Candy is already at the Market.
- New: 🍣 Sushi, 🍙 Rice ball, 🍔 Burger, 🍟 Fries, 🌭 Hot dog, 🌮 Taco, 🍜 Noodles, 🥟 Dumplings, 🍭 Lollipop, 🍮 Pudding. Hunger and prices like similar foods, fitting night 2's coins balance.
- A food truck in the park, near the fountain benches, off the paths: burgers, fries, hot dogs, tacos. Open 8:00 to 20:00 like the shops. Sushi, rice balls, noodles, dumplings, lollipops and pudding at the Market.
- Quests that pick random foods may include the new ones.

### 11. Weather and seasons
- Seasons by real date: spring March to May, summer June to August, autumn September to November, winter December to February.
- Trees by season: spring light green with some pink blossom trees; summer green; autumn orange, red and yellow, with leaves falling near you; winter frosted. Tree colours are set when the town loads (they are baked); a season change shows at the next load.
- Weather: sunny, cloudy, rain, snow (snow only in winter; rain rare in winter). From the shared clock: changes every few game hours with a soft fade of about 1 game hour. About: autumn rain 30%, cloudy 25%; winter snow 35%, cloudy 30%; spring rain 25%; summer rain 15%; the Christmas window snow 60%.
- Rain: grey sky, softer sun, rain lines only around you, a quiet rain sound outdoors (only if sound is on). Snow: flakes around you; the grass turns white while it snows and for the next weather block.
- Nothing falls indoors. No thunder or lightning.
- Weather cancels nothing: jobs, the bus, the beach, the Pet Show and football go on.
- The Claude version runs its own clock, so its weather can differ from GitHub's. That's fine.

### 12. More trees: the town is not an open field
- Today, past the town barriers, it is flat grass to the horizon.
- New: a forest belt, several rows deep, around the town and Friends Lane, outside the barriers (round trees and pines mixed), plus tree groups in empty corners inside the town.
- Never on roads, paths, doors, the bus route and stops, the football field, pond and lake edges, or Friends Lane plots. The lane grows west when more players join (laneGrow): no tree may stand where a future plot appears.
- Built light: low-poly trees, merged by area, no outlines far away. Season colours from job 11. They show on the map (mapTrees).

### 13. Wild animals
- Butterflies: small and colourful, around flower beds and the park in the daytime; spring, summer and autumn until 31 October; not in rain or snow.
- Birds: little flapping birds in loose flocks high over the town in the daytime; fewer in winter.
- Owls: in some trees at night (park, forest edge, Friends Lane), with big blinking eyes and now and then a soft "hoo-hoo" when you are near (only if sound is on).
- One batch per kind, no shadows, only near you.
- The code already calls night-walking townspeople "owls". Give the birds a different name in the code.

### 14. More pets: capybara, duck, owl, Pomchi, pug and sausage dog
- Today 4 kinds (puppy, kitten, bunny, hamster), no breeds.
- Pomchi, pug and sausage dog: breeds of the puppy. Every saved dog is a plain puppy. Send other players type "dog" plus the breed, so old versions show a puppy.
- Capybara, duck and owl: new kinds. Each needs everything the 4 kinds have: model, colours, names, sound (capybara a soft squeak, duck a quack, owl a hoot), food, toy, every outfit slot sitting right, name tag height, follow size, poses, the Pet Show (tricks, poses, rivals), the adopt panel, the pet shop, the bag list, pet quests, other players' view.
- Old versions skip unknown kinds without crashing (mpPetsBuild); keep it that way.
- Simple models in today's style.

### 15. Hairstylist job (the biggest; last of the building jobs)
- New: a "✂️ Hair Salon" on a main street (a free spot; on the map; open 8:00 to 20:00 like shops). Inside: 2 salon chairs, mirrors, a sink, shelves of dye bottles, hairstyle posters.
- The 4th job: Rosie offers it like the others (a "✂️ Hairstylist" job card), with a first-time tutorial like the other jobs.
- A customer comes in and sits. A card shows a picture of the hairstyle they want (the customer's own face with the target hair).
- Tools: ✂️ scissors make hair shorter (long, shoulder, short; it can't grow back), 🪮 the comb picks the style (straight, bob, ponytail, bun, pigtails, curly), 🎨 dye picks the colour (8 colours). The hair changes as you work. "✅ Done!" ends it.
- Stars 1 to 5 by how close the result is (length, style, colour, and not cutting too much). Pay by stars, balanced per real minute with the other jobs (night 2 coins balance). The customer is always kind, even with a funny result.
- Works by touch and on PC.

### 16. TV cat show: not tonight
Leave the TV as it is. Note for later: a video must be a separate file (never inside index.html), and the Claude version can't load separate files; decide that when the video arrives.

### 17. What's new book for night 3
A new 9-page book in the same style: one picture and 1 to 3 short kid lines per page; Back, dots, Next; the last page says "Let's play!". Pictures fresh from the final game, small (about 20 KB each), no test names in view. It replaces the night-2 book in the game; keep the night-2 book's pages and words in the repo (tools/books/) so nothing is lost. If the page count changes, update s_book in the kit.

### 18. Glitch hunter pass (time-boxed, last)
Play, screenshot, inspect and fix tonight's new work: holidays (faked dates), benches, grandmas, house (old big-house saves), kitchen, designer 2 rooms, food truck, each weather and season, trees, animals, each new pet, the salon. Also the watch spots: the class "New order" note, the world map poster, Mrs. Maple's name tag on phone sizes, and the cut sign words ("To the beach", "The world", "History": take out the hidden extra character after the emoji). The beach road end and the shadow blobs stay as they are (a plan comes first).

## Not tonight
The TV cat show (waiting for the video), the beach road end and shadow look, a private world, pizza for two players, tennis with a friend, more clothes, other new places.

## Night-3 check lines (stage "night3": every line starts as FAIL)
- N1 Holidays: with faked dates, Halloween shows 17 Oct to 1 Nov, Christmas 1 Dec to 6 Jan, Easter Palm Sunday to Easter Monday; nothing on other dates; jump scares only on the spooky path, never in jobs, class, sleep or scenes.
- N2 Rosie: zero sounds while chatting with her and when her messages arrive; other friends still make their sound.
- N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet.
- N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m.
- N5 Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose.
- N6 Grandmas: out in dry daytime; inside in rain, snow and at night; their bench is full while they sit.
- N7 Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged.
- N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes.
- N9 Food: every new food can be bought, eaten (also on a bench) and shows its icon and name.
- N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors.
- N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and doesn't crash on new kinds.
- N12 House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing.
- N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars.
- N14 Smooth and light: E1 within the agreed limits, measured with Halloween on, rain on and the animals out; index.html under 1.8 MB.

## Morning report: tools/NIGHT-3-REPORT.md
1. Every change: item, old -> new.
2. Check output per job, exactly as printed, and the final full check (with --full and --e1-limits). For the backup line A2: --backup tools/prenight3-index.html, and in --backup-title the date the check confirms the copy.
3. Before and after pictures (tools/pictures-3/): holidays (each date), benches, grandmas, house before and after the shrink, kitchen, designer 2 rooms, food truck, each weather and season, trees, animals, each new pet, the salon.
4. Glitches found and not fixed.
5. Everything NOT VERIFIED: real devices, sound, how it feels, two real players, how scary the jump scares feel for kids.
6. "Try it for real" tasks, short, to play and tick off.
7. How to go back: tools/prenight3-rollback.html.
8. Morning questions, each already built in a sensible way.
9. Firebase: no new rules expected (weather comes from the clock). If anything needs one, one complete rules block to paste.
Then open a pull request into main.
