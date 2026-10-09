# Job 7: Beach bus

Only `index.html` changed (the main game script; the web part and lines 1-498 are untouched).
Save: two new optional fields inside the existing `beach` object: `beach.camp` (1 while you have a campsite at the beach;
removed when you ride home) and `beach.bus` (1 = the "new bus" message was shown). Nothing else in the save changes.
Online: nothing new is sent (no new presence fields). The bus and the timetable come from the shared clock, so every
new-version player sees the same bus at the same time.

## Changes (item: old -> new)
- Getting to the beach: a skill at level 10 opened the gate at the east end of the big road -> a cozy Beach Bus from a
  new bus stop at the park takes you there and back. There is no level lock any more.
- The town gate to the beach: "Go to the beach" / "The beach (opens at level 10 ⭐)" -> it stays as scenery; its button
  is "🚌 Find the beach bus" and says "🚌 The beach bus leaves from the park! It comes (today / tomorrow / on
  Thursday) at 9:30. Follow the arrow 📍", and the pink arrow shows the way to the bus stop.
- Level-10 messages, all gone: the "beach opens at level 10" card (with your best skill), the "🏖️ The beach is open!"
  message, the map's "Here is the gate to the Beach! It opens when…" and the friends list "🚀 Go" message.
- New bus stop by the park (on the big road, just east of the park's north gate, in front of the big oak): a little
  shelter with a soft peach roof, mint posts, a bench, a "🚌 Beach Bus" sign on the roof, a round 🚌 stop sign and a
  timetable board inside (the next 3 bus days). "📋 Read the bus timetable" opens a card: the next bus, this week's bus
  days (✔ when gone; next week's too near the end of a week), the fare and how it works. At the beach the card shows
  the times of the buses home instead.
- New: the Beach Bus (its look was changed later to the owner's retro surf minibus: see "Follow-up" at the end). Cream on
  top, mint below, a peach stripe, big round windows, headlight "eyes" and a little smile,
  a "🏖️ Beach" / "🏘️ Town" sign over the windshield, a sliding door, seats inside, and Driver Dot (mint cap, sky-blue
  shirt) at the wheel; she waves. At night its lights glow and the windows are warm.
- The timetable (the same for everyone, worked out from the week number): 3 bus days a week, one picked from Mon-Tue,
  one from Wed-Fri, one from Sat-Sun. On a bus day it comes to the park at a time between 8:00 and 11:50 (10-minute
  steps).
- A bus day: the bus drives in along the big road (from the far end of 🏡 Friends Lane), stops at the park, waits 1.5
  game hours (about 1 real minute, doors open), then drives off east through the beach gate. At the beach it waits on
  a little road behind the dunes, right outside the "🏘️ To town" gate, for 1.5 game hours (the morning trip back to
  town, also for campers), then it brings people back to the park and goes to sleep. Evening: the bus home waits at
  the beach from 19:30 and leaves at 21:00 (bus days only).
- Day 1 (a brand-new player's first day, a Monday): a free 🎉 Welcome Bus waits at both stops from 8:00 to 12:00 and
  goes as soon as you hop on, so new players can see the beach right away. Its message waits until Rosie's "Drag on the
  left to walk" tip is done, and the bus line under the coins shows only after Rosie's hello.
- Getting on: walk to the bus door: "🚌 Get on the bus (15 🪙)" ("Free Welcome Bus: hop on!" on day 1), or tap the bus.
  You pay, you sit in a window seat inside the bus and can look around; Driver Dot says hello and when it leaves. "🚪
  Get off the bus" (before it leaves) gives your coins back. When it leaves: "ding ding", a short ride picture ("🏖️
  Next stop: the beach!", a little bus driving past palms, by night with a moon) and you stand at the other stop. Pets
  and friends who follow you come along.
- Fare: one ride = 15 🪙 (`BUS_FARE`, one constant). Not enough coins to go to the beach: "🚌 Driver Dot: A ride is
  15 🪙. Save up a little more and hop on next time! 💛". Going home never strands anyone: with less than 15 coins the
  ride home is free ("No coins? This one's on me! 💛"). The Welcome Bus is free.
- Countdown: a small line under the coins/time ("🚌 Bus to the beach: 0:42", "🚌 Off to the beach in 0:42", "🚌 Bus to
  town: 0:42", "🚌 Next bus: Thu 9:30", "🚌 Bus home: Tue 11:50", "🚌 The bus is coming!") when you are near the stop,
  on the bus, or at the beach while the bus home waits. It turns yellow and pulses in the last seconds. A label over the
  bus shows "🏖️ 0:42" / "🏘️ 0:42" while it waits (in game time, so everyone sees the same).
- Messages: "🚌 Beep beep! The Beach Bus is at the park! It leaves at 11:00 🏖️" (in town), "🚌 Beep beep! The bus to
  town is here! It leaves at 21:00 🏘️" (at the beach), 20:30 "🚌 The bus home leaves at 21:00!", 20:50 "🚌 Last call!
  The bus leaves in 10 minutes!", 21:00 "🚌 Oh no, the bus left! ⛺ Build a campsite and sleep at the beach. The next
  bus takes you home!" (not if you already camp). Once per game: "🚌 New! A cozy Beach Bus stops at the park 3 days a
  week…" (new players on day 1: the Welcome Bus message).
- The beach: a little road behind the dunes and a sandy step out through the "To town" gate to the bus door; the same
  bus shelter and timetable by the boardwalk; the gate now says "When does the bus come?" / "The bus is here!".
- Missed the bus: a camp spot next to the beach bus stop (a ring of stones). "⛺ Build a campsite" (at night, or on a
  day when no bus home comes any more) -> a peach tent with two sleeping bags and a flag, and a campfire with flickering
  flames, a warm glow at night and a soft crackle. "😴 Sleep in the tent" works like a bed (from 21:00): you lie in the
  tent looking out at the fire, it counts as "in bed" for the night skip with friends (same "1 of 2 in bed" card and
  ring), and you wake at 7:00 next to the tent, with a hint about the next bus home. "🍡 Toast a marshmallow" at the fire
  (+4 tummy). The tent is solid (you walk around it). The campsite stays while you stay at the beach (also after a
  reload) and goes away when you ride home. A friend asleep in the tent: you see the tent too, see them lying in it,
  and can sleep on the other side.
- Old saves at the beach: they load at the beach and ride home with the next bus (morning trip or the evening bus),
  for free if they have no coins.
- No jumping past the bus: "🚀 Go" to a friend, visiting/knocking from the phone and any warp from or to the beach -> a
  kind message with the next bus ("🚌 You are at the beach! Take the bus home first. It leaves on Tuesday at 11:50.").
  ⚙️ "Take me home" at the beach brings you back to the boardwalk with that message, and the pink arrow shows the way
  to your house on 🏡 Friends Lane ("🏠 My House: take the bus home first 🚌" at the beach). A friend who knocks at your
  door while you are at the beach gets "not now", and you see "🔔 Pal knocked at your door, but you are at the beach!
  🏖️".
- After the evening bus (21:00) in town: "🏘️ Home again! 🚌 Driver Dot: “Bye bye! Sleep tight!” 🏡 Follow the pink arrow
  home." and the pink arrow shows the way to your house on Friends Lane (not if you already follow an arrow somewhere
  else).
- Map (📱 → 🗺️ Map): new place "🚌 Bus stop" (on the map and in the list). "🏖️ Beach" now shows the way to the bus stop.
  At the beach, the way to a town place says "take the bus home first 🚌".
- Traffic: cars wait behind the bus at its stop and let it cross first; the bus waits (and honks) if you stand in
  front of it, and waits for cars or people in front of it.

## Decisions I made
- Bus days are random each week but spread out: one from Mon-Tue, one from Wed-Fri, one from Sat-Sun, so there are never
  more than 4 days without a bus (fully random 3 days could leave a camper at the beach for 9 days).
- The bus waits 1.5 game hours (64 real seconds by day) instead of exactly 1 minute, so all times are on the 10-minute
  clock the game shows (9:30 -> 11:00 -> 12:30).
- The evening bus home waits from 19:30 to 21:00 (about a minute, like the other stops), with an extra "the bus home is
  here" message at 19:30 besides the 20:30 and 20:50 ones.
- The stop is in the eastbound lane of the big road by the park (east of the north gate, so a queue of at most 2 cars
  never reaches the crossing), and the bus leaves through the old beach gate (it moves to the middle of the road there).
- At the beach the bus waits on a new little road behind the dunes; you walk 3 steps through the gate to its door.
- Riding: you sit inside the waiting bus (first person, look around); the drive itself is a short ride picture (about
  2 seconds) instead of driving through town with you inside. It is simple, works the same on every device and never
  gets stuck in traffic.
- Day 1 has the free Welcome Bus (it goes as soon as you hop on). This also lets the check's crawler reach the beach
  "by playing" (its new player is on day 1).
- Getting off before the bus leaves gives the fare back. Closing the game while sitting in the bus: you start at the
  stop, standing (the fare is not given back).
- Camping is allowed at night, or when no bus home comes any more that day; before that, the camp spot tells you when
  the bus home leaves. There is one camp spot for everyone, so friends share one big tent.
- The bus is a vehicle like the cars: it is not part of the town or the beach drawing (and is only drawn while it is
  around). Drawing work (the check's own counter, on top of job 10): town 352 -> 353 pieces, 594,306 -> 595,168
  triangles (+0.1%); beach 112 -> 119 pieces (+6.3%), 57,922 -> 61,547 triangles (+6.3%); the bus itself is 14 pieces,
  about 10,300 triangles.
- The beach stays out of the daily quests (`nq`), so old saves keep getting the same quests; so does the bus stop.
- Put on top of job 1, job 10 (one house per player on Friends Lane), job 4 and job 2. Your house is no longer across
  the road from the bus stop, so the bus helps you find it: "Take me home" at the beach and the evening bus set the
  pink arrow to your Friends Lane house. The lane is longer now, so the bus starts at its far end (about 12 m before
  the end barrier, as before; it moves along if the lane grows for more friends). The bus stop is on the park side of
  the big road, across from the Flower Corner, and Rosie's welcome spot is close to it: no bus line under the coins
  while she talks. With job 4, friends more than 30 days apart keep their own clocks, so they also have their own bus
  times. With job 2, a friend asleep in the tent lies down like a friend in bed (job 2's pose, blanket and 💤), on the
  sleeping bag, with the blanket a bit narrower so it stays inside the tent (before, the tent had its own lying pose).

## Glitches found and not fixed
- Each game drives its own copy of the bus (only the times are shared). If a car or a person holds up the bus in one
  game, it can be a few metres behind the bus in a friend's game.
- A car that is already inside a crossing when the bus comes may brush past it; the bus drives on after 6 seconds if a
  car in front of it doesn't move.
- An old-version friend sees a new-version friend who sits in the bus standing on the road (old versions have no bus).
- The friends list says "📍 In town" for a friend sitting in the bus.
- ⚙️ "Take me home" keeps its words at the beach (it brings you to the boardwalk, tells you about the bus and shows the
  way to your house).
- The bus appears out of thin air near the far end of Friends Lane (about 12 m before the end barrier) and disappears
  past the beach gate. Friends in the last lots of a long lane can see it pop up.
- If you close the game while sitting in the bus, the 15 coins are gone (you start standing at the stop).
- The bus messages remember what was said only until the game is closed, so after a reload a message can come again.

## NOT VERIFIED (real devices, sound, feel)
- Real iPad/iPhone: how the round windows look, smoothness with the bus on screen (14 extra draw calls while it is
  near).
- Sounds: the bus honk (reused car honk), "ding ding" + engine, the campfire crackle (tiny clicks), marshmallow pop.
- Feel: is about 1 real minute at the stop long enough for a 6-year-old to walk to the door? Are the 20:30 / 20:50
  messages early enough (20:30 is about 21 real seconds before the bus leaves)?
- Real Firebase / two real devices (tested with the kit's pretend server: two new players at the beach both sleeping in
  the tent -> the night skipped for both; an old and a new player: the old one sees the new one ride off to the beach).
- The full check's tour on iPhone (only my own iPhone screenshots).

## Try it for real (tick-box tasks)
- [ ] New game: after Rosie's welcome, walk to the 🚌 bus stop by the park (📱 → 🗺️ Map → 🚌 Bus stop) and ride the
      free Welcome Bus to the beach; ride it back before 12:00.
- [ ] Read the timetable at the stop. On a bus day, be at the stop when it comes, watch it drive in, hop on, look around
      inside (Driver Dot!), and get off again before it leaves (coins back).
- [ ] Ride to the beach. Walk through the "To town" gate: the bus waits there. Play, then take the bus home at 21:00
      (listen for the 20:30 and 20:50 messages) and follow the pink arrow to your house on Friends Lane.
- [ ] At the beach: ⚙️ "Take me home": you stay at the beach, hear about the bus, and the arrow says "take the bus
      home first".
- [ ] Miss the bus: build a campsite, toast a marshmallow, sleep in the tent; in the morning read the bus hint.
- [ ] With 0 coins at the beach: the ride home is free.
- [ ] Two players at the beach at night: both sleep in the tent -> the night skips; one of them rings the other.
- [ ] Phone "🚀 Go" to a friend at the beach (from town) and to a friend in town (from the beach): a kind bus message.
- [ ] Stand in front of the bus when it wants to leave: it waits and honks.

## Morning questions (each already built in a sensible way)
- Bus days: built as one day from Mon-Tue, one from Wed-Fri and one from Sat-Sun (never more than 4 days without a bus);
  or fully random 3 days a week (up to 9 days in a row without a bus)?
- Fare: built as 15 🪙 for each ride (30 there and back); or one ticket for the round trip?
- Day 1: built with a free Welcome Bus that goes as soon as you hop on; keep it, or start new players on the normal
  timetable?
- The ride: built as sitting inside the waiting bus + a 2-second ride picture; or should the bus really drive through
  town with you inside?
- Camping: built as "only at night, or when no bus home comes any more that day"; or any time you like?
- The beach kiosk and tennis are unchanged; should the kiosk sell a "camping snack" (marshmallows are free now)?

## Firebase
No new rule needed (nothing new is sent or stored online).

## Quick check
Tag job07-merge3 (after the rebase on job 1 + job 10 + job 4 + job 2): files,counts,saves,players,claude,
crawl_ipad-landscape_hud,crawl_ipad-landscape_town

```
new claude 9581860518419d3dc047c719d635f965 · new web 89da7ba61fccc0bc403c082598f9862d · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 130 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1287 pieces, 987714 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 47 draws; cafe 48 draws; school 44 draws
[stage saves: running]
Task exception was never retrieved
future: <Task finished name='Task-79' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
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
[stage saves: done in 380 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzk0aau509bw" -> "umuzk0o5ni1yh7"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 45 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 49 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 457 s]
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 329 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 $SP/tools/b1.py $SP/runs/job07-merge3`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

The "Task exception was never retrieved … TargetClosedError" lines are a warning from the test browser about a page that
was already closed (the starting version's run shows it too); the stage finished normally.
The two crawl stages print no PASS lines in a quick check; from their stage files (runs/job07-merge3/stages):
- crawl_ipad-landscape_town: 98 taps tested, areas reached by playing: city, beach, clothes, school, client, apt1,
  toys, bakery, library, icecream, pizza, fire, home, market, pets, cafe, flowers (17; the beach is new, by the
  Welcome Bus); dead, unreachable, stuck, covered: none; skipped: the same 11 "(no label)" as job 10's version;
  issues 0, errors 0.
- crawl_ipad-landscape_hud: 145 taps tested; dead, unreachable, stuck, skipped, covered: none; issues 0, errors 0.
- All other stages: issues 0, errors 0.

# Follow-up: the bus looks like a retro surf minibus (owner's picture)

Only the LOOK of the bus changed, plus a surfboard that leans on it at the beach stop. Everything else about the bus is
the same: the timetable and times, the fare, the countdown line and the label over the bus, the door and the spot where
you get on, Driver Dot, the "🏖️ Beach" / "🏘️ Town" signs, the campsite, the messages and the way it drives. Because the
bus is shorter now, it has 6 seats instead of 8, and the invisible "you bump into it" shape and the "someone or a car is
in front of the bus" checks were fitted to the new size. Nothing new is saved or sent online (old saves and old-version
friends are not affected; old versions have no bus at all). Only `index.html` changed (the bus drawing in `buildBus` and
the small drawing helpers next to it, `busSurf` for the surfboard, the seat list `BSEAT` and `busSeat`, and the sizes in
`busBlocked`, `busBlock`, `busSolids` and `updBus`), plus the pictures.
This follow-up was built, reviewed, and then fixed after the review (see "Review fixes"); these notes describe the final bus.

## Changes (item: old -> new)
- Body: a long rounded bus (7 m), cream on top and mint below with a peach stripe -> a short, chunky retro minibus like
  the picture (5.6 m long, 5.9 m with the bumpers): cream-white roof and upper half, warm cartoon orange lower half, a
  white belt line between them, round corners and a soft rounded roof. With the surfboards it is 2.9 m tall, so it still
  drives under the "🏖️ To the beach" gate in town (its sign starts at 3 m).
- Nose: a flat front -> a van face. The windscreen leans back, the orange nose sticks out a little below it with a small
  white shelf, and a garland of green leaves with 5 flowers (pink, yellow, white, coral, lilac) hangs over it. Big round
  headlights near the corners (they glow at dusk and at night, with a warm pool of light on the road, like the cars),
  amber blinkers on the corners, a small smile, two little wipers and a soft grey bumper. The front wheels sit under the
  corners of the nose, like on an old van, so the door is between the wheels.
- Windows: small round portholes -> big rectangular windows with rounded corners: 3 on each side (one for each row of
  seats), the driver's window, the window in the door, a big two-part windscreen and two back windows. From outside they
  have a light see-through blue glass; from inside you look out through clear windows.
- Wheels: dark wheels with small white middles -> dark tyres with big white rims and a grey hub, in round wheel arches.
- Roof: a mint soft roof -> a roof rack (light grey rails and two crossbars that are higher in the middle) with two
  surfboards, each tipped out to its own side so you can see it from the street: the wooden board with a red edge on the
  door side (you see it from the bus stop and from the beach gate) and the yellow-green board with black squiggles and a
  black tail on the road side. From the front you see both.
- At the beach (new): while the bus waits at the beach stop, the yellow-green board hops off the rack, over the roof, and
  leans against the side of the bus by the back wheel, like in the picture. It never covers the door or the spot where
  you get on, and it stands where nobody can walk (next to the gate, behind the hedge line). When the bus drives off,
  the board hops back onto the rack (about 1 second, with a soft "clonk" when it lands near you). If you arrive by bus,
  or come to the gate while the bus is already waiting, the board is already leaning there.
- Door: a peach door with a round window -> a door painted like the bus (orange below, a white line, cream on top with a
  big window). It is in the same place and slides open the same way, now over the plain side (no wheel behind it).
- Signs: "🏖️ Beach" / "🏘️ Town" stay over the windscreen (in a cream frame, leaning back with it). "🌴 Beach Bus" moved
  from the side to the back (the sides are plain orange, like the picture).
- Seats: 8 seats in 4 rows -> 6 seats in 3 rows (the bus is shorter). Everyone still gets their own window seat; if a
  friend already sits in yours, you get the next free one.
- Inside: the same seats, dashboard, steering wheel, ceiling light and Driver Dot; orange walls below, cream above, big
  windows to look out of. The corners are square inside (round only outside), so they don't block the view. The yellow
  pole moved next to the door, so it no longer stands right in front of the first seat.
- The shady side of the bus stays a warm orange (a little warm glow in the orange paint by day only) instead of turning
  brown in the shade.

## Decisions I made
- Kept the bus's width, the door, the spot where you get on, Driver Dot's seat, the label over the bus, the lights' jobs,
  the times and the drive path, so getting on and off, riding and the timetable work exactly as before. The bus got
  shorter at the back (and its nose a little longer), so the solid "you bump into it" shape, the "someone is in front of
  the bus" check, the "cars wait for the bus" check and the "friends riding with you sit down" area were fitted to the
  new size. I checked that you can walk all around it at both stops without walking into it, that you can still reach
  the door spot, and that nobody can walk to the leaning board.
- A shorter bus with 6 seats: the van in the picture is short and chunky (about twice as long as it is tall). At 7 m it
  looked like a city bus; 5.6 m with 3 rows of seats reads as a van. A 4th row would make it a bus again.
- The front wheels went in front of the door (under the nose, like old vans), so the open door slides over the plain
  side, not over a wheel.
- The boards are tipped out to the sides, because a flat board on a roof is only a thin line from the ground (you look
  up at it). Tipped out, the wooden one shows its wood and red edge to the bus stop side and the yellow-green one its
  pattern to the road side. Both still fit under the town's beach gate.
- The yellow-green board is the one that leans at the beach (its black squiggles show best standing up). It rides on the
  road side and hops over the roof to the door side, so at the beach you see both boards: the yellow-green one leaning
  and the wooden one on the roof, facing the beach gate. I checked the hop step by step: it never touches the bus or the
  other board.
- The owner's picture is a watermarked stock photo: I only used it to look at shapes and colours. It is not in the
  repository, and nothing is copied from it (the board pattern is drawn by the game).
- Cartoon style like the rest of the game: toon colours, ink outlines, soft rounded shapes. I kept a small smile under
  the headlights because it is cute and the bus still reads clearly as the minibus in the picture.
- Drawing work: the bus is drawn only while it is around, and it is not part of the town or beach drawing (so the
  check's E1 numbers do not change). It is about 11,900 triangles in 20 pieces (the first bus was about 10,300 in 15; the
  first try of this follow-up about 18,300 in 21). Looking at it at the beach stop, the whole picture has about 3% more
  triangles and 5 more draw calls than with the first bus.

## Review fixes (after the first try of this follow-up was reviewed)
- "It looks like a long coach or a tram with a flat front" -> 1.2 m shorter (6.8 m -> 5.6 m, 3 rows of seats), a
  windscreen that leans back, an orange nose with a flower shelf, headlights near the corners, front wheels under the nose.
- "You can hardly see the two roof boards from the ground" -> the boards are tipped out to the sides on a new rack (each
  shows its top to its side of the street), and both show from the front.
- "Ink lines poke through at the roof line and the front corners" -> the side above the door is one piece now, the
  panels stop just short of the round corners, and the roof's soft edge covers the panel outlines. No more black ticks.
- "The open door covers the front wheel" -> the front wheels moved in front of the door.
- "The new bus nearly doubles its triangles" -> corners made of quarter posts, fewer segments on the wheels, lights,
  roof, boards and flowers: about 18,300 -> 11,900 triangles; the lamps and the thin door no longer cast shadows.

## Glitches found and not fixed
- For about a second, the hopping board flies through the countdown label over the bus (the label is a flat picture
  drawn on top; the board seems to jump past it).
- From straight in front you see the dark front tyres in the open corners under the nose (on purpose, like an old van).
- In the shade the cream top looks a bit grey, like everything else in the game's shade.
- The see-through blue glass shows only from outside (from inside the windows are clear, on purpose); the door window has
  no tint (as before).
- Standing right at a back corner of the bus, your eyes can come within about 10 cm of it (you never see inside; the
  same as the first bus).
- With more than 6 friends on one bus, the 7th shares a seat with someone (the bus had 8 seats before; 6 is plenty for
  how the game is played).

## NOT VERIFIED (real devices, sound, feel)
- Real iPad/iPhone: smoothness while the bus is on screen (about 1,600 more triangles and 5 more pieces than the first
  bus, only while it is near).
- The soft "clonk" when the board lands (reused sound), and whether the big hop over the roof feels fun, not wild.
- Two real devices: each game shows its own board hop (only the times are shared, as before).

## Try it for real (tick-box tasks)
- [ ] At the park stop on a bus day: look at the bus from the front and from both sides: a short orange-and-cream van
      with a face, round headlights, white wheels, the flower garland, and a surfboard on each side of the roof.
- [ ] Get on and look around (windows, Driver Dot, the windscreen); get off again: your coins come back.
- [ ] Ride to the beach and walk through the "🏘️ To town" gate: the yellow-green surfboard leans on the bus by the back
      wheel, the wooden one is on the roof.
- [ ] Stay and watch the bus leave (or come back for the evening bus at 19:30): the board hops over the roof onto the
      rack / back down.
- [ ] At dusk at the beach (the evening bus, 19:30-21:00): the round headlights glow.
- [ ] Two friends on the bus: each sits in their own seat and sees the other one sitting.

## Morning questions (each already built in a sensible way)
- The face: built with a small smile under the round headlights (kept from the old bus); or no face at all, exactly
  like the picture?
- The words "🌴 Beach Bus": built on the back of the bus; or also on the sides (it hides some of the orange)?
- The leaning board: built as the yellow-green one; or the wooden one, or both like in the picture?
- The size: built as a short van with 6 seats; or a longer bus with 8 seats (it looks more like a city bus)?

## Pictures
- `tools/pictures-2/after-bus-retro-park.png` (the bus at the park stop, front three-quarter view from across the road),
  `after-bus-retro-side.png` (the side, driving in), `after-bus-retro-beach-surfboard.png` (waiting at the beach with the
  leaning surfboard and the wooden one on the roof), `after-bus-retro-night.png` (the evening bus at the beach at dusk,
  lights on).
- Re-taken with the new bus, same views as before: `after-bus-arrives.png`, `after-bus-park-stop.png` (on a bus day),
  `after-bus-beach-stop.png`.

## Quick check
Tag job07b-b: files,counts,saves,players,claude,crawl_ipad-landscape_town (on top of a87d95e, like the first try)

```
new claude fd12d910e8c111afb97a933db111cbc1 · new web 18d83483e77d22761e26e235fa1b104b · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 75 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1287 pieces, 987714 triangles in total | for information, seen from 5 spots: city 147 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 212 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzq4rixbw5p5" -> "umuzq559i8uyl3"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 38 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 33 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 254 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 $SP/tools/b1.py $SP/runs/job07b-b`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

A2 is normal for a quick check (no backup given) and B1 is the known pid-only difference. The town crawl prints no
PASS lines in a quick check; from its stage file (runs/job07b-b/stages): 98 taps tested, areas reached by playing:
city, beach, clothes, school, client, apt1, toys, bakery, library, icecream, pizza, fire, home, market, pets, cafe,
flowers (17, the beach by the Welcome Bus, as before); dead, unreachable, stuck, covered: none; skipped: the same 11
"(no label)" as before; issues 0, errors 0. All other stages: issues 0, errors 0. E1 is the same as without this
change (beach 119 pieces / 61,547 triangles, as in the first try): the bus is drawn on its own, not as part of the
town or the beach.
