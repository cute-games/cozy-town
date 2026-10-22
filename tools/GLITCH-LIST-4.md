# Glitch list, run 4 (stage 3: the GLITCH HUNTER pass)

How it was made: the PHOTOGRAPHER scripts (shots4.py and shots4b.py in the check kit's scratch) played a test copy with the fake room and ZZTEST players and took pictures of every place, every building inside, every new thing and every screen on iPad, iPhone upright and sideways and PC, light and dark, by day, at night and in rain, in October and on faked holiday dates, with two players together (the map of every picture: tools/pictures-4/stage3/map.json). The CHANGE-SPOTTER compared each with the night-3 picture of the same spot (tools/pictures-3) where one exists, and in later passes with the earlier pass's picture of the same spot. The PHOTOVIEWER (twelve fresh sub-agents, 41 pictures each) marked anything scuffed against the "should look like" lines; the DOUBLE-CHECKER (five fresh sub-agents that never saw the marks being made) kept or dropped each mark; the FIXER fixed each kept one from the root cause; the FIX-CHECKER took the next pass's picture of the same spot as the "after". The pass looped until a full pass found nothing new.

Pass 1 in numbers: 494 pictures (392 + 32 holiday and job pictures + 69 of the kit's own + the Easter retake), 486 viewed, 294 marks. 139 marks were the photographer's own mistakes and were set aside before the double-checker (the dance panel left on screen between the phone and PC pictures, a camera spot with a passer-by, a tree, a post or a wall right in front of it, a picture taken before a 2-second check had run or in an empty test room); they are listed in the kit's scratch (stage3-marks/marks-aside.txt) and the spots were fixed for pass 2. Of the 155 marks that went to the double-checker, 123 were kept and 32 dropped; the kept ones are grouped below by their cause (one glitch, many pictures).

Pass 2 in numbers: every picture again on the fixed file, 585 taken (394 + 32 holiday and job pictures + a 119-picture retake of the fixed camera spots + 40 of the kit's own after the fixes); the change-spotter compared each with pass 1's picture of the same spot and passed 418 changed or new ones to eleven viewers, who marked 162 things. 51 marks were the photographer's own mistakes and were set aside (a tree trunk at the fountain spot, the camera inside a counter or against a passer-by, a picture taken mid-fade or with the snap flash on); five double-checkers kept 87 of the other 111 and dropped 24; grouped by cause they are the entries G4-034 to G4-063 below (the second critic round's lines were fixed in the same batch).

Passes 3 to 5 in numbers: pass 3 took 475 pictures (394 + 32 holiday and job pictures + 49 of the kit's own), 383 went to eleven viewers, 244 marks, 25 set aside as the photographer's own, the double-checkers kept 175 of 219; pass 4 took 470, 407 to eleven viewers, 186 marks, 31 set aside, 103 kept of 155; pass 5 took 494 (with 4 two-phone dance pictures), 448 to twelve viewers, 227 marks, 90 set aside (the photographer's spots, the kit's staging and timing, and the cases decided in the report's section 9c), 102 kept of 137. The kept marks are grouped by cause into G4-064 to G4-159; each entry names its marks, the pass that found them and the commit that fixed the cause. Pass 6 took every picture again after the pass-5 fixes and is the "after" picture where one exists; pass 7 (after the pass-6 fixes): four of its thirteen viewer batches finished before the org's spend limit stopped the sub-agents (35 marks), and fresh double-checkers kept 15 of 23, grouped into G4-160 to G4-167. Pass 8 was stopped by the owner's wrap-up on 18 Oct after 71 pictures.

The run-4 finish (20 and 21 Oct, branch claude/run-4-finish): pass 8 again in full, then passes 9 to 19 on each fixed file (G4-168 to G4-326); from pass 20 the owner's loop rules of 21 Oct: only what changed was pictured again, five viewers each with its own focus, the kit's night3 and run4 lines in full every pass (G4-327 to G4-333); after the stop, one full picture pass (pass 23, 628 pictures; G4-334 to G4-339) and its re-checks (passes 24 and 25; G4-340, G4-341). The pictures of passes 8 to 19 stayed in the first finish session's scratch folder, which is gone: G4-168 to G4-326 have no before picture here, and the fixed ones show the full final pass's picture of the same spot as the after. Minor marks (how bad 1) still open are listed in tools/RUN-4-REPORT.md ("Leftover minor marks").

How bad: 1 small, 2 clear, 3 broken. Status: fixed / open / not a glitch.

| ID | place | device | what's wrong | how bad | picture | status |
|---|---|---|---|---|---|---|
| G4-001 | the Flower Corner in the Easter month, when the game is opened | every device | Opening the game in April (the Easter month): the title's town is decorated before any save is read, and the egg hunt's builder read the save (eggState) and threw; the error was caught, but the build had stopped halfway: no eggs drawn and no Easter Bunny at the corner until the date changed. Root cause: eggState assumed a loaded save. | 3 | [before](pictures-4/stage3-glitches/G4-001-before.webp) · [after](pictures-4/stage3-glitches/G4-001-after.webp) | fixed |
| G4-002 | the photographer job: the shoot | every device | The player's own pets (and following friends) walked into every photo: they stood between the camera and the family with their big name tags, and ended up in the finished picture. (viewer marks M-013, M-043, M-110, M-113, M-121, M-129, M-131) | 2 | [before](pictures-4/stage3-glitches/G4-002-before.webp) · [after](pictures-4/stage3-glitches/G4-002-after.webp) | fixed |
| G4-003 | the photographer job: the viewfinder frame | every device, worst on iPhone sideways | The dashed frame was drawn over the HUD: through the coin, apple and clock chips (they looked struck out), the corner map, the job box and the notepad. (viewer marks M-044, M-073, M-075, M-078, M-107, M-108, M-112, M-120, M-122, M-123, M-128, M-130, M-132) | 2 | [before](pictures-4/stage3-glitches/G4-003-before.webp) · [after](pictures-4/stage3-glitches/G4-003-after.webp) | fixed |
| G4-004 | the photographer job: the pose card | iPad and phones sideways | The pose card opened in the middle-bottom and covered the photo bar (the 🏞️ background chip and the − button) and, on a phone, the hint and the Snap! button. (viewer marks M-012, M-042, M-074) | 2 | [before](pictures-4/stage3-glitches/G4-004-before.webp) · [after](pictures-4/stage3-glitches/G4-004-after.webp) | fixed |
| G4-005 | the photographer job: the result card | every device, worst on iPhone sideways | The photo bar, the frame and the job box stayed on screen behind the result card, and on a short screen the card's '📸 Mia' name tab was pushed off the top. (viewer marks M-015, M-045, M-076, M-111) | 2 | [before](pictures-4/stage3-glitches/G4-005-before.webp) · [after](pictures-4/stage3-glitches/G4-005-after.webp) | fixed |
| G4-006 | the photographer job on an upright phone | iPhone upright | The photo bar was 192 px wide ('the fou…'), the notepad and the job box covered a family member, and the hint toast sat on the family's heads. (viewer marks M-054, M-063, M-055, M-062, M-109) | 2 | [before](pictures-4/stage3-glitches/G4-006-before.webp) · [after](pictures-4/stage3-glitches/G4-006-after.webp) | fixed |
| G4-007 | the photographer job on an upright phone: the pose step | iPhone upright | The hint toast cut the corner map's palette badge in half. (viewer marks M-061) | 1 | [before](pictures-4/stage3-glitches/G4-007-before.webp) · [after](pictures-4/stage3-glitches/G4-007-after.webp) | fixed |
| G4-008 | the party invitation | every device | The invitation came twice at once: a message card ('…is hosting a party! Go check it out.') and the card with the two buttons on top of it, the message cut on both sides. (viewer marks M-011, M-041, M-069, M-106, M-119, M-127) | 2 | [before](pictures-4/stage3-glitches/G4-008-before.webp) · [after](pictures-4/stage3-glitches/G4-008-after.webp) | fixed |
| G4-009 | the party invitation and the dance-off card | iPhone upright | The cards sat over the apple chip, the clock chip and the corner map. (viewer marks M-052, M-053) | 1 | [before](pictures-4/stage3-glitches/G4-009-before.webp) · [after](pictures-4/stage3-glitches/G4-009-after.webp) | fixed |
| G4-010 | the dance-off | iPhone upright | The score bar sat on the apple chip. (viewer marks M-064) | 1 | [before](pictures-4/stage3-glitches/G4-010-before.webp) · [after](pictures-4/stage3-glitches/G4-010-after.webp) | fixed |
| G4-011 | the house colour card: 'Pick any colour' | every device | The slider was a plain blue browser slider with a 14 px thumb and nothing showed the colour the house has now. (viewer marks M-050, M-118) | 2 | [before](pictures-4/stage3-glitches/G4-011-before.webp) · [after](pictures-4/stage3-glitches/G4-011-after.webp) | fixed |
| G4-012 | the cards' scroll-down arrow | every device | The little ⬇ arrow of a long card was 38 px, sat half outside the card's right edge over the mint ⬆ button, and on the settings card on top of the 'Bring my pets to…' button. (viewer marks M-036, M-037, M-038, M-040, M-068, M-097, M-099, M-101, M-103, M-105, M-049, M-060) | 1 | [before](pictures-4/stage3-glitches/G4-012-before.webp) · [after](pictures-4/stage3-glitches/G4-012-after.webp) | fixed |
| G4-013 | the phone: Rosie's chat and job list | every device | The chat header (back button, Rosie, the coin chip) scrolled away under the phone's top when the chat was long, its top cut. (viewer marks M-006, M-035, M-047, M-057, M-087, M-115, M-126) | 1 | [before](pictures-4/stage3-glitches/G4-013-before.webp) · [after](pictures-4/stage3-glitches/G4-013-after.webp) | fixed |
| G4-014 | the phone: Rosie's job cards | phones | The job descriptions were 11 px on a narrow screen. (viewer marks M-058) | 1 | [before](pictures-4/stage3-glitches/G4-014-before.webp) · [after](pictures-4/stage3-glitches/G4-014-after.webp) | fixed |
| G4-015 | the big map | iPhone sideways | The 📍 Me, + and − buttons sat on the map and cut the Duck Pond and Tree Park labels. (viewer marks M-066, M-094) | 2 | [before](pictures-4/stage3-glitches/G4-015-before.webp) · [after](pictures-4/stage3-glitches/G4-015-after.webp) | fixed |
| G4-016 | the big map | iPhone sideways | The 'Tap a place to see the way there!' bar lies over the bottom row of the map. (viewer marks M-095) | 1 | [before](pictures-4/stage3-glitches/G4-016-before.webp) · [after](pictures-4/stage3-glitches/G4-016-after.webp) | not a glitch |
| G4-017 | the Pet Show stage | every device | A balloon bunch stood in front of the stage's sign: 'Every Saturday!' read 'Saturda' or 'Saturday!' and the trophy was half hidden. (viewer marks M-017, M-018, M-019, M-021, M-023, M-025, M-046) | 1 | [before](pictures-4/stage3-glitches/G4-017-before.webp) · [after](pictures-4/stage3-glitches/G4-017-after.webp) | fixed |
| G4-018 | the Pet Show judges | every device | The three judges' name tags sat at one height in a row and piled up into one unreadable jumble from the square. (viewer marks M-014, M-016, M-020, M-022, M-024) | 1 | [before](pictures-4/stage3-glitches/G4-018-before.webp) · [after](pictures-4/stage3-glitches/G4-018-after.webp) | fixed |
| G4-019 | the Pet Show corner: bunting | every device | The Halloween bunting pennants and the stage pennants were paper-thin: seen edge-on they looked like flat slivers floating over the food truck and sticking out of the stage posts. (viewer marks M-001, M-124) | 2 | [before](pictures-4/stage3-glitches/G4-019-before.webp) · [after](pictures-4/stage3-glitches/G4-019-after.webp) | fixed |
| G4-020 | the grandmas' speech bubbles | every device, worst on phones | A grandma's bubble sat right behind her head: her bun or hair hid a word, and on a phone the letters were 7 px. (viewer marks M-002, M-125, M-134, M-135, M-080) | 2 | [before](pictures-4/stage3-glitches/G4-020-before.webp) · [after](pictures-4/stage3-glitches/G4-020-after.webp) | fixed |
| G4-021 | the Tree Park: the tall trees | every device | A crown seen from its shady side was a flat muddy olive, like a dead tree among the bright ones. (viewer marks M-003, M-027) | 1 | [before](pictures-4/stage3-glitches/G4-021-before.webp) · [after](pictures-4/stage3-glitches/G4-021-after.webp) | fixed |
| G4-022 | inside the fire station | every device | The fire bell was a yellow ball floating beside the sign with nothing holding it. (viewer marks M-004, M-032) | 2 | [before](pictures-4/stage3-glitches/G4-022-before.webp) · [after](pictures-4/stage3-glitches/G4-022-after.webp) | fixed |
| G4-023 | the Pet Shop upstairs | every device | The button said 'Adopt a owl'. (viewer marks M-005) | 1 | [before](pictures-4/stage3-glitches/G4-023-before.webp) · [after](pictures-4/stage3-glitches/G4-023-after.webp) | fixed |
| G4-024 | the library | every device | A slit of bare wall showed between the two middle bookcases. (viewer marks M-030) | 1 | [before](pictures-4/stage3-glitches/G4-024-before.webp) · [after](pictures-4/stage3-glitches/G4-024-after.webp) | fixed |
| G4-025 | my house, the upper floors | every device | The back-wall windows of floors 2 to 6 were unevenly spaced. (viewer marks M-033) | 1 | [before](pictures-4/stage3-glitches/G4-025-before.webp) · [after](pictures-4/stage3-glitches/G4-025-after.webp) | fixed |
| G4-026 | the Flower Corner gate | every device | A pavement tree stood right in front of the open gate and hid it and the start of the stepping stones. (viewer marks M-079, M-136) | 2 | [before](pictures-4/stage3-glitches/G4-026-before.webp) · [after](pictures-4/stage3-glitches/G4-026-after.webp) | fixed |
| G4-027 | the classroom | iPad | A kid's name tag covered the tag of the kid behind. (viewer marks M-139) | 2 | [before](pictures-4/stage3-glitches/G4-027-before.webp) | fixed |
| G4-028 | the friends who follow you | every device | When the four friends gathered, one stood behind another and the front one's tag covered the other's. (viewer marks M-142, M-144, M-145) | 2 | [before](pictures-4/stage3-glitches/G4-028-before.webp) | fixed |
| G4-029 | the designer job: the new-client message | iPad | The '+20 🪙' coin pop and the 'Knock knock!' card landed on the message card and hid its lines. (viewer marks M-140, M-141) | 2 | [before](pictures-4/stage3-glitches/G4-029-before.webp) | fixed |
| G4-030 | the spooky path: a scare | iPad | The 'BOO! 👻' words floated 2.1 m up, above the top of the screen when the ghost was close. (viewer marks M-155) | 2 | [before](pictures-4/stage3-glitches/G4-030-before.webp) | fixed |
| G4-031 | October: the little ghosts | iPad | A little ghost drifted right into the camera and filled a third of the view for a moment. (viewer marks M-143) | 1 | [before](pictures-4/stage3-glitches/G4-031-before.webp) | fixed |
| G4-032 | the park by the food truck | iPad | Flat yellow bars seemed to stick out of the truck's wheels. (viewer marks M-147) | 1 | [before](pictures-4/stage3-glitches/G4-032-before.webp) | not a glitch |
| G4-033 | cards and the phone on a short screen | iPhone sideways (and the Pet Shop card on iPad) | A tall card, a tutorial card or the phone covers the HUD chips and buttons behind it. (viewer marks M-039, M-067, M-070, M-071, M-072, M-084, M-085, M-086, M-088, M-089, M-090, M-091, M-092, M-093, M-096, M-098, M-100, M-102, M-104) | 1 | [before](pictures-4/stage3-glitches/G4-033-before.webp) · [after](pictures-4/stage3-glitches/G4-033-after.webp) | not a glitch |
| G4-034 | the cards' scroll-down arrow | every device | The ⬇ arrow of a long card sat on the card's bottom edge and still covered the end of the last visible row: 'Move my ga…', 'Show me the ti…', 'Bring my pets to me', the end of the colour slider, a shop tile's price. (viewer marks M-007, M-011, M-028, M-035, M-058, M-060, M-066, M-067, M-070, M-074, M-075, M-076, M-077, M-086 of pass 2) | 2 | [before](pictures-4/stage3-glitches/G4-034-before.webp) · [after](pictures-4/stage3-glitches/G4-034-after.webp) | fixed |
| G4-035 | the phone: Rosie's chat and the job list | every device | Earlier bubbles and job cards scrolled under the chat header and showed through it (it was 94% white) and beside it; a long title ('Photo booking') was cut without an ellipsis. (viewer marks M-006, M-010, M-027, M-034, M-049, M-065, M-069, M-073, M-105 of pass 2) | 2 | [before](pictures-4/stage3-glitches/G4-035-before.webp) · [after](pictures-4/stage3-glitches/G4-035-after.webp) | fixed |
| G4-036 | the party invitation and the dance-off card | iPhone upright | The cards were drawn over the corner map and the top of the notepad: a sliver of map and "Write here!" poked out at their edges. (viewer marks M-013, M-014, M-037, M-038 of pass 2) | 2 | [before](pictures-4/stage3-glitches/G4-036-before.webp) · [after](pictures-4/stage3-glitches/G4-036-after.webp) | fixed |
| G4-037 | the photographer job: the frame | iPhone upright | The dashed frame ran straight through the apple chip and down the side of the chips. (viewer marks M-016, M-017, M-040, M-041 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-037-before.webp) · [after](pictures-4/stage3-glitches/G4-037-after.webp) | fixed |
| G4-038 | the photographer job: the joystick | iPhone upright | The joystick ring sat under the photo bar (the bar spans the width on an upright phone), so a child could not walk to frame the photo. (viewer marks M-018, M-106 of pass 2) | 2 | [before](pictures-4/stage3-glitches/G4-038-before.webp) · [after](pictures-4/stage3-glitches/G4-038-after.webp) | fixed |
| G4-039 | the photographer job: the pose card | iPhone sideways | The pose card was taller than the screen: the Hug and Sit tiles ran off the bottom with no scroll hint. (viewer marks M-061, M-068 of pass 2) | 2 | [before](pictures-4/stage3-glitches/G4-039-before.webp) · [after](pictures-4/stage3-glitches/G4-039-after.webp) | fixed |
| G4-040 | the photographer job: the result card | iPhone sideways and upright | The result card ran off the bottom of a sideways phone (the Bye! button on the edge); on an upright phone the '+120 🪙' pop was half behind the card; in the kit's pictures the '🏞️ the hedge' toast was still drawn over the card. (viewer marks M-063, M-042, M-109 of pass 2) | 2 | [before](pictures-4/stage3-glitches/G4-040-before.webp) · [after](pictures-4/stage3-glitches/G4-040-after.webp) | fixed |
| G4-041 | the phone on a short screen | iPhone sideways | The dimmed clock chip and the chat button peeked out above the phone's top edge. (viewer marks M-047, M-048, M-050, M-051, M-052, M-053, M-054, M-055, M-056 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-041-before.webp) · [after](pictures-4/stage3-glitches/G4-041-after.webp) | fixed |
| G4-042 | the park: the food truck | every device | The Halloween bunting (and the Valentine garland) hung across the front of the food truck: its pennants looked stuck to the truck's body, 'pink and yellow slivers and a purple one across the wheel'. (viewer marks M-021, M-079, M-090, M-096 of pass 2) | 2 | [before](pictures-4/stage3-glitches/G4-042-before.webp) · [after](pictures-4/stage3-glitches/G4-042-after.webp) | fixed |
| G4-043 | the Flower Corner in October | every device | The spooky path's purple discs ran beside the garden's white stepping stones for the first 6 m: a double row, 'floating stones'. (viewer marks M-043, M-064 of pass 2) | 2 | [before](pictures-4/stage3-glitches/G4-043-before.webp) · [after](pictures-4/stage3-glitches/G4-043-after.webp) | fixed |
| G4-044 | the spooky path at night | iPad | The little path lamps were plain dark cubes with no glow after 18:00. (viewer marks M-084 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-044-before.webp) · [after](pictures-4/stage3-glitches/G4-044-after.webp) | fixed |
| G4-045 | the Easter hunt eggs | every device | A plain white ball (meant as a shine) bulged out of the egg between its two gold bands. (viewer marks M-080 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-045-before.webp) · [after](pictures-4/stage3-glitches/G4-045-after.webp) | fixed |
| G4-046 | the Christmas tree at night | iPad | The tree's night glows sat inside the branches, so they showed as bright yellow, cyan and pink chevron slivers poking out of the lower branches. (viewer marks M-081, M-088 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-046-before.webp) · [after](pictures-4/stage3-glitches/G4-046-after.webp) | fixed |
| G4-047 | inside the fire station | every device | The 'Fire Station' sign's right end lay over the bell's red plate. (viewer marks M-004, M-026 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-047-before.webp) · [after](pictures-4/stage3-glitches/G4-047-after.webp) | fixed |
| G4-048 | the grandmas' speech bubbles | iPad | A grandma's own head still covered the middle of her bubble from a low angle. (viewer marks M-032 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-048-before.webp) · [after](pictures-4/stage3-glitches/G4-048-after.webp) | fixed |
| G4-049 | the photographer job: the shoot | every device | A passer-by walked between the camera and the family and hid them. (viewer marks M-008 of pass 2) | 2 | [before](pictures-4/stage3-glitches/G4-049-before.webp) · [after](pictures-4/stage3-glitches/G4-049-after.webp) | fixed |
| G4-050 | the kit's own pictures (N25 and N37) | iPad and iPhone sideways | The kit took its result picture while the snap flash was on (washed out) and its Tree Park pictures mid-fade (a dark veil). (viewer marks M-104, M-108, M-111, M-092, M-093 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-050-before.webp) · [after](pictures-4/stage3-glitches/G4-050-after.webp) | fixed |
| G4-051 | the photographer job: the bus pill | iPhone sideways and PC | The 'Next bus' pill sat across the frame's top-left corner. (viewer marks M-107, M-110 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-051-before.webp) · [after](pictures-4/stage3-glitches/G4-051-after.webp) | fixed |
| G4-052 | the Pet Shop's 'New in' tiles | iPhone upright | The colour dot of a long name wrapped onto a line of its own. (viewer marks M-036 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-052-before.webp) · [after](pictures-4/stage3-glitches/G4-052-after.webp) | fixed |
| G4-053 | settings | iPhone upright | 'Fast' wrapped alone under 'Slow' and the 'Show me the tips' buttons broke into two lines. (viewer marks M-012 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-053-before.webp) · [after](pictures-4/stage3-glitches/G4-053-after.webp) | fixed |
| G4-054 | the park: the butterflies and the stage pennants | every device | The park's butterflies flying low over the grass read as flat shards or 'two red sheets' dropped by the stage; the stage's end pennants stuck out past its posts. (viewer marks M-001, M-071, M-078 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-054-before.webp) · [after](pictures-4/stage3-glitches/G4-054-after.webp) | fixed |
| G4-055 | the photographer (not the game) | iPad, iPhone upright | Two camera spots were bad: the bakery spot stood inside the counter, the dance-card spot was left wherever the previous picture ended (against a fence). (viewer marks M-003, M-015 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-055-before.webp) · [after](pictures-4/stage3-glitches/G4-055-after.webp) | not a glitch |
| G4-056 | the clock chip in the kit's pictures | iPad | The chip said ☀️ while rain streaks fell, 🌧️ under a clear sky, and ☀️ 10:00 at dusk. (viewer marks M-091, M-095, M-097 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-056-before.webp) · [after](pictures-4/stage3-glitches/G4-056-after.webp) | not a glitch |
| G4-057 | the notepad on a sideways phone | iPhone sideways | The small notepad is 104 × 68 px there and its 'Write here!' hint about 11 px. (viewer marks M-098 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-057-before.webp) | not a glitch |
| G4-058 | the friends who follow you, in October | iPad | Halloween ghosts drifted between the camera and the friends and hid one; one friend stood in line behind another. (viewer marks M-101, M-102 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-058-before.webp) · [after](pictures-4/stage3-glitches/G4-058-after.webp) | not a glitch |
| G4-059 | a pet's name tag | iPad | The 'Waffles' tag was partly behind the witch hat's pompom of the player's own costume. (viewer marks M-083 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-059-before.webp) · [after](pictures-4/stage3-glitches/G4-059-after.webp) | not a glitch |
| G4-061 | the Toy Store's sign | PC | '🧸 Toy Store' seemed to sit left of the middle of its long white board. (viewer marks M-072 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-061-before.webp) · [after](pictures-4/stage3-glitches/G4-061-after.webp) | not a glitch |
| G4-062 | inside the Market | iPhone upright | An orange strip with a crisp dark edge seemed to run down the floor from the player. (viewer marks M-046 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-062-before.webp) · [after](pictures-4/stage3-glitches/G4-062-after.webp) | not a glitch |
| G4-063 | the Pet Shop upstairs | every device | No pen had its name sign: the wall above the dog, cat, bunny and capybara pens was bare, and the hamsters had no sign either. (viewer marks M-005 of pass 2) | 2 | [before](pictures-4/stage3-glitches/G4-063-before.webp) · [after](pictures-4/stage3-glitches/G4-063-after.webp) | fixed |
| G4-060 | cards over the HUD | iPad, iPhone sideways | The Clothing store card covered the time chip; the big map's 'Tap a place' bar lies over the bottom row of the map. (viewer marks M-085, M-099 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-060-before.webp) · [after](pictures-4/stage3-glitches/G4-060-after.webp) | not a glitch |
| G4-064 | the bus stop at the park | iPad | The bus stop's pole ran up across the front of its round sign and put a dark line through the bus picture. (viewer marks M-005 (pass 3), M-006 (pass 3), M-007 (pass 3), M-008 (pass 3), M-010 (pass 3), M-012 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-064-before.webp) · [after](pictures-4/stage3-glitches/G4-064-after.webp) | fixed |
| G4-065 | the party invitation and the dance-off card | iPad, iPhone | The two answer buttons ("✅ I'll come!" / "🙅 Not this time", "💃 Let's dance!" / "🙅 Not now") touched, with no gap, so it was easy to tap the wrong one. (viewer marks M-009 (pass 3), M-011 (pass 3), M-094 (pass 3), M-095 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-065-before.webp) · [after](pictures-4/stage3-glitches/G4-065-after.webp) | fixed |
| G4-066 | the hairstylist tutorial | every device | In the tutorial picture the 👉 hand under the door pointed at empty space, not at the chair or the customer. (viewer marks M-013 (pass 3), M-098 (pass 3), M-163 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-066-before.webp) · [after](pictures-4/stage3-glitches/G4-066-after.webp) | fixed |
| G4-067 | the photographer tutorial | every device | The booking line "family photo · the fountain" was squeezed against the 📸 icon and nearly touched the right border. (viewer marks M-014 (pass 3), M-100 (pass 3), M-165 (pass 3), M-025 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-067-before.webp) · [after](pictures-4/stage3-glitches/G4-067-after.webp) | fixed |
| G4-068 | the photographer's pose card | iPad, iPhone sideways | The "Pick a pose" card covered one of the people being posed (Mia in pass 3; Zoe from the eyes down in passes 4 and 5). (viewer marks M-015 (pass 3), M-038 (pass 3), M-102 (pass 3), M-013 (pass 4), M-031 (pass 4), M-009 (pass 5), M-023 (pass 5), M-050 (pass 5), M-068 (pass 5)) | 2 | [before](pictures-4/stage3-glitches/G4-068-before.webp) · [after](pictures-4/stage3-glitches/G4-068-after.webp) | fixed |
| G4-069 | the photo frame | iPad, PC | The dashed photo frame ran under the round 💬📱🎒⚙️ buttons; the ⚙️ button hid its corner. (viewer marks M-016 (pass 3), M-018 (pass 3), M-166 (pass 3), M-167 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-069-before.webp) · [after](pictures-4/stage3-glitches/G4-069-after.webp) | fixed |
| G4-070 | a photo shoot | iPad | The three posing people stood so close that their waving arms went into the next person's head. (viewer marks M-017 (pass 3)) | 2 | [before](pictures-4/stage3-glitches/G4-070-before.webp) · [after](pictures-4/stage3-glitches/G4-070-after.webp) | fixed |
| G4-071 | the Pet Show stage | iPad, PC | The yellow "🏆 Pet Show" board ran behind the right red pillar, so its last letter touched the pillar. (viewer marks M-020 (pass 3), M-025 (pass 3), M-029 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-071-before.webp) · [after](pictures-4/stage3-glitches/G4-071-after.webp) | fixed |
| G4-072 | the Toy Store window | iPad | A thin dashed vertical line ran down the big right window just inside its edge (and down the pink corner post), at night and in rain. (viewer marks M-021 (pass 3), M-023 (pass 3), M-025 (pass 5), M-026 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-072-before.webp) · [after](pictures-4/stage3-glitches/G4-072-after.webp) | fixed |
| G4-073 | the Tree Park gate | iPad | The earth path stopped at the gate posts and a tree trunk stood in the middle of the gateway. (viewer marks M-026 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-073-before.webp) · [after](pictures-4/stage3-glitches/G4-073-after.webp) | fixed |
| G4-074 | a shopper in the Café | iPad | On the orange-haired shopper the bob's hem band covered the cheeks down to the mouth. (viewer marks M-027 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-074-before.webp) · [after](pictures-4/stage3-glitches/G4-074-after.webp) | fixed |
| G4-075 | the Clothes Shop | iPad | Under the clothes racks the back wall had blurry grey streaks, like dirt. (viewer marks M-028 (pass 3), M-010 (pass 3)) | 2 | [before](pictures-4/stage3-glitches/G4-075-before.webp) · [after](pictures-4/stage3-glitches/G4-075-after.webp) | fixed |
| G4-076 | cards over the clock chip | iPad, PC | An open card (bag, settings, a shop, the costumes) covered most of the weather/time chip; only its icon poked out. (viewer marks M-033 (pass 3), M-035 (pass 3), M-036 (pass 3), M-037 (pass 3), M-155 (pass 3), M-156 (pass 3), M-157 (pass 3), M-158 (pass 3), M-182 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-076-before.webp) · [after](pictures-4/stage3-glitches/G4-076-after.webp) | not a glitch |
| G4-077 | the phone | iPhone | The phone frame's bottom edge lay over the joystick and the run and jump buttons, which poked out from under it. (viewer marks M-039 (pass 3), M-040 (pass 3), M-041 (pass 3), M-042 (pass 3), M-043 (pass 3), M-044 (pass 3), M-045 (pass 3), M-046 (pass 3), M-047 (pass 3), M-076 (pass 3), M-077 (pass 3), M-078 (pass 3), M-079 (pass 3), M-080 (pass 3), M-081 (pass 3), M-082 (pass 3), M-083 (pass 3), M-084 (pass 3), M-113 (pass 3), M-114 (pass 3), M-116 (pass 3), M-117 (pass 3), M-119 (pass 3), M-120 (pass 3), M-121 (pass 3), M-122 (pass 3), M-124 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-077-before.webp) · [after](pictures-4/stage3-glitches/G4-077-after.webp) | fixed |
| G4-078 | a long card's scroll arrow | iPhone sideways | The card's ⬇️ scroll arrow sat on top of the big ⬆️ jump button. (viewer marks M-127 (pass 3), M-129 (pass 3), M-131 (pass 3), M-133 (pass 3), M-136 (pass 3), M-142 (pass 3), M-143 (pass 3), M-144 (pass 3), M-146 (pass 3), M-147 (pass 3)) | 2 | [before](pictures-4/stage3-glitches/G4-078-before.webp) · [after](pictures-4/stage3-glitches/G4-078-after.webp) | fixed |
| G4-079 | a long card's scroll arrow | iPhone upright | The round ⬇️ arrow sat on the last row of a tall card: on "🐾 Bring my pets to…", then on "📦 Move my game" (cut to "Move my ga") and on a shop tile's corner. (viewer marks M-048 (pass 3), M-088 (pass 3), M-091 (pass 3), M-060 (pass 4), M-028 (pass 5), M-037 (pass 5)) | 2 | [before](pictures-4/stage3-glitches/G4-079-before.webp) · [after](pictures-4/stage3-glitches/G4-079-after.webp) | fixed |
| G4-080 | the pose card | iPhone sideways | The ⬇️ arrow sat on the bottom-right corner of the "Jump" tile. (viewer marks M-079 (pass 4), M-097 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-080-before.webp) · [after](pictures-4/stage3-glitches/G4-080-after.webp) | fixed |
| G4-081 | the big map | PC | The ⬇️ arrow sat on the last row of the place list, over "Beach" and "Bus stop". (viewer marks M-106 (pass 4), M-113 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-081-before.webp) · [after](pictures-4/stage3-glitches/G4-081-after.webp) | fixed |
| G4-082 | cards on a phone | iPhone | A card cut HUD pieces in half: the corner map under its top edge, the round buttons poking above it, the joystick under its bottom edge. (viewer marks M-052 (pass 3), M-057 (pass 3), M-058 (pass 3), M-059 (pass 3), M-086 (pass 3), M-087 (pass 3), M-089 (pass 3), M-090 (pass 3), M-092 (pass 3), M-093 (pass 3), M-096 (pass 3), M-097 (pass 3), M-099 (pass 3), M-128 (pass 3), M-130 (pass 3), M-132 (pass 3), M-134 (pass 3), M-135 (pass 3), M-139 (pass 3), M-148 (pass 3), M-149 (pass 3), M-150 (pass 3), M-152 (pass 3), M-095 (pass 4), M-096 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-082-before.webp) · [after](pictures-4/stage3-glitches/G4-082-after.webp) | fixed |
| G4-083 | party and holiday garlands | iPhone, PC | The garland string was a staircase of separate pieces and the flags hung 10 px below it, joined to nothing. (viewer marks M-053 (pass 3), M-054 (pass 3), M-055 (pass 3), M-056 (pass 3), M-020 (pass 3), M-021 (pass 3), M-022 (pass 3), M-023 (pass 3), M-024 (pass 3), M-031 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-083-before.webp) · [after](pictures-4/stage3-glitches/G4-083-after.webp) | fixed |
| G4-084 | the pose card | iPhone | The photo bar behind the card showed as dark rims around its bottom edge. (viewer marks M-060 (pass 3), M-101 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-084-before.webp) · [after](pictures-4/stage3-glitches/G4-084-after.webp) | fixed |
| G4-085 | a photo shoot | iPhone | The joystick ring sat inside the photo frame, over the family's legs. (viewer marks M-062 (pass 3), M-103 (pass 3), M-138 (pass 3), M-151 (pass 3), M-080 (pass 4), M-082 (pass 4), M-098 (pass 4), M-101 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-085-before.webp) · [after](pictures-4/stage3-glitches/G4-085-after.webp) | fixed |
| G4-086 | a photo shoot | every device | The white aim dot sat on Leo's forehead. (viewer marks M-063 (pass 3), M-104 (pass 3), M-168 (pass 3), M-028 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-086-before.webp) · [after](pictures-4/stage3-glitches/G4-086-after.webp) | fixed |
| G4-087 | the photo result | iPhone | The "+120 🪙" pop overlapped the 💬 and 📱 buttons. (viewer marks M-065 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-087-before.webp) · [after](pictures-4/stage3-glitches/G4-087-after.webp) | fixed |
| G4-088 | sun shadows | iPad | Faint stripes and saw-tooth edges in the sun's shadows: on the fountain basin's side, under window sills and eaves, on the tree crowns at the Tree Park. (viewer marks M-066 (pass 3), M-001 (pass 3), M-004 (pass 3), M-006 (pass 3), M-001 (pass 5), M-003 (pass 5), M-004 (pass 5), M-013 (pass 5), M-014 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-088-before.webp) · [after](pictures-4/stage3-glitches/G4-088-after.webp) | open |
| G4-089 | the Flower Corner in October | iPhone | The purple path patches showed as broken purple dashes on the grass. (viewer marks M-069 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-089-before.webp) · [after](pictures-4/stage3-glitches/G4-089-after.webp) | fixed |
| G4-090 | the shop ceiling lamp | iPhone, iPad | Seen from below near the door the lamp showed as black wedges (its outline shell); without the outline (9777d26) it read as a faint, see-through smudge on the cream ceiling. (viewer marks M-072 (pass 3), M-073 (pass 3), M-075 (pass 3), M-109 (pass 3), M-111 (pass 3), M-056 (pass 4), M-057 (pass 4), M-073 (pass 4), M-074 (pass 4), M-016 (pass 5), M-032 (pass 5), M-033 (pass 5), M-035 (pass 5), M-043 (pass 5), M-044 (pass 5), M-045 (pass 5)) | 2 | [before](pictures-4/stage3-glitches/G4-090-before.webp) · [after](pictures-4/stage3-glitches/G4-090-after.webp) | fixed |
| G4-091 | the phone: Rosie's chat | iPhone sideways, PC | Earlier messages and job cards scrolled up under the floating chat header and showed cut in half above it. (viewer marks M-115 (pass 3), M-140 (pass 3), M-153 (pass 3), M-033 (pass 3)) | 2 | [before](pictures-4/stage3-glitches/G4-091-before.webp) · [after](pictures-4/stage3-glitches/G4-091-after.webp) | fixed |
| G4-092 | the big map | iPhone sideways | The "Duck Pond" label ran over Finn's name tag. (viewer marks M-125 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-092-before.webp) · [after](pictures-4/stage3-glitches/G4-092-after.webp) | not a glitch |
| G4-093 | the big map | iPhone | The "👆 Tap a place…" bar lay over the bottom row of places (Cozy Park, Pet Shop, Football Field). (viewer marks M-141 (pass 3), M-059 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-093-before.webp) · [after](pictures-4/stage3-glitches/G4-093-after.webp) | fixed |
| G4-094 | the Pet Shop card | iPhone sideways | "Mint dog house" wrapped its colour dot onto a line of its own, so its price sat lower than its neighbours'. (viewer marks M-145 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-094-before.webp) · [after](pictures-4/stage3-glitches/G4-094-after.webp) | fixed |
| G4-095 | the party, dance and tutorial cards | PC | These cards stayed bright white in the dark theme while every other card went dark. (viewer marks M-159 (pass 3), M-160 (pass 3), M-161 (pass 3), M-162 (pass 3), M-164 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-095-before.webp) · [after](pictures-4/stage3-glitches/G4-095-after.webp) | fixed |
| G4-096 | a photo shoot | iPhone sideways | The "📸 Pose everyone…" hint sat in the middle of the frame over the heads and name tags (and on the − / + Zoom buttons). (viewer marks M-137 (pass 3), M-081 (pass 4), M-100 (pass 4), M-150 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-096-before.webp) · [after](pictures-4/stage3-glitches/G4-096-after.webp) | fixed |
| G4-097 | the big map | PC | The pink "📍 Me" pill and the + button sat on a place and its name. (viewer marks M-154 (pass 3), M-034 (pass 3)) | 2 | [before](pictures-4/stage3-glitches/G4-097-before.webp) · [after](pictures-4/stage3-glitches/G4-097-after.webp) | fixed |
| G4-098 | pumpkins in October | PC | No pumpkin at the Hair Salon door or at two houses' doors, though the "should look like" line said "at every door". (viewer marks M-170 (pass 3), M-171 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-098-before.webp) · [after](pictures-4/stage3-glitches/G4-098-after.webp) | fixed |
| G4-099 | Santa | iPad | Santa stood side-on and never turned to you, so his face could not be seen while he talked. (viewer marks M-172 (pass 3), M-173 (pass 3)) | 2 | [before](pictures-4/stage3-glitches/G4-099-before.webp) · [after](pictures-4/stage3-glitches/G4-099-after.webp) | fixed |
| G4-100 | Santa by the tree | iPad | Santa stood half inside the tree's bottom layer, a tree light on his beard. (viewer marks M-175 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-100-before.webp) · [after](pictures-4/stage3-glitches/G4-100-after.webp) | fixed |
| G4-101 | the big oak by the Ideas Board | iPad | On New Year's Eve the big round tree behind the bus stop was summer green while every other tree was snowy. (viewer marks M-176 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-101-before.webp) · [after](pictures-4/stage3-glitches/G4-101-after.webp) | fixed |
| G4-102 | the school party | iPad | A yellow plate over the door poked through the red "School party today!" banner. (viewer marks M-178 (pass 3)) | 2 | [before](pictures-4/stage3-glitches/G4-102-before.webp) · [after](pictures-4/stage3-glitches/G4-102-after.webp) | fixed |
| G4-103 | a pet's party hat | iPad | Waffles' party-hat pompom was drawn over his own name tag. (viewer marks M-179 (pass 3), M-121 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-103-before.webp) · [after](pictures-4/stage3-glitches/G4-103-after.webp) | not a glitch |
| G4-104 | the spooky path | iPad | The path's little lamps were unlit black boxes and its stones near-black blots. (viewer marks M-181 (pass 3)) | 2 | [before](pictures-4/stage3-glitches/G4-104-before.webp) · [after](pictures-4/stage3-glitches/G4-104-after.webp) | fixed |
| G4-105 | the Clothes Shop in October | iPad | The note said "Costumes are here for October!" but the costumes came last, after 22 ordinary items. (viewer marks M-183 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-105-before.webp) · [after](pictures-4/stage3-glitches/G4-105-after.webp) | fixed |
| G4-106 | my house, floor 2 | iPad | A big plain white disc on the floor looked like a giant blank plate. (viewer marks M-018 (pass 3)) | 2 | [before](pictures-4/stage3-glitches/G4-106-before.webp) · [after](pictures-4/stage3-glitches/G4-106-after.webp) | fixed |
| G4-107 | the phone: quests | iPad | The text on the purple "🧩 Tricky" tag was about 7 px, dark on purple. (viewer marks M-019 (pass 3)) | 1 | [before](pictures-4/stage3-glitches/G4-107-before.webp) · [after](pictures-4/stage3-glitches/G4-107-after.webp) | fixed |
| G4-108 | the Pet Shop upstairs | iPad | The pen signs overlapped the windows: a curtain cut "Puppies" to "Puppie", a window covered most of "Bunnies". (viewer marks M-005 (pass 4), M-023 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-108-before.webp) · [after](pictures-4/stage3-glitches/G4-108-after.webp) | fixed |
| G4-109 | the corner map | iPad | The pink "you" arrow was stuck on the map's left border and half cut off. (viewer marks M-007 (pass 4), M-008 (pass 4), M-026 (pass 4), M-028 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-109-before.webp) · [after](pictures-4/stage3-glitches/G4-109-after.webp) | fixed |
| G4-110 | the big map | iPad, PC | The corner map peeked out above and beside the big map panel. (viewer marks M-010 (pass 4), M-114 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-110-before.webp) · [after](pictures-4/stage3-glitches/G4-110-after.webp) | fixed |
| G4-111 | the What's new book | iPad | The cover pictures were rough crops: a name tag cut to "ffles", HUD slivers. (viewer marks M-012 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-111-before.webp) · [after](pictures-4/stage3-glitches/G4-111-after.webp) | fixed |
| G4-112 | pumpkin glows at night | iPad | A pumpkin's orange glow stopped in a hard straight line on the pavement below the step. (viewer marks M-015 (pass 4), M-034 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-112-before.webp) · [after](pictures-4/stage3-glitches/G4-112-after.webp) | fixed |
| G4-113 | the Tree Park | iPad | The yellow pointer over the next deck was in two pieces, the shaft and the head floating apart. (viewer marks M-018 (pass 4), M-019 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-113-before.webp) · [after](pictures-4/stage3-glitches/G4-113-after.webp) | fixed |
| G4-114 | the Tree Park's finish deck | iPad | The "🏁 Finish" banner ran off the screen and the bell filled the middle. (viewer marks M-003 (pass 4), M-020 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-114-before.webp) · [after](pictures-4/stage3-glitches/G4-114-after.webp) | fixed |
| G4-115 | the Pet Shop upstairs | iPad | A big pale see-through slab (the hamsters' glass) washed out a corner of the picture. (viewer marks M-024 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-115-before.webp) · [after](pictures-4/stage3-glitches/G4-115-after.webp) | fixed |
| G4-116 | a tall house on Friends Lane | iPad | The six-floor house had no name tag on top. (viewer marks M-025 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-116-before.webp) · [after](pictures-4/stage3-glitches/G4-116-after.webp) | fixed |
| G4-117 | Settings | iPhone upright | Settings had "Show me the tips" rows for three jobs but none for the photographer. (viewer marks M-040 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-117-before.webp) · [after](pictures-4/stage3-glitches/G4-117-after.webp) | fixed |
| G4-118 | Halloween ghosts | iPhone, iPad | A ghost floated right at the camera as a big grey blob. (viewer marks M-042 (pass 4), M-136 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-118-before.webp) · [after](pictures-4/stage3-glitches/G4-118-after.webp) | fixed |
| G4-119 | shop and school signs | iPhone upright | The notepad covered the start of a sign ("ozy Town School", "…ore"). (viewer marks M-047 (pass 4), M-049 (pass 4), M-066 (pass 4), M-068 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-119-before.webp) · [after](pictures-4/stage3-glitches/G4-119-after.webp) | not a glitch |
| G4-120 | name tags | iPhone upright | A pet's round button or the action pill covered the end of a name tag, or a tag ran off the screen edge. (viewer marks M-048 (pass 4), M-050 (pass 4), M-053 (pass 4), M-054 (pass 4), M-067 (pass 4), M-069 (pass 4), M-071 (pass 4), M-072 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-120-before.webp) · [after](pictures-4/stage3-glitches/G4-120-after.webp) | not a glitch |
| G4-121 | inside the Market | iPhone, PC | Faint zigzag stripes on the floor between the fruit counters and on their inner sides. (viewer marks M-055 (pass 4), M-112 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-121-before.webp) · [after](pictures-4/stage3-glitches/G4-121-after.webp) | fixed |
| G4-122 | the Pet Shop | iPhone upright | A washed-out view: pale mint walls, near-white floor and white shelves ran together. (viewer marks M-058 (pass 4), M-075 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-122-before.webp) · [after](pictures-4/stage3-glitches/G4-122-after.webp) | fixed |
| G4-123 | the house colour card | iPhone sideways | The 12 colour chips were about 34 px tall, smaller than a fingertip. (viewer marks M-077 (pass 4), M-094 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-123-before.webp) · [after](pictures-4/stage3-glitches/G4-123-after.webp) | fixed |
| G4-124 | a photo shoot | iPhone sideways | The dashed frame sat right of the middle (187 px gap on the left, 35 px on the right). (viewer marks M-083 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-124-before.webp) · [after](pictures-4/stage3-glitches/G4-124-after.webp) | not a glitch |
| G4-125 | town views | iPhone sideways | The joystick ring sat over the fountain, the gate, the pond. (viewer marks M-086 (pass 4), M-087 (pass 4), M-088 (pass 4), M-089 (pass 4), M-104 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-125-before.webp) · [after](pictures-4/stage3-glitches/G4-125-after.webp) | not a glitch |
| G4-126 | the toy phone | iPhone sideways | The phone screen stayed white and pastel in the dark theme. (viewer marks M-090 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-126-before.webp) · [after](pictures-4/stage3-glitches/G4-126-after.webp) | not a glitch |
| G4-127 | the duck pond | PC | The white and the yellow duck were stuck into each other like one blob. (viewer marks M-110 (pass 4), M-115 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-127-before.webp) · [after](pictures-4/stage3-glitches/G4-127-after.webp) | fixed |
| G4-128 | the Tree Park gate | PC | Little flowers grew on the earth path just past the gate. (viewer marks M-111 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-128-before.webp) · [after](pictures-4/stage3-glitches/G4-128-after.webp) | fixed |
| G4-129 | the Pet Shop card | PC | The line broke between 🛋️ and "Decorate." (viewer marks M-116 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-129-before.webp) · [after](pictures-4/stage3-glitches/G4-129-after.webp) | fixed |
| G4-130 | the holiday tree at night | iPad | Lights too bright: Santa's face a yellow-white blob. (viewer marks M-120 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-130-before.webp) · [after](pictures-4/stage3-glitches/G4-130-after.webp) | fixed |
| G4-131 | the Hair Salon | iPad | The "✂️ Nora sits down!" pop text ran into the salon's wall sign. (viewer marks M-123 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-131-before.webp) · [after](pictures-4/stage3-glitches/G4-131-after.webp) | not a glitch |
| G4-132 | the clothes maker | iPad | The "Cat costume: it's yours!" message lay across the figure's chin and chest. (viewer marks M-127 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-132-before.webp) · [after](pictures-4/stage3-glitches/G4-132-after.webp) | fixed |
| G4-133 | the spooky path | iPad | A soft monster popped up right in the camera's face. (viewer marks M-128 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-133-before.webp) · [after](pictures-4/stage3-glitches/G4-133-after.webp) | fixed |
| G4-134 | the Flower Corner at Easter | iPad | A big gold box-like shape hung in the sky next to the map. (viewer marks M-129 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-134-before.webp) · [after](pictures-4/stage3-glitches/G4-134-after.webp) | fixed |
| G4-135 | the phone: the photo booking chat | iPad | The header "Photo booki…" disappeared under the 🪙 chip. (viewer marks M-135 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-135-before.webp) · [after](pictures-4/stage3-glitches/G4-135-after.webp) | fixed |
| G4-136 | friends who follow you | iPad | After you stop, one friend stood straight behind another (only the tag showed) and one came right up to the camera. (viewer marks M-137 (pass 4), M-138 (pass 4), M-141 (pass 4), M-124 (pass 5), M-125 (pass 5), M-126 (pass 5), M-127 (pass 5)) | 2 | [before](pictures-4/stage3-glitches/G4-136-before.webp) · [after](pictures-4/stage3-glitches/G4-136-after.webp) | fixed |
| G4-137 | the dance-off score bar | iPad | The players' names in the score bar were 7–8 px. (viewer marks M-147 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-137-before.webp) · [after](pictures-4/stage3-glitches/G4-137-after.webp) | fixed |
| G4-138 | the dance result | iPad | Mochi stood right at the lens under the run/jump buttons, its crown a black silhouette. (viewer marks M-148 (pass 4), M-149 (pass 4)) | 2 | [before](pictures-4/stage3-glitches/G4-138-before.webp) · [after](pictures-4/stage3-glitches/G4-138-after.webp) | fixed |
| G4-139 | the photo result | iPhone sideways | The "+120 🪙" pop landed on the clock chip. (viewer marks M-152 (pass 4)) | 1 | [before](pictures-4/stage3-glitches/G4-139-before.webp) · [after](pictures-4/stage3-glitches/G4-139-after.webp) | fixed |
| G4-140 | a photo shoot | PC, iPhone sideways | A tree trunk stood in the middle of the frame and hid one of the family, a passing grandma stood in the group with her back turned, and the photo still got five stars. (viewer marks M-154 (pass 4), M-155 (pass 4), M-133 (pass 5), M-134 (pass 5), M-135 (pass 5)) | 2 | [before](pictures-4/stage3-glitches/G4-140-before.webp) · [after](pictures-4/stage3-glitches/G4-140-after.webp) | fixed |
| G4-141 | the bus stop at the park | iPhone sideways, PC | Behind the phone and every card the view was inside the parked Beach Bus: seats, windows, the yellow pole. (viewer marks M-053 (pass 5), M-054 (pass 5), M-055 (pass 5), M-056 (pass 5), M-057 (pass 5), M-058 (pass 5), M-059 (pass 5), M-060 (pass 5), M-061 (pass 5), M-062 (pass 5), M-063 (pass 5), M-064 (pass 5), M-065 (pass 5), M-066 (pass 5), M-072 (pass 5), M-073 (pass 5), M-074 (pass 5), M-075 (pass 5), M-076 (pass 5), M-077 (pass 5), M-078 (pass 5), M-079 (pass 5), M-080 (pass 5), M-083 (pass 5), M-084 (pass 5), M-085 (pass 5), M-086 (pass 5), M-087 (pass 5), M-088 (pass 5), M-089 (pass 5), M-090 (pass 5), M-091 (pass 5), M-092 (pass 5), M-093 (pass 5), M-094 (pass 5), M-095 (pass 5), M-096 (pass 5), M-097 (pass 5), M-098 (pass 5), M-099 (pass 5), M-100 (pass 5), M-101 (pass 5), M-102 (pass 5), M-103 (pass 5)) | 2 | [before](pictures-4/stage3-glitches/G4-141-before.webp) · [after](pictures-4/stage3-glitches/G4-141-after.webp) | fixed |
| G4-142 | the Pet Shop upstairs | iPad | In the pens two animals were bunched into one blob (a kitten sticking out of another's back, the puppies piled up). (viewer marks M-005 (pass 5), M-018 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-142-before.webp) · [after](pictures-4/stage3-glitches/G4-142-after.webp) | fixed |
| G4-143 | the stair plates | iPad | "Downstairs" was drawn smaller than "Upstairs" on the plate next to it. (viewer marks M-006 (pass 5), M-019 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-143-before.webp) · [after](pictures-4/stage3-glitches/G4-143-after.webp) | fixed |
| G4-144 | the phone: quests | every device | The Decorator quest said "Put a herb pots in your house". (viewer marks M-007 (pass 5), M-021 (pass 5), M-027 (pass 5), M-036 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-144-before.webp) · [after](pictures-4/stage3-glitches/G4-144-after.webp) | fixed |
| G4-145 | the food truck corner | iPad | A tree's crown sat right on the truck's cab, as if it grew out of the truck. (viewer marks M-010 (pass 5), M-011 (pass 5), M-012 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-145-before.webp) · [after](pictures-4/stage3-glitches/G4-145-after.webp) | fixed |
| G4-146 | inside the Market | iPad, PC | A big soft round shadow lay across the fruit counter with nothing in view casting it. (viewer marks M-015 (pass 5), M-106 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-146-before.webp) · [after](pictures-4/stage3-glitches/G4-146-after.webp) | not a glitch |
| G4-147 | the duck pond at night | iPad | The pond water stayed bright blue while the grass and stones around it went dark. (viewer marks M-024 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-147-before.webp) · [after](pictures-4/stage3-glitches/G4-147-after.webp) | fixed |
| G4-148 | the pose card | iPhone upright | Mia and Zoe stuck out of the dashed frame and the card hid everything below their chins. (viewer marks M-031, M-040 (pass 5), M-011 (pass 7)) | 1 | [before](pictures-4/stage3-glitches/G4-148-before.webp) · [after](pictures-4/stage3-glitches/G4-148-after.webp) | fixed |
| G4-149 | the What's new book | iPhone upright | In the dark theme the inactive page dots were dark rings on the dark card, almost invisible. (viewer marks M-038 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-149-before.webp) · [after](pictures-4/stage3-glitches/G4-149-after.webp) | fixed |
| G4-150 | the park fence in October | iPhone upright | The October garland hung at eye height right in front of the camera; huge pennants cut across the view. (viewer marks M-041 (pass 5), M-042 (pass 5)) | 2 | [before](pictures-4/stage3-glitches/G4-150-before.webp) · [after](pictures-4/stage3-glitches/G4-150-after.webp) | fixed |
| G4-151 | the photo result | iPhone sideways | The joystick ring and knob stuck out half cut by the result card. (viewer marks M-051 (pass 5), M-070 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-151-before.webp) · [after](pictures-4/stage3-glitches/G4-151-after.webp) | fixed |
| G4-152 | the house colour card | iPhone sideways | "Green" and "Mint" were the same pale mint, "Blue" and "Sky" almost the same. (viewer marks M-067 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-152-before.webp) · [after](pictures-4/stage3-glitches/G4-152-after.webp) | fixed |
| G4-153 | the Easter Bunny | iPad | The Bunny's words sat over its face: only the top of its eyes showed. (viewer marks M-108 (pass 5)) | 2 | [before](pictures-4/stage3-glitches/G4-153-before.webp) · [after](pictures-4/stage3-glitches/G4-153-after.webp) | fixed |
| G4-154 | the holiday tree | iPad | Light bulbs and their string hung in the air beside the tree and at its tip. (viewer marks M-110 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-154-before.webp) · [after](pictures-4/stage3-glitches/G4-154-after.webp) | fixed |
| G4-155 | the Flower Corner sign | iPad | The board flickered at its ends: the posts' faces ran through the board and the sign. (viewer marks M-111 (pass 5), M-113 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-155-before.webp) · [after](pictures-4/stage3-glitches/G4-155-after.webp) | fixed |
| G4-156 | the Clothes Shop in October | iPad | A dark colour dot on a dark card could not be seen, so two "Special witch hat" cards looked the same. (viewer marks M-114 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-156-before.webp) · [after](pictures-4/stage3-glitches/G4-156-after.webp) | fixed |
| G4-157 | the Hair Salon | iPad | The dye shelf ran behind the window curtain and over the window. (viewer marks M-115 (pass 5)) | 2 | [before](pictures-4/stage3-glitches/G4-157-before.webp) · [after](pictures-4/stage3-glitches/G4-157-after.webp) | fixed |
| G4-158 | the dance-off on two phones | iPhone | Upright: your dancer was half off the left edge. Sideways: "Perfect +15" was drawn across both dancers. (viewer marks M-116 (pass 5), M-117 (pass 5)) | 2 | [before](pictures-4/stage3-glitches/G4-158-before.webp) · [after](pictures-4/stage3-glitches/G4-158-after.webp) | fixed |
| G4-159 | the dance result | iPhone sideways | The white aim dot sat on the partner's eye. (viewer marks M-119 (pass 5)) | 1 | [before](pictures-4/stage3-glitches/G4-159-before.webp) · [after](pictures-4/stage3-glitches/G4-159-after.webp) | fixed |
| G4-160 | the front door of a house on Friends Lane | iPad | Dark blurred smudges lay on the wall either side of the front door and over its top half, with a jagged grey band under the roof edge. (viewer marks M-001 (pass 7), M-004 (pass 7)) | 1 | [before](pictures-4/stage3-glitches/G4-160-before.webp) | fixed |
| G4-161 | the stair plates on floor 2 | iPad | "⬇️ Downstairs" ran to both edges of its plate, while "⬆️ Upstairs" beside it had room. (viewer marks M-003 (pass 7)) | 1 | [before](pictures-4/stage3-glitches/G4-161-before.webp) · [after](pictures-4/stage3-glitches/G4-161-after.webp) | fixed |
| G4-162 | the square, looking to the Flower Corner | iPhone upright | The camera seemed to be inside a vehicle: a dark outline and two small windows filled the view. (viewer marks M-012 (pass 7)) | 3 | [before](pictures-4/stage3-glitches/G4-162-before.webp) | not a glitch |
| G4-163 | the phone on a short sideways screen | iPhone sideways | The phone was narrow, so its words wrapped into many lines: Rosie's three job cards were cut at the bottom, the quest's second step and the calendar's Halloween line sat half under the bottom fade. (viewer marks M-013 (pass 7), M-014 (pass 7), M-015 (pass 7)) | 1 | [before](pictures-4/stage3-glitches/G4-163-before.webp) · [after](pictures-4/stage3-glitches/G4-163-after.webp) | fixed |
| G4-164 | the big map on a short sideways screen | iPhone sideways | The "Tap a place to see the way there!" tip sat over the map's bottom row: Pet Shop and Cozy Park lost their names under it, and a cut "Ice Cream Shop" peeked out below it. (viewer marks M-016 (pass 7), M-018 (pass 7)) | 1 | [before](pictures-4/stage3-glitches/G4-164-before.webp) · [after](pictures-4/stage3-glitches/G4-164-after.webp) | fixed |
| G4-165 | friends on the big map | iPhone sideways | "Finn" stood 3 px from "Duck Pond", so it read as one name, "Finn Duck Pond". (viewer marks M-017 (pass 7)) | 1 | [before](pictures-4/stage3-glitches/G4-165-before.webp) · [after](pictures-4/stage3-glitches/G4-165-after.webp) | fixed |
| G4-166 | a photo shoot at the school | PC | The asked background, "the school sign", was above the dashed frame, cut by the top of the screen and under the coin and time chips; the "Everyone is posed!" tip sat in the frame over Mia and the cat; the photo had no school sign in it and still got five stars. (viewer marks M-020 (pass 7), M-021 (pass 7), M-022 (pass 7)) | 2 | [before](pictures-4/stage3-glitches/G4-166-before.webp) | fixed |
| G4-167 | the big map's left edge | PC | A cut "ne" of "Friends Lane" hung alone at the map's left edge. (viewer marks M-023 (pass 7)) | 1 | [before](pictures-4/stage3-glitches/G4-167-before.webp) | not a glitch |
| G4-168 | October: the park fountain | iPad | A white ghost hung inside the fountain, between its top and middle bowls. (viewer marks M-001 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-168-after.webp) | fixed |
| G4-169 | the Café, Bakery and Ice Cream chalkboards | iPad | The last of five rows sat on the bottom frame with no air under it. (viewer marks M-003 (pass 8), M-004 (pass 8), M-005 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-169-after.webp) | fixed |
| G4-170 | your garden: a row of locked pots | iPad | The big "🔒 Level 40" plate hung in the air above its stake. (viewer marks M-008 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-170-after.webp) | fixed |
| G4-171 | people right at the camera | iPad | A grandma or a passer-by stood right against the camera: a grey head, a cardigan or a back filled a third of the picture. (viewer marks M-010 (pass 8), M-011 (pass 8), M-072 (pass 8), M-089 (pass 8)) | 2 | [after](pictures-4/stage3-glitches/G4-171-after.webp) | fixed |
| G4-172 | the phone: quests | iPad | A quest read "Buy a fairy wings at the Pet shop" ("a" before a plural; "Pet shop", the building says Pet Shop). (viewer marks M-012 (pass 8), M-022 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-172-after.webp) | fixed |
| G4-173 | the What's new book, page 3 (February) | every screen | The February picture had a townsperson right at the camera filling its left third, her bubble cut to "ce.". (viewer marks M-014 (pass 8), M-024 (pass 8), M-030 (pass 8), M-034 (pass 8), M-038 (pass 8), M-044 (pass 8), M-048 (pass 8), M-051 (pass 8)) | 2 | [after](pictures-4/stage3-glitches/G4-173-after.webp) | fixed |
| G4-174 | the What's new book, page 5 | every screen | The last line "Your tutorials are pictures now ❓" ended in a red question mark, like a question. (viewer marks M-015 (pass 8), M-026 (pass 8), M-053 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-174-after.webp) | fixed |
| G4-175 | a photo shoot at the fountain | iPad | Leo's waving arm reached into Zoe's hair, in the view and in the photo. (viewer marks M-016 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-175-after.webp) | fixed |
| G4-176 | the pond ducks close up | iPad | The close-up missed: both ducks small at the far rim, cattails in front of their heads. (viewer marks M-018 (pass 8)) | 2 | — | not a glitch |
| G4-177 | inside the school | iPad | The two teachers stood at the screen edges, their name tags cut. (viewer marks M-019 (pass 8)) | 1 | — | not a glitch |
| G4-178 | the Pet Shop upstairs | iPad | Your pets and their name tags stood right in front of the camera over the pens. (viewer marks M-020 (pass 8)) | 1 | — | not a glitch |
| G4-179 | walls and tree crowns turned away from the sun | iPad | The house's back wall in the garden was a dull grey, not its colour; the apartment block's wall had a lit strip and a soft seam at 12:30 and pale streaks at 17:30; a house wall at the Flower Corner was pale and streaky at noon; the Tree Park's crowns had thin stripes. (viewer marks M-021 (pass 8), M-058 (pass 8), M-070 (pass 8), M-097 (pass 8), M-099 (pass 8)) | 2 | [after](pictures-4/stage3-glitches/G4-179-after.webp) | fixed |
| G4-180 | the What's new book, page 4 (the Pet Shop upstairs) | iPad | The picture was pale, a third of it ceiling, the Capybaras sign cut to "Cap". (viewer marks M-025 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-180-after.webp) | fixed |
| G4-181 | the What's new book, pages 6 and 7 | iPhone, PC | Line breaks: "dance-" / "off"; an emoji alone on a line; 🕺 and 💃 split over two lines. (viewer marks M-031 (pass 8), M-035 (pass 8), M-054 (pass 8), M-055 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-181-after.webp) | fixed |
| G4-182 | inside the Pet Shop | iPhone upright | A huge pink ceiling lamp hung right in front of the camera at the top. (viewer marks M-033 (pass 8)) | 1 | — | not a glitch |
| G4-183 | the Pet Shop card | iPhone sideways | Two prices sat lower than the third and were greyed out by the card's bottom fade, so they looked disabled. (viewer marks M-039 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-183-after.webp) | fixed |
| G4-184 | cards at the bottom of a short screen | iPhone sideways | The bigger-house card ran under the round top buttons (the gear on its corner); the mint jump button poked out beside the mailbox and party cards. (viewer marks M-040 (pass 8), M-045 (pass 8), M-046 (pass 8), M-047 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-184-after.webp) | fixed |
| G4-185 | the job tutorials | iPhone sideways | The tall tutorial card lay over the top bar, which stayed: it hid the clock chip and the chat button and cut the food chip in half. (viewer marks M-041 (pass 8), M-042 (pass 8), M-043 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-185-after.webp) | fixed |
| G4-186 | 1 September: the school front | iPad | The "School party today!" banner ran behind the school's name board on its posts. (viewer marks M-059 (pass 8), M-092 (pass 8)) | 2 | [after](pictures-4/stage3-glitches/G4-186-after.webp) | fixed |
| G4-187 | 1 September: the school hall | iPad | Two balloon bunches stood in front of the 🌈 and 🚀 posters between the doors. (viewer marks M-060 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-187-after.webp) | fixed |
| G4-188 | October: the spooky gate at night | iPad | Your pets bunched up right in front of the camera over the gate. (viewer marks M-061 (pass 8)) | 2 | — | not a glitch |
| G4-189 | a pizza delivery | iPad | Two orders at once: the chef's card for Iris and the message of a new order for Mr. Bolt. (viewer marks M-063 (pass 8)) | 2 | — | not a glitch |
| G4-190 | two players at the park | PC | The PC player's view was boxed in by a tree trunk and the back of the Ideas Board. (viewer marks M-064 (pass 8)) | 2 | — | not a glitch |
| G4-191 | the dance-off | iPhone upright, iPhone sideways | The "✨ Perfect +15" pop-up ran into the score bar (upright); on a sideways phone its ✨ covered the left dancer's face, which read as the back of a head. (viewer marks M-065 (pass 8), M-066 (pass 8)) | 2 | [after](pictures-4/stage3-glitches/G4-191-after.webp) | fixed |
| G4-192 | the disco ball | iPhone upright | The mirror ball seemed to float beside its pole: the 3 cm arm and 1 cm string were too thin and pale to see. (viewer marks M-067 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-192-after.webp) | fixed |
| G4-193 | the big map on a tablet | Android tablet upright | The "You are online!" message lay on the chat and phone buttons above the map card. (viewer marks M-068 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-193-after.webp) | fixed |
| G4-194 | the hair salon | iPad | The hair card and its name tab covered the customer in the chair, the tab on their face. (viewer marks M-069 (pass 8), M-083 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-194-after.webp) | fixed |
| G4-195 | playing with a pet | iPad | A toy and a hand seemed to hang in mid-air beside a lamp pole. (viewer marks M-073 (pass 8), M-074 (pass 8), M-075 (pass 8), M-076 (pass 8), M-077 (pass 8), M-078 (pass 8)) | 1 | — | not a glitch |
| G4-196 | your house | iPad | Three pet name tags piled up: "Moch", only an "M". (viewer marks M-079 (pass 8), M-080 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-196-after.webp) | fixed |
| G4-197 | your house upstairs | iPad | The save's green rug lay half under the floor's blue starter rug. (viewer marks M-081 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-197-after.webp) | fixed |
| G4-198 | the hairstylist tutorial | iPad, PC | The caption "A customer sits down" sat right of centre in its picture. (viewer marks M-082 (pass 8), M-118 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-198-after.webp) | fixed |
| G4-199 | the park at night in rain | iPad | It rained from a clear starry sky. (viewer marks M-088 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-199-after.webp) | fixed |
| G4-200 | the clothes maker at the mirror | iPad | Its ⬇️ "more below" was a tiny 33 px round button. (viewer marks M-090 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-200-after.webp) | fixed |
| G4-201 | the Easter month at the Flower Corner | iPad | The eggs in view were small pastel ones lying loose, no golden-banded egg in a nest. (viewer marks M-091 (pass 8)) | 1 | — | not a glitch |
| G4-202 | the Pet Shop upstairs: the ducks | iPad | The two ducks stood on top of their water on orange legs. (viewer marks M-093 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-202-after.webp) | fixed |
| G4-203 | friends round you | iPad | After you turned round on a narrow pavement, Finn stood hidden behind Luna (only his name tag showed); Rosie walked past right at the camera. (viewer marks M-095 (pass 8), M-096 (pass 8)) | 2 | [after](pictures-4/stage3-glitches/G4-203-after.webp) | fixed |
| G4-204 | the clock chip | iPad | The chip showed the old hour or weather under the new sky: "11:30" at 12:30, the sun under an evening sky, a cloud under a blue sky. (viewer marks M-098 (pass 8), M-100 (pass 8), M-101 (pass 8), M-103 (pass 8)) | 2 | [after](pictures-4/stage3-glitches/G4-204-after.webp) | fixed |
| G4-205 | your pets at the Tree Park gate | iPad | Your pets crowded the bottom edge in front of the camera; Clover stood behind Waffles, only her ears showing. (viewer marks M-102 (pass 8)) | 2 | — | open |
| G4-206 | a grandma's long line | iPad, PC | A long line ("Holidays bring something new here, you'll see.") was one huge pill running off the screen's left edge, under the corner map and the bus pill (and in M-117 the grandma stood at the camera too). (viewer marks M-104 (pass 8), M-105 (pass 8), M-106 (pass 8), M-107 (pass 8), M-117 (pass 8)) | 2 | [after](pictures-4/stage3-glitches/G4-206-after.webp) | fixed |
| G4-207 | the duck-pond bench | iPad | Two speech bubbles overlapped: "Hee hee!" on the middle of the other line. (viewer marks M-108 (pass 8)) | 2 | [after](pictures-4/stage3-glitches/G4-207-after.webp) | fixed |
| G4-208 | the designer job: a new client | iPad | The "+20" coin pop sat on the "New client!" message, over its first words. (viewer marks M-109 (pass 8), M-112 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-208-after.webp) | fixed |
| G4-209 | the designer job's room | iPad | A white ring floated in the room (over the sofa, beside the armchair), at the same screen spot in both rooms. (viewer marks M-110 (pass 8), M-113 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-209-after.webp) | fixed |
| G4-210 | the designer's wish card | iPad | The title was cut: "Sunny living room · r…". (viewer marks M-111 (pass 8), M-114 (pass 8)) | 1 | [after](pictures-4/stage3-glitches/G4-210-after.webp) | fixed |
| G4-211 | a photo shoot by the food truck | iPhone sideways | "Pick up the litter" and its big button sat inside the dashed photo frame. (viewer marks M-116 (pass 8)) | 2 | [after](pictures-4/stage3-glitches/G4-211-after.webp) | fixed |
| G4-212 | the phone: calendar | iPad | In Saturday's tile the ⭐ and the 🏆 sat to the left, one under the other, not under the day. (viewer marks M-005 (pass 9)) | 1 | [after](pictures-4/stage3-glitches/G4-212-after.webp) | fixed |
| G4-213 | the Pet Shop card | iPad | "Buy one and something new pops up!" beside "✨ New in!" was tiny (12 px, faint). (viewer marks M-008 (pass 9)) | 1 | [after](pictures-4/stage3-glitches/G4-213-after.webp) | fixed |
| G4-214 | the phone's furniture page, the delivery job box | PC, iPad | An emoji stood alone on the last line: 🎨 after "free!", 🍕 after "Pizzeria". (viewer marks M-017 (pass 9), M-021 (pass 9)) | 1 | [after](pictures-4/stage3-glitches/G4-214-after.webp) | fixed |
| G4-215 | the What's new book, page 4 | iPad | The Pet Shop upstairs picture was soft and pale: its lower third an empty floor, the Capybaras sign cut at its edge. (viewer marks M-012 (pass 9)) | 1 | [after](pictures-4/stage3-glitches/G4-215-after.webp) | fixed |
| G4-216 | inside the flower shop | iPhone upright | From the door the middle hanging basket's rod came straight out of the ceiling lamp's bulb. (viewer marks M-015 (pass 9)) | 1 | [after](pictures-4/stage3-glitches/G4-216-after.webp) | fixed |
| G4-217 | 1 September: the school hall | iPad | No balloons in sight as you come in: f5 had moved the back two bunches by the lockers (G4-187), out of the view from the door. (viewer marks M-020 (pass 9), M-035 (pass 9)) | 2 | [after](pictures-4/stage3-glitches/G4-217-after.webp) | fixed |
| G4-218 | the hair salon | iPad, PC | Big words ("Ava sits down!", "Ben comes in!") lay across the customer's face once the view turned to them (G4-194). (viewer marks M-030 (pass 9), M-054 (pass 9), M-055 (pass 9)) | 2 | [after](pictures-4/stage3-glitches/G4-218-after.webp) | fixed |
| G4-219 | the hair card | iPhone sideways | The card covered the end of the job pill: "Ben is in your ch". (viewer marks M-049 (pass 9), M-051 (pass 9)) | 1 | [after](pictures-4/stage3-glitches/G4-219-after.webp) | fixed |
| G4-220 | a photo shoot at the school | iPhone sideways | The "Everyone is posed!" message lay over the school's name board, the background the booking asked for. (viewer marks M-052 (pass 9)) | 1 | [after](pictures-4/stage3-glitches/G4-220-after.webp) | fixed |
| G4-221 | friends round you (after G4-203) | iPad | After a turn on a narrow pavement Theo stood half behind Luna and Rosie walked past right at the camera; in the other pictures Finn's face showed beside Luna's hair. (viewer marks M-040 (pass 9), M-043 (pass 9)) | 2 | [after](pictures-4/stage3-glitches/G4-221-after.webp) | fixed |
| G4-222 | your pets (G4-205 again) | iPad | Your pets at your heels at the bottom edge: a name tag cut at the edge or under the joystick, one pet behind another, three in one clump. (viewer marks M-028 (pass 9), M-041 (pass 9), M-044 (pass 9), M-046 (pass 9), M-048 (pass 9)) | 2 | — | open |
| G4-223 | the photographer's own staging | iPad, PC | A car right at the camera (the school front in rain); the garden's back wall pink after the house was painted purple; two shoppers inside each other; a posed townsperson on the road at New Year. (viewer marks M-009 (pass 9), M-010 (pass 9), M-018 (pass 9), M-019 (pass 9)) | 1 | — | not a glitch |
| G4-224 | the big map | iPad, iPhone sideways | Place names cut at the map's edges; under the "👆 Tap a place" tip only the end of a name showed ("air Salon"). (viewer marks M-011 (pass 9), M-038 (pass 9), M-053 (pass 9)) | 1 | — | not a glitch |
| G4-225 | the check's own staging | iPad | A pink thing half sunk in the park fountain at Christmas; play feedback (words, toys, a hand) piled on the Spooky path sign; a "🥚 18/25" floating over the scene under "All 25!"; grandmas behind a message, ducks under the buttons. (viewer marks M-022 (pass 9), M-023 (pass 9), M-024 (pass 9), M-025 (pass 9), M-026 (pass 9), M-027 (pass 9), M-032 (pass 9), M-036 (pass 9)) | 1 | — | not a glitch |
| G4-226 | your house upstairs, an old save | iPad | The purple bed seemed pushed into the bunk bed. (viewer marks M-029 (pass 9)) | 1 | — | not a glitch |
| G4-227 | the hair salon: a customer's wish | PC | "I'd like my hair shoulder-length and bun" (clumsy words). (viewer marks M-063 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-227-after.webp) | fixed |
| G4-228 | the photo and hair result cards | iPhone sideways | The "+120 🪙" pop flew half behind the card's top edge. (viewer marks M-022 (pass 10), M-033 (pass 10), M-059 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-228-after.webp) | fixed |
| G4-229 | the designer job: a new client (after G4-208) | iPad | The "+20 🪙" pop lay on the "New client!" words that came a moment after it. (viewer marks M-058 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-229-after.webp) | fixed |
| G4-230 | the clock chip | iPad, PC, Android tablet | The chip showed ☀️ under a grey sky. (viewer marks M-045 (pass 10), M-052 (pass 10), M-062 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-230-after.webp) | fixed |
| G4-231 | a grandma walking by | PC | At the Beach Bus stop a grandma walked right through the camera: her head and cardigan filled a third of the screen, her shoes stuck out under a card. (viewer marks M-036 (pass 10), M-037 (pass 10), M-040 (pass 10), M-041 (pass 10)) | 2 | [after](pictures-4/stage3-glitches/G4-231-after.webp) | fixed |
| G4-232 | a friend out for a walk | iPad | Luna, out for a walk, stood 0.9 m in front of the camera, her back and hair filling a quarter of the view, for as long as you stood still. (viewer marks M-004 (pass 10), M-005 (pass 10)) | 2 | [after](pictures-4/stage3-glitches/G4-232-after.webp) | fixed |
| G4-233 | friends round you | iPad | After a turn a townsperson stood between you and your friends, hiding Luna and Theo. (viewer marks M-057 (pass 10)) | 2 | [after](pictures-4/stage3-glitches/G4-233-after.webp) | fixed |
| G4-234 | name tags far away | iPad, iPhone | The Pet Show judges' far name tags were tiny pills piled in a staircase; at New Year a far grandma's tiny bubble, drawn over everything, sat on a near face. (viewer marks M-014 (pass 10), M-016 (pass 10), M-019 (pass 10), M-021 (pass 10), M-053 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-234-after.webp) | fixed |
| G4-235 | a photo shoot at the school (after G4-220) | iPhone sideways | The "Everyone is posed!" message still lay over the hanging school sign and Ben's tag; the big school sign was cut by the top edge, behind the coin, food and clock chips. (viewer marks M-061 (pass 10)) | 2 | [after](pictures-4/stage3-glitches/G4-235-after.webp) | fixed |
| G4-236 | the phone: calendar (after G4-163) | iPhone sideways | On a Saturday the Halloween line stopped at "…and the" in the phone's bottom fade. (viewer marks M-032 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-236-after.webp) | fixed |
| G4-237 | the phone: Rosie's job list | iPhone upright | "Photographer" touched both sides of its card. (viewer marks M-015 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-237-after.webp) | fixed |
| G4-238 | the Clothes Shop's New in! row | iPad (dark) | The Special cap's near-black colour dot had no ring and vanished on the dark card. (viewer marks M-043 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-238-after.webp) | fixed |
| G4-239 | the Toy Store's corner post | iPad | A faint dashed line ran down the pink corner post, roof edge to pavement. (viewer marks M-001 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-239-after.webp) | fixed |
| G4-240 | the Toy Store and Hair Salon awnings | iPad | The awning seemed to run on past the shop's far corner into thin air, off-centre. (viewer marks M-008 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-240-after.webp) | fixed |
| G4-241 | the duck pond | iPad | Broken dark-blue blotches on the water along the reeds. (viewer marks M-003 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-241-after.webp) | fixed |
| G4-242 | the Tree Park: the star over your next deck | iPad | Seen half-way round, the turning star looked like a bell drawn through a star. (viewer marks M-010 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-242-after.webp) | fixed |
| G4-243 | inside the Bakery | iPad | A shopper at the counter stood right in front of Mrs. Crumb as seen from the door: the two read as one stacked figure. (viewer marks M-012 (pass 10)) | 1 | [after](pictures-4/stage3-glitches/G4-243-after.webp) | fixed |
| G4-244 | the Tree Park: a tree crown | iPad | A short row of soft dark dots on a big orange crown. (viewer marks M-002 (pass 10)) | 1 | — | open |
| G4-245 | your pets (G4-205 again) | iPad | Mochi and Clover with their big tags in front of the Pet Shop's upstairs pens. (viewer marks M-013 (pass 10)) | 1 | — | open |
| G4-246 | not glitches | iPad, iPhone sideways | The fountain mottled at night; a house sign without a garland in October; the Toy Store's name off-centre on its board; two shoppers at the left edge of the Pet Shop, one behind the other, and one behind the buttons. (viewer marks M-006 (pass 10), M-009 (pass 10), M-034 (pass 10), M-035 (pass 10)) | 1 | — | not a glitch |
| G4-247 | the photographer's own staging | iPad | On a rare delivery the job box read 0:44 while Chef Blaze's card said the timer starts when you close it. (viewer marks M-044 (pass 10)) | 1 | — | not a glitch |
| G4-248 | the check's own staging | iPad | A townsperson's back filling the middle of the fountain pictures; a faded "And the winner is…" over a new pet; the whole picture dimmed after the stairs. (viewer marks M-046 (pass 10), M-047 (pass 10), M-048 (pass 10), M-049 (pass 10), M-051 (pass 10)) | 1 | — | not a glitch |
| G4-249 | a grandma walking by (after G4-231) | PC | At the Beach Bus stop a grandma still passed right at the camera: her head and cardigan filled the left quarter (the light-theme picture and the December picture showed the same; the filter set those two aside under a wrong reason). (viewer marks M-022 (pass 11)) | 2 | [after](pictures-4/stage3-glitches/G4-249-after.webp) | fixed |
| G4-250 | the big map | iPhone, iPad, PC | Your friends' dots had no names (the builder's picture shows Luna, Rosie and Finn); Rosie's dot lay on the S of "Spooky path". (viewer marks M-015 (pass 11), M-017 (pass 11)) | 1 | [after](pictures-4/stage3-glitches/G4-250-after.webp) | fixed |
| G4-251 | the What's new book | PC | On the last page the page dots sat 21 px left of the middle: the wider "Let's play!" button pushed them. (viewer marks M-020 (pass 11)) | 1 | [after](pictures-4/stage3-glitches/G4-251-after.webp) | fixed |
| G4-252 | a message after the clock jumped | iPad | At 22:10 the message said "The football friends are at the field until 19:00. Come and play!". (viewer marks M-024 (pass 11)) | 1 | [after](pictures-4/stage3-glitches/G4-252-after.webp) | fixed |
| G4-253 | a message over the big map | Android tablet (upright) | The "You are online!" message lay on the chat and phone buttons. (viewer marks M-027 (pass 11)) | 1 | [after](pictures-4/stage3-glitches/G4-253-after.webp) | fixed |
| G4-254 | New Year's fireworks | iPad | The fireworks hardly read as fireworks: a thin spray of pale dots and a white smudge. (viewer marks M-023 (pass 11)) | 2 | [after](pictures-4/stage3-glitches/G4-254-after.webp) | fixed |
| G4-255 | the photographer's stars | iPad | Ben asked for "the bench behind us"; the photo showed a blue wall and no bench and still got the full score. (viewer marks M-034 (pass 11)) | 1 | [after](pictures-4/stage3-glitches/G4-255-after.webp) | fixed |
| G4-256 | a photo shoot at the Pet Show stage | iPhone sideways | Two judges sat right beside the camera, cut by the screen edge, one reaching into the photo; a judge's name tag cut at the edge of the result. (viewer marks M-041 (pass 11), M-042 (pass 11)) | 2 | [after](pictures-4/stage3-glitches/G4-256-after.webp) | fixed |
| G4-257 | shadows (G4-088 again) | iPad | Soft dark dots on a Tree Park crown; fine stripes under the apartments' window sills at 11:30. (viewer marks M-005 (pass 11), M-040 (pass 11)) | 1 | — | open |
| G4-258 | your pets (G4-205 again) | iPad | Mochi behind Finn, its tag cut to "chi"; Waffles' hatted head at the bottom edge, its tag on Rosie's dress. (viewer marks M-038 (pass 11), M-039 (pass 11)) | 1 | — | open |
| G4-259 | decided before | iPad, PC, iPhone sideways | The book over the corner map and the notepad; the garden's back wall not the house's purple; the joystick in from the edge on a sideways phone; a round shadow on the market's fruit stand; the iPad's notepad over two townsfolk's heads; the map's places list fading at its foot under the ⬇️ hint. (viewer marks M-002 (pass 11), M-008 (pass 11), M-019 (pass 11), M-021 (pass 11), M-025 (pass 11), M-043 (pass 11)) | 1 | — | not a glitch |
| G4-260 | the check's own staging | iPad | The spooky path's picture facing the street; a grandma's back filling the fountain picture; a lamp post coming down into a new pet's head; a townsperson's hat hidden in a low tree crown right at the camera; the camera tilted at the sky after a pick-up. (viewer marks M-029 (pass 11), M-030 (pass 11), M-031 (pass 11), M-032 (pass 11), M-033 (pass 11), M-035 (pass 11), M-036 (pass 11)) | 1 | — | not a glitch |
| G4-261 | the What's new book on an upright phone | iPhone upright | On the last page the wide "Let's play!" button lay on the page dots and hid the last three, this page's pink one among them (since f8, G4-251). (viewer marks M-003 (pass 12), M-006 (pass 12)) | 2 | [after](pictures-4/stage3-glitches/G4-261-after.webp) | fixed |
| G4-262 | a car right at the camera | iPad | The delivery picture showed no town: a flat green field and a dark band across the middle. A mint car stood at the photographer's spot on the road; its cabin was 15 cm from the camera and its roof edge 2 cm above eye height. (viewer marks M-015 (pass 12), M-016 (pass 12)) | 3 | [after](pictures-4/stage3-glitches/G4-262-after.webp) | fixed |
| G4-263 | the phone's screen | iPhone sideways | A muddy grey band along the foot of every phone page, also with nothing to scroll. (viewer marks M-008 (pass 12), M-010 (pass 12)) | 1 | [after](pictures-4/stage3-glitches/G4-263-after.webp) | fixed |
| G4-264 | the bag's counts | iPhone sideways, dark theme | The "×3" under each thing was small, light and hard to read. (viewer marks M-011 (pass 12)) | 1 | [after](pictures-4/stage3-glitches/G4-264-after.webp) | fixed |
| G4-265 | the dance-off's crouch | iPad | In the crouch the dancer's legs ended flat on the tiles: the shoes had sunk into the dance floor. (viewer marks M-036 (pass 12)) | 2 | [after](pictures-4/stage3-glitches/G4-265-after.webp) | fixed |
| G4-266 | the dance-off on an upright phone | iPhone upright | The host's dancer leaned out of the picture (crown, head and arm cut by the left edge). (viewer marks M-017 (pass 12)) | 1 | [after](pictures-4/stage3-glitches/G4-266-after.webp) | fixed |
| G4-267 | the owl's and the duck's outfits | iPad | A new owl's cape stood flat out of its back and its collar hung off its front; on the duck a box sat loose on its back. (viewer marks M-021 (pass 12), M-023 (pass 12)) | 2 | [after](pictures-4/stage3-glitches/G4-267-after.webp) | fixed |
| G4-268 | the little pictures of glowing furniture | iPad | The "Seafoam neon sign" in the Home shop showed white tubes, not seafoam. (viewer marks M-033 (pass 12)) | 1 | [after](pictures-4/stage3-glitches/G4-268-after.webp) | fixed |
| G4-269 | the job tutorials' pictures | iPad | Pizza, "Follow the dot": the hand right of the dot pointed away from it. Hairstylist: the picture's words were the line under it again ("Make the hair like the picture"). (viewer marks M-034 (pass 12), M-035 (pass 12)) | 1 | [after](pictures-4/stage3-glitches/G4-269-after.webp) | fixed |
| G4-270 | the photographer's framing | iPad | Two dark posts behind a tree by the football field ran up into its crown; the garden picture's lower half was the garden fence. (viewer marks M-001 (pass 12), M-002 (pass 12)) | 1 | — | not a glitch |
| G4-271 | decided before | iPhone upright, PC, iPad | A grey-haired figure in the market with her back to you; a dark half-round on the fruit stand; a small 🎨 at the corner map's foot; Mochi's tag at the joystick. (viewer marks M-004 (pass 12), M-012 (pass 12), M-024 (pass 12), M-037 (pass 12)) | 1 | — | not a glitch |
| G4-272 | the check's own staging | iPad | A friend walking by right in front of the fountain picture; the lamp post in each new pet's picture; the Halloween gate's signs at the screen's edges, one behind the notepad; the camera at the sky after a pick-up. (viewer marks M-018 (pass 12), M-019 (pass 12), M-020 (pass 12), M-022 (pass 12), M-027 (pass 12), M-028 (pass 12), M-029 (pass 12), M-031 (pass 12), M-032 (pass 12)) | 1 | — | not a glitch |
| G4-273 | the clock chip's rain | iPad, Android tablet | The chip showed 🌧️ while no rain fell, the scene still in sunshine (just after the weather turned). (viewer marks M-015 (pass 13), M-021 (pass 13), M-024 (pass 13)) | 1 | [after](pictures-4/stage3-glitches/G4-273-after.webp) | fixed |
| G4-274 | a photo shoot that never ended | iPad | After a photo job the corner map and the notepad were gone in town, with the phone's Photos chat open. (viewer marks M-023 (pass 13)) | 2 | [after](pictures-4/stage3-glitches/G4-274-after.webp) | fixed |
| G4-275 | quests | PC | "Snack time: Eat some flour"; "Buy 3 different treats" with flour among them. (viewer marks M-014 (pass 13)) | 1 | [after](pictures-4/stage3-glitches/G4-275-after.webp) | fixed |
| G4-276 | the Pet Shop's owl | iPad | The owl hung in the air in front of the wall, with its back to the room. (viewer marks M-025 (pass 13)) | 1 | [after](pictures-4/stage3-glitches/G4-276-after.webp) | fixed |
| G4-277 | the park garland at the bus stop | iPad | A holiday garland ran into the bus shelter under its roof. (viewer marks M-001 (pass 13), M-003 (pass 13)) | 1 | [after](pictures-4/stage3-glitches/G4-277-after.webp) | fixed |
| G4-278 | two ducks, a bird | iPhone sideways, PC | One duck on the pond, with a yellow head on a white body; a dark stick at the top of a photo. (viewer marks M-007 (pass 13), M-008 (pass 13), M-011 (pass 13), M-012 (pass 13)) | 1 | — | not a glitch |
| G4-279 | the salon floor | PC 1920 | The floor near the camera looked soft, the far tiles sharp. (viewer marks M-032 (pass 13)) | 1 | — | open |
| G4-280 | decided before | iPhone upright, PC, iPad | The upright phone's Pet Show picture boxed in by the truck, the fence and the pennants; the places list's ⬇️; the salon's sign under the round buttons. (viewer marks M-005 (pass 13), M-010 (pass 13), M-019 (pass 13)) | 1 | — | not a glitch |
| G4-281 | the check's own staging | iPad | Crates at the edge of the check's photo shoot; the Ideas Board in front of N16's camera; a townsperson's back in N21's; a post, a lamp post, a door at the camera; a friend partly behind another. (viewer marks M-016 (pass 13), M-020 (pass 13), M-022 (pass 13), M-026 (pass 13), M-027 (pass 13), M-028 (pass 13), M-029 (pass 13)) | 1 | — | not a glitch |
| G4-282 | the salon card's last word | iPad | The customer's words wrapped so the last emoji and the closing quote stood alone on a line ("💕”", "✨”"). (viewer marks M-004 (pass 14), M-006 (pass 14)) | 1 | [after](pictures-4/stage3-glitches/G4-282-after.webp) | fixed |
| G4-283 | the job box's distance | iPad | The job box broke its line before "· 86 m", the second line starting with the dot. (viewer marks M-005 (pass 14)) | 1 | [after](pictures-4/stage3-glitches/G4-283-after.webp) | fixed |
| G4-284 | the photo shoot at the Duck Pond | iPad | A thin dark strip at the bottom-right corner, under Snap. (viewer marks M-007 (pass 14)) | 1 | — | not a glitch |
| G4-285 | the phone's jobs on a sideways iPhone | iPhone sideways | Three job cards filled the phone screen; the other two (the Hairstylist, the Photographer) showed no part above its foot. (viewer marks M-003 (pass 14)) | 1 | — | open |
| G4-286 | your friends in a shop | iPad, dark theme | A friend half off the screen's edge in the toy shop; one with her back to you at the bakery's counter, her head in front of the menu's last lines. (viewer marks M-001 (pass 14), M-002 (pass 14)) | 1 | — | not a glitch |
| G4-287 | the designer's reveal | iPad | A see-through "Knock knock!" over the room. (viewer marks M-011 (pass 14), M-012 (pass 14)) | 1 | — | not a glitch |
| G4-288 | decided before | iPhone sideways | The hair card over the customer; an orange pet with a white wing half off the screen's bottom-left corner. (viewer marks M-014 (pass 14), M-015 (pass 14)) | 1 | — | not a glitch |
| G4-289 | the check's own staging | iPad, PC | Two grandmas right in front of N6's camera; "The Food truck is closed now" at noon; a tree in front of N25's camera at the Flower Corner. (viewer marks M-010 (pass 14), M-013 (pass 14), M-016 (pass 14)) | 1 | — | not a glitch |
| G4-290 | a quest's steps | iPhone upright, PC | A long step wrapped under its ○, and "Ice / Cream Shop" was split over two lines. (viewer marks M-003 (pass 15), M-010 (pass 15)) | 1 | [after](pictures-4/stage3-glitches/G4-290-after.webp) | fixed |
| G4-291 | the photo frame on a touch screen held sideways | iPhone sideways (and iPad) | The dashed photo frame sat right of the middle: the family you faced stood left of its middle, in the photo too. (viewer marks M-007 (pass 15)) | 1 | [after](pictures-4/stage3-glitches/G4-291-after.webp) | fixed |
| G4-292 | the clock chip on a cloudy night | iPad | A grey night sky with no stars while the clock chip showed 🌙. (viewer marks M-015 (pass 15)) | 1 | [after](pictures-4/stage3-glitches/G4-292-after.webp) | fixed |
| G4-293 | the path through the Tree Park's gate | PC | The path through the gate stopped in a straight edge in the grass a few steps past it. (viewer marks M-009 (pass 15)) | 1 | [after](pictures-4/stage3-glitches/G4-293-after.webp) | fixed |
| G4-294 | the Tree Park's crowns | iPad | A small row of brown saw-tooth marks on a yellow crown. (viewer marks M-001 (pass 15)) | 1 | — | open |
| G4-295 | a duck, a shop, two holiday views | iPad, iPhone upright | A grey lump on the pond at night; a chef's hat on the market's oranges; the Christmas tree's star cut by the screen's top; a firework burst at the screen's edge beside an older one's grey dots. (viewer marks M-002 (pass 15), M-006 (pass 15), M-013 (pass 15), M-014 (pass 15)) | 1 | — | not a glitch |
| G4-296 | decided before | iPhone upright, PC, iPad | The notepad over the Toy Store's sign on an upright phone; a dark half-circle on the fruit stand; townsfolk in party hats with their backs to N21's camera. (viewer marks M-004 (pass 15), M-011 (pass 15), M-016 (pass 15)) | 1 | — | not a glitch |
| G4-297 | the ducks and the lily flowers | iPhone sideways | The white duck sat on a lily pad, the pad's pink flower poking out at the duck's chest. (viewer marks M-005 (pass 16)) | 1 | [after](pictures-4/stage3-glitches/G4-297-after.webp) | fixed |
| G4-298 | a duck's eyes | PC, dark theme | The white duck's far eye showed as a white ring past its head's outline, like a googly eye. (viewer marks M-007 (pass 16)) | 1 | [after](pictures-4/stage3-glitches/G4-298-after.webp) | fixed |
| G4-299 | a friend behind a post, two ducks, the invitation card | iPad, PC | Luna half behind a lamp post beside the camera at the bus stop; the white duck behind the yellow one, its head over the yellow one's; N39's invitation card pale and see-through. (viewer marks M-001 (pass 16), M-006 (pass 16), M-009 (pass 16)) | 1 | — | not a glitch |
| G4-300 | decided before | iPhone upright, iPhone sideways | A grandma's back filling the fountain view; the pose card over the photo frame's right end. (viewer marks M-002 (pass 16), M-003 (pass 16), M-004 (pass 16)) | 1 | — | not a glitch |
| G4-301 | October: the bus shelter at the park | iPad | A thin white line lay on the shelter's roof, as if a garland string ran through the roof and its sign. (viewer marks M-001 (pass 17)) | 1 | [after](pictures-4/stage3-glitches/G4-301-after.webp) | fixed |
| G4-302 | the lake | iPad | The bench by the lake faced the grass, side-on to the water. (viewer marks M-004 (pass 17)) | 1 | [after](pictures-4/stage3-glitches/G4-302-after.webp) | fixed |
| G4-303 | a shop card in the dark theme | PC, dark theme | The Midnight cat tree's picture, dark navy, was hard to make out on the dark purple tile. (viewer marks M-008 (pass 17)) | 1 | [after](pictures-4/stage3-glitches/G4-303-after.webp) | fixed |
| G4-304 | inside a shop, at the door | PC | A shopper stood right against the camera at the edge of the view: a giant half face (the Pet Shop), a big yellow figure (the Flower shop). (viewer marks M-015 (pass 17), M-016 (pass 17)) | 1 | [after](pictures-4/stage3-glitches/G4-304-after.webp) | fixed |
| G4-305 | a grandma behind the bus shelter | PC | A tiny bubble, "The park is the heart of our town.", floated over the shelter's glass with nobody under it. (viewer marks M-017 (pass 17)) | 1 | [after](pictures-4/stage3-glitches/G4-305-after.webp) | fixed |
| G4-306 | the Tree Park's crowns (G4-294 again) | iPad | Small brown striped bits on a big yellow crown by the first deck of the hard path. (viewer marks M-002 (pass 17)) | 1 | — | open |
| G4-307 | the photographer's shoot at the pond's bench | iPhone sideways | The bench, the photo's background, was mostly behind Lily; a grey wall filled half the frame. (viewer marks M-012 (pass 17)) | 1 | — | open |
| G4-308 | the Home shop: two pieces, one picture | iPad | Armchair and Beanbag showed the same blue seat 💺. (viewer marks M-011 (pass 17)) | 1 | — | not a glitch |
| G4-309 | decided before | iPhone sideways, iPad | The ⬇️ over two tiles' corners on the Market card; N27's camera tipped up at the sky after a pick-up; the coin, food and clock chips gone while a photo's +120 popped. (viewer marks M-006 (pass 17), M-010 (pass 17), M-013 (pass 17)) | 1 | — | not a glitch |
| G4-310 | the phone: quests | iPhone upright | A cooking quest read "Cook cheese sandwich on your stove". (viewer marks M-003 (pass 18)) | 1 | [after](pictures-4/stage3-glitches/G4-310-after.webp) | fixed |
| G4-311 | a shop card: New in! | iPad, dark theme | "Grape dog house" and "Violet dog house" side by side looked like one item twice. (viewer marks M-002 (pass 18)) | 1 | [after](pictures-4/stage3-glitches/G4-311-after.webp) | fixed |
| G4-312 | the designer's new client | iPad | The card said "I live in the Apartments behind the Pet Shop, flat 11, near the Pet Shop". (viewer marks M-013 (pass 18)) | 1 | [after](pictures-4/stage3-glitches/G4-312-after.webp) | fixed |
| G4-313 | the photographer's first view of a shoot | iPhone sideways | Everyone's feet were below the photo frame at the shoot's start. (viewer marks M-018 (pass 18)) | 1 | [after](pictures-4/stage3-glitches/G4-313-after.webp) | fixed |
| G4-314 | a burst on a cloud, lines on a floor, a yellow bar | iPad, PC | A New Year burst resting on a cloud; thin lilac lines across a client room's wooden floor; a yellow bar at the bottom-right corner of a visit to a friend's house. (viewer marks M-006 (pass 18), M-014 (pass 18), M-015 (pass 18)) | 1 | — | not a glitch |
| G4-315 | decided before | iPad, iPhone upright, iPhone sideways | An older chat bubble cut under the header; a person close by at the left edge of an upright phone's view; a dark bar at the bottom-right of N25's pond shoot; the customer's head above the hair card on a sideways phone. (viewer marks M-001 (pass 18), M-004 (pass 18), M-007 (pass 18), M-010 (pass 18), M-011 (pass 18), M-020 (pass 18)) | 1 | — | not a glitch |
| G4-316 | the check's own staging | iPad | A white gate post at the edge of N20's February picture; N30's camera down in the fountain's pool. (viewer marks M-009 (pass 18), M-012 (pass 18)) | 1 | — | not a glitch |
| G4-317 | a photo shoot: a raised arm | iPad, PC | Mia's raised arm went straight up through her pigtail. (viewer marks M-003 (pass 19)) | 1 | [after](pictures-4/stage3-glitches/G4-317-after.webp) | fixed |
| G4-318 | the photographer's thank-you card | iPad | The photo on the card was soft: faces and name tags fuzzy. (viewer marks M-004 (pass 19)) | 1 | [after](pictures-4/stage3-glitches/G4-318-after.webp) | fixed |
| G4-319 | inside a shop | iPad, dark theme | A shopper walking past stood right at the camera in the Toy Store: a head and a body filled the left sixth of the view. (viewer marks M-005 (pass 19)) | 1 | [after](pictures-4/stage3-glitches/G4-319-after.webp) | fixed |
| G4-320 | the dance-off on a sideways phone | iPhone sideways | The score bar sat on the dancers' crowns and hid the mirror ball. (viewer marks M-013 (pass 19)) | 1 | [after](pictures-4/stage3-glitches/G4-320-after.webp) | fixed |
| G4-321 | 1 September: the school's banner | iPad | The end of the "School party today!" banner covered the front of the little roof over the door. (viewer marks M-014 (pass 19)) | 1 | [after](pictures-4/stage3-glitches/G4-321-after.webp) | fixed |
| G4-322 | a grandma's bubble at the duck pond | iPad, light and dark theme | Her bubble ran under the corner map: "eding the ducks is the best part of my day." (viewer marks M-020 (pass 19), M-021 (pass 19)) | 2 | [after](pictures-4/stage3-glitches/G4-322-after.webp) | fixed |
| G4-323 | a butterfly at the camera | iPad | A big gold block with a dark top hung in the air by the Easter bunny's bubble: a butterfly 1.3 m from the camera, its two flat wings. (viewer marks M-022 (pass 19)) | 1 | [after](pictures-4/stage3-glitches/G4-323-after.webp) | fixed |
| G4-324 | the hair job on a sideways phone | iPhone sideways | A big orange striped thing with a white ear filled the bottom-left corner under the hair card. (viewer marks M-017 (pass 19), M-018 (pass 19)) | 1 | — | open |
| G4-325 | a shopper and butterflies | iPad | A shopper facing you in the bakery, in front of Mrs. Crumb; purple and yellow pieces in a tree crown behind the food truck. (viewer marks M-002 (pass 19), M-015 (pass 19)) | 1 | — | not a glitch |
| G4-326 | decided before | iPad, iPhone sideways | The two ducks one behind the other after you feed them; your pets' tags over the pens upstairs in the Pet Shop; a townsperson close at the left edge by the Christmas tree; an older chat bubble cut under the header. (viewer marks M-001 (pass 19), M-006 (pass 19), M-011 (pass 19), M-016 (pass 19)) | 1 | — | not a glitch |
| G4-327 | the photographer: the photo in your phone's chat | iPad, iPhone sideways, PC | The kit's N25 failed on the f16 file: right after the thank-you card, the photo in the phone's chat had no size yet when the phone opened (it showed a moment later). | 2 | [after](pictures-4/stage3-glitches/G4-327-after.webp) | fixed |
| G4-328 | a grandma's bubble at the duck pond | iPhone sideways; iPad, light and dark theme | On a sideways phone her bubble ran under the clock chip and the top buttons: only "ducks is the ... of my day." could be read; on the iPad its corner lay on the clock chip. (viewer marks M-013 (pass 20), M-014 (pass 20), M-015 (pass 20), M-016 (pass 20), M-001 (pass 20), M-006 (pass 20), M-007 (pass 20), M-017 (pass 20), M-018 (pass 20)) | 2 | [before](pictures-4/stage3-glitches/G4-328-before.webp) · [after](pictures-4/stage3-glitches/G4-328-after.webp) | fixed |
| G4-329 | a photo shoot from the side | iPhone sideways | A white pill peeked out behind the "Pose: Mia" label at the right edge (only an "e" showed). (viewer marks M-003 (pass 20), M-005 (pass 20), M-011 (pass 20)) | 1 | [before](pictures-4/stage3-glitches/G4-329-before.webp) | open |
| G4-330 | not a glitch, decided before | iPad, dark theme | The notepad a cream lined paper in the dark theme; a shopper big at the right edge of the Toy Store, partly behind "Say hi". (viewer marks M-004 (pass 20), M-002 (pass 20), M-008 (pass 20), M-009 (pass 20), M-010 (pass 20)) | 1 | [before](pictures-4/stage3-glitches/G4-330-before.webp) | not a glitch |
| G4-331 | the photographer: your phone's chat | iPhone sideways | The chat opened at the foot of the thank-you message, so the top of its photo lay under the Photos header. (viewer marks M-004 (pass 21), M-006 (pass 21)) | 1 | [before](pictures-4/stage3-glitches/G4-331-before.webp) · [after](pictures-4/stage3-glitches/G4-331-after.webp) | fixed |
| G4-332 | not a glitch, decided before | iPhone sideways; iPad, dark theme | A palette badge on the corner map about 28 px across; the two ducks one on the other by the pond; two townsfolk at the right edge one in front of the other. (viewer marks M-001 (pass 21), M-002 (pass 21), M-003 (pass 21)) | 1 | [before](pictures-4/stage3-glitches/G4-332-before.webp) | not a glitch |
| G4-333 | not a glitch | iPad, dark theme | Two townsfolk at the right edge of the park, one squeezed in front of the other. (viewer marks M-001 (pass 22)) | 1 | [before](pictures-4/stage3-glitches/G4-333-before.webp) | not a glitch |
| G4-334 | the designer job: a two-room order | iPad | In room 2 (a forest living room) a white fridge stood inside a pink armchair. (viewer marks M-006 (pass 23 (the full final pass))) | 3 | [before](pictures-4/stage3-glitches/G4-334-before.webp) · [after](pictures-4/stage3-glitches/G4-334-after.webp) | fixed |
| G4-335 | a grandma's bubble on an upright phone | iPhone upright, dark theme | At the duck pond and the Flower Corner her bubble lay half under the corner map and the notepad ("...s the ...ay."; "...! Such a pretty garden."). (viewer marks M-008 (pass 23 (the full final pass)), M-016 (pass 23 (the full final pass))) | 2 | [before](pictures-4/stage3-glitches/G4-335-before.webp) · [after](pictures-4/stage3-glitches/G4-335-after.webp) | fixed |
| G4-336 | the food truck | iPad | A small grey ball on the truck's side by the awning's end. (viewer marks M-004 (pass 23 (the full final pass)), M-007 (pass 23 (the full final pass))) | 1 | [before](pictures-4/stage3-glitches/G4-336-before.webp) | open |
| G4-337 | the Christmas tree at night | iPad, dark theme | Two big white glows at the sides of the tree's middle washed out its edge. (viewer marks M-003 (pass 23 (the full final pass))) | 1 | [before](pictures-4/stage3-glitches/G4-337-before.webp) | open |
| G4-338 | the photographer's close view of the ducks | iPad | A big dark purple box at the right edge of the view, by the blue house. (viewer marks M-001 (pass 23 (the full final pass))) | 1 | [before](pictures-4/stage3-glitches/G4-338-before.webp) | open |
| G4-339 | not a glitch | iPad, iPhone upright, PC | Cattails in front of a grandma on the pond bench; a brown slab at the corner of N22's school view; someone at the left edge in the Pet Shop; two shoppers one behind the other in the flower shop; N24's two grandmas one behind the other on their bench. (viewer marks M-002 (pass 23 (the full final pass)), M-005 (pass 23 (the full final pass)), M-010 (pass 23 (the full final pass)), M-011 (pass 23 (the full final pass)), M-012 (pass 23 (the full final pass))) | 1 | [before](pictures-4/stage3-glitches/G4-339-before.webp) | not a glitch |
| G4-340 | a grandma's bubble at the Flower Corner | iPhone upright, light and dark theme | Clear of the map column since f19, her bubble ran past the right edge of the screen ("Such" cut, no right border). (viewer marks M-001 (pass 24), M-002 (pass 24), M-003 (pass 24), M-004 (pass 24), M-005 (pass 24), M-006 (pass 24), M-007 (pass 24), M-008 (pass 24)) | 2 | [before](pictures-4/stage3-glitches/G4-340-before.webp) · [after](pictures-4/stage3-glitches/G4-340-after.webp) | fixed |
| G4-341 | decided before | iPad | N8's designer pictures: faint "Knock knock!" over the sofa; thin lilac lines across the floor. (viewer marks M-001 (pass 25), M-002 (pass 25), M-003 (pass 25), M-004 (pass 25)) | 1 | [before](pictures-4/stage3-glitches/G4-341-before.webp) | not a glitch |

341 entries: 256 fixed, 68 not a glitch, 17 open.

## Each one in full

### G4-001 (fixed, how bad 3): the Flower Corner in the Easter month, when the game is opened
- Device: every device
- What's wrong: Opening the game in April (the Easter month): the title's town is decorated before any save is read, and the egg hunt's builder read the save (eggState) and threw; the error was caught, but the build had stopped halfway: no eggs drawn and no Easter Bunny at the corner until the date changed. Root cause: eggState assumed a loaded save.
- Found by: PHOTOGRAPHER (the browser log of the Easter pictures: TypeError at eggState), confirmed by a boot test with a faked April date
- Fix: eggState answers 'no egg found yet' when no save is loaded; after the save is read, startGame redraws the eggs without the ones this player already found
- Fix check: boot in April: before: bunny no, eggs drawn 0, 1 error; after: bunny yes, eggs drawn 24 of 25 (one already found in the test save), 0 errors

### G4-002 (fixed, how bad 2): the photographer job: the shoot
- Device: every device
- What's wrong: The player's own pets (and following friends) walked into every photo: they stood between the camera and the family with their big name tags, and ended up in the finished picture. (viewer marks M-013, M-043, M-110, M-113, M-121, M-129, M-131)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: During a shoot your pets and the friends who follow you wait out of the picture; they come back when the shoot ends. (The first fix hid them once and their every-frame visibility rule showed them again: pass 2 caught it, the rule itself now keeps them out.)
- Fix check: N25 and N3 pass; the pass-2 retake of the shoot shows the family alone.

### G4-003 (fixed, how bad 2): the photographer job: the viewfinder frame
- Device: every device, worst on iPhone sideways
- What's wrong: The dashed frame was drawn over the HUD: through the coin, apple and clock chips (they looked struck out), the corner map, the job box and the notepad. (viewer marks M-044, M-073, M-075, M-078, M-107, M-108, M-112, M-120, M-122, M-123, M-128, M-130, M-132)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: The frame starts under the chips and stops above the photo bar on an upright phone; the corner map, notepad and job box step aside during a shoot; the score uses the frame as it is really drawn.
- Fix check: N25 passes with the new frame.

### G4-004 (fixed, how bad 2): the photographer job: the pose card
- Device: iPad and phones sideways
- What's wrong: The pose card opened in the middle-bottom and covered the photo bar (the 🏞️ background chip and the − button) and, on a phone, the hint and the Snap! button. (viewer marks M-012, M-042, M-074)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: On a wide screen the pose card sits at the left, the family in the middle and the photo bar at the right stay in view.
- Fix check: pass-2 pose-card pictures.

### G4-005 (fixed, how bad 2): the photographer job: the result card
- Device: every device, worst on iPhone sideways
- What's wrong: The photo bar, the frame and the job box stayed on screen behind the result card, and on a short screen the card's '📸 Mia' name tab was pushed off the top. (viewer marks M-015, M-045, M-076, M-111)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: The frame and the bar go the moment the photo is taken; the name tab sits inside the card; the photo is at most 38% of the screen height.
- Fix check: pass-2 result pictures.

### G4-006 (fixed, how bad 2): the photographer job on an upright phone
- Device: iPhone upright
- What's wrong: The photo bar was 192 px wide ('the fou…'), the notepad and the job box covered a family member, and the hint toast sat on the family's heads. (viewer marks M-054, M-063, M-055, M-062, M-109)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: On an upright phone the bar spans the width; the side boxes hide during a shoot; the toast moves under the chips.
- Fix check: pass-2 upright-phone shoot picture.

### G4-007 (fixed, how bad 1): the photographer job on an upright phone: the pose step
- Device: iPhone upright
- What's wrong: The hint toast cut the corner map's palette badge in half. (viewer marks M-061)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: The toast moves under the chips during a shoot (the map hides then too).
- Fix check: pass 2.

### G4-008 (fixed, how bad 2): the party invitation
- Device: every device
- What's wrong: The invitation came twice at once: a message card ('…is hosting a party! Go check it out.') and the card with the two buttons on top of it, the message cut on both sides. (viewer marks M-011, M-041, M-069, M-106, M-119, M-127)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: Only the card with the buttons shows (it carries the host's name); the second message is gone. The kit's N39 now reads the card.
- Fix check: N39 passes.

### G4-009 (fixed, how bad 1): the party invitation and the dance-off card
- Device: iPhone upright
- What's wrong: The cards sat over the apple chip, the clock chip and the corner map. (viewer marks M-052, M-053)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: On an upright phone the two cards sit 150 px from the top, under the chips.
- Fix check: pass 2.

### G4-010 (fixed, how bad 1): the dance-off
- Device: iPhone upright
- What's wrong: The score bar sat on the apple chip. (viewer marks M-064)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: While dancing on an upright phone the chips hide (the score bar has coins and faces).
- Fix check: pass 2.

### G4-011 (fixed, how bad 2): the house colour card: 'Pick any colour'
- Device: every device
- What's wrong: The slider was a plain blue browser slider with a 14 px thumb and nothing showed the colour the house has now. (viewer marks M-050, M-118)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: A rainbow slider with a 44 px white thumb and a "Your house now" swatch that follows every change.
- Fix check: N34 passes; probe picture.

### G4-012 (fixed, how bad 1): the cards' scroll-down arrow
- Device: every device
- What's wrong: The little ⬇ arrow of a long card was 38 px, sat half outside the card's right edge over the mint ⬆ button, and on the settings card on top of the 'Bring my pets to…' button. (viewer marks M-036, M-037, M-038, M-040, M-068, M-097, M-099, M-101, M-103, M-105, M-049, M-060)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: The arrow is 46 px and sits on the card's bottom edge, under the words and buttons.
- Fix check: pass 2.

### G4-013 (fixed, how bad 1): the phone: Rosie's chat and job list
- Device: every device
- What's wrong: The chat header (back button, Rosie, the coin chip) scrolled away under the phone's top when the chat was long, its top cut. (viewer marks M-006, M-035, M-047, M-057, M-087, M-115, M-126)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: The header sticks to the top of the phone screen.
- Fix check: pass 2.

### G4-014 (fixed, how bad 1): the phone: Rosie's job cards
- Device: phones
- What's wrong: The job descriptions were 11 px on a narrow screen. (viewer marks M-058)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: 12.5 px.
- Fix check: pass 2.

### G4-015 (fixed, how bad 2): the big map
- Device: iPhone sideways
- What's wrong: The 📍 Me, + and − buttons sat on the map and cut the Duck Pond and Tree Park labels. (viewer marks M-066, M-094)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: On a phone held sideways the three buttons move up into the title row.
- Fix check: N26 passes; pass 2.

### G4-016 (not a glitch, how bad 1): the big map
- Device: iPhone sideways
- What's wrong: The 'Tap a place to see the way there!' bar lies over the bottom row of the map. (viewer marks M-095)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: By design: the map pans by dragging, the bar is the map's hint.

### G4-017 (fixed, how bad 1): the Pet Show stage
- Device: every device
- What's wrong: A balloon bunch stood in front of the stage's sign: 'Every Saturday!' read 'Saturda' or 'Saturday!' and the trophy was half hidden. (viewer marks M-017, M-018, M-019, M-021, M-023, M-025, M-046)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: Both balloon bunches stand at the stage's front corners.
- Fix check: probe picture; pass 2.

### G4-018 (fixed, how bad 1): the Pet Show judges
- Device: every device
- What's wrong: The three judges' name tags sat at one height in a row and piled up into one unreadable jumble from the square. (viewer marks M-014, M-016, M-020, M-022, M-024)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: The three tags hang at three heights.
- Fix check: pass 2.

### G4-019 (fixed, how bad 2): the Pet Show corner: bunting
- Device: every device
- What's wrong: The Halloween bunting pennants and the stage pennants were paper-thin: seen edge-on they looked like flat slivers floating over the food truck and sticking out of the stage posts. (viewer marks M-001, M-124)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: Every pennant is thicker (a flag that reads as a flag from any side).
- Fix check: N32 passes; pass 2.

### G4-020 (fixed, how bad 2): the grandmas' speech bubbles
- Device: every device, worst on phones
- What's wrong: A grandma's bubble sat right behind her head: her bun or hair hid a word, and on a phone the letters were 7 px. (viewer marks M-002, M-125, M-134, M-135, M-080)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: The bubble floats higher (above the bun) and is a quarter bigger.
- Fix check: N24 passes; pass 2.

### G4-021 (fixed, how bad 1): the Tree Park: the tall trees
- Device: every device
- What's wrong: A crown seen from its shady side was a flat muddy olive, like a dead tree among the bright ones. (viewer marks M-003, M-027)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: The park's crowns keep a glow of their own colour on the shady side (a little emissive light).
- Fix check: N37 passes; pass 2.

### G4-022 (fixed, how bad 2): inside the fire station
- Device: every device
- What's wrong: The fire bell was a yellow ball floating beside the sign with nothing holding it. (viewer marks M-004, M-032)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: A red plate and a short rod hold the bell to the wall.
- Fix check: pass 2.

### G4-023 (fixed, how bad 1): the Pet Shop upstairs
- Device: every device
- What's wrong: The button said 'Adopt a owl'. (viewer marks M-005)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: 'Adopt an owl' (a / an by the first letter).
- Fix check: N28 passes.

### G4-024 (fixed, how bad 1): the library
- Device: every device
- What's wrong: A slit of bare wall showed between the two middle bookcases. (viewer marks M-030)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: The four bookcases touch.
- Fix check: pass 2.

### G4-025 (fixed, how bad 1): my house, the upper floors
- Device: every device
- What's wrong: The back-wall windows of floors 2 to 6 were unevenly spaced. (viewer marks M-033)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: Four windows, evenly spaced (also for the wide house).
- Fix check: N34 passes; pass 2.

### G4-026 (fixed, how bad 2): the Flower Corner gate
- Device: every device
- What's wrong: A pavement tree stood right in front of the open gate and hid it and the start of the stepping stones. (viewer marks M-079, M-136)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: That tree stands 3 m further west.
- Fix check: pass 2.

### G4-027 (fixed, how bad 2): the classroom
- Device: iPad
- What's wrong: A kid's name tag covered the tag of the kid behind. (viewer marks M-139)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: Name tags and bubbles step apart on screen (the same rule the football kids had since night 3, now also for friends and classroom kids).
- Fix check: teacher stage of the full check.

### G4-028 (fixed, how bad 2): the friends who follow you
- Device: every device
- What's wrong: When the four friends gathered, one stood behind another and the front one's tag covered the other's. (viewer marks M-142, M-144, M-145)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: Their tags step apart on screen.
- Fix check: N3 passes.

### G4-029 (fixed, how bad 2): the designer job: the new-client message
- Device: iPad
- What's wrong: The '+20 🪙' coin pop and the 'Knock knock!' card landed on the message card and hid its lines. (viewer marks M-140, M-141)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: While a message card is up, the coin pop and the knock card keep under it.
- Fix check: pass 2 / the full check.

### G4-030 (fixed, how bad 2): the spooky path: a scare
- Device: iPad
- What's wrong: The 'BOO! 👻' words floated 2.1 m up, above the top of the screen when the ghost was close. (viewer marks M-155)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: The words float at eye height.
- Fix check: N19 of the full check.

### G4-031 (fixed, how bad 1): October: the little ghosts
- Device: iPad
- What's wrong: A little ghost drifted right into the camera and filled a third of the view for a moment. (viewer marks M-143)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: Fixed with G4-118: ghosts and bats glide round the camera (50db62c) and keep 3 m from it (9777d26); pass 8 saw no ghost at the camera.
- Fix check: pass 8 pictures.

### G4-032 (not a glitch, how bad 1): the park by the food truck
- Device: iPad
- What's wrong: Flat yellow bars seemed to stick out of the truck's wheels. (viewer marks M-147)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: Looked at: they are the park's butterflies (flat cartoon wings) flying past the wheels; a wing seen edge-on is a bar. The food truck itself passes N32.

### G4-033 (not a glitch, how bad 1): cards and the phone on a short screen
- Device: iPhone sideways (and the Pet Shop card on iPad)
- What's wrong: A tall card, a tutorial card or the phone covers the HUD chips and buttons behind it. (viewer marks M-039, M-067, M-070, M-071, M-072, M-084, M-085, M-086, M-088, M-089, M-090, M-091, M-092, M-093, M-096, M-098, M-100, M-102, M-104)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: By design: a card or the phone takes the screen while it is open (the HUD behind is dimmed and cannot be tapped); on a 390-px-tall screen there is no room beside it.

### G4-034 (fixed, how bad 2): the cards' scroll-down arrow
- Device: every device
- What's wrong: The ⬇ arrow of a long card sat on the card's bottom edge and still covered the end of the last visible row: 'Move my ga…', 'Show me the ti…', 'Bring my pets to me', the end of the colour slider, a shop tile's price. (viewer marks M-007, M-011, M-028, M-035, M-058, M-060, M-066, M-067, M-070, M-074, M-075, M-076, M-077, M-086 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The arrow sits outside the card when there is room (under it, else beside it); only on an upright phone it stays on the bottom edge, in the right corner over the padding.
- Fix check: pass 3 pictures of settings, the shops and the colour card.

### G4-035 (fixed, how bad 2): the phone: Rosie's chat and the job list
- Device: every device
- What's wrong: Earlier bubbles and job cards scrolled under the chat header and showed through it (it was 94% white) and beside it; a long title ('Photo booking') was cut without an ellipsis. (viewer marks M-006, M-010, M-027, M-034, M-049, M-065, M-069, M-073, M-105 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The header is solid white, spans the whole phone screen width and a long title ends in …
- Fix check: pass 3 phone pictures.

### G4-036 (fixed, how bad 2): the party invitation and the dance-off card
- Device: iPhone upright
- What's wrong: The cards were drawn over the corner map and the top of the notepad: a sliver of map and "Write here!" poked out at their edges. (viewer marks M-013, M-014, M-037, M-038 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: While one of the cards is up on an upright phone, the corner map and the notepad hide.
- Fix check: pass 3 upright-phone card pictures.

### G4-037 (fixed, how bad 1): the photographer job: the frame
- Device: iPhone upright
- What's wrong: The dashed frame ran straight through the apple chip and down the side of the chips. (viewer marks M-016, M-017, M-040, M-041 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: On an upright phone the frame starts 150 px down, under the three chips (the hint toast moves under it).
- Fix check: pass 3 upright-phone shoot pictures.

### G4-038 (fixed, how bad 2): the photographer job: the joystick
- Device: iPhone upright
- What's wrong: The joystick ring sat under the photo bar (the bar spans the width on an upright phone), so a child could not walk to frame the photo. (viewer marks M-018, M-106 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: During a shoot on an upright phone the joystick moves up above the bar.
- Fix check: pass 3.

### G4-039 (fixed, how bad 2): the photographer job: the pose card
- Device: iPhone sideways
- What's wrong: The pose card was taller than the screen: the Hug and Sit tiles ran off the bottom with no scroll hint. (viewer marks M-061, M-068 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: On a short sideways screen the pose card scrolls inside the screen (44-px pose buttons, tighter rows).
- Fix check: pass 3 sideways-phone pose-card picture.

### G4-040 (fixed, how bad 2): the photographer job: the result card
- Device: iPhone sideways and upright
- What's wrong: The result card ran off the bottom of a sideways phone (the Bye! button on the edge); on an upright phone the '+120 🪙' pop was half behind the card; in the kit's pictures the '🏞️ the hedge' toast was still drawn over the card. (viewer marks M-063, M-042, M-109 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: On a short sideways screen the card keeps side margins and a smaller photo (24% of the height); the coin pop floats higher while a bottom card is up; the background toast clears the moment the photo is taken.
- Fix check: pass 3 result pictures; N25 passes.

### G4-041 (fixed, how bad 1): the phone on a short screen
- Device: iPhone sideways
- What's wrong: The dimmed clock chip and the chat button peeked out above the phone's top edge. (viewer marks M-047, M-048, M-050, M-051, M-052, M-053, M-054, M-055, M-056 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: On a screen under 500 px tall the chips and the chat button hide while the phone is open.
- Fix check: pass 3 sideways-phone phone pictures.

### G4-042 (fixed, how bad 2): the park: the food truck
- Device: every device
- What's wrong: The Halloween bunting (and the Valentine garland) hung across the front of the food truck: its pennants looked stuck to the truck's body, 'pink and yellow slivers and a purple one across the wheel'. (viewer marks M-021, M-079, M-090, M-096 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: Both garlands now start east of the truck (x −32.2 instead of −38).
- Fix check: N23 and N32 pass; pass 3 truck pictures.

### G4-043 (fixed, how bad 2): the Flower Corner in October
- Device: every device
- What's wrong: The spooky path's purple discs ran beside the garden's white stepping stones for the first 6 m: a double row, 'floating stones'. (viewer marks M-043, M-064 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The purple trail starts where the white stones end and winds 21.9 m deeper into the corner (its 6 scare spots follow it).
- Fix check: N19 passes; pass 3 Flower Corner pictures.

### G4-044 (fixed, how bad 1): the spooky path at night
- Device: iPad
- What's wrong: The little path lamps were plain dark cubes with no glow after 18:00. (viewer marks M-084 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The lamp glass is a self-lit material: it reads as a lamp by night and by day.
- Fix check: pass 3 spooky path picture.

### G4-045 (fixed, how bad 1): the Easter hunt eggs
- Device: every device
- What's wrong: A plain white ball (meant as a shine) bulged out of the egg between its two gold bands. (viewer marks M-080 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The ball is gone; the gold bands stay.
- Fix check: pass 3 Easter egg picture.

### G4-046 (fixed, how bad 1): the Christmas tree at night
- Device: iPad
- What's wrong: The tree's night glows sat inside the branches, so they showed as bright yellow, cyan and pink chevron slivers poking out of the lower branches. (viewer marks M-081, M-088 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The 24 glows sit on the tree's surface (the cone radius at each height plus 14 cm).
- Fix check: pass 3 December night picture.

### G4-047 (fixed, how bad 1): inside the fire station
- Device: every device
- What's wrong: The 'Fire Station' sign's right end lay over the bell's red plate. (viewer marks M-004, M-026 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The bell (plate, rod, bell and its button) moved 50 cm to the right.
- Fix check: pass 3 fire station picture.

### G4-048 (fixed, how bad 1): the grandmas' speech bubbles
- Device: iPad
- What's wrong: A grandma's own head still covered the middle of her bubble from a low angle. (viewer marks M-032 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The bubble floats 10 cm higher and is drawn over everything (no depth test), like a comic bubble.
- Fix check: N24 passes; pass 3.

### G4-049 (fixed, how bad 2): the photographer job: the shoot
- Device: every device
- What's wrong: A passer-by walked between the camera and the family and hid them. (viewer marks M-008 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: A townsperson who comes within 3 m of the line from the camera to the family steps out of the picture (hidden) until the shoot ends.
- Fix check: pass 3 shoot pictures.

### G4-050 (fixed, how bad 1): the kit's own pictures (N25 and N37)
- Device: iPad and iPhone sideways
- What's wrong: The kit took its result picture while the snap flash was on (washed out) and its Tree Park pictures mid-fade (a dark veil). (viewer marks M-104, M-108, M-111, M-092, M-093 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The kit waits 700 ms after the snap and 900 ms after entering the park (cozy-check-v6.zip updated).
- Fix check: the N25 and N37 pictures of the next run.

### G4-051 (fixed, how bad 1): the photographer job: the bus pill
- Device: iPhone sideways and PC
- What's wrong: The 'Next bus' pill sat across the frame's top-left corner. (viewer marks M-107, M-110 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The bus pill hides during a shoot.
- Fix check: pass 3.

### G4-052 (fixed, how bad 1): the Pet Shop's 'New in' tiles
- Device: iPhone upright
- What's wrong: The colour dot of a long name wrapped onto a line of its own. (viewer marks M-036 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The dot is glued to the last word (a non-breaking space).
- Fix check: pass 3 pet shop card.

### G4-053 (fixed, how bad 1): settings
- Device: iPhone upright
- What's wrong: 'Fast' wrapped alone under 'Slow' and the 'Show me the tips' buttons broke into two lines. (viewer marks M-012 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: On a screen under 430 px wide the settings rows use smaller buttons that do not wrap.
- Fix check: pass 3 upright-phone settings picture.

### G4-054 (fixed, how bad 1): the park: the butterflies and the stage pennants
- Device: every device
- What's wrong: The park's butterflies flying low over the grass read as flat shards or 'two red sheets' dropped by the stage; the stage's end pennants stuck out past its posts. (viewer marks M-001, M-071, M-078 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The butterflies are a quarter smaller and fly 30 cm higher; the pennants hang inside the posts.
- Fix check: pass 3 stage pictures.

### G4-055 (not a glitch, how bad 1): the photographer (not the game)
- Device: iPad, iPhone upright
- What's wrong: Two camera spots were bad: the bakery spot stood inside the counter, the dance-card spot was left wherever the previous picture ended (against a fence). (viewer marks M-003, M-015 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: Photographer errors: the indoor spots were tried at three depths and set per room; every card picture now has a park backdrop.
- Fix check: pass 3.

### G4-056 (not a glitch, how bad 1): the clock chip in the kit's pictures
- Device: iPad
- What's wrong: The chip said ☀️ while rain streaks fell, 🌧️ under a clear sky, and ☀️ 10:00 at dusk. (viewer marks M-091, M-095, M-097 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The kit forces the weather and the sky for those pictures and the change takes a few seconds (the rain fades out, the sky lerps); the chip follows the game's own weather. Nothing a player sees.
- Fix check: —

### G4-057 (not a glitch, how bad 1): the notepad on a sideways phone
- Device: iPhone sideways
- What's wrong: The small notepad is 104 × 68 px there and its 'Write here!' hint about 11 px. (viewer marks M-098 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: By design: the small pad is the button that opens the big pad; on a short screen it shrinks with the corner map (decided in night 3).
- Fix check: —

### G4-058 (not a glitch, how bad 1): the friends who follow you, in October
- Device: iPad
- What's wrong: Halloween ghosts drifted between the camera and the friends and hid one; one friend stood in line behind another. (viewer marks M-101, M-102 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The ghosts drift on; the friends stand 1.2 m apart in a loose arc and one can be in line with another from the camera for a moment (N3 holds).
- Fix check: —

### G4-059 (not a glitch, how bad 1): a pet's name tag
- Device: iPad
- What's wrong: The 'Waffles' tag was partly behind the witch hat's pompom of the player's own costume. (viewer marks M-083 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The own hat sits on the camera; a pet right behind the player can put its tag behind the brim for a moment. Not changed.
- Fix check: —

### G4-061 (not a glitch, how bad 1): the Toy Store's sign
- Device: PC
- What's wrong: '🧸 Toy Store' seemed to sit left of the middle of its long white board. (viewer marks M-072 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: Looked at: the text is centred on the board (the sign plane and the board share x 0, and the drawing centres the measured ink twice); the camera stood near the board's right end, so the near half of the board looks much bigger in perspective. Nothing to change.
- Fix check: —

### G4-062 (not a glitch, how bad 1): inside the Market
- Device: iPhone upright
- What's wrong: An orange strip with a crisp dark edge seemed to run down the floor from the player. (viewer marks M-046 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: Looked at: it is the stand's own wooden top showing in the 15 cm gap between two fruit bins, seen from straight above them. Nothing to change.
- Fix check: —

### G4-063 (fixed, how bad 2): the Pet Shop upstairs
- Device: every device
- What's wrong: No pen had its name sign: the wall above the dog, cat, bunny and capybara pens was bare, and the hamsters had no sign either. (viewer marks M-005 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: Cause: the upstairs group is already placed 40 m along, and the signs added those 40 m a second time, so every sign hung 40 m outside the room. They now use the group's own coordinates. (The first look called this "not a glitch" from the code alone; a pass-3 viewer saw the bare wall again.)
- Fix check: N28 passes; pass 4 Pet Shop upstairs picture.

### G4-060 (not a glitch, how bad 1): cards over the HUD
- Device: iPad, iPhone sideways
- What's wrong: The Clothing store card covered the time chip; the big map's 'Tap a place' bar lies over the bottom row of the map. (viewer marks M-085, M-099 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: By design (see G4-016 and G4-033).
- Fix check: —

### G4-064 (fixed, how bad 1): the bus stop at the park
- Device: iPad
- What's wrong: The bus stop's pole ran up across the front of its round sign and put a dark line through the bus picture. (viewer marks M-005 (pass 3), M-006 (pass 3), M-007 (pass 3), M-008 (pass 3), M-010 (pass 3), M-012 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The pole stands behind the round sign and ends in it (a7dbc07).
- Fix check: pass 4 and 5 pictures of the bus stop.

### G4-065 (fixed, how bad 1): the party invitation and the dance-off card
- Device: iPad, iPhone
- What's wrong: The two answer buttons ("✅ I'll come!" / "🙅 Not this time", "💃 Let's dance!" / "🙅 Not now") touched, with no gap, so it was easy to tap the wrong one. (viewer marks M-009 (pass 3), M-011 (pass 3), M-094 (pass 3), M-095 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The party cards' buttons have a gap (2c0c488).
- Fix check: pass 4 pictures of the two cards.

### G4-066 (fixed, how bad 1): the hairstylist tutorial
- Device: every device
- What's wrong: In the tutorial picture the 👉 hand under the door pointed at empty space, not at the chair or the customer. (viewer marks M-013 (pass 3), M-098 (pass 3), M-163 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The hand points at the chair (2c0c488).
- Fix check: pass 4 tutorial pictures.

### G4-067 (fixed, how bad 1): the photographer tutorial
- Device: every device
- What's wrong: The booking line "family photo · the fountain" was squeezed against the 📸 icon and nearly touched the right border. (viewer marks M-014 (pass 3), M-100 (pass 3), M-165 (pass 3), M-025 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The booking line has room (2c0c488).
- Fix check: pass 5 PC tutorial picture: the line sits clear of the icon.

### G4-068 (fixed, how bad 2): the photographer's pose card
- Device: iPad, iPhone sideways
- What's wrong: The "Pick a pose" card covered one of the people being posed (Mia in pass 3; Zoe from the eyes down in passes 4 and 5). (viewer marks M-015 (pass 3), M-038 (pass 3), M-102 (pass 3), M-013 (pass 4), M-031 (pass 4), M-009 (pass 5), M-023 (pass 5), M-050 (pass 5), M-068 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3, pass 4, pass 5)
- Fix: Pass 3: the single pose card opens away from the person (5e94f9c). Pass 4: on a wide screen the card is narrower, three poses a row (002c9f6). Pass 5: at most 30% of the width, the margin beside a framed family (ceb35b2). The pictures of this pass were taken before the fix went in.
- Fix check: a probe of the pose card on a sideways iPhone and an iPad after ceb35b2: all three people in view beside the card; pass 6 pictures.

### G4-069 (fixed, how bad 1): the photo frame
- Device: iPad, PC
- What's wrong: The dashed photo frame ran under the round 💬📱🎒⚙️ buttons; the ⚙️ button hid its corner. (viewer marks M-016 (pass 3), M-018 (pass 3), M-166 (pass 3), M-167 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The frame starts under the round top buttons (2c0c488), and the photo is what the frame shows (9777d26).
- Fix check: pass 4 and 5 photo-shoot pictures.

### G4-070 (fixed, how bad 2): a photo shoot
- Device: iPad
- What's wrong: The three posing people stood so close that their waving arms went into the next person's head. (viewer marks M-017 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The people in a photo stand 1 m apart (a7dbc07).
- Fix check: pass 4 photo-shoot pictures.

### G4-071 (fixed, how bad 1): the Pet Show stage
- Device: iPad, PC
- What's wrong: The yellow "🏆 Pet Show" board ran behind the right red pillar, so its last letter touched the pillar. (viewer marks M-020 (pass 3), M-025 (pass 3), M-029 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The board is 2.8 m wide, clear of the pillars (a7dbc07), with wider margins (9777d26).
- Fix check: N23 passes (nothing crosses the Pet Show sign); pass 5 stage pictures.

### G4-072 (fixed, how bad 1): the Toy Store window
- Device: iPad
- What's wrong: A thin dashed vertical line ran down the big right window just inside its edge (and down the pink corner post), at night and in rain. (viewer marks M-021 (pass 3), M-023 (pass 3), M-025 (pass 5), M-026 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3, pass 5)
- Fix: Cause, found by rendering the spot with every mesh switched off in halves: the shop window's frame and sill ran 7 to 22 cm into the corner post at the front, and the glass 7 cm. The post's side, seen almost edge-on, won some of the screen's sub-pixel depth tests against the glass in front of it. The windows now end 3 cm short of the posts on every flat-roofed shop (57358da). The pictures of this pass were taken before the fix went in.
- Fix check: the same night view rendered after the fix: no dark pixel column left on the glass.

### G4-073 (fixed, how bad 1): the Tree Park gate
- Device: iPad
- What's wrong: The earth path stopped at the gate posts and a tree trunk stood in the middle of the gateway. (viewer marks M-026 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The path goes on through the gate and the tree behind it stepped aside (5e94f9c).
- Fix check: pass 4 and 5 gate pictures.

### G4-074 (fixed, how bad 1): a shopper in the Café
- Device: iPad
- What's wrong: On the orange-haired shopper the bob's hem band covered the cheeks down to the mouth. (viewer marks M-027 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The bob's hem wraps round the back only; the long styles' side panels sit a hair behind the face, so they no longer flicker (d00af6b).
- Fix check: pass 5 Café pictures.

### G4-075 (fixed, how bad 2): the Clothes Shop
- Device: iPad
- What's wrong: Under the clothes racks the back wall had blurry grey streaks, like dirt. (viewer marks M-028 (pass 3), M-010 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: They were the shirts' soft shadows; the racks by the back wall cast no shadow (7f754f0) and bake with the walls (2502632).
- Fix check: pass 4 and 5 Clothes Shop pictures.

### G4-076 (not a glitch, how bad 1): cards over the clock chip
- Device: iPad, PC
- What's wrong: An open card (bag, settings, a shop, the costumes) covered most of the weather/time chip; only its icon poked out. (viewer marks M-033 (pass 3), M-035 (pass 3), M-036 (pass 3), M-037 (pass 3), M-155 (pass 3), M-156 (pass 3), M-157 (pass 3), M-158 (pass 3), M-182 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: By design (G4-033, G4-060): a card takes the screen while it is open; the HUD behind is dimmed and cannot be tapped.
- Fix check: —

### G4-077 (fixed, how bad 1): the phone
- Device: iPhone
- What's wrong: The phone frame's bottom edge lay over the joystick and the run and jump buttons, which poked out from under it. (viewer marks M-039 (pass 3), M-040 (pass 3), M-041 (pass 3), M-042 (pass 3), M-043 (pass 3), M-044 (pass 3), M-045 (pass 3), M-046 (pass 3), M-047 (pass 3), M-076 (pass 3), M-077 (pass 3), M-078 (pass 3), M-079 (pass 3), M-080 (pass 3), M-081 (pass 3), M-082 (pass 3), M-083 (pass 3), M-084 (pass 3), M-113 (pass 3), M-114 (pass 3), M-116 (pass 3), M-117 (pass 3), M-119 (pass 3), M-120 (pass 3), M-121 (pass 3), M-122 (pass 3), M-124 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The joystick and the buttons hide while the phone is open (5e94f9c); closing the phone shows them again (2c0c488).
- Fix check: pass 4 and 5 phone pictures.

### G4-078 (fixed, how bad 2): a long card's scroll arrow
- Device: iPhone sideways
- What's wrong: The card's ⬇️ scroll arrow sat on top of the big ⬆️ jump button. (viewer marks M-127 (pass 3), M-129 (pass 3), M-131 (pass 3), M-133 (pass 3), M-136 (pass 3), M-142 (pass 3), M-143 (pass 3), M-144 (pass 3), M-146 (pass 3), M-147 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The scroll arrow never lands on the run or jump button (5e94f9c).
- Fix check: pass 4 pictures of the bag, settings and shop cards.

### G4-079 (fixed, how bad 2): a long card's scroll arrow
- Device: iPhone upright
- What's wrong: The round ⬇️ arrow sat on the last row of a tall card: on "🐾 Bring my pets to…", then on "📦 Move my game" (cut to "Move my ga") and on a shop tile's corner. (viewer marks M-048 (pass 3), M-088 (pass 3), M-091 (pass 3), M-060 (pass 4), M-028 (pass 5), M-037 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3, pass 4, pass 5)
- Fix: On an upright phone a card taller than the screen gets a little shorter, so its ⬇️ sits under it, never on its words (002c9f6). The pictures of this pass were taken before the fix went in.
- Fix check: a probe of Settings, the Market and the Pet Shop on an upright iPhone after the fix: the arrow sits under the card.

### G4-080 (fixed, how bad 2): the pose card
- Device: iPhone sideways
- What's wrong: The ⬇️ arrow sat on the bottom-right corner of the "Jump" tile. (viewer marks M-079 (pass 4), M-097 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: On a sideways phone the pose card fits without scrolling (three poses a row), so it has no arrow (9777d26).
- Fix check: pass 5 pose-card pictures.

### G4-081 (fixed, how bad 2): the big map
- Device: PC
- What's wrong: The ⬇️ arrow sat on the last row of the place list, over "Beach" and "Bus stop". (viewer marks M-106 (pass 4), M-113 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The list shows "more below" as a soft fade (9777d26).
- Fix check: pass 5 big-map pictures.

### G4-082 (fixed, how bad 1): cards on a phone
- Device: iPhone
- What's wrong: A card cut HUD pieces in half: the corner map under its top edge, the round buttons poking above it, the joystick under its bottom edge. (viewer marks M-052 (pass 3), M-057 (pass 3), M-058 (pass 3), M-059 (pass 3), M-086 (pass 3), M-087 (pass 3), M-089 (pass 3), M-090 (pass 3), M-092 (pass 3), M-093 (pass 3), M-096 (pass 3), M-097 (pass 3), M-099 (pass 3), M-128 (pass 3), M-130 (pass 3), M-132 (pass 3), M-134 (pass 3), M-135 (pass 3), M-139 (pass 3), M-148 (pass 3), M-149 (pass 3), M-150 (pass 3), M-152 (pass 3), M-095 (pass 4), M-096 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3, pass 4)
- Fix: On a phone a card that takes the screen hides the HUD pieces it would cut in half (2c0c488); tall cards start under the HUD row (5e94f9c); the pose card's top buttons step aside (9777d26).
- Fix check: pass 4 and 5 card pictures.

### G4-083 (fixed, how bad 1): party and holiday garlands
- Device: iPhone, PC
- What's wrong: The garland string was a staircase of separate pieces and the flags hung 10 px below it, joined to nothing. (viewer marks M-053 (pass 3), M-054 (pass 3), M-055 (pass 3), M-056 (pass 3), M-020 (pass 3), M-021 (pass 3), M-022 (pass 3), M-023 (pass 3), M-024 (pass 3), M-031 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The flags hang from their string (2c0c488) and every piece of string runs point to point, one sagging line (50db62c).
- Fix check: pass 4 and 5 pictures of the party cards and the Flower Corner.

### G4-084 (fixed, how bad 1): the pose card
- Device: iPhone
- What's wrong: The photo bar behind the card showed as dark rims around its bottom edge. (viewer marks M-060 (pass 3), M-101 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The bar hides under the card (5e94f9c), and a rule that only looked at the card's class now also asks that the panel is open (2c0c488).
- Fix check: pass 4 pictures.

### G4-085 (fixed, how bad 2): a photo shoot
- Device: iPhone
- What's wrong: The joystick ring sat inside the photo frame, over the family's legs. (viewer marks M-062 (pass 3), M-103 (pass 3), M-138 (pass 3), M-151 (pass 3), M-080 (pass 4), M-082 (pass 4), M-098 (pass 4), M-101 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3, pass 4)
- Fix: Upright: the frame sits above the joystick and the bar like a camera app (2c0c488). Sideways: the joystick moves to the screen's left edge while a shoot is on (50db62c).
- Fix check: pass 5 photo-shoot pictures.

### G4-086 (fixed, how bad 1): a photo shoot
- Device: every device
- What's wrong: The white aim dot sat on Leo's forehead. (viewer marks M-063 (pass 3), M-104 (pass 3), M-168 (pass 3), M-028 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: No aim dot during a shoot (2c0c488).
- Fix check: pass 4 and 5 photo-shoot pictures (a pass-5 viewer saw it gone).

### G4-087 (fixed, how bad 1): the photo result
- Device: iPhone
- What's wrong: The "+120 🪙" pop overlapped the 💬 and 📱 buttons. (viewer marks M-065 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The coin pop avoids the chips and buttons (50db62c).
- Fix check: pass 5 result pictures.

### G4-088 (open, how bad 1): sun shadows
- Device: iPad
- What's wrong: Faint stripes and saw-tooth edges in the sun's shadows: on the fountain basin's side, under window sills and eaves, on the tree crowns at the Tree Park. (viewer marks M-066 (pass 3), M-001 (pass 3), M-004 (pass 3), M-006 (pass 3), M-001 (pass 5), M-003 (pass 5), M-004 (pass 5), M-013 (pass 5), M-014 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3, pass 5)
- Fix: Not fixed in stage 3. The sun's shadow map is 2048 px over 60 m, chosen for the iPad; its edges are soft and a little saw-toothed and round surfaces almost edge-on to the sun show faint stripes. A sharper map would cost the iPad four times the memory, and a tighter one would cut the shadows off nearer to you.
- Fix check: —

### G4-089 (fixed, how bad 1): the Flower Corner in October
- Device: iPhone
- What's wrong: The purple path patches showed as broken purple dashes on the grass. (viewer marks M-069 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The spooky path stones are lifted off the grass (2c0c488).
- Fix check: pass 4 Flower Corner pictures.

### G4-090 (fixed, how bad 2): the shop ceiling lamp
- Device: iPhone, iPad
- What's wrong: Seen from below near the door the lamp showed as black wedges (its outline shell); without the outline (9777d26) it read as a faint, see-through smudge on the cream ceiling. (viewer marks M-072 (pass 3), M-073 (pass 3), M-075 (pass 3), M-109 (pass 3), M-111 (pass 3), M-056 (pass 4), M-057 (pass 4), M-073 (pass 4), M-074 (pass 4), M-016 (pass 5), M-032 (pass 5), M-033 (pass 5), M-035 (pass 5), M-043 (pass 5), M-044 (pass 5), M-045 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3, pass 4, pass 5)
- Fix: A pink shade with a darker rim on a short stem, still without an outline shell (fda1555). The pictures of this pass were taken before the fix went in.
- Fix check: a probe of the Market on an upright iPhone after the fix: a solid pink lamp.

### G4-091 (fixed, how bad 2): the phone: Rosie's chat
- Device: iPhone sideways, PC
- What's wrong: Earlier messages and job cards scrolled up under the floating chat header and showed cut in half above it. (viewer marks M-115 (pass 3), M-140 (pass 3), M-153 (pass 3), M-033 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The phone header sits flush at the top of the screen (5e94f9c).
- Fix check: pass 4 phone pictures.

### G4-092 (not a glitch, how bad 1): the big map
- Device: iPhone sideways
- What's wrong: The "Duck Pond" label ran over Finn's name tag. (viewer marks M-125 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: A friend's tag on the map can pass under a place name for a moment as they walk; both stay readable.
- Fix check: —

### G4-093 (fixed, how bad 1): the big map
- Device: iPhone
- What's wrong: The "👆 Tap a place…" bar lay over the bottom row of places (Cozy Park, Pet Shop, Football Field). (viewer marks M-141 (pass 3), M-059 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3, pass 4)
- Fix: The map scrolls its bottom row up above the hint card (405e0ae).
- Fix check: pass 5 big-map pictures.

### G4-094 (fixed, how bad 1): the Pet Shop card
- Device: iPhone sideways
- What's wrong: "Mint dog house" wrapped its colour dot onto a line of its own, so its price sat lower than its neighbours'. (viewer marks M-145 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: A New-in tile's colour dot always sits under its name (5e94f9c).
- Fix check: pass 4 Pet Shop pictures.

### G4-095 (fixed, how bad 1): the party, dance and tutorial cards
- Device: PC
- What's wrong: These cards stayed bright white in the dark theme while every other card went dark. (viewer marks M-159 (pass 3), M-160 (pass 3), M-161 (pass 3), M-162 (pass 3), M-164 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: They follow the light/dark theme (2c0c488).
- Fix check: pass 4 dark-theme pictures.

### G4-096 (fixed, how bad 2): a photo shoot
- Device: iPhone sideways
- What's wrong: The "📸 Pose everyone…" hint sat in the middle of the frame over the heads and name tags (and on the − / + Zoom buttons). (viewer marks M-137 (pass 3), M-081 (pass 4), M-100 (pass 4), M-150 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3, pass 4)
- Fix: The hint clears at the snap (5e94f9c), never sits on the photo bar (50db62c) and goes when a pose card opens (9777d26).
- Fix check: pass 5 pictures.

### G4-097 (fixed, how bad 2): the big map
- Device: PC
- What's wrong: The pink "📍 Me" pill and the + button sat on a place and its name. (viewer marks M-154 (pass 3), M-034 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: On wide screens the map's Me and zoom buttons are in the title row (5e94f9c).
- Fix check: pass 4 big-map pictures.

### G4-098 (fixed, how bad 1): pumpkins in October
- Device: PC
- What's wrong: No pumpkin at the Hair Salon door or at two houses' doors, though the "should look like" line said "at every door". (viewer marks M-170 (pass 3), M-171 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The Hair Salon has its pumpkin (9777d26); the "should look like" line now says what was built: by every shop door and by every house sign on Friends Lane.
- Fix check: pass 5 pictures of the west road.

### G4-099 (fixed, how bad 2): Santa
- Device: iPad
- What's wrong: Santa stood side-on and never turned to you, so his face could not be seen while he talked. (viewer marks M-172 (pass 3), M-173 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: Santa and the Easter Bunny turn to you when you come close (5e94f9c).
- Fix check: pass 4 and 5 Santa pictures.

### G4-100 (fixed, how bad 1): Santa by the tree
- Device: iPad
- What's wrong: Santa stood half inside the tree's bottom layer, a tree light on his beard. (viewer marks M-175 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: Santa stands clear of the tree's lowest branches (2c0c488).
- Fix check: pass 4 pictures.

### G4-101 (fixed, how bad 1): the big oak by the Ideas Board
- Device: iPad
- What's wrong: On New Year's Eve the big round tree behind the bus stop was summer green while every other tree was snowy. (viewer marks M-176 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: Cause: the oak was built in an earlier run with fixed greens; the season colours of job 11 never reached it. It takes the season's tree colours now (149c405).
- Fix check: a probe on 31 Dec and on 20 Oct after the fix: pale in winter, orange in autumn.

### G4-102 (fixed, how bad 2): the school party
- Device: iPad
- What's wrong: A yellow plate over the door poked through the red "School party today!" banner. (viewer marks M-178 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The banner hangs clear of the door (5e94f9c).
- Fix check: pass 5 school picture.

### G4-103 (not a glitch, how bad 1): a pet's party hat
- Device: iPad
- What's wrong: Waffles' party-hat pompom was drawn over his own name tag. (viewer marks M-179 (pass 3), M-121 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3, pass 4)
- Fix: As G4-059: a hat right under a tag can cover a letter for a moment as the pet moves.
- Fix check: —

### G4-104 (fixed, how bad 2): the spooky path
- Device: iPad
- What's wrong: The path's little lamps were unlit black boxes and its stones near-black blots. (viewer marks M-181 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: The lit glass sat inside the dark lamp box; the lamps show their light and the stones are lighter (2c0c488).
- Fix check: pass 4 and 5 Halloween pictures.

### G4-105 (fixed, how bad 1): the Clothes Shop in October
- Device: iPad
- What's wrong: The note said "Costumes are here for October!" but the costumes came last, after 22 ordinary items. (viewer marks M-183 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: In October the costumes are listed first (3620e54).
- Fix check: pass 4 and 5 costume pictures.

### G4-106 (fixed, how bad 2): my house, floor 2
- Device: iPad
- What's wrong: A big plain white disc on the floor looked like a giant blank plate. (viewer marks M-018 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: A striped rug with a border upstairs (5e94f9c).
- Fix check: pass 4 floor-2 pictures.

### G4-107 (fixed, how bad 1): the phone: quests
- Device: iPad
- What's wrong: The text on the purple "🧩 Tricky" tag was about 7 px, dark on purple. (viewer marks M-019 (pass 3))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 3)
- Fix: A bigger Tricky tag, white on purple (9777d26).
- Fix check: pass 5 quest pictures.

### G4-108 (fixed, how bad 2): the Pet Shop upstairs
- Device: iPad
- What's wrong: The pen signs overlapped the windows: a curtain cut "Puppies" to "Puppie", a window covered most of "Bunnies". (viewer marks M-005 (pass 4), M-023 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The pen signs sit above the windows (50db62c).
- Fix check: pass 5 and 6 upstairs pictures.

### G4-109 (fixed, how bad 1): the corner map
- Device: iPad
- What's wrong: The pink "you" arrow was stuck on the map's left border and half cut off. (viewer marks M-007 (pass 4), M-008 (pass 4), M-026 (pass 4), M-028 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The corner map keeps its whole arrow inside the frame (9777d26).
- Fix check: pass 5 lane pictures.

### G4-110 (fixed, how bad 1): the big map
- Device: iPad, PC
- What's wrong: The corner map peeked out above and beside the big map panel. (viewer marks M-010 (pass 4), M-114 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The corner map steps aside while the big map is open (9777d26).
- Fix check: pass 5 big-map pictures.

### G4-111 (fixed, how bad 1): the What's new book
- Device: iPad
- What's wrong: The cover pictures were rough crops: a name tag cut to "ffles", HUD slivers. (viewer marks M-012 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: All eleven pictures taken again with no HUD, messages or cut tags (2ea1029).
- Fix check: pass 5 book pictures.

### G4-112 (fixed, how bad 1): pumpkin glows at night
- Device: iPad
- What's wrong: A pumpkin's orange glow stopped in a hard straight line on the pavement below the step. (viewer marks M-015 (pass 4), M-034 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: A small glow and a soft pool on the ground (9777d26).
- Fix check: pass 5 night pictures.

### G4-113 (fixed, how bad 1): the Tree Park
- Device: iPad
- What's wrong: The yellow pointer over the next deck was in two pieces, the shaft and the head floating apart. (viewer marks M-018 (pass 4), M-019 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: A spinning star marks the next deck (50db62c).
- Fix check: pass 5 Tree Park pictures.

### G4-114 (fixed, how bad 1): the Tree Park's finish deck
- Device: iPad
- What's wrong: The "🏁 Finish" banner ran off the screen and the bell filled the middle. (viewer marks M-003 (pass 4), M-020 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The banner hangs behind the bell so it shows while you ring it (50db62c), and above the bell's roof, which covered its first letters (2ac45c7; N23 found the overlap). The camera spot was the photographer's.
- Fix check: N23 passes; a probe picture from the finish deck after 2ac45c7.

### G4-115 (fixed, how bad 1): the Pet Shop upstairs
- Device: iPad
- What's wrong: A big pale see-through slab (the hamsters' glass) washed out a corner of the picture. (viewer marks M-024 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The hamsters' glass is fainter (50db62c).
- Fix check: pass 5 upstairs pictures.

### G4-116 (fixed, how bad 2): a tall house on Friends Lane
- Device: iPad
- What's wrong: The six-floor house had no name tag on top. (viewer marks M-025 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: Cause: the tags fade by the straight distance, and a six-floor house's tag hangs 24 m up, so from where the whole house shows it had faded; and the pointed front roof (50db62c) hid it from the lane. The tags now fade by the distance along the ground, and a tall house's tag hangs in front of its roof, at the same height (fda1555).
- Fix check: a probe from the lane after the fix: "🏠 Cozy Kid" on top of the purple six-floor house; N34 passes (the tag heights).

### G4-117 (fixed, how bad 1): Settings
- Device: iPhone upright
- What's wrong: Settings had "Show me the tips" rows for three jobs but none for the photographer. (viewer marks M-040 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: Settings has the photographer's tips (9777d26).
- Fix check: pass 5 settings pictures.

### G4-118 (fixed, how bad 1): Halloween ghosts
- Device: iPhone, iPad
- What's wrong: A ghost floated right at the camera as a big grey blob. (viewer marks M-042 (pass 4), M-136 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: Ghosts and bats glide round the camera (50db62c) and keep 3 m from it (9777d26).
- Fix check: pass 5 pictures.

### G4-119 (not a glitch, how bad 2): shop and school signs
- Device: iPhone upright
- What's wrong: The notepad covered the start of a sign ("ozy Town School", "…ore"). (viewer marks M-047 (pass 4), M-049 (pass 4), M-066 (pass 4), M-068 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: Decided (section 9c): on an upright phone the fixed HUD can cover part of a sign while you walk; it stays where the thumbs and eyes expect it.
- Fix check: —

### G4-120 (not a glitch, how bad 1): name tags
- Device: iPhone upright
- What's wrong: A pet's round button or the action pill covered the end of a name tag, or a tag ran off the screen edge. (viewer marks M-048 (pass 4), M-050 (pass 4), M-053 (pass 4), M-054 (pass 4), M-067 (pass 4), M-069 (pass 4), M-071 (pass 4), M-072 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: As G4-119: the fixed HUD and the screen edge can cut a tag for a moment.
- Fix check: —

### G4-121 (fixed, how bad 1): inside the Market
- Device: iPhone, PC
- What's wrong: Faint zigzag stripes on the floor between the fruit counters and on their inner sides. (viewer marks M-055 (pass 4), M-112 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: Indoor shadows have a bigger normal bias (50db62c).
- Fix check: pass 5 Market pictures: no viewer marked them again.

### G4-122 (fixed, how bad 1): the Pet Shop
- Device: iPhone upright
- What's wrong: A washed-out view: pale mint walls, near-white floor and white shelves ran together. (viewer marks M-058 (pass 4), M-075 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The Pet Shop is a little less pale (9777d26).
- Fix check: pass 5: one viewer still called the upright view mostly empty; the double-checker dropped it (the narrow upright view).

### G4-123 (fixed, how bad 1): the house colour card
- Device: iPhone sideways
- What's wrong: The 12 colour chips were about 34 px tall, smaller than a fingertip. (viewer marks M-077 (pass 4), M-094 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The chips are at least 44 px (50db62c).
- Fix check: pass 5 colour-card pictures.

### G4-124 (not a glitch, how bad 1): a photo shoot
- Device: iPhone sideways
- What's wrong: The dashed frame sat right of the middle (187 px gap on the left, 35 px on the right). (viewer marks M-083 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: Decided (section 9c): on a sideways touch screen the frame starts right of the joystick; a child turns to put the family in it.
- Fix check: —

### G4-125 (not a glitch, how bad 1): town views
- Device: iPhone sideways
- What's wrong: The joystick ring sat over the fountain, the gate, the pond. (viewer marks M-086 (pass 4), M-087 (pass 4), M-088 (pass 4), M-089 (pass 4), M-104 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The owner's joystick position on a sideways phone (300 px in, commit 0f5939f); only during a photo shoot it moves to the edge.
- Fix check: —

### G4-126 (not a glitch, how bad 1): the toy phone
- Device: iPhone sideways
- What's wrong: The phone screen stayed white and pastel in the dark theme. (viewer marks M-090 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: Decided (section 9c): a phone's screen is lit; the cards around it go dark.
- Fix check: —

### G4-127 (fixed, how bad 2): the duck pond
- Device: PC
- What's wrong: The white and the yellow duck were stuck into each other like one blob. (viewer marks M-110 (pass 4), M-115 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: Ducks keep apart (50db62c), 80 cm, a duck with its head; at the pond's edge the other one moves (ceb35b2).
- Fix check: pass 5: the double-checker found the two ducks in line, not stuck (M-052 dropped); pass 6 pictures.

### G4-128 (fixed, how bad 1): the Tree Park gate
- Device: PC
- What's wrong: Little flowers grew on the earth path just past the gate. (viewer marks M-111 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The gate path stays clear (9777d26).
- Fix check: pass 5 gate pictures.

### G4-129 (fixed, how bad 1): the Pet Shop card
- Device: PC
- What's wrong: The line broke between 🛋️ and "Decorate." (viewer marks M-116 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: "with 🛋️ Decorate." stays on one line (002c9f6).
- Fix check: pass 5 Pet Shop pictures.

### G4-130 (fixed, how bad 1): the holiday tree at night
- Device: iPad
- What's wrong: Lights too bright: Santa's face a yellow-white blob. (viewer marks M-120 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: No Christmas glow sits on Santa's face (9777d26).
- Fix check: pass 5 night pictures.

### G4-131 (not a glitch, how bad 1): the Hair Salon
- Device: iPad
- What's wrong: The "✂️ Nora sits down!" pop text ran into the salon's wall sign. (viewer marks M-123 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: A pop text shows for a moment and floats away.
- Fix check: —

### G4-132 (fixed, how bad 2): the clothes maker
- Device: iPad
- What's wrong: The "Cat costume: it's yours!" message lay across the figure's chin and chest. (viewer marks M-127 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The clothes maker's message sits above your figure (9777d26).
- Fix check: kit pictures of N19.

### G4-133 (fixed, how bad 2): the spooky path
- Device: iPad
- What's wrong: A soft monster popped up right in the camera's face. (viewer marks M-128 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The monsters pop up 2.3 m beside the path (9777d26).
- Fix check: kit pictures of N19.

### G4-134 (fixed, how bad 1): the Flower Corner at Easter
- Device: iPad
- What's wrong: A big gold box-like shape hung in the sky next to the map. (viewer marks M-129 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: It was a butterfly right at the lens (a retake at the same spot shows butterflies); butterflies and birds keep a little distance from the camera (9777d26).
- Fix check: a retake of the kit's spot on 10 Mar 2027.

### G4-135 (fixed, how bad 2): the phone: the photo booking chat
- Device: iPad
- What's wrong: The header "Photo booki…" disappeared under the 🪙 chip. (viewer marks M-135 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The chat header says "Photos" (50db62c).
- Fix check: kit pictures of N25.

### G4-136 (fixed, how bad 2): friends who follow you
- Device: iPad
- What's wrong: After you stop, one friend stood straight behind another (only the tag showed) and one came right up to the camera. (viewer marks M-137 (pass 4), M-138 (pass 4), M-141 (pass 4), M-124 (pass 5), M-125 (pass 5), M-126 (pass 5), M-127 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4, pass 5)
- Fix: Pass 4: friends were made never to stand straight behind each other (50db62c), but that rule left them no good spots and N3 failed (0.75 m apart). Now a spot straight behind another friend only costs a little more, and the 1.2 m between friends comes first (2ac45c7). The pictures of this pass were taken before the fix went in.
- Fix check: N3 passes again (1.42 m and 1.63 m apart); its pictures show all four in front.

### G4-137 (fixed, how bad 1): the dance-off score bar
- Device: iPad
- What's wrong: The players' names in the score bar were 7–8 px. (viewer marks M-147 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: Bigger titles and "You" on the score bar (50db62c).
- Fix check: kit pictures of N39.

### G4-138 (fixed, how bad 2): the dance result
- Device: iPad
- What's wrong: Mochi stood right at the lens under the run/jump buttons, its crown a black silhouette. (viewer marks M-148 (pass 4), M-149 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: Pets wait out of a dance-off and its result card, and the view frames the dancers (50db62c, c012566).
- Fix check: kit pictures of N39: no pet at the lens.

### G4-139 (fixed, how bad 1): the photo result
- Device: iPhone sideways
- What's wrong: The "+120 🪙" pop landed on the clock chip. (viewer marks M-152 (pass 4))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4)
- Fix: The coin pop avoids the chips (50db62c).
- Fix check: kit pictures of N25.

### G4-140 (fixed, how bad 2): a photo shoot
- Device: PC, iPhone sideways
- What's wrong: A tree trunk stood in the middle of the frame and hid one of the family, a passing grandma stood in the group with her back turned, and the photo still got five stars. (viewer marks M-154 (pass 4), M-155 (pass 4), M-133 (pass 5), M-134 (pass 5), M-135 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 4, pass 5)
- Fix: Pass 4: the school-sign spot got no tree in the way (50db62c). Pass 5: the hedge spot at the Flower Corner moved 1.8 m east, out from behind the pavement tree (an audit of all nine backgrounds found no other in the way); a grandma between the camera and the family steps out of the shoot like any passer-by; someone hidden behind a tree, a post or another of the group costs a star (ceb35b2). The pictures of this pass were taken before the fix went in.
- Fix check: N25 passes with the new score (5 stars, nobody hidden); the background audit after the fix is clear on every spot.

### G4-141 (fixed, how bad 2): the bus stop at the park
- Device: iPhone sideways, PC
- What's wrong: Behind the phone and every card the view was inside the parked Beach Bus: seats, windows, the yellow pole. (viewer marks M-053 (pass 5), M-054 (pass 5), M-055 (pass 5), M-056 (pass 5), M-057 (pass 5), M-058 (pass 5), M-059 (pass 5), M-060 (pass 5), M-061 (pass 5), M-062 (pass 5), M-063 (pass 5), M-064 (pass 5), M-065 (pass 5), M-066 (pass 5), M-072 (pass 5), M-073 (pass 5), M-074 (pass 5), M-075 (pass 5), M-076 (pass 5), M-077 (pass 5), M-078 (pass 5), M-079 (pass 5), M-080 (pass 5), M-083 (pass 5), M-084 (pass 5), M-085 (pass 5), M-086 (pass 5), M-087 (pass 5), M-088 (pass 5), M-089 (pass 5), M-090 (pass 5), M-091 (pass 5), M-092 (pass 5), M-093 (pass 5), M-094 (pass 5), M-095 (pass 5), M-096 (pass 5), M-097 (pass 5), M-098 (pass 5), M-099 (pass 5), M-100 (pass 5), M-101 (pass 5), M-102 (pass 5), M-103 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: Cause: when you come into town while the bus waits at the stop (or it jumps ahead out of view), the bus is placed where the timetable says, and the push-out from its solid box only happened when you walked. Standing still in its spot, you stayed inside it. Now you step out on its door side, onto the pavement, whenever the bus stands on you (fda1555). The pictures of this pass were taken before the fix went in.
- Fix check: a probe on a bus day with the player in the bus's spot: moved to the pavement by the shelter, "Get on the bus" offered.

### G4-142 (fixed, how bad 1): the Pet Shop upstairs
- Device: iPad
- What's wrong: In the pens two animals were bunched into one blob (a kitten sticking out of another's back, the puppies piled up). (viewer marks M-005 (pass 5), M-018 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: Pen-mates keep 85 cm apart, a kitten's length (it was 60 cm) (ceb35b2).
- Fix check: a probe upstairs after the fix: the closest two 0.85 m apart.

### G4-143 (fixed, how bad 1): the stair plates
- Device: iPad
- What's wrong: "Downstairs" was drawn smaller than "Upstairs" on the plate next to it. (viewer marks M-006 (pass 5), M-019 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: Both plates take the letter size of the longer word (ceb35b2).
- Fix check: pass 6 floor-2 pictures.

### G4-144 (fixed, how bad 1): the phone: quests
- Device: every device
- What's wrong: The Decorator quest said "Put a herb pots in your house". (viewer marks M-007 (pass 5), M-021 (pass 5), M-027 (pass 5), M-036 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: "Put some herb pots in your house", and the same for flowers, building blocks, candles and drawers (fda1555).
- Fix check: pass 6 quest pictures.

### G4-145 (fixed, how bad 1): the food truck corner
- Device: iPad
- What's wrong: A tree's crown sat right on the truck's cab, as if it grew out of the truck. (viewer marks M-010 (pass 5), M-011 (pass 5), M-012 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: The corner tree stands a metre further from the truck, 4.3 m away (960fd04).
- Fix check: pass 6 or 7 pictures of the stage.

### G4-146 (not a glitch, how bad 1): inside the Market
- Device: iPad, PC
- What's wrong: A big soft round shadow lay across the fruit counter with nothing in view casting it. (viewer marks M-015 (pass 5), M-106 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: It is your own shadow: in first person you see only your legs and shoes, and the rest of you shows up as your shadow (since night 1); switching off the shadows of the meshes at the camera takes it away.
- Fix check: —

### G4-147 (fixed, how bad 1): the duck pond at night
- Device: iPad
- What's wrong: The pond water stayed bright blue while the grass and stones around it went dark. (viewer marks M-024 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: The water glows less at night (ceb35b2).
- Fix check: pass 6 night pictures.

### G4-148 (fixed, how bad 1): the pose card
- Device: iPhone upright
- What's wrong: Mia and Zoe stuck out of the dashed frame and the card hid everything below their chins. (viewer marks M-031, M-040 (pass 5), M-011 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5, pass 7)
- Fix: Pass 5 put it down to the photographer's camera standing too close. Pass 7 found it again, and in play it happens too: a child who walks up to a friend to pose them sees them from close by. On an upright phone, opening a pose card now steps the camera back to the spot that frames the whole group, so the card sits under them (96b40df).
- Fix check: pass 8 pictures: not seen again.

### G4-149 (fixed, how bad 1): the What's new book
- Device: iPhone upright
- What's wrong: In the dark theme the inactive page dots were dark rings on the dark card, almost invisible. (viewer marks M-038 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: They get a light ring in the dark theme (960fd04).
- Fix check: pass 7 book pictures.

### G4-150 (fixed, how bad 2): the park fence in October
- Device: iPhone upright
- What's wrong: The October garland hung at eye height right in front of the camera; huge pennants cut across the view. (viewer marks M-041 (pass 5), M-042 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: Every garland hangs at least 2.4 m at its posts, so its flags stay above a child's eyes (it sagged to 1.55 m) (960fd04). The camera spot also stood against the stage's side; pass 6 turned it.
- Fix check: pass 7 pictures.

### G4-151 (fixed, how bad 1): the photo result
- Device: iPhone sideways
- What's wrong: The joystick ring and knob stuck out half cut by the result card. (viewer marks M-051 (pass 5), M-070 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: The result card hides the joystick and the move buttons (ceb35b2).
- Fix check: pass 6 result pictures.

### G4-152 (fixed, how bad 1): the house colour card
- Device: iPhone sideways
- What's wrong: "Green" and "Mint" were the same pale mint, "Blue" and "Sky" almost the same. (viewer marks M-067 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: Green is a leaf green and Sky a deeper sky blue (Blue and Mint stay: saved houses keep their colour) (ceb35b2).
- Fix check: pass 6 colour-card pictures.

### G4-153 (fixed, how bad 2): the Easter Bunny
- Device: iPad
- What's wrong: The Bunny's words sat over its face: only the top of its eyes showed. (viewer marks M-108 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: What someone you talk to says sits up under the top row, not on their face (960fd04).
- Fix check: a probe of the Bunny talking after the fix: the words at the top, its face clear.

### G4-154 (fixed, how bad 1): the holiday tree
- Device: iPad
- What's wrong: Light bulbs and their string hung in the air beside the tree and at its tip. (viewer marks M-110 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: The 40 bulbs sit on the tree's three cones; a straight spiral hung them up to 30 cm off the branches (960fd04).
- Fix check: pass 7 December pictures.

### G4-155 (fixed, how bad 1): the Flower Corner sign
- Device: iPad
- What's wrong: The board flickered at its ends: the posts' faces ran through the board and the sign. (viewer marks M-111 (pass 5), M-113 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: The posts stand just behind the board (ceb35b2).
- Fix check: pass 6 night pictures; N23 passes.

### G4-156 (fixed, how bad 1): the Clothes Shop in October
- Device: iPad
- What's wrong: A dark colour dot on a dark card could not be seen, so two "Special witch hat" cards looked the same. (viewer marks M-114 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: Colour dots get a light ring in the dark theme (ceb35b2).
- Fix check: pass 6 dark pictures.

### G4-157 (fixed, how bad 2): the Hair Salon
- Device: iPad
- What's wrong: The dye shelf ran behind the window curtain and over the window. (viewer marks M-115 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: The shelf and its bottles moved 55 cm along the wall, clear of the curtain (ceb35b2).
- Fix check: pass 6 salon pictures.

### G4-158 (fixed, how bad 2): the dance-off on two phones
- Device: iPhone
- What's wrong: Upright: your dancer was half off the left edge. Sideways: "Perfect +15" was drawn across both dancers. (viewer marks M-116 (pass 5), M-117 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: On an upright phone the view is 5.6 m back so both dancers fit; on a short sideways screen "Perfect" shows in the free top-left corner (the old rule left the centred top position in place) (960fd04).
- Fix check: pass 7 two-phone dance pictures.

### G4-159 (fixed, how bad 1): the dance result
- Device: iPhone sideways
- What's wrong: The white aim dot sat on the partner's eye. (viewer marks M-119 (pass 5))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 5)
- Fix: No aim dot during a dance-off and its result (ceb35b2).
- Fix check: pass 6 or 7 dance pictures.

### G4-160 (fixed, how bad 1): the front door of a house on Friends Lane
- Device: iPad
- What's wrong: Dark blurred smudges lay on the wall either side of the front door and over its top half, with a jagged grey band under the roof edge. (viewer marks M-001 (pass 7), M-004 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: The smudges were the shadow of the little roof over the door and its two brackets, which the town's soft shadows drew as blurred blots on the wall. The little door roof and its brackets cast no shadow now (f26b169). The pictures of this pass were taken before the fix went in.
- Fix check: pass 8 pictures: not seen again.

### G4-161 (fixed, how bad 1): the stair plates on floor 2
- Device: iPad
- What's wrong: "⬇️ Downstairs" ran to both edges of its plate, while "⬆️ Upstairs" beside it had room. (viewer marks M-003 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: A plate's words keep 8% of its width free at each side (the fit test let them run to the edge) (96b40df). The pictures of this pass were taken before the fix went in.
- Fix check: pass 8 pictures: not seen again.

### G4-162 (not a glitch, how bad 3): the square, looking to the Flower Corner
- Device: iPhone upright
- What's wrong: The camera seemed to be inside a vehicle: a dark outline and two small windows filled the view. (viewer marks M-012 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: On an upright phone the photographer steps back 4 m to fit more in; on a bus morning that put it half a metre from the side of the Beach Bus waiting at the stop, and through the bus's windows on both sides the view looked like the inside of a box. A child can stand there too and sees the bus's side, as next to any bus; the bus is solid and an arriving bus moves you aside (G4-141). The photographer's step back now stops 1.5 m short of the bus or a car.
- Fix check: —

### G4-163 (fixed, how bad 1): the phone on a short sideways screen
- Device: iPhone sideways
- What's wrong: The phone was narrow, so its words wrapped into many lines: Rosie's three job cards were cut at the bottom, the quest's second step and the calendar's Halloween line sat half under the bottom fade. (viewer marks M-013 (pass 7), M-014 (pass 7), M-015 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: On a short sideways screen the phone is wider (up to 72% of the screen, at most 600 px), so the job cards, the calendar line and the quest card's first steps fit; a list that goes on below still shows its soft fade (96b40df). The pictures of this pass were taken before the fix went in.
- Fix check: pass 8 pictures: not seen again.

### G4-164 (fixed, how bad 1): the big map on a short sideways screen
- Device: iPhone sideways
- What's wrong: The "Tap a place to see the way there!" tip sat over the map's bottom row: Pet Shop and Cozy Park lost their names under it, and a cut "Ice Cream Shop" peeked out below it. (viewer marks M-016 (pass 7), M-018 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: The tip fades away after four seconds (and comes back with the next tip); the card for a place you picked stays (96b40df). The pictures of this pass were taken before the fix went in.
- Fix check: pass 8 pictures: not seen again.

### G4-165 (fixed, how bad 1): friends on the big map
- Device: iPhone sideways
- What's wrong: "Finn" stood 3 px from "Duck Pond", so it read as one name, "Finn Duck Pond". (viewer marks M-017 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: A friend's name on the map keeps 7 px of air from every place name and icon; it takes the next side of its dot that has room (96b40df). The pictures of this pass were taken before the fix went in.
- Fix check: N26 passes; pass 8 pictures: not seen again.

### G4-166 (fixed, how bad 2): a photo shoot at the school
- Device: PC
- What's wrong: The asked background, "the school sign", was above the dashed frame, cut by the top of the screen and under the coin and time chips; the "Everyone is posed!" tip sat in the frame over Mia and the cat; the photo had no school sign in it and still got five stars. (viewer marks M-020 (pass 7), M-021 (pass 7), M-022 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: The school has a name board on two tall posts right of its door, the "school sign" background, at a height a photo from the pavement takes in (the name over the door was too high); the asked background has to be in the frame for the stars; the shoot's tips sit under the top row (c6d204f). The pictures of this pass were taken before the fix went in.
- Fix check: N25 passes; pass 8 pictures: not seen again.

### G4-167 (not a glitch, how bad 1): the big map's left edge
- Device: PC
- What's wrong: A cut "ne" of "Friends Lane" hung alone at the map's left edge. (viewer marks M-023 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: A map is cut at its edge like any map you can move and zoom; the name shows in full when you move the map (decided in section 9c, with the names at the map's edge in pass 5).
- Fix check: —

### G4-168 (fixed, how bad 1): October: the park fountain
- Device: iPad
- What's wrong: A white ghost hung inside the fountain, between its top and middle bowls. (viewer marks M-001 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The ghost that circled the park fountain at 1.2 m from its middle (inside its bowls) circles 4 m from it (patch_f3.py).
- Fix check: pass 9 pictures.

### G4-169 (fixed, how bad 1): the Café, Bakery and Ice Cream chalkboards
- Device: iPad
- What's wrong: The last of five rows sat on the bottom frame with no air under it. (viewer marks M-003 (pass 8), M-004 (pass 8), M-005 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The rows are spaced to the board (66 px apart at most, 48 px type from five rows) (patch_f3.py).
- Fix check: pass 9 pictures.

### G4-170 (fixed, how bad 1): your garden: a row of locked pots
- Device: iPad
- What's wrong: The big "🔒 Level 40" plate hung in the air above its stake. (viewer marks M-008 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The size cap of a name tag made the plate smaller round its middle close up, so its bottom rose off the stake; the plate is now held at its bottom edge, on the stake top (patch_f5.py).
- Fix check: pass 9 pictures.

### G4-171 (fixed, how bad 2): people right at the camera
- Device: iPad
- What's wrong: A grandma or a passer-by stood right against the camera: a grey head, a cardigan or a back filled a third of the picture. (viewer marks M-010 (pass 8), M-011 (pass 8), M-072 (pass 8), M-089 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: A walking grandma or a passer-by within 1.3 m of the camera is not drawn for that moment (it was 1 m for passers-by; grandmas were always drawn); a grandma sitting next to you on a bench stays (patch_f4.py, patch_f5.py).
- Fix check: the kit N6 and N24 lines; pass 9 pictures.

### G4-172 (fixed, how bad 1): the phone: quests
- Device: iPad
- What's wrong: A quest read "Buy a fairy wings at the Pet shop" ("a" before a plural; "Pet shop", the building says Pet Shop). (viewer marks M-012 (pass 8), M-022 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: Wings, glasses, ears and headphones take "a pair of", fries, noodles and dumplings "some"; the shop names in quests, cards and the friends list are the names on the buildings (patch_f3.py).
- Fix check: pass 9 pictures.

### G4-173 (fixed, how bad 2): the What's new book, page 3 (February)
- Device: every screen
- What's wrong: The February picture had a townsperson right at the camera filling its left third, her bubble cut to "ce.". (viewer marks M-014 (pass 8), M-024 (pass 8), M-030 (pass 8), M-034 (pass 8), M-038 (pass 8), M-044 (pass 8), M-048 (pass 8), M-051 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: A new February picture from a spot the grandmas and passers-by keep clear of (bookshots5.py, bookswap.py).
- Fix check: pass 9 pictures of the book.

### G4-174 (fixed, how bad 1): the What's new book, page 5
- Device: every screen
- What's wrong: The last line "Your tutorials are pictures now ❓" ended in a red question mark, like a question. (viewer marks M-015 (pass 8), M-026 (pass 8), M-053 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: It reads "Job tutorials are pictures now: tap ❓ on a job card to see one!" (patch_f3.py).
- Fix check: pass 9 pictures.

### G4-175 (fixed, how bad 1): a photo shoot at the fountain
- Device: iPad
- What's wrong: Leo's waving arm reached into Zoe's hair, in the view and in the photo. (viewer marks M-016 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The wave is higher (the arm between 148° and 173° up, not 120° to 166°): it no longer swings out into the next person (patch_f5.py).
- Fix check: pass 9 pictures.

### G4-176 (not a glitch, how bad 2): the pond ducks close up
- Device: iPad
- What's wrong: The close-up missed: both ducks small at the far rim, cattails in front of their heads. (viewer marks M-018 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The photographer's framing, not the game: pass 9 photographs the ducks after you feed them (they swim up to you); from a fixed spot they were wherever they had swum.
- Fix check: —

### G4-177 (not a glitch, how bad 1): inside the school
- Device: iPad
- What's wrong: The two teachers stood at the screen edges, their name tags cut. (viewer marks M-019 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The photographer's framing, not the game: the picture was taken 1.5 m into the hall; pass 9 takes it from 0.6 m, nearer the door, where both teachers are in view.
- Fix check: —

### G4-178 (not a glitch, how bad 1): the Pet Shop upstairs
- Device: iPad
- What's wrong: Your pets and their name tags stood right in front of the camera over the pens. (viewer marks M-020 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The photographer's framing, not the game: your pets follow you; pass 9 puts them a step behind you indoors, as the town pictures always did.
- Fix check: —

### G4-179 (fixed, how bad 2): walls and tree crowns turned away from the sun
- Device: iPad
- What's wrong: The house's back wall in the garden was a dull grey, not its colour; the apartment block's wall had a lit strip and a soft seam at 12:30 and pale streaks at 17:30; a house wall at the Flower Corner was pale and streaky at noon; the Tree Park's crowns had thin stripes. (viewer marks M-021 (pass 8), M-058 (pass 8), M-070 (pass 8), M-097 (pass 8), M-099 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: Outdoors a face turned away from the sun takes no cast shadow (the toon shade lights it at its middle or low tone, like every such face nothing shades); the baked pieces, most walls, now get the same shade fix as the loose ones: they never had it, so item 17's cure for the noon streaks only reached the loose pieces. Indoors nothing changes (patch_f5.py).
- Fix check: probes before and after on ten views; the kit N31 line; pass 9 pictures.

### G4-180 (fixed, how bad 1): the What's new book, page 4 (the Pet Shop upstairs)
- Device: iPad
- What's wrong: The picture was pale, a third of it ceiling, the Capybaras sign cut to "Cap". (viewer marks M-025 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: A new picture of the upstairs pens (bookshots5.py, bookswap.py).
- Fix check: pass 9 pictures of the book.

### G4-181 (fixed, how bad 1): the What's new book, pages 6 and 7
- Device: iPhone, PC
- What's wrong: Line breaks: "dance-" / "off"; an emoji alone on a line; 🕺 and 💃 split over two lines. (viewer marks M-031 (pass 8), M-035 (pass 8), M-054 (pass 8), M-055 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: A non-breaking space before a line's last emoji; "dance-off" and 🕺💃 never split (patch_f3.py).
- Fix check: pass 9 pictures.

### G4-182 (not a glitch, how bad 1): inside the Pet Shop
- Device: iPhone upright
- What's wrong: A huge pink ceiling lamp hung right in front of the camera at the top. (viewer marks M-033 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The photographer's framing, not the game: an upright phone sees high; pass 9 takes a room's view a little lower on an upright phone.
- Fix check: —

### G4-183 (fixed, how bad 1): the Pet Shop card
- Device: iPhone sideways
- What's wrong: Two prices sat lower than the third and were greyed out by the card's bottom fade, so they looked disabled. (viewer marks M-039 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The prices of a row sit on one line (a name on two lines pushed its price down); on a short screen the "more below" fade is 40 px, not 58 (patch_f5.py).
- Fix check: pass 9 pictures.

### G4-184 (fixed, how bad 1): cards at the bottom of a short screen
- Device: iPhone sideways
- What's wrong: The bigger-house card ran under the round top buttons (the gear on its corner); the mint jump button poked out beside the mailbox and party cards. (viewer marks M-040 (pass 8), M-045 (pass 8), M-046 (pass 8), M-047 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: A card at the bottom of a short screen that reaches up into the top row or over the jump and run buttons: those pieces wait out of sight under it, as under a big card (patch_f5.py).
- Fix check: a probe of the three cards; pass 9 pictures.

### G4-185 (fixed, how bad 1): the job tutorials
- Device: iPhone sideways
- What's wrong: The tall tutorial card lay over the top bar, which stayed: it hid the clock chip and the chat button and cut the food chip in half. (viewer marks M-041 (pass 8), M-042 (pass 8), M-043 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: On a short screen a tutorial card with nothing to point at hides the top row it covers; a message with no free spot beside a tutorial waits until it closes (patch_f5.py).
- Fix check: a probe of steps 1 and 2; pass 9 pictures.

### G4-186 (fixed, how bad 2): 1 September: the school front
- Device: iPad
- What's wrong: The "School party today!" banner ran behind the school's name board on its posts. (viewer marks M-059 (pass 8), M-092 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: A shorter banner from the left door balloons to the name board, clear of it (patch_f3.py).
- Fix check: N22 passes; pass 9 pictures.

### G4-187 (fixed, how bad 1): 1 September: the school hall
- Device: iPad
- What's wrong: Two balloon bunches stood in front of the 🌈 and 🚀 posters between the doors. (viewer marks M-060 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The two back bunches stand by the lockers (patch_f5.py).
- Fix check: N22 passes; pass 9 pictures.

### G4-188 (not a glitch, how bad 2): October: the spooky gate at night
- Device: iPad
- What's wrong: Your pets bunched up right in front of the camera over the gate. (viewer marks M-061 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The photographer's framing, not the game: this spot never stepped your pets back as the town spots do; pass 9 does.
- Fix check: —

### G4-189 (not a glitch, how bad 2): a pizza delivery
- Device: iPad
- What's wrong: Two orders at once: the chef's card for Iris and the message of a new order for Mr. Bolt. (viewer marks M-063 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The photographer's staging: it made a new order while the chef's card of the last one was still open (a game never makes a new order then); pass 9 closes the card first.
- Fix check: —

### G4-190 (not a glitch, how bad 2): two players at the park
- Device: PC
- What's wrong: The PC player's view was boxed in by a tree trunk and the back of the Ideas Board. (viewer marks M-064 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The photographer's framing, not the game: pass 9 puts both players on the open square.
- Fix check: —

### G4-191 (fixed, how bad 2): the dance-off
- Device: iPhone upright, iPhone sideways
- What's wrong: The "✨ Perfect +15" pop-up ran into the score bar (upright); on a sideways phone its ✨ covered the left dancer's face, which read as the back of a head. (viewer marks M-065 (pass 8), M-066 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: Under the score bar on an upright phone; at the bottom left, under the dancers, on a sideways phone. Both dancers face the view (rotation 0, as asked) (patch_f5.py).
- Fix check: the two-phone dance-off probe; pass 9 pictures.

### G4-192 (fixed, how bad 1): the disco ball
- Device: iPhone upright
- What's wrong: The mirror ball seemed to float beside its pole: the 3 cm arm and 1 cm string were too thin and pale to see. (viewer marks M-067 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: A thicker arm with an outline and a dark string (patch_f5.py).
- Fix check: a probe; pass 9 pictures.

### G4-193 (fixed, how bad 1): the big map on a tablet
- Device: Android tablet upright
- What's wrong: The "You are online!" message lay on the chat and phone buttons above the map card. (viewer marks M-068 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The top row counts fully for a message while you can see it (under a card it counted a quarter): with no free spot the message waits (patch_f5.py).
- Fix check: pass 9 pictures.

### G4-194 (fixed, how bad 1): the hair salon
- Device: iPad
- What's wrong: The hair card and its name tab covered the customer in the chair, the tab on their face. (viewer marks M-069 (pass 8), M-083 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: When the hair card opens, the view turns to the customer so they show above it (on a sideways phone the card fills the screen's height: nothing can show above it there) (patch_f5.py).
- Fix check: N13 passes; probes on iPad and a sideways iPhone; pass 9 pictures.

### G4-195 (not a glitch, how bad 1): playing with a pet
- Device: iPad
- What's wrong: A toy and a hand seemed to hang in mid-air beside a lamp pole. (viewer marks M-073 (pass 8), M-074 (pass 8), M-075 (pass 8), M-076 (pass 8), M-077 (pass 8), M-078 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The toy is the game's play feedback, an emoji that rises over the pet and fades; the hand is a townsperson's arm behind the lamp pole at the kit's N11 spot.
- Fix check: —

### G4-196 (fixed, how bad 1): your house
- Device: iPad
- What's wrong: Three pet name tags piled up: "Moch", only an "M". (viewer marks M-079 (pass 8), M-080 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: Your pets' name tags step apart on screen with the friends' (only the friends' did) (patch_f5.py).
- Fix check: a probe; pass 9 pictures.

### G4-197 (fixed, how bad 1): your house upstairs
- Device: iPad
- What's wrong: The save's green rug lay half under the floor's blue starter rug. (viewer marks M-081 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The starter rug of an upper floor lies flat (1 cm), under any rug you place (it stood 4 cm, a placed rug 2.5 cm) (patch_f5.py).
- Fix check: N12 and N34 pass; a probe.

### G4-198 (fixed, how bad 1): the hairstylist tutorial
- Device: iPad, PC
- What's wrong: The caption "A customer sits down" sat right of centre in its picture. (viewer marks M-082 (pass 8), M-118 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The bottom captions are centred in the picture (patch_f3.py).
- Fix check: N38 passes; pass 9 pictures.

### G4-199 (fixed, how bad 1): the park at night in rain
- Device: iPad
- What's wrong: It rained from a clear starry sky. (viewer marks M-088 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The stars and the moon fade out with the grey sky in rain, snow and cloudy weather (patch_f3.py).
- Fix check: N16 passes; pass 9 pictures.

### G4-200 (fixed, how bad 1): the clothes maker at the mirror
- Device: iPad
- What's wrong: Its ⬇️ "more below" was a tiny 33 px round button. (viewer marks M-090 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: 46 px like every other "more below" (it never takes a tap: it is a hint) (patch_f5.py).
- Fix check: pass 9 pictures.

### G4-201 (not a glitch, how bad 1): the Easter month at the Flower Corner
- Device: iPad
- What's wrong: The eggs in view were small pastel ones lying loose, no golden-banded egg in a nest. (viewer marks M-091 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The small pastel eggs are the corner's spring decorations, by design ("so no decorative egg looks like one"); the check had picked up the hunt eggs near the bunny (18/25).
- Fix check: —

### G4-202 (fixed, how bad 1): the Pet Shop upstairs: the ducks
- Device: iPad
- What's wrong: The two ducks stood on top of their water on orange legs. (viewer marks M-093 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The whole pen is water (a pale blue floor round a darker pond): the ducks there swim, low in it, legs under the surface, gliding (patch_f5.py).
- Fix check: N28 passes; a probe.

### G4-203 (fixed, how bad 2): friends round you
- Device: iPad
- What's wrong: After you turned round on a narrow pavement, Finn stood hidden behind Luna (only his name tag showed); Rosie walked past right at the camera. (viewer marks M-095 (pass 8), M-096 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: A friend takes a spot a little nearer at the side (from 1.6 m) before one straight behind another friend, and the spots may be 1.22 m apart instead of 1.3 (the check asks 1.2): all four faces show; walking to their spots after a turn still takes a few seconds (patch_f5.py).
- Fix check: N3 passes (1.28 m and 1.25 m apart); a probe of both turns; pass 9 pictures.

### G4-204 (fixed, how bad 2): the clock chip
- Device: iPad
- What's wrong: The chip showed the old hour or weather under the new sky: "11:30" at 12:30, the sun under an evening sky, a cloud under a blue sky. (viewer marks M-098 (pass 8), M-100 (pass 8), M-101 (pass 8), M-103 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The chip was refreshed twice a second, and the check took its pictures right after moving the clock; it is now refreshed at once after a jump of the clock (a phone waking up) or a change of weather (patch_f5.py).
- Fix check: N15, N16, N31, N32 and N37 pass; pass 9 pictures.

### G4-205 (open, how bad 2): your pets at the Tree Park gate
- Device: iPad
- What's wrong: Your pets crowded the bottom edge in front of the camera; Clover stood behind Waffles, only her ears showing. (viewer marks M-102 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: Not changed: your pets keep close at your heels, so from your eyes they are at the bottom of the screen, and one can stand behind another for a moment. Written down for the owner (section 5c).

### G4-206 (fixed, how bad 2): a grandma's long line
- Device: iPad, PC
- What's wrong: A long line ("Holidays bring something new here, you'll see.") was one huge pill running off the screen's left edge, under the corner map and the bus pill (and in M-117 the grandma stood at the camera too). (viewer marks M-104 (pass 8), M-105 (pass 8), M-106 (pass 8), M-107 (pass 8), M-117 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: Over 22 letters the bubble wraps onto two lines, split at the space nearest the middle, and its size cap is two lines' height (patch_f4.py); a grandma at the camera is not drawn (G4-171).
- Fix check: N6, N24 and N38 pass; pass 9 pictures.

### G4-207 (fixed, how bad 2): the duck-pond bench
- Device: iPad
- What's wrong: Two speech bubbles overlapped: "Hee hee!" on the middle of the other line. (viewer marks M-108 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: A grandma who starts talking ends the bubble of any grandma within 3 m (after a jump of the clock the next one could start while the first was still talking) (patch_f4.py).
- Fix check: N6 passes; pass 9 pictures.

### G4-208 (fixed, how bad 1): the designer job: a new client
- Device: iPad
- What's wrong: The "+20" coin pop sat on the "New client!" message, over its first words. (viewer marks M-109 (pass 8), M-112 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: The coin pop keeps clear of the message card too (patch_f5.py).
- Fix check: pass 9 pictures; pass 10: once more, with the message coming after the pop (G4-229).

### G4-209 (fixed, how bad 1): the designer job's room
- Device: iPad
- What's wrong: A white ring floated in the room (over the sofa, beside the armchair), at the same screen spot in both rooms. (viewer marks M-110 (pass 8), M-113 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: It was the aim ring of decorating: the big-button style (.big) gave it a button's padding and height, so the 28 px ring was a 118 × 70 px ellipse; it is a 28 px ring again (patch_f5.py).
- Fix check: a probe of the room; N8 passes; pass 9 pictures.

### G4-210 (fixed, how bad 1): the designer's wish card
- Device: iPad
- What's wrong: The title was cut: "Sunny living room · r…". (viewer marks M-111 (pass 8), M-114 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: "room 1 of 2" goes on a line of its own under the title (patch_f3.py).
- Fix check: N8 passes; pass 9 pictures.

### G4-211 (fixed, how bad 2): a photo shoot by the food truck
- Device: iPhone sideways
- What's wrong: "Pick up the litter" and its big button sat inside the dashed photo frame. (viewer marks M-116 (pass 8))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 8)
- Fix: While a shoot is on only its own buttons show (patch_f5.py).
- Fix check: N25 passes; pass 9 pictures.

### G4-212 (fixed, how bad 1): the phone: calendar
- Device: iPad
- What's wrong: In Saturday's tile the ⭐ and the 🏆 sat to the left, one under the other, not under the day. (viewer marks M-005 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: The tile's last line is centred, so they sit under the day (patch_f6.py).
- Fix check: pass 10 pictures.

### G4-213 (fixed, how bad 1): the Pet Shop card
- Device: iPad
- What's wrong: "Buy one and something new pops up!" beside "✨ New in!" was tiny (12 px, faint). (viewer marks M-008 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: 14 px, bolder and darker (patch_f6.py).
- Fix check: pass 10 pictures.

### G4-214 (fixed, how bad 1): the phone's furniture page, the delivery job box
- Device: PC, iPad
- What's wrong: An emoji stood alone on the last line: 🎨 after "free!", 🍕 after "Pizzeria". (viewer marks M-017 (pass 9), M-021 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: A no-break space ties each emoji to its word (patch_f6.py).
- Fix check: pass 10 pictures.

### G4-215 (fixed, how bad 1): the What's new book, page 4
- Device: iPad
- What's wrong: The Pet Shop upstairs picture was soft and pale: its lower third an empty floor, the Capybaras sign cut at its edge. (viewer marks M-012 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: A new picture, a step nearer: the four pens with their animals and all four signs whole (bookswap.py, bookshots7.py).
- Fix check: pass 10 pictures.

### G4-216 (fixed, how bad 1): inside the flower shop
- Device: iPhone upright
- What's wrong: From the door the middle hanging basket's rod came straight out of the ceiling lamp's bulb. (viewer marks M-015 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: That basket hangs 1.5 m to the right, clear of the lamp and of the shop sign (patch_f6.py).
- Fix check: a probe from the door; pass 10 pictures.

### G4-217 (fixed, how bad 2): 1 September: the school hall
- Device: iPad
- What's wrong: No balloons in sight as you come in: f5 had moved the back two bunches by the lockers (G4-187), out of the view from the door. (viewer marks M-020 (pass 9), M-035 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: The back two stand between the posters and the side doors, the 🌈 and 🚀 posters 65 cm nearer the middle door: seen as you come in, clear of the posters and the doors (patch_f6.py).
- Fix check: N22 passes; a probe; pass 10 pictures.

### G4-218 (fixed, how bad 2): the hair salon
- Device: iPad, PC
- What's wrong: Big words ("Ava sits down!", "Ben comes in!") lay across the customer's face once the view turned to them (G4-194). (viewer marks M-030 (pass 9), M-054 (pass 9), M-055 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: When the hair card opens at once, its tab names who sat down, so "… sits down!" pops only when the card cannot open; as the view turns to the face, big words still on the screen or waiting go (patch_f6.py).
- Fix check: N13 passes; a probe; pass 10 pictures.

### G4-219 (fixed, how bad 1): the hair card
- Device: iPhone sideways
- What's wrong: The card covered the end of the job pill: "Ben is in your ch". (viewer marks M-049 (pass 9), M-051 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: Under a bottom card on a short screen the job pill waits out of sight, like the HUD pieces such a card would touch (patch_f6.py).
- Fix check: N13 passes; pass 10 pictures.

### G4-220 (fixed, how bad 1): a photo shoot at the school
- Device: iPhone sideways
- What's wrong: The "Everyone is posed!" message lay over the school's name board, the background the booking asked for. (viewer marks M-052 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: On a short sideways screen the shoot's messages sit at the top, above the viewfinder (patch_f6.py).
- Fix check: pass 10 pictures: the message still lay over the school's sign: f6's style rule did not take, the game places its messages itself; f7 places it (G4-235).

### G4-221 (fixed, how bad 2): friends round you (after G4-203)
- Device: iPad
- What's wrong: After a turn on a narrow pavement Theo stood half behind Luna and Rosie walked past right at the camera; in the other pictures Finn's face showed beside Luna's hair. (viewer marks M-040 (pass 9), M-043 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: The friends stand on an arc over the free part of the view: its two ends nearer (2.8 m), its middle further back (up to 4.6 m), so each face shows between the two in front; every order of filling it is tried (24 for four friends) and a face behind another's head costs most; a friend on the way to a spot waits unseen within 1.3 m of the camera, like a passer-by (patch_f6.py).
- Fix check: N3 passes; a probe of the check's two stops and turns; pass 10 pictures.

### G4-222 (open, how bad 2): your pets (G4-205 again)
- Device: iPad
- What's wrong: Your pets at your heels at the bottom edge: a name tag cut at the edge or under the joystick, one pet behind another, three in one clump. (viewer marks M-028 (pass 9), M-041 (pass 9), M-044 (pass 9), M-046 (pass 9), M-048 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: The same as G4-205: not changed, written down for the owner (section 5c).

### G4-223 (not a glitch, how bad 1): the photographer's own staging
- Device: iPad, PC
- What's wrong: A car right at the camera (the school front in rain); the garden's back wall pink after the house was painted purple; two shoppers inside each other; a posed townsperson on the road at New Year. (viewer marks M-009 (pass 9), M-010 (pass 9), M-018 (pass 9), M-019 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: The photographer's framing, not the game: the school-front spot stood 30 cm into the road (pass 10: on the pavement); the garden spot repaints the house in the lane's own colour on purpose (a plain one-storey house); the photographer had moved a shopper to the spot another one was walking to (the game keeps two shoppers off one spot; pass 10 checks both); the New Year shot puts three townsfolk in a row 3.6 m ahead and one landed on the road (pass 10 keeps the row off it).
- Fix check: pass 12: a car stood at the photographer's delivery spot, and walking up to a car's middle brings your eyes as near: G4-262.

### G4-224 (not a glitch, how bad 1): the big map
- Device: iPad, iPhone sideways
- What's wrong: Place names cut at the map's edges; under the "👆 Tap a place" tip only the end of a name showed ("air Salon"). (viewer marks M-011 (pass 9), M-038 (pass 9), M-053 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: The map is wider than its frame and scrolls (stage 3); the tip fades away after 4 seconds, and the town's bottom row scrolls up above it (stage 3).
- Fix check: —

### G4-225 (not a glitch, how bad 1): the check's own staging
- Device: iPad
- What's wrong: A pink thing half sunk in the park fountain at Christmas; play feedback (words, toys, a hand) piled on the Spooky path sign; a "🥚 18/25" floating over the scene under "All 25!"; grandmas behind a message, ducks under the buttons. (viewer marks M-022 (pass 9), M-023 (pass 9), M-024 (pass 9), M-025 (pass 9), M-026 (pass 9), M-027 (pass 9), M-032 (pass 9), M-036 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: An autumn leaf at the end of its fall (the check jumps from October to December in one page, so autumn's leaves still fall; a December game has none); N11 feeds and plays with each new pet in one go, so both games' feedback rises at once; each egg's "n/25" rises where it was found and the check picks up all 25 at once; N24's camera stands where its check stands, under the bus message.
- Fix check: —

### G4-226 (not a glitch, how bad 1): your house upstairs, an old save
- Device: iPad
- What's wrong: The purple bed seemed pushed into the bunk bed. (viewer marks M-029 (pass 9))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 9)
- Fix: They stand 70 cm apart side by side (a probe from the side); from the stairs one is seen behind the other.
- Fix check: —

### G4-227 (fixed, how bad 1): the hair salon: a customer's wish
- Device: PC
- What's wrong: "I'd like my hair shoulder-length and bun" (clumsy words). (viewer marks M-063 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: The wish reads like a child would say it: "I'd like brown hair, shoulder-length, in a bun, please!", "long and straight", "short, in pigtails" (patch_f7.py).
- Fix check: a check of every style; N13 passes; pass 11 pictures.

### G4-228 (fixed, how bad 1): the photo and hair result cards
- Device: iPhone sideways
- What's wrong: The "+120 🪙" pop flew half behind the card's top edge. (viewer marks M-022 (pass 10), M-033 (pass 10), M-059 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: A coin pop is drawn over a card (it was drawn under it) (patch_f7.py).
- Fix check: pass 11 pictures.

### G4-229 (fixed, how bad 1): the designer job: a new client (after G4-208)
- Device: iPad
- What's wrong: The "+20 🪙" pop lay on the "New client!" words that came a moment after it. (viewer marks M-058 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: When a message comes after a coin pop, the pop moves clear of it (patch_f7.py).
- Fix check: N8 passes; pass 11 pictures.

### G4-230 (fixed, how bad 1): the clock chip
- Device: iPad, PC, Android tablet
- What's wrong: The chip showed ☀️ under a grey sky. (viewer marks M-045 (pass 10), M-052 (pass 10), M-062 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: The sky turns fully grey in the first 40 % of a weather change, the chip turned at 50 %; the chip shows the sky as you see it now: ☁️ once the sky is half grey, 🌧️ and 🌨️ as soon as rain or snow falls (patch_f7.py).
- Fix check: a check of each sky; N16 and N18 pass; pass 11 pictures.

### G4-231 (fixed, how bad 2): a grandma walking by
- Device: PC
- What's wrong: At the Beach Bus stop a grandma walked right through the camera: her head and cardigan filled a third of the screen, her shoes stuck out under a card. (viewer marks M-036 (pass 10), M-037 (pass 10), M-040 (pass 10), M-041 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: A grandma walks round you, at least 2.1 m away (a smooth step aside from 4.5 m before you to 4.5 m past you), and keeps her step while she stands; on your device only: her place in the day's plan stays the same on every device (patch_f7.py).
- Fix check: a check by script; N24 passes; pass 11: on the PC (a slow screen) a grandma still passed 1.5 m from the camera: G4-249.

### G4-232 (fixed, how bad 2): a friend out for a walk
- Device: iPad
- What's wrong: Luna, out for a walk, stood 0.9 m in front of the camera, her back and hair filling a quarter of the view, for as long as you stood still. (viewer marks M-004 (pass 10), M-005 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: A friend out for a walk gives way like a passer-by: coming at you, she stops 2.4 m away and after a moment walks back; right at the camera (1.3 m) she waits unseen, like a friend who follows you (patch_f7.py).
- Fix check: a check: she stops at 2.39 m and turns back; N3 passes; pass 11 pictures.

### G4-233 (fixed, how bad 2): friends round you
- Device: iPad
- What's wrong: After a turn a townsperson stood between you and your friends, hiding Luna and Theo. (viewer marks M-057 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: A passer-by never steps into the space between you and your friends round you, and one standing there when they gather steps out of view, as in a photo shoot; a passer-by coming straight at you stops 2.4 m away (1.7 m before); one walking away from you is never held (patch_f7.py).
- Fix check: a check of the circle; N3 passes; pass 11 pictures.

### G4-234 (fixed, how bad 1): name tags far away
- Device: iPad, iPhone
- What's wrong: The Pet Show judges' far name tags were tiny pills piled in a staircase; at New Year a far grandma's tiny bubble, drawn over everything, sat on a near face. (viewer marks M-014 (pass 10), M-016 (pass 10), M-019 (pass 10), M-021 (pass 10), M-053 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: A name tag or bubble too small to read (a line under 15 px tall) fades out, gone under 11 px (patch_f7.py).
- Fix check: probes of the photo shoot and the stage; pass 11 pictures.

### G4-235 (fixed, how bad 2): a photo shoot at the school (after G4-220)
- Device: iPhone sideways
- What's wrong: The "Everyone is posed!" message still lay over the hanging school sign and Ben's tag; the big school sign was cut by the top edge, behind the coin, food and clock chips. (viewer marks M-061 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: On a short sideways screen the chips step aside during a shoot and the shoot's messages sit at the top left, in their place (patch_f7.py).
- Fix check: N25 passes; a probe; pass 11 pictures.

### G4-236 (fixed, how bad 1): the phone: calendar (after G4-163)
- Device: iPhone sideways
- What's wrong: On a Saturday the Halloween line stopped at "…and the" in the phone's bottom fade. (viewer marks M-032 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: On a short sideways screen the week's tiles are lower, so the month's line shows in full above the fade (patch_f7.py).
- Fix check: a probe on a Saturday; pass 11 pictures.

### G4-237 (fixed, how bad 1): the phone: Rosie's job list
- Device: iPhone upright
- What's wrong: "Photographer" touched both sides of its card. (viewer marks M-015 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: The job titles are a little smaller on the phone (13 px) (patch_f7.py).
- Fix check: a probe; pass 11 pictures.

### G4-238 (fixed, how bad 1): the Clothes Shop's New in! row
- Device: iPad (dark)
- What's wrong: The Special cap's near-black colour dot had no ring and vanished on the dark card. (viewer marks M-043 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: A colour dot keeps its light ring when the device is in dark mode, not only when dark is picked in the settings (the book's page dots too) (patch_f7.py).
- Fix check: a probe; pass 11 pictures.

### G4-239 (fixed, how bad 1): the Toy Store's corner post
- Device: iPad
- What's wrong: A faint dashed line ran down the pink corner post, roof edge to pavement. (viewer marks M-001 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: Cause, found by switching the ink outlines off: the wall's ink shell ran 4 cm behind the post's face, too close for the depth test from across the street. The corner posts of every flat-roofed building stand 11 cm out from the wall, not 7 (patch_f7.py).
- Fix check: a probe of the same view: the line is gone.

### G4-240 (fixed, how bad 1): the Toy Store and Hair Salon awnings
- Device: iPad
- What's wrong: The awning seemed to run on past the shop's far corner into thin air, off-centre. (viewer marks M-008 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: The awning is centred (20 cm over each end), but it reaches 1.4 m out from the wall, so seen from one end its open far end looked like a strip hanging past the corner; both ends are closed by a side valance now (patch_f7.py).
- Fix check: probes from both ends; pass 11 pictures.

### G4-241 (fixed, how bad 1): the duck pond
- Device: iPad
- What's wrong: Broken dark-blue blotches on the water along the reeds. (viewer marks M-003 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: The reeds' 3.6 cm stems were too thin for the sun's shadow map; they cast no shadow now (patch_f7.py).
- Fix check: a probe; pass 11 pictures.

### G4-242 (fixed, how bad 1): the Tree Park: the star over your next deck
- Device: iPad
- What's wrong: Seen half-way round, the turning star looked like a bell drawn through a star. (viewer marks M-010 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: It was two crossed stars turning; now one star faces you and sways a little (patch_f7.py).
- Fix check: a probe; pass 11 pictures.

### G4-243 (fixed, how bad 1): inside the Bakery
- Device: iPad
- What's wrong: A shopper at the counter stood right in front of Mrs. Crumb as seen from the door: the two read as one stacked figure. (viewer marks M-012 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: The counter's right-hand spot (Bakery and Ice Cream Shop) is 85 cm further right, out of the line from the door to the shopkeeper (patch_f7.py).
- Fix check: a probe from the door; pass 11 pictures.

### G4-244 (open, how bad 1): the Tree Park: a tree crown
- Device: iPad
- What's wrong: A short row of soft dark dots on a big orange crown. (viewer marks M-002 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: Found by switching each shadow caster off in turn: another orange crown's shadow, broken up by the sun's shadow map (2048 px over 60 m); the same as G4-088, written down in stage 3.

### G4-245 (open, how bad 1): your pets (G4-205 again)
- Device: iPad
- What's wrong: Mochi and Clover with their big tags in front of the Pet Shop's upstairs pens. (viewer marks M-013 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: The same as G4-205: not changed, written down for the owner (section 5c).

### G4-246 (not a glitch, how bad 1): not glitches
- Device: iPad, iPhone sideways
- What's wrong: The fountain mottled at night; a house sign without a garland in October; the Toy Store's name off-centre on its board; two shoppers at the left edge of the Pet Shop, one behind the other, and one behind the buttons. (viewer marks M-006 (pass 10), M-009 (pass 10), M-034 (pass 10), M-035 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: The mottling is the water falling from the fountain's bowls (blue at night; the same sheets show in rain); the Halloween line's "garlands on their posts" means garlands hanging on posts of their own (no garland floats), the house signs have their pumpkins; the name sits in the middle of its board, above the door: measured, from where the camera stands the board's far half looks about half as long as its near half; the shoppers stand at their spots by the side shelves, at the edges of a wide view.
- Fix check: —

### G4-247 (not a glitch, how bad 1): the photographer's own staging
- Device: iPad
- What's wrong: On a rare delivery the job box read 0:44 while Chef Blaze's card said the timer starts when you close it. (viewer marks M-044 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: The photographer's framing, not the game: the photographer picks the pizza up in the street; in the game Chef Blaze hands it over in the pizzeria, where the timer waits for his card (pass 11 closes the card).
- Fix check: —

### G4-248 (not a glitch, how bad 1): the check's own staging
- Device: iPad
- What's wrong: A townsperson's back filling the middle of the fountain pictures; a faded "And the winner is…" over a new pet; the whole picture dimmed after the stairs. (viewer marks M-046 (pass 10), M-047 (pass 10), M-048 (pass 10), M-049 (pass 10), M-051 (pass 10))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 10)
- Fix: The check puts you at the fountain in one step, onto a townsperson's way (the one walking off was 1.4 m ahead; a child walking there meets them coming, and they stop 2.4 m away); N11 runs each pet's Pet Show in fast game time, and the show's drum message fades in real time; N12 takes its upstairs picture as the stairs' 0.4 s fade ends.
- Fix check: —

### G4-249 (fixed, how bad 2): a grandma walking by (after G4-231)
- Device: PC
- What's wrong: At the Beach Bus stop a grandma still passed right at the camera: her head and cardigan filled the left quarter (the light-theme picture and the December picture showed the same; the filter set those two aside under a wrong reason). (viewer marks M-022 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: Her step aside followed the drawn frames, so on a slow screen (the PC pictures) it lagged and she passed 1.5 m from you; it follows the clock now, and keeps 2.4 m, like a passer-by (patch_f8.py).
- Fix check: a check by script with frames 50 ms and 200 ms apart: 2.37 m and 2.4 m at the closest (before: 2.06 m and 1.79 m); N24 passes; pass 12 pictures.

### G4-250 (fixed, how bad 1): the big map
- Device: iPhone, iPad, PC
- What's wrong: Your friends' dots had no names (the builder's picture shows Luna, Rosie and Finn); Rosie's dot lay on the S of "Spooky path". (viewer marks M-015 (pass 11), M-017 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: A friend's name was tested against its own dot with the air round it (stage 3), so every side touched the dot and no name was ever drawn; it is tested against the others only. A place's name a friend's dot lies on is drawn again over the dot (patch_f8.py).
- Fix check: a probe of the map: Theo, Rosie and Luna by their dots; pass 12 pictures.

### G4-251 (fixed, how bad 1): the What's new book
- Device: PC
- What's wrong: On the last page the page dots sat 21 px left of the middle: the wider "Let's play!" button pushed them. (viewer marks M-020 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: The footer is three columns, the dots in the middle one (patch_f8.py).
- Fix check: pass 12: on an upright phone the last page's wider button lay on the dots (the three even columns were narrower than it): G4-261.

### G4-252 (fixed, how bad 1): a message after the clock jumped
- Device: iPad
- What's wrong: At 22:10 the message said "The football friends are at the field until 19:00. Come and play!". (viewer marks M-024 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: It had waited for its turn while the clock jumped (in the game: a night in bed); a waiting message is dropped once the game clock has moved half an hour or a day since (patch_f8.py).
- Fix check: a check by script: queued at 14:03, the clock to 22:06: not shown (before: shown).

### G4-253 (fixed, how bad 1): a message over the big map
- Device: Android tablet (upright)
- What's wrong: The "You are online!" message lay on the chat and phone buttons. (viewer marks M-027 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: With a big card open and no free spot beside it, a message goes up in the top row, left of the round buttons (patch_f8.py).
- Fix check: a check by script on the tablet: the message clear of the buttons and the card.

### G4-254 (fixed, how bad 2): New Year's fireworks
- Device: iPad
- What's wrong: The fireworks hardly read as fireworks: a thin spray of pale dots and a white smudge. (viewer marks M-023 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: Bigger sparks (up to 16 px), 130 to a burst, in their own colours: added up, sparks lying on each other made a young burst a white blob; they fade in over the first moment and stay bright longer (patch_f8.py).
- Fix check: probes at three moments; N21 passes; pass 12 pictures.

### G4-255 (fixed, how bad 1): the photographer's stars
- Device: iPad
- What's wrong: Ben asked for "the bench behind us"; the photo showed a blue wall and no bench and still got the full score. (viewer marks M-034 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: Only the school sign had a point to check whether the background is in the photo; every other background counted as in. Each now has one: 2 m behind where the group stands, 1 m up (patch_f8.py).
- Fix check: a check by script: from the front 5 stars, from behind the group the bench no longer counts; N25 passes.

### G4-256 (fixed, how bad 2): a photo shoot at the Pet Show stage
- Device: iPhone sideways
- What's wrong: Two judges sat right beside the camera, cut by the screen edge, one reaching into the photo; a judge's name tag cut at the edge of the result. (viewer marks M-041 (pass 11), M-042 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: The judges step out of a photo shoot like anyone else (patch_f8.py).
- Fix check: a probe of the shoot on a Saturday; N25 passes; pass 12 pictures.

### G4-257 (open, how bad 1): shadows (G4-088 again)
- Device: iPad
- What's wrong: Soft dark dots on a Tree Park crown; fine stripes under the apartments' window sills at 11:30. (viewer marks M-005 (pass 11), M-040 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: The same as G4-088 and G4-244: the sun's shadow map (2048 px over 60 m), written down in stage 3.

### G4-258 (open, how bad 1): your pets (G4-205 again)
- Device: iPad
- What's wrong: Mochi behind Finn, its tag cut to "chi"; Waffles' hatted head at the bottom edge, its tag on Rosie's dress. (viewer marks M-038 (pass 11), M-039 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: The same as G4-205: not changed, written down for the owner (section 5c).

### G4-259 (not a glitch, how bad 1): decided before
- Device: iPad, PC, iPhone sideways
- What's wrong: The book over the corner map and the notepad; the garden's back wall not the house's purple; the joystick in from the edge on a sideways phone; a round shadow on the market's fruit stand; the iPad's notepad over two townsfolk's heads; the map's places list fading at its foot under the ⬇️ hint. (viewer marks M-002 (pass 11), M-008 (pass 11), M-019 (pass 11), M-021 (pass 11), M-025 (pass 11), M-043 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: A card over the dimmed HUD (G4-033, G4-060); the photographer's garden spot repaints the house on purpose (G4-223); where the owner put the joystick (commit 0f5939f); your own shadow (G4-146); the HUD stays where it is, and the photographer's New Year row stands left of the middle; the list's scroll hint (G4-034).
- Fix check: —

### G4-260 (not a glitch, how bad 1): the check's own staging
- Device: iPad
- What's wrong: The spooky path's picture facing the street; a grandma's back filling the fountain picture; a lamp post coming down into a new pet's head; a townsperson's hat hidden in a low tree crown right at the camera; the camera tilted at the sky after a pick-up. (viewer marks M-029 (pass 11), M-030 (pass 11), M-031 (pass 11), M-032 (pass 11), M-033 (pass 11), M-035 (pass 11), M-036 (pass 11))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 11)
- Fix: N1 photographs from a fixed spot; N10's camera stands 2.7 m behind the grandmas' park stop, where one stood facing the fountain; N11 photographs each new pet by the same lamp post; N21 puts you in one step right behind a tall townsperson under a street tree; N27 looks up after each pick-up (the check counts the litter by code).
- Fix check: —

### G4-261 (fixed, how bad 2): the What's new book on an upright phone
- Device: iPhone upright
- What's wrong: On the last page the wide "Let's play!" button lay on the page dots and hid the last three, this page's pink one among them (since f8, G4-251). (viewer marks M-003 (pass 12), M-006 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: The footer's side columns are at least as wide as their buttons: the dots stay in the middle where they fit and move aside where they do not, never under a button (patch_f9.py).
- Fix check: a footer probe on 4 screens, every page; pass 13 pictures.

### G4-262 (fixed, how bad 3): a car right at the camera
- Device: iPad
- What's wrong: The delivery picture showed no town: a flat green field and a dark band across the middle. A mint car stood at the photographer's spot on the road; its cabin was 15 cm from the camera and its roof edge 2 cm above eye height. (viewer marks M-015 (pass 12), M-016 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: A car is one box for you to bump into, like the bus: your eyes stay 30 cm from its body and half a metre from its cabin (its two round ends let you walk up to 15 cm from the cabin's side, as at the photographer's spot) (patch_f9.py); the photographer's delivery spot keeps out of a car standing there too, as walking would (shots4b.py).
- Fix check: a check by script round a car (eyes to the cabin: 0 before, 0.50 m after); pass 13 pictures.

### G4-263 (fixed, how bad 1): the phone's screen
- Device: iPhone sideways
- What's wrong: A muddy grey band along the foot of every phone page, also with nothing to scroll. (viewer marks M-008 (pass 12), M-010 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: The fade at the screen's foot shows only while there is more below (it let the dark phone through on every page) (patch_f9.py).
- Fix check: a check by script of three phone pages; pass 13 pictures.

### G4-264 (fixed, how bad 1): the bag's counts
- Device: iPhone sideways, dark theme
- What's wrong: The "×3" under each thing was small, light and hard to read. (viewer marks M-011 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: The counts are a size bigger, bold and nearly solid (patch_f9.py).
- Fix check: pictures of the bag before and after; pass 13 pictures.

### G4-265 (fixed, how bad 2): the dance-off's crouch
- Device: iPad
- What's wrong: In the crouch the dancer's legs ended flat on the tiles: the shoes had sunk into the dance floor. (viewer marks M-036 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: The body goes down and the legs slide up into it, so the shoes stay on the floor (they went down 23 cm with the body) (patch_f9.py).
- Fix check: a check by script of the lowest shoe point through the move (-0.23 m before, within 1 cm after); pass 13 pictures.

### G4-266 (fixed, how bad 1): the dance-off on an upright phone
- Device: iPhone upright
- What's wrong: The host's dancer leaned out of the picture (crown, head and arm cut by the left edge). (viewer marks M-017 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: In a room too small for the view to stand 5.6 m back (a plain house: 4.3 m) the view widens until both dancers and their lean fit, up to 95°; a sideways screen keeps its view (patch_f9.py).
- Fix check: the two-phone dance-off on the fixed file; pass 13 pictures.

### G4-267 (fixed, how bad 2): the owl's and the duck's outfits
- Device: iPad
- What's wrong: A new owl's cape stood flat out of its back and its collar hung off its front; on the duck a box sat loose on its back. (viewer marks M-021 (pass 12), M-023 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: The owl and the duck wear their outfits on their own bodies (they borrowed the cat's and the bunny's sizes): the owl's cape and backpack lie on its upright back, the collar and scarf go round both birds' necks, the bow tie sits under the beak (the duck's was inside its chest); a cat, dog, bunny or hamster looks exactly as before (patch_f9.py).
- Fix check: pictures of both birds in every back and neck piece, from the front and the back; the cat and the bunny unchanged pixel for pixel; pass 13 pictures.

### G4-268 (fixed, how bad 1): the little pictures of glowing furniture
- Device: iPad
- What's wrong: The "Seafoam neon sign" in the Home shop showed white tubes, not seafoam. (viewer marks M-033 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: In a little picture a glowing piece glows less, so its own colour shows (the neon sign's tubes, the lamp shades and the lanterns came out nearly white); the pieces in the room glow as before (patch_f9.py).
- Fix check: every lamp-type piece in each colour before and after; pass 13 pictures.

### G4-269 (fixed, how bad 1): the job tutorials' pictures
- Device: iPad
- What's wrong: Pizza, "Follow the dot": the hand right of the dot pointed away from it. Hairstylist: the picture's words were the line under it again ("Make the hair like the picture"). (viewer marks M-034 (pass 12), M-035 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: The hand points at the dot (👈); the hair pictures say what they show ("The picture = the new hair", "A match = stars and coins") under the same lines as before (patch_f9.py).
- Fix check: the tutorial pictures before and after; N38 passes.

### G4-270 (not a glitch, how bad 1): the photographer's framing
- Device: iPad
- What's wrong: Two dark posts behind a tree by the football field ran up into its crown; the garden picture's lower half was the garden fence. (viewer marks M-001 (pass 12), M-002 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: The photographer's framing, not the game: the posts hold the field's scoreboard, which stands 8 m behind that pavement tree: from this one spot its board is behind the crown (from the field it shows); the garden spot stands on the lane outside the garden's fence, so its rails are in front of the first pots.
- Fix check: —

### G4-271 (not a glitch, how bad 1): decided before
- Device: iPhone upright, PC, iPad
- What's wrong: A grey-haired figure in the market with her back to you; a dark half-round on the fruit stand; a small 🎨 at the corner map's foot; Mochi's tag at the joystick. (viewer marks M-004 (pass 12), M-012 (pass 12), M-024 (pass 12), M-037 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: A shopper looking at the shelves (pass 11's double-checkers dropped it; the keeper stands at the right); your own shadow (G4-146); the corner map is a button: tap it to change your dot's colour (since job 7); your pets at your heels (G4-205), their tags seen through the see-through joystick.
- Fix check: —

### G4-272 (not a glitch, how bad 1): the check's own staging
- Device: iPad
- What's wrong: A friend walking by right in front of the fountain picture; the lamp post in each new pet's picture; the Halloween gate's signs at the screen's edges, one behind the notepad; the camera at the sky after a pick-up. (viewer marks M-018 (pass 12), M-019 (pass 12), M-020 (pass 12), M-022 (pass 12), M-027 (pass 12), M-028 (pass 12), M-029 (pass 12), M-031 (pass 12), M-032 (pass 12))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 12)
- Fix: N10 puts you at the fountain in one step, on a walking way (a friend walked by 1.4 m ahead); N11 photographs each new pet by the same lamp post (G4-260); N19 looks at the gate from a fixed spot, the HUD where it always is (its lines count the pieces by code); N27 looks up after each pick-up (G4-260).
- Fix check: —

### G4-273 (fixed, how bad 1): the clock chip's rain
- Device: iPad, Android tablet
- What's wrong: The chip showed 🌧️ while no rain fell, the scene still in sunshine (just after the weather turned). (viewer marks M-015 (pass 13), M-021 (pass 13), M-024 (pass 13))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 13)
- Fix: The chip shows rain or snow once it can be seen: the streaks fade in from rain level 0.3 to 1 and the chip turned at 0.3, with nothing falling yet; it turns at 0.55 now (the streaks a third in) (patch_f10.py).
- Fix check: a check by script of the chip at each rain level; pass 14 pictures.

### G4-274 (fixed, how bad 2): a photo shoot that never ended
- Device: iPad
- What's wrong: After a photo job the corner map and the notepad were gone in town, with the phone's Photos chat open. (viewer marks M-023 (pass 13))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 13)
- Fix: Only the result card's Bye ended a shoot; opening the phone or the bag over the result card left it on: the map, the notepad and the job box hidden and only the shoot's own buttons working, until you left town. Once its result card is gone, however it goes, the shoot ends as with Bye (patch_f10.py).
- Fix check: a check by script: a shoot, then the phone over its result card (the shoot on before, ended after); the Bye path unchanged; N25 passes.

### G4-275 (fixed, how bad 1): quests
- Device: PC
- What's wrong: "Snack time: Eat some flour"; "Buy 3 different treats" with flour among them. (viewer marks M-014 (pass 13))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 13)
- Fix: A day's new quests never ask you to eat raw flour or eggs, and a shopping spree's treats are never flour or eggs (400 such snack quests and 66 such sprees in 200 days before, none after); an old day's quests stay as they were (patch_f10.py).
- Fix check: a check by script of 200 days of quests.

### G4-276 (fixed, how bad 1): the Pet Shop's owl
- Device: iPad
- What's wrong: The owl hung in the air in front of the wall, with its back to the room. (viewer marks M-025 (pass 13))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 13)
- Fix: The owl kept to its perch's height but walked the whole pen, in the air most of the time; it keeps to the perch now and turns to the room when it stops (patch_f10.py).
- Fix check: a check by script over 1500 frames: always on the perch line; pass 14 pictures.

### G4-277 (fixed, how bad 1): the park garland at the bus stop
- Device: iPad
- What's wrong: A holiday garland ran into the bus shelter under its roof. (viewer marks M-001 (pass 13), M-003 (pass 13))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 13)
- Fix: The double-checker dropped both marks: from the front the string is behind the shelter's back wall. From the park side it ran along the back wall, through the roof's rim (the shelter came in run 4; the garland was older); it hangs in two pieces now, either side of the shelter, at every holiday (patch_f10.py).
- Fix check: pictures from the front and the park side; N1 passes.

### G4-278 (not a glitch, how bad 1): two ducks, a bird
- Device: iPhone sideways, PC
- What's wrong: One duck on the pond, with a yellow head on a white body; a dark stick at the top of a photo. (viewer marks M-007 (pass 13), M-008 (pass 13), M-011 (pass 13), M-012 (pass 13))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 13)
- Fix: Two ducks one behind the other from that spot: they keep 80 cm apart (0.78 m at the nearest over 1200 frames), and from there the yellow one's head lies on the white one; one of the town's birds flying over, edge-on with its wings up.
- Fix check: —

### G4-279 (open, how bad 1): the salon floor
- Device: PC 1920
- What's wrong: The floor near the camera looked soft, the far tiles sharp. (viewer marks M-032 (pass 13))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 13)
- Fix: Each room's floor is a 256-pixel picture repeated over the room (about 64 pixels a metre): near the camera on a big screen it softens. A bigger picture costs memory on phones; not changed, written down.

### G4-280 (not a glitch, how bad 1): decided before
- Device: iPhone upright, PC, iPad
- What's wrong: The upright phone's Pet Show picture boxed in by the truck, the fence and the pennants; the places list's ⬇️; the salon's sign under the round buttons. (viewer marks M-005 (pass 13), M-010 (pass 13), M-019 (pass 13))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 13)
- Fix: The photographer's spot (set aside so in passes 11 and 12); the list's scroll hint (G4-034); pass 12's double-checkers dropped the salon's sign (M-025).
- Fix check: —

### G4-281 (not a glitch, how bad 1): the check's own staging
- Device: iPad
- What's wrong: Crates at the edge of the check's photo shoot; the Ideas Board in front of N16's camera; a townsperson's back in N21's; a post, a lamp post, a door at the camera; a friend partly behind another. (viewer marks M-016 (pass 13), M-020 (pass 13), M-022 (pass 13), M-026 (pass 13), M-027 (pass 13), M-028 (pass 13), M-029 (pass 13))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 13)
- Fix: Each check takes its pictures where its test stands (set aside so since stage 3); N21 puts you right behind a tall townsperson (G4-260); four friends in a fan, one can be partly behind another for a moment (pass 11's double-checkers dropped it).
- Fix check: —

### G4-282 (fixed, how bad 1): the salon card's last word
- Device: iPad
- What's wrong: The customer's words wrapped so the last emoji and the closing quote stood alone on a line ("💕”", "✨”"). (viewer marks M-004 (pass 14), M-006 (pass 14))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 14)
- Fix: The last word keeps to the word before it (the space between them cannot break), so an emoji and the closing quote never start a line alone (patch_f11.py).
- Fix check: pictures of the salon card; pass 15 pictures.

### G4-283 (fixed, how bad 1): the job box's distance
- Device: iPad
- What's wrong: The job box broke its line before "· 86 m", the second line starting with the dot. (viewer marks M-005 (pass 14))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 14)
- Fix: The distance keeps to the place before it in the photographer's, the hairstylist's, the teacher's, the designer's and the pizza job box, so a line never starts with "·" (patch_f11.py).
- Fix check: pictures of the job box; pass 15 pictures.

### G4-284 (not a glitch, how bad 1): the photo shoot at the Duck Pond
- Device: iPad
- What's wrong: A thin dark strip at the bottom-right corner, under Snap. (viewer marks M-007 (pass 14))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 14)
- Fix: A bush 1 m from the camera, just below the screen's bottom edge: the black outline round every thing is 2 cm bigger than the thing, so the bush's outline shows at the edge a step before the bush does. Traced by replaying the check's shoot with its booking: no page element there; the pixels are that bush's outline.
- Fix check: —

### G4-285 (open, how bad 1): the phone's jobs on a sideways iPhone
- Device: iPhone sideways
- What's wrong: Three job cards filled the phone screen; the other two (the Hairstylist, the Photographer) showed no part above its foot. (viewer marks M-003 (pass 14))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 14)
- Fix: The cards are as tall as their pictures, and the second row starts right at the screen's foot; the foot fades while there is more below (G4-263) and the list scrolls. Not changed: written down for the owner (section 5c).

### G4-286 (not a glitch, how bad 1): your friends in a shop
- Device: iPad, dark theme
- What's wrong: A friend half off the screen's edge in the toy shop; one with her back to you at the bakery's counter, her head in front of the menu's last lines. (viewer marks M-001 (pass 14), M-002 (pass 14))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 14)
- Fix: Your friends follow you into a shop and stand round you (the narrower fan, run 4 finish): seen from the door, one can be at the view's edge or at the counter in front of the menu, as anyone in the shop would; they move on with you.
- Fix check: —

### G4-287 (not a glitch, how bad 1): the designer's reveal
- Device: iPad
- What's wrong: A see-through "Knock knock!" over the room. (viewer marks M-011 (pass 14), M-012 (pass 14))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 14)
- Fix: The reveal starts with the client's knock: "Knock knock! 🚪" rises over the room and fades (the check's pictures catch it fading).
- Fix check: —

### G4-288 (not a glitch, how bad 1): decided before
- Device: iPhone sideways
- What's wrong: The hair card over the customer; an orange pet with a white wing half off the screen's bottom-left corner. (viewer marks M-014 (pass 14), M-015 (pass 14))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 14)
- Fix: On a sideways phone the hair card fills the screen's height (G4-194); your pets at your heels (G4-205).
- Fix check: —

### G4-289 (not a glitch, how bad 1): the check's own staging
- Device: iPad, PC
- What's wrong: Two grandmas right in front of N6's camera; "The Food truck is closed now" at noon; a tree in front of N25's camera at the Flower Corner. (viewer marks M-010 (pass 14), M-013 (pass 14), M-016 (pass 14))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 14)
- Fix: N6 looks at the grandmas' bench from right behind them; N9 tries the truck at 21:00 and then turns the clock to noon, its "closed" toast still up for the day picture; N25 stands straight in front of the group at the nearest distance where everyone fits: at the hedge a pavement tree is at the frame's left, in front of nobody (five stars; a player can step aside).
- Fix check: —

### G4-290 (fixed, how bad 1): a quest's steps
- Device: iPhone upright, PC
- What's wrong: A long step wrapped under its ○, and "Ice / Cream Shop" was split over two lines. (viewer marks M-003 (pass 15), M-010 (pass 15))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 15)
- Fix: A long step wraps under its own words now, and the shop's name keeps together (patch_f12.py).
- Fix check: pictures of a quest card on an upright iPhone, a sideways one and a PC (each step's words start at the same place on every line); pass 16 pictures.

### G4-291 (fixed, how bad 1): the photo frame on a touch screen held sideways
- Device: iPhone sideways (and iPad)
- What's wrong: The dashed photo frame sat right of the middle: the family you faced stood left of its middle, in the photo too. (viewer marks M-007 (pass 15))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 15)
- Fix: The frame's left edge kept off the joystick (stage 3) and its right edge stayed near the screen's edge, so its middle was 70 to 76 px right of the camera's; it keeps the same space on both sides now: whom you face is in the middle of the frame and of the photo (patch_f12.py).
- Fix check: a check by script of the frame's middle against the family's (498 and 422 before, 422 and 422 after; five stars before and after); pictures of the shoot and the result card; pass 16 pictures.

### G4-292 (fixed, how bad 1): the clock chip on a cloudy night
- Device: iPad
- What's wrong: A grey night sky with no stars while the clock chip showed 🌙. (viewer marks M-015 (pass 15))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 15)
- Fix: Clouds hide the moon and the stars (f3), but the chip showed 🌙 at night whatever the sky; under a grey night sky it shows ☁️ now, as by day (a clear night 🌙, rain 🌧️) (patch_f12.py).
- Fix check: a check by script of the chip on a cloudy, a clear and a rainy night and a cloudy noon.

### G4-293 (fixed, how bad 1): the path through the Tree Park's gate
- Device: PC
- What's wrong: The path through the gate stopped in a straight edge in the grass a few steps past it. (viewer marks M-009 (pass 15))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 15)
- Fix: Its far end is round now (patch_f12.py).
- Fix check: pictures from the town side of the gate; pass 16 pictures.

### G4-294 (open, how bad 1): the Tree Park's crowns
- Device: iPad
- What's wrong: A small row of brown saw-tooth marks on a yellow crown. (viewer marks M-001 (pass 15))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 15)
- Fix: Traced by script: nothing stands between that point and the sun; the marks are the steps of the sun's shadow map (2048 pixels over 60 m, 3 cm each) on the crown, as in G4-088 and G4-257 (written down in stage 3).

### G4-295 (not a glitch, how bad 1): a duck, a shop, two holiday views
- Device: iPad, iPhone upright
- What's wrong: A grey lump on the pond at night; a chef's hat on the market's oranges; the Christmas tree's star cut by the screen's top; a firework burst at the screen's edge beside an older one's grey dots. (viewer marks M-002 (pass 15), M-006 (pass 15), M-013 (pass 15), M-014 (pass 15))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 15)
- Fix: The white duck from behind in the night light (its face is on its front); from the market's door on an upright phone the fruit stand stands between the camera and the keeper behind it; the photographer frames Santa at eye level, with the tall tree's star above the screen's top (the same view's other picture was dropped by its double-checker, M-012); the bursts fill the sky round the town, so one can be at the screen's edge, and an older burst's sparks fade (G4-254).
- Fix check: —

### G4-296 (not a glitch, how bad 1): decided before
- Device: iPhone upright, PC, iPad
- What's wrong: The notepad over the Toy Store's sign on an upright phone; a dark half-circle on the fruit stand; townsfolk in party hats with their backs to N21's camera. (viewer marks M-004 (pass 15), M-011 (pass 15), M-016 (pass 15))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 15)
- Fix: On an upright phone the fixed HUD can cover part of a sign (section 9c); your own shadow (G4-146, G4-271); N21 puts you right behind a townsperson (G4-260, G4-281).
- Fix check: —

### G4-297 (fixed, how bad 1): the ducks and the lily flowers
- Device: iPhone sideways
- What's wrong: The white duck sat on a lily pad, the pad's pink flower poking out at the duck's chest. (viewer marks M-005 (pass 16))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 16)
- Fix: The little pond's ducks keep 34 cm from each lily flower; and a duck pushed aside by the other (they keep 80 cm apart) no longer swims on straight at its old goal across a flower: a step into water it may not use ends that swim (patch_f13.py).
- Fix check: a check by script over 6000 frames and 6 feedings: a duck's middle within 34 cm of a flower in 368 duck-frames before, none after (the nearest 0.34 m); the ducks still swim (47 m and 46 m in 5 minutes) and come to you when fed; pass 17 pictures.

### G4-298 (fixed, how bad 1): a duck's eyes
- Device: PC, dark theme
- What's wrong: The white duck's far eye showed as a white ring past its head's outline, like a googly eye. (viewer marks M-007 (pass 16))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 16)
- Fix: The eyes sit a little deeper and their shine on their top, both inside the head's outline: from behind and from the side a shine stuck out past the outline (from 1148 of 1440 view directions, now none; `eyegeo2.py`) (patch_f13.py).
- Fix check: pictures of both ducks from the front, the side and behind; pass 17 pictures.

### G4-299 (not a glitch, how bad 1): a friend behind a post, two ducks, the invitation card
- Device: iPad, PC
- What's wrong: Luna half behind a lamp post beside the camera at the bus stop; the white duck behind the yellow one, its head over the yellow one's; N39's invitation card pale and see-through. (viewer marks M-001 (pass 16), M-006 (pass 16), M-009 (pass 16))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 16)
- Fix: The photographer's bus-stop spot stands beside a lamp post (pass 5): Luna, on her own walk in town, stood behind it from there; two ducks one behind the other from that spot (G4-278); N39's picture caught the card's 0.2 s pop-in (the card shows once per invitation; the line measures the card itself and passes).
- Fix check: —

### G4-300 (not a glitch, how bad 1): decided before
- Device: iPhone upright, iPhone sideways
- What's wrong: A grandma's back filling the fountain view; the pose card over the photo frame's right end. (viewer marks M-002 (pass 16), M-003 (pass 16), M-004 (pass 16))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 16)
- Fix: A grandma walks round you at least 2.1 m away (G4-231): on an upright phone someone 2 m in front fills the middle of the narrow view as she passes; a card over the scene and the HUD while it is open (G4-033, G4-060).
- Fix check: —

### G4-301 (fixed, how bad 1): October: the bus shelter at the park
- Device: iPad
- What's wrong: A thin white line lay on the shelter's roof, as if a garland string ran through the roof and its sign. (viewer marks M-001 (pass 17))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 17)
- Fix: It was the shelter's two cobwebs, standing up through the roof (their middle at the roof's height); they hang in its front corners under the roof now, from the post to the side glass (patch_f14.py).
- Fix check: pictures of the photographer's bus-stop view and of both corners close, before and after (`views_f14.py`); pass 18 pictures.

### G4-302 (fixed, how bad 1): the lake
- Device: iPad
- What's wrong: The bench by the lake faced the grass, side-on to the water. (viewer marks M-004 (pass 17))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 17)
- Fix: It faces the water now (it faced along the shore); its two seats turn with it (patch_f14.py).
- Fix check: pictures from the town and from behind the bench, before and after; pass 18 pictures.

### G4-303 (fixed, how bad 1): a shop card in the dark theme
- Device: PC, dark theme
- What's wrong: The Midnight cat tree's picture, dark navy, was hard to make out on the dark purple tile. (viewer marks M-008 (pass 17))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 17)
- Fix: In the dark theme a furniture picture (a shop's New in, the designer's list, the claw machine's prize) has a thin light edge (patch_f14.py).
- Fix check: pictures of the Pet Shop card in the dark theme with a Midnight, a Cloud and a Hot pink cat tree new in, before and after (`views_f14dark.py`); pass 18 pictures.

### G4-304 (fixed, how bad 1): inside a shop, at the door
- Device: PC
- What's wrong: A shopper stood right against the camera at the edge of the view: a giant half face (the Pet Shop), a big yellow figure (the Flower shop). (viewer marks M-015 (pass 17), M-016 (pass 17))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 17)
- Fix: A shopper walked on until 0.9 m from you and waited there for as long as you stood still; it stops a step before you when you stand on its way (2.4 m straight ahead, 1.7 m at an angle) and, after a moment, goes back, like a passer-by in town (patch_f14.py).
- Fix check: a check by script in nine shops, 30 s each while you stand just inside the door (`views_f14.py`): a shopper within 1.2 m in front of you in 7 of the 9 before (for nearly all 30 s in the Pet Shop, the Flower shop, the Toy Store and the library; the nearest 0.80 m), in none after (the nearest 1.41 m, passing by); pass 18 pictures.

### G4-305 (fixed, how bad 1): a grandma behind the bus shelter
- Device: PC
- What's wrong: A tiny bubble, "The park is the heart of our town.", floated over the shelter's glass with nobody under it. (viewer marks M-017 (pass 17))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 17)
- Fix: A grandma's bubble (and a photo family's name tag) is drawn over everything only within 10 m and while it can be read (a line 15 px tall or more); further away a wall in front of her hides it, like any name tag (patch_f14.py).
- Fix check: a check by script with a grandma at the park, 13 to 16 m away behind the shelter: her bubble over the shelter before, hidden by it after; 2.9 m away it is drawn over everything as before; pass 18 pictures.

### G4-306 (open, how bad 1): the Tree Park's crowns (G4-294 again)
- Device: iPad
- What's wrong: Small brown striped bits on a big yellow crown by the first deck of the hard path. (viewer marks M-002 (pass 17))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 17)
- Fix: The same as G4-294: the steps of the sun's shadow map on the crown (written down in stage 3).

### G4-307 (open, how bad 1): the photographer's shoot at the pond's bench
- Device: iPhone sideways
- What's wrong: The bench, the photo's background, was mostly behind Lily; a grey wall filled half the frame. (viewer marks M-012 (pass 17))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 17)
- Fix: The shoot's start spot stands straight in front of the family, back just far enough that everyone fits (round 5), and does not look for the background; a child turns or steps aside to frame it: written down for the owner (section 5c).

### G4-308 (not a glitch, how bad 1): the Home shop: two pieces, one picture
- Device: iPad
- What's wrong: Armchair and Beanbag showed the same blue seat 💺. (viewer marks M-011 (pass 17))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 17)
- Fix: A shop's list shows each piece's emoji, and there is no beanbag emoji; Bed and Bunk bed share 🛏️ the same way. The names under them tell them apart (the New in tiles show the piece itself).
- Fix check: —

### G4-309 (not a glitch, how bad 1): decided before
- Device: iPhone sideways, iPad
- What's wrong: The ⬇️ over two tiles' corners on the Market card; N27's camera tipped up at the sky after a pick-up; the coin, food and clock chips gone while a photo's +120 popped. (viewer marks M-006 (pass 17), M-010 (pass 17), M-013 (pass 17))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 17)
- Fix: A card that scrolls shows the ⬇️ in a soft fade over its foot, inside the card (section 1, after round 5; the same on the Pet Shop card was dropped by its double-checker, M-007); N27 looks up after each pick-up (G4-260); on a short sideways screen the chips step aside during a shoot (G4-235).
- Fix check: —

### G4-310 (fixed, how bad 1): the phone: quests
- Device: iPhone upright
- What's wrong: A cooking quest read "Cook cheese sandwich on your stove". (viewer marks M-003 (pass 18))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 18)
- Fix: A cooking quest takes "a" or "some" like the other quests: "Cook a cheese sandwich", "Cook some pancakes", also the last step of a recipe quest (patch_f15.py).
- Fix check: a check by script of all 12 recipes' quests and two recipe quests' last steps, before and after (`views_f15.py`); pass 19 pictures.

### G4-311 (fixed, how bad 1): a shop card: New in!
- Device: iPad, dark theme
- What's wrong: "Grape dog house" and "Violet dog house" side by side looked like one item twice. (viewer marks M-002 (pass 18))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 18)
- Fix: A "New in!" row never shows one piece twice in two colours a child cannot tell apart on its little picture (Grape and Violet, Lilac and Orchid, Lemon and Butter...); it already never showed the exact same one twice (patch_f15.py).
- Fix check: a check by script of 3000 new rows in each of the five shops: one piece twice in look-alike colours in 16 to 463 rows per shop before, none after.

### G4-312 (fixed, how bad 1): the designer's new client
- Device: iPad
- What's wrong: The card said "I live in the Apartments behind the Pet Shop, flat 11, near the Pet Shop". (viewer marks M-013 (pass 18))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 18)
- Fix: A client whose building's name says where it is ("Apartments behind the Pet Shop", "Big apartments by the flowers", "Tall building behind the Market", "Apartments by the park") says no "near" after it; the coloured houses keep theirs ("the Blue house, near the Lake") (patch_f15.py).
- Fix check: a check by script of 300 new clients: every building's line before and after (`views_f15.py`).

### G4-313 (fixed, how bad 1): the photographer's first view of a shoot
- Device: iPhone sideways
- What's wrong: Everyone's feet were below the photo frame at the shoot's start. (viewer marks M-018 (pass 18))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 18)
- Fix: At the start of a shoot the camera looks for a spot with a clear view where everyone fits; when none passed, it stayed where you stood, and from there the feet were out of the frame. A grandma counted as in the way although she steps out of a shoot (the park stop of the grandmas is at the fountain background: one 1.5 m in front of the family failed every spot); she no longer counts, and when no spot has a clear view the camera takes the nearest where everyone fits (patch_f15.py).
- Fix check: a check by script on a sideways iPhone with a grandma 1.5 m in front of the family and with a wall in front of it: the camera left where it was before (the feet at 326 px, the frame's foot at 304), a spot where everyone fits after (the feet at 294 px; `views_f15b.py`); pass 19 pictures.

### G4-314 (not a glitch, how bad 1): a burst on a cloud, lines on a floor, a yellow bar
- Device: iPad, PC
- What's wrong: A New Year burst resting on a cloud; thin lilac lines across a client room's wooden floor; a yellow bar at the bottom-right corner of a visit to a friend's house. (viewer marks M-006 (pass 18), M-014 (pass 18), M-015 (pass 18))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 18)
- Fix: The bursts go off 34 to 58 m away and the clouds are over 100 m away, so a burst is drawn in front of a cloud (a probe shows a burst's sparks over one); the burst in the picture is whole, just above a cloud's top. The lines are the placing grid, which shows while you decorate (the Furniture, Move and Remove bar was up). The bar is a yellow piece in that house just below the view (no page element there: `views_f15n18.py`).
- Fix check: —

### G4-315 (not a glitch, how bad 1): decided before
- Device: iPad, iPhone upright, iPhone sideways
- What's wrong: An older chat bubble cut under the header; a person close by at the left edge of an upright phone's view; a dark bar at the bottom-right of N25's pond shoot; the customer's head above the hair card on a sideways phone. (viewer marks M-001 (pass 18), M-004 (pass 18), M-007 (pass 18), M-010 (pass 18), M-011 (pass 18), M-020 (pass 18))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 18)
- Fix: An older bubble under the header, as in any chat (pass 13's double-checkers); someone passing 1.3 m or more from you is drawn, and on the narrow upright view one close beside you fills the edge (G4-171, G4-300); the outline of a bush just below the screen at the pond's spot (G4-284); on a sideways phone the hair card fills the screen's height (G4-194, G4-288).
- Fix check: —

### G4-316 (not a glitch, how bad 1): the check's own staging
- Device: iPad
- What's wrong: A white gate post at the edge of N20's February picture; N30's camera down in the fountain's pool. (viewer marks M-009 (pass 18), M-012 (pass 18))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 18)
- Fix: N20 takes its holiday pictures from the Flower Corner's gate; N30 stands where its leaves test stands (G4-260).
- Fix check: —

### G4-317 (fixed, how bad 1): a photo shoot: a raised arm
- Device: iPad, PC
- What's wrong: Mia's raised arm went straight up through her pigtail. (viewer marks M-003 (pass 19))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 19)
- Fix: A raised arm in a pose (wave, peace sign) leans a little forward, so it passes in front of the hair, not through it (straight up, it ran through a pigtail's ball at the side of the head) (patch_f16.py).
- Fix check: pictures of the shoot from the front and from Mia's side, before and after (`views_f16.py`); pass 20's re-check.

### G4-318 (fixed, how bad 1): the photographer's thank-you card
- Device: iPad
- What's wrong: The photo on the card was soft: faces and name tags fuzzy. (viewer marks M-004 (pass 19))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 19)
- Fix: The card shows a sharp copy of the photo (it was made 400 px across for the whole screen and blown up about four times); the copy kept in your phone stays small, as before (patch_f16.py).
- Fix check: pictures of the card, before and after (`views_f16.py`); pass 20: the card sharp, but the kit's N25 failed on the phone's copy: G4-327.

### G4-319 (fixed, how bad 1): inside a shop
- Device: iPad, dark theme
- What's wrong: A shopper walking past stood right at the camera in the Toy Store: a head and a body filled the left sixth of the view. (viewer marks M-005 (pass 19))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 19)
- Fix: A shopper on its way stops a step before you (G4-304), which beside you can be 0.95 m; within 1.3 m of the camera it now waits unseen for that moment, like a passer-by in town and a friend (G4-171) (patch_f16.py).
- Fix check: a probe with a shopper put 0.8 m beside you on its way: filling half the view before, not drawn after (`views_f16.py`); pass 20's re-check.

### G4-320 (fixed, how bad 1): the dance-off on a sideways phone
- Device: iPhone sideways
- What's wrong: The score bar sat on the dancers' crowns and hid the mirror ball. (viewer marks M-013 (pass 19))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 19)
- Fix: On a short sideways screen the chips and buttons above the bar are hidden for the round, so the bar now sits at the top: the dancers and the ball show under it (patch_f16.py).
- Fix check: a real two-phone dance-off, before and after (`shots4c_f.py`); pass 20's re-check.

### G4-321 (fixed, how bad 1): 1 September: the school's banner
- Device: iPad
- What's wrong: The end of the "School party today!" banner covered the front of the little roof over the door. (viewer marks M-014 (pass 19))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 19)
- Fix: The banner hangs 27 cm higher, clear of the little roof from the street and from near the door (patch_f16.py).
- Fix check: pictures from the street and from near the door on 1 September, before and after (`views_f16b.py`); pass 20's re-check.

### G4-322 (fixed, how bad 2): a grandma's bubble at the duck pond
- Device: iPad, light and dark theme
- What's wrong: Her bubble ran under the corner map: "eding the ducks is the best part of my day." (viewer marks M-020 (pass 19), M-021 (pass 19))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 19)
- Fix: A speech bubble (a grandma's, another player's, a football friend's) slides sideways, still over its speaker, to stay clear of the map and notepad column, the buttons and the screen's edges (patch_f16.py).
- Fix check: a probe by the pond, before and after (`views_f16.py`); pass 20: on a sideways phone the bubble ran under the clock chip and the top buttons: G4-328.

### G4-323 (fixed, how bad 1): a butterfly at the camera
- Device: iPad
- What's wrong: A big gold block with a dark top hung in the air by the Easter bunny's bubble: a butterfly 1.3 m from the camera, its two flat wings. (viewer marks M-022 (pass 19))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 19)
- Fix: Butterflies keep 2.2 m from the camera (1.3 m before), so a close one still reads as a butterfly (patch_f16.py).
- Fix check: pictures at the yard's flower beds, before and after (`views_f16.py`); pass 20's re-check.

### G4-324 (open, how bad 1): the hair job on a sideways phone
- Device: iPhone sideways
- What's wrong: A big orange striped thing with a white ear filled the bottom-left corner under the hair card. (viewer marks M-017 (pass 19), M-018 (pass 19))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 19)
- Fix: Found with probes: it is your cat Mochi, 2 m to your left. When the card opens the view turns to the customer and looks down, and the wide sideways view stretches what is at its edge. The same open question as your pets at your heels (G4-205): written down for the owner.

### G4-325 (not a glitch, how bad 1): a shopper and butterflies
- Device: iPad
- What's wrong: A shopper facing you in the bakery, in front of Mrs. Crumb; purple and yellow pieces in a tree crown behind the food truck. (viewer marks M-002 (pass 19), M-015 (pass 19))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 19)
- Fix: A shopper walking from the counter towards the door crosses between you and Mrs. Crumb for a moment, like anyone in a shop (probes of the bakery from the door: the shoppers at their spots leave her in view); the pieces are the park's butterflies flying in front of the crown, the same as pass 19's N5 sky (dropped by its double-checker).
- Fix check: —

### G4-326 (not a glitch, how bad 1): decided before
- Device: iPad, iPhone sideways
- What's wrong: The two ducks one behind the other after you feed them; your pets' tags over the pens upstairs in the Pet Shop; a townsperson close at the left edge by the Christmas tree; an older chat bubble cut under the header. (viewer marks M-001 (pass 19), M-006 (pass 19), M-011 (pass 19), M-016 (pass 19))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 19)
- Fix: The ducks keep 80 cm apart and from your spot one can be behind the other (G4-278); your pets at your heels and their tags, open for the owner (G4-205); someone passing 1.3 m or more from you is drawn (G4-171, G4-300); an older bubble under the header, as in any chat (pass 13's double-checkers).
- Fix check: —

### G4-327 (fixed, how bad 2): the photographer: the photo in your phone's chat
- Device: iPad, iPhone sideways, PC
- What's wrong: The kit's N25 failed on the f16 file: right after the thank-you card, the photo in the phone's chat had no size yet when the phone opened (it showed a moment later).
- Found by: the kit (N25, pass 20)
- Fix: Since f16 the card shows the sharp copy, so the phone's small copy was first decoded when the phone opened; it is decoded at the snap now, as when the card showed it (patch_f17.py).
- Fix check: N25 alone on the f17 file, twice: PASS; pass 21's kit (41 of 41 PASS) and its picture of the phone's chat: the photo shows.

### G4-328 (fixed, how bad 2): a grandma's bubble at the duck pond
- Device: iPhone sideways; iPad, light and dark theme
- What's wrong: On a sideways phone her bubble ran under the clock chip and the top buttons: only "ducks is the ... of my day." could be read; on the iPad its corner lay on the clock chip. (viewer marks M-013 (pass 20), M-014 (pass 20), M-015 (pass 20), M-016 (pass 20), M-001 (pass 20), M-006 (pass 20), M-007 (pass 20), M-017 (pass 20), M-018 (pass 20))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 20)
- Fix: A speech bubble also stays below the top row (the coin, food and clock chips and the top buttons): it moves down, at most its own height, then slides sideways as before (f16 kept it clear of the map column and the buttons only) (patch_f17.py).
- Fix check: the pond probe before and after (`views_f17.py`); pass 21: the bubble below the top row on a sideways iPhone and an iPad, light and dark, no mark about it.

### G4-329 (open, how bad 1): a photo shoot from the side
- Device: iPhone sideways
- What's wrong: A white pill peeked out behind the "Pose: Mia" label at the right edge (only an "e" showed). (viewer marks M-003 (pass 20), M-005 (pass 20), M-011 (pass 20))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 20)
- Fix: Found with a probe: no page element lies there; it is the name tag of the group member standing at the screen's edge, under the action label. Small, left as it is (a tag pushed below the label would leave its person).

### G4-330 (not a glitch, how bad 1): not a glitch, decided before
- Device: iPad, dark theme
- What's wrong: The notepad a cream lined paper in the dark theme; a shopper big at the right edge of the Toy Store, partly behind "Say hi". (viewer marks M-004 (pass 20), M-002 (pass 20), M-008 (pass 20), M-009 (pass 20), M-010 (pass 20))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 20)
- Fix: The notepad is a sheet of lined paper by design, its words readable in both themes; the shopper stands about 1.5 m from the camera (its head 150 px across), and someone 1.3 m or more from you is drawn (G4-171, G4-300).
- Fix check: —

### G4-331 (fixed, how bad 1): the photographer: your phone's chat
- Device: iPhone sideways
- What's wrong: The chat opened at the foot of the thank-you message, so the top of its photo lay under the Photos header. (viewer marks M-004 (pass 21), M-006 (pass 21))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 21)
- Fix: A chat opens at its newest message; when that one is taller than the screen (a photo on a short sideways phone) it now opens at the message's top, the fade at the foot showing there is more (patch_f18.py).
- Fix check: the chat probe before and after (`views_f18.py`); pass 22: the chat opens at the thank-you message's top on a sideways iPhone (a mark about the fade at its foot dropped by the first checker); the kit 41 of 41 PASS.

### G4-332 (not a glitch, how bad 1): not a glitch, decided before
- Device: iPhone sideways; iPad, dark theme
- What's wrong: A palette badge on the corner map about 28 px across; the two ducks one on the other by the pond; two townsfolk at the right edge one in front of the other. (viewer marks M-001 (pass 21), M-002 (pass 21), M-003 (pass 21))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 21)
- Fix: The palette badge is drawn in the map's own picture (a probe found no page element there): the whole map is the one tap target; the fed ducks keep 80 cm apart and from your spot one can be behind the other (G4-278); two townsfolk at different distances, one in front of the other, as anyone in a crowd.
- Fix check: —

### G4-333 (not a glitch, how bad 1): not a glitch
- Device: iPad, dark theme
- What's wrong: Two townsfolk at the right edge of the park, one squeezed in front of the other. (viewer marks M-001 (pass 22))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 22)
- Fix: Two townsfolk at different distances, one in front of the other from the shoot's spot, as G4-332 (the kit's N4 keeps walkers apart: closest 0.64 m).
- Fix check: —

### G4-334 (fixed, how bad 3): the designer job: a two-room order
- Device: iPad
- What's wrong: In room 2 (a forest living room) a white fridge stood inside a pink armchair. (viewer marks M-006 (pass 23 (the full final pass)))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 23 (the full final pass))
- Fix: Room 2 drew room 1's furniture: setting a room up always laid out room 1's list (`o.items`), so room 1's fridge stood where N8 put room 2's armchair, and after a trip back to room 1 your pieces in room 2 were gone from view (the order's lists themselves were right). Each room now shows its own list (patch_f19.py).
- Fix check: the kit's N8 with a probe, before and after; pass 24: the kit 41 of 41 PASS, N8's room-2 picture with only room 2's pieces, no mark about it.

### G4-335 (fixed, how bad 2): a grandma's bubble on an upright phone
- Device: iPhone upright, dark theme
- What's wrong: At the duck pond and the Flower Corner her bubble lay half under the corner map and the notepad ("...s the ...ay."; "...! Such a pretty garden."). (viewer marks M-008 (pass 23 (the full final pass)), M-016 (pass 23 (the full final pass)))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 23 (the full final pass))
- Fix: On an upright phone the map and notepad column is a third of the width: a bubble held over its speaker (who stood under the column or off the left edge) could not clear it, and a speaker off the edge had the whole column counted on its right. Such a bubble now slides fully clear of the column, and a HUD part counts as left or right by the half of the screen it is in (patch_f19.py).
- Fix check: probes before and after (`views_f19.py`); pass 24: the pond bubble readable; the Flower Corner bubble ran past the right edge: G4-340.

### G4-336 (open, how bad 1): the food truck
- Device: iPad
- What's wrong: A small grey ball on the truck's side by the awning's end. (viewer marks M-004 (pass 23 (the full final pass)), M-007 (pass 23 (the full final pass)))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 23 (the full final pass))
- Fix: It is the truck's little evening lamp under the awning's end (unlit by day, with no bracket). Small: left as it is, in the leftover list.

### G4-337 (open, how bad 1): the Christmas tree at night
- Device: iPad, dark theme
- What's wrong: Two big white glows at the sides of the tree's middle washed out its edge. (viewer marks M-003 (pass 23 (the full final pass)))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 23 (the full final pass))
- Fix: The tree's lights glow at night; two of them read as a flare. Small: left as it is, in the leftover list.

### G4-338 (open, how bad 1): the photographer's close view of the ducks
- Device: iPad
- What's wrong: A big dark purple box at the right edge of the view, by the blue house. (viewer marks M-001 (pass 23 (the full final pass)))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 23 (the full final pass))
- Fix: Something by the blue house's corner stands right at that camera spot (the photographer's fixed view). Small: left as it is, in the leftover list.

### G4-339 (not a glitch, how bad 1): not a glitch
- Device: iPad, iPhone upright, PC
- What's wrong: Cattails in front of a grandma on the pond bench; a brown slab at the corner of N22's school view; someone at the left edge in the Pet Shop; two shoppers one behind the other in the flower shop; N24's two grandmas one behind the other on their bench. (viewer marks M-002 (pass 23 (the full final pass)), M-005 (pass 23 (the full final pass)), M-010 (pass 23 (the full final pass)), M-011 (pass 23 (the full final pass)), M-012 (pass 23 (the full final pass)))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 23 (the full final pass))
- Fix: The cattails stand between you and the bench; N22's and N24's pictures come from the check's own camera spots (as N6's, G4-289); someone 1.3 m or more from you is drawn (G4-171, G4-300); two people at different distances, one in front of the other (G4-332).
- Fix check: —

### G4-340 (fixed, how bad 2): a grandma's bubble at the Flower Corner
- Device: iPhone upright, light and dark theme
- What's wrong: Clear of the map column since f19, her bubble ran past the right edge of the screen ("Such" cut, no right border). (viewer marks M-001 (pass 24), M-002 (pass 24), M-003 (pass 24), M-004 (pass 24), M-005 (pass 24), M-006 (pass 24), M-007 (pass 24), M-008 (pass 24))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 24)
- Fix: The bubble (253 px) was wider than the space beside the column (234 px). A bubble that slides clear of the column and is wider than the space beside it is now drawn smaller to fit (patch_f20.py).
- Fix check: the Flower Corner probe after (`views_f19.py`); pass 25: the whole bubble on the screen on an upright iPhone, light and dark, no mark about it; the kit 40 of 41 (N15 on its own timing, then 2 of 3 alone PASS).

### G4-341 (not a glitch, how bad 1): decided before
- Device: iPad
- What's wrong: N8's designer pictures: faint "Knock knock!" over the sofa; thin lilac lines across the floor. (viewer marks M-001 (pass 25), M-002 (pass 25), M-003 (pass 25), M-004 (pass 25))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 25)
- Fix: The designer's reveal starts with the client's knock, the words rising over the room and fading (G4-287); the placing grid shows while you decorate (G4-314).
- Fix check: —

