# Job 2: Bug fixes

Only `index.html` changed (plus 8 pictures in `tools/pictures-2/`). Above the game script only 3 existing lines changed (the viewport
line, the `body` CSS line and the `#bRun.on` CSS line): no lines added there, web part untouched. Saves are not touched at all.
Online: two new optional presence fields (`jp`, `pt`), nothing renamed or removed.

## Changes
- **Page zoom while playing:** pinching or double-tapping could zoom the whole page on the iPad -> no page zoom anywhere in the game:
  - the viewport line now also says `maximum-scale=1, user-scalable=no` (same line, nothing added);
  - CSS `touch-action`: the page allows scrolling only (no pinch, no double-tap zoom); the game picture, the buttons on top of it
    (HUD) and the title screen allow no touch gestures at all. Lists in cards (bag, phone, ideas board...) still scroll with a finger;
  - Safari's own pinch events (`gesturestart/change/end`) are stopped (iOS ignores `user-scalable=no`, this is what really stops it);
  - a two-finger move is stopped, except on the game's own touch area (walk + look with two thumbs still works), in text boxes and in
    scrolling lists; a double-tap/double-click never zooms (except inside a text box).
- **Run button (🏃) on iPad:** it switched on the "click", and iOS sends no click while your other thumb is on the joystick, so it often
  did nothing; ON was only light blue -> it now switches the moment you touch it (also with a thumb on the joystick). ON = warm
  yellow, a glowing coral ring, a small dark "ON" tag on top and a 💨 puff of speed; OFF = plain white. Screen readers get
  `aria-pressed`. Same size (72 px, 64 px on phones). PC: Shift still runs while held. Pictures: `before-run-button.png` (old ON look),
  `after-run-button-on.png`, `after-run-button-off.png`.
- **Friends' jumps:** you couldn't see a friend jump -> their avatar hops (and their pets hop with them). New optional presence field
  `jp` = how many times they jumped; a new number = one hop, played smoothly on your side (sent once per jump, tiny).
- **Friends' pets:** never shown -> the pets that walk with a friend (at most 3) show and trot after them. New optional field `pt` =
  `[[kind, colour, name, outfit], ...]` (e.g. `[["dog","#e8b765","Waffles","bow"]]`), only sent again when it changes. The pets walk
  along the way the friend walked (so round corners and through doors, like they did), 1.4 m / 2.2 m / 2.9 m behind, stop when the
  friend stops and look at them, have name tags like your own pets, never block you, hide when the friend's avatar hides, and go
  away when the friend leaves or the pet stops following. A name that isn't kind shows as just "puppy"/"kitten"/... (same word filter
  as the ideas board). Picture: `after-friend-pets.png`.
- **Friend in bed:** a friend in bed stood upright inside the bed -> when you visit a friend who goes to bed, they lie on their back
  with their head on the pillow, tucked under a duvet in the bed's colour, with a 💤 floating over the pillow. Works with friends on
  the old version too (they already send "in bed" and their house layout). Picture: `after-friend-in-bed.png`.
- **Friend away:** no sign when a friend had the "Still there? 👀" card up -> a small 💤 floats over their head (over their name tag;
  a bit higher when they say something). Also works with friends on the old version. Picture: `after-friend-away.png`.
- **Classroom doors:** the glass of a classroom's door changed from light blue to white-orange at 19:30 (it used the town's shared
  window glass, which lights up at night). A class can take a few game hours (the lesson plus marking homework), so a class started in
  the late afternoon ended with a door of another colour -> the classroom doors have their own glass that stays the same light blue
  all day and night (the hallway behind them is always lit). Checked at 12:00, 18:48, 19:24, 19:36, 21:00 and 23:00: all the same.
- **Typing on the iPad (ideas board):** the keyboard covered the "✏️ Write an idea" card -> while a text box in a card has focus and
  the keyboard is up, the card area fits the part of the screen above the keyboard (cards get shorter and scroll if needed, and the
  text box scrolls into view, never under the clothes mirror's sticky "That's me!" bar). Done typing = everything goes back. The same
  works for the other two text boxes in the game: your name in the clothes mirror and a new pet's name. (The notepad is drawn with a
  finger, no keyboard.) If iOS leaves the page shifted after the keyboard closes, it is put back. Pictures (keyboard simulated):
  `before-ideas-keyboard.png`, `after-ideas-keyboard.png`.

