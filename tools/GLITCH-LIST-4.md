# Glitch list, run 4 (stage 3: the GLITCH HUNTER pass)

How it was made: the PHOTOGRAPHER scripts (shots4.py and shots4b.py in the check kit's scratch) played a test copy with the fake room and ZZTEST players and took pictures of every place, every building inside, every new thing and every screen on iPad, iPhone upright and sideways and PC, light and dark, by day, at night and in rain, in October and on faked holiday dates, with two players together (the map of every picture: tools/pictures-4/stage3/map.json). The CHANGE-SPOTTER compared each with the night-3 picture of the same spot (tools/pictures-3) where one exists, and in later passes with the earlier pass's picture of the same spot. The PHOTOVIEWER (twelve fresh sub-agents, 41 pictures each) marked anything scuffed against the "should look like" lines; the DOUBLE-CHECKER (five fresh sub-agents that never saw the marks being made) kept or dropped each mark; the FIXER fixed each kept one from the root cause; the FIX-CHECKER took the next pass's picture of the same spot as the "after". The pass looped until a full pass found nothing new.

Pass 1 in numbers: 494 pictures (392 + 32 holiday and job pictures + 69 of the kit's own + the Easter retake), 486 viewed, 294 marks. 139 marks were the photographer's own mistakes and were set aside before the double-checker (the dance panel left on screen between the phone and PC pictures, a camera spot with a passer-by, a tree, a post or a wall right in front of it, a picture taken before a 2-second check had run or in an empty test room); they are listed in the kit's scratch (stage3-marks/marks-aside.txt) and the spots were fixed for pass 2. Of the 155 marks that went to the double-checker, 123 were kept and 32 dropped; the kept ones are grouped below by their cause (one glitch, many pictures).

Pass 2 in numbers: every picture again on the fixed file, 585 taken (394 + 32 holiday and job pictures + a 119-picture retake of the fixed camera spots + 40 of the kit's own after the fixes); the change-spotter compared each with pass 1's picture of the same spot and passed 418 changed or new ones to eleven viewers, who marked 162 things. 51 marks were the photographer's own mistakes and were set aside (a tree trunk at the fountain spot, the camera inside a counter or against a passer-by, a picture taken mid-fade or with the snap flash on); five double-checkers kept 87 of the other 111 and dropped 24; grouped by cause they are the entries G4-034 to G4-063 below (the second critic round's lines were fixed in the same batch).

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
| G4-061 | the Toy Store's sign | PC | '🧸 Toy Store' sits left of the middle of its long white board (the right 40% is blank). (viewer marks M-072 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-061-before.webp) · [after](pictures-4/stage3-glitches/G4-061-after.webp) | open |
| G4-062 | inside the Market | iPhone upright | An orange strip with a crisp dark edge ran down the floor from the player to the bottom of the screen. (viewer marks M-046 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-062-before.webp) · [after](pictures-4/stage3-glitches/G4-062-after.webp) | open |
| G4-063 | the Pet Shop upstairs | iPad | No pen in view had a name sign on its fence. (viewer marks M-005 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-063-before.webp) · [after](pictures-4/stage3-glitches/G4-063-after.webp) | not a glitch |
| G4-060 | cards over the HUD | iPad, iPhone sideways | The Clothing store card covered the time chip; the big map's 'Tap a place' bar lies over the bottom row of the map. (viewer marks M-085, M-099 of pass 2) | 1 | [before](pictures-4/stage3-glitches/G4-060-before.webp) · [after](pictures-4/stage3-glitches/G4-060-after.webp) | not a glitch |

63 entries: 50 fixed, 10 not a glitch, 3 open.

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

### G4-061 (open, how bad 1): the Toy Store's sign
- Device: PC
- What's wrong: '🧸 Toy Store' sits left of the middle of its long white board (the right 40% is blank). (viewer marks M-072 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: Not changed yet: the sign text is centred by its measured ink, so the check machine measures the 🧸 wider than it draws it (its fallback emoji font). To look at on a real device before changing the sign builder (it is shared by every shop).
- Fix check: —

### G4-062 (open, how bad 1): inside the Market
- Device: iPhone upright
- What's wrong: An orange strip with a crisp dark edge ran down the floor from the player to the bottom of the screen. (viewer marks M-046 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: Not understood from one picture: it lies where the two fruit stands' shadows meet on the check-tile floor. To look at on a device.
- Fix check: —

### G4-063 (not a glitch, how bad 1): the Pet Shop upstairs
- Device: iPad
- What's wrong: No pen in view had a name sign on its fence. (viewer marks M-005 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: The signs hang on the wall above each pen (2.3 m up, '🐰 Rabbits' and so on), not on the fences; the "should look like" line said fences and is corrected.
- Fix check: N28 passes.

### G4-060 (not a glitch, how bad 1): cards over the HUD
- Device: iPad, iPhone sideways
- What's wrong: The Clothing store card covered the time chip; the big map's 'Tap a place' bar lies over the bottom row of the map. (viewer marks M-085, M-099 of pass 2)
- Found by: PHOTOVIEWER + DOUBLE-CHECKER (pass 2)
- Fix: By design (see G4-016 and G4-033).
- Fix check: —

