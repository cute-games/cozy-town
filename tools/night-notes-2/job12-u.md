# Job 12 (screens part): Glitch hunter, pass 2 — the 2D fixes (HUD bars, cards, map)

Only `index.html` changed (the game script; the web part and lines 1-498 are byte-for-byte the same: the new styles come from the game
script), plus these notes and 20 before/after pictures `tools/pictures-2/glitch2-U01…U20-*.jpg` (left = **before**, taken by the
photographer on c013529; right = **after**, my file, the same recipe). No save fields, no lists and no presence fields changed (one
existing presence value is sent a little differently while you sit on the bus, see finding 24). My findings were 1, 4, 6, 13, 17, 18,
19, 20, 24 and 29 of `glitch2/findings-main.md`: all ten are fixed. I did not touch message (toast) placement or 3D things.

## Changes (item: old -> new)

**Finding 1, the pink arrow bar on an upright iPhone.**
- Width (U01 `glitch2-U01-way-bar-beach-iphone.jpg`, U02 `glitch2-U02-way-bar-town-iphone.jpg`): the bar was squeezed into the
  narrow left column (about 145 px: the column shares the top row with the round buttons), so it became a round blob of single words,
  8 lines tall at the beach, with its ✕ on the words -> below the clock the bars (way-finder, bus pill, football and tennis score) may be
  as wide as their words (up to the screen width minus the edges): "⬆️ 🏠 My House 95 m ✕" and "🚌 Next bus: 8:50" are one line again.
  The ✕ keeps its own space. iPad and phones held sideways are unchanged (their column was already wide enough).
- Words at the beach (U01): "🏠 My House: take the bus home first 🚌" (and "🚌 Bus stop: take the bus home first" at the campsite, right
  next to the beach bus stop) -> "🚌 Take the bus home" when you are on your way home, "🚌 Take the bus to town" for any other place.
  The arrow used to point straight up (meaning nothing) at the beach -> it now points to the beach bus stop. Back in town it points to
  your place again, as before.
- The bar's words are only rewritten when they change (they were rewritten 7 times a second, which reflowed the HUD column each time).

**Finding 4, football on an upright iPhone** (U03 `glitch2-U03-football-left-column-iphone.jpg`): the left column was taller than the
screen and the notepad jumped next to the little map, into the middle of the field (over the kids and the 🎯 sign) -> with the score
pill and the arrow bar on one line each, the column fits again (coins, tummy, clock, score, arrow bar, map, job text, notepad all in one
column). And the column-fitting rule from pass 1 (job 3) never puts the notepad or the designer card beside the map when that would
reach the middle of the screen (an upright phone): there it folds/hides things instead. A phone held sideways still puts the notepad
beside the map (checked).

**Finding 6, the football score pill** (U04 `glitch2-U04-football-score-pill-iphone.jpg`): "⚽ Blue 0 – 0 Pink" ran out of the pill
and ✋ Stop wrapped to a second row -> one row: "⚽ Blue 0 – 0 Pink ✋ Stop" (also "🥇 You 0 – 0 Zac", and the 🎾 tennis pill).

**Finding 13, "Oh no, the bus left!"** (U05 `glitch2-U05-bus-left-message.jpg`): the message came at 21:00 sharp while the bus still
stood at the stop (the pill still said "Bus to town: 0:01") -> it comes when the bus has really driven off (8 m away, about 3 seconds
later, or gone). If you stand in front of the bus it waits and honks as before; the message then comes once it drives away (until
22:00).

**Finding 17, the Welcome Bus pill** (U06 `glitch2-U06-welcome-bus-pill-beach.jpg`): after the free ride on day 1 the pill at the beach
still said "🎉 Free bus! Hop on!" -> "🚌 Free bus to town until 12:00" (what Driver Dot says). At the park it still says "🎉 Free bus! Hop on!".

**Finding 18, the bus times at the beach.**
- The board in the beach shelter (U07 `glitch2-U07-beach-board-times.jpg`) showed the park's times (Tuesday 8:50, Wednesday 8:10,
  Saturday 9:10) -> it shows when the buses home leave the beach: "⭐ Tuesday 11:50 · 21:00", "Wednesday 11:10 · 21:00",
  "Saturday 12:10 · 21:00" (day 1: "🎉 until 12:00 · 21:00"), and "🏘️ Bus to town · a ride is 20 🪙" at the bottom. The same times as
  the timetable card at the beach and the pill. The board at the park is unchanged. Only the picture on the board changed (no 3D change).
- Driver Dot on arrival (U08 `glitch2-U08-driver-dot-beach-times.jpg`): "The bus home leaves at 21:00. See you then!" while the pill
  counted down to 11:50 -> "I go back to town at 11:50. The last bus home leaves at 21:00. Have fun! 👋".

