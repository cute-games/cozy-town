# Job 9: Football friends

Only `index.html` changed (the game script; the web part and lines 1-498 are untouched) + these notes + 5 pictures in `tools/pictures-2/`.
New save field (optional): `fb` = `{w: your wins, c: the day you last got win coins, m: 1 once you met Zac}` (only made when you first talk to
Zac or finish a match). New online fields: none. The kids live in your own game only.

## Changes (item: old -> new)
- Football field from 14:00 to 19:00: empty -> four football friends with name tags:
  - **⚡ Zoomy Zac**, the star (an original character): royal-blue shirt with a big gold **10** on his back, gold sleeves and gold boots,
    white shorts, a white sweatband, a sparkly grin. Catchphrase: **"Zoom zoom, GOAL!"**. Goal dance (only for his own goals): he spins,
    throws both arms up and hops, with a 🕺 floating up.
  - **Tilly** (sky-blue shirt, red ponytail), **Omar** (coral shirt, curly hair), **Bea** (pink shirt, pigtails). Kid-sized (a bit smaller
    than grown-ups).
- They come at 14:00 from their homes (Zac, Tilly and Omar live in the houses east of the field, Bea in the west flats) along the
  sidewalks the townsfolk use, through a gap next to the scoreboard. If you watch, you see them walk in; if nobody sees it, they are simply
  there. At 19:00 they walk home the same way and disappear once out of sight (sunset). Gone at night.
  When they arrive and you are in town: "⚽ The football friends are at the field until 19:00. Come and play!"
- **On their own** they play 2 vs 2 with the town ball: Blue (Zac + Tilly) against Pink (Omar + Bea). They run to the ball, dribble, pass,
  shoot (sometimes wide), cheer (arms up and a hop) and the **scoreboard shows their game**. First to 3 goals, then they rest on the bench
  with juice for about 20-30 seconds and start a new game.
- **When you walk onto the field** while they play, Zac waves and a card opens: "Hi! I'm Zoomy Zac! ⚡ These are my football friends: Tilly,
  Omar and Bea. Do you want to take the field, or a 1 vs 1?" (later: "Hi <your name>! Do you want to take the field, or a 1 vs 1?") with
  **⚽ Take the field**, **🥇 1 vs 1 with Zac**, **🧃 Can I practice?** and **Maybe later**. Your wins (🏆) show on the card once you have
  some. While the card is open the kids stop and look at you. It opens by itself once per visit; any time you can tap a kid
  ("⚽ Talk to the team", E on a computer).
- **⚽ Take the field** (short fade): you and Zac are BLUE against Omar and Bea (PINK); Tilly cheers from the bench with a juice box.
  You start a few steps from the ball facing your goal; a whistle; the kids wait 2 seconds so you get the first touch.
  First to 3 goals, or after 3 game hours (or at 20:00 at the latest).
- **🥇 1 vs 1 with Zac**: you against Zac (first to 3); Tilly, Omar and Bea cheer from the bench.
- During a match: a pill at the top left "⚽ Blue 1 – 0 Pink" (1 vs 1: "🥇 You 1 – 0 Zac") with **✋ Stop**, the scoreboard shows the match,
  and a sign **"🎯 Score here!"** hangs over the goal you shoot at (the east goal; you are always Blue). Leaving the field (9 m away), going into
  a building, or tapping Stop ends the match kindly. After a full match Zac's card: "Hooray! We won 3 – 1! 🏆 You're a real football star!" /
  "You beat me 3 – 2! 🏆 Wow, you're super fast!" / "A draw, 1 – 1! Everybody wins today! 🤝" / "Zoom zoom! I won 3 – 1 this time. You played
  great! 💪", with ⚽ Play again and Bye bye! (after 19:00: "Now it's time to go home. See you tomorrow! 👋" and no Play again).
- **🧃 Can I practice?** -> "⚡ Zoomy Zac: “Sure! We need a juice break! 🧃” The field and the ball are all yours!" The four walk to the team
  bench across from the scoreboard, sit down and drink from tiny juice boxes (each kid's own colour, with a straw; every few seconds one lifts
  the box for a sip, with a soft slurp when you are close). The field is yours: your goals count on the normal scoreboard, and the kids cheer.
  At the bench: **"🥇 Invite Zoomy Zac to a 1 vs 1"** (tap Zac) starts the 1 vs 1; the others say juice lines ("Mmm, apple juice! 🧃",
  "Show us your best kick! ⚽"...). When you leave the field for 12 seconds the break is over and they play again.
- Kind for little players:
  - The other side never takes the ball away while you are dribbling it (a touch in the last ~1.2 s and the ball close to you): they wait a
    couple of metres in front of their goal instead. If you stop, they go for the ball.
  - The kids are a bit slower than you walking (you also run); the other side runs 10 % slower in a match.
  - Your team-mate passes to you a lot (Zac in Take the field: 3 out of 4 times when you are free), saying "Here you go! ⚽" / "Your turn! 👟".
  - Zac sometimes gets tired for 2-3 seconds (💦, slower) and about one shot in four goes wide ("Oops! 😅", "Whoops, too wide! 🙈").
  - You score: "⚽ GOAL! What a shot! 🌟" (or "Super goal! ⭐", "Wow, you did it! 🎉", "High five! 🙌"), said by a friend with a speech bubble.
    The other side scores: Zac says "Nice try! We'll get the next one! 💪". Your own goal: "😅 Oops, the wrong goal! That's okay!".
