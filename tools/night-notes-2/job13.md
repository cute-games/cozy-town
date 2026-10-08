# Job 13: The designer's older wishes

Only `index.html` changed (the game script; the web part and lines 1-498 are untouched) + these notes + 4 pictures in
`tools/pictures-2/`. One new optional save field, only on a Shell shelf: it is saved as a white Bookshelf with a marker,
`{t:'shelf', c:'#ffffff', sh:1, …}`, so older versions simply show a bookshelf (the shell count was already saved by the beach,
`S.beach.n`). Nothing new online, except one small extra value for visitors (see the Shell shelf). All four wishes are built.

## Changes (item: old -> new)

### 🌉 A bridge over the duck pond
- Duck pond (the small pond east of the big blue flats, by the sandy path): a pond you could only look at -> a little wooden arched
  bridge across it, from the sandy path on the north side to the grass on the south side. Wooden planks in two shades, arched side
  beams, posts with round knobs (pink at the four ends, cream in the middle), a hand rail and a lower rail that bend with the arch.
- Walking over it: you go up and down with the arch (at the top your view is 80 cm higher, so you look down on the ducks), and you
  can't fall off the sides into the water. At both ends you can step on and off. Pets that follow you can climb onto it too and stand
  on the planks; online friends who walk over it are shown on the planks (in the new version; old versions show them at ground level).
- On top of the bridge: a new "🦆 Feed the ducks" button (the same as the one by the bench: with bread the ducks come over and get 💗;
  without bread: "The ducks would love some 🍞 bread! …").
- The ducks still swim all over the pond and pass under the high middle of the bridge (about 2 m wide); they keep out of its low ends
  (they would poke through the planks there). Checked over 2 minutes of swimming: never in a low end.
- The two rim stones under the low north end are left out (they would poke into the bridge). Everything else around the pond (bench,
  feeding spot, cattails, lily pads, bushes and flowers) is exactly where it was.
- Drawing work: the bridge is merged into the town scenery (no extra draw calls); the town has +1.2 % triangles.

### 🎶 Dance music for the TV cat
- TV at home: the dancing cat show was silent -> a short cheerful tune plays in time with the cat (on the cat's own beat, 2.2 beats a
  second). Each of the cat's 5 moves (HANDS UP!, VIBE CHECK, THE FLOSS!, SPIN!, JUMP JUMP!) has its own little 8-beat tune, with a soft
  bass, a soft drum on the beat and a tiny tick between beats.
- It plays only while you are at home, on the TV's floor and near it: soft within 2.5 m, quieter further away, silent from 7 m. It stops
  when you turn the TV off, when you leave the house, while you lie in bed, and with 🔊 Sound off in Settings. With two TVs on, only the
  nearest one plays.
- Never endless: a show is 5 rounds of the dance (about 1½ minutes). Then a little "ta-da", the TV switches itself off and
  "📺 The end! The dancing cat takes a bow 🐱👋 Tap the TV to watch again." Tap the TV and a new show starts.
- Loudness: the tune is about half as loud as a button tap (the drum and bass are soft sine sounds).

### ✨ Fireflies in the park at night
- Cozy Park at night: stars, lamps and lit windows -> also 48 fireflies: tiny soft yellow-green glowing dots, 0.5-2 m above the grass,
  each drifting in its own little loop and blinking slowly. All over the park, not in the fountain's spray and not on the Pet Show stage.
- They come out after sunset (from about 19:10, all out by about 20:05) and fade away at dawn (from about 5:25, gone by about 6:20).
- Drawing work: one extra piece (1 draw call, 96 triangles), only at night; by day it is switched off. The drifting and blinking happen
  on the graphics chip, so the game does no extra work per firefly.

### 🐚 Shell shelf
- Home shop (🛋️ Decorate -> 🛍️ Shop; also 📱 Furniture -> "Shop for my house"): new furniture "🐚 Shell shelf", 150 🪙 (the same price and
  the same size as the Bookshelf, 1.2 m wide), shown right after the Bookshelf.
- A cream-white shelf with a sea-blue back, 3 boards and a big pink shell on top. It shows your shell collection (the shells you pick
  up at the beach): 12 spots that fill up as your collection grows: 1, 2, 3, 4, 5 and 6 shells -> one more shell each, then at 8, 10, 13,
  16, 20 and 25 shells. Full at 25 (about 5 beach days). Three kinds of shells (scallop, conch, turban) in 6 pastel colours. The middle
  board fills first (eye height), then the top one, then the lowest.
