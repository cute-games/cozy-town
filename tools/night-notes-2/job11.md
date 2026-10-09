# Job 11: Move my game between devices

Only `index.html` changed: a new block of about 140 lines right after the Settings code (search for `📦 Move my game`), one new
row in Settings, and two tiny safety lines in the save code (`SAVEOFF`). Nothing above the game script, web part untouched,
no save fields added or changed, no drawings, nothing new in the online presence. GitHub version only: inside Claude there is
no button and nothing touches a database (the Claude version already keeps the save with the player's claude.ai account).

## Changes
- Settings: nothing -> a new row "📱 Other device · 📦 Move my game" (in the game and on the title screen, so a new iPad can
  get a game before ever playing). It only shows when the database allows moving (see Firebase below).
- "📦 Move my game" card: two big buttons, "📤 Send my game from this device" and "📥 Get my game on this device" (side by side
  on a phone held sideways, so the card fits), a one-line how-to and "⬅️ Back" to Settings.
- Send: the game is saved first (furniture in your hands goes back to storage first), then a 6-letter code shows in big
  coloured letter tiles (the logo's colours) with a countdown "⏰ 9:59 left" and "There: ⚙️ Settings → 📦 Move my game →
  📥 Get my game. Keep this card open until your game has moved." + "✋ Stop sending".
  When the other device takes the game: "🎉 Your game moved! Your other device has your game now. Have fun! 💗" (+ a short note
  that coins earned on one device stay on that device). After 10 minutes: "⏰ The code ran out of time" + "🔄 Make a new code".
- Get: a big text box for the 6 letters (capital letters by itself, 32-38 px, no autocorrect) + "📥 Get it!". Then a check
  card: the game's name, 🪙 coins, 📅 day and 🐾 pets, and "This will replace the game on this device (name, 🪙 coins)."
  (or "This will be the game on this device." on a new device) + "✅ Yes, move it here" / "Cancel".
  Yes -> "📦 Moving your game… Here it comes!", the page starts again (exactly like opening the game) and the title says
  "📦 Your game is here, <name>! Tap Play 💗". Play -> "Welcome back, <name>!" with the same coins, house, furniture
  (upstairs too), wall/floor, garden, pets, clothes, skills, quests, job, beach/tennis, Friends Lane lot.
- Kind messages: "Type all 6 letters 🔤", "Hmm, that code doesn't work. Check the letters and try again! 🔍",
  "⏰ That code ran out of time. Make a new one on your other device!", "📡 The internet is slow right now. Try again in a
  moment!", "⏳ Let's take a little break. Try again in a minute!" (more than 6 tries in a minute), "That is the code of this
  device! Type it on your other one. 😊", "🌱 There is no game on this device yet! Play first, then you can send it.".
- New safety net: the game that was on the device before a move is kept. "Move my game" then shows "↩️ Before the last move,
  this device had <name> (🪙 coins)." + a "↩️ Bring it back" button (same check card, "✅ Yes, bring it back"). It swaps, so
  nothing is ever lost by a wrong "Yes".
- Bug fix (Settings, old bug, also in the pre-night versions): "🗑️ Start a new game" while playing did not work: the page
  saved the old game again while reloading, so the old game came straight back. Now it really starts over (also inside
  Claude: the pending cloud save is cancelled too).

## Decisions I made
- Where it lives: `worlds/cozy-town/move/<CODE>` = `{s: the save (JSON text), at: server time, exp: at + 10 min, v: 1}`.
  The sender first checks that the code is free (picks another one if it is in use), then writes it.
- Codes: 6 capital letters from 19 letters without vowels (B C D F G H J K L M N P R S T V W X Z): no words can appear by
  accident, no I/O/Q to mix up, never the same letter twice in a row. About 35 million codes, made with the browser's secure
  random numbers.
- Times use the database's clock (the device's clock can be wrong), so both devices agree on "10 minutes".
- The code is taken down when: the other device takes the game; the code card closes (✕, "Stop sending", another card opens
  over it); 10 minutes pass; the game is closed with the code up (and once more on the next start, in case the first try
  never reached the server). A device that finds a code that ran out tidies it away too.
- While the code card is up, the "Still there? 👀" break card stays away (the child is busy typing on the other device).
- Both devices keep the game afterwards (it is a copy, like a photo of the game at that moment). Coins earned later on one
  device stay there; "Move my game" again any time.
- The moved-in game is written to the same save place as always and the page restarts: the normal "open the game" path,
  nothing mixed. While this happens the page saves nothing more (`SAVEOFF`), so the old game can't sneak back.
- A game from another device is cleaned before use: the characters < > " (straight quote), the backtick and the backslash,
  and the text "url(", are removed from every text in it (no real save has them), so a made-up "game" can't put code into the
  page. A name like "Cupcake<3" arrives as "Cupcake3".
  It must also look like a Cozy Town save (a name, coins, house/bag/look/pets of the right kind) and be at most 60,000
  characters (a big real save is about 3,000).
- At most 6 tries a minute (send or get, on this device); codes with letters that are never used are refused without
  asking the database.
- The button only appears after a little test at start: read one random (empty) code and "delete" it (writes nothing).
  If the database refuses either, the button never shows, like the ideas board. If the database refuses later (a send or a
  get), the card closes with "📦 Moving games is resting right now. Try again later!" and the button goes away.
- Inside Claude: no button, no database, no errors (checked).

## Glitches found and not fixed
- Playing the same game on two devices at the same time: each sees the other as an online friend with the same name
  ("<name> is here!"), and Friends Lane gives the second one the next free lot. Nothing breaks; it is a copy, not a sync.
- On a sideways iPhone, an "X is here! Open Friends…" message can sit over the lower part of the Settings card for a few
  seconds (job 3's message placement finds no free spot next to a card that fills the screen). It does not take taps.
- Notepad pages and the Settings choices (sound, look speed, graphics) are per device and are not moved (they are not part of
  the save).
- If the other device takes the game in the very last seconds of the 10 minutes, the sending device may say "ran out of time"
  although the game did arrive. Harmless.

## NOT VERIFIED (real devices, sound, feel)
- The real Firebase database: only tested with the check's pretend server. Without the rule below the button stays hidden.
- Real iPad/iPhone: the keyboard (capital letters, the card staying above the keyboard), the restart after "Yes, move it here"
  in the Home Screen app, how readable the letter tiles are from a child's distance.
- A slow or dropping internet in the middle of sending or getting (the "internet is slow" messages).
- Sounds (pop when the code is ready, yay when it moved).

## Try it for real (tick-box tasks)
- [ ] Paste the Firebase rules below. Open the game: Settings ⚙️ shows "📱 Other device · 📦 Move my game".
- [ ] iPad 1 (with your game): Settings → 📦 Move my game → 📤 Send. A 6-letter code with a 10-minute countdown shows.
- [ ] iPad/iPhone 2: Settings → 📦 Move my game → 📥 Get → type the code → Get it! → check name, coins, day, pets → ✅ Yes, move
      it here. The game restarts: "📦 Your game is here, <name>! Tap Play 💗". Play: same coins, house, furniture, pets, garden.
- [ ] iPad 1 now says "🎉 Your game moved!".
- [ ] A wrong code: kind message. Wait 10 minutes with a code up: "⏰ The code ran out of time".
- [ ] On device 2: Settings → Move my game → "↩️ Bring it back" brings back the game that was there before (and again swaps back).
- [ ] Also from the title screen (Settings button under Play), on a new device with no game yet.
- [ ] While playing: Settings → 🗑️ Start a new game → tap again: the game really starts over (it used to come back).
- [ ] The Claude version: no "Move my game" in Settings.

## Morning questions (each already built in a sensible way)
- The code stops when its card is closed ("Keep this card open until your game has moved"). Or keep it alive the full
  10 minutes even after closing the card?
- After "Yes, move it here" the new device shows the title ("Your game is here! Tap Play"). Or jump straight into the game?
- Both devices keep the game (a copy). Or should the sending device lock its copy / start fresh after a move?
- "↩️ Bring it back" keeps one game from before the last move. Keep it, or drop it to keep the card simpler?
- Codes have no vowels (no words by accident). OK, or any letters?
- Limit 60,000 characters per game (real saves are about 3,000). OK?

## Firebase (paste-ready rules: players online + ideas board + move my game)
Without the `move` part the "Move my game" button stays hidden. In the Firebase console -> Realtime Database -> Rules, this is
everything the game uses: players online (`$world/peers`, as the game writes them today), the ideas board (`board`, night 1's
rule, unchanged) and Move my game (`move`, new). If your rules today are different for the players part, keep your own
`peers` lines; if the database also holds other apps' data, keep their rules next to `worlds`.
```json
{
  "rules": {
    "worlds": {
      "cozy-town": {
        "$world": {
          "peers": {
            ".read": true,
            "$peer": { ".write": true }
          }
        },
        "board": {
          "notes": {
            ".read": true,
            "$note": {
              ".write": "!data.exists()",
              ".validate": "newData.hasChildren(['t','n','at','p'])",
              "t": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 100" },
              "n": { ".validate": "newData.isString() && newData.val().length <= 24" },
              "at": { ".validate": "newData.isNumber() && newData.val() <= now" },
              "p": { ".validate": "newData.isString() && newData.val().length <= 30" },
              "h": {
                "$pid": {
                  ".write": true,
                  ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 3"
                }
              },
              "$other": { ".validate": false }
            }
          }
        },
        "move": {
          "$code": {
            ".read": true,
            ".write": "!data.exists() || !newData.exists() || data.child('exp').val() < now",
            ".validate": "$code.length == 6 && $code.matches(/^[A-Z]+$/) && newData.hasChildren(['s','at','exp','v'])",
            "s": { ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 60000" },
            "at": { ".validate": "newData.isNumber() && newData.val() <= now" },
            "exp": { ".validate": "newData.isNumber() && newData.val() > now && newData.val() <= now + 660000" },
            "v": { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        }
      }
    }
  }
}
```
What the `move` part allows: anyone who knows a code can read it (nobody can list the codes); a code can be written only when
it is free (or has run out), never changed; anyone with the code can delete it (used / closed). It must be 6 capital letters,
hold a save of at most 60,000 characters, the server's own time, and run out within 11 minutes. (`$code.length == 6 &&
$code.matches(/^[A-Z]+$/)` means the same as `^[A-Z]{6}$`.) The game checks that it may read and delete under `move` when it
starts; with these rules that test passes and the button shows.

## Quick check
`SRC=/home/user/wt/job11/index.html quick.sh job11-b files,counts,saves,players,claude,crawl_ipad-landscape_hud,pc_keys`
(the file checked is exactly the committed index.html, md5 7a95c127cd067a68d9b33472f7b8112a)
```
new claude ec94a29cd399b90b0cb1f23f496b3287 · new web 7a95c127cd067a68d9b33472f7b8112a · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 93 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 683 after; grew: {"places": "20 -> 21", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1304 pieces, 986956 triangles in total | for information, seen from 5 spots: city 126 draws; home 34 draws; market 39 draws; cafe 46 draws; school 44 draws
[stage saves: running]
[stage saves: done in 217 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzsyic3snorp" -> "umuzsyub3qd9jd"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 34 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 28 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 306 s]
[stage pc_keys: running]
[stage pc_keys: done in 29 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
B1 check (`b1.py`), as printed: `B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7` (tonight's known false fail: only the random player id differs).
A2 "no backup given" is normal for a quick check.

The crawl stage prints no summary line in a quick check; from its stage file: 150 taps tested, 0 dead, 0 stuck, 0 covered,
0 unreachable, 0 layout issues, 0 browser errors; "📦 Move my game" was opened from Settings 5 times (all fine).

My own tests (scripts in the scratchpad, two pages sharing the pretend server): send on one device, get on the other (iPad,
iPhone upright and sideways, light and dark): same coins, house, furniture, pets, garden, clothes, skills, quests on both;
the code is gone from the server afterwards. Also: send from the title screen and get on a brand-new device; close / stop /
another card / time-out all take the code down; wrong, short, made-up and run-out codes; 6 tries a minute; the database
saying no (read, write, both, and later on a send): no button / kind message; no answer at all (slow internet): kind
messages, nothing stuck; tapping Send again during a slow send; "Still there?" stays away while a code is up; a made-up
game full of HTML tricks (cleaned, nothing ran); "Bring it back" both ways; "Start a new game" while playing; the game
closed with a code up; the Claude version (no button, no errors). Zero browser errors in all of them.
