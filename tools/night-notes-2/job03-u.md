# Job 3 (screens part): Glitch hunter, pass 1 — the 2D fixes

Only `index.html` changed, plus 35 before/after pictures `tools/pictures-2/glitch1-U01…U35-*.jpg` (left = **before**, taken by the
inspectors on the starting version; right = **after**, my file, same recipe; U33's before was re-shot on the starting version at the same
spot). The first 498 lines of the page (head, CSS, HTML) are byte-for-byte the same: the new styles are added from the game script in one
small style block (like the bus and tennis jobs do), so the web part and the line count are untouched. No save fields, no online
(presence) fields and no lists changed.

## Changes (item: old -> new)
**One rule for messages (toasts).** A message used to sit at one fixed spot (200 px above the bottom; in class at the very top), so it
landed on open cards, on the clock and coins, on the use button's label, on the phone, on the tennis score. Now each message takes the first
free spot from a short wish list: its usual spot first, then above the use button, under the top HUD row, beside the map column, above or
below an open card, the top, the bottom. Covering an open card counts most, then the top HUD row (coins, tummy, clock, the bus / tennis /
football pills, the round buttons), then the use button, then the map/notepad column. Next to a very big card (the shops, the phone held
sideways) the message goes beside the card in a narrower box. Messages still show at once and for as long as before.
- **B18 shop panels** (U05 `glitch1-U05-toast-decorate-shop.jpg`, U06 `glitch1-U06-toast-clothes-shop.jpg`): messages lay on the 2nd row
  of items -> they sit beside the shop card. The decorate hint ("Look at something to move it, or open the shop") goes away when the shop opens.
- **B24 iPhone upright** (U09 `glitch1-U09-toast-use-button-iphone.jpg`): "Welcome to …'s house!" covered "Sit down" -> it sits above it.
- **A28 tennis, phone sideways** (U30 `glitch1-U30-tennis-hint-iphone-sideways.jpg`): the hint covered the task card and touched the
  score/Stop pill -> it sits low in the middle, clear of both.
- **A8 clock jump** (U23 `glitch1-U23-phone-clock-after-jump.jpg`): "Same time as your friends…" lay over the phone -> under/beside the
  phone. The open phone's clock (status bar, big clock, date line) now changes with the HUD clock: no more 13:00 on the phone while the HUD
  says 16:00.
- **B8 class messages** (U04 `glitch1-U04-class-toast-hud.jpg`): "Your class is here! Sit down…" stayed during the lesson, "Tap a kid…"
  during homework, both on the clock -> class messages sit under the HUD row, and each class step (sitting down, lesson over, grading)
  clears the old message.
- **A7 "Still there?"** (U22 `glitch1-U22-still-there-toast.jpg`): a message showed together with the card (under its dark layer) ->
  messages wait while "Still there?" or "Reconnecting…" is up and come one after another when you're back (at most 3 wait; each one shows
  as long as before).

**The message card (📩 note).**
- **A5 "New client!"** (U20 `glitch1-U20-new-client-note-iphone.jpg`) and **B20 pizza order** (U07 `glitch1-U07-pizza-order-note.jpg`): the
  card sat on the clock (iPad) / on every top button (iPhone) -> it sits under the top HUD row (beside the map column when there is room),
  never on the joystick or jump button (it takes taps), and a message and the card keep clear of each other.
- **B20**: the Chef's "Welcome to work! Wait here…" card stayed open under the new order -> it closes by itself when the order comes.
  "⏱️ 30 minutes Pick it up…" -> "⏱️ 30 minutes. Pick it up…" (also "30 minutes. Come to the Pizzeria…").

**Big texts (the big words in the middle).**
- **B7 lesson** (U03 `glitch1-U03-lesson-big-texts-iphone.jpg`) and **A1 Pet Show** (U15 `glitch1-U15-petshow-big-texts.jpg`): two or three
  big texts were drawn on top of each other ("A🥇dDaisy wins! is…"); on an upright iPhone they ran off both screen edges -> one big text at
  a time: a new one waits until the last one was readable for 0.8 s, then takes its place. Long texts wrap onto 2 lines inside the screen
  (the size also follows the screen height, so a phone held sideways gets a smaller one). A big text never sits on a message: it slides below.
