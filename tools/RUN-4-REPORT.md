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
| Stage 1 end: version stamp 2026101702, full check, the friends' wedge fix, kit v6 zip, this report, PR "Run 4, stage 1" | yes | yes | full check + reruns: every line passes except the 11 run-4 lines of jobs still to come (N20, N21, N22, N25, N28, N33, N34, N36, N37, N38, N39); counts: 58 lists, 728 things before, 732 after; grew: {"clothes": "22 -> 26"} |
| 10. Levels to 50, garden spots, house floors, house colour (stage 2, branch claude/run-4-s2) | yes | yes | N33, N34 pass |
| 11. The other holidays: Valentine's, the Easter month, December, New Year, the school party | yes | yes | N20, N21, N22 pass; N1 (rewritten again to whole months) pass |
| 12. The Pet Shop upstairs | yes | yes | N28 pass; N11 rerun pass |
| 13. More furniture (72 new pieces) | yes | yes | N36 pass |
| 14. Job tutorials (pictures) | yes | yes | N38 pass |
| 15. Photographer job | yes | yes | N25 pass |
| 16. Tree adventure park | yes | yes | N37 pass; N23 and N26 rerun pass |
| 17. House parties and the dance game | yes | yes | N39 pass |
| Stage 2 end: the stage-2 book (7 pages), version stamp 2026101801, counts before/after, full check (--full, night3 + run4), kit v6 zip, this report, PR "Run 4, stage 2" | yes | yes | full check + reruns: every line passes but C2b (the crawl does not ride the bus, so it never reaches the beach by playing; the same in the stage-1 full check; section 5b) |
| 19. Stage 3: the GLITCH HUNTER pass (photographer, change-spotter, viewers, double-checker, reporter, fixer, fix-checker) and the critic loops; version stamp 2026101802; the rollback copy; full check; this report; PR "Run 4, stage 3" | partly: passes 1 to 7, five critic rounds, the stamp, the rollback copy, the counts and the full check; pass 8 and critic round 6 are open (the owner's wrap-up, 18 Oct; kept on the branch claude/run-4-wip) | yes | glitch list tools/GLITCH-LIST-4.md (167 entries: 142 fixed, 23 not a glitch, 2 open); critic loop: see section 4; full check: stopped by the owner after the save tests (18 Oct): every line that ran passes (files, counts, saves, the two players in the test room, the Claude version, the book); the walk-through, the device tests and the night-3 and run-4 lines did not run on the final file and are NOT VERIFIED |
| Run 4 finish (20 and 21 Oct, branch claude/run-4-finish): the full final check on the live game; the clock "9:40 Wed"; C5; passes 8 to 25 with fixes f3 to f20; critic round 6 (the last); version stamp 2026102101; the rollback copy restamped; full check on the final file; kit v6 zip; this report; PR "Run 4, finished" | yes | yes | the live game: every line PASS but C5 (fixed); the final file: every line PASS (A2 after the backup was read back on 21 Oct, the files stage rerun alone); C1-WK, F2 and F3 not run, G not verified, as before (`tools/run4-wip/final-check-2026-10-21-final.txt`) |

(filled in after every job; if the session restarts: undo any half-done job, carry on from the next one)

### Notes at the owner's wrap-up (18 Oct 2026)
- Live: from 18 Oct 2026, run 4 stages 1 to 3: on GitHub (main, index.html, stamp 2026101802, md5 8425c145) and in the Claude version (the artifact "Cozy Town", md5 579a3449), merged and published after the save tests at the owner's word. The rest of the final check was stopped and is NOT VERIFIED: the walk-through (C2, C2b), the device tests (C1, C3, C4, C5, T1 to T4, K1) and the night-3 and run-4 lines on the final file (section 2, stage 3 end). The two players in the test room (D1 to D3) passed; two real players stay NOT VERIFIED.
- Finished and pushed: stages 1 and 2 (branches claude/run-4-s1, claude/run-4-s2; PRs #4, #5) and stage 3 up to its seventh pass and fifth critic round (branch claude/run-4-s3: the game with stamp 2026101802, the rollback copy, the glitch list G4-001 to G4-167, this report).
- Dated backups before the update, both private artifacts read back byte for byte: "PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3)" (md5 709bf763, the same file as tools/prerun4-index.html) and "Cozy Town BACKUP 2026-10-18 — Claude version before run 4" (md5 fd84696c).
- Open, kept on the branch claude/run-4-wip (tools/run4-wip/README.md says how to pick each up):
  - S3-L, pass 7: 9 of its 13 viewer batches never ran (the spend limit); its 15 kept marks are fixed, not yet seen by a later pass.
  - S3-N, pass 8: stopped after 71 pictures, none looked at; "loop until one full pass finds nothing new" is not met.
  - Critic round 6, the last: not run (section 4 says where each loop stands).
  - Friends around you: walking round you was dropped (it broke N3); the narrower fan and the spot rules are in, not yet seen by a critic.
  - Ducks: the new faces, not yet seen by a viewer or a critic.
  - Clock format: times read "09:40 Wed"; the plan's example was "9:40 Wed". The owner decides.
- To carry on: check out claude/run-4-wip, read tools/run4-wip/README.md, run pass 8 and critic round 6, then the full check and the stage-3 pull request (or a follow-up one if this stage is merged).

### Run 4 finish (20 and 21 Oct 2026): where things stand
- The owner's words: "Finish run 4 … do every open item in it, alone. First the full final check on the live game. Clock: show "9:40 Wed" (one hour digit), as the 17 Oct list says. Same rules as NIGHT-PLAN-4.md. End with a pull request. Never stop to ask."
- Done on the branch claude/run-4-finish (pull request #7 "Run 4, finished", not merged: the owner merges): every open item of the wrap-up (tools/run4-wip/README.md says how each ended). The live game is unchanged (stamp 2026101802) until the owner merges and publishes.
- The live game's full check (20 Oct): every line PASS but C5, fixed here (`tools/run4-wip/final-check-2026-10-20-live.txt`).
- The glitch passes: pass 8 (the full S3-N pass, 92 kept marks), pass 9 (37 kept), passes 10 to 19, then from pass 20 under the owner's loop rules of 21 Oct: pass 20 (2 fixes above minor), passes 21 and 22 with none above minor (the stop), the full final pass 23 (628 pictures; 2 fixes above minor) and its re-checks, passes 24 (1 fix) and 25 (none).
- The critic loops ended at round 6 (the last the plan allows): the Tree park done; the other five where section 4 says.
- Open for the owner: your pets at your heels (G4-205, G4-222); the salon floor softening near the camera on a big screen (G4-279); the phone's job list on a sideways iPhone (G4-285); the critics' last points not changed (section 5c); 15 small marks left as they are (grade 1), listed in section 1 ("Leftover minor marks") and in IDEA's PAGE.
- If a session restarts: the branch holds everything; section 1's "Run 4 finish" part lists each change, section 2 the checks as printed.

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

### Stage 1 end: what the full check found (the friends' wedge, four kit gaps) and the night-3 lines old → new
- Friends walking round each other (found by the night-3 line N3 in the full check). Old: when a friend or pet walked towards its spot and another one stood right in the way, the "keep 0.8 m apart" push sent it straight back, so it stopped dead behind the other one (Theo stuck 0.8 m behind Rosie, both meant to stand in front of you; the live game does the same when the pets happen to crowd the friends, 2 of 2 kit runs on the new file, 0 of 3 on the live file by luck of where the pets wandered). New: `fPush` notices when the push would run against the way it is going (the other one is in the way, not beside it) and slips sideways round it instead; standing friends still step back radially as before. Test N3 (3 kit runs after the fix: 4 of 4 friends in view, 1.47–1.54 m apart at both stops).
- Start-up time (found by N15 in the full check, "loads in under 1 s"). Old: job 5's sign centring measured every text by reading its pixels back from a full-size scratch canvas; in a tablet-like browser each read came back from the graphics chip at about 0.4 s, so `startGame` took 11.2 s on the check machine (the live file: 0.1 s) and every sign built later cost the same again. New: the scratch canvas is kept in main memory (`willReadFrequently`), big text is measured at 48 px and scaled back up, a text is measured once (a small memo, cleared when the web font arrives). `startGame` is back to 80 ms on the same machine; the signs' centring is unchanged (N23 rerun). Tests N15, N23.
- Kit v6 gaps the full check showed (all in the kit, not the game): the run4 line table had lost a comma between N40 and N41 (Python read the two as a call and the whole stage crashed in 1 s: "'tuple' object is not callable"); a stage crash now names its file and line in the FAIL text; N11's "old version" is now whatever was live before the run (the run-4 starting file already knows the night-3 breeds and shows a pug as a pug, which the test called "did not cope"); N18 read the grandmas through the pre-job-8 fields (`GRAN.benches`) and crashed, it now compares each grandma's turn, place, out and sitting; N24 compared the two devices' grandma places only with their clocks 1 s apart against a 1.3 m limit (1 s of walking is 1.15 m, and the rest was frame rounding): it now compares them at the same clock moment (within 0.35 m, same turn and stop) and with the clocks 1 s apart (within 1.7 m). K1 (the PC keys line from kit v2) opened the Market at whatever hour the shared clock had and found it shut at 20:50 ("Closed · opens at 8:00"); it now sets noon first like the other lines. N15's clock-chip rule did not allow the Pet Show trophy that marks Saturdays since night 3 ("10:10 🏆 Sat"); it now allows the trophy and still nothing else but the time and the weekday. N15's "loads in under 1 s" first looked like a busy machine (the full check and two reruns ran at once: 10.5 s and 18.1 s), but alone it still measured 9.2 s: the real cause was the sign measuring above.
- The night-3 lines whose subject changed today, rewritten, never weaker (kit v5.1 → v6):
  - N1 old: "Holidays: Halloween 17 Oct-1 Nov, Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene" → new: "Holidays: Halloween 1-31 Oct (run 4), Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene" (the test fakes 1 Oct, 31 Oct and 1 Nov as well as the old dates).
  - N6 old: "Grandmas: out in dry daytime; inside in rain, snow and at night; their bench is full while they sit" → new: "Grandmas (rewritten for run 4): the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit" (it counts exactly three, checks the duck-pond bench's two seats instead of the 12 house benches, and that a player can sit there once they have gone).
  - N10 old: "Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors" → new: the same words; the test behind it now gives both players the shared clock (`__clockMs`) instead of a day number, so "the same clock" means the one clock of run 4 (5 clock moments, the weather the same at all 5).
  - N14 old: "Smooth and light: E1 within the agreed limits, measured with Halloween on, rain on and the animals out; index.html under 1.8 MB" → new: "Smooth and light (rewritten for run 4): E1 within the run-4 limits given to the check (town up to 15% more pieces and 25% more triangles, measured with Halloween, rain and the ghosts on; pet shop up to double; every other area 10%; a new area at most the beach's size), measured against the starting file; index.html under 1.8 MB" (N40 in the run4 stage is the same measurement under the run-4 wording).
- Should look like (BUILDER): when you stop walking, all four friends come round in front of you and stand in a loose arc at least 1.2 m apart, none hidden behind another; a friend arriving late steps round the one in its way instead of stopping behind it.
- Decided alone: the sideways slip is only for a mover whose push runs against its own direction (the standing one still steps back as before), so nothing else about following changes.

### Job 10: Levels to 50, the garden's seed spots, house floors and house colour (items 21, 22, 23)
- Levels (item 21). Old: every skill stopped at level 10 (`MAXLV=10`); a player at 10 earned no more XP. New: `MAXLV=50`; the XP a level needs (10 per level) and the level-up coins (10 × the new level) are unchanged, so a player at 10 carries straight on; XP past 50 is dropped. Test N33 (every skill reaches 50 and stays there after more XP).
- Garden spots (item 22). Old: 6 beds in the yard. New: 30 pots along the inside of the fence (never on the way from the gate or the back door, never by the shed), six more opening at gardening level 10, 20, 30, 40 and 50; a locked pot says its level; a pot grows the same crops smaller; the garden save grows to 36 slots and old 6-slot saves keep their beds. Friends see the pots and their crops at the same spots on your lot (the presence string `gd` carries "spot,seed,stage" for pots too; old versions ignore pots they do not know). Test N33.
- House floors (item 22). Old: one room, or the big house (two floors: the upstairs room 40 m east of the ground floor, reached by the stairs in the west wall; Decorating 10 + 2,500 coins). New: floor 3 at Decorating 20, 4 at 30, 5 at 40, 6 at 50, 2,500 coins each (the yard sign asks "One more floor?"; at six: "Six floors! Your house is as tall as it gets"); every floor is the same 12×10 room with the stairs going on up in the same design; floor k lives 40 m further along z (UPZ) and only the floor you stand on is attached to the scene, so a six-floor house draws like a one-floor house; the stairs work up and down on every floor (the same step-by-step climb as the flats); decorating works per floor (`homeFloorL(k)`, items carry `f`); the outside on Friends Lane shows as many floors as you own (the building gets a storey per floor, the name sign climbs with it), also for friends (presence `hf`); the home presence sends `n` and `u2…u5` for the floors above the second (old versions read `b`, `i` and `u` as before and see two floors). Old saves keep every piece: an old big-house save keeps its 33 pieces (the upstairs ones 40 m along z now); a save made upstairs before night 3 starts by the stairs as night 3 decided. Test N34.
- House colour (item 23). New: at the yard sign, "🎨 House colour": 12 ready colours and a "pick any colour" slider (free); your lot's house is repainted at once and everyone on the lane sees it (presence `hc`); "↩️ The lane's own colour" goes back. Test N34 (presence hc, a friend's lot built in the friend's colour).
- Should look like (BUILDER): from the lane, your house grows a storey for every floor you own, up to six, in your colour, with your name sign on top; inside, every floor is the same bright room with the stairs in the west wall and "⬆️ Upstairs"/"⬇️ Downstairs" plates; the garden has 30 small terracotta pots along the fence, the locked ones say "🔒 Gardening level 20" and so on. Pictures: tools/pictures-4/after-house-six-floors.png, after-house-colour.png, after-garden-pots.png, after-floor-4-inside.png.
- Decided alone: floors stack along z (not x) so the old upstairs code's single offset becomes a per-floor one; one floor attached at a time; the same price for every floor; the colour is free and only outside; pots open six at a time per 10 levels.

### Job 11: The other holidays (items 4, 5, 6): Valentine's, the Easter month, December, New Year, the school party
- The months (item 4). Old: Halloween all October (job 3), Christmas 1 Dec to 6 Jan, Easter Palm Sunday to Easter Monday, nothing else. New: every holiday fills its month: `holidayOf` says 'halloween' in October, 'valentine' in February, 'easter' in the month of Easter Sunday, 'xmas' 1 to 31 December, nothing in other months; the Flower Corner's gate (job 4) opens in all four. New Year and the school party are days, not months: `nyeFireworks` (28 to 31 Dec), `nyeParty` (31 Dec and 1 Jan), `schoolParty` (1 Sep). Tests N1 (rewritten again, never weaker: the same scare rules, more dates), N20.
- February at the Flower Corner. New: a heart fountain at the holiday spot (a pale pink basin with water, a stem and a big red heart, six little hearts round the rim, water drops; a round collider), four hearts on white sticks by the mounds and bushes, pink-red-white garlands on the stage and the corner posts, and 140 pink petals drifting across the corner in one Points mesh (moved by the holiday clock). Test N20.
- The Easter month. Old: pastel eggs in the park and the corner, three bunnies with bows, bunting. New, on top: the Easter Bunny (a big white bunny with a golden bow) stands by the corner's path and asks you to find 25 eggs hidden around town; he keeps the prize a secret. The 25 spots are dealt from 45 candidate spots by the year (`seeded(year)`), so every player hunts the same spots that year and new ones next year; each player finds their own (the save keeps `egg:{y,f}`); a hunt egg is bigger, banded with gold, sits in a little green nest and has its own "Pick up the egg (n/25)" spot, so no decorative egg looks like one; the found ones vanish (the eggs are one baked mesh, rebuilt on each find). All 25: the bunny gives the Bunny costume (a new costume: long ears with pink insides, a fluffy tail, a soft tummy) and 50 coins, once a year (`eggDone`); the costume shows in the Clothes Shop only once it is yours ("a prize") and can be worn at the mirror like the October costumes. Test N20 (two players, two years, every count, the prize once).
- December. Old: the big tree with its presents and lights stood at the park plaza. New: the tree, its presents and its ring of lights stand at the holiday spot in the Flower Corner (the wreaths, house lights and garlands stay where they were); Santa stands beside it (a red suit, a white beard, a red beanie with a white brim) and gives coins once per real day: 10 on 1 Dec, a little more each day (155 on the 16th), 300 on 31 Dec (`santaCoins`; the save keeps the real day it last paid). Test N20.
- New Year (item 5). New: fireworks on the game nights of 28 to 31 Dec (one Points mesh of 6 bursts × 90 sparks on the graphics chip, launched every 1.4 to 2.6 s 40 to 70 m from you, 26 to 40 m up, a soft low thud with sound on; outdoors only); on 31 Dec and 1 Jan everyone wears a party hat (players, friends, townspeople, grandmas, shopkeepers, the judges): every person gets a hidden party hat at birth in its own little baked group, and an own hat sits in a group too, so the two swap at midnight without rebuilding anyone (old versions see no hat: `hat` in the presence is unchanged); confetti falls outdoors on those two days (260 coloured flakes around you, fading in and out). Test N21.
- School, 1 Sep (item 6). New: six balloon bunches in front of the school (by the door, the corners and the path) and four in its hall, built and cleared by the day; Mrs. Maple gives a little globe (a new furniture piece: a blue globe with green lands on a golden arc and a dark stand, not for sale) once per player per year; it waits in 📦 My stuff. Test N22.
- Should look like (BUILDER): February: a pink heart fountain in the corner's west half with petals in the air; the Easter month: a big white bunny with a golden bow by the stepping stones, golden-banded eggs in nests around town (not the small pastel ones); December: the tall tree with presents and coloured lights in the corner, Santa beside it waving coins; 28 to 31 Dec at night: bursts of coloured sparks high over the town; 31 Dec and 1 Jan: a striped party hat on every head and confetti falling; 1 Sep: bright balloon bunches around the school and in its hall. Pictures: tools/pictures-4/after-valentine-fountain.png, after-easter-bunny.png, after-december-tree-santa.png, after-fireworks.png, after-party-hats-confetti.png, after-school-balloons.png, after-school-hall-balloons.png.
- Decided alone: the holiday spot inside the corner is at (−19.6, −12.6), the west half, clear of the stepping stones, mounds and bushes; the egg candidate spots are pavement edges, park grass, the lane and the school front, each nudged out of any collider; Santa's coins grow in a straight line from 10 to 300; the party hat swaps in for an own hat rather than sitting on top of it; the globe is a floor piece 0.4 m wide (the game has no stacking on tables).

### Job 12: The Pet Shop upstairs (item 12)
- Old: one 14×10 room: three pens along the back wall (puppies with their breeds; kittens with the owl; bunnies with the ducks and the capybara), the hamsters' table, a side shelf of food and toys, the counter, the cat tree and doghouse on show, the birdcage.
- New: two floors, built like your house's floors (floor 1 is 40 m further along z, only the floor you stand on is attached, the same step-by-step stairs in the west wall with ⬆️/⬇️ plates and spots). Upstairs: seven fenced areas, one kind each, so they never mix: puppies with their breeds (pug, pomchi, sausage dog), kittens, bunnies, a capybara, ducks at a little blue pond, an owl on a perch, the hamsters on their glass-topped table; a sign over every area, a little bench to watch from; the 💗 "Adopt" spot at every animal as before, and the animals wander inside their own fence only. Downstairs: the counter, two long shelves of snacks and toys along the back wall, a rack of pet clothes (bows, hats, collars, scarves, crowns, bow ties, capes, wings in bright colours) with its own 👒 spot, the side shelf, the pet furniture on show (cat tree, doghouse, pet bed), the birdcage, and a "🐾 Animals upstairs ⬆️" sign by the stairs. The 🛒 spot sells food, toys and clothes as before.
- Other players: positions upstairs travel in the presence as they are (z + 40), so two new players see each other upstairs; old versions place the same coordinates 40 m away in their one-floor shop (the same harmless gap as the house floors).
- Test N28: 2 floors, 7 areas each holding only its own kind and not overlapping, 14 animals, 60 s of wandering with none outside its own fence, the shelves and the clothes rack downstairs, buying a treat, the stairs up and down, adopting a pug upstairs. The night-3 line N11 (every kind adopts, follows, eats, plays, dresses, Pet Show) is rerun.
- Should look like (BUILDER): downstairs a bright mint shop with full shelves and a colourful clothes rack, the stairs in the west wall; upstairs a long room with seven low pastel fences, each with its sign and its animals, a pond for the ducks, a perch for the owl, the hamsters' table, windows on three sides. Pictures: tools/pictures-4/after-petshop-downstairs.png, after-petshop-upstairs.png.
- Decided alone: the hamsters keep their table (now upstairs); the owl's area is a perch at 95 cm, the capybara has an area of its own; the pet shop's clothes rack got its own name (the Clothes Shop already has a `clothesRack`, and sharing the name broke its mannequins in the first dry run).

### Job 13: More furniture (item 28)
- Old: 58 furniture pieces (39 in the home catalog). New: 72 more, marked `r4:1` in the furniture table, every one low-poly in the game's style from the same box/cylinder/sphere helpers, priced like its neighbours, most in several colours, all in the home catalog (`BUY_FURN`), so the "New in!" picks and the Interior designer's orders (`DS_ALL`) draw on them too:
  - beds: canopy bed, daybed, baby crib, race car bed · seats: corner sofa, loveseat, stool, bar stool, rocking chair, hanging egg chair, wooden bench, pouf · tables: coffee table, side table, big dining table, round table, nightstand, vanity table (a mirror: changes your look) · lamps: floor lamp, table lamp, star lamp, neon sign (on a wall), paper lantern (all switch on and off) · rugs: heart, striped, star, doormat · plants: palm, monstera, orchid, herb pots, lucky bamboo, hanging plant (on a wall) · shelves and storage: cube shelf, corner shelf, treasure chest, coat rack, shoe rack, ladder shelf · kitchen: kitchen island, oven (cooks), dishwasher, coffee corner, kitchen trolley, spice shelf (on a wall) · bathroom: shower (a bubble bath), toilet, towel rack (on a wall), bath mat, laundry basket · kids' room: indoor slide, play tent, building blocks, toy train, drum kit (plays a tune), chalkboard · decorations: big vase, candles, photo frame, wall clock, bunting, snow globe, cuckoo clock, poster (five of them on walls) · outdoor: sun lounger, parasol, birdbath, barbecue (cooks), garden flamingo, picnic table · and the disco floor and the disco ball on its stand for job 17's dance game (the floor's tiles and the ball carry `userData` tags for the lights).
- The school globe (job 11) stays a gift. Nothing old moved or changed.
- Test N36: every new piece in the catalog with a price and a footprint, builds with finite geometry inside its footprint and under the ceiling, places in the house one by one; the catalog lists them, thumbnails draw, the designer's pool has them; a loveseat bought through the catalog; five pieces saved, read back and sent in the home presence; a PC-size visitor builds them in the host's room.
- Should look like (BUILDER): the catalog's "All furniture" grid is three times longer, each new piece with a clean little thumbnail; in the house a corner sofa, a canopy bed or a play tent look like the old pieces' siblings (same outlines, same pastel palette, same scale). Pictures: tools/pictures-4/after-new-furniture-room.png, after-new-furniture-catalog.png.
- Decided alone: the pieces' prices follow their nearest old relative (a stool 35 like the plant, a canopy bed 420 like the bunk bed and the sofa together); wall pieces hang at 1.0 to 2.2 m like the wall cupboard; the disco ball stands on a tall pole rather than hanging from the ceiling (the game has no ceiling mounts); the catalog keeps one long grid (no categories were asked for).

### Job 14: Job tutorials (item 30)
- Old: the pizza delivery tips were 9 cards of text from Chef Blaze; the hairstylist tips 6 cards of text from Ms. Snippy; both shown once (the first time the job is taken) and again from ⚙️ Settings.
- New: both are picture tutorials: 5 steps for pizza delivery (a message dings · follow the dot on the map, the arrow is you · find the door and tap it · fast = more coins · talk to Chef Blaze) and 4 for the hairstylist (a customer sits down · make the hair like the picture · tap the tools: shorter, style, colour · tap ✅ when it matches). Each step is a 420×210 picture drawn on a canvas (`tutPic`): big emoji, fat pink arrows, a pointing hand, a word or two in the picture, and one short line under it (3 to 9 words); the card keeps its Skip and Next buttons, the dots and the yellow spotlight on the real map button for the map step. Shown by itself the first time as before; a "❓ How does it work?" button sits under your current job in Rosie's job list (in person and in the phone chat) and opens it again any time; ⚙️ Settings' tips button still works.
- Test N38: a fresh player takes each job: the tutorial shows by itself, 5 and 4 steps, every step with a picture and at most 9 words, finished it stays away, the job card has the ❓ and it brings the tutorial back.
- Should look like (BUILDER): a white card with a picture panel (pale pink, rounded, dark border) showing, for example, a map square with a red dot and a pink arrow and a hand pointing at the dot, the title "Follow the dot 🗺️" and one line of words; Next › and the dots below. Pictures: tools/pictures-4/after-tutorial-delivery-step-1.png, after-tutorial-delivery-step-2.png, after-tutorial-hair-step-1.png, after-tutorial-hair-step-2.png.
- Decided alone: the pictures are drawn in the game (no image files), so they follow the device's emoji font (on the check machine the emoji are boxes; the arrows, panels and hands draw everywhere); the old long tips are gone rather than kept behind a link (the plan asks for almost no reading).

### Job 15: Photographer job (item 9)
- Old: four jobs (pizza delivery, designer, teacher, hairstylist); no photos anywhere in the game.
- New: Rosie offers a 5th job, 📸 Photographer, like the others (job list in person and in the phone, the job box, a first-time picture tutorial of 4 steps and the ❓ button). A booking arrives as a text message in a new phone chat "Photo bookings" (a note dings too): a family photo, a wedding photo, a birthday photo with party hats or a photo with a pet, with the place and the background the client wants ("Hi! It's Mia 😊 Could you take our family photo at Cozy Park, with the fountain behind us? Mia, Leo and Zoe will be waiting there! 📸"); the map's dot and the way-finder lead there. Four places with 2 or 3 backgrounds each: Cozy Park (the fountain, the flower beds, the Pet Show stage), the Duck Pond (the pond, the bench), the school (the door, the sign) and the Flower Corner (the garden gate, the hedge). At the place a 📸 "Set up the photo" button makes the group appear in a row (2 or 3 named townsfolk, a pet for pet photos, party hats for birthdays, white clothes for the wedding couple). A photo bar sits bottom right where the run and jump buttons are (they hide during a shoot): "🏞️ the fountain ▸" cycles the backgrounds (the group walks over), 🧍 opens one card with a pose for everyone, − and + zoom (also the − and + keys), "📸 Snap!" (also Space). Tapping a person, or walking up and using the action button, opens that person's pose card: Smile, Wave, Peace sign, Jump, Hug, Sit; every pose animates. A dashed white frame shows what counts as the picture. Stars 1 to 5 (pay 15/35/60/90/120 like the hairstylist): −1 each for someone cut off by the frame, someone not facing you, someone without a pose, the people too small in the frame, or a different background than the one asked for; a flash, the stars and the coins on a card with the photo; the client's thank-you message in the chat shows the photo too (the last 4 photos are kept in the save). 4 bookings a game day, then "All 4 photos done today!"; nothing outside 8:00 to 20:00 (as the other jobs); the booking waits if you reload or leave the town; quitting the job clears everything.
- Test N25: on iPad, sideways iPhone and PC: the job taken, the tips card shows by itself the first time (4 picture steps), a booking plays from the message (chat, note, job box, map target) to the 📸 button at the place, the group set up, the bar (5 buttons, each ≥ 44 px, none under another HUD part, run and jump hidden), the pose button next to a person and the 🧍 card, the backgrounds cycled (the group moved), everyone framed (a 5-star framing exists from 3.6 m), zoom in and out, Space (PC) or the Snap button (touch): 5 stars, +120 coins, the picture saved and shown in the card and the chat; Bye clears the shoot; a second booking shot with one person turned out of the frame gets 3 stars and 60 coins and the message says why; after 4 photos no new booking; every photo place and background stands on walkable ground with room to stand in front.
- Should look like (BUILDER): first person view of 2 or 3 townsfolk in a row with their names above, the fountain (or the asked background) behind them, a thin dashed white rounded frame around the view, bottom right a small white two-row bar ("🏞️ the fountain ▸", 🧍 / −, +, a yellow "📸 Snap!"); after the snap a white flash, then a card with the photo (a small landscape picture with a dark border), "Perfect! We love it! 😍", five yellow stars and "You got 120 🪙!". Pictures: tools/pictures-4/after-photo-shoot-ipad.png, after-photo-shoot-ipad-dark.png, after-photo-shoot-iphone.png, after-photo-shoot-pc.png, after-photo-result.png, after-photo-chat.png.
- Decided alone: the photographer's state is PHO (PT was taken by the touch code; the update guard of job 2 already waits for PHO.on); during a shoot the bar takes the run/jump corner (jumping is not needed, Space snaps) so nothing overlaps on a sideways iPhone; one background button cycles rather than 2–3 separate ones (room on a phone); a 🧍 all-poses card on top of tapping each person (the plan's way), so nobody has to walk round the group on a small screen; the dashed frame is the picture (6% / 8% in from the edges) and "cut off" means outside it; "filling the frame well" = the people at least 45% of the frame's height or the row half its width; the photo is a JPEG of what the screen shows, at the screen's shape, the last 4 kept in the save (about 15 KB each); the posing group is local (other players don't see it: nothing new goes online); the Duck Pond backgrounds moved after the walkable check found the pond's rim and a building in the first spots.

### Job 16: Tree adventure park (item 29)
- Old: no climbing anywhere; the woods behind the Toy Store were just scattered trees at the town's east edge.
- New: a 🌲 Tree Park: a wooden gate with a sign in the woods behind the Toy Store (east side of town, north of the ring road) leads to its own place, like the beach, so the town stays smooth (28 decks, 3 bridges, 3 zip lines, 74 extra trees and bushes, 39,028 triangles in 35 pieces: less than the beach's 58,233 in 119). Inside: an earth clearing with three signposts, 🟢 Easy path, 🟡 Medium path and 🔴 Hard path; each has a ladder ("Climb up") to its first deck. Square wooden decks sit on tall trees (2.6 to 4.8 m up) with the path's little flag on each; you jump from deck to deck (gaps 1.0 to 2.2 m, steps up to 0.4 m), cross plank bridges with rope rails, and ride a zip line (a cable between two posts; you hang from a handle and slide 12 to 16 m down to the next deck) to the finish deck with a 🔔 bell and a 🏁 Finish sign. Ringing the bell finishes the path: a cheer, sport XP, 20/30/40 coins the first time, "tree-top champion" when all three are done; "Climb down" ladders at the first and last decks. The decks and bridges are the floor where you stand (their sides are solid, you can walk under them on the ground); walking or jumping off lands you softly on the grass and a short fade puts you back on the last deck you stood on ("Whoops! 🍃"), no harm, falls counted in the save. Free. The park is on the map (a green patch at the gate; the map's way-finder goes to the gate), in the phone's "where is everyone" list ("🌲 At the Tree Park") and the gate back to town is at the clearing's south edge.
- Test N37: on iPad, iPhone upright, iPhone sideways and PC: the gate's button in the woods, in for free, the six signs there and readable (ink inside, centred within 3%), the ladder, then the whole path jumped deck by deck from the edge with the forward control held (joystick on touch, W on the PC), bridges walked, the zip line ridden to its deck, the bell rung and the path marked done (all three paths on the iPad, the easy path on the other devices); the ⬆️ button (touch) and Space (PC) jump; walking off a deck reaches the grass and comes back on that deck with the fall counted; the gate back to town; the park weighs less than the beach.
- Should look like (BUILDER): from the clearing, three wooden signposts in a row (green, yellow, red signs) with tall round autumn trees behind, square wooden decks high up with little coloured flags, ladders against the trunks and thin dark cables between posts; on a deck, the next deck a short hop away, plank bridges with rope rails, the finish deck with a yellow bell on a post and a "🏁 Finish" sign; the town gate: two brown posts with mint knobs, a brown beam with "🌲 Tree Park" in white, an earth path, trees around. Pictures: tools/pictures-4/after-treepark-gate.png, after-treepark-start.png, after-treepark-start-dark.png, after-treepark-easy-first-deck.png, after-treepark-finish.png.
- Decided alone: the park sits 1 km south of town in its own place (an old version shows a friend there far away, like the beach); ladders and zip lines are rides (a fade or a slide), not climbing animations; gaps are sized for walking jumps (2.6 m reach), running makes them easy; decks' sides are solid walls (no climbing up a side), and standing on a deck you cannot step onto one more than 0.4 m higher; a fall is the ground (not a lower deck), so jumping down to a lower deck is part of the course; the jump height stays the game's (0.8 m); the zip-line handle is a small bar you only see when you look up; 20/30/40 coins once per path keep it free to enter and play.

### Job 17: House parties and the dance game (item 32)
- Old: the mailbox only gave the day's mail; no parties; the disco floor and ball (job 13) were just furniture.
- New: the mailbox in your yard opens a little menu: "📬 Check mail" or "🎉 Host a party". Hosting: pick a time on the one clock (the next whole hours from 8:00 to 21:00, or tomorrow morning); the party lasts 20 real minutes from then. Everyone playing gets a note and a card with the host's name ("NAME is hosting a party today at 21:00! Go check it out." · ✅ I'll come! / 🙅 Not this time); the host hears who said yes ("💌 NAME is coming to your party!"). When the party starts, a yes gets "🎉 Party time!" and the way-finder to the host's house on Friends Lane; the host's door opens by itself for every knock while the party is on (the host at home). With a 🪩 disco floor and a disco ball in the house it is a dance party: the floor flashes and the ball spins. "🕺 Dance!" on the floor (when another player is in the house) asks them to a dance-off (a card: 💃 Let's dance! / Not now; with several people there you pick whom; the others watch and can take the next round). The round: a countdown, then 20 arrows fall down a lane with four columns; press the matching arrow at the right moment (arrow keys on a PC, four big ⬅️⬇️⬆️➡️ buttons on touch): a hit is +10, a perfect one +15. The view steps back to show the floor: the two dancers stand side by side on it (the one who asked on the left) and every hit makes that dancer do a move (a lean left or right, a crouch, both arms up), seen by both and by anyone watching. A score bar with both faces and names sits on top: it slides smoothly towards your share of the points, even = the middle. At the end a card with both scores (win, lose or a tie), +15 coins each and sport XP; "Done" and the floor is free for the next pair. Everything shared goes in optional presence fields (py: my party, pa: my answer, dn: my round); old versions ignore them and see nothing odd.
- Test N39: three players together through the check's fake room: A (iPad) hosts at the mailbox (the menu, four times offered, one picked), B (PC) gets the note with A's name and a card with two buttons ≥ 44 px, says yes, A hears it; at party time B gets the way to A's lane door; B knocks, A's door opens by itself, B is in; A's floor lights up; "Dance!" on the floor, B's dance card with A's name, yes; both in the round (countdown, 4 big buttons, 2 faces, bar at the middle); A hits with real taps on the big buttons then presses, B with real arrow keys then presses (15+ hits each); A's dancer moves on hits and A sees B's dancer move; the bar sampled every frame never steps more than 0.03 and starts at 0.5; both get the result card, the view comes back; C on the old live version sees A all along with no page errors.
- Should look like (BUILDER): the mailbox card with two big buttons (yellow "📬 Check mail", mint "🎉 Host a party"); the time card as a grid of ☀️/🌙 tiles ("Today 13:00"); a white invitation card under the top bar ("🎉 A party!", the host's name in bold, two buttons); in the house a 2.4 m square of six bright tiles cycling colours under a spinning mirror ball; the dance-off: a white bar on top with two 🙂 faces, names and scores and a mint fill from the left, a pale lane with four dashed columns, a pink hit line near its bottom with faint ⬅️⬇️⬆️➡️ marks, big arrow emoji falling, "3 · 2 · 1 · Dance!" in the middle, four white 66 px arrow buttons at the bottom; the two dancers side by side on the floor seen from a step back, lifting arms and leaning. Pictures: tools/pictures-4/after-party-invitation.png, after-dance-off.png, after-dance-result.png.
- Decided alone: a party is 20 real minutes long (game hours at night pass in 30 s, so a real-time length keeps a 21:00 party playable); the host's door opens by itself during the party only when the host is at home (otherwise the normal "let them in?" card); the dance-off is open whenever a disco floor and ball are in a house with two players, party or not (the party makes it a dance party with the lights); the dancers are drawn as third-person avatars on the floor (the game is first person; your own body is shadow-only), with the asker on the left on everyone's screen; the arrows use the shared start moment from the one clock and then each player's own frame time, scores are swapped through presence every 0.15 s; a hit window of ±0.28 s (±0.1 s perfect); the faces on the bar are 🙂 with names (no portrait drawing exists in the game yet).

### Stage 2 end: the book, the stamp, the counts, the kit's A3 allowance, what the full check found
- The stage-2 What's new book: 7 pages (cover with four pictures and the credit line as it is; Your house grows; Holidays all year; Pet Shop upstairs & more furniture; New job: Photographer; The Tree Park; Parties and the dance-off), 1 to 3 short kid lines a page, 11 small webp pictures (184 KB) fresh from the stage's own pictures; the stage-1 pages kept in tools/books/run-4-stage-1-pages.js (the night-3 book was already there). index.html is 1.56 MB (limit 1.8).
- Version stamp: 2026101702 → 2026101801 (once, at the stage end; the automatic update of job 2 takes it at the next calm moment).
- Counts before and after stage 2 (the kit's counting code on the stage-1 end file a097543 and on this file; every other list unchanged; nothing lost but the four old pizza-tutorial text steps, below):

| list | before stage 2 | after stage 2 |
|---|---|---|
| areas | 25 | 26 (+1: the Tree Park) |
| places (on the map) | 22 | 23 (+1: the Tree Park) |
| doors | 23 | 24 (+1) |
| houses | 11 | 11 |
| shops | 11 | 11 |
| furniture | 61 | 134 (+73: 72 pieces of job 13 and the globe of job 11) |
| furniture for sale | 39 | 111 (+72) |
| foods | 59 | 59 |
| clothes | 26 | 27 (+1: the bunny costume) |
| hats | 19 | 20 (+1: the party hat) |
| pet kinds | 10 | 10 |
| quests | 40 | 40 |
| jobs | 4 | 5 (+1: Photographer) |
| phone chats | 4 | 5 (+1: Photo bookings) |
| townsfolk | 14 | 14 |
| chat phrases | 12 | 12 |
| tutorial steps (pizza) | 9 text | 5 pictures (the owner's item 30) |
| signs (N23 counts them) | 66 | 71 (+5: the Tree Park gate in town, its gate inside, the three path signs; the three finish signs stand in the same place as... counted by N23) |
| benches | unchanged | unchanged (no bench added or removed in stage 2) |

- The kit's night-3 line A3 ("everything in the live game is still in the new one, by name") and the pizza tutorial: the owner's item 30 turned the 9 text steps into 5 picture steps (job 14), so A3 would list the old steps 6 to 9 as missing. The full check runs with `--agreed-removals "tutorial_steps:#5,tutorial_steps:#6,tutorial_steps:#7,tutorial_steps:#8"` (the kit's existing way to name an agreed removal; the four allowed removals of run 4 are game things that A3 never listed by name). Old → new: A3 old: "everything in the live game is still in the new one, by name (the agreed removals named on the command line)" → new: the same line, with the four old tutorial text steps named as agreed (the owner's item 30); nothing else is excused. The line stays exactly as strong for every other list.
- What the first full check found, and the fixes (all before this commit; the check ran again on the final file, section 2):
  - The Pet Shop's drawing work (N14/N40, E1 "pets up to double"): 7,811 → 18,733 triangles (+140%). Job 12's three new shelf units downstairs stood a food model every 32 cm (108 little models, the same density as the Market's); now every 50 cm in the Pet Shop (66 models; the Market keeps its 32 cm): the shop is within the agreed double. Nothing else changed.
  - The kit's night-3 line N12 (the big house) and its run-4 line N18 (the stairs' view, the visitor's house) still looked for the night-3 upstairs annex (LOC.home.up, UPX, shellG), which job 10 replaced with floors (L.fls, UPZ): rewritten to the floors, never weaker. N12 old: "upstairs = LOC.home.up with half-width 6; the stairs lead to homeFl() 1 at UPX" → new: "a second floor = LOC.home.fls.length ≥ 2, a full 12×10 floor; the stairs lead to floor 1 = one UPZ along z"; the saves, the piece counts, the 12×10 downstairs, the old layout, My stuff and the new upgrade are checked exactly as before. N18: the stairs' looks run on every floor's own shell (up on every floor but the top, down on every floor but the ground), and the visitor's floor count must equal the host's.
  - Old saves (B1): job 10's garden padded an old save's garden list from 6 to 36 entries on load, so the re-saved game differed from the original (nothing lost, but B1 counts every difference). The list keeps the length it was saved with now; a pot gets its entry when first used (gardenInit); the kit's N33 counts the used slots instead of 36.
  - Buttons (C5, "the same kind looks the same everywhere"): the tutorial card's Skip and Next (white buttons) were 18 px since night 3; job 14's ❓ button brought the card in front of the crawl, which saw them next to the 20 px white buttons. They are 20 px now.
  - N13 (the hairstylist on iPad) failed once with "could not take the job" (the job card tap found nothing); the same steps passed on the rerun and in a by-hand repeat with no change to the game: a one-off of the check's timing on the first page of the run (noted in 5b).
- The full check (`--full`, every stage, E1 limits city +15%/+25% and pets +100%, the new-area rule): every line passes but C2b (the crawl does not ride the bus, so it never reaches the beach by playing; the same in the stage-1 full check; section 5b). A3: PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 880 after; grew: {"areas": "25 -> 26", "places": "22 -> 23", "doors": "23 -> 24", "furniture": "61 -> 134", "furniture_for_sale": "39 -> 111", "hats": "19 -> 20", "clothes. E1: PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 27 areas, 1456 pieces, 1217232 triangles in total | for information, seen from 5 spots: city 187 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws.

### Job 19 / stage 3: the GLITCH HUNTER pass and the critic loops
- How it ran: pass 1 took 494 pictures (392 on four screen sizes light and dark, by day, at night and in rain; 32 on faked holiday dates, at night, in bed, at the salon, on a delivery and with two players; 69 of the kit's own from the stage-2 full check; the Easter retake) and the browser log of the Easter pictures gave the first glitch (G4-001, the egg hunt did not build when the game opened in April); twelve viewers marked 294 things, 139 of them the photographer's own mistakes (set aside and the spots fixed), five double-checkers kept 123 of the other 155, grouped into 32 entries; the first critic round scored 7, 7, 6, 6, 6, 6; every kept entry was fixed from its cause (see the list) and the kit lines of the parts touched were run again (N3, N20–N26, N28, N32, N34, N37, N39, N40 pass). Pass 2 took every picture again on the fixed file; the change-spotter compared each with pass 1's picture of the same spot and only the changed and new ones went to the viewers; 418 of the 585 went to the viewers (the rest were the same picture), eleven viewers marked 162 things, 51 of them the photographer's own mistakes (set aside, the spots fixed again: tried at three depths per room with a contact sheet), five double-checkers kept 87 of the other 111, grouped into 30 entries (G4-034 to G4-063: 20 fixed from their cause, 7 not glitches, 3 left open with the reason); the second critic round scored 6, 7, 6, 7, 7, 6 and its lines were fixed in the same batch; the kit lines of the parts touched were run again (N3, N15, N16, N19 to N23, N25, N32, N33, N34, N36, N37, N39, N40 pass; N39's end-of-round check was rewritten for the kept dance view, old → new in section 5c). Pass 3 took every picture again on that file; 394 pictures + 32 holiday and job pictures + 49 of the kit's own; the change-spotter passed 383 changed or new ones to eleven viewers, who marked 244 things, 25 of them the photographer's own (set aside); the double-checkers kept 175 of the other 219. Pass 4 (after the third fixes): 404 + 32 + 34 of the kit's own; 407 went to eleven viewers, 186 marks, 31 set aside, the double-checkers kept 103 of 155. The kept marks of passes 3 and 4 are grouped by cause into G4-064 to G4-140 (the commit that fixed each is named in the entry). Pass 5 (after the fourth fixes): 406 + 32 + 4 two-phone dance pictures + 52 of the kit's own; 448 went to twelve viewers, 227 marks, 90 set aside (the photographer's camera spots, the kit's staging and timing, and the cases decided in section 9c: the fixed HUD over a sign on an upright phone, the owner's joystick place on a sideways phone, a talking townsperson's bubble at the screen edge, map names at the map's edge, an awning's overhang), and six double-checkers kept 102 of the other 137, grouped into G4-141 to G4-159; one of them (the Beach Bus standing on you at the stop) was 44 of the 102 marks. The kit run after the fifth fixes found two lines broken by the pass-4 fixes and fixed them at once: N3 (friends kept from standing in line with each other had no spots left and stood 0.75 m apart) and N23 (the Tree Park's Finish banner hung behind the bell's roof). Pass 6 took every picture again after the pass-5 fixes (406 + 32 + 4 + 65 of the kit's own); two more batches of fixes went in while it ran, so it served as the fix check of pass 5 (before/after pictures in the list) and the next full pass was pass 7. The kit run of pass 6 found the Toy Store's drawing work over its +10%: not a run-4 change but the claw machine's random number of capsules (3 or 4 meshes each); each capsule is one mesh now. Pass 7 took every picture again after the pass-6 fixes (406 + 32 + 4 + the kit's own); the org's monthly spend limit stopped every sub-agent at about 10:50 UTC, when four of its thirteen viewer batches had finished (35 marks). The other nine were not resumed: their pictures predate the round-5 fixes. Fresh double-checkers kept 15 of 23 marks, grouped into G4-160 to G4-167 (6 fixed in 96b40df, f26b169 and c6d204f, 2 not glitches); G4-148 came back and was fixed. Pass 8 was started on the final file and stopped by the owner's wrap-up on 18 Oct after 71 pictures, none looked at yet. So the plan's "loop until one full pass finds nothing new" is not met: pass 8 and critic round 6 are open (section 5c), with the work kept on the branch claude/run-4-wip.
- Every fix of the pass, old → new, is in tools/GLITCH-LIST-4.md (one entry per cause, with the viewer marks it covers, a before and an after picture): 167 entries: 142 fixed, 23 not a glitch, 2 open.
- The critic loops (section 4): six parts, a fresh critic each round, done after three scores of 8 or more in a row. Five rounds ran; the tree park is done; round 6, the last, is open (the owner's wrap-up).
- Version stamp: → 2026101802 (once, at the stage end). tools/prerun4-rollback.html is the starting file with the stamp 2026101851 (section 8).
- The What's new book: no new pages (stage 3 fixed things; it added nothing a child would look for); the dance page's picture was taken again with the drawn arrows.
- Kit v6 lines touched: N37 finds the ladder button where the game put it (the signposts moved together); N39 reads the invitation card (it is the notification now, with the host's name and the two buttons) and, at the end of a round, checks that the view stays on the two dancers while the result card shows (old → new in section 5c). Two kit helpers changed, no check line: a tap waits for a popping-up phone or card around its button, and N15's sleep-screen picture waits for the screen to fade in (section 5c). None is weaker.
- Full check (`--full`): stopped by the owner after the save tests (18 Oct): every line that ran passes (files, counts, saves, the two players in the test room, the Claude version, the book); the walk-through, the device tests and the night-3 and run-4 lines did not run on the final file and are NOT VERIFIED.

### Run 4 finish (20 and 21 Oct 2026): the open items of tools/run4-wip/README.md, done alone

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
rules"): re-check only what changed (each fix's probe views on the screen where its mark was seen and one other shape, light and dark), the kit's night3 and run4 lines in full every pass, five viewers each with its own focus (rotated), viewers and first checkers on Sonnet at medium, every decision and edit here with the mark's picture opened; stop after two passes in a row with no fix above minor or after pass 22; then one full picture pass, its marks above minor fixed and re-checked like a pass, the minor ones listed (below).

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

#### Leftover minor marks (grade 1, not fixed)
The owner's rules of 21 Oct: in the full final pass a mark above minor is fixed and re-checked; minor ones (grade 1) are not. Every grade-1
glitch still open after the finish (the earlier passes' open ones too), each with its entry in `tools/GLITCH-LIST-4.md`:

| entry | where | what | why it stays |
|---|---|---|---|
| G4-088, G4-257 | sun shadows (iPad) | faint stripes and saw-tooth edges in the sun's shadows (fountain basin, window sills, eaves) | the steps of the sun's shadow map (2048 px over 60 m); a sharper map costs four times the memory |
| G4-244, G4-294, G4-306 | the Tree Park's crowns (iPad) | a short row of soft dark dots or brown saw-tooth bits on a big crown | the same shadow-map steps on a crown |
| G4-245, G4-258 | your pets (iPad) | your pets' big tags in front of the Pet Shop's upstairs pens; Mochi behind Finn, its tag cut | your pets at your heels (G4-205), for the owner |
| G4-279 | the salon floor (PC 1920) | the floor near the camera soft, the far tiles sharp | each room's floor is a 256-pixel picture; a bigger one costs memory on phones |
| G4-285 | the phone's jobs (sideways iPhone) | three job cards fill the phone screen; the other two show no part above its foot | the fade at the foot says the list goes on (G4-263) |
| G4-307 | the photographer's shoot at the pond's bench (sideways iPhone) | the bench, the photo's background, mostly behind the family; a grey wall in half the frame | the shoot's start spot does not look for the background; a child turns or steps aside |
| G4-324 | the hair job (sideways iPhone) | your cat Mochi stretched at the corner when the hair card turns the view | your pets at your heels (G4-205), for the owner |
| G4-329 | a photo shoot from the side (sideways iPhone) | a group member's name tag peeks out behind the "Pose: Mia" label | pushed below the label, a tag would leave its person |
| G4-336 | the food truck (iPad) | a small grey ball on the truck's side by the awning's end | the truck's evening lamp, unlit by day, with no bracket |
| G4-337 | the Christmas tree at night (iPad, dark) | two of the tree's lights glow big and white, like a flare | small |
| G4-338 | the photographer's close duck view (iPad) | a big dark box at the right edge of the view by the blue house | something by the house's corner at that fixed camera spot; small |

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

#### The final stage (21 Oct)
- Version stamp 2026102101 (bigger than the live 2026101802); `tools/prerun4-rollback.html` restamped 2026102150 (the starting file but the
  stamp, checked by a diff).
- The full check on the final file (`qcheck4.sh FINAL … --full`, 69 min, nothing beside it): 103 PASS, 1 FAIL: A2, only because the
  backup's title said "read back 2026-10-20" (the kit wants today's date). The backup (private artifact 761umD3PEycuWELrQwkHzk) was read
  back on 21 Oct, byte for byte `tools/prerun4-index.html` (md5 709bf763), and the files stage rerun alone with it: A1, A2, F1, F3a, F5
  PASS. Last state: every line PASS; C1-WK not run (no Safari engine), F2 and F3 not run (not published or uploaded yet), G not verified
  (real devices). As printed: section 2 and `tools/run4-wip/final-check-2026-10-21-final.txt`.
- 55 online-part lines (`strip_online.py`); index.html 1,597,427 bytes (under 1.8 MB).
- Setting up the fresh container of 21 Oct: the Python package playwright had to be installed, at 1.56.0 to match the Chromium in the
  environment.

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

### Stage 1: the full check (--full, --e1-limits "city:0.15:0.25,pets:1.0:1.0", --backup tools/prerun4-index.html); the night-3 line N3 found the friends' wedge, N11 the kit's old-version gap, and the run4 stage crashed on the kit's missing comma
```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 62 s]
    PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 732 after; grew: {"clothes": "22 -> 26"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 26 areas, 1409 pieces, 1158574 triangles in total | for information, seen from 5 spots: city 133 draws; home 34 draws; market 14 draws; cafe 30 draws; school 44 draws
[stage saves: running]
[stage saves: done in 411 s]
    PASS | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none);
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 41 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 26 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage book: running]
[stage book: done in 108 s]
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 7 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 7 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 7 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 7 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
[stage night3: running]
    PASS | N1 | 25 Oct day: halloween (101 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (32 pieces); 28 Mar 2027: easter (29 pieces); 10 Feb: None (0 pie
    PASS | N2 | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding: 4
    FAIL | N3 | stop 1: 4 friends, 4 in view in front, 1.49 m apart; 3 pets, closest gap 1.37 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 3 in view in front, 1.62 m apart; 3 pets, closest gap 0.80 m; after turning round: 4 of 4 back in view | PROBLEMS: ["walk 2: not in view or behind: ['Finn']"]
    PASS | N4 | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (0/1 at 20.4,55.3 h11.11)
    PASS | N5 | 24 benches in ['city', 'beach']; 45 seats sat on, 3 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag 1, legs -1.45); B's try for the same seat: seat 1 False, seat 2 True, toast 'Comfy! Move to stand u
    PASS | N6 | day (game clock 13:10): out [True, True, True], drawn (within 48 m of the camera) [False, False, True], sitting [True, True, False], pond bench taken [True, True]; night (game clock 4:30): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, Fals
    PASS | N7 | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboards for sale: ['cupboard', 'cupboardn', 'drawers', 'cornercup', 'tallcup', 'wallcup'] in 5 colours; g
    PASS | N8 | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 0 -> 1; 2-room order (of: sealiv + pinkkit); message: "Hi! I'm Ms. Plum 😊 I live in the Tall building behind the Market, flat"; room 1 has 2 things; 'All done?' with room 2 empty offers to call
    PASS | N9 | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy burger ok, you have 1; at 21:00: card opens False, bought False ('🌙 The Food truck is closed now. It op
    PASS | N10 | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #6e7a8b, sun 0.28; snow: flakes True (indoors False), ground #e3f0ea; sunny: sky #4fb4ff, sun 0.56, no rain True; cloudy: 
    FAIL | N11 | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (4) | 
    PASS | N12 | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout 
    PASS | N13 | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat a
    PASS | N14 | index.html 1.36 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 26 areas, 1494 pieces, 1167958 triangles; town 522 -> 558 pieces, 770726 -> 781742 triangles; limits city:0.15:0.25,pets:1.0:1.0
[stage night3: done in 467 s]
    PASS | N1 Holidays: Halloween 1-31 Oct (run 4), Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (101 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: Fals
    PASS | N2 Rosie: zero sounds while chatting with her and when her messages arrive; other friends, the chef and clients still sound | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding
    FAIL | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.49 m apart; 3 pets, closest gap 1.37 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 3 in view in front, 1.62 m apart; 3 pets, closest gap 0.80
    PASS | N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (0/1 at 20.4,55.3 h11.11) (14 s)
    PASS | N5 Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose | 24 benches in ['city', 'beach']; 45 seats sat on, 3 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag
    PASS | N6 Grandmas (rewritten for run 4): the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit | day (game clock 13:10): out [True, True, True], drawn (within 48 m of the camera) [False, False, True], sitting [True, True, False], pond bench taken [True, True]; night (game clock 4:30): out [False,
    PASS | N7 Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboar
    PASS | N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 0 -> 1; 2-room order (of: sealiv + pinkkit); message: "Hi! I'm Ms. Plum 😊 I live in the Tall 
    PASS | N9 Food: every new food can be bought, eaten (also on a bench) and shows its icon and name | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy bur
    PASS | N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #6e7a8b, sun 0.28; sno
    FAIL | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed
    PASS | N12 House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, 
    PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), cus
    PASS | N14 Smooth and light (rewritten for run 4): E1 within the run-4 limits given to the check (town up to 15% more pieces and 25% more triangles, measured with Halloween, rain and the ghosts on; pet shop up to double; every other area 10%; a new area at most the beach's size), measured against the starting file; index.html under 1.8 MB | index.html 1.36 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 26 areas, 1494 pieces, 1167958 triangles; town 522 -> 558 pieces, 770726 -> 781742 triangles; limits cit
[stage run4: running]
Traceback (most recent call last):
  File "/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck/cozy_check2.py", line 54, in stage
    d = await fn(run, d)
        ^^^^^^^^^^^^^^^^
  File "/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck/run4.py", line 395, in s_run4
    ('N40', 'Smooth and light: E1 within the run-4 limits (town 15%/25% with Halloween, rain and ghosts on; pet shop up to double; home within 10% with 6 floors; the tree park within the beach\'s size; others 10%); index.html under 1.8 MB', lambda: __import__('night3').n14(run, live_w, new_wb, FIX, limits))
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ('N41', 'Bus: with the one clock the bus still comes 3 days a week and the pill shows the next bus with its weekday', lambda: n41(run, new_wb, FIX))]
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
TypeError: 'tuple' object is not callable
[stage run4: done in 1 s]
    FAIL | X stage run4 crashed | TypeError("'tuple' object is not callable")
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 390 s]
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 233 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 506 s]
[stage crawl_ipad-landscape_inB: running]
[stage crawl_ipad-landscape_inB: done in 125 s]
[stage crawl_ipad-landscape_inC: running]
[stage crawl_ipad-landscape_inC: done in 68 s]
[stage crawl_ipad-landscape_inD: running]
[stage crawl_ipad-landscape_inD: done in 47 s]
[stage teacher_ipad-landscape: running]
[stage teacher_ipad-landscape: done in 85 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 82 s]
[stage teacher_pc-1920: running]
[stage teacher_pc-1920: done in 60 s]
[stage pc_keys: running]
[stage pc_keys: done in 37 s]
    FAIL | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: False
[stage tour_iphone-portrait_0: running]
[stage tour_iphone-portrait_0: done in 80 s]
[stage tour_iphone-portrait_1: running]
[stage tour_iphone-portrait_1: done in 19 s]
[stage tour_iphone-landscape_0: running]
[stage tour_iphone-landscape_0: done in 91 s]
[stage tour_iphone-landscape_1: running]
[stage tour_iphone-landscape_1: done in 24 s]
[stage tour_android-phone-portrait_0: running]
[stage tour_android-phone-portrait_0: done in 83 s]
[stage tour_android-phone-portrait_1: running]
[stage tour_android-phone-portrait_1: done in 21 s]
[stage tour_android-phone-landscape_0: running]
[stage tour_android-phone-landscape_0: done in 103 s]
[stage tour_android-phone-landscape_1: running]
[stage tour_android-phone-landscape_1: done in 21 s]
[stage tour_android-tablet-portrait_0: running]
[stage tour_android-tablet-portrait_0: done in 100 s]
[stage tour_android-tablet-portrait_1: running]
[stage tour_android-tablet-portrait_1: done in 22 s]
[stage tour_android-tablet-landscape_0: running]
[stage tour_android-tablet-landscape_0: done in 102 s]
[stage tour_android-tablet-landscape_1: running]
[stage tour_android-tablet-landscape_1: done in 22 s]
[stage tour_pc-1366_0: running]
[stage tour_pc-1366_0: done in 93 s]
[stage tour_pc-1366_1: running]
[stage tour_pc-1366_1: done in 20 s]

===== COZY TOWN FINAL CHECK =====
2026-10-17 · check version 6 · update, full sweep for a big update
live Claude fd84696cb6775f78d19c823aed4ab0f2 · new Claude 920f4066f18da16ccced846578149048 · live GitHub 709bf763d51be0160c118e2f9249f9f6 · new GitHub 02c69ff1348255d54104165ffd333021
PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 732 after; grew: {"clothes": "22 -> 26"}
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 26 areas, 1409 pieces, 1158574 triangles in total | for information, seen from 5 spots: city 133 draws; home 34 draws; market 14 draws; cafe 30 draws; school 44 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; jumped once to the shared day of the one clock (run 4); a Friends Lane time given (the save had none); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prenight3-bighouse.json: name 'ZZTEST-BIGHOUSE', coins 3100, furniture 33, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prenight3-designer.json: name 'ZZTEST-DESIGNER', coins 400, furniture 0, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prenight3-pets.json: name 'ZZTEST-PETS', coins 900, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prenight3-upstairs.json: name 'ZZTEST-UPSTAIRS', coins 2345, furniture 7, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prerun4-bed.json: name 'ZZTEST-BED', coins 900, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-day1.json: name 'ZZTEST-DAY1', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-day58.json: name 'ZZTEST-DAY58', coins 740, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-lv10.json: name 'ZZTEST-LV10', coins 5200, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-pets2.json: name 'ZZTEST-PETS2', coins 2400, furniture 0, pets 3; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 7 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 7 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 7 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 7 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
PASS | N1 Holidays: Halloween 1-31 Oct (run 4), Christmas 1 Dec-6 Jan, Easter Palm Sunday-Easter Monday, nothing on other dates (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (101 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (32 pieces); 28 Mar 2027: easter (29 pieces); 10 Feb: None (0 pieces) (20 s)
PASS | N2 Rosie: zero sounds while chatting with her and when her messages arrive; other friends, the chef and clients still sound | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding: 4 (14 s)
FAIL | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.49 m apart; 3 pets, closest gap 1.37 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 3 in view in front, 1.62 m apart; 3 pets, closest gap 0.80 m; after turning round: 4 of 4 back in view | PROBLEMS: ["walk 2: not in view or behind: ['Finn']"] (16 s)
PASS | N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (0/1 at 20.4,55.3 h11.11) (14 s)
PASS | N5 Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose | 24 benches in ['city', 'beach']; 45 seats sat on, 3 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag 1, legs -1.45); B's try for the same seat: seat 1 False, seat 2 True, toast 'Comfy! Move to stand up. You c' (45 s)
PASS | N6 Grandmas (rewritten for run 4): the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit | day (game clock 13:10): out [True, True, True], drawn (within 48 m of the camera) [False, False, True], sitting [True, True, False], pond bench taken [True, True]; night (game clock 4:30): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, False], pond bench taken [False, False]; rain (game clock 13:10): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, False], pond bench taken [False, False]; snow (game clock 13:10): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, False], pond bench taken [False, False]; day again (game clock 13:10): out [True, True, True], drawn (within 48 m of the camera) [False, False, True], sitting [True, True, False], pond bench taken [True, True]; at night you can sit on the pond bench: True (14 s)
PASS | N7 Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboards for sale: ['cupboard', 'cupboardn', 'drawers', 'cornercup', 'tallcup', 'wallcup'] in 5 colours; ghost by the stove: at -1.2,-4.649 valid True snapped True colour #22e07c; a saved kitchen with a gap after a reload: unchanged (26 s)
PASS | N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 0 -> 1; 2-room order (of: sealiv + pinkkit); message: "Hi! I'm Ms. Plum 😊 I live in the Tall building behind the Market, flat"; room 1 has 2 things; 'All done?' with room 2 empty offers to call the client: False; room 2 (Cupcake kitchen) has 2 things, room 1 still 2; 2-room review: go tapped ok, ended True after 60 rounds, paid 70 🪙, done 1, client said '🙂 Ms. Plum gave you 0½ ⭐ for the ocean living room and the cupcake kitchen. You ' (17 s)
PASS | N9 Food: every new food can be bought, eaten (also on a bench) and shows its icon and name | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy burger ok, you have 1; at 21:00: card opens False, bought False ('🌙 The Food truck is closed now. It opens'); taco on a bench: still sitting True, ate True; bag shows '🍣Sushi×2' (15 s)
PASS | N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #6e7a8b, sun 0.28; snow: flakes True (indoors False), ground #e3f0ea; sunny: sky #4fb4ff, sun 0.56, no rain True; cloudy: sun 0.39; weather shares (% of blocks): {"autumn": {"rain": 30, "cloudy": 25, "sunny": 46}, "winter": {"snow": 35, "rain": 4, "cloudy": 29, "sunny": 32}, "spring": {"rain": 26, "sunny": 56, "cloudy": 19}, "summer": {"cloudy": 14, "rain": 16, "sunny": 70}, "xmas": {"snow": 60, "cloudy": 20, "sunny": 21}}; tree colours by season: spring: spring ['#9fe08a', '#b4ea8e', '#8fd97e', '#a6e68c']; summer: summer ['#7ed37a', '#6cc97c', '#93dc76']; autumn: autumn ['#ff9f43', '#ff6b4a', '#ffd45c', '#e8734a']; winter: winter ['#cfe8dc', '#dff2ea', '#b8dcc8', '#e8f4ee'] (81 s)
FAIL | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (4) | sausage: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.72, sound True, 4 colours, 6 names, Pet Show True (2) | capybara: adopt True (saved as hamster), follows True, fed True, played True, 4/4 outfit slots, tag 1, sound True, 4 colours, 6 names, Pet Show True (2) | duck: adopt True (saved as bunny), follows True, fed True, played True, 4/4 outfit slots, tag 0.9, sound True, 4 colours, 6 names, Pet Show True (4) | owl: adopt True (saved as cat), follows True, fed True, played True, 4/4 outfit slots, tag 0.92, sound True, 4 colours, 6 names, Pet Show True (3) | old version: loads a save with a pug and a capybara: playing True, 2 pets shown as ['pug', 'capybara']; a friend's pug + capybara + unknown kind show as ['pug', 'capybara', 'capybara'] | new version shows a friend's pets as ['pug', 'capybara'] | PROBLEMS: ['the old version did not cope: []'] (44 s)
PASS | N12 House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout kept True; the player (saved upstairs) starts at -3.4,0.0 in home | save-f2cdd53-rich.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout kept True | save-live-web-rich.json: 12x10 room, upstairs True, 5 placed + 0 in My stuff = 5 (before 5), outside the walls 0, overlaps 0, old layout kept True | a new upgrade: big True, furniture unchanged True, downstairs 12x10, upstairs True (half-width 6), coins left 100 | stairs up: floor 1 at -3.4,0.0 (68 s)
PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | pc-1920: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True (66 s)
PASS | N14 Smooth and light (rewritten for run 4): E1 within the run-4 limits given to the check (town up to 15% more pieces and 25% more triangles, measured with Halloween, rain and the ghosts on; pet shop up to double; every other area 10%; a new area at most the beach's size), measured against the starting file; index.html under 1.8 MB | index.html 1.36 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 26 areas, 1494 pieces, 1167958 triangles; town 522 -> 558 pieces, 770726 -> 781742 triangles; limits city:0.15:0.25,pets:1.0:1.0 (26 s)
FAIL | X stage run4 crashed | TypeError("'tuple' object is not callable")
FAIL | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: False
PASS | C2 every spot and button does something (iPad, finger taps) | 735 taps tested in 23 areas, 356 screens
FAIL | C2b every area is reached by playing | 24 of 25 areas; NOT REACHED: ['beach']
PASS | C3 walking works (ipad-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | T1 teacher job plays from the school message to the end of class (ipad-landscape) | 3 classes: English ended, History ended, Math ended
PASS | T2 every goofing kid can be stopped, left and right (ipad-landscape) | left side 15 of 15 taps worked, right side 19 of 19
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (ipad-landscape) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (ipad-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (iphone-landscape) | 3 classes: Math ended, English ended, Math ended
PASS | T2 every goofing kid can be stopped, left and right (iphone-landscape) | left side 5 of 5 taps worked, right side 30 of 30
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (iphone-landscape) | 14 papers; button size 52x44 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (iphone-landscape) | 51 questions read
FAIL | T1 teacher job plays from the school message to the end of class (pc-1920) | 2 classes: English ended, None NOT ended; PROBLEMS: ['no message from the school came']
PASS | T2 every goofing kid can be stopped, left and right (pc-1920) | left side 1 of 1 taps worked, right side 11 of 11
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (pc-1920) | 6 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (pc-1920) | 21 questions read
PASS | C3 walking works (pc-1920) | W key: moved 6.4 m in 1.5 s
FAIL | C1 every screen opens (iphone-portrait, light and dark) | 34 of 35 screens, each in light and dark; FAILED (1): city-🏆 Pet Show is on Saturday: thing not found
PASS | C3 walking works (iphone-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (iphone-landscape, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (iphone-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-phone-portrait, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (android-phone-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-phone-landscape, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (android-phone-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-tablet-portrait, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (android-tablet-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-tablet-landscape, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (android-tablet-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (pc-1366, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (pc-1366) | W key: moved 6.4 m in 1.5 s
PASS | C4 nothing is cut off the screen | 0 problems
FAIL | C4 no buttons overlap | 1 problems: #jobTxt "✂️ → Hair Salon · 62 m (0/4)" + #tutSkip "Skip" (iphone-landscape light)
PASS | C4 all text fits its box | 0 problems
PASS | C4 every button is at least 44 px for a finger | 0 problems
PASS | C4 text is readable in light and dark | 0 problems
PASS | C5 the same kind of button looks the same everywhere | 33 kinds of button
PASS | C6 zero errors in the browser log | 0 errors
PASS | C8 test copies never reached the real internet | 0 outside requests stopped
NOT RUN | C1-WK every screen in Safari's engine (iPhone, iPad) | NOT RUN: Safari's engine is not installed on this computer
PASS | F6 every test action is logged and undone | 97 test actions, 97 undone
PASS | F2a the tests used exactly the files to publish | files tested: ['02c69ff1348255d54104165ffd333021', '2890389ea8f35a5f5213413f9e27273c', '59bfdef73260d80d89e8a40fd4566b22', '61157fb08299f3def5287efb2bacf9a8', '709bf763d51be0160c118e2f9249f9f6', '920f4066f18da16ccced846578149048', 'f26026cfc7c45272cc6e1a86acc28c32', 'fd1dc26919d00980d6cb22cf6f70a295']; to publish: ['02c69ff1348255d54104165ffd333021', '920f4066f18da16ccced846578149048']
NOT RUN | F2 published Claude version = tested file | NOT RUN: not published yet
NOT RUN | F3 GitHub file after upload = new Claude version + same web part, same address | NOT RUN: not uploaded yet
NOT VERIFIED | G real devices, sound, smoothness, two real players online | NOT VERIFIED: in the "Try it for real" notebook until ticked
RESULT: 8 FAIL, 4 not run or not verified · 59 min of testing
```

### Stage 1: the run4 stage whole after the kit's missing comma was put back, with N3 (before the friends' slip fix) and N11 (after the kit's old-version rule was fixed)
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1b/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1b/new/claude-new.html: removed 55 online-part lines; md5 920f4066f18da16ccced846578149048
[stage night3: running]
    FAIL | N3 | stop 1: 4 friends, 4 in view in front, 1.44 m apart; 3 pets, closest gap 1.38 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 0.80 m apart; 3 pets, closest gap 0.80 m; after turning round: 4 of 4 back in view | PROBLEMS: ['walk 2: friends only 0.80 m apart']
    PASS | N11 | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (4) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (4) | 
[stage night3: done in 78 s]
    FAIL | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.44 m apart; 3 pets, closest gap 1.38 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 0.80 m apart; 3 pets, closest gap 0.80
    PASS | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (4) | pug: adopt True (saved as dog), follows True, fed
[stage run4: running]
    FAIL | N15 | the code writes a day number in 0 places; the day-58 save loaded in 10546 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 18086 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, ski
    PASS | N16 | cloudy 8:00 #9ba7b5/#d3dae2; cloudy 12:00 #9ba7b5/#d3dae2; cloudy 18:00 #9ba7b5/#d3dae2; cloudy 23:00 #181a28/#2b2f41; rain 8:00 #6e7a8b/#a9b2be; rain 12:00 #6e7a8b/#a9b2be; rain 18:00 #6e7a8b/#a9b2be; rain 23:00 #181b28/#2b2f42; snow 8:00 #aab4c1/#e4e9ef; snow 12:00 #aab4c1/#e4e9ef; snow 18:00 #aab
    PASS | N17 | a newer file found while the phone was open: update started False (toast ''); during a scene: started False; calm: note '✨ Updating Cozy Town… your game is' then reload after 1800 ms; the page now runs version 2026101703 (title True, says '✨ Cozy Town is updated!'); the save made first has coins 777
Traceback (most recent call last):
  File "/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck/night3.py", line 34, in guarded
    try: return await fn(*a)
                ^^^^^^^^^^^^
  File "/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck/run4.py", line 191, in n18
    sa = await a.ev(SIG_JS); sb = await b.ev(SIG_JS)
         ^^^^^^^^^^^^^^^^^^
  File "/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/kit6/cozycheck/harness.py", line 124, in ev
    return await self.page.evaluate(js, arg) if arg is not None else await self.page.evaluate(js)
                                                                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.13/dist-packages/playwright/async_api/_generated.py", line 8514, in evaluate
    await self._impl_obj.evaluate(
        expression=expression, arg=mapping.to_impl(arg)
    )
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_page.py", line 467, in evaluate
    return await self._main_frame.evaluate(expression, arg)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_frame.py", line 320, in evaluate
    await self._channel.send(
    ...<6 lines>...
    )
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 69, in send
    return await self._connection.wrap_api_call(
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "/usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py", line 559, in wrap_api_call
    raise rewrite_error(error, f"{parsed_st['apiName']}: {error}") from None
playwright._impl._errors.Error: Page.evaluate: TypeError: Cannot read properties of undefined (reading 'length')
    at eval (eval at evaluate (:290:30), <anonymous>:4:162)
    at UtilityScript.evaluate (<anonymous>:297:18)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
    FAIL | N18 | the test itself failed: Error("Page.evaluate: TypeError: Cannot read properties of undefined (reading 'length')\n    at eval (eval at evaluate (:290:30), <anonymous>:4:162)\n    at UtilityScript.evaluate (<anonymous>:297:18)\n    at UtilityScript.<anonymous> (<anonymous>:1:44)")
    PASS | N19 | oct1-day: halloween (101 pieces, path open False); oct1-night: halloween (101 pieces, path open True); oct31-day: halloween (101 pieces, path open False); oct31-night: halloween (101 pieces, path open True); nov1: None (0 pieces, path open False); sep30: None (0 pieces, path open False); October sho
    FAIL | N20 | not proved: the holiday spot (jobs 4 and 11) is not built yet (the job is still to come)
    FAIL | N21 | not proved: New Year (job 11) is not built yet (the job is still to come)
    FAIL | N22 | not proved: the school party (job 11) is not built yet (the job is still to come)
    PASS | N23 | 68 signs in 15 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castles': off centre 0.0%, inside True, nothing crosses it True, nothing coplanar True; '🏆 Pet Show': off 
    FAIL | N24 | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the biggest difference in a grandma's place 1.32 m (1 s of walking is 1.15 m); turn 545: at 76 s two sit 2, seats [0, 1, 0], the pond bench taken [True, 
    FAIL | N25 | not proved: the photographer job (job 15) is not built yet (the job is still to come)
    PASS | N26 | ipad-landscape: no job: corner map shown True, job text hidden True, 228 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 2
    PASS | N27 | 10 pieces of trash out of 28 spots today, kinds {'can': 3, 'paper': 2, 'cup': 2, 'peel': 3}; picking one up: True (+3 coins, remembered); over 8 days the trash kinds are ['can', 'cup', 'paper', 'peel']
    FAIL | N28 | not proved: the pet shop upstairs (job 12) is not built yet (the job is still to come)
    PASS | N29 | walking at the pond from four sides stops 2.5 m from its middle (the water's edge is 1.45 m); hand-rail tubes left: 0; ducks 2, Feed-the-ducks spots 3, walk strips through water 0, height over the pond 0
    PASS | N30 | clouds: 16 in the sky + 6 at the beach, 22 meshes, 0 not the cloud material, 0 outline hulls; by day top #ffffff bottom #dde4f0; day sky picture: 0.0% dark pixels in the sky band clear of the buttons (limit 0.3%); grey weather: top #d3d9e4 bottom #a9b2c2; night: top #9aa1c8 bottom #5d6489; leaves in
    PASS | N31 | 219 round trees and 57 pines against 27 buildings' walls: 0 crowns inside a wall; the closest crown {'gap': 0.21, 'tree': [34.9, -30.2, 'tree'], 'building': '23,-31'}; wall at 12: steps>6 0.72% (limit 1.5), mean step 0.227 (limit .45; the streaked wall had 4.5% and .92), lum 206; wall at 11.5: steps
    PASS | N32 | the truck at (-34.2, 11.8): 842 triangles in 152 facing directions, 466 close same-facing pairs looked at, 0 overlapping within 1 cm; food trucks in the game (by their sign): 1; the sign: off centre 0.3%, crossed [], coplanar 0; the burger picture on the sign (left 35%): 6536 coloured pixels besides
    FAIL | N33 | not proved: levels to 50 and the garden spots (job 10) is not built yet (the job is still to come)
    FAIL | N34 | not proved: the house floors and colour (job 10) is not built yet (the job is still to come)
    PASS | N35 | default: switch on True, notepad shown True; Settings has the switch: {'text': '✏️ On', 'w': 92.6875, 'h': 52}; after Off: shown False, switch 'Off', saved False, notes kept True; after On: shown True, notes kept True; with the designer card the notepad steps aside True and comes back True
    FAIL | N36 | not proved: the new furniture (job 13) is not built yet (the job is still to come)
    FAIL | N37 | not proved: the tree adventure park (job 16) is not built yet (the job is still to come)
    FAIL | N38 | not proved: the job tutorials (job 14) is not built yet (the job is still to come)
    FAIL | N39 | not proved: the parties and the dance game (job 17) is not built yet (the job is still to come)
Task exception was never retrieved
future: <Task finished name='Task-1317' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
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
    PASS | N40 | index.html 1.36 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 26 areas, 1507 pieces, 1190478 triangles; town 528 -> 571 pieces, 786282 -> 804262 triangles; limits city:0.15:0.25,pets:1.0:1.0
    PASS | N41 | bus days per week (6 weeks): [3, 3, 3, 3, 3, 3]; the two devices agree on every bus day and hour: True; 10 mornings at the park stop: 4 bus days, 6 without; a morning without a bus says e.g. 🚌 Next bus: Tue 8:50; a bus day says e.g. 🚌 Bus to the beach: 0:22
[stage run4: done in 656 s]
    FAIL | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 10546 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 18086 ms and jumped to the same day: True; af
    PASS | N16 Rain sky: in rain, snow and cloudy weather the sky top and bottom are grey, never bright blue, at 8:00, 12:00, 18:00 and 23:00 | cloudy 8:00 #9ba7b5/#d3dae2; cloudy 12:00 #9ba7b5/#d3dae2; cloudy 18:00 #9ba7b5/#d3dae2; cloudy 23:00 #181a28/#2b2f41; rain 8:00 #6e7a8b/#a9b2be; rain 12:00 #6e7a8b/#a9b2be; rain 18:00 #6e7a8b/#a9b2be
    PASS | N17 Updates: a newer file appears while playing -> the game saves and reloads by itself at the next calm moment, never inside a job, scene, class, show, bus ride, shoot, dance round or typing; never twice for one version; an older-version player shows "⏳ older version" | a newer file found while the phone was open: update started False (toast ''); during a scene: started False; calm: note '✨ Updating Cozy Town… your game is' then reload after 1800 ms; the page now run
    FAIL | N18 Same for everyone: an iPad-size player and a PC-size player see the same time, weather, every house's floors and colour, every furniture piece (x, z, turn, floor) on visits, gardens, holiday pieces, ghosts, trash, grandmas; on every house's stairs no wall or window crosses the view | the test itself failed: Error("Page.evaluate: TypeError: Cannot read properties of undefined (reading 'length')\n    at eval (eval at evaluate (:290:30), <anonymous>:4:162)\n    at UtilityScript.evalu
    PASS | N19 Halloween: October 1 and 31 (day and night) show it, 1 Nov doesn't; costumes on sale only in October, wearable, seen by others, kept after; the spooky path at the Flower Corner at least 20% longer than the park's was, at least 5 scare kinds, each turns you to face it with a small shake and a soft sound only with sound on; ghosts all over town, none inside; every holiday piece touches the ground or a support (gap under 2 cm) | oct1-day: halloween (101 pieces, path open False); oct1-night: halloween (101 pieces, path open True); oct31-day: halloween (101 pieces, path open False); oct31-night: halloween (101 pieces, path open
    FAIL | N20 Holiday spot: February heart fountain and petals; in the Easter month the bunny and 25 eggs (all 25 -> bunny costume and 50 coins, once a year); December Christmas tree and Santa (10 coins on 1 Dec, 300 on 31 Dec, once per real day); other months the flower garden as before | not proved: the holiday spot (jobs 4 and 11) is not built yet (the job is still to come) (0 s)
    FAIL | N21 New Year: fireworks every game night 28 to 31 Dec; party hats on everyone and confetti on 31 Dec and 1 Jan; nothing on 2 Jan | not proved: New Year (job 11) is not built yet (the job is still to come) (0 s)
    FAIL | N22 School: on 1 Sep balloons around and in the school; a teacher gives the globe once; nothing on 2 Sep | not proved: the school party (job 11) is not built yet (the job is still to come) (0 s)
    PASS | N23 Signs: every sign's text centered (within 3% of the sign) and inside its box with a margin, with and without a colour emoji font; the four named signs clean; no post, roof, light or spike crosses any sign's text | 68 signs in 15 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castle
    FAIL | N24 Grandmas: exactly 3; none by the town houses; they sit on the duck-pond bench feeding the ducks at times, walk to places and talk about them; the same places for two players | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the biggest difference in a grandma's place 1.32 m (1
    FAIL | N25 Photographer: one booking plays from the message to the pay on iPad, sideways iPhone and PC; a perfect photo gets 5 stars; a photo with someone cut off gets fewer | not proved: the photographer job (job 15) is not built yet (the job is still to come) (0 s)
    PASS | N26 Map: the corner map and 📱 Map draw the town (never one flat colour) on every screen size; the facing arrow turns every frame you turn; the corner map shows wherever it should | ipad-landscape: no job: corner map shown True, job text hidden True, 228 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that fra
    PASS | N27 Trash: only cans, paper, peels and cups; picking up still works | 10 pieces of trash out of 28 spots today, kinds {'can': 3, 'paper': 2, 'cup': 2, 'peel': 3}; picking one up: True (+3 coins, remembered); over 8 days the trash kinds are ['can', 'cup', 'paper', 'peel'
    FAIL | N28 Pet shop: two floors; each kind in its own area upstairs, no kind in another's area; clothes and snacks on shelves downstairs; adopting and buying still work | not proved: the pet shop upstairs (job 12) is not built yet (the job is still to come) (0 s)
    PASS | N29 Pond: no bridge; nobody can walk on the water | walking at the pond from four sides stops 2.5 m from its middle (the water's edge is 1.45 m); hand-rail tubes left: 0; ducks 2, Feed-the-ducks spots 3, walk strips through water 0, height over the pon
    PASS | N30 Sky: clouds soft (no outlines, no hard dark faces) by day and night; no orange specks above the trees; any leaves are leaf-shaped and near trees | clouds: 16 in the sky + 6 at the beach, 22 meshes, 0 not the cloud material, 0 outline hulls; by day top #ffffff bottom #dde4f0; day sky picture: 0.0% dark pixels in the sky band clear of the buttons 
    PASS | N31 Trees: no tree crown inside any building; no white smear on any wall | 219 round trees and 57 pines against 27 buildings' walls: 0 crowns inside a wall; the closest crown {'gap': 0.21, 'tree': [34.9, -30.2, 'tree'], 'building': '23,-31'}; wall at 12: steps>6 0.72% (limit
    PASS | N32 Food trucks: no flicker (no two surfaces closer than 1 cm facing the same way); the sign and the burger picture clean | the truck at (-34.2, 11.8): 842 triangles in 152 facing directions, 466 close same-facing pairs looked at, 0 overlapping within 1 cm; food trucks in the game (by their sign): 1; the sign: off centre 0
    FAIL | N33 Levels and garden: every skill reaches 50 and stops there; +6 seed spots at gardening 10/20/30/40/50; another player sees your plants | not proved: levels to 50 and the garden spots (job 10) is not built yet (the job is still to come) (0 s)
    FAIL | N34 House floors and colour: 2 floors at decorating 10 up to 6 at 50; the stairs work up and down on every floor; the outside shows the floors and the chosen colour, also for others; old saves keep every piece | not proved: the house floors and colour (job 10) is not built yet (the job is still to come) (0 s)
    PASS | N35 Notepad switch: off hides it, on brings it back with the notes kept | default: switch on True, notepad shown True; Settings has the switch: {'text': '✏️ On', 'w': 92.6875, 'h': 52}; after Off: shown False, switch 'Off', saved False, notes kept True; after On: shown True
    FAIL | N36 Furniture: at least 60 new pieces across every kind, each buyable, placeable, saved and seen by a visitor | not proved: the new furniture (job 13) is not built yet (the job is still to come) (0 s)
    FAIL | N37 Tree park: each of the three paths can be finished; zip lines work; signs readable; free; a fall puts you back on the last platform; on every device | not proved: the tree adventure park (job 16) is not built yet (the job is still to come) (0 s)
    FAIL | N38 Tutorials: the hairstylist and pizza jobs show a picture tutorial the first time and from "?" | not proved: the job tutorials (job 14) is not built yet (the job is still to come) (0 s)
    FAIL | N39 Parties: host at the mailbox and pick a time; every online test player gets the note with the host's name and can accept or decline; with a disco floor and ball the dance game runs for two; hits make dance moves; the score bar slides smoothly (never jumps), even = middle with both faces; an old version doesn't crash | not proved: the parties and the dance game (job 17) is not built yet (the job is still to come) (0 s)
    PASS | N40 Smooth and light: E1 within the run-4 limits (town 15%/25% with Halloween, rain and ghosts on; pet shop up to double; home within 10% with 6 floors; the tree park within the beach's size; others 10%); index.html under 1.8 MB | index.html 1.36 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 26 areas, 1507 pieces, 1190478 triangles; town 528 -> 571 pieces, 786282 -> 804262 triangles; limits cit
    PASS | N41 Bus: with the one clock the bus still comes 3 days a week and the pill shows the next bus with its weekday | bus days per week (6 weeks): [3, 3, 3, 3, 3, 3]; the two devices agree on every bus day and hour: True; 10 mornings at the park stop: 4 bus days, 6 without; a morning without a bus says e.g. 🚌 Next bu
[partial run: some stages skipped by --only]
```

### Stage 1: N3 after the friends' slip fix, N18 and N24 after their kit fixes
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1c/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1c/new/claude-new.html: removed 55 online-part lines; md5 c018cac58324f8d7c2cbda0b667afa29
[stage night3: running]
    PASS | N3 | stop 1: 4 friends, 4 in view in front, 1.47 m apart; 3 pets, closest gap 1.26 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.54 m apart; 3 pets, closest gap 1.71 m; after turning round: 4 of 4 back in view
[stage night3: done in 47 s]
    PASS | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.47 m apart; 3 pets, closest gap 1.26 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.54 m apart; 3 pets, closest gap 1.71
[stage run4: running]
    PASS | N18 | iPad and PC: time 14:15 / 14:15, Saturday / Saturday, weather rain / rain, holiday halloween with 101 / 101 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, garden) same True, grandmas same True; B visits A (ok/ok/ok, let in True): in visit, room 12x10 (host 12x
    PASS | N24 | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the same clock moment: the biggest difference in a grandma's place 0.12 m (the same turn and stop on both: True); clocks 1 s apart: 1.16 m (1 s of walkin
[stage run4: done in 81 s]
    PASS | N18 Same for everyone: an iPad-size player and a PC-size player see the same time, weather, every house's floors and colour, every furniture piece (x, z, turn, floor) on visits, gardens, holiday pieces, ghosts, trash, grandmas; on every house's stairs no wall or window crosses the view | iPad and PC: time 14:15 / 14:15, Saturday / Saturday, weather rain / rain, holiday halloween with 101 / 101 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, garde
    PASS | N24 Grandmas: exactly 3; none by the town houses; they sit on the duck-pond bench feeding the ducks at times, walk to places and talk about them; the same places for two players | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the same clock moment: the biggest difference in a gr
[partial run: some stages skipped by --only]
```

### Stage 1: N15 alone on a quiet machine (still 9 s: the sign measuring was the cause)
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1d/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1d/new/claude-new.html: removed 55 online-part lines; md5 c018cac58324f8d7c2cbda0b667afa29
[stage run4: running]
    FAIL | N15 | the code writes a day number in 0 places; the day-58 save loaded in 9222 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 11358 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, skil
[stage run4: done in 40 s]
    FAIL | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 9222 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 11358 ms and jumped to the same day: True; aft
[partial run: some stages skipped by --only]
```

### Stage 1: N15 and N23 after the sign-measuring fix (N15 then failed only on the Saturday trophy in the clock chip)
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1e/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1e/new/claude-new.html: removed 55 online-part lines; md5 ccad40c8beee4fe82cfe083de72e9d37
[stage run4: running]
    FAIL | N15 | the code writes a day number in 0 places; the day-58 save loaded in 104 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 80 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, skills k
    PASS | N23 | 66 signs in 15 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castles': off centre 0.2%, inside True, nothing crosses it True, nothing coplanar True; '🏆 Pet Show': off 
[stage run4: done in 57 s]
    FAIL | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 104 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 80 ms and jumped to the same day: True; after t
    PASS | N23 Signs: every sign's text centered (within 3% of the sign) and inside its box with a margin, with and without a colour emoji font; the four named signs clean; no post, roof, light or spike crosses any sign's text | 66 signs in 15 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castle
[partial run: some stages skipped by --only]
```

### Stage 1: N15 with the kit's chip rule allowing the trophy
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1g/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1g/new/claude-new.html: removed 55 online-part lines; md5 ccad40c8beee4fe82cfe083de72e9d37
[stage run4: running]
    PASS | N15 | the code writes a day number in 0 places; the day-58 save loaded in 126 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 128 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, skills 
[stage run4: done in 47 s]
    PASS | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 126 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 128 ms and jumped to the same day: True; after 
[partial run: some stages skipped by --only]
```

### Stage 1: the quick stages (files, counts, saves, players, claude, book) on the final file
```
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-17, github-live.html read on 2026-10-17
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-17"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 88 s]
    PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 732 after; grew: {"clothes": "22 -> 26"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 26 areas, 1409 pieces, 1158574 triangles in total | for information, seen from 5 spots: city 160 draws; home 34 draws; market 38 draws; cafe 48 draws; school 44 draws
[stage saves: running]
[stage saves: done in 572 s]
    PASS | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none);
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 36 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 30 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage book: running]
[stage book: done in 130 s]
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

### Stage 1: the saves and PC keys stages together on the final file, K1 playing at noon (run alone first, the PC keys stage crashed for want of the saves stage's fresh save: the kit now names a crash's place)
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1i/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage1i/new/claude-new.html: removed 55 online-part lines; md5 ccad40c8beee4fe82cfe083de72e9d37
[stage saves: running]
[stage saves: done in 437 s]
    PASS | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none);
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage pc_keys: running]
[stage pc_keys: done in 24 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
```

### Stage 1: the last state of every line after the reruns
PASS: N1, N2, N3, N4, N5, N6, N7, N8, N9, N10, N11, N12, N13, N14, N15, N16, N17, N18, N19, N23, N24, N26, N27, N29, N30, N31, N32, N35, N40, N41
FAIL, jobs still to come (every run-4 line starts as FAIL and passes only on proof): N20, N21, N22, N25, N28, N33, N34, N36, N37, N38, N39
FAIL, anything else: none

### Job 10 (N33 and N34, both written for this job in the kit's house4.py; the scratch-copy dry runs before them found two things in the edits, not the game: the house-colour button was declared before ACT existed, and a visitor sitting on upstairs furniture still used the old east offset)
```
[stage run4: running]
    PASS | N33 | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before); level-up coins paid [500, 500, 500]…; yard spots 36 (30 pots), garden save slots 36; a spot's gar
    PASS | N34 | an old big-house save: 2 floors, 33 pieces kept (16 upstairs, drawn 40 m along: [40]), 33 placed; buying floors [had, after a try one level short, after the level, coins left, floors built]: [[2, 2, 3, 0, 3], [3, 3, 4, 0, 4], [4, 4, 5, 0, 5], [5, 5, 6, 0, 6]]; at 6 floors: ['at 6', 6, 2500]; pieces 
[stage run4: done in 57 s]
    PASS | N33 Levels and garden: every skill reaches 50 and stops there; +6 seed spots at gardening 10/20/30/40/50; another player sees your plants | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before
    PASS | N34 House floors and colour: 2 floors at decorating 10 up to 6 at 50; the stairs work up and down on every floor; the outside shows the floors and the chosen colour, also for others; old saves keep every piece | an old big-house save: 2 floors, 33 pieces kept (16 upstairs, drawn 40 m along: [40]), 33 placed; buying floors [had, after a try one level short, after the level, coins left, floors built]: [[2, 2, 3
[partial run: some stages skipped by --only]
```

### Job 11 (N1 rewritten to whole months, N20, N21, N22; the scratch-copy dry run before them found that a year change inside the Easter month did not deal new egg spots, so the holiday build is keyed by holiday and year now)
```
[stage night3: running]
    PASS | N1 | 25 Oct day: halloween (101 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (33 pieces); 28 Mar 2027: easter (30 pieces); 10 Feb 2027: valent
[stage night3: done in 19 s]
    PASS | N1 Holidays fill their month (run 4): Halloween 1-31 Oct, Valentine all February, Easter the month of Easter Sunday, Christmas 1-31 Dec, nothing in other months (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (101 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: Fals
[stage run4: running]
    PASS | N20 | 14 Feb: valentine, gate open True, pieces {'heart fountain': 1, 'heart': 4, 'garland': 2}, petals True; walking at the heart fountain stops 1.6 m from its middle; 10 Mar 2027: easter, bunny True, 25 hunt eggs (25 drawn, 25 to pick up), decorative eggs 23; a PC-size player two weeks later finds the 2
    PASS | N21 | fireworks [want, drawn, bursts in 4.5 s]: 27 Dec night: False False 0, 28 Dec night: True True 1, 28 Dec day: False False 0, 31 Dec night: True True 2, 1 Jan night: False False 0; party [hats on / hats, own hats hidden / own, confetti]: 30 Dec: 0/81 0/12 False, 31 Dec: 81/81 12/12 True, 1 Jan: 81/81
    PASS | N22 | 1 Sep: party True, 10 balloon bunches (6 outside by the school: 6 within its front; in the hall True); the teacher: globes in My stuff 0 -> 1 after talking, 1 after talking again (year 2026); '👩‍🏫 “Happy first day of school! 🎈 Here is a little globe for your d'; the globe builds with 13 parts, in th
[stage run4: done in 56 s]
    PASS | N20 Holiday spot: February heart fountain and petals; in the Easter month the bunny and 25 eggs (all 25 -> bunny costume and 50 coins, once a year); December Christmas tree and Santa (10 coins on 1 Dec, 300 on 31 Dec, once per real day); other months the flower garden as before | 14 Feb: valentine, gate open True, pieces {'heart fountain': 1, 'heart': 4, 'garland': 2}, petals True; walking at the heart fountain stops 1.6 m from its middle; 10 Mar 2027: easter, bunny True, 25 h
    PASS | N21 New Year: fireworks every game night 28 to 31 Dec; party hats on everyone and confetti on 31 Dec and 1 Jan; nothing on 2 Jan | fireworks [want, drawn, bursts in 4.5 s]: 27 Dec night: False False 0, 28 Dec night: True True 1, 28 Dec day: False False 0, 31 Dec night: True True 2, 1 Jan night: False False 0; party [hats on / hat
    PASS | N22 School: on 1 Sep balloons around and in the school; a teacher gives the globe once; nothing on 2 Sep | 1 Sep: party True, 10 balloon bunches (6 outside by the school: 6 within its front; in the hall True); the teacher: globes in My stuff 0 -> 1 after talking, 1 after talking again (year 2026); '👩‍🏫 “Ha
[partial run: some stages skipped by --only]
```

### Job 12 (N28 written for this job in the kit's pets4.py, and the night-3 line N11 again; the scratch-copy dry run found the pet clothes rack's helper sharing its name with the Clothes Shop's, which broke the mannequins' geometry until it was renamed)
```
[stage night3: running]
    PASS | N11 | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (4) | 
[stage night3: done in 41 s]
    PASS | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed
[stage run4: running]
    PASS | N28 | 2 floors; 7 areas upstairs for ['bunny', 'capybara', 'cat', 'dog', 'duck', 'hamster', 'owl']; 14 animals; 60 s of wandering: 0 of 16800 animal-frames outside their own area; who lives where: [['dog', 'pug', 'pomchi', 'sausage'], ['cat', 'cat'], ['bunny', 'bunny'], ['capybara'], ['duck', 'duck'], ['o
[stage run4: done in 16 s]
    PASS | N28 Pet shop: two floors; each kind in its own area upstairs, no kind in another's area; clothes and snacks on shelves downstairs; adopting and buying still work | 2 floors; 7 areas upstairs for ['bunny', 'capybara', 'cat', 'dog', 'duck', 'hamster', 'owl']; 14 animals; 60 s of wandering: 0 of 16800 animal-frames outside their own area; who lives where: [['dog', 
[partial run: some stages skipped by --only]
```

### Job 13 (N36 written for this job in the kit's furn4.py; the scratch-copy dry run found five pieces poking out of their footprint or under the floor: the race car bed's and the drum kit's wheels, the palm's fronds, the monstera, the disco ball's arm; all five were trimmed)
```
[stage run4: running]
    PASS | N36 | 72 new pieces (r4), 54 with several colours; builds, fits its footprint, buyable and priced: 72 of 72; kinds covered: 13 of 13; in the shop's list 72, thumbnails drawn 6/6, in the designer's pool 72; placed in the house one by one: 72 (failed []); bought a loveseat from the catalog for 190 coins (pl
[stage run4: done in 33 s]
    PASS | N36 Furniture: at least 60 new pieces across every kind, each buyable, placeable, saved and seen by a visitor | 72 new pieces (r4), 54 with several colours; builds, fits its footprint, buyable and priced: 72 of 72; kinds covered: 13 of 13; in the shop's list 72, thumbnails drawn 6/6, in the designer's pool 72; 
[partial run: some stages skipped by --only]
```

### Job 14 (N38 written for this job in the kit's tut4.py)
```
[stage run4: running]
    PASS | N38 | delivery: shows by itself 5 steps: 'Pizza delivery 🍕' picture True 5 words, 'Follow the dot 🗺️' picture True 9 words, 'Ring the bell 🚪' picture True 6 words, 'Be quick! ⚡' picture True 5 words, 'Let's go! 🛵' picture True 7 words; after the last step: gone True, remembered True; second time by itself
[stage run4: done in 28 s]
    PASS | N38 Tutorials: the hairstylist and pizza jobs show a picture tutorial the first time and from "?" | delivery: shows by itself 5 steps: 'Pizza delivery 🍕' picture True 5 words, 'Follow the dot 🗺️' picture True 9 words, 'Ring the bell 🚪' picture True 6 words, 'Be quick! ⚡' picture True 5 words, 'Let's
[partial run: some stages skipped by --only]
```

### Job 15 (N25 written for this job in the kit's photo4.py)
```
[stage run4: running]
    PASS | N25 | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: wedding at Duck Pond with bench behind, for ['ap3', 's2']; message '📸 New booking: Oscar', the note '📸 New booking!', job box '📸 → Duck P
[stage run4: done in 43 s]
    PASS | N25 Photographer: one booking plays from the message to the pay on iPad, sideways iPhone and PC; a perfect photo gets 5 stars; a photo with someone cut off gets fewer | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: wedding at Duck Pond with bench behin
[partial run: some stages skipped by --only]
```

### Job 16 (N37 written for this job in the kit's tree4.py)
```
[stage run4: running]
    PASS | N37 | [ipad-landscape] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; sign
[stage run4: done in 54 s]
    PASS | N37 Tree park: each of the three paths can be finished; zip lines work; signs readable; free; a fall puts you back on the last platform; on every device | [ipad-landscape] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium pat
[partial run: some stages skipped by --only]
```

### Job 17 (N39 written for this job in the kit's party4.py)
```
[stage run4: running]
    PASS | N39 | three players online together: True (A sees ['ZZTEST-GUESTB', 'ZZTEST-OLDC']); A at the mailbox: button 'Mailbox: mail or a party', menu mail True / party True, times offered ['☀️Today13:00', '☀️Today14:00', '☀️Today15:00', '☀️Today16:00'], picked -> party {'h': 13, 'future': True}; B gets the news:
[stage run4: done in 39 s]
    PASS | N39 Parties: host at the mailbox and pick a time; every online test player gets the note with the host's name and can accept or decline; with a disco floor and ball the dance game runs for two; hits make dance moves; the score bar slides smoothly (never jumps), even = middle with both faces; an old version doesn't crash | three players online together: True (A sees ['ZZTEST-GUESTB', 'ZZTEST-OLDC']); A at the mailbox: button 'Mailbox: mail or a party', menu mail True / party True, times offered ['☀️Today13:00', '☀️Today
[partial run: some stages skipped by --only]
```

### Stage 2 end: the full check (`--full`, stages night3 + run4)
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage2b/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/stage2b/new/claude-new.html: removed 55 online-part lines; md5 c854d990680c40817526e4749cdb0a7c
[stage files: running]
[stage files: done in 0 s]
    PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-18, github-live.html read on 2026-10-18
    PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-18"
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 55 s]
    PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 880 after; grew: {"areas": "25 -> 26", "places": "22 -> 23", "doors": "23 -> 24", "furniture": "61 -> 134", "furniture_for_sale": "39 -> 111", "hats": "19 -> 20", "clothes
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 27 areas, 1456 pieces, 1217232 triangles in total | for information, seen from 5 spots: city 187 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 354 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new player id g
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 28 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 22 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage book: running]
[stage book: done in 97 s]
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 7 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 7 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 7 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
    PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
    PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 7 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
[stage night3: running]
    PASS | N1 | 25 Oct day: halloween (101 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (33 pieces); 28 Mar 2027: easter (30 pieces); 10 Feb 2027: valent
    PASS | N2 | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding: 4
    PASS | N3 | stop 1: 4 friends, 4 in view in front, 1.47 m apart; 3 pets, closest gap 1.26 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.54 m apart; 3 pets, closest gap 1.71 m; after turning round: 4 of 4 back in view
    PASS | N4 | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (13/15 at 23.5,-25.3 h11.14)
    PASS | N5 | 24 benches in ['city', 'beach']; 45 seats sat on, 3 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag 1, legs -1.45); B's try for the same seat: seat 1 False, seat 2 True, toast 'Comfy! Move to stand u
    PASS | N6 | day (game clock 13:10): out [True, True, True], drawn (within 48 m of the camera) [False, False, True], sitting [True, True, False], pond bench taken [True, True]; night (game clock 4:30): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, Fals
    PASS | N7 | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboards for sale: ['cupboard', 'cupboardn', 'drawers', 'cornercup', 'tallcup', 'wallcup'] in 5 colours; g
Task exception was never retrieved
future: <Task finished name='Task-2164' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
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
    PASS | N8 | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 0 -> 1; 2-room order (s1: bluebed + unikids); message: "Hi! I'm Nora 😊 I live in the Purple house, near the Football Field. Ca"; room 1 has 2 things; 'All done?' with room 2 empty offers to cal
    PASS | N9 | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy burger ok, you have 1; at 21:00: card opens False, bought False ('🌙 The Food truck is closed now. It op
    PASS | N10 | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #6e7a8b, sun 0.28; snow: flakes True (indoors False), ground #e3f0ea; sunny: sky #4fb4ff, sun 0.56, no rain True; cloudy: 
    PASS | N11 | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (4) | 
    PASS | N12 | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout 
    PASS | N13 | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat after 1
    PASS | N14 | index.html 1.56 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 27 areas, 1568 pieces, 1227424 triangles; town 522 -> 597 pieces, 770726 -> 795314 triangles; limits city:0.15:0.25,pets:1.0:1.0
[stage night3: done in 360 s]
    PASS | N1 Holidays fill their month (run 4): Halloween 1-31 Oct, Valentine all February, Easter the month of Easter Sunday, Christmas 1-31 Dec, nothing in other months (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (101 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: Fals
    PASS | N2 Rosie: zero sounds while chatting with her and when her messages arrive; other friends, the chef and clients still sound | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding
    PASS | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.47 m apart; 3 pets, closest gap 1.26 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.54 m apart; 3 pets, closest gap 1.71
    PASS | N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (13/15 at 23.5,-25.3 h11.14) (11 s)
    PASS | N5 Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose | 24 benches in ['city', 'beach']; 45 seats sat on, 3 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag
    PASS | N6 Grandmas (rewritten for run 4): the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit | day (game clock 13:10): out [True, True, True], drawn (within 48 m of the camera) [False, False, True], sitting [True, True, False], pond bench taken [True, True]; night (game clock 4:30): out [False,
    PASS | N7 Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboar
    PASS | N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 0 -> 1; 2-room order (s1: bluebed + unikids); message: "Hi! I'm Nora 😊 I live in the Purple h
    PASS | N9 Food: every new food can be bought, eaten (also on a bench) and shows its icon and name | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy bur
    PASS | N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #6e7a8b, sun 0.28; sno
    PASS | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed
    PASS | N12 House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, 
    PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers
    PASS | N14 Smooth and light (rewritten for run 4): E1 within the run-4 limits given to the check (town up to 15% more pieces and 25% more triangles, measured with Halloween, rain and the ghosts on; pet shop up to double; every other area 10%; a new area at most the beach's size), measured against the starting file; index.html under 1.8 MB | index.html 1.56 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 27 areas, 1568 pieces, 1227424 triangles; town 522 -> 597 pieces, 770726 -> 795314 triangles; limits cit
[stage run4: running]
    PASS | N15 | the code writes a day number in 0 places; the day-58 save loaded in 115 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 62 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, skills k
    PASS | N16 | cloudy 8:00 #9ba7b5/#d3dae2; cloudy 12:00 #9ba7b5/#d3dae2; cloudy 18:00 #9ba7b5/#d3dae2; cloudy 23:00 #181a28/#2b2f41; rain 8:00 #6e7a8b/#a9b2be; rain 12:00 #6e7a8b/#a9b2be; rain 18:00 #6e7a8b/#a9b2be; rain 23:00 #181b28/#2b2f42; snow 8:00 #aab4c1/#e4e9ef; snow 12:00 #aab4c1/#e4e9ef; snow 18:00 #aab
    PASS | N17 | a newer file found while the phone was open: update started False (toast ''); during a scene: started False; calm: note '✨ Updating Cozy Town… your game is' then reload after 1800 ms; the page now runs version 2026101802 (title True, says '✨ Cozy Town is updated!'); the save made first has coins 777
    PASS | N18 | iPad and PC: time 14:20 / 14:20, Sunday / Sunday, weather cloudy / cloudy, holiday halloween with 101 / 101 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, garden) same True, grandmas same True; B visits A (ok/ok/ok, let in True): in visit, room 12x10 (host 12x
    PASS | N19 | oct1-day: halloween (101 pieces, path open False); oct1-night: halloween (101 pieces, path open True); oct31-day: halloween (101 pieces, path open False); oct31-night: halloween (101 pieces, path open True); nov1: None (0 pieces, path open False); sep30: None (0 pieces, path open False); October sho
    PASS | N20 | 14 Feb: valentine, gate open True, pieces {'heart fountain': 1, 'heart': 4, 'garland': 2}, petals True; walking at the heart fountain stops 1.6 m from its middle; 10 Mar 2027: easter, bunny True, 25 hunt eggs (25 drawn, 25 to pick up), decorative eggs 23; a PC-size player two weeks later finds the 2
    PASS | N21 | fireworks [want, drawn, bursts in 4.5 s]: 27 Dec night: False False 0, 28 Dec night: True True 2, 28 Dec day: False False 0, 31 Dec night: True True 3, 1 Jan night: False False 0; party [hats on / hats, own hats hidden / own, confetti]: 30 Dec: 0/81 0/12 False, 31 Dec: 81/81 12/12 True, 1 Jan: 81/81
    PASS | N22 | 1 Sep: party True, 10 balloon bunches (6 outside by the school: 6 within its front; in the hall True); the teacher: globes in My stuff 0 -> 1 after talking, 1 after talking again (year 2026); '👩‍🏫 “Happy first day of school! 🎈 Here is a little globe for your d'; the globe builds with 13 parts, in th
    PASS | N23 | 71 signs in 16 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castles': off centre 0.2%, inside True, nothing crosses it True, nothing coplanar True; '🏆 Pet Show': off 
    PASS | N24 | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the same clock moment: the biggest difference in a grandma's place 0.04 m (the same turn and stop on both: True); clocks 1 s apart: 1.15 m (1 s of walkin
    PASS | N25 | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: wedding at Flower Corner with hedge behind, for ['s2', 'n1']; message '📸 New booking: Max', the note '📸 New booking!', job box '📸 → Flowe
Task exception was never retrieved
future: <Task finished name='Task-3977' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
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
    PASS | N26 | ipad-landscape: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 2
    PASS | N27 | 10 pieces of trash out of 28 spots today, kinds {'peel': 3, 'paper': 2, 'can': 3, 'cup': 2}; picking one up: True (+3 coins, remembered); over 8 days the trash kinds are ['can', 'cup', 'paper', 'peel']
    PASS | N28 | 2 floors; 7 areas upstairs for ['bunny', 'capybara', 'cat', 'dog', 'duck', 'hamster', 'owl']; 14 animals; 60 s of wandering: 0 of 16800 animal-frames outside their own area; who lives where: [['dog', 'pug', 'pomchi', 'sausage'], ['cat', 'cat'], ['bunny', 'bunny'], ['capybara'], ['duck', 'duck'], ['o
    PASS | N29 | walking at the pond from four sides stops 2.5 m from its middle (the water's edge is 1.45 m); hand-rail tubes left: 0; ducks 2, Feed-the-ducks spots 3, walk strips through water 0, height over the pond 0
    PASS | N30 | clouds: 16 in the sky + 6 at the beach, 22 meshes, 0 not the cloud material, 0 outline hulls; by day top #ffffff bottom #dde4f0; day sky picture: 0.0% dark pixels in the sky band clear of the buttons (limit 0.3%); grey weather: top #d3d9e4 bottom #a9b2c2; night: top #9aa1c8 bottom #5d6489; leaves in
    PASS | N31 | 223 round trees and 57 pines against 25 buildings' walls: 0 crowns inside a wall; the closest crown {'gap': 0.21, 'tree': [34.9, -30.2, 'tree'], 'building': '23,-31'}; wall at 12: steps>6 0.72% (limit 1.5), mean step 0.227 (limit .45; the streaked wall had 4.5% and .92), lum 206; wall at 11.5: steps
    PASS | N32 | the truck at (-34.2, 11.8): 842 triangles in 152 facing directions, 466 close same-facing pairs looked at, 0 overlapping within 1 cm; food trucks in the game (by their sign): 1; the sign: off centre 0.3%, crossed [], coplanar 0; the burger picture on the sign (left 35%): 6462 coloured pixels besides
    PASS | N33 | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before); level-up coins paid [500, 500, 500]…; yard spots 36 (30 pots), garden save slots 36; a spot's gar
    PASS | N34 | an old big-house save: 2 floors, 33 pieces kept (16 upstairs, drawn 40 m along: [40]), 33 placed; buying floors [had, after a try one level short, after the level, coins left, floors built]: [[2, 2, 3, 0, 3], [3, 3, 4, 0, 4], [4, 4, 5, 0, 5], [5, 5, 6, 0, 6]]; at 6 floors: ['at 6', 6, 2500]; pieces 
    PASS | N35 | default: switch on True, notepad shown True; Settings has the switch: {'text': '✏️ On', 'w': 92.6875, 'h': 52}; after Off: shown False, switch 'Off', saved False, notes kept True; after On: shown True, notes kept True; with the designer card the notepad steps aside True and comes back True
    PASS | N36 | 72 new pieces (r4), 54 with several colours; builds, fits its footprint, buyable and priced: 72 of 72; kinds covered: 13 of 13; in the shop's list 72, thumbnails drawn 6/6, in the designer's pool 72; placed in the house one by one: 72 (failed []); bought a loveseat from the catalog for 190 coins (pl
    PASS | N37 | [ipad-landscape] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; sign
    PASS | N38 | delivery: shows by itself 5 steps: 'Pizza delivery 🍕' picture True 5 words, 'Follow the dot 🗺️' picture True 9 words, 'Ring the bell 🚪' picture True 6 words, 'Be quick! ⚡' picture True 5 words, 'Let's go! 🛵' picture True 7 words; after the last step: gone True, remembered True; second time by itself
    PASS | N39 | three players online together: True (A sees ['ZZTEST-GUESTB', 'ZZTEST-OLDC']); A at the mailbox: button 'Mailbox: mail or a party', menu mail True / party True, times offered ['☀️Today13:00', '☀️Today14:00', '☀️Today15:00', '☀️Today16:00'], picked -> party {'h': 13, 'future': True}; B gets the news:
    PASS | N40 | index.html 1.56 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 27 areas, 1568 pieces, 1227888 triangles; town 522 -> 594 pieces, 770726 -> 795386 triangles; limits city:0.15:0.25,pets:1.0:1.0
    PASS | N41 | bus days per week (6 weeks): [3, 3, 3, 3, 3, 3]; the two devices agree on every bus day and hour: True; 10 mornings at the park stop: 4 bus days, 6 without; a morning without a bus says e.g. 🚌 Next bus: Tue 10:20; a bus day says e.g. 🚌 Next bus: 10:20
[stage run4: done in 697 s]
    PASS | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 115 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 62 ms and jumped to the same day: True; after t
    PASS | N16 Rain sky: in rain, snow and cloudy weather the sky top and bottom are grey, never bright blue, at 8:00, 12:00, 18:00 and 23:00 | cloudy 8:00 #9ba7b5/#d3dae2; cloudy 12:00 #9ba7b5/#d3dae2; cloudy 18:00 #9ba7b5/#d3dae2; cloudy 23:00 #181a28/#2b2f41; rain 8:00 #6e7a8b/#a9b2be; rain 12:00 #6e7a8b/#a9b2be; rain 18:00 #6e7a8b/#a9b2be
    PASS | N17 Updates: a newer file appears while playing -> the game saves and reloads by itself at the next calm moment, never inside a job, scene, class, show, bus ride, shoot, dance round or typing; never twice for one version; an older-version player shows "⏳ older version" | a newer file found while the phone was open: update started False (toast ''); during a scene: started False; calm: note '✨ Updating Cozy Town… your game is' then reload after 1800 ms; the page now run
    PASS | N18 Same for everyone: an iPad-size player and a PC-size player see the same time, weather, every house's floors and colour, every furniture piece (x, z, turn, floor) on visits, gardens, holiday pieces, ghosts, trash, grandmas; on every house's stairs no wall or window crosses the view | iPad and PC: time 14:20 / 14:20, Sunday / Sunday, weather cloudy / cloudy, holiday halloween with 101 / 101 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, garde
    PASS | N19 Halloween: October 1 and 31 (day and night) show it, 1 Nov doesn't; costumes on sale only in October, wearable, seen by others, kept after; the spooky path at the Flower Corner at least 20% longer than the park's was, at least 5 scare kinds, each turns you to face it with a small shake and a soft sound only with sound on; ghosts all over town, none inside; every holiday piece touches the ground or a support (gap under 2 cm) | oct1-day: halloween (101 pieces, path open False); oct1-night: halloween (101 pieces, path open True); oct31-day: halloween (101 pieces, path open False); oct31-night: halloween (101 pieces, path open
    PASS | N20 Holiday spot: February heart fountain and petals; in the Easter month the bunny and 25 eggs (all 25 -> bunny costume and 50 coins, once a year); December Christmas tree and Santa (10 coins on 1 Dec, 300 on 31 Dec, once per real day); other months the flower garden as before | 14 Feb: valentine, gate open True, pieces {'heart fountain': 1, 'heart': 4, 'garland': 2}, petals True; walking at the heart fountain stops 1.6 m from its middle; 10 Mar 2027: easter, bunny True, 25 h
    PASS | N21 New Year: fireworks every game night 28 to 31 Dec; party hats on everyone and confetti on 31 Dec and 1 Jan; nothing on 2 Jan | fireworks [want, drawn, bursts in 4.5 s]: 27 Dec night: False False 0, 28 Dec night: True True 2, 28 Dec day: False False 0, 31 Dec night: True True 3, 1 Jan night: False False 0; party [hats on / hat
    PASS | N22 School: on 1 Sep balloons around and in the school; a teacher gives the globe once; nothing on 2 Sep | 1 Sep: party True, 10 balloon bunches (6 outside by the school: 6 within its front; in the hall True); the teacher: globes in My stuff 0 -> 1 after talking, 1 after talking again (year 2026); '👩‍🏫 “Ha
    PASS | N23 Signs: every sign's text centered (within 3% of the sign) and inside its box with a margin, with and without a colour emoji font; the four named signs clean; no post, roof, light or spike crosses any sign's text | 71 signs in 16 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castle
    PASS | N24 Grandmas: exactly 3; none by the town houses; they sit on the duck-pond bench feeding the ducks at times, walk to places and talk about them; the same places for two players | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the same clock moment: the biggest difference in a gr
    PASS | N25 Photographer: one booking plays from the message to the pay on iPad, sideways iPhone and PC; a perfect photo gets 5 stars; a photo with someone cut off gets fewer | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: wedding at Flower Corner with hedge b
    PASS | N26 Map: the corner map and 📱 Map draw the town (never one flat colour) on every screen size; the facing arrow turns every frame you turn; the corner map shows wherever it should | ipad-landscape: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that fra
    PASS | N27 Trash: only cans, paper, peels and cups; picking up still works | 10 pieces of trash out of 28 spots today, kinds {'peel': 3, 'paper': 2, 'can': 3, 'cup': 2}; picking one up: True (+3 coins, remembered); over 8 days the trash kinds are ['can', 'cup', 'paper', 'peel'
    PASS | N28 Pet shop: two floors; each kind in its own area upstairs, no kind in another's area; clothes and snacks on shelves downstairs; adopting and buying still work | 2 floors; 7 areas upstairs for ['bunny', 'capybara', 'cat', 'dog', 'duck', 'hamster', 'owl']; 14 animals; 60 s of wandering: 0 of 16800 animal-frames outside their own area; who lives where: [['dog', 
    PASS | N29 Pond: no bridge; nobody can walk on the water | walking at the pond from four sides stops 2.5 m from its middle (the water's edge is 1.45 m); hand-rail tubes left: 0; ducks 2, Feed-the-ducks spots 3, walk strips through water 0, height over the pon
    PASS | N30 Sky: clouds soft (no outlines, no hard dark faces) by day and night; no orange specks above the trees; any leaves are leaf-shaped and near trees | clouds: 16 in the sky + 6 at the beach, 22 meshes, 0 not the cloud material, 0 outline hulls; by day top #ffffff bottom #dde4f0; day sky picture: 0.0% dark pixels in the sky band clear of the buttons 
    PASS | N31 Trees: no tree crown inside any building; no white smear on any wall | 223 round trees and 57 pines against 25 buildings' walls: 0 crowns inside a wall; the closest crown {'gap': 0.21, 'tree': [34.9, -30.2, 'tree'], 'building': '23,-31'}; wall at 12: steps>6 0.72% (limit
    PASS | N32 Food trucks: no flicker (no two surfaces closer than 1 cm facing the same way); the sign and the burger picture clean | the truck at (-34.2, 11.8): 842 triangles in 152 facing directions, 466 close same-facing pairs looked at, 0 overlapping within 1 cm; food trucks in the game (by their sign): 1; the sign: off centre 0
    PASS | N33 Levels and garden: every skill reaches 50 and stops there; +6 seed spots at gardening 10/20/30/40/50; another player sees your plants | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before
    PASS | N34 House floors and colour: 2 floors at decorating 10 up to 6 at 50; the stairs work up and down on every floor; the outside shows the floors and the chosen colour, also for others; old saves keep every piece | an old big-house save: 2 floors, 33 pieces kept (16 upstairs, drawn 40 m along: [40]), 33 placed; buying floors [had, after a try one level short, after the level, coins left, floors built]: [[2, 2, 3
    PASS | N35 Notepad switch: off hides it, on brings it back with the notes kept | default: switch on True, notepad shown True; Settings has the switch: {'text': '✏️ On', 'w': 92.6875, 'h': 52}; after Off: shown False, switch 'Off', saved False, notes kept True; after On: shown True
    PASS | N36 Furniture: at least 60 new pieces across every kind, each buyable, placeable, saved and seen by a visitor | 72 new pieces (r4), 54 with several colours; builds, fits its footprint, buyable and priced: 72 of 72; kinds covered: 13 of 13; in the shop's list 72, thumbnails drawn 6/6, in the designer's pool 72; 
    PASS | N37 Tree park: each of the three paths can be finished; zip lines work; signs readable; free; a fall puts you back on the last platform; on every device | [ipad-landscape] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium pat
    PASS | N38 Tutorials: the hairstylist and pizza jobs show a picture tutorial the first time and from "?" | delivery: shows by itself 5 steps: 'Pizza delivery 🍕' picture True 5 words, 'Follow the dot 🗺️' picture True 9 words, 'Ring the bell 🚪' picture True 6 words, 'Be quick! ⚡' picture True 5 words, 'Let's
    PASS | N39 Parties: host at the mailbox and pick a time; every online test player gets the note with the host's name and can accept or decline; with a disco floor and ball the dance game runs for two; hits make dance moves; the score bar slides smoothly (never jumps), even = middle with both faces; an old version doesn't crash | three players online together: True (A sees ['ZZTEST-GUESTB', 'ZZTEST-OLDC']); A at the mailbox: button 'Mailbox: mail or a party', menu mail True / party True, times offered ['☀️Today13:00', '☀️Today
    PASS | N40 Smooth and light: E1 within the run-4 limits (town 15%/25% with Halloween, rain and ghosts on; pet shop up to double; home within 10% with 6 floors; the tree park within the beach's size; others 10%); index.html under 1.8 MB | index.html 1.56 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 27 areas, 1568 pieces, 1227888 triangles; town 522 -> 594 pieces, 770726 -> 795386 triangles; limits cit
    PASS | N41 Bus: with the one clock the bus still comes 3 days a week and the pill shows the next bus with its weekday | bus days per week (6 weeks): [3, 3, 3, 3, 3, 3]; the two devices agree on every bus day and hour: True; 10 mornings at the park stop: 4 bus days, 6 without; a morning without a bus says e.g. 🚌 Next bu
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 348 s]
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 183 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 417 s]
[stage crawl_ipad-landscape_inB: running]
[stage crawl_ipad-landscape_inB: done in 198 s]
[stage crawl_ipad-landscape_inC: running]
[stage crawl_ipad-landscape_inC: done in 52 s]
[stage crawl_ipad-landscape_inD: running]
[stage crawl_ipad-landscape_inD: done in 45 s]
[stage teacher_ipad-landscape: running]
[stage teacher_ipad-landscape: done in 69 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 64 s]
[stage teacher_pc-1920: running]
[stage teacher_pc-1920: done in 79 s]
[stage pc_keys: running]
[stage pc_keys: done in 24 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[stage tour_iphone-portrait_0: running]
[stage tour_iphone-portrait_0: done in 64 s]
[stage tour_iphone-portrait_1: running]
[stage tour_iphone-portrait_1: done in 12 s]
[stage tour_iphone-landscape_0: running]
[stage tour_iphone-landscape_0: done in 68 s]
[stage tour_iphone-landscape_1: running]
[stage tour_iphone-landscape_1: done in 15 s]
[stage tour_android-phone-portrait_0: running]
[stage tour_android-phone-portrait_0: done in 61 s]
[stage tour_android-phone-portrait_1: running]
[stage tour_android-phone-portrait_1: done in 12 s]
[stage tour_android-phone-landscape_0: running]
[stage tour_android-phone-landscape_0: done in 67 s]
[stage tour_android-phone-landscape_1: running]
[stage tour_android-phone-landscape_1: done in 15 s]
[stage tour_android-tablet-portrait_0: running]
[stage tour_android-tablet-portrait_0: done in 74 s]
[stage tour_android-tablet-portrait_1: running]
[stage tour_android-tablet-portrait_1: done in 15 s]
[stage tour_android-tablet-landscape_0: running]
[stage tour_android-tablet-landscape_0: done in 81 s]
[stage tour_android-tablet-landscape_1: running]
[stage tour_android-tablet-landscape_1: done in 18 s]
[stage tour_pc-1366_0: running]
[stage tour_pc-1366_0: done in 79 s]
[stage tour_pc-1366_1: running]
[stage tour_pc-1366_1: done in 17 s]

===== COZY TOWN FINAL CHECK =====
2026-10-18 · check version 6 · update, full sweep for a big update
live Claude fd84696cb6775f78d19c823aed4ab0f2 · new Claude c854d990680c40817526e4749cdb0a7c · live GitHub 709bf763d51be0160c118e2f9249f9f6 · new GitHub 97e1cfaf506c7e8d1f29a125a9a78199
PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-18, github-live.html read on 2026-10-18
PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "Run 4 backup of the live game (tools/prerun4-index.html), made 2026-10-17, checked 2026-10-18"
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 880 after; grew: {"areas": "25 -> 26", "places": "22 -> 23", "doors": "23 -> 24", "furniture": "61 -> 134", "furniture_for_sale": "39 -> 111", "hats": "19 -> 20", "clothes": "22 -> 27", "jobs": "4 -> 5", "phone_chats"
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 27 areas, 1456 pieces, 1217232 triangles in total | for information, seen from 5 spots: city 187 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
FAIL | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); a Friends Lane time given (the save had none); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prenight3-bighouse.json: name 'ZZTEST-BIGHOUSE', coins 3100, furniture 33, pets 0; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prenight3-designer.json: name 'ZZTEST-DESIGNER', coins 400, furniture 0, pets 0; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prenight3-pets.json: name 'ZZTEST-PETS', coins 900, furniture 0, pets 4; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prenight3-upstairs.json: name 'ZZTEST-UPSTAIRS', coins 2345, furniture 7, pets 0; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prerun4-bed.json: name 'ZZTEST-BED', coins 900, furniture 0, pets 4; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-day1.json: name 'ZZTEST-DAY1', coins 120, furniture 3, pets 0; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-day58.json: name 'ZZTEST-DAY58', coins 740, furniture 0, pets 4; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-lv10.json: name 'ZZTEST-LV10', coins 5200, furniture 0, pets 4; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-pets2.json: name 'ZZTEST-PETS2', coins 2400, furniture 0, pets 3; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 1 differences: garden: 6 entries -> 36; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 7 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 7 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 7 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 7 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
PASS | N1 Holidays fill their month (run 4): Halloween 1-31 Oct, Valentine all February, Easter the month of Easter Sunday, Christmas 1-31 Dec, nothing in other months (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (101 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (33 pieces); 28 Mar 2027: easter (30 pieces); 10 Feb 2027: valentine (7 pieces); 10 May: None (0 pieces) (15 s)
PASS | N2 Rosie: zero sounds while chatting with her and when her messages arrive; other friends, the chef and clients still sound | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding: 4 (6 s)
PASS | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.47 m apart; 3 pets, closest gap 1.26 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.54 m apart; 3 pets, closest gap 1.71 m; after turning round: 4 of 4 back in view (18 s)
PASS | N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (13/15 at 23.5,-25.3 h11.14) (11 s)
PASS | N5 Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose | 24 benches in ['city', 'beach']; 45 seats sat on, 3 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag 1, legs -1.45); B's try for the same seat: seat 1 False, seat 2 True, toast 'Comfy! Move to stand up. You c' (30 s)
PASS | N6 Grandmas (rewritten for run 4): the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit | day (game clock 13:10): out [True, True, True], drawn (within 48 m of the camera) [False, False, True], sitting [True, True, False], pond bench taken [True, True]; night (game clock 4:30): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, False], pond bench taken [False, False]; rain (game clock 13:10): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, False], pond bench taken [False, False]; snow (game clock 13:10): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, False], pond bench taken [False, False]; day again (game clock 13:10): out [True, True, True], drawn (within 48 m of the camera) [False, False, True], sitting [True, True, False], pond bench taken [True, True]; at night you can sit on the pond bench: True (11 s)
PASS | N7 Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboards for sale: ['cupboard', 'cupboardn', 'drawers', 'cornercup', 'tallcup', 'wallcup'] in 5 colours; ghost by the stove: at -1.2,-4.649 valid True snapped True colour #22e07c; a saved kitchen with a gap after a reload: unchanged (20 s)
PASS | N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 0 -> 1; 2-room order (s1: bluebed + unikids); message: "Hi! I'm Nora 😊 I live in the Purple house, near the Football Field. Ca"; room 1 has 2 things; 'All done?' with room 2 empty offers to call the client: False; room 2 (Unicorn play room) has 2 things, room 1 still 2; 2-room review: go tapped ok, ended True after 60 rounds, paid 70 🪙, done 1, client said '🙂 Nora gave you 0½ ⭐ for the dreamy blue bedroom and the unicorn play room. You ' (14 s)
PASS | N9 Food: every new food can be bought, eaten (also on a bench) and shows its icon and name | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy burger ok, you have 1; at 21:00: card opens False, bought False ('🌙 The Food truck is closed now. It opens'); taco on a bench: still sitting True, ate True; bag shows '🍣Sushi×2' (12 s)
PASS | N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #6e7a8b, sun 0.28; snow: flakes True (indoors False), ground #e3f0ea; sunny: sky #4fb4ff, sun 0.56, no rain True; cloudy: sun 0.39; weather shares (% of blocks): {"autumn": {"rain": 30, "cloudy": 25, "sunny": 46}, "winter": {"snow": 35, "rain": 4, "cloudy": 29, "sunny": 32}, "spring": {"rain": 26, "sunny": 56, "cloudy": 19}, "summer": {"cloudy": 14, "rain": 16, "sunny": 70}, "xmas": {"snow": 60, "cloudy": 20, "sunny": 21}}; tree colours by season: spring: spring ['#9fe08a', '#b4ea8e', '#8fd97e', '#a6e68c']; summer: summer ['#7ed37a', '#6cc97c', '#93dc76']; autumn: autumn ['#ff9f43', '#ff6b4a', '#ffd45c', '#e8734a']; winter: winter ['#cfe8dc', '#dff2ea', '#b8dcc8', '#e8f4ee'] (57 s)
PASS | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (4) | sausage: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.72, sound True, 4 colours, 6 names, Pet Show True (4) | capybara: adopt True (saved as hamster), follows True, fed True, played True, 4/4 outfit slots, tag 1, sound True, 4 colours, 6 names, Pet Show True (4) | duck: adopt True (saved as bunny), follows True, fed True, played True, 4/4 outfit slots, tag 0.9, sound True, 4 colours, 6 names, Pet Show True (4) | owl: adopt True (saved as cat), follows True, fed True, played True, 4/4 outfit slots, tag 0.92, sound True, 4 colours, 6 names, Pet Show True (2) | old version: loads a save with a pug and a capybara: playing True, 2 pets shown as ['pug', 'capybara']; a friend's pug + capybara + unknown kind show as ['pug', 'capybara', 'capybara'] | new version shows a friend's pets as ['pug', 'capybara'] (32 s)
PASS | N12 House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout kept True; the player (saved upstairs) starts at -3.4,0.0 in home | save-f2cdd53-rich.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout kept True | save-live-web-rich.json: 12x10 room, upstairs True, 5 placed + 0 in My stuff = 5 (before 5), outside the walls 0, overlaps 0, old layout kept True | a new upgrade: big True, furniture unchanged True, downstairs 12x10, upstairs True (half-width 6), coins left 100 | stairs up: floor 1 at -3.4,0.0 (66 s)
PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | pc-1920: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True (46 s)
PASS | N14 Smooth and light (rewritten for run 4): E1 within the run-4 limits given to the check (town up to 15% more pieces and 25% more triangles, measured with Halloween, rain and the ghosts on; pet shop up to double; every other area 10%; a new area at most the beach's size), measured against the starting file; index.html under 1.8 MB | index.html 1.56 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 27 areas, 1568 pieces, 1227424 triangles; town 522 -> 597 pieces, 770726 -> 795314 triangles; limits city:0.15:0.25,pets:1.0:1.0 (15 s)
PASS | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 115 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 62 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, skills kept True, garden plants kept True ([['tomato', 1], ['carrot', 1], ['carrot', 1], ['carrot', 3]]); two devices 1 s apart: 10:00: A 10:09 Sun sunny / B 10:11 Sun sunny; 22:30: A 22:31 Sun rain / B 22:33 Sun rain; +3 d 14:00: A 14:00 Wed cloudy / B 14:02 Wed cloudy; in bed at 22:00: still in bed after 6 s True (clock 22:12, skipped False), sleep screen True says '💤💤💤22:10 · SunSleeping until 7:00 🌙🌅 Wak', Wake up button [143, 48] px; at 7:02: in bed False, screen False, toast "Good morning! It's Monday ☀️"; the clock chip says '9:40 Mon'; 'Day N' on the screen: nowhere (27 s)
PASS | N16 Rain sky: in rain, snow and cloudy weather the sky top and bottom are grey, never bright blue, at 8:00, 12:00, 18:00 and 23:00 | cloudy 8:00 #9ba7b5/#d3dae2; cloudy 12:00 #9ba7b5/#d3dae2; cloudy 18:00 #9ba7b5/#d3dae2; cloudy 23:00 #181a28/#2b2f41; rain 8:00 #6e7a8b/#a9b2be; rain 12:00 #6e7a8b/#a9b2be; rain 18:00 #6e7a8b/#a9b2be; rain 23:00 #181b28/#2b2f42; snow 8:00 #aab4c1/#e4e9ef; snow 12:00 #aab4c1/#e4e9ef; snow 18:00 #aab4c1/#e4e9ef; snow 23:00 #181a28/#2a2f41; sunny 12:00 #4fb4ff sun True; a sunny-to-rain change (day 27847, block 0), minutes into the fading hour: +3 min rain False sky #26194a, +12 min rain False sky #1e1a38, +21 min rain True sky #181a28, +30 min rain True sky #181b28, +39 min rain True sky #181b28, +48 min rain True sky #181b28, +57 min rain True sky #181b28 (14 s)
PASS | N17 Updates: a newer file appears while playing -> the game saves and reloads by itself at the next calm moment, never inside a job, scene, class, show, bus ride, shoot, dance round or typing; never twice for one version; an older-version player shows "⏳ older version" | a newer file found while the phone was open: update started False (toast ''); during a scene: started False; calm: note '✨ Updating Cozy Town… your game is' then reload after 1800 ms; the page now runs version 2026101802 (title True, says '✨ Cozy Town is updated!'); the save made first has coins 777; tried this session: 1; a version already tried this session: found True, reloaded False, the button shows instead True; an old-version friend: seen True, marked old True, name tag '⭐ ZZTEST-OLDV · ⏳ older version', in the friends list True; the old version still sees the new player: {'found': True, 'av': True} (34 s)
PASS | N18 Same for everyone: an iPad-size player and a PC-size player see the same time, weather, every house's floors and colour, every furniture piece (x, z, turn, floor) on visits, gardens, holiday pieces, ghosts, trash, grandmas; on every house's stairs no wall or window crosses the view | iPad and PC: time 14:20 / 14:20, Sunday / Sunday, weather cloudy / cloudy, holiday halloween with 101 / 101 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, garden) same True, grandmas same True; B visits A (ok/ok/ok, let in True): in visit, room 12x10 (host 12x10), floors 2 (host 2), 33 of 33 pieces at the same x, z, turn and floor: True; stairs: 6 looks in A's house and 6 in B's visit, nearest wall or window 99 m (32 s)
PASS | N19 Halloween: October 1 and 31 (day and night) show it, 1 Nov doesn't; costumes on sale only in October, wearable, seen by others, kept after; the spooky path at the Flower Corner at least 20% longer than the park's was, at least 5 scare kinds, each turns you to face it with a small shake and a soft sound only with sound on; ghosts all over town, none inside; every holiday piece touches the ground or a support (gap under 2 cm) | oct1-day: halloween (101 pieces, path open False); oct1-night: halloween (101 pieces, path open True); oct31-day: halloween (101 pieces, path open False); oct31-night: halloween (101 pieces, path open True); nov1: None (0 pieces, path open False); sep30: None (0 pieces, path open False); October shop: costumes for sale ['co_cat', 'co_dog', 'co_ghost', 'co_dino']; bought the cat costume for 160 🪙 (True); worn: look.co 'cat', 6 extra body parts over the clothes; mirror: costume row True ['None', '🐈 Cat costume'], tap on the worn costume takes it off (None), tap again puts it on ('cat'); 5 Nov: still for sale [], the bought one still in the wardrobe True, still worn 'cat'; the path: 20.84 m (the park's was 13.6 m), inside the Flower Corner True, 6 spots with 5 kinds ['ghost', 'skel', 'zombie', 'bats', 'pumpkin']; scares: ghost: popped True, stopped True, shake True, faced it (off by 0.01 rad), 2 sounds, again False, skel: popped True, stopped True, shake True, faced it (off by 0.01 rad), 0 sounds, again False, zombie: popped True, stopped True, shake True, faced it (off by 0.01 rad), 1 sounds, again False, bats: popped True, stopped True, shake True, faced it (off by 0.01 rad), 6 sounds, again False, pumpkin: popped True, stopped True, shake True, faced it (off by 0.01 rad), 2 sounds, again False, ghost: popped True, stopped True, shake True, faced it (off by 0.01 rad), 2 sounds, again False; ghosts: 56 all over town (40 over the streets, 8 in the park, 4 on Friends Lane, 4 at the Flower Corner), inside a building: 0; halloween: 45 pieces written down (12 hanging), floating or sunk: 0; christmas: 33 pieces written down (21 hanging), floating or sunk: 0; easter: 30 pieces written down (3 hanging), floating or sunk: 0; an old version reading a costume in presence: co None (the clothes stay #ffd45c) (30 s)
PASS | N20 Holiday spot: February heart fountain and petals; in the Easter month the bunny and 25 eggs (all 25 -> bunny costume and 50 coins, once a year); December Christmas tree and Santa (10 coins on 1 Dec, 300 on 31 Dec, once per real day); other months the flower garden as before | 14 Feb: valentine, gate open True, pieces {'heart fountain': 1, 'heart': 4, 'garland': 2}, petals True; walking at the heart fountain stops 1.6 m from its middle; 10 Mar 2027: easter, bunny True, 25 hunt eggs (25 drawn, 25 to pick up), decorative eggs 23; a PC-size player two weeks later finds the 25 eggs at the same spots: True; in April 2026 (Easter 5 Apr) 11 of the spots differ; hunt: bunny first: '🐰 “Happy Easter! I hid 25 eggs all around town. Find them al'; egg 1 picked: 1 found (24 drawn), picked again: 1; all: 25 found, 0 drawn, 0 left to pick, coins from eggs 0; the bunny: costume True, +50 coins, done 2027; asked again: 50 coins in all; the costume draws (63 parts); in the shop as yours: True; next Easter (April 2028): a fresh hunt 0 of 25 found, the prize year still 2027; 1 Dec: xmas, tree at [[-19.6, -12.6]] (in the park: 0), presents 10, Santa True, gate open True; Santa's coins: 1 Dec 10, again that day 0, 16 Dec 155, 31 Dec 300; 10 May: holiday None, 0 pieces, gate open False; month edges: all right (42 s)
PASS | N21 New Year: fireworks every game night 28 to 31 Dec; party hats on everyone and confetti on 31 Dec and 1 Jan; nothing on 2 Jan | fireworks [want, drawn, bursts in 4.5 s]: 27 Dec night: False False 0, 28 Dec night: True True 2, 28 Dec day: False False 0, 31 Dec night: True True 3, 1 Jan night: False False 0; party [hats on / hats, own hats hidden / own, confetti]: 30 Dec: 0/81 0/12 False, 31 Dec: 81/81 12/12 True, 1 Jan: 81/81 12/12 True, 2 Jan: 0/81 0/12 False; my own look gets a party hat True; a friend with a cap: cap shown False, party hat shown True; indoors: confetti False (fade 0) (13 s)
PASS | N22 School: on 1 Sep balloons around and in the school; a teacher gives the globe once; nothing on 2 Sep | 1 Sep: party True, 10 balloon bunches (6 outside by the school: 6 within its front; in the hall True); the teacher: globes in My stuff 0 -> 1 after talking, 1 after talking again (year 2026); '👩‍🏫 “Happy first day of school! 🎈 Here is a little globe for your d'; the globe builds with 13 parts, in the shop False; 2 Sep: party False, balloons left False, a globe from the teacher 0; 1 Sep 2027: party True, a new globe 1 (year 2027) (13 s)
PASS | N23 Signs: every sign's text centered (within 3% of the sign) and inside its box with a margin, with and without a colour emoji font; the four named signs clean; no post, roof, light or spike crosses any sign's text | 71 signs in 16 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castles': off centre 0.2%, inside True, nothing crosses it True, nothing coplanar True; '🏆 Pet Show': off centre 0.1%, inside True, nothing crosses it True, nothing coplanar True; 'Open after 18:00 🌙': off centre 0.0%, inside True, nothing crosses it True, nothing coplanar True; '🍔 Food truck': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; measureText bent wider: 6 signs, worst off centre 0.6%, all inside True; measureText bent narrower: 6 signs, worst off centre 0.6%, all inside True (14 s)
PASS | N24 Grandmas: exactly 3; none by the town houses; they sit on the duck-pond bench feeding the ducks at times, walk to places and talk about them; the same places for two players | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the same clock moment: the biggest difference in a grandma's place 0.04 m (the same turn and stop on both: True); clocks 1 s apart: 1.15 m (1 s of walking is 1.15 m); turn 545: at 76 s two sit 2, seats [0, 1, 0], the pond bench taken [True, True]; 8 s later: ducks fed 2, bubbles [False, False, False]; turn 546, grandma 2: a 56.8 m walk; 11.5 m along her path between 6 s and 16 s (11.5 m expected; 11.5 m as the crow flies), at 72 s standing at beach (arrived True); a speech bubble about the place, standing next to her: True; Say hi 4 times: 3 different lines, never the same twice in a row: True (18 s)
PASS | N25 Photographer: one booking plays from the message to the pay on iPad, sideways iPhone and PC; a perfect photo gets 5 stars; a photo with someone cut off gets fewer | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: wedding at Flower Corner with hedge behind, for ['s2', 'n1']; message '📸 New booking: Max', the note '📸 New booking!', job box '📸 → Flower Corner · 1 m 💒 wedding photo · 0/4', map target {'x': -17, 'z': -3.6}; all 4 places and their backgrounds on walkable ground: True; at the spot the button says {'icon': '📸', 'label': 'Set up the photo'}; set up: 2 in the group (wanted 2), shoot on True, bar True, frame True, background hedge; bar: 5 buttons, smallest 46 px, overlaps [], run/jump buttons hidden True; next to s2: the button says {'label': 'Pose: Max', 'icon': '🧍'}; the pose card: 6 poses, tapped Wave -> wave (tap ok); the 🧍 card (2 rows) -> poses ['peace', 'smile']; backgrounds: 2 to pick from, the button cycled ['hedge', 'gate'], the group stood at ['-22.0,-5.9', '-17.4,-6.1']; framed from 3.6 m: {'st': 5, 'cut': 0, 'back': 0, 'unposed': 0, 'fill': 1, 'bgOk': True, 'w': 0.39, 'h': 0.69}; zoom: fov 70 -> 57.4 (zoom 0.82) -> 70; snap: 5 stars, +120 coins, picture saved True (21407 chars), the thank-you message '📸 From Max' with the photo True, card with the photo True and Bye True; the photo shows in the phone chat: True; after Bye: shoot off True, group gone True, bar hidden True, done 1; second booking (birthday at Cozy Park), turned so 1 of 3 is cut off: 3 stars, +60 coins, the message says 'Thank you! Nice photo! 😊 (Next time: someone was cut off.)'; after 4 photos no new booking True, the box says '🌟 All 4 photos done today!'; quitting the job clears the shoot True || [iphone-landscape] booking: family at Cozy Town School with school behind, for ['nb', 's1', 's2']; message '📸 New booking: Ben', the note '📸 New booking!', job box '📸 → Cozy Town School · 49 m 👨‍👩‍👧 family photo · 0/4', map target {'x': -25, 'z': -53.2}; all 4 places and their backgrounds on walkable ground: True; at the spot the button says {'icon': '📸', 'label': 'Set up the photo'}; set up: 3 in the group (wanted 3), shoot on True, bar True, frame True, background school; bar: 5 buttons, smallest 46 px, overlaps [], run/jump buttons hidden True; next to nb: the button says {'label': 'Pose: Ben', 'icon': '🧍'}; the pose card: 6 poses, tapped Wave -> wave (tap ok); the 🧍 card (3 rows) -> poses ['peace', 'smile', 'jump']; backgrounds: 2 to pick from, the button cycled ['school', 'flag'], the group stood at ['-25.9,-56.6', '-31.8,-56.1']; framed from 3.6 m: {'st': 5, 'cut': 0, 'back': 0, 'unposed': 0, 'fill': 1, 'bgOk': True, 'w': 0.42, 'h': 0.69}; zoom: fov 70 -> 57.4 (zoom 0.82) -> 70; snap: 5 stars, +120 coins, picture saved True (12023 chars), the thank-you message '📸 From Ben' with the photo True, card with the photo True and Bye True; the photo shows in the phone chat: True; after Bye: shoot off True, group gone True, bar hidden True, done 1; second booking (birthday at Cozy Park), turned so 1 of 3 is cut off: 3 stars, +60 coins, the message says 'Thank you! Nice photo! 😊 (Next time: someone was cut off.)'; after 4 photos no new booking True, the box says '🌟 All 4 photos done today!'; quitting the job clears the shoot True || [pc-1366] booking: birthday at Duck Pond with pond behind, for ['s2', 'n1', 'n3']; message '📸 New booking: Max', the note '📸 New booking!', job box '📸 → Duck Pond · 58 m 🎂 birthday photo · 0/4', map target {'x': 34.6, 'z': -31.4}; all 4 places and their backgrounds on walkable ground: True; at the spot the button says {'icon': '📸', 'label': 'Set up the photo'}; set up: 3 in the group (wanted 3), shoot on True, bar True, frame True, background pond; bar: 5 buttons, smallest 46 px, overlaps [], run/jump buttons hidden True; next to s2: the button says {'label': 'Pose: Max', 'icon': '🧍'}; the pose card: 6 poses, tapped Wave -> wave (tap ok); the 🧍 card (3 rows) -> poses ['peace', 'smile', 'jump']; backgrounds: 2 to pick from, the button cycled ['pond', 'bench'], the group stood at ['35.4,-33.3', '33.5,-37.9']; framed from 3.6 m: {'st': 5, 'cut': 0, 'back': 0, 'unposed': 0, 'fill': 1, 'bgOk': True, 'w': 0.51, 'h': 0.69}; zoom: fov 70 -> 57.4 (zoom 0.82) -> 70; snap: 5 stars, +120 coins, picture saved True (18243 chars), the thank-you message '📸 From Max' with the photo True, card with the photo True and Bye True; the photo shows in the phone chat: True; after Bye: shoot off True, group gone True, bar hidden True, done 1; second booking (wedding at Cozy Park), turned so 1 of 2 is cut off: 3 stars, +60 coins, the message says 'Thank you! Nice photo! 😊 (Next time: someone was cut off.)'; after 4 photos no new booking True, the box says '🌟 All 4 photos done today!'; quitting the job clears the shoot True (43 s)
PASS | N26 Map: the corner map and 📱 Map draw the town (never one flat colour) on every screen size; the facing arrow turns every frame you turn; the corner map shows wherever it should | ipad-landscape: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 28), (1, True, 25), (1, True, 23), (1, True, 24)]; ipad-landscape: with the teacher, hair, delivery and designer jobs the box shows text and a drawn map; ipad-landscape: corner map hidden indoors True, back in town True; ipad-landscape: 📱 Map 806x704 css px, 202 colours, zoom 8.28; iphone-portrait: no job: corner map shown True, job text hidden True, 164 colours on 124 px, label 'Your map. Tap to open the big map'; iphone-portrait: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 10), (1, True, 11), (1, True, 12), (1, True, 14), (1, True, 14)]; iphone-portrait: with the teacher, hair, delivery and designer jobs the box shows text and a drawn map; iphone-portrait: corner map hidden indoors True, back in town True; iphone-portrait: 📱 Map 326x728 css px, 333 colours, zoom 3.84; iphone-landscape: no job: corner map shown True, job text hidden True, 161 colours on 120 px, label 'Your map. Tap to open the big map'; iphone-landscape: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 12), (1, True, 9), (1, True, 12), (1, True, 17), (1, True, 12)]; iphone-landscape: with the teacher, hair, delivery and designer jobs the box shows text and a drawn map; iphone-landscape: corner map hidden indoors True, back in town True; iphone-landscape: 📱 Map 784x280 css px, 297 colours, zoom 3.29; pc-1366: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; pc-1366: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 28), (1, True, 25), (1, True, 23), (1, True, 24)]; pc-1366: with the teacher, hair, delivery and designer jobs the box shows text and a drawn map; pc-1366: corner map hidden indoors True, back in town True; pc-1366: 📱 Map 992x652 css px, 198 colours, zoom 7.67; android-tablet-portrait: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; android-tablet-portrait: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 28), (1, True, 25), (1, True, 23), (1, True, 24)]; android-tablet-portrait: with the teacher, hair, delivery and designer jobs the box shows text and a drawn map; android-tablet-portrait: corner map hidden indoors True, back in town True; android-tablet-portrait: 📱 Map 736x1164 css px, 211 colours, zoom 8.66 (57 s)
PASS | N27 Trash: only cans, paper, peels and cups; picking up still works | 10 pieces of trash out of 28 spots today, kinds {'peel': 3, 'paper': 2, 'can': 3, 'cup': 2}; picking one up: True (+3 coins, remembered); over 8 days the trash kinds are ['can', 'cup', 'paper', 'peel'] (12 s)
PASS | N28 Pet shop: two floors; each kind in its own area upstairs, no kind in another's area; clothes and snacks on shelves downstairs; adopting and buying still work | 2 floors; 7 areas upstairs for ['bunny', 'capybara', 'cat', 'dog', 'duck', 'hamster', 'owl']; 14 animals; 60 s of wandering: 0 of 16800 animal-frames outside their own area; who lives where: [['dog', 'pug', 'pomchi', 'sausage'], ['cat', 'cat'], ['bunny', 'bunny'], ['capybara'], ['duck', 'duck'], ['owl'], ['hamster', 'hamster']]; downstairs: 3 shelf units along the back wall (snacks, toys, clothes), spots ['Upstairs to the animals', 'Downstairs to the shop', 'Go outside', 'Buy pet food, toys & clothes', 'Pet clothes']; buying a treat: +1 for 5 coins, the shop lists pet clothes True; stairs: up to floor 2 (z 40), down to floor 1; adopting a pug upstairs: card opens True, pets +1 (pug) (14 s)
PASS | N29 Pond: no bridge; nobody can walk on the water | walking at the pond from four sides stops 2.5 m from its middle (the water's edge is 1.45 m); hand-rail tubes left: 0; ducks 2, Feed-the-ducks spots 3, walk strips through water 0, height over the pond 0 (12 s)
PASS | N30 Sky: clouds soft (no outlines, no hard dark faces) by day and night; no orange specks above the trees; any leaves are leaf-shaped and near trees | clouds: 16 in the sky + 6 at the beach, 22 meshes, 0 not the cloud material, 0 outline hulls; by day top #ffffff bottom #dde4f0; day sky picture: 0.0% dark pixels in the sky band clear of the buttons (limit 0.3%); grey weather: top #d3d9e4 bottom #a9b2c2; night: top #9aa1c8 bottom #5d6489; leaves in the park: visible True, 90 of 90 dealt to 12 trees (223 round trees in town), highest start 3.05 m, farthest tree 19.2 m, not a tree: 0, leaf shape True, season autumn; beach: leaves visible False (trees near: 0); winter: leaves visible False (12 s)
PASS | N31 Trees: no tree crown inside any building; no white smear on any wall | 223 round trees and 57 pines against 25 buildings' walls: 0 crowns inside a wall; the closest crown {'gap': 0.21, 'tree': [34.9, -30.2, 'tree'], 'building': '23,-31'}; wall at 12: steps>6 0.72% (limit 1.5), mean step 0.227 (limit .45; the streaked wall had 4.5% and .92), lum 206; wall at 11.5: steps>6 0.72% (limit 1.5), mean step 0.214 (limit .45; the streaked wall had 4.5% and .92), lum 206; wall at 12.5: steps>6 0.7% (limit 1.5), mean step 0.382 (limit .45; the streaked wall had 4.5% and .92), lum 118; wall at 9: steps>6 0.88% (limit 1.5), mean step 0.267 (limit .45; the streaked wall had 4.5% and .92), lum 231; wall at 15: steps>6 0.5% (limit 1.5), mean step 0.065 (limit .45; the streaked wall had 4.5% and .92), lum 115; wall at 17.5: steps>6 0.5% (limit 1.5), mean step 0.056 (limit .45; the streaked wall had 4.5% and .92), lum 100 (18 s)
PASS | N32 Food trucks: no flicker (no two surfaces closer than 1 cm facing the same way); the sign and the burger picture clean | the truck at (-34.2, 11.8): 842 triangles in 152 facing directions, 466 close same-facing pairs looked at, 0 overlapping within 1 cm; food trucks in the game (by their sign): 1; the sign: off centre 0.3%, crossed [], coplanar 0; the burger picture on the sign (left 35%): 6462 coloured pixels besides the red board, 1688 white; (the live truck had 34 such pairs) (19 s)
PASS | N33 Levels and garden: every skill reaches 50 and stops there; +6 seed spots at gardening 10/20/30/40/50; another player sees your plants | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before); level-up coins paid [500, 500, 500]…; yard spots 36 (30 pots), garden save slots 36; a spot's gardening level [beds, pots…] [1, 1, 10, 10, 20, 20, 30, 30, 40, 40, 50, 50]; spots open at level 1/9/10/19/20/49/50: [2, 2, 4, 4, 6, 10, 12] of 12 sampled; planting in pot 7 at level 10: carrot (panel True); a level-50 pot says '🔒 Gardening level 50'; presence gd '0,carrot,3;1,tomato,0;3,carrot,3;6,carrot,0'; a PC-size friend builds that lot: 23176 vertices without the garden, 30328 with it (the pot's carrot shows); the lane list carries the garden True (26 s)
PASS | N34 House floors and colour: 2 floors at decorating 10 up to 6 at 50; the stairs work up and down on every floor; the outside shows the floors and the chosen colour, also for others; old saves keep every piece | an old big-house save: 2 floors, 33 pieces kept (16 upstairs, drawn 40 m along: [40]), 33 placed; buying floors [had, after a try one level short, after the level, coins left, floors built]: [[2, 2, 3, 0, 3], [3, 3, 4, 0, 4], [4, 4, 5, 0, 5], [5, 5, 6, 0, 6]]; at 6 floors: ['at 6', 6, 2500]; pieces still 33; up: floors [2, 3, 4, 5, 6] at z [40, 80, 120, 160, 200] (one floor drawn at a time True); down: floors [5, 4, 3, 2, 1]; a chair placed on floor 4 stands at z 121.5 (hidden from floor 1 True, shown on floor 4 True); outside: my name sign hangs at 23.7 m (6 floors: 23.7), presence floors 6 colour #bfe6ff, home presence n 6 with floors ['u', 'u2', 'u3', 'u4', 'u5'] (the chair rides in u3: True); a PC-size friend: the lane list gives Zed 4 floors in #bfe6ff; Zed's sign at 17.3 m (4 floors: 17.3) and 7.9 m with 1 floor (7.9); visiting a 6-floor host: 6 floors, pieces at z [1, 41, 81, 201]; in the visit: up to floor 2 then 3; an old upstairs save: 7 pieces kept (3 upstairs), 7 placed, you start inside the house True with 2 floors (43 s)
PASS | N35 Notepad switch: off hides it, on brings it back with the notes kept | default: switch on True, notepad shown True; Settings has the switch: {'text': '✏️ On', 'w': 92.6875, 'h': 52}; after Off: shown False, switch 'Off', saved False, notes kept True; after On: shown True, notes kept True; with the designer card the notepad steps aside True and comes back True (14 s)
PASS | N36 Furniture: at least 60 new pieces across every kind, each buyable, placeable, saved and seen by a visitor | 72 new pieces (r4), 54 with several colours; builds, fits its footprint, buyable and priced: 72 of 72; kinds covered: 13 of 13; in the shop's list 72, thumbnails drawn 6/6, in the designer's pool 72; placed in the house one by one: 72 (failed []); bought a loveseat from the catalog for 190 coins (placing False); 5 pieces saved and read back 5/5, in the home presence 5/5; a visitor builds the host's room: 38 pieces, parts [12, 9, 15, 6, 16, 5, 6, 3] (22 s)
PASS | N37 Tree park: each of the three paths can be finished; zip lines work; signs readable; free; a fall puts you back on the last platform; on every device | [ipad-landscape] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; signs readable (ink inside, centred within 3%): 6 of 6; easy (7 decks): jump 0->1 gap 1 m dh 0, bridge 1->2, jump 2->3 gap 0.96 m dh 0, jump 3->4 gap 1.27 m dh 0.2, jump 4->5 gap 1 m dh 0, zip 5->6 2.3 s over 12.2 m; the bell: Ring the bell! -> finished True (+20 coins); medium (10 decks): jump 0->1 gap 1.4 m dh 0, jump 1->2 gap 1.05 m dh 0.3, jump 2->3 gap 1.8 m dh 0, bridge 3->4, jump 4->5 gap 1.6 m dh 0.3, jump 5->6 gap 1.45 m dh 0, jump 6->7 gap 1.6 m dh 0, zip 7->8 2.6 s over 13.8 m, jump 8->9 gap 1.4 m dh 0; the bell: Ring the bell! -> finished True (+30 coins); hard (11 decks): jump 0->1 gap 1.8 m dh 0, jump 1->2 gap 1.27 m dh 0.4, jump 2->3 gap 2 m dh 0, bridge 3->4, jump 4->5 gap 2.2 m dh 0.2, jump 5->6 gap 1.84 m dh 0, jump 6->7 gap 2.2 m dh 0.2, jump 7->8 gap 2.2 m dh 0.2, zip 8->9 3 s over 16.2 m, jump 9->10 gap 2 m dh 0; the bell: Ring the bell! -> finished True (+40 coins); the ⬆️ button makes you jump: True; a fall from deck 3: reached the ground True (lowest 0 m), picked up True, back on the deck True, falls counted 1, tummy still 89 (no harm); out through the gate (Back to town) -> {'cur': 'city', 'x': 71.6, 'z': -38}; weight: the park {'meshes': 35, 'tris': 39016} vs the beach {'meshes': 119, 'tris': 58233} || [iphone-portrait] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; signs readable (ink inside, centred within 3%): 6 of 6; easy (7 decks): jump 0->1 gap 1 m dh 0, bridge 1->2, jump 2->3 gap 0.96 m dh 0, jump 3->4 gap 1.27 m dh 0.2, jump 4->5 gap 1 m dh 0, zip 5->6 2.3 s over 12.2 m; the bell: Ring the bell! -> finished True (+20 coins); the ⬆️ button makes you jump: True; a fall from deck 3: reached the ground True (lowest 0 m), picked up True, back on the deck True, falls counted 1, tummy still 91 (no harm); out through the gate (Back to town) -> {'cur': 'city', 'x': 71.6, 'z': -38}; weight: the park {'meshes': 35, 'tris': 39016} vs the beach {'meshes': 119, 'tris': 58233} || [iphone-landscape] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; signs readable (ink inside, centred within 3%): 6 of 6; easy (7 decks): jump 0->1 gap 1 m dh 0, bridge 1->2, jump 2->3 gap 0.96 m dh 0, jump 3->4 gap 1.27 m dh 0.2, jump 4->5 gap 1 m dh 0, zip 5->6 2.3 s over 12.2 m; the bell: Ring the bell! -> finished True (+20 coins); the ⬆️ button makes you jump: True; a fall from deck 3: reached the ground True (lowest 0 m), picked up True, back on the deck True, falls counted 1, tummy still 91 (no harm); out through the gate (Back to town) -> {'cur': 'city', 'x': 71.6, 'z': -38}; weight: the park {'meshes': 35, 'tris': 39016} vs the beach {'meshes': 119, 'tris': 58233} || [pc-1366] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; signs readable (ink inside, centred within 3%): 6 of 6; easy (7 decks): jump 0->1 gap 1 m dh 0, bridge 1->2, jump 2->3 gap 0.96 m dh 0, jump 3->4 gap 1.27 m dh 0.2, jump 4->5 gap 1 m dh 0, zip 5->6 2.3 s over 12.2 m; the bell: Ring the bell! -> finished True (+20 coins); the Space key makes you jump: True; a fall from deck 3: reached the ground True (lowest 0 m), picked up True, back on the deck True, falls counted 1, tummy still 91 (no harm); out through the gate (Back to town) -> {'cur': 'city', 'x': 71.6, 'z': -38}; weight: the park {'meshes': 35, 'tris': 39016} vs the beach {'meshes': 119, 'tris': 58233} (56 s)
PASS | N38 Tutorials: the hairstylist and pizza jobs show a picture tutorial the first time and from "?" | delivery: shows by itself 5 steps: 'Pizza delivery 🍕' picture True 5 words, 'Follow the dot 🗺️' picture True 9 words, 'Ring the bell 🚪' picture True 6 words, 'Be quick! ⚡' picture True 5 words, 'Let's go! 🛵' picture True 7 words; after the last step: gone True, remembered True; second time by itself: False; the job card has a ❓: True; ❓ brings it back: True || hair: shows by itself 4 steps: 'Hairstylist ✂️' picture True 6 words, 'The wish picture 🖼️' picture True 6 words, 'Cut, comb, dye' picture True 3 words, 'Done! ⭐' picture True 5 words; after the last step: gone True, remembered True; second time by itself: False; the job card has a ❓: True; ❓ brings it back: True (27 s)
PASS | N39 Parties: host at the mailbox and pick a time; every online test player gets the note with the host's name and can accept or decline; with a disco floor and ball the dance game runs for two; hits make dance moves; the score bar slides smoothly (never jumps), even = middle with both faces; an old version doesn't crash | three players online together: True (A sees ['ZZTEST-GUESTB', 'ZZTEST-OLDC']); A at the mailbox: button 'Mailbox: mail or a party', menu mail True / party True, times offered ['☀️Today13:00', '☀️Today14:00', '☀️Today15:00', '☀️Today16:00'], picked -> party {'h': 13, 'future': True}; B gets the news: True; the note '🎉 Party!: ZZTEST-HOSTA is hosting a party today at 13:00! Go check it out.', the card True with [["✅ I'll come!", 127, 48], ['🙅 Not this time', 159, 48]]; B says yes: {'rsvp': 'yes', 'card': False}; A hears it: True; at party time B gets the way: True, way-finder ['party', "ZZTEST-HOSTA's party", [-97, 9.4]] = A's lane door [-97, 9.4, 0]: True; note 'ZZTEST-HOSTA's party is starting! Follow the arrow to their '; B knocks, A's door opens by itself: B inside True, A sees the guest True; A's disco floor lights up: {'lit': True, 'tiles': 36, 'ball': True}; B sees the floor and ball in A's house: True; A on the floor: the button ['🕺', 'Dance!', 1]; B gets the dance card: True '🕺 Dance-off!ZZTEST-HOSTA wants to dance with you!Arrows fall down: pre' [["💃 Let's dance!", 150, 48], ['🙅 Not now', 123, 48]]; the dance-off starts for both: True; A: countdown -3.4 s, view dance, on the left 1, 20 arrows, 2 faces ['ZZTEST-HOSTA', 'ZZTEST-GUEST'], bar 0.5 (even = middle), buttons [[66, 66], [66, 66], [66, 66], [66, 66]]; the round: A hit 20 (3 with the big buttons), B hit 20 (3 with the arrow keys); A's dancer moved on hits True; A saw B's dancer move True; the score bar on A over 548 frames: biggest step 0.025 (smooth), from 0.5 to 0.504 (range 0.5..0.575); the end: A's card True 'You 300 · ZZTEST-GUESTB 300' / '🤝 A tie! Great moves, both of you!You go', B's card True; view back True; the old version C all along: before {'peers': 2, 'seesA': True, 'cur': 'city'}, after {'peers': 2, 'seesA': True, 'cur': 'city', 'playing': True}, page errors [] (41 s)
PASS | N40 Smooth and light: E1 within the run-4 limits (town 15%/25% with Halloween, rain and ghosts on; pet shop up to double; home within 10% with 6 floors; the tree park within the beach's size; others 10%); index.html under 1.8 MB | index.html 1.56 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 27 areas, 1568 pieces, 1227888 triangles; town 522 -> 594 pieces, 770726 -> 795386 triangles; limits city:0.15:0.25,pets:1.0:1.0 (21 s)
PASS | N41 Bus: with the one clock the bus still comes 3 days a week and the pill shows the next bus with its weekday | bus days per week (6 weeks): [3, 3, 3, 3, 3, 3]; the two devices agree on every bus day and hour: True; 10 mornings at the park stop: 4 bus days, 6 without; a morning without a bus says e.g. 🚌 Next bus: Tue 10:20; a bus day says e.g. 🚌 Next bus: 10:20 (21 s)
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
FAIL | C2 every spot and button does something (iPad, finger taps) | 807 taps tested in 24 areas, 395 screens; UNREACHABLE (1): city "Tap: pass · Hold: shoot!": unreachable
FAIL | C2b every area is reached by playing | 24 of 25 areas; NOT REACHED: ['beach']
PASS | C3 walking works (ipad-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | T1 teacher job plays from the school message to the end of class (ipad-landscape) | 3 classes: Math ended, English ended, Math ended
PASS | T2 every goofing kid can be stopped, left and right (ipad-landscape) | left side 7 of 7 taps worked, right side 27 of 27
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (ipad-landscape) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (ipad-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (iphone-landscape) | 3 classes: Math ended, History ended, English ended
PASS | T2 every goofing kid can be stopped, left and right (iphone-landscape) | left side 6 of 6 taps worked, right side 29 of 29
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (iphone-landscape) | 14 papers; button size 52x44 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (iphone-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (pc-1920) | 3 classes: English ended, History ended, English ended
PASS | T2 every goofing kid can be stopped, left and right (pc-1920) | left side 11 of 11 taps worked, right side 23 of 23
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (pc-1920) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (pc-1920) | 51 questions read
PASS | C3 walking works (pc-1920) | W key: moved 6.4 m in 1.5 s
PASS | C1 every screen opens (iphone-portrait, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (iphone-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (iphone-landscape, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (iphone-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-phone-portrait, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (android-phone-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-phone-landscape, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (android-phone-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-tablet-portrait, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (android-tablet-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-tablet-landscape, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (android-tablet-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (pc-1366, light and dark) | 35 of 35 screens, each in light and dark
PASS | C3 walking works (pc-1366) | W key: moved 6.4 m in 1.5 s
PASS | C4 nothing is cut off the screen | 0 problems
PASS | C4 no buttons overlap | 0 problems
PASS | C4 all text fits its box | 0 problems
PASS | C4 every button is at least 44 px for a finger | 0 problems
PASS | C4 text is readable in light and dark | 0 problems
FAIL | C5 the same kind of button looks the same everywhere | 37 kinds of button; MIXED: {"btn.white": [["\"Baloo 2\" 800", "18px", "3px"], ["\"Baloo 2\" 800", "20px", "3px"]]}
PASS | C6 zero errors in the browser log | 0 errors
PASS | C8 test copies never reached the real internet | 0 outside requests stopped
NOT RUN | C1-WK every screen in Safari's engine (iPhone, iPad) | NOT RUN: Safari's engine is not installed on this computer
PASS | F6 every test action is logged and undone | 149 test actions, 149 undone
PASS | F2a the tests used exactly the files to publish | files tested: ['3f62f509fc70d0a1d9090497137e3aaf', '4ce4fa450e264fc90f32554c38bb3c90', '4d7d7db88aab90e4eba73d375be1797b', '4e5711ced0fce10f70fa11307b0d848d', '709bf763d51be0160c118e2f9249f9f6', '81a23aec3f710244193e712e7453791f', '97e1cfaf506c7e8d1f29a125a9a78199', 'c854d990680c40817526e4749cdb0a7c', 'cd945e55878475d74a6c1b24656386ae', 'd8692134020cb07c6adb01e82fe47205', 'fe3548fc271f65415b51ca6bce3b73fb']; to publish: ['97e1cfaf506c7e8d1f29a125a9a78199', 'c854d990680c40817526e4749cdb0a7c']
NOT RUN | F2 published Claude version = tested file | NOT RUN: not published yet
NOT RUN | F3 GitHub file after upload = new Claude version + same web part, same address | NOT RUN: not uploaded yet
NOT VERIFIED | G real devices, sound, smoothness, two real players online | NOT VERIFIED: in the "Try it for real" notebook until ticked
RESULT: 4 FAIL, 4 not run or not verified · 62 min of testing
exit 0
```

### Stage 2 end: rerun, B1, N18, N25 after the garden list and fountain-spot fixes
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s2fix2/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s2fix2/new/claude-new.html: removed 55 online-part lines; md5 73b7e3a85be30c1997074a253b5748d7
[stage saves: running]
[stage saves: done in 386 s]
    PASS | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none);
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage run4: running]
    PASS | N18 | iPad and PC: time 14:18 / 14:18, Wednesday / Wednesday, weather cloudy / cloudy, holiday halloween with 101 / 101 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, garden) same True, grandmas same True; B visits A (ok/ok/ok, let in True): in visit, room 12x10 (ho
    PASS | N25 | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: wedding at Flower Corner with hedge behind, for ['nb', 's2']; message '📸 New booking: Ben', the note '📸 New booking!', job box '📸 → Flowe
    FAIL | N33 | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before); level-up coins paid [500, 500, 500]…; yard spots 36 (30 pots), garden save slots 6; a spot's gard
[stage run4: done in 85 s]
    PASS | N18 Same for everyone: an iPad-size player and a PC-size player see the same time, weather, every house's floors and colour, every furniture piece (x, z, turn, floor) on visits, gardens, holiday pieces, ghosts, trash, grandmas; on every house's stairs no wall or window crosses the view | iPad and PC: time 14:18 / 14:18, Wednesday / Wednesday, weather cloudy / cloudy, holiday halloween with 101 / 101 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors,
    PASS | N25 Photographer: one booking plays from the message to the pay on iPad, sideways iPhone and PC; a perfect photo gets 5 stars; a photo with someone cut off gets fewer | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: wedding at Flower Corner with hedge b
    FAIL | N33 Levels and garden: every skill reaches 50 and stops there; +6 seed spots at gardening 10/20/30/40/50; another player sees your plants | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before
[partial run: some stages skipped by --only]
exit 0
```

### Stage 2 end: rerun, the town crawl again (C2)
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s2c2/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s2c2/new/claude-new.html: removed 55 online-part lines; md5 73b7e3a85be30c1997074a253b5748d7
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 166 s]
[partial run: some stages skipped by --only]
exit 0
```

### Stage 2 end: rerun, the HUD crawl and N33 after the button and kit fixes
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s2fix3/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s2fix3/new/claude-new.html: removed 55 online-part lines; md5 8e20c2074fabcbc61cafcc576be60b7c
[stage run4: running]
    PASS | N33 | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before); level-up coins paid [500, 500, 500]…; yard spots 36 (30 pots), garden save slots 6; a spot's gard
[stage run4: done in 17 s]
    PASS | N33 Levels and garden: every skill reaches 50 and stops there; +6 seed spots at gardening 10/20/30/40/50; another player sees your plants | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 347 s]
[partial run: some stages skipped by --only]
exit 0
```

### Stage 2 end: rerun, every crawl stage again after the button fix (C2, C5)
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s2crawl/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s2crawl/new/claude-new.html: removed 55 online-part lines; md5 8e20c2074fabcbc61cafcc576be60b7c
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 345 s]
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 167 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 425 s]
[stage crawl_ipad-landscape_inB: running]
[stage crawl_ipad-landscape_inB: done in 190 s]
[stage crawl_ipad-landscape_inC: running]
[stage crawl_ipad-landscape_inC: done in 65 s]
[stage crawl_ipad-landscape_inD: running]
[stage crawl_ipad-landscape_inD: done in 58 s]
[partial run: some stages skipped by --only]
exit 0

# The kit prints its C summary lines only when every stage runs. The six crawl stages above were run alone (--only), so the
# lines below were computed from this run's stage files (runs/s2crawl/out/stages/*.json) with the kit's own rule, line for line:
PASS | C2 every spot and button does something (iPad, finger taps) | 768 taps tested in 22 areas, 380 screens
PASS | C3 walking works (ipad-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C5 the same kind of button looks the same everywhere | 22 kinds of button
PASS | C6 zero errors in the browser log | 0 errors
PASS | C8 test copies never reached the real internet | 0 outside requests stopped
# (C2b needs the counts and players stages too; the crawl alone reached 22 areas, the beach not among them, as in the full check: section 5b.)
```

### Stage 3 end: the full check (`--full`), stopped by the owner after the save tests; the final block is made from the stages that ran, every other line NOT VERIFIED
```
===== COZY TOWN FINAL CHECK =====
2026-10-18 · check version 6 · update, full sweep for a big update · STOPPED by the owner after the save tests: stages files, counts, saves, players, claude and book ran; every other line NOT VERIFIED
live Claude fd84696cb6775f78d19c823aed4ab0f2 · new Claude 579a34495fac3137076e6f06c6e0d4dc · live GitHub 709bf763d51be0160c118e2f9249f9f6 · new GitHub 8425c145b24b7979a1d39a6ab5ddd824
PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-18, github-live.html read on 2026-10-18
PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-18"
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 880 after; grew: {"areas": "25 -> 26", "places": "22 -> 23", "doors": "23 -> 24", "furniture": "61 -> 134", "furniture_for_sale": "39 -> 111", "hats": "19 -> 20", "clothes": "22 -> 27", "jobs": "4 -> 5", "phone_chats"
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 27 areas, 1397 pieces, 1213912 triangles in total | for information, seen from 5 spots: city 159 draws; home 33 draws; market 38 draws; cafe 53 draws; school 43 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; jumped once to the shared day of the one clock (run 4); a Friends Lane time given (the save had none); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prenight3-bighouse.json: name 'ZZTEST-BIGHOUSE', coins 3100, furniture 33, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prenight3-designer.json: name 'ZZTEST-DESIGNER', coins 400, furniture 0, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prenight3-pets.json: name 'ZZTEST-PETS', coins 900, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prenight3-upstairs.json: name 'ZZTEST-UPSTAIRS', coins 2345, furniture 7, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prerun4-bed.json: name 'ZZTEST-BED', coins 900, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-day1.json: name 'ZZTEST-DAY1', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-day58.json: name 'ZZTEST-DAY58', coins 740, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-lv10.json: name 'ZZTEST-LV10', coins 5200, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-pets2.json: name 'ZZTEST-PETS2', coins 2400, furniture 0, pets 3; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 7 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 7 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 7 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 7 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
NOT VERIFIED | N1-N14 the night-3 lines (stage night3) | NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)
NOT VERIFIED | N15-N41 the run-4 lines (stage run4) | NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)
NOT VERIFIED | C2 every spot and button does something (iPad finger taps; the walk-through) | NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)
NOT VERIFIED | C2b every area is reached by playing (the walk-through) | NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)
NOT VERIFIED | C3 walking works (every device) | NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)
NOT VERIFIED | T1-T4 teacher job on iPad, sideways iPhone and PC | NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)
NOT VERIFIED | K1 PC keyboard | NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)
NOT VERIFIED | C1 every screen opens (the device tests: iPhone upright and sideways, Android phones and tablets, PC 1366, light and dark) | NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)
NOT VERIFIED | C4 nothing cut off, no overlaps, text fits, buttons at least 44 px, readable (from the device tests) | NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)
NOT VERIFIED | C5 the same kind of button looks the same everywhere (from the device tests) | NOT VERIFIED: did not run: the owner stopped the check after the save tests (18 Oct)
PASS | C6 zero errors in the browser log (the stages that ran) | 0 errors
PASS | C8 test copies never reached the real internet (the stages that ran) | 0 outside requests stopped
NOT RUN | C1-WK every screen in Safari's engine (iPhone, iPad) | NOT RUN: Safari's engine is not installed on this computer
PASS | F6 every test action is logged and undone | 43 test actions, 43 undone
PASS | F2a the tests used exactly the files to publish | files tested: ['579a34495fac3137076e6f06c6e0d4dc', '709bf763d51be0160c118e2f9249f9f6', '8425c145b24b7979a1d39a6ab5ddd824']; to publish: ['579a34495fac3137076e6f06c6e0d4dc', '8425c145b24b7979a1d39a6ab5ddd824']
NOT RUN | F2 published Claude version = tested file | NOT RUN: not published yet
NOT RUN | F3 GitHub file after upload = new Claude version + same web part, same address | NOT RUN: not uploaded yet
NOT VERIFIED | G real devices, sound, smoothness, two real players online | NOT VERIFIED: in the "Try it for real" notebook until ticked
RESULT: ALL PASS, 14 not run or not verified · 12 min of testing (stopped early)
```

### Stage 3 end: rerun, the run-4 lines with N3 and N13 on the build before the pass-7 fixes (8fe0d95), while the photographer ran beside it
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s3s/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s3s/new/claude-new.html: removed 55 online-part lines; md5 fafca0d2e71736dbcbbeffff38523313
[stage night3: running]
    PASS | N3 | stop 1: 4 friends, 4 in view in front, 1.35 m apart; 3 pets, closest gap 1.27 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.42 m apart; 3 pets, closest gap 1.25 m; after turning round: 4 of 4 back in view
    PASS | N13 | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat after 1
[stage night3: done in 96 s]
    PASS | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.35 m apart; 3 pets, closest gap 1.27 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.42 m apart; 3 pets, closest gap 1.25
    PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers
[stage run4: running]
    FAIL | N15 | the code writes a day number in 0 places; the day-58 save loaded in 95 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 89 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, skills ke
    PASS | N19 | oct1-day: halloween (102 pieces, path open False); oct1-night: halloween (102 pieces, path open True); oct31-day: halloween (102 pieces, path open False); oct31-night: halloween (102 pieces, path open True); nov1: None (0 pieces, path open False); sep30: None (0 pieces, path open False); October sho
    PASS | N20 | 14 Feb: valentine, gate open True, pieces {'heart fountain': 1, 'heart': 4, 'garland': 2}, petals True; walking at the heart fountain stops 1.6 m from its middle; 10 Mar 2027: easter, bunny True, 25 hunt eggs (25 drawn, 25 to pick up), decorative eggs 23; a PC-size player two weeks later finds the 2
    PASS | N21 | fireworks [want, drawn, bursts in 4.5 s]: 27 Dec night: False False 0, 28 Dec night: True True 4, 28 Dec day: False False 0, 31 Dec night: True True 4, 1 Jan night: False False 0; party [hats on / hats, own hats hidden / own, confetti]: 30 Dec: 0/81 0/12 False, 31 Dec: 81/81 12/12 True, 1 Jan: 81/81
    PASS | N22 | 1 Sep: party True, 13 balloon bunches (8 outside by the school: 8 within its front; in the hall True); the teacher: globes in My stuff 0 -> 1 after talking, 1 after talking again (year 2026); '👩‍🏫 “Happy first day of school! 🎈 Here is a little globe for your d'; the globe builds with 13 parts, in th
    PASS | N23 | 72 signs in 16 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castles': off centre 0.2%, inside True, nothing crosses it True, nothing coplanar True; '🏆 Pet Show': off 
    PASS | N24 | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the same clock moment: the biggest difference in a grandma's place 0.06 m (the same turn and stop on both: True); clocks 1 s apart: 1.16 m (1 s of walkin
    PASS | N25 | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: pets at Cozy Town School with school behind, for ['nb', 'n3'] + bunny; message '📸 New booking: Ben', the note '📸 New booking!', job box '
    PASS | N26 | ipad-landscape: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 2
    PASS | N28 | 2 floors; 7 areas upstairs for ['bunny', 'capybara', 'cat', 'dog', 'duck', 'hamster', 'owl']; 14 animals; 60 s of wandering: 0 of 16800 animal-frames outside their own area; who lives where: [['dog', 'pug', 'pomchi', 'sausage'], ['cat', 'cat'], ['bunny', 'bunny'], ['capybara'], ['duck', 'duck'], ['o
    PASS | N33 | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before); level-up coins paid [500, 500, 500]…; yard spots 36 (30 pots), garden save slots 6; a spot's gard
    PASS | N34 | an old big-house save: 2 floors, 33 pieces kept (16 upstairs, drawn 40 m along: [40]), 33 placed; buying floors [had, after a try one level short, after the level, coins left, floors built]: [[2, 2, 3, 0, 3], [3, 3, 4, 0, 4], [4, 4, 5, 0, 5], [5, 5, 6, 0, 6]]; at 6 floors: ['at 6', 6, 2500]; pieces 
    PASS | N36 | 72 new pieces (r4), 54 with several colours; builds, fits its footprint, buyable and priced: 72 of 72; kinds covered: 13 of 13; in the shop's list 72, thumbnails drawn 6/6, in the designer's pool 72; placed in the house one by one: 72 (failed []); bought a loveseat from the catalog for 190 coins (pl
    PASS | N37 | [ipad-landscape] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; sign
    PASS | N39 | three players online together: True (A sees ['ZZTEST-GUESTB', 'ZZTEST-OLDC']); A at the mailbox: button 'Mailbox: mail or a party', menu mail True / party True, times offered ['☀️Today13:00', '☀️Today14:00', '☀️Today15:00', '☀️Today16:00'], picked -> party {'h': 13, 'future': True}; B gets the news:
    PASS | N40 | index.html 1.57 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 27 areas, 1516 pieces, 1224520 triangles; town 522 -> 549 pieces, 770726 -> 787504 triangles; limits city:0.15:0.25,pets:1.0:1.0
[stage run4: done in 642 s]
    FAIL | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 95 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 89 ms and jumped to the same day: True; after th
    PASS | N19 Halloween: October 1 and 31 (day and night) show it, 1 Nov doesn't; costumes on sale only in October, wearable, seen by others, kept after; the spooky path at the Flower Corner at least 20% longer than the park's was, at least 5 scare kinds, each turns you to face it with a small shake and a soft sound only with sound on; ghosts all over town, none inside; every holiday piece touches the ground or a support (gap under 2 cm) | oct1-day: halloween (102 pieces, path open False); oct1-night: halloween (102 pieces, path open True); oct31-day: halloween (102 pieces, path open False); oct31-night: halloween (102 pieces, path open
    PASS | N20 Holiday spot: February heart fountain and petals; in the Easter month the bunny and 25 eggs (all 25 -> bunny costume and 50 coins, once a year); December Christmas tree and Santa (10 coins on 1 Dec, 300 on 31 Dec, once per real day); other months the flower garden as before | 14 Feb: valentine, gate open True, pieces {'heart fountain': 1, 'heart': 4, 'garland': 2}, petals True; walking at the heart fountain stops 1.6 m from its middle; 10 Mar 2027: easter, bunny True, 25 h
    PASS | N21 New Year: fireworks every game night 28 to 31 Dec; party hats on everyone and confetti on 31 Dec and 1 Jan; nothing on 2 Jan | fireworks [want, drawn, bursts in 4.5 s]: 27 Dec night: False False 0, 28 Dec night: True True 4, 28 Dec day: False False 0, 31 Dec night: True True 4, 1 Jan night: False False 0; party [hats on / hat
    PASS | N22 School: on 1 Sep balloons around and in the school; a teacher gives the globe once; nothing on 2 Sep | 1 Sep: party True, 13 balloon bunches (8 outside by the school: 8 within its front; in the hall True); the teacher: globes in My stuff 0 -> 1 after talking, 1 after talking again (year 2026); '👩‍🏫 “Ha
    PASS | N23 Signs: every sign's text centered (within 3% of the sign) and inside its box with a margin, with and without a colour emoji font; the four named signs clean; no post, roof, light or spike crosses any sign's text | 72 signs in 16 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castle
    PASS | N24 Grandmas: exactly 3; none by the town houses; they sit on the duck-pond bench feeding the ducks at times, walk to places and talk about them; the same places for two players | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the same clock moment: the biggest difference in a gr
    PASS | N25 Photographer: one booking plays from the message to the pay on iPad, sideways iPhone and PC; a perfect photo gets 5 stars; a photo with someone cut off gets fewer | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: pets at Cozy Town School with school 
    PASS | N26 Map: the corner map and 📱 Map draw the town (never one flat colour) on every screen size; the facing arrow turns every frame you turn; the corner map shows wherever it should | ipad-landscape: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that fra
    PASS | N28 Pet shop: two floors; each kind in its own area upstairs, no kind in another's area; clothes and snacks on shelves downstairs; adopting and buying still work | 2 floors; 7 areas upstairs for ['bunny', 'capybara', 'cat', 'dog', 'duck', 'hamster', 'owl']; 14 animals; 60 s of wandering: 0 of 16800 animal-frames outside their own area; who lives where: [['dog', 
    PASS | N33 Levels and garden: every skill reaches 50 and stops there; +6 seed spots at gardening 10/20/30/40/50; another player sees your plants | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before
    PASS | N34 House floors and colour: 2 floors at decorating 10 up to 6 at 50; the stairs work up and down on every floor; the outside shows the floors and the chosen colour, also for others; old saves keep every piece | an old big-house save: 2 floors, 33 pieces kept (16 upstairs, drawn 40 m along: [40]), 33 placed; buying floors [had, after a try one level short, after the level, coins left, floors built]: [[2, 2, 3
    PASS | N36 Furniture: at least 60 new pieces across every kind, each buyable, placeable, saved and seen by a visitor | 72 new pieces (r4), 54 with several colours; builds, fits its footprint, buyable and priced: 72 of 72; kinds covered: 13 of 13; in the shop's list 72, thumbnails drawn 6/6, in the designer's pool 72; 
    PASS | N37 Tree park: each of the three paths can be finished; zip lines work; signs readable; free; a fall puts you back on the last platform; on every device | [ipad-landscape] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium pat
    PASS | N39 Parties: host at the mailbox and pick a time; every online test player gets the note with the host's name and can accept or decline; with a disco floor and ball the dance game runs for two; hits make dance moves; the score bar slides smoothly (never jumps), even = middle with both faces; an old version doesn't crash | three players online together: True (A sees ['ZZTEST-GUESTB', 'ZZTEST-OLDC']); A at the mailbox: button 'Mailbox: mail or a party', menu mail True / party True, times offered ['☀️Today13:00', '☀️Today
    PASS | N40 Smooth and light: E1 within the run-4 limits (town 15%/25% with Halloween, rain and ghosts on; pet shop up to double; home within 10% with 6 floors; the tree park within the beach's size; others 10%); index.html under 1.8 MB | index.html 1.57 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 27 areas, 1516 pieces, 1224520 triangles; town 522 -> 549 pieces, 770726 -> 787504 triangles; limits cit
[partial run: some stages skipped by --only]
```

### Stage 3 end: rerun, N13, N15, N25, N26 and N34 on the build with the pass-7 fixes, on a quiet machine
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s3t/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s3t/new/claude-new.html: removed 55 online-part lines; md5 e8daacbc44bc62578981ffd0462e703d
[stage night3: running]
    PASS | N13 | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat after 1
[stage night3: done in 81 s]
    PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers
[stage run4: running]
    PASS | N15 | the code writes a day number in 0 places; the day-58 save loaded in 114 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 74 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, skills k
    PASS | N25 | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: birthday at Duck Pond with pond behind, for ['n1', 's3', 'ap3']; message '📸 New booking: Mia', the note '📸 New booking!', job box '📸 → Du
    PASS | N26 | ipad-landscape: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 2
    PASS | N34 | an old big-house save: 2 floors, 33 pieces kept (16 upstairs, drawn 40 m along: [40]), 33 placed; buying floors [had, after a try one level short, after the level, coins left, floors built]: [[2, 2, 3, 0, 3], [3, 3, 4, 0, 4], [4, 4, 5, 0, 5], [5, 5, 6, 0, 6]]; at 6 floors: ['at 6', 6, 2500]; pieces 
[stage run4: done in 195 s]
    PASS | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 114 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 74 ms and jumped to the same day: True; after t
    PASS | N25 Photographer: one booking plays from the message to the pay on iPad, sideways iPhone and PC; a perfect photo gets 5 stars; a photo with someone cut off gets fewer | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: birthday at Duck Pond with pond behin
    PASS | N26 Map: the corner map and 📱 Map draw the town (never one flat colour) on every screen size; the facing arrow turns every frame you turn; the corner map shows wherever it should | ipad-landscape: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that fra
    PASS | N34 House floors and colour: 2 floors at decorating 10 up to 6 at 50; the stairs work up and down on every floor; the outside shows the floors and the chosen colour, also for others; old saves keep every piece | an old big-house save: 2 floors, 33 pieces kept (16 upstairs, drawn 40 m along: [40]), 33 placed; buying floors [had, after a try one level short, after the level, coins left, floors built]: [[2, 2, 3
[partial run: some stages skipped by --only]
done
```

### Stage 3 end: rerun, N26 on the final game (96b40df, before the stamp bump)
```
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s3u/live/claude-form-of-github-live.html: removed 55 online-part lines; md5 fd84696cb6775f78d19c823aed4ab0f2
/tmp/claude-0/-home-user-cozy-town/2d51fefd-8eab-5b42-b420-85b3aa0550f9/scratchpad/runs/s3u/new/claude-new.html: removed 55 online-part lines; md5 4845167d93e1546cb5d04a12393c9fff
[stage run4: running]
    PASS | N26 | ipad-landscape: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 2
[stage run4: done in 73 s]
    PASS | N26 Map: the corner map and 📱 Map draw the town (never one flat colour) on every screen size; the facing arrow turns every frame you turn; the corner map shows wherever it should | ipad-landscape: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that fra
[partial run: some stages skipped by --only]
```

### Run 4 finish: the full check on the final file (21 Oct; `--full`, the final block as printed), then the files stage alone after the backup's read-back
```
===== COZY TOWN FINAL CHECK =====
2026-10-21 · check version 6 · update, full sweep for a big update
live Claude fd84696cb6775f78d19c823aed4ab0f2 · new Claude a4b1918b9d43ce9122539ee8a7050780 · live GitHub 709bf763d51be0160c118e2f9249f9f6 · new GitHub 1f3d8b841e356cdfae745748fad7381a
PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-21, github-live.html read on 2026-10-21
FAIL | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQwkHzk, read back 2026-10-20 (byte for byte tools/prerun4-index.html)"
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
PASS | A3 everything in the live game is still in the new one, by name | 58 lists, 728 things before, 880 after; grew: {"areas": "25 -> 26", "places": "22 -> 23", "doors": "23 -> 24", "furniture": "61 -> 134", "furniture_for_sale": "39 -> 111", "hats": "19 -> 20", "clothes": "22 -> 27", "jobs": "4 -> 5", "phone_chats"
PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK); agreed more: city +15% pieces / +25% triangles, pets +100% pieces / +100% triangles | 27 areas, 1395 pieces, 1214267 triangles in total | for information, seen from 5 spots: city 138 draws; home 34 draws; market 13 draws; cafe 29 draws; school 43 draws
PASS | B1 saved games from older versions load in the new one with nothing lost | 16 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-8a1982a.json: name 'ZZTEST-8A1982', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-a0c3ae3.json: name 'ZZTEST-A0C3AE', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-ea70306.json: name 'ZZTEST-EA7030', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); new version saves under the same key: yes | save-f2cdd53-rich.json: name 'ZZTEST-F2CDD5', coins 2345, furniture 7, pets 3; 0 differences; jumped once to the shared day of the one clock (run 4); a Friends Lane time given (the save had none); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-live-web-rich.json: name 'ZZTEST-LIVE-W', coins 3900, furniture 5, pets 3; 0 differences; jumped once to the shared day of the one clock (run 4); new player id given (the save had none); a Friends Lane time given (the save had none); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prenight3-bighouse.json: name 'ZZTEST-BIGHOUSE', coins 3100, furniture 33, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prenight3-designer.json: name 'ZZTEST-DESIGNER', coins 400, furniture 0, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prenight3-pets.json: name 'ZZTEST-PETS', coins 900, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prenight3-upstairs.json: name 'ZZTEST-UPSTAIRS', coins 2345, furniture 7, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); the big house shrank to 12x10 (the owner's decision 16 Oct), every piece kept; new version saves under the same key: yes | save-prerun4-bed.json: name 'ZZTEST-BED', coins 900, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-day1.json: name 'ZZTEST-DAY1', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-day58.json: name 'ZZTEST-DAY58', coins 740, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-lv10.json: name 'ZZTEST-LV10', coins 5200, furniture 0, pets 4; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | save-prerun4-pets2.json: name 'ZZTEST-PETS2', coins 2400, furniture 0, pets 3; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes | fresh save made by the live version today: name 'ZZTEST-S', coins 120, furniture 3, pets 0; 0 differences; jumped once to the shared day of the one clock (run 4); new version saves under the same key: yes
PASS | B2 the new version keeps the same save key | key cozytown-save-1
PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (ipad-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (ipad-landscape) | 7 pages; Next's right edge 1089–1089 px, top 617–617 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-portrait) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-portrait) | 7 pages; Next's right edge 363–363 px, top 765–765 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (iphone-landscape) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (iphone-landscape) | 7 pages; Next's right edge 817–817 px, top 314–314 px; 10 controls tried
PASS | W2 title says "Designed by Izabele 💗", on the screen, clear of the buttons and the version label (pc-1920) | text: 'Designed by Izabele 💗'; on screen: True; touches the version label: False; touches a button: False
PASS | W1 What's new book: 7 pages with pictures; Next, Back, swipe, arrow keys, Escape, ✕, tap outside and Let's play! work; Next stays in the same spot (pc-1920) | 7 pages; Next's right edge 1459–1459 px, top 747–747 px; 10 controls tried
PASS | N1 Holidays fill their month (run 4): Halloween 1-31 Oct, Valentine all February, Easter the month of Easter Sunday, Christmas 1-31 Dec, nothing in other months (faked dates); jump scares only on the spooky path after 18:00, once per night per spot, never in bed or in a scene | 25 Oct day: halloween (103 pieces), spooky path open False; 25 Oct 19:30: halloween, spooky path open True; spot 1: BOO 1 time(s) on the first visit, 1 after a second visit; scare allowed in bed: False, in a scene: False; 20 Dec: xmas (35 pieces); 28 Mar 2027: easter (31 pieces); 10 Feb 2027: valentine (8 pieces); 10 May: None (0 pieces) (21 s)
PASS | N2 Rosie: zero sounds while chatting with her and when her messages arrive; other friends, the chef and clients still sound | open Rosie: 0 sounds; 💬 Chat with Rosie: 0 sounds (tap ok); Rosie's job message arrives: 0 sounds; rosieLater: 0 sounds; showNote for Rosie: 0 sounds; Theo: 2 sounds; the chef: 2; a client note + ding: 4 (7 s)
PASS | N3 Friends and pets: after you stop, every following friend is in the camera's view, at least 1.2 m apart, none behind you; no pet overlaps you, a friend or another pet | stop 1: 4 friends, 4 in view in front, 1.24 m apart; 3 pets, closest gap 1.45 m; after turning round: 4 of 4 back in view; stop 2: 4 friends, 4 in view in front, 1.28 m apart; 3 pets, closest gap 0.80 m; after turning round: 4 of 4 back in view (29 s)
PASS | N4 Walkers: over 3 game hours in town, no two walkers are ever closer than 0.5 m | 2572 frames (11:00 to 14:00), up to 24 walkers out, closest two walkers 0.64 m (12/21 at 33.6,5.6 h11.07) (17 s)
PASS | N5 Benches: every bench has 2 working seats; eating from the bag works while sitting; two test players can't share a seat; the other player sees the sit pose | 24 benches in ['city', 'beach']; 45 seats sat on, 3 taken by someone sitting there; eating on a bench: still sitting True, ate True; two players: A sits on seat 1 of city:0; B sees A sitting (sit flag 1, legs -1.45); B's try for the same seat: seat 1 False, seat 2 True, toast 'Comfy! Move to stand up. You c' (42 s)
PASS | N6 Grandmas (rewritten for run 4): the three are out in dry daytime and gone in rain, snow and at night; the duck-pond bench is full while two of them sit on it and free when they are gone, so you can sit | day (game clock 13:10): out [True, True, True], drawn (within 48 m of the camera) [False, False, True], sitting [True, True, False], pond bench taken [True, True]; night (game clock 4:30): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, False], pond bench taken [False, False]; rain (game clock 13:10): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, False], pond bench taken [False, False]; snow (game clock 13:10): out [False, False, False], drawn (within 48 m of the camera) [False, False, False], sitting [False, False, False], pond bench taken [False, False]; day again (game clock 13:10): out [True, True, True], drawn (within 48 m of the camera) [False, False, True], sitting [True, True, False], pond bench taken [True, True]; at night you can sit on the pond bench: True (16 s)
PASS | N7 Kitchen: two kitchen pieces placed side by side touch (gap under 0.01 m) with fronts lined up; saved kitchens unchanged | fridge beside the stove: gap 0 m, fronts off by 0.001 m (snapped True); sink: gap 0 m, fronts off by 0 m (snapped True); far away: snapped False; against the wall: gap -0.001 m (snapped True); cupboards for sale: ['cupboard', 'cupboardn', 'drawers', 'cornercup', 'tallcup', 'wallcup'] in 5 colours; ghost by the stove: at -1.2,-4.649 valid True snapped True colour #22e07c; a saved kitchen with a gap after a reload: unchanged (29 s)
PASS | N8 Designer: a 2-room order plays to the end and pays; a saved 1-room order still finishes | saved 1-room order (n2, 2 things): go tapped ok, review ended True after 30 rounds, paid 20 🪙, rooms today 0 -> 1; 2-room order (n1: natliv + unikids); message: "Hi! I'm Mia 😊 I live in the Pink house, near the Duck Pond. Can you ma"; room 1 has 2 things; 'All done?' with room 2 empty offers to call the client: False; room 2 (Unicorn play room) has 2 things, room 1 still 2; 2-room review: go tapped ok, ended True after 60 rounds, paid 70 🪙, done 1, client said '🙂 Mia gave you 0½ ⭐ for the forest living room and the unicorn play room. You go' (20 s)
PASS | N9 Food: every new food can be bought, eaten (also on a bench) and shows its icon and name | 10 of 10 new foods eaten from the bag; food truck sells ['burger', 'fries', 'hotdog', 'taco']; the Market sells ['sushi', 'riceball', 'noodles', 'dumplings', 'lollipop', 'pudding']; truck: tap buy burger ok, you have 1; at 21:00: card opens False, bought False ('🌙 The Food truck is closed now. It opens'); taco on a bench: still sitting True, ate True; bag shows '🍣Sushi×2' (16 s)
PASS | N10 Weather: two test players with the same clock see the same weather; each weather and season shows (faked); nothing falls indoors | two players, 5 clock times: same weather 5 of 5; seasons: ['spring', 'spring', 'summer', 'summer', 'autumn', 'autumn', 'winter', 'winter']; rain: lines True (indoors False), sky #6e7a8b, sun 0.28; snow: flakes True (indoors False), ground #e3f0ea; sunny: sky #4fb4ff, sun 0.56, no rain True; cloudy: sun 0.39; weather shares (% of blocks): {"autumn": {"rain": 30, "cloudy": 25, "sunny": 46}, "winter": {"snow": 35, "rain": 4, "cloudy": 29, "sunny": 32}, "spring": {"rain": 26, "sunny": 56, "cloudy": 19}, "summer": {"cloudy": 14, "rain": 16, "sunny": 70}, "xmas": {"snow": 60, "cloudy": 20, "sunny": 21}}; tree colours by season: spring: spring ['#9fe08a', '#b4ea8e', '#8fd97e', '#a6e68c']; summer: summer ['#7ed37a', '#6cc97c', '#93dc76']; autumn: autumn ['#ff9f43', '#ff6b4a', '#ffd45c', '#e8734a']; winter: winter ['#cfe8dc', '#dff2ea', '#b8dcc8', '#e8f4ee'] (80 s)
PASS | N11 Pets: each new kind and breed can be adopted, follows, eats, plays, wears every outfit slot and does the Pet Show; an old version sees breeds as a puppy and does not crash on new kinds | pomchi: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.8, sound True, 4 colours, 6 names, Pet Show True (3) | pug: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.78, sound True, 4 colours, 6 names, Pet Show True (4) | sausage: adopt True (saved as dog), follows True, fed True, played True, 4/4 outfit slots, tag 0.72, sound True, 4 colours, 6 names, Pet Show True (3) | capybara: adopt True (saved as hamster), follows True, fed True, played True, 4/4 outfit slots, tag 1, sound True, 4 colours, 6 names, Pet Show True (2) | duck: adopt True (saved as bunny), follows True, fed True, played True, 4/4 outfit slots, tag 0.9, sound True, 4 colours, 6 names, Pet Show True (3) | owl: adopt True (saved as cat), follows True, fed True, played True, 4/4 outfit slots, tag 0.92, sound True, 4 colours, 6 names, Pet Show True (3) | old version: loads a save with a pug and a capybara: playing True, 2 pets shown as ['pug', 'capybara']; a friend's pug + capybara + unknown kind show as ['pug', 'capybara', 'capybara'] | new version shows a friend's pets as ['pug', 'capybara'] (45 s)
PASS | N12 House: every old big-house save loads at the new size; every piece is placed (inside the walls, no overlaps) or in My stuff; the furniture count is the same before and after; a new upgrade adds the upstairs and moves nothing | save-prenight3-bighouse.json: 12x10 room, upstairs True, 33 placed + 10 in My stuff = 43 (before 43), outside the walls 0, overlaps 0, old layout kept True | save-prenight3-upstairs.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout kept True; the player (saved upstairs) starts at -3.4,0.0 in home | save-f2cdd53-rich.json: 12x10 room, upstairs True, 7 placed + 0 in My stuff = 7 (before 7), outside the walls 0, overlaps 0, old layout kept True | save-live-web-rich.json: 12x10 room, upstairs True, 5 placed + 0 in My stuff = 5 (before 5), outside the walls 0, overlaps 0, old layout kept True | a new upgrade: big True, furniture unchanged True, downstairs 12x10, upstairs True (half-width 6), coins left 100 | stairs up: floor 1 at -3.4,0.0 (78 s)
PASS | N13 Hairstylist: one full customer plays from taking the job to the pay, on iPad, sideways iPhone and PC; a perfect match gets 5 stars | ipad-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | iphone-landscape: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True | pc-1920: job taken True, tutorial True, customer sat after 118 frames, picture True, taps ['ok', 'ok'] (all ok True), hair matches True, Done ok: 5 stars, paid 120 (coins 300 -> 420), customers today 1, customer left True (56 s)
PASS | N14 Smooth and light (rewritten for run 4): E1 within the run-4 limits given to the check (town up to 15% more pieces and 25% more triangles, measured with Halloween, rain and the ghosts on; pet shop up to double; every other area 10%; a new area at most the beach's size), measured against the starting file; index.html under 1.8 MB | index.html 1.60 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 27 areas, 1523 pieces, 1225267 triangles; town 522 -> 559 pieces, 770726 -> 788323 triangles; limits city:0.15:0.25,pets:1.0:1.0 (23 s)
PASS | N15 One clock: two players with saves on day 1 and day 58, device clocks 1 s apart, show the same time (within 10 game minutes), the same weekday and the same weather; no "Day" in any text; in bed you wait for 7:00, no skip; an old save jumps once, keeps everything (B1) and loads in under 1 s | the code writes a day number in 0 places; the day-58 save loaded in 102 ms and jumped once to the shared day (the clock's day); the day-1 save loaded in 79 ms and jumped to the same day: True; after the jump: coins 740 -> 740, furniture 0 of 0, pets 4 of 4, job designer with its order True, skills kept True, garden plants kept True ([['tomato', 1], ['carrot', 1], ['carrot', 1], ['carrot', 3]]); two devices 1 s apart: 10:00: A 10:00 Sun rain / B 10:02 Sun rain; 22:30: A 22:31 Sun rain / B 22:33 Sun rain; +3 d 14:00: A 14:00 Wed sunny / B 14:02 Wed sunny; in bed at 22:00: still in bed after 6 s True (clock 22:12, skipped False), sleep screen True says '💤💤💤22:10 · SunSleeping until 7:00 🌙🌅 Wak', Wake up button [143, 48] px; at 7:02: in bed False, screen False, toast "Good morning! It's Monday ☀️"; the clock chip says '9:40 Mon'; 'Day N' on the screen: nowhere (31 s)
PASS | N16 Rain sky: in rain, snow and cloudy weather the sky top and bottom are grey, never bright blue, at 8:00, 12:00, 18:00 and 23:00 | cloudy 8:00 #9ba7b5/#d3dae2; cloudy 12:00 #9ba7b5/#d3dae2; cloudy 18:00 #9ba7b5/#d3dae2; cloudy 23:00 #181a28/#2b2f41; rain 8:00 #6e7a8b/#a9b2be; rain 12:00 #6e7a8b/#a9b2be; rain 18:00 #6e7a8b/#a9b2be; rain 23:00 #181b28/#2b2f42; snow 8:00 #aab4c1/#e4e9ef; snow 12:00 #aab4c1/#e4e9ef; snow 18:00 #aab4c1/#e4e9ef; snow 23:00 #181a28/#2a2f41; sunny 12:00 #4fb4ff sun True; a sunny-to-rain change (day 28203, block 5), minutes into the fading hour: +3 min rain False sky #52aef6, +12 min rain False sky #6191be, +21 min rain True sky #6d7b8d, +30 min rain True sky #6e7a8b, +39 min rain True sky #6e7a8b, +48 min rain True sky #6e7a8b, +57 min rain True sky #6e7a8b (21 s)
PASS | N17 Updates: a newer file appears while playing -> the game saves and reloads by itself at the next calm moment, never inside a job, scene, class, show, bus ride, shoot, dance round or typing; never twice for one version; an older-version player shows "⏳ older version" | a newer file found while the phone was open: update started False (toast ''); during a scene: started False; calm: note '✨ Updating Cozy Town… your game is' then reload after 1800 ms; the page now runs version 2026102102 (title True, says '✨ Cozy Town is updated!'); the save made first has coins 777; tried this session: 1; a version already tried this session: found True, reloaded False, the button shows instead True; an old-version friend: seen True, marked old True, name tag '⭐ ZZTEST-OLDV · ⏳ older version', in the friends list True; the old version still sees the new player: {'found': True, 'av': True} (41 s)
PASS | N18 Same for everyone: an iPad-size player and a PC-size player see the same time, weather, every house's floors and colour, every furniture piece (x, z, turn, floor) on visits, gardens, holiday pieces, ghosts, trash, grandmas; on every house's stairs no wall or window crosses the view | iPad and PC: time 14:18 / 14:18, Sunday / Sunday, weather sunny / sunny, holiday halloween with 103 / 103 pieces (same shapes True), trash spots 10 same True, Friends Lane lots (owner, floors, garden) same True, grandmas same True; B visits A (ok/ok/ok, let in True): in visit, room 12x10 (host 12x10), floors 2 (host 2), 33 of 33 pieces at the same x, z, turn and floor: True; stairs: 6 looks in A's house and 6 in B's visit, nearest wall or window 4.9 m (26 s)
PASS | N19 Halloween: October 1 and 31 (day and night) show it, 1 Nov doesn't; costumes on sale only in October, wearable, seen by others, kept after; the spooky path at the Flower Corner at least 20% longer than the park's was, at least 5 scare kinds, each turns you to face it with a small shake and a soft sound only with sound on; ghosts all over town, none inside; every holiday piece touches the ground or a support (gap under 2 cm) | oct1-day: halloween (103 pieces, path open False); oct1-night: halloween (103 pieces, path open True); oct31-day: halloween (103 pieces, path open False); oct31-night: halloween (103 pieces, path open True); nov1: None (0 pieces, path open False); sep30: None (0 pieces, path open False); October shop: costumes for sale ['co_cat', 'co_dog', 'co_ghost', 'co_dino']; bought the cat costume for 160 🪙 (True); worn: look.co 'cat', 6 extra body parts over the clothes; mirror: costume row True ['None', '🐈 Cat costume'], tap on the worn costume takes it off (None), tap again puts it on ('cat'); 5 Nov: still for sale [], the bought one still in the wardrobe True, still worn 'cat'; the path: 21.91 m (the park's was 13.6 m), inside the Flower Corner True, 6 spots with 5 kinds ['ghost', 'skel', 'zombie', 'bats', 'pumpkin']; scares: ghost: popped True, stopped True, shake True, faced it (off by 0.01 rad), 2 sounds, again False, skel: popped True, stopped True, shake True, faced it (off by 0.01 rad), 0 sounds, again False, zombie: popped True, stopped True, shake True, faced it (off by 0.01 rad), 1 sounds, again False, bats: popped True, stopped True, shake True, faced it (off by 0.01 rad), 6 sounds, again False, pumpkin: popped True, stopped True, shake True, faced it (off by 0.01 rad), 2 sounds, again False, ghost: popped True, stopped True, shake True, faced it (off by 0.01 rad), 2 sounds, again False; ghosts: 56 all over town (40 over the streets, 8 in the park, 4 on Friends Lane, 4 at the Flower Corner), inside a building: 0; halloween: 47 pieces written down (13 hanging), floating or sunk: 0; christmas: 35 pieces written down (23 hanging), floating or sunk: 0; easter: 31 pieces written down (4 hanging), floating or sunk: 0; an old version reading a costume in presence: co None (the clothes stay #ffd45c) (22 s)
PASS | N20 Holiday spot: February heart fountain and petals; in the Easter month the bunny and 25 eggs (all 25 -> bunny costume and 50 coins, once a year); December Christmas tree and Santa (10 coins on 1 Dec, 300 on 31 Dec, once per real day); other months the flower garden as before | 14 Feb: valentine, gate open True, pieces {'heart fountain': 1, 'heart': 4, 'garland': 3}, petals True; walking at the heart fountain stops 1.6 m from its middle; 10 Mar 2027: easter, bunny True, 25 hunt eggs (25 drawn, 25 to pick up), decorative eggs 23; a PC-size player two weeks later finds the 25 eggs at the same spots: True; in April 2026 (Easter 5 Apr) 11 of the spots differ; hunt: bunny first: '🐰 “Happy Easter! I hid 25 eggs all around town. Find them al'; egg 1 picked: 1 found (24 drawn), picked again: 1; all: 25 found, 0 drawn, 0 left to pick, coins from eggs 0; the bunny: costume True, +50 coins, done 2027; asked again: 50 coins in all; the costume draws (63 parts); in the shop as yours: True; next Easter (April 2028): a fresh hunt 0 of 25 found, the prize year still 2027; 1 Dec: xmas, tree at [[-19.6, -12.6]] (in the park: 0), presents 10, Santa True, gate open True; Santa's coins: 1 Dec 10, again that day 0, 16 Dec 155, 31 Dec 300; 10 May: holiday None, 0 pieces, gate open False; month edges: all right (38 s)
PASS | N21 New Year: fireworks every game night 28 to 31 Dec; party hats on everyone and confetti on 31 Dec and 1 Jan; nothing on 2 Jan | fireworks [want, drawn, bursts in 4.5 s]: 27 Dec night: False False 0, 28 Dec night: True True 4, 28 Dec day: False False 0, 31 Dec night: True True 4, 1 Jan night: False False 0; party [hats on / hats, own hats hidden / own, confetti]: 30 Dec: 0/81 0/12 False, 31 Dec: 81/81 12/12 True, 1 Jan: 81/81 12/12 True, 2 Jan: 0/81 0/12 False; my own look gets a party hat True; a friend with a cap: cap shown False, party hat shown True; indoors: confetti False (fade 0) (17 s)
PASS | N22 School: on 1 Sep balloons around and in the school; a teacher gives the globe once; nothing on 2 Sep | 1 Sep: party True, 13 balloon bunches (8 outside by the school: 8 within its front; in the hall True); the teacher: globes in My stuff 0 -> 1 after talking, 1 after talking again (year 2026); '👩‍🏫 “Happy first day of school! 🎈 Here is a little globe for your d'; the globe builds with 13 parts, in the shop False; 2 Sep: party False, balloons left False, a globe from the teacher 0; 1 Sep 2027: party True, a new globe 1 (year 2027) (15 s)
PASS | N23 Signs: every sign's text centered (within 3% of the sign) and inside its box with a margin, with and without a colour emoji font; the four named signs clean; no post, roof, light or spike crosses any sign's text | 72 signs in 16 places; the worst off-centre 0.6% (limit 3%); crossed or coplanar: 0; '🏖 To the beach': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; '🏰 Knights & castles': off centre 0.2%, inside True, nothing crosses it True, nothing coplanar True; '🏆 Pet Show': off centre 0.6%, inside True, nothing crosses it True, nothing coplanar True; 'Open after 18:00 🌙': off centre 0.0%, inside True, nothing crosses it True, nothing coplanar True; '🍔 Food truck': off centre 0.3%, inside True, nothing crosses it True, nothing coplanar True; measureText bent wider: 6 signs, worst off centre 0.6%, all inside True; measureText bent narrower: 6 signs, worst off centre 0.6%, all inside True (16 s)
PASS | N24 Grandmas: exactly 3; none by the town houses; they sit on the duck-pond bench feeding the ducks at times, walk to places and talk about them; the same places for two players | 3 grandmas; plan for the real day 20746 has 1081 turns; 6 benches by the town houses, seats never held by a grandma: True; two devices, 8 moments: the same clock moment: the biggest difference in a grandma's place 0.03 m (the same turn and stop on both: True); clocks 1 s apart: 1.15 m (1 s of walking is 1.15 m); turn 545: at 76 s two sit 2, seats [0, 1, 0], the pond bench taken [True, True]; 8 s later: ducks fed 2, bubbles [False, False, False]; turn 546, grandma 2: a 56.8 m walk; 11.5 m along her path between 6 s and 16 s (11.5 m expected; 11.5 m as the crow flies), at 72 s standing at beach (arrived True); a speech bubble about the place, standing next to her: True; Say hi 4 times: 4 different lines, never the same twice in a row: True (23 s)
PASS | N25 Photographer: one booking plays from the message to the pay on iPad, sideways iPhone and PC; a perfect photo gets 5 stars; a photo with someone cut off gets fewer | [ipad-landscape] tips card by itself: True (4 steps [['Photographer 📸', True, 6], ['Go there 🗺️', True, 6], ['Poses 🧍', True, 9], ['Snap! 📸', True, 5]]); booking: family at Cozy Park with fountain behind, for ['s3', 'ap3', 'n3']; message '📸 New booking: Mrs. Lee', the note '📸 New booking!', job box '📸 → Cozy Park · 17 m 👨‍👩‍👧 family photo · 0/4', map target {'x': -22, 'z': 11.6}; all 4 places and their backgrounds on walkable ground: True; at the spot the button says {'icon': '📸', 'label': 'Set up the photo'}; set up: 3 in the group (wanted 3), shoot on True, bar True, frame True, background fountain; bar: 5 buttons, smallest 50 px, overlaps [], run/jump buttons hidden True; next to s3: the button says {'label': 'Pose: Mrs. Lee', 'icon': '🧍'}; the pose card: 6 poses, tapped Wave -> wave (tap ok); the 🧍 card (3 rows) -> poses ['peace', 'smile', 'jump']; backgrounds: 3 to pick from, the button cycled ['fountain', 'flowers', 'stage'], the group stood at ['-21.0,15.0', '-28.0,14.4', '-33.6,20.4']; framed from 3.6 m: {'st': 5, 'cut': 0, 'hid': 0, 'back': 0, 'unposed': 0, 'fill': 1, 'bgOk': True, 'w': 0.8, 'h': 0.69}; zoom: fov 70 -> 57.4 (zoom 0.82) -> 70; snap: 5 stars, +120 coins, picture saved True (19415 chars), the thank-you message '📸 From Mrs. Lee' with the photo True, card with the photo True and Bye True; the photo shows in the phone chat: True; after Bye: shoot off True, group gone True, bar hidden True, done 1; second booking (pets at Flower Corner), turned so 1 of 3 is cut off: 3 stars, +60 coins, the message says 'Thank you! Nice photo! 😊 (Next time: someone was cut off.)'; after 4 photos no new booking True, the box says '🌟 All 4 photos done today!'; quitting the job clears the shoot True || [iphone-landscape] booking: family at Duck Pond with bench behind, for ['n1', 'n2', 'n3']; message '📸 New booking: Mia', the note '📸 New booking!', job box '📸 → Duck Pond · 58 m 👨‍👩‍👧 family photo · 0/4', map target {'x': 34.6, 'z': -31.4}; all 4 places and their backgrounds on walkable ground: True; at the spot the button says {'icon': '📸', 'label': 'Set up the photo'}; set up: 3 in the group (wanted 3), shoot on True, bar True, frame True, background bench; bar: 5 buttons, smallest 51 px, overlaps [], run/jump buttons hidden True; next to n1: the button says {'label': 'Pose: Mia', 'icon': '🧍'}; the pose card: 6 poses, tapped Wave -> wave (tap ok); the 🧍 card (3 rows) -> poses ['peace', 'smile', 'jump']; backgrounds: 2 to pick from, the button cycled ['bench', 'pond'], the group stood at ['33.6,-37.9', '35.2,-33.3']; framed from 3.6 m: {'st': 5, 'cut': 0, 'hid': 0, 'back': 0, 'unposed': 0, 'fill': 1, 'bgOk': True, 'w': 0.53, 'h': 0.69}; zoom: fov 70 -> 57.4 (zoom 0.82) -> 70; snap: 5 stars, +120 coins, picture saved True (13335 chars), the thank-you message '📸 From Mia' with the photo True, card with the photo True and Bye True; the photo shows in the phone chat: True; after Bye: shoot off True, group gone True, bar hidden True, done 1; second booking (pets at Cozy Town School), turned so 1 of 3 is cut off: 3 stars, +60 coins, the message says 'Thank you! Nice photo! 😊 (Next time: someone was cut off.)'; after 4 photos no new booking True, the box says '🌟 All 4 photos done today!'; quitting the job clears the shoot True || [pc-1366] booking: wedding at Flower Corner with hedge behind, for ['ap3', 'ap1']; message '📸 New booking: Oscar', the note '📸 New booking!', job box '📸 → Flower Corner · 1 m 💒 wedding photo · 0/4', map target {'x': -17, 'z': -3.6}; all 4 places and their backgrounds on walkable ground: True; at the spot the button says {'icon': '📸', 'label': 'Set up the photo'}; set up: 2 in the group (wanted 2), shoot on True, bar True, frame True, background hedge; bar: 5 buttons, smallest 50 px, overlaps [], run/jump buttons hidden True; next to ap3: the button says {'label': 'Pose: Oscar', 'icon': '🧍'}; the pose card: 6 poses, tapped Wave -> wave (tap ok); the 🧍 card (2 rows) -> poses ['peace', 'smile']; backgrounds: 2 to pick from, the button cycled ['hedge', 'gate'], the group stood at ['-20.3,-5.9', '-17.5,-6.1']; framed from 3.6 m: {'st': 5, 'cut': 0, 'hid': 0, 'back': 0, 'unposed': 0, 'fill': 1, 'bgOk': True, 'w': 0.42, 'h': 0.69}; zoom: fov 70 -> 57.4 (zoom 0.82) -> 70; snap: 5 stars, +120 coins, picture saved True (15639 chars), the thank-you message '📸 From Oscar' with the photo True, card with the photo True and Bye True; the photo shows in the phone chat: True; after Bye: shoot off True, group gone True, bar hidden True, done 1; second booking (pets at Duck Pond), turned so 1 of 3 is cut off: 3 stars, +60 coins, the message says 'Thank you! Nice photo! 😊 (Next time: someone was cut off.)'; after 4 photos no new booking True, the box says '🌟 All 4 photos done today!'; quitting the job clears the shoot True (57 s)
PASS | N26 Map: the corner map and 📱 Map draw the town (never one flat colour) on every screen size; the facing arrow turns every frame you turn; the corner map shows wherever it should | ipad-landscape: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; ipad-landscape: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 28), (1, True, 25), (1, True, 23), (1, True, 24)]; ipad-landscape: with the teacher, hair, delivery and designer jobs the box shows text and a drawn map; ipad-landscape: corner map hidden indoors True, back in town True; ipad-landscape: 📱 Map 806x646 css px, 191 colours, zoom 7.6; iphone-portrait: no job: corner map shown True, job text hidden True, 164 colours on 124 px, label 'Your map. Tap to open the big map'; iphone-portrait: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 10), (1, True, 11), (1, True, 12), (1, True, 14), (1, True, 14)]; iphone-portrait: with the teacher, hair, delivery and designer jobs the box shows text and a drawn map; iphone-portrait: corner map hidden indoors True, back in town True; iphone-portrait: 📱 Map 326x670 css px, 349 colours, zoom 3.84; iphone-landscape: no job: corner map shown True, job text hidden True, 161 colours on 120 px, label 'Your map. Tap to open the big map'; iphone-landscape: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 12), (1, True, 9), (1, True, 12), (1, True, 17), (1, True, 12)]; iphone-landscape: with the teacher, hair, delivery and designer jobs the box shows text and a drawn map; iphone-landscape: corner map hidden indoors True, back in town True; iphone-landscape: 📱 Map 784x280 css px, 299 colours, zoom 3.29; pc-1366: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; pc-1366: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 28), (1, True, 25), (1, True, 23), (1, True, 24)]; pc-1366: with the teacher, hair, delivery and designer jobs the box shows text and a drawn map; pc-1366: corner map hidden indoors True, back in town True; pc-1366: 📱 Map 992x594 css px, 177 colours, zoom 6.99; android-tablet-portrait: no job: corner map shown True, job text hidden True, 233 colours on 162 px, label 'Your map. Tap to open the big map'; android-tablet-portrait: 5 turns in a row, each one frame: (drawn that frame, the arrow turned to the new facing, pink arrow pixels at your spot): [(1, True, 25), (1, True, 28), (1, True, 25), (1, True, 23), (1, True, 24)]; android-tablet-portrait: with the teacher, hair, delivery and designer jobs the box shows text and a drawn map; android-tablet-portrait: corner map hidden indoors True, back in town True; android-tablet-portrait: 📱 Map 736x1106 css px, 224 colours, zoom 8.66 (69 s)
PASS | N27 Trash: only cans, paper, peels and cups; picking up still works | 10 pieces of trash out of 28 spots today, kinds {'peel': 2, 'cup': 4, 'paper': 3, 'can': 1}; picking one up: True (+3 coins, remembered); over 8 days the trash kinds are ['can', 'cup', 'paper', 'peel'] (16 s)
PASS | N28 Pet shop: two floors; each kind in its own area upstairs, no kind in another's area; clothes and snacks on shelves downstairs; adopting and buying still work | 2 floors; 7 areas upstairs for ['bunny', 'capybara', 'cat', 'dog', 'duck', 'hamster', 'owl']; 14 animals; 60 s of wandering: 0 of 16800 animal-frames outside their own area; who lives where: [['dog', 'pug', 'pomchi', 'sausage'], ['cat', 'cat'], ['bunny', 'bunny'], ['capybara'], ['duck', 'duck'], ['owl'], ['hamster', 'hamster']]; downstairs: 3 shelf units along the back wall (snacks, toys, clothes), spots ['Upstairs to the animals', 'Downstairs to the shop', 'Go outside', 'Buy pet food, toys & clothes', 'Pet clothes']; buying a treat: +1 for 5 coins, the shop lists pet clothes True; stairs: up to floor 2 (z 40), down to floor 1; adopting a pug upstairs: card opens True, pets +1 (pug) (19 s)
PASS | N29 Pond: no bridge; nobody can walk on the water | walking at the pond from four sides stops 2.5 m from its middle (the water's edge is 1.45 m); hand-rail tubes left: 0; ducks 2, Feed-the-ducks spots 3, walk strips through water 0, height over the pond 0 (14 s)
PASS | N30 Sky: clouds soft (no outlines, no hard dark faces) by day and night; no orange specks above the trees; any leaves are leaf-shaped and near trees | clouds: 16 in the sky + 6 at the beach, 22 meshes, 0 not the cloud material, 0 outline hulls; by day top #ffffff bottom #dde4f0; day sky picture: 0.0% dark pixels in the sky band clear of the buttons (limit 0.3%); grey weather: top #d3d9e4 bottom #a9b2c2; night: top #9aa1c8 bottom #5d6489; leaves in the park: visible True, 90 of 90 dealt to 12 trees (216 round trees in town), highest start 3.05 m, farthest tree 19.2 m, not a tree: 0, leaf shape True, season autumn; beach: leaves visible False (trees near: 0); winter: leaves visible False (16 s)
PASS | N31 Trees: no tree crown inside any building; no white smear on any wall | 216 round trees and 55 pines against 25 buildings' walls: 0 crowns inside a wall; the closest crown {'gap': 0.21, 'tree': [34.9, -30.2, 'tree'], 'building': '23,-31'}; wall at 12: steps>6 0.72% (limit 1.5), mean step 0.167 (limit .45; the streaked wall had 4.5% and .92), lum 207; wall at 11.5: steps>6 0.72% (limit 1.5), mean step 0.167 (limit .45; the streaked wall had 4.5% and .92), lum 207; wall at 12.5: steps>6 0.72% (limit 1.5), mean step 0.167 (limit .45; the streaked wall had 4.5% and .92), lum 207; wall at 9: steps>6 0.72% (limit 1.5), mean step 0.209 (limit .45; the streaked wall had 4.5% and .92), lum 231; wall at 15: steps>6 0.5% (limit 1.5), mean step 0.104 (limit .45; the streaked wall had 4.5% and .92), lum 170; wall at 17.5: steps>6 0.5% (limit 1.5), mean step 0.091 (limit .45; the streaked wall had 4.5% and .92), lum 151 (21 s)
PASS | N32 Food trucks: no flicker (no two surfaces closer than 1 cm facing the same way); the sign and the burger picture clean | the truck at (-34.2, 11.8): 840 triangles in 150 facing directions, 466 close same-facing pairs looked at, 0 overlapping within 1 cm; food trucks in the game (by their sign): 1; the sign: off centre 0.3%, crossed [], coplanar 0; the burger picture on the sign (left 35%): 6462 coloured pixels besides the red board, 1688 white; (the live truck had 34 such pairs) (24 s)
PASS | N33 Levels and garden: every skill reaches 50 and stops there; +6 seed spots at gardening 10/20/30/40/50; another player sees your plants | skills ['garden', 'cook', 'pets', 'friends', 'clean', 'sport', 'decor', 'music', 'read']: every one reaches {50} and stays there after more XP {50}; XP per level [10, 100, 490] (10 per level as before); level-up coins paid [500, 500, 500]…; yard spots 36 (30 pots), garden save slots 6; a spot's gardening level [beds, pots…] [1, 1, 10, 10, 20, 20, 30, 30, 40, 40, 50, 50]; spots open at level 1/9/10/19/20/49/50: [2, 2, 4, 4, 6, 10, 12] of 12 sampled; planting in pot 7 at level 10: carrot (panel True); a level-50 pot says '🔒 Gardening level 50'; presence gd '0,carrot,3;1,tomato,0;3,carrot,3;6,carrot,0'; a PC-size friend builds that lot: 22924 vertices without the garden, 30076 with it (the pot's carrot shows); the lane list carries the garden True (26 s)
PASS | N34 House floors and colour: 2 floors at decorating 10 up to 6 at 50; the stairs work up and down on every floor; the outside shows the floors and the chosen colour, also for others; old saves keep every piece | an old big-house save: 2 floors, 33 pieces kept (16 upstairs, drawn 40 m along: [40]), 33 placed; buying floors [had, after a try one level short, after the level, coins left, floors built]: [[2, 2, 3, 0, 3], [3, 3, 4, 0, 4], [4, 4, 5, 0, 5], [5, 5, 6, 0, 6]]; at 6 floors: ['at 6', 6, 2500]; pieces still 33; up: floors [2, 3, 4, 5, 6] at z [40, 80, 120, 160, 200] (one floor drawn at a time True); down: floors [5, 4, 3, 2, 1]; a chair placed on floor 4 stands at z 121.5 (hidden from floor 1 True, shown on floor 4 True); outside: my name sign hangs at 23.7 m (6 floors: 23.7), presence floors 6 colour #bfe6ff, home presence n 6 with floors ['u', 'u2', 'u3', 'u4', 'u5'] (the chair rides in u3: True); a PC-size friend: the lane list gives Zed 4 floors in #bfe6ff; Zed's sign at 17.3 m (4 floors: 17.3) and 7.9 m with 1 floor (7.9); visiting a 6-floor host: 6 floors, pieces at z [1, 41, 81, 201]; in the visit: up to floor 2 then 3; an old upstairs save: 7 pieces kept (3 upstairs), 7 placed, you start inside the house True with 2 floors (45 s)
PASS | N35 Notepad switch: off hides it, on brings it back with the notes kept | default: switch on True, notepad shown True; Settings has the switch: {'text': '✏️ On', 'w': 92.6875, 'h': 52}; after Off: shown False, switch 'Off', saved False, notes kept True; after On: shown True, notes kept True; with the designer card the notepad steps aside True and comes back True (15 s)
PASS | N36 Furniture: at least 60 new pieces across every kind, each buyable, placeable, saved and seen by a visitor | 72 new pieces (r4), 54 with several colours; builds, fits its footprint, buyable and priced: 72 of 72; kinds covered: 13 of 13; in the shop's list 72, thumbnails drawn 6/6, in the designer's pool 72; placed in the house one by one: 72 (failed []); bought a loveseat from the catalog for 190 coins (placing False); 5 pieces saved and read back 5/5, in the home presence 5/5; a visitor builds the host's room: 38 pieces, parts [12, 9, 15, 6, 16, 5, 6, 3] (27 s)
PASS | N37 Tree park: each of the three paths can be finished; zip lines work; signs readable; free; a fall puts you back on the last platform; on every device | [ipad-landscape] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; signs readable (ink inside, centred within 3%): 6 of 6; easy (7 decks): jump 0->1 gap 1 m dh 0, bridge 1->2, jump 2->3 gap 0.96 m dh 0, jump 3->4 gap 1.27 m dh 0.2, jump 4->5 gap 1 m dh 0, zip 5->6 2.3 s over 12.2 m; the bell: Ring the bell! -> finished True (+20 coins); medium (10 decks): jump 0->1 gap 1.4 m dh 0, jump 1->2 gap 1.05 m dh 0.3, jump 2->3 gap 1.8 m dh 0, bridge 3->4, jump 4->5 gap 1.6 m dh 0.3, jump 5->6 gap 1.45 m dh 0, jump 6->7 gap 1.6 m dh 0, zip 7->8 2.6 s over 13.8 m, jump 8->9 gap 1.4 m dh 0; the bell: Ring the bell! -> finished True (+30 coins); hard (11 decks): jump 0->1 gap 1.8 m dh 0, jump 1->2 gap 1.27 m dh 0.4, jump 2->3 gap 2 m dh 0, bridge 3->4, jump 4->5 gap 2.2 m dh 0.2, jump 5->6 gap 1.84 m dh 0, jump 6->7 gap 2.2 m dh 0.2, jump 7->8 gap 2.2 m dh 0.2, zip 8->9 3 s over 16.2 m, jump 9->10 gap 2 m dh 0; the bell: Ring the bell! -> finished True (+40 coins); the ⬆️ button makes you jump: True; a fall from deck 3: reached the ground True (lowest 0 m), picked up True, back on the deck True, falls counted 1, tummy still 89 (no harm); out through the gate (Back to town) -> {'cur': 'city', 'x': 71.6, 'z': -38}; weight: the park {'meshes': 53, 'tris': 42328} vs the beach {'meshes': 119, 'tris': 57885} || [iphone-portrait] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; signs readable (ink inside, centred within 3%): 6 of 6; easy (7 decks): jump 0->1 gap 1 m dh 0, bridge 1->2, jump 2->3 gap 0.96 m dh 0, jump 3->4 gap 1.27 m dh 0.2, jump 4->5 gap 1 m dh 0, zip 5->6 2.3 s over 12.2 m; the bell: Ring the bell! -> finished True (+20 coins); the ⬆️ button makes you jump: True; a fall from deck 3: reached the ground True (lowest 0 m), picked up True, back on the deck True, falls counted 1, tummy still 91 (no harm); out through the gate (Back to town) -> {'cur': 'city', 'x': 71.6, 'z': -38}; weight: the park {'meshes': 53, 'tris': 42328} vs the beach {'meshes': 119, 'tris': 57885} || [iphone-landscape] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; signs readable (ink inside, centred within 3%): 6 of 6; easy (7 decks): jump 0->1 gap 1 m dh 0, bridge 1->2, jump 2->3 gap 0.96 m dh 0, jump 3->4 gap 1.27 m dh 0.2, jump 4->5 gap 1 m dh 0, zip 5->6 2.3 s over 12.2 m; the bell: Ring the bell! -> finished True (+20 coins); the ⬆️ button makes you jump: True; a fall from deck 3: reached the ground True (lowest 0 m), picked up True, back on the deck True, falls counted 1, tummy still 91 (no harm); out through the gate (Back to town) -> {'cur': 'city', 'x': 71.6, 'z': -38}; weight: the park {'meshes': 53, 'tris': 42328} vs the beach {'meshes': 119, 'tris': 57885} || [pc-1366] the gate: button ['🌲', 'Climb into the Tree Park'], on the map as Tree Park 🌲 at 75.6,-40.6; inside: treepark, coins 500 -> 500 (free), signs ['🟢 Easy path', '🏁 Finish', '🟡 Medium path', '🏁 Finish', '🔴 Hard path', '🏁 Finish'], 28 decks, 3 bridges, 3 zip lines, a gate back True; signs readable (ink inside, centred within 3%): 6 of 6; easy (7 decks): jump 0->1 gap 1 m dh 0, bridge 1->2, jump 2->3 gap 0.96 m dh 0, jump 3->4 gap 1.27 m dh 0.2, jump 4->5 gap 1 m dh 0, zip 5->6 2.3 s over 12.2 m; the bell: Ring the bell! -> finished True (+20 coins); the Space key makes you jump: True; a fall from deck 3: reached the ground True (lowest 0 m), picked up True, back on the deck True, falls counted 1, tummy still 91 (no harm); out through the gate (Back to town) -> {'cur': 'city', 'x': 71.6, 'z': -38}; weight: the park {'meshes': 53, 'tris': 42328} vs the beach {'meshes': 119, 'tris': 57885} (64 s)
PASS | N38 Tutorials: the hairstylist and pizza jobs show a picture tutorial the first time and from "?" | delivery: shows by itself 5 steps: 'Pizza delivery 🍕' picture True 5 words, 'Follow the dot 🗺️' picture True 9 words, 'Ring the bell 🚪' picture True 6 words, 'Be quick! ⚡' picture True 5 words, 'Let's go! 🛵' picture True 7 words; after the last step: gone True, remembered True; second time by itself: False; the job card has a ❓: True; ❓ brings it back: True || hair: shows by itself 4 steps: 'Hairstylist ✂️' picture True 6 words, 'The wish picture 🖼️' picture True 6 words, 'Cut, comb, dye' picture True 3 words, 'Done! ⭐' picture True 5 words; after the last step: gone True, remembered True; second time by itself: False; the job card has a ❓: True; ❓ brings it back: True (32 s)
PASS | N39 Parties: host at the mailbox and pick a time; every online test player gets the note with the host's name and can accept or decline; with a disco floor and ball the dance game runs for two; hits make dance moves; the score bar slides smoothly (never jumps), even = middle with both faces; an old version doesn't crash | three players online together: True (A sees ['ZZTEST-GUESTB', 'ZZTEST-OLDC']); A at the mailbox: button 'Mailbox: mail or a party', menu mail True / party True, times offered ['☀️Today13:00', '☀️Today14:00', '☀️Today15:00', '☀️Today16:00'], picked -> party {'h': 13, 'future': True}; B gets the news: True; the card '🎉 A party!: ZZTEST-HOSTA is hosting a party today at 13:00!Go check it out?' with [["✅ I'll come!", 127, 48], ['🙅 Not this time', 159, 48]] (stage 3: the card is the notification; no second note behind it: True); B says yes: {'rsvp': 'yes', 'card': False}; A hears it: True; at party time B gets the way: True, way-finder ['party', "ZZTEST-HOSTA's party", [-97, 9.4]] = A's lane door [-97, 9.4, 0]: True; note 'ZZTEST-HOSTA's party is starting! Follow the arrow to their '; B knocks, A's door opens by itself: B inside True, A sees the guest True; A's disco floor lights up: {'lit': True, 'tiles': 36, 'ball': True}; B sees the floor and ball in A's house: True; A on the floor: the button ['🕺', 'Dance!', 1]; B gets the dance card: True '🕺 Dance-off!ZZTEST-HOSTA wants to dance with you!Press the arrows as t' [["💃 Let's dance!", 150, 48], ['🙅 Not now', 123, 48]]; the dance-off starts for both: True; A: countdown -3.4 s, view dance, on the left 1, 20 arrows, 2 faces ['You', 'ZZTEST-GUESTB'], bar 0.5 (even = middle), buttons [[62, 62], [62, 62], [62, 62], [62, 62]]; the round: A hit 20 (3 with the big buttons), B hit 20 (3 with the arrow keys); A's dancer moved on hits True; A saw B's dancer move True; the score bar on A over 548 frames: biggest step 0.025 (smooth), from 0.5 to 0.504 (range 0.5..0.575); the end: A's card True 'You 300 · ZZTEST-GUESTB 300' / '🤝 A tie! Great moves, both of you!You go', B's card True; the view stays on the dancers while the card shows True; after Done the view is back True (B: True); the old version C all along: before {'peers': 2, 'seesA': True, 'cur': 'city'}, after {'peers': 2, 'seesA': True, 'cur': 'city', 'playing': True}, page errors [] (46 s)
PASS | N40 Smooth and light: E1 within the run-4 limits (town 15%/25% with Halloween, rain and ghosts on; pet shop up to double; home within 10% with 6 floors; the tree park within the beach's size; others 10%); index.html under 1.8 MB | index.html 1.60 MB; measured with Halloween halloween, rain True, butterflies True, birds True: 27 areas, 1531 pieces, 1225051 triangles; town 522 -> 568 pieces, 770726 -> 788107 triangles; limits city:0.15:0.25,pets:1.0:1.0 (27 s)
PASS | N41 Bus: with the one clock the bus still comes 3 days a week and the pill shows the next bus with its weekday | bus days per week (6 weeks): [3, 3, 3, 3, 3, 3]; the two devices agree on every bus day and hour: True; 10 mornings at the park stop: 5 bus days, 5 without; a morning without a bus says e.g. 🚌 Next bus: Tue 9:20; a bus day says e.g. 🚌 Bus to the beach: 0:58 (22 s)
PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
PASS | C2 every spot and button does something (iPad, finger taps) | 754 taps tested in 25 areas, 365 screens
PASS | C2b every area is reached by playing | 25 of 25 areas
PASS | C3 walking works (ipad-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | T1 teacher job plays from the school message to the end of class (ipad-landscape) | 3 classes: Math ended, History ended, Math ended
PASS | T2 every goofing kid can be stopped, left and right (ipad-landscape) | left side 14 of 14 taps worked, right side 21 of 21
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (ipad-landscape) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (ipad-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (iphone-landscape) | 3 classes: English ended, Math ended, English ended
PASS | T2 every goofing kid can be stopped, left and right (iphone-landscape) | left side 9 of 9 taps worked, right side 26 of 26
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (iphone-landscape) | 14 papers; button size 52x44 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (iphone-landscape) | 51 questions read
PASS | T1 teacher job plays from the school message to the end of class (pc-1920) | 3 classes: History ended, Math ended, English ended
PASS | T2 every goofing kid can be stopped, left and right (pc-1920) | left side 9 of 9 taps worked, right side 24 of 24
PASS | T3 homework right and wrong buttons: at least 44 px, at least 12 px apart, never covered (pc-1920) | 14 papers; button size 58x52 px; smallest gap 16 px; covered taps: 0
PASS | T4 homework questions are easy to read: dark text, at least 16 px (pc-1920) | 51 questions read
PASS | C3 walking works (pc-1920) | W key: moved 6.4 m in 1.5 s
PASS | C1 every screen opens (iphone-portrait, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (iphone-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (iphone-landscape, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (iphone-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-phone-portrait, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (android-phone-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-phone-landscape, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (android-phone-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-tablet-portrait, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (android-tablet-portrait) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (android-tablet-landscape, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (android-tablet-landscape) | joystick drag: moved 5.8 m in 1.5 s
PASS | C1 every screen opens (pc-1366, light and dark) | 34 of 34 screens, each in light and dark
PASS | C3 walking works (pc-1366) | W key: moved 6.4 m in 1.5 s
PASS | C4 nothing is cut off the screen | 0 problems
PASS | C4 no buttons overlap | 0 problems
PASS | C4 all text fits its box | 0 problems
PASS | C4 every button is at least 44 px for a finger | 0 problems
PASS | C4 text is readable in light and dark | 0 problems
PASS | C5 the same kind of button looks the same everywhere | 38 kinds of button
PASS | C6 zero errors in the browser log | 0 errors
PASS | C8 test copies never reached the real internet | 0 outside requests stopped
NOT RUN | C1-WK every screen in Safari's engine (iPhone, iPad) | NOT RUN: Safari's engine is not installed on this computer
PASS | F6 every test action is logged and undone | 149 test actions, 149 undone
PASS | F2a the tests used exactly the files to publish | files tested: ['01a11fd3ba4c758f14cbdb57561be330', '1f3d8b841e356cdfae745748fad7381a', '21eae93657e97f70f83b78f279788daa', '709bf763d51be0160c118e2f9249f9f6', '9eb078c3210712463e351b7879d25a6a', 'a4b1918b9d43ce9122539ee8a7050780', 'a8027586de70cb454c6e4ed60c43ad89', 'bf303055ffaba678a0abb4889891e6a8', 'd5f94c21bbed7f6f6925e31f8bdb1a9b', 'eb02ebe8dc4e40b67fa85ddc8589d377', 'fc91242a5e3386675a26240728e18052']; to publish: ['1f3d8b841e356cdfae745748fad7381a', 'a4b1918b9d43ce9122539ee8a7050780']
NOT RUN | F2 published Claude version = tested file | NOT RUN: not published yet
NOT RUN | F3 GitHub file after upload = new Claude version + same web part, same address | NOT RUN: not uploaded yet
NOT VERIFIED | G real devices, sound, smoothness, two real players online | NOT VERIFIED: in the "Try it for real" notebook until ticked
RESULT: 1 FAIL, 4 not run or not verified · 69 min of testing
```
The files stage alone (`--only files`), with the backup read back on 21 Oct (byte for byte tools/prerun4-index.html):
```
PASS | A1 newest live versions read right before the check | claude-form-of-github-live.html read on 2026-10-21, github-live.html read on 2026-10-21
PASS | A2 dated private backup of the live game | backup 709bf763d51be0160c118e2f9249f9f6 vs live GitHub 709bf763d51be0160c118e2f9249f9f6; title "PRE-RUN 4 LIVE — Cozy Town backup 2026-10-18 (GitHub file, night 3), private artifact 761umD3PEycuWELrQw
PASS | F3a live GitHub version = live Claude version + web part, nothing else | 55 added lines in 2 places, no lines removed or changed
PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
```

## 3. Before and after pictures, and the "should look like" lines (stage 1)
All in tools/pictures-4/ (the three before-pictures of the Flower Corner from the start of the run, the after-pictures named by job above). Every job's entry in section 1 carries its "should look like (BUILDER)" line; stage 3 checks against them:
- Flower Corner: after-flower-corner-gate-open-october-night.png, after-flower-corner-spooky-path.png, after-flower-corner-gate-closed-november.png
- Signs: after-pet-show-sign-october.png
- Look fixes: after-food-truck.png, after-soft-clouds-day.png, after-soft-clouds-night.png, after-leaves-from-the-crowns.png, before-apartment-wall-noon-streaks.png, after-apartment-wall-noon.png
- Map: after-corner-map-no-job-ipad.png, after-corner-map-no-job-iphone.png, after-big-map-iphone.png
- Grandmas: after-grandmas-pond.png, after-grandma-at-a-place.png
- Small things: after-pond-no-bridge.png, after-pond-ducks.png, after-trash-soda-can.png, after-trash-banana-peel.png, after-notepad-switch-off.png
- Friends in front of you after the wedge fix: after-friends-in-front.png
- The stage-1 book: the book stage's shots (book-page-1 … 7 on four devices) in the full check's out/shots.

## 3b. Before and after pictures, and the "should look like" lines (stage 2)
All in tools/pictures-4/ (named by job; every job's entry in section 1 carries its "should look like (BUILDER)" line; stage 3 checks against them):
- Levels, garden, floors, colour: after-house-six-floors.png, after-house-colour.png, after-garden-pots.png, after-floor-4-inside.png
- The other holidays: after-valentine-fountain.png, after-easter-bunny.png, after-december-tree-santa.png, after-fireworks.png, after-party-hats-confetti.png, after-school-balloons.png, after-school-hall-balloons.png
- Pet Shop upstairs: after-petshop-downstairs.png, after-petshop-upstairs.png, after-petshop-upstairs-ducks-owl.png
- Furniture: after-new-furniture-catalog.png, after-new-furniture-room.png
- Job tutorials: after-tutorial-delivery-step-1.png, after-tutorial-delivery-step-2.png, after-tutorial-hair-step-1.png, after-tutorial-hair-step-2.png
- Photographer: after-photo-shoot-ipad.png, after-photo-shoot-ipad-dark.png, after-photo-shoot-iphone.png, after-photo-shoot-pc.png, after-photo-result.png, after-photo-chat.png
- Tree Park: after-treepark-gate.png, after-treepark-start.png, after-treepark-start-dark.png, after-treepark-easy-first-deck.png, after-treepark-finish.png
- Parties and the dance-off: after-party-invitation.png, after-dance-off.png, after-dance-result.png
- The stage-2 book: the book stage's shots (book-page-1 … 7 on four devices) in the full check's out/shots.

## 3c. Pictures of stage 3 (tools/pictures-4/stage3/)
- The photographer's pictures of pass 7, the last full pass (442 pictures: every place, every building inside, every new thing, every screen; iPad, iPhone upright and sideways, PC; light and dark; day, night and rain; October and the faked holiday dates; two players together), saved small (640 px webp) with a map of where each was taken: tools/pictures-4/stage3/map.json (set, name, device, theme, place, time, weather, date). They were taken before the round-5 critic fixes (c6d204f to 8fe0d95) and the pass-7 fixes (96b40df); pass 8, which would show those, is open.
- The glitch pictures: tools/pictures-4/stage3-glitches/G4-nnn-before.webp and -after.webp, one pair per entry of tools/GLITCH-LIST-4.md.
- The critics' pictures are the same photographer pictures (their briefs name them); the critic scores are in section 4.
- "Should look like" lines: unchanged from stages 1 and 2 (stage 3 fixed things against them; it built no new area).

- Run 4 finish: the pictures of passes 8 to 19 stayed in the first finish session's scratch folder, which is gone; their entries (G4-168 to G4-326) are in tools/GLITCH-LIST-4.md without a before picture, and the fixed ones carry an after picture from the full final pass (pass 23). From G4-327 on (passes 20 to 25) each entry has its pictures, in tools/pictures-4/stage3-glitches/ like the rest. The photographer's pictures of the passes were not kept (their maps are in tools/run4-wip/data/stage3-p8* to stage3-p23*).

## 4. The glitch list and the critic loop scores
- The glitch list: tools/GLITCH-LIST-4.md (167 entries: 142 fixed, 23 not a glitch, 2 open). How it was made is at the top of that file; every kept viewer mark is in exactly one entry; the photographer's own mistakes were set aside with their reason before the double-checker and the spots were fixed for the next pass.
- The critic loop (the owner asked for it on 17 Oct): for each big change a fresh sub-agent each round saw only the pictures of that part and the builder's "should look like" line(s), never an earlier score, and gave one score from 1 to 10. Below 8: fix and go again; done after three scores of 8 or more in a row; a loop stops after 6 rounds.

| part | round 1 | round 2 | round 3 | round 4 | round 5 | round 6 |
|---|---|---|---|---|---|---|
| photographer job | 7 | 6 | 6 | 6 | 7 | 7 |
| tree park | 7 | 7 | 8 | 8 | 8 (done: three 8s in a row) | (done) |
| parties and the dance game | 6 | 6 | 7 | 7 | 8 | 8 |
| holiday spot | 6 | 7 | 7 | 8 | 7 | 7 |
| house floors and colour | 6 | 7 | 7 | 7 | 7 | 8 |
| one clock | 6 | 6 | 7 | 6 | 6 | 7 |

- What each round said and what was changed for it is in the kit's scratch (critic-scores.md) and in the pull request "Run 4, stage 3"; the fixes themselves are glitch entries or stage-3 changes in section 1.

- Run 4 finish: round 6, the last the plan allows, saw pass 9's pictures (the file with f3 to f5): photographer job 7, parties and the dance game 8, holiday spot 7, house floors and colour 8, one clock 7. No loop besides the Tree park reached three 8s in a row; the loops end here. What each critic said, what was fixed for it in f6 (not scored again) and where each loop is stuck: tools/run4-wip/data/critic-scores.md.
- The glitch list after the finish: 341 entries (G4-001 to G4-341): 256 fixed, 68 not a glitch, 17 open (15 of them grade 1, listed in section 1's leftover list; G4-205 and G4-222, your pets at your heels, grade 2, for the owner).

## 5. Glitches found and not fixed (stage 1)
- The apartment block's east wall still shows a faint diagonal shade on its shadow side for about 10 game-minutes around 12:30 (mean pixel step .38 against .92 before and .05–.27 elsewhere): the shadow map at a near-edge-on sun. Barely visible; on the list for stage 3.
- In October the stage garland's pendants hang among the Pet Show pennants (moved up so they clear the sign).
- The corner tree at the apartments stands 21 cm from the wall; its crown looks close to the wall from the road (it never enters it).
- The first full check's N3 run also had Finn (the fourth friend) out of the picture once at the second stop (1.62 m apart, the fallback spots); the same cause (one friend stuck behind another until the spots were dealt again); not seen in 7 runs since the fix.

## 5b. Glitches found and not fixed (stage 2)
- The photographer's dashed frame and bar sit on top of the HUD's left column on a sideways iPhone (the map and the notepad stay where they are; nothing is covered that you need during a shoot). On the list for stage 3's look.
- A person posing "Jump" leaves the ground by 35 cm; the name label jumps with them (fine) but a pet in the group stays put (pets only sit).
- In the Tree Park the decks' trees have no leaves below 5 m, so from the ground the course looks like tall poles with crowns; by design (the view from the decks stays open), stage 3's critic may ask for more.
- A dance-off watcher standing exactly on the floor's dance spot would overlap a dancer (no push-away yet).

- The check's crawl (C2b) does not ride the bus, so it never reaches the beach by playing (the same in the stage-1 full check); the beach is checked by the lines that go there directly (the kiosk, tennis, the bench seats, the signs) and by the tour stage.

## 5c. Glitches found and not fixed (stage 3)
- Open at the owner's wrap-up (18 Oct), kept on the branch claude/run-4-wip (tools/run4-wip/README.md says how to pick each up):
  - Pass 7 (S3-L): nine of its thirteen viewer batches never ran (the spend limit); its 15 kept marks are fixed (G4-160 to G4-167, G4-148) but no later pass has looked at them yet.
  - Pass 8 (S3-N): stopped after 71 of about 440 pictures, none looked at. The plan's "loop until one full pass finds nothing new" is not met.
  - Critic round 6, the last: not run. Tree park is done; the other five loops stand at their round-5 scores (section 4) and every round-5 point was fixed but not scored again.
  - Friends around you: walking round you to the front was tried and dropped (it broke N3); they walk straight to their spots. The narrower fan and the spot rules (8f65789) have not been seen by a critic yet.
  - Ducks: the new faces (bill, eyes, wings, tail; 8f65789) have not been seen by a viewer or a critic yet.
  - Clock format: every time now reads with two hour digits ("09:40 Wed", "Sleeping until 07:00"); the plan's example was "9:40 Wed". Both pass N15; which one the owner wants is open.
- See the entries marked "open" in tools/GLITCH-LIST-4.md (each says why): a little October ghost can drift right into the camera for a moment (G4-031). Two entries first left open were looked at and are not glitches: the Toy Store sign is centred on its board (perspective from near its right end made it look off; G4-061) and the "strip" on the Market floor is the stand's top between two fruit bins (G4-062).
- Set aside as not glitches, each with its reason in the list: cards and the phone covering the HUD on a 390-px-tall phone screen (a card takes the screen while it is open), the big map's hint bar over the map's bottom row (the map pans), the clock chip's weather icon during a forced weather change in the kit's pictures (the rain fades over a few seconds), the small notepad on a sideways phone (the button that opens the big pad), October ghosts drifting between you and your friends and a friend in line behind another for a moment, a pet's tag behind the brim of your own hat. The butterflies were made a quarter smaller and fly higher: three viewers and two critics read them as flat props on the grass.
- Kit v6 line rewritten (old → new): N39's end-of-round check. Old: "the end: a result card for both; view back" (P.ride null the moment the card shows). New: "the end: a result card for both; the view stays on the two dancers while the card shows; after Done the view is back for both (P.ride null, DANCE.res off, the dancer removed, the card gone)". Not weaker: it checks the same return to the normal view, one step later, and the new dancers' view in between.
- Two kit v6 helper changes (no check line changed): (1) a tap now waits for the card or phone around a button to finish popping in, and has the page draw a real frame while it waits. Old: "a button that is still popping in: wait for its animation" (only the button's own animation). Why: with the game stepped by hand the page may not draw on its own, so the phone's 0.28 s pop-up could still be at its start (40 px low) when the button was measured and finished before the finger landed; on a busy machine N13's "I want a new job" tap twice landed on empty chat (iPad in one run, sideways iPhone in the next; it passed alone). Not weaker: the tap still has to land on the button and still reports a covered button. (2) N15's sleep-screen picture waits 1 s for the sleep screen to fade in (old: the picture was taken mid-fade).
- The check's crawl (C2b) still does not ride the bus to the beach (as in stages 1 and 2); the beach is checked by the lines that go there directly.

- Run 4 finish (21 Oct): every item open at the wrap-up is done (tools/run4-wip/README.md). Left as they are, each written down:
  - Your pets keep close at your heels, so from your eyes they stand at the bottom of the screen and one can stand behind another for a moment (G4-205 in pass 8, G4-222 in pass 9). A change to where pets wait is the owner's call.
  - The salon floor softens near the camera on a big screen: each room's floor is a 256-pixel picture repeated over the room (G4-279); a bigger picture costs memory on phones.
  - The photographer's start spot stands straight in front of the family, back just far enough that everyone fits, and does not look for the background: at the pond's bench on a sideways phone the bench was mostly behind the family and a wall filled half the frame (G4-307, N25's picture in pass 17); a child turns or steps aside to frame it.
  - The last critics' points not changed (the loops ended at round 6): the photographer's result layout was centred (f6) but its job list on a sideways phone shows no part of its second row (only the screen's foot fading while there is more below, G4-263, says the list goes on: G4-285) and a photo whose background is out of view still gets five stars; the dancers' spacing, the mirror ball's height, a mark for your own dancer and a bigger result card; bigger fireworks, speech bubbles under the notepad, a ghost by the first spooky-path lamp, bigger pumpkins; the garden's front pots behind the fence (seen from outside it), the small house's shadow band and its name sign above the roof; the "Good night!" bubble under the sleep card.

## 6. NOT VERIFIED (stage 1)
- Real devices (iPad, iPhone, a PC with Safari/Chrome): everything here ran in headless Chromium at iPad, iPhone and PC sizes with a software renderer; WebKit was not installed.
- Sound (the scare sounds, the talk and pop sounds) and how the scares feel to a child.
- Two real players at once: the players stage used the kit's fake relay, not Firebase.
- The real holiday dates (the check fakes the date through realDate()).
- Device clocks that are far wrong (the server Date header offset is read on load; not tried against a wrong clock).
- The automatic update on a real GitHub Pages deploy (tested with a faked newer file).
- The 1-second load rule (N15) on a real tablet: here it is timed in headless Chromium on an idle machine.

## 6b. NOT VERIFIED (stage 2)
- Real devices and real fingers (everything ran in headless Chromium at iPad, iPhone and PC sizes with a software renderer); real pinch-zoom and real photos' look on a tablet screen.
- A real second player over Firebase for the parties and the dance-off: the check used its fake room (three test players in one check), not the live database.
- Parties across a real evening (20 real minutes) and the reminder when a friend's game is opened only after the party started (the code path is the same note; not played through for real).
- Sound in the dance-off and the parties (pops, dings and cheers; there is no music file: the game has none and the file-size rule keeps it so).
- The holiday builds on the real calendar dates (all faked through realDate()); Easter in a year other than 2026 and 2027 only by the formula.
- The Tree Park with running jumps and slow walkers (a half-pushed joystick): the check jumps at walking speed from the deck edge; a child pushing the stick half-way flies shorter and will land on the grass (and pop back up).

## 6c. NOT VERIFIED (stage 3)
- The final full check (18 Oct) was stopped by the owner after the save tests, before the walk-through (C2, C2b), the device tests (C1, C3, C4, C5 on every screen size, the teacher job T1 to T4, the PC keyboard K1) and the night-3 and run-4 lines (N1 to N41) ran on the final file: all NOT VERIFIED. The two players in the test room (D1 to D3) passed in it; two real players over the internet stay NOT VERIFIED (G). The run-4 lines last ran on the stage-3 fix builds (section 2: one N15 failed on timing alone while the photographer ran beside it and passed alone; N13, N15, N25, N26 and N34 passed on the build with the pass-7 fixes).
- Real devices (a real iPad, iPhone and PC): every picture here is from headless Chromium at the device sizes, without a colour emoji font (emoji show as boxes) and without Safari's engine.
- How it feels: smoothness on an iPad, sound, the dance game's timing with two real players over Firebase, the photographer's photos as a child frames them.
- Real holiday dates: every holiday was faked by replacing realDate() in the test copy.
- The critics are sub-agents looking at pictures, not children or parents.

- Run 4 finish: as in stage 3: real devices, sound, two real players online and Safari's engine (C1-WK) are not verified; the checks ran in headless Chromium.

## 7. Try it for real (stage 1)
- [ ] Open the game on two devices at the same time: same time of day, weekday and weather on both; the clock pill shows no day number.
- [ ] Go to bed at night: the sleep screen waits for 7:00 (Wake up gets you up earlier). Nothing is skipped.
- [ ] In October: buy a costume at the Clothes Shop, wear it, ask a friend if they see it; walk the spooky path at the Flower Corner after 18:00 (five soft scares); ghosts over the pavements.
- [ ] Find the three grandmas: two on the duck-pond bench at some point (crumbs, ducks coming), one at a shop; say hi twice (different lines).
- [ ] Without a job: the round corner map top-left; tap it, the big map opens; turn around: the arrow turns with you.
- [ ] Look at the clouds by day and night, the food truck, the leaves falling from the trees, the apartment block's wall at noon.
- [ ] Pick up a can, a cup, a paper ball and a banana peel; the pond has no bridge; ⚙️ Settings → Notepad Off/On.
- [ ] Walk with four friends and three pets, stop by a fence: all four come round in front of you, none stuck behind another.
- [ ] Read the What's new book on the title screen (7 pages).

## 7b. Try it for real (stage 2)
- [ ] Decorate to level 10 and above: the house gets a second floor (stairs in the west wall), up to six; paint the house at the pot by the door; the garden gets more pots as gardening grows.
- [ ] Change the date (or wait): February's heart fountain, the Easter eggs (find 25), the December tree with Santa's coins, New Year fireworks and hats, the school balloons on 1 Sep.
- [ ] Pet Shop: upstairs every kind in its own corner; adopt one; buy a treat downstairs.
- [ ] Buy a few of the 72 new pieces (the disco floor and ball among them) and place them; visit a friend to see theirs.
- [ ] Take the pizza and hairstylist jobs on a new save: the picture tutorials; the ❓ on the job card brings them back.
- [ ] Photographer: a booking by message, the map's dot, the 📸 spot, poses by tapping people, the background button, zoom, Snap: 5 stars when everyone is in; the photo in the chat.
- [ ] Tree Park: the gate behind the Toy Store, each path to the bell, a zip line, fall off on purpose (back on the last deck), climb down.
- [ ] Two devices: host a party at the mailbox; the other device gets the card; say yes; at the time follow the arrow, knock (the door opens by itself); with the disco floor and ball tap Dance! and play a round on both (buttons on the tablet, arrow keys on the PC); watch the bar slide.
- [ ] Read the What's new book on the title screen (7 pages).

## 7c. "Try it for real" tasks (stage 3)
- Photographer: take one booking on an iPhone held upright: do the family and the Snap! button fit? Are your pets out of the picture?
- Dance-off with a friend: are the four arrows big and clear on both your screens, right under the falling arrows?
- Tree Park: from the clearing, do you see all three signposts? Can you find the next deck by the yellow arrow? Is the bell easy to find at the finish?
- At Christmas (or by faking the date): Santa faces you and waves; the tree has lights by day; the calendar says it is Christmas month.
- House colour: drag the rainbow slider; does the "Your house now" swatch follow, and the house on Friends Lane too?
- Go up to floor 2 and higher: is it as bright as the ground floor now?
- Open the big map on a phone held sideways: the Me and zoom buttons are in the title row, off the labels; the tip at the bottom fades after a few seconds and every name on the bottom row reads.
- On a phone held sideways, open the phone: do Rosie's job cards and the calendar fit without scrolling?
- After a dance-off: does the result card show the two of you on the floor behind it, and does Done bring you back? Are your pets gone during the round?
- Scroll a long card (settings, a shop): the little ⬇ arrow sits under or beside the card, not on a button; on an upright phone in its bottom right corner.
- In October after 18:00: the purple path starts where the white stepping stones end; its little lamps glow.
- On 1 September: a red "School party today!" banner between the balloons at the school door.
- Go up and down your stairs: a mint door with a round window and an ⬆️/⬇️ plate at each end; a rug and skirting upstairs.
- Take a photo on an upright iPhone: the frame starts under the chips, the joystick is above the bar, the bar's buttons say Zoom and Pose.

- Run 4 finish, to try for real: the friends around you after you stop and after you turn round on a narrow pavement (all four faces should show: an arc, the middle two further back); feeding the ducks at the small pond (each duck swims up and looks at you); the clock chip "9:40 Wed" on a phone and a tablet at the same moment; a hair customer sitting down (no big words on their face).

## 8. How to go back
- tools/prerun4-rollback.html: made at the end of stage 3: the starting file (night 3, stamp 2026101701) with the stamp 2026101851, bigger than any stamp run 4 shipped, so putting it live makes every run-4 player's game go back by itself at the next calm moment. tools/prerun4-index.html is still the exact starting file (md5 709bf763d51be0160c118e2f9249f9f6), and reverting the pull request "Run 4, stage 1" restores main.

- Stage 2: reverting the pull request "Run 4, stage 2" puts the stage-1 file back (stamp 2026101702); tools/prerun4-index.html is still the exact starting file. The rollback copy with the bigger stamp comes at the end of stage 3.

- Stage 3: reverting the pull request "Run 4, stage 3" puts the stage-2 file back (stamp 2026101801).

- Run 4 finish: tools/prerun4-rollback.html restamped 2026102150 (above the finish's 2026102101), as before: put live as index.html, it takes every player back to the night-3 game by itself.

## 9. Decisions made alone (stage 1)
Listed per job in section 1 ("Decided alone"). The bigger ones: the one clock's epoch and day length (job 1); the automatic update at calm moments only (job 2); costumes drawn over the clothes, the spooky path at the Flower Corner with a gate (jobs 3, 4); signs centred by the pixels that show against their colour (job 5); the truck moved rather than the flower bed, the corner tree moved to the fence, the edge-on shadow rule (job 6); the corner map's tap opens the big map without a job (job 7); 80-second grandma turns anchored to the real UTC day (job 8); the bridge's own feeding spot went with it (job 9); the sideways slip for a friend or pet whose way is blocked by another, and measuring text at 48 px in main memory (stage 1 end).

## 9b. Decisions made alone (stage 2)
Listed per job in section 1 ("Decided alone"). The bigger ones: six floors at decorating 10/20/30/40/50 and the house colour from a paint pot (job 10); holidays filling their whole month and the Easter month by the formula (job 11); the Pet Shop's upstairs as a second floor like a house (job 12); the photographer's own state PHO, its bar in the run/jump corner and the dashed frame as the picture (job 15); the Tree Park as its own place a kilometre south of town with deck physics, ladders as fades and zip lines as rides (job 16); parties 20 real minutes long, the host's door opening by itself at home, the dance-off open wherever a disco floor and ball stand with two players, dancers drawn as third-person avatars (job 17); the kit's A3 line lets the four old pizza-tutorial text steps go (the owner's item 30 turned the tutorial into 5 picture steps): listed under the night-3 lines old → new.

## 9c. Decisions made alone (stage 3)
- The photographer's own mistakes (the dance panel left on screen on the phone and PC pictures, cameras put inside a passer-by or a tree, pictures taken before a 2-second check had run) were set aside before the double-checker instead of being fixed in the game, and the spots were fixed for pass 2; the list of them is kept in the kit's scratch.
- The invitation card is the party notification now (the second message behind it is gone); the kit's N39 reads the card.
- The Easter egg hunt builds for the title's town too (G4-001): the egg builder no longer assumes a loaded save.
- Name tags step apart on screen for friends and classroom kids (the football kids' rule from night 3), the Pet Show judges' tags hang at three heights.
- The room lamp light follows the floor you are on in the house (floors 2 to 6 were lit less than floor 1 because the one lamp light stayed on floor 1).
- The pavement tree in front of the Flower Corner's gate was moved 3 m west rather than removed (nothing is removed this run but the four agreed things).
- Cards and the phone covering the HUD on a 390-px-tall phone screen are left as they are: a card takes the screen while it is open; the HUD behind is dimmed and cannot be tapped.
- The Pet Shop's pen signs hang on the wall above each pen (as built in job 12); they had hung 40 m outside the room because the upstairs group's offset was added twice (G4-063). The "should look like" line said "on its fence" and now says "on the wall above it".
- The pet shop's downstairs shelves got little pastel boxes between the food models (12 triangles each, no outline shells) to look full within the agreed double of the drawing work.
- After a dance-off the view stays on the two dancers until Done (the second critic asked for it); the kit's N39 line was rewritten for it (section 5c, old → new, not weaker).
- A first-person camera cannot photograph its own party hat: the New Year pictures pose three townsfolk in front of the camera instead of a "my own hat" picture.
- The spooky path now starts where the garden's white stepping stones end (it ran beside them: a double row that two checkers read as a glitch and one as on purpose) and is 21.9 m long; its six scare spots follow it.
- The Halloween and Valentine garlands along the park's south fence now start east of the food truck (they hung across its front).
- A card that scrolls shows a soft fade over its bottom with the ⬇️ in it, inside the card (after round 5: two critics read the arrow beside or under the card as a loose button, and a row cut by the card's edge with no fade as a mistake). It never takes a tap.
- For the photographer's pictures only, following friends are sent away and townsfolk near a spot go home first (they gathered in front of the camera: a game rule, not a glitch); in the game itself only a townsperson on the line from the camera to a photo's family steps out of the shoot.
- Grandma speech bubbles and the photo families' name tags are drawn over everything (no depth test), like comic bubbles.
- The clock pads its hour to two digits everywhere ("01:30" like "22:00").
- On a sideways touch screen the joystick moves to the screen's left edge only while a photo shoot is on, so it never sits inside the photo frame; everywhere else it stays where the owner put it (300 px in, commit 0f5939f). The frame still starts right of the joystick, so on a sideways phone it is a little right of the middle: a child turns to put the family in the frame.
- The What's new book's eleven pictures were taken again with no HUD, messages or cut name tags; the second test player in them is named "Mia", not a test name.
- Two "should look like" lines were corrected to what was built and agreed, not the other way round: locked garden pots show a 🔒 level plate; the pumpkins stand by every shop door and by every house sign on Friends Lane.
- The toy phone keeps its bright screen in the dark theme (a phone's screen is lit); the cards around it go dark.
- Houses on Friends Lane with 3 to 6 floors turn a pointed front-gable roof to the street (a long side roof on a narrow tall house looked like a lid).
- Friends who follow you prefer spots that are not straight behind another friend as you look, but the 1.2 m between friends (N3) comes first: on a narrow pavement one can still stand in line with another for a moment.
- The fixed HUD (the notepad, a pet's round button, the action pill) can cover part of a shop sign or a name tag on an upright phone while you walk; it is not moved for that (it is where the thumbs and eyes expect it).
- The org's monthly spend limit stopped every sub-agent for a while during pass 7 (about 10:50 UTC): four of its thirteen viewer batches had finished (35 marks). The other nine were not resumed when sub-agents worked again, because their pictures were taken before the round-5 fixes; pass 8 took every picture again after those fixes and went to fresh viewers. The 35 marks went to fresh double-checkers as usual. The round-5 fixes were made from the critics' notes while no sub-agent could run.
- At the start of a photo shoot, and with each new background, the camera steps to a clear spot in front of the group, back just far enough that everyone fits in the frame on that screen (the fifth critic: "start the camera from a clear spot"; on an upright phone the row began cut off). You can still walk and zoom from there. The school got a name board on two tall posts right of its door for the "school sign" background (the name over the door is too high for a photo from the pavement), and a photo only gets its stars for the background when the background is in the frame.
- Passers-by stop a step before you (1.7 m when you stand on their way) and, after a moment, walk back the other way; a passer-by or a friend whose head is right at the camera is not drawn for that moment. Friends walking round you to the front was tried and dropped: it broke N3 (a friend got stuck behind a fence or between you and a pet); they walk straight as before.
- The Flower Corner gate, when open, folds back inside the garden along the fence (it swung out over the pavement and stood in front of the photo family).
- A house's little roof over its door casts no shadow (on the wall it was a dark smudge round the door); the main roof's shadow stays.
- On a floor with stairs both ways, the doorway is split: the way up on the left half, the way down on the right, each under its own plate.
- On a short sideways screen (under 500 px tall) the phone is wider (up to 72% of the screen, at most 600 px), so its words wrap into fewer lines and Rosie's job cards and the calendar's holiday line fit; on every other screen it stays as it was. A list that goes on below still ends in its soft fade.
- The big map's tip ("Tap a place to see the way there!", "That's you!") fades away after four seconds and comes back with the next tip; the card of a place you picked stays until you close it. A friend's name on the map keeps a little air from every place name and icon, and takes another side of its dot when it has none.
- On an upright phone, opening a pose card moves the camera back to the spot the shoot starts from (the one that frames the whole group), so the card sits under the people; on a sideways screen the camera stays where you stand.
- The photographer's own step back on an upright phone stops 1.5 m short of the parked bus or a car: pass 7's "camera inside a box" was the camera half a metre from the side of the Beach Bus, its windows showing straight through (G4-162, not a glitch).

- Run 4 finish: the decisions made alone are in section 1's "Run 4 finish" part ("Decisions made alone (run 4 finish)"): the kit's fixes (never weaker), the friends' arc, the toasts during a shoot, the stairs' arrow, the photo booking's words, the not-glitches with their reasons, and leaving the pets at your heels for the owner.

## 10. Firebase
No new paths and no rule changes in stage 1: everything new that others see travels in optional presence fields (v, hm.W/D, gd, lk.co), which old versions ignore.
