# Job 5: Walkers notice you

Only `index.html` changed: the town walkers' code (`class Walker`: a new `notice()`, a few lines in `update()`, one small change
in their "Say hi"), plus these notes and 2 pictures (`tools/pictures-2/job05-walker-notices-you.png`: a walker walking across
turns, looks at you and waves; `job05-say-hi-from-further.png`: "Say hi" at 3.45 m). No new save fields, no new online fields,
nothing new drawn (no new meshes), the web part is untouched.

## Changes (item: old -> new)
- Walking towards a town walker: nothing happened until you were 2.2 m away, and then only the "👋 Say hi" button showed ->
  when you walk towards a walker (they are within 8 m, within about 35° of the way you walk, and you are getting closer),
  they notice you:
  - a little wave 👋 when they first notice you (no sound; the same walker waves again at most every 12 seconds),
  - they slow down smoothly to 42% of their speed, never to a stop (1.25 -> 0.53 m/s; walking home in the evening
    1.5 -> 0.63 m/s), and their steps get slower too,
  - they turn to you smoothly: while walking, the body turns up to about 34° away from their path (they keep walking along
    it, a bit sideways) and the head turns the rest (up to about 57°), so they look at you. A walker who is standing (taking a
    break, or waiting because you are in their way) turns all the way round to face you,
  - their "👋 Say hi" shows from 3.5 m (was 2.2 m). Tapping a walker on the screen works from a bit further too (5.7 m, was 4.4 m).
- You stop walking: they keep looking at you, slow, for 1.6 seconds (time for a small thumb to reach "Say hi"), then ease back
  to normal over about 0.8 s (speed, turn, head, "Say hi" reach) -> before there was nothing to ease back from.
- You turn and walk away: they ease back sooner (after about half a second).
- Saying hi: the walker jumped round to face you in one go -> they turn to you smoothly (about half a second), while their
  head keeps looking at you. The rest of saying hi is unchanged.
- Not changed: standing still, sitting, swinging, in a panel, in a cutscene or indoors, nobody notices you. Saying hi is the same
  as before (a "hello" line, a wave, they stop 3 s and face you, it counts for quests). Walkers going home in the evening,
  night owls, cars waiting for walkers, friends who follow you, shoppers inside shops: unchanged.

## Decisions I made
- "Walking towards" uses the way you WALK (joystick or W/A/S/D), not the way you look. You must be moving and the distance must
  shrink, so standing near a path or walking past someone does not make them slow down.