**Finding 19, the map: your "You!" and arrow covered names.**
- A friend online next to you (U09 `glitch2-U09-map-friend-name-you.jpg`): "ZZTE[You!]W" -> "You!" and friends' names each take a side
  (above, below, right or left) where they cover no place, name or dot. Friends' dots are drawn over your arrow (it never hides them).
- Inside a shop on an iPhone (U10 `glitch2-U10-map-inside-market-iphone.jpg`): "Ma▼et" -> a place name under your arrow moves to
  another side of its badge ("Market 🍎"); it can still be tapped where you see it. With no room anywhere, a small place's name hides
  (like when the map is crowded) and a big place's name is drawn over the arrow.
- Zoomed out (U11 `glitch2-U11-map-zoomed-out-labels.jpg`): "Flowe▲orner" -> no name under the arrow.
- A friend inside the Market (U12 `glitch2-U12-map-friend-in-market.jpg`): a dot without a name -> the name is under the dot.
- After picking Beach and then Bus stop (U13 `glitch2-U13-map-bus-stop-list.jpg`, iPad dark): the Places list still lit up "Beach" and
  the card still said "the Beach Bus leaves from here" -> "Bus stop" lights up, and the card is the bus stop's own card.

**Finding 20, the map on small iPhones.**
- The card (U14 `glitch2-U14-map-card-iphone.jpg`): on an upright phone the words had about 150 px ("Bus stop · 10 m away · the Beach Bus
  leaves from here 🏖️" in 5 lines) -> the buttons go under the words: the words get the whole card (2 lines), "🚶 Let's go!" is a wide
  button under them, ✕ beside it. When you pick a place the map leaves room for the taller card.
- Zoomed out all the way (U15 `glitch2-U15-map-zoomed-out-iphone.jpg`): no beach, and "Toy S…" cut at the edge -> a place's name never
  pokes out of the map's edge (it takes another side of its badge, or hides), and the 🏖️ beach sign always shows (its name only below,
  right or above it, never into the town).
