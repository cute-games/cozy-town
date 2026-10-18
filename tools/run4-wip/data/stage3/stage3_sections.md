## 3c. Pictures of stage 3 (tools/pictures-4/stage3/)
- The photographer's pictures of pass 7, the last full pass (442 pictures: every place, every building inside, every new thing, every screen; iPad, iPhone upright and sideways, PC; light and dark; day, night and rain; October and the faked holiday dates; two players together), saved small (640 px webp) with a map of where each was taken: tools/pictures-4/stage3/map.json (set, name, device, theme, place, time, weather, date). They were taken before the round-5 critic fixes (c6d204f to 8fe0d95) and the pass-7 fixes (96b40df); pass 8, which would show those, is open.
- The glitch pictures: tools/pictures-4/stage3-glitches/G4-nnn-before.webp and -after.webp, one pair per entry of tools/GLITCH-LIST-4.md.
- The critics' pictures are the same photographer pictures (their briefs name them); the critic scores are in section 4.
- "Should look like" lines: unchanged from stages 1 and 2 (stage 3 fixed things against them; it built no new area).

## 4. The glitch list and the critic loop scores
- The glitch list: tools/GLITCH-LIST-4.md ({{GSUM}}). How it was made is at the top of that file; every kept viewer mark is in exactly one entry; the photographer's own mistakes were set aside with their reason before the double-checker and the spots were fixed for the next pass.
- The critic loop (the owner asked for it on 17 Oct): for each big change a fresh sub-agent each round saw only the pictures of that part and the builder's "should look like" line(s), never an earlier score, and gave one score from 1 to 10. Below 8: fix and go again; done after three scores of 8 or more in a row; a loop stops after 6 rounds.

{{CRITIC_TABLE}}

- What each round said and what was changed for it is in the kit's scratch (critic-scores.md) and in the pull request "Run 4, stage 3"; the fixes themselves are glitch entries or stage-3 changes in section 1.

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

## 6c. NOT VERIFIED (stage 3)
- The final full check (18 Oct) was stopped by the owner after the save tests, before the walk-through (C2, C2b), the device tests (C1, C3, C4, C5 on every screen size, the teacher job T1 to T4, the PC keyboard K1) and the night-3 and run-4 lines (N1 to N41) ran on the final file: all NOT VERIFIED. The two players in the test room (D1 to D3) passed in it; two real players over the internet stay NOT VERIFIED (G). The run-4 lines last ran on the stage-3 fix builds (section 2: one N15 failed on timing alone while the photographer ran beside it and passed alone; N13, N15, N25, N26 and N34 passed on the build with the pass-7 fixes).
- Real devices (a real iPad, iPhone and PC): every picture here is from headless Chromium at the device sizes, without a colour emoji font (emoji show as boxes) and without Safari's engine.
- How it feels: smoothness on an iPad, sound, the dance game's timing with two real players over Firebase, the photographer's photos as a child frames them.
- Real holiday dates: every holiday was faked by replacing realDate() in the test copy.
- The critics are sub-agents looking at pictures, not children or parents.

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
