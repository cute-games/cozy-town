# Job 10: One house per player, on Friends Lane

Only `index.html` changed (the game script; the web part and lines 1-498 are untouched) + these notes + 5 pictures in `tools/pictures-2/`.
New save field (optional): `laneT` (when you first lived on Friends Lane). New online fields: none.
No saved value is rewritten because the house moved: spots in your yard are converted when things are put in the world (see Decisions).

## Changes (item: old -> new)
- Your house: in town at the corner of the big road -> on Friends Lane, always (also when you play alone or offline: you always have a lot).
  The door of your Friends Lane house takes you inside (the same home: furniture on both floors, wall and floor colours).
  "Go outside" and "Go to your garden" bring you out at your Friends Lane house (front door / garden).
- Where the house stood in town: house, yard and garden -> "🌸 Flower Corner": a flower garden behind a low white fence and hedges, with a big
  tree, a bench, a stepping-stone path, a bird bath, 5 flower patches, 2 bushes and a sign. You look at it from the pavement (nobody walks in,
  see Decisions). The street spot in front of it (-17, -4.6), where loaded games start, stays free.
- Garden: behind your town house -> behind your Friends Lane house, inside your lot: the same 6 beds (same plants, same growth, watered or not),
  the shed with the 🌱 Seeds box, the watering can and the back door. New: the garden gate is beside the house under a little white arch
  "🌱 My Garden" (readable from both sides), with stepping stones from the street.
- Mailbox, the two flower beds in front of your house (watering them), the "Bigger house" sign -> on your Friends Lane lot.
  "Bigger house!" is now a small pink sign under your name sign; it goes away once you have the big house (your lane house is then drawn big).
- Friends Lane: 6 lots -> 12 lots. The 6 old lots stay where they were; 6 new lots are further down the lane (road, pavements, hedges and
  3 more pairs of street lamps are longer; the lane now ends at x -180 instead of -138).
- More players online than lots -> 2 more lots appear at the end of the lane each time (road, hedges and a street lamp grow with them),
  up to 30 lots. You always get a lot; a 31st friend walks around without a house (like the 7th friend in old versions).
- Empty lots: fence, path, mailbox, "For a friend 💛" sign and 2 flower beds -> the same without the flower beds (they come with a house).
  All empty lots share one sign picture.
- Lot choice: by name, exactly the old rule for lots 0-5 (old versions only know those); lots 6-11 only when 0-5 are full, then more lots.
  When two names want the same lot: whoever came online first -> whoever has lived on Friends Lane longest (new save field `laneT`), so the
  same friend keeps the same lot every day.
- Your lot changes while you play (a friend who has lived on Friends Lane longer comes online and wants your lot) -> your house, garden and
  waiting pets move to your new lot together; if you stand in your yard you move along to the same spot, and you see
  "🏡 Your house moved to a new spot on Friends Lane!" (also when you stand near it).
- 4 hills west of town stood where the longer lane goes -> they moved aside (north and south), so the lane runs through a little valley
  (same hills, same drawing work).
- The lane's end barrier: you could walk through it -> it is solid (walk round it on the pavement to the hedge, as before).
- Map (phone and the little job map): "My House" and "My Garden" were drawn in town -> Friends Lane is past the west edge of the map:
  a pink arrow on the big road at the west edge with a sign "🏡 Friends Lane / 🏠 My House" (the small job map: the arrow and 🏠).
  The Flower Corner is a light green patch. When you are on Friends Lane, your pink arrow waits at the west edge.
- "Show me the way" (My House / My Garden in the places list, the "Find My House" quests): leads to your Friends Lane house / garden gate.
- The first time an old game is opened: "Welcome back" and 3 s later "🏡 Your house moved to Friends Lane, with your garden! Follow the pink
  arrow." The pink arrow shows the way to your house (not when you start inside your house or already on Friends Lane).
- New players: Rosie: "This purple house is yours now. You can make it super cozy inside!" -> "Your new house is on Friends Lane, just down
  this road! Follow the pink arrow to find it. 🏡"; when she says bye, the pink arrow shows the way. She now greets you on the pavement by the
  Flower Corner (you look along the road towards Friends Lane, she is in the sun).
