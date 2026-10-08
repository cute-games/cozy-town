# Job 6: Map overhaul

Only `index.html` changed (the game script, and CSS added at the end of the map's existing CSS lines; the web part and the number of
lines 1-498 are untouched) + these notes + 5 pictures in `tools/pictures-2/`.
Save: nothing new, nothing changed. Online: nothing new is sent (friends on the map use what friends already send).
Rebased onto the integration branch (92a4df7: job 3 glitch fixes, the bus restyle, job 8): `renderPhone` keeps job 3's phone fixes
(live clock `phDate`/`phClock`, calendar icon, "👫 Friends" title) and opens the big map from its first line; re-tested after the rebase.

## Changes (item: old -> new)
- 📱 → 🗺️ Map (and the M key): a small square picture of the town inside the phone, names about 7 px tall that overlapped
  ("Pet Shop" under "Flower Shop", "Fountain" over "Cozy Park", "My Garden" over "My House"), a list of places under it
  -> a big map card that fills the screen (iPad both ways, iPhone both ways, PC), drawn from the game's data: the roads, the places
  (PLACES: a new place shows up on the map and in the list by itself), the Friends Lane lots and who lives there.
- The look: soft green ground with round trees on the hills around town, wide lilac roads with rounded ends and corners, a soft
  outline and dashed middle lines, cream pavements with their trees, the paved fronts of the shops, the nature trail, the park
  with its paths, fountain plaza and fountain, the football pitch with its white lines, the lake (with the Duck Dock) and the duck
  pond with a sandy shore, the Flower Corner with its flowers, buildings as rounded blocks in their own colours with the game's ink
  outline, a soft shadow and a soft roof. In dark mode the same map in dusky night colours (names light on dark).
- Names: every place has a round badge with its emoji and its name beside it, always the same size on screen (15 px bold Baloo 2)
  at every zoom. A name goes below its badge, or to the right, left or above, wherever it fits. When it gets crowded the less
  important ones hide and come back when you zoom in: first your house and the place you picked (always shown, with a pink ring),
  then the shops, buildings, 🚌 Bus stop, 🏖️ Beach and 🏡 Friends Lane, then the park, fountain, field, lake, pond, your garden and
  friends' houses, last the 🌸 Flower Corner.
- 🏡 Friends Lane is on the map now (west of town, through the pink gate): every lot, your house "🏠 My House" with a pink ring and
  your garden behind it (the 6 beds, the shed, the stepping stones), friends' houses in their own colours with their names, empty
  lots with a little 💛, the hedges and the end of the lane. (Before: a sign at the west edge.)
- 🏖️ The beach: at the east end of the big road the road stops at the blue beach gate; a sandy path goes on to a bit of beach and sea
  with a "🏖️ Beach →" badge. Tapping it shows the way to the 🚌 bus stop ("🚌 Bus stop · 40 m away · the Beach Bus leaves from
  here 🏖️"), like the beach in the list did. At the beach, your arrow is on that sand and the card says "Take the bus home first 🚌".
- Your arrow: pink with a white and an ink outline and a soft pink pulse, turned the way you look. Inside a building it waits at
  that building's door, pointing out (shops, school and classes, your house, a friend's house, the apartments, a designer client's house).
- Friends: friends who hang out in town (Rosie, Theo, Luna, Finn) are small dots in their shirt colour with their names; friends
  online are bigger dots in their house colour with their names (in town, or at the door of the shop or house they are in).
  A friend's name is left out where it would cover a place's name (the dot stays). Friends who follow you are not drawn (they are
  right next to your arrow).
- Move and zoom: one finger drags, two fingers pinch, a double tap on the map zooms in there; on a PC drag with the mouse and turn
  the mouse wheel; + and − buttons (50 px) for kids who can't pinch; "📍 Me" puts you in the middle with a "You!" bubble (it also
  pops up for a moment when the map opens). You can't lose the town: the map stops at the edges of the town, the lane and the
  beach. Zoom goes from everything at once down to close-up (16 px a metre).