## Decisions I made
- The run switch flips on touch-down, not on lift: that is what makes it work while the other thumb holds the joystick. The click
  that follows the same touch is ignored (within 1 s), so it never flips twice.
- Jumps travel as a counter, not as heights: the other side plays the same hop curve as yours, smooth and sent only once per jump.
- Friends' pets follow a trail of the friend's last steps instead of a straight line, so they don't cut through walls. They only
  check walls when they are within 24 m of you (less work for the iPad); a pet more than 9 m from its spot pops there (after a
  door, a "Go" jump, etc.). Their models are merged (only legs and tail move) and cast no shadows: 13 pieces per pet instead of
  25 for an unmerged one (plus the name tag). They only exist while a friend with a following pet is online.
- A friend's data is never trusted: only real pet kinds, colours and outfit pieces are used (anything else is skipped), at most 3.
- Getting out of bed with a jump shows the hop too.
- Pet names now go online with the pet (like player names already do), so friends see the name tag. Only letters, digits,
  spaces and . _ ' - are shown (14 at most), and a name the ideas-board word filter doesn't like shows as just the pet kind.
- Which bed a friend lies in comes from their house layout (they already send it while you visit). If it isn't there, they lie
  where they are, turned along the room. The duvet hides the arms and legs, so their outfit doesn't poke through the blanket.