- Rosie's chat line "Your house is so purple! I love it." -> "Your house on Friends Lane is so cute! I love it."
- House names in the pizza and designer jobs: "House next to yours" -> "House by the flowers", "Big apartments by your garden" -> "Big apartments by the flowers".
- An old-version friend standing in their old town yard is shown at their Friends Lane house (as before), now only for the yard itself
  (not for the path to the apartments behind it).
- Garden plants: every bed was up to 72 separate pieces (a full garden 276 draws on screen) -> one piece per bed (12 for a full garden), same look.
  Needed because your garden is now in view all along Friends Lane.

## Decisions I made
- Saves keep the old numbers: a spot in your own yard (you, a pet) is saved as the same spot in the old town yard, exactly like old saves,
  and turned into the spot on your lot when you or your pet are put in the world. So old saves load right (B1: no real difference), a pet waiting
  in your garden stays in YOUR garden even if your lot changes, and if the game were ever rolled back you would stand in the old yard.
- That is why nobody can stand in the Flower Corner: a spot there always means "your yard" (old saves, and old-version friends, who are shown at
  their lane house when they stand there). A walkable park would make new-version players jump to their lane house on old screens.
- A save whose player stood in the old yard or garden starts at the same spot of the yard on Friends Lane (in the garden if they were in the
  garden, at the front door if they were at the door). The path to the apartments behind the old garden is not the yard: that stays in town.
- Your house keeps the Friends Lane colours (picked from your name, the same on every screen, also on old versions) instead of the old purple.
- Seniority (`laneT`) instead of "who came online first": with the old rule, two kids whose names want the same lot swapped houses from day to day,
  depending on who opened the game first. Now the one who has lived there longest keeps it. Old versions use the same numbers (jt) the same way,
  so all screens agree on every lot.
- Lots 6-11 are used only when lots 0-5 are full, so with up to 6 players everybody lives where old versions draw them.
- The garden gate is beside the house: on the lane the lots are side by side, so the town's gate on the far side would open into the next lot.
- The map stays the town map (drawing the lane too would make the town much smaller); Friends Lane gets a sign at the west edge.
- "Take me home" still takes you inside your house. Friends who come along still say "Your house is cozy!" inside.
- The intro spot moved 2.2 m along the pavement (to -14.8, -4.6): Rosie stands in front of the Flower Corner fence at a friendly distance.
  Loaded games still start at (-17, -4.6).

## Glitches found and not fixed
- A junior player's house moves to the next lot when the friend who has lived there longer is online, and back when they leave (old versions
  need the old rule for lots 0-5). The garden, pets and you (if in the yard) move along, with a message.
- Old versions keep the old house and garden in town for their own player, and only draw houses on lots 0-5.
- Looking down Friends Lane from the gate costs more draws than before (about 72 instead of 40 with one player: 11 "For a friend" signs and your
  garden are in view); the town spot costs fewer (125 instead of 281 with the rich save: the old house, yard and crops are gone).

## NOT VERIFIED (real devices, sound, feel)
- Real iPad/iPhone: the walk to Friends Lane (about 95 m from the town start, ~25 s), how the Flower Corner and the longer lane look and feel.
- Real Firebase / claude.ai rooms with several real players (tested with the pretend server: old+new and new+new, 1 to 41 players).
- Whether kids understand the "house moved" message and the Friends Lane sign at the edge of the map.

## Try it for real (tick-box tasks)
- [ ] Open an old game in town: "Welcome back", then "Your house moved to Friends Lane…"; follow the pink arrow down the big road to your house.
- [ ] Go in by the front door; inside, "Go to your garden" puts you in the garden behind your lane house; your plants are there.
- [ ] Water a bed, plant seeds, buy seeds at the shed, check the mail, water the 2 flower beds in front of the house.
- [ ] Tell a pet "stay" in your garden, quit, open again: the pet is still in your garden.
- [ ] Look at the Flower Corner where your house was.
- [ ] Phone ▸ Map: the pink arrow and the "Friends Lane / My House" sign at the west edge; tap "My House" in the list: the arrow leads to your house.
- [ ] With a friend (also on an old version): both houses on Friends Lane on both screens; knock and visit each other.
- [ ] Buy the big house: the "Bigger house!" sign goes away and your lane house grows.
- [ ] Start a new game: Rosie's welcome by the Flower Corner, then follow the arrow to your new house.