- The Places list on a phone held sideways (U16 `glitch2-U16-map-places-list-iphone-sideways.jpg`): 4 columns, the last row ("🚌 Bus
  stop") cut off with no hint -> 5 slightly narrower columns: all 21 places fit (each still 44 px tall). On a smaller phone, where the list
  still scrolls, a little bouncing ⬇️ shows until you reach the end (checked at 667×375).

**Finding 24, sitting on the bus on an iPhone** (U17 `glitch2-U17-bus-seat-view-iphone.jpg`, U18
`glitch2-U18-bus-seat-view-iphone-sideways.jpg`): you saw the ceiling and a dark seat block (upright), or the yellow door pole right in
front of your face (sideways) -> on a phone you look out of your own window when you sit down: the bus stop and its board, the park
fence and trees (door side), or the street, the lamps and the houses (road side). You can still look around with your finger. iPads are
unchanged (their wide view already shows the inside of the bus). So that friends don't see you sitting sideways on the seat, while you sit
on the bus your body faces forward for them whatever way you look (the existing `ry` value: the seat's direction instead of your look).

**Finding 29, small text breaks.**
- Zoomy Zac's card (U19 `glitch2-U19-zac-card-1-vs-1.jpg`): "…or a 1 vs / 1?" -> "1 vs 1" never breaks (also the "🥇 1 vs 1 with Zac"
  button and the bench label "Invite Zoomy Zac to a 1 vs 1").
- The bus timetable card on a phone held sideways (U20 `glitch2-U20-timetable-scroll-hint-iphone-sideways.jpg`): the bouncing ⬇️ "more
  below" sat on Saturday's time ("🚌 9…") -> on this card it bounces in the middle of the row, between the day and the time.

## Decisions I made
- Narrow screens only (max 600 px wide): the bars below the clock may be wider than the column; the coins/tummy/clock chips keep the
  narrow column (they share the top row with the round buttons). A bar that still doesn't fit (very small phones) wraps inside the screen.
- At the beach the arrow bar does not name your place any more ("🚌 Take the bus home / to town"): the one thing to do there is the bus,
  and the arrow shows the way to its stop. Your place comes back on the bar in town.
- "Oh no, the bus left!" waits until the bus is 8 m away: you see it drive off first. The message window is 21:00–22:00 (was 21:00–21:30)
  so it still comes if you held the bus up a while.
- The beach board shows both buses home per day ("11:50 · 21:00"); the text shrinks a little if a long weekday makes it tight.
- Map: on the most zoomed-out view of an upright phone the town is tiny, so not every badge fits: the beach sign now always shows, and the
  Toy Store and Library badges wait until you zoom in one step (before: the beach was missing and "Toy S…" was cut). Labels that would poke
  out of the map's edge take another side. I did not make the smallest zoom smaller (the hint): the town would only get tinier.
- Map: "You!" (it shows 2 seconds when the map opens or you press 📍 Me) takes the side that covers the least; it never moves place names.
- Bus seat view: only on phones (the narrow view), turned about 68° from forward towards your own window; iPads keep the forward view.
- The 5-column Places list is for short screens (phones held sideways); the font is 13 px there (was 14), every button stays 44 px tall.
- The ⬇️ hint of the bus timetable sits in the middle (the empty space between the day and the time), instead of adding a right margin
  that would make the rows jump when the hint comes and goes.

## Glitches found and not fixed
- None of my ten findings is left open.
- Seen while testing, other fixers' areas (not touched): the old-save message "🏡 Your house moved to Friends Lane…" and other messages
  over cards / the notepad on an upright phone (message placement: the MOVE fixer); the "-20 🪙" fare text in your face (finding 9);
  the lamp globe at the beach gate (finding 23); friends' dots can still sit on a place's name on the map when they walk past it (dots
  are not moved, only names).
- On the map, a friend's name is left out if no side of their dot is free (as before, only now 4 sides are tried instead of 1).

## NOT VERIFIED (real devices, sound, feel)
- Real iPhones: the bar widths with the notch / safe areas (`env(safe-area-inset-*)`), and how the seated window view feels.
- Two real devices on the bus: the friend now sits facing forward for you (checked only through the code path and the test server).
- Real finger taps on a map name that moved away from your arrow (checked with the test's tap position, not a finger).
- Sound: nothing changed.

## Try it for real (tick-box tasks)
- [ ] iPhone upright: pick 🏠 My House on the map, take the bus to the beach: the pink bar is one line, "🚌 Take the bus home", and its
      arrow points to the beach bus stop. In town: "🏠 My House 95 m" on one line.
- [ ] iPhone upright: ⚽ Take the field: the score pill is one row ("⚽ Blue 0 – 0 Pink ✋ Stop"), the notepad stays in the left column.
- [ ] At the beach on a bus day at 20:59: "🚌 Oh no, the bus left!" only comes after the bus drives away.
- [ ] A new player, day 1: Welcome Bus to the beach: the pill says "🚌 Free bus to town until 12:00".
- [ ] Bus day: ride to the beach: Driver Dot says when this bus goes back (e.g. 11:50) and 21:00; the beach shelter board shows the same.
- [ ] Map with a friend next to you: "You!" and their name don't cover each other; a friend inside a shop has their name on the map.
- [ ] Map on an upright iPhone: pick a place: "🚶 Let's go!" sits under the words. Zoom out all the way: the 🏖️ beach sign shows, no
      name is cut at the edge. Inside a shop: the shop's name is beside its badge, not under your arrow.
- [ ] Map on an iPhone held sideways: 📋 Places shows all 21 places.
- [ ] Sit on the bus on a phone: you look out of the window at the bus stop / the street.
- [ ] Zac's card: "1 vs 1" stays together. Bus timetable on a sideways phone: the ⬇️ never covers a time.

## Morning questions (each already built in a sensible way)
- On a phone you look out of the bus window when you sit down. Built like that; or look forward like on the iPad?
- At the beach the pink bar says "🚌 Take the bus home" (or "to town") and points to the bus stop. Built like that; or also name the
  place, e.g. "🚌 Bus, then 🍎 Market"?
- Zoomed out all the way on an upright phone, the beach sign shows and two town badges wait for one zoom step. Built like that; or keep
  the town badges and leave the beach out at that zoom?

## Quick check (the output, exactly as printed)
Run `job12u-a` (SRC = this worktree's index.html; stages files,counts,saves,players,claude,crawl_ipad-landscape_hud,pc_keys,teacher_iphone-landscape):
```
new claude 0cef36f472c8b64007218804cdf635db · new web 0bfb2f14b4c1dc3e71af7f326071dbcc · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 91 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1305 pieces, 994508 triangles in total | for information, seen from 5 spots: city 151 draws; home 34 draws; market 46 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 217 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzxv0hth2pco" -> "umuzxvdrgaboar"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 29 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 30 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 382 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 79 s]
[stage pc_keys: running]
[stage pc_keys: done in 34 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
`python3 $SP/tools/b1.py $SP/runs/job12u-a`:
```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```
A2 = normal for a quick check; B1 = the known pid-only difference. Stage files (`runs/job12u-a/stages/*.json`): 0 layout issues and 0 browser
errors in every stage; the HUD crawl tested 156 taps (phone, 🗺️ map, Places list, every place, bag, settings…): 0 dead, 0 unreachable,
0 covered, 0 stuck. Also a short look at everything I changed on iPhone upright (light: the pictures; dark: map card, zoomed-out map,
timetable, Zac's card, the 1 vs 1 pill) and iPhone sideways (dark: the pictures; light: HUD bars, Places list, map card, bus seat):
0 browser errors, nothing cut off or overlapping.