- 💤 shows for "away" (the Still there? card) and for "in bed". Old-version friends send both, so they get it too.
- The classroom door glass is now always the daytime light blue. Other glass doors (shops, the school's front door) still glow at
  night like before (they lead outside, and it was not asked).
- The keyboard fix is generic: any text box inside a card. It only reacts when the visible screen really got shorter (a keyboard),
  so a hardware keyboard or a computer changes nothing.
- The Home Screen app version number (`COZY_BUILD`, job 1) is left alone, as asked; whoever merges tonight's jobs bumps it once.

## Glitches found and not fixed
- Pressing Enter on a PC while the run button has focus does nothing (the game's own "Enter = use" key wins). Same as before;
  on a PC, Shift runs.
- Shop doors and the school's front door still glow white-orange at night from the inside (shared night glass). Only the classroom
  doors were changed.
- A friend's pet far away (more than 24 m from you) can walk through a thin fence corner for a moment (no wall checks there).
- A friend lying in a bunk bed: the 💤 floats beside the head (the top bunk is in the way), and a hat (a crown) peeks out past
  the bunk's end post. In a normal bed a very tall hat (witch hat) can poke into the headboard. Their eyes stay open in bed (the
  💤 says they sleep).
- When you visit a friend, their stay-at-home pets are not in their house (only pets walking with them show). This was already so.
- Old, small: a friend's chat-bubble picture is not freed from memory when it disappears (not from this job).

## NOT VERIFIED (real devices, sound, feel)
- Real iPad/iPhone zoom: Chromium cannot pinch-zoom like iOS Safari. Tested: Safari's `gesturestart` is cancelled, the CSS
  `touch-action` values are in place, a two-finger move on a card's dim background is cancelled, two-finger walk + look on the game
  area still works (moved 2 m and turned while both "thumbs" were down), one-finger scrolling in a long card still works.
  **Please try pinching on a real iPad.**
- The real iPad keyboard: simulated (a pretend "visual viewport" 390 px shorter, with a drawn keyboard). Tested on iPad landscape,
  iPhone portrait and iPhone landscape (ideas card and clothes-mirror name: the text box is always in the visible part). **A real
  keyboard must be tried** (iOS Home Screen app and Safari).
- Multi-touch on a real iPad: the run button with a thumb on the joystick was tested with Chromium's touch events (two fingers).
- Real Firebase / two real devices: the new presence fields were tested with the pretend server only (GitHub version new+new,
  old+new, new+old, and the Claude version's pretend room new+new: everyone sees everyone, jumps/pets/away/bed as described,
  no errors). Hostile data (fake pet kinds like "constructor", bad colours, a rude pet name, broken house rows) was also tried:
  skipped quietly, no errors.
- Sounds (the run switch taps like before), how the duvet and 💤 feel to a child.

## Try it for real (tick-box tasks)
- [ ] iPad: pinch with two fingers on the buttons, on a card, on the title screen: the page must not zoom. Double-tap fast on a
      coin chip or a card: no zoom. Scroll a long list (bag, ideas board): still scrolls.
- [ ] iPad: walk with the joystick and tap 🏃 with the other thumb: it turns yellow with "ON" and a ring, and you run. Tap again:
      plain white, you walk.
- [ ] Two devices: jump -> your friend sees you hop. Walk with a pet that follows you -> your friend sees it trotting behind you
      with its name, also into a shop.
- [ ] Two devices: leave one alone for 3 minutes (the "Still there?" card) -> the other sees a 💤 over its head.
- [ ] Two devices at night: one knocks on the other's door and goes in, the host goes to bed -> the visitor sees the host lying
      under a duvet with a 💤. Get up -> standing again.
- [ ] Teacher job: start a class late in the afternoon (after 18:00) -> when the class ends, the classroom door is still light blue.
- [ ] iPad: ideas board -> ✏️ Write an idea -> the keyboard opens and the card sits above it; type and tap 📌 Pin it!.
      Also: the name box in the clothes mirror, and naming a new pet at the pet shop.

## Morning questions
- Run ON look: built as warm yellow + coral ring + "ON" tag + 💨; or another colour, or the emoji changing (🚶 off / 🏃 on)?
- Friends' pets: built as "only pets walking with them, at most 3"; or also show their stay-at-home pets when you visit their house?
- A friend in bed: built as tucked under a duvet in the bed's colour; or lying on top of the blanket?
- 💤: built for "away" and "in bed"; or only for "away"?
- Glass doors: built as "classroom doors always light blue"; or should every glass door you see from inside (shops) stop glowing at
  night too?

## Firebase
No new rule is needed. The presence of a player (`worlds/cozy-town/.../peers/<id>`) gets two more optional fields: `jp` (a whole
number) and `pt` (a list of at most 3 small lists of text). If the real rules only allow a fixed list of fields, add these two
(like `ck`, `zz`, `aw` last night).

## Quick check
`SRC=<worktree>/index.html quick.sh job02-b files,counts,saves,players,claude,crawl_ipad-landscape_hud,crawl_ipad-landscape_inC,teacher_ipad-landscape,pc_keys`

```
new claude ab17dd7d4b4565689df03f54785124d7 · new web 27e1cb72adf686703a482543752de234 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 122 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 676 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1278 pieces, 1010297 triangles in total | for information, seen from 5 spots: city 153 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage saves: running]
Task exception was never retrieved
future: <Task finished name='Task-77' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
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
[stage saves: done in 251 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzie0mf6d61b" -> "umuziec8m7hqs7"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 34 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 25 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 309 s]
[stage crawl_ipad-landscape_inC: running]
[stage crawl_ipad-landscape_inC: done in 57 s]
[stage teacher_ipad-landscape: running]
[stage teacher_ipad-landscape: done in 70 s]
[stage pc_keys: running]
[stage pc_keys: done in 37 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 $SP/tools/b1.py $SP/runs/job02-b`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

The crawl and teacher stages print no line of their own in a quick run; their stage files say: HUD crawl 145 buttons tested
(the run button too), classroom crawl (school, classes, fire station, pizzeria) 24 tested, both with 0 dead, 0 unreachable,
0 stuck, 0 covered, 0 layout findings; teacher: 3 whole classes played and ended (Math, History, Math). All stages together:
0 browser errors, 0 outside requests. A2 fails as expected in a quick check (no backup given); B1 is the known pid-only false
fail. The Python "Task exception was never retrieved ... TargetClosedError" lines during the saves stage are a harmless warning
of the test tool (a message to a test page that had just been closed), not a game error.