- **A1**: the other pets' name tags step aside while a big text is right over them; the trick names and "⭐ Good!" over the stage are drawn
  in front of the pets (a pet in a big jump used to hide them).

**Pet Show cards.**
- **A2 dark mode** (U16 `glitch1-U16-petshow-dark-cards.jpg`): judge boxes and the yellow/blue rows had white text on white -> dark text.
- **A25** (U17 `glitch1-U17-petshow-judge-text.jpg`): judge names 13 px -> 15 px.
- **A24 phone sideways** (U18 `glitch1-U18-petshow-trick-card-iphone-sideways.jpg`, U19 `glitch1-U19-petshow-results-iphone-sideways.jpg`):
  the trick card hid the stage, the results text was cut under OK -> compact cards on short screens: the paw bar and NOW! side by side (you
  see your pet), and the results card shows all rows, the coins line and OK (it can scroll if ever needed).

**Phone.**
- **A10 sideways** (U24 `glitch1-U24-phone-iphone-sideways.jpg`): only 3 apps showed -> a wider phone with 5 apps per row: all 9 apps fit.
- **A29 Calendar icon** (U31 `glitch1-U31-calendar-icon.jpg`): the 📅 emoji always says "July 17" -> a little calendar page with the game's
  weekday and day (e.g. FRI 19).
