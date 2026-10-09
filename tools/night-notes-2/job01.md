# Job 1: The Home Screen app updates itself

Only `index.html` changed: one new line at the top of the game script (the version number) and one new block of about 55 lines
after the "away or offline" part (search for `✨ updates`). Nothing above the game script, web part untouched, no save changes,
no new drawings, nothing new online. GitHub version only: inside Claude all of it stays off.

## Changes
- Version number: none -> `const COZY_BUILD=2026100901;` at the very top of the game script. **Make this number bigger on every
  update** (date + a 2-digit counter: 2026100901, 2026100902, 2026101001 ...).
- Title screen (GitHub version only): a small "Version 2026100901" label in the bottom right corner, so you can see which copy a
  device is running.
- Home Screen app on the iPad: kept its old copy until iOS felt like reloading it -> the game checks for a newer copy by itself:
  about 1 second after it starts, and every time the app comes back to the front (switching apps, Home button, iPad waking up,
  coming back from the app switcher; on a computer also when the window gets focus). At most one check every 20 seconds.
- How it checks: it downloads `index.html` again, past every cache (a "no-store" download with `?cz=<time>` on the address),
  finds the version number in it and compares. Bigger number = newer. Same number but a different game script = newer too (a safety
  net for an update where someone forgot to bump the number). A smaller number or a file without a number = never newer, so
  the app never jumps back to an older version. No internet, a 404, a wifi login page, a download that takes more than 25 s:
  nothing happens, it tries again next time.
- Newer while on the title screen (also the "You took a break" title): the game saves and reloads at once into the new copy
  (the Play button says "✨ Updating…" for that second and can't start the old game meanwhile).
- Newer while playing: a shiny button at the top right, under the round buttons: "✨ New Cozy Town update! Tap to get it"
  (yellow-pink, gently glowing, at least 56 px tall; on iPhones held upright it sits a bit lower, under the clock).
  It stays until tapped. It waits (hides) while a card is open (bag, phone, shops, Chef Blaze...), during the Pet Show, a lesson
  or other scenes, the pizza/designer tips, the clothes creator and the opening with Rosie; then it comes back. On short phone
  screens held sideways (iPhone landscape) it also steps aside while the action button (door, talk, ...) is up, because there
  is no room above that button; it is back as soon as you walk on.
- Tap the button -> "Getting the update… Your game is saved 💾": furniture you are holding while decorating goes back to your
  storage, the game saves (also your notepad and settings), the saved copy of the plain address is refreshed, and the new copy
  opens at a new address (`?u=...`, which the new copy tidies away at once). No internet at that moment -> a toast
  "📡 No internet right now. Try again in a moment!" and the button stays.
- After an update: the title says "✨ Cozy Town is updated!" (in place of the little tagline) and Play goes on with your saved
  game: same place, coins, house and furniture, pets, garden, clothes, skills, quests, job, and even a pizza you were carrying
  (same order, still in your hands, the timer goes on).
- Loop guard: at most one automatic reload per new version per session. If the server still hands out the old file after the
  reload (GitHub can take a few minutes), the old copy shows the button (on the title too) instead of reloading again. A tap on
  the button always tries again.
- Inside Claude: nothing at all (no check, no button, no download, no errors).

## Decisions I made
- The safety net compares the game script only (the big `<script>` with the game). A change ONLY in the page's look (the CSS
  at the top) without a bigger number is not noticed: always bump the number.
- After an update you land on the title and tap Play (not straight back into the game): the title says it is updated, and on
  the iPad the first tap also switches the sounds on. Nothing is lost: the game was saved right before.
- The button sits at the top right under the round buttons, where nothing else lives on iPad and iPhone (checked against the
  top buttons, the joystick, run/jump, the action button and its label, the decorate buttons, the left column).
  On iPhones held upright it sits under the clock chip (the clock chip is wider than the left column there).
- What a reload resets (exactly like closing and opening the app): friends walking with you go back to their day, a tennis
  rally or a football kick-about starts over (your best rally is already saved with every hit), sleeping together stops (you
  stand next to your bed). Scenes that cost something (Pet Show, claw machine, lessons) hide the button, so it can't be tapped
  in the middle of them.
- No checks while playing on and on (only at start and when the app comes back to the front), as asked. Each check downloads
  the game file once (about 280 KB compressed).
- Reloading on the title also happens on the "You took a break" title (the game saves first).
- Never in the Claude version, never on a computer file (`file://`), only on http(s).
- The version label is on the title only (not in Settings), so this job touches no shared screen code; it is small and covers
  nothing (checked on iPad and iPhone, normal and "took a break" title).