## Morning questions (each already built in a sensible way)
- House colour: built as the Friends Lane colours picked from your name (the same on every screen); or keep the old purple house look?
- Flower Corner: built as a garden to look at; or make it walkable once everyone has the new version?
- Lots: built as 12 lots that grow 2 at a time up to 30; or more/fewer?
- The map: built as a sign at the west edge; or a second small map of Friends Lane in the phone?

## Tests
- Old saves, every fixture in $SP/kit/cozycheck/fixtures (save-71f43ad, save-8a1982a, save-a0c3ae3, save-ea70306, save-f2cdd53-rich,
  save-live-web-rich) + the fresh save made by the live version: B1 compares the whole saved state after loading in the old and the new version:
  only the known random `pid` differs. Also loaded each one in the new version and compared coins, home (items both floors: 7 with 2 upstairs
  in f2cdd53-rich), wall/floor, garden (f2cdd53-rich: carrot ready, tomato sprouting, carrot ready: same stages in the lane garden), pets
  (Waffles following, Mochi and Marshmallow staying at home; live-web-rich: 3 pets at home), look/outfits/wardrobe, skills, quests, job, big house:
  all the same; their lot, yard, doors and "Bigger house!" sign (shown only without the big house) checked.
- An old save standing in the old garden (with a bunny waiting in the garden): starts in the lane garden, the bunny is there, the save keeps the
  old-yard numbers. An old save standing at the old front door: starts at the lane front door, facing the road.
- Two players, old version + new version: same lots on both screens, both see each other, visits both ways (knock, let in, go inside, leave),
  the old player standing in their town yard shows at their lane house, the new player in their lane yard shows there on the old screen.
- Two new players: same lots on both screens; the junior player's house (standing in the garden, a pet waiting there) hops to the next lot when
  the senior friend comes online and back when they leave; visits both ways.
- 8, 14, 31 and 40 pretend players: the lane grows to 16 and 32 lots; your lot always exists; the end barrier and hedge move along.
- Garden on the lane: plant, water, grow, harvest; water the front flower beds; mail; "Bigger house" card; seed box; doors.
- Drawing work at the title (E1): city 351 pieces / 621,376 triangles -> 352 / 594,306. In play (rich save, 1 player): town spot 281 -> 125
  draws, Friends Lane gate 40 -> 72, your yard 47 -> 49.

## Quick check (the output, exactly as printed)
`SRC=/home/user/wt/job10/index.html quick.sh job10-c files,counts,saves,players,claude,crawl_ipad-landscape_town,crawl_ipad-landscape_inA,crawl_ipad-landscape_hud`

```
new claude bf53664b52ba624af95d9eba6fa654a6 · new web 7b0db04c6fe2c8313421025318ad6f63 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 126 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983227 triangles in total | for information, seen from 5 spots: city 150 draws; home 34 draws; market 40 draws; cafe 54 draws; school 44 draws
[stage saves: running]
Task exception was never retrieved
future: <Task finished name='Task-334' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
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
[stage saves: done in 355 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzfrdzu9vwys" -> "umuzfrwqvvqysx"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 59 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 42 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 356 s]
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 226 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 307 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
- A2 fails as expected in a quick check. B1: `b1.py runs/job10-c` says `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7` (the known random `pid`).
- The "Task exception was never retrieved … TargetClosedError" lines are a warning from the test browser about a page that was already closed; the stage finished normally.
- Crawl stages (they print no lines here; from runs/job10-c/stages/*.json): HUD 145 taps, town 96 taps (incl. your lane door, garden beds, seeds, mail,
  Bigger house, flower beds), home/market/pets/flowers/café 212 taps (incl. "Go outside" and "Go to your garden"): 0 dead, 0 unreachable, 0 stuck,
  0 covered, 0 layout issues, 0 browser errors. Walking: "joystick drag: moved 2.0 m in 1.5 s" (from the town start up to the Flower Corner fence).