- It opens centred on you at a comfy zoom (about 85 m across). If the pink arrow already shows a far place, it opens showing you
  and that place.
- Tap a place (its badge, its name or the building, also a friend's house on Friends Lane): the way there is set at once (the pink
  arrow bar and the beacon in town, as before) and a pink dotted line along the pavements and paths shows the way (the dots walk
  towards the place; to Friends Lane through its gate along the pavement). A card at the bottom (in the game's card colours, also
  in dark mode): "🍎 Market · 35 m away · [🚶 Let's go!] [✕]". Let's go! closes the map ("📍 Follow the arrow to the Market!");
  ✕ stops showing the way (the ✕ on the arrow bar in town still does too). Tapping the same place again wiggles the card and shows
  the way again.
- Nothing picked: the card says "👆 Tap a place to see the way there!". Tap your arrow or 📍 Me: "📍 That's you! The pink arrow
  points where you look." An empty lot: "💛 This spot is for a friend! …"; the Flower Corner and the Friends Lane badge: a friendly
  message.
- The list of places is kept: a side column on big screens (iPad sideways, PC) and behind a "📋 Places" button on small ones
  (iPhone, iPad upright), where it opens over the map. A place in the list now shows its way on the map like a tap on the map
  (on small screens the list closes so you see it); the picked place is yellow in the list.
- Keys: M opens the map and now also closes it, Escape closes, + and − zoom, the arrow keys (or W A S D) move the map.
  "‹" goes back to the phone's home screen, ✕ closes.
- The little job map in the corner (pizza, designer and teacher jobs) is painted by the same code, so it has the same rounded roads,
  buildings, park and Flower Corner (still icons only, same size, same spot, same pink sign for Friends Lane at its west edge).

