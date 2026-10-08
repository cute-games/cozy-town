# Job 12 (move my game part): Glitch hunter, pass 2 — fixes

Only `index.html` changed, plus 13 before/after pictures `tools/pictures-2/glitch2-M01…M11b-*.jpg` (left = **before**, right = **after**,
same recipe on both). The "before" of M01–M08 is the inspector's copy of job 11 (`glitch2/game-j11.html`), the "before" of M09–M11b is the
inspector's own picture of the starting copy (`glitch2/game.html`, the same recipe run on my file for "after"). The first 498 lines of the page
(head, CSS, HTML) are byte-for-byte the same; the web part is untouched (WEBPART-ROUNDTRIP: identical). No save fields, no online (presence)
fields and no lists changed; nothing drawn in 3D changed.

What I fixed: the 8 findings about "📦 Move my game" (`glitch2/findings-j11.md`) and, as asked later, findings 5 and 8 of
`glitch2/findings-main.md` (messages on the arrow bar / use-button words, messages on open cards). Most of it is one improved rule for all
messages (toasts), job 3's rule made smarter, not special cases.

## Changes (item: old -> new)

**The message rule (job 3's toasts), improved for everyone** (`toast`, `toastShow`, `toastPump`, `toastFit`, `toastPlace`, `keepClear`)
- **One message at a time, each readable.** Old: a new message pushed the one on screen away at once. New: it waits until the one on screen had
  time to be read (1.6 s, longer for long words: 0.05 s per letter, never longer than the message itself). The answer to a NEW tap or key still
  shows at once (tapping again and again keeps answering right away), and the same words again just stay longer (no copies in the line).
- **News waits while a card fills the screen.** News = a message that is not the answer to your own tap (a friend came, you are online, a bus
  message, a message from before the card you opened). Old: it was drawn on the card for 3 s (covering buttons). New: when the open card leaves
  no free spot, it waits and comes when the card closes; news that waited 30 s is old and is skipped. If a card opens over a message, the
  message steps aside and comes back after. On an iPad there is room beside the cards, so nothing changes there (the message goes beside).
- **On a phone, the free middle.** Old: with no free spot, a message sat on the pink arrow bar or the use-button words. New: it tries a narrower
  box (16 px words, 2–4 lines) in the free middle under the top row, between the left column (arrow bar, map, notepad) and the use button.
  The arrow bar now counts as much as the use button (it shows the way).
- **The answer to a tap on a card that fills the screen** goes right above what you tapped (left of the card's own buttons like 🪙 and ✕),
  or under it; on the map, above the spot your finger tapped. Old: at the card's top or bottom edge, on items, the title or the map's info line.
- A card's name tag that sticks out (Zoomy Zac, people talking) counts as part of the card. While a message is up, it moves if a card closes
  or the use button / arrow bar appear under it. Messages never sit under the on-screen keyboard (they use the part of the screen you see).
- The check's chat test still works: `window.__lastToast` is set the moment a message is sent, also when it waits.

**Move my game (job 11) — findings-j11**
- **1 (big-ish) Get my game on a sideways iPhone with the keyboard up** (M01 `glitch2-M01-get-card-messages-above-keyboard.jpg`): every message
  ("Type all 6 letters", "Hmm, that code doesn't work…", "ran out of time", "internet is slow", "little break") and "⏳ Looking…" were under
  the keyboard -> the line under the code box always scrolls into view above the keyboard (also on phones where the whole page gets shorter),
  without pushing the code box out of sight. While looking, the line says "⏳ Looking for your game…" (up to 9 s) next to the code box.
- **2 (medium) Messages on full-screen cards on phones** (M02 `glitch2-M02-news-waits-while-a-card-fills-the-screen.jpg`): "👋 X is here!", "🟢 You
  are online!" over Settings, the Move card, "🎉 Your game moved!", the Yes/Cancel of "↩️ Bring it back" -> they wait until the card closes
  (the message rule above), then come one by one.
- **3 (medium) "🗑️ Start a new game" wiped everything with a quick double tap, no way back** (M03
  `glitch2-M03-start-a-new-game-asks-first-and-keeps-the-game.jpg`): old: the 2nd tap on the same button (it said "Tap again to start over")
  erased the game. New: the button opens a card of its own: "🗑️ Start a new game?" with the game's name, 🪙, day and pets, "Your game goes
  away and a brand-new game starts. You can bring it back later in ⚙️ Settings." and "💗 No, keep my game" / "🗑️ Yes, start over" (in other
  places than the Settings button; a tap on "Yes" in the first 0.8 s doesn't count, so the second tap of a double tap does nothing).
  "Yes" keeps the game in the old-game place (`cozytown-save-old`, the same place Move my game uses), then starts over; the title then says
  "🌱 A brand-new game! Your old one is safe in ⚙️ Settings → ↩️ Bring it back." Settings shows a row "↩️ Your old game · ↩️ Bring it back"
  whenever a game is kept — in every version, also inside Claude and when the move database is off. Bring it back = the check card
  ("✅ Yes, bring it back"), it swaps the two games (nothing is lost) and works inside Claude too (the brought-back game is saved as "now", so it
  wins over the older copy in the claude.ai account; the claude.ai copy is not written while the page is restarting).
  Tested: double tap on the same spot, a quick tap on Yes, a slow Yes, title message, Settings row, bring back (web and Claude version).
- **4 (small) "Welcome back" replaced by "You are online!" after 5 ms** (M04 `glitch2-M04-welcome-back-stays-readable.jpg`): -> "Welcome back,
  <name>! 💗" stays, "🟢 You are online!" comes 1.6 s later (the message rule).
- **5 (small) "⏳ Looking…" too faint** (M05 `glitch2-M05-looking-button-full-colour.jpg`): the button was disabled (45 % see-through, contrast
  1.9:1) -> it keeps its full mint colour and dark words; extra taps are ignored by a flag on the button instead.
- **6 (small) Words for a 6-year-old** (M06 `glitch2-M06-words-ipad-or-phone.jpg`): "device" -> the name of the thing in your hands ("this iPad",
  "this phone", "this computer") or "your other iPad or phone":
  - Settings row "📱 Other device" -> "📱 Another iPad or phone"
  - "📤 Send my game from this device" / "📥 Get my game on this device" -> "… from this iPad" / "… on this iPad" (phone/computer)
  - "Open Cozy Town on both devices." -> "Open Cozy Town on both."
  - "On your other device, type this code:" -> "On your other iPad or phone, type this code:"
  - "There: ⚙️ Settings → 📦 Move my game → 📥 Get my game." -> "On the other one: ⚙️ Settings → …"
  - "Your other device has your game now." -> "Your other iPad or phone has your game now."; "Coins you earn on one device stay on that
    device." -> "Coins you earn on one of them stay on that one."
  - "Type the code from your other device:" -> "… from your other iPad or phone:"; "No code yet? On the device that has your game: …" ->
    "No code yet? On the one that has your game: …"
  - "This will replace the game on this device (…)" -> "… on this iPad (…)"; "There is no game on this device yet!" -> "… on this iPad yet!";
    "That is the code of this device!" -> "… of this iPad!"; "… on your other device!" -> "… on your other iPad or phone!"
  - "↩️ Before the last move, this device had X (🪙 N)." -> "↩️ Your old game X (🪙 N) is still on this iPad."
  - The two nearly equal "Hmm, that code doesn't work. Check the letters! 🔍" / "… Check the letters and try again! 🔍" -> one message.
- **7 (small) The bobbing ⬇️ "more below" arrow sat on buttons** (M07 `glitch2-M07-scroll-arrow-beside-the-card.jpg`): it sat on the corner of
  "📦 Move my game" (iPad) and on "📖 Show me the tips" (sideways iPhone) -> it sits on the card's right edge, half outside, next to the buttons
  (on an upright phone, where there is no room on the right: on the card's bottom edge). It is placed again when the card changes size.
  This changes every tall card, not only Settings; it also fixes the second half of main finding 29 (the ⬇️ sat on the Saturday time "9:40"
  of the bus timetable on a sideways iPhone: see the timetable row of M11).
- **8 (small) The sending device said "👋 <its own name> is here!"** (M08 `glitch2-M08-own-game-on-the-other-ipad.jpg`): a friend online with my
  own name and look = my own game open on another iPad -> "📱 Your game is open on your other iPad or phone too!" (and when it closes: "📱 Your
  other iPad or phone closed the game." instead of "👋 <my name> left.").

**Main findings (findings-main), asked for later**
- **5 (medium) On iPhones, messages on the arrow bar and the use-button words** (M09 `glitch2-M09-messages-beside-arrow-bar-and-use-button.jpg`,
  M09b `glitch2-M09b-messages-beside-arrow-bar-iphone-upright.jpg`): the gate's "🚌 The beach bus leaves from the park!…" covered "Find the
  beach bus"; "🚌 Oh no, the bus left!…" covered "🏠 My House: take the bus home first"; Zac's "Sure! We need a juice break!" was printed on
  "Invite Zoomy Zac to a 1 vs 1"; upright: on the arrow bar and map -> in the free middle between the left column and the use button (and it
  moves away if the use button appears under it while it is up).
- **8 (medium) Messages on open cards** (M10 `glitch2-M10-messages-not-on-the-map.jpg`, M11 `glitch2-M11-messages-not-on-shop-timetable-zac-cards.jpg`,
  M11b `glitch2-M11b-message-off-zacs-card-iphone-upright.jpg`): "🏡 Your house moved to Friends Lane…" over the big map's info line -> waits
  until the map closes; "💛 This spot is for a friend!" over the map's card title -> above the spot you tapped on the map; "Not enough coins yet!"
  over the Market's items -> above the item you tapped (over the card's title, left of 🪙 and ✕); a bus message over the timetable -> waits until
  the timetable closes; "⚽ The football friends are at the field…" over Zac's name tag -> above the tag.

## Decisions I made
- **News or answer?** A message sent while a tap/key is being handled (`window.event`), or together with a card that opens (within 0.1 s), is an
  answer; everything else is news. One tap that sends two messages: the second waits its turn. No call site had to change.
- How long a message stays before the next one may take its place: 1.6 s, or 0.05 s per letter for long ones (a 75-letter message gets 3.75 s),
  never longer than its own time. Messages that waited behind "Still there?" still show their full time one by one (job 3's choice, kept).
- At most 3 messages wait (the oldest goes, as before); a message that waited 30 s is skipped (old news). A message that steps aside for a card
  keeps its first time, so it is not shown much later.
- The answer next to what you tapped uses the button you tapped (not the word on it); for big things (the map) it uses the finger's spot and
  stays over that thing. It never covers the card's own header buttons; if there is no room above or below, it falls back to job 3's spot.
- Start a new game: only one old game is kept (the last one put away). Starting over twice in a row keeps only the second one — with the new
  "are you sure" card that should be rare. The old game is kept on the device (browser storage), like the game itself; inside Claude the
  claude.ai copy is still removed on a new start (as in job 11), so "Bring it back" uses the copy on the device.
- "This iPad / this phone / this computer": a touch screen smaller than 500 px on its short side is a phone, a bigger touch screen an iPad,
  no touch a computer (an Android tablet is called "iPad"; kids say that anyway).
- The "⬇️ more below" arrow is no longer drawn inside the card (`#card.more::after`); it is a small round badge `#moreHint` on the card's edge
  (not a button, it takes no taps). The `more` class on the card is still set, as a plain marker (no style uses it now).
- My own game online is recognised by the same name AND the same look (no new online field): a friend with only the same name still gets
  "👋 X is here!".
- "Yes, start over" only works right after "Start a new game" opened its card (the same `WIPE` switch as before): the morning check's robot,
  which taps every button, switches it off after tapping "Start a new game", so it can never erase its own test game ("No, keep my game" is
  a normal close button, which the robot skips). A "Yes" without the card answers "💗 Your game is still here!".

## Glitches found and not fixed
- A message that answers a tap made while a card fills the screen still covers a part of that card for its few seconds (now next to what you
  tapped, not on items or titles). Answers inside the card's own message line, as the inspector suggested, would need a line in every card.
- News that arrives within 0.1 s of a card opening counts as that card's answer and is shown with it (the old way). Rare.
- In the 3D world, kids' name tags still overlap the messages area sometimes, and Zac's speech bubble (a 3D tag) is cut by the minimap on
  iPhones (end of main finding 5; the football friends' tags are another fixer's part, findings 10/11).
- On an upright iPhone the Market fills the screen with 2 columns: "Not enough coins yet!" for the top-left item goes under it (above it
  would cover 🪙 and ✕), so it covers the next row's pictures for its 3.6 s (taps still go through).
- Messages are placed again when the use button's words change; walking past many things can move a message a little (only if it would
  cover the new words).
- Found while testing: the inspector's "W05" note (the Move card's "⬅️ Back" over the title's Play/Settings buttons) is the card lying over the
  title screen, as all cards do there; the same 4 notes were in job 11's run. Not changed.

Extra tests (scripts in the scratchpad, `work/job12m/`): the inspector's whole Move my game flow (send, get, wrong/short/slow/old codes,
6 tries a minute, bring back, new device, database says no), the long-name/wide-letter run and the misc run (Android-style keyboard, Escape,
closing with a code up, start over) on my file: 0 browser errors, the moved game equal on both sides; a 12-step test of the message line
(news, answers, two answers from one tap, same words, "Still there?", cards, old news, `__lastToast`) on a sideways iPhone, an upright iPhone
and an iPad; Start a new game + Bring it back in the web and the Claude version.

## NOT VERIFIED (real devices, sound, feel)
- A real iPhone keyboard (the test shrinks the visible screen like iOS does; also tested a page that gets shorter, like Android).
- `window.event` on real iPad/iPhone Safari (supported by Safari for years; if it were missing, every message would count as news: it would
  still show, only wait behind full-screen cards).
- Inside Claude with a real claude.ai account: the test room has no claude.ai storage, so "the brought-back game wins over the claude.ai copy"
  was checked by reading the code (the brought-back game gets the newest time; the copy is not written while the page restarts).
- How it feels: 1.6 s per message, news coming after a card closes, the badge on the card's edge.

## Try it for real (tick-box tasks)
- [ ] iPhone sideways: Settings → 📦 Move my game → 📥 Get my game, type 3 letters, tap Go on the keyboard: "Type all 6 letters 🔤" shows above
      the keyboard, under the code box. Type a wrong code: "⏳ Looking for your game…" then "Hmm, that code doesn't work…".
- [ ] iPhone sideways, Settings open, a friend starts the game: no message on Settings; close it: "👋 … is here!" comes.
- [ ] Settings → 🗑️ Start a new game: a new card asks first; double-tap the button quickly: nothing is erased. Tap "🗑️ Yes, start over": the
      title says your old game is safe; Settings → ↩️ Bring it back → ✅ Yes: your old game is back (coins, house, pets).
- [ ] Tap Play on the title: "Welcome back, <name>! 💗" is readable, then "🟢 You are online!".
- [ ] Send your game from iPad 1 to iPad 2 and play on iPad 2: iPad 1 says "📱 Your game is open on your other iPad or phone too!".
- [ ] iPad, Settings while playing: the ⬇️ badge sits on the card's right edge, not on "📦 Move my game".
- [ ] iPhone sideways at the old beach gate ("Find the beach bus"): the message sits between the arrow bar and the use button.
- [ ] Market with 0 coins on an iPhone held sideways: tap the apple: "Not enough coins yet!" shows above the apple, not on the other items.
- [ ] Inside Claude: Start a new game → Yes, play the opening, then Settings → ↩️ Bring it back: the old game is back, and still there after
      closing and opening the game again (the claude.ai copy).
- [ ] Big map, tap an empty lot on Friends Lane: the message shows above the spot you tapped.

## Morning questions (each already built in a sensible way)
- News waits while a card fills the phone screen (at most 30 s, then skipped). Built like that; or show it small at the top over the HUD?
- A message stays at least 1.6 s (longer for long words) before the next one. Built like that; or longer (2 s) for younger readers?
- Start a new game keeps only the last game put away. Built like that; or keep two (the last move and the last new start)?
- Settings shows "↩️ Your old game · Bring it back" whenever a game is kept (after a move too). Built like that; or only for a few days?
- The "are you sure" card ignores a "Yes" in its first 0.8 s. Built like that; or "hold the button" for a new start?

## Quick check (the output, exactly as printed)
`SRC=/home/user/wt/job12m/index.html quick.sh job12m-b files,counts,saves,players,claude,crawl_ipad-landscape_hud,pc_keys,teacher_iphone-landscape`
(the file checked is exactly the committed index.html, md5 0e966618b68f34b3a28b610200933d22; teacher_iphone-landscape added because
job 3 checked its class messages with it and the message rule changed)
```
new claude 2d443b3176e7ce33cfbab735e53c72b3 · new web 0e966618b68f34b3a28b610200933d22 · WEBPART-ROUNDTRIP: identical
[stage files: running]
[stage files: done in 1 s]
    PASS | A1 newest live versions read right before the check | live-claude.html read on 2026-10-08, live-web.html read on 2026-10-08
    FAIL | A2 dated private backup of the live game | no backup given
    PASS | F3a live GitHub version = live Claude version + web part, nothing else | 54 added lines in 2 places, no lines removed or changed
    PASS | F1 no ZZTEST test data in the file to publish | ZZTEST appears 0 times
    PASS | F5 no new outside addresses (same 3D library and font) | ['cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'fonts.googleapis.com', 'fonts.googleapis.com/css2', 'fonts.gstatic.com']
[stage counts: running]
[stage counts: done in 80 s]
    PASS | A3 everything in the live game is still in the new one, by name | 57 lists, 676 things before, 685 after; grew: {"places": "20 -> 21", "furniture": "54 -> 55", "furniture_for_sale": "32 -> 33", "friends_lane_plots": "6 -> 12"}
    PASS | E1 no more drawing work than before, area by area (more than 10% needs your OK) | 25 areas, 1305 pieces, 994508 triangles in total | for information, seen from 5 spots: city 127 draws; home 34 draws; market 50 draws; cafe 44 draws; school 44 draws
[stage saves: running]
[stage saves: done in 233 s]
    FAIL | B1 saved games from older versions load in the new one with nothing lost | 7 saves tried: save-71f43ad.json: name 'ZZTEST-71F43A', coins 120, furniture 3, pets 0; 1 differences: pid: "umuzy7limnanuj" -> "umuzy7t1w7heaq"; new version saves under the same key: yes | save-8a198
    PASS | B2 the new version keeps the same save key | key cozytown-save-1
[stage players: running]
[stage players: done in 36 s]
    PASS | D1 two players see each other, see each other walk, and chat (old + new version together) | A (old version, iPad) sees B: True; B (new version, PC) sees A: True; A saw B walk: True; chat tap ok, B saw: '⭐ ZZTEST-A: 👋 Hi!' + bubble
    PASS | D2 Friends Lane: each player gets a house | Friends Lane houses taken: A sees 2, B sees 2 (need 2 each)
    PASS | D3 visiting a friend's house works: knock, let in, go inside | B knocked from the phone (ok/ok/ok); ding-dong card on A: yes, tapped ok; B ended up in: visit
[stage claude: running]
[stage claude: done in 22 s]
    PASS | C7 the Claude version starts, plays the opening and goes online (test room) | opening played: True; online: on
[stage crawl_ipad-landscape_hud: running]
[stage crawl_ipad-landscape_hud: done in 354 s]
[stage teacher_iphone-landscape: running]
[stage teacher_iphone-landscape: done in 75 s]
[stage pc_keys: running]
[stage pc_keys: done in 25 s]
    PASS | K1 PC keyboard: walk with keys, P phone, B bag, M map, Escape closes, E uses | W key: moved 2.0 m in 1.5 s; phone: opens True, Escape closes True; bag: opens True, Escape closes True; map: opens True, Escape closes True; E on the market door goes in: True
[partial run: some stages skipped by --only]
WEBPART-ROUNDTRIP: identical
```
`python3 $SP/tools/b1.py $SP/runs/job12m-b`:
```
B1 FAIL | only pid differences: YES | saves: 7 | same key yes: 7
```
A2 "no backup given" is normal for a quick check; B1 is tonight's known pid-only difference.
The crawl and teacher stages print no summary line in a quick check; from their stage files: crawl_ipad-landscape_hud 156 taps tested,
0 dead, 0 stuck, 0 covered, 0 unreachable, 0 layout issues, 0 browser errors ("🗑️ Start a new game" was tapped 5 times: each time the
new card opened and the test game was never erased); teacher_iphone-landscape 0 layout issues, 0 browser errors; pc_keys 0 browser errors.
