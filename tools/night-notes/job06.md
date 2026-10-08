# Job 6: Away or offline

Only `index.html` changed: about 40 lines in the main game script, plus a few CSS rules added to the end of an existing CSS line, so no lines were added above the game script. No save changes, no new drawings, and the web part is untouched.

## Changes
- Doing nothing while playing: nothing happened -> after 3 minutes with no tap, click, key or scroll, a "ding" plays, the game dims and a card says "Still there? 👀" / "Tap anywhere to keep playing", with a big "I'm here!" button. Any tap anywhere or any key closes it and you play on. A key that closes the card does only that (Escape does not also close an open bag, B does not also open the bag).
- Still nothing 30 seconds later: you stayed in the game forever -> the game saves (on the device, and in the cloud inside Claude) and goes to the title screen. The title says "You took a break, so we saved your game. 💤" and shows a Play button.
- Play on that title: (did not exist) -> you carry on exactly where you were: same place, same job, same pets, same open shop or bag. Nothing is built twice. If you were in the clothes creator (the opening's "make your look", or the mirror), it stays as it was: the buttons bar (coins, phone, bag) stays hidden until you tap "That's me!" or Cancel. You get "Welcome back, (name)! 💗".
- Holding the joystick (walking without lifting your finger) counts as playing. Holding a key counts too, because a held key keeps repeating.
- A hidden tab (the iPad put away, another app open) does not count as doing nothing. The game already saves when it is hidden.
- Playing together: while your "Still there?" card is up, your friends' games know you are away (one new small online field, "aw", which is optional, and old versions ignore it). An away player does not count for "everyone in bed", so the night can skip without them. When you go to the title screen you leave the online world, and friends see "👋 (name) left.". Play brings you back, and friends see "(name) is here!".
- Internet lost: before, nothing happened (friends just froze or vanished) -> now, if you were online and the connection drops, the game dims and a card says "📡 Reconnecting…" / "The internet went away. Hold on, we are looking for it!". The connection counts as dropped when: the iPad goes offline, the GitHub version's online connection (Firebase) drops, or the Claude version's friends room drops.
  - If it comes back within 20 seconds: the card goes away, "🟢 Back online!" shows, and you play on. Friends come back the same way as before.
  - While the card is up, the game looks for the friends room again every 3 seconds (before: it waited 4, then 10, 20, 40, 60 seconds between tries). After a good connection, the wait goes back to the short one. Before this fix, the third or fourth short hiccup in one session always ended on the title, even when the internet was back at once.
  - If it does not come back: the game saves and goes to the title screen with "Your internet connection was lost 😢". Tap Play to keep playing alone. When the internet comes back, your friends come back.
- Playing offline from the start: no change (no card, never sent to the title for that).
- Keys on that title: Space, Enter and E no longer reach a pet show or claw machine paused underneath; Enter presses Play.
- The "took a break" message keeps the 💤 on the same line as the last word.
- Dark mode: the "Still there?" / "Reconnecting…" card now dims the game more and has a light peach border, so it stands out over an open dark bag or shop (light mode unchanged).
- Title screen after a break or a lost connection: the small line "Your own little life in the city" is replaced by the message, and the Settings button is hidden there (you can still open Settings with ⚙️ after Play). Indoors, the title shows the room you were in. Outdoors, the camera circles the town as usual.
- While you are on that title, the game no longer tries to reconnect to friends in the background. It waits until you tap Play.

## Decisions
- Going to the title screen is a pause, not a page reload. Reloading a web page with no internet shows the browser's "no internet" page instead of the game (the game has no offline copy), so the game stays loaded. Play carries on where you were, and nothing is set up twice (pets, friends, timers).
- On the "took a break" title, the Settings button is hidden. The game is paused underneath (an open bag or shop stays open), and opening Settings there would replace that open card. Settings is one tap away after Play.
- The "Reconnecting…" card dims the game and blocks taps while it waits. The game clock keeps running underneath.
- The 3 minutes, 30 seconds and 20 seconds are counted with the game's own frame time, as decided. On a very slow device (under 20 frames a second) they can take a little longer in real time.
- Short internet hiccups (for example, coming back to the iPad after a while) may flash "📡 Reconnecting…" for a moment, then "🟢 Back online!". I kept this rather than hiding the card for the first seconds, so the card always shows straight away when the internet goes.
- Cut-scenes and open menus still count as doing nothing (as decided).
- Tapping the "Still there?" card closes it when the finger lifts, not when it touches. That way the same tap can't also press a game button underneath the card.

## Morning questions
- After a break, Play carries on exactly where you were (it does not start fresh from the last save). OK?
- The Settings button is hidden on the "took a break" title. OK?
- Do you want the small "🟢 Back online!" message after a short hiccup, or no message?
- Should friends who are away show something (for example 💤 over their head)? Not done: right now they just stand still.

## Not verified
- Real internet loss on real devices: airplane mode on an iPad or iPhone, with real Firebase. The tests used a pretend server: Firebase's "connected" signal was switched off and on by the test, and the browser was put offline.
- The Claude version's real friends room: whether it tells the game when the connection is lost. The test called the game's own "connection lost" step directly. If the real room never reports it, only "device offline" triggers the card there.
- Whether the cloud save inside Claude finishes when the internet is already gone. It keeps retrying on its own, as before.
- The sound of the "ding", and the feel on real devices.
- Whether the real Firebase rules accept the new small online field "aw". If the rules allow only a fixed list of fields, please check once with two real devices.

## Glitches not fixed
- A toast (for example "🟢 You are online!") that is still showing can sit on top of the "Still there?" card for its last seconds (seen in an iPhone dark screenshot). It goes away by itself, and the card's button stays tappable.
- If you go to the title while visiting a friend's house, then tap Play, you may be sent outside with "(friend) left the game, so you head outside." The friend is fine; your game just did not see them come back within 2 seconds. This uses the visiting rules from before.
- While you are on the title, a connection try that was already running when you left may finish in the background. It is dropped at once (nothing is sent to friends).
- (Not from this job) On iPhone sideways, the joystick ring sits in the middle at the bottom in test screenshots. It is the same in the pre-night game.

## Try it for real
- Open the mirror ("Change my look") and wait about 3.5 minutes. Tap Play: you are still in the mirror, with no buttons bar on top. Tap "That's me!": the bar is back.
- Play and put the iPad down for 3 minutes: a ding and "Still there? 👀". Tap anywhere: it goes away and you play on.
- Put it down for about 3.5 minutes: the title says "You took a break, so we saved your game. 💤". Tap Play: you are right where you were, pets too.
- Two devices online at 22:00: the first goes to bed, and the second doesn't touch anything for 3 minutes. When "Still there?" shows on the second, the night skips on the first.
- While playing online, turn on airplane mode: "📡 Reconnecting…". Turn it off within 20 seconds: "🟢 Back online!" and you play on.
- Keep airplane mode on for more than 20 seconds: the title says "Your internet connection was lost 😢". Tap Play: you keep playing alone. Turn the internet back on: friends come back.
- Start the game in airplane mode and play: no "Reconnecting" card, the same as before.

## Tests run
After the review fixes (agent-tests/job6-fix1):
- Syntax check (jscheck): ok. Lines above the game script: unchanged (546).
- f1 (27/27 PASS, 0 errors): Claude version, 5 room drops in a row each came back after about 4 s (before: the 3rd or 4th ended on the title); a 12 s outage where the room could not be reached came back 4 s after the room returned (well inside 20 s). Clothes creator open -> break -> Play: the creator is still there and the buttons bar stays hidden; "That's me!" brings the bar back; outdoors the bar comes back on Play as before. PC: Escape closes only the card (bag stays open); B closes only the card; the next B opens the bag. Away title: Space does not reach a pet show cut-scene; Enter on Play carries on. Screenshots: iPhone upright dark "Still there?" over the bag (clearly stands out now), iPad title light/dark (💤 on the same line); layout audit clean.
- t1 again (35/35 PASS, 0 errors; the test now resets the idle timer when it shortens the wait). t2 again: all PASS except the old two-player night-skip check, which is a timing problem of that test (the newer t2c covers it). t2c again: 10/10 PASS, 0 errors.
- Night check stages: files (F1, F3a, F5) PASS, web part round trip identical, HUD crawl on iPad: 61 screens, 145 taps, nothing dead, unreachable, stuck or covered, layout clean, 0 errors. B1 (6 old saves, 0 differences), B2, D1-D3 (old + new player together, Friends Lane, knock -> let in -> inside), K1 (PC keys): all PASS.
Before the review fixes:
- Syntax check (jscheck): ok. Lines above the game script: unchanged (546).
- t1 (iPad, rich save, GitHub version, wait times shortened in the test page only): no card before the time is up; "Still there? 👀" card with "I'm here!" after it; the online info says away (aw:1) and is cleared after "I'm here!"; a key closes the card; a tap anywhere closes it; a held joystick counts as playing; 30 s later: title with the exact message, Play button ready, left the online world, save written on exit (coins the same, newer time). Stays on the title. Play: carries on, still 3 pets and the same number of things in the 3D scene (nothing doubled), back online. 23/23 PASS, 0 errors.
- t1 lost internet (iPad, GitHub version): online at start; Firebase drop -> "📡 Reconnecting…" card; still waiting at 5 s; back -> card gone, "🟢 Back online!"; device offline -> card; still playing at 19 s; at 20 s -> title with exactly "Your internet connection was lost 😢"; Play while still offline -> plays alone, no card, keeps going for 10 s; internet back -> online again. All PASS, 0 errors.
- t2 new player's opening on iPhone upright: opening done; "Still there?" card; title with the message; Play again works; layout audit clean; 0 errors.
- t2 the very first version's save (fixture old) on iPhone sideways: loads with nothing lost; after the break the saved game still has every old field with the same value; Play again works; layout audit clean; 0 errors.
- t2 Claude version (pretend room): room lost -> "Reconnecting…"; the room comes back by itself (about 4 s) -> card gone; lost again and not back -> title with the exact message; no reconnect while on the title (waited 5 s); Play -> online again. All PASS, 0 errors.
- t2c two players (iPad rich save + iPhone new player, GitHub version): A sees B as active; A in bed, B up -> "1 of 2", no skip; B gets "Still there?" -> A sees B as away (not active) and the night skips to 7:00 the next day; B taps "I'm here!" -> active again; B goes to the title -> B is gone from A's world; B taps Play -> back in A's world. 10/10 PASS, 0 errors on both.
- t3: the joystick spot on iPhone sideways is the same in the pre-night game and in the new file; the "Reconnecting…" card on iPhone sideways: audit clean, 0 errors.
- Screenshots checked: "Still there?" card (iPad light/dark, iPhone upright light/dark), "Reconnecting…" (iPad light/dark, iPhone sideways), the title with each message (iPad light/dark, iPhone upright light/dark, iPhone sideways light/dark). Everything fits; the message box reads well in light and dark mode.
- Night check stages on the final file (runcheck job6-check): F1, F3a, F5, web part round trip identical, B1 (6 old saves including the very first version: 0 differences), B2 (same save key), D1–D3 (old + new player: see each other, walk, chat, Friends Lane houses, knock -> let in -> inside), K1 (PC keys): all PASS. HUD crawl on iPad: 61 screens, nothing dead, unreachable, stuck or covered, layout clean, 0 errors. (A2 "backup" is only given in the full night check.)