## Decisions I made
- "Tap a place to set the route" (owner's words): the way is set at the first tap, but the map stays open so a kid sees the dotted
  line, with a big "🚶 Let's go!" to close it. The list does the same, so the map and the list work the same way.
- North is up and the map doesn't turn (easier for kids to learn); your arrow turns.
- The dotted line follows the walkers' paths (pavements, crossings, park paths), the safe way to walk. The pink arrow in town is
  unchanged (straight at the place, and along the middle of the big road to and from Friends Lane: job 10's routing).
- The distance in the card is "as the crow flies", the same number as the arrow bar in town.
- The beach is a small sandy bit past the east edge (the real beach is far away, only by bus), so the town isn't squashed.
- Dark mode turns the map into a dusky night map; the little job map in the corner keeps the day colours (as before).
- The map is a card of its own (not inside the phone picture), so it can use the whole screen; ‹ goes back to the phone.
- Speed: the town picture is cached for the screen plus 120 px around it and painted again only after a zoom or a bigger move
  (while two fingers pinch it is stretched a little and painted again when they let go); names, the dotted line, friends and your
  arrow are drawn on top 10 times a second; when the map closes nothing runs and the cached picture is freed. Test browser:
  painting the picture 1.5-4 ms, one frame 0.1-0.5 ms. Names are laid out again only after a zoom or when another place is picked.
- The list hides "My House"/"My Garden" only in the moment before your lot on Friends Lane is known (a split second at the start).

## Glitches found and not fixed
- In town the 3D pink arrow still points straight at the place, not along the dotted line (e.g. from the lane to the fountain it
  points through the park fence; see job 10's notes).
- The dotted line joins the nearest path points with straight lines, so near the end it can cut across a paved shop front or a
  pavement corner.
- Very zoomed out on a tall phone, the map shows a lot of forest above and below the town.
- The bottom card covers a strip of the map; the + − 📍 buttons can cover a name in the top right corner.
- The 3D town keeps drawing behind the big map (as it did behind the phone).

## NOT VERIFIED (real devices, sound, feel)
- Pinch and drag on a real iPad/iPhone (tested with real taps, real mouse drag and wheel, and pretend two-finger pinches), how
  smooth it is on an old iPad, Safari's memory for the map pictures, a Mac trackpad pinch, the sounds.
- Whether kids understand the dotted line + "Let's go!" without help, and the names' sizes on a real phone.

## Try it for real (tick-box tasks)
- [ ] iPad: 📱 → 🗺️ Map. The map fills the screen, you are in the middle; names are big enough; the list is at the left.
- [ ] Drag the map with one finger, pinch in and out; press + and −; press 📍 Me. You can't drag the town away.
- [ ] Tap the Market on the map: a dotted line from you to it, the card "🍎 Market · … m away". Tap 🚶 Let's go!: the pink arrow
      shows the way; walk there: "You found the Market!".
- [ ] Tap "My House" in the list: the line goes along the big road through the pink gate to your house on Friends Lane.
- [ ] Tap 🏖️ Beach →: it shows the way to the 🚌 bus stop.
- [ ] Go into a shop and open the map: your arrow is at the shop's door.
- [ ] With a friend online: their dot and name on the map, their house on Friends Lane; tap their house: the way there.
- [ ] iPhone upright and sideways: 📋 Places opens the list over the map; tapping a place closes it and shows the way.
- [ ] Dark mode: the map turns into a night map, names readable.
- [ ] PC: M opens, M or Escape closes, mouse drag and wheel, + − keys, arrow keys.
- [ ] Pizza job: the little map in the corner still shows the dot and your arrow.

## Morning questions (each already built in a sensible way)
- Tapping a place: built as "the way is set and shown, the map stays open with 🚶 Let's go!"; or close the map at once?
- The list: built as a side column on big screens, a "📋 Places" button on small ones; or always behind the button?
- Dark mode: built as a night map; or the same day colours as in light mode?
- The pink 3D arrow in town: built as before (straight at the place); or should it follow the dotted line, turning at corners?
- The little job map in the corner: built with the new look; or keep its old look?
- Friends on the map: built as the town friends (Rosie…) and friends online, all with names; or only friends online?

## Tests
- iPad sideways and upright, iPhone upright and sideways, PC 1366 and 1920, light and dark: the map opens from the phone and with M,
  fills the screen, no layout problems found by the check's layout audit on my screens. (Before the rebase the HUD notepad was cut
  off on iPhone sideways, also in the version before my job; job 3's fix for the left HUD column solved it: none after the rebase.)
- Real taps on the map (a building, a badge), the list, + −, 📍 Me, 📋 Places, Let's go!, ✕, ‹; pretend two-finger pinches and
  one-finger drags (pointer events), a real double tap; PC: real mouse drag, mouse wheel, M / Escape / + / − / arrow keys.
- The way: to the Market, Pet Shop, Library (along the pavements), to My House and a friend's house on Friends Lane (along the big
  road, through the gate), the Beach (to the bus stop); from inside the Market (starts at its door, "Go outside first"); at the
  beach ("Take the bus home first").
- Two players (old version + new version): the online friend's dot and name in town, their house with their name on Friends Lane,
  tapping it shows the way there.
- The check's HUD crawl taps every map button: none dead, none covered; Escape and M work (K1).
- Pictures in tools/pictures-2: before-map.png (tonight's starting version), after-map.png, after-map-route.png (the way to My House
  on Friends Lane), after-map-zoomed.png, after-map-iphone.png (iPhone upright, the way to the Library). iPad sideways unless named.

## Quick check (the output, exactly as printed)
After the rebase onto 92a4df7: `SRC=/home/user/wt/job06/index.html quick.sh job06-q3 files,counts,saves,players,claude,crawl_ipad-landscape_hud,pc_keys`

```
new claude 52e724f9da5bbb3365592210bc8c7b82 · new web 13406efa667412e69796cd015da4c04f · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 78 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 146 draws; home 34 draws; market 40 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 245 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzsicq3qyiay" -> "umuzsiniujsjpi"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 38 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 27 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 448 s]
[stage pc_keys: running]
[stage pc_keys: done in 42 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 $SP/tools/b1.py $SP/runs/job06-q3`: `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7` (the known random player id only).
HUD crawl (crawl_ipad-landscape_hud): 151 taps tested (20 of them in the map), none dead / unreachable / covered / stuck, 0 layout issues, 0 browser errors.
