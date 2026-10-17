# Cozy Town: RUN 4 (plan for one long Claude Code session)

Same system as nights 1 to 3. Work alone. Never ask questions, never stop, never wait for "continue" or "OK".
The owner wants every idea on the 17 Oct list built now, then a full GLITCH HUNTER pass. Build all of it.
Important work: Claude Opus 5.5 at max effort, or Claude Fable at medium effort or higher. One job at a time (no Ultracode, no parallel builders on index.html).
Keep family names out of this public repo. The credit line on the title screen stays exactly as it is.
This plan was checked against the real game file on 17 Oct (night 3 live). The owner's decisions (17 Oct) are under "Decisions".

## Three stages, three pull requests, no stopping in between
- Stage 1 (jobs 1 to 9): the one clock, the same game for everyone, Halloween, signs and look fixes, grandmas, map, small things. Full check, then pull request "Run 4, stage 1" into main. Do not wait: go straight on.
- Stage 2 (jobs 10 to 18): levels to 50, garden, house floors and colour, the other holidays, pet shop upstairs, furniture, tutorials, photographer, tree park, parties. Full check, then pull request "Run 4, stage 2".
- Stage 3 (job 19): the GLITCH HUNTER pass and the critic loops on everything from stages 1 and 2. Full check, then pull request "Run 4, stage 3".
- Branches: claude/run-4-s1, then claude/run-4-s2 made from s1, then claude/run-4-s3 made from s2. Each pull request goes into main.
- One job = one commit, pushed at once. If the session stops (usage, error) and starts again: read tools/RUN-4-REPORT.md "Progress", undo any half-done job, carry on from the next one.