- Tap it ("🐚 Look at your shells"): "🐚 You have 23 shells! Find more at the 🏖️ beach to fill your shelf." With 25 or more:
  "🐚 You have 31 shells! Your shelf is full of treasures! ✨". None yet: "🐚 No shells yet! Find pretty shells at the 🏖️ beach.".
  A 🐚 floats up from the shelf.
- Picking a shell at the beach: the shelf at home shows it at once. On your 3rd shell ever, if you have no shelf yet, a tip comes
  after the shell message: "🐚 Tip: a Shell shelf from the 🛍️ Home shop shows your shells at home!".
- Saved as a Bookshelf: in your save the Shell shelf is a white Bookshelf with the marker `sh:1`. The new version shows the Shell
  shelf everywhere (house, moving it, 📦 My stuff, visitors); an older version (also "Go back to PRENIGHT 2") just shows a white
  bookshelf with books in the same spot and keeps the marker, so back in the new version it is a Shell shelf again.
- Visiting a friend's house (Friends Lane): their shelf shows THEIR shells. The count rides along with the house layout the host
  sends (one extra value at the end of the shelf's row, like `s23`); visitors with an older version read only the usual values and
  see a white bookshelf.
- Not in the daily quests ("Put a … in your house": the quests stay exactly the same for every save) and not in the designer job's
  furniture list (a client's room would show your shells). No "New in!" colours (it has one look).

## Decisions I made
- Bridge direction: north-south, from the sandy path to the grass, 40 cm east of the pond's middle so the cattails stay free. Its
  north end stops just before the path, so townsfolk walking the path never walk into it.
- An arched bridge you walk up and over (80 cm high in the middle) rather than a flat one: it looks like a real garden bridge, it is
  fun to cross, and the ducks can swim under it. Your view, your following pets and online friends go up with it. The walls of the
  pond collider let you onto it only along the planks (the same trick as the lake pier).
- A "Feed the ducks" spot on the bridge: the nicest place to feed them.
- Pets that follow you either walk round the pond or follow you over the bridge, whichever way they find first; both look fine.
- TV music: one short tune per dance move, so the music changes when the cat's move (and the caption) changes. A show ends by itself
  after 5 rounds (about 1½ minutes) so it can never play forever; "loop softly while on" is kept inside a show.
- Fireflies: 48 ("a few dozen"), yellow-green like real fireflies, drifting and blinking; they come out after the street lamps.
- Shell shelf: sold in the Home shop for 150 (like the Bookshelf, job 8's prices) rather than given free; full at 25 shells; it shows
  only your own shells (or your friend's when visiting).
- Shell shelf saved as a Bookshelf with a marker (`t:'shelf'`, white, `sh:1`; the same size and price as the Bookshelf), so going back
  to an older version, or an iPad/Claude copy that is still older, never meets a furniture kind it doesn't know: it shows a bookshelf.
  In the new version, placing it counts as a Shell shelf, not as a Bookshelf (for "Put a … in your house" quests).

## Glitches found and not fixed
- In an older version the Shell shelf is a white bookshelf full of books (by design, see Decisions); placing it there counts for
  that version's "Put a Bookshelf in your house" quest.
- Townsfolk and the kids walking around town never use the bridge (they keep to their paths).
- Players with an older version see a friend who walks over the bridge at ground level (inside the bridge) until they update.
- A pet that follows you sometimes walks round the pond instead of over the bridge (it waits for you on the other side).
- At a friend's house the Shell shelf is only to look at (like most furniture there).
- The TV picture itself did not change: the show ends without a special bow on screen (the toast says it).
- If you go to bed with the TV on, it stays on silently until the show ends.

## NOT VERIFIED (real devices, sound, feel)
- Sound: I could not listen in the test browser. I checked the tune by recording every note the game plays (the right notes on the
  cat's beats, the first beat right when the TV turns on, softer further away, nothing after leaving, with sound off or while you lie
  in bed at night, back again when you come back or get up, the "ta-da" at the end). Is the tune cheerful and not annoying? How loud
  on a real iPad?
- Feel of walking over the bridge on an iPad (going up and down 80 cm), and on a PC with the keys.
- How bright the fireflies look on real screens (they blink and drift, which a still picture can't show).
- Real iPad/iPhone (tested in the test browser on iPad landscape; the shelf also on iPhone portrait).

## Try it for real (tick-box tasks)
- [ ] 🗺️ Map -> Duck Pond. Walk over the bridge from the sandy path: you go up and down. In the middle try to walk off the side (you
      can't). Step off at the ends.
- [ ] On top of the bridge: "🦆 Feed the ducks" (with bread from the Market or the Bakery; without bread you get a friendly tip).
- [ ] Watch the ducks swim under the middle of the bridge.
- [ ] A pet following you: walk over the bridge; the pet stands on the planks or walks round the pond.
- [ ] After 20:00 go to Cozy Park: fireflies drift and blink over the grass; in the morning they are gone.
- [ ] At home with a TV: tap "Watch TV": music with the dancing cat. Walk away (softer), go outside (stops), come back (plays again),
      Settings sound off (stops). Wait about 1½ minutes: "📺 The end! …" and the TV is off.
- [ ] 🛍️ Home shop: buy a Shell shelf (150 🪙), put it in your house, tap it: "🐚 You have … shells!". Pick shells at the beach, come
      home: the shelf shows more shells as your collection grows (full at 25).
- [ ] Two players: visit a friend who has a Shell shelf: you see their shells.
- [ ] With a Shell shelf in your house, "Go back to PRENIGHT 2": the game starts and a white bookshelf stands there; update again:
      the Shell shelf is back with your shells.

## Morning questions (each already built in a sensible way)
- Shell shelf: built as a Home shop item for 150 🪙; or give it free once (e.g. with your 5th shell)?
- Shell shelf: built full at 25 shells (12 spots); or more spots / a second shelf for big collections?
- TV show: built to end by itself after 5 rounds of the dance (about 1½ minutes); or keep playing until you turn it off?
- Bridge: built arched (80 cm high, you go up and over); or lower and flatter?
- Fireflies: built as 48, from about 19:10; more, fewer or brighter?

## Quick check
`SRC=/home/user/wt/job13/index.html quick.sh job13-2 files,counts,saves,players,claude,crawl_ipad-landscape_town,crawl_ipad-landscape_inA`

```
new claude 98d23d9b5183235253675c2ea0ee7bb1 · new web 9db9b3c8475ac04bafb4bb2cb24e1cc9 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 85 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1305 pieces, 994508 triangles in total | for information, seen from 5 spots: city 138 draws; home 34 draws; market 35 draws; cafe 55 draws; school 44 draws
[stage saves: running]
[stage saves: done in 257 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuztz7a1gd9gv" -> "umuztzmjrw78xz"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 39 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 26 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 228 s]
[stage crawl_ipad-landscape_inA: running]
[stage crawl_ipad-landscape_inA: done in 262 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 tools/b1.py runs/job13-2`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

A2 fails as expected in a quick check (no backup given); B1 is the known false fail (old saves without `pid` get a new random
player id; nothing else differs). The crawl stages print no verdict lines in a quick check; their stage files say:
town: 92 things tapped (incl. the new "Feed the ducks" on the bridge), 0 browser errors, 0 layout issues, 0 dead, unreachable,
stuck or covered buttons (11 skipped "not available right now", the same as in earlier jobs' runs); home/market/pets/flowers/café
(inA): 195 tapped, 0 errors, 0 layout issues, 0 dead, unreachable, stuck or covered buttons.

My own tests (test browser, iPad landscape unless said): walking over the bridge (height up to 0.8 m and back, the sides hold you,
the ramps let you off, a following pet on the planks), ducks for 2 minutes (never in the low ends), the fireflies' fade by hour
(off at 18:48, half at 19:36, full at 20:18, off again at 6:36), the TV tune (recorded notes: first beat at once, softer at 5 m,
silent at 8 m, stops outside, with sound off and in bed at night, resumes when back or up again, the show end with "ta-da" and
toast), the Shell shelf (bought with real taps in the shop: saved as `{t:'shelf',c:'#ffffff',sh:1}`; placed, put away
(📦 My stuff shows "🐚 Shell shelf"), placed again and moved: the marker always stayed; 0/1/7/9/23/30 shells, the tap toast; iPhone
portrait in light and dark: 0 layout issues). Going back: with that save the previous version (tools/prenight2-index.html) and
tonight's starting version both start normally (no errors) and show a white bookshelf; moving it, putting it away and placing it
again there keeps `sh:1`, and the new version then shows the Shell shelf again. Visiting with a Shell shelf in the host's house:
new host + old guest (prenight 2): the guest sees a bookshelf; new host + new guest: the guest sees the host's 7 shells (of 9);
old host + new guest: a bookshelf; no errors on either side. Drawing work measured against tonight's starting version: town +1
piece (+0.3 %) and +1.2 % triangles; no other area changed (the Toy Store's count differs a little from one start to the next by
itself: the claw machine's capsules are placed at random).