- Rewards: each goal you score +5 Sports XP and the "Score a goal" quest (as before); a finished match +6 Sports XP; a win +10 🪙 (only the
  first win of each day). Your number of wins is saved (`fb.w`).
- New: the **team bench** (two park benches side by side) on the far side of the field, across from the scoreboard, facing the field.
- "🔄 Start a new match" at the scoreboard: always there -> hidden while the scoreboard shows the kids' game (it would reset the other score,
  which you can't see then). It is back during their juice/rest breaks and when they are gone.
- Online: the kids are only in your own game (each player has their own four). When a friend online comes within 10 m of the field, the kids
  stop, sit on the bench and cheer ("A friend is here! We'll cheer! 📣"; their card says "Your friend <name> is here! Play together! We'll
  watch and cheer for you! 📣"); a friend's goals make them cheer too. A match with you ends kindly ("👋 A friend came to the field! Play
  together! 😊"). They play again 3 seconds after the friend leaves. The kids' goals never change the shared score (`S.match`), so friends
  never see wrong "… scored" messages.
- Short phone screens (iPhone sideways): the notepad hides while a football match is on, so the left column (score pill, map, tasks) fits.
- Two new little sounds: a kick-off whistle and a juice sip.

## Decisions I made
- The star's name: **Zoomy Zac** (original, fits the catchphrase "Zoom zoom, GOAL!"; no real player is called that). The other three names
  are not used anywhere else in the game.
- **One ball**: the kids play with the town's shared ball (no second ball on the field, less confusing for little kids). To never fight a real
  player for it, they only kick it when no friend online is near the field (10 m around it); then they sit and watch.
- When you are far away (more than 75 m from the field) the kids pause (nobody can see them): no kicks, so the shared ball stays still
  online and costs nothing. When you come back they go on.
- Their own game shows on the scoreboard, but their goals are counted separately: the shared online score (`S.match`) is never touched.
  When they stop playing (juice, rest, watching, gone) the scoreboard shows the normal score again.
- **Take the field: the star plays on your team** (you + Zac against Omar + Bea), so it feels friendly and Zac passes to you. Tilly sits out
  and cheers. (The brief allowed either; see Morning questions.)
- **You are always BLUE** and shoot into the east goal with the 🎯 sign (in the 1 vs 1 Zac plays for Pink, even in his blue shirt).
- Match length: first to 3 goals, or 3 game hours, or 20:00 at the latest. A match started before 19:00 may go on after 19:00; then the kids
  go home. You can't start a new one after 19:00.
- The card opens by itself when you walk onto the field while they play (once per visit; you must go 14 m away from the field before it can
  open again). Not when a game is loaded right on the field, not while you carry a pizza, and not during cards, lessons or tips.
- Juice break: ends 12 seconds after you leave the field (+8 m), or at 19:00.
- Rewards are small: +10 🪙 only for the first win each day, +6 Sports XP per finished match.
- Cheap drawing: the four kids are built like the townsfolk (merged), the juice boxes are tiny and only shown while sitting, the "10" and the
  sweatband are a few boxes merged into Zac. Kids further than 55 m from you are not drawn. The two benches are merged into the town scenery.
- The bench is a bit west of the middle (x -26.6), so it does not touch the bush that already grows behind the south line.
- The bench's colliders are added after the town's nature scatter, so not one tree, bush or flower in town moved.

## Glitches found and not fixed
- The ball rolls through the kids' legs (they don't block shots); a kid standing in the way does not stop your shot.
- On their way home/to the field the kids cross roads on the crosswalks like the townsfolk do; cars don't stop for them (same as townsfolk).
- Pets and friends who follow you can wander onto the field during a match (they don't touch the ball).
- A friend online who is further than 10 m from the field but looks at it sees the ball move by itself while your kids play.
- The tennis score pill (night 1) has the same problem on iPhone sideways (it pushes the notepad below the screen); not touched here.
- The game's welcome toast (and other toasts) can cover the card's buttons for a few seconds on an upright iPhone (game-wide toast spot).
- In an automatic crawl between 14:00 and 19:00: after "⚽ Take the field" starts a match, the crawler can't reopen the card for its other
  buttons ("unreachable", not "dead"): the kids are busy in the match. The kit's town crawl runs from about 8:20 to 11:20, so it never meets them.

## NOT VERIFIED (real devices, sound, feel)
- On a real iPad/iPhone: how a match feels for a 5-6 year old (too easy? too hard?), whether the kids' running looks natural, the card size.
- Sounds: the whistle and the sip were never heard.
- Real Firebase with two players at the field (tested with the kit's fake server: an old-version friend came to the field, the kids sat
  down, did not kick, cheered the friend's goal and went back to playing when the friend left; no errors on either side).
- Old saves: all fixtures load (quick check B1, see below).

## Try it for real (tick-box tasks)
- [ ] Go to the football field (south of the park) between 14:00 and 19:00: four kids play 2 vs 2 and the scoreboard counts their goals.
- [ ] Watch Zac score: "Zoom zoom, GOAL!" and his spin dance with 🕺. Walk behind him: a gold 10 on his back.
- [ ] Walk onto the field: Zac's card opens. Tap "Maybe later": it does not open again until you leave and come back.
- [ ] Tap "⚽ Take the field": you and Zac against Omar and Bea, Tilly cheers on the bench. Does Zac pass to you? Score 3 goals.
- [ ] Dribble the ball: the other side waits and doesn't steal it. Stand still with the ball: after a moment they take it.
- [ ] Win: +10 🪙 the first time today; win again: no coins, still a nice card. Lose or draw: kind words.
- [ ] "🥇 1 vs 1 with Zac": can a kid beat him? Does he sometimes get tired (💦) or shoot wide?
- [ ] "🧃 Can I practice?": the kids walk to the bench, sit and sip juice. Score a goal: they cheer. Tap Zac: "Invite Zoomy Zac to a 1 vs 1".
- [ ] Walk away during the juice break: after ~12 seconds they play again.
- [ ] Stay until 19:00: they walk home along the sidewalk (sunset). After 19:00 a match can't start.
- [ ] iPhone sideways during a match: the score pill and ✋ Stop fit, the notepad is hidden until the match ends.
- [ ] Two players online: when a friend comes to the field, your kids sit down and cheer; when the friend leaves, they play again.

## Morning questions (each already built in a sensible way: "built as X; or Y?")
- In "Take the field" Zac plays **on your team**; or should he play against you (you + Tilly vs Zac + Omar)?
- The card **opens by itself** when you walk onto the field (once per visit); or only when you tap a kid?
- When you join, the kids are **kind** (they never steal the ball while you dribble); is it too easy? Should they tackle sometimes?
- Win reward **+10 🪙 once a day**, +6 Sports XP per match; more, less, or a sticker/trophy in your house?
- They **sit and watch when a friend online comes** to the field; or should two online friends play together with (shared) kids? (A bigger job.)
- The kids arrive at 14:00 and leave at 19:00 **every day**; or only on some days (e.g. not on Pet Show Saturday)?

## Quick check (the output, exactly as printed)
`SRC=/home/user/wt/job09/index.html $SP/tools/quick.sh job09-q1 files,counts,saves,players,claude,crawl_ipad-landscape_town`

```
new claude 5ef30dbcf9c6407937f75f99769d7231 · new web 2e6dceba98eba2624d3a0bdfe24cc7b8 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 2 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 147 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983515 triangles in total | for information, seen from 5 spots: city 138 draws; home 34 draws; market 38 draws; cafe 48 draws; school 44 draws
[stage saves: running]
Task exception was never retrieved
future: <Task finished name='Task-209' coro=<Channel.send() done, defined at /usr/local/lib/python3.13/dist-packages/playwright/_impl/_connection.py:61> exception=TargetClosedError('Channel.send: Target page, context or browser has been closed')>
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
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzkd7edhka6z" -> "umuzkdihbcsguw"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 65 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 56 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 319 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

Notes on the result:
- A2 FAIL: normal for a quick check (no backup given).
- B1 FAIL is the known false fail (old saves without `pid` get a new random player id); `python3 $SP/tools/b1.py $SP/runs/job09-q1` says:
  `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7`
- The "Task exception was never retrieved … TargetClosedError" lines come from the check kit closing a test page (they also appear in other
  builders' quick checks); the saves stage recorded no browser errors.
- crawl_ipad-landscape_town prints no lines in a quick check; its stage file says: 96 tested, 0 dead, 0 unreachable, 0 stuck, 0 covered,
  0 layout issues, 0 browser errors (the crawl runs from 8:20 to 11:20 game time, before the kids come).
- My own extra tests (all without browser errors): kids arrive/play/score/rest; the card on walking onto the field; Take the field (win 3-1,
  +10 🪙 once, S.match untouched); juice break (walk to the bench, sit, sip, cheer for your goal on the normal scoreboard); Invite Zac at the
  bench -> 1 vs 1; Zac scores; going home at 19:00; a 1 vs 1 started at 18:54 ends at 20:00 (no Play again); an old-version friend at the
  field (kids sit and do not kick; cheer the friend's goal; play again after the friend leaves); a crawl of the kids and the card at
  15:00 (no dead taps); layouts on iPad landscape, iPhone portrait and iPhone landscape in light and dark: 0 issues; PC: E opens the card,
  Escape closes it. Draw calls at the field: 411 without the kids, 461 with them (only when you are near the field).