## Start
1. Start from main: index.html md5 709bf763d51be0160c118e2f9249f9f6 (1,355,180 bytes, night 3, COZY_BUILD 2026101701). If it differs, read it and merge; never overwrite.
2. Read tools/NIGHT-3-REPORT.md (what exists and why) and the "Rules" of NIGHT-PLAN-3.md. They all still hold unless this plan says otherwise.
3. Backup: copy the starting file to tools/prerun4-index.html. Make tools/prerun4-rollback.html: the same file with a version stamp bigger than any stamp this run ships (set it at the end of stage 3: the last stamp + 49). "Go back to PRE-RUN 4" = put the rollback copy live. A private copy named PRE-RUN 4 also exists outside the repo (17 Oct, checked: exactly this file).
4. Check kit: cozy-check-v5.1.zip in the repo root (check version 5.1, uploaded with this plan). Not cozy-check-v5.zip: version 5 put the online part in by its old line number, so night 3's own check tested a GitHub file with the Firebase scripts in the wrong place; 5.1 places it by its neighbouring lines and stops if it can't. Read README-KIT.md. Make version 6 from 5.1 before building anything: a stage "run4" with lines N15 to N41 (below). Every line starts as FAIL and passes only on proof. Never make any line weaker. Night-3 lines whose subject the owner changed today (N1 holiday dates, N6 grandmas, N10 weather, N14 limits) are rewritten to the new design, never weaker; list each one old -> new in the report. Save the kit as cozy-check-v6.zip in the root (v5 and v5.1 stay as history).
5. Old saves: the kit's fixtures, tools/check-fixtures, and new saves made with the starting version: (a) a player on day 58 with a garden growing, a designer order and a hairstylist customer in progress, (b) a player on day 1, (c) a player in bed at night, (d) a player at level 10 in every skill, (e) a player with every pet kind and outfits, (f) the big-house and upstairs fixtures. Name all test data ZZTEST.
6. Count everything before and after each stage (areas, houses, shops, furniture, foods, clothes, costumes, hats, pets, quests, jobs, townspeople, chat phrases, signs, benches). This run only adds, except the four things the owner asked to remove: the 12 grandmas, the pond bridge, the old trash looks, the park's spooky path (it moves to the Flower Corner). Nothing else may go missing (check line A3).
7. Version stamp (COZY_BUILD): bump once at the end of each stage: the date of that day + a counter, always bigger than the stamp now live (2026101701, or the last stage's stamp).

## Rules (on top of NIGHT-PLAN-3 "Rules")
- Something now, polish later: each job simple, working and cozy. Scuffed bits go on the glitch list; stage 3 cleans them.
- A half-done job is undone, never shipped. If a job breaks something, undo only that job and carry on.
- Old saves keep everything: coins, house, furniture, garden, pets, clothes, skills, quests, jobs. Never skipped.
- Old-version and new-version players still see and visit each other. New shared things go in presence or lane fields that old versions ignore (like night 3's `st`). Don't change the 55 online-part lines (strip_online.py must still find them). If something truly needs a new Firebase path, write one complete rules block in the report.
- The same for every player on every device (owner, item 27): anything other players can see comes from the one clock, the data sent online, or a seeded hash. Never Math.random for shared things.
- Smooth on iPad. Built light: shared materials, merged or instanced, glow sprites instead of lights, no shadows from small things, particles only near the camera.
- Drawing work (E1), counted from the starting file: run the check with --e1-limits "city:0.15:0.25,pets:1.0:1.0" (town: up to 15% more pieces and 25% more triangles, measured in October with Halloween, rain and the ghosts on; pet shop: up to double, for its second floor; every other area 10% as before). The house: with 6 floors, only the floor you are on and the stairs are drawn in full, so "home" stays within 10%. The tree park is a new area: add a rule to E1 in kit v6 that it may use at most the pieces and triangles the beach uses now. Over a limit: make it lighter first, then use fewer.
- File size: index.html under 1.8 MB (now 1.36 MB). No videos, no sound files, small pictures for the book only.
- Real calendar: only through realDate() (night 3), so tests fake dates by replacing it in the test copy.
- Kids first: cozy, never gory. Scares soft (job 3).
- Every new thing works in light and dark, on iPad, iPhone upright and sideways, and PC (keyboard). Buttons at least 44 px. Touch on iPad, keys on PC.
- Every new screen and card: same look and rules as the existing ones of its kind (job cards like the hairstylist's, panels like the shops', signs through signPlane).
- Make obvious decisions yourself; list them in the report.
- BUILDER: for every area a job changes, write one "should look like" line in the report. Stage 3 checks against these lines.

## Decisions (owner, 17 Oct)
- Build everything on the list now, then the GLITCH HUNTER pass.
- One clock for everyone, no matter what: the same time, weekday and weather for every player at the same moment. Same speed as now. No day numbers anywhere: only the weekday and the time, like "9:40 Wed". The clock never pauses. No more night skip: in bed you wait for 7:00 on a cozy sleep screen.
- Seasons follow the real calendar (as now).
- "The flower garden spot" = the Flower Corner (north-west block, x -23.4 to -10.6, where the house stood before Friends Lane). It holds each holiday. In months without a holiday it stays the flower garden it is now.
- Max level 50 for every skill (now 10 for all), so all skills follow the same rule.
- Holidays fill their whole month: Halloween 1 to 31 Oct (was 17 Oct to 1 Nov), Valentine's February, Easter in the month of Easter Sunday (was Palm Sunday to Easter Monday), Christmas 1 to 31 Dec (was 1 Dec to 6 Jan). New Year: fireworks every game night from 28 to 31 Dec; party hats and confetti on 31 Dec and 1 Jan. School party on 1 Sep.
- Santa: once per real day in December. 10 coins on 1 Dec, rising evenly to 300 on 31 Dec.
- The bus (item 19) works as designed: 3 days a week, the days change each week. No change; only make sure it works with the one clock.
- The six benches by the town houses stay as benches; only the grandmas go.
- Asked again, not answered yet: which map is "gone" (job 7 says how to decide), and whether a friend lost progress (the saves stage covers it).

## STAGE 1: jobs in this order (the order is the priority)

### 1. One clock for everyone (owner 17 Oct; list items 15 and 2)
- Game time is one formula of the real time, the same on every device: the same speed as now (hourLen). Real time = the device clock, corrected by the web server's Date header (the update check already fetches index.html from GitHub Pages, same site: keep the offset; none in the Claude version).
- Remove: taking another player's clock (the 30-day rule, mpClock, clockFrom, clockJump), the clock pause when nobody plays, the night skip (zzSkip).
- The day number becomes the shared day from the formula. Never shown. Find every use of S.day and the day number: nothing may loop over skipped days; an old save jumps once (day 58 or day 1 to the shared day) and loads in under 1 second; gardens finish growing, daily limits reset, the day's quests are drawn fresh, the Pet Show week and the bus timetable follow the shared day. Nothing in the save is lost.
- Shown: "9:40 Wed" in the clock chip and on the phone; "Good morning! It's Wed ☀️"; the bus pill with weekday names only. Nowhere "Day N": not in toasts, quests, Rosie's lines, the phone or the What's new book.
- Beds: from 21:00 you can lie down; a soft sleep screen (💤, the time, a "Wake up" button); at 7:00 "Good morning!". No skip.
- Weather: from the one clock (night 3's 3-game-hour blocks and fades), so it changes at the same moment for everyone.
- Item 2: in rain, snow and cloudy weather the sky turns grey, never bright blue and sunny. The owner saw rain under a blue sky: find the root cause. Check morning, noon, evening and night.
- Done when N15 and N16 pass.

### 2. The same game for everyone (items 27, 26, 25)
- Updates: a newer file found while playing -> save, then reload by itself at the next calm moment: not during a job card, scene, class, the Pet Show, the bus, a photo shoot, a dance round, the spooky path, or while typing. A short "✨ Updating Cozy Town…" note first. At most once per new version per session (keep the loop guard). On the title: as now.
- Old-version players: send the version stamp in presence; a player whose presence has no stamp or a smaller one shows "⏳ older version" by their name (friends list and name tag). Nothing else changes for them.
- Item 26: a friend on a PC saw a kitchen in the middle of the room that the owner placed by the wall on an iPad. Find the root cause. Suspects: an older version draws the old 18x14 room around the new 12x10 layout; the shrunk layout not sent online after the shrink; rounding or turn differences between devices. Fix it. Test: one player at iPad size and one at PC size visit each other's houses (fixtures include the shrunk big house): every piece has the same x, z, turn and floor.
- Item 25: on the stairs a window blocks the view for some players, not for others. Find why (house side on the lane, house kind, version, screen shape). Fix it for every house: no wall or window across the view anywhere on the stairs.
- Item 27: list everything others can see: time, weather, houses (floors, colour), furniture, gardens, holiday pieces, ghosts, trash, walkers, grandmas, pets, clothes, costumes, models. Prove each is the same for two players (N18).

### 3. Halloween, all of October (items 1, 4 October part, 13, 31)
- Window: 1 to 31 Oct (was 17 Oct to 1 Nov). Everything else night 3 built for Halloween stays.
- Costumes (item 1): in October the Clothes Shop sells a cat, a dog, a ghost and a dinosaur costume. A costume is worn over your clothes (one tap on, one tap off), saved, and seen by other players (old versions show normal clothes). Prices like the dearer clothes. After October you keep and can wear what you bought; the shop stops selling them.
- The spooky path moves to the Flower Corner (job 4 builds the spot) and is a bit bigger: at least 20% longer than the park's path, winding, with its sign and the "Open after 18:00" sign. The park's path and its sign go.
- Scares: a ghost, a skeleton, a zombie, a bat swarm and a pumpkin head (5 kinds or more, never gory). When one pops up, your character stops and turns smoothly to face it so you always see it, a little camera shake, a soft spooky sound (only with sound on). No loud sounds. Each spot once per night per player, as now; never in jobs, class, scenes, sleep, the bus or the Pet Show.
- Ghosts (item 31): in October little friendly ghosts float around everywhere in town (streets, park, Friends Lane, the Flower Corner), not only the park. One batch, no shadows, never inside buildings.
- Item 13: near the Flower Corner some decorations float just above the ground. Every holiday piece sits on the ground or hangs on something (garlands between posts or walls, cobwebs in real corners). Check every Halloween, Christmas and Easter piece: no gap under it bigger than 2 cm.

### 4. The holiday spot at the Flower Corner (item 4, the spot itself)
- A gate in its low fence opens in a holiday month; you can walk in; it closes (back to the flower garden to look at) in other months. Collision, the map and the walkers follow.
- Stage 1 builds the spot and the October path. Stage 2 (job 11) adds February, Easter and December.

### 5. Signs and text (item 7)
- Check every sign and every text drawn in the world, including what the grandmas say: centered, inside its box with a margin, easy to read.
- Root cause first: the test machine has no colour emoji, the iPad has. Make signPlane fit by the pixels it really drew (draw, find the inked bounds, then scale and center), not by measureText alone, so a wider emoji on an iPad can't push text off-center or off the edge. Install a colour emoji font (Noto Color Emoji) and Playwright WebKit for the checks if you can; if not, say so in NOT VERIFIED.
- Known: beach signs and the History class sign (off-center, half cut off); the Pet Show sign (thin dark spikes through the letters, "Pet" reads "Pel" from far); the "Open after 18:00" sign (its post runs through "after"); the food truck sign (the roof hides the top of the letters, a round yellow light covers the "F").

### 6. Look fixes (items 14, 16, 17, 18)
- Food trucks: they flicker and look mixed into other shapes. Find every truck (the owner also mentions one by the Pet Show stage). No two surfaces closer than 1 cm facing the same way. On that truck: the left end of the sign is jagged and mixed with another layer, the burger picture is half covered by a dark block, white specks on the sign. Clean all of it.
- Clouds: they look like grey rocks, day and night. Make them soft and fluffy (soft puffs, no outlines, no hard dark shading; gently lit at night).
- Trees by buildings: a tree at a building corner by the main road has leaves going into the building and a white smear on the wall beside it. Check every tree near every building: no crown inside a wall; find and remove the smear's cause.
- Orange specks: small orange diamonds float high in the night sky, far above the trees. Find what they are (suspect: the autumn leaf particles). If they are leaves: make them leaf-shaped and fall from tree crowns near you, low. Otherwise remove them.

### 7. Map (item 10)
- There are two maps: the small corner map (town only, inside the job box) and 📱 -> 🗺️ Map. Find which one players lose and when (no job? small screens? after the beach? a device?). Bring it back in the newest design (the 📱 Map look from night 2) wherever it is missing.
- Fix: the arrow that shows which way you face freezes when you turn (it must turn every frame you turn). For one friend the whole map was only green: find the root cause (suspects: the map picture failing on a smaller device, a canvas too big for its memory, drawing before the town is ready) and fix it.
- Everyone sees the same working map on every device.

### 8. Grandmas (items 8, 20)
- Remove all 12 grandmas by the town houses. Their 6 benches stay as normal benches with seats.
- Three grandmas in town. Sometimes they sit on the bench already by the duck pond, feed the ducks (little crumbs, the ducks come closer) and chat about the ducks and life. They also walk around town, stop near different places (the shops, the school, the park, the Flower Corner, the bus stop, the beach gate…) and talk about those places. "Say hi" gets a kind line, never the same twice in a row. Out 9:00 to 18:00 in dry weather, as before. Where they are comes from the one clock, so everyone sees them in the same place.

### 9. Small things (items 3, 11, 24, 19) and the stage-1 book
- Pond: remove the bridge over the pond with the ducks; the water is solid all round again. The ducks stay.
- Trash: replace today's simple trash with soda cans, crumpled paper, banana peels and coffee cups. Picking up works as before.
- Notes: a switch in Settings, "✏️ Notepad": off hides the "Write here" notepad, on brings it back. The notes are kept. Default on.
- Bus: no change (by design); prove it works with the one clock (N41).
- What's new book: pages for stage 1 (same style as night 3: one picture, 1 to 3 short kid lines per page, Back, dots, Next, "Let's play!"). Keep earlier books in tools/books/. Update s_book in the kit if the page count changes.
- Then: the full check, the stage-1 part of the report, pull request "Run 4, stage 1". Go straight on.

## STAGE 2: jobs in this order

### 10. Levels to 50, garden, house floors, house colour (items 21, 22, 23)
- Every skill: max level 10 -> 50 (same XP rule and level-up coins as now). A player already at 10 carries on from 10.
- Garden: 6 more seed spots at gardening level 10, 20, 30, 40 and 50 (30 more at 50). They fit the yard, never on paths. Other players can see your garden when they pass or visit (lane data; old versions ignore it).
- House floors: one more floor every 10 decorating levels: 2 floors at 10 (as now), 3 at 20, 4 at 30, 5 at 40, 6 at 50 (max). Each floor 12x10 like the others; the stairs continue up in the same design; no window across the stairs (job 2). The outside on Friends Lane grows with the floors, for everyone. Only the floor you are on and the stairs are drawn in full.
- House colour: paint the outside of your house any colour: 12 ready colours (purple, pink, blue, green and others) and a "pick any colour" slider. Only the colour changes. Free. In the decorating panel. Everyone sees it.

### 11. The other holidays (items 4, 5, 6)
- At the Flower Corner (job 4 spot):
  - February, Valentine's: a heart fountain, pink petals drifting with the wind.
  - Easter month (the month of Easter Sunday): a bunny asks you to find 25 eggs hidden around town (the same spots for everyone that year, each player finds their own; a counter). He keeps the reward a secret. All 25: a bunny costume and 50 coins, once a year. Night 3's Easter eggs and bunting follow the new window; no decorative egg looks like a hunt egg.
  - December, Christmas: the big Christmas tree moves here from the park (with its presents). Santa gives coins once per real day: 10 on 1 Dec, a bit more each day, 300 on 31 Dec.
- New Year: fireworks in the night sky every game night from 28 to 31 Dec. On 31 Dec and 1 Jan everyone (players and townspeople) wears a party hat and confetti falls.
- School, 1 Sep: balloons around and inside the school. Talk to a teacher: a little globe for a table or desk (a furniture piece), once per player per year.
- Check every date with faked dates (N20 to N22).

### 12. Pet shop upstairs (item 12)
- A second floor with stairs. Upstairs: the animals, each kind in its own fenced area so they never mix (dogs with their breeds, kittens, bunnies, hamsters, capybaras, ducks, owls). Downstairs: shelves with pet clothes and snacks. Adopting and buying work as before.

### 13. More furniture (item 28)
- A lot more furniture of every kind: at least 60 new pieces spread over all kinds (beds, sofas, chairs, tables, lamps, rugs, plants, shelves, kitchen, bathroom, kids' room, decorations, outdoor), several colours each, low-poly in the game's style, prices like similar pieces. Also the disco floor and disco ball (job 17) and the school globe (job 11). Every piece can be bought, placed, saved and seen by visitors; the designer job can use them.

### 14. Job tutorials (item 30)
- The hairstylist and pizza delivery jobs get a visual tutorial: 3 to 5 picture steps with arrows and a pointing hand, almost no reading. Shown the first time and from a "?" on the job card.

### 15. Photographer job (item 9)
- Rosie offers it as the 5th job (same way as the others), with a first-time tips card and the job box.
- A booking arrives as a text message: a family, a wedding, a birthday, pets with their owners… with the place. The map shows the way.
- At the spot: pick the background (2 or 3 per spot). Tap a person to see pose buttons (wave, smile, peace sign, jump, hug, sit…) and pick a pose for each one. Then frame, zoom and snap.
- Pay by how good the photo is (stars 1 to 5, pay 15/35/60/90/120 like the hairstylist): everyone in the frame and nobody cut off, faces towards the camera, everyone posed, the people filling the frame well, the background fitting the booking. A perfect photo gets 5 stars.
- The client's thank-you message shows the photo. 4 bookings a game day. Touch and keyboard.

### 16. Tree adventure park (item 29)
- A free climbing park up in the trees, in the woods near the Toy Store. It is its own area (like the beach), entered through a wooden gate in the woods there, so the town stays smooth.
- Wooden paths, platforms to jump between, zip lines. Three paths with signs: easy, medium and hard; you choose one at the start. Falling puts you gently back at the last platform (no harm, cozy). On the map.

### 17. House parties and the dance game (item 32)
- At your mailbox: "📬 Check mail" or "🎉 Host a party". To host, pick a time on the one clock (like 21:00). Everyone playing gets a notification with the host's name ("NAME is hosting a party! Go check it out.") and can accept or decline. Accept: the way-finder leads to the host's house at that time.
- Dance party: the host buys a disco floor and a disco ball at the furniture shop and places them; then the party is a dance party.
- Dance game, two players a round (others watch and can take the next round): arrows fall down the screen; press the matching arrow at the right moment (arrow keys on PC, four big arrow buttons on touch). Each hit makes your character do a dance move. The two characters dance side by side.
- Score bar at the top: both faces (rendered heads, like the hairstylist's wish picture). Whoever has more points pushes the other toward the edge; when even, they meet in the middle and you still see both. The faces slide smoothly and never jump.
- Online through presence fields; old versions ignore the invite and don't crash.

### 18. Stage-2 book, full check, pull request
- What's new book for stage 2 (it replaces the stage-1 book; keep it in tools/books/).
- The full check, the stage-2 part of the report, pull request "Run 4, stage 2". Go straight on.

## STAGE 3

### 19. GLITCH HUNTER pass (the team from the Dictionary, played by you in turn) and the critic loops
- PHOTOGRAPHER: play a copy of the game (fake internet, ZZTEST players, two players together) and screenshot every place, every building inside, every new thing, every screen, panel, card, job step, tutorial, the party and dance game, the photographer view, the tree park paths; on iPad, iPhone upright and sideways, and PC; light and dark; day, night, rain; October and faked holiday dates. Keep a map of where each picture was taken.
- CHANGE-SPOTTER: compare each picture with the night-3 picture of the same spot (tools/pictures-3); changed and new pictures go on.
- PHOTOVIEWER: look closely at every changed or new picture and mark anything scuffed (cut text, overlaps, flicker, floating things, wrong colours, gaps, things inside walls, tiny buttons, unreadable text, anything off the screen), against the "should look like" lines.
- DOUBLE-CHECKER: a fresh helper (a new sub-agent that never saw the marks being made) looks again only at what was marked and throws out false alarms.
- REPORTER: tools/GLITCH-LIST-4.md: fixed IDs (G4-001…), place, device, what's wrong, how bad (1 small, 2 clear, 3 broken), one small picture, status.
- FIXER: fix each from the root cause. FIX-CHECKER: before and after picture of each fixed spot: fixed, not fixed, or something else broke.
- Loop the whole pass until one full pass finds nothing new.
- CRITIC loop (the owner asked for it on 17 Oct) for the big changes: the photographer job, the tree park, the parties and dance game, the holiday spot, the house floors and colour, the one clock. Each round a fresh critic (a new sub-agent) sees only the result (pictures and the "should look like" lines), never earlier scores, and scores 1 to 10. Below 8: fix and go again. Done after three 8s or more in a row. After 6 rounds without that: stop that loop and write where it's stuck.
- GUARD: test copies only, never push to main, no keys anywhere.
- Then: the stage-3 book changes if any, the full check, the stage-3 part of the report, pull request "Run 4, stage 3".

## Run-4 check lines (stage "run4": every line starts as FAIL)
- N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s.
- N16 Rain sky: in rain, snow and cloudy weather the sky top and bottom are grey, never bright blue, at 8:00, 12:00, 18:00 and 23:00.
- N17 Updates: a newer file appears while playing -> the game saves and reloads by itself at the next calm moment, never inside a job, scene, class, show, bus ride, shoot, dance round or typing; never twice for one version; an older-version player shows "⏳ older version".
- N18 Same for everyone: an iPad-size player and a PC-size player see the same time, weather, every house's floors and colour, every furniture piece (x, z, turn, floor) on visits, gardens, holiday pieces, ghosts, trash, grandmas; on every house's stairs no wall or window crosses the view.
- N19 Halloween: October 1 and 31 (day and night) show it, 1 Nov doesn't; costumes on sale only in October, wearable, seen by others, kept after; the spooky path at the Flower Corner at least 20% longer than the park's was, at least 5 scare kinds, each turns you to face it with a small shake and a soft sound only with sound on; ghosts all over town, none inside; every holiday piece touches the ground or a support (gap under 2 cm).
- N20 Holiday spot: February heart fountain and petals; in the Easter month the bunny and 25 eggs (all 25 -> bunny costume and 50 coins, once a year); December Christmas tree and Santa (10 coins on 1 Dec, 300 on 31 Dec, once per real day); other months the flower garden as before.
- N21 New Year: fireworks every game night 28 to 31 Dec; party hats on everyone and confetti on 31 Dec and 1 Jan; nothing on 2 Jan.
- N22 School: on 1 Sep balloons around and in the school; a teacher gives the globe once; nothing on 2 Sep.
- N23 Signs: every sign's text centered (within 3% of the sign) and inside its box with a margin, with and without a colour emoji font; the four named signs clean; no post, roof, light or spike crosses any sign's text.
- N24 Grandmas: exactly 3; none by the town houses; they sit on the duck-pond bench feeding the ducks at times, walk to places and talk about them; the same places for two players.
- N25 Photographer: one booking plays from the message to the pay on iPad, sideways iPhone and PC; a perfect photo gets 5 stars; a photo with someone cut off gets fewer.
- N26 Map: the corner map and 📱 Map draw the town (never one flat colour) on every screen size; the facing arrow turns every frame you turn; the corner map shows wherever it should.
- N27 Trash: only cans, paper, peels and cups; picking up still works.
- N28 Pet shop: two floors; each kind in its own area upstairs, no kind in another's area; clothes and snacks on shelves downstairs; adopting and buying still work.
- N29 Pond: no bridge; nobody can walk on the water.
- N30 Sky: clouds soft (no outlines, no hard dark faces) by day and night; no orange specks above the trees; any leaves are leaf-shaped and near trees.
- N31 Trees: no tree crown inside any building; no white smear on any wall.
- N32 Food trucks: no flicker (no two surfaces closer than 1 cm facing the same way); the sign and the burger picture clean.
- N33 Levels and garden: every skill reaches 50 and stops there; +6 seed spots at gardening 10/20/30/40/50; another player sees your plants.
- N34 House floors and colour: 2 floors at decorating 10 up to 6 at 50; the stairs work up and down on every floor; the outside shows the floors and the chosen colour, also for others; old saves keep every piece.
- N35 Notepad switch: off hides it, on brings it back with the notes kept.
- N36 Furniture: at least 60 new pieces across every kind, each buyable, placeable, saved and seen by a visitor.
- N37 Tree park: each of the three paths can be finished; zip lines work; signs readable; free; a fall puts you back on the last platform; on every device.
- N38 Tutorials: the hairstylist and pizza jobs show a picture tutorial the first time and from "?".
- N39 Parties: host at the mailbox and pick a time; every online test player gets the note with the host's name and can accept or decline; with a disco floor and ball the dance game runs for two; hits make dance moves; the score bar slides smoothly (never jumps), even = middle with both faces; an old version doesn't crash.
- N40 Smooth and light: E1 within the run-4 limits (town 15%/25% with Halloween, rain and ghosts on; pet shop up to double; home within 10% with 6 floors; the tree park within the beach's size; others 10%); index.html under 1.8 MB.
- N41 Bus: with the one clock the bus still comes 3 days a week and the pill shows the next bus with its weekday.

## Pre-mortem (how this run could fail, and what stops it)
- Usage runs out mid-run: push after every job, a pull request after each stage, the "Progress" section in the report to restart from.
- The clock jump breaks old saves (loops over thousands of days, NaN, a frozen load): audit every day-number use; the day-58 and day-1 fixtures; the load-time line in N15.
- The automatic update loses progress or loops: save first, the loop guard, never in calm-less moments; test with a faked newer file.
- Old and new players stop seeing each other: only optional presence fields; the players stage with an old and a new version together.
- Too heavy for the iPad: the E1 limits; the tree park as its own area; ghosts in one batch; only the current floor drawn.
- Signs still cut off on iPads because the test machine has no colour emoji: fit by drawn pixels; test with a colour emoji font; WebKit if it installs.
- Something removed by mistake: counts before and after each stage; only the four removals the owner asked for.
- Scares too scary: soft sound, small shake, cozy monsters; NOT VERIFIED until a kid tries it.
- Device clocks that are wrong: the server Date header offset; real devices in NOT VERIFIED.
- Stages getting tangled: one session, one job at a time, stacked branches.

## Report: tools/RUN-4-REPORT.md (filled in after each stage)
0. Progress: which jobs are done, pushed and checked.
1. Every change: item, old -> new.
2. Check output per job, exactly as printed, and each stage's full check (--full, --e1-limits as above, --backup tools/prerun4-index.html, and in --backup-title the date the check confirms the copy).
3. Before and after pictures (tools/pictures-4/) for every changed area, and the "should look like" lines.
4. The glitch list (tools/GLITCH-LIST-4.md) and the critic loop scores.
5. Glitches found and not fixed.
6. NOT VERIFIED: real devices, Safari's engine if not installed, sound, how it feels, two real players, how scary the scares feel, real holiday dates.
7. "Try it for real" tasks: short, to play and tick off.
8. How to go back: tools/prerun4-rollback.html (and per stage: revert that pull request).
9. Decisions made alone, each built the sensible way.
10. Firebase: new rules only if truly needed, as one complete block.
Open each pull request with its stage's part of the report.
