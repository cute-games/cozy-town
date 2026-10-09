# Job 4: Small changes (Pet Show hours, far-ahead clocks)

Only `index.html` changed (the game script; the web part and lines 1-498 are untouched) + these notes.
No new save fields, no new online fields (the clock rule uses the clock that is already sent online).

## Changes (item: old -> new)
- Pet Show: Saturday 9:00-18:00 -> Saturday 8:00-20:00 (the same hours as the shops). The hours are one pair of numbers in the
  game, so every text and check follows:
  - Before 8:00 the stage says "🏆 Pet Show starts at 8:00" (no judges yet); tapping it: "The Pet Show starts at 8:00! The judges
    are on their way. Dress up your pet! 🎀"
  - 8:00 to 19:59: judges and the 3 other pets on stage, "🏆 Enter the Pet Show!"
  - From 20:00: "🏆 Pet Show is over for today"; tapping it: "Today's Pet Show is over (8:00 to 20:00). The next one is next Saturday!"
  - The midnight message (also when you wake up on a Saturday): "It's Pet Show day! The show is in the park from 8:00 to 20:00."
  - 📅 Calendar: "Bring your pet to the park from 8:00 to 20:00!" (on other days: "on Saturday, 8:00 to 20:00, in the park").
  - The 🏆 next to the day in the top bar, the phone's "🏆 Pet Show today!" and the Calendar app's "!" badge: until 20:00 (was 18:00).
  - Not changed: a show that already started always finishes (also after 20:00). No quest or task mentions the hours (checked
    "Pet Show star", "Pet fashion show"); the stage sign says "Every Saturday!" without hours.
- Shared clock: a friend any number of days ahead pulled you forward -> a friend whose day is MORE than 30 days ahead of yours does
  not pull you. You each keep your own day and time. Up to 30 days ahead (exactly 30 too) still pulls you forward, as before.
- Going to bed with friends online: the night skipped only when every friend online was in bed -> a friend on their own clock (more
  than 30 days apart, either way) doesn't count: their night is not your night (they may be in the middle of their day and can't go
  to bed). They are not in "😴 1 of 2 in bed" and 🔔 doesn't ring them. With only such friends online, the night skips like alone.

## Decisions I made
- Day numbers are compared with YOUR day: friend's day minus your day more than 30 -> ignored for the clock. The hour does not
  matter: you on day 1 at 23:00 and a friend on day 31 at 1:00 still counts; day 1 at 23:59 and day 32 at 0:01 does not.
- Because only day numbers count, two friends between 30 and 31 days apart get together during the day: when the one behind passes
  midnight (or wakes up after a night in bed), the day numbers differ by exactly 30 and the usual "🕰️ Same time as your friends" jump
  happens. Only friends 31 or more whole days apart stay apart for good. (Tested: day 500 at 23:59 and day 531 at 11:59: ignored;
  after midnight 501 vs 531: joins day 531.)
- Ignored friends play on normally: you see each other, chat, play football, visit houses. Only the clock is not shared.
- Two players 31 days apart: each keeps their own day and time. Everything with hours uses each player's own clock: shops open or
  closed, pizza hours, the Pet Show (one may have Saturday, the other not: each sees their own stage), sky and street lamps (one
  may see day while the other sees night), beds. Nothing breaks; it can just look odd to stand together while one says "closed".
- Chains still work: a friend within 30 days pulls you forward, and then anyone within 30 days of your new day can pull you again. So
  a group of players, each close to the next, still ends on the furthest day; only a lone far-away save can't drag everyone.
- The friend far ahead also doesn't count the one far behind for bed (more than 30 apart either way), so neither blocks the other.
- When a far friend becomes 30 days ahead (your midnight), you join them when their clock is next sent (every 5 game minutes while
  they play: a few real seconds), not at the exact moment. Not worth more code.

## Glitches found and not fixed
- Players on an older version (before tonight) keep the old rule: they are pulled forward by anyone ahead, even 100 days. So a
  new-version player far ahead still pulls an old-version friend; a new-version player ignores an old-version friend far ahead.
  Each version follows its own rule; tested both ways, no errors, both still see each other. Goes away once everyone updates.
- An old-version player in bed still waits for a far-away friend (old rule), and can ring them: the far friend gets "Friends want to
  skip the night, waiting on you!" even if it is daytime for them. Old version only; rare.
- The last half hour of the show (19:30-20:00) is at dusk: the sky turns purple and the top bar shows 🌙. Looks cozy in the test
  picture, but it is new that the show runs into the evening.

## NOT VERIFIED (real devices, sound, feel)
- Two real devices 31+ days apart on the real Firebase (tested with two test pages on the check's pretend server).
- How the longer show day feels: 8:00-20:00 is about 8½ real minutes every Saturday (was about 6½).

## Try it for real (tick-box tasks)
- [ ] On a Saturday at 7:30 go to the Pet Show stage: "🏆 Pet Show starts at 8:00", no judges. After 8:00 the judges are there.
- [ ] At 19:50 you can still enter; at 20:00 the stage says "🏆 Pet Show is over for today" and the 🏆 next to the day goes away.
- [ ] 📅 Calendar on any day: Saturday, 8:00 to 20:00. At a Saturday midnight: "It's Pet Show day! ... from 8:00 to 20:00".
- [ ] Two devices less than 30 days apart, online together: the one behind jumps forward ("🕰️ Same time as your friends").
- [ ] Two devices 31+ days apart, online together: each keeps its own day, both see each other, and going to bed on one skips the
      night without waiting for the other. (31 game days is about 8 hours of play, so this one is easiest with a test save.)

## Morning questions (each already built in a sensible way: "built as X; or Y?")
- "More than 30 days" counts day numbers (31 days apart = ignored, even if it is only 30 days and a few hours). Built as day
  numbers; or compare exact time (more than 30 × 24 game hours)?
- Far-away friends don't count for "everyone in bed". Built like that; or should they still count (then you can wait in bed for a
  friend who is in the middle of their day)?
- The stage sign says "Every Saturday!". Built: unchanged; or add the hours ("Saturdays 8:00-20:00")?

## Quick check (the output, exactly as printed)
```
new claude 50920ad5440ba0a4220024149359765e · new web 18eb2b3cee43a77ede8da2abdf070a7a · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 134 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983227 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 46 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 377 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzhwsa11klay" -> "umuzhx7ukhhwst"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 65 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 57 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 311 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

B1 is the known false fail (a fresh random player id only): `python3 tools/b1.py runs/job04-a` -> `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7`.
The town crawl prints no result lines in a quick check; its stage file says: 96 things tapped, 0 dead, 0 stuck, 0 covered,
0 console errors, 0 layout issues (11 skipped "not available right now", the same as the starting version).
My own tests (two scripts in tonight's job 4 work folder): Saturday 7:59 closed, 8:00 open, 19:59 open, 20:00 closed, all texts say
8:00 to 20:00; two players 31 days apart keep their own days (both ways), 29 and exactly 30 days apart: the one behind joins;
old + new version together both ways: no errors, the old version keeps the old rule.
