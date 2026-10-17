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
