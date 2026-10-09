# Integration fixes (found by a review of how the jobs work together)

All 13 jobs were merged and played together; the reviewer found 8 places where two jobs clash. All 8 are fixed here.
Only `index.html` changed (the game script; lines 1-498 and the web part are byte-for-byte the same), plus these notes and 5
before|after pictures in `tools/pictures-2/` (`intfix-NN-*.jpg`, left = **before** = tonight's job-12 version, right = **after**).
Save: two new optional fields inside the existing `beach` object (`beach.r1`, `beach.dd`, see below); nothing renamed or removed.
Online: nothing new is sent. Drawing: nothing new is drawn (no new 3D pieces). `COZY_BUILD` stays 2026100901 (as asked).

## Changes (item: old -> new)

**1 (BIG) A friend's clock jump could strand a kid at the beach for days, and Driver Dot promised a bus that never came**
- Sitting in the bus to the beach when a friend's clock moves you past the bus's leaving time or into another day: the bus left at
  once and dropped you at the beach on a day without a bus home (Driver Dot: "The bus home leaves at 21:00", the pill: "Bus home: Tue
  11:50", nothing at 21:00) -> you get off at the park stop with your coins back: "🚌 Driver Dot: “Oh! The clock jumped to your
  friends' time, so this bus can't go now. Here are your 20 🪙 back! 💛 The next bus comes on Tuesday at 8:50.”" A jump that does not
  reach the bus's time keeps you in your seat. In the bus home the bus simply goes (home is where you want to be).
- At the beach, a friend's clock jumps past the bus home (example: Saturday 11:00 -> Sunday 10:00, next bus Tuesday; about 20 real
  minutes stuck, no home, no work, "🚀 Go" blocked) -> "🚌 Driver Dot came back for you! 💛 A free bus home waits at the “To town” gate
  until 12:10. Hop on!" Her bus drives in a moment later, waits 2 game hours (about 1½ real minutes), costs nothing and goes as soon
  as you sit down (like the Welcome Bus). The pink arrow says "🚌 Take the bus home" and points to it, the pill counts down
  "💛 Free bus home: 1:25", the button says "Free bus home: hop on! 💛", Driver Dot: "There you are, <name>! 💛 Hop in, I'll take you
  home!". If a bus home still comes that day, you just hear when: "🚌 The bus home leaves today at 21:00 from the “To town” gate 🏘️".
  Late at night (from 22:30) there is no night bus: "🌙 It's late! ⛺ Build a campsite and sleep at the beach. The bus home comes
  on Tuesday at 11:50 💛" (the next real bus).
- A game from before the bus loads at the beach (old saves; also the reload of job 1's update): no word about the bus, the next bus
  days away, the job hint "Go to the Pizzeria" -> "🚌 New: the Beach Bus! 💛 Driver Dot came to take you home for free! Her bus waits
  at the “To town” gate until 15:20. Hop on!" (when a bus home still comes that day: "🚌 New: a Beach Bus takes you home! It leaves
  today at 21:00 from the “To town” gate 🏘️"). Every game that loads at the beach now hears when the bus home leaves. Driver Dot's
  free bus is saved: it still comes after a reload.
- Driver Dot's hello when you arrive at the beach: "The bus home leaves at 21:00. See you then!" also on days with another time ->
  always the real next bus: "I go back to town at 11:50. The last bus home leaves at 21:00.", "The bus home leaves at 21:00. See you
  then!", or "The next bus home leaves on Tuesday at 11:50."
- The timetable card at the beach: today's row still listed buses that had already left ("12:40 and 21:00" at 15:00) -> only the
  buses home still to come today (and 💛 Driver Dot's free bus while she waits); the line at the top always names the next real bus
  ("🏘️ Next bus home: on Tuesday at 11:50."). The bus days, the board in the beach shelter and the pill are job 7's timetable, unchanged.
- The job hint at the beach: "🍕 Go to the Pizzeria to start work" -> "... · 🚌 bus first" (also "📩 New order! Go to the Pizzeria").

**2 (MEDIUM) The update button on an upright iPhone covered ✋ Stop, the bus countdown and the arrow bar's ✕** (a tap there reloaded the
game) -> it sits below the bus, football, tennis and arrow bars whenever they reach under it, and moves again as they come and go; the
messages keep clear of it too. iPads and sideways phones: unchanged (nothing reaches it there). Picture
`intfix-02-update-button-below-the-bars.jpg`.

**3 (MEDIUM) The update button while sitting in the bus**: it showed, and tapping it (or closing the app, or 📦 Move my game) lost the
20-coin fare -> it waits until the ride is over (like during the Pet Show, the claw machine and lessons), and any game saved while you
sit in the bus keeps the fare: it starts again standing at the bus stop with your coins (the device's save, the claude.ai copy and a
moved game). Picture `intfix-03-update-button-waits-on-the-bus.jpg`.

**4 (MEDIUM-LOW) Day 1: Rosie sends you home while the Welcome Bus calls you back**
- "🎉 Good news! A free Welcome Bus…" came while Rosie's pink arrow showed the way to your new house (and "The Welcome Bus is at the
  park!" was sometimes skipped) -> while the pink arrow shows the way home, bus news waits: "📍 You found My House! 🎉" first, then
  "🎉 Good news! A free Welcome Bus waits at the park until 12:00…" (day 1 until 11:30), or later "🚌 New! A cozy Beach Bus stops at the
  park 3 days a week. Your first ride is free! 🎟️ Find the 🚌 bus stop on your 🗺️ map!".
- The free ride only on day 1 (gone within 3 real minutes; a new player who joined friends on a later day never got it) -> **your first
  bus ride ever is free**. At the bus stop: "🎟️ Your first ride to the beach is free! The bus comes on Thursday at 9:30 🚌" (or "Hop on!
  🚌" when it is there), the button "Get on the bus (free 🎟️)", Driver Dot "Hello, <name>! 🎟️ Your first ride is free!", and on the
  timetable card "🎟️ Your first ride is free! After that, a ride is 20 coins." The day-1 Welcome Bus stays as it was for everyone.
  Picture `intfix-04-house-first-then-the-bus.jpg`.

**5 (MEDIUM-LOW) Daily quests that cost more than they pay (job 8's prices)**
- "Buy a … at the …": also toys (50-200 🪙) and pet outfits (25-70) for 8-22 🪙 -> only everyday things of 20 🪙 or less (food, pet
  food, pet toys).
- "Put a … in your house": any furniture (60-1000 🪙) for 10-40 -> only furniture that is already waiting in 📦 My stuff (moving it
  counts, as before).
- 🌷 Flower power 15 -> 40 🪙, 👗 New look 15 -> 40, 🌷 Flower house 45 -> 80.
- Old saves keep their quests: a saved game's first day after loading gets exactly the quests the older version gives it; every new day
  uses the new rule. Tested over 60 new days: quests that cost more than they pay (by more than 5) 47 of 79 -> 2 of 50 (both
  "New look": 40 for clothes from 50 that you keep).

**6 (LOW-MEDIUM) Messages from one end of a bus ride showed at the other end** ("📍 You found the Bus stop!", Driver Dot's "Welcome… Off
we go!" at the beach; her beach words in town after riding straight back; "📍 You found My House!" later at the bus stop) -> messages
about a place (📍 You found…, the bus news, Driver Dot's words, "Welcome to the beach", the shell tip, the football friends) are dropped
when you go somewhere else (a door or a bus ride); "📍 You found…" also when it could not show within 12 s. Driver Dot's beach hello is
not sent when you already sat down in the bus again. Picture `intfix-06-messages-stay-where-they-belong.jpg`.

**7 (LOW) "⚽ The football friends are at the field until 19:00" popped up in the middle of the Pet Show** (Saturdays 14:00) -> it waits for
a free moment in town (no show, card, lesson or tip), until 15:00. Picture `intfix-07-football-news-waits-for-the-pet-show.jpg`.

**8 (LOW) The football kids popped in and out at 55 m** -> they grow in softly over their last 6 m, like walkers, friends and cars
(job 3's fade; size only, no extra drawing).

**Found while testing (small):** standing at the Welcome Bus, its big "🎉 Free ride!" label covered the clock -> hidden while the pill
already says the bus is free (job 12 does the same for the countdown label).

## Decisions I made
- In the bus to the beach + a friend's big clock jump past its time: you get off with your coins back (the reviewer's hint) instead of
  riding to the beach on another day. In the bus home the bus just goes.
- Driver Dot's extra bus comes only when you did not choose to be stuck: a jump skipped the bus home, or a game from before the bus loads
  at the beach with no bus home left that day. It comes at once, waits 2 game hours, is free, and goes as soon as you sit down. It is
  saved (`beach.dd` = [day, hour]) and removed when you ride home; an old one is ignored. After 22:30 no night bus: you camp.
- A kid who simply misses the evening bus camps, and the next bus day takes them home (the owner's job-7 design, unchanged; after a
  night in the tent: "🚌 No bus today. The bus home leaves on Tuesday at 11:50. Enjoy the beach! 🏖️"). The reviewer's rule "no child
  stuck at the beach longer than until the next evening" is only for the clock-jump bug and old saves (confirmed by the coordinator).
- "First ride ever is free" counts the first ride that really leaves (the Welcome Bus counts; Driver Dot's extra bus does not, so a kid
  she brought home still gets a free first ride to the beach). Saved as `beach.r1` = 1. An old save that never rode gets the free ride too.
- Bus news waits while the pink arrow shows the way home (on day 1, and for an old save whose house moved to Friends Lane).
- The update button moves below a bar only when the bar reaches under it (upright phones); otherwise it keeps job 1's spot.
- Quests: "everyday" = 20 🪙 or less (job 8's food, pet food and pet toys). New look stays at the reviewer's ~40 although the cheapest
  clothes cost 50 (you keep them).
- "Here" messages: dropped when you leave the place; "📍 You found…" also after 12 s (you walked on). Other news (friends, quests, the
  clock) still waits up to 30 s, as job 12 made it.
- The football news waits at most until 15:00 (then it is old news).

## Glitches found and not fixed
- A friend's clock jump itself waits while any message, tip or card is on screen (night 1's design): right after a friend joins (several
  welcome messages) it can take half a minute, and while the delivery tutorial card is up it waits until that card closes.
- During the Pet Show on an iPad other news (a friend came online, "🏡 Your house moved…") still shows beside the show's card (job 12's
  rule: there is room beside it). Only the football news waits now.
- On an upright iPhone with the bus pill, a score pill and the arrow bar all at once, the update button sits lower (about 300 px from the
  top), next to the little map, over the 3D view.
- The board in the beach shelter shows the timetable only, not Driver Dot's extra bus (that one is on the card, the pill and in her words).
- Old versions (before tonight) still have no bus; an old-version friend's clock jump moves a new-version player the same way as a new
  friend's (tested: the seated kid gets off with the coins back).
- Driver Dot's extra bus is only in the game of the kid who rides it: a friend standing
  next to it sees that kid sitting on the road behind the dunes for that minute (each game drives its own bus; job 7 noted the same
  for old-version friends).

## NOT VERIFIED (real devices, sound, feel)
- Real iPads/iPhones and the real Firebase (tested in the test browser with the kit's pretend server: a new-version friend and an old,
  pre-night-2 friend one day ahead).
- Sound (nothing new: the bus honk and ding as before).
- Feel: are 2 game hours (about 1½ real minutes) enough to reach Driver Dot's bus from the far end of the beach?

## Try it for real (tick-box tasks)
- [ ] Two devices: A at the beach on a bus day before the midday bus; B a day ahead joins -> A: "🕰️ Same time as your friends" and
      "🚌 Driver Dot came back for you!"; A walks through the "To town" gate, sits down: free ride home.
- [ ] A sits in the bus at the park (pays 20); B a day ahead joins -> A stands at the stop with the 20 back and hears when the next bus comes.
- [ ] Load a game saved at the beach before tonight -> Driver Dot's free bus (or the time of the bus home).
- [ ] Miss the 21:00 bus, build a campsite, sleep in the tent: in the morning "No bus today. The bus home leaves on …"; on that bus
      day the bus takes you home (no Driver Dot extra bus for a missed bus: that is only for clock jumps and old saves).
- [ ] Upright iPhone with an update waiting: a football match (✋ Stop is free), at the bus stop (the countdown is free), the arrow ✕.
- [ ] Sit in the bus with an update waiting: no update button. Close the app in the bus and open it again: at the stop, same coins.
- [ ] New game: follow Rosie's arrow home; the bus news comes after "📍 You found My House!".
- [ ] New game, join a friend on a later day, walk to the 🚌 stop: "🎟️ Your first ride to the beach is free!"; ride for free.
- [ ] 📱 Quests over a few days: no "Buy a toy", no "Put a fish tank" (unless one waits in 📦 My stuff); Flower power pays 40.
- [ ] Ride the Welcome Bus to the beach and straight back: no messages from the other end.
- [ ] Saturday 14:00 at the Pet Show: the football news comes after the show.
- [ ] Walk away from the football field: the kids shrink away softly at about 55 m.

## Morning questions (each already built in a sensible way)
- Driver Dot's extra bus after a jump: built as free, now, for 2 game hours (not after 22:30); or should a friend's clock simply not move
  you while you are at the beach?
- A kid who misses the evening bus: built as you said (camp; the next bus day takes you home, up to 3 nights in the tent); or a small
  morning bus home every day?
- In the bus + a friend's clock jump: built as "get off, coins back"; or ride to the beach anyway (Driver Dot then brings you home)?
- The free first ride: built as "your first ride ever" (the Welcome Bus counts); or the first ride to the beach, Welcome Bus not counting?
- Quests: "Buy a …" built for things up to 20 🪙; or toy quests that pay the toy back?
- New look: built as 40 (as asked); or 60 (the cheapest clothes cost 50)?

## Save fields (all optional, inside the existing `beach` object; old versions ignore them)
- `beach.r1` = 1: your first bus ride is done (the next ones cost the fare).
- `beach.dd` = [day, hour]: Driver Dot's free bus home promised for that day (removed when you ride home or when it is over).
- `beach.bus` (job 7's "the bus was explained") is now also set by a ride and by loading at the beach.

## Firebase
Not needed (nothing new online).

## Pictures (before = tonight's job-12 version, after = this one; the reviewer's way of reproducing each)
- `intfix-02-update-button-below-the-bars.jpg` (upright iPhone: football match, bus stop)
- `intfix-03-update-button-waits-on-the-bus.jpg` (upright iPhone, sitting in the paid bus)
- `intfix-04-house-first-then-the-bus.jpg` (upright iPhone: a new player's first morning; a new player on day 20 at the stop)
- `intfix-06-messages-stay-where-they-belong.jpg` (upright iPhone: the Welcome Bus there and straight back)
- `intfix-07-football-news-waits-for-the-pet-show.jpg` (iPad: Saturday 14:00 at the Pet Show)

## Tests
Scripts in tonight's work folder (`work/intfix/`): the reviewer's clock jump at the beach and in the bus (direct and with a real second
player: a new-version friend and an old pre-night-2 friend), the old save at the beach (the reviewer's `save-beach-old.json`), a missed
evening bus (camp, sleep in the tent, "No bus today", the next bus day takes you home), the update button (football, bus stop, in the
bus, saved coins and the reload), the new player's first morning (the reviewer's flow), the Welcome Bus there and back, 60 days of
quests, the Pet Show at 14:00 and the kids at 40-56 m. iPad landscape and iPhone upright (the update button also on a sideways iPhone in dark mode, with the arrow bar alone, the tennis pill and
the "You took a break" title; the bus timetable cards on an upright and a sideways iPhone and the iPad, light and dark: no layout
findings). 0 browser errors in all of them.

## Quick check (the output, exactly as printed)
`SRC=<worktree>/index.html quick.sh intfix-c files,counts,saves,players,claude,crawl_ipad-landscape_town,crawl_ipad-landscape_hud,pc_keys`
(the file checked is exactly the committed index.html, md5 d8749e6bafae98f2b46ea70b68b12d16; run again after taking out the morning bus)

```
new claude 8cde7266dfa3a6014de26767cb536712 · new web d8749e6bafae98f2b46ea70b68b12d16 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 0 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 52 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1307 pieces, 994630 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 50 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 134 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umv049b6l7hp8b" -> "umv049gu85tlkf"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 25 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 20 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 297 s]
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 174 s]
[stage pc_keys: running]
[stage pc_keys: done in 18 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 tools/b1.py runs/intfix-c`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

A2 fails as expected in a quick check (no backup given); B1 is the known pid-only false fail (the old saves' quests are the same as
before: see change 5). The crawl stages print no PASS lines in a quick check; their stage files say: crawl_ipad-landscape_hud 156
taps tested, crawl_ipad-landscape_town 92 taps tested and 17 areas reached by playing (the beach too, by the Welcome Bus); dead,
unreachable, stuck, covered: none; layout issues 0 and browser errors 0 in every stage.