- **A30** (U32 `glitch1-U32-friends-app-title.jpg`): "👫 Play with friends" wrapped next to the coins -> "👫 Friends" (the app's name);
  long phone titles end with "…" instead of wrapping.
- **A23 dark Pets app** (U27 `glitch1-U27-phone-pets-hearts-dark.jpg`): empty hearts were invisible -> grey hearts.

**Other screens.**
- **A26 Settings / tall cards** (U28 `glitch1-U28-settings-scroll-hint.jpg`): the last button was cut with no hint -> every card taller than
  the screen shows a small bouncing ⬇️ at its bottom-right until you scroll to the end. Also: a card that opens anew starts at its top (it
  used to keep the scroll of the card before, so Settings could open half-way down).
- **B25 / A11 clothes maker on iPhones** (U10 `glitch1-U10-clothes-maker-iphone.jpg`, U11 `glitch1-U11-clothes-maker-iphone-sideways.jpg`,
  U12 `glitch1-U12-opening-maker-iphone-sideways.jpg`): "That's me! ✨" wrapped onto 3 lines, only 2 rows of choices showed, pills peeked
  out under the card -> compact rows (sideways: the label above the choices, 3+ rows show), a one-line "That's me!" bar that reaches the
  card's edge, a soft fade and a ⬇️ over the bar while more choices are below.
- **A6 door card + tips** (U21 `glitch1-U21-door-card-and-tips.jpg`): the host got "Ding-dong!" and "Pizza job tips" at once -> tips (pizza
  and designer) wait while the door card is up and start a moment after; a tips card already open hides while the door card is up. The
  door card is a bit wider and its buttons never wrap inside (on a narrow screen "Not now" goes to the next row).
- **A27** (U29 `glitch1-U29-knock-label.jpg`): "Waiting for ZZTEST-LIVE-W…" was cut -> "⏳ Waiting at the door…" (the message still names
  the friend). The camera "along the wall" came from where the test stood: the game never turns the camera when you knock.
- **A16 / A35 the opening** (U25 `glitch1-U25-opening-rosie-iphone-sideways.jpg`, U26 `glitch1-U26-opening-aim-dot.jpg`): the aim dot sat
  on Rosie's forehead, the jump button sat on her card, and sideways phones saw only her head -> while Rosie talks: no aim dot, no
  jump/run/joystick; a more compact talk card on short screens; on a short screen the camera looks down a little so Rosie stands above it.
- **B5 bed** (U01 `glitch1-U01-bed-decorate-button.jpg`, U02 `glitch1-U02-bed-zzz-iphone.jpg`): the 🛋️ decorate button showed in bed
  (tapping it started decorating from the bed) -> hidden while you lie in bed, and a tap is ignored there. The 💤 floated onto the clock on
  an upright iPhone -> it starts lower and farther away and floats up in the middle of the view.
- **B21 homework** (U08 `glitch1-U08-homework-pictures.jpg`): ➖ and ✖️ pictures looked like the "wrong" mark -> 🧮 for take-away and 🔢
  for times. Rows of counting emoji broke in the middle -> a long emoji row gets its own line and never breaks.
- **B28 pet card** (U13 `glitch1-U13-pet-card-camera.jpg`): the card opened with the pet out of view -> if the pet is not in view above the
  card, the camera turns to the pet (looking down so it shows above the card); the old up/down look comes back when the card closes.
- **B33 designer tray** (U14 `glitch1-U14-designer-tray-colors.jpg`): "Chair" twice with the same picture -> every coloured tile shows its
  colour dot (wood / mint chair), also before the little 3D pictures load.
- **A31 flats** (U33 `glitch1-U33-flats-stairs-sign.jpg`): the ceiling sign "Floor 1 · flats 11–15" hid the "⬆️ Floor 2" sign seen from the
  door -> the stair signs (⬆️ and ⬇️) hang 25 cm lower, fully visible under the ceiling sign.
- **Left HUD column on a phone held sideways** (U35 `glitch1-U35-left-column-fits-iphone-sideways.jpg`, asked for after the first round):
  since tonight's new pills (🚌 bus, 🏠 way-finder, ⚽/🎾 score) the column (coins, pills, map, job text, notepad, designer card) was taller
  than the screen and the notepad was cut off at the bottom (the check's `cut-off #pad`) -> the column always fits: when it would run off
  the bottom or onto the joystick, the game takes only as many small steps as needed, in this order: in a cut-scene the hidden boxes give
  their space; the notepad moves beside the map; the task list folds; the designer card drops its picture, then sits beside the map; the
  notepad hides; the map hides. Checked on iPhone sideways (town + bus + way-finder, school message, designer job, class, tennis, football),
  iPhone upright and iPad (nothing needed there), light and dark: everything stays on screen and off the joystick.
- **A32 title after a break** (U34 `glitch1-U34-title-after-break-iphone-sideways.jpg`): the logo letters dropped in again and were caught
  flying out of view -> after a break the logo just stands there (the drop-in stays for the first start).

## Decisions I made
- Messages are never held back except behind "Still there?" / "Reconnecting…": a message from a card's button ("Not enough coins")
  must show at once, so it moves instead of waiting. If no spot is free (a card filling a phone screen), it takes the spot that covers
  the least (usually the card's top edge). The test helper (`window.__lastToast`) still sees every message at the moment it is sent.
- Big texts wait their turn (at most 0.8 s each) instead of being dropped: every one stays readable.
- The joystick in the middle on a phone held sideways (B32) is on purpose: the owner moved it there on 4 Oct 2026 (commit "joystick
  position when phone is sideways"). Not changed.
- New styles come from the game script (one style block next to the message code), not from the first 498 lines: no merge fights in the
  CSS lines, and the web-part check stays happy.
- 🧮 (abacus) and 🔢 (1234) are old, common emoji (no empty boxes on older iPads). The Beanbag keeps 💺 (the 🫘 bean emoji is too new
  for older iPads); its 3D picture in the tray shows what it is.
- The pet card only turns the camera when the pet is really hidden (off screen or behind the card).
- The left column only changes when it doesn't fit, and moves things before it hides anything (the notepad beside the map loses
  nothing). It is checked when a pill or box comes or goes and with the HUD clock (twice a second); the pills stay where the other jobs
  put them.
- Trick names over the Pet Show stage are drawn in front of everything (they are short and only over the stage); other floating texts
  in the game are unchanged.

## Glitches found and not fixed
- **B9** goof bubbles in class (😳 💃 ✈️ …): 3D sprites over the kids' heads -> left to the world fixer (with the name-tag sizes).
- **B22** claw "😱 It slipped!": not a 3D text; it is the normal big text caught while fading out (the photo was taken in its last 0.3 s).
  With one big text at a time it stays readable; nothing else changed.
- **B32** joystick in the middle when the phone is sideways: on purpose (see Decisions).
- **B33** Beanbag and Armchair share the 💺 icon (see Decisions).
- New: on an upright iPhone the "🏠 My House 95 m" way-finder pill wraps into 3-4 lines and looks like a circle (narrow left column).
- New: on an upright iPhone the "🔔 Ding-dong!" card (74 px from the top) covers the tummy and clock chips while it waits for an answer.
- With the designer job on an upright iPhone the left column fills the whole height, so the "New client!" card covers the little map for
  its few seconds (not the clock, the buttons or the joystick any more).

## NOT VERIFIED (real devices, sound, feel)
- Real iPhone/iPad Safari: the sticky ⬇️ hint inside a scrolling card, `clamp(…min(vw,vh)…)` font sizes (iOS 13.4+), notches.
- How it feels when several messages come right after "Still there?" (one by one, 2-4 s each).
- The pet card's camera turn with a real finger (it turns at once, it doesn't glide).

## Try it for real (tick-box tasks)
- [ ] iPad: open the 🛍️ home shop while decorating: no message on the items; buy something: the message shows beside the shop.
- [ ] iPhone upright: walk into a friend's house: the welcome message sits above "Sit down".
- [ ] Wait 3 minutes for "Still there?", then tap "I'm here!": messages that came meanwhile show one after another.
- [ ] Open the phone, then let a friend who is ahead in time join: the phone clock jumps with the HUD clock.
- [ ] iPhone sideways: open the phone: all 9 apps; the Calendar app shows today's weekday and day.
- [ ] Teach a class on an iPhone: class hints sit under the coins/clock; "Stop goofing off, …!" fits the screen.
- [ ] Homework with 🧮 / 🔢 questions and a long row of 🌸: rows don't break.
- [ ] Pet Show on an iPhone sideways: you see your pet during "NOW!"; the results card shows the coins line and OK.
- [ ] Lie in bed at night: no 🛋️ button; the 💤 floats up in the middle.
- [ ] A friend knocks while the pizza tips would start: only "Ding-dong!" shows; the tips come after.
- [ ] Settings on an iPad: a small ⬇️ at the bottom right until you scroll down.

## Morning questions (each already built in a sensible way)
- Messages next to a big card go into a narrower box beside it (2-4 short lines). Built like that; or always at the top of the screen?
- The ⬇️ "more below" hint shows on every card taller than the screen (bottom-right). Built like that; or only on Settings and shops?
- While Rosie talks in the opening, the joystick and jump/run hide. Built like that; or keep them?
- Phone held sideways: the phone is a wide landscape phone (5 apps per row). Built like that; or keep a tall phone that scrolls?

## Quick check (the output, exactly as printed)
Run `job03u-b` (SRC = this worktree's index.html; stages files,counts,saves,players,claude,crawl_ipad-landscape_hud,crawl_ipad-landscape_inA,teacher_ipad-landscape,teacher_iphone-landscape):
```
new claude 477ad13146db115c29547052766181b7 · new web 2b503f7a44c811eeb2df4249e4cc77f5 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 82 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1287 pieces, 988002 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 234 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzo5iwyz60ok" -> "umuzo5vm1m356i"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 32 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 22 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 280 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 258 s]
[stage teacher_ipad-landscape: running]
[stage teacher_ipad-landscape: done in 90 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 80 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
`python3 $SP/tools/b1.py $SP/runs/job03u-b`:
```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```
A2 = normal for a quick check; B1 = the known pid-only difference. The crawl and teacher stages of job03u-b: 0 browser errors, 0 dead / unreachable / covered taps; the only layout issue was 2 × `cut-off #pad "Notepad"` in teacher_iphone-landscape (the left column on a sideways phone), fixed afterwards (U35) and checked again:

Run `job03u-c` (after the left-column fix; stages files,saves,players,crawl_ipad-landscape_hud,teacher_iphone-landscape):
```
new claude 4a0bad790e90493fe55be0fb5406af30 · new web 6c662f2cc99ebe4ab0136474eb37ac0a · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage saves: running]
[stage saves: done in 204 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzp4f08t20dh" -> "umuzp4onov27x1"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 33 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 324 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 67 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
`python3 $SP/tools/b1.py $SP/runs/job03u-c`:
```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```
job03u-c stage issues: crawl_ipad-landscape_hud 0, teacher_iphone-landscape 0 (the notepad cut-off is gone); 0 browser errors; 0 dead / covered taps. Also the inspectors' tour of every screen on this file, iPhone portrait (dark) and iPhone landscape (light): 69 + 69 pictures, 0 errors, nothing skipped (run twice: before and after the left-column fix).
