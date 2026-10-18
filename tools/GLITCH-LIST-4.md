# Glitch list, run 4 (stage 3: the GLITCH HUNTER pass)

How it was made: the PHOTOGRAPHER scripts (shots4.py and shots4b.py in the check kit's scratch) played a test copy with the fake room and ZZTEST players and took pictures of every place, every building inside, every new thing and every screen on iPad, iPhone upright and sideways and PC, light and dark, by day, at night and in rain, in October and on faked holiday dates, with two players together (the map of every picture: tools/pictures-4/stage3/map.json). The CHANGE-SPOTTER compared each with the night-3 picture of the same spot (tools/pictures-3) where one exists, and in later passes with the earlier pass's picture of the same spot. The PHOTOVIEWER (twelve fresh sub-agents, 41 pictures each) marked anything scuffed against the "should look like" lines; the DOUBLE-CHECKER (five fresh sub-agents that never saw the marks being made) kept or dropped each mark; the FIXER fixed each kept one from the root cause; the FIX-CHECKER took the next pass's picture of the same spot as the "after". The pass looped until a full pass found nothing new.

Pass 1 in numbers: 494 pictures (392 + 32 holiday and job pictures + 69 of the kit's own + the Easter retake), 486 viewed, 294 marks. 139 marks were the photographer's own mistakes and were set aside before the double-checker (the dance panel left on screen between the phone and PC pictures, a camera spot with a passer-by, a tree, a post or a wall right in front of it, a picture taken before a 2-second check had run or in an empty test room); they are listed in the kit's scratch (stage3-marks/marks-aside.txt) and the spots were fixed for pass 2. Of the 155 marks that went to the double-checker, 123 were kept and 32 dropped; the kept ones are grouped below by their cause (one glitch, many pictures).

Pass 2 in numbers: every picture again on the fixed file, 585 taken (394 + 32 holiday and job pictures + a 119-picture retake of the fixed camera spots + 40 of the kit's own after the fixes); the change-spotter compared each with pass 1's picture of the same spot and passed 418 changed or new ones to eleven viewers, who marked 162 things. 51 marks were the photographer's own mistakes and were set aside (a tree trunk at the fountain spot, the camera inside a counter or against a passer-by, a picture taken mid-fade or with the snap flash on); five double-checkers kept 87 of the other 111 and dropped 24; grouped by cause they are the entries G4-034 to G4-063 below (the second critic round's lines were fixed in the same batch).

Passes 3 to 5 in numbers: pass 3 took 475 pictures (394 + 32 holiday and job pictures + 49 of the kit's own), 383 went to eleven viewers, 244 marks, 25 set aside as the photographer's own, the double-checkers kept 175 of 219; pass 4 took 470, 407 to eleven viewers, 186 marks, 31 set aside, 103 kept of 155; pass 5 took 494 (with 4 two-phone dance pictures), 448 to twelve viewers, 227 marks, 90 set aside (the photographer's spots, the kit's staging and timing, and the cases decided in the report's section 9c), 102 kept of 137. The kept marks are grouped by cause into G4-064 to G4-159; each entry names its marks, the pass that found them and the commit that fixed the cause. Pass 6 took every picture again after the pass-5 fixes and is the "after" picture where one exists; pass 7 (after the pass-6 fixes): four of its thirteen viewer batches finished before the org's spend limit stopped the sub-agents (35 marks), and fresh double-checkers kept 15 of 23, grouped into G4-160 to G4-167. Pass 8 was stopped by the owner's wrap-up on 18 Oct after 71 pictures; pass 8 and the last critic round are open (the work is on the branch claude/run-4-wip).

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
| G4-031 | October: the little ghosts | iPad | A little ghost drifted right into the camera and filled a third of the view for a moment. (viewer marks M-143) | 1 | [before](pictures-4/stage3-glitches/G4-031-before.webp) | open |
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

167 entries: 142 fixed, 23 not a glitch, 2 open.

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

### G4-031 (open, how bad 1): October: the little ghosts
- Device: iPad
- What's wrong: A little ghost drifted right into the camera and filled a third of the view for a moment. (viewer marks M-143)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 1)
- Fix: Not changed: the ghosts drift where they drift; walking on takes you past one. Written down for the owner.

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
- Fix check: a probe of the pose card on an upright iPhone after the fix: all three in the dashed frame above the card; N25 passes.

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
- Fix check: a probe of a one-storey and a six-floor house after the fix: the wall round the door is clean; pass 8 pictures.

### G4-161 (fixed, how bad 1): the stair plates on floor 2
- Device: iPad
- What's wrong: "⬇️ Downstairs" ran to both edges of its plate, while "⬆️ Upstairs" beside it had room. (viewer marks M-003 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: A plate's words keep 8% of its width free at each side (the fit test let them run to the edge) (96b40df). The pictures of this pass were taken before the fix went in.
- Fix check: a probe of floor 2 after the fix: both plates have room at the sides; pass 8 pictures.

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
- Fix check: a probe on a sideways iPhone after the fix: Rosie's cards and the Halloween line read in full; the quest list ends in its fade because more quests follow; pass 8 pictures.

### G4-164 (fixed, how bad 1): the big map on a short sideways screen
- Device: iPhone sideways
- What's wrong: The "Tap a place to see the way there!" tip sat over the map's bottom row: Pet Shop and Cozy Park lost their names under it, and a cut "Ice Cream Shop" peeked out below it. (viewer marks M-016 (pass 7), M-018 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: The tip fades away after four seconds (and comes back with the next tip); the card for a place you picked stays (96b40df). The pictures of this pass were taken before the fix went in.
- Fix check: a probe of the big map on a sideways iPhone after the fix: after five seconds the tip is gone and every name on the bottom row reads; N26 passes.

### G4-165 (fixed, how bad 1): friends on the big map
- Device: iPhone sideways
- What's wrong: "Finn" stood 3 px from "Duck Pond", so it read as one name, "Finn Duck Pond". (viewer marks M-017 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: A friend's name on the map keeps 7 px of air from every place name and icon; it takes the next side of its dot that has room (96b40df). The pictures of this pass were taken before the fix went in.
- Fix check: N26 passes; pass 8 map pictures.

### G4-166 (fixed, how bad 2): a photo shoot at the school
- Device: PC
- What's wrong: The asked background, "the school sign", was above the dashed frame, cut by the top of the screen and under the coin and time chips; the "Everyone is posed!" tip sat in the frame over Mia and the cat; the photo had no school sign in it and still got five stars. (viewer marks M-020 (pass 7), M-021 (pass 7), M-022 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: The school has a name board on two tall posts right of its door, the "school sign" background, at a height a photo from the pavement takes in (the name over the door was too high); the asked background has to be in the frame for the stars; the shoot's tips sit under the top row (c6d204f). The pictures of this pass were taken before the fix went in.
- Fix check: N25 passes; a probe of a school shoot after the fix: the board in the frame, the tip at the top; pass 8 pictures.

### G4-167 (not a glitch, how bad 1): the big map's left edge
- Device: PC
- What's wrong: A cut "ne" of "Friends Lane" hung alone at the map's left edge. (viewer marks M-023 (pass 7))
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 7)
- Fix: A map is cut at its edge like any map you can move and zoom; the name shows in full when you move the map (decided in section 9c, with the names at the map's edge in pass 5).
- Fix check: —