## Glitches found and not fixed
- Old glitch (not from this job): while decorating, furniture "in your hands" (being placed) is not in the save. If the app is
  closed or iOS throws it away at that moment, that piece is gone. The update button puts it back into storage first, but
  closing the app doesn't.
- The very first time, THIS version has to reach the iPad the old way (close the app fully and open it again, or wait), because
  older versions don't have the check yet.
- If the server sends the new file for the check but still the old file for the reload (the first minutes after an upload), the
  title shows the update button instead of the update. Tap it a bit later (or open the app again) and it works.

## NOT VERIFIED (real devices, sound, feel)
- A real iPad/iPhone Home Screen app with real GitHub Pages: iOS caching, how fast GitHub serves a new upload (usually 1–10
  minutes), the app coming back from the background. Tested only in Chromium with test copies (the test server answered the
  update check with a test file that had a bigger number, the same number but a changed script, an older number, no number, 404,
  offline and a wifi login page; 88 automatic checks, all passed, on iPad landscape/portrait and iPhone portrait/landscape,
  light and dark; pictures: `tools/pictures-2/job01-update-button-ipad.png`, `tools/pictures-2/job01-updated-title-ipad.png`).
- Android Home Screen apps and desktop browsers (should work the same; not tried on real devices).
- The tap sound and the glow animation on a real screen; whether kids notice the button.

## Try it for real (tick-box tasks)
- [ ] Upload this version to GitHub. Wait about 5 minutes.
- [ ] Get this version onto the iPad the old way once: swipe the app away in the app switcher and open it again from the Home
      Screen. The title must show "Version 2026100901" in the bottom right corner (no label = still the old copy: wait 10 minutes
      and try again). Play for a moment, note your coins.
- [ ] Make a tiny new version: in `index.html` change `const COZY_BUILD=2026100901;` to `2026100902`. Upload it, wait about 5 minutes.
- [ ] Title test: swipe the app away, open it from the Home Screen. It should start, then by itself reload once and show
      "✨ Cozy Town is updated!" above Play and "Version 2026100902" in the corner. Tap Play: same coins, same place, same house and pets.
- [ ] Play test: make version `2026100903`, upload, wait 5 minutes. On the iPad play the game, press the Home button (or switch to
      another app) and come back. The "✨ New Cozy Town update! Tap to get it" button shows at the top right. Open the bag: it
      hides; close the bag: it's back. Tap it: "Getting the update…", the title says "✨ Cozy Town is updated!", Play: nothing lost.
- [ ] Same play test with a pizza in your hands (pizza job): after the update you still carry it, same house.
- [ ] Same on an iPhone held upright and sideways (sideways: walk away from doors/people to see the button).
- [ ] Airplane mode on, open the app: plays normally, no message, no button, no error.
- [ ] Open the Claude version: plays normally, never shows the update button.
- [ ] After testing, keep counting up: the next real update gets the next number (e.g. 2026101001).

## Morning questions
- Checks happen only at start and when the app comes back to the front. Built that way; or should it also check every 15
  minutes during long play sessions (costs about 280 KB per check)?
- After the update tap you land on the title with "✨ Cozy Town is updated!" and tap Play. Built that way; or jump straight back
  into the game (then the iPad may stay silent until the first tap)?
- The button sits at the top right under the round buttons (under the clock on iPhones held upright). Fine; or somewhere else?
- The version number is bumped by hand. Built that way (plus the safety net for the game script); or should a little tool bump
  it on every upload?
- The title shows a small "Version 2026100901" in the corner. Built that way (handy to see which copy runs); or hide it, or move
  it into Settings?

## Firebase
Not needed (no new database paths, no new rules).

## Quick check
`SRC=<worktree>/index.html quick.sh job01-c files,counts,saves,players,claude,crawl_ipad-landscape_hud,pc_keys`

```
new claude 49bd5e31846cc6bf4987896383d952e0 · new web e53205e0c4c55eb6d737c177e3574917 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 105 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 676 after
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1278 pieces, 1010297 triangles in total | for information, seen from 5 spots: city 153 draws; home 34 draws; market 45 draws; cafe 54 draws; school 44 draws
[stage saves: running]
[stage saves: done in 285 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzf8aw8bnho3" -> "umuzf8u1ozb6er"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 40 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 44 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 364 s]
[stage pc_keys: running]
[stage pc_keys: done in 50 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 6.4 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```

`python3 $SP/tools/b1.py $SP/runs/job01-c`:

```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```

The crawl stage prints no line of its own in a quick run; its stage file says: 145 buttons tested, 0 dead, 0 unreachable,
0 stuck, 0 covered, 0 browser errors, 0 layout findings. All stages together: 0 browser errors, 0 outside requests.
A2 fails as expected in a quick check (no backup given); B1 is the known pid-only false fail.