- Once they noticed you, they keep noticing while you walk more or less towards them (within about 53°, a bit wider than the
  35° to start, so steering wobbles don't switch it on and off), or while you are right next to them (within 2.5 m).
- Speed while noticing: 42% (the plan said 35-50%). Never 0: they keep walking. The old rule stays: a walker stops when you
  stand right in their way (closer than about 1 m), as before.
- Turning: the body turns at most about 34° away from the path so they keep walking along it; the head does the rest. Coming
  from behind, they look back over their shoulder (they can't turn all the way while walking).
- The friendly touch is only the wave (no sound, no floating text: "nothing noisy").
- Walkers walking home in the evening and night owls notice you too; they still get home (tested: a walker walking home in
  view noticed me, then walked on and got home the usual way).
- Cheap: a few sums per walker per frame, and only near you a little more; nothing new is created each frame. It is all inside
  the Walker code, so it merges easily with other jobs.

## Glitches found and not fixed
- They can notice you through a hedge, a fence or round a corner: there is no "can they see you" test (it would cost more each
  frame). Rare, and harmless (they just look your way).
- Old, unchanged: a walker who meets you standing on their path stops about 1 m in front of you and waits until you step
  aside; they never walk round you. Now, while they notice you, they at least face you while they wait.
- Old, unchanged: the waving arm also swings a little with the steps when someone waves while walking (shoppers already did
  this). It looks like an excited wave.
- "Say hi" still loses to something nearer or more in front of you (a door, the ducks), as before. Only the reach changed.
  The same goes for your own pet: if your pet catches up and stands right next to you when you stop, the button can switch to
  "Play with <pet>" although the walker is looking at you (seen once in a test). As before; the walker's 👋 can still be tapped
  on the screen.

## NOT VERIFIED (real devices, sound, feel)
- How it feels on a real iPad/iPhone with the joystick, and whether a 6-year-old notices the wave. Tested by script only:
  keys held, at 20, 60 and 120 frames per second (the noticing distances and speeds were the same).
- No sound was added, so nothing to hear.

## Try it for real (tick-box tasks)
- [ ] In town, walk straight at someone coming towards you: at about 8 m they wave, slow down and look at you;
      "👋 Say hi" shows at about 3.5 m.
- [ ] Walk at someone who walks across in front of you: they turn their body a little and their head more to look at you, and
      keep walking slowly along the pavement.
- [ ] Walk up behind someone: they slow down and look back over their shoulder.
- [ ] Walk at someone who is standing still (taking a break): they turn all the way round to you.
- [ ] Stop when "Say hi" shows: there is time to tap it (about 1.5 s before they start walking on normally). Tap it: the same
      "hello" as always, and the "say hi" quest still counts.
- [ ] Turn round and walk away: they go back to their normal walk after about a second.
- [ ] Stand still near a path: people walk past normally, nobody waves.
- [ ] Evening (about 19:00-21:00): someone walking home also notices you, and still goes home.

## Morning questions (each already built in a sensible way: "built as X; or Y?")
- The first-notice touch is a quiet wave only. Built as a wave; or also a soft "hi!" sound or a small 👋 above their head?
- They notice you also when you come from behind (they look back over their shoulder). Built that way; or only when you come
  from the front or the side?
- After you stop, they stay slow and looking at you for 1.6 s. Built as 1.6 s; or longer (e.g. 3 s) for little ones who are
  slower to tap?
- Speed while noticing: 42%. Built as 42%; or slower (35%) so it's more obvious?
- Your pet right next to you can take the button from a walker's "Say hi" (the nearest thing wins, as before). Built unchanged;
  or should a walker who is looking at you win over your pet?

## Quick check (the output, exactly as printed)
```
new claude ed08044896e317e271432e95f7a690ab · new web b104ca5bf91ed22e89c24039a9011849 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 0 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 93 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 682 after; grew: {"friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1279 pieces, 983227 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 38 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 236 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzldbie1ztqj" -> "umuzldliekad63"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 33 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 30 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_town: running]
[stage crawl_ipad-landscape_town: done in 205 s]
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

B1 is the known false fail (a fresh random player id only): `python3 tools/b1.py runs/job05-b` -> `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7`.
The town crawl prints no result lines in a quick check; its stage file says: 96 things tapped (walkers' "Say hi" included), 0 dead,
0 unreachable, 0 stuck, 0 covered, 0 console errors, 0 layout issues (11 skipped "not available right now", the same as the
starting version).

My own tests (scripts in tonight's job 5 work folder, iPad landscape unless said, pictures checked by eye, iPhone portrait too):
walking at a walker coming towards you: noticed at 7.9 m, full slow-down (0.53 m/s) by 5.8 m, "Say hi" from 3.49 m; walking at
one from the side: body 34° off the path, head about 30°, eyes on you, still walking; from behind: looks back over the shoulder;
a standing walker turns all the way round (118°); you stop: 1.6 s, then back to normal in 0.8 s; you walk away: back to normal
sooner; walking sideways past, standing still, or indoors: nobody notices; a walker walking home in the evening notices you and
still gets home; the same at 60 and 120 frames per second (noticed at 7.9 m, "Say hi" from 3.47 m); every one of the 24 walkers:
"Say hi" reached the way the crawl does it and tapped with a finger: 24 of 24 said hello and counted for quests; saying hi now
turns them smoothly (about half a second). No console errors in any test.
